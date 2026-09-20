import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";
import type { HobbyIcon } from "@/types";

/** Line icons in the style of the Skills section, drawn on a 16×16 grid. */
const ICONS: Record<HobbyIcon, ReactNode> = {
  pencil: (
    <>
      <path d="M11.2 2.3a1.5 1.5 0 0 1 2.1 2.1l-8 8L2.5 13.5l1.1-2.8Z" />
      <path d="m9.8 3.7 2.5 2.5" />
    </>
  ),
  camera: (
    <>
      <rect x="1.8" y="4.3" width="12.4" height="9" rx="2" />
      <circle cx="8" cy="8.8" r="2.4" />
      <path d="M5.6 4.3 6.6 2.6h2.8l1 1.7" />
    </>
  ),
  globe: (
    <>
      <circle cx="8" cy="8" r="6.2" />
      <path d="M1.8 8h12.4M8 1.8c1.8 1.8 2.6 3.9 2.6 6.2S9.8 12.4 8 14.2C6.2 12.4 5.4 10.3 5.4 8S6.2 3.6 8 1.8Z" />
    </>
  ),
  note: (
    <>
      <path d="M6 12.2V3.4l7-1.4v8.6" />
      <circle cx="4.3" cy="12.2" r="1.8" />
      <circle cx="11.3" cy="10.6" r="1.8" />
    </>
  ),
  racket: (
    <>
      <ellipse cx="6.3" cy="6.3" rx="4" ry="4.5" transform="rotate(-45 6.3 6.3)" />
      <path d="m9.3 9.3 4.4 4.4" />
      <path d="M4.3 4.6 8 8.3M6.6 3.3 3.4 6.5" />
    </>
  ),
  ticket: (
    <>
      <path d="M2 5.3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1.4a1.6 1.6 0 0 0 0 3.2v1.4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9.9a1.6 1.6 0 0 0 0-3.2Z" />
      <path d="M10 4.6v1.2M10 7.4v1.2M10 10.2v1.2" />
    </>
  ),
  dining: (
    <>
      <path d="M4.4 2v4a1.6 1.6 0 0 0 3.2 0V2M6 2v12" />
      <path d="M11.8 14V2c-1.6.8-2.3 2.6-2.3 4.8 0 1.4.9 2.2 2.3 2.2" />
    </>
  ),
  flower: (
    <>
      <ellipse cx="8" cy="3.5" rx="1.6" ry="2" />
      <ellipse cx="10.5" cy="6" rx="2" ry="1.6" />
      <ellipse cx="5.5" cy="6" rx="2" ry="1.6" />
      <ellipse cx="8" cy="8.5" rx="1.6" ry="2" />
      <circle cx="8" cy="6" r="0.9" />
      <path d="M8 10.5v4M8 12.8c1.3-.2 2.3-1 2.7-2.2" />
    </>
  ),
  sparkle: (
    <>
      <path d="M7 1.8 8.3 5.7 12.2 7 8.3 8.3 7 12.2 5.7 8.3 1.8 7 5.7 5.7Z" />
      <path d="M12.8 10.6v3.2M11.2 12.2h3.2" />
    </>
  ),
};

export function HobbyIconBadge({ icon }: { icon: HobbyIcon }) {
  return (
    <span className="flex size-[34px] flex-none items-center justify-center rounded-[10px] bg-sunk text-[var(--accent-rose)]">
      <Icon className="size-[18px]" strokeWidth={1.4}>
        {ICONS[icon]}
      </Icon>
    </span>
  );
}
