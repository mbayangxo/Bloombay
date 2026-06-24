"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PushPin } from "../scrapbook";
import {
  getNotesForPlace, leaveBloomNote, toggleFlower, toggleSaveNote,
  type BloomNote,
} from "@/lib/actions/bloom-notes";
import {
  PINK,
  PAPER_TEX, DARK_GRAIN,
} from "@/lib/city/tokens";
import {
  type EatsPartner,
} from "@/lib/city/city-data";
import { BackBtn, StarRow, Tape, PaperCard } from "./shared";

export function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const NOTE_TONES = ["#FFF6D8", "#FDE8EE", "#E8F2E4"];

export function BloomNotesBoard({ placeSlug, placeName, brand, accent }: { placeSlug: string; placeName: string; brand: string; accent: string }) {
  const [notes, setNotes]     = useState<BloomNote[]>([]);
  const [draft, setDraft]     = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    getNotesForPlace(placeSlug).then(setNotes).catch(() => {});
  }, [placeSlug]);

  async function post() {
    const text = draft.trim();
    if (!text || posting) return;
    setPosting(true);
    const res = await leaveBloomNote(placeSlug, placeName, text);
    if (res.ok) {
      setDraft("");
      setNotes(await getNotesForPlace(placeSlug));
    }
    setPosting(false);
  }

  async function onFlower(id: string) {
    setNotes(ns => ns.map(n => n.id === id
      ? { ...n, gave_flower: !n.gave_flower, flower_count: n.flower_count + (n.gave_flower ? -1 : 1) }
      : n));
    await toggleFlower(id);
  }

  async function onSave(id: string) {
    setNotes(ns => ns.map(n => n.id === id ? { ...n, saved: !n.saved } : n));
    await toggleSaveNote(id);
  }

  return (
    <div style={{
      backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px",
      backgroundColor: "#F8F0E0", borderRadius: 14, padding: "16px 14px", marginBottom: 12,
      boxShadow: "0 6px 24px rgba(0,0,0,0.4)", position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "inline-flex", background: brand, borderRadius: 4, padding: "3px 9px" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.14em" }}>BLOOM NOTES</span>
        </div>
        <span style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#B0A090" }}>left behind, for you ✿</span>
      </div>

      {/* Composer — leave one behind */}
      <div style={{ background: "#FFF8E6", borderRadius: 4, padding: "12px 12px 10px", marginBottom: 14, boxShadow: "0 3px 12px rgba(0,0,0,0.15)", transform: "rotate(-0.6deg)", position: "relative" }}>
        <PushPin color="gold" size={13} style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}/>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Leave a little note for the next girl…"
          rows={2}
          maxLength={500}
          style={{
            width: "100%", border: "none", outline: "none", background: "transparent", resize: "none",
            fontFamily: "var(--font-caveat)", fontSize: 16, color: "#4A3A2A", lineHeight: 1.4,
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={post} disabled={posting || !draft.trim()} style={{
            background: draft.trim() ? PINK : "rgba(0,0,0,0.08)",
            color: draft.trim() ? "white" : "#AAA",
            border: "none", borderRadius: 999, padding: "6px 16px", cursor: draft.trim() ? "pointer" : "default",
            fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.14em",
            boxShadow: draft.trim() ? `0 3px 12px ${PINK}55` : "none",
          }}>
            {posting ? "PINNING…" : "PIN IT ✿"}
          </button>
        </div>
      </div>

      {/* The notes — only real ones, nothing shown until they exist */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notes.length === 0 && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#B0A090", textAlign: "center", padding: "8px 0 4px", fontStyle: "italic" }}>
            Be the first to leave a note here ✿
          </p>
        )}

        {notes.map((n, i) => (
          <div key={n.id} style={{ background: NOTE_TONES[i % 3], borderRadius: 4, padding: "12px 12px 10px", boxShadow: "0 3px 12px rgba(0,0,0,0.14)", transform: `rotate(${i % 2 === 0 ? -0.8 : 1}deg)`, position: "relative" }}>
            <PushPin color={i % 2 === 0 ? "pink" : "red"} size={12} style={{ position: "absolute", top: -7, left: `${30 + (i % 4) * 14}%`, zIndex: 2 }}/>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15.5, color: "#4A3A2A", lineHeight: 1.45, marginBottom: 8 }}>{n.content}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              {n.author_avatar ? (
                <Image src={n.author_avatar} alt="" width={20} height={20} unoptimized style={{ borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}, ${brand})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, color: "white" }}>{(n.author_name ?? "B").charAt(0)}</span>
                </div>
              )}
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "#2A1A10" }}>{n.author_name ?? "A Bloomie"}</p>
              <button onClick={() => onSave(n.id)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill={n.saved ? "#C0185F" : "none"} stroke="#C0185F" strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </button>
              <button onClick={() => onFlower(n.id)} style={{
                background: n.gave_flower ? "#C0185F" : "rgba(192,24,95,0.1)",
                color: n.gave_flower ? "white" : "#C0185F",
                border: "none", borderRadius: 999, padding: "3px 10px", cursor: "pointer",
                fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800,
              }}>
                ✿ {n.flower_count}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PartnerStorefront({ partner: p, onBack, isOwner = false }: { partner: EatsPartner; onBack: () => void; isOwner?: boolean }) {
  const [savedToWorld, setSavedToWorld] = useState(false);

  // Brand palette derived from the partner
  const BRAND  = p.heroColor;
  const ACCENT = p.accentColor;

  // Toned "photo" placeholder — gradient tile standing in for real imagery
  function PhotoTile({ tone, h = 70, br = 6 }: { tone: string; h?: number; br?: number }) {
    return (
      <div style={{
        height: h, borderRadius: br, flexShrink: 0,
        background: `linear-gradient(135deg, ${tone} 0%, ${BRAND}33 60%, ${BRAND}66 100%)`,
        backgroundBlendMode: "multiply",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
      }}/>
    );
  }

  return (
    <div style={{
      backgroundImage: `${DARK_GRAIN}`,
      backgroundSize: "160px 160px",
      backgroundColor: "#100C0A",
      minHeight: "100vh", paddingBottom: 120,
      position: "relative",
    }}>
      {/* subtle brand glow */}
      <div style={{ position: "fixed", top: "10%", left: "20%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${BRAND}40 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }}/>

      <BackBtn onBack={onBack} label="EATS"/>

      {/* Edit page button — for partner owners */}
      {isOwner && (
        <Link href={`/member/city/partners/${toSlug(p.name)}/edit`} style={{
          position: "fixed", top: "calc(env(safe-area-inset-top,0px) + 58px)", right: 14, zIndex: 50,
          background: "rgba(255,31,125,0.9)", color: "white", borderRadius: 999,
          padding: "6px 14px", fontFamily: "var(--font-jost)", fontSize: "8px",
          fontWeight: 800, letterSpacing: "0.14em", textDecoration: "none",
          backdropFilter: "blur(10px)", boxShadow: "0 4px 14px rgba(255,31,125,0.5)",
        }}>
          EDIT PAGE ✏
        </Link>
      )}

      <div style={{ position: "relative", padding: "calc(env(safe-area-inset-top,0px) + 100px) 14px 0", maxWidth: 480, margin: "0 auto" }}>

        {/* ── Header strip: BLOOMBAY · BLOOM APPROVED · badge ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, padding: "0 4px" }}>
          <div style={{ background: BRAND, borderRadius: 4, padding: "4px 10px" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.2em" }}>BLOOMBAY</span>
          </div>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#F6C8D8", transform: "rotate(-3deg)" }}>bloom approved ♡</p>
          {/* Partner badge */}
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#FBF6EE", display: "flex", alignItems: "center", justifyContent: "center", border: `2px dashed ${BRAND}`, boxShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 900, fontStyle: "italic", color: BRAND }}>{p.name.charAt(0)}</span>
          </div>
        </div>

        {/* ── Hero collage: title card + polaroid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 10, marginBottom: 12 }}>
          {/* Title card */}
          <PaperCard rotate={-0.8} style={{ padding: "18px 14px" }}>
            <Tape rotate={-4} left="30%"/>
            <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px,7.5vw,34px)", fontWeight: 900, fontStyle: "italic", color: BRAND, lineHeight: 1.0, marginBottom: 6 }}>{p.name}</h1>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: ACCENT, marginBottom: 10 }}>{p.hood}, NYC</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#5A4A3A", lineHeight: 1.4 }}>{p.poem} <span style={{ color: "#E8336E" }}>♡</span></p>
          </PaperCard>

          {/* Polaroid + notes column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Polaroid */}
            <div style={{ background: "#FDFBF6", padding: "7px 7px 22px", borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.45)", transform: "rotate(1.5deg)", position: "relative" }}>
              <Tape rotate={3}/>
              <div style={{ height: 110, borderRadius: 2, background: `linear-gradient(150deg, ${ACCENT}AA 0%, ${BRAND} 70%)`, position: "relative", overflow: "hidden" }}>
                {/* simple table-scene suggestion */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 34, background: "rgba(255,255,255,0.18)" }}/>
                <div style={{ position: "absolute", bottom: 22, left: "28%", width: 30, height: 18, borderRadius: "0 0 14px 14px", background: "rgba(255,255,255,0.85)" }}/>
                <div style={{ position: "absolute", bottom: 26, right: "22%", width: 26, height: 12, borderRadius: 8, background: "rgba(255,240,210,0.9)" }}/>
                <div style={{ position: "absolute", top: 10, left: "15%", width: 40, height: 52, borderRadius: "50% 50% 0 0", background: "rgba(255,255,255,0.22)" }}/>
              </div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10.5, color: "#8A7A6A", textAlign: "center", marginTop: 5, lineHeight: 1 }}>{p.polaroidCaption}</p>
            </div>
            {/* Bloom notes — tap to see all */}
            <Link href={`/member/city/bloom-notes/${toSlug(p.name)}`} style={{ textDecoration: "none" }}>
              <PaperCard rotate={1} style={{ padding: "10px 12px", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.18em", color: "#C0185F", marginBottom: 5 }}>BLOOM NOTES</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#5A4A3A", lineHeight: 1.4 }}>What women left behind here ✿</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "#C0185F", marginTop: 6 }}>READ THEM →</p>
              </PaperCard>
            </Link>
          </div>
        </div>

        {/* ── Rated strip + host note ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 10, marginBottom: 12 }}>
          <PaperCard rotate={0.6} style={{ padding: "13px 14px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: BRAND, marginBottom: 6 }}>BLOOMIES RATED</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(22px, 7.5vw, 30px)", fontWeight: 900, color: "#2A1A10", lineHeight: 1 }}>{p.rating}</p>
              <StarRow/>
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: "#9A8A7A", letterSpacing: "0.08em", marginTop: 6 }}>LOVED BY {p.lovedBy} WOMEN</p>
          </PaperCard>

          <PaperCard rotate={-0.5} style={{ padding: "13px 14px" }}>
            <Tape rotate={-5} left="70%"/>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: BRAND, marginBottom: 7 }}>A NOTE FROM {p.hostNote.from.toUpperCase()}</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#4A3A2A", lineHeight: 1.45 }}>{p.hostNote.text} <span style={{ color: "#E8336E" }}>♡</span></p>
          </PaperCard>
        </div>

        {/* ── Girl favorites + about/tips column ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 10, marginBottom: 12 }}>
          {/* Girl favorites */}
          <PaperCard rotate={-0.4}>
            <div style={{ display: "inline-flex", background: BRAND, borderRadius: 4, padding: "3px 9px", marginBottom: 12 }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.14em" }}>GIRL FAVORITES</span>
            </div>
            {p.girlFavorites.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: i < p.girlFavorites.length - 1 ? 11 : 0 }}>
                <div style={{ width: 38 }}><PhotoTile tone={f.tone} h={38} br={5}/></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "#2A1A10", letterSpacing: "0.04em", lineHeight: 1.2 }}>{f.item.toUpperCase()}</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11.5, color: ACCENT, marginTop: 1 }}>{f.note}</p>
                </div>
                <span style={{ color: "#E8336E", fontSize: 9 }}>♡</span>
              </div>
            ))}
          </PaperCard>

          {/* About + tips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <PaperCard rotate={0.7} style={{ padding: "12px 13px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: BRAND, marginBottom: 6 }}>✦ ABOUT {p.name.split(" ")[0].toUpperCase()}</p>
              {/* storefront illustration suggestion */}
              <div style={{ height: 54, borderRadius: 5, marginBottom: 7, background: `linear-gradient(180deg, ${BRAND}22 0%, ${BRAND}44 100%)`, position: "relative", overflow: "hidden", border: `1px solid ${BRAND}33` }}>
                <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", top: 14, border: `2px solid ${BRAND}88`, borderBottom: "none", borderRadius: "6px 6px 0 0", background: "rgba(255,255,255,0.4)" }}/>
                <div style={{ position: "absolute", top: 8, left: "14%", right: "14%", height: 7, background: BRAND, borderRadius: 2 }}/>
              </div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "#6A5A4A", lineHeight: 1.55 }}>{p.about}</p>
            </PaperCard>

            {/* Pink bloom tips */}
            {p.tips.map((tip, i) => (
              <div key={i} style={{
                background: i === 0 ? "#F9C8D8" : "#F6B8CC",
                borderRadius: 6, padding: "10px 12px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                transform: `rotate(${i === 0 ? -1.2 : 1.4}deg)`,
                position: "relative",
              }}>
                <Tape rotate={i === 0 ? 4 : -3}/>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.18em", color: "#C0185F", marginBottom: 4 }}>BLOOM TIP</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#7A1A40", lineHeight: 1.35 }}>{tip} ♡</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── More photos + passport ── */}
        <div style={{ marginBottom: 12 }}>
          <PaperCard rotate={0.3} style={{ padding: "12px 13px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
              <div style={{ display: "inline-flex", background: BRAND, borderRadius: 4, padding: "3px 9px" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.14em" }}>MORE FROM {p.name.split(" ")[0].toUpperCase()}</span>
              </div>
              <span style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#B0A090" }}>the atmosphere ✦</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7 }}>
              {[`${ACCENT}88`, `${BRAND}55`, `${ACCENT}55`, `${BRAND}77`].map((tone, i) => (
                <PhotoTile key={i} tone={tone} h={64} br={5}/>
              ))}
            </div>
          </PaperCard>
        </div>

        {/* ── Bloom passport stamp ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <PaperCard rotate={-0.6} style={{ padding: "14px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "#7A6A5A", marginBottom: 9 }}>BLOOM PASSPORT</p>
            {p.visited ? (
              <>
                <div style={{ display: "inline-block", border: "2.5px solid #C0185F", borderRadius: 6, padding: "5px 14px", transform: "rotate(-6deg)", marginBottom: 7 }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 900, color: "#C0185F", letterSpacing: "0.18em" }}>VISITED</span>
                </div>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#9A8A7A" }}>added to your bloom passport</p>
              </>
            ) : (
              <>
                <div style={{ display: "inline-block", border: "2px dashed #B0A090", borderRadius: 6, padding: "5px 14px", transform: "rotate(-4deg)", marginBottom: 7 }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, color: "#B0A090", letterSpacing: "0.16em" }}>NOT YET</span>
                </div>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#9A8A7A" }}>stamp it when you go ✈</p>
              </>
            )}
          </PaperCard>

          {/* Menu peek */}
          <PaperCard rotate={0.8} style={{ padding: "13px 14px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: BRAND, marginBottom: 8 }}>FROM THE MENU</p>
            {p.menuHighlights.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: i < p.menuHighlights.length - 1 ? 6 : 0 }}>
                <span style={{ fontFamily: "var(--font-playfair)", fontSize: 11, fontStyle: "italic", color: "#3A2A1A", lineHeight: 1.2 }}>{m.item}</span>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800, color: ACCENT, marginLeft: 8, flexShrink: 0 }}>{m.price}</span>
              </div>
            ))}
          </PaperCard>
        </div>

        {/* ── Bloom notes board — read them all, leave one ── */}
        <BloomNotesBoard placeSlug={toSlug(p.name)} placeName={p.name} brand={BRAND} accent={ACCENT} />

        {/* ── What Bloomies are saying ── */}
        <div style={{
          backgroundImage: `${PAPER_TEX}`, backgroundSize: "200px 200px",
          backgroundColor: "#F6EFE4", borderRadius: 14, padding: "14px", marginBottom: 12,
          boxShadow: "0 6px 24px rgba(0,0,0,0.4)",
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: BRAND, marginBottom: 11 }}>WHAT BLOOMIES ARE SAYING</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 9 }}>
            {p.reviews.map((r, i) => (
              <div key={i}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: `linear-gradient(135deg, ${ACCENT}, ${BRAND})`, flexShrink: 0 }}/>
                  <div>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "#2A1A10", lineHeight: 1 }}>{r.name}</p>
                    <StarRow size={6}/>
                  </div>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "#6A5A4A", lineHeight: 1.5 }}>{r.text}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", color: "#B0A090", marginTop: 4 }}>{r.ago}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick info + save CTA ── */}
        <div style={{
          backgroundImage: `${DARK_GRAIN}`, backgroundSize: "160px 160px",
          backgroundColor: BRAND, borderRadius: 16, padding: "16px",
          boxShadow: `0 10px 36px ${BRAND}88`,
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>QUICK INFO</p>
          {[
            { icon: "📍", text: `${p.hood}, NYC` },
            { icon: "🕐", text: p.hours },
            { icon: "✦",  text: p.instagram },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <span style={{ fontSize: 10 }}>{row.icon}</span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.88)" }}>{row.text}</span>
            </div>
          ))}
          <button onClick={() => setSavedToWorld(s => !s)} style={{
            marginTop: 8, width: "100%",
            background: savedToWorld ? "rgba(255,255,255,0.92)" : PINK,
            color: savedToWorld ? BRAND : "white",
            border: "none", borderRadius: 999, padding: "12px 0",
            fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800,
            letterSpacing: "0.12em", cursor: "pointer",
            boxShadow: savedToWorld ? "none" : `0 4px 18px ${PINK}77`,
            transition: "all 0.2s",
          }}>
            {savedToWorld ? "✓ SAVED TO MY WORLD" : "SAVE TO MY WORLD ♡"}
          </button>
        </div>
      </div>
    </div>
  );
}
