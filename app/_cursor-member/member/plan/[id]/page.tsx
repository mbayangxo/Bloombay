"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MemberShell } from "../../components/member-shell";
import { PlanRoomView } from "@/app/components/member/plan-room-view";
import { getMemberHappeningById } from "@/lib/bloombay-events-member";
import { canAccessPlanRoom } from "@/lib/event-rsvp-store";
import { getPlanRoomData } from "@/lib/plan-room-data";

export default function PlanRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    setAllowed(canAccessPlanRoom(id));
  }, [id]);

  const event = getMemberHappeningById(id);

  if (allowed === null) {
    return (
      <MemberShell backHref="/member/happenings" backLabel="Happenings">
        <p style={{ padding: "2rem" }}>Loading plan room…</p>
      </MemberShell>
    );
  }

  if (!allowed || !event) {
    return (
      <MemberShell backHref={`/member/happenings/gatherings/${id}`} backLabel="Event">
        <div style={{ padding: "1.5rem 1.25rem" }}>
          <h1 className="mp-page-head__title">Plan Room locked</h1>
          <p className="mp-page-head__sub">
            RSVP on the event page first — then you&apos;ll see what the host is planning for everyone going.
          </p>
          <Link href={`/member/happenings/gatherings/${id}`} className="mp-btn mp-btn--hot mp-btn--block" style={{ marginTop: "1rem" }}>
            View event & RSVP →
          </Link>
        </div>
      </MemberShell>
    );
  }

  const plan = getPlanRoomData(id, event.title);
  return <PlanRoomView eventId={id} plan={plan} />;
}
