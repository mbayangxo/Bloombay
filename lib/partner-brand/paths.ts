/** Member-facing partner page URL. */
export function partnerMemberHref(slug: string): string {
  return `/member/partners/${slug}`;
}

export function slugifyPartnerName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
