import Link from "next/link";
import { BBLogo } from "./portal/bb-logo";

const NAV_COLS = [
  {
    title: "ABOUT",
    links: [
      { label: "Our Story",   href: "/about" },
      { label: "Safety",      href: "/safety" },
      { label: "Careers",     href: "/careers" },
      { label: "Press",       href: "/press" },
    ],
  },
  {
    title: "COMMUNITY",
    links: [
      { label: "BloomBay Mag", href: "/magazine" },
      { label: "Events",       href: "/events" },
      { label: "BloomBay IRL", href: "/irl" },
    ],
  },
  {
    title: "CLUB OWNERS",
    links: [
      { label: "Start a Club",    href: "/start-a-club" },
      { label: "Host Resources",  href: "/host-resources" },
    ],
  },
  {
    title: "PARTNERS",
    links: [
      { label: "Partner With Us",  href: "/partner" },
      { label: "Venue Directory",  href: "/venues" },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { label: "Help Center",  href: "/help" },
      { label: "Contact Us",   href: "/contact" },
      { label: "FAQ",          href: "/faq" },
    ],
  },
];

function MarketingFooter() {
  return (
    <footer style={{ background: "#FDF8F2", borderTop: "1px solid #ecddd4" }}>
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">

        {/* Brand + social row */}
        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-16 pb-14"
          style={{ borderBottom: "1px solid #ecddd4" }}
        >
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <BBLogo size={40} />
              <span className="font-bold text-2xl tracking-[0.18em]" style={{ color: "#111111" }}>BLOOMBAY</span>
            </div>
            <p
              className="text-base leading-relaxed mb-2"
              style={{ color: "#888", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
            >
              A world built for women.
            </p>
            <p className="text-sm" style={{ color: "#bbb" }}>New York City · Est. 2025</p>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-6">
            {/* Instagram */}
            <a
              href="https://instagram.com/bloombaynyc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all group-hover:scale-105"
                style={{ background: "#FFE0EE" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4.5" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="#FF1F7D" stroke="none" />
                </svg>
              </div>
              <span className="text-xs font-medium" style={{ color: "#999" }}>Instagram</span>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com/@bloombay"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all group-hover:scale-105"
                style={{ background: "#FFE0EE" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF1F7D">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.18 8.18 0 004.78 1.52V6.81a4.85 4.85 0 01-1.01-.12z" />
                </svg>
              </div>
              <span className="text-xs font-medium" style={{ color: "#999" }}>TikTok</span>
            </a>

            {/* Pinterest */}
            <a
              href="https://pinterest.com/bloombay"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all group-hover:scale-105"
                style={{ background: "#FFE0EE" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF1F7D">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium" style={{ color: "#999" }}>Pinterest</span>
            </a>
          </div>
        </div>

        {/* Nav columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10 mb-16">
          {NAV_COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold tracking-[0.18em] mb-5" style={{ color: "#111111" }}>
                {col.title}
              </p>
              <div className="flex flex-col gap-3.5">
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm transition-colors hover:text-pink-500"
                    style={{ color: "#888" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legal strip */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid #ecddd4" }}
        >
          <p className="text-xs" style={{ color: "#bbb" }}>
            © 2026 BloomBay, Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs transition-colors hover:text-pink-500" style={{ color: "#bbb" }}>Privacy Policy</Link>
            <Link href="/terms"   className="text-xs transition-colors hover:text-pink-500" style={{ color: "#bbb" }}>Terms of Service</Link>
            <Link href="/safety"  className="text-xs transition-colors hover:text-pink-500" style={{ color: "#bbb" }}>Safety</Link>
            <Link href="/girl-rights" className="text-xs transition-colors hover:text-pink-500" style={{ color: "#bbb" }}>Girl Rights</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#FDF8F2" }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(253,248,242,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #ecddd4" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <BBLogo size={26} />
          <span className="font-bold text-sm tracking-[0.18em]" style={{ color: "#111111" }}>BLOOMBAY</span>
        </Link>
        <Link
          href="/onboard"
          className="px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
          style={{ background: "#FF1F7D", color: "white" }}
        >
          Join BloomBay
        </Link>
      </nav>

      {/* Page content */}
      {children}

      <MarketingFooter />
    </div>
  );
}
