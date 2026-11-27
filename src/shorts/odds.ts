/**
 * A vertical short (1080×1920): why 1 + 3 + 5 + … + (2n − 1) = n².
 * Each odd number is an L-shaped layer; the layers stack into squares.
 */
import { SERIF, CX, SH, SW, background, captions, equations, finaleBox, mathLabel, text, timing, white, seg } from './kit';
import voice from './odds-voice.json';

const { LINES, DURATION, at } = timing(voice as [string, number][]);
export { LINES, DURATION, SW, SH };

const N = 5;
const CELL = 130;
const LEFT = (SW - N * CELL) / 2;
const TOP = 640;
const LAYER_LINE = [2, 3, 4, 5, 6]; // the line during which each layer is built

/** Cells of layer m (0-based), walked along the L: along the bottom, then up the side. */
function layerCells(m: number): [number, number][] {
  const out: [number, number][] = [];
  for (let c = 0; c <= m; c++) out.push([m, c]);
  for (let r = m - 1; r >= 0; r--) out.push([r, m]);
  return out;
}

export function drawOddsShort(ctx: CanvasRenderingContext2D, t: number) {
  background(ctx);
  const focus = at(t, 8, 0, 0.8); // dim the first four layers, look at the last
  const pulse = at(t, 7, 0.4, 1.2) * (1 - at(t, 8, 0, 0.8));

  for (let m = 0; m < N; m++) {
    const shade = m % 2 === 0 ? 0.88 : 0.4;
    const cells = layerCells(m);
    const dim = m === N - 1 ? 1 : 1 - 0.7 * focus;
    cells.forEach(([r, c], j) => {
      const p = at(t, LAYER_LINE[m], 0.15 + j * 0.13, 0.75 + j * 0.13);
      if (p <= 0.01) return;
      const k = 0.55 + 0.45 * p;
      const w = CELL * k;
      const x = LEFT + c * CELL + (CELL - w) / 2;
      const y = TOP + r * CELL + (CELL - w) / 2 - (1 - p) * 40;
      ctx.fillStyle = white(Math.min(1, shade + 0.1 * pulse) * p * dim);
      ctx.fillRect(x, y, w, w);
      ctx.strokeStyle = `rgba(0,0,0,${p})`;
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, w, w);
    });
    // the count sits in the corner of its L
    const cp = at(t, LAYER_LINE[m], 0.3 + m * 0.2, 1.2 + m * 0.2);
    text(ctx, String(2 * m + 1), LEFT + m * CELL + CELL / 2, TOP + m * CELL + CELL / 2, `400 ${m === 0 ? 70 : 64}px ${SERIF}`, cp * dim, 'center', shade > 0.5 ? '0,0,0' : '255,255,255');
  }

  // --- the last layer: two arms and a corner
  const bx1 = LEFT;
  const bx2 = LEFT + (N - 1) * CELL;
  const by = TOP + N * CELL + 34;
  const arm1 = at(t, 8, 0.6, 1.6);
  const arm2 = at(t, 8, 1.4, 2.4);
  const corner = at(t, 8, 2.2, 3.1);
  const keep = 1 - at(t, 10, 0, 0.6);
  seg(ctx, bx1, by, bx2, by, arm1, keep, 4);
  mathLabel(ctx, 'n − 1', (bx1 + bx2) / 2, by + 64, 56, arm1 * keep);
  const rx = LEFT + N * CELL + 34;
  seg(ctx, rx, TOP, rx, TOP + (N - 1) * CELL, arm2, keep, 4);
  mathLabel(ctx, 'n − 1', rx + 70, TOP + ((N - 1) * CELL) / 2 + 20, 56, arm2 * keep);
  seg(ctx, bx2 + 12, by, LEFT + N * CELL - 12, by, corner, keep, 6);
  text(ctx, '+ 1', LEFT + N * CELL - CELL / 2 + 20, by + 62, `400 56px ${SERIF}`, corner * keep);

  // --- the n × n square names itself
  const sq = at(t, 10, 0.3, 1.3);
  if (sq > 0.01) {
    ctx.strokeStyle = white(sq);
    ctx.lineWidth = 6;
    ctx.shadowColor = white(sq);
    ctx.shadowBlur = 24;
    ctx.strokeRect(LEFT - 8, TOP - 8, (N * CELL + 16) * sq, N * CELL + 16);
    ctx.shadowBlur = 0;
    mathLabel(ctx, 'n × n', CX, by + 64, 64, sq);
  }

  // --- the equation
  const eq = equations(ctx, t, LINES, at, [
    { line: 0, src: '1 + 3 + 5 + 7 + … = ?', size: 100 },
    { line: 2, src: '1 = 1 ^2', size: 110 },
    { line: 3, src: '1 + 3 = 2 ^2', size: 110 },
    { line: 4, src: '1 + 3 + 5 = 3 ^2', size: 110 },
    { line: 5, src: '1 + 3 + 5 + 7 = 4 ^2', size: 100 },
    { line: 6, src: '1 + 3 + 5 + 7 + 9 = 5 ^2', size: 90 },
    { line: 8, src: '( n − 1 ) + ( n − 1 ) + 1', size: 84 },
    { line: 9, src: '( n − 1 ) + ( n − 1 ) + 1 = 2 n − 1', size: 70 },
    { line: 10, src: '1 + 3 + 5 + … + ( 2 n − 1 ) = n ^2', size: 80 },
  ]);
  if (eq) finaleBox(ctx, at(t, 11, 0.8, 1.8), Math.min(1000, eq.lay.width + 80), 220, 190);
  captions(ctx, LINES, t);
}
