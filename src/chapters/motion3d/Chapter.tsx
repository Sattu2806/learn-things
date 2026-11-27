import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { AccelSplit, BoxVector, CircleVectors, Helix3D, Position3D, Projectile3D, Velocity3D } from './Motion3dAnims';

/** Motion in three dimensions: position, velocity and acceleration vectors, a projectile with wind, circles and helixes. */

const SECTIONS: NoteSection[] = [
  { id: 'position', title: 'Position in space', group: 'Theory' },
  { id: 'components', title: 'Components and magnitude', group: 'Theory' },
  { id: 'velocity', title: 'Velocity', group: 'Theory' },
  { id: 'acceleration', title: 'Acceleration', group: 'Theory' },
  { id: 'split', title: 'Along and across the velocity', group: 'Theory' },
  { id: 'constant', title: 'Constant acceleration', group: 'Theory' },
  { id: 'projectile', title: 'A projectile in the wind', group: 'Theory' },
  { id: 'circle', title: 'Circular motion as vectors', group: 'Theory' },
  { id: 'helix', title: 'Helical motion', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="motion3d" film={buildFilm} sections={SECTIONS} sideTitle="Motion in three dimensions" sideLead="Position, velocity and acceleration as arrows in space: how a ball curves in the wind, why circular motion needs a vector picture, and what a spiral path is made of.">
      <header className="article-head">
        <span className="kicker">Physics · Kinematics</span>
        <h1 className="article-title">How do we describe motion in space?</h1>
        <p className="article-lead">The world is not a straight line or a flat sheet. A thrown ball drifts sideways in the wind, a bird spirals up on a thermal and a charged particle corkscrews along a magnetic field. All of these are described by three numbers at each moment, and the secret is to treat each of the three directions on its own.</p>
      </header>

      <section className="t-section" id="t-position">
        <SectionHead n={no('position')} title="Position in space" />
        <p>
          To say where a point is in space, we choose an origin and three perpendicular axes <M>x</M>, <M>y</M> and <M>z</M>. We take them <strong>right-handed</strong>: turn the <M>x</M> axis toward the <M>y</M> axis, and a right-hand screw moves along <M>z</M>. In our pictures <M>x</M> goes to the right, <M>y</M> goes into the page and <M>z</M> goes up.
        </p>
        <p>
          The point is at coordinates <M>x</M>, <M>y</M>, <M>z</M>. The arrow from the origin to the point is the <strong>position vector</strong>. If <M>i</M>, <M>j</M> and <M>k</M> are <strong>unit vectors</strong> (arrows of length 1) along the three axes, then
        </p>
        <Eq src='r = x · i + y · j + z · k' />
        <figure className="t-figure">
          <Position3D />
          <figcaption>The dashed lines drop from the point to the floor and across to the axes, showing how the three coordinates are read off. As the point moves, <M>x</M>, <M>y</M> and <M>z</M> each change, and so does the arrow <M>r</M>.</figcaption>
        </figure>
        <p>
          When a point moves from <M>r _1</M> to <M>r _2</M>, its <strong>displacement</strong> is the arrow between them. It is found by subtracting component by component:
        </p>
        <Eq src='Δr = r _2 − r _1 = Δx · i + Δy · j + Δz · k' />
        <Note label="Why vectors">A vector keeps the three numbers together and carries the direction with them. One equation such as <M>v = Δr / Δt</M> then says three things at once, one for each axis.</Note>
      </section>

      <section className="t-section" id="t-components">
        <SectionHead n={no('components')} title="Components and magnitude" />
        <p>
          Any vector <M>A</M> in space can be written as <M>A = A _x · i + A _y · j + A _z · k</M>, where <M>A _x</M>, <M>A _y</M> and <M>A _z</M> are its <strong>components</strong>. Adding vectors means adding the components of each axis separately.
        </p>
        <h3 className="t-h3">The magnitude: Pythagoras twice</h3>
        <p>
          Picture the vector as the long diagonal of a box with sides <M>A _x</M>, <M>A _y</M> and <M>A _z</M>. First find the diagonal <M>d</M> of the floor of the box, then use it with the height:
        </p>
        <Eq src={['d = √[ A _x ^2 + A _y ^2 ]', 'A = √[ d ^2 + A _z ^2 ] = √[ A _x ^2 + A _y ^2 + A _z ^2 ]']} />
        <figure className="t-figure">
          <BoxVector />
          <figcaption>A vector with components 3, 4 and 12 is built one axis at a time. The floor diagonal is 5, and the long diagonal is 13.</figcaption>
        </figure>
        <h3 className="t-h3">Direction</h3>
        <p>
          The direction is given by the angles <M>α</M>, <M>β</M> and <M>γ</M> that the vector makes with the three axes. Their cosines, the <strong>direction cosines</strong>, are the components divided by the magnitude:
        </p>
        <Eq src={['cos α = [ A _x | A ]', 'cos β = [ A _y | A ]', 'cos γ = [ A _z | A ]']} />
        <p>
          They are not independent. Squaring and adding them, and using the formula for <M>A</M>, gives
        </p>
        <Eq src='cos ^2 α + cos ^2 β + cos ^2 γ = 1' />
        <h3 className="t-h3">The scalar product</h3>
        <p>
          Two vectors <M>A</M> and <M>B</M> can be combined into a number called their <strong>scalar product</strong> (or dot product). In components, and in terms of the angle <M>θ</M> between them,
        </p>
        <Eq src='A · B = A _x · B _x + A _y · B _y + A _z · B _z = A · B · cos θ' />
        <p>
          Here, in the last form, <M>A</M> and <M>B</M> mean the lengths of the vectors. The scalar product is zero when the vectors are at right angles. This gives a quick test for perpendicular vectors and a way of finding the angle between any two.
        </p>
      </section>

      <section className="t-section" id="t-velocity">
        <SectionHead n={no('velocity')} title="Velocity" />
        <p>
          The <strong>average velocity</strong> over a time <M>Δt</M> is the displacement divided by the time. It points the same way as the displacement.
        </p>
        <Eq src='v _avg = [ Δr | Δt ]' />
        <p>
          Shrink <M>Δt</M> toward zero, and the displacement arrow lines up with the path. The limit is the <strong>instantaneous velocity</strong>, the rate of change of the position vector:
        </p>
        <Eq src='v = [ dr | dt ] = [ dx | dt ] · i + [ dy | dt ] · j + [ dz | dt ] · k' />
        <p>
          So each component of the velocity is just the ordinary one-dimensional velocity along that axis: <M>v _x = dx / dt</M>, <M>v _y = dy / dt</M> and <M>v _z = dz / dt</M>. The velocity vector is always <strong>tangent to the path</strong>, and its magnitude is the <strong>speed</strong>:
        </p>
        <Eq src='v = √[ v _x ^2 + v _y ^2 + v _z ^2 ]' />
        <figure className="t-figure">
          <Velocity3D />
          <figcaption>As the dashed chord <M>Δr</M> becomes shorter it lines up with the path. The velocity arrow touches the path at the point and points the way it is going.</figcaption>
        </figure>
        <Note label="Speed and distance">Speed is the magnitude of the velocity. The path length travelled is not the magnitude of the displacement: a point that goes round a loop and returns has covered some distance, but its displacement is zero.</Note>
      </section>

      <section className="t-section" id="t-acceleration">
        <SectionHead n={no('acceleration')} title="Acceleration" />
        <p>
          The <strong>acceleration</strong> is the rate of change of the velocity <em>vector</em>:
        </p>
        <Eq src='a = [ dv | dt ] = [ d v _x | dt ] · i + [ d v _y | dt ] · j + [ d v _z | dt ] · k' />
        <p>
          Because the velocity is a vector with a size and a direction, it changes if the speed changes, if the direction changes, or both. A car going round a bend at a steady 60 km/h is accelerating. The acceleration need not point along the path, as the figure shows.
        </p>
        <figure className="t-figure">
          <Velocity3D showA />
          <figcaption>The velocity (bright) is tangent to the path. The acceleration (grey) points in whatever direction the velocity is turning or changing in.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-split">
        <SectionHead n={no('split')} title="Along and across the velocity" />
        <p>
          It helps to split the acceleration into two parts: one <strong>along</strong> the velocity and one <strong>across</strong> it, at right angles. They do different jobs.
        </p>
        <ul className="t-list">
          <li>
            The part <strong>along</strong> the velocity changes the <em>speed</em>. Forward, the point speeds up. Backward, it slows down.
          </li>
          <li>
            The part <strong>across</strong> the velocity changes the <em>direction</em>. It bends the path, and it does not change the speed.
          </li>
        </ul>
        <p>
          With the scalar product we can find both parts. The component along <M>v</M> is the projection of <M>a</M> on the direction of <M>v</M>, and the rest is across:
        </p>
        <Eq src={['a _along = [ a · v | v ]', 'a _across = √[ a ^2 − a _along ^2 ]']} />
        <p>
          Here <M>a · v</M> in the first formula is the scalar product, and <M>v</M> and <M>a</M> elsewhere are magnitudes. If <M>a · v = 0</M>, the acceleration is entirely across the velocity: the speed is constant and only the direction changes. This is uniform circular motion.
        </p>
        <figure className="t-figure">
          <AccelSplit />
          <figcaption>The point speeds up when the acceleration has a forward part and slows down when it has a backward part. The part across always points to the inside of the bend.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-constant">
        <SectionHead n={no('constant')} title="Constant acceleration" />
        <p>
          When the acceleration vector is constant, the one-dimensional rules from a straight line apply to each component. In vector form:
        </p>
        <Eq src={['v = v _0 + a · t', 'r = r _0 + v _0 · t + [ 1 | 2 ] · a · t ^2']} />
        <p>
          Written out, these are three separate sets of equations, one for each axis, and each involves only that axis:
        </p>
        <Eq src={['x = x _0 + v _x0 · t + [ 1 | 2 ] · a _x · t ^2 ,  v _x = v _x0 + a _x · t', 'y = y _0 + v _y0 · t + [ 1 | 2 ] · a _y · t ^2 ,  v _y = v _y0 + a _y · t', 'z = z _0 + v _z0 · t + [ 1 | 2 ] · a _z · t ^2 ,  v _z = v _z0 + a _z · t']} />
        <p>
          This is the great simplification of motion in space. The three motions are <strong>independent</strong>: what happens along <M>z</M> does not change what happens along <M>x</M> or <M>y</M>. The only thing that links them is time, which is the same for all three.
        </p>
        <figure className="t-figure">
          <Projectile3D graphs ghost={false} height={255} title="A ball is thrown with a sideways wind. On the left, its path in space with a dashed shadow on the ground; on the right, graphs of x, y and z against time: x is a straight line, y and z are parabolas, and each is traced independently" />
          <figcaption>On the right, the three coordinates, each traced as if the others did not exist. Time is the one thing they share.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-projectile">
        <SectionHead n={no('projectile')} title="A projectile in the wind" />
        <p>
          Throw a ball with speed <M>v _0</M>. Its direction is given by two angles: the <strong>elevation</strong> <M>θ</M> above the ground, and the <strong>azimuth</strong> <M>φ</M>, the compass angle of the horizontal part measured from the <M>x</M> axis. Splitting the velocity into components (first the height, then the horizontal part into <M>x</M> and <M>y</M>):
        </p>
        <Eq src={['v _x0 = v _0 · cos θ · cos φ', 'v _y0 = v _0 · cos θ · sin φ', 'v _z0 = v _0 · sin θ']} />
        <p>
          Gravity pulls down, so <M>a _z = − g</M>. Suppose a steady wind pushes the ball sideways, with horizontal accelerations <M>a _wx</M> and <M>a _wy</M>. (This is a simple model of a light, steady push; real air drag is more complicated.) The acceleration vector is constant:
        </p>
        <Eq src='a = a _wx · i + a _wy · j − g · k' />
        <p>The constant-acceleration equations, one axis at a time, give the whole flight:</p>
        <Eq src={['x = v _x0 · t + [ 1 | 2 ] · a _wx · t ^2', 'y = v _y0 · t + [ 1 | 2 ] · a _wy · t ^2', 'z = v _z0 · t − [ 1 | 2 ] · g · t ^2']} />
        <p>
          The height equation has nothing to do with the wind. So the time of flight and the greatest height are exactly as they would be with no wind at all:
        </p>
        <Eq src={['T = [ 2 · v _z0 | g ]', 'H = [ v _z0 ^2 | 2 · g ]']} />
        <p>
          The wind only moves the landing point. Put <M>t = T</M> in the <M>x</M> and <M>y</M> equations to find where it lands. For a crosswind along <M>y</M> only, thrown along <M>x</M> (<M>φ = 0</M>), the landing point is
        </p>
        <Eq src={['x = v _x0 · T', 'y = [ 1 | 2 ] · a _w · T ^2']} />
        <figure className="t-figure">
          <Projectile3D />
          <figcaption>
            The hollow ball is a throw with no wind; the solid ball has a sidewind. They are at the same height at every moment and they land at the same instant, but the wind carries the solid ball sideways, and its ground shadow bends.
          </figcaption>
        </figure>
        <p>
          A tailwind or headwind (along <M>x</M>) would lengthen or shorten the range without changing the flight time. The sideways drift grows with the <em>square</em> of the time, so it is much bigger for a ball that stays up longer.
        </p>
      </section>

      <section className="t-section" id="t-circle">
        <SectionHead n={no('circle')} title="Circular motion as vectors" />
        <p>
          Uniform circular motion is easiest to understand as vectors. Put the circle of radius <M>R</M> in the <M>x</M>–<M>y</M> plane, centred on the origin, and let the point go round at a steady angular speed <M>ω</M>. At time <M>t</M> the angle is <M>ω · t</M>, and
        </p>
        <Eq src='r = R · cos ( ω · t ) · i + R · sin ( ω · t ) · j' />
        <p>Differentiating each component gives the velocity, and once more the acceleration:</p>
        <Eq src={['v = [ dr | dt ] = − R · ω · sin ( ω · t ) · i + R · ω · cos ( ω · t ) · j', 'a = [ dv | dt ] = − R · ω ^2 · cos ( ω · t ) · i − R · ω ^2 · sin ( ω · t ) · j = − ω ^2 · r']} />
        <figure className="t-figure">
          <CircleVectors />
          <figcaption>The velocity is always at a right angle to the position vector and tangent to the circle. The acceleration points opposite to the position vector, in toward the centre. The dots on the axes show the components.</figcaption>
        </figure>
        <p>Three facts follow at once.</p>
        <ol className="steps">
          <li className="step">
            <h4>The speed is constant</h4>
            <Eq src='v = √[ ( R · ω ) ^2 · ( sin ^2 ( ω · t ) + cos ^2 ( ω · t ) ) ] = ω · R' />
          </li>
          <li className="step">
            <h4>The velocity is at right angles to the position</h4>
            <Eq src='r · v = − R ^2 · ω · cos ( ω · t ) · sin ( ω · t ) + R ^2 · ω · sin ( ω · t ) · cos ( ω · t ) = 0' />
          </li>
          <li className="step">
            <h4>The acceleration is directed to the centre</h4>
            <Eq src='a = − ω ^2 · r , so  a = ω ^2 · R = [ v ^2 | R ]' />
          </li>
        </ol>
        <p>
          The speed is steady but the velocity is not, since its direction keeps turning. The acceleration, being at right angles to the velocity, changes only its direction. This is the &ldquo;across&rdquo; kind of acceleration, and it is called <strong>centripetal</strong>, meaning centre-seeking.
        </p>
      </section>

      <section className="t-section" id="t-helix">
        <SectionHead n={no('helix')} title="Helical motion" />
        <p>
          Add a steady drift along the <M>z</M> axis to circular motion, and the path becomes a <strong>helix</strong>, like a spring or a spiral staircase. The position vector is
        </p>
        <Eq src='r = R · cos ( ω · t ) · i + R · sin ( ω · t ) · j + v _z · t · k' />
        <p>
          The velocity has the circular part and a steady part along the axis, and the acceleration is only the circular one, because <M>v _z</M> does not change:
        </p>
        <Eq src={['v = − R · ω · sin ( ω · t ) · i + R · ω · cos ( ω · t ) · j + v _z · k', 'a = − R · ω ^2 · cos ( ω · t ) · i − R · ω ^2 · sin ( ω · t ) · j']} />
        <figure className="t-figure">
          <Helix3D />
          <figcaption>The velocity is the sum of a part round the circle and a steady part along the axis. Seen from above, the particle simply goes round a circle.</figcaption>
        </figure>
        <p>
          The speed is constant, since both parts are, and the acceleration points straight at the axis, with magnitude <M>ω ^2 · R</M>:
        </p>
        <Eq src='v = √[ ( R · ω ) ^2 + v _z ^2 ]' />
        <p>
          One turn takes the period <M>T = 2 · π / ω</M>. In that time the particle climbs the distance called the <strong>pitch</strong>:
        </p>
        <Eq src='p = v _z · T = [ 2 · π · v _z | ω ]' />
        <h3 className="t-h3">A charged particle in a magnetic field</h3>
        <p>
          A charge <M>q</M> of mass <M>m</M> in a magnetic field <M>B</M> feels a force at right angles to both the field and its velocity. It does no work, so the speed does not change. The part of the velocity across the field, <M>v _perp</M>, goes round a circle, and the part along the field, <M>v _par</M>, is untouched. Together they make a helix whose axis is along <M>B</M>, with
        </p>
        <Eq src={['ω = [ q · B | m ]', 'R = [ m · v _perp | q · B ]', 'p = v _par · T = v _par · [ 2 · π · m | q · B ]']} />
        <p>
          If the velocity makes an angle <M>α</M> with the field, then <M>v _perp = v · sin α</M> and <M>v _par = v · cos α</M>. Auroras are made this way: charged particles from the Sun spiral along the Earth&apos;s field lines toward the poles.
        </p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Position vector', 'r = x · i + y · j + z · k'],
                  ['Magnitude', 'A = √[ A _x ^2 + A _y ^2 + A _z ^2 ]'],
                  ['Direction cosines', 'cos α = [ A _x | A ]'],
                  ['Scalar product', 'A · B = A _x · B _x + A _y · B _y + A _z · B _z'],
                  ['Average velocity', 'v _avg = [ Δr | Δt ]'],
                  ['Velocity', 'v = [ dr | dt ]'],
                  ['Acceleration', 'a = [ dv | dt ]'],
                  ['Part along the velocity', 'a _along = [ a · v | v ]'],
                  ['Constant acceleration, velocity', 'v = v _0 + a · t'],
                  ['Constant acceleration, position', 'r = r _0 + v _0 · t + [ 1 | 2 ] · a · t ^2'],
                  ['Launch components', 'v _x0 = v _0 · cos θ · cos φ'],
                  ['Time of flight', 'T = [ 2 · v _z0 | g ]'],
                  ['Greatest height', 'H = [ v _z0 ^2 | 2 · g ]'],
                  ['Sideways drift (crosswind)', 'y = [ 1 | 2 ] · a _w · T ^2'],
                  ['Circular: speed', 'v = ω · R'],
                  ['Circular: acceleration', 'a = ω ^2 · R = [ v ^2 | R ]'],
                  ['Helix: speed', 'v = √[ ( R · ω ) ^2 + v _z ^2 ]'],
                  ['Helix: pitch', 'p = [ 2 · π · v _z | ω ]'],
                  ['Charge in a field', 'R = [ m · v _perp | q · B ]'],
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
                  ['r', 'Position vector', 'm'],
                  ['v', 'Velocity (magnitude: speed)', 'm/s'],
                  ['a', 'Acceleration', 'm/s²'],
                  ['θ', 'Elevation angle above the ground', 'rad or degrees'],
                  ['φ', 'Azimuth: angle from the x axis', 'rad or degrees'],
                  ['ω', 'Angular speed', 'rad/s'],
                  ['R', 'Radius of the circle or helix', 'm'],
                  ['p', 'Pitch of the helix', 'm'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{['m', 'm/s', 'm/s²', 'rad/s'].includes(unit) ? <M>{`"${unit}"`}</M> : unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="A displacement in space">
          <p className="ex-q">A point moves from (1, 2, 3) m to (4, 6, 15) m in 2.0 s. Find its displacement, the magnitude of the displacement, the average velocity and its magnitude, and the direction cosines.</p>
          <Given items={['r _1 = ( 1 , 2 , 3 ) "m"', 'r _2 = ( 4 , 6 , 15 ) "m"', 'Δt = 2.0 "s"']} />
          <ol className="steps">
            <Step title="Displacement">
              <Eq src='Δr = ( 4 − 1 , 6 − 2 , 15 − 3 ) = ( 3 , 4 , 12 ) "m"' />
            </Step>
            <Step title="Its magnitude">
              <Eq src='Δr = √[ 3 ^2 + 4 ^2 + 12 ^2 ] = √[ 9 + 16 + 144 ] = √[ 169 ] = 13 "m"' />
            </Step>
            <Step title="Average velocity">
              <Eq src={['v _avg = [ Δr | Δt ] = ( 1.5 , 2.0 , 6.0 ) "m/s"', 'v _avg = [ 13 | 2.0 ] = 6.5 "m/s"']} />
            </Step>
            <Step title="Direction cosines">
              <Eq src={['cos α = [ 3 | 13 ] = 0.231 ,  α = 76.7°', 'cos β = [ 4 | 13 ] = 0.308 ,  β = 72.1°', 'cos γ = [ 12 | 13 ] = 0.923 ,  γ = 22.6°']} />
            </Step>
          </ol>
          <Answer>The displacement is (3, 4, 12) m, 13 m long. The average velocity is (1.5, 2.0, 6.0) m/s with magnitude 6.5 m/s, pointing 22.6° from the z axis, mostly upward.</Answer>
          <figure className="t-figure">
            <BoxVector />
          </figure>
        </Example>

        <Example n={2} title="Velocity and acceleration from a path">
          <p className="ex-q">The position of a particle is <M>r = 2 · t · i + 3 · t ^2 · j + ( 5 − t ^2 ) · k</M>, in metres, with <M>t</M> in seconds. Find its position, velocity, speed and acceleration at <M>t = 2 "s"</M>.</p>
          <Given items={['x = 2 · t', 'y = 3 · t ^2', 'z = 5 − t ^2']} />
          <ol className="steps">
            <Step title="Differentiate for the velocity">
              <Eq src='v = [ dr | dt ] = 2 · i + 6 · t · j − 2 · t · k' />
            </Step>
            <Step title="Differentiate again for the acceleration">
              <Eq src='a = [ dv | dt ] = 6 · j − 2 · k' />
            </Step>
            <Step title="Put in t = 2 s">
              <Eq src={['r = ( 4 , 12 , 1 ) "m"', 'v = ( 2 , 12 , −4 ) "m/s"', 'a = ( 0 , 6 , −2 ) "m/s²"']} />
            </Step>
            <Step title="Magnitudes">
              <Eq src={['v = √[ 2 ^2 + 12 ^2 + 4 ^2 ] = √[ 164 ] = 12.8 "m/s"', 'a = √[ 6 ^2 + 2 ^2 ] = √[ 40 ] = 6.32 "m/s²"']} />
            </Step>
          </ol>
          <Answer>At 2 s the particle is at (4, 12, 1) m, moving at 12.8 m/s with velocity (2, 12, −4) m/s. The acceleration is constant: (0, 6, −2) m/s², of magnitude 6.32 m/s².</Answer>
          <figure className="t-figure">
            <Velocity3D showA />
          </figure>
        </Example>

        <Example n={3} title="Speeding up or turning?">
          <p className="ex-q">At one moment a body has velocity (3, 4, 0) m/s and acceleration (2, 1, 2) m/s². Find the parts of the acceleration along and across the velocity, and the angle between the two vectors.</p>
          <Given items={['v = ( 3 , 4 , 0 ) "m/s"', 'a = ( 2 , 1 , 2 ) "m/s²"']} />
          <ol className="steps">
            <Step title="Scalar product and magnitudes">
              <Eq src={['a · v = 2 · 3 + 1 · 4 + 2 · 0 = 10', 'v = √[ 9 + 16 ] = 5 ,  a = √[ 4 + 1 + 4 ] = 3']} />
            </Step>
            <Step title="Along the velocity">
              <Eq src='a _along = [ a · v | v ] = [ 10 | 5 ] = 2.0 "m/s²"' />
            </Step>
            <Step title="Across the velocity">
              <Eq src='a _across = √[ a ^2 − a _along ^2 ] = √[ 9 − 4 ] = 2.24 "m/s²"' />
            </Step>
            <Step title="The angle">
              <p>The scalar product is 10, and the product of the two magnitudes is 5 · 3 = 15, so</p>
              <Eq src='cos θ = [ 10 | 5 · 3 ] = 0.667 ,  θ = 48.2°' />
            </Step>
          </ol>
          <Answer>The speed is increasing at 2.0 m/s², and the path is turning with an acceleration of 2.24 m/s² across the velocity. The two vectors make an angle of 48.2°.</Answer>
          <figure className="t-figure">
            <AccelSplit />
          </figure>
        </Example>

        <Example n={4} title="A throw with a crosswind">
          <p className="ex-q">A ball is thrown along the x axis at 20 m/s, 40° above the ground. A steady crosswind gives it a sideways acceleration of 2.0 m/s² along y. Find the time of flight, greatest height, landing point, and the speed at landing. Use <M>g = 9.8 "m/s²"</M>.</p>
          <Given items={['v _0 = 20 "m/s"', 'θ = 40°', 'a _w = 2.0 "m/s²"', 'g = 9.8 "m/s²"']} />
          <ol className="steps">
            <Step title="Launch components">
              <Eq src={['v _x0 = 20 · cos 40° = 15.32 "m/s"', 'v _z0 = 20 · sin 40° = 12.86 "m/s"']} />
            </Step>
            <Step title="Time of flight and height (the wind does not matter)">
              <Eq src={['T = [ 2 · v _z0 | g ] = [ 2 · 12.86 | 9.8 ] = 2.624 "s"', 'H = [ v _z0 ^2 | 2 · g ] = [ 165.3 | 19.6 ] = 8.43 "m"']} />
            </Step>
            <Step title="Where it lands">
              <Eq src={['x = v _x0 · T = 15.32 · 2.624 = 40.2 "m"', 'y = [ 1 | 2 ] · a _w · T ^2 = [ 1 | 2 ] · 2.0 · 2.624 ^2 = 6.89 "m"']} />
            </Step>
            <Step title="Speed at landing">
              <Eq src={['v _y = a _w · T = 2.0 · 2.624 = 5.25 "m/s"', 'v = √[ 15.32 ^2 + 5.25 ^2 + 12.86 ^2 ] = √[ 427.7 ] = 20.7 "m/s"']} />
            </Step>
          </ol>
          <Answer>The ball is in the air for 2.62 s and reaches 8.43 m. It lands at (40.2, 6.89, 0) m, 6.89 m off the line of the throw (about 9.7° to the side). It hits the ground at 20.7 m/s, a little faster than it was thrown because of the push of the wind.</Answer>
          <figure className="t-figure">
            <Projectile3D />
          </figure>
        </Example>

        <Example n={5} title="A point on a circle">
          <p className="ex-q">A point goes round a circle of radius 0.50 m at 120 revolutions per minute. Find its angular speed, speed and acceleration. At the moment its position vector makes 45° with the x axis, write down the three vectors.</p>
          <Given items={['R = 0.50 "m"', 'f = 120 "rev/min" = 2.0 "Hz"']} />
          <ol className="steps">
            <Step title="Angular speed, speed and acceleration">
              <Eq src={['ω = 2 · π · f = 2 · π · 2.0 = 12.57 "rad/s"', 'v = ω · R = 12.57 · 0.50 = 6.28 "m/s"', 'a = ω ^2 · R = 12.57 ^2 · 0.50 = 79.0 "m/s²"']} />
            </Step>
            <Step title="Check with v squared over R">
              <Eq src='a = [ v ^2 | R ] = [ 6.28 ^2 | 0.50 ] = 79.0 "m/s²"' />
            </Step>
            <Step title="The vectors at 45°">
              <Eq src={['r = R · ( cos 45° , sin 45° ) = ( 0.354 , 0.354 ) "m"', 'v = ω · R · ( − sin 45° , cos 45° ) = ( −4.44 , 4.44 ) "m/s"', 'a = − ω ^2 · r = ( −55.8 , −55.8 ) "m/s²"']} />
            </Step>
          </ol>
          <Answer>
            <M>ω = 12.57 "rad/s"</M>, speed 6.28 m/s and acceleration 79.0 m/s², directed to the centre. At 45° the velocity (−4.44, 4.44) m/s is at a right angle to the position, as <M>r · v = 0</M> requires.
          </Answer>
          <figure className="t-figure">
            <CircleVectors />
          </figure>
        </Example>

        <Example n={6} title="A spiral climb">
          <p className="ex-q">A point moves on a helix of radius 2.0 m with angular speed 3.0 rad/s, climbing at a steady 1.5 m/s. Find its speed, its acceleration, the pitch, and how many turns it makes while climbing 10 m.</p>
          <Given items={['R = 2.0 "m"', 'ω = 3.0 "rad/s"', 'v _z = 1.5 "m/s"']} />
          <ol className="steps">
            <Step title="Speed">
              <Eq src={['v _perp = ω · R = 3.0 · 2.0 = 6.0 "m/s"', 'v = √[ 6.0 ^2 + 1.5 ^2 ] = √[ 38.25 ] = 6.18 "m/s"']} />
            </Step>
            <Step title="Acceleration">
              <Eq src='a = ω ^2 · R = 3.0 ^2 · 2.0 = 18 "m/s²"' />
              <p>It is directed at the axis and has no component along it.</p>
            </Step>
            <Step title="Pitch">
              <Eq src='p = [ 2 · π · v _z | ω ] = [ 2 · π · 1.5 | 3.0 ] = 3.14 "m"' />
            </Step>
            <Step title="Turns in 10 m">
              <Eq src='[ 10 | p ] = [ 10 | 3.14 ] = 3.18' />
            </Step>
          </ol>
          <Answer>The speed is 6.18 m/s and the acceleration is 18 m/s² toward the axis. The pitch is 3.14 m, so climbing 10 m takes 3.18 turns.</Answer>
          <figure className="t-figure">
            <Helix3D />
          </figure>
        </Example>

        <Example n={7} title="A proton in a magnetic field">
          <p className="ex-q">A proton moves at 1.0 × 10⁶ m/s at 30° to a magnetic field of 0.10 T. Find the radius and the pitch of its helical path. Use <M>m = 1.67 × 10 ^−27 "kg"</M> and <M>q = 1.60 × 10 ^−19 "C"</M>.</p>
          <Given items={['v = 1.0 × 10 ^6 "m/s"', 'α = 30°', 'B = 0.10 "T"']} />
          <ol className="steps">
            <Step title="Split the velocity">
              <Eq src={['v _perp = v · sin 30° = 5.0 × 10 ^5 "m/s"', 'v _par = v · cos 30° = 8.66 × 10 ^5 "m/s"']} />
            </Step>
            <Step title="Angular speed and period">
              <Eq src={['ω = [ q · B | m ] = [ 1.60 × 10 ^−19 · 0.10 | 1.67 × 10 ^−27 ] = 9.58 × 10 ^6 "rad/s"', 'T = [ 2 · π | ω ] = 6.56 × 10 ^−7 "s"']} />
            </Step>
            <Step title="Radius">
              <Eq src='R = [ v _perp | ω ] = [ 5.0 × 10 ^5 | 9.58 × 10 ^6 ] = 0.0522 "m"' />
            </Step>
            <Step title="Pitch">
              <Eq src='p = v _par · T = 8.66 × 10 ^5 · 6.56 × 10 ^−7 = 0.568 "m"' />
            </Step>
          </ol>
          <Answer>The proton spirals about the field direction with a radius of 5.22 cm, turning once every 0.656 μs, and advances 0.568 m along the field in each turn.</Answer>
          <figure className="t-figure">
            <Helix3D />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="The speed is the sum of the components" wrong="v = v _x + v _y + v _z" fig={<BoxVector />}>
            Components are the sides of a box and the speed is its long diagonal, so it is the square root of the sum of the squares: <M>v = √[ v _x ^2 + v _y ^2 + v _z ^2 ]</M>. For components 3, 4 and 12 the sum would be 19, but the speed is 13.
          </Mistake>
          <Mistake title="A sideways wind keeps the ball up longer" wrong={'"wind changes the time in the air"'} fig={<Projectile3D height={235} title="A ball thrown with a crosswind and one thrown with no wind are at the same height at every moment and land together" />}>
            The time in the air is decided by the vertical motion alone. A wind along <M>x</M> or <M>y</M> changes where the ball lands, and not when.
          </Mistake>
          <Mistake title="Steady speed means no acceleration" wrong={'v = "constant" → a = 0'} fig={<CircleVectors height={250} />}>
            Acceleration is the rate of change of the velocity <em>vector</em>. When the direction changes the velocity changes, even if the speed does not. A point going round a circle at steady speed has an acceleration <M>ω ^2 · R</M> toward the centre.
          </Mistake>
          <Mistake title="The acceleration is always along the velocity" wrong={'a ∥ v  "always"'} fig={<AccelSplit />}>
            Only the part of the acceleration along the velocity changes the speed. The part across it turns the path. When the two vectors are at right angles, only the direction changes.
          </Mistake>
          <Mistake title="In a helix the acceleration points along the axis" wrong={'a  "points along the axis"'} fig={<Helix3D />}>
            The velocity along the axis is steady, so it adds no acceleration. The acceleration is that of the circular part only: <M>ω ^2 · R</M>, straight at the axis, at right angles to it.
          </Mistake>
          <Mistake title="The direction cosines add up to 1" wrong="cos α + cos β + cos γ = 1" fig={<BoxVector />}>
            It is the <em>squares</em> that add up to 1: <M>cos ^2 α + cos ^2 β + cos ^2 γ = 1</M>. For the angles 76.7°, 72.1° and 22.6° the cosines add to 1.46, while their squares add to exactly 1.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Treat each direction on its own, and the whole of space follows.</p>
        <p className="closing-sub">Next: forces. Newton&apos;s laws are vector equations, and a force in space works on each component of the motion separately.</p>
      </footer>
    </ChapterShell>
  );
}
