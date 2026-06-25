# BloomBay API Architecture

> **162** Route Handlers under `app/api/**/route.ts` · Next.js App Router · JSON + Supabase

---

## Conventions

| Rule | Detail |
|------|--------|
| Location | `app/api/{domain}/{resource}/route.ts` |
| Auth | `lib/auth/require-role.ts` — `requireAuth()`, `requireRole()`, `requireAdmin()` |
| DB client | `createClient()` from `lib/supabase/server` (session) or `lib/supabase/admin` (service role) |
| Truth writes | Prefer `lib/truth/client.ts` from API routes serving member actions |
| Cron | `app/api/cron/*` — POST only, verify `CRON_SECRET` / Vercel cron header |
| Errors | JSON `{ error: string }` with 4xx/5xx |

---

## API map by domain

### `auth/`
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/auth/sign-out` | POST | Clear session |

### `irl/` — IRL funnel (Phase 1 truth)
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/irl/reserve` | POST | Reserve seat → `seat_reservations` |
| `/api/irl/check-in` | POST | Check in → `gathering_attendance` |
| `/api/irl/join-club` | POST | Join club → `club_memberships` |
| `/api/irl/gatherings` | GET | List gatherings |
| `/api/irl/complete-funnel` | POST | Demo / onboarding funnel completion |

### `member/` — Member portal (~55 routes)

**Profile & media**
- `GET/PATCH /api/member/profile` — own profile
- `GET /api/member/profile/[username]` — public profile
- `POST /api/member/profile/bootstrap` — first-time setup
- `GET/POST/DELETE /api/member/profile-photos`
- `PATCH /api/member/profile/notifications`
- `PATCH /api/member/socials`

**Calendar & plans**
- `GET/POST/PATCH/DELETE /api/member/calendar`
- `POST /api/member/calendar/rsvp`, `permanent`, `clubs`
- `GET /api/member/calendar/[id]/ics`
- `GET/POST /api/member/plans`, confirmations

**Happenings & gatherings**
- `GET /api/member/gatherings`, `gatherings/[slug]`
- `GET /api/member/happenings/[id]/room-brief`

**Connect & introductions**
- `GET/POST /api/member/bloom-requests`
- `POST /api/member/bloom-requests/[id]/respond`
- `GET/POST /api/introductions`

**Behavior & Yande**
- `POST /api/member/behavior` — log `member_behavior_signals`
- `GET/POST /api/member/yande-question`
- `POST /api/yande/signal`, `memory`, `context`, `learn`, `support`

**Safety & trust**
- `POST /api/member/witness`, `witnesses`, `GET witness/[id]`
- `POST /api/member/safety-reports`, `safety/verify`
- `GET/POST/DELETE /api/member/block`
- `POST /api/member/report`

**Social & content**
- `GET/POST /api/member/community-posts`
- `GET/POST /api/member/pin-drops`
- `GET/POST /api/member/flowers`, `flowers/[id]`
- `GET/POST /api/member/bouquet`
- `POST /api/member/stamps`
- `GET /api/member/people-you-met`, `my-story`, `bloom-cards`

**Clubs**
- `GET/POST /api/member/club-applications`
- `GET /api/member/desktop-panel`, `home/glance`

**Other**
- `POST /api/member/scan` — QR check-in helper
- `POST /api/member/resolve-code`
- `GET/POST/DELETE /api/member/memories`

### `clubs/`
| Route | Methods |
|-------|---------|
| `/api/clubs` | GET — list clubs |
| `/api/clubs/[slug]` | GET — club detail |
| `/api/clubs/[id]/customization` | GET, POST |
| `/api/clubs/[id]/media` | GET, POST, DELETE |
| `/api/clubs/[id]/membership` | GET |
| `/api/clubs/[id]/patch-order` | GET, POST |
| `/api/clubs/[id]/status` | POST |

### `club-portal/` & `club-owner/`
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/club-portal/my-club` | GET | Host's club |
| `/api/club-portal/gatherings` | GET, POST | Manage gatherings |
| `/api/club-portal/gatherings/[id]/post-mortem` | GET | Event recap |
| `/api/club-portal/members` | GET | Roster |
| `/api/club-portal/applications` | GET, PATCH | Join requests |
| `/api/club-portal/broadcasts` | GET, POST | Club announcements |
| `/api/club-owner/branding` | GET, PATCH | Brand assets |

### `admin/` & `founder/`
| Route | Purpose |
|-------|---------|
| `/api/admin/stats`, `quick-stats`, `live-stats` | Mission Control KPIs |
| `/api/admin/clubs`, `events` | Ops club/event management |
| `/api/admin/submissions`, `submissions/[id]` | Waitlist / applications |
| `/api/admin/approve-member` | Member approval |
| `/api/admin/verification-photo` | ID review |
| `/api/founder/moderation` | Content moderation queue |
| `/api/founder/message-templates` | SMS/email templates |
| `/api/founder/pitches` | Magazine pitches |
| `/api/founder/marketing-assistant` | AI copy assist |
| `/api/founder/create/generate` | Create-space AI |

### `yande/` & `cron/yande-*`
| Route | Purpose |
|-------|---------|
| `/api/yande/signal` | Ingest `yande_signals` |
| `/api/yande/memory` | Update `yande_user_context` |
| `/api/yande/context` | Read/write member context |
| `/api/yande/learn` | Learning loop weights |
| `/api/yande/support` | Support escalation |
| `/api/cron/yande-host` | Host coaching agent |
| `/api/cron/yande-messages` | Proactive message drafts |
| `/api/cron/yande-community` | Community coordinator |
| `/api/cron/yande-scientist` | Analyst reports |

### Other cron agents
`/api/cron/memory-keeper`, `memory-layer`, `scheduling`, `safety-monitor`, `city-intelligence`, `club-success`, `community-coordinator`, `event-intelligence`, `founder-analyst`, `friendship-health`, `weekly-events`, `wall-seeder`, `avenue-editors`, `post-event`, `operations`

### `avenue/` — Editorial
- `GET /api/avenue/[room]`, `magazine`, `screening-room`, `top-posts`
- `POST /api/avenue/post`, `magazine/generate`, `magazine/pitch`

### `wall/`, `comments/`, `flowers/`
- Wall posts + bloom reactions
- Threaded comments + comment flowers
- `POST /api/flowers`, `comment-flower`

### `girlmate/`
- `GET/POST /api/girlmate`, `messages`, `my-listing`, `partner`

### `hanger/`, `drops/`, `payments/`
- `POST /api/hanger/checkout`
- `GET/POST /api/drops`, `claim`, `redeem`, `verify`
- `POST /api/payments/stripe/checkout`, `webhook`, `refund`
- `POST /api/whop/checkout`, `webhook`

### `reservations/`, `venues/`, `search/`
- Table reservations, venue directory, global search

### `home/`, `careers/`, `feedback/`
- `GET /api/home/glance` — home hero data
- `POST /api/careers/apply`
- `GET/POST/PATCH /api/feedback`

---

## Request flow

```
Client (fetch) 
  → Route Handler (app/api/.../route.ts)
    → requireAuth / requireRole
    → Supabase server client (RLS applies)
    → optional logBehaviorSignal / sendYandeSignal
  → JSON Response
```

**Service role** (bypass RLS): cron routes, some founder admin exports, webhook handlers.

---

## Security notes

- See `SECURITY_ROUTE_MATRIX.md` for route-level auth matrix.
- Webhooks: Stripe/Whop signature verification in route handlers.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client bundles.
- Member APIs must not trust client-sent `user_id` — use `auth.uid()` from session.

---

## Adding a new API

1. Create `app/api/{domain}/{name}/route.ts`
2. Export `GET` / `POST` / `PATCH` / `DELETE` as needed
3. Use `requireRole(['member'])` or appropriate guard
4. Write to Supabase with RLS-friendly inserts
5. If member-facing action: call `logBehaviorSignal()` for Yande
6. Document in this file (or domain README)
