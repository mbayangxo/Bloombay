import type { Metadata } from "next";
import { Unbounded, Outfit } from "next/font/google";
import "@/app/styles/bloom-brand.css";
import "@/app/styles/club-owner-portal.css";
import "@/app/styles/bb-club-owner-atmosphere.css";
import "@/app/styles/club-operations.css";
import "@/app/styles/crest.css";

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
  title: "BloomBay — Clubhouse",
  description: "Club host portal — women, open seats, gatherings. Not the Partner (venue) portal.",
};

export default function ClubOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${unbounded.variable} ${outfit.variable} antialiased`}
      style={{ fontFamily: "var(--font-outfit), system-ui, sans-serif", minHeight: "100dvh" }}
    >
      {children}
    </div>
  );
}
