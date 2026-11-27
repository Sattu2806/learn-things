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
  for (const m of src.matchAll(/\['[^']+', '([^']+)'\]/g)) out.push(m[1]);
  for (const m of src.matchAll(/wrong=(?:"([^"]+)"|\{'([^']+)'\})/g)) out.push(m[1] ?? m[2]);
  return out;
}

function parsesFully(src: string) {
  const words = src
    .replace(/"[^"]*"/g, 'TEXT')
    .split(/\s+/)
    .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
  expect(count(parseMath(src)), src).toBe(words.length);
}

const deg = Math.PI / 180;

describe('motion in three dimensions chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(100);
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
    expect(n).toBeGreaterThan(8);
  });

  it('works out the displacement', () => {
    expect(Math.hypot(3, 4, 12)).toBe(13);
    expect(Math.hypot(3, 4)).toBe(5);
    expect(13 / 2).toBe(6.5);
    expect(Math.hypot(1.5, 2, 6)).toBeCloseTo(6.5, 10);
    expect(Math.acos(3 / 13) / deg).toBeCloseTo(76.7, 1);
    expect(Math.acos(4 / 13) / deg).toBeCloseTo(72.1, 1);
    expect(Math.acos(12 / 13) / deg).toBeCloseTo(22.6, 1);
    expect((3 / 13) ** 2 + (4 / 13) ** 2 + (12 / 13) ** 2).toBeCloseTo(1, 12);
    expect(3 / 13 + 4 / 13 + 12 / 13).toBeCloseTo(1.46, 2);
    expect(3 + 4 + 12).toBe(19);
  });

  it('works out the position function', () => {
    const r = (t: number) => [2 * t, 3 * t * t, 5 - t * t];
    expect(r(2)).toEqual([4, 12, 1]);
    const v = (t: number) => [2, 6 * t, -2 * t];
    expect(v(2)).toEqual([2, 12, -4]);
    expect(Math.hypot(2, 12, 4) ** 2).toBe(164);
    expect(Math.hypot(2, 12, 4)).toBeCloseTo(12.8, 1);
    expect(Math.hypot(6, 2)).toBeCloseTo(6.32, 2);
    // Numerical derivative agrees.
    const h = 1e-6;
    expect((r(2 + h)[1] - r(2 - h)[1]) / (2 * h)).toBeCloseTo(12, 4);
  });

  it('works out the split of the acceleration', () => {
    const dot = 2 * 3 + 1 * 4 + 2 * 0;
    expect(dot).toBe(10);
    expect(Math.hypot(3, 4)).toBe(5);
    expect(Math.hypot(2, 1, 2)).toBe(3);
    expect(dot / 5).toBe(2);
    expect(Math.sqrt(9 - 4)).toBeCloseTo(2.24, 2);
    expect(Math.acos(10 / 15) / deg).toBeCloseTo(48.2, 1);
  });

  it('works out the projectile in a crosswind', () => {
    const g = 9.8;
    const vx = 20 * Math.cos(40 * deg);
    const vz = 20 * Math.sin(40 * deg);
    expect(vx).toBeCloseTo(15.32, 2);
    expect(vz).toBeCloseTo(12.86, 2);
    const T = (2 * vz) / g;
    expect(T).toBeCloseTo(2.624, 3);
    expect(vz ** 2).toBeCloseTo(165.3, 1);
    const H = vz ** 2 / (2 * g);
    expect(H).toBeCloseTo(8.43, 2);
    expect(vx * 2.624).toBeCloseTo(40.2, 1);
    expect(0.5 * 2 * 2.624 ** 2).toBeCloseTo(6.89, 2);
    expect(2 * 2.624).toBeCloseTo(5.25, 2);
    expect(15.32 ** 2 + 5.25 ** 2 + 12.86 ** 2).toBeCloseTo(427.7, 0);
    expect(Math.sqrt(427.7)).toBeCloseTo(20.7, 1);
    expect(Math.atan(6.89 / 40.2) / deg).toBeCloseTo(9.7, 1);
    // The height is unchanged by the wind: the ball is down at T whatever the sideways push.
    expect(vz * T - 0.5 * g * T * T).toBeCloseTo(0, 10);
  });

  it('works out the circle', () => {
    const w = 2 * Math.PI * 2;
    expect(w).toBeCloseTo(12.57, 2);
    expect(w * 0.5).toBeCloseTo(6.28, 2);
    expect(w * w * 0.5).toBeCloseTo(79.0, 1);
    expect((w * 0.5) ** 2 / 0.5).toBeCloseTo(79.0, 1);
    expect(0.5 * Math.cos(45 * deg)).toBeCloseTo(0.354, 3);
    expect(w * 0.5 * Math.sin(45 * deg)).toBeCloseTo(4.44, 2);
    expect(w * w * 0.5 * Math.cos(45 * deg)).toBeCloseTo(55.8, 1);
    // r . v = 0 at every angle.
    for (const th of [0.3, 1.1, 2.9]) {
      const r = [Math.cos(th), Math.sin(th)];
      const v = [-Math.sin(th), Math.cos(th)];
      expect(r[0] * v[0] + r[1] * v[1]).toBeCloseTo(0, 12);
    }
  });

  it('works out the helix', () => {
    expect(3 * 2).toBe(6);
    expect(Math.sqrt(36 + 2.25)).toBeCloseTo(6.18, 2);
    expect(3 * 3 * 2).toBe(18);
    expect((2 * Math.PI * 1.5) / 3).toBeCloseTo(3.14, 2);
    expect(10 / Math.PI).toBeCloseTo(3.18, 2);
  });

  it('works out the proton', () => {
    const m = 1.67e-27;
    const q = 1.6e-19;
    const w = (q * 0.1) / m;
    expect(w / 1e6).toBeCloseTo(9.58, 2);
    const T = (2 * Math.PI) / w;
    expect(T / 1e-7).toBeCloseTo(6.56, 2);
    const vperp = 1e6 * Math.sin(30 * deg);
    const vpar = 1e6 * Math.cos(30 * deg);
    expect(vpar / 1e5).toBeCloseTo(8.66, 2);
    expect(vperp / w).toBeCloseTo(0.0522, 4);
    expect(vpar * T).toBeCloseTo(0.568, 3);
  });
});
