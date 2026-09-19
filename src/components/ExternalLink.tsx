import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * A link to another site, opened in a new tab. `noopener noreferrer` is fixed
 * here and can't be passed in: without it the opened page could reach back
 * through `window.opener`. `underlined` gives the plain-text-link look.
 */
export function ExternalLink({
  href,
  underlined = false,
  className,
  children,
  ...props
}: { href: string; underlined?: boolean } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel">) {
  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(underlined && "underline decoration-line-strong underline-offset-4 hover:text-ink", className)}
    >
      {children}
    </a>
  );
}
