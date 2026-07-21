-- Allow signed-in members to read basic profile cards for messaging / invites.
-- Own-only read (002) blocked DM pickers and conversation name resolution.

drop policy if exists "Profiles read members directory" on public.profiles;

create policy "Profiles read members directory"
  on public.profiles for select
  to authenticated
  using (true);
