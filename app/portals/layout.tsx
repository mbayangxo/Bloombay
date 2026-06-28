import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BloomBay — Portals",
  description: "Choose your BloomBay portal — Member, Club Mama, Host, or Founder.",
};

export default function PortalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
