-- Store temporary password for admin onboarding message flow.
-- This value is cleared once the user changes password from My Account.
alter table public.profiles
  add column if not exists temporary_password text;
