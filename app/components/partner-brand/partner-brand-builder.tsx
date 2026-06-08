"use client";

import { useState } from "react";
import Link from "next/link";
import { PartnerBrandView } from "./partner-brand-view";
import {
  PARTNER_BRAND_TEMPLATES,
  getBrandTemplate,
  templateLabel,
} from "@/lib/partner-brand/templates";
import { partnerMemberHref } from "@/lib/partner-brand/paths";
import {
  applyBrandTemplate,
  getActivePartnerBrand,
  savePartnerBrand,
} from "@/lib/partner-brand/store";
import type {
  PartnerAboutSlide,
  PartnerBrandProfile,
  PartnerBrandTemplateId,
  PartnerMenuItem,
  PartnerMenuSection,
} from "@/lib/partner-brand/types";

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function readFileAsDataUrl(file: File | undefined, onDone: (url: string) => void) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") onDone(reader.result);
  };
  reader.readAsDataURL(file);
}

export function PartnerBrandBuilder() {
  const [brand, setBrand] = useState<PartnerBrandProfile>(() => getActivePartnerBrand());
  const [preview, setPreview] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function update(patch: Partial<PartnerBrandProfile>) {
    setBrand((b) => ({ ...b, ...patch }));
    setMsg(null);
  }

  function pickTemplate(templateId: PartnerBrandTemplateId) {
    setBrand((b) => applyBrandTemplate({ ...b, templateId }, templateId));
  }

  function save(published?: boolean) {
    const saved = savePartnerBrand({
      ...brand,
      published: published ?? brand.published,
    });
    setBrand(saved);
    setMsg(published ? "Published — members can see your page." : "Saved.");
  }

  function addSlide() {
    update({
      aboutSlides: [
        ...brand.aboutSlides,
        { id: uid("pas"), headline: "New slide", body: "Tell your story…" },
      ],
    });
  }

  function updateSlide(id: string, patch: Partial<PartnerAboutSlide>) {
    update({
      aboutSlides: brand.aboutSlides.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  }

  function removeSlide(id: string) {
    update({ aboutSlides: brand.aboutSlides.filter((s) => s.id !== id) });
  }

  function addMenuSection() {
    update({
      menuSections: [
        ...brand.menuSections,
        { id: uid("pms"), title: "New section", items: [] },
      ],
    });
  }

  function addMenuItem(sectionId: string) {
    const item: PartnerMenuItem = {
      id: uid("pmi"),
      name: "New item",
      description: "Description",
      price: "$0",
    };
    update({
      menuSections: brand.menuSections.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, item] } : s
      ),
    });
  }

  function updateMenuItem(sectionId: string, itemId: string, patch: Partial<PartnerMenuItem>) {
    update({
      menuSections: brand.menuSections.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) }
          : s
      ),
    });
  }

  function updateSection(sectionId: string, patch: Partial<PartnerMenuSection>) {
    update({
      menuSections: brand.menuSections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)),
    });
  }

  if (preview) {
    return (
      <div>
        <button type="button" className="pp-btn" style={{ marginBottom: "1rem" }} onClick={() => setPreview(false)}>
          ← Back to editor
        </button>
        <PartnerBrandView brand={brand} backHref="/partner/brand" />
      </div>
    );
  }

  const tpl = getBrandTemplate(brand.templateId);

  return (
    <div className="pb-builder">
      <p className="pb-builder__proto" role="status">
        Prototype — brand and menu save on this device until partner sync is live.
      </p>
      {msg ? <p className="pb-builder__msg">{msg}</p> : null}

      <section className="pp-card pb-builder__section">
        <h2>Template</h2>
        <p className="pb-builder__hint">Pick a layout — then customize colors and photos.</p>
        <div className="pb-builder__templates">
          {PARTNER_BRAND_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={
                brand.templateId === t.id ? "pb-builder__tpl pb-builder__tpl--on" : "pb-builder__tpl"
              }
              style={
                {
                  "--tpl-accent": t.defaultColors.accent,
                  "--tpl-soft": t.defaultColors.accentSoft,
                } as React.CSSProperties
              }
              onClick={() => pickTemplate(t.id)}
            >
              <span className="pb-builder__tpl-emoji">{t.emoji}</span>
              <strong>{t.name}</strong>
              <span>{t.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="pp-card pb-builder__section">
        <h2>Brand colors</h2>
        <div className="pb-builder__colors">
          {(
            [
              ["accent", "Accent"],
              ["accentSoft", "Soft accent"],
              ["background", "Background"],
              ["text", "Text"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="pb-builder__color">
              <span>{label}</span>
              <input
                type="color"
                value={brand.colors[key]}
                onChange={(e) =>
                  update({ colors: { ...brand.colors, [key]: e.target.value } })
                }
              />
            </label>
          ))}
        </div>
      </section>

      <section className="pp-card pb-builder__section">
        <h2>Photos</h2>
        <label className="pb-builder__field">
          Hero image
          <input type="file" accept="image/*" onChange={(e) => readFileAsDataUrl(e.target.files?.[0], (url) => update({ heroImageUrl: url }))} />
        </label>
        <label className="pb-builder__field">
          Logo (optional)
          <input type="file" accept="image/*" onChange={(e) => readFileAsDataUrl(e.target.files?.[0], (url) => update({ logoImageUrl: url }))} />
        </label>
        <label className="pb-builder__field">
          Business name
          <input
            className="pp-input"
            value={brand.name}
            onChange={(e) => update({ name: e.target.value })}
          />
        </label>
        <label className="pb-builder__field">
          Tagline
          <input
            className="pp-input"
            value={brand.tagline}
            onChange={(e) => update({ tagline: e.target.value })}
          />
        </label>
        <label className="pb-builder__field">
          Hero caption (Eats card & social)
          <textarea
            className="pp-input"
            rows={2}
            value={brand.heroCaption ?? ""}
            onChange={(e) => update({ heroCaption: e.target.value })}
            placeholder="Women-rated corner booth · Saturday seats"
          />
        </label>
        <label className="pb-builder__field">
          Neighborhood
          <input
            className="pp-input"
            value={brand.neighborhood}
            onChange={(e) => update({ neighborhood: e.target.value })}
          />
        </label>
      </section>

      <section className="pp-card pb-builder__section">
        <div className="pb-builder__head">
          <h2>About us slides</h2>
          <button type="button" className="pp-btn pp-btn--sm" onClick={addSlide}>
            + Slide
          </button>
        </div>
        {brand.aboutSlides.map((s, i) => (
          <div key={s.id} className="pb-builder__block">
            <span className="pb-builder__block-label">Slide {i + 1}</span>
            <input
              className="pp-input"
              value={s.headline}
              onChange={(e) => updateSlide(s.id, { headline: e.target.value })}
              placeholder="Headline"
            />
            <textarea
              className="pp-input"
              rows={3}
              value={s.body}
              onChange={(e) => updateSlide(s.id, { body: e.target.value })}
              placeholder="Story"
            />
            <input
              className="pp-input"
              value={s.caption ?? ""}
              onChange={(e) => updateSlide(s.id, { caption: e.target.value })}
              placeholder="Short caption for this slide"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                readFileAsDataUrl(e.target.files?.[0], (url) => updateSlide(s.id, { imageUrl: url }))
              }
            />
            <button type="button" className="pp-btn pp-btn--ghost" onClick={() => removeSlide(s.id)}>
              Remove slide
            </button>
          </div>
        ))}
      </section>

      <section className="pp-card pb-builder__section">
        <div className="pb-builder__head">
          <h2>Menu · {templateLabel(brand.templateId)}</h2>
          <button type="button" className="pp-btn pp-btn--sm" onClick={addMenuSection}>
            + Section
          </button>
        </div>
        {brand.menuSections.map((sec) => (
          <div key={sec.id} className="pb-builder__block">
            <input
              className="pp-input"
              value={sec.title}
              onChange={(e) => updateSection(sec.id, { title: e.target.value })}
              placeholder="Section title"
            />
            {sec.items.map((item) => (
              <div key={item.id} className="pb-builder__menu-item">
                <input
                  className="pp-input"
                  value={item.name}
                  onChange={(e) => updateMenuItem(sec.id, item.id, { name: e.target.value })}
                  placeholder="Item name"
                />
                <input
                  className="pp-input"
                  value={item.price ?? ""}
                  onChange={(e) => updateMenuItem(sec.id, item.id, { price: e.target.value })}
                  placeholder="Price"
                />
                <textarea
                  className="pp-input"
                  rows={2}
                  value={item.description}
                  onChange={(e) => updateMenuItem(sec.id, item.id, { description: e.target.value })}
                />
                <input
                  className="pp-input"
                  value={item.caption ?? ""}
                  onChange={(e) => updateMenuItem(sec.id, item.id, { caption: e.target.value })}
                  placeholder="Caption — what members see on Eats"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    readFileAsDataUrl(e.target.files?.[0], (url) =>
                      updateMenuItem(sec.id, item.id, { imageUrl: url })
                    )
                  }
                />
              </div>
            ))}
            <button type="button" className="pp-btn pp-btn--sm" onClick={() => addMenuItem(sec.id)}>
              + Item
            </button>
          </div>
        ))}
        {!brand.menuSections.length ? (
          <button type="button" className="pp-btn" onClick={() => pickTemplate(brand.templateId)}>
            Load {tpl.name} starter menu
          </button>
        ) : null}
      </section>

      <div className="pb-builder__actions">
        <button type="button" className="pp-btn" onClick={() => save()}>
          Save draft
        </button>
        <button type="button" className="pp-btn pp-btn--primary" onClick={() => save(true)}>
          Publish
        </button>
        <button type="button" className="pp-btn" onClick={() => setPreview(true)}>
          Preview
        </button>
        {brand.published ? (
          <Link href={partnerMemberHref(brand.slug)} className="pp-btn" target="_blank" rel="noopener noreferrer">
            View live page →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
