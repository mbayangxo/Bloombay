export function BloomScore({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span className={`fp-bloom-score fp-bloom-score--${size}`} title={`Bloom Score ${score}`}>
      <span className="fp-bloom-score__icon" aria-hidden>
        ✦
      </span>
      <span className="fp-bloom-score__value">{score}</span>
    </span>
  );
}
