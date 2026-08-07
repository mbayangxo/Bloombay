"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getNotesForGathering,
  getNotesForPlace,
  leaveBloomNote,
  giveNoteGift,
  takeBackNoteGift,
  toggleSaveNote,
} from "@/lib/actions/bloom-notes";
import type { BloomNote } from "@/lib/bloom-notes/shared";
import { FlowerButton } from "@/app/components/shared/flower-button";
import type { GiftKind } from "@/lib/bloom-gifts";
import { unitsForKind } from "@/lib/bloom-gifts";
import { MEDIA_BUCKETS } from "@/lib/media/buckets";
import { uploadImageFile } from "@/lib/media/upload-client";

const PINK = "#FF1F7D";
const NOTE_TONES = ["#FFF6D8", "#FDE8EE", "#E8F2E4", "#EDE8FD"];

type BloomNotesBoardProps = {
  placeSlug: string;
  placeName: string;
  /** When set, notes are scoped to this Happening */
  gatheringId?: string | null;
  brand?: string;
  accent?: string;
  seeAllHref?: string | null;
  compact?: boolean;
};

export function BloomNotesBoard({
  placeSlug,
  placeName,
  gatheringId = null,
  brand = PINK,
  accent = "#FF69B4",
  seeAllHref,
  compact = false,
}: BloomNotesBoardProps) {
  const [notes, setNotes] = useState<BloomNote[]>([]);
  const [draft, setDraft] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [canEngage, setCanEngage] = useState(!gatheringId);
  const fileRef = useRef<HTMLInputElement>(null);

  async function reload() {
    const list = gatheringId
      ? await getNotesForGathering(gatheringId)
      : await getNotesForPlace(placeSlug);
    setNotes(list);
    setLoaded(true);
  }

  useEffect(() => {
    void reload().catch(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeSlug, gatheringId]);

  useEffect(() => {
    if (!gatheringId) {
      setCanEngage(true);
      return;
    }
    void fetch(`/api/happenings/can-engage?gatheringId=${encodeURIComponent(gatheringId)}`)
      .then((r) => r.json())
      .then((d) => setCanEngage(!!d.allowed))
      .catch(() => setCanEngage(false));
  }, [gatheringId]);

  useEffect(() => {
    const urls = photos.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [photos]);

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    setPhotos((prev) => [...prev, ...files].slice(0, 4));
    e.target.value = "";
  }

  async function post() {
    const text = draft.trim();
    if ((!text && photos.length === 0) || posting) return;
    setPosting(true);
    setError(null);
    try {
      const photoUrls: string[] = [];
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Not signed in.");
        setPosting(false);
        return;
      }
      for (const file of photos) {
        const path = `${user.id}/bloom-notes/${placeSlug}/${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const result = await uploadImageFile(MEDIA_BUCKETS.memberMemories, path, file);
        if (result.ok) photoUrls.push(result.publicUrl);
        else {
          setError(result.error);
          setPosting(false);
          return;
        }
      }

      const res = await leaveBloomNote(placeSlug, placeName, text, [], {
        photoUrls,
        gatheringId,
      });
      if (!res.ok) {
        setError(res.error ?? "Could not pin note.");
        setPosting(false);
        return;
      }
      setDraft("");
      setPhotos([]);
      await reload();
    } catch {
      setError("Something went wrong. Try again.");
    }
    setPosting(false);
  }

  async function onGiveGift(id: string, kind: GiftKind) {
    const note = notes.find((n) => n.id === id);
    const prevUnits = note?.flower_count ?? 0;
    const prevKind = note?.my_gift_kind ?? null;
    const prevGaveUnits = prevKind ? unitsForKind(prevKind) : 0;
    const nextUnits = unitsForKind(kind);

    setNotes((ns) =>
      ns.map((n) =>
        n.id === id
          ? {
              ...n,
              gave_flower: true,
              my_gift_kind: kind,
              flower_count: Math.max(0, n.flower_count - prevGaveUnits + nextUnits),
            }
          : n,
      ),
    );
    const result = await giveNoteGift(id, kind);
    if (!result.gave && result.kind === null) {
      // took back because same kind tapped again
      setNotes((ns) =>
        ns.map((n) =>
          n.id === id
            ? { ...n, gave_flower: false, my_gift_kind: null, flower_count: Math.max(0, prevUnits - prevGaveUnits) }
            : n,
        ),
      );
    }
  }

  async function onTakeBackGift(id: string) {
    const note = notes.find((n) => n.id === id);
    const prevKind = note?.my_gift_kind;
    const prevGaveUnits = prevKind ? unitsForKind(prevKind) : 0;
    setNotes((ns) =>
      ns.map((n) =>
        n.id === id
          ? {
              ...n,
              gave_flower: false,
              my_gift_kind: null,
              flower_count: Math.max(0, n.flower_count - prevGaveUnits),
            }
          : n,
      ),
    );
    await takeBackNoteGift(id);
  }

  async function onSave(id: string) {
    setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, saved: !n.saved } : n)));
    await toggleSaveNote(id);
  }

  const allHref =
    seeAllHref ??
    (gatheringId ? null : `/member/city/bloom-notes/${encodeURIComponent(placeSlug)}`);

  return (
    <div
      style={{
        background: "#F8F0E0",
        borderRadius: 16,
        padding: compact ? "14px 12px" : "16px 14px",
        marginBottom: 12,
        boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            background: brand,
            borderRadius: 4,
            padding: "3px 9px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "7px",
              fontWeight: 800,
              color: "white",
              letterSpacing: "0.14em",
            }}
          >
            BLOOM NOTES
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#B0A090" }}>
            real notes · real photos ✿
          </span>
          {allHref ? (
            <Link
              href={allHref}
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: 9,
                fontWeight: 800,
                color: PINK,
                textDecoration: "none",
              }}
            >
              See all →
            </Link>
          ) : null}
        </div>
      </div>

      {/* Composer — gatherings: only confirmed going / attended */}
      {gatheringId && !canEngage ? (
        <div
          style={{
            background: "rgba(0,0,0,0.03)",
            borderRadius: 10,
            padding: "14px 12px",
            marginBottom: 14,
            border: "1px dashed rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#666", lineHeight: 1.45, margin: 0 }}>
            Bloom Notes, flowers, and bouquets are for women who are <strong>going</strong> or who{" "}
            <strong>went</strong>. RSVP first — then you can leave your note.
          </p>
        </div>
      ) : (
      <div
        style={{
          background: "#FFF8E6",
          borderRadius: 10,
          padding: "12px",
          marginBottom: 14,
          border: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={
            gatheringId
              ? "How was this night? Leave a note for the girls…"
              : "Leave a little note for the next girl…"
          }
          rows={2}
          maxLength={500}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            resize: "none",
            fontFamily: "var(--font-caveat)",
            fontSize: 16,
            color: "#4A3A2A",
            lineHeight: 1.4,
          }}
        />

        {previews.length > 0 ? (
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            {previews.map((url, i) => (
              <div
                key={url}
                style={{
                  position: "relative",
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button
                  type="button"
                  onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(0,0,0,0.55)",
                    color: "white",
                    fontSize: 11,
                    cursor: "pointer",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {error ? (
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: 10,
              color: "#E53E3E",
              marginBottom: 8,
            }}
          >
            {error}
          </p>
        ) : null}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={onPickFiles}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={photos.length >= 4}
              style={{
                background: "rgba(0,0,0,0.05)",
                border: "none",
                borderRadius: 999,
                padding: "6px 12px",
                fontFamily: "var(--font-jost)",
                fontSize: 9,
                fontWeight: 800,
                color: "#666",
                cursor: photos.length >= 4 ? "default" : "pointer",
              }}
            >
              + Photo{photos.length ? ` (${photos.length}/4)` : ""}
            </button>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "#B0A090" }}>
              {draft.length}/500
            </span>
          </div>
          <button
            type="button"
            onClick={() => void post()}
            disabled={posting || (!draft.trim() && photos.length === 0)}
            style={{
              background: draft.trim() || photos.length ? PINK : "rgba(0,0,0,0.08)",
              color: draft.trim() || photos.length ? "white" : "#AAA",
              border: "none",
              borderRadius: 999,
              padding: "7px 16px",
              cursor: draft.trim() || photos.length ? "pointer" : "default",
              fontFamily: "var(--font-jost)",
              fontSize: "8px",
              fontWeight: 800,
              letterSpacing: "0.14em",
            }}
          >
            {posting ? "PINNING…" : "PIN IT ✿"}
          </button>
        </div>
      </div>
      )}

      {/* Notes list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {!loaded ? (
          <p
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: 14,
              color: "#B0A090",
              textAlign: "center",
            }}
          >
            Loading notes…
          </p>
        ) : notes.length === 0 ? (
          <p
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: 15,
              color: "#B0A090",
              textAlign: "center",
              padding: "8px 0 4px",
              fontStyle: "italic",
            }}
          >
            Be the first to leave a Bloom Note here ✿
          </p>
        ) : (
          notes.map((n, i) => (
            <div
              key={n.id}
              style={{
                background: NOTE_TONES[i % NOTE_TONES.length],
                borderRadius: 10,
                padding: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              }}
            >
              {n.photo_urls.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginBottom: 10,
                    overflowX: "auto",
                  }}
                >
                  {n.photo_urls.map((url) => (
                    <div
                      key={url}
                      style={{
                        flexShrink: 0,
                        width: 96,
                        height: 96,
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              {n.content && n.content !== "✦" ? (
                <p
                  style={{
                    fontFamily: "var(--font-caveat)",
                    fontSize: 15.5,
                    color: "#4A3A2A",
                    lineHeight: 1.45,
                    marginBottom: 8,
                  }}
                >
                  {n.content}
                </p>
              ) : null}
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                {n.author_avatar ? (
                  <Image
                    src={n.author_avatar}
                    alt=""
                    width={20}
                    height={20}
                    unoptimized
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${accent}, ${brand})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-jost)",
                        fontSize: 9,
                        fontWeight: 800,
                        color: "white",
                      }}
                    >
                      {(n.author_name ?? "B").charAt(0)}
                    </span>
                  </div>
                )}
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "8px",
                    fontWeight: 800,
                    color: "#2A1A10",
                  }}
                >
                  {n.author_name ?? "A Bloomie"}
                </p>
                <button
                  type="button"
                  onClick={() => void onSave(n.id)}
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px 4px",
                  }}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill={n.saved ? "#C0185F" : "none"}
                    stroke="#C0185F"
                    strokeWidth="2.5"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
                <FlowerButton
                  size="sm"
                  units={n.flower_count}
                  myKind={n.my_gift_kind}
                  onGive={(kind) => onGiveGift(n.id, kind)}
                  onTakeBack={() => onTakeBackGift(n.id)}
                  disabled={!!gatheringId && !canEngage}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
