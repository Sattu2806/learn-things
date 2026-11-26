import { Topbar } from '../Topbar';
import { NotesPage, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { CircleScene } from './CircleScene';

/** Circular motion: the kinematics of going round, with animated diagrams and worked examples. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'Going round', group: 'Theory' },
  { id: 'angle', title: 'Angles in radians', group: 'Theory' },
  { id: 'omega', title: 'Angular velocity', group: 'Theory' },
  { id: 'velocity', title: 'Speed and velocity', group: 'Theory' },
  { id: 'centripetal', title: 'Centripetal acceleration', group: 'Theory' },
  { id: 'why', title: 'Why it points inward', group: 'Theory' },
  { id: 'nonuniform', title: 'Speeding up on a circle', group: 'Theory' },
  { id: 'equations', title: 'Equations of rotation', group: 'Theory' },
  { id: 'vectors', title: 'In vector form', group: 'Theory' },
  { id: 'shadow', title: 'The shadow of a circle', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function CircularChapter() {
  return (
    <div className="app">
      <Topbar chapter="circular" />
      <NotesPage sections={SECTIONS} sideTitle="Circular motion" sideLead="Going round in circles: angles, angular velocity, and why anything moving in a circle is always accelerating toward the centre.">
        <header className="article-head">
          <span className="kicker">Physics · Motion in a plane</span>
          <h1 className="article-title">Why is something going round always accelerating?</h1>
          <p className="article-lead">A car on a roundabout can keep a steady speed and still be accelerating the whole time. This chapter shows why, and builds every formula of circular motion from one picture.</p>
        </header>

        <section className="t-section" id="t-idea">
          <SectionHead n={no('idea')} title="Going round" />
          <p>
            A ball on a string, a car on a roundabout, a point on a spinning fan, the Moon around the Earth: all move in circles. If the speed stays the same it is <strong>uniform circular motion</strong>. Even then, the direction keeps
            changing, and a change of direction is a change of velocity.
          </p>
          <figure className="t-figure">
            <CircleScene title="A ball goes round a circle at a steady speed; its velocity arrow keeps turning" omega={1.6} velocity angle height={300} />
            <figcaption>Steady speed, but the velocity arrow is never the same twice: it always points along the circle.</figcaption>
          </figure>
          <Note label="In this chapter">We describe the motion only: where the ball is, how fast it turns, how it accelerates. Which force makes it go round comes later, in the chapters on forces.</Note>
        </section>

        {/* SECTIONS: angle, omega, velocity, centripetal, why, nonuniform, equations, vectors, shadow, sheet */}

        <section className="t-section" id="t-examples">
          <SectionHead n={no('examples')} title="Worked examples" />
          <Example n={1} title="A car on a roundabout">
            <p className="ex-q">A car goes round a roundabout of radius 20 m at a steady 10 m/s. Find its angular velocity, the time for one lap, and its acceleration.</p>
            <Given items={['r = 20 "m"', 'v = 10 "m/s"']} />
            <ol className="steps">
              <Step title="Angular velocity">
                <Eq src='ω = [ v | r ] = [ 10 | 20 ] = 0.5 "rad/s"' />
              </Step>
              <Step title="One lap">
                <Eq src='T = [ 2 · π | ω ] = [ 2 · π | 0.5 ] = 12.6 "s"' />
              </Step>
              <Step title="Acceleration, toward the centre">
                <Eq src='a = [ v ^2 | r ] = [ 10 ^2 | 20 ] = 5 "m/s²"' />
              </Step>
            </ol>
            <Answer>0.5 rad/s, a lap every 12.6 s, and an acceleration of 5 m/s² toward the centre of the roundabout, even though the speed never changes.</Answer>
            <figure className="t-figure">
              <CircleScene title="The car's velocity and acceleration as it goes round" omega={1.2} velocity accel notes={['r = 20 m', 'v = 10 m/s', 'a = 5 m/s²']} height={300} />
            </figure>
          </Example>
          {/* EXAMPLES 2 to 6 */}
        </section>

        {/* SECTION: mistakes */}

        <footer className="closing">
          <p className="closing-line">Steady speed, changing direction: always accelerating toward the centre.</p>
          <p className="closing-sub">
            Next: <M>{'a = v ^2 / r'}</M> needs a force to cause it. That is where the forces chapters begin.
          </p>
        </footer>
      </NotesPage>
    </div>
  );
}
