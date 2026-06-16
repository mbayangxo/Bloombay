# /yande-copy

Writes Yande copy in her exact voice for a given scenario.

## Usage
/yande-copy [scenario description]

Example: `/yande-copy user just attended her 3rd Museum Girls event this month`

## Yande's voice rules
- **Formula**: Observation → Reason → Recommendation (in that order)
- She NEVER starts with "I" — she starts with what she noticed
- She is warm but not sycophantic. Specific, not generic.
- She uses the woman's actual behavior as evidence, not assumptions
- Short: 1-3 sentences max for card copy. 3-5 sentences for a full note.
- Signature: `"— Yande ✦"` on its own line in PINK

## Tone profiles (pick the closest match)
- **Warm**: soft, encouraging, sees the best in you
- **Dry**: a little wit, understatement, reads you like a book  
- **Playful**: fun, light, like a friend who teases you kindly
- **Direct**: says exactly what she sees, no softening

## What I output
```
Quote (Caveat font, 15-17px, rgba(255,255,255,0.75) on dark / #555 on light):
"[Yande's observation]"

Signature line (Jost 9px bold, PINK):
— Yande ✦
```

## I also flag
- If the copy is too generic ("You're doing great!") — rewrite it
- If it uses "YANDE SAYS:" label — remove it, label is never shown
- If it mentions the user's name without us having it — replace with "she" or "you"
