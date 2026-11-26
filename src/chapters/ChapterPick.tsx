import { CHAPTERS, hashFor } from './index';

/** The chapter menu in the top bar. */
export function ChapterPick({ current }: { current: string }) {
  const units = [...new Set(CHAPTERS.map((c) => c.unit))];
  return (
    <label className="chapter-pick">
      <span className="visually-hidden">Chapter</span>
      <select
        className="select select-sm"
        value={current}
        onChange={(e) => {
          const h = hashFor(e.target.value);
          window.history.pushState(null, '', h || window.location.pathname + window.location.search);
          window.dispatchEvent(new HashChangeEvent('hashchange'));
          window.scrollTo(0, 0);
        }}
      >
        {units.map((u) => (
          <optgroup key={u} label={u}>
            {CHAPTERS.filter((c) => c.unit === u).map((c) => (
              <option key={c.id} value={c.id} disabled={!c.ready}>
                {c.title}
                {c.ready ? '' : ' (coming next)'}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
