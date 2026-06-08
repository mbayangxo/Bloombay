/** Authored microcopy — the city breathes, it doesn't error. */

export const BLOOM_EMPTY = {
  events: {
    line: "The city is catching its breath.",
    whisper: "Try tomorrow — something usually lands on the board by morning.",
  },
  requests: {
    line: "Nobody knocked today.",
    whisper: "That's okay. The lobby stays open.",
  },
  clubs: {
    line: "No house chosen yet.",
    whisper: "Walk into a club — it becomes yours.",
  },
  seats: {
    line: "Every seat is still whispering.",
    whisper: "Check back after sunset.",
  },
  bulletin: {
    line: "The board is quiet.",
    whisper: "Pin a question — the city answers back.",
  },
  mailbox: {
    line: "Your mailbox is clear.",
    whisper: "Invitations, bloom requests, and club pings land here when women reach out.",
  },
  bloomies: {
    line: "No Bloomies yet.",
    whisper: "Scan her QR in person — that's how real connections get saved.",
  },
  girlmates: {
    line: "No posts in this filter.",
    whisper: "Ask about roommates, subleases, or neighborhood questions — someone usually answers same day.",
  },
  maps: {
    line: "No pins on the map yet.",
    whisper: "Drop a place women should know — or browse The City for moments and eats.",
  },
  plans: {
    line: "Nothing on the books yet.",
    whisper: "When you RSVP to a Happening, it lands here — ticket, time, and door check-in in one tap.",
  },
} as const;

export function bloomEmptyProps(
  key: keyof typeof BLOOM_EMPTY,
  action?: { label: string; href: string }
) {
  const copy = BLOOM_EMPTY[key];
  return {
    title: copy.line,
    body: copy.whisper,
    actionLabel: action?.label,
    actionHref: action?.href,
  };
}
