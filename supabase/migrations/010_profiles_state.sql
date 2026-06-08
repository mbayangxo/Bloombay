-- BloomBay 010: state on member profiles

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS state text;
