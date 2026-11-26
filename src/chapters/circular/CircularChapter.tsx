import type { ReactNode } from 'react';
import { Topbar } from '../Topbar';
import { NotesPage, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { CircleScene, type CircleSpec } from './CircleScene';

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

function Mistake({ title, wrong, scene, children }: { title: string; wrong: string; scene?: CircleSpec; children: ReactNode }) {
  return (
    <div className="mistake">
      <h3>{title}</h3>
      <div className="mistake-wrong">
        <span className="mistake-tag">Not</span>
        <M>{wrong}</M>
      </div>
      {scene && (
        <div className="mistake-fig">
          <CircleScene {...scene} height={170} />
        </div>
      )}
      <p>{children}</p>
    </div>
  );
}

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

        <section className="t-section" id="t-angle">
          <SectionHead n={no('angle')} title="Angles in radians" />
          <p>
            To describe going round we need a way to say how far round we have gone. Degrees work, but physics prefers a measure that comes straight from the circle. Take a ball that has travelled a distance <M>s</M> along the edge of a circle of radius{' '}
            <M>r</M>. The angle it has turned through is
          </p>
          <Eq src='θ = [ s | r ]' />
          <p>
            One <strong>radian</strong> is the angle for which the arc is exactly as long as the radius, <M>s = r</M>. An angle in radians is a ratio of two lengths, so it has no real unit; we write "rad" only as a reminder.
          </p>
          <figure className="t-figure">
            <CircleScene title="A ball sweeps an arc of length s along a circle of radius r, turning through an angle theta" omega={0.8} angle arc start={0} height={300} notes={['arc s, angle θ', 's = r · θ']} />
            <figcaption>The longer the arc <M>s</M> traced out, the larger the angle <M>θ</M>. Their ratio is always the same for a given radius.</figcaption>
          </figure>
          <p>A full turn has an arc equal to the whole circumference, <M>s = 2 · π · r</M>, so</p>
          <Eq src={['2 · π "rad" = 360°', '1 "rad" = [ 360° | 2 · π ] ≈ 57.3°']} />
          <p>Turning the definition around gives the arc length, which is the most useful form:</p>
          <Eq src='s = r · θ' />
          <Note label="Remember">The formula <M>s = r · θ</M> is only true when <M>θ</M> is in radians. In degrees it needs an extra factor of <M>[ π | 180 ]</M>.</Note>
        </section>

        <section className="t-section" id="t-omega">
          <SectionHead n={no('omega')} title="Angular velocity" />
          <p>
            Angular velocity <M>ω</M> says how fast the angle grows: the angle turned divided by the time taken. For a steady turn this is
          </p>
          <Eq src='ω = [ Δθ | Δt ]' />
          <p>
            and in general it is the rate of change of the angle, <M>ω = [ dθ | dt ]</M>. Its unit is radians per second, written rad/s (or simply s⁻¹).
          </p>
          <figure className="t-figure">
            <CircleScene title="A ball turning at 1.5 radians per second" omega={1.5} angle height={300} notes={['ω = 1.5 rad/s']} />
            <figcaption>At <M>ω = 1.5 "rad/s"</M> the radius line sweeps through about 86° every second.</figcaption>
          </figure>
          <p>
            One full turn is <M>Δθ = 2 · π</M> and takes one <strong>period</strong> <M>T</M>. The number of turns per second is the <strong>frequency</strong> <M>f</M>. These are tied together:
          </p>
          <Eq src={['T = [ 2 · π | ω ]', 'f = [ 1 | T ]', 'ω = 2 · π · f']} />
          <p>
            The period is in seconds, the frequency in hertz (Hz, turns per second). Engines and fans are usually quoted in revolutions per minute (rpm), so convert first: one rpm is <M>[ 2 · π | 60 ]</M> rad/s.
          </p>
          <Eq src='ω = [ 2 · π · N | 60 ] "rad/s"'>
            <span className="eq-note">for N revolutions per minute</span>
            <span>For example 300 rpm is 5 turns per second, so <M>ω = 10 · π ≈ 31.4 "rad/s"</M>.</span>
          </Eq>
        </section>

        <section className="t-section" id="t-velocity">
          <SectionHead n={no('velocity')} title="Speed and velocity" />
          <p>
            In a time <M>Δt</M> the ball turns through <M>Δθ = ω · Δt</M> and so travels an arc <M>s = r · Δθ</M>. Dividing by <M>Δt</M> gives the speed along the circle:
          </p>
          <Eq src='v = ω · r' />
          <p>
            Every point of a spinning body, such as a wheel or a record, turns through the same angle in the same time, so they all share one <M>ω</M>. But a point farther from the axis has a bigger circle to cover in that same time, so its speed <M>v = ω · r</M> is greater.
          </p>
          <figure className="t-figure">
            <CircleScene title="The velocity arrow always points along the tangent, at right angles to the radius" omega={1} velocity angle start={30} height={300} notes={['v ⊥ r']} />
            <figcaption>The velocity is always along the tangent: at right angles to the radius line, and pointing the way the ball is going.</figcaption>
          </figure>
          <p>
            The speed is constant in uniform circular motion, but the <em>velocity</em> is a vector and its direction changes all the time. That is why the next section finds an acceleration even though the speed never changes.
          </p>
        </section>

        <section className="t-section" id="t-centripetal">
          <SectionHead n={no('centripetal')} title="Centripetal acceleration" />
          <p>
            Something that changes its velocity is accelerating. For uniform circular motion the acceleration has size
          </p>
          <Eq src='a = [ v ^2 | r ] = ω ^2 · r = v · ω' />
          <p>
            These three forms are the same thing, linked by <M>v = ω · r</M>. Use whichever matches the numbers you are given: <M>v ^2 / r</M> when you know the speed, <M>ω ^2 · r</M> when you know the angular velocity.
          </p>
          <p>
            Its direction is always <strong>toward the centre</strong> of the circle, which is why it is called <strong>centripetal</strong> ("centre-seeking"). It is at right angles to the velocity, so it changes the direction of the motion and not the speed.
          </p>
          <figure className="t-figure">
            <CircleScene title="Velocity along the tangent and acceleration pointing to the centre as the ball goes round" omega={1.4} velocity accel angle height={300} />
            <figcaption>The acceleration arrow keeps the same length but rotates with the ball, always pointing at the centre.</figcaption>
          </figure>
          <p>
            So in uniform motion the <em>magnitude</em> of the acceleration is constant, but its <em>direction</em> is not. The acceleration is therefore not a constant vector, and the straight-line equations (<M>v = u + a · t</M> and friends) do not apply to this motion.
          </p>
        </section>

        <section className="t-section" id="t-why">
          <SectionHead n={no('why')} title="Why it points inward" />
          <p>
            Acceleration is the change in velocity per unit time, so we need <M>Δv = v _2 − v _1</M> for two moments a short time apart. Draw the two velocity arrows from the same point. They have the same length, since the speed is the same, but they point in different directions.
          </p>
          <figure className="t-figure">
            <CircleScene title="Two velocities a short time apart, drawn tail to tail, and the change in velocity between them" omega={1} deltaV={{ from: 0.6, to: 1.4 }} height={320} />
            <figcaption>The change <M>Δv</M> joins the tip of <M>v _1</M> to the tip of <M>v _2</M>. It points toward the inside of the turn.</figcaption>
          </figure>
          <p>
            The two arrows form a thin isosceles triangle. Its third side, <M>Δv</M>, points toward the centre of the circle (in the limit of a tiny <M>Δt</M> it is exactly at right angles to the velocity). The angle between the arrows is the angle <M>Δθ</M> the ball turned through, so for small <M>Δθ</M> the length of the third side is
          </p>
          <Eq src={['Δv ≈ v · Δθ', 'a = [ Δv | Δt ] = v · [ Δθ | Δt ] = v · ω = [ v ^2 | r ]']} />
          <p>That one picture gives both the direction and the size of the centripetal acceleration.</p>
          <p>
            There is a neater way to see it. Draw the velocity arrow from a fixed point as the ball goes round. Its tip traces a circle of radius <M>v</M>, going round at the same angular velocity <M>ω</M>. The tip's own speed is <M>ω · v</M>, and that is the acceleration.
          </p>
          <figure className="t-figure">
            <CircleScene title="The velocity arrow's tip goes round its own circle, at the same angular velocity" omega={1} velocity accel hodograph height={320} />
            <figcaption>Right: the velocity arrows drawn from one point. The tip moves round a circle of radius <M>v</M> at speed <M>ω · v</M>, which is the acceleration.</figcaption>
          </figure>
        </section>

        <section className="t-section" id="t-nonuniform">
          <SectionHead n={no('nonuniform')} title="Speeding up on a circle" />
          <p>
            If the ball also speeds up or slows down, <M>ω</M> itself changes. The rate of change of angular velocity is the <strong>angular acceleration</strong>
          </p>
          <Eq src='α = [ Δω | Δt ]' />
          <p>
            in rad/s². Now the acceleration has two parts at right angles to each other:
          </p>
          <ul className="t-list">
            <li>
              <strong>Tangential</strong>, along the velocity, changes the speed: <M>a _t = α · r</M>.
            </li>
            <li>
              <strong>Centripetal</strong>, toward the centre, changes the direction: <M>a _c = ω ^2 · r</M>. It grows as the ball speeds up.
            </li>
          </ul>
          <p>Being at right angles, they combine with Pythagoras:</p>
          <Eq src={['a = √[ a _t ^2 + a _c ^2 ]', 'tan φ = [ a _t | a _c ]']}>
            <span>where <M>φ</M> is the angle the total acceleration makes with the radius (pointing inward).</span>
          </Eq>
          <figure className="t-figure">
            <CircleScene title="A ball speeding up on a circle, with its tangential, centripetal and total acceleration" omega={1} alpha={0.3} loop={4} velocity accel parts height={320} />
            <figcaption>Dashed: the two parts. Solid: the total, tilted forward of the centre while the ball speeds up.</figcaption>
          </figure>
          <Note label="Check">If the speed is steady, <M>α = 0</M>, <M>a _t = 0</M>, and only the centripetal part is left. That is the uniform case from before.</Note>
        </section>

        <section className="t-section" id="t-equations">
          <SectionHead n={no('equations')} title="Equations of rotation" />
          <p>
            When <M>α</M> is constant, turning behaves exactly like moving in a straight line, with the angle in place of the distance. Every straight-line equation has a twin:
          </p>
          <div className="t-table-wrap">
            <table className="t-table">
              <thead>
                <tr>
                  <th scope="col">Straight line</th>
                  <th scope="col">Rotation</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['s', 'θ'],
                    ['u', 'ω _0'],
                    ['v', 'ω'],
                    ['a', 'α'],
                    ['v = u + a · t', 'ω = ω _0 + α · t'],
                    ['s = u · t + ½ · a · t ^2', 'θ = ω _0 · t + ½ · α · t ^2'],
                    ['v ^2 = u ^2 + 2 · a · s', 'ω ^2 = ω _0 ^2 + 2 · α · θ'],
                  ] as const
                ).map(([a, b]) => (
                  <tr key={a}>
                    <td>
                      <M>{a}</M>
                    </td>
                    <td>
                      <M>{b}</M>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Here <M>ω _0</M> is the starting angular velocity and <M>θ</M> the angle turned (in radians). To count turns, divide by <M>2 · π</M>.
          </p>
          <figure className="t-figure">
            <CircleScene title="A ball starting slowly and turning faster and faster" omega={0.5} alpha={0.5} loop={4} angle arc notes={['ω = ω₀ + α · t']} height={300} />
            <figcaption>The arc swept grows faster and faster, just as the distance does for a car that accelerates.</figcaption>
          </figure>
        </section>

        <section className="t-section" id="t-vectors">
          <SectionHead n={no('vectors')} title="In vector form" />
          <p>
            Put the centre at the origin. A ball on a circle of radius <M>r</M> turning at a steady <M>ω</M>, starting on the x-axis, is at angle <M>ω · t</M>, so its position vector is
          </p>
          <Eq src='r = r · cos ω · t · î + r · sin ω · t · ĵ' />
          <p>Velocity is the rate of change of position. Differentiating each part with respect to time:</p>
          <Eq src='v = − r · ω · sin ω · t · î + r · ω · cos ω · t · ĵ' />
          <p>
            Its size is <M>r · ω · √[ sin ^2 ω · t + cos ^2 ω · t ] = ω · r</M>, as before. Check the direction: <M>v · r = 0</M>, so the velocity is at right angles to the position. Differentiate once more:
          </p>
          <Eq src='a = − r · ω ^2 · cos ω · t · î − r · ω ^2 · sin ω · t · ĵ = − ω ^2 · r' />
          <p>
            The acceleration is <M>−ω ^2</M> times the position vector: it has size <M>ω ^2 · r</M> and points exactly opposite to <M>r</M>, that is, from the ball to the centre.
          </p>
          <figure className="t-figure">
            <CircleScene title="Position, velocity and acceleration of a ball going round: the acceleration points opposite to the position" omega={1.2} velocity accel angle start={20} height={300} />
            <figcaption>The radius line points out; the acceleration arrow points the opposite way, back to the centre.</figcaption>
          </figure>
        </section>

        <section className="t-section" id="t-shadow">
          <SectionHead n={no('shadow')} title="The shadow of a circle" />
          <p>
            Shine a light from the side on a ball going round, and its shadow on a vertical screen moves up and down. The height of the ball is the y-part of the position vector:
          </p>
          <Eq src='y = r · sin ω · t' />
          <figure className="t-figure">
            <CircleScene title="The height of a ball going round, drawn against time, makes a wave" omega={1.2} angle wave height={300} />
            <figcaption>The shadow slows at the top and bottom and is quickest in the middle. Plotted against time it is a sine wave.</figcaption>
          </figure>
          <p>
            Its acceleration is the y-part of <M>−ω ^2 · r</M>, which is <M>−ω ^2 · y</M>: always toward the middle, and bigger the farther from it. Motion like that is called <strong>simple harmonic motion</strong>, and it describes springs, pendulums and sound. Circular motion is the key to understanding it.
          </p>
        </section>

        <section className="t-section" id="t-sheet">
          <SectionHead n={no('sheet')} title="Formula sheet" />
          <div className="t-table-wrap">
            <table className="t-table">
              <tbody>
                {(
                  [
                    ['Angle from arc', 'θ = [ s | r ]'],
                    ['Arc length', 's = r · θ'],
                    ['Full turn', '2 · π "rad" = 360°'],
                    ['Angular velocity', 'ω = [ Δθ | Δt ] ,  ω = [ dθ | dt ]'],
                    ['Period and frequency', 'T = [ 2 · π | ω ] ,  f = [ 1 | T ]'],
                    ['Angular velocity and frequency', 'ω = 2 · π · f'],
                    ['From rpm', 'ω = [ 2 · π · N | 60 ]'],
                    ['Speed', 'v = ω · r'],
                    ['Centripetal acceleration', 'a _c = [ v ^2 | r ] = ω ^2 · r = v · ω'],
                    ['Angular acceleration', 'α = [ Δω | Δt ]'],
                    ['Tangential acceleration', 'a _t = α · r'],
                    ['Total acceleration', 'a = √[ a _t ^2 + a _c ^2 ]'],
                    ['Angle with the radius', 'tan φ = [ a _t | a _c ]'],
                    ['Final angular velocity', 'ω = ω _0 + α · t'],
                    ['Angle turned', 'θ = ω _0 · t + ½ · α · t ^2'],
                    ['No time', 'ω ^2 = ω _0 ^2 + 2 · α · θ'],
                    ['Position and acceleration', 'a = − ω ^2 · r'],
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
                    ['r', 'Radius of the circle', 'm'],
                    ['s', 'Arc length along the circle', 'm'],
                    ['θ', 'Angle turned', 'rad'],
                    ['ω', 'Angular velocity', 'rad/s'],
                    ['α', 'Angular acceleration', 'rad/s²'],
                    ['T', 'Period: time for one turn', 's'],
                    ['f', 'Frequency: turns per second', 'Hz'],
                    ['v', 'Speed along the circle', 'm/s'],
                    ['a _c', 'Centripetal acceleration, toward the centre', 'm/s²'],
                    ['a _t', 'Tangential acceleration, along the motion', 'm/s²'],
                  ] as const
                ).map(([sym, meaning, unit]) => (
                  <tr key={sym}>
                    <th scope="row">
                      <M>{sym}</M>
                    </th>
                    <td>{meaning}</td>
                    <td>{unit.startsWith('rad') || unit.startsWith('m') || unit === 's' || unit === 'Hz' ? <M>{`"${unit}"`}</M> : unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

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
          <Example n={2} title="A ceiling fan">
            <p className="ex-q">A ceiling fan turns at 120 rpm. A point on the tip of a blade is 0.6 m from the axis. Find its angular velocity, its speed, and its centripetal acceleration.</p>
            <Given items={['N = 120 "rpm"', 'r = 0.6 "m"']} />
            <ol className="steps">
              <Step title="Convert to rad/s">
                <Eq src='ω = [ 2 · π · 120 | 60 ] = 4 · π = 12.6 "rad/s"' />
              </Step>
              <Step title="Speed of the tip">
                <Eq src='v = ω · r = 12.6 · 0.6 = 7.54 "m/s"' />
              </Step>
              <Step title="Centripetal acceleration">
                <Eq src='a = ω ^2 · r = 12.6 ^2 · 0.6 = 94.8 "m/s²"' />
              </Step>
            </ol>
            <Answer>12.6 rad/s, 7.54 m/s, and 94.8 m/s² toward the axis. That is almost ten times g, from a fan that looks quite gentle.</Answer>
            <figure className="t-figure">
              <CircleScene title="The tip of a fan blade going round twice per second" omega={2.4} velocity accel notes={['r = 0.6 m', 'ω = 12.6 rad/s']} height={300} />
            </figure>
          </Example>

          <Example n={3} title="A point on the equator">
            <p className="ex-q">The Earth turns once in 24 hours. Find the centripetal acceleration of a point on the equator (radius 6.4 × 10⁶ m). Why do we not feel it?</p>
            <Given items={['R = 6.4 × 10 ^6 "m"', 'T = 24 "h" = 86 400 "s"']} />
            <ol className="steps">
              <Step title="Angular velocity">
                <Eq src='ω = [ 2 · π | T ] = [ 2 · π | 86 400 ] = 7.27 × 10 ^−5 "rad/s"' />
              </Step>
              <Step title="Centripetal acceleration">
                <Eq src='a = ω ^2 · R = ( 7.27 × 10 ^−5 ) ^2 · 6.4 × 10 ^6 = 0.0338 "m/s²"' />
              </Step>
              <Step title="Compare with gravity">
                <Eq src='[ a | g ] = [ 0.0338 | 9.8 ] = 0.35 %' />
              </Step>
            </ol>
            <Answer>
              About 0.034 m/s² toward the Earth's axis. It is only 0.35% of <M>g</M> (the speed is a large 465 m/s, but the circle is huge), too small to notice.
            </Answer>
            <figure className="t-figure">
              <CircleScene title="A point on the equator turning with the Earth; the real motion is far slower than this animation" omega={0.8} velocity accel angle notes={['ω = 7.27 × 10⁻⁵ rad/s', 'a = 0.034 m/s²']} height={300} />
              <figcaption>The animation is sped up enormously: the real Earth takes a full day for this turn.</figcaption>
            </figure>
          </Example>

          <Example n={4} title="The Moon going round the Earth">
            <p className="ex-q">The Moon goes round the Earth once in 27.3 days, on a circle of radius 3.84 × 10⁸ m. Find its centripetal acceleration and compare it with <M>g</M> scaled by the distance.</p>
            <Given items={['r = 3.84 × 10 ^8 "m"', 'T = 27.3 "days" = 2.36 × 10 ^6 "s"']} />
            <ol className="steps">
              <Step title="Angular velocity">
                <Eq src='ω = [ 2 · π | T ] = [ 2 · π | 2.36 × 10 ^6 ] = 2.66 × 10 ^−6 "rad/s"' />
              </Step>
              <Step title="Centripetal acceleration">
                <Eq src='a = ω ^2 · r = ( 2.66 × 10 ^−6 ) ^2 · 3.84 × 10 ^8 = 2.72 × 10 ^−3 "m/s²"' />
              </Step>
              <Step title="Compare with g">
                <p>The Moon is about 60 times as far from the Earth's centre as we are (<M>R = 6.4 × 10 ^6 "m"</M>), so</p>
                <Eq src='g · ( [ R | r ] ) ^2 = 9.8 · ( [ 6.4 × 10 ^6 | 3.84 × 10 ^8 ] ) ^2 = 2.72 × 10 ^−3 "m/s²"' />
              </Step>
            </ol>
            <Answer>
              <M>2.72 × 10 ^−3 "m/s²"</M> toward the Earth, which matches <M>g · ( R / r ) ^2</M> almost exactly. This is a hint that the pull holding the Moon in orbit is the same gravity that pulls an apple down, weakening as one over distance squared.
            </Answer>
            <figure className="t-figure">
              <CircleScene title="The Moon going round the Earth, with its acceleration always toward the Earth" omega={0.9} velocity accel notes={['r = 3.84 × 10⁸ m', 'a = 2.72 × 10⁻³ m/s²']} height={300} />
            </figure>
          </Example>

          <Example n={5} title="A wheel speeding up">
            <p className="ex-q">A wheel starts from rest and speeds up with a steady angular acceleration of 2 rad/s² for 5 s. Find the final angular velocity and the number of turns made. Then, at <M>t = 5 "s"</M>, find the tangential, centripetal and total acceleration of a point 0.3 m from the axle.</p>
            <Given items={['ω _0 = 0', 'α = 2 "rad/s²"', 't = 5 "s"', 'r = 0.3 "m"']} />
            <ol className="steps">
              <Step title="Final angular velocity">
                <Eq src='ω = ω _0 + α · t = 0 + 2 · 5 = 10 "rad/s"' />
              </Step>
              <Step title="Angle turned and number of turns">
                <Eq src={['θ = ω _0 · t + ½ · α · t ^2 = ½ · 2 · 5 ^2 = 25 "rad"', 'turns = [ θ | 2 · π ] = [ 25 | 2 · π ] = 3.98']} />
              </Step>
              <Step title="Tangential acceleration">
                <Eq src='a _t = α · r = 2 · 0.3 = 0.6 "m/s²"' />
              </Step>
              <Step title="Centripetal acceleration at t = 5 s">
                <Eq src='a _c = ω ^2 · r = 10 ^2 · 0.3 = 30 "m/s²"' />
              </Step>
              <Step title="Total acceleration">
                <Eq src={['a = √[ 0.6 ^2 + 30 ^2 ] = 30.0 "m/s²"', 'tan φ = [ 0.6 | 30 ] = 0.02, φ = 1.15°']} />
              </Step>
            </ol>
            <Answer>
              10 rad/s and almost 4 turns (3.98). At 5 s the point has <M>a _t = 0.6 "m/s²"</M>, <M>a _c = 30 "m/s²"</M> and a total of 30.0 m/s², tilted only 1.15° from the radius: by then the turning is almost all centripetal.
            </Answer>
            <figure className="t-figure">
              <CircleScene title="A wheel speeding up from rest, showing the tangential, centripetal and total acceleration of a point on it" omega={0.2} alpha={0.6} loop={4} velocity accel parts notes={['α = 2 rad/s² (scaled for display)']} height={320} />
            </figure>
          </Example>

          <Example n={6} title="The hands of a clock">
            <p className="ex-q">Find the angular velocity of the minute hand and of the hour hand. After 12:00, when do the two hands first lie on top of each other again?</p>
            <Given items={['T _min = 3600 "s"', 'T _hour = 12 "h" = 43 200 "s"']} />
            <ol className="steps">
              <Step title="Angular velocities">
                <Eq src={['ω _min = [ 2 · π | 3600 ] = 1.75 × 10 ^−3 "rad/s"', 'ω _hour = [ 2 · π | 43 200 ] = 1.45 × 10 ^−4 "rad/s"']} />
              </Step>
              <Step title="Think of the minute hand catching up">
                <p>The hands are together again when the minute hand has gained one full turn on the hour hand:</p>
                <Eq src='( ω _min − ω _hour ) · t = 2 · π' />
              </Step>
              <Step title="Solve for t">
                <Eq src='t = [ 2 · π | ω _min − ω _hour ] = [ 1 | [ 1 | 1 ] − [ 1 | 12 ] ] "h" = [ 12 | 11 ] "h" = 1.09 "h"' />
                <p>That is 65.5 minutes, or about 1 h 5 min 27 s.</p>
              </Step>
            </ol>
            <Answer>
              <M>ω _min = 1.75 × 10 ^−3 "rad/s"</M>, <M>ω _hour = 1.45 × 10 ^−4 "rad/s"</M> (the minute hand is 12 times faster). The hands first meet again at <M>[ 12 | 11 ] "h" ≈ 65.5 "min"</M> after 12:00, which is about 1:05:27.
            </Answer>
            <figure className="t-figure">
              <CircleScene title="A hand turning round a clock face" omega={1.047} angle start={90} notes={['minute hand, sped up']} height={300} />
            </figure>
          </Example>
        </section>

        <section className="t-section" id="t-mistakes">
          <SectionHead n={no('mistakes')} title="Common mistakes" />
          <div className="mistakes">
            <Mistake title="Degrees in the formulas" wrong="s = r · θ ,  θ = 90" scene={{ title: 'The arc length is r times the angle in radians', omega: 1.2, angle: true, arc: true }}>
              The formulas <M>s = r · θ</M> and <M>v = ω · r</M> need radians. Convert first: <M>90° = [ π | 2 ]</M> rad. Check that you have not put in a degree value.
            </Mistake>
            <Mistake title="“No acceleration, the speed is constant”" wrong="a = 0 ,  v = 10 constant" scene={{ title: 'Constant speed, but the velocity turns, so there is an acceleration toward the centre', omega: 1.4, velocity: true, accel: true }}>
              Acceleration is a change in the velocity vector, and direction counts. Steady speed on a circle still means an acceleration <M>v ^2 / r</M> toward the centre.
            </Mistake>
            <Mistake title="Acceleration pointing outward" wrong={'a = [ v ^2 | r ] "outward"'} scene={{ title: 'The acceleration always points inward, toward the centre', omega: 1.4, accel: true, angle: true }}>
              The acceleration points toward the centre. The outward push you feel in a turning car is your body wanting to go straight on, not a real acceleration outward.
            </Mistake>
            <Mistake title="Using rpm in v = ω · r" wrong={'v = 120 · 0.6 = 72 "m/s"'} scene={{ title: 'A fan blade tip at 120 rpm moves at 7.5 metres per second, not 72', omega: 2.5, velocity: true, notes: ['120 rpm = 12.6 rad/s', 'v = 7.54 m/s'] }}>
              <M>ω</M> must be in rad/s. For 120 rpm that is <M>4 · π ≈ 12.6</M> rad/s, giving <M>v = 7.54 "m/s"</M> for a radius of 0.6 m, not 72.
            </Mistake>
            <Mistake title="Forgetting the tangential part" wrong={'a = [ v ^2 | r ] "while speeding up"'} scene={{ title: 'Speeding up adds a tangential part, so the total acceleration leans forward', omega: 1, alpha: 0.3, loop: 4, accel: true, parts: true }}>
              If the speed changes, there is also <M>a _t = α · r</M> along the motion. The total is <M>√[ a _t ^2 + a _c ^2 ]</M>, and the acceleration no longer points at the centre.
            </Mistake>
            <Mistake title="Same speed for every point" wrong="v _inner = v _outer" scene={{ title: 'Two points on one radius turn together, but the outer one moves faster', omega: 1.2, velocity: true, inner: 0.5 }}>
              On a spinning body all points share the same <M>ω</M>, but <M>v = ω · r</M> is bigger farther from the axis, and so is <M>a = ω ^2 · r</M>.
            </Mistake>
          </div>
        </section>

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
