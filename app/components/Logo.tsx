/**
 * The rePROMPTer 2 emblem — chrome "rP" monogram inside the crimson recursive
 * loop. Recreated inline so it scales crisply and can sit in the header.
 */
export default function Logo({ size = 72 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="rp-emblem"
    >
      <defs>
        <linearGradient id="emblem-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#e9e9ee" />
          <stop offset="54%" stopColor="#9a9aa1" />
          <stop offset="68%" stopColor="#c8c8cf" />
          <stop offset="100%" stopColor="#6f6f76" />
        </linearGradient>
        <linearGradient id="emblem-crimson" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff5256" />
          <stop offset="55%" stopColor="#e0383b" />
          <stop offset="100%" stopColor="#a51f23" />
        </linearGradient>
        <filter id="emblem-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        filter="url(#emblem-glow)"
        fill="none"
        stroke="url(#emblem-crimson)"
        strokeWidth="22"
        strokeLinecap="round"
      >
        <path d="M150 196 A118 118 0 0 1 360 150" />
        <path d="M362 316 A118 118 0 0 1 152 362" />
      </g>
      <g fill="url(#emblem-crimson)" filter="url(#emblem-glow)">
        <path d="M360 150 l36 -10 -17 33 z" />
        <path d="M152 362 l-36 10 17 -33 z" />
      </g>

      <text
        x="256"
        y="318"
        textAnchor="middle"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
        fontSize="210"
        fontWeight={800}
        letterSpacing="-14"
        fill="url(#emblem-chrome)"
      >
        rP
      </text>
    </svg>
  );
}
