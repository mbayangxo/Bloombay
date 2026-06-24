-- ── App-wide Content Moderation Queue ──────────────────────────────────────────
-- Stores automated fact-check results for any content type.
-- source_table + source_id = polymorphic reference to the flagged content.

CREATE TABLE IF NOT EXISTS content_moderation (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  source_table  text        NOT NULL,
  source_id     uuid        NOT NULL,
  content_type  text        NOT NULL,
  content_text  text,
  verdict       text        NOT NULL DEFAULT 'needs_review',
  risk_score    int         NOT NULL DEFAULT 0,
  flags         jsonb,
  summary       text,
  auto_flagged  boolean     NOT NULL DEFAULT true,
  reviewed_by   uuid        REFERENCES profiles(id),
  reviewed_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_mod_verdict  ON content_moderation(verdict);
CREATE INDEX IF NOT EXISTS idx_content_mod_source   ON content_moderation(source_table, source_id);
CREATE INDEX IF NOT EXISTS idx_content_mod_created  ON content_moderation(created_at DESC);

ALTER TABLE content_moderation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON content_moderation
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "moderation_staff_read" ON content_moderation
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'founder', 'moderator', 'curator')
    )
  );

CREATE POLICY "moderation_staff_update" ON content_moderation
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'founder', 'moderator')
    )
  );
