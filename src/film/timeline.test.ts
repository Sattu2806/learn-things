import { describe, expect, it } from 'vitest';
import { Film, ease, pauseBetween, reader, toScript, toSrt } from './timeline';

function film() {
  const f = new Film({ x: 0, y: 5 }, { eq: 'a' });
  f.chapter('One');
  f.beat('four words right here', (k) => {
    k.tween('x', 10, { at: 0, dur: 2, ease: ease.linear });
    k.set('eq', 'b', { at: 1, dur: 1 });
  });
  f.chapter('Two');
  f.beat('a question', (k) => k.tween('x', 0, { dur: 1 }), { pause: { prompt: 'Think', controls: ['v'], hold: 3 } });
  return f;
}

describe('timeline', () => {
  it('tweens numbers and keeps defaults until a property is touched', () => {
    const f = film();
    expect(f.num('x', 0)).toBe(0);
    expect(f.num('x', 1)).toBeCloseTo(5, 9);
    expect(f.num('x', 2)).toBe(10);
    expect(f.num('y', 1)).toBe(5);
    expect(f.num('unknown', 1)).toBe(0);
  });

  it('reports a state change with its progress', () => {
    const f = film();
    expect(f.state('eq', 0.5)).toEqual({ from: 'a', to: 'a', p: 1 });
    expect(f.state('eq', 1.5)).toEqual({ from: 'a', to: 'b', p: 0.5 });
    expect(f.state('eq', 3).p).toBe(1);
  });

  it('times beats by narration and animation, and adds pause holds', () => {
    const f = film();
    const [a, b] = f.beats;
    expect(a.speakEnd).toBeGreaterThan(2);
    expect(b.start).toBe(a.end);
    expect(b.end - b.speakEnd).toBe(3);
    expect(f.duration).toBe(b.end);
    expect(f.chapters.map((c) => c.title)).toEqual(['One', 'Two']);
    expect(f.chapters[1].start).toBe(b.start);
    expect(f.num('ponder', b.speakEnd + 1.5)).toBe(1);
  });

  it('fades captions in and out at the edges of a beat', () => {
    const f = film();
    expect(f.caption(0)).toBeNull();
    expect(f.caption(0.1)?.alpha).toBeCloseTo(0.4, 9);
    expect(f.caption(1)?.text).toBe('four words right here');
    expect(f.caption(f.beats[1].speakEnd + 1)).toBeNull();
  });

  it('lets live values override the film', () => {
    const f = film();
    const r = reader(f, 1, { x: 42 }, { eq: 'z' });
    expect(r.n('x')).toBe(42);
    expect(r.s('eq').to).toBe('z');
  });

  it('writes subtitles and a voiceover script', () => {
    const f = film();
    const srt = toSrt(f);
    expect(srt.startsWith('1\n00:00:00,000 --> 00:00:0')).toBe(true);
    expect(srt).toContain('four words right here');
    const script = toScript(f, 'Title');
    expect(script).toContain('## Two');
    expect(script).toContain('Pause and ponder, 3 s: Think');
  });

  it('stops at a pause even when a frame lands a hair short of it', () => {
    const f = film();
    const p = f.beats.find((b) => b.pause)!;
    expect(pauseBetween(f.beats, p.speakEnd - 0.3, p.speakEnd + 0.01)).toBe(p);
    expect(pauseBetween(f.beats, p.speakEnd - 0.3, p.speakEnd - 0.01)).toBeUndefined();
    // Steady 60 fps frames can put playback 1e-12 before the moment: the next frame must still stop.
    expect(pauseBetween(f.beats, p.speakEnd - 1e-12, p.speakEnd + 1 / 60)).toBe(p);
    // After "continue", playback starts past the moment and goes on.
    expect(pauseBetween(f.beats, p.end, p.end + 0.5)).toBeUndefined();
  });
});
