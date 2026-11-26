/**
 * Draws one moment of the film in a virtual 1920×1080 frame, black and white.
 * Everything, equations and captions included, goes on the canvas, so what
 * plays in the app and what exports to video are the same pixels.
 */
import { SERIF, drawBrace, drawMath, layoutMath, span, type MathLayout } from '../../film/math';
import type { Reader } from '../../film/timeline';
import type { Brace, Copy } from './film';
import { NO_BUGS, flight, landingTime, metres, niceStep, seconds, termsAt, type Model } from './model';

export const VW = 1920;
export const VH = 1080;
const GROUND = 820;
const LEFT = 230;
const TOP = 300;
const RIGHT = 1700;
const R = 11;
const MONO = '"Geist Mono Variable", "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const SANS = '"Geist Variable", "Geist", ui-sans-serif, system-ui, sans-serif';

const white = (a: number) => `rgba(255,255,255,${Math.max(0, Math.min(1, a))})`;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export interface Cam {
  scale: number;
}

export interface RenderOptions {
  caption: { text: string; alpha: number } | null;
  /** Translates on-screen words such as the "Pause and ponder" card. */
  tr?: (text: string) => string;
  /** Seconds, for the film grain. Use film time when exporting so frames are repeatable. */
  clock: number;
  still?: boolean;
  /** A smoothed camera from the live player; otherwise the exact one is computed. */
  cam?: Cam;
  /** Captions stay above this line (virtual pixels), so player controls never cover them. */
  safeBottom?: number;
}

export function modelOf(r: Reader): Model {
  return {
    v: r.n('v'),
    theta: r.n('theta'),
    g: r.n('g'),
    run: true,
    rise: true,
    drop: r.n('gravity') > 0.5,
    bugs: { ...NO_BUGS, linear: r.n('linear') > 0.5 },
  };
}

/** Pixels per metre that fit the throw (and, as asked, the ghost's climb or the family of throws). */
export function targetCamera(r: Reader): Cam {
  const v = r.n('v');
  const g = r.n('g');
  const f = flight(v, r.n('theta'), g);
  const fr = clamp01(r.n('frame'));
  let X = Math.max(f.R, 6) * 1.06;
  let Y = Math.max(f.H * 1.18 + (Math.max(f.H, f.ghostTop) * 1.06 - f.H * 1.18) * fr, 3);
  const fam = clamp01(r.n('family'));
  if (fam > 0) {
    X += (Math.max(X, flight(v, 45, g).R * 1.06) - X) * fam;
    Y += (Math.max(Y, flight(v, 75, g).H * 1.22) - Y) * fam;
  }
  const right = LEFT + (RIGHT - LEFT) * r.n('sceneW');
  return { scale: Math.min((right - LEFT) / X, (GROUND - TOP) / Y) };
}

let noise: HTMLCanvasElement[] = [];
function grainTiles() {
  if (noise.length) return noise;
  noise = Array.from({ length: 4 }, () => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const g = c.getContext('2d')!;
    const img = g.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = Math.random() * 22;
    }
    g.putImageData(img, 0, 0);
    return c;
  });
  return noise;
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, font: string, alpha: number, align: CanvasTextAlign = 'left', base: CanvasTextBaseline = 'middle') {
  if (alpha <= 0.01) return;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = base;
  ctx.lineJoin = 'round';
  ctx.lineWidth = 8;
  ctx.strokeStyle = `rgba(0,0,0,${0.85 * Math.min(1, alpha * 1.5)})`;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = white(alpha);
  ctx.fillText(text, x, y);
}

function caps(ctx: CanvasRenderingContext2D, x: number, y0: number, y1: number, alpha: number) {
  ctx.fillStyle = white(alpha);
  ctx.fillRect(x - 8, y0 - 1, 16, 2);
  ctx.fillRect(x - 8, y1 - 1, 16, 2);
}

function arrow(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, alpha: number, width = 3, head = 18, dash?: number[]) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  if (len < 4 || alpha <= 0.01) return;
  const ux = dx / len;
  const uy = dy / len;
  const h = Math.min(head, len * 0.5);
  const bx = x1 - ux * h;
  const bY = y1 - uy * h;
  ctx.save();
  ctx.strokeStyle = white(alpha);
  ctx.fillStyle = white(alpha);
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(bx, bY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(bx - uy * h * 0.5, bY + ux * h * 0.5);
  ctx.lineTo(bx + uy * h * 0.5, bY - ux * h * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function ball(ctx: CanvasRenderingContext2D, x: number, y: number, alpha: number, r = R) {
  if (alpha <= 0.01) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4.6);
  g.addColorStop(0, white(0.45 * alpha));
  g.addColorStop(1, white(0));
  ctx.fillStyle = g;
  ctx.fillRect(x - r * 4.6, y - r * 4.6, r * 9.2, r * 9.2);
  const body = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, 0.5, x, y, r);
  body.addColorStop(0, white(alpha));
  body.addColorStop(1, white(0.82 * alpha));
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > max && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export function renderFrame(ctx: CanvasRenderingContext2D, r: Reader, o: RenderOptions) {
  const m = modelOf(r);
  const S = (o.cam ?? targetCamera(r)).scale;
  const sx = (x: number) => LEFT + x * S;
  const by = (y: number) => GROUND - y * S - R;
  const land = landingTime(m);
  const lands = land !== null && land > 0;
  const grounded = land === 0;
  const bt = lands ? Math.min(r.n('bt'), land) : Math.max(0, r.n('bt'));
  const at = (t: number) => {
    const k = termsAt(m, t);
    return { k, x: k.x, y: grounded ? 0 : Math.max(0, k.y) };
  };
  const now = at(bt);
  const anchors: Partial<Record<Copy['from'], { x: number; y: number; size: number }>> = {};

  // ---------------------------------------------------------------- stage
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, VW, VH);
  const pool = ctx.createRadialGradient(VW * 0.42, GROUND, 0, VW * 0.42, GROUND, 1300);
  pool.addColorStop(0, white(0.075));
  pool.addColorStop(1, white(0));
  ctx.fillStyle = pool;
  ctx.fillRect(0, 0, VW, VH);

  const groundA = r.n('ground');
  const runA = r.n('run');
  const compA = r.n('comps');
  // Where the "v cos θ" label sits under the launch, so ruler numbers there step aside.
  const compX = sx(0) + (Math.cos((m.theta * Math.PI) / 180) * m.v * 11) / 2;
  if (groundA > 0.01) {
    const floor = ctx.createLinearGradient(0, GROUND, 0, VH);
    floor.addColorStop(0, white(0.035 * groundA));
    floor.addColorStop(1, white(0));
    ctx.fillStyle = floor;
    ctx.fillRect(0, GROUND, VW, VH - GROUND);
    const line = ctx.createLinearGradient(0, 0, VW, 0);
    line.addColorStop(0, white(0));
    line.addColorStop(0.08, white(0.45 * groundA));
    line.addColorStop(0.92, white(0.45 * groundA));
    line.addColorStop(1, white(0));
    ctx.fillStyle = line;
    ctx.fillRect(0, GROUND, VW, 1.5);
    const step = niceStep(120 / S);
    ctx.font = `400 18px ${MONO}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    let first = true;
    for (let x = 0; sx(x) < VW - 40; x += step) {
      ctx.fillStyle = white(0.3 * groundA);
      ctx.fillRect(sx(x) - 0.75, GROUND + 6, 1.5, 8);
      const n = Number.isInteger(x) ? String(x) : x.toFixed(1);
      const near = Math.abs(sx(x) - compX) < 115 ? compA : 0;
      ctx.fillStyle = white(0.42 * groundA * (1 - runA) * (1 - near));
      ctx.fillText(x === 0 ? '0' : first ? `${n} m` : n, sx(x), GROUND + 20);
      if (x > 0) first = false;
    }
  }

  // ---------------------------------------------------------------- family of throws
  const famA = r.n('family');
  if (famA > 0.01) {
    for (const th of [15, 30, 45, 60, 75]) {
      const fm: Model = { ...m, theta: th, drop: true, bugs: NO_BUGS };
      const T = flight(m.v, th, m.g).T;
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const k = termsAt(fm, (T * i) / 120);
        if (i === 0) ctx.moveTo(sx(k.x), by(Math.max(0, k.y)));
        else ctx.lineTo(sx(k.x), by(Math.max(0, k.y)));
      }
      ctx.strokeStyle = white(0.26 * famA);
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  // Drawn later, over the live throw, so a path passing by never hides them.
  const familyLabels = () => {
    if (famA <= 0.01) return;
    for (const th of [15, 30, 45, 60, 75]) {
      const f = flight(m.v, th, m.g);
      label(ctx, `${th}°`, sx(f.R / 2), by(f.H) - 22, `italic 400 30px ${SERIF}`, 0.55 * famA, 'center');
    }
  };

  // ---------------------------------------------------------------- the straight no-gravity line
  const ghostA = r.n('ghost');
  const lineA = r.n('line');
  const dir = termsAt(m, 1);
  const dlen = Math.hypot(dir.run, dir.rise);
  if (lineA > 0.01 && dlen > 0) {
    const ux = dir.run / dlen;
    const uy = dir.rise / dlen;
    ctx.save();
    ctx.setLineDash([6, 12]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = white(0.42 * lineA);
    ctx.beginPath();
    ctx.moveTo(sx(0), by(0));
    ctx.lineTo(sx(0) + ux * 4000, by(0) - uy * 4000);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.translate(sx(0) + ux * 300, by(0) - uy * 300);
    ctx.rotate(-Math.atan2(uy, ux));
    label(ctx, 'no gravity', 0, -24, `italic 400 30px ${SERIF}`, 0.6 * lineA, 'center');
    ctx.restore();
  }

  // ---------------------------------------------------------------- velocity and its parts
  const vecA = r.n('vec');
  if (vecA > 0.01 || compA > 0.01) {
    const L = m.v * 11;
    const a = (m.theta * Math.PI) / 180;
    const x0 = sx(0);
    const y0 = by(0);
    const x1 = x0 + Math.cos(a) * L;
    const y1 = y0 - Math.sin(a) * L;
    const va = Math.max(vecA, compA * 0.9);
    arrow(ctx, x0, y0, x1, y1, va, 3.5, 22);
    label(ctx, 'v', x1 - Math.sin(a) * 30 - 8, y1 - Math.cos(a) * 30, `italic 400 44px ${SERIF}`, va, 'center');
    ctx.save();
    ctx.strokeStyle = white(0.6 * va);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x0, y0, 76, -a, 0);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'θ', x0 + Math.cos(a / 2) * 108, y0 - Math.sin(a / 2) * 108, `italic 400 40px ${SERIF}`, va, 'center');
    if (compA > 0.01) {
      arrow(ctx, x0, y0 + 0.5, x1, y0 + 0.5, compA, 3, 18, [10, 8]);
      arrow(ctx, x1, y0, x1, y1, compA, 3, 18, [10, 8]);
      label(ctx, 'v cos θ', (x0 + x1) / 2, y0 + 42, `italic 400 34px ${SERIF}`, compA, 'center');
      label(ctx, 'v sin θ', x1 + 22, (y0 + y1) / 2, `italic 400 34px ${SERIF}`, compA, 'left');
      anchors.comps = { x: x1 + 22 + 55, y: (y0 + y1) / 2, size: 34 };
    }
  }

  // ---------------------------------------------------------------- strobe dots
  const ticksA = r.n('ticks');
  const dropsA = r.n('tickDrops');
  const ratioA = r.n('ratio');
  const equalA = r.n('equal');
  const step = r.n('tickStep');
  if ((ticksA > 0.01 || dropsA > 0.01) && step > 0) {
    const n = Math.floor(bt / step + 1e-9);
    const first = termsAt(m, step).drop;
    let prev = { x: sx(0), y: by(0) };
    for (let i = 1; i <= n; i++) {
      const p = at(i * step);
      const X = sx(p.x);
      const Y = by(p.y);
      const gx = sx(p.k.run);
      const gy = by(p.k.rise);
      if (dropsA > 0.01 && ghostA > 0.01 && p.k.drop * S > 6) {
        ctx.save();
        ctx.setLineDash([3, 6]);
        ctx.strokeStyle = white(0.6 * dropsA);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(X, Y);
        ctx.stroke();
        ctx.restore();
        if (Math.abs(X - sx(now.x)) > 80) {
          const ratio = first > 0 ? p.k.drop / first : 0;
          const txt = Math.abs(ratio - Math.round(ratio)) < 0.01 ? String(Math.round(ratio)) : ratio.toFixed(1);
          label(ctx, `${txt}×`, X + 14, (gy + Y) / 2 - 10, `italic 400 32px ${SERIF}`, 0.9 * ratioA);
          label(ctx, metres(p.k.drop), X + 14, (gy + Y) / 2 + 20, `400 18px ${MONO}`, 0.55 * ratioA);
        }
      }
      if (ghostA > 0.01) {
        ctx.beginPath();
        ctx.arc(gx, gy, 5, 0, Math.PI * 2);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = white(0.6 * ghostA * Math.max(ticksA, dropsA));
        ctx.stroke();
      }
      if (equalA > 0.01) {
        const ex = X - prev.x;
        const ey = Y - prev.y;
        const len = Math.hypot(ex, ey) || 1;
        const nx = ey / len;
        const ny = -ex / len;
        const off = 22;
        ctx.save();
        ctx.strokeStyle = white(0.75 * equalA);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(prev.x + nx * off, prev.y + ny * off);
        ctx.lineTo(X + nx * off, Y + ny * off);
        ctx.moveTo(prev.x + nx * (off - 7), prev.y + ny * (off - 7));
        ctx.lineTo(prev.x + nx * (off + 7), prev.y + ny * (off + 7));
        ctx.moveTo(X + nx * (off - 7), Y + ny * (off - 7));
        ctx.lineTo(X + nx * (off + 7), Y + ny * (off + 7));
        ctx.stroke();
        ctx.restore();
      }
      const flash = clamp01(1 - (bt - i * step) / 0.35);
      ctx.beginPath();
      ctx.arc(X, Y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = white(0.9 * ticksA);
      ctx.fill();
      if (flash > 0 && !o.still) {
        const g = ctx.createRadialGradient(X, Y, 0, X, Y, 34);
        g.addColorStop(0, white(0.55 * flash * ticksA));
        g.addColorStop(1, white(0));
        ctx.fillStyle = g;
        ctx.fillRect(X - 34, Y - 34, 68, 68);
      }
      prev = { x: X, y: Y };
    }
    if (equalA > 0.01 && n >= 2) {
      // Set along the brackets, on their far side, so it never crosses the path.
      const x0 = sx(0);
      const y0 = by(0);
      const ex = prev.x - x0;
      const ey = prev.y - y0;
      const len = Math.hypot(ex, ey) || 1;
      ctx.save();
      ctx.translate((x0 + prev.x) / 2 + (ey / len) * 56, (y0 + prev.y) / 2 - (ex / len) * 56);
      ctx.rotate(Math.atan2(ey, ex));
      label(ctx, 'the same distance each half second', 0, 0, `italic 400 30px ${SERIF}`, equalA, 'center');
      ctx.restore();
    }
  }

  // ---------------------------------------------------------------- the path
  const trailA = r.n('trail');
  if (trailA > 0.01 && bt > 0) {
    ctx.beginPath();
    for (let i = 0; i <= 220; i++) {
      const p = at((bt * i) / 220);
      if (i === 0) ctx.moveTo(sx(p.x), by(p.y));
      else ctx.lineTo(sx(p.x), by(p.y));
    }
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = white(0.08 * trailA);
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.strokeStyle = white(0.92 * trailA);
    ctx.lineWidth = 2.4;
    ctx.stroke();
  }
  familyLabels();

  // ---------------------------------------------------------------- term bars
  const riseA = r.n('rise');
  if (riseA > 0.01) {
    const X = sx(now.k.run);
    const y0 = by(0);
    const y1 = by(now.k.rise) + R + 5;
    if (y0 - y1 > 6) {
      ctx.save();
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = white(0.9 * riseA);
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(X, y0);
      ctx.lineTo(X, y1);
      ctx.stroke();
      ctx.restore();
      caps(ctx, X, y0, y1, 0.9 * riseA);
      if (y0 - y1 > 50) {
        // Centred like the drop's label, so at landing the two read as a pair.
        const mid = (y0 + by(now.k.rise)) / 2;
        label(ctx, 'v sin θ t', X - 18, mid - 14, `italic 400 36px ${SERIF}`, riseA, 'right');
        label(ctx, metres(now.k.rise), X - 18, mid + 22, `400 19px ${MONO}`, 0.65 * riseA, 'right');
      }
    }
  }
  const dropA = r.n('drop') * Math.max(ghostA, r.n('column'));
  const dropLabel = r.s<string>('dropLabel');
  if (dropA > 0.01 && m.drop && ghostA > 0.01) {
    const X = sx(now.k.run);
    const gy = by(now.k.rise);
    const bY = by(now.y);
    const y0 = Math.min(gy, bY) + R + 5;
    const y1 = Math.max(gy, bY) - R - 5;
    if (y1 - y0 > 6) {
      const a = r.n('drop') * ghostA;
      const glow = ctx.createLinearGradient(X - 12, 0, X + 12, 0);
      glow.addColorStop(0, white(0));
      glow.addColorStop(0.5, white(0.13 * a));
      glow.addColorStop(1, white(0));
      ctx.fillStyle = glow;
      ctx.fillRect(X - 12, y0, 24, y1 - y0);
      ctx.fillStyle = white(0.95 * a);
      ctx.fillRect(X - 1.2, y0, 2.4, y1 - y0);
      caps(ctx, X, y0, y1, 0.95 * a);
      const mid = (y0 + y1) / 2;
      if (y1 - y0 > 46) {
        const p = dropLabel.p;
        if (dropLabel.from !== dropLabel.to && p < 1) label(ctx, dropLabel.from, X + 18, mid - 14, `italic 400 38px ${SERIF}`, a * (1 - p));
        label(ctx, dropLabel.to, X + 18, mid - 14, `italic 400 38px ${SERIF}`, a * (dropLabel.from !== dropLabel.to ? p : 1));
        label(ctx, metres(now.k.drop), X + 18, mid + 22, `400 19px ${MONO}`, 0.65 * a);
        anchors.drop = { x: X + 18 + 40, y: mid - 14, size: 38 };
      }
    }
  }
  if (runA > 0.01) {
    const x0 = sx(0);
    const x1 = sx(now.x);
    const y = GROUND + 22;
    ctx.fillStyle = white(0.9 * runA);
    ctx.fillRect(Math.min(x0, x1), y - 1, Math.abs(x1 - x0), 2);
    ctx.fillRect(x0 - 1, y - 7, 2, 14);
    ctx.fillRect(x1 - 1, y - 7, 2, 14);
    if (Math.abs(x1 - x0) > 160) {
      label(ctx, 'v cos θ t', (x0 + x1) / 2 - 10, y + 32, `italic 400 32px ${SERIF}`, runA, 'right');
      label(ctx, metres(now.x), (x0 + x1) / 2 + 10, y + 34, `400 19px ${MONO}`, 0.7 * runA, 'left');
    }
  }

  // ---------------------------------------------------------------- the dropped ball
  const colA = r.n('column');
  if (colA > 0.01) {
    const colT = r.n('colT');
    const fall = (t: number) => termsAt({ ...m, rise: false, run: false, drop: true }, t).drop;
    if (r.n('colMode') < 0.5) {
      // Beside the throw, at the same scale, to compare with the gap.
      const x = 1560;
      const y0 = TOP + 10;
      const d = fall(colT) * S;
      ctx.fillStyle = white(0.85 * colA);
      ctx.fillRect(x - 34, y0 - 1, 68, 2);
      label(ctx, 'let go from rest', x, y0 - 30, `italic 400 30px ${SERIF}`, 0.85 * colA, 'center');
      ctx.save();
      ctx.setLineDash([3, 8]);
      ctx.strokeStyle = white(0.18 * colA);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y0);
      ctx.lineTo(x, GROUND);
      ctx.stroke();
      ctx.restore();
      const by0 = Math.min(GROUND - R, y0 + R + d);
      if (d > 30) {
        ctx.fillStyle = white(0.95 * colA);
        ctx.fillRect(x - 42 - 1.2, y0 + 4, 2.4, by0 - R - 6 - y0);
        caps(ctx, x - 42, y0 + 4, by0 - R - 2, 0.95 * colA);
        label(ctx, dropLabel.p < 1 && dropLabel.from !== dropLabel.to ? dropLabel.from : dropLabel.to, x - 60, (y0 + by0) / 2 - 14, `italic 400 38px ${SERIF}`, colA, 'right');
        label(ctx, metres(fall(colT)), x - 60, (y0 + by0) / 2 + 22, `400 19px ${MONO}`, 0.65 * colA, 'right');
      }
      ball(ctx, x, by0, colA);
    } else {
      // On its own, Galileo-style: a flash every second.
      const x = 640;
      const y0 = 300;
      // The scale is fixed by a true t² fall over 4 s, so a broken equation visibly falls short.
      const trueFall = termsAt({ v: m.v, theta: 90, g: m.g, run: false, rise: false, drop: true, bugs: NO_BUGS }, 4).drop;
      const k = (GROUND - 16 - y0) / Math.max(1e-6, trueFall);
      const unit = termsAt({ ...m, rise: false, run: false, drop: true }, 1).drop;
      const yAt = (t: number) => y0 + R + fall(t) * k;
      ctx.fillStyle = white(0.85 * colA);
      ctx.fillRect(x - 40, y0 - 1, 80, 2);
      ctx.save();
      ctx.setLineDash([3, 8]);
      ctx.strokeStyle = white(0.18 * colA);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y0);
      ctx.lineTo(x, GROUND);
      ctx.stroke();
      ctx.restore();
      const unitsA = r.n('units');
      const gapsA = r.n('gaps');
      for (let i = 1; i <= 4; i++) {
        if (colT + 1e-6 < i) break;
        const Y = yAt(i);
        ctx.beginPath();
        ctx.arc(x, Y, R * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = white(0.5 * colA);
        ctx.fill();
        const flash = clamp01(1 - (colT - i) / 0.35);
        if (flash > 0 && !o.still) {
          const g = ctx.createRadialGradient(x, Y, 0, x, Y, 46);
          g.addColorStop(0, white(0.6 * flash * colA));
          g.addColorStop(1, white(0));
          ctx.fillStyle = g;
          ctx.fillRect(x - 46, Y - 46, 92, 92);
        }
        const ua = colA * clamp01((unitsA * 4 - (i - 1)) * 2);
        if (ua > 0.01) {
          ctx.save();
          ctx.setLineDash([4, 6]);
          ctx.strokeStyle = white(0.45 * ua);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x - 24, Y);
          ctx.lineTo(x - 150, Y);
          ctx.stroke();
          ctx.restore();
          const units = fall(i) / unit;
          label(ctx, Math.abs(units - Math.round(units)) < 0.01 ? String(Math.round(units)) : units.toFixed(1), x - 168, Y, `italic 400 46px ${SERIF}`, ua, 'right');
        }
        const ga = colA * clamp01((gapsA * 4 - (i - 1)) * 2);
        if (ga > 0.01) {
          const Yp = i === 1 ? y0 + R : yAt(i - 1);
          ctx.strokeStyle = white(0.85 * ga);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + 36, Yp + 4);
          ctx.lineTo(x + 48, Yp + 4);
          ctx.lineTo(x + 48, Y - 4);
          ctx.lineTo(x + 36, Y - 4);
          ctx.stroke();
          const gap = (fall(i) - fall(i - 1)) / unit;
          label(ctx, Math.abs(gap - Math.round(gap)) < 0.01 ? String(Math.round(gap)) : gap.toFixed(1), x + 66, (Yp + Y) / 2, `italic 400 46px ${SERIF}`, ga, 'left');
        }
      }
      if (unitsA > 0.01) label(ctx, `1 unit = ${metres(unit)}`, x, y0 - 34, `400 18px ${MONO}`, 0.55 * unitsA * colA, 'center');
      ball(ctx, x, Math.min(GROUND - R, yAt(Math.min(colT, 4.2))), colA);
    }
  }

  // ---------------------------------------------------------------- odd numbers stack into squares
  const sq = r.n('squares');
  if (sq > 0.01) {
    const x0 = 1120;
    const y0 = 330;
    const u = 92;
    for (let k = 1; k <= 4; k++) {
      const a = clamp01(sq - (k - 1));
      if (a <= 0.001) continue;
      const cells: [number, number][] = [];
      for (let j = 0; j < k; j++) cells.push([k - 1, j]);
      for (let i = 0; i < k - 1; i++) cells.push([i, k - 1]);
      const grow = 0.7 + 0.3 * a;
      for (const [cx, cy] of cells) {
        const X = x0 + cx * u + u / 2;
        const Y = y0 + cy * u + u / 2;
        const s = (u - 10) * grow;
        ctx.beginPath();
        ctx.roundRect(X - s / 2, Y - s / 2, s, s, 8);
        ctx.fillStyle = white((k % 2 ? 0.2 : 0.07) * a);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = white(0.9 * a);
        ctx.stroke();
      }
      label(ctx, String(2 * k - 1), x0 + (k - 1) * u + u / 2, y0 + (k - 1) * u + u / 2, `italic 400 44px ${SERIF}`, a, 'center');
    }
    const sumsA = r.n('sums');
    const rows = ['1 = 1 ^2', '1 + 3 = 2 ^2', '1 + 3 + 5 = 3 ^2', '1 + 3 + 5 + 7 = 4 ^2'];
    rows.forEach((src, i) => {
      const a = clamp01((sumsA * 4 - i) * 2) * clamp01(sq - i);
      if (a <= 0.01) return;
      const lay = layoutMath(ctx, src, 44);
      drawMath(ctx, null, lay, 1, 1530 + lay.width / 2, y0 + i * u + u / 2 + 15, { alpha: a });
    });
  }

  // ---------------------------------------------------------------- the balls
  if (ghostA > 0.01) {
    const X = sx(now.k.run);
    const Y = by(now.k.rise);
    if (Y > -30 && X < VW + 30) {
      ctx.beginPath();
      ctx.arc(X, Y, R, 0, Math.PI * 2);
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = white(0.85 * ghostA);
      ctx.stroke();
    }
  }
  ball(ctx, sx(now.x), by(now.y), r.n('ball'));

  const flashA = r.n('flash');
  if (flashA > 0.01 && lands && bt >= land - 1e-6) {
    const X = sx(now.x);
    const top = by(now.k.rise);
    const g = ctx.createLinearGradient(X - 22, 0, X + 22, 0);
    g.addColorStop(0, white(0));
    g.addColorStop(0.5, white(0.22 * flashA));
    g.addColorStop(1, white(0));
    ctx.fillStyle = g;
    ctx.fillRect(X - 22, top, 44, by(0) - top);
    label(ctx, 'drop = rise', X, top - 40, `italic 400 44px ${SERIF}`, flashA, 'center');
  }

  // ---------------------------------------------------------------- sin 2θ
  const sinA = r.n('sinChart');
  if (sinA > 0.01) {
    const x0 = 1440;
    const y0 = 330;
    const w = 340;
    const h = 150;
    ctx.save();
    ctx.globalAlpha = sinA;
    ctx.fillStyle = white(0.4);
    ctx.fillRect(x0, y0 + h, w, 1.5);
    ctx.beginPath();
    for (let d = 0; d <= 90; d++) {
      const X = x0 + (d / 90) * w;
      const Y = y0 + h - Math.sin((2 * d * Math.PI) / 180) * h;
      if (d === 0) ctx.moveTo(X, Y);
      else ctx.lineTo(X, Y);
    }
    ctx.strokeStyle = white(1);
    ctx.lineWidth = 2.4;
    ctx.stroke();
    const th = m.theta;
    const X = x0 + (th / 90) * w;
    const Y = y0 + h - Math.sin((2 * th * Math.PI) / 180) * h;
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = white(0.7);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(X, y0 + h);
    ctx.lineTo(X, Y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(X, Y, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();
    label(ctx, 'sin 2θ', x0, y0 - 24, `italic 400 34px ${SERIF}`, sinA, 'left');
    label(ctx, `θ = ${Math.round(th)}°`, x0 + w, y0 - 24, `400 20px ${MONO}`, 0.8 * sinA, 'right');
    for (const d of [0, 45, 90]) label(ctx, `${d}°`, x0 + (d / 90) * w, y0 + h + 26, `400 17px ${MONO}`, 0.5 * sinA, 'center');
  }

  // ---------------------------------------------------------------- the equation
  const eqA = r.n('eq');
  const eqState = r.s<string>('eq');
  const size = r.n('eqSize');
  const eqY = r.n('eqY');
  let to: MathLayout | null = null;
  if (eqA > 0.01 || r.n('copy') > 0) {
    to = layoutMath(ctx, eqState.to, size);
    const from = eqState.from !== eqState.to && eqState.p < 1 ? layoutMath(ctx, eqState.from, size) : null;
    if (eqA > 0.01) drawMath(ctx, from, to, eqState.p, VW / 2, eqY, { alpha: eqA, highlight: (key) => r.n(`hl:${key}`) });
    const bracesA = r.n('braces') * eqA;
    if (bracesA > 0.01) {
      for (const b of r.s<Brace[]>('braces').to) {
        const sp = span(to, b.a, b.b, VW / 2, eqY);
        if (sp) drawBrace(ctx, sp.x1, sp.x2, Math.max(sp.bottom, eqY + size * 0.24) + 6, b.label, bracesA, 34);
      }
    }
    const readA = r.n('readout') * eqA;
    if (readA > 0.01) {
      // Carries the equation on: t = 2v sin θ / g ≈ 2.62 s.
      const f = flight(m.v, m.theta, m.g);
      const text = r.s<string>('readoutKind').to === 'T' ? `≈ ${seconds(f.T)}` : `≈ ${metres(f.R)}`;
      const w = from ? from.width + (to.width - from.width) * eqState.p : to.width;
      label(ctx, text, VW / 2 + w / 2 + size * 0.42, eqY - size * 0.27, `400 ${Math.round(size * 0.8)}px ${SERIF}`, readA, 'left');
    }
  }

  // A label flying from the picture into the equation, like Manim's TransformFromCopy.
  const copyP = r.n('copy');
  const copy = r.s<Copy | null>('copy').to;
  if (copy && copyP > 0.001 && copyP < 0.999 && to) {
    const src = anchors[copy.from];
    const dst = span(to, copy.a, copy.b, VW / 2, eqY);
    if (src && dst) {
      const e = copyP * copyP * (3 - 2 * copyP);
      const x = src.x + (dst.cx - src.x) * e;
      const y = src.y + (dst.top + (dst.bottom - dst.top) * 0.55 - src.y) * e - Math.sin(Math.PI * e) * 90;
      const s = src.size + (size * 0.92 - src.size) * e;
      const a = 1 - clamp01((copyP - 0.72) / 0.28);
      label(ctx, copy.text, x, y, `italic 400 ${s}px ${SERIF}`, a, 'center');
    }
  }

  // ---------------------------------------------------------------- cards
  const titleA = r.n('title');
  if (titleA > 0.01) {
    const t = r.s<{ num: number; text: string }>('titleCard').to;
    const dim = ctx.createRadialGradient(VW / 2, 500, 0, VW / 2, 500, 900);
    dim.addColorStop(0, `rgba(0,0,0,${0.7 * titleA})`);
    dim.addColorStop(1, `rgba(0,0,0,${0.35 * titleA})`);
    ctx.fillStyle = dim;
    ctx.fillRect(0, 0, VW, VH);
    label(ctx, `Chapter ${t.num}`, VW / 2, 430, `400 24px ${MONO}`, 0.6 * titleA, 'center');
    label(ctx, t.text, VW / 2, 520, `400 112px ${SERIF}`, titleA, 'center');
  }
  const introA = r.n('intro');
  if (introA > 0.01) {
    label(ctx, 'Why does a thrown ball', VW / 2, 450, `400 104px ${SERIF}`, introA, 'center');
    label(ctx, 'draw a parabola?', VW / 2, 570, `400 104px ${SERIF}`, introA, 'center');
    label(ctx, 'Living Equations', VW / 2, 680, `400 24px ${MONO}`, 0.55 * introA, 'center');
  }
  const endA = r.n('endCard');
  if (endA > 0.01) {
    label(ctx, 'Living Equations', VW / 2, 500, `400 128px ${SERIF}`, endA, 'center');
    label(ctx, 'Learn Things', VW / 2, 610, `400 26px ${MONO}`, 0.55 * endA, 'center');
  }

  // ---------------------------------------------------------------- bottom text
  // Lifted above the player's controls while they show, as on YouTube.
  const safe = o.safeBottom ?? VH;
  const ponderA = r.n('ponder');
  if (ponderA > 0.01) {
    const lift = Math.max(0, 1002 + 30 + 12 - safe);
    const tr = o.tr ?? ((x: string) => x);
    label(ctx, tr('Pause and ponder'), VW / 2, 948 - lift, `400 22px ${MONO}`, 0.6 * ponderA, 'center');
    label(ctx, tr(r.s<string>('prompt').to), VW / 2, 1002 - lift, `italic 400 50px ${SERIF}`, ponderA, 'center');
  } else if (o.caption) {
    ctx.font = `450 36px ${SANS}`;
    const lines = wrap(ctx, o.caption.text, 1460).slice(0, 2);
    const y = lines.length > 1 ? 978 : 1000;
    const lift = Math.max(0, y + (lines.length - 1) * 48 + 24 + 12 - safe);
    lines.forEach((l, i) => {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 10;
      label(ctx, l, VW / 2, y - lift + i * 48, `450 36px ${SANS}`, 0.94 * o.caption!.alpha, 'center');
      ctx.restore();
    });
  }

  // ---------------------------------------------------------------- film look
  const tiles = grainTiles();
  const frame = Math.floor(o.clock * 24);
  const tile = tiles[o.still ? 0 : frame % tiles.length];
  const pattern = ctx.createPattern(tile, 'repeat');
  if (pattern) {
    ctx.save();
    if (!o.still) ctx.translate(((frame * 53) % 256) - 128, ((frame * 97) % 256) - 128);
    ctx.fillStyle = pattern;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(-256, -256, VW + 512, VH + 512);
    ctx.restore();
  }
  const vig = ctx.createRadialGradient(VW / 2, VH * 0.47, VW * 0.3, VW / 2, VH * 0.47, VW * 0.78);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.6)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, VW, VH);
}
