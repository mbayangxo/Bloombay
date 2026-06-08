# BloomBay auth & portals

**First-time Supabase + IRL setup:** see [SETUP.md](./SETUP.md).

## Login URLs

| Portal | Login | Home after sign-in |
|--------|-------|-------------------|
| Member | `/member/login` | `/member/home` |
| Founder | `/founder/login` | `/founder/dashboard` |
| Operations (admin, moderator, curator) | `/admin/login` | `/admin/dashboard` or `/curator/dashboard` |
| Club owner | `/club-owner/login` | `/club-owner/dashboard` |

Legacy URLs `/club-mama`, `/clubmama`, and `/clubowner` redirect to `/club-owner`.
| Partner | `/partner/login` | `/partner` |

All use the same Supabase session (`BloomBayLogin`). Middleware enforces role access per portal prefix. **Founder login is separate; admin, moderator, and curator share `/admin/login`.**

## Supabase setup

1. Run `supabase/apply-all.sql` in the SQL editor (waitlist + `profiles` + `user_role` enum).
2. In Supabase Auth → URL configuration, add redirect URLs for localhost and production, including `/auth/callback`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.

New users get a `profiles` row from `handle_new_user()`. Set role in SQL or pass `role` in sign-up metadata (founder tooling only).

## Roles (`profiles.role`)

`member` · `founder` · `admin` · `club_owner` · `partner` · `moderator` · `curator`

## Separate portals (isolated)

Each role signs in **only** at its own URL. Logins do not list every portal.

| Portal | Login only | App routes |
|--------|------------|------------|
| Member | `/member/login` | `/member/*` |
| Founder | `/founder/login` | `/founder/*` |
| Admin / moderator / curator | `/admin/login` | `/admin/*` or `/curator/*` |
| Clubhouse | `/club-owner/login` | `/club-owner/*` |
| Partner | `/partner/login` | `/partner/*` |

- **Member** → `member` only on `/member/*`
- **Founder** → `founder` only on `/founder/*` (full Mission Control)
- **Admin / moderator** → `/admin/*` only (ops subset; moderators never use Clubhouse)
- **Curator** → signs in at `/admin/login`, then `/curator/*` only (assigned from `/founder/team`)
- **Club owner** → `club_owner` only on `/club-owner/*`
- **Partner** → `partner` only on `/partner/*`

Wrong portal → redirect to **your** login with an error. Sign-in rejects accounts that do not match that portal.

Homepage (`/`) is waitlist + member sign-in only — not a universal login.

## Founder vs admin

See [PORTALS.md](./PORTALS.md). Same tool family, **different logins and URL prefixes**. Founder-only areas: curators & pay, Yande, markets, neighborhoods.

## Local development without DB roles

- Test emails: `member@`, `founder@`, `admin@`, `host@`, `partner@`, `curator@`, `moderator@` `@bloombay.app` (see `devRoleFromEmail` in `lib/auth/roles.ts`).
- Optional: set cookie `bb_dev_role=founder` (development only) or enable dev role dropdown on login when `NEXT_PUBLIC_DEV_AUTH_HINTS=1`.

## Production

Same paths on your live domain. No localhost-only routing — only dev helpers are gated by `NODE_ENV`.
