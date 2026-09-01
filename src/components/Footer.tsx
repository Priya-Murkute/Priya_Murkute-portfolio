import { profile } from "@/data/resume";
import { StackedWaves } from "@/components/Backgrounds";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <StackedWaves className="absolute inset-x-0 bottom-0 h-40" />

      <div className="shell relative flex flex-wrap items-center justify-between gap-4 border-t border-line py-8">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
          {profile.name} · {profile.title} · {profile.location}
        </p>
        <a
          href="/#top"
          className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint transition-colors hover:text-ink"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
