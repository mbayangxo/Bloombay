import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json() as {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    pinterest?: string;
    spotify?: string;
    website?: string;
    show_socials?: boolean;
  };

  const { error } = await supabase
    .from("profiles")
    .update({
      instagram:    body.instagram    ?? null,
      tiktok:       body.tiktok       ?? null,
      twitter:      body.twitter      ?? null,
      pinterest:    body.pinterest    ?? null,
      spotify:      body.spotify      ?? null,
      website:      body.website      ?? null,
      show_socials: body.show_socials ?? false,
    })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
