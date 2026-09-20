import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { githubHandle, profile } from "@/data/resume";
import { LayeredWaves } from "@/components/Backgrounds";
import Quoted from "@/components/Quoted";
import { ExternalLink } from "@/components/ExternalLink";
import { readStorage, writeStorage } from "@/lib/storage";
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

/** A card links out to its repo, so the link must really be a github.com one, whatever the data claims. */
function isGithubUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "github.com";
  } catch {
    return false;
  }
}

/**
 * True only for an entry with every field the cards use, of the right type, and
 * a github.com link. The list comes from the network and, on a later visit,
 * from session storage: neither is trusted to be what it was when we wrote it.
 */
function isRepo(value: unknown): value is Repo {
  if (typeof value !== "object" || value === null) return false;
  const repo = value as Record<string, unknown>;
  return (
    typeof repo.id === "number" &&
    typeof repo.name === "string" &&
    (repo.description === null || typeof repo.description === "string") &&
    typeof repo.html_url === "string" &&
    isGithubUrl(repo.html_url) &&
    (repo.language === null || typeof repo.language === "string") &&
    typeof repo.stargazers_count === "number" &&
    typeof repo.pushed_at === "string" &&
    typeof repo.fork === "boolean"
  );
}

/** The valid repos in a list of unknown things, or null if it isn't a list at all. */
function parseRepos(value: unknown): Repo[] | null {
  return Array.isArray(value) ? value.filter(isRepo) : null;
}

/**
 * What an earlier visit left in session storage, if it's still fresh and intact.
 * Every entry was valid when it was written, so if any now isn't, the cache has
 * been altered or corrupted: throw all of it away and fetch again, rather than
 * serve what's left.
 */
function readCachedRepos(): Repo[] | null {
  const raw = readStorage("session", CACHE_KEY);
  if (!raw) return null;
  try {
    const cached = JSON.parse(raw) as { at?: unknown; repos?: unknown };
    if (typeof cached.at !== "number" || Date.now() - cached.at > CACHE_TTL_MS) return null;
    const repos = parseRepos(cached.repos);
    return repos && repos.length === (cached.repos as unknown[]).length ? repos : null;
  } catch {
    return null;
  }
}

function writeCachedRepos(repos: Repo[]) {
  writeStorage("session", CACHE_KEY, JSON.stringify({ at: Date.now(), repos }));
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
        return response.json() as Promise<unknown>;
      })
      .then((data) => {
        if (cancelled) return;
        const valid = parseRepos(data);
        if (!valid) throw new Error("GitHub sent something other than a list of repositories");
        const repos = valid
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
          <p className="eyebrow eyebrow-section" style={{ color: "var(--pass)" }}>
            From GitHub
          </p>
          <h2 className="quote-text mx-auto mt-3 max-w-[24ch]">
            <Quoted>
              Whatever’s live on the repo <em>right now.</em>
            </Quoted>
          </h2>
          <p className="measure mx-auto mt-4 text-sm text-muted">
            Pulled straight from{" "}
            <ExternalLink href={profile.github} underlined>
              github.com/{githubHandle}
            </ExternalLink>{" "}
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
    <ExternalLink
      href={repo.html_url}
      tabIndex={isCopy ? -1 : undefined}
      className="card group/card flex h-full flex-col gap-4 p-6 transition-colors hover:border-line-strong"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="mono-label text-muted">{repo.language ?? "misc"}</span>
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
    </ExternalLink>
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
      <ExternalLink href={profile.github} underlined>
        View the profile directly
      </ExternalLink>
      .
    </p>
  );
}
