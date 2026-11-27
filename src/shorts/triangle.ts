/**
 * A vertical short (1080×1920): why a triangle's angles add up to 180°.
 * Tear off the three corners and line them up on a straight line, then see
 * the same thing with a parallel line through the top.
 */
import { SERIF, CX, SH, SW, background, captions, clamp, ease, equations, finaleBox, lerp, text, timing, white, seg } from './kit';
import voice from './triangle-voice.json';

const { LINES, DURATION, at } = timing(voice as [string, number][]);
export { LINES, DURATION, SW, SH };

const A = { x: 200, y: 1180 };
const B = { x: 860, y: 1180 };
const C = { x: 400, y: 760 };
const R0 = 90; // corner radius at home
const R1 = 125; // when torn off
const STAGE_Y = 1370;
const FAN = { x: CX, y: 1500 };
const SHADE = [0.88, 0.3, 0.58]; // alpha, beta, gamma
const NAMES = ['α', 'β', 'γ'];

const norm = (a: number) => {
  let x = a;
  while (x > Math.PI) x -= 2 * Math.PI;
  while (x <= -Math.PI) x += 2 * Math.PI;
  return x;
};
const ang = (from: { x: number; y: number }, to: { x: number; y: number }) => Math.atan2(to.y - from.y, to.x - from.x);

/** The corner at V between the edges to P and Q: its lowest canvas angle and width. */
function corner(V: { x: number; y: number }, P: { x: number; y: number }, Q: { x: number; y: number }) {
  const d1 = ang(V, P);
  const d = norm(ang(V, Q) - d1);
  return d > 0 ? { low: d1, w: d } : { low: d1 + d, w: -d };
}
const VERT = [A, B, C];
const CORN = [corner(A, B, C), corner(B, A, C), corner(C, A, B)];
// the fan lays them left to right: alpha, gamma, beta
const FAN_LOW = [Math.PI, Math.PI + CORN[0].w + CORN[2].w, Math.PI + CORN[0].w];
const STAGE_X = [240, 840, 540];

function sector(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, low: number, w: number, i: number, alpha: number, label = true) {
  if (alpha <= 0.01) return;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, r, low, low + w);
  ctx.closePath();
  ctx.fillStyle = white(SHADE[i] * alpha);
  ctx.fill();
  ctx.strokeStyle = `rgba(0,0,0,${0.9 * alpha})`;
  ctx.lineWidth = 3;
  ctx.stroke();
  if (label) {
    const m = low + w / 2;
    text(ctx, NAMES[i], x + Math.cos(m) * r * 0.62, y + Math.sin(m) * r * 0.62, `italic 400 ${Math.round(r * 0.5)}px ${SERIF}`, alpha, 'center', SHADE[i] > 0.45 ? '0,0,0' : '255,255,255');
  }
}

export function drawTriangleShort(ctx: CanvasRenderingContext2D, t: number) {
  background(ctx);

  // --- the triangle draws itself
  const draw = at(t, 0, 0, 1.6);
  const tri = [A, B, C, A];
  ctx.strokeStyle = white(0.95);
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  const total = draw * 3;
  for (let k = 0; k < 3; k++) {
    const p = clamp(total - k);
    if (p > 0) ctx.lineTo(lerp(tri[k].x, tri[k + 1].x, p), lerp(tri[k].y, tri[k + 1].y, p));
  }
  ctx.stroke();

  // stages of the moves
  const fill = at(t, 2, 0.3, 1.3);
  const stag = (u: number, i: number) => ease(u * 1.5 - i * 0.25);
  const tearU = at(t, 3, 0.1, 1.5);
  const fanU = at(t, 4, 0.1, 2.3);
  const ret = at(t, 7, 0, 0.9);

  // --- corners: marked, torn off, lined up
  for (let i = 0; i < 3; i++) {
    const V = VERT[i];
    const s = stag(tearU, i);
    const f = stag(fanU, i);
    const away = s * (1 - ret);
    // at home (or the ghost it leaves)
    sector(ctx, V.x, V.y, R0, CORN[i].low, CORN[i].w, i, fill * (1 - away));
    if (away > 0.01) {
      ctx.strokeStyle = white(0.3 * away);
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(V.x, V.y);
      ctx.arc(V.x, V.y, R0, CORN[i].low, CORN[i].low + CORN[i].w);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // the travelling piece
    if (s > 0.001 && ret < 1) {
      const sx = STAGE_X[i];
      const sy = STAGE_Y;
      let x = lerp(V.x, sx, s);
      let y = lerp(V.y, sy, s) - Math.sin(Math.PI * s) * 50;
      x = lerp(x, FAN.x, f);
      y = lerp(y, FAN.y, f);
      const rot = norm(FAN_LOW[i] - CORN[i].low);
      sector(ctx, x, y, lerp(R0, R1, s), CORN[i].low + rot * f, CORN[i].w, i, 1 - ret);
    }
  }

  // --- the straight line the corners make
  const lineP = at(t, 5, 0.2, 1.2) * (1 - at(t, 7, 0, 0.6));
  if (lineP > 0.01) {
    const half = 300 * lineP;
    seg(ctx, FAN.x - half, FAN.y, FAN.x + half, FAN.y, 1, lineP, 4);
  }
  text(ctx, '180°', FAN.x, 1588, `400 64px ${SERIF}`, at(t, 6, 0.3, 1.2) * (1 - at(t, 7, 0, 0.6)));

  // --- the parallel line through the top, and the twins that slide across
  const par = at(t, 7, 0.8, 2.2);
  if (par > 0.01) {
    ctx.setLineDash([]);
    const glow = at(t, 10, 0.2, 1);
    seg(ctx, C.x, C.y, C.x - 320, C.y, par, 0.9, 4 + 3 * glow);
    seg(ctx, C.x, C.y, C.x + 580, C.y, par, 0.9, 4 + 3 * glow);
  }
  const twinA = at(t, 8, 0.3, 2.0);
  const twinB = at(t, 9, 0.2, 1.7);
  if (twinA > 0.001) sector(ctx, lerp(A.x, C.x, twinA), lerp(A.y, C.y, twinA) - Math.sin(Math.PI * twinA) * 60, R0, CORN[0].low + Math.PI * twinA, CORN[0].w, 0, 1);
  if (twinB > 0.001) sector(ctx, lerp(B.x, C.x, twinB), lerp(B.y, C.y, twinB) - Math.sin(Math.PI * twinB) * 60, R0, CORN[1].low + Math.PI * twinB, CORN[1].w, 1, 1);
  // the three together, on the line
  const three = at(t, 10, 0.2, 1.2);
  if (three > 0.01) {
    ctx.strokeStyle = white(0.9 * three);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(C.x, C.y, R0 + 22, Math.PI, Math.PI - Math.PI * three, true);
    ctx.stroke();
    text(ctx, '180°', C.x, C.y - R0 - 70, `400 64px ${SERIF}`, three);
  }

  // --- the equation
  const eq = equations(ctx, t, LINES, at, [
    { line: 0, src: 'α + β + γ = ?', size: 110 },
    { line: 6, src: 'α + β + γ = 180°', size: 110 },
  ]);
  if (eq) finaleBox(ctx, at(t, 11, 1.2, 2.2), eq.lay.width + 90);

  captions(ctx, LINES, t);
}
