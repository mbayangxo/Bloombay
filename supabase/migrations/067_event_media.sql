-- Add photo gallery, voice note, template, and accent color to gatherings
-- Supports the event template customizer and host media uploads

ALTER TABLE public.gatherings
  ADD COLUMN IF NOT EXISTS photo_urls     text[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS voice_note_url text,
  ADD COLUMN IF NOT EXISTS template       text    DEFAULT 'editorial',
  ADD COLUMN IF NOT EXISTS accent_color   text    DEFAULT '#FF1F7D';
