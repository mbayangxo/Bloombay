/** Each club is a house — rooms, not tabs. */

export type ClubHouseRoom = {
  id: string;
  label: string;
};

const DEFAULT: ClubHouseRoom[] = [
  { id: "wall", label: "House Crest" },
  { id: "zones", label: "Rooms" },
  { id: "moments", label: "Memory Wall" },
  { id: "happenings", label: "House Calendar" },
  { id: "members", label: "Members" },
  { id: "chat", label: "Parlor" },
  { id: "planner", label: "Planner" },
];

const PRESETS: Record<string, ClubHouseRoom[]> = {
  "wander-women": [
    { id: "wall", label: "Living Room" },
    { id: "zones", label: "Upcoming Trips" },
    { id: "happenings", label: "House Calendar" },
    { id: "members", label: "Members" },
    { id: "moments", label: "Travel Wall" },
    { id: "chat", label: "Trip Chat" },
    { id: "planner", label: "Itinerary" },
  ],
  "wellness-circle": [
    { id: "wall", label: "Wellness Wall" },
    { id: "happenings", label: "Sunday Walk" },
    { id: "zones", label: "Resources" },
    { id: "members", label: "Members" },
    { id: "moments", label: "Memory Wall" },
    { id: "chat", label: "Circle Chat" },
    { id: "planner", label: "Planner" },
  ],
  "founders-in-the-making": [
    { id: "wall", label: "Founders Hall" },
    { id: "zones", label: "Office Hours" },
    { id: "happenings", label: "House Calendar" },
    { id: "members", label: "Members" },
    { id: "chat", label: "War Room" },
    { id: "planner", label: "Planner" },
  ],
};

export function getClubHouseRooms(clubId: string): ClubHouseRoom[] {
  const preset = PRESETS[clubId];
  if (!preset) return DEFAULT;
  const seen = new Set<string>();
  return preset.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}
