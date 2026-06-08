# BloomBay truth roadmap

Your priority order, mapped to engineering phases.

## Priority stack

| # | You asked for | Phase | Status |
|---|----------------|-------|--------|
| 1 | Git cleanup | Ops | **You:** commit + push full tree |
| 2 | Supabase integration | **Phase 1** | Migration `006` + `/api/member/*` + IRL APIs |
| 3 | Real authentication | Phase 1–2 | Supabase auth live; remove demo verify (Phase 2) |
| 4 | Real verification | **Phase 2** | ID + selfie + moderation queue |
| 5 | Real Seats | **Phase 1** | `gatherings` + `seat_reservations` |
| 6 | Real Clubs | **Phase 1** | `club_memberships` + `club_applications` |
| 7 | Real Witnessing | **Phase 1** | `gathering_witnesses` |
| 8 | Yande memory | **Phase 3** | `member_behavior_signals` seeded |
| 9 | Analytics | Later | Founder metrics from truth tables |
| 10 | Payments | Later | Stripe after trust layer stable |

---

## Phase 1 — Make BloomBay truthful (implemented in code)

**Rule:** Every member action writes to Supabase first. UI cache is read-only mirror.

| Action | Table / API |
|--------|-------------|
| RSVP / reserve seat | `seat_reservations` · `POST /api/irl/reserve` |
| Check-in IRL | `gathering_attendance` · `POST /api/irl/check-in` |
| Create open seat | `gatherings` · `POST /api/member/gatherings` |
| Join club | `club_memberships` · `POST /api/irl/join-club` |
| Club application | `club_applications` · `POST /api/member/club-applications` |
| Bloom request | `bloom_requests` · `POST /api/member/bloom-requests` |
| Accept / decline bloom | `bloom_requests` · `POST .../respond` |
| Girl Calendar | `member_calendar_plans` · `POST /api/member/calendar` |
| Mood | `member_preferences` · `POST /api/member/preferences` |
| Stamp (check-in auto + manual) | `member_stamps` · `POST /api/member/stamps` |
| Witness | `gathering_witnesses` · `POST /api/member/witnesses` |
| Behavior log (Yande seed) | `member_behavior_signals` · auto on IRL actions |

**Env**

```bash
# Default: truthful (no silent local fallback)
NEXT_PUBLIC_BLOOMBAY_TRUTHFUL=1

# Optional: allow local cache when API fails (dev only)
NEXT_PUBLIC_BLOOMBAY_DEMO_FALLBACK=1
```

**Run migration:** `supabase/migrations/006_member_truth_layer.sql`

**Code:** `lib/truth/client.ts` — single client write surface.

---

## Phase 2 — Real verification

Build:

- `verification_submissions` (ID doc + selfie URLs in Supabase Storage)
- Founder moderation queue (replace `member-verification-store` localStorage)
- `profiles.verified` gates middleware + Happenings
- Trust score from attendance + witnesses (no fake chemistry %)
- Remove **Complete verification (demo)** from settings

---

## Phase 3 — Yande memory (not a chatbot)

Yande reads `member_behavior_signals` + attendance:

- `attended_irl`, `rsvp_reserved`, `mood_set`, `calendar_add`, `bloom_request_*`
- Future: decline events, dwell time, brunch vs nightlife preference

Example steering (rules first, LLM later):

> You attended 5 dinners · you skip nightlife · you linger at creative gatherings → next nudge: brunch + gallery, not rooftop party.

Tables already seeded in `006`. Phase 3 adds aggregation in `lib/yande-memory.ts` and replaces static `getYandeNudge` weights.

---

## What is still local (Phase 1 gaps)

- Founder events studio → `bloombay-events-store` (localStorage) until events sync to `gatherings`
- Room wall / bulletin / girl-mate posts
- Bouquet / bloomies social graph
- Static Explore / Connect **preview** cards (until profiles + matching API)
- Chemistry % on UI (remove in Phase 2)

---

## Next commands for you

1. Run `006_member_truth_layer.sql` in Supabase SQL Editor  
2. Sign in at `/member/login`  
3. Reserve seat on `/member/happenings/seats` — confirm row in `seat_reservations`  
4. RSVP gathering `g1` — uses `event_key` → `sant-ambroeus-soho`  
5. Commit + push the repo  

See also [SETUP.md](./SETUP.md).
