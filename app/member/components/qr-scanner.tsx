"use client";

import { useState } from "react";
import { decodeQrPayload, type QrPayload } from "@/lib/qr-codes";

export function QrScanner({
  title,
  hint,
  onScan,
}: {
  title: string;
  hint: string;
  onScan: (payload: QrPayload) => void;
}) {
  const [manual, setManual] = useState("");
  const [error, setError] = useState("");

  function submitManual() {
    setError("");
    const payload = decodeQrPayload(manual);
    if (!payload) {
      setError("That code didn't read. Paste a full BloomBay QR link.");
      return;
    }
    onScan(payload);
  }

  return (
    <div className="mp-scanner">
      <div className="mp-scanner__viewport" aria-hidden>
        <div className="mp-scanner__corners" />
        <p className="mp-scanner__hint">Point your camera at a BloomBay QR</p>
        <p className="mp-scanner__note">
          Camera scanning ships with the native app — use demo codes below on web.
        </p>
      </div>

      <div className="mp-scanner__demo">
        <p className="mp-scanner__title">{title}</p>
        <p className="mp-scanner__sub">{hint}</p>
        <label className="mp-scanner__label">
          Paste QR payload (demo)
          <textarea
            className="mp-input"
            rows={3}
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="bloombay://?k=member_bloomie&id=..."
          />
        </label>
        {error ? <p className="mp-scanner__error">{error}</p> : null}
        <button type="button" className="mp-btn mp-btn--hot mp-btn--block" onClick={submitManual}>
          Confirm scan
        </button>
      </div>
    </div>
  );
}
