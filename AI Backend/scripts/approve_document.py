"""CLI: record administrator approval for a verified RAG source."""

import argparse
from datetime import datetime, timezone

from app.config import Settings
from app.services.rag import RagService


def main() -> None:
    parser = argparse.ArgumentParser(description="Approve a verified BhuNirnay source document.")
    parser.add_argument("document_id")
    parser.add_argument("--public", action="store_true", help="Allow public metadata access; source files remain private.")
    args = parser.parse_args()

    service = RagService(Settings.from_environment())
    administrators = service.supabase.table("profiles").select("id").eq("role", "administrator").limit(1).execute().data or []
    if not administrators:
        raise RuntimeError("No administrator profile exists. Promote an approved user before approving sources.")
    result = service.supabase.table("documents").update({
        "status": "approved",
        "approved_by": administrators[0]["id"],
        "approved_at": datetime.now(timezone.utc).isoformat(),
        "is_public": args.public,
    }).eq("id", args.document_id).eq("status", "pending_review").execute()
    if not result.data:
        raise RuntimeError("Document was not pending review or does not exist.")
    print(f"Approved document {args.document_id}; public_metadata={args.public}.")


if __name__ == "__main__":
    main()
