import type { TimeSnapshot } from './stage';

/** A tiny store so only the parts that show time re-render every frame. */
export interface TimeStore {
  subscribe: (fn: () => void) => () => void;
  get: () => TimeSnapshot;
  set: (s: TimeSnapshot) => void;
}

export function createTimeStore(): TimeStore {
  let snap: TimeSnapshot = { t: 0, end: 1, playing: true, lands: true, grounded: false };
  const subs = new Set<() => void>();
  return {
    subscribe: (fn) => {
      subs.add(fn);
      return () => {
        subs.delete(fn);
      };
    },
    get: () => snap,
    set: (s) => {
      snap = s;
      for (const fn of subs) fn();
    },
  };
}
