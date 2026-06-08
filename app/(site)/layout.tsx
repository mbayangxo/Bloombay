import { Caveat, Jost, Playfair_Display } from "next/font/google";
import "@/app/styles/marketing-bundle.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

/** Landing / waitlist only — keeps ~250KB marketing CSS off portal routes. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${playfair.variable} ${jost.variable} ${caveat.variable} h-full overflow-hidden antialiased`}
      style={{ fontFamily: "var(--font-jost), system-ui, sans-serif" }}
    >
      {children}
    </div>
  );
}
