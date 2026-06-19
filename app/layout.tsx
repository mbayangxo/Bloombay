import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The African Opportunity Engine — Alkebulan United Opportunities",
  description:
    "Discover loans, grants, tenders, contracts, accelerators, and programs built for Africans everywhere. Find exactly what you qualify for.",
  openGraph: {
    title: "The African Opportunity Engine",
    description: "Africa is the opportunity. Find what you qualify for.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#C9A84C",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
