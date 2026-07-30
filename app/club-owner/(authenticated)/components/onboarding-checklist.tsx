"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOnboardingSteps } from "@/lib/club-owner-store";

export function OnboardingChecklist({ clubId }: { clubId: string }) {
  const [hasSentBroadcast, setHasSentBroadcast] = useState(false);

  useEffect(() => {
    fetch("/api/club-portal/broadcasts")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setHasSentBroadcast((d?.broadcasts?.length ?? 0) > 0))
      .catch(() => {});
  }, []);

  const steps = getOnboardingSteps(clubId, hasSentBroadcast);
  const done = steps.filter((s) => s.done).length;

  return (
    <section className="co-onboarding">
      <div className="co-section__head">
        <h2 className="co-section__title">Launch checklist</h2>
        <span className="co-hint">
          {done}/{steps.length} done
        </span>
      </div>
      <ul className="co-onboarding__list">
        {steps.map((step) => (
          <li key={step.id}>
            <Link href={step.href} className={`co-onboarding__item${step.done ? " co-onboarding__item--done" : ""}`}>
              <span className="co-onboarding__check">{step.done ? "✓" : ""}</span>
              {step.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
