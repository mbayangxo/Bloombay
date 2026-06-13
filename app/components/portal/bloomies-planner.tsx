"use client";

import { useState, useEffect, useRef } from "react";
import type {
  BloomiesPlan, PlanMessage, PlanType, RSVPStatus,
} from "@/lib/actions/bloomies-planner";
import { PLAN_TYPE_LABELS, PLAN_TYPE_EMOJIS } from "@/lib/actions/bloomies-planner";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";
const GOLD  = "#D4A853";

// ── helpers ──────────────────────────────────────────────────────────────────

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function initials(name: string | null) {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

const RSVP_COLORS: Record<RSVPStatus, string> = {
  yes: "#22C55E", maybe: GOLD, no: "#EF4444", pending: "#D1D5DB",
};
const RSVP_LABELS: Record<RSVPStatus, string> = {
  yes: "I'm going", maybe: "Not sure yet", no: "I'm not", pending: "Pending",
};

const AVATAR_COLORS = ["#FF1F7D","#FF69B4","#A855F7","#0EA5E9","#83C5A0","#D4A853","#E8006A","#C4005A"];
function avatarColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

// ── Avatar component ──────────────────────────────────────────────────────────

function Avatar({ src, name, userId, size = 32 }: { src?: string | null; name?: string | null; userId?: string; size?: number }) {
  const color = avatarColor(userId ?? name ?? "x");
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name ?? ""} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  ) : (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg,${color},${color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: "var(--font-jost)", fontSize: size * 0.34, fontWeight: 800, color: "white" }}>{initials(name ?? null)}</span>
    </div>
  );
}

// ── RSVP bar ─────────────────────────────────────────────────────────────────

function RSVPBar({ plan, onRSVP }: { plan: BloomiesPlan; onRSVP: (s: RSVPStatus) => void }) {
  if (plan.creator_id === plan.my_rsvp) return null; // creator doesn't RSVP
  const btns: RSVPStatus[] = ["yes", "maybe", "no"];
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
      {btns.map(s => {
        const active = plan.my_rsvp === s;
        return (
          <button key={s} onClick={() => onRSVP(s)} style={{
            flex: 1, padding: "7px 0", borderRadius: 999, border: "none", cursor: "pointer",
            background: active ? RSVP_COLORS[s] : "rgba(0,0,0,0.05)",
            color: active ? "white" : "#888",
            fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.06em",
            transition: "all 0.15s",
          }}>
            {RSVP_LABELS[s]}
          </button>
        );
      })}
    </div>
  );
}

// ── Plan card ─────────────────────────────────────────────────────────────────

function PlanCard({ plan, onOpen, onRSVP }: {
  plan: BloomiesPlan;
  onOpen: () => void;
  onRSVP: (s: RSVPStatus) => void;
}) {
  const emoji = PLAN_TYPE_EMOJIS[plan.plan_type];
  const going = plan.invites.filter(i => i.rsvp_status === "yes").length;
  const maybe = plan.invites.filter(i => i.rsvp_status === "maybe").length;
  const isCreator = plan.creator_id !== plan.invites[0]?.invitee_id; // simplified check

  return (
    <div style={{
      background: "white", borderRadius: 20, overflow: "hidden",
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)", marginBottom: 10,
    }}>
      {/* Header band */}
      <div style={{ background: `linear-gradient(135deg, ${DARK} 0%, #2A0818 100%)`, padding: "14px 16px 12px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -12, top: -12, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${PINK}22 0%, transparent 70%)` }} />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 14, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
            {emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 2 }}>
              {PLAN_TYPE_LABELS[plan.plan_type].toUpperCase()}
            </p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 16, color: "rgba(255,238,220,0.95)", lineHeight: 1.1 }}>
              {plan.title}
            </p>
          </div>
          <div style={{ flexShrink: 0, background: `${RSVP_COLORS[plan.my_rsvp]}22`, border: `1px solid ${RSVP_COLORS[plan.my_rsvp]}55`, borderRadius: 999, padding: "3px 8px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, color: RSVP_COLORS[plan.my_rsvp], letterSpacing: "0.06em" }}>
              {RSVP_LABELS[plan.my_rsvp]}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 16px 14px" }}>
        {(plan.date_time || plan.venue) && (
          <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
            {plan.date_time && (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 12 }}>📅</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#555" }}>{fmtDateTime(plan.date_time)}</p>
              </div>
            )}
            {plan.venue && (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 12 }}>📍</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#555" }}>{plan.venue}</p>
              </div>
            )}
          </div>
        )}

        {plan.description && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#666", lineHeight: 1.4, marginBottom: 10 }}>{plan.description}</p>
        )}

        {/* Who's in */}
        {plan.invites.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <div style={{ display: "flex" }}>
              {plan.invites.slice(0, 4).map((inv, i) => (
                <div key={inv.invitee_id} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 4 - i }}>
                  <Avatar src={inv.avatar_url} name={inv.display_name} userId={inv.invitee_id} size={26} />
                </div>
              ))}
              {plan.invites.length > 4 && (
                <div style={{ marginLeft: -8, width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 0 }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, color: "#888" }}>+{plan.invites.length - 4}</span>
                </div>
              )}
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#aaa" }}>
              {going > 0 ? `${going} going` : ""}
              {going > 0 && maybe > 0 ? " · " : ""}
              {maybe > 0 ? `${maybe} maybe` : ""}
              {going === 0 && maybe === 0 ? `${plan.invites.length} invited` : ""}
            </p>
          </div>
        )}

        {/* Action row */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onOpen} style={{
            flex: 1, padding: "9px 0", borderRadius: 12,
            background: plan.message_count > 0 ? PINK : "rgba(255,31,125,0.08)",
            border: "none", cursor: "pointer",
            color: plan.message_count > 0 ? "white" : PINK,
            fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, letterSpacing: "0.04em",
          }}>
            💬 {plan.message_count > 0 ? `${plan.message_count} messages` : "Open Chat"}
          </button>
        </div>

        {/* RSVP row (only for invitees) */}
        {plan.my_rsvp !== "yes" || plan.invites.some(i => i.invitee_id === (plan as BloomiesPlan & { _userId?: string })._userId) ? (
          <RSVPBar plan={plan} onRSVP={onRSVP} />
        ) : null}
      </div>
    </div>
  );
}

// ── Group Chat View ───────────────────────────────────────────────────────────

function PlanChatView({ plan, userId, onBack }: { plan: BloomiesPlan; userId: string; onBack: () => void }) {
  const [messages, setMessages] = useState<PlanMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [rsvp, setRsvp] = useState<RSVPStatus>(plan.my_rsvp);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void import("@/lib/actions/bloomies-planner").then(m => m.getPlanMessages(plan.id)).then(setMessages);
  }, [plan.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!draft.trim() || sending) return;
    setSending(true);
    const optimistic: PlanMessage = {
      id: `tmp-${Date.now()}`,
      plan_id: plan.id,
      sender_id: userId,
      sender_name: "You",
      sender_avatar: null,
      content: draft.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages(m => [...m, optimistic]);
    setDraft("");
    const { ok } = await (await import("@/lib/actions/bloomies-planner")).sendPlanMessage(plan.id, optimistic.content);
    if (ok) {
      const fresh = await (await import("@/lib/actions/bloomies-planner")).getPlanMessages(plan.id);
      setMessages(fresh);
    }
    setSending(false);
  }

  async function handleRSVP(s: RSVPStatus) {
    setRsvp(s);
    await (await import("@/lib/actions/bloomies-planner")).updateRSVP(plan.id, s);
  }

  const emoji = PLAN_TYPE_EMOJIS[plan.plan_type];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: PAPER }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #2A0818 100%)`,
        paddingTop: "calc(env(safe-area-inset-top,0px) + 52px)",
        paddingBottom: 14, flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
          <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
            {emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 15, color: "rgba(255,238,220,0.95)", lineHeight: 1 }}>
              {plan.title}
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
              {plan.invites.length + 1} women · {PLAN_TYPE_LABELS[plan.plan_type]}
              {plan.date_time ? ` · ${fmtDateTime(plan.date_time)}` : ""}
            </p>
          </div>
        </div>

        {/* RSVP strip — for invitees */}
        {plan.creator_id !== userId && (
          <div style={{ display: "flex", gap: 6, padding: "10px 16px 0" }}>
            {(["yes","maybe","no"] as RSVPStatus[]).map(s => {
              const active = rsvp === s;
              return (
                <button key={s} onClick={() => handleRSVP(s)} style={{
                  flex: 1, padding: "6px 0", borderRadius: 999, border: "none", cursor: "pointer",
                  background: active ? RSVP_COLORS[s] : "rgba(255,255,255,0.08)",
                  color: active ? "white" : "rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.06em",
                  transition: "all 0.15s",
                }}>
                  {RSVP_LABELS[s]}
                </button>
              );
            })}
          </div>
        )}

        {/* Who's going strip */}
        {plan.invites.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px 0", overflowX: "auto", scrollbarWidth: "none" }}>
            {plan.invites.map(inv => (
              <div key={inv.invitee_id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flexShrink: 0 }}>
                <div style={{ position: "relative" }}>
                  <Avatar src={inv.avatar_url} name={inv.display_name} userId={inv.invitee_id} size={28} />
                  <div style={{ position: "absolute", bottom: -1, right: -1, width: 9, height: 9, borderRadius: "50%", background: RSVP_COLORS[inv.rsvp_status], border: "1.5px solid #1C1B1C" }} />
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 700, color: "rgba(255,255,255,0.35)", maxWidth: 32, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {inv.display_name?.split(" ")[0] ?? "?"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px 8px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 20, color: "rgba(255,31,125,0.35)" }}>Start the conversation 🌸</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#ccc", marginTop: 6 }}>This is the group chat for {plan.title}</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.sender_id === userId;
          const prevSame = i > 0 && messages[i - 1].sender_id === msg.sender_id;
          return (
            <div key={msg.id} style={{
              display: "flex", flexDirection: isMe ? "row-reverse" : "row",
              alignItems: "flex-end", gap: 7, marginBottom: prevSame ? 3 : 10,
            }}>
              {!isMe && !prevSame && (
                <Avatar src={msg.sender_avatar} name={msg.sender_name} userId={msg.sender_id} size={28} />
              )}
              {!isMe && prevSame && <div style={{ width: 28 }} />}

              <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                {!isMe && !prevSame && (
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, color: "#aaa", marginBottom: 3, paddingLeft: 2 }}>
                    {msg.sender_name ?? "Unknown"}
                  </p>
                )}
                <div style={{
                  padding: "9px 13px",
                  borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: isMe ? `linear-gradient(135deg, ${PINK}, #FF69B4)` : "white",
                  boxShadow: isMe ? `0 2px 10px ${PINK}33` : "0 1px 6px rgba(0,0,0,0.07)",
                }}>
                  <p style={{
                    fontFamily: "var(--font-jost)", fontSize: 13, lineHeight: 1.4,
                    color: isMe ? "white" : DARK,
                  }}>{msg.content}</p>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "#ccc", marginTop: 3, paddingLeft: 2, paddingRight: 2 }}>
                  {fmtTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "10px 12px",
        paddingBottom: "calc(10px + env(safe-area-inset-bottom,0px))",
        background: "white", borderTop: "1px solid rgba(0,0,0,0.06)",
        display: "flex", gap: 8, alignItems: "center", flexShrink: 0,
      }}>
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Say something…"
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 999,
            background: "#FFF5F8", border: "1.5px solid rgba(255,31,125,0.12)",
            fontFamily: "var(--font-jost)", fontSize: 13, color: DARK,
            outline: "none",
          }}
        />
        <button onClick={handleSend} disabled={!draft.trim() || sending} style={{
          width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer",
          background: draft.trim() ? `linear-gradient(135deg,${PINK},#FF69B4)` : "rgba(0,0,0,0.07)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "background 0.15s",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={draft.trim() ? "white" : "#ccc"} strokeWidth="2.2" strokeLinecap="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Create Plan Sheet ─────────────────────────────────────────────────────────

const PLAN_TYPES: { type: PlanType; emoji: string; label: string }[] = [
  { type: "dinner",   emoji: "🍽️", label: "Dinner"   },
  { type: "birthday", emoji: "🎂", label: "Birthday" },
  { type: "hangout",  emoji: "🌸", label: "Hangout"  },
  { type: "brunch",   emoji: "☕", label: "Brunch"   },
  { type: "trip",     emoji: "✈️", label: "Trip"     },
  { type: "other",    emoji: "💫", label: "Other"    },
];

type CreateStep = "type" | "details" | "invite";

function CreatePlanSheet({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [step, setStep]         = useState<CreateStep>("type");
  const [planType, setPlanType] = useState<PlanType>("hangout");
  const [title, setTitle]       = useState("");
  const [description, setDesc]  = useState("");
  const [dateStr, setDateStr]   = useState("");
  const [venue, setVenue]       = useState("");
  const [friends, setFriends]   = useState<{ id: string; display_name: string | null; avatar_url: string | null }[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [creating, setCreating] = useState(false);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    if (step === "invite") {
      void import("@/lib/actions/bloomies-planner").then(m => m.getBloomiesFriends()).then(setFriends);
    }
  }, [step]);

  function toggleFriend(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  async function handleCreate() {
    if (creating) return;
    setCreating(true);
    const { ok } = await (await import("@/lib/actions/bloomies-planner")).createBloomiesPlan({
      title: title.trim() || PLAN_TYPE_LABELS[planType],
      plan_type: planType,
      description: description.trim() || undefined,
      date_time: dateStr || undefined,
      venue: venue.trim() || undefined,
      invitee_ids: Array.from(selected),
    });
    setCreating(false);
    if (ok) { setDone(true); setTimeout(onCreated, 1200); }
  }

  if (done) {
    return (
      <>
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose} />
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 51, borderRadius: "24px 24px 0 0", background: "white", padding: "32px 24px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg,${PINK},#FF69B4)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 20px ${PINK}44` }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: DARK }}>Plan created!</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#aaa" }}>Invitations sent to {selected.size} Bloomie{selected.size !== 1 ? "s" : ""}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 51, borderRadius: "24px 24px 0 0", background: "white", maxHeight: "90dvh", display: "flex", flexDirection: "column", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>

        {/* Handle + header */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 4, flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div style={{ padding: "8px 20px 14px", borderBottom: "1px solid #F5F5F5", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            {step !== "type" && (
              <button onClick={() => setStep(step === "invite" ? "details" : "type")} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0 4px 0", display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#aaa", fontWeight: 700 }}>Back</span>
              </button>
            )}
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>
              {step === "type" ? "✦ NEW PLAN" : step === "details" ? "✦ DETAILS" : "✦ INVITE GIRLS"}
            </p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#aaa", marginTop: 2 }}>
              {step === "type" ? "What kind of plan?" : step === "details" ? "Tell them what's happening" : "Who do you want to invite?"}
            </p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
          </button>
        </div>

        {/* Step: type */}
        {step === "type" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {PLAN_TYPES.map(pt => {
              const active = planType === pt.type;
              return (
                <button key={pt.type} onClick={() => { setPlanType(pt.type); setStep("details"); }} style={{
                  padding: "18px 0", borderRadius: 18, border: active ? `2px solid ${PINK}` : "2px solid transparent",
                  background: active ? `${PINK}0D` : "#FFF8FA", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 28 }}>{pt.emoji}</span>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: active ? PINK : "#888" }}>{pt.label}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Step: details */}
        {step === "details" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#ccc", marginBottom: 7 }}>PLAN NAME</p>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={`${PLAN_TYPE_EMOJIS[planType]} ${PLAN_TYPE_LABELS[planType]} with the girls…`}
                autoFocus
                style={{ width: "100%", padding: "11px 14px", borderRadius: 14, background: "#FFF5F8", border: "1.5px solid #FFE0EE", fontFamily: "var(--font-jost)", fontSize: 14, color: DARK, outline: "none" }}
              />
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#ccc", marginBottom: 7 }}>DETAILS (optional)</p>
              <textarea
                value={description}
                onChange={e => setDesc(e.target.value)}
                placeholder="What's the vibe? Any notes for the group…"
                rows={2}
                style={{ width: "100%", padding: "11px 14px", borderRadius: 14, background: "#FFF5F8", border: "1.5px solid #FFE0EE", fontFamily: "var(--font-caveat)", fontSize: 15, color: DARK, outline: "none", resize: "none" }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#ccc", marginBottom: 7 }}>DATE & TIME</p>
                <input
                  type="datetime-local"
                  value={dateStr}
                  onChange={e => setDateStr(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 14, background: "#FFF5F8", border: "1.5px solid #FFE0EE", fontFamily: "var(--font-jost)", fontSize: 12, color: DARK, outline: "none" }}
                />
              </div>
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#ccc", marginBottom: 7 }}>VENUE (optional)</p>
              <input
                value={venue}
                onChange={e => setVenue(e.target.value)}
                placeholder="Restaurant, address, or TBD…"
                style={{ width: "100%", padding: "11px 14px", borderRadius: 14, background: "#FFF5F8", border: "1.5px solid #FFE0EE", fontFamily: "var(--font-jost)", fontSize: 13, color: DARK, outline: "none" }}
              />
            </div>
            <button onClick={() => setStep("invite")} disabled={!title.trim() && !planType} style={{
              width: "100%", padding: "13px 0", borderRadius: 999, border: "none", cursor: "pointer",
              background: `linear-gradient(135deg,${PINK},#FF69B4)`, color: "white",
              fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800,
              boxShadow: `0 4px 16px ${PINK}44`,
            }}>
              Invite Girls →
            </button>
          </div>
        )}

        {/* Step: invite */}
        {step === "invite" && (
          <>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {friends.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "#ccc" }}>Loading your Bloomies…</p>
                </div>
              )}
              {friends.map(f => {
                const on = selected.has(f.id);
                return (
                  <button key={f.id} onClick={() => toggleFriend(f.id)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 20px", background: on ? "#FFF5F8" : "white",
                    border: "none", cursor: "pointer", borderBottom: "1px solid #F8F8F8",
                  }}>
                    <Avatar src={f.avatar_url} name={f.display_name} userId={f.id} size={38} />
                    <p style={{ flex: 1, fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 600, color: DARK, textAlign: "left" }}>
                      {f.display_name ?? "Unknown"}
                    </p>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                      background: on ? PINK : "transparent",
                      border: on ? "none" : "2px solid #E5E5E5",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ padding: "12px 20px", paddingBottom: "calc(12px + env(safe-area-inset-bottom,0px))", borderTop: "1px solid #F5F5F5", flexShrink: 0 }}>
              <button onClick={handleCreate} disabled={creating} style={{
                width: "100%", padding: "13px 0", borderRadius: 999, border: "none", cursor: "pointer",
                background: `linear-gradient(135deg,${PINK},#FF69B4)`, color: "white",
                fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800,
                opacity: creating ? 0.7 : 1,
              }}>
                {creating ? "Creating…" : selected.size > 0 ? `Create Plan & Invite ${selected.size} →` : "Create Plan (just me for now) →"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ── Main BloomiesPlanner export ───────────────────────────────────────────────

export function BloomiesPlanner({ userId }: { userId: string }) {
  const [plans, setPlans] = useState<BloomiesPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [openPlan, setOpenPlan] = useState<BloomiesPlan | null>(null);

  async function loadPlans() {
    setLoading(true);
    const data = await (await import("@/lib/actions/bloomies-planner")).getMyBloomiesPlans();
    setPlans(data);
    setLoading(false);
  }

  useEffect(() => { void loadPlans(); }, []);

  async function handleRSVP(planId: string, status: RSVPStatus) {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, my_rsvp: status } : p));
    await (await import("@/lib/actions/bloomies-planner")).updateRSVP(planId, status);
  }

  if (openPlan) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 60, background: PAPER }}>
        <PlanChatView plan={openPlan} userId={userId} onBack={() => setOpenPlan(null)} />
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 8 }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", marginBottom: 14 }}>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.28em", color: "rgba(0,0,0,0.28)" }}>BLOOMIES PLANNER™</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, fontWeight: 900, color: DARK, lineHeight: 1.1, marginTop: 1 }}>Your Plans</p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999,
          background: `linear-gradient(135deg,${PINK},#FF69B4)`, border: "none", cursor: "pointer",
          boxShadow: `0 3px 12px ${PINK}44`,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white" }}>NEW PLAN</span>
        </button>
      </div>

      {/* Plans list */}
      <div style={{ padding: "0 16px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2.5px solid ${PINK}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {!loading && plans.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 20px", background: "white", borderRadius: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: 36, marginBottom: 10 }}>🌸</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 18, color: DARK, marginBottom: 6 }}>No plans yet</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#aaa", lineHeight: 1.4, marginBottom: 16 }}>Create a plan — dinner, birthday, hangout — and invite your Bloomies</p>
            <button onClick={() => setShowCreate(true)} style={{
              padding: "10px 24px", borderRadius: 999,
              background: `linear-gradient(135deg,${PINK},#FF69B4)`, border: "none", cursor: "pointer",
              fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, color: "white",
              boxShadow: `0 3px 12px ${PINK}44`,
            }}>
              Create a Plan →
            </button>
          </div>
        )}

        {plans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onOpen={() => setOpenPlan(plan)}
            onRSVP={s => handleRSVP(plan.id, s)}
          />
        ))}
      </div>

      {showCreate && (
        <CreatePlanSheet
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); void loadPlans(); }}
        />
      )}
    </div>
  );
}
