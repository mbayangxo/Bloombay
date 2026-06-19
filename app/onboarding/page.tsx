"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const GOLD = "#C9A84C";
const FOREST = "#0D3B2E";
const IVORY = "#F7F2E8";
const OBSIDIAN = "#0B0B0B";

const AFRICAN_COUNTRIES = [
  "Algeria","Angola","Benin","Botswana","Burkina Faso","Burundi","Cabo Verde",
  "Cameroon","Central African Republic","Chad","Comoros","Congo (Brazzaville)",
  "Congo (DRC)","Côte d'Ivoire","Djibouti","Egypt","Equatorial Guinea","Eritrea",
  "Eswatini","Ethiopia","Gabon","Gambia","Ghana","Guinea","Guinea-Bissau","Kenya",
  "Lesotho","Liberia","Libya","Madagascar","Malawi","Mali","Mauritania","Mauritius",
  "Morocco","Mozambique","Namibia","Niger","Nigeria","Rwanda","São Tomé & Príncipe",
  "Senegal","Sierra Leone","Somalia","South Africa","South Sudan","Sudan","Tanzania",
  "Togo","Tunisia","Uganda","Zambia","Zimbabwe",
];

const WORLD_COUNTRIES = [
  "United States","United Kingdom","France","Canada","Germany","Netherlands",
  "Belgium","Italy","Spain","Portugal","Switzerland","Sweden","Norway",
  "Australia","New Zealand","Brazil","China","India","Japan","UAE",
  "Saudi Arabia","Qatar","South Korea","Singapore","Malaysia","Other",
];

const SECTORS = [
  { value: "agriculture", label: "Agriculture & Farming" },
  { value: "beauty", label: "Beauty & Wellness" },
  { value: "fashion", label: "Fashion & Textiles" },
  { value: "tech", label: "Technology & Digital" },
  { value: "media", label: "Media & Content" },
  { value: "music", label: "Music & Performing Arts" },
  { value: "tourism", label: "Tourism & Hospitality" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "food", label: "Food & Beverage" },
  { value: "education", label: "Education & Training" },
  { value: "health", label: "Health & Biotech" },
  { value: "housing", label: "Housing & Construction" },
  { value: "logistics", label: "Logistics & Transport" },
  { value: "retail", label: "Retail & Trade" },
  { value: "creative", label: "Creative Economy" },
  { value: "climate", label: "Climate & Energy" },
  { value: "finance", label: "Finance & Fintech" },
  { value: "all", label: "All Sectors" },
];

const FUNDING_TYPES = [
  { value: "grant", label: "Grants" },
  { value: "loan", label: "Loans" },
  { value: "contract", label: "Government Contracts" },
  { value: "tender", label: "Tenders" },
  { value: "accelerator", label: "Accelerators" },
  { value: "fellowship", label: "Fellowships" },
  { value: "procurement", label: "Procurement" },
  { value: "training", label: "Training Programs" },
  { value: "investment", label: "Investment" },
  { value: "fund", label: "Funds" },
];

const STAGES = [
  { value: "idea", label: "Idea Stage", desc: "Have an idea, no formal business yet" },
  { value: "registered", label: "Registered Business", desc: "Business is registered but early-stage" },
  { value: "operating", label: "Operating Business", desc: "Business is running and generating some revenue" },
  { value: "scaling", label: "Scaling Business", desc: "Established business seeking growth capital" },
];

type FormData = {
  age: string;
  gender: string;
  residence_country: string;
  citizenship_countries: string[];
  parent_citizenship_countries: string[];
  diaspora_status: boolean;
  business_stage: string;
  sectors: string[];
  target_countries: string[];
  funding_types: string[];
};

const STEPS = [
  "About You",
  "Your Background",
  "Your Business",
  "Your Goals",
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    age: "",
    gender: "",
    residence_country: "",
    citizenship_countries: [],
    parent_citizenship_countries: [],
    diaspora_status: false,
    business_stage: "",
    sectors: [],
    target_countries: [],
    funding_types: [],
  });

  function toggleArray(key: keyof FormData, value: string) {
    const arr = form[key] as string[];
    setForm((f) => ({
      ...f,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    }));
  }

  async function handleFinish() {
    setSaving(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { error } = await supabase.from("user_profiles").upsert({
      id: user.id,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender || null,
      residence_country: form.residence_country || null,
      citizenship_countries: form.citizenship_countries,
      parent_citizenship_countries: form.parent_citizenship_countries,
      diaspora_status: form.diaspora_status,
      business_stage: form.business_stage || null,
      sectors: form.sectors,
      target_countries: form.target_countries,
      funding_types: form.funding_types,
      onboarding_complete: true,
    });

    if (error) { setError(error.message); setSaving(false); return; }
    router.push("/dashboard");
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: IVORY }}>
      {/* Header */}
      <div
        style={{
          background: FOREST,
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 700,
            color: "white",
          }}
        >
          Alkebulan <span style={{ color: GOLD }}>United</span>
        </Link>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          Step {step + 1} of {STEPS.length}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(201,168,76,0.15)" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: GOLD,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "52px 24px" }}>
        {/* Step label */}
        <div className="section-label" style={{ marginBottom: 8 }}>
          {STEPS[step]}
        </div>

        {/* ── STEP 0: About You ── */}
        {step === 0 && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 36,
                fontWeight: 700,
                color: OBSIDIAN,
                marginBottom: 8,
              }}
            >
              Let&apos;s get to know you
            </h1>
            <p style={{ color: "#666", marginBottom: 40, fontSize: 15 }}>
              This helps us find opportunities that match your specific situation.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-field">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 28"
                    value={form.age}
                    onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                    min={16}
                    max={80}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={form.gender}
                    onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="female">Female / Woman</option>
                    <option value="male">Male / Man</option>
                    <option value="nonbinary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Country of Current Residence</label>
                <select
                  className="form-select"
                  value={form.residence_country}
                  onChange={(e) => setForm((f) => ({ ...f, residence_country: e.target.value }))}
                >
                  <option value="">Select country</option>
                  <optgroup label="African Countries">
                    {AFRICAN_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                  <optgroup label="Other Countries">
                    {WORLD_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1: Your Background ── */}
        {step === 1 && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 36,
                fontWeight: 700,
                color: OBSIDIAN,
                marginBottom: 8,
              }}
            >
              Your African connection
            </h1>
            <p style={{ color: "#666", marginBottom: 40, fontSize: 15 }}>
              Many programs are open to citizens, diaspora, or people with African parentage. Select all that apply.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div className="form-field">
                <label className="form-label">Country/Countries of Citizenship</label>
                <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Select all countries where you hold citizenship</p>
                <div className="check-grid">
                  {AFRICAN_COUNTRIES.map((c) => (
                    <label
                      key={c}
                      className={`check-item ${form.citizenship_countries.includes(c) ? "selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={form.citizenship_countries.includes(c)}
                        onChange={() => toggleArray("citizenship_countries", c)}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Parent Citizenship (if different)</label>
                <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Countries where your parents hold or held citizenship</p>
                <div className="check-grid">
                  {AFRICAN_COUNTRIES.map((c) => (
                    <label
                      key={c}
                      className={`check-item ${form.parent_citizenship_countries.includes(c) ? "selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={form.parent_citizenship_countries.includes(c)}
                        onChange={() => toggleArray("parent_citizenship_countries", c)}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Diaspora Status</label>
                <p style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Are you currently living outside of Africa?</p>
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    { value: true, label: "Yes — I am in the diaspora" },
                    { value: false, label: "No — I live in Africa" },
                  ].map((opt) => (
                    <label
                      key={String(opt.value)}
                      className={`check-item ${form.diaspora_status === opt.value ? "selected" : ""}`}
                      style={{ flex: 1 }}
                    >
                      <input
                        type="radio"
                        name="diaspora"
                        checked={form.diaspora_status === opt.value}
                        onChange={() => setForm((f) => ({ ...f, diaspora_status: opt.value }))}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Your Business ── */}
        {step === 2 && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 36,
                fontWeight: 700,
                color: OBSIDIAN,
                marginBottom: 8,
              }}
            >
              Your business
            </h1>
            <p style={{ color: "#666", marginBottom: 40, fontSize: 15 }}>
              Many programs have specific requirements about business stage and sector. Tell us about your work.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div className="form-field">
                <label className="form-label">Business Stage</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {STAGES.map((s) => (
                    <label
                      key={s.value}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                        padding: "16px 20px",
                        background: form.business_stage === s.value ? "rgba(201,168,76,0.06)" : "white",
                        border: `1px solid ${form.business_stage === s.value ? GOLD : "rgba(0,0,0,0.1)"}`,
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <input
                        type="radio"
                        name="stage"
                        value={s.value}
                        checked={form.business_stage === s.value}
                        onChange={() => setForm((f) => ({ ...f, business_stage: s.value }))}
                        style={{ marginTop: 2, accentColor: GOLD }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: FOREST }}>{s.label}</div>
                        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Business Sector(s)</label>
                <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Select all that apply to your work or interests</p>
                <div className="check-grid">
                  {SECTORS.map((s) => (
                    <label
                      key={s.value}
                      className={`check-item ${form.sectors.includes(s.value) ? "selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={form.sectors.includes(s.value)}
                        onChange={() => toggleArray("sectors", s.value)}
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Your Goals ── */}
        {step === 3 && (
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 36,
                fontWeight: 700,
                color: OBSIDIAN,
                marginBottom: 8,
              }}
            >
              What are you looking for?
            </h1>
            <p style={{ color: "#666", marginBottom: 40, fontSize: 15 }}>
              Tell us which countries and funding types interest you most.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div className="form-field">
                <label className="form-label">Countries You Want Opportunities From</label>
                <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
                  Leave empty to see all African opportunities
                </p>
                <div className="check-grid">
                  {AFRICAN_COUNTRIES.map((c) => (
                    <label
                      key={c}
                      className={`check-item ${form.target_countries.includes(c) ? "selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={form.target_countries.includes(c)}
                        onChange={() => toggleArray("target_countries", c)}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Types of Funding or Support You Want</label>
                <div className="check-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
                  {FUNDING_TYPES.map((t) => (
                    <label
                      key={t.value}
                      className={`check-item ${form.funding_types.includes(t.value) ? "selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={form.funding_types.includes(t.value)}
                        onChange={() => toggleArray("funding_types", t.value)}
                      />
                      {t.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: 20,
              background: "rgba(139,58,42,0.08)",
              border: "1px solid rgba(139,58,42,0.2)",
              borderRadius: 2,
              padding: "12px 16px",
              fontSize: 13,
              color: "#8B3A2A",
            }}
          >
            {error}
          </div>
        )}

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 52,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="btn-secondary"
              style={{ fontSize: 13 }}
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="btn-primary"
              style={{ fontSize: 13 }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="btn-primary"
              style={{ fontSize: 13, opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Saving..." : "Show My Opportunities →"}
            </button>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#999" }}>
          You can update your profile anytime from the dashboard.
        </p>
      </div>
    </div>
  );
}
