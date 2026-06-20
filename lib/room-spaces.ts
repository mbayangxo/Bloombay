/** The Lobby and the rooms inside it (Wall, New Keys, Bulletin). */

export type LobbySpace =
  | "lobby"
  | "wall"
  | "moving"
  | "bulletin"
  | "magazine"
  | "girls_working"
  | "office";

export const LOBBY_SPACE_PARAM = "space";

const HASH_TO_SPACE: Record<string, LobbySpace> = {
  "the-wall": "wall",
  "moving-room": "moving",
  "girl-mate-room": "moving",
  bulletin: "bulletin",
  magazine: "magazine",
  "the-magazine": "magazine",
  "girls-working": "girls_working",
  office: "office",
  "the-office": "office",
};

const QUERY_TO_SPACE: Record<string, LobbySpace> = {
  wall: "wall",
  "the-wall": "wall",
  moving: "moving",
  "moving-room": "moving",
  "girl-mate-room": "moving",
  bulletin: "bulletin",
  magazine: "magazine",
  "the-magazine": "magazine",
  girls_working: "girls_working",
  "girls-working": "girls_working",
  office: "office",
  "the-office": "office",
};

export function lobbyHref(space?: LobbySpace, editionSlug?: string): string {
  if (!space || space === "lobby") return "/member/room";
  const base = `/member/room?${LOBBY_SPACE_PARAM}=${space}`;
  if (editionSlug) return `${base}&edition=${encodeURIComponent(editionSlug)}`;
  return base;
}

export function spaceFromHash(hash: string): LobbySpace {
  const key = hash.replace(/^#/, "").trim();
  if (!key) return "lobby";
  return HASH_TO_SPACE[key] ?? "lobby";
}

export function spaceFromSearchParams(params: URLSearchParams): LobbySpace {
  const raw = params.get(LOBBY_SPACE_PARAM);
  if (!raw) return "lobby";
  return QUERY_TO_SPACE[raw] ?? "lobby";
}

export function isInsideLobbyRoom(params: URLSearchParams): boolean {
  return spaceFromSearchParams(params) !== "lobby";
}
