"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type MailboxItemType = "letter" | "certificate" | "invitation" | "milestone" | "recognition" | "founders-invitation";

interface MailboxItem {
  id: number;
  type: MailboxItemType;
  from: string;
  initial: string;
  color: string;
  subject: string;
  preview: string;
  date: string;
  opened: boolean;
  body?: string;
  inviteId?: string;
}

const TYPE_ICONS: Record<MailboxItemType, string> = {
  letter:               "✉",
  certificate:          "🏅",
  invitation:           "🎟",
  milestone:            "🌸",
  recognition:          "✦",
  "founders-invitation": "✦",
};

const MAILBOX_ITEMS: MailboxItem[] = [
  // ── Founders Invitation (sealed envelope — top of mailbox) ───────────────────
  {
    id: 0, type: "founders-invitation", from: "BloomBay", initial: "✦", color: "#D4A853",
    subject: "You are invited — Founding 100",
    preview: "A letter from us to you. Personal. Private. Open when you're ready.",
    date: "Jan 2026", opened: false,
    body: "Dear Founding Member,\n\nYou were invited before BloomBay was anything.\n\nWhen this was only an idea — a feeling, really — you said yes. You showed up. You trusted something that hadn't proven itself yet.\n\nOf the women who were there in the beginning, you are one of the first 100. That number is permanent. That place is yours forever.\n\nNo matter how large BloomBay becomes, no matter how many women find their way here — you will always be one of the women who built it from nothing.\n\nWe are so grateful for you.\n\nWith love and intention,\nBloomBay ✦\n\n— You are Founding Member #47. Always.",
  },

  // ── Invitations (matching homepage) ──────────────────────────────────────────
  {
    id: 200, type: "invitation", from: "Aminah M.", initial: "Am", color: "#FF69B4",
    subject: "Girls Dinner · Carbone",
    preview: "Aminah saved you a seat. Tonight 7:30 PM.",
    date: "Tonight", opened: false,
    body: "Aminah saved you a seat at the table. She's been thinking of you. Tonight at Carbone — individual pay, intimate crowd. Come.",
    inviteId: "1",
  },
  {
    id: 201, type: "invitation", from: "Sofia K.", initial: "S", color: "#FF1F7D",
    subject: "Pilates + Matcha Morning",
    preview: "Sofia and 2 others are going. Sunday 9 AM.",
    date: "Sunday", opened: false,
    body: "Sofia thought of you for this one. Pilates, then matcha after. Studio Bloom in Williamsburg. $20. Sunday 9 AM.",
    inviteId: "2",
  },
  {
    id: 202, type: "invitation", from: "Girl Creatives", initial: "GC", color: "#EC4899",
    subject: "MoMA + Froyo After",
    preview: "Girl Creatives are going as a group. Saturday 2 PM.",
    date: "Saturday", opened: false,
    body: "The club is going together — MoMA then froyo after. $1 deposit hold. Saturday 2 PM. You'd fit right in.",
    inviteId: "3",
  },
  {
    id: 203, type: "invitation", from: "African Girls Club", initial: "AG", color: "#FF69B4",
    subject: "You've been invited to join",
    preview: "African Girls Club would like to officially welcome you.",
    date: "May 28", opened: false,
    body: "You have been extended a formal invitation to join African Girls Club.\n\nThis is a curated circle of African women in NYC building community through culture, food, and joy.\n\nAccept your invitation to unlock full club access.",
  },

  // ── Letters ───────────────────────────────────────────────────────────────────
  {
    id: 100, type: "letter", from: "Yande", initial: "Y", color: "#FF1F7D",
    subject: "June Letter from Yande",
    preview: "To every woman who showed up for herself this month — I see you.",
    date: "Jun 1", opened: false,
    body: "Dear Bloom,\n\nThis month I watched women in our community choose softness in the hardest moments. I watched someone sit alone at a gallery opening and own it. I watched a first-time founder raise her hand at a dinner she almost didn't attend.\n\nThat is what BloomBay is. Not the events. Not the platform. The woman who almost didn't come — and did.\n\nWith love,\nYande ✦",
  },
  {
    id: 105, type: "letter", from: "Yande", initial: "Y", color: "#FF1F7D",
    subject: "May Letter from Yande",
    preview: "On rest, resistance, and the radical act of choosing yourself.",
    date: "May 1", opened: true,
    body: "Dear Bloom,\n\nRest is not something you earn. It is something you take.\n\nThis month's letter is about the women in our community who are learning — sometimes painfully — that choosing themselves is not selfish. It is the work.\n\nI love you for being here.\nYande ✦",
  },

  // ── Certificates & Recognition ────────────────────────────────────────────────
  {
    id: 101, type: "certificate", from: "BloomBay", initial: "✦", color: "#D4A853",
    subject: "Original Member Certificate",
    preview: "You are one of the women who built this from nothing.",
    date: "Jan 2026", opened: true,
    body: "This certifies that you are an Original Member of BloomBay.\n\nYou joined before the world knew what this was. Your presence shaped the energy, the standards, and the possibility of this community.\n\nYou are BloomBay.\n\n✦ Certificate #047",
  },
  {
    id: 104, type: "recognition", from: "BloomBay", initial: "✦", color: "#D4A853",
    subject: "Founding Mother Recognition",
    preview: "Your founding membership has been officially recognized.",
    date: "Jan 2026", opened: true,
    body: "You are Founding Mother #47.\n\nOf the women who came when BloomBay was only a vision, you were one of the first 100. That matters more than you know.\n\nYour certificate, your number, and your place in this history are permanent.\n\n#47 · Always. ✦",
  },

  // ── Milestones ────────────────────────────────────────────────────────────────
  {
    id: 103, type: "milestone", from: "BloomBay", initial: "✦", color: "#FF1F7D",
    subject: "You inspired 100 women",
    preview: "100 women have saved or reacted to something you shared.",
    date: "May 15", opened: true,
    body: "100 women have been touched by something you contributed to this community.\n\nA recommendation you left. A moment you captured. A question you asked that opened up a room.\n\nThis is quiet influence. This is what we're building.",
  },
];

// ── Founders Envelope Card ────────────────────────────────────────────────────

function FoundersEnvelopeCard({ item, isOpened, onClick }: {
  item: MailboxItem;
  isOpened: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className="w-full text-left transition-all active:scale-[0.98] mb-4"
      style={{ display: "block" }}>
      <div className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1A1208 0%, #0D0A04 60%, #1A1208 100%)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(212,168,83,0.25)",
          minHeight: "148px",
        }}>
        {/* Top gold shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(212,168,83,0.6) 40%, rgba(212,168,83,0.6) 60%, transparent 100%)" }} />

        {/* Envelope flap (decorative triangle at top) */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden" style={{ height: "56px" }}>
          <div style={{
            position: "absolute", top: 0, left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "180px solid transparent",
            borderRight: "180px solid transparent",
            borderTop: "52px solid rgba(212,168,83,0.08)",
          }} />
          {/* Flap edge line */}
          <div style={{
            position: "absolute", top: "51px", left: 0, right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent 5%, rgba(212,168,83,0.22) 30%, rgba(212,168,83,0.22) 70%, transparent 95%)",
          }} />
        </div>

        {/* Wax seal */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 38% 38%, #C8963C 0%, #A0721C 55%, #7A5210 100%)",
            boxShadow: "0 2px 12px rgba(212,168,83,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
            border: "1px solid rgba(212,168,83,0.5)",
          }}>
          <span style={{ color: "rgba(255,245,220,0.9)", fontSize: "18px", fontWeight: 900 }}>✦</span>
        </div>

        {/* Body */}
        <div className="px-6 pt-24 pb-5 relative">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(212,168,83,0.06) 0%, transparent 55%)" }} />

          {/* "SEALED INVITATION" label */}
          <p className="text-[8px] font-bold tracking-[0.35em] uppercase mb-2 relative"
            style={{ color: "rgba(212,168,83,0.45)" }}>
            SEALED INVITATION · BLOOMBAY
          </p>

          <div className="flex items-end justify-between relative">
            <div>
              <h3 className="font-black italic leading-tight mb-1"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: "rgba(255,238,200,0.95)" }}>
                {item.subject}
              </h3>
              <p className="text-[11px] italic leading-snug"
                style={{ color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-instrument)", maxWidth: "240px" }}>
                {item.preview}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-3">
              {!isOpened && (
                <div className="w-2 h-2 rounded-full" style={{ background: "#FF1F7D", boxShadow: "0 0 8px rgba(255,31,125,0.8)" }} />
              )}
              <span className="text-[10px] font-bold px-3 py-1.5 rounded-full"
                style={{ background: isOpened ? "rgba(212,168,83,0.1)" : "rgba(212,168,83,0.2)", color: "#D4A853", border: "1px solid rgba(212,168,83,0.3)" }}>
                {isOpened ? "Opened" : "Open →"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div className="px-6 py-2.5 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(212,168,83,0.12)", background: "rgba(0,0,0,0.2)" }}>
          <p className="text-[8px] tracking-[0.25em] uppercase" style={{ color: "rgba(212,168,83,0.3)" }}>
            FROM BLOOMBAY · {item.date}
          </p>
          <p className="text-[8px] tracking-[0.1em]" style={{ color: "rgba(212,168,83,0.3)" }}>✦ ✦ ✦</p>
        </div>
      </div>
    </button>
  );
}

// ── Invitation card (special treatment) ──────────────────────────────────────

function InvitationCard({ item, isOpened, onClick }: {
  item: MailboxItem;
  isOpened: boolean;
  onClick: () => void;
}) {
  const isUnopened = !isOpened;
  const accent = item.color;

  // If it has an inviteId, link directly to the invitation detail page
  if (item.inviteId) {
    return (
      <Link href={`/member/invitations/${item.inviteId}`} style={{ textDecoration: "none" }}>
        <div className="flex items-center gap-3.5 px-5 py-4 w-full"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${accent} 0%, ${accent}BB 100%)`,
                color: "white",
                fontSize: item.initial.length > 2 ? "9px" : item.initial.length > 1 ? "10px" : "16px",
                boxShadow: isUnopened ? `0 0 0 2px ${accent}, 0 0 0 4px var(--pale-pink-bg, #FDFAF5)` : "none",
              }}>
              {item.initial}
            </div>
            {isUnopened && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "#FF1F7D", boxShadow: "0 1px 6px rgba(255,31,125,0.5)" }}>
                <span style={{ color: "white", fontSize: "9px", fontWeight: 900 }}>•</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <p className="text-sm truncate leading-tight"
                style={{ color: "var(--heading-color, #111)", fontWeight: isUnopened ? 700 : 500 }}>
                {item.subject}
              </p>
              <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-muted, #bbb)" }}>{item.date}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                style={{ background: "rgba(255,31,125,0.08)", color: accent }}>
                🎟 {item.from}
              </span>
              <p className="text-[11px] truncate" style={{ color: "var(--text-muted, #bbb)" }}>{item.preview}</p>
            </div>
          </div>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(180,140,140,0.5)" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </Link>
    );
  }

  // Otherwise use the regular onClick (letter view)
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3.5 px-5 py-4 text-left transition-all active:scale-[0.98]"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${accent} 0%, ${accent}BB 100%)`,
            color: "white",
            fontSize: item.initial.length > 2 ? "9px" : item.initial.length > 1 ? "10px" : "16px",
            boxShadow: isUnopened ? `0 0 0 2px ${accent}, 0 0 0 4px var(--pale-pink-bg, #FDFAF5)` : "none",
          }}>
          {item.initial}
        </div>
        {isUnopened && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: "#FF1F7D", boxShadow: "0 1px 6px rgba(255,31,125,0.5)" }}>
            <span style={{ color: "white", fontSize: "9px", fontWeight: 900 }}>•</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <p className="text-sm truncate leading-tight"
            style={{ color: "var(--heading-color, #111)", fontWeight: isUnopened ? 700 : 500 }}>
            {item.subject}
          </p>
          <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-muted, #bbb)" }}>{item.date}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
            style={{ background: "rgba(255,31,125,0.08)", color: accent }}>
            {TYPE_ICONS[item.type]} {item.from}
          </span>
          <p className="text-[11px] truncate" style={{ color: "var(--text-muted, #bbb)" }}>{item.preview}</p>
        </div>
      </div>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(180,140,140,0.5)" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  );
}

// ── Letter View ───────────────────────────────────────────────────────────────

function LetterView({ item, onBack }: { item: MailboxItem; onBack: () => void }) {
  const isFounders = item.type === "founders-invitation";
  const isGold = item.type === "certificate" || item.type === "recognition" || isFounders;
  const accentColor = isGold ? "#D4A853" : item.color;

  if (isFounders) {
    return (
      <div className="min-h-screen pb-24" style={{ background: "#07060A" }}>
        {/* Header nav */}
        <div className="px-5 pt-14 pb-4 flex items-center gap-3">
          <button onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
            style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="rgba(212,168,83,0.7)" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(212,168,83,0.6)" }}>✦ MAILBOX</p>
        </div>

        {/* Seal + envelope art */}
        <div className="flex flex-col items-center pt-2 pb-8 px-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{
              background: "radial-gradient(circle at 38% 38%, #C8963C 0%, #A0721C 55%, #7A5210 100%)",
              boxShadow: "0 4px 24px rgba(212,168,83,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
              border: "1px solid rgba(212,168,83,0.4)",
            }}>
            <span style={{ color: "rgba(255,245,220,0.95)", fontSize: "32px", fontWeight: 900 }}>✦</span>
          </div>
          <p className="text-[9px] font-bold tracking-[0.35em] uppercase mb-1" style={{ color: "rgba(212,168,83,0.45)" }}>
            FOUNDERS INVITATION
          </p>
          <p className="text-[10px] italic text-center" style={{ color: "rgba(255,255,255,0.25)", maxWidth: "200px" }}>
            Personal. Private. Permanent.
          </p>
        </div>

        {/* The letter */}
        <div className="px-5 md:px-8">
          <div className="rounded-3xl overflow-hidden relative"
            style={{
              background: "linear-gradient(160deg, #1C1608 0%, #0F0C04 60%, #1C1608 100%)",
              boxShadow: "0 16px 56px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(212,168,83,0.18)",
            }}>
            {/* Top shimmer */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.55), transparent)" }} />
            {/* Corner ornaments */}
            <div className="absolute top-4 left-4 text-[10px]" style={{ color: "rgba(212,168,83,0.2)" }}>✦</div>
            <div className="absolute top-4 right-4 text-[10px]" style={{ color: "rgba(212,168,83,0.2)" }}>✦</div>

            <div className="px-7 pt-8 pb-6 relative">
              <p className="text-[9px] font-bold tracking-[0.3em] uppercase mb-5"
                style={{ color: "rgba(212,168,83,0.45)", textAlign: "center" }}>
                BLOOMBAY · FOUNDING 100
              </p>
              <div className="whitespace-pre-wrap text-sm leading-[2.0]"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                  color: "rgba(255,238,210,0.82)",
                  fontSize: "15px",
                  lineHeight: "1.9",
                }}>
                {item.body ?? item.preview}
              </div>
            </div>

            <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.25), transparent)" }} />
            <div className="px-7 py-4 flex justify-between items-center">
              <p className="text-[9px] tracking-[0.2em]" style={{ color: "rgba(212,168,83,0.3)" }}>PERMANENT · FOUNDING 100</p>
              <p className="text-[9px] tracking-[0.2em]" style={{ color: "rgba(212,168,83,0.3)" }}>✦</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: isGold ? "#0A0804" : "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-14 pb-4 flex items-center gap-3">
        <button onClick={onBack}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
          style={{ background: isGold ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={isGold ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)"} strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: accentColor }}>✦ MAILBOX</p>
      </div>
      <div className="px-5 md:px-8">
        <div className="rounded-3xl overflow-hidden relative"
          style={{
            background: isGold ? "linear-gradient(145deg, #1A1208 0%, #0A0804 100%)" : "white",
            boxShadow: isGold ? "0 16px 48px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(212,168,83,0.2)" : "0 8px 32px rgba(255,105,180,0.12)",
            border: `1px solid ${isGold ? "rgba(212,168,83,0.2)" : "#FFE8F0"}`,
          }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}66, transparent)` }} />
          <div className="px-6 pt-6 pb-3">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44` }}>
                {item.initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: `${accentColor}99` }}>
                  FROM {item.from.toUpperCase()}
                </p>
                <h1 className="font-black italic leading-tight"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(20px,6vw,28px)", color: isGold ? "rgba(212,168,83,0.95)" : "#111", lineHeight: 1.1 }}>
                  {item.subject}
                </h1>
                <p className="text-[10px] mt-1" style={{ color: isGold ? "rgba(255,255,255,0.3)" : "#bbb" }}>{item.date}</p>
              </div>
            </div>
            <div className="mb-5" style={{ height: "1px", background: `linear-gradient(90deg, ${accentColor}44, transparent)` }} />
            <div className="whitespace-pre-wrap text-sm leading-[1.85] mb-6"
              style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", color: isGold ? "rgba(255,238,220,0.82)" : "#444" }}>
              {item.body ?? item.preview}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[9px] font-bold px-3 py-1.5 rounded-full"
                style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}33` }}>
                {TYPE_ICONS[item.type]} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>
            </div>
          </div>
          <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${accentColor}33, transparent)` }} />
          <div className="px-6 py-3 flex justify-between items-center">
            <p className="text-[9px] tracking-[0.2em]" style={{ color: isGold ? "rgba(212,168,83,0.35)" : "#ddd" }}>BloomBay · Permanent</p>
            <p className="text-[9px] tracking-[0.2em]" style={{ color: isGold ? "rgba(212,168,83,0.35)" : "#ddd" }}>✦</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Inner page (uses search params) ───────────────────────────────────────────

function MailboxInner() {
  const searchParams = useSearchParams();
  const initialFilter = (searchParams.get("filter") as MailboxItemType | "all") ?? "all";

  const [view, setView] = useState<"hub" | "letter">("hub");
  const [activeItem, setActiveItem] = useState<MailboxItem | null>(null);
  const [filter, setFilter] = useState<MailboxItemType | "all">(initialFilter);
  const [openedItems, setOpenedItems] = useState<Set<number>>(
    new Set(MAILBOX_ITEMS.filter(i => i.opened).map(i => i.id))
  );

  // Sync filter if URL param changes (e.g. navigating back)
  useEffect(() => {
    const f = searchParams.get("filter") as MailboxItemType | "all" | null;
    if (f) setFilter(f);
  }, [searchParams]);

  function openMailboxItem(item: MailboxItem) {
    setOpenedItems(p => new Set([...p, item.id]));
    setActiveItem(item);
    setView("letter");
  }
  function back() { setView("hub"); setActiveItem(null); }

  if (view === "letter" && activeItem) return <LetterView item={activeItem} onBack={back} />;

  const FILTERS: { label: string; value: MailboxItemType | "all" }[] = [
    { label: "All",          value: "all"         },
    { label: "Invitations",  value: "invitation"  },
    { label: "Letters",      value: "letter"      },
    { label: "Certificates", value: "certificate" },
    { label: "Milestones",   value: "milestone"   },
  ];

  const shown = MAILBOX_ITEMS.filter(i => filter === "all" || i.type === filter);
  const unread = MAILBOX_ITEMS.filter(i => !openedItems.has(i.id)).length;
  const inviteUnread = MAILBOX_ITEMS.filter(i => i.type === "invitation" && !openedItems.has(i.id)).length;

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-14 pb-5 md:px-8 md:pt-10">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/member/home"
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
            style={{ background: "rgba(0,0,0,0.06)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
          <div className="flex-1">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>✦ MAILBOX</p>
            <div className="flex items-center gap-2.5">
              <h1 className="font-black italic leading-none"
                style={{ color: "var(--heading-color, #111)", fontFamily: "var(--font-playfair)", fontSize: "clamp(36px,9vw,48px)" }}>
                Mailbox.
              </h1>
              {unread > 0 && (
                <span className="text-[9px] font-bold px-2.5 py-1 rounded-full text-white self-end mb-1.5"
                  style={{ background: "#FF1F7D", boxShadow: "0 2px 8px rgba(255,31,125,0.4)" }}>
                  {unread} new
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="text-[11px] italic" style={{ color: "var(--text-muted, #aaa)", fontFamily: "var(--font-instrument)" }}>
          Invitations, letters, certificates.
        </p>
      </div>

      {/* Invitations spotlight (when showing all or invitations filter) */}
      {(filter === "all" || filter === "invitation") && inviteUnread > 0 && (
        <div className="px-5 mb-4 md:px-8">
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: "#111111", border: "1px solid rgba(255,31,125,0.2)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,31,125,0.15)" }}>
              <span style={{ fontSize: "16px" }}>🎟</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold" style={{ color: "rgba(255,238,220,0.9)" }}>
                {inviteUnread} invitation{inviteUnread !== 1 ? "s" : ""} waiting
              </p>
              <p className="text-[10px] mt-0.5 italic" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-instrument)" }}>
                Someone saved you a seat.
              </p>
            </div>
            <button onClick={() => setFilter("invitation")}
              className="text-[10px] font-bold px-3 py-1.5 rounded-full transition-all active:scale-95"
              style={{ background: "#FF1F7D", color: "white" }}>
              View →
            </button>
          </div>
        </div>
      )}

      {/* Filter chips */}
      <div className="px-5 mb-5 flex gap-2 overflow-x-auto md:px-8" style={{ scrollbarWidth: "none" }}>
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all active:scale-95"
            style={filter === f.value
              ? { background: "var(--heading-color, #111)", color: "var(--pale-pink-bg, white)", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }
              : { background: "var(--card-bg, white)", color: "var(--text-color, #555)", border: "1.5px solid var(--card-border, #E8E8E8)" }}>
            {f.label}
            {f.value === "invitation" && inviteUnread > 0 && (
              <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                style={{ background: "#FF1F7D" }}>
                {inviteUnread}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Founders Envelope — sits above the list, full-width card */}
      {(filter === "all" || filter === "founders-invitation") && (() => {
        const fi = MAILBOX_ITEMS.find(i => i.type === "founders-invitation");
        if (!fi) return null;
        return (
          <div className="px-5 md:px-8 mb-2">
            <FoundersEnvelopeCard
              item={fi}
              isOpened={openedItems.has(fi.id)}
              onClick={() => openMailboxItem(fi)}
            />
          </div>
        );
      })()}

      {/* Items list */}
      <div className="mx-5 md:mx-8 rounded-3xl overflow-hidden"
        style={{ background: "var(--card-bg, white)", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        {shown.filter(i => i.type !== "founders-invitation").length === 0 ? (
          <div className="py-16 text-center px-6">
            <p className="text-3xl mb-3">📬</p>
            <p className="font-bold italic mb-1" style={{ fontFamily: "var(--font-playfair)", color: "var(--heading-color, #111)", fontSize: "18px" }}>
              Nothing here yet.
            </p>
            <p className="text-xs italic" style={{ fontFamily: "var(--font-instrument)", color: "var(--text-muted, #bbb)" }}>
              Your meaningful items will appear here.
            </p>
          </div>
        ) : (
          shown.filter(i => i.type !== "founders-invitation").map(item => (
            <InvitationCard
              key={item.id}
              item={item}
              isOpened={openedItems.has(item.id)}
              onClick={() => openMailboxItem(item)}
            />
          ))
        )}
      </div>

      {/* Chat link */}
      <div className="px-5 mt-4 md:px-8">
        <Link href="/member/chat"
          className="flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]"
          style={{ background: "var(--card-bg, white)", boxShadow: "0 1px 8px rgba(0,0,0,0.05)", border: "1px solid var(--card-border, #F5F5F5)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,31,125,0.08)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--heading-color, #111)" }}>Looking for Chats?</p>
              <p className="text-xs" style={{ color: "var(--text-muted, #bbb)" }}>Morocco October, Maya, clubs & groups</p>
            </div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(180,140,140,0.5)" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}

// ── Page export (Suspense wrapper for useSearchParams) ────────────────────────

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--pale-pink-bg)" }}>
        <p className="text-sm italic" style={{ color: "#bbb" }}>Loading mailbox…</p>
      </div>
    }>
      <MailboxInner />
    </Suspense>
  );
}
