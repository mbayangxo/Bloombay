import { redirect } from "next/navigation";

export default function BulletinRedirect() {
  redirect("/member/room?space=bulletin");
}
