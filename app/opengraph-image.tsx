import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BloomBay — Where you bloom.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PINK = "#FF1F7D";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(160deg, ${PINK} 0%, #A8005A 55%, #2E0A1C 100%)`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.10)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -100,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.14)",
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: 108,
            fontStyle: "italic",
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          BloomBay
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 34,
            fontStyle: "italic",
            color: "rgba(255,255,255,0.85)",
            display: "flex",
          }}
        >
          Where you bloom.
        </div>
        <div
          style={{
            marginTop: 44,
            fontSize: 20,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            display: "flex",
          }}
        >
          A social world for women · New York City
        </div>
      </div>
    ),
    { ...size }
  );
}
