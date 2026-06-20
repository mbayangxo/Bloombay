"use client";

export function ScreenNav({
  onBack,
  onHome,
  light = false,
}: {
  onBack: () => void;
  onHome: () => void;
  light?: boolean;
}) {
  return (
    <nav className={`bb-screen-nav ${light ? "bb-screen-nav--light" : ""}`} aria-label="Screen navigation">
      <button type="button" className="bb-screen-nav__home font-script" onClick={onHome}>
        ← Back to homepage
      </button>
      <button type="button" className="bb-soft-back font-script" onClick={onBack}>
        ← back
      </button>
    </nav>
  );
}
