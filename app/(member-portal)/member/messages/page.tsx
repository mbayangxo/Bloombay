"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { markInvitationRead, respondToInvitation } from "@/lib/actions/invitations";

const PINK = "#FF1F7D";
const GOLD = "#D4A853";

type MailboxItemType = "letter" | "invitation" | "founders-invitation";

interface MailboxItem {
  id: string | number;
  type: MailboxItemType;
  from: string;
  initial: string;
  color: string;
  subject: string;
  preview: string;
  date: string;
  opened: boolean;
  body?: string;
}

function formatMessageDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Letter / Invitation Detail View ───────────────────────────────────────────
function LetterView({ item, onBack }: { item: MailboxItem; onBack: () => void }) {
  const [flapped, setFlapped]       = useState(false);
  const [revealed, setRevealed]     = useState(false);
  const [response, setResponse]     = useState<"accepted" | "declined" | null>(null);
  const [showNote, setShowNote]     = useState(false);
  const [note, setNote]             = useState("");
  const [noteSent, setNoteSent]     = useState(false);
  const [responding, setResponding] = useState(false);

  const invitationId = typeof item.id === "string" && item.id.startsWith("inv-") ? item.id.slice(4) : null;

  async function respond(status: "accepted" | "declined") {
    if (responding) return;
    if (invitationId) {
      setResponding(true);
      const res = await respondToInvitation(invitationId, status, status === "declined" ? note : undefined);
      setResponding(false);
      if (!res.ok) return;
    }
    setResponse(status);
    if (note.trim()) setNoteSent(true);
  }

  const isFounders   = item.type === "founders-invitation";
  const isInvitation = item.type === "invitation";

  // trigger flap open, then reveal content
  useEffect(() => {
    const t1 = setTimeout(() => setFlapped(true),  280);
    const t2 = setTimeout(() => setRevealed(true), 860);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (isFounders) {
    return (
      <div style={{ minHeight: "100vh", paddingBottom: 96, background: "#07060A" }}>
        <div style={{ padding: "54px 20px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(212,168,83,0.7)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(212,168,83,0.5)" }}>✦ FOUNDING 100</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 8, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "radial-gradient(circle at 38% 38%, #C8963C 0%, #A0721C 55%, #7A5210 100%)", boxShadow: "0 4px 24px rgba(212,168,83,0.35), inset 0 1px 0 rgba(255,255,255,0.12)", border: "1px solid rgba(212,168,83,0.4)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <span style={{ color: "rgba(255,245,220,0.95)", fontSize: 24, fontWeight: 900 }}>✦</span>
          </div>
        </div>
        <div style={{ padding: "0 20px" }}>
          <div style={{ borderRadius: 24, overflow: "hidden", background: "linear-gradient(160deg, #1C1608 0%, #0F0C04 60%, #1C1608 100%)", boxShadow: "0 16px 56px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(212,168,83,0.18)" }}>
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.55), transparent)" }} />
            <div style={{ padding: "28px 28px 24px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.3em", color: "rgba(212,168,83,0.45)", textAlign: "center", marginBottom: 20 }}>BLOOMBAY · FOUNDING 100</p>
              <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", color: "rgba(255,238,210,0.82)", fontSize: 15, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{item.body ?? item.preview}</div>
            </div>
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.25), transparent)" }} />
            <div style={{ padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, letterSpacing: "0.2em", color: "rgba(212,168,83,0.3)" }}>PERMANENT · FOUNDING 100</p>
              <p style={{ color: "rgba(212,168,83,0.3)", fontSize: 10 }}>✦</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const envColor = isInvitation ? (item.color ?? PINK) : "#C8546A";

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: "#FFF0F6" }}>
      <style>{`
        @keyframes flapOpen {
          0%   { transform: perspective(700px) rotateX(0deg);    }
          100% { transform: perspective(700px) rotateX(-165deg); }
        }
        @keyframes letterRise {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes noteIn {
          from { transform: translateY(10px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      <div style={{ padding: "54px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,31,125,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: "#FF69B4" }}>
          {isInvitation ? "✉ INVITATION" : "✉ LETTER"}
        </p>
      </div>

      {/* ── Envelope object with animated flap ── */}
      <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 320, position: "relative" }}>

          {/* Envelope body (bottom half — always visible) */}
          <div style={{ borderRadius: "0 0 14px 14px", overflow: "hidden", background: "#FFEDF4", border: `1.5px solid ${envColor}44`, borderTop: "none" }}>
            {/* Left + right V shadows */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(200,84,106,0.12) 0%, transparent 25%, transparent 75%, rgba(200,84,106,0.12) 100%)", pointerEvents: "none", zIndex: 1 }} />
            {/* Bottom V fold */}
            <svg width="100%" height="36" viewBox="0 0 320 36" preserveAspectRatio="none" style={{ display: "block" }}>
              <polygon points="0,36 320,36 160,0" fill={`${envColor}44`} />
            </svg>
            <div style={{ height: 48 }} />
          </div>

          {/* Flap (top half — animates open) */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: "55%",
            transformOrigin: "top center",
            animation: flapped ? "flapOpen 0.52s cubic-bezier(0.4,0,0.2,1) forwards" : undefined,
            zIndex: 4,
          }}>
            {/* Flap triangle */}
            <svg width="100%" height="100%" viewBox="0 0 320 80" preserveAspectRatio="none" style={{ display: "block" }}>
              <polygon points="0,0 320,0 160,80" fill={envColor} />
              <polygon points="0,0 320,0 160,80" fill="rgba(0,0,0,0.04)" />
            </svg>
            {/* Wax seal on flap */}
            <div style={{
              position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)",
              width: 38, height: 38, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, ${isInvitation ? "#FF79AE" : "#C8546A"}, ${isInvitation ? "#C0185F" : "#8B2040"})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 6, boxShadow: `0 3px 14px ${envColor}55`,
              border: "1.5px solid rgba(255,255,255,0.35)",
            }}>
              <span style={{ color: "white", fontSize: 14, fontWeight: 900 }}>✦</span>
            </div>
          </div>

          {/* Envelope outline/border */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: 14,
            border: `1.5px solid ${envColor}33`, pointerEvents: "none", zIndex: 5,
          }} />
        </div>
      </div>

      {/* ── Content — rises after flap opens ── */}
      {revealed && (
        <div style={{ margin: "16px 20px 0", animation: "letterRise 0.4s ease both" }}>

          {isInvitation ? (
            // ── Invitation content ──
            <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 12px 40px rgba(200,80,120,0.16)", border: "1px solid rgba(212,140,160,0.12)" }}>
              {/* Formal invitation header */}
              <div style={{ padding: "22px 22px 0", textAlign: "center", borderBottom: "1px solid rgba(200,84,106,0.1)", paddingBottom: 18 }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 11, fontStyle: "italic", color: "#C07080", marginBottom: 6 }}>You&apos;re cordially invited to</p>
                <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1.2, marginBottom: 10 }}>{item.subject}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${item.color}, ${item.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: 11 }}>{item.initial}</div>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#888" }}>from {item.from}</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#bbb" }}>· {item.date}</p>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: "18px 22px", backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(0,0,0,0.04) 28px)", backgroundSize: "100% 28px", backgroundPosition: "0 18px" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontStyle: "italic", color: "#555", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{item.body ?? item.preview}</p>
              </div>

              {/* ── Accept / Decline / Note ── */}
              <div style={{ padding: "18px 22px 22px", borderTop: "1px solid rgba(200,84,106,0.08)" }}>
                {response ? (
                  <div style={{ textAlign: "center", padding: "8px 0" }}>
                    <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, color: response === "accepted" ? PINK : "#999" }}>
                      {response === "accepted" ? "You accepted ✦" : "You declined."}
                    </p>
                    {noteSent && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#C07080", marginTop: 6 }}>Your note was sent.</p>}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                    {/* Note textarea — shown above action buttons when open */}
                    {showNote && (
                      <div style={{ animation: "noteIn 0.25s ease both" }}>
                        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#C07080", marginBottom: 6 }}>
                          Write a note — accept, decline, or just explain ♡
                        </p>
                        <textarea
                          value={note}
                          onChange={e => setNote(e.target.value)}
                          placeholder="e.g. I can't make it but I'd love to next time..."
                          rows={3}
                          style={{
                            width: "100%", boxSizing: "border-box",
                            fontFamily: "var(--font-caveat)", fontSize: 16, color: "#333",
                            border: "1.5px solid rgba(200,84,106,0.2)", borderRadius: 12, padding: "12px 14px",
                            background: "#FFFBFD", resize: "none", outline: "none",
                          }}
                        />
                      </div>
                    )}

                    {/* Primary actions */}
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() => respond("accepted")}
                        disabled={responding}
                        style={{ flex: 1, background: PINK, color: "white", border: "none", borderRadius: 999, padding: "13px 0", fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: 12, letterSpacing: "0.1em", cursor: responding ? "default" : "pointer", opacity: responding ? 0.6 : 1 }}
                      >{note.trim() ? "ACCEPT + SEND NOTE →" : "ACCEPT →"}</button>
                      <button
                        onClick={() => respond("declined")}
                        disabled={responding}
                        style={{ flex: 1, background: "transparent", color: "#999", border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: 999, padding: "13px 0", fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", cursor: responding ? "default" : "pointer", opacity: responding ? 0.6 : 1 }}
                      >{note.trim() ? "DECLINE + SEND NOTE" : "DECLINE"}</button>
                    </div>

                    {/* Toggle note */}
                    <button
                      onClick={() => setShowNote(n => !n)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-caveat)", fontSize: 15, color: "#C07080", textDecoration: "underline", textDecorationStyle: "dotted", padding: "2px 0" }}
                    >
                      {showNote ? "Remove note" : "Write a note to her..."}
                    </button>
                  </div>
                )}
              </div>
            </div>

          ) : (
            // ── Letter content ──
            <div style={{
              borderRadius: 20, overflow: "hidden",
              background: "#FEFDF8",
              backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(200,84,106,0.07) 27px, rgba(200,84,106,0.07) 28px)",
              backgroundPosition: "0 42px",
              boxShadow: "0 12px 40px rgba(200,80,120,0.12), inset 0 0 0 1px rgba(200,84,106,0.08)",
              position: "relative",
            }}>
              {/* Red margin line */}
              <div style={{ position: "absolute", top: 0, bottom: 0, left: 40, width: 1.5, background: "rgba(200,84,106,0.2)", zIndex: 1 }} />
              {/* Hole punches */}
              <div style={{ position: "absolute", top: 22, left: 13, width: 10, height: 10, borderRadius: "50%", background: "#FFF5EE", border: "1.5px solid rgba(200,84,106,0.15)" }} />
              <div style={{ position: "absolute", top: 62, left: 13, width: 10, height: 10, borderRadius: "50%", background: "#FFF5EE", border: "1.5px solid rgba(200,84,106,0.15)" }} />
              <div style={{ padding: "20px 22px 28px 56px", position: "relative", zIndex: 2 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "#C07080", marginBottom: 10 }}>FROM {item.from.toUpperCase()} · {item.date.toUpperCase()}</p>
                <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", marginBottom: 18, lineHeight: 1.2 }}>{item.subject}</h2>
                <div style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "#444", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{item.body ?? item.preview}</div>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15, color: "#C07080", marginTop: 24, textAlign: "right" }}>— {item.from} ✦</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Invitation List ────────────────────────────────────────────────────────────
function InvitationListView({ items, openedItems, onOpen, onBack }: {
  items: MailboxItem[];
  openedItems: Set<string | number>;
  onOpen: (item: MailboxItem) => void;
  onBack: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 60%, #FFF5F0 100%)", paddingBottom: 100 }}>
      <style>{`
        @keyframes cardIn { from { transform: translateY(18px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .inv-card { animation: cardIn 0.38s cubic-bezier(0.34,1.3,0.64,1) both; }
        .inv-card:active { transform: scale(0.97); transition: transform 0.1s; }
      `}</style>

      <div style={{ padding: "56px 20px 24px", background: `linear-gradient(160deg, ${PINK} 0%, #FF5BAD 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.65)" }}>THE INVITATION BOX</p>
        </div>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px, 10vw, 40px)", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, marginBottom: 4 }}>Invitations.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.65)" }}>Someone saved you a seat.</p>
      </div>

      <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
        {items.map((item, idx) => {
          const isUnread = !openedItems.has(item.id);
          return (
            <button key={item.id} onClick={() => onOpen(item)}
              className="inv-card"
              style={{ display: "block", width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, animationDelay: `${idx * 0.07}s` }}>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: `${item.color}22`, borderRadius: 20, transform: "rotate(1.4deg)", zIndex: 0 }} />
                <div style={{
                  position: "relative", zIndex: 1, borderRadius: 20, overflow: "hidden",
                  background: "white", border: `1.5px solid ${isUnread ? item.color + "30" : "rgba(0,0,0,0.05)"}`,
                  boxShadow: isUnread ? `0 8px 32px ${item.color}28` : "0 4px 18px rgba(0,0,0,0.08)",
                }}>
                  {/* Flap */}
                  <div style={{ height: 50, background: `linear-gradient(135deg, ${item.color}EE, ${item.color}BB)`, position: "relative" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.14), transparent)" }} />
                    {isUnread && <div style={{ position: "absolute", top: 10, right: 12, width: 9, height: 9, borderRadius: "50%", background: "white", boxShadow: "0 0 8px rgba(255,255,255,0.8)" }} />}
                  </div>
                  <svg width="100%" height="22" viewBox="0 0 320 22" preserveAspectRatio="none" style={{ display: "block", marginTop: -1 }}>
                    <polygon points="0,0 320,0 160,22" fill={item.color + "BB"} />
                  </svg>
                  {/* Content */}
                  <div style={{ padding: "10px 16px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, marginTop: 2, background: `linear-gradient(135deg, ${item.color}, ${item.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: item.initial.length > 2 ? 9 : 13, fontWeight: 800, color: "white", boxShadow: `0 3px 12px ${item.color}44`, border: "2px solid white" }}>
                      {item.initial}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15, fontWeight: isUnread ? 700 : 500, color: "#111111", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.subject}</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 6 }}>{item.preview}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#FF69B4" }}>from {item.from} · {item.date}</p>
                        {isUnread
                          ? <span style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 900, color: PINK, letterSpacing: "0.18em", background: `${PINK}12`, borderRadius: 99, padding: "3px 8px" }}>NEW</span>
                          : <span style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "rgba(0,0,0,0.3)", letterSpacing: "0.1em" }}>OPENED</span>
                        }
                      </div>
                    </div>
                  </div>
                  <div style={{ height: 8, background: `linear-gradient(90deg, ${item.color}33, ${item.color}55, ${item.color}33)` }} />
                </div>
              </div>
            </button>
          );
        })}

        {items.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "#1A1A1A", marginBottom: 4 }}>No invitations yet.</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#C07080" }}>When someone saves you a seat, it&apos;ll appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Letter List ────────────────────────────────────────────────────────────────
function LetterListView({ items, openedItems, onOpen, onBack }: {
  items: MailboxItem[];
  openedItems: Set<string | number>;
  onOpen: (item: MailboxItem) => void;
  onBack: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#FBE8EE", paddingBottom: 100 }}>
      <div style={{ padding: "56px 20px 20px", background: "linear-gradient(160deg, #C8546A 0%, #E87BA8 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.7)" }}>THE LETTER BOX</p>
        </div>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px, 9vw, 36px)", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>Letters.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>Words written just for you.</p>
      </div>

      <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map(item => {
          const isUnread = !openedItems.has(item.id);
          return (
            <button key={item.id} onClick={() => onOpen(item)}
              style={{ display: "block", width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
              <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(200,80,120,0.1)", border: `1.5px solid ${isUnread ? "rgba(200,84,106,0.3)" : "rgba(0,0,0,0.06)"}` }}>
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
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "#1A1A1A" }}>No letters yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Hub ────────────────────────────────────────────────────────────────────────
function MailboxHub({
  invitations, letters, openedItems,
  setSection, openItem,
}: {
  invitations: MailboxItem[];
  letters: MailboxItem[];
  openedItems: Set<string | number>;
  setSection: (s: HubSection) => void;
  openItem: (item: MailboxItem) => void;
}) {
  const inviteUnread = invitations.filter(i => !openedItems.has(i.id)).length;
  const letterUnread = letters.filter(i => !openedItems.has(i.id)).length;
  const totalUnread  = inviteUnread + letterUnread;

  // Most recent item across all types
  const recentInvite = invitations.find(i => !openedItems.has(i.id)) ?? invitations[0];
  const recentLetter = letters.find(i => !openedItems.has(i.id)) ?? letters[0];

  return (
    <div style={{ minHeight: "100vh", background: "#FFF0F6", paddingBottom: 120 }}>
      <style>{`
        @keyframes hubCardIn { from { transform: translateY(14px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .hub-card { animation: hubCardIn 0.38s ease both; }
      `}</style>

      {/* ── Editorial header ── */}
      <div style={{ background: "linear-gradient(160deg, #FF1F7D 0%, #FF3A8C 50%, #FF69B4 100%)", paddingTop: "calc(env(safe-area-inset-top, 0px) + 64px)", paddingLeft: 22, paddingRight: 22, paddingBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Mailbox icon */}
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 17H2a3 3 0 0 0 3-3V9.6C5 7.1 7.1 5 9.6 5h4.8C16.9 5 19 7.1 19 9.6V14a3 3 0 0 0 3 3z"/>
                <path d="M6 9l6 4 6-4"/>
                <path d="M2 17v1a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1"/>
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.8)", marginBottom: 3 }}>YOUR MAILBOX</p>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 32, color: "white", lineHeight: 1, margin: 0 }}>The Mailbox.</h1>
            </div>
          </div>

          {totalUnread > 0 && (
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: PINK, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 6px 20px ${PINK}55` }}>
              <span style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: 16, color: "white", lineHeight: 1 }}>{totalUnread}</span>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.08em" }}>NEW</span>
            </div>
          )}
        </div>

        {recentInvite && (
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.22)", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.3)" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${recentInvite.color}, ${recentInvite.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "white", flexShrink: 0 }}>{recentInvite.initial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{recentInvite.subject}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.7)", marginTop: 1 }}>from {recentInvite.from} · {recentInvite.date}</p>
            </div>
            <button onClick={() => openItem(recentInvite)} style={{ background: PINK, border: "none", cursor: "pointer", borderRadius: 999, padding: "5px 12px", fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: 9, letterSpacing: "0.1em", color: "white", flexShrink: 0 }}>OPEN</button>
          </div>
        )}
      </div>

      {/* ── Side-by-side cards ── */}
      <div style={{ padding: "18px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

        {/* ── LETTERS card — full-width notepad ── */}
        <button
          onClick={() => setSection("letters")}
          className="hub-card"
          style={{ display: "block", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", animationDelay: "0.05s" }}
        >
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: 4, background: "#E8D5C4", borderRadius: 18, transform: "rotate(2deg)", zIndex: 0 }} />
            <div style={{ position: "absolute", inset: 2, background: "#F0DDD0", borderRadius: 18, transform: "rotate(-1.2deg)", zIndex: 1 }} />
            <div style={{
              position: "relative", zIndex: 2, borderRadius: 18, overflow: "hidden",
              background: "#FEFDF8",
              backgroundImage: "repeating-linear-gradient(transparent, transparent 23px, rgba(200,84,106,0.08) 23px, rgba(200,84,106,0.08) 24px)",
              backgroundPosition: "0 46px",
              boxShadow: "0 4px 22px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(200,84,106,0.1)",
            }}>
              <div style={{ position: "absolute", top: 0, bottom: 0, left: 38, width: 1.5, background: "rgba(200,84,106,0.22)", zIndex: 3 }} />
              <div style={{ position: "absolute", top: 24, left: 13, width: 10, height: 10, borderRadius: "50%", background: "#FFF5EE", border: "1.5px solid rgba(200,84,106,0.15)", zIndex: 3 }} />
              <div style={{ position: "absolute", top: 64, left: 13, width: 10, height: 10, borderRadius: "50%", background: "#FFF5EE", border: "1.5px solid rgba(200,84,106,0.15)", zIndex: 3 }} />
              <div style={{ padding: "20px 22px 16px 52px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.28em", color: "#C07080", marginBottom: 4 }}>THE LETTER BOX</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 30, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1, marginBottom: 4 }}>Letters.</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#C07080", marginBottom: letterUnread > 0 ? 12 : 0 }}>Words written just for you.</p>
                {letterUnread > 0 && (
                  <div style={{ display: "inline-flex", background: "rgba(200,84,106,0.1)", borderRadius: 999, padding: "4px 14px", border: "1px solid rgba(200,84,106,0.18)" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, color: "#C07080" }}>{letterUnread} unread</span>
                  </div>
                )}
                {recentLetter && (
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#bbb", marginTop: 12, fontStyle: "italic", lineHeight: "24px" }}>
                    &ldquo;{recentLetter.preview}&rdquo;
                  </p>
                )}
              </div>
              <div style={{ background: "rgba(200,84,106,0.04)", padding: "12px 22px 12px 52px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px dashed rgba(200,84,106,0.15)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "#3A2030" }}>
                  {letters.length} letter{letters.length !== 1 ? "s" : ""}{letterUnread > 0 ? ` · ${letterUnread} unread` : " · all read"}
                </p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C07080" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
          </div>
        </button>

        {/* ── INVITATIONS card — envelope ── */}
        <button
          onClick={() => setSection("invitations")}
          className="hub-card"
          style={{ display: "block", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", animationDelay: "0.12s" }}
        >
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: "#FFB8D8", borderRadius: 20, transform: "rotate(1.5deg)", zIndex: 0 }} />
            <div style={{ position: "absolute", inset: 0, background: "#FFD0E8", borderRadius: 20, transform: "rotate(-0.8deg)", zIndex: 1 }} />
            <div style={{ position: "relative", zIndex: 2, borderRadius: 20, overflow: "hidden", background: "white", border: "1.5px solid rgba(255,31,125,0.12)" }}>
              <div style={{ position: "relative", height: 68, background: `linear-gradient(145deg, ${PINK} 0%, #FF6BA8 100%)`, overflow: "visible" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)", pointerEvents: "none" }} />
                <svg width="100%" height="32" viewBox="0 0 320 32" preserveAspectRatio="none" style={{ position: "absolute", bottom: -1, left: 0, display: "block" }}>
                  <polygon points="0,0 320,0 160,32" fill="#FF6BA8" />
                </svg>
                <div style={{ position: "absolute", bottom: -20, left: "50%", transform: "translateX(-50%)", width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #FF79AE, #C0185F)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, boxShadow: "0 3px 12px rgba(192,24,95,0.4), inset 0 1px 0 rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.35)" }}>
                  <span style={{ color: "white", fontSize: 16, fontWeight: 900 }}>✦</span>
                </div>
              </div>
              <div style={{ padding: "34px 22px 16px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.28em", color: "#D4849A", marginBottom: 4 }}>THE INVITATION BOX</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 30, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1, marginBottom: 4 }}>Invitations.</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "#C07080", marginBottom: inviteUnread > 0 ? 12 : 0 }}>Someone saved you a seat.</p>
                {inviteUnread > 0 && (
                  <div style={{ display: "inline-flex", background: PINK, borderRadius: 999, padding: "4px 14px" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, color: "white" }}>{inviteUnread} new</span>
                  </div>
                )}
              </div>
              <div style={{ background: "#FFF5F8", padding: "12px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,31,125,0.08)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "#3A2030" }}>
                  {invitations.length} invitation{invitations.length !== 1 ? "s" : ""}{inviteUnread > 0 ? ` · ${inviteUnread} waiting` : " · all opened"}
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

// ── Root ───────────────────────────────────────────────────────────────────────
type HubSection = "hub" | "invitations" | "letters" | "letter";

function MailboxInner() {
  const searchParams = useSearchParams();
  const initial = (
    searchParams.get("filter") === "invitation" ? "invitations"
    : searchParams.get("filter") === "letter"  ? "letters"
    : "hub"
  ) as HubSection;

  const [section, setSection]       = useState<HubSection>(initial);
  const [activeItem, setActiveItem] = useState<MailboxItem | null>(null);
  const [openedItems, setOpenedItems] = useState<Set<string | number>>(new Set());
  const [allItems, setAllItems] = useState<MailboxItem[]>([]);

  useEffect(() => {
    async function loadMessages() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data, error }, { data: invites, error: inviteError }, { data: myProfile }] = await Promise.all([
        supabase
          .from("yande_messages")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("member_invitations")
          .select("id, subject, body, is_read, created_at, profiles!member_invitations_from_user_id_fkey ( first_name, full_name )")
          .eq("to_user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("profiles")
          .select("is_founding_mother, founding_number")
          .eq("id", user.id)
          .maybeSingle(),
      ]);

      const foundingItems: MailboxItem[] = myProfile?.is_founding_mother ? [{
        id: "founders-welcome", type: "founders-invitation", from: "BloomBay", initial: "✦", color: GOLD,
        subject: "You are invited — Founding 100",
        preview: "A letter from us to you. Personal. Private. Open when you're ready.",
        date: "", opened: true,
        body: `Dear Founding Member,\n\nYou were invited before BloomBay was anything.\n\nWhen this was only an idea — a feeling, really — you said yes. You showed up. You trusted something that hadn't proven itself yet.\n\nOf the women who were there in the beginning, you are one of the first 100. That number is permanent. That place is yours forever.\n\nNo matter how large BloomBay becomes, no matter how many women find their way here — you will always be one of the women who built it from nothing.\n\nWe are so grateful for you.\n\nWith love and intention,\nBloomBay ✦${myProfile.founding_number ? `\n\n— You are Founding Member #${myProfile.founding_number}. Always.` : ""}`,
      }] : [];

      const dbItems: MailboxItem[] = error || !data ? [] : data.map((row) => ({
        id: row.id as string,
        type: row.message_type === "introduction" ? "invitation" : "letter",
        from: "Yande",
        initial: "Y",
        color: PINK,
        subject: row.subject ?? "A message from Yande",
        preview: (row.body ?? "").slice(0, 100),
        body: row.body,
        date: formatMessageDate(row.created_at),
        opened: row.is_read ?? false,
      }));

      type InviteRow = {
        id: string; subject: string; body: string | null; is_read: boolean; created_at: string;
        profiles: { first_name: string | null; full_name: string | null } | null;
      };
      const inviteItems: MailboxItem[] = inviteError || !invites ? [] : (invites as unknown as InviteRow[]).map((row) => {
        const senderName = row.profiles?.first_name || row.profiles?.full_name?.split(" ")[0] || "A Bloomie";
        return {
          id: `inv-${row.id}`,
          type: "invitation" as const,
          from: senderName,
          initial: senderName[0]?.toUpperCase() ?? "B",
          color: PINK,
          subject: row.subject,
          preview: (row.body ?? "").slice(0, 100),
          body: row.body ?? undefined,
          date: formatMessageDate(row.created_at),
          opened: row.is_read,
        };
      });

      const merged = [...foundingItems, ...dbItems, ...inviteItems];

      // Mark already-read DB messages in openedItems
      const readIds = merged.filter(i => i.opened).map(i => i.id);
      if (readIds.length > 0) {
        setOpenedItems(prev => new Set([...prev, ...readIds]));
      }

      setAllItems(merged);
    }

    loadMessages();
  }, []);

  async function openItem(item: MailboxItem) {
    setOpenedItems(p => new Set([...p, item.id]));
    setActiveItem(item);
    setSection("letter");

    // Mark read in DB if this is a real DB message (string id)
    if (typeof item.id === "string" && item.id.startsWith("inv-")) {
      await markInvitationRead(item.id.slice(4));
    } else if (typeof item.id === "string") {
      const supabase = createClient();
      await supabase
        .from("yande_messages")
        .update({ is_read: true })
        .eq("id", item.id);
    }
  }

  function backToSection() {
    const target: HubSection =
      activeItem?.type === "invitation" || activeItem?.type === "founders-invitation"
        ? "invitations"
        : activeItem?.type === "letter" ? "letters" : "hub";
    setActiveItem(null);
    setSection(target);
  }

  const invitations = allItems.filter(i => i.type === "invitation" || i.type === "founders-invitation");
  const letters     = allItems.filter(i => i.type === "letter");

  if (section === "letter" && activeItem) {
    return <LetterView item={activeItem} onBack={backToSection} />;
  }
  if (section === "invitations") {
    return <InvitationListView items={invitations} openedItems={openedItems} onOpen={openItem} onBack={() => setSection("hub")} />;
  }
  if (section === "letters") {
    return <LetterListView items={letters} openedItems={openedItems} onOpen={openItem} onBack={() => setSection("hub")} />;
  }

  return (
    <MailboxHub
      invitations={invitations}
      letters={letters}
      openedItems={openedItems}
      setSection={setSection}
      openItem={openItem}
    />
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBE8EE" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, color: "#bbb" }}>Loading mailbox…</p>
      </div>
    }>
      <MailboxInner />
    </Suspense>
  );
}
