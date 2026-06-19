// FILE: app/b2b/page.tsx
import Link from "next/link";
import OrgSubmitForm from "./org-submit-form";

const GOLD     = "#C9A84C";
const FOREST   = "#0D3B2E";
const IVORY    = "#F7F2E8";
const OBSIDIAN = "#0B0B0B";
const EARTH    = "#8B3A2A";
const ROYAL    = "#1B3A6B";
const SAND     = "#D4A97A";

export default function B2BPage() {
  return (
    <main style={{ background: IVORY, minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            Alkebulan <span style={{ color: GOLD }}>United</span>
          </Link>
          <ul className="nav-links">
            <li><Link href="/feed">Feed</Link></li>
            <li><Link href="/countries">Explore Africa</Link></li>
            <li>
              <Link
                href="/b2b"
                style={{
                  color: GOLD,
                  fontWeight: 700,
                  borderBottom: `2px solid ${GOLD}`,
                  paddingBottom: 2,
                }}
              >
                For Organizations
              </Link>
            </li>
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

      {/* ── SECTION 1: HERO ── */}
      <section
        style={{
          background: FOREST,
          position: "relative",
          overflow: "hidden",
          padding: "130px 24px 120px",
        }}
      >
        <div className="grain-overlay" />

        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              radial-gradient(ellipse 70% 60% at 75% 50%, rgba(201,168,76,0.08) 0%, transparent 70%),
              radial-gradient(ellipse 40% 80% at 10% 30%, rgba(201,168,76,0.04) 0%, transparent 70%)
            `,
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          <div style={{ maxWidth: 760 }}>
            <div
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase" as const,
                color: SAND,
                marginBottom: 24,
              }}
            >
              For Organizations
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 6vw, 76px)",
                fontWeight: 700,
                color: "#FFFFFF",
                lineHeight: 1.07,
                letterSpacing: "-0.02em",
                marginBottom: 28,
              }}
            >
              Your program was built to reach builders.{" "}
              <em style={{ color: GOLD, fontStyle: "italic" }}>Help us get it to them.</em>
            </h1>

            <p
              style={{
                fontSize: "clamp(17px, 2.2vw, 21px)",
                color: "rgba(255,255,255,0.72)",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                lineHeight: 1.65,
                marginBottom: 44,
                maxWidth: 620,
              }}
            >
              10,000+ verified African entrepreneurs with complete profiles. We know their country,
              sector, stage, age, and diaspora status. You tell us who qualifies. We get it to them
              directly.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" as const }}>
              <a
                href="#submit"
                className="btn-primary"
                style={{ fontSize: 15, padding: "17px 38px" }}
              >
                List Your Program →
              </a>
              <a
                href="#pricing"
                className="btn-secondary"
                style={{
                  fontSize: 15,
                  padding: "17px 38px",
                  color: GOLD,
                  borderColor: "rgba(201,168,76,0.4)",
                }}
              >
                View Pricing →
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: `linear-gradient(to bottom, transparent, ${IVORY})`,
            pointerEvents: "none",
          }}
        />
      </section>

      {/* ── SECTION 2: WHO IT'S FOR ── */}
      <section style={{ background: "white", padding: "96px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center" as const, marginBottom: 56 }}>
            <div
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: GOLD,
                marginBottom: 16,
              }}
            >
              Who This Serves
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.5vw, 46px)",
                fontWeight: 700,
                color: OBSIDIAN,
                letterSpacing: "-0.02em",
              }}
            >
              Built for organizations that create African opportunity
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                icon: "◈",
                title: "Development Banks",
                body: "Reach verified entrepreneurs in your target regions and sectors. We match your criteria to real applicants.",
              },
              {
                icon: "◉",
                title: "Government Ministries",
                body: "Publicize tenders, grants, and procurement opportunities directly to qualified businesses.",
              },
              {
                icon: "◆",
                title: "Accelerators & Foundations",
                body: "Find your next cohort from our database of ambitious African entrepreneurs.",
              },
              {
                icon: "◈",
                title: "Corporations",
                body: "Supplier development programs that reach authentic small businesses, not just consultants.",
              },
              {
                icon: "◇",
                title: "Diaspora Investment Funds",
                body: "Connect your capital directly to verified diaspora entrepreneurs with business plans and registrations.",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  background: "white",
                  borderTop: `3px solid ${GOLD}`,
                  border: `1px solid rgba(201,168,76,0.15)`,
                  borderTopWidth: 3,
                  borderTopColor: GOLD,
                  padding: "28px 24px",
                  borderRadius: 2,
                }}
              >
                <div style={{ fontSize: 26, color: GOLD, marginBottom: 14 }}>{card.icon}</div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 700,
                    color: FOREST,
                    marginBottom: 10,
                    lineHeight: 1.3,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "#666",
                    lineHeight: 1.7,
                    fontFamily: "var(--font-body)",
                    margin: 0,
                  }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: WHAT YOU GET ── */}
      <section style={{ background: IVORY, padding: "96px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center" as const, marginBottom: 60 }}>
            <div
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: GOLD,
                marginBottom: 16,
              }}
            >
              Your Reach
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.5vw, 46px)",
                fontWeight: 700,
                color: OBSIDIAN,
                letterSpacing: "-0.02em",
              }}
            >
              Not a job board. Not a directory. A matching engine.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
              marginBottom: 56,
            }}
          >
            {[
              {
                title: "Verified Profiles",
                body: "Every user has confirmed their country, business stage, sector, and citizenship status. You reach real people, not bots.",
              },
              {
                title: "Direct Matching",
                body: "We push your opportunity to users who meet your eligibility criteria. No broadcasting to the wrong audience.",
              },
              {
                title: "Engagement Data",
                body: "See how many users viewed, saved, and applied to your listing. Real engagement signals.",
              },
            ].map((block, i) => (
              <div
                key={block.title}
                style={{
                  background: "white",
                  padding: "40px 32px",
                  borderTop: `3px solid ${GOLD}`,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: GOLD,
                    marginBottom: 14,
                  }}
                >
                  0{i + 1}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 20,
                    fontWeight: 700,
                    color: FOREST,
                    marginBottom: 14,
                  }}
                >
                  {block.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: "#555",
                    lineHeight: 1.7,
                    fontFamily: "var(--font-body)",
                    margin: 0,
                  }}
                >
                  {block.body}
                </p>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              border: `1px solid rgba(201,168,76,0.18)`,
              background: "white",
            }}
          >
            {[
              { stat: "10,000+", label: "Verified profiles" },
              { stat: "54",      label: "African countries" },
              { stat: "12",      label: "Sectors covered" },
              { stat: "Weekly",  label: "Opportunity feed" },
            ].map((item, i) => (
              <div
                key={item.label}
                style={{
                  padding: "36px 20px",
                  textAlign: "center" as const,
                  borderRight: i < 3 ? `1px solid rgba(201,168,76,0.15)` : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 36,
                    fontWeight: 800,
                    color: GOLD,
                    marginBottom: 8,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {item.stat}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#777",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase" as const,
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: PRICING ── */}
      <section id="pricing" style={{ background: FOREST, padding: "96px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center" as const, marginBottom: 60 }}>
            <div
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: SAND,
                marginBottom: 16,
              }}
            >
              How It Works
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.5vw, 46px)",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              Three ways to reach your audience
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
              alignItems: "start",
            }}
          >
            {/* Tier 1 — Free */}
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 4,
                padding: "36px 28px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: 8,
                }}
              >
                Free
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "white",
                  marginBottom: 24,
                }}
              >
                Standard Listing
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 32px",
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: 12,
                }}
              >
                {[
                  "Submit your program for review",
                  "Added to database after verification (3-5 business days)",
                  "Appears in search results and feed",
                  "Linked from country and sector pages",
                ].map((feat) => (
                  <li
                    key={feat}
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: 14,
                      color: "rgba(255,255,255,0.72)",
                      fontFamily: "var(--font-body)",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: GOLD, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <a
                href="#submit"
                className="btn-secondary"
                style={{
                  display: "block",
                  textAlign: "center" as const,
                  padding: "14px 20px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: GOLD,
                  borderColor: "rgba(201,168,76,0.4)",
                  textDecoration: "none",
                }}
              >
                Submit for Free →
              </a>
            </div>

            {/* Tier 2 — Featured */}
            <div
              style={{
                background: "white",
                borderRadius: 4,
                padding: "36px 28px",
                position: "relative" as const,
                boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  position: "absolute" as const,
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: GOLD,
                  color: FOREST,
                  fontFamily: "var(--font-ui)",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase" as const,
                  padding: "4px 14px",
                  borderRadius: 2,
                  whiteSpace: "nowrap" as const,
                }}
              >
                Most Popular
              </div>
              <div
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: GOLD,
                  marginBottom: 4,
                }}
              >
                $199 / listing
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  fontWeight: 700,
                  color: FOREST,
                  marginBottom: 24,
                }}
              >
                Featured Listing
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 32px",
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: 12,
                }}
              >
                {[
                  "Priority placement at top of search results",
                  "Highlighted in weekly opportunity feed",
                  "Direct email to matched users (up to 5,000)",
                  "Deadline reminder emails",
                  "30-day featured badge",
                ].map((feat) => (
                  <li
                    key={feat}
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: 14,
                      color: "#444",
                      fontFamily: "var(--font-body)",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: GOLD, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:partnerships@alkebulanuop.com"
                className="btn-primary"
                style={{
                  display: "block",
                  textAlign: "center" as const,
                  padding: "14px 20px",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Get Featured →
              </a>
            </div>

            {/* Tier 3 — Partner */}
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 4,
                padding: "36px 28px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: 8,
                }}
              >
                Contact us
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "white",
                  marginBottom: 24,
                }}
              >
                Partner Integration
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 32px",
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: 12,
                }}
              >
                {[
                  "Full API access to user database",
                  "Bulk notifications to matched segments",
                  "Real-time analytics on engagement",
                  "Custom eligibility filter builder",
                  "Dedicated account manager",
                  "Co-branded opportunity pages",
                ].map((feat) => (
                  <li
                    key={feat}
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: 14,
                      color: "rgba(255,255,255,0.72)",
                      fontFamily: "var(--font-body)",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: GOLD, flexShrink: 0, marginTop: 1 }}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:partnerships@alkebulanuop.com"
                className="btn-secondary"
                style={{
                  display: "block",
                  textAlign: "center" as const,
                  padding: "14px 20px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: GOLD,
                  borderColor: "rgba(201,168,76,0.4)",
                  textDecoration: "none",
                }}
              >
                Contact Partners Team →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: ORG LOGOS STRIP ── */}
      <section style={{ background: "white", padding: "60px 24px" }}>
        <div className="container">
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(18px, 2.5vw, 26px)",
              fontWeight: 700,
              color: OBSIDIAN,
              textAlign: "center" as const,
              marginBottom: 32,
            }}
          >
            Built for organizations like:
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap" as const,
              gap: 10,
              justifyContent: "center" as const,
            }}
          >
            {[
              "African Development Bank",
              "Tony Elumelu Foundation",
              "Government Ministries",
              "AGRA",
              "MasterCard Foundation",
              "World Bank IFC",
              "Bill & Melinda Gates Foundation",
              "Mo Ibrahim Foundation",
              "African Union Commission",
              "Dangote Foundation",
              "Standard Bank",
            ].map((name) => (
              <span
                key={name}
                style={{
                  padding: "10px 20px",
                  border: `1px solid rgba(11,11,11,0.15)`,
                  borderRadius: 40,
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: FOREST,
                  whiteSpace: "nowrap" as const,
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: SUBMIT FORM ── */}
      <section id="submit" style={{ background: IVORY, padding: "96px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center" as const, marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 700,
                color: OBSIDIAN,
                letterSpacing: "-0.02em",
                marginBottom: 14,
              }}
            >
              Submit Your Program
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "#666",
                fontFamily: "var(--font-body)",
                maxWidth: 520,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Free listings reviewed within 3–5 business days. Featured listings go live within 24 hours.
            </p>
          </div>

          <OrgSubmitForm />
        </div>
      </section>

      {/* ── SECTION 7: FINAL CTA ── */}
      <section
        style={{
          background: FOREST,
          padding: "100px 24px",
          textAlign: "center" as const,
          position: "relative" as const,
          overflow: "hidden",
        }}
      >
        <div className="grain-overlay" />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(20px, 2.8vw, 30px)",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.6,
              maxWidth: 700,
              margin: "0 auto 44px",
            }}
          >
            &ldquo;The programs exist but the people don&apos;t know. The people exist but they
            don&apos;t know the programs. This platform closes that gap.&rdquo;
          </p>
          <a
            href="#submit"
            className="btn-primary"
            style={{ fontSize: 16, padding: "19px 52px", textDecoration: "none" }}
          >
            List Your Program Today →
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: OBSIDIAN,
          padding: "56px 24px 40px",
          borderTop: `3px solid ${GOLD}`,
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap" as const,
              gap: 32,
              marginBottom: 40,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "white",
                  marginBottom: 8,
                }}
              >
                Alkebulan <span style={{ color: GOLD }}>United</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                The African Opportunity Engine
              </div>
            </div>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" as const }}>
              {[
                ["Feed",              "/feed"],
                ["Explore Africa",    "/countries"],
                ["For Organizations", "/b2b"],
                ["Dashboard",        "/dashboard"],
                ["Sign In",          "/login"],
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
              paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap" as const,
              gap: 12,
            }}
          >
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-ui)" }}>
              © 2026 Alkebulan United Opportunities.
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-ui)" }}>
              Information is for guidance only. Always verify eligibility from official sources before applying.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
