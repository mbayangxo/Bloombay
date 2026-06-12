import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createClient } from "@/lib/supabase/server";

function verifyWhopSignature(body: string, header: string | null, secret: string): boolean {
  if (!header || !secret) return false;
  // Whop sends: "sha256=<hex_digest>"
  const [, receivedDigest] = header.split("=");
  if (!receivedDigest) return false;
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(receivedDigest, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("x-whop-signature-256");
  const secret = process.env.WHOP_WEBHOOK_SECRET ?? "";

  if (!verifyWhopSignature(body, sig, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body) as { action: string; data: Record<string, unknown> };

  if (event.action === "payment.succeeded") {
    const payment = event.data as {
      checkout_session?: { metadata?: { club_id?: string; user_id?: string } };
      user_id?: string;
    };

    const meta = payment.checkout_session?.metadata ?? {};
    const club_id = meta.club_id;
    const user_id = meta.user_id ?? payment.user_id;

    if (club_id && user_id) {
      const supabase = await createClient();

      const { data: club } = await supabase
        .from("clubs")
        .select("slug")
        .eq("id", club_id)
        .single();

      const clubSlug = (club as { slug: string | null } | null)?.slug ?? club_id;

      await supabase.from("club_memberships").upsert({
        user_id,
        club_slug: clubSlug,
        club_id,
        joined_at: new Date().toISOString(),
      }, { onConflict: "user_id,club_slug" });

      await supabase
        .from("club_applications")
        .update({ status: "accepted" })
        .eq("club_id", club_id)
        .eq("user_id", user_id)
        .eq("status", "pending");

      await supabase.from("notifications").insert({
        user_id,
        type: "club_accepted",
        title: "Payment confirmed — you're in!",
        body: `Your membership was confirmed. Welcome.`,
        link: `/member/clubs/${clubSlug}`,
        data: { club_id },
      });
    }
  }

  return NextResponse.json({ received: true });
}
