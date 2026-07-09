create table if not exists public.properties (
  id text primary key,
  titulo text not null,
  operacion text not null check (operacion in ('venta', 'renta')),
  tipo text not null,
  zona text not null check (zona in ('Boca del Rio', 'Alvarado', 'Veracruz')),
  precio numeric not null default 0,
  moneda text not null check (moneda in ('MXN', 'USD')),
  ubicacion jsonb not null,
  recamaras numeric not null default 0,
  banos numeric not null default 0,
  estacionamientos numeric not null default 0,
  superficie_construida numeric not null default 0,
  superficie_terreno numeric not null default 0,
  anio_construccion numeric not null default 0,
  descripcion text not null default '',
  amenidades text[] not null default '{}',
  imagenes text[] not null default '{}',
  destacado boolean not null default false,
  vistas integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text not null,
  email text not null default '',
  mudanza text not null default '',
  operacion text not null check (operacion in ('venta', 'renta')),
  tipo text not null,
  presupuesto text not null default '',
  mensaje text not null default '',
  property_id text references public.properties(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.properties enable row level security;
alter table public.leads enable row level security;

drop policy if exists "Public can read properties" on public.properties;
create policy "Public can read properties"
on public.properties
for select
to anon, authenticated
using (true);

create index if not exists properties_featured_price_idx
on public.properties (destacado desc, precio desc);

create index if not exists leads_created_at_idx
on public.leads (created_at desc);

create index if not exists leads_property_id_idx
on public.leads (property_id);
