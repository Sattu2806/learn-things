/**
 * Films for every chapter, built from "shots". A shot is one idea: a few
 * lines of narration, an optional equation that builds at the top of the
 * frame, and a draw function that paints the picture at any moment. The
 * timeline (film/timeline.ts) times the narration, so subtitles, the
 * voiceover script, live playback and frame-by-frame video export all use
 * the same clock and the same pixels.
 *
 * Everything is drawn in a virtual 1920×1080 frame, white on black.
 */
import { SERIF, drawMath, layoutMath, type MathLayout } from '../../film/math';
import { Film } from '../../film/timeline';

export const VW = 1920;
export const VH = 1080;
export const SANS = '"Geist Variable", "Geist", ui-sans-serif, system-ui, sans-serif';
export const MONO = '"Geist Mono Variable", "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const smooth = (p: number) => {
  const q = clamp(p);
  return q * q * q * (q * (6 * q - 15) + 10);
};
/** Progress 0 → 1 while t goes from a to b, eased. */
export const ph = (t: number, a: number, b: number) => smooth((t - a) / (b - a));
export const DEG = Math.PI / 180;
export const TAU = Math.PI * 2;

/** One equation step: shown from `at` seconds into the shot (morphing from the step before). */
export interface EqStep {
  at: number;
  src: string;
}

export interface Shot {
  title: string;
  /** One caption per line; each line is a beat of narration. */
  say: string[];
  /** Equation(s) for the top of the frame. A string shows from 1.5 s. */
  eq?: string | EqStep[];
  /** Paints the picture. t is seconds into the shot, d the shot's length. */
  draw: (g: Gfx, t: number, d: number) => void;
}

export interface FilmSpec {
  title: string;
  /** Short line under the title on the opening card. */
  subtitle: string;
  shots: Shot[];
}

export interface ChapterFilm {
  spec: FilmSpec;
  film: Film;
  /** Draws moment T in the virtual frame (the context is already scaled). */
  frame: (ctx: CanvasRenderingContext2D, T: number, o?: { captions?: boolean; safeBottom?: number }) => void;
}

const OPEN = 4;
const white = (a: number) => `rgba(255,255,255,${clamp(a)})`;

export function buildChapterFilm(spec: FilmSpec): ChapterFilm {
  const film = new Film({});
  film.chapter('Title');
  film.beat('', undefined, { min: OPEN });
  for (const s of spec.shots) {
    film.chapter(s.title);
    s.say.forEach((line, i) => film.beat(line, undefined, { min: i === 0 ? 3 : 0 }));
  }
  // The title "chapter" is folded into the first shot so the chapter list matches the shots.
  const first = film.chapters[1];
  first.start = 0;
  film.chapters.shift();
  film.chapters.forEach((c, i) => (c.index = i));
  for (const b of film.beats) b.chapter = Math.max(0, b.chapter - 1);
  film.beat('', undefined, { min: 3 });
  film.chapters[film.chapters.length - 1].end = film.duration;

  const starts = spec.shots.map((_, i) => (i === 0 ? OPEN : film.chapters[i].start));
  const ends = spec.shots.map((_, i) => (i === spec.shots.length - 1 ? film.duration - 3 : film.chapters[i + 1].start));

  const frame: ChapterFilm['frame'] = (ctx, T, o = {}) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, VW, VH);
    const g = new Gfx(ctx);
    if (T < OPEN) {
      const a = Math.min(ph(T, 0.2, 1.2), 1 - ph(T, OPEN - 0.8, OPEN));
      g.text(spec.title, VW / 2, VH / 2 - 20, { size: 92, font: 'serif', alpha: a });
      g.text(spec.subtitle, VW / 2, VH / 2 + 70, { size: 34, alpha: a * 0.7 });
      g.line(VW / 2 - 140 * a, VH / 2 + 18, VW / 2 + 140 * a, VH / 2 + 18, { alpha: a * 0.5, width: 2 });
    } else if (T >= film.duration - 3) {
      const a = ph(T, film.duration - 3, film.duration - 2.2);
      g.text(spec.title, VW / 2, VH / 2 - 10, { size: 64, font: 'serif', alpha: a });
      g.text('Read the notes for worked examples and the formula sheet.', VW / 2, VH / 2 + 60, { size: 30, alpha: a * 0.6 });
    } else {
      let i = spec.shots.length - 1;
      while (i > 0 && T < starts[i]) i--;
      const s = spec.shots[i];
      const t = T - starts[i];
      const d = ends[i] - starts[i];
      const fade = Math.min(ph(t, 0, 0.6), 1 - ph(t, d - 0.5, d));
      ctx.save();
      ctx.globalAlpha = fade;
      s.draw(g, t, d);
      drawEq(g, s, t);
      ctx.restore();
      // Shot heading, top left.
      const ha = Math.min(ph(t, 0, 0.5), 1 - ph(t, d - 0.5, d));
      g.text(String(i + 1).padStart(2, '0'), 90, 80, { size: 26, font: 'mono', alpha: ha * 0.5, align: 'left' });
      g.text(s.title, 140, 80, { size: 26, alpha: ha * 0.75, align: 'left' });
    }
    if (o.captions !== false) {
      const c = film.caption(T);
      if (c) drawCaption(ctx, c.text, c.alpha, o.safeBottom ?? VH);
    }
  };
  return { spec, film, frame };
}

function drawEq(g: Gfx, s: Shot, t: number) {
  if (!s.eq) return;
  const steps = typeof s.eq === 'string' ? [{ at: 1.5, src: s.eq }] : s.eq;
  let k = -1;
  for (let i = 0; i < steps.length; i++) if (t >= steps[i].at) k = i;
  if (k < 0) return;
  const size = 62;
  const to = layoutMath(g.ctx, steps[k].src, size);
  const from: MathLayout | null = k > 0 ? layoutMath(g.ctx, steps[k - 1].src, size) : null;
  const p = clamp((t - steps[k].at) / 0.9);
  drawMath(g.ctx, from, to, p, VW / 2, 190, { alpha: k === 0 ? p : 1 });
}

function drawCaption(ctx: CanvasRenderingContext2D, text: string, alpha: number, bottom: number) {
  ctx.save();
  ctx.font = `400 34px ${SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(next).width > 1380 && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  const lh = 46;
  const y0 = Math.min(VH, bottom) - 50 - (lines.length - 1) * lh;
  const wmax = Math.max(...lines.map((l) => ctx.measureText(l).width));
  ctx.globalAlpha = alpha;
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.beginPath();
  ctx.roundRect(VW / 2 - wmax / 2 - 26, y0 - 40, wmax + 52, lines.length * lh + 18, 10);
  ctx.fill();
  ctx.fillStyle = '#fff';
  lines.forEach((l, i) => ctx.fillText(l, VW / 2, y0 + i * lh));
  ctx.restore();
}

// ------------------------------------------------------------------ drawing kit

interface Stroke {
  alpha?: number;
  width?: number;
  dash?: number[];
}

interface TextOpts {
  size?: number;
  alpha?: number;
  align?: CanvasTextAlign;
  font?: 'sans' | 'serif' | 'mono' | 'italic';
  base?: CanvasTextBaseline;
}

/** A thin wrapper round the canvas with the shapes physics films need. */
export class Gfx {
  constructor(readonly ctx: CanvasRenderingContext2D) {}

  private stroke(o: Stroke = {}) {
    const c = this.ctx;
    c.strokeStyle = white(o.alpha ?? 1);
    c.lineWidth = o.width ?? 3;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.setLineDash(o.dash ?? []);
    c.stroke();
    c.setLineDash([]);
  }

  line(x1: number, y1: number, x2: number, y2: number, o?: Stroke) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.stroke(o);
  }

  /** A polyline through points. */
  path(pts: [number, number][], o?: Stroke & { close?: boolean; fill?: number }) {
    if (pts.length < 2) return;
    const c = this.ctx;
    c.beginPath();
    c.moveTo(pts[0][0], pts[0][1]);
    for (const p of pts.slice(1)) c.lineTo(p[0], p[1]);
    if (o?.close) c.closePath();
    if (o?.fill) {
      c.fillStyle = white(o.fill);
      c.fill();
    }
    this.stroke(o);
  }

  /** The curve y = f(x) for x from x1 to x2 (screen units). */
  curve(f: (x: number) => number, x1: number, x2: number, o?: Stroke & { n?: number }) {
    const n = o?.n ?? 200;
    const pts: [number, number][] = [];
    for (let i = 0; i <= n; i++) {
      const x = lerp(x1, x2, i / n);
      pts.push([x, f(x)]);
    }
    this.path(pts, o);
  }

  /** An arrow from (x1, y1) to (x2, y2). */
  arrow(x1: number, y1: number, x2: number, y2: number, o: Stroke & { label?: string; head?: number } = {}) {
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (len < 2) return;
    const a = Math.atan2(y2 - y1, x2 - x1);
    const h = Math.min(o.head ?? 20, len * 0.5);
    this.line(x1, y1, x2 - Math.cos(a) * h * 0.6, y2 - Math.sin(a) * h * 0.6, o);
    const c = this.ctx;
    c.beginPath();
    c.moveTo(x2, y2);
    c.lineTo(x2 - h * Math.cos(a - 0.4), y2 - h * Math.sin(a - 0.4));
    c.lineTo(x2 - h * Math.cos(a + 0.4), y2 - h * Math.sin(a + 0.4));
    c.closePath();
    c.fillStyle = white(o.alpha ?? 1);
    c.fill();
    if (o.label) {
      const nx = -Math.sin(a);
      const ny = Math.cos(a);
      this.text(o.label, x2 + Math.cos(a) * 26 + nx * 0, y2 + Math.sin(a) * 26 + ny * 0 + 12, { size: 40, font: 'italic', alpha: o.alpha });
    }
  }

  circle(x: number, y: number, r: number, o: Stroke & { fill?: number } = {}) {
    const c = this.ctx;
    c.beginPath();
    c.arc(x, y, Math.max(0, r), 0, TAU);
    if (o.fill !== undefined) {
      c.fillStyle = white(o.fill * (o.alpha ?? 1));
      c.fill();
    }
    if (o.width !== 0) this.stroke(o);
  }

  /** A filled ball with a soft glow. */
  ball(x: number, y: number, r = 16, alpha = 1) {
    const c = this.ctx;
    const gr = c.createRadialGradient(x, y, 0, x, y, r * 3);
    gr.addColorStop(0, white(0.35 * alpha));
    gr.addColorStop(1, white(0));
    c.fillStyle = gr;
    c.beginPath();
    c.arc(x, y, r * 3, 0, TAU);
    c.fill();
    this.circle(x, y, r, { fill: 1, alpha, width: 0 });
  }

  arc(x: number, y: number, r: number, a1: number, a2: number, o?: Stroke) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, a1, a2, a2 < a1);
    this.stroke(o);
  }

  rect(x: number, y: number, w: number, h: number, o: Stroke & { fill?: number } = {}) {
    const c = this.ctx;
    c.beginPath();
    c.rect(x, y, w, h);
    if (o.fill !== undefined) {
      c.fillStyle = white(o.fill * (o.alpha ?? 1));
      c.fill();
    }
    if (o.width !== 0) this.stroke(o);
  }

  /** A block centred at (x, y), optionally turned by angle a (radians) and labelled. */
  block(x: number, y: number, w: number, h: number, o: { a?: number; label?: string; alpha?: number; fill?: number } = {}) {
    const c = this.ctx;
    c.save();
    c.translate(x, y);
    c.rotate(o.a ?? 0);
    this.rect(-w / 2, -h / 2, w, h, { fill: o.fill ?? 0.12, alpha: o.alpha });
    if (o.label) this.text(o.label, 0, 12, { size: 34, font: 'italic', alpha: o.alpha });
    c.restore();
  }

  /** A zigzag spring from (x1, y1) to (x2, y2). */
  spring(x1: number, y1: number, x2: number, y2: number, o: Stroke & { coils?: number; amp?: number } = {}) {
    const n = (o.coils ?? 10) * 2;
    const amp = o.amp ?? 18;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const pts: [number, number][] = [[x1, y1]];
    const lead = 0.08;
    pts.push([x1 + dx * lead, y1 + dy * lead]);
    for (let i = 1; i < n; i++) {
      const p = lead + ((1 - 2 * lead) * i) / n;
      const s = i % 2 ? amp : -amp;
      pts.push([x1 + dx * p + nx * s, y1 + dy * p + ny * s]);
    }
    pts.push([x1 + dx * (1 - lead), y1 + dy * (1 - lead)]);
    pts.push([x2, y2]);
    this.path(pts, { width: 2.5, ...o });
  }

  /** A hatched ground or wall line from (x1, y1) to (x2, y2). */
  ground(x1: number, y1: number, x2: number, y2: number, alpha = 0.8) {
    this.line(x1, y1, x2, y2, { alpha, width: 3 });
    const len = Math.hypot(x2 - x1, y2 - y1);
    const ux = (x2 - x1) / len;
    const uy = (y2 - y1) / len;
    for (let s = 10; s < len; s += 26) {
      const x = x1 + ux * s;
      const y = y1 + uy * s;
      this.line(x, y, x - 14 + uy * 14, y + 14 - ux * 0, { alpha: alpha * 0.35, width: 2 });
    }
  }

  text(s: string, x: number, y: number, o: TextOpts = {}) {
    const c = this.ctx;
    const size = o.size ?? 32;
    const f = o.font ?? 'sans';
    c.font = f === 'serif' ? `400 ${size}px ${SERIF}` : f === 'italic' ? `italic 400 ${size}px ${SERIF}` : f === 'mono' ? `400 ${size}px ${MONO}` : `400 ${size}px ${SANS}`;
    c.textAlign = o.align ?? 'center';
    c.textBaseline = o.base ?? 'alphabetic';
    c.fillStyle = white(o.alpha ?? 1);
    c.fillText(s, x, y);
  }

  /** An equation in the film's maths notation, centred on x. */
  math(src: string, x: number, y: number, size = 48, alpha = 1) {
    if (alpha <= 0.01) return;
    drawMath(this.ctx, null, layoutMath(this.ctx, src, size), 1, x, y, { alpha });
  }

  /** Axes with an origin at (x0, y0), w wide and h tall, and labels. */
  axes(x0: number, y0: number, w: number, h: number, o: { x?: string; y?: string; alpha?: number; down?: number } = {}) {
    const a = o.alpha ?? 0.8;
    this.arrow(x0, y0, x0 + w, y0, { alpha: a, width: 2.5, head: 16 });
    this.arrow(x0, y0 + (o.down ?? 0), x0, y0 - h, { alpha: a, width: 2.5, head: 16 });
    if (o.x) this.text(o.x, x0 + w + 30, y0 + 12, { size: 38, font: 'italic', alpha: a });
    if (o.y) this.text(o.y, x0, y0 - h - 24, { size: 38, font: 'italic', alpha: a });
  }

  /** Runs fn with the canvas moved, turned and faded; restores afterwards. */
  with(o: { x?: number; y?: number; a?: number; alpha?: number; scale?: number }, fn: () => void) {
    const c = this.ctx;
    c.save();
    c.translate(o.x ?? 0, o.y ?? 0);
    if (o.a) c.rotate(o.a);
    if (o.scale) c.scale(o.scale, o.scale);
    if (o.alpha !== undefined) c.globalAlpha *= clamp(o.alpha);
    fn();
    c.restore();
  }
}
