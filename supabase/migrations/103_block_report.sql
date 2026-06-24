-- Block and report system for member safety
-- Blocks prevent all contact between two users.
-- Reports are reviewed by admins/moderators.

CREATE TABLE IF NOT EXISTS user_blocks (
  id          bigserial PRIMARY KEY,
  blocker_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);

CREATE INDEX IF NOT EXISTS user_blocks_blocker ON user_blocks (blocker_id);
CREATE INDEX IF NOT EXISTS user_blocks_blocked ON user_blocks (blocked_id);

ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;

-- Users manage their own blocks
CREATE POLICY "blocks_insert_own"
  ON user_blocks FOR INSERT
  WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "blocks_select_own"
  ON user_blocks FOR SELECT
  USING (auth.uid() = blocker_id);

CREATE POLICY "blocks_delete_own"
  ON user_blocks FOR DELETE
  USING (auth.uid() = blocker_id);

-- Reports table
CREATE TABLE IF NOT EXISTS user_reports (
  id              bigserial PRIMARY KEY,
  reporter_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason          text NOT NULL CHECK (reason IN (
                    'harassment', 'spam', 'fake_profile', 'inappropriate_content',
                    'hate_speech', 'scam', 'other'
                  )),
  details         text,
  source_type     text,  -- 'girlmate_message', 'bloom_request', 'wall_post', 'profile', etc.
  source_id       text,
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes     text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  reviewed_at     timestamptz,
  CHECK (reporter_id <> reported_id)
);

CREATE INDEX IF NOT EXISTS user_reports_reporter ON user_reports (reporter_id);
CREATE INDEX IF NOT EXISTS user_reports_reported ON user_reports (reported_id);
CREATE INDEX IF NOT EXISTS user_reports_status ON user_reports (status, created_at DESC);

ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- Users can create reports and view their own
CREATE POLICY "reports_insert_own"
  ON user_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "reports_select_own"
  ON user_reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- Admins see all
CREATE POLICY "reports_admin_all"
  ON user_reports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'founder', 'moderator')
    )
  );
