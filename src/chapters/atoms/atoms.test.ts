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

function parsesFully(src: string) {
  const words = src
    .replace(/"[^"]*"/g, 'TEXT')
    .split(/\s+/)
    .filter((w) => w && !['[', '|', ']'].includes(w) && !w.startsWith('[') && !w.startsWith('√['));
  expect(count(parseMath(src)), src).toBe(words.length);
}

describe('atoms chapter', () => {
  it('writes every equation so it parses completely', () => {
    const all = maths(chapterSource);
    expect(all.length).toBeGreaterThan(60);
    all.forEach(parsesFully);
  });

  it('writes every equation of the film so it parses completely', () => {
    const all = [...filmSource.matchAll(/src: '([^']+)'/g)].map((m) => m[1]);
    expect(all.length).toBeGreaterThanOrEqual(8);
    all.forEach(parsesFully);
  });

  it('works out the examples right', () => {
    const h = 6.63e-34, m = 9.11e-31;
    const R = 1.097e7;
    const C = 1.44; // e^2 / 4 pi eps0, in MeV fm
    // 1: closest approach
    expect((2 * 79 * C) / 5.5).toBeCloseTo(41.4, 1);
    expect(2 * 79 * C).toBeCloseTo(227.5, 1);
    // physical constants give the same 1.44 MeV fm
    const eps0 = 8.854e-12, e = 1.602e-19;
    expect(e ** 2 / (4 * Math.PI * eps0) / (e * 1e6) / 1e-15).toBeCloseTo(1.44, 2);
    // 2: impact parameters
    const k = (79 * C) / 5.5;
    expect(k).toBeCloseTo(20.7, 1);
    expect(k / Math.tan((90 * Math.PI) / 180 / 2)).toBeCloseTo(20.7, 1);
    expect(k / Math.tan((60 * Math.PI) / 180 / 2)).toBeCloseTo(35.8, 1);
    expect(1 / Math.tan((30 * Math.PI) / 180)).toBeCloseTo(1.732, 3);
    expect(((2 * 79 * C) / 5.5) / 2).toBeCloseTo(k, 8);
    // 3: third Bohr orbit
    expect(9 * 0.529).toBeCloseTo(4.76, 2);
    expect(2.19e6 / 3).toBeCloseTo(7.3e5, -3);
    expect(-13.6 / 9).toBeCloseTo(-1.51, 2);
    expect((2 * -13.6) / 9).toBeCloseTo(-3.02, 2);
    // the 13.6 eV and a0 from the constants
    const eps = eps0, mm = 9.109e-31, hh = 6.626e-34;
    expect((mm * e ** 4) / (8 * eps ** 2 * hh ** 2) / e).toBeCloseTo(13.6, 1);
    expect((eps * hh ** 2) / (Math.PI * mm * e ** 2) / 1e-10).toBeCloseTo(0.529, 3);
    expect(e ** 2 / (2 * eps * hh)).toBeCloseTo(2.19e6, -4);
    expect(2.19e6 / 3e8).toBeCloseTo(1 / 137, 3);
    // 4: H-alpha
    const inv = R * (1 / 4 - 1 / 9);
    expect(inv).toBeCloseTo(1.524e6, -3);
    expect(1 / inv).toBeCloseTo(6.56e-7, 9);
    expect(3e8 / 6.56e-7).toBeCloseTo(4.57e14, -12);
    expect(-1.51 - -3.4).toBeCloseTo(1.89, 2);
    expect(1240 / 1.89).toBeCloseTo(656, 0);
    expect(13.6 / 1240 / 1e-9).toBeCloseTo(R, -5);
    // 5: series edges
    expect(R / 4).toBeCloseTo(2.74e6, -4);
    expect((4 / R) * 1e9).toBeCloseTo(364.6, 1);
    expect(R * (1 - 1 / 4)).toBeCloseTo(8.23e6, -4);
    expect((1 / (R * 0.75)) * 1e9).toBeCloseTo(121.5, 0);
    expect((1 / R) * 1e9).toBeCloseTo(91.2, 1);
    // 6: exciting hydrogen
    expect(-13.6 + 12.09).toBeCloseTo(-1.51, 2);
    expect(Math.sqrt(13.6 / 1.51)).toBeCloseTo(3, 1);
    expect(13.6 * (1 - 1 / 4)).toBeCloseTo(10.2, 5);
    expect(13.6 * (1 - 1 / 9)).toBeCloseTo(12.09, 2);
    expect(1240 / 10.2).toBeCloseTo(122, 0);
    expect(1240 / 12.09).toBeCloseTo(103, 0);
    expect((3 * 2) / 2).toBe(3);
    // 7: He+
    expect(-13.6 * 4).toBeCloseTo(-54.4, 5);
    expect(0.529 / 2).toBeCloseTo(0.265, 2);
    expect(54.4 * 0.75).toBeCloseTo(40.8, 5);
    expect(1240 / 40.8).toBeCloseTo(30.4, 1);
    // 8: waves on the second orbit
    const v2 = 2.19e6 / 2;
    expect(v2).toBeCloseTo(1.095e6, -3);
    const lam = h / (m * 1.095e6);
    expect(lam).toBeCloseTo(6.65e-10, 12);
    const r2 = 4 * 0.529e-10;
    expect(r2).toBeCloseTo(2.116e-10, 13);
    expect(2 * Math.PI * r2).toBeCloseTo(13.3e-10, 11);
    expect((2 * Math.PI * r2) / lam).toBeCloseTo(2, 1);
    // 9: ionising from n = 2, and counting lines
    expect(1240 / 3.4).toBeCloseTo(365, 0);
    expect((5 * 4) / 2).toBe(10);
    expect((4 * 3) / 2).toBe(6);
    // the table of radii
    expect(4 * 0.529).toBeCloseTo(2.12, 2);
    expect(16 * 0.529).toBeCloseTo(8.46, 2);
    // Balmer lines
    for (const [ni, l] of [[3, 656.3], [4, 486.1], [5, 434.1], [6, 410.2]] as const) {
      expect(1e9 / (R * (1 / 4 - 1 / (ni * ni)))).toBeCloseTo(l, -0.5);
    }
  });
});
