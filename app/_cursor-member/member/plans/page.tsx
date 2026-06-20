"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MemberShell } from "../components/member-shell";
import { BbEmptyState } from "@/app/components/member/bb-empty-state";
import { PlansDesk } from "@/app/components/member/plans-desk";
import { bloomEmptyProps } from "@/lib/bloom-authored";
import { listMemberPlans, type MemberPlanItem } from "@/lib/member-plans";

export default function MemberPlansPage() {
  const [plans, setPlans] = useState<MemberPlanItem[]>([]);

  useEffect(() => {
    function refresh() {
      setPlans(listMemberPlans());
    }
    refresh();
    window.addEventListener("bb-events-updated", refresh);
    return () => window.removeEventListener("bb-events-updated", refresh);
  }, []);

  return (
    <MemberShell backHref="/member/lounge" backLabel="Apartment" compactHeader flush fullWidth>
      <div className="bb-physical-surface">
        {plans.length === 0 ? (
          <div className="mp-page-body">
            <BbEmptyState
              {...bloomEmptyProps("plans", {
                label: "Browse Happenings",
                href: "/member/happenings",
              })}
            />
          </div>
        ) : (
          <PlansDesk plans={plans} />
        )}
        <p className="bb-plans-room__whisper" style={{ marginTop: "1rem" }}>
          Fresh invites in <Link href="/member/mailbox">Mail</Link> · pings in{" "}
          <Link href="/member/notifications">Notifications</Link>.
        </p>
      </div>
    </MemberShell>
  );
}
