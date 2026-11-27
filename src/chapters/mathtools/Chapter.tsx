import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { AreaVT, ConstantC, DerivTrace, Gallery, LineParams, MotionGraphs, RectSum, Secant, SlopeMeaning, SmallAngle, TangentApprox } from './MathAnims';

/** Mathematical tools for physics: graphs, slope and area, derivatives, integrals and approximations. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'Maths as the language of physics', group: 'Theory' },
  { id: 'graphs', title: 'Graphs and straight lines', group: 'Theory' },
  { id: 'slope', title: 'Slope: how fast things change', group: 'Theory' },
  { id: 'derivative', title: 'The derivative', group: 'Theory' },
  { id: 'rules', title: 'Rules for derivatives', group: 'Theory' },
  { id: 'integral', title: 'The integral as an area', group: 'Theory' },
  { id: 'antiderivative', title: 'Integrals undo derivatives', group: 'Theory' },
  { id: 'motion', title: 'Calculus in motion', group: 'Theory' },
  { id: 'small', title: 'The small-angle approximation', group: 'Theory' },
  { id: 'binomial', title: 'The binomial approximation', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

/** v = 3 t² sampled finely, so the area under it can be drawn. */
const CUBIC: [number, number][] = Array.from({ length: 41 }, (_, i) => [i * 0.05, 3 * (i * 0.05) ** 2]);

export default function Chapter() {
  return (
    <ChapterShell id="mathtools" film={buildFilm} sections={SECTIONS} sideTitle="Mathematical tools" sideLead="Slopes, areas and small changes: the few ideas from mathematics that physics uses over and over, shown on moving pictures first and then written down.">
      <header className="article-head">
        <span className="kicker">Physics · Mathematical tools</span>
        <h1 className="article-title">What maths do you need for physics?</h1>
        <p className="article-lead">Four ideas carry most of the load: a graph is a picture of a relationship, the slope of a graph is a rate, the area under it is a total, and near a point every smooth curve looks like a straight line. This chapter builds each of them and uses them on motion.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="Maths as the language of physics" />
        <p>
          Physics describes how one quantity depends on another: how far a ball has fallen after a time, how a current depends on a voltage, how the pressure of a gas changes as its volume shrinks. A <strong>relationship</strong> like this can be written as a formula, drawn as a graph, or tabulated. They are three views of the same thing.
        </p>
        <figure className="t-figure">
          <Gallery />
          <figcaption>Four shapes you will meet again and again: a parabola, a hyperbola, a wave and a decay. Each point traces out its curve as the quantity on the horizontal axis changes.</figcaption>
        </figure>
        <p>
          The tools in this chapter answer two questions about any such graph. <em>How fast is it changing right here?</em> That is the slope, and the <strong>derivative</strong> is the exact way to find it. <em>How much has it added up to?</em> That is the area, and the <strong>integral</strong> is the exact way to find it. A third tool, the <strong>approximation</strong>, replaces a complicated curve by a straight line over a small stretch so that the algebra becomes easy.
        </p>
        <Note label="You will use this">Velocity is a derivative of position. Displacement is an integral of velocity. The pendulum, the lens and the diffraction slit all lean on the small-angle approximation. The same four ideas appear in every chapter.</Note>
      </section>

      <section className="t-section" id="t-graphs">
        <SectionHead n={no('graphs')} title="Graphs and straight lines" />
        <p>
          The simplest relationship is a <strong>straight line</strong>:
        </p>
        <Eq src='y = m · x + c' />
        <p>
          The number <M>m</M> is the <strong>slope</strong>: how much <M>y</M> goes up for each step in <M>x</M>. The number <M>c</M> is the <strong>intercept</strong>, the value of <M>y</M> where the line crosses the vertical axis.
        </p>
        <figure className="t-figure">
          <LineParams />
          <figcaption>First the slope grows with the intercept fixed, and the line tips up. Then the intercept grows with the slope fixed, and the whole line lifts without turning.</figcaption>
        </figure>
        <p>Other common relationships are named by how <M>y</M> changes when <M>x</M> changes:</p>
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Direct proportion', 'y = k · x', 'a straight line through the origin'],
                  ['Inverse proportion', 'y = [ k | x ]', 'a hyperbola; double x, halve y'],
                  ['Square law', 'y = k · x ^2', 'a parabola; double x, four times y'],
                  ['Exponential decay', 'y = y _0 · e ^−k·x', 'falls by the same fraction each step'],
                ] as const
              ).map(([name, rule, shape]) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td>
                    <M>{rule}</M>
                  </td>
                  <td>{shape}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          A good habit: if you suspect a relationship such as <M>y = k · x ^2</M>, do not plot <M>y</M> against <M>x</M>. Plot <M>y</M> against <M>x ^2</M>. If you are right you get a straight line, which is far easier to judge by eye than a curve. The experimental skills chapter uses exactly this trick with a pendulum.
        </p>
      </section>

      <section className="t-section" id="t-slope">
        <SectionHead n={no('slope')} title="Slope: how fast things change" />
        <p>
          Pick two points on a graph. The <strong>slope</strong> between them is the rise divided by the run:
        </p>
        <Eq src='m = [ Δ y | Δ x ] = [ y _2 − y _1 | x _2 − x _1 ]' />
        <p>
          The symbol <M>Δ</M> means &ldquo;a change in&rdquo;. The slope says how many units of <M>y</M> you gain per unit of <M>x</M>, so its unit is the unit of <M>y</M> divided by the unit of <M>x</M>. That is why a slope in physics is always a <em>rate</em>.
        </p>
        <p>On a graph of position against time, the slope is the <strong>velocity</strong>, and on a graph of velocity against time it is the <strong>acceleration</strong>:</p>
        <Eq src={['v _avg = [ Δ x | Δ t ] = [ x _2 − x _1 | t _2 − t _1 ]', 'a _avg = [ Δ v | Δ t ]']} />
        <figure className="t-figure">
          <SlopeMeaning />
          <figcaption>The car drives out at 4 m/s, waits, and drives back at 2 m/s. On the graph that is a steep climb, a flat stretch and a downward slope. The sign of the slope says which way it moves.</figcaption>
        </figure>
        <p>
          A <strong>steeper</strong> line means a faster change. A <strong>flat</strong> line means no change. A <strong>negative</strong> slope means the quantity is falling. Read a graph this way and you can tell the whole story of a motion without a single number.
        </p>
        <p>
          That works for straight lines. But most real motions are curves, where the slope is different at every point. What is the slope &ldquo;right here&rdquo;? We need one more idea.
        </p>
      </section>

      <section className="t-section" id="t-derivative">
        <SectionHead n={no('derivative')} title="The derivative" />
        <p>
          Take a curve and two points on it. The straight line through them is a <strong>secant</strong>, and its slope is the average rate between the points. Now slide the second point toward the first. The secant turns, and as the gap closes it settles into the line that just touches the curve: the <strong>tangent</strong>. The slope of that line is the rate at that exact point.
        </p>
        <figure className="t-figure">
          <Secant />
          <figcaption>As the second point closes in, the secant (solid) rotates onto the tangent (dashed). The slope of the secant gets closer and closer to 2.</figcaption>
        </figure>
        <p>To see the number come out, take <M>y = x ^2</M>. Move from <M>x</M> to <M>x + Δ x</M> and see how far <M>y</M> moves:</p>
        <Eq src={['Δ y = ( x + Δ x ) ^2 − x ^2', 'Δ y = 2 · x · Δ x + ( Δ x ) ^2']} />
        <p>Divide by the step:</p>
        <Eq src='[ Δ y | Δ x ] = 2 · x + Δ x' />
        <p>
          This is the slope of the secant for any step <M>Δ x</M>. Now let the step shrink toward zero. The last term disappears and what is left is the slope of the tangent, the <strong>derivative</strong>:
        </p>
        <Eq src='[ d y | d x ] = lim _Δx→0 [ Δ y | Δ x ] = 2 · x' />
        <p>
          So at <M>x = 1</M> the slope is 2, just as the figure shows. We write the derivative as <M>d y / d x</M>. It is not a fraction in the ordinary sense, but a limit of fractions, a rate of change at one instant.
        </p>
        <p>In physics the derivatives you meet first are these:</p>
        <Eq src={['v = [ d x | d t ]', 'a = [ d v | d t ] = [ d ^2 x | d t ^2 ]']} />
        <p>
          Velocity is the derivative of position with respect to time. Acceleration is the derivative of velocity, which makes it the <em>second</em> derivative of position. This is exactly what the slope of an <M>x</M>–<M>t</M> graph and a <M>v</M>–<M>t</M> graph told us, now made exact for curves.
        </p>
      </section>

      <section className="t-section" id="t-rules">
        <SectionHead n={no('rules')} title="Rules for derivatives" />
        <p>
          You do not need to work out a limit each time. The same steps as for <M>x ^2</M> give a short list of rules, and every other derivative you need is built from them.
        </p>
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Function</th>
                <th scope="col">Its derivative</th>
                <th scope="col">Note</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['c', '0', 'a constant does not change'],
                  ['x ^n', 'n · x ^n−1', 'bring the power down, lower it by one'],
                  ['sin x', 'cos x', 'x in radians'],
                  ['cos x', '− sin x', 'note the minus sign'],
                  ['e ^x', 'e ^x', 'its own derivative'],
                  ['ln x', '[ 1 | x ]', 'for x greater than zero'],
                ] as const
              ).map(([f, df, note]) => (
                <tr key={f}>
                  <th scope="row">
                    <M>{f}</M>
                  </th>
                  <td>
                    <M>{df}</M>
                  </td>
                  <td>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Three more rules tell you how to combine them. Constants come out and sums split:</p>
        <Eq src='[ d | d x ] ( a · f + b · g ) = a · [ d f | d x ] + b · [ d g | d x ]' />
        <p>
          For a product of two functions, differentiate each in turn:
        </p>
        <Eq src='[ d | d x ] ( u · v ) = u · [ d v | d x ] + v · [ d u | d x ]' />
        <p>
          For a function of a function, such as <M>sin ( ω · t )</M>, multiply the derivatives (the <strong>chain rule</strong>). Call the inside <M>u = ω · t</M>:
        </p>
        <Eq src={['[ d y | d t ] = [ d y | d u ] · [ d u | d t ]', '[ d | d t ] sin ( ω · t ) = cos ( ω · t ) · ω']} />
        <p>This is how the velocity and acceleration of simple harmonic motion come out.</p>
        <figure className="t-figure">
          <DerivTrace />
          <figcaption>The point rides the sine wave with its tangent, while the plot below records the tangent slope: a cosine. Where the wave peaks the slope is zero, and where it crosses zero the slope is steepest.</figcaption>
        </figure>
        <h3 className="t-h3">Peaks and troughs</h3>
        <p>
          At the top of a hill the tangent is flat. So the places where a quantity is largest or smallest, the <strong>turning points</strong>, are where its derivative is zero. To tell a peak from a trough, look at the second derivative:
        </p>
        <Eq src={['[ d y | d x ] = 0 "at a turning point"', '[ d ^2 y | d x ^2 ] < 0 "for a maximum" ,  [ d ^2 y | d x ^2 ] > 0 "for a minimum"']} />
        <p>
          A negative second derivative means the slope is decreasing: the curve bends down like a hill top. A positive one bends up, like the bottom of a bowl.
        </p>
      </section>

      <section className="t-section" id="t-integral">
        <SectionHead n={no('integral')} title="The integral as an area" />
        <p>
          Now the reverse question. If you know how fast something changes, how much has it changed in total? On a graph that is the <strong>area</strong> under the curve. A rectangle is easy: height times width. A curve is not, but we can cut the area into thin vertical strips and treat each as a rectangle of width <M>Δ x</M> and height <M>f ( x _i )</M>:
        </p>
        <Eq src='"area" ≈ Σ f ( x _i ) · Δ x' />
        <figure className="t-figure">
          <RectSum />
          <figcaption>Rectangles under y = x² from 0 to 3, with heights read at the middle of each strip. As the strips get thinner the total creeps toward the exact area, 9.</figcaption>
        </figure>
        <p>
          Make the strips thinner and thinner, and the sum settles on a definite number. That limit is the <strong>definite integral</strong>:
        </p>
        <Eq src='"area" = lim _Δx→0 Σ f ( x _i ) · Δ x = ∫ _a ^b f ( x ) · d x' />
        <p>
          The curly sign <M>∫</M> is a stretched S, for &ldquo;sum&rdquo;, and <M>a</M> and <M>b</M> are where the area starts and ends. The unit of the area is the unit of <M>y</M> times the unit of <M>x</M>: the area under a speed against time graph is metres per second times seconds, which is a distance in metres.
        </p>
        <Note label="Why it matters">Whenever a physical quantity is a rate, the total change is an area. The area under a force–distance graph is work. The area under a power–time graph is energy. The area under a current–time graph is charge.</Note>
      </section>

      <section className="t-section" id="t-antiderivative">
        <SectionHead n={no('antiderivative')} title="Integrals undo derivatives" />
        <p>
          Adding up strips for every problem would be slow. Luckily integration is the <em>reverse</em> of differentiation. If <M>F</M> is a function whose derivative is <M>f</M>, then the area from <M>a</M> to <M>b</M> is just the difference of <M>F</M> at the two ends:
        </p>
        <Eq src='∫ _a ^b f ( x ) · d x = F ( b ) − F ( a ) "where" [ d F | d x ] = f' />
        <p>
          Check it on the figure above. For <M>f = x ^2</M> the function <M>F = x ^3 / 3</M> has the derivative <M>x ^2</M>, so
        </p>
        <Eq src='∫ _0 ^3 x ^2 · d x = [ 3 ^3 | 3 ] − [ 0 ^3 | 3 ] = 9' />
        <p>
          That agrees with the rectangles. The rules for derivatives, read backwards, give the rules for integrals:
        </p>
        <Eq src={['∫ x ^n · d x = [ x ^n+1 | n + 1 ] + C "(n not −1)"', '∫ cos x · d x = sin x + C ,  ∫ sin x · d x = − cos x + C', '∫ e ^x · d x = e ^x + C ,  ∫ [ 1 | x ] · d x = ln x + C']} />
        <p>
          Why the <M>C</M>? The derivative of any constant is zero, so many different functions have the same derivative. Integrating backwards cannot tell which one we started from. The <strong>constant of integration</strong> is the missing piece, and it is fixed by a fact we know about the start of the motion.
        </p>
        <figure className="t-figure">
          <ConstantC />
          <figcaption>Three positions with the same velocity at every moment. They differ only in where they started. The constant of integration picks the one that matches the real starting position.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-motion">
        <SectionHead n={no('motion')} title="Calculus in motion" />
        <p>
          Put the two halves together. Going down the chain, differentiate. Going up, integrate:
        </p>
        <Eq src={['x → [ d x | d t ] = v → [ d v | d t ] = a', 'a → ∫ a · d t = v → ∫ v · d t = x']} />
        <p>
          Here is how the formulas for constant acceleration come out. Start with a constant <M>a</M> and integrate once:
        </p>
        <Eq src='v = ∫ a · d t = a · t + C' />
        <p>
          At <M>t = 0</M> the velocity was <M>u</M>, so <M>C = u</M>. Then integrate again, with <M>x _0</M> the starting position:
        </p>
        <Eq src={['v = u + a · t', 'x = ∫ ( u + a · t ) · d t = x _0 + u · t + [ 1 | 2 ] · a · t ^2']} />
        <p>
          These are the equations of motion that you used without proof earlier. On a velocity–time graph they are just geometry: the area under the line is a rectangle plus a triangle.
        </p>
        <figure className="t-figure">
          <AreaVT title="A car speeds up uniformly from 2 metres per second to 8 metres per second; the area under the velocity against time line grows as time runs and equals the distance the car has travelled" />
          <figcaption>The shaded area under the line grows as time passes. It is the distance covered, and the car above moves exactly that far.</figcaption>
        </figure>
        <Eq src='"area" = u · t + [ 1 | 2 ] · t · ( a · t ) = u · t + [ 1 | 2 ] · a · t ^2' />
        <p>
          The same ideas handle motion that is not uniform. Throw a ball straight up. The height against time is a parabola, whose slope is the velocity, and the velocity against time is a straight line, whose slope is the acceleration and whose area is the change in height:
        </p>
        <figure className="t-figure">
          <MotionGraphs />
          <figcaption>On the way up the slope of the height graph is positive, at the top it is zero, and on the way down it is negative. The area between the velocity line and the axis is first positive (going up) then negative (coming down), so it returns to zero when the ball is back on the ground.</figcaption>
        </figure>
        <p>
          Notice that at the top the velocity is zero but the acceleration is not. The slope of the velocity line is the same minus ten all the way through.
        </p>
      </section>

      <section className="t-section" id="t-small">
        <SectionHead n={no('small')} title="The small-angle approximation" />
        <p>
          Trigonometric functions make equations hard to solve. But for a small angle they simplify wonderfully. The reason is the tangent idea: close to a point, any smooth curve looks like its tangent line. For a function <M>f</M> near <M>x = 0</M>:
        </p>
        <Eq src='f ( x ) ≈ f ( 0 ) + f′ ( 0 ) · x' />
        <p>
          Apply it to <M>sin θ</M>. At zero, <M>sin 0 = 0</M> and the slope is <M>cos 0 = 1</M>. So the tangent line is just <M>θ</M>:
        </p>
        <Eq src={['sin θ ≈ θ', 'tan θ ≈ θ', 'cos θ ≈ 1 − [ θ ^2 | 2 ] ≈ 1']} />
        <p>
          <strong>The angle must be in radians.</strong> A radian is the angle for which the arc equals the radius, which is exactly why the arc length, the sine and the tangent nearly coincide for a small opening. To convert:
        </p>
        <Eq src='θ ( "rad" ) = θ ( "deg" ) × [ π | 180 ]' />
        <figure className="t-figure">
          <SmallAngle />
          <figcaption>As the angle opens, the arc (θ), the vertical drop (sin θ) and the tangent length (tan θ) start together and slowly separate. The errors are listed on the right.</figcaption>
        </figure>
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Angle</th>
                <th scope="col">θ in radians</th>
                <th scope="col">sin θ</th>
                <th scope="col">Error of sin θ ≈ θ</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['1°', '0.017453', '0.017452', '0.005 %'],
                  ['5°', '0.087266', '0.087156', '0.13 %'],
                  ['10°', '0.174533', '0.173648', '0.51 %'],
                  ['20°', '0.349066', '0.342020', '2.1 %'],
                ] as const
              ).map(([a, r, s, e]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td>{r}</td>
                  <td>{s}</td>
                  <td>{e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          So up to about 10° the error is below half a percent. That is why the pendulum formula holds for small swings: it relies on <M>sin θ ≈ θ</M>. The same step turns up for the width of a diffraction pattern and for rays close to the axis of a lens.
        </p>
      </section>

      <section className="t-section" id="t-binomial">
        <SectionHead n={no('binomial')} title="The binomial approximation" />
        <p>
          The same tangent-line idea works for a power of a number close to 1. Take <M>f ( x ) = ( 1 + x ) ^n</M>. At <M>x = 0</M> its value is 1, and by the power rule its slope is <M>n · ( 1 + 0 ) ^n−1 = n</M>. The tangent line is <M>1 + n · x</M>:
        </p>
        <Eq src='( 1 + x ) ^n ≈ 1 + n · x "when x is very small"' />
        <figure className="t-figure">
          <TangentApprox title="The curve for a power of one plus x with its straight tangent line at x equals zero: the two almost coincide near the origin and separate further out, with the percentage error shown for three different powers" />
          <figcaption>Three powers in turn. Close to <M>x = 0</M> the curve and its tangent line (dashed) are indistinguishable, and the error grows as <M>x</M> moves away.</figcaption>
        </figure>
        <p>It works for any power, whole, negative or fractional. Three special cases come up constantly:</p>
        <Eq src={['√[ 1 + x ] ≈ 1 + [ x | 2 ]', '[ 1 | 1 + x ] ≈ 1 − x', '[ 1 | ( 1 + x ) ^2 ] ≈ 1 − 2 · x']} />
        <p>
          How small is small? The first thing left out is the next term, <M>[ n · ( n − 1 ) | 2 ] · x ^2</M>, so the error is about that size. For <M>x = 0.02</M> it is only a few parts in ten thousand. For <M>x = 0.5</M> it is no longer small, and the approximation fails.
        </p>
        <p>Two more tangent lines are worth remembering, from the slopes of the exponential and the logarithm at 0:</p>
        <Eq src={['e ^x ≈ 1 + x', 'ln ( 1 + x ) ≈ x']} />
        <p>
          A typical use: gravity weakens with height <M>h</M> above the Earth&rsquo;s radius <M>R</M>. Writing <M>g′ = g · ( 1 + h / R ) ^−2</M> and expanding for <M>h</M> much less than <M>R</M>:
        </p>
        <Eq src='g′ = g · ( 1 + [ h | R ] ) ^−2 ≈ g · ( 1 − [ 2 · h | R ] )' />
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Straight line', 'y = m · x + c'],
                  ['Slope', 'm = [ Δ y | Δ x ] = [ y _2 − y _1 | x _2 − x _1 ]'],
                  ['Derivative', '[ d y | d x ] = lim _Δx→0 [ Δ y | Δ x ]'],
                  ['Velocity and acceleration', 'v = [ d x | d t ] ,  a = [ d v | d t ]'],
                  ['Power rule', '[ d | d x ] x ^n = n · x ^n−1'],
                  ['Product rule', '[ d | d x ] ( u · v ) = u · [ d v | d x ] + v · [ d u | d x ]'],
                  ['Chain rule', '[ d y | d x ] = [ d y | d u ] · [ d u | d x ]'],
                  ['Turning point', '[ d y | d x ] = 0'],
                  ['Area under a graph', '"area" = ∫ _a ^b f ( x ) · d x'],
                  ['Fundamental theorem', '∫ _a ^b f ( x ) · d x = F ( b ) − F ( a )'],
                  ['Power rule for integrals', '∫ x ^n · d x = [ x ^n+1 | n + 1 ] + C'],
                  ['Velocity from acceleration', 'v = ∫ a · d t'],
                  ['Position from velocity', 'x = ∫ v · d t'],
                  ['Constant acceleration', 'v = u + a · t ,  x = x _0 + u · t + [ 1 | 2 ] · a · t ^2'],
                  ['Small angle', 'sin θ ≈ θ ,  tan θ ≈ θ ,  cos θ ≈ 1 − [ θ ^2 | 2 ]'],
                  ['Binomial', '( 1 + x ) ^n ≈ 1 + n · x'],
                  ['Exponential and log', 'e ^x ≈ 1 + x ,  ln ( 1 + x ) ≈ x'],
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
                  ['m', 'Slope of a line', 'unit of y per unit of x'],
                  ['c', 'Intercept on the y axis', 'unit of y'],
                  ['Δ', 'A finite change in a quantity', 'unit of the quantity'],
                  ['d', 'An infinitesimal change in a quantity', 'unit of the quantity'],
                  ['∫', 'Integral: a sum of strips', 'none'],
                  ['C', 'Constant of integration', 'unit of the integral'],
                  ['θ', 'Angle, in radians for the approximations', 'rad'],
                  ['n', 'A power in the binomial approximation', 'none'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Slope and area of a velocity graph">
          <p className="ex-q">On a velocity–time graph the straight line passes through (2 s, 6 m/s) and (6 s, 14 m/s). Find the acceleration, the starting velocity, and the distance covered between 2 s and 6 s.</p>
          <Given items={['t _1 = 2 "s"', 'v _1 = 6 "m/s"', 't _2 = 6 "s"', 'v _2 = 14 "m/s"']} />
          <ol className="steps">
            <Step title="The slope is the acceleration">
              <Eq src='a = [ Δ v | Δ t ] = [ 14 − 6 | 6 − 2 ] = [ 8 | 4 ] = 2 "m/s²"' />
            </Step>
            <Step title="The intercept is the starting velocity">
              <Eq src={['v = u + a · t', '6 = u + 2 · 2 ,  u = 2 "m/s"']} />
            </Step>
            <Step title="The area is the distance">
              <Eq src='x = [ 6 + 14 | 2 ] · 4 = 40 "m"' />
            </Step>
          </ol>
          <Answer>The acceleration is 2 m/s², the car started at 2 m/s, and it covered 40 m between 2 s and 6 s. The area is a trapezoid, so its width times the average height.</Answer>
          <figure className="t-figure">
            <AreaVT title="Velocity against time for a straight line from 2 metres per second at the start to 14 metres per second after 6 seconds, with the area under it filling in" pts={[[0, 2], [6, 14]]} xmax={50} />
          </figure>
        </Example>

        <Example n={2} title="A derivative from first principles">
          <p className="ex-q">A body moves so that <M>x = 3 · t ^2</M> (in metres, with <M>t</M> in seconds). Find its velocity at any time, directly from the definition, and then at <M>t = 2 "s"</M>.</p>
          <Given items={['x = 3 · t ^2']} />
          <ol className="steps">
            <Step title="A small step in time">
              <Eq src='Δ x = 3 · ( t + Δ t ) ^2 − 3 · t ^2 = 6 · t · Δ t + 3 · ( Δ t ) ^2' />
            </Step>
            <Step title="Divide by the step">
              <Eq src='[ Δ x | Δ t ] = 6 · t + 3 · Δ t' />
            </Step>
            <Step title="Let the step shrink">
              <Eq src='v = lim _Δt→0 [ Δ x | Δ t ] = 6 · t' />
            </Step>
            <Step title="At 2 s">
              <Eq src='v = 6 · 2 = 12 "m/s"' />
            </Step>
          </ol>
          <Answer>v = 6t, so 12 m/s at t = 2 s. The power rule gives the same thing at once: 3 · 2 · t.</Answer>
          <figure className="t-figure">
            <DerivTrace kind="square" />
            <figcaption>The same idea for a plain parabola: the slope at each point is twice x.</figcaption>
          </figure>
        </Example>

        <Example n={3} title="Velocity and acceleration from a polynomial">
          <p className="ex-q">A particle has position <M>x = 4 · t ^3 − 6 · t ^2 + 2 · t + 1</M> (SI units). Find its velocity and acceleration at <M>t = 1 "s"</M>, and when the acceleration is zero.</p>
          <Given items={['x = 4 · t ^3 − 6 · t ^2 + 2 · t + 1']} />
          <ol className="steps">
            <Step title="Differentiate once">
              <Eq src='v = [ d x | d t ] = 12 · t ^2 − 12 · t + 2' />
            </Step>
            <Step title="Differentiate again">
              <Eq src='a = [ d v | d t ] = 24 · t − 12' />
            </Step>
            <Step title="At t = 1 s">
              <Eq src={['v = 12 − 12 + 2 = 2 "m/s"', 'a = 24 − 12 = 12 "m/s²"']} />
            </Step>
            <Step title="When is a zero?">
              <Eq src={['24 · t − 12 = 0 ,  t = 0.5 "s"', 'v = 12 · 0.25 − 12 · 0.5 + 2 = − 1 "m/s"']} />
            </Step>
          </ol>
          <Answer>At t = 1 s the velocity is 2 m/s and the acceleration is 12 m/s². The acceleration is zero at t = 0.5 s, when the velocity is −1 m/s, the lowest it ever gets.</Answer>
          <figure className="t-figure">
            <DerivTrace />
          </figure>
        </Example>

        <Example n={4} title="How high does the ball go?">
          <p className="ex-q">A ball thrown up has height <M>y = 20 · t − 5 · t ^2</M> (in metres, with <M>t</M> in seconds). Find the greatest height, and when it returns to the ground.</p>
          <Given items={['y = 20 · t − 5 · t ^2']} />
          <ol className="steps">
            <Step title="The turning point: velocity zero">
              <Eq src={['v = [ d y | d t ] = 20 − 10 · t', '20 − 10 · t = 0 ,  t = 2 "s"']} />
            </Step>
            <Step title="Height then">
              <Eq src='y = 20 · 2 − 5 · 2 ^2 = 40 − 20 = 20 "m"' />
            </Step>
            <Step title="Maximum or minimum?">
              <Eq src='[ d ^2 y | d t ^2 ] = − 10 < 0' />
              <p>The second derivative is negative, so this is a maximum.</p>
            </Step>
            <Step title="Back on the ground">
              <Eq src='20 · t − 5 · t ^2 = 0 ,  t · ( 20 − 5 · t ) = 0 ,  t = 4 "s"' />
            </Step>
          </ol>
          <Answer>The greatest height is 20 m, reached at 2 s. The ball is back on the ground at 4 s, twice as long as it took to reach the top.</Answer>
          <figure className="t-figure">
            <MotionGraphs />
          </figure>
        </Example>

        <Example n={5} title="Integrating a changing acceleration">
          <p className="ex-q">A particle starts from rest at the origin with acceleration <M>a = 6 · t</M> (SI units). Find its velocity and position after 2 s.</p>
          <Given items={['a = 6 · t', 'v ( 0 ) = 0', 'x ( 0 ) = 0']} />
          <ol className="steps">
            <Step title="Integrate to get velocity">
              <Eq src='v = ∫ 6 · t · d t = 3 · t ^2 + C ,  C = 0' />
            </Step>
            <Step title="Integrate again for position">
              <Eq src='x = ∫ 3 · t ^2 · d t = t ^3 + C ,  C = 0' />
            </Step>
            <Step title="Put in t = 2 s">
              <Eq src={['v = 3 · 2 ^2 = 12 "m/s"', 'x = 2 ^3 = 8 "m"']} />
            </Step>
          </ol>
          <Answer>After 2 s the velocity is 12 m/s and the position is 8 m. Both constants are zero because the particle started at rest at the origin. The shaded area below is the 8 m.</Answer>
          <figure className="t-figure">
            <AreaVT title="Velocity against time for a particle whose velocity is three t squared; the area under the curve up to 2 seconds is 8 metres" pts={CUBIC} xmax={8} loop={9} />
          </figure>
        </Example>

        <Example n={6} title="The area under a trapezoid graph">
          <p className="ex-q">A car speeds up uniformly from rest to 20 m/s in 5 s, then holds 20 m/s for 10 s. How far does it go, and what is its average speed?</p>
          <Given items={['"first stage" = 5 "s" ,  0 → 20 "m/s"', '"second stage" = 10 "s" ,  20 "m/s"']} />
          <ol className="steps">
            <Step title="Triangle: the speeding up">
              <Eq src='x _1 = [ 1 | 2 ] · 5 · 20 = 50 "m"' />
            </Step>
            <Step title="Rectangle: the steady stretch">
              <Eq src='x _2 = 20 · 10 = 200 "m"' />
            </Step>
            <Step title="Add them">
              <Eq src='x = 50 + 200 = 250 "m"' />
            </Step>
            <Step title="Average speed: total distance over total time">
              <Eq src='v _avg = [ 250 | 15 ] = 16.7 "m/s"' />
            </Step>
          </ol>
          <Answer>The car travels 250 m, and its average speed is 16.7 m/s, which is less than 20 m/s because of the slower speeding-up stage.</Answer>
          <figure className="t-figure">
            <AreaVT title="Velocity against time for a car that speeds up for 5 seconds and then cruises for 10 seconds, with the area under the graph filling in to 250 metres" pts={[[0, 0], [5, 20], [15, 20]]} xmax={250} loop={12} />
          </figure>
        </Example>

        <Example n={7} title="The small-angle approximation at 5 degrees">
          <p className="ex-q">Use the small-angle approximations to estimate <M>sin 5°</M> and <M>cos 5°</M>, and find the percentage error in <M>sin</M>.</p>
          <Given items={['θ = 5°']} />
          <ol className="steps">
            <Step title="Convert to radians">
              <Eq src='θ = 5 × [ π | 180 ] = 0.08727 "rad"' />
            </Step>
            <Step title="The sine">
              <Eq src='sin 5° ≈ θ = 0.08727' />
              <p>The calculator gives 0.08716.</p>
              <Eq src='"error" = [ 0.08727 − 0.08716 | 0.08716 ] = 0.0013 ,  0.13 "%"' />
            </Step>
            <Step title="The cosine">
              <Eq src='cos 5° ≈ 1 − [ θ ^2 | 2 ] = 1 − 0.00381 = 0.99619' />
            </Step>
          </ol>
          <Answer>sin 5° is about 0.0873, only 0.13 % too large. And cos 5° is about 0.9962, which agrees with the calculator&rsquo;s 0.99619 to five digits.</Answer>
          <figure className="t-figure">
            <SmallAngle />
          </figure>
        </Example>

        <Example n={8} title="Gravity high above the ground">
          <p className="ex-q">Find g at a height of 32 km above the Earth, where <M>g = 9.8 "m/s²"</M> at the surface and the Earth&rsquo;s radius is 6400 km. Also estimate <M>√[ 1.02 ]</M> without a calculator.</p>
          <Given items={['h = 32 "km"', 'R = 6400 "km"', 'g = 9.8 "m/s²"']} />
          <ol className="steps">
            <Step title="The small number">
              <Eq src='[ h | R ] = [ 32 | 6400 ] = 0.005' />
            </Step>
            <Step title="Expand the power">
              <Eq src='g′ = g · ( 1 + [ h | R ] ) ^−2 ≈ g · ( 1 − [ 2 · h | R ] ) = 9.8 · ( 1 − 0.010 ) = 9.70 "m/s²"' />
            </Step>
            <Step title="Check with the exact formula">
              <Eq src='[ 9.8 | 1.005 ^2 ] = 9.70 "m/s²"' />
            </Step>
            <Step title="The square root">
              <Eq src='√[ 1.02 ] = ( 1 + 0.02 ) ^½ ≈ 1 + [ 0.02 | 2 ] = 1.01' />
            </Step>
          </ol>
          <Answer>g falls to 9.70 m/s², about 1 % less than at the ground, and the approximation matches the exact value. The square root is 1.01; the true value is 1.00995.</Answer>
          <figure className="t-figure">
            <TangentApprox title="The curve for one plus x to the power minus two with its tangent line near x equals zero; the two stay close for small x" ns={[-2]} xlo={-0.5} xhi={0.5} loop={9} />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Any two points give the slope at a point" wrong={'v = [ Δ x | Δ t ] "from two far-apart points"'} fig={<Secant />}>
            Between two points on a curve you get the <em>average</em> slope. The slope at a point needs the tangent: let the second point come right up to the first.
          </Mistake>
          <Mistake title="Forgetting to lower the power" wrong={'[ d | d x ] x ^2 = x'} fig={<DerivTrace kind="square" />}>
            The power rule brings the power <em>down</em> as a factor and then lowers it by one: the derivative of <M>x ^2</M> is <M>2 · x</M>. The figure shows the slope doubling the distance along.
          </Mistake>
          <Mistake title="Using degrees in the small-angle approximation" wrong={'sin 5° ≈ 5'} fig={<SmallAngle />}>
            The rule <M>sin θ ≈ θ</M> holds only when <M>θ</M> is in radians. In radians 5° is 0.0873, and that is the number to use.
          </Mistake>
          <Mistake title="Dropping the constant of integration" wrong={'∫ a · d t = a · t'} fig={<ConstantC />}>
            Many functions share the same derivative, so integrating gives <M>a · t + C</M>. The constant is the starting value, <M>u</M>, which you find from what you know at <M>t = 0</M>.
          </Mistake>
          <Mistake title="Using the binomial approximation for a big x" wrong={'( 1 + x ) ^n ≈ 1 + n · x "for" x = 2'} fig={<TangentApprox title="The curve for the square root of one plus x with its tangent line over a wide range of x: the two agree only near zero and separate badly further out" ns={[0.5]} xlo={-0.9} xhi={2.5} loop={9} />}>
            The tangent line fits the curve only near <M>x = 0</M>. For a large <M>x</M> the next terms matter, and the error is large. Use it only when <M>x</M> is much smaller than 1.
          </Mistake>
          <Mistake title="Zero velocity means zero acceleration" wrong={'v = 0 → a = 0'} fig={<MotionGraphs />}>
            At the top of a throw the velocity is zero for an instant, but it is still changing, at minus 10 m/s every second. The acceleration is the slope of the velocity graph, and that slope is not zero there.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Slope is a rate, area is a total, and near a point a curve is a line.</p>
        <p className="closing-sub">Three ideas, used over and over. Every chapter that follows leans on at least one of them.</p>
      </footer>
    </ChapterShell>
  );
}
