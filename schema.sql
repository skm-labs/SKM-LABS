-- ─────────────────────────────────────────────────────────────────────────────
-- skm.labs — Supabase schema
-- Run this in your Supabase project: Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. contacts table (simple contact form submissions)
create table if not exists public.contacts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  service     text,          -- '3d_printing' | 'modeling' | 'prototyping' | 'research' | 'commissions' | 'other'
  budget      text,          -- budget range string e.g. '500-1000'
  message     text not null
);

-- 2. commissions table (detailed intake wizard submissions)
create table if not exists public.commissions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  status          text not null default 'new',  -- 'new' | 'reviewing' | 'quoted' | 'accepted' | 'declined' | 'complete'

  -- Step 1: About you
  name            text not null,
  email           text not null,
  handle          text,          -- company, studio, or social handle

  -- Step 2: The project
  service         text not null, -- service type
  description     text not null,
  dimensions      text,          -- e.g. "150mm x 80mm x 40mm"
  materials       text,          -- e.g. "PETG, heat resistant"
  reference_urls  text[],        -- array of URLs or storage paths

  -- Step 3: Scope
  budget          text,          -- budget range
  deadline        date,          -- target delivery date
  referral        text           -- how they found you
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.contacts    enable row level security;
alter table public.commissions enable row level security;

-- Allow anonymous INSERT (public form submissions)
create policy "anyone can submit contact"
  on public.contacts for insert
  to anon
  with check (true);

create policy "anyone can submit commission"
  on public.commissions for insert
  to anon
  with check (true);

-- Only authenticated users (you) can read submissions
create policy "owner can read contacts"
  on public.contacts for select
  to authenticated
  using (true);

create policy "owner can read commissions"
  on public.commissions for select
  to authenticated
  using (true);

create policy "owner can update commissions"
  on public.commissions for update
  to authenticated
  using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Storage bucket for commission reference files
-- ─────────────────────────────────────────────────────────────────────────────

-- Run this separately in the Supabase dashboard under Storage → New bucket
-- Or uncomment and run here if your Supabase version supports it:

-- insert into storage.buckets (id, name, public)
-- values ('commission-refs', 'commission-refs', false);

-- create policy "anon can upload refs"
--   on storage.objects for insert
--   to anon
--   with check (bucket_id = 'commission-refs');

-- create policy "owner can read refs"
--   on storage.objects for select
--   to authenticated
--   using (bucket_id = 'commission-refs');
