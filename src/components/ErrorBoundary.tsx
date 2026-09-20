import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered in place of the subtree when it throws. `null` fails silently. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return this.props.fallback ?? null;
  }
}

/** The page-level fallback. */
export function PageErrorFallback() {
  return (
    <main id="main-content" className="section flex min-h-[70vh] items-center">
      <div className="shell">
        <div className="max-w-[34rem]">
          <span className="eyebrow flex w-fit items-center gap-2 text-fail">
            <span className="status-dot bg-fail" />
            Something broke on this page
          </span>

          <h1 className="text-title mt-4 font-display font-semibold">
            This section didn't render.
          </h1>

          <p className="measure mt-4 text-lead text-muted">
            An error stopped this part of the site from loading. Reloading usually clears it — the
            rest of the site is unaffected.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary glow-cta mt-7"
          >
            Reload the page
          </button>
        </div>
      </div>
    </main>
  );
}
