"use client";

import { useState, useRef, useEffect } from "react";

type ConvoType = "plan" | "club" | "direct" | "group" | "event";
type View = "list" | "thread";

interface Convo {
  id: number;
  type: ConvoType;
  name: string;
  initial: string;
  color: string;
  bgGradient?: string;
  preview: string;
  time: string;
  unread: number;
  subtitle?: string;
  online?: boolean;
  bio?: string;
  memberCount?: number;
}

interface Message {
  id: number;
  sender: string;
  initial: string;
  color: string;
  text: string;
  time: string;
  isMe?: boolean;
}

const PINK  = "#FF1F7D";
const CREAM = "#FAF6F2";
const PAPER = "#FEFCF9";

const CONVOS: Convo[] = [
  { id: 1, type: "plan",   name: "Morocco October",  initial: "M",  color: "#FF1F7D", preview: "Aaliyah: Who's booking flights?",         time: "2m",  unread: 3, subtitle: "Plan Room · 6 women" },
  { id: 2, type: "direct", name: "Sophia",            initial: "S",  color: "#E85C8A", bgGradient: "linear-gradient(135deg,#FFDDE9,#FFE8D0)", preview: "Are you going to the rooftop?",     time: "18m", unread: 1, subtitle: "Direct · Bloomie", online: true,  bio: "NYC girl. Museums, late dinners & strong coffee ✨" },
  { id: 3, type: "group",  name: "Travel Girls",      initial: "TG", color: "#FF69B4", preview: "Jade: New date — Sept 12",                time: "1h",  unread: 2, subtitle: "Group · 8 women",     memberCount: 8  },
  { id: 4, type: "direct", name: "Maya",               initial: "Ma", color: "#BF7AC5", bgGradient: "linear-gradient(135deg,#E8D6FF,#FFD6E8)", preview: "So ready for Saturday!",           time: "3h",  unread: 0, subtitle: "Direct · Bloomie", online: false, bio: "Art director. Always finding the best brunch spot 🎨" },
  { id: 5, type: "club",   name: "Tech Women NYC",    initial: "TW", color: "#FF1F7D", preview: "New post in #founders",                  time: "4h",  unread: 0, subtitle: "Club · 112 members"  },
  { id: 6, type: "group",  name: "Book Girls",        initial: "BG", color: "#A855F7", preview: "Priya: Great conversation last night 🌙", time: "1d",  unread: 0, subtitle: "Group · 5 women",     memberCount: 5  },
];

const THREAD_MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, sender: "Aaliyah M.", initial: "A", color: "#FF1F7D", text: "Who's booking flights? We should probably coordinate", time: "9:12 AM" },
    { id: 2, sender: "Jade K.",    initial: "J", color: "#FF69B4", text: "Better prices on group deals tbh", time: "9:14 AM" },
    { id: 3, sender: "Me", initial: "Y", color: "#FF1F7D", text: "Yes! Let's pick a weekend. Thinking first week of Oct", time: "9:17 AM", isMe: true },
    { id: 4, sender: "Aaliyah M.", initial: "A", color: "#FF1F7D", text: "Oct 3rd works for me. Flying from JFK", time: "9:18 AM" },
    { id: 5, sender: "Me", initial: "Y", color: "#FF1F7D", text: "Same ✈️ Should we do a quick call this week?", time: "9:20 AM", isMe: true },
  ],
  2: [
    { id: 1, sender: "Sophia", initial: "S", color: "#E85C8A", text: "Are you going to the rooftop thing tonight?", time: "7:42 PM" },
    { id: 2, sender: "Me",     initial: "Y", color: "#FF1F7D", text: "I was thinking about it! Are you?", time: "7:45 PM", isMe: true },
    { id: 3, sender: "Sophia", initial: "S", color: "#E85C8A", text: "100% going. Meet there at 9?", time: "7:46 PM" },
    { id: 4, sender: "Me",     initial: "Y", color: "#FF1F7D", text: "Perfect 🌙 See you there", time: "7:48 PM", isMe: true },
    { id: 5, sender: "Sophia", initial: "S", color: "#E85C8A", text: "Can't wait! It's going to be such a good night ✨", time: "7:49 PM" },
  ],
  3: [
    { id: 1, sender: "Jade K.",  initial: "J", color: "#FF69B4", text: "New date — Sept 12. Does that work for everyone?", time: "2:30 PM" },
    { id: 2, sender: "Temi A.",  initial: "T", color: "#FF1F7D", text: "Works for me!", time: "2:35 PM" },
    { id: 3, sender: "Sofia W.", initial: "S", color: "#A855F7", text: "I'm in 🙌", time: "2:38 PM" },
    { id: 4, sender: "Me",       initial: "Y", color: "#FF1F7D", text: "Sept 12 is perfect. Adding it now", time: "2:40 PM", isMe: true },
  ],
  4: [
    { id: 1, sender: "Maya", initial: "Ma", color: "#BF7AC5", text: "Confirmed ✓ So excited for Saturday", time: "10:00 AM" },
    { id: 2, sender: "Me",   initial: "Y",  color: "#FF1F7D", text: "Same!! Ladurée SoHo 🌸", time: "10:05 AM", isMe: true },
    { id: 3, sender: "Maya", initial: "Ma", color: "#BF7AC5", text: "So ready for Saturday!", time: "10:06 AM" },
  ],
  5: [
    { id: 1, sender: "Tech Women NYC", initial: "TW", color: "#FF1F7D", text: "New post in #founders — 'Pitching without apology'", time: "3h ago" },
    { id: 2, sender: "Naomi B.",       initial: "N",  color: "#FF69B4", text: "Bookmarking this", time: "2h ago" },
    { id: 3, sender: "Me",             initial: "Y",  color: "#FF1F7D", text: "Exactly what I needed today 🙏", time: "1h ago", isMe: true },
  ],
  6: [
    { id: 1, sender: "Priya R.", initial: "P", color: "#A855F7", text: "Great conversation last night 🌙", time: "Yesterday" },
    { id: 2, sender: "Me",       initial: "Y", color: "#FF1F7D", text: "Such a good one. Sequel 📚", time: "Yesterday", isMe: true },
  ],
};

type Filter = "all" | ConvoType;
const FILTERS: { label: string; value: Filter }[] = [
  { label: "All",    value: "all"    },
  { label: "DMs",    value: "direct" },
  { label: "Groups", value: "group"  },
  { label: "Clubs",  value: "club"   },
];

type ChatMode = "choose" | "dm" | "group";
const SUGGESTIONS = [
  { name: "Aaliyah M.", initial: "A",  color: "#FF1F7D" },
  { name: "Maya S.",    initial: "Ma", color: "#FF69B4" },
  { name: "Jade K.",    initial: "J",  color: "#FF1F7D" },
  { name: "Sofia W.",   initial: "S",  color: "#FF69B4" },
  { name: "Naomi B.",   initial: "N",  color: "#FF1F7D" },
  { name: "Temi A.",    initial: "T",  color: "#FF69B4" },
];

// ── New Chat Sheet ─────────────────────────────────────────────────────────────
function NewChatSheet({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<ChatMode>("choose");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dmPick, setDmPick] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");

  function toggleGroup(name: string) {
    setSelected(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  }

  const Backdrop = () => (
    <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
  );
  const Handle = () => (
    <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
      <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.1)" }} />
    </div>
  );
  const SheetHeader = ({ title, onBack }: { title: string; onBack?: () => void }) => (
    <div className="px-6 pt-2 pb-4 flex items-center gap-3 flex-shrink-0" style={{ borderBottom: "1px solid #F0EBE4" }}>
      {onBack && (
        <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.05)", border: "none" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      )}
      <p className="text-[10px] font-bold tracking-[0.22em] uppercase flex-1" style={{ color: PINK }}>{title}</p>
      <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.05)", border: "none" }}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
      </button>
    </div>
  );

  if (mode === "choose") return (
    <>
      <Backdrop />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl" style={{ background: PAPER, boxShadow: "0 -8px 40px rgba(0,0,0,0.14)", paddingBottom: "env(safe-area-inset-bottom,24px)" }}>
        <Handle /><SheetHeader title="✦ NEW CONVERSATION" />
        <div className="px-6 pt-5 pb-8 flex flex-col gap-3">
          {[
            { label: "Send a message", sub: "One-on-one with someone", grad: "linear-gradient(135deg,#FF1F7D,#FF69B4)", shadow: "rgba(255,31,125,0.3)", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, action: () => setMode("dm") },
            { label: "Group message",  sub: "Chat with multiple women", grad: "linear-gradient(135deg,#FF69B4,#C084FC)", shadow: "rgba(255,105,180,0.3)", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>, action: () => setMode("group") },
          ].map(({ label, sub, grad, shadow, icon, action }) => (
            <button key={label} onClick={action} className="w-full flex items-center gap-4 p-4 rounded-2xl text-left" style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: grad, boxShadow: `0 3px 10px ${shadow}` }}>{icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: "#1A1A1A" }}>{label}</p>
                <p className="text-xs mt-0.5" style={{ color: "#AAA" }}>{sub}</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  if (mode === "dm") return (
    <>
      <Backdrop />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl" style={{ background: PAPER, boxShadow: "0 -8px 40px rgba(0,0,0,0.14)", maxHeight: "75vh", display: "flex", flexDirection: "column" }}>
        <Handle /><SheetHeader title="SEND A MESSAGE" onBack={() => { setMode("choose"); setDmPick(null); }} />
        <div className="flex-1 overflow-y-auto px-6 py-3">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#BBB" }}>Choose someone</p>
          {SUGGESTIONS.map(s => {
            const active = dmPick === s.name;
            return (
              <button key={s.name} onClick={() => setDmPick(s.name)} className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl mb-1" style={{ background: active ? "#FFF0F5" : "transparent", border: active ? "1.5px solid #FFD6E8" : "1.5px solid transparent" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0" style={{ background: `linear-gradient(135deg,${s.color},${s.color}BB)` }}>{s.initial}</div>
                <p className="flex-1 text-sm font-semibold text-left" style={{ color: "#1A1A1A" }}>{s.name}</p>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: active ? PINK : "#DDD", background: active ? PINK : "transparent" }}>
                  {active && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><polyline points="2 6 5 9 10 3"/></svg>}
                </div>
              </button>
            );
          })}
        </div>
        <div className="px-6 pb-8 pt-3 flex-shrink-0" style={{ borderTop: "1px solid #F0EBE4" }}>
          <button onClick={() => { if (dmPick) onClose(); }} disabled={!dmPick} className="w-full py-4 rounded-full text-sm font-bold" style={dmPick ? { background: PINK, color: "white", boxShadow: "0 4px 16px rgba(255,31,125,0.3)" } : { background: "#F5E8EE", color: "#C8A0B0" }}>
            {dmPick ? `Message ${dmPick.split(" ")[0]} →` : "Choose someone first"}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Backdrop />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl" style={{ background: PAPER, boxShadow: "0 -8px 40px rgba(0,0,0,0.14)", maxHeight: "82vh", display: "flex", flexDirection: "column" }}>
        <Handle /><SheetHeader title="GROUP MESSAGE" onBack={() => { setMode("choose"); setSelected(new Set()); setGroupName(""); }} />
        <div className="px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #F0EBE4" }}>
          <input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Group name (e.g. Morocco Girls)" autoFocus className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: "#FFF5F8", border: "1.5px solid #FFE0EE", color: "#1A1A1A" }} />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-3">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#BBB" }}>Add women · {selected.size} selected</p>
          {SUGGESTIONS.map(s => (
            <button key={s.name} onClick={() => toggleGroup(s.name)} className="w-full flex items-center gap-3 py-2.5 mb-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0" style={{ background: `linear-gradient(135deg,${s.color},${s.color}BB)` }}>{s.initial}</div>
              <p className="flex-1 text-sm font-semibold text-left" style={{ color: "#1A1A1A" }}>{s.name}</p>
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: selected.has(s.name) ? PINK : "#DDD", background: selected.has(s.name) ? PINK : "transparent" }}>
                {selected.has(s.name) && <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><polyline points="2 6 5 9 10 3"/></svg>}
              </div>
            </button>
          ))}
        </div>
        <div className="px-6 pb-8 pt-3 flex-shrink-0" style={{ borderTop: "1px solid #F0EBE4" }}>
          <button onClick={() => { if (selected.size >= 2 && groupName.trim()) onClose(); }} disabled={selected.size < 2 || !groupName.trim()} className="w-full py-4 rounded-full text-sm font-bold" style={selected.size >= 2 && groupName.trim() ? { background: `linear-gradient(135deg,${PINK},#FF69B4)`, color: "white", boxShadow: "0 4px 16px rgba(255,31,125,0.3)" } : { background: "#F5E8EE", color: "#C8A0B0" }}>
            {selected.size >= 2 && groupName.trim() ? `Create group · ${selected.size} women →` : selected.size < 2 ? "Add at least 2 women" : "Add a group name"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Conversation Row ───────────────────────────────────────────────────────────
function ConvoRow({ convo, isUnread, isLast, onClick }: { convo: Convo; isUnread: boolean; isLast: boolean; onClick: () => void }) {
  const isDM = convo.type === "direct";
  return (
    <button onClick={onClick} style={{ width: "100%", display: "flex", alignItems: "center", textAlign: "left", cursor: "pointer", background: isUnread ? "#FFFCF9" : "white", borderBottom: isLast ? "none" : "1px solid #F5EFE9", gap: 14, padding: "14px 16px", WebkitTapHighlightColor: "transparent" }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{ width: 50, height: 50, borderRadius: isDM ? "50%" : "16px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", background: convo.bgGradient ?? `linear-gradient(135deg,${convo.color},${convo.color}BB)`, fontSize: convo.initial.length > 1 ? "12px" : "18px", boxShadow: isUnread ? `0 0 0 2.5px ${convo.color},0 0 0 5px ${CREAM}` : "0 2px 8px rgba(0,0,0,0.1)" }}>
          {convo.initial}
        </div>
        {isDM && convo.online && (
          <div style={{ position: "absolute", bottom: 2, right: 2, width: 12, height: 12, borderRadius: "50%", background: "#22C55E", border: "2px solid white" }}/>
        )}
        {isUnread && convo.unread > 0 && (
          <div style={{ position: "absolute", top: -3, right: -3, minWidth: 18, height: 18, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", background: PINK, boxShadow: "0 1px 4px rgba(255,31,125,0.55)" }}>
            <span style={{ fontSize: "9px", fontWeight: 900, color: "white", padding: "0 3px" }}>{convo.unread}</span>
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <p style={{ flex: 1, minWidth: 0, fontSize: "14px", fontWeight: isUnread ? 700 : 500, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.2 }}>{convo.name}</p>
          <span style={{ fontSize: "10px", flexShrink: 0, color: "#C0B5AD" }}>{convo.time}</span>
        </div>
        <p style={{ fontSize: "12px", color: isUnread ? "#555" : "#B8AFA8", fontWeight: isUnread ? 500 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.4 }}>{convo.preview}</p>
        {convo.subtitle && <p style={{ fontSize: "10px", color: "#C8BFB6", marginTop: 2 }}>{convo.subtitle}</p>}
      </div>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(180,150,140,0.35)" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  );
}

// ── Composer Bar ───────────────────────────────────────────────────────────────
function ComposerBar({ draft, setDraft, onSend }: { draft: string; setDraft: (v: string) => void; onSend: () => void }) {
  return (
    <div style={{ background: "white", borderTop: "1px solid #F0EBE4", paddingBottom: "max(12px,env(safe-area-inset-bottom))" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", padding: "10px 20px 4px" }}>
        {[{ icon: "📅", label: "Plan" }, { icon: "🖼️", label: "Photos" }, { icon: "🎤", label: "Voice" }, { icon: "📍", label: "Location" }, { icon: "📝", label: "Note" }].map(({ icon, label }) => (
          <button key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 6px", background: "transparent", border: "none", cursor: "pointer" }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontSize: "8px", fontWeight: 700, color: "#AAA", letterSpacing: "0.05em" }}>{label}</span>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 14px 8px" }}>
        <div style={{ flex: 1, borderRadius: 24, background: "#F5F0EE", border: "1.5px solid #EDE7E0", overflow: "hidden" }}>
          <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }} placeholder="Message…" style={{ width: "100%", padding: "10px 16px", fontSize: "14px", color: "#1A1A1A", background: "transparent", outline: "none", border: "none" }} />
        </div>
        <button onClick={onSend} style={{ width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: draft.trim() ? PINK : "#EDE7E0", boxShadow: draft.trim() ? "0 2px 10px rgba(255,31,125,0.35)" : "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={draft.trim() ? "white" : "#BBB"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Message Bubble ─────────────────────────────────────────────────────────────
function Bubble({ msg, showName }: { msg: Message; showName?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 10, flexDirection: msg.isMe ? "row-reverse" : "row", alignItems: "flex-end" }}>
      {!msg.isMe && (
        <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: "10px", background: `linear-gradient(135deg,${msg.color},${msg.color}BB)`, flexShrink: 0 }}>{msg.initial}</div>
      )}
      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: 3, alignItems: msg.isMe ? "flex-end" : "flex-start" }}>
        {showName && !msg.isMe && <span style={{ fontSize: "10px", color: "#B8AFA8", fontWeight: 600, padding: "0 2px" }}>{msg.sender}</span>}
        <div style={{ padding: "10px 14px", borderRadius: msg.isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", fontSize: "13px", lineHeight: 1.5, ...(msg.isMe ? { background: PINK, color: "white", boxShadow: "0 2px 12px rgba(255,31,125,0.28)" } : { background: "white", color: "#2A2A2A", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #F0EBE4" }) }}>
          {msg.text}
        </div>
        <span style={{ fontSize: "9px", color: "#C8BFB6", padding: "0 2px" }}>{msg.time}</span>
      </div>
    </div>
  );
}

// ── Direct DM Profile Thread ───────────────────────────────────────────────────
function DirectProfileThread({ convo, messages, onBack }: { convo: Convo; messages: Message[]; onBack: () => void }) {
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<Message[]>(messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMsgs(prev => [...prev, { id: prev.length + 100, sender: "Me", initial: "Y", color: PINK, text, time: "now", isMe: true }]);
    setDraft("");
  }

  const waveHeights = [10, 18, 8, 26, 14, 10, 30, 12, 22, 8, 20, 16, 10, 28, 14, 8, 18, 12, 24, 14];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: CREAM }}>
      {/* Sticky top bar */}
      <div style={{ padding: "56px 18px 12px", background: "white", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #F0EBE4", boxShadow: "0 1px 10px rgba(0,0,0,0.04)", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5EFE9", border: "none", cursor: "pointer", flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: "15px", background: convo.bgGradient ?? `linear-gradient(135deg,${convo.color},${convo.color}BB)`, flexShrink: 0 }}>{convo.initial}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontStyle: "italic", fontSize: "17px", color: "#1A1A1A", lineHeight: 1.1 }}>{convo.name}</p>
          {convo.online !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: convo.online ? "#22C55E" : "#CBD5E1" }}/>
              <span style={{ fontSize: "10px", color: convo.online ? "#22C55E" : "#BBB" }}>{convo.online ? "online" : "offline"}</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            <svg key="call" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 12c1.68 2.83 3.58 4.73 6.41 6.41l.46-.81a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
            <svg key="video" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
          ].map((icon, i) => (
            <button key={i} style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF0F5", border: "none", cursor: "pointer" }}>{icon}</button>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 148 }}>
        {/* Profile hero */}
        <div style={{ padding: "28px 20px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", background: "white", borderBottom: "1px solid #F5EFE9" }}>
          <div style={{ position: "relative", marginBottom: 14 }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", background: convo.bgGradient ?? `linear-gradient(135deg,${convo.color}40,${convo.color}80)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 4px ${convo.color}20,0 0 0 8px ${convo.color}08,0 8px 32px rgba(0,0,0,0.12)` }}>
              <span style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontStyle: "italic", fontSize: "34px", color: convo.color }}>{convo.initial}</span>
            </div>
            {convo.online !== undefined && (
              <div style={{ position: "absolute", bottom: 5, right: 5, width: 16, height: 16, borderRadius: "50%", background: convo.online ? "#22C55E" : "#CBD5E1", border: "2.5px solid white", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}/>
            )}
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "26px", fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", marginBottom: 3 }}>{convo.name}</h2>
          {convo.online !== undefined && (
            <p style={{ fontSize: "11px", color: convo.online ? "#22C55E" : "#AAA", marginBottom: 8 }}>{convo.online ? "● Active now" : "○ Last seen recently"}</p>
          )}
          {convo.bio && (
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: "13px", fontStyle: "italic", color: "#888", maxWidth: 240, lineHeight: 1.6, marginBottom: 18 }}>{convo.bio}</p>
          )}
          {/* Action icons */}
          <div style={{ display: "flex", gap: 22 }}>
            {[
              { svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 12c1.68 2.83 3.58 4.73 6.41 6.41l.46-.81a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>, label: "Call" },
              { svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>, label: "Video" },
              { svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: "Location" },
              { svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>, label: "More" },
            ].map(({ svg, label }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 50, height: 50, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF0F5", color: PINK, border: "none", cursor: "pointer" }}>{svg}</div>
                <span style={{ fontSize: "9px", fontWeight: 700, color: "#AAA", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Together */}
        <div style={{ margin: "16px 16px 0", background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #F5EFE9" }}>
          <div style={{ padding: "11px 16px", borderBottom: "1px solid #F5EFE9", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12 }}>✦</span>
            <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: PINK }}>Upcoming Together</p>
          </div>
          <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#FFE0EE,#FFC8DE)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🥂</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontStyle: "italic", fontSize: "15px", color: "#1A1A1A", marginBottom: 2 }}>Girls Dinner</p>
              <p style={{ fontSize: "11px", color: "#AAA" }}>Fri, Sept 13 · Loring Place</p>
            </div>
            <button style={{ padding: "8px 14px", borderRadius: 20, background: PINK, color: "white", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", border: "none", cursor: "pointer" }}>VIEW</button>
          </div>
        </div>

        {/* Shared Interests */}
        <div style={{ margin: "10px 16px 0", background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #F5EFE9" }}>
          <div style={{ padding: "11px 16px", borderBottom: "1px solid #F5EFE9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12 }}>♡</span>
              <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: PINK }}>Shared Interests</p>
            </div>
            <button style={{ fontSize: "10px", fontWeight: 700, color: "#AAA", background: "none", border: "none", cursor: "pointer" }}>+ Add more</button>
          </div>
          <div style={{ padding: "12px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["📚 Book Girls Club", "🏛️ Museum Lovers"].map(c => (
              <span key={c} style={{ padding: "6px 12px", borderRadius: 20, background: "#FFF0F5", color: PINK, fontSize: "11px", fontWeight: 600 }}>{c}</span>
            ))}
          </div>
        </div>

        {/* Message thread */}
        <div style={{ margin: "22px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px", marginBottom: 14 }}>
            <div style={{ flex: 1, height: 1, background: "#EDE7E0" }}/>
            <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.18em", color: "#C0B5AD", textTransform: "uppercase" }}>Today</p>
            <div style={{ flex: 1, height: 1, background: "#EDE7E0" }}/>
          </div>
          <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {msgs.map(msg => <Bubble key={msg.id} msg={msg} />)}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Memories */}
        <div style={{ margin: "26px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", marginBottom: 10 }}>
            <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C0B5AD" }}>✦ Memories</p>
            <button style={{ fontSize: "10px", color: PINK, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>See all</button>
          </div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 16px 4px", scrollbarWidth: "none" }}>
            {[{ bg: "linear-gradient(135deg,#FFE0EE,#FFD0E8)", e: "🌊" }, { bg: "linear-gradient(135deg,#E0F0FF,#D0E8FF)", e: "🌅" }, { bg: "linear-gradient(135deg,#E0FFE8,#D0F0D8)", e: "🌿" }, { bg: "linear-gradient(135deg,#FFF0D0,#FFE8C0)", e: "🥂" }, { bg: "linear-gradient(135deg,#F0E0FF,#E8D0FF)", e: "🎨" }].map((m, i) => (
              <div key={i} style={{ width: 80, height: 80, borderRadius: 16, flexShrink: 0, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>{m.e}</div>
            ))}
          </div>
        </div>

        {/* Voice Notes */}
        <div style={{ margin: "16px 16px 0", background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #F5EFE9" }}>
          <div style={{ padding: "11px 16px", borderBottom: "1px solid #F5EFE9", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12 }}>🎵</span>
            <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: PINK }}>Voice Notes</p>
          </div>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: PINK, border: "none", cursor: "pointer", flexShrink: 0, boxShadow: "0 2px 10px rgba(255,31,125,0.3)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </button>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 2, height: 38 }}>
                {waveHeights.map((h, i) => (
                  <div key={i} style={{ flex: 1, background: i < 9 ? PINK : "#E8E0DA", borderRadius: 3, height: h }}/>
                ))}
              </div>
              <span style={{ fontSize: "11px", color: "#AAA", flexShrink: 0 }}>0:24</span>
            </div>
            <p style={{ fontSize: "11px", color: "#CCC", marginTop: 8, fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>Saved from last Tuesday ✨</p>
          </div>
        </div>
        <div style={{ height: 24 }}/>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
        <ComposerBar draft={draft} setDraft={setDraft} onSend={sendMessage} />
      </div>
    </div>
  );
}

// ── Group Thread View ──────────────────────────────────────────────────────────
function GroupThreadView({ convo, messages, onBack }: { convo: Convo; messages: Message[]; onBack: () => void }) {
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<Message[]>(messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMsgs(prev => [...prev, { id: prev.length + 100, sender: "Me", initial: "Y", color: PINK, text, time: "now", isMe: true }]);
    setDraft("");
  }

  const members = [
    { initial: "J", color: "#FF69B4" }, { initial: "T", color: "#FF1F7D" },
    { initial: "S", color: "#A855F7" }, { initial: "N", color: "#FF69B4" }, { initial: "L", color: "#FF1F7D" },
  ];
  const count = convo.memberCount ?? 5;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: CREAM }}>
      {/* Top bar */}
      <div style={{ padding: "56px 18px 12px", background: "white", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #F0EBE4", boxShadow: "0 1px 10px rgba(0,0,0,0.04)", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5EFE9", border: "none", cursor: "pointer", flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ display: "flex", flexShrink: 0 }}>
          {members.slice(0, 3).map((m, i) => (
            <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: "11px", background: `linear-gradient(135deg,${m.color},${m.color}BB)`, border: "2px solid white", marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i }}>{m.initial}</div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontStyle: "italic", fontSize: "17px", color: "#1A1A1A", lineHeight: 1.1 }}>{convo.name}</p>
          <p style={{ fontSize: "10px", color: "#B8AFA8" }}>{count} women · Group</p>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF0F5", border: "none", cursor: "pointer" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 148 }}>
        {/* Group info */}
        <div style={{ margin: "16px 16px 0", background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #F5EFE9" }}>
          <div style={{ padding: "16px", background: "linear-gradient(135deg,#FFF0F5,#FFE8F0)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: `linear-gradient(135deg,${convo.color},${convo.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: "14px" }}>{convo.initial}</div>
              <div>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: "18px", fontWeight: 900, fontStyle: "italic", color: "#1A1A1A" }}>{convo.name}</p>
                <p style={{ fontSize: "11px", color: "#AAA" }}>{count} women · Created by you</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {members.map((m, i) => (
                <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: "11px", background: `linear-gradient(135deg,${m.color},${m.color}BB)`, border: "2px solid white", boxShadow: "0 1px 6px rgba(0,0,0,0.1)" }}>{m.initial}</div>
              ))}
              {count > 5 && (
                <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, background: "#F5EFE9", color: "#AAA", border: "2px solid white" }}>+{count - 5}</div>
              )}
            </div>
          </div>
          <div style={{ padding: "10px 14px", display: "flex", gap: 8 }}>
            <button style={{ flex: 1, padding: "10px", borderRadius: 14, background: "#FFF0F5", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: PINK }}>📅 Plan Together</button>
            <button style={{ flex: 1, padding: "10px", borderRadius: 14, background: "#F5F0FF", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: "#8B5CF6" }}>➕ Add Women</button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ margin: "22px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px", marginBottom: 14 }}>
            <div style={{ flex: 1, height: 1, background: "#EDE7E0" }}/>
            <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.18em", color: "#C0B5AD", textTransform: "uppercase" }}>Today</p>
            <div style={{ flex: 1, height: 1, background: "#EDE7E0" }}/>
          </div>
          <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {msgs.map(msg => <Bubble key={msg.id} msg={msg} showName />)}
            <div ref={bottomRef} />
          </div>
        </div>
        <div style={{ height: 24 }}/>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
        <ComposerBar draft={draft} setDraft={setDraft} onSend={sendMessage} />
      </div>
    </div>
  );
}

// ── Generic Thread (plans, clubs, events) ─────────────────────────────────────
function GenericThreadView({ convo, messages, onBack }: { convo: Convo; messages: Message[]; onBack: () => void }) {
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<Message[]>(messages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const TYPE_COLOR: Record<ConvoType, string> = { plan: "#FF1F7D", club: "#7C3AED", direct: "#16A34A", group: "#EA580C", event: "#0284C7" };
  const accent = TYPE_COLOR[convo.type];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMsgs(prev => [...prev, { id: prev.length + 100, sender: "Me", initial: "Y", color: PINK, text, time: "now", isMe: true }]);
    setDraft("");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: CREAM }}>
      <div style={{ padding: "56px 18px 12px", background: PAPER, display: "flex", alignItems: "center", gap: 14, borderBottom: `2px solid ${accent}22`, boxShadow: "0 1px 14px rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.05)", border: "none", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: "14px", background: `linear-gradient(135deg,${convo.color},${convo.color}BB)`, flexShrink: 0 }}>{convo.initial}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: "14px", color: "#1A1A1A", lineHeight: 1.2 }}>{convo.name}</p>
          {convo.subtitle && <p style={{ fontSize: "10px", color: "#B8AFA8" }}>{convo.subtitle}</p>}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 100 }}>
        {msgs.map(msg => <Bubble key={msg.id} msg={msg} showName />)}
        <div ref={bottomRef} />
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: PAPER, borderTop: "1px solid #F0EBE4", boxShadow: "0 -4px 20px rgba(0,0,0,0.06)", padding: "10px 14px", paddingBottom: "max(12px,env(safe-area-inset-bottom))", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, borderRadius: 24, background: CREAM, border: "1.5px solid #E8E2DC", overflow: "hidden" }}>
          <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Send a message…" style={{ width: "100%", padding: "10px 16px", fontSize: "14px", color: "#1A1A1A", background: "transparent", outline: "none", border: "none" }} />
        </div>
        <button onClick={sendMessage} style={{ width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: draft.trim() ? PINK : "#EDE7E0", boxShadow: draft.trim() ? "0 2px 10px rgba(255,31,125,0.35)" : "none", border: "none", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={draft.trim() ? "white" : "#BBB"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Main Chat Page ─────────────────────────────────────────────────────────────
export default function ChatPage() {
  const [view, setView] = useState<View>("list");
  const [activeConvo, setActiveConvo] = useState<Convo | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [showNewChat, setShowNewChat] = useState(false);
  const [read, setRead] = useState<Set<number>>(new Set());

  function openConvo(convo: Convo) {
    setRead(prev => new Set([...prev, convo.id]));
    setActiveConvo(convo);
    setView("thread");
  }

  function backToList() { setView("list"); setActiveConvo(null); }

  if (view === "thread" && activeConvo) {
    if (activeConvo.type === "direct") return <DirectProfileThread convo={activeConvo} messages={THREAD_MESSAGES[activeConvo.id] ?? []} onBack={backToList} />;
    if (activeConvo.type === "group")  return <GroupThreadView     convo={activeConvo} messages={THREAD_MESSAGES[activeConvo.id] ?? []} onBack={backToList} />;
    return <GenericThreadView convo={activeConvo} messages={THREAD_MESSAGES[activeConvo.id] ?? []} onBack={backToList} />;
  }

  const shown = CONVOS.filter(c => c.type !== "plan" && (filter === "all" || c.type === filter));
  const totalUnread = CONVOS.filter(c => c.type !== "plan").reduce((sum, c) => sum + (read.has(c.id) ? 0 : c.unread), 0);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 112, background: CREAM }}>
      {/* Header */}
      <div style={{ padding: "70px 20px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 4 }}>✦ CHATS</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(38px,10vw,52px)", fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 0.9 }}>Chats.</h1>
              {totalUnread > 0 && (
                <span style={{ fontSize: "9px", fontWeight: 800, color: "white", background: PINK, borderRadius: 999, padding: "3px 10px", boxShadow: "0 2px 8px rgba(255,31,125,0.4)", marginBottom: 4 }}>{totalUnread} new</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              <div style={{ height: 1, width: 36, background: PINK, opacity: 0.35 }}/><div style={{ height: 1, width: 14, background: PINK, opacity: 0.18 }}/><div style={{ height: 1, width: 6, background: PINK, opacity: 0.1 }}/>
            </div>
          </div>
          <button onClick={() => setShowNewChat(true)} style={{ width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg,${PINK},#FF69B4)`, boxShadow: "0 3px 12px rgba(255,31,125,0.38)", border: "none", cursor: "pointer", marginTop: 28 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ padding: "0 20px 16px", display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none" }}>
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)} style={{ padding: "7px 16px", borderRadius: 999, flexShrink: 0, fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer", ...(filter === f.value ? { background: "#1A1A1A", color: "white", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" } : { background: "white", color: "#888", border: "1.5px solid #EBE5DF" }) }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Conversation list */}
      {shown.length > 0 ? (
        <div style={{ margin: "0 16px", borderRadius: 20, overflow: "hidden", background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", border: "1px solid #EDE7E0" }}>
          {shown.map((convo, idx) => (
            <ConvoRow key={convo.id} convo={convo} isUnread={convo.unread > 0 && !read.has(convo.id)} isLast={idx === shown.length - 1} onClick={() => openConvo(convo)} />
          ))}
        </div>
      ) : (
        <div style={{ margin: "0 16px", borderRadius: 20, padding: "56px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", border: "1px solid #EDE7E0" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", background: "#FFF0F5" }}>💬</div>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#AAA" }}>No conversations here yet</p>
          <p style={{ fontSize: "12px", textAlign: "center", color: "#CCC", maxWidth: 220, lineHeight: 1.5 }}>Tap + to start a conversation.</p>
        </div>
      )}

      {showNewChat && <NewChatSheet onClose={() => setShowNewChat(false)} />}
    </div>
  );
}
