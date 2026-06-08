import { redirect } from "next/navigation";

export default async function LoginCreateRedirect({
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
  redirect(suffix ? `/company/create?${suffix}` : "/company/create");
}
