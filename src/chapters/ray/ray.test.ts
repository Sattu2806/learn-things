import { describe, expect, it } from 'vitest';
import { parseMath, type MathNode } from '../../film/math';
import chapterSource from './Chapter.tsx?raw';
import filmSource from './film.ts?raw';

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
  for (const m of src.matchAll(/wrong=(?:"([^"]+)"|\{'([^']+)'\})/g)) out.push(m[1] ?? m[2]);
  return out;
}

function check(all: string[]) {
  for (const src of all) {
    const words = src
      .replace(/"[^"]*"/g, 'TEXT')
      .split(/\s+/)
      .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
    expect(count(parseMath(src)), src).toBe(words.length);
  }
}

const deg = (r: number) => (r * 180) / Math.PI;

describe('ray optics chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(100);
    check(all);
  });

  it('writes the film equations so they parse completely', () => {
    const all = [...filmSource.matchAll(/src: '([^']+)'/g)].map((m) => m[1]);
    expect(all.length).toBeGreaterThan(8);
    check(all);
  });

  it('works out the examples right', () => {
    // 2: concave mirror
    const f2 = -15;
    const v2 = 1 / (1 / f2 - 1 / -40);
    expect(v2).toBeCloseTo(-24, 8);
    expect(-v2 / -40).toBeCloseTo(-0.6, 8);
    // 3: convex mirror
    const v3 = 1 / (1 / 20 - 1 / -30);
    expect(v3).toBeCloseTo(12, 8);
    expect(-v3 / -30).toBeCloseTo(0.4, 8);
    // 4: Snell and the pool
    expect(deg(Math.asin(0.5 / 1.5))).toBeCloseTo(19.47, 2);
    expect(2.0 / (4 / 3)).toBeCloseTo(1.5, 10);
    // 5: critical angles
    expect(deg(Math.asin(1 / 1.5))).toBeCloseTo(41.81, 2);
    expect(deg(Math.asin(0.75))).toBeCloseTo(48.59, 2);
    expect(deg(Math.asin(1.4 / 1.5))).toBeCloseTo(68.96, 2);
    // 6: spherical surface
    const v6 = 1.5 / (0.5 / 20 + 1 / -60);
    expect(v6).toBeCloseTo(180, 6);
    // 7: convex lens
    const v7 = 1 / (1 / 20 + 1 / -30);
    expect(v7).toBeCloseTo(60, 8);
    expect(v7 / -30).toBeCloseTo(-2, 8);
    expect(1 / 0.2).toBeCloseTo(5, 10);
    // 8: lens maker formula
    expect(1 / (0.5 * (1 / 20 + 1 / 20))).toBeCloseTo(20, 8);
    expect(1.5 / (4 / 3)).toBeCloseTo(1.125, 10);
    expect(1 / (0.125 * 0.1)).toBeCloseTo(80, 8);
    // 9: lenses in contact
    const P = 1 / 0.1 + 1 / -0.4;
    expect(P).toBeCloseTo(7.5, 10);
    expect(100 / P).toBeCloseTo(13.33, 2);
    // 10: prism
    expect(Math.sin(45 * (Math.PI / 180)) / Math.sin(30 * (Math.PI / 180))).toBeCloseTo(1.414, 3);
    expect((1.5 - 1) * 5).toBeCloseTo(2.5, 10);
    // 11: microscope
    const vo = 1 / (1 / 1 + 1 / -1.2);
    expect(vo).toBeCloseTo(6, 8);
    expect(vo / -1.2).toBeCloseTo(-5, 8);
    expect(1 + 25 / 5).toBe(6);
    const se = 1 / (1 / 5 + 1 / 25);
    expect(se).toBeCloseTo(4.1667, 3);
    expect(vo + se).toBeCloseTo(10.17, 2);
    expect((20 / 1) * (25 / 5)).toBe(100);
    // 12: telescope
    expect(100 / 2.5).toBe(40);
    expect(100 + 2.5).toBe(102.5);
    expect(40 * 0.5).toBe(20);
    // 1: plane mirror and the near-point formulas
    expect(2 * 2).toBe(4);
    expect(1 + 25 / 5).toBe(6);
    // diamond critical angle quoted in the notes
    expect(deg(Math.asin(1 / 2.42))).toBeCloseTo(24.4, 1);
    // minimum deviation with n = 1.5 and A = 60 (the prism animation)
    const n = 1.5;
    const A = (60 * Math.PI) / 180;
    expect(2 * deg(Math.asin(n * Math.sin(A / 2))) - 60).toBeCloseTo(37.18, 2);
  });
});
