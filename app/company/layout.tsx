import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BloomBay — Company sign-in",
  robots: { index: false, follow: false },
};

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
