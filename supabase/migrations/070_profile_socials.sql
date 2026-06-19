-- Add optional social handle columns to profiles table
-- Users opt-in to displaying socials publicly via show_socials flag
alter table public.profiles
  add column if not exists instagram    text,
  add column if not exists tiktok       text,
  add column if not exists twitter      text,
  add column if not exists pinterest    text,
  add column if not exists spotify      text,
  add column if not exists website      text,
  add column if not exists show_socials boolean not null default false;
