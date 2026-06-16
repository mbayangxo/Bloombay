"use client";

import { useState } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";

/* ══ Food Partner Template Previews ══════════════════════════════════════════ */

function ChalkboardSpecial({ name, dish, price, note }: { name: string; dish: string; price: string; note: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#1A2318", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 14, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", inset: 6, border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 9, border: "0.5px solid rgba(255,255,255,0.08)", pointerEvents: "none" }} />
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 4, letterSpacing: "0.1em" }}>TODAY&apos;S SPECIAL</p>
      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 20, color: "white", textAlign: "center", lineHeight: 1.1, marginBottom: 6 }}>{dish || "Truffle Pasta"}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ height: 0.5, width: 20, background: "rgba(255,255,255,0.3)" }} />
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "#D4A358" }}>{price || "$28"}</p>
        <div style={{ height: 0.5, width: 20, background: "rgba(255,255,255,0.3)" }} />
      </div>
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: 1.4 }}>{note || "handmade · seasonal ingredients"}</p>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", marginTop: 10 }}>{name || "CAFÉ BLOOM"}</p>
    </div>
  );
}

function ReservationCard({ name, dish, price, note }: { name: string; dish: string; price: string; note: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#FFF8F0", position: "relative", display: "flex", flexDirection: "column", padding: 12, boxSizing: "border-box", justifyContent: "space-between" }}>
      <div style={{ position: "absolute", inset: 8, border: "1px solid #C9A96E", borderRadius: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 11, border: "0.5px solid rgba(201,169,110,0.4)", borderRadius: 1, pointerEvents: "none" }} />
      <div style={{ paddingTop: 8, paddingLeft: 4 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 900, letterSpacing: "0.25em", color: "#C9A96E" }}>RESERVATION NIGHT</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 700, letterSpacing: "0.12em", color: "#888", marginTop: 2 }}>{name || "MAISON BLOOM"}</p>
      </div>
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: "#2C1810", lineHeight: 1.2, marginBottom: 4 }}>{dish || "Chef&apos;s Tasting Menu"}</p>
        <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 8, color: "#8B6B4A" }}>{note || "5 courses · wine pairing available"}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 4 }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "#C9A96E" }}>{price || "$95"}</p>
        <div style={{ display: "inline-flex", background: "#2C1810", borderRadius: 999, padding: "4px 10px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, color: "white", letterSpacing: "0.1em" }}>RESERVE →</p>
        </div>
      </div>
    </div>
  );
}

function BrunchCard({ name, dish, price, note }: { name: string; dish: string; price: string; note: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg, #FFF9F0 0%, #FFF0E8 100%)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: 12, boxSizing: "border-box" }}>
      {/* Sun rays */}
      <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, background: "rgba(255,180,80,0.12)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: -15, right: -15, width: 60, height: 60, background: "rgba(255,180,80,0.1)", borderRadius: "50%" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#F59E0B", marginBottom: 2 }}>Sunday Brunch ♡</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 800, letterSpacing: "0.18em", color: "#D97706", marginBottom: 8 }}>{name || "BLOOM KITCHEN"}</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, fontWeight: 700, color: "#92400E", lineHeight: 1.2, marginBottom: 4 }}>{dish || "Avocado Toast\n& Bottomless Mimosas"}</p>
        <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 8, color: "#B45309", lineHeight: 1.4 }}>{note || "every sunday · 11am–3pm"}</p>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "#F59E0B" }}>{price || "$32 pp"}</p>
          <div style={{ background: "#F59E0B", borderRadius: 999, padding: "4px 10px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, color: "white" }}>JOIN →</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChefsTableCard({ name, dish, price, note }: { name: string; dish: string; price: string; note: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0C0808", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 14, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 120, height: 120, background: "rgba(212,163,88,0.06)", borderRadius: "50%", filter: "blur(20px)" }} />
      <div style={{ position: "absolute", inset: 8, border: "0.5px solid rgba(212,163,88,0.25)", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 900, letterSpacing: "0.28em", color: "rgba(212,163,88,0.5)", marginBottom: 8 }}>CHEF&apos;S TABLE</p>
        <div style={{ width: 30, height: 0.5, background: "rgba(212,163,88,0.4)", margin: "0 auto 8px" }} />
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, fontWeight: 700, color: "#FFF5E4", lineHeight: 1.2, marginBottom: 6 }}>{dish || "Private Dining\nExperience"}</p>
        <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 8, color: "rgba(255,245,228,0.4)", marginBottom: 10 }}>{note || "seasonal tasting · 8 guests max"}</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "#D4A358", marginBottom: 8 }}>{price || "$185"}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, letterSpacing: "0.14em", color: "rgba(212,163,88,0.5)" }}>{name || "THE BLOOM ROOM"}</p>
      </div>
    </div>
  );
}

function WeeklyMenuCard({ name, dish, price, note }: { name: string; dish: string; price: string; note: string }) {
  const items = [dish || "Seared Salmon", "Garden Salad", "Mushroom Risotto"];
  return (
    <div style={{ width: "100%", height: "100%", background: "white", position: "relative", display: "flex", flexDirection: "column", padding: 12, boxSizing: "border-box" }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${PINK}, #FF69B4)`, borderRadius: 999, marginBottom: 8 }} />
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 900, letterSpacing: "0.22em", color: "#888", marginBottom: 2 }}>THIS WEEK&apos;S MENU</p>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, color: PINK, marginBottom: 10 }}>{name || "BLOOM BISTRO"}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: [PINK, "#FF69B4", "#C084FC"][i], flexShrink: 0 }} />
            <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 11, color: "#1C1B1C" }}>{item}</p>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 8, color: "#888", marginBottom: 6, lineHeight: 1.3 }}>{note || "locally sourced · prepared fresh daily"}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: PINK }}>from {price || "$18"}</p>
        <div style={{ background: `${PINK}12`, border: `1px solid ${PINK}44`, borderRadius: 999, padding: "3px 8px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, color: PINK }}>ORDER →</p>
        </div>
      </div>
    </div>
  );
}

function PopUpCard({ name, dish, price, note }: { name: string; dish: string; price: string; note: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${PINK} 0%, #C8006A 100%)`, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 12, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: -10, left: -10, width: 60, height: 60, background: "rgba(0,0,0,0.08)", borderRadius: "50%" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 900, letterSpacing: "0.22em", color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>POP-UP ALERT ✦</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, fontWeight: 700, color: "white", lineHeight: 1.1, marginBottom: 4 }}>{dish || "Street Food\nSunday"}</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 9, color: "rgba(255,255,255,0.8)" }}>{note || "this sunday only!"}</p>
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.2)", marginBottom: 6 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "white" }}>{price || "$12–$20"}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, color: "rgba(255,255,255,0.5)" }}>{name || "BLOOM BITES"}</p>
          </div>
          <div style={{ background: "white", borderRadius: 999, padding: "5px 12px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 900, color: PINK }}>FIND US →</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ Template registry ═══════════════════════════════════════════════════════ */

type FoodTemplateId = "chalkboard" | "reservation" | "brunch" | "chefstable" | "menu" | "popup";

const FOOD_TEMPLATES: { id: FoodTemplateId; label: string; tag: string; tagColor: string }[] = [
  { id: "chalkboard",  label: "Daily Special",    tag: "ARTISAN",   tagColor: "#4A7060" },
  { id: "reservation", label: "Reservation Night", tag: "ELEGANT",   tagColor: "#C9A96E" },
  { id: "brunch",      label: "Sunday Brunch",     tag: "MORNING",   tagColor: "#F59E0B" },
  { id: "chefstable",  label: "Chef's Table",      tag: "EXCLUSIVE", tagColor: "#D4A358" },
  { id: "menu",        label: "Weekly Menu",       tag: "FRESH",     tagColor: PINK },
  { id: "popup",       label: "Pop-Up Alert",      tag: "URGENT",    tagColor: PINK },
];

function renderFoodPreview(id: FoodTemplateId, name: string, dish: string, price: string, note: string) {
  if (id === "chalkboard")  return <ChalkboardSpecial name={name} dish={dish} price={price} note={note} />;
  if (id === "reservation") return <ReservationCard   name={name} dish={dish} price={price} note={note} />;
  if (id === "brunch")      return <BrunchCard        name={name} dish={dish} price={price} note={note} />;
  if (id === "chefstable")  return <ChefsTableCard    name={name} dish={dish} price={price} note={note} />;
  if (id === "menu")        return <WeeklyMenuCard     name={name} dish={dish} price={price} note={note} />;
  if (id === "popup")       return <PopUpCard          name={name} dish={dish} price={price} note={note} />;
  return null;
}

/* ══ Main page ═══════════════════════════════════════════════════════════════ */

export default function FoodTemplatesPage() {
  const [selected, setSelected] = useState<FoodTemplateId | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [restaurantName, setRestaurantName] = useState("");
  const [dish, setDish] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [posted, setPosted] = useState(false);

  if (posted) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #FFF5EC 0%, #FFF0E8 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 38, color: PINK, marginBottom: 12 }}>posted ✦</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, color: "#1C1B1C", marginBottom: 8 }}>Your menu is live.</p>
        <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 13, color: "#888", marginBottom: 28 }}>Bloomies are seeing your special now.</p>
        <Link href="/member/happenings" style={{ textDecoration: "none" }}>
          <div style={{ background: PINK, color: "white", borderRadius: 999, padding: "12px 28px", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em" }}>BACK TO THE CITY →</div>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8", paddingBottom: 100, fontFamily: "var(--font-jost)" }}>
      {/* Top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 51, background: "linear-gradient(135deg, #F97316 0%, #E8540A 100%)", height: 54, paddingTop: "env(safe-area-inset-top, 0px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <Link href="/member/happenings" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
          </svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Back</span>
        </Link>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", color: "white" }}>FOOD PARTNER TEMPLATES</p>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ paddingTop: 70 }}>
        {step === 1 && (
          <>
            <div style={{ padding: "16px 18px 12px" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, fontWeight: 700, color: "#1C1B1C", marginBottom: 4 }}>Your dish, your story.</p>
              <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 13, color: "#888" }}>Choose a template for your restaurant or food business.</p>
            </div>
            <div style={{ padding: "0 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              {FOOD_TEMPLATES.map(t => {
                const active = selected === t.id;
                return (
                  <button key={t.id} onClick={() => setSelected(t.id)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: active ? `0 0 0 3px #F97316, 0 8px 28px rgba(249,115,22,0.3)` : "0 2px 16px rgba(0,0,0,0.1)", transition: "all 0.18s", transform: active ? "scale(1.02)" : "scale(1)" }}>
                      <div style={{ width: "100%", height: 160, overflow: "hidden", position: "relative" }}>
                        {renderFoodPreview(t.id, "", "", "", "")}
                        {active && (
                          <div style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: "50%", background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        )}
                      </div>
                      <div style={{ background: active ? "#F97316" : "white", padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.18s" }}>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: active ? "white" : "#1C1B1C" }}>{t.label}</p>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", color: active ? "rgba(255,255,255,0.7)" : t.tagColor }}>{t.tag}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ position: "fixed", bottom: 80, left: 16, right: 16 }}>
              <button onClick={() => selected && setStep(2)} disabled={!selected} style={{ width: "100%", padding: "15px", borderRadius: 999, border: "none", background: selected ? "#F97316" : "#EEE", color: selected ? "white" : "#CCC", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", cursor: selected ? "pointer" : "not-allowed", boxShadow: selected ? "0 4px 20px rgba(249,115,22,0.55)" : "none", transition: "all 0.18s" }}>
                {selected ? "USE THIS TEMPLATE →" : "SELECT A TEMPLATE"}
              </button>
            </div>
          </>
        )}

        {step === 2 && selected && (
          <div style={{ padding: "0 18px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "#F97316", marginBottom: 10 }}>LIVE PREVIEW</p>
            <div style={{ height: 200, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", marginBottom: 20 }}>
              {renderFoodPreview(selected, restaurantName, dish, price, note)}
            </div>
            {[
              { label: "Restaurant Name", val: restaurantName, set: setRestaurantName, ph: "e.g. Café Bloom" },
              { label: "Dish / Offering",  val: dish,          set: setDish,           ph: "e.g. Truffle Pasta" },
              { label: "Price",            val: price,         set: setPrice,          ph: "e.g. $28" },
              { label: "Note / Tagline",   val: note,          set: setNote,           ph: "e.g. handmade · seasonal" },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "#888", marginBottom: 6 }}>{f.label.toUpperCase()}</p>
                <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #E8E4DC", background: "white", fontFamily: "var(--font-jost)", fontSize: 13, color: "#1C1B1C", outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <button onClick={() => setPosted(true)} style={{ width: "100%", padding: "16px", borderRadius: 999, border: "none", background: "#F97316", color: "white", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", cursor: "pointer", boxShadow: "0 4px 20px rgba(249,115,22,0.55)", marginTop: 8, marginBottom: 20 }}>
              POST TO THE CITY ✦
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
