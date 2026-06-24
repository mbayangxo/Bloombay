-- ── Yande Action Infrastructure ─────────────────────────────────────────────
-- Stores AI-generated drafts (email, SMS, etc.) and an audit log of all
-- confirmed actions Yande has taken.

-- Drafts queue
CREATE TABLE IF NOT EXISTS yande_drafts (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  type               text        NOT NULL CHECK (type IN ('email','sms','reminder','announcement','event_copy','host_note')),
  mode               text        NOT NULL DEFAULT 'bloomBay',
  recipient_user_id  uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  recipient_email    text,
  recipient_phone    text,
  subject            text,
  body               text        NOT NULL,
  raw_body           text,
  context            jsonb,
  status             text        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','queued','sent','cancelled','failed')),
  error              text,
  sent_at            timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_yande_drafts_status  ON yande_drafts(status);
CREATE INDEX IF NOT EXISTS idx_yande_drafts_user    ON yande_drafts(recipient_user_id);
CREATE INDEX IF NOT EXISTS idx_yande_drafts_created ON yande_drafts(created_at DESC);

-- Confirmed action audit log
CREATE TABLE IF NOT EXISTS yande_action_log (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  action       text        NOT NULL,
  params       jsonb,
  result       jsonb,
  confirmed_by text        NOT NULL DEFAULT 'yande-mcp',
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_yande_log_action  ON yande_action_log(action);
CREATE INDEX IF NOT EXISTS idx_yande_log_created ON yande_action_log(created_at DESC);

-- RLS: service role only (MCP uses service role key)
ALTER TABLE yande_drafts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE yande_action_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON yande_drafts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "staff_read_drafts" ON yande_drafts
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin','founder','moderator')
  ));

CREATE POLICY "service_role_all_log" ON yande_action_log
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "staff_read_log" ON yande_action_log
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin','founder','moderator')
  ));

-- Club featuring
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS is_featured  boolean     DEFAULT false;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS featured_at  timestamptz;

-- Member suspension
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_at       timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspension_reason  text;
