-- Member-to-member invitations need a real "maybe" — not just accept/decline —
-- so recipients who aren't sure yet can say so instead of being forced to
-- commit either way.
alter table public.member_invitations
  drop constraint if exists member_invitations_status_check;

alter table public.member_invitations
  add constraint member_invitations_status_check
    check (status in ('pending', 'accepted', 'declined', 'maybe'));
