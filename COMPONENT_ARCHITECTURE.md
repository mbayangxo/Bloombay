# BloomBay Component Architecture

> React 19 · Next.js App Router · Server + Client Components · CSS modules / global CSS in `app/styles/`

---

## Layering model

```
app/(portal)/layout.tsx          ← portal shell (header, sidebar, fonts, CSS imports)
  └── page.tsx                   ← route entry (often thin wrapper)
        └── app/components/...   ← feature UI
              └── lib/...        ← data hooks, types, API clients
```

---

## Portal shells

| Portal | Layout file | Shell component | Nav pattern |
|--------|-------------|-----------------|-------------|
| Member | `app/(member-portal)/layout.tsx` | `MemberPortalShell`, `MemberPortalHeader` | Desktop: icon sidebar · Mobile: hamburger |
| Club owner | `app/club-owner/(authenticated)/layout.tsx` | `club-owner-shell.tsx` | Sidebar + dashboard chrome |
| Founder | `app/founder/(portal)/layout.tsx` | Admin MC shell | Left nav Mission Control |
| Admin | `app/admin/(ops)/layout.tsx` | Ops shell | Admin nav |
| Partner | `app/partner/layout.tsx` | Partner shell | Partner nav |
| GirlMate | `app/girlmate/layout.tsx` | GirlMate chrome | Bottom / top nav |

Member layout imports shared tokens: `bb-scrapbook-tokens.css`, `bb-member-portal-shell.css`, feature CSS per page (home, clubs, happenings, eats).

---

## `app/components/portal/` — member pages

High-level page components wired from `(member-portal)/member/*/page.tsx`:

| Component | Route | Notes |
|-----------|-------|-------|
| `home-page.tsx` | `/member/home` | CSS scrapbook board |
| `clubs-page.tsx` | `/member/clubs` | Clubs discovery |
| City / happenings / plans | `/member/city`, `/member/happenings`, `/member/plans` | Subfolders `portal/city/`, `portal/happenings/`, `portal/plans/` |
| `member-portal-header.tsx` | All member pages | Sticky header + utility icons |
| `member-portal-shell.tsx` | All member pages | Sidebar + main column |
| `portal-utility-icons.tsx` | Header | Pin drops, mailbox, chat, apartment |

**Pattern:** Page files are often async Server Components that call `getAuthUser()` and pass props to client boards.

---

## `app/components/member/` — member widgets

Reusable member UI not tied to a single route:

- `home-css-board.tsx`, `clubs-css-board.tsx` — CSS-only scrapbook layouts
- `home-scrapbook-collage.tsx` — legacy PNG collage (being replaced)
- Calendar, dossier, safety, guidance provider
- `member-guidance-provider.tsx` — onboarding tooltips / coach marks

---

## `app/components/admin/` — founder & ops

- `admin/portal/yande-mission-center.tsx` — Yande ops UI
- KPI panels, verification queue, bloom requests panel
- Used by `/founder/*` and `/admin/*` routes

---

## `app/components/club/` — shared club UI

- Club sidebar, desktop panels
- Used by member club interior and club-owner portal

---

## `app/club-owner/(authenticated)/components/`

Club Mama–specific panels co-located with routes:

- `applications-panel.tsx`, `members-panel.tsx`, `onboarding-checklist.tsx`
- `club-owner-page.tsx` — page wrapper pattern

---

## Client vs server

| Use Server Component | Use Client Component (`"use client"`) |
|---------------------|--------------------------------------|
| `getAuthUser()`, initial data fetch | Interactivity, hooks, browser APIs |
| Static SEO metadata | `useState`, `usePathname`, forms |
| Pass serializable props to children | Supabase realtime (rare) |

**Data fetching on client:** `useEffect` + `fetch('/api/member/...')` or custom hooks in `app/hooks/` (e.g. `use-home-mockup-data.ts`, `use-live-happenings.ts`).

---

## Styling conventions

| Pattern | Location |
|---------|----------|
| Design tokens | `app/styles/bb-scrapbook-tokens.css`, `globals-core.css` |
| Portal bundle | `member-portal.css`, `bb-member-nav.css` |
| Feature CSS | `bb-home-css.css`, `bb-clubs-collage.css`, `bb-happenings-collage.css` |
| BEM-like prefixes | `bb-home-css__`, `bb-member-header__`, `mp-sidebar__` |

Mobile-first; desktop breakpoint often **1024px** for sidebar vs hamburger.

---

## Shared primitives

| Location | Contents |
|----------|----------|
| `app/components/shared/` | Buttons, cards, layout helpers |
| `app/components/portal/bb-logo.tsx` | BloomBay mark |
| `app/components/portal/member-nav-icons.tsx` | SVG nav icons |
| `app/member/components/nav-icons.tsx` | Sidebar icon set |
| `app/components/poster-templates/` | Happening poster frames |

---

## Parallel sandbox: `_cursor-member`

`app/_cursor-member/member/*` mirrors member routes with alternate components. **Do not wire to production nav.** Use for experiments; merge winners into `(member-portal)`.

---

## Component checklist (new feature)

1. Add route under correct `(portal)` group
2. Create page component in `app/components/portal/{feature}/` or `member/`
3. Import styles in portal layout or page
4. Fetch via Server Component or `/api/member/*`
5. Log behavior signals if Yande-relevant
6. Match existing BEM / token naming

See `BLOOMBAY_CODEBASE_MAP.md` for route index.
