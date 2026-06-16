import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    contact_name: string;
    email: string;
    group_name: string;
    platform: string;
    group_size: string;
    cities: string;
    description: string;
    why_partner: string;
  };

  if (!body.email?.trim() || !body.group_name?.trim() || !body.contact_name?.trim()) {
    return NextResponse.json({ error: "Name, email and group name are required" }, { status: 400 });
  }

  const supabase = admin();
  const { error } = await supabase.from("girlmate_partner_applications").insert({
    contact_name: body.contact_name.trim(),
    email:        body.email.trim().toLowerCase(),
    group_name:   body.group_name.trim(),
    platform:     body.platform ?? "other",
    group_size:   body.group_size ?? "",
    cities:       body.cities ?? "",
    description:  body.description ?? "",
    why_partner:  body.why_partner ?? "",
    status:       "pending",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  // Public email lookup — used by the partner dashboard to check approval status
  if (email) {
    const supabase = admin();
    const { data, error } = await supabase
      .from("girlmate_partner_applications")
      .select("id,contact_name,email,group_name,platform,group_size,cities,status,partner_code")
      .eq("email", email.trim().toLowerCase())
      .order("submitted_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
  }

  // Admin-only: full list
  const secret = req.headers.get("x-admin-password");
  if (secret !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = admin();
  const { data, error } = await supabase
    .from("girlmate_partner_applications")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
