-- Add emoji column to bloomies_plans so each plan can have its own visual identity
ALTER TABLE bloomies_plans ADD COLUMN IF NOT EXISTS emoji text;
