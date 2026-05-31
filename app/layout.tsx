import type { Metadata } from "next";
import { Caveat, Jost, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "BloomBay — Where you bloom.",
  description:
    "BloomBay is a social world for women — friends, clubs, gatherings, and real-life connection. Join the waitlist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jost.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-bb-black">
        {children}
      </body>
    </html>
  );
}
