"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOnboardingFlow } from "@/lib/portal-onboarding/steps";
import {
  completePortalOnboarding,
  isPortalOnboardingDone,
  shouldForceOnboarding,
} from "@/lib/portal-onboarding/store";
import type { PortalOnboardingId, PortalOnboardingStep } from "@/lib/portal-onboarding/types";
import "@/app/styles/portal-onboarding.css";

function Illustration({ kind }: { kind: PortalOnboardingStep["illustration"] }) {
  const icons: Record<PortalOnboardingStep["illustration"], string> = {
    dashboard: "📊",
    brand: "🎨",
    drops: "💥",
    calendar: "📅",
    club: "🏠",
    mission: "🎯",
    create: "✎",
    field: "🌆",
    revenue: "💰",
  };
  return (
    <div className="po-tour__illus" aria-hidden>
      <span className="po-tour__illus-emoji">{icons[kind]}</span>
      <div className="po-tour__illus-cards">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export function PortalOnboardingTour({ portalId }: { portalId: PortalOnboardingId }) {
  const flow = getOnboardingFlow(portalId);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isPortalOnboardingDone(portalId) || shouldForceOnboarding()) {
      setOpen(true);
      setStep(0);
    }
  }, [portalId]);

  if (!open) return null;

  const current = flow.steps[step];
  const isLast = step >= flow.steps.length - 1;

  function finish() {
    completePortalOnboarding(portalId);
    setOpen(false);
  }

  function next() {
    if (isLast) finish();
    else setStep((s) => s + 1);
  }

  return (
    <div className={`po-tour__backdrop ${flow.accentClass}`} role="dialog" aria-modal="true" aria-labelledby="po-tour-title">
      <div className="po-tour__card">
        <header className="po-tour__head">
          <span className="po-tour__portal">{flow.portalLabel}</span>
          <button type="button" className="po-tour__skip" onClick={finish}>
            Skip tour
          </button>
        </header>
        {step === 0 ? (
          <p className="po-tour__welcome">{flow.welcome}</p>
        ) : null}
        <Illustration kind={current.illustration} />
        <div className="po-tour__progress" aria-hidden>
          {flow.steps.map((s, i) => (
            <span key={s.id} className={i === step ? "po-tour__dot po-tour__dot--on" : "po-tour__dot"} />
          ))}
        </div>
        <h2 id="po-tour-title" className="po-tour__title">
          {current.title}
        </h2>
        <p className="po-tour__body">{current.body}</p>
        {current.tip ? <p className="po-tour__tip">Tip: {current.tip}</p> : null}
        <footer className="po-tour__foot">
          {step > 0 ? (
            <button type="button" className="po-tour__btn" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          ) : (
            <span />
          )}
          <div className="po-tour__foot-right">
            {current.ctaHref ? (
              <Link href={current.ctaHref} className="po-tour__link" onClick={finish}>
                {current.ctaLabel ?? "Open"} →
              </Link>
            ) : null}
            <button type="button" className="po-tour__btn po-tour__btn--primary" onClick={next}>
              {isLast ? "Start using portal" : "Next"}
            </button>
          </div>
        </footer>
        <p className="po-tour__reopen">
          Reopen anytime with <code>?tour=1</code> on the URL
        </p>
      </div>
    </div>
  );
}
