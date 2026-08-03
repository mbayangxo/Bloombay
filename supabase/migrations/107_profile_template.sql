-- 107_profile_template.sql
-- The Apartment / Profile "background style" picker (PROFILE_TEMPLATES in
-- lounge-page.tsx) only ever wrote its selection to localStorage — it never
-- persisted, so it didn't survive across devices/sessions and wasn't real
-- data. Give it a real column so selecting a template actually sticks.

alter table public.profiles
  add column if not exists profile_template_id text not null default 'bloom';
