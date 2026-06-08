import { redirect } from "next/navigation";

export default function StartAClubRedirect() {
  redirect("/member/clubs/create");
}
