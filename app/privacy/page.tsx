import { MarketingLayout } from "@/app/components/marketing-layout";

const SECTIONS = [
  {
    title: "What we collect",
    body: "We collect the information you give us when you create an account: your name, email, neighborhood, and the answers you provide in your profile. We also collect information about how you use BloomBay — gatherings you attend, clubs you join, and connections you make.",
  },
  {
    title: "How we use it",
    body: "We use your information to power your BloomBay experience: showing you relevant gatherings, making introductions through Yande, and helping club hosts manage their tables. We do not sell your personal data to third parties. Ever.",
  },
  {
    title: "Who sees your profile",
    body: "Other BloomBay members can see your first name, neighborhood, and any profile information you choose to make visible. Your email and contact details are never shared with other members. Hosts see your profile when you apply to or join their club.",
  },
  {
    title: "Photos and verification",
    body: "Verification photos are used only to confirm you are a real person. They are reviewed by our team and then stored securely. They are never shared publicly or used for any other purpose.",
  },
  {
    title: "Your rights",
    body: "You can view, edit, or delete your personal data at any time through your account settings. You can deactivate your account with a 30-day grace period, after which all personal data is permanently removed from our systems.",
  },
  {
    title: "Cookies",
    body: "We use cookies to keep you logged in and to understand how BloomBay is being used so we can improve it. We do not use advertising cookies or sell cookie data.",
  },
  {
    title: "Contact",
    body: "Questions about your privacy? Email us at privacy@bloombay.app. We will respond within 5 business days.",
  },
];

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <div className="mb-12">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#FF1F7D" }}>LEGAL</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400">Last updated: June 1, 2026</p>
          <p className="text-base text-gray-500 leading-relaxed mt-4">
            BloomBay is built on trust. Here is exactly how we handle your information — written in plain language, not legal jargon.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {SECTIONS.map((s, i) => (
            <div key={i} className="pb-10" style={{ borderBottom: i < SECTIONS.length - 1 ? "1px solid #ecddd4" : "none" }}>
              <h2 className="text-xl font-bold mb-3" style={{ color: "#111111" }}>{s.title}</h2>
              <p className="text-base text-gray-500 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </MarketingLayout>
  );
}
