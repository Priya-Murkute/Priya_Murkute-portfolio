import type { ReactNode, SVGProps } from "react";

/**
 * Line icons on a 16×16 grid, drawn in the current text colour. Give it a
 * path (`d`), or several shapes as children. Size it with `className` (it is
 * `size-3.5` unless told otherwise); the stroke can be set too, as it is for
 * the Skills glyphs, which take the colour of their group.
 */
export function Icon({
  d,
  children,
  className = "size-3.5",
  strokeWidth = 1.5,
  ...props
}: { d?: string; children?: ReactNode } & Omit<SVGProps<SVGSVGElement>, "d">) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {d ? <path d={d} /> : children}
    </svg>
  );
}
