/**
 * The cinematic black-and-white canvas for the living-equations lesson.
 *
 * It draws a throw term by term: the straight no-gravity line with a hollow
 * "ghost" ball on it, the real ball hanging ½gt² below the ghost, and bars
 * that show what each term of the equation measures. Everything is white on
 * black; emphasis comes from brightness, glow and line style only.
 */
import { Sound } from './audio';
import { flight, landingTime, metres, niceStep, termsAt, type Model, type TermId } from './model';

export type Frame = 'parabola' | 'ghost';
type Role = TermId | 'path' | 'ghost';

export interface Scene {
  model: Model;
  /** Dotted path of the correct equations, shown when the model has a mistake. */
  reference: boolean;
  /** The hollow ghost ball on the no-gravity line. */
  ghost: boolean;
  /** Seconds between strobe dots; 0 for none. */
  ticks: number;
  /** At each strobe dot, draw the drop below the line (the t² pattern). */
  tickDrops: boolean;
  /** Term bars to always show (focusing a term also shows its bar). */
  bars: TermId[];
  /** Mark the landing distance. */
  range: boolean;
  /** Dim everything except this term. */
  focus: TermId | null;
  /** Fit the parabola, or the parabola plus the ghost's whole climb. */
  frame: Frame;
  /** At landing, show that the drop has caught up with the rise. */
  landingFlash: boolean;
}

export interface TimeSnapshot {
  t: number;
  end: number;
  playing: boolean;
  /** False when the ball never comes back down (or never leaves the ground). */
  lands: boolean;
  grounded: boolean;
}

const SERIF = '"Instrument Serif", "Iowan Old Style", Georgia, serif';
const MONO = '"Geist Mono Variable", "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const R = 6.5;

const white = (a: number) => `rgba(255,255,255,${Math.max(0, Math.min(1, a))})`;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

const FOCUS: Record<TermId, Record<Role, number>> = {
  run: { run: 1, rise: 0.15, drop: 0.15, path: 0.35, ghost: 0.45 },
  rise: { run: 0.15, rise: 1, drop: 0.15, path: 0.35, ghost: 1 },
  drop: { run: 0.15, rise: 0.15, drop: 1, path: 0.6, ghost: 0.7 },
};

export const DEFAULT_SCENE: Scene = {
  model: { v: 20, theta: 45, g: 9.8, run: true, rise: true, drop: true, bugs: { noHalf: false, linear: false, plus: false, swap: false } },
  reference: false,
  ghost: true,
  ticks: 0.5,
  tickDrops: false,
  bars: [],
  range: false,
  focus: null,
  frame: 'ghost',
  landingFlash: false,
};

export class EquationStage {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly ro: ResizeObserver;
  private readonly motion: MediaQueryList;
  private readonly sound = new Sound();
  private readonly listeners = new Set<() => void>();

  private W = 0;
  private H = 0;
  private dpr = 1;
  private insets = { top: 56, bottom: 160 };
  private L = { anchorX: 80, groundY: 400, fitTop: 80, right: 40 };
  private scene: Scene = DEFAULT_SCENE;

  private scale = 10;
  private scaleTarget = 10;
  private scaleReady = false;
  private t = 0;
  private end = 3;
  private lands = true;
  private grounded = false;
  private playing = true;
  private speed = 1;
  private hold = 0;
  private fade = 1;
  private restarting = false;
  private dims: Record<Role, number> = { run: 1, rise: 1, drop: 1, path: 1, ghost: 1 };

  private clock = 0;
  private last = 0;
  private raf = 0;
  private frameNo = 0;
  private lastTick = 0;
  private flashes = new Map<number, number>();
  private landedClock = -10;
  private noise: HTMLCanvasElement[] = [];
  private still = false;
  private snap: TimeSnapshot = { t: 0, end: 3, playing: true, lands: true, grounded: false };

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D is not available');
    this.canvas = canvas;
    this.ctx = ctx;
    this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.still = this.motion.matches;
    this.motion.addEventListener('change', this.onMotion);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    canvas.addEventListener('pointerdown', this.onPointer);
    this.makeNoise();
    this.resize();
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  // ------------------------------------------------------------- public API

  destroy() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.motion.removeEventListener('change', this.onMotion);
    this.canvas.removeEventListener('pointerdown', this.onPointer);
  }

  /** For React's useSyncExternalStore. */
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = (): TimeSnapshot => this.snap;

  setScene(s: Partial<Scene>) {
    this.scene = { ...this.scene, ...s };
    this.computeEnd();
    if (this.t > this.end) this.t = this.end;
    this.publish();
  }

  setInsets(top: number, bottom: number) {
    if (Math.abs(top - this.insets.top) < 1 && Math.abs(bottom - this.insets.bottom) < 1) return;
    this.insets = { top, bottom };
    this.layout();
  }

  setSound(on: boolean) {
    this.sound.enabled = on;
  }

  setSpeed(s: number) {
    this.speed = s;
  }

  unlockAudio() {
    this.sound.unlock();
  }

  play() {
    if (this.t >= this.end - 1e-6) this.restart();
    this.playing = true;
    this.publish();
  }

  pause() {
    this.playing = false;
    this.publish();
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }

  /** Jump to a moment (pauses playback). */
  seek(t: number) {
    this.playing = false;
    this.restarting = false;
    this.fade = 1;
    this.t = clamp(t, 0, this.end);
    this.hold = 0;
    this.lastTick = this.tickIndex(this.t);
    this.publish();
  }

  restart() {
    this.t = 0;
    this.hold = 0;
    this.fade = 1;
    this.restarting = false;
    this.lastTick = 0;
    this.flashes.clear();
    this.publish();
  }

  // ------------------------------------------------------------- internals

  private onMotion = () => {
    this.still = this.motion.matches;
  };

  private onPointer = () => {
    this.sound.unlock();
    this.toggle();
  };

  private publish() {
    const s = this.snap;
    if (s.t === this.t && s.end === this.end && s.playing === this.playing && s.lands === this.lands && s.grounded === this.grounded) return;
    this.snap = { t: this.t, end: this.end, playing: this.playing, lands: this.lands, grounded: this.grounded };
    for (const fn of this.listeners) fn();
  }

  private makeNoise() {
    this.noise = Array.from({ length: 4 }, () => {
      const c = document.createElement('canvas');
      c.width = 192;
      c.height = 192;
      const g = c.getContext('2d')!;
      const img = g.createImageData(192, 192);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = Math.random() * 20;
      }
      g.putImageData(img, 0, 0);
      return c;
    });
  }

  private resize() {
    const r = this.canvas.getBoundingClientRect();
    const W = Math.max(1, Math.round(r.width));
    const H = Math.max(1, Math.round(r.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (W !== this.W || H !== this.H || dpr !== this.dpr) {
      this.W = W;
      this.H = H;
      this.dpr = dpr;
      this.canvas.width = Math.round(W * dpr);
      this.canvas.height = Math.round(H * dpr);
    }
    this.layout();
  }

  private layout() {
    const small = this.W < 640;
    const groundY = Math.round(Math.max(this.H * 0.4, this.H - this.insets.bottom - (small ? 26 : 34)));
    this.L = {
      anchorX: Math.round(clamp(this.W * 0.09, 40, 130)),
      groundY,
      fitTop: Math.min(groundY - 60, this.insets.top + (small ? 18 : 28)),
      right: small ? 26 : 56,
    };
    this.scaleTarget = this.fitScale();
    if (!this.scaleReady) {
      this.scale = this.scaleTarget;
      this.scaleReady = true;
    }
    this.computeEnd();
  }

  private fitScale(): number {
    const m = this.scene.model;
    const f = flight(m.v, m.theta, m.g);
    const X = Math.max(f.R, 8) * 1.05;
    const Y = Math.max(this.scene.frame === 'ghost' ? Math.max(f.H, f.ghostTop) : f.H, 3) * 1.08;
    const availW = Math.max(60, this.W - this.L.anchorX - this.L.right);
    const availH = Math.max(60, this.L.groundY - this.L.fitTop);
    return Math.min(availW / X, availH / Y);
  }

  private computeEnd() {
    const m = this.scene.model;
    this.scaleTarget = this.fitScale();
    const land = landingTime(m);
    const f = flight(m.v, m.theta, m.g);
    this.grounded = land === 0;
    if (land !== null && land > 0) {
      this.lands = true;
      this.end = Math.min(land, 120);
      return;
    }
    this.lands = false;
    const cap = Math.max(3, f.T * 1.5);
    const maxX = (this.W - this.L.anchorX + 40) / this.scaleTarget;
    const maxY = (this.L.groundY + 40) / this.scaleTarget;
    let t = 0;
    for (; t < cap; t += 1 / 60) {
      const k = termsAt(m, t);
      if (k.x > maxX || k.y > maxY) break;
    }
    this.end = Math.max(0.8, Math.min(t, cap));
  }

  private tickIndex(t: number) {
    const dt = this.scene.ticks;
    return dt > 0 ? Math.floor(t / dt + 1e-9) : 0;
  }

  private frame = (now: number) => {
    const dt = clamp((now - this.last) / 1000, 0, 0.05);
    this.last = now;
    this.update(dt);
    this.render();
    this.raf = requestAnimationFrame(this.frame);
  };

  private update(dt: number) {
    this.clock += dt;
    this.frameNo++;
    // Camera glides to the new framing.
    const k = this.still ? 1 : 1 - Math.exp(-dt * 3.2);
    this.scale = Math.exp(Math.log(this.scale) + (Math.log(this.scaleTarget) - Math.log(this.scale)) * k);
    // Depth of field: dim what isn't in focus.
    const f = this.scene.focus;
    const kd = this.still ? 1 : 1 - Math.exp(-dt * 9);
    for (const role of Object.keys(this.dims) as Role[]) {
      const target = f ? FOCUS[f][role] : 1;
      this.dims[role] += (target - this.dims[role]) * kd;
    }

    if (this.restarting) {
      this.fade -= dt / 0.45;
      if (this.fade <= 0) {
        this.restart();
        this.fade = 0;
        this.restarting = false;
        this.playing = true;
      }
    } else if (this.fade < 1) {
      this.fade = Math.min(1, this.fade + dt / 0.35);
    }

    if (this.playing && !this.restarting) {
      if (this.t < this.end) {
        this.t = Math.min(this.end, this.t + dt * this.speed);
        const idx = this.tickIndex(Math.min(this.t, this.end));
        while (this.lastTick < idx) {
          this.lastTick++;
          this.flashes.set(this.lastTick, this.clock);
          if (this.scene.ticks >= 0.25) this.sound.tick();
        }
        if (this.t >= this.end) {
          this.hold = 0;
          if (this.lands) {
            this.landedClock = this.clock;
            this.sound.land(0.6);
          }
        }
      } else {
        this.hold += dt;
        if (this.hold > (this.lands ? 1.6 : 1.1)) this.restarting = true;
      }
    }
    this.publish();
  }

  // ------------------------------------------------------------- drawing

  private sx(x: number) {
    return this.L.anchorX + x * this.scale;
  }

  /** Screen y of a ball's centre at height y (the ball rests on the ground at y = 0). */
  private by(y: number) {
    return this.L.groundY - y * this.scale - R;
  }

  private label(text: string, x: number, y: number, font: string, alpha: number, align: CanvasTextAlign = 'left', base: CanvasTextBaseline = 'middle') {
    const { ctx } = this;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.textBaseline = base;
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(0,0,0,0.85)';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = white(alpha);
    ctx.fillText(text, x, y);
  }

  private render() {
    const { ctx, W, H } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    const gy = this.L.groundY;

    // A soft pool of light on the floor, like a single spotlight.
    const pool = ctx.createRadialGradient(W * 0.45, gy, 0, W * 0.45, gy, Math.max(W, H) * 0.75);
    pool.addColorStop(0, white(0.07));
    pool.addColorStop(1, white(0));
    ctx.fillStyle = pool;
    ctx.fillRect(0, 0, W, H);

    const m = this.scene.model;
    const runVisible = this.scene.focus === 'run' || this.scene.bars.includes('run') || (this.scene.range && this.lands && this.t >= this.end);
    this.drawGround(!runVisible);

    const f = flight(m.v, m.theta, m.g);
    const t = Math.min(this.t, this.end);
    const now = termsAt(m, t);
    const ball = { x: now.x, y: this.grounded ? 0 : Math.max(0, now.y) };
    const ghostOn = this.scene.ghost || this.scene.focus === 'rise' || this.scene.focus === 'run' || this.scene.bars.includes('rise');
    const A = this.fade;

    if (this.scene.reference) this.drawReference(f.T);
    if (ghostOn) this.drawLaunchLine(A);
    if (this.scene.ticks > 0) this.drawTicks(t, ghostOn, A);
    this.drawTrail(t, A);

    const showRun = runVisible;
    const showRise = this.scene.focus === 'rise' || this.scene.bars.includes('rise');
    const showDrop = m.drop && (this.scene.ghost || this.scene.focus === 'drop' || this.scene.bars.includes('drop'));
    if (showRun) this.drawRunBar(ball.x, A);
    if (showRise) this.drawRiseBar(now.run, now.rise, A);
    if (showDrop && now.drop * this.scale > 3) this.drawDropBar(now.run, now.rise, ball.y, now.drop, A);

    if (ghostOn) this.drawGhostBall(now.run, now.rise, A);
    this.drawBall(ball.x, ball.y, A);

    if (this.lands && this.t >= this.end - 1e-6) this.drawLanding(ball.x, A);
    this.drawGrain();
    this.drawVignette();
  }

  private drawGround(labels: boolean) {
    const { ctx, W, H } = this;
    const gy = this.L.groundY;
    const floor = ctx.createLinearGradient(0, gy, 0, H);
    floor.addColorStop(0, white(0.035));
    floor.addColorStop(1, white(0));
    ctx.fillStyle = floor;
    ctx.fillRect(0, gy, W, H - gy);
    const line = ctx.createLinearGradient(0, 0, W, 0);
    line.addColorStop(0, white(0));
    line.addColorStop(0.08, white(0.42));
    line.addColorStop(0.92, white(0.42));
    line.addColorStop(1, white(0));
    ctx.fillStyle = line;
    ctx.fillRect(0, gy, W, 1);

    const step = niceStep(70 / this.scale);
    ctx.font = `400 11px ${MONO}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    let first = true;
    for (let x = 0; ; x += step) {
      const sx = this.sx(x);
      if (sx > W - 10) break;
      ctx.fillStyle = white(0.28);
      ctx.fillRect(sx - 0.5, gy + 4, 1, 5);
      ctx.fillStyle = white(labels ? 0.38 : 0);
      const n = Number.isInteger(x) ? String(x) : x.toFixed(1);
      if (labels) ctx.fillText(x === 0 ? '0' : first ? `${n} m` : n, sx, gy + 13);
      if (x > 0) first = false;
    }
  }

  private drawReference(T: number) {
    const { ctx } = this;
    const ref = { ...this.scene.model, run: true, rise: true, drop: true, bugs: { noHalf: false, linear: false, plus: false, swap: false } };
    ctx.fillStyle = white(0.4 * this.fade);
    let px = -99;
    let py = -99;
    for (let i = 0; i <= 400; i++) {
      const k = termsAt(ref, (T * i) / 400);
      const X = this.sx(k.x);
      const Y = this.by(Math.max(0, k.y));
      if (Math.hypot(X - px, Y - py) < 7) continue;
      px = X;
      py = Y;
      ctx.beginPath();
      ctx.arc(X, Y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    const at = termsAt(ref, T * 0.8);
    this.label('correct path', this.sx(at.x) + 12, this.by(at.y), `italic 400 16px ${SERIF}`, 0.6 * this.fade, 'left');
  }

  private drawLaunchLine(A: number) {
    const { ctx } = this;
    const m = this.scene.model;
    const dir = termsAt(m, 1);
    const len = Math.hypot(dir.run, dir.rise);
    if (len < 1e-6) return;
    const ux = dir.run / len;
    const uy = dir.rise / len;
    const far = Math.max(this.W, this.H) * 2;
    const x0 = this.sx(0);
    const y0 = this.by(0);
    ctx.save();
    ctx.setLineDash([3, 7]);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = white(0.42 * this.dims.ghost * A);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + ux * far, y0 - uy * far);
    ctx.stroke();
    ctx.restore();
    // Name the line once, near its start, on the side away from the ball.
    const d = Math.min(220, (this.W - x0) * 0.32);
    const lx = x0 + ux * d;
    const ly = y0 - uy * d;
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(-Math.atan2(uy, ux));
    this.label('no gravity', 0, -12, `italic 400 15px ${SERIF}`, 0.55 * this.dims.ghost * A, 'center');
    ctx.restore();
  }

  private drawTicks(t: number, ghostOn: boolean, A: number) {
    const { ctx } = this;
    const m = this.scene.model;
    const ballX = this.sx(termsAt(m, t).x);
    const dt = this.scene.ticks;
    const n = Math.floor(Math.min(t, this.end) / dt + 1e-9);
    const first = termsAt(m, dt).drop;
    for (let i = 1; i <= n; i++) {
      const k = termsAt(m, i * dt);
      const X = this.sx(k.x);
      const Yb = this.by(this.grounded ? 0 : Math.max(0, k.y));
      const Yg = this.by(k.rise);
      if (this.scene.tickDrops && ghostOn && k.drop * this.scale > 4) {
        ctx.save();
        ctx.setLineDash([2, 3]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = white(0.55 * this.dims.drop * A);
        ctx.beginPath();
        ctx.moveTo(this.sx(k.run), Yg);
        ctx.lineTo(X, Yb);
        ctx.stroke();
        ctx.restore();
        if (Math.abs(X - ballX) > 64) {
          const ratio = first > 0 ? k.drop / first : 0;
          const r = Math.abs(ratio - Math.round(ratio)) < 0.01 ? String(Math.round(ratio)) : ratio.toFixed(1);
          this.label(`${r}×`, X + 9, (Yg + Yb) / 2, `italic 400 18px ${SERIF}`, 0.85 * this.dims.drop * A);
          this.label(metres(k.drop), X + 9, (Yg + Yb) / 2 + 17, `400 11px ${MONO}`, 0.5 * this.dims.drop * A);
        }
      }
      if (ghostOn) {
        ctx.beginPath();
        ctx.arc(this.sx(k.run), Yg, 3, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = white(0.55 * this.dims.ghost * A);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(X, Yb, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = white(0.85 * this.dims.path * A);
      ctx.fill();
      const age = this.clock - (this.flashes.get(i) ?? -10);
      if (age < 0.4 && !this.still) {
        const g = ctx.createRadialGradient(X, Yb, 0, X, Yb, 22);
        g.addColorStop(0, white(0.5 * (1 - age / 0.4) * A));
        g.addColorStop(1, white(0));
        ctx.fillStyle = g;
        ctx.fillRect(X - 22, Yb - 22, 44, 44);
      }
    }
  }

  private drawTrail(t: number, A: number) {
    if (t <= 0) return;
    const { ctx } = this;
    const m = this.scene.model;
    const steps = 180;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const k = termsAt(m, (t * i) / steps);
      const X = this.sx(k.x);
      const Y = this.by(this.grounded ? 0 : Math.max(0, k.y));
      if (i === 0) ctx.moveTo(X, Y);
      else ctx.lineTo(X, Y);
    }
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = white(0.08 * this.dims.path * A);
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.strokeStyle = white(0.9 * this.dims.path * A);
    ctx.lineWidth = 1.6;
    ctx.stroke();
  }

  private caps(x: number, y0: number, y1: number, alpha: number) {
    const { ctx } = this;
    ctx.fillStyle = white(alpha);
    ctx.fillRect(x - 5, y0 - 0.75, 10, 1.5);
    ctx.fillRect(x - 5, y1 - 0.75, 10, 1.5);
  }

  private drawDropBar(run: number, rise: number, y: number, drop: number, A: number) {
    const { ctx } = this;
    const m = this.scene.model;
    const X = this.sx(run);
    const gy = this.by(rise);
    const bY = this.by(y);
    const a = this.dims.drop * A;
    const y0 = Math.min(gy, bY) + R + 3;
    const y1 = Math.max(gy, bY) - R - 3;
    if (y1 - y0 < 4) return;
    const glow = ctx.createLinearGradient(X - 8, 0, X + 8, 0);
    glow.addColorStop(0, white(0));
    glow.addColorStop(0.5, white(0.12 * a));
    glow.addColorStop(1, white(0));
    ctx.fillStyle = glow;
    ctx.fillRect(X - 8, y0, 16, y1 - y0);
    ctx.fillStyle = white(0.95 * a);
    ctx.fillRect(X - 0.75, y0, 1.5, y1 - y0);
    this.caps(X, y0, y1, 0.95 * a);
    if (Math.abs(y1 - y0) > 22) {
      const name = `${m.bugs.noHalf ? '' : '½'}g${m.bugs.linear ? 't' : 't²'}`;
      const mid = (y0 + y1) / 2;
      this.label(name, X + 12, mid - 8, `italic 400 21px ${SERIF}`, a);
      this.label(metres(drop), X + 12, mid + 12, `400 12px ${MONO}`, 0.65 * a);
    }
  }

  private drawRiseBar(run: number, rise: number, A: number) {
    const { ctx } = this;
    const m = this.scene.model;
    const X = this.sx(run);
    const y0 = this.by(0);
    const y1 = this.by(rise) + R + 3;
    const a = this.dims.rise * A;
    if (y0 - y1 < 4) return;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = white(0.9 * a);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(X, y0);
    ctx.lineTo(X, y1);
    ctx.stroke();
    ctx.restore();
    this.caps(X, y0, y1, 0.9 * a);
    if (Math.abs(y1 - y0) > 22) {
      const name = m.bugs.swap ? 'v cos θ t' : 'v sin θ t';
      const mid = (y0 + y1) / 2;
      this.label(name, X - 12, mid - 8, `italic 400 21px ${SERIF}`, a, 'right');
      this.label(metres(rise), X - 12, mid + 12, `400 12px ${MONO}`, 0.65 * a, 'right');
    }
  }

  private drawRunBar(x: number, A: number) {
    const { ctx } = this;
    const m = this.scene.model;
    const x0 = this.sx(0);
    const x1 = this.sx(x);
    const y = this.L.groundY + 10;
    const a = this.dims.run * A;
    ctx.fillStyle = white(0.9 * a);
    ctx.fillRect(Math.min(x0, x1), y - 0.75, Math.abs(x1 - x0), 1.5);
    ctx.fillRect(x0 - 0.75, y - 4, 1.5, 8);
    ctx.fillRect(x1 - 0.75, y - 4, 1.5, 8);
    if (Math.abs(x1 - x0) > 90) {
      const name = m.bugs.swap ? 'v sin θ t' : 'v cos θ t';
      const mid = (x0 + x1) / 2;
      ctx.font = `italic 400 18px ${SERIF}`;
      const wName = ctx.measureText(name).width;
      ctx.font = `400 12px ${MONO}`;
      const wVal = ctx.measureText(metres(x)).width;
      const left = mid - (wName + 10 + wVal) / 2;
      this.label(name, left, y + 15, `italic 400 18px ${SERIF}`, a, 'left');
      this.label(metres(x), left + wName + 10, y + 16, `400 12px ${MONO}`, 0.7 * a, 'left');
    }
  }

  private drawGhostBall(run: number, rise: number, A: number) {
    const { ctx } = this;
    const X = this.sx(run);
    const Y = this.by(rise);
    if (Y < -20 || X > this.W + 20) return;
    ctx.beginPath();
    ctx.arc(X, Y, R, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = white(0.8 * this.dims.ghost * A);
    ctx.stroke();
  }

  private drawBall(x: number, y: number, A: number) {
    const { ctx } = this;
    const X = this.sx(x);
    const Y = this.by(y);
    const a = Math.max(0.35, this.dims.path) * A;
    const g = ctx.createRadialGradient(X, Y, 0, X, Y, R * 4.5);
    g.addColorStop(0, white(0.42 * a));
    g.addColorStop(1, white(0));
    ctx.fillStyle = g;
    ctx.fillRect(X - R * 4.5, Y - R * 4.5, R * 9, R * 9);
    const body = ctx.createRadialGradient(X - R * 0.35, Y - R * 0.4, 0.5, X, Y, R);
    body.addColorStop(0, white(a));
    body.addColorStop(1, white(0.82 * a));
    ctx.beginPath();
    ctx.arc(X, Y, R, 0, Math.PI * 2);
    ctx.fillStyle = body;
    ctx.fill();
  }

  private drawLanding(x: number, A: number) {
    const { ctx } = this;
    const X = this.sx(x);
    const gy = this.L.groundY;
    const age = this.clock - this.landedClock;
    if (age < 0.9 && !this.still) {
      const f = age / 0.9;
      ctx.beginPath();
      ctx.ellipse(X, gy, 8 + easeOut(f) * 46, 3 + easeOut(f) * 9, 0, 0, Math.PI * 2);
      ctx.strokeStyle = white(0.6 * (1 - f) * A);
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.fillStyle = white(0.85 * A);
    ctx.fillRect(X - 0.75, gy - 7, 1.5, 14);
    if (this.scene.landingFlash) {
      const m = this.scene.model;
      const k = termsAt(m, this.end);
      const top = this.by(k.rise);
      const pulse = this.still ? 1 : 0.75 + 0.25 * Math.sin(this.clock * 4);
      const g = ctx.createLinearGradient(X - 14, 0, X + 14, 0);
      g.addColorStop(0, white(0));
      g.addColorStop(0.5, white(0.22 * pulse * A));
      g.addColorStop(1, white(0));
      ctx.fillStyle = g;
      ctx.fillRect(X - 14, top, 28, this.by(0) - top);
      this.label('drop = rise', X, top - 26, `italic 400 24px ${SERIF}`, A, 'center');
    }
    if (this.scene.range) {
      this.label(`R = ${metres(x)}`, X + 12, gy - 18, `500 13px ${MONO}`, 0.95 * A);
    }
  }

  private drawGrain() {
    if (!this.noise.length) return;
    const { ctx } = this;
    const tile = this.noise[this.still ? 0 : this.frameNo % this.noise.length];
    const pattern = ctx.createPattern(tile, 'repeat');
    if (!pattern) return;
    ctx.save();
    if (!this.still) ctx.translate(((this.frameNo * 37) % 192) - 96, ((this.frameNo * 61) % 192) - 96);
    ctx.fillStyle = pattern;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(-192, -192, this.W + 384, this.H + 384);
    ctx.restore();
  }

  private drawVignette() {
    const { ctx, W, H } = this;
    const r = Math.max(W, H);
    const g = ctx.createRadialGradient(W / 2, H * 0.48, r * 0.28, W / 2, H * 0.48, r * 0.78);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.62)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
}
