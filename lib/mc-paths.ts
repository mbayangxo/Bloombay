/** Mission Control link prefix — founder vs admin share the same panels. */

export type StaffBase = "/founder" | "/admin";

export function mcPath(href: string, base: StaffBase): string {
  if (href.startsWith("/admin")) return href.replace(/^\/admin/, base);
  if (href.startsWith("/founder")) return href.replace(/^\/founder/, base);
  if (href.startsWith("/")) return `${base}${href}`;
  return `${base}/${href}`;
}
