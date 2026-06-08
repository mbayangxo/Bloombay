/** Map pin — Pin drops (not a notification bell). */
export function PinIcon({
  size = 14,
  stroke = "#FF1F7D",
}: {
  size?: number;
  stroke?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" fill={stroke} stroke="none" />
    </svg>
  );
}
