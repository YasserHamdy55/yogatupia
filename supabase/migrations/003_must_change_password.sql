-- 003_must_change_password.sql
-- Forces a user to change their password on next login.
-- Set to TRUE by the admin "Password reset" action.
-- Cleared automatically after the user updates their password.

alter table public.profiles
  add column if not exists must_change_password boolean not null default false;
