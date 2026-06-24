-- ── Magazine Pitches ────────────────────────────────────────────────────────────
-- Members submit article pitches; founder reviews and approves/rejects them.

CREATE TABLE IF NOT EXISTS magazine_pitches (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by  uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  section       text        NOT NULL CHECK (section IN ('style','culture','love','career','wellness','opinion')),
  headline      text        NOT NULL CHECK (char_length(headline) BETWEEN 5 AND 140),
  pitch_body    text        NOT NULL CHECK (char_length(pitch_body) BETWEEN 20 AND 1000),
  image_url     text,
  status        text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewer_note text,
  reviewed_by   uuid        REFERENCES profiles(id),
  reviewed_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mag_pitches_submitted  ON magazine_pitches(submitted_by);
CREATE INDEX IF NOT EXISTS idx_mag_pitches_status     ON magazine_pitches(status);
CREATE INDEX IF NOT EXISTS idx_mag_pitches_created    ON magazine_pitches(created_at DESC);

ALTER TABLE magazine_pitches ENABLE ROW LEVEL SECURITY;

-- Members can submit and read their own pitches
CREATE POLICY "member_insert_own" ON magazine_pitches
  FOR INSERT TO authenticated
  WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "member_read_own" ON magazine_pitches
  FOR SELECT TO authenticated
  USING (submitted_by = auth.uid());

-- Staff can read all pitches
CREATE POLICY "staff_read_all" ON magazine_pitches
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'founder', 'moderator', 'curator')
    )
  );

-- Staff can update (approve/reject)
CREATE POLICY "staff_update" ON magazine_pitches
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'founder', 'curator')
    )
  );

-- Service role full access
CREATE POLICY "service_role_all" ON magazine_pitches
  FOR ALL TO service_role USING (true) WITH CHECK (true);
