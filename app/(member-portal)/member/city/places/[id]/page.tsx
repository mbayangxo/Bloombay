"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const PINK  = "#FF1F7D";
const CREAM = "#FAF6F0";
const DARK  = "#111111";
const MUTED = "#888888";

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
  hours?: string;
  website?: string;
  is_partner?: boolean;
  reviews: { author: string; text: string; rating: number }[];
}

const AVATAR_COLORS = ["#FF1F7D","#A855F7","#E87040","#2E6B9E","#D4A853","#22C55E"];

const POLAROID_GRADIENTS = [
  "linear-gradient(135deg,#FFD6EA,#FFABD4)",
  "linear-gradient(135deg,#D4F0FF,#9BD4F7)",
  "linear-gradient(135deg,#FFF0C8,#FFD97A)",
  "linear-gradient(135deg,#D4E8FF,#A3C4F5)",
  "linear-gradient(135deg,#E8D4FF,#C4A0F0)",
];

const MOCK_NOTES = [
  { id: "1", author: "Amara K.", initial: "A", color: "#FF1F7D", text: "The oat milk latte here is genuinely life-changing. The barista remembered my name on the third visit ♡", time: "2h", gradient: POLAROID_GRADIENTS[0] },
  { id: "2", author: "Nadia L.", initial: "N", color: "#A855F7", text: "Best corner spot for your creative mornings. I wrote half my thesis proposal here", time: "1d", gradient: POLAROID_GRADIENTS[1] },
  { id: "3", author: "Zoe M.", initial: "Z", color: "#E87040", text: "Came for coffee stayed for the aesthetic. 10/10 would recommend for a solo date ✨", time: "3d", gradient: POLAROID_GRADIENTS[2] },
  { id: "4", author: "Kemi B.", initial: "K", color: "#2E6B9E", text: "Saturday mornings with a cold brew and a book. This is my happy place", time: "5d", gradient: POLAROID_GRADIENTS[3] },
];

type Tab = "overview" | "notes" | "photos" | "trail";

// ── HELPERS ───────────────────────────────────────────────────────────────────

function Stars({ n, size = 11 }: { n: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= Math.round(n) ? PINK : "rgba(255,31,125,0.12)"}
          stroke={i <= Math.round(n) ? PINK : "rgba(255,31,125,0.2)"}
          strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  );
}

function PolaroidNote({ note, index }: { note: typeof MOCK_NOTES[0]; index: number }) {
  const rotations = ["-1.2deg","1.4deg","-0.7deg","1.1deg"];
  return (
    <div style={{
      background: "white",
      padding: "7px 7px 20px",
      boxShadow: "0 5px 22px rgba(0,0,0,0.14)",
      borderRadius: 3,
      transform: `rotate(${rotations[index % 4]})`,
      flexShrink: 0,
      width: 168,
    }}>
      {/* Photo slot */}
      <div style={{ width: "100%", aspectRatio: "1", background: note.gradient, borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 12, overflow: "hidden" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.55)", lineHeight: 1.5, textAlign: "center" }}>{note.text}</p>
      </div>
      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, paddingTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: note.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "white", flexShrink: 0 }}>{note.initial}</div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: "#777" }}>{note.author}</p>
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "#bbb" }}>{note.time}</p>
      </div>
    </div>
  );
}

function PartnerBadge() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF0F7", border: `1px solid ${PINK}33`, borderRadius: 999, padding: "6px 14px", alignSelf: "flex-start" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill={PINK}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", color: PINK }}>BLOOM PARTNER</p>
    </div>
  );
}

// ── TABS ──────────────────────────────────────────────────────────────────────

function OverviewTab({ venue }: { venue: VenueDetail | null }) {
  if (!venue) return null;
  const moreImgs = venue.photo_urls?.slice(0, 3) ?? [];

  return (
    <div style={{ padding: "0 0 24px" }}>
      {/* About */}
      <div style={{ padding: "20px 18px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: MUTED, marginBottom: 10 }}>ABOUT</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontStyle: "italic", color: "#444", lineHeight: 1.7 }}>{venue.about}</p>
      </div>

      {/* Info chips */}
      <div style={{ padding: "20px 18px 0", display: "flex", flexWrap: "wrap", gap: 8 }}>
        {[
          { icon: "📍", label: venue.address },
          venue.hours && { icon: "🕐", label: venue.hours },
          venue.instagram && { icon: "📸", label: venue.instagram },
          venue.website && { icon: "🌐", label: venue.website },
        ].filter(Boolean).map((item, i) => {
          const row = item as { icon: string; label: string };
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, background: "white", borderRadius: 999, padding: "8px 14px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 13 }}>{row.icon}</span>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#555", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.label}</p>
            </div>
          );
        })}
      </div>

      {/* More photos strip */}
      {moreImgs.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: MUTED, padding: "0 18px 10px" }}>MORE FROM THIS PLACE</p>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 18px 4px", scrollbarWidth: "none" }}>
            {moreImgs.map((img, i) => (
              <div key={i} style={{ flexShrink: 0, width: 130, height: 96, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 14px rgba(0,0,0,0.1)", transform: `rotate(${[-0.7, 0.5, -0.4][i]}deg)` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partner card */}
      {venue.is_partner && (
        <div style={{ margin: "22px 18px 0", background: "white", borderRadius: 22, padding: "18px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${PINK}18` }}>
          <PartnerBadge />
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 17, fontWeight: 900, fontStyle: "italic", color: DARK, marginTop: 12, lineHeight: 1.25 }}>
            Exclusive for Bloomies
          </p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#777", marginTop: 6, lineHeight: 1.5 }}>
            Show your Bloom ID for members-only perks and early access drops
          </p>
          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <div style={{ flex: 1, background: `${PINK}0F`, borderRadius: 14, padding: "11px", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", color: PINK }}>10% OFF</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#888", marginTop: 2 }}>All drinks</p>
            </div>
            <div style={{ flex: 1, background: `${PINK}0F`, borderRadius: 14, padding: "11px", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", color: PINK }}>FREE</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#888", marginTop: 2 }}>Reserved spot</p>
            </div>
            <div style={{ flex: 1, background: `${PINK}0F`, borderRadius: 14, padding: "11px", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", color: PINK }}>DROPS</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#888", marginTop: 2 }}>Early access</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NotesTab({ venueName }: { venueName: string }) {
  return (
    <div style={{ padding: "20px 0 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px 14px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: MUTED }}>
          BLOOM NOTES FROM {venueName.toUpperCase()}
        </p>
        <button style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK, background: "none", border: "none", cursor: "pointer" }}>
          + Leave a note
        </button>
      </div>

      {/* Horizontal polaroid scroll */}
      <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "8px 18px 24px", scrollbarWidth: "none" }}>
        {MOCK_NOTES.map((note, i) => (
          <PolaroidNote key={note.id} note={note} index={i} />
        ))}
      </div>

      {/* Vertical list continuation */}
      <div style={{ padding: "4px 18px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {MOCK_NOTES.slice(0, 3).map((note, i) => (
          <div key={`list-${i}`} style={{ background: "white", borderRadius: 18, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${note.color}, ${note.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white", flexShrink: 0 }}>{note.initial}</div>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: DARK }}>{note.author}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#bbb" }}>{note.time} ago</p>
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontStyle: "italic", color: "#555", lineHeight: 1.6 }}>{note.text}</p>
            <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: MUTED, display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                Flower
              </button>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: MUTED, display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhotosTab({ venue }: { venue: VenueDetail | null }) {
  const photos = venue?.photo_urls ?? [];
  if (photos.length === 0) {
    return (
      <div style={{ padding: "40px 18px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "#bbb" }}>No photos yet — be the first ♡</p>
      </div>
    );
  }
  return (
    <div style={{ padding: "18px 18px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {photos.map((p, i) => (
          <div key={i} style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "1", background: "#f0ede8" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TrailTab({ venueName }: { venueName: string }) {
  const trailWomen = [
    { name: "Amara K.", initial: "A", color: "#FF1F7D", also: "Cafe Selin, Cha Cha Matcha" },
    { name: "Zoe M.", initial: "Z", color: "#E87040", also: "Sunday in Brooklyn, Blank Street" },
    { name: "Nadia L.", initial: "N", color: "#A855F7", also: "Partners Coffee, Devoción" },
  ];

  return (
    <div style={{ padding: "20px 0 24px" }}>
      <div style={{ padding: "0 18px 16px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: MUTED, marginBottom: 4 }}>FOLLOW HER TRAIL</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#888" }}>Women who love {venueName} also love</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 18px" }}>
        {trailWomen.map((w, i) => (
          <div key={i} style={{ background: "white", borderRadius: 18, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${w.color}, ${w.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "white", flexShrink: 0 }}>{w.initial}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: DARK }}>{w.name}</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#999", marginTop: 2 }}>also goes to: {w.also}</p>
            </div>
            <button style={{ width: 30, height: 30, borderRadius: "50%", background: `${PINK}12`, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        ))}
      </div>

      {/* Bloom Passport stamp */}
      <div style={{ margin: "22px 18px 0", background: "white", borderRadius: 22, padding: "18px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 16 }}>
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="28" fill="none" stroke={PINK} strokeWidth="1.5" strokeDasharray="4 2"/>
          <circle cx="30" cy="30" r="22" fill={`${PINK}0A`}/>
          <defs><path id="pa" d="M30,30 m-15,0 a15,15 0 1,1 30,0 a15,15 0 1,1 -30,0"/></defs>
          <text fill={PINK} fontSize="4" fontWeight="700" letterSpacing="1.5" fontFamily="sans-serif">
            <textPath href="#pa" startOffset="6%">BLOOM PASSPORT · VISITED ·</textPath>
          </text>
          <text x="30" y="27" textAnchor="middle" fill={PINK} fontSize="8" fontWeight="900" fontFamily="Georgia,serif" fontStyle="italic">BB</text>
          <text x="30" y="36" textAnchor="middle" fill={`${PINK}88`} fontSize="5" fontWeight="700" fontFamily="sans-serif">✦</text>
        </svg>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: MUTED, marginBottom: 4 }}>BLOOM PASSPORT</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.1 }}>VISITED</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#aaa", marginTop: 2 }}>Added to your Bloom Passport</p>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────

export default function VenuePage() {
  const params = useParams<{ id: string }>();
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [venue, setVenue] = useState<VenueDetail | null>(null);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/venues/${params.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setVenue(data); })
      .catch(() => {});
  }, [params.id]);

  const name      = venue?.name ?? "";
  const location  = venue?.location ?? "";
  const tagline   = venue?.tagline ?? "";
  const rating    = venue?.avg_rating ?? 0;
  const noteCount = venue?.bloom_notes ?? 0;
  const heroImg   = venue?.cover_url ?? null;

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview", label: "OVERVIEW" },
    { id: "notes",    label: `NOTES ${noteCount > 0 ? `(${noteCount})` : ""}` },
    { id: "photos",   label: "PHOTOS" },
    { id: "trail",    label: "HER TRAIL" },
  ];

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
    <div style={{ background: CREAM, minHeight: "100vh", paddingBottom: 104 }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", height: 280 }}>
        {/* Cover photo */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(155deg, #1A1A1A, #3A3A3A)", overflow: "hidden" }}>
          {heroImg && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImg} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%)" }} />
        </div>

        {/* Top nav */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "52px 18px 0", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10 }}>
          <Link href="/member/city/places"
            style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <button onClick={() => setSaved(s => !s)}
            style={{ width: 36, height: 36, borderRadius: "50%", background: saved ? PINK : "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "white" : "none"} stroke="white" strokeWidth="2.2" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Venue name on hero */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 20px 20px", zIndex: 10 }}>
          {venue?.is_partner && <PartnerBadge />}
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px, 10vw, 42px)", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 0.95, letterSpacing: "-0.02em", marginTop: 8, marginBottom: 5 }}>
            {name}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>{location}</p>
            {rating > 0 && (
              <>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>·</span>
                <Stars n={rating} size={11} />
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)" }}>{rating.toFixed(1)}</p>
              </>
            )}
          </div>
          {tagline && (
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4, lineHeight: 1.4 }}>{tagline} ♡</p>
          )}
        </div>

        {/* Notes counter bubble */}
        {noteCount > 0 && (
          <div style={{ position: "absolute", top: 52, right: 65, background: "white", borderRadius: 14, padding: "8px 12px", boxShadow: "0 6px 20px rgba(0,0,0,0.2)", textAlign: "center", zIndex: 10 }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 900, color: PINK, lineHeight: 1 }}>{noteCount}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.18em", color: "#bbb", marginTop: 1 }}>BLOOM NOTES</p>
          </div>
        )}
      </div>

      {/* ── TAB BAR ───────────────────────────────────────────────────────── */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                flex: "0 0 auto",
                padding: "14px 16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-jost)",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: tab === t.id ? PINK : "#bbb",
                borderBottom: tab === t.id ? `2px solid ${PINK}` : "2px solid transparent",
                whiteSpace: "nowrap",
                transition: "color 0.2s",
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ───────────────────────────────────────────────────── */}
      {tab === "overview" && <OverviewTab venue={venue} />}
      {tab === "notes"    && <NotesTab venueName={name} />}
      {tab === "photos"   && <PhotosTab venue={venue} />}
      {tab === "trail"    && <TrailTab venueName={name} />}

      {/* ── STICKY BOTTOM CTA ─────────────────────────────────────────────── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 18px", paddingBottom: "max(14px, env(safe-area-inset-bottom))", background: `linear-gradient(to top, ${CREAM} 60%, transparent)`, zIndex: 40 }}>
        <button onClick={() => setSaved(s => !s)}
          style={{
            width: "100%", padding: "15px", borderRadius: 999,
            background: saved ? DARK : `linear-gradient(135deg, ${PINK}, #FF69B4)`,
            color: "white",
            fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800, letterSpacing: "0.07em",
            boxShadow: saved ? "0 4px 18px rgba(0,0,0,0.18)" : `0 6px 24px ${PINK}55`,
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all 0.2s",
          }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? "white" : "none"} stroke="white" strokeWidth="2.2" strokeLinecap="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          {saved ? "SAVED TO MY WORLD ✓" : "SAVE TO MY WORLD"}
        </button>
      </div>

    </div>
  );
}
