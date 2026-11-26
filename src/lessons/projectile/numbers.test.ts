import { describe, expect, it } from 'vitest';
import { flight } from './model';
import { at, solve } from './numbers';

// The theory page quotes these numbers; if the physics changes, they must too.
describe('worked numbers', () => {
  it('matches the throw in the film: 20 m/s at 40°', () => {
    const s = solve({ v: 20, theta: 40, g: 9.8 });
    expect(s.vx.toFixed(2)).toBe('15.32');
    expect(s.vy.toFixed(2)).toBe('12.86');
    expect(s.T.toFixed(2)).toBe('2.62');
    expect(s.tTop.toFixed(2)).toBe('1.31');
    expect(s.H.toFixed(2)).toBe('8.43');
    expect(s.R.toFixed(1)).toBe('40.2');
    expect(s.impact).toBeCloseTo(20, 9);
  });

  it('agrees with the film model for ground launches', () => {
    for (const [v, theta, g] of [
      [20, 40, 9.8],
      [12, 70, 1.6],
      [33, 15, 3.7],
    ]) {
      const s = solve({ v, theta, g });
      const f = flight(v, theta, g);
      expect(s.T).toBeCloseTo(f.T, 9);
      expect(s.R).toBeCloseTo(f.R, 9);
      expect(s.H).toBeCloseTo(f.H, 9);
    }
  });

  it('scales by 9.8 / 1.6 on the Moon', () => {
    const earth = solve({ v: 20, theta: 35, g: 9.8 });
    const moon = solve({ v: 20, theta: 35, g: 1.6 });
    expect([earth.T.toFixed(2), earth.H.toFixed(2), earth.R.toFixed(1)]).toEqual(['2.34', '6.71', '38.4']);
    expect([moon.T.toFixed(1), moon.H.toFixed(1), moon.R.toFixed(0)]).toEqual(['14.3', '41.1', '235']);
    expect(moon.R / earth.R).toBeCloseTo(9.8 / 1.6, 9);
  });

  it('handles a sideways kick off a cliff', () => {
    const s = solve({ v: 5, theta: 0, g: 9.8, h: 20 });
    expect(s.T.toFixed(2)).toBe('2.02');
    expect(s.R.toFixed(1)).toBe('10.1');
    expect(s.impact.toFixed(1)).toBe('20.4');
    expect(at({ v: 5, theta: 0, g: 9.8, h: 20 }, s.T).y).toBeCloseTo(0, 9);
  });

  it('gives the same range for angles that add to 90°', () => {
    expect(solve({ v: 20, theta: 30, g: 9.8 }).R).toBeCloseTo(solve({ v: 20, theta: 60, g: 9.8 }).R, 9);
    expect(solve({ v: 20, theta: 45, g: 9.8 }).R.toFixed(1)).toBe('40.8');
  });

  it('answers the practice questions', () => {
    const kick = solve({ v: 25, theta: 30, g: 9.8 });
    expect([kick.T.toFixed(2), kick.H.toFixed(2), kick.R.toFixed(1), kick.vx.toFixed(1)]).toEqual(['2.55', '7.97', '55.2', '21.7']);
    expect(solve({ v: 25, theta: 30, g: 3.7 }).R.toFixed(0)).toBe('146');
    const cliff = solve({ v: 8, theta: 0, g: 9.8, h: 45 });
    expect([cliff.T.toFixed(2), cliff.R.toFixed(1)]).toEqual(['3.03', '24.2']);
  });
});

describe('beyond flat ground', () => {
  it('works on slopes', async () => {
    const { onIncline, inclineMax, samplePath } = await import('./numbers');
    const up = onIncline(20, 60, 10, 30);
    expect(up.T.toFixed(2)).toBe('2.31');
    expect(up.along.toFixed(2)).toBe('26.67');
    expect(inclineMax(20, 10, 30).along.toFixed(2)).toBe('26.67');
    expect(inclineMax(20, 10, -30).along.toFixed(0)).toBe('80');
    const p = samplePath({ v: 20, theta: 60, g: 10, incline: 30 });
    const end = p[p.length - 1];
    expect(end.y).toBeCloseTo(end.x * Math.tan(Math.PI / 6), 6);
  });

  it('finds angles, aims and curves', async () => {
    const { anglesFor, slowestTo, curveRadius } = await import('./numbers');
    const [lo, hi] = anglesFor(20, 9.8, 30)!;
    expect([lo.toFixed(1), hi.toFixed(1)]).toEqual(['23.7', '66.3']);
    expect(anglesFor(20, 9.8, 50)).toBeNull();
    expect(slowestTo(40, 30, 10).v.toFixed(2)).toBe('28.28');
    expect(curveRadius({ v: 20, theta: 60, g: 10 }, Math.sqrt(3))).toBeCloseTo(10, 9);
  });

  it('lands short with air drag', async () => {
    const { samplePath } = await import('./numbers');
    const free = samplePath({ v: 30, theta: 45, g: 9.8 });
    const dragged = samplePath({ v: 30, theta: 45, g: 9.8, drag: 0.01 });
    const R = (p: typeof free) => p[p.length - 1].x;
    expect(R(free)).toBeCloseTo((30 * 30) / 9.8, 6);
    expect(R(dragged)).toBeLessThan(R(free) * 0.8);
    expect(dragged[dragged.length - 1].y).toBeCloseTo(0, 6);
  });
});
