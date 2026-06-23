-- Yande Memory Agents — three new tables for the living memory graph
-- Migration 062

-- member_memory_graph: one row per member, updated continuously
-- This is Yande's living understanding of who each person is socially.
CREATE TABLE IF NOT EXISTS member_memory_graph (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid        REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  interests         text[]      DEFAULT '{}',
  energy_level      text        CHECK (energy_level IN ('high','medium','quiet')),
  social_style      text        CHECK (social_style IN ('planner','connector','observer','explorer')),
  attendance_count  integer     DEFAULT 0,
  clubs_joined      integer     DEFAULT 0,
  bloom_given       integer     DEFAULT 0,
  bloom_received    integer     DEFAULT 0,
  friendship_score  float       DEFAULT 0,         -- 0–100, overall connection health
  churn_risk        float       DEFAULT 0,          -- 0–1, probability of going quiet
  last_active_at    timestamptz,
  first_event_at    timestamptz,
  milestones        jsonb       DEFAULT '{}',       -- { first_event, first_bloom, first_plan, ... }
  ai_profile        text,                           -- AI-generated 2-sentence social profile
  raw_signals       jsonb       DEFAULT '{}',       -- last raw activity snapshot
  updated_at        timestamptz DEFAULT now()
);

-- memory_events: event sourcing — every social action lands here first
-- The memory-keeper cron reads these and updates member_memory_graph.
CREATE TABLE IF NOT EXISTS memory_events (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_type  text        NOT NULL,
  -- event_type values: event_attended, club_joined, bloom_sent, bloom_received,
  --                    plan_created, plan_joined, bloom_request_sent,
  --                    bloom_request_accepted, message_sent, profile_updated
  payload     jsonb       DEFAULT '{}',
  processed   boolean     DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- yande_messages: Yande's in-app messages to members
-- Surfaced in the Mailbox / messages page.
CREATE TABLE IF NOT EXISTS yande_messages (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message_type  text        NOT NULL,
  -- types: check_in, celebration, suggestion, introduction, milestone,
  --        community_insight, host_coaching, re_engagement
  subject       text,
  body          text        NOT NULL,
  is_read       boolean     DEFAULT false,
  action_url    text,
  metadata      jsonb       DEFAULT '{}',
  created_at    timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memory_events_unprocessed
  ON memory_events(created_at)
  WHERE processed = false;

CREATE INDEX IF NOT EXISTS idx_memory_events_user
  ON memory_events(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_yande_messages_user_unread
  ON yande_messages(user_id, is_read, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_member_memory_graph_churn
  ON member_memory_graph(churn_risk DESC, last_active_at);

-- yande_scientist_reports: weekly platform analysis from the Social Scientist agent
CREATE TABLE IF NOT EXISTS yande_scientist_reports (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  week_of      date        NOT NULL UNIQUE,
  report_text  text        NOT NULL,
  raw_data     jsonb       DEFAULT '{}',
  created_at   timestamptz DEFAULT now()
);

-- Helper function: record a memory event from anywhere in the app
CREATE OR REPLACE FUNCTION record_memory_event(
  p_user_id   uuid,
  p_type      text,
  p_payload   jsonb DEFAULT '{}'
) RETURNS uuid AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO memory_events (user_id, event_type, payload)
  VALUES (p_user_id, p_type, p_payload)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
