# /yande-organize

Implements or designs Yande's organization layer — the feature where a woman texts Yande and Yande manages her schedule, to-do list, and group communications.

## Usage
/yande-organize [feature]

Examples:
- `/yande-organize calendar` — add events to her plans via text
- `/yande-organize text-group` — "text everyone I'm on my way"
- `/yande-organize reminders` — set and fire reminders for her week
- `/yande-organize todo` — manage her to-do list via text
- `/yande-organize weekly-brief` — Yande texts her a Sunday morning brief of her week

---

## How Yande organizes (inbound SMS → action)

The woman texts Yande's number. The `/api/sms/inbound` Twilio webhook receives it and routes by intent:

### Intent detection (simple keyword matching, no LLM needed initially)

| User says | Intent | Action |
|---|---|---|
| "add dinner saturday 8pm" | add_plan | Insert into `bloomies_plans` with date/time parsed |
| "text everyone I'm on my way" | group_text | Fetch plan participants → send SMS to each |
| "what's tonight?" | query_tonight | Fetch today's events + plans → reply with list |
| "remind me tomorrow 6pm pilates" | set_reminder | Insert into `notifications` with scheduled_at |
| "I made it home" | safe_checkin | Cancel active safety check-in, mark pings resolved |
| "cancel dinner" | cancel_plan | Find most recent upcoming plan, set status='cancelled', notify group |
| "who's coming tonight?" | query_rsvp | Fetch plan invites where rsvp='yes', list names |

### Yande's reply voice (SMS)
- Max 160 chars per message
- Always includes a ✦ or 🌸 so she's recognizable
- Specific, not generic: "Done. Girls Dinner Sat 8pm. I'll remind you at 6. — Yande ✦"
- Never corporate: not "Your event has been added to your calendar."

---

## Outbound: Yande texts her first

| Trigger | When | What Yande says |
|---|---|---|
| Weekly digest | Sunday 10am | 3 events from her clubs she'd like this week |
| Event reminder | Day before | "Tomorrow: [Event] at [Venue] — [Time]. Your girls are going. 🌸" |
| Safe mode alert | Immediately when pinged | Texts bouquet members: "[Name] sent a quiet ping. Check on her when you can. — Yande ✦" |
| Monthly recap | 1st of month | "Your [Month] recap is ready in the app. You had a good one. — Yande ✦" |
| New Bloomie nearby | When relevant | "Someone in your clubs just moved to [neighborhood]. Yande thinks you'd click." |

---

## Database
- Plans: `bloomies_plans` + `bloomies_plan_invites`
- Reminders: `notifications` table with `created_at` used as scheduled time (needs a cron to fire them)
- Safety: `safety_pings` table (migration 041)
- SMS history: log outbound messages to a `sms_log` table (optional but useful for debugging)

## API route
`/api/sms/inbound` — Twilio webhook POST
`/api/cron/weekly-events` — already exists, expand to include weekly digest SMS
