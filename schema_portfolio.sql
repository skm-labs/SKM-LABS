-- ─────────────────────────────────────────────────────────────────────────────
-- skm.labs — Portfolio / Work gallery schema
-- Append this to your existing schema.sql and run in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  -- Content
  title         text not null,
  slug          text not null unique,          -- URL-safe identifier e.g. "delta-robot-arm"
  description   text not null,                 -- Short summary shown on card
  body          text,                          -- Long-form markdown for detail page (future)

  -- Categorisation
  service       text not null,                 -- '3d_printing' | 'modeling' | 'prototyping' | 'research' | 'commissions'
  tags          text[] not null default '{}',  -- e.g. ['FDM','PETG','Enclosure']

  -- Media
  cover_image   text,                          -- Storage path or external URL
  images        text[] not null default '{}',  -- Additional images for detail page

  -- Display
  featured      boolean not null default false, -- Shows in hero slot
  published     boolean not null default true,
  sort_order    int not null default 0          -- Lower = appears first
);

-- RLS
alter table public.projects enable row level security;

-- Anyone can read published projects
create policy "public can read published projects"
  on public.projects for select
  to anon
  using (published = true);

-- Only authenticated (you) can insert / update / delete
create policy "owner can manage projects"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed data — replace cover_image values once you have real photos
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.projects (title, slug, description, service, tags, cover_image, featured, sort_order) values
  (
    'Delta Robot Arm',
    'delta-robot-arm',
    'Full parametric delta-geometry robotic arm designed in Fusion 360 and printed in PETG. End-effector swappable for pen, laser, or pick-and-place toolheads.',
    '3d_printing',
    ARRAY['FDM','PETG','Fusion 360','Robotics'],
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    true,
    0
  ),
  (
    'Custom RC Car Chassis',
    'rc-car-chassis',
    'Short-run prototype chassis for a 1/10 scale RC build. Toleranced for press-fit bearings and snap-fit body panels.',
    'prototyping',
    ARRAY['FDM','ABS','Prototyping','RC'],
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    false,
    1
  ),
  (
    'Structural Load Analysis',
    'structural-load-analysis',
    'Finite element feasibility study for a bracket assembly used in agricultural machinery. Delivered as a documented PDF report.',
    'research',
    ARRAY['FEA','Simulation','Documentation'],
    'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&q=80',
    false,
    2
  ),
  (
    'Parametric Phone Mount',
    'parametric-phone-mount',
    'Fully parametric desk mount modeled in Fusion 360. Dimensions driven by a single parameter table — client reprints for any phone size.',
    'modeling',
    ARRAY['Fusion 360','Parametric','FDM','PLA'],
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    false,
    3
  ),
  (
    'Resin Keycap Commission',
    'resin-keycap-commission',
    'Batch of 12 custom artisan keycaps in translucent resin with embedded pigment inclusions. Each cap individually post-processed and UV-cured.',
    'commissions',
    ARRAY['Resin','SLA','Custom','Keycaps'],
    'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&q=80',
    false,
    4
  ),
  (
    'Ventilation Duct Adapter',
    'ventilation-duct-adapter',
    'Custom transition piece bridging two non-standard duct diameters in an HVAC retrofit. Printed in ASA for heat and UV resistance.',
    '3d_printing',
    ARRAY['FDM','ASA','Functional','HVAC'],
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
    false,
    5
  );
