import Image from "next/image";
import Link from "next/link";

type Variant = "pink" | "dark";

const SRC: Record<Variant, string> = {
  pink: "/logosbloombay/Vector-1.svg",
  dark: "/logosbloombay/Vector.svg",
};

export function BloomBayLogo({
  height = 32,
  variant = "pink",
  href,
  className = "",
  priority,
}: {
  height?: number;
  variant?: Variant;
  href?: string;
  className?: string;
  priority?: boolean;
}) {
  const width = Math.round(height * 0.6);
  const img = (
    <Image
      src={SRC[variant]}
      alt="BloomBay"
      width={width}
      height={height}
      className={className}
      priority={priority}
      style={{ height, width: "auto" }}
    />
  );

  if (href) {
    return (
      <Link href={href} className="mp-logo-link" aria-label="BloomBay home">
        {img}
      </Link>
    );
  }

  return img;
}

/** Wordmark row: logo + optional text */
export function BloomBayBrand({
  height = 28,
  variant = "pink",
  href = "/member/home",
  showText = true,
  className = "",
}: {
  height?: number;
  variant?: Variant;
  href?: string;
  showText?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`mp-brand${className ? ` ${className}` : ""}`}>
      <BloomBayLogo height={height} variant={variant} />
      {showText ? <span className="mp-brand__text">BloomBay</span> : null}
    </Link>
  );
}
