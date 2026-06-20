import type { Metadata } from "next";
import { Unbounded, Outfit } from "next/font/google";
import "@/app/styles/partner-portal.css";
import "@/app/styles/partner-brand.css";

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
  title: "BloomBay — Partner",
  description: "Venue partner portal — bookings and revenue. Not the Clubhouse (club host) portal.",
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${unbounded.variable} ${outfit.variable} pp-root antialiased`}
      style={{ fontFamily: "var(--font-outfit), system-ui, sans-serif", minHeight: "100dvh" }}
    >
      {children}
    </div>
  );
}
