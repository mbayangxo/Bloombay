import { BLOOM_OBJECTS } from "@/lib/bloom-object-assets";
import { BLOOM_PLACES } from "@/lib/bloom-places";

/** Primary places on home */
export const HOME_PLACE_GRID = [
  { id: "invitations", label: BLOOM_PLACES.invitations.label, href: BLOOM_PLACES.invitations.href, object: BLOOM_OBJECTS.ticket },
  { id: "apartment", label: BLOOM_PLACES.apartment.label, href: BLOOM_PLACES.apartment.href, object: BLOOM_OBJECTS.bouquet },
  { id: "city", label: BLOOM_PLACES.places.label, href: BLOOM_PLACES.places.href, object: BLOOM_OBJECTS.pin },
  { id: "lobby", label: BLOOM_PLACES.lobby.label, href: BLOOM_PLACES.lobby.href, object: BLOOM_OBJECTS.door },
  { id: "clubs", label: BLOOM_PLACES.clubHouse.label, href: BLOOM_PLACES.clubHouse.href, object: BLOOM_OBJECTS.crest },
  { id: "concierge", label: BLOOM_PLACES.concierge.label, href: BLOOM_PLACES.concierge.href, object: BLOOM_OBJECTS.request },
] as const;
