/**
 * A one-way channel from the page to the hero's 3D scene: the hero name asks
 * for a petal at a screen point, and the canvas turns it into a real petal.
 * The canvas is a separate React root (and lazy-loaded), so this can't go
 * through props or context. Requests made while no scene is listening — no
 * WebGL, reduced motion, or not loaded yet — are simply dropped.
 */
export type PetalRelease = { clientX: number; clientY: number };

type Listener = (release: PetalRelease) => void;

const listeners = new Set<Listener>();
const readyWaiters = new Set<() => void>();

export function releasePetal(release: PetalRelease) {
  listeners.forEach((listener) => listener(release));
}

/** Called by the 3D scene. Returns the unsubscribe. */
export function onPetalRelease(listener: Listener): () => void {
  listeners.add(listener);
  readyWaiters.forEach((waiter) => waiter());
  readyWaiters.clear();
  return () => {
    listeners.delete(listener);
  };
}

/** Runs `callback` once a scene is listening — immediately if one already is. Returns a cancel. */
export function whenPetalSceneReady(callback: () => void): () => void {
  if (listeners.size > 0) {
    callback();
    return () => {};
  }
  readyWaiters.add(callback);
  return () => {
    readyWaiters.delete(callback);
  };
}
