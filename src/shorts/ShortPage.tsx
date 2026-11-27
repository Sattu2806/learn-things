import { useEffect, useRef, useState } from 'react';
import { renderVideo, download } from '../film/export';
import { Topbar } from '../chapters/Topbar';
import { SHORTS, SHORT_SIZE, shortFromHash } from './index';

/**
 * Shorts: quick visual proofs under a minute, made for vertical video.
 * The page loops the chosen short (#/shorts/<id>); window.__short lets the
 * render script export any of them.
 */
export default function ShortPage() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [id, setId] = useState(() => shortFromHash().id);
  useEffect(() => {
    const on = () => setId(shortFromHash().id);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const short = SHORTS.find((s) => s.id === id) ?? SHORTS[0];

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      short.draw(ctx, ((now - t0) / 1000) % short.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    (window as unknown as { __short: unknown }).__short = {
      ready: true,
      id: short.id,
      duration: short.duration,
      lines: short.lines,
      async renderVideo(o: { id?: string; fps?: number } = {}) {
        const s = SHORTS.find((x) => x.id === o.id) ?? short;
        const res = await renderVideo(s.duration, s.draw, { ...SHORT_SIZE, fps: o.fps ?? 30 });
        download(res.blob, `${s.file}.${res.extension}`);
        return { id: s.id, duration: s.duration, codec: res.codec, frames: res.frames, extension: res.extension };
      },
    };
    return () => cancelAnimationFrame(raf);
  }, [short]);

  return (
    <div className="app">
      <Topbar chapter="shorts" />
      <main className="short-page">
        <div className="short-picker" role="tablist" aria-label="Choose a short">
          {SHORTS.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={s.id === id}
              className={`short-btn${s.id === id ? ' is-on' : ''}`}
              style={{ ['--i' as string]: i }}
              onClick={() => {
                window.location.hash = `#/shorts/${s.id}`;
              }}
            >
              {s.title}
            </button>
          ))}
        </div>
        <canvas ref={ref} width={SHORT_SIZE.width} height={SHORT_SIZE.height} className="short-canvas" aria-label={`Short video: ${short.title}`} />
      </main>
    </div>
  );
}
