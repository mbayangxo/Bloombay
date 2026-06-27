import { redirect } from "next/navigation";

/** Host login — members with host access; lands on /member/host after auth. */
export default async function HostLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const next = params.redirect ?? "/member/host";
  redirect(`/member/login?redirect=${encodeURIComponent(next)}`);
}
