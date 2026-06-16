-- Bloomies Planner™: group plans with RSVP and built-in group chat

CREATE TABLE IF NOT EXISTS bloomies_plans (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title        text NOT NULL,
  plan_type    text NOT NULL DEFAULT 'hangout'
               CHECK (plan_type IN ('dinner','birthday','hangout','trip','brunch','other')),
  description  text,
  date_time    timestamptz,
  venue        text,
  status       text NOT NULL DEFAULT 'active'
               CHECK (status IN ('active','cancelled','completed')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bloomies_plan_invites (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id      uuid NOT NULL REFERENCES bloomies_plans(id) ON DELETE CASCADE,
  invitee_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rsvp_status  text NOT NULL DEFAULT 'pending'
               CHECK (rsvp_status IN ('pending','yes','maybe','no')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(plan_id, invitee_id)
);

CREATE TABLE IF NOT EXISTS bloomies_plan_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id    uuid NOT NULL REFERENCES bloomies_plans(id) ON DELETE CASCADE,
  sender_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content    text NOT NULL CHECK (char_length(content) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bloomies_plans_creator   ON bloomies_plans(creator_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bloomies_invites_plan    ON bloomies_plan_invites(plan_id);
CREATE INDEX IF NOT EXISTS idx_bloomies_invites_invitee ON bloomies_plan_invites(invitee_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bloomies_messages_plan   ON bloomies_plan_messages(plan_id, created_at);

-- RLS
ALTER TABLE bloomies_plans         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloomies_plan_invites  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloomies_plan_messages ENABLE ROW LEVEL SECURITY;

-- Plans: visible to creator + invitees
CREATE POLICY "plan_select" ON bloomies_plans FOR SELECT
  USING (
    auth.uid() = creator_id
    OR EXISTS (SELECT 1 FROM bloomies_plan_invites WHERE plan_id = id AND invitee_id = auth.uid())
  );
CREATE POLICY "plan_insert" ON bloomies_plans FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "plan_update" ON bloomies_plans FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "plan_delete" ON bloomies_plans FOR DELETE USING (auth.uid() = creator_id);

-- Invites: creator can manage; invitees can update own RSVP and see all for the plan
CREATE POLICY "invite_select" ON bloomies_plan_invites FOR SELECT
  USING (
    invitee_id = auth.uid()
    OR EXISTS (SELECT 1 FROM bloomies_plans WHERE id = plan_id AND creator_id = auth.uid())
  );
CREATE POLICY "invite_insert" ON bloomies_plan_invites FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM bloomies_plans WHERE id = plan_id AND creator_id = auth.uid()));
CREATE POLICY "invite_update_rsvp" ON bloomies_plan_invites FOR UPDATE
  USING (invitee_id = auth.uid());

-- Messages: visible to plan members; plan members can send
CREATE POLICY "msg_select" ON bloomies_plan_messages FOR SELECT
  USING (
    sender_id = auth.uid()
    OR EXISTS (SELECT 1 FROM bloomies_plans WHERE id = plan_id AND creator_id = auth.uid())
    OR EXISTS (SELECT 1 FROM bloomies_plan_invites WHERE plan_id = bloomies_plan_messages.plan_id AND invitee_id = auth.uid())
  );
CREATE POLICY "msg_insert" ON bloomies_plan_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND (
      EXISTS (SELECT 1 FROM bloomies_plans WHERE id = plan_id AND creator_id = auth.uid())
      OR EXISTS (SELECT 1 FROM bloomies_plan_invites WHERE plan_id = bloomies_plan_messages.plan_id AND invitee_id = auth.uid())
    )
  );
