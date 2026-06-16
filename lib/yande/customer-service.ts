"use server";

import { createClient } from "@supabase/supabase-js";
import { logAction } from "./core";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const FAQ_CONTEXT = `
BloomBay is a women-only community platform in New York City.
Key facts:
- Membership: Apply through the app; approved by BloomBay team
- Events (Happenings): Browse and RSVP through the app
- Clubs: Join or host clubs for ongoing community
- GirlMate: Roommate matching feature
- Plans: Group coordination and social planning
- Founding Mothers: First 100 members, special badge and access
- Support email: hello@bloombay.co
- Cancellation/refunds: Contact support within 24h of event
- Privacy: All profiles are private to members only
- Safety: Report any concerns via the app's report feature
`.trim();

export async function answerSupportTicket(ticketId: string): Promise<{ ok: boolean; needs_human: boolean }> {
  const supabase = admin();
  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("id", ticketId)
    .single();

  if (!ticket) return { ok: false, needs_human: true };

  if (!process.env.ANTHROPIC_API_KEY) {
    await supabase.from("support_tickets").update({ needs_human: true, status: "in_progress" }).eq("id", ticketId);
    return { ok: true, needs_human: true };
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: `You are Yande, BloomBay's customer service agent. You're warm, helpful, and concise.
Answer the member's question using the FAQ context below.
If you can fully answer: respond helpfully in 2-3 sentences.
If the question requires human action (billing dispute, account ban, refund > $50, safety):
  respond with NEEDS_HUMAN: [brief explanation of why]

BloomBay FAQ:
${FAQ_CONTEXT}`,
      messages: [{ role: "user", content: `Subject: ${ticket.subject}\nMessage: ${ticket.message}` }],
    }),
  });

  if (!res.ok) {
    await supabase.from("support_tickets").update({ needs_human: true }).eq("id", ticketId);
    return { ok: false, needs_human: true };
  }

  const d = await res.json() as { content: { text: string }[] };
  const text = d.content[0]?.text?.trim() ?? "";
  const needsHuman = text.startsWith("NEEDS_HUMAN:");

  const responseText = needsHuman
    ? "We're connecting you with a human team member who can help with this. Expect a response within 24 hours. — Yande ✦"
    : `${text}\n\n— Yande ✦`;

  await supabase.from("support_tickets").update({
    yande_response: responseText,
    needs_human: needsHuman,
    status: needsHuman ? "in_progress" : "resolved",
    resolved_at: needsHuman ? null : new Date().toISOString(),
  }).eq("id", ticketId);

  // Send notification to member
  await supabase.from("notifications").insert({
    user_id: ticket.user_id,
    type: "support",
    title: needsHuman ? "We're looking into this ✦" : "Response from Yande ✦",
    body: responseText.slice(0, 120),
    link: "/member/you",
    data: { ticket_id: ticketId },
  });

  await logAction({
    agent: "yande-customer-service",
    action_type: "answer_ticket",
    risk_level: "low",
    target_user_id: ticket.user_id as string,
    metadata: { ticket_id: ticketId, category: ticket.category, needs_human: needsHuman },
  }, "completed");

  return { ok: true, needs_human: needsHuman };
}

export async function submitSupportTicket(userId: string, subject: string, message: string, category = "general"): Promise<{ ok: boolean; ticket_id?: string }> {
  const supabase = admin();
  const { data, error } = await supabase.from("support_tickets").insert({
    user_id: userId,
    subject,
    message,
    category,
  }).select("id").single();

  if (error || !data) return { ok: false };

  // Auto-answer with Yande
  void answerSupportTicket(data.id as string);

  return { ok: true, ticket_id: data.id as string };
}
