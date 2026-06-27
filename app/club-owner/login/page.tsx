import { redirect } from "next/navigation";

/** Legacy URL — canonical Club Mama login is /club-mama/login */
export default function ClubOwnerLoginRedirect() {
  redirect("/club-mama/login");
}
