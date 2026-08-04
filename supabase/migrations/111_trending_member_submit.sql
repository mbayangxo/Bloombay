-- Let any signed-in member submit a City pick (Girl Gem), not just
-- curators/admins/founders. Submissions still land as status='pending' and
-- need admin approval before anyone else sees them, so this is safe.
drop policy if exists "trending_submit" on public.city_trending;

create policy "trending_submit"
  on public.city_trending for insert
  with check (auth.uid() = submitted_by);
