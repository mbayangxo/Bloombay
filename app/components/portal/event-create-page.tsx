"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TicketCard, PosterCard, GatheringCard, InvitationEventCard, type EventType, type EventCardData } from "./event-card-templates";
import { createEvent } from "@/lib/actions/happenings";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";

// ── Preset color swatches ─────────────────────────────────────────────────────
const COLOR_SWATCHES = [
  "#FF1F7D", "#E8006A", "#C80060",
  "#A855F7", "#7C3AED",
  "#F59E0B", "#D97706",
  "#06B6D4", "#0284C7",
  "#10B981", "#059669",
  "#EF4444", "#DC2626",
  "#1C1B1C", "#4B5563",
];

// ── Font options ──────────────────────────────────────────────────────────────
const FONTS: { key: string; label: string; family: string; preview: string }[] = [
  { key: "playfair", label: "Playfair",  family: "var(--font-playfair)", preview: "Aa" },
  { key: "fraunces", label: "Fraunces",  family: "var(--font-fraunces)", preview: "Aa" },
  { key: "jost",     label: "Jost",      family: "var(--font-jost)",     preview: "Aa" },
  { key: "caveat",   label: "Caveat",    family: "var(--font-caveat)",   preview: "Aa" },
];

// ── Stock photos (placeholder gradients + labels until real CDN assets) ───────
const STOCK_PHOTOS: { id: string; label: string; gradient: string; emoji: string }[] = [
  { id: "dinner",   label: "Dinner",   gradient: "linear-gradient(135deg,#2A0A18,#4A1428)", emoji: "🍷" },
  { id: "brunch",   label: "Brunch",   gradient: "linear-gradient(135deg,#FF9060,#FFB080)", emoji: "🥂" },
  { id: "concert",  label: "Concert",  gradient: "linear-gradient(135deg,#0A0A1A,#1A1A3A)", emoji: "🎵" },
  { id: "museum",   label: "Museum",   gradient: "linear-gradient(135deg,#F5F0E8,#E8E0D0)", emoji: "🏛️" },
  { id: "rooftop",  label: "Rooftop",  gradient: "linear-gradient(135deg,#FFB3D9,#FF8EC7)", emoji: "🌃" },
  { id: "walk",     label: "Walk",     gradient: "linear-gradient(135deg,#D4EDDA,#A8D5B5)", emoji: "🌿" },
  { id: "party",    label: "Party",    gradient: "linear-gradient(135deg,#FF1F7D,#FF5BAD)", emoji: "🎉" },
  { id: "reading",  label: "Reading",  gradient: "linear-gradient(135deg,#4A2C14,#2C1808)", emoji: "📚" },
];

// ── Event type options ────────────────────────────────────────────────────────
const EVENT_TYPES: { type: EventType; label: string; icon: string; desc: string }[] = [
  { type: "gathering",  label: "Gathering",  icon: "✦", desc: "Brunch, walks, casual meetups" },
  { type: "party",      label: "Party",      icon: "🎉", desc: "Looks like a real poster" },
  { type: "concert",    label: "Concert",    icon: "🎵", desc: "Looks like a real ticket" },
  { type: "invitation", label: "Invitation", icon: "💌", desc: "Envelope-style, celebration" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function Stepper({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          height: 4, borderRadius: 999,
          width: i === step - 1 ? 24 : 10,
          background: i < step ? PINK : "rgba(0,0,0,0.12)",
          transition: "all 0.25s",
        }} />
      ))}
    </div>
  );
}

// Presets from the "Host Something" chooser → starting photo + event type
const KIND_PRESETS: Record<string, { photoId?: string; eventType?: EventType }> = {
  dinner:      { photoId: "dinner" },
  brunch:      { photoId: "brunch" },
  coffee:      { photoId: "brunch" },
  walk:        { photoId: "walk" },
  museum:      { photoId: "museum" },
  picnic:      { photoId: "walk" },
  "open-seat": { photoId: "dinner" },
  party:       { photoId: "party", eventType: "party" },
};

// ── Main component ────────────────────────────────────────────────────────────
export function EventCreatePage({ initialKind, initialTitle }: { initialKind?: string; initialTitle?: string } = {}) {
  const preset = initialKind ? KIND_PRESETS[initialKind] : undefined;
  const router = useRouter();
  const [step, setStep]             = useState(1);
  const [eventType, setEventType]   = useState<EventType>(preset?.eventType ?? "gathering");
  const [title, setTitle]           = useState(initialTitle ?? "");
  const [location, setLocation]     = useState("");
  const [date, setDate]             = useState("");
  const [time, setTime]             = useState("");
  const [description, setDesc]      = useState("");
  const [accentColor, setAccent]    = useState(PINK);
  const [customColor, setCustom]    = useState(PINK);
  const [fontKey, setFont]          = useState("playfair");
  const [photoId, setPhoto]         = useState<string | null>(preset?.photoId ?? null);
  const [uploading, setUploading]   = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const fileRef                     = useRef<HTMLInputElement>(null);

  const TOTAL_STEPS = 4;

  // Derived preview data
  const previewEv: EventCardData = {
    id: "preview",
    type: eventType,
    title: title || "Your Event Title",
    location: location || "New York City",
    date: date || "JUN 15",
    time: time || "7:00 PM",
    spotsLeft: 8,
    going: 12,
    accentColor,
    href: "#",
  };

  function PreviewCard() {
    if (eventType === "concert")    return <TicketCard ev={previewEv} />;
    if (eventType === "party")      return <PosterCard ev={previewEv} />;
    if (eventType === "invitation") return <InvitationEventCard ev={previewEv} />;
    return <GatheringCard ev={previewEv} />;
  }

  // ── Steps ────────────────────────────────────────────────────────────────
  function Step1() {
    return (
      <div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.35)", marginBottom: 16 }}>WHAT KIND OF EVENT?</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {EVENT_TYPES.map(et => {
            const active = eventType === et.type;
            return (
              <button key={et.type} onClick={() => setEventType(et.type)} style={{
                background: active ? `${PINK}0F` : "white",
                border: `2px solid ${active ? PINK : "rgba(0,0,0,0.08)"}`,
                borderRadius: 16, padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 14,
                cursor: "pointer", textAlign: "left" as const,
                transition: "all 0.18s",
                boxShadow: active ? `0 4px 16px ${PINK}22` : "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: active ? PINK : "rgba(0,0,0,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20,
                  transition: "background 0.18s",
                }}>{et.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 800, color: active ? PINK : DARK }}>{et.label}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.4)", marginTop: 2 }}>{et.desc}</p>
                </div>
                {active && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function Step2() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.35)", marginBottom: 4 }}>FILL IN THE DETAILS</p>

        {[
          { label: "Event title", value: title,    set: setTitle,    placeholder: "e.g. Museum Girls Night Out" },
          { label: "Location",    value: location, set: setLocation, placeholder: "e.g. The Met, Upper East Side" },
          { label: "Date",        value: date,     set: setDate,     placeholder: "e.g. JUN 15" },
          { label: "Time",        value: time,     set: setTime,     placeholder: "e.g. 7:00 PM" },
        ].map(f => (
          <div key={f.label}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(0,0,0,0.4)", marginBottom: 6 }}>{f.label.toUpperCase()}</p>
            <input
              value={f.value}
              onChange={e => f.set(e.target.value)}
              placeholder={f.placeholder}
              style={{
                width: "100%", background: "white",
                border: `1.5px solid ${f.value ? PINK + "55" : "rgba(0,0,0,0.1)"}`,
                borderRadius: 12, padding: "13px 14px",
                fontFamily: "var(--font-jost)", fontSize: "13px", color: DARK,
                outline: "none", boxSizing: "border-box" as const,
                transition: "border-color 0.18s",
              }}
            />
          </div>
        ))}

        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(0,0,0,0.4)", marginBottom: 6 }}>DESCRIPTION (OPTIONAL)</p>
          <textarea
            value={description}
            onChange={e => setDesc(e.target.value)}
            placeholder="Tell your girls what to expect…"
            rows={3}
            style={{
              width: "100%", background: "white",
              border: "1.5px solid rgba(0,0,0,0.1)",
              borderRadius: 12, padding: "13px 14px",
              fontFamily: "var(--font-jost)", fontSize: "13px", color: DARK,
              outline: "none", resize: "none" as const, boxSizing: "border-box" as const,
            }}
          />
        </div>
      </div>
    );
  }

  function Step3() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

        {/* ── COLOR ── */}
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.35)", marginBottom: 12 }}>ACCENT COLOR</p>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 10 }}>
            {COLOR_SWATCHES.map(c => (
              <button key={c} onClick={() => { setAccent(c); setCustom(c); }} style={{
                width: 32, height: 32, borderRadius: "50%", background: c,
                border: accentColor === c ? `3px solid ${DARK}` : "3px solid transparent",
                cursor: "pointer", padding: 0,
                boxShadow: accentColor === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none",
                transition: "all 0.15s",
              }} />
            ))}
          </div>
          {/* Custom color input */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="color"
              value={customColor}
              onChange={e => { setCustom(e.target.value); setAccent(e.target.value); }}
              style={{ width: 36, height: 36, borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.12)", cursor: "pointer", padding: 2, background: "white" }}
            />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.4)" }}>Pick a custom color</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: DARK, fontVariantNumeric: "tabular-nums" as const }}>{customColor.toUpperCase()}</p>
          </div>
        </div>

        {/* ── FONT ── */}
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.35)", marginBottom: 12 }}>FONT STYLE</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            {FONTS.map(f => {
              const active = fontKey === f.key;
              return (
                <button key={f.key} onClick={() => setFont(f.key)} style={{
                  padding: "10px 16px", borderRadius: 12,
                  border: `2px solid ${active ? PINK : "rgba(0,0,0,0.1)"}`,
                  background: active ? `${PINK}0F` : "white",
                  cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  minWidth: 70,
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontFamily: f.family, fontSize: 22, fontWeight: 700, color: active ? PINK : DARK, lineHeight: 1 }}>{f.preview}</span>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: active ? PINK : "rgba(0,0,0,0.4)", letterSpacing: "0.06em" }}>{f.label.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── PHOTO ── */}
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.35)", marginBottom: 12 }}>PHOTO</p>

          {/* Upload button */}
          <button onClick={() => fileRef.current?.click()} style={{
            width: "100%", background: "white",
            border: "2px dashed rgba(255,31,125,0.3)", borderRadius: 14,
            padding: "14px", cursor: "pointer", marginBottom: 12,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: PINK }}>Upload your photo</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={() => setUploading(false)} />

          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(0,0,0,0.3)", textAlign: "center" as const, marginBottom: 12 }}>— or choose from stock —</p>

          {/* Stock photo grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {STOCK_PHOTOS.map(sp => {
              const active = photoId === sp.id;
              return (
                <button key={sp.id} onClick={() => setPhoto(active ? null : sp.id)} style={{
                  background: sp.gradient, borderRadius: 10,
                  border: `2.5px solid ${active ? DARK : "transparent"}`,
                  height: 60, cursor: "pointer", padding: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
                  boxShadow: active ? `0 0 0 2px white, 0 0 0 4px ${DARK}` : "none",
                  transition: "all 0.15s",
                  overflow: "hidden",
                  position: "relative",
                }}>
                  <span style={{ fontSize: 20 }}>{sp.emoji}</span>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "white", letterSpacing: "0.08em" }}>{sp.label.toUpperCase()}</span>
                  {active && (
                    <div style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: DARK, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function Step4() {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.35)" }}>YOUR CARD PREVIEW</p>

        {/* Card preview — centered */}
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 16px" }}>
          <div style={{ transform: "scale(0.92)", transformOrigin: "top center" }}>
            <PreviewCard />
          </div>
        </div>

        {/* Summary */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
          {[
            { label: "Type",     value: eventType.charAt(0).toUpperCase() + eventType.slice(1) },
            { label: "Title",    value: title || "—" },
            { label: "Location", value: location || "—" },
            { label: "Date",     value: date || "—" },
            { label: "Time",     value: time || "—" },
          ].map((r, i, arr) => (
            <div key={r.label} style={{
              display: "flex", justifyContent: "space-between", padding: "12px 16px",
              borderBottom: i < arr.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 600, color: "rgba(0,0,0,0.35)" }}>{r.label}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: DARK }}>{r.value}</p>
            </div>
          ))}
        </div>

        {publishError && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "#C01040", textAlign: "center" }}>{publishError}</p>
        )}

        {/* Publish */}
        <button
          disabled={publishing}
          onClick={async () => {
            if (!title || !date || !time) { setPublishError("Please fill in title, date, and time."); return; }
            setPublishing(true);
            setPublishError(null);
            try {
              const dateTime = new Date(`${date}T${time}`).toISOString();
              await createEvent({
                title,
                description: description || undefined,
                venue: location || undefined,
                date_time: dateTime,
                category: eventType === "gathering" ? "social" : eventType === "concert" ? "culture" : "social",
                accent_color: accentColor,
                photo_url: photoId ?? undefined,
              });
              router.push("/member/happenings");
            } catch (e) {
              setPublishError((e as Error).message ?? "Failed to publish. Try again.");
              setPublishing(false);
            }
          }}
          style={{
            background: publishing ? "#AAA" : PINK, borderRadius: 999, padding: "16px",
            border: "none", cursor: publishing ? "not-allowed" : "pointer",
            boxShadow: publishing ? "none" : `0 6px 24px ${PINK}55`,
          }}
        >
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 900, letterSpacing: "0.1em", color: "white" }}>
            {publishing ? "PUBLISHING…" : "PUBLISH EVENT →"}
          </p>
        </button>
      </div>
    );
  }

  const stepContent = [Step1, Step2, Step3, Step4];
  const StepContent = stepContent[step - 1];

  const STEP_TITLES = ["Choose Type", "Event Details", "Make It Yours", "Preview & Publish"];

  return (
    <div style={{ minHeight: "100vh", background: "#F9F4EE", paddingBottom: 40 }}>

      {/* ── TOP BAR ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        paddingTop: "env(safe-area-inset-top, 0px)",
        background: "rgba(249,244,238,0.97)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <div style={{ height: 54, display: "flex", alignItems: "center", padding: "0 18px", gap: 14 }}>
          <Link href="/member/happenings" style={{ display: "flex" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 18, color: DARK, lineHeight: 1 }}>
              {STEP_TITLES[step - 1]}
            </p>
          </div>
          <Stepper step={step} total={TOTAL_STEPS} />
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ paddingTop: "calc(54px + env(safe-area-inset-top, 0px))", padding: "calc(54px + env(safe-area-inset-top, 0px)) 18px 24px" }}>
        <StepContent />
      </div>

      {/* ── BOTTOM NAVIGATION ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(249,244,238,0.97)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        padding: "12px 18px calc(env(safe-area-inset-bottom,0px) + 12px)",
        display: "flex", gap: 10,
      }}>
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            flex: 1, background: "white", border: "1.5px solid rgba(0,0,0,0.1)",
            borderRadius: 999, padding: "14px", cursor: "pointer",
          }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 800, color: "rgba(0,0,0,0.5)" }}>← BACK</p>
          </button>
        )}
        {step < TOTAL_STEPS && (
          <button onClick={() => setStep(s => s + 1)} style={{
            flex: 2, background: PINK, border: "none",
            borderRadius: 999, padding: "14px", cursor: "pointer",
            boxShadow: `0 4px 18px ${PINK}55`,
          }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 900, letterSpacing: "0.08em", color: "white" }}>
              {step === TOTAL_STEPS - 1 ? "PREVIEW →" : "NEXT →"}
            </p>
          </button>
        )}
      </div>
    </div>
  );
}
