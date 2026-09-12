"""CLI: ingest one verified public government PDF into BhuNirnay RAG."""

import argparse
from pathlib import Path

from app.config import Settings
from app.services.rag import RagService


def main() -> None:
    parser = argparse.ArgumentParser(description="Ingest a permitted public government PDF into Supabase RAG.")
    parser.add_argument("pdf_path", type=Path)
    parser.add_argument("--title", required=True)
    parser.add_argument("--type", required=True, choices=["research_paper", "policy_paper", "dataset", "case_study", "legal_document", "guideline", "report"])
    parser.add_argument("--organization", required=True)
    parser.add_argument("--source-url", required=True)
    parser.add_argument("--tags", required=True, help="Comma-separated tags, for example: dilrmp,land-records,policy")
    parser.add_argument("--state")
    parser.add_argument("--district")
    args = parser.parse_args()

    result = RagService(Settings.from_environment()).ingest_pdf(
        pdf_path=args.pdf_path,
        title=args.title,
        document_type=args.type,
        source_organization=args.organization,
        source_url=args.source_url,
        tags=[tag.strip() for tag in args.tags.split(",") if tag.strip()],
        state=args.state,
        district=args.district,
        progress=lambda completed, total: print(f"Embedded {completed}/{total} chunks", flush=True),
    )
    print(f"Ingested {result['document_id']}: {result['pages']} pages, {result['chunks']} chunks, status={result['status']}")


if __name__ == "__main__":
    main()
