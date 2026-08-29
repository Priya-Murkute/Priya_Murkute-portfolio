# Priya Murkute — Portfolio

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
npm run typecheck   # tsc -b --force, no emit beyond build info
npm run build       # static dist/, deployable anywhere
```

## Where the content lives

`src/data/resume.ts` is the single source of truth. Every word on the page
comes from it — headline metrics, the six work entries and their dialog copy,
both roles, education, skill groups, contact details. Edit that file; don't
edit the components.

The types it satisfies are in `src/types.ts`. Two of them are worth knowing
about:

- `Signal` (`pass` / `flaky` / `fail`) only ever chooses a colour.
- `WorkStatus` (`measured` / `ongoing`) labels the work. It's deliberately a
  separate type — "flaky" is not a word to attach to a tester's own work.

## Project structure

```
src/
├── main.tsx
├── App.tsx                    # theme state, section order, grain overlay
├── styles.css                 # the whole design system (see below)
├── types.ts
├── lib/utils.ts               # cn() = twMerge(clsx(...))
├── data/resume.ts             # all content
└── components/
    ├── NavBar.tsx             # border appears past 24px, scroll progress, theme switch
    ├── Hero.tsx               # headline + SpecSuite
    ├── SpecSuite.tsx          # achievements as a passing test run
    ├── Stats.tsx
    ├── About.tsx
    ├── Work.tsx               # six cards, each opening a morphing dialog
    ├── Experience.tsx
    ├── Skills.tsx
    ├── Contact.tsx
    ├── Footer.tsx
    ├── Backgrounds.tsx        # BlurryGradient, LayeredWaves, StackedWaves
    └── motion-primitives/     # local copies, APIs matching motion-primitives.com
```

`public/Priya-Murkute-CV.pdf` is what the two Download CV buttons serve. It's
generated from the same facts as `resume.ts`; if you change a role or a metric
there, regenerate or hand-edit the PDF so the two don't drift.

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
AnimatedGroup, Spotlight, BorderTrail, Magnetic, AnimatedNumber,
ScrollProgress and MorphingDialog. The prop APIs match the upstream site, and
the three things upstream code expects are all in place — `motion/react`, a
`cn()` at `@/lib/utils`, and the `@/*` alias in both `tsconfig.json` and
`vite.config.ts` — so a component pasted from motion-primitives.com should
work without edits.

Two local deviations, both to satisfy `strict` TypeScript: `Spotlight` takes an
explicit `color` prop instead of relying on Tailwind's gradient custom
properties, and the polymorphic `as` props accept a short list of tags rather
than every intrinsic element, because the full union is too wide for TS to
resolve.

## Accessibility

Skip link, visible `:focus-visible` outlines, `aria-hidden` on all decorative
SVG, screen-reader copy behind the animated headline, a dialog that traps
Escape and returns focus to its trigger, and `prefers-reduced-motion` honoured
in CSS and in `SpecSuite` (which jumps straight to its finished state).

The theme switch reports state as text (`light` / `dark`) rather than a sun or
moon glyph, and it remembers nothing between visits — no browser storage, by
choice. Every reload starts light.
