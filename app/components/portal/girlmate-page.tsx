"use client";

import { useState } from "react";
import Link from "next/link";
import type { GirlmateProfile } from "@/lib/actions/girlmate";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const PINK  = "#FF1F7D";
const CREAM = "#F6F1EB";
const DARK  = "#1C1B1C";
const PAPER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

// ─── Extended mock type (GirlmateProfile + visual helpers) ─────────────────────
type MockProfile = GirlmateProfile & {
  initials: string;
  avatarGradient: string;
  moveInLabel: string;
};

// ─── Mock data ──────────────────────────────────────────────────────────────────
const MOCK_PROFILES: MockProfile[] = [
  {
    id: "1",
    user_id: "u1",
    display_name: "Zara M",
    avatar_url: null,
    neighborhoods: ["Crown Heights"],
    budget_min: 1800,
    budget_max: 2400,
    move_in_date: "2026-07-01",
    lifestyle_tags: ["night owl", "clean", "social"],
    bio: "Looking for someone who actually enjoys silence sometimes. I work in fashion.",
    pets: false,
    smoking: false,
    created_at: "2026-06-01T00:00:00Z",
    initials: "ZM",
    avatarGradient: "linear-gradient(135deg, #FF1F7D 0%, #FF9ECA 100%)",
    moveInLabel: "July",
  },
  {
    id: "2",
    user_id: "u2",
    display_name: "Amara K",
    avatar_url: null,
    neighborhoods: ["Williamsburg"],
    budget_min: 2200,
    budget_max: 2800,
    move_in_date: "2026-08-01",
    lifestyle_tags: ["early bird", "clean", "creative"],
    bio: "Photographer. I make good coffee and keep weird hours. You'll hear my shutter sometimes.",
    pets: false,
    smoking: false,
    created_at: "2026-06-02T00:00:00Z",
    initials: "AK",
    avatarGradient: "linear-gradient(135deg, #7B2FF7 0%, #C77DFF 100%)",
    moveInLabel: "Aug",
  },
  {
    id: "3",
    user_id: "u3",
    display_name: "Sade T",
    avatar_url: null,
    neighborhoods: ["Harlem"],
    budget_min: 1500,
    budget_max: 2000,
    move_in_date: "2026-06-15",
    lifestyle_tags: ["homebody", "clean", "quiet"],
    bio: "Just moved from London. Need a room and honestly a friend who knows the city.",
    pets: true,
    smoking: false,
    created_at: "2026-06-03T00:00:00Z",
    initials: "ST",
    avatarGradient: "linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)",
    moveInLabel: "June",
  },
  {
    id: "4",
    user_id: "u4",
    display_name: "Nia B",
    avatar_url: null,
    neighborhoods: ["SoHo"],
    budget_min: 2800,
    budget_max: 3500,
    move_in_date: "2026-08-01",
    lifestyle_tags: ["social", "foodie", "clean"],
    bio: "Finance. I'm barely home but when I am I like having people over. Good energy only.",
    pets: false,
    smoking: false,
    created_at: "2026-06-04T00:00:00Z",
    initials: "NB",
    avatarGradient: "linear-gradient(135deg, #00C6A7 0%, #3B82F6 100%)",
    moveInLabel: "August",
  },
  {
    id: "5",
    user_id: "u5",
    display_name: "Lena P",
    avatar_url: null,
    neighborhoods: ["Astoria"],
    budget_min: 1200,
    budget_max: 1600,
    move_in_date: "2026-07-15",
    lifestyle_tags: ["bookworm", "quiet", "clean"],
    bio: "PhD student. Looking for someone unbothered by stacks of books and late study sessions.",
    pets: true,
    smoking: false,
    created_at: "2026-06-05T00:00:00Z",
    initials: "LP",
    avatarGradient: "linear-gradient(135deg, #E91E8C 0%, #F48FB1 100%)",
    moveInLabel: "July",
  },
];

// ─── Filter chip labels → borough neighborhood lists ───────────────────────────
const FILTER_CHIPS = ["All", "Manhattan", "Brooklyn", "Queens"] as const;
type FilterChip = typeof FILTER_CHIPS[number];

const BOROUGH_HOODS: Record<string, string[]> = {
  Manhattan: ["SoHo", "Harlem", "Chelsea", "Upper East Side", "Midtown", "Tribeca", "Nolita"],
  Brooklyn:  ["Crown Heights", "Williamsburg", "DUMBO", "Bushwick", "Park Slope", "Bed-Stuy"],
  Queens:    ["Astoria", "Long Island City", "Jackson Heights", "Flushing", "Ridgewood"],
};

const FORM_HOODS = [
  "Manhattan", "Brooklyn", "Queens", "Bronx",
  "Harlem", "Astoria", "Williamsburg", "Crown Heights", "SoHo", "Bushwick",
];

// ─── Component ─────────────────────────────────────────────────────────────────
export function GirlmatePage() {
  const [activeFilter, setActiveFilter]           = useState<FilterChip>("All");
  const [sheetOpen,    setSheetOpen]               = useState(false);
  const [formHoods,    setFormHoods]               = useState<string[]>([]);
  const [budgetMin,    setBudgetMin]               = useState("");
  const [budgetMax,    setBudgetMax]               = useState("");
  const [moveInDate,   setMoveInDate]              = useState("");
  const [formBio,      setFormBio]                 = useState("");

  const filtered =
    activeFilter === "All"
      ? MOCK_PROFILES
      : MOCK_PROFILES.filter((p) =>
          p.neighborhoods.some((n) => (BOROUGH_HOODS[activeFilter] ?? []).includes(n))
        );

  function toggleHood(hood: string) {
    setFormHoods((prev) =>
      prev.includes(hood) ? prev.filter((h) => h !== hood) : [...prev, hood]
    );
  }

  const sharedInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1.5px solid rgba(28,27,28,0.15)",
    background: "#fff",
    fontFamily: "var(--font-jost), sans-serif",
    fontSize: 14,
    color: DARK,
    outline: "none",
    boxSizing: "border-box",
  };

  const fieldLabelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-jost), sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(28,27,28,0.45)",
    marginBottom: 8,
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: CREAM,
        backgroundImage: PAPER,
        backgroundRepeat: "repeat",
        fontFamily: "var(--font-jost), sans-serif",
        color: DARK,
        overflowX: "hidden",
      }}
    >
      {/* ── Sticky header ─────────────────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "rgba(246,241,235,0.88)",
          borderBottom: "1px solid rgba(28,27,28,0.08)",
          padding: "14px 18px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <Link
            href="/member/match"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(28,27,28,0.06)",
              color: DARK,
              textDecoration: "none",
              fontSize: 16,
              flexShrink: 0,
            }}
            aria-label="Back to match"
          >
            ←
          </Link>

          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 22,
                margin: 0,
                lineHeight: 1.1,
                color: DARK,
              }}
            >
              GirlMates
            </h1>
            <p
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontSize: 14,
                margin: 0,
                color: "rgba(28,27,28,0.55)",
                lineHeight: 1.2,
              }}
            >
              find your person in the city ♡
            </p>
          </div>

          <button
            onClick={() => setSheetOpen(true)}
            style={{
              background: PINK,
              color: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "8px 16px",
              fontSize: 12,
              fontFamily: "var(--font-jost), sans-serif",
              fontWeight: 700,
              letterSpacing: "0.04em",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            I&apos;m looking too →
          </button>
        </div>

        {/* Filter chips row */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 12,
            scrollbarWidth: "none",
          }}
        >
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveFilter(chip)}
              style={{
                flexShrink: 0,
                padding: "6px 14px",
                borderRadius: 20,
                border:
                  activeFilter === chip
                    ? `1.5px solid ${PINK}`
                    : "1.5px solid rgba(28,27,28,0.15)",
                background:
                  activeFilter === chip ? PINK : "transparent",
                color: activeFilter === chip ? "#fff" : DARK,
                fontSize: 12,
                fontFamily: "var(--font-jost), sans-serif",
                fontWeight: 600,
                letterSpacing: "0.03em",
                cursor: "pointer",
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </header>

      {/* ── Profile card list ──────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "16px 18px 100px",
        }}
      >
        {filtered.length === 0 && (
          <p
            style={{
              textAlign: "center",
              marginTop: 48,
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 18,
              color: "rgba(28,27,28,0.4)",
            }}
          >
            No GirlMates in this area yet ✦
          </p>
        )}

        {filtered.map((profile) => (
          <div
            key={profile.id}
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 12px rgba(28,27,28,0.07)",
              overflow: "hidden",
              padding: 16,
            }}
          >
            {/* Top row: avatar + name + tags */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: profile.avatarGradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontFamily: "var(--font-jost), sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {profile.initials}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-jost), sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      color: DARK,
                    }}
                  >
                    {profile.display_name}
                  </span>

                  {profile.neighborhoods[0] && (
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "var(--font-jost), sans-serif",
                        fontWeight: 600,
                        letterSpacing: "0.03em",
                        color: "rgba(28,27,28,0.55)",
                        background: "rgba(28,27,28,0.06)",
                        borderRadius: 6,
                        padding: "2px 7px",
                      }}
                    >
                      {profile.neighborhoods[0]}
                    </span>
                  )}

                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "var(--font-jost), sans-serif",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: PINK,
                      background: "rgba(255,31,125,0.08)",
                      borderRadius: 6,
                      padding: "2px 7px",
                    }}
                  >
                    Move in {profile.moveInLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Budget */}
            {profile.budget_min != null && profile.budget_max != null && (
              <p
                style={{
                  fontFamily: "var(--font-jost), sans-serif",
                  fontSize: 12,
                  color: "rgba(28,27,28,0.6)",
                  margin: "0 0 8px",
                  fontWeight: 500,
                }}
              >
                💵 ${profile.budget_min.toLocaleString()} – ${profile.budget_max.toLocaleString()}/mo
              </p>
            )}

            {/* Lifestyle tags */}
            {profile.lifestyle_tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                {profile.lifestyle_tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--font-jost), sans-serif",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      color: PINK,
                      background: "rgba(255,31,125,0.09)",
                      borderRadius: 20,
                      padding: "3px 9px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Bio */}
            {profile.bio && (
              <p
                style={{
                  fontFamily: "var(--font-caveat), cursive",
                  fontSize: 15,
                  color: "rgba(28,27,28,0.75)",
                  margin: "0 0 10px",
                  lineHeight: 1.5,
                }}
              >
                &ldquo;{profile.bio}&rdquo;
              </p>
            )}

            {/* Pets / smoking */}
            <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "var(--font-jost), sans-serif",
                  color: profile.pets ? DARK : "rgba(28,27,28,0.35)",
                }}
              >
                {profile.pets ? "🐾 pets ok" : "✗ no pets"}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "var(--font-jost), sans-serif",
                  color: profile.smoking ? DARK : "rgba(28,27,28,0.35)",
                }}
              >
                {profile.smoking ? "🚬 smoker" : "🚭 non-smoker"}
              </span>
            </div>

            {/* CTA */}
            <button
              style={{
                width: "100%",
                background: PINK,
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "12px 0",
                fontSize: 13,
                fontFamily: "var(--font-jost), sans-serif",
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: "pointer",
              }}
            >
              Send intro →
            </button>
          </div>
        ))}
      </div>

      {/* ── Sheet backdrop ─────────────────────────────────────────────────────── */}
      {sheetOpen && (
        <div
          onClick={() => setSheetOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 70,
          }}
        />
      )}

      {/* ── "I'm looking too" bottom sheet ────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 80,
          background: CREAM,
          backgroundImage: PAPER,
          backgroundRepeat: "repeat",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
          transform: sheetOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1)",
          maxHeight: "88dvh",
          overflowY: "auto",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: "rgba(28,27,28,0.18)",
            }}
          />
        </div>

        <div style={{ padding: "8px 18px 32px" }}>
          <h2
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontStyle: "italic",
              fontSize: 22,
              fontWeight: 700,
              color: DARK,
              margin: "0 0 4px",
            }}
          >
            I&apos;m looking too
          </h2>
          <p
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 15,
              color: "rgba(28,27,28,0.5)",
              margin: "0 0 20px",
            }}
          >
            Post your profile and let GirlMates find you ✦
          </p>

          {/* Neighborhood multi-select chips */}
          <label style={fieldLabelStyle}>Neighborhoods</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
            {FORM_HOODS.map((hood) => (
              <button
                key={hood}
                type="button"
                onClick={() => toggleHood(hood)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  border: formHoods.includes(hood)
                    ? `1.5px solid ${PINK}`
                    : "1.5px solid rgba(28,27,28,0.15)",
                  background: formHoods.includes(hood) ? PINK : "transparent",
                  color: formHoods.includes(hood) ? "#fff" : DARK,
                  fontSize: 12,
                  fontFamily: "var(--font-jost), sans-serif",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {hood}
              </button>
            ))}
          </div>

          {/* Budget range */}
          <label style={fieldLabelStyle}>Budget range / mo</label>
          <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center" }}>
            <input
              type="number"
              placeholder="Min $"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              style={{ ...sharedInputStyle, flex: 1, width: "auto" }}
            />
            <span style={{ color: "rgba(28,27,28,0.35)", fontSize: 14, flexShrink: 0 }}>–</span>
            <input
              type="number"
              placeholder="Max $"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              style={{ ...sharedInputStyle, flex: 1, width: "auto" }}
            />
          </div>

          {/* Move-in date */}
          <label style={fieldLabelStyle}>Move-in date</label>
          <input
            type="date"
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
            style={{ ...sharedInputStyle, marginBottom: 18 }}
          />

          {/* Bio */}
          <label style={fieldLabelStyle}>A little about you</label>
          <textarea
            placeholder="Tell potential roommates a bit about yourself…"
            value={formBio}
            onChange={(e) => setFormBio(e.target.value)}
            rows={4}
            style={{
              ...sharedInputStyle,
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 16,
              marginBottom: 20,
              resize: "none",
            }}
          />

          <button
            style={{
              width: "100%",
              background: PINK,
              color: "#fff",
              border: "none",
              borderRadius: 14,
              padding: "14px 0",
              fontSize: 14,
              fontFamily: "var(--font-jost), sans-serif",
              fontWeight: 700,
              letterSpacing: "0.05em",
              cursor: "pointer",
            }}
          >
            Post my profile →
          </button>
        </div>
      </div>
    </div>
  );
}
