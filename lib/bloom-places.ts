/** Places women enter — not feature pages. */

export const BLOOM_PLACES = {
  tonight: { label: "Tonight", href: "/member/home", short: "Tonight" },
  places: { label: "The City", href: "/member/explore", short: "City" },
  clubHouse: { label: "Club House", href: "/member/clubs", short: "Clubs" },
  invitations: { label: "Invitations", href: "/member/happenings?tab=invitations", short: "Invites" },
  lobby: { label: "Lobby", href: "/member/room", short: "Lobby" },
  apartment: { label: "Apartment", href: "/member/lounge", short: "Apt" },
  concierge: { label: "Concierge", href: "/member/intros", short: "Yande" },
} as const;
