import { redirect } from "next/navigation";

/** Legacy URL — company portal moved to /company */
export default async function LoginRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(q)) {
    if (typeof value === "string") params.set(key, value);
  }
  const suffix = params.toString();
  redirect(suffix ? `/company?${suffix}` : "/company");
}
