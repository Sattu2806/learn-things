import { describe, expect, it } from 'vitest';
import { parseMath, type MathNode } from '../../film/math';
import chapterSource from './Chapter.tsx?raw';

// Every maths string in the chapter must parse completely: a stray "|" or a
// bracket glued to a number silently drops the rest of the equation.
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
  for (const m of src.matchAll(/\['[^']+', '([^']+)'\]/g)) out.push(m[1]);
  for (const m of src.matchAll(/\['([^']+)', '[^']+', '[^']+'\]/g)) out.push(m[1]);
  for (const m of src.matchAll(/wrong='([^']+)'/g)) out.push(m[1]);
  for (const m of src.matchAll(/items=\{\[((?:\s*'[^']*',?\s*)+)\]\}/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  return out;
}

describe('relative velocity chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(80);
    for (const src of all) {
      const words = src
        .replace(/"[^"]*"/g, 'TEXT')
        .split(/\s+/)
        .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
      expect(count(parseMath(src)), src).toBe(words.length);
    }
  });

  it('works out the examples right', () => {
    const deg = (r: number) => (r * 180) / Math.PI;
    // 1: overtaking
    expect((40 + 20) / (25 - 20)).toBe(12);
    expect(25 * 12).toBe(300);
    expect(20 * 12).toBe(240);
    expect(900 - (25 + 20) * 12).toBe(360);
    // 2: river
    expect(100 / 5).toBe(20);
    expect(3 * 20).toBe(60);
    expect(deg(Math.asin(3 / 5)).toFixed(1)).toBe('36.9');
    expect(Math.sqrt(25 - 9)).toBe(4);
    expect(100 / 4).toBe(25);
    // 3: rain
    expect(deg(Math.atan(8 / 6)).toFixed(1)).toBe('53.1');
    expect(Math.hypot(6, 8)).toBe(10);
    expect((1.5 / Math.tan((30 * Math.PI) / 180)).toFixed(2)).toBe('2.60');
    // 4: plane
    expect(deg(Math.asin(50 / 200)).toFixed(1)).toBe('14.5');
    expect(deg(Math.atan(50 / 200)).toFixed(1)).toBe('14.0');
    const gs = Math.sqrt(200 ** 2 - 50 ** 2);
    expect(gs.toFixed(0)).toBe('194');
    expect((500 / gs).toFixed(2)).toBe('2.58');
    expect(50 * (500 / 200)).toBe(125);
    // 5: ships
    const r0 = [40, 30];
    const v = [-15, -20];
    const sp = Math.hypot(v[0], v[1]);
    expect(sp).toBe(25);
    const ts = -(r0[0] * v[0] + r0[1] * v[1]) / sp ** 2;
    expect(ts.toFixed(2)).toBe('1.92');
    const d = Math.hypot(r0[0] + v[0] * ts, r0[1] + v[1] * ts);
    expect(d.toFixed(1)).toBe('14.0');
    expect(50 * 0.28).toBeCloseTo(14, 6);
    expect((50 * 0.96) / 25).toBeCloseTo(1.92, 6);
    // 6: projectiles
    expect(Math.hypot(17, 9).toFixed(1)).toBe('19.2');
    expect(deg(Math.atan(9 / 17)).toFixed(1)).toBe('27.9');
    expect(Math.hypot(34, 18).toFixed(1)).toBe('38.5');
    const g = 9.8;
    const A = [12 * 2, -0.5 * g * 4];
    const B = [-5 * 2, 9 * 2 - 0.5 * g * 4];
    expect(Math.hypot(A[0] - B[0], A[1] - B[1]).toFixed(1)).toBe('38.5');
  });
});
