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
                style={{ color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-playfair)", maxWidth: "240px" }}>
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

// ── Envelope card (replaces InvitationCard) ───────────────────────────────────

function EnvelopeCard({ item, isOpened, onClick }: {
  item: MailboxItem;
  isOpened: boolean;
  onClick: () => void;
}) {
  const isUnread = !isOpened;

  const envColors: Record<MailboxItemType, string> = {
    invitation:           "#D4849A",
    letter:               "#C8899C",
    certificate:          "#B8956A",
    recognition:          "#B8956A",
    milestone:            "#E0708A",
    "founders-invitation":"#8A6A30",
  };
  const envColor = envColors[item.type] ?? "#C8899C";

  const cardContent = (
    <div style={{ padding: "0 0 12px", textAlign: "left" }}>
      {/* White letter part sticking out */}
      <div style={{ background: "white", marginBottom: -10, padding: "14px 14px 24px", borderRadius: "16px 16px 0 0", position: "relative", boxShadow: "0 -2px 10px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.05)", borderBottom: "none", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${item.color}, ${item.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: item.initial.length > 2 ? 9 : 12, fontWeight: 800, color: "white", flexShrink: 0 }}>
            {item.initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: isUnread ? 700 : 500, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.subject}</p>
              {isUnread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF1F7D", flexShrink: 0, boxShadow: "0 0 6px rgba(255,31,125,0.6)" }} />}
            </div>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontStyle: "italic", color: "#999", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.preview}</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#bbb", marginTop: 4 }}>{item.date}</p>
          </div>
        </div>
      </div>
      {/* Envelope body */}
      <div style={{ position: "relative", zIndex: 0 }}>
        {/* V-flap */}
        <div style={{ overflow: "hidden", height: 14, display: "flex" }}>
          <div style={{ width: "50%", height: 14, background: `${envColor}CC`, clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
          <div style={{ width: "50%", height: 14, background: `${envColor}CC`, clipPath: "polygon(0 0, 0 100%, 100% 0)" }} />
        </div>
        <div style={{ background: envColor, borderRadius: "0 0 16px 16px", padding: "10px 14px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.9)" }}>From {item.from}</p>
          {item.type === "invitation" && (
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #F0C0CC, #C07080)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🌹</div>
          )}
          {item.type === "letter" && (
            <div style={{ fontSize: 16 }}>✉️</div>
          )}
          {(item.type === "certificate" || item.type === "recognition") && (
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>✦</div>
          )}
        </div>
      </div>
    </div>
  );

  if (item.inviteId) {
    return (
      <Link href={`/member/invitations/${item.inviteId}`} style={{ display: "block", textDecoration: "none" }}>
        {cardContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "block" }}>
      {cardContent}
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

  // Open envelope illustration
  const isInvitation = item.type === "invitation";
  const isLetter     = item.type === "letter";
  const isMilestone  = item.type === "milestone";

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 96, background: "#FBE8EE" }}>
      {/* Back nav */}
      <div style={{ padding: "54px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.07)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "#D4849A" }}>✉ MAILBOX</p>
      </div>

      {/* Open envelope illustration */}
      <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "center" }}>
        <svg width="260" height="130" viewBox="0 0 260 130">
          {/* Envelope back */}
          <rect x="10" y="40" width="240" height="90" rx="8" fill="#D4849A"/>
          {/* Left flap */}
          <polygon points="10,40 10,130 130,90" fill="#C07080"/>
          {/* Right flap */}
          <polygon points="250,40 250,130 130,90" fill="#C07080"/>
          {/* Bottom fold */}
          <polygon points="10,130 250,130 130,90" fill="#E090A0"/>
          {/* Open top flap (folded back) */}
          <polygon points="10,40 250,40 130,100" fill="#E8A4B4" transform="rotate(-3 130 40) translate(0,-30)"/>
          {/* Wax seal on flap */}
          <circle cx="130" cy="28" r="14" fill="url(#waxGrad)" opacity="0.9"/>
          <text x="130" y="33" textAnchor="middle" fill="rgba(255,240,220,0.9)" fontSize="12" fontWeight="900">🌹</text>
          <defs>
            <radialGradient id="waxGrad" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#F0C0CC"/>
              <stop offset="100%" stopColor="#B07080"/>
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Content card — coming out of envelope */}
      <div style={{ margin: "-32px 20px 0", position: "relative", zIndex: 2 }}>
        <div style={{ background: "white", borderRadius: 20, boxShadow: "0 12px 40px rgba(200,80,120,0.18)", overflow: "hidden", border: "1px solid rgba(212,140,160,0.15)" }}>

          {isInvitation && (
            <div style={{ padding: "24px 22px 28px", position: "relative" }}>
              {/* Postage stamp top-left */}
              <div style={{ position: "absolute", top: 16, left: 16, width: 38, height: 46, background: "linear-gradient(135deg, #F5E070, #D4A830)", borderRadius: 3, border: "2px solid rgba(255,255,255,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "1px 1px 4px rgba(0,0,0,0.15)", padding: "3px" }}>
                <div style={{ background: "rgba(255,255,255,0.3)", width: "100%", flex: 1, borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 14 }}>🌸</span>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 800, color: "rgba(120,80,0,0.8)", marginTop: 2 }}>50</p>
              </div>
              {/* "She & Girls Only" tag top-right */}
              <div style={{ position: "absolute", top: 16, right: 16, background: "#FFF0F5", border: "1px solid rgba(255,31,125,0.2)", borderRadius: 6, padding: "4px 8px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, color: "#FF1F7D", whiteSpace: "nowrap" }}>She &amp; Girls Only</p>
              </div>

              {/* Main invite content */}
              <div style={{ paddingTop: 44, textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, color: "#C07080", marginBottom: 6 }}>You&apos;re Invited to</p>
                <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1.15, marginBottom: 12 }}>{item.subject}</h1>
                {item.body && (
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontStyle: "italic", color: "#777", lineHeight: 1.65, marginBottom: 18, textAlign: "left" }}>
                    {item.body}
                  </p>
                )}
                {/* Wax seal */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #F0C0CC, #B07080)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 12px rgba(180,80,100,0.35)", border: "2px solid rgba(255,255,255,0.5)" }}>
                    <span style={{ fontSize: 22 }}>🌹</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLetter && (
            <div style={{ padding: "22px 22px 28px", backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.05) 28px)", backgroundSize: "100% 28px", backgroundPosition: "0 22px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "#C07080", marginBottom: 12 }}>FROM {item.from.toUpperCase()}</p>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", marginBottom: 16 }}>{item.subject}</h2>
              <div style={{ fontFamily: "var(--font-caveat)", fontSize: 17, color: "#444", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
                {item.body ?? item.preview}
              </div>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, color: "#C07080", marginTop: 20, textAlign: "right" }}>— {item.from} ✦</p>
            </div>
          )}

          {isMilestone && (
            <div style={{ padding: "28px 22px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>🌸</div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "#C07080", marginBottom: 8 }}>MILESTONE</p>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", marginBottom: 16 }}>{item.subject}</h2>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontStyle: "italic", color: "#666", lineHeight: 1.65 }}>{item.body ?? item.preview}</p>
            </div>
          )}

          {!isInvitation && !isLetter && !isMilestone && (
            <div style={{ padding: "22px 22px 28px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "#B8956A", marginBottom: 12 }}>FROM {item.from.toUpperCase()}</p>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", marginBottom: 16 }}>{item.subject}</h2>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontStyle: "italic", color: "#555", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{item.body ?? item.preview}</p>
            </div>
          )}
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
    <div className="min-h-screen pb-28" style={{ background: "#FBE8EE" }}>
      {/* Mailbox illustration + header */}
      <div style={{ padding: "58px 20px 0", textAlign: "center" }}>
        {/* SVG Mailbox */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 4, position: "relative" }}>
          <svg width="120" height="140" viewBox="0 0 120 140">
            {/* Post/pole */}
            <rect x="54" y="110" width="12" height="30" rx="3" fill="#C07080"/>
            {/* Body: arched pink mailbox */}
            <path d="M15,65 Q15,20 60,20 Q105,20 105,65 L105,110 Q105,118 97,118 L23,118 Q15,118 15,110 Z" fill="#C8546A"/>
            {/* Highlight on arch */}
            <path d="M22,65 Q22,27 60,27 Q98,27 98,65" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4"/>
            {/* Mail slot */}
            <rect x="28" y="62" width="64" height="10" rx="3" fill="#1A1A1A"/>
            {/* Envelope sticking out of slot */}
            <rect x="36" y="46" width="48" height="20" rx="2" fill="#FEF8EE"/>
            <polygon points="36,46 60,58 84,46" fill="rgba(200,80,100,0.25)"/>
            {/* Keyhole */}
            <circle cx="60" cy="92" r="5" fill="#1A1A1A"/>
            <rect x="57.5" y="94" width="5" height="8" rx="1.5" fill="#1A1A1A"/>
            {/* Flag arm */}
            <rect x="97" y="38" width="3" height="40" rx="1.5" fill="#B04050"/>
            {/* Flag */}
            <polygon points="100,38 100,52 114,45" fill="#FF6B6B"/>
            {/* Bell badge on flag pole */}
            {unread > 0 && <>
              <circle cx="100" cy="35" r="9" fill="#FF1F7D"/>
              <text x="100" y="39" textAnchor="middle" fill="white" fontSize="8" fontWeight="900">🔔</text>
            </>}
          </svg>
          {/* Unread count badge */}
          {unread > 0 && (
            <div style={{ position: "absolute", top: 8, right: "calc(50% - 70px)", background: "#FF1F7D", color: "white", borderRadius: 999, padding: "2px 8px", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, boxShadow: "0 2px 8px rgba(255,31,125,0.4)" }}>{unread} new</div>
          )}
        </div>

        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 42, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1, marginBottom: 6 }}>Mailbox.</h1>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontStyle: "italic", color: "#C07080", marginBottom: 20 }}>Invitations, letters &amp; certificates — yours to keep.</p>
      </div>

      {/* Invitations spotlight (when showing all or invitations filter) */}
      {(filter === "all" || filter === "invitation") && inviteUnread > 0 && (
        <div className="px-5 mb-4 md:px-8">
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: "#2A0A10", border: "1px solid rgba(255,31,125,0.2)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,31,125,0.15)" }}>
              <span style={{ fontSize: "16px" }}>🎟</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold" style={{ color: "rgba(255,238,220,0.9)" }}>
                {inviteUnread} invitation{inviteUnread !== 1 ? "s" : ""} waiting
              </p>
              <p className="text-[10px] mt-0.5 italic" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-playfair)" }}>
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
              ? { background: "#C8546A", color: "white", boxShadow: "0 2px 8px rgba(200,84,106,0.35)" }
              : { background: "#FFFCF9", color: "#555", border: "1.5px solid #E8C0CC" }}>
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

      {/* Envelope cards */}
      <div style={{ padding: "0 20px" }}>
        {shown.filter(i => i.type !== "founders-invitation").length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📬</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "#1A1A1A", marginBottom: 6 }}>Nothing here yet.</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: "#C07080" }}>Your meaningful items will appear here.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {shown.filter(i => i.type !== "founders-invitation").map(item => (
              <EnvelopeCard
                key={item.id}
                item={item}
                isOpened={openedItems.has(item.id)}
                onClick={() => openMailboxItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Chat link */}
      <div className="px-5 mt-4 md:px-8">
        <Link href="/member/chat"
          className="flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]"
          style={{ background: "#FFFCF9", boxShadow: "0 1px 8px rgba(0,0,0,0.05)", border: "1px solid #EDE7E0" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,31,125,0.08)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "#1A1A1A" }}>Looking for Chats?</p>
              <p className="text-xs" style={{ color: "#B0A8A0" }}>Morocco October, Maya, clubs & groups</p>
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FBE8EE" }}>
        <p className="text-sm italic" style={{ color: "#bbb" }}>Loading mailbox…</p>
      </div>
    }>
      <MailboxInner />
    </Suspense>
  );
}
