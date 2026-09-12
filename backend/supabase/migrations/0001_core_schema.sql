-- BhuNirnay: core Supabase schema for documents, RAG, GIS, and role-based access.
-- Run this migration in Supabase SQL Editor or through the Supabase CLI.

create extension if not exists vector;
create extension if not exists postgis;

create type public.app_role as enum ('public_user', 'researcher', 'government_officer', 'administrator');
create type public.document_status as enum ('draft', 'pending_review', 'approved', 'rejected', 'archived');
create type public.document_type as enum ('research_paper', 'policy_paper', 'dataset', 'case_study', 'legal_document', 'guideline', 'report');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  institution text,
  role public.app_role not null default 'public_user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() in ('researcher', 'government_officer', 'administrator'), false)
$$;

create or replace function public.is_administrator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() = 'administrator', false)
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 5 and 300),
  document_type public.document_type not null,
  status public.document_status not null default 'draft',
  abstract text,
  source_organization text not null,
  source_url text check (source_url is null or source_url ~* '^https://'),
  source_published_at date,
  state text,
  district text,
  tags text[] not null default '{}',
  storage_path text unique,
  file_sha256 text unique,
  file_mime_type text,
  page_count integer check (page_count is null or page_count > 0),
  is_public boolean not null default false,
  uploaded_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint approved_document_requires_approval check (
    status <> 'approved' or (approved_by is not null and approved_at is not null)
  )
);

-- 768 dimensions are configured in the embedding provider. Do not change this
-- without creating a new embedding column and re-indexing every chunk.
create table public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  chunk_index integer not null check (chunk_index >= 0),
  content text not null check (char_length(content) > 0),
  page_start integer check (page_start is null or page_start > 0),
  page_end integer check (page_end is null or page_end >= page_start),
  section_title text,
  content_tsv tsvector generated always as (to_tsvector('english', content)) stored,
  embedding vector(768),
  embedding_model text,
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create index document_chunks_document_id_idx on public.document_chunks(document_id);
create index document_chunks_content_tsv_idx on public.document_chunks using gin(content_tsv);
create index document_chunks_embedding_hnsw_idx on public.document_chunks using hnsw (embedding vector_cosine_ops);
create index documents_search_idx on public.documents using gin (to_tsvector('english', title || ' ' || coalesce(abstract, '')));
create index documents_tags_idx on public.documents using gin (tags);

create table public.districts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state text not null,
  census_code text unique,
  geometry geography(multipolygon, 4326),
  centroid geography(point, 4326),
  population bigint check (population is null or population >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, state)
);

create index districts_geometry_idx on public.districts using gist (geometry);

create table public.land_indicators (
  id uuid primary key default gen_random_uuid(),
  district_id uuid not null references public.districts(id) on delete cascade,
  indicator_date date not null,
  land_dispute_risk numeric(5,2) check (land_dispute_risk between 0 and 100),
  climate_vulnerability numeric(5,2) check (climate_vulnerability between 0 and 100),
  land_use_change_percent numeric(7,2),
  infrastructure_score numeric(5,2) check (infrastructure_score between 0 and 100),
  policy_priority_score numeric(5,2) check (policy_priority_score between 0 and 100),
  source_document_id uuid references public.documents(id) on delete set null,
  source_url text check (source_url is null or source_url ~* '^https://'),
  created_at timestamptz not null default now(),
  unique (district_id, indicator_date)
);

create table public.research_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'proposed' check (status in ('proposed', 'active', 'completed', 'archived')),
  lead_user_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.policy_simulations (
  id uuid primary key default gen_random_uuid(),
  district_id uuid not null references public.districts(id) on delete restrict,
  intervention text not null,
  budget numeric(14,2) not null check (budget >= 0),
  coverage_percent numeric(5,2) not null check (coverage_percent between 0 and 100),
  time_horizon_years integer not null check (time_horizon_years between 1 and 20),
  result jsonb not null,
  assumptions jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.match_document_chunks(
  query_embedding vector(768),
  match_count integer default 8,
  match_threshold float default 0.55
)
returns table (
  chunk_id uuid,
  document_id uuid,
  title text,
  source_url text,
  content text,
  page_start integer,
  page_end integer,
  similarity float
)
language sql
stable
as $$
  select
    c.id,
    c.document_id,
    d.title,
    d.source_url,
    c.content,
    c.page_start,
    c.page_end,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.document_chunks c
  join public.documents d on d.id = c.document_id
  where d.status = 'approved'
    and c.embedding is not null
    and 1 - (c.embedding <=> query_embedding) >= match_threshold
  order by c.embedding <=> query_embedding
  limit least(greatest(match_count, 1), 20);
$$;

-- Automatically maintain update timestamps.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger set_profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger set_documents_updated_at before update on public.documents for each row execute procedure public.set_updated_at();
create trigger set_districts_updated_at before update on public.districts for each row execute procedure public.set_updated_at();
create trigger set_projects_updated_at before update on public.research_projects for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.districts enable row level security;
alter table public.land_indicators enable row level security;
alter table public.research_projects enable row level security;
alter table public.policy_simulations enable row level security;
alter table public.audit_logs enable row level security;

create policy "Users can view their own profile" on public.profiles for select using (id = auth.uid() or public.is_administrator());
-- Column privileges below prevent an end user from modifying the role field.
create policy "Users can update their own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Administrators manage profiles" on public.profiles for all using (public.is_administrator()) with check (public.is_administrator());

revoke update on public.profiles from anon, authenticated;
grant update (full_name, institution) on public.profiles to authenticated;

create policy "Public users see approved public documents" on public.documents for select using ((status = 'approved' and is_public) or public.is_staff());
create policy "Staff upload documents" on public.documents for insert with check (public.is_staff() and uploaded_by = auth.uid());
create policy "Staff edit their draft documents" on public.documents for update using (uploaded_by = auth.uid() and status in ('draft', 'pending_review')) with check (uploaded_by = auth.uid());
create policy "Administrators manage all documents" on public.documents for all using (public.is_administrator()) with check (public.is_administrator());

create policy "Users read chunks for accessible documents" on public.document_chunks for select using (exists (select 1 from public.documents d where d.id = document_id and ((d.status = 'approved' and d.is_public) or public.is_staff())));
create policy "Administrators manage chunks" on public.document_chunks for all using (public.is_administrator()) with check (public.is_administrator());

create policy "Districts are publicly readable" on public.districts for select using (true);
create policy "Administrators manage districts" on public.districts for all using (public.is_administrator()) with check (public.is_administrator());
create policy "Public indicators are readable" on public.land_indicators for select using (true);
create policy "Administrators manage indicators" on public.land_indicators for all using (public.is_administrator()) with check (public.is_administrator());

create policy "Users view their projects" on public.research_projects for select using (lead_user_id = auth.uid() or public.is_staff());
create policy "Staff create projects" on public.research_projects for insert with check (public.is_staff() and lead_user_id = auth.uid());
create policy "Project leads update projects" on public.research_projects for update using (lead_user_id = auth.uid() or public.is_administrator());

create policy "Users view their simulations" on public.policy_simulations for select using (created_by = auth.uid() or public.is_staff());
create policy "Authenticated users create simulations" on public.policy_simulations for insert with check (auth.uid() is not null and created_by = auth.uid());
create policy "Administrators read audit logs" on public.audit_logs for select using (public.is_administrator());

-- Private storage for source PDFs and datasets. The backend issues signed URLs only
-- after checking the user's role and document status.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('source-documents', 'source-documents', false, 52428800, array['application/pdf', 'text/csv', 'application/json', 'application/geo+json'])
on conflict (id) do nothing;

create policy "Staff upload source files" on storage.objects for insert to authenticated
with check (bucket_id = 'source-documents' and public.is_staff());
create policy "Staff read source files" on storage.objects for select to authenticated
using (bucket_id = 'source-documents' and public.is_staff());
create policy "Administrators manage source files" on storage.objects for all to authenticated
using (bucket_id = 'source-documents' and public.is_administrator())
with check (bucket_id = 'source-documents' and public.is_administrator());
