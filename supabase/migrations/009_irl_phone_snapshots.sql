-- BloomBay 009: snapshot member phone on seat reservations and gathering attendance

ALTER TABLE public.seat_reservations
  ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE public.gathering_attendance
  ADD COLUMN IF NOT EXISTS phone text;
