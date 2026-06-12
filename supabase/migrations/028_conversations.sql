-- Real-time direct messaging: conversations + messages

create table if not exists public.conversations (
  id              uuid primary key default gen_random_uuid(),
  type            text not null default 'direct'
    check (type in ('direct','group','plan','club')),
  name            text,                             -- for group/plan convos
  created_by      uuid references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  last_message_at timestamptz default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  joined_at       timestamptz not null default now(),
  last_read_at    timestamptz,
  primary key (conversation_id, user_id)
);

create table if not exists public.direct_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid references public.profiles(id) on delete set null,
  content         text not null,
  created_at      timestamptz not null default now()
);

-- RLS
alter table public.conversations             enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.direct_messages           enable row level security;

-- Conversations: visible to participants
create policy "convos_read_participant"
  on public.conversations for select
  using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = conversations.id and user_id = auth.uid()
    )
  );

create policy "convos_insert"
  on public.conversations for insert
  with check (auth.uid() = created_by);

-- Participants: visible to members of the same convo
create policy "participants_read"
  on public.conversation_participants for select
  using (
    exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = conversation_participants.conversation_id
        and cp.user_id = auth.uid()
    )
  );

create policy "participants_insert"
  on public.conversation_participants for insert
  with check (auth.uid() = user_id or
    exists (
      select 1 from public.conversation_participants
      where conversation_id = conversation_participants.conversation_id
        and user_id = auth.uid()
    )
  );

create policy "participants_update_own"
  on public.conversation_participants for update
  using (auth.uid() = user_id);

-- Messages: visible to conversation participants
create policy "dm_read_participant"
  on public.direct_messages for select
  using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = direct_messages.conversation_id and user_id = auth.uid()
    )
  );

create policy "dm_send"
  on public.direct_messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversation_participants
      where conversation_id = direct_messages.conversation_id and user_id = auth.uid()
    )
  );

-- Keep last_message_at updated
create or replace function public.update_convo_last_message()
returns trigger language plpgsql as $$
begin
  update public.conversations set last_message_at = new.created_at where id = new.conversation_id;
  return new;
end;
$$;

create trigger dm_last_message
  after insert on public.direct_messages
  for each row execute function public.update_convo_last_message();

-- Indexes for perf
create index if not exists dm_convo_idx on public.direct_messages(conversation_id, created_at desc);
create index if not exists cp_user_idx  on public.conversation_participants(user_id);
