# BloomBay Auth Architecture

> Supabase Auth · `profiles.role` · Edge proxy · Isolated portals

---

## Roles

Stored on `public.profiles.role` as enum `user_role`:

| Role | Portal | Home after login |
|------|--------|------------------|
| `member` | Member | `/member/home` |
| `founder` | Founder | `/founder/dashboard` |
| `admin` | Admin / Ops | `/admin/dashboard` |
| `moderator` | Admin / Ops | `/admin/dashboard` |
| `curator` | Curator | `/curator/dashboard` |
| `club_owner` | Clubhouse | `/club-owner/dashboard` |
| `partner` | Partner | `/partner` or `/partner/dashboard` |

Source: `supabase/migrations/002_profiles_auth.sql`, `lib/auth/roles.ts`, `lib/auth/get-user.ts`.

**Aliases** normalized in code: `club_mama`, `host`, `clubowner` → `club_owner`.

---

## Login URLs

| Portal | Primary login | Notes |
|--------|---------------|-------|
| Member | `/member/login` | Public member sign-in |
| Staff (founder, admin, club owner, partner, curator) | `/company` | Unified company portal (`COMPANY_LOGIN`) |
| Legacy | `/founder/login`, `/admin/login`, `/club-owner/login`, etc. | Still recognized by `proxy.ts` |

GirlMate: `/girlmate/login`, `/girlmate/signup`

OAuth / magic link callback: `/auth/callback`

---

## Session flow

```
1. User submits credentials at login page (BloomBayLogin / company login)
2. Supabase Auth creates session (cookies via @supabase/ssr)
3. handle_new_user() trigger ensures profiles row exists
4. proxy.ts runs on each request → getUser() → role check vs pathname
5. API routes call requireAuth() / requireRole() independently
```

### Key files

| File | Role |
|------|------|
| `proxy.ts` | Edge protection, legacy redirects, GirlMate gates, onboarding gate |
| `lib/supabase/middleware.ts` | Alternate session helper (cookie role cache) |
| `lib/auth/get-user.ts` | `getAuthUser()` — session + profile join |
| `lib/auth/require-role.ts` | API route guards |
| `lib/auth/actions.ts` | Server actions for login forms |
| `lib/auth/roles.ts` | `PORTAL_ALLOWED`, `homeForRole`, email → role inference |
| `app/auth/callback/route.ts` | OAuth callback handler |

---

## Portal isolation

Each role may only access its portal prefix (`PORTAL_ALLOWED` in `lib/auth/roles.ts`):

- Member on `/founder/*` → redirect to member home or login with error
- Wrong portal sign-in → rejected at login (role mismatch)

`proxy.ts` protected prefixes: `/member`, `/admin`, `/founder`, `/club-owner`, `/partner`, `/curator`, `/portals`

Unauthenticated access → redirect to portal-specific login with `?redirect=` return URL.

---

## Profile creation

`handle_new_user()` (002): on `auth.users` insert → `profiles` row with default `role = 'member'`.

Role changes: SQL update on `profiles` or sign-up metadata (founder tooling only). **107_auth_hardening** prevents users from updating their own `role` via client.

---

## Verification & gates

| Gate | Mechanism |
|------|-----------|
| Email verified | Supabase Auth |
| Member verified (`profiles.verified`) | Founder approval / ID review (Phase 2) |
| Happenings / intros | Middleware or page checks on `verified` |
| Event publish (ID) | `105_event_publishing_id_gate.sql` |

Demo verification UI may exist — replace with real queue per `docs/TRUTH-ROADMAP.md` Phase 2.

---

## RLS (Row Level Security)

Auth ties to Postgres via `auth.uid()`:

```sql
-- Example: own behavior signals
create policy "Behavior signals own"
  on public.member_behavior_signals for select
  using (user_id = auth.uid());
```

Patterns:
- **Own row**: `user_id = auth.uid()` or `id = auth.uid()`
- **Authenticated read**: gatherings, clubs (public catalog)
- **Ops read-all**: founder/admin policies on profiles
- **Service role**: bypasses RLS (cron, webhooks, admin batch)

---

## Dev & test helpers

| Helper | Purpose |
|--------|---------|
| `roleFromEmailAddress()` | `founder@bloombay.app`, `member@bloombay.app`, etc. |
| `mama.{clubslug}@bloombay.app` | Infer club_owner |
| Cookie `bb_dev_role` | Dev-only role override |
| `NEXT_PUBLIC_DEV_AUTH_HINTS=1` | Role picker on login screens |

**Production:** rely on `profiles.role` in database, not email inference alone.

---

## Sign out

- `POST /api/auth/sign-out`
- `lib/auth/member-sign-out.ts` — client helper
- Portal-specific sign-out buttons in sidebar footers

---

## Security hardening (migrations)

| Migration | Hardening |
|-----------|-----------|
| `107_auth_hardening.sql` | Profile update column allowlist |
| `102_profile_privacy.sql` | Restricted profile visibility |
| `103_block_report.sql` | Blocks and reports |
| `105_event_publishing_id_gate.sql` | Gov ID for event publish |

See also `SECURITY_ROUTE_MATRIX.md`.

---

## Adding a new role or portal

1. Extend `user_role` enum in new migration
2. Update `lib/auth/roles.ts` — `USER_ROLES`, `PORTAL_ALLOWED`, `ROLE_HOME`
3. Add login path + `proxy.ts` protected prefix
4. Create `(portal)/layout.tsx` with role check
5. Add RLS policies for role-specific tables
6. Document in `docs/PORTALS.md`
