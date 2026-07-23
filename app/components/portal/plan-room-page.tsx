"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DbGathering } from "@/lib/happenings/gathering-to-poster";
import { getGatheringPlan } from "@/lib/member-gathering-plans";

const PINK = "#FF1F7D";
const INK = "#111111";
const NAV_OFFSET = "calc(env(safe-area-inset-bottom, 0px) + 80px)";

type PlanTab = "PLAN" | "ATTENDEES" | "DETAILS" | "ORDERS";

function EmptyBlock({ title, body }: { title: string; body: string }) {
  return (
    <div
      style={{
        background: "rgba(0,0,0,0.03)",
        borderRadius: 14,
        padding: "18px 16px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontSize: 15,
          fontWeight: 700,
          color: INK,
          marginBottom: 6,
        }}
      >
        {title}
      </p>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#888", lineHeight: 1.55 }}>{body}</p>
    </div>
  );
}

export function PlanRoomPage({ gatheringId }: { gatheringId?: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PlanTab>("PLAN");
  const [gathering, setGathering] = useState<DbGathering | null>(null);
  const [loading, setLoading] = useState(!!gatheringId);

  useEffect(() => {
    if (!gatheringId) {
      setLoading(false);
      return;
    }
    void (async () => {
      const res = await fetch(`/api/member/gatherings/${encodeURIComponent(gatheringId)}`);
      if (res.ok) {
        const json = await res.json();
        setGathering(json.gathering ?? null);
      }
      setLoading(false);
    })();
  }, [gatheringId]);

  const plan = gathering ? getGatheringPlan(gathering.id) : null;
  const chatHref = plan?.chatHref ?? "/member/chat";

  const when = gathering
    ? new Date(gathering.starts_at).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  const TABS: PlanTab[] = ["PLAN", "ATTENDEES", "DETAILS", "ORDERS"];

  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F2ED" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#888" }}>Loading plan room…</p>
      </div>
    );
  }

  if (!gathering) {
    return (
      <div style={{ minHeight: "100dvh", background: "#F7F2ED", padding: "64px 20px 120px" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, fontWeight: 700, color: INK, marginBottom: 8 }}>
          Plan not found
        </p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#888", marginBottom: 16 }}>
          This plan room isn&apos;t available right now.
        </p>
        <Link href="/member/plans" style={{ color: PINK, fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 13 }}>
          ← Back to Plans
        </Link>
      </div>
    );
  }

  if (!plan || plan.commitment !== "going") {
    return (
      <div style={{ minHeight: "100dvh", background: "#F7F2ED", padding: "64px 20px 120px" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, fontWeight: 700, color: INK, marginBottom: 8 }}>
          Plan room locked
        </p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.55 }}>
          RSVP with &ldquo;I would love to go&rdquo; to unlock the planner and group chat.
        </p>
        <Link href={`/member/happenings/${gathering.slug}`} style={{ color: PINK, fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 13 }}>
          ← Back to happening
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#F7F2ED",
        display: "flex",
        flexDirection: "column",
        maxWidth: 430,
        margin: "0 auto",
        position: "relative",
        paddingBottom: NAV_OFFSET,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "white",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "14px 16px 0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <button
            type="button"
            onClick={() => router.push("/member/plans")}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid rgba(0,0,0,0.08)",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>
            PLAN ROOM ✦
          </p>
          <div style={{ width: 36 }} />
        </div>

        <div style={{ display: "flex" }}>
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "10px 4px 12px",
                border: "none",
                background: "transparent",
                fontFamily: "var(--font-jost)",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: activeTab === tab ? PINK : "#BBB",
                cursor: "pointer",
                borderBottom: activeTab === tab ? `2px solid ${PINK}` : "2px solid transparent",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "linear-gradient(135deg, #FFF0F8 0%, #FFE8F2 100%)",
          padding: "16px 16px 20px",
        }}
      >
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 4 }}>
          PLAN FOR
        </p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: INK, lineHeight: 1.1, marginBottom: 6 }}>
          {gathering.title} ♡
        </h1>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.45)" }}>
          {when} · {plan.place ?? gathering.venue ?? "Venue TBD"}
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
        {activeTab === "PLAN" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 12 }}>
                THE PLAN
              </p>
              <ul style={{ margin: 0, paddingLeft: 18, fontFamily: "var(--font-jost)", fontSize: 13, color: INK, lineHeight: 1.6 }}>
                <li>Meet at {gathering.venue ?? "the venue"} — look for BloomBay women at the host table.</li>
                <li>Check the group chat for last-minute updates from the host.</li>
                <li>Your ticket stays in Plans — pull it up at the door if needed.</li>
              </ul>
              {gathering.description ? (
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#666", marginTop: 14, lineHeight: 1.55 }}>
                  {gathering.description}
                </p>
              ) : null}
            </div>
            <EmptyBlock title="Voice notes aren't available yet" body="You'll be able to hear quick updates from your group here soon." />
            <EmptyBlock title="Outfit check coming soon" body="Share looks and get ready together when this feature ships." />
            <EmptyBlock title="Advance orders aren't live yet" body="Pre-ordering from the venue will show up here when partners are connected." />
          </div>
        )}

        {activeTab === "ATTENDEES" && (
          <EmptyBlock title="No attendee list yet" body="We're not showing who's confirmed in the plan room yet. Check the group chat for updates." />
        )}

        {activeTab === "DETAILS" && (
          <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 12 }}>
              EVENT DETAILS
            </p>
            {[
              { label: "WHEN", value: when ?? "TBD" },
              { label: "VENUE", value: gathering.venue ?? "TBD" },
              { label: "AREA", value: gathering.neighborhood ?? gathering.area ?? "TBD" },
              { label: "HOST", value: gathering.host_name ?? "BloomBay host" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "#AAA" }}>{label}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: INK, fontWeight: 600, textAlign: "right", maxWidth: "58%" }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "ORDERS" && (
          <EmptyBlock title="No menu to order from yet" body="Advance ordering will appear here when this happening has a connected venue menu." />
        )}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: NAV_OFFSET,
          left: 0,
          right: 0,
          maxWidth: 430,
          margin: "0 auto",
          background: "white",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          zIndex: 30,
          padding: "12px 14px 14px",
        }}
      >
        <EmptyBlock title="Group chat isn't built yet" body="Message people going to this plan one-on-one for now." />
        <Link
          href={chatHref}
          style={{
            display: "block",
            marginTop: 12,
            padding: "14px 16px",
            borderRadius: 999,
            background: PINK,
            color: "white",
            fontFamily: "var(--font-jost)",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.06em",
            textAlign: "center",
            textDecoration: "none",
            boxShadow: `0 6px 24px ${PINK}44`,
          }}
        >
          Go to Chats →
        </Link>
      </div>
    </div>
  );
}
