/**
 * Section anchors have to be built from Vite's `base`, never written as a
 * bare "/#work".
 *
 * An origin-absolute href ignores `base` entirely: on the GitHub Pages
 * target — where the site is served from /priya-portfolio/ — "/#work"
 * resolves to https://<user>.github.io/#work, i.e. the account root rather
 * than this site. `import.meta.env.BASE_URL` is "/" on Vercel and
 * "/priya-portfolio/" on Pages (see vite.config.ts), and always ends in a
 * slash, so prefixing it is correct on both.
 */
export function sectionHref(id: string): string {
  return `${import.meta.env.BASE_URL}#${id}`;
}

/** A file served from public/ — same base-path reasoning as `sectionHref`. */
export function publicHref(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}
