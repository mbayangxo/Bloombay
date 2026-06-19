import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { CountryProfile, Opportunity } from "@/lib/types";

const GOLD = "#C9A84C";
const FOREST = "#0D3B2E";
const OBSIDIAN = "#0B0B0B";
const EARTH = "#8B3A2A";

function formatAmount(amount: number | null, currency: string | null): string {
  if (!amount) return "Varies";
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

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: countryCode } = await params;
  const supabase = await createClient();

  const [{ data: cp }, { data: opps }] = await Promise.all([
    supabase
      .from("country_profiles")
      .select("*")
      .eq("country_code", countryCode.toUpperCase())
      .single(),
    supabase
      .from("opportunities")
      .select("*")
      .or(`country.eq.${countryCode.toUpperCase()},country.eq.Pan-Africa`)
      .eq("archived", false)
      .order("verified_status", { ascending: true })
      .limit(20),
  ]);

  if (!cp) notFound();

  const profile = cp as CountryProfile;
  const opportunities = (opps ?? []) as Opportunity[];
  const countryOpps = opportunities.filter((o) => o.country !== "Pan-Africa");
  const panAfricaOpps = opportunities.filter((o) => o.country === "Pan-Africa");

  return (
    <div style={{ minHeight: "100vh", background: "#F4EFE6" }}>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">Alkebulan <span>United</span></Link>
          <ul className="nav-links">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/countries">← All Countries</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: FOREST, padding: "60px 24px 52px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse 70% 80% at 80% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)" }} />
        <div className="container" style={{ position: "relative" }}>
          <Link href="/countries" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", display: "inline-flex", gap: 4, marginBottom: 20, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            ← Africa Explorer
          </Link>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            <span style={{ fontSize: 72 }}>{profile.flag_emoji}</span>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, color: "white", letterSpacing: "-0.02em", marginBottom: 8 }}>
                {profile.country}
              </h1>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {profile.languages.map((lang) => (
                  <span key={lang} style={{ fontSize: 12, padding: "4px 10px", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)", borderRadius: 2 }}>
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28, alignItems: "start" }}>

          {/* Main */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Key Industries */}
            <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "28px 32px" }}>
              <div className="section-label" style={{ marginBottom: 14 }}>Key Industries</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {profile.major_industries.map((ind) => (
                  <span key={ind} style={{ padding: "8px 16px", background: "rgba(13,59,46,0.07)", color: FOREST, borderRadius: 2, fontSize: 13, fontWeight: 600 }}>
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            {/* Historical & Cultural Notes */}
            {(profile.historical_notes || profile.cultural_notes) && (
              <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "28px 32px" }}>
                <div className="section-label" style={{ marginBottom: 14 }}>Heritage & Culture</div>
                {profile.historical_notes && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Historical Context</div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.75, color: "#444" }}>{profile.historical_notes}</p>
                  </div>
                )}
                {profile.cultural_notes && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: GOLD, marginBottom: 8 }}>Culture</div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.75, color: "#444" }}>{profile.cultural_notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Startup & Business */}
            {profile.startup_notes && (
              <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "28px 32px" }}>
                <div className="section-label" style={{ marginBottom: 14 }}>Startup Ecosystem</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.75, color: "#444" }}>{profile.startup_notes}</p>
              </div>
            )}

            {/* Business etiquette */}
            {profile.business_etiquette && (
              <div style={{ background: "rgba(201,168,76,0.05)", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)", padding: "24px 28px" }}>
                <div className="section-label" style={{ marginBottom: 10, color: "#8A6F2E" }}>Business Etiquette</div>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>{profile.business_etiquette}</p>
              </div>
            )}

            {/* Diaspora notes */}
            {profile.diaspora_notes && (
              <div style={{ background: "rgba(27,58,107,0.04)", borderRadius: 4, border: "1px solid rgba(27,58,107,0.12)", padding: "24px 28px" }}>
                <div className="section-label" style={{ marginBottom: 10, color: "#1B3A6B" }}>Diaspora Pathways</div>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>{profile.diaspora_notes}</p>
              </div>
            )}

            {/* Country Opportunities */}
            {countryOpps.length > 0 && (
              <div>
                <div className="section-label" style={{ marginBottom: 16 }}>
                  {profile.country}-Specific Opportunities ({countryOpps.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {countryOpps.map((opp) => (
                    <Link key={opp.id} href={`/opportunity/${opp.id}`}>
                      <div className="opp-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 2, background: "rgba(13,59,46,0.08)", color: FOREST }}>
                              {opp.type}
                            </span>
                            {opp.verified_status === "verified" && (
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 8px", borderRadius: 2, background: "rgba(45,122,79,0.1)", color: "#2D7A4F" }}>✓</span>
                            )}
                          </div>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: GOLD }}>{formatAmount(opp.amount, opp.currency)}</span>
                        </div>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: OBSIDIAN, marginBottom: 6 }}>{opp.title}</h3>
                        <p style={{ fontSize: 13, color: "#777", lineHeight: 1.5 }}>{opp.summary.substring(0, 100)}…</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Pan-Africa */}
            {panAfricaOpps.length > 0 && (
              <div>
                <div className="section-label" style={{ marginBottom: 16 }}>
                  Pan-African Opportunities Also Available ({panAfricaOpps.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {panAfricaOpps.map((opp) => (
                    <Link key={opp.id} href={`/opportunity/${opp.id}`}>
                      <div className="opp-card" style={{ borderLeft: `3px solid ${GOLD}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 11, color: "#888" }}>🌍 Pan-Africa</span>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: GOLD }}>{formatAmount(opp.amount, opp.currency)}</span>
                        </div>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: OBSIDIAN }}>{opp.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 88 }}>

            {/* Programs quick links */}
            <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "20px" }}>
              <div className="section-label" style={{ marginBottom: 14 }}>Government Programs</div>
              {[
                { label: "Youth Programs", value: profile.youth_programs },
                { label: "Women Programs", value: profile.women_programs },
                { label: "SME Agency", value: profile.sme_agencies },
              ].map(({ label, value }) => value ? (
                <div key={label} style={{ padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#888", marginBottom: 4 }}>{label}</div>
                  <p style={{ fontSize: 12, color: "#444", lineHeight: 1.5 }}>{value}</p>
                </div>
              ) : null)}
            </div>

            {/* Procurement links */}
            {profile.procurement_links && profile.procurement_links.length > 0 && (
              <div style={{ background: "rgba(13,59,46,0.04)", borderRadius: 4, border: "1px solid rgba(13,59,46,0.12)", padding: "20px" }}>
                <div className="section-label" style={{ marginBottom: 12, color: FOREST }}>Government Procurement Portals</div>
                {profile.procurement_links.map((link) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", fontSize: 13, color: FOREST, fontWeight: 600, textDecoration: "underline", marginBottom: 6 }}
                  >
                    {link} ↗
                  </a>
                ))}
              </div>
            )}

            {/* Stats */}
            <div style={{ background: FOREST, borderRadius: 4, padding: "20px" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                In the database
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, color: GOLD, lineHeight: 1 }}>
                {countryOpps.length}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
                {profile.country}-specific programs
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "rgba(201,168,76,0.6)", lineHeight: 1 }}>
                +{panAfricaOpps.length}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                Pan-African programs
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
