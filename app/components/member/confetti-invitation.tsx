"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ConfettiInvitation } from "@/lib/confetti-data";
import { CONFETTI_TYPE_LABELS } from "@/lib/confetti-data";
import {
  acceptConfetti,
  getConfettiResponse,
  wishConfetti,
  type ConfettiResponse,
} from "@/lib/confetti-store";
import { rsvpToEvent } from "@/lib/event-rsvp-store";

export function ConfettiInvitationView({ confetti }: { confetti: ConfettiInvitation }) {
  const router = useRouter();
  const [response, setResponse] = useState<ConfettiResponse | null>(null);
  const [wish, setWish] = useState(confetti.wishPresets[0] ?? "");
  const [sent, setSent] = useState(false);
  const name =
    typeof window !== "undefined" ? sessionStorage.getItem("gf_name")?.split(" ")[0] ?? "You" : "You";

  useEffect(() => {
    function load() {
      const row = getConfettiResponse(confetti.id);
      setResponse(row?.response ?? null);
      if (row?.wishText) setWish(row.wishText);
      setSent(!!row);
    }
    load();
    window.addEventListener("bb-confetti-updated", load);
    return () => window.removeEventListener("bb-confetti-updated", load);
  }, [confetti.id]);

  async function handleAccept() {
    acceptConfetti(confetti.id);
    try {
      await rsvpToEvent(confetti.id, name);
    } catch {
      /* demo */
    }
    setResponse("accepted");
    setSent(true);
    router.push("/member/happenings?tab=invitations");
  }

  function handleWish(e: React.FormEvent) {
    e.preventDefault();
    if (!wish.trim()) return;
    wishConfetti(confetti.id, wish.trim());
    setResponse("wished");
    setSent(true);
  }

  const typeLabel = CONFETTI_TYPE_LABELS[confetti.type];

  return (
    <article className={`bb-confetti-open bb-confetti-open--${confetti.type}`}>
      <header className="bb-confetti-open__hero">
        <p className="bb-eyebrow">BloomBay · confetti</p>
        <h1 className="bb-confetti-open__title">{confetti.headline}</h1>
        <p className="bb-confetti-open__whisper bb-accent-md">{confetti.whisper}</p>
        <p className="bb-confetti-open__meta bb-caption">
          {typeLabel} · Hosted by {confetti.host} · {confetti.when} · {confetti.place}
        </p>
      </header>

      <div className={`bb-confetti-open__stationery bb-confetti-open__stationery--${confetti.type}`}>
        <p className="bb-confetti-open__to">To celebrate</p>
        <p className="bb-confetti-open__name">{confetti.honoree}</p>
        <p className="bb-confetti-open__invite-line bb-accent-sm">
          You&apos;re invited to show up for her — or send love if you can&apos;t.
        </p>
        <span className="bb-wax-seal bb-wax-seal--sm" aria-hidden>
          BB
        </span>
      </div>

      {sent ? (
        <div className="bb-confetti-open__done">
          {response === "accepted" ? (
            <>
              <p className="bb-display-md">You&apos;re with her</p>
              <p className="bb-accent-sm">Your seat is in Plans — we&apos;ll nudge you before {confetti.when}.</p>
              <Link href="/member/plans" className="bb-btn bb-btn--hot bb-btn--block">
                View Plans →
              </Link>
            </>
          ) : (
            <>
              <p className="bb-display-md">Wish sent</p>
              <p className="bb-accent-sm">She&apos;ll see your note on her confetti wall.</p>
              <Link href="/member/happenings?tab=invitations#confetti" className="bb-btn bb-btn--outline-pink bb-btn--block">
                Back to invitations
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="bb-confetti-open__actions">
          <button type="button" className="bb-btn bb-btn--hot bb-btn--block" onClick={handleAccept}>
            Accept & celebrate with her
          </button>
          <form onSubmit={handleWish} className="bb-confetti-open__wish">
            <p className="bb-confetti-open__wish-label">Can&apos;t go? Send a wish</p>
            <textarea
              className="bb-input"
              rows={3}
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Happy birthday, congratulations, cheering you on…"
            />
            <div className="bb-confetti-open__presets">
              {confetti.wishPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="bb-confetti-open__preset"
                  onClick={() => setWish(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
            <button type="submit" className="bb-btn bb-btn--outline-pink bb-btn--block">
              Send wish — not attending
            </button>
          </form>
        </div>
      )}

      <p className="bb-confetti-open__foot bb-caption">
        Confetti lives in{" "}
        <Link href="/member/happenings?tab=invitations#confetti">Invitations</Link> — not The City.
      </p>
    </article>
  );
}
