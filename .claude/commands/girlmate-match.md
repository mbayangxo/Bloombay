# /girlmate-match

Designs or implements Yande's compatibility scoring for GirlMate roommate/sublet matching.

## Usage
/girlmate-match [task]

Examples:
- `/girlmate-match score` — compute compatibility % between two profiles
- `/girlmate-match yande-note [profile-a] [profile-b]` — write Yande's explanation of why they match
- `/girlmate-match quiz` — generate the 10-question compatibility quiz UI
- `/girlmate-match listing` — scaffold a new listing post flow

---

## Compatibility Score Formula

**Housing compatibility** is NOT the same as friendship compatibility. Always show them separately.

### Housing score (out of 100)
| Category | Weight | Fields |
|---|---|---|
| Lifestyle & habits | 35% | smoking, weed_ok, pets, halal_kitchen |
| Home environment | 25% | wfh_friendly, noise tolerance, cleanliness |
| Financial | 20% | budget overlap (price_cents range) |
| Communication | 10% | tone profile from Yande |
| Social energy | 10% | schedule, guests_ok, partner_ok |

### Scoring logic
```typescript
function housingScore(a: GirlmateProfile, b: GirlmateProfile): number {
  let score = 0;

  // Lifestyle (35pts)
  if (a.smoking === b.smoking)       score += 12;
  if (a.weed_ok === b.weed_ok)       score += 8;
  if (a.pets === b.pets)             score += 8;
  if (a.halal_kitchen === b.halal_kitchen) score += 7;

  // Financial (20pts)
  const budgetOverlap = a.budget_max >= b.budget_min && b.budget_max >= a.budget_min;
  if (budgetOverlap) score += 20;

  // Home environment (25pts — from quiz answers, stored in lifestyle_tags)
  const sharedTags = a.lifestyle_tags.filter(t => b.lifestyle_tags.includes(t));
  score += Math.min(25, sharedTags.length * 5);

  // Social energy (10pts)
  if (a.partner_ok === b.partner_ok) score += 5;
  if (a.wfh_friendly === b.wfh_friendly) score += 5;

  // Communication (10pts) — default 7 until tone profiles are wired
  score += 7;

  return Math.min(100, score);
}
```

---

## Yande's GirlMate note formula
She explains the WHY of the match in 2 sentences max.

**Template:**
- Sentence 1: Specific shared thing (not generic "you have a lot in common")
- Sentence 2: The one potential friction point + how to navigate it

**Example:**
> "You're both halal, neither smokes, and you both work from home — your daily rhythms already rhyme. The one thing to talk through: she has a cat and you haven't listed pets. Worth a conversation before you commit."
> — Yande ✦

**Never write:**
- "You seem like a great match!" (too vague)
- "You both want a clean space" (everyone says this)
- More than 3 sentences

---

## GirlMate listing types
- `room` — she has a room available in her apartment
- `apartment` — she's subletting her whole apartment
- `roommate-wanted` — she's looking for someone to share with her
- `co-search` — she doesn't have a place yet, looking for a co-searching partner

Yande treats `co-search` pairs differently — they're compatible *seekers*, not host/guest. Focus the note on their ability to search and decide together.

---

## Database table: `girlmate_profiles`
Key columns added in migration 042:
`listing_type`, `city`, `neighborhood_name`, `price_cents`, `available_from`, `available_to`, `furnished`, `private_bathroom`, `weed_ok`, `halal_kitchen`, `wfh_friendly`, `partner_ok`, `show_profile`, `description`, `yande_note`

Server actions live in `lib/actions/girlmate.ts`.
