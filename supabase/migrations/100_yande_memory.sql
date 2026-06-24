-- ── Yande Memory Layer ───────────────────────────────────────────────────────
-- Stores what Yande knows about each member: interests, personality, life stage,
-- and freeform notes that accumulate over time. Powers personalised messaging.

CREATE TABLE yande_user_context (
  user_id           uuid        PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  interests         text[]      NOT NULL DEFAULT '{}',
  life_stage        text        CHECK (life_stage IN ('new_in_city','settled','relocating','exploring','transitioning')),
  social_comfort    text        CHECK (social_comfort IN ('shy','introvert','ambivert','extrovert')),
  group_size_pref   text        CHECK (group_size_pref IN ('small','medium','large','any')),
  neighborhoods     text[]      NOT NULL DEFAULT '{}',
  relationship_stage text       NOT NULL DEFAULT 'stranger'
                                CHECK (relationship_stage IN ('stranger','new_friend','friend','close_friend','club_member','host')),
  notes             text,       -- Yande's freeform running notes about this person
  last_updated      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_yande_context_stage     ON yande_user_context(relationship_stage);
CREATE INDEX IF NOT EXISTS idx_yande_context_life      ON yande_user_context(life_stage);
CREATE INDEX IF NOT EXISTS idx_yande_context_updated   ON yande_user_context(last_updated DESC);

ALTER TABLE yande_user_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON yande_user_context
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "staff_read_context" ON yande_user_context
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin','founder','moderator','curator')
  ));
