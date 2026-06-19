"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import Link from "next/link";
import {
  getClubApplications, updateApplicationStatus, getClubPosts,
  createClubPost, deleteClubPost, getClubGatherings, createGathering, updateClub,
  getClubAlbum, addClubPhoto, removeClubPhoto,
  type ClubApplication, type ClubPost,
} from "@/lib/actions/clubs";
import { uploadClubPhoto } from "@/lib/storage/upload";
import { avatarUrl } from "@/lib/images/supabase-transform";
import { createClient } from "@/lib/supabase/client";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const CREAM = "#F6F1EB";

type ManageTab = "overview" | "members" | "updates" | "gathering" | "photos" | "edit";

interface ClubData {
  id: string;
  slug: string | null;
  name: string;
  tagline: string | null;
  description: string | null;
  neighborhood: string | null;
  primary_color: string | null;
  membership_type: string | null;
  member_limit: number | null;
  cover_url: string | null;
  category: string | null;
}

interface Gathering {
  id: string;
  title: string;
  starts_at: string;
  venue: string | null;
  neighborhood: string | null;
  capacity: number | null;
}

export function ClubManageDashboard({ club }: { club: ClubData }) {
  const [tab, setTab]     = useState<ManageTab>("overview");
  const accent            = club.primary_color ?? PINK;

  return (
    <div style={{ background: "#0E0C0A", minHeight: "100vh", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${accent}22 0%, rgba(14,12,10,0) 60%)`,
        borderBottom: `1px solid ${accent}22`,
        padding: "calc(env(safe-area-inset-top,0px) + 52px) 16px 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Link href={`/member/clubs/${club.slug ?? club.id}`} style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>CLUB PAGE</span>
          </Link>
          <div style={{ flex: 1 }}/>
          <div style={{ background: `${accent}22`, border: `1px solid ${accent}44`, borderRadius: 999, padding: "4px 11px" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: accent, letterSpacing: "0.1em" }}>CLUB MAMA ✦</span>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: `${accent}88`, marginBottom: 4 }}>MANAGE</p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, marginBottom: 4 }}>{club.name}</h1>
          {club.tagline && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{club.tagline}</p>}
        </div>

        {/* Tab strip */}
        <div style={{ display: "flex", gap: 0, overflowX: "auto", scrollbarWidth: "none", marginBottom: -1 }}>
          {([
            { id: "overview",  label: "Overview"  },
            { id: "members",   label: "Members"   },
            { id: "updates",   label: "Updates"   },
            { id: "gathering", label: "Gathering" },
            { id: "photos",    label: "Photos"    },
            { id: "edit",      label: "Edit Club" },
          ] as { id: ManageTab; label: string }[]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flexShrink: 0, padding: "10px 16px", border: "none", cursor: "pointer",
              background: "transparent",
              color: tab === t.id ? accent : "rgba(255,255,255,0.35)",
              fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800,
              letterSpacing: "0.08em",
              borderBottom: tab === t.id ? `2px solid ${accent}` : "2px solid transparent",
              transition: "all 0.15s",
            }}>{t.label.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 16px 0" }}>
        {tab === "overview"  && <OverviewTab  club={club} accent={accent} onTabChange={setTab}/>}
        {tab === "members"   && <MembersTab   clubId={club.id} accent={accent} membershipType={club.membership_type ?? "open"}/>}
        {tab === "updates"   && <UpdatesTab   clubId={club.id} accent={accent}/>}
        {tab === "gathering" && <GatheringTab clubId={club.id} accent={accent}/>}
        {tab === "photos"    && <PhotosTab    clubId={club.id} accent={accent}/>}
        {tab === "edit"      && <EditTab      club={club}      accent={accent}/>}
      </div>
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────
function OverviewTab({ club, accent, onTabChange }: { club: ClubData; accent: string; onTabChange: (t: ManageTab) => void }) {
  const [stats, setStats] = useState({ members: "–", gatherings: "–", applications: "–" });

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("club_memberships").select("id", { count: "exact", head: true }).eq("club_id", club.id),
      supabase.from("gatherings").select("id", { count: "exact", head: true }).eq("club_id", club.id).gte("starts_at", new Date().toISOString()),
      supabase.from("club_applications").select("id", { count: "exact", head: true }).eq("club_id", club.id).eq("status", "pending"),
    ]).then(([members, gatherings, apps]) => {
      setStats({
        members:      String(members.count   ?? 0),
        gatherings:   String(gatherings.count ?? 0),
        applications: String(apps.count       ?? 0),
      });
    });
  }, [club.id]);

  const actions: { label: string; sub: string; tab: ManageTab; emoji: string }[] = [
    { label: "Review Members",   sub: "Accept or reject applications", tab: "members",   emoji: "👥" },
    { label: "Post an Update",   sub: "Share news with your club",     tab: "updates",   emoji: "📣" },
    { label: "New Gathering",    sub: "Plan your next meetup",         tab: "gathering", emoji: "🌸" },
    { label: "Edit Club Details",sub: "Change name, vibe, settings",   tab: "edit",      emoji: "✏️" },
  ];

  return (
    <div>
      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Members",      value: stats.members      },
          { label: "Upcoming",     value: stats.gatherings   },
          { label: "Applications", value: stats.applications },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 12px", border: `1px solid rgba(255,255,255,0.07)` }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: accent, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", marginTop: 4 }}>{s.label.toUpperCase()}</p>
          </div>
        ))}
      </div>

      {/* Action cards */}
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>QUICK ACTIONS</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {actions.map(a => (
          <button key={a.tab} onClick={() => onTabChange(a.tab)} style={{
            display: "flex", alignItems: "center", gap: 14, width: "100%",
            background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: 16, padding: "14px 16px", cursor: "pointer", textAlign: "left",
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{a.emoji}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 700, color: "white", marginBottom: 2 }}>{a.label}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>{a.sub}</p>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Members tab ───────────────────────────────────────────────────────────────
function MembersTab({ clubId, accent, membershipType }: { clubId: string; accent: string; membershipType: string }) {
  const [apps, setApps]     = useState<ClubApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startT] = useTransition();

  useEffect(() => {
    getClubApplications(clubId).then(a => { setApps(a); setLoading(false); });
  }, [clubId]);

  function handleDecision(id: string, status: "accepted" | "rejected") {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    startT(() => updateApplicationStatus(id, status));
  }

  const pending  = apps.filter(a => a.status === "pending");
  const accepted = apps.filter(a => a.status === "accepted");
  const rejected = apps.filter(a => a.status === "rejected");

  if (loading) return <LoadingDots accent={accent}/>;

  return (
    <div>
      {membershipType === "open" && (
        <div style={{ background: `${accent}12`, border: `1px solid ${accent}30`, borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: `${accent}CC` }}>This club is <strong>open</strong> — anyone can join without approval.</p>
        </div>
      )}

      {/* Pending */}
      <SectionLabel label={`PENDING (${pending.length})`} accent={accent}/>
      {pending.length === 0 ? (
        <EmptyState text="No pending applications" accent={accent}/>
      ) : pending.map(a => (
        <ApplicationCard key={a.id} app={a} accent={accent} onDecide={handleDecision}/>
      ))}

      {/* Accepted */}
      {accepted.length > 0 && (
        <>
          <SectionLabel label={`ACCEPTED (${accepted.length})`} accent={accent} mt={20}/>
          {accepted.map(a => <ApplicationCard key={a.id} app={a} accent={accent} onDecide={handleDecision}/>)}
        </>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <>
          <SectionLabel label={`REJECTED (${rejected.length})`} accent={accent} mt={20}/>
          {rejected.map(a => <ApplicationCard key={a.id} app={a} accent={accent} onDecide={handleDecision}/>)}
        </>
      )}
    </div>
  );
}

function ApplicationCard({ app, accent, onDecide }: { app: ClubApplication; accent: string; onDecide: (id: string, s: "accepted"|"rejected") => void }) {
  const name = app.profile?.full_name ?? app.profile?.first_name ?? "Member";
  const initials = name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
  const ago = timeAgo(app.created_at);

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: app.message ? 10 : 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${accent}88, ${accent})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {app.profile?.avatar_url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={avatarUrl(app.profile.avatar_url) ?? ""} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }}/>
            : <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, color: "white" }}>{initials}</span>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 700, color: "white", lineHeight: 1.2 }}>{name}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", color: "rgba(255,255,255,0.3)" }}>{ago}</p>
        </div>
        {/* Status badge */}
        {app.status !== "pending" && (
          <div style={{ borderRadius: 999, padding: "4px 10px", background: app.status === "accepted" ? "rgba(40,180,80,0.18)" : "rgba(220,60,60,0.18)" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: app.status === "accepted" ? "#60D890" : "#FF7070", letterSpacing: "0.08em" }}>{app.status.toUpperCase()}</span>
          </div>
        )}
      </div>

      {app.message && (
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.4, marginBottom: 10, paddingLeft: 50 }}>"{app.message}"</p>
      )}

      {app.status === "pending" && (
        <div style={{ display: "flex", gap: 8, paddingLeft: 50 }}>
          <button onClick={() => onDecide(app.id, "accepted")} style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", background: `${accent}22`, color: accent, fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.08em", cursor: "pointer" }}>ACCEPT ✓</button>
          <button onClick={() => onDecide(app.id, "rejected")} style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, cursor: "pointer" }}>DECLINE</button>
        </div>
      )}
    </div>
  );
}

// ── Updates tab ───────────────────────────────────────────────────────────────
function UpdatesTab({ clubId, accent }: { clubId: string; accent: string }) {
  const [posts, setPosts]     = useState<ClubPost[]>([]);
  const [body, setBody]       = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [, startT] = useTransition();

  useEffect(() => {
    getClubPosts(clubId).then(p => { setPosts(p); setLoading(false); });
  }, [clubId]);

  async function handlePost() {
    if (!body.trim() || posting) return;
    setPosting(true);
    try {
      await createClubPost(clubId, body.trim());
      const updated = await getClubPosts(clubId);
      setPosts(updated);
      setBody("");
    } finally {
      setPosting(false);
    }
  }

  function handleDelete(id: string) {
    setPosts(prev => prev.filter(p => p.id !== id));
    startT(() => deleteClubPost(id));
  }

  return (
    <div>
      {/* Compose */}
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 18, padding: "14px", marginBottom: 20, border: `1px solid ${accent}22` }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.16em", color: `${accent}99`, marginBottom: 10 }}>NEW UPDATE</p>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Share something with your club…"
          rows={3}
          style={{ width: "100%", borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "white", background: "rgba(255,255,255,0.06)", border: `1px solid rgba(255,255,255,0.1)`, outline: "none", resize: "none", lineHeight: 1.6, caretColor: accent, fontFamily: "var(--font-jost)", boxSizing: "border-box" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button onClick={handlePost} disabled={!body.trim() || posting} style={{
            padding: "10px 22px", borderRadius: 999, border: "none", cursor: body.trim() && !posting ? "pointer" : "default",
            background: body.trim() && !posting ? accent : "rgba(255,255,255,0.08)",
            color: body.trim() && !posting ? "white" : "rgba(255,255,255,0.2)",
            fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.1em",
            boxShadow: body.trim() && !posting ? `0 4px 16px ${accent}44` : "none",
            transition: "all 0.15s",
          }}>{posting ? "POSTING…" : "POST UPDATE"}</button>
        </div>
      </div>

      {/* Feed */}
      {loading ? <LoadingDots accent={accent}/> : posts.length === 0 ? (
        <EmptyState text="No updates yet. Post your first one!" accent={accent}/>
      ) : posts.map(p => (
        <div key={p.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.65, marginBottom: 8, whiteSpace: "pre-wrap" }}>{p.body}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.25)" }}>{timeAgo(p.created_at)}</p>
            <button onClick={() => handleDelete(p.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,80,80,0.5)" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Gathering tab ─────────────────────────────────────────────────────────────
function GatheringTab({ clubId, accent }: { clubId: string; accent: string }) {
  const [gatherings, setGatherings] = useState<Gathering[]>([]);
  const [loading, setLoading]       = useState(true);
  const [creating, setCreating]     = useState(false);
  const [success, setSuccess]       = useState(false);
  const [title, setTitle]           = useState("");
  const [venue, setVenue]           = useState("");
  const [date, setDate]             = useState("");
  const [time, setTime]             = useState("19:00");
  const [capacity, setCapacity]     = useState("12");
  const [description, setDesc]      = useState("");

  useEffect(() => {
    getClubGatherings(clubId).then(g => { setGatherings(g as Gathering[]); setLoading(false); });
  }, [clubId]);

  async function handleCreate() {
    if (!title.trim() || !venue.trim() || !date) return;
    setCreating(true);
    try {
      const starts_at = new Date(`${date}T${time}:00`).toISOString();
      await createGathering(clubId, { title, venue, starts_at, description: description || undefined, capacity: parseInt(capacity) || undefined });
      const updated = await getClubGatherings(clubId);
      setGatherings(updated as Gathering[]);
      setTitle(""); setVenue(""); setDate(""); setDesc(""); setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setCreating(false);
    }
  }

  const canCreate = title.trim().length >= 2 && venue.trim().length >= 2 && !!date;

  return (
    <div>
      {/* Create form */}
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 18, padding: "16px", marginBottom: 20, border: `1px solid ${accent}22` }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.16em", color: `${accent}99`, marginBottom: 14 }}>NEW GATHERING</p>

        {success && (
          <div style={{ background: "rgba(40,180,80,0.15)", border: "1px solid rgba(40,180,80,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "#60D890" }}>Gathering created! ✓</p>
          </div>
        )}

        {[
          { label: "TITLE *",       val: title,       set: setTitle,  ph: "e.g. Sunday Brunch at Lucien" },
          { label: "VENUE *",       val: venue,       set: setVenue,  ph: "Restaurant, address, or location" },
          { label: "DESCRIPTION",   val: description, set: setDesc,   ph: "What should members expect?" },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 12 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>{f.label}</p>
            {f.label === "DESCRIPTION" ? (
              <textarea value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} rows={2}
                style={{ width: "100%", borderRadius: 12, padding: "10px 13px", fontSize: 14, color: "white", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", resize: "none", lineHeight: 1.5, caretColor: accent, fontFamily: "var(--font-jost)", boxSizing: "border-box" }}/>
            ) : (
              <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                style={{ width: "100%", borderRadius: 12, padding: "10px 13px", fontSize: 14, color: "white", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", caretColor: accent, fontFamily: "var(--font-jost)", boxSizing: "border-box" }}/>
            )}
          </div>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[
            { label: "DATE *",  type: "date",  val: date,     set: setDate },
            { label: "TIME",    type: "time",  val: time,     set: setTime },
            { label: "SPOTS",   type: "number",val: capacity, set: setCapacity },
          ].map(f => (
            <div key={f.label}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>{f.label}</p>
              <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                min={f.type === "number" ? "1" : undefined}
                style={{ width: "100%", borderRadius: 10, padding: "9px 10px", fontSize: 13, color: "white", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", caretColor: accent, fontFamily: "var(--font-jost)", boxSizing: "border-box", colorScheme: "dark" }}/>
            </div>
          ))}
        </div>

        <button onClick={handleCreate} disabled={!canCreate || creating} style={{
          width: "100%", padding: "13px 0", borderRadius: 14, border: "none",
          background: canCreate && !creating ? accent : "rgba(255,255,255,0.07)",
          color: canCreate && !creating ? "white" : "rgba(255,255,255,0.2)",
          fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em",
          cursor: canCreate && !creating ? "pointer" : "default",
          boxShadow: canCreate && !creating ? `0 4px 18px ${accent}44` : "none",
          transition: "all 0.18s",
        }}>{creating ? "CREATING…" : "CREATE GATHERING ✦"}</button>
      </div>

      {/* Upcoming list */}
      <SectionLabel label="UPCOMING GATHERINGS" accent={accent}/>
      {loading ? <LoadingDots accent={accent}/> : gatherings.length === 0 ? (
        <EmptyState text="No upcoming gatherings. Create your first one!" accent={accent}/>
      ) : gatherings.map(g => (
        <div key={g.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontStyle: "italic", fontWeight: 700, color: "white", marginBottom: 4 }}>{g.title}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>{g.venue ?? "TBD"}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 700, color: accent }}>
            {new Date(g.starts_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {new Date(g.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            {g.capacity ? ` · ${g.capacity} spots` : ""}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Edit tab ──────────────────────────────────────────────────────────────────
function EditTab({ club, accent }: { club: ClubData; accent: string }) {
  const [name, setName]         = useState(club.name);
  const [tagline, setTagline]   = useState(club.tagline ?? "");
  const [desc, setDesc]         = useState(club.description ?? "");
  const [hood, setHood]         = useState(club.neighborhood ?? "");
  const [color, setColor]       = useState(club.primary_color ?? PINK);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const colorRef                = useRef<HTMLInputElement>(null);

  async function handleSave() {
    if (saving || !name.trim()) return;
    setSaving(true);
    try {
      await updateClub(club.id, { name: name.trim(), tagline: tagline || undefined, description: desc || undefined, neighborhood: hood || undefined, primary_color: color });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {saved && (
        <div style={{ background: "rgba(40,180,80,0.15)", border: "1px solid rgba(40,180,80,0.3)", borderRadius: 12, padding: "11px 14px", marginBottom: 16 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "#60D890" }}>Changes saved ✓</p>
        </div>
      )}

      {[
        { label: "CLUB NAME *",   val: name,    set: setName,    ph: "Your club name" },
        { label: "TAGLINE",       val: tagline, set: setTagline, ph: "One-line vibe" },
        { label: "NEIGHBORHOOD",  val: hood,    set: setHood,    ph: "e.g. West Village, Brooklyn" },
      ].map(f => (
        <div key={f.label} style={{ marginBottom: 14 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>{f.label}</p>
          <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
            style={{ width: "100%", borderRadius: 14, padding: "13px 15px", fontSize: 15, fontFamily: f.label === "CLUB NAME *" ? "var(--font-playfair)" : "var(--font-jost)", fontStyle: f.label === "CLUB NAME *" ? "italic" : "normal", fontWeight: f.label === "CLUB NAME *" ? 700 : 500, color: "white", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", caretColor: accent, boxSizing: "border-box" }}/>
        </div>
      ))}

      <div style={{ marginBottom: 14 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>DESCRIPTION</p>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What's your club about? Who should join?" rows={4}
          style={{ width: "100%", borderRadius: 14, padding: "13px 15px", fontSize: 14, color: "white", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", outline: "none", resize: "none", lineHeight: 1.65, caretColor: accent, fontFamily: "var(--font-jost)", boxSizing: "border-box" }}/>
      </div>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>CLUB COLOR</p>
        <button onClick={() => colorRef.current?.click()} style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "none", cursor: "pointer", background: color, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: `0 4px 16px ${color}55` }}>
          <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: "white" }}>{color.toUpperCase()}</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.6)" }}>Tap to change</span>
        </button>
        <input ref={colorRef} type="color" value={color} onChange={e => setColor(e.target.value)} style={{ display: "none" }}/>
      </div>

      <button onClick={handleSave} disabled={!name.trim() || saving} style={{
        width: "100%", padding: "15px 0", borderRadius: 16, border: "none",
        background: name.trim() && !saving ? accent : "rgba(255,255,255,0.07)",
        color: name.trim() && !saving ? "white" : "rgba(255,255,255,0.2)",
        fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em",
        cursor: name.trim() && !saving ? "pointer" : "default",
        boxShadow: name.trim() && !saving ? `0 6px 22px ${accent}44` : "none",
        transition: "all 0.18s",
      }}>{saving ? "SAVING…" : "SAVE CHANGES"}</button>
    </div>
  );
}

// ── Photos tab ────────────────────────────────────────────────────────────────
function PhotosTab({ clubId, accent }: { clubId: string; accent: string }) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [, startT] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getClubAlbum(clubId).then(p => { setPhotos(p); setLoading(false); });
  }, [clubId]);

  async function handleFiles(files: FileList | null) {
    if (!files || uploading) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files).slice(0, 10)) {
        const url = await uploadClubPhoto(file, clubId);
        await addClubPhoto(clubId, url);
        urls.push(url);
      }
      setPhotos(prev => [...prev, ...urls]);
    } finally {
      setUploading(false);
    }
  }

  function handleRemove(url: string) {
    setPhotos(prev => prev.filter(p => p !== url));
    startT(() => removeClubPhoto(clubId, url));
  }

  return (
    <div>
      {/* Upload zone */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{
          width: "100%", borderRadius: 18, border: `2px dashed ${accent}44`,
          background: `${accent}08`, padding: "28px 0", cursor: uploading ? "default" : "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 18,
        }}
      >
        {uploading ? (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: `${accent}88` }}>Uploading…</p>
        ) : (
          <>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={`${accent}88`} strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: `${accent}AA`, letterSpacing: "0.1em" }}>TAP TO ADD PHOTOS</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", color: "rgba(255,255,255,0.25)" }}>Up to 10 at a time · JPG, PNG, HEIC</p>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={e => handleFiles(e.target.files)}
      />

      {/* Grid */}
      {loading ? <LoadingDots accent={accent}/> : photos.length === 0 ? (
        <EmptyState text="No photos yet. Add some to bring your club to life!" accent={accent}/>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <SectionLabel label={`${photos.length} PHOTO${photos.length !== 1 ? "S" : ""}`} accent={accent}/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {photos.map((url, i) => (
              <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 10, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                <button
                  onClick={() => handleRemove(url)}
                  style={{
                    position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%",
                    background: "rgba(0,0,0,0.65)", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Shared helpers ─────────────────────────────────────────────────────────────
function SectionLabel({ label, accent, mt = 0 }: { label: string; accent: string; mt?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, marginTop: mt }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: accent }}/>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>{label}</p>
    </div>
  );
}

function LoadingDots({ accent }: { accent: string }) {
  return (
    <div style={{ display: "flex", gap: 6, padding: "20px 0", justifyContent: "center" }}>
      {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: accent, opacity: 0.4 + i * 0.2 }}/>)}
    </div>
  );
}

function EmptyState({ text, accent }: { text: string; accent: string }) {
  return (
    <div style={{ padding: "28px 16px", textAlign: "center", border: `1px dashed ${accent}30`, borderRadius: 14 }}>
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,255,255,0.3)" }}>{text}</p>
    </div>
  );
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
