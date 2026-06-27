# Operator Beta Launch Loop

Concise gate before inviting **one trusted Club Mama**. Run automated checks first, then manual incognito proof.

**Env:** `.env.local` needs `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Optional: `APP_URL` (defaults to `http://localhost:3000`), `CLUB_MAMA_EMAIL`, `LAUNCH_LOOP_MEMBER_EMAIL`, `RESTORE_STAFF_ROLE=1` (restores test account role after RLS script).

**Migration 122 (RS-01):** Apply `supabase/scripts/APPLY_122_seat_reservations_rls.sql` in Supabase SQL Editor before Club Mama invite — members SELECT own reservations only; attendee lists stay server-side.

**Local app:** `npm run dev` (or set `APP_URL` to your Vercel preview / staging URL).

---

## Automated gates (run in order)

```bash
# 1. Schema parity (115–120 + private buckets) — expect 11/11
node scripts/migration-inventory.mjs

# 2. Club Mama session + my-club API (no localStorage)
node scripts/operator-beta-gate-club-mama.mjs

# 3. Report / block UI wiring
node scripts/smoke-report-block-ui.mjs

# 4. RLS — expect 0 security failures (❌ rows)
node scripts/rls-verification.mjs

# 5. Full 12-step launch loop (API + auth simulation)
node scripts/operator-beta-launch-loop.mjs
```

With staging URL:

```bash
APP_URL=https://your-preview.vercel.app node scripts/operator-beta-launch-loop.mjs
```

Founder morning panel: `/founder/beta-launch` (same checklist items below, tick after human verify).

---

## 12-step Club Mama → member loop

| # | Step | Automated check | Manual incognito |
|---|------|-----------------|------------------|
| 1 | Club Mama creates/imports club | `my-club` API returns slug | Club-owner dashboard → club exists |
| 2 | Club Mama creates + publishes gathering | POST `/api/club-portal/gatherings` + `.../publish` | Gatherings page → Publish → **live** |
| 3 | Shareable link exists | Slug in club-portal list; **Copy link** on live row | `/club-owner/gatherings` → Copy link |
| 4 | Logged-out user opens share link | `/member/happenings/{slug}` → 307 to `/member/login?redirect=…` | Paste link in incognito → lands on login with return path |
| 5 | Signup / waitlist from link | Login + `/onboard?redirect=…` + `/waitlist` reachable | New email signup or waitlist from shared context |
| 6 | After onboarding, member returns to gathering | Proxy gate → `/onboard?redirect=…` then happening page | Complete onboard → auto-land on gathering |
| 6b | Draft gatherings hidden from public | GET `/api/member/gatherings/{draft-slug}` → 404 | N/A (API) |
| 6c | Live gathering readable without auth | GET `/api/member/gatherings/{live-slug}` → 200 | N/A (API bypasses page proxy) |
| 7 | Member reserves seat | POST `/api/irl/reserve` `{ gatheringId }` | Happening detail → Reserve |
| 8 | Confirmation notification | `notification_events.type = ticket_confirmed` | In-app / inbox bell |
| 9 | Club Mama sees attendee | GET `/api/club-portal/gatherings/{id}/attendees` | Gatherings → View attendees |
| 10 | Member can cancel | POST `/api/member/calendar/rsvp` `{ action: "leave" }` | Cancel on happening or calendar |
| 11 | Report / block still works | POST `/api/member/report` + `/api/member/block` | Settings → Report / Block smoke |

**Share URL pattern:** `{APP_URL}/member/happenings/{slug}`

**Club Mama test account:** `CLUB_MAMA_EMAIL=soyandexo@gmail.com` (or your approved Club Mama).

---

## Founder beta launch checklist

Verify each at `/founder/beta-launch` before inviting Club Mamas:

| Item | Verify |
|------|--------|
| Waitlist running | `/waitlist` accepts signups |
| Stripe live | Webhook + secret configured |
| Email working | Resend test invite / welcome |
| SMS working | Twilio test OTP / reminder |
| Magic links working | Portal login + redirect (founder, Club Mama, member) |
| **Club Mama launch loop** | `node scripts/operator-beta-launch-loop.mjs` passes |
| Reports working | Member report → moderation case (`/founder/reports`) |
| Moderation queue empty | No open P0 safety cases (`/founder/safety`) |
| Club Mama applications reviewed | Queue triaged (`/founder/club-hosts`) |
| Cron health green | `CRON_ENABLED` jobs OK (`/founder/yande`) |
| Notifications healthy | Welcome + operator notifications (`/founder/inbox`) |
| No critical errors | No open P0 bugs (`/founder/qa-lab`) |

---

## Manual incognito proof (required)

Automated script uses service-role OTP; **still prove in browser**:

1. Incognito → paste live share link → confirm login redirect preserves path.
2. Sign up as **new** email (not founder / not Club Mama).
3. Finish onboarding → land on happening → reserve.
4. Club Mama browser (separate profile) → attendees list shows new member.
5. Member cancels → attendee disappears.
6. Report/block once on a test target (then unblock).

---

## Pass criteria

- Migration inventory: **11/11** (includes migration **120** `report_submitted`).
- Gate scripts: club-mama, report-block, launch-loop → **exit 0**.
- RLS verification: **0 security failures**.
- Manual incognito loop completed once on target URL (localhost or staging).
