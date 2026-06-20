import { redirect } from "next/navigation";
import { COMPANY_LOGIN, MEMBER_LOGIN } from "@/lib/auth/roles";

export function redirectToCompanyLogin(
  searchParams: Record<string, string | string[] | undefined>
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") params.set(key, value);
  }
  const q = params.toString();
  redirect(q ? `${COMPANY_LOGIN}?${q}` : COMPANY_LOGIN);
}

/** Legacy /member/login used to point at company — keep member entry separate. */
export function redirectToMemberLogin(
  searchParams: Record<string, string | string[] | undefined>
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") params.set(key, value);
  }
  const q = params.toString();
  redirect(q ? `${MEMBER_LOGIN}?${q}` : MEMBER_LOGIN);
}
