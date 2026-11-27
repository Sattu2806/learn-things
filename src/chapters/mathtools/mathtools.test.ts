import { describe, expect, it } from 'vitest';
import { parseMath, type MathNode } from '../../film/math';
import chapterSource from './Chapter.tsx?raw';
import { buildFilm } from './film';

function count(nodes: MathNode[]): number {
  return nodes.reduce((n, x) => {
    if (x.t === 'tok') return n + 1 + (x.tok.sup ? 1 : 0) + (x.tok.sub ? 1 : 0);
    if (x.t === 'frac') return n + count(x.num) + count(x.den);
    return n + count(x.body);
  }, 0);
}

function maths(src: string): string[] {
  const out: string[] = [];
  for (const m of src.matchAll(/<M>\{?['`]([^'`]+)['`]\}?<\/M>|<M>([^<{]+)<\/M>/g)) out.push((m[1] ?? m[2]).trim());
  for (const m of src.matchAll(/src=\{?\[?((?:\s*'[^']*',?\s*)+)\]?\}?/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  for (const m of src.matchAll(/items=\{\[((?:\s*'[^']*',?\s*)+)\]\}/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  // table rows written as ['name', 'equation', ...] on one line
  for (const line of src.split('\n')) {
    const row = line.match(/^\s*\[('[^']*'(?:,\s*'[^']*')+)\],?\s*$/);
    if (row) for (const q of row[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  }
  for (const m of src.matchAll(/wrong=(?:"([^"]+)"|\{'([^']+)'\})/g)) out.push(m[1] ?? m[2]);
  return out;
}

/** The slips that parse "successfully" but lose symbols: glued brackets, stray bars, unbalanced brackets. */
function wellFormed(src: string) {
  const toks = src.replace(/"[^"]*"/g, 'TEXT').split(/\s+/).filter(Boolean);
  for (const t of toks) {
    if (t !== '[' && t.startsWith('[')) throw new Error(`bracket glued to "${t}" in: ${src}`);
    if (t !== ']' && t.endsWith(']')) throw new Error(`bracket glued to "${t}" in: ${src}`);
    if (t !== '√[' && t.startsWith('√[')) throw new Error(`root bracket glued to "${t}" in: ${src}`);
    if (t !== '|' && t.includes('|')) throw new Error(`bar glued to "${t}" in: ${src}`);
    if (/^[\^_]\[/.test(t)) throw new Error(`bracket inside a script in: ${src}`);
  }
  const opens = toks.filter((t) => t === '[' || t === '√[').length;
  expect(toks.filter((t) => t === ']').length, `brackets in: ${src}`).toBe(opens);
  expect(toks.filter((t) => t === '|').length, `bars in: ${src}`).toBe(toks.filter((t) => t === '[').length);
  expect((src.match(/"/g) ?? []).length % 2, `quotes in: ${src}`).toBe(0);
  for (const m of src.matchAll(/"[,.;:)]/g)) throw new Error(`punctuation after a closing quote in: ${src} (${m[0]})`);
}

function parsesFully(src: string) {
  wellFormed(src);
  const words = src
    .replace(/"[^"]*"/g, 'TEXT')
    .split(/\s+/)
    .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
  expect(count(parseMath(src)), src).toBe(words.length);
}

const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
const d = (f: (x: number) => number, x: number, h = 1e-6) => (f(x + h) - f(x - h)) / (2 * h);
const integral = (f: (x: number) => number, a: number, b: number, n = 20000) => {
  const h = (b - a) / n;
  return sum(Array.from({ length: n }, (_, i) => f(a + (i + 0.5) * h))) * h;
};

describe('mathtools chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(150);
    all.forEach(parsesFully);
  });

  it('writes every equation in the film so it parses completely', () => {
    const shots = buildFilm().spec.shots;
    let n = 0;
    for (const s of shots) {
      const steps = typeof s.eq === 'string' ? [s.eq] : (s.eq ?? []).map((e) => e.src);
      for (const src of steps) {
        parsesFully(src);
        n++;
      }
    }
    expect(n).toBeGreaterThan(10);
    expect(shots.length).toBe(6);
  });

  it('works out slope and area (examples 1 and 6)', () => {
    expect((14 - 6) / (6 - 2)).toBe(2);
    expect(6 - 2 * 2).toBe(2);
    expect(((6 + 14) / 2) * 4).toBe(40);
    // the figure line 2 + 2 t from 0 to 6 s gives (2 + 14) / 2 * 6 = 48
    expect(((2 + 14) / 2) * 6).toBe(48);
    expect(0.5 * 5 * 20).toBe(50);
    expect(20 * 10).toBe(200);
    expect(50 + 200).toBe(250);
    expect(250 / 15).toBeCloseTo(16.67, 2);
    // constant acceleration figure: u = 2, a = 1, area at 6 s
    expect(((2 + 8) / 2) * 6).toBe(30);
    expect(2 * 6 + 0.5 * 1 * 36).toBe(30);
  });

  it('works out the derivatives (examples 2 to 4)', () => {
    // from first principles: (3 (t + h)^2 - 3 t^2) / h = 6 t + 3 h
    for (const h of [1, 0.1, 0.001]) expect((3 * (2 + h) ** 2 - 3 * 4) / h).toBeCloseTo(12 + 3 * h, 9);
    expect(d((t) => 3 * t * t, 2)).toBeCloseTo(12, 5);
    const x = (t: number) => 4 * t ** 3 - 6 * t ** 2 + 2 * t + 1;
    const v = (t: number) => 12 * t ** 2 - 12 * t + 2;
    const a = (t: number) => 24 * t - 12;
    expect(d(x, 1)).toBeCloseTo(v(1), 5);
    expect(d(v, 1)).toBeCloseTo(a(1), 4);
    expect(v(1)).toBe(2);
    expect(a(1)).toBe(12);
    expect(a(0.5)).toBe(0);
    expect(v(0.5)).toBe(-1);
    const y = (t: number) => 20 * t - 5 * t * t;
    expect(20 - 10 * 2).toBe(0);
    expect(y(2)).toBe(20);
    expect(y(4)).toBe(0);
    expect(d(y, 2)).toBeCloseTo(0, 5);
    // the tangent slope of x^2 at 1 is 2 and the secant slope is 2 + h
    for (const h of [1, 0.1, 0.01]) expect(((1 + h) ** 2 - 1) / h).toBeCloseTo(2 + h, 9);
    expect(d(Math.sin, 1)).toBeCloseTo(Math.cos(1), 6);
  });

  it('works out the integrals (example 5, the rectangles, the theorem)', () => {
    expect(integral((t) => 6 * t, 0, 2)).toBeCloseTo(12, 6);
    expect(3 * 2 ** 2).toBe(12);
    expect(integral((t) => 3 * t * t, 0, 2)).toBeCloseTo(8, 6);
    expect(2 ** 3).toBe(8);
    expect(3 ** 3 / 3 - 0).toBe(9);
    expect(integral((x) => x * x, 0, 3)).toBeCloseTo(9, 6);
    const mid = (n: number) => {
      const dx = 3 / n;
      return sum(Array.from({ length: n }, (_, i) => ((i + 0.5) * dx) ** 2)) * dx;
    };
    expect(mid(2)).toBeCloseTo(8.4375, 4);
    expect(mid(4)).toBeCloseTo(8.859, 3);
    expect(mid(8)).toBeCloseTo(8.965, 3);
    expect(mid(16)).toBeCloseTo(8.991, 3);
    // the sampled cubic used for the figure
    const pts = Array.from({ length: 41 }, (_, i) => [i * 0.05, 3 * (i * 0.05) ** 2]);
    let area = 0;
    for (let i = 1; i < pts.length; i++) area += ((pts[i][1] + pts[i - 1][1]) / 2) * 0.05;
    expect(area).toBeCloseTo(8, 2);
  });

  it('works out the ball thrown upward', () => {
    const area = integral((t) => 20 - 10 * t, 0, 4);
    expect(area).toBeCloseTo(0, 6);
    expect(integral((t) => 20 - 10 * t, 0, 2)).toBeCloseTo(20, 6);
  });

  it('works out the small-angle examples and table', () => {
    const rad = (deg: number) => (deg * Math.PI) / 180;
    expect(rad(5)).toBeCloseTo(0.08727, 5);
    expect(Math.sin(rad(5))).toBeCloseTo(0.08716, 5);
    expect((0.08727 - 0.08716) / 0.08716).toBeCloseTo(0.0013, 4);
    expect(1 - 0.08727 ** 2 / 2).toBeCloseTo(0.99619, 5);
    expect(Math.cos(rad(5))).toBeCloseTo(0.99619, 5);
    const err = (deg: number) => ((rad(deg) - Math.sin(rad(deg))) / Math.sin(rad(deg))) * 100;
    expect(rad(1)).toBeCloseTo(0.017453, 6);
    expect(Math.sin(rad(1))).toBeCloseTo(0.017452, 6);
    expect(err(1)).toBeCloseTo(0.005, 3);
    expect(rad(5)).toBeCloseTo(0.087266, 6);
    expect(Math.sin(rad(5))).toBeCloseTo(0.087156, 6);
    expect(err(5)).toBeCloseTo(0.13, 2);
    expect(rad(10)).toBeCloseTo(0.174533, 6);
    expect(Math.sin(rad(10))).toBeCloseTo(0.173648, 6);
    expect(err(10)).toBeCloseTo(0.51, 2);
    expect(rad(20)).toBeCloseTo(0.349066, 6);
    expect(Math.sin(rad(20))).toBeCloseTo(0.34202, 5);
    expect(err(20)).toBeCloseTo(2.1, 1);
  });

  it('works out the binomial examples', () => {
    expect(32 / 6400).toBe(0.005);
    expect(9.8 * (1 - 2 * 0.005)).toBeCloseTo(9.702, 3);
    expect(9.8 / 1.005 ** 2).toBeCloseTo(9.7027, 3);
    expect(Number((9.8 * 0.99).toFixed(2))).toBe(9.7);
    expect(Math.sqrt(1.02)).toBeCloseTo(1.00995, 5);
    expect(1 + 0.02 / 2).toBe(1.01);
    // slope of (1 + x)^n at 0 is n, so the tangent line is 1 + n x
    for (const n of [0.5, -1, 2, -2]) expect(d((x) => (1 + x) ** n, 0)).toBeCloseTo(n, 5);
    // the next term is n (n - 1) / 2 x^2
    const x = 0.02, n = 0.5;
    expect((1 + x) ** n - (1 + n * x)).toBeCloseTo(((n * (n - 1)) / 2) * x * x, 6);
  });
});
