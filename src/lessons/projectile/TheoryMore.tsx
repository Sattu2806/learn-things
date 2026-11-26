/**
 * The rest of the chapter, for school exams and JEE alike: velocity at any
 * moment, the derivation from the equations of motion, finding the angle,
 * launches from a height, speed at any height, hitting targets, and the
 * advanced topics (inclines, relative motion, curvature, air resistance).
 */
import { Eq, M } from '../../ui/Math';
import { Scene } from './Scene';
import { FilmLink, Note, SectionHead } from './theoryParts';

interface Props {
  n: number;
  badge?: string;
}

export function VelocitySection({ n, badge }: Props) {
  return (
    <section className="t-section" id="t-velocity">
      <SectionHead n={n} title="Velocity at any moment" badge={badge} />
      <p>
        The velocity has two parts at every moment. The sideways part never changes. The upward part shrinks by <M>g</M> every second, reaches zero at the top, then grows again pointing down:
      </p>
      <Eq src={['v _x = v · cos θ', 'v _y = v · sin θ − g · t']} />
      <figure className="t-figure">
        <Scene title="The velocity arrow turns as the ball flies; its sideways part stays the same length" throws={[{ v: 20, theta: 50, g: 9.8, arrow: true, components: true }]} height={280} />
        <figcaption>The arrow is the velocity. Its sideways part (dashed) never changes; its upward part shrinks, vanishes at the top, then points down.</figcaption>
      </figure>
      <p>Put the parts back together for the speed, and use their ratio for the direction, the angle φ above the horizontal:</p>
      <Eq src={['v = √[ v _x ^2 + v _y ^2 ]', 'tan φ = [ v _y | v _x ]']} />
      <p>
        The velocity always points along the path. At the top <M>v _y = 0</M>, so the ball is moving straight sideways at <M>v · cos θ</M>: slowest, but not stopped. In vector form, with î sideways and ĵ up:
      </p>
      <Eq src={['r = x · î + y · ĵ', 'v = v _x · î + ( v _y − g · t ) · ĵ']} />
    </section>
  );
}

export function EquationsSection({ n, badge }: Props) {
  return (
    <section className="t-section" id="t-equations">
      <SectionHead n={n} title="From the equations of motion" badge={badge} />
      <p>Exams ask you to derive the results, not just quote them. Every one comes from the three equations of motion with constant acceleration, used once sideways and once up and down:</p>
      <Eq src={['v = u + a · t', 's = u · t + ½ · a · t ^2', 'v ^2 = u ^2 + 2 · a · s']} />
      <div className="t-table-wrap">
        <table className="t-table t-two">
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col">Sideways</th>
              <th scope="col">Up and down</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Starting speed</th>
              <td>
                <M>u _x = u · cos θ</M>
              </td>
              <td>
                <M>u _y = u · sin θ</M>
              </td>
            </tr>
            <tr>
              <th scope="row">Acceleration</th>
              <td>
                <M>a _x = 0</M>
              </td>
              <td>
                <M>a _y = − g</M>
              </td>
            </tr>
            <tr>
              <th scope="row">Speed</th>
              <td>
                <M>v _x = u · cos θ</M>
              </td>
              <td>
                <M>v _y = u · sin θ − g · t</M>
              </td>
            </tr>
            <tr>
              <th scope="row">Position</th>
              <td>
                <M>x = u · cos θ · t</M>
              </td>
              <td>
                <M>y = u · sin θ · t − ½ · g · t ^2</M>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3 className="t-h3">Time of flight</h3>
      <p>
        It lands when <M>y = 0</M>:
      </p>
      <Eq src={['0 = u · sin θ · T − ½ · g · T ^2', 'T = [ 2 · u · sin θ | g ]']} />
      <h3 className="t-h3">Greatest height</h3>
      <p>
        At the top <M>v _y = 0</M>. Use <M>v ^2 = u ^2 + 2 · a · s</M> up and down:
      </p>
      <Eq src={['0 = u ^2 · sin ^2 θ − 2 · g · H', 'H = [ u ^2 · sin ^2 θ | 2 · g ]']} />
      <h3 className="t-h3">Range</h3>
      <p>Sideways, with no acceleration, over the whole time of flight:</p>
      <Eq src={['R = u · cos θ · T = [ 2 · u ^2 · sin θ · cos θ | g ] = [ u ^2 · sin 2 θ | g ]']} />
      <Note label="With calculus">
        Start from the acceleration and integrate twice. <M>a = − g · ĵ</M> gives <M>v = u · cos θ · î + ( u · sin θ − g · t ) · ĵ</M>, and integrating again gives the position above. AP Physics C and university courses expect this route.
      </Note>
    </section>
  );
}

export function AngleSection({ n, badge }: Props) {
  return (
    <section className="t-section" id="t-angle">
      <SectionHead n={n} title="Finding the angle" badge={badge} />
      <p>Sometimes you know the range and need the angle. Rearrange the range formula:</p>
      <Eq src="sin 2 θ = [ R · g | u ^2 ]" />
      <p>
        If the right-hand side is less than 1, two angles work, one flat and one high, and they add up to 90°. If it is more than 1, the target is out of reach: no angle throws that far, because the longest throw is <M>u ^2 / g</M>.
      </p>
      <figure className="t-figure">
        <Scene
          title="At 20 metres per second, 23.7 and 66.3 degrees both land 30 metres away; the high lob takes much longer"
          throws={[
            { v: 20, theta: 23.65, g: 9.8, label: '23.7°' },
            { v: 20, theta: 66.35, g: 9.8, label: '66.3°' },
          ]}
          height={270}
        />
        <figcaption>Both land 30 m away at 20 m/s. The lob arrives much later.</figcaption>
      </figure>
      <p>Two handy results for a pair of throws that land together (JEE asks these):</p>
      <Eq src={['R = 4 · √[ H _1 · H _2 ]', 'T _1 · T _2 = [ 2 · R | g ]']} />
      <FilmLink m="best">Watch the angle sweep in the film</FilmLink>
    </section>
  );
}

export function HeightAngleSection({ n, badge }: Props) {
  return (
    <section className="t-section" id="t-height-angle">
      <SectionHead n={n} title="At an angle from a height" badge={badge} />
      <p>
        Thrown upward from a height <M>h</M>, the ball rises, then falls past its starting height and on down to the ground. It lands when <M>y = 0</M>:
      </p>
      <Eq src="0 = h + u · sin θ · t − ½ · g · t ^2" />
      <p>That is a quadratic in t. One root is negative (a time before the throw); keep the positive one:</p>
      <Eq src="T = [ u · sin θ + √[ u ^2 · sin ^2 θ + 2 · g · h ] | g ]" />
      <figure className="t-figure">
        <Scene title="A ball thrown at 15 metres per second and 30 degrees from a 10 metre roof" throws={[{ v: 15, theta: 30, g: 9.8, h: 10 }]} marks={{ launch: '10 m', angle: true, range: '= 31.0 m' }} height={280} />
        <figcaption>15 m/s at 30° from a 10 m roof: in the air 2.39 s, landing 31.0 m away.</figcaption>
      </figure>
      <p>
        Thrown <em>downward</em> at an angle? Use the same formula with a negative θ. Then the range is simply <M>x = u · cos θ · T</M>.
      </p>
    </section>
  );
}

export function SpeedSection({ n, badge }: Props) {
  return (
    <section className="t-section" id="t-speed">
      <SectionHead n={n} title="Speed at any height" badge={badge} />
      <p>
        The sideways part of the speed never changes, and the upward part obeys <M>v _y ^2 = u _y ^2 − 2 · g · y</M>. Add the squares and the angle drops out:
      </p>
      <Eq src="v ^2 = u ^2 − 2 · g · y" />
      <p>
        The same comes from energy: <M>½ · m · v ^2 + m · g · y</M> stays the same all the way. So the speed depends only on the height, not on the angle or on whether the ball is going up or down.
      </p>
      <figure className="t-figure">
        <Scene title="The ball has the same speed each time it passes 10 metres, going up and coming down" throws={[{ v: 20, theta: 60, g: 9.8, arrow: true }]} level={{ y: 10, label: '10 m' }} height={280} />
        <figcaption>Passing 10 m on the way up (t₁) and on the way down (t₂), it moves at the same 14.3 m/s: only the direction differs.</figcaption>
      </figure>
      <p>On level ground it lands at the speed it was thrown, at the same angle below the horizontal.</p>
    </section>
  );
}

export function TargetSection({ n, badge }: Props) {
  return (
    <section className="t-section" id="t-target">
      <SectionHead n={n} title="Hitting a target" badge={badge} />
      <h3 className="t-h3">Does it clear the wall?</h3>
      <p>
        Find when the ball reaches the wall, using the steady sideways speed, then its height at that moment. Or put <M>x</M> straight into the path equation:
      </p>
      <Eq src="y = x · tan θ − [ g · x ^2 | 2 · u ^2 · cos ^2 θ ]" />
      <figure className="t-figure">
        <Scene title="Kicked at 18 metres per second and 40 degrees, the ball clears a 4 metre wall 20 metres away" throws={[{ v: 18, theta: 40, g: 9.8 }]} wall={{ x: 20, h: 4, label: '4 m' }} height={270} />
        <figcaption>18 m/s at 40°: at the wall, 20 m away, it is 6.47 m up, clearing it by 2.47 m.</figcaption>
      </figure>
      <h3 className="t-h3">Aiming at a point</h3>
      <p>
        To pass through a point <M>( x , y )</M>, use <M>1 / cos ^2 θ = 1 + tan ^2 θ</M> to turn the path equation into a quadratic in <M>tan θ</M>. Two real roots mean two angles that hit; one root means only just reachable; none means out of reach. The slowest throw that can reach the point is
      </p>
      <Eq src="u _min ^2 = g · ( y + √[ x ^2 + y ^2 ] )" />
      <figure className="t-figure">
        <Scene title="The slowest throw that reaches a point 40 metres along and 30 metres up" throws={[{ v: Math.sqrt(800), theta: 63.435, g: 10 }]} target={{ x: 40, y: 30, label: '(40 m, 30 m)' }} marks={{ angle: true }} height={290} />
        <figcaption>The slowest throw to (40 m, 30 m) needs 28.3 m/s, aimed at tan⁻¹ 2 ≈ 63.4°.</figcaption>
      </figure>
    </section>
  );
}

export function InclineSection({ n, badge }: Props) {
  return (
    <section className="t-section" id="t-incline">
      <SectionHead n={n} title="Up and down a slope" badge={badge} />
      <p>
        On a slope of angle <M>α</M>, tilt your axes to lie along it. Gravity then has a part down the slope, <M>g · sin α</M>, and a part into it, <M>g · cos α</M>. The ball leaves at <M>θ − α</M> to the slope (θ measured from the horizontal) and lands when its height above the slope is zero:
      </p>
      <Eq src={['T = [ 2 · u · sin ( θ − α ) | g · cos α ]', 'R = [ 2 · u ^2 · cos θ · sin ( θ − α ) | g · cos ^2 α ]']} />
      <figure className="t-figure">
        <Scene title="Thrown at 20 metres per second and 60 degrees up a 30 degree slope, the ball lands 26.7 metres up it" throws={[{ v: 20, theta: 60, g: 10 }]} incline={30} marks={{ slope: '26.7 m along the slope', angle: true }} height={290} />
        <figcaption>20 m/s at 60° up a 30° slope: it lands 26.7 m up the slope after 2.31 s.</figcaption>
      </figure>
      <p>The longest throw along the slope bisects the angle between the slope and the vertical:</p>
      <Eq src={['R _max = [ u ^2 | g · ( 1 ± sin α ) ]', 'θ = 45° ± [ α | 2 ]']} />
      <p>Take the upper signs for up the slope and the lower ones for down it. On flat ground, α = 0 gives back 45° and u²/g.</p>
    </section>
  );
}

export function RelativeSection({ n, badge }: Props) {
  return (
    <section className="t-section" id="t-relative">
      <SectionHead n={n} title="Relative motion" badge={badge} />
      <p>
        Every projectile falls with the same acceleration <M>g</M>. So when you watch one from another, gravity cancels: their relative acceleration is zero, and each sees the other moving in a <strong>straight line at a steady speed</strong>.
      </p>
      <Eq src={['a _AB = a _A − a _B = 0', 'v _AB = u _A − u _B']} />
      <figure className="t-figure">
        <Scene
          title="Two balls thrown together at 30 and 60 degrees; the line between them keeps its direction and grows steadily"
          throws={[
            { v: 20, theta: 30, g: 10 },
            { v: 20, theta: 60, g: 10 },
          ]}
          link
          height={270}
        />
        <figcaption>Thrown together at 20 m/s, at 30° and 60°: the dashed line between them never turns, and grows by 10.35 m every second.</figcaption>
      </figure>
      <h3 className="t-h3">Aim straight at a falling target</h3>
      <p>
        A target is let go at the instant you fire straight at it. Both fall the same distance in any time, so the shot still meets it, at any speed fast enough to get there before the target lands. This is the classic “monkey and hunter” problem.
      </p>
      <figure className="t-figure">
        <Scene
          title="A ball fired straight at a target that drops at the same instant still hits it"
          throws={[
            { v: 25, theta: 26.565, g: 9.8, tEnd: 1.3416 },
            { v: 0, theta: 0, g: 9.8, x0: 30, h: 15, tEnd: 1.3416, marker: 'ghost' },
          ]}
          target={{ x: 30, y: 15, label: 'aimed here' }}
          noCliff
          height={270}
        />
        <figcaption>Fired at the target the moment it drops: both fall the same distance, so they meet.</figcaption>
      </figure>
      <p>The same idea explains a packet dropped from a plane: it keeps the plane’s speed, so it stays directly below the plane all the way down.</p>
    </section>
  );
}

export function CurvatureSection({ n, badge }: Props) {
  return (
    <section className="t-section" id="t-curvature">
      <SectionHead n={n} title="Radius of curvature" badge={badge} />
      <p>
        At any point the path bends like a circle of some radius r. Only the part of gravity at right angles to the velocity bends the path, <M>g · cos φ</M>, where φ is the angle of the velocity:
      </p>
      <Eq src={['g · cos φ = [ v ^2 | r ]', 'r = [ v ^2 | g · cos φ ] = [ v ^3 | g · v _x ]']} />
      <figure className="t-figure">
        <Scene title="At the top of the path, the circle that fits it has radius equal to the sideways speed squared over g" throws={[{ v: 20, theta: 60, g: 10, arrow: true }]} curvature height={300} />
        <figcaption>At the top the path is bent most sharply: r = (u cos θ)² / g, 10 m for 20 m/s at 60°.</figcaption>
      </figure>
      <p>At the top, all of g is at right angles to the motion, and the speed is least, so the path bends most sharply there:</p>
      <Eq src={['r _top = [ u ^2 · cos ^2 θ | g ]', 'r _launch = [ u ^2 | g · cos θ ]']} />
    </section>
  );
}

export function AirSection({ n, badge }: Props) {
  return (
    <section className="t-section" id="t-air">
      <SectionHead n={n} title="Air resistance" badge={badge} />
      <p>
        Real balls push air aside. The drag force points against the motion and grows with speed: roughly in proportion to <M>v</M> for small, slow things, and to <M>v ^2</M> for a ball in flight. Its effects, which IB and A-level ask you to describe:
      </p>
      <ul className="t-list">
        <li>It slows the sideways motion too, so the range is shorter.</li>
        <li>The ball does not go as high, and reaches the top sooner.</li>
        <li>The way down is steeper than the way up: the path is lopsided, not a parabola.</li>
        <li>The best angle for distance is usually a little less than 45°.</li>
        <li>A long fall approaches a steady terminal speed, where drag balances weight.</li>
      </ul>
      <figure className="t-figure">
        <Scene
          title="With air resistance the ball lands shorter and comes down more steeply than the ideal parabola"
          throws={[
            { v: 30, theta: 45, g: 9.8, label: 'no air', muted: true },
            { v: 30, theta: 45, g: 9.8, drag: 0.012, label: 'with air' },
          ]}
          height={280}
        />
        <figcaption>The same throw with and without air, worked out step by step with drag growing as v².</figcaption>
      </figure>
    </section>
  );
}
