# Yande SMS Policy

SMS is a privileged channel. It bypasses app notification preferences and costs money.
Yande must not use SMS for routine engagement or community nudges.

## Approved SMS use cases

| Use case | Who triggers it | Notes |
|---|---|---|
| Private beta acceptance | Onboarding team / manual | One-time invitation to accepted applicants |
| App launch announcement | Product team / manual | Sent once to the waitlist at launch |
| Phone number verification | Auth flow | OTP only — no marketing content |
| Urgent safety alert | Human admin only | e.g. event cancelled same-day for safety reasons |

## Not approved for SMS

- Welcome messages (use in-app notification)
- Day-3 / day-7 community nudges (use in-app notification)
- Event reminders (use in-app notification)
- Club activity updates (use in-app notification)
- GirlMate match suggestions (use in-app notification)
- Any automated engagement campaign

## Enforcement

`lib/yande/community-coordinator.ts` sends **in-app notifications only**.
The `sendSMS` import has been removed from that file.

Any new Yande agent that wants to send SMS must get explicit sign-off
from the product team and document the use case in this file before shipping.
