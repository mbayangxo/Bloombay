import Link from "next/link";
import { BloomObjectIcon } from "@/app/components/bloom/bloom-object-icon";
import type { CityCard } from "@/lib/the-city-data";

const SHAPES = ["ticket", "pin", "coaster", "tag", "ticket", "pin"] as const;

export function CityObjectPin({
  card,
  index,
  objectSrc,
}: {
  card: CityCard;
  index: number;
  objectSrc: string;
}) {
  const shape = SHAPES[index % SHAPES.length];
  const tilt = index % 2 === 0 ? -2.2 : 1.6;

  return (
    <Link
      href={card.href}
      className={`bb-city-object bb-city-object--${shape}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <BloomObjectIcon src={objectSrc} size={28} animate={false} className="bb-city-object__bloom" />
      {card.womenRated ? <span className="bb-city-object__stamp">Women-rated</span> : null}
      <span className="bb-city-object__tag bb-tag">{card.tag}</span>
      <h3 className="bb-city-object__title">{card.title}</h3>
      <p className="bb-city-object__meta">{card.meta}</p>
      {card.detail ? <p className="bb-city-object__detail">{card.detail}</p> : null}
    </Link>
  );
}
