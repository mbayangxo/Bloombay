"use client";

import { useState, useEffect, useRef } from "react";
import { logout, updateProfileInfo } from "@/lib/auth/actions";
import { AvatarUpload } from "@/app/components/shared/avatar-upload";
import { createClient } from "@/lib/supabase/client";
import { uploadProfilePhoto } from "@/lib/storage/upload";
import type { AuthUser } from "@/lib/auth/get-user";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const CREAM = "#F6F1EB";
const PAPER = "#FEFCF7";
const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

type Photo = { id: string; url: string };

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
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{ position: "absolute", top: 16, right: 16, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
      >
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
        </svg>
      </button>

      {/* Counter */}
      <p style={{ position: "absolute", top: 24, left: 18, fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>
        {idx + 1} / {photos.length}
      </p>

      {/* Photo */}
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

      {/* Dot nav */}
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

      {/* Prev / Next arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

// ─── ProfilePage ──────────────────────────────────────────────────────────────

export function ProfilePage({ user }: { user: AuthUser }) {
  const [avatarUrl,      setAvatarUrl]      = useState<string | null>(user.avatar_url ?? null);
  const [photos,         setPhotos]         = useState<Photo[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [removing,       setRemoving]       = useState<string | null>(null);

  const [lightboxOpen,  setLightboxOpen]  = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);

  const [firstName, setFirstName] = useState(user.first_name ?? "");
  const [phone,     setPhone]     = useState(user.phone ?? "");
  const [saving,    setSaving]    = useState(false);
  const [saveMsg,   setSaveMsg]   = useState<{ ok: boolean; text: string } | null>(null);

  const [emailEdit,  setEmailEdit]  = useState(user.email ?? "");
  const [emailBusy,  setEmailBusy]  = useState(false);
  const [emailMsg,   setEmailMsg]   = useState<{ ok: boolean; text: string } | null>(null);

  const addInputRef = useRef<HTMLInputElement>(null);

  // All photos for lightbox: avatar first, then gallery
  const allPhotos = [
    ...(avatarUrl ? [{ url: avatarUrl }] : []),
    ...photos.map(p => ({ url: p.url })),
  ];

  const displayName = user.first_name ?? user.email?.split("@")[0] ?? "Member";
  const initials    = (user.first_name?.[0] ?? user.email?.[0] ?? "?").toUpperCase();

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

  /* ── render ─────────────────────────────────── */

  return (
    <div style={{ backgroundImage: PAPER_TEX, backgroundColor: CREAM, backgroundSize: "200px 200px", minHeight: "100vh", paddingBottom: 120 }}>

      {/* ══════════════════════════ COVER HEADER ══════════════════════════ */}
      {photos.length > 0 ? (
        /* Split layout: left = avatar cover, right = 2×2 photo grid */
        <div style={{ display: "flex", height: 220, overflow: "hidden" }}>

          {/* Avatar cover — left 58% */}
          <div
            onClick={() => openLightbox(0)}
            style={{ flex: "0 0 58%", position: "relative", cursor: "pointer", overflow: "hidden", background: DARK }}
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: `linear-gradient(145deg, ${PINK} 0%, #7F0028 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 64, color: "rgba(255,255,255,0.25)" }}>{initials}</p>
              </div>
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)", pointerEvents: "none" }} />
            {/* Name */}
            <div style={{ position: "absolute", bottom: 12, left: 12 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1, marginBottom: 2 }}>
                {displayName}
              </p>
              {user.neighborhood && (
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>
                  {user.neighborhood}{user.borough ? ` · ${user.borough}` : ""}
                </p>
              )}
            </div>
            {/* Change avatar (stops propagation so it doesn't open lightbox) */}
            <div style={{ position: "absolute", top: 48, left: 12 }} onClick={e => e.stopPropagation()}>
              <AvatarUpload userId={user.id} currentUrl={avatarUrl} initials={initials} size={44} onUpdate={url => setAvatarUrl(url)} />
            </div>
          </div>

          {/* Photo grid — right 42%, gap between cells */}
          <div style={{ flex: "0 0 42%", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 2, paddingLeft: 2, background: "#111" }}>
            {[0, 1, 2, 3].map(i => {
              const photo = photos[i];
              const isLast = i === 3 && photos.length > 4;
              const lightboxIdx = avatarUrl ? i + 1 : i;
              return (
                <div
                  key={i}
                  onClick={() => photo && openLightbox(lightboxIdx)}
                  style={{ position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.04)", cursor: photo ? "pointer" : "default" }}
                >
                  {photo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  )}
                  {isLast && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, color: "white" }}>+{photos.length - 4}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* Full-width cover when no gallery photos yet */
        <div
          onClick={() => avatarUrl && openLightbox(0)}
          style={{ position: "relative", height: 220, overflow: "hidden", background: DARK, cursor: avatarUrl ? "pointer" : "default" }}
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: `linear-gradient(145deg, ${PINK} 0%, #7F0028 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 72, color: "rgba(255,255,255,0.2)" }}>{initials}</p>
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.68) 100%)", pointerEvents: "none" }} />
          {/* Name overlay */}
          <div style={{ position: "absolute", bottom: 16, left: 18 }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, marginBottom: 3 }}>
              {displayName}
            </p>
            {user.neighborhood && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>
                {user.neighborhood}{user.borough ? ` · ${user.borough}` : ""}
              </p>
            )}
          </div>
          {/* Change avatar */}
          <div style={{ position: "absolute", top: 50, left: 18 }} onClick={e => e.stopPropagation()}>
            <AvatarUpload userId={user.id} currentUrl={avatarUrl} initials={initials} size={52} onUpdate={url => setAvatarUrl(url)} />
          </div>
        </div>
      )}

      {/* ══════════════════════════ GALLERY STRIP ══════════════════════════ */}
      <div style={{ background: "#111", paddingLeft: 18, paddingRight: 18, paddingTop: 12, paddingBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>
            YOUR PHOTOS · {allPhotos.length}
          </p>
          <p style={{ fontFamily: "var(--font-instrument)", fontSize: "10px", fontStyle: "italic", color: "rgba(255,255,255,0.2)" }}>
            tap to view
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" as const }}>
          {/* Thumbnails */}
          {photos.map((photo, i) => (
            <div key={photo.id} style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={() => openLightbox(avatarUrl ? i + 1 : i)}
                style={{ width: 60, height: 60, borderRadius: 10, overflow: "hidden", border: "none", padding: 0, cursor: "pointer", display: "block" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
              {/* Remove */}
              <button
                onClick={() => removePhoto(photo)}
                disabled={removing === photo.id}
                style={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {removing === photo.id
                  ? <span className="animate-spin" style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid white", borderTopColor: "transparent", display: "inline-block" }} />
                  : <svg width="6" height="6" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/></svg>
                }
              </button>
            </div>
          ))}

          {/* Uploading placeholders */}
          {uploadingCount > 0 && Array.from({ length: uploadingCount }).map((_, i) => (
            <div key={`up-${i}`} style={{ flexShrink: 0, width: 60, height: 60, borderRadius: 10, background: "rgba(255,31,125,0.12)", border: "1.5px solid rgba(255,31,125,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="animate-spin" style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #FF1F7D", borderTopColor: "transparent", display: "inline-block" }} />
            </div>
          ))}

          {/* Add button */}
          <button
            onClick={() => addInputRef.current?.click()}
            style={{ flexShrink: 0, width: 60, height: 60, borderRadius: 10, border: "1.5px dashed rgba(255,31,125,0.4)", background: "rgba(255,31,125,0.06)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, cursor: "pointer" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: PINK, letterSpacing: "0.06em" }}>ADD</span>
          </button>
        </div>
        <input ref={addInputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
          onChange={e => { if (e.target.files?.length) handleAddPhotos(e.target.files); e.target.value = ""; }} />
      </div>

      {/* ══════════════════════════ FORMS ══════════════════════════ */}
      <div style={{ padding: "18px 18px 0" }}>

        {/* EDIT PROFILE */}
        <form onSubmit={handleSaveProfile} style={{ backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px", borderRadius: 22, padding: "20px 18px", marginBottom: 14, boxShadow: "0 4px 18px rgba(0,0,0,0.07)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 18 }}>EDIT PROFILE</p>

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

        {/* UPDATE EMAIL */}
        <form onSubmit={handleUpdateEmail} style={{ backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px", borderRadius: 22, padding: "20px 18px", marginBottom: 14, boxShadow: "0 4px 18px rgba(0,0,0,0.07)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 18 }}>EMAIL ADDRESS</p>

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
          <p style={{ fontFamily: "var(--font-instrument)", fontSize: "10px", fontStyle: "italic", color: "#bbb", marginTop: 8, lineHeight: 1.5 }}>
            A verification link will be sent to the new address.
          </p>
        </form>

        {/* ACCOUNT */}
        <div style={{ backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px", borderRadius: 22, padding: "20px 18px", marginBottom: 14, boxShadow: "0 4px 18px rgba(0,0,0,0.07)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 14 }}>ACCOUNT</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <InfoRow label="Role"         value={user.role} />
            <InfoRow label="Status"       value={user.verification_status ?? "unverified"} pink={user.verification_status === "verified"} />
            <InfoRow label="Bloom Points" value={`${user.bloom_points ?? 0} pts`}          pink />
          </div>
        </div>

        {/* BIO */}
        {user.bio && (
          <div style={{ backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px", borderRadius: 22, padding: "20px 18px", marginBottom: 14, boxShadow: "0 4px 18px rgba(0,0,0,0.07)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 8 }}>BIO</p>
            <p style={{ fontFamily: "var(--font-instrument)", fontSize: 13, fontStyle: "italic", color: "#555", lineHeight: 1.65 }}>{user.bio}</p>
          </div>
        )}

        {/* INTERESTS */}
        {user.interests && user.interests.length > 0 && (
          <div style={{ backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px", borderRadius: 22, padding: "20px 18px", marginBottom: 14, boxShadow: "0 4px 18px rgba(0,0,0,0.07)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 10 }}>INTERESTS</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {user.interests.map(tag => (
                <span key={tag} style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, padding: "5px 12px", borderRadius: 999, background: "rgba(255,31,125,0.08)", color: PINK }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SIGN OUT */}
        <form action={logout}>
          <button
            type="submit"
            style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px", fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "#aaa", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
          >
            Sign Out
          </button>
        </form>

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

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1.5px solid rgba(0,0,0,0.08)",
  fontFamily: "var(--font-jost)",
  fontSize: 14,
  color: "#1C1B1C",
  background: "#F6F1EB",
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
