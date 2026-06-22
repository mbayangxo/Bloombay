import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/get-user";
import { MyStoryPage } from "@/app/components/portal/my-story-page";

export default async function MyStoryRoute() {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");
  return <MyStoryPage />;
}
