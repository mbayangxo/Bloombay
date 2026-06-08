"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BloomObjectIcon } from "@/app/components/bloom/bloom-object-icon";
import { BLOOM_OBJECTS } from "@/lib/bloom-object-assets";
import type { ClubProfile } from "@/lib/club-world-data";
import { setClubMember } from "@/lib/club-world-data";
import {
  getApplicationById,
  getMyApplicationId,
  submitApplication,
} from "@/lib/club-host-store";
import { BbEmptyState } from "@/app/components/member/bb-empty-state";
import {
  acceptClubRules,
  getClubMamaKit,
  getClubRules,
  hasAcceptedClubRules,
} from "@/lib/club-mama-kit";

export function ClubApply({ club }: { club: ClubProfile }) {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "pay" | "done" | "pending" | "denied">("form");
  const [why, setWhy] = useState("");
  const [city, setCity] = useState("");
  const [instagram, setInstagram] = useState("");
  const rulesDoc = getClubRules(club.id);
  const rulesRequired = rulesDoc.requireAccept && rulesDoc.text.trim().length > 0;
  const [rulesAccepted, setRulesAccepted] = useState(() =>
    rulesRequired ? hasAcceptedClubRules(club.id) : true
  );
  const { join } = club;

  function ensureRulesAccepted(): boolean {
    if (!rulesRequired) return true;
    if (!rulesAccepted) return false;
    acceptClubRules(club.id);
    return true;
  }

  useEffect(() => {
    const appId = getMyApplicationId(club.id);
    if (!appId) return;
    const app = getApplicationById(appId);
    if (!app) return;
    if (app.status === "pending") setStep("pending");
    if (app.status === "denied") setStep("denied");
    if (app.status === "approved") setClubMember(club.id, true);
  }, [club.id]);

  function applicantName() {
    if (typeof window === "undefined") return "Member";
    const stored = sessionStorage.getItem("gf_name");
    return stored?.split(" ")[0] ?? "Member";
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!ensureRulesAccepted()) return;
    if (join.mode === "request") {
      await submitApplication(club.id, {
        applicantName: applicantName(),
        city,
        instagram: instagram || undefined,
        why,
      });
      if (!join.autoApprove) {
        setStep("done");
        return;
      }
      if (join.pricing !== "free" && join.payTiming === "after") {
        setStep("pay");
        return;
      }
      if (join.pricing !== "free" && join.payTiming === "before") {
        setStep("pay");
        return;
      }
      finishJoin();
      return;
    }
    if (join.pricing !== "free" && join.payTiming === "before") {
      setStep("pay");
      return;
    }
    finishJoin();
  }

  async function finishJoin() {
    if (!ensureRulesAccepted()) return;
    setClubMember(club.id, true);
    try {
      await fetch("/api/irl/join-club", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubSlug: club.id }),
      });
    } catch {
      // offline / demo — local membership still set
    }
    router.push(`/member/clubs/${club.id}/world`);
  }

  if (step === "pending") {
    return (
      <div className="bb-apply-shell">
        <BbEmptyState
          title="Pending review"
          body="Your host is reading your note. We'll nudge you when you're in — or gently if it's not the right fit yet."
          actionLabel="Back to club"
          actionHref={`/member/clubs/${club.id}`}
        />
      </div>
    );
  }

  if (step === "denied") {
    return (
      <div className="bb-apply-shell">
        <BbEmptyState
          title="Not this time"
          body="The host passed for now. Another house might feel like home — wander the club board."
          actionLabel="Browse clubs"
          actionHref="/member/clubs"
        />
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="bb-apply-shell">
        <BbEmptyState
          title="Request sent"
          body="Your application is on the host's desk. Take a seat in Happenings while you wait."
          actionLabel="Back to club"
          actionHref={`/member/clubs/${club.id}`}
        />
      </div>
    );
  }

  if (step === "pay") {
    return (
      <div className="bb-apply-shell">
        <div className="bb-glass">
          <h2>Membership moment</h2>
          <p className="mp-page-head__sub" style={{ margin: "0 0 1rem" }}>
            {club.join.priceLabel ?? "Club membership"} — this unlocks the house crest and rooms.
          </p>
          <button
            type="button"
            className="mp-btn mp-btn--hot mp-btn--block"
            disabled={rulesRequired && !rulesAccepted}
            onClick={() => {
              if (!ensureRulesAccepted()) return;
              finishJoin();
            }}
          >
            Pay & enter {club.name}
          </button>
        </div>
      </div>
    );
  }

  const kitAccent = getClubMamaKit(club.id).accentObjectKey;
  const accentSrc =
    kitAccent && kitAccent in BLOOM_OBJECTS
      ? BLOOM_OBJECTS[kitAccent as keyof typeof BLOOM_OBJECTS]
      : BLOOM_OBJECTS.request;

  return (
    <div className="bb-apply-shell mp-club-join">
      <BloomObjectIcon src={accentSrc} size={52} className="mp-hero-object" />
      <h1 className="mp-page-head__title" style={{ marginTop: 0 }}>
        {join.mode === "open" ? "Join" : "Apply to"} {club.name}
      </h1>
      <p className="mp-page-head__sub">
        {join.pricing !== "free"
          ? `Paywall · ${join.priceLabel ?? "Paid membership"}`
          : "Complete this step to enter the club."}
      </p>

      {rulesRequired ? (
        <section className="bb-club-rules-panel" aria-labelledby="club-rules-heading">
          <h2 id="club-rules-heading" className="bb-club-rules-panel__title">
            House rules
          </h2>
          <pre className="bb-club-rules-panel__body">{rulesDoc.text}</pre>
          <label className="bb-club-rules-panel__accept">
            <input
              type="checkbox"
              checked={rulesAccepted}
              onChange={(e) => setRulesAccepted(e.target.checked)}
            />
            I have read and accept these rules (v{rulesDoc.version})
          </label>
          {!rulesAccepted ? (
            <p className="bb-club-rules-panel__warn">Accept the rules to continue.</p>
          ) : null}
        </section>
      ) : null}

      {join.mode === "request" ? (
        <form onSubmit={submitForm} className="bb-glass" style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginTop: "1rem", padding: "1rem" }}>
          <textarea
            className="mp-input"
            rows={3}
            placeholder="Why do you want to join?"
            required
            value={why}
            onChange={(e) => setWhy(e.target.value)}
          />
          <input
            className="mp-input"
            placeholder="City / neighborhood"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            className="mp-input"
            placeholder="Instagram (optional)"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
          <button
            type="submit"
            className="mp-btn mp-btn--hot mp-btn--block"
            disabled={rulesRequired && !rulesAccepted}
          >
            Submit application
          </button>
        </form>
      ) : (
        <button
          type="button"
          className="mp-btn mp-btn--hot mp-btn--block"
          style={{ marginTop: "1.5rem" }}
          disabled={rulesRequired && !rulesAccepted}
          onClick={() => {
            if (!ensureRulesAccepted()) return;
            if (join.pricing !== "free" && join.payTiming === "before") {
              setStep("pay");
              return;
            }
            finishJoin();
          }}
        >
          {join.pricing === "free" ? "Enter the club →" : `Continue · ${join.priceLabel}`}
        </button>
      )}
    </div>
  );
}
