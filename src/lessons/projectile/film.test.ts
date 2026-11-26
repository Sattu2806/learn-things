import { describe, expect, it } from 'vitest';
import { layoutMath } from '../../film/math';
import { EQ, buildFilm } from './film';

const ctx = {
  font: '16px serif',
  measureText: (t: string) => ({ width: t.length * 8 }) as TextMetrics,
} as unknown as CanvasRenderingContext2D;

const keys = (src: string) => new Set(layoutMath(ctx, src, 40).glyphs.map((g) => g.key));

describe('the film', () => {
  const f = buildFilm();

  it('is a few minutes long, in six chapters', () => {
    expect(f.duration).toBeGreaterThan(150);
    expect(f.duration).toBeLessThan(300);
    expect(f.chapters).toHaveLength(6);
    for (const c of f.chapters) expect(c.end).toBeGreaterThan(c.start);
  });

  it('has four "your turn" moments, each with controls and a hold for the video', () => {
    const pauses = f.beats.filter((b) => b.pause);
    expect(pauses).toHaveLength(4);
    for (const b of pauses) {
      expect(b.pause!.controls.length).toBeGreaterThan(0);
      expect(b.end - b.speakEnd).toBeGreaterThanOrEqual(2.5);
    }
  });

  it('gives every narrated beat enough time to be read aloud', () => {
    for (const b of f.beats.filter((x) => x.say)) {
      const words = b.say.split(/\s+/).length;
      expect(b.speakEnd - b.start).toBeGreaterThanOrEqual(words / 2.5);
    }
  });

  it('moves symbols, not just fades, between the steps of each derivation', () => {
    const pairs: [string, string, string[]][] = [
      [EQ.y1, EQ.y, ['v', 'sin', 'th', 'tR']],
      [EQ.y, EQ.land1, ['v', 'sin', 'th', 'tR', 'h', 'g', 'tD', 'sq', 'eq']],
      [EQ.land1, EQ.land2, ['v', 'sin', 'th', 'h', 'g', 'tD']],
      [EQ.land2, EQ.land3, ['v', 'sin', 'th', 'g', 'tD']],
      [EQ.range1, EQ.range2, ['R', 'v', 'cos', 'thc']],
      [EQ.range2, EQ.range3, ['R', 'v', 'vsq', 'sin', 'th', 'two', 'g']],
    ];
    for (const [a, b, shared] of pairs) {
      const ka = keys(a);
      const kb = keys(b);
      for (const k of shared) {
        expect(ka.has(k), `${k} in ${a}`).toBe(true);
        expect(kb.has(k), `${k} in ${b}`).toBe(true);
      }
    }
  });

  it('ends on the end card with the screen otherwise clear', () => {
    const T = f.duration - 0.1;
    expect(f.num('endCard', T)).toBe(1);
    expect(f.num('eq', T)).toBe(0);
    expect(f.num('ball', T)).toBe(0);
  });
});
