-- Applied to Supabase project dtgkcjuhrwjpvhycydfq on 2026-11-14 (record only; already live).
-- "Like this post" counts for blog posts. Written only by netlify/functions/post-like.mjs (service role).
create table if not exists public.post_likes (
  post_key text primary key check (char_length(post_key) between 3 and 160),
  likes integer not null default 0 check (likes >= 0),
  updated_at timestamptz not null default now()
);
comment on table public.post_likes is 'Like counts for site posts (blog posts; key like blog/2026-11-13_slug). Written only by the post-like Netlify function. No personal data.';
alter table public.post_likes enable row level security;
revoke all on public.post_likes from anon, authenticated;

create or replace function public.post_like_change(p_key text, p_delta integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare n integer;
begin
  if p_delta not in (-1, 1) then raise exception 'bad delta'; end if;
  insert into public.post_likes as pl (post_key, likes, updated_at)
    values (p_key, greatest(p_delta, 0), now())
  on conflict (post_key) do update
    set likes = greatest(pl.likes + p_delta, 0), updated_at = now()
  returning likes into n;
  return n;
end;
$$;
revoke execute on function public.post_like_change(text, integer) from public, anon, authenticated;
grant execute on function public.post_like_change(text, integer) to service_role;
