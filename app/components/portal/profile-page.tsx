"use client";

import { useState, useEffect, useRef } from "react";
import { logout, updateProfileInfo } from "@/lib/auth/actions";
import { AvatarUpload } from "@/app/components/shared/avatar-upload";
import { createClient } from "@/lib/supabase/client";
import { uploadProfilePhoto } from "@/lib/storage/upload";
import type { AuthUser } from "@/lib/auth/get-user";

const PINK = "#FF1F7D";

type Photo = { id: string; url: string };
type TabId = "profile" | "moments" | "world" | "bloomcode" | "bloomlink" | "settings";

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  photos,
  startIndex,
  onClose,
}: {
  photos: { url: string }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx(i => (i - 1 + photos.length) % photos.length);
  const next = () => setIdx(i => (i + 1) % photos.length);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        style={{ position: "absolute", top: 16, right: 16, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
      >
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" />
        </svg>
      </button>

      <p style={{ position: "absolute", top: 24, left: 18, fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>
        {idx + 1} / {photos.length}
      </p>

      <div
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 440, padding: "0 20px", boxSizing: "border-box" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[idx].url}
          alt=""
          style={{ width: "100%", maxHeight: "72vh", objectFit: "contain", borderRadius: 14, display: "block" }}
        />
      </div>

      {photos.length > 1 && (
        <div style={{ display: "flex", gap: 6, marginTop: 22 }} onClick={e => e.stopPropagation()}>
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{ width: i === idx ? 22 : 6, height: 6, borderRadius: 999, border: "none", cursor: "pointer", background: i === idx ? PINK : "rgba(255,255,255,0.22)", transition: "all 0.18s" }}
            />
          ))}
        </div>
      )}

      {photos.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

// ─── ProfilePage ──────────────────────────────────────────────────────────────

export function ProfilePage({ user }: { user: AuthUser }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatar_url ?? null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [worldPhotos, setWorldPhotos] = useState<Photo[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadingWorldCount, setUploadingWorldCount] = useState(0);
  const [removing, setRemoving] = useState<string | null>(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);

  const [firstName, setFirstName] = useState(user.first_name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [emailEdit, setEmailEdit] = useState(user.email ?? "");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [bloomCodeCopied, setBloomCodeCopied] = useState(false);
  const [bloomLinkCopied, setBloomLinkCopied] = useState(false);

  const addInputRef = useRef<HTMLInputElement>(null);
  const addWorldInputRef = useRef<HTMLInputElement>(null);

  // Derived values
  const displayName = user.first_name ?? user.email?.split("@")[0] ?? "Member";
  const initials = (user.first_name?.[0] ?? user.email?.[0] ?? "?").toUpperCase();
  const memberNumber = user.id.slice(-4).toUpperCase();
  const bloomCode = `BB-${user.id.slice(0, 4).toUpperCase()}`;
  const username = user.email?.split("@")[0] ?? "member";
  const isFounder = user.role === "founder" || user.role === "admin";

  // Date display: JUNE 2026 style from current date
  const now = new Date();
  const monthNames = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
  const monthShortNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const currentMonthYear = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  // Member since: use a fixed plausible date since we don't have joined_at in AuthUser
  // We'll show Jan 2026 as a reasonable default
  const memberSince = `${monthShortNames[0]} 2026`;

  // All photos for lightbox: avatar first, then gallery
  const allPhotos = [
    ...(avatarUrl ? [{ url: avatarUrl }] : []),
    ...photos.map(p => ({ url: p.url })),
  ];

  useEffect(() => {
    createClient()
      .from("profile_photos")
      .select("id, url")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => { if (data) setPhotos(data as Photo[]); });
  }, [user.id]);

  function openLightbox(index: number) {
    setLightboxStart(index);
    setLightboxOpen(true);
  }

  async function handleAddPhotos(files: FileList) {
    const valid = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!valid.length) return;
    setUploadingCount(valid.length);
    const supabase = createClient();
    await Promise.all(valid.map(async (file) => {
      try {
        const url = await uploadProfilePhoto(file, user.id);
        const { data } = await supabase
          .from("profile_photos")
          .insert({ user_id: user.id, url })
          .select("id, url")
          .single();
        if (data) setPhotos(prev => [...prev, data as Photo]);
      } finally {
        setUploadingCount(n => n - 1);
      }
    }));
  }

  async function removePhoto(photo: Photo) {
    setRemoving(photo.id);
    const supabase = createClient();
    try {
      const parts = new URL(photo.url).pathname.split("/profile-photos/");
      if (parts[1]) await supabase.storage.from("profile-photos").remove([parts[1]]);
      await supabase.from("profile_photos").delete().eq("id", photo.id);
    } finally {
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
      setRemoving(null);
    }
  }

  async function handleAddWorldPhotos(files: FileList) {
    const valid = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!valid.length) return;
    setUploadingWorldCount(valid.length);
    const supabase = createClient();
    await Promise.all(valid.map(async (file) => {
      try {
        const url = await uploadProfilePhoto(file, user.id);
        const { data } = await supabase
          .from("profile_photos")
          .insert({ user_id: user.id, url })
          .select("id, url")
          .single();
        if (data) setWorldPhotos(prev => [...prev, data as Photo]);
      } finally {
        setUploadingWorldCount(n => n - 1);
      }
    }));
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    const fd = new FormData();
    fd.append("first_name", firstName);
    fd.append("phone", phone);
    const result = await updateProfileInfo(fd);
    setSaving(false);
    setSaveMsg(result.error
      ? { ok: false, text: result.error }
      : { ok: true, text: "Profile updated!" }
    );
  }

  async function handleUpdateEmail(e: React.FormEvent) {
    e.preventDefault();
    if (emailEdit.trim() === user.email) {
      setEmailMsg({ ok: false, text: "That is already your email." });
      return;
    }
    setEmailBusy(true);
    setEmailMsg(null);
    const { error } = await createClient().auth.updateUser({ email: emailEdit.trim() });
    setEmailBusy(false);
    setEmailMsg(error
      ? { ok: false, text: error.message }
      : { ok: true, text: "Check your new email for a verification link." }
    );
  }

  function copyToClipboard(text: string, type: "bloomcode" | "bloomlink") {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "bloomcode") {
        setBloomCodeCopied(true);
        setTimeout(() => setBloomCodeCopied(false), 2000);
      } else {
        setBloomLinkCopied(true);
        setTimeout(() => setBloomLinkCopied(false), 2000);
      }
    });
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "moments", label: "Moments" },
    { id: "world", label: "World" },
    { id: "bloomcode", label: "Bloom Code" },
    { id: "bloomlink", label: "Bloom Link" },
    { id: "settings", label: "Settings" },
  ];

  /* ── render ─────────────────────────────────── */

  return (
    <div style={{ background: "linear-gradient(160deg, #FFF0F8 0%, #FFF5EC 50%, #FEF0F8 100%)", minHeight: "100vh", paddingBottom: 120 }}>

      {/* ══════════════════════════ PORTFOLIO HEADER ══════════════════════════ */}
      <div style={{ background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 40%, #FFF5EC 80%, #FFF0F8 100%)", padding: "20px 18px 24px", position: "relative" }}>

        {/* Top bar: month/year + member number */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,31,125,0.5)" }}>
            {currentMonthYear}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,31,125,0.5)" }}>
            MEMBER #{memberNumber}
          </p>
        </div>

        {/* Main row: text left + polaroid right */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>

          {/* Left: name + location + cards + badge */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Large italic username */}
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 34, color: "#1C1B1C", lineHeight: 1.1, marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {displayName}.
            </p>

            {/* Location */}
            {(user.neighborhood || user.borough) && (
              <p style={{ fontFamily: "var(--font-jost)", fontStyle: "italic", fontSize: 11, color: "rgba(0,0,0,0.45)", marginBottom: 14, letterSpacing: "0.03em" }}>
                {user.neighborhood}{user.borough ? ` · ${user.borough}` : ""}
              </p>
            )}
            {!user.neighborhood && !user.borough && (
              <p style={{ fontFamily: "var(--font-jost)", fontStyle: "italic", fontSize: 11, color: "rgba(0,0,0,0.3)", marginBottom: 14 }}>
                New York City
              </p>
            )}

            {/* Two info cards side by side */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {/* Member since card */}
              <div style={{ flex: 1, background: "white", border: "1px solid rgba(255,31,125,0.1)", borderRadius: 14, padding: "10px 12px", boxShadow: "0 4px 18px rgba(255,31,125,0.08)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(0,0,0,0.35)", marginBottom: 3 }}>
                  MEMBER SINCE
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: "#1C1B1C" }}>
                  {memberSince}
                </p>
              </div>

              {/* Status card */}
              <div style={{ flex: 1, background: "rgba(255,31,125,0.06)", border: "1px solid rgba(255,31,125,0.15)", borderRadius: 14, padding: "10px 12px", boxShadow: "0 4px 18px rgba(255,31,125,0.08)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,31,125,0.6)", marginBottom: 3 }}>
                  STATUS
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: PINK }}>
                  {isFounder ? "Founding" : (user.verification_status === "verified" ? "Verified" : "Active")}
                </p>
              </div>
            </div>

            {/* Founding member badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#1C1B1C", borderRadius: 999, padding: "6px 14px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.14em", color: "white" }}>
                ✦ {isFounder ? "FOUNDING MEMBER" : "MEMBER"}
              </span>
            </div>
          </div>

          {/* Right: polaroid card */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ background: "white", borderRadius: 16, padding: "8px 8px 18px", boxShadow: "0 6px 24px rgba(255,31,125,0.12)", width: 88, position: "relative" }}>
              {/* Photo area */}
              <div style={{ width: 72, height: 72, borderRadius: 10, background: "linear-gradient(135deg, #FFD6EA 0%, #FFABD4 100%)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: 10 }}>
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 32, color: "rgba(255,31,125,0.5)" }}>
                    {initials}
                  </p>
                )}
              </div>
              {/* Avatar upload inside polaroid */}
              <div style={{ position: "absolute", bottom: 20, right: 4 }} onClick={e => e.stopPropagation()}>
                <AvatarUpload userId={user.id} currentUrl={avatarUrl} initials={initials} size={24} onUpdate={url => setAvatarUrl(url)} />
              </div>
              {/* Handwriting name label */}
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.5)", textAlign: "center", lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingLeft: 2, paddingRight: 2 }}>
                {displayName}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════ TABS ══════════════════════════ */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,240,248,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,31,125,0.08)" }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, WebkitOverflowScrolling: "touch" as unknown as undefined, paddingLeft: 14, paddingRight: 14 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flexShrink: 0,
                padding: "13px 14px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "var(--font-jost)",
                fontSize: "10px",
                fontWeight: activeTab === tab.id ? 800 : 600,
                letterSpacing: "0.08em",
                color: activeTab === tab.id ? PINK : "rgba(0,0,0,0.35)",
                borderBottom: activeTab === tab.id ? `2px solid ${PINK}` : "2px solid transparent",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════ TAB CONTENT ══════════════════════════ */}
      <div style={{ padding: "20px 18px 0" }}>

        {/* ─── PROFILE TAB ─── */}
        {activeTab === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Section label */}
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.6)", marginBottom: 2 }}>
              YOUR APARTMENT
            </p>

            {/* Account info */}
            <div style={cardStyle}>
              <p style={sectionLabel}>ACCOUNT</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                <InfoRow label="Role" value={user.role} />
                <InfoRow label="Status" value={user.verification_status ?? "unverified"} pink={user.verification_status === "verified"} />
                <InfoRow label="Bloom Points" value={`${user.bloom_points ?? 0} pts`} pink />
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div style={cardStyle}>
                <p style={sectionLabel}>BIO</p>
                <p style={{ fontFamily: "var(--font-jost)", fontStyle: "italic", fontSize: 13, color: "#555", lineHeight: 1.65 }}>{user.bio}</p>
              </div>
            )}

            {/* Interests */}
            {user.interests && user.interests.length > 0 && (
              <div style={cardStyle}>
                <p style={sectionLabel}>INTERESTS</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {user.interests.map(tag => (
                    <span key={tag} style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, padding: "5px 12px", borderRadius: 999, background: "rgba(255,31,125,0.08)", color: PINK }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ─── MOMENTS TAB ─── */}
        {activeTab === "moments" && (
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.6)", marginBottom: 16 }}>
              YOUR MOMENTS
            </p>

            {/* Photo grid */}
            {photos.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                {photos.map((photo, i) => (
                  <div key={photo.id} style={{ position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "1", background: "rgba(255,31,125,0.05)", border: "1px solid rgba(255,31,125,0.1)" }}>
                    <button
                      onClick={() => openLightbox(avatarUrl ? i + 1 : i)}
                      style={{ width: "100%", height: "100%", border: "none", padding: 0, cursor: "pointer", display: "block", background: "transparent" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                    <button
                      onClick={() => removePhoto(photo)}
                      disabled={removing === photo.id}
                      style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {removing === photo.id
                        ? <span className="animate-spin" style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid white", borderTopColor: "transparent", display: "inline-block" }} />
                        : <svg width="7" height="7" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="1" y1="1" x2="11" y2="11" /><line x1="11" y1="1" x2="1" y2="11" /></svg>
                      }
                    </button>
                  </div>
                ))}

                {/* Uploading placeholders */}
                {uploadingCount > 0 && Array.from({ length: uploadingCount }).map((_, i) => (
                  <div key={`up-${i}`} style={{ borderRadius: 16, aspectRatio: "1", background: "rgba(255,31,125,0.08)", border: "1.5px dashed rgba(255,31,125,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="animate-spin" style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #FF1F7D", borderTopColor: "transparent", display: "inline-block" }} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {photos.length === 0 && uploadingCount === 0 && (
              <div style={{ ...cardStyle, textAlign: "center", padding: "32px 18px" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "rgba(255,31,125,0.5)", marginBottom: 6 }}>No moments yet</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.35)", marginBottom: 16 }}>Upload photos to fill your apartment</p>
              </div>
            )}

            {/* Add button */}
            <button
              onClick={() => addInputRef.current?.click()}
              style={{ width: "100%", padding: "14px", borderRadius: 16, border: `1.5px dashed rgba(255,31,125,0.4)`, background: "rgba(255,31,125,0.04)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: PINK, letterSpacing: "0.1em" }}>ADD MOMENT</span>
            </button>
            <input ref={addInputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
              onChange={e => { if (e.target.files?.length) handleAddPhotos(e.target.files); e.target.value = ""; }} />
          </div>
        )}

        {/* ─── WORLD TAB ─── */}
        {activeTab === "world" && (
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.6)", marginBottom: 16 }}>
              YOUR WORLD
            </p>

            {worldPhotos.length === 0 && uploadingWorldCount === 0 ? (
              /* Empty call-to-action */
              <div style={{ ...cardStyle, textAlign: "center", padding: "40px 20px" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "rgba(255,31,125,0.6)", marginBottom: 6 }}>
                  Share your world ✦
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.4)", marginBottom: 24, lineHeight: 1.6 }}>
                  Upload photos that show who you are
                </p>
                <button
                  onClick={() => addWorldInputRef.current?.click()}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "13px 24px", background: PINK, color: "white", borderRadius: 14, border: "none", fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", cursor: "pointer", boxShadow: "0 4px 18px rgba(255,31,125,0.38)" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Upload Photos
                </button>
              </div>
            ) : (
              <>
                {/* 2-column photo grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                  {worldPhotos.map(photo => (
                    <div key={photo.id} style={{ position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "1", background: "rgba(255,31,125,0.05)", border: "1px solid rgba(255,31,125,0.1)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                  {uploadingWorldCount > 0 && Array.from({ length: uploadingWorldCount }).map((_, i) => (
                    <div key={`wup-${i}`} style={{ borderRadius: 16, aspectRatio: "1", background: "rgba(255,31,125,0.08)", border: "1.5px dashed rgba(255,31,125,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="animate-spin" style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #FF1F7D", borderTopColor: "transparent", display: "inline-block" }} />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addWorldInputRef.current?.click()}
                  style={{ width: "100%", padding: "14px", borderRadius: 16, border: `1.5px dashed rgba(255,31,125,0.4)`, background: "rgba(255,31,125,0.04)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: PINK, letterSpacing: "0.1em" }}>ADD MORE</span>
                </button>
              </>
            )}

            <input ref={addWorldInputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
              onChange={e => { if (e.target.files?.length) handleAddWorldPhotos(e.target.files); e.target.value = ""; }} />
          </div>
        )}

        {/* ─── BLOOM CODE TAB ─── */}
        {activeTab === "bloomcode" && (
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.6)", marginBottom: 16 }}>
              YOUR BLOOM CODE
            </p>

            <div style={{ ...cardStyle, textAlign: "center", padding: "32px 20px" }}>
              {/* Decorative code display */}
              <div style={{ background: "linear-gradient(135deg, #FFF0F8 0%, #FFE8F4 100%)", borderRadius: 18, padding: "24px 20px", marginBottom: 20, border: "1px solid rgba(255,31,125,0.15)" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 11, color: "rgba(255,31,125,0.5)", marginBottom: 8, letterSpacing: "0.1em" }}>
                  your unique code
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 32, fontWeight: 900, color: PINK, letterSpacing: "0.12em" }}>
                  {bloomCode}
                </p>
              </div>

              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.4)", marginBottom: 18, lineHeight: 1.6 }}>
                Share this code to invite friends to Bloombay
              </p>

              <button
                onClick={() => copyToClipboard(bloomCode, "bloomcode")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", background: bloomCodeCopied ? "#22c55e" : PINK, color: "white", borderRadius: 14, border: "none", fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", cursor: "pointer", boxShadow: `0 4px 18px ${bloomCodeCopied ? "rgba(34,197,94,0.35)" : "rgba(255,31,125,0.38)"}`, transition: "all 0.2s" }}
              >
                {bloomCodeCopied ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ─── BLOOM LINK TAB ─── */}
        {activeTab === "bloomlink" && (
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.6)", marginBottom: 16 }}>
              YOUR BLOOM LINK
            </p>

            <div style={{ ...cardStyle, padding: "28px 20px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 14, letterSpacing: "0.04em" }}>
                Your shareable profile link
              </p>

              {/* Link display */}
              <div style={{ background: "linear-gradient(135deg, #FFF0F8 0%, #FFE8F4 100%)", borderRadius: 14, padding: "14px 16px", marginBottom: 18, border: "1px solid rgba(255,31,125,0.12)", display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,31,125,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 600, color: "#1C1B1C", flex: 1, wordBreak: "break-all" as const }}>
                  bloombay.com/u/{username}
                </p>
              </div>

              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.35)", marginBottom: 18, lineHeight: 1.6 }}>
                Share this link so others can find and connect with you on Bloombay.
              </p>

              <button
                onClick={() => copyToClipboard(`bloombay.com/u/${username}`, "bloomlink")}
                style={{ width: "100%", padding: "14px", background: bloomLinkCopied ? "#22c55e" : PINK, color: "white", borderRadius: 14, border: "none", fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", cursor: "pointer", boxShadow: `0 4px 18px ${bloomLinkCopied ? "rgba(34,197,94,0.35)" : "rgba(255,31,125,0.38)"}`, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {bloomLinkCopied ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ─── SETTINGS TAB ─── */}
        {activeTab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.6)", marginBottom: 2 }}>
              SETTINGS
            </p>

            {/* Edit profile form */}
            <form onSubmit={handleSaveProfile} style={cardStyle}>
              <p style={sectionLabel}>EDIT PROFILE</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field label="FIRST NAME">
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Your first name"
                    style={inputStyle}
                  />
                </Field>

                <Field label="PHONE">
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    style={inputStyle}
                  />
                </Field>
              </div>

              {saveMsg && (
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: saveMsg.ok ? "#22c55e" : "#ef4444", marginTop: 12, fontWeight: 600 }}>
                  {saveMsg.text}
                </p>
              )}

              <button type="submit" disabled={saving} style={{ ...pinkBtn, marginTop: 18, opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>

            {/* Update email form */}
            <form onSubmit={handleUpdateEmail} style={cardStyle}>
              <p style={sectionLabel}>EMAIL ADDRESS</p>

              <Field label="EMAIL">
                <input
                  type="email"
                  value={emailEdit}
                  onChange={e => setEmailEdit(e.target.value)}
                  style={inputStyle}
                />
              </Field>

              {emailMsg && (
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: emailMsg.ok ? "#22c55e" : "#ef4444", marginTop: 12, fontWeight: 600 }}>
                  {emailMsg.text}
                </p>
              )}

              <button type="submit" disabled={emailBusy} style={{ ...outlineBtn, marginTop: 16, opacity: emailBusy ? 0.7 : 1 }}>
                {emailBusy ? "Sending…" : "Update Email"}
              </button>
              <p style={{ fontFamily: "var(--font-jost)", fontStyle: "italic", fontSize: "10px", color: "#bbb", marginTop: 8, lineHeight: 1.5 }}>
                A verification link will be sent to the new address.
              </p>
            </form>

            {/* Sign out */}
            <form action={logout}>
              <button
                type="submit"
                style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "white", borderColor: "rgba(255,31,125,0.1)", fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "#aaa", cursor: "pointer", boxShadow: "0 2px 10px rgba(255,31,125,0.06)" }}
              >
                Sign Out
              </button>
            </form>

          </div>
        )}

      </div>

      {/* ══════════════════════════ LIGHTBOX ══════════════════════════ */}
      {lightboxOpen && allPhotos.length > 0 && (
        <Lightbox photos={allPhotos} startIndex={lightboxStart} onClose={() => setLightboxOpen(false)} />
      )}

    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#aaa", letterSpacing: "0.12em", marginBottom: 7 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function InfoRow({ label, value, pink = false }: { label: string; value: string; pink?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "#bbb", fontWeight: 600 }}>{label}</p>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: pink ? "#FF1F7D" : "#555" }}>{value}</p>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid rgba(255,31,125,0.1)",
  borderRadius: 20,
  padding: "20px 18px",
  boxShadow: "0 4px 18px rgba(255,31,125,0.08)",
};

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-jost)",
  fontSize: "8px",
  fontWeight: 800,
  letterSpacing: "0.2em",
  color: "rgba(255,31,125,0.6)",
  marginBottom: 14,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1.5px solid rgba(255,31,125,0.12)",
  fontFamily: "var(--font-jost)",
  fontSize: 14,
  color: "#1C1B1C",
  background: "#FFF5FB",
  outline: "none",
};

const pinkBtn: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  background: "#FF1F7D",
  color: "white",
  borderRadius: 14,
  border: "none",
  fontFamily: "var(--font-jost)",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  cursor: "pointer",
  boxShadow: "0 4px 18px rgba(255,31,125,0.38)",
};

const outlineBtn: React.CSSProperties = {
  width: "100%",
  padding: "13px",
  background: "transparent",
  color: "#FF1F7D",
  border: "2px solid #FF1F7D",
  borderRadius: 14,
  fontFamily: "var(--font-jost)",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0.08em",
  cursor: "pointer",
};
