# Fake-Data & Dead-Button Cleanup — Master Roadmap

Goal: remove ALL fabricated/mock data shown to real members, and make every
button either work or be removed. Derived from three read-only audits of `main`
+ direct review of the plan room. Each item: **file** · what's fake/dead ·
**fix** (remove / wire-to-real-data / honest-empty-state).

Legend: 🔴 critical (whole screen fake or user-blocking) · 🟠 high · 🟡 medium · ⚪ low

---

## 🔴 CRITICAL

### `app/(member-portal)/member/introductions/page.tsx` — 100% fake route
- `PROFILE_CARDS` (14-18: Hana/Selu/Zara), `CATEGORY_CARDS` (22-28), `COME_WITH_CARDS` (32-66: Sofia K./Aminah M./Temi A.) — all hardcoded, no fetch.
- Dead: card tap → fake "Bloom Request Sent!" toast (73); Refresh (300), See all (433), "That's Bloom-Ship" (213), "Post a Come With" (554), "I'm In" (687), "Tell Me More" (702), bell (104).
- **Fix:** REMOVE the route / redirect to `/member/match` (like `girl-mate` does), or wire to real data.

### `app/components/portal/plan-room-page.tsx` — fake + input blocked
- `CONFIRMED` (25-27: Maya/Teni/Aisha), `VOICE_NOTES` (38-41), `CHAT_MESSAGES` (47-51) — all hardcoded; `send()` only appends locally.
- **Layout bug:** input bar is `position:fixed; bottom:0` (1265-1276) and collides with the app bottom nav → **can't send a message**. Action row + white circle over "plans" also overlap.
- **Fix:** wire chat/attendees to real data or honest empty state; fix the fixed-bar-vs-nav overlap (offset by nav height or hide nav on this route).

### `app/components/portal/club-landing.tsx` — every club shows the same fake people
- Chat tab: `CHAT_MESSAGES` (199-210: Aminah C./Kelechi O./Bea T.) seeded into state (539), rendered (1481); `send()` local-only (548).
- Members tab: `CLUB_MEMBERS` (212-221: 8 fake incl. "Yande O." Club Mama) rendered (1570); header shows `member_limit` as count.
- Hero (non-member): fake avatars `["A","K","F","T","O"]` (1008), `47 active this week` (1016), `14 zone members responded` (1216) + blurred fake previews (1222-1224).
- `DEFAULT_CLUB` fixture (101-185) — fake Museum Girls (testimonials/zones/mama). Live fallback.
- Dead: VIEW ALL EVENTS (1090), RSVP (1499), chat welcome buttons (607-609), member Connect/Report (1637/1647 — Report files nothing), Club Mama Connect (1657), Block/Remove (local-only).
- **Fix:** wire chat + members to real `club_memberships`/messages or empty state; remove hero fake metrics + zone teaser; remove `DEFAULT_CLUB`; wire/remove dead buttons.

### `app/components/portal/lounge-page.tsx` — fake inbox (LoungePage) + fake apartment (ApartmentPage)
- `CONVOS` (1263-1301: Aaliyah M./Sofia K./"Dinner Society" unread 7) rendered as the messages inbox; send button (1382) only clears input.
- ApartmentPage: `ALL_BLOOMIES` (144-151) drives the "Bloomies" stat; `BLOOMIE_UPDATES` (153-166), `WITNESS_ENTRIES` (179-184), hardcoded "SOUNDS LIKE" (966-968).
- **Fix:** wire conversations/messages + bloomies/witness to real data + honest empty states; wire send.

---

## 🟠 HIGH

### `app/components/portal/sidebar.tsx` — fake identity on every desktop page
- Hardcoded `"M"` / `"Maya L."` / `"Brooklyn · NYC"` (119-123) shown as the logged-in user; "FOUNDING MOTHER 1 of 100" unconditional (108-110); dead logout (125-129).
- **Fix:** wire to the real auth user; conditional founding badge; wire logout.

### `app/components/portal/introductions-page.tsx` (/member/match) — fake women mixed into real feed
- Real data IS fetched, but `IN_YOUR_ORBIT` (63-79), `COME_WITH_ME` (81-98), `INTEREST_CLUSTERS` (100-149, fake counts 24/31/18…), `NEW_IN_TOWN` (151-167) render alongside it. `ME="dmbayang"` placeholder (37).
- Intro buttons (830/837/844) only toast — no API (unlike real `sendBloomRequest` 815).
- **Fix:** REMOVE the four mock arrays + sections (real equivalents already wired).

### `app/(member-portal)/member/clubs/[id]/welcome/page.tsx`
- `MOCK_CLUB_NAME = "Museum Girls"` (10) shown to everyone regardless of club joined (122/157/586); `FEATURES` "Welcome Gift" false promise (32-34).
- **Fix:** wire club name by `params.id`; remove/wire Welcome Gift.

### `app/components/portal/clubs-page.tsx`
- Club Spotlight fully hardcoded (509-527: "Museum Girls…The Met", avatars `["A","M","J","L"]`, `+28`); `📍 SoHo, NYC` (581) literal.
- Dead: SEE FULL CALENDAR (435), START YOUR JOURNEY (478), I'M IN (512), all vibes (567).
- **Fix:** wire/remove Spotlight + location; wire/remove dead buttons.

### `app/(member-portal)/member/lounge/bloomies/page.tsx`
- `ALL_BLOOMIES` (9-16) hardcoded friends; header count + per-row "N events" fabricated.
- **Fix:** wire to real data (mirror the clean `bouquet` page) + empty state.

### `app/(member-portal)/member/lounge/memories/page.tsx`
- Activity Trail IS real, but `RECAPS` (66-92), `MISSED_LAST_MONTH` (96-113), `COMING_UP_THIS_MONTH` (117-134), `WITNESS_NOTES` (136-140) are fabricated personal analytics.
- **Fix:** wire or remove until built.

### `app/components/portal/girlmate-page.tsx`
- Mock `LISTINGS` (94-135)/`SEEKERS` (137-170, "94% compatible") render as fallback when API empty (1323-1327); `apiToListing` hardcodes `compatibility:75` (1282); message buttons don't send (636/575).
- **Fix:** honest empty state instead of mock fallback; real compat or remove badge; wire message send.

---

## 🟡 MEDIUM (screens the owner flagged directly)

### `app/(member-portal)/member/chat/page.tsx` — "Book Girls" group
- Fake members (5 women, initials), dead ⋯ menu + photo icon in header, "Plan Together" / "Add Women" wiring to verify.
- **Fix:** wire members to real group data or empty state; wire/remove ⋯ + photo.

### Eats screen (`app/components/portal/city-page.tsx` — `EatsPage`)
- `EATS_PARTNERS` (960-1141): 6 fabricated restaurants (Via Carota, Lucien…) with fake saves/ratings/reviews (invented people + timestamps) — rendered as the **fallback** when `restaurant_partners` is empty (`realPartners.length>0 ? realPartners : EATS_PARTNERS`, 1217). An honest empty state already exists (1286-1291) but is unreachable.
- Dead: filter chips (1241 — `activeFilter` never filters the list), save/heart buttons (1302/1377/1912 — local state only, never persisted).
- Real & fine: Reserve → `/api/reservations` (1430), Bloom Notes (1742).
- **Fix:** drop the `: EATS_PARTNERS` fallback → honest empty state; wire or remove filter + save buttons.

### Trending ticker (`city-page.tsx` — `TrendingPage`)
- `TICKER_ITEMS` (2172: "VILLA PIZZA, DIOR CAFÉ POP-UP…") + `TREND_LIST` (2173, fake save counts 247/188…) — fallback under a "● LIVE" pulse when `city_trending` is empty (2213-2217). (The "Sant Ambroeus · SoHo · Sun Jun 7" ticker the owner saw is the parked `_cursor-member/member/eats/*` route + seed data, not a shipped screen.)
- **Fix:** honest "nothing trending yet" state instead of fabricated LIVE venues.

**The core anti-pattern everywhere:** `realData.length > 0 ? realData : MOCK`. The systematic fix is to drop every `: MOCK` fallback and let the (usually already-written) honest empty state show.

### Happenings page (`app/components/portal/happenings-page.tsx` + detail/confirmation) — owner-flagged
- **"FROM YOUR CITY" cards** (Sunset Walk · SUN 1PM, Natural Wine · TONIGHT, Rooftop Girls · SAT 8PM, with "7/6/12 going") are **hardcoded and non-functional** → wire to real events or honest empty state.
- **Introductions card is misplaced** — it renders at the bottom of the Happenings feed; it shouldn't be there. Remove it from the Happenings feed (Introductions is its own surface).
- **Nav overlap** — the BB logo overlaps the "Happenings" tab label (Happenings · Intros · Map), and the fake `TICKER_ITEMS` band sits under it. Fix the logo/tab overlap; drop the fake ticker.
- **Create/new grid (page 4):** the "NEW" placeholder card is redundant next to the "+" add card — remove the "NEW" card, keep the "+" as the add action. "Morocco October / Ladies First / Oct 2026" cards are hardcoded → wire/empty.
- **Confirmation screen (`happening-rsvp-confirmation.tsx` / `event-detail.tsx`):**
  - **"YOUR CONFIRMATION" is doubled** — there are two confirmation blocks; remove the upper duplicate.
  - The confirmation card is **too wide/long horizontally** — split it / constrain max-width so it's not a single long band.
  - Fake data on it: "8 women", attendee initials "A Z T J S +3", "CHEMISTRY 94% Great energy" → wire to real RSVP/attendee data or remove the chemistry metric.

---

## ⚪ LOW (unreachable now, but fix before launch)

### `app/components/portal/book-page.tsx`
- Main list is clean (empty arrays + honest empty state). But `DetailView` (reachable once a listing exists) has fake "saved by friends" `["J","M","T"]`+`+12` (153/326), hardcoded date (409), `BEAUTY STUDIO`/`BOOKED` (218/265). Dead: BOOK NOW (414), "List in The Book" submit (1053 — collects input, saves nothing).
- **Fix:** wire/remove before any listing goes live.

### `app/(member-portal)/member/clubs/[id]/page.tsx`
- Not fake but misleading: `memberCount: member_limit` (97), `city:"New York"` hardcoded (96).

---

## Layout & UX refinements (owner review — not fake data)

- **Wallet** (`app/(member-portal)/member/plans/page.tsx`) — too wide; make it smaller / less long horizontally.
- **Memories** (`plans/page.tsx` / `lounge-page.tsx`) — currently fully expanded ("all out"); should be **collapsed**, press to open and view all.
- **Club rankings** (`app/components/portal/clubs-page.tsx`) — don't render it inline down the page; make it a **top icon** users tap to navigate to the rankings screen.
- **"Start your own club"** (`clubs-page.tsx`) — remove the section; the **"+" button alone is enough**.
- **The Avenue** (`app/components/portal/avenue-page.tsx`) — too long; condense so members don't have to scroll far to see everything.
- **Dark night theme (cross-cutting)** — dark-purple/dark-on-dark makes content unreadable; must be legible + pretty on every page (see owner's home-screen note).
- **Waitlist** (`waitlist-flow.tsx`) — remove fabricated numbers (`WAITLIST_GOAL`/counts/ProgressBar).

## Prioritized order
1. Plan room (input-blocked = users literally can't message) + its fake data
2. `club-landing` chat + members tabs (fake people on every club)
3. `member/introductions` (whole route fake) — remove/redirect
4. `lounge-page` inbox + apartment fakes
5. `introductions-page` mock arrays; `sidebar` identity
6. `welcome` MOCK_CLUB_NAME; `clubs-page` Spotlight
7. bloomies / memories / girlmate
8. Book Girls group; eats ticker
9. book-page DetailView; misleading memberCount/city
10. Cross-cutting dead-button sweep

## Suggested split (avoid colliding with Cursor's Member Truth work)
- **Claude:** plan room, Book Girls group (`chat/page.tsx`), eats ticker — owner-flagged, low collision.
- **Cursor:** lounge / introductions / sidebar / girlmate / club-landing — already mid-Member-Truth there.
- Coordinate on `clubs-page` / `welcome` / `book-page`.
