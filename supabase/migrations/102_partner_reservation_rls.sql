-- 102_partner_reservation_rls.sql
-- Wire the partner portal's Confirm/Decline booking-request buttons to the
-- real table_reservations table instead of local-only React state.
--
-- table_reservations (056_table_reservations.sql) had a
-- "service_manages_reservations" policy defined as `for all using (true)
-- with check (true)` with NO `to` clause — that means it applies to every
-- role, including `authenticated` via the anon key, not just the service
-- role. In practice that made it the only thing letting
-- /api/partner-portal/my-venue's regular (RLS-scoped) client read
-- reservations for a venue it doesn't own the user_id on, but it also meant
-- ANY logged-in member could read or write ANY other member's reservation
-- row. Replace it with real, scoped policies: the service role keeps full
-- access (and already bypasses RLS by default), and venue partners get
-- read/update access limited to reservations at the venue they own.

drop policy if exists "service_manages_reservations" on public.table_reservations;

create policy "service_role_manages_reservations"
  on public.table_reservations for all
  to service_role
  using (true) with check (true);

create policy "partner_reads_own_venue_reservations"
  on public.table_reservations for select
  to authenticated
  using (
    restaurant_id in (
      select id::text from public.restaurant_partners where owner_id = auth.uid()
    )
  );

create policy "partner_updates_own_venue_reservations"
  on public.table_reservations for update
  to authenticated
  using (
    restaurant_id in (
      select id::text from public.restaurant_partners where owner_id = auth.uid()
    )
  );
