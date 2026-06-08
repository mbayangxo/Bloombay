"use client";

import { useEffect, useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { MediaUpload } from "@/app/components/portal/media-upload";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubBranding, saveClubBranding, logAudit } from "@/lib/club-owner-store";
import { getClubProfile } from "@/lib/club-world-data";
import { MEMBER_UI_REFS } from "@/lib/member-ui-assets";
import { MEDIA_BUCKETS } from "@/lib/media/buckets";

const HERO_OPTIONS = [
  { label: "Run crew", url: MEMBER_UI_REFS.homeHero },
  { label: "Tonight", url: MEMBER_UI_REFS.tonight },
  { label: "Lounge", url: MEMBER_UI_REFS.lounge },
];

export default function ClubOwnerBrandingPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const initial = getClubBranding(clubId);
  const [heroImage, setHeroImage] = useState(initial.heroImage);
  const [tagline, setTagline] = useState(initial.tagline ?? club?.tagline ?? "");
  const [description, setDescription] = useState(initial.description ?? club?.description ?? "");
  const [welcomeLine, setWelcomeLine] = useState(initial.welcomeLine ?? club?.welcomeMessage ?? "");
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl ?? "");
  const [bannerUrl, setBannerUrl] = useState(initial.bannerUrl ?? "");
  const [coverUrl, setCoverUrl] = useState(initial.coverImage ?? initial.bannerUrl ?? "");
  const [primaryColor, setPrimaryColor] = useState(initial.primaryColor ?? "#ff0055");
  const [accentColor, setAccentColor] = useState(initial.accentColor ?? "#ffb7ce");
  const [instagram, setInstagram] = useState(initial.instagram ?? "");
  const [website, setWebsite] = useState(initial.website ?? "");
  const [tiktok, setTiktok] = useState(initial.tiktok ?? "");
  const [saved, setSaved] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/club-owner/branding?slug=${encodeURIComponent(clubId)}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.club) {
        setDbReady(true);
        if (json.club.cover_url) setCoverUrl(json.club.cover_url);
        if (json.club.banner_url) setBannerUrl(json.club.banner_url);
        if (json.club.logo_url) setLogoUrl(json.club.logo_url);
        if (json.club.tagline) setTagline(json.club.tagline);
        if (json.club.description) setDescription(json.club.description);
        if (json.club.welcome_line) setWelcomeLine(json.club.welcome_line);
      }
    })();
  }, [clubId]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const cover = coverUrl || heroImage;
    saveClubBranding(clubId, {
      heroImage: cover,
      tagline,
      description,
      welcomeLine,
      gallery: initial.gallery,
      logoUrl,
      bannerUrl: bannerUrl || cover,
      coverImage: cover,
      primaryColor,
      accentColor,
      instagram,
      website,
      tiktok,
    });
    logAudit(clubId, "Updated club branding");

    const res = await fetch("/api/club-owner/branding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: clubId,
        name: club?.name ?? clubId,
        coverUrl: cover,
        bannerUrl: bannerUrl || cover,
        logoUrl,
        tagline,
        description,
        welcomeLine,
        primaryColor,
        accentColor,
        instagram,
        website,
        tiktok,
      }),
    });

    setSaved(true);
    if (res.ok) setDbReady(true);
  }

  return (
    <ClubOwnerShell title="Branding" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Club branding kit"
        sub="Upload your club cover, logo, and story — saved to your club portal and member pages."
      />
      <p className="co-hint" style={{ marginBottom: "1rem" }}>
        <a href="/club-owner/crest" style={{ color: "var(--bb-hot)", fontWeight: 600 }}>
          Edit club crest →
        </a>
        {dbReady ? " · Synced to database" : " · Local preview (sign in + run migration 013 to sync)"}
      </p>
      <form onSubmit={save} className="co-form">
        <fieldset className="co-fieldset">
          <legend>Club cover (upload)</legend>
          <MediaUpload
            bucket={MEDIA_BUCKETS.clubMedia}
            storagePath={`${clubId}/cover`}
            currentUrl={coverUrl}
            label="Club cover photo"
            onUploaded={(url) => {
              setCoverUrl(url);
              setHeroImage(url);
              setBannerUrl(url);
            }}
          />
        </fieldset>
        <fieldset className="co-fieldset">
          <legend>Or pick a starter hero</legend>
          <div className="co-brand-hero-pick">
            {HERO_OPTIONS.map((opt) => (
              <button
                key={opt.url}
                type="button"
                className={`co-brand-hero-opt${heroImage === opt.url ? " co-brand-hero-opt--on" : ""}`}
                style={{ backgroundImage: `url(${opt.url})` }}
                onClick={() => {
                  setHeroImage(opt.url);
                  if (!coverUrl.startsWith("http")) setCoverUrl(opt.url);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="co-fieldset">
          <legend>Logo</legend>
          <MediaUpload
            bucket={MEDIA_BUCKETS.clubMedia}
            storagePath={`${clubId}/logo`}
            currentUrl={logoUrl}
            label="Club logo"
            aspect="avatar"
            onUploaded={setLogoUrl}
          />
        </fieldset>
        <label>
          Tagline
          <input className="co-input" value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </label>
        <label>
          About
          <textarea className="co-input co-input--area" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Welcome note (shown on landing)
          <textarea className="co-input co-input--area" rows={3} value={welcomeLine} onChange={(e) => setWelcomeLine(e.target.value)} />
        </label>
        <fieldset className="co-fieldset">
          <legend>Colors & social</legend>
          <label>
            Primary color
            <input className="co-input" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
          </label>
          <label>
            Accent color
            <input className="co-input" type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
          </label>
          <label>
            Instagram
            <input className="co-input" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@yourclub" />
          </label>
          <label>
            Website
            <input className="co-input" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
          <label>
            TikTok
            <input className="co-input" value={tiktok} onChange={(e) => setTiktok(e.target.value)} />
          </label>
        </fieldset>
        <button type="submit" className="co-btn co-btn--primary">
          Save branding
        </button>
        {saved ? <p className="co-success">Saved — members will see your cover on club pages and home.</p> : null}
      </form>
    </ClubOwnerShell>
  );
}
