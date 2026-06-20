"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MemberShell } from "../components/member-shell";
import { BbEmptyState } from "@/app/components/member/bb-empty-state";
import { bloomEmptyProps } from "@/lib/bloom-authored";
import { GATHERINGS } from "@/lib/member-portal-data";
import { primaryPlanHref } from "@/lib/member-plans";
import { getPlanRoomData } from "@/lib/plan-room-data";

export default function PlannerPage() {
  const [planHref, setPlanHref] = useState<string | null>(null);
  const [preview, setPreview] = useState<ReturnType<typeof getPlanRoomData> | null>(null);

  useEffect(() => {
    const href = primaryPlanHref();
    if (href) {
      setPlanHref(href);
      const eventId = href.replace("/member/plan/", "");
      const gathering = GATHERINGS.find((g) => g.id === eventId);
      setPreview(getPlanRoomData(eventId, gathering?.title ?? "Your gathering"));
      return;
    }
    const fallback = GATHERINGS[0];
    if (fallback) {
      setPlanHref(`/member/happenings/gatherings/${fallback.id}`);
      setPreview(getPlanRoomData(fallback.id, fallback.title));
    }
  }, []);

  if (!preview || !planHref) {
    return (
      <MemberShell backHref="/member/happenings" backLabel="Happenings" compactHeader flush fullWidth>
        <div className="mp-page-body" style={{ padding: "1.25rem" }}>
          <BbEmptyState
            {...bloomEmptyProps("plans", {
              label: "Browse Happenings",
              href: "/member/happenings",
            })}
          />
        </div>
      </MemberShell>
    );
  }

  return (
    <MemberShell backHref="/member/happenings" backLabel="Happenings" compactHeader flush fullWidth>
      <div className="mp-hero mp-hero--tight">
        <p className="mp-hero__eyebrow">Plan together</p>
        <h1 className="mp-hero__title">Planner</h1>
        <p className="mp-hero__sub">Who&apos;s bringing what · where · when — before you RSVP.</p>
      </div>

      <section className="mp-section">
        <div className="mp-card mp-card--soft" style={{ padding: "1rem" }}>
          <p className="mp-list-row__title">{preview.planTitle}</p>
          <p className="mp-list-row__meta">{preview.dateLine}</p>
        </div>

        <ul className="mp-planner-list">
          {preview.planSteps.map((step) => (
            <li key={step.label}>
              <span aria-hidden>{step.icon}</span>
              <div>
                <span>{step.label}</span>
              </div>
            </li>
          ))}
        </ul>

        <Link href={planHref} className="mp-btn mp-btn--hot mp-btn--block" style={{ marginTop: "1rem" }}>
          {planHref.includes("/member/plan/")
            ? "Open your plan room →"
            : "RSVP to unlock plan room →"}
        </Link>
      </section>
    </MemberShell>
  );
}
