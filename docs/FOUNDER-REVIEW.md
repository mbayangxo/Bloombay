# BloomBay — Founder Review Document

**Prepared:** June 2026
**For:** Founding team review and approval
**Source documents:** DESIGN-BIBLE.md + BEHAVIOR-BIBLE.md
**Prepared by:** Engineering + design audit

> This document does not change any code. It identifies what has been locked in, what requires your decision, where assumptions were made, and where the current documentation may conflict with BloomBay's stated philosophy.
>
> Every item marked **NEEDS DECISION** requires a founder answer before that part of the product is built or shipped.

---

## Part 1: Decisions That Are Finalized

These are decisions already implemented in the codebase. Reversing any of them requires code changes.

### Design

| Decision | What was done | Where it lives |
|---|---|---|
| Hot pink is `#FF0055` | Changed from `#E8007A`. More saturated, less magenta. | `bloom-brand.css` |
| Velvet black is `#1A0514` | Changed from `#1A0A2E`. Warmer, wine-toned rather than indigo. | `bloom-brand.css` |
| Display font: Barlow Condensed | Replaces Unbounded. Compressed, newspaper-like, tall. Loads via Google Fonts. | `layout.tsx` |
| Accent font: Cormorant Garamond | New addition. Italic serif for emotional phrases. Loads via Google Fonts. | `layout.tsx` |
| UI font: DM Sans | Unchanged. All navigation, forms, labels, metadata. | `layout.tsx` |
| 4px spacing scale | Token system: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px. | `bloom-brand.css` |
| Single easing function | `cubic-bezier(0.22, 1, 0.36, 1)` for all transitions site-wide. | `bloom-brand.css` |
| Three motion durations | 150ms (fast), 300ms (smooth), 600ms (luxe). No values between. | `bloom-brand.css` |
| Four shadow levels | soft, card, float, pink. Each maps to a specific use case. | `bloom-brand.css` |
| Sidebar hidden on mobile | At < 768px, the left sidebar disappears. Bottom nav appears instead. | `member-layout.css` |
| Bottom nav: 5 tabs | Home, Explore, Clubs, Happenings, The Room. Mobile only. | `bottom-nav.tsx` |
| Artifact CSS system | Ticket, envelope, wax seal, request note, polaroid, wall note, club poster. All built. | `bb-artifacts.css` |
| Wax seal uses dark rose gradient | `#c9527a → #8b1a3a`. Not the brand hot pink. | `bb-artifacts.css` |

### Flow

| Decision | What was done | Where it lives |
|---|---|---|
| Onboarding redirects to `/member/home` | Removed redirect to `/member/pending-approval`. Members get immediate access. Verification is async in founder portal. | `onboarding/page.tsx` |
| Pending approval is not a dead end | Added "Enter BloomBay →" button to `/member/home`. | `pending-approval/page.tsx` |
| RSVP writes to Supabase | RSVP button now calls `/api/irl/reserve` before local store. Falls back gracefully if API unavailable. | `live-gathering-detail.tsx` |
| Club join writes to Supabase | Join button now calls `/api/irl/join-club` before local store. | `club-apply.tsx` |

### Behavior Architecture

| Decision | What was done |
|---|---|
| Bouquet maximum: 12 women | Hardcoded in `yande-member-state.ts` as `bouquetMax: 12`. |
| IRL funnel is the north star metric | Tracked in founder dashboard as "Cohort-14" — members who complete the funnel within 14 days. |
| Curator payout model | Curator portal has payout section. The mechanism exists but amounts are demo data. |
| Safety reports go to founding team | Documented in bibles and enforced architecturally (no public report feed). |

---

## Part 2: Decisions That Need Founder Approval

These items are documented in the bibles but have not been confirmed by the founding team. Nothing will be built against them until they are approved or revised.

---

### 2A — Design Decisions

**D1. Hot pink and velvet black: final confirmation needed**

The colors were changed based on design judgment without being reviewed on real screens by the founding team. Both changes affect every surface in the product.

- Old hot pink: `#E8007A` (magenta-leaning)
- New hot pink: `#FF0055` (red-leaning)
- Old velvet: `#1A0A2E` (indigo-tinted)
- New velvet: `#1A0514` (wine-tinted)

**→ Do you approve these exact hex values as the final palette?**

---

**D2. Display font: Barlow Condensed**

Barlow Condensed was chosen because it reads like editorial sports posters and city newspapers — compressed, athletic, confident. The alternatives considered but not used:

- **Anton** — more aggressive, heavier at all weights
- **Bebas Neue** — thinner, more geometric, less textural
- **Playfair Display (condensed)** — more feminine, serif-based
- **Custom typeface** — maximum brand control, significant cost

The current font is free via Google Fonts and loads instantly. It is live in the codebase now.

**→ Have you seen Barlow Condensed on the actual screens? Do you approve it?**

---

**D3. Mobile bottom nav: 5 tabs vs. 7 sidebar items**

The sidebar has 7 items: Home, Explore, Clubs, Happenings, Connect, Lounge, The Room.

The mobile bottom nav has 5: Home, Explore, Clubs, Happenings, The Room.

**Connect** and **Lounge** are only accessible on mobile by navigating through other sections or using internal links. This creates a two-tier mobile experience where two meaningful sections have no direct home on the primary navigation.

Options:
1. Keep 5 tabs (cleaner, but Connect and Lounge are buried)
2. Use 6 or 7 tabs (crowded on small screens, but complete)
3. Move Connect into the Connect tab on bottom nav instead of Explore
4. Make Lounge accessible from the member avatar/profile icon in the header

**→ Which 5 items belong in the mobile bottom nav? Or is 7 acceptable?**

---

**D4. "Admit One, Her" language**

All event tickets and happenings pages currently use:
- `ADMIT ONE · HER` for standard events
- `ADMIT ONE · ALL MEMBERS` for Blueday events
- `BLOOMBAY HQ` for brand events

This language appears on ticket headers, envelope flaps, and event detail pages. It is the only gendered language on the product surface.

**→ Is "Admit One, Her" the copy you want? Or is there a different convention?**

---

**D5. SVG objects need redesign — budget and timeline needed**

Eight of the twelve BloomBay object SVGs are auto-traced bitmap files. They render as flat black silhouettes, do not scale cleanly, and cannot be colored via CSS. Specifically:

- `bloom-ticket.svg` — used in happenings navigation
- `bloom-request.svg` — used in Bloom Request UI
- `bloom-bouquet.svg` — used in crest and decorative contexts
- `bloom-door.svg` — used in The Room entrance
- `bloom-key.svg` — used in founder portal login
- `bloom-pin.svg` — used in maps
- `bloom-postcard.svg` — used in books/library crest
- `bloom-table.svg` — used in dinner/venue crest

These need clean hand-drawn SVGs. This is a design commission, not an engineering task.

**→ Who is commissioning these? What is the timeline and budget?**

---

**D6. Compatibility score threshold: 70% minimum**

The Bloom Request system shows a compatibility percentage. The bible states that BloomBay never surfaces a Bloom Request below 70% compatibility.

This threshold is currently non-functional (there is no AI system computing it). It is displayed with demo data.

**→ Is 70% the right floor? Is this confirmed as policy?**

---

### 2B — Behavior Decisions

**B1. Deposit pricing range**

The Behavior Bible states gathering deposits range from `$10–$95`. This is the first time a pricing number appears in any documentation.

No pricing model has been confirmed: by event type, by city, by club tier, or anything else.

**→ What is the deposit structure? Who sets the deposit amount — BloomBay, the club host, or both?**

---

**B2. Deposit increase for low attendance**

The Behavior Bible states: members with attendance score below 50% face a deposit increase for future seat reservations.

This is a financial penalty tied to invisible behavioral scoring. It has not been implemented and needs explicit founder sign-off.

**→ Do you want a deposit increase mechanism? If yes, what is the increase — fixed amount, multiplier, or percentage?**

---

**B3. No-show penalty: exact thresholds**

The Behavior Bible specifies:
- 1st no-show: note in attendance score
- 2nd within 30 days: Yande stops suggesting seats
- 3rd within 60 days: seat reservation suspended for 30 days

These thresholds were written by the engineering/design team — not set by the founder. They could be too strict (a woman who got sick twice), too lenient, or simply wrong for the product's tone.

**→ Are these the right thresholds? Who has authority to override a suspension?**

---

**B4. Club maximum: 7 per member**

The World Bible states a woman can belong to "up to seven clubs." This number does not appear in the code and was written by the documentation author. There is no current technical limit.

**→ Is there a club maximum per member? If yes, what is the number and the reason?**

---

**B5. Zone expansion requirements**

The Behavior Bible states Zone expansion requires:
- 200+ members in primary location
- A named Zone Lead
- Curator approval

These thresholds are invented. No founder input shaped these numbers.

**→ What are the actual Zone expansion criteria you want to use at launch?**

---

**B6. Zone Leads are unpaid**

The Behavior Bible states Zone Leads receive: elevated community score, Zone Lead crest, and first access to new gathering slots. No monetary compensation.

This is a significant policy decision. Zone Leads anchor BloomBay's expansion into new neighborhoods — a high-leverage, time-intensive role being compensated entirely with social capital.

**→ Are Zone Leads unpaid by design? Or should this be revisited?**

---

**B7. Curator budget: $50/month**

The Behavior Bible states curators receive a `$50/month city-specific community budget` for welcome gifts and neighborhood notes.

This number was made up. No financial model, payment mechanism, or budget source exists behind it.

**→ Is there a curator budget? What is it? Where does it come from?**

---

**B8. Friendship threshold: 3 positive interactions**

The Behavior Bible states Yande considers a friendship established after "three positive interactions" (gatherings, Planner events, or Room exchanges).

This is an invented threshold with no data behind it. The number that actually works for BloomBay will come from observing real user behavior.

**→ Is the 3-interaction model directionally correct? Should it be higher (more intentional) or lower (lower barrier)?**

---

**B9. "Blueday" naming**

The word "Blueday" appears in the codebase (`kind === "blueday"`) for all-member events. It is used in the Behavior Bible but was never named or branded by the founding team. It is a code identifier that leaked into product language.

**→ Is "Blueday" the name you want for all-member quarterly gatherings? Or does this need a different name?**

---

**B10. Cohort-14 naming**

"Cohort-14" is the name used in the founder dashboard for members who complete the IRL funnel within 14 days. This name was assigned by the engineering team.

**→ Is "Cohort-14" the right internal name? Or does the founding team use different language for this metric?**

---

**B11. Day 30 re-engagement email**

The Behavior Bible describes a single email sent at Day 30 to members who have not attended a gathering: *"Still in? We're saving a seat."*

No email provider is configured in the codebase. This feature does not exist. It requires Sendgrid, Mailgun, or Postmark setup, email templates, and legal compliance (unsubscribe, etc.).

**→ Is email the right re-engagement channel? Is this a priority for launch?**

---

## Part 3: Assumptions Made

These are places where a decision was needed to write or build something, and the engineering/design team made a judgment call. Some of these are consequential.

---

**A1. Fonts were chosen without a visual review session**

All three fonts were chosen based on design research and reference image analysis. The founding team has not seen them applied to actual BloomBay screens in a live environment. Font choices have significant brand impact.

**What was assumed:** Barlow Condensed is editorially right for BloomBay's poster/nightlife aesthetic. Cormorant Garamond is emotionally right for intimate moments.

---

**A2. The bottom nav serves 5 sections, not all 7**

On mobile, Connect and Lounge were removed from primary navigation to keep the bottom nav clean. The assumption is that these sections are secondary enough to require one extra tap.

**What was assumed:** Home, Explore, Clubs, Happenings, and The Room are the five most important sections for a mobile user. Connect and Lounge matter but not enough to occupy a fixed nav slot.

---

**A3. Yande is described as having a full AI system**

The Behavior Bible describes Yande as a sophisticated concierge who computes chemistry scores, routes invitations by interest alignment, mixes introverts and extroverts at tables, and tracks friendship formation across three interaction types.

None of this AI system exists. The current Yande implementation is a simple rule-based nudge system with hardcoded priority logic (`lib/yande-recommendations.ts`). It does not compute anything — it just checks conditions and returns pre-written strings.

**What was assumed:** The Behavior Bible describes where BloomBay is going, not where it is. The current implementation is a placeholder.

---

**A4. Chemistry scores are real**

The Bloom Request screen shows a compatibility percentage (e.g., "89% compatibility"). This number is currently static demo data. The bible describes it as calculated by Yande from profile analysis.

**What was assumed:** These percentages will eventually be real. In the current build, they are illustrative.

---

**A5. Verification is manual, by the founding team**

The Behavior Bible states: "The founding team reviews photos within 24 hours. This is not automated — it is human review."

The code sends photo data to session storage, not to any server. There is no photo upload pipeline, no review queue with images, and no automated or human workflow to review them. The founding team is not currently receiving any verification requests.

**What was assumed:** Verification will be manual human review at launch. This creates a real operational workload that scales with growth.

---

**A6. Gathering deposits are refunded within 48 hours if cancelled**

The Behavior Bible states this as a trust-building commitment: "If a gathering is cancelled, deposits are refunded within 48 hours, no questions asked."

There is no payment infrastructure. Deposits cannot be collected or refunded. This is a promise that cannot currently be kept.

**What was assumed:** Payments will be implemented before deposits are collected from users.

---

**A7. The Bouquet maximum of 12 is permanent**

The code hardcodes `bouquetMax: 12`. The Behavior Bible frames this as a philosophical choice (the inner 12 of Dunbar's number).

**What was assumed:** Twelve is the right number. This could change based on what actual user behavior shows.

---

**A8. The seating algorithm involves interest alignment, energy balance, and neighborhood proximity**

The Behavior Bible describes a multi-variable seating algorithm. The code has no seating algorithm. Seat selection is first-come, first-served.

**What was assumed:** The seating algorithm is a future product feature, described now to establish its eventual design.

---

**A9. Referral tracking is silent**

The Behavior Bible describes tracing referrals: "A woman shares the app with someone she knows. That person joins, attends an event, and the connection is traced."

This implies background tracking of how women discovered BloomBay. This is not implemented, but if it were, it would require disclosure under GDPR and CCPA.

**What was assumed:** Referral tracking will be opt-in or disclosed properly. No covert tracking.

---

**A10. "Girl Gem" reviews are permanent**

The Behavior Bible states: "Her handle appears on the gem permanently." This is a meaningful promise — a woman's name attached to a restaurant review forever.

There is no review system in the code. There is no way to remove a review if the member later asks for her data to be deleted.

**What was assumed:** A review infrastructure will be built that honors both the permanence promise and GDPR deletion rights. These may conflict and need a decision.

---

## Part 4: Conflicts With BloomBay's Philosophy

These are places where decisions documented in the bibles may actively contradict BloomBay's core values.

---

**C1. Invisible scoring conflicts with stated transparency**

**The conflict:** The Behavior Bible states: *"She is never told her score. She is simply invited to fewer things."*

The World Bible and institutional trust section state: *"BloomBay earns trust through... privacy that is absolute... Yande who speaks honestly."*

Silently demoting a woman's access based on a score she cannot see or contest is not honest. It is opaque. A woman who misses two dinners because she was sick or out of town will simply find that BloomBay is showing her less, without knowing why.

**The question:** Does BloomBay believe that invisible scoring is the right way to maintain quality? Or should the product tell a woman when her access is being affected, and why?

A possible middle path: *"We noticed you missed a few gatherings. We're keeping your seat warm."* — acknowledges the impact without exposing the mechanism.

---

**C2. Blocking penalty punishes self-protection**

**The conflict:** The Behavior Bible lowers a woman's Bloom Trust Score if she blocks another member within 48 hours of attending the same gathering.

The stated reason: it signals interpersonal conflict at a gathering, which damages trust signals.

The problem: the most legitimate reason to block someone immediately after an event is feeling unsafe or uncomfortable. A woman who was approached aggressively at a dinner and blocks that person within 48 hours gets *penalized* for a protective action.

This directly contradicts: *"BloomBay is a women-only space. This is not a feature — it is the foundation."*

**The question:** Should blocking ever lower a trust score? If proximity conflict is a signal, is there a better way to detect it that doesn't penalize safety-motivated blocking?

---

**C3. Low-attendance deposit increase penalizes inconsistently available women**

**The conflict:** A deposit increase for members with low attendance scores assumes that missing gatherings is always a choice. For many women, it is not: work travel, caregiving, illness, financial constraints, or simply living in a neighborhood where gatherings are infrequent all reduce attendance without reflecting commitment.

The World Bible states: *"BloomBay is not a luxury product for women who already have everything. It is infrastructure for women who are figuring it out."*

A deposit increase costs more money for the women who are already least reliably able to participate.

**The question:** Is a deposit increase the right mechanism for managing no-show risk? Or is there a softer approach (smaller table, less-exclusive gathering, different seat tier) that doesn't create a financial barrier?

---

**C4. Yande silence at Day 14 penalizes women in thin markets**

**The conflict:** The Behavior Bible states that Yande enters "resting mode" at Day 14 if a woman hasn't attended a gathering.

BloomBay is launching neighborhood by neighborhood. In early-stage markets, a woman who joined in Week 1 may find no gatherings near her for 60 days. This is not her failure — it is BloomBay's supply problem. Yande going silent in response is the product punishing the user for its own coverage gap.

**The question:** Should the 14-day timer only apply in cities/neighborhoods where BloomBay has active gatherings? Should supply-side conditions be factored into when Yande enters resting mode?

---

**C5. Compatibility scores shown without a real algorithm**

**The conflict:** Displaying "89% compatibility" and "values aligned, lifestyle aligned, energy aligned, vibe aligned" checkmarks to users when there is no algorithm computing these values is deceptive.

The Behavior Bible states: *"Yande who speaks honestly. If there are no good matches, Yande says nothing rather than suggesting a poor match. Silence is trust."*

Showing a fabricated compatibility score is the opposite of this. It is the product saying something specific and meaningful that it cannot back up.

**The question:** Should compatibility scores be shown before the real algorithm exists? Options:
- Remove the percentage entirely until the algorithm exists
- Replace with qualitative language ("You seem aligned" rather than "94%")
- Show only the checklist without the number

---

**C6. Zone Leads are unpaid human infrastructure**

**The conflict:** Zone Leads are described as anchoring BloomBay's expansion into new neighborhoods. They are unpaid, receiving social capital (crest, first access) in exchange for operational work.

The World Bible states: *"Women deserve infrastructure, not improvisation."*

Relying on unpaid women's labor to build infrastructure for women is philosophically inconsistent with that principle.

**The question:** Should Zone Leads receive a stipend, a revenue share from gatherings in their zone, or another form of tangible compensation? This is a policy and financial decision that needs founding team input.

---

**C7. Silent removal after conduct violations conflicts with dignity**

**The conflict:** The Behavior Bible states: *"Women who cause harm are quietly removed — no announcement, no drama."*

This is the right policy for community dignity — not announcing bans, not creating drama. However, the removed woman receives no explanation, no appeal process, and no opportunity to understand what she did wrong.

The World Bible says: *"BloomBay is not a status hierarchy. Belonging is not earned through achievement."*

Silent removal without process is a significant power asymmetry. It creates a situation where a woman can lose access to a community she has invested in (emotionally, financially, relationally) without recourse.

**The question:** Should there be a private notification to the removed member explaining the reason, even if the action itself is not announced publicly? Is there an appeal process?

---

**C8. "Founding Mothers dinner waitlist" as a funnel completion reward**

**The conflict:** The Behavior Bible states that completing the IRL funnel grants access to the Founding Mothers dinner waitlist.

The World Bible establishes Founding Mothers as a specific founding cohort — women who joined before BloomBay had anything to offer. Making their dinner a reward for any member who completes an onboarding funnel dilutes what "Founding Mother" means.

**The question:** Is the Founding Mothers dinner meant to expand over time? Or is it specifically and permanently for the founding cohort? If the latter, what is the actual reward for completing the IRL funnel?

---

## Summary Table

| # | Item | Type | Priority |
|---|---|---|---|
| D1 | Final hot pink + velvet hex approval | Needs decision | High — affects everything |
| D2 | Barlow Condensed font approval | Needs decision | High — in production now |
| D3 | Mobile bottom nav: which 5 tabs | Needs decision | High — in production now |
| D4 | "Admit One, Her" copy approval | Needs decision | Medium |
| D5 | SVG object redesign: budget + timeline | Needs decision | High — blocking design quality |
| D6 | Compatibility threshold: 70% confirmed? | Needs decision | Medium |
| B1 | Deposit pricing structure | Needs decision | High — before payments launch |
| B2 | Deposit increase for low attendance | Needs decision | Medium |
| B3 | No-show penalty thresholds | Needs decision | Medium |
| B4 | Club maximum per member | Needs decision | Low |
| B5 | Zone expansion criteria | Needs decision | Low — pre-expansion |
| B6 | Zone Leads compensation model | Needs decision | Medium |
| B7 | Curator monthly budget | Needs decision | Medium |
| B8 | Friendship 3-interaction threshold | Needs decision | Low |
| B9 | "Blueday" naming | Needs decision | Low |
| B10 | "Cohort-14" naming | Needs decision | Low |
| B11 | Day 30 re-engagement email | Needs decision | Medium — needs infra |
| A3 | Yande described as AI, built as rules | Assumption | Critical to communicate |
| A4 | Chemistry scores are demo data | Assumption | Must fix before launch |
| A5 | Photo verification has no backend | Assumption | Critical — blocking safety |
| A6 | Deposit refund promise with no payments | Assumption | Critical — legal risk |
| C1 | Invisible scoring vs. stated transparency | Conflict | High |
| C2 | Blocking penalty punishes self-protection | Conflict | High — safety risk |
| C3 | Deposit increase creates financial barrier | Conflict | Medium |
| C4 | Day 14 timer ignores supply coverage gaps | Conflict | Medium |
| C5 | Fake compatibility scores shown to users | Conflict | **Critical — remove before launch** |
| C6 | Zone Leads unpaid — labor contradiction | Conflict | Medium |
| C7 | Silent removal without recourse | Conflict | Medium |
| C8 | Founding Mothers dinner diluted | Conflict | Low |

---

## Three Things That Cannot Ship As-Is

Before any public launch, three items in the current codebase and documentation create real risk — legal, safety, or trust damage — if they ship without resolution.

**1. Compatibility scores displaying fake numbers**
The product currently shows percentage compatibility scores backed by no algorithm. This is deceptive. Every compatibility score must either be replaced with real output, removed entirely, or replaced with non-specific qualitative language before a user sees it.

**2. Photo verification has no backend**
The product promises human photo review and women-only access. Currently, photos are saved to browser memory and no review queue exists. The door is not being watched. This needs a verification pipeline (photo upload → Supabase Storage → founder portal review queue → approval/rejection workflow) before the product is opened to non-founding-team users.

**3. The deposit refund promise is a commitment with no mechanism**
The Behavior Bible states deposits are refunded within 48 hours if a gathering is cancelled. There is no payment system. If a deposit is ever taken under the current product, it cannot be refunded automatically or tracked. Do not collect deposits until Stripe is integrated and refund logic is built.

---

*Prepared by the engineering + design team, June 2026.*
*This document should be reviewed by the founding team before the next development sprint.*
*No decisions in this document have been made unilaterally — these are items awaiting founder input.*
