import { redirect } from "next/navigation";

/** Celebrate lives in Invitations as Confetti — not a separate SaaS tab. */
export default function CelebrateRedirect() {
  redirect("/member/happenings?tab=invitations#confetti");
}
