"use client";

import Image from "next/image";
import { motionFromSrc, type BloomObjectMotion } from "@/lib/bloom-object-assets";

export type BloomObjectIconProps = {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
  priority?: boolean;
  /** Object motion (auto-detected from src if omitted). */
  motion?: BloomObjectMotion | "auto";
  animate?: boolean;
};

/** BloomBay object from public assets — CSS motion on the object, not the page. */
export function BloomObjectIcon({
  src,
  alt = "",
  size = 48,
  className = "",
  priority = false,
  motion = "auto",
  animate = true,
}: BloomObjectIconProps) {
  const kind = motion === "auto" ? motionFromSrc(src) : motion;
  const motionClass = animate && kind !== "none" ? ` bb-object--${kind}` : "";

  const artifactClass = className?.includes("bb-artifact--") ? className : "";
  const layoutClass = className?.replace(/\bbb-artifact--\S+/g, "").trim();

  return (
    <span
      className={`bb-object-wrap${motionClass}${artifactClass ? ` ${artifactClass}` : ""}${layoutClass ? ` ${layoutClass}` : ""}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        unoptimized
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="bb-object-icon"
      />
    </span>
  );
}
