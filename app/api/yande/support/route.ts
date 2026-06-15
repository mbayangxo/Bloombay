import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submitSupportTicket } from "@/lib/yande/customer-service";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { subject?: string; message?: string; category?: string };
  const { subject, message, category } = body;

  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
  }

  const result = await submitSupportTicket(user.id, subject.trim(), message.trim(), category ?? "general");
  return NextResponse.json(result);
}
