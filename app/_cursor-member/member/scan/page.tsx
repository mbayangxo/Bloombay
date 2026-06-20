"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MemberShell } from "../components/member-shell";
import { QrScanner } from "../components/qr-scanner";
import { decodeQrPayload, encodeQrPayload, type QrPayload } from "@/lib/qr-codes";

export default function ScanBloomiePage() {
  const router = useRouter();
  const [success, setSuccess] = useState<string | null>(null);

  function handleScan(payload: QrPayload) {
    if (payload.kind !== "member_bloomie") {
      setSuccess(null);
      alert("This QR is for event check-in. Hosts use that at the door.");
      return;
    }
    const name = payload.label ?? payload.id;
    setSuccess(`You're now Bloomies with ${name}.`);
    setTimeout(() => router.push("/member/bloomies"), 1500);
  }

  const demoPayload = encodeQrPayload({
    kind: "member_bloomie",
    id: "BB-DEMO-PRIYA",
    label: "Priya L.",
  });

  return (
    <MemberShell backHref="/member/profile" backLabel="Profile" showNav={false}>
      <div className="mp-hero">
        <h1 className="mp-hero__title">Scan a Bloomie</h1>
        <p className="mp-hero__sub">Met her IRL? Scan her QR to connect as Bloomies.</p>
      </div>

      {success ? (
        <div className="mp-tier-card mp-card--pink" style={{ margin: "1rem 1.25rem", color: "#fff" }}>
          <p style={{ margin: 0, fontWeight: 700 }}>{success}</p>
        </div>
      ) : null}

      <QrScanner
        title="Add a Bloomie"
        hint="Friends on BloomBay — scan when you meet."
        onScan={handleScan}
      />

      <div className="mp-section">
        <button
          type="button"
          className="mp-btn mp-btn--outline mp-btn--block"
          onClick={() => {
            const payload = decodeQrPayload(demoPayload);
            if (payload) handleScan(payload);
          }}
        >
          Try demo scan (Priya)
        </button>
      </div>
    </MemberShell>
  );
}
