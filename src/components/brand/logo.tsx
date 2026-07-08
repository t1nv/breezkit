/**
 * Breezkit brand mark — three breeze strokes on a terracotta tile.
 * Scales with the parent: pass sizing via className (e.g. "h-8 w-8").
 */
export function BreezkitMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Breezkit"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bk-tile" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D97757" />
          <stop offset="1" stopColor="#C15F3C" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#bk-tile)" />
      <path
        d="M10 18.5h15.5a4.25 4.25 0 1 0-4.25-4.25"
        stroke="#FFFFFF"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M10 26h22.5a4.25 4.25 0 1 1-4.25 4.25"
        stroke="#FFFFFF"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M10 33.5h11"
        stroke="#FFFFFF"
        strokeWidth="3.4"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}
