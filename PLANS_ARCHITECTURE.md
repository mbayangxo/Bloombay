# Plans Feature — File Map

**Total: 24 files, ~8,487 lines**

---

## Page Components

| Path | Lines | Purpose |
|------|-------|---------|
| app/(member-portal)/member/plans/page.tsx | 1,982 | Main Plans hub — planner UI, plan creation, room management, day editor |
| app/(member-portal)/member/plans/[id]/room/page.tsx | 846 | Plan room detail — event info, agenda, attendee list, notes |
| app/(member-portal)/member/plans/[id]/ticket/page.tsx | 540 | Ticket/confirmation detail for individual plans |
| app/(member-portal)/member/plans/confirmations/page.tsx | 182 | List of all pending and confirmed plans |
| app/(member-portal)/member/plans/confirmations/[id]/page.tsx | 297 | Single confirmation detail with RSVP handling |
| app/(member-portal)/member/plans/tickets/page.tsx | 181 | Aggregated tickets list |
| app/(member-portal)/member/plans/day/page.tsx | 21 | Day view placeholder |

---

## Portal Components

| Path | Lines | Purpose |
|------|-------|---------|
| app/components/portal/bloomies-planner.tsx | 699 | Bloomies Planner — full plan UI, messaging, RSVP controls |
| app/components/portal/plan-room-page.tsx | 1,389 | Plan room — event details, attendees, agenda, chat |
| app/components/portal/plans-hub.tsx | 214 | Hub container — tabs for plans/calendar/rooms |
| app/components/portal/happening-plan-room.tsx | 107 | Plan room view for gathering happenings |
| app/components/portal/happening-plan-room-loader.tsx | 47 | Async loader wrapper for happening plan rooms |

---

## API Routes

| Path | Lines | Purpose |
|------|-------|---------|
| app/api/member/plans/route.ts | 130 | GET user's plans + invites (bloomies_plans, bloomies_plan_invites) |
| app/api/member/plans/confirmations/route.ts | 68 | GET plan confirmations and reservation status |
| app/api/member/plans/confirmations/[id]/route.ts | 96 | PATCH/POST confirmation updates and RSVP changes |

---

## Data Layer / Lib

| Path | Lines | Purpose |
|------|-------|---------|
| lib/actions/bloomies-planner.ts | 263 | Server actions — plan CRUD, RSVP, messaging, invites |
| lib/member-plans.ts | 45 | Plan counts + event RSVP integration (header badge) |
| lib/member-gathering-plans.ts | 93 | Gathering RSVP state with localStorage persistence |
| lib/plan-room-data.ts | 103 | Type definitions — attendees, messages, voice notes, chat |
| lib/club-planner-room.ts | 193 | Club event planning room — drafts, tickets, deposits |
| lib/gatherings-sync.ts | 32 | Gathering data sync |
| lib/gatherings-feed.ts | 65 | Gathering plans feed |

---

## Styles

| Path | Lines | Purpose |
|------|-------|---------|
| app/styles/bb-plans.css | 73 | Plans list, cards, tabs |
| app/styles/bb-plan-room.css | 500 | Plan room — attendees, agenda, chat, voice notes |

---

## DB Migrations

| Path | Lines | Purpose |
|------|-------|---------|
| supabase/migrations/040_bloomies_planner.sql | 82 | bloomies_plans, bloomies_plan_invites, bloomies_plan_messages schema |
| supabase/migrations/078_plans_emoji_column.sql | 2 | Adds emoji column to bloomies_plans |

---

## DB Tables (from migration 040)

- `bloomies_plans` — plan records (id, name, emoji, plan_type, date, venue, time, description, status, created_by)
- `bloomies_plan_invites` — invites per plan (plan_id, user_id, status: pending/going/maybe/declined)
- `bloomies_plan_messages` — chat messages per plan (plan_id, user_id, body, created_at)

---

## Key audit targets for ChatGPT

Priority files for a real code audit:

1. `app/(member-portal)/member/plans/page.tsx` — 1,982 lines, main page
2. `lib/actions/bloomies-planner.ts` — 263 lines, all server actions
3. `app/api/member/plans/route.ts` — 130 lines, main API
4. `app/components/portal/bloomies-planner.tsx` — 699 lines, planner UI
5. `supabase/migrations/040_bloomies_planner.sql` — 82 lines, schema
