import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BloomBay — Clubhouse Login",
  robots: { index: false, follow: false },
};

/** Login only — no clubhouse app chrome. */
export default function ClubOwnerLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
