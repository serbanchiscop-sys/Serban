-- Family Moments AI — Phase 2 schema (Supabase / Postgres)
-- Run in the Supabase SQL editor. Defines families, members, children, and
-- media, all protected by row-level security so a user only ever sees their
-- own family's data.

-- ---------- Tables ----------

create table if not exists families (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists family_members (
  family_id   uuid not null references families(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null default 'parent'  -- 'admin' | 'parent' | 'grandparent'
                check (role in ('admin','parent','grandparent')),
  created_at  timestamptz not null default now(),
  primary key (family_id, user_id)
);

create table if not exists children (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references families(id) on delete cascade,
  name        text not null,
  birth_date  date
);

create table if not exists media (
  id            uuid primary key default gen_random_uuid(),
  family_id     uuid not null references families(id) on delete cascade,
  child_id      uuid references children(id) on delete set null,
  storage_path  text not null,
  size_bytes    bigint not null default 0,
  taken_at      timestamptz,
  caption       text,            -- AI-generated (see supabase/functions/ai, action 'caption')
  tags          text[],          -- AI-generated tags
  created_at    timestamptz not null default now()
);

create index if not exists media_family_idx on media(family_id);
create index if not exists members_user_idx on family_members(user_id);

-- Print-shop orders (physical goods — paid via Stripe, fulfilled via a
-- print-on-demand provider; see supabase/functions/checkout).
create table if not exists orders (
  id            uuid primary key default gen_random_uuid(),
  family_id     uuid not null references families(id) on delete cascade,
  order_no      text not null unique,
  amount_cents  bigint not null,
  currency      text not null default 'eur',
  status        text not null default 'paid'
                  check (status in ('pending','paid','fulfilled','failed','refunded')),
  stripe_payment_intent  text,
  provider_ref  text,                 -- print-on-demand order id
  created_at    timestamptz not null default now()
);
create index if not exists orders_family_idx on orders(family_id);

-- ---------- Helper: families the current user belongs to ----------

create or replace function my_family_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select family_id from family_members where user_id = auth.uid()
$$;

-- ---------- Row-level security ----------

alter table families       enable row level security;
alter table family_members enable row level security;
alter table children       enable row level security;
alter table media          enable row level security;

-- A user can see/modify only rows belonging to a family they are a member of.
create policy "members read family"      on families
  for select using (id in (select my_family_ids()));
create policy "members read membership"  on family_members
  for select using (family_id in (select my_family_ids()));
create policy "members read children"    on children
  for select using (family_id in (select my_family_ids()));

create policy "members read media"   on media
  for select using (family_id in (select my_family_ids()));
create policy "members insert media" on media
  for insert with check (family_id in (select my_family_ids()));
create policy "members delete media" on media
  for delete using (family_id in (select my_family_ids()));

alter table orders enable row level security;
create policy "members read orders" on orders
  for select using (family_id in (select my_family_ids()));
-- Orders are written by the checkout edge function (service role), which
-- bypasses RLS; members get read-only visibility here.

-- ---------- Atomic family creation ----------
-- Creates a family and adds the caller as its 'admin' in one transaction.
-- SECURITY DEFINER so it can insert the membership the RLS policies then gate on.
create or replace function create_family(p_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  insert into families(name) values (coalesce(nullif(trim(p_name), ''), 'My family'))
    returning id into new_id;
  insert into family_members(family_id, user_id, role) values (new_id, auth.uid(), 'admin');
  return new_id;
end;
$$;

-- Members can insert children/manage their family rows.
create policy "members insert children" on children
  for insert with check (family_id in (select my_family_ids()));
create policy "admins update family" on families
  for update using (id in (select my_family_ids()));

-- ---------- Profiles (display names for the family circle) ----------
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  created_at    timestamptz not null default now()
);
alter table profiles enable row level security;
-- A user can read profiles of people in their families, and edit their own.
create policy "read family profiles" on profiles for select
  using (id = auth.uid() or id in (
    select user_id from family_members where family_id in (select my_family_ids())));
create policy "upsert own profile" on profiles for insert with check (id = auth.uid());
create policy "update own profile" on profiles for update using (id = auth.uid());

-- ---------- Invitations ----------
create table if not exists invitations (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references families(id) on delete cascade,
  email       text not null,
  role        text not null default 'parent' check (role in ('parent','grandparent')),
  code        text not null unique default encode(gen_random_bytes(8), 'hex'),
  accepted    boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table invitations enable row level security;
create policy "members read invites" on invitations for select
  using (family_id in (select my_family_ids()));

-- Admin creates an invite (returns the share code).
create or replace function create_invite(p_family_id uuid, p_email text, p_role text)
returns text language plpgsql security definer set search_path = public as $$
declare v_code text;
begin
  if not exists (select 1 from family_members
                 where family_id = p_family_id and user_id = auth.uid() and role = 'admin')
  then raise exception 'only an admin can invite'; end if;
  insert into invitations(family_id, email, role)
    values (p_family_id, lower(trim(p_email)),
            case when p_role in ('parent','grandparent') then p_role else 'parent' end)
    returning code into v_code;
  return v_code;
end;
$$;

-- Invitee redeems a code → becomes a member of that family.
create or replace function accept_invite(p_code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_inv invitations;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select * into v_inv from invitations where code = p_code and accepted = false;
  if v_inv.id is null then raise exception 'invalid or used invite'; end if;
  insert into family_members(family_id, user_id, role)
    values (v_inv.family_id, auth.uid(), v_inv.role)
    on conflict (family_id, user_id) do nothing;
  update invitations set accepted = true where id = v_inv.id;
  return v_inv.family_id;
end;
$$;

-- Storage: create a private bucket named 'family-media' and add storage
-- policies that mirror my_family_ids() on the object path prefix, e.g.:
--   create policy "family media read" on storage.objects for select
--     using (bucket_id = 'family-media'
--            and (split_part(name,'/',1))::uuid in (select my_family_ids()));
-- (repeat for insert/delete with `with check` / `using`).
