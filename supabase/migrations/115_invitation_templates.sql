-- Turn member_invitations into a real templated invitation, not just a
-- subject/body note: pick one of the invitation card templates already
-- built (event-card-templates.tsx), fill in the event details, and let the
-- recipient actually accept/decline (persisted, not just a local UI phase).

alter table public.member_invitations
  add column if not exists template_id  text not null default 'default'
    check (template_id in ('default', 'photo', 'scallop', 'newspaper', 'formal', 'launch')),
  add column if not exists event_title  text,
  add column if not exists venue        text,
  add column if not exists event_date   timestamptz,
  add column if not exists image_url    text,
  add column if not exists accent_color text,
  add column if not exists status       text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined')),
  add column if not exists decline_note text;

-- Recipients need to update their own invitation to respond (accept/decline)
-- — the existing "member_invitations_mark_read" policy already lets
-- to_user_id update the row, so no new policy is needed for status/decline_note.
