import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../ui/Icons';
import { Eq } from '../../ui/Math';
import { COURSES, type Course } from './courses';
import { LEVELS, QUESTIONS, TOPICS, type Level, type Question, type Topic } from './questions';
import { Scene } from './Scene';
import { Rich } from './theoryParts';

/**
 * Practice questions in the style of school exams, NEET and JEE, each with
 * its own animation. Answers are checked on the spot, and the worked solution
 * is one click away. Progress is kept on this device.
 */

const KEY = 'learn-things.solved';

function loadSolved(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, boolean>;
  } catch {
    return {};
  }
}

interface Props {
  active: boolean;
  course: Course;
  onCourse: (c: Course) => void;
}

export default function QuestionsView({ active, course, onCourse }: Props) {
  const [levels, setLevels] = useState<Level[]>(course.levels);
  const [topic, setTopic] = useState<Topic | 'all'>('all');
  const [solved, setSolved] = useState(loadSolved);

  // A new course brings its own levels.
  useEffect(() => setLevels(course.levels), [course]);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(solved));
    } catch {
      // Progress is kept for this visit only.
    }
  }, [solved]);

  const shown = useMemo(() => QUESTIONS.filter((q) => levels.includes(q.level) && (topic === 'all' || q.topic === topic)), [levels, topic]);
  const topics = useMemo(() => [...new Set(QUESTIONS.filter((q) => levels.includes(q.level)).map((q) => q.topic))], [levels]);
  const done = shown.filter((q) => solved[q.id]).length;

  const toggle = (l: Level) => setLevels((ls) => (ls.includes(l) ? (ls.length > 1 ? ls.filter((x) => x !== l) : ls) : LEVELS.map((x) => x.id).filter((x) => x === l || ls.includes(x))));

  return (
    <main className="layout" id="view-questions" role="tabpanel" aria-label="Questions" hidden={!active}>
      <aside className="panel" aria-label="Filters">
        <div className="panel-scroll">
          <h1 className="title">Questions</h1>
          <p className="lead">Original questions in the style of school exams, NEET and JEE. Each one is animated. Answer it, then open the worked solution.</p>
          <label className="field">
            <span className="toc-group">Your course</span>
            <select className="select" value={course.id} onChange={(e) => onCourse(COURSES.find((c) => c.id === e.target.value)!)}>
              {[...new Set(COURSES.map((c) => c.region))].map((r) => (
                <optgroup key={r} label={r}>
                  {COURSES.filter((c) => c.region === r).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <div className="toc-block">
            <div className="toc-group">Level</div>
            <div className="chip-row">
              {LEVELS.map((l) => (
                <button key={l.id} className="preset" aria-pressed={levels.includes(l.id)} onClick={() => toggle(l.id)} title={l.note}>
                  {l.name} <span className="chip-count">{QUESTIONS.filter((q) => q.level === l.id).length}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="toc-block">
            <div className="toc-group">Topic</div>
            <ol className="chapters toc toc-topics">
              {(['all', ...topics] as (Topic | 'all')[]).map((t) => (
                <li key={t}>
                  <button className={t === topic ? 'chapter is-current' : 'chapter'} onClick={() => setTopic(t)}>
                    <span className="chapter-name">{t === 'all' ? 'All topics' : TOPICS[t]}</span>
                    <span className="chapter-t">{QUESTIONS.filter((q) => levels.includes(q.level) && (t === 'all' || q.topic === t)).length}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="panel-foot">
          <div className="score">
            <span className="score-n">
              {done} / {shown.length}
            </span>
            <span className="export-sub">answered correctly, saved on this device</span>
            <div className="progress-bar" style={{ ['--p' as string]: shown.length ? done / shown.length : 0 }} />
          </div>
        </div>
      </aside>

      <section className="theory-main" aria-label="Question list">
        <nav className="theory-chips" aria-label="Level">
          {LEVELS.map((l) => (
            <button key={l.id} className="preset" aria-pressed={levels.includes(l.id)} onClick={() => toggle(l.id)}>
              {l.name}
            </button>
          ))}
        </nav>
        <div className="article">
          <header className="article-head q-head">
            <span className="kicker">
              {course.region} · {course.name}
            </span>
            <h1 className="article-title">Practice questions</h1>
            <p className="article-lead">
              {shown.length} questions{topic === 'all' ? '' : ` on ${TOPICS[topic].toLowerCase()}`}. Each states the value of g to use: JEE and NEET questions usually take 10 m/s², school questions 9.8 m/s².
            </p>
          </header>
          <ol className="q-list">
            {shown.map((q, i) => (
              <QuestionCard key={q.id} q={q} n={i + 1} solved={!!solved[q.id]} onSolved={() => setSolved((s) => ({ ...s, [q.id]: true }))} />
            ))}
          </ol>
          {shown.length === 0 && <p className="article-lead">No questions match. Pick another level or topic.</p>}
        </div>
      </section>
    </main>
  );
}

function QuestionCard({ q, n, solved, onSolved }: { q: Question; n: number; solved: boolean; onSolved: () => void }) {
  const [pick, setPick] = useState<number | null>(null);
  const [typed, setTyped] = useState('');
  const [checked, setChecked] = useState<'right' | 'wrong' | null>(null);
  const [open, setOpen] = useState(false);
  const level = LEVELS.find((l) => l.id === q.level)!;

  const check = (value: number | string) => {
    let right: boolean;
    if (q.kind === 'mcq') right = value === q.answer;
    else {
      const x = Number(String(value).replace(',', '.'));
      right = Number.isFinite(x) && Math.abs(x - q.answer) <= q.tol;
    }
    setChecked(right ? 'right' : 'wrong');
    if (right) onSolved();
  };

  return (
    <li className="q-card" id={`q-${q.id}`}>
      <header className="q-card-head">
        <span className="q-tag">
          {String(n).padStart(2, '0')} · {level.name} · {TOPICS[q.topic]}
        </span>
        {solved && (
          <span className="q-done">
            <Icon name="check" size={13} /> Solved
          </span>
        )}
      </header>
      <h3 className="q-title">{q.title}</h3>
      <p className="ex-q">
        <Rich>{q.prompt}</Rich> <span className="q-g">Take g = {q.g} m/s².</span>
      </p>
      <figure className="t-figure q-figure">
        <Scene title={q.title} {...q.scene} />
      </figure>

      {q.kind === 'mcq' ? (
        <div className="q-options" role="group" aria-label="Choose an answer">
          {q.options.map((o, i) => {
            const state = checked && pick === i ? checked : checked === 'wrong' && open && i === q.answer ? 'right' : null;
            return (
              <button
                key={i}
                className={`q-option${state ? ` is-${state}` : ''}`}
                aria-pressed={pick === i}
                onClick={() => {
                  setPick(i);
                  check(i);
                }}
              >
                <span className="q-letter">{'ABCD'[i]}</span>
                <span>
                  <Rich>{o}</Rich>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <form
          className="q-numeric"
          onSubmit={(e) => {
            e.preventDefault();
            check(typed);
          }}
        >
          <label className="q-input">
            <span className="visually-hidden">Your answer in {q.unit}</span>
            <input inputMode="decimal" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Your answer" aria-invalid={checked === 'wrong'} />
            <span className="q-unit">{q.unit}</span>
          </label>
          <button className="btn btn-primary btn-sm" type="submit" disabled={!typed.trim()}>
            Check
          </button>
        </form>
      )}

      {checked && (
        <p className={`q-feedback is-${checked}`} role="status">
          {checked === 'right' ? 'Correct.' : q.kind === 'numeric' ? 'Not quite. Check your working, or open the solution.' : 'Not that one. Try again, or open the solution.'}
        </p>
      )}

      <details className="q-solution" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
        <summary>
          <span>Worked solution</span>
          <span className="q-show" aria-hidden="true" />
        </summary>
        <ol className="steps">
          {q.steps.map((s, i) => (
            <li key={i} className="step">
              {s.say && (
                <p>
                  <Rich>{s.say}</Rich>
                </p>
              )}
              {s.eq && <Eq src={s.eq} />}
            </li>
          ))}
        </ol>
        <p className="answer">
          <span className="answer-label">Answer</span>
          <span>
            <Rich>{q.result}</Rich>
          </span>
        </p>
      </details>
    </li>
  );
}
