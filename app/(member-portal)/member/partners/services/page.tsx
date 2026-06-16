"use client";

import { useState } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";

/* ══ Service Partner Template Previews ════════════════════════════════════════ */

function SpaCard({ biz, service, price, note }: { biz: string; service: string; price: string; note: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg, #F8F4F0 0%, #EDE8E4 100%)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 14, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: -20, right: -20, width: 70, height: 70, background: "rgba(180,140,120,0.1)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: -15, left: -15, width: 50, height: 50, background: "rgba(180,140,120,0.08)", borderRadius: "50%" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 9, color: "#B49080", marginBottom: 4 }}>restore · renew · glow</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, fontWeight: 700, color: "#5C3A28", lineHeight: 1.2, marginBottom: 6 }}>{service || "Signature\nFacial"}</p>
        <div style={{ width: 20, height: 0.5, background: "#B49080", margin: "0 auto 6px" }} />
        <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 8, color: "#8B6B5A" }}>{note || "60 min · glow guaranteed"}</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "#B49080", marginTop: 8 }}>{price || "$120"}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 800, letterSpacing: "0.18em", color: "#C4A090", marginTop: 6 }}>{biz || "BLOOM SPA"}</p>
      </div>
    </div>
  );
}

function WorkshopCard({ biz, service, price, note }: { biz: string; service: string; price: string; note: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "white", position: "relative", display: "flex", flexDirection: "column", padding: 12, boxSizing: "border-box" }}>
      <div style={{ background: "#1C1B1C", borderRadius: 4, padding: "6px 10px", marginBottom: 10, alignSelf: "flex-start" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 900, letterSpacing: "0.22em", color: "white" }}>WORKSHOP</p>
      </div>
      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, fontWeight: 700, color: "#1C1B1C", lineHeight: 1.2, marginBottom: 6 }}>{service || "Candle Making\nMasterclass"}</p>
      <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 8, color: "#888", lineHeight: 1.4, flex: 1 }}>{note || "learn · create · take home"}</p>
      <div style={{ marginTop: 6 }}>
        <div style={{ height: 1, background: "#F0EDE8", marginBottom: 8 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "#1C1B1C" }}>{price || "$65 pp"}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, color: "#AAA", letterSpacing: "0.1em" }}>{biz || "BLOOM STUDIO"}</p>
          </div>
          <div style={{ background: "#1C1B1C", borderRadius: 999, padding: "5px 12px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, color: "white" }}>ENROLL →</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FashionCard({ biz, service, price, note }: { biz: string; service: string; price: string; note: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#09000F", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 12, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(180deg, #C96B9E22 0%, transparent 100%)" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 900, letterSpacing: "0.28em", color: "rgba(255,255,255,0.25)", marginBottom: 6 }}>PRIVATE SHOPPING</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.1 }}>{service || "Curated\nStyling Session"}</p>
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ width: 30, height: 0.5, background: "rgba(255,255,255,0.2)", marginBottom: 8 }} />
        <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 8, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{note || "by appointment · personal stylist"}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "white" }}>{price || "$200"}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>{biz || "MAISON BLOOM"}</p>
          </div>
          <div style={{ border: "0.5px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "4px 10px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>BOOK →</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FitnessCard({ biz, service, price, note }: { biz: string; service: string; price: string; note: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${PINK} 0%, #C8006A 100%)`, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: 12, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: "50%", right: -20, transform: "translateY(-50%)", width: 80, height: 80, background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 900, letterSpacing: "0.22em", color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>FITNESS CLASS</p>
      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, fontWeight: 700, color: "white", lineHeight: 1.1, flex: 1 }}>{service || "Pilates &\nProsecco"}</p>
      <div>
        <div style={{ height: 0.5, background: "rgba(255,255,255,0.2)", marginBottom: 8 }} />
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>{note || "work it out · then sip ✦"}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "white" }}>{price || "$35"}</p>
          <div style={{ background: "white", borderRadius: 999, padding: "5px 12px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 900, color: PINK }}>SIGN UP →</p>
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, color: "rgba(255,255,255,0.4)", marginTop: 4, letterSpacing: "0.12em" }}>{biz || "BLOOM MOVEMENT"}</p>
      </div>
    </div>
  );
}

function BeautyCard({ biz, service, price, note }: { biz: string; service: string; price: string; note: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#FFF0F8", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 14, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", top: -10, left: -10, width: 50, height: 50, background: `${PINK}10`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: -10, right: -10, width: 60, height: 60, background: `${PINK}08`, borderRadius: "50%" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: PINK, marginBottom: 4 }}>beauty moment ♡</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, fontWeight: 700, color: "#2C0A1A", lineHeight: 1.2, marginBottom: 6 }}>{service || "Lash & Brow\nGlow Up"}</p>
        <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 8, color: "#AA5080", lineHeight: 1.4 }}>{note || "look good · feel even better"}</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: PINK, marginTop: 8 }}>{price || "$85"}</p>
        <div style={{ marginTop: 6, display: "inline-flex", background: PINK, borderRadius: 999, padding: "4px 12px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, color: "white" }}>BOOK →</p>
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 800, letterSpacing: "0.16em", color: `${PINK}60`, marginTop: 6 }}>{biz || "BLOOM BEAUTY"}</p>
      </div>
    </div>
  );
}

function MembershipCard({ biz, service, price, note }: { biz: string; service: string; price: string; note: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg, #1C0A28 0%, #2D0A3A 100%)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: 12, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", inset: 8, border: "0.5px solid rgba(180,100,240,0.25)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 100, height: 100, background: "rgba(160,80,220,0.08)", borderRadius: "50%", filter: "blur(20px)" }} />
      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 900, letterSpacing: "0.24em", color: "rgba(180,120,255,0.5)", marginBottom: 6 }}>MEMBERSHIP OFFER</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, fontWeight: 700, color: "white", lineHeight: 1.2 }}>{service || "VIP Access\nAll Year"}</p>
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 8, color: "rgba(255,255,255,0.35)", marginBottom: 8, lineHeight: 1.4 }}>{note || "unlimited visits · priority booking"}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "#B478FF" }}>{price || "$49/mo"}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em" }}>{biz || "BLOOM CLUB"}</p>
            </div>
            <div style={{ background: "rgba(180,120,255,0.2)", border: "0.5px solid rgba(180,120,255,0.4)", borderRadius: 999, padding: "4px 10px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, color: "#B478FF" }}>JOIN →</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ Template registry ═══════════════════════════════════════════════════════ */

type SvcTemplateId = "spa" | "workshop" | "fashion" | "fitness" | "beauty" | "membership";

const SVC_TEMPLATES: { id: SvcTemplateId; label: string; tag: string; tagColor: string }[] = [
  { id: "spa",        label: "Spa & Wellness",    tag: "TRANQUIL",   tagColor: "#B49080" },
  { id: "workshop",   label: "Workshop Class",    tag: "CREATIVE",   tagColor: "#1C1B1C" },
  { id: "fashion",    label: "Private Styling",   tag: "EXCLUSIVE",  tagColor: "#C96B9E" },
  { id: "fitness",    label: "Fitness Class",     tag: "ENERGY",     tagColor: PINK },
  { id: "beauty",     label: "Beauty Service",    tag: "GLOW",       tagColor: PINK },
  { id: "membership", label: "Membership Offer",  tag: "VIP",        tagColor: "#B478FF" },
];

function renderSvcPreview(id: SvcTemplateId, biz: string, service: string, price: string, note: string) {
  if (id === "spa")        return <SpaCard        biz={biz} service={service} price={price} note={note} />;
  if (id === "workshop")   return <WorkshopCard   biz={biz} service={service} price={price} note={note} />;
  if (id === "fashion")    return <FashionCard    biz={biz} service={service} price={price} note={note} />;
  if (id === "fitness")    return <FitnessCard    biz={biz} service={service} price={price} note={note} />;
  if (id === "beauty")     return <BeautyCard     biz={biz} service={service} price={price} note={note} />;
  if (id === "membership") return <MembershipCard biz={biz} service={service} price={price} note={note} />;
  return null;
}

/* ══ Main page ═══════════════════════════════════════════════════════════════ */

export default function ServiceTemplatesPage() {
  const [selected, setSelected] = useState<SvcTemplateId | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [bizName, setBizName] = useState("");
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [posted, setPosted] = useState(false);

  if (posted) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #FFF0F8 0%, #F8F0FF 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 38, color: "#B478FF", marginBottom: 12 }}>live ✦</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, color: "#1C1B1C", marginBottom: 28 }}>Your offer is live for Bloomies.</p>
        <Link href="/member/happenings" style={{ textDecoration: "none" }}>
          <div style={{ background: PINK, color: "white", borderRadius: 999, padding: "12px 28px", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em" }}>BACK TO THE CITY →</div>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8", paddingBottom: 100, fontFamily: "var(--font-jost)" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 51, background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)", height: 54, paddingTop: "env(safe-area-inset-top, 0px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
        <Link href="/member/happenings" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
          </svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Back</span>
        </Link>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 900, letterSpacing: "0.08em", color: "white" }}>SERVICE TEMPLATES</p>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ paddingTop: 70 }}>
        {step === 1 && (
          <>
            <div style={{ padding: "16px 18px 12px" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, fontWeight: 700, color: "#1C1B1C", marginBottom: 4 }}>Showcase your service.</p>
              <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 13, color: "#888" }}>Pick a template for your business offering.</p>
            </div>
            <div style={{ padding: "0 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              {SVC_TEMPLATES.map(t => {
                const active = selected === t.id;
                return (
                  <button key={t.id} onClick={() => setSelected(t.id)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: active ? "0 0 0 3px #7C3AED, 0 8px 28px rgba(124,58,237,0.3)" : "0 2px 16px rgba(0,0,0,0.1)", transition: "all 0.18s", transform: active ? "scale(1.02)" : "scale(1)" }}>
                      <div style={{ width: "100%", height: 160, overflow: "hidden", position: "relative" }}>
                        {renderSvcPreview(t.id, "", "", "", "")}
                        {active && (
                          <div style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: "50%", background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5 }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        )}
                      </div>
                      <div style={{ background: active ? "#7C3AED" : "white", padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.18s" }}>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: active ? "white" : "#1C1B1C" }}>{t.label}</p>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", color: active ? "rgba(255,255,255,0.7)" : t.tagColor }}>{t.tag}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ position: "fixed", bottom: 80, left: 16, right: 16 }}>
              <button onClick={() => selected && setStep(2)} disabled={!selected} style={{ width: "100%", padding: "15px", borderRadius: 999, border: "none", background: selected ? "#7C3AED" : "#EEE", color: selected ? "white" : "#CCC", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", cursor: selected ? "pointer" : "not-allowed", transition: "all 0.18s" }}>
                {selected ? "USE THIS TEMPLATE →" : "SELECT A TEMPLATE"}
              </button>
            </div>
          </>
        )}

        {step === 2 && selected && (
          <div style={{ padding: "0 18px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "#7C3AED", marginBottom: 10 }}>LIVE PREVIEW</p>
            <div style={{ height: 200, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", marginBottom: 20 }}>
              {renderSvcPreview(selected, bizName, service, price, note)}
            </div>
            {[
              { label: "Business Name",   val: bizName,  set: setBizName,  ph: "e.g. Bloom Spa" },
              { label: "Service / Class", val: service,  set: setService,  ph: "e.g. Signature Facial" },
              { label: "Price",           val: price,    set: setPrice,    ph: "e.g. $120" },
              { label: "Tagline / Note",  val: note,     set: setNote,     ph: "e.g. 60 min · glow guaranteed" },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "#888", marginBottom: 6 }}>{f.label.toUpperCase()}</p>
                <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #E8E4DC", background: "white", fontFamily: "var(--font-jost)", fontSize: 13, color: "#1C1B1C", outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <button onClick={() => setPosted(true)} style={{ width: "100%", padding: "16px", borderRadius: 999, border: "none", background: "#7C3AED", color: "white", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,0.55)", marginTop: 8, marginBottom: 20 }}>
              POST TO THE CITY ✦
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
