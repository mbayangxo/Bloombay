import Link from "next/link";
import type { ReactNode } from "react";

export function ArtifactShell({
  href,
  className,
  children,
  onClick,
}: {
  href?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  if (href) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <div className={className} onClick={onClick} role={onClick ? "button" : undefined}>
      {children}
    </div>
  );
}
