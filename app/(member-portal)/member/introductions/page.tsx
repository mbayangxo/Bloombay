import { redirect } from "next/navigation";

/** Legacy fake introductions surface — real match lives at /member/match. */
export default function IntroductionsRedirect() {
  redirect("/member/match");
}
