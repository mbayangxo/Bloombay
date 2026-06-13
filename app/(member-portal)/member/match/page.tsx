import { createClient } from "@/lib/supabase/server";
import { INTROS_MEMBER_THRESHOLD } from "@/lib/config";
import { IntroductionsPage } from "@/app/components/portal/introductions-page";

function IntrosLockedPage({ currentCount, threshold }: { currentCount: number; threshold: number }) {
  const hasThreshold = threshold > 0;
  const pct = hasThreshold ? Math.min(100, Math.round((currentCount / threshold) * 100)) : 0;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8 pt-16 pb-28"
      style={{ background: "#0A0808" }}
    >
      {/* Glow orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 320, height: 320,
          background: "radial-gradient(circle, #FF1F7D 0%, transparent 70%)",
          opacity: 0.08,
          top: "50%", left: "50%",
          transform: "translate(-50%, -60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center gap-6">

        {/* Badge */}
        <div
          className="px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.22em] uppercase"
          style={{ background: "rgba(255,31,125,0.12)", color: "#FF1F7D", border: "1px solid rgba(255,31,125,0.2)" }}
        >
          
        </div>

        {/* Title */}
        <div>
          <p
            className="font-black italic leading-none"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "52px", color: "white" }}
          >
            Intros.
          </p>
          <p className="text-sm mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            Not dating. Not swiping.<br />Relationship-building.
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-px" style={{ background: "rgba(255,31,125,0.3)" }} />

        {/* Body copy */}
        <p
          className="text-sm leading-relaxed italic"
          style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.35)", maxWidth: 280 }}
        >
          Intros opens when the community reaches its first milestone. We&apos;re building something
          intentional — the right women, the right moment.
        </p>

        {/* Progress — only shown when threshold is set */}
        {hasThreshold && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                MEMBERS
              </span>
              <span className="text-[10px] font-bold" style={{ color: "#FF1F7D" }}>
                {currentCount.toLocaleString()} / {threshold.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, #FF1F7D, #FF69B4)",
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            <p className="text-[10px] mt-2 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
              {pct}% of the way there
            </p>
          </div>
        )}

        {/* Yande note */}
        <div
          className="w-full rounded-2xl px-5 py-4"
          style={{ background: "rgba(255,31,125,0.06)", border: "1px solid rgba(255,31,125,0.1)" }}
        >
          <p className="text-[8px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "rgba(255,31,125,0.5)" }}>
            YANDE SAYS
          </p>
          <p className="text-xs italic leading-relaxed" style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.4)" }}>
            &ldquo;The right introductions don&apos;t happen by accident. They happen when the room is ready.&rdquo;
          </p>
        </div>

      </div>
    </div>
  );
}

export default async function MatchPage() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const memberCount = count ?? 0;
  const unlocked = INTROS_MEMBER_THRESHOLD > 0 && memberCount >= INTROS_MEMBER_THRESHOLD;

  if (!unlocked) {
    return <IntrosLockedPage currentCount={memberCount} threshold={INTROS_MEMBER_THRESHOLD} />;
  }

  return <IntroductionsPage />;
}
