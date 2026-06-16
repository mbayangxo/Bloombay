# /yande-discover

Implements or designs Yande's discovery layer — how she surfaces the right places, events, and people to each woman based on what she knows about her.

## Usage
/yande-discover [context]

Examples:
- `/yande-discover city-trending` — wire the City Trending section to real data + Yande's picks
- `/yande-discover event-recs` — Yande recommends events from clubs based on taste profile
- `/yande-discover place-recs` — Yande recommends saved places similar to ones she already loves
- `/yande-discover bloomie-recs` — Yande suggests Bloomies she might click with

---

## City Intelligence: how Yande populates "What's Hot"

### Data sources (ranked by trust)
1. **Bloomie saves** — if 20+ women save the same place this week, it's trending. No editorial needed.
2. **Curator submissions** — curators submit spots with source credit (Eater, Time Out, Vogue, Instagram). Admin approves.
3. **Press scraping** (future) — cron job that hits Eater NYC RSS, Time Out RSS, The Infatuation feed, pulls place names, curators review before publishing.
4. **Google Places** (future) — "trending this week" signal via Google Places API.

### City Trending table (migration 043)
`public.city_trending`: name, category, source, source_url, badge, week_of, rank_order, save_count

### Yande's editorial voice on trending spots
She adds a 1-sentence "why this matters to you" note based on the woman's taste profile:

**Generic:** "This place is trending this week."
**Yande:** "You've saved 4 Italian spots in the West Village. This one just got written up in Eater and 37 women here saved it this week."

---

## Event Discovery: Yande's recommendation formula

### Signals she uses (all from existing data — no LLM needed)
| Signal | Source |
|---|---|
| Clubs she's in | `club_memberships` |
| Events she attended | `event_attendees` or `event_checkins` |
| Places she's saved | `bloom_notes` tags |
| Interests from onboarding | `profiles.interests` array |
| Time preferences | `profiles.schedule` array |

### Recommendation logic (rule-based first)
```
score(event, user) =
  + 30 if event.club_id in user.clubs
  + 20 if event.category matches user.interests
  + 15 if event.neighborhood matches user.neighborhood
  + 10 if event.starts_at day matches user.schedule preference
  + 25 if 3+ of user's club members are attending
  - 10 if user already attended same tradition this month
```

Events with score > 50 get surfaced as "Yande thinks you'd like this."

---

## Bloomie Discovery: who Yande surfaces in Introductions

### Not random. Never random. Always reasoned.

Yande shows a Bloomie when:
- They share 2+ clubs AND have not yet met (no conversation, no bloom request)
- They live in the same neighborhood
- One attended an event the other saved but didn't attend
- Interests overlap ≥ 3 items

### Yande's intro note (required)
She always says WHY she's surfacing this person. Never just "You might like her!"

Formula: "[Specific shared thing]. [One thing that makes this interesting.] [Soft invitation]"

Example:
> "You're both in Museum Girls and Book Club — and she was at the Gagosian opening you saved but didn't make it to. Maybe she can tell you what you missed."
> — Yande ✦

---

## Implementation path
1. **Now**: Wire `city_trending` table to City page's TrendingPage component (replace hardcoded TREND_LIST)
2. **Soon**: Add Yande's note field to each trending spot — curator writes it, Yande delivers it
3. **After launch**: Add behavioral scoring to event recommendations using existing DB signals
4. **Future**: Real-time scraping + LLM for Yande's discovery voice
