import { NextResponse, type NextRequest } from "next/server";
import { generateCreateContent, type GenerateInput } from "@/lib/founder-create-space/generate-content";
import { requireFounderQaAccess } from "@/lib/founder-qa-auth";

export async function POST(request: NextRequest) {
  const guard = await requireFounderQaAccess(request);
  if (guard.error) return guard.error;

  const body = (await request.json().catch(() => ({}))) as GenerateInput;
  if (!body.kind) {
    return NextResponse.json({ error: "kind required" }, { status: 400 });
  }

  const result = generateCreateContent(body);
  return NextResponse.json({ ok: true, ...result });
}
