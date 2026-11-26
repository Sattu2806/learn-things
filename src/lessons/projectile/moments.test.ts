import { describe, expect, it } from 'vitest';
import { buildFilm } from './film';
import { MOMENTS } from './moments';

describe('film moments linked from the theory page', () => {
  it('each names exactly one line of narration', () => {
    const film = buildFilm();
    for (const prefix of Object.values(MOMENTS)) {
      expect(film.beats.filter((b) => b.say.startsWith(prefix)), prefix).toHaveLength(1);
    }
  });
});
