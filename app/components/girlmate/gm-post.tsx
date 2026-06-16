"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PINK  = "#FF1F7D";
const PLUM  = "#1A0A2E";

type ListingType = "room" | "apartment" | "roommate-wanted" | "co-search";

const TYPE_OPTIONS: { value: ListingType; label: string; sub: string }[] = [
  { value: "room",             label: "Room Available",      sub: "I have a room to fill" },
  { value: "apartment",        label: "Full Apartment",      sub: "Full place available" },
  { value: "roommate-wanted",  label: "Looking for Roommate", sub: "I need someone to move in" },
  { value: "co-search",        label: "Co-Searching",        sub: "Let's find a place together" },
];

const CITIES = ["New York City", "London", "Los Angeles", "Atlanta", "Chicago"];

const LIFESTYLE_OPTIONS = [
  "Early bird", "Night owl", "Work from home", "Social butterfly", "Homebody",
  "Fitness lover", "Plant parent", "Clean freak", "Laid-back", "Foodie",
  "No smoking", "420 friendly", "Pet owner", "Muslim", "Vegan",
];

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 14px", borderRadius: 999, fontSize: 12, fontFamily: "var(--font-jost)", fontWeight: 600,
        cursor: "pointer", border: "1.5px solid",
        background: selected ? PINK : "rgba(255,255,255,0.06)",
        borderColor: selected ? PINK : "rgba(255,255,255,0.15)",
        color: selected ? "white" : "rgba(255,255,255,0.6)",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
        borderRadius: 12, cursor: "pointer", background: "rgba(255,255,255,0.05)",
        border: `1.5px solid ${value ? PINK : "rgba(255,255,255,0.1)"}`,
        color: value ? "white" : "rgba(255,255,255,0.5)", transition: "all 0.15s",
        fontFamily: "var(--font-jost)", fontSize: 13,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: 4, flexShrink: 0,
        background: value ? PINK : "rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {value && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
      </div>
      {label}
    </button>
  );
}

export function GMPostPage() {
  const router = useRouter();
  const [saving, setSaving]     = useState(false);
  const [step, setStep]         = useState(1);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);
  const [existing, setExisting] = useState(false);

  // Form state
  const [listingType, setListingType] = useState<ListingType>("room");
  const [city, setCity]               = useState("New York City");
  const [neighborhood, setNeighborhood] = useState("");
  const [price, setPrice]             = useState("");
  const [availFrom, setAvailFrom]     = useState("");
  const [availTo, setAvailTo]         = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags]               = useState<string[]>([]);

  // Toggles
  const [furnished, setFurnished]           = useState(false);
  const [privateBath, setPrivateBath]       = useState(false);
  const [pets, setPets]                     = useState(false);
  const [smoking, setSmoking]               = useState(false);
  const [weedOk, setWeedOk]                 = useState(false);
  const [halalKitchen, setHalalKitchen]     = useState(false);
  const [wfhFriendly, setWfhFriendly]       = useState(false);
  const [partnerOk, setPartnerOk]           = useState(false);

  useEffect(() => {
    fetch("/api/girlmate/my-listing")
      .then(r => r.ok ? r.json() : null)
      .then((data: Record<string, unknown> | null) => {
        if (!data) return;
        setExisting(true);
        setListingType((data.listing_type as ListingType) ?? "room");
        setCity((data.city as string) ?? "New York City");
        setNeighborhood((data.neighborhood_name as string) ?? "");
        setPrice(data.price_cents ? String(Math.round((data.price_cents as number) / 100)) : "");
        setAvailFrom((data.available_from as string) ?? "");
        setAvailTo((data.available_to as string) ?? "");
        setDisplayName((data.display_name as string) ?? "");
        setDescription((data.description as string) ?? "");
        setTags((data.lifestyle_tags as string[]) ?? []);
        setFurnished(!!(data.furnished));
        setPrivateBath(!!(data.private_bathroom));
        setPets(!!(data.pets));
        setSmoking(!!(data.smoking));
        setWeedOk(!!(data.weed_ok));
        setHalalKitchen(!!(data.halal_kitchen));
        setWfhFriendly(!!(data.wfh_friendly));
        setPartnerOk(!!(data.partner_ok));
      })
      .catch(() => {});
  }, []);

  function toggleTag(t: string) {
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) { setError("Please add a description."); return; }

    setSaving(true);
    setError(null);

    const res = await fetch("/api/girlmate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listing_type: listingType,
        city, neighborhood, price,
        available_from: availFrom || null,
        available_to:   availTo || null,
        furnished, private_bathroom: privateBath,
        pets, smoking, weed_ok: weedOk,
        halal_kitchen: halalKitchen, wfh_friendly: wfhFriendly, partner_ok: partnerOk,
        description, display_name: displayName, lifestyle_tags: tags,
      }),
    });

    setSaving(false);
    if (!res.ok) {
      const d = await res.json() as { error?: string };
      setError(d.error ?? "Something went wrong.");
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/girlmate/home"), 1500);
  }

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: PLUM, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🌸</p>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 24, color: "white" }}>Listing {existing ? "updated" : "posted"}.</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>Redirecting you home…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: PLUM, paddingBottom: 60 }}>
      <style>{`
        .gm-input {
          width: 100%; padding: 13px 15px; border-radius: 13px;
          background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.12);
          color: white; font-family: var(--font-jost); font-size: 14px; outline: none;
          box-sizing: border-box;
        }
        .gm-input:focus { border-color: rgba(255,31,125,0.5); }
        .gm-input::placeholder { color: rgba(255,255,255,0.3); }
        select.gm-input option { background: #1A0A2E; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 16 }}>
        <Link href="/girlmate/home" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 20 }}>←</Link>
        <div>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 20, color: "white", lineHeight: 1 }}>
            {existing ? "Edit listing" : "Post a listing"}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>GirlMate · Women-Only Housing</p>
        </div>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px" }}>
        {error && (
          <div style={{ background: "rgba(255,31,125,0.15)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, border: "1px solid rgba(255,31,125,0.3)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: PINK }}>{error}</p>
          </div>
        )}

        {/* Step 1: Type */}
        <section style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", color: PINK, marginBottom: 12 }}>WHAT ARE YOU POSTING?</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {TYPE_OPTIONS.map(o => (
              <button
                key={o.value}
                type="button"
                onClick={() => setListingType(o.value)}
                style={{
                  padding: "14px 12px", borderRadius: 14, cursor: "pointer", textAlign: "left",
                  background: listingType === o.value ? "rgba(255,31,125,0.18)" : "rgba(255,255,255,0.05)",
                  border: `2px solid ${listingType === o.value ? PINK : "rgba(255,255,255,0.1)"}`,
                  transition: "all 0.15s",
                }}
              >
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: listingType === o.value ? "white" : "rgba(255,255,255,0.7)", marginBottom: 3 }}>{o.label}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{o.sub}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Location */}
        <section style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", color: PINK, marginBottom: 12 }}>WHERE?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <select className="gm-input" value={city} onChange={e => setCity(e.target.value)}>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              className="gm-input"
              type="text"
              placeholder="Neighborhood (e.g. Crown Heights, Hackney)"
              value={neighborhood}
              onChange={e => setNeighborhood(e.target.value)}
            />
          </div>
        </section>

        {/* Step 3: Details */}
        <section style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", color: PINK, marginBottom: 12 }}>DETAILS</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>PRICE/MO</p>
              <input className="gm-input" type="number" placeholder="$0" value={price} onChange={e => setPrice(e.target.value)} min="0" />
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>AVAILABLE</p>
              <input className="gm-input" type="date" value={availFrom} onChange={e => setAvailFrom(e.target.value)} />
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>UNTIL</p>
              <input className="gm-input" type="date" value={availTo} onChange={e => setAvailTo(e.target.value)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Toggle label="Furnished" value={furnished} onChange={setFurnished} />
            <Toggle label="Private bathroom" value={privateBath} onChange={setPrivateBath} />
            <Toggle label="Pets OK" value={pets} onChange={setPets} />
            <Toggle label="WFH friendly" value={wfhFriendly} onChange={setWfhFriendly} />
            <Toggle label="Halal kitchen" value={halalKitchen} onChange={setHalalKitchen} />
            <Toggle label="Smoking OK" value={smoking} onChange={setSmoking} />
            <Toggle label="420 OK" value={weedOk} onChange={setWeedOk} />
            <Toggle label="Partner can visit" value={partnerOk} onChange={setPartnerOk} />
          </div>
        </section>

        {/* Step 4: About */}
        <section style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", color: PINK, marginBottom: 12 }}>ABOUT YOU</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>HOW TO DISPLAY YOUR NAME</p>
              <input
                className="gm-input"
                type="text"
                placeholder="e.g. Amara, Zara T., or Anonymous"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
              />
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>DESCRIPTION *</p>
              <textarea
                className="gm-input"
                placeholder="Tell us about the space or yourself — what kind of flatmate are you? What matters most to you?"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                required
                style={{ resize: "vertical", minHeight: 100 }}
              />
            </div>

            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>YOUR VIBE (SELECT ALL THAT APPLY)</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {LIFESTYLE_OPTIONS.map(t => (
                  <Chip key={t} label={t} selected={tags.includes(t)} onClick={() => toggleTag(t)} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          style={{
            width: "100%", padding: "16px", borderRadius: 999, border: "none",
            background: saving ? "rgba(255,31,125,0.5)" : PINK,
            color: "white", fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800,
            cursor: saving ? "not-allowed" : "pointer", letterSpacing: "0.04em",
          }}
        >
          {saving ? "Saving…" : existing ? "Update listing ✦" : "Post listing ✦"}
        </button>
      </form>
    </div>
  );
}
