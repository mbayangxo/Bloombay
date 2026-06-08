"use client";

import { QRCodeSVG } from "qrcode.react";
import { encodeQrPayload, type QrPayload } from "@/lib/qr-codes";

export function QrDisplay({
  payload,
  size = 180,
  caption,
}: {
  payload: QrPayload;
  size?: number;
  caption?: string;
}) {
  const value = encodeQrPayload(payload);

  return (
    <div className="mp-qr-display">
      <div className="mp-qr-display__frame">
        <QRCodeSVG
          value={value}
          size={size}
          level="M"
          bgColor="#ffffff"
          fgColor="#121212"
          marginSize={2}
        />
      </div>
      {caption ? <p className="mp-qr-display__caption">{caption}</p> : null}
      <p className="mp-qr-display__id">{payload.id}</p>
    </div>
  );
}
