# BloomBay Environment Variables Audit

> Generated from codebase scan (`process.env.*` references).  
> **Store secrets only in Vercel Environment Variables** (or local `.env.local`).  
> Companion: `SECURITY_TEST_PLAN.md`, `docs/SETUP.md`

---

## Git safety

| Check | Status |
|-------|--------|
| `.env.local` gitignored | ✅ `.gitignore` line: `.env*` |
| `.env` committed | ❌ Must never commit |
| Secrets in chat / GitHub | ⚠️ Rotate if ever pasted (see rotation notes below) |

---

## Public variables (safe in browser)

Exposed via `NEXT_PUBLIC_*` — assume visible in client bundles.

| Variable | Purpose | Used in |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `lib/supabase/*`, `proxy.ts`, API routes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (RLS-bound) | Client + server session clients |
| `NEXT_PUBLIC_SITE_URL` | OAuth redirect base | `lib/auth/actions.ts` |
| `NEXT_PUBLIC_APP_URL` | App canonical URL (links, checkout return) | Payments, emails, scan page |
| `NEXT_PUBLIC_BASE_URL` | Alternate base URL (if set) | Sparse usage |
| `NEXT_PUBLIC_BLOOMBAY_TRUTHFUL` | Truth layer on (`!== "0"`) | `lib/truth/config.ts` |
| `NEXT_PUBLIC_BLOOMBAY_DEMO_FALLBACK` | Demo fallback when truth off | `lib/truth/config.ts` |
| `NEXT_PUBLIC_DEV_AUTH_HINTS` | Dev-only auth UI hints | `_cursor-member` dev components |

**Note:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` is *designed* to be public; security depends on **RLS**, not key secrecy.

**Documented but unused in code:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (README only — Stripe.js not wired client-side yet).

---

## Server-only variables (never `NEXT_PUBLIC_`)

| Variable | Category | Purpose |
|----------|----------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Bypasses RLS — API/cron/admin only |
| `STRIPE_SECRET_KEY` | **Secret** | Stripe API |
| `STRIPE_WEBHOOK_SECRET` | **Secret** | Webhook signature verification |
| `ANTHROPIC_API_KEY` | **Secret** | Yande, Avenue AI, humanize |
| `RESEND_API_KEY` | **Secret** | Transactional email |
| `TWILIO_ACCOUNT_SID` | **Secret** | SMS |
| `TWILIO_AUTH_TOKEN` | **Secret** | SMS |
| `TWILIO_PHONE_NUMBER` | Server | SMS sender |
| `TWILIO_FROM_NUMBER` | Server | Alt sender (`lib/notifications/sms.ts`) |
| `CRON_SECRET` | **Secret** | Vercel cron auth header |
| `WHOP_WEBHOOK_SECRET` | **Secret** | Legacy Whop webhooks |
| `WHOP_API_KEY` | **Secret** | Legacy Whop checkout |
| `APIFY_API_KEY` | **Secret** | City intelligence scraping |
| `EVENTBRITE_API_KEY` | **Secret** | Event import |
| `YELP_API_KEY` | **Secret** | City spots |
| `GOOGLE_PLACES_API_KEY` | **Secret** | City spots |
| `FLW_SECRET_KEY` | **Secret** | Flutterwave (if enabled) |
| `FLW_WEBHOOK_HASH` | **Secret** | Flutterwave webhooks |
| `WAVE_API_KEY` | **Secret** | Wave payments (if enabled) |
| `AT_API_KEY` / `AT_USERNAME` | **Secret** | Africa's Talking SMS (if enabled) |
| `DATABASE_URL` / `SUPABASE_DB_URL` | **Secret** | `scripts/db-setup.mjs` direct Postgres |
| `SUPABASE_URL` | Server | MCP server (`mcp/src/supabase.ts`) — prefer `NEXT_PUBLIC_SUPABASE_URL` |

### Stripe price IDs (server-only)

| Variable | Purpose |
|----------|---------|
| `STRIPE_PRICE_MONTHLY` | Membership checkout |
| `STRIPE_PRICE_BIANNUAL` | Membership checkout |
| `STRIPE_PRICE_ANNUAL` | Membership checkout |
| `STRIPE_CURRENCY` | Default `usd` |

### Cron controls (`lib/cron-guard.ts`)

| Variable | Purpose |
|----------|---------|
| `CRON_SECRET` | **Secret** — `x-cron-secret` or `Authorization: Bearer` on all `/api/cron/*` |
| `CRON_ENABLED` | `"true"` / `"1"` opt-in; unset or other values skip all crons |
| `CRON_DRY_RUN` | `"true"` / `"1"` — handlers receive `ctx.dryRun`; no DB writes when respected |
| `CRON_MAX_RECORDS` | Default batch cap (100); per-route via `ctx.maxRecords` |

Run audit log table: `cron_logs` (see `CRON_AUDIT.md`).

### Operational / non-secret server flags

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | `development` / `production` |
| `ALLOW_FUNNEL_DEMO` | `"1"` enables demo IRL funnel (non-prod) |
| `FOUNDER_USER_ID` | Cron notifications target UUID |
| `RESEND_FROM` | From address override |
| `NOTIFY_FROM_EMAIL` | Notification sender |
| `WHOP_PLAN_ID` | Legacy Whop plan |

---

## Deprecated / remove

| Variable | Status | Action |
|----------|--------|--------|
| `ADMIN_PASSWORD` | **Deprecated** | Not read from `process.env` anywhere. `/api/admin/login` returns `410`. Admin uses Supabase auth at `/admin/login`. Remove from README and stale UI copy when approved. |
| `WHOP_*` | Legacy | Migrate fully to Stripe or document as optional |
| `lib/supabase.ts` | Legacy client | Prefer `lib/supabase/server` + `client` |

---

## Flagged: secrets that must NOT use `NEXT_PUBLIC_`

| Finding | Severity | Detail |
|---------|----------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` as `NEXT_PUBLIC_*` | 🔴 Critical | **Not present** — good |
| Stripe / Anthropic / Twilio as `NEXT_PUBLIC_*` | 🔴 Critical | **Not present** — good |
| `lib/supabase-admin.ts` fallback | 🟡 Medium | Falls back to `NEXT_PUBLIC_SUPABASE_ANON_KEY` if service role missing — dev only; **never deploy prod without service role** |

---

## Required for local dev (minimum)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Required for production beta

Add as needed per feature:

```env
NEXT_PUBLIC_SITE_URL=https://bloombay.com
NEXT_PUBLIC_APP_URL=https://bloombay.com
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_MONTHLY=
STRIPE_PRICE_BIANNUAL=
STRIPE_PRICE_ANNUAL=
CRON_SECRET=
CRON_ENABLED=true
ANTHROPIC_API_KEY=          # Yande / Avenue AI
```

---

## Key rotation guide

Rotate immediately if a key appeared in Claude chats, screenshots, or Git history.

| Service | Where to rotate | After rotation |
|---------|-----------------|----------------|
| **Supabase** | Dashboard → Settings → API → regenerate anon + service role | Update Vercel env; redeploy; anon key is public but rotation invalidates old JWTs |
| **Stripe** | Dashboard → Developers → API keys; Webhooks → signing secret | Update `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` in Vercel |
| **Anthropic** | Console → API keys | Update `ANTHROPIC_API_KEY` |
| **Resend** | Dashboard → API Keys | Update `RESEND_API_KEY` |
| **Twilio** | Console → Auth tokens | Update `TWILIO_AUTH_TOKEN` (rotates SID pairing) |
| **Cron** | Generate new random string | Update `CRON_SECRET` + Vercel cron config |

---

## Vercel checklist

- [ ] All **secret** vars set for Production (not exposed to client)
- [ ] Preview env has separate Supabase project or scoped keys
- [ ] `CRON_SECRET` matches Vercel cron `Authorization` header
- [ ] Stripe webhook endpoint points to production URL with live signing secret
- [ ] No env vars duplicated as `NEXT_PUBLIC_` unless intentionally public

---

## Code references

| Concern | File |
|---------|------|
| Supabase browser client | `lib/supabase/client.ts` |
| Supabase server session | `lib/supabase/server.ts` |
| Service role admin | `lib/supabase/admin.ts` |
| Legacy admin fallback | `lib/supabase-admin.ts` |
| Stripe | `lib/payments/stripe.ts` |
| Resend | `lib/email/resend-client.ts` |
| Twilio | `lib/sms/twilio-client.ts`, `lib/notifications/sms.ts` |
| Cron guard | `lib/cron-guard.ts` |
| Truth mode flags | `lib/truth/config.ts` |
| Route protection | `proxy.ts` |

---

## Follow-up (requires approval — no UI)

1. Remove `ADMIN_PASSWORD` mentions from `README.md`, `lib/auth/session.ts`, `bloombay-login.tsx`
2. Remove dead `signInFounderWithDashboardPassword` path in `session.ts`
3. Add `.env.example` with non-secret placeholders only
4. Consolidate `TWILIO_PHONE_NUMBER` vs `TWILIO_FROM_NUMBER` naming
