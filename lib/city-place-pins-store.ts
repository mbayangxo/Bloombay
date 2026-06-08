/**
 * Place pins — women mark spots on the city map (The City utility).
 */

export type CityPlacePin = {
  id: string;
  placeName: string;
  neighborhood: string;
  note: string;
  emoji: string;
  author: string;
  createdAt: string;
  imageUrl?: string;
};

const KEY = "bb_city_place_pins";

const SEED_PINS: CityPlacePin[] = [
  {
    id: "pin-soho",
    placeName: "Sant Ambroeus",
    neighborhood: "SoHo",
    note: "Best corner table for solo lunch",
    emoji: "🥐",
    author: "BloomBay",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "pin-dumbo",
    placeName: "Time Out Market",
    neighborhood: "DUMBO",
    note: "Waterfront golden hour walk after",
    emoji: "🌅",
    author: "BloomBay",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

function canUse() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readUserPinsOnly(): CityPlacePin[] {
  if (!canUse()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as CityPlacePin[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function readPins(): CityPlacePin[] {
  const user = readUserPinsOnly();
  const ids = new Set(user.map((p) => p.id));
  return [...user, ...SEED_PINS.filter((s) => !ids.has(s.id))];
}

function writeUserPins(rows: CityPlacePin[]) {
  if (!canUse()) return;
  localStorage.setItem(KEY, JSON.stringify(rows.slice(0, 40)));
  window.dispatchEvent(new CustomEvent("bb-city-pins-updated"));
}

export function listCityPlacePins(): CityPlacePin[] {
  return readPins().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addCityPlacePin(input: {
  placeName: string;
  neighborhood: string;
  note: string;
  emoji?: string;
  imageDataUrl?: string;
}): CityPlacePin {
  const name =
    (canUse() ? sessionStorage.getItem("gf_name") : null)?.split(" ")[0] ?? "You";
  const row: CityPlacePin = {
    id: `pin-u-${Date.now()}`,
    placeName: input.placeName.trim(),
    neighborhood: input.neighborhood.trim() || "NYC",
    note: input.note.trim(),
    emoji: input.emoji?.trim() || "📍",
    author: name,
    createdAt: new Date().toISOString(),
    imageUrl: input.imageDataUrl?.slice(0, 400_000),
  };
  writeUserPins([row, ...readUserPinsOnly()]);
  return row;
}
