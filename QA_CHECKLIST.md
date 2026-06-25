# BloomBay QA Checklist

> Manual regression checklist before beta / release.  
> Run build gate first: `npm run lint && npm run typecheck && npm run build`  
> Security flows: see `SECURITY_TEST_PLAN.md`

**Tester:** _______________  
**Date:** _______________  
**Branch / deploy:** _______________  
**Environment:** local / preview / production  

Pass = works as expected · Fail = note in **Issues** column · N/A = not in scope

---

## Pre-flight

| Step | Pass | Issues |
|------|------|--------|
| `npm run lint` exits 0 | ☐ | |
| `npm run typecheck` exits 0 | ☐ | |
| `npm run build` exits 0 | ☐ | |
| Run `npm install` if typecheck reports missing packages | ☐ | |
| Delete stale `.next/dev` if typecheck references removed routes | ☐ | |
| `.env.local` present locally; Vercel env set for preview/prod | ☐ | |
| Supabase migrations applied | ☐ | |

---

## Signup

| Step | Pass | Issues |
|------|------|--------|
| Waitlist / invite flow submits without error | ☐ | |
| Email validation rejects bad addresses | ☐ | |
| Duplicate signup handled gracefully | ☐ | |
| Confirmation / next-step messaging clear | ☐ | |

---

## Login

| Step | Pass | Issues |
|------|------|--------|
| Member login at `/member/login` | ☐ | |
| Company login at `/company` routes to correct portal by role | ☐ | |
| Wrong password shows clear error (no stack trace) | ☐ | |
| Sign out clears session and redirects safely | ☐ | |
| OAuth / magic link callback at `/auth/callback` (if enabled) | ☐ | |

---

## Onboarding

| Step | Pass | Issues |
|------|------|--------|
| New member can complete onboarding steps | ☐ | |
| Incomplete onboarding blocks gated features (messages, blooms, etc.) | ☐ | |
| Profile bootstrap creates usable profile row | ☐ | |
| Onboarding state persists across refresh | ☐ | |

---

## Home

| Step | Pass | Issues |
|------|------|--------|
| `/member/home` loads on mobile and desktop | ☐ | |
| Desktop: persistent sidebar visible (≥1024px) | ☐ | |
| Mobile: hamburger nav works | ☐ | |
| Scrapbook / board content renders (no broken images) | ☐ | |
| Nav links reach correct destinations | ☐ | |

---

## City

| Step | Pass | Issues |
|------|------|--------|
| `/member/city` loads | ☐ | |
| City content / trending sections render | ☐ | |
| Deep links and back navigation work | ☐ | |

---

## Happenings

| Step | Pass | Issues |
|------|------|--------|
| `/member/happenings` lists gatherings | ☐ | |
| Happening detail page loads | ☐ | |
| RSVP / reserve flow completes (truth mode on) | ☐ | |
| Ticket / confirmation surfaces after RSVP | ☐ | |
| Past happenings handled correctly | ☐ | |

---

## Maps

| Step | Pass | Issues |
|------|------|--------|
| `/member/maps` redirects to `/member/city` (or maps UI if re-enabled) | ☐ | |
| Map pins / location features work if exposed in city UI | ☐ | |

---

## Clubs

| Step | Pass | Issues |
|------|------|--------|
| `/member/clubs` discovery loads | ☐ | |
| Club detail page loads | ☐ | |
| Join club flow works | ☐ | |
| Club membership reflected in profile / lounge | ☐ | |
| Create club flow (if enabled for user) | ☐ | |

---

## Avenue

| Step | Pass | Issues |
|------|------|--------|
| Avenue hub loads (`/member/avenue` or room routes) | ☐ | |
| Magazine / screening room / editorial rooms render | ☐ | |
| Content loads without auth errors for verified member | ☐ | |

---

## Plans

| Step | Pass | Issues |
|------|------|--------|
| `/member/plans` loads with server data | ☐ | |
| Error banner + Retry if API fails (simulate offline) | ☐ | |
| Create plan sheet completes | ☐ | |
| Plan room opens and back navigation works | ☐ | |
| Calendar overlay opens / closes | ☐ | |
| Memories section shows past attendance (if any) | ☐ | |
| Wallet / tickets entry points work | ☐ | |

---

## Introductions

| Step | Pass | Issues |
|------|------|--------|
| Introduction / bloom request flow (if route enabled) | ☐ | |
| Redirect behavior documented if feature gated | ☐ | |
| Respond to introduction works | ☐ | |

---

## Girlmates

| Step | Pass | Issues |
|------|------|--------|
| Girlmate listings browse | ☐ | |
| Create / edit listing (verified member) | ☐ | |
| Send message to listing owner | ☐ | |
| Inbox loads | ☐ | |
| Blocked user cannot message (see security plan) | ☐ | |

---

## Event creation

| Step | Pass | Issues |
|------|------|--------|
| `/member/happenings/create` accessible to verified host | ☐ | |
| Unverified member blocked from publishing live | ☐ | |
| Event without gov ID → `pending_id_verification` (not live) | ☐ | |
| Verified gov ID → event can go live | ☐ | |
| Created event appears in happenings feed when live | ☐ | |

---

## ID verification

| Step | Pass | Issues |
|------|------|--------|
| ID upload / verification flow reachable | ☐ | |
| Pending state shown correctly | ☐ | |
| Admin approval updates `verification_status` / `gov_id_verification_status` | ☐ | |
| Verified badge reflected in profile | ☐ | |

---

## Payments

| Step | Pass | Issues |
|------|------|--------|
| Membership checkout redirects to Stripe | ☐ | |
| Event ticket checkout uses server-side price (not client tampering) | ☐ | |
| Stripe webhook completes order (test mode) | ☐ | |
| User sees confirmation / ticket after payment | ☐ | |
| Failed payment handled gracefully | ☐ | |

---

## Admin approval

| Step | Pass | Issues |
|------|------|--------|
| Admin can sign in at `/admin/login` (Supabase auth) | ☐ | |
| Non-admin cannot call `/api/admin/approve-member` | ☐ | |
| Approve member updates `is_member` / welcome flow | ☐ | |
| Founder dashboard stats load | ☐ | |

---

## Reports / blocks

| Step | Pass | Issues |
|------|------|--------|
| User can report another user | ☐ | |
| User can block another user | ☐ | |
| Blocked user hidden from blooms / pin drops / messages | ☐ | |
| Unblock works | ☐ | |

---

## Notifications

| Step | Pass | Issues |
|------|------|--------|
| `/member/notifications` loads | ☐ | |
| New notification appears after trigger event | ☐ | |
| Mark read / clear works | ☐ | |
| Email / SMS sent when configured (spot check) | ☐ | |

---

## Cross-cutting

| Step | Pass | Issues |
|------|------|--------|
| Warm palette consistent (no dark charcoal page backgrounds) | ☐ | |
| No console errors on primary flows | ☐ | |
| 401/403 pages are human-readable | ☐ | |
| PWA / manifest loads (if testing mobile install) | ☐ | |

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| QA | | | ☐ |
| Product | | | ☐ |
| Engineering | | | ☐ |
