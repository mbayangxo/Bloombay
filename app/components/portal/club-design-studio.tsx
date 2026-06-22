"use client";

import { useState } from "react";
import Link from "next/link";
import { ClubCrestGenerator, type CrestConfig } from "./club-crest-generator";
import { ClubBannerGenerator, type BannerConfig } from "./club-banner-generator";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ClubData {
  id:            string;
  name:          string;
  slug:          string;
  owner_id:      string;
  primary_color: string | null;
  accent_color:  string | null;
  tagline:       string | null;
  description:   string | null;
  status:        string | null;
  cover_url:     string | null;
  banner_url:    string | null;
}

interface Props {
  club: ClubData;
}

type Tab = "CREST" | "BANNER";

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  setTimeout(onDone, 3000);
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
      background: DARK, color: "white",
      padding: "14px 24px", borderRadius: "100px",
      fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 600,
      boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
      zIndex: 9999,
      animation: "fadeUp 0.2s ease-out",
      whiteSpace: "nowrap" as const,
    }}>
      {message}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ClubDesignStudio({ club }: Props) {
  const [activeTab,   setActiveTab]   = useState<Tab>("CREST");
  const [toast,       setToast]       = useState<string | null>(null);
  const [savingCrest,  setSavingCrest]  = useState(false);
  const [savingBanner, setSavingBanner] = useState(false);
  const [makingLive,   setMakingLive]   = useState(false);
  const [archiving,    setArchiving]    = useState(false);
  const [clubStatus,   setClubStatus]   = useState(club.status ?? null);

  const clubLink = `/member/clubs/${club.slug}`;

  async function handleCrestSave(config: CrestConfig, _svgString: string) {
    setSavingCrest(true);
    try {
      const res = await fetch(`/api/clubs/${club.id}/customization`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crest_shape:           config.shape,
          crest_symbol:          config.symbol,
          crest_color_primary:   config.colorPrimary,
          crest_color_secondary: config.colorSecondary,
          crest_color_accent:    config.colorAccent,
          accent_color:          config.colorPrimary,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setToast("Crest saved!");
    } catch {
      setToast("Could not save crest.");
    } finally {
      setSavingCrest(false);
    }
  }

  async function handleBannerSave(config: BannerConfig) {
    setSavingBanner(true);
    try {
      const res = await fetch(`/api/clubs/${club.id}/customization`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accent_color: config.colorAccent,
          bg_color:     config.colorBg,
          text_color:   config.colorText,
          // Store banner config as extra fields for clubs that support it
          layout:       config.template,
          tagline:      config.tagline,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setToast("Banner saved!");
    } catch {
      setToast("Could not save banner.");
    } finally {
      setSavingBanner(false);
    }
  }

  async function handleMakeLive() {
    setMakingLive(true);
    try {
      const res = await fetch(`/api/clubs/${club.id}/status`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      });
      if (!res.ok) throw new Error("Failed");
      setClubStatus("active");
      setToast("Your club is now live!");
    } catch {
      setToast("Could not update status.");
    } finally {
      setMakingLive(false);
    }
  }

  async function handleArchive() {
    setArchiving(true);
    try {
      const res = await fetch(`/api/clubs/${club.id}/status`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });
      if (!res.ok) throw new Error("Failed");
      setClubStatus("archived");
      setToast("Club archived.");
    } catch {
      setToast("Could not archive club.");
    } finally {
      setArchiving(false);
    }
  }

  const crestInitialConfig: Partial<CrestConfig> = {
    colorPrimary:   club.primary_color ?? DARK,
    colorSecondary: PAPER,
    colorAccent:    club.accent_color  ?? PINK,
  };

  const bannerInitialConfig: Partial<BannerConfig> = {
    colorBg:     club.primary_color ?? "#111111",
    colorAccent: club.accent_color  ?? PINK,
    colorText:   PAPER,
    clubName:    club.name,
    tagline:     club.tagline ?? "",
    showTagline: !!(club.tagline),
  };

  return (
    <div style={{ background: PAPER, minHeight: "100svh", paddingBottom: 60 }}>

      {/* Header */}
      <div style={{ background: DARK, padding: "calc(env(safe-area-inset-top, 0px) + 52px) 20px 24px", position: "relative" }}>
        <Link href={clubLink} style={{
          position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 52px)", left: 20,
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600,
          color: "rgba(255,255,255,0.4)", textDecoration: "none",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Club
        </Link>

        <div style={{ textAlign: "center", paddingTop: 36 }}>
          <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.28em", color: PINK, marginBottom: 8 }}>
            ✦ DESIGN STUDIO
          </p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1 }}>
            {club.name}
          </h1>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", borderBottom: "1.5px solid #E8E3DA", background: "white", position: "sticky", top: 0, zIndex: 10 }}>
        {(["CREST", "BANNER"] as Tab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: "16px 0", border: "none", background: "transparent", cursor: "pointer",
            fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800,
            letterSpacing: "0.14em",
            color:       activeTab === tab ? PINK : "rgba(0,0,0,0.3)",
            borderBottom: activeTab === tab ? `2px solid ${PINK}` : "2px solid transparent",
            marginBottom: "-1.5px",
            transition: "all 0.15s",
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "CREST" && (
        <div>
          <ClubCrestGenerator
            clubName={club.name}
            initialConfig={crestInitialConfig}
            onSave={handleCrestSave}
          />
          {savingCrest && (
            <div style={{ textAlign: "center", padding: "8px", fontFamily: "var(--font-jost)", fontSize: 12, color: "#aaa" }}>
              Saving…
            </div>
          )}
        </div>
      )}

      {activeTab === "BANNER" && (
        <div>
          <ClubBannerGenerator
            initialConfig={bannerInitialConfig}
            onSave={handleBannerSave}
          />
          {savingBanner && (
            <div style={{ textAlign: "center", padding: "8px", fontFamily: "var(--font-jost)", fontSize: 12, color: "#aaa" }}>
              Saving…
            </div>
          )}
        </div>
      )}

      {/* Status section */}
      <div style={{ margin: "32px 20px 0", padding: "24px", background: "white", borderRadius: 20, border: "1.5px solid #E8E3DA" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", color: "#aaa", marginBottom: 16 }}>
          CLUB STATUS
        </p>

        {/* Status badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{
            padding: "5px 14px", borderRadius: "100px",
            fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
            background: clubStatus === "active" ? `${PINK}18` : clubStatus === "archived" ? "rgba(0,0,0,0.05)" : "#FFF8E6",
            color:      clubStatus === "active" ? PINK         : clubStatus === "archived" ? "#999"              : "#B87A00",
            border:     clubStatus === "active" ? `1px solid ${PINK}33` : clubStatus === "archived" ? "1px solid rgba(0,0,0,0.1)" : "1px solid #F0C000",
          }}>
            {clubStatus === "active" ? "LIVE" : clubStatus === "archived" ? "ARCHIVED" : "DRAFT"}
          </span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#aaa" }}>
            {clubStatus === "active"   ? "Your club is visible to all members." :
             clubStatus === "archived" ? "This club is no longer visible." :
             "Only you can see this club right now."}
          </span>
        </div>

        {/* Action buttons */}
        {clubStatus === "draft" && (
          <button onClick={handleMakeLive} disabled={makingLive} style={{
            width: "100%", padding: "16px", borderRadius: "100px", border: "none",
            background: PINK, color: "white",
            fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800,
            letterSpacing: "0.04em", cursor: makingLive ? "default" : "pointer",
            opacity: makingLive ? 0.7 : 1,
          }}>
            {makingLive ? "Launching…" : "Make this club live ✦"}
          </button>
        )}

        {clubStatus === "active" && (
          <button onClick={handleArchive} disabled={archiving} style={{
            width: "100%", padding: "14px", borderRadius: "100px",
            border: "1.5px solid rgba(0,0,0,0.1)", background: "transparent",
            fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 600,
            color: "rgba(0,0,0,0.3)", cursor: archiving ? "default" : "pointer",
            opacity: archiving ? 0.6 : 1,
          }}>
            {archiving ? "Archiving…" : "Archive Club"}
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
