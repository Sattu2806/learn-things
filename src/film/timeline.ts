/**
 * A small animation timeline in the spirit of Manim (3Blue1Brown's library).
 *
 * A film is a list of narrated beats. Inside a beat you tween named numeric
 * properties and switch states (an equation, a label). Every property can be
 * evaluated at any moment, so live playback, scrubbing and frame-by-frame
 * video export all draw exactly the same picture.
 */

export type Ease = (t: number) => number;

export const ease = {
  linear: (t: number) => t,
  /** Slow in, slow out. Manim's default feel. */
  smooth: (t: number) => t * t * t * (t * (6 * t - 15) + 10),
  out: (t: number) => 1 - (1 - t) ** 3,
  in: (t: number) => t ** 3,
};

interface NumKey {
  t: number;
  v: number;
  /** Easing for the segment that ends at this key. */
  ease: Ease;
}

interface StateKey {
  t: number;
  v: unknown;
  /** Seconds the change takes (a morph or a cross-fade). */
  dur: number;
}

export interface Pause {
  /** The question or task put to the viewer. */
  prompt: string;
  /** Controls offered in the interactive lesson. */
  controls: string[];
  /** Seconds the video holds on the question ("pause and ponder"). */
  hold: number;
}

export interface Beat {
  index: number;
  chapter: number;
  start: number;
  /** When the narration (and its animation) ends. */
  speakEnd: number;
  /** When the beat ends, including any pause-and-ponder hold. */
  end: number;
  say: string;
  pause?: Pause;
}

export interface Chapter {
  index: number;
  title: string;
  start: number;
  end: number;
}

export interface StateValue<T> {
  from: T;
  to: T;
  /** Progress of the change, 0 to 1. */
  p: number;
}

export interface BeatKit {
  /** Animate a number from its current value. Times are seconds from the beat start. */
  tween(prop: string, to: number, o?: { at?: number; dur?: number; ease?: Ease }): void;
  /** Change a number instantly. */
  jump(prop: string, to: number, at?: number): void;
  /** Switch a state (an equation, a label), optionally morphing over `dur` seconds. */
  set(prop: string, value: unknown, o?: { at?: number; dur?: number }): void;
  /** A number's value at a time relative to the beat start. */
  get(prop: string, at?: number): number;
  /** Make the beat last at least this many seconds. */
  wait(seconds: number): void;
}

/** Narration pace for timing beats: about 150 words a minute. */
const WORDS_PER_SECOND = 2.5;
const BREATH = 0.45;

export class Film {
  readonly beats: Beat[] = [];
  readonly chapters: Chapter[] = [];
  duration = 0;
  private readonly nums = new Map<string, NumKey[]>();
  private readonly states = new Map<string, StateKey[]>();
  private readonly defaults: Record<string, number>;
  private readonly stateDefaults: Record<string, unknown>;

  constructor(defaults: Record<string, number>, stateDefaults: Record<string, unknown> = {}) {
    this.defaults = defaults;
    this.stateDefaults = stateDefaults;
  }

  chapter(title: string) {
    this.chapters.push({ index: this.chapters.length, title, start: this.duration, end: this.duration });
  }

  speakTime(say: string): number {
    const words = say.split(/\s+/).filter(Boolean).length;
    return words / WORDS_PER_SECOND;
  }

  beat(say: string, build?: (k: BeatKit) => void, o: { min?: number; pause?: Omit<Pause, 'hold'> & { hold?: number } } = {}) {
    const start = this.duration;
    let end = start + Math.max(o.min ?? 0, this.speakTime(say));
    const touch = (t: number) => {
      end = Math.max(end, t);
    };
    const kit: BeatKit = {
      tween: (prop, to, opt = {}) => {
        const t0 = start + (opt.at ?? 0);
        const t1 = t0 + Math.max(1e-3, opt.dur ?? 1);
        this.addNum(prop, { t: t0, v: this.num(prop, t0), ease: ease.linear });
        this.addNum(prop, { t: t1, v: to, ease: opt.ease ?? ease.smooth });
        touch(t1);
      },
      jump: (prop, to, at = 0) => kit.tween(prop, to, { at, dur: 1e-3, ease: ease.linear }),
      set: (prop, value, opt = {}) => {
        const t = start + (opt.at ?? 0);
        this.addState(prop, { t, v: value, dur: opt.dur ?? 0 });
        touch(t + (opt.dur ?? 0));
      },
      get: (prop, at = 0) => this.num(prop, start + at),
      wait: (s) => touch(start + s),
    };
    build?.(kit);
    const speakEnd = end + BREATH;
    const pause = o.pause ? { ...o.pause, hold: o.pause.hold ?? 3 } : undefined;
    const beatEnd = speakEnd + (pause?.hold ?? 0);
    if (pause) {
      // The "pause and ponder" card, shown while the video holds on the question.
      this.addState('prompt', { t: speakEnd, v: pause.prompt, dur: 0 });
      this.addNum('ponder', { t: speakEnd, v: 0, ease: ease.linear });
      this.addNum('ponder', { t: speakEnd + 0.5, v: 1, ease: ease.smooth });
      this.addNum('ponder', { t: beatEnd - 0.45, v: 1, ease: ease.linear });
      this.addNum('ponder', { t: beatEnd, v: 0, ease: ease.smooth });
    }
    const chapter = Math.max(0, this.chapters.length - 1);
    this.beats.push({ index: this.beats.length, chapter, start, speakEnd, end: beatEnd, say, pause });
    this.duration = beatEnd;
    const ch = this.chapters[chapter];
    if (ch) ch.end = beatEnd;
  }

  private addNum(prop: string, key: NumKey) {
    const keys = this.nums.get(prop) ?? [];
    let i = keys.length;
    while (i > 0 && keys[i - 1].t > key.t) i--;
    keys.splice(i, 0, key);
    this.nums.set(prop, keys);
  }

  private addState(prop: string, key: StateKey) {
    const keys = this.states.get(prop) ?? [];
    let i = keys.length;
    while (i > 0 && keys[i - 1].t > key.t) i--;
    keys.splice(i, 0, key);
    this.states.set(prop, keys);
  }

  /** The value of a number at time T. */
  num(prop: string, T: number): number {
    const keys = this.nums.get(prop);
    const def = this.defaults[prop] ?? 0;
    if (!keys || !keys.length || T < keys[0].t) return def;
    let lo = 0;
    let hi = keys.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (keys[mid].t <= T) lo = mid;
      else hi = mid - 1;
    }
    const a = keys[lo];
    const b = keys[lo + 1];
    if (!b) return a.v;
    const p = Math.min(1, Math.max(0, (T - a.t) / (b.t - a.t || 1)));
    return a.v + (b.v - a.v) * b.ease(p);
  }

  /** The value of a state at time T, with the previous value while it changes. */
  state<T>(prop: string, T: number): StateValue<T> {
    const keys = this.states.get(prop);
    const def = this.stateDefaults[prop] as T;
    if (!keys || !keys.length || T < keys[0].t) return { from: def, to: def, p: 1 };
    let i = keys.length - 1;
    while (i > 0 && keys[i].t > T) i--;
    const k = keys[i];
    const prev = (i > 0 ? keys[i - 1].v : def) as T;
    const p = k.dur > 0 ? Math.min(1, Math.max(0, (T - k.t) / k.dur)) : 1;
    return { from: prev, to: k.v as T, p };
  }

  beatAt(T: number): Beat {
    let lo = 0;
    let hi = this.beats.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (this.beats[mid].start <= T) lo = mid;
      else hi = mid - 1;
    }
    return this.beats[lo];
  }

  /** The narration line to show at T, faded in and out at the edges of its beat. */
  caption(T: number): { text: string; alpha: number } | null {
    const b = this.beatAt(T);
    if (!b.say || T > b.speakEnd) return null;
    const alpha = Math.min(1, (T - b.start) / 0.25, (b.speakEnd - T) / 0.25);
    return alpha > 0 ? { text: b.say, alpha } : null;
  }
}

/** Read-only access to one moment of a film, with optional live overrides. */
export interface Reader {
  T: number;
  n(prop: string): number;
  s<T>(prop: string): StateValue<T>;
}

/**
 * The first "your turn" moment that playback reaches going from `from` to `to`.
 * Both ends have a little slack: a frame can land a hair short of the moment,
 * and the next frame must still stop there rather than sail past.
 */
export function pauseBetween(beats: Beat[], from: number, to: number): Beat | undefined {
  return beats.find((b) => b.pause && b.speakEnd > from - 1e-9 && b.speakEnd <= to + 1e-9);
}

export function reader(film: Film, T: number, over: Record<string, number> = {}, overStates: Record<string, unknown> = {}): Reader {
  return {
    T,
    n: (prop) => (prop in over ? over[prop] : film.num(prop, T)),
    s: <V,>(prop: string) => (prop in overStates ? { from: overStates[prop] as V, to: overStates[prop] as V, p: 1 } : film.state<V>(prop, T)),
  };
}

function stamp(t: number, sep: string) {
  const ms = Math.round(t * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  const p = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${p(h)}:${p(m)}:${p(s)}${sep}${p(r, 3)}`;
}

/** Subtitles for the narration, in SubRip (.srt) format. */
export function toSrt(film: Film): string {
  return film.beats
    .filter((b) => b.say)
    .map((b, i) => `${i + 1}\n${stamp(b.start, ',')} --> ${stamp(b.speakEnd, ',')}\n${b.say}\n`)
    .join('\n');
}

/** A voiceover script: chapters, timings and lines to read. */
export function toScript(film: Film, title: string): string {
  const lines = [`${title}`, `Total length ${stamp(film.duration, '.').slice(3, 8)}`, ''];
  for (const ch of film.chapters) {
    lines.push(`## ${ch.title}  [${stamp(ch.start, '.').slice(3, 8)}]`);
    for (const b of film.beats.filter((x) => x.chapter === ch.index && x.say)) {
      lines.push(`${stamp(b.start, '.').slice(3, 8)}  ${b.say}`);
      if (b.pause) lines.push(`        (Pause and ponder, ${b.pause.hold} s: ${b.pause.prompt})`);
    }
    lines.push('');
  }
  return lines.join('\n');
}
