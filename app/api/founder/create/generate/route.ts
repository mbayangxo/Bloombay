import { NextResponse, type NextRequest } from "next/server";
import { generateCreateContent, type GenerateInput } from "@/lib/founder-create-space/generate-content";
import { isFounderQaAuthorized } from "@/lib/founder-qa-auth";

export async function POST(request: NextRequest) {
  if (!isFounderQaAuthorized(request)) {
    return NextResponse.json({ error: "Founder access required" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as GenerateInput;
  if (!body.kind) {
    return NextResponse.json({ error: "kind required" }, { status: 400 });
  }

  const result = generateCreateContent(body);
  return NextResponse.json({ ok: true, ...result });
}
