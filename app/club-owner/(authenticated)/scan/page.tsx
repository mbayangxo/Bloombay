"use client";

import { useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { QrScanner } from "@/app/member/components/qr-scanner";
import { decodeQrPayload, encodeQrPayload, DEMO_MEMBER_ID, type QrPayload } from "@/lib/qr-codes";
import { getHostClubId } from "@/lib/club-host-store";
import { recordCheckIn } from "@/lib/club-owner-store";

export default function ClubOwnerScanPage() {
  const [checkedIn, setCheckedIn] = useState<string[]>([]);

  const clubId = getHostClubId();

  function handleScan(payload: QrPayload) {
    if (payload.kind !== "member_event") {
      alert("Scan a member's event check-in QR (from her BloomBay profile).");
      return;
    }
    setCheckedIn((prev) => (prev.includes(payload.id) ? prev : [...prev, payload.id]));
    recordCheckIn(clubId, {
      eventId: payload.id,
      eventTitle: payload.label ?? "Gathering",
      memberId: payload.id,
      memberName: payload.label ?? "Member",
    });
  }

  const demoMember = encodeQrPayload({ kind: "member_event", id: DEMO_MEMBER_ID, label: "Maya" });

  return (
    <ClubOwnerShell title="Scan" backHref="/club-owner/dashboard">
      <header className="co-page-head">
        <h1 className="co-page-head__title">Scan check-in</h1>
        <p className="co-page-head__sub">
          Scan each woman&apos;s <strong>event QR</strong> from Profile → QR codes → Event check-in.
        </p>
      </header>

      {checkedIn.length > 0 ? (
        <div className="co-card" style={{ marginBottom: "1rem", borderColor: "#ff2d8a" }}>
          <strong>{checkedIn.length} checked in</strong>
          <p style={{ marginTop: "0.35rem" }}>{checkedIn.join(", ")}</p>
        </div>
      ) : null}

      <QrScanner
        title="Member check-in"
        hint="Validates her BloomBay account for this gathering."
        onScan={handleScan}
      />

      <button
        type="button"
        className="mp-btn mp-btn--outline mp-btn--block"
        style={{ margin: "1rem 0 0" }}
        onClick={() => {
          const p = decodeQrPayload(demoMember);
          if (p) handleScan(p);
        }}
      >
        Demo check-in (Maya)
      </button>
    </ClubOwnerShell>
  );
}
