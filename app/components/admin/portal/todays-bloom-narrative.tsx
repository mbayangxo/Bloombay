import Link from "next/link";
import { TODAYS_BLOOM_NARRATIVE, type TodaysBloomLine } from "@/lib/founder-todays-bloom";

export function TodaysBloomNarrative({
  lines = TODAYS_BLOOM_NARRATIVE,
}: {
  lines?: TodaysBloomLine[];
}) {
  return (
    <section className="fp-todays-bloom-narrative fp-card">
      <p className="fp-kicker">Today&apos;s Bloom</p>
      <h2 className="fp-todays-bloom-narrative__title">
        BloomBay is women meeting women — IRL first.
      </h2>
      <ul className="fp-todays-bloom-narrative__list">
        {lines.map((line, i) => (
          <li key={i} className={`fp-todays-bloom-narrative__line fp-todays-bloom-narrative__line--${line.tone ?? "watch"}`}>
            {line.href ? (
              <Link href={line.href}>{line.text}</Link>
            ) : (
              line.text
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
