-- Editor Instructions: founder's taste profile for each AI editor
-- Each editor (magazine, wellness, hanger, etc.) builds up a library of:
--   voice      → how to sound, who to write like, tone rules
--   reference  → article text or summary the founder loved — learn this style
--   correction → a specific piece the founder edited, with the "right" version
--   feedback   → general feedback on recent output ("too formal", "more attitude")

create table public.editor_instructions (
  id              uuid        primary key default gen_random_uuid(),
  editor_name     text        not null,   -- magazine | wellness | hanger | vanity | wall | reading-room | screening | working | column
  instruction_type text       not null check (instruction_type in ('voice', 'reference', 'correction', 'feedback')),
  instruction     text        not null,   -- the actual content (rule, article text, feedback)
  reference_title text,                   -- optional: title of a reference article
  original_content text,                  -- for corrections: what the editor wrote
  edited_content  text,                   -- for corrections: what the founder changed it to
  active          boolean     not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Index for fast lookup per editor (cron uses this every run)
create index idx_editor_instructions_editor on public.editor_instructions (editor_name, active);

-- Only admins/service role can manage editor instructions
alter table public.editor_instructions enable row level security;

create policy "editor_instructions_service_only"
  on public.editor_instructions
  using (false);  -- no public access; cron uses service role key

-- Trigger to keep updated_at fresh
create or replace function update_editor_instructions_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_editor_instructions_updated_at
  before update on public.editor_instructions
  for each row execute function update_editor_instructions_updated_at();
