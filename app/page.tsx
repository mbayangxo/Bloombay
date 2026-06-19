import Link from "next/link";

const GOLD = "#C9A84C";
const FOREST = "#0D3B2E";
const IVORY = "#F7F2E8";
const OBSIDIAN = "#0B0B0B";
const EARTH = "#8B3A2A";
const ROYAL = "#1B3A6B";
const SAND = "#D4A97A";

export default function LandingPage() {
  return (
    <main style={{ background: IVORY, minHeight: "100vh" }}>

      {/* ── 1. NAV ── */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            Alkebulan <span style={{ color: GOLD }}>United</span>
          </Link>
          <ul className="nav-links">
            <li><Link href="/feed">Feed</Link></li>
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

      {/* ── 2. HERO ── */}
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
          }}
        />

        {/* Lion SVG */}
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
            <circle cx="200" cy="160" r="85" fill={GOLD} />
            <ellipse cx="200" cy="160" rx="110" ry="105" fill={GOLD} opacity="0.4" />
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
            <ellipse cx="180" cy="148" rx="10" ry="8" fill="#0D3B2E" />
            <ellipse cx="220" cy="148" rx="10" ry="8" fill="#0D3B2E" />
            <circle cx="180" cy="147" r="4" fill="#C9A84C" opacity="0.5" />
            <circle cx="220" cy="147" r="4" fill="#C9A84C" opacity="0.5" />
            <ellipse cx="200" cy="290" rx="70" ry="90" fill={GOLD} />
            <ellipse cx="150" cy="370" rx="25" ry="14" fill={GOLD} />
            <ellipse cx="250" cy="370" rx="25" ry="14" fill={GOLD} />
            <path d="M155 375 L145 395 M163 373 L155 395 M171 372 L163 393" stroke={GOLD} strokeWidth="2" opacity="0.5" />
            <path d="M245 375 L235 395 M253 373 L245 395 M261 372 L253 393" stroke={GOLD} strokeWidth="2" opacity="0.5" />
          </svg>
        </div>

        <div className="container" style={{ position: "relative" }}>
          <div style={{ maxWidth: 720 }}>
            <div className="section-label" style={{ marginBottom: 24, color: SAND }}>
              Alkebulan United Opportunities
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(46px, 7vw, 84px)",
                fontWeight: 700,
                color: "#FFFFFF",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: 28,
              }}
            >
              Africa was built to make
              <br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>you wealthy.</em>
            </h1>
            <p
              style={{
                fontSize: "clamp(17px, 2.2vw, 21px)",
                color: "rgba(255,255,255,0.72)",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                lineHeight: 1.6,
                marginBottom: 44,
                maxWidth: 580,
              }}
            >
              Loans. Grants. Contracts. Procurement. Export opportunities. Partner networks.
              For Africans everywhere — on the continent and in the diaspora.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/login?mode=signup" className="btn-primary" style={{ fontSize: 15, padding: "17px 38px" }}>
                Claim Your Opportunities →
              </Link>
              <Link
                href="/feed"
                className="btn-secondary"
                style={{ fontSize: 15, padding: "17px 38px", color: GOLD, borderColor: "rgba(201,168,76,0.4)" }}
              >
                See What&apos;s Available
              </Link>
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
          }}
        />
      </section>

      {/* ── 3. NOT A DIRECTORY STRIP ── */}
      <section style={{ background: "white", padding: "88px 24px", borderBottom: `1px solid rgba(201,168,76,0.15)` }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(26px, 4vw, 44px)",
                fontWeight: 700,
                color: OBSIDIAN,
                letterSpacing: "-0.01em",
                marginBottom: 14,
              }}
            >
              This is not a grants directory.
            </p>
            <p
              style={{
                fontSize: 18,
                color: "#555",
                fontFamily: "var(--font-body)",
              }}
            >
              It&apos;s an operating system for African wealth creation.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 0,
              border: `1px solid rgba(201,168,76,0.18)`,
            }}
          >
            {[
              { symbol: "◈", label: "Grants" },
              { symbol: "◇", label: "Loans" },
              { symbol: "◉", label: "Procurement Contracts" },
              { symbol: "◆", label: "Tenders" },
              { symbol: "▲", label: "Accelerators" },
              { symbol: "◎", label: "Export Channels" },
              { symbol: "⬡", label: "Partner Networks" },
              { symbol: "◻", label: "Land & Investment Programs" },
            ].map((item, i) => (
              <div
                key={item.label}
                style={{
                  padding: "36px 24px",
                  textAlign: "center",
                  borderRight: (i + 1) % 4 !== 0 ? `1px solid rgba(201,168,76,0.15)` : "none",
                  borderBottom: i < 4 ? `1px solid rgba(201,168,76,0.15)` : "none",
                }}
              >
                <div style={{ fontSize: 28, color: GOLD, marginBottom: 12 }}>{item.symbol}</div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: FOREST,
                    letterSpacing: "0.01em",
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. THE OPPORTUNITY PATH ── */}
      <section style={{ background: IVORY, padding: "96px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-label" style={{ marginBottom: 14 }}>How wealth is built</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(30px, 4vw, 50px)",
                fontWeight: 700,
                color: OBSIDIAN,
                letterSpacing: "-0.02em",
              }}
            >
              The Opportunity Path
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 0,
              justifyContent: "center",
            }}
          >
            {[
              { step: null, label: "Goal", sub: "Define what you want to build" },
              { step: null, label: "Status Assessment", sub: "Who you are, where you qualify" },
              { step: "1", label: "Register Business", sub: "Formalize in target country" },
              { step: "2", label: "Program A — Funding", sub: "Grant or loan to start" },
              { step: "3", label: "Accelerator B", sub: "Structured growth support" },
              { step: "4", label: "Procurement Tender C", sub: "Win a government contract" },
            ].map((node, i, arr) => (
              <div key={node.label} style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    width: 140,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: node.step ? FOREST : GOLD,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {node.step ? (
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 18,
                          fontWeight: 800,
                          color: GOLD,
                        }}
                      >
                        {node.step}
                      </span>
                    ) : (
                      <span style={{ fontSize: 20, color: FOREST }}>◈</span>
                    )}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 13,
                        fontWeight: 700,
                        color: FOREST,
                        marginBottom: 4,
                      }}
                    >
                      {node.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#777", lineHeight: 1.4 }}>{node.sub}</div>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0 4px",
                      marginBottom: 40,
                    }}
                  >
                    <div style={{ width: 32, height: 1, background: `rgba(201,168,76,0.5)` }} />
                    <span style={{ fontSize: 12, color: GOLD }}>›</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. WHO THIS IS FOR ── */}
      <section style={{ background: "white", padding: "96px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Built For You</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(30px, 4vw, 50px)",
                fontWeight: 700,
                color: OBSIDIAN,
                letterSpacing: "-0.02em",
              }}
            >
              You recognize yourself in one of these.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {[
              "You've been sending money home. Start owning something there.",
              "You know you want to build. You don't know what the market rewards.",
              "You have the citizenship. You don't know the programs.",
              "You're already in business. You need the contracts.",
            ].map((quote) => (
              <div
                key={quote}
                style={{
                  background: FOREST,
                  borderLeft: `4px solid ${GOLD}`,
                  padding: "40px 32px",
                  borderRadius: 2,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(17px, 2vw, 22px)",
                    fontStyle: "italic",
                    color: "white",
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  &ldquo;{quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. PROCUREMENT INTELLIGENCE ── */}
      <section style={{ background: FOREST, padding: "96px 24px" }}>
        <div className="container">
          <div style={{ maxWidth: 720, marginBottom: 60 }}>
            <div className="section-label" style={{ color: SAND, marginBottom: 18 }}>Procurement Intelligence</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(30px, 4.5vw, 56px)",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.02em",
                marginBottom: 24,
                lineHeight: 1.1,
              }}
            >
              Governments spend billions.
              <br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>You should be in the room.</em>
            </h2>
            <p
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.7,
                fontFamily: "var(--font-body)",
                maxWidth: 600,
              }}
            >
              Contracts beat grants. They&apos;re renewable, they grow, and they build relationships that create more contracts.
              We track government procurement across 54 African nations.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {[
              { stat: "54", label: "Countries Tracked" },
              { stat: "Billions", label: "in Annual Procurement" },
              { stat: "Open Now", label: "Contracts Available" },
              { stat: "Ongoing", label: "Relationship-Building Opportunities" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(201,168,76,0.15)",
                  padding: "40px 28px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 38,
                    fontWeight: 800,
                    color: GOLD,
                    marginBottom: 10,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {item.stat}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. TRUST LAYER ── */}
      <section style={{ background: IVORY, padding: "96px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Verification</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.5vw, 46px)",
                fontWeight: 700,
                color: OBSIDIAN,
                letterSpacing: "-0.02em",
              }}
            >
              Built on what&apos;s real
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
              marginBottom: 56,
            }}
          >
            {[
              { icon: "◈", title: "Real Programs", body: "Not invented. Every listing is verified against the issuing organization's official channels." },
              { icon: "◆", title: "Real Sources", body: "Official government and organization links, so you can confirm everything we show you." },
              { icon: "◉", title: "Real Applicants", body: "Verified testimonials from people who applied and received — not marketing copy." },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "white",
                  padding: "36px 28px",
                  borderTop: `3px solid ${GOLD}`,
                }}
              >
                <div style={{ fontSize: 28, color: GOLD, marginBottom: 16 }}>{item.icon}</div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 700,
                    color: FOREST,
                    marginBottom: 10,
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>{item.body}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div
            style={{
              maxWidth: 780,
              margin: "0 auto",
              background: "white",
              borderLeft: `5px solid ${GOLD}`,
              padding: "48px 52px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(18px, 2.2vw, 26px)",
                fontStyle: "italic",
                color: FOREST,
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              &ldquo;I didn&apos;t know NYIF existed until this platform. Applied in March. Received ₦5M in August.
              I used it to buy my first delivery van.&rdquo;
            </p>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: GOLD,
                letterSpacing: "0.04em",
              }}
            >
              — Amara O., Lagos, Nigeria
            </p>
          </div>
        </div>
      </section>

      {/* ── 8. DIASPORA SECTION ── */}
      <section style={{ background: "white", padding: "96px 24px" }}>
        <div className="container">
          <div style={{ maxWidth: 720, marginBottom: 56 }}>
            <div className="section-label" style={{ marginBottom: 18 }}>For the Diaspora</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 700,
                color: OBSIDIAN,
                letterSpacing: "-0.02em",
                marginBottom: 24,
                lineHeight: 1.1,
              }}
            >
              $100 billion leaves Africa in remittances every year.
              <br />
              <em style={{ color: GOLD, fontStyle: "italic" }}>Some of it should come back as ownership.</em>
            </h2>
            <p
              style={{
                fontSize: 17,
                color: "#555",
                lineHeight: 1.7,
                fontFamily: "var(--font-body)",
              }}
            >
              Dozens of African governments have created dedicated programs for the diaspora — fast-track citizenship,
              non-resident business registration, and investment funds that don&apos;t require you to be on the ground.
              We&apos;ve found them all.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
              marginBottom: 44,
            }}
          >
            {[
              {
                icon: "◈",
                title: "Citizenship Programs",
                body: "Fast-track pathways for African-origin diaspora. Several nations offer streamlined citizenship by descent or investment.",
              },
              {
                icon: "◆",
                title: "Non-Resident Business Programs",
                body: "Register and operate a business in an African country without physically relocating. We list all active programs.",
              },
              {
                icon: "◉",
                title: "Diaspora Investment Funds",
                body: "Dedicated capital programs for entrepreneurs in the diaspora. Some require as little as proof of origin.",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  border: `1px solid rgba(201,168,76,0.25)`,
                  padding: "36px 28px",
                  background: IVORY,
                }}
              >
                <div style={{ fontSize: 26, color: GOLD, marginBottom: 16 }}>{card.icon}</div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 700,
                    color: FOREST,
                    marginBottom: 10,
                  }}
                >
                  {card.title}
                </h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>{card.body}</p>
              </div>
            ))}
          </div>

          <div>
            <Link
              href="/feed?filter=diaspora"
              className="btn-forest"
              style={{ fontSize: 14, padding: "15px 34px" }}
            >
              Find Diaspora Programs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. B2B CALLOUT ── */}
      <section style={{ background: FOREST, padding: "72px 24px" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 32,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(22px, 3vw, 34px)",
                  fontWeight: 700,
                  color: "white",
                  marginBottom: 10,
                }}
              >
                Do you run a program, fund, or government initiative?
              </p>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-body)" }}>
                Reach 10,000+ verified African entrepreneurs directly.
              </p>
            </div>
            <Link href="/b2b" className="btn-primary" style={{ fontSize: 14, padding: "17px 36px", flexShrink: 0 }}>
              List Your Program →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10. OPPORTUNITY FEED PREVIEW ── */}
      <section style={{ background: IVORY, padding: "96px 24px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>New This Week</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.5vw, 46px)",
                fontWeight: 700,
                color: OBSIDIAN,
                letterSpacing: "-0.02em",
              }}
            >
              Active opportunities you should know about
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
              marginBottom: 36,
            }}
          >
            {[
              {
                flag: "🌍",
                country: "Pan-Africa",
                title: "Tony Elumelu Foundation Entrepreneurship Programme",
                type: "Grant",
                amount: "$5,000",
                sector: "All Sectors",
              },
              {
                flag: "🇳🇬",
                country: "Nigeria",
                title: "Nigeria Youth Investment Fund",
                type: "Loan",
                amount: "Up to ₦25M",
                sector: "Youth",
              },
              {
                flag: "🇬🇭",
                country: "Ghana",
                title: "GIPC Investor Support Programme",
                type: "Investment",
                amount: "Varies",
                sector: "All sectors",
              },
              {
                flag: "🇷🇼",
                country: "Rwanda",
                title: "Rwanda BDF SME Loan",
                type: "Loan",
                amount: "Flexible",
                sector: "All Sectors",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="opp-card"
                style={{
                  background: "white",
                  border: `1px solid rgba(201,168,76,0.3)`,
                  padding: "28px 24px",
                  borderRadius: 2,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 22 }}>{card.flag}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {card.country}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 700,
                    color: FOREST,
                    lineHeight: 1.3,
                    marginBottom: 14,
                  }}
                >
                  {card.title}
                </h3>
                <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      background: `rgba(201,168,76,0.12)`,
                      color: EARTH,
                      borderRadius: 2,
                    }}
                  >
                    {card.type}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#888",
                      padding: "4px 10px",
                      background: "rgba(0,0,0,0.04)",
                      borderRadius: 2,
                    }}
                  >
                    {card.sector}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: `1px solid rgba(201,168,76,0.15)`,
                    paddingTop: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 20,
                      fontWeight: 800,
                      color: GOLD,
                    }}
                  >
                    {card.amount}
                  </span>
                  <Link
                    href="/feed"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: FOREST,
                      letterSpacing: "0.02em",
                    }}
                  >
                    → View
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link
              href="/feed"
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: FOREST,
                borderBottom: `1px solid rgba(13,59,46,0.3)`,
                paddingBottom: 2,
              }}
            >
              See all 47+ opportunities →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 11. FINAL CTA ── */}
      <section
        style={{
          background: IVORY,
          padding: "120px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative gold rings */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 700,
            border: `1px solid rgba(201,168,76,0.09)`,
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
            width: 500,
            height: 500,
            border: `1px solid rgba(201,168,76,0.12)`,
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
            width: 300,
            height: 300,
            border: `1px solid rgba(201,168,76,0.16)`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative" }}>
          <div className="section-label" style={{ marginBottom: 24 }}>Your moment</div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(34px, 5vw, 62px)",
              fontWeight: 800,
              color: OBSIDIAN,
              letterSpacing: "-0.02em",
              marginBottom: 24,
              lineHeight: 1.1,
              maxWidth: 760,
              margin: "0 auto 24px",
            }}
          >
            The programs exist. The funds exist.
            <br />
            The contracts are open.
          </h2>
          <p
            style={{
              fontSize: "clamp(18px, 2.2vw, 24px)",
              color: GOLD,
              fontStyle: "italic",
              fontFamily: "var(--font-body)",
              marginBottom: 48,
            }}
          >
            The only thing missing was a platform that made it yours.
          </p>
          <Link
            href="/login?mode=signup"
            className="btn-primary"
            style={{ fontSize: 16, padding: "19px 52px" }}
          >
            Build Your Opportunity Profile →
          </Link>
          <p
            style={{
              marginTop: 24,
              fontSize: 13,
              color: "#999",
            }}
          >
            Free to join. Your profile. Your roadmap. Your wealth.
          </p>
        </div>
      </section>

      {/* ── 12. FOOTER ── */}
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
              flexWrap: "wrap",
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
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {[
                ["Feed", "/feed"],
                ["Explore Africa", "/countries"],
                ["Dashboard", "/dashboard"],
                ["For Organizations", "/b2b"],
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
              paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              © 2026 Alkebulan United Opportunities.
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
              Information is for guidance only. Always verify eligibility from official sources before applying.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
