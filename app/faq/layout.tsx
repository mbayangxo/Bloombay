import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — BloomBay",
  description: "Frequently asked questions about BloomBay — a social world for women in New York City.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
