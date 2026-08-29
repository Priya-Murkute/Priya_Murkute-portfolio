# Priya Murkute — Portfolio (Flower Garden Theme)

A personal resume portfolio built as a blooming flower garden. Every
achievement from the résumé is presented as a flower that blooms into
view as you scroll, using React, TypeScript, and Framer Motion.

## Run it locally

```bash
npm install
npm run dev
```

Open the local URL it prints (usually http://localhost:5173).

## Build for deployment

```bash
npm run build
```

Outputs a static `dist/` folder deployable to Vercel, Netlify, GitHub
Pages, or anywhere that serves static files.

## Project structure

```
priya-portfolio/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles.css
    ├── types.ts
    ├── data/
    │   └── resume.ts        # all résumé content lives here
    └── components/
        ├── NavBar.tsx
        ├── Hero.tsx
        ├── About.tsx
        ├── Flower.tsx        # the reusable animated bloom
        ├── ProjectFlowerCard.tsx
        ├── Garden.tsx        # achievements-as-flowers grid
        ├── Experience.tsx    # timeline
        ├── Skills.tsx
        ├── Contact.tsx
        └── Footer.tsx
```

## What's real vs. what to double-check

- **All résumé content** (name, contact details, both roles, education,
  skills) is taken directly from the uploaded résumé PDF and lives in
  `src/data/resume.ts` — edit that one file to update anything.
- **The six "flowers" in the Garden section** are the standout,
  metric-backed achievements from the résumé bullets (framework build,
  API coverage, defect reduction, etc.) — not separate named projects,
  since the résumé itself doesn't list discrete side projects. If there
  are actual named projects (a GitHub repo, a personal tool, a case
  study) worth adding, add more entries to the `projects` array in
  `resume.ts` and they'll appear automatically with their own bloom
  animation.
- **No profile photo or downloadable PDF** is wired in — the résumé
  content is inline as text, not a PDF link. Ask if you'd like a
  "Download CV" button added once you have a PDF to link to.

## How the bloom animation works

`Flower.tsx` renders a ring of petal `<span>` elements plus a center
dot, animated with Framer Motion's `whileInView`. Each flower starts
fully closed (petals scaled to near-zero, invisible) and blooms open
with a staggered spring animation the first time it scrolls into the
viewport. This same component powers both the hero bouquet and every
project card in the Garden section — just pass in different colors.
