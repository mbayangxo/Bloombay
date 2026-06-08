import { INVITATIONS } from "@/lib/member-portal-data";
import type { GirlMateRoomPost } from "@/lib/girl-mate-store";
import type { WallPost } from "@/lib/room-forum-store";
import { lobbyHref } from "@/lib/room-spaces";

export type LobbyPin = {
  id: string;
  room: "wall" | "moving" | "bulletin" | "happenings";
  label: string;
  line: string;
  meta: string;
  href: string;
  variant: "yellow" | "pink" | "ivory" | "envelope";
};

export type LobbyTonight = {
  headline: string;
  whisper: string;
  noteCount: number;
  roommateCount: number;
  invitationCount: number;
  pins: LobbyPin[];
};

function brunchInvitationCount(): number {
  return INVITATIONS.filter(
    (i) =>
      /brunch|dinner|supper|table/i.test(i.title) ||
      /brunch|dinner/i.test(i.when),
  ).length;
}

/** Tonight line + pins from data already in the lobby rooms. */
export function buildLobbyTonight(
  wall: WallPost[],
  moving: GirlMateRoomPost[],
  bulletin: { id: string; q: string; author: string; tag: string; replies: number }[],
): LobbyTonight {
  const invitationCount = Math.max(2, brunchInvitationCount());
  const roommateCount = Math.max(3, moving.length);
  const noteCount = wall.length + bulletin.length + moving.length;

  const pins: LobbyPin[] = [];

  const brunchWall = wall.find((p) => /brunch/i.test(p.title + p.body));
  if (brunchWall) {
    pins.push({
      id: `pin-${brunchWall.id}`,
      room: "wall",
      label: "Pinned · Wall",
      line: brunchWall.title,
      meta: `${brunchWall.author} · ${brunchWall.replies} replies`,
      href: lobbyHref("wall"),
      variant: "pink",
    });
  }

  for (const post of moving.slice(0, 2)) {
    pins.push({
      id: `pin-${post.id}`,
      room: "moving",
      label: "New Keys",
      line: `${post.authorName} · ${post.neighborhood}`,
      meta: `${post.budget} · ${post.moveIn}`,
      href: "/member/intros/girl-mates",
      variant: "ivory",
    });
  }

  const inv = INVITATIONS.find((i) => /brunch|dinner|rooftop/i.test(i.title));
  if (inv) {
    pins.push({
      id: `pin-${inv.id}`,
      room: "happenings",
      label: "Invitation",
      line: inv.title,
      meta: `${inv.host} · ${inv.when}`,
      href: "/member/happenings?tab=invitations",
      variant: "envelope",
    });
  }

  for (const post of bulletin.slice(0, 2)) {
    pins.push({
      id: `pin-${post.id}`,
      room: "bulletin",
      label: post.tag,
      line: post.q,
      meta: `${post.author} · ${post.replies} women replied`,
      href: lobbyHref("bulletin"),
      variant: "yellow",
    });
  }

  const gathering = wall.find((p) => p.topic === "The Gathering");
  if (gathering) {
    pins.push({
      id: `pin-${gathering.id}`,
      room: "wall",
      label: "On the board",
      line: gathering.title,
      meta: gathering.author,
      href: lobbyHref("wall"),
      variant: "yellow",
    });
  }

  for (const post of wall.filter((p) => !pins.some((x) => x.id === `pin-${p.id}`)).slice(0, 2)) {
    pins.push({
      id: `pin-${post.id}`,
      room: "wall",
      label: post.topic,
      line: post.title,
      meta: `${post.author} · ${post.replies} replies`,
      href: lobbyHref("wall"),
      variant: post.topic.toLowerCase().includes("bloom") ? "pink" : "ivory",
    });
  }

  return {
    headline: "Tonight in the lobby",
    whisper: "Someone is still awake in here.",
    noteCount: Math.max(noteCount, 14),
    roommateCount,
    invitationCount,
    pins: pins.slice(0, 6),
  };
}
