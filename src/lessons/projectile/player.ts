/**
 * Plays the film on a canvas like a video, with two differences from a video:
 * in Lesson mode it stops at "your turn" moments, and while stopped there
 * the scene is live, so the viewer can change the numbers and watch.
 */
import { resetMathCache } from '../../film/math';
import { pauseBetween, reader, type Beat, type Film, type Reader } from '../../film/timeline';
import { EQ } from './film';
import { landingTime } from './model';
import { VH, VW, modelOf, renderFrame, targetCamera, type Cam } from './render';

export type Mode = 'lesson' | 'watch';

export interface PlayerState {
  playing: boolean;
  beat: number;
  chapter: number;
  /** The "your turn" moment the lesson is stopped at, if any. */
  waiting: Beat | null;
  ended: boolean;
}

export interface Store<T> {
  subscribe: (fn: () => void) => () => void;
  get: () => T;
  set: (v: T) => void;
}

export function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const subs = new Set<() => void>();
  return {
    subscribe: (fn) => {
      subs.add(fn);
      return () => {
        subs.delete(fn);
      };
    },
    get: () => value,
    set: (v) => {
      value = v;
      for (const fn of subs) fn();
    },
  };
}

export class FilmPlayer {
  readonly film: Film;
  readonly state: Store<PlayerState>;
  readonly time: Store<number>;
  mode: Mode = 'lesson';
  captions = true;

  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly ro: ResizeObserver;
  private readonly motion: MediaQueryList;
  private T = 0;
  private playing = false;
  private rate = 1;
  private waiting: Beat | null = null;
  private over: Record<string, number> = {};
  private overStates: Record<string, unknown> = {};
  private live = 0;
  private cam: Cam | null = null;
  private dpr = 1;
  private W = 0;
  private H = 0;
  private raf = 0;
  private last = 0;
  private still = false;
  /** A moment shown as the cover until the film is first played or moved. */
  private poster: number | null = null;
  /** CSS pixels at the bottom covered by the player's controls (0 when hidden). */
  private inset = 0;
  private safe = VH;

  constructor(canvas: HTMLCanvasElement, film: Film, state: Store<PlayerState>, time: Store<number>) {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D is not available');
    this.canvas = canvas;
    this.ctx = ctx;
    this.film = film;
    this.state = state;
    this.time = time;
    this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.still = this.motion.matches;
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    document.fonts?.addEventListener?.('loadingdone', this.onFonts);
    void document.fonts?.ready.then(this.onFonts);
    this.resize();
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    document.fonts?.removeEventListener?.('loadingdone', this.onFonts);
  }

  // ------------------------------------------------------------ controls

  setPoster(T: number | null) {
    this.poster = T;
  }

  play() {
    this.poster = null;
    if (this.waiting) return;
    if (this.T >= this.film.duration - 1e-3) this.T = 0;
    this.playing = true;
    this.publish();
  }

  pause() {
    this.playing = false;
    this.publish();
  }

  toggle() {
    if (this.waiting) this.continue();
    else if (this.playing) this.pause();
    else this.play();
  }

  seek(T: number) {
    this.poster = null;
    this.T = Math.min(this.film.duration, Math.max(0, T));
    this.waiting = null;
    this.over = {};
    this.overStates = {};
    this.publish();
  }

  /** Leave a "your turn" moment and carry on with the film. */
  continue() {
    const b = this.waiting;
    if (!b) return;
    this.waiting = null;
    this.over = {};
    this.overStates = {};
    this.T = b.end;
    this.playing = true;
    this.publish();
  }

  setRate(rate: number) {
    this.rate = rate;
  }

  /** Keep captions clear of the bottom `px` CSS pixels, where the controls are. */
  setBottomInset(px: number) {
    this.inset = Math.max(0, px);
  }

  setMode(mode: Mode) {
    this.mode = mode;
    if (mode === 'watch' && this.waiting) this.continue();
  }

  /** Live change while stopped at a "your turn" moment. */
  setValue(prop: string, value: number) {
    if (!this.waiting) return;
    this.over[prop] = value;
    if (prop === 'linear') this.overStates.eq = value > 0.5 ? EQ.yLinear : EQ.y;
    if (prop !== 'bt' && prop !== 'colT') this.live = 0;
  }

  value(prop: string): number {
    return this.reader().n(prop);
  }

  getTime() {
    return this.T;
  }

  reader(): Reader {
    return reader(this.film, this.T, this.over, this.overStates);
  }

  // ------------------------------------------------------------ loop

  private onFonts = () => {
    resetMathCache();
  };

  private publish() {
    const b = this.film.beatAt(this.T);
    const s = this.state.get();
    const ended = this.T >= this.film.duration - 1e-3;
    if (s.playing !== this.playing || s.beat !== b.index || s.chapter !== b.chapter || s.waiting !== this.waiting || s.ended !== ended) {
      this.state.set({ playing: this.playing, beat: b.index, chapter: b.chapter, waiting: this.waiting, ended });
    }
    if (this.time.get() !== this.T) this.time.set(this.T);
  }

  private resize() {
    const r = this.canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.max(1, Math.round(r.width));
    const H = Math.max(1, Math.round(r.height));
    if (W === this.W && H === this.H && dpr === this.dpr) return;
    this.W = W;
    this.H = H;
    this.dpr = dpr;
    this.canvas.width = Math.round(W * dpr);
    this.canvas.height = Math.round(H * dpr);
  }

  private frame = (now: number) => {
    const dt = Math.min(0.05, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    this.step(dt);
    // Nothing to draw while the film is hidden behind another view.
    if (this.W > 2 && this.H > 2) this.draw(now / 1000);
    this.raf = requestAnimationFrame(this.frame);
  };

  private step(dt: number) {
    if (this.playing && !this.waiting) {
      const next = this.T + dt * this.rate;
      const stop = this.mode === 'lesson' ? pauseBetween(this.film.beats, this.T, next) : undefined;
      if (stop) {
        this.T = stop.speakEnd;
        this.waiting = stop;
        this.live = 0;
        this.over = {};
        this.overStates = {};
      } else if (next >= this.film.duration) {
        this.T = this.film.duration;
        this.playing = false;
      } else {
        this.T = next;
      }
    }
    if (this.waiting) {
      this.live += dt;
      const base = reader(this.film, this.T);
      // Keep the throw looping so changes can be seen. (A full trace, as in the angle sweep, stays put.)
      if (base.n('bt') < 90) {
        const m = modelOf(this.reader());
        const land = landingTime(m);
        const flightTime = land && land > 0 ? land : 4.5;
        const period = flightTime + 1.1;
        this.over.bt = Math.min(this.live % period, flightTime);
      }
      if (base.n('column') > 0.5 && base.n('colMode') > 0.5) this.over.colT = Math.min(this.live % 5.2, 4);
    }
    this.publish();
  }

  private draw(clock: number) {
    const { ctx } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const k = Math.min(this.W / VW, this.H / VH);
    const ox = (this.W - VW * k) / 2;
    const oy = (this.H - VH * k) / 2;
    ctx.setTransform(k * this.dpr, 0, 0, k * this.dpr, ox * this.dpr, oy * this.dpr);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, VW, VH);
    ctx.clip();
    const r = this.poster !== null ? reader(this.film, this.poster) : this.reader();
    let cam: Cam | undefined;
    if (this.waiting) {
      // Glide the camera while the viewer changes numbers.
      const target = targetCamera(r);
      const prev = this.cam ?? target;
      const blend = this.still ? 1 : 0.12;
      this.cam = { scale: Math.exp(Math.log(prev.scale) + (Math.log(target.scale) - Math.log(prev.scale)) * blend) };
      cam = this.cam;
    } else this.cam = null;
    const safe = this.inset > 0 ? Math.min(VH, (this.H - this.inset - oy) / k) : VH;
    this.safe = this.still ? safe : this.safe + (safe - this.safe) * 0.2;
    renderFrame(ctx, r, {
      caption: this.captions && !this.waiting && this.poster === null ? this.film.caption(this.T) : null,
      clock,
      still: this.still,
      cam,
      safeBottom: this.safe,
    });
    ctx.restore();
  }
}

/** Draws the film at time T onto any canvas size (used for video export). */
export function drawFilmFrame(film: Film, ctx: CanvasRenderingContext2D, T: number, captions: boolean) {
  const { width, height } = ctx.canvas;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  const k = Math.min(width / VW, height / VH);
  ctx.setTransform(k, 0, 0, k, (width - VW * k) / 2, (height - VH * k) / 2);
  renderFrame(ctx, reader(film, T), { caption: captions ? film.caption(T) : null, clock: T });
}
