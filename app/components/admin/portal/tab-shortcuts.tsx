import Link from "next/link";
import { CountUp } from "./count-up";

export type TabShortcut = {
  label: string;
  count: number;
  href: string;
};

export function TabShortcuts({ items }: { items: TabShortcut[] }) {
  return (
    <section className="fp-overview-shortcuts" aria-label="Waiting in other areas">
      <h3 className="fp-overview-shortcuts__title">Waiting in other tabs</h3>
      <ul className="fp-overview-shortcuts__grid">
        {items.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="fp-overview-shortcut">
              <CountUp value={item.count} className="fp-overview-shortcut__count" />
              <span className="fp-overview-shortcut__label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
