-- Supplemental indexes — Migration 110
-- Picks up what the ChatGPT audit flagged that was real and still missing
-- after migration 109. All statements use IF NOT EXISTS — safe to re-run.

-- ── CLUBS ─────────────────────────────────────────────────────────────────────
-- Lifecycle filtering: draft → active → archived
create index if not exists clubs_status_idx
  on public.clubs(status);

-- ── POST_COMMENTS ─────────────────────────────────────────────────────────────
-- Per-post comment feeds sorted by time.
-- The existing post_comments_wall/fashion/avenue_idx indexes are simple FK
-- lookups without ordering; these compound partials cover sorted pagination.

create index if not exists post_comments_wall_created_idx
  on public.post_comments(wall_post_id, created_at desc)
  where wall_post_id is not null;

create index if not exists post_comments_fashion_created_idx
  on public.post_comments(fashion_post_id, created_at desc)
  where fashion_post_id is not null;

create index if not exists post_comments_avenue_created_idx
  on public.post_comments(avenue_content_id, created_at desc)
  where avenue_content_id is not null;

-- ── GIRLMATE_MESSAGES ────────────────────────────────────────────────────────
-- Thread for a specific listing/profile (listing_id is nullable FK)
create index if not exists girlmate_messages_listing_idx
  on public.girlmate_messages(listing_id, created_at desc)
  where listing_id is not null;

-- Conversation thread between two users (ordered inbox view)
create index if not exists girlmate_messages_pair_idx
  on public.girlmate_messages(from_user_id, to_user_id, created_at desc);
