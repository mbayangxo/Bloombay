/** Confetti — celebration invitations for her (unique template per type). */

export type ConfettiType =
  | "birthday"
  | "anniversary"
  | "new_apartment"
  | "graduation"
  | "new_job"
  | "promotion"
  | "divorce"
  | "breakup";

export type ConfettiInvitation = {
  id: string;
  type: ConfettiType;
  honoree: string;
  host: string;
  when: string;
  place: string;
  headline: string;
  whisper: string;
  stickyNote: string;
  wishPresets: string[];
};

export const CONFETTI_TYPE_LABELS: Record<ConfettiType, string> = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  new_apartment: "New apartment",
  graduation: "Graduation",
  new_job: "New job",
  promotion: "Promotion",
  divorce: "New chapter",
  breakup: "Soft reset",
};

export const CONFETTI_INVITATIONS: ConfettiInvitation[] = [
  {
    id: "cf-birthday-lexi",
    type: "birthday",
    honoree: "Lexi",
    host: "Lexi",
    when: "Sat · 7:00 PM",
    place: "Chelsea · private dining room",
    headline: "Lexi turns 29",
    whisper: "Candles, champagne, and the women who know her story.",
    stickyNote: "Birthdays · promotions · milestones",
    wishPresets: [
      "Happy birthday, queen — so glad you're in my city.",
      "Wishing you the softest year yet.",
      "Can't make it but I'm cheering for you from Brooklyn.",
    ],
  },
  {
    id: "cf-promotion-amanda",
    type: "promotion",
    honoree: "Amanda",
    host: "Sunday Supper Club",
    when: "Thu · 6:30 PM",
    place: "SoHo · corner table",
    headline: "Amanda got the role",
    whisper: "She asked for a table where women can toast without performing.",
    stickyNote: "Promotions · new chapters",
    wishPresets: [
      "So proud of you — you earned every bit of this.",
      "Sending confetti from afar. Rooting for you always.",
      "Wish I could be there — drink one for me.",
    ],
  },
  {
    id: "cf-apartment-priya",
    type: "new_apartment",
    honoree: "Priya",
    host: "Priya",
    when: "Sun · 2:00 PM",
    place: "Williamsburg · new keys",
    headline: "Housewarming for Priya",
    whisper: "Bring a plant, leave a note on the fridge.",
    stickyNote: "New apartment · new keys",
    wishPresets: [
      "Your place is going to feel like you from day one.",
      "Can't tour today but I'm so happy for you.",
      "Sending love for the move — text me when you're settled.",
    ],
  },
  {
    id: "cf-grad-maya",
    type: "graduation",
    honoree: "Maya",
    host: "Founders in the Making",
    when: "Fri · 5:00 PM",
    place: "BloomBay HQ lounge",
    headline: "Maya graduates Columbia",
    whisper: "Caps optional. Tissues provided.",
    stickyNote: "Graduation · big wins",
    wishPresets: [
      "You did that. So incredibly proud.",
      "Wishing you the gentlest landing into what's next.",
      "Cheering from the sidelines — you're going to soar.",
    ],
  },
  {
    id: "cf-anniversary-sloane",
    type: "anniversary",
    honoree: "Sloane",
    host: "After Dark",
    when: "Next Sat · 8:00 PM",
    place: "West Village",
    headline: "Ten years in NYC",
    whisper: "A dinner for the woman who built a life here on purpose.",
    stickyNote: "Anniversaries · milestones",
    wishPresets: [
      "What a decade. Honored to know you in this city.",
      "Sending love for year eleven.",
      "Not tonight but forever grateful you're here.",
    ],
  },
  {
    id: "cf-job-jordan",
    type: "new_job",
    honoree: "Jordan",
    host: "Jordan",
    when: "Wed · happy hour",
    place: "Chelsea · rooftop bar",
    headline: "Jordan starts Monday",
    whisper: "First round is on the women who believed early.",
    stickyNote: "New job · new desk",
    wishPresets: [
      "You're going to crush it — they've been waiting for you.",
      "Raising a glass from afar. So happy for you.",
      "Your first week deserves softness. Proud of you.",
    ],
  },
  {
    id: "cf-chapter-nina",
    type: "divorce",
    honoree: "Nina",
    host: "Wellness Circle",
    when: "Sun · brunch",
    place: "Fort Greene · sunny table",
    headline: "Nina chose herself",
    whisper: "No questions unless she offers. Just presence.",
    stickyNote: "New chapters · soft landings",
    wishPresets: [
      "Proud of you for choosing peace.",
      "Holding space from afar — you're not alone.",
      "Your next chapter is going to be beautiful.",
    ],
  },
  {
    id: "cf-reset-brie",
    type: "breakup",
    honoree: "Brie",
    host: "Brie",
    when: "Tomorrow · 7:00 PM",
    place: "Her apartment · night in",
    headline: "Soft girl recharge",
    whisper: "Pajamas, face masks, zero advice unless asked.",
    stickyNote: "Breakups · resets",
    wishPresets: [
      "You're allowed to rest. I'm here when you want company.",
      "Sending warmth — no fixing, just love.",
      "Can't come tonight but I'm on call for snacks and silence.",
    ],
  },
];

export function getConfettiById(id: string): ConfettiInvitation | undefined {
  return CONFETTI_INVITATIONS.find((c) => c.id === id);
}
