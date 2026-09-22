# BhuNirnay backend

FastAPI service for the SIH prototype. It currently returns deterministic demo data using the same request and response contract supplied to the frontend team. The data layer can later be replaced with PostgreSQL/PostGIS and a vector-search service without changing the routes.

## Run locally

```powershell
cd "AI Backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Interactive API documentation is then available at `http://localhost:8000/docs`.

## Ingest a verified government PDF

After configuring `backend/.env`, ingest only a public document whose source URL and reuse terms have been checked:

```powershell
python -m scripts.ingest_pdf "C:\path\to\source.pdf" --title "Document title" --type guideline --organization "Department of Land Resources" --source-url "https://official-source.example/document" --tags "dilrmp,land-records,policy"
```

Ingestion stores the file privately, extracts page-level text, creates Gemini embeddings, and writes pending-review chunks to Supabase. Progress is checkpointed after each embedding batch, so rerunning the same command resumes an interrupted ingestion. An administrator must approve provenance before the document is retrievable by RAG.

After verifying the source organization, URL, licence/reuse terms, and extracted content, approve it with:

```powershell
python -m scripts.approve_document DOCUMENT_UUID
```

## Production deployment

The React frontend can stay on Vercel. Deploy this FastAPI folder to a Python host such as Render, Railway, or a server you control; it must remain a separate server because it holds the Supabase secret and Gemini key.

Set these backend environment variables on that host (never in Vercel's frontend variables):

```text
SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
GEMINI_API_KEY=...
FRONTEND_ORIGINS=https://sih-2k26-alpha.vercel.app
# Optional only for temporary preview deployments; otherwise leave blank.
FRONTEND_ORIGIN_REGEX=
```

Use this start command:

```text
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Keep the Vercel project's **Root Directory** empty/default. This repository's root `vercel.json` builds `frontend` and publishes `frontend/dist`. Then add a production environment variable, rebuild, and redeploy:

```text
VITE_API_BASE_URL=https://your-backend-host.example/api/v1
```

`VITE_API_BASE_URL` is intentionally public; never add `SUPABASE_SECRET_KEY` or `GEMINI_API_KEY` to Vercel.
