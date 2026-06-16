-- Allow seed posts from the platform (Yande / BloomBay voice)
-- author_id nullable so service role can insert without a real user

alter table public.wall_posts
  alter column author_id drop not null,
  add column if not exists is_seed     boolean not null default false,
  add column if not exists seed_author text;   -- display name for seed posts e.g. "Yande ✦"

-- Update insert policy: users can only insert their own (non-seed) posts
drop policy if exists "wall_insert_own" on public.wall_posts;
create policy "wall_insert_own"
  on public.wall_posts for insert
  with check (auth.uid() = author_id AND is_seed = false);
-- Seed posts are inserted by service role (bypasses RLS automatically)
