-- RS-01: Members may only SELECT their own seat_reservations.
-- Club Mama / staff attendee lists use service-role server APIs, not broad client RLS.

drop policy if exists "Seats read own or ops" on public.seat_reservations;
drop policy if exists "Seats select own" on public.seat_reservations;

create policy "Seats select own"
  on public.seat_reservations for select
  to authenticated
  using (user_id = auth.uid());
