"use client";
import { useState } from "react";
import Link from "next/link";

const GOLD = "#C9A84C";
const FOREST = "#0D3B2E";
const IVORY = "#F7F2E8";
const OBSIDIAN = "#0B0B0B";
const EARTH = "#8B3A2A";
const ROYAL = "#1B3A6B";
const SAND = "#D4A97A";

interface OpportunityReport {
  businessType: string;
  score: number;
  whyHighScore: string;
  programsAvailable: number;
  startupCostRange: string;
  pathLink: string;
  tags: string[];
}

function generateResults(
  country: string,
  skills: string[],
  budget: string
): OpportunityReport[] {
  const results: OpportunityReport[] = [];

  const hasSkill = (...candidates: string[]) =>
    candidates.some((s) => skills.includes(s));

  if (country === "Nigeria") {
    if (hasSkill("Fashion/Textiles")) {
      results.push({
        businessType: "Fashion & Textile Brand",
        score: 88,
        whyHighScore:
          "Nigeria has 3 active programs for fashion entrepreneurs including CBN Creative Industry Finance, TEF grants, and NAFDAC certification support. The domestic market is 220M people and growing fast.",
        programsAvailable: 5,
        startupCostRange: "$200–$2,000",
        pathLink: "/path",
        tags: ["Fashion", "Manufacturing", "Export-Potential"],
      });
    }
    if (hasSkill("Agriculture", "Cooking/Food")) {
      results.push({
        businessType: "Agri-Food Processing Business",
        score: 91,
        whyHighScore:
          "Nigeria's CBN AGSMEIS offers up to ₦10M for agri-businesses. NIRSAL Microfinance Bank targets food producers. AfDB has active Nigeria food systems programs.",
        programsAvailable: 7,
        startupCostRange: "$500–$5,000",
        pathLink: "/path",
        tags: ["Agriculture", "Food", "Government-Backed"],
      });
    }
    if (hasSkill("Tech")) {
      results.push({
        businessType: "Nigerian Tech Startup",
        score: 82,
        whyHighScore:
          "Lagos is one of Africa's top 3 startup hubs. NITDA runs active programs, Google for Startups has a class, and TEF accepts tech founders. Access to ₦25M NYIF for young founders.",
        programsAvailable: 6,
        startupCostRange: "$0–$3,000",
        pathLink: "/path",
        tags: ["Tech", "Startup", "VC-Accessible"],
      });
    }
  }

  if (country === "Ghana") {
    if (hasSkill("Fashion/Textiles")) {
      results.push({
        businessType: "Kente & Textile Export Business",
        score: 92,
        whyHighScore:
          "Ghana Free Zones Board offers tax exemptions for textile exporters. GIPC actively courts diaspora investors in textiles. Strong global demand for Kente fabric especially in diaspora markets.",
        programsAvailable: 4,
        startupCostRange: "$500–$3,000",
        pathLink: "/path",
        tags: ["Fashion", "Export", "Diaspora-Market"],
      });
    }
    if (hasSkill("Agriculture", "Cooking/Food")) {
      results.push({
        businessType: "Ghana Agriculture Business",
        score: 89,
        whyHighScore:
          "AGROBank provides dedicated agricultural financing. COCOBOD supports cocoa farmers. Ghana's position as top cocoa exporter means strong value chain opportunities.",
        programsAvailable: 5,
        startupCostRange: "$200–$5,000",
        pathLink: "/path",
        tags: ["Agriculture", "Export", "Finance-Available"],
      });
    }
  }

  if (country === "Kenya") {
    if (hasSkill("Tech")) {
      results.push({
        businessType: "Nairobi Tech Business",
        score: 87,
        whyHighScore:
          "Nairobi (Silicon Savannah) is Africa's premier tech hub. Konza Technopolis is a $14B masterplan. KCB/Equity Bank have active SME tech products. iHub ecosystem provides free infrastructure.",
        programsAvailable: 8,
        startupCostRange: "$0–$2,000",
        pathLink: "/path",
        tags: ["Tech", "East-Africa", "VC-Accessible"],
      });
    }
    if (hasSkill("Healthcare")) {
      results.push({
        businessType: "Healthcare SME",
        score: 85,
        whyHighScore:
          "Kenya has active health sector development funds. Women's Enterprise Fund covers health businesses. M-KOPA model shows tech-health fusion viability.",
        programsAvailable: 4,
        startupCostRange: "$1,000–$10,000",
        pathLink: "/path",
        tags: ["Health", "Impact", "Finance-Available"],
      });
    }
  }

  if (country === "Senegal") {
    results.push({
      businessType: "Senegal Business Under PSE",
      score: 84,
      whyHighScore:
        "Senegal's Plan Sénégal Émergent (PSE 2035) explicitly targets SMEs. DER/FJ offers grants up to XOF 500M. Diamniadio Digital Park is active. Oil revenue from Sangomar field starting 2024 creates procurement opportunities.",
      programsAvailable: 6,
      startupCostRange: "$100–$5,000",
      pathLink: "/path",
      tags: ["West-Africa", "Government-Backed", "Growing-Economy"],
    });
  }

  if (country === "Rwanda") {
    results.push({
      businessType: "Rwanda Priority Sector Business",
      score: 90,
      whyHighScore:
        "Rwanda offers up to 7-year corporate tax holiday for priority sectors. RDB registers companies in 6 hours. BDF loan guarantees. Kigali is East Africa's fastest-growing business hub.",
      programsAvailable: 5,
      startupCostRange: "$500–$3,000",
      pathLink: "/path",
      tags: ["East-Africa", "Tax-Free", "Fast-Setup"],
    });
  }

  if (country === "South Africa") {
    if (hasSkill("Finance", "Sales/Trading")) {
      results.push({
        businessType: "South African B-BBEE Business",
        score: 79,
        whyHighScore:
          "South Africa's B-BBEE procurement preference codes give Black-owned businesses preferential access to government and corporate supply chains. NEF Women Fund offers R1.2M+ loans.",
        programsAvailable: 6,
        startupCostRange: "$1,000–$10,000",
        pathLink: "/path",
        tags: ["Procurement", "B-BBEE", "South-Africa"],
      });
    }
  }

  if (country === "Morocco") {
    if (hasSkill("Tech", "Design")) {
      results.push({
        businessType: "Morocco Digital Business",
        score: 81,
        whyHighScore:
          "Casablanca Technopark provides subsidized office space and support. UM6P has an innovation ecosystem. Investment Charter 2022 is Morocco's most reform-friendly investment law in decades.",
        programsAvailable: 4,
        startupCostRange: "$500–$5,000",
        pathLink: "/path",
        tags: ["Tech", "North-Africa", "EU-Proximity"],
      });
    }
  }

  // Deduplicate by businessType and cap at 5
  const seen = new Set<string>();
  const deduped: OpportunityReport[] = [];
  for (const r of results) {
    if (!seen.has(r.businessType)) {
      seen.add(r.businessType);
      deduped.push(r);
    }
    if (deduped.length === 5) break;
  }

  // Always fill to at least 3 with default results
  if (deduped.length < 3) {
    const defaults: OpportunityReport[] = [
      {
        businessType: "Export-Focused Business",
        score: 75,
        whyHighScore:
          "Most African countries have active export promotion councils offering incentives and market access. Your skills create natural export opportunities to global diaspora markets.",
        programsAvailable: 3,
        startupCostRange: "$200–$3,000",
        pathLink: "/path",
        tags: ["Export", "Versatile"],
      },
      {
        businessType: "Government Supply Chain Business",
        score: 72,
        whyHighScore:
          "Government procurement in your country is open to local businesses. Procurement contracts are renewable and relationship-building.",
        programsAvailable: 2,
        startupCostRange: "$500–$5,000",
        pathLink: "/path",
        tags: ["Procurement", "Government", "Steady-Income"],
      },
    ];
    for (const d of defaults) {
      if (deduped.length >= 3) break;
      if (!seen.has(d.businessType)) {
        seen.add(d.businessType);
        deduped.push(d);
      }
    }
  }

  return deduped;
}

const SKILL_OPTIONS = [
  "Tech",
  "Design",
  "Agriculture",
  "Cooking/Food",
  "Fashion/Textiles",
  "Education",
  "Healthcare",
  "Music/Arts",
  "Logistics",
  "Finance",
  "Construction",
  "Sales/Trading",
];

const LANGUAGE_OPTIONS = [
  "English",
  "French",
  "Arabic",
  "Swahili",
  "Hausa",
  "Yoruba",
  "Igbo",
  "Portuguese",
  "Amharic",
  "Zulu",
];

const COUNTRY_OPTIONS = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "Senegal",
  "Rwanda",
  "South Africa",
  "Morocco",
  "Ethiopia",
  "Côte d'Ivoire",
  "Tanzania",
  "Uganda",
  "Other",
];

export default function DiscoverPage() {
  const [step, setStep] = useState<number>(1);
  const [country, setCountry] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [canTravel, setCanTravel] = useState<string>("");
  const [needsRemote, setNeedsRemote] = useState<string>("");
  const [hoursPerWeek, setHoursPerWeek] = useState<string>("");
  const [hasCustomers, setHasCustomers] = useState<string>("");
  const [results, setResults] = useState<OpportunityReport[]>([]);

  function toggleSkill(skill: string) {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  function toggleLanguage(lang: string) {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  }

  function handleSeeResults() {
    const r = generateResults(country, skills, budget);
    setResults(r);
    setStep(3);
  }

  function handleStartOver() {
    setStep(1);
    setCountry("");
    setSkills([]);
    setBudget("");
    setLanguages([]);
    setCanTravel("");
    setNeedsRemote("");
    setHoursPerWeek("");
    setHasCustomers("");
    setResults([]);
  }

  return (
    <main style={{ background: IVORY, minHeight: "100vh" }}>

      {/* NAV */}
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

      {/* PAGE HEADER */}
      <section
        style={{
          background: IVORY,
          borderBottom: `1px solid rgba(201,168,76,0.18)`,
          padding: "64px 24px 48px",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: 720 }}>
          <p className="section-label" style={{ marginBottom: 16 }}>
            Opportunity Discovery
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 700,
              color: FOREST,
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            What Should I Build?
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 20,
              color: "#555",
              lineHeight: 1.65,
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            The market tells you what it rewards. We translate. Answer 3 questions and
            we'll show you where your skills, country, and capital align with real opportunity.
          </p>
        </div>
      </section>

      {/* PROGRESS INDICATOR */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          padding: "32px 24px 0",
        }}
      >
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: step === s ? GOLD : step > s ? FOREST : "white",
                border: `2px solid ${step === s ? GOLD : step > s ? FOREST : "rgba(0,0,0,0.15)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                fontWeight: 700,
                color: step === s ? OBSIDIAN : step > s ? "white" : "#999",
                transition: "all 0.25s ease",
              }}
            >
              {step > s ? "✓" : s}
            </div>
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
                color: step === s ? FOREST : "#999",
              }}
            >
              {s === 1 ? "Your Context" : s === 2 ? "Your Constraints" : "Results"}
            </span>
            {s < 3 && (
              <div
                style={{
                  width: 40,
                  height: 1,
                  background: step > s ? GOLD : "rgba(0,0,0,0.12)",
                  marginLeft: 4,
                  transition: "background 0.25s ease",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* STEP CONTENT */}
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                fontWeight: 700,
                color: FOREST,
                marginBottom: 8,
              }}
            >
              Tell us about you
            </h2>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 14,
                color: "#666",
                marginBottom: 40,
              }}
            >
              Step 1 of 3 — Your context
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

              {/* Country */}
              <div className="form-field">
                <label className="form-label">Where will you operate?</label>
                <select
                  className="form-select"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">Select a country…</option>
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Skills */}
              <div className="form-field">
                <label className="form-label">
                  What are your skills?{" "}
                  <span style={{ color: "#999", fontWeight: 400, letterSpacing: 0, textTransform: "none" as const, fontSize: 11 }}>
                    select all that apply
                  </span>
                </label>
                <div className="check-grid">
                  {SKILL_OPTIONS.map((skill) => {
                    const selected = skills.includes(skill);
                    return (
                      <div
                        key={skill}
                        className={`check-item${selected ? " selected" : ""}`}
                        onClick={() => toggleSkill(skill)}
                        role="checkbox"
                        aria-checked={selected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            toggleSkill(skill);
                          }
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 2,
                            border: `2px solid ${selected ? GOLD : "rgba(0,0,0,0.2)"}`,
                            background: selected ? GOLD : "white",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s",
                          }}
                        >
                          {selected && (
                            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                              <path d="M1 3.5L3.5 6L8 1" stroke={OBSIDIAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        {skill}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Budget */}
              <div className="form-field">
                <label className="form-label">What's your starting capital?</label>
                <select
                  className="form-select"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option value="">Select a budget range…</option>
                  <option value="Under $500">Under $500</option>
                  <option value="$500–$5,000">$500–$5,000</option>
                  <option value="$5,000–$50,000">$5,000–$50,000</option>
                  <option value="$50,000+">$50,000+</option>
                </select>
              </div>

              {/* Languages */}
              <div className="form-field">
                <label className="form-label">
                  Languages you speak{" "}
                  <span style={{ color: "#999", fontWeight: 400, letterSpacing: 0, textTransform: "none" as const, fontSize: 11 }}>
                    select all that apply
                  </span>
                </label>
                <div className="check-grid">
                  {LANGUAGE_OPTIONS.map((lang) => {
                    const selected = languages.includes(lang);
                    return (
                      <div
                        key={lang}
                        className={`check-item${selected ? " selected" : ""}`}
                        onClick={() => toggleLanguage(lang)}
                        role="checkbox"
                        aria-checked={selected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === " " || e.key === "Enter") {
                            e.preventDefault();
                            toggleLanguage(lang);
                          }
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 2,
                            border: `2px solid ${selected ? GOLD : "rgba(0,0,0,0.2)"}`,
                            background: selected ? GOLD : "white",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s",
                          }}
                        >
                          {selected && (
                            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                              <path d="M1 3.5L3.5 6L8 1" stroke={OBSIDIAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        {lang}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next button */}
              <div style={{ paddingTop: 8 }}>
                <button
                  className="btn-primary"
                  onClick={() => setStep(2)}
                  disabled={!country}
                  style={{
                    opacity: !country ? 0.45 : 1,
                    cursor: !country ? "not-allowed" : "pointer",
                    fontSize: 13,
                  }}
                >
                  Next: Your Constraints →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 32,
                fontWeight: 700,
                color: FOREST,
                marginBottom: 8,
              }}
            >
              How you'll work
            </h2>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 14,
                color: "#666",
                marginBottom: 40,
              }}
            >
              Step 2 of 3 — Your constraints
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

              {/* Can Travel */}
              <div className="form-field">
                <label className="form-label">Can you travel for business?</label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
                  {["Yes", "Sometimes", "No"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setCanTravel(opt.toLowerCase())}
                      style={{
                        padding: "11px 24px",
                        borderRadius: 2,
                        fontFamily: "var(--font-ui)",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        border: `2px solid ${canTravel === opt.toLowerCase() ? GOLD : "rgba(0,0,0,0.12)"}`,
                        background: canTravel === opt.toLowerCase() ? `rgba(201,168,76,0.08)` : "white",
                        color: canTravel === opt.toLowerCase() ? FOREST : "#555",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remote */}
              <div className="form-field">
                <label className="form-label">Remote work preference</label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
                  {[
                    { value: "yes", label: "Yes, must work remotely" },
                    { value: "no", label: "No, happy to be on the ground" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setNeedsRemote(opt.value)}
                      style={{
                        padding: "11px 24px",
                        borderRadius: 2,
                        fontFamily: "var(--font-ui)",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        border: `2px solid ${needsRemote === opt.value ? GOLD : "rgba(0,0,0,0.12)"}`,
                        background: needsRemote === opt.value ? `rgba(201,168,76,0.08)` : "white",
                        color: needsRemote === opt.value ? FOREST : "#555",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours per week */}
              <div className="form-field">
                <label className="form-label">How many hours per week?</label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
                  {[
                    { value: "part-time", label: "Part-time (10–20h/week)" },
                    { value: "full-time", label: "Full-time (40h+)" },
                    { value: "flexible", label: "Flexible" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setHoursPerWeek(opt.value)}
                      style={{
                        padding: "11px 24px",
                        borderRadius: 2,
                        fontFamily: "var(--font-ui)",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        border: `2px solid ${hoursPerWeek === opt.value ? GOLD : "rgba(0,0,0,0.12)"}`,
                        background: hoursPerWeek === opt.value ? `rgba(201,168,76,0.08)` : "white",
                        color: hoursPerWeek === opt.value ? FOREST : "#555",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Existing customers */}
              <div className="form-field">
                <label className="form-label">Do you have existing contacts or customers?</label>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
                  {[
                    { value: "yes", label: "Yes, I have contacts/customers" },
                    { value: "no", label: "No, starting fresh" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setHasCustomers(opt.value)}
                      style={{
                        padding: "11px 24px",
                        borderRadius: 2,
                        fontFamily: "var(--font-ui)",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        border: `2px solid ${hasCustomers === opt.value ? GOLD : "rgba(0,0,0,0.12)"}`,
                        background: hasCustomers === opt.value ? `rgba(201,168,76,0.08)` : "white",
                        color: hasCustomers === opt.value ? FOREST : "#555",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", alignItems: "center", gap: 24, paddingTop: 8 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: "#666",
                    textDecoration: "underline",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    padding: 0,
                  }}
                >
                  ← Back
                </button>
                <button
                  className="btn-primary"
                  onClick={handleSeeResults}
                  style={{ fontSize: 13 }}
                >
                  See My Opportunities →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap" as const,
                gap: 16,
                marginBottom: 8,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 32,
                  fontWeight: 700,
                  color: FOREST,
                }}
              >
                Your Opportunity Density Reports
              </h2>
              <button
                onClick={handleStartOver}
                className="btn-secondary"
                style={{ fontSize: 12, padding: "10px 20px", whiteSpace: "nowrap" as const }}
              >
                Start Over
              </button>
            </div>
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 14,
                color: "#666",
                marginBottom: 40,
              }}
            >
              Based on your profile, here are the highest-potential business types for you in{" "}
              <strong style={{ color: FOREST }}>{country}</strong>.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {results.map((report, i) => (
                <div
                  key={i}
                  style={{
                    background: "white",
                    border: `1px solid rgba(201,168,76,0.2)`,
                    borderRadius: 4,
                    padding: 32,
                  }}
                >
                  {/* Business type heading */}
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      fontWeight: 700,
                      color: FOREST,
                      marginBottom: 16,
                    }}
                  >
                    {report.businessType}
                  </h3>

                  {/* Score + bar */}
                  <div style={{ marginBottom: 20 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-ui)",
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase" as const,
                          color: "#555",
                        }}
                      >
                        Opportunity Score
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-ui)",
                          fontSize: 20,
                          fontWeight: 700,
                          color: GOLD,
                        }}
                      >
                        {report.score}/100
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: 6,
                        background: "rgba(0,0,0,0.07)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${report.score}%`,
                          height: "100%",
                          background: GOLD,
                          borderRadius: 3,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>

                  {/* Why high score */}
                  <div style={{ marginBottom: 20 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-ui)",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase" as const,
                        color: "#888",
                        marginBottom: 8,
                      }}
                    >
                      Why this scores high
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 17,
                        color: FOREST,
                        lineHeight: 1.65,
                      }}
                    >
                      {report.whyHighScore}
                    </p>
                  </div>

                  {/* Tags */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap" as const,
                      gap: 6,
                      marginBottom: 24,
                    }}
                  >
                    {report.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 2,
                          background: `rgba(201,168,76,0.1)`,
                          color: GOLD,
                          fontFamily: "var(--font-ui)",
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase" as const,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats + CTA row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap" as const,
                      gap: 16,
                      paddingTop: 20,
                      borderTop: `1px solid rgba(0,0,0,0.07)`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 32,
                        flexWrap: "wrap" as const,
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-ui)",
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase" as const,
                            color: "#999",
                            marginBottom: 2,
                          }}
                        >
                          Programs Available
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 22,
                            fontWeight: 700,
                            color: FOREST,
                          }}
                        >
                          {report.programsAvailable}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-ui)",
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase" as const,
                            color: "#999",
                            marginBottom: 2,
                          }}
                        >
                          Startup Cost
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: 22,
                            fontWeight: 700,
                            color: FOREST,
                          }}
                        >
                          {report.startupCostRange}
                        </p>
                      </div>
                    </div>
                    <Link href={report.pathLink} className="btn-forest" style={{ fontSize: 12, padding: "12px 24px" }}>
                      Explore This Path →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Post-results CTA */}
            <div
              style={{
                marginTop: 48,
                padding: 40,
                background: FOREST,
                borderRadius: 4,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="grain-overlay" />
              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase" as const,
                  color: GOLD,
                  marginBottom: 12,
                }}
              >
                Next Step
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  fontWeight: 700,
                  color: IVORY,
                  marginBottom: 12,
                }}
              >
                Want a specific roadmap for one of these?
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 17,
                  color: "rgba(247,242,232,0.7)",
                  marginBottom: 28,
                }}
              >
                We'll map the exact programs, timelines, and steps you need to launch.
              </p>
              <Link href="/path" className="btn-primary" style={{ fontSize: 13 }}>
                Build My Path →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer
        style={{
          background: OBSIDIAN,
          padding: "40px 24px",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap" as const,
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            Alkebulan <span style={{ color: GOLD }}>United</span>
          </span>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.04em",
            }}
          >
            © {new Date().getFullYear()} Alkebulan United. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
