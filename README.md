# BloomBay

BloomBay is a members-only social platform for women — combining curated clubs, a city guide, girlmate (roommate) matching, and Yande, an AI companion.

**Live:** [bloombay.app](https://bloombay.app) · **Docs:** [`ARCHITECTURE_REVIEW_PACK.md`](./ARCHITECTURE_REVIEW_PACK.md)

## Stack

- **Next.js 16** (App Router)
- **Supabase** — Auth, Postgres, RLS, Storage
- **Stripe** — membership and event ticketing
- **Anthropic Claude** — Yande AI, humanized messaging
- **Twilio** — SMS notifications
- **Resend** — transactional email
- **Vercel** — hosting and cron jobs

## Project structure

```
app/                    Next.js App Router
  api/                  API routes
    admin/              Admin-only endpoints (Supabase session auth)
    cron/               Scheduled jobs (x-cron-secret auth)
    girlmate/           Girlmate listing and messaging
    member/             Member portal endpoints
    payments/           Stripe checkout
  components/           Shared UI components
  member/               Member portal pages
lib/                    Shared utilities
  admin-auth.ts         Admin session verification (Supabase role-based)
  cron-guard.ts         Cron kill switch and logging
  humanize.ts           AI text humanizer (11 modes, memory-aware)
  payments.ts           Stripe helpers
mcp/                    MCP server for Yande AI (Claude Desktop)
supabase/
  migrations/           Database migrations (run in order)
```

## Environment variables

Copy `.env.local` from a teammate or Vercel. **Full reference:** [`ENVIRONMENT_AUDIT.md`](./ENVIRONMENT_AUDIT.md).

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=             # OAuth redirects
NEXT_PUBLIC_APP_URL=              # canonical app URL (links, checkout return)
SUPABASE_SERVICE_ROLE_KEY=        # server-side only — never NEXT_PUBLIC_
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
RESEND_API_KEY=
CRON_SECRET=                      # Vercel cron auth (x-cron-secret or Bearer)
CRON_ENABLED=true                 # set false to kill all cron jobs
CRON_DRY_RUN=false                # set true to log without writes/sends
CRON_MAX_RECORDS=100              # max records per cron run
EVENTBRITE_API_KEY=               # optional
```

Admin and founder dashboards use **Supabase Auth** (`/admin/login`) with `profiles.role` — no shared password env vars.

## Development

```bash
npm install
npm run dev
```

### Quality gate (run before beta)

```bash
npm run lint
npm run typecheck
npm run build
# or all at once:
npm run check
```

See `QA_CHECKLIST.md`, `SECURITY_TEST_PLAN.md`, and `ENVIRONMENT_AUDIT.md`.

## Cron kill switch

Set `CRON_ENABLED=false` in environment variables to pause all scheduled jobs without a deploy.

## Admin access

Admin routes require a Supabase session where the user's `profiles.role` is `admin` or `founder`. There is no header-based password access.
