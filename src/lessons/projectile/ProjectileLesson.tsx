import { useEffect, useMemo, useReducer, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { Icon, Logo } from '../../ui/Icons';
import { Scrub } from '../../ui/Scrub';
import { Equation, MathText, useTime, type Hunt, type Written } from './Equation';
import {
  BUG_ROUNDS,
  LANDING_LINES,
  RANGE_LINES,
  STEPS,
  TERM_INFO,
  lessonReducer,
  loadLesson,
  roundModel,
  saveLesson,
  stepComplete,
  type Line,
  type Target,
} from './lesson';
import { DEG, NO_BUGS, flight, isCorrect, metres, seconds, type Bugs, type Model, type TermId } from './model';
import { EquationStage, type Scene } from './stage';
import { createTimeStore, type TimeStore } from './time';

const SPEEDS = [1, 0.5, 0.25];
const SOUND_KEY = 'learn-things:sound';
const PRESETS: [string, number][] = [
  ['Earth', 9.8],
  ['Moon', 1.6],
  ['Mars', 3.7],
];

function loadSound(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off';
  } catch {
    return true;
  }
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
  if (doc.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    doc.startViewTransition(() => flushSync(update));
  } else update();
}

function Timeline({ store, stage }: { store: TimeStore; stage: () => EquationStage | null }) {
  const s = useTime(store);
  const pct = s.end > 0 ? (s.t / s.end) * 100 : 0;
  return (
    <div className="timeline">
      <button
        className="play"
        onClick={() => {
          stage()?.unlockAudio();
          stage()?.toggle();
        }}
        aria-label={s.playing ? 'Pause' : 'Play'}
      >
        <Icon name={s.playing ? 'pause' : 'play'} size={15} />
      </button>
      <span className="time">
        <i className="m-var">t</i> = {s.t.toFixed(2)} s
      </span>
      <input
        className="scrubber"
        type="range"
        min={0}
        max={s.end}
        step="any"
        value={s.t}
        aria-label="Time"
        aria-valuetext={`${s.t.toFixed(2)} seconds`}
        style={{ '--fill': `${pct}%` } as CSSProperties}
        onChange={(e) => stage()?.seek(Number(e.target.value))}
      />
      <span className="time time-end">{s.lands ? `${s.end.toFixed(2)} s` : 'never lands'}</span>
    </div>
  );
}

function Caption({ store }: { store: TimeStore }) {
  const s = useTime(store);
  const text = s.grounded ? 'It never leaves the ground.' : !s.lands && s.t >= s.end - 1e-6 ? 'It never comes back down.' : '';
  return <p className={text ? 'caption is-on' : 'caption'}>{text}</p>;
}

function Result({ store, model, kind }: { store: TimeStore; model: Model; kind: 'T' | 'R' }) {
  useTime(store);
  const f = flight(model.v, model.theta, model.g);
  return <b className="result">{kind === 'T' ? `t = ${seconds(f.T)}` : `R = ${metres(f.R)}`}</b>;
}

function Derivation({ lines, shown, onNext, result }: { lines: Line[]; shown: number; onNext: () => void; result: ReactNode }) {
  return (
    <ol className="derive">
      {lines.slice(0, shown).map((l, i) => (
        <li key={l.eq} className={i === shown - 1 ? 'is-new' : ''}>
          <span className="derive-eq">
            <MathText eq={l.eq} />
          </span>
          <span className="derive-note">{l.note}</span>
        </li>
      ))}
      <li className="derive-foot">
        {shown < lines.length ? (
          <button className="btn btn-outline" onClick={onNext}>
            Next line <Icon name="next" size={15} />
          </button>
        ) : (
          result
        )}
      </li>
    </ol>
  );
}

function Sin2Chart({ theta, onChange }: { theta: number; onChange: (t: number) => void }) {
  const W = 320;
  const H = 128;
  const px = (deg: number) => 14 + (deg / 90) * (W - 28);
  const py = (v: number) => H - 22 - v * (H - 50);
  const path = Array.from({ length: 91 }, (_, d) => `${d ? 'L' : 'M'}${px(d).toFixed(1)},${py(Math.sin(2 * d * DEG)).toFixed(1)}`).join('');
  const set = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const d = Math.round((((e.clientX - r.left) / r.width) * W - 14) / ((W - 28) / 90));
    onChange(Math.min(89, Math.max(1, d)));
  };
  const v = Math.sin(2 * theta * DEG);
  return (
    <figure className="chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`sin 2 theta against theta. At ${theta} degrees it is ${v.toFixed(2)}. Drag to change the angle.`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          set(e);
        }}
        onPointerMove={(e) => {
          if (e.buttons) set(e);
        }}
      >
        <line x1={px(0)} x2={px(90)} y1={py(0)} y2={py(0)} className="chart-axis" />
        {[30, 45, 60].map((d) => (
          <g key={d}>
            <line x1={px(d)} x2={px(d)} y1={py(0)} y2={py(Math.sin(2 * d * DEG))} className="chart-guide" />
            <text x={px(d)} y={H - 6} className="chart-tick">
              {d}°
            </text>
          </g>
        ))}
        <path d={path} className="chart-curve" />
        <line x1={px(theta)} x2={px(theta)} y1={py(0)} y2={py(v)} className="chart-now" />
        <circle cx={px(theta)} cy={py(v)} r="5" className="chart-dot" />
        <text x={px(theta)} y={py(v) - 12} className="chart-label">
          {v.toFixed(2)}
        </text>
      </svg>
      <figcaption>
        <MathText eq="sin 2θ" /> for every angle. Drag along the curve to change θ.
      </figcaption>
    </figure>
  );
}

export default function ProjectileLesson() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<EquationStage | null>(null);
  const store = useMemo(createTimeStore, []);

  const [lesson, dispatch] = useReducer(lessonReducer, undefined, loadLesson);
  const free = lesson.mode !== 'lesson';
  const step = STEPS[lesson.step];
  const id = free ? 'free' : step.id;
  const round = id === 'bugs' ? BUG_ROUNDS[lesson.round] : null;

  const [v, setV] = useState(step.v);
  const [theta, setTheta] = useState(step.theta);
  const [g, setG] = useState(step.g);
  const [breaks, setBreaks] = useState<Bugs>(NO_BUGS);
  const [off, setOff] = useState<Record<TermId, boolean>>({ run: false, rise: false, drop: false });
  const [ghost, setGhost] = useState(true);
  const [hover, setHover] = useState<TermId | null>(null);
  const [picked, setPicked] = useState<TermId | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [sound, setSound] = useState(loadSound);
  const [speed, setSpeed] = useState(1);
  const narrow = useMedia('(max-width: 860px)');
  const focus = hover ?? picked;

  // ---------------------------------------------------------- what is shown

  const model: Model = round
    ? { ...roundModel(round, g, lesson.found), v, theta }
    : { v, theta, g, run: !off.run, rise: !off.rise, drop: (free || step.drop) && !off.drop, bugs: breaks };

  const written: Written = round
    ? { xLine: true, run: true, rise: true, drop: 'on', bugs: NO_BUGS }
    : {
        xLine: free || step.xLine,
        run: !off.run,
        rise: !off.rise,
        drop: !(free || step.drop) ? 'hidden' : off.drop ? 'off' : 'on',
        bugs: breaks,
      };

  const scene: Scene = {
    model,
    reference: (id === 'square' || id === 'bugs' || id === 'free') && !isCorrect(model),
    ghost: free ? ghost : step.ghost,
    ticks: free ? 0.5 : step.ticks,
    tickDrops: free ? false : step.tickDrops,
    bars: free ? [] : step.bars,
    range: free ? true : step.range,
    focus,
    frame: free ? 'ghost' : step.frame,
    landingFlash: id === 'landing' && lesson.line >= 3,
  };

  // ---------------------------------------------------------- engine wiring

  useEffect(() => {
    const stage = new EquationStage(canvasRef.current!);
    stageRef.current = stage;
    const unsub = stage.subscribe(() => store.set(stage.getSnapshot()));
    return () => {
      unsub();
      stage.destroy();
      stageRef.current = null;
    };
  }, [store]);

  // Entering a chapter (or a new bug) resets the throw and starts the film again.
  const setupKey = `${lesson.mode}|${lesson.step}|${lesson.round}`;
  useEffect(() => {
    const start = round ?? (free ? { v: 20, theta: 50 } : step);
    setV(start.v);
    setTheta(start.theta);
    setG(9.8);
    setBreaks(NO_BUGS);
    setOff({ run: false, rise: false, drop: false });
    setHover(null);
    setPicked(null);
    stageRef.current?.restart();
    stageRef.current?.play();
    // Only when the chapter or round changes.
  }, [setupKey]);

  useEffect(() => {
    stageRef.current?.setScene(scene);
  });

  // Fixing a bug, or breaking something on purpose, replays the throw from the start.
  const replayKey = `${lesson.found}|${JSON.stringify(breaks)}|${JSON.stringify(off)}`;
  const firstReplay = useRef(true);
  useEffect(() => {
    if (firstReplay.current) {
      firstReplay.current = false;
      return;
    }
    stageRef.current?.restart();
    stageRef.current?.play();
  }, [replayKey]);

  useEffect(() => stageRef.current?.setSpeed(speed), [speed]);
  useEffect(() => {
    stageRef.current?.setSound(sound);
    try {
      localStorage.setItem(SOUND_KEY, sound ? 'on' : 'off');
    } catch {
      // Not remembered, that's fine.
    }
  }, [sound]);
  useEffect(() => saveLesson(lesson), [lesson]);
  useEffect(() => {
    document.body.classList.toggle('is-locked', expanded);
  }, [expanded]);

  // Keep the scene clear of the overlays at the top and bottom of the frame.
  useEffect(() => {
    const canvas = canvasRef.current!;
    const update = () => {
      const box = canvas.getBoundingClientRect();
      const top = topRef.current?.getBoundingClientRect();
      const bottom = bottomRef.current?.getBoundingClientRect();
      stageRef.current?.setInsets(top ? top.bottom - box.top : 56, bottom ? box.bottom - bottom.top : 140);
    };
    const ro = new ResizeObserver(update);
    ro.observe(canvas);
    if (topRef.current) ro.observe(topRef.current);
    if (bottomRef.current) ro.observe(bottomRef.current);
    update();
    return () => ro.disconnect();
  }, [expanded, narrow]);

  const toggleExpanded = (next = !expanded) => withTransition(() => setExpanded(next));

  // Keyboard: Space plays and pauses, arrows step through time, Escape leaves full screen.
  const keys = useRef({ expanded, toggleExpanded });
  keys.current = { expanded, toggleExpanded };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && keys.current.expanded) {
        keys.current.toggleExpanded(false);
        return;
      }
      const el = e.target as HTMLElement;
      if (el.closest('input, textarea, select, button, [role="slider"], [contenteditable="true"]')) return;
      const stage = stageRef.current;
      if (!stage) return;
      if (e.key === ' ') {
        e.preventDefault();
        stage.unlockAudio();
        stage.toggle();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const s = stage.getSnapshot();
        stage.seek(s.t + (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 0.25 : 0.05));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const touch = () => dispatch({ type: 'touch' });
  const pick = (t: TermId) => {
    stageRef.current?.unlockAudio();
    setPicked((p) => (p === t ? null : t));
    touch();
  };
  const toggleBreak = (k: keyof Bugs) => {
    setBreaks((b) => ({ ...b, [k]: !b[k] }));
    touch();
  };

  // ---------------------------------------------------------- the chapter text

  const complete = !free && stepComplete(lesson);
  let title = step.title;
  let body: ReactNode = null;

  const legend = (ids: TermId[]) => (
    <div className="legend" role="group" aria-label="What each term draws">
      {ids.map((t) => (
        <button
          key={t}
          className="legend-row"
          aria-pressed={picked === t}
          onMouseEnter={() => setHover(t)}
          onMouseLeave={() => setHover(null)}
          onClick={() => pick(t)}
        >
          <span className="legend-sym">
            <MathText eq={TERM_INFO[t].name} />
          </span>
          <span className="legend-text">{TERM_INFO[t].text}</span>
        </button>
      ))}
    </div>
  );

  if (lesson.mode === 'complete') {
    title = 'Lesson complete';
    body = (
      <>
        <p className="lead">
          You found {lesson.score} of {BUG_ROUNDS.length} bugs by watching the motion alone. Three things to keep:
        </p>
        <ul className="keep">
          <li>A throw is a straight line plus a drop: where the ball would go with no gravity, minus ½gt² straight down.</li>
          <li>The square in t² is what bends the path. The drop grows 1, 4, 9, 16.</li>
          <li>It lands when the drop catches the rise, at t = 2v·sin θ / g, and flies farthest at 45°.</li>
        </ul>
      </>
    );
  } else if (lesson.mode === 'free') {
    title = 'Sandbox';
    body = (
      <>
        <p className="lead">Change anything. Switch terms off, break them on purpose, and watch what the equation does.</p>
        <div className="toggles">
          <p className="group-label">Terms</p>
          {(['run', 'rise', 'drop'] as TermId[]).map((t) => (
            <label key={t} className="toggle">
              <input type="checkbox" checked={!off[t]} onChange={() => setOff((o) => ({ ...o, [t]: !o[t] }))} />
              <span className="toggle-box" aria-hidden="true" />
              <MathText eq={TERM_INFO[t].name} />
            </label>
          ))}
          <p className="group-label">Mistakes</p>
          {(
            [
              ['linear', 't instead of t²'],
              ['noHalf', 'Leave out the ½'],
              ['plus', 'Plus instead of minus'],
              ['swap', 'Swap sin and cos'],
            ] as [keyof Bugs, string][]
          ).map(([k, label]) => (
            <label key={k} className="toggle">
              <input type="checkbox" checked={breaks[k]} onChange={() => toggleBreak(k)} />
              <span className="toggle-box" aria-hidden="true" />
              {label}
            </label>
          ))}
          <p className="group-label">Show</p>
          <label className="toggle">
            <input type="checkbox" checked={ghost} onChange={() => setGhost((x) => !x)} />
            <span className="toggle-box" aria-hidden="true" />
            The no-gravity ghost
          </label>
        </div>
      </>
    );
  } else if (step.id === 'inertia') {
    body = (
      <>
        <p className="lead">
          Start with no gravity at all. Thrown at speed <i>v</i> and angle <i>θ</i>, the ball travels in a straight line and covers the
          same distance every second. It never slows and never turns.
        </p>
        <p className={complete ? 'note is-done' : 'note'}>
          {complete
            ? 'The dots stay evenly spaced whatever you choose: no force, no change.'
            : `The equation is the controller. Drag the numbers ${narrow ? 'below' : 'under the scene'} sideways to change the throw.`}
        </p>
      </>
    );
  } else if (step.id === 'gravity') {
    body = (
      <>
        <p className="lead">
          Gravity adds a single term. The hollow circle carries on as if nothing were pulling; the real ball hangs exactly ½gt²
          below it.
        </p>
        {legend(['rise', 'drop'])}
        <p className="note">Tap a term, here or in the equation, to see what it draws. Then try the Moon.</p>
      </>
    );
  } else if (step.id === 'square') {
    body = (
      <>
        <p className="lead">
          Each dashed line is the drop after 1, 2, 3 seconds. Four times as far after 2 s, nine times after 3 s: that is what the
          square in t² does.
        </p>
        <div className="breaks" role="group" aria-label="Break the equation">
          <button className="btn btn-outline" aria-pressed={breaks.linear} onClick={() => toggleBreak('linear')}>
            Write <MathText eq="t" /> instead of <MathText eq="t²" />
          </button>
          <button className="btn btn-outline" aria-pressed={breaks.noHalf} onClick={() => toggleBreak('noHalf')}>
            Leave out the ½
          </button>
        </div>
        <p className={breaks.linear || breaks.noHalf ? 'note is-done' : 'note'}>
          {breaks.linear
            ? 'Without the square the drop grows by the same amount every second: 1×, 2×, 3×. Nothing bends the path, so it never comes down.'
            : breaks.noHalf
              ? 'Without the ½ every drop doubles, so the ball lands in half the time, at half the distance.'
              : 'Galileo found this rolling balls down ramps: each second the fall grows by 1, 3, 5, 7… and those add up to 1, 4, 9, 16.'}
        </p>
      </>
    );
  } else if (step.id === 'landing') {
    body = (
      <>
        <p className="lead">The ball lands the moment the drop has grown as big as the rise. Write that down and the landing time falls out.</p>
        <Derivation
          lines={LANDING_LINES}
          shown={lesson.line}
          onNext={() => dispatch({ type: 'line' })}
          result={<Result store={store} model={model} kind="T" />}
        />
      </>
    );
  } else if (step.id === 'range') {
    body = (
      <>
        <p className="lead">Distance is sideways speed times time in the air. Put in the landing time and a neat identity appears.</p>
        <Derivation
          lines={RANGE_LINES}
          shown={lesson.line}
          onNext={() => dispatch({ type: 'line' })}
          result={<Result store={store} model={model} kind="R" />}
        />
        {lesson.line >= RANGE_LINES.length && (
          <>
            <Sin2Chart theta={theta} onChange={setTheta} />
            <p className="note is-done">sin 2θ peaks at 45°, and 30° and 60° give the same value, so they land in the same spot.</p>
          </>
        )}
      </>
    );
  } else if (round) {
    title = `Spot the bug`;
    body = (
      <>
        <p className="lead">
          This ball runs on an equation with one mistake in it. Watch how it moves against the dotted correct path, then tap the
          symbol you think is wrong.
        </p>
        <div className="hunt-status">
          <span className="hunt-count">
            Bug {lesson.round + 1} of {BUG_ROUNDS.length}
          </span>
          <span className="hunt-score">{lesson.score} found</span>
        </div>
        {lesson.found ? (
          <p className="note is-done">{round.reveal}</p>
        ) : lesson.wrong > 0 ? (
          <p className="note">
            Not that one. {round.clue}
          </p>
        ) : (
          <p className="note">Every symbol in the equation is tappable now.</p>
        )}
        {!lesson.found && lesson.wrong >= 2 && (
          <button className="btn btn-outline" onClick={() => dispatch({ type: 'reveal' })}>
            Show me
          </button>
        )}
      </>
    );
  }

  const hunt: Hunt | undefined = round
    ? {
        onGuess: (target: Target) => dispatch({ type: 'guess', target }),
        wrong: lesson.lastWrong,
        wrongKey: lesson.wrong,
        found: lesson.found ? round.answers : null,
      }
    : undefined;

  let next: ReactNode = null;
  if (lesson.mode === 'complete') {
    next = (
      <button className="btn btn-primary" onClick={() => dispatch({ type: 'free' })}>
        Open the sandbox <Icon name="next" size={15} />
      </button>
    );
  } else if (lesson.mode === 'free') {
    next = (
      <button className="btn btn-primary" onClick={() => dispatch({ type: 'goto', step: lesson.step })}>
        Back to the lesson
      </button>
    );
  } else if (round) {
    next = lesson.found ? (
      <button className="btn btn-primary" onClick={() => dispatch({ type: 'nextRound' })}>
        {lesson.round >= BUG_ROUNDS.length - 1 ? 'Finish' : 'Next bug'} <Icon name="next" size={15} />
      </button>
    ) : null;
  } else {
    next = (
      <button className={complete ? 'btn btn-primary' : 'btn btn-ghost'} onClick={() => dispatch({ type: 'next' })}>
        {complete ? 'Continue' : 'Skip'} <Icon name="next" size={15} />
      </button>
    );
  }

  const vars = (
    <div className="vars" role="group" aria-label="Numbers in the equation">
      <Scrub symbol={<i className="m-var">v</i>} name="Launch speed" value={v} min={2} max={40} step={0.5} digits={1} unit="m/s" unitName="metres per second" onChange={setV} onCommit={touch} />
      <Scrub symbol={<i className="m-var">θ</i>} name="Launch angle" value={theta} min={1} max={89} step={1} unit="°" unitName="degrees" onChange={setTheta} onCommit={touch} />
      <span className="vars-g">
        <Scrub symbol={<i className="m-var">g</i>} name="Gravity" value={g} min={0.5} max={25} step={0.1} digits={1} unit="m/s²" unitName="metres per second squared" onChange={setG} onCommit={touch} />
        <span className="presets">
          {PRESETS.map(([n, val]) => (
            <button
              key={n}
              className="preset"
              aria-pressed={Math.abs(g - val) < 1e-6}
              onClick={() => {
                setG(val);
                touch();
              }}
            >
              {n}
            </button>
          ))}
        </span>
      </span>
    </div>
  );
  const varsInStage = !narrow || expanded;
  const chapter = free ? (lesson.mode === 'complete' ? 'The end' : 'Sandbox') : `Chapter ${lesson.step + 1}`;

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
        <div className="topbar-actions">
          {lesson.mode === 'lesson' && (
            <button className="btn btn-ghost btn-sm hide-sm" onClick={() => dispatch({ type: 'free' })}>
              Sandbox
            </button>
          )}
          <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'restart' })} aria-label="Restart the lesson">
            <Icon name="restart" size={16} />
            <span className="hide-sm">Restart</span>
          </button>
        </div>
      </header>

      <main className="layout">
        <aside className="panel" aria-label="Lesson">
          <div className="panel-scroll">
            <div className="meta">
              <span className="meta-label">{free ? chapter : `Chapter ${lesson.step + 1} of ${STEPS.length}`}</span>
              <ol className="steps" aria-label="Chapters">
                {STEPS.map((s, i) => (
                  <li key={s.id}>
                    <button
                      className={!free && i === lesson.step ? 'seg is-current' : lesson.done[i] ? 'seg is-done' : 'seg'}
                      aria-label={`Chapter ${i + 1}: ${s.title}${lesson.done[i] ? ', done' : ''}`}
                      aria-current={!free && i === lesson.step ? 'step' : undefined}
                      onClick={() => dispatch({ type: 'goto', step: i })}
                    />
                  </li>
                ))}
              </ol>
            </div>
            <h1 className="title">{title}</h1>
            <div className="body">{body}</div>
            {narrow && !expanded && vars}
          </div>
          <div className="panel-foot">
            {!free && lesson.step > 0 ? (
              <button className="btn btn-ghost" onClick={() => dispatch({ type: 'goto', step: lesson.step - 1 })}>
                <Icon name="back" size={15} /> Back
              </button>
            ) : (
              <span />
            )}
            {next}
          </div>
        </aside>

        <section className={expanded ? 'stage-box is-expanded' : 'stage-box'} aria-label="The throw, drawn from its equation">
          <canvas ref={canvasRef} className="stage" aria-hidden="true" />
          <div className="chapter-card" key={setupKey} aria-hidden="true">
            <span className="chapter-num">{chapter}</span>
            <span className="chapter-title">{title}</span>
          </div>
          <div className="stage-top" ref={topRef}>
            <Caption store={store} />
            <div className="tools">
              <button
                className="tool tool-text"
                onClick={() => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])}
                aria-label={`Playback speed ${speed === 1 ? 'normal' : speed === 0.5 ? 'half' : 'quarter'}. Change.`}
                title="Slow motion"
              >
                {speed === 1 ? '1×' : speed === 0.5 ? '½×' : '¼×'}
              </button>
              <button className="tool" onClick={() => setSound((s) => !s)} aria-label={sound ? 'Turn sound off' : 'Turn sound on'} aria-pressed={sound}>
                <Icon name={sound ? 'sound' : 'mute'} size={18} />
              </button>
              <button
                className="tool"
                onClick={() => toggleExpanded()}
                aria-label={expanded ? 'Exit full screen' : 'Expand to full screen'}
                title={expanded ? 'Exit full screen (Esc)' : 'Full screen'}
              >
                <Icon name={expanded ? 'shrink' : 'expand'} size={18} />
              </button>
            </div>
          </div>
          <div className="stage-bottom" ref={bottomRef}>
            <Equation
              model={model}
              written={written}
              store={store}
              focus={focus}
              onHover={setHover}
              onPick={pick}
              hunt={hunt}
              values={!round || lesson.found}
            />
            {varsInStage && vars}
            <Timeline store={store} stage={() => stageRef.current} />
          </div>
        </section>
      </main>
    </div>
  );
}
