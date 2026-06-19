-- Memory Event Triggers — Migration 063
--
-- These triggers automatically write to memory_events whenever a social action
-- happens anywhere in the database. Yande's memory-keeper cron picks them up.
-- This means NO code changes are needed in existing routes — the memory system
-- fills itself.

-- ── Shared trigger function ────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION yande_emit_memory_event()
RETURNS trigger AS $$
DECLARE
  v_user_id   uuid;
  v_type      text;
  v_payload   jsonb;
BEGIN
  -- Determine user and event type based on table + operation
  CASE TG_TABLE_NAME

    WHEN 'event_attendees' THEN
      v_user_id := NEW.user_id;
      v_type    := 'event_attended';
      v_payload := jsonb_build_object('event_id', NEW.event_id);

    WHEN 'event_checkins' THEN
      v_user_id := NEW.user_id;
      v_type    := 'event_attended';
      v_payload := jsonb_build_object('event_id', NEW.event_id, 'source', 'checkin');

    WHEN 'club_memberships' THEN
      v_user_id := NEW.user_id;
      v_type    := 'club_joined';
      v_payload := jsonb_build_object('club_id', NEW.club_id);

    WHEN 'wall_post_blooms' THEN
      -- Bloom sender
      v_user_id := NEW.user_id;
      v_type    := 'bloom_sent';
      v_payload := jsonb_build_object('post_id', NEW.post_id);

      INSERT INTO public.memory_events (user_id, event_type, payload)
      VALUES (v_user_id, v_type, v_payload);

      -- Also credit the post author with bloom_received
      INSERT INTO public.memory_events (user_id, event_type, payload)
      SELECT wp.author_id, 'bloom_received',
             jsonb_build_object('post_id', NEW.post_id, 'from_user_id', NEW.user_id)
      FROM   public.wall_posts wp
      WHERE  wp.id = NEW.post_id
        AND  wp.author_id IS NOT NULL
        AND  wp.author_id <> NEW.user_id;

      RETURN NEW;  -- already inserted, return early

    WHEN 'introductions' THEN
      -- When an introduction is accepted, record for the accepting user
      IF NEW.status = 'accepted' AND (OLD IS NULL OR OLD.status <> 'accepted') THEN
        v_user_id := NEW.receiver_id;
        v_type    := 'bloom_request_accepted';
        v_payload := jsonb_build_object(
          'sender_id',       NEW.sender_id,
          'introduction_id', NEW.id
        );

        INSERT INTO public.memory_events (user_id, event_type, payload)
        VALUES (v_user_id, v_type, v_payload);

        -- Also record for the sender
        INSERT INTO public.memory_events (user_id, event_type, payload)
        VALUES (NEW.sender_id, 'bloom_request_accepted',
                jsonb_build_object('receiver_id', NEW.receiver_id, 'introduction_id', NEW.id));
      END IF;
      RETURN NEW;

    WHEN 'bloom_bouquet' THEN
      -- When added to someone's bouquet
      v_user_id := NEW.user_id;
      v_type    := 'bloom_request_sent';
      v_payload := jsonb_build_object('target_user_id', NEW.bloomie_id);

    WHEN 'direct_messages' THEN
      v_user_id := NEW.sender_id;
      v_type    := 'message_sent';
      v_payload := jsonb_build_object('conversation_id', NEW.conversation_id);

    ELSE
      RETURN NEW;  -- unknown table, no-op
  END CASE;

  -- Insert the memory event (for tables that reach here without early return)
  IF v_user_id IS NOT NULL AND v_type IS NOT NULL THEN
    INSERT INTO public.memory_events (user_id, event_type, payload)
    VALUES (v_user_id, v_type, v_payload);
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Never block the original operation due to memory event failure
    RAISE WARNING '[Yande] memory trigger error on %: %', TG_TABLE_NAME, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ── Attach triggers ────────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS yande_event_attended     ON public.event_attendees;
CREATE TRIGGER yande_event_attended
  AFTER INSERT ON public.event_attendees
  FOR EACH ROW EXECUTE FUNCTION yande_emit_memory_event();

DROP TRIGGER IF EXISTS yande_event_checkin      ON public.event_checkins;
CREATE TRIGGER yande_event_checkin
  AFTER INSERT ON public.event_checkins
  FOR EACH ROW EXECUTE FUNCTION yande_emit_memory_event();

DROP TRIGGER IF EXISTS yande_club_joined        ON public.club_memberships;
CREATE TRIGGER yande_club_joined
  AFTER INSERT ON public.club_memberships
  FOR EACH ROW EXECUTE FUNCTION yande_emit_memory_event();

DROP TRIGGER IF EXISTS yande_bloom_sent         ON public.wall_post_blooms;
CREATE TRIGGER yande_bloom_sent
  AFTER INSERT ON public.wall_post_blooms
  FOR EACH ROW EXECUTE FUNCTION yande_emit_memory_event();

DROP TRIGGER IF EXISTS yande_intro_accepted     ON public.introductions;
CREATE TRIGGER yande_intro_accepted
  AFTER INSERT OR UPDATE OF status ON public.introductions
  FOR EACH ROW EXECUTE FUNCTION yande_emit_memory_event();

DROP TRIGGER IF EXISTS yande_bouquet_bloom      ON public.bloom_bouquet;
CREATE TRIGGER yande_bouquet_bloom
  AFTER INSERT ON public.bloom_bouquet
  FOR EACH ROW EXECUTE FUNCTION yande_emit_memory_event();

DROP TRIGGER IF EXISTS yande_message_sent       ON public.direct_messages;
CREATE TRIGGER yande_message_sent
  AFTER INSERT ON public.direct_messages
  FOR EACH ROW EXECUTE FUNCTION yande_emit_memory_event();


-- ── Backfill helper ───────────────────────────────────────────────────────────
-- Run once after applying this migration to seed historical events.
-- Only inserts events that don't already exist in memory_events.

CREATE OR REPLACE FUNCTION yande_backfill_memory_events() RETURNS integer AS $$
DECLARE
  v_count integer := 0;
BEGIN
  -- Event attendances
  INSERT INTO public.memory_events (user_id, event_type, payload, created_at)
  SELECT ea.user_id,
         'event_attended',
         jsonb_build_object('event_id', ea.event_id, 'source', 'backfill'),
         ea.created_at
  FROM   public.event_attendees ea
  WHERE  NOT EXISTS (
    SELECT 1 FROM public.memory_events me
    WHERE  me.user_id = ea.user_id
      AND  me.event_type = 'event_attended'
      AND  me.payload->>'event_id' = ea.event_id::text
  );
  GET DIAGNOSTICS v_count = ROW_COUNT;

  -- Club memberships
  INSERT INTO public.memory_events (user_id, event_type, payload, created_at)
  SELECT cm.user_id,
         'club_joined',
         jsonb_build_object('club_id', cm.club_id, 'source', 'backfill'),
         cm.created_at
  FROM   public.club_memberships cm
  WHERE  NOT EXISTS (
    SELECT 1 FROM public.memory_events me
    WHERE  me.user_id = cm.user_id
      AND  me.event_type = 'club_joined'
      AND  me.payload->>'club_id' = cm.club_id::text
  );
  GET DIAGNOSTICS v_count = v_count + ROW_COUNT;

  -- Bloom reactions
  INSERT INTO public.memory_events (user_id, event_type, payload, created_at)
  SELECT wpb.user_id,
         'bloom_sent',
         jsonb_build_object('post_id', wpb.post_id, 'source', 'backfill'),
         wpb.created_at
  FROM   public.wall_post_blooms wpb
  WHERE  NOT EXISTS (
    SELECT 1 FROM public.memory_events me
    WHERE  me.user_id = wpb.user_id
      AND  me.event_type = 'bloom_sent'
      AND  me.payload->>'post_id' = wpb.post_id::text
  );
  GET DIAGNOSTICS v_count = v_count + ROW_COUNT;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION yande_backfill_memory_events IS
  'Run once after applying migration 063 to seed historical activity into memory_events. Returns total rows inserted.';
