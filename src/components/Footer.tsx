import { profile } from "@/data/resume";
import { StackedWaves } from "@/components/Backgrounds";
import { sectionHref } from "@/lib/links";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <StackedWaves className="absolute inset-x-0 bottom-0 h-40" />

      <div className="shell relative flex flex-wrap items-center justify-between gap-4 border-t border-line py-8">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
          {profile.name} · {profile.title} · {profile.location}
        </p>
        <a
          href={sectionHref("top")}
          className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint transition-colors hover:text-ink"
        >
          Back to top ↑
        </a>
      </div>

      <p className="built-with shell relative pb-6 text-center font-mono text-[0.625rem]">
        Designed and built by Priya Murkute · React, TypeScript, Framer Motion
      </p>
    </footer>
  );
}
