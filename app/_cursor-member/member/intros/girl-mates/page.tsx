"use client";

import { useState } from "react";
import Link from "next/link";
import { MemberShell } from "../../components/member-shell";
import { GirlmatesBoard } from "@/app/components/member/girlmates-board";
import { BbEmptyState } from "@/app/components/member/bb-empty-state";
import { bloomEmptyProps } from "@/lib/bloom-authored";
import { BloomRequestNote } from "@/app/components/bloom-artifacts";
import {
  INCOMING_GIRL_MATE_REQUESTS,
  OUTGOING_GIRL_MATE_REQUESTS,
  type GirlMateRequest,
} from "@/lib/member-connect-data";

type PageTab = "board" | "matches";

function RequestCard({
  req,
  onAccept,
  onDecline,
}: {
  req: GirlMateRequest;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}) {
  return (
    <BloomRequestNote
      overline="Direct match · folded note"
      headline={req.fromName}
      tagline={`${req.neighborhood}, ${req.city} · ${req.budget} · Move-in ${req.moveIn}`}
      body={req.note}
      handLabel={req.fromInitial}
      receipt={[
        { label: "Direction", value: req.direction === "incoming" ? "To you" : "You sent" },
        { label: "Status", value: req.status },
      ]}
    >
      {req.status === "pending" && req.direction === "incoming" && onAccept && onDecline ? (
        <div className="mp-girl-mate-card__actions" style={{ marginTop: "1rem" }}>
          <button type="button" className="mp-btn mp-btn--outline mp-btn--sm" onClick={() => onDecline(req.id)}>
            Decline
          </button>
          <button type="button" className="mp-btn mp-btn--hot mp-btn--sm" onClick={() => onAccept(req.id)}>
            Accept girl mate
          </button>
        </div>
      ) : (
        <p className="mp-list-row__meta" style={{ marginTop: "0.75rem" }}>
          {req.status === "accepted" ? "Connected" : req.status === "declined" ? "Declined" : "Pending"}
        </p>
      )}
    </BloomRequestNote>
  );
}

export default function GirlMatesPage() {
  const [pageTab, setPageTab] = useState<PageTab>("board");
  const [matchTab, setMatchTab] = useState<"incoming" | "outgoing">("incoming");
  const [incoming, setIncoming] = useState(INCOMING_GIRL_MATE_REQUESTS);
  const [outgoing] = useState(OUTGOING_GIRL_MATE_REQUESTS);

  const matchList = matchTab === "incoming" ? incoming : outgoing;

  return (
    <MemberShell backHref="/member/intros" backLabel="Intros" compactHeader>
      <header className="bb-girlmates-page__hero">
        <p className="bb-eyebrow">Intros</p>
        <h1 className="bb-girlmates-page__title">Girlmates</h1>
        <p className="bb-girlmates-page__sub">
          A corner for real questions — roommate searches, subleases, broker recs, and favors between women on BloomBay.
        </p>
      </header>

      <div className="bb-girlmates-page__tabs">
        <button
          type="button"
          className={`bb-girlmates-page__tab${pageTab === "board" ? " bb-girlmates-page__tab--on" : ""}`}
          onClick={() => setPageTab("board")}
        >
          Board
        </button>
        <button
          type="button"
          className={`bb-girlmates-page__tab${pageTab === "matches" ? " bb-girlmates-page__tab--on" : ""}`}
          onClick={() => setPageTab("matches")}
        >
          Direct matches
          {incoming.filter((r) => r.status === "pending").length > 0 ? (
            <span className="bb-girlmates-page__badge">
              {incoming.filter((r) => r.status === "pending").length}
            </span>
          ) : null}
        </button>
      </div>

      <div className="bb-girlmates-page__body">
        {pageTab === "board" ? (
          <GirlmatesBoard />
        ) : (
          <>
            <p className="bb-girlmates-page__matches-note">
              When someone sends you a one-to-one girl mate request after your post, it lands here — then message in mailbox.
            </p>
            <div className="mp-portal-tabs" style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <button
                type="button"
                className={`mp-pill${matchTab === "incoming" ? " mp-pill--active" : ""}`}
                onClick={() => setMatchTab("incoming")}
              >
                Incoming ({incoming.filter((r) => r.status === "pending").length})
              </button>
              <button
                type="button"
                className={`mp-pill${matchTab === "outgoing" ? " mp-pill--active" : ""}`}
                onClick={() => setMatchTab("outgoing")}
              >
                Sent ({outgoing.length})
              </button>
            </div>
            <div className="bb-artifact-stack">
              {matchList.length === 0 ? (
                <BbEmptyState
                  title="No direct matches yet"
                  body="When someone sends a one-to-one girl mate request after your board post, it shows up here."
                  actionLabel="Browse the board"
                  actionHref="/member/intros/girl-mates"
                />
              ) : (
                matchList.map((req) => (
                  <RequestCard
                    key={req.id}
                    req={req}
                    onAccept={(id) =>
                      setIncoming((prev) =>
                        prev.map((r) => (r.id === id ? { ...r, status: "accepted" as const } : r))
                      )
                    }
                    onDecline={(id) =>
                      setIncoming((prev) =>
                        prev.map((r) => (r.id === id ? { ...r, status: "declined" as const } : r))
                      )
                    }
                  />
                ))
              )}
            </div>
            <Link href="/member/mailbox" className="mp-link" style={{ display: "inline-block", marginTop: "1rem" }}>
              Open mailbox →
            </Link>
          </>
        )}
      </div>
    </MemberShell>
  );
}
