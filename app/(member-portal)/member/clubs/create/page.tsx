"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { uploadClubCover } from "@/lib/storage/upload";

const PINK = "#FF1F7D";

const CLUB_CATEGORIES = [
  "Dining & Food", "Arts & Culture", "Books & Ideas", "Wellness & Movement",
  "Social & Lifestyle", "Travel & Adventure", "Career & Growth", "Community Service",
];


const FREQUENCIES = ["Weekly", "Bi-weekly", "Monthly", "Bi-monthly", "As needed"];

const MEMBERSHIP_TYPES = [
  { id: "open",    label: "Open",         desc: "Any BloomBay member can join",           emoji: "🌐" },
  { id: "curated", label: "Curated",      desc: "You review and approve each member",     emoji: "✦" },
  { id: "invite",  label: "Invite-Only",  desc: "You personally invite each woman",       emoji: "🔒" },
];

// ─── Club Crest Generator ─────────────────────────────────────────────────────

export type CrestShape   = "shield" | "circle" | "hexagon" | "rounded" | "diamond";
export type CrestSymbol  = "initials" | "crown" | "star" | "moon" | "diamond" | "rose" | "heart" | "flame";
export type CrestPattern = "solid" | "gradient" | "split" | "dark";

const CREST_SHAPES: { id: CrestShape; label: string }[] = [
  { id: "rounded",  label: "Square"  },
  { id: "circle",   label: "Circle"  },
  { id: "shield",   label: "Shield"  },
  { id: "hexagon",  label: "Hexagon" },
  { id: "diamond",  label: "Diamond" },
];

const CREST_SYMBOLS: { id: CrestSymbol; glyph: string }[] = [
  { id: "initials", glyph: "AB" },
  { id: "crown",    glyph: "♛"  },
  { id: "star",     glyph: "✦"  },
  { id: "moon",     glyph: "☾"  },
  { id: "diamond",  glyph: "◆"  },
  { id: "rose",     glyph: "❋"  },
  { id: "heart",    glyph: "♡"  },
  { id: "flame",    glyph: "🔥" },
];

const CREST_PATTERNS: { id: CrestPattern; label: string }[] = [
  { id: "solid",    label: "Solid"    },
  { id: "gradient", label: "Gradient" },
  { id: "split",    label: "Split"    },
  { id: "dark",     label: "Dark"     },
];

const PRESET_COLORS = [
  "#FF1F7D", "#C8006A", "#E07040", "#D4A358", "#4A8070",
  "#5B21B6", "#0EA5E9", "#1C1B1C", "#D97706", "#2D6A4F",
];

function ClubCrest({
  name, color, size = 88,
  shape = "rounded", symbol = "initials", pattern = "solid",
}: {
  name: string; color: string; size?: number;
  shape?: CrestShape; symbol?: CrestSymbol; pattern?: CrestPattern;
}) {
  const words  = name.trim().split(/\s+/);
  const inits  = words.slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("") || "BB";
  const glyph  = symbol === "initials" ? (inits || "✦") : (CREST_SYMBOLS.find(s => s.id === symbol)?.glyph ?? inits);
  const isEmoji = symbol === "flame";

  const bg =
    pattern === "gradient" ? `linear-gradient(135deg, ${color}, ${color}88)` :
    pattern === "split"    ? `linear-gradient(135deg, ${color} 50%, ${color}44 50%)` :
    pattern === "dark"     ? `radial-gradient(circle at 35% 35%, ${color}CC, #0A0008)` :
    `${color}18`;

  const border =
    pattern === "dark" ? `2px solid ${color}44` :
    pattern === "gradient" ? `2px solid ${color}` :
    `2px solid ${color}55`;

  const textColor =
    pattern === "gradient" ? "white" :
    pattern === "dark"     ? color :
    color;

  const clipPath =
    shape === "shield"  ? "polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)" :
    shape === "hexagon" ? "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" :
    shape === "diamond" ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" :
    undefined;

  const borderRadius =
    shape === "circle"  ? "50%" :
    shape === "rounded" ? Math.round(size * 0.22) :
    0;

  return (
    <div style={{
      width: size, height: size,
      borderRadius,
      clipPath,
      background: bg,
      border: clipPath ? "none" : border,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 8px 32px ${color}40`,
      flexShrink: 0,
      position: "relative",
      overflow: "hidden",
    }}>
      {pattern === "split" && (
        <div style={{ position: "absolute", inset: 0, background: `${color}44`, clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)", pointerEvents: "none" }} />
      )}
      <span style={{
        fontFamily: isEmoji ? undefined : "var(--font-playfair)",
        fontWeight: 900, fontStyle: isEmoji ? undefined : "italic",
        fontSize: isEmoji ? Math.round(size * 0.38) : Math.round(size * 0.34),
        color: textColor, lineHeight: 1,
        letterSpacing: symbol === "initials" ? "-0.02em" : 0,
        userSelect: "none", position: "relative", zIndex: 1,
      }}>
        {glyph}
      </span>
    </div>
  );
}

function CrestPicker({
  name, color, shape, symbol, pattern,
  onShape, onSymbol, onPattern, onColor,
}: {
  name: string; color: string; shape: CrestShape; symbol: CrestSymbol; pattern: CrestPattern;
  onShape: (s: CrestShape) => void; onSymbol: (s: CrestSymbol) => void;
  onPattern: (p: CrestPattern) => void; onColor: (c: string) => void;
}) {
  const colorInputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ background: "white", borderRadius: 18, padding: "16px 16px 12px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", marginBottom: 20 }}>
      {/* Big crest preview */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <ClubCrest name={name} color={color} size={96} shape={shape} symbol={symbol} pattern={pattern} />
      </div>

      {/* Color presets + custom */}
      <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.14em", color: "#AAA", marginBottom: 8 }}>COLOR</p>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
        {PRESET_COLORS.map(c => (
          <button key={c} onClick={() => onColor(c)} style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: color === c ? `3px solid ${c}` : "2px solid transparent", outline: color === c ? "2px solid white" : "none", cursor: "pointer", boxShadow: color === c ? `0 2px 10px ${c}66` : "none", transition: "all 0.14s" }} />
        ))}
        <button onClick={() => colorInputRef.current?.click()} style={{ width: 26, height: 26, borderRadius: "50%", background: "conic-gradient(from 0deg, red, yellow, green, cyan, blue, magenta, red)", border: "none", cursor: "pointer" }} />
        <input ref={colorInputRef} type="color" value={color} onChange={e => onColor(e.target.value)} style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0 }} />
      </div>

      {/* Shape */}
      <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.14em", color: "#AAA", marginBottom: 8 }}>SHAPE</p>
      <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
        {CREST_SHAPES.map(s => (
          <button key={s.id} onClick={() => onShape(s.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: 8, border: `1.5px solid ${shape === s.id ? color : "#E8E4DC"}`, background: shape === s.id ? `${color}12` : "white", color: shape === s.id ? color : "#888", fontSize: 8, fontWeight: 700, cursor: "pointer", transition: "all 0.14s" }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Symbol */}
      <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.14em", color: "#AAA", marginBottom: 8 }}>SYMBOL</p>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
        {CREST_SYMBOLS.map(s => (
          <button key={s.id} onClick={() => onSymbol(s.id)} style={{ width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${symbol === s.id ? color : "#E8E4DC"}`, background: symbol === s.id ? `${color}12` : "white", color: symbol === s.id ? color : "#888", fontSize: s.id === "initials" ? 8 : 14, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.14s" }}>
            {s.id === "initials" ? "Aa" : s.glyph}
          </button>
        ))}
      </div>

      {/* Pattern */}
      <p style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.14em", color: "#AAA", marginBottom: 8 }}>FILL</p>
      <div style={{ display: "flex", gap: 7 }}>
        {CREST_PATTERNS.map(p => (
          <button key={p.id} onClick={() => onPattern(p.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: 8, border: `1.5px solid ${pattern === p.id ? color : "#E8E4DC"}`, background: pattern === p.id ? `${color}12` : "white", color: pattern === p.id ? color : "#888", fontSize: 8, fontWeight: 700, cursor: "pointer", transition: "all 0.14s" }}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CreateClubPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newClubId, setNewClubId] = useState<string | null>(null);
  const [newClubSlug, setNewClubSlug] = useState<string | null>(null);

  // Step 1 — Name & Look
  const [clubName, setClubName] = useState("");
  const [accentColor, setAccentColor] = useState(PINK);
  const [crestShape,   setCrestShape]   = useState<CrestShape>("rounded");
  const [crestSymbol,  setCrestSymbol]  = useState<CrestSymbol>("initials");
  const [crestPattern, setCrestPattern] = useState<CrestPattern>("solid");
  const [clubPhoto, setClubPhoto] = useState<File | null>(null);
  const [clubPhotoPreview, setClubPhotoPreview] = useState<string | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Step 2 — Story
  const [category, setCategory] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");

  // Step 3 — Launch
  const [capacity, setCapacity] = useState("12");
  const [membershipType, setMembershipType] = useState("");
  const [launchMode, setLaunchMode] = useState<"live" | "draft">("live");

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setClubPhoto(file);
    const reader = new FileReader();
    reader.onload = ev => setClubPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function canNext(): boolean {
    if (step === 1) return clubName.trim().length >= 2;
    if (step === 2) return !!category && neighborhood.trim().length >= 2 && description.trim().length >= 20 && !!frequency;
    if (step === 3) return !!membershipType;
    return false;
  }

  async function handleSubmit() {
    if (!canNext() || creating) return;
    setCreating(true);
    setCreateError(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to create a club.");

      const { data: newClub, error } = await supabase
        .from("clubs")
        .insert({
          name: clubName,
          description,
          primary_color: accentColor,
          category,
          neighborhood,
          frequency,
          member_limit: capacity === "50+" ? null : parseInt(capacity, 10),
          membership_type: membershipType,
          owner_id: user.id,
          ...(launchMode === "draft" ? { status: "draft" } : {}),
        })
        .select("id, slug")
        .single();

      if (error) throw error;

      if (clubPhoto && newClub) {
        try {
          const url = await uploadClubCover(clubPhoto, newClub.id);
          await supabase.from("clubs").update({ cover_url: url }).eq("id", newClub.id);
        } catch {
          // Photo upload failed — club still created, non-fatal
        }
      }

      if (newClub) {
        setNewClubId(newClub.id);
        setNewClubSlug(newClub.slug ?? newClub.id);
      }
      setSubmitted(true);
    } catch (err) {
      const msg = (err as { message?: string })?.message || "Failed to create club. Please try again.";
      setCreateError(msg);
    } finally {
      setCreating(false);
    }
  }

  // ── Success ─────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ background: "#F6F1EB", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
        <div style={{ maxWidth: 320, width: "100%", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            {clubPhotoPreview ? (
              <div style={{ width: 96, height: 96, borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={clubPhotoPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <ClubCrest name={clubName} color={accentColor} size={96} />
            )}
          </div>
          <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.28em", color: accentColor, marginBottom: 10 }}>
            CLUB CREATED
          </p>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: "#111", lineHeight: 1.2, marginBottom: 10 }}>
            {launchMode === "draft" ? `${clubName} is saved.` : `${clubName} is live.`}
          </h2>
          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.65, marginBottom: 28, fontStyle: "italic", fontFamily: "var(--font-playfair)" }}>
            {launchMode === "draft"
              ? "Your club is saved as a draft. Design it, then make it live when you're ready."
              : "Your club is now visible to BloomBay members. Start inviting women and hosting gatherings."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {newClubId && (
              <Link
                href={`/member/clubs/${newClubSlug ?? newClubId}/design`}
                style={{ display: "block", padding: "15px", borderRadius: 16, background: accentColor, color: "white", textDecoration: "none", fontSize: 13, fontWeight: 800, textAlign: "center" }}
              >
                Continue to Design Studio →
              </Link>
            )}
            <Link
              href="/member/clubs"
              style={{ display: "block", padding: "14px", borderRadius: 16, background: launchMode === "draft" ? "white" : accentColor, color: launchMode === "draft" ? "rgba(0,0,0,0.5)" : "white", border: launchMode === "draft" ? "1.5px solid rgba(0,0,0,0.1)" : "none", textDecoration: "none", fontSize: 13, fontWeight: 700, textAlign: "center" }}
            >
              {launchMode === "draft" ? "Go Live Now →" : "View All Clubs"}
            </Link>
            <Link href="/member/apply-club-mama" style={{ display: "block", padding: "14px", borderRadius: 16, background: "#111", color: PINK, textDecoration: "none", fontSize: 13, fontWeight: 700, textAlign: "center" }}>
              Apply for Club Mama Stipend ✦
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F6F1EB", minHeight: "100vh", paddingBottom: 120 }}>

      {/* Header */}
      <div style={{ background: "#111111", padding: "calc(env(safe-area-inset-top, 0px) + 56px) 20px 28px", position: "relative" }}>
        <Link href="/member/clubs" style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 56px)", left: 20, display: "flex", alignItems: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Link>

        <div style={{ textAlign: "center", paddingTop: 32 }}>
          <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.28em", color: PINK, marginBottom: 8 }}>
            ✦ START A CLUB
          </p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(22px, 6vw, 28px)", fontWeight: 900, fontStyle: "italic", color: clubName ? "white" : "rgba(255,255,255,0.35)", lineHeight: 1.1, transition: "color 0.2s" }}>
            {clubName || "Name your club"}
          </h1>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-playfair)", fontStyle: "italic", marginTop: 6 }}>
            {step === 1 && "Name it. Brand it. Make it yours."}
            {step === 2 && "Tell women what to expect."}
            {step === 3 && "Set how women join, then launch."}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: 6, padding: "16px 20px 0" }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: 3, borderRadius: 99, background: s <= step ? accentColor : "rgba(0,0,0,0.1)", transition: "background 0.3s" }} />
        ))}
      </div>

      <div style={{ padding: "20px 20px 0" }}>

        {/* ── STEP 1: Name & Look ── */}
        {step === 1 && (
          <div style={{ animation: "fadeSlide 0.22s ease-out" }}>
            <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.25)", marginBottom: 20 }}>
              STEP 1 OF 3 · NAME & LOOK
            </p>

            {/* Crest generator */}
            {!clubPhotoPreview && (
              <CrestPicker
                name={clubName} color={accentColor}
                shape={crestShape} symbol={crestSymbol} pattern={crestPattern}
                onShape={setCrestShape} onSymbol={setCrestSymbol}
                onPattern={setCrestPattern} onColor={setAccentColor}
              />
            )}

            {/* Photo upload (optional) */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
              {clubPhotoPreview && (
                <div style={{ position: "relative", marginBottom: 14 }}>
                  <div style={{ width: 96, height: 96, borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={clubPhotoPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <button
                    onClick={() => { setClubPhoto(null); setClubPhotoPreview(null); }}
                    style={{ position: "absolute", top: -8, right: -8, width: 26, height: 26, borderRadius: "50%", background: "#ef4444", border: "2.5px solid #F6F1EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
                    </svg>
                  </button>
                </div>
              )}
              <button
                onClick={() => photoInputRef.current?.click()}
                style={{ padding: "8px 18px", borderRadius: 999, background: "white", border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "10px", fontWeight: 700, color: "#555", cursor: "pointer", letterSpacing: "0.06em", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                {clubPhotoPreview ? "Change Photo" : "Upload a Photo Instead"}
              </button>
            </div>

            {/* Club name */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.15em", color: "rgba(0,0,0,0.3)", marginBottom: 8 }}>CLUB NAME *</p>
              <input
                value={clubName}
                onChange={e => setClubName(e.target.value)}
                placeholder="e.g. Sunday Book Girls"
                style={{
                  width: "100%", borderRadius: 18,
                  padding: "16px 18px",
                  fontSize: 20, fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700,
                  color: "#111", caretColor: accentColor,
                  background: "white", outline: "none",
                  border: `1.5px solid ${clubName.trim().length >= 2 ? `${accentColor}55` : "rgba(0,0,0,0.08)"}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  boxSizing: "border-box",
                }}
              />
            </div>

          </div>
        )}

        {/* ── STEP 2: Story ── */}
        {step === 2 && (
          <div style={{ animation: "fadeSlide 0.22s ease-out" }}>
            <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.25)", marginBottom: 20 }}>
              STEP 2 OF 3 · STORY
            </p>

            {/* Mini club badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: `${accentColor}0E`, border: `1px solid ${accentColor}22`, borderRadius: 18, padding: "12px 16px", marginBottom: 20 }}>
              {clubPhotoPreview ? (
                <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={clubPhotoPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <ClubCrest name={clubName} color={accentColor} size={44} />
              )}
              <p style={{ fontSize: 14, fontWeight: 800, fontFamily: "var(--font-playfair)", fontStyle: "italic", color: "#111" }}>{clubName}</p>
            </div>

            {/* Category */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.15em", color: "rgba(0,0,0,0.3)", marginBottom: 10 }}>CATEGORY *</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CLUB_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    style={{ padding: "9px 14px", borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: "pointer", background: category === cat ? `${accentColor}15` : "rgba(0,0,0,0.04)", border: `1.5px solid ${category === cat ? accentColor : "rgba(0,0,0,0.07)"}`, color: category === cat ? accentColor : "rgba(0,0,0,0.45)" }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Neighborhood */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.15em", color: "rgba(0,0,0,0.3)", marginBottom: 8 }}>NEIGHBORHOOD / CITY *</p>
              <input
                value={neighborhood}
                onChange={e => setNeighborhood(e.target.value)}
                placeholder="e.g. Brooklyn, Williamsburg"
                style={{ width: "100%", borderRadius: 16, padding: "14px 16px", fontSize: 14, color: "#111", caretColor: accentColor, background: "white", outline: "none", border: `1.5px solid ${neighborhood.trim().length >= 2 ? `${accentColor}44` : "rgba(0,0,0,0.08)"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", boxSizing: "border-box" }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.15em", color: "rgba(0,0,0,0.3)", marginBottom: 8 }}>DESCRIPTION *</p>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Who is this club for? What's the vibe? What happens at your meetups?"
                rows={4}
                style={{ width: "100%", borderRadius: 16, padding: "14px 16px", fontSize: 14, color: "#111", caretColor: accentColor, background: "white", outline: "none", resize: "none", lineHeight: 1.65, border: `1.5px solid ${description.length >= 20 ? `${accentColor}44` : "rgba(0,0,0,0.08)"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", boxSizing: "border-box" }}
              />
              <p style={{ fontSize: "9px", textAlign: "right", marginTop: 4, color: description.length >= 20 ? `${accentColor}99` : "rgba(0,0,0,0.2)" }}>
                {description.length} chars {description.length < 20 ? `(${20 - description.length} more)` : "✓"}
              </p>
            </div>

            {/* Frequency */}
            <div style={{ marginBottom: 8 }}>
              <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.15em", color: "rgba(0,0,0,0.3)", marginBottom: 10 }}>HOW OFTEN DO YOU MEET? *</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {FREQUENCIES.map(f => (
                  <button key={f} onClick={() => setFrequency(f)}
                    style={{ padding: "10px 16px", borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: "pointer", background: frequency === f ? `${accentColor}15` : "rgba(0,0,0,0.04)", border: `1.5px solid ${frequency === f ? accentColor : "rgba(0,0,0,0.07)"}`, color: frequency === f ? accentColor : "rgba(0,0,0,0.45)" }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Launch ── */}
        {step === 3 && (
          <div style={{ animation: "fadeSlide 0.22s ease-out" }}>
            <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.25)", marginBottom: 20 }}>
              STEP 3 OF 3 · LAUNCH
            </p>

            {/* Membership type */}
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.15em", color: "rgba(0,0,0,0.3)", marginBottom: 10 }}>HOW DO WOMEN JOIN? *</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {MEMBERSHIP_TYPES.map(mt => (
                  <button key={mt.id} onClick={() => setMembershipType(mt.id)}
                    style={{ display: "flex", alignItems: "flex-start", gap: 12, borderRadius: 20, padding: 16, textAlign: "left", cursor: "pointer", background: membershipType === mt.id ? `${accentColor}10` : "white", border: `1.5px solid ${membershipType === mt.id ? accentColor : "rgba(0,0,0,0.07)"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: membershipType === mt.id ? `${accentColor}18` : "rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {mt.emoji}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: membershipType === mt.id ? accentColor : "#111", marginBottom: 2 }}>{mt.label}</p>
                      <p style={{ fontSize: 11, color: "#aaa" }}>{mt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity */}
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.15em", color: "rgba(0,0,0,0.3)", marginBottom: 10 }}>MAX MEMBERS</p>
              <div style={{ display: "flex", gap: 8 }}>
                {["8", "12", "20", "30", "50+"].map(n => (
                  <button key={n} onClick={() => setCapacity(n)}
                    style={{ flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: "pointer", background: capacity === n ? `${accentColor}15` : "rgba(0,0,0,0.04)", border: `1.5px solid ${capacity === n ? accentColor : "rgba(0,0,0,0.07)"}`, color: capacity === n ? accentColor : "rgba(0,0,0,0.4)" }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview card */}
            {membershipType && (
              <div style={{ background: "#111", borderRadius: 20, overflow: "hidden", marginBottom: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", animation: "fadeSlide 0.2s ease-out" }}>
                <div style={{ height: 4, background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}55 100%)` }} />
                <div style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                    {clubPhotoPreview ? (
                      <div style={{ width: 52, height: 52, borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={clubPhotoPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ) : (
                      <ClubCrest name={clubName} color={accentColor} size={52} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "rgba(255,238,220,0.92)", lineHeight: 1.1 }}>
                        {clubName}
                      </p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>
                        {category}{neighborhood ? ` · ${neighborhood}` : ""}
                      </p>
                    </div>
                  </div>
                  {description && (
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 12, fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
                      &ldquo;{description.slice(0, 100)}{description.length > 100 ? "…" : ""}&rdquo;
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {frequency && <span style={{ fontSize: "9px", fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: `${accentColor}22`, color: accentColor }}>{frequency}</span>}
                    <span style={{ fontSize: "9px", fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}>Max {capacity} members</span>
                    <span style={{ fontSize: "9px", fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }}>{MEMBERSHIP_TYPES.find(m => m.id === membershipType)?.label}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Launch mode */}
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.15em", color: "rgba(0,0,0,0.3)", marginBottom: 10 }}>HOW DO YOU WANT TO LAUNCH?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={() => setLaunchMode("live")}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, borderRadius: 20, padding: 16, textAlign: "left", cursor: "pointer", background: launchMode === "live" ? `${accentColor}10` : "white", border: `1.5px solid ${launchMode === "live" ? accentColor : "rgba(0,0,0,0.07)"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: launchMode === "live" ? `${accentColor}18` : "rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    🌐
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: launchMode === "live" ? accentColor : "#111", marginBottom: 2 }}>Launch Live Now</p>
                    <p style={{ fontSize: 11, color: "#aaa" }}>Your club is immediately visible to all members</p>
                  </div>
                </button>
                <button onClick={() => setLaunchMode("draft")}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, borderRadius: 20, padding: 16, textAlign: "left", cursor: "pointer", background: launchMode === "draft" ? `${PINK}10` : "white", border: `1.5px solid ${launchMode === "draft" ? PINK : "rgba(0,0,0,0.07)"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: launchMode === "draft" ? `${PINK}18` : "rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    ✦
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: launchMode === "draft" ? PINK : "#111", marginBottom: 2 }}>Save as Draft ✦</p>
                    <p style={{ fontSize: 11, color: "#aaa" }}>Design first. Make it live when you&apos;re ready.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Club Mama upsell */}
            <Link href="/member/apply-club-mama"
              style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 20, padding: 16, marginBottom: 8, background: `${PINK}0E`, border: `1px solid ${PINK}22`, textDecoration: "none" }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${PINK}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💸</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: PINK }}>Apply for Club Mama stipend</p>
                <p style={{ fontSize: 11, color: "rgba(0,0,0,0.35)", marginTop: 2 }}>Earn $250/month to run this club professionally.</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={`${PINK}88`} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>
        )}

        {/* Error */}
        {createError && (
          <p style={{ fontSize: 12, color: "#ef4444", marginBottom: 12, paddingLeft: 4 }}>{createError}</p>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{ flex: 1, padding: 16, borderRadius: 16, border: "1.5px solid rgba(0,0,0,0.1)", background: "white", fontSize: 13, fontWeight: 700, color: "rgba(0,0,0,0.4)", cursor: "pointer" }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={async () => {
              if (!canNext() || creating) return;
              if (step < 3) { setStep(s => s + 1); return; }
              await handleSubmit();
            }}
            disabled={creating}
            style={{
              flex: 1, padding: 16, borderRadius: 16, border: "none",
              fontSize: 13, fontWeight: 800,
              background: canNext() && !creating ? accentColor : "rgba(0,0,0,0.08)",
              color: canNext() && !creating ? "white" : "rgba(0,0,0,0.2)",
              boxShadow: canNext() && !creating ? `0 6px 20px ${accentColor}44` : "none",
              cursor: creating ? "default" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {creating ? "Creating…" : step === 3 ? (launchMode === "draft" ? "Save as Draft ✦" : "Launch Club ✦") : "Continue →"}
          </button>
        </div>
      </div>

      {/* File inputs */}
      <input ref={photoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoSelect} />

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
