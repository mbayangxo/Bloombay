import type { Metadata } from "next";
import { CompanyPortalLogin } from "@/app/components/auth/company-portal-login";

export const metadata: Metadata = {
  title: "Company Sign-In — BloomBay",
  description: "Sign in to the BloomBay staff and partner portal.",
};

export default function CompanyPortalPage() {
  return <CompanyPortalLogin />;
}
