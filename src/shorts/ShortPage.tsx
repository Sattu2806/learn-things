import { useEffect, useRef } from 'react';
import { renderVideo, download } from '../film/export';
import { Topbar } from '../chapters/Topbar';
import { DURATION, LINES, SH, SW, drawCircleShort } from './circle';

/**
 * Shorts: quick visual proofs under a minute, made for vertical video.
 * The page loops the short; window.__short lets the render script export it.
 */
export default function ShortPage() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      drawCircleShort(ctx, ((now - t0) / 1000) % DURATION);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    (window as unknown as { __short: unknown }).__short = {
      ready: true,
      duration: DURATION,
      lines: LINES,
      async renderVideo(o: { fps?: number } = {}) {
        const res = await renderVideo(DURATION, drawCircleShort, { width: SW, height: SH, fps: o.fps ?? 30 });
        download(res.blob, `circle-area-short.${res.extension}`);
        return { codec: res.codec, frames: res.frames, extension: res.extension };
      },
    };
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="app">
      <Topbar chapter="shorts" />
      <main className="short-page">
        <canvas ref={ref} width={SW} height={SH} className="short-canvas" aria-label="Short video: why the area of a circle is pi r squared" />
      </main>
    </div>
  );
}
