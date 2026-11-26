import { describe, expect, it } from 'vitest';
import { correct, flight, isCorrect, landingTime, makeModel, niceStep, termsAt } from './model';

const g = 9.8;

describe('the correct equations', () => {
  const m = makeModel(20, 45, g);

  it('match the textbook range, height and flight time', () => {
    const f = flight(20, 45, g);
    expect(f.R).toBeCloseTo(400 / g, 9);
    expect(f.H).toBeCloseTo(200 / (2 * g), 9);
    expect(landingTime(m)).toBeCloseTo(f.T, 9);
    expect(termsAt(m, f.T).x).toBeCloseTo(f.R, 9);
    expect(termsAt(m, f.T).y).toBeCloseTo(0, 9);
  });

  it('keep the ball exactly ½gt² below the no-gravity line', () => {
    for (const t of [0.3, 1, 2.2]) {
      const k = termsAt(m, t);
      expect(k.rise - k.y).toBeCloseTo(0.5 * g * t * t, 9);
    }
  });

  it('put the ghost at 4× the peak height when the ball lands', () => {
    const f = flight(20, 60, g);
    expect(f.ghostTop).toBeCloseTo(4 * f.H, 9);
  });

  it('land 30° and 60° at the same distance', () => {
    expect(flight(20, 30, g).R).toBeCloseTo(flight(20, 60, g).R, 9);
  });
});

describe('common mistakes', () => {
  const base = makeModel(20, 45, g);

  it('without the ½, falls twice as far and lands at half the distance', () => {
    const m = { ...base, bugs: { ...base.bugs, noHalf: true } };
    expect(termsAt(m, 1).drop).toBeCloseTo(g, 9);
    const T = landingTime(m)!;
    expect(termsAt(m, T).x).toBeCloseTo(flight(20, 45, g).R / 2, 9);
  });

  it('with t instead of t², goes in a straight line and never lands', () => {
    const m = { ...base, bugs: { ...base.bugs, linear: true } };
    expect(landingTime(m)).toBeNull();
    const a = termsAt(m, 1);
    const b = termsAt(m, 2);
    expect(b.y / b.x).toBeCloseTo(a.y / a.x, 9);
  });

  it('with a plus sign, never comes down', () => {
    expect(landingTime({ ...base, bugs: { ...base.bugs, plus: true } })).toBeNull();
  });

  it('with sin and cos swapped, 30° flies like 60°', () => {
    const m = { ...makeModel(20, 30, g), bugs: { ...base.bugs, swap: true } };
    const T = landingTime(m)!;
    expect(T).toBeCloseTo(flight(20, 60, g).T, 9);
    expect(termsAt(m, T).x).toBeCloseTo(flight(20, 60, g).R, 9);
  });

  it('without the launch term, never leaves the ground', () => {
    expect(landingTime({ ...base, rise: false })).toBe(0);
  });

  it('without gravity, never comes down', () => {
    expect(landingTime({ ...base, drop: false })).toBeNull();
  });

  it('knows a correct model when it sees one', () => {
    expect(isCorrect(base)).toBe(true);
    expect(isCorrect({ ...base, drop: false })).toBe(false);
    expect(isCorrect(correct({ ...base, rise: false, bugs: { ...base.bugs, swap: true } }))).toBe(true);
  });
});

describe('helpers', () => {
  it('picks round ruler steps', () => {
    expect(niceStep(3)).toBe(5);
    expect(niceStep(12)).toBe(20);
    expect(niceStep(100)).toBe(100);
  });
});
