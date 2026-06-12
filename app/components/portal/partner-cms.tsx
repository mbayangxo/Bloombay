"use client";

import React, { useState, useRef } from "react";
import { updatePartner, addPartnerPhoto, removePartnerPhoto } from "@/lib/actions/partners";
import { uploadPartnerPhoto } from "@/lib/storage/upload";
import type { PartnerData, GirlFavorite, PartnerReview } from "@/lib/actions/partners";

const PINK  = "#FF1F7D";
const CREAM = "#F6F1EB";
const DARK  = "#1C1B1C";

const FONT_JOST    = "var(--font-jost)";
const FONT_PLAY    = "var(--font-playfair)";
const FONT_CAVEAT  = "var(--font-caveat)";

// ── Field helpers ─────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: FONT_JOST, fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.18em", color: "#9A8A7A", marginBottom: 6 }}>
      {children}
    </p>
  );
}

function TextInput({ value, onChange, placeholder, multiline = false, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; rows?: number;
}) {
  const base: React.CSSProperties = {
    width: "100%", background: "#FDFBF7", border: "1.5px solid #E8E0D4", borderRadius: 8,
    padding: "10px 12px", fontFamily: FONT_JOST, fontSize: "11px", color: DARK,
    outline: "none", resize: multiline ? "vertical" : "none", boxSizing: "border-box",
  };
  return multiline
    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={base}/>
    : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base}/>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: "#E8E0D4" }}/>
        <span style={{ fontFamily: FONT_JOST, fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.22em", color: PINK }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: "#E8E0D4" }}/>
      </div>
      {children}
    </div>
  );
}

// ── Tab strip ─────────────────────────────────────────────────────────────────
type Tab = "basics" | "content" | "photos" | "menu" | "reviews";
const TABS: { id: Tab; label: string }[] = [
  { id: "basics",  label: "Basics"  },
  { id: "content", label: "Content" },
  { id: "photos",  label: "Photos"  },
  { id: "menu",    label: "Menu"    },
  { id: "reviews", label: "Reviews" },
];

// ── Main CMS form ─────────────────────────────────────────────────────────────
export function PartnerCMS({ partner }: { partner: PartnerData }) {
  const [tab, setTab]       = useState<Tab>("basics");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState<string | null>(null);

  // ── Basics fields ────────────────────────────────────────────────────────
  const [name, setName]               = useState(partner.name ?? "");
  const [tagline, setTagline]         = useState(partner.tagline ?? "");
  const [about, setAbout]             = useState(partner.about ?? "");
  const [neighborhood, setNeighborhood] = useState(partner.neighborhood ?? "");
  const [hours, setHours]             = useState<Record<string,string>>(partner.hours ?? {});
  const [instagram, setInstagram]     = useState(partner.instagram ?? "");
  const [address, setAddress]         = useState(partner.address ?? "");
  const [priceRange, setPriceRange]   = useState(partner.price_range ?? "$$");
  const [brandColor, setBrandColor]   = useState(partner.brand_color ?? PINK);
  const [restaurantType, setRestaurantType] = useState(partner.restaurant_type ?? "casual");

  // ── Content fields ───────────────────────────────────────────────────────
  const [poem, setPoem]                 = useState(partner.poem ?? "");
  const [polaroidCaption, setPolaroid]  = useState(partner.polaroid_caption ?? "");
  const [hostNoteText, setHostNoteText] = useState<string>(() => {
    // host_note is stored as a string in DB
    if (typeof partner.host_note === "string") return partner.host_note;
    return "";
  });
  const [tipsRaw, setTipsRaw] = useState((partner.bloom_tips ?? []).join("\n"));
  const [favoritesRaw, setFavoritesRaw] = useState<GirlFavorite[]>(
    partner.girl_favorites ?? [{ name: "", description: "" }, { name: "", description: "" }, { name: "", description: "" }]
  );

  // ── Photos ───────────────────────────────────────────────────────────────
  const [photoUrls, setPhotoUrls] = useState<string[]>(partner.photo_urls ?? []);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Menu highlights ──────────────────────────────────────────────────────
  const [menuItems, setMenuItems] = useState<{ item: string; price: string; note: string }[]>(
    (partner.girl_favorites ?? []).length > 0
      ? []
      : [{ item: "", price: "", note: "" }]
  );

  // ── Reviews ──────────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<PartnerReview[]>(
    partner.reviews ?? [{ author: "", text: "", rating: 5 }]
  );

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const tips = tipsRaw.split("\n").map(s => s.trim()).filter(Boolean);
      await updatePartner(partner.id, {
        name, tagline, about, neighborhood,
        instagram, address, price_range: priceRange, brand_color: brandColor,
        restaurant_type: restaurantType,
        poem, polaroid_caption: polaroidCaption,
        host_note: hostNoteText,
        bloom_tips: tips,
        girl_favorites: favoritesRaw.filter(f => f.name),
        reviews: reviews.filter(r => r.author && r.text),
        hours,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError((e as Error).message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handlePhotoUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadPartnerPhoto(file, partner.id);
        await addPartnerPhoto(partner.id, url);
        setPhotoUrls(prev => [...prev, url]);
      }
    } catch (e) {
      setError((e as Error).message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handlePhotoDelete(url: string) {
    await removePartnerPhoto(partner.id, url);
    setPhotoUrls(prev => prev.filter(u => u !== url));
  }

  return (
    <div style={{ background: CREAM, minHeight: "100vh", paddingBottom: 100 }}>
      {/* ── Fixed header ─────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: CREAM, borderBottom: "1px solid #E8E0D4",
        padding: "calc(env(safe-area-inset-top,0px) + 10px) 16px 10px",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <p style={{ fontFamily: FONT_JOST, fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>PARTNER CMS</p>
              <h1 style={{ fontFamily: FONT_PLAY, fontSize: 18, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.1 }}>{partner.name}</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: saved ? "#2C8A3A" : PINK, color: "white",
                border: "none", borderRadius: 999, padding: "9px 22px",
                fontFamily: FONT_JOST, fontSize: "9px", fontWeight: 800,
                letterSpacing: "0.14em", cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1, transition: "all 0.2s",
              }}
            >
              {saving ? "SAVING…" : saved ? "✓ SAVED" : "SAVE"}
            </button>
          </div>

          {/* Tab strip */}
          <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                border: "none", borderRadius: 999, padding: "6px 14px",
                background: tab === t.id ? PINK : "rgba(0,0,0,0.06)",
                color: tab === t.id ? "white" : "#8A7A6A",
                fontFamily: FONT_JOST, fontSize: "8px", fontWeight: 800,
                letterSpacing: "0.1em", cursor: "pointer", whiteSpace: "nowrap",
                flexShrink: 0,
              }}>
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "calc(env(safe-area-inset-top,0px) + 120px) 16px 0" }}>
        {error && (
          <div style={{ background: "#FFE8EC", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
            <p style={{ fontFamily: FONT_JOST, fontSize: "11px", color: "#C01040" }}>{error}</p>
          </div>
        )}

        {/* ── BASICS ─────────────────────────────────────────────────────── */}
        {tab === "basics" && (
          <div>
            <Section title="IDENTITY">
              <div style={{ marginBottom: 14 }}><Label>VENUE NAME</Label><TextInput value={name} onChange={setName} placeholder="e.g. Bar Pisellino"/></div>
              <div style={{ marginBottom: 14 }}><Label>TAGLINE</Label><TextInput value={tagline} onChange={setTagline} placeholder="Short, catchy one-liner"/></div>
              <div style={{ marginBottom: 14 }}>
                <Label>TYPE</Label>
                <select value={restaurantType} onChange={e => setRestaurantType(e.target.value)} style={{
                  width: "100%", background: "#FDFBF7", border: "1.5px solid #E8E0D4", borderRadius: 8,
                  padding: "10px 12px", fontFamily: FONT_JOST, fontSize: "11px", color: DARK, outline: "none",
                }}>
                  {["fine_dining","café","bar","bakery","casual"].map(t => (
                    <option key={t} value={t}>{t.replace("_"," ")}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}><Label>ABOUT</Label><TextInput value={about} onChange={setAbout} multiline rows={4} placeholder="What makes this place special?"/></div>
            </Section>

            <Section title="LOCATION &amp; HOURS">
              <div style={{ marginBottom: 14 }}><Label>NEIGHBORHOOD</Label><TextInput value={neighborhood} onChange={setNeighborhood} placeholder="e.g. West Village"/></div>
              <div style={{ marginBottom: 14 }}><Label>ADDRESS</Label><TextInput value={address} onChange={setAddress} placeholder="Street address"/></div>
              <div style={{ marginBottom: 14 }}><Label>HOURS (e.g. Daily, 6PM–12AM)</Label><TextInput value={hours["general"] ?? ""} onChange={v => setHours({ general: v })} placeholder="Daily, 8AM – midnight"/></div>
              <div style={{ marginBottom: 14 }}><Label>INSTAGRAM</Label><TextInput value={instagram} onChange={setInstagram} placeholder="@handle"/></div>
            </Section>

            <Section title="BRAND">
              <div style={{ marginBottom: 14 }}>
                <Label>PRICE RANGE</Label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["$","$$","$$$","$$$$"].map(p => (
                    <button key={p} onClick={() => setPriceRange(p)} style={{
                      border: `1.5px solid ${priceRange === p ? PINK : "#E8E0D4"}`,
                      background: priceRange === p ? `${PINK}18` : "white",
                      borderRadius: 8, padding: "7px 16px",
                      fontFamily: FONT_JOST, fontSize: "11px", fontWeight: 700,
                      color: priceRange === p ? PINK : "#8A7A6A", cursor: "pointer",
                    }}>{p}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <Label>BRAND COLOR</Label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)} style={{ width: 40, height: 40, border: "none", padding: 0, cursor: "pointer", borderRadius: 8 }}/>
                  <TextInput value={brandColor} onChange={setBrandColor} placeholder="#FF1F7D"/>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* ── CONTENT ────────────────────────────────────────────────────── */}
        {tab === "content" && (
          <div>
            <Section title="EDITORIAL">
              <div style={{ marginBottom: 14 }}><Label>POEM / HERO CAPTION</Label><TextInput value={poem} onChange={setPoem} multiline rows={3} placeholder="A poetic one-liner about the vibe…"/></div>
              <div style={{ marginBottom: 14 }}><Label>POLAROID CAPTION</Label><TextInput value={polaroidCaption} onChange={setPolaroid} placeholder="sunlight + good coffee + therapy"/></div>
              <div style={{ marginBottom: 14 }}><Label>HOST NOTE (your personal recommendation)</Label><TextInput value={hostNoteText} onChange={setHostNoteText} multiline rows={3} placeholder="Order the ___ and trust me…"/></div>
            </Section>

            <Section title="BLOOM TIPS">
              <div style={{ marginBottom: 14 }}>
                <Label>ONE TIP PER LINE (shown on pink sticky notes)</Label>
                <TextInput value={tipsRaw} onChange={setTipsRaw} multiline rows={4} placeholder={"Go before 7pm. The bar seats are everything.\nCash tips — they remember you."}/>
              </div>
            </Section>

            <Section title="GIRL FAVORITES">
              {favoritesRaw.map((f, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                  <div>
                    <Label>ITEM {i + 1}</Label>
                    <TextInput value={f.name} onChange={v => setFavoritesRaw(prev => prev.map((x, j) => j === i ? { ...x, name: v } : x))} placeholder="Item name"/>
                  </div>
                  <div>
                    <Label>NOTE</Label>
                    <TextInput value={f.description} onChange={v => setFavoritesRaw(prev => prev.map((x, j) => j === i ? { ...x, description: v } : x))} placeholder="the classic"/>
                  </div>
                </div>
              ))}
              <button onClick={() => setFavoritesRaw(prev => [...prev, { name: "", description: "" }])} style={{
                background: "none", border: `1.5px dashed ${PINK}`, borderRadius: 8, padding: "8px 0",
                width: "100%", fontFamily: FONT_JOST, fontSize: "9px", fontWeight: 800,
                color: PINK, letterSpacing: "0.12em", cursor: "pointer",
              }}>
                + ADD FAVORITE
              </button>
            </Section>
          </div>
        )}

        {/* ── PHOTOS ─────────────────────────────────────────────────────── */}
        {tab === "photos" && (
          <div>
            <Section title="GALLERY PHOTOS">
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handlePhotoUpload(e.target.files)}/>
              <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
                width: "100%", height: 90, border: `2px dashed ${PINK}`, borderRadius: 14,
                background: "rgba(255,31,125,0.04)", marginBottom: 16,
                fontFamily: FONT_JOST, fontSize: "10px", fontWeight: 800,
                color: PINK, letterSpacing: "0.14em", cursor: uploading ? "not-allowed" : "pointer",
              }}>
                {uploading ? "UPLOADING…" : "+ UPLOAD PHOTOS"}
              </button>
              {photoUrls.length === 0 ? (
                <p style={{ fontFamily: FONT_JOST, fontSize: "11px", color: "#B0A090", textAlign: "center" }}>No photos yet — add some above</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {photoUrls.map((url, i) => (
                    <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden", aspectRatio: "1" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                      <button onClick={() => handlePhotoDelete(url)} style={{
                        position: "absolute", top: 4, right: 4,
                        width: 22, height: 22, borderRadius: "50%",
                        background: "rgba(0,0,0,0.65)", border: "none",
                        color: "white", fontSize: 12, lineHeight: "22px", textAlign: "center",
                        cursor: "pointer",
                      }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>
        )}

        {/* ── MENU ───────────────────────────────────────────────────────── */}
        {tab === "menu" && (
          <div>
            <Section title="MENU HIGHLIGHTS">
              <p style={{ fontFamily: FONT_JOST, fontSize: "10px", color: "#9A8A7A", marginBottom: 16 }}>These appear in the &quot;From the Menu&quot; card on your storefront.</p>
              {menuItems.map((m, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr auto", gap: 8, alignItems: "end", marginBottom: 10 }}>
                  <div><Label>ITEM</Label><TextInput value={m.item} onChange={v => setMenuItems(prev => prev.map((x, j) => j === i ? { ...x, item: v } : x))} placeholder="Dish name"/></div>
                  <div><Label>PRICE</Label><TextInput value={m.price} onChange={v => setMenuItems(prev => prev.map((x, j) => j === i ? { ...x, price: v } : x))} placeholder="$18"/></div>
                  <div><Label>NOTE</Label><TextInput value={m.note} onChange={v => setMenuItems(prev => prev.map((x, j) => j === i ? { ...x, note: v } : x))} placeholder="optional"/></div>
                  <button onClick={() => setMenuItems(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", fontSize: 18, color: "#C08080", cursor: "pointer", paddingBottom: 2 }}>×</button>
                </div>
              ))}
              <button onClick={() => setMenuItems(prev => [...prev, { item: "", price: "", note: "" }])} style={{
                background: "none", border: `1.5px dashed ${PINK}`, borderRadius: 8, padding: "8px 0",
                width: "100%", fontFamily: FONT_JOST, fontSize: "9px", fontWeight: 800,
                color: PINK, letterSpacing: "0.12em", cursor: "pointer", marginTop: 4,
              }}>
                + ADD ITEM
              </button>
            </Section>
          </div>
        )}

        {/* ── REVIEWS ────────────────────────────────────────────────────── */}
        {tab === "reviews" && (
          <div>
            <Section title="BLOOM REVIEWS">
              <p style={{ fontFamily: FONT_JOST, fontSize: "10px", color: "#9A8A7A", marginBottom: 16 }}>Curated reviews shown on your storefront.</p>
              {reviews.map((r, i) => (
                <div key={i} style={{ background: "white", borderRadius: 12, padding: "14px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <div><Label>NAME</Label><TextInput value={r.author} onChange={v => setReviews(prev => prev.map((x, j) => j === i ? { ...x, author: v } : x))} placeholder="Sara"/></div>
                    <div>
                      <Label>RATING</Label>
                      <div style={{ display: "flex", gap: 4, paddingTop: 2 }}>
                        {[1,2,3,4,5].map(n => (
                          <button key={n} onClick={() => setReviews(prev => prev.map((x, j) => j === i ? { ...x, rating: n } : x))} style={{
                            background: "none", border: "none", fontSize: 18,
                            color: n <= r.rating ? "#E8C020" : "#D8D0C8", cursor: "pointer", padding: 0,
                          }}>★</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Label>REVIEW TEXT</Label>
                  <TextInput value={r.text} onChange={v => setReviews(prev => prev.map((x, j) => j === i ? { ...x, text: v } : x))} multiline rows={2} placeholder="My go-to write, read, overthink spot…"/>
                  <button onClick={() => setReviews(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", fontFamily: FONT_JOST, fontSize: "8px", color: "#C08080", cursor: "pointer", marginTop: 8, letterSpacing: "0.12em" }}>
                    REMOVE REVIEW
                  </button>
                </div>
              ))}
              <button onClick={() => setReviews(prev => [...prev, { author: "", text: "", rating: 5 }])} style={{
                background: "none", border: `1.5px dashed ${PINK}`, borderRadius: 8, padding: "8px 0",
                width: "100%", fontFamily: FONT_JOST, fontSize: "9px", fontWeight: 800,
                color: PINK, letterSpacing: "0.12em", cursor: "pointer",
              }}>
                + ADD REVIEW
              </button>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
