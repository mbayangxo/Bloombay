# BloomBay setup — auth + IRL loop

Follow these steps in order. Takes about 30–45 minutes the first time.

---

## 1. Environment variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret
```

Optional for local UI hints on login:

```bash
NEXT_PUBLIC_DEV_AUTH_HINTS=1
```

Get keys from **Supabase → Project Settings → API**.

---

## 2. Run SQL migrations (Supabase Dashboard)

Open **SQL Editor** and run each file **in order** (copy/paste full file → Run):

| Order | File |
|-------|------|
| 1 | `supabase/migrations/000_waitlist_table.sql` |
| 2 | `supabase/migrations/001_waitlist_status.sql` (if not already in 000) |
| 3 | `supabase/migrations/002_profiles_auth.sql` |
| 4 | `supabase/migrations/003_irl_core.sql` |
| 5 | `supabase/migrations/004_founder_profiles_rls.sql` |
| 6 | `supabase/migrations/005_careers_applications.sql` |
| 7 | `supabase/migrations/006_member_truth_layer.sql` |
| 8 | `supabase/migrations/007_community_theme_safety.sql` |

Or run the combined `supabase/apply-all.sql` **plus** `003`–`007` if `apply-all` is only waitlist + profiles.

**007 adds:** Girlmates `community_posts`, `theme_preference` on member preferences, `safety_reports` for Contact settings, Yande memory stub.

**Phase 1 truthful writes:** see [TRUTH-ROADMAP.md](./TRUTH-ROADMAP.md). Set `NEXT_PUBLIC_BLOOMBAY_TRUTHFUL=1` (default). Use `NEXT_PUBLIC_BLOOMBAY_DEMO_FALLBACK=1` only for offline UI dev.

---

## 3. Auth redirect URLs

**Authentication → URL configuration**

Add:

- `http://localhost:3000/auth/callback`
- `https://YOUR_PRODUCTION_DOMAIN/auth/callback`

Site URL can be `http://localhost:3000` for dev.

---

## 4. Create portal users

**Authentication → Users → Add user** (email + password). Repeat for each role you need.

Then in **SQL Editor**, set roles (replace emails):

```sql
update public.profiles set role = 'founder', verified = true
where email = 'you@yourcompany.com';

update public.profiles set role = 'club_owner', verified = true
where email = 'host@yourclub.com';

update public.profiles set role = 'member', verified = true
where email = 'member@test.com';
```

New signups default to `member` via the `handle_new_user` trigger.

---

## 5. Seed waitlist (optional)

```bash
npm run db:seed
```

Requires `SUPABASE_SERVICE_ROLE_KEY`. Inserts demo waitlist rows for Mission Control.

---

## 6. Verify locally

```bash
npm run dev
```

| Step | URL | Expected |
|------|-----|----------|
| Member login | `/member/login` | Sign in → `/member/home` |
| Reserve seat | `/member/happenings/seats` | After sign-in, label shows “Live from Supabase”; reserve decrements seats |
| Founder login | `/founder/login` | Sign in as founder → `/founder/dashboard` |
| Admin / mod login | `/admin/login` | Sign in as admin or moderator → `/admin/dashboard` |
| Curator login | `/admin/login` | Same page as admin/mod → `/curator/dashboard` |
| Cohort | `/founder/dashboard` or `/admin/dashboard` | 14-day table uses real profile/seat/attendance counts when data exists |
| Wrong portal | `/founder/dashboard` as member | Redirect to `/member/home` |

### Test the IRL funnel in SQL

After a member reserves a seat:

```sql
-- Mark verified
update public.profiles set verified = true where email = 'member@test.com';

-- Join club (or POST /api/irl/join-club from the app)
insert into public.club_memberships (user_id, club_slug)
select id, 'morning-run-club' from public.profiles where email = 'member@test.com'
on conflict do nothing;

-- Check in (attended) — or POST /api/irl/check-in with gathering slug
insert into public.gathering_attendance (gathering_id, user_id)
select g.id, p.id
from public.gatherings g, public.profiles p
where g.slug = 'sant-ambroeus-soho' and p.email = 'member@test.com'
on conflict do nothing;
```

Refresh **Mission Control → Overview** — cohort row for “This week” should move **Attended** up.

### One-tap dev funnel

On **Profile** (when `NEXT_PUBLIC_DEV_AUTH_HINTS=1` or in development), tap **Complete IRL funnel** — or:

```bash
curl -X POST http://localhost:3000/api/irl/complete-funnel \
  -H "Cookie: YOUR_SESSION_COOKIE"
```

(While signed in as a member in the browser.)

---

## 7. Production

1. Same migrations on the **production** Supabase project (or one project for both).
2. Add production URLs to Auth redirects.
3. Deploy Next app with the same env vars (service role only on server — never expose in client bundles; Next already keeps `SUPABASE_SERVICE_ROLE_KEY` server-only).
4. Turn off dev shortcuts: do not set `NEXT_PUBLIC_DEV_AUTH_HINTS` in prod; `devRoleFromEmail` only applies when `profiles.role` is missing — always set roles in DB for real users.

---

## API reference (IRL MVP)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/irl/gatherings` | Member session | List open seats |
| POST | `/api/irl/reserve` | Member | `{ "gatheringId" }` or `{ "slug" }` |
| POST | `/api/irl/check-in` | Member | Mark attended IRL |
| POST | `/api/irl/join-club` | Member | `{ "clubSlug": "morning-run-club" }` |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Dashboard “Cannot read waitlist” | Run migrations; add `SUPABASE_SERVICE_ROLE_KEY`; restart dev server |
| Seats stay on demo | Sign in at `/member/login`; run `003_irl_core.sql` |
| Cohort still shows old demo numbers | No profiles in DB yet — create users; funnel uses `profiles.created_at` |
| Founder can’t see all profiles | Run `004_founder_profiles_rls.sql`; founder `profiles.role` must be `founder` or `admin` |

More on portals: [AUTH.md](./AUTH.md).
