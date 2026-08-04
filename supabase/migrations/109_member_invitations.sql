-- Member-to-member invitations ("let's hang", "come to this") — surfaced in
-- the Mailbox alongside Yande's system messages.
create table if not exists public.member_invitations (
  id           uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references public.profiles(id) on delete cascade,
  to_user_id   uuid not null references public.profiles(id) on delete cascade,
  subject      text not null,
  body         text,
  is_read      boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists member_invitations_recipient_idx
  on public.member_invitations(to_user_id, is_read, created_at desc);

alter table public.member_invitations enable row level security;

create policy "member_invitations_read_own"
  on public.member_invitations for select
  using (auth.uid() = to_user_id or auth.uid() = from_user_id);

create policy "member_invitations_send"
  on public.member_invitations for insert
  with check (auth.uid() = from_user_id and from_user_id <> to_user_id);

create policy "member_invitations_mark_read"
  on public.member_invitations for update
  using (auth.uid() = to_user_id)
  with check (auth.uid() = to_user_id);

-- Notify the recipient
create or replace function public.notify_member_invitation()
returns trigger language plpgsql security definer as $$
begin
  perform public.create_notification(
    new.to_user_id,
    'invitation',
    coalesce(new.subject, 'You have an invitation'),
    coalesce(new.body, 'A Bloomie invited you to something.'),
    '/member/messages?filter=invitation',
    jsonb_build_object('from_user_id', new.from_user_id, 'invitation_id', new.id)
  );
  return new;
end;
$$;

create trigger member_invitation_notify
  after insert on public.member_invitations
  for each row execute function public.notify_member_invitation();
