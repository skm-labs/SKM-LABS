-- ─────────────────────────────────────────────────────────────────────────────
-- skm.labs — Bookings schema
-- Run in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.bookings (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),

  -- Status flow: pending → confirmed → declined → completed
  status                text not null default 'pending',

  -- Client info
  client_name           text not null,
  client_email          text not null,
  client_phone          text,
  client_intro          text not null,   -- brief intro about themselves

  -- Project info (from contract fields)
  service               text not null,
  project_name          text not null,
  project_specifications text not null,

  -- Deliverable dates (client's target dates — filled in form)
  prototype_due_date    date,
  source_code_due_date  date,
  hardware_due_date     date,
  documentation_due_date date,
  hardware_name         text,

  -- Budget / payment
  project_fee           numeric(12,2),
  payment_notes         text,

  -- Meeting slot
  meeting_date          date not null,
  meeting_time          text not null,   -- e.g. "19:00"

  -- Contract tracking
  contract_sent         boolean not null default false,
  contract_sent_at      timestamptz,
  contract_notes        text             -- Marc's notes before sending
);

-- RLS
alter table public.bookings enable row level security;

-- Anyone can insert (public booking form)
create policy "anyone can create booking"
  on public.bookings for insert
  to anon
  with check (true);

-- Only authenticated (Marc) can read and update
create policy "owner can read bookings"
  on public.bookings for select
  to authenticated
  using (true);

create policy "owner can update bookings"
  on public.bookings for update
  to authenticated
  using (true);
