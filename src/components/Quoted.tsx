import type { ReactNode } from "react";

/** Wraps a quotation in curly marks, drawn in the site's petal pink (.quote-mark). */
export default function Quoted({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="quote-mark">“</span>
      {children}
      <span className="quote-mark">”</span>
    </>
  );
}
