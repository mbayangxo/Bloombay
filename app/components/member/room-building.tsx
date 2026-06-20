"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RoomDoor } from "./room-door";
import { BULLETIN_POSTS } from "@/lib/member-bulletin-data";
import { listGirlMateRoomPosts, addGirlMateRoomPost } from "@/lib/girl-mate-store";
import { listWallPosts, addWallPost } from "@/lib/room-forum-store";
import type { GirlMateRoomPost } from "@/lib/girl-mate-store";
import type { WallPost } from "@/lib/room-forum-store";
import { BloomNotice, BloomRequestNote, WallBoard, WallNote } from "@/app/components/bloom-artifacts";
import { wallVariantFromTopic } from "@/lib/bloom-artifact-types";
import { GirlsWorkingBoard } from "@/app/components/member/girls-working-board";
import { OfficeRoom } from "@/app/components/member/office-room";
import { MagazineRack } from "@/app/components/member/magazine-rack";
import { MagazineReader } from "@/app/components/member/magazine-reader";
import { SpaceMood } from "@/app/components/member/space-mood";
import { getMagazineBySlug } from "@/lib/magazine-room/store";
import type { MagazineEdition } from "@/lib/magazine-room/types";
import {
  lobbyHref,
  spaceFromHash,
  spaceFromSearchParams,
  type LobbySpace,
} from "@/lib/room-spaces";

const MOVING_TOPICS = [
  { id: "hunt", label: "Apartment hunting" },
  { id: "hood", label: "Neighborhoods" },
  { id: "move", label: "Moving week" },
  { id: "sub", label: "Sub-leases" },
];

const DOORS: {
  space?: Exclude<LobbySpace, "lobby">;
  href?: string;
  label: string;
  tagline: string;
  variant: "wall" | "moving" | "bulletin" | "favors" | "lost" | "magazine" | "working" | "office";
}[] = [
  { space: "girls_working", label: "Girls Working", tagline: "NYC job board", variant: "working" },
  { space: "office", label: "The Office", tagline: "Contracts & collabs", variant: "office" },
  { space: "magazine", label: "The Magazine", tagline: "Swipe · flip · lifestyle", variant: "magazine" },
  { space: "wall", label: "The Wall", tagline: "Pinned & blooming", variant: "wall" },
  { space: "moving", label: "New Keys", tagline: "Moving room", variant: "moving" },
  { space: "bulletin", label: "Bulletin", tagline: "Ask the city", variant: "bulletin" },
  { href: "/member/intros/bloom-requests", label: "Lost & Found", tagline: "Bloom requests", variant: "lost" },
  { href: "/member/intros/girl-mates", label: "Girlmates", tagline: "Roommates & questions", variant: "favors" },
];

export function RoomBuilding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSpace = spaceFromSearchParams(searchParams);
  const editionSlug = searchParams.get("edition");
  const openEdition = editionSlug ? getMagazineBySlug(editionSlug) : null;

  const [wall, setWall] = useState<WallPost[]>([]);
  const [bulletin] = useState(BULLETIN_POSTS);
  const [moving, setMoving] = useState<GirlMateRoomPost[]>([]);
  const [wallDraft, setWallDraft] = useState({ title: "", body: "" });
  const [movingOpen, setMovingOpen] = useState(false);
  const [movingForm, setMovingForm] = useState({
    neighborhood: "",
    city: "New York",
    budget: "",
    moveIn: "",
    body: "",
  });

  const refresh = useCallback(() => {
    setWall(listWallPosts());
    setMoving(listGirlMateRoomPosts());
  }, []);

  const goToSpace = useCallback(
    (space: LobbySpace) => {
      router.push(lobbyHref(space));
    },
    [router],
  );

  const backToLobby = useCallback(() => {
    router.replace(lobbyHref("lobby"));
  }, [router]);

  const hashSynced = useRef(false);

  useEffect(() => {
    refresh();
    window.addEventListener("bb-girl-mate-updated", refresh);
    return () => window.removeEventListener("bb-girl-mate-updated", refresh);
  }, [refresh]);

  useEffect(() => {
    if (hashSynced.current || typeof window === "undefined") return;
    const fromHash = spaceFromHash(window.location.hash);
    if (fromHash !== "lobby" && activeSpace === "lobby") {
      hashSynced.current = true;
      router.replace(lobbyHref(fromHash));
    }
  }, [activeSpace, router]);

  function postWall(e: React.FormEvent) {
    e.preventDefault();
    const name = sessionStorage.getItem("gf_name")?.split(" ")[0] ?? "You";
    addWallPost({ author: name, title: wallDraft.title, body: wallDraft.body });
    setWallDraft({ title: "", body: "" });
    refresh();
  }

  function postMoving(e: React.FormEvent) {
    e.preventDefault();
    const name = sessionStorage.getItem("gf_name")?.split(" ")[0] ?? "You";
    addGirlMateRoomPost({
      authorName: name,
      ...movingForm,
      budget: movingForm.budget || "Flexible",
      moveIn: movingForm.moveIn || "Flexible",
    });
    setMovingOpen(false);
    refresh();
  }

  if (activeSpace === "lobby") {
    return (
      <SpaceMood mood="room" showIntro={false}>
        <div className="bb-lobby-page">
          <div className="bb-lobby-page__interior" role="group" aria-label="Doors in the lobby">
            <div className="mp-room-doors bb-lobby-page__doors">
              {DOORS.map((d) => (
                <RoomDoor
                  key={d.label}
                  label={d.label}
                  tagline={d.tagline}
                  variant={d.variant}
                  href={d.href}
                  onEnter={
                    d.space ? () => goToSpace(d.space as Exclude<LobbySpace, "lobby">) : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </SpaceMood>
    );
  }

  function openMagazine(ed: MagazineEdition) {
    router.push(lobbyHref("magazine", ed.slug));
  }

  function closeMagazineReader() {
    router.push(lobbyHref("magazine"));
  }

  if (openEdition && activeSpace === "magazine") {
    return <MagazineReader edition={openEdition} onClose={closeMagazineReader} />;
  }

  const roomMeta: Record<
    Exclude<LobbySpace, "lobby">,
    { kicker: string; title: string; sub: string; className: string }
  > = {
    magazine: {
      kicker: "The Magazine",
      title: "BloomBay rack",
      sub: "HQ editions — lifestyle, fashion, IRL. Open one, flip full screen, leave thoughts on any page.",
      className: "bb-lobby-room--magazine",
    },
    wall: {
      kicker: "The Wall",
      title: "Pin wall",
      sub: "Questions, style notes, moving pins, wellness scraps, and bloom requests — not a chat feed.",
      className: "bb-lobby-room--wall",
    },
    moving: {
      kicker: "New Keys",
      title: "Moving room",
      sub: "Moving pins in the lobby — roommate questions live in Intros · Girlmates.",
      className: "bb-lobby-room--moving",
    },
    bulletin: {
      kicker: "Bulletin",
      title: "Ask the city",
      sub: "Quick questions — dinner tonight, fitness, founders coffee.",
      className: "bb-lobby-room--bulletin",
    },
    girls_working: {
      kicker: "Girls Working",
      title: "NYC job board",
      sub: "Fashion, cafés, libraries, social media, content, and creative roles — filtered by what you want.",
      className: "bb-lobby-room--girls-working",
    },
    office: {
      kicker: "The Office",
      title: "Work between the nights",
      sub: "Contracts, collabs, and the desk you use when BloomBay is your day job too.",
      className: "bb-lobby-room--office",
    },
  };

  const meta = roomMeta[activeSpace];

  return (
    <SpaceMood mood="room" showIntro={false}>
      <div className={`bb-lobby-room ${meta.className}`}>
        <header className="bb-lobby-room__bar">
          <button type="button" className="bb-lobby-room__back" onClick={backToLobby}>
            ← Lobby
          </button>
          <div className="bb-lobby-room__titles">
            <p className="bb-lobby-room__kicker">{meta.kicker}</p>
            <h2>{meta.title}</h2>
            <p>{meta.sub}</p>
          </div>
        </header>

        <div className="bb-lobby-room__body">
        {activeSpace === "wall" && (
          <section id="the-wall" className="mp-room-space-view mp-room-space-view--wall">
            <WallBoard>
              {wall.map((post, i) => (
                <WallNote
                  key={post.id}
                  topic={post.topic}
                  title={post.title}
                  body={post.body}
                  footer={`${post.author} · ${post.replies} replies`}
                  variant={wallVariantFromTopic(post.topic)}
                  tilt={i % 2 === 0 ? -1.2 : 1.4}
                />
              ))}
            </WallBoard>
            {wall.some((p) => p.topic.toLowerCase().includes("bloom")) ? (
              <div style={{ marginTop: "1rem" }}>
                <BloomRequestNote
                  overline="Bloom request · pinned"
                  headline="Folded"
                  headlineAccent="notes"
                  tagline="Intros when you're ready"
                  body="Bloom requests on The Wall are personal — accept in Intros, not in a thread."
                  handLabel="BR"
                />
              </div>
            ) : null}
            <form className="mp-room-compose" onSubmit={postWall}>
              <input
                className="mp-input"
                placeholder="Thread title"
                value={wallDraft.title}
                onChange={(e) => setWallDraft((d) => ({ ...d, title: e.target.value }))}
                required
              />
              <textarea
                className="mp-input"
                rows={3}
                placeholder="Start a discussion…"
                value={wallDraft.body}
                onChange={(e) => setWallDraft((d) => ({ ...d, body: e.target.value }))}
                required
              />
              <button type="submit" className="mp-btn mp-btn--hot">
                Post to the Wall
              </button>
            </form>
          </section>
        )}

        {activeSpace === "moving" && (
          <section id="moving-room" className="mp-room-space-view mp-room-space-view--moving">
            <header>
              <p className="mp-room-space-view__kicker">New Keys</p>
              <h2>Moving room</h2>
              <p>Quick moving pins — full roommate board lives in Intros · Girlmates.</p>
              <div className="mp-room-topic-pills">
                {MOVING_TOPICS.map((t) => (
                  <span key={t.id} className="mp-pill">
                    {t.label}
                  </span>
                ))}
              </div>
              <Link href="/member/intros/girl-mates" className="mp-btn mp-btn--outline mp-btn--sm">
                Girlmates in Intros →
              </Link>
            </header>
            <WallBoard>
              {moving.map((post, i) => (
                <WallNote
                  key={post.id}
                  topic="Moving note"
                  title={post.authorName}
                  body={`${post.neighborhood}, ${post.city} · ${post.budget} · ${post.moveIn}. ${post.body}`}
                  footer="Girlmates · New Keys"
                  variant={i % 2 === 0 ? "ivory" : "pink"}
                  tilt={i % 2 === 0 ? 1.5 : -1}
                />
              ))}
            </WallBoard>
            {movingOpen ? (
              <form className="mp-room-compose" onSubmit={postMoving}>
                <input
                  className="mp-input"
                  placeholder="Neighborhood"
                  value={movingForm.neighborhood}
                  onChange={(e) => setMovingForm((f) => ({ ...f, neighborhood: e.target.value }))}
                  required
                />
                <input
                  className="mp-input"
                  placeholder="Budget"
                  value={movingForm.budget}
                  onChange={(e) => setMovingForm((f) => ({ ...f, budget: e.target.value }))}
                />
                <textarea
                  className="mp-input"
                  rows={3}
                  placeholder="What are you looking for?"
                  value={movingForm.body}
                  onChange={(e) => setMovingForm((f) => ({ ...f, body: e.target.value }))}
                  required
                />
                <button type="submit" className="mp-btn mp-btn--hot">
                  Post in Moving Room
                </button>
              </form>
            ) : (
              <button type="button" className="mp-btn mp-btn--hot mp-btn--block" onClick={() => setMovingOpen(true)}>
                Post moving pin
              </button>
            )}
          </section>
        )}

        {activeSpace === "bulletin" && (
          <section id="bulletin" className="mp-room-space-view mp-room-space-view--bulletin">
            <header>
              <p className="mp-room-space-view__kicker">Bulletin</p>
              <h2>Ask the city</h2>
              <p>Quick questions — dinner tonight, fitness, founders coffee.</p>
            </header>
            <div className="bb-artifact-stack">
              {bulletin.map((post) => (
                <WallNote
                  key={post.id}
                  topic={post.tag}
                  title={post.q}
                  body="Pinned question — reply when you have a lead."
                  footer={`${post.author} · ${post.replies} replies`}
                  variant="yellow"
                  tilt={-0.8}
                />
              ))}
              <BloomNotice
                eyebrow="BloomBay · bulletin"
                headline="Ask the city"
                body="Quick scraps only — dinners tonight, fitness, founders coffee. Long threads belong on The Wall."
                footer="Yande keeps bulletin posts recent-first."
                official
              />
            </div>
            <Link href="/member/happenings?tab=bulletin" className="mp-btn mp-btn--hot mp-btn--block" style={{ textAlign: "center" }}>
              Post to bulletin
            </Link>
          </section>
        )}

        {activeSpace === "magazine" && (
          <section id="the-magazine" className="mp-room-space-view mp-room-space-view--magazine">
            <MagazineRack onOpen={openMagazine} />
          </section>
        )}

        {activeSpace === "girls_working" && (
          <section id="girls-working" className="mp-room-space-view mp-room-space-view--girls-working">
            <GirlsWorkingBoard />
          </section>
        )}

        {activeSpace === "office" && (
          <section id="the-office" className="mp-room-space-view mp-room-space-view--office">
            <OfficeRoom />
          </section>
        )}
        </div>
      </div>
    </SpaceMood>
  );
}
