"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  getMyConversations,
  getMessages,
  sendMessage as dbSendMessage,
  markConversationRead,
  startConversation,
  createNamedGroupConversation,
  listChatMembers,
  addMembersToConversation,
  sendChatMediaMessage,
} from "@/lib/actions/direct-messages";
import type { ConversationSummary, DirectMessage } from "@/lib/actions/direct-messages";

type ConvoType = "plan" | "club" | "direct" | "group" | "event";
type View = "list" | "thread";

interface Convo {
  id: string;
  type: ConvoType;
  name: string;
  initial: string;
  color: string;
  bgGradient?: string;
  preview: string;
  time: string;
  unread: number;
  subtitle?: string;
  memberCount?: number;
  dbConvoId: string;
}

interface Message {
  id: string;
  sender: string;
  initial: string;
  color: string;
  text: string;
  time: string;
  isMe?: boolean;
  isSticker?: boolean;
  mediaUrl?: string | null;
  mediaType?: "text" | "image" | "audio" | "gif";
}

interface ChatMember {
  id: string;
  name: string;
  avatar_url: string | null;
}

const WALLPAPERS = [
  { id: "none", label: "None", value: "#FFFFFF" },
  { id: "bloom", label: "Bloom", value: "radial-gradient(ellipse at 30% 20%, #FF69B4 0%, #FFDCEA 40%, #FFFFFF 100%)" },
  { id: "blush", label: "Blush", value: "radial-gradient(ellipse at 70% 30%, #FFB3D9 0%, #FFEAF4 50%, #FFFFFF 100%)" },
  { id: "petal", label: "Petal", value: "radial-gradient(ellipse at 50% 0%, #FF3A8C 0%, #FFB3D9 40%, #FFFFFF 100%)" },
  { id: "powder", label: "Powder", value: "radial-gradient(ellipse at 20% 80%, #E8B4FA 0%, #F5DAFF 50%, #FFFFFF 100%)" },
  { id: "rose", label: "Rose", value: "radial-gradient(ellipse at 80% 20%, #FF1F7D 0%, #FFB3D9 50%, #FFFFFF 100%)" },
  { id: "candy", label: "Candy", value: "radial-gradient(ellipse at 40% 60%, #FF69B4 0%, #FFDCEA 50%, #FFFFFF 100%)" },
];

const PINK = "#FF1F7D";
const CREAM = "#FFFFFF";
const LOUNGE_BG = "linear-gradient(160deg, #FF1F7D 0%, #FF3A8C 50%, #FF69B4 100%)";

type Filter = "all" | ConvoType;
const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "DMs", value: "direct" },
  { label: "Groups", value: "group" },
  { label: "Clubs", value: "club" },
];

type ChatMode = "choose" | "dm" | "group";

const STICKER_CATEGORIES = [
  {
    id: "girl_culture",
    label: "Girl ✦",
    stickers: [
      "✨ Main Character Energy", "🌸 Soft Life", "💅 Girl Math",
      "👑 Rich Aunt Energy", "🚀 Founder Mode", "🥂 Romanticizing My Life",
      "🔥 Hot Girl Shit", "💫 Delusional & Thriving", "📖 Book It",
      "✈️ Buy the Ticket", "🌍 Solo Trip", "💖 For the Girls",
    ],
  },
  {
    id: "lifestyle",
    label: "Life 🌿",
    stickers: ["🍵 Matcha", "🥐 Croissant", "👓 Sunglasses", "👜 Tote Bag", "💄 Lipstick", "🌸 Flowers", "📚 Books", "☕ Coffee"],
  },
  {
    id: "travel",
    label: "Travel ✈️",
    stickers: ["🗼 Paris", "🗽 NYC", "🌊 Lisbon", "🌴 Palm Springs", "🎭 Rome", "🌺 Bali", "🏖️ Tulum", "🌃 Tokyo"],
  },
  {
    id: "wellness",
    label: "Wellness 🧘",
    stickers: ["🧘 Pilates Princess", "🏃 Run Club", "🌿 Yoga Therapy", "🥗 Salad Bar", "🛁 Self Care", "🌙 Rest Day"],
  },
  {
    id: "status",
    label: "Status 🌟",
    stickers: ["✅ Bloom Approved", "🔒 Plan Locked", "🛂 Added to Passport", "🎫 Booked It", "🔥 Burning Lots", "💌 Sent Sweet"],
  },
  {
    id: "expressions",
    label: "Mood 😌",
    stickers: ["🫶 IDYKIK", "✔️ okay", "💫 slay the day", "⚡ do it anyway", "🍽️ eat", "🎯 focus"],
  },
];

function mapDbMessage(m: DirectMessage, myId: string | null): Message {
  const name = m.sender?.full_name ?? m.sender?.first_name ?? "Someone";
  const mediaType = m.media_type ?? "text";
  return {
    id: m.id,
    sender: name,
    initial: name.charAt(0).toUpperCase(),
    color: PINK,
    text: m.content,
    time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    isMe: !!myId && m.sender_id === myId,
    isSticker: false,
    mediaUrl: m.media_url ?? null,
    mediaType,
  };
}

function dbConvoToUI(c: ConversationSummary): Convo {
  const other = c.participants[0];
  const name =
    c.name?.trim() ||
    other?.full_name ||
    other?.first_name ||
    "Conversation";
  const timeAgo = (() => {
    if (!c.last_message_at) return "";
    const diff = Date.now() - new Date(c.last_message_at).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    if (m < 60) return `${Math.max(0, m)}m`;
    if (h < 24) return `${h}h`;
    return `${Math.floor(diff / 86400000)}d`;
  })();
  const typeLabel = c.type.charAt(0).toUpperCase() + c.type.slice(1);
  return {
    id: c.id,
    type: c.type,
    name,
    initial: name.slice(0, c.type === "group" || c.type === "club" ? 2 : 1).toUpperCase(),
    color: PINK,
    preview: c.last_preview ?? "Start a conversation",
    time: timeAgo,
    unread: c.unread_count,
    subtitle: `${typeLabel}${c.participants.length ? ` · ${c.participants.length + 1}` : ""}`,
    memberCount: c.participants.length + 1,
    dbConvoId: c.id,
  };
}

// ── New Chat Sheet ─────────────────────────────────────────────────────────────
function NewChatSheet({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (convoId: string) => void;
}) {
  const [mode, setMode] = useState<ChatMode>("choose");
  const [members, setMembers] = useState<ChatMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dmPick, setDmPick] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "dm" && mode !== "group") return;
    setLoadingMembers(true);
    listChatMembers()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoadingMembers(false));
  }, [mode]);

  function toggleGroup(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function createDm() {
    if (!dmPick || busy) return;
    setBusy(true);
    setError(null);
    try {
      const id = await startConversation(dmPick);
      onCreated(id);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn’t start conversation");
    } finally {
      setBusy(false);
    }
  }

  async function createGroup() {
    if (busy) return;
    const name = groupName.trim();
    if (!name) {
      setError("Name your chat");
      return;
    }
    if (selected.size < 1) {
      setError("Add at least one woman");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const id = await createNamedGroupConversation(name, [...selected]);
      onCreated(id);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn’t create group");
    } finally {
      setBusy(false);
    }
  }

  const Backdrop = () => (
    <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
  );
  const Handle = () => (
    <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
      <div className="w-9 h-1 rounded-full" style={{ background: "rgba(255,31,125,0.2)" }} />
    </div>
  );
  const SheetHeader = ({ title, onBack }: { title: string; onBack?: () => void }) => (
    <div className="px-6 pt-2 pb-4 flex items-center gap-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,31,125,0.1)" }}>
      {onBack && (
        <button type="button" onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,31,125,0.08)", border: "none" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      )}
      <p className="text-[10px] font-bold tracking-[0.22em] uppercase flex-1" style={{ color: PINK }}>{title}</p>
      <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,31,125,0.08)", border: "none" }}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11" /></svg>
      </button>
    </div>
  );

  const MemberList = ({
    modePick,
  }: {
    modePick: "dm" | "group";
  }) => {
    if (loadingMembers) {
      return <p className="text-sm py-8 text-center" style={{ color: "rgba(0,0,0,0.4)" }}>Loading members…</p>;
    }
    if (members.length === 0) {
      return (
        <p className="text-sm py-8 text-center" style={{ color: "rgba(0,0,0,0.4)" }}>
          No other members to message yet.
        </p>
      );
    }
    return (
      <>
        {members.map((m) => {
          const active = modePick === "dm" ? dmPick === m.id : selected.has(m.id);
          const initial = m.name.charAt(0).toUpperCase();
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => (modePick === "dm" ? setDmPick(m.id) : toggleGroup(m.id))}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl mb-1"
              style={{
                background: active ? "rgba(255,31,125,0.15)" : "transparent",
                border: active ? "1.5px solid rgba(255,31,125,0.35)" : "1.5px solid rgba(255,31,125,0.08)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0"
                style={{ background: `linear-gradient(135deg,${PINK},${PINK}BB)` }}
              >
                {initial}
              </div>
              <p className="flex-1 text-sm font-semibold text-left" style={{ color: "#111111" }}>{m.name}</p>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: active ? PINK : "#DDD", background: active ? PINK : "transparent" }}
              >
                {active && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5"><polyline points="2 6 5 9 10 3" /></svg>
                )}
              </div>
            </button>
          );
        })}
      </>
    );
  };

  if (mode === "choose") {
    return (
      <>
        <Backdrop />
        <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl" style={{ background: "#FFFFFF", boxShadow: "0 -8px 40px rgba(255,31,125,0.12)", paddingBottom: "env(safe-area-inset-bottom,24px)" }}>
          <Handle /><SheetHeader title="✦ NEW CONVERSATION" />
          <div className="px-6 pt-5 pb-8 flex flex-col gap-3">
            {[
              { label: "Send a message", sub: "One-on-one with someone", action: () => setMode("dm") },
              { label: "Group message", sub: "Name your chat · invite women", action: () => setMode("group") },
            ].map(({ label, sub, action }) => (
              <button
                key={label}
                type="button"
                onClick={action}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
                style={{ background: "#FFF5F8", border: "1.5px solid rgba(255,31,125,0.2)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: "#111111" }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.4)" }}>{sub}</p>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (mode === "dm") {
    const pickName = members.find((m) => m.id === dmPick)?.name;
    return (
      <>
        <Backdrop />
        <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl" style={{ background: "#FFFFFF", boxShadow: "0 -8px 40px rgba(255,31,125,0.12)", maxHeight: "75vh", display: "flex", flexDirection: "column" }}>
          <Handle />
          <SheetHeader title="SEND A MESSAGE" onBack={() => { setMode("choose"); setDmPick(null); setError(null); }} />
          <div className="flex-1 overflow-y-auto px-6 py-3">
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(0,0,0,0.4)" }}>Choose someone</p>
            <MemberList modePick="dm" />
          </div>
          {error && <p className="px-6 text-xs pb-2" style={{ color: PINK }}>{error}</p>}
          <div className="px-6 pb-8 pt-3 flex-shrink-0" style={{ borderTop: "1px solid #F0EBE4" }}>
            <button
              type="button"
              onClick={createDm}
              disabled={!dmPick || busy}
              className="w-full py-4 rounded-full text-sm font-bold"
              style={dmPick && !busy ? { background: PINK, color: "white", boxShadow: "0 4px 16px rgba(255,31,125,0.3)" } : { background: "#F5E8EE", color: "#C8A0B0" }}
            >
              {busy ? "Opening…" : pickName ? `Message ${pickName.split(" ")[0]} →` : "Choose someone first"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Backdrop />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl" style={{ background: "#FFFFFF", boxShadow: "0 -8px 40px rgba(255,31,125,0.12)", maxHeight: "82vh", display: "flex", flexDirection: "column" }}>
        <Handle />
        <SheetHeader title="NAME YOUR CHAT" onBack={() => { setMode("choose"); setSelected(new Set()); setGroupName(""); setError(null); }} />
        <div className="px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,31,125,0.1)" }}>
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Chat name (e.g. Museum Sundays)"
            autoFocus
            maxLength={60}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "#FFF5F8", border: "1.5px solid rgba(255,31,125,0.25)", color: "#111111" }}
          />
          <p className="text-[10px] mt-2" style={{ color: "rgba(0,0,0,0.35)" }}>This is what everyone will see in The Lounge.</p>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-3">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(0,0,0,0.4)" }}>
            Add women · {selected.size} selected
          </p>
          <MemberList modePick="group" />
        </div>
        {error && <p className="px-6 text-xs pb-2" style={{ color: PINK }}>{error}</p>}
        <div className="px-6 pb-8 pt-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,31,125,0.1)" }}>
          <button
            type="button"
            onClick={createGroup}
            disabled={selected.size < 1 || !groupName.trim() || busy}
            className="w-full py-4 rounded-full text-sm font-bold"
            style={selected.size >= 1 && groupName.trim() && !busy
              ? { background: `linear-gradient(135deg,${PINK},#FF69B4)`, color: "white", boxShadow: "0 4px 16px rgba(255,31,125,0.3)" }
              : { background: "#F5E8EE", color: "#C8A0B0" }}
          >
            {busy
              ? "Creating…"
              : !groupName.trim()
                ? "Name your chat"
                : selected.size < 1
                  ? "Add at least one woman"
                  : `Create “${groupName.trim()}” →`}
          </button>
        </div>
      </div>
    </>
  );
}

function ConvoRow({ convo, isUnread, isLast, onClick }: { convo: Convo; isUnread: boolean; isLast: boolean; onClick: () => void }) {
  const isDM = convo.type === "direct";
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", textAlign: "left", cursor: "pointer",
        background: isUnread ? "#FFF5F8" : "#FFFFFF",
        borderBottom: isLast ? "none" : "1px solid rgba(255,31,125,0.08)",
        gap: 14, padding: "14px 16px", WebkitTapHighlightColor: "transparent",
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: 50, height: 50, borderRadius: isDM ? "50%" : "16px",
          display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white",
          background: convo.bgGradient ?? `linear-gradient(135deg,${convo.color},${convo.color}BB)`,
          fontSize: convo.initial.length > 1 ? "12px" : "18px",
          boxShadow: isUnread ? `0 0 0 2.5px ${convo.color},0 0 0 5px rgba(255,255,255,0.05)` : "0 2px 8px rgba(0,0,0,0.3)",
        }}>
          {convo.initial}
        </div>
        {isUnread && convo.unread > 0 && (
          <div style={{ position: "absolute", top: -3, right: -3, minWidth: 18, height: 18, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", background: PINK }}>
            <span style={{ fontSize: "9px", fontWeight: 900, color: "white", padding: "0 3px" }}>{convo.unread}</span>
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <p style={{ flex: 1, minWidth: 0, fontSize: "14px", fontWeight: isUnread ? 700 : 500, color: "#111111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.2 }}>{convo.name}</p>
          <span style={{ fontSize: "10px", flexShrink: 0, color: "rgba(0,0,0,0.4)" }}>{convo.time}</span>
        </div>
        <p style={{ fontSize: "12px", color: isUnread ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{convo.preview}</p>
        {convo.subtitle && <p style={{ fontSize: "10px", color: "rgba(0,0,0,0.35)", marginTop: 2 }}>{convo.subtitle}</p>}
      </div>
    </button>
  );
}

function ComposerBar({
  draft,
  setDraft,
  onSend,
  onStickerSend,
  onPhotoSend,
  onGifSend,
  onVoiceSend,
  sending,
}: {
  draft: string;
  setDraft: (v: string) => void;
  onSend: () => void;
  onStickerSend?: (text: string) => void;
  onPhotoSend?: (file: File) => void;
  onGifSend?: (file: File) => void;
  onVoiceSend?: (file: File) => void;
  sending?: boolean;
}) {
  const [showStickers, setShowStickers] = useState(false);
  const [stickerTab, setStickerTab] = useState("girl_culture");
  const [recording, setRecording] = useState(false);
  const [recSecs, setRecSecs] = useState(0);
  const photoRef = useRef<HTMLInputElement>(null);
  const gifRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function toggleVoice() {
    if (sending) return;
    if (recording) {
      mediaRecorderRef.current?.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
      const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (blob.size < 500) return;
        const ext = (recorder.mimeType || "").includes("mp4") ? "m4a" : "webm";
        const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: blob.type });
        onVoiceSend?.(file);
        setRecSecs(0);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setRecSecs(0);
      timerRef.current = setInterval(() => setRecSecs((s) => s + 1), 1000);
    } catch {
      alert("Microphone access is needed to send a voice note.");
    }
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,31,125,0.12)",
      paddingBottom: "max(16px, env(safe-area-inset-bottom))",
    }}>
      <input
        ref={photoRef}
        type="file"
        accept="image/*,image/jpeg,image/png,image/webp,image/heic,image/heif"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onPhotoSend?.(file);
        }}
      />
      <input
        ref={gifRef}
        type="file"
        accept="image/gif"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onGifSend?.(file);
        }}
      />
      {showStickers && (
        <div style={{ borderBottom: "1px solid rgba(255,31,125,0.12)", background: "rgba(255,255,255,0.97)" }}>
          <div style={{ display: "flex", gap: 4, overflowX: "auto", scrollbarWidth: "none", padding: "10px 12px 6px" }}>
            {STICKER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setStickerTab(cat.id)}
                style={{
                  flexShrink: 0, padding: "5px 10px", borderRadius: 999, border: "none",
                  background: stickerTab === cat.id ? PINK : "#FFF5F8",
                  color: stickerTab === cat.id ? "white" : "rgba(0,0,0,0.4)",
                  fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, cursor: "pointer",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "6px 12px 12px", maxHeight: 140, overflowY: "auto" }}>
            {STICKER_CATEGORIES.find((c) => c.id === stickerTab)?.stickers.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { onStickerSend?.(s); setShowStickers(false); }}
                style={{
                  padding: "6px 10px", borderRadius: 999,
                  background: "rgba(255,31,125,0.15)", border: "1px solid rgba(255,31,125,0.25)",
                  fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 600, color: PINK, cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      {recording && (
        <div style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,31,125,0.08)" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: PINK, animation: "pulse 1s infinite" }} />
          <p style={{ fontSize: 12, fontWeight: 700, color: PINK, flex: 1 }}>Recording… {recSecs}s · tap Voice to send</p>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", padding: "10px 20px 4px" }}>
        {[
          { icon: "😊", label: "Stickers", onClick: () => setShowStickers((v) => !v), active: showStickers },
          { icon: recording ? "⏹" : "🎤", label: recording ? "Stop" : "Voice", onClick: () => { void toggleVoice(); }, active: recording },
          { icon: "🖼️", label: "Photo", onClick: () => photoRef.current?.click(), active: false },
          { icon: "🎞️", label: "GIF", onClick: () => gifRef.current?.click(), active: false },
        ].map(({ icon, label, onClick, active }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            disabled={sending}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 6px",
              background: "transparent", border: "none", cursor: "pointer",
              opacity: sending ? 0.4 : 1,
            }}
          >
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontSize: "8px", fontWeight: 700, color: active ? PINK : "rgba(0,0,0,0.35)" }}>{label}</span>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 14px 8px" }}>
        <div style={{ flex: 1, borderRadius: 24, background: "#FFF5F8", border: "1.5px solid rgba(255,31,125,0.2)", overflow: "hidden" }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Message…"
            disabled={sending || recording}
            style={{ width: "100%", padding: "10px 16px", fontSize: "14px", color: "#111111", background: "transparent", outline: "none", border: "none" }}
          />
        </div>
        <button
          type="button"
          onClick={onSend}
          disabled={!draft.trim() || sending || recording}
          style={{
            width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            background: draft.trim() && !sending ? PINK : "rgba(255,255,255,0.12)",
            boxShadow: draft.trim() && !sending ? "0 2px 10px rgba(255,31,125,0.35)" : "none",
            border: "none", cursor: draft.trim() && !sending ? "pointer" : "default", flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={draft.trim() ? "white" : "rgba(255,31,125,0.4)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Bubble({ msg, showName }: { msg: Message; showName?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 10, flexDirection: msg.isMe ? "row-reverse" : "row", alignItems: "flex-end" }}>
      {!msg.isMe && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, color: "white", fontSize: "10px",
          background: `linear-gradient(135deg,${msg.color},${msg.color}BB)`, flexShrink: 0,
        }}>
          {msg.initial}
        </div>
      )}
      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: 3, alignItems: msg.isMe ? "flex-end" : "flex-start" }}>
        {showName && !msg.isMe && (
          <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.5)", fontWeight: 600, padding: "0 2px" }}>{msg.sender}</span>
        )}
        {(msg.mediaType === "image" || msg.mediaType === "gif") && msg.mediaUrl ? (
          <div style={{
            borderRadius: msg.isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", maxWidth: 240,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={msg.mediaUrl}
              alt={msg.mediaType === "gif" ? "GIF" : "Photo"}
              style={{ width: "100%", display: "block", maxHeight: 320, objectFit: "cover" }}
            />
            {msg.text && msg.text !== "📷 Photo" && msg.text !== "GIF" && (
              <p style={{
                margin: 0, padding: "8px 12px", fontSize: 13,
                background: msg.isMe ? PINK : "#FFFFFF", color: msg.isMe ? "white" : "#111",
              }}>
                {msg.text}
              </p>
            )}
          </div>
        ) : msg.mediaType === "audio" && msg.mediaUrl ? (
          <div style={{
            padding: "10px 12px", minWidth: 200,
            borderRadius: msg.isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: msg.isMe ? PINK : "#FFFFFF",
            border: msg.isMe ? "none" : "1px solid rgba(255,31,125,0.1)",
            boxShadow: msg.isMe ? "0 2px 12px rgba(255,31,125,0.28)" : "none",
          }}>
            <audio controls src={msg.mediaUrl} style={{ width: "100%", height: 36, accentColor: msg.isMe ? "#fff" : PINK }} />
          </div>
        ) : msg.isSticker ? (
          <div style={{ fontSize: 22, lineHeight: 1.3, padding: "8px 12px", borderRadius: 16, background: msg.isMe ? PINK : "#FFF5F8", color: msg.isMe ? "white" : PINK, fontWeight: 600 }}>
            {msg.text}
          </div>
        ) : (
          <div style={{
            padding: "10px 14px",
            borderRadius: msg.isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            fontSize: "13px", lineHeight: 1.5,
            ...(msg.isMe
              ? { background: PINK, color: "white", boxShadow: "0 2px 12px rgba(255,31,125,0.28)" }
              : { background: "#FFFFFF", color: "#111111", border: "1px solid rgba(255,31,125,0.1)" }),
          }}>
            {msg.text}
          </div>
        )}
        <span style={{ fontSize: "9px", color: "rgba(0,0,0,0.4)", padding: "0 2px" }}>{msg.time}</span>
      </div>
    </div>
  );
}

function WallpaperPicker({ current, onChange, onClose }: { current: string; onChange: (v: string) => void; onClose: () => void }) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.5)" }} onClick={onClose} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, borderRadius: "28px 28px 0 0", background: "#FFFFFF", boxShadow: "0 -8px 40px rgba(255,31,125,0.12)", paddingBottom: "env(safe-area-inset-bottom,24px)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div style={{ padding: "8px 20px 24px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", color: "#111111", marginBottom: 16 }}>CHAT WALLPAPER</p>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            {WALLPAPERS.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => { onChange(w.value); onClose(); }}
                style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer" }}
              >
                <div style={{
                  width: 64, height: 96, borderRadius: 14, background: w.value,
                  border: current === w.value ? `3px solid ${PINK}` : "3px solid transparent",
                  boxShadow: current === w.value ? `0 0 0 2px white, 0 0 0 4px ${PINK}` : "0 2px 10px rgba(0,0,0,0.1)",
                }} />
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: current === w.value ? PINK : "#AAA" }}>{w.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function useThreadMessages(convoId: string) {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    setLoading(true);

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      setMyId(user?.id ?? null);
      const dbMsgs = await getMessages(convoId);
      if (cancelled) return;
      setMsgs(dbMsgs.map((m) => mapDbMessage(m, user?.id ?? null)));
      setLoading(false);
    })().catch(() => {
      if (!cancelled) setLoading(false);
    });

    const channel = supabase
      .channel(`dm:${convoId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "direct_messages", filter: `conversation_id=eq.${convoId}` },
        async (payload) => {
          const row = payload.new as DirectMessage;
          const { data: { user } } = await supabase.auth.getUser();
          setMsgs((prev) => {
            if (prev.some((p) => p.id === row.id)) return prev;
            // Optimistic local messages use temp ids — drop matching pending text from me
            const withoutOptimistic = prev.filter(
              (p) => !(p.id.startsWith("temp:") && p.isMe && (
                p.text === row.content ||
                (row.media_url && p.mediaUrl === row.media_url)
              )),
            );
            return [...withoutOptimistic, mapDbMessage({
              ...row,
              media_url: row.media_url ?? null,
              media_type: row.media_type ?? "text",
            }, user?.id ?? null)];
          });
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [convoId]);

  const send = useCallback(
    async (
      text: string,
      opts?: { asSticker?: boolean; media?: { url: string; type: "image" | "audio" | "gif" } },
    ) => {
      const trimmed = text.trim();
      const media = opts?.media;
      if ((!trimmed && !media) || sending) return;
      setSending(true);
      setSendError(null);
      const tempId = `temp:${Date.now()}`;
      const label =
        trimmed ||
        (media?.type === "image"
          ? "📷 Photo"
          : media?.type === "gif"
            ? "GIF"
            : media?.type === "audio"
              ? "🎤 Voice note"
              : "");
      setMsgs((prev) => [
        ...prev,
        {
          id: tempId,
          sender: "Me",
          initial: "Y",
          color: PINK,
          text: label,
          time: "now",
          isMe: true,
          isSticker: !!opts?.asSticker,
          mediaUrl: media?.url ?? null,
          mediaType: media?.type ?? "text",
        },
      ]);
      try {
        await dbSendMessage(convoId, label, media);
      } catch (e) {
        setMsgs((prev) => prev.filter((m) => m.id !== tempId));
        setSendError(e instanceof Error ? e.message : "Couldn’t send");
      } finally {
        setSending(false);
      }
    },
    [convoId, sending],
  );

  const sendMediaFile = useCallback(
    async (file: File, type: "image" | "audio" | "gif") => {
      if (sending) return;
      setSending(true);
      setSendError(null);
      const tempId = `temp:${Date.now()}`;
      const label = type === "image" ? "📷 Photo" : type === "gif" ? "GIF" : "🎤 Voice note";
      // Optimistic local preview while uploading
      const localPreview = URL.createObjectURL(file);
      setMsgs((prev) => [
        ...prev,
        {
          id: tempId,
          sender: "Me",
          initial: "Y",
          color: PINK,
          text: label,
          time: "now",
          isMe: true,
          mediaUrl: type === "audio" ? null : localPreview,
          mediaType: type,
        },
      ]);
      try {
        const fd = new FormData();
        fd.set("file", file);
        fd.set("kind", type);
        const result = await sendChatMediaMessage(convoId, fd);
        if (!result.ok) throw new Error(result.error);
        setMsgs((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? { ...m, mediaUrl: result.mediaUrl, mediaType: result.mediaType }
              : m,
          ),
        );
      } catch (e) {
        setMsgs((prev) => prev.filter((m) => m.id !== tempId));
        setSendError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        URL.revokeObjectURL(localPreview);
        setSending(false);
      }
    },
    [convoId, sending],
  );

  return { msgs, loading, sending, sendError, send, sendMediaFile };
}

function ThreadShell({
  convo,
  onBack,
  headerExtra,
  showNames,
}: {
  convo: Convo;
  onBack: () => void;
  headerExtra?: ReactNode;
  showNames?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const [wallpaper, setWallpaper] = useState(convo.bgGradient ?? CREAM);
  const [showWallpaper, setShowWallpaper] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { msgs, loading, sending, sendError, send, sendMediaFile } = useThreadMessages(convo.dbConvoId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: wallpaper }}>
      <div style={{
        padding: "56px 18px 12px", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)",
        display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid rgba(255,31,125,0.12)", position: "sticky", top: 0, zIndex: 10,
      }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,31,125,0.08)", border: "none", cursor: "pointer", flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div style={{
          width: 38, height: 38, borderRadius: convo.type === "direct" ? "50%" : 12,
          display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: "14px",
          background: `linear-gradient(135deg,${convo.color},${convo.color}BB)`, flexShrink: 0,
        }}>
          {convo.initial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontStyle: "italic", fontSize: "17px", color: "#111111", lineHeight: 1.1 }}>{convo.name}</p>
          {convo.subtitle && <p style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)" }}>{convo.subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={() => setShowWallpaper(true)}
          title="Wallpaper"
          style={{
            width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,31,125,0.15)", border: "none", cursor: "pointer",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
        </button>
      </div>
      {showWallpaper && <WallpaperPicker current={wallpaper} onChange={setWallpaper} onClose={() => setShowWallpaper(false)} />}

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 200 }}>
        {headerExtra}
        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {loading && <p style={{ textAlign: "center", fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Loading messages…</p>}
          {!loading && msgs.length === 0 && (
            <p style={{ textAlign: "center", fontSize: 13, color: "rgba(0,0,0,0.4)", padding: "24px 12px" }}>
              No messages yet. Say hello.
            </p>
          )}
          {msgs.map((msg) => <Bubble key={msg.id} msg={msg} showName={showNames} />)}
          <div ref={bottomRef} />
        </div>
      </div>

      {sending && (
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(0,0,0,0.45)", padding: "4px 12px" }}>
          Uploading…
        </p>
      )}
      {sendError && (
        <p style={{
          textAlign: "center", fontSize: 12, color: "#fff", background: PINK,
          margin: "0 16px 8px", padding: "10px 12px", borderRadius: 12, fontWeight: 600,
        }}>
          {sendError}
        </p>
      )}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 20 }}>
        <ComposerBar
          draft={draft}
          setDraft={setDraft}
          sending={sending}
          onSend={() => {
            const t = draft;
            setDraft("");
            void send(t);
          }}
          onStickerSend={(text) => { void send(text, { asSticker: true }); }}
          onPhotoSend={(file) => { void sendMediaFile(file, "image"); }}
          onGifSend={(file) => { void sendMediaFile(file, "gif"); }}
          onVoiceSend={(file) => { void sendMediaFile(file, "audio"); }}
        />
      </div>
    </div>
  );
}

function AddPeopleSheet({
  conversationId,
  onClose,
  onAdded,
}: {
  conversationId: string;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [members, setMembers] = useState<ChatMember[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listChatMembers()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function submit() {
    if (!selected.size || busy) return;
    setBusy(true);
    setError(null);
    try {
      await addMembersToConversation(conversationId, [...selected]);
      onAdded();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn’t add people");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl" style={{ background: "#fff", maxHeight: "75vh", display: "flex", flexDirection: "column", paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="px-6 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,31,125,0.1)" }}>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: PINK }}>Add women</p>
          <button type="button" onClick={onClose} style={{ border: "none", background: "transparent", fontSize: 18, cursor: "pointer" }}>×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-3">
          {loading && <p style={{ fontSize: 13, color: "#888", textAlign: "center", padding: 24 }}>Loading…</p>}
          {!loading && members.length === 0 && (
            <p style={{ fontSize: 13, color: "#888", textAlign: "center", padding: 24 }}>No other members to add yet.</p>
          )}
          {members.map((m) => {
            const active = selected.has(m.id);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggle(m.id)}
                className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl mb-1"
                style={{
                  background: active ? "rgba(255,31,125,0.12)" : "transparent",
                  border: active ? "1.5px solid rgba(255,31,125,0.35)" : "1.5px solid transparent",
                }}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: PINK }}>
                  {m.name.charAt(0)}
                </div>
                <p className="flex-1 text-left text-sm font-semibold">{m.name}</p>
              </button>
            );
          })}
        </div>
        {error && <p className="px-6 text-xs pb-2" style={{ color: PINK }}>{error}</p>}
        <div className="px-6 pb-6 pt-2">
          <button
            type="button"
            disabled={!selected.size || busy}
            onClick={() => { void submit(); }}
            className="w-full py-3.5 rounded-full text-sm font-bold"
            style={selected.size && !busy ? { background: PINK, color: "#fff" } : { background: "#F5E8EE", color: "#C8A0B0" }}
          >
            {busy ? "Adding…" : selected.size ? `Add ${selected.size} →` : "Select women to add"}
          </button>
        </div>
      </div>
    </>
  );
}

function GroupThreadView({ convo, onBack }: { convo: Convo; onBack: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [memberCount, setMemberCount] = useState(convo.memberCount);

  return (
    <>
      <ThreadShell
        convo={convo}
        onBack={onBack}
        showNames
        headerExtra={
          <div style={{ margin: "16px 16px 0", background: "#FFFFFF", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,31,125,0.15)" }}>
            <div style={{ padding: "16px", background: "rgba(255,31,125,0.08)" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: "18px", fontWeight: 900, fontStyle: "italic", color: "#111111" }}>{convo.name}</p>
              <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)", marginTop: 4 }}>
                {memberCount ? `${memberCount} women · Group` : "Group chat"}
              </p>
            </div>
            <div style={{ padding: "10px 14px", display: "flex", gap: 8 }}>
              <Link
                href="/member/plans"
                style={{
                  flex: 1, textAlign: "center", padding: "10px", borderRadius: 14,
                  background: "rgba(255,31,125,0.15)", fontSize: "11px", fontWeight: 700, color: PINK, textDecoration: "none",
                }}
              >
                Plan Together
              </Link>
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 14, border: "none", cursor: "pointer",
                  background: "rgba(139,92,246,0.15)", fontSize: "11px", fontWeight: 700, color: "#7C3AED",
                }}
              >
                + Add women
              </button>
            </div>
          </div>
        }
      />
      {showAdd && (
        <AddPeopleSheet
          conversationId={convo.dbConvoId}
          onClose={() => setShowAdd(false)}
          onAdded={() => setMemberCount((c) => (c ?? 1) + 1)}
        />
      )}
    </>
  );
}

export default function ChatPage() {
  const [view, setView] = useState<View>("list");
  const [activeConvo, setActiveConvo] = useState<Convo | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [showNewChat, setShowNewChat] = useState(false);
  const [read, setRead] = useState<Set<string>>(new Set());
  const [dbConvos, setDbConvos] = useState<Convo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFoundingMother, setIsFoundingMother] = useState(false);

  const reload = useCallback(async () => {
    try {
      const data = await getMyConversations();
      setDbConvos(data.map(dbConvoToUI));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("is_founding_mother")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if ((data as { is_founding_mother?: boolean } | null)?.is_founding_mother) {
            setIsFoundingMother(true);
          }
        });
    });
  }, []);

  function openConvo(convo: Convo) {
    setRead((prev) => new Set([...prev, convo.id]));
    setActiveConvo(convo);
    setView("thread");
    markConversationRead(convo.dbConvoId).catch(console.error);
  }

  function backToList() {
    setView("list");
    setActiveConvo(null);
    void reload();
  }

  async function openCreated(convoId: string) {
    setLoading(true);
    await reload();
    const data = await getMyConversations();
    const mapped = data.map(dbConvoToUI);
    setDbConvos(mapped);
    const found = mapped.find((c) => c.id === convoId);
    if (found) openConvo(found);
  }

  if (view === "thread" && activeConvo) {
    if (activeConvo.type === "group" || activeConvo.type === "club" || activeConvo.type === "plan") {
      return <GroupThreadView convo={activeConvo} onBack={backToList} />;
    }
    return <ThreadShell convo={activeConvo} onBack={backToList} />;
  }

  const shown = dbConvos.filter((c) => c.type !== "plan" && (filter === "all" || c.type === filter));
  const totalUnread = dbConvos
    .filter((c) => c.type !== "plan")
    .reduce((sum, c) => sum + (read.has(c.id) ? 0 : c.unread), 0);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 48, background: LOUNGE_BG, position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "120%", height: 340,
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,31,125,0.22) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ padding: "70px 20px 18px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.85)", marginBottom: 6, textTransform: "uppercase" }}>
              ✦ Members Lounge
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
              <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(38px,10vw,54px)", fontWeight: 900, fontStyle: "italic", color: "#F6F1EB", lineHeight: 0.9 }}>
                The Lounge.
              </h1>
              {totalUnread > 0 && (
                <span style={{ fontSize: "9px", fontWeight: 800, color: "white", background: PINK, borderRadius: 999, padding: "3px 10px", marginBottom: 4 }}>
                  {totalUnread} new
                </span>
              )}
            </div>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "15px", fontStyle: "italic", color: "rgba(255,255,255,0.75)", marginTop: 6 }}>
              where conversations happen
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewChat(true)}
            style={{
              width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: `linear-gradient(135deg,${PINK},#FF69B4)`, boxShadow: "0 3px 16px rgba(255,31,125,0.5)",
              border: "none", cursor: "pointer", marginTop: 32, flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
        </div>
      </div>

      <div style={{ padding: "0 20px 16px", display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none", position: "relative", zIndex: 1 }}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            style={{
              padding: "7px 16px", borderRadius: 999, flexShrink: 0,
              fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em", cursor: "pointer",
              ...(filter === f.value
                ? { background: "white", color: PINK, border: "none", boxShadow: "0 2px 12px rgba(255,31,125,0.4)" }
                : { background: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.3)" }),
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isFoundingMother && (filter === "all" || filter === "group") && (
        <div style={{ margin: "0 16px 10px", position: "relative", zIndex: 1 }}>
          <Link href="/member/lounge/founding-chat" style={{ textDecoration: "none", display: "block" }}>
            <div style={{
              borderRadius: 20, overflow: "hidden",
              background: "linear-gradient(135deg, rgba(212,168,83,0.15) 0%, rgba(212,168,83,0.08) 100%)",
              border: "1.5px solid rgba(212,168,83,0.35)",
              display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: 16,
                background: "linear-gradient(135deg, #D4A853, #8A6010)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
              }}>
                🌺
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,238,200,0.95)" }}>Founding Mothers</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)" }}>Your exclusive founding mothers chat</p>
              </div>
            </div>
          </Link>
        </div>
      )}

      {loading ? (
        <div style={{ margin: "0 16px", borderRadius: 20, padding: "48px 24px", textAlign: "center", background: "#FFFFFF", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 13, color: "rgba(0,0,0,0.4)" }}>Loading conversations…</p>
        </div>
      ) : shown.length > 0 ? (
        <div style={{
          margin: "0 16px", borderRadius: 20, overflow: "hidden", background: "#FFFFFF",
          boxShadow: "0 4px 40px rgba(255,31,125,0.12)", border: "1px solid rgba(255,31,125,0.1)", position: "relative", zIndex: 1,
        }}>
          {shown.map((convo, idx) => (
            <ConvoRow
              key={convo.id}
              convo={convo}
              isUnread={convo.unread > 0 && !read.has(convo.id)}
              isLast={idx === shown.length - 1}
              onClick={() => openConvo(convo)}
            />
          ))}
        </div>
      ) : (
        <div style={{
          margin: "0 16px", borderRadius: 20, padding: "56px 24px", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 12, background: "#FFFFFF", boxShadow: "0 4px 40px rgba(255,31,125,0.12)",
          border: "1px solid rgba(255,31,125,0.1)", position: "relative", zIndex: 1,
        }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", background: "rgba(255,31,125,0.15)" }}>💬</div>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "rgba(0,0,0,0.5)" }}>No conversations yet</p>
          <p style={{ fontSize: "12px", textAlign: "center", color: "rgba(0,0,0,0.35)", maxWidth: 240, lineHeight: 1.5 }}>
            Tap + to message someone or create a named group chat.
          </p>
        </div>
      )}

      {showNewChat && (
        <NewChatSheet
          onClose={() => setShowNewChat(false)}
          onCreated={(id) => { void openCreated(id); }}
        />
      )}
    </div>
  );
}
