-- =====================================================================
-- yogaTupia — Phase 4 schema: media library
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Storage bucket
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- ---------------------------------------------------------------------
-- 2. media_assets table — index of uploaded files
-- ---------------------------------------------------------------------
create table if not exists public.media_assets (
  id           uuid primary key default gen_random_uuid(),
  path         text not null unique,
  url          text not null,
  name         text,
  mime         text,
  size_bytes   bigint,
  width        int,
  height       int,
  tags         text[] not null default '{}',
  uploaded_by  uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists media_assets_created_at_idx
  on public.media_assets (created_at desc);

create index if not exists media_assets_tags_idx
  on public.media_assets using gin (tags);

-- ---------------------------------------------------------------------
-- 3. RLS on media_assets
-- ---------------------------------------------------------------------
alter table public.media_assets enable row level security;

drop policy if exists "media_assets select public" on public.media_assets;
create policy "media_assets select public"
  on public.media_assets for select
  using (true);

drop policy if exists "media_assets insert admin" on public.media_assets;
create policy "media_assets insert admin"
  on public.media_assets for insert
  with check (public.current_user_role() in ('admin', 'superadmin'));

drop policy if exists "media_assets update admin" on public.media_assets;
create policy "media_assets update admin"
  on public.media_assets for update
  using (public.current_user_role() in ('admin', 'superadmin'))
  with check (public.current_user_role() in ('admin', 'superadmin'));

drop policy if exists "media_assets delete admin" on public.media_assets;
create policy "media_assets delete admin"
  on public.media_assets for delete
  using (public.current_user_role() in ('admin', 'superadmin'));

-- ---------------------------------------------------------------------
-- 4. RLS on storage.objects for bucket 'media'
-- ---------------------------------------------------------------------
drop policy if exists "media bucket public read" on storage.objects;
create policy "media bucket public read"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media bucket admin insert" on storage.objects;
create policy "media bucket admin insert"
  on storage.objects for insert
  with check (
    bucket_id = 'media'
    and public.current_user_role() in ('admin', 'superadmin')
  );

drop policy if exists "media bucket admin update" on storage.objects;
create policy "media bucket admin update"
  on storage.objects for update
  using (
    bucket_id = 'media'
    and public.current_user_role() in ('admin', 'superadmin')
  );

drop policy if exists "media bucket admin delete" on storage.objects;
create policy "media bucket admin delete"
  on storage.objects for delete
  using (
    bucket_id = 'media'
    and public.current_user_role() in ('admin', 'superadmin')
  );
