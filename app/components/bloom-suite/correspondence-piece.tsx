import type { ReactNode } from "react";

export function CorrespondencePiece({
  kind,
  title,
  children,
  className = "",
}: {
  kind: "invitation" | "letter" | "reply" | "charter" | "confirmation";
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`corr-piece corr-piece--${kind} ${className}`}>
      <p className="corr-piece__kind">{title}</p>
      <div className="corr-piece__body">{children}</div>
    </article>
  );
}

export function SealAction({
  children,
  onClick,
  wide = false,
}: {
  children: ReactNode;
  onClick: () => void;
  wide?: boolean;
}) {
  return (
    <button type="button" className={`corr-seal-action ${wide ? "corr-seal-action--wide" : ""}`} onClick={onClick}>
      <span className="corr-seal-action__label">{children}</span>
      <span className="corr-seal-action__wax" aria-hidden>
        <span className="corr-seal-action__b">B</span>
      </span>
    </button>
  );
}

export function CorrespondenceBack({ onClick, label = "Set this aside" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" className="corr-back font-script" onClick={onClick}>
      ← {label}
    </button>
  );
}
