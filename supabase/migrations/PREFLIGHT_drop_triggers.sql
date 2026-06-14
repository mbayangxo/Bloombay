-- PREFLIGHT: Drop all triggers that may already exist before running RUN_ALL
-- Run this FIRST, then run RUN_ALL_030_to_056.sql
-- Safe to run on any database state — all drops are IF EXISTS

drop trigger if exists bloom_note_flower_notify     on public.bloom_note_flowers;
drop trigger if exists host_review_notify           on public.host_reviews;
drop trigger if exists witness_notify               on public.event_witnesses;
drop trigger if exists bloom_trip_count_sync        on public.bloom_trip_attendees;
drop trigger if exists wellness_saves_count_sync    on public.wellness_saves;
drop trigger if exists profile_flower_notify        on public.profile_flowers;
drop trigger if exists tradition_follower_count_sync on public.tradition_followers;
drop trigger if exists trending_saves_count         on public.city_trending_saves;
drop trigger if exists avenue_saves_count           on public.avenue_content_saves;
drop trigger if exists trg_editor_instructions_updated_at on public.editor_instructions;
drop trigger if exists wall_bloom_up                on public.wall_posts;
drop trigger if exists wall_bloom_down              on public.wall_posts;
