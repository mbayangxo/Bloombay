import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Instrument_Serif, Jost, Playfair_Display } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "./components/pwa-register";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Editorial display serif — high contrast, fashion-magazine feel
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BloomBay",
  },
  icons: {
    apple: "/icons/icon-192.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF1F7D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${fraunces.variable} ${jost.variable} ${caveat.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full text-bb-black" style={{ background: "#F6F1EB" }}>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
