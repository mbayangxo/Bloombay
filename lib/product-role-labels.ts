/**
 * User-facing role names and login URLs.
 * Internal DB/API role stays `club_owner` — only display copy changes here.
 */

export const ROLE_LOGIN = {
  founder: "/founder/login",
  clubMama: "/club-mama/login",
  host: "/host/login",
  member: "/member/login",
} as const;

export const CLUB_MAMA_LABELS = {
  portal: "Club Mama Portal",
  dashboard: "Club Mama Dashboard",
  login: "Club Mama Login",
  tools: "Club Mama Tools",
  applications: "Club Mama Applications",
  become: "Become a Club Mama",
  portalShort: "Club Mama",
} as const;

/** Legacy paths → canonical login (bookmarks still work) */
export const LEGACY_LOGIN_REDIRECTS: Record<string, string> = {
  "/club-owner/login": ROLE_LOGIN.clubMama,
  "/company": ROLE_LOGIN.founder,
};
