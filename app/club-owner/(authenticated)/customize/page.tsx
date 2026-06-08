"use client";

import { useRef, useState } from "react";
import { BloomObjectIcon } from "@/app/components/bloom/bloom-object-icon";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { BLOOM_OBJECTS } from "@/lib/bloom-object-assets";
import { getHostClubId } from "@/lib/club-host-store";
import { logAudit } from "@/lib/club-owner-store";
import { getClubProfile } from "@/lib/club-world-data";
import {
  addCustomTemplate,
  getClubMamaKit,
  removeCustomTemplate,
  saveClubMamaKit,
} from "@/lib/club-mama-kit";
import {
  POSTER_TEMPLATE_TYPES,
  posterTemplateLabel,
  type PosterTemplateType,
} from "@/lib/poster-templates/types";

const BLOOM_PICKS = Object.entries(BLOOM_OBJECTS).map(([key, src]) => ({ key, src }));

export default function ClubMamaCustomizePage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const fileRef = useRef<HTMLInputElement>(null);
  const [kit, setKit] = useState(() => getClubMamaKit(clubId));
  const [uploadName, setUploadName] = useState("");
  const [saved, setSaved] = useState(false);

  function refresh() {
    setKit(getClubMamaKit(clubId));
  }

  function toggleBloom(key: string) {
    const next = kit.bloomObjectKeys.includes(key)
      ? kit.bloomObjectKeys.filter((k) => k !== key)
      : [...kit.bloomObjectKeys, key].slice(0, 6);
    saveClubMamaKit(clubId, { bloomObjectKeys: next });
    refresh();
    setSaved(false);
  }

  function setPosterTemplate(posterTemplate: PosterTemplateType) {
    saveClubMamaKit(clubId, { posterTemplate });
    refresh();
    setSaved(false);
  }

  function setAccent(key: string) {
    saveClubMamaKit(clubId, { accentObjectKey: key });
    refresh();
    setSaved(false);
  }

  function onUploadFile(file: File | undefined) {
    if (!file) return;
    const name = uploadName.trim() || file.name.replace(/\.[^.]+$/, "");
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = typeof reader.result === "string" ? reader.result : "";
      if (!imageUrl) return;
      addCustomTemplate(clubId, { name, imageUrl, posterType: kit.posterTemplate });
      setUploadName("");
      refresh();
      setSaved(false);
    };
    reader.readAsDataURL(file);
  }

  function saveKit() {
    logAudit(clubId, "Updated Club Mama visual kit");
    setSaved(true);
  }

  return (
    <ClubOwnerShell title="Club Mama kit" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name ?? "Your club"}
        title="Templates & BloomBay objects"
        sub="Upload custom poster templates, pick BloomBay objects for your landing, and choose a default event poster style."
      />
      <p className="co-hint" style={{ marginBottom: "1rem" }}>
        <a href="/club-owner/rules" style={{ color: "var(--bb-hot)", fontWeight: 600 }}>
          Edit club rules (members must accept) →
        </a>
      </p>

      <section className="co-kit-block">
        <h2 className="co-kit-block__title">Event poster template</h2>
        <p className="co-kit-block__sub">Used when you publish gatherings from Events studio.</p>
        <div className="co-kit-poster-grid">
          {POSTER_TEMPLATE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`co-kit-poster-opt${kit.posterTemplate === type ? " co-kit-poster-opt--on" : ""}`}
              onClick={() => setPosterTemplate(type)}
            >
              {posterTemplateLabel(type)}
            </button>
          ))}
        </div>
      </section>

      <section className="co-kit-block">
        <h2 className="co-kit-block__title">BloomBay objects on your landing</h2>
        <p className="co-kit-block__sub">Tap to show on the member club page (up to six).</p>
        <div className="co-kit-bloom-grid">
          {BLOOM_PICKS.map(({ key, src }) => (
            <button
              key={key}
              type="button"
              className={`co-kit-bloom-opt${kit.bloomObjectKeys.includes(key) ? " co-kit-bloom-opt--on" : ""}`}
              onClick={() => toggleBloom(key)}
              title={key}
            >
              <BloomObjectIcon src={src} size={40} />
              <span>{key}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="co-kit-block">
        <h2 className="co-kit-block__title">Accent object</h2>
        <p className="co-kit-block__sub">Hero accent beside your club name on join.</p>
        <div className="co-kit-bloom-grid co-kit-bloom-grid--compact">
          {BLOOM_PICKS.filter(({ key }) => kit.bloomObjectKeys.includes(key)).map(({ key, src }) => (
            <button
              key={key}
              type="button"
              className={`co-kit-bloom-opt${kit.accentObjectKey === key ? " co-kit-bloom-opt--on" : ""}`}
              onClick={() => setAccent(key)}
            >
              <BloomObjectIcon src={src} size={36} />
            </button>
          ))}
        </div>
        {!kit.bloomObjectKeys.length ? (
          <p className="co-hint">Select at least one object above first.</p>
        ) : null}
      </section>

      <section className="co-kit-block">
        <h2 className="co-kit-block__title">Custom templates (upload)</h2>
        <p className="co-kit-block__sub">PNG or JPG — stored locally for this prototype.</p>
        <div className="co-form" style={{ marginBottom: "0.75rem" }}>
          <input
            className="co-input"
            placeholder="Template name"
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value)}
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="co-input"
            onChange={(e) => onUploadFile(e.target.files?.[0])}
          />
        </div>
        {kit.customTemplates.length ? (
          <ul className="co-kit-upload-list">
            {kit.customTemplates.map((tpl) => (
              <li key={tpl.id} className="co-kit-upload-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tpl.imageUrl} alt="" className="co-kit-upload-item__thumb" />
                <div>
                  <strong>{tpl.name}</strong>
                  {tpl.posterType ? (
                    <p className="co-hint">{posterTemplateLabel(tpl.posterType)} style</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="co-btn co-btn--ghost"
                  onClick={() => {
                    removeCustomTemplate(clubId, tpl.id);
                    refresh();
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="co-hint">No uploads yet — add flyers, crest art, or invite backgrounds.</p>
        )}
      </section>

      <button type="button" className="co-btn co-btn--primary" onClick={saveKit}>
        Save kit
      </button>
      {saved ? <p className="co-success">Saved — members will see updates on landing & join.</p> : null}
    </ClubOwnerShell>
  );
}
