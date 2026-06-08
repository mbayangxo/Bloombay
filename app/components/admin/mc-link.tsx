"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useMcPath } from "./mission-control-provider";

/** Resolves /admin/... paths to the active staff portal (/founder or /admin). */
export function McLink({
  href,
  ...props
}: ComponentProps<typeof Link> & { href: string }) {
  const toMc = useMcPath();
  return <Link href={toMc(href)} {...props} />;
}
