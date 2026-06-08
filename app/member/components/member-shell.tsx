"use client";

import { useInsideMemberShell, useMemberShellRegistration } from "./member-shell-context";
import { MemberShellFrame } from "./member-shell-frame";

export function MemberShell({
  children,
  backHref,
  backLabel = "Back",
  showNav = true,
  flush,
  right,
  wide,
  compactHeader,
  fullWidth,
  hideHeader,
  showHeaderIcons,
}: {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  showNav?: boolean;
  flush?: boolean;
  wide?: boolean;
  right?: React.ReactNode;
  compactHeader?: boolean;
  fullWidth?: boolean;
  hideHeader?: boolean;
  showHeaderIcons?: boolean;
}) {
  const inside = useInsideMemberShell();

  useMemberShellRegistration(
    {
      backHref,
      backLabel,
      showNav,
      flush,
      right,
      wide,
      compactHeader,
      fullWidth,
      hideHeader,
      showHeaderIcons,
    },
    inside
  );

  if (inside) return <>{children}</>;

  return (
    <MemberShellFrame
      backHref={backHref}
      backLabel={backLabel}
      showNav={showNav}
      flush={flush}
      right={right}
      wide={wide}
      compactHeader={compactHeader}
      fullWidth={fullWidth}
      hideHeader={hideHeader}
      showHeaderIcons={showHeaderIcons}
    >
      {children}
    </MemberShellFrame>
  );
}
