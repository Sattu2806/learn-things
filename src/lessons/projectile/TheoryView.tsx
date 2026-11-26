import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Film } from '../../film/timeline';
import { Icon } from '../../ui/Icons';
import { useMedia } from '../../ui/useMedia';
import { Eq, M } from '../../ui/Math';
import { Scrub } from '../../ui/Scrub';
import { FallFigure, TrajectorySketch, VectorFigure } from './Figures';
import { inSyllabus, type Course, type Scope } from './courses';
import { AirSection, AngleSection, CurvatureSection, EquationsSection, HeightAngleSection, InclineSection, RelativeSection, SpeedSection, TargetSection, VelocitySection } from './TheoryMore';
import { Answer, Example, FilmLink, Given, Note, SectionHead, Step, Watch } from './theoryParts';
import { num, solve } from './numbers';

/**
 * The theory behind the film, written out for reading: the ideas, every
 * equation, worked examples, common mistakes and practice. Key equations link
 * to the moment in the film that shows them.
 */

const SECTIONS = [
  { id: 'idea', title: 'The big idea', group: 'Theory', scope: 'core' },
  { id: 'split', title: 'Splitting the speed', group: 'Theory', scope: 'core' },
  { id: 'position', title: 'Where the ball is', group: 'Theory', scope: 'core' },
  { id: 'velocity', title: 'Velocity at any moment', group: 'Theory', scope: 'core' },
  { id: 'equations', title: 'From the equations of motion', group: 'Theory', scope: 'core' },
  { id: 'square', title: 'Why t squared', group: 'Theory', scope: 'core' },
  { id: 'parabola', title: 'Why a parabola', group: 'Theory', scope: 'core' },
  { id: 'results', title: 'Time, height and range', group: 'Theory', scope: 'core' },
  { id: 'angle', title: 'Finding the angle', group: 'Theory', scope: 'core' },
  { id: 'height', title: 'Thrown from a height', group: 'Theory', scope: 'core' },
  { id: 'height-angle', title: 'At an angle from a height', group: 'Theory', scope: 'core' },
  { id: 'speed', title: 'Speed at any height', group: 'Theory', scope: 'core' },
  { id: 'target', title: 'Hitting a target', group: 'Theory', scope: 'core' },
  { id: 'incline', title: 'Up and down a slope', group: 'Advanced', scope: 'advanced' },
  { id: 'relative', title: 'Relative motion', group: 'Advanced', scope: 'advanced' },
  { id: 'curvature', title: 'Radius of curvature', group: 'Advanced', scope: 'advanced' },
  { id: 'air', title: 'Air resistance', group: 'Advanced', scope: 'extended' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it', scope: 'core' },
  { id: 'examples', title: 'Worked examples', group: 'Use it', scope: 'core' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it', scope: 'core' },
  { id: 'practice', title: 'Practice', group: 'Use it', scope: 'core' },
  { id: 'try', title: 'Try your own numbers', group: 'Use it', scope: 'core' },
] as const satisfies readonly { id: string; title: string; group: string; scope: Scope }[];

const no = (id: SectionId) => SECTIONS.findIndex((s) => s.id === id) + 1;

type SectionId = (typeof SECTIONS)[number]['id'];

const PRESETS: [string, number][] = [
  ['Earth', 9.8],
  ['Moon', 1.6],
  ['Mars', 3.7],
];

const FILM = solve({ v: 20, theta: 40, g: 9.8 });
const EARTH = solve({ v: 20, theta: 35, g: 9.8 });
const MOON = solve({ v: 20, theta: 35, g: 1.6 });
const CLIFF = solve({ v: 5, theta: 0, g: 9.8, h: 20 });

interface Props {
  film: Film;
  active: boolean;
  course: Course;
  /** Jump to this moment of the film and play. */
  onWatch: (t: number) => void;
}

export default function TheoryView({ film, active, course, onWatch }: Props) {
  const badge = (id: SectionId) => {
    const sec = SECTIONS.find((x) => x.id === id)!;
    if (sec.scope === 'core') return undefined;
    if (!inSyllabus(course, sec.scope)) return `Extra for ${course.name}`;
    return sec.scope === 'advanced' ? 'JEE · university' : 'IB · A-level · AP C';
  };
  const scrollRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState<SectionId>('idea');
  const narrow = useMedia('(max-width: 900px)');

  // Light up the section being read in the contents.
  useEffect(() => {
    if (!active) return;
    const root = narrow ? null : scrollRef.current;
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target.id);
          else seen.delete(e.target.id);
        }
        const first = SECTIONS.find((s) => seen.has(`t-${s.id}`));
        if (first) setCurrent(first.id);
      },
      { root, rootMargin: '-12% 0px -62% 0px' },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(`t-${s.id}`);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [active, narrow]);

  // Keep the lit entry in view: in the contents list, or in the row of chips on a phone.
  const chipsRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!active) return;
    if (!narrow) {
      document.querySelector('#view-theory .toc .chapter.is-current')?.scrollIntoView({ block: 'nearest' });
      return;
    }
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (row && chip) row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' });
  }, [current, active, narrow]);

  const go = (id: SectionId) => {
    setCurrent(id);
    document.getElementById(`t-${id}`)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  const groups = ['Theory', 'Advanced', 'Use it'] as const;

  return (
    <main className="layout" id="view-theory" role="tabpanel" aria-label="Theory" hidden={!active}>
      <aside className="panel" aria-label="Contents">
        <div className="panel-scroll">
          <h1 className="title">Projectile motion</h1>
          <p className="lead">The ideas behind the film, written out: the theory, every equation, and worked examples. Key equations link to the moment in the film that shows them.</p>
          {groups.map((g) => (
            <div key={g} className="toc-block">
              <div className="toc-group">{g}</div>
              <ol className="chapters toc">
                {SECTIONS.filter((s) => s.group === g).map((s) => (
                  <li key={s.id}>
                    <button className={s.id === current ? 'chapter is-current' : 'chapter'} aria-current={s.id === current ? 'true' : undefined} onClick={() => go(s.id)}>
                      <span className="chapter-n">{String(SECTIONS.findIndex((x) => x.id === s.id) + 1).padStart(2, '0')}</span>
                      <span className="chapter-name">{s.title}</span>
                      {s.scope !== 'core' && !inSyllabus(course, s.scope) && <span className="toc-extra">Extra</span>}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <div className="panel-foot">
          <button className="export-toggle print-toggle" onClick={() => window.print()}>
            <span>Print the notes</span>
            <span className="export-sub">or save them as a PDF to study offline</span>
          </button>
        </div>
      </aside>

      <section className="theory-main" ref={scrollRef} aria-label="Notes">
        <nav className="theory-chips" aria-label="Sections" ref={chipsRef}>
          {SECTIONS.map((s) => (
            <button key={s.id} className="preset" aria-pressed={s.id === current} onClick={() => go(s.id)}>
              {s.title}
            </button>
          ))}
        </nav>

        <Watch.Provider value={{ film, onWatch }}>
        <article className="article">
          <header className="article-head">
            <span className="kicker">Physics · Projectile motion</span>
            <h1 className="article-title">Why does a thrown ball draw a parabola?</h1>
            <p className="article-lead">
              A thrown ball is really two simple motions at once: a straight line, and a drop. This page builds every formula from that one idea, then puts them to work.
            </p>
          </header>

          <aside className="course-note" aria-label="Your course">
            <span className="t-note-label">
              {course.region} · {course.name}
            </span>
            <p>
              In your course this is <strong>{course.where}</strong>. Your books write the launch speed as <M>{course.launch === 'u' ? 'u' : 'v _0'}</M>; here it is <M>v</M> (or <M>u</M> in the derivations). {course.name} questions usually take{' '}
              <M>{`g = ${course.g} "m/s²"`}</M>. Sections marked “Extra” go beyond your syllabus: read them for depth, or skip them.
            </p>
          </aside>

          {/* ---------------------------------------------------------- 01 */}
          <section className="t-section" id="t-idea">
            <SectionHead n={no('idea')} title="The big idea" />
            <p>
              A <strong>projectile</strong> is anything flying freely once it leaves your hand: a thrown ball, a kicked football, a jet of water. Nothing pushes it along any more. Only gravity pulls on it, straight down.
            </p>
            <p>That one fact splits the motion into two simpler motions that never get in each other's way:</p>
            <ul className="t-list">
              <li>
                <strong>Sideways</strong>, nothing pushes or pulls, so the ball keeps exactly the same sideways speed the whole way.
              </li>
              <li>
                <strong>Up and down</strong>, gravity pulls, so the ball slows as it rises, stops for an instant at the top, and speeds up as it falls, just like a ball you drop.
              </li>
            </ul>
            <Note label="What we assume">
              No air resistance, flat ground, and a steady pull of gravity, <M>g = 9.8 "m/s²"</M> on Earth. Real balls land a little short, because the air slows them down.
            </Note>
            <FilmLink m="straight">See the straight line in the film</FilmLink>
          </section>

          {/* ---------------------------------------------------------- 02 */}
          <section className="t-section" id="t-split">
            <SectionHead n={no('split')} title="Splitting the speed" />
            <p>
              A ball thrown at speed <M>v</M>, at angle <M>θ</M> above the ground, moves sideways and upward at the same time. The two parts make a right-angled triangle, with <M>v</M> as its longest side:
            </p>
            <figure className="t-figure">
              <VectorFigure />
            </figure>
            <Eq src={['v _x = v · cos θ', 'v _y = v · sin θ']} />
            <p>
              Cos goes with the side next to the angle (sideways), sin with the side opposite it (upward). For the throw in the film, 20 m/s at 40°, that gives <M>{`v _x = ${num(FILM.vx, 1)} "m/s"`}</M> sideways and{' '}
              <M>{`v _y = ${num(FILM.vy, 1)} "m/s"`}</M> upward.
            </p>
            <FilmLink m="upward" />
          </section>

          {/* ---------------------------------------------------------- 03 */}
          <section className="t-section" id="t-position">
            <SectionHead n={no('position')} title="Where the ball is" />
            <p>Sideways the speed never changes, so the distance travelled is just speed times time:</p>
            <Eq src="x = v · cos θ · t" />
            <p>
              Up and down, picture a ghost of the ball with gravity switched off. It would rise along a straight line, <M>v · sin θ · t</M>. The real ball stays directly below its ghost, by exactly as far as anything you drop falls in the same
              time, <M>½ · g · t ^2</M>:
            </p>
            <Eq
              parts={[
                { src: 'y =' },
                { src: 'v · sin θ · t', label: 'straight line' },
                { src: '−' },
                { src: '½ · g · t ^2', label: 'drop' },
              ]}
            />
            <figure className="t-figure">
              <TrajectorySketch throws={[{ v: 20, theta: 35, g: 9.8 }]} ghostAt={1.55} height={300} title="The ball sits below a ghost that flies in a straight line; the gap between them is one half g t squared" />
              <figcaption>The ghost keeps flying straight. The gap between it and the ball is the drop, ½gt².</figcaption>
            </figure>
            <p>The speeds follow the same pattern. The sideways speed stays put, and the upward speed falls by 9.8 m/s every second:</p>
            <Eq src={['v _x = v · cos θ', 'v _y = v · sin θ − g · t']} />
            <FilmLink m="minusDrop" />
          </section>

          <VelocitySection n={no('velocity')} badge={badge('velocity')} />
          <EquationsSection n={no('equations')} badge={badge('equations')} />

          {/* ---------------------------------------------------------- 04 */}
          <section className="t-section" id="t-square">
            <SectionHead n={no('square')} title="Why t squared" />
            <p>
              Why does the drop grow with <M>t ^2</M>, and not with <M>t</M>? Drop a ball and flash a light every second. After one second it has fallen 1 unit, after two seconds 4 units, then 9, then 16.
            </p>
            <figure className="t-figure">
              <FallFigure />
              <figcaption>Each second the ball falls a little further than the last: 1, 3, 5, 7. Odd numbers always add up to a square.</figcaption>
            </figure>
            <p>
              Gravity speeds the ball up steadily, so each second it falls 2 units more than the second before: 1, then 3, then 5, then 7. Add them up and you always get a square, <M>1 + 3 + 5 + 7 = 16 = 4 ^2</M>. So after <M>t</M>{' '}
              seconds the ball has fallen <M>t ^2</M> units. One unit is <M>½ · g</M>, which is 4.9 m on Earth:
            </p>
            <Eq src={'"drop" = ½ · g · t ^2'} />
            <FilmLink m="squares" />
          </section>

          {/* ---------------------------------------------------------- 05 */}
          <section className="t-section" id="t-parabola">
            <SectionHead n={no('parabola')} title="Why a parabola" />
            <p>
              To see the shape of the path, take the time out. From <M>x = v · cos θ · t</M>, the time is <M>t = x / ( v · cos θ )</M>. Put that into the height:
            </p>
            <Eq src="y = x · tan θ − [ g · x ^2 | 2 · v ^2 · cos ^2 θ ]" />
            <p>
              That has the form <M>y = a · x − b · x ^2</M>: a straight line, bent down by an amount that grows with <M>x ^2</M>. Every curve of that form is a parabola. For the throw in the film it is
            </p>
            <Eq src="y = 0.8391 · x − 0.02088 · x ^2" />
            <p>
              and it comes back to the ground, where <M>y = 0</M>, at <M>x = 0.8391 / 0.02088 ≈ 40.2 "m"</M>.
            </p>
            <FilmLink m="whole" />
          </section>

          {/* ---------------------------------------------------------- 06 */}
          <section className="t-section" id="t-results">
            <SectionHead n={no('results')} title="Time, height and range" />
            <h3 className="t-h3">How long it flies</h3>
            <p>The ball lands when the drop has caught up with the rise:</p>
            <Eq src="v · sin θ · t = ½ · g · t ^2" />
            <p>
              Cancel one <M>t</M> from each side. (The other answer, <M>t = 0</M>, is the moment it was thrown.)
            </p>
            <Eq src="T = [ 2 · v · sin θ | g ]">
              <FilmLink m="land" />
            </Eq>

            <h3 className="t-h3">How high it goes</h3>
            <p>
              The top comes halfway through the flight, at <M>t = v · sin θ / g</M>, when the upward speed is zero. Put that time into <M>y</M>:
            </p>
            <Eq src="H = [ v ^2 · sin ^2 θ | 2 · g ]" />

            <h3 className="t-h3">How far it lands</h3>
            <p>
              Sideways speed times the time in the air. The identity <M>2 · sin θ · cos θ = sin 2 θ</M> tidies it up:
            </p>
            <Eq src="R = v · cos θ · T = [ v ^2 · sin 2 θ | g ]">
              <FilmLink m="range" />
            </Eq>

            <h3 className="t-h3">The best angle</h3>
            <p>
              <M>sin 2 θ</M> is never more than 1, and reaches 1 when <M>2 θ = 90°</M>. So <strong>45° throws farthest</strong>, a distance of <M>v ^2 / g</M>. Angles that add up to 90°, such as 30° and 60°, land in exactly the same spot,
              because they give the same <M>sin 2 θ</M>.
            </p>
            <Eq src="R _max = [ v ^2 | g ]">
              <span className="eq-note">
                at <M>θ = 45°</M>
              </span>
              <FilmLink m="best" />
            </Eq>
          </section>

          <AngleSection n={no('angle')} badge={badge('angle')} />

          {/* ---------------------------------------------------------- 07 */}
          <section className="t-section" id="t-height">
            <SectionHead n={no('height')} title="Thrown from a height" />
            <p>
              If the ball starts at height <M>h</M> (a cliff, a table, your hand), its height simply starts at <M>h</M>:
            </p>
            <Eq src="y = h + v · sin θ · t − ½ · g · t ^2" />
            <p>
              Now it falls further than it rose, so <M>T = 2 · v · sin θ / g</M> no longer applies: solve <M>y = 0</M> for <M>t</M> instead, or use the calculator at the end of this page. The easy case is a ball launched sideways, at{' '}
              <M>θ = 0</M>. Then the up-and-down motion is just a drop from height <M>h</M>:
            </p>
            <Eq src={['t = √[ [ 2 · h | g ] ]', 'x = v · t']} />
            <Note label="Try this">
              Fire one ball sideways off a table and drop another at the same moment. They hit the floor together: moving sideways doesn't change how fast a ball falls.
            </Note>
          </section>

          <HeightAngleSection n={no('height-angle')} badge={badge('height-angle')} />
          <SpeedSection n={no('speed')} badge={badge('speed')} />
          <TargetSection n={no('target')} badge={badge('target')} />
          <InclineSection n={no('incline')} badge={badge('incline')} />
          <RelativeSection n={no('relative')} badge={badge('relative')} />
          <CurvatureSection n={no('curvature')} badge={badge('curvature')} />
          <AirSection n={no('air')} badge={badge('air')} />

          {/* ---------------------------------------------------------- 08 */}
          <section className="t-section" id="t-sheet">
            <SectionHead n={no('sheet')} title="Formula sheet" />
            <div className="t-table-wrap">
              <table className="t-table">
                <tbody>
                  {(
                    [
                      ['Sideways speed', 'v _x = v · cos θ'],
                      ['Upward speed', 'v _y = v · sin θ − g · t'],
                      ['Distance along', 'x = v · cos θ · t'],
                      ['Height', 'y = v · sin θ · t − ½ · g · t ^2'],
                      ['Time in the air', 'T = [ 2 · v · sin θ | g ]'],
                      ['Time to the top', 't = [ v · sin θ | g ]'],
                      ['Highest point', 'H = [ v ^2 · sin ^2 θ | 2 · g ]'],
                      ['Range', 'R = [ v ^2 · sin 2 θ | g ]'],
                      ['Longest range, at 45°', 'R _max = [ v ^2 | g ]'],
                      ['Shape of the path', 'y = x · tan θ − [ g · x ^2 | 2 · v ^2 · cos ^2 θ ]'],
                      ['Thrown sideways from a height', 't = √[ [ 2 · h | g ] ]'],
                      ['Speed and direction at any time', 'v = √[ v _x ^2 + v _y ^2 ] ,  tan φ = [ v _y | v _x ]'],
                      ['Speed at height y', 'v ^2 = u ^2 − 2 · g · y'],
                      ['Time of flight from height h', 'T = [ u · sin θ + √[ u ^2 · sin ^2 θ + 2 · g · h ] | g ]'],
                      ['Angle for a given range', 'sin 2 θ = [ R · g | u ^2 ]'],
                      ['Two angles, same range', 'R = 4 · √[ H _1 · H _2 ] ,  T _1 · T _2 = [ 2 · R | g ]'],
                      ['Slowest throw to (x, y)', 'u _min ^2 = g · ( y + √[ x ^2 + y ^2 ] )'],
                      ['Time on a slope α', 'T = [ 2 · u · sin ( θ − α ) | g · cos α ]'],
                      ['Longest throw on a slope', 'R _max = [ u ^2 | g · ( 1 ± sin α ) ]'],
                      ['Radius of curvature', 'r = [ v ^3 | g · v _x ] ,  r _top = [ u ^2 · cos ^2 θ | g ]'],
                    ] as const
                  ).map(([name, src]) => (
                    <tr key={name}>
                      <th scope="row">{name}</th>
                      <td>
                        <M>{src}</M>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="t-h3">The symbols</h3>
            <div className="t-table-wrap">
              <table className="t-table t-symbols">
                <thead>
                  <tr>
                    <th scope="col">Symbol</th>
                    <th scope="col">Meaning</th>
                    <th scope="col">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ['v', 'Launch speed', 'm/s'],
                      ['θ', 'Launch angle, above the ground', 'degrees'],
                      ['g', 'Gravity: 9.8 on Earth, 1.6 on the Moon, 3.7 on Mars', 'm/s²'],
                      ['t', 'Time since the throw', 's'],
                      ['x , y', 'Distance along, and height', 'm'],
                      ['T', 'Time in the air', 's'],
                      ['H', 'Greatest height', 'm'],
                      ['R', 'Range: how far away it lands', 'm'],
                      ['h', 'Height it was thrown from', 'm'],
                    ] as const
                  ).map(([sym, meaning, unit]) => (
                    <tr key={sym}>
                      <td className="t-sym">
                        <M>{sym}</M>
                      </td>
                      <td>{meaning}</td>
                      <td className="t-unit">{unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ---------------------------------------------------------- 09 */}
          <section className="t-section" id="t-examples">
            <SectionHead n={no('examples')} title="Worked examples" />
            <p className="t-tip">
              Tip: keep the full numbers in your calculator between steps, and round only the final answer. Make sure it is set to degrees.
            </p>

            <Example n={1} title="The throw in the film">
              <p className="ex-q">A ball is thrown at 20 m/s, 40° above the ground. How long is it in the air, how high does it go, and how far away does it land?</p>
              <Given items={['v = 20 "m/s"', 'θ = 40°', 'g = 9.8 "m/s²"']} />
              <ol className="steps">
                <Step title="Split the speed">
                  <Eq src={[`v _x = 20 · cos 40° = ${num(FILM.vx, 1)} "m/s"`, `v _y = 20 · sin 40° = ${num(FILM.vy, 1)} "m/s"`]} />
                </Step>
                <Step title="Time in the air">
                  <Eq src={`T = [ 2 · 20 · sin 40° | 9.8 ] = ${num(FILM.T)} "s"`} />
                </Step>
                <Step title="Highest point">
                  <Eq src={`H = [ 20 ^2 · sin ^2 40° | 2 · 9.8 ] = ${num(FILM.H)} "m"`} />
                  <p>It gets there halfway through the flight, after {num(FILM.tTop)} s.</p>
                </Step>
                <Step title="How far away">
                  <Eq src={`R = [ 20 ^2 · sin 80° | 9.8 ] = ${num(FILM.R, 1)} "m"`} />
                  <p>
                    Check: sideways speed times time, <M>{`${num(FILM.vx)} × ${num(FILM.T, 3)} = ${num(FILM.vx * FILM.T, 1)} "m"`}</M>.
                  </p>
                </Step>
              </ol>
              <Answer>
                In the air for {num(FILM.T)} s, {num(FILM.H)} m high at the top, and it lands {num(FILM.R, 1)} m away.
              </Answer>
              <figure className="t-figure">
                <TrajectorySketch throws={[{ v: 20, theta: 40, g: 9.8 }]} marks={{ height: `= ${num(FILM.H)} m`, range: `= ${num(FILM.R, 1)} m`, angle: true }} title="The throw at 20 metres per second and 40 degrees" />
              </figure>
              <FilmLink m="time" />
            </Example>

            <Example n={2} title="Which angle goes farthest?">
              <p className="ex-q">Throw at 20 m/s at 15°, 30°, 45°, 60° and 75°. Which lands farthest? Do any tie?</p>
              <ol className="steps">
                <Step title="One formula for all five">
                  <Eq src="R = [ v ^2 · sin 2 θ | g ] = [ 400 | 9.8 ] · sin 2 θ = 40.8 · sin 2 θ" />
                </Step>
                <Step title="Fill in the table">
                  <div className="t-table-wrap">
                    <table className="t-table t-numbers">
                      <thead>
                        <tr>
                          <th scope="col">
                            <M>θ</M>
                          </th>
                          <th scope="col">
                            <M>2 θ</M>
                          </th>
                          <th scope="col">
                            <M>sin 2 θ</M>
                          </th>
                          <th scope="col">
                            <M>R</M>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[15, 30, 45, 60, 75].map((th) => (
                          <tr key={th} className={th === 45 ? 'is-best' : undefined}>
                            <td>{th}°</td>
                            <td>{2 * th}°</td>
                            <td>{Math.sin(2 * th * (Math.PI / 180)).toFixed(3)}</td>
                            <td>{num(solve({ v: 20, theta: th, g: 9.8 }).R, 1)} m</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Step>
              </ol>
              <Answer>45° goes farthest, 40.8 m. 30° and 60° tie, and so do 15° and 75°: each pair adds up to 90°.</Answer>
              <figure className="t-figure">
                <TrajectorySketch
                  throws={[15, 30, 60, 75].map((th) => ({ v: 20, theta: th, g: 9.8, label: `${th}°`, muted: true })).concat([{ v: 20, theta: 45, g: 9.8, label: '45°', muted: false }])}
                  ball="none"
                  title="Five throws at the same speed: 45 degrees lands farthest, and 30 and 60 degrees land together"
                />
              </figure>
              <FilmLink m="best" />
            </Example>

            <Example n={3} title="The same throw on the Moon">
              <p className="ex-q">Gravity on the Moon is only 1.6 m/s². How do the time, height and range of a 20 m/s throw at 35° compare with Earth?</p>
              <ol className="steps">
                <Step title="Work it out for both">
                  <div className="t-table-wrap">
                    <table className="t-table t-numbers">
                      <thead>
                        <tr>
                          <th scope="col" />
                          <th scope="col">
                            Earth, <M>g = 9.8</M>
                          </th>
                          <th scope="col">
                            Moon, <M>g = 1.6</M>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">Time in the air</th>
                          <td>{num(EARTH.T)} s</td>
                          <td>{num(MOON.T, 1)} s</td>
                        </tr>
                        <tr>
                          <th scope="row">Highest point</th>
                          <td>{num(EARTH.H)} m</td>
                          <td>{num(MOON.H, 1)} m</td>
                        </tr>
                        <tr>
                          <th scope="row">Range</th>
                          <td>{num(EARTH.R, 1)} m</td>
                          <td>{num(MOON.R, 0)} m</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Step>
                <Step title="Spot the pattern">
                  <p>
                    <M>g</M> sits on the bottom of all three formulas, so every answer grows by the same factor:
                  </p>
                  <Eq src="[ 9.8 | 1.6 ] ≈ 6.1" />
                </Step>
              </ol>
              <Answer>Everything is about 6 times bigger on the Moon: six times longer in the air, six times higher, and six times farther.</Answer>
              <figure className="t-figure">
                <TrajectorySketch
                  throws={[
                    { v: 20, theta: 35, g: 1.6, label: 'Moon' },
                    { v: 20, theta: 35, g: 9.8, label: 'Earth', muted: true },
                  ]}
                  ball="none"
                  height={250}
                  title="The same throw on Earth and on the Moon, drawn to the same scale"
                />
                <figcaption>Drawn to the same scale.</figcaption>
              </figure>
            </Example>

            <Example n={4} title="Kicked off a cliff">
              <p className="ex-q">A stone is kicked horizontally at 5 m/s off the top of a cliff 20 m high. When does it land, and how far from the foot of the cliff?</p>
              <Given items={['v = 5 "m/s"', 'θ = 0°', 'h = 20 "m"']} />
              <ol className="steps">
                <Step title="Up and down, it is a drop">
                  <p>It starts with no upward speed, so it falls exactly like a dropped stone:</p>
                  <Eq src={`20 = ½ · 9.8 · t ^2`} />
                  <Eq src={`t = √[ [ 2 · 20 | 9.8 ] ] = ${num(CLIFF.T)} "s"`} />
                </Step>
                <Step title="Sideways, steady speed">
                  <Eq src={`x = 5 · ${num(CLIFF.T)} = ${num(CLIFF.R, 1)} "m"`} />
                </Step>
                <Step title="Bonus: how fast it hits">
                  <Eq src={[`v _y = 9.8 · ${num(CLIFF.T)} = ${num(9.8 * CLIFF.T, 1)} "m/s"`, `√[ 5 ^2 + ${num(9.8 * CLIFF.T, 1)} ^2 ] = ${num(CLIFF.impact, 1)} "m/s"`]} />
                </Step>
              </ol>
              <Answer>
                It lands after {num(CLIFF.T)} s, {num(CLIFF.R, 1)} m from the foot of the cliff, at {num(CLIFF.impact, 1)} m/s.
              </Answer>
              <figure className="t-figure">
                <TrajectorySketch throws={[{ v: 5, theta: 0, g: 9.8, h: 20 }]} marks={{ range: `= ${num(CLIFF.R, 1)} m`, launch: '20 m' }} height={300} title="A stone kicked sideways off a 20 metre cliff" />
              </figure>
            </Example>

            <Example n={5} title="Working backwards: a long jump">
              <p className="ex-q">A long jumper takes off at 20° and lands 7.5 m away. How fast were they going at takeoff? (Treat the jumper as a point that lands at the height it took off from.)</p>
              <ol className="steps">
                <Step title="Rearrange the range formula for v">
                  <Eq src="v ^2 = [ R · g | sin 2 θ ]" />
                </Step>
                <Step title="Put the numbers in">
                  <Eq src={['v ^2 = [ 7.5 · 9.8 | sin 40° ] = 114.3', 'v = √[ 114.3 ] = 10.7 "m/s"']} />
                </Step>
              </ol>
              <Answer>About 10.7 m/s, or 38 km/h, close to sprinting speed.</Answer>
            </Example>
          </section>

          {/* ---------------------------------------------------------- 10 */}
          <section className="t-section" id="t-mistakes">
            <SectionHead n={no('mistakes')} title="Common mistakes" />
            <div className="mistakes">
              <Mistake title="Forgetting the ½" wrong="y = v · sin θ · t − g · t ^2">
                The ball falls twice as far as it should. It lands in half the time, and half as far away.
              </Mistake>
              <Mistake title="t instead of t²" wrong="y = v · sin θ · t − ½ · g · t" film={<FilmLink m="linear">See what goes wrong</FilmLink>}>
                The drop grows by the same amount every second, so nothing bends the path. The ball flies in a straight line and, for most throws, never comes back down.
              </Mistake>
              <Mistake title="Plus instead of minus" wrong="y = v · sin θ · t + ½ · g · t ^2">
                Now gravity pushes up. The path curves away into the sky and never lands.
              </Mistake>
              <Mistake title="Swapping sin and cos" wrong="v _x = v · sin θ">
                Sideways is cos, upward is sin. Swap them and you get the throw at 90° − θ: by luck the same landing spot, but the wrong height and the wrong time.
              </Mistake>
              <Mistake title="Calculator in radians" wrong="sin 40 = 0.745">
                That is 40 radians. In degrees, <M>sin 40° = 0.643</M>. Check that your calculator shows DEG.
              </Mistake>
              <Mistake title="“It stops at the top”" wrong={'v = 0 "at the top"'}>
                Only the upward speed is zero at the top. The ball is still moving sideways at <M>v · cos θ</M>, {num(FILM.vx, 1)} m/s in Example 1.
              </Mistake>
            </div>
          </section>

          {/* ---------------------------------------------------------- 11 */}
          <section className="t-section" id="t-practice">
            <SectionHead n={no('practice')} title="Practice" />
            <p>Try each one, then open the answer to check your working. Questions 1 to 5 are about one kick: a football kicked at 25 m/s, 30° above the ground.</p>
            <ol className="practice">
              <Question n={1} q="How long is it in the air?">
                <Eq src='T = [ 2 · 25 · sin 30° | 9.8 ] = 2.55 "s"' />
              </Question>
              <Question n={2} q="How high does it go?">
                <Eq src='H = [ 25 ^2 · sin ^2 30° | 2 · 9.8 ] = 7.97 "m"' />
              </Question>
              <Question n={3} q="How far away does it land?">
                <Eq src='R = [ 25 ^2 · sin 60° | 9.8 ] = 55.2 "m"' />
              </Question>
              <Question n={4} q="At what other angle would the same kick land in the same place?">
                <p>60°. It adds up to 90° with 30°, so both give the same <M>sin 2 θ = 0.866</M>.</p>
              </Question>
              <Question n={5} q="How far would the same kick go on Mars, where g = 3.7 m/s²?">
                <Eq src='R = [ 25 ^2 · sin 60° | 3.7 ] = 146 "m"' />
                <p>About 2.6 times farther, because 9.8 / 3.7 ≈ 2.6.</p>
              </Question>
              <Question n={6} q="A ball rolls off a 45 m cliff at 8 m/s. When and where does it land?">
                <Eq src={['t = √[ [ 2 · 45 | 9.8 ] ] = 3.03 "s"', 'x = 8 · 3.03 = 24.2 "m"']} />
              </Question>
              <Question n={7} q="How fast is the football from question 1 moving at the very top of its flight?">
                <p>
                  Only its upward speed is zero there. It is still moving sideways at <M>v _x = 25 · cos 30° = 21.7 "m/s"</M>.
                </p>
              </Question>
            </ol>
          </section>

          {/* ---------------------------------------------------------- 12 */}
          <section className="t-section" id="t-try">
            <SectionHead n={no('try')} title="Try your own numbers" />
            <p>Drag the numbers sideways (or use the arrow keys) to change the throw. Use it to check your homework.</p>
            <Calculator g0={course.g} />
          </section>

          <footer className="closing">
            <p className="closing-line">A straight line, minus a drop that grows like t².</p>
            <p className="closing-sub">That is the whole idea. Watch it come together in the film.</p>
            <button className="btn btn-primary" onClick={() => onWatch(0)}>
              <Icon name="play" size={14} /> Watch the film
            </button>
          </footer>
        </article>
        </Watch.Provider>
      </section>
    </main>
  );
}

function Mistake({ title, wrong, film, children }: { title: string; wrong: string; film?: ReactNode; children: ReactNode }) {
  return (
    <div className="mistake">
      <h3>{title}</h3>
      <div className="mistake-wrong">
        <span className="mistake-tag">Not</span>
        <M>{wrong}</M>
      </div>
      <p>{children}</p>
      {film}
    </div>
  );
}

function Question({ n, q, children }: { n: number; q: string; children: ReactNode }) {
  return (
    <li className="question">
      <details>
        <summary>
          <span className="q-n">{n}</span>
          <span className="q-text">{q}</span>
          <span className="q-show" aria-hidden="true" />
        </summary>
        <div className="q-answer">{children}</div>
      </details>
    </li>
  );
}

function Calculator({ g0 }: { g0: number }) {
  const [v, setV] = useState(20);
  const [theta, setTheta] = useState(40);
  const [g, setG] = useState(g0);
  const [h, setH] = useState(0);
  const s = solve({ v, theta, g, h });
  const flies = s.T > 0;
  const stats: [string, ReactNode, string][] = [
    ['Time in the air', <M>T</M>, flies ? `${num(s.T)} s` : '0 s'],
    ['Highest point', <M>H</M>, `${num(s.H)} m`],
    ['Lands', <M>R</M>, `${num(s.R, 1)} m away`],
    ['Sideways speed', <M>v _x</M>, `${num(s.vx, 1)} m/s`],
    ['Upward speed at launch', <M>v _y</M>, `${num(s.vy, 1)} m/s`],
    ['Speed when it lands', <M>v</M>, `${num(s.impact, 1)} m/s`],
  ];
  return (
    <div className="calc">
      <div className="calc-controls">
        <Scrub symbol={<i className="m-var">v</i>} name="Launch speed" value={v} min={1} max={50} step={0.5} digits={1} unit="m/s" unitName="metres per second" onChange={setV} />
        <Scrub symbol={<i className="m-var">θ</i>} name="Launch angle" value={theta} min={0} max={90} step={1} unit="°" unitName="degrees" onChange={setTheta} />
        <Scrub symbol={<i className="m-var">h</i>} name="Launch height" value={h} min={0} max={100} step={1} unit="m" unitName="metres" onChange={setH} />
        <span className="g-group">
          <Scrub symbol={<i className="m-var">g</i>} name="Gravity" value={g} min={0.5} max={25} step={0.1} digits={1} unit="m/s²" unitName="metres per second squared" onChange={setG} />
          {PRESETS.map(([name, val]) => (
            <button key={name} className="preset" aria-pressed={Math.abs(g - val) < 1e-6} onClick={() => setG(val)}>
              {name}
            </button>
          ))}
        </span>
      </div>
      <figure className="t-figure calc-figure">
        <TrajectorySketch
          key={`${v}|${theta}|${g}|${h}`}
          throws={[{ v, theta, g, h }]}
          marks={{ height: `= ${num(s.H)} m`, range: flies ? `= ${num(s.R, 1)} m` : undefined, angle: true, launch: h > 0 ? `${h} m` : undefined }}
          ball="animate"
          height={300}
          title={`A throw at ${v} metres per second and ${theta} degrees`}
        />
      </figure>
      <dl className="calc-out" aria-live="polite">
        {stats.map(([name, sym, value]) => (
          <div key={name} className="calc-stat">
            <dt>{name}</dt>
            <dd>
              <span className="calc-sym">{sym}</span>
              <span className="calc-val">{value}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
