-- Friendship Health: tracks who attends events together
-- Score = co_attendance × 10 + friend_scans × 25
-- user_a < user_b enforces canonical pair ordering (no duplicates)

create table if not exists public.friendship_scores (
  user_a              uuid        not null references public.profiles(id) on delete cascade,
  user_b              uuid        not null references public.profiles(id) on delete cascade,
  co_attendance_count integer     not null default 0,
  friend_scan_count   integer     not null default 0,
  score               integer     not null default 0,
  last_seen_together  timestamptz,
  updated_at          timestamptz not null default now(),
  primary key (user_a, user_b),
  check (user_a < user_b)
);

alter table public.friendship_scores enable row level security;

create policy "friendship_scores_own"
  on public.friendship_scores for select
  using (auth.uid() = user_a or auth.uid() = user_b);

create index if not exists friendship_scores_a_idx on public.friendship_scores(user_a, score desc);
create index if not exists friendship_scores_b_idx on public.friendship_scores(user_b, score desc);
