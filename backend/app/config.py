"""Configuration loader. Secrets are read only from the backend environment."""

import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    supabase_url: str
    supabase_secret_key: str
    gemini_api_key: str
    embedding_model: str
    embedding_dimensions: int
    generation_model: str
    rag_chunk_target_chars: int
    rag_embed_batch_size: int
    rag_embed_delay_seconds: float
    frontend_origins: list[str]
    frontend_origin_regex: str

    @classmethod
    def from_environment(cls) -> "Settings":
        return cls(
            supabase_url=os.getenv("SUPABASE_URL", "").strip(),
            supabase_secret_key=os.getenv("SUPABASE_SECRET_KEY", "").strip(),
            gemini_api_key=os.getenv("GEMINI_API_KEY", "").strip(),
            embedding_model=os.getenv("EMBEDDING_MODEL", "gemini-embedding-001").strip(),
            embedding_dimensions=int(os.getenv("EMBEDDING_DIMENSIONS", "768")),
            generation_model=os.getenv("GENERATION_MODEL", "gemini-3.7-flash").strip(),
            rag_chunk_target_chars=int(os.getenv("RAG_CHUNK_TARGET_CHARS", "3200")),
            rag_embed_batch_size=int(os.getenv("RAG_EMBED_BATCH_SIZE", "1")),
            rag_embed_delay_seconds=float(os.getenv("RAG_EMBED_DELAY_SECONDS", "4")),
            frontend_origins=[
                origin.strip()
                for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:5173").split(",")
                if origin.strip()
            ],
            # Allows Vercel preview deployments while exact production domains can
            # still be listed explicitly in FRONTEND_ORIGINS.
            frontend_origin_regex=os.getenv("FRONTEND_ORIGIN_REGEX", r"https://.*\\.vercel\\.app").strip(),
        )

    def validate_rag(self) -> None:
        missing = [
            name for name, value in {
                "SUPABASE_URL": self.supabase_url,
                "SUPABASE_SECRET_KEY": self.supabase_secret_key,
                "GEMINI_API_KEY": self.gemini_api_key,
            }.items() if not value
        ]
        if missing:
            raise RuntimeError(f"Missing backend environment variables: {', '.join(missing)}")
        if self.embedding_dimensions != 768:
            raise RuntimeError("EMBEDDING_DIMENSIONS must remain 768 to match the Supabase vector schema.")
        if self.rag_chunk_target_chars < 800 or self.rag_embed_batch_size < 1 or self.rag_embed_delay_seconds < 0:
            raise RuntimeError("RAG chunk and embedding-batch settings are invalid.")
