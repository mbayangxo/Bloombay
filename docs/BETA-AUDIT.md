# BloomBay Beta Audit — Code-Level Findings

**Generated:** 2026-06-29  
**Repo:** `mbayangxo/Bloombay`  
**Production `origin/main`:** `81d105f` (P0 Security + P0 Club-Data)  
**Local `main` (unpushed):** `8cd295a` (Founder Portal Trust v1)

---

## Executive verdict

**NO-GO for guided beta** on production today.

**GO** for continuing targeted fixes — security and club-data P0 gaps are closed on `main`; remaining work is operational truth (founder ops, member fake data, navigation).

---

## What is on `origin/main` (deployed)

| Item | Status |
|------|--------|
| P0 Security hardening (`3bb5d62`) | ✅ |
| P0 Club-Data hardening (`81d105f`) | ✅ |
| Safety Ping API (`/api/member/safety-pings`) | ✅ |
| Safety Reports API (`/api/member/safety-reports`) | ✅ |
| Bouquet API (`/api/member/bouquet`) | ✅ |
| Build / Vercel deploy | ✅ PASS on `81d105f` |

**33 files changed** in P0 rescue — no AV7Xm full merge, no Member Truth / nav / Avenue mixed in.

---

## Local only (not on `origin/main` yet)

**Commit `8cd295a` — Founder Portal Trust v1**

| Change | Files |
|--------|-------|
| Founder Safety → real `safety_reports` + `safety_pings` | `lib/founder/safety-ops.ts`, `app/api/founder/safety/route.ts`, `safety-center.tsx` |
| Club Hosts → real waitlist queue + DB clubs | `lib/founder/club-host-ops.ts`, `club-hosts-mission-panel.tsx`, `club-hosts/page.tsx` |
| Beta Club Mama path callout | `club-mama-beta-path.tsx`, `founder-portal-invites.tsx` |
| Portfolio labeled demo | `clubs/portfolio/page.tsx` |

---

## Beta blockers (production)

### 1. Founder Portal

| Issue | Severity | On prod | Fixed locally |
|-------|----------|---------|---------------|
| Safety Center uses static `SAFETY_QUEUE` | P0 | ❌ | ✅ `8cd295a` |
| Club Hosts static leaderboard | P0 | ❌ | ✅ `8cd295a` |
| Club dashboard static `CLUBS` array | P1 | ❌ | — |
| Portal invites need `PORTAL_INVITE_SECRET` | P0 env | ⚠️ | — |

### 2. Club Mama

| Path | Status |
|------|--------|
| **Live:** `/member/clubs/{slug}/manage` | ✅ Real DB (applications, gatherings, stats) |
| **Live:** `/club-owner/comms` | ✅ Broadcasts API |
| **Demo:** `/club-owner/dashboard`, `/members`, `/applications` | ❌ localStorage — do not use for beta |

### 3. Member Truth

| Screen | Issue |
|--------|-------|
| Happenings empty state | Static collage masquerading as live events |
| `HOT_CLUBS` | Hardcoded slugs + fake “active today” |
| Bouquet (`/member/lounge/bouquet`) | Hardcoded array; API exists but unused |
| Pin Drops (`/member/pin-drops`) | Hardcoded `PINS`; API exists but unused |
| Notifications | `INITIAL_*` demo when DB empty |
| `/member/clubs/discover` | 404 — component exists, no route |

### 4. Navigation

| Issue |
|-------|
| Bottom tab label **“The City”** → href `/member/happenings` |
| No mobile bottom tab for `/member/city` |
| “Pin Drops” nav icon → `/member/notifications` |

---

## Focused area audits (summary)

### Homepage — PARTIAL
- ✅ Profile, clubs, events from Supabase; Safety entry wired
- ❌ Recommended card, Morning After, Bloom Recap demo; event cards don’t deep-link

### Happenings — FAIL (empty state)
- ✅ List RSVP → `gathering_attendance` when DB seeded
- ❌ Create writes `events`, feed reads `gatherings`; static empty collage; split RSVP paths

### City — FAIL (hub); PASS (places, bloom-notes)
- ✅ `/member/city/places`, bloom-notes APIs
- ❌ Hub mostly static; `city_trending` wired but not mounted

### Avenue — FAIL except Wall
- ✅ The Wall (`/api/wall/posts`)
- ❌ Closet writes DB but feed shows mocks; eats/fashion 404; fake live counts

### Chats / Mailbox / Apartment — FAIL
- Chat merges demo `CONVOS` with real DMs
- Mailbox demo `MAILBOX_ITEMS` never shown
- `/member/lounge` = demo chats; `/member/apartment` = real profile

### Clubs — FAIL (discover); PARTIAL (board)
- ✅ Main board from Supabase; manage gated to owner
- ❌ discover 404; mock `/apply` page; dead CTAs

### Plans — FAIL (hub); PASS (confirmations)
- ✅ Confirmations from `seat_reservations`
- ❌ Default hub/tickets are mock rooms

### Notifications — FAIL
- Demo `INITIAL_*` fallback; Pin Drops vs notifications conflated in nav

---

## Milestone plan (recommended order)

1. **Founder Portal Trust** — push `8cd295a`
2. **Member Truth** — happenings collage, HOT_CLUBS, bouquet, pin-drops, notifications
3. **Navigation** — City vs Happenings, Pin Drops label
4. **Manual proof** — Founder → Club Mama → Member E2E

---

## Targeted verification checklist

### A. Founder → Club Mama
- [ ] Approve `club_host` waitlist row (`/founder/applications` or `/founder/club-hosts`)
- [ ] Send `club_owner` portal invite (`/founder/invites`, `PORTAL_INVITE_SECRET` set)
- [ ] Club Mama uses `/member/clubs/{slug}/manage` — not `/club-owner/applications`

### B. Member → gathering
- [ ] Seeded `gatherings` appear on `/member/happenings`
- [ ] List “Going” writes `gathering_attendance`

### C. Safety
- [ ] Home shield → ping/report APIs return 200
- [ ] Founder `/founder/safety` shows DB rows (after `8cd295a` deploy)

### D. No fake on critical screens
- [ ] Happenings empty = honest (after Member Truth)
- [ ] Notifications empty = honest (after Member Truth)
- [ ] Founder Safety not static (after `8cd295a` deploy)

---

## P0 file reference (rescue commits)

**Security (20 files):** `require-role.ts`, `portal-invite-crypto.ts`, middleware, editor-instructions, drops/redeem, girlmate/partner, community-posts, branding, founder QA/create routes, portal-invite routes, company-portal-login/signup, founder-portal-invites

**Club-Data (13 files):** `resolve-slug.ts`, club-portal routes, admin/clubs, curator/overview, patch-order, club-manage-dashboard, `clubs.ts` actions, pin-drops (+19/−13), stripe webhook (+2/−2)

---

## Commands

```bash
# See production vs local
git fetch origin
git log origin/main..main --oneline

# Deploy Founder Trust v1
git push origin main
```

---

*This file is for human review. Regenerate after major milestone commits.*
