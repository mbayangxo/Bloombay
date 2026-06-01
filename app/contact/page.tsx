"use client";

import { useState } from "react";
import { MarketingLayout } from "@/app/components/marketing-layout";

const TOPICS = [
  "General question",
  "My account",
  "A club or gathering",
  "Safety concern",
  "Media or press",
  "Partnership",
];

export default function ContactPage() {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <MarketingLayout>
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-24">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#FF1F7D" }}>GET IN TOUCH</p>
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Contact Us
          </h1>
          <p className="text-base text-gray-500 mt-4 leading-relaxed">
            We read every message. A real human will get back to you within 48 hours.
          </p>
        </div>

        {sent ? (
          <div className="rounded-3xl p-10 text-center" style={{ background: "#FFF5F8" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "#FF1F7D" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>Message received.</h2>
            <p className="text-sm text-gray-500">We will get back to you within 48 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">Topic</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className="px-3 py-2.5 rounded-xl text-sm font-medium text-left border-2 transition-all"
                    style={
                      topic === t
                        ? { borderColor: "#FF1F7D", background: "#FFF0F5", color: "#FF1F7D" }
                        : { borderColor: "#EEE", background: "white", color: "#555" }
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">Your name</label>
              <input
                type="text" required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#FFE0EE", color: "#111111" }}
                placeholder="First name is fine"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">Email</label>
              <input
                type="email" required
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#FFE0EE", color: "#111111" }}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">Message</label>
              <textarea
                required rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
                style={{ borderColor: "#FFE0EE", color: "#111111" }}
                placeholder="Tell us what's on your mind..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full font-bold text-base text-white transition-all hover:brightness-110"
              style={{ background: "#FF1F7D" }}
            >
              Send message
            </button>
          </form>
        )}
      </div>
    </MarketingLayout>
  );
}
