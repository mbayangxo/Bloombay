import { SuiteIcon } from "./icons";
import { WaxSealButton } from "./decor";

const POLAROIDS = [
  { rotate: -8, x: "8%", y: "18%", tone: "linear-gradient(135deg,#ffd6e4,#ffb8d0)" },
  { rotate: 6, x: "62%", y: "12%", tone: "linear-gradient(135deg,#f5e6d8,#e8c4a8)" },
  { rotate: -4, x: "72%", y: "42%", tone: "linear-gradient(135deg,#ffe8f0,#ffc9dc)" },
  { rotate: 10, x: "18%", y: "48%", tone: "linear-gradient(135deg,#fff0f6,#ffd6e4)" },
];

export function SealedInvitation({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="corr-sealed">
      <div className="corr-sealed__envelope" aria-hidden>
        <div className="flow-hero-envelope__fabric" />
        <div className="corr-sealed__flap" />
        <div className="corr-sealed__body" />
        <button type="button" className="corr-sealed__seal-btn" onClick={onOpen} aria-label="Break the seal and open the invitation">
          <WaxSealButton />
        </button>
      </div>
      <p className="corr-sealed__note font-script">Something arrived for you.</p>
    </div>
  );
}

export function OpenedInvitation() {
  return (
    <div className="flow-hero-envelope corr-opened-env" aria-hidden>
      <div className="flow-hero-envelope__card corr-opened-env__open">
        <div className="flow-hero-envelope__interior">
          <div className="flow-hero-envelope__skyline" />
          {POLAROIDS.map((p, i) => (
            <div
              key={i}
              className="flow-polaroid"
              style={{
                left: p.x,
                top: p.y,
                transform: `rotate(${p.rotate}deg)`,
                background: p.tone,
              }}
            >
              <div className="flow-polaroid__img" />
            </div>
          ))}
        </div>
        <div className="flow-hero-envelope__flap corr-opened-env__flap--back" />
      </div>
    </div>
  );
}

export function LetterPromises({ items }: { items: readonly { icon: string; label: string }[] }) {
  return (
    <ul className="corr-letter-list">
      {items.map((item) => (
        <li key={item.label}>
          <SuiteIcon name={item.icon} className="h-5 w-5 shrink-0 text-hot-pink" />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
