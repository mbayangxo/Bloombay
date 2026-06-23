"use client";

export function FoundingFlower({ size = 48, color = "#111111" }: { size?: number; color?: string }) {
  const h = Math.round(size * 1.3);
  return (
    <svg width={size} height={h} viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer arabesque silhouette */}
      <path
        d="M50,3 C57,3 74,11 83,28 C91,42 93,55 93,65 C93,75 91,88 83,102 C74,119 57,127 50,127 C43,127 26,119 17,102 C9,88 7,75 7,65 C7,55 9,42 17,28 C26,11 43,3 50,3 Z"
        fill={color}
      />
      {/* Top spike */}
      <path
        d="M50,3 L47,0 C48,-1 50,-2 52,-1 L53,0 Z"
        fill={color}
      />
      {/* Bottom spike */}
      <path
        d="M50,127 L47,130 C48,131 50,132 52,131 L53,130 Z"
        fill={color}
      />
      {/* Inner white ring */}
      <path
        d="M50,11 C55.5,11 70,17.5 77.5,32 C84.5,45 86,57 86,65 C86,73 84.5,85 77.5,98 C70,112.5 55.5,119 50,119 C44.5,119 30,112.5 22.5,98 C15.5,85 14,73 14,65 C14,57 15.5,45 22.5,32 C30,17.5 44.5,11 50,11 Z"
        fill="white"
      />
      {/* Black interior */}
      <path
        d="M50,16 C55,16 68,22 75,35 C81.5,47 83,58 83,65 C83,72 81.5,83 75,95 C68,108 55,114 50,114 C45,114 32,108 25,95 C18.5,83 17,72 17,65 C17,58 18.5,47 25,35 C32,22 45,16 50,16 Z"
        fill={color}
      />
      {/* Top leaf inside frame */}
      <path
        d="M50,28 C48,33 47,38 50,43 C53,38 52,33 50,28 Z"
        fill="white"
      />
      {/* Bottom leaf inside frame */}
      <path
        d="M50,87 C48,92 47,97 50,102 C53,97 52,92 50,87 Z"
        fill="white"
      />
      {/* Flower petals group centered at (50, 65) */}
      <g transform="translate(50,65)">
        {/* 8 outer petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={`outer-${angle}`}
            cx="0"
            cy="-16"
            rx="5.5"
            ry="9"
            fill="white"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* 8 inner petals offset by 22.5 degrees */}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
          <ellipse
            key={`inner-${angle}`}
            cx="0"
            cy="-10"
            rx="3.5"
            ry="6"
            fill="white"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Center circles */}
        <circle cx="0" cy="0" r="4.5" fill="white" />
        <circle cx="0" cy="0" r="1.5" fill={color} />
      </g>
    </svg>
  );
}
