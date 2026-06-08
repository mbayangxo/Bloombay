"use client";

import Link from "next/link";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { DEMO_HOST_EVENTS } from "@/lib/qr-codes";

export default function ClubOwnerEventsPage() {
  return (
    <ClubOwnerShell title="Events" backHref="/club-owner/dashboard">
      <header className="co-page-head">
        <h1 className="co-page-head__title">Event QR codes</h1>
        <p className="co-page-head__sub">
          Display or print this QR at the door. Scan each woman&apos;s personal event check-in QR from her BloomBay account.
        </p>
      </header>

      <div className="co-grid co-grid--2">
        {DEMO_HOST_EVENTS.map((ev) => (
          <Link key={ev.id} href={`/club-owner/events/${ev.id}`} className="co-card">
            <strong>{ev.title}</strong>
            <p>{ev.date}</p>
            <span style={{ fontSize: "0.75rem", color: "#ff2d8a", fontWeight: 600 }}>View host QR →</span>
          </Link>
        ))}
      </div>
    </ClubOwnerShell>
  );
}
