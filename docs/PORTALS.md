# BloomBay portals

Five login URLs — founder is separate; admin and curator share one.

| Portal | Login | Role(s) | App after sign-in |
|--------|-------|---------|-------------------|
| Member | `/member/login` | member | `/member/*` |
| Clubhouse | `/club-owner/login` | club_owner | `/club-owner/*` |
| Partner | `/partner/login` | partner | `/partner/*` |
| **Founder** | `/founder/login` | founder only | `/founder/*` |
| **Operations** | `/admin/login` | admin, moderator, **curator** | `/admin/*` or `/curator/*` |

`/curator/login` redirects to `/admin/login`.

## Founder vs operations login

| | Founder | Operations (`/admin/login`) |
|---|---------|----------------------------|
| Who | Owning team | Admins, moderators, curators |
| Login | `/founder/login` only | `/admin/login` only |
| Apps | Full Mission Control | Admin/mods → MC ops; curators → curator portal |

Curators are not founders and do not use `/founder/login`. They use the same sign-in page as admins, then land on `/curator/dashboard`.

## Careers

| Surface | Path | Who |
|---------|------|-----|
| Public apply | `/careers` | Anyone — resume link + cover letter |
| Founder review | `/founder/careers` | Founder only (Mission Control → Careers) |

Applications are stored in Supabase `careers_applications` (migration `005_careers_applications.sql`). Without the table, the founder page shows demo seed rows.

## Clubhouse vs Partner

Still separate: hosts vs venues. See login cross-links on each screen.
