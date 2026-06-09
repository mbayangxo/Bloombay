"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MediaUpload } from "./media-upload";
import { ClubLogoPreview } from "./club-logo-preview";
import { ClubCrestPreview } from "./club-crest-preview";
import { CLUB_COVER_TEMPLATES } from "@/lib/clubs/cover-templates";
import { CLUB_AESTHETICS, getAesthetic } from "@/lib/clubs/aesthetic-presets";
import { CLUB_LAYOUTS, type ClubLayoutId } from "@/lib/clubs/layout-templates";
import { CLUB_LOGO_TEMPLATES, type ClubLogoTemplateId } from "@/lib/clubs/logo-templates";
import { ClubLayoutPreview } from "./club-layout-hero";
import { slugifyClubName } from "@/lib/clubs/slug";
import { MEDIA_BUCKETS } from "@/lib/media/buckets";
import {
  CREST_ACCENTS,
  defaultCrestForCategory,
  saveClubCrestConfig,
  type CrestAccentId,
  type CrestSymbolId,
} from "@/lib/crest-system";
import "@/app/styles/bb-club-studio.css";

const CATEGORIES = [
  "Dining & Food",
  "Arts & Culture",
  "Books & Ideas",
  "Wellness & Movement",
  "Social & Lifestyle",
  "Travel & Adventure",
  "Career & Growth",
];

const STEPS = [
  "About your club",
  "Club logo",
  "Club cover",
  "Page design",
  "Club crest",
  "Launch club",
] as const;

export function CreateClubStudio() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverSource, setCoverSource] = useState<"upload" | "template" | null>(null);
  const [aestheticId, setAestheticId] = useState("bloombay-rose");
  const [layoutId, setLayoutId] = useState<ClubLayoutId>("salon");
  const [primaryColor, setPrimaryColor] = useState("#FF1F7D");
  const [accentColor, setAccentColor] = useState("#FF69B4");

  const [logoMode, setLogoMode] = useState<"upload" | "template">("template");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoTemplateId, setLogoTemplateId] = useState<ClubLogoTemplateId>("seal");
  const [logoText, setLogoText] = useState("");

  const [crestMode, setCrestMode] = useState<"generate" | "upload">("generate");
  const [crestImageUrl, setCrestImageUrl] = useState<string | null>(null);
  const [crestGenerated, setCrestGenerated] = useState(false);
  const [symbolId, setSymbolId] = useState<CrestSymbolId>("flower");
  const [accentId, setAccentId] = useState<CrestAccentId>("rose");
  const [crestLine, setCrestLine] = useState("");

  const slug = useMemo(() => slugifyClubName(name || "my-club"), [name]);
  const aesthetic = getAesthetic(aestheticId);
  const layoutLabel = CLUB_LAYOUTS.find((l) => l.id === layoutId)?.label ?? "Salon";
  const displayLogoText = logoText.trim() || name.trim() || "Your Club";
  const crestDisplayName = crestLine.trim() || name.trim() || "Your Club";

  useEffect(() => {
    setPrimaryColor(aesthetic.primaryColor);
    setAccentColor(aesthetic.accentColor);
  }, [aesthetic.primaryColor, aesthetic.accentColor]);

  useEffect(() => {
    if (!logoText && name) setLogoText(name);
  }, [name, logoText]);

  function generateCrest() {
    const crest = defaultCrestForCategory(category);
    setSymbolId(crest.symbolId);
    setAccentId(crest.accentId);
    setCrestGenerated(true);
  }

  function hasLogo(): boolean {
    return logoMode === "upload" ? Boolean(logoUrl) : displayLogoText.trim().length >= 2;
  }

  function hasCrest(): boolean {
    return crestMode === "upload" ? Boolean(crestImageUrl) : crestGenerated;
  }

  function canNext(): boolean {
    if (step === 0) return name.trim().length >= 3 && tagline.trim().length >= 8;
    if (step === 1) return hasLogo();
    if (step === 2) return Boolean(coverUrl);
    if (step === 3) return Boolean(layoutId);
    if (step === 4) return hasCrest();
    return true;
  }

  async function launch() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/club-owner/branding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim() || tagline.trim(),
        welcomeLine: crestLine.trim() || tagline.trim(),
        coverUrl,
        bannerUrl: coverUrl,
        logoUrl: logoMode === "upload" ? logoUrl : null,
        logoTemplate: logoMode === "template" ? logoTemplateId : null,
        logoText: logoMode === "template" ? displayLogoText : null,
        crestImageUrl: crestMode === "upload" ? crestImageUrl : null,
        primaryColor,
        accentColor,
        crestSymbol: crestMode === "generate" ? symbolId : null,
        crestAccent: crestMode === "generate" ? accentId : null,
        aestheticKey: aestheticId,
        layoutKey: layoutId,
        category,
        membershipType: "curated",
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Could not save club. Sign in and run migrations 013 + 017 + 019.");
      return;
    }
    if (crestMode === "generate") {
      saveClubCrestConfig(slug, { symbolId, accentId });
    }
    router.push(`/member/clubs/${slug}`);
  }

  const stepContent = () => {
    if (step === 0) {
      return (
        <>
          <h2 className="bb-club-studio__panel-title">About your club</h2>
          <p className="bb-club-studio__panel-hint">
            A club is your community on BloomBay — not a single event. Happenings come later.
          </p>
          <div className="bb-club-studio__field">
            <span className="bb-club-studio__label">Club name</span>
            <input
              className="bb-club-studio__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunday Supper Society"
            />
            <span className="bb-club-studio__slug">bloombay.app/clubs/{slug}</span>
          </div>
          <div className="bb-club-studio__field">
            <span className="bb-club-studio__label">Tagline</span>
            <input
              className="bb-club-studio__input"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="One line — what is this club about?"
            />
          </div>
          <div className="bb-club-studio__field">
            <span className="bb-club-studio__label">Category</span>
            <div className="bb-club-studio__chips">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`bb-club-studio__chip${category === c ? " bb-club-studio__chip--on" : ""}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="bb-club-studio__field">
            <span className="bb-club-studio__label">Club story (optional)</span>
            <textarea
              className="bb-club-studio__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Who belongs here? What does your club do together?"
            />
          </div>
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <h2 className="bb-club-studio__panel-title">Your club logo</h2>
          <p className="bb-club-studio__panel-hint">
            This is your club&apos;s visual identity — upload your own mark or build one from a text template.
          </p>

          <div className="bb-club-studio__mode-tabs">
            <button
              type="button"
              className={`bb-club-studio__mode-tab${logoMode === "upload" ? " bb-club-studio__mode-tab--on" : ""}`}
              onClick={() => setLogoMode("upload")}
            >
              Upload logo
            </button>
            <button
              type="button"
              className={`bb-club-studio__mode-tab${logoMode === "template" ? " bb-club-studio__mode-tab--on" : ""}`}
              onClick={() => setLogoMode("template")}
            >
              Text template
            </button>
          </div>

          {logoMode === "upload" ? (
            <div className="bb-club-studio__field">
              <MediaUpload
                bucket={MEDIA_BUCKETS.clubMedia}
                storagePath={`${slug}/logo`}
                currentUrl={logoUrl}
                label="Upload your club logo"
                aspect="avatar"
                onUploaded={setLogoUrl}
              />
              <p className="bb-club-studio__field-note">PNG or JPG with a transparent background works best.</p>
            </div>
          ) : (
            <>
              <div className="bb-club-studio__field">
                <span className="bb-club-studio__label">Pick a template</span>
                <div className="bb-club-studio__template-grid">
                  {CLUB_LOGO_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`bb-club-studio__template-card${logoTemplateId === t.id ? " bb-club-studio__template-card--on" : ""}`}
                      onClick={() => setLogoTemplateId(t.id)}
                    >
                      <ClubLogoPreview
                        mode="template"
                        templateId={t.id}
                        logoText={displayLogoText}
                        logoUrl={null}
                        primaryColor={primaryColor}
                        accentColor={accentColor}
                        size="sm"
                      />
                      <p className="bb-club-studio__template-name">{t.label}</p>
                      <p className="bb-club-studio__template-desc">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bb-club-studio__field">
                <span className="bb-club-studio__label">What should your logo say?</span>
                <input
                  className="bb-club-studio__input"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  placeholder={name || "Your club name"}
                />
              </div>
            </>
          )}

          <div className="bb-club-studio__logo-stage">
            <p className="bb-club-studio__label">Logo preview</p>
            <ClubLogoPreview
              mode={logoMode}
              templateId={logoTemplateId}
              logoText={displayLogoText}
              logoUrl={logoUrl}
              primaryColor={primaryColor}
              accentColor={accentColor}
              size="lg"
            />
          </div>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <h2 className="bb-club-studio__panel-title">Club cover</h2>
          <p className="bb-club-studio__panel-hint">The hero image on your club page — upload yours or pick a starter.</p>
          <MediaUpload
            bucket={MEDIA_BUCKETS.clubMedia}
            storagePath={`${slug}/cover`}
            currentUrl={coverUrl}
            label="Upload club cover"
            onUploaded={(url) => {
              setCoverUrl(url);
              setCoverSource("upload");
            }}
          />
          <p className="bb-club-studio__label" style={{ marginTop: "1.25rem" }}>
            Starter covers
          </p>
          <div className="bb-club-studio__grid-2" style={{ marginTop: "0.5rem" }}>
            {CLUB_COVER_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`bb-club-studio__pick-card${coverUrl === t.url && coverSource === "template" ? " bb-club-studio__pick-card--on" : ""}`}
                onClick={() => {
                  setCoverUrl(t.url);
                  setCoverSource("template");
                }}
              >
                <div className="h-24 bg-cover bg-center" style={{ backgroundImage: `url(${t.url})` }} />
                <p className="bb-club-studio__pick-label">{t.label}</p>
              </button>
            ))}
          </div>
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <h2 className="bb-club-studio__panel-title">Page design</h2>
          <p className="bb-club-studio__panel-hint">Choose how your club page is laid out and colored.</p>
          {CLUB_LAYOUTS.map((layout) => (
            <button
              key={layout.id}
              type="button"
              className={`bb-club-studio__layout-row${layoutId === layout.id ? " bb-club-studio__layout-row--on" : ""}`}
              onClick={() => setLayoutId(layout.id)}
            >
              <div className="bb-club-studio__layout-thumb">
                <ClubLayoutPreview
                  layout={layout.id}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  coverUrl={coverUrl}
                  name={name || "Your Club"}
                />
              </div>
              <div>
                <p className="bb-club-studio__layout-name">{layout.label}</p>
                <p className="bb-club-studio__layout-desc">{layout.description}</p>
              </div>
            </button>
          ))}

          <p className="bb-club-studio__label" style={{ marginTop: "1rem" }}>
            Color palette
          </p>
          <div className="bb-club-studio__chips" style={{ marginTop: "0.5rem" }}>
            {CLUB_AESTHETICS.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`bb-club-studio__chip${aestheticId === a.id ? " bb-club-studio__chip--on" : ""}`}
                onClick={() => {
                  setAestheticId(a.id);
                  setPrimaryColor(a.primaryColor);
                  setAccentColor(a.accentColor);
                }}
              >
                <span
                  className="bb-club-studio__chip-dot"
                  style={{ background: `linear-gradient(135deg, ${a.primaryColor}, ${a.accentColor})` }}
                />
                {a.label}
              </button>
            ))}
          </div>
        </>
      );
    }

    if (step === 4) {
      return (
        <>
          <h2 className="bb-club-studio__panel-title">Your club crest</h2>
          <p className="bb-club-studio__panel-hint">
            Your crest is separate from your logo — the official seal for your club. Generate one with BloomBay or
            upload your own.
          </p>

          <div className="bb-club-studio__mode-tabs">
            <button
              type="button"
              className={`bb-club-studio__mode-tab${crestMode === "generate" ? " bb-club-studio__mode-tab--on" : ""}`}
              onClick={() => setCrestMode("generate")}
            >
              BloomBay generator
            </button>
            <button
              type="button"
              className={`bb-club-studio__mode-tab${crestMode === "upload" ? " bb-club-studio__mode-tab--on" : ""}`}
              onClick={() => setCrestMode("upload")}
            >
              Upload crest
            </button>
          </div>

          {crestMode === "upload" ? (
            <div className="bb-club-studio__field">
              <MediaUpload
                bucket={MEDIA_BUCKETS.clubMedia}
                storagePath={`${slug}/crest`}
                currentUrl={crestImageUrl}
                label="Upload your club crest"
                aspect="avatar"
                onUploaded={setCrestImageUrl}
              />
              <p className="bb-club-studio__field-note">Square PNG recommended — this appears as your official club seal.</p>
            </div>
          ) : (
            <>
              <div className="bb-club-studio__field">
                <span className="bb-club-studio__label">Crest line (optional)</span>
                <input
                  className="bb-club-studio__input"
                  value={crestLine}
                  onChange={(e) => setCrestLine(e.target.value)}
                  placeholder={tagline || "Words on your crest ribbon"}
                />
              </div>

              <p className="bb-club-studio__label">Crest color</p>
              <div className="bb-club-studio__chips" style={{ marginTop: "0.5rem" }}>
                {CREST_ACCENTS.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    className="bb-club-studio__chip"
                    style={{
                      background: acc.hex,
                      color: acc.id === "ivory" ? "#111" : "#fff",
                      borderColor: acc.hex,
                      outline: accentId === acc.id ? `3px solid ${primaryColor}` : "none",
                    }}
                    onClick={() => {
                      setAccentId(acc.id);
                      if (crestGenerated) setCrestGenerated(true);
                    }}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>

              {!crestGenerated ? (
                <div className="bb-club-studio__crest-stage">
                  <div className="bb-club-studio__crest-placeholder">
                    <p>We&apos;ll craft your crest from your club category and colors.</p>
                    <button type="button" className="bb-club-studio__btn bb-club-studio__btn--primary" onClick={generateCrest}>
                      Generate club crest →
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}

          {(crestMode === "upload" && crestImageUrl) || (crestMode === "generate" && crestGenerated) ? (
            <div className="bb-club-studio__crest-stage">
              <p className="bb-club-studio__label" style={{ color: "rgba(255,255,255,0.7)" }}>
                Crest preview
              </p>
              <ClubCrestPreview
                mode={crestMode}
                crestImageUrl={crestImageUrl}
                clubName={crestDisplayName}
                symbolId={symbolId}
                accentId={accentId}
                size="lg"
              />
              {crestMode === "generate" ? (
                <button
                  type="button"
                  className="bb-club-studio__btn bb-club-studio__btn--ghost"
                  style={{ marginTop: "0.5rem", flex: "none", padding: "0.55rem 1rem", fontSize: "0.75rem" }}
                  onClick={generateCrest}
                >
                  Regenerate
                </button>
              ) : null}
            </div>
          ) : null}
        </>
      );
    }

    return (
      <>
        <h2 className="bb-club-studio__panel-title">Launch your club</h2>
        <p className="bb-club-studio__panel-hint">
          Review everything, then publish. Your club saves to Supabase and appears on the Clubs page.
        </p>
        <p className="bb-club-studio__launch-note">
          Create happenings separately after launch — those are events, not clubs.
        </p>
        <div className="bb-club-studio__preview-card">
          <ClubLayoutPreview
            layout={layoutId}
            primaryColor={primaryColor}
            accentColor={accentColor}
            coverUrl={coverUrl}
            name={name}
          />
          <div className="bb-club-studio__preview-meta">
            <ClubLogoPreview
              mode={logoMode}
              templateId={logoTemplateId}
              logoText={displayLogoText}
              logoUrl={logoUrl}
              primaryColor={primaryColor}
              accentColor={accentColor}
              size="sm"
            />
            <ClubCrestPreview
              mode={crestMode}
              crestImageUrl={crestImageUrl}
              clubName={crestDisplayName}
              symbolId={symbolId}
              accentId={accentId}
              size="sm"
            />
            <div>
              <p className="bb-club-studio__preview-name">{name}</p>
              <p className="bb-club-studio__preview-tag">{tagline}</p>
              <p className="bb-club-studio__preview-cat">
                {category} · {layoutLabel}
              </p>
            </div>
          </div>
        </div>
        {error ? <p className="bb-club-studio__error">{error}</p> : null}
      </>
    );
  };

  return (
    <div className="bb-club-studio" style={{ ["--club-primary" as string]: primaryColor }}>
      <header className="bb-club-studio__hero">
        <div className="bb-club-studio__hero-inner">
          <Link href="/member/clubs" className="bb-club-studio__back">
            ← Back to clubs
          </Link>
          <p className="bb-club-studio__eyebrow">Club studio</p>
          <h1 className="bb-club-studio__title">Create a club</h1>
          <p className="bb-club-studio__sub">
            Name your club, design your logo, choose your crest, and launch your page.
          </p>
        </div>
      </header>

      <div className="bb-club-studio__steps-wrap">
        <div className="bb-club-studio__steps" role="tablist" aria-label="Create club steps">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`bb-club-studio__step${i === step ? " bb-club-studio__step--active" : ""}${i < step ? " bb-club-studio__step--done" : ""}`}
            >
              <span className="bb-club-studio__step-num">{i + 1}</span>
              <span className="bb-club-studio__step-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bb-club-studio__body">
        <main className="bb-club-studio__panel">{stepContent()}</main>

        {step < STEPS.length - 1 ? (
          <aside className="bb-club-studio__preview-aside">
            <p className="bb-club-studio__aside-label">Live preview</p>
            <div className="bb-club-studio__preview-card">
              <ClubLayoutPreview
                layout={layoutId}
                primaryColor={primaryColor}
                accentColor={accentColor}
                coverUrl={coverUrl}
                name={name || "Your Club"}
              />
              <div className="bb-club-studio__preview-meta">
                {step >= 1 && hasLogo() ? (
                  <ClubLogoPreview
                    mode={logoMode}
                    templateId={logoTemplateId}
                    logoText={displayLogoText}
                    logoUrl={logoUrl}
                    primaryColor={primaryColor}
                    accentColor={accentColor}
                    size="sm"
                  />
                ) : null}
                {step >= 4 && hasCrest() ? (
                  <ClubCrestPreview
                    mode={crestMode}
                    crestImageUrl={crestImageUrl}
                    clubName={crestDisplayName}
                    symbolId={symbolId}
                    accentId={accentId}
                    size="sm"
                  />
                ) : null}
                <div>
                  <p className="bb-club-studio__preview-name">{name || "Your club name"}</p>
                  <p className="bb-club-studio__preview-tag">{tagline || "Your tagline"}</p>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
      </div>

      <footer className="bb-club-studio__footer">
        {step > 0 ? (
          <button type="button" className="bb-club-studio__btn bb-club-studio__btn--ghost" onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        ) : null}
        <button
          type="button"
          className="bb-club-studio__btn bb-club-studio__btn--primary"
          disabled={!canNext() || busy}
          onClick={() => {
            if (step < STEPS.length - 1) setStep((s) => s + 1);
            else void launch();
          }}
        >
          {busy ? "Launching club…" : step === STEPS.length - 1 ? "Launch club →" : "Next"}
        </button>
      </footer>
    </div>
  );
}
