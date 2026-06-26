import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** GET /api/member/resolve-user?username= — map email-prefix handle to member id */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const username = req.nextUrl.searchParams.get("username")?.trim().replace(/^@/, "");
  if (!username || username.length > 100) {
    return NextResponse.json({ error: "username required" }, { status: 400 });
  }

  const uuidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRe.test(username)) {
    return NextResponse.json({ id: username, username });
  }

  const admin = createAdminClient();
  const { data: listData } = await admin.auth.admin.listUsers({ perPage: 500 });
  const authUser = (listData?.users ?? []).find(
    (u) => u.email?.split("@")[0] === username,
  );

  if (!authUser) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("id", authUser.id)
    .maybeSingle();

  if (!profile?.id) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({ id: authUser.id, username });
}
