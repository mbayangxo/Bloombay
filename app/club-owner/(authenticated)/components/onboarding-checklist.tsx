"use client";

import Link from "next/link";
import { getOnboardingSteps } from "@/lib/club-owner-store";

export function OnboardingChecklist({ clubId }: { clubId: string }) {
  const steps = getOnboardingSteps(clubId);
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
