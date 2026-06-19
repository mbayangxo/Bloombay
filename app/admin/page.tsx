"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Opportunity } from "@/lib/types";

const GOLD = "#C9A84C";
const FOREST = "#0D3B2E";
const OBSIDIAN = "#0B0B0B";
const EARTH = "#8B3A2A";

type FormState = {
  title: string;
  country: string;
  region: string;
  type: string;
  sectors: string[];
  eligibility_age_min: string;
  eligibility_age_max: string;
  eligibility_gender: string;
  eligibility_citizenship: string;
  diaspora_allowed: boolean;
  business_stage_required: string;
  amount: string;
  currency: string;
  deadline: string;
  source_url: string;
  source_name: string;
  verified_status: string;
  summary: string;
  documents_required: string;
  application_steps: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  title: "", country: "", region: "", type: "grant", sectors: [],
  eligibility_age_min: "", eligibility_age_max: "", eligibility_gender: "",
  eligibility_citizenship: "", diaspora_allowed: true, business_stage_required: "",
  amount: "", currency: "USD", deadline: "", source_url: "", source_name: "",
  verified_status: "needs_review", summary: "", documents_required: "",
  application_steps: "", notes: "",
};

export default function AdminPage() {
  const supabase = createClient();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState<"list" | "add">("list");
  const [stats, setStats] = useState({ total: 0, verified: 0, users: 0 });

  // Simple admin auth via password
  const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "admin2025";

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_KEY) {
      setAuthed(true);
      loadData();
    } else {
      setMsg("Incorrect password");
    }
  }

  async function loadData() {
    setLoading(true);
    const [{ data: opps }, { count: userCount }] = await Promise.all([
      supabase.from("opportunities").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("user_profiles").select("*", { count: "exact", head: true }),
    ]);
    const o = (opps ?? []) as Opportunity[];
    setOpportunities(o);
    setStats({
      total: o.length,
      verified: o.filter((x) => x.verified_status === "verified").length,
      users: userCount ?? 0,
    });
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    const payload = {
      title: form.title,
      country: form.country,
      region: form.region || null,
      type: form.type,
      sectors: form.sectors.length > 0 ? form.sectors : ["all"],
      eligibility_age_min: form.eligibility_age_min ? parseInt(form.eligibility_age_min) : null,
      eligibility_age_max: form.eligibility_age_max ? parseInt(form.eligibility_age_max) : null,
      eligibility_gender: form.eligibility_gender || null,
      eligibility_citizenship: form.eligibility_citizenship
        ? form.eligibility_citizenship.split(",").map((s) => s.trim())
        : null,
      diaspora_allowed: form.diaspora_allowed,
      business_stage_required: form.business_stage_required
        ? form.business_stage_required.split(",").map((s) => s.trim())
        : null,
      amount: form.amount ? parseFloat(form.amount) : null,
      currency: form.currency || "USD",
      deadline: form.deadline || null,
      source_url: form.source_url,
      source_name: form.source_name,
      verified_status: form.verified_status,
      summary: form.summary,
      documents_required: form.documents_required
        ? form.documents_required.split("\n").filter(Boolean)
        : null,
      application_steps: form.application_steps
        ? form.application_steps.split("\n").filter(Boolean)
        : null,
      notes: form.notes || null,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from("opportunities").update(payload).eq("id", editing));
    } else {
      ({ error } = await supabase.from("opportunities").insert(payload));
    }

    if (error) {
      setMsg(`Error: ${error.message}`);
    } else {
      setMsg(editing ? "Opportunity updated!" : "Opportunity added!");
      setForm(EMPTY_FORM);
      setEditing(null);
      setTab("list");
      await loadData();
    }
    setSaving(false);
  }

  async function handleArchive(id: string) {
    await supabase.from("opportunities").update({ archived: true }).eq("id", id);
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
  }

  function handleEdit(opp: Opportunity) {
    setForm({
      title: opp.title,
      country: opp.country,
      region: opp.region ?? "",
      type: opp.type,
      sectors: opp.sectors,
      eligibility_age_min: opp.eligibility_age_min?.toString() ?? "",
      eligibility_age_max: opp.eligibility_age_max?.toString() ?? "",
      eligibility_gender: opp.eligibility_gender ?? "",
      eligibility_citizenship: (opp.eligibility_citizenship ?? []).join(", "),
      diaspora_allowed: opp.diaspora_allowed,
      business_stage_required: (opp.business_stage_required ?? []).join(", "),
      amount: opp.amount?.toString() ?? "",
      currency: opp.currency ?? "USD",
      deadline: opp.deadline ?? "",
      source_url: opp.source_url,
      source_name: opp.source_name,
      verified_status: opp.verified_status,
      summary: opp.summary,
      documents_required: (opp.documents_required ?? []).join("\n"),
      application_steps: (opp.application_steps ?? []).join("\n"),
      notes: opp.notes ?? "",
    });
    setEditing(opp.id);
    setTab("add");
  }

  function f(field: keyof FormState, value: string | boolean | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: FOREST, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 380, background: "white", borderRadius: 4, padding: "40px 36px", border: `1px solid rgba(201,168,76,0.2)` }}>
          <Link href="/" style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: OBSIDIAN, display: "block", marginBottom: 8 }}>
            Alkebulan <span style={{ color: GOLD }}>United</span>
          </Link>
          <div style={{ fontSize: 11, color: "#888", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 28 }}>Admin Access</div>
          <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-field">
              <label className="form-label">Admin Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            {msg && <div style={{ fontSize: 13, color: EARTH }}>{msg}</div>}
            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Access Admin →
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F4EFE6" }}>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">Alkebulan <span>United</span> — Admin</Link>
          <ul className="nav-links">
            <li><Link href="/dashboard">Live Site</Link></li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ padding: "40px 24px 80px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 }}>
          {[
            { label: "Total Opportunities", value: stats.total },
            { label: "Verified", value: stats.verified },
            { label: "Registered Users", value: stats.users },
          ].map((s) => (
            <div key={s.label} style={{ background: "white", borderRadius: 4, border: "1px solid rgba(201,168,76,0.15)", padding: "24px 28px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 800, color: GOLD, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, background: "rgba(0,0,0,0.04)", padding: 3, borderRadius: 4, marginBottom: 24, width: "fit-content" }}>
          {[
            { key: "list", label: "All Opportunities" },
            { key: "add", label: editing ? "Edit Opportunity" : "+ Add Opportunity" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key as typeof tab); if (t.key === "add" && !editing) setForm(EMPTY_FORM); }}
              style={{
                padding: "10px 20px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 2,
                background: tab === t.key ? "white" : "transparent",
                color: tab === t.key ? FOREST : "#888",
                border: "none",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {msg && (
          <div style={{ background: "rgba(13,59,46,0.08)", border: "1px solid rgba(13,59,46,0.2)", borderRadius: 4, padding: "12px 16px", fontSize: 13, color: FOREST, marginBottom: 20 }}>
            {msg}
          </div>
        )}

        {/* LIST TAB */}
        {tab === "list" && (
          <div>
            {loading ? (
              <div style={{ textAlign: "center", padding: "52px", color: "#888" }}>Loading...</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {opportunities.map((opp) => (
                  <div
                    key={opp.id}
                    style={{
                      background: "white",
                      borderRadius: 4,
                      border: "1px solid rgba(201,168,76,0.12)",
                      padding: "20px 24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 16,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 2, background: "rgba(13,59,46,0.08)", color: FOREST, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          {opp.type}
                        </span>
                        <span style={{
                          fontSize: 10, padding: "3px 8px", borderRadius: 2, fontWeight: 600,
                          background: opp.verified_status === "verified" ? "rgba(45,122,79,0.1)" : "rgba(201,168,76,0.12)",
                          color: opp.verified_status === "verified" ? "#2D7A4F" : "#8A6F2E",
                        }}>
                          {opp.verified_status}
                        </span>
                        <span style={{ fontSize: 11, color: "#888" }}>{opp.country}</span>
                      </div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: OBSIDIAN }}>
                        {opp.title}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => handleEdit(opp)}
                        style={{ fontSize: 12, fontWeight: 600, color: FOREST, background: "rgba(13,59,46,0.08)", border: "none", padding: "8px 14px", borderRadius: 2, cursor: "pointer" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleArchive(opp.id)}
                        style={{ fontSize: 12, fontWeight: 600, color: EARTH, background: "rgba(139,58,42,0.08)", border: "none", padding: "8px 14px", borderRadius: 2, cursor: "pointer" }}
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD/EDIT TAB */}
        {tab === "add" && (
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-field" style={{ gridColumn: "1/-1" }}>
                <label className="form-label">Title *</label>
                <input type="text" className="form-input" value={form.title} onChange={(e) => f("title", e.target.value)} required />
              </div>
              <div className="form-field">
                <label className="form-label">Country *</label>
                <input type="text" className="form-input" placeholder="e.g. Nigeria, Pan-Africa" value={form.country} onChange={(e) => f("country", e.target.value)} required />
              </div>
              <div className="form-field">
                <label className="form-label">Type *</label>
                <select className="form-select" value={form.type} onChange={(e) => f("type", e.target.value)}>
                  {["grant","loan","tender","contract","accelerator","fellowship","procurement","training","investment","fund"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Amount</label>
                <input type="number" className="form-input" placeholder="e.g. 5000" value={form.amount} onChange={(e) => f("amount", e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Currency</label>
                <input type="text" className="form-input" placeholder="USD, NGN, KES..." value={form.currency} onChange={(e) => f("currency", e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Deadline</label>
                <input type="date" className="form-input" value={form.deadline} onChange={(e) => f("deadline", e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Verified Status</label>
                <select className="form-select" value={form.verified_status} onChange={(e) => f("verified_status", e.target.value)}>
                  <option value="verified">Verified</option>
                  <option value="needs_review">Needs Review</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Source URL *</label>
                <input type="url" className="form-input" value={form.source_url} onChange={(e) => f("source_url", e.target.value)} required />
              </div>
              <div className="form-field">
                <label className="form-label">Source Name *</label>
                <input type="text" className="form-input" value={form.source_name} onChange={(e) => f("source_name", e.target.value)} required />
              </div>
              <div className="form-field">
                <label className="form-label">Min Age</label>
                <input type="number" className="form-input" placeholder="e.g. 18" value={form.eligibility_age_min} onChange={(e) => f("eligibility_age_min", e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Max Age</label>
                <input type="number" className="form-input" placeholder="e.g. 35" value={form.eligibility_age_max} onChange={(e) => f("eligibility_age_max", e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Gender Restriction</label>
                <select className="form-select" value={form.eligibility_gender} onChange={(e) => f("eligibility_gender", e.target.value)}>
                  <option value="">No restriction</option>
                  <option value="female">Female / Women only</option>
                  <option value="male">Male only</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Diaspora Allowed</label>
                <select className="form-select" value={form.diaspora_allowed ? "true" : "false"} onChange={(e) => f("diaspora_allowed", e.target.value === "true")}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Eligibility: Citizenship (comma-separated)</label>
                <input type="text" className="form-input" placeholder="Nigerian citizens, All African citizens" value={form.eligibility_citizenship} onChange={(e) => f("eligibility_citizenship", e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">Business Stage (comma-separated)</label>
                <input type="text" className="form-input" placeholder="idea, registered, operating, scaling" value={form.business_stage_required} onChange={(e) => f("business_stage_required", e.target.value)} />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Summary (plain English) *</label>
              <textarea className="form-input" rows={4} value={form.summary} onChange={(e) => f("summary", e.target.value)} required style={{ resize: "vertical" }} />
            </div>

            <div className="form-field">
              <label className="form-label">Documents Required (one per line)</label>
              <textarea className="form-input" rows={4} value={form.documents_required} onChange={(e) => f("documents_required", e.target.value)} style={{ resize: "vertical" }} />
            </div>

            <div className="form-field">
              <label className="form-label">Application Steps (one per line)</label>
              <textarea className="form-input" rows={5} value={form.application_steps} onChange={(e) => f("application_steps", e.target.value)} style={{ resize: "vertical" }} />
            </div>

            <div className="form-field">
              <label className="form-label">Notes / Warnings</label>
              <textarea className="form-input" rows={2} value={form.notes} onChange={(e) => f("notes", e.target.value)} style={{ resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" disabled={saving} className="btn-primary" style={{ fontSize: 13 }}>
                {saving ? "Saving..." : editing ? "Update Opportunity →" : "Add Opportunity →"}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm(EMPTY_FORM); setTab("list"); }} className="btn-secondary" style={{ fontSize: 13 }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
