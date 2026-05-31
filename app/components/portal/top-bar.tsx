import { BBLogo } from "./bb-logo";

export function TopBar({
  location = "Williamsburg",
  day = "Friday",
}: {
  location?: string;
  day?: string;
}) {
  return (
    <header className="flex items-center justify-between px-4 pt-12 pb-3">
      <div className="flex items-center gap-2">
        <BBLogo size={22} />
        <span
          className="text-lg font-bold tracking-tight"
          style={{ color: "var(--bb-black)" }}
        >
          Bloom<span style={{ color: "var(--bb-pink)" }}>Bay</span>
        </span>
      </div>
      <p className="text-xs text-gray-400 font-medium">
        {day} · {location}
      </p>
      <div className="flex items-center gap-2">
        <button
          aria-label="Notifications"
          className="text-lg hover:scale-110 transition-transform"
        >
          🔔
        </button>
        <div
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: "var(--bb-pink)" }}
        >
          <div
            className="w-5 h-5 rounded-full"
            style={{ background: "var(--mid-pink)" }}
          />
        </div>
      </div>
    </header>
  );
}
