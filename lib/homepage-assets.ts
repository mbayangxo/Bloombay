/** Homepage scrapbook PNGs — processed with real alpha (not baked black) */

export const HOME_ASSET_BASE = "/assets/homepage-processed";

function homeAsset(file: string) {
  return `${HOME_ASSET_BASE}/${file}`;
}

/** Standard polaroid photo window (% of frame) */
export const POLAROID_PHOTO = {
  left: 11.5,
  top: 11.5,
  width: 77,
  height: 63,
} as const;

export const HOMEPAGE_ASSETS = {
  heroPaper: homeAsset("ebace242-70ab-4c83-b40d-485a01cbb332.png"),
  heroPolaroid: homeAsset("6496faed-4397-415a-ab31-906e2e74e456.png"),
  heroPolaroidAlt: homeAsset("1acaaaa5-f252-443b-a89f-9ce301c75e36.png"),
  stickerStar: homeAsset("029131c9-6891-4053-a980-f8f436dba8ab.png"),

  featuredLabel: homeAsset("c4c93d7a-408f-4f2d-b125-ce81ac7c30c1.png"),
  clubCard: homeAsset("c806cd84-83e7-4147-b213-bec3ce92de10.png"),
  polaroidFeatured: [
    homeAsset("6d79fe52-aeb9-4f4c-ad10-b954c218834d.png"),
    homeAsset("d25a1545-f360-4978-93bb-9c19d97bacda.png"),
    homeAsset("868945df-0d9e-40f6-a76f-96a187ebc961.png"),
    homeAsset("e894643f-2a53-4abe-a8ef-19792a45cc5e.png"),
    homeAsset("e67ae5dd-286b-4e45-ba2e-080681d63958.png"),
  ],

  happeningsPaper: homeAsset("f65bb983-6fb7-4654-97a0-b6a247461c20.png"),
  connectPolaroid: homeAsset("a915f822-2b18-4acc-9c3f-07ba726d5f72.png"),
  newHerePaper: homeAsset("de2e2edb-a41c-4e4a-97f9-02c433df808c.png"),

  spotlightBoard: homeAsset("f1f6716b-4bf0-4b76-8bdb-5034439f59dc.png"),
  spotlightTriptych: homeAsset("5f82af10-ac61-49f3-aa6b-4392fbb2d387.png"),

  vibesStrip: homeAsset("59d1ae37-7cae-435e-a0d8-e30f08a5718d.png"),
  vibesStripAlt: homeAsset("24788905-c6cc-4051-930b-ba8ae24510a4.png"),

  nearYouCard: homeAsset("930f0aee-4d93-4733-b19d-b6937ee076f8.png"),
  nearYouPolaroid: homeAsset("22bf0d14-a676-4b45-a133-ee13d17845f8.png"),

  calendarStrip: homeAsset("d1a2b637-abc6-44f8-b8c5-74306cb59c5b.png"),
  pinkSticky: homeAsset("6a3a70ef-f85f-4c2b-920c-f0f9b7e7d286.png"),
  tapePink: homeAsset("5ffc4601-b3f5-41dd-9d8f-8fc660b3846d.png"),
  tapeCream: homeAsset("9f25a2c1-bfcc-4d6c-84d8-db85241b9187.png"),
  flower: homeAsset("fe40eab6-ebc5-474a-9170-b1893920e0b1.png"),
  nearYouTape: homeAsset("38417c11-72a8-4d3d-950a-b335cdfc2cb5.png"),
} as const;

export const HOME_VIBE_TAGS = [
  { label: "creative", href: "/member/clubs/discover" },
  { label: "wellness", href: "/member/clubs" },
  { label: "adventure", href: "/member/clubs" },
  { label: "career", href: "/member/clubs" },
  { label: "night out", href: "/member/happenings" },
  { label: "faith", href: "/member/clubs/discover" },
  { label: "fashion", href: "/member/clubs/discover" },
  { label: "foodie", href: "/member/clubs" },
] as const;

export const HOME_ONBOARDING_STEPS = [
  { n: 1, task: "join 3 clubs", href: "/member/clubs" },
  { n: 2, task: "save 5 places", href: "/member/explore" },
  { n: 3, task: "attend 1 gathering", href: "/member/happenings" },
  { n: 4, task: "open your apartment", href: "/member/lounge" },
] as const;

export const HOME_NEIGHBORHOODS = [
  { name: "SoHo", href: "/member/explore" },
  { name: "West Village", href: "/member/explore" },
  { name: "Williamsburg", href: "/member/explore" },
  { name: "Brooklyn Heights", href: "/member/explore" },
  { name: "Harlem", href: "/member/explore" },
] as const;
