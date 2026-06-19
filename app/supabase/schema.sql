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
  created_at    timestamptz not null default now()
);

create index if not exists media_family_idx on media(family_id);
create index if not exists members_user_idx on family_members(user_id);

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

-- Storage: create a private bucket named 'family-media' and add storage
-- policies that mirror my_family_ids() on the object path prefix, e.g.:
--   create policy "family media read" on storage.objects for select
--     using (bucket_id = 'family-media'
--            and (split_part(name,'/',1))::uuid in (select my_family_ids()));
-- (repeat for insert/delete with `with check` / `using`).
