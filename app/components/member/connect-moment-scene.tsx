import Link from "next/link";
import type { ConnectMoment } from "@/lib/connect-moments";

export function ConnectMomentScene({ moment }: { moment: ConnectMoment }) {
  return (
    <article className={`bb-connect-moment bb-connect-moment--${moment.tone ?? "warm"}`}>
      <p className="bb-connect-moment__emoji" aria-hidden>
        {moment.emoji}
      </p>
      <h2 className="bb-connect-moment__scene">{moment.scene}</h2>
      <p className="bb-connect-moment__living">{moment.living}</p>
      <p className="bb-connect-moment__cast">{moment.cast}</p>
      <Link href={moment.href} className="bb-connect-moment__cta">
        {moment.cta} →
      </Link>
    </article>
  );
}
