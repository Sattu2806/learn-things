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

const c = 3e8;
const R = 6.4e6;

describe('communication chapter', () => {
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

  it('works out bandwidth and channels', () => {
    expect(3100 - 300).toBe(2800);
    expect(2 * 5).toBe(10);
    expect((1600 - 540) / 10).toBeCloseTo(106, 10);
  });

  it('works out antenna sizes', () => {
    expect(c / 3e3).toBe(1e5);
    expect(c / 3e3 / 4).toBe(25000);
    expect(c / 1e6).toBe(300);
    expect(c / 1e6 / 4).toBe(75);
    expect(c / 1e8).toBe(3);
    expect(c / 1e8 / 4).toBe(0.75);
  });

  it('works out the AM wave', () => {
    const mu = 6 / 10;
    expect(mu).toBeCloseTo(0.6, 10);
    expect(1000 - 5).toBe(995);
    expect((mu * 10) / 2).toBeCloseTo(3, 10);
    expect(10 + 6).toBe(16);
    expect(10 - 6).toBe(4);
    expect((16 - 4) / (16 + 4)).toBeCloseTo(0.6, 10);
    expect(1 + 0.6 ** 2 / 2).toBeCloseTo(1.18, 10);
    expect(1 / (1 + 2 / 1 ** 2)).toBeCloseTo(1 / 3, 10);
  });

  it('works out the FM station', () => {
    expect(75 / 15).toBe(5);
    expect(2 * (75 + 15)).toBe(180);
    expect(2 * 15).toBe(30);
  });

  it('works out the horizon distances', () => {
    const d = Math.sqrt(2 * R * 200);
    expect(2 * R * 200).toBeCloseTo(2.56e9, 0);
    expect(d / 1e4).toBeCloseTo(5.06, 2);
    expect((Math.PI * d * d) / 1e9).toBeCloseTo(8.04, 2);
    expect(Math.sqrt(2 * R * 100) / 1e3).toBeCloseTo(35.8, 1);
    expect(Math.sqrt(2 * R * 25) / 1e3).toBeCloseTo(17.9, 1);
    expect((Math.sqrt(2 * R * 100) + Math.sqrt(2 * R * 25)) / 1e3).toBeCloseTo(53.7, 1);
    expect(9 * Math.sqrt(1e12)).toBe(9e6);
    // Doubling the height gives 41% more range and twice the area.
    expect(Math.sqrt(2)).toBeCloseTo(1.414, 3);
  });

  it('works out the digital examples', () => {
    expect(2 ** 8).toBe(256);
    expect(2 ** 3).toBe(8);
    expect(2 ** 16).toBe(65536);
    expect(8000 * 8).toBe(64000);
    expect(2 * 4000).toBe(8000);
    const cd = 44100 * 16 * 2;
    expect(cd).toBe(1411200);
    expect((cd * 60) / 1e7).toBeCloseTo(8.47, 2);
    expect((cd * 60) / 8 / 1e6).toBeCloseTo(10.6, 1);
  });

  it('works out the tuning', () => {
    const f = 1e6;
    const L = 250e-6;
    expect(4 * Math.PI ** 2).toBeCloseTo(39.48, 2);
    const C = 1 / (4 * Math.PI ** 2 * f * f * L);
    expect(C / 1e-10).toBeCloseTo(1.013, 2);
    expect(1 / (2 * Math.PI * Math.sqrt(L * C))).toBeCloseTo(f, 0);
    expect(101 / 1.6 ** 2).toBeCloseTo(39.45, 1);
    expect(1 / (4 * Math.PI ** 2 * 1.6e6 ** 2 * L) / 1e-12).toBeCloseTo(39.6, 1);
  });
});
