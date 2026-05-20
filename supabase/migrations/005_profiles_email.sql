-- 004_profiles_email.sql
-- Keep a readable email copy in profiles for admin listing and edits.

alter table public.profiles
  add column if not exists email text;

create index if not exists profiles_email_idx on public.profiles(email);

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id
  and (p.email is null or p.email = '');
