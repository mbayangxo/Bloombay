import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";

/** TEMPORARY — delete after auth diagnosis. No secrets returned. */
export async function GET(request: Request) {
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const store = await cookies();
  const fromHeaders = store.getAll().map((c) => ({
    name: c.name,
    valueLength: c.value.length,
  }));

  const req = request as Request & { cookies?: { getAll: () => { name: string; value: string }[] } };
  const fromRequest =
    typeof req.cookies?.getAll === "function"
      ? req.cookies.getAll().map((c) => ({ name: c.name, valueLength: c.value.length }))
      : [];

  const supabaseServer = await createClient();
  const { data: userFromServer } = await supabaseServer.auth.getUser();

  let userFromRequest: string | null = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabaseReq = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            const header = request.headers.get("cookie") ?? "";
            return header
              .split(";")
              .map((part) => part.trim())
              .filter(Boolean)
              .map((part) => {
                const i = part.indexOf("=");
                return i > 0
                  ? { name: part.slice(0, i), value: part.slice(i + 1) }
                  : { name: part, value: "" };
              });
          },
          setAll() {},
        },
      },
    );
    const { data } = await supabaseReq.auth.getUser();
    userFromRequest = data.user?.id ?? null;
  }

  return NextResponse.json({
    cookieHeaderLength: (request.headers.get("cookie") ?? "").length,
    fromNextHeaders: fromHeaders,
    fromRequestCookies: fromRequest,
    userFromServerClient: userFromServer.user?.id ?? null,
    userFromRequestHeaderParse: userFromRequest,
    anonKeyLength: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").length,
    anonKeyStartsWithEyJ: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").startsWith("eyJ"),
  });
}
