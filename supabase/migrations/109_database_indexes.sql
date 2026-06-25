-- Database index + scale hardening — Migration 109
-- Adds missing indexes for the query patterns that break first at scale.
-- All statements use IF NOT EXISTS — safe to re-run.

-- ── PROFILES ─────────────────────────────────────────────────────────────────
-- role index already exists (profiles_role_idx)

-- Member status: queried on every protected page load
create index if not exists profiles_is_member_idx
  on public.profiles(is_member, created_at desc);

-- Location discovery: used in girlmate, introductions, city feeds
create index if not exists profiles_city_neighborhood_idx
  on public.profiles(city, neighborhood);

-- Admin/onboarding flows
create index if not exists profiles_verification_status_idx
  on public.profiles(verification_status);

create index if not exists profiles_onboarding_completed_idx
  on public.profiles(onboarding_completed)
  where onboarding_completed = false;

-- ── CLUBS ─────────────────────────────────────────────────────────────────────
-- owner_id and slug indexes already exist

-- Discovery / filtering
create index if not exists clubs_category_idx
  on public.clubs(category);

create index if not exists clubs_created_at_idx
  on public.clubs(created_at desc);

-- ── CLUB_MEMBERSHIPS ──────────────────────────────────────────────────────────
-- (user_id) index already exists

-- "Who's in this club?" — high-traffic join query
create index if not exists club_memberships_slug_idx
  on public.club_memberships(club_slug, joined_at desc);

-- ── GATHERINGS ────────────────────────────────────────────────────────────────
-- starts_at and curated_by_admin indexes already exist

-- Upcoming published happenings feed
create index if not exists gatherings_published_starts_at_idx
  on public.gatherings(is_published, starts_at desc);

-- Club's upcoming events
create index if not exists gatherings_club_slug_starts_at_idx
  on public.gatherings(club_slug, starts_at desc)
  where club_slug is not null;

-- Location-based browsing (area = neighborhood)
create index if not exists gatherings_area_starts_at_idx
  on public.gatherings(area, starts_at desc)
  where is_published = true;

-- Ticket lookups by event
create index if not exists gatherings_is_free_published_idx
  on public.gatherings(is_free, is_published, starts_at desc);

-- ── EVENTS ────────────────────────────────────────────────────────────────────
-- needs_review partial index already exists

-- Happenings feed: upcoming published events by city + date
create index if not exists events_city_date_idx
  on public.events(city, date_time desc)
  where is_published = true;

-- Category filtering
create index if not exists events_category_date_idx
  on public.events(category, date_time desc)
  where is_published = true;

-- User's created events (host dashboard)
create index if not exists events_created_by_idx
  on public.events(created_by, created_at desc);

-- Visibility gating
create index if not exists events_visibility_published_idx
  on public.events(visibility, is_published, date_time desc);

-- ── EVENT_ATTENDEES ───────────────────────────────────────────────────────────
-- Primary key (event_id, user_id) exists — but no non-PK indexes

-- User's event history
create index if not exists event_attendees_user_idx
  on public.event_attendees(user_id, joined_at desc);

-- Event's attendee list / count
create index if not exists event_attendees_event_idx
  on public.event_attendees(event_id, joined_at desc);

-- ── NOTIFICATIONS ────────────────────────────────────────────────────────────
-- (user_id, created_at desc) index already exists (notifs_user_idx)

-- Unread notification badge — critical partial index
create index if not exists notifications_unread_idx
  on public.notifications(user_id, created_at desc)
  where read = false;

-- Type-filtered notification queries
create index if not exists notifications_user_type_idx
  on public.notifications(user_id, type, created_at desc);

-- ── CONVERSATIONS & DIRECT_MESSAGES ──────────────────────────────────────────
-- dm_convo_idx (conversation_id, created_at desc) and cp_user_idx already exist

-- Conversation list for a user, ordered by last activity
create index if not exists conversation_participants_user_activity_idx
  on public.conversation_participants(user_id, last_read_at desc);

-- Unread conversations (last_read_at before the last message)
create index if not exists conversations_last_message_idx
  on public.conversations(last_message_at desc);

-- Sender message history
create index if not exists direct_messages_sender_idx
  on public.direct_messages(sender_id, created_at desc);

-- ── GIRLMATE ─────────────────────────────────────────────────────────────────
-- GIN, city, type, created_at indexes already exist on girlmate_profiles

-- Girlmate messages inbox
create index if not exists girlmate_messages_to_user_idx
  on public.girlmate_messages(to_user_id, created_at desc);

-- Unread girlmate messages
create index if not exists girlmate_messages_unread_idx
  on public.girlmate_messages(to_user_id, read, created_at desc)
  where read = false;

-- Sent messages history
create index if not exists girlmate_messages_from_user_idx
  on public.girlmate_messages(from_user_id, created_at desc);

-- Active profiles only
create index if not exists girlmate_profiles_active_idx
  on public.girlmate_profiles(is_active, created_at desc)
  where is_active = true;

-- ── HANGER ────────────────────────────────────────────────────────────────────
-- seller_idx, category_idx, created_idx, city_idx, messages indexes already exist

-- Seller's inventory with status (active vs sold)
create index if not exists hanger_listings_seller_status_idx
  on public.hanger_listings(seller_id, status, created_at desc);

-- Seller earnings / sales history
create index if not exists hanger_sales_seller_idx
  on public.hanger_sales(seller_id, created_at desc);

-- Buyer purchase history
create index if not exists hanger_sales_buyer_idx
  on public.hanger_sales(buyer_id, created_at desc);

-- Hanger message inbox with paging (partial unread index exists; add compound for paging)
create index if not exists hanger_messages_recipient_read_idx
  on public.hanger_messages(recipient_id, is_read, created_at desc);

-- ── WALL POSTS & REACTIONS ────────────────────────────────────────────────────
-- created_at, category, and post_comments/post_flowers indexes already exist

-- User's own posts (profile wall)
create index if not exists wall_posts_author_idx
  on public.wall_posts(author_id, created_at desc);

-- User's given blooms on wall posts
create index if not exists wall_post_blooms_user_idx
  on public.wall_post_blooms(user_id, created_at desc);

-- User's flowers on any content type
create index if not exists post_flowers_user_idx
  on public.post_flowers(user_id, created_at desc);

-- User's comment flowers
create index if not exists comment_flowers_user_idx
  on public.comment_flowers(user_id, created_at desc);

-- ── PURCHASES ────────────────────────────────────────────────────────────────
-- user_id and created_at indexes already exist

-- Transaction type analytics
create index if not exists purchases_type_idx
  on public.purchases(type, created_at desc);

-- Payment status filtering
create index if not exists purchases_status_idx
  on public.purchases(status, created_at desc);

-- Webhook lookup by Stripe session
create index if not exists purchases_stripe_session_idx
  on public.purchases(stripe_session_id)
  where stripe_session_id is not null;

-- ── PENDING_ORDERS ────────────────────────────────────────────────────────────
-- user_idx, session_idx, status_idx already exist (from migration 108)

-- User's order status (for order history page)
create index if not exists pending_orders_user_status_idx
  on public.pending_orders(user_id, status, created_at desc);

-- Actor-level audit trail
create index if not exists payment_audit_actor_idx
  on public.payment_audit_logs(actor_id, created_at desc)
  where actor_id is not null;

-- ── TICKETS ───────────────────────────────────────────────────────────────────
-- user_idx and event_idx already exist (from migration 108)

-- Prevent duplicate tickets: one confirmed ticket per user per event
create unique index if not exists tickets_user_event_unique
  on public.tickets(user_id, event_id)
  where status = 'confirmed';

-- ── SEAT_RESERVATIONS ────────────────────────────────────────────────────────
-- active unique and user_idx already exist

-- Count/list all reservations for a given gathering
create index if not exists seat_reservations_gathering_idx
  on public.seat_reservations(gathering_id, status, created_at desc);

-- ── GATHERING_ATTENDANCE ─────────────────────────────────────────────────────
-- user_idx already exists

-- Attendee list per event
create index if not exists gathering_attendance_event_idx
  on public.gathering_attendance(gathering_id, checked_in_at desc);

-- ── PIN_DROPS ─────────────────────────────────────────────────────────────────
-- No indexes exist on this table

-- Active pins feed (sorted by expiry)
create index if not exists pin_drops_expires_at_idx
  on public.pin_drops(expires_at desc);

-- Active pins only
create index if not exists pin_drops_active_idx
  on public.pin_drops(user_id, expires_at desc)
  where expires_at > now();

-- Who joined which pins
create index if not exists pin_drop_joins_user_idx
  on public.pin_drop_joins(user_id, joined_at desc);

create index if not exists pin_drop_joins_pin_idx
  on public.pin_drop_joins(pin_id, joined_at desc);

-- ── BLOOM_NOTE_FLOWERS ───────────────────────────────────────────────────────
-- (note_id, user_id) PK exists; bloom_notes_place_idx and bloom_notes_author_idx exist

-- User's given flowers on notes
create index if not exists bloom_note_flowers_user_idx
  on public.bloom_note_flowers(user_id, created_at desc);
