// Appends Supabase Storage transform params to a URL for on-the-fly resizing/compression
// Supabase Storage supports: width, height, quality, resize (cover|contain|fill)
// Only works for URLs from your own Supabase project storage

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export interface TransformOptions {
  width?: number;
  height?: number;
  quality?: number;   // 1-100, default 80
  resize?: "cover" | "contain" | "fill";
}

export function transformSupabaseImage(
  url: string | null | undefined,
  options: TransformOptions
): string | null {
  if (!url) return null;

  // Only transform Supabase storage URLs from this project
  if (!url.startsWith(SUPABASE_URL) || !url.includes("/storage/v1/object/")) return url;

  // Convert /object/public/ to /object/render/image/public/
  const renderUrl = url.replace(
    "/storage/v1/object/",
    "/storage/v1/render/image/"
  );

  const params = new URLSearchParams();
  if (options.width)   params.set("width",   String(options.width));
  if (options.height)  params.set("height",  String(options.height));
  if (options.quality) params.set("quality", String(options.quality));
  if (options.resize)  params.set("resize",  options.resize);

  return `${renderUrl}?${params.toString()}`;
}

// Convenience presets
export const avatarUrl  = (url: string | null) => transformSupabaseImage(url, { width: 200, height: 200, quality: 80, resize: "cover" });
export const thumbUrl   = (url: string | null) => transformSupabaseImage(url, { width: 400, quality: 75, resize: "cover" });
export const coverUrl   = (url: string | null) => transformSupabaseImage(url, { width: 800, quality: 80, resize: "cover" });
export const heroUrl    = (url: string | null) => transformSupabaseImage(url, { width: 1200, quality: 85, resize: "cover" });
