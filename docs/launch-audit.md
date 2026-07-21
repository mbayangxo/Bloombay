# BloomBay — Launch-Readiness Audit (every button + all data)

Full-app, code-level audit of `main`. Method: 10+ parallel read-only reviewers covering every
member screen, the ops portals, and the messaging layer. Each area verified against real
routes/APIs/migrations. Counts below are conservative.

## The one-line truth
**The commerce/transactional spine is real. Almost everything else — the social feeds, chats,
plan rooms, tickets, profile editor, and the entire club-owner portal — is a prototype: hardcoded
data, `real ? real : MOCK` fallbacks, `localStorage`-only writes, or buttons with no handler.**

Rough scale: **~200 dead/no-persist buttons** and **~120 fake-data surfaces** across the app.

---

## 🔴 CRITICAL — must fix before anyone touches it

**Legal / real-world harm**
- `app/press/page.tsx` — fabricated press coverage from **The New York Times / Refinery29 / Fast Company / Essence** with invented headlines. Legal risk. → remove.
- `working-page.tsx` — fabricated **jobs at real companies** ("UX Research Lead — Figma $145K") + fake paid events. Members could act on them. → remove/empty-state.

**Safety features that LIE (worst for a women's-safety product)**
- `profile-page.tsx:2706` — **"Submit Report" shows "Report received" but stores/sends nothing.**
- `profile-page.tsx:2737` — **"Block" does nothing** (local state only, gone on reload).
- `happenings-page.tsx`, `member/chat` — report/block affordances that don't persist.
- `profile-page.tsx:2659` — **"Contact Us" shows "Message sent, we'll reply in 24h" — sends nothing.**
- `profile-page.tsx:2793` — **"Delete Forever" has no handler** — account/data never deleted despite the "permanently deletes your profile" copy (a legal/GDPR problem).

**Money / tickets look real but aren't**
- `member/plans/tickets` ("My Wallet"), `plans/[id]/ticket`, `plans/[id]/room` — **entirely hardcoded**: fake tickets, fake QR codes, "TABLE 07 / $170 Paid in full / 94% match", "Founding Mother #47". Ignore the `[id]`.
- Plan invite / "Send to N Bloomies" / "Post to club" / "Confirm order" — all show success but **send/persist nothing**.

---

## 💬 Messaging, voice & group chats (your direct question)
**Real & working:** Founding-Mothers chat (realtime), Bloomies-planner chat, Girl-Mate DMs, mailbox reads.
**Fake (persist nothing):** all Lounge group/DM demo threads + "New Chat" create, plan-room chat, `plans/[id]/room` (input not even bound), Book Girls group.
**Voice messages: not implemented anywhere in chat** — every waveform/duration is hardcoded, play buttons toggle a visual only, no audio, no `audio_url` column. (Real recording exists for profile voice-bios/event media — a build, not a wire.)
**DM infra exists** (`conversations`/`direct_messages`, mig 028) but only real convos work; demos + create bypass it.

---

## Fake data / dead buttons by area

- **Profile** (`profile-page.tsx`) — ~40 dead controls (Delete, Save Extras, notification toggles, block, color/font pickers all localStorage/local-only) + **60+ hardcoded placeholder profile fields** across 16 templates ("Jan 2026" member-since, "NEW YORK CITY", invented bios). Bloom Link points to a `/u/[username]` route that doesn't exist.
- **Plans / wallet / plan rooms** — ~11 dead + ~25 fake datasets (two fully-mock plan rooms, mock wallet/tickets, `PLAN_ROOMS` real?→mock fallback, todos/notes keyed to numeric mock ids so real UUID plans show empty).
- **Happenings / city** — ~40 dead + ~22 fake (hardcoded "FROM YOUR CITY" cards, fake **LIVE MAP** pins, EATS_PARTNERS + TREND_LIST mock fallbacks, GIRL_GEMS/FAVS/BLOOM_PICKS, room Wall SEED_POSTS + GirlBar fake live rooms). RSVP/confetti/save-hearts persist nothing.
- **Lounge / apartment** — earned flowers, interest tags, member number (name-hash), referral "GIRL CODE", Bloom-Link QR (404s) all fake; template/bg-photo saves localStorage-only.
- **Member social** — `zone-interior.tsx` 100% mock (any zone URL shows the same fake "Museum Girls"); `yande-picks` fake clubs; club `apply` "Submit Application" discards; club-rankings / come-with-me / find-a-room routes 404; filter/vibe chips don't filter.
- **Avenue** — magazine/column/reading/screening/vanity/health all `MOCK_*` fallbacks + fake live counts + Save/Post that silently discard; closet 100% mock; working un-wired. ✅ **Wall is clean.**
- **Landing / onboarding / login** — fake testimonials, member cards, "Tonight" events, waitlist counts, club counts, login "100 Founding Mothers" social proof.
- **Book** — DetailView latent fakes + dead "List in The Book" / "BOOK NOW".
- **Club-owner portal (entire portal)** — **~48 dead controls, 24 fake data surfaces.** It ignores the real `/api/club-portal/*` APIs and reads/writes **`localStorage` demo stores** seeded with mock data. **Approving an applicant, adding members, sending pings, saving gatherings all persist to localStorage only — never to the DB, so members never see them.** "Connect Stripe" is a fake flag. (Good: no blank nav pages — all 8 routes are real; `comms`, `branding`, past-gatherings DO hit real APIs.)
- **Founder portal** — the **queue/write actions are real** (submissions, careers, safety, message-templates, portal-invites, marketing, QA all hit real APIs). BUT **~27 analytics/decision surfaces are fabricated** — the Overview KPIs, Cities "Bloom Score", Clubs, Reports, Yande, Neighborhoods, People, Bloom-requests all render **static demo constants as live numbers.** ⚠️ The **"Launch control" panel shows a fake verdict** ("NYC 8,750 women / 87 score / ready") — *you cannot trust your own founder dashboard to make a launch decision.* Also localStorage-only: photo-verification approve, inbox send, team payouts, Girls-Working job publish, events "push live", club command center, magazine publish. PartnersPipeline Approve/Decline/Contact are dead no-ops. No blank nav.
- **Admin ops portal** — cleaner: the real actions (submissions approve/reject) work; **19 analytics widgets are dead code** (zero importers); the only reachable fake leak is the verification-queue hero stats. No blank nav (missing pages are capability-gated out).
- **Curator portal** — dashboard/gatherings/women all render hardcoded `CURATOR_*` demo data (a real `/api/curator/overview` exists but is never called); fake identity "Amanda R."; primary nav OK but the right-panel links to 5 nonexistent routes.
- **Partner portal** — worst nav hygiene: **the "Dashboard" nav item lands on the public marketing page**, two disconnected partner UIs, and **~9 blank-page nav destinations** (/partner/events, /women, /analytics, /promotions, /payouts, /settings, /help, /requests, /member/partners/[slug]). Confirm/Decline booking buttons are dead; revenue/bookings/reviews/messages/perks all hardcoded; brand + drops save to localStorage only (real `/api/partner-portal/my-venue` exists but the dashboard is only reachable by typing the URL).

---

## ✅ Genuinely launch-ready (don't touch)
Auth · waitlist · careers · **legal consent** · Stripe payments (membership/tickets/clubs) · **The Hanger** end-to-end · **restaurant reservations** · **Wall** (Avenue) · **Founding-Mothers realtime chat** · **Bloomies-planner chat** · **Girl-Mate DMs** · **pin drops** · member **profile save/socials/avatar/moments** (the *core* save works; the "Extras"/customize sheets don't) · club **join / apply / leave** (member side) · **bloom requests / intros / flowers** · member **plans confirmations** · the P0 security + consent fixes.

---

## Verdict & recommendation
**Not launch-ready as the full social app it presents itself as.** The spine (money, auth, clubs-join, RSVP, wall, hanger, reservations, founding chat, profile-core) is solid and safe. But the surface a founding mother would tap through — profile customization, plan rooms, tickets/wallet, messaging, the Avenue feeds, the club-owner tools — is largely non-functional or fabricated, and several **safety/legal** items actively deceive (report/block/delete/press/jobs).

**Fastest safe path — an honest founding-mothers pilot:**
1. **Fix the CRITICALs now** (non-negotiable): remove fake press + fake jobs; make Report/Block/Delete/Contact either real or removed; take down fake tickets/wallet.
2. **Hide/disable the un-backed features** for the pilot (plan rooms, group chat, voice, Avenue editorial feeds, wallet, the club-owner demo tools) rather than shipping fake versions.
3. **Launch with only the real flows:** join a club, RSVP a happening, the Wall, Founding-Mothers chat, Hanger, reservations, real profile, Girl-Mate.
4. Then build the rest for real, screen by screen, against this doc.

Everything above is enumerated per-file in the reviewer outputs; this doc is the actionable synthesis.
