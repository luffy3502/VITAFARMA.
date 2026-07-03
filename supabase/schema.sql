create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text default 'Pill',
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories add column if not exists display_order integer not null default 0;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  brand text,
  category_id uuid not null references public.categories(id) on delete restrict,
  price numeric(10, 2) not null default 0,
  promotional_price numeric(10, 2),
  stock integer not null default 0,
  sku text,
  barcode text,
  main_image_url text,
  gallery_images text[] not null default '{}',
  video_url text,
  tags text[] not null default '{}',
  is_active boolean not null default true,
  is_offer boolean not null default false,
  is_new boolean not null default false,
  is_best_seller boolean not null default false,
  is_week_offer boolean not null default false,
  is_home_featured boolean not null default false,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists description text;
alter table public.products add column if not exists brand text;
alter table public.products add column if not exists category_id uuid references public.categories(id) on delete restrict;
alter table public.products add column if not exists price numeric(10, 2) not null default 0;
alter table public.products add column if not exists promotional_price numeric(10, 2);
alter table public.products add column if not exists stock integer not null default 0;
alter table public.products add column if not exists sku text;
alter table public.products add column if not exists barcode text;
alter table public.products add column if not exists main_image_url text;
alter table public.products add column if not exists gallery_images text[] not null default '{}';
alter table public.products add column if not exists video_url text;
alter table public.products add column if not exists tags text[] not null default '{}';
alter table public.products add column if not exists is_active boolean not null default true;
alter table public.products add column if not exists is_offer boolean not null default false;
alter table public.products add column if not exists is_new boolean not null default false;
alter table public.products add column if not exists is_best_seller boolean not null default false;
alter table public.products add column if not exists is_week_offer boolean not null default false;
alter table public.products add column if not exists is_home_featured boolean not null default false;
alter table public.products add column if not exists views integer not null default 0;
alter table public.products add column if not exists created_at timestamptz not null default now();
alter table public.products add column if not exists updated_at timestamptz not null default now();

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  whatsapp text,
  email text,
  city text,
  notes text,
  status text not null default 'Ativo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  whatsapp text,
  email text,
  city text,
  notes text,
  status text not null default 'Ativo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customers add column if not exists status text not null default 'Ativo';
alter table public.clients add column if not exists status text not null default 'Ativo';

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  products jsonb not null default '[]'::jsonb,
  total numeric(10, 2) not null default 0,
  status text not null default 'novo',
  origin text not null default 'site',
  ordered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaign_settings (
  id text primary key default 'annual',
  title text not null default '',
  description text,
  end_date timestamptz not null default now(),
  banner_url text,
  prizes text[] not null default '{}',
  rules text,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists brands_set_updated_at on public.brands;
create trigger brands_set_updated_at
before update on public.brands
for each row execute function public.set_updated_at();

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists campaign_settings_set_updated_at on public.campaign_settings;
create trigger campaign_settings_set_updated_at
before update on public.campaign_settings
for each row execute function public.set_updated_at();

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_status_idx on public.products(is_active, is_offer, is_best_seller, is_week_offer);
create index if not exists products_name_idx on public.products using gin(to_tsvector('portuguese', name));
create index if not exists orders_customer_id_idx on public.orders(customer_id);
create index if not exists orders_ordered_at_idx on public.orders(ordered_at);
create index if not exists customers_name_idx on public.customers using gin(to_tsvector('portuguese', name));
create index if not exists clients_name_idx on public.clients using gin(to_tsvector('portuguese', name));
create index if not exists clients_status_idx on public.clients(status);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.brands enable row level security;
alter table public.customers enable row level security;
alter table public.clients enable row level security;
alter table public.orders enable row level security;
alter table public.campaign_settings enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select on public.categories, public.products, public.brands, public.campaign_settings to anon, authenticated, service_role;
grant select, insert, update, delete on public.categories, public.products, public.brands, public.customers, public.clients, public.orders, public.campaign_settings to authenticated, service_role;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  role text default 'Administrador',
  access_type text not null default 'Administrador',
  status text not null default 'Ativo',
  created_at timestamptz not null default now()
);

alter table public.admin_profiles add column if not exists role text default 'Administrador';
alter table public.admin_profiles add column if not exists access_type text not null default 'Administrador';
alter table public.admin_profiles add column if not exists status text not null default 'Ativo';

alter table public.admin_profiles enable row level security;

grant select, insert, update, delete on public.admin_profiles to authenticated, service_role;

create or replace function public.admin_count()
returns integer
language sql
security definer
set search_path = public
as $$
  select count(*)::integer from public.admin_profiles;
$$;

create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where admin_profiles.user_id = is_admin.user_id
      and admin_profiles.status = 'Ativo'
  );
$$;

create or replace function public.is_super_admin(user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where admin_profiles.user_id = is_super_admin.user_id
      and admin_profiles.status = 'Ativo'
      and admin_profiles.access_type = 'Administrador'
  );
$$;

drop policy if exists "Public read admin profiles" on public.admin_profiles;
drop policy if exists "Admins read admin profiles" on public.admin_profiles;
create policy "Admins read admin profiles"
on public.admin_profiles for select
using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "Create first admin profile" on public.admin_profiles;
drop policy if exists "Authenticated users create own admin profile" on public.admin_profiles;
drop policy if exists "Admins insert admin profiles" on public.admin_profiles;
create policy "Admins insert admin profiles"
on public.admin_profiles for insert
with check (public.is_super_admin(auth.uid()));

drop policy if exists "Admins update admin profiles" on public.admin_profiles;
create policy "Admins update admin profiles"
on public.admin_profiles for update
using (public.is_super_admin(auth.uid()))
with check (public.is_super_admin(auth.uid()));

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
on public.categories for select
using (true);

drop policy if exists "Public read products" on public.products;
create policy "Public read products"
on public.products for select
using (true);

drop policy if exists "Public read brands" on public.brands;
create policy "Public read brands"
on public.brands for select
using (true);

drop policy if exists "Admins read customers" on public.customers;
create policy "Admins read customers"
on public.customers for select
using (auth.role() = 'authenticated' or public.is_admin(auth.uid()));

drop policy if exists "Admins read clients" on public.clients;
create policy "Admins read clients"
on public.clients for select
using (auth.role() = 'authenticated' or public.is_admin(auth.uid()));

drop policy if exists "Admins read orders" on public.orders;
create policy "Admins read orders"
on public.orders for select
using (auth.role() = 'authenticated' or public.is_admin(auth.uid()));

drop policy if exists "Public read campaign settings" on public.campaign_settings;
create policy "Public read campaign settings"
on public.campaign_settings for select
using (true);

drop policy if exists "Public manage categories demo" on public.categories;
drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
on public.categories for all
using (auth.role() = 'authenticated' or public.is_admin(auth.uid()))
with check (auth.role() = 'authenticated' or public.is_admin(auth.uid()));

drop policy if exists "Public manage products demo" on public.products;
drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
on public.products for all
using (auth.role() = 'authenticated' or public.is_admin(auth.uid()))
with check (auth.role() = 'authenticated' or public.is_admin(auth.uid()));

drop policy if exists "Admins manage brands" on public.brands;
create policy "Admins manage brands"
on public.brands for all
using (auth.role() = 'authenticated' or public.is_admin(auth.uid()))
with check (auth.role() = 'authenticated' or public.is_admin(auth.uid()));

drop policy if exists "Admins manage customers" on public.customers;
create policy "Admins manage customers"
on public.customers for all
using (auth.role() = 'authenticated' or public.is_admin(auth.uid()))
with check (auth.role() = 'authenticated' or public.is_admin(auth.uid()));

drop policy if exists "Admins manage clients" on public.clients;
create policy "Admins manage clients"
on public.clients for all
using (auth.role() = 'authenticated' or public.is_admin(auth.uid()))
with check (auth.role() = 'authenticated' or public.is_admin(auth.uid()));

drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders"
on public.orders for all
using (auth.role() = 'authenticated' or public.is_admin(auth.uid()))
with check (auth.role() = 'authenticated' or public.is_admin(auth.uid()));

drop policy if exists "Admins manage campaign settings" on public.campaign_settings;
create policy "Admins manage campaign settings"
on public.campaign_settings for all
using (auth.role() = 'authenticated' or public.is_admin(auth.uid()))
with check (auth.role() = 'authenticated' or public.is_admin(auth.uid()));

insert into public.clients (id, name, phone, whatsapp, email, city, notes, status, created_at, updated_at)
select id, name, phone, whatsapp, email, city, notes, status, created_at, updated_at
from public.customers
on conflict (id) do nothing;

insert into public.categories (name, slug, icon)
values
  ('Medicamentos', 'medicamentos', 'Pill'),
  ('Genéricos', 'genericos', 'BadgeCheck'),
  ('Vitaminas', 'vitaminas', 'Sun'),
  ('Dermocosméticos', 'dermocosmeticos', 'Sparkles'),
  ('Higiene Pessoal', 'higiene-pessoal', 'Droplet'),
  ('Infantil', 'infantil', 'Baby'),
  ('Perfumaria', 'perfumaria', 'Heart'),
  ('Suplementos', 'suplementos', 'Dumbbell'),
  ('Ofertas da Semana', 'ofertas-da-semana', 'Tag')
on conflict (slug) do update set
  name = excluded.name,
  icon = excluded.icon,
  is_active = true;

insert into public.categories (name, slug, icon, display_order)
values
  ('Medicamentos', 'medicamentos', 'Pill', 1),
  (U&'Gen\00E9ricos', 'genericos', 'BadgeCheck', 2),
  ('Similares', 'similares', 'BadgeCheck', 3),
  ('Manipulados', 'manipulados', 'Pill', 4),
  ('Suplementos', 'suplementos', 'Dumbbell', 5),
  ('Vitaminas', 'vitaminas', 'Sun', 6),
  ('Higiene Pessoal', 'higiene-pessoal', 'Droplet', 7),
  ('Infantil', 'infantil', 'Baby', 8),
  (U&'Dermocosm\00E9ticos', 'dermocosmeticos', 'Sparkles', 9),
  ('Beleza', 'beleza', 'Sparkles', 10),
  ('Perfumaria', 'perfumaria', 'Heart', 11),
  (U&'Sa\00FAde', 'saude', 'BadgeCheck', 12),
  ('Primeiros Socorros', 'primeiros-socorros', 'Briefcase', 13),
  (U&'Ortop\00E9dicos', 'ortopedicos', 'Activity', 14),
  (U&'Conveni\00EAncia', 'conveniencia', 'ShoppingBag', 15),
  (U&'Mam\00E3e e Beb\00EA', 'mamae-e-bebe', 'Baby', 16),
  ('Cuidados Masculinos', 'cuidados-masculinos', 'User', 17),
  ('Cuidados Femininos', 'cuidados-femininos', 'Heart', 18),
  (U&'Aparelhos de Sa\00FAde', 'aparelhos-de-saude', 'Activity', 19),
  ('Ofertas da Semana', 'ofertas-da-semana', 'Tag', 20)
on conflict (slug) do update set
  name = excluded.name,
  icon = excluded.icon,
  display_order = excluded.display_order,
  is_active = true;

insert into public.categories (name, slug, icon)
values
  ('Medicamentos', 'medicamentos', 'Pill'),
  ('Higiene Pessoal', 'higiene-pessoal', 'Droplet'),
  ('Infantil', 'infantil', 'Baby'),
  ('Suplementos', 'suplementos', 'Dumbbell'),
  ('Dermocosméticos', 'dermocosmeticos', 'Sparkles'),
  ('Beleza', 'beleza', 'Sparkles'),
  ('Perfumaria', 'perfumaria', 'Heart'),
  ('Saúde', 'saude', 'BadgeCheck'),
  ('Primeiros Socorros', 'primeiros-socorros', 'Briefcase'),
  ('Ortopédicos', 'ortopedicos', 'Activity'),
  ('Vitaminas', 'vitaminas', 'Sun'),
  ('Genéricos', 'genericos', 'BadgeCheck'),
  ('Manipulados', 'manipulados', 'Pill'),
  ('Conveniência', 'conveniencia', 'ShoppingBag'),
  ('Assistência', 'assistencia', 'MessageCircle')
on conflict (slug) do update set
  name = excluded.name,
  icon = excluded.icon,
  is_active = true;

insert into public.categories (name, slug, icon, display_order)
values
  ('Medicamentos', 'medicamentos', 'Pill', 1),
  (U&'Gen\00E9ricos', 'genericos', 'BadgeCheck', 2),
  ('Similares', 'similares', 'BadgeCheck', 3),
  ('Manipulados', 'manipulados', 'Pill', 4),
  ('Suplementos', 'suplementos', 'Dumbbell', 5),
  ('Vitaminas', 'vitaminas', 'Sun', 6),
  ('Higiene Pessoal', 'higiene-pessoal', 'Droplet', 7),
  ('Infantil', 'infantil', 'Baby', 8),
  (U&'Dermocosm\00E9ticos', 'dermocosmeticos', 'Sparkles', 9),
  ('Beleza', 'beleza', 'Sparkles', 10),
  ('Perfumaria', 'perfumaria', 'Heart', 11),
  (U&'Sa\00FAde', 'saude', 'BadgeCheck', 12),
  ('Primeiros Socorros', 'primeiros-socorros', 'Briefcase', 13),
  (U&'Ortop\00E9dicos', 'ortopedicos', 'Activity', 14),
  (U&'Conveni\00EAncia', 'conveniencia', 'ShoppingBag', 15),
  (U&'Mam\00E3e e Beb\00EA', 'mamae-e-bebe', 'Baby', 16),
  ('Cuidados Masculinos', 'cuidados-masculinos', 'User', 17),
  ('Cuidados Femininos', 'cuidados-femininos', 'Heart', 18),
  (U&'Aparelhos de Sa\00FAde', 'aparelhos-de-saude', 'Activity', 19),
  ('Ofertas da Semana', 'ofertas-da-semana', 'Tag', 20)
on conflict (slug) do update set
  name = excluded.name,
  icon = excluded.icon,
  display_order = excluded.display_order,
  is_active = true;

insert into public.campaign_settings (id, title, description, end_date, prizes, rules)
values (
  'annual',
  'Grande Sorteio Anual Vita Farma',
  'Campanha anual da Vita Farma.',
  now() + interval '90 days',
  '{}',
  ''
)
on conflict (id) do nothing;
