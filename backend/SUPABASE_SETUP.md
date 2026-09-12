# Supabase setup - BhuNirnay

## 1. Create the project

Create a Supabase project, then open **SQL Editor** and run the migration files in numerical order as single scripts.

`0001_core_schema.sql` enables `vector` and `postgis`, creates the private `source-documents` storage bucket, adds RLS policies, and exposes `match_document_chunks` for the RAG retrieval layer. `0002_backend_service_grants.sql` gives the backend-only Supabase service role the database permissions it needs while browser users remain governed by RLS.

## 2. Secrets

Keep these values in `backend/.env`, never in Git or the frontend:

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=replace_me
GEMINI_API_KEY=replace_me
```

The frontend may only have its own `VITE_SUPABASE_URL` and publishable key after authentication UI is added. It must never receive `SUPABASE_SECRET_KEY` or any AI-provider key.

## 3. First administrator

Create the first user in Supabase Auth, then run this SQL after substituting the new user's UUID:

```sql
update public.profiles
set role = 'administrator'
where id = 'USER_UUID_HERE';
```

## 4. RAG ingestion sequence

1. Upload a permitted public source file to the private `source-documents` bucket.
2. Insert its provenance in `documents` with `status = 'pending_review'`.
3. Extract text, split into chunks, generate 768-dimension Gemini embeddings, and insert rows in `document_chunks`.
4. An administrator reviews provenance and marks the document `approved`.
5. The assistant calls `match_document_chunks`; only approved content can be retrieved.

## Security notes

- Source files remain private. The backend generates short-lived signed links for an authorised user.
- The Supabase secret key is backend-only because it bypasses Row Level Security.
- Never ingest personal land records, Aadhaar information, or any restricted/non-public government material.
