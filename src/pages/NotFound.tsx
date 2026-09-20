import { Link } from "react-router-dom";
import { LayeredWaves } from "@/components/Backgrounds";
import { Icon } from "@/components/Icon";
import { iconPaths } from "@/lib/iconPaths";

export default function NotFound() {
  return (
    <main id="main-content" className="section relative flex min-h-[80vh] items-center overflow-hidden">
      <LayeredWaves className="absolute inset-x-0 top-0 h-40 opacity-60" />

      <div className="shell relative">
        <div className="max-w-[34rem]">
          <span className="eyebrow flex w-fit items-center gap-2 text-fail">
            <span className="status-dot bg-fail" />
            404 · route not found
          </span>

          <h1 className="text-title mt-4 font-display font-semibold">This route doesn't pass.</h1>

          <p className="measure mt-4 text-lead text-muted">
            There's no page at this address — the router checked and came up empty. Everything
            else on the site still does.
          </p>

          <div className="card mt-7 flex items-start gap-3 p-4">
            <span className="mt-0.5 flex size-4 flex-none items-center justify-center rounded-full border border-fail bg-fail-tint">
              <svg viewBox="0 0 8 8" className="size-2" aria-hidden="true">
                <path
                  d="M1 1l6 6M7 1L1 7"
                  stroke="var(--fail)"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <p className="font-mono text-[0.8125rem] leading-relaxed">
              Given this URL, When the router looks it up, Then nothing matches
            </p>
          </div>

          <p className="mt-5 flex items-center gap-2 font-mono text-xs text-faint">
            <span className="text-fail">0 passing</span>
            <span>·</span>
            1 failing
            <span>·</span>
            this one
          </p>

          <Link to="/" className="btn-primary glow-cta mt-7">
            Back to the suite
            <Icon d={iconPaths.arrowRight} />
          </Link>
        </div>
      </div>
    </main>
  );
}
