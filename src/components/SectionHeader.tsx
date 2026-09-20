import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A section's heading: the eyebrow label over the title, and something on the
 * right that drops underneath on a narrow screen — a line of copy (`note`), or
 * whatever controls belong to the section (`children`, like Showcase's tabs).
 */
export default function SectionHeader({
  eyebrow,
  title,
  titleId,
  titleClassName = "text-title font-display font-semibold",
  className,
  note,
  children,
}: {
  eyebrow: string;
  /** Usually text; Showcase's is a quotation, so it can be anything. */
  title: ReactNode;
  /** For `aria-labelledby` on the section. */
  titleId?: string;
  /** The title's look, in place of the usual one (a quotation takes `quote-text` instead). */
  titleClassName?: string;
  className?: string;
  note?: string;
  children?: ReactNode;
}) {
  return (
    <header className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-3", className)}>
      <div>
        <p className="eyebrow eyebrow-section">{eyebrow}</p>
        <h2 id={titleId} className={cn("mt-3", titleClassName)}>
          {title}
        </h2>
      </div>
      {note ? <p className="max-w-[46ch] text-sm text-muted">{note}</p> : null}
      {children}
    </header>
  );
}
