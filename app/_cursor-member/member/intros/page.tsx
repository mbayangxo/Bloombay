"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { MemberShell } from "../components/member-shell";
import { BLOOM_REQUEST_PREVIEWS } from "@/lib/member-connect-data";
import { CONNECT_MOMENTS } from "@/lib/connect-moments";
import { BloomRequestNote } from "@/app/components/bloom-artifacts";
import { SpaceMood } from "@/app/components/member/space-mood";
import { ConnectMomentScene } from "@/app/components/member/connect-moment-scene";
import { GirlmatesConnectTeaser } from "@/app/components/member/girlmates-connect-teaser";

function ConnectShareBanner() {
  const share = useSearchParams().get("share");
  const plan = useSearchParams().get("plan");
  if (!share) return null;
  return (
    <article className="bb-connect-moment bb-connect-moment--seat" style={{ margin: "0 var(--space-5) var(--space-4)" }}>
      <p className="bb-connect-moment__scene">A friend sent you a plan</p>
      <p className="bb-connect-moment__living">{decodeURIComponent(share)}</p>
      {plan ? (
        <Link href={decodeURIComponent(plan)} className="bb-connect-moment__cta">
          Open the Happening →
        </Link>
      ) : null}
    </article>
  );
}

function ConnectContent() {
  return (
    <MemberShell hideHeader flush fullWidth>
      <SpaceMood mood="connect" showIntro={false}>
        <header className="bb-connect-head">
          <h1 className="bb-connect-head__title">Introductions</h1>
          <p className="bb-connect-head__sub">Your people are already moving</p>
        </header>

        <ConnectShareBanner />

        <div className="bb-connect-moments bb-artifact-board bb-artifact-board--dense" aria-label="Moments happening now">
          {CONNECT_MOMENTS.map((m) => (
            <ConnectMomentScene key={m.id} moment={m} />
          ))}
        </div>

        <GirlmatesConnectTeaser />

        <section className="bb-connect-desk" aria-label="Requests">
          <p className="bb-connect-desk__title">Requests</p>
          <div className="bb-artifact-board bb-artifact-board--dense">
            {BLOOM_REQUEST_PREVIEWS.map((req) => (
              <BloomRequestNote
                key={req.id}
                size="compact"
                href={req.href}
                overline="Bloom request"
                headline={req.fromName}
                headlineAccent="wants to bloom"
                tagline={req.context}
                body={`"${req.note}"`}
                handLabel={req.fromInitial}
              />
            ))}
          </div>
          <Link href="/member/intros/bloom-requests" className="mp-link" style={{ display: "inline-block", marginTop: "0.75rem" }}>
            All bloom requests →
          </Link>
        </section>

        <p className="mp-portal-muted" style={{ padding: "0 1.25rem 2rem", fontSize: "0.85rem" }}>
          <Link href="/member/intros/girl-mates" className="mp-link">
            Girlmates
          </Link>{" "}
          is where women ask about roommates, subleases, and neighborhood questions. Seats live in{" "}
          <Link href="/member/happenings/seats" className="mp-link">
            Happenings
          </Link>
          .
        </p>
      </SpaceMood>
    </MemberShell>
  );
}

export default function IntrosPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem" }}>Loading…</div>}>
      <ConnectContent />
    </Suspense>
  );
}
