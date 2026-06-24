# BloomBay API Security Route Matrix

Generated from codebase audit. Last updated: 2026-06-24.

## Legend

**Access levels:** `public` · `signed-in` · `owner-only` · `admin` · `cron` · `webhook`  
**Flags:** `CRITICAL` · `HIGH` · `MEDIUM` · `LOW`

---

## Route Inventory

| Route | Methods | Access | Svc Role | Email/SMS | User Text | Rate Limit | Block Check | Client Trust | Flag |
|-------|---------|--------|----------|-----------|-----------|------------|-------------|--------------|------|
| /api/admin/approve-member | GET POST | admin | ✓ | ✓ notif | — | — | — | — | LOW |
| /api/admin/clubs | GET | admin | — | — | — | — | — | — | LOW |
| /api/admin/eventbrite | GET | admin | — | — | — | — | — | — | LOW |
| /api/admin/events | GET POST DELETE | admin | ✓ | — | title, desc | — | — | price_cents (admin sets) | LOW |
| /api/admin/live-stats | GET | admin | ✓ | — | — | — | — | — | LOW |
| /api/admin/login | POST | public | — | — | — | — | — | — | LOW |
| /api/admin/logout | POST | admin | — | — | — | — | — | — | LOW |
| /api/admin/quick-stats | GET | admin | ✓ | — | — | — | — | — | LOW |
| /api/admin/stats | GET | admin | ✓ | — | — | — | — | — | LOW |
| /api/admin/submissions | GET | admin | — | — | — | — | — | — | LOW |
| /api/admin/submissions/[id] | PATCH | admin | — | — | — | — | — | — | LOW |
| /api/admin/waitlist/notify | POST | admin | ✓ | ✓ SMS | — | 500/run cap | — | — | LOW |
| /api/auth/sign-out | POST | signed-in | — | — | — | — | — | — | LOW |
| /api/avenue/magazine | GET | signed-in | ✓ | — | — | — | — | — | LOW |
| /api/avenue/magazine/generate | POST | admin | ✓ | — | prompt | — | — | — | MEDIUM |
| /api/avenue/magazine/pitch | POST | signed-in | ✓ | — | pitch text | — | — | — | MEDIUM |
| /api/avenue/post | POST | signed-in | — | — | title, caption | — | — | — | MEDIUM |
| /api/bloom-request | POST | signed-in | — | ✓ notif | message | — | — | — | HIGH |
| /api/careers/apply | POST | public | — | — | cover_letter | — | — | — | MEDIUM |
| /api/club-owner/branding | GET PATCH | owner | — | — | all fields | — | — | — | MEDIUM |
| /api/club-portal/broadcasts | GET POST | owner | — | ✓ | message, title | — | — | — | MEDIUM |
| /api/club-portal/gatherings | GET POST | owner | — | — | title, desc | — | — | — | MEDIUM |
| /api/clubs/[id]/membership | GET | signed-in | — | — | — | — | — | — | LOW |
| /api/clubs/[id]/patch-order | GET POST | owner | — | — | — | — | — | — | LOW |
| /api/clubs/[id]/status | GET | public | — | — | — | — | — | — | LOW |
| /api/clubs/[slug] | GET | public | — | — | — | — | — | — | LOW |
| /api/clubs | GET | public | — | — | — | — | — | — | LOW |
| /api/come-with-me | GET POST | signed-in | — | — | activity | — | — | — | MEDIUM |
| /api/comment-flower | POST | signed-in | — | ✓ notif | body | — | — | — | MEDIUM |
| /api/comments | GET POST DELETE | signed-in | ✓ | — | body | — | — | — | HIGH |
| /api/cron/* (17 routes) | POST | cron | ✓ | some ✓ | some ✓ | guarded by CRON_SECRET | — | — | LOW |
| /api/curator/overview | GET | curator | — | — | — | — | — | — | LOW |
| /api/drops/* | GET POST | signed-in/public | — | — | — | — | — | — | LOW |
| /api/editor-instructions/* | GET PATCH POST | admin | — | — | instructions | — | — | — | MEDIUM |
| /api/feedback | GET POST PATCH | public/admin | ✓ | — | message (2000 cap) | — | — | — | MEDIUM |
| /api/flowers | POST | signed-in | — | ✓ notif | — | — | — | — | LOW |
| /api/founder/create/generate | POST | admin | ✓ | — | prompt | — | — | — | MEDIUM |
| /api/founder/marketing-assistant | POST | admin | ✓ | — | prompt | — | — | — | MEDIUM |
| /api/gatherings/[id]/media | GET POST | owner | — | — | — | — | — | — | LOW |
| /api/girlmate/messages | GET POST | signed-in | — | — | msg (1000 cap) | ✓ 20/hr | ✓ | listing required | LOW |
| /api/girlmate/my-listing | GET PATCH | signed-in | — | — | desc, fields | — | — | — | MEDIUM |
| /api/girlmate/partner | GET POST | public/admin | ✓ | — | desc | — | — | — | MEDIUM |
| /api/girlmate | GET | signed-in | ✓ | — | — | — | — | — | LOW |
| /api/hanger/checkout | POST | signed-in | — | — | — | — | — | ⚠ price from client | HIGH |
| /api/humanize | POST | signed-in | — | — | text (2000 cap) | — | — | — | MEDIUM |
| /api/introductions | GET POST | signed-in | — | — | bio, interests | — | — | — | MEDIUM |
| /api/irl/check-in | POST | signed-in | — | — | — | — | — | — | LOW |
| /api/irl/reserve | POST | signed-in | — | ✓ SMS | — | — | — | — | LOW |
| /api/member/[userId]/social-proof | GET | public | — | — | — | — | — | — | LOW |
| /api/member/block | GET POST DELETE | signed-in | — | — | — | — | ✓ | — | LOW |
| /api/member/bloom-cards | GET | signed-in | ✓ | — | — | — | — | — | LOW |
| /api/member/bloom-requests | GET POST | signed-in | — | ✓ notif | note (200 cap) | ✓ 10/day | ✓ | — | LOW |
| /api/member/bloom-requests/[id]/respond | POST | signed-in | — | — | response | — | — | — | MEDIUM |
| /api/member/bouquet | GET POST | signed-in | — | — | — | — | — | — | LOW |
| /api/member/calendar/* | GET POST | signed-in | — | some SMS | — | — | — | — | LOW |
| /api/member/community-posts | GET | signed-in | — | — | — | — | — | — | LOW |
| /api/member/flowers | POST | signed-in | — | ✓ notif | note | — | — | — | MEDIUM |
| /api/member/gatherings/* | GET | signed-in | — | — | — | — | — | — | LOW |
| /api/member/memories | GET POST DELETE | signed-in | — | — | caption, title | — | — | — | MEDIUM |
| /api/member/my-story | GET PATCH | signed-in | — | — | story text | — | — | — | MEDIUM |
| /api/member/people-you-met | GET | signed-in | — | — | — | — | — | — | LOW |
| /api/member/pin-drops | GET POST | signed-in | — | — | caption | — | — | — | MEDIUM |
| /api/member/plans/* | GET POST | signed-in | — | — | notes | — | — | — | MEDIUM |
| /api/member/profile | GET PATCH | signed-in | — | — | name, location | — | — | — | MEDIUM |
| /api/member/profile/[username] | GET | public | ✓ | — | — | — | — | — | HIGH |
| /api/member/report | POST | signed-in | — | — | details (1000 cap) | — | ✓ | — | LOW |
| /api/member/witness | POST | signed-in | — | ✓ notif | note | — | — | — | MEDIUM |
| /api/moments/post | POST | signed-in | — | — | caption | — | — | — | MEDIUM |
| /api/partner-portal/my-venue | GET PATCH | partner | — | — | venue info | — | — | — | MEDIUM |
| /api/payments/stripe/checkout | POST | signed-in | ✓ | — | — | — | — | eventId only (server fetches price) | LOW |
| /api/payments/stripe/webhook | POST | webhook | — | ✓ | — | — | — | sig verified | LOW |
| /api/reservations | GET POST | signed-in | ✓ | — | notes | — | — | — | MEDIUM |
| /api/reservations/confirm | PATCH | admin | ✓ | ✓ SMS | — | — | — | — | LOW |
| /api/search | GET | signed-in | — | — | — | — | — | — | LOW |
| /api/sms/send | POST | signed-in | — | ✓ SMS | template only | ✓ 10/day | — | — | LOW |
| /api/venues/* | GET | public | — | — | — | — | — | — | LOW |
| /api/waitlist | POST | public | ✓ | — (no SMS) | goals | — | — | — | LOW |
| /api/wall/posts | GET POST | signed-in | ✓ | — | text | — | — | — | MEDIUM |
| /api/whop/* | POST | signed-in/webhook | — | — | — | — | — | sig verified | LOW |
| /api/yande/context | GET POST | signed-in | ✓ | — | notes | — | — | — | MEDIUM |
| /api/yande/learn | POST | signed-in | ✓ | — | prompt | — | — | — | MEDIUM |
| /api/yande/memory | GET POST | signed-in | ✓ | — | memory text | — | — | — | MEDIUM |
| /api/yande/signal | POST | signed-in | ✓ | — | signal | — | — | — | LOW |
| /api/yande/support | POST | signed-in | ✓ | — | message | — | — | — | MEDIUM |

---

## Summary

| Severity | Count | Notes |
|----------|-------|-------|
| CRITICAL | 0 | All previously critical items resolved |
| HIGH | 0 | All HIGH items resolved |
| MEDIUM | ~35 | User text without explicit length caps; service role on some read paths |
| LOW | ~80 | Properly guarded; read-only or bounded |

---

## Remaining Action Items

### HIGH priority
All HIGH items resolved — see Resolved section below.

### MEDIUM priority
- Add explicit length caps to user-text fields in: intro bios, memories, stories, wall posts, pin-drop captions
- Add rate limiting to wall/posts (prevent wall spam)
- Add rate limiting to /api/comments
- `/api/careers/apply` — public route accepts cover letter; add max length + honeypot

### Resolved since audit
- ✅ `/api/hanger/checkout` already fetches price server-side (was already fixed; matrix was stale)
- ✅ `/api/bloom-request` deleted — unreferenced legacy route superseded by `/api/member/bloom-requests`
- ✅ `/api/comments` GET: requires auth, capped at 200 results; POST: 1000-char body cap, 20/hr rate limit
- ✅ `/api/member/profile/[username]` now requires auth; strips `role` from response (returns `isVerified` bool only)
- ✅ All `x-admin-password` header auth removed
- ✅ Admin routes use Supabase session + profiles.role check
- ✅ Stripe ticket checkout fetches price/name server-side
- ✅ Girlmate messages: 1000-char cap, 20/hr rate limit, block check, listing required
- ✅ Bloom requests: 200-char note cap, 10/day limit, block check, duplicate guard
- ✅ Waitlist: no automatic SMS; phone stored only; founder-controlled notify endpoint
- ✅ SMS route: template-only; no arbitrary user text; 10/day per user
- ✅ `ignoreBuildErrors` removed; all TypeScript errors fixed
- ✅ `profiles_read_all` / `user_clubs_read_all` open RLS policies dropped
- ✅ Block/report system added (user_blocks, user_reports tables + API)
- ✅ Cron kill switch (CRON_ENABLED env var) + cron_logs audit table
- ✅ package.json renamed to "bloombay"
