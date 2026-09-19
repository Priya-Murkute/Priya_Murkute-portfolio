/**
 * Browser storage that never throws. Private windows, blocked cookies and
 * embedded previews can all make `localStorage` / `sessionStorage` throw on
 * access, and none of what this site stores (theme, "already seen the
 * preloader", the GitHub cache) is worth failing over. Reads then find nothing
 * and writes do nothing.
 *
 * (index.html's pre-paint theme script has to do its own read: it runs before
 * any module loads.)
 */
type Area = "local" | "session";

const area = (kind: Area) => (kind === "local" ? localStorage : sessionStorage);

/** The stored string, or null if there is none or storage is unavailable. */
export function readStorage(kind: Area, key: string): string | null {
  try {
    return area(kind).getItem(key);
  } catch {
    return null;
  }
}

/** Stores a string, or quietly does nothing if storage is unavailable. */
export function writeStorage(kind: Area, key: string, value: string): void {
  try {
    area(kind).setItem(key, value);
  } catch {
    // unavailable: whatever this was remembering will just be worked out again
  }
}
