"use client";

import { use } from "react";
import Link from "next/link";
import { ClubOwnerShell } from "../../components/club-owner-shell";
import { QrDisplay } from "@/app/member/components/qr-display";
import { DEMO_HOST_EVENTS } from "@/lib/qr-codes";

export default function ClubOwnerEventQrPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const ev = DEMO_HOST_EVENTS.find((e) => e.id === id) ?? DEMO_HOST_EVENTS[0];

  return (
    <ClubOwnerShell title={ev.title} backHref="/club-owner/dashboard">
      <Link href="/club-owner/events" className="co-link">
        ← All event QR codes
      </Link>
      <h1 style={{ fontSize: "1.35rem", margin: "1rem 0 0.25rem" }}>{ev.title}</h1>
      <p style={{ color: "rgba(0,0,0,0.5)", margin: "0 0 1.5rem" }}>{ev.date}</p>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <QrDisplay
          payload={{ kind: "host_event", id: ev.id, label: ev.title }}
          size={220}
          caption="Host gathering QR — post at venue"
        />
        <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(0,0,0,0.5)", textAlign: "center", maxWidth: 360 }}>
          This identifies the event. Use <strong>Scan check-in</strong> and scan each member&apos;s event QR from her profile.
        </p>
        <Link href="/club-owner/scan" className="mp-btn mp-btn--hot" style={{ marginTop: "0.5rem" }}>
          Open scanner
        </Link>
      </div>
    </ClubOwnerShell>
  );
}
