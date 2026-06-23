-- Hanger in-app messaging: inquiries (give_away) and swap offers

create table if not exists public.hanger_messages (
  id            uuid primary key default gen_random_uuid(),
  listing_id    uuid not null references public.hanger_listings(id) on delete cascade,
  sender_id     uuid not null references auth.users(id) on delete cascade,
  recipient_id  uuid not null references auth.users(id) on delete cascade,
  body          text,
  photo_url     text,
  message_type  text not null default 'text'
                  check (message_type in ('text', 'swap_offer', 'address', 'delivery_offer')),
  meta          jsonb,
  is_read       boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table public.hanger_messages enable row level security;

create policy "read own hanger messages" on public.hanger_messages
  for select using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "insert own hanger messages" on public.hanger_messages
  for insert with check (auth.uid() = sender_id);

create policy "mark own messages read" on public.hanger_messages
  for update using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);

create index if not exists hanger_messages_listing_idx  on public.hanger_messages(listing_id, created_at);
create index if not exists hanger_messages_parties_idx  on public.hanger_messages(sender_id, recipient_id, listing_id);
create index if not exists hanger_messages_unread_idx   on public.hanger_messages(recipient_id, is_read) where is_read = false;
