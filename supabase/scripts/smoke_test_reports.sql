-- ═══════════════════════════════════════════════════════════════════════════
-- smoke_test_reports.sql — run in Supabase SQL Editor AFTER API smoke test
-- Replace :REPORT_ID, :MEMBER_A_UUID, :MEMBER_B_UUID with real UUIDs
-- Prerequisites: migrations 060, 103, 115, 116, 119 applied on staging
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 0. Prerequisites (all must be true before smoke test) ─────────────────
SELECT 'member_reports' AS item,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'member_reports') AS ok
UNION ALL
SELECT 'moderation_cases',
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'moderation_cases')
UNION ALL
SELECT 'notification_events',
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notification_events')
UNION ALL
SELECT 'member_reports.hate_speech reason',
  EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'member_reports_reason_check'
      AND pg_get_constraintdef(oid) LIKE '%hate_speech%'
  )
UNION ALL
SELECT 'member_reports.human_review_required status',
  EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'member_reports_status_check'
      AND pg_get_constraintdef(oid) LIKE '%human_review_required%'
  );

-- ── 1. After POST /api/member/report (high severity: harassment) ────────────
-- Expect: exactly 1 member_reports row, 0 new user_reports, 1 moderation_cases

-- Latest report from Member A (replace UUID)
-- SELECT * FROM member_reports
-- WHERE reporter_id = ':MEMBER_A_UUID'
-- ORDER BY created_at DESC LIMIT 1;

-- No new user_reports since Blocker 1 (compare count before/after)
SELECT count(*) AS user_reports_total FROM user_reports;

SELECT id, reporter_id, reported_id, reason, severity, status, source_type, created_at
FROM member_reports
ORDER BY created_at DESC
LIMIT 5;

SELECT id, source_type, source_id, reported_user_id, reporter_id, severity, status, created_at
FROM moderation_cases
WHERE source_type = 'member_report'
ORDER BY created_at DESC
LIMIT 5;

-- Join: case.source_id should equal member_reports.id
SELECT
  mr.id AS report_id,
  mr.reason,
  mr.severity,
  mr.status AS report_status,
  mc.id AS case_id,
  mc.status AS case_status
FROM member_reports mr
LEFT JOIN moderation_cases mc
  ON mc.source_type = 'member_report' AND mc.source_id = mr.id::text
ORDER BY mr.created_at DESC
LIMIT 5;

-- ── 2. After PATCH resolve (admin) ──────────────────────────────────────────
-- Expect: moderation_cases.status = resolved, member_reports.status = resolved

-- SELECT status, resolved_by, resolved_at, admin_notes
-- FROM member_reports WHERE id = ':REPORT_ID';

-- ── 3. Reporter in-app notification ───────────────────────────────────────
-- Expect: notification_events row for reporter, type report_submitted

SELECT id, user_id, type, channels, status, created_at
FROM notification_events
WHERE type = 'report_submitted'
ORDER BY created_at DESC
LIMIT 5;

-- Also check delivered in_app notification if processor ran:
SELECT id, user_id, type, read, created_at
FROM notifications
WHERE type = 'report_submitted'
ORDER BY created_at DESC
LIMIT 5;

-- ── 4. user_reports freeze (119) ───────────────────────────────────────────
-- Direct insert should fail for authenticated member via RLS:
-- policy user_reports_insert_frozen has WITH CHECK (false)

SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'user_reports' AND schemaname = 'public';
