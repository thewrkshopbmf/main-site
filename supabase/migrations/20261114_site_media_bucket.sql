-- Applied to Supabase project dtgkcjuhrwjpvhycydfq on 2026-11-14 (record only; already live).
-- Public image folder for blog hero images (served at
-- https://dtgkcjuhrwjpvhycydfq.supabase.co/storage/v1/object/public/site-media/...).
-- Uploads are not open to the public: a temporary upload policy used for the first image was dropped.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png','image/webp'];
