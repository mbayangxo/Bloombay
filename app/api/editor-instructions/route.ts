import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// GET /api/editor-instructions?editor=magazine
export async function GET(req: NextRequest) {
  const editor = req.nextUrl.searchParams.get("editor");
  if (!editor) return NextResponse.json({ error: "Missing editor param" }, { status: 400 });

  const { data, error } = await admin()
    .from("editor_instructions")
    .select("*")
    .eq("editor_name", editor)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/editor-instructions
export async function POST(req: NextRequest) {
  const body = await req.json() as {
    editor_name: string;
    instruction_type: string;
    instruction: string;
    reference_title?: string;
    original_content?: string;
    edited_content?: string;
  };

  const { error } = await admin().from("editor_instructions").insert({
    editor_name: body.editor_name,
    instruction_type: body.instruction_type,
    instruction: body.instruction,
    reference_title: body.reference_title ?? null,
    original_content: body.original_content ?? null,
    edited_content: body.edited_content ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
