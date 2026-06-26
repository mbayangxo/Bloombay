-- Migration 120 — allow report_submitted in-app notifications (Blocker 1)
-- Extends notifications.type CHECK to match lib/notifications/templates.ts + legacy types.

ALTER TABLE public.notifications
  DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    -- Legacy (029 / 058)
    'flower', 'seat', 'event', 'message', 'club', 'club_accepted',
    'intro', 'celebrate', 'club_new_post', 'gathering',
    'weekly_prompt', 'founding_chat', 'early_access',
    -- 072
    'pin_drop',
    -- Notification service (113+)
    'private_beta_accepted', 'app_launch', 'phone_verification', 'urgent_safety',
    'reservation_requested', 'reservation_confirmed', 'reservation_cancelled',
    'club_joined', 'club_application_approved', 'club_application_rejected',
    'club_update', 'event_reminder', 'ticket_confirmed',
    'membership_activated', 'membership_confirmed', 'member_approved',
    'girlmate_message', 'bloom_request', 'bloom_request_accepted',
    'day3_nudge', 'day7_nudge', 'yande_nudge', 'yande_question',
    'verification_submitted', 'verification_approved', 'verification_rejected',
    -- Blocker 1
    'report_submitted'
  ));
