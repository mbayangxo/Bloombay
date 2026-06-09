"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PosterRenderer } from "@/app/components/poster-templates/poster-renderer";
import { MediaUpload } from "./media-upload";
import {
  HAPPENING_EVENT_TYPES,
  getVariantsForType,
  getVariant,
  getEventTypeMeta,
} from "@/lib/happenings/event-type-templates";
import type { PosterTemplateType } from "@/lib/poster-templates/types";
import { MEDIA_BUCKETS } from "@/lib/media/buckets";
import { posterTemplateLabel } from "@/lib/poster-templates/types";
import "@/app/styles/bb-happening-studio.css";

const STEPS = ["Event type", "Poster template", "Photo", "Details", "Publish"];

export function CreateHappeningStudio() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [eventType, setEventType] = useState<PosterTemplateType>("party");
  const [variantId, setVariantId] = useState("party-neon");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [useStockPhoto, setUseStockPhoto] = useState(true);

  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [capacity, setCapacity] = useState(8);
  const [priceInput, setPriceInput] = useState("");
  const [priceCents, setPriceCents] = useState(0);
  const [photoFocusX, setPhotoFocusX] = useState(50);
  const [photoFocusY, setPhotoFocusY] = useState(50);
  const [description, setDescription] = useState("");
  const [hostName, setHostName] = useState("");
  const [clubSlug, setClubSlug] = useState("");

  const variants = useMemo(() => getVariantsForType(eventType), [eventType]);
  const variant = getVariant(eventType, variantId);
  const meta = getEventTypeMeta(eventType);
  const accent = variant.accentColor;
  const displayImage = imageUrl ?? (useStockPhoto ? variant.stockImageUrl : null);

  const previewPoster = useMemo(() => {
    const start = startsAt ? new Date(startsAt) : new Date();
    return {
      id: "preview",
      template: eventType,
      title: title || "Your happening title",
      category: meta.categoryLabel,
      date: start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      time: start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      location: [venue, neighborhood].filter(Boolean).join(" · ") || "NYC",
      seatsLeft: capacity,
      hostName: hostName || undefined,
      imageUrl: displayImage ?? variant.stockImageUrl,
      accentColor: accent,
      ctaLabel: "Reserve seat",
    };
  }, [eventType, title, meta, startsAt, venue, neighborhood, capacity, hostName, displayImage, variant, accent]);

  function onTypePick(type: PosterTemplateType) {
    setEventType(type);
    const first = getVariantsForType(type)[0];
    if (first) setVariantId(first.id);
  }

  function canNext(): boolean {
    if (step === 0) return Boolean(eventType);
    if (step === 1) return Boolean(variantId);
    if (step === 2) return Boolean(displayImage);
    if (step === 3) return title.trim().length >= 3 && venue.trim().length >= 2 && Boolean(startsAt);
    return true;
  }

  async function publish() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/member/gatherings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        startsAt: new Date(startsAt).toISOString(),
        venue: venue.trim(),
        neighborhood: neighborhood.trim() || undefined,
        area: neighborhood.trim() || undefined,
        capacity,
        clubSlug: clubSlug.trim() || undefined,
        eventType,
        posterVariant: variantId,
        imageUrl: displayImage,
        description: description.trim() || undefined,
        priceCents,
        hostName: hostName.trim() || undefined,
      }),
    });
    setBusy(false);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error ?? "Could not create happening. Sign in and run migration 018.");
      return;
    }
    router.push(`/member/happenings/${json.gathering.slug}`);
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#FDFAF5" }}>
      <div className="px-5 pt-12 pb-4 max-w-lg mx-auto">
        <Link href="/member/happenings" className="text-sm font-semibold mb-4 inline-block" style={{ color: "#FF1F7D" }}>
          ← Happenings
        </Link>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#FF1F7D" }}>
          CREATE HAPPENING
        </p>
        <h1 className="text-3xl font-bold italic mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>
          Post your plan
        </h1>
        <p className="text-sm mb-6" style={{ color: "#888" }}>
          Pick your event type, choose a poster template made for that vibe, add your photo and details.
        </p>

        <div className="flex gap-1 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div className="h-1 rounded-full mb-1" style={{ background: i <= step ? accent : "rgba(0,0,0,0.08)" }} />
              <p className="text-[8px] font-bold uppercase truncate" style={{ color: i === step ? accent : "#bbb" }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="grid grid-cols-2 gap-2">
            {HAPPENING_EVENT_TYPES.map((et) => (
              <button
                key={et.type}
                type="button"
                onClick={() => onTypePick(et.type)}
                className="rounded-2xl p-4 text-left"
                style={{
                  background: "white",
                  border: eventType === et.type ? `2px solid ${accent}` : "1.5px solid #eee",
                }}
              >
                <p className="font-bold text-sm" style={{ color: "#111" }}>
                  {et.label}
                </p>
                <p className="text-[11px] mt-1 leading-snug" style={{ color: "#888" }}>
                  {et.description}
                </p>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold" style={{ color: "#111" }}>
              {posterTemplateLabel(eventType)} — swipe to browse
            </p>
            <div className="bb-happening-studio__template-rail">
              {variants.map((v) => {
                const thumb = {
                  ...previewPoster,
                  accentColor: v.accentColor,
                  imageUrl: v.stockImageUrl,
                  ctaLabel: undefined,
                  href: undefined,
                };
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    className={`bb-happening-studio__template-card${variantId === v.id ? " bb-happening-studio__template-card--on" : ""}`}
                  >
                    <div className="bb-happening-studio__template-preview">
                      <PosterRenderer data={thumb} />
                    </div>
                    <span className="bb-happening-studio__template-label">{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold" style={{ color: "#111" }}>
              Add your photo
            </p>
            <MediaUpload
              bucket={MEDIA_BUCKETS.memberMemories}
              storagePath={`happenings/${Date.now()}-cover`}
              currentUrl={imageUrl}
              label="Upload cover photo"
              onUploaded={(url) => {
                setImageUrl(url);
                setUseStockPhoto(false);
              }}
            />
            <button
              type="button"
              onClick={() => {
                setImageUrl(null);
                setUseStockPhoto(true);
              }}
              className="rounded-2xl p-3 text-left flex gap-3 items-center"
              style={{
                background: useStockPhoto && !imageUrl ? `${accent}14` : "white",
                border: useStockPhoto && !imageUrl ? `2px solid ${accent}` : "1.5px solid #eee",
              }}
            >
              <div
                className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: `url(${variant.stockImageUrl})` }}
              />
              <div>
                <p className="font-bold text-sm" style={{ color: "#111" }}>
                  Use BloomBay stock photo
                </p>
                <p className="text-xs" style={{ color: "#888" }}>
                  Generic {meta.label.toLowerCase()} image — swap anytime later.
                </p>
              </div>
            </button>
            {displayImage ? (
              <>
                <div
                  className="bb-happening-studio__photo-stage bb-happening-studio__photo-pos"
                  style={{ "--bb-photo-pos": `${photoFocusX}% ${photoFocusY}%` } as CSSProperties}
                >
                  <PosterRenderer data={{ ...previewPoster, ctaLabel: undefined, href: undefined }} />
                </div>
                <div className="bb-happening-studio__photo-tune">
                  <label>
                    Horizontal crop
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={photoFocusX}
                      onChange={(e) => setPhotoFocusX(Number(e.target.value))}
                    />
                  </label>
                  <label>
                    Vertical crop
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={photoFocusY}
                      onChange={(e) => setPhotoFocusY(Number(e.target.value))}
                    />
                  </label>
                </div>
              </>
            ) : null}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Happening title"
              className="w-full rounded-2xl px-4 py-3.5 text-sm bg-white outline-none"
              style={{ border: "1.5px solid #FFE0EE" }}
            />
            <input
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Venue name"
              className="w-full rounded-2xl px-4 py-3.5 text-sm bg-white outline-none"
              style={{ border: "1.5px solid #FFE0EE" }}
            />
            <input
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Neighborhood (e.g. Williamsburg)"
              className="w-full rounded-2xl px-4 py-3.5 text-sm bg-white outline-none"
              style={{ border: "1.5px solid #FFE0EE" }}
            />
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="w-full rounded-2xl px-4 py-3.5 text-sm bg-white outline-none"
              style={{ border: "1.5px solid #FFE0EE" }}
            />
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-bold uppercase" style={{ color: "#bbb" }}>
                Seats
                <input
                  type="number"
                  min={2}
                  max={50}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full mt-1 rounded-xl px-3 py-2 text-sm bg-white"
                  style={{ border: "1.5px solid #eee" }}
                />
              </label>
              <label className="text-xs font-bold uppercase" style={{ color: "#bbb" }}>
                Price ($)
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  value={priceInput}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v !== "" && !/^\d*\.?\d{0,2}$/.test(v)) return;
                    setPriceInput(v);
                    setPriceCents(v === "" ? 0 : Math.round(parseFloat(v) * 100) || 0);
                  }}
                  className="w-full mt-1 rounded-xl px-3 py-2 text-sm bg-white"
                  style={{ border: "1.5px solid #eee" }}
                />
              </label>
            </div>
            <input
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="Host name (optional)"
              className="w-full rounded-2xl px-4 py-3 text-sm bg-white outline-none"
              style={{ border: "1.5px solid #FFE0EE" }}
            />
            <input
              value={clubSlug}
              onChange={(e) => setClubSlug(e.target.value)}
              placeholder="Club slug (optional)"
              className="w-full rounded-2xl px-4 py-3 text-sm bg-white outline-none"
              style={{ border: "1.5px solid #FFE0EE" }}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What should women know before they RSVP?"
              className="w-full rounded-2xl px-4 py-3 text-sm bg-white outline-none resize-none"
              style={{ border: "1.5px solid #FFE0EE" }}
            />
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-4 items-center">
            <div className="w-full max-w-[280px]">
              <PosterRenderer data={previewPoster} />
            </div>
            {error ? (
              <p className="text-sm text-center" style={{ color: "#FF1F7D" }}>
                {error}
              </p>
            ) : null}
          </div>
        )}

        <div className="flex gap-3 mt-8">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-4 rounded-2xl text-sm font-bold"
              style={{ background: "rgba(0,0,0,0.06)", color: "#666" }}
            >
              Back
            </button>
          ) : null}
          <button
            type="button"
            disabled={!canNext() || busy}
            onClick={() => {
              if (step < STEPS.length - 1) setStep((s) => s + 1);
              else void publish();
            }}
            className="flex-1 py-4 rounded-2xl text-sm font-bold text-white disabled:opacity-50"
            style={{ background: accent, boxShadow: `0 6px 20px ${accent}44` }}
          >
            {busy ? "Publishing…" : step === STEPS.length - 1 ? "Publish happening →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
