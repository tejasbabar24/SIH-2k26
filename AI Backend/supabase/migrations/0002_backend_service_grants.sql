-- BhuNirnay: allow the secure backend service account to run RAG and admin jobs.
-- The service_role bypasses RLS but remains backend-only; never expose its secret key.

grant usage on schema public to service_role;
grant all privileges on table
  public.profiles,
  public.documents,
  public.document_chunks,
  public.districts,
  public.land_indicators,
  public.research_projects,
  public.policy_simulations,
  public.audit_logs
to service_role;

grant usage, select on all sequences in schema public to service_role;
grant execute on function public.match_document_chunks(vector, integer, float) to service_role;
