// FILE: app/feed/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Opportunity } from "@/lib/types";
import FeedSubscribeForm from "./subscribe-form";

// ── Design tokens ──────────────────────────────────────────────────────────
const GOLD    = "#C9A84C";
const FOREST  = "#0D3B2E";
const IVORY   = "#F7F2E8";
const OBSIDIAN = "#0B0B0B";
const EARTH   = "#8B3A2A";
const ROYAL   = "#1B3A6B";
const SAND    = "#D4A97A";

// ── Country flag map ───────────────────────────────────────────────────────
const FLAG: Record<string, string> = {
  Nigeria:        "🇳🇬",
  Ghana:          "🇬🇭",
  Kenya:          "🇰🇪",
  Senegal:        "🇸🇳",
  Rwanda:         "🇷🇼",
  "South Africa": "🇿🇦",
  Morocco:        "🇲🇦",
  Ethiopia:       "🇪🇹",
  "Côte d'Ivoire":"🇨🇮",
  Guinea:         "🇬🇳",
  Mali:           "🇲🇱",
  Tanzania:       "🇹🇿",
  Uganda:         "🇺🇬",
  "Pan-Africa":   "🌍",
};

// ── Type badge colours ─────────────────────────────────────────────────────
const TYPE_BADGE: Record<string, { bg: string; color: string }> = {
  grant:       { bg: "rgba(13,59,46,0.1)",  color: FOREST },
  loan:        { bg: "rgba(27,58,107,0.1)", color: ROYAL },
  tender:      { bg: "rgba(139,58,42,0.1)", color: EARTH },
  contract:    { bg: "rgba(139,58,42,0.1)", color: EARTH },
  procurement: { bg: "rgba(139,58,42,0.1)", color: EARTH },
  accelerator: { bg: "rgba(201,168,76,0.15)", color: "#8A6F2E" },
  fellowship:  { bg: "rgba(212,169,122,0.2)", color: "#7A4E2A" },
  investment:  { bg: "rgba(27,58,107,0.12)", color: ROYAL },
  training:    { bg: "rgba(100,100,100,0.1)", color: "#555" },
  fund:        { bg: "rgba(201,168,76,0.12)", color: "#8A6F2E" },
};

// ── Helpers ────────────────────────────────────────────────────────────────
function daysUntil(deadline: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDeadline(deadline: string): string {
  return new Date(deadline).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount: number | null, currency: string | null): string | null {
  if (!amount) return null;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency ?? "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency ?? ""} ${amount.toLocaleString()}`.trim();
  }
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max).trimEnd() + "…";
}

// ── Sub-components ─────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  const badge = TYPE_BADGE[type] ?? { bg: "rgba(100,100,100,0.08)", color: "#555" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 9px",
        borderRadius: 2,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        background: badge.bg,
        color: badge.color,
        fontFamily: "var(--font-ui)",
      }}
    >
      {type}
    </span>
  );
}

function VerifiedBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 8px",
        borderRadius: 2,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.08em",
        background: "rgba(13,59,46,0.08)",
        color: "#2A7A5A",
        fontFamily: "var(--font-ui)",
      }}
    >
      ✓ Verified
    </span>
  );
}

function OpportunityCard({
  opp,
  urgent = false,
}: {
  opp: Opportunity;
  urgent?: boolean;
}) {
  const days = daysUntil(opp.deadline);
  const isUrgent = days !== null && days <= 7 && days >= 0;
  const flag = FLAG[opp.country] ?? "🌍";
  const amount = formatAmount(opp.amount, opp.currency);

  return (
    <article
      style={{
        background: "white",
        border: urgent || isUrgent
          ? `1px solid rgba(139,58,42,0.35)`
          : `1px solid rgba(201,168,76,0.15)`,
        borderLeft: urgent || isUrgent
          ? `3px solid ${EARTH}`
          : `3px solid transparent`,
        borderRadius: 4,
        padding: "20px 24px",
        transition: "box-shadow 0.18s, border-color 0.18s",
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 10,
          flexWrap: "wrap" as const,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>{flag}</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "#888",
              fontFamily: "var(--font-ui)",
            }}
          >
            {opp.country}
          </span>
          <TypeBadge type={opp.type} />
          {opp.verified_status === "verified" && <VerifiedBadge />}
        </div>

        {/* Deadline pill */}
        {opp.deadline && (
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-ui)",
              fontWeight: 600,
              color: isUrgent ? EARTH : "#888",
              background: isUrgent ? "rgba(139,58,42,0.08)" : "rgba(0,0,0,0.04)",
              padding: "3px 8px",
              borderRadius: 2,
              whiteSpace: "nowrap" as const,
            }}
          >
            {isUrgent
              ? days === 0
                ? "Closes today"
                : `Closes in ${days} day${days === 1 ? "" : "s"}`
              : days !== null && days < 0
              ? "Closed"
              : formatDeadline(opp.deadline)}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 17,
          fontWeight: 700,
          color: FOREST,
          lineHeight: 1.25,
          marginBottom: 8,
        }}
      >
        {opp.title}
      </h3>

      {/* Amount */}
      {amount && (
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 15,
            fontWeight: 700,
            color: GOLD,
            marginBottom: 8,
          }}
        >
          {amount}
        </div>
      )}

      {/* Summary */}
      <p
        style={{
          fontSize: 13,
          color: "#666",
          lineHeight: 1.6,
          fontFamily: "var(--font-ui)",
          marginBottom: 14,
        }}
      >
        {truncate(opp.summary, 120)}
      </p>

      {/* Footer row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          paddingTop: 12,
          gap: 8,
          flexWrap: "wrap" as const,
        }}
      >
        {/* Sectors */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const }}>
          {opp.sectors.slice(0, 3).map((s) => (
            <span
              key={s}
              style={{
                fontSize: 10,
                color: "#999",
                background: "rgba(0,0,0,0.04)",
                padding: "2px 6px",
                borderRadius: 2,
                fontFamily: "var(--font-ui)",
                textTransform: "capitalize" as const,
              }}
            >
              {s}
            </span>
          ))}
        </div>
        <Link
          href={`/opportunity/${opp.id}`}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: FOREST,
            fontFamily: "var(--font-ui)",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap" as const,
          }}
        >
          → View Opportunity
        </Link>
      </div>
    </article>
  );
}

function FeedSection({
  title,
  label,
  items,
  urgent = false,
  accentColor,
}: {
  title: string;
  label: string;
  items: Opportunity[];
  urgent?: boolean;
  accentColor?: string;
}) {
  if (items.length === 0) return null;
  const accent = accentColor ?? GOLD;
  return (
    <section style={{ marginBottom: 52 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          marginBottom: 18,
          paddingBottom: 12,
          borderBottom: `1px solid rgba(201,168,76,0.15)`,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase" as const,
            color: accent,
          }}
        >
          {label}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 700,
            color: OBSIDIAN,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: "#aaa",
            fontFamily: "var(--font-ui)",
          }}
        >
          {items.length} program{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 14,
        }}
      >
        {items.map((opp) => (
          <OpportunityCard key={opp.id} opp={opp} urgent={urgent} />
        ))}
      </div>
    </section>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default async function FeedPage() {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("opportunities")
    .select("*")
    .neq("verified_status", "archived")
    .order("created_at", { ascending: false });

  const opportunities: Opportunity[] = (rows as Opportunity[]) ?? [];

  // ── Category bucketing ─────────────────────────────────────────────────
  const now = Date.now();
  const DAY = 1000 * 60 * 60 * 24;

  const closingThisWeek = opportunities.filter((o) => {
    const d = daysUntil(o.deadline);
    return d !== null && d >= 0 && d <= 7;
  }).slice(0, 6);

  const closingIn14 = opportunities.filter((o) => {
    const d = daysUntil(o.deadline);
    return d !== null && d > 7 && d <= 14;
  }).slice(0, 6);

  const newThisMonth = opportunities.filter((o) => {
    const age = now - new Date(o.created_at).getTime();
    return age <= 30 * DAY;
  }).slice(0, 6);

  const procurement = opportunities.filter((o) =>
    ["tender", "contract", "procurement"].includes(o.type)
  ).slice(0, 6);

  const diaspora = opportunities.filter((o) => o.diaspora_allowed).slice(0, 6);

  const youth = opportunities.filter(
    (o) => o.eligibility_age_max !== null && o.eligibility_age_max <= 35
  ).slice(0, 6);

  // ── Stats ──────────────────────────────────────────────────────────────
  const total = opportunities.length;
  const closingSoonCount = closingThisWeek.length;
  const newThisMonthCount = opportunities.filter((o) => {
    const age = now - new Date(o.created_at).getTime();
    return age <= 30 * DAY;
  }).length;

  return (
    <main style={{ background: IVORY, minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            Alkebulan <span>United</span>
          </Link>
          <ul className="nav-links">
            <li>
              <Link
                href="/feed"
                style={{ color: GOLD, fontWeight: 700, borderBottom: `2px solid ${GOLD}`, paddingBottom: 2 }}
              >
                Feed
              </Link>
            </li>
            <li><Link href="/countries">Explore Africa</Link></li>
            <li><Link href="/b2b">For Organizations</Link></li>
          </ul>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/login" className="btn-secondary" style={{ padding: "10px 22px", fontSize: 12 }}>
              Sign In
            </Link>
            <Link href="/login?mode=signup" className="btn-primary" style={{ padding: "10px 22px", fontSize: 12 }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── PAGE HEADER ── */}
      <div
        style={{
          background: FOREST,
          padding: "56px 24px 44px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle radial tint */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(ellipse 60% 100% at 80% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: SAND,
              marginBottom: 12,
            }}
          >
            Opportunity Intelligence
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 58px)",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Opportunity Feed
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.65)",
              fontFamily: "var(--font-body)",
              maxWidth: 560,
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            Weekly intelligence for African builders. Programs open now. Deadlines approaching. Signals worth acting on.
          </p>

          {/* Stats bar */}
          <div
            style={{
              display: "inline-flex",
              gap: 0,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            {[
              { value: total,              label: "active opportunities" },
              { value: closingSoonCount,   label: "closing this week" },
              { value: newThisMonthCount,  label: "new this month" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  padding: "12px 22px",
                  borderRight: i < 2 ? "1px solid rgba(201,168,76,0.15)" : "none",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 800,
                    color: GOLD,
                    lineHeight: 1,
                    marginBottom: 3,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 10,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EMAIL BANNER ── */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          padding: "20px 24px",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "0 0 auto" }}>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 14,
                fontWeight: 700,
                color: FOREST,
                marginBottom: 2,
              }}
            >
              Get this as a weekly email
            </p>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "#888" }}>
              Top opportunities, closing soon alerts, new programs — every Monday.
            </p>
          </div>
          <FeedSubscribeForm />
        </div>
      </div>

      {/* ── LAYOUT ── */}
      <div
        className="container"
        style={{
          display: "flex",
          gap: 32,
          padding: "40px 24px",
          alignItems: "flex-start",
        }}
      >

        {/* ── LEFT SIDEBAR ── */}
        <aside
          style={{
            width: 240,
            flexShrink: 0,
            position: "sticky",
            top: 24,
          }}
        >
          {/* Countries filter */}
          <div style={{ marginBottom: 32 }}>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: GOLD,
                marginBottom: 12,
              }}
            >
              By Country
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                ["Nigeria",      "🇳🇬"],
                ["Ghana",        "🇬🇭"],
                ["Kenya",        "🇰🇪"],
                ["Senegal",      "🇸🇳"],
                ["Rwanda",       "🇷🇼"],
                ["South Africa", "🇿🇦"],
                ["Morocco",      "🇲🇦"],
                ["Ethiopia",     "🇪🇹"],
              ].map(([country, flag]) => (
                <li key={country}>
                  <Link
                    href={`/feed?country=${encodeURIComponent(country)}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "7px 10px",
                      borderRadius: 3,
                      fontSize: 13,
                      fontFamily: "var(--font-ui)",
                      color: "#444",
                      fontWeight: 500,
                      transition: "all 0.12s",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{flag}</span>
                    {country}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/countries"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 3,
                    fontSize: 12,
                    fontFamily: "var(--font-ui)",
                    color: GOLD,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}
                >
                  + More Countries →
                </Link>
              </li>
            </ul>
          </div>

          {/* Divider */}
          <hr style={{ border: "none", borderTop: "1px solid rgba(201,168,76,0.15)", marginBottom: 28 }} />

          {/* Types filter */}
          <div style={{ marginBottom: 32 }}>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: GOLD,
                marginBottom: 12,
              }}
            >
              By Type
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                ["Grants",             "grant"],
                ["Loans",              "loan"],
                ["Tenders / Contracts","tender"],
                ["Accelerators",       "accelerator"],
                ["Fellowships",        "fellowship"],
                ["Investments",        "investment"],
              ].map(([label, type]) => (
                <li key={type}>
                  <Link
                    href={`/feed?type=${type}`}
                    style={{
                      display: "block",
                      padding: "7px 10px",
                      borderRadius: 3,
                      fontSize: 13,
                      fontFamily: "var(--font-ui)",
                      color: "#444",
                      fontWeight: 500,
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <hr style={{ border: "none", borderTop: "1px solid rgba(201,168,76,0.15)", marginBottom: 28 }} />

          {/* Sector filter */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: GOLD,
                marginBottom: 12,
              }}
            >
              By Sector
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {[
                "Agriculture", "Tech", "Fashion", "Food",
                "Health", "Education", "Creative",
              ].map((sector) => (
                <Link
                  key={sector}
                  href={`/feed?sector=${sector.toLowerCase()}`}
                  style={{
                    padding: "5px 10px",
                    border: "1px solid rgba(201,168,76,0.25)",
                    borderRadius: 2,
                    fontSize: 11,
                    fontFamily: "var(--font-ui)",
                    fontWeight: 500,
                    color: FOREST,
                    background: "white",
                  }}
                >
                  {sector}
                </Link>
              ))}
            </div>
          </div>

          {/* Diaspora & Youth quick links */}
          <div style={{ marginTop: 32, padding: "16px", background: "white", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 4 }}>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#aaa", marginBottom: 10 }}>
              Quick Filters
            </p>
            {[
              { label: "Diaspora Programs",  href: "/feed?diaspora=true" },
              { label: "Youth (Under 35)",    href: "/feed?youth=true" },
              { label: "Women-Led / Female",  href: "/feed?gender=female" },
              { label: "Closing This Week",   href: "/feed?deadline=7" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: "block",
                  fontSize: 12,
                  fontFamily: "var(--font-ui)",
                  color: FOREST,
                  fontWeight: 600,
                  padding: "5px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                → {item.label}
              </Link>
            ))}
          </div>
        </aside>

        {/* ── MAIN FEED ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Empty state */}
          {opportunities.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                color: "#aaa",
                fontFamily: "var(--font-ui)",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>🌍</div>
              <p style={{ fontSize: 18, fontWeight: 600, color: "#666", marginBottom: 8 }}>
                No opportunities found
              </p>
              <p style={{ fontSize: 14 }}>
                Check back soon — new programs are added weekly.
              </p>
            </div>
          )}

          <FeedSection
            title="Closing This Week"
            label="Urgent"
            items={closingThisWeek}
            urgent
            accentColor={EARTH}
          />

          <FeedSection
            title="Closing in 14 Days"
            label="Act Soon"
            items={closingIn14}
            accentColor={SAND}
          />

          <FeedSection
            title="New This Month"
            label="Recently Added"
            items={newThisMonth}
            accentColor={GOLD}
          />

          <FeedSection
            title="Procurement &amp; Contracts"
            label="Tenders"
            items={procurement}
            accentColor={EARTH}
          />

          <FeedSection
            title="For the Diaspora"
            label="Diaspora Eligible"
            items={diaspora}
            accentColor={ROYAL}
          />

          <FeedSection
            title="Youth Programs"
            label="Under 35"
            items={youth}
            accentColor={FOREST}
          />

          {/* If feed has opportunities but none fall into any category */}
          {opportunities.length > 0 &&
            closingThisWeek.length === 0 &&
            closingIn14.length === 0 &&
            newThisMonth.length === 0 &&
            procurement.length === 0 &&
            diaspora.length === 0 &&
            youth.length === 0 && (
              <div>
                <div
                  style={{
                    paddingBottom: 12,
                    borderBottom: `1px solid rgba(201,168,76,0.15)`,
                    marginBottom: 18,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      fontWeight: 700,
                      color: OBSIDIAN,
                    }}
                  >
                    All Opportunities
                  </h2>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: 14,
                  }}
                >
                  {opportunities.slice(0, 12).map((opp) => (
                    <OpportunityCard key={opp.id} opp={opp} />
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: OBSIDIAN,
          padding: "48px 24px",
          borderTop: `3px solid ${GOLD}`,
          marginTop: 40,
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "white",
                  marginBottom: 6,
                }}
              >
                Alkebulan <span style={{ color: GOLD }}>United</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                The African Opportunity Engine
              </div>
            </div>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              {[
                ["Feed",           "/feed"],
                ["Explore Africa", "/countries"],
                ["Dashboard",      "/dashboard"],
                ["Sign In",        "/login"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 500,
                    fontFamily: "var(--font-ui)",
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-ui)" }}>
              © 2025 Alkebulan United Opportunities. Africa is the opportunity.
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-ui)" }}>
              Information is for guidance only. Always verify from official sources.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
