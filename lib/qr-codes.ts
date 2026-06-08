/** BloomBay QR payload helpers — UI prototype (bloombay:// scheme) */

export type QrKind = "member_bloomie" | "member_event" | "host_event";

export type QrPayload = {
  kind: QrKind;
  id: string;
  label?: string;
};

const PREFIX = "bloombay://";

export function encodeQrPayload(payload: QrPayload): string {
  const params = new URLSearchParams({ k: payload.kind, id: payload.id });
  if (payload.label) params.set("l", payload.label);
  return `${PREFIX}?${params.toString()}`;
}

export function decodeQrPayload(raw: string): QrPayload | null {
  try {
    const trimmed = raw.trim();
    if (!trimmed.startsWith(PREFIX)) return null;
    const url = new URL(trimmed.replace(PREFIX, "https://app.bloombay/"));
    const kind = url.searchParams.get("k") as QrKind | null;
    const id = url.searchParams.get("id");
    if (!kind || !id) return null;
    return { kind, id, label: url.searchParams.get("l") ?? undefined };
  } catch {
    return null;
  }
}

export const DEMO_MEMBER_ID = "BB-NYC-8F2K";

export const DEMO_HOST_EVENTS = [
  { id: "ev-soho-524", title: "Saturday in Soho", date: "May 24 · 8:00 PM" },
  { id: "ev-wburg-525", title: "Wine & Girl Talk", date: "May 25 · 7:30 PM" },
];
