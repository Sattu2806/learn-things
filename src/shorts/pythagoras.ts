/**
 * A vertical short (1080×1920): why a² + b² = c².
 * Four copies of a right triangle sit in a big square of side a + b, first
 * leaving a tilted square c², then leaving two squares a² and b².
 */
import { SH, SW, background, captions, clamp, ease, equations, finaleBox, lerp, mathLabel, timing, white, seg } from './kit';
import voice from './pythagoras-voice.json';

const { LINES, DURATION, at } = timing(voice as [string, number][]);
export { LINES, DURATION, SW, SH };

const a = 240;
const b = 320;
const S = a + b;
const X0 = 260;
const Y0 = 700;
type P = [number, number];
type Tri = [P, P, P]; // right-angle corner, end of the a leg, end of the b leg

// the single triangle, centred in the square-to-be, then the four corners, then two corners
const cx0 = X0 + S / 2 - a / 2;
const cy0 = Y0 + S / 2 - b / 2;
const START: Tri = [[cx0, cy0], [cx0 + a, cy0], [cx0, cy0 + b]];
const L1: Tri[] = [
  [[X0, Y0], [X0 + a, Y0], [X0, Y0 + b]],
  [[X0 + S, Y0], [X0 + S, Y0 + a], [X0 + a, Y0]],
  [[X0 + S, Y0 + S], [X0 + S - a, Y0 + S], [X0 + S, Y0 + a]],
  [[X0, Y0 + S], [X0, Y0 + b], [X0 + b, Y0 + S]],
];
const L2: Tri[] = [
  [[X0 + a, Y0 + a], [X0 + a, Y0], [X0 + S, Y0 + a]],
  [[X0 + S, Y0], [X0 + S, Y0 + a], [X0 + a, Y0]],
  [[X0 + a, Y0 + S], [X0, Y0 + S], [X0 + a, Y0 + a]],
  [[X0, Y0 + a], [X0 + a, Y0 + a], [X0, Y0 + S]],
];
const TILT: P[] = [[X0 + a, Y0], [X0 + S, Y0 + a], [X0 + S - a, Y0 + S], [X0, Y0 + S - a]];

const norm = (x: number) => {
  let y = x;
  while (y > Math.PI) y -= 2 * Math.PI;
  while (y <= -Math.PI) y += 2 * Math.PI;
  return y;
};

/** Move a triangle rigidly (slide and turn) from one place to another. */
function between(from: Tri, to: Tri, u: number): Tri {
  const th = norm(Math.atan2(to[1][1] - to[0][1], to[1][0] - to[0][0]) - Math.atan2(from[1][1] - from[0][1], from[1][0] - from[0][0])) * u;
  const c = Math.cos(th);
  const s = Math.sin(th);
  const R: P = [lerp(from[0][0], to[0][0], u), lerp(from[0][1], to[0][1], u)];
  const turn = (p: P): P => {
    const dx = p[0] - from[0][0];
    const dy = p[1] - from[0][1];
    return [R[0] + dx * c - dy * s, R[1] + dx * s + dy * c];
  };
  return [R, turn(from[1]), turn(from[2])];
}

function triangle(ctx: CanvasRenderingContext2D, tr: Tri, alpha: number) {
  if (alpha <= 0.01) return;
  ctx.beginPath();
  ctx.moveTo(...tr[0]);
  ctx.lineTo(...tr[1]);
  ctx.lineTo(...tr[2]);
  ctx.closePath();
  ctx.fillStyle = white(0.86 * alpha);
  ctx.fill();
  ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.stroke();
  // the right angle
  const k = 30;
  const u1: P = [(tr[1][0] - tr[0][0]) / a, (tr[1][1] - tr[0][1]) / a];
  const u2: P = [(tr[2][0] - tr[0][0]) / b, (tr[2][1] - tr[0][1]) / b];
  ctx.beginPath();
  ctx.moveTo(tr[0][0] + u1[0] * k, tr[0][1] + u1[1] * k);
  ctx.lineTo(tr[0][0] + (u1[0] + u2[0]) * k, tr[0][1] + (u1[1] + u2[1]) * k);
  ctx.lineTo(tr[0][0] + u2[0] * k, tr[0][1] + u2[1] * k);
  ctx.strokeStyle = `rgba(0,0,0,${0.8 * alpha})`;
  ctx.lineWidth = 3;
  ctx.stroke();
}

export function drawPythagorasShort(ctx: CanvasRenderingContext2D, t: number) {
  background(ctx);

  // --- the big square of side a + b draws itself
  const sq = at(t, 3, 0.1, 1.4);
  const pulse = at(t, 8, 0.2, 1) * (1 - at(t, 9, 0, 0.8));
  const corners: P[] = [[X0, Y0], [X0 + S, Y0], [X0 + S, Y0 + S], [X0, Y0 + S], [X0, Y0]];
  const per = sq * 4;
  ctx.strokeStyle = white(0.7 + 0.3 * pulse);
  ctx.lineWidth = 4 + 5 * pulse;
  ctx.shadowColor = white(pulse);
  ctx.shadowBlur = 26 * pulse;
  for (let k = 0; k < 4; k++) {
    const p = clamp(per - k);
    if (p > 0) seg(ctx, ...corners[k], ...corners[k + 1], p, 0.7 + 0.3 * pulse, 4 + 5 * pulse);
  }
  ctx.shadowBlur = 0;
  const lab = at(t, 3, 0.9, 1.7) * (1 - at(t, 6, 0, 0.6));
  mathLabel(ctx, 'a', X0 + a / 2, Y0 - 48, 60, lab);
  mathLabel(ctx, 'b', X0 + a + b / 2, Y0 - 48, 60, lab);
  mathLabel(ctx, 'b', X0 - 48, Y0 + b / 2 + 20, 60, lab);
  mathLabel(ctx, 'a', X0 - 48, Y0 + b + a / 2 + 20, 60, lab);

  // --- fills: the tilted square c², then the squares a² and b²
  const move1 = (i: number) => ease((at(t, 3, 0.3, 2.9) * 1.55 - i * 0.18) / 1);
  const move2 = (i: number) => ease(at(t, 6, 0.2, 2.9) * 1.5 - i * 0.16);
  const tiltP = at(t, 4, 0.4, 1.6) * (1 - at(t, 6, 0.2, 1.6));
  if (tiltP > 0.01) {
    ctx.beginPath();
    ctx.moveTo(...TILT[0]);
    TILT.slice(1).forEach((p) => ctx.lineTo(...p));
    ctx.closePath();
    ctx.fillStyle = white(0.24 * tiltP);
    ctx.fill();
    ctx.strokeStyle = white(tiltP);
    ctx.lineWidth = 6;
    ctx.shadowColor = white(tiltP);
    ctx.shadowBlur = 20 * tiltP;
    ctx.stroke();
    ctx.shadowBlur = 0;
    mathLabel(ctx, 'c ^2', X0 + S / 2, Y0 + S / 2 + 36, 100, tiltP);
  }
  const twoP = at(t, 7, 0.3, 1.5);
  if (twoP > 0.01) {
    ctx.fillStyle = white(0.3 * twoP);
    ctx.fillRect(X0, Y0, a, a);
    ctx.fillRect(X0 + a, Y0 + a, b, b);
    ctx.strokeStyle = white(twoP);
    ctx.lineWidth = 4;
    ctx.strokeRect(X0, Y0, a, a);
    ctx.strokeRect(X0 + a, Y0 + a, b, b);
    mathLabel(ctx, 'a ^2', X0 + a / 2, Y0 + a / 2 + 28, 80, twoP);
    mathLabel(ctx, 'b ^2', X0 + a + b / 2, Y0 + a + b / 2 + 32, 100, twoP);
  }

  // --- the triangles: one, four copies, the corners, the other two corners
  const copy = at(t, 2, 0.1, 0.9);
  const tris: Tri[] = [0, 1, 2, 3].map((i) => between(START, L1[i], move1(i)));
  for (let i = 0; i < 4; i++) {
    const m1 = move1(i);
    const m2 = move2(i);
    const tr = m2 > 0 ? between(L1[i], L2[i], m2) : tris[i];
    const alpha = i === 0 ? at(t, 1, 0.1, 1) : copy;
    const lift = i === 0 || m1 > 0 ? 0 : (1 - copy) * 40;
    triangle(ctx, lift ? (tr.map((p) => [p[0], p[1] + lift]) as Tri) : tr, alpha);
  }

  // the sides of the first triangle
  const sl = at(t, 1, 0.8, 1.8) * (1 - at(t, 2, 0.4, 1));
  if (sl > 0.01) {
    const [R, Pa, Pb] = tris[0];
    const gc: P = [(R[0] + Pa[0] + Pb[0]) / 3, (R[1] + Pa[1] + Pb[1]) / 3];
    const mark = (p: P, q: P, s: string, big: boolean) => {
      const mx = (p[0] + q[0]) / 2;
      const my = (p[1] + q[1]) / 2;
      let dx = mx - gc[0];
      let dy = my - gc[1];
      const d = Math.hypot(dx, dy);
      dx /= d;
      dy /= d;
      mathLabel(ctx, s, mx + dx * 56, my + dy * 56 + 20, big ? 72 : 64, sl);
    };
    mark(R, Pa, 'a', false);
    mark(R, Pb, 'b', false);
    mark(Pa, Pb, 'c', true);
  }

  // --- the equation: area of the big square, kept the same
  const eq = equations(ctx, t, LINES, at, [
    { line: 0, src: 'a ^2 + b ^2 = c ^2 ?', size: 110 },
    { line: 5, src: 'big = 4 T + c ^2', size: 100 },
    { line: 7, src: 'big = 4 T + a ^2 + b ^2', size: 90 },
    { line: 8, src: '4 T + c ^2 = 4 T + a ^2 + b ^2', size: 70 },
    { line: 9, src: 'c ^2 = a ^2 + b ^2', size: 120 },
  ]);
  if (eq) finaleBox(ctx, at(t, 9, 2.6, 3.6), eq.lay.width + 90);
  captions(ctx, LINES, t);
}
