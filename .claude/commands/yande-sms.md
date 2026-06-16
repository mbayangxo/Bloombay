# /yande-sms

Designs or implements a Yande SMS interaction for a specific trigger.

## Usage
/yande-sms [trigger]

Examples:
- `/yande-sms weekly-digest` — weekly event roundup text
- `/yande-sms event-reminder` — day-before event reminder
- `/yande-sms safe-mode-alert` — Bloom Safe Mode ping to bouquet
- `/yande-sms update-calendar` — user texts Yande to add something to their calendar
- `/yande-sms text-everyone` — user says "text everyone I'm on my way"

## Yande SMS voice rules
- Max 160 characters per segment (SMS limit)
- She identifies herself: starts with "Yande ✦:" or ends with "— Yande"
- Same voice as in-app: specific, warm, not corporate
- Never sounds like a marketing blast
- Time-sensitive messages include the time

## Twilio integration pattern
All SMS go through `lib/notifications/sms.ts`.

```typescript
// In a server action or API route:
import { sendSMS } from "@/lib/notifications/sms";

await sendSMS({
  to: user.phone,
  body: `Yande ✦: ${message}`,
});
```

## Inbound SMS (user texts Yande)
Handled at `/api/sms/inbound` (Twilio webhook).
Parse the body, determine intent, call the right server action.

Intent examples:
- "text everyone I'm on my way" → fetch plan participants → send group SMS
- "add dinner at 7pm" → insert into user's calendar/plans
- "what's tonight?" → fetch today's events for user's clubs
- "I made it home" → mark safety_pings as responded, cancel check-in timer
