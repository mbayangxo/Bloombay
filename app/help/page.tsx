"use client";

import { useState } from "react";
import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

const FAQS = [
  {
    category: "Getting started",
    items: [
      { q: "How do I join BloomBay?", a: "Tap Join BloomBay on our homepage and complete the onboarding. You'll set up your profile, verify your identity, and choose your clubs." },
      { q: "Is BloomBay free?", a: "Joining BloomBay is free. Individual gatherings and some clubs may have their own fees set by the host." },
      { q: "Who can join?", a: "BloomBay is a women-only community for women 18 and older." },
    ],
  },
  {
    category: "Gatherings & Seats",
    items: [
      { q: "How do I reserve a seat?", a: "Browse Open Seats in Happenings, find something that interests you, and tap Grab a seat. You may be asked for a small deposit." },
      { q: "What is a deposit?", a: "Some hosts ask for a $1–$50 deposit to ensure attendance. If you show up, the deposit is returned as BloomBay wallet credit. If you cancel with 24+ hours notice, you also receive your deposit back." },
      { q: "What if I can't make it?", a: "Use Drop My Spot to release your seat at least 24 hours before the gathering. This gives another woman the opportunity to join." },
    ],
  },
  {
    category: "Clubs",
    items: [
      { q: "How do I join a club?", a: "Go to Clubs, find one that interests you, and tap to join or apply depending on the club's entry style." },
      { q: "Can I start my own club?", a: "Yes. Visit Start a Club to begin the application process." },
      { q: "What happens if a club goes inactive?", a: "BloomBay monitors club activity. Clubs that haven't hosted in 45 days receive a nudge from Yande. Clubs that remain inactive may be archived." },
    ],
  },
  {
    category: "Account & Safety",
    items: [
      { q: "How do I block someone?", a: "Go to their profile and tap the three dots in the top right. Select Block. The block takes effect immediately." },
      { q: "How do I report a user?", a: "Go to their profile and tap Report. Choose a reason and add details. Our safety team reviews every report within 24 hours." },
      { q: "How do I delete my account?", a: "Go to Settings > Account > Delete Account. You will have a 30-day grace period to change your mind before all data is permanently removed." },
    ],
  },
];

export default function HelpPage() {
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
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#FF1F7D" }}>SUPPORT</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Help Centre
          </h1>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for help..."
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
            Still need help?
          </h2>
          <p className="text-sm text-gray-500 mb-5">A real human will get back to you within 48 hours.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white"
            style={{ background: "#FF1F7D" }}
          >
            Contact us
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
