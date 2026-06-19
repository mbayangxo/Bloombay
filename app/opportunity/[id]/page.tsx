import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { eligibilityAgent } from "@/lib/agents";
import type { Opportunity, UserProfile } from "@/lib/types";

const GOLD = "#C9A84C";
const FOREST = "#0D3B2E";
const IVORY = "#F7F2E8";
const OBSIDIAN = "#0B0B0B";
const EARTH = "#8B3A2A";
const ROYAL = "#1B3A6B";

function countryFlag(country: string): string {
  const flags: Record<string, string> = {
    Nigeria: "🇳🇬", Ghana: "🇬🇭", Kenya: "🇰🇪", Rwanda: "🇷🇼",
    Senegal: "🇸🇳", Morocco: "🇲🇦", "South Africa": "🇿🇦",
    "Côte d'Ivoire": "🇨🇮", Guinea: "🇬🇳", Mali: "🇲🇱", "Pan-Africa": "🌍",
  };
  return flags[country] ?? "🌍";
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Not specified";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatAmount(amount: number | null, currency: string | null): string {
  if (!amount) return "Amount varies — check official source";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency ?? ""} ${amount.toLocaleString()}`;
  }
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: opp }, { data: profile }, { data: saved }, { data: similar }] =
    await Promise.all([
      supabase.from("opportunities").select("*").eq("id", id).single(),
      supabase.from("user_profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("saved_opportunities")
        .select("status")
        .eq("user_id", user.id)
        .eq("opportunity_id", id)
        .maybeSingle(),
      supabase
        .from("opportunities")
        .select("id, title, country, type, amount, currency, verified_status")
        .eq("archived", false)
        .neq("id", id)
        .limit(4),
    ]);

  if (!opp) notFound();

  const opportunity = opp as Opportunity;
  const userProfile = profile as unknown as UserProfile | null;

  // Run eligibility assessment
  const eligibility = userProfile
    ? await eligibilityAgent.assess({ opportunity, user: userProfile })
    : null;

  const assessment = eligibility?.data;
  const days = daysUntil(opportunity.deadline);
  const verified = opportunity.verified_status;

  const qualifiesColor =
    assessment?.qualifies === "yes" ? "#2D7A4F"
    : assessment?.qualifies === "likely" ? "#2D7A4F"
    : assessment?.qualifies === "maybe" ? "#8A6F2E"
    : EARTH;

  const qualifiesLabel = {
    yes: "You very likely qualify",
    likely: "You likely qualify",
    maybe: "You may qualify",
    unlikely: "You may not qualify",
    no: "You likely do not qualify",
  }[assessment?.qualifies ?? "maybe"] ?? "Assessment unavailable";

  return (
    <div style={{ minHeight: "100vh", background: "#F4EFE6" }}>
      {/* Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">Alkebulan <span>United</span></Link>
          <ul className="nav-links">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/countries">Explore Africa</Link></li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ padding: "40px 24px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 28, fontSize: 13, color: "#888" }}>
          <Link href="/dashboard" style={{ color: "#888" }}>Dashboard</Link>
          <span>›</span>
          <span style={{ color: OBSIDIAN }}>{opportunity.title}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}>
          {/* Main content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Hero card */}
            <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", overflow: "hidden" }}>
              <div style={{ background: FOREST, padding: "36px 32px" }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 24 }}>{countryFlag(opportunity.country)}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center" }}>
                    {opportunity.country}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                    padding: "4px 10px", borderRadius: 2, marginLeft: "auto",
                    background: verified === "verified" ? "rgba(45,122,79,0.2)" : "rgba(201,168,76,0.15)",
                    color: verified === "verified" ? "#4CAF8B" : GOLD,
                  }}>
                    {verified === "verified" ? "✓ Verified" : verified === "needs_review" ? "⚠ Needs Review" : "? Unverified"}
                  </span>
                </div>

                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 16 }}>
                  {opportunity.title}
                </h1>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 2, background: "rgba(201,168,76,0.15)", color: GOLD }}>
                    {opportunity.type}
                  </span>
                  {opportunity.sectors.slice(0, 3).map((s) => (
                    <span key={s} style={{ fontSize: 11, padding: "5px 12px", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)", borderRadius: 2, textTransform: "capitalize" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Amount</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: GOLD }}>
                    {formatAmount(opportunity.amount, opportunity.currency)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Deadline</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: days !== null && days <= 7 ? EARTH : OBSIDIAN }}>
                    {formatDate(opportunity.deadline)}
                    {days !== null && days > 0 && <div style={{ fontSize: 11, color: "#888", fontWeight: 400, marginTop: 2 }}>{days} days remaining</div>}
                    {!opportunity.deadline && <div style={{ fontSize: 11, color: "#888" }}>Not confirmed — verify from source</div>}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Source</div>
                  <a href={opportunity.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600, color: FOREST, textDecoration: "underline" }}>
                    {opportunity.source_name} ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "28px 32px" }}>
              <div className="section-label" style={{ marginBottom: 14 }}>Plain English Summary</div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.75, color: "#333" }}>
                {opportunity.summary}
              </p>
            </div>

            {/* Eligibility */}
            <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "28px 32px" }}>
              <div className="section-label" style={{ marginBottom: 14 }}>Who Can Apply</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                {[
                  ["Age Range", opportunity.eligibility_age_min || opportunity.eligibility_age_max
                    ? `${opportunity.eligibility_age_min ?? "Any"} – ${opportunity.eligibility_age_max ?? "Any"}`
                    : "No age restriction"],
                  ["Gender", opportunity.eligibility_gender
                    ? opportunity.eligibility_gender.charAt(0).toUpperCase() + opportunity.eligibility_gender.slice(1) + " only"
                    : "All genders"],
                  ["Citizenship", (opportunity.eligibility_citizenship ?? []).join(", ") || "Open to all"],
                  ["Diaspora", opportunity.diaspora_allowed ? "✓ Diaspora welcome" : "Must reside in country"],
                  ["Business Stage", (opportunity.business_stage_required ?? []).join(", ") || "All stages"],
                  ["Residence", (opportunity.eligibility_residence ?? []).join(", ") || "Flexible"],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: "14px 16px", background: "#F8F5EE", borderRadius: 2 }}>
                    <div style={{ fontSize: 11, color: "#888", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: OBSIDIAN }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            {opportunity.documents_required && opportunity.documents_required.length > 0 && (
              <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "28px 32px" }}>
                <div className="section-label" style={{ marginBottom: 14 }}>Documents Required</div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {opportunity.documents_required.map((doc, i) => (
                    <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 14, color: "#444", padding: "10px 0", borderBottom: i < opportunity.documents_required!.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                      <span style={{ color: GOLD, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>◈</span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Application Steps */}
            {opportunity.application_steps && opportunity.application_steps.length > 0 && (
              <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "28px 32px" }}>
                <div className="section-label" style={{ marginBottom: 14 }}>How To Apply — Step by Step</div>
                <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
                  {opportunity.application_steps.map((step, i) => (
                    <li key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <span style={{
                        flexShrink: 0,
                        width: 28,
                        height: 28,
                        background: FOREST,
                        color: "white",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                      }}>
                        {i + 1}
                      </span>
                      <div style={{ fontSize: 14, color: "#444", lineHeight: 1.6, paddingTop: 4 }}>{step}</div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Notes */}
            {opportunity.notes && (
              <div style={{ background: "rgba(201,168,76,0.06)", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)", padding: "20px 24px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8A6F2E", marginBottom: 8 }}>
                  ⚠ Important Notes
                </div>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>{opportunity.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 88 }}>

            {/* Eligibility assessment */}
            {assessment && (
              <div style={{
                background: "white",
                borderRadius: 4,
                border: `2px solid ${qualifiesColor}`,
                overflow: "hidden",
              }}>
                <div style={{ background: qualifiesColor, padding: "16px 20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>
                    Your Eligibility
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "white" }}>
                    {qualifiesLabel}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
                    {assessment.confidence}% confidence
                  </div>
                </div>

                <div style={{ padding: "16px 20px" }}>
                  {assessment.reasons_qualify.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#2D7A4F", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                        Why you qualify
                      </div>
                      {assessment.reasons_qualify.map((r, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#444", display: "flex", gap: 6, marginBottom: 5 }}>
                          <span style={{ color: "#2D7A4F", flexShrink: 0 }}>✓</span>
                          {r}
                        </div>
                      ))}
                    </div>
                  )}

                  {assessment.reasons_disqualify.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: EARTH, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                        Possible blockers
                      </div>
                      {assessment.reasons_disqualify.map((r, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#444", display: "flex", gap: 6, marginBottom: 5 }}>
                          <span style={{ color: EARTH, flexShrink: 0 }}>✗</span>
                          {r}
                        </div>
                      ))}
                    </div>
                  )}

                  {assessment.missing_info.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#8A6F2E", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                        Missing from your profile
                      </div>
                      {assessment.missing_info.map((r, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#444", display: "flex", gap: 6, marginBottom: 5 }}>
                          <span style={{ color: "#8A6F2E", flexShrink: 0 }}>?</span>
                          {r}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(0,0,0,0.06)", fontSize: 12, color: "#555", lineHeight: 1.5 }}>
                    {assessment.recommendation}
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a
                href={opportunity.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", fontSize: 13 }}
              >
                Apply on Official Site ↗
              </a>
              <Link
                href={`/apply/${opportunity.id}`}
                className="btn-forest"
                style={{ width: "100%", justifyContent: "center", fontSize: 13 }}
              >
                Get Application Help →
              </Link>
            </div>

            {/* Key facts */}
            <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "20px" }}>
              <div className="section-label" style={{ marginBottom: 14 }}>Quick Facts</div>
              {[
                ["Type", opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)],
                ["Country", opportunity.country],
                ["Amount", formatAmount(opportunity.amount, opportunity.currency)],
                ["Deadline", formatDate(opportunity.deadline)],
                ["Diaspora OK", opportunity.diaspora_allowed ? "Yes" : "No"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 13 }}>
                  <span style={{ color: "#888" }}>{label}</span>
                  <span style={{ fontWeight: 600, color: OBSIDIAN }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Source */}
            <div style={{ background: "rgba(13,59,46,0.05)", border: "1px solid rgba(13,59,46,0.15)", borderRadius: 4, padding: "16px 20px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: FOREST, marginBottom: 8 }}>
                Official Source
              </div>
              <p style={{ fontSize: 12, color: "#555", marginBottom: 10, lineHeight: 1.5 }}>
                Always verify details directly from the official source before applying. Deadlines and eligibility can change.
              </p>
              <a href={opportunity.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: FOREST, textDecoration: "underline" }}>
                {opportunity.source_name} ↗
              </a>
            </div>
          </div>
        </div>

        {/* Similar opportunities */}
        {similar && similar.length > 0 && (
          <div style={{ marginTop: 52 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Similar Opportunities</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
              {similar.map((s: { id: string; title: string; country: string; type: string; amount: number | null; currency: string | null; verified_status: string }) => (
                <Link key={s.id} href={`/opportunity/${s.id}`}>
                  <div className="opp-card" style={{ padding: "18px 20px" }}>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{countryFlag(s.country)} {s.country}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: OBSIDIAN, marginBottom: 8, lineHeight: 1.3 }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>{formatAmount(s.amount, s.currency)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
