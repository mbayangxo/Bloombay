import { MarketingLayout } from "@/app/components/marketing-layout";
import Link from "next/link";

export default function SafetyPage() {
  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#FF1F7D" }}>SAFETY FIRST</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Safety at BloomBay
          </h1>
          <p className="text-base text-gray-500 leading-relaxed max-w-xl mx-auto">
            Every woman who joins BloomBay deserves to feel safe. Here is what we do, and what you can do.
          </p>
        </div>

        <div className="flex flex-col gap-8 mb-16">
          {[
            {
              icon: "shield",
              title: "Verification",
              body: "Every BloomBay member completes a verification process before accessing the community. We review selfie verifications to confirm real identity. Verified members receive the Bloom Guard badge.",
            },
            {
              icon: "eye",
              title: "Women only",
              body: "BloomBay is a women-only space. Our team reviews accounts that do not meet membership requirements. Members can flag suspicious profiles directly from any profile page.",
            },
            {
              icon: "star",
              title: "Bloom Guard for hosts",
              body: "Any woman hosting a paid gathering must complete the 12-minute Bloom Guard training before her first event. This covers safe hosting, managing difficult situations, and connecting members to support.",
            },
            {
              icon: "message",
              title: "Report and block",
              body: "You can report or block any user from their profile at any time, no questions asked. Reports go directly to our safety team and are reviewed within 24 hours. Blocks take effect immediately.",
            },
            {
              icon: "lock",
              title: "Your data",
              body: "Your personal contact information is never shared with other members. Hosts do not receive your phone number or email. All communication happens through the BloomBay platform.",
            },
            {
              icon: "help",
              title: "Need help now?",
              body: "If you are in immediate danger, call 911. If you have a safety concern about your BloomBay experience, email safety@bloombay.app or use the in-app report tool. A human reviews every report.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-3xl p-6 flex gap-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FFF0F5" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="1.8" strokeLinecap="round">
                  {item.icon === "shield" && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
                  {item.icon === "eye" && <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                  {item.icon === "star" && <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />}
                  {item.icon === "message" && <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />}
                  {item.icon === "lock" && <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>}
                  {item.icon === "help" && <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>}
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base mb-1.5" style={{ color: "#111111" }}>{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl p-8 text-center" style={{ background: "#111111" }}>
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            See something. Say something.
          </h2>
          <p className="text-white/60 text-sm mb-6">Your report protects every woman in this community.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white"
            style={{ background: "#FF1F7D" }}
          >
            Report a concern
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
