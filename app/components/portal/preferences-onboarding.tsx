"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";
const GOLD  = "#D4A853";

// ── Types ─────────────────────────────────────────────────────────────────────

type Weight = "must" | "nice";
interface WeightedTag { tag: string; weight: Weight }

interface Prefs {
  age_group:            string;
  is_mother:            boolean | null;
  relationship_status:  string;
  faith:                string;
  faith_important:      boolean;
  lifestyle_tags:       WeightedTag[];
  activity_types:       string[];
  core_values:          string[];
  friendship_style:     string;
  avoid_vibes:          string[];
  seeking:              string[];
  life_chapter:         string;
  availability:         string[];
  connection_frequency: string;
  aspirations:          string[];
}

const EMPTY: Prefs = {
  age_group: "", is_mother: null, relationship_status: "",
  faith: "", faith_important: false,
  lifestyle_tags: [], activity_types: [], core_values: [],
  friendship_style: "", avoid_vibes: [],
  seeking: [], life_chapter: "", availability: [],
  connection_frequency: "", aspirations: [],
};

// ── Step data ─────────────────────────────────────────────────────────────────

const STEPS = [
  "Who you are",
  "Your lifestyle",
  "What you love",
  "What you value",
  "What you're looking for",
  "Your chapter",
  "When you're free",
  "Your direction",
];

const SEEKING_OPTIONS = [
  { tag: "deep_friendship",        label: "Deep friendship" },
  { tag: "creative_collaborator",  label: "Creative collaborator" },
  { tag: "workout_partner",        label: "Workout partner" },
  { tag: "travel_companion",       label: "Travel companion" },
  { tag: "events_plus_one",        label: "Events plus one" },
  { tag: "accountability_partner", label: "Accountability partner" },
  { tag: "mentor",                 label: "A mentor" },
  { tag: "mentee",                 label: "Someone to mentor" },
  { tag: "girls_brunch_crew",      label: "Girls brunch crew" },
  { tag: "neighborhood_friend",    label: "Neighborhood friend" },
  { tag: "business_connection",    label: "Business connection" },
];

const LIFESTYLE_OPTIONS = [
  { tag: "sober",                label: "Sober" },
  { tag: "sober_curious",        label: "Sober curious" },
  { tag: "social_drinker",       label: "Social drinker" },
  { tag: "non_smoker",           label: "Non-smoker" },
  { tag: "smoker",               label: "Smoker" },
  { tag: "plant_based",          label: "Plant-based" },
  { tag: "health_conscious",     label: "Health-conscious" },
  { tag: "early_riser",          label: "Early riser" },
  { tag: "night_owl",            label: "Night owl" },
  { tag: "faith_centered",       label: "Faith-centered" },
  { tag: "spiritual",            label: "Spiritual" },
  { tag: "homebody",             label: "Homebody" },
  { tag: "adventurous",          label: "Adventurous" },
  { tag: "entrepreneurial",      label: "Entrepreneurial" },
  { tag: "creative_professional", label: "Creative professional" },
];

const ACTIVITY_OPTIONS = [
  { tag: "art_galleries",        label: "Art galleries" },
  { tag: "museums",              label: "Museums" },
  { tag: "live_music",           label: "Live music" },
  { tag: "theater",              label: "Theater" },
  { tag: "creative_workshops",   label: "Creative workshops" },
  { tag: "cooking_classes",      label: "Cooking classes" },
  { tag: "pottery",              label: "Pottery" },
  { tag: "dance",                label: "Dance" },
  { tag: "yoga",                 label: "Yoga" },
  { tag: "pilates",              label: "Pilates" },
  { tag: "hiking",               label: "Hiking" },
  { tag: "book_clubs",           label: "Book clubs" },
  { tag: "film_screenings",      label: "Film screenings" },
  { tag: "farmers_markets",      label: "Farmers markets" },
  { tag: "brunching",            label: "Brunching" },
  { tag: "dinner_parties",       label: "Dinner parties" },
  { tag: "travel",               label: "Travel" },
  { tag: "pop_ups",              label: "Pop-ups" },
  { tag: "volunteering",         label: "Volunteering" },
  { tag: "mentorship",           label: "Mentorship" },
];

const VALUES_OPTIONS = [
  { tag: "faith",             label: "Faith" },
  { tag: "family",            label: "Family" },
  { tag: "community",         label: "Community" },
  { tag: "creativity",        label: "Creativity" },
  { tag: "wellness",          label: "Wellness" },
  { tag: "career",            label: "Career" },
  { tag: "personal_growth",   label: "Personal growth" },
  { tag: "adventure",         label: "Adventure" },
  { tag: "authenticity",      label: "Authenticity" },
  { tag: "service",           label: "Service" },
  { tag: "financial_freedom", label: "Financial freedom" },
  { tag: "education",         label: "Education" },
];

const AVOID_OPTIONS = [
  { tag: "heavy_drinking",    label: "Heavy drinking" },
  { tag: "bar_scene",         label: "Bar scene" },
  { tag: "nightlife",         label: "Nightlife" },
  { tag: "smoking",           label: "Smoking" },
  { tag: "late_nights",       label: "Late nights" },
  { tag: "drama",             label: "Drama" },
  { tag: "competitive_vibes", label: "Competitive energy" },
];

const LIFE_CHAPTER_OPTIONS = [
  { tag: "new_to_nyc",           label: "New to NYC" },
  { tag: "newly_single",         label: "Newly single" },
  { tag: "newly_divorced",       label: "Navigating divorce" },
  { tag: "recently_engaged",     label: "Recently engaged" },
  { tag: "newly_married",        label: "Newly married" },
  { tag: "new_mom",              label: "New mom" },
  { tag: "postpartum",           label: "Postpartum" },
  { tag: "career_pivot",         label: "Career pivot" },
  { tag: "starting_a_business",  label: "Starting a business" },
  { tag: "newly_sober",          label: "Newly sober" },
  { tag: "healing",              label: "In a healing season" },
  { tag: "thriving_and_expanding", label: "Thriving & expanding" },
  { tag: "empty_nester",         label: "Empty nester" },
  { tag: "student",              label: "Student" },
  { tag: "established_and_rooted", label: "Established & rooted" },
];

const AVAILABILITY_OPTIONS = [
  { tag: "weekday_mornings",    label: "Weekday mornings" },
  { tag: "weekday_afternoons",  label: "Weekday afternoons" },
  { tag: "weekday_evenings",    label: "Weekday evenings" },
  { tag: "weekend_mornings",    label: "Weekend mornings" },
  { tag: "weekend_afternoons",  label: "Weekend afternoons" },
  { tag: "weekend_evenings",    label: "Weekend evenings" },
  { tag: "flexible",            label: "I'm flexible" },
];

const ASPIRATION_OPTIONS = [
  { tag: "more_creative",       label: "Be more creative" },
  { tag: "more_active",         label: "Get more active" },
  { tag: "explore_faith",       label: "Explore my faith" },
  { tag: "go_sober",            label: "Go alcohol-free" },
  { tag: "start_a_business",    label: "Start a business" },
  { tag: "travel_more",         label: "Travel more" },
  { tag: "build_community",     label: "Build community" },
  { tag: "find_my_purpose",     label: "Find my purpose" },
  { tag: "slow_down",           label: "Slow down & be present" },
  { tag: "be_more_social",      label: "Be more social" },
  { tag: "learn_something_new", label: "Learn something new" },
  { tag: "heal",                label: "Heal & move forward" },
  { tag: "grow_spiritually",    label: "Grow spiritually" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function Chip({
  label, selected, onClick, accent,
}: { label: string; selected: boolean; onClick: () => void; accent?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding:       "9px 18px",
        borderRadius:  "100px",
        border:        selected ? `1.5px solid ${accent ?? PINK}` : "1.5px solid #E0D8CF",
        background:    selected ? (accent ?? PINK) : "white",
        color:         selected ? "white" : DARK,
        fontSize:      14,
        fontFamily:    "var(--font-jost)",
        fontWeight:    selected ? 600 : 400,
        cursor:        "pointer",
        transition:    "all 0.15s ease",
        lineHeight:    "1",
      }}
    >
      {label}
    </button>
  );
}

function WeightedChip({
  tag, label, current, onChange,
}: { tag: string; label: string; current: WeightedTag | undefined; onChange: (t: WeightedTag | null) => void }) {
  const state = current?.weight;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <button
        onClick={() => {
          if (!state)        onChange({ tag, weight: "nice" });
          else if (state === "nice") onChange({ tag, weight: "must" });
          else               onChange(null);
        }}
        style={{
          padding:     "9px 18px",
          borderRadius: "100px",
          border:      !state ? "1.5px solid #E0D8CF"
                     : state === "must" ? `2px solid ${PINK}` : `1.5px solid ${PINK}`,
          background:  !state ? "white" : state === "must" ? PINK : "#FFE8F2",
          color:       !state ? DARK : state === "must" ? "white" : PINK,
          fontSize:    14,
          fontFamily:  "var(--font-jost)",
          fontWeight:  state ? 600 : 400,
          cursor:      "pointer",
          transition:  "all 0.15s ease",
        }}
      >
        {label}
      </button>
      {state && (
        <span style={{
          fontSize:   10, fontFamily: "var(--font-jost)",
          color:      state === "must" ? PINK : "#999",
          fontWeight: 600, letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>
          {state === "must" ? "must ✓" : "nice to have"}
        </span>
      )}
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{
        fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 700,
        color: DARK, margin: 0, lineHeight: 1.2,
      }}>{title}</h2>
      <p style={{
        fontFamily: "var(--font-jost)", fontSize: 15, color: "#666",
        margin: "8px 0 0", lineHeight: 1.5,
      }}>{subtitle}</p>
    </div>
  );
}

function SingleSelect({
  options, value, onChange, accent,
}: { options: { tag: string; label: string }[]; value: string; onChange: (v: string) => void; accent?: string }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {options.map(o => (
        <Chip
          key={o.tag} label={o.label}
          selected={value === o.tag}
          onClick={() => onChange(value === o.tag ? "" : o.tag)}
          accent={accent}
        />
      ))}
    </div>
  );
}

function MultiSelect({
  options, values, onChange, accent,
}: { options: { tag: string; label: string }[]; values: string[]; onChange: (v: string[]) => void; accent?: string }) {
  const toggle = (tag: string) =>
    onChange(values.includes(tag) ? values.filter(v => v !== tag) : [...values, tag]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {options.map(o => (
        <Chip
          key={o.tag} label={o.label}
          selected={values.includes(o.tag)}
          onClick={() => toggle(o.tag)}
          accent={accent}
        />
      ))}
    </div>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontFamily: "var(--font-jost)", fontSize: 12, color: "#999",
        marginBottom: 10, letterSpacing: "0.05em",
      }}>
        <span>Step {step + 1} of {total}</span>
        <span>{STEPS[step]}</span>
      </div>
      <div style={{ height: 3, background: "#F0EBE3", borderRadius: 2 }}>
        <div style={{
          height: "100%", borderRadius: 2, background: PINK,
          width: `${((step + 1) / total) * 100}%`,
          transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function PreferencesOnboarding({ onComplete }: { onComplete?: () => void }) {
  const router = useRouter();
  const [step, setStep]   = useState(0);
  const [prefs, setPrefs] = useState<Prefs>(EMPTY);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Prefs>(key: K, value: Prefs[K]) =>
    setPrefs(p => ({ ...p, [key]: value }));

  const getLifestyleTag = (tag: string) => prefs.lifestyle_tags.find(t => t.tag === tag);

  const setLifestyleTag = (t: WeightedTag | null, tag: string) => {
    setPrefs(p => {
      const without = p.lifestyle_tags.filter(x => x.tag !== tag);
      return { ...p, lifestyle_tags: t ? [...without, t] : without };
    });
  };

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const save = async () => {
    setSaving(true);
    try {
      // Reshape lifestyle_tags for API
      const body = {
        ...prefs,
        lifestyle_tags_weighted: prefs.lifestyle_tags,
        lifestyle_tags: prefs.lifestyle_tags.map(t => t.tag),
      };
      await fetch("/api/member/preferences", {
        method:  "POST",
        headers: { "content-type": "application/json" },
        body:    JSON.stringify(body),
      });
      onComplete?.();
      router.push("/member/home");
    } catch {
      setSaving(false);
    }
  };

  const TOTAL = STEPS.length;

  return (
    <div style={{
      minHeight: "100svh", background: PAPER, display: "flex",
      flexDirection: "column", padding: "env(safe-area-inset-top, 0) 0 env(safe-area-inset-bottom, 0)",
    }}>
      {/* Header */}
      <div style={{ padding: "24px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: PINK, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" fill="white"/>
              {[0,72,144,216,288].map((deg, i) => (
                <ellipse key={i} cx="12" cy="5" rx="2" ry="4" fill="white" opacity="0.7"
                  style={{ transformOrigin: "12px 12px", transform: `rotate(${deg}deg)` }} />
              ))}
            </svg>
          </div>
          <span style={{
            fontFamily: "var(--font-playfair)", fontSize: 18,
            fontWeight: 700, color: DARK, fontStyle: "italic",
          }}>
            Tell Yande who you are.
          </span>
        </div>
        <ProgressBar step={step} total={TOTAL} />
      </div>

      {/* Step content */}
      <div style={{ flex: 1, padding: "0 24px", overflowY: "auto" }}>

        {/* Step 0: Who you are */}
        {step === 0 && (
          <div>
            <StepHeader
              title="Let's start with you."
              subtitle="The basics help Yande understand where you are in life."
            />

            <label style={labelStyle}>Age group</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
              {["20s","30s","40s","50+"].map(a => (
                <Chip key={a} label={a} selected={prefs.age_group === a}
                  onClick={() => set("age_group", a)} />
              ))}
            </div>

            <label style={labelStyle}>Are you a mom?</label>
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              <Chip label="Yes, I'm a mom" selected={prefs.is_mother === true}
                onClick={() => set("is_mother", prefs.is_mother === true ? null : true)} />
              <Chip label="Not a mom" selected={prefs.is_mother === false}
                onClick={() => set("is_mother", prefs.is_mother === false ? null : false)} />
            </div>

            <label style={labelStyle}>Relationship status</label>
            <SingleSelect
              options={[
                { tag: "single",       label: "Single" },
                { tag: "partnered",    label: "In a relationship" },
                { tag: "married",      label: "Married" },
                { tag: "divorced",     label: "Divorced" },
                { tag: "complicated",  label: "It's complicated" },
              ]}
              value={prefs.relationship_status}
              onChange={v => set("relationship_status", v)}
            />

            <div style={{ marginTop: 28 }}>
              <label style={labelStyle}>Faith (optional)</label>
              <input
                type="text"
                placeholder="e.g. Christian, Muslim, Spiritual, Atheist..."
                value={prefs.faith}
                onChange={e => set("faith", e.target.value)}
                style={inputStyle}
              />
              <div style={{ marginTop: 10 }}>
                <Chip
                  label="Faith matters to me in friendships"
                  selected={prefs.faith_important}
                  onClick={() => set("faith_important", !prefs.faith_important)}
                  accent={GOLD}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Lifestyle */}
        {step === 1 && (
          <div>
            <StepHeader
              title="Your lifestyle."
              subtitle="Tap once for 'nice to have' — tap again to make it a must. Tap a third time to remove."
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
              {LIFESTYLE_OPTIONS.map(o => (
                <WeightedChip
                  key={o.tag} tag={o.tag} label={o.label}
                  current={getLifestyleTag(o.tag)}
                  onChange={t => setLifestyleTag(t, o.tag)}
                />
              ))}
            </div>

            <label style={labelStyle}>Things you'd rather not encounter in a friend</label>
            <MultiSelect
              options={AVOID_OPTIONS}
              values={prefs.avoid_vibes}
              onChange={v => set("avoid_vibes", v)}
              accent="#E53E3E"
            />
          </div>
        )}

        {/* Step 2: What you love */}
        {step === 2 && (
          <div>
            <StepHeader
              title="What you love doing."
              subtitle="Pick everything that actually sounds like you — not who you want to be."
            />
            <MultiSelect
              options={ACTIVITY_OPTIONS}
              values={prefs.activity_types}
              onChange={v => set("activity_types", v)}
            />
          </div>
        )}

        {/* Step 3: Core values */}
        {step === 3 && (
          <div>
            <StepHeader
              title="What you value most."
              subtitle="Pick up to 5. These are the things that actually drive your life right now."
            />
            <MultiSelect
              options={VALUES_OPTIONS}
              values={prefs.core_values}
              onChange={v => prefs.core_values.includes(v[v.length-1]) || v.length <= 5
                ? set("core_values", v)
                : null
              }
            />
          </div>
        )}

        {/* Step 4: What you're looking for */}
        {step === 4 && (
          <div>
            <StepHeader
              title="What are you looking for right now?"
              subtitle="Be honest. What do you actually want from new friendships?"
            />
            <MultiSelect
              options={SEEKING_OPTIONS}
              values={prefs.seeking}
              onChange={v => set("seeking", v)}
            />

            <div style={{ marginTop: 28 }}>
              <label style={labelStyle}>How do you prefer to connect?</label>
              <SingleSelect
                options={[
                  { tag: "deep_one_on_one", label: "Deep 1-on-1" },
                  { tag: "group_energy",    label: "Group energy" },
                  { tag: "mix_of_both",     label: "Mix of both" },
                ]}
                value={prefs.friendship_style}
                onChange={v => set("friendship_style", v)}
              />
            </div>
          </div>
        )}

        {/* Step 5: Your chapter */}
        {step === 5 && (
          <div>
            <StepHeader
              title="What chapter are you in?"
              subtitle="Women going through the same season connect in a way that nothing else can replicate."
            />
            <SingleSelect
              options={LIFE_CHAPTER_OPTIONS}
              value={prefs.life_chapter}
              onChange={v => set("life_chapter", v)}
            />
          </div>
        )}

        {/* Step 6: Availability */}
        {step === 6 && (
          <div>
            <StepHeader
              title="When are you actually free?"
              subtitle="Compatibility means nothing if you can never meet up."
            />
            <MultiSelect
              options={AVAILABILITY_OPTIONS}
              values={prefs.availability}
              onChange={v => set("availability", v)}
            />

            <div style={{ marginTop: 28 }}>
              <label style={labelStyle}>How often do you want to hang?</label>
              <SingleSelect
                options={[
                  { tag: "weekly",       label: "Every week" },
                  { tag: "biweekly",     label: "Every two weeks" },
                  { tag: "monthly",      label: "Once a month" },
                  { tag: "occasionally", label: "Occasionally" },
                  { tag: "spontaneous",  label: "I'm spontaneous" },
                ]}
                value={prefs.connection_frequency}
                onChange={v => set("connection_frequency", v)}
              />
            </div>
          </div>
        )}

        {/* Step 7: Aspirations */}
        {step === 7 && (
          <div>
            <StepHeader
              title="Who are you becoming?"
              subtitle="Two women moving in the same direction bond differently than two who've already arrived. What are you working toward?"
            />
            <MultiSelect
              options={ASPIRATION_OPTIONS}
              values={prefs.aspirations}
              onChange={v => set("aspirations", v)}
            />

            {/* Final note */}
            <div style={{
              marginTop: 32, padding: "18px 20px",
              background: "#FFF0F6", borderRadius: 16,
              border: `1px solid #FFD6E8`,
            }}>
              <p style={{
                fontFamily: "var(--font-caveat)", fontSize: 17,
                color: PINK, margin: 0, lineHeight: 1.5,
              }}>
                "We don't match on looks. We match on life, energy, and direction." — Yande ✦
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{
        padding:       "20px 24px",
        borderTop:     "1px solid #F0EBE3",
        display:       "flex",
        gap:           12,
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
      }}>
        {step > 0 && (
          <button onClick={back} style={backBtnStyle}>← Back</button>
        )}
        {step < TOTAL - 1 ? (
          <button onClick={next} style={nextBtnStyle}>Continue →</button>
        ) : (
          <button onClick={save} disabled={saving} style={{
            ...nextBtnStyle, opacity: saving ? 0.7 : 1,
          }}>
            {saving ? "Saving..." : "I'm ready. ✦"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display:      "block",
  fontFamily:   "var(--font-jost)",
  fontSize:     12,
  fontWeight:   700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color:        "#888",
  marginBottom: 12,
};

const inputStyle: React.CSSProperties = {
  width:        "100%",
  padding:      "14px 16px",
  borderRadius: 12,
  border:       "1.5px solid #E0D8CF",
  background:   "white",
  fontFamily:   "var(--font-jost)",
  fontSize:     15,
  color:        DARK,
  outline:      "none",
  boxSizing:    "border-box",
};

const nextBtnStyle: React.CSSProperties = {
  flex:         1,
  padding:      "16px",
  borderRadius: "100px",
  border:       "none",
  background:   PINK,
  color:        "white",
  fontFamily:   "var(--font-jost)",
  fontWeight:   700,
  fontSize:     15,
  cursor:       "pointer",
  letterSpacing: "0.04em",
};

const backBtnStyle: React.CSSProperties = {
  padding:      "16px 20px",
  borderRadius: "100px",
  border:       "1.5px solid #E0D8CF",
  background:   "white",
  color:        "#666",
  fontFamily:   "var(--font-jost)",
  fontWeight:   600,
  fontSize:     15,
  cursor:       "pointer",
};
