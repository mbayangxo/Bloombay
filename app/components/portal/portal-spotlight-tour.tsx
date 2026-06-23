"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  completePortalOnboarding,
  isPortalOnboardingDone,
  shouldForceOnboarding,
} from "@/lib/portal-onboarding/store";
import type { PortalOnboardingId } from "@/lib/portal-onboarding/types";

// ─── Step definitions ───────────────────────────────────────────────────────

interface SpotlightStep {
  id: string;
  targetSelector: string | null; // null = centered modal, no spotlight
  title: string;
  body: string;
  tooltipSide?: "top" | "bottom" | "left" | "right" | "center";
}

const CLUB_MAMA_STEPS: SpotlightStep[] = [
  {
    id: "welcome",
    targetSelector: null,
    title: "Welcome, Club Mama.",
    body: "This is your portal. Everything about your club — gatherings, members, applications, broadcasts — lives here.",
    tooltipSide: "center",
  },
  {
    id: "portal-tag",
    targetSelector: ".co-header__portal-tag",
    title: "Club Mama portal",
    body: "You're a Club Mama — not a venue, not a partner. This portal is built specifically for running your club.",
    tooltipSide: "bottom",
  },
  {
    id: "nav-home",
    targetSelector: "[data-tour='nav-home']",
    title: "Your dashboard",
    body: "Your home base. See who applied, what's next, who's active, and your club's health at a glance.",
    tooltipSide: "top",
  },
  {
    id: "nav-gatherings",
    targetSelector: "[data-tour='nav-gatherings']",
    title: "Gatherings",
    body: "Plan events, set capacity, pick venues. Your upcoming gatherings show here with one-tap RSVP links for members.",
    tooltipSide: "top",
  },
  {
    id: "nav-women",
    targetSelector: "[data-tour='nav-women']",
    title: "Your women",
    body: "See every member of your club, their profile, and how active they've been. This is your roster.",
    tooltipSide: "top",
  },
  {
    id: "nav-applications",
    targetSelector: "[data-tour='nav-applications']",
    title: "Applications",
    body: "Women request to join your club here. Review each one, read their profile, then approve or decline — it's yours to curate.",
    tooltipSide: "top",
  },
  {
    id: "broadcast",
    targetSelector: "[data-tour='nav-broadcast']",
    title: "Broadcast",
    body: "Send a ping, photo drop, poll, or event invite to all your members at once. They see it instantly.",
    tooltipSide: "top",
  },
  {
    id: "done",
    targetSelector: null,
    title: "Your club is ready.",
    body: "Start with Applications — approve your first wave of members, then create a gathering. Your girls are waiting.",
    tooltipSide: "center",
  },
];

const STEPS: Partial<Record<PortalOnboardingId, SpotlightStep[]>> = {
  club_owner: CLUB_MAMA_STEPS,
};

// ─── Rect helpers ───────────────────────────────────────────────────────────

interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 10;

function getRect(selector: string): HighlightRect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top: r.top - PAD,
    left: r.left - PAD,
    width: r.width + PAD * 2,
    height: r.height + PAD * 2,
  };
}

// ─── Tooltip position ────────────────────────────────────────────────────────

function tooltipStyle(
  rect: HighlightRect | null,
  side: SpotlightStep["tooltipSide"]
): React.CSSProperties {
  if (!rect || side === "center") {
    return {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "min(340px, 90vw)",
    };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tooltipW = Math.min(300, vw * 0.9);
  const tooltipH = 220; // estimated

  let top: number, left: number;

  if (side === "bottom") {
    top = rect.top + rect.height + 12;
    left = Math.min(Math.max(rect.left + rect.width / 2 - tooltipW / 2, 12), vw - tooltipW - 12);
    // if would go off bottom, flip to top
    if (top + tooltipH > vh - 20) {
      top = rect.top - tooltipH - 12;
    }
  } else if (side === "top") {
    top = rect.top - tooltipH - 12;
    left = Math.min(Math.max(rect.left + rect.width / 2 - tooltipW / 2, 12), vw - tooltipW - 12);
    // if would go off top, flip to bottom
    if (top < 20) {
      top = rect.top + rect.height + 12;
    }
  } else if (side === "left") {
    left = rect.left - tooltipW - 12;
    top = Math.min(Math.max(rect.top + rect.height / 2 - tooltipH / 2, 12), vh - tooltipH - 12);
    if (left < 12) left = rect.left + rect.width + 12;
  } else {
    left = rect.left + rect.width + 12;
    top = Math.min(Math.max(rect.top + rect.height / 2 - tooltipH / 2, 12), vh - tooltipH - 12);
    if (left + tooltipW > vw - 12) left = rect.left - tooltipW - 12;
  }

  return { position: "fixed", top, left, width: tooltipW };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PortalSpotlightTour({ portalId }: { portalId: PortalOnboardingId }) {
  const steps = STEPS[portalId];
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<HighlightRect | null>(null);
  const rafRef = useRef<number>(0);

  const current = steps?.[step];

  const measureTarget = useCallback(() => {
    if (!current?.targetSelector) {
      setRect(null);
      return;
    }
    const r = getRect(current.targetSelector);
    setRect(r);
  }, [current]);

  // Open on first visit
  useEffect(() => {
    if (!steps) return;
    if (!isPortalOnboardingDone(portalId) || shouldForceOnboarding()) {
      // Small delay so the portal shell has rendered
      const t = setTimeout(() => {
        setOpen(true);
        setStep(0);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [portalId, steps]);

  // Measure target on each step change
  useEffect(() => {
    if (!open) return;
    cancelAnimationFrame(rafRef.current);
    // Two frames to let layout settle
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(measureTarget);
    });
    return () => cancelAnimationFrame(rafRef.current);
  }, [open, step, measureTarget]);

  // Re-measure on resize/scroll
  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", measureTarget, { passive: true });
    window.addEventListener("scroll", measureTarget, { passive: true });
    return () => {
      window.removeEventListener("resize", measureTarget);
      window.removeEventListener("scroll", measureTarget);
    };
  }, [open, measureTarget]);

  if (!open || !steps || !current) return null;

  const isLast = step >= steps.length - 1;
  const isFirst = step === 0;
  const hasTarget = !!current.targetSelector && !!rect;
  const tipStyle = tooltipStyle(rect, current.tooltipSide);

  function finish() {
    completePortalOnboarding(portalId);
    setOpen(false);
  }
  function next() {
    if (isLast) finish();
    else setStep((s) => s + 1);
  }
  function back() {
    if (!isFirst) setStep((s) => s - 1);
  }

  return (
    <>
      {/* Overlay panels — 4 rectangles that surround the target, or full-screen */}
      {hasTarget && rect ? (
        <>
          {/* Top */}
          <div style={{ position: "fixed", left: 0, right: 0, top: 0, height: rect.top, background: "rgba(0,0,0,0.72)", zIndex: 9997, pointerEvents: "none" }} />
          {/* Bottom */}
          <div style={{ position: "fixed", left: 0, right: 0, top: rect.top + rect.height, bottom: 0, background: "rgba(0,0,0,0.72)", zIndex: 9997, pointerEvents: "none" }} />
          {/* Left */}
          <div style={{ position: "fixed", top: rect.top, left: 0, width: rect.left, height: rect.height, background: "rgba(0,0,0,0.72)", zIndex: 9997, pointerEvents: "none" }} />
          {/* Right */}
          <div style={{ position: "fixed", top: rect.top, left: rect.left + rect.width, right: 0, height: rect.height, background: "rgba(0,0,0,0.72)", zIndex: 9997, pointerEvents: "none" }} />
          {/* Pink ring around target */}
          <div style={{
            position: "fixed",
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            borderRadius: 10,
            border: "2px solid #FF1F7D",
            boxShadow: "0 0 0 4px rgba(255,31,125,0.18), 0 0 20px rgba(255,31,125,0.3)",
            zIndex: 9998,
            pointerEvents: "none",
          }} />
        </>
      ) : (
        /* Full-screen dim for center steps */
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 9997, pointerEvents: "all" }} onClick={finish} />
      )}

      {/* Block clicks behind tooltip only */}
      <div style={{ position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none" }} />

      {/* Tooltip card */}
      <div
        style={{
          ...tipStyle,
          zIndex: 9999,
          background: "#fff",
          borderRadius: 16,
          padding: "22px 22px 18px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,31,125,0.08)",
          pointerEvents: "all",
        }}
      >
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? 18 : 5,
                height: 5,
                borderRadius: 3,
                background: i === step ? "#FF1F7D" : "#f0d0da",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: "italic",
          fontSize: 20,
          color: "#111",
          margin: "0 0 8px",
          lineHeight: 1.2,
        }}>
          {current.title}
        </h2>

        <p style={{
          fontFamily: "Jost, sans-serif",
          fontSize: 13,
          color: "#555",
          lineHeight: 1.6,
          margin: "0 0 18px",
        }}>
          {current.body}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={finish}
            style={{ fontFamily: "Jost, sans-serif", fontSize: 11, color: "#bbb", background: "none", border: "none", cursor: "pointer", padding: 0, letterSpacing: "0.06em" }}
          >
            Skip tour
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            {!isFirst && (
              <button
                onClick={back}
                style={{ fontFamily: "Jost, sans-serif", fontSize: 11, fontWeight: 700, color: "#999", background: "none", border: "1px solid #eee", borderRadius: 20, padding: "7px 16px", cursor: "pointer" }}
              >
                Back
              </button>
            )}
            <button
              onClick={next}
              style={{
                fontFamily: "Jost, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "#FF1F7D",
                color: "#fff",
                border: "none",
                borderRadius: 20,
                padding: "7px 20px",
                cursor: "pointer",
              }}
            >
              {isLast ? "Let's go →" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
