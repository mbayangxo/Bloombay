import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as adminClient } from "@supabase/supabase-js";
import { unitsForKind, type GiftKind } from "@/lib/bloom-gifts";

function admin() {
  return adminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function isGiftKind(v: unknown): v is GiftKind {
  return v === "flower" || v === "bouquet";
}

async function sumUnits(
  db: ReturnType<typeof admin>,
  refs: {
    fashion_post_id?: string;
    wall_post_id?: string;
    avenue_content_id?: string;
  },
): Promise<number> {
  let rowsQuery = db.from("post_flowers").select("units, gift_kind");
  if (refs.fashion_post_id) rowsQuery = rowsQuery.eq("fashion_post_id", refs.fashion_post_id);
  if (refs.wall_post_id) rowsQuery = rowsQuery.eq("wall_post_id", refs.wall_post_id);
  if (refs.avenue_content_id) rowsQuery = rowsQuery.eq("avenue_content_id", refs.avenue_content_id);
  const { data: rows } = await rowsQuery;
  return ((rows ?? []) as { units?: number; gift_kind?: string }[]).reduce(
    (sum, r) => sum + (r.units ?? (r.gift_kind === "bouquet" ? 12 : 1)),
    0,
  );
}

// POST /api/flowers — flower (1) or bouquet (12) on Avenue / Closet posts
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { fashion_post_id, wall_post_id, avenue_content_id } = body as {
    fashion_post_id?: string;
    wall_post_id?: string;
    avenue_content_id?: string;
    kind?: string;
    take_back?: boolean;
  };
  const kind: GiftKind = isGiftKind(body.kind) ? body.kind : "flower";
  const takeBack = body.take_back === true;

  if (!fashion_post_id && !wall_post_id && !avenue_content_id) {
    return NextResponse.json({ error: "Missing post reference" }, { status: 400 });
  }

  const db = admin();
  const filter: Record<string, string> = { user_id: user.id };
  if (fashion_post_id) filter.fashion_post_id = fashion_post_id;
  if (wall_post_id) filter.wall_post_id = wall_post_id;
  if (avenue_content_id) filter.avenue_content_id = avenue_content_id;

  const { data: existing } = await db
    .from("post_flowers")
    .select("id, gift_kind")
    .match(filter)
    .maybeSingle();

  let gave = false;
  let resultKind: GiftKind | null = null;
  let resultUnits = 0;

  if (takeBack) {
    if (existing) await db.from("post_flowers").delete().eq("id", existing.id);
  } else if (existing) {
    if ((existing as { gift_kind?: string }).gift_kind === kind) {
      await db.from("post_flowers").delete().eq("id", existing.id);
    } else {
      const units = unitsForKind(kind);
      await db.from("post_flowers").update({ gift_kind: kind, units }).eq("id", existing.id);
      gave = true;
      resultKind = kind;
      resultUnits = units;
    }
  } else {
    const units = unitsForKind(kind);
    await db.from("post_flowers").insert({
      user_id: user.id,
      fashion_post_id: fashion_post_id ?? null,
      wall_post_id: wall_post_id ?? null,
      avenue_content_id: avenue_content_id ?? null,
      gift_kind: kind,
      units,
    });
    gave = true;
    resultKind = kind;
    resultUnits = units;
  }

  const refs = { fashion_post_id, wall_post_id, avenue_content_id };
  const count = await sumUnits(db, refs);

  if (wall_post_id) {
    await db.from("wall_posts").update({ blooms: count }).eq("id", wall_post_id);
  }

  return NextResponse.json({ ok: true, gave, kind: resultKind, units: resultUnits, count });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const wall_post_id = req.nextUrl.searchParams.get("wall_post_id") ?? undefined;
  const fashion_post_id = req.nextUrl.searchParams.get("fashion_post_id") ?? undefined;
  const avenue_content_id = req.nextUrl.searchParams.get("avenue_content_id") ?? undefined;
  if (!wall_post_id && !fashion_post_id && !avenue_content_id) {
    return NextResponse.json({ error: "Missing post reference" }, { status: 400 });
  }

  const db = admin();
  let rowsQuery = db.from("post_flowers").select("user_id, gift_kind, units");
  if (fashion_post_id) rowsQuery = rowsQuery.eq("fashion_post_id", fashion_post_id);
  if (wall_post_id) rowsQuery = rowsQuery.eq("wall_post_id", wall_post_id);
  if (avenue_content_id) rowsQuery = rowsQuery.eq("avenue_content_id", avenue_content_id);

  const { data: rows } = await rowsQuery;
  const list = (rows ?? []) as { user_id: string; gift_kind?: string; units?: number }[];
  const units = list.reduce(
    (sum, r) => sum + (r.units ?? (r.gift_kind === "bouquet" ? 12 : 1)),
    0,
  );
  const mine = user ? list.find((r) => r.user_id === user.id) : null;
  const myKind: GiftKind | null =
    mine?.gift_kind === "bouquet" ? "bouquet" : mine ? "flower" : null;

  return NextResponse.json({ units, count: units, myKind, gave: !!mine });
}
