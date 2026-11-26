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
  for (const m of src.matchAll(/items=\{\[([^\]]*)\]\}/g)) for (const q of m[1].matchAll(/'([^']*)'/g)) out.push(q[1]);
  for (const m of src.matchAll(/\['[^']+', '([^']+)'\]/g)) out.push(m[1]);
  for (const m of src.matchAll(/wrong='([^']*)'/g)) out.push(m[1]);
  return out;
}

const vlen = (v: number[]) => Math.hypot(...v);
const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const deg = (r: number) => (r * 180) / Math.PI;

describe('vectors chapter', () => {
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

  it('example 1: two forces at 60 degrees', () => {
    const rx = 30 + 40 * Math.cos(Math.PI / 3);
    const ry = 40 * Math.sin(Math.PI / 3);
    expect(rx).toBeCloseTo(50, 9);
    expect(ry.toFixed(1)).toBe('34.6');
    expect(Math.hypot(rx, ry).toFixed(1)).toBe('60.8');
    expect(deg(Math.atan2(ry, rx)).toFixed(1)).toBe('34.7');
    expect(Math.sqrt(900 + 1600 + 2 * 30 * 40 * 0.5).toFixed(1)).toBe('60.8');
  });

  it('example 2: a 50 N pull at 30 degrees', () => {
    expect((50 * Math.cos(Math.PI / 6)).toFixed(1)).toBe('43.3');
    expect((50 * Math.sin(Math.PI / 6)).toFixed(1)).toBe('25.0');
  });

  it('example 3: 2i - 3j + 6k', () => {
    const v = [2, -3, 6];
    expect(vlen(v)).toBe(7);
    expect(v.map((c) => (c / 7).toFixed(3))).toEqual(['0.286', '-0.429', '0.857']);
    expect(v.map((c) => deg(Math.acos(c / 7)).toFixed(1))).toEqual(['73.4', '115.4', '31.0']);
    expect(v.reduce((s, c) => s + (c / 7) ** 2, 0)).toBeCloseTo(1, 12);
  });

  it('example 4: angle between two vectors', () => {
    const a = [2, 2, 1];
    const b = [3, 0, 4];
    expect(dot(a, b)).toBe(10);
    expect(vlen(a)).toBe(3);
    expect(vlen(b)).toBe(5);
    expect((10 / 15).toFixed(3)).toBe('0.667');
    expect(deg(Math.acos(10 / 15)).toFixed(1)).toBe('48.2');
    expect((10 / 3).toFixed(2)).toBe('3.33');
  });

  it('example 5: cross product and area', () => {
    const a = [2, 3, 1];
    const b = [1, -1, 2];
    const c = cross(a, b);
    expect(c).toEqual([7, -3, -5]);
    expect(dot(c, c)).toBe(83);
    expect(vlen(c).toFixed(2)).toBe('9.11');
    expect((vlen(c) / 2).toFixed(2)).toBe('4.56');
    expect(dot(c, a)).toBe(0);
    expect(dot(c, b)).toBe(0);
    expect(deg(Math.asin(vlen(c) / (vlen(a) * vlen(b)))).toFixed(1)).toBe('83.7');
  });

  it('example 6: the drone', () => {
    const l1 = [40, 30, 20];
    const l2 = [-10, 20, -15];
    const d = l1.map((x, i) => x + l2[i]);
    expect(d).toEqual([30, 50, 5]);
    expect(dot(d, d)).toBe(3425);
    expect(vlen(d).toFixed(1)).toBe('58.5');
    expect(vlen(l1).toFixed(1)).toBe('53.9');
    expect(vlen(l2).toFixed(1)).toBe('26.9');
    expect((vlen(l1) + vlen(l2)).toFixed(1)).toBe('80.8');
    expect(d.map((x) => x / 20)).toEqual([1.5, 2.5, 0.25]);
    expect((vlen(d) / 20).toFixed(2)).toBe('2.93');
    expect(((vlen(l1) + vlen(l2)) / 20).toFixed(2)).toBe('4.04');
  });

  it('quadrant mistake and helix numbers', () => {
    expect(deg(Math.atan(4 / -3)).toFixed(1)).toBe('-53.1');
    expect(deg(Math.atan2(4, -3)).toFixed(1)).toBe('126.9');
    // helix: speed is constant and the acceleration has size R w^2
    const R = 2;
    const w = 2;
    const u = 0.8;
    for (const t of [0, 0.7, 2.1]) {
      const v = [-R * w * Math.sin(w * t), R * w * Math.cos(w * t), u];
      expect(vlen(v)).toBeCloseTo(Math.sqrt(R * R * w * w + u * u), 9);
    }
    expect(Math.sqrt(R * R * w * w + u * u).toFixed(2)).toBe('4.08');
    // 3 N and 4 N at right angles
    expect(Math.hypot(3, 4)).toBe(5);
  });
});
