"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useArtifactMotion } from "@/lib/use-artifact-motion";
import { MemberShell } from "../components/member-shell";
import { BloomRequestNote } from "@/app/components/bloom-artifacts";
import { fetchBloomRequestsFeed, type BloomRequestFeedItem } from "@/lib/bloom-requests-feed";
import { BLOOM_REQUEST_PREVIEWS } from "@/lib/member-connect-data";

function BloomRequestInner() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("id");
  const [accepted, setAccepted] = useState(false);
  const [replies, setReplies] = useState(0);
  const [feedItem, setFeedItem] = useState<BloomRequestFeedItem | null>(null);
  const requestMotion = useArtifactMotion();

  const seed = useMemo(
    () => BLOOM_REQUEST_PREVIEWS.find((p) => p.id === requestId) ?? BLOOM_REQUEST_PREVIEWS[0],
    [requestId]
  );

  useEffect(() => {
    void fetchBloomRequestsFeed().then(({ items }) => {
      const match = requestId
        ? items.find((i) => i.requestId === requestId || i.id === requestId)
        : items.find((i) => i.status === "pending");
      if (match) setFeedItem(match);
    });
  }, [requestId]);

  const display = feedItem ?? {
    ...seed,
    requestId: seed.id,
    status: "pending" as const,
    direction: "incoming" as const,
    href: seed.href,
  };

  const headline = display.fromName.replace(/^You → /, "");

  async function acceptBloom() {
    requestMotion.trigger("request-unfold");
    const id = feedItem?.requestId ?? requestId;
    try {
      if (id && !id.startsWith("br")) {
        await fetch(`/api/member/bloom-requests/${id}/respond`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "accepted" }),
        });
      } else {
        const res = await fetch("/api/member/bloom-requests");
        if (res.ok) {
          const json = (await res.json()) as {
            requests?: { id: string; status: string }[];
          };
          const pending = json.requests?.find((r) => r.status === "pending");
          if (pending) {
            await fetch(`/api/member/bloom-requests/${pending.id}/respond`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "accepted" }),
            });
          }
        }
      }
    } catch {
      /* demo card */
    }
    setReplies(1);
    setAccepted(true);
  }

  if (accepted) {
    return (
      <MemberShell backHref="/member/intros/bloom-requests" backLabel="Bloom requests" compactHeader>
        <div className="mp-confirm-card">
          <span className="mp-confirm-card__mark">✦</span>
          <h1>You bloomed</h1>
          <p>You and {headline} are connected. Plan a hangout together.</p>
          {replies > 0 ? (
            <p className="mp-list-row__meta" style={{ marginTop: "0.5rem" }}>
              {replies} response{replies === 1 ? "" : "s"}
            </p>
          ) : null}
          <Link href="/member/planner" className="mp-btn mp-btn--hot mp-btn--block" style={{ marginTop: "1.25rem" }}>
            Plan a hangout →
          </Link>
        </div>
      </MemberShell>
    );
  }

  return (
    <MemberShell backHref="/member/intros/bloom-requests" backLabel="Bloom requests" compactHeader>
      <div className={`mp-page-body ${requestMotion.className}`}>
        <BloomRequestNote
          overline="Bloom request"
          headline={headline}
          headlineAccent="wants to bloom"
          tagline={display.context}
          body={`"${display.note}"`}
          handLabel={display.fromInitial}
          receipt={[
            { label: "Shared", value: display.context.split("·")[0]?.trim() || "Intros" },
            { label: "BloomBay", value: "Folded note" },
          ]}
        >
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem" }}>
            <Link href="/member/mailbox" className="mp-btn mp-btn--outline" style={{ flex: 1, textAlign: "center" }}>
              Not now
            </Link>
            <button type="button" className="mp-btn mp-btn--hot" style={{ flex: 1 }} onClick={acceptBloom}>
              Accept bloom
            </button>
          </div>
        </BloomRequestNote>
      </div>
    </MemberShell>
  );
}

export default function BloomRequestPage() {
  return (
    <Suspense
      fallback={
        <MemberShell backHref="/member/intros/bloom-requests" backLabel="Bloom requests">
          <p className="mp-portal-muted" style={{ padding: "2rem" }}>
            Loading…
          </p>
        </MemberShell>
      }
    >
      <BloomRequestInner />
    </Suspense>
  );
}
