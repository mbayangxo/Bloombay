import Link from "next/link";

const GOLD = "#C9A84C";
const FOREST = "#0D3B2E";
const IVORY = "#F7F2E8";
const OBSIDIAN = "#0B0B0B";
const EARTH = "#8B3A2A";
const SAND = "#D4A97A";

const OPPORTUNITY_TYPES = [
  { label: "Grants", icon: "◈", desc: "Non-repayable funding for your business or project" },
  { label: "Loans", icon: "◇", desc: "Affordable credit from government & development banks" },
  { label: "Tenders", icon: "◉", desc: "Government contracts open for bid" },
  { label: "Accelerators", icon: "◈", desc: "Structured programs with funding and mentorship" },
  { label: "Fellowships", icon: "◆", desc: "Paid programs for innovators and creatives" },
  { label: "Procurement", icon: "◈", desc: "Corporate and government supply chain opportunities" },
];

const SAMPLE_CARDS = [
  {
    title: "Tony Elumelu Foundation Entrepreneurship Programme",
    country: "Pan-Africa",
    type: "Grant",
    amount: "$5,000 USD",
    sector: "All Sectors",
    badge: "verified",
    flag: "🌍",
  },
  {
    title: "Kenya Women Enterprise Fund",
    country: "Kenya",
    type: "Loan",
    amount: "From KES 50,000",
    sector: "All Sectors · Women",
    badge: "verified",
    flag: "🇰🇪",
  },
  {
    title: "Rwanda BDF SME Loan Programme",
    country: "Rwanda",
    type: "Loan",
    amount: "Flexible",
    sector: "All Sectors",
    badge: "verified",
    flag: "🇷🇼",
  },
  {
    title: "Google for Startups Africa Accelerator",
    country: "Pan-Africa",
    type: "Accelerator",
    amount: "Equity-Free",
    sector: "Tech",
    badge: "verified",
    flag: "🌍",
  },
  {
    title: "Nigeria Youth Investment Fund",
    country: "Nigeria",
    type: "Loan",
    amount: "Up to ₦25M",
    sector: "All Sectors · Youth",
    badge: "verified",
    flag: "🇳🇬",
  },
  {
    title: "Maroc PME Support Programme",
    country: "Morocco",
    type: "Fund",
    amount: "Varies",
    sector: "Manufacturing · Tech",
    badge: "verified",
    flag: "🇲🇦",
  },
];

const COUNTRIES = [
  "🇸🇳 Senegal", "🇬🇭 Ghana", "🇳🇬 Nigeria", "🇷🇼 Rwanda",
  "🇰🇪 Kenya", "🇲🇦 Morocco", "🇿🇦 South Africa", "🇨🇮 Côte d'Ivoire",
  "🇬🇳 Guinea", "🇲🇱 Mali", "🇪🇹 Ethiopia", "🇹🇿 Tanzania",
  "🇺🇬 Uganda", "🇲🇿 Mozambique", "🇿🇲 Zambia", "+ 40 more",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell us who you are",
    body: "Your citizenship, residence, age, business stage, and sector. Takes 3 minutes.",
  },
  {
    step: "02",
    title: "We match you to what you qualify for",
    body: "Our engine reads eligibility criteria across hundreds of programs and surfaces your best matches.",
  },
  {
    step: "03",
    title: "Understand exactly why you qualify",
    body: "Every opportunity explains what matches, what might not, and what documents you need.",
  },
  {
    step: "04",
    title: "Apply with guidance",
    body: "Get a step-by-step application plan, document checklist, and AI writing support.",
  },
];

export default function LandingPage() {
  return (
    <main style={{ background: IVORY, minHeight: "100vh" }}>
      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            Alkebulan <span>United</span>
          </Link>
          <ul className="nav-links">
            <li><Link href="/countries">Explore Africa</Link></li>
            <li><Link href="#how">How It Works</Link></li>
            <li><Link href="#opportunities">Opportunities</Link></li>
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

      {/* ── HERO ── */}
      <section
        style={{
          background: FOREST,
          position: "relative",
          overflow: "hidden",
          padding: "120px 24px 100px",
        }}
      >
        {/* Grain texture */}
        <div className="grain-overlay" />

        {/* Gold geometric lines */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              radial-gradient(ellipse 70% 60% at 75% 50%, rgba(201,168,76,0.08) 0%, transparent 70%),
              radial-gradient(ellipse 40% 80% at 10% 30%, rgba(201,168,76,0.04) 0%, transparent 70%)
            `,
          }}
        />

        {/* Lion silhouette motif */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "4%",
            top: "50%",
            transform: "translateY(-50%)",
            width: 520,
            height: 520,
            opacity: 0.06,
          }}
        >
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Stylized lion head silhouette */}
            <circle cx="200" cy="160" r="85" fill={GOLD} />
            <ellipse cx="200" cy="160" rx="110" ry="105" fill={GOLD} opacity="0.4" />
            {/* Mane */}
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              const rad = (angle * Math.PI) / 180;
              const x = 200 + Math.cos(rad) * 115;
              const y = 160 + Math.sin(rad) * 110;
              return (
                <ellipse
                  key={i}
                  cx={x}
                  cy={y}
                  rx="22"
                  ry="14"
                  transform={`rotate(${angle} ${x} ${y})`}
                  fill={GOLD}
                />
              );
            })}
            {/* Eyes */}
            <ellipse cx="180" cy="148" rx="10" ry="8" fill="#0D3B2E" />
            <ellipse cx="220" cy="148" rx="10" ry="8" fill="#0D3B2E" />
            <circle cx="180" cy="147" r="4" fill="#C9A84C" opacity="0.5" />
            <circle cx="220" cy="147" r="4" fill="#C9A84C" opacity="0.5" />
            {/* Body */}
            <ellipse cx="200" cy="290" rx="70" ry="90" fill={GOLD} />
            {/* Paws */}
            <ellipse cx="150" cy="370" rx="25" ry="14" fill={GOLD} />
            <ellipse cx="250" cy="370" rx="25" ry="14" fill={GOLD} />
            {/* Claw marks */}
            <path d="M155 375 L145 395 M163 373 L155 395 M171 372 L163 393" stroke={GOLD} strokeWidth="2" opacity="0.5" />
            <path d="M245 375 L235 395 M253 373 L245 395 M261 372 L253 393" stroke={GOLD} strokeWidth="2" opacity="0.5" />
          </svg>
        </div>

        <div className="container" style={{ position: "relative" }}>
          <div style={{ maxWidth: 700 }}>
            <div className="section-label" style={{ marginBottom: 20, color: SAND }}>
              Alkebulan United Opportunities
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(44px, 7vw, 82px)",
                fontWeight: 700,
                color: "#FFFFFF",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              Africa is the
              <br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>opportunity.</em>
            </h1>

            <p
              style={{
                fontSize: "clamp(18px, 2.5vw, 24px)",
                color: "rgba(255,255,255,0.7)",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                lineHeight: 1.5,
                marginTop: 24,
                marginBottom: 40,
                maxWidth: 560,
              }}
            >
              Find every loan, grant, tender, contract, accelerator, and fund
              you qualify for — across 54 African nations.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/login?mode=signup" className="btn-primary" style={{ fontSize: 14, padding: "16px 36px" }}>
                Find My Opportunities →
              </Link>
              <Link href="#how" className="btn-secondary" style={{ fontSize: 14, padding: "16px 36px", color: GOLD, borderColor: "rgba(201,168,76,0.4)" }}>
                How It Works
              </Link>
            </div>

            <p
              style={{
                marginTop: 36,
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-ui)",
              }}
            >
              Built for Africans everywhere — citizens, diaspora, first-generation, entrepreneurs, creatives, and founders.
            </p>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: `linear-gradient(to bottom, transparent, ${IVORY})`,
          }}
        />
      </section>

      {/* ── TYPES STRIP ── */}
      <section style={{ background: "white", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 0,
            }}
          >
            {OPPORTUNITY_TYPES.map((t, i) => (
              <div
                key={t.label}
                style={{
                  padding: "28px 20px",
                  borderRight: i < OPPORTUNITY_TYPES.length - 1 ? "1px solid rgba(201,168,76,0.12)" : "none",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 22, color: GOLD, marginBottom: 8 }}>{t.icon}</div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: FOREST,
                    marginBottom: 4,
                  }}
                >
                  {t.label}
                </div>
                <div style={{ fontSize: 11, color: "#888", lineHeight: 1.4 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: "100px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>
              How The Engine Works
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 700,
                color: OBSIDIAN,
                letterSpacing: "-0.02em",
              }}
            >
              From profile to opportunity
              <br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>in minutes.</em>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 2,
            }}
          >
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                style={{
                  background: "white",
                  padding: "40px 32px",
                  borderTop: `3px solid ${GOLD}`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 52,
                    fontWeight: 800,
                    color: "rgba(201,168,76,0.12)",
                    lineHeight: 1,
                    position: "absolute",
                    top: 20,
                    right: 24,
                  }}
                >
                  {step.step}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 19,
                    fontWeight: 700,
                    color: FOREST,
                    marginBottom: 12,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAMPLE OPPORTUNITIES ── */}
      <section
        id="opportunities"
        style={{ padding: "100px 24px", background: FOREST }}
      >
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="section-label" style={{ color: SAND, marginBottom: 12 }}>
                Live Opportunities
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                }}
              >
                Programs available right now
              </h2>
            </div>
            <Link
              href="/login?mode=signup"
              className="btn-primary"
              style={{ flexShrink: 0 }}
            >
              See All →
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 16,
            }}
          >
            {SAMPLE_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: 4,
                  padding: "28px 24px",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(201,168,76,0.06)";
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 22 }}>{card.flag}</span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.5)",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {card.country}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      borderRadius: 2,
                      background: "rgba(13,59,46,0.6)",
                      color: "#4CAF8B",
                    }}
                  >
                    ✓ Verified
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 700,
                    color: "white",
                    lineHeight: 1.3,
                    marginBottom: 12,
                  }}
                >
                  {card.title}
                </h3>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      background: "rgba(201,168,76,0.15)",
                      color: GOLD,
                      borderRadius: 2,
                    }}
                  >
                    {card.type}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.5)",
                      padding: "4px 10px",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: 2,
                    }}
                  >
                    {card.sector}
                  </span>
                </div>

                <div
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    paddingTop: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      fontWeight: 700,
                      color: GOLD,
                    }}
                  >
                    {card.amount}
                  </span>
                  <Link
                    href="/login?mode=signup"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.6)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    View & Apply →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS THIS FOR ── */}
      <section style={{ padding: "100px 24px", background: "white" }}>
        <div className="container">
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <div className="section-label" style={{ marginBottom: 20 }}>
              Built For Africans Everywhere
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 700,
                color: OBSIDIAN,
                letterSpacing: "-0.02em",
                marginBottom: 24,
              }}
            >
              Whoever you are,
              <br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>Africa has something for you.</em>
            </h2>
            <p
              style={{
                fontSize: 18,
                color: "#555",
                lineHeight: 1.7,
                fontFamily: "var(--font-body)",
                marginBottom: 52,
              }}
            >
              Whether you were born on the continent, raised in the diaspora, hold African parentage, or are building something new — this platform finds programs across 54 countries that match who you are.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 1,
              background: "rgba(201,168,76,0.15)",
            }}
          >
            {[
              "Young Founders (18–35)",
              "Women Entrepreneurs",
              "African Diaspora",
              "First-Gen Africans",
              "Citizens by Parentage",
              "Creatives & Artists",
              "Agri-preneurs",
              "Tech Builders",
              "SME Owners",
              "Social Enterprises",
              "Cultural Economy",
              "Climate Innovators",
            ].map((who) => (
              <div
                key={who}
                style={{
                  background: "white",
                  padding: "24px 20px",
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 600,
                  color: FOREST,
                  fontFamily: "var(--font-ui)",
                }}
              >
                {who}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COUNTRY STRIP ── */}
      <section style={{ padding: "80px 24px", background: IVORY }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>
              Country Coverage
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(26px, 3vw, 38px)",
                fontWeight: 700,
                color: OBSIDIAN,
              }}
            >
              Search by country, filter by you
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {COUNTRIES.map((c) => (
              <Link
                key={c}
                href="/countries"
                style={{
                  padding: "8px 16px",
                  background: "white",
                  border: "1px solid rgba(201,168,76,0.2)",
                  borderRadius: 2,
                  fontSize: 13,
                  fontWeight: 500,
                  color: FOREST,
                  transition: "all 0.15s",
                }}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ── */}
      <section
        style={{
          padding: "80px 24px",
          background: `linear-gradient(135deg, ${FOREST} 0%, #0A2E24 100%)`,
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 40,
            }}
          >
            {[
              {
                icon: "◈",
                title: "Verified Sources",
                body: "Every opportunity links to its official source. No invented programs, no misleading promises.",
              },
              {
                icon: "◆",
                title: "Eligibility Explained",
                body: "We tell you exactly why you qualify — and what might disqualify you — before you apply.",
              },
              {
                icon: "◉",
                title: "Application Steps Included",
                body: "Each listing includes a step-by-step guide, document checklist, and direct application link.",
              },
            ].map((t) => (
              <div key={t.title} style={{ textAlign: "center" }}>
                <div
                  style={{ fontSize: 32, color: GOLD, marginBottom: 16 }}
                >
                  {t.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 19,
                    fontWeight: 700,
                    color: "white",
                    marginBottom: 10,
                  }}
                >
                  {t.title}
                </h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                  {t.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "120px 24px",
          textAlign: "center",
          background: IVORY,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative gold lines */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            border: "1px solid rgba(201,168,76,0.1)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 400,
            border: "1px solid rgba(201,168,76,0.08)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative" }}>
          <div className="section-label" style={{ marginBottom: 20 }}>
            The African Opportunity Engine
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 800,
              color: OBSIDIAN,
              letterSpacing: "-0.02em",
              marginBottom: 24,
              lineHeight: 1.1,
            }}
          >
            "I did not know Africa had
            <br />
            <em style={{ color: GOLD, fontStyle: "italic" }}>
              this much available to me."
            </em>
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "#666",
              marginBottom: 44,
              fontFamily: "var(--font-body)",
            }}
          >
            You should. Start here.
          </p>
          <Link href="/login?mode=signup" className="btn-primary" style={{ fontSize: 15, padding: "18px 48px" }}>
            Create Your Free Account →
          </Link>
          <p style={{ marginTop: 20, fontSize: 12, color: "#999" }}>
            No payment required. No credit card. Just your opportunities.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: OBSIDIAN,
          padding: "48px 24px",
          borderTop: `3px solid ${GOLD}`,
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
            <div style={{ display: "flex", gap: 32 }}>
              {[
                ["Explore Africa", "/countries"],
                ["Dashboard", "/dashboard"],
                ["Admin", "/admin"],
                ["Sign In", "/login"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 500,
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
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              © 2025 Alkebulan United Opportunities. Africa is the opportunity.
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
              Information is for guidance only. Always verify from official sources.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
