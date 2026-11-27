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

describe('semiconductors chapter', () => {
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
    expect(n).toBeGreaterThan(5);
  });

  it('works out the photon thresholds', () => {
    expect(1240 / 1.1).toBeCloseTo(1127, 0);
    expect(1240 / 0.67).toBeCloseTo(1851, 0);
    expect(1240 / 5.4).toBeCloseTo(230, 0);
    expect(1240 / 2.0).toBe(620);
    // The photon constant: h c in eV nm.
    expect((6.626e-34 * 2.998e8) / 1.602e-19 / 1e-9).toBeCloseTo(1240, -1);
  });

  it('works out the doped silicon', () => {
    const ni = 1.5e16;
    expect(ni * ni).toBeCloseTo(2.25e32, -30);
    const p = (ni * ni) / 5e22;
    expect(p / 1e9).toBeCloseTo(4.5, 3);
    expect(5e22 / p / 1e13).toBeCloseTo(1.11, 2);
    expect(5e22 / 5e28).toBeCloseTo(1e-6, 12);
    expect(5e28 / ni / 1e12).toBeCloseTo(3.33, 2);
  });

  it('works out the junction field', () => {
    expect(0.7 / 1e-6).toBeCloseTo(7e5, 0);
  });

  it('works out the diode and resistor', () => {
    expect((5 - 0.7) / 215).toBeCloseTo(0.02, 10);
  });

  it('works out the rectifiers', () => {
    const Vm = Math.SQRT2 * 12;
    expect(Vm).toBeCloseTo(16.97, 2);
    expect(Vm / Math.PI).toBeCloseTo(5.4, 2);
    expect((2 * Vm) / Math.PI).toBeCloseTo(10.8, 2);
    expect(33.94 / Math.PI).toBeCloseTo(10.8, 2);
    expect(5.4 / 100).toBeCloseTo(0.054, 3);
    expect(10.8 / 100).toBeCloseTo(0.108, 3);
    expect(2 * 50).toBe(100);
  });

  it('works out the Zener regulator', () => {
    const IL = 5 / 500;
    expect(IL).toBeCloseTo(0.01, 10);
    const Is = 0.01 + IL;
    expect(Is).toBeCloseTo(0.02, 10);
    expect((10 - 5) / Is).toBeCloseTo(250, 8);
    expect(5 * 0.02).toBeCloseTo(0.1, 10);
    expect(5 + 0.01 * 250).toBeCloseTo(7.5, 10);
  });

  it('works out the LED and the solar panel', () => {
    expect((5 - 2.0) / 0.02).toBeCloseTo(150, 8);
    expect(0.02 ** 2 * 150).toBeCloseTo(0.06, 10);
    expect(2.0 * 0.02).toBeCloseTo(0.04, 10);
    expect(1000 * 1.6).toBe(1600);
    expect(0.2 * 1600).toBe(320);
    expect(320 / 40).toBe(8);
    expect(1600 - 320).toBe(1280);
  });
});
