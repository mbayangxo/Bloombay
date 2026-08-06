"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getInvitationById, respondToInvitation, markInvitationRead,
  type MemberInvitationWithSender,
} from "@/lib/actions/invitations";
import { InvitationEventCard, type EventCardData } from "@/app/components/portal/event-card-templates";

const PINK = "#FF1F7D";
const CREAM = "#FAF6F0";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

type InvitePhase = "sealed" | "opening" | "reading" | "accepted" | "declined" | "maybe";
type RespondKind = "declined" | "maybe";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

// ── One-shot confetti burst (fires when the envelope opens) ────────────────────
function ConfettiBurst() {
  const [pieces] = useState(() => {
    const colors = ["#FF1F7D", "#FF69B4", "#FFB6D0", "#FFD700", "#A855F7", "#ffffff"];
    const shapes = ["✦", "★", "◆", "●", "▲"];
    return Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[i % colors.length],
      shape: shapes[i % shapes.length],
      size: 10 + Math.random() * 14,
      duration: 1.8 + Math.random() * 1.4,
      delay: Math.random() * 0.5,
    }));
  });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), 3400);
    return () => window.clearTimeout(t);
  }, []);

  if (!visible) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: "-10px",
          color: p.color, fontSize: p.size, lineHeight: 1,
          animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
        }}>
          {p.shape}
        </div>
      ))}
    </div>
  );
}

// ── Wax seal ──────────────────────────────────────────────────────────────────
function WaxSeal({ size = 72, cracked = false }: { size?: number; cracked?: boolean }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "radial-gradient(circle at 38% 32%, #E8006A, #9A0040)",
      boxShadow: "0 6px 24px rgba(170,0,72,0.5), inset 0 1px 2px rgba(255,255,255,0.22)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", flexShrink: 0,
      transition: "transform 0.3s, opacity 0.3s",
      transform: cracked ? "scale(0.4) rotate(25deg)" : "scale(1)",
      opacity: cracked ? 0 : 1,
    }}>
      <div style={{ position: "absolute", inset: 4, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 0, position: "relative" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: size * 0.28, color: "rgba(255,255,255,0.9)", lineHeight: 1, letterSpacing: -1 }}>B</span>
        <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: size * 0.28, color: "rgba(255,255,255,0.9)", lineHeight: 1, display: "inline-block", transform: "scaleX(-1)", letterSpacing: -1 }}>B</span>
      </div>
    </div>
  );
}

// ── Physical envelope ─────────────────────────────────────────────────────────
function Envelope({ invite, sealCracked, cardRising }: {
  invite: MemberInvitationWithSender;
  sealCracked: boolean;
  cardRising: boolean;
}) {
  const fromName = invite.from_name ?? "A Bloomie";
  const fromInitial = fromName.trim().charAt(0).toUpperCase() || "B";
  const fromColor = invite.accent_color ?? PINK;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340, margin: "0 auto" }}>
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%) rotate(2.5deg)",
        width: "94%", height: "88%", borderRadius: 12,
        background: `${GRAIN}, #FFECF4`,
        backgroundSize: "200px 200px, auto",
        boxShadow: "0 8px 32px rgba(255,31,125,0.12)",
        zIndex: 0,
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%) rotate(-1.5deg)",
        width: "96%", height: "86%", borderRadius: 12,
        background: `${GRAIN}, #FFF5F8`,
        backgroundSize: "200px 200px, auto",
        boxShadow: "0 6px 24px rgba(255,31,125,0.08)",
        zIndex: 1,
      }} />

      <div style={{
        position: "relative", zIndex: 2,
        borderRadius: 14, overflow: "visible",
        boxShadow: "0 24px 64px rgba(200,0,80,0.22), 0 4px 16px rgba(0,0,0,0.1)",
      }}>
        <div style={{
          borderRadius: 14, overflow: "hidden",
          background: `${GRAIN}, linear-gradient(160deg, #FF5BAD 0%, #FF1F7D 60%, #E0006A 100%)`,
          backgroundSize: "200px 200px, auto",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 48,
            background: "linear-gradient(180deg, rgba(255,255,255,0.12), transparent)",
            zIndex: 1,
          }} />

          <div style={{
            position: "relative", zIndex: 3,
            transition: "transform 0.7s cubic-bezier(0.34,1.1,0.64,1)",
            transformOrigin: "top center",
            transform: sealCracked ? "scaleY(-1)" : "scaleY(1)",
          }}>
            <svg width="100%" height="80" viewBox="0 0 340 80" preserveAspectRatio="none" style={{ display: "block" }}>
              <polygon points="0,0 340,0 170,80" fill="#E0005A" />
              <polygon points="0,0 340,0 170,80" fill="rgba(0,0,0,0.08)" />
              <line x1="0" y1="0" x2="170" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="340" y1="0" x2="170" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </svg>
          </div>

          {cardRising && (
            <div style={{
              position: "absolute", top: 20, left: "50%",
              transform: "translateX(-50%)",
              width: "78%", zIndex: 4,
              animation: "cardPeek 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}>
              <div style={{
                background: `${GRAIN}, ${CREAM}`,
                backgroundSize: "200px 200px, auto",
                borderRadius: 8, height: 40,
                border: "1px solid rgba(255,31,125,0.1)",
                boxShadow: "0 -4px 16px rgba(0,0,0,0.12)",
              }} />
            </div>
          )}

          <div style={{ padding: "0 28px 36px", position: "relative", zIndex: 2, marginTop: -4 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)" }} />
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 8 }}>✦</span>
                <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.2)" }} />
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 8 }}>✦</span>
                <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)" }} />
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.38em", color: "rgba(255,255,255,0.5)" }}>BLOOMBAY</p>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <WaxSeal size={68} cracked={sealCracked} />
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <div style={{
                background: "rgba(255,255,255,0.14)", borderRadius: 999,
                padding: "6px 16px 6px 8px", border: "1px solid rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${fromColor}, ${fromColor}99)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 800, color: "white",
                  boxShadow: `0 2px 8px ${fromColor}55`,
                }}>{fromInitial}</div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>from {fromName}</p>
              </div>
            </div>

            <p style={{ textAlign: "center", fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 6 }}>
              sealed with care · {timeAgo(invite.created_at)}
            </p>
          </div>

          <svg width="100%" height="40" viewBox="0 0 340 40" preserveAspectRatio="none" style={{ display: "block", marginTop: -1 }}>
            <polygon points="0,40 340,40 170,0" fill="#C8005A" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Respond note sheet (decline or "not sure yet") ─────────────────────────────
const RESPOND_COPY: Record<RespondKind, { title: string; subtitle: string; defaultNote: (name: string) => string; button: string }> = {
  declined: {
    title: "Sending your apologies",
    subtitle: "A note will be sent to",
    defaultNote: (name) => `Hi ${name}! I'm so sorry, I can't make it — but thank you so much for thinking of me. I hope you all have the most amazing time! ♡`,
    button: "Send My Apologies ✉",
  },
  maybe: {
    title: "Let her know you're not sure yet",
    subtitle: "A note will be sent to",
    defaultNote: (name) => `Hi ${name}! Not 100% sure yet, but I'll let you know as soon as I can — really hope I can make it! ♡`,
    button: "Send — I'll Let Her Know",
  },
};

function RespondSheet({ kind, fromName, onSend, onCancel }: {
  kind: RespondKind;
  fromName: string;
  onSend: (note: string) => void;
  onCancel: () => void;
}) {
  const copy = RESPOND_COPY[kind];
  const [note, setNote] = useState(copy.defaultNote(fromName));

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end",
      animation: "fadeIn 0.2s ease",
    }} onClick={onCancel}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", borderRadius: "24px 24px 0 0",
          background: CREAM, padding: "28px 22px 40px",
          boxShadow: "0 -12px 48px rgba(0,0,0,0.18)",
          animation: "sheetUp 0.35s cubic-bezier(0.34,1.2,0.64,1)",
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(0,0,0,0.12)", margin: "0 auto 20px" }} />

        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 20, color: "rgba(0,0,0,0.82)", marginBottom: 4 }}>
          {copy.title}
        </p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 18, lineHeight: 1.5 }}>
          {copy.subtitle} {fromName}
        </p>

        <div style={{
          borderRadius: 14, padding: "16px 16px",
          border: "1px solid rgba(255,31,125,0.1)",
          boxShadow: "0 4px 18px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)",
          marginBottom: 18,
          backgroundImage: `${GRAIN}, repeating-linear-gradient(transparent, transparent 25px, rgba(255,31,125,0.06) 26px)`,
          backgroundPosition: "0 0, 0 10px",
          backgroundSize: "200px 200px, 100% 26px",
          backgroundColor: "white",
        }}>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none", resize: "none",
              fontFamily: "var(--font-caveat)", fontSize: 16, color: "#1C1B1C", lineHeight: "26px",
              minHeight: 104,
            }}
          />
        </div>

        <button
          onClick={() => onSend(note)}
          style={{
            width: "100%", padding: "16px 0", borderRadius: 50,
            background: "#1C1B1C", color: "white", fontSize: 13,
            fontWeight: 800, letterSpacing: "0.06em", border: "none", cursor: "pointer",
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            marginBottom: 10,
          }}
        >
          {copy.button}
        </button>
        <button onClick={onCancel} style={{ width: "100%", background: "transparent", border: "none", padding: "10px", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.35)", fontWeight: 600 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function InvitationDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [invite, setInvite] = useState<MemberInvitationWithSender | null | undefined>(undefined);
  const [phase, setPhase] = useState<InvitePhase>("sealed");
  const [respondSheet, setRespondSheet] = useState<RespondKind | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [responding, setResponding] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!id) return;
    getInvitationById(id).then(data => {
      setInvite(data);
      if (data?.status === "accepted") setPhase("accepted");
      else if (data?.status === "declined") setPhase("declined");
      else if (data?.status === "maybe") setPhase("maybe");
    });
  }, [id]);

  function handleOpen() {
    setPhase("opening");
    setShowConfetti(true);
    setTimeout(() => {
      setPhase("reading");
      if (id) void markInvitationRead(id);
    }, 900);
  }

  async function handleAccept() {
    if (!id || responding) return;
    setResponding(true);
    const res = await respondToInvitation(id, "accepted");
    setResponding(false);
    if (res.ok) setPhase("accepted");
  }

  async function handleRespondWithNote(kind: RespondKind, note: string) {
    if (!id || responding) return;
    setResponding(true);
    const res = await respondToInvitation(id, kind, note);
    setResponding(false);
    setRespondSheet(null);
    if (res.ok) setPhase(kind);
  }

  if (invite === undefined) {
    return (
      <div style={{ minHeight: "100dvh", background: "linear-gradient(160deg, #FFF0F8 0%, #FFE4F2 50%, #FFF8F0 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "rgba(255,31,125,0.5)" }}>Finding your invitation…</p>
      </div>
    );
  }

  if (invite === null) {
    return (
      <div style={{ minHeight: "100dvh", background: "linear-gradient(160deg, #FFF0F8 0%, #FFE4F2 50%, #FFF8F0 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24, textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "rgba(0,0,0,0.75)" }}>This invitation isn&apos;t yours to open.</p>
        <Link href="/member/messages?filter=invitations" style={{ padding: "12px 28px", borderRadius: 50, background: "rgba(255,31,125,0.08)", color: PINK, border: `1.5px solid ${PINK}30`, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
          Back to Mailbox
        </Link>
      </div>
    );
  }

  const fromName = invite.from_name ?? "A Bloomie";
  const eventTitle = invite.event_title ?? invite.subject;
  const eventDate = invite.event_date ? new Date(invite.event_date) : null;
  const dateLabel = eventDate ? eventDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) : "Date TBD";
  const timeLabel = eventDate ? eventDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";

  const cardData: EventCardData = {
    id: invite.id,
    type: "invitation",
    title: eventTitle,
    host: fromName,
    location: invite.venue ?? "TBD",
    date: eventDate ? eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD",
    time: timeLabel,
    accentColor: invite.accent_color ?? PINK,
    imageUrl: invite.image_url ?? undefined,
    invitationStyle: invite.template_id,
    href: `/member/invitations/${invite.id}`,
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #FFF0F8 0%, #FFE4F2 50%, #FFF8F0 100%)",
      position: "relative", overflowX: "hidden",
    }}>
      {showConfetti && <ConfettiBurst />}

      <style>{`
        @keyframes flyIn {
          from { transform: translateY(60px) scale(0.94); opacity: 0; }
          to   { transform: translateY(0)   scale(1);    opacity: 1; }
        }
        @keyframes cardReveal {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes sheetUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes cardPeek {
          from { transform: translateY(30px); opacity: 0; }
          to   { transform: translateY(-20px); opacity: 1; }
        }
        @keyframes pulsePink {
          0%,100% { box-shadow: 0 6px 24px rgba(255,31,125,0.44); }
          50%     { box-shadow: 0 6px 36px rgba(255,31,125,0.7); }
        }
      `}</style>

      {/* Top nav */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "56px 20px 12px",
      }}>
        <Link href="/member/messages?filter=invitations" style={{
          width: 38, height: 38, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.16)",
          textDecoration: "none",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.4" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>

        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.3em", color: "rgba(255,31,125,0.45)" }}>
          ✦ BLOOMBAY INVITATION
        </p>

        <div style={{ width: 38 }} />
      </div>

      {/* Main content */}
      <div style={{
        position: "relative", zIndex: 10,
        padding: "12px 22px 100px",
        animation: mounted ? "flyIn 0.5s cubic-bezier(0.34,1.2,0.64,1) forwards" : "none",
      }}>

        {/* ── SEALED / OPENING ──────────────────────────────────────────────── */}
        {(phase === "sealed" || phase === "opening") && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,31,125,0.6)" }}>
                An invitation is waiting for you ♡
              </p>
            </div>

            <Envelope invite={invite} sealCracked={phase === "opening"} cardRising={phase === "opening"} />

            {phase === "sealed" && (
              <button
                onClick={handleOpen}
                style={{
                  width: "100%", maxWidth: 340, margin: "0 auto",
                  padding: "17px 0", borderRadius: 50,
                  background: `linear-gradient(135deg, ${PINK}, #C8005A)`,
                  color: "white", fontSize: 14, fontWeight: 800,
                  letterSpacing: "0.06em", border: "none", cursor: "pointer",
                  boxShadow: `0 8px 28px ${PINK}50, inset 0 1px 0 rgba(255,255,255,0.2)`,
                  display: "block",
                  animation: "pulsePink 2s ease infinite",
                }}
              >
                Open Invitation →
              </button>
            )}

            {phase === "opening" && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,31,125,0.55)", animation: "fadeIn 0.3s ease" }}>
                  opening…
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── READING ────────────────────────────────────────────────────────── */}
        {phase === "reading" && (
          <div style={{ maxWidth: 380, margin: "0 auto", animation: "cardReveal 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
              <InvitationEventCard ev={cardData} />
            </div>

            <div style={{
              background: `${GRAIN}, ${CREAM}`, backgroundSize: "200px 200px, auto",
              borderRadius: 18, padding: "18px 20px", marginBottom: 18,
              boxShadow: "0 8px 28px rgba(0,0,0,0.08)", border: "1px solid rgba(255,31,125,0.08)",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.3)", marginBottom: 8 }}>
                {dateLabel}{timeLabel ? ` · ${timeLabel}` : ""}
              </p>
              {invite.body && (
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.6)", lineHeight: 1.6, fontStyle: "italic" }}>
                  &ldquo;{invite.body}&rdquo;
                </p>
              )}
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.4)", marginTop: 8 }}>— {fromName}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={handleAccept}
                disabled={responding}
                style={{
                  width: "100%", padding: "16px 0", borderRadius: 50,
                  background: `linear-gradient(135deg, ${PINK}, #E0005A)`,
                  color: "white", fontSize: 13, fontWeight: 800,
                  letterSpacing: "0.06em", border: "none", cursor: "pointer",
                  boxShadow: `0 6px 24px ${PINK}44, inset 0 1px 0 rgba(255,255,255,0.2)`,
                  opacity: responding ? 0.6 : 1,
                }}
              >
                I&apos;m in — count me! 🌸
              </button>
              <button
                onClick={() => setRespondSheet("maybe")}
                disabled={responding}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 50,
                  background: "rgba(255,31,125,0.06)", color: PINK,
                  fontSize: 12, fontWeight: 700,
                  border: `1.5px solid ${PINK}25`, cursor: "pointer",
                }}
              >
                Maybe — not sure yet 🤞
              </button>
              <button
                onClick={() => setRespondSheet("declined")}
                disabled={responding}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 50,
                  background: "transparent", color: "rgba(0,0,0,0.38)",
                  fontSize: 12, fontWeight: 600,
                  border: "1.5px solid rgba(0,0,0,0.1)", cursor: "pointer",
                }}
              >
                I&apos;m sorry, I can&apos;t make it
              </button>
            </div>
          </div>
        )}

        {/* ── ACCEPTED ───────────────────────────────────────────────────────── */}
        {phase === "accepted" && (
          <div style={{ maxWidth: 380, margin: "0 auto", textAlign: "center", padding: "40px 4px", animation: "cardReveal 0.4s ease forwards" }}>
            <p style={{ fontSize: 44, marginBottom: 10 }}>🌸</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 26, color: "#1C1B1C", marginBottom: 6 }}>You&apos;re going!</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,31,125,0.55)", marginBottom: 28 }}>{fromName} will see you there.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/member/messages?filter=invitations" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "14px 0", borderRadius: 50,
                background: `linear-gradient(135deg, ${PINK}, #C8005A)`,
                color: "white", fontSize: 13, fontWeight: 800,
                letterSpacing: "0.06em", textDecoration: "none",
                boxShadow: `0 6px 24px ${PINK}44`,
              }}>
                Back to Mailbox
              </Link>
            </div>
          </div>
        )}

        {/* ── DECLINED ───────────────────────────────────────────────────────── */}
        {phase === "declined" && (
          <div style={{ maxWidth: 380, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 28px", textAlign: "center", animation: "cardReveal 0.4s ease forwards" }}>
            <div style={{ marginBottom: 24 }}>
              <svg width="80" height="60" viewBox="0 0 80 60">
                <rect x="2" y="16" width="76" height="44" rx="6" fill="#FFB3D9"/>
                <polygon points="2,16 40,42 78,16" fill="#FF5BAD"/>
                <polygon points="2,60 78,60 78,16 40,42 2,16" fill="#FF8EC7"/>
                <circle cx="34" cy="38" r="2.5" fill="rgba(200,0,80,0.5)"/>
                <circle cx="46" cy="38" r="2.5" fill="rgba(200,0,80,0.5)"/>
                <path d="M35 46 Q40 42 45 46" stroke="rgba(200,0,80,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "rgba(0,0,0,0.78)", marginBottom: 6 }}>Your note was sent.</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.45)", marginBottom: 24, lineHeight: 1.6 }}>
              {fromName} will know you were thinking of them. Maybe next time ♡
            </p>
            <Link href="/member/messages?filter=invitations" style={{
              padding: "12px 28px", borderRadius: 50,
              background: "rgba(255,31,125,0.08)", color: PINK,
              border: `1.5px solid ${PINK}30`,
              fontSize: 12, fontWeight: 700, textDecoration: "none",
            }}>
              Back to Mailbox
            </Link>
          </div>
        )}

        {/* ── MAYBE ──────────────────────────────────────────────────────────── */}
        {phase === "maybe" && (
          <div style={{ maxWidth: 380, margin: "0 auto", textAlign: "center", padding: "40px 4px", animation: "cardReveal 0.4s ease forwards" }}>
            <p style={{ fontSize: 44, marginBottom: 10 }}>🤞</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 24, color: "#1C1B1C", marginBottom: 6 }}>Noted — not sure yet.</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,31,125,0.55)", marginBottom: 28 }}>{fromName} knows you're thinking about it. Change your mind any time.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => setPhase("reading")}
                style={{
                  padding: "14px 0", borderRadius: 50,
                  background: `linear-gradient(135deg, ${PINK}, #C8005A)`,
                  color: "white", fontSize: 13, fontWeight: 800,
                  letterSpacing: "0.06em", border: "none", cursor: "pointer",
                  boxShadow: `0 6px 24px ${PINK}44`,
                }}
              >
                Actually, I know now →
              </button>
              <Link href="/member/messages?filter=invitations" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "13px 0", borderRadius: 50,
                background: "rgba(255,31,125,0.07)", color: PINK,
                border: `1.5px solid ${PINK}25`,
                fontSize: 12, fontWeight: 700, textDecoration: "none",
              }}>
                Back to Mailbox
              </Link>
            </div>
          </div>
        )}
      </div>

      {respondSheet && (
        <RespondSheet
          kind={respondSheet}
          fromName={fromName}
          onSend={note => handleRespondWithNote(respondSheet, note)}
          onCancel={() => setRespondSheet(null)}
        />
      )}
    </div>
  );
}
