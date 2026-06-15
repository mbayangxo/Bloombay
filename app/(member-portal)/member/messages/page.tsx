"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PINK = "#FF1F7D";

type MailboxItemType = "letter" | "invitation" | "founders-invitation";

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

const MAILBOX_ITEMS: MailboxItem[] = [
  {
    id: 0, type: "founders-invitation", from: "BloomBay", initial: "✦", color: "#D4A853",
    subject: "You are invited — Founding 100",
    preview: "A letter from us to you. Personal. Private. Open when you're ready.",
    date: "Jan 2026", opened: false,
    body: "Dear Founding Member,\n\nYou were invited before BloomBay was anything.\n\nWhen this was only an idea — a feeling, really — you said yes. You showed up. You trusted something that hadn't proven itself yet.\n\nOf the women who were there in the beginning, you are one of the first 100. That number is permanent. That place is yours forever.\n\nNo matter how large BloomBay becomes, no matter how many women find their way here — you will always be one of the women who built it from nothing.\n\nWe are so grateful for you.\n\nWith love and intention,\nBloomBay ✦\n\n— You are Founding Member #47. Always.",
  },
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
];

// ── Letter View ───────────────────────────────────────────────────────────────
function LetterView({ item, onBack }: { item: MailboxItem; onBack: () => void }) {
  const isFounders = item.type === "founders-invitation";
  const isInvitation = item.type === "invitation";

  if (isFounders) {
    return (
      <div className="min-h-screen pb-24" style={{ background: "#07060A" }}>
        <div className="px-5 pt-14 pb-4 flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95" style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(212,168,83,0.7)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(212,168,83,0.6)" }}>✦ MAILBOX</p>
        </div>
        <div className="flex flex-col items-center pt-2 pb-8 px-5">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: "radial-gradient(circle at 38% 38%, #C8963C 0%, #A0721C 55%, #7A5210 100%)", boxShadow: "0 4px 24px rgba(212,168,83,0.35), inset 0 1px 0 rgba(255,255,255,0.12)", border: "1px solid rgba(212,168,83,0.4)" }}>
            <span style={{ color: "rgba(255,245,220,0.95)", fontSize: "32px", fontWeight: 900 }}>✦</span>
          </div>
          <p className="text-[9px] font-bold tracking-[0.35em] uppercase mb-1" style={{ color: "rgba(212,168,83,0.45)" }}>FOUNDERS INVITATION</p>
          <p className="text-[10px] italic text-center" style={{ color: "rgba(255,255,255,0.25)", maxWidth: "200px" }}>Personal. Private. Permanent.</p>
        </div>
        <div className="px-5 md:px-8">
          <div className="rounded-3xl overflow-hidden relative" style={{ background: "linear-gradient(160deg, #1C1608 0%, #0F0C04 60%, #1C1608 100%)", boxShadow: "0 16px 56px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(212,168,83,0.18)" }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.55), transparent)" }} />
            <div className="absolute top-4 left-4 text-[10px]" style={{ color: "rgba(212,168,83,0.2)" }}>✦</div>
            <div className="absolute top-4 right-4 text-[10px]" style={{ color: "rgba(212,168,83,0.2)" }}>✦</div>
            <div className="px-7 pt-8 pb-6 relative">
              <p className="text-[9px] font-bold tracking-[0.3em] uppercase mb-5" style={{ color: "rgba(212,168,83,0.45)", textAlign: "center" }}>BLOOMBAY · FOUNDING 100</p>
              <div className="whitespace-pre-wrap" style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", color: "rgba(255,238,210,0.82)", fontSize: "15px", lineHeight: "1.9" }}>{item.body ?? item.preview}</div>
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
    <div style={{ minHeight: "100vh", paddingBottom: 96, background: "#FBE8EE" }}>
      <div style={{ padding: "54px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.07)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "#D4849A" }}>✉ MAILBOX</p>
      </div>

      {/* Open envelope illustration */}
      <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "center" }}>
        <svg width="260" height="130" viewBox="0 0 260 130">
          <rect x="10" y="40" width="240" height="90" rx="8" fill="#D4849A"/>
          <polygon points="10,40 10,130 130,90" fill="#C07080"/>
          <polygon points="250,40 250,130 130,90" fill="#C07080"/>
          <polygon points="10,130 250,130 130,90" fill="#E090A0"/>
          <polygon points="10,40 250,40 130,100" fill="#E8A4B4" transform="rotate(-3 130 40) translate(0,-30)"/>
          <circle cx="130" cy="28" r="14" fill="url(#waxGrad2)" opacity="0.9"/>
          <text x="130" y="33" textAnchor="middle" fill="rgba(255,240,220,0.9)" fontSize="12" fontWeight="900">🌹</text>
          <defs>
            <radialGradient id="waxGrad2" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#F0C0CC"/>
              <stop offset="100%" stopColor="#B07080"/>
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div style={{ margin: "-32px 20px 0", position: "relative", zIndex: 2 }}>
        <div style={{ background: "white", borderRadius: 20, boxShadow: "0 12px 40px rgba(200,80,120,0.18)", overflow: "hidden", border: "1px solid rgba(212,140,160,0.15)" }}>
          {isInvitation && (
            <div style={{ padding: "24px 22px 28px", position: "relative" }}>
              <div style={{ position: "absolute", top: 16, left: 16, width: 38, height: 46, background: "linear-gradient(135deg, #F5E070, #D4A830)", borderRadius: 3, border: "2px solid rgba(255,255,255,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "1px 1px 4px rgba(0,0,0,0.15)", padding: "3px" }}>
                <div style={{ background: "rgba(255,255,255,0.3)", width: "100%", flex: 1, borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 14 }}>🌸</span></div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 800, color: "rgba(120,80,0,0.8)", marginTop: 2 }}>50</p>
              </div>
              <div style={{ position: "absolute", top: 16, right: 16, background: "#FFF0F5", border: "1px solid rgba(255,31,125,0.2)", borderRadius: 6, padding: "4px 8px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, color: "#FF1F7D", whiteSpace: "nowrap" }}>She &amp; Girls Only</p>
              </div>
              <div style={{ paddingTop: 44, textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, color: "#C07080", marginBottom: 6 }}>You&apos;re Invited to</p>
                <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1.15, marginBottom: 12 }}>{item.subject}</h1>
                {item.body && <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontStyle: "italic", color: "#777", lineHeight: 1.65, marginBottom: 18, textAlign: "left" }}>{item.body}</p>}
                <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #F0C0CC, #B07080)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 12px rgba(180,80,100,0.35)", border: "2px solid rgba(255,255,255,0.5)" }}>
                    <span style={{ fontSize: 22 }}>🌹</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {item.type === "letter" && (
            <div style={{ padding: "22px 22px 28px", backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.05) 28px)", backgroundSize: "100% 28px", backgroundPosition: "0 22px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "#C07080", marginBottom: 12 }}>FROM {item.from.toUpperCase()}</p>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", marginBottom: 16 }}>{item.subject}</h2>
              <div style={{ fontFamily: "var(--font-caveat)", fontSize: 17, color: "#444", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{item.body ?? item.preview}</div>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, color: "#C07080", marginTop: 20, textAlign: "right" }}>— {item.from} ✦</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Invitation List View ───────────────────────────────────────────────────────
function InvitationListView({ items, openedItems, onOpen, onBack }: {
  items: MailboxItem[];
  openedItems: Set<number>;
  onOpen: (item: MailboxItem) => void;
  onBack: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 60%, #FFF5F0 100%)", paddingBottom: 100 }}>
      <style>{`
        @keyframes inviteCardIn {
          from { transform: translateY(18px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .invite-card { animation: inviteCardIn 0.4s cubic-bezier(0.34,1.3,0.64,1) both; }
        .invite-card:active { transform: scale(0.97) !important; transition: transform 0.1s; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "56px 20px 24px", background: "linear-gradient(160deg, #FF1F7D 0%, #FF5BAD 100%)", position: "relative", overflow: "hidden" }}>
        {/* Background shimmer */}
        <div style={{ position: "absolute", top: -20, right: -20, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.65)" }}>THE INVITATION BOX</p>
        </div>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 40, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, marginBottom: 4 }}>Invitations.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.65)" }}>Someone saved you a seat.</p>
      </div>

      <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((item, idx) => {
          const isUnread = !openedItems.has(item.id);

          /* Physical envelope card */
          const content = (
            <div
              className="invite-card"
              style={{
                position: "relative",
                animationDelay: `${idx * 0.07}s`,
                borderRadius: 20,
                boxShadow: isUnread
                  ? "0 8px 32px rgba(255,31,125,0.2), 0 2px 8px rgba(0,0,0,0.06)"
                  : "0 4px 18px rgba(0,0,0,0.08)",
              }}
            >
              {/* Paper layer behind for depth */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 20,
                background: `${item.color}22`,
                transform: "rotate(1.4deg)",
                zIndex: 0,
              }} />

              {/* Envelope card */}
              <div style={{
                position: "relative", zIndex: 1,
                borderRadius: 20, overflow: "hidden",
                background: "white",
                border: `1.5px solid ${isUnread ? item.color + "30" : "rgba(0,0,0,0.05)"}`,
              }}>
                {/* Envelope top with V-flap */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                  {/* Solid color top */}
                  <div style={{
                    height: 52,
                    background: `linear-gradient(135deg, ${item.color}EE, ${item.color}BB)`,
                    position: "relative",
                  }}>
                    {/* Shine */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.15), transparent)" }} />
                    {/* Unread dot */}
                    {isUnread && (
                      <div style={{
                        position: "absolute", top: 10, right: 12,
                        width: 10, height: 10, borderRadius: "50%",
                        background: "white", boxShadow: "0 0 8px rgba(255,255,255,0.8)",
                      }} />
                    )}
                  </div>
                  {/* V fold */}
                  <svg width="100%" height="24" viewBox="0 0 320 24" preserveAspectRatio="none" style={{ display: "block", marginTop: -1 }}>
                    <polygon points="0,0 320,0 160,24" fill={item.color + "BB"} />
                    <polygon points="0,0 320,0 160,24" fill="rgba(0,0,0,0.06)" />
                  </svg>
                </div>

                {/* Content */}
                <div style={{ padding: "10px 16px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  {/* Avatar */}
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                    background: `linear-gradient(135deg, ${item.color}, ${item.color}88)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: item.initial.length > 2 ? 9 : 14, fontWeight: 800, color: "white",
                    boxShadow: `0 3px 12px ${item.color}44`,
                    border: "2.5px solid white",
                  }}>{item.initial}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "var(--font-playfair)", fontStyle: "italic",
                      fontSize: 15, fontWeight: isUnread ? 700 : 500,
                      color: "#1A1A1A", marginBottom: 3,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{item.subject}</p>
                    <p style={{
                      fontFamily: "var(--font-jost)", fontSize: 11,
                      color: "#aaa", overflow: "hidden", textOverflow: "ellipsis",
                      whiteSpace: "nowrap", marginBottom: 6,
                    }}>{item.preview}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#C07080" }}>from {item.from} · {item.date}</p>
                      {isUnread
                        ? <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: PINK, letterSpacing: "0.18em", background: `${PINK}12`, borderRadius: 99, padding: "3px 8px" }}>NEW</span>
                        : <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "#ccc", letterSpacing: "0.1em" }}>OPENED</span>
                      }
                    </div>
                  </div>
                </div>

                {/* Bottom wax seal strip */}
                <div style={{
                  height: 8,
                  background: `linear-gradient(90deg, ${item.color}33, ${item.color}55, ${item.color}33)`,
                }} />
              </div>
            </div>
          );

          if (item.inviteId) return (
            <Link key={item.id} href={`/member/invitations/${item.inviteId}`} style={{ display: "block", textDecoration: "none" }}>
              {content}
            </Link>
          );
          return (
            <button key={item.id} onClick={() => onOpen(item)} style={{ display: "block", width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
              {content}
            </button>
          );
        })}

        {items.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <svg width="60" height="50" viewBox="0 0 60 50" style={{ opacity: 0.25, marginBottom: 14 }}>
              <rect x="2" y="12" width="56" height="38" rx="6" fill={PINK}/>
              <polygon points="2,12 30,32 58,12" fill="#E0005A"/>
              <polygon points="2,50 58,50 58,12 30,32 2,12" fill="none"/>
            </svg>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "#1A1A1A", marginBottom: 4 }}>No invitations yet.</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#C07080" }}>When someone saves you a seat, it&apos;ll appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Letter List View ───────────────────────────────────────────────────────────
function LetterListView({ items, openedItems, onOpen, onBack }: {
  items: MailboxItem[];
  openedItems: Set<number>;
  onOpen: (item: MailboxItem) => void;
  onBack: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#FBE8EE", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "56px 20px 20px", background: "linear-gradient(160deg, #C8546A 0%, #E87BA8 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.7)" }}>THE LETTER BOX</p>
        </div>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 36, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>Letters.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>Words written just for you.</p>
      </div>

      <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map(item => {
          const isUnread = !openedItems.has(item.id);
          return (
            <button key={item.id} onClick={() => onOpen(item)} style={{ display: "block", width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
              <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(200,80,120,0.1)", border: `1.5px solid ${isUnread ? "rgba(200,84,106,0.3)" : "rgba(0,0,0,0.06)"}` }}>
                {/* Lined paper top strip */}
                <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid rgba(0,0,0,0.05)", backgroundImage: "repeating-linear-gradient(transparent, transparent 20px, rgba(200,84,106,0.06) 21px)", backgroundSize: "100% 21px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${item.color}, ${item.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: 14, flexShrink: 0 }}>{item.initial}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: isUnread ? 700 : 500, color: "#1A1A1A", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.subject}</p>
                      <p style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontStyle: "italic", color: "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.preview}</p>
                    </div>
                    {isUnread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: PINK, flexShrink: 0, marginTop: 4 }} />}
                  </div>
                </div>
                {/* Footer */}
                <div style={{ padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#C07080" }}>from {item.from} · {item.date}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: isUnread ? PINK : "#CCC", letterSpacing: "0.04em" }}>{isUnread ? "UNREAD" : "READ"}</p>
                </div>
              </div>
            </button>
          );
        })}

        {items.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📜</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "#1A1A1A" }}>No letters yet.</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: "#C07080", marginTop: 4 }}>Letters from the community will arrive here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Hub ──────────────────────────────────────────────────────────────────
type HubSection = "hub" | "invitations" | "letters" | "letter";

function MailboxInner() {
  const searchParams = useSearchParams();
  const initialSection = (searchParams.get("filter") === "invitation" ? "invitations" : searchParams.get("filter") === "letter" ? "letters" : "hub") as HubSection;

  const [section, setSection] = useState<HubSection>(initialSection);
  const [activeItem, setActiveItem] = useState<MailboxItem | null>(null);
  const [openedItems, setOpenedItems] = useState<Set<number>>(
    new Set(MAILBOX_ITEMS.filter(i => i.opened).map(i => i.id))
  );

  function openItem(item: MailboxItem) {
    setOpenedItems(p => new Set([...p, item.id]));
    setActiveItem(item);
    setSection("letter");
  }

  function backToSection(target: HubSection) {
    setActiveItem(null);
    setSection(target);
  }

  const invitations = MAILBOX_ITEMS.filter(i => i.type === "invitation" || i.type === "founders-invitation");
  const letters     = MAILBOX_ITEMS.filter(i => i.type === "letter");

  const inviteUnread = invitations.filter(i => !openedItems.has(i.id)).length;
  const letterUnread = letters.filter(i => !openedItems.has(i.id)).length;

  if (section === "letter" && activeItem) {
    const prevSection: HubSection = activeItem.type === "invitation" || activeItem.type === "founders-invitation" ? "invitations" : activeItem.type === "letter" ? "letters" : "hub";
    return <LetterView item={activeItem} onBack={() => backToSection(prevSection)} />;
  }

  if (section === "invitations") {
    return <InvitationListView items={invitations} openedItems={openedItems} onOpen={openItem} onBack={() => setSection("hub")} />;
  }

  if (section === "letters") {
    return <LetterListView items={letters} openedItems={openedItems} onOpen={openItem} onBack={() => setSection("hub")} />;
  }

  // ── Hub ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 112, background: "#FBF6F0" }}>

      {/* Page title */}
      <div style={{ padding: "62px 22px 28px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.26em", color: "#D4849A", marginBottom: 6 }}>YOUR MAILBOX</p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 44, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1 }}>Mailbox.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "#C07080", marginTop: 6 }}>Your letters &amp; invitations — yours to keep.</p>
      </div>

      <div style={{ padding: "0 18px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── Letters — physical letter paper ── */}
        <button onClick={() => setSection("letters")} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
          <div style={{ position: "relative" }}>
            {/* Stacked paper layers */}
            <div style={{ position: "absolute", inset: 4, background: "#E8D5C4", borderRadius: 18, transform: "rotate(2deg)", zIndex: 0 }} />
            <div style={{ position: "absolute", inset: 2, background: "#F0DDD0", borderRadius: 18, transform: "rotate(-1.2deg)", zIndex: 1 }} />
            {/* Main letter */}
            <div style={{
              position: "relative", zIndex: 2, borderRadius: 18, overflow: "hidden",
              background: "#FEFDF8",
              backgroundImage: "repeating-linear-gradient(transparent, transparent 23px, rgba(200,84,106,0.08) 23px, rgba(200,84,106,0.08) 24px)",
              backgroundPosition: "0 46px",
              boxShadow: "0 4px 22px rgba(0,0,0,0.14), inset 0 0 0 1px rgba(200,84,106,0.1)",
            }}>
              {/* Red margin line */}
              <div style={{ position: "absolute", top: 0, bottom: 0, left: 38, width: 1.5, background: "rgba(200,84,106,0.22)", zIndex: 3 }} />
              {/* Hole punches */}
              <div style={{ position: "absolute", top: 24, left: 13, width: 10, height: 10, borderRadius: "50%", background: "#FFF5EE", border: "1.5px solid rgba(200,84,106,0.15)", zIndex: 3 }} />
              <div style={{ position: "absolute", top: 64, left: 13, width: 10, height: 10, borderRadius: "50%", background: "#FFF5EE", border: "1.5px solid rgba(200,84,106,0.15)", zIndex: 3 }} />
              {/* Content */}
              <div style={{ padding: "20px 22px 16px 52px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: "#C07080", marginBottom: 4 }}>THE LETTER BOX</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 30, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1, marginBottom: 4 }}>Letters.</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#C07080", marginBottom: letterUnread > 0 ? 12 : 0 }}>Words written just for you.</p>
                {letterUnread > 0 && (
                  <div style={{ display: "inline-flex", background: "rgba(200,84,106,0.1)", borderRadius: 999, padding: "4px 14px", border: "1px solid rgba(200,84,106,0.18)" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "#C07080" }}>{letterUnread} unread</span>
                  </div>
                )}
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#bbb", marginTop: 12, fontStyle: "italic", lineHeight: "24px" }}>
                  &ldquo;To every woman who showed up for herself...&rdquo;
                </p>
              </div>
              {/* Footer */}
              <div style={{ background: "rgba(200,84,106,0.04)", padding: "12px 22px 12px 52px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px dashed rgba(200,84,106,0.15)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "#3A2030" }}>
                  {letters.length} letter{letters.length !== 1 ? "s" : ""}
                  {letterUnread > 0 ? ` · ${letterUnread} unread` : " · all read"}
                </p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C07080" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
          </div>
        </button>

        {/* ── Invitations — envelope object ── */}
        <button onClick={() => setSection("invitations")} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
          <div style={{ position: "relative" }}>
            {/* Envelope layers for depth */}
            <div style={{ position: "absolute", inset: 0, background: "#FFB8D8", borderRadius: 20, transform: "rotate(1.5deg)", zIndex: 0 }} />
            <div style={{ position: "absolute", inset: 0, background: "#FFD0E8", borderRadius: 20, transform: "rotate(-0.8deg)", zIndex: 1 }} />
            {/* Main envelope */}
            <div style={{ position: "relative", zIndex: 2, borderRadius: 20, overflow: "hidden", background: "white", border: "1.5px solid rgba(255,31,125,0.12)" }}>
              {/* Envelope flap */}
              <div style={{ position: "relative", height: 68, background: "linear-gradient(145deg, #FF1F7D 0%, #FF6BA8 100%)", overflow: "visible" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)", pointerEvents: "none" }} />
                {/* V-fold at bottom of flap */}
                <svg width="100%" height="32" viewBox="0 0 320 32" preserveAspectRatio="none" style={{ position: "absolute", bottom: -1, left: 0, display: "block" }}>
                  <polygon points="0,0 320,0 160,32" fill="#FF6BA8" />
                </svg>
                {/* Wax seal */}
                <div style={{
                  position: "absolute", bottom: -20, left: "50%", transform: "translateX(-50%)",
                  width: 40, height: 40, borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #FF79AE, #C0185F)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 5, boxShadow: "0 3px 12px rgba(192,24,95,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                  border: "1.5px solid rgba(255,255,255,0.35)",
                }}>
                  <span style={{ color: "white", fontSize: 16, fontWeight: 900 }}>✦</span>
                </div>
              </div>
              {/* Envelope body content */}
              <div style={{ padding: "34px 22px 16px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: "#D4849A", marginBottom: 4 }}>THE INVITATION BOX</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 30, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1, marginBottom: 4 }}>Invitations.</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#C07080", marginBottom: inviteUnread > 0 ? 12 : 0 }}>Someone saved you a seat.</p>
                {inviteUnread > 0 && (
                  <div style={{ display: "inline-flex", background: PINK, borderRadius: 999, padding: "4px 14px" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "white" }}>{inviteUnread} new</span>
                  </div>
                )}
              </div>
              {/* Footer */}
              <div style={{ background: "#FFF5F8", padding: "12px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,31,125,0.08)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "#3A2030" }}>
                  {invitations.length} invitation{invitations.length !== 1 ? "s" : ""}
                  {inviteUnread > 0 ? ` · ${inviteUnread} waiting` : " · all opened"}
                </p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C07080" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
          </div>
        </button>

      </div>
    </div>
  );
}

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
