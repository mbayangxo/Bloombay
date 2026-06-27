import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BloomBay — Club Mama Login",
  robots: { index: false, follow: false },
};

export default function ClubMamaLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
