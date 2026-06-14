-- PREFLIGHT: Drop all triggers safely (handles missing tables too)
-- Run this FIRST, then run RUN_ALL_030_to_056.sql

DO $$ BEGIN DROP TRIGGER IF EXISTS bloom_note_flower_notify ON public.bloom_note_flowers; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP TRIGGER IF EXISTS host_review_notify ON public.host_reviews; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP TRIGGER IF EXISTS witness_notify ON public.event_witnesses; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP TRIGGER IF EXISTS bloom_trip_count_sync ON public.bloom_trip_attendees; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP TRIGGER IF EXISTS wellness_saves_count_sync ON public.wellness_saves; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP TRIGGER IF EXISTS profile_flower_notify ON public.profile_flowers; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP TRIGGER IF EXISTS tradition_follower_count_sync ON public.tradition_followers; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP TRIGGER IF EXISTS trending_saves_count ON public.city_trending_saves; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP TRIGGER IF EXISTS avenue_saves_count ON public.avenue_content_saves; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP TRIGGER IF EXISTS trg_editor_instructions_updated_at ON public.editor_instructions; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP TRIGGER IF EXISTS wall_bloom_up ON public.wall_posts; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN DROP TRIGGER IF EXISTS wall_bloom_down ON public.wall_posts; EXCEPTION WHEN undefined_table THEN NULL; END $$;
