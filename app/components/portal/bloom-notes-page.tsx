"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PushPin } from "./scrapbook";
import { BBStickerPicker } from "./bb-sticker-picker";
import {
  getTopNotesForPlace, leaveBloomNote, toggleFlower, toggleSaveNote,
  getPlaceTagCounts, addNoteTags,
  type BloomNote, type CityTag,
  CITY_TAG_LABELS, CITY_TAG_EMOJIS,
} from "@/lib/actions/bloom-notes";

const PINK  = "#FF1F7D";
const CREAM = "#F6F1EB";
const DARK  = "#1C1B1C";

const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

const NOTE_TONES = ["#FFF6D8", "#FDE8EE", "#E8F2E4", "#EDE8FD", "#FDE8D8"];
const PIN_COLORS = ["gold", "pink", "red", "gold", "pink"] as const;

function unslug(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min  = Math.floor(diff / 60000);
  if (min < 2)   return "just now";
  if (min < 60)  return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24)   return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7)     return `${d}d ago`;
  if (d < 30)    return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

// ── Bloom Score: total flowers across all notes ───────────────────────────────
function BloomScoreBadge({ score }: { score: number }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "white", borderRadius: 999, padding: "8px 16px",
      boxShadow: "0 4px 20px rgba(255,31,125,0.18), 0 1px 4px rgba(0,0,0,0.08)",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill={PINK} stroke="none">
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
      </svg>
      <div>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, color: PINK, lineHeight: 1 }}>{score.toLocaleString()}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "#C0185F", marginTop: 1 }}>BLOOM SCORE</p>
      </div>
    </div>
  );
}

// ── Author chip — tapping goes to her profile (Bloom Trail) ──────────────────
function AuthorChip({ note }: { note: BloomNote }) {
  const initials = (note.author_name ?? "B").charAt(0).toUpperCase();
  return (
    <Link href={`/member/profile/${note.author_id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
      {note.author_avatar ? (
        <Image src={note.author_avatar} alt="" width={26} height={26} unoptimized style={{ borderRadius: "50%", objectFit: "cover", border: "2px solid white", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }} />
      ) : (
        <div style={{
          width: 26, height: 26, borderRadius: "50%",
          background: `linear-gradient(135deg, ${PINK}, #FF69B4)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid white", boxShadow: "0 2px 6px rgba(255,31,125,0.3)",
        }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white" }}>{initials}</span>
        </div>
      )}
      <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: DARK }}>{note.author_name ?? "A Bloomie"}</span>
    </Link>
  );
}

// ── Single note card — Polaroid style ────────────────────────────────────────
function NoteCard({
  note, index, onFlower, onSave, top,
}: {
  note: BloomNote;
  index: number;
  onFlower: (id: string) => void;
  onSave: (id: string) => void;
  top: boolean;
}) {
  const gradients = [
    "linear-gradient(135deg,#FFD6EA,#FFABD4)",
    "linear-gradient(135deg,#FFE8B0,#FFD580)",
    "linear-gradient(135deg,#B8E4C9,#7DD4A8)",
    "linear-gradient(135deg,#C9C4F0,#A89BE8)",
    "linear-gradient(135deg,#FFD6EA,#FF8EC7)",
  ];
  const bg = gradients[index % gradients.length];
  const rotation = ["-1.5deg","1.2deg","-0.8deg","1.8deg","-1deg"][index % 5];

  return (
    <div style={{ transform: `rotate(${rotation})`, position: "relative" }}>
      <PushPin color={PIN_COLORS[index % PIN_COLORS.length]} size={13} style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}/>

      {/* Polaroid frame */}
      <div style={{ background: "white", padding: "7px 7px 22px", boxShadow: "0 5px 22px rgba(0,0,0,0.2), 0 1px 4px rgba(0,0,0,0.1)" }}>

        {/* Photo slot */}
        <div style={{ width: "100%", aspectRatio: "1", background: bg, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {top && (
            <div style={{ position: "absolute", top: 6, right: 6, background: PINK, borderRadius: 4, padding: "2px 7px", zIndex: 2 }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.14em", color: "white" }}>MOST LOVED</span>
            </div>
          )}
          {/* Note text as photo content */}
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.65)", lineHeight: 1.55, padding: "10px 12px", textAlign: "center" as const }}>
            {note.content}
          </p>
        </div>

        {/* Polaroid caption area */}
        <div style={{ paddingTop: 6 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <AuthorChip note={note} />
            <span style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "#A09080" }}>
              {timeAgo(note.created_at)}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
            {/* Save */}
            <button
              onClick={() => onSave(note.id)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px", display: "flex", alignItems: "center" }}
              aria-label="save"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill={note.saved ? "#C0185F" : "none"} stroke="#C0185F" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>

            {/* Flower */}
            <button
              onClick={() => onFlower(note.id)}
              style={{
                background: note.gave_flower ? "#C0185F" : "rgba(192,24,95,0.08)",
                color: note.gave_flower ? "white" : "#C0185F",
                border: "none", borderRadius: 999, padding: "3px 9px", cursor: "pointer",
                fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800,
                display: "flex", alignItems: "center", gap: 3,
              }}
            >
              ✿ {note.flower_count}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Composer strip ────────────────────────────────────────────────────────────
const ALL_TAGS = Object.keys(CITY_TAG_LABELS) as CityTag[];

function Composer({ placeSlug, placeName, onPosted }: { placeSlug: string; placeName: string; onPosted: () => void }) {
  const [draft, setDraft]         = useState("");
  const [selectedTags, setTags]   = useState<CityTag[]>([]);
  const [posting, setPosting]     = useState(false);
  const [error, setError]         = useState("");
  const [showStickers, setShowStickers] = useState(false);

  function toggleTag(tag: CityTag) {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag].slice(0, 3));
  }

  async function post() {
    const text = draft.trim();
    if (!text || posting) return;
    setPosting(true);
    setError("");
    const res = await leaveBloomNote(placeSlug, placeName, text, selectedTags);
    if (res.ok) {
      setDraft("");
      setTags([]);
      onPosted();
    } else {
      setError(res.error ?? "Something went wrong.");
    }
    setPosting(false);
  }

  return (
    <div style={{
      background: "#FFF8E8", borderRadius: 6, padding: "14px 14px 11px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.14)", transform: "rotate(-0.5deg)", position: "relative",
    }}>
      <PushPin color="gold" size={14} style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}/>
      <div style={{ position: "relative" }}>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Leave a little note for the next girl…"
          rows={3}
          maxLength={500}
          style={{
            width: "100%", border: "none", outline: "none", background: "transparent",
            resize: "none", fontFamily: "var(--font-caveat)", fontSize: 17, color: "#3A2A1A", lineHeight: 1.45,
          }}
        />
        {showStickers && (
          <BBStickerPicker
            onSelect={sticker => { setDraft(prev => prev + sticker); setShowStickers(false); }}
            onClose={() => setShowStickers(false)}
          />
        )}
      </div>
      {draft.trim().length > 0 && (
        <div style={{ marginBottom: 10, marginTop: 4 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "#B0A090", letterSpacing: "0.1em", marginBottom: 6 }}>QUICK TAGS · PICK UP TO 3</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {ALL_TAGS.map(tag => {
              const active = selectedTags.includes(tag);
              return (
                <button key={tag} onClick={() => toggleTag(tag)} style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "4px 9px", borderRadius: 999,
                  background: active ? PINK : "rgba(0,0,0,0.05)",
                  border: `1px solid ${active ? PINK : "rgba(0,0,0,0.1)"}`,
                  color: active ? "white" : "#6A5A4A",
                  fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: active ? 700 : 600,
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 10 }}>{CITY_TAG_EMOJIS[tag]}</span>
                  {CITY_TAG_LABELS[tag]}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {error && <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "#E53E3E", marginBottom: 6 }}>{error}</p>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "#B0A090" }}>{draft.length}/500</span>
          <button
            onClick={() => setShowStickers(prev => !prev)}
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: showStickers ? PINK : "#FFF0F7",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: showStickers ? `0 2px 10px ${PINK}55` : "none",
              transition: "all 0.15s",
            }}
            aria-label="Open sticker picker"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={showStickers ? "white" : PINK} strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </button>
        </div>
        <button
          onClick={post}
          disabled={posting || !draft.trim()}
          style={{
            background: draft.trim() ? PINK : "rgba(0,0,0,0.08)",
            color: draft.trim() ? "white" : "#AAA",
            border: "none", borderRadius: 999, padding: "7px 18px",
            cursor: draft.trim() ? "pointer" : "default",
            fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.14em",
            boxShadow: draft.trim() ? `0 3px 14px ${PINK}55` : "none",
          }}
        >
          {posting ? "PINNING…" : "PIN IT ✿"}
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function BloomNotesPage({ placeSlug }: { placeSlug: string }) {
  const [notes, setNotes]       = useState<BloomNote[]>([]);
  const [tagCounts, setTagCounts] = useState<Partial<Record<CityTag, number>>>({});
  const placeName = notes[0]?.place_name ?? unslug(placeSlug);
  const bloomScore = notes.reduce((sum, n) => sum + n.flower_count, 0);

  async function load() {
    const [data, counts] = await Promise.all([
      getTopNotesForPlace(placeSlug, 100),
      getPlaceTagCounts(placeSlug),
    ]);
    setNotes(data);
    setTagCounts(counts);
  }

  useEffect(() => { load(); }, [placeSlug]);

  function onFlower(id: string) {
    setNotes(ns => ns.map(n => n.id === id
      ? { ...n, gave_flower: !n.gave_flower, flower_count: n.flower_count + (n.gave_flower ? -1 : 1) }
      : n
    ).sort((a, b) => b.flower_count - a.flower_count));
    toggleFlower(id);
  }

  function onSave(id: string) {
    setNotes(ns => ns.map(n => n.id === id ? { ...n, saved: !n.saved } : n));
    toggleSaveNote(id);
  }

  return (
    <div style={{
      background: CREAM, backgroundImage: PAPER_TEX, backgroundSize: "200px 200px",
      minHeight: "100vh", paddingBottom: 48,
    }}>

      {/* ── Header ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "rgba(246,241,235,0.92)", backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "52px 18px 14px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <Link href="/member/city" style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "rgba(0,0,0,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            textDecoration: "none",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 2 }}>BLOOM NOTES</p>
            <h1 style={{
              fontFamily: "var(--font-playfair)", fontSize: "clamp(20px,6vw,26px)",
              fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1,
            }}>{placeName}</h1>
          </div>
          {notes.length > 0 && <BloomScoreBadge score={bloomScore} />}
        </div>

        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#9A8070" }}>
          {notes.length === 0
            ? "No notes yet — be the first ✿"
            : `${notes.length} note${notes.length !== 1 ? "s" : ""} left behind`}
        </p>
      </div>

      <div style={{ padding: "20px 18px 0" }}>

        {/* ── Composer ── */}
        <div style={{ marginBottom: 20 }}>
          <Composer placeSlug={placeSlug} placeName={placeName} onPosted={load} />
        </div>

        {/* ── City Intelligence: aggregated tags ── */}
        {Object.keys(tagCounts).length > 0 && (
          <div style={{ marginBottom: 24, background: "white", borderRadius: 14, padding: "12px 14px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 10 }}>WOMEN SAY THIS PLACE IS…</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(Object.entries(tagCounts) as [CityTag, number][])
                .sort((a, b) => b[1] - a[1])
                .map(([tag, count]) => (
                  <div key={tag} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 999, background: `${PINK}0E`, border: `1px solid ${PINK}22` }}>
                    <span style={{ fontSize: 12 }}>{CITY_TAG_EMOJIS[tag]}</span>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK }}>{CITY_TAG_LABELS[tag]}</span>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(0,0,0,0.3)", fontWeight: 600 }}>· {count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── Notes feed ── */}
        {notes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 20, color: "#C0B0A0" }}>✿</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "#B0A090", marginTop: 8 }}>
              No notes here yet.
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "#C0B0A0", marginTop: 4, letterSpacing: "0.1em" }}>
              LEAVE ONE ABOVE ↑
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {notes.map((note, i) => (
              <NoteCard
                key={note.id}
                note={note}
                index={i}
                onFlower={onFlower}
                onSave={onSave}
                top={i === 0 && note.flower_count > 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
