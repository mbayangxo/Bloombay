# Yande Architecture

> **Yande is memory + steering, not a chatbot.** Reads real behavior from Supabase and nudges members toward IRL-fit clubs, gatherings, and introductions.

Policy: `YANDE_SMS_POLICY.md` · Roadmap: `docs/TRUTH-ROADMAP.md` Phase 3

---

## Philosophy

| Yande is | Yande is not |
|----------|----------------|
| Rules-first recommendations from attendance & RSVP | Open-ended GPT companion |
| Explainable nudges (“you skip nightlife, you show up to dinners”) | Fake chemistry percentages |
| Background agents (cron) + light UI copy | Always-on chat UI (V1) |
| Fed by `member_behavior_signals` | Fed by marketing personas |

**Example steering** (from TRUTH-ROADMAP):

> You attended 5 dinners · you skip nightlife · you linger at creative gatherings → next nudge: brunch + gallery, not rooftop party.

---

## Data layers

```
Member action (RSVP, check-in, mood, intro request)
        ↓
member_behavior_signals  ← lib/truth/behavior.ts (logBehaviorSignal)
        ↓
Aggregation (rules → lib/yande-memory.ts, lib/yande-member-profile.ts)
        ↓
yande_signals / yande_user_context / memory_events
        ↓
UI nudge OR cron-drafted message OR founder Yande Mission Center
```

### Core tables

| Table | Migration | Purpose |
|-------|-----------|---------|
| `member_behavior_signals` | 006 | Raw event log (`user_id`, `signal_type`, `payload`) |
| `member_preferences` | 064–065 | Explicit prefs (vibe, mood, availability) |
| `yande_signals` | 083 | Structured signals for learning loop |
| `yande_user_context` | 100 | Per-member memory blob / summary |
| `yande_actions` | 059 | Logged agent actions |
| `yande_action_log` | 099 | Audit trail |
| `member_memory_graph` | 062 | Graph edges between memories |
| `memory_events` | 062–063 | Timeline events (triggers auto-write) |
| `yande_messages` | 062 | Draft/sent proactive messages |
| `yande_questions` | 076 | Bloom card / game questions |
| `member_question_responses` | 076 | Answers |
| `yande_match_outcomes` | 083 | Intro match results for learning |
| `yande_compat_weights` | 083 | Learned compatibility weights |
| `yande_match_queue` | 083 | Pending match suggestions |
| `yande_scientist_reports` | 062 | Analyst agent output |
| `yande_memories` | 049 | Long-form memory snippets |

---

## Signal types (behavior log)

From `006_member_truth_layer.sql` and `lib/truth/behavior.ts`:

- `attended_irl`, `rsvp_reserved`, `rsvp_cancelled`
- `mood_set`, `calendar_add`
- `bloom_request_sent`, `bloom_request_accepted`, `bloom_request_declined`
- `witness_submitted`, `club_joined`, `stamp_earned`
- Future: dwell time, decline reasons, brunch vs nightlife splits

---

## Code map

### Client / member-facing

| File | Role |
|------|------|
| `lib/yande-signal.ts` | `sendYandeSignal()`, `useYandeSignal()` hook |
| `lib/yande-memory.ts` | Local + API sync of preference memory |
| `lib/yande-member-state.ts` | Member state for recommendations |
| `lib/yande-member-profile.ts` | Profile context for matching |
| `lib/yande-recommendations.ts` | Rule-based recommendation copy + links |

### Server agents (`lib/yande/`)

| Module | Role |
|--------|------|
| `core.ts` | `logAction()` → `yande_actions` |
| `matching.ts` | Introduction / compat scoring |
| `scheduling.ts` | When to nudge, calendar fit |
| `memory-keeper.ts` | Consolidate `memory_events` |
| `messages.ts` | Draft proactive messages |
| `community-coordinator.ts` | Club/community health |
| `post-event.ts` | After-gathering follow-ups |
| `safety.ts` | Escalation hooks |
| `customer-service.ts` | Support routing |
| `operations.ts` | Ops batch tasks |
| `voice.ts` | Copy tone / templates |

### API routes

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/yande/signal` | POST | Ingest signal |
| `/api/yande/memory` | POST | Update memory |
| `/api/yande/context` | GET, POST | Read/write `yande_user_context` |
| `/api/yande/learn` | POST | Learning loop update |
| `/api/yande/support` | POST | Support escalation |
| `/api/member/behavior` | POST | Member behavior log |
| `/api/member/yande-question` | GET, POST | Bloom card Q&A |

### Cron agents (`/api/cron/`)

| Cron | Agent |
|------|-------|
| `yande-host` | Host coaching |
| `yande-messages` | Message drafts |
| `yande-community` | Community coordinator |
| `yande-scientist` | Analyst reports |
| `memory-keeper` | Memory consolidation |
| `memory-layer` | Graph updates |
| `friendship-health` | Intro health scores |
| `scheduling` | Calendar nudges |

All cron routes: **POST**, service role Supabase, scheduled via Vercel Cron.

### Founder UI

- Page: `/founder/yande`
- Component: `app/components/admin/portal/yande-mission-center.tsx`

---

## Truthful mode

```bash
NEXT_PUBLIC_BLOOMBAY_TRUTHFUL=1   # default — writes go to Supabase first
```

`lib/yande-memory.ts` posts to `/api/yande/memory` when truthful; falls back to localStorage only when API fails (optional `NEXT_PUBLIC_BLOOMBAY_DEMO_FALLBACK=1` for offline dev).

---

## Introductions (Girl Match) integration

V2 introductions should be **Yande-suggested**, not swipe-based:

1. Both members verified + attended ≥1 gathering
2. `yande_match_queue` proposes pairs with **explainable reasons** (shared club, vibe, calendar overlap)
3. `bloom_requests` / `introductions` for mutual opt-in
4. `yande_match_outcomes` feeds `yande_compat_weights` learning loop

Tables: `060_introductions_safety.sql`, `069_come_with_me_bloom_requests.sql`, `083_yande_learning.sql`

---

## Rollout gates (recommended)

| Gate | Threshold |
|------|-----------|
| Show Yande one-liner on home | ≥3 `member_behavior_signals` or 1 attendance |
| Proactive SMS/push | Beta list only (`YANDE_SMS_POLICY.md`) |
| Introductions V2 public | City density + verification Phase 2 complete |
| LLM-generated copy | After rules engine validated on real data |

---

## Hardening

| Migration | Purpose |
|-----------|---------|
| `106_yande_hardening.sql` | Moderation task queue for Yande outputs |
| `097_content_moderation.sql` | Shared moderation pipeline |

---

## Adding a new Yande capability

1. Define `signal_type` in `logBehaviorSignal()` if new member action
2. Emit signal from API route or client via `sendYandeSignal()`
3. Add aggregation rule in `lib/yande-recommendations.ts` or agent module
4. Optional: cron job to batch-process signals
5. Surface copy in member UI (one line, not chat)
6. Log to `yande_actions` for founder visibility
