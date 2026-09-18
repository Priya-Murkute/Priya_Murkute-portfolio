/**
 * Anchors must be built from Vite's `base`, never written as a bare "/#work" —
 * an origin-absolute href ignores it and breaks the GitHub Pages subpath.
 */
export function sectionHref(id: string): string {
  return `${import.meta.env.BASE_URL}#${id}`;
}

/** A file served from public/. */
export function publicHref(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}
