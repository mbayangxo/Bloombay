-- Cron run audit log
CREATE TABLE IF NOT EXISTS cron_logs (
  id         bigserial PRIMARY KEY,
  job        text NOT NULL,
  result     text NOT NULL CHECK (result IN ('ok', 'skipped', 'error')),
  details    jsonb,
  ran_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cron_logs_job_ran_at ON cron_logs (job, ran_at DESC);

-- Service role only — cron jobs write, admins read
ALTER TABLE cron_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_cron_logs"
  ON cron_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'founder')
    )
  );
