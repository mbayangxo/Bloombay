# Backend priorities — status

Last pass wires prototype UI to Supabase truth APIs where Phase 1 allows.

## Done (this pass)

| Area | API / store | UI |
|------|-------------|-----|
| Theme | `POST/GET /api/member/preferences` | Settings → Appearance, `DayNightTheme` |
| Girlmates | `GET/POST /api/member/community-posts` | `girl-mate-store` + board refresh |
| Bloom requests | `GET /api/member/bloom-requests` | Connect list + `?id=` detail |
| Gatherings sync | `POST /api/member/gatherings` + `GET` feed | `saveEvent` → publish, `useLiveHappenings` |
| Contact | `POST /api/member/safety-reports` | Settings → Contact form |
| Chemistry % | — | Replaced with curated table / RSVP trust copy |
| Night palette | migration 007 `theme_preference` | `bb-member-night.css` + manual override |

## Migrations

Run `000`–`007` in order ([SETUP.md](./SETUP.md)). **007** = community posts, theme preference, safety reports.

## Still roadmap (not blocking demo)

- **Stripe** — deposits / tickets at RSVP
- **Verification phases** — ID + witness tables beyond stub row
- **Yande** — aggregate `yande_memory` + behavior signals (no fake scores)
- **Full auth-gated reads** — some feeds still seed when unsigned in

## Env

Copy [.env.example](../.env.example) → `.env.local`. Keep `NEXT_PUBLIC_BLOOMBAY_TRUTHFUL=1` for production-shaped writes.
