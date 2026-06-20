-- Founders / ops can read all profiles (Mission Control roster & cohort)

drop policy if exists "Profiles ops read all" on public.profiles;
create policy "Profiles ops read all"
  on public.profiles
  for select
  to authenticated
  using (public.has_ops_role());

grant select on public.gatherings to authenticated;
grant select, insert on public.seat_reservations to authenticated;
grant select, insert on public.gathering_attendance to authenticated;
grant select, insert on public.club_memberships to authenticated;
