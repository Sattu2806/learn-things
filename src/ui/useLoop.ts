import { useEffect, useState } from 'react';

/** Whether the reader asked for less motion. */
export function usePrefersStill() {
  const [still, setStill] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setStill(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return still;
}

/** A looping clock that only runs while the diagram is on screen. */
export function useLoop(ref: React.RefObject<Element | null>, period: number, still: boolean) {
  const [t, setT] = useState(still ? period : 0);
  useEffect(() => {
    if (still) {
      setT(period);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let start = 0;
    let visible = false;
    const tick = (now: number) => {
      if (!start) start = now - t * 1000;
      setT(((now - start) / 1000) % period);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) {
        visible = true;
        start = 0;
        raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // The loop restarts only when the diagram itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, period, still]);
  return t;
}

