"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MemberShell } from "../../components/member-shell";
import { BloomRequestNote } from "@/app/components/bloom-artifacts";
import { fetchBloomRequestsFeed, type BloomRequestFeedItem } from "@/lib/bloom-requests-feed";
import { BbEmptyState } from "@/app/components/member/bb-empty-state";
import { bloomEmptyProps } from "@/lib/bloom-authored";

export default function BloomRequestsPage() {
  const [items, setItems] = useState<BloomRequestFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchBloomRequestsFeed().then(({ items: feed }) => {
      setItems(feed.filter((r) => r.status === "pending" && r.direction === "incoming"));
      setLoading(false);
    });
  }, []);

  const pending = items.length > 0 ? items : [];

  return (
    <MemberShell backHref="/member/intros" backLabel="Intros" compactHeader>
      <div className="mp-page-head">
        <h1 className="mp-page-head__title">Bloom requests</h1>
        <p className="mp-page-head__sub">Women who want to connect — accept to add them to your world.</p>
      </div>

      <section className="mp-page-body bb-artifact-stack">
        {loading ? (
          <p className="mp-portal-muted">Loading requests…</p>
        ) : pending.length === 0 ? (
          <BbEmptyState {...bloomEmptyProps("requests")} />
        ) : (
          pending.map((req) => (
            <BloomRequestNote
              key={req.requestId}
              href={req.href}
              overline="Folded note"
              headline={req.fromName.replace(/^You → /, "")}
              headlineAccent="wants to bloom"
              tagline={req.context}
              body={`"${req.note}"`}
              handLabel={req.fromInitial}
              receipt={[
                { label: "Met via", value: req.context },
                { label: "Status", value: "Awaiting you" },
              ]}
            />
          ))
        )}

        <p className="mp-portal-muted" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
          After you accept, they appear in{" "}
          <Link href="/member/bloomies" className="mp-link">
            Bloomies
          </Link>
          .
        </p>
      </section>
    </MemberShell>
  );
}
