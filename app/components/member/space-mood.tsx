import type { ReactNode } from "react";
import type { SpaceMoodId } from "@/lib/bloom-space-moods";
import { getSpaceMood } from "@/lib/bloom-space-moods";
import { MoodIntro } from "./bloom-scene";

export function SpaceMood({
  mood,
  children,
  showIntro = true,
  className = "",
}: {
  mood: SpaceMoodId;
  children: ReactNode;
  showIntro?: boolean;
  className?: string;
}) {
  const def = getSpaceMood(mood);
  return (
    <div className={`bb-mood bb-mood--${mood} ${className}`.trim()}>
      {showIntro ? <MoodIntro mood={def} moodId={mood} /> : null}
      <div className="bb-mood__body">{children}</div>
    </div>
  );
}
