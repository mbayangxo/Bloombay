import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";

export default async function FounderDashboardPage() {
  const user = await getAuthUser();
  if (!user || user.role !== "founder") {
    redirect("/founder/login");
  }
  redirect("/admin/dashboard");
}
