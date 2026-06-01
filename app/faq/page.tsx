"use client";

import { useState } from "react";
import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

const FAQS = [
  {
    category: "About BloomBay",
    items: [
      { q: "What is BloomBay?", a: "BloomBay is a women-only community platform for real-world gatherings. Members join clubs, reserve seats at curated events, and connect with other women in their city — in person, not online." },
      { q: "Who is BloomBay for?", a: "Women 18 and older who want to build meaningful friendships and experiences in their city. Whether you are new in town or have lived there for years, BloomBay is for you." },
      { q: "Is BloomBay free to join?", a: "Joining BloomBay is free. Some gatherings have fees set by the host. We never charge a platform subscription." },
      { q: "What cities is BloomBay in?", a: "We are launching in New York City. More cities are coming soon — we will announce when a new city is ready." },
    ],
  },
  {
    category: "Membership",
    items: [
      { q: "How do I verify my identity?", a: "After signing up, you will be prompted to complete a quick selfie verification. Our team reviews it within 24 hours. Verified members receive the Bloom Guard badge on their profile." },
      { q: "Can men join BloomBay?", a: "No. BloomBay is a women-only community. Accounts that do not meet membership requirements are removed." },
      { q: "How do I delete my account?", a: "Go to Settings > Account > Delete Account. You have a 30-day grace period to change your mind before your data is permanently removed." },
    ],
  },
  {
    category: "Gatherings",
    items: [
      { q: "How do deposits work?", a: "Some hosts request a $1–$50 deposit when you reserve a seat. If you attend, the deposit is returned to your BloomBay wallet as credit. If you cancel with 24+ hours notice, you also receive it back." },
      { q: "What is Drop My Spot?", a: "Drop My Spot lets you release your seat up to 24 hours before a gathering. This opens the seat to another woman on the waitlist. Always drop your spot if you cannot attend — it is community etiquette." },
      { q: "What does pay in person mean?", a: "Some gatherings are paid directly to the host in exact cash on the day. The exact amount is shown on the gathering card so you can come prepared." },
    ],
  },
  {
    category: "Clubs",
    items: [
      { q: "How do I find a club to join?", a: "Browse Clubs in the app. You can filter by type, entry style, and more. Some clubs are open-entry, others require an application or approval." },
      { q: "How do I start a club?", a: "Visit the Start a Club page and submit an application. We review applications and launch clubs that align with our community standards." },
      { q: "What happens to inactive clubs?", a: "Clubs that have not hosted in 45 days receive a nudge. Clubs that remain inactive may be archived to keep the platform fresh." },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search.length > 2
    ? FAQS.map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.q.toLowerCase().includes(search.toLowerCase()) ||
            item.a.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((cat) => cat.items.length > 0)
    : FAQS;

  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#FF1F7D" }}>FAQ</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Frequently Asked Questions
          </h1>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full px-5 py-4 rounded-full border text-sm outline-none"
              style={{ borderColor: "#FFE0EE", paddingLeft: "48px" }}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-8 mb-12">
          {filtered.map((cat) => (
            <div key={cat.category}>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#FF1F7D" }}>{cat.category}</h2>
              <div className="flex flex-col gap-1">
                {cat.items.map((item) => (
                  <div key={item.q} className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                    <button
                      className="w-full flex items-center justify-between px-5 py-4 text-left"
                      onClick={() => setOpen(open === item.q ? null : item.q)}
                    >
                      <span className="font-semibold text-sm pr-4" style={{ color: "#111111" }}>{item.q}</span>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2"
                        className="flex-shrink-0 transition-transform"
                        style={{ transform: open === item.q ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {open === item.q && (
                      <div className="px-5 pb-4 pt-0">
                        <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl p-8 text-center" style={{ background: "#FFF5F8" }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Still have questions?
          </h2>
          <p className="text-sm text-gray-500 mb-5">Visit our Help Centre or contact us directly.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/help" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm" style={{ background: "#111111", color: "white" }}>
              Help Centre
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white" style={{ background: "#FF1F7D" }}>
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
