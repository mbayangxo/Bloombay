/** Supabase Storage bucket names — public vs private separation. */

export const PUBLIC_BUCKETS = [
  "avatars",
  "club-covers",
  "event-covers",
  "city-assets",
  "brand-assets",
] as const;

export const PRIVATE_BUCKETS = [
  "government-ids",
  "verification-selfies",
  "girlmate-private",
  "moderation-evidence",
  "reports",
] as const;

export type PublicBucket = (typeof PUBLIC_BUCKETS)[number];
export type PrivateBucket = (typeof PRIVATE_BUCKETS)[number];
export type StorageBucket = PublicBucket | PrivateBucket;

/** Legacy buckets still referenced in older UI paths — do not use for new uploads. */
export const LEGACY_BUCKETS = [
  "verification",
  "girlmate-media",
  "event-media",
  "avenue-media",
  "profile-photos",
  "club-media",
  "hanger",
  "media",
  "member-memories",
] as const;

export type UploadPurpose =
  | "avatar"
  | "profile_photo"
  | "government_id"
  | "verification_selfie"
  | "girlmate_listing"
  | "girlmate_voice"
  | "girlmate_video"
  | "girlmate_cover"
  | "event_cover"
  | "event_audio"
  | "club_cover"
  | "club_photo"
  | "partner_photo"
  | "hanger_image"
  | "avenue_media"
  | "report_evidence"
  | "moderation_evidence"
  | "city_asset"
  | "brand_asset";

export const PURPOSE_TO_BUCKET: Record<UploadPurpose, StorageBucket> = {
  avatar:               "avatars",
  profile_photo:        "avatars",
  government_id:        "government-ids",
  verification_selfie:  "verification-selfies",
  girlmate_listing:     "girlmate-private",
  girlmate_voice:       "girlmate-private",
  girlmate_video:       "girlmate-private",
  girlmate_cover:       "city-assets",
  event_cover:          "event-covers",
  event_audio:          "event-covers",
  club_cover:           "club-covers",
  club_photo:           "club-covers",
  partner_photo:        "city-assets",
  hanger_image:         "brand-assets",
  avenue_media:         "brand-assets",
  report_evidence:      "reports",
  moderation_evidence:  "moderation-evidence",
  city_asset:           "city-assets",
  brand_asset:          "brand-assets",
};

export function bucketForPurpose(purpose: UploadPurpose): StorageBucket {
  return PURPOSE_TO_BUCKET[purpose];
}

export function isPublicBucket(bucket: string): bucket is PublicBucket {
  return (PUBLIC_BUCKETS as readonly string[]).includes(bucket);
}

export function isPrivateBucket(bucket: string): bucket is PrivateBucket {
  return (PRIVATE_BUCKETS as readonly string[]).includes(bucket);
}

/** Map legacy verification bucket paths to the new private bucket. */
export const LEGACY_VERIFICATION_BUCKET = "verification";
export const VERIFICATION_BUCKET = "verification-selfies" as const;
export const GOVERNMENT_ID_BUCKET = "government-ids" as const;

/** Default signed URL TTL for private staff access (seconds). */
export const PRIVATE_SIGNED_URL_TTL = 300;
