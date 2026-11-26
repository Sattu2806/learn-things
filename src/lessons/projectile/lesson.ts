/**
 * The lesson script: chapters, derivations, bug rounds, and a pure reducer
 * for progress. Plain data, so the story is easy to read and to edit.
 */
import { NO_BUGS, type Bugs, type Model, type TermId } from './model';
import type { Frame } from './stage';

export type StepId = 'inertia' | 'gravity' | 'square' | 'landing' | 'range' | 'bugs';

export interface StepDef {
  id: StepId;
  title: string;
  v: number;
  theta: number;
  g: number;
  /** Is the gravity term written in the equation? */
  drop: boolean;
  /** Show the x equation as well as the y one. */
  xLine: boolean;
  ghost: boolean;
  ticks: number;
  tickDrops: boolean;
  bars: TermId[];
  range: boolean;
  frame: Frame;
}

export const STEPS: StepDef[] = [
  { id: 'inertia', title: 'Nothing pulling', v: 20, theta: 50, g: 9.8, drop: false, xLine: true, ghost: false, ticks: 0.5, tickDrops: false, bars: [], range: false, frame: 'ghost' },
  { id: 'gravity', title: 'Add gravity', v: 20, theta: 55, g: 9.8, drop: true, xLine: false, ghost: true, ticks: 0.5, tickDrops: false, bars: [], range: false, frame: 'ghost' },
  { id: 'square', title: 'Why t²?', v: 30, theta: 60, g: 9.8, drop: true, xLine: false, ghost: true, ticks: 1, tickDrops: true, bars: [], range: false, frame: 'ghost' },
  { id: 'landing', title: 'When does it land?', v: 20, theta: 50, g: 9.8, drop: true, xLine: false, ghost: true, ticks: 0, tickDrops: false, bars: ['rise'], range: false, frame: 'ghost' },
  { id: 'range', title: 'How far?', v: 20, theta: 45, g: 9.8, drop: true, xLine: true, ghost: false, ticks: 0, tickDrops: false, bars: ['run'], range: true, frame: 'parabola' },
  { id: 'bugs', title: 'Spot the bug', v: 20, theta: 45, g: 9.8, drop: true, xLine: true, ghost: false, ticks: 0.5, tickDrops: false, bars: [], range: false, frame: 'parabola' },
];

export const TERM_INFO: Record<TermId, { name: string; text: string }> = {
  run: {
    name: 'v·cos θ·t',
    text: 'How far the ball has gone sideways. Nothing slows it sideways, so this grows at a steady rate.',
  },
  rise: {
    name: 'v·sin θ·t',
    text: 'How high the ball would be with no gravity: the hollow circle riding the straight line.',
  },
  drop: {
    name: '½·g·t²',
    text: 'How far gravity has pulled the ball below that line. It is the same drop as a ball simply let go.',
  },
};

export interface Line {
  /** Plain-text maths: single letters become italic variables, " / " makes a fraction. */
  eq: string;
  note: string;
}

export const LANDING_LINES: Line[] = [
  { eq: 'y = v·sin θ·t − ½·g·t²', note: 'The height at any moment.' },
  { eq: '0 = v·sin θ·t − ½·g·t²', note: 'On the ground, the height is zero.' },
  { eq: '½·g·t² = v·sin θ·t', note: 'The drop has caught up with the rise.' },
  { eq: '½·g·t = v·sin θ', note: 'Divide both sides by t.' },
  { eq: 't = 2·v·sin θ / g', note: 'Multiply by 2 and divide by g.' },
];

export const RANGE_LINES: Line[] = [
  { eq: 'R = v·cos θ·t', note: 'Sideways speed times the time in the air.' },
  { eq: 'R = v·cos θ·2·v·sin θ / g', note: 'Put in the landing time, t = 2·v·sin θ / g.' },
  { eq: 'R = v²·sin 2θ / g', note: 'Because 2·sin θ·cos θ is the same as sin 2θ.' },
];

/** Every symbol of the equation you can tap while hunting for a bug. */
export type Target =
  | 'x.v'
  | 'x.cos'
  | 'x.theta'
  | 'x.t'
  | 'y.v'
  | 'y.sin'
  | 'y.theta'
  | 'y.t'
  | 'sign'
  | 'half'
  | 'g'
  | 'drop.t'
  | 'square';

export interface BugRound {
  v: number;
  theta: number;
  rise?: boolean;
  bugs: Partial<Bugs>;
  answers: Target[];
  clue: string;
  reveal: string;
}

export const BUG_ROUNDS: BugRound[] = [
  {
    v: 22,
    theta: 50,
    bugs: { linear: true },
    answers: ['drop.t', 'square'],
    clue: 'Look at the shape of the path. Does it ever bend?',
    reveal: 'Someone wrote t instead of t². Gravity then adds the same drop every second, so the path never bends and the ball never comes down.',
  },
  {
    v: 22,
    theta: 55,
    bugs: { noHalf: true },
    answers: ['half'],
    clue: 'Compare it with the dotted correct path: the right shape, but it comes down far too soon.',
    reveal: 'The ½ is missing, so the drop is twice as big. The ball lands in half the time, at half the distance.',
  },
  {
    v: 18,
    theta: 50,
    bugs: { plus: true },
    answers: ['sign'],
    clue: 'Which way is gravity pulling this ball?',
    reveal: 'A plus where the minus should be: gravity pulls up instead of down, so the ball curves away into the sky.',
  },
  {
    v: 20,
    theta: 30,
    bugs: { swap: true },
    answers: ['y.sin', 'x.cos'],
    clue: 'It lands in the right spot but goes far too high. Which part decides how much of the speed goes upward?',
    reveal: 'sin and cos are swapped, so a 30° throw flies like a 60° one: the same distance, but three times as high.',
  },
  {
    v: 20,
    theta: 45,
    rise: false,
    bugs: {},
    answers: ['y.v', 'y.sin', 'y.theta', 'y.t'],
    clue: 'The ball never gets off the ground. Which part of y is meant to lift it?',
    reveal: 'The v·sin θ·t term is missing, so nothing lifts the ball. Gravity holds it on the ground from the first instant.',
  },
];

export function roundModel(r: BugRound, g: number, fixed: boolean): Model {
  return {
    v: r.v,
    theta: r.theta,
    g,
    run: true,
    rise: fixed ? true : (r.rise ?? true),
    drop: true,
    bugs: fixed ? NO_BUGS : { ...NO_BUGS, ...r.bugs },
  };
}

export interface LessonState {
  mode: 'lesson' | 'complete' | 'free';
  step: number;
  done: boolean[];
  /** The step's main interaction has happened (scrubbed, tapped a term, broke something). */
  touched: boolean;
  /** Derivation lines revealed so far. */
  line: number;
  round: number;
  /** Bug found or revealed in the current round. */
  found: boolean;
  wrong: number;
  /** Bugs found without the answer being revealed. */
  score: number;
  lastWrong: Target | null;
}

export type LessonAction =
  | { type: 'goto'; step: number }
  | { type: 'next' }
  | { type: 'touch' }
  | { type: 'line' }
  | { type: 'guess'; target: Target }
  | { type: 'reveal' }
  | { type: 'nextRound' }
  | { type: 'free' }
  | { type: 'restart' };

export function initialLesson(): LessonState {
  return {
    mode: 'lesson',
    step: 0,
    done: STEPS.map(() => false),
    touched: false,
    line: 1,
    round: 0,
    found: false,
    wrong: 0,
    score: 0,
    lastWrong: null,
  };
}

function enter(s: LessonState, step: number): LessonState {
  return { ...s, mode: 'lesson', step, touched: false, line: 1, round: 0, found: false, wrong: 0, score: 0, lastWrong: null };
}

/** Has the current step's main interaction happened? */
export function stepComplete(s: LessonState): boolean {
  switch (STEPS[s.step].id) {
    case 'inertia':
    case 'gravity':
    case 'square':
      return s.touched;
    case 'landing':
      return s.line >= LANDING_LINES.length;
    case 'range':
      return s.line >= RANGE_LINES.length;
    case 'bugs':
      return s.round >= BUG_ROUNDS.length - 1 && s.found;
  }
}

const markDone = (s: LessonState): LessonState => (stepComplete(s) ? { ...s, done: s.done.map((d, i) => d || i === s.step) } : s);

export function lessonReducer(s: LessonState, a: LessonAction): LessonState {
  switch (a.type) {
    case 'goto':
      return enter(s, Math.max(0, Math.min(STEPS.length - 1, a.step)));
    case 'next':
      if (s.mode !== 'lesson') return s;
      if (s.step >= STEPS.length - 1) return { ...s, mode: 'complete' };
      return enter(s, s.step + 1);
    case 'touch':
      return s.touched ? s : markDone({ ...s, touched: true });
    case 'line': {
      const max = STEPS[s.step].id === 'landing' ? LANDING_LINES.length : RANGE_LINES.length;
      return markDone({ ...s, line: Math.min(max, s.line + 1) });
    }
    case 'guess': {
      if (s.found) return s;
      const r = BUG_ROUNDS[s.round];
      if (r.answers.includes(a.target)) {
        return markDone({ ...s, found: true, score: s.score + (s.wrong < 2 ? 1 : 0), lastWrong: null });
      }
      return { ...s, wrong: s.wrong + 1, lastWrong: a.target };
    }
    case 'reveal':
      return markDone({ ...s, found: true, wrong: Math.max(s.wrong, 2) });
    case 'nextRound':
      if (s.round >= BUG_ROUNDS.length - 1) return { ...s, mode: 'complete', done: s.done.map((d, i) => d || i === s.step) };
      return { ...s, round: s.round + 1, found: false, wrong: 0, lastWrong: null };
    case 'free':
      return { ...s, mode: 'free' };
    case 'restart':
      return initialLesson();
  }
}

const STORE_KEY = 'learn-things:living-equations:v1';

export function loadLesson(): LessonState {
  const fresh = initialLesson();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return fresh;
    const saved = JSON.parse(raw) as Partial<LessonState>;
    const step = typeof saved.step === 'number' && saved.step >= 0 && saved.step < STEPS.length ? saved.step : 0;
    const done = Array.isArray(saved.done) && saved.done.length === STEPS.length ? saved.done.map(Boolean) : fresh.done;
    return { ...enter(fresh, step), done, mode: saved.mode === 'free' || saved.mode === 'complete' ? 'free' : 'lesson' };
  } catch {
    return fresh;
  }
}

export function saveLesson(s: LessonState) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ mode: s.mode, step: s.step, done: s.done }));
  } catch {
    // Storage can be unavailable (private mode, sandboxed frames).
  }
}
