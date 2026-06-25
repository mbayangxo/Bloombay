import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/auth/get-user";

// GET /api/admin/verification-photo?userId=<uuid>
// Returns a 1-hour signed URL for a member's verification selfie.
// Admin/founder only. Verification bucket is private — no public URL exists.
export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createAdminClient();

  const { data: actor } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!actor || !["admin", "founder"].includes(actor.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const { data: target } = await db
    .from("profiles")
    .select("verification_photo_url")
    .eq("id", userId)
    .single();

  if (!target?.verification_photo_url) {
    return NextResponse.json({ error: "No verification photo on file" }, { status: 404 });
  }

  const { data: signed, error } = await db.storage
    .from("verification")
    .createSignedUrl(target.verification_photo_url, 3600);

  if (error || !signed) {
    return NextResponse.json({ error: "Could not generate signed URL" }, { status: 500 });
  }

  return NextResponse.json({ url: signed.signedUrl, expiresIn: 3600 });
}
