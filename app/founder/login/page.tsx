import { redirectToCompanyLogin } from "@/lib/auth/legacy-login-redirect";

export default async function FounderLoginRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  redirectToCompanyLogin(await searchParams);
}
