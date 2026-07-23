-- 099_club_owner_rls.sql
-- Wire the club-owner portal's Approve/Deny to the real, already-built
-- /api/club-portal/applications API instead of localStorage.
--
-- That API queries the real (club_slug-keyed) `club_applications` table
-- from 006_member_truth_layer.sql, which only had SELECT/INSERT policies
-- for the applicant themselves or an ops-role account — no policy let an
-- actual club owner read or decide applications for their own club.
--
-- A prior migration (026_club_management.sql) *tried* to add owner
-- select/update policies, but its `create table if not exists
-- public.club_applications` was a no-op (the table already existed from
-- 006), so those owner policies were written against a `club_id` column
-- that doesn't exist on the real table — a dead reference, not a working
-- grant. Replace them with policies against the real schema.

drop policy if exists "applications_owner_select" on public.club_applications;
drop policy if exists "applications_owner_update" on public.club_applications;

create policy "Club applications owner read"
  on public.club_applications for select to authenticated
  using (
    club_slug in (select slug from public.clubs where owner_id = auth.uid())
  );

create policy "Club applications owner update"
  on public.club_applications for update to authenticated
  using (
    club_slug in (select slug from public.clubs where owner_id = auth.uid())
  );

-- The PATCH route also upserts a club_memberships row for the *applicant*
-- once approved — the existing "insert own" policy only allows a user to
-- insert a membership row for themselves, so the owner's insert for
-- someone else's user_id was silently blocked. Add an owner grant.
create policy "Club memberships insert by club owner"
  on public.club_memberships for insert
  to authenticated
  with check (
    club_slug in (select slug from public.clubs where owner_id = auth.uid())
  );

-- GET /api/club-portal/members reads every membership row for the owner's
-- club — the existing select policy only allowed a member to read their
-- own row (or ops), so the owner's roster fetch also returned empty.
create policy "Club memberships read by club owner"
  on public.club_memberships for select
  to authenticated
  using (
    club_slug in (select slug from public.clubs where owner_id = auth.uid())
  );

-- DELETE /api/club-portal/members lets an owner remove a member from
-- their own club — no delete policy existed at all before this.
create policy "Club memberships delete by club owner"
  on public.club_memberships for delete
  to authenticated
  using (
    club_slug in (select slug from public.clubs where owner_id = auth.uid())
  );
