"use client";

import { useState, useEffect } from "react";

// ── Real data types ───────────────────────────────────────────────────────────

interface VenueInfo { id: string; name: string; type: string; neighborhood: string; tagline: string; about: string; brand_color: string; cover_url: string | null; bloom_notes: number; avg_rating: number; review_count: number; }
interface VenueReservation { id: string; guest: string; date: string; time: string; party_size: number; notes?: string | null; }
interface VenueReview { author: string; text: string; rating: number; }
interface VenueStats { total_upcoming: number; total_past: number; pending_requests: number; avg_rating: number; }
interface PartnerNotification { id: string; title: string; body: string | null; read: boolean; created_at: string; }

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

// ── Types ──────────────────────────────────────────────────────────────────

type Tab =
  | "profile"
  | "gatherings"
  | "women-hosted"
  | "rating"
  | "requests"
  | "mailbox"
  | "perks"
  | "templates";

// ── SVG Icons ──────────────────────────────────────────────────────────────

function IconBuilding({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 9h1v1H9zM14 9h1v1h-1zM9 14h1v1H9zM14 14h1v1h-1z" strokeWidth="0" fill="currentColor" />
      <line x1="9" y1="21" x2="9" y2="9" />
      <line x1="15" y1="21" x2="15" y2="9" />
    </svg>
  );
}

function IconCalendar({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconUsers({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconStar({ size = 16, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconInbox({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function IconClipboard({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function IconAward({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconTemplate({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

// ── Template data ──────────────────────────────────────────────────────────

const FOOD_TEMPLATES = [
  { name: "Hero Product",      file: "01_Hero_Product.png"     },
  { name: "Promotion",         file: "02_Promotion.png"        },
  { name: "Open Hours",        file: "03_Open_Hours.png"       },
  { name: "Menu Card",         file: "04_Menu_Card.png"        },
  { name: "Founder Story",     file: "05_Founder_Story.png"    },
  { name: "Loyalty Card",      file: "06_Loyalty_Card.png"     },
  { name: "Mood Board",        file: "07_Mood_Board.png"       },
  { name: "New On The Menu",   file: "08_New_On_The_Menu.png"  },
];

const EVENT_TEMPLATES = [
  { name: "Book Society",   file: "Event_Book_Society.png"   },
  { name: "Dinner Society", file: "Event_Dinner_Society.png" },
  { name: "Museum Girls",   file: "Event_Museum_Girls.png"   },
  { name: "Sunday Walk",    file: "Event_Sunday_Walk.png"    },
];

const TICKET_TEMPLATES = [
  { name: "Dinner Society",       file: "Ticket_Dinner_Society.png"     },
  { name: "Girls Night",          file: "Ticket_Girls_Night.png"        },
  { name: "Museum Exhibition",    file: "Ticket_Museum_Exhibition.png"  },
  { name: "NYC → Marrakech",      file: "Ticket_NYC_Marrakech.png"      },
];

// ── Silhouette Rule: Bloom petal mark for Studio ──────────────────────────
// At first glance: a grid/layout icon. Second glance: six petals around a centre.
function StudioBloomMark({ size = 20, color = "#FF1F7D" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2" fill={color} />
      {[0,1,2,3,4,5].map(i => {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const cx = 10 + Math.cos(angle) * 5.5;
        const cy = 10 + Math.sin(angle) * 5.5;
        return (
          <ellipse
            key={i}
            cx={cx} cy={cy}
            rx="2.5" ry="1.4"
            fill={color}
            opacity="0.6"
            transform={`rotate(${(i / 6) * 360}, ${cx}, ${cy})`}
          />
        );
      })}
    </svg>
  );
}

// ── Template Studio ────────────────────────────────────────────────────────

type StudioTemplate = {
  name: string;
  src: string;
  category: "food" | "event" | "ticket";
};

const ALL_STUDIO_TEMPLATES: StudioTemplate[] = [
  ...FOOD_TEMPLATES.map(t => ({ ...t, src: `/food templates/${t.file}`, category: "food" as const })),
  ...EVENT_TEMPLATES.map(t => ({ ...t, src: `/club gatherings,casual gatherings templates/${t.file}`, category: "event" as const })),
  ...TICKET_TEMPLATES.map(t => ({ ...t, src: `/tickets templates/${t.file}`, category: "ticket" as const })),
];

type StudioCat = "all" | "food" | "event" | "ticket";

function TemplateStudioCard({
  name,
  src,
  onCustomize,
}: {
  name: string;
  src: string;
  onCustomize: () => void;
}) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,31,125,0.08)" }}
    >
      <div style={{ height: 160, background: "#FFF0F5", position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
        {/* Hover overlay with Customize CTA */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
          style={{ background: "rgba(17,17,17,0.72)" }}
        >
          <button
            onClick={onCustomize}
            className="px-4 py-2 rounded-full text-xs font-bold text-white"
            style={{ background: "#FF1F7D", boxShadow: "0 2px 0 rgba(150,0,55,0.8)" }}
          >
            Customize →
          </button>
        </div>
      </div>
      <div className="p-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold truncate" style={{ color: "#111111" }}>{name}</p>
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={onCustomize}
            className="px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: "#FFF0F5", color: "#FF1F7D" }}
          >
            Studio
          </button>
          <a
            href={src}
            download
            className="px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: "#F5F5F5", color: "#666", textDecoration: "none" }}
          >
            ↓
          </a>
        </div>
      </div>
    </div>
  );
}

function BrandStudioSheet({
  template,
  onClose,
}: {
  template: StudioTemplate;
  onClose: () => void;
}) {
  const [venueName, setVenueName]   = useState("Ladurée SoHo");
  const [tagline,   setTagline]     = useState("Parisian patisserie meets NYC girl culture.");
  const [brandColor, setBrandColor] = useState("#FF1F7D");
  const [copied,    setCopied]      = useState(false);

  function handleCopyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[200]"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-[201] rounded-t-3xl overflow-y-auto"
        style={{ background: "#FEFCF7", maxHeight: "92vh", boxShadow: "0 -8px 40px rgba(0,0,0,0.22)" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
        </div>

        <div className="px-6 pb-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-5 mt-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StudioBloomMark size={16} />
                <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "#FF1F7D" }}>TEMPLATE STUDIO</p>
              </div>
              <p className="text-xl font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>
                Brand your template.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(0,0,0,0.07)" }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
            </button>
          </div>

          {/* Live preview */}
          <div
            className="rounded-2xl overflow-hidden mb-6 relative"
            style={{ height: 200, background: "#000" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={template.src}
              alt={template.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", opacity: 0.82 }}
            />
            {/* Brand overlay */}
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(to bottom, transparent 30%, ${brandColor}ee 100%)` }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p
                className="text-white font-bold text-lg leading-tight"
                style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
              >
                {venueName || "Your Venue"}
              </p>
              <p className="text-white text-xs mt-1" style={{ opacity: 0.75 }}>
                {tagline || "Your tagline here"}
              </p>
              {/* Silhouette Rule: the BB mark bottom-right secretly contains a bloom geometry */}
              <div className="absolute bottom-4 right-4">
                <StudioBloomMark size={18} color="rgba(255,255,255,0.45)" />
              </div>
            </div>
          </div>

          {/* Brand controls */}
          <div className="flex flex-col gap-4">
            {/* Venue name */}
            <div>
              <p className="text-xs font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "#aaa" }}>Venue Name</p>
              <input
                value={venueName}
                onChange={e => setVenueName(e.target.value)}
                placeholder="Your venue name"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "white", border: "1.5px solid #F0E0E8", color: "#111" }}
              />
            </div>

            {/* Tagline */}
            <div>
              <p className="text-xs font-bold tracking-[0.15em] uppercase mb-1.5" style={{ color: "#aaa" }}>Tagline</p>
              <input
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="A short line about your space"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "white", border: "1.5px solid #F0E0E8", color: "#111" }}
              />
            </div>

            {/* Brand colour */}
            <div>
              <p className="text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: "#aaa" }}>Brand Colour</p>
              <div className="flex gap-3 items-center flex-wrap">
                {["#FF1F7D","#111111","#C9A27A","#7B5EA7","#E87040","#2E6B9E"].map(c => (
                  <button
                    key={c}
                    onClick={() => setBrandColor(c)}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    style={{
                      background: c,
                      border: brandColor === c ? "3px solid #111" : "2px solid transparent",
                      outline: brandColor === c ? "2px solid white" : "none",
                      outlineOffset: 1,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                    }}
                  />
                ))}
                <label className="cursor-pointer">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={e => setBrandColor(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "#F5F5F5", color: "#999", border: "1.5px dashed #ddd" }}
                  >
                    +
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <a
                href={template.src}
                download
                className="flex-1 py-3.5 rounded-xl text-sm font-bold text-center"
                style={{ background: "#111", color: "white", textDecoration: "none", boxShadow: "0 2px 0 rgba(0,0,0,0.5)" }}
              >
                Download base →
              </a>
              <button
                onClick={handleCopyLink}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold"
                style={{ background: "#FFF0F5", color: "#FF1F7D", border: "1.5px solid rgba(255,31,125,0.2)" }}
              >
                {copied ? "Copied ✦" : "Copy share link"}
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Download the base, then open in Canva or Adobe Express to apply your branding above. Tag <strong style={{ color: "#FF1F7D" }}>@bloombay</strong> when you post.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function TemplateCard({ name, src }: { name: string; src: string }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid rgba(255,31,125,0.08)" }}
    >
      <div style={{ height: 180, background: "#FFF0F5", position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      </div>
      <div className="p-4 flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: "#111111" }}>{name}</p>
        <a
          href={src}
          download
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ background: "#FFF0F5", color: "#FF1F7D", textDecoration: "none" }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Save
        </a>
      </div>
    </div>
  );
}

function TemplatesSection() {
  const [activeStudioCat, setActiveStudioCat] = useState<StudioCat>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<StudioTemplate | null>(null);

  const filtered = activeStudioCat === "all"
    ? ALL_STUDIO_TEMPLATES
    : ALL_STUDIO_TEMPLATES.filter(t => t.category === activeStudioCat);

  const CAT_LABELS: { id: StudioCat; label: string }[] = [
    { id: "all",    label: "All" },
    { id: "food",   label: "Food & Venue" },
    { id: "event",  label: "Events" },
    { id: "ticket", label: "Tickets" },
  ];

  return (
    <div className="max-w-4xl">
      {/* Studio header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StudioBloomMark size={18} />
            <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Template Studio</h2>
          </div>
          <p className="text-sm text-gray-400">
            Pick a template, brand it with your venue colours and name, then share.
          </p>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CAT_LABELS.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveStudioCat(c.id)}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
            style={
              activeStudioCat === c.id
                ? { background: "#111", color: "white" }
                : { background: "#F5F5F5", color: "#666" }
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {filtered.map((t, i) => (
          <TemplateStudioCard
            key={i}
            name={t.name}
            src={t.src}
            onCustomize={() => setSelectedTemplate(t)}
          />
        ))}
      </div>

      {/* Usage tip */}
      <div
        className="rounded-2xl p-5 flex items-start gap-3"
        style={{ background: "#FFF0F5", border: "1px solid rgba(255,31,125,0.12)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#111111" }}>How Template Studio works</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Hit <strong style={{ color: "#111" }}>Studio</strong> on any template to preview it with your venue branding. Download the base, finish in Canva or Adobe Express, and tag <strong style={{ color: "#FF1F7D" }}>@bloombay</strong> when you post.
          </p>
        </div>
      </div>

      {/* Brand studio sheet */}
      {selectedTemplate && (
        <BrandStudioSheet
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
}

// ── Star Rating Display ────────────────────────────────────────────────────

function StarRating({ rating, max = 5, size = 16 }: { rating: number; max?: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          style={{ color: i < Math.round(rating) ? "#FF1F7D" : "#E5D0DC" }}
        >
          <IconStar size={size} filled={i < Math.round(rating)} />
        </span>
      ))}
    </div>
  );
}

// ── Tab configuration ──────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
  { id: "profile", label: "Profile", icon: <IconBuilding size={15} /> },
  { id: "gatherings", label: "Upcoming Gatherings", icon: <IconCalendar size={15} /> },
  { id: "women-hosted", label: "Women Hosted", icon: <IconUsers size={15} /> },
  { id: "rating", label: "Rating", icon: <IconStar size={15} /> },
  { id: "requests", label: "Requests", icon: <IconClipboard size={15} /> },
  { id: "mailbox", label: "Mailbox", icon: <IconInbox size={15} /> },
  { id: "perks", label: "Partner Perks", icon: <IconAward size={15} /> },
  { id: "templates", label: "Template Studio", icon: <IconTemplate size={15} /> },
];

// ── Section Components ─────────────────────────────────────────────────────

function ProfileSection({ showToast }: { showToast: (msg: string) => void }) {
  return (
    <div className="max-w-2xl">
      <div className="mb-5">
        <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Venue Profile</h2>
        <p className="text-sm text-gray-400 mt-0.5">How BloomBay women see your venue</p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Venue name */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Venue Name</p>
          <p className="font-bold text-xl" style={{ color: "#111111" }}>Ladurée SoHo</p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Description</p>
          <p className="text-sm leading-relaxed" style={{ color: "#444" }}>
            Parisian patisserie meets NYC girl culture. The perfect brunch spot.
          </p>
          <button className="mt-3 text-xs font-semibold" style={{ color: "#FF1F7D" }} onClick={() => {}}>Edit description</button>
        </div>

        {/* Neighborhood */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Neighborhood</p>
          <p className="text-sm font-semibold" style={{ color: "#111111" }}>SoHo, Manhattan</p>
        </div>

        {/* Photos placeholder */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Photos</p>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="aspect-video rounded-xl flex items-center justify-center text-xs text-gray-400 border-2 border-dashed"
                style={{ borderColor: "#FFE0EE", background: "#FFF8FB" }}
              >
                {n === 1 ? "Add photo" : "+"}
              </div>
            ))}
          </div>
          <button className="mt-3 text-xs font-semibold" style={{ color: "#FF1F7D" }} onClick={() => {}}>Upload photos</button>
        </div>
      </div>
    </div>
  );
}

function GatheringsSection({ upcoming }: { upcoming: VenueReservation[] }) {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Upcoming Reservations</h2>
        <p className="text-sm text-gray-400 mt-0.5">{upcoming.length} BloomBay bookings at your venue</p>
      </div>

      <div className="flex flex-col gap-3">
        {upcoming.map((g) => (
          <div
            key={g.id}
            className="bg-white rounded-2xl p-5 flex items-center gap-5"
            style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
          >
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm" style={{ color: "#111111" }}>{g.guest}</p>
              <p className="text-xs text-gray-400 mt-0.5">{g.date} · {g.time}</p>
              {g.notes && <p className="text-xs text-gray-400 mt-0.5 italic">&ldquo;{g.notes}&rdquo;</p>}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-sm" style={{ color: "#111111" }}>{g.party_size} guests</p>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 inline-block" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>
                Confirmed
              </span>
            </div>
          </div>
        ))}
        {upcoming.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <p className="text-sm text-gray-400">No upcoming reservations yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function WomenHostedSection({ past, stats }: { past: VenueReservation[]; stats: VenueStats | null }) {
  const totalGuests = past.reduce((sum, r) => sum + r.party_size, 0);

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <p className="text-4xl font-bold" style={{ color: "#FF1F7D", fontFamily: "var(--font-playfair)" }}>
            {totalGuests}
          </p>
          <p className="font-semibold text-sm mt-1.5" style={{ color: "#111111" }}>Total Women Hosted</p>
          <p className="text-xs text-gray-400 mt-0.5">via BloomBay</p>
        </div>
        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <p className="text-4xl font-bold" style={{ color: "#FF1F7D", fontFamily: "var(--font-playfair)" }}>
            {stats?.total_past ?? 0}
          </p>
          <p className="font-semibold text-sm mt-1.5" style={{ color: "#111111" }}>Past Visits</p>
          <p className="text-xs text-gray-400 mt-0.5">BloomBay reservations</p>
        </div>
      </div>

      {/* Recent visits */}
      <div className="mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-3">Recent Visits</h3>
        <div className="flex flex-col gap-2">
          {past.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl px-5 py-3.5 flex items-center gap-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "#FF1F7D" }}>
                {v.guest[0] ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: "#111111" }}>{v.guest}</p>
                <p className="text-xs text-gray-400 truncate">{v.date}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-semibold" style={{ color: "#111111" }}>{v.party_size} {v.party_size === 1 ? "guest" : "guests"}</p>
              </div>
            </div>
          ))}
          {past.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <p className="text-sm text-gray-400">No past visits yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RatingSection({ reviews, avgRating, reviewCount }: { reviews: VenueReview[]; avgRating: number; reviewCount: number }) {
  return (
    <div>
      {/* Overall rating */}
      <div
        className="bg-white rounded-2xl p-6 mb-5 flex items-center gap-6"
        style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
      >
        <div className="text-center flex-shrink-0">
          <p className="text-6xl font-bold" style={{ color: "#FF1F7D", fontFamily: "var(--font-playfair)", lineHeight: 1 }}>
            {avgRating > 0 ? avgRating.toFixed(1) : "—"}
          </p>
          <p className="text-xs text-gray-400 mt-1">out of 5</p>
        </div>
        <div>
          {avgRating > 0 && <StarRating rating={avgRating} size={22} />}
          <p className="text-sm text-gray-500 mt-2">
            From <span className="font-semibold" style={{ color: "#111111" }}>{reviewCount}</span> BloomBay women
          </p>
          <p className="text-xs text-gray-400 mt-0.5">BloomBay Rating — verified visits only</p>
        </div>
      </div>

      {/* Reviews */}
      <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-3">Written Reviews</h3>
      <div className="flex flex-col gap-3">
        {reviews.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "#FF1F7D" }}>
                  {r.author[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#111111" }}>{r.author}</p>
                </div>
              </div>
              <StarRating rating={r.rating} size={13} />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#555", fontStyle: "italic" }}>
              &ldquo;{r.text}&rdquo;
            </p>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <p className="text-sm text-gray-400">No reviews yet. Your first BloomBay visitors will leave reviews here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RequestsSection({
  pending_requests,
  onDecided,
  showToast,
}: {
  pending_requests: VenueReservation[];
  onDecided: (id: string) => void;
  showToast: (msg: string) => void;
}) {
  const [handled, setHandled] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<Set<string>>(new Set());

  async function decide(id: string, status: "confirmed" | "cancelled") {
    setBusy(prev => new Set([...prev, id]));
    try {
      const res = await fetch("/api/reservations/confirm", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast((data as { error?: string }).error ?? "Couldn't update that request. Try again.");
        return;
      }
      setHandled(prev => new Set([...prev, id]));
      onDecided(id);
      showToast(status === "confirmed" ? "Reservation confirmed" : "Reservation declined");
    } catch {
      showToast("Couldn't reach the server. Try again.");
    } finally {
      setBusy(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Booking Requests</h2>
        <p className="text-sm text-gray-400 mt-0.5">{pending_requests.length - handled.size} pending requests</p>
      </div>

      <div className="flex flex-col gap-4">
        {pending_requests.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl p-5"
            style={{
              boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
              opacity: handled.has(r.id) ? 0.45 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-bold text-sm" style={{ color: "#111111" }}>{r.guest}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {r.date}{r.time ? ` · ${r.time}` : ""} · {r.party_size} guests
                </p>
              </div>
              {!handled.has(r.id) && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => decide(r.id, "confirmed")}
                    disabled={busy.has(r.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white disabled:opacity-50"
                    style={{ background: "#111111" }}
                  >
                    <IconCheck size={12} />
                    {busy.has(r.id) ? "Confirming…" : "Confirm"}
                  </button>
                  <button
                    onClick={() => decide(r.id, "cancelled")}
                    disabled={busy.has(r.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold disabled:opacity-50"
                    style={{ background: "#F5F5F5", color: "#999" }}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
            {r.notes && (
              <p
                className="text-sm leading-relaxed rounded-xl px-4 py-3"
                style={{ background: "#FFF8FB", color: "#555", fontStyle: "italic", borderLeft: "2px solid #FFE0EE" }}
              >
                &ldquo;{r.notes}&rdquo;
              </p>
            )}
          </div>
        ))}
        {pending_requests.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <p className="text-sm text-gray-400">No pending booking requests.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MailboxSection({ notifications }: { notifications: PartnerNotification[] }) {
  const unread = notifications.filter(m => !m.read).length;

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Mailbox</h2>
        <p className="text-sm text-gray-400 mt-0.5">{unread} unread messages</p>
      </div>

      <div className="flex flex-col gap-2">
        {notifications.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4"
            style={{
              boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
              borderLeft: !m.read ? "3px solid #111111" : "3px solid transparent",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: !m.read ? "#111111" : "#FFE0EE" }}
            >
              {m.title[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm truncate"
                style={{ color: "#111111", fontWeight: !m.read ? 700 : 500 }}
              >
                {m.title}
              </p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{m.body}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
              <p className="text-xs text-gray-400">{timeAgo(m.created_at)}</p>
              {!m.read && (
                <div className="w-2 h-2 rounded-full" style={{ background: "#FF1F7D" }} />
              )}
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <p className="text-sm text-gray-400">No messages yet — new booking requests will show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PerksSection() {
  return (
    <div className="max-w-xl">
      <div className="mb-5">
        <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Partner Perks</h2>
        <p className="text-sm text-gray-400 mt-0.5">Your active benefits as a Bloom Partner</p>
      </div>

      {/* Bloom Partner Badge */}
      <div
        className="rounded-2xl p-6 mb-4 flex items-center gap-5"
        style={{ background: "#111111" }}
      >
        {/* Badge graphic */}
        <div className="flex-shrink-0">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" stroke="#FF1F7D" strokeWidth="2" />
            <circle cx="32" cy="32" r="24" stroke="#FF1F7D" strokeWidth="0.75" strokeDasharray="2 3" />
            {/* Star / award icon */}
            <polygon
              points="32,14 35.8,25.3 47.8,25.3 38.5,32.3 42.3,43.6 32,36.6 21.7,43.6 25.5,32.3 16.2,25.3 28.2,25.3"
              fill="#FF1F7D"
              fillOpacity="0.2"
              stroke="#FF1F7D"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <polygon
              points="32,18 34.6,26.4 43.6,26.4 36.5,31.6 39.1,40 32,34.8 24.9,40 27.5,31.6 20.4,26.4 29.4,26.4"
              fill="#FF1F7D"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-1" style={{ color: "#FF1F7D" }}>
            BLOOM PARTNER
          </p>
          <p className="text-white font-bold text-lg leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
            Ladurée SoHo
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
            Active since January 2025
          </p>
        </div>
        <div className="ml-auto flex-shrink-0">
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ background: "#FF1F7D", color: "white" }}
          >
            Active
          </span>
        </div>
      </div>

      {/* Individual perks */}
      <div className="flex flex-col gap-3">
        {/* Priority placement */}
        <div
          className="bg-white rounded-2xl p-5 flex items-center gap-4"
          style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#FFF0F5" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ color: "#111111" }}>Priority Placement</p>
            <p className="text-xs text-gray-400 mt-0.5">Your venue appears first in search results for BloomBay women in SoHo</p>
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ background: "#FFF0F5", color: "#FF1F7D" }}
          >
            Active
          </span>
        </div>

        {/* Bloom Partner Badge */}
        <div
          className="bg-white rounded-2xl p-5 flex items-center gap-4"
          style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#FFF0F5" }}
          >
            <IconAward size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ color: "#111111" }}>Bloom Partner Badge</p>
            <p className="text-xs text-gray-400 mt-0.5">Displayed on your venue profile, visible to all BloomBay members</p>
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ background: "#FFF0F5", color: "#FF1F7D" }}
          >
            Active
          </span>
        </div>

        {/* Promotion */}
        <div
          className="rounded-2xl p-5 flex items-start gap-4"
          style={{
            background: "white",
            border: "1.5px solid #FFE0EE",
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#FFF0F5" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-sm" style={{ color: "#111111" }}>Current Promotion</p>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#FF1F7D", color: "white" }}
              >
                Live
              </span>
            </div>
            <p className="text-sm font-bold" style={{ color: "#FF1F7D" }}>
              15% off for BloomBay groups
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Automatically applied to bookings of 4+ women from any BloomBay club
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page Component ─────────────────────────────────────────────────────────

export default function YourVenue() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [toast, setToast] = useState<string | null>(null);
  const [venueInfo, setVenueInfo] = useState<VenueInfo | null>(null);
  const [upcoming, setUpcoming] = useState<VenueReservation[]>([]);
  const [past, setPast] = useState<VenueReservation[]>([]);
  const [pendingRequests, setPendingRequests] = useState<VenueReservation[]>([]);
  const [reviews, setReviews] = useState<VenueReview[]>([]);
  const [stats, setStats] = useState<VenueStats | null>(null);
  const [notifications, setNotifications] = useState<PartnerNotification[]>([]);

  useEffect(() => {
    fetch("/api/partner-portal/my-venue")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setVenueInfo(data.venue);
        setUpcoming(data.upcoming ?? []);
        setPast(data.past ?? []);
        setPendingRequests(data.pending_requests ?? []);
        setReviews(data.reviews ?? []);
        setStats(data.stats ?? null);
      })
      .catch(() => {});

    fetch("/api/partner-portal/messages")
      .then(r => r.ok ? r.json() : [])
      .then(data => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const unreadMessages = notifications.filter(m => !m.read).length;
  const venueName = venueInfo?.name ?? "Your Venue";
  const venueInitial = venueName[0] ?? "V";
  const totalGuestsHosted = past.reduce((sum, r) => sum + r.party_size, 0);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="min-h-screen" style={{ background: "#FFF5F8" }}>
      {/* ── Header ── */}
      <div style={{ background: "#111111" }}>
        {/* Top venue info area */}
        <div className="px-8 pt-8 pb-6 flex items-center gap-6">
          {/* Venue initial / logo block */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <span
              className="text-3xl font-bold"
              style={{ color: "#FF1F7D", fontFamily: "var(--font-playfair)" }}
            >
              {venueInitial}
            </span>
          </div>

          {/* Title block */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.45)" }}>
                Your Venue
              </p>
              {/* Bloom Partner badge inline */}
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: "#FF1F7D", color: "white", letterSpacing: "0.08em" }}
              >
                BLOOM PARTNER
              </span>
            </div>
            <h1
              className="text-2xl font-bold leading-tight text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {venueName}
            </h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
              {venueInfo?.tagline ?? "Parisian patisserie meets NYC girl culture. The perfect brunch spot."}
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-8 flex-shrink-0">
            {[
              { n: venueInfo ? (venueInfo.avg_rating > 0 ? venueInfo.avg_rating.toFixed(1) : "—") : "4.8", l: "Rating" },
              { n: String(past.length > 0 ? totalGuestsHosted : 156), l: "Women Hosted" },
              { n: String(stats ? stats.total_upcoming : upcoming.length || 3), l: "Upcoming" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-2xl font-bold text-white">{s.n}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex items-end px-6 gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const badgeCount = tab.id === "mailbox" ? unreadMessages : undefined;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap rounded-t-xl transition-all"
                style={
                  isActive
                    ? { background: "#FFF5F8", color: "#111111" }
                    : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }
                }
              >
                <span style={{ opacity: isActive ? 1 : 0.7 }}>{tab.icon}</span>
                {tab.label}
                {badgeCount !== undefined && badgeCount > 0 && (
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                    style={{
                      background: isActive ? "#FF1F7D" : "rgba(255,31,125,0.7)",
                      color: "white",
                      fontSize: "10px",
                    }}
                  >
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-8 py-6">
        {activeTab === "profile" && <ProfileSection showToast={showToast} />}
        {activeTab === "gatherings" && <GatheringsSection upcoming={upcoming} />}
        {activeTab === "women-hosted" && <WomenHostedSection past={past} stats={stats} />}
        {activeTab === "rating" && <RatingSection reviews={reviews} avgRating={venueInfo?.avg_rating ?? 0} reviewCount={venueInfo?.review_count ?? 0} />}
        {activeTab === "requests" && (
          <RequestsSection
            pending_requests={pendingRequests}
            onDecided={(id) => setPendingRequests(prev => prev.filter(r => r.id !== id))}
            showToast={showToast}
          />
        )}
        {activeTab === "mailbox" && <MailboxSection notifications={notifications} />}
        {activeTab === "perks" && <PerksSection />}
        {activeTab === "templates" && <TemplatesSection />}
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-sm font-bold text-white z-50" style={{ background: "#111111" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
