"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";
import { BloomCardsDeck } from "@/app/components/portal/bloom-cards-deck";

const PINK = "#FF1F7D";

interface ScannedProfile {
  user_id: string;
  name: string;
  avatar_url: string | null;
  neighborhood: string | null;
}

type ActionState = "idle" | "loading" | "done";

function ConnectInner() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ScannedProfile | null>(null);
  const [error, setError] = useState<string>("");
  const [isSelf, setIsSelf] = useState(false);

  const [bloomAction, setBloomAction] = useState<ActionState>("idle");
  const [meetupAction, setMeetupAction] = useState<ActionState>("idle");
  const [meetupStreak, setMeetupStreak] = useState<number | null>(null);
  const [milestoneStamp, setMilestoneStamp] = useState<string | null>(null);
  const [bloomResult, setBloomResult] = useState<"sent" | "already" | null>(null);

  useEffect(() => {
    if (!from) { setError("Invalid link."); setLoading(false); return; }
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Sign in to connect."); setLoading(false); return; }
      if (from === user.id) { setIsSelf(true); setLoading(false); return; }

      const { data } = await supabase
        .from("profiles")
        .select("id, first_name, full_name, avatar_url, neighborhood")
        .eq("id", from)
        .maybeSingle();

      if (!data) { setError("Member not found."); setLoading(false); return; }
      const name = data.first_name || data.full_name?.split(" ")[0] || "Her";
      setProfile({ user_id: data.id, name, avatar_url: data.avatar_url ?? null, neighborhood: data.neighborhood ?? null });
      setLoading(false);
    })();
  }, [from]);

  async function addToBloomies() {
    if (!profile || bloomAction !== "idle") return;
    setBloomAction("loading");
    try {
      const res = await fetch("/api/member/bloom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: profile.user_id }),
      });
      const json = await res.json();
      if (res.status === 409 || json.error?.includes("already")) {
        setBloomResult("already");
      } else {
        setBloomResult("sent");
      }
      setBloomAction("done");
    } catch {
      setBloomAction("idle");
    }
  }

  async function logMeetup() {
    if (!profile || meetupAction !== "idle") return;
    setMeetupAction("loading");
    try {
      const res = await fetch("/api/member/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanned_user_id: profile.user_id }),
      });
      const json = await res.json();
      if (res.ok) {
        setMeetupStreak(json.streak ?? null);
        setMilestoneStamp(json.milestone_stamp ?? null);
        setMeetupAction("done");
      } else {
        setMeetupAction("idle");
      }
    } catch {
      setMeetupAction("idle");
    }
  }

  const initial = profile?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bb-bg)", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "52px 20px 0" }}>
        <Link href="/member/lounge" style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bb-nav-bg)", border: "1px solid var(--bb-nav-border)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-nav-icon)" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", color: `${PINK}99` }}>✦ BLOOMIES CODE</p>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px 80px", gap: 24 }}>

        {/* Loading */}
        {loading && (
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(255,31,125,0.3)", borderTopColor: PINK, animation: "spin 1s linear infinite" }} />
        )}

        {/* Self */}
        {!loading && isSelf && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "var(--bb-text-3)", marginBottom: 16 }}>That&apos;s your own code.</p>
            <Link href="/member/you" style={{ color: PINK, fontSize: 12, fontFamily: "var(--font-jost)" }}>View your profile →</Link>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "var(--bb-text-3)", marginBottom: 16 }}>{error}</p>
            <Link href="/member/home" style={{ color: PINK, fontSize: 12, fontFamily: "var(--font-jost)" }}>Back home →</Link>
          </div>
        )}

        {/* Profile card + actions */}
        {!loading && profile && (
          <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Person card */}
            <div style={{
              borderRadius: 24,
              overflow: "hidden",
              background: "var(--bb-card)",
              border: `1px solid var(--bb-border-strong)`,
              boxShadow: `0 8px 32px rgba(255,31,125,0.12)`,
            }}>
              <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${PINK}, transparent)` }} />
              <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt={profile.name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `3px solid ${PINK}40` }} />
                ) : (
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${PINK}, #c4005a)`, display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${PINK}40` }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 24, color: "white" }}>{initial}</span>
                  </div>
                )}
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 26, color: "var(--bb-text)", margin: "0 0 4px" }}>{profile.name}</p>
                  {profile.neighborhood && <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-3)" }}>{profile.neighborhood}</p>}
                </div>
              </div>
            </div>

            {/* Action 1: Add to Bloomies */}
            <button
              onClick={addToBloomies}
              disabled={bloomAction !== "idle"}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: 16,
                border: "none",
                background: bloomAction === "done" ? `rgba(255,31,125,0.1)` : PINK,
                fontFamily: "var(--font-jost)",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: bloomAction === "done" ? PINK : "white",
                cursor: bloomAction !== "idle" ? "default" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {bloomAction === "loading" ? "Sending…" : bloomAction === "done"
                ? (bloomResult === "already" ? "Bloom request already sent ✓" : "Bloom request sent 🌸")
                : `Add ${profile.name} to Bloomies 🌸`}
            </button>

            {/* Action 2: Log meetup */}
            {meetupAction !== "done" ? (
              <button
                onClick={logMeetup}
                disabled={meetupAction !== "idle"}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: 16,
                  border: "1.5px solid var(--bb-border-strong)",
                  background: "transparent",
                  fontFamily: "var(--font-jost)",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: meetupAction === "loading" ? "var(--bb-text-3)" : "var(--bb-text-2)",
                  cursor: meetupAction !== "idle" ? "default" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {meetupAction === "loading" ? "Logging…" : "Log this meetup ✦"}
              </button>
            ) : (
              <>
                <div style={{ borderRadius: 16, border: `1px solid ${PINK}30`, background: `rgba(255,31,125,0.07)`, padding: "16px", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: PINK, margin: "0 0 4px" }}>
                    Meetup logged ✦
                  </p>
                  {meetupStreak !== null && (
                    <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: "var(--bb-text-2)", margin: 0 }}>
                      {`You've crossed paths ${meetupStreak} time${meetupStreak === 1 ? "" : "s"}.`}
                    </p>
                  )}
                  {milestoneStamp && (
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: PINK, margin: "8px 0 0" }}>🌸 {milestoneStamp}</p>
                  )}
                </div>
                <div style={{ marginTop: 16 }}>
                  <BloomCardsDeck context="meetup" />
                </div>
              </>
            )}

            <Link href="/member/lounge" style={{ textAlign: "center", fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-muted)", textDecoration: "none", letterSpacing: "0.06em", display: "block", marginTop: 4 }}>
              Back to lounge →
            </Link>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "var(--bb-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(255,31,125,0.3)", borderTopColor: "#FF1F7D", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <ConnectInner />
    </Suspense>
  );
}
