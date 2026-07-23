import { PartnerShell } from "../components/partner-shell";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How do I confirm or decline a booking request?",
    a: "Go to Requests — each pending request has Confirm and Decline buttons. The member is notified automatically once you decide.",
  },
  {
    q: "How do members find my venue?",
    a: "Your venue appears in The City (member-facing discovery) using the name, photos, and details you set in Brand identity and Profile.",
  },
  {
    q: "How do I change my venue's photos, colors, or menu?",
    a: "Use Brand identity — changes there control how your page looks to members.",
  },
  {
    q: "Something looks wrong or missing on my dashboard.",
    a: "Email partners@bloombay.app with your venue name and a screenshot and the team will help directly.",
  },
];

export default function PartnerHelpPage() {
  return (
    <PartnerShell title="Help center" sub="Common questions from BloomBay venue partners.">
      {FAQS.map((item) => (
        <div key={item.q} className="pp-card">
          <h2>{item.q}</h2>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.88rem", color: "var(--pp-muted)" }}>{item.a}</p>
        </div>
      ))}
      <div className="pp-card">
        <h2>Still stuck?</h2>
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.88rem" }}>
          Email <a href="mailto:partners@bloombay.app">partners@bloombay.app</a> — a real person on the
          BloomBay team reads these.
        </p>
      </div>
    </PartnerShell>
  );
}
