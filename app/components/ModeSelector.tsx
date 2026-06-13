"use client";

import { MODE_SPECS } from "@/app/lib/prompts";
import type { Mode } from "@/app/lib/types";

const MODES: Mode[] = ["enhance", "expand", "clarify", "rewrite"];

const ICONS: Record<Mode, React.ReactNode> = {
  enhance: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z"
        fill="currentColor"
      />
      <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" fill="currentColor" />
    </svg>
  ),
  expand: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M8 8H5V5h3M16 5h3v3M19 16v3h-3M8 19H5v-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  clarify: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M12 3l8 4.5v0L12 12 4 7.5 12 3zM4 12l8 4.5L20 12M4 16.5L12 21l8-4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
  rewrite: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export default function ModeSelector({
  value,
  onChange,
}: {
  value: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div className="mode-grid" role="radiogroup" aria-label="Refinement mode">
      {MODES.map((m) => {
        const active = m === value;
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            className={`mode-btn${active ? " is-active" : ""}`}
            onClick={() => onChange(m)}
            title={MODE_SPECS[m].blurb}
          >
            <span className="mode-icon">{ICONS[m]}</span>
            <span className="mode-label">{MODE_SPECS[m].label}</span>
          </button>
        );
      })}
    </div>
  );
}
