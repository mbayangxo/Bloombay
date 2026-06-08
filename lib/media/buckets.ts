export const MEDIA_BUCKETS = {
  avatars: "avatars",
  clubMedia: "club-media",
  memberMemories: "member-memories",
  profilePhotos: "profile-photos",
  verification: "verification",
} as const;

export type MediaBucket = (typeof MEDIA_BUCKETS)[keyof typeof MEDIA_BUCKETS];

export const MAX_IMAGE_BYTES = 6_291_456; // 6MB

export function imageExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext && ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
    return ext === "jpeg" ? "jpg" : ext;
  }
  return "jpg";
}
