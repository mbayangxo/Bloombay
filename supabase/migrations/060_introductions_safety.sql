-- ── 060: Introductions + Safety Infrastructure ────────────────────────────────

-- Introductions: member self-posts to the community
create table if not exists public.introductions (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  bio             text        not null check (char_length(bio) between 10 and 500),
  arrival_status  text        not null default 'just_moved'
                              check (arrival_status in ('just_moved','new_6mo','fresh_start','local','native')),
  neighborhood    text,
  interests       text[]      not null default '{}',
  flower_count    integer     not null default 0,
  is_active       boolean     not null default true,
  created_at      timestamptz not null default now(),
  unique (user_id)
);

alter table public.introductions enable row level security;

create policy "intros_read_active"
  on public.introductions for select using (is_active = true);

create policy "intros_insert_own"
  on public.introductions for insert with check (auth.uid() = user_id);

create policy "intros_update_own"
  on public.introductions for update using (auth.uid() = user_id);

create policy "intros_delete_own"
  on public.introductions for delete using (auth.uid() = user_id);

create index if not exists intros_arrival_idx   on public.introductions(arrival_status, created_at desc);
create index if not exists intros_created_idx   on public.introductions(created_at desc);

-- Flowers on introductions
create table if not exists public.introduction_flowers (
  intro_id    uuid        not null references public.introductions(id) on delete cascade,
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (intro_id, user_id)
);

alter table public.introduction_flowers enable row level security;

create policy "intro_flowers_read"   on public.introduction_flowers for select using (true);
create policy "intro_flowers_insert" on public.introduction_flowers for insert with check (auth.uid() = user_id);
create policy "intro_flowers_delete" on public.introduction_flowers for delete using (auth.uid() = user_id);

-- Keep denormalized flower_count in sync
create or replace function public.increment_intro_flower()
returns trigger language plpgsql security definer as $$
begin
  update public.introductions set flower_count = flower_count + 1 where id = new.intro_id;
  return new;
end;
$$;

create or replace function public.decrement_intro_flower()
returns trigger language plpgsql security definer as $$
begin
  update public.introductions set flower_count = greatest(0, flower_count - 1) where id = old.intro_id;
  return old;
end;
$$;

create trigger intro_flower_up
  after insert on public.introduction_flowers
  for each row execute function public.increment_intro_flower();

create trigger intro_flower_down
  after delete on public.introduction_flowers
  for each row execute function public.decrement_intro_flower();

-- Member safety reports
create table if not exists public.member_reports (
  id              uuid        primary key default gen_random_uuid(),
  reporter_id     uuid        not null references public.profiles(id) on delete cascade,
  reported_id     uuid        not null references public.profiles(id) on delete cascade,
  reason          text        not null check (reason in ('harassment','spam','inappropriate_content','fake_profile','other')),
  details         text,
  severity        text        not null default 'low' check (severity in ('low','medium','high')),
  status          text        not null default 'pending' check (status in ('pending','reviewed','resolved','dismissed')),
  yande_summary   text,
  resolved_by     uuid        references public.profiles(id) on delete set null,
  resolved_at     timestamptz,
  created_at      timestamptz not null default now()
);

alter table public.member_reports enable row level security;

create policy "reports_insert_own"
  on public.member_reports for insert with check (auth.uid() = reporter_id);

create policy "reports_read_own"
  on public.member_reports for select using (auth.uid() = reporter_id);

create index if not exists reports_status_idx   on public.member_reports(status, created_at desc);
create index if not exists reports_reported_idx on public.member_reports(reported_id);

-- Support tickets (Customer Service)
create table if not exists public.support_tickets (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  subject         text        not null,
  message         text        not null,
  category        text        not null default 'general'
                              check (category in ('general','billing','account','event','safety','other')),
  status          text        not null default 'open' check (status in ('open','in_progress','resolved','closed')),
  yande_response  text,
  needs_human     boolean     not null default false,
  resolved_at     timestamptz,
  created_at      timestamptz not null default now()
);

alter table public.support_tickets enable row level security;

create policy "tickets_insert_own"  on public.support_tickets for insert with check (auth.uid() = user_id);
create policy "tickets_read_own"    on public.support_tickets for select using (auth.uid() = user_id);
create policy "tickets_update_own"  on public.support_tickets for update using (auth.uid() = user_id);

create index if not exists tickets_user_idx   on public.support_tickets(user_id, created_at desc);
create index if not exists tickets_status_idx on public.support_tickets(status, created_at desc);
