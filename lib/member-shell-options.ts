/** Default shell chrome per route — pages can override via MemberShell props. */

export type MemberShellConfig = {
  backHref?: string;
  backLabel?: string;
  showNav?: boolean;
  flush?: boolean;
  wide?: boolean;
  compactHeader?: boolean;
  fullWidth?: boolean;
  hideHeader?: boolean;
  showHeaderIcons?: boolean;
};

const BARE_PREFIXES = [
  "/member/login",
  "/member/join",
  "/member/onboarding",
  "/member/pending-approval",
];

export function memberPathNeedsShell(pathname: string): boolean {
  if (pathname === "/member") return false;
  return !BARE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function defaultMemberShellOptions(pathname: string): MemberShellConfig {
  if (pathname === "/member/home" || pathname === "/member/tonight") {
    return { compactHeader: true, flush: true, fullWidth: true };
  }
  if (pathname === "/member/clubs" || pathname === "/member/clubs/discover" || pathname === "/member/clubs/board") {
    return { compactHeader: true, flush: true, fullWidth: true };
  }
  if (pathname.startsWith("/member/clubs/")) {
    return { compactHeader: true, flush: true, fullWidth: true, backHref: "/member/clubs", backLabel: "Clubs" };
  }
  if (pathname.startsWith("/member/happenings") || pathname.startsWith("/member/calendar")) {
    return { compactHeader: true, flush: true, fullWidth: true };
  }
  if (pathname.startsWith("/member/explore") || pathname.startsWith("/member/eats") || pathname.startsWith("/member/maps")) {
    return { hideHeader: true, flush: true, fullWidth: true };
  }
  if (pathname.startsWith("/member/intros") || pathname.startsWith("/member/connect")) {
    return { hideHeader: true, flush: true, fullWidth: true };
  }
  if (pathname.startsWith("/member/lounge") || pathname === "/member/room") {
    return { hideHeader: true, flush: true, fullWidth: true };
  }
  if (pathname.startsWith("/member/settings") || pathname.startsWith("/member/scan") || pathname.startsWith("/member/check-in")) {
    return { showNav: false };
  }
  return {};
}
