-- Let attendees see who else is attending a gathering they're also going to
-- (needed for the real "who was there / witness" feature — the RLS only
-- allowed reading your own attendance row, so there was never a real
-- attendee list to show, which is why it was stubbed with placeholder text).
drop policy if exists "attendance_read_fellow_attendees" on public.gathering_attendance;
create policy "attendance_read_fellow_attendees"
  on public.gathering_attendance for select
  to authenticated
  using (
    exists (
      select 1 from public.gathering_attendance ga2
      where ga2.gathering_id = gathering_attendance.gathering_id
        and ga2.user_id = auth.uid()
    )
  );

-- Real RSVP status beyond a binary join/not-joined — "I'm going" / "maybe" /
-- "can't make it" (previously UI-only, disabled, never saved anywhere).
alter table public.gathering_attendance
  add column if not exists status text not null default 'going'
    check (status in ('going', 'maybe', 'cant_go'));
