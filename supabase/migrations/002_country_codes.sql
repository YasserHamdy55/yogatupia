-- =====================================================================
-- yogaTupia — Phase 1.1: shared custom country codes
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- =====================================================================

create table if not exists public.country_codes (
  code        text primary key,         -- e.g. "+962"
  label       text not null default 'Custom',
  flag        text not null default '🌐',
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Allow SELECT to everyone (anon + authenticated) — the signup form and
-- booking forms need to read this list before login.
alter table public.country_codes enable row level security;

drop policy if exists country_codes_read_all on public.country_codes;
create policy country_codes_read_all
  on public.country_codes for select
  using (true);

-- Only staff/admin can add custom codes.
drop policy if exists country_codes_insert_staff on public.country_codes;
create policy country_codes_insert_staff
  on public.country_codes for insert
  with check (public.is_staff_or_admin());

-- Only admin/superadmin can delete a custom code.
drop policy if exists country_codes_delete_admin on public.country_codes;
create policy country_codes_delete_admin
  on public.country_codes for delete
  using (public.current_user_role() in ('admin', 'superadmin'));
