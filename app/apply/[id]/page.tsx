"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Opportunity, UserProfile } from "@/lib/types";

const GOLD = "#C9A84C";
const FOREST = "#0D3B2E";
const OBSIDIAN = "#0B0B0B";
const EARTH = "#8B3A2A";

export default function ApplyAssistantPage() {
  const { id } = useParams();
  const supabase = createClient();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<{
    checklist: string[];
    draft_intro: string;
    business_description: string;
    tips: string[];
    warnings: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [question, setQuestion] = useState("");
  const [draftResponse, setDraftResponse] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"checklist" | "intro" | "tips" | "ask">("checklist");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: opp }, { data: prof }] = await Promise.all([
        supabase.from("opportunities").select("*").eq("id", id).single(),
        supabase.from("user_profiles").select("*").eq("id", user.id).single(),
      ]);

      setOpportunity(opp as Opportunity);
      setProfile(prof as unknown as UserProfile);
      setLoading(false);
    }
    load();
  }, [id]);

  async function generatePlan() {
    setGenerating(true);
    const res = await fetch("/api/agents/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunity_id: id, action: "checklist" }),
    });
    const data = await res.json();
    if (data.data) setPlan(data.data);
    setGenerating(false);
  }

  async function getDraft() {
    if (!question.trim()) return;
    setDraftLoading(true);
    const res = await fetch("/api/agents/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opportunity_id: id,
        action: "draft",
        question,
        context: `Business stage: ${profile?.business_stage}, Sectors: ${profile?.sectors?.join(", ")}, Country: ${profile?.residence_country}`,
      }),
    });
    const data = await res.json();
    if (data.data) setDraftResponse(data.data);
    setDraftLoading(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F4EFE6", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: FOREST }}>Loading...</div>
      </div>
    );
  }

  if (!opportunity) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#F4EFE6" }}>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">Alkebulan <span>United</span></Link>
          <ul className="nav-links">
            <li><Link href="/dashboard">Dashboard</Link></li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ padding: "40px 24px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <Link href={`/opportunity/${id}`} style={{ fontSize: 13, color: "#888", display: "inline-flex", gap: 4, marginBottom: 16 }}>
            ← Back to opportunity
          </Link>
          <div
            style={{
              background: FOREST,
              borderRadius: 4,
              padding: "32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div className="section-label" style={{ color: "rgba(201,168,76,0.7)", marginBottom: 8 }}>
                AI Application Assistant
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(20px, 2.5vw, 28px)",
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.2,
                }}
              >
                {opportunity.title}
              </h1>
            </div>
            <a
              href={opportunity.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ flexShrink: 0, fontSize: 12, padding: "10px 20px" }}
            >
              Official Application ↗
            </a>
          </div>
        </div>

        {/* Warning if not verified */}
        {opportunity.verified_status !== "verified" && (
          <div
            style={{
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.25)",
              borderRadius: 4,
              padding: "16px 20px",
              marginBottom: 24,
              fontSize: 13,
              color: "#7A5C1E",
              display: "flex",
              gap: 10,
            }}
          >
            <span>⚠</span>
            This opportunity is marked &quot;Needs Review.&quot; Verify all details on the official source before investing time in your application.
          </div>
        )}

        {/* Generate button */}
        {!plan && (
          <div
            style={{
              background: "white",
              borderRadius: 4,
              border: "1px solid rgba(201,168,76,0.15)",
              padding: "52px 40px",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 20 }}>🦁</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: OBSIDIAN, marginBottom: 8 }}>
              Get Your Application Plan
            </h2>
            <p style={{ color: "#666", fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
              The Application Coach will create a personalized checklist, document list, draft introduction, and tips for your application to <strong>{opportunity.title}</strong>.
            </p>
            <button
              onClick={generatePlan}
              disabled={generating}
              className="btn-primary"
              style={{ fontSize: 14, padding: "16px 36px" }}
            >
              {generating ? "Preparing your plan..." : "Generate My Application Plan →"}
            </button>
          </div>
        )}

        {/* Plan tabs */}
        {plan && (
          <div>
            {/* Tab navigation */}
            <div style={{ display: "flex", gap: 2, marginBottom: 20, background: "rgba(0,0,0,0.04)", padding: 3, borderRadius: 4 }}>
              {[
                { key: "checklist", label: "📋 Checklist" },
                { key: "intro", label: "✍️ Draft Intro" },
                { key: "tips", label: "💡 Tips & Warnings" },
                { key: "ask", label: "🤖 Ask AI" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  style={{
                    flex: 1,
                    padding: "10px 8px",
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: 2,
                    background: activeTab === tab.key ? "white" : "transparent",
                    color: activeTab === tab.key ? FOREST : "#888",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    boxShadow: activeTab === tab.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "checklist" && (
              <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "28px 32px" }}>
                <div className="section-label" style={{ marginBottom: 16 }}>Your Application Checklist</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.checklist.map((item, i) => (
                    <label
                      key={i}
                      style={{
                        display: "flex",
                        gap: 14,
                        alignItems: "flex-start",
                        padding: "12px 16px",
                        background: "#F8F5EE",
                        borderRadius: 2,
                        cursor: "pointer",
                      }}
                    >
                      <input type="checkbox" style={{ marginTop: 2, accentColor: GOLD, width: 16, height: 16, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: "#333", lineHeight: 1.5 }}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "intro" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "28px 32px" }}>
                  <div className="section-label" style={{ marginBottom: 16 }}>Draft Personal Introduction</div>
                  <p style={{ fontSize: 12, color: "#888", marginBottom: 12, lineHeight: 1.5 }}>
                    Use this as a starting point. Replace the bracketed text with your specific details.
                  </p>
                  <div style={{ background: "#F8F5EE", borderRadius: 2, padding: "20px 24px", fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.75, color: "#333", borderLeft: `3px solid ${GOLD}` }}>
                    {plan.draft_intro}
                  </div>
                </div>

                <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "28px 32px" }}>
                  <div className="section-label" style={{ marginBottom: 16 }}>Draft Business Description</div>
                  <div style={{ background: "#F8F5EE", borderRadius: 2, padding: "20px 24px", fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.75, color: "#333", borderLeft: `3px solid ${FOREST}` }}>
                    {plan.business_description}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tips" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "28px 32px" }}>
                  <div className="section-label" style={{ marginBottom: 16 }}>Tips to Strengthen Your Application</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {plan.tips.map((tip, i) => (
                      <div key={i} style={{ display: "flex", gap: 14, padding: "12px 16px", background: "rgba(13,59,46,0.04)", borderRadius: 2, borderLeft: `3px solid ${FOREST}` }}>
                        <span style={{ color: FOREST, fontWeight: 700, flexShrink: 0 }}>◈</span>
                        <span style={{ fontSize: 14, color: "#333", lineHeight: 1.5 }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {plan.warnings.length > 0 && (
                  <div style={{ background: "rgba(201,168,76,0.06)", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)", padding: "28px 32px" }}>
                    <div className="section-label" style={{ marginBottom: 16, color: "#8A6F2E" }}>⚠ Warnings</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {plan.warnings.map((w, i) => (
                        <div key={i} style={{ display: "flex", gap: 14, padding: "12px 16px", background: "rgba(201,168,76,0.1)", borderRadius: 2 }}>
                          <span style={{ color: EARTH, fontWeight: 700, flexShrink: 0 }}>!</span>
                          <span style={{ fontSize: 14, color: "#555", lineHeight: 1.5 }}>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "ask" && (
              <div style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "28px 32px" }}>
                <div className="section-label" style={{ marginBottom: 8 }}>Ask the Application Coach</div>
                <p style={{ fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 1.5 }}>
                  Ask the AI to help draft a response to a specific application question.
                  When Claude AI is connected, this will generate a personalized draft using your profile.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder='e.g. "Describe your business and its impact" or "Why do you need this funding?"'
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    style={{ resize: "vertical" }}
                  />
                  <button
                    onClick={getDraft}
                    disabled={draftLoading || !question.trim()}
                    className="btn-forest"
                    style={{ alignSelf: "flex-start", fontSize: 13 }}
                  >
                    {draftLoading ? "Generating..." : "Draft My Answer →"}
                  </button>
                </div>

                {draftResponse && (
                  <div style={{ marginTop: 24, padding: "20px 24px", background: "#F8F5EE", borderRadius: 2, borderLeft: `3px solid ${GOLD}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: 10 }}>
                      Draft Response
                    </div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.75, color: "#333", whiteSpace: "pre-wrap" }}>
                      {draftResponse}
                    </p>
                  </div>
                )}

                <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(13,59,46,0.04)", borderRadius: 2, fontSize: 12, color: "#888" }}>
                  <strong style={{ color: FOREST }}>Note:</strong> Connect your Anthropic API key in <code>.env.local</code> to enable real AI-powered application coaching with Claude.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
