# BloomBay Security Test Plan

> Pre-beta security verification. Complements `SECURITY_ROUTE_MATRIX.md` and `ENVIRONMENT_AUDIT.md`.  
> **No UI changes required** — these are manual and API-level checks.

Run before each beta gate:

```bash
npm run lint && npm run typecheck && npm run build
```

`typescript.ignoreBuildErrors` must **not** be set in `next.config.ts` (currently removed).

---

## 1. Non-admin cannot approve members

**Risk:** Privilege escalation — regular members approve themselves or others.

**Code reference:** `app/api/admin/approve-member/route.ts` → `verifyAdminRequest()`

| # | Test | Expected | Pass |
|---|------|----------|------|
| 1.1 | `POST /api/admin/approve-member` with **no session** | `401` or `403` | ☐ |
| 1.2 | `POST` as **member** session with valid body | `403` / not approved | ☐ |
| 1.3 | `POST` as **admin** or **founder** session | `200` / member approved | ☐ |
| 1.4 | Browser: member visits `/admin/*` | Redirect or access denied | ☐ |

**curl example (replace cookies):**

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST \
  https://YOUR_HOST/api/admin/approve-member \
  -H "Content-Type: application/json" \
  -d '{"userId":"TARGET_UUID"}'
# Expect 401/403 without admin cookie
```

---

## 2. User cannot change their own role

**Risk:** Self-elevation to `admin` / `founder`.

**Code reference:** `supabase/migrations/107_auth_hardening.sql` — `profiles_update_own` WITH CHECK on `role`

| # | Test | Expected | Pass |
|---|------|----------|------|
| 2.1 | Member `PATCH` own profile via Supabase client: `{ role: "admin" }` | RLS error / no change | ☐ |
| 2.2 | Member `PATCH` `verification_status` to `verified` | Blocked | ☐ |
| 2.3 | Member `PATCH` `is_member` to `true` | Blocked | ☐ |
| 2.4 | Member `PATCH` safe fields (`bio`, `neighborhood`) | Allowed | ☐ |

**SQL (run as authenticated member JWT in Supabase SQL editor or client):**

```sql
UPDATE profiles SET role = 'admin' WHERE id = auth.uid();
-- Expect: policy violation or 0 rows updated
```

---

## 3. User cannot read all profiles

**Risk:** Mass PII harvest via open `profiles` SELECT.

**Code reference:** `supabase/migrations/102_profile_privacy.sql`

| # | Test | Expected | Pass |
|---|------|----------|------|
| 3.1 | Member selects **own** row from `profiles` | Full row allowed | ☐ |
| 3.2 | Member selects **another user's** row from `profiles` | Denied or empty | ☐ |
| 3.3 | Member selects from `public_profiles` view | Limited columns only | ☐ |
| 3.4 | Admin/founder selects all `profiles` | Allowed | ☐ |
| 3.5 | `GET /api/member/profile/[username]` | Public-safe fields only | ☐ |

---

## 4. User cannot read all club memberships

**Risk:** Enumerate who belongs to which club.

**Code reference:** RLS on `club_memberships` (see `003_irl_core.sql`, later hardening migrations)

| # | Test | Expected | Pass |
|---|------|----------|------|
| 4.1 | Member lists **own** memberships | Allowed | ☐ |
| 4.2 | Member `SELECT * FROM club_memberships` without filter | Only own rows (or policy-scoped) | ☐ |
| 4.3 | Member reads another user's membership via direct ID | Denied | ☐ |
| 4.4 | Club owner reads memberships for **their** club | Allowed | ☐ |
| 4.5 | Club owner cannot read memberships for **other** clubs | Denied | ☐ |

---

## 5. User cannot change ticket price

**Risk:** Client sends `amount_cents: 1` and pays pennies for a ticket.

**Code reference:** `app/api/payments/stripe/checkout/route.ts` — fetches `ticket_price_cents` from `gatherings` server-side

| # | Test | Expected | Pass |
|---|------|----------|------|
| 5.1 | `POST /api/payments/stripe/checkout` with `type: "ticket"`, valid `eventId`, **no price in body** | Checkout uses DB price | ☐ |
| 5.2 | Same request with tampered `amount_cents` or `price` in JSON | Ignored; DB price used | ☐ |
| 5.3 | Stripe Checkout Session amount matches `gatherings.ticket_price_cents` | Match | ☐ |
| 5.4 | Membership checkout uses `STRIPE_PRICE_*` env IDs, not client plan amount | Match Stripe dashboard | ☐ |

**curl example:**

```bash
curl -s -X POST https://YOUR_HOST/api/payments/stripe/checkout \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_MEMBER_SESSION" \
  -d '{"type":"ticket","eventId":"EVENT_UUID","amount_cents":1}'
# Stripe session should still reflect DB price, not 1 cent
```

---

## 6. User cannot message blocked user

**Risk:** Harassment bypass after block.

**Code reference:** `lib/auth/block-check.ts`, `app/api/girlmate/messages/route.ts`, `app/api/member/bloom-requests/route.ts`

| # | Test | Expected | Pass |
|---|------|----------|------|
| 6.1 | User A blocks User B; A `POST /api/girlmate/messages` to B | `403` "Cannot send message" | ☐ |
| 6.2 | B messages A (B blocked by A) | `403` | ☐ |
| 6.3 | A sends bloom request to B when blocked | `403` | ☐ |
| 6.4 | Pin drop excludes blocked recipients | Blocked IDs not in recipients | ☐ |
| 6.5 | Unblock restores messaging | `200` after unblock | ☐ |

**Setup:** Insert into `user_blocks (blocker_id, blocked_id)` as User A blocking B, then attempt API calls with both sessions.

---

## 7. User cannot publish event without ID verification

**Risk:** Unverified hosts publish live public gatherings.

**Code reference:** `lib/actions/happenings.ts` — `gov_id_verification_status`, `publishStatus: "pending_id_verification"`

| # | Test | Expected | Pass |
|---|------|----------|------|
| 7.1 | Member with `gov_id_verification_status != 'verified'` creates event | `pending_id_verification`, not public live | ☐ |
| 7.2 | Same user cannot flip `is_published` via client-only state | Server enforces status | ☐ |
| 7.3 | Member with verified gov ID creates event | Can go `live` (if other checks pass) | ☐ |
| 7.4 | Unverified member `POST /api/member/gatherings` | `403` if `verification_status` not verified | ☐ |
| 7.5 | Wall post without `verification_status === 'verified'` | `403` (`app/api/wall/posts/route.ts`) | ☐ |

---

## 8. Additional high-value checks

| # | Area | Test | Expected | Pass |
|---|------|------|----------|------|
| 8.1 | Cron | `POST /api/cron/*` without `CRON_SECRET` | `401` | ☐ |
| 8.2 | Service role | `SUPABASE_SERVICE_ROLE_KEY` never in client bundle | Not in browser sources | ☐ |
| 8.3 | Admin login | `POST /api/admin/login` | `410` (password login disabled) | ☐ |
| 8.4 | Webhooks | Stripe webhook without valid signature | `400` | ☐ |
| 8.5 | Funnel demo | `POST /api/irl/complete-funnel` in production without flag | `403` | ☐ |

---

## 9. Automated test backlog

No automated security test suite exists yet. Recommended next steps (after approval):

| Priority | Suite | Tool |
|----------|-------|------|
| P0 | API auth matrix for `/api/admin/*`, `/api/cron/*` | Vitest + supertest or Playwright API |
| P0 | RLS policies | Supabase `pgTAP` or scripted JWT tests |
| P1 | Stripe checkout price integrity | Integration test with Stripe test mode |
| P1 | Block / message flows | API integration tests |
| P2 | E2E smoke | Playwright on login → home → happenings |

---

## Sign-off

| Test area | Tester | Date | Pass |
|-----------|--------|------|------|
| Admin / role escalation | | | ☐ |
| Profile privacy (RLS) | | | ☐ |
| Club membership privacy | | | ☐ |
| Stripe price tampering | | | ☐ |
| Blocked messaging | | | ☐ |
| Event publish + ID verification | | | ☐ |
| Cron / webhook hardening | | | ☐ |
