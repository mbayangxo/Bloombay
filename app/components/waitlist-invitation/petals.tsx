"use client";

const SOFT_PETALS = Array.from({ length: 28 }, (_, i) => ({
  id: `s-${i}`,
  left: `${(i * 4.7 + 2) % 98}%`,
  delay: `${(i * 0.55) % 10}s`,
  duration: `${16 + (i % 8) * 2.5}s`,
  size: 6 + (i % 5) * 2,
  opacity: 0.2 + (i % 4) * 0.08,
  drift: (i % 2 === 0 ? 1 : -1) * (8 + (i % 3) * 4),
}));

const GLASS_PETALS = Array.from({ length: 14 }, (_, i) => ({
  id: `g-${i}`,
  left: `${(i * 9.5 + 8) % 92}%`,
  delay: `${(i * 1.1) % 12}s`,
  duration: `${20 + (i % 5) * 3}s`,
  size: 10 + (i % 3) * 4,
}));

export function FloatingPetals() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden>
      {SOFT_PETALS.map((p) => (
        <span
          key={p.id}
          className="petal petal--soft"
          style={{
            left: p.left,
            bottom: "-24px",
            width: p.size,
            height: p.size * 1.35,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
            ["--petal-drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
      {GLASS_PETALS.map((p) => (
        <span
          key={p.id}
          className="petal petal--glass glass-petal"
          style={{
            left: p.left,
            bottom: "-30px",
            width: p.size,
            height: p.size * 1.2,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
