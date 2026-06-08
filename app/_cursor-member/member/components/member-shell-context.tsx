"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  defaultMemberShellOptions,
  memberPathNeedsShell,
  type MemberShellConfig,
} from "@/lib/member-shell-options";
import { MemberShellFrame } from "./member-shell-frame";

type PageShellOptions = MemberShellConfig & { right?: ReactNode };

const ShellRegisterCtx = createContext<((opts: PageShellOptions) => void) | null>(null);
const InsideShellCtx = createContext(false);

export function MemberShellHost({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const defaults = useMemo(() => defaultMemberShellOptions(pathname), [pathname]);
  const [pageOptions, setPageOptions] = useState<PageShellOptions>({});

  const register = useCallback((opts: PageShellOptions) => {
    setPageOptions(opts);
  }, []);

  const merged = useMemo(
    () => ({ ...defaults, ...pageOptions }),
    [defaults, pageOptions]
  );

  if (!memberPathNeedsShell(pathname)) {
    return <>{children}</>;
  }

  return (
    <ShellRegisterCtx.Provider value={register}>
      <InsideShellCtx.Provider value={true}>
        <MemberShellFrame {...merged}>{children}</MemberShellFrame>
      </InsideShellCtx.Provider>
    </ShellRegisterCtx.Provider>
  );
}

export function useMemberShellRegistration(opts: PageShellOptions, enabled: boolean) {
  const register = useContext(ShellRegisterCtx);
  const inside = useContext(InsideShellCtx);
  const pathname = usePathname() ?? "";

  useLayoutEffect(() => {
    if (!enabled || !inside || !register) return;
    register(opts);
  }, [
    enabled,
    inside,
    register,
    pathname,
    opts.backHref,
    opts.backLabel,
    opts.showNav,
    opts.flush,
    opts.wide,
    opts.compactHeader,
    opts.fullWidth,
    opts.hideHeader,
    opts.showHeaderIcons,
    opts.right,
  ]);
}

export function useInsideMemberShell() {
  return useContext(InsideShellCtx);
}
