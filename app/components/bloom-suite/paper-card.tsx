import type { ReactNode } from "react";

export function PaperCard({
  children,
  className = "",
  deckled = true,
}: {
  children: ReactNode;
  className?: string;
  deckled?: boolean;
}) {
  return (
    <div className={`suite-paper ${deckled ? "suite-paper--deckled" : ""} ${className}`}>
      {children}
    </div>
  );
}
