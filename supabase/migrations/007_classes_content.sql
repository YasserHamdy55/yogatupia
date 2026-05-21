-- Synced classes content across devices
create table if not exists public.classes_content (
  id uuid primary key default gen_random_uuid(),
  key text unique not null default 'default',
  items jsonb not null default '[]'::jsonb,
  updated_at timestamp with time zone default now(),
  updated_by uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

alter table public.classes_content enable row level security;

create policy "public_read_classes_content"
  on public.classes_content
  for select
  using (true);

create policy "admin_insert_classes_content"
  on public.classes_content
  for insert
  with check (
    auth.uid() is not null and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'superadmin')
    )
  );

create policy "admin_update_classes_content"
  on public.classes_content
  for update
  using (
    auth.uid() is not null and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'superadmin')
    )
  );

create policy "admin_delete_classes_content"
  on public.classes_content
  for delete
  using (
    auth.uid() is not null and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'superadmin')
    )
  );

create index if not exists idx_classes_content_key on public.classes_content(key);
