import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Fig } from '../kit/Anim';
import { Mistake, Mistakes } from '../kit/Mistake';
import {
  AreaParallelogram,
  DotGauge,
  DotProjection,
  MistakeAddMagnitudes,
  MistakeCosAlways,
  MistakeSubtractOrder,
  NamingVector,
  Parallelogram,
  Polar,
  Resolve,
  Scale,
  ScalarVsVector,
  Subtract,
  TorquePreview,
  TriangleAdd,
  UnitVectors,
  WorkPreview,
} from './Diagrams2D';
import { AngleBetween, Box3, Cosines, CrossScene, Displacement3D, DroneFlight, Helix } from './Diagrams3D';

/** Vectors in 2D and 3D: arrows, components, the dot and cross products, and motion in space. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'Size, or size and direction', group: 'Theory' },
  { id: 'draw', title: 'Drawing and naming vectors', group: 'Theory' },
  { id: 'add', title: 'Adding vectors', group: 'Theory' },
  { id: 'subtract', title: 'Subtracting and scaling', group: 'Theory' },
  { id: 'unit', title: 'Unit vectors', group: 'Theory' },
  { id: 'resolve', title: 'Components', group: 'Theory' },
  { id: 'd3', title: 'Vectors in 3D', group: 'Theory' },
  { id: 'position', title: 'Position and displacement', group: 'Theory' },
  { id: 'dot', title: 'The dot product', group: 'Theory' },
  { id: 'cross', title: 'The cross product', group: 'Theory' },
  { id: 'motion', title: 'Motion in three dimensions', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="vectors" film={buildFilm} sections={SECTIONS} sideTitle="Vectors" sideLead="Arrows that carry a size and a direction: how to add them, split them into parts, multiply them two ways, and follow them through space.">
      <header className="article-head">
        <span className="kicker">Physics · Mathematics for motion</span>
        <h1 className="article-title">How do you add a walk to the north to a walk to the east?</h1>
        <p className="article-lead">Some quantities need a direction as well as a number. This chapter builds the arrow language that all of mechanics is written in, first on a flat page and then in three dimensions.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="Size, or size and direction" />
        <p>
          Some quantities are fully described by one number and a unit: a mass of 3 kg, a time of 5 s, a temperature of 20 °C, an energy of 40 J. These are <strong>scalars</strong>. They add like ordinary numbers.
        </p>
        <p>
          Others also need a direction. &ldquo;Walk 5 m&rdquo; is not a complete instruction; &ldquo;walk 5 m north-east&rdquo; is. Displacement, velocity, acceleration and force are <strong>vectors</strong>: a size (the <strong>magnitude</strong>) together with a direction.
        </p>
        <Fig caption="The distance walked is a scalar and adds up the whole path: 7 m. The displacement is a vector, the arrow from the start to where you are now: 5 m, north of east.">
          <ScalarVsVector />
        </Fig>
        <p>
          The same two numbers, 4 and 3, give different answers when they are scalars (7) and when they are vectors at right angles (5). Vectors need their own rules, and this chapter is those rules.
        </p>
        <Note label="Pairs to keep apart">
          Distance and speed are scalars; displacement and velocity are their vector twins. Mass is a scalar, weight is a force and so a vector.
        </Note>
      </section>

      <section className="t-section" id="t-draw">
        <SectionHead n={no('draw')} title="Drawing and naming vectors" />
        <p>
          We draw a vector as an arrow. The <strong>length</strong> of the arrow, to some scale, is the magnitude; the way the arrow points is the direction. The end where it starts is the <strong>tail</strong> and the pointed end is the <strong>tip</strong>.
        </p>
        <p>
          In print a vector is named with a bold letter or a letter with a small arrow above it, such as <M>A</M>. Here we say &ldquo;the vector <M>A</M>&rdquo; and write the plain letter <M>A</M> for its magnitude. By hand you can write the magnitude with bars, |A|. A direction is given as an angle <M>θ</M> measured from a chosen axis, usually anticlockwise from the positive x-axis.
        </p>
        <Fig caption="A vector is defined by its size and direction only, so it can be slid anywhere, as long as it stays parallel and keeps its length. Each copy is the same vector A.">
          <NamingVector />
        </Fig>
        <p>
          Two vectors are <strong>equal</strong> when they have the same magnitude and the same direction, wherever they are drawn. This freedom to slide is what makes the addition rule work.
        </p>
      </section>

      <section className="t-section" id="t-add">
        <SectionHead n={no('add')} title="Adding vectors" />
        <p>
          Walk along <M>A</M>, then along <M>B</M>. Where you end up, compared with where you began, is the <strong>resultant</strong> <M>R</M>. To draw it, slide <M>B</M> so that its tail sits on the tip of <M>A</M> (the <strong>triangle rule</strong>), then draw <M>R</M> from the start of <M>A</M> to the tip of <M>B</M>.
        </p>
        <Eq src='R = A + B' />
        <Fig caption="Tip to tail: B is slid to the end of A, and R closes the triangle from the first tail to the last tip.">
          <TriangleAdd A={[3, 1]} B={[2, 2.5]} />
        </Fig>
        <p>
          The <strong>parallelogram rule</strong> says the same thing from another view. Draw both vectors from the same point, complete the parallelogram, and the diagonal from that point is the resultant. Going round by <M>A</M> then <M>B</M>, or by <M>B</M> then <M>A</M>, lands in the same place, so the order does not matter:
        </p>
        <Eq src='A + B = B + A' />
        <Fig caption="The two dashed sides are copies of A and B slid into place; both routes meet at the tip of R.">
          <Parallelogram A={[3.2, 0.6]} B={[1.4, 2.4]} />
        </Fig>
        <p>
          For more than two vectors, lay them all tip to tail; the resultant joins the very first tail to the very last tip. If the angle between <M>A</M> and <M>B</M> (when drawn from the same point) is <M>θ</M>, the cosine rule gives the size of the resultant:
        </p>
        <Eq src={['R = √[ A ^2 + B ^2 + 2 · A · B · cos θ ]', 'tan φ = [ B · sin θ | A + B · cos θ ]']}>
          <span>
            where <M>φ</M> is the angle of <M>R</M> from <M>A</M>.
          </span>
        </Eq>
        <p>
          Check the extremes: at <M>θ = 0°</M> the vectors point the same way and <M>R = A + B</M>; at <M>θ = 180°</M> they oppose and <M>R = A − B</M> in size; at <M>θ = 90°</M> it is Pythagoras, <M>R = √[ A ^2 + B ^2 ]</M>.
        </p>
      </section>

      <section className="t-section" id="t-subtract">
        <SectionHead n={no('subtract')} title="Subtracting and scaling" />
        <p>
          The negative of a vector, <M>−B</M>, has the same length but points the opposite way. Subtracting is then adding the negative:
        </p>
        <Eq src='A − B = A + ( −B )' />
        <Fig caption="B is turned through half a turn to make −B, slid to the tip of A, and the sum is A − B. The dashed arrow shows the shortcut: A − B runs from the tip of B to the tip of A.">
          <Subtract />
        </Fig>
        <p>
          That shortcut is worth remembering: when two vectors start at the same point, <M>A − B</M> is the arrow <em>from the tip of B to the tip of A</em>. It is how a change in a vector, such as <M>Δv = v _2 − v _1</M>, is found.
        </p>
        <p>
          Multiplying a vector by a number <M>k</M> multiplies its magnitude by the size of <M>k</M>, ignoring its sign. If <M>k</M> is positive the direction is unchanged; if it is negative the vector turns round. So <M>2 · A</M> is twice as long, <M>[ 1 | 2 ] · A</M> half as long, and <M>−A</M> the same length pointing back.
        </p>
        <Fig caption="Stretching, shrinking and reversing: kA always lies along the same line as A.">
          <Scale />
        </Fig>
        <p>
          Two vectors are <strong>parallel</strong> exactly when one is a number times the other, <M>B = k · A</M>.
        </p>
      </section>

      <section className="t-section" id="t-unit">
        <SectionHead n={no('unit')} title="Unit vectors" />
        <p>
          A <strong>unit vector</strong> has magnitude exactly 1 and no unit; its only job is to point. Dividing any vector by its own magnitude gives the unit vector in that direction, written with a hat:
        </p>
        <Eq src='Â = [ A | A ]' />
        <p>
          Three special ones point along the axes: <M>î</M> along x, <M>ĵ</M> along y and <M>k̂</M> along z. Any vector is a sum of steps along them. The vector below is 3 steps of <M>î</M> and 2 of <M>ĵ</M>:
        </p>
        <Eq src='A = 3 · î + 2 · ĵ' />
        <Fig caption="Build the vector from unit steps: three along x, then two along y. The sum is the arrow from the start to the end.">
          <UnitVectors />
        </Fig>
        <p>
          In general <M>A = A _x · î + A _y · ĵ</M>, where the numbers <M>A _x</M> and <M>A _y</M> are the <strong>components</strong>. Written this way, adding vectors is just adding matching components:
        </p>
        <Eq src='A + B = ( A _x + B _x ) · î + ( A _y + B _y ) · ĵ' />
        <p>
          No drawing needed: add the x-parts, add the y-parts. That is the method you will use most.
        </p>
      </section>

      <section className="t-section" id="t-resolve">
        <SectionHead n={no('resolve')} title="Components" />
        <p>
          <strong>Resolving</strong> a vector means splitting it into two parts at right angles, along the axes. If a vector of magnitude <M>A</M> makes an angle <M>θ</M> with the x-axis, the components are the two short sides of a right-angled triangle whose hypotenuse is <M>A</M>:
        </p>
        <Eq src={['A _x = A · cos θ', 'A _y = A · sin θ']} />
        <Fig caption="As the vector turns from the x-axis toward the y-axis, its x-component shrinks from A to zero while its y-component grows from zero to A.">
          <Resolve />
        </Fig>
        <p>
          Going the other way, from components to size and direction, is Pythagoras and a tangent:
        </p>
        <Eq src={['A = √[ A _x ^2 + A _y ^2 ]', 'θ = tan ^−1 ( [ A _y | A _x ] )']} />
        <Fig caption="The tip moves round an ellipse. The size always comes from Pythagoras; the angle needs a look at which quadrant the tip is in.">
          <Polar />
        </Fig>
        <Note label="Quadrants">
          Your calculator&rsquo;s <M>tan ^−1</M> only returns angles between −90° and 90°. If <M>A _x</M> is negative, add 180° to get the true direction. A quick sketch of the components tells you which quadrant you are in.
        </Note>
        <p>
          The cosine is for the side next to the angle and the sine for the side opposite it. If the angle is measured from the y-axis instead, the two swap.
        </p>
      </section>

      <section className="t-section" id="t-d3">
        <SectionHead n={no('d3')} title="Vectors in 3D" />
        <p>
          Space has three directions, so a vector has three components, one for each axis, and the third unit vector <M>k̂</M> points along z:
        </p>
        <Eq src='A = A _x · î + A _y · ĵ + A _z · k̂' />
        <p>
          The diagrams here are drawn in an oblique view, as on paper: x comes toward you, y goes away to the right, z goes up, and the picture turns slowly so the depth is easy to read. To find the magnitude, use Pythagoras twice: first along the floor, then up.
        </p>
        <Eq src='A = √[ ( A _x ^2 + A _y ^2 ) + A _z ^2 ] = √[ A _x ^2 + A _y ^2 + A _z ^2 ]' />
        <Fig caption="The vector 2î + 3ĵ + 6k̂: step along x, then y, then z. The dashed floor diagonal has length √13, and the full vector has length √(13 + 36) = 7.">
          <Box3 />
        </Fig>
        <p>
          Adding and subtracting work component by component, exactly as in 2D, and multiplying by a number <M>k</M> multiplies every component.
        </p>
        <h3 className="t-h3">Direction cosines</h3>
        <p>
          In 3D a single angle is not enough to give a direction. We use the three angles <M>α</M>, <M>β</M>, <M>γ</M> the vector makes with the x, y and z axes. Their cosines are the components divided by the magnitude:
        </p>
        <Eq src={['cos α = [ A _x | A ]', 'cos β = [ A _y | A ]', 'cos γ = [ A _z | A ]']} />
        <p>
          These three numbers are exactly the components of the unit vector <M>Â</M>, so their squares add up to one: it is the magnitude formula divided by <M>A ^2</M>.
        </p>
        <Eq src='cos ^2 α + cos ^2 β + cos ^2 γ = 1' />
        <Fig caption="A vector of fixed length turns in space. Each direction cosine changes, but the three squares always fill the bar exactly.">
          <Cosines />
        </Fig>
      </section>

      <section className="t-section" id="t-position">
        <SectionHead n={no('position')} title="Position and displacement" />
        <p>
          The <strong>position vector</strong> of a point is the arrow from the origin to it. For the point <M>( x , y , z )</M>:
        </p>
        <Eq src='r = x · î + y · ĵ + z · k̂' />
        <p>
          The <strong>displacement</strong> from a point 1 to a point 2 is the arrow joining them. It is a difference of position vectors, found by subtracting component by component:
        </p>
        <Eq src={['Δr = r _2 − r _1', '= ( x _2 − x _1 ) · î + ( y _2 − y _1 ) · ĵ + ( z _2 − z _1 ) · k̂']} />
        <Fig caption="Two position vectors from the origin, and the displacement from the tip of r₁ to the tip of r₂. A ball glides along Δr.">
          <Displacement3D />
        </Fig>
        <p>
          The length of <M>Δr</M> is the straight-line distance between the points. Moving the origin changes every position vector, but it leaves the displacement unchanged, and so physics mostly cares about displacements.
        </p>
        <Eq src='Δr = √[ ( x _2 − x _1 ) ^2 + ( y _2 − y _1 ) ^2 + ( z _2 − z _1 ) ^2 ]' />
      </section>

      <section className="t-section" id="t-dot">
        <SectionHead n={no('dot')} title="The dot product" />
        <p>
          There are two ways of multiplying two vectors. The first, the <strong>dot product</strong>, gives a <em>scalar</em>. With <M>θ</M> the angle between the vectors drawn from a common tail:
        </p>
        <Eq src='A · B = A · B · cos θ' />
        <p>
          Read it as the length of <M>A</M> times the length of the shadow of <M>B</M> on <M>A</M>. When the vectors point the same way the shadow is the whole of <M>B</M>; when they are at right angles it vanishes; when they point against each other, it is negative.
        </p>
        <Fig caption="B turns through half a turn. Its shadow on A (the bright bar) shrinks to nothing at 90° and then points backward, so the dot product turns negative.">
          <DotProjection />
        </Fig>
        <p>With components, the dot product is a simple sum, because the unit vectors satisfy <M>î · î = 1</M> and <M>î · ĵ = 0</M>:</p>
        <Eq src='A · B = A _x · B _x + A _y · B _y + A _z · B _z' />
        <p>It leads to three uses:</p>
        <ul className="t-list">
          <li>
            <strong>Angle between two vectors.</strong> <M>cos θ = [ A · B | A · B ]</M>.
          </li>
          <li>
            <strong>Perpendicular test.</strong> If <M>A · B = 0</M> and neither is zero, the vectors are at right angles.
          </li>
          <li>
            <strong>Component along a direction.</strong> The part of <M>A</M> along <M>B</M> is <M>A · B̂</M>.
          </li>
        </ul>
        <p>
          Also <M>A · A = A ^2</M>, and the order does not matter: <M>A · B = B · A</M>.
        </p>
        <h3 className="t-h3">A preview: work</h3>
        <p>
          When a force <M>F</M> moves something through a displacement <M>d</M>, it does an amount of work <M>W = F · d</M>, a dot product. Only the part of the force along the motion counts. The full story comes in the chapters on work and energy.
        </p>
        <Fig caption="A rope pulls a block 5 m along the ground. As the rope lifts, the horizontal part of the pull (the bright bar) shrinks and so does the work.">
          <WorkPreview />
        </Fig>
      </section>

      <section className="t-section" id="t-cross">
        <SectionHead n={no('cross')} title="The cross product" />
        <p>
          The second product, the <strong>cross product</strong>, gives a <em>vector</em>. Its size is <M>A · B · sin θ</M> and its direction is set by a unit vector <M>n̂</M>:
        </p>
        <Eq src='A × B = A · B · sin θ · n̂' />
        <p>
          Here <M>n̂</M> is at right angles to both <M>A</M> and <M>B</M>. Which of the two perpendicular ways? The <strong>right-hand rule</strong>: curl the fingers of your right hand from the first vector toward the second; the thumb points along the result. So swapping the order flips it:
        </p>
        <Eq src='B × A = − ( A × B )' />
        <Fig caption="A and B lie flat. Curling from A toward B turns anticlockwise seen from above, so A × B points up. Swap the order and the curl reverses, so B × A points down.">
          <CrossScene />
        </Fig>
        <p>
          The result is zero when the vectors are parallel (<M>sin θ = 0</M>), so <M>A × A = 0</M>. The unit vectors multiply cyclically:
        </p>
        <Eq src={['î × ĵ = k̂', 'ĵ × k̂ = î', 'k̂ × î = ĵ']} />
        <p>Expanding with components gives the result as three terms, one for each unit vector:</p>
        <Eq src='A × B = ( A _y · B _z − A _z · B _y ) · î + ( A _z · B _x − A _x · B _z ) · ĵ + ( A _x · B _y − A _y · B _x ) · k̂' />
        <h3 className="t-h3">Area of a parallelogram</h3>
        <p>
          The size <M>A · B · sin θ</M> is the base <M>A</M> times the height <M>B · sin θ</M> of the parallelogram built on the two vectors. So the cross product&rsquo;s size is its area, and a triangle on them has half of it.
        </p>
        <Fig caption="The area of the parallelogram is the base A times the height h = B sin θ. It is biggest when the vectors are at right angles.">
          <AreaParallelogram />
        </Fig>
        <h3 className="t-h3">A preview: torque</h3>
        <p>
          The turning effect of a force about a pivot is the cross product of the position vector from the pivot to the point of push, with the force: <M>τ = r × F</M>. A push at right angles to the spanner turns best; one along the spanner does not turn it at all.
        </p>
        <Fig caption="A spanner swings up and down under a steady downward force. The turning effect is largest when r and F are at right angles.">
          <TorquePreview />
        </Fig>
      </section>

      <section className="t-section" id="t-motion">
        <SectionHead n={no('motion')} title="Motion in three dimensions" />
        <p>
          A moving particle has a position vector that changes with time, <M>r ( t ) = x ( t ) · î + y ( t ) · ĵ + z ( t ) · k̂</M>. Velocity is the rate of change of position, and acceleration the rate of change of velocity. The derivative of a vector is found component by component, because the unit vectors never change:
        </p>
        <Eq src='v = [ d r | d t ] = [ d x | d t ] · î + [ d y | d t ] · ĵ + [ d z | d t ] · k̂' />
        <Eq src='a = [ d v | d t ] = [ d ^2 r | d t ^2 ]' />
        <p>
          The velocity is always tangent to the path, and the speed is its magnitude, <M>v = √[ v _x ^2 + v _y ^2 + v _z ^2 ]</M>. Each component moves as if the others were not there. That is why a projectile can be handled as a horizontal and a vertical motion separately.
        </p>
        <p>
          For a helix, such as a spring, a screw thread or a charged particle in a magnetic field, a particle goes round a circle of radius <M>R</M> in the xy-plane while climbing steadily at a speed <M>u</M> along z:
        </p>
        <Eq src='r = R · cos ω · t · î + R · sin ω · t · ĵ + u · t · k̂' />
        <p>Differentiate once for the velocity and again for the acceleration:</p>
        <Eq src='v = − R · ω · sin ω · t · î + R · ω · cos ω · t · ĵ + u · k̂' />
        <Eq src='a = − R · ω ^2 · cos ω · t · î − R · ω ^2 · sin ω · t · ĵ' />
        <p>
          The speed <M>√[ R ^2 · ω ^2 + u ^2 ]</M> is constant. The acceleration has no z part, because the climb is steady, and it points straight at the axis: the circular motion from the chapter on circles, with a steady drift along z added on.
        </p>
        <Fig caption="A particle on a helix with R = 2 m, ω = 2 rad/s and u = 0.8 m/s. The hollow dot is its shadow on the floor, going round a circle. The velocity (bright) is tangent to the path; the acceleration (grey) points at the axis. Arrows are drawn smaller than true scale.">
          <Helix />
        </Fig>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Sum (component form)', 'R _x = A _x + B _x ,  R _y = A _y + B _y ,  R _z = A _z + B _z'],
                  ['Size of a sum of two', 'R = √[ A ^2 + B ^2 + 2 · A · B · cos θ ]'],
                  ['Difference', 'A − B = A + ( −B )'],
                  ['Unit vector', 'Â = [ A | A ]'],
                  ['A vector in 3D', 'A = A _x · î + A _y · ĵ + A _z · k̂'],
                  ['Components from angle', 'A _x = A · cos θ ,  A _y = A · sin θ'],
                  ['Magnitude (2D)', 'A = √[ A _x ^2 + A _y ^2 ]'],
                  ['Direction (2D)', 'tan θ = [ A _y | A _x ]'],
                  ['Magnitude (3D)', 'A = √[ A _x ^2 + A _y ^2 + A _z ^2 ]'],
                  ['Direction cosines', 'cos α = [ A _x | A ] ,  cos β = [ A _y | A ] ,  cos γ = [ A _z | A ]'],
                  ['Their identity', 'cos ^2 α + cos ^2 β + cos ^2 γ = 1'],
                  ['Position vector', 'r = x · î + y · ĵ + z · k̂'],
                  ['Displacement', 'Δr = r _2 − r _1'],
                  ['Dot product', 'A · B = A · B · cos θ = A _x · B _x + A _y · B _y + A _z · B _z'],
                  ['Angle between vectors', 'cos θ = [ A · B | A · B ]'],
                  ['Cross product size', 'A × B = A · B · sin θ'],
                  ['Cross product swap', 'B × A = − ( A × B )'],
                  ['Cross products of unit vectors', 'î × ĵ = k̂ ,  ĵ × k̂ = î ,  k̂ × î = ĵ'],
                  ['Velocity and acceleration', 'v = [ d r | d t ] ,  a = [ d v | d t ]'],
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
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['A , B', 'Vectors; the plain letter is the magnitude'],
                  ['R', 'The resultant, the sum of vectors'],
                  ['θ', 'Angle between two vectors, or from the x-axis'],
                  ['î , ĵ , k̂', 'Unit vectors along x, y, z'],
                  ['A _x', 'Component of A along x'],
                  ['α , β , γ', 'Angles with the x, y, z axes'],
                  ['r', 'Position vector'],
                  ['Δr', 'Displacement'],
                  ['n̂', 'Unit vector at right angles to the plane of A and B'],
                ] as const
              ).map(([sym, meaning]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Two forces at an angle">
          <p className="ex-q">Two forces act on a ring: 30 N east and 40 N at 60° above east. Find the size and direction of the resultant.</p>
          <Given items={['F _1 = 30 "N"', 'F _2 = 40 "N"', 'θ = 60°']} />
          <ol className="steps">
            <Step title="Resolve the second force">
              <Eq src={['F _2x = 40 · cos 60° = 20 "N"', 'F _2y = 40 · sin 60° = 34.6 "N"']} />
            </Step>
            <Step title="Add components">
              <Eq src={['R _x = 30 + 20 = 50 "N"', 'R _y = 0 + 34.6 = 34.6 "N"']} />
            </Step>
            <Step title="Magnitude">
              <Eq src='R = √[ 50 ^2 + 34.6 ^2 ] = 60.8 "N"' />
            </Step>
            <Step title="Direction">
              <Eq src='φ = tan ^−1 ( [ 34.6 | 50 ] ) = 34.7°' />
            </Step>
            <Step title="Check with the cosine rule">
              <Eq src='R = √[ 30 ^2 + 40 ^2 + 2 · 30 · 40 · cos 60° ] = √[ 3700 ] = 60.8 "N"' />
            </Step>
          </ol>
          <Answer>The resultant is 60.8 N, at 34.7° above the 30 N force. It is less than 30 + 40 = 70 N, because the forces do not pull the same way.</Answer>
          <Fig>
            <Parallelogram A={[30, 0]} B={[20, 34.64]} s={2.3} ox={90} oy={200} height={235} names={['F₁', 'F₂', 'R']} note="R = 60.8 N" />
          </Fig>
        </Example>

        <Example n={2} title="Resolving a pull">
          <p className="ex-q">A child pulls a sledge with a rope that makes 30° with the horizontal ground, with a force of 50 N. How much of the pull moves the sledge forward, and how much lifts it?</p>
          <Given items={['F = 50 "N"', 'θ = 30°']} />
          <ol className="steps">
            <Step title="Horizontal part (next to the angle)">
              <Eq src='F _x = F · cos θ = 50 · cos 30° = 43.3 "N"' />
            </Step>
            <Step title="Vertical part (opposite the angle)">
              <Eq src='F _y = F · sin θ = 50 · sin 30° = 25.0 "N"' />
            </Step>
            <Step title="Check by recombining">
              <Eq src='√[ 43.3 ^2 + 25.0 ^2 ] = 50.0 "N"' />
            </Step>
          </ol>
          <Answer>43.3 N pulls the sledge forward and 25.0 N lifts it. The lifting part does not help the sledge go forward, so a lower rope wastes less.</Answer>
          <Fig>
            <Resolve mag={50} unit="N" target={30} />
          </Fig>
        </Example>

        <Example n={3} title="Magnitude and direction cosines">
          <p className="ex-q">
            Find the magnitude of <M>A = 2 · î − 3 · ĵ + 6 · k̂</M> and the angles it makes with the three axes.
          </p>
          <Given items={['A _x = 2', 'A _y = −3', 'A _z = 6']} />
          <ol className="steps">
            <Step title="Magnitude">
              <Eq src='A = √[ 2 ^2 + ( −3 ) ^2 + 6 ^2 ] = √[ 49 ] = 7' />
            </Step>
            <Step title="Direction cosines">
              <Eq src={['cos α = [ 2 | 7 ] = 0.286', 'cos β = [ −3 | 7 ] = −0.429', 'cos γ = [ 6 | 7 ] = 0.857']} />
            </Step>
            <Step title="Angles">
              <Eq src={['α = 73.4°', 'β = 115.4°', 'γ = 31.0°']} />
            </Step>
            <Step title="Check the identity">
              <Eq src='cos ^2 α + cos ^2 β + cos ^2 γ = [ 4 + 9 + 36 | 49 ] = 1' />
            </Step>
          </ol>
          <Answer>The magnitude is 7. The vector makes 73.4° with x, 115.4° with y (more than 90° because the y-component is negative) and 31.0° with z.</Answer>
          <Fig>
            <Box3 v={[2, -3, 6]} lo={[0, -4, 0]} L={[3, 1, 6]} />
          </Fig>
        </Example>

        <Example n={4} title="The angle between two vectors">
          <p className="ex-q">
            Find the angle between <M>A = 2 · î + 2 · ĵ + k̂</M> and <M>B = 3 · î + 4 · k̂</M>, and the component of <M>B</M> along <M>A</M>.
          </p>
          <Given items={['A = ( 2 , 2 , 1 )', 'B = ( 3 , 0 , 4 )']} />
          <ol className="steps">
            <Step title="The dot product, from components">
              <Eq src='A · B = 2 · 3 + 2 · 0 + 1 · 4 = 10' />
            </Step>
            <Step title="The magnitudes">
              <Eq src={['A = √[ 4 + 4 + 1 ] = 3', 'B = √[ 9 + 0 + 16 ] = 5']} />
            </Step>
            <Step title="The angle">
              <Eq src='cos θ = [ 10 | 3 · 5 ] = 0.667 ,  θ = 48.2°' />
            </Step>
            <Step title="Component of B along A">
              <Eq src='B · cos θ = [ A · B | A ] = [ 10 | 3 ] = 3.33' />
            </Step>
          </ol>
          <Answer>The angle between them is 48.2°, and B has a component of 3.33 along A.</Answer>
          <Fig>
            <AngleBetween />
          </Fig>
        </Example>

        <Example n={5} title="Area of a parallelogram">
          <p className="ex-q">
            Find <M>A × B</M> for <M>A = 2 · î + 3 · ĵ + k̂</M> and <M>B = î − ĵ + 2 · k̂</M>, and the area of the parallelogram and of the triangle they span.
          </p>
          <Given items={['A = ( 2 , 3 , 1 )', 'B = ( 1 , −1 , 2 )']} />
          <ol className="steps">
            <Step title="The î part">
              <Eq src='A _y · B _z − A _z · B _y = 3 · 2 − 1 · ( −1 ) = 7' />
            </Step>
            <Step title="The ĵ part">
              <Eq src='A _z · B _x − A _x · B _z = 1 · 1 − 2 · 2 = −3' />
            </Step>
            <Step title="The k̂ part">
              <Eq src='A _x · B _y − A _y · B _x = 2 · ( −1 ) − 3 · 1 = −5' />
            </Step>
            <Step title="Its size is the area">
              <Eq src='A × B = 7 · î − 3 · ĵ − 5 · k̂ ,  A × B = √[ 49 + 9 + 25 ] = √[ 83 ] = 9.11' />
            </Step>
            <Step title="Check that it is at right angles to both">
              <Eq src={['( A × B ) · A = 14 − 9 − 5 = 0', '( A × B ) · B = 7 + 3 − 10 = 0']} />
            </Step>
          </ol>
          <Answer>
            <M>A × B = 7 · î − 3 · ĵ − 5 · k̂</M>. The parallelogram has area 9.11 and the triangle half of that, 4.56, in whatever square unit the lengths are in.
          </Answer>
          <Fig>
            <CrossScene A={[2, 3, 1]} B={[1, -1, 2]} k={0.3} flip={false} lo={[0, -2, 0]} L={[3, 3, 3]} cy={215} s={32} loop={8} />
          </Fig>
        </Example>

        <Example n={6} title="A drone flight">
          <p className="ex-q">
            A drone, taking off from the origin (x east, y north, z up, in metres), flies 40 m east, 30 m north and climbs 20 m. Then it moves 10 m west, 20 m north and descends 15 m. Find its final displacement, how far it flew, and its average velocity if the flight took 20 s.
          </p>
          <Given items={['l _1 = ( 40 , 30 , 20 ) "m"', 'l _2 = ( −10 , 20 , −15 ) "m"', 't = 20 "s"']} />
          <ol className="steps">
            <Step title="Total displacement: add components">
              <Eq src='Δr = l _1 + l _2 = ( 40 − 10 ) · î + ( 30 + 20 ) · ĵ + ( 20 − 15 ) · k̂ = 30 · î + 50 · ĵ + 5 · k̂' />
            </Step>
            <Step title="Its magnitude">
              <Eq src='Δr = √[ 30 ^2 + 50 ^2 + 5 ^2 ] = √[ 3425 ] = 58.5 "m"' />
            </Step>
            <Step title="Distance flown: add the lengths of the legs">
              <Eq src={['l _1 = √[ 1600 + 900 + 400 ] = 53.9 "m"', 'l _2 = √[ 100 + 400 + 225 ] = 26.9 "m"']}>
                <span>
                  Path length = 53.9 + 26.9 = 80.8 m.
                </span>
              </Eq>
            </Step>
            <Step title="Average velocity">
              <Eq src='v _avg = [ Δr | t ] = [ 30 · î + 50 · ĵ + 5 · k̂ | 20 ] = 1.5 · î + 2.5 · ĵ + 0.25 · k̂ "m/s"' />
              <p>Its magnitude is 58.5 / 20 = 2.93 m/s, along the straight line from take-off to landing.</p>
            </Step>
          </ol>
          <Answer>
            The displacement is <M>30 · î + 50 · ĵ + 5 · k̂</M> m, of size 58.5 m, though the drone flew 80.8 m along its path. The average velocity is 2.93 m/s; the average speed would be 80.8 / 20 = 4.04 m/s. Distance is a scalar that adds up the path; displacement is a vector that does not care about the route.
          </Answer>
          <Fig>
            <DroneFlight />
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Adding the magnitudes" wrong='R = 3 + 4 = 7 "N"' fig={<MistakeAddMagnitudes />}>
            Magnitudes only add when the vectors point the same way. At right angles 3 N and 4 N make 5 N. Add components, or use the tip-to-tail triangle.
          </Mistake>
          <Mistake title="Subtracting in the wrong order" wrong='A − B = B − A' fig={<MistakeSubtractOrder />}>
            Reversing the order reverses the arrow: <M>B − A = −( A − B )</M>. Remember that A − B runs from the tip of B to the tip of A.
          </Mistake>
          <Mistake title="Cosine for the x-part, always" wrong='A _x = A · cos θ  "whatever the angle"' fig={<MistakeCosAlways />}>
            Cosine goes with the side <em>next to</em> the angle. If θ is measured from the y-axis, the x-part is across from it and is <M>A · sin θ</M>. Sketch the triangle first.
          </Mistake>
          <Mistake title="Trusting the arctangent blindly" wrong='θ = tan ^−1 ( [ y | x ] ) = −53°' fig={<Polar s={26} o={[150, 100]} height={200} rx={300} naive />}>
            <M>tan ^−1</M> cannot tell <M>( −3 , 4 )</M> from <M>( 3 , −4 )</M>, since the ratio is the same. Look at the signs of the components, and add 180° when x is negative.
          </Mistake>
          <Mistake title="A × B equals B × A" wrong='A × B = B × A' fig={<CrossScene height={235} cx={190} cy={195} s={30} L={[3, 3, 3]} readout={false} loop={9} />}>
            The cross product is not commutative. Swapping the order flips it: <M>B × A = −( A × B )</M>. The size is the same, but the direction is the opposite.
          </Mistake>
          <Mistake title="The dot product is a vector" wrong='A · B = "a vector"' fig={<DotGauge />}>
            The dot product is a single number, positive, zero or negative; it has no direction. Only the cross product gives a vector.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Split into components, work with numbers, and put the arrow back at the end.</p>
        <p className="closing-sub">Next: with vectors in hand, position, velocity and acceleration can describe motion along any path, and forces can be added properly.</p>
      </footer>
    </ChapterShell>
  );
}
