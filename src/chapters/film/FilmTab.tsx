import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { canRenderVideo, download, renderVideo } from '../../film/export';
import { resetMathCache } from '../../film/math';
import { toScript, toSrt } from '../../film/timeline';
import { clock } from '../../ui/clock';
import { Icon } from '../../ui/Icons';
import { VH, VW, type ChapterFilm } from './engine';

const RATES = [1, 1.25, 1.5, 0.75];

/** Plays a chapter's film like a video: chapters, narration, captions and export to 1080p. */
export function FilmTab({ cf, id, active }: { cf: ChapterFilm; id: string; active: boolean }) {
  const { film, spec } = cf;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const tRef = useRef(0);
  const [T, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [rate, setRate] = useState(1);
  const playRef = useRef(false);
  const rateRef = useRef(1);
  const capRef = useRef(true);
  playRef.current = playing;
  rateRef.current = rate;
  capRef.current = captions;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { alpha: false })!;
    let raf = 0;
    let last = performance.now();
    let shown = -1;
    let size = '';
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (playRef.current) {
        tRef.current = Math.min(film.duration, tRef.current + dt * rateRef.current);
        if (tRef.current >= film.duration) setPlaying(false);
        setT(tRef.current);
      }
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const key = `${w}x${h}@${dpr}`;
      if (key !== size) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        size = key;
        shown = -1;
      }
      const stamp = tRef.current + (capRef.current ? 0 : 1e6);
      if (stamp === shown) return;
      shown = stamp;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const k = Math.min(canvas.width / VW, canvas.height / VH);
      ctx.setTransform(k, 0, 0, k, (canvas.width - VW * k) / 2, (canvas.height - VH * k) / 2);
      cf.frame(ctx, tRef.current, { captions: capRef.current, safeBottom: 950 });
    };
    raf = requestAnimationFrame(draw);
    document.fonts?.ready.then(() => {
      resetMathCache();
      shown = -1;
    });
    return () => cancelAnimationFrame(raf);
  }, [cf, film]);

  useEffect(() => {
    if (!active) setPlaying(false);
  }, [active]);

  const seek = (t: number) => {
    tRef.current = Math.min(film.duration, Math.max(0, t));
    setT(tRef.current);
    setStarted(true);
  };
  const toggle = () => {
    if (!playing && tRef.current >= film.duration - 0.01) seek(0);
    setPlaying((p) => !p);
    setStarted(true);
  };

  useEffect(() => {
    if (!active) return;
    const on = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('input, select, textarea, button')) return;
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'ArrowRight') seek(tRef.current + 5);
      else if (e.key === 'ArrowLeft') seek(tRef.current - 5);
      else if (e.key === 'c') setCaptions((c) => !c);
      else if (e.key === 'f') boxRef.current?.requestFullscreen?.();
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  });

  const beat = film.beatAt(T);
  const chapter = film.chapters[beat.chapter];
  const lines = film.beats.filter((b) => b.chapter === beat.chapter && b.say);

  return (
    <main className="layout" role="tabpanel" aria-label="Film" hidden={!active}>
      <aside className="panel" aria-label="Chapters and narration">
        <div className="panel-scroll">
          <h1 className="title">{spec.title}</h1>
          <p className="lead">{spec.subtitle} A short narrated film; the notes go deeper.</p>
          <ol className="chapters">
            {film.chapters.map((c) => {
              const p = Math.min(1, Math.max(0, (T - c.start) / (c.end - c.start)));
              return (
                <li key={c.index}>
                  <button className={c.index === beat.chapter ? 'chapter is-current' : 'chapter'} onClick={() => seek(c.start)}>
                    <span className="chapter-n">{String(c.index + 1).padStart(2, '0')}</span>
                    <span className="chapter-name">{c.title}</span>
                    <span className="chapter-t">{clock(c.start)}</span>
                    <span className="chapter-bar" style={{ '--p': p } as CSSProperties} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="transcript-head">
            <span>{chapter?.title}</span>
            <span className="transcript-sub">Narration</span>
          </div>
          <ol className="transcript" aria-label="Narration">
            {lines.map((b) => (
              <li key={b.index}>
                <button className={b.index === beat.index ? 'line is-now' : b.index < beat.index ? 'line is-past' : 'line'} onClick={() => seek(b.start)}>
                  <span className="line-t">{clock(b.start)}</span>
                  <span className="line-text">{b.say}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="panel-foot">
          <Export cf={cf} id={id} />
        </div>
      </aside>
      <section className="film-col">
        <div ref={boxRef} className={`stage-box${started ? '' : ' is-fresh'}`}>
          <canvas ref={canvasRef} className="stage" role="img" aria-label={`The film: ${spec.title}. Click to play or pause.`} onClick={toggle} />
          {!started && !playing && (
            <button className="big-play" onClick={toggle} aria-label="Play the film">
              <span className="big-play-icon">
                <Icon name="play" size={30} />
              </span>
              <span className="big-play-text">
                Play the film <span className="big-play-len">{clock(film.duration)}</span>
              </span>
            </button>
          )}
          <div className="controls">
            <button className="ctl ctl-play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
              <Icon name={playing ? 'pause' : 'play'} size={18} />
            </button>
            <div className="scrub-bar">
              <span className="t-now">{clock(T)}</span>
              <div className="track">
                {film.chapters.slice(1).map((c) => (
                  <span key={c.index} className="mark" style={{ left: `${(c.start / film.duration) * 100}%` }} />
                ))}
                <input
                  className="seek"
                  type="range"
                  min={0}
                  max={film.duration}
                  step="any"
                  value={T}
                  aria-label="Position in the film"
                  aria-valuetext={`${clock(T)} of ${clock(film.duration)}`}
                  style={{ '--fill': `${(T / film.duration) * 100}%` } as CSSProperties}
                  onChange={(e) => seek(Number(e.target.value))}
                />
              </div>
              <span className="t-end">{clock(film.duration)}</span>
            </div>
            <button className="ctl ctl-text" aria-pressed={captions} onClick={() => setCaptions((c) => !c)} aria-label="Captions" title="Captions (c)">
              CC
            </button>
            <button className="ctl ctl-text" onClick={() => setRate((r) => RATES[(RATES.indexOf(r) + 1) % RATES.length])} aria-label={`Speed ${rate} times. Change.`} title="Speed">
              {rate}×
            </button>
            <button className="ctl" onClick={() => boxRef.current?.requestFullscreen?.()} aria-label="Full screen" title="Full screen (f)">
              <Icon name="expand" size={18} />
            </button>
          </div>
        </div>
        <div className="film-meta">
          <span className="film-chapter">
            <span className="film-n">{String(beat.chapter + 1).padStart(2, '0')}</span>
            {chapter?.title}
          </span>
          <span className="film-meta-right">
            <span className="keys" aria-label="Keyboard shortcuts">
              <kbd>Space</kbd> play <kbd>←</kbd>
              <kbd>→</kbd> skip <kbd>C</kbd> captions <kbd>F</kbd> full screen
            </span>
          </span>
        </div>
      </section>
    </main>
  );
}

function Export({ cf, id }: { cf: ChapterFilm; id: string }) {
  const [open, setOpen] = useState(false);
  const [fps, setFps] = useState(30);
  const [burn, setBurn] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState('');
  const abort = useRef<AbortController | null>(null);
  const supported = canRenderVideo();
  const run = async () => {
    setError('');
    abort.current = new AbortController();
    setProgress({ done: 0, total: 1 });
    try {
      const res = await renderVideo(
        cf.film.duration,
        (ctx, T) => {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          const k = Math.min(ctx.canvas.width / VW, ctx.canvas.height / VH);
          ctx.setTransform(k, 0, 0, k, 0, 0);
          cf.frame(ctx, T, { captions: burn });
        },
        { width: 1920, height: 1080, fps, signal: abort.current.signal, onProgress: (done, total) => setProgress({ done, total }) },
      );
      download(res.blob, `${id}.${res.extension}`);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError((e as Error).message);
    }
    setProgress(null);
  };
  return (
    <div className="export">
      <button className="export-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>Make the video</span>
        <span className="export-sub">1080p for YouTube, plus subtitles and a voiceover script</span>
      </button>
      {open && (
        <div className="export-body">
          <div className="export-row" role="group" aria-label="Frame rate">
            {[30, 60].map((f) => (
              <button key={f} className="preset" aria-pressed={fps === f} onClick={() => setFps(f)}>
                {f} fps
              </button>
            ))}
            <label className="check">
              <input type="checkbox" checked={burn} onChange={(e) => setBurn(e.target.checked)} />
              <span className="check-box" aria-hidden="true" />
              Burn in captions
            </label>
          </div>
          {progress ? (
            <div className="progress">
              <div className="progress-bar" style={{ '--p': progress.done / progress.total } as CSSProperties} />
              <span className="progress-text">
                Frame {progress.done} of {progress.total}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={() => abort.current?.abort()}>
                Cancel
              </button>
            </div>
          ) : (
            <div className="export-row">
              <button className="btn btn-primary" onClick={run} disabled={!supported}>
                Render video
              </button>
              <button className="btn btn-outline" onClick={() => download(toSrt(cf.film), `${id}.srt`, 'application/x-subrip')}>
                Subtitles
              </button>
              <button className="btn btn-outline" onClick={() => download(toScript(cf.film, cf.spec.title), `${id}-voiceover.txt`)}>
                Script
              </button>
            </div>
          )}
          {error && <p className="export-note">{error}</p>}
          {!supported && <p className="export-note">This browser cannot encode video. Try a recent Chrome, Edge or Safari.</p>}
        </div>
      )}
    </div>
  );
}
