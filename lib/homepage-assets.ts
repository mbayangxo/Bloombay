/** Original homepage scrapbook PNGs — transparent cutouts from the mockup */

export const HOME_ASSET_BASE = "/homepageobjects";

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
  heroPaper: homeAsset("EBACE242-70AB-4C83-B40D-485A01CBB332.PNG"),
  heroPolaroid: homeAsset("6496FAED-4397-415A-AB31-906E2E74E456.PNG"),
  heroPolaroidAlt: homeAsset("1ACAAAA5-F252-443B-A89F-9CE301C75E36.PNG"),
  stickerStar: homeAsset("029131C9-6891-4053-A980-F8F436DBA8AB.PNG"),

  featuredLabel: homeAsset("C4C93D7A-408F-4F2D-B125-CE81AC7C30C1.PNG"),
  clubCard: homeAsset("C806CD84-83E7-4147-B213-BEC3CE92DE10.PNG"),
  polaroidFeatured: [
    homeAsset("6D79FE52-AEB9-4F4C-AD10-B954C218834D.PNG"),
    homeAsset("D25A1545-F360-4978-93BB-9C19D97BACDA.PNG"),
    homeAsset("868945DF-0D9E-40F6-A76F-96A187EBC961.PNG"),
    homeAsset("E894643F-2A53-4ABE-A8EF-19792A45CC5E.PNG"),
    homeAsset("E67AE5DD-286B-4E45-BA2E-080681D63958.PNG"),
  ],

  happeningsPaper: homeAsset("F65BB983-6FB7-4654-97A0-B6A247461C20.PNG"),
  connectPolaroid: homeAsset("A915F822-2B18-4ACC-9C3F-07BA726D5F72.PNG"),
  newHerePaper: homeAsset("DE2E2EDB-A41C-4E4A-97F9-02C433DF808C.PNG"),

  spotlightBoard: homeAsset("F1F6716B-4BF0-4B76-8BDB-5034439F59DC.PNG"),
  spotlightTriptych: homeAsset("5F82AF10-AC61-49F3-AA6B-4392FBB2D387.PNG"),

  vibesStrip: homeAsset("59D1AE37-7CAE-435E-A0D8-E30F08A5718D.PNG"),
  vibesStripAlt: homeAsset("24788905-C6CC-4051-930B-BA8AE24510A4.PNG"),

  nearYouCard: homeAsset("930F0AEE-4D93-4733-B19D-B6937EE076F8.PNG"),
  nearYouPolaroid: homeAsset("22BF0D14-A676-4B45-A133-EE13D17845F8.PNG"),

  calendarStrip: homeAsset("D1A2B637-ABC6-44F8-B8C5-74306CB59C5B.PNG"),
  pinkSticky: homeAsset("6A3A70EF-F85F-4C2B-920C-F0F9B7E7D286.PNG"),
  tapePink: homeAsset("5FFC4601-B3F5-41DD-9D8F-8FC660B3846D.PNG"),
  tapeCream: homeAsset("9F25A2C1-BFCC-4D6C-84D8-DB85241B9187.PNG"),
  flower: homeAsset("FE40EAB6-EBC5-474A-9170-B1893920E0B1.PNG"),
  nearYouTape: homeAsset("38417C11-72A8-4D3D-950A-B335CDFC2CB5.PNG"),
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
