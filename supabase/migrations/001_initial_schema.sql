-- =====================================================================
-- yogaTupia — Phase 1 schema: profiles + bookings
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. profiles
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  phone        text,
  role         text not null default 'customer'
                 check (role in ('customer', 'staff', 'admin', 'superadmin')),
  language     text not null default 'en' check (language in ('en', 'ar')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-insert profile when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 2. bookings
-- ---------------------------------------------------------------------
create table if not exists public.bookings (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,

  booking_type        text not null check (booking_type in ('class', 'retreat')),
  item_id             text not null,
  item_title          text not null,
  item_subtitle       text,

  status              text not null default 'pending'
                        check (status in ('pending', 'in_review', 'confirmed', 'cancelled', 'completed')),

  customer_name       text not null,
  customer_email      text not null,
  customer_phone      text not null,
  notes               text,

  scheduled_for       timestamptz,
  price_amount        numeric(10, 2),
  price_currency      text default 'EGP',

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists bookings_user_id_idx     on public.bookings(user_id);
create index if not exists bookings_status_idx      on public.bookings(status);
create index if not exists bookings_type_idx        on public.bookings(booking_type);
create index if not exists bookings_scheduled_idx   on public.bookings(scheduled_for);

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 3. Row Level Security
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.bookings enable row level security;

create or replace function public.current_user_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff_or_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid())
      in ('staff', 'admin', 'superadmin'),
    false
  );
$$;

-- ---- profiles policies ----
drop policy if exists profiles_select_own    on public.profiles;
drop policy if exists profiles_select_staff  on public.profiles;
drop policy if exists profiles_update_own    on public.profiles;
drop policy if exists profiles_update_admin  on public.profiles;

create policy profiles_select_own
  on public.profiles for select
  using (auth.uid() = id);

create policy profiles_select_staff
  on public.profiles for select
  using (public.is_staff_or_admin());

create policy profiles_update_own
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
  );

create policy profiles_update_admin
  on public.profiles for update
  using (public.current_user_role() in ('admin', 'superadmin'))
  with check (public.current_user_role() in ('admin', 'superadmin'));

-- ---- bookings policies ----
drop policy if exists bookings_select_own    on public.bookings;
drop policy if exists bookings_select_staff  on public.bookings;
drop policy if exists bookings_insert_own    on public.bookings;
drop policy if exists bookings_update_own    on public.bookings;
drop policy if exists bookings_update_staff  on public.bookings;
drop policy if exists bookings_delete_admin  on public.bookings;

create policy bookings_select_own
  on public.bookings for select
  using (auth.uid() = user_id);

create policy bookings_select_staff
  on public.bookings for select
  using (public.is_staff_or_admin());

create policy bookings_insert_own
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy bookings_update_own
  on public.bookings for update
  using (auth.uid() = user_id and status in ('pending', 'in_review'))
  with check (auth.uid() = user_id);

create policy bookings_update_staff
  on public.bookings for update
  using (public.is_staff_or_admin());

create policy bookings_delete_admin
  on public.bookings for delete
  using (public.current_user_role() in ('admin', 'superadmin'));

-- =====================================================================
-- After signing up via the app, promote yourself to superadmin:
--   update public.profiles set role = 'superadmin' where id = (
--     select id from auth.users where email = 'yasserhamdy55@gmail.com'
--   );
-- =====================================================================
