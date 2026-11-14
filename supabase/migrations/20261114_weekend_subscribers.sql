-- Applied to Supabase project dtgkcjuhrwjpvhycydfq on 2026-11-14 (record only; already live).
-- Weekend 4-3-2-1 email list (netlify/shared/weekend-list.js).
create table if not exists public.weekend_subscribers (
  id bigint generated always as identity primary key,
  email text not null unique check (email = lower(email)),
  first_name text,
  status text not null default 'pending' check (status in ('pending','active','unsubscribed')),
  wants_daily boolean not null default false,
  confirm_token text not null unique,
  unsub_token text not null unique,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirm_sent_at timestamptz,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  last_sent_date date
);
comment on table public.weekend_subscribers is 'Men signed up for the Weekend 4-3-2-1 email (Fridays 2pm Central). status: pending, active, unsubscribed. wants_daily: also asked for The Daily (added to daily_subscribers on confirm).';
alter table public.weekend_subscribers enable row level security;
revoke all on public.weekend_subscribers from anon, authenticated;

create table if not exists public.weekend_email_sends (
  send_date date primary key,
  post_title text,
  recipients integer not null default 0,
  failures integer not null default 0,
  first_sent_at timestamptz,
  last_sent_at timestamptz
);
comment on table public.weekend_email_sends is 'One row per Weekend 4-3-2-1 email send, with running totals.';
alter table public.weekend_email_sends enable row level security;
revoke all on public.weekend_email_sends from anon, authenticated;

-- 2026-11-14: "paused" status (held by TheWrkShop; no emails until S says otherwise)
alter table public.weekend_subscribers drop constraint if exists weekend_subscribers_status_check;
alter table public.weekend_subscribers add constraint weekend_subscribers_status_check check (status in ('pending','active','unsubscribed','paused'));
