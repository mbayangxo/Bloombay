import { BLOOM_OBJECTS } from "@/lib/bloom-object-assets";
import { INVITATIONS } from "@/lib/member-portal-data";

export type HomeGlancePin = {
  id: string;
  label: string;
  line: string;
  href: string;
  object: string;
  variant: "hot" | "barbie" | "white";
};

export function buildHomeGlance(clubCount = 3): HomeGlancePin[] {
  const invCount = [...INVITATIONS].length;
  return [
    {
      id: "inv",
      label: "Invitations",
      line: invCount === 1 ? "1 envelope on your board" : `${invCount} envelopes on your board`,
      href: "/member/happenings?tab=invitations",
      object: BLOOM_OBJECTS.request,
      variant: "white",
    },
    {
      id: "clubs",
      label: "Your clubs",
      line: `${clubCount} you belong to`,
      href: "/member/clubs",
      object: BLOOM_OBJECTS.bouquet,
      variant: "barbie",
    },
    {
      id: "lobby",
      label: "The lobby",
      line: "Notes still moving tonight",
      href: "/member/room",
      object: BLOOM_OBJECTS.door,
      variant: "hot",
    },
  ];
}

export const HOME_OBJECT_CHARMS = [
  { src: BLOOM_OBJECTS.ticket, label: "Happenings" },
  { src: BLOOM_OBJECTS.bouquet, label: "Bouquet" },
  { src: BLOOM_OBJECTS.door, label: "Lobby" },
  { src: BLOOM_OBJECTS.pin, label: "Pinned" },
  { src: BLOOM_OBJECTS.postcard, label: "Memories" },
  { src: BLOOM_OBJECTS.key, label: "New Keys" },
] as const;
