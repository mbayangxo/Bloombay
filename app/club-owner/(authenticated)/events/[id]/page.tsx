"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ClubOwnerShell } from "../../components/club-owner-shell";
import { QrDisplay } from "@/app/member/components/qr-display";

type Gathering = {
  id: string;
  title: string;
  starts_at: string;
  venue: string;
  publish_status: string;
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ClubOwnerEventQrPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ev, setEv] = useState<Gathering | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/club-portal/gatherings/${id}`);
      const json = (await res.json().catch(() => ({}))) as {
        gathering?: Gathering;
        error?: string;
      };
      if (!res.ok) {
        setError(json.error ?? "Could not load gathering");
        return;
      }
      setEv(json.gathering ?? null);
    })();
  }, [id]);

  if (error) {
    return (
      <ClubOwnerShell title="Event" backHref="/club-owner/gatherings">
        <p style={{ color: "#c00" }}>{error}</p>
        <Link href="/club-owner/gatherings" className="co-link">
          ← Back to gatherings
        </Link>
      </ClubOwnerShell>
    );
  }

  if (!ev) {
    return (
      <ClubOwnerShell title="Event" backHref="/club-owner/gatherings">
        <p className="co-hint">Loading…</p>
      </ClubOwnerShell>
    );
  }

  return (
    <ClubOwnerShell title={ev.title} backHref="/club-owner/gatherings">
      <Link href="/club-owner/gatherings" className="co-link">
        ← All gatherings
      </Link>
      <h1 style={{ fontSize: "1.35rem", margin: "1rem 0 0.25rem" }}>{ev.title}</h1>
      <p style={{ color: "rgba(0,0,0,0.5)", margin: "0 0 1.5rem" }}>
        {fmtDate(ev.starts_at)}
        {ev.venue ? ` · ${ev.venue}` : ""}
        {ev.publish_status === "live" ? " · live" : ` · ${ev.publish_status}`}
      </p>

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
