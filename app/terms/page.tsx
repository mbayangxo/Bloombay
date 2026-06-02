import { MarketingLayout } from "@/app/components/marketing-layout";

const SECTIONS = [
  {
    title: "Who can use BloomBay",
    body: "BloomBay is a women-only community platform. By creating an account, you confirm that you identify as a woman. You must be 18 years of age or older to join. BloomBay reserves the right to verify membership and remove accounts that do not meet these requirements.",
  },
  {
    title: "Your account",
    body: "You are responsible for maintaining the confidentiality of your account. You agree not to share your login credentials or allow others to access your account. If you believe your account has been compromised, contact us immediately at support@bloombay.app.",
  },
  {
    title: "Community standards",
    body: "BloomBay is a space built on respect, safety, and genuine connection. You agree not to harass, threaten, or harm other members. You agree not to post false information, spam, or inappropriate content. Violations may result in immediate account suspension.",
  },
  {
    title: "Gatherings and payments",
    body: "When you reserve a seat at a gathering, you are making a commitment to the host and the other women attending. If you cannot attend, you must release your seat at least 24 hours in advance. Deposits are returned as BloomBay wallet credit after confirmed attendance. We charge a service fee on transactions processed through the platform.",
  },
  {
    title: "Refunds and disputes",
    body: "If a gathering is cancelled by the host, you will receive a full refund. Refund requests for other situations are evaluated case by case. Contact support@bloombay.app with your dispute. We aim to resolve all disputes within 5 business days.",
  },
  {
    title: "Club ownership",
    body: "Club owners are responsible for the conduct of their clubs and the accuracy of their club information. BloomBay reserves the right to remove clubs that violate community standards, become inactive, or mislead members.",
  },
  {
    title: "Intellectual property",
    body: "BloomBay owns the BloomBay name, logo, and platform. You retain ownership of content you create, but by posting it you grant BloomBay a license to display it on the platform.",
  },
  {
    title: "Changes to these terms",
    body: "We may update these terms from time to time. We will notify you of material changes by email or through the app. Continued use of BloomBay after changes are posted constitutes acceptance of the new terms.",
  },
];

export default function TermsPage() {
  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-24">
        <div className="mb-12">
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "#FF1F7D" }}>LEGAL</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            Terms of Service
          </h1>
          <p className="text-sm text-gray-400">Last updated: June 1, 2026</p>
          <p className="text-base text-gray-500 leading-relaxed mt-4">
            By using BloomBay, you agree to these terms. Please read them carefully.
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
