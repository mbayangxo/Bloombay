"use client";

export function SealButton({
  children,
  onClick,
  type = "button",
  className = "",
  fullWidth = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn-seal ${fullWidth ? "btn-seal--full" : ""} ${className}`}
    >
      <span className="btn-seal__glow" aria-hidden />
      <span className="btn-seal__face">{children}</span>
    </button>
  );
}

export function RibbonTab({
  children,
  onClick,
  variant = "blush",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "blush" | "ivory";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-ribbon-tab btn-ribbon-tab--${variant}`}
    >
      <span className="btn-ribbon-tab__fold" aria-hidden />
      {children}
    </button>
  );
}

export function PaperCardTab({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="btn-paper-card">
      <span className="btn-paper-card__corner" aria-hidden />
      {children}
    </button>
  );
}
