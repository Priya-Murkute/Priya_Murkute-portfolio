import { useEffect, useState } from "react";
import { githubHandle, profile } from "@/data/resume";
import { InView } from "@/components/motion-primitives/in-view";
import { LayeredWaves } from "@/components/Backgrounds";

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

        <div className="mt-12">
          {state.status === "loading" ? <ProjectsSkeleton /> : null}
          {state.status === "error" ? <ProjectsMessage /> : null}
          {state.status === "ready" ? <ProjectsGrid repos={state.repos} /> : null}
        </div>
      </div>
    </section>
  );
}

function ProjectsGrid({ repos }: { repos: Repo[] }) {
  if (repos.length === 0) return <ProjectsMessage />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo, index) => (
        <InView
          key={repo.id}
          once
          viewOptions={{ margin: "-10% 0px" }}
          variants={{
            hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.6, delay: Math.min(index, 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="card group flex h-full flex-col gap-4 p-6 transition-colors hover:border-line-strong"
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

            <p className="text-sm leading-relaxed text-muted">{repo.description ?? "No description yet."}</p>

            <div className="mt-auto flex items-end justify-between gap-4 pt-2">
              <span className="font-mono text-xs text-faint">Updated {formatDate(repo.pushed_at)}</span>
              <span className="font-mono text-[0.6875rem] text-faint transition-colors group-hover:text-ink">
                open ↗
              </span>
            </div>
          </a>
        </InView>
      ))}
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="card h-44 animate-pulse p-6">
          <div className="h-3 w-16 rounded-full bg-sunk" />
          <div className="mt-5 h-4 w-2/3 rounded-full bg-sunk" />
          <div className="mt-3 h-3 w-full rounded-full bg-sunk" />
          <div className="mt-2 h-3 w-4/5 rounded-full bg-sunk" />
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
