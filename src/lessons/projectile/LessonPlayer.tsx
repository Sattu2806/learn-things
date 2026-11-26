import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { canRenderVideo, download, renderVideo } from '../../film/export';
import { toScript, toSrt, type Beat, type Film } from '../../film/timeline';
import { Icon, Logo } from '../../ui/Icons';
import { Scrub } from '../../ui/Scrub';
import { TITLE, buildFilm } from './film';
import { flight, metres } from './model';
import { FilmPlayer, createStore, drawFilmFrame, type Mode, type PlayerState, type Store } from './player';

const RATES = [1, 1.25, 1.5, 0.75];
const PRESETS: [string, number][] = [
  ['Earth', 9.8],
  ['Moon', 1.6],
  ['Mars', 3.7],
];

function useStore<T>(s: Store<T>) {
  return useSyncExternalStore(s.subscribe, s.get, s.get);
}

function clock(t: number) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function useMedia(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener('change', on);
    on();
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

function withTransition(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (doc.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) doc.startViewTransition(() => flushSync(update));
  else update();
}

function Scrubber({ film, time, onSeek }: { film: Film; time: Store<number>; onSeek: (t: number) => void }) {
  const T = useStore(time);
  const pct = (T / film.duration) * 100;
  return (
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
          style={{ '--fill': `${pct}%` } as CSSProperties}
          onChange={(e) => onSeek(Number(e.target.value))}
        />
      </div>
      <span className="t-end">{clock(film.duration)}</span>
    </div>
  );
}

function Chapters({ film, time, chapter, onSeek }: { film: Film; time: Store<number>; chapter: number; onSeek: (t: number) => void }) {
  const T = useStore(time);
  return (
    <ol className="chapters">
      {film.chapters.map((c) => {
        const p = Math.min(1, Math.max(0, (T - c.start) / (c.end - c.start)));
        return (
          <li key={c.index}>
            <button className={c.index === chapter ? 'chapter is-current' : 'chapter'} onClick={() => onSeek(c.start)}>
              <span className="chapter-n">{String(c.index + 1).padStart(2, '0')}</span>
              <span className="chapter-name">{c.title}</span>
              <span className="chapter-t">{clock(c.start)}</span>
              <span className="chapter-bar" style={{ '--p': p } as CSSProperties} aria-hidden="true" />
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function Transcript({ film, beat, chapter, onSeek, follow }: { film: Film; beat: number; chapter: number; onSeek: (t: number) => void; follow: boolean }) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    if (!follow) return;
    const el = ref.current?.querySelector('.is-now');
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [beat, follow]);
  const lines = film.beats.filter((b) => b.chapter === chapter && b.say);
  return (
    <ol className="transcript" ref={ref} aria-label="Narration">
      {lines.map((b) => (
        <li key={b.index}>
          <button className={b.index === beat ? 'line is-now' : b.index < beat ? 'line is-past' : 'line'} onClick={() => onSeek(b.start)}>
            <span className="line-t">{clock(b.start)}</span>
            <span className="line-text">{b.say}</span>
            {b.pause && <span className="line-pause">Your turn: {b.pause.prompt}</span>}
          </button>
        </li>
      ))}
    </ol>
  );
}

function YourTurn({ player, beat }: { player: FilmPlayer; beat: Beat }) {
  const read = () => ({ v: player.value('v'), theta: player.value('theta'), g: player.value('g'), linear: player.value('linear') });
  const [vals, setVals] = useState(read);
  useEffect(() => {
    setVals(read());
    // Fresh values for each new moment.
  }, [beat]);
  const set = (k: keyof typeof vals, x: number) => {
    setVals((s) => ({ ...s, [k]: x }));
    player.setValue(k, x);
  };
  const c = beat.pause?.controls ?? [];
  const R = flight(vals.v, vals.theta, vals.g).R;
  return (
    <div className="turn" role="region" aria-label="Your turn">
      <div className="turn-head">
        <span className="turn-tag">Your turn</span>
        <p className="turn-prompt">{beat.pause?.prompt}</p>
      </div>
      <div className="turn-controls">
        {c.includes('v') && (
          <Scrub symbol={<i className="m-var">v</i>} name="Launch speed" value={vals.v} min={4} max={40} step={0.5} digits={1} unit="m/s" unitName="metres per second" onChange={(x) => set('v', x)} />
        )}
        {c.includes('theta') && (
          <Scrub symbol={<i className="m-var">θ</i>} name="Launch angle" value={vals.theta} min={5} max={85} step={1} unit="°" unitName="degrees" onChange={(x) => set('theta', x)} />
        )}
        {c.includes('g') && (
          <span className="g-group">
            <Scrub symbol={<i className="m-var">g</i>} name="Gravity" value={vals.g} min={0.5} max={25} step={0.1} digits={1} unit="m/s²" unitName="metres per second squared" onChange={(x) => set('g', x)} />
            {PRESETS.map(([n, val]) => (
              <button key={n} className="preset" aria-pressed={Math.abs(vals.g - val) < 1e-6} onClick={() => set('g', val)}>
                {n}
              </button>
            ))}
          </span>
        )}
        {c.includes('square') && (
          <span className="pair" role="group" aria-label="The drop term">
            <button className="pair-btn" aria-pressed={vals.linear < 0.5} onClick={() => set('linear', 0)}>
              ½<i className="m-var">gt</i>
              <sup>2</sup>
            </button>
            <button className="pair-btn" aria-pressed={vals.linear > 0.5} onClick={() => set('linear', 1)}>
              ½<i className="m-var">gt</i>
            </button>
          </span>
        )}
      </div>
      {c.length === 1 && c[0] === 'theta' && (
        <p className="turn-note">{Math.abs(vals.theta - 45) <= 1 ? `That is it: 45° goes farthest, ${metres(R)}.` : `Lands ${metres(R)} away.`}</p>
      )}
      <button className="btn btn-primary turn-go" onClick={() => player.continue()}>
        Continue <Icon name="next" size={15} />
      </button>
    </div>
  );
}

function ExportPanel({ film }: { film: Film }) {
  const [open, setOpen] = useState(false);
  const [fps, setFps] = useState(30);
  const [burn, setBurn] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [message, setMessage] = useState('');
  const abort = useRef<AbortController | null>(null);
  const supported = useMemo(canRenderVideo, []);

  const run = async () => {
    abort.current = new AbortController();
    setMessage('');
    setProgress({ done: 0, total: Math.round(film.duration * fps) });
    try {
      const res = await renderVideo(film.duration, (ctx, T) => drawFilmFrame(film, ctx, T, burn), {
        width: 1920,
        height: 1080,
        fps,
        signal: abort.current.signal,
        onProgress: (done, total) => {
          if (done % 10 === 0 || done === total) setProgress({ done, total });
        },
      });
      download(res.blob, `living-equations.${res.extension}`);
      setMessage(`Saved living-equations.${res.extension}: ${res.codec === 'avc' ? 'H.264' : res.codec.toUpperCase()}, 1920×1080, ${fps} fps.`);
    } catch (e) {
      const err = e as Error;
      setMessage(err.name === 'AbortError' ? 'Cancelled.' : `Could not render: ${err.message}`);
    } finally {
      setProgress(null);
      abort.current = null;
    }
  };

  return (
    <div className={open ? 'export is-open' : 'export'}>
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
              Captions in the picture
            </label>
          </div>
          {progress ? (
            <div className="progress">
              <div className="progress-bar" style={{ '--p': progress.done / progress.total } as CSSProperties} />
              <span className="progress-text">
                Rendering frame {progress.done.toLocaleString('en-US')} of {progress.total.toLocaleString('en-US')}
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
              <button className="btn btn-outline" onClick={() => download(toSrt(film), 'living-equations.srt', 'application/x-subrip')}>
                Subtitles
              </button>
              <button className="btn btn-outline" onClick={() => download(toScript(film, TITLE), 'living-equations-voiceover.txt')}>
                Script
              </button>
            </div>
          )}
          <p className="export-note">
            {message ||
              (supported
                ? 'Renders frame by frame in your browser, faster than real time. Embedded previews can block downloads: run the app locally, or use npm run render.'
                : 'This browser cannot encode video. Use a recent Chrome, Edge or Safari, or npm run render.')}
          </p>
        </div>
      )}
    </div>
  );
}

export default function LessonPlayer() {
  const film = useMemo(buildFilm, []);
  const stateStore = useMemo(() => createStore<PlayerState>({ playing: false, beat: 0, chapter: 0, waiting: null, ended: false }), []);
  const timeStore = useMemo(() => createStore(0), []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<FilmPlayer | null>(null);
  const st = useStore(stateStore);
  const [player, setPlayer] = useState<FilmPlayer | null>(null);
  const [mode, setMode] = useState<Mode>('lesson');
  const [captions, setCaptions] = useState(true);
  const [rate, setRate] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [idle, setIdle] = useState(false);
  const [started, setStarted] = useState(false);
  const narrow = useMedia('(max-width: 900px)');

  useEffect(() => {
    const p = new FilmPlayer(canvasRef.current!, film, stateStore, timeStore);
    playerRef.current = p;
    setPlayer(p);
    return () => {
      p.destroy();
      playerRef.current = null;
    };
  }, [film, stateStore, timeStore]);

  useEffect(() => playerRef.current?.setMode(mode), [mode, player]);
  useEffect(() => {
    if (playerRef.current) playerRef.current.captions = captions;
  }, [captions, player]);
  useEffect(() => playerRef.current?.setRate(rate), [rate, player]);
  useEffect(() => {
    document.body.classList.toggle('is-locked', expanded);
  }, [expanded]);
  useEffect(() => {
    if (st.playing) setStarted(true);
  }, [st.playing]);

  // While the controls show, captions in the picture move up out of their way.
  const controlsRef = useRef<HTMLDivElement>(null);
  const [controlsH, setControlsH] = useState(0);
  useEffect(() => {
    const el = controlsRef.current;
    const box = boxRef.current;
    if (!el || !box) return;
    const measure = () => {
      const row = el.querySelector<HTMLElement>('.ctl-play') ?? el;
      setControlsH(Math.max(0, box.getBoundingClientRect().bottom - row.getBoundingClientRect().top + 8));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(box);
    measure();
    return () => ro.disconnect();
  }, []);
  const controlsShown = !(idle && st.playing && !st.waiting);
  useEffect(() => playerRef.current?.setBottomInset(controlsShown ? controlsH : 0), [controlsShown, controlsH, player]);

  // Hide the controls while the film plays and the pointer rests.
  const idleTimer = useRef(0);
  const wake = () => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), 2600);
  };
  useEffect(() => () => window.clearTimeout(idleTimer.current), []);

  const seek = (t: number) => {
    playerRef.current?.seek(t);
    setStarted(true);
  };
  const toggleExpanded = (next = !expanded) => withTransition(() => setExpanded(next));

  // Keyboard, video-player style.
  const keys = useRef({ expanded, toggleExpanded });
  keys.current = { expanded, toggleExpanded };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const p = playerRef.current;
      if (!p) return;
      if (e.key === 'Escape' && keys.current.expanded) {
        keys.current.toggleExpanded(false);
        return;
      }
      const el = e.target as HTMLElement;
      if (el.closest('input, textarea, select, [role="slider"], [contenteditable="true"]')) return;
      if ((e.key === ' ' || e.key === 'k') && !el.closest('button, a')) {
        e.preventDefault();
        p.toggle();
        setStarted(true);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        p.seek(p.getTime() + (e.key === 'ArrowRight' ? 5 : -5));
      } else if (e.key === 'c') setCaptions((c) => !c);
      else if (e.key === 'f') keys.current.toggleExpanded();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // A hook for `npm run render`, which drives this page in a headless browser.
  useEffect(() => {
    (window as unknown as { __lesson: unknown }).__lesson = {
      ready: true,
      duration: film.duration,
      async renderVideo(o: { fps?: number; captions?: boolean; width?: number; height?: number; from?: number; to?: number }) {
        const fps = o.fps ?? 30;
        const res = await renderVideo(film.duration, (ctx, T) => drawFilmFrame(film, ctx, T, o.captions ?? false), {
          width: o.width ?? 1920,
          height: o.height ?? 1080,
          fps,
          from: o.from,
          to: o.to,
          onProgress: (done, total) => {
            if (done % Math.max(1, fps * 2) === 0 || done === total) console.log(`frame ${done}/${total}`);
          },
        });
        download(res.blob, `living-equations.${res.extension}`);
        return { codec: res.codec, frames: res.frames, extension: res.extension };
      },
      srt: () => toSrt(film),
      script: () => toScript(film, TITLE),
      beats: film.beats.map((b) => ({ start: b.start, speakEnd: b.speakEnd, end: b.end, say: b.say, pause: !!b.pause })),
      seek: (t: number) => {
        playerRef.current?.pause();
        playerRef.current?.seek(t);
        setStarted(true);
      },
    };
  }, [film]);

  const chapter = film.chapters[st.chapter];
  const waiting = st.waiting;
  const turn = waiting && player ? <YourTurn player={player} beat={waiting} /> : null;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Logo />
          <span className="brand-name">Learn Things</span>
        </div>
        <nav className="crumbs" aria-label="Breadcrumb">
          <span className="crumb hide-sm">Physics</span>
          <span className="crumb-sep hide-sm" aria-hidden="true">
            /
          </span>
          <span className="crumb is-current" aria-current="page">
            Living equations
          </span>
        </nav>
        <div className="mode" role="radiogroup" aria-label="How to play the film">
          {(
            [
              ['lesson', 'Lesson'],
              ['watch', 'Watch'],
            ] as [Mode, string][]
          ).map(([m, label]) => (
            <button key={m} role="radio" aria-checked={mode === m} className="mode-btn" onClick={() => setMode(m)} title={m === 'lesson' ? 'Stops at four moments so you can try things' : 'Plays straight through, like the video'}>
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="layout">
        <aside className="panel" aria-label="Chapters and narration">
          <div className="panel-scroll">
            <h1 className="title">{TITLE}</h1>
            <p className="lead">
              A short film you can step into. {mode === 'lesson' ? 'Lesson mode stops at four moments so you can try things yourself.' : 'Watch mode plays straight through, exactly like the video version.'}
            </p>
            <Chapters film={film} time={timeStore} chapter={st.chapter} onSeek={seek} />
            <div className="transcript-head">
              <span>{chapter?.title}</span>
              <span className="transcript-sub">Narration</span>
            </div>
            <Transcript film={film} beat={st.beat} chapter={st.chapter} onSeek={seek} follow={!narrow} />
          </div>
          <div className="panel-foot">
            <ExportPanel film={film} />
          </div>
        </aside>

        <section className="film-col">
          <div
            ref={boxRef}
            className={`stage-box${expanded ? ' is-expanded' : ''}${idle && st.playing && !waiting ? ' is-idle' : ''}`}
            onPointerMove={wake}
            onPointerDown={wake}
          >
            <canvas
              ref={canvasRef}
              className="stage"
              role="img"
              aria-label="The film. Click to play or pause."
              onClick={() => {
                if (!waiting) {
                  playerRef.current?.toggle();
                  setStarted(true);
                }
              }}
            />
            {!started && !st.playing && (
              <button
                className="big-play"
                onClick={() => {
                  playerRef.current?.play();
                  setStarted(true);
                }}
                aria-label="Play the film"
              >
                <span className="big-play-icon">
                  <Icon name="play" size={30} />
                </span>
                <span className="big-play-text">
                  Play the film <span className="big-play-len">{clock(film.duration)}</span>
                </span>
              </button>
            )}
            {turn && (!narrow || expanded) && turn}
            <div className="controls" ref={controlsRef}>
              <button
                className="ctl ctl-play"
                onClick={() => {
                  playerRef.current?.toggle();
                  setStarted(true);
                }}
                aria-label={waiting ? 'Continue' : st.playing ? 'Pause' : 'Play'}
              >
                <Icon name={st.playing ? 'pause' : 'play'} size={18} />
              </button>
              <Scrubber film={film} time={timeStore} onSeek={seek} />
              <button className="ctl ctl-text" aria-pressed={captions} onClick={() => setCaptions((c) => !c)} aria-label="Captions" title="Captions (c)">
                CC
              </button>
              <button className="ctl ctl-text" onClick={() => setRate((r) => RATES[(RATES.indexOf(r) + 1) % RATES.length])} aria-label={`Speed ${rate} times. Change.`} title="Speed">
                {rate}×
              </button>
              <button className="ctl" onClick={() => toggleExpanded()} aria-label={expanded ? 'Exit full screen' : 'Full screen'} title="Full screen (f)">
                <Icon name={expanded ? 'shrink' : 'expand'} size={18} />
              </button>
            </div>
          </div>
          {turn && narrow && !expanded && turn}
          <div className="film-meta">
            <span className="film-chapter">
              <span className="film-n">{String(st.chapter + 1).padStart(2, '0')}</span>
              {chapter?.title}
            </span>
            <span className="keys" aria-label="Keyboard shortcuts">
              <kbd>Space</kbd> play <kbd>←</kbd>
              <kbd>→</kbd> skip <kbd>C</kbd> captions <kbd>F</kbd> full screen
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
