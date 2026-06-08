import { redirect } from "next/navigation";
import { COMPANY_LOGIN } from "@/lib/auth/roles";

/** Curators use the shared company sign-in at /company */
export default async function CuratorLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  if (next) {
    redirect(`${COMPANY_LOGIN}?next=${encodeURIComponent(next)}`);
  }
  redirect(COMPANY_LOGIN);
}
