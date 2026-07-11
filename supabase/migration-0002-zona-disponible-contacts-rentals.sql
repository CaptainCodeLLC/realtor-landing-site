-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Safe to run on the live production database: no data is dropped or rewritten,
-- only constraints loosened and new columns/table added.
--
-- Wrapped in an explicit transaction so this applies all-or-nothing -- if any
-- statement below fails, everything rolls back instead of partially applying.

begin;

-- 1) zona: free text instead of a fixed 3-value list.
alter table public.properties drop constraint if exists properties_zona_check;

-- 2) operacion: allow a third value for short-term ("renta_temporal") vs
--    long-term ("renta") rentals.
alter table public.properties drop constraint if exists properties_operacion_check;
alter table public.properties
  add constraint properties_operacion_check check (operacion in ('venta', 'renta', 'renta_temporal'));

-- 3) disponible: lets the admin hide rented/sold inventory from the public
--    site without deleting it. Defaults to true so existing rows stay visible.
alter table public.properties add column if not exists disponible boolean not null default true;

-- 4) property_contacts: owner contact info (nombre/telefono/correo), kept out
--    of the properties table on purpose. RLS is enabled with NO policy for
--    anon/authenticated, so this table is only readable via the service-role
--    key used server-side by the app -- never by the public anon key.
create table if not exists public.property_contacts (
  property_id text primary key references public.properties(id) on delete cascade,
  nombre text not null default '',
  telefono text not null default '',
  correo text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.property_contacts enable row level security;
-- Intentionally no policies for anon/authenticated. Only the service role
-- (which bypasses RLS entirely) can read or write this table.

commit;

-- Ask PostgREST to pick up the new column/table immediately instead of
-- waiting for its own schema-change detection.
notify pgrst, 'reload schema';

-- Verification: run this after the block above to confirm both changes
-- landed. Expect one row, with disponible_exists = true and
-- contacts_table_exists = true.
select
  exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'properties' and column_name = 'disponible'
  ) as disponible_exists,
  exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'property_contacts'
  ) as contacts_table_exists;
