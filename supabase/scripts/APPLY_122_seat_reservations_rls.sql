-- RS-01 fix: paste into Supabase SQL Editor → Run (staging: kkyoxheenixtlumghffy)
-- Same as supabase/migrations/122_seat_reservations_member_select.sql

drop policy if exists "Seats read own or ops" on public.seat_reservations;
drop policy if exists "Seats select own" on public.seat_reservations;

create policy "Seats select own"
  on public.seat_reservations for select
  to authenticated
  using (user_id = auth.uid());
