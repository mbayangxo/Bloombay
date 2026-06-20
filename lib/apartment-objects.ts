import { BLOOM_OBJECTS } from "@/lib/bloom-object-assets";
import { BLOOM_PLACES } from "@/lib/bloom-places";

/** Objects in My Apartment — personal keepsakes, not social hallways. */
export const APARTMENT_OBJECTS = [
  {
    id: "memories",
    title: "Memories",
    hint: "Postcards & moments",
    href: "/member/vault?tab=memories",
    object: BLOOM_OBJECTS.postcard,
  },
  {
    id: "bouquet",
    title: "Bouquet",
    hint: "Inner circle",
    href: "/member/bouquet",
    object: BLOOM_OBJECTS.bouquet,
  },
  {
    id: "bloomies",
    title: "Bloomies",
    hint: "Friends you've met",
    href: "/member/bloomies",
    object: BLOOM_OBJECTS.table,
  },
  {
    id: "invitations",
    title: "Invitations",
    hint: "Envelopes & confetti",
    href: BLOOM_PLACES.invitations.href,
    object: BLOOM_OBJECTS.ticket,
  },
  {
    id: "library",
    title: "My library",
    hint: "Saved plans & tickets",
    href: "/member/vault",
    object: BLOOM_OBJECTS.key,
  },
  {
    id: "girl-code",
    title: "Girl code",
    hint: "How we hold each other",
    href: "/member/girl-code",
    object: BLOOM_OBJECTS.crest,
  },
  {
    id: "event-qr",
    title: "Event QR",
    hint: "Scan in at the door",
    href: "/member/profile/qr?tab=event",
    object: BLOOM_OBJECTS.pin,
  },
] as const;
