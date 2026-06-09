import { redirect } from "next/navigation";

/** V1 — Connect / introductions not in launch. */
export default function MatchPage() {
  redirect("/member/home");
}
