"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const BLUE  = "#1E4A8C";
const PINK  = "#FF1F7D";
const CREAM = "#FAF6F0";

// ── Real venue type ────────────────────────────────────────────────────────────
interface VenueDetail {
  id: string;
  name: string;
  location: string;
  tagline: string;
  about: string;
  avg_rating: number;
  bloom_notes: number;
  cover_url: string | null;
  photo_urls: string[];
  instagram: string;
  address: string;
  reviews: { author: string; text: string; rating: number }[];
}


const AVATAR_COLORS = ["#FF1F7D", "#FF69B4", "#A855F7", "#E87040", "#2E6B9E", "#D4A853"];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function Stars({ n, size = 12 }: { n: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= Math.round(n) ? PINK : "rgba(255,31,125,0.15)"}
          stroke={i <= Math.round(n) ? PINK : "rgba(255,31,125,0.25)"}
          strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  );
}

function PaperClip() {
  return (
    <svg width="22" height="56" viewBox="0 0 22 56">
      <path d="M11 2 C7.5 2 3.5 5 3.5 10 L3.5 44 C3.5 50 7 55 11 55 C15 55 18.5 50 18.5 44 L18.5 13 C18.5 9.5 16 7.5 13.5 7.5 C11 7.5 8.5 9.5 8.5 12.5 L8.5 43 C8.5 46 10 48 11 48 C12 48 14 46 14 43 L14 15"
        fill="none" stroke="#B0A898" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

function CertifiedSeal() {
  return (
    <svg width="54" height="54" viewBox="0 0 54 54">
      <circle cx="27" cy="27" r="25" fill={BLUE}/>
      <circle cx="27" cy="27" r="21" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1" strokeDasharray="3 2"/>
      <defs>
        <path id="cp" d="M27,27 m-16,0 a16,16 0 1,1 32,0 a16,16 0 1,1 -32,0"/>
      </defs>
      <text fill="rgba(255,255,255,0.75)" fontSize="4.5" fontWeight="700" letterSpacing="1.8" fontFamily="sans-serif">
        <textPath href="#cp" startOffset="5%">BLOOMBAY CERTIFIED · BLOOM ·</textPath>
      </text>
      <text x="27" y="24" textAnchor="middle" fill="white" fontSize="9" fontWeight="900" fontFamily="Georgia,serif" fontStyle="italic">BB</text>
      <text x="27" y="33" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="5" fontWeight="700" fontFamily="sans-serif">✦</text>
    </svg>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function VenuePage() {
  const params = useParams<{ id: string }>();
  const [saved, setSaved] = useState(false);
  const [venue, setVenue] = useState<VenueDetail | null>(null);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/venues/${params.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setVenue(data); })
      .catch(() => {});
  }, [params.id]);

  const name       = venue?.name ?? "";
  const location   = venue?.location ?? "";
  const tagline    = venue?.tagline ?? "";
  const about      = venue?.about ?? "";
  const rating     = venue?.avg_rating ?? 0;
  const bloomNotes = venue?.bloom_notes ?? 0;
  const heroImg    = venue?.cover_url ?? null;
  const address    = venue?.address ?? "";
  const instagram  = venue?.instagram ?? "";
  const moreImgs   = venue?.photo_urls?.slice(0, 3) ?? [];
  const displayReviews = (venue?.reviews ?? []).map((r, i) => ({
    name: r.author, initial: r.author[0] ?? "?", color: AVATAR_COLORS[i % AVATAR_COLORS.length], rating: r.rating, text: r.text,
  }));

  const PAPER_TEX = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='80' height='80' filter='url(%23n)' opacity='0.04'/></svg>")`;
  const LINED     = "repeating-linear-gradient(transparent, transparent 23px, rgba(0,0,0,0.05) 24px)";

  if (!params.id) return null;

  if (!venue && params.id) {
    return (
      <div style={{ minHeight: "100vh", background: CREAM, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <Link href="/member/city/places" style={{ marginBottom: 20, color: PINK, fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700 }}>← Back to places</Link>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 20, color: "#999" }}>Venue not found.</p>
      </div>
    );
  }

  return (
    <div style={{ background: CREAM, backgroundImage: PAPER_TEX, minHeight: "100vh", paddingBottom: 104 }}>

      {/* ── TOP BAR ───────────────────────────────────────────────────── */}
      <div style={{ position: "relative", padding: "52px 18px 18px", background: "white" }}>

        {/* Paper clip decoration */}
        <div style={{ position: "absolute", top: -6, right: 32, zIndex: 10 }}>
          <PaperClip />
        </div>

        {/* Back + branding row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/member/city/places"
              style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </Link>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", color: BLUE }}>BLOOMBAY</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* BLOOM APPROVED ribbon */}
            <div style={{ padding: "5px 11px", borderRadius: 999, background: "#FFF0F7", border: `1px solid ${PINK}33` }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK, whiteSpace: "nowrap" }}>I BLOOM APPROVED ♡</p>
            </div>
            <CertifiedSeal />
          </div>
        </div>

        {/* Venue name */}
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(30px, 11.5vw, 46px)", fontWeight: 900, fontStyle: "italic", color: BLUE, lineHeight: 0.92, letterSpacing: "-0.02em", marginBottom: 7 }}>
          {name}
        </h1>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "#999", marginBottom: 8 }}>{location}</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "#666", lineHeight: 1.45, maxWidth: 280 }}>{tagline} ♡</p>
      </div>

      {/* ── HERO PHOTO ───────────────────────────────────────────────── */}
      <div style={{ position: "relative" }}>
        <div style={{ height: 230, background: `linear-gradient(155deg, #1A3464 0%, #2650A0 65%, #4476C8 100%)`, overflow: "hidden", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImg ?? undefined} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.72, mixBlendMode: "luminosity" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(20,48,100,0.25) 0%, rgba(20,48,100,0.6) 100%)" }} />
        </div>

        {/* Bloom Notes counter — overlapping card */}
        <div style={{ position: "absolute", top: 14, right: 14, background: "white", borderRadius: 16, padding: "10px 14px", boxShadow: "0 6px 20px rgba(0,0,0,0.18)", textAlign: "center", minWidth: 80 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 34, fontWeight: 900, color: BLUE, lineHeight: 1 }}>{bloomNotes}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.18em", color: "#bbb", marginTop: 2 }}>BLOOM NOTES</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: PINK, marginTop: 3 }}>See all →</p>
        </div>
      </div>

      {/* ── RATING ───────────────────────────────────────────────────── */}
      <div style={{ padding: "20px 18px 8px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "#bbb", marginBottom: 6 }}>BLOOMIES RATED</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 44, fontWeight: 900, color: BLUE, lineHeight: 1 }}>{rating > 0 ? rating : "—"}</p>
          <div>
            {rating > 0 && <Stars n={rating} size={15} />}
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#aaa", marginTop: 3 }}>
              {bloomNotes > 0 ? `LOVED BY ${bloomNotes.toLocaleString()} WOMEN` : "CURATED BY BLOOMIES"}
            </p>
          </div>
        </div>
      </div>


      {/* ── ABOUT ────────────────────────────────────────────────────── */}
      <div style={{ margin: "14px 18px 0", background: "white", borderRadius: 20, padding: "16px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: BLUE, marginBottom: 8 }}>◉ ABOUT {name.toUpperCase()}</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontStyle: "italic", color: "#555", lineHeight: 1.65 }}>{about}</p>
          </div>
          {/* Building illustration placeholder */}
          <div style={{ width: 64, height: 80, flexShrink: 0, background: `${BLUE}0D`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="36" height="48" viewBox="0 0 36 48" fill="none">
              <rect x="4" y="16" width="28" height="32" fill={`${BLUE}22`} stroke={BLUE} strokeWidth="1.5"/>
              <polygon points="4,16 18,4 32,16" fill={`${BLUE}33`} stroke={BLUE} strokeWidth="1.5"/>
              <rect x="13" y="30" width="10" height="18" fill={`${BLUE}33`}/>
              <rect x="7" y="21" width="6" height="6" fill={`${BLUE}44`}/>
              <rect x="23" y="21" width="6" height="6" fill={`${BLUE}44`}/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── MORE FROM VENUE ───────────────────────────────────────────── */}
      <div style={{ marginTop: 20 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "#bbb", padding: "0 18px 10px" }}>MORE FROM {name.toUpperCase()}</p>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 18px 4px", scrollbarWidth: "none" }}>
          {moreImgs.map((img, i) => (
            <div key={i} style={{ flexShrink: 0, width: 130, height: 96, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 14px rgba(0,0,0,0.12)", transform: `rotate(${[-0.8, 0.5, -0.4][i]}deg)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── BLOOM PASSPORT ───────────────────────────────────────────── */}
      <div style={{ margin: "18px 18px 0", background: "white", borderRadius: 20, padding: "16px 18px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        {/* Passport stamp */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width="68" height="68" viewBox="0 0 68 68">
            <circle cx="34" cy="34" r="31" fill="none" stroke={BLUE} strokeWidth="2" strokeDasharray="5 2.5"/>
            <circle cx="34" cy="34" r="25" fill={`${BLUE}0E`}/>
            <defs>
              <path id="passportArc" d="M34,34 m-18,0 a18,18 0 1,1 36,0 a18,18 0 1,1 -36,0"/>
            </defs>
            <text fill={BLUE} fontSize="4.2" fontWeight="700" letterSpacing="1.5" fontFamily="sans-serif">
              <textPath href="#passportArc" startOffset="8%">BLOOM PASSPORT · VISITED ·</textPath>
            </text>
            <text x="34" y="31" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="900" fontFamily="Georgia,serif" fontStyle="italic">BB</text>
            <text x="34" y="40" textAnchor="middle" fill={`${BLUE}99`} fontSize="5.5" fontWeight="700" fontFamily="sans-serif" letterSpacing="0.5">LYRIA</text>
          </svg>
          {/* Green check */}
          <div style={{ position: "absolute", top: -2, right: -2, width: 22, height: 22, borderRadius: "50%", background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(34,197,94,0.4)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "#bbb", marginBottom: 4 }}>BLOOM PASSPORT</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: BLUE, lineHeight: 1.1, marginBottom: 4 }}>VISITED</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#aaa" }}>Added to your Bloom Passport</p>
        </div>
      </div>

      {/* ── WHAT BLOOMIES ARE SAYING ──────────────────────────────────── */}
      <div style={{ padding: "20px 18px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "#bbb", marginBottom: 14 }}>WHAT BLOOMIES ARE SAYING 🌸</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {displayReviews.map((rev, i) => (
            <div key={i} style={{ background: "white", borderRadius: 18, padding: "14px 14px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${rev.color}, ${rev.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "white", flexShrink: 0 }}>{rev.initial}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: "#111" }}>{rev.name}</p>
                    <Stars n={rev.rating} size={10} />
                  </div>
                </div>
              </div>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontStyle: "italic", color: "#555", lineHeight: 1.55 }}>{rev.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK INFO ───────────────────────────────────────────────── */}
      <div style={{ margin: "14px 18px 0", background: "white", borderRadius: 20, padding: "16px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "#bbb", marginBottom: 14 }}>QUICK INFO</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: "📍", text: address },
            { icon: "📸", text: instagram },
          ].filter(row => row.text).map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 17 }}>{icon}</span>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#444" }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SAVE TO MY WORLD (sticky bottom) ────────────────────────── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 18px", paddingBottom: "max(14px, env(safe-area-inset-bottom))", background: `linear-gradient(to top, ${CREAM} 60%, transparent)`, zIndex: 40 }}>
        <button onClick={() => setSaved(s => !s)}
          style={{
            width: "100%", padding: "15px", borderRadius: 999,
            background: saved ? "#111" : `linear-gradient(135deg, ${PINK}, #FF69B4)`,
            color: "white",
            fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800, letterSpacing: "0.07em",
            boxShadow: saved ? "0 4px 18px rgba(0,0,0,0.18)" : "0 6px 24px rgba(255,31,125,0.4)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.2s",
          }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "white" : "none"} stroke="white" strokeWidth="2.2" strokeLinecap="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          {saved ? "SAVED TO MY WORLD ✓" : "SAVE TO MY WORLD"}
        </button>
      </div>

    </div>
  );
}
