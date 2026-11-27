/**
 * Shared pieces for the shorts: timing from the measured voice lines,
 * easing, captions, and the morphing equation strip at the top.
 */
import { SERIF, drawMath, layoutMath, type MathLayout } from '../film/math';

export const SW = 1080;
export const SH = 1920;
export const CX = SW / 2;
export const SANS = '"Geist Variable", "Geist", system-ui, sans-serif';
export { SERIF };
const GAP = 0.35;
const LEAD = 0.4;

export interface Line {
  text: string;
  dur: number;
  start: number;
  end: number;
}

export const clamp = (x: number) => Math.max(0, Math.min(1, x));
export const ease = (p: number) => {
  const q = clamp(p);
  return q * q * (3 - 2 * q);
};
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const white = (a: number) => `rgba(255,255,255,${clamp(a)})`;
export const gray = (a: number, alpha = 1) => `rgba(255,255,255,${clamp(a * alpha)})`;

/** Beats start with their line of narration: LEAD, then each line plus GAP. */
export function timing(voice: [string, number][]) {
  const LINES: Line[] = voice.map(([text, dur], i, all) => {
    const start = LEAD + all.slice(0, i).reduce((s, [, d]) => s + d + GAP, 0);
    return { text, dur, start, end: start + dur };
  });
  const DURATION = LINES[LINES.length - 1].end + 1.6;
  /** Progress through line i's beat, from `a` to `b` seconds after it starts. */
  const at = (t: number, i: number, a = 0, b = 1) => ease((t - LINES[i].start - a) / (b - a));
  return { LINES, DURATION, at };
}

export function background(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, SW, SH);
  const glow = ctx.createRadialGradient(CX, 1000, 0, CX, 1000, 1100);
  glow.addColorStop(0, white(0.07));
  glow.addColorStop(1, white(0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SW, SH);
}

export function text(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, font: string, alpha: number, align: CanvasTextAlign = 'center', color = '255,255,255') {
  if (alpha <= 0.01) return;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(${color},${clamp(alpha)})`;
  ctx.fillText(s, x, y);
}

export function wrap(ctx: CanvasRenderingContext2D, s: string, max: number) {
  const out: string[] = [];
  let line = '';
  for (const w of s.split(' ')) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > max && line) {
      out.push(line);
      line = w;
    } else line = next;
  }
  if (line) out.push(line);
  return out;
}

/** Big centred captions, for watching with the sound off. */
export function captions(ctx: CanvasRenderingContext2D, lines: Line[], t: number) {
  const L = lines.find((l) => t >= l.start && t <= l.end + GAP);
  if (!L) return;
  const a = clamp(Math.min((t - L.start) / 0.2, (L.end + GAP - t) / 0.2));
  ctx.font = `600 56px ${SANS}`;
  wrap(ctx, L.text, 900).forEach((ln, i) => text(ctx, ln, CX, 1660 + i * 72, `600 56px ${SANS}`, a));
}

/** A line that draws itself from a to b as p goes 0 to 1. */
export function seg(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, p: number, alpha = 1, width = 3) {
  if (p <= 0.001) return;
  ctx.strokeStyle = white(alpha);
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(lerp(x1, x2, p), lerp(y1, y2, p));
  ctx.stroke();
}

export interface Eq {
  line: number;
  src: string;
  size: number;
}

/**
 * The equation strip: each equation morphs from the one before when its line
 * begins (the first simply fades in).
 */
export function equations(ctx: CanvasRenderingContext2D, t: number, lines: Line[], at: (t: number, i: number, a?: number, b?: number) => number, eqs: Eq[], y = 330) {
  let cur = -1;
  for (let k = 0; k < eqs.length; k++) if (t >= lines[eqs[k].line].start) cur = k;
  if (cur < 0) return null;
  const e = eqs[cur];
  const lay: MathLayout = layoutMath(ctx, e.src, e.size);
  const prev = cur > 0 ? layoutMath(ctx, eqs[cur - 1].src, eqs[cur - 1].size) : null;
  const p = at(t, e.line, 0.2, 1.1);
  drawMath(ctx, prev, lay, prev ? p : 1, CX, y, { alpha: prev ? 1 : p });
  return { lay, p };
}

/** A box that draws itself around the answer. */
export function finaleBox(ctx: CanvasRenderingContext2D, p: number, w: number, y = 210, h = 200) {
  if (p <= 0.01) return;
  ctx.strokeStyle = white(p);
  ctx.lineWidth = 3;
  ctx.strokeRect(CX - w / 2, y, w * p, h);
}

/** Small math label (e.g. "a ^2") centred at (cx, y). */
export function mathLabel(ctx: CanvasRenderingContext2D, src: string, cx: number, y: number, size: number, alpha: number) {
  if (alpha <= 0.01) return;
  drawMath(ctx, null, layoutMath(ctx, src, size), 1, cx, y, { alpha });
}
