/**
 * A vertical short (1080×1920): why the area of a circle is πr².
 * Slice the circle like a pizza, unroll the slices, add more until the
 * bumps vanish, and read off a rectangle πr wide and r tall.
 * Each beat starts when its line of narration starts (circle-voice.json
 * holds the measured length of each spoken line).
 */
import { SERIF, drawMath, layoutMath } from '../film/math';
import voice from './circle-voice.json';

export const SW = 1080;
export const SH = 1920;
const GAP = 0.35;
const LEAD = 0.4;

export const LINES = (voice as [string, number][]).map(([text, dur], i, all) => {
  const start = LEAD + all.slice(0, i).reduce((s, [, d]) => s + d + GAP, 0);
  return { text, dur, start, end: start + dur };
});
export const DURATION = LINES[LINES.length - 1].end + 1.6;

const SANS = '"Geist Variable", "Geist", system-ui, sans-serif';
const R = 270;
const CX = SW / 2;
const CY = 800;
const TOP = 1200; // top of the unrolled row
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (p: number) => {
  const q = clamp(p);
  return q * q * (3 - 2 * q);
};
/** Progress through line i's beat, from `a` to `b` seconds after it starts. */
const at = (t: number, i: number, a = 0, b = 1) => ease((t - LINES[i].start - a) / (b - a));
const white = (a: number) => `rgba(255,255,255,${clamp(a)})`;

/** One slice of n, placed between the circle (u = 0) and the row (u = 1). */
function wedge(ctx: CanvasRenderingContext2D, n: number, i: number, u: number, alpha: number) {
  if (alpha <= 0.01) return;
  const d = (2 * Math.PI) / n;
  const m = (i + 0.5) * d;
  // In the circle: apex at the centre, the arc facing the slice's own direction.
  const psiC = Math.atan2(-Math.cos(m), -Math.sin(m));
  // In the row: alternately arc down and arc up, interleaved, πr wide in all.
  const left = CX - (Math.PI * R) / 2;
  const ax = left + (R * d) / 4 + (i * R * d) / 2;
  const even = i % 2 === 0;
  const psiR = even ? 0 : Math.PI;
  const ay = even ? TOP : TOP + R;
  let dPsi = psiR - psiC;
  while (dPsi > Math.PI) dPsi -= 2 * Math.PI;
  while (dPsi < -Math.PI) dPsi += 2 * Math.PI;
  const psi = psiC + dPsi * u;
  const x0 = CX + (ax - CX) * u;
  const y0 = CY + (ay - CY) * u - Math.sin(Math.PI * u) * 120;
  const c = Math.cos(psi);
  const s = Math.sin(psi);
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  const k = Math.max(4, Math.ceil(48 / n) + 3);
  for (let j = 0; j <= k; j++) {
    const a = -d / 2 + (d * j) / k;
    const lx = R * Math.sin(a);
    const ly = R * Math.cos(a);
    ctx.lineTo(x0 + lx * c - ly * s, y0 + lx * s + ly * c);
  }
  ctx.closePath();
  ctx.fillStyle = white((even ? 0.82 : 0.28) * alpha);
  ctx.fill();
  ctx.strokeStyle = `rgba(0,0,0,${0.9 * alpha})`;
  ctx.lineWidth = n > 40 ? 0.6 : 2;
  ctx.stroke();
}

function row(ctx: CanvasRenderingContext2D, n: number, u: (i: number) => number, alpha: number) {
  for (let i = 0; i < n; i++) wedge(ctx, n, i, u(i), alpha);
}

function text(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, font: string, alpha: number, align: CanvasTextAlign = 'center') {
  if (alpha <= 0.01) return;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = white(alpha);
  ctx.fillText(s, x, y);
}

function wrap(ctx: CanvasRenderingContext2D, s: string, max: number) {
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

export function drawCircleShort(ctx: CanvasRenderingContext2D, t: number) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, SW, SH);
  const glow = ctx.createRadialGradient(CX, 1000, 0, CX, 1000, 1100);
  glow.addColorStop(0, white(0.07));
  glow.addColorStop(1, white(0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SW, SH);

  // --- the circle draws itself, and its radius
  const draw = at(t, 0, 0, 1.4);
  const unroll = at(t, 3, 0.2, 3.2);
  const outline = 1 - unroll * 0.8;
  ctx.strokeStyle = white(0.95 * outline);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(CX, CY, R, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * draw);
  ctx.stroke();
  const rad = at(t, 1, 0, 0.8) * (1 - at(t, 2, 0, 0.5));
  if (rad > 0.01) {
    ctx.strokeStyle = white(rad);
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.lineTo(CX + R * rad, CY);
    ctx.stroke();
    text(ctx, 'r', CX + R / 2, CY - 36, `italic 400 72px ${SERIF}`, rad);
  }

  // --- 8 slices, unrolled with a stagger; then more slices
  const n0 = 8;
  const slice = at(t, 2, 0.3, 1.3);
  const more1 = at(t, 4, 1.4, 2.4);
  const more2 = at(t, 5, 0, 0.8);
  const more3 = at(t, 6, 0, 1.2);
  const stagger = (i: number, n: number) => clamp((unroll * (1 + 0.6) - (0.6 * i) / n));
  row(ctx, n0, (i) => ease(stagger(i, n0)), slice * (1 - more1));
  row(ctx, 16, () => 1, more1 * (1 - more2));
  row(ctx, 40, () => 1, more2 * (1 - more3));
  row(ctx, 120, () => 1, more3);

  // --- the rectangle it becomes
  const left = CX - (Math.PI * R) / 2;
  const right = CX + (Math.PI * R) / 2;
  const rect = at(t, 6, 1.4, 2.4);
  if (rect > 0.01) {
    ctx.strokeStyle = white(rect);
    ctx.lineWidth = 3;
    ctx.strokeRect(left, TOP, right - left, R);
  }
  // height r
  const h = at(t, 7, 2.2, 3.2);
  if (h > 0.01) {
    ctx.strokeStyle = white(h);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(left - 40, TOP);
    ctx.lineTo(left - 40, TOP + R * h);
    ctx.stroke();
    text(ctx, 'r', left - 40, TOP - 40, `italic 400 72px ${SERIF}`, h);
  }
  // the crust: top and bottom edges light up, then the width πr
  const crust = at(t, 8, 1.2, 2.2) * (1 - at(t, 10, 0, 1));
  if (crust > 0.01) {
    ctx.strokeStyle = white(crust);
    ctx.lineWidth = 9;
    ctx.shadowColor = white(crust);
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.moveTo(left, TOP);
    ctx.lineTo(right, TOP);
    ctx.moveTo(left, TOP + R);
    ctx.lineTo(right, TOP + R);
    ctx.stroke();
    ctx.shadowBlur = 0;
    text(ctx, 'half the crust', CX, TOP - 50, `400 44px ${SANS}`, crust * 0.8);
    text(ctx, 'other half', CX, TOP + R + 50, `400 44px ${SANS}`, crust * 0.8);
  }
  const w = at(t, 9, 2.6, 3.6);
  if (w > 0.01) {
    ctx.strokeStyle = white(w);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(left, TOP + R + 40);
    ctx.lineTo(left + (right - left) * w, TOP + R + 40);
    ctx.stroke();
    text(ctx, 'π r', CX, TOP + R + 100, `italic 400 72px ${SERIF}`, w);
  }

  // --- the equation at the top: the question, the working, the answer
  const eqs: [number, string][] = [
    [0, 'A = π · r ^2 ?'],
    [9, 'width = ½ · 2 · π · r = π · r'],
    [10, 'A = π · r · r'],
    [11, 'A = π · r ^2'],
  ];
  let cur = -1;
  for (let k = 0; k < eqs.length; k++) if (t >= LINES[eqs[k][0]].start) cur = k;
  if (cur >= 0) {
    const [line, src] = eqs[cur];
    const enter = at(t, line, 0.2, 1.1);
    const leaveQ = cur === 0 ? 1 - at(t, 2, 0, 0.6) : 1;
    const size = cur === 3 ? 150 : cur === 1 ? 70 : 110;
    const lay = layoutMath(ctx, src, size);
    const prev = cur >= 2 ? layoutMath(ctx, eqs[cur - 1][1], cur - 1 === 1 ? 70 : 110) : null;
    drawMath(ctx, cur >= 2 ? prev : null, lay, cur >= 2 ? enter : 1, CX, 330, { alpha: (cur >= 2 ? 1 : enter) * leaveQ });
  }
  // the finale: a box around the answer
  const fin = at(t, 11, 1.2, 2.2);
  if (fin > 0.01) {
    ctx.strokeStyle = white(fin);
    ctx.lineWidth = 3;
    ctx.strokeRect(CX - 300, 210, 600 * fin, 200);
  }

  // --- captions, big and centred, for watching with the sound off
  const L = LINES.find((l) => t >= l.start && t <= l.end + GAP);
  if (L) {
    const a = clamp(Math.min((t - L.start) / 0.2, (L.end + GAP - t) / 0.2));
    ctx.font = `600 56px ${SANS}`;
    const lines = wrap(ctx, L.text, 900);
    lines.forEach((ln, i) => text(ctx, ln, CX, 1660 + i * 72, `600 56px ${SANS}`, a));
  }
}
