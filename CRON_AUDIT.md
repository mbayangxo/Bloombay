# Cron Jobs Audit

> Inventory and hardening notes for all `/api/cron/**` routes.  
> Shared guard: `lib/cron-guard.ts` (`runCronJob`, `cronGuard`, `logCronRun`).

---

## Environment variables

| Variable | Values | Purpose |
|----------|--------|---------|
| `CRON_SECRET` | secret string | Auth via `x-cron-secret` header **or** `Authorization: Bearer <secret>` |
| `CRON_ENABLED` | `"true"` / `"1"` | **Opt-in** — crons skip unless explicitly enabled |
| `CRON_DRY_RUN` | `"true"` / `"1"` | Passes `ctx.dryRun` to handlers; routes must not write/send |
| `CRON_MAX_RECORDS` | integer (default `100`) | Batch cap via `ctx.maxRecords` / `cronMaxRecords()` |

Set `CRON_ENABLED=true` and `CRON_SECRET` in Vercel Production for scheduled jobs to run.

---

## Run log table

**Table name:** `cron_logs` (not `cron_run_logs` — existing migrations `101_cron_logs.sql`, `114_cron_logs_columns.sql`).

| Spec column | Actual column | Notes |
|-------------|---------------|-------|
| `id` | `id` | `bigserial` PK |
| `job_name` | `job` | text job identifier |
| `started_at` | `started_at` | added migration 114 |
| `finished_at` | `finished_at` | added migration 114 |
| `status` | `result` | `ok` \| `skipped` \| `error` |
| `records_processed` | `records_processed` | added migration 114 |
| `error_message` | `error_message` | added migration 114 |

Extra columns: `details` (jsonb), `ran_at` (timestamptz).

---

## SMS policy

Crons **must not send SMS**. Only in-app `notifications` / `yande_messages` inserts are permitted.

| Route | SMS status |
|-------|------------|
| `weekly-events` | **Removed** — returns `{ sent: 0 }` with comment |
| All other crons | No SMS code paths |

SMS elsewhere in the app is limited to waitlist acceptance and app-launch flows (see `weekly-events` comment).

---

## Scheduled jobs (`vercel.json`)

| Job | Route | Schedule (UTC cron) | What it does | Risk | Writes DB | Notifications | SMS | Notes |
|-----|-------|---------------------|--------------|------|-----------|---------------|-----|-------|
| Weekly Events | `/api/cron/weekly-events` | `0 10 * * 1` (Mon 10:00) | Legacy weekly digest stub; SMS disabled | low | No | No | **Blocked** | Opt-in via `CRON_ENABLED` |
| Avenue Editors | `/api/cron/avenue-editors` | `0 7 * * 2` (Tue 07:00) | AI-generates Avenue room content → `avenue_content` (`pending`) | med | Yes | No | No | 9 editor personas; Apify TikTok for Working room |
| City Intelligence | `/api/cron/city-intelligence` | `0 8 * * 3` (Wed 08:00) | Scrapes TikTok/Yelp/Google/Eventbrite/RSS → `city_trending` (`pending`) | med | Yes | No | No | Per-source cap via `ctx.maxRecords` |
| Wall Seeder | `/api/cron/wall-seeder` | `0 13 * * *` (daily 13:00) | Claude Haiku seed post → `wall_posts` | low | Yes | No | No | Requires `ANTHROPIC_API_KEY` |
| Founder Analyst | `/api/cron/founder-analyst` | `0 14 * * 1` (Mon 14:00) | Weekly founder digest → `founder_analyst_reports` | low | Yes | Yes (founder) | No | In-app only via `notifications` |
| Memory Layer | `/api/cron/memory-layer` | `0 11 1 * *` (1st of month 11:00) | Monthly member memory notes → `yande_memories` | med | Yes | No | No | Capped by `ctx.maxRecords` members |
| Friendship Health | `/api/cron/friendship-health` | `0 23 * * 0` (Sun 23:00) | Rebuilds `friendship_scores` from check-ins + scans | med | Yes | No | No | 90-day lookback; pair upsert capped |
| Club Success | `/api/cron/club-success` | `0 10 * * 3` (Wed 10:00) | Club health nudges to owners → `notifications` | low | Yes | Yes | No | AI nudge per club |
| Event Intelligence | `/api/cron/event-intelligence` | `0 9 * * 2,5` (Tue/Fri 09:00) | Low-fill event host nudges → `notifications` | low | Yes | Yes | No | Events in next 7 days |
| Community Coordinator | `/api/cron/community-coordinator` | `0 10 * * *` (daily 10:00) | Day-3 / day-7 onboarding nudges | low | Yes | Yes (in-app) | No | Uses `createNotificationEvent`; no SMS |
| Safety Monitor | `/api/cron/safety-monitor` | `0 8 * * *` (daily 08:00) | Reviews pending `member_reports` | **high** | Yes | Yes | No | High severity → `human_review_required` + `moderation_cases` |
| Operations | `/api/cron/operations` | `0 6 * * *` (daily 06:00) | Waitlist promotion + capacity alerts | med | Yes | Yes | No | `lib/yande/operations` |
| Scheduling | `/api/cron/scheduling` | `0 9 * * 1` (Mon 09:00) | Club event scheduling nudges | low | Yes | Yes | No | `lib/yande/scheduling` |
| Post Event | `/api/cron/post-event` | `0 10 * * *` (daily 10:00) | Post-gathering follow-ups | low | Yes | Yes | No | **GET** + Bearer auth (Vercel compat) |

---

## Manual / unscheduled routes (not in `vercel.json`)

These exist for manual triggers or future scheduling. All use `runCronJob` hardening.

| Job | Route | Schedule | What it does | Risk | Writes DB | Notifications | SMS | Notes |
|-----|-------|----------|--------------|------|-----------|---------------|-----|-------|
| Yande Community | `/api/cron/yande-community` | — | Introductions, suggestions, insights → `yande_messages` | med | Yes | Yes (in-app) | No | Matching engine; batch capped |
| Yande Messages | `/api/cron/yande-messages` | — | Re-engagement + milestone `yande_messages` | low | Yes | Yes (in-app) | No | No SMS/email blast |
| Yande Host | `/api/cron/yande-host` | — | Host coaching → `yande_messages` + `notifications` | low | Yes | Yes | No | |
| Yande Scientist | `/api/cron/yande-scientist` | — | Weekly platform analysis → `yande_scientist_reports` | low | Yes | Yes (founder) | No | |
| Memory Keeper | `/api/cron/memory-keeper` | — | Processes `memory_events` → `member_memory_graph` | med | Yes | No | No | Daily memory sweep |

---

## Hardening summary

| Check | Status |
|-------|--------|
| Routes using `runCronJob` | **19 / 19** |
| Auth (`CRON_SECRET` header or Bearer) | All routes |
| `CRON_ENABLED` opt-in kill switch | All routes |
| `CRON_DRY_RUN` support | All routes |
| `CRON_MAX_RECORDS` on batch queries | Applied on data-heavy routes |
| Structured `cron_logs` logging | All routes (via `runCronJob` finally) |
| SMS in crons | **None** (`weekly-events` explicitly disabled) |
| Safety auto-ban | **None** — high severity → `human_review_required` |

---

## Safety monitor detail

`lib/yande/safety.ts` → `reviewPendingReports()`:

- Low/medium: status `reviewed` (Yande recommendation only)
- High severity (or ≥3 reports): status `human_review_required`, inserts `moderation_cases` with `human_review_required`, notifies reporter + staff
- Never auto-deactivates members from cron

---

## Invoking crons locally

```bash
# POST routes (most jobs)
curl -X POST http://localhost:3000/api/cron/safety-monitor \
  -H "x-cron-secret: $CRON_SECRET"

# GET route (post-event — Bearer auth)
curl http://localhost:3000/api/cron/post-event \
  -H "Authorization: Bearer $CRON_SECRET"

# Dry run (no writes)
CRON_ENABLED=true CRON_DRY_RUN=true npm run dev
```
