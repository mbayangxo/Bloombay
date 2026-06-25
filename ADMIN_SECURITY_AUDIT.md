# Admin / Founder Dashboard Security Audit

**Date:** 2025-06-25  
**Scope:** Staff portals (`/admin`, `/founder`, `/curator`, `/club-owner`, `/partner`) and their API trees.  
**Excluded:** `alkebulan-local/` (separate project with legacy password auth).

---

## 1. Auth model

| Layer | Mechanism |
|-------|-----------|
| **Identity** | Supabase Auth session (cookies via `@supabase/ssr`) |
| **Authorization** | `profiles.role` → normalized via `normalizeRole()` in `lib/auth/roles.ts` |
| **API guards** | `requireRole()`, `requireAdmin()`, `requireFounder()`, `requireModeratorStaff()` in `lib/auth/require-role.ts` and `lib/admin/require-staff.ts` |
| **Page guards** | `getMissionControlRole()` + portal checks in layouts; `StaffRouteGuard` for capability matrix |
| **Audit** | `writeAdminAuditLog()` → `admin_audit_logs` (service role insert) |
| **Bulk actions** | `assertBulkActionAllowed()` in `lib/admin/bulk-guard.ts` |

### Password auth — REMOVED

| Item | Status |
|------|--------|
| `ADMIN_PASSWORD` env var read in app/ | ❌ Not used |
| `x-admin-password` header | ❌ Not used |
| `/api/admin/login` password POST | Returns **410 Gone** |
| `signInFounderWithDashboardPassword()` | **Removed** from `lib/auth/session.ts` |
| `bb-founder-password` cookie login | **Removed** |
| `isFounderPasswordSession()` | Always returns `false` (stub in `lib/admin-auth.ts`) |
| `isAdminAuthenticated()` | Delegates to Supabase role (no password path) |
| Stale UI copy (`bloombay-login.tsx`, `session.ts`) | **Updated** — Supabase-only messaging |

Grep in `app/` for `ADMIN_PASSWORD`, `x-admin-password`, `bb-founder-password`: **0 matches**.

---

## 2. Role capability matrix

| Capability | founder | admin | moderator | curator | club_owner | partner |
|------------|:-------:|:-----:|:---------:|:-------:|:----------:|:-------:|
| Mission Control overview | ✅ | ✅ | ✅ | — | — | — |
| Member approve/decline | ✅ | ✅ | — | — | — | — |
| ID verification review | ✅ | ✅ | ✅ | — | — | — |
| Content moderation queue | ✅ | ✅ | ✅ | — | — | — |
| Moderation case ban (deactivate member) | ✅ | — | — | — | — | — |
| Magazine pitch review | ✅ | ✅ | — | ✅ | — | — |
| Waitlist / submissions read | ✅ | ✅ | — | — | — | — |
| Waitlist SMS batch | ✅ | ✅ | — | — | — | — |
| Curated event create | ✅ | ✅ | — | — | — | — |
| Curated event delete | ✅ | — | — | — | — | — |
| Stripe refund | ✅ | — | — | — | — | — |
| Message template edit | ✅ | ✅ | — | — | — | — |
| Yande / team pay / careers | ✅ | — | — | — | — | — |
| Create space / QA lab tools | ✅ | ✅* | — | — | — | — |
| Club curator overview | ✅ | ✅ | — | ✅ | — | — |
| Own club branding / apps | — | — | — | — | ✅ | — |
| Own venue / partner data | — | — | — | — | — | ✅ |

\* QA/create-space APIs allow founder **or** admin via `requireFounderQaAccess`.

### Founder-gated destructive actions

- `DELETE /api/admin/events` — delete curated gathering
- `PATCH /api/admin/moderation/cases` with `action: "ban"` — deactivate member
- `POST /api/payments/stripe/refund` — issue Stripe refund
- Bulk destructive (when implemented): `bulk_delete`, `bulk_role_change`, `bulk_remove_user`, `bulk_deactivate` → founder only via `bulk-guard.ts`

---

## 3. Page-level protection (layouts)

| Portal | Layout | Guard |
|--------|--------|-------|
| Admin ops | `app/admin/(ops)/layout.tsx` | `getMissionControlRole()` + `canSignInAdminPortal()` → redirect `/company` |
| Founder portal | `app/founder/(portal)/layout.tsx` | `canSignInFounderPortal()` (founder only) |
| Curator portal | `app/curator/(portal)/layout.tsx` | `canSignInCuratorPortal()` (curator only) |
| Club owner | `app/club-owner/(authenticated)/layout.tsx` | `getClubOwnerRole()` + `canAccessPortal("club_owner")` |
| Partner | `app/partner/layout.tsx` | **CSS shell only** — partner dashboard pages rely on client/session auth; no server role gate on layout |
| Admin login | `app/admin/layout.tsx` | Unauthenticated shell (login page) |

Route-level capability enforcement within admin/founder: `StaffRouteGuard` + `capabilityForStaffPath()` in `lib/auth/mission-control.ts`.

---

## 4. Dashboard pages inventory

### Admin (`app/admin/(ops)/`)

| Path | Capability | Roles |
|------|------------|-------|
| `/admin/dashboard` | overview | founder, admin, moderator |
| `/admin/people` | women | founder, admin |
| `/admin/cities` | cities | founder, admin |
| `/admin/clubs` | clubs | founder, admin |
| `/admin/events` | happenings | founder, admin |
| `/admin/bloom-requests` | bloom_requests | founder, admin, moderator |
| `/admin/club-hosts` | hosts | founder, admin |
| `/admin/verification` | verification | founder, admin, moderator |
| `/admin/safety` | safety | founder, admin, moderator |
| `/admin/applications` | applications | founder, admin |
| `/admin/partners` | partners | founder, admin |
| `/admin/inbox` | inbox | founder, admin, moderator |
| `/admin/messaging` | messaging | founder, admin |
| `/admin/girls-working` | girls_working | founder, admin |
| `/admin/submissions` | submissions | founder, admin |
| `/admin/reports` | reports | founder, admin |
| `/admin/qa-lab` | qa_lab | founder, admin |

### Founder (`app/founder/(portal)/`)

Same capability paths as admin (founder-only caps enforced by `canMissionControl`): careers, team_pay, yande, markets, neighborhoods, create_space, content_moderation, magazine_review, plus founder-only pages (invites, team, marketing, content, create, etc.).

### Curator (`app/curator/(portal)/`)

| Path | Notes |
|------|-------|
| `/curator/dashboard` | overview |
| `/curator/gatherings` | gatherings |
| `/curator/women` | women |
| `/curator/pay` | pay |

### Club owner / Partner

Club-owner pages under `app/club-owner/(authenticated)/` — 30+ ops pages, gated by authenticated layout.  
Partner pages under `app/partner/` — marketing landing is public; login at `/partner/login`.

---

## 5. API route tables

### Admin APIs (`app/api/admin/**`) — 14 route files

| Path | Method | Roles | Writes? | Notifications? | Audit | Dry-run | Risk |
|------|--------|-------|---------|----------------|-------|---------|------|
| `/api/admin/approve-member` | GET | admin, founder | — | — | — | — | low |
| `/api/admin/approve-member` | POST | admin, founder | ✅ member status | ✅ in_app welcome | ✅ | — | **high** |
| `/api/admin/clubs` | GET | admin, founder, curator | — | — | — | — | low |
| `/api/admin/eventbrite` | GET | admin, founder | — | — | — | — | low |
| `/api/admin/events` | GET | admin, founder | — | — | — | — | low |
| `/api/admin/events` | POST | admin, founder | ✅ gathering | — | ✅ | — | medium |
| `/api/admin/events` | DELETE | **founder** | ✅ delete | — | ✅ | — | **high** |
| `/api/admin/live-stats` | GET | admin, founder | — | — | — | — | low |
| `/api/admin/login` | POST | — | — | — | — | — | — (410) |
| `/api/admin/logout` | POST | public | — | — | — | — | low |
| `/api/admin/moderation/cases` | GET | admin, founder, moderator | — | — | — | — | medium |
| `/api/admin/moderation/cases` | PATCH | admin, founder, moderator; **ban=founder** | ✅ case + profile | — | ✅ | — | **high** |
| `/api/admin/quick-stats` | GET | admin, founder | — | — | — | — | low |
| `/api/admin/stats` | GET | admin, founder | — | — | — | — | low |
| `/api/admin/submissions` | GET | admin, founder | — | — | — | — | low |
| `/api/admin/submissions/[id]` | PATCH | admin, founder | ✅ waitlist status | — | ✅ | — | medium |
| `/api/admin/verification-photo` | GET | admin, founder | — | — | — | — | medium |
| `/api/admin/verification-photo` | PATCH | admin, founder | ✅ verification_status | — | ✅ | — | **high** |
| `/api/admin/waitlist/notify` | POST | admin, founder | ✅ waitlist status | ✅ SMS batch | ✅ | ✅ | **high** |

**Admin API hardening:** 14/14 route files protected (login/logout intentionally public).

### Founder APIs (`app/api/founder/**`) — 7 route files

| Path | Method | Roles | Writes? | Audit | Risk |
|------|--------|-------|---------|-------|------|
| `/api/founder/create/generate` | POST | founder, admin | — | — | low |
| `/api/founder/create/weather` | GET | founder, admin | — | — | low |
| `/api/founder/marketing-assistant` | POST | **founder** | ✅ interviews | — | medium |
| `/api/founder/message-templates` | GET | founder, admin | — | — | low |
| `/api/founder/message-templates` | PATCH | founder, admin | ✅ templates | ✅ | medium |
| `/api/founder/moderation` | GET | admin, founder, moderator, curator | — | — | medium |
| `/api/founder/moderation` | PATCH | admin, founder, moderator | ✅ verdict | ✅ | **high** |
| `/api/founder/pitches` | GET | admin, founder, moderator, curator | — | — | low |
| `/api/founder/pitches` | PATCH | admin, founder, curator | ✅ pitch status | ✅ | medium |
| `/api/founder/qa` | POST | founder, admin | — | — | low |

**Founder API hardening:** 7/7 route files protected.

### Curator APIs

| Path | Method | Roles | Audit | Risk |
|------|--------|-------|-------|------|
| `/api/curator/overview` | GET | curator, admin, founder | — | low |

### Club-owner APIs

| Path | Method | Roles | Scope | Audit | Risk |
|------|--------|-------|-------|-------|------|
| `/api/club-owner/branding` | GET/PATCH | authenticated | own club (`owner_id`) | ❌ | medium |
| `/api/club-portal/*` | various | authenticated | own club | ❌ | medium |

### Partner APIs

| Path | Method | Roles | Scope | Audit | Risk |
|------|--------|-------|-------|-------|------|
| `/api/partner-portal/my-venue` | GET | authenticated | own venue | ❌ | low |
| `/api/girlmate/partner` | POST | public | insert application | — | low |
| `/api/girlmate/partner` | GET (list) | admin, founder | all applications | ❌ | medium |

### Related staff APIs (outside trees)

| Path | Method | Roles | Audit | Risk |
|------|--------|-------|-------|------|
| `/api/payments/stripe/refund` | POST | **founder** | ✅ | **high** |
| `/api/reservations/confirm` | PATCH | admin, founder | ❌ | medium |
| `/api/feedback` | GET/PATCH | admin, founder | ❌ | low |

---

## 6. Audit log coverage

**Table:** `admin_audit_logs` (Migration **115**)  
**Columns:** `id`, `actor_id`, `actor_role` (Migration **118**), `action`, `resource_type`, `resource_id`, `before_state`, `after_state`, `ip_address`, `user_agent`, `metadata`, `created_at`

| Action | Route | Logged |
|--------|-------|--------|
| Member approve/decline | `POST /api/admin/approve-member` | ✅ |
| ID verify approve/reject | `PATCH /api/admin/verification-photo` | ✅ |
| Waitlist status change | `PATCH /api/admin/submissions/[id]` | ✅ |
| Waitlist SMS batch | `POST /api/admin/waitlist/notify` | ✅ (+ notification-service) |
| Moderation case update/ban | `PATCH /api/admin/moderation/cases` | ✅ |
| Content moderation verdict | `PATCH /api/founder/moderation` | ✅ |
| Magazine pitch review | `PATCH /api/founder/pitches` | ✅ |
| Event create/delete | `POST/DELETE /api/admin/events` | ✅ |
| Stripe refund | `POST /api/payments/stripe/refund` | ✅ (+ payment_audit_logs) |
| Message template edit | `PATCH /api/founder/message-templates` | ✅ |
| Role change API | — | ❌ (no route yet) |
| Club host approve | UI localStorage prototype | ❌ (no API) |
| Reservation confirm | `PATCH /api/reservations/confirm` | ❌ |
| Club portal application accept | `PATCH /api/club-portal/applications` | ❌ |

---

## 7. Bulk guard coverage

| Route | Action key | Guard |
|-------|------------|-------|
| `POST /api/admin/waitlist/notify` | `waitlist_sms_batch` | ✅ founder/admin; dry_run supported |
| Future bulk delete/role change | `bulk_delete`, etc. | ✅ founder-only in `bulk-guard.ts` |

---

## 8. SMS blast policy

| Rule | Implementation |
|------|----------------|
| Trigger roles | founder, admin (`requireAdmin` + `assertBulkActionAllowed`) |
| Templates only | `TEMPLATE_MAP` — `private_beta_accepted`, `launch_announcement` |
| Rate limit | `ADMIN_SMS_BATCH_LIMIT` (500) + per-user SMS caps in `notification_events` |
| Dry run | `dry_run: true` returns recipient preview + audit entry |
| Audit | `writeAdminAuditLog` on dry-run and send |

---

## 9. Migrations used

| File | Purpose |
|------|---------|
| `supabase/migrations/115_admin_moderation_hardening.sql` | `admin_audit_logs`, `moderation_cases` |
| `supabase/migrations/118_admin_audit_actor_role.sql` | `actor_role` column + index |

---

## 10. Pre-beta checklist

- [x] Password admin auth removed; Supabase + `profiles.role` only
- [x] All `app/api/admin/**` routes require staff session
- [x] All `app/api/founder/**` routes require staff session
- [x] Curator API uses `requireRole`
- [x] Founder-only gates on refund, event delete, moderation ban
- [x] Bulk SMS guard + dry-run on waitlist notify
- [x] Audit logs on sensitive member/safety/payment actions
- [x] Admin/founder/curator layouts server-gated
- [ ] Run migrations 115 + 118 on production Supabase
- [ ] Wire verification UI to `PATCH /api/admin/verification-photo` (UI still uses localStorage prototype)
- [ ] Add server layout role gate for `/partner/*` authenticated pages
- [ ] Add audit logs to `reservations/confirm` and club-portal writes
- [ ] Implement role-change API with founder-only guard + audit when built

---

## Summary counts

| Metric | Value |
|--------|-------|
| Admin API files hardened | **14 / 14** |
| Founder API files hardened | **7 / 7** |
| Curator API files hardened | **1 / 1** |
| Password auth active in `app/` | **0** |
| Sensitive actions with audit log | **10 routes** |
| Audit gaps (documented above) | **4** |
