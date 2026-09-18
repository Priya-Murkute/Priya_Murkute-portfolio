# Priya Murkute — Portfolio

## Live site

https://priya-murkute-portfolio.vercel.app

> The same URL is written into `index.html` (canonical, Open Graph, JSON-LD),
> `public/robots.txt` and `public/sitemap.xml`. If the Vercel project ends up
> on a different subdomain, change it in those three files — a wrong absolute
> URL means the social preview image silently fails to load.

A personal QA portfolio. Calm, near-white, typographic: soft Haikei-style
gradient and wave SVGs behind the content, one green accent borrowed from a
passing test, and motion that's there to orient you rather than to perform.

Built with Vite, React, TypeScript, Tailwind CSS v4, and Motion.

## Run it locally

```bash
npm install
npm run dev
```

Open the local URL it prints (usually http://localhost:5173).

```bash
npm run lint        # ESLint: hook rules + jsx-a11y
npm run typecheck   # tsc -b --force, no emit beyond build info
npm run build       # static dist/, deployable anywhere
npm test            # Playwright, against the production build
```

Three generator scripts produce committed artefacts. None of them run during
`npm run build` — run them by hand when their inputs change:

```bash
npm run cv          # public/Priya-Murkute-CV.pdf, from src/data/resume.ts
npm run cv -- --preview   # ...and a cv-preview.png to actually look at
npm run og          # public/og-image.png, the social preview card
npm run images      # converts new gallery photos to width-capped WebP
```

## Testing

`tests/` holds a Playwright suite that runs against the real production
build (`playwright.config.ts` builds and serves it), across Chromium, a Pixel
5 viewport and WebKit. It covers the things most likely to break silently:

- **theme** — persists across reloads and routes, and is applied *before first
  paint* (the test blocks the JS bundle entirely and still expects `.dark`,
  which is what stops a white flash for dark-mode visitors).
- **navigation** — every section anchor is built from the deploy base path, so
  the GitHub Pages subpath can't be broken by writing a bare `/#work`. Also
  covers the mobile drawer, the 404 route and the CV download resolving.
- **work dialog** — Escape, the close button, focus trap, focus return to the
  trigger, and `inert` on the page behind it.
- **github feed** — renders, filters forks, degrades to a profile link when
  rate-limited, and answers a second visit from the session cache.

On Windows, WebKit crashes its worker at full concurrency, so the config caps
workers at 2 there. CI (Linux) is unaffected.

`.github/workflows/ci.yml` runs lint, typecheck, build and the full suite on
every push and PR.

## Deploy

The build output is a static `dist/` folder, deployable anywhere. Two options
are wired up:

**Vercel (recommended — zero config)**
1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: Vite. Leave build/output settings at their defaults
   (`npm run build`, `dist`).
3. `vercel.json` at the repo root handles the SPA rewrite so client-side
   routes like `/about-me` and `/off-hours` don't 404 on a hard reload or
   direct link.
4. Every push to the connected branch deploys automatically — no workflow
   file needed.

**GitHub Pages**
1. In the repo's Settings → Pages, set Source to "GitHub Actions".
2. Push to `main` (or run the workflow manually from the Actions tab) —
   `.github/workflows/deploy.yml` builds with `GITHUB_PAGES=true` and
   publishes `dist/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`.
3. `vite.config.ts` reads that same env var to set `base: "/priya-portfolio/"`
   (root `/` otherwise), and `main.tsx` passes it to the router as `basename`
   so routes resolve under the `/priya-portfolio/` subpath GitHub Pages
   serves from. The workflow also copies `index.html` to `404.html` so a
   direct load of a route like `/off-hours` boots the app instead of 404ing.

Use Vercel unless you specifically want the site on `github.io` — it needs no
subpath handling and deploys are simpler to reason about.

### Security headers

`vercel.json` sends a `Content-Security-Policy`, `X-Frame-Options: DENY`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy` and a `Permissions-Policy`
on every route — Vercel only; GitHub Pages has no mechanism for custom
response headers, so that deploy target ships without them regardless.

The CSP allows exactly one inline script by SHA-256 hash — the
before-first-paint theme script in `index.html` — rather than the much
weaker `'unsafe-inline'`. **If you edit that script, the hash goes stale and
the CSP silently blocks it in production**, which reintroduces the dark-mode
white-flash bug with no visible error. Recompute it with:

```bash
node -e 'const c=require("fs").readFileSync("index.html","utf8").match(/<script(?![^>]*type=)[^>]*>([\s\S]*?)<\/script>/)[1];console.log("sha256-"+require("crypto").createHash("sha256").update(c,"utf8").digest("base64"))'
```

and paste the result into `vercel.json`'s `script-src` directive.

## Where the content lives

`src/data/resume.ts` is the single source of truth. Every word on the page
comes from it — headline metrics, the work entries and their dialog copy, the
three roles, education, skill groups, contact details — and so does the
generated CV. Edit that file; don't edit the components.

Counts and handles are derived, never retyped: the Work heading counts its own
entries, `githubHandle`/`linkedinHandle` are parsed off the profile URLs (the
GitHub API call uses the same value), and `yearsExperience` feeds the
SpecSuite footer. Adding a seventh work item updates the heading by itself.

The types it satisfies are in `src/types.ts`. Two of them are worth knowing
about:

- `Signal` (`pass` / `flaky` / `fail`) only ever chooses a colour.
- `WorkStatus` (`measured` / `ongoing`) labels the work. It's deliberately a
  separate type — "flaky" is not a word to attach to a tester's own work.

## Project structure

```
src/
├── main.tsx
├── App.tsx                    # routing, preloader gate, page error boundary
├── styles.css                 # the whole design system (see below)
├── types.ts
├── context/
│   └── ThemeContext.tsx       # theme state + localStorage; index.html's inline
│                              # script does the before-first-paint part
├── lib/
│   ├── utils.ts               # cn() = twMerge(clsx(...))
│   ├── links.ts               # sectionHref/publicHref — base-path-aware URLs
│   ├── gallery.ts             # shared filename grammar for both galleries
│   ├── cherryBlossom.ts       # one sakura gradient + a seeded PRNG
│   └── useOnScreen.ts         # pauses ambient animation off-screen
├── data/
│   ├── resume.ts              # all résumé content
│   ├── offHours.ts            # About Me content
│   ├── artGallery.ts          # auto-discovers src/assets/art/
│   ├── interestsGallery.ts    # auto-discovers src/assets/interests/
│   └── galleryPlaceholders.ts # fallback gradients while those folders are empty
├── pages/                     # AboutMe (also served at /off-hours), NotFound
└── components/
    ├── NavBar.tsx             # border appears past 24px, scroll progress, theme switch
    ├── Hero.tsx               # headline + SpecSuite
    ├── SpecSuite.tsx          # achievements as a passing test run
    ├── Work.tsx               # cards, each opening a morphing dialog
    ├── Projects.tsx           # live GitHub feed, session-cached
    ├── HeroScene.tsx          # gates the lazy 3D scene on idle + visibility
    ├── HeroSceneBackdrop.tsx, HeroSceneCanvas.tsx  # the r3f canvas itself
    ├── ErrorBoundary.tsx      # page-level fallback; also wraps the 3D scene
    ├── Preloader.tsx          # "running the suite before you arrive"; once per session
    ├── CursorGlow.tsx         # cursor-trailing glow, fine-pointer only
    ├── Backgrounds.tsx        # BlurryGradient, LayeredWaves, StackedWaves
    ├── PetalScatter.tsx       # ambient petals, paused off-screen
    ├── AboutMeLink.tsx        # Hero's link into /about-me
    ├── PullQuote.tsx          # the full-bleed editorial line between sections
    ├── MobileNav.tsx          # the small-viewport nav drawer
    ├── About.tsx, Stats.tsx, Experience.tsx, Volunteering.tsx,
    │   Skills.tsx, Certifications.tsx, Contact.tsx, Footer.tsx
    │                          # one straightforward renderer per résumé section
    ├── off-hours/             # Carousel3D, MyInterests
    └── motion-primitives/     # local copies, APIs matching motion-primitives.com

scripts/                       # generators for the committed artefacts
tests/                         # Playwright specs
```

### The CV

`public/Priya-Murkute-CV.pdf` is what the Download CV button serves, and it is
**generated from `src/data/resume.ts`** by `npm run cv` — Playwright's Chromium
prints an HTML template styled with the site's own type. Edit `resume.ts`, run
`npm run cv`, commit the PDF.

It used to be a hand-made file, and it had drifted badly: different headline
metrics from the site, one merged Wipro role instead of the two real ones, and
the MSc dated 2024 rather than 2023. Generating it removes that whole class of
problem — the CV cannot disagree with the site about a fact, because there is
only one copy of each fact.

## The design system

`src/styles.css` is ordered deliberately, and the order matters:

1. `@import "tailwindcss"`
2. `@custom-variant dark (&:where(.dark, .dark *))` — theme is class-driven
3. `:root` tokens, then `.dark` overrides of the same names
4. `@theme inline` maps Tailwind utilities onto those live variables, so
   `text-muted` or `bg-surface` is correct in both themes with no `dark:` twin
5. `@layer base`, then `@layer components`
6. a `prefers-reduced-motion` block

Two conventions keep specificity from becoming a problem: `.shell` is the only
rule that sets horizontal padding, and `.section` is the only rule that sets
vertical section rhythm. Because Tailwind's utilities layer wins over the
components layer, a one-off `pt-32` on a section still works.

## motion-primitives

`src/components/motion-primitives/` holds local copies of TextEffect, InView,
AnimatedGroup, Spotlight, Magnetic, AnimatedNumber, ScrollProgress and
MorphingDialog. The prop APIs match the upstream site, and
the three things upstream code expects are all in place — `motion/react`, a
`cn()` at `@/lib/utils`, and the `@/*` alias in both `tsconfig.json` and
`vite.config.ts` — so a component pasted from motion-primitives.com should
work without edits.

Local deviations, each for a stated reason: `Spotlight` takes an explicit
`color` prop instead of relying on Tailwind's gradient custom properties, and
the polymorphic `as` props accept a short list of tags rather than every
intrinsic element, because the full union is too wide for TS to resolve.
`Magnetic` caches its bounding rect instead of reading it inside the mousemove
handler — upstream forces a layout reflow on every mouse move, for the whole
page lifetime, before checking whether the cursor is anywhere near. And
`MorphingDialog` adds a real focus trap and `inert` on the app root.

Because that directory tracks upstream, `eslint.config.js` turns off the two
React-Compiler-era hook rules there — `motion.create(as)` inside a `useMemo` is
their documented pattern for polymorphic components. The accessibility rules
still apply, and they caught a genuine dialog bug.

## Accessibility

Skip link, visible `:focus-visible` outlines, `aria-hidden` on all decorative
SVG, and screen-reader copy behind the animated headline.

The Work dialog implements what a native `<dialog>` gives for free: Escape,
a focus trap, focus return to the trigger, and `inert` on the app root so a
screen reader can't wander the page underneath it. All five are covered by
`tests/work-dialog.spec.ts`.

`prefers-reduced-motion` is honoured in CSS and in `SpecSuite` (which jumps
straight to its finished state), and ambient animation — the 3D petals, the
petal scatter — stops entirely when its section scrolls out of view.

Text colours meet WCAG AA. `--ink-faint` in particular carries a lot of the
site's small type (every `.eyebrow`, the mono captions, the footer, timeline
locations); it previously measured ~2.6:1 on paper, well under the 4.5:1 that
size needs, and is now 4.9:1 in light and 6.0:1 in dark.

The theme switch reports state as text (`light` / `dark`) rather than a sun or
moon glyph. State lives in `ThemeContext` (`src/context/ThemeContext.tsx`) and
persists to `localStorage` under `pm-theme`. A small inline script in
`index.html` applies it **before first paint** — `ThemeProvider` alone can only
act after React mounts, which is after the browser has already painted a light
page, so dark-mode visitors saw a white flash on every load. The storage key
is duplicated between those two files by necessity; keep them in step.
