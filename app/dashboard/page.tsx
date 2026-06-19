import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Opportunity, UserProfile } from "@/lib/types";

const GOLD = "#C9A84C";
const FOREST = "#0D3B2E";
const IVORY = "#F7F2E8";
const OBSIDIAN = "#0B0B0B";
const EARTH = "#8B3A2A";
const ROYAL = "#1B3A6B";

function typeBadgeStyle(type: string) {
  const map: Record<string, { bg: string; color: string }> = {
    grant: { bg: "rgba(13,59,46,0.1)", color: FOREST },
    loan: { bg: "rgba(27,58,107,0.1)", color: ROYAL },
    accelerator: { bg: "rgba(201,168,76,0.15)", color: "#8A6F2E" },
    fellowship: { bg: "rgba(139,58,42,0.1)", color: EARTH },
    contract: { bg: "rgba(139,58,42,0.1)", color: EARTH },
    tender: { bg: "rgba(27,58,107,0.1)", color: ROYAL },
    fund: { bg: "rgba(13,59,46,0.1)", color: FOREST },
    training: { bg: "rgba(201,168,76,0.12)", color: "#8A6F2E" },
    investment: { bg: "rgba(13,59,46,0.12)", color: FOREST },
    procurement: { bg: "rgba(27,58,107,0.1)", color: ROYAL },
  };
  return map[type] ?? { bg: "rgba(0,0,0,0.06)", color: "#555" };
}

function verifiedBadge(status: string) {
  if (status === "verified") return { label: "✓ Verified", color: "#2D7A4F", bg: "rgba(45,122,79,0.1)" };
  if (status === "needs_review") return { label: "⚠ Needs Review", color: "#8A6F2E", bg: "rgba(201,168,76,0.15)" };
  return { label: "? Unverified", color: EARTH, bg: "rgba(139,58,42,0.1)" };
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatAmount(amount: number | null, currency: string | null): string {
  if (!amount) return "Amount varies";
  const fmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  });
  return fmt.format(amount);
}

function countryFlag(country: string): string {
  const flags: Record<string, string> = {
    Nigeria: "🇳🇬", Ghana: "🇬🇭", Kenya: "🇰🇪", Rwanda: "🇷🇼",
    Senegal: "🇸🇳", Morocco: "🇲🇦", "South Africa": "🇿🇦",
    "Côte d'Ivoire": "🇨🇮", Guinea: "🇬🇳", Mali: "🇲🇱",
    Ethiopia: "🇪🇹", Tanzania: "🇹🇿", Uganda: "🇺🇬",
    "Pan-Africa": "🌍",
  };
  return flags[country] ?? "🌍";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: opportunities }, { data: saved }] =
    await Promise.all([
      supabase.from("user_profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("opportunities")
        .select("*")
        .eq("archived", false)
        .order("created_at", { ascending: false })
        .limit(60),
      supabase
        .from("saved_opportunities")
        .select("opportunity_id")
        .eq("user_id", user.id),
    ]);

  if (!profile || !profile.onboarding_complete) {
    redirect("/onboarding");
  }

  const opps = (opportunities ?? []) as Opportunity[];
  const savedIds = new Set((saved ?? []).map((s) => s.opportunity_id));

  // Filter opportunities based on user profile
  function scoreOpportunity(opp: Opportunity, prof: UserProfile): number {
    let score = 0;

    // Country match
    if (
      prof.target_countries.length === 0 ||
      prof.target_countries.includes(opp.country) ||
      opp.country === "Pan-Africa"
    ) {
      score += 30;
    }

    // Funding type match
    if (
      prof.funding_types.length === 0 ||
      prof.funding_types.includes(opp.type)
    ) {
      score += 20;
    }

    // Sector match
    if (
      opp.sectors.includes("all") ||
      prof.sectors.some((s) => opp.sectors.includes(s)) ||
      prof.sectors.includes("all")
    ) {
      score += 20;
    }

    // Gender match
    if (!opp.eligibility_gender || opp.eligibility_gender === prof.gender) {
      score += 10;
    } else {
      score -= 50;
    }

    // Age match
    if (prof.age) {
      if (opp.eligibility_age_min && prof.age < opp.eligibility_age_min) score -= 30;
      if (opp.eligibility_age_max && prof.age > opp.eligibility_age_max) score -= 30;
    }

    // Diaspora
    if (prof.diaspora_status && !opp.diaspora_allowed) score -= 20;

    // Business stage
    if (
      prof.business_stage &&
      opp.business_stage_required &&
      opp.business_stage_required.length > 0 &&
      !opp.business_stage_required.includes(prof.business_stage)
    ) {
      score -= 15;
    }

    // Verified bonus
    if (opp.verified_status === "verified") score += 5;

    return score;
  }

  const userProfile = profile as unknown as UserProfile;
  const scored = opps
    .map((o) => ({ opp: o, score: scoreOpportunity(o, userProfile) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const matched = scored.map((x) => x.opp);
  const all = opps;

  return (
    <div style={{ minHeight: "100vh", background: "#F4EFE6" }}>
      {/* Nav */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            Alkebulan <span>United</span>
          </Link>
          <ul className="nav-links">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/countries">Explore Africa</Link></li>
          </ul>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/onboarding" style={{ fontSize: 12, color: "#888" }}>
              Edit Profile
            </Link>
            <form action="/auth/signout" method="POST">
              <button
                style={{
                  fontSize: 12,
                  color: "#888",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Hero strip */}
      <div
        style={{
          background: FOREST,
          padding: "40px 24px",
          borderBottom: `3px solid ${GOLD}`,
        }}
      >
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="section-label" style={{ color: "rgba(201,168,76,0.7)", marginBottom: 8 }}>
                Your Opportunity Dashboard
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(26px, 3.5vw, 40px)",
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "-0.01em",
                }}
              >
                Welcome back, {userProfile.name?.split(" ")[0] ?? "Explorer"}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginTop: 8 }}>
                {matched.length} opportunities match your profile · {all.length} total in database
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link href="/countries" className="btn-secondary" style={{ fontSize: 12, padding: "10px 20px", borderColor: "rgba(201,168,76,0.3)", color: GOLD }}>
                Explore Countries
              </Link>
              <Link href="/onboarding" className="btn-primary" style={{ fontSize: 12, padding: "10px 20px" }}>
                Update Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 24px" }}>
        {/* Profile summary chips */}
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 36,
            padding: "16px 20px",
            background: "white",
            borderRadius: 4,
            border: "1px solid rgba(201,168,76,0.15)",
          }}
        >
          <span style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", marginRight: 8 }}>
            Filtering by:
          </span>
          {userProfile.business_stage && (
            <span style={{ fontSize: 12, padding: "4px 10px", background: "rgba(13,59,46,0.08)", color: FOREST, borderRadius: 20, fontWeight: 500 }}>
              {userProfile.business_stage}
            </span>
          )}
          {userProfile.sectors.slice(0, 3).map((s) => (
            <span key={s} style={{ fontSize: 12, padding: "4px 10px", background: "rgba(201,168,76,0.1)", color: "#7A5C1E", borderRadius: 20, fontWeight: 500 }}>
              {s}
            </span>
          ))}
          {userProfile.diaspora_status && (
            <span style={{ fontSize: 12, padding: "4px 10px", background: "rgba(27,58,107,0.08)", color: ROYAL, borderRadius: 20, fontWeight: 500 }}>
              Diaspora
            </span>
          )}
          {userProfile.target_countries.slice(0, 2).map((c) => (
            <span key={c} style={{ fontSize: 12, padding: "4px 10px", background: "rgba(0,0,0,0.05)", color: "#555", borderRadius: 20, fontWeight: 500 }}>
              {countryFlag(c)} {c}
            </span>
          ))}
        </div>

        {/* Section: Best Matches */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <div className="section-label" style={{ marginBottom: 6 }}>Best Matches</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: OBSIDIAN }}>
                Opportunities matched to your profile
              </h2>
            </div>
          </div>

          {matched.length === 0 ? (
            <div
              style={{
                background: "white",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 4,
                padding: "52px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>🌍</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 8 }}>
                Update your profile to see matches
              </h3>
              <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>
                Add your sectors, target countries, and business stage to get personalized matches.
              </p>
              <Link href="/onboarding" className="btn-primary">Update Profile →</Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: 16,
              }}
            >
              {matched.slice(0, 12).map((opp) => (
                <OppCard
                  key={opp.id}
                  opp={opp}
                  isSaved={savedIds.has(opp.id)}
                  userId={user.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section: All Opportunities */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <div className="section-label" style={{ marginBottom: 6 }}>All Opportunities</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: OBSIDIAN }}>
              Complete database
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 16,
            }}
          >
            {all.map((opp) => (
              <OppCard
                key={opp.id}
                opp={opp}
                isSaved={savedIds.has(opp.id)}
                userId={user.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OppCard({
  opp,
  isSaved,
  userId,
}: {
  opp: Opportunity;
  isSaved: boolean;
  userId: string;
}) {
  const badge = typeBadgeStyle(opp.type);
  const verified = verifiedBadge(opp.verified_status);
  const days = daysUntil(opp.deadline);

  return (
    <Link href={`/opportunity/${opp.id}`} style={{ display: "block" }}>
      <div className="opp-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 20 }}>{countryFlag(opp.country)}</span>
            <span style={{ fontSize: 11, color: "#888", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {opp.country}
            </span>
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "3px 8px",
              borderRadius: 2,
              background: verified.bg,
              color: verified.color,
            }}
          >
            {verified.label}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            color: OBSIDIAN,
            lineHeight: 1.35,
            marginBottom: 12,
          }}
        >
          {opp.title}
        </h3>

        <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 16 }}>
          {opp.summary.substring(0, 120)}…
        </p>

        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          <span
            style={{
              ...badge,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: 2,
            }}
          >
            {opp.type}
          </span>
          {opp.sectors.slice(0, 2).map((s) => (
            <span
              key={s}
              style={{
                fontSize: 10,
                padding: "4px 10px",
                background: "rgba(0,0,0,0.04)",
                color: "#666",
                borderRadius: 2,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 500,
              }}
            >
              {s}
            </span>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(0,0,0,0.06)",
            paddingTop: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 17,
                fontWeight: 700,
                color: GOLD,
              }}
            >
              {formatAmount(opp.amount, opp.currency)}
            </div>
            {days !== null && (
              <div
                style={{
                  fontSize: 11,
                  color: days <= 7 ? EARTH : days <= 30 ? "#8A6F2E" : "#888",
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                {days <= 0 ? "Deadline passed" : `${days} days left`}
              </div>
            )}
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: FOREST,
              letterSpacing: "0.04em",
            }}
          >
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

function formatAmount(amount: number | null, currency: string | null): string {
  if (!amount) return "Amount varies";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}
