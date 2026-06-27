import { NextResponse } from "next/server";

/** TEMPORARY — delete after Preview env diagnosis. Never returns secret values. */
export async function GET() {
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  let supabaseUrlHost = "";
  try {
    supabaseUrlHost = url ? new URL(url).hostname : "";
  } catch {
    supabaseUrlHost = "(invalid url)";
  }

  const anonPrefix = anon.slice(0, 20);
  const servicePrefix = service.slice(0, 20);

  return NextResponse.json({
    hasSupabaseUrl: Boolean(url.trim()),
    supabaseUrlHost,
    hasAnonKey: Boolean(anon.trim()),
    anonKeyStartsWithEyJ: anon.startsWith("eyJ"),
    anonKeyLength: anon.length,
    hasServiceRoleKey: Boolean(service.trim()),
    serviceRoleStartsWithEyJ: service.startsWith("eyJ"),
    serviceRoleLength: service.length,
    serviceRoleLooksLikeAnon:
      Boolean(anon && service) && anonPrefix === servicePrefix,
    nodeEnv: process.env.NODE_ENV ?? null,
    vercelEnv: process.env.VERCEL_ENV ?? null,
  });
}
