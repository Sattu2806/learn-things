import { describe, expect, it } from 'vitest';
import { BUG_ROUNDS, LANDING_LINES, STEPS, initialLesson, lessonReducer, roundModel, stepComplete } from './lesson';
import { flight, isCorrect, landingTime, termsAt } from './model';

const at = (id: string) => lessonReducer(initialLesson(), { type: 'goto', step: STEPS.findIndex((s) => s.id === id) });

describe('lesson flow', () => {
  it('marks a step done once its main interaction happens', () => {
    let s = at('gravity');
    expect(stepComplete(s)).toBe(false);
    s = lessonReducer(s, { type: 'touch' });
    expect(stepComplete(s)).toBe(true);
    expect(s.done[1]).toBe(true);
  });

  it('walks through the landing derivation line by line', () => {
    let s = at('landing');
    for (let i = 1; i < LANDING_LINES.length; i++) s = lessonReducer(s, { type: 'line' });
    expect(s.line).toBe(LANDING_LINES.length);
    expect(stepComplete(s)).toBe(true);
    s = lessonReducer(s, { type: 'line' });
    expect(s.line).toBe(LANDING_LINES.length);
  });

  it('scores bugs found within two guesses', () => {
    let s = at('bugs');
    s = lessonReducer(s, { type: 'guess', target: 'g' });
    expect(s.found).toBe(false);
    expect(s.lastWrong).toBe('g');
    s = lessonReducer(s, { type: 'guess', target: 'square' });
    expect(s.found).toBe(true);
    expect(s.score).toBe(1);
    s = lessonReducer(s, { type: 'nextRound' });
    s = lessonReducer(s, { type: 'reveal' });
    expect(s.found).toBe(true);
    expect(s.score).toBe(1);
  });

  it('finishes the lesson after the last bug', () => {
    let s = at('bugs');
    for (let i = 0; i < BUG_ROUNDS.length; i++) {
      s = lessonReducer(s, { type: 'reveal' });
      s = lessonReducer(s, { type: 'nextRound' });
    }
    expect(s.mode).toBe('complete');
  });
});

describe('bug rounds', () => {
  it('each hides a real mistake that the fix removes', () => {
    for (const r of BUG_ROUNDS) {
      expect(isCorrect(roundModel(r, 9.8, false))).toBe(false);
      expect(isCorrect(roundModel(r, 9.8, true))).toBe(true);
    }
  });

  it('show motion that matches their clues', () => {
    const [linear, noHalf, plus, swap, noRise] = BUG_ROUNDS.map((r) => roundModel(r, 9.8, false));
    expect(landingTime(linear)).toBeNull();
    expect(landingTime(plus)).toBeNull();
    expect(landingTime(noRise)).toBe(0);
    const f = flight(noHalf.v, noHalf.theta, 9.8);
    expect(termsAt(noHalf, landingTime(noHalf)!).x).toBeCloseTo(f.R / 2, 6);
    const correct30 = flight(20, 30, 9.8);
    const t = landingTime(swap)!;
    expect(termsAt(swap, t).x).toBeCloseTo(correct30.R, 6);
    expect(termsAt(swap, t / 2).y / correct30.H).toBeCloseTo(3, 6);
  });
});
