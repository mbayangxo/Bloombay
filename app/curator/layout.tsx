import type { Metadata } from "next";
import { Unbounded, Outfit } from "next/font/google";
import "@/app/styles/curator-portal.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BloomBay — Curator",
  description: "Curator portal — gatherings, women, culture in the field.",
};

export default function CuratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${unbounded.variable} ${outfit.variable} cu-root`}
      style={{ fontFamily: "var(--font-outfit), system-ui, sans-serif", minHeight: "100dvh" }}
    >
      {children}
    </div>
  );
}
