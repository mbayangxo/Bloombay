import { NextResponse } from "next/server";
import { requireFounderOrAdmin } from "@/lib/auth/require-founder-admin";
import {
  fetchFounderSafetySnapshot,
  updateSafetyReportStatus,
} from "@/lib/founder/safety-ops";

export async function GET() {
  const gate = await requireFounderOrAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: 403 });
  }

  try {
    const snapshot = await fetchFounderSafetySnapshot();
    return NextResponse.json(snapshot);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load safety data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const gate = await requireFounderOrAdmin();
  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: gate.error }, { status: 403 });
  }

  let body: { id?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const status = body.status as "open" | "reviewed" | "closed" | undefined;
  if (!body.id || !status || !["open", "reviewed", "closed"].includes(status)) {
    return NextResponse.json({ ok: false, error: "id and valid status required" }, { status: 400 });
  }

  try {
    await updateSafetyReportStatus(body.id, status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
