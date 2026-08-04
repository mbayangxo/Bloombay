"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBoardPosts, type BoardPost } from "@/lib/actions/board";
import { sendInvitation } from "@/lib/actions/invitations";
import { startConversation } from "@/lib/actions/direct-messages";

// ── Design tokens ──────────────────────────────────────────────────────────────
const PINK = "#FF1F7D";
const DARK_GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' fill='%23fff' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

// ── DB profile type ────────────────────────────────────────────────────────────
interface DBProfile {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar_url: string | null;
  neighborhood: string;
  city: string;
  isFounder: boolean;
  socials: {
    instagram: string | null;
    tiktok: string | null;
    twitter: string | null;
    pinterest: string | null;
    spotify: string | null;
    website: string | null;
  } | null;
}

const SOCIAL_META: Record<string, { label: string; color: string; emoji: string; urlPrefix: string }> = {
  instagram: { label: "Instagram", color: "#E1306C", emoji: "📸", urlPrefix: "https://instagram.com/" },
  tiktok:    { label: "TikTok",    color: "#FF004F", emoji: "🎵", urlPrefix: "https://tiktok.com/@" },
  twitter:   { label: "Twitter",   color: "#1DA1F2", emoji: "🐦", urlPrefix: "https://twitter.com/" },
  pinterest: { label: "Pinterest", color: "#E60023", emoji: "📌", urlPrefix: "https://pinterest.com/" },
  spotify:   { label: "Spotify",   color: "#1DB954", emoji: "🎧", urlPrefix: "" },
  website:   { label: "Website",   color: "#D4A853", emoji: "🔗", urlPrefix: "" },
};

type Tab = "about" | "board";

// ── Main page ──────────────────────────────────────────────────────────────────
export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const router = useRouter();
  const [profile, setProfile] = useState<DBProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("about");
  const [board, setBoard] = useState<BoardPost[]>([]);
  const [boardLoaded, setBoardLoaded] = useState(false);
  const [messaging, setMessaging] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteSubject, setInviteSubject] = useState("");
  const [inviteBody, setInviteBody] = useState("");
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  useEffect(() => {
    fetch(`/api/member/profile/${username}`)
      .then(r => r.ok ? r.json() : null)
      .then((data: DBProfile | null) => { setProfile(data); setLoading(false); });
  }, [username]);

  useEffect(() => {
    if (!profile?.id) return;
    getBoardPosts(profile.id).then(p => { setBoard(p); setBoardLoaded(true); }).catch(() => setBoardLoaded(true));
  }, [profile?.id]);

  async function handleMessage() {
    if (!profile?.id) return;
    setMessaging(true);
    try {
      await startConversation(profile.id);
      router.push("/member/chat");
    } finally {
      setMessaging(false);
    }
  }

  async function handleSendInvite() {
    if (!profile?.id || !inviteSubject.trim()) return;
    setInviteSending(true);
    const { ok } = await sendInvitation(profile.id, inviteSubject, inviteBody);
    setInviteSending(false);
    if (ok) {
      setInviteSent(true);
      setTimeout(() => { setInviteSent(false); setShowInvite(false); setInviteSubject(""); setInviteBody(""); }, 1600);
    }
  }

  const name = profile?.name ?? username.charAt(0).toUpperCase() + username.slice(1);
  const initial = name.charAt(0).toUpperCase();
  const neighborhood = profile?.neighborhood ?? "";
  const city = profile?.city ?? "NYC";
  const bio = profile?.bio ?? "";
  const isFounder = profile?.isFounder ?? false;

  // Convert DB socials to display list
  const socialLinks = profile?.socials
    ? Object.entries(profile.socials)
        .filter(([_, val]) => val)
        .map(([key, handle]) => {
          const meta = SOCIAL_META[key];
          if (!meta) return null;
          const handleStr = handle as string;
          const url = meta.urlPrefix
            ? `${meta.urlPrefix}${handleStr.replace(/^@/, "")}`
            : handleStr;
          return { platform: meta.label, handle: handleStr, url, color: meta.color, emoji: meta.emoji };
        })
        .filter(Boolean) as { platform: string; handle: string; url: string; color: string; emoji: string }[]
    : [];

  if (loading) {
    return (
      <div style={{ backgroundImage: DARK_GRAIN, backgroundSize: "160px 160px", backgroundColor: "#070007", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 18, color: "rgba(255,255,255,0.3)" }}>Loading…</p>
      </div>
    );
  }

  if (!loading && !profile) {
    return (
      <div style={{ backgroundImage: DARK_GRAIN, backgroundSize: "160px 160px", backgroundColor: "#070007", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 24, color: "rgba(255,255,255,0.25)" }}>Profile not found.</p>
        <Link href="/member/avenue" style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: PINK, textDecoration: "none" }}>← Back</Link>
      </div>
    );
  }

  return (
    <div style={{
      backgroundImage: DARK_GRAIN,
      backgroundSize: "160px 160px",
      backgroundColor: "#070007",
      minHeight: "100vh",
      paddingBottom: 120,
    }}>

      {/* ── PHOTO HERO ───────────────────────────────────────────────────── */}
      <div style={{ position: "relative", height: 360, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `${DARK_GRAIN}, linear-gradient(155deg, #1A0018 0%, #3A0026 100%)`, backgroundSize: "160px 160px, 100% 100%" }} />
        {profile?.avatar_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar_url} alt={name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
        )}
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Back button */}
        <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 14px)", left: 16, zIndex: 10, display: "flex", gap: 8 }}>
          <Link href="/member/avenue" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999,
              padding: "6px 13px", display: "flex", alignItems: "center", gap: 6,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "white", letterSpacing: "0.07em" }}>BACK</span>
            </div>
          </Link>
        </div>

        {/* Founding badge */}
        {isFounder && (
          <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 54px)", right: 16, zIndex: 10 }}>
            <div style={{ background: "#D4A853", borderRadius: 6, padding: "3px 8px", boxShadow: "0 2px 10px rgba(212,168,83,0.6)" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", letterSpacing: "0.12em", whiteSpace: "nowrap" as const }}>✦ FOUNDING</span>
            </div>
          </div>
        )}

        {/* Avatar */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 140, height: 140, borderRadius: "50%",
            backgroundImage: `${DARK_GRAIN}, linear-gradient(135deg, #FF69B4, #FF1F7D)`,
            backgroundSize: "160px 160px, 100% 100%",
            border: "3px solid rgba(255,255,255,0.28)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 56, color: "white", fontWeight: 300 }}>{initial}</span>
            )}
          </div>
        </div>

        {/* Name + location */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(7,0,7,0.9) 0%, rgba(7,0,7,0.4) 60%, transparent 100%)",
          padding: "48px 20px 18px",
        }}>
          <h1 style={{
            fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(36px, 10vw, 52px)", color: "white",
            lineHeight: 0.95, margin: 0, letterSpacing: "-0.01em",
          }}>{name}.</h1>
          {neighborhood && <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)", marginTop: 8 }}>{neighborhood.toUpperCase()} · {city.toUpperCase()}</p>}
        </div>
      </div>

      {/* ── BIO + SOCIALS (below hero) ───────────────────────────────────────── */}
      <div style={{ padding: "20px 20px 0" }}>
        {bio && <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: 340, marginBottom: 20 }}>{bio}</p>}

        {/* Social handle chips */}
        {socialLinks.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 20 }}>
            {socialLinks.map(s => (
              <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "7px 14px" }}>
                  <span style={{ fontSize: 11 }}>{s.emoji}</span>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: s.color }}>{s.handle}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Message / Invite */}
        {profile?.id && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button onClick={handleMessage} disabled={messaging} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: PINK, border: "none", borderRadius: 999, padding: "11px 0",
              cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800,
              letterSpacing: "0.06em", color: "white", opacity: messaging ? 0.6 : 1,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              Message
            </button>
            <button onClick={() => setShowInvite(v => !v)} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "11px 0",
              cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800,
              letterSpacing: "0.06em", color: "white",
            }}>
              <span style={{ fontSize: 13 }}>✦</span>
              Invite
            </button>
          </div>
        )}

        {showInvite && (
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 14, marginBottom: 20 }}>
            <input
              value={inviteSubject}
              onChange={e => setInviteSubject(e.target.value)}
              placeholder="Invite her to… (e.g. brunch Saturday)"
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, padding: "9px 12px", fontFamily: "var(--font-jost)", fontSize: 12, color: "white", marginBottom: 8, boxSizing: "border-box" as const, outline: "none" }}
            />
            <textarea
              value={inviteBody}
              onChange={e => setInviteBody(e.target.value)}
              placeholder="Add a note (optional)"
              rows={2}
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, padding: "9px 12px", fontFamily: "var(--font-jost)", fontSize: 12, color: "white", resize: "none" as const, boxSizing: "border-box" as const, outline: "none", marginBottom: 8 }}
            />
            <button
              onClick={handleSendInvite}
              disabled={!inviteSubject.trim() || inviteSending}
              style={{
                width: "100%", padding: "10px", borderRadius: 10, border: "none",
                background: PINK, color: "white", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800,
                letterSpacing: "0.06em", cursor: "pointer", opacity: (!inviteSubject.trim() || inviteSending) ? 0.5 : 1,
              }}
            >{inviteSent ? "Sent to her mailbox ✓" : inviteSending ? "Sending…" : "Send invitation"}</button>
          </div>
        )}
      </div>

      {/* ── ABOUT / BOARD TOGGLE ─────────────────────────────────────────────── */}
      <div style={{
        display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)",
        position: "sticky", top: 0, zIndex: 40,
        backgroundColor: "rgba(7,0,7,0.94)", backdropFilter: "blur(12px)",
        padding: "0 20px",
      }}>
        {(["about", "board"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "14px 0 12px", background: "none", border: "none", cursor: "pointer",
            borderBottom: `2.5px solid ${tab === t ? PINK : "transparent"}`,
            WebkitTapHighlightColor: "transparent",
          }}>
            <span style={{
              fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800,
              letterSpacing: "0.12em", textTransform: "uppercase" as const,
              color: tab === t ? PINK : "rgba(255,255,255,0.25)",
            }}>
              {t === "about" ? "About" : "Her Board"}
            </span>
          </button>
        ))}
      </div>

      <div style={{ padding: "22px 16px 0" }}>

        {/* ── ABOUT TAB ────────────────────────────────────────────────────────── */}
        {tab === "about" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {bio && <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{bio}</p>}

            {/* Social links — full card list */}
            {socialLinks.length > 0 && (
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>FIND HER</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {socialLinks.map(s => (
                    <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundImage: DARK_GRAIN, backgroundSize: "160px 160px", backgroundColor: "#130810", borderRadius: 14, padding: "13px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${s.color}22`, border: `1px solid ${s.color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 11 }}>{s.emoji}</span>
                          </div>
                          <div>
                            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em" }}>{s.platform.toUpperCase()}</p>
                            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{s.handle}</p>
                          </div>
                        </div>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {!bio && socialLinks.length === 0 && (
              <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 16, color: "rgba(255,255,255,0.2)", textAlign: "center" as const, padding: "32px 0" }}>Nothing shared yet.</p>
            )}
          </div>
        )}

        {/* ── BOARD TAB ─────────────────────────────────────────────────────── */}
        {tab === "board" && (
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.28)", marginBottom: 14 }}>HER BOARD · PHOTOS · LINKS · VOICE NOTES</p>
            {!boardLoaded ? (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center" as const, padding: "32px 0" }}>Loading…</p>
            ) : board.length === 0 ? (
              <div style={{ textAlign: "center" as const, padding: "48px 20px" }}>
                <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 20, color: "rgba(255,255,255,0.2)" }}>Nothing here yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                {board.map(p => (
                  <div key={p.id} style={{ backgroundImage: DARK_GRAIN, backgroundSize: "160px 160px", backgroundColor: "#130810", borderRadius: 14, padding: "13px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {p.kind === "photo" && p.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt="" style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 10, marginBottom: p.body ? 8 : 0 }} />
                    )}
                    {p.kind === "voice" && p.voice_url && (
                      <audio controls src={p.voice_url} style={{ width: "100%", marginBottom: 4 }} />
                    )}
                    {p.kind === "link" && p.link_url && (
                      <a href={p.link_url} target="_blank" rel="noopener noreferrer" style={{ display: "block", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: PINK, marginBottom: p.body ? 6 : 2, wordBreak: "break-all" as const }}>
                        🔗 {p.link_url}
                      </a>
                    )}
                    {p.body && (
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{p.body}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
