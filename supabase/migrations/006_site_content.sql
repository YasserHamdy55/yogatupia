-- Create site_content table for synced content across devices
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text unique not null default 'default',
  en jsonb not null default '{}',
  ar jsonb not null default '{}',
  updated_at timestamp with time zone default now(),
  updated_by uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.site_content enable row level security;

-- Policy: Anyone can read site content
create policy "public_read_site_content"
  on public.site_content
  for select
  using (true);

-- Policy: Only authenticated admins can update
create policy "admin_update_site_content"
  on public.site_content
  for update
  using (
    auth.uid() is not null and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'superadmin')
    )
  );

-- Policy: Only authenticated admins can insert
create policy "admin_insert_site_content"
  on public.site_content
  for insert
  with check (
    auth.uid() is not null and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'superadmin')
    )
  );

-- Create index on key for faster lookups
create index if not exists idx_site_content_key on public.site_content(key);
