import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BloomBay — Portals",
  description: "Choose your BloomBay portal — member, founder, club owner, partner.",
};

export default function PortalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
