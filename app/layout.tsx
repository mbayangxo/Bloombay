import type { Metadata } from "next";
import { Caveat, Instrument_Serif, Jost, Playfair_Display } from "next/font/google";
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

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
      className={`${playfair.variable} ${jost.variable} ${caveat.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full text-bb-black" style={{ background: "#F6F1EB" }}>
        {children}
      </body>
    </html>
  );
}
