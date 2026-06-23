-- Add founding member designation
alter table public.profiles
  add column if not exists is_founding_member boolean not null default false;

-- Seed: The first founding member (mbayangskin@gmail.com is bloom_code #1)
update public.profiles
  set is_founding_member = true, bloom_code = 1
  where email = 'mbayangskin@gmail.com';

-- Set the sequence to start after 1
select setval('bloom_code_seq', coalesce((select max(bloom_code) from public.profiles), 1));
