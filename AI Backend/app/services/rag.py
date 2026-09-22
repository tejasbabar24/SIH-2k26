"""Government-document ingestion and grounded-answer services for BhuNirnay."""

from __future__ import annotations

import hashlib
import re
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Callable
from uuid import uuid4

from google import genai
from google.genai import types
from google.genai.errors import ClientError, ServerError
from pypdf import PdfReader
from supabase import Client, create_client

from app.config import Settings


class TemporaryGenerationUnavailable(RuntimeError):
    """Gemini could not generate an answer after bounded, quota-safe retries."""


@dataclass(frozen=True)
class ExtractedChunk:
    content: str
    chunk_index: int
    page_start: int
    page_end: int
    section_title: str | None = None


def extract_pdf_pages(pdf_path: Path) -> list[tuple[int, str]]:
    """Extract readable text page-by-page, preserving a citation page number."""
    reader = PdfReader(str(pdf_path))
    pages: list[tuple[int, str]] = []
    for page_number, page in enumerate(reader.pages, start=1):
        text = re.sub(r"\s+", " ", page.extract_text() or "").strip()
        if text:
            pages.append((page_number, text))
    if not pages:
        raise ValueError("No selectable text was found. Run OCR before ingesting this PDF.")
    return pages


def split_pages_into_chunks(pages: list[tuple[int, str]], target_chars: int = 3200, overlap_chars: int = 240) -> list[ExtractedChunk]:
    """Create citation-friendly chunks without mixing non-adjacent PDF pages."""
    chunks: list[ExtractedChunk] = []
    buffer = ""
    start_page: int | None = None
    end_page: int | None = None

    def flush() -> None:
        nonlocal buffer, start_page, end_page
        cleaned = buffer.strip()
        if cleaned and start_page is not None and end_page is not None:
            chunks.append(ExtractedChunk(cleaned, len(chunks), start_page, end_page))
        overlap = cleaned[-overlap_chars:] if cleaned else ""
        buffer = overlap
        start_page = end_page if overlap else None

    for page_number, text in pages:
        sentences = re.split(r"(?<=[.!?])\s+", text)
        for sentence in sentences:
            if not sentence:
                continue
            if start_page is None:
                start_page = page_number
            prospective = f"{buffer} {sentence}".strip()
            if len(prospective) > target_chars and buffer.strip():
                end_page = page_number
                flush()
                if start_page is None:
                    start_page = page_number
            buffer = f"{buffer} {sentence}".strip()
            end_page = page_number
    if buffer.strip() and start_page is not None and end_page is not None:
        chunks.append(ExtractedChunk(buffer.strip(), len(chunks), start_page, end_page))
    return chunks


class RagService:
    def __init__(self, settings: Settings):
        settings.validate_rag()
        self.settings = settings
        self.supabase: Client = create_client(settings.supabase_url, settings.supabase_secret_key)
        self.gemini = genai.Client(api_key=settings.gemini_api_key)

    def embed(self, text: str, task_type: str) -> list[float]:
        return self.embed_many([text], task_type)[0]

    def embed_many(self, texts: list[str], task_type: str, max_attempts: int = 5) -> list[list[float]]:
        """Embed a small batch to reduce API requests during source ingestion."""
        if not texts:
            return []
        for attempt in range(max_attempts):
            try:
                response = self.gemini.models.embed_content(
                    model=self.settings.embedding_model,
                    contents=texts,
                    config=types.EmbedContentConfig(
                        task_type=task_type,
                        output_dimensionality=self.settings.embedding_dimensions,
                    ),
                )
                break
            except ClientError as error:
                if getattr(error, "code", None) != 429 or attempt == max_attempts - 1:
                    raise
                # Gemini may return a short retry delay. Exponential backoff avoids
                # hammering a free-tier quota and remains bounded per wait.
                time.sleep(min(self.settings.rag_embed_delay_seconds * (2 ** attempt), 30))
        else:  # pragma: no cover - defensive; the loop either breaks or raises.
            raise RuntimeError("Embedding retries were exhausted.")
        embeddings = [list(item.values) for item in response.embeddings]
        if len(embeddings) != len(texts) or any(len(item) != self.settings.embedding_dimensions for item in embeddings):
            raise RuntimeError("Embedding response does not match the configured batch size or dimension.")
        return embeddings

    def ingest_pdf(
        self,
        pdf_path: Path,
        title: str,
        document_type: str,
        source_organization: str,
        source_url: str,
        tags: list[str],
        state: str | None = None,
        district: str | None = None,
        progress: Callable[[int, int], None] | None = None,
    ) -> dict:
        if not pdf_path.is_file() or pdf_path.suffix.lower() != ".pdf":
            raise ValueError("Provide an existing PDF file.")
        pages = extract_pdf_pages(pdf_path)
        chunks = split_pages_into_chunks(pages, target_chars=self.settings.rag_chunk_target_chars)
        if not chunks:
            raise ValueError("No chunks were created from this PDF.")

        file_bytes = pdf_path.read_bytes()
        checksum = hashlib.sha256(file_bytes).hexdigest()
        storage_path = f"government-sources/{checksum[:16]}-{pdf_path.name}"
        existing_response = self.supabase.table("documents").select("id,storage_path").eq("file_sha256", checksum).execute()
        existing = existing_response.data or []
        if existing:
            document = existing[0]
            storage_path = document["storage_path"]
        else:
            document_response = self.supabase.table("documents").insert({
                "title": title,
                "document_type": document_type,
                "status": "pending_review",
                "source_organization": source_organization,
                "source_url": source_url,
                "state": state,
                "district": district,
                "tags": tags,
                "storage_path": storage_path,
                "file_sha256": checksum,
                "file_mime_type": "application/pdf",
                "page_count": len(pages),
                "is_public": False,
            }).execute()
            document = document_response.data[0]
            self.supabase.storage.from_("source-documents").upload(
                path=storage_path,
                file=file_bytes,
                file_options={"content-type": "application/pdf", "upsert": "false"},
            )

        stored_response = self.supabase.table("document_chunks").select("chunk_index").eq("document_id", document["id"]).execute()
        stored_indices = {item["chunk_index"] for item in (stored_response.data or [])}
        missing_chunks = [chunk for chunk in chunks if chunk.chunk_index not in stored_indices]
        completed = len(stored_indices)
        if progress and completed:
            progress(completed, len(chunks))

        batch_size = self.settings.rag_embed_batch_size
        for start in range(0, len(missing_chunks), batch_size):
            batch = missing_chunks[start:start + batch_size]
            embeddings = self.embed_many([chunk.content for chunk in batch], "RETRIEVAL_DOCUMENT")
            records = []
            for chunk, embedding in zip(batch, embeddings, strict=True):
                records.append({
                    "document_id": document["id"],
                    "chunk_index": chunk.chunk_index,
                    "content": chunk.content,
                    "page_start": chunk.page_start,
                    "page_end": chunk.page_end,
                    "section_title": chunk.section_title,
                    "embedding": embedding,
                    "embedding_model": self.settings.embedding_model,
                })
            self.supabase.table("document_chunks").insert(records).execute()
            completed += len(batch)
            if progress:
                progress(completed, len(chunks))
            if completed < len(chunks) and self.settings.rag_embed_delay_seconds:
                time.sleep(self.settings.rag_embed_delay_seconds)
        return {"document_id": document["id"], "pages": len(pages), "chunks": len(chunks), "status": "pending_review"}

    def retrieve(self, question: str, match_count: int = 6) -> list[dict]:
        query_embedding = self.embed(question, "RETRIEVAL_QUERY")
        response = self.supabase.rpc("match_document_chunks", {
            "query_embedding": query_embedding,
            "match_count": match_count,
            "match_threshold": 0.55,
        }).execute()
        return response.data or []

    def generate_grounded_answer(self, prompt: str, max_attempts: int = 4) -> str:
        """Retry transient Gemini failures without manufacturing an answer."""
        for attempt in range(max_attempts):
            try:
                generated = self.gemini.models.generate_content(
                    model=self.settings.generation_model,
                    contents=prompt,
                    config=types.GenerateContentConfig(temperature=0.15, max_output_tokens=700),
                )
                return generated.text or "The model returned an empty response."
            except (ClientError, ServerError) as error:
                if getattr(error, "code", None) not in (429, 503) or attempt == max_attempts - 1:
                    if getattr(error, "code", None) in (429, 503):
                        raise TemporaryGenerationUnavailable from error
                    raise
                # This is deliberately bounded: 4, 8 and 16 seconds by default.
                # It keeps free-tier requests polite and avoids an infinite wait.
                time.sleep(min(self.settings.rag_embed_delay_seconds * (2 ** attempt), 30))
        raise RuntimeError("Generation retries were exhausted.")

    def answer(self, question: str) -> dict:
        matches = self.retrieve(question)
        if not matches:
            return {
                "answer": "I could not find enough approved government-source evidence to answer this question. Please refine the question or add verified documents.",
                "confidence": 0.0,
                "sources": [],
            }
        evidence = "\n\n".join(
            f"[Document: {match['title']} | Pages: {match['page_start']}-{match['page_end']}]\n{match['content']}"
            for match in matches
        )
        prompt = f"""You are BhuNirnay, an evidence-based land-governance research assistant.
Answer the user's question using only the provided government-source evidence.
If the evidence is incomplete, say so clearly. Do not invent statistics, laws, policy outcomes, or sources.
Use short, clear language. Cite each factual statement using exactly this format:
[Document title, pp. pageStart-pageEnd]. Do not use generic labels such as [Source 1].

Question: {question}

Evidence:
{evidence}
"""
        unique_sources: dict[str, dict] = {}
        for match in matches:
            unique_sources.setdefault(match["document_id"], {
                "id": match["document_id"],
                "title": match["title"],
                "sourceUrl": match["source_url"],
                "pageStart": match["page_start"],
                "pageEnd": match["page_end"],
                "pageRanges": [],
                "similarity": round(float(match["similarity"]), 3),
            })
            page_range = {"pageStart": match["page_start"], "pageEnd": match["page_end"]}
            if page_range not in unique_sources[match["document_id"]]["pageRanges"]:
                unique_sources[match["document_id"]]["pageRanges"].append(page_range)
        result = {
            "confidence": round(sum(float(item["similarity"]) for item in matches) / len(matches), 3),
            "sources": list(unique_sources.values()),
            "generationStatus": "ready",
        }
        try:
            result["answer"] = self.generate_grounded_answer(prompt)
        except TemporaryGenerationUnavailable:
            # Retrieval succeeded. Keep that auditable evidence visible instead of
            # returning a fake answer or concealing useful citations behind a 503.
            result["answer"] = (
                "Verified government-source evidence was retrieved, but the AI answer "
                "generator is temporarily rate-limited. Please retry shortly; the sources "
                "below remain available for review."
            )
            result["generationStatus"] = "rate_limited"
        return result
