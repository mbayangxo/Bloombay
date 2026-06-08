"use client";

import Link from "next/link";
import { useEffect } from "react";
import { MemberShell } from "../components/member-shell";
import { markNotificationRead } from "@/lib/member-notifications";

const ITEMS = [
  {
    id: "n-happening-1",
    title: "Rooftop Dinner is live",
    meta: "8 seats left · SoHo",
    href: "/member/happenings",
  },
  {
    id: "n-bloom-1",
    title: "Amanda sent a Bloom request",
    meta: "Morning Run Club",
    href: "/member/bloom-request",
  },
  {
    id: "n-invite-1",
    title: "Invitation · Sunday Supper",
    meta: "Accept in your mailbox",
    href: "/member/mailbox",
  },
];

export default function MemberNotificationsPage() {
  useEffect(() => {
    ITEMS.forEach((i) => markNotificationRead(i.id));
    window.dispatchEvent(new Event("bb-member-mail-updated"));
  }, []);

  return (
    <MemberShell backHref="/member/home" backLabel="Home" compactHeader>
      <div className="mp-page-head">
        <h1 className="mp-page-head__title">Ping</h1>
        <p className="mp-page-head__sub">Happenings, Bloom requests, and nudges — not your RSVPs (those live in Plans).</p>
      </div>
      <section className="mp-page-body">
        {ITEMS.map((item) => (
          <Link key={item.id} href={item.href} className="mp-list-row" style={{ marginBottom: "0.5rem" }}>
            <div style={{ flex: 1 }}>
              <p className="mp-list-row__title">{item.title}</p>
              <p className="mp-list-row__meta">{item.meta}</p>
            </div>
            <span>→</span>
          </Link>
        ))}
        <Link href="/member/mailbox" className="mp-link" style={{ display: "block", marginTop: "1rem" }}>
          Open mailbox →
        </Link>
      </section>
    </MemberShell>
  );
}
