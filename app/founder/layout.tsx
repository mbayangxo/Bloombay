import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BloomBay — Founder",
  robots: { index: false, follow: false },
};

/** Login stays light; Mission Control CSS loads under (portal)/ only. */
export default function FounderRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
