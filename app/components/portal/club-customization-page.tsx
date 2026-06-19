"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ClubCrestGenerator, type CrestConfig } from "./club-crest-generator";
import { uploadClubCrestBadge, uploadClubCover } from "@/lib/storage/upload";

// ─── Constants ────────────────────────────────────────────────────────────────

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";
const GOLD  = "#D4A853";

const ACCENT_SWATCHES  = ["#FF1F7D","#FF6BAE","#D4A853","#F5D080","#3DAA6E","#2563EB","#1E3A5F","#1C1B1C"];
const BG_SWATCHES      = ["#FEFCF7","#F6F1EB","#FFF0F6","#FFFBF0","#F0F7FF","#F0FFF4","#1C1B1C","#0E0C0A"];
const TEXT_SWATCHES    = ["#1C1B1C","#3D3A3D","#5A585A","#FEFCF7","#FF1F7D","#D4A853","#2563EB","#1E3A5F"];

type Layout = "editorial" | "cozy" | "gallery" | "minimal";

interface Props {
  clubId: string;
  clubName: string;
  ownerId: string;
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 18, fontFamily: "var(--font-playfair)", fontWeight: 700, color: DARK }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 13, fontFamily: "var(--font-jost)", color: "#777", marginTop: 4 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

// ─── Color Row ────────────────────────────────────────────────────────────────

function ColorRow({
  label,
  value,
  swatches,
  onChange,
}: {
  label: string;
  value: string;
  swatches: string[];
  onChange: (c: string) => void;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontFamily: "var(--font-jost)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: DARK, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
        {swatches.map((swatch) => (
          <button
            key={swatch}
            onClick={() => onChange(swatch)}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: swatch,
              border: value === swatch ? `3px solid ${PINK}` : "2px solid rgba(0,0,0,0.1)",
              cursor: "pointer",
              flexShrink: 0,
              boxShadow: value === swatch ? `0 0 0 2px ${PAPER}` : "none",
              outline: "none",
              transition: "transform 0.12s",
            }}
            aria-label={swatch}
          />
        ))}
        {/* Custom color */}
        <label style={{ width: 34, height: 34, borderRadius: "50%", border: "2px dashed #bbb", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: value, border: "1px solid rgba(0,0,0,0.15)" }} />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer" }}
          />
        </label>
      </div>
    </div>
  );
}

// ─── Layout Card ──────────────────────────────────────────────────────────────

function LayoutMockup({ type }: { type: Layout }) {
  const W = 72, H = 88;

  if (type === "editorial") {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <rect width={W} height={H} fill="#e8e4df" rx="4" />
        {/* Large cover */}
        <rect x="0" y="0" width={W} height={50} fill="#c4b8ac" rx="4" />
        {/* Text overlay */}
        <rect x="6" y="34" width={36} height={5} fill="white" rx="1" opacity="0.9" />
        <rect x="6" y="42" width={24} height={3} fill="white" rx="1" opacity="0.6" />
        {/* Content rows */}
        <rect x="6" y="58" width={60} height={3} fill="#aaa" rx="1" />
        <rect x="6" y="65" width={48} height={3} fill="#aaa" rx="1" />
        <rect x="6" y="72" width={54} height={3} fill="#aaa" rx="1" />
        <rect x="6" y="79" width={30} height={3} fill="#aaa" rx="1" />
      </svg>
    );
  }

  if (type === "cozy") {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <rect width={W} height={H} fill="#fdf6ef" rx="4" />
        {/* Warm header */}
        <rect x="0" y="0" width={W} height={18} fill="#e8c89a" rx="4" />
        <rect x="6" y="5" width={32} height={5} fill="#7a5230" rx="1" opacity="0.6" />
        {/* Card grid */}
        <rect x="4" y="24" width={30} height={26} fill="#f2e4d4" rx="3" />
        <rect x="38" y="24" width={30} height={26} fill="#f2e4d4" rx="3" />
        <rect x="4" y="55" width={30} height={26} fill="#f2e4d4" rx="3" />
        <rect x="38" y="55" width={30} height={26} fill="#f2e4d4" rx="3" />
        {/* Card lines */}
        <rect x="8" y="34" width={22} height={3} fill="#c4956a" rx="1" opacity="0.5" />
        <rect x="8" y="39" width={16} height={2} fill="#c4956a" rx="1" opacity="0.4" />
        <rect x="42" y="34" width={22} height={3} fill="#c4956a" rx="1" opacity="0.5" />
        <rect x="42" y="39" width={16} height={2} fill="#c4956a" rx="1" opacity="0.4" />
      </svg>
    );
  }

  if (type === "gallery") {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <rect width={W} height={H} fill="#1a1a1a" rx="4" />
        {/* Gallery grid */}
        <rect x="2" y="2" width={32} height={32} fill="#444" rx="2" />
        <rect x="38" y="2" width={32} height={32} fill="#555" rx="2" />
        <rect x="2" y="38" width={32} height={22} fill="#3d3d3d" rx="2" />
        <rect x="38" y="38" width={32} height={22} fill="#4a4a4a" rx="2" />
        <rect x="2" y="64" width={68} height={20} fill="#333" rx="2" />
        {/* White bar */}
        <rect x="0" y="78" width={W} height={10} fill="#1a1a1a" rx="2" />
        <rect x="6" y="81" width={30} height={3} fill="#aaa" rx="1" />
      </svg>
    );
  }

  // minimal
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <rect width={W} height={H} fill="white" rx="4" />
      {/* Logo mark */}
      <circle cx="14" cy="14" r="6" fill="#eee" />
      {/* Title */}
      <rect x="6" y="26" width={50} height={6} fill="#222" rx="1" />
      {/* Divider */}
      <line x1="6" y1="38" x2="66" y2="38" stroke="#eee" strokeWidth="1" />
      {/* Lines */}
      <rect x="6" y="44" width={60} height={2.5} fill="#ddd" rx="1" />
      <rect x="6" y="50" width={48} height={2.5} fill="#ddd" rx="1" />
      <rect x="6" y="56" width={54} height={2.5} fill="#ddd" rx="1" />
      <rect x="6" y="62" width={36} height={2.5} fill="#ddd" rx="1" />
      {/* Tag chips */}
      <rect x="6" y="72" width={22} height={8} fill="#f0f0f0" rx="4" />
      <rect x="32" y="72" width={22} height={8} fill="#f0f0f0" rx="4" />
    </svg>
  );
}

const LAYOUT_INFO: Record<Layout, { label: string; desc: string }> = {
  editorial: { label: "Editorial",  desc: "Magazine feel" },
  cozy:      { label: "Cozy",       desc: "Warm & community" },
  gallery:   { label: "Gallery",    desc: "Photo-first" },
  minimal:   { label: "Minimal",    desc: "Clean typography" },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function ClubCustomizationPage({ clubId, clubName, ownerId: _ownerId }: Props) {
  // ── Crest state ──
  const [crestConfig, setCrestConfig] = useState<CrestConfig>({
    shape: "shield",
    symbol: "flower",
    font: "serif",
    colorPrimary: PINK,
    colorSecondary: DARK,
    colorAccent: GOLD,
    showBannerText: true,
    bannerText: "EST. 2026",
  });
  const [crestUrl, setCrestUrl] = useState<string | null>(null);
  const [crestSaving, setCrestSaving] = useState(false);

  // ── Layout state ──
  const [layout, setLayout] = useState<Layout>("editorial");

  // ── Color state ──
  const [accentColor, setAccentColor] = useState(PINK);
  const [bgColor, setBgColor]         = useState(PAPER);
  const [textColor, setTextColor]     = useState(DARK);

  // ── Cover state ──
  const [coverUrl, setCoverUrl]         = useState<string | null>(null);
  const [coverPosition, setCoverPosition] = useState<"top" | "center" | "bottom">("center");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // ── Tagline / about ──
  const [tagline, setTagline] = useState("");
  const [about, setAbout]     = useState("");

  // ── Save state ──
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // Load existing customization on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/clubs/${clubId}/customization`);
        if (!res.ok) return;
        const data = await res.json();
        if (!data || !data.club_id) return;
        setCrestConfig(prev => ({
          ...prev,
          shape:          data.crest_shape           ?? "shield",
          symbol:         data.crest_symbol          ?? "flower",
          colorPrimary:   data.crest_color_primary   ?? PINK,
          colorSecondary: data.crest_color_secondary ?? DARK,
          colorAccent:    data.crest_color_accent    ?? GOLD,
        }));
        if (data.crest_url)  setCrestUrl(data.crest_url);
        if (data.layout)     setLayout(data.layout as Layout);
        if (data.accent_color) setAccentColor(data.accent_color);
        if (data.bg_color)    setBgColor(data.bg_color);
        if (data.text_color)  setTextColor(data.text_color);
        if (data.cover_url)  { setCoverUrl(data.cover_url); setCoverPreview(data.cover_url); }
        if (data.cover_position) setCoverPosition(data.cover_position as "top" | "center" | "bottom");
        if (data.tagline)    setTagline(data.tagline);
        if (data.about)      setAbout(data.about);
      } catch {
        // silently fail
      }
    }
    load();
  }, [clubId]);

  // ── Crest save handler ──
  const handleCrestSave = useCallback(async (config: CrestConfig, svgString: string) => {
    setCrestSaving(true);
    try {
      const url = await uploadClubCrestBadge(svgString, clubId);
      setCrestConfig(config);
      setCrestUrl(url);
    } catch (e: unknown) {
      console.error("Crest upload failed", e);
    } finally {
      setCrestSaving(false);
    }
  }, [clubId]);

  // ── Cover upload handler ──
  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const localPreview = URL.createObjectURL(file);
    setCoverPreview(localPreview);
    setCoverUploading(true);
    try {
      const url = await uploadClubCover(file, clubId);
      setCoverUrl(url);
    } catch (err: unknown) {
      console.error("Cover upload failed", err);
    } finally {
      setCoverUploading(false);
    }
  }

  // ── Main save handler ──
  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/clubs/${clubId}/customization`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crest_shape:           crestConfig.shape,
          crest_symbol:          crestConfig.symbol,
          crest_color_primary:   crestConfig.colorPrimary,
          crest_color_secondary: crestConfig.colorSecondary,
          crest_color_accent:    crestConfig.colorAccent,
          crest_url:             crestUrl,
          layout,
          accent_color:          accentColor,
          bg_color:              bgColor,
          text_color:            textColor,
          cover_url:             coverUrl,
          cover_position:        coverPosition,
          tagline:               tagline || null,
          about:                 about || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const divider = (
    <div style={{ height: 1, background: "rgba(28,27,28,0.08)", margin: "32px 0" }} />
  );

  return (
    <div style={{ background: PAPER, minHeight: "100vh", fontFamily: "var(--font-jost)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px 120px" }}>

        {/* ── Page Title ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 26, fontFamily: "var(--font-playfair)", fontWeight: 700, color: DARK }}>
            Customize Your Club
          </div>
          <div style={{ fontSize: 14, color: "#888", marginTop: 6, fontFamily: "var(--font-jost)" }}>
            {clubName}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — CREST
        ═══════════════════════════════════════════════ */}
        <SectionHeader
          title="Club Crest"
          subtitle="Design a badge that represents your club's identity"
        />
        <ClubCrestGenerator
          clubName={clubName}
          initialConfig={crestConfig}
          onSave={handleCrestSave}
        />
        {crestSaving && (
          <div style={{ textAlign: "center", fontSize: 13, color: "#888", marginTop: 8 }}>
            Uploading crest…
          </div>
        )}
        {crestUrl && !crestSaving && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={crestUrl} alt="Saved crest" style={{ width: 40, height: 40, objectFit: "contain" }} />
            <span style={{ fontSize: 12, color: "#3DAA6E", fontWeight: 600 }}>Crest saved ✓</span>
          </div>
        )}

        {divider}

        {/* ═══════════════════════════════════════════════
            SECTION 2 — LAYOUT
        ═══════════════════════════════════════════════ */}
        <SectionHeader
          title="Club Feel"
          subtitle="Choose how your club page looks and feels"
        />
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {(["editorial", "cozy", "gallery", "minimal"] as Layout[]).map((l) => {
            const info = LAYOUT_INFO[l];
            const selected = layout === l;
            return (
              <button
                key={l}
                onClick={() => setLayout(l)}
                style={{
                  flexShrink: 0,
                  background: selected ? `${PINK}10` : "#fff",
                  border: selected ? `2px solid ${PINK}` : "2px solid #e5e5e5",
                  borderRadius: 12,
                  padding: "12px 12px 10px",
                  cursor: "pointer",
                  outline: "none",
                  textAlign: "center",
                  width: 100,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <LayoutMockup type={l} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: selected ? PINK : DARK, fontFamily: "var(--font-jost)" }}>
                  {info.label}
                </div>
                <div style={{ fontSize: 10, color: "#999", marginTop: 2, fontFamily: "var(--font-jost)" }}>
                  {info.desc}
                </div>
              </button>
            );
          })}
        </div>

        {divider}

        {/* ═══════════════════════════════════════════════
            SECTION 3 — COLORS
        ═══════════════════════════════════════════════ */}
        <SectionHeader
          title="Colors"
          subtitle="Pick your club's palette"
        />
        <ColorRow label="Accent Color"     value={accentColor} swatches={ACCENT_SWATCHES} onChange={setAccentColor} />
        <ColorRow label="Background Color" value={bgColor}     swatches={BG_SWATCHES}     onChange={setBgColor} />
        <ColorRow label="Text Color"       value={textColor}   swatches={TEXT_SWATCHES}   onChange={setTextColor} />

        {/* Live color preview */}
        <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", marginTop: 4 }}>
          <div style={{ background: accentColor, padding: "10px 14px" }}>
            <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-jost)" }}>Accent</span>
          </div>
          <div style={{ background: bgColor, padding: "14px", borderBottom: `3px solid ${accentColor}` }}>
            <span style={{ color: textColor, fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 700 }}>
              {clubName}
            </span>
            <p style={{ color: textColor, fontFamily: "var(--font-jost)", fontSize: 12, margin: "6px 0 0", opacity: 0.7 }}>
              A preview of your club's look and feel.
            </p>
          </div>
        </div>

        {divider}

        {/* ═══════════════════════════════════════════════
            SECTION 4 — COVER PHOTO
        ═══════════════════════════════════════════════ */}
        <SectionHeader
          title="Cover Photo"
          subtitle="The hero image shown at the top of your club page"
        />

        {/* Cover preview / upload tap area */}
        <button
          onClick={() => coverInputRef.current?.click()}
          style={{
            width: "100%",
            height: 160,
            borderRadius: 12,
            border: coverPreview ? "none" : `2px dashed ${PINK}`,
            background: coverPreview ? "none" : `${PINK}08`,
            cursor: "pointer",
            overflow: "hidden",
            position: "relative",
            outline: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 14,
          }}
        >
          {coverPreview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={coverPreview}
              alt="Cover preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: coverPosition,
              }}
            />
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>📸</div>
              <div style={{ fontSize: 14, color: PINK, fontWeight: 600, fontFamily: "var(--font-jost)" }}>
                {coverUploading ? "Uploading…" : "Tap to upload cover photo"}
              </div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 4, fontFamily: "var(--font-jost)" }}>
                JPG, PNG, or WEBP
              </div>
            </div>
          )}
          {coverPreview && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-jost)", background: "rgba(0,0,0,0.5)", padding: "6px 14px", borderRadius: 20 }}>
                {coverUploading ? "Uploading…" : "Change photo"}
              </span>
            </div>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            style={{ display: "none" }}
          />
        </button>

        {/* Cover position selector */}
        {coverPreview && (
          <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            {(["top", "center", "bottom"] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setCoverPosition(pos)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 8,
                  border: coverPosition === pos ? `2px solid ${PINK}` : "2px solid #e5e5e5",
                  background: coverPosition === pos ? `${PINK}10` : "#fff",
                  color: coverPosition === pos ? PINK : DARK,
                  fontFamily: "var(--font-jost)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  outline: "none",
                  textTransform: "capitalize",
                }}
              >
                {pos}
              </button>
            ))}
          </div>
        )}

        {divider}

        {/* ═══════════════════════════════════════════════
            SECTION 5 — TAGLINE & ABOUT
        ═══════════════════════════════════════════════ */}
        <SectionHeader
          title="Tagline & About"
          subtitle="Tell people what makes your club special"
        />

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: DARK, marginBottom: 8, fontFamily: "var(--font-jost)" }}>
            Tagline
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value.slice(0, 60))}
            placeholder="e.g. Where creative women gather..."
            maxLength={60}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1.5px solid #e0ddd8",
              fontFamily: "var(--font-jost)",
              fontSize: 14,
              color: DARK,
              background: "#fff",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <div style={{ fontSize: 11, color: "#aaa", textAlign: "right", marginTop: 4, fontFamily: "var(--font-jost)" }}>
            {tagline.length}/60
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: DARK, marginBottom: 8, fontFamily: "var(--font-jost)" }}>
            About
          </label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value.slice(0, 280))}
            placeholder="Tell potential members what your club is about, who it's for, and what to expect..."
            maxLength={280}
            rows={5}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1.5px solid #e0ddd8",
              fontFamily: "var(--font-jost)",
              fontSize: 14,
              color: DARK,
              background: "#fff",
              outline: "none",
              resize: "vertical",
              boxSizing: "border-box",
              lineHeight: 1.5,
            }}
          />
          <div style={{ fontSize: 11, color: "#aaa", textAlign: "right", marginTop: 4, fontFamily: "var(--font-jost)" }}>
            {about.length}/280
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SAVE BUTTON
        ═══════════════════════════════════════════════ */}
        <div style={{ marginTop: 40 }}>
          {error && (
            <div style={{ color: "#e53e3e", fontSize: 13, fontFamily: "var(--font-jost)", marginBottom: 12, textAlign: "center" }}>
              {error}
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: "100%",
              padding: "17px 0",
              borderRadius: 50,
              background: saved ? "#3DAA6E" : PINK,
              color: "#fff",
              fontFamily: "var(--font-jost)",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.04em",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              boxShadow: saved ? "0 4px 16px rgba(61,170,110,0.3)" : "0 4px 16px rgba(255,31,125,0.3)",
              transition: "background 0.25s, box-shadow 0.25s",
            }}
          >
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save Customization"}
          </button>
        </div>
      </div>
    </div>
  );
}
