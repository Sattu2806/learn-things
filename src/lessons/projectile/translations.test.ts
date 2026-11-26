import { describe, expect, it } from 'vitest';
import { toSrt } from '../../film/timeline';
import { buildFilm } from './film';
import { LANGS, missing, translator } from './translations';

describe('translated narration', () => {
  const film = buildFilm();
  const lines = [...film.beats.filter((b) => b.say).map((b) => b.say), ...film.beats.filter((b) => b.pause).map((b) => b.pause!.prompt), 'Pause and ponder'];

  it('covers every line and prompt in every language', () => {
    for (const { id } of LANGS) {
      if (id === 'en') continue;
      expect(missing(lines, id), id).toEqual([]);
    }
  });

  it('writes translated subtitles with the same timings', () => {
    const en = toSrt(film).split('\n\n');
    const hi = toSrt(film, translator('hi')).split('\n\n');
    expect(hi).toHaveLength(en.length);
    expect(hi[0].split('\n').slice(0, 2)).toEqual(en[0].split('\n').slice(0, 2));
    expect(hi[0]).toContain('गेंद');
  });
});
