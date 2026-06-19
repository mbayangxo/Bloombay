import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { CountryProfile } from "@/lib/types";

const GOLD = "#C9A84C";
const FOREST = "#0D3B2E";
const OBSIDIAN = "#0B0B0B";

export default async function CountriesPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("country_profiles")
    .select("*")
    .order("country", { ascending: true });

  const countries = (profiles ?? []) as CountryProfile[];

  // Get opportunity counts per country
  const { data: oppCounts } = await supabase
    .from("opportunities")
    .select("country")
    .eq("archived", false);

  const countMap = new Map<string, number>();
  for (const o of oppCounts ?? []) {
    countMap.set(o.country, (countMap.get(o.country) ?? 0) + 1);
  }

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

      {/* Hero */}
      <div
        style={{
          background: FOREST,
          padding: "72px 24px 60px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)`,
          }}
        />
        <div style={{ position: "relative" }}>
          <div className="section-label" style={{ color: "rgba(201,168,76,0.7)", marginBottom: 16 }}>
            Africa Country Explorer
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.02em",
              marginBottom: 20,
            }}
          >
            54 Nations.
            <br />
            <em style={{ color: GOLD, fontStyle: "italic" }}>Endless opportunity.</em>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 540, margin: "0 auto", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>
            Explore each African country — its programs, history, culture, sectors, and opportunities — all in one place.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: "52px 24px 80px" }}>
        {/* Countries grid */}
        {countries.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {countries.map((cp) => {
              const count = countMap.get(cp.country) ?? 0;
              const panCount = countMap.get("Pan-Africa") ?? 0;
              const total = count + panCount;

              return (
                <Link key={cp.country} href={`/countries/${cp.country_code.toLowerCase()}`}>
                  <div className="opp-card" style={{ cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ fontSize: 36 }}>{cp.flag_emoji}</span>
                        <div>
                          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: OBSIDIAN }}>
                            {cp.country}
                          </h3>
                          <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{cp.country_code}</div>
                        </div>
                      </div>
                      {total > 0 && (
                        <span
                          style={{
                            padding: "4px 10px",
                            background: "rgba(13,59,46,0.08)",
                            color: FOREST,
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {total} programs
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                      {cp.major_industries.slice(0, 3).map((ind) => (
                        <span
                          key={ind}
                          style={{
                            fontSize: 10,
                            padding: "3px 8px",
                            background: "rgba(201,168,76,0.1)",
                            color: "#7A5C1E",
                            borderRadius: 2,
                            fontWeight: 500,
                          }}
                        >
                          {ind}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {cp.languages.slice(0, 3).map((lang) => (
                        <span key={lang} style={{ fontSize: 11, color: "#888" }}>
                          {lang}
                        </span>
                      ))}
                      {cp.languages.length > 3 && (
                        <span style={{ fontSize: 11, color: "#bbb" }}>+{cp.languages.length - 3} more</span>
                      )}
                    </div>

                    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: FOREST }}>Explore {cp.country} →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Placeholder when no country profiles in DB yet */
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🌍</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: OBSIDIAN, marginBottom: 12 }}>
              Country profiles loading
            </h2>
            <p style={{ color: "#888", fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
              Run the database migrations to load country profiles for 10 African nations.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
                maxWidth: 800,
                margin: "0 auto",
              }}
            >
              {["🇸🇳 Senegal","🇬🇭 Ghana","🇳🇬 Nigeria","🇷🇼 Rwanda","🇰🇪 Kenya","🇲🇦 Morocco","🇿🇦 South Africa","🇨🇮 Côte d'Ivoire","🇬🇳 Guinea","🇲🇱 Mali"].map((c) => (
                <div
                  key={c}
                  style={{
                    padding: "20px",
                    background: "white",
                    borderRadius: 4,
                    border: "1px solid rgba(201,168,76,0.15)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: FOREST,
                    textAlign: "center",
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
