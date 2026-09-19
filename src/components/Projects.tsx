import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { githubHandle, profile } from "@/data/resume";
import { LayeredWaves } from "@/components/Backgrounds";
import { useOnScreen } from "@/lib/useOnScreen";
import { cn } from "@/lib/utils";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
};

const MAX_REPOS = 6;

/** More than MAX_REPOS, since forks and the profile README repo get filtered out. */
const PER_PAGE = 12;
const CACHE_KEY = "pm-github-repos";
const CACHE_TTL_MS = 30 * 60 * 1000;

type FetchState = { status: "loading" } | { status: "error" } | { status: "ready"; repos: Repo[] };

function readCachedRepos(): Repo[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as { at: number; repos: Repo[] };
    if (!Array.isArray(cached.repos) || Date.now() - cached.at > CACHE_TTL_MS) return null;
    return cached.repos;
  } catch {
    return null;
  }
}

function writeCachedRepos(repos: Repo[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos }));
  } catch {
    // storage unavailable — the feed just refetches next time
  }
}

function formatRepoName(name: string) {
  return name.replace(/[-_]+/g, " ");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

/**
 * Live from the GitHub API rather than curated in resume.ts. Forks and the
 * profile README repo are filtered out. Unauthenticated GitHub allows 60
 * requests/hour per IP, so responses are cached for the session.
 */
export default function Projects() {
  const [state, setState] = useState<FetchState>(() => {
    const cached = readCachedRepos();
    return cached ? { status: "ready", repos: cached } : { status: "loading" };
  });

  useEffect(() => {
    if (state.status === "ready") return;

    let cancelled = false;

    fetch(
      `https://api.github.com/users/${githubHandle}/repos?sort=pushed&direction=desc&per_page=${PER_PAGE}`,
    )
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub responded ${response.status}`);
        return response.json() as Promise<Repo[]>;
      })
      .then((data) => {
        if (cancelled) return;
        const repos = data
          .filter((repo) => !repo.fork && repo.name.toLowerCase() !== githubHandle.toLowerCase())
          .slice(0, MAX_REPOS);
        writeCachedRepos(repos);
        setState({ status: "ready", repos });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="projects" className="section relative">
      <LayeredWaves className="absolute inset-x-0 top-0 h-24 opacity-50" />

      <div className="shell relative">
        <header className="mx-auto max-w-[42ch] text-center">
          <p className="eyebrow" style={{ color: "var(--pass)" }}>
            From GitHub
          </p>
          <h2 className="text-title mx-auto mt-3 max-w-[24ch] font-display font-semibold">
            Whatever's live on the repo right now.
          </h2>
          <p className="measure mx-auto mt-4 text-sm text-muted">
            Pulled straight from{" "}
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-line-strong underline-offset-4 hover:text-ink"
            >
              github.com/{githubHandle}
            </a>{" "}
            — this list changes as the repos do.
          </p>
        </header>

        {state.status === "error" ? (
          <div className="mt-12">
            <ProjectsMessage />
          </div>
        ) : null}
      </div>

      {/* Full-bleed, outside the shell, so cards drift in from the page edges. */}
      <div className="relative mt-12">
        {state.status === "loading" ? <ProjectsSkeleton /> : null}
        {state.status === "ready" ? <ProjectsMarquee repos={state.repos} /> : null}
      </div>
    </section>
  );
}

/** Enough cards per loop that one copy is wider than a large screen, so the seam never shows. */
const MIN_CARDS_PER_LOOP = 6;
/** Pixels per second — slow enough to read a card as it drifts past. */
const SCROLL_SPEED = 30;
/** Card width plus its right padding at sm and up (20rem + 1rem). Narrower cards on phones just drift a touch slower. */
const CARD_STRIDE = 336;

const CARD_WIDTH = "w-[18rem] flex-none pr-4 sm:w-[20rem]";

/** Fades the row out at both edges instead of cutting cards off hard. */
const EDGE_FADE =
  "[mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]";

/**
 * A slow, endless horizontal drift. The list is repeated and doubled so the
 * `ticker` keyframes (translateX 0 → -50%) loop without a visible jump; only
 * the first copy is exposed to assistive tech and the tab order. Pauses on
 * hover, on keyboard focus, and while off-screen. Reduced motion gets a still,
 * swipeable row instead.
 */
function ProjectsMarquee({ repos }: { repos: Repo[] }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { ref, isOnScreen } = useOnScreen<HTMLDivElement>();

  if (repos.length === 0) {
    return (
      <div className="shell">
        <ProjectsMessage />
      </div>
    );
  }

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className="shell">
        <ul className="flex snap-x overflow-x-auto pb-4">
          {repos.map((repo) => (
            <li key={repo.id} className={cn(CARD_WIDTH, "snap-start")}>
              <RepoCard repo={repo} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const repeats = Math.ceil(MIN_CARDS_PER_LOOP / repos.length);
  const loop = Array.from({ length: repeats }, () => repos).flat();
  const track = [...loop, ...loop];
  const duration = (loop.length * CARD_STRIDE) / SCROLL_SPEED;

  return (
    <div ref={ref} className={cn("group overflow-hidden py-2", EDGE_FADE)}>
      <ul
        className={cn(
          "flex w-max will-change-transform animate-[ticker_60s_linear_infinite]",
          "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
          !isOnScreen && "[animation-play-state:paused]",
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        {track.map((repo, index) => {
          const isCopy = index >= repos.length;
          return (
            <li key={`${repo.id}-${index}`} className={CARD_WIDTH} aria-hidden={isCopy || undefined}>
              <RepoCard repo={repo} isCopy={isCopy} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RepoCard({ repo, isCopy = false }: { repo: Repo; isCopy?: boolean }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      tabIndex={isCopy ? -1 : undefined}
      className="card group/card flex h-full flex-col gap-4 p-6 transition-colors hover:border-line-strong"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
          {repo.language ?? "misc"}
        </span>
        {repo.stargazers_count > 0 ? (
          <span className="font-mono text-[0.6875rem] text-faint">★ {repo.stargazers_count}</span>
        ) : null}
      </div>

      <h3 className="font-display text-lg font-semibold capitalize leading-snug tracking-tight">
        {formatRepoName(repo.name)}
      </h3>

      <p className="line-clamp-3 text-sm leading-relaxed text-muted">
        {repo.description ?? "No description yet."}
      </p>

      <div className="mt-auto flex items-end justify-between gap-4 pt-2">
        <span className="font-mono text-xs text-faint">Updated {formatDate(repo.pushed_at)}</span>
        <span className="font-mono text-[0.6875rem] text-faint transition-colors group-hover/card:text-ink">
          open ↗
        </span>
      </div>
    </a>
  );
}

function ProjectsSkeleton() {
  return (
    <div className={cn("flex overflow-hidden", EDGE_FADE)}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={CARD_WIDTH}>
          <div className="card h-44 animate-pulse p-6">
          <div className="h-3 w-16 rounded-full bg-sunk" />
          <div className="mt-5 h-4 w-2/3 rounded-full bg-sunk" />
          <div className="mt-3 h-3 w-full rounded-full bg-sunk" />
          <div className="mt-2 h-3 w-4/5 rounded-full bg-sunk" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsMessage() {
  return (
    <p className="text-sm text-muted">
      Couldn't load repositories just now.{" "}
      <a
        href={profile.github}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-line-strong underline-offset-4 hover:text-ink"
      >
        View the profile directly
      </a>
      .
    </p>
  );
}
