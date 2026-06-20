"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const PINK = "#FF1F7D";

type TargetProfile = {
  first_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  neighborhood: string | null;
  bio: string | null;
};

const ICEBREAKERS = [
  {
    text: "It's been a minute. What have you been into lately?",
    context: "Simple and open.",
  },
  {
    text: "I keep thinking about something you said at the last thing we were both at.",
    context: "Warm and curious.",
  },
  {
    text: "Are you going to any happenings soon? We should actually plan to be in the same room.",
    context: "Direct and warm.",
  },
];

function IcebreakerCard({
  text,
  context,
  idx,
  copiedIdx,
  onCopy,
}: {
  text: string;
  context: string;
  idx: number;
  copiedIdx: number | null;
  onCopy: (idx: number) => void;
}) {
  const copied = copiedIdx === idx;
  return (
    <div
      style={{
        background: "white",
        borderRadius: 14,
        padding: "14px 16px",
        border: "1px solid rgba(255,31,125,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontSize: 14,
          color: "#111",
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        &ldquo;{text}&rdquo;
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 10,
            color: "#bbb",
          }}
        >
          {context}
        </span>
        <button
          onClick={() => onCopy(idx)}
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 10,
            fontWeight: 700,
            color: copied ? "#888" : PINK,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function IcebreakerScreen({ withUserId }: { withUserId: string }) {
  const [targetProfile, setTargetProfile] = useState<TargetProfile | null>(null);
  const [loadingTarget, setLoadingTarget] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const supabase = createClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, full_name, avatar_url, neighborhood, bio")
          .eq("id", withUserId)
          .maybeSingle();
        setTargetProfile(profile ?? null);
      } catch {
        // fail silently
      } finally {
        setLoadingTarget(false);
      }
    })();
  }, [withUserId]);

  function handleCopy(idx: number) {
    const text = ICEBREAKERS[idx]?.text ?? "";
    void navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  const displayName =
    targetProfile?.first_name ??
    targetProfile?.full_name?.split(" ")[0] ??
    "her";

  const initial = displayName[0]?.toUpperCase() ?? "?";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFF8F0",
        paddingBottom: 96,
      }}
    >
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "20px 20px 0",
        }}
      >
        {/* Back button */}
        <Link
          href="/member/lounge"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontFamily: "var(--font-jost)",
            fontSize: 12,
            fontWeight: 700,
            color: "#888",
            textDecoration: "none",
            marginBottom: 24,
          }}
        >
          ← Back
        </Link>

        {/* Person card at top */}
        {!loadingTarget && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {/* Avatar */}
            {targetProfile?.avatar_url ? (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: "2px solid rgba(255,31,125,0.15)",
                }}
              >
                <img
                  src={targetProfile.avatar_url}
                  alt={displayName}
                  width={44}
                  height={44}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${PINK}, #c4005a)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 16,
                    fontWeight: 800,
                    color: "white",
                  }}
                >
                  {initial}
                </span>
              </div>
            )}
            {/* Name + neighborhood */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                  fontSize: 18,
                  color: "#111",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {targetProfile?.full_name ?? displayName}
              </p>
              {targetProfile?.neighborhood && (
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: 11,
                    color: "#aaa",
                    margin: "2px 0 0",
                  }}
                >
                  {targetProfile.neighborhood}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ✦ REACH OUT label */}
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: "0.28em",
            color: PINK,
            margin: "0 0 8px",
          }}
        >
          ✦ REACH OUT
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontSize: 20,
            color: "#111",
            margin: "0 0 8px",
            lineHeight: 1.2,
          }}
        >
          Start somewhere real.
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 12,
            color: "#888",
            lineHeight: 1.6,
            margin: "0 0 20px",
          }}
        >
          Yande noticed you two haven&rsquo;t crossed paths in a while. Here are
          some ways in.
        </p>

        {/* Icebreaker cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {ICEBREAKERS.map((item, idx) => (
            <IcebreakerCard
              key={idx}
              text={item.text}
              context={item.context}
              idx={idx}
              copiedIdx={copiedIdx}
              onCopy={handleCopy}
            />
          ))}
        </div>

        {/* Footer note */}
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 11,
            color: "#aaa",
            lineHeight: 1.6,
            margin: "0 0 8px",
          }}
        >
          Messaging is coming soon. For now, reach her through her bloom link or
          at your next gathering.
        </p>

        {/* Happenings link */}
        <Link
          href="/member/happenings"
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: 11,
            fontWeight: 700,
            color: PINK,
            textDecoration: "none",
          }}
        >
          See upcoming happenings →
        </Link>
      </div>
    </div>
  );
}

export function MessagesPage() {
  const searchParams = useSearchParams();
  const planSlug = searchParams.get("plan");
  const withUserId = searchParams.get("with");

  if (withUserId) {
    return <IcebreakerScreen withUserId={withUserId} />;
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--pale-pink-bg)" }}>
      <div className="px-5 pt-12 pb-6 max-w-lg mx-auto">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: "#FF1F7D" }}>
          MESSAGES
        </p>
        <h1
          className="text-3xl font-bold italic mb-6"
          style={{ fontFamily: "var(--font-playfair)", color: "#111" }}
        >
          {planSlug ? "Plan group chat" : "Chats"}
        </h1>

        <div className="rounded-3xl p-8 text-center bg-white" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: "36px" }}>{planSlug ? "💬" : "✉️"}</p>
          <p className="font-bold text-lg mt-3 mb-2" style={{ color: "#111" }}>
            {planSlug ? "Your plan chat is ready" : "No messages yet"}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#888" }}>
            {planSlug
              ? `When the host opens the room for "${planSlug}", your group thread will live here alongside your other chats.`
              : "When you join clubs, RSVP to happenings, or enter a plan room, your real conversations will show here. We don't fill this with fake chats."}
          </p>
          {planSlug ? (
            <Link
              href="/member/plans?tab=rooms"
              className="inline-block mt-5 px-5 py-2.5 rounded-full text-xs font-bold text-white"
              style={{ background: "#FF1F7D" }}
            >
              Back to plan rooms →
            </Link>
          ) : (
            <Link
              href="/member/clubs"
              className="inline-block mt-5 px-5 py-2.5 rounded-full text-xs font-bold text-white"
              style={{ background: "#FF1F7D" }}
            >
              Browse clubs →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
