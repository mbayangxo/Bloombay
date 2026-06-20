import Link from "next/link";
import type { BloomScene } from "@/lib/home-scenes";
import { PlaceCover } from "./place-cover";
import { placeCoverToneFor } from "@/lib/place-cover-tone";
import type { SpaceMoodId } from "@/lib/bloom-space-moods";

export function BloomSceneLine({
  scene,
  large,
}: {
  scene: BloomScene;
  large?: boolean;
}) {
  return (
    <Link
      href={scene.href}
      className={`bb-scene bb-scene--${scene.tone ?? "warm"}${large ? " bb-scene--hero" : ""}`}
    >
      <p className="bb-scene__line">{scene.line}</p>
      {scene.whisper ? <p className="bb-scene__whisper">{scene.whisper}</p> : null}
    </Link>
  );
}

export function SceneStack({ scenes }: { scenes: BloomScene[] }) {
  if (scenes.length === 0) return null;
  return (
    <div className="bb-scene-stack" aria-label="What's alive right now">
      <BloomSceneLine scene={scenes[0]} large />
      {scenes.slice(1).map((s) => (
        <BloomSceneLine key={s.id} scene={s} />
      ))}
    </div>
  );
}

export function MoodIntro({
  mood,
  moodId,
  authored,
  object,
}: {
  mood: { scene: string; whisper?: string; tagline: string };
  moodId?: SpaceMoodId;
  authored?: string;
  object?: React.ReactNode;
}) {
  const tone = moodId ? placeCoverToneFor(moodId) : "editorial";
  return (
    <PlaceCover
      eyebrow={mood.tagline}
      title={mood.scene}
      whisper={mood.whisper}
      authored={authored}
      tone={tone}
      object={object}
      className="bb-mood-intro"
    />
  );
}
