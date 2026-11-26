import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Fig } from '../kit/Anim';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Atwood, BusPendulum, CartRace, EarthMoon, FirstLawCart, GalileoSlopes, GlideNoForce, ImpulseAreas, LampTriangle, LiftScale, NormalForce, NormalOnSlope, PairNotCancel, PuckVsBook, PushedBlocks, PushedBox, RopeTension, SkaterPush, SlopeFBD, StringTension, TableHang, WallBounce } from './figs';

/** Newton’s laws of motion: force, momentum, free-body diagrams and connected bodies, with animated diagrams and worked examples. */

const SECTIONS: NoteSection[] = [
  { id: 'inertia', title: 'Inertia and the first law', group: 'Theory' },
  { id: 'second', title: 'Momentum and the second law', group: 'Theory' },
  { id: 'impulse', title: 'Impulse', group: 'Theory' },
  { id: 'third', title: 'The third law', group: 'Theory' },
  { id: 'fbd', title: 'Free-body diagrams', group: 'Theory' },
  { id: 'forces', title: 'Weight, normal force and tension', group: 'Theory' },
  { id: 'connected', title: 'Connected bodies', group: 'Theory' },
  { id: 'atwood', title: 'The Atwood machine', group: 'Theory' },
  { id: 'lift', title: 'Apparent weight in a lift', group: 'Theory' },
  { id: 'equilibrium', title: 'Equilibrium of a particle', group: 'Theory' },
  { id: 'frames', title: 'Frames and pseudo-forces', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="newton" sections={SECTIONS} sideTitle="Newton’s laws" sideLead="Three laws that explain how forces change motion: inertia, F = m·a, action and reaction, and how to use them on blocks, strings, slopes and lifts.">
      <header className="article-head">
        <span className="kicker">Physics · Forces and motion</span>
        <h1 className="article-title">Why does anything change its motion?</h1>
        <p className="article-lead">A puck on ice glides on and on, but a book on a table stops at once. The difference is a force. This chapter builds Newton’s three laws from that one idea, and then uses them on blocks, strings, slopes and lifts.</p>
      </header>

      <section className="t-section" id="t-inertia">
        <SectionHead n={no('inertia')} title="Inertia and the first law" />
        <p>
          For nearly two thousand years people believed that a body needs a push to <em>keep</em> moving, because that is what a cart or a book seems to do. Galileo saw the catch. A book stops because the table rubs against it. Take the rubbing away, and the motion carries on.
        </p>
        <p>
          His test was a pair of slopes. A ball let go on one slope climbs the other to the same height, however gentle the second slope is. The gentler it is, the farther the ball has to go to get back up. On a flat floor it can never get back up, so it keeps rolling forever.
        </p>
        <Fig caption="Galileo’s slopes. Make the second slope gentler and gentler: the ball travels farther each time. On a flat floor it never stops.">
          <GalileoSlopes />
        </Fig>
        <p>
          This tendency of a body to keep its state of motion is called <strong>inertia</strong>. It gives us Newton’s <strong>first law</strong>:
        </p>
        <Eq src='F _net = 0 → v = "constant"'>
          <span>A body stays at rest, or keeps moving in a straight line at constant speed, unless a net force acts on it.</span>
        </Eq>
        <p>
          Here <M>F _net</M> is the <em>vector sum</em> of all the forces on the body. Forces that cancel count as no force at all. Rest is just the special case <M>v = 0</M>.
        </p>
        <Fig caption="Same shove, same speed. The puck has no force along its motion, so it goes on. Friction on the book acts against the motion until it stops.">
          <PuckVsBook />
        </Fig>
        <p>
          So a body at constant velocity is <em>not</em> a body with “no forces”. It may have many, as long as they add up to zero. A cart pushed at a steady speed has the push balanced by friction. Make the push bigger and the balance is broken: now the velocity changes.
        </p>
        <Fig caption="Balanced forces mean steady velocity. As soon as the push beats the friction, the velocity arrow starts to grow.">
          <FirstLawCart />
        </Fig>
        <Note label="Mass">The more massive a body, the harder it is to change its motion. Mass is the measure of inertia. It is the same everywhere: on Earth, on the Moon, in space.</Note>
      </section>

      <section className="t-section" id="t-second">
        <SectionHead n={no('second')} title="Momentum and the second law" />
        <p>
          The first law says what happens with no net force. The second law says what a net force does. To state it well we first need <strong>momentum</strong>, the “quantity of motion” of a body: its mass times its velocity.
        </p>
        <Eq src='p = m · v' />
        <p>
          Momentum <M>p</M> is a vector that points the way the body moves. A heavy lorry and a light car at the same speed have very different momentum. Newton’s <strong>second law</strong> says the net force is the rate at which momentum changes:
        </p>
        <Eq src='F _net = [ Δp | Δt ]  ,  F _net = [ dp | dt ]' />
        <p>
          If the mass stays constant, <M>Δp = m · Δv</M>, and the law becomes the form we use all the time:
        </p>
        <Eq src='F _net = m · a'>
          <span>The acceleration points the same way as the net force. One newton is the force that gives 1 kg an acceleration of 1 m/s².</span>
        </Eq>
        <Fig caption="Three carts released together. Double the force (middle): double the acceleration. Double the mass (bottom): half the acceleration.">
          <CartRace />
        </Fig>
        <p>
          Read the law as a recipe: add up <em>all</em> the forces on the body as vectors, divide by its mass, and you have its acceleration. The form <M>F = [ dp | dt ]</M> is the more general one. It still works when the mass changes, as for a rocket that burns fuel, where <M>F = m · a</M> alone does not.
        </p>
      </section>

      <section className="t-section" id="t-impulse">
        <SectionHead n={no('impulse')} title="Impulse" />
        <p>
          Rearrange the second law for a force that acts for a time <M>Δt</M>. The product of force and time is called the <strong>impulse</strong>, and it equals the change of momentum:
        </p>
        <Eq src='J = F · Δt = Δp = m · v _2 − m · v _1'>
          <span>For a force that varies, <M>F</M> here is the average force. The impulse is the area under the force–time graph.</span>
        </Eq>
        <p>
          When a ball hits a wall and bounces back, its momentum is reversed. The change <M>Δp</M> is the <em>difference</em> of two vectors, so it points away from the wall and is bigger than either momentum alone.
        </p>
        <Fig caption="The momentum arrows before and after the bounce. The change in momentum is the arrow from the tip of the first to the tip of the second.">
          <WallBounce />
        </Fig>
        <p>
          Now the useful part. To bring a moving body to rest the change of momentum is fixed, <M>Δp = m · v</M>. So <M>F · Δt</M> is fixed, and a longer time means a smaller force:
        </p>
        <Eq src='F = [ Δp | Δt ]' />
        <Fig caption="Two ways to stop the same ball: a short hard stop and a long soft one have the same area (the same impulse), but very different peak forces.">
          <ImpulseAreas F1={30} T1={0.1} F2={10} T2={0.3} height={240} />
        </Fig>
        <p>
          That is why a fielder pulls the hands back while catching a fast cricket ball, why you bend your knees when you land from a jump, and why gym mats, helmets, car crumple zones and airbags are soft: they stretch the stopping time and shrink the force.
        </p>
      </section>

      <section className="t-section" id="t-third">
        <SectionHead n={no('third')} title="The third law" />
        <p>
          Forces never come alone. When body A pushes or pulls body B, B pushes or pulls A back. Newton’s <strong>third law</strong>:
        </p>
        <Eq src='F _AB = − F _BA'>
          <span>If A exerts a force on B, then B exerts an equal and opposite force on A.</span>
        </Eq>
        <p>The two forces of such an <strong>action–reaction pair</strong> always:</p>
        <ul className="t-list">
          <li>have the same size and opposite directions,</li>
          <li>are the same kind of force (both contact, both gravity, …),</li>
          <li>appear and vanish together,</li>
          <li>
            act on <strong>different bodies</strong>.
          </li>
        </ul>
        <Fig caption="Two skaters push off. Each pushes the other with the same force, but the forces act on different skaters. The lighter skater gains the greater speed.">
          <SkaterPush />
        </Fig>
        <p>
          The last point matters most. Because the two forces act on different bodies, they never cancel each other. You walk because your foot pushes the ground backward and the ground pushes you forward. A rocket pushes gas down and the gas pushes the rocket up. In the push-off above the momenta are equal and opposite, so <M>m _A · v _A + m _B · v _B = 0</M>: the total momentum stays at zero.
        </p>
        <Note label="Weight and the normal force">A book on a table has its weight and the normal force. They are equal and opposite, but they are <em>not</em> a third-law pair: both act on the book. The partner of the Earth pulling the book down is the book pulling the Earth up.</Note>
      </section>

      <section className="t-section" id="t-fbd">
        <SectionHead n={no('fbd')} title="Free-body diagrams" />
        <p>
          Every force problem starts with a <strong>free-body diagram</strong>: a sketch of one body with arrows for the forces acting <em>on it</em>. Follow these steps every time:
        </p>
        <ol className="t-list">
          <li>Choose one body and draw it alone, as a dot or a box.</li>
          <li>Draw the weight <M>m · g</M> straight down, from the body.</li>
          <li>Wherever something touches the body, draw the contact forces: normal force, tension, friction, pushes.</li>
          <li>Label each arrow. Draw only forces acting on this body, never the forces it exerts.</li>
          <li>Choose axes that suit the motion (along and across a slope).</li>
          <li>Resolve any slanted force into components along the axes.</li>
          <li>
            Write <M>F _net = m · a</M> along each axis.
          </li>
        </ol>
        <Fig caption="A block on a rough slope, built step by step. The weight is split into a part along the slope and a part across it.">
          <SlopeFBD />
        </Fig>
        <p>
          For the block at rest, the forces cancel along each axis:
        </p>
        <Eq src={['N = m · g · cos θ', 'f = m · g · sin θ']}>
          <span>Across the slope the normal force balances the part of the weight pressing into the slope. Along the slope, friction balances the part pulling the block down. If there is no friction, the block accelerates down the slope with <M>a = g · sin θ</M>.</span>
        </Eq>
        <Note label="No ma arrow">The product <M>m · a</M> is not a force. Never draw it on the diagram. It is what the forces add up to.</Note>
      </section>

      <section className="t-section" id="t-forces">
        <SectionHead n={no('forces')} title="Weight, normal force and tension" />
        <p>
          <strong>Weight</strong> is the pull of the Earth on a body: <M>W = m · g</M>, with <M>g ≈ 9.8 "m/s²"</M> near the surface. Mass is what you are made of and does not change; weight depends on where you are.
        </p>
        <p>
          The <strong>normal force</strong> <M>N</M> is the push of a surface on a body. It is always perpendicular to the surface, and it is as big as it needs to be to stop the body sinking in. It is not fixed at <M>m · g</M>: press down on the block and the table pushes back harder.
        </p>
        <Fig caption="The normal force follows the situation. Pressed down it grows; pulled up it shrinks. Only when nothing else acts vertically does it equal mg.">
          <NormalForce />
        </Fig>
        <p>
          <strong>Tension</strong> <M>T</M> is the pull of a string, rope or rod. A string can only pull, never push, and it pulls along its own length. For a <em>light</em> string, with negligible mass, the tension is the same at every point. If it runs over a smooth pulley, the pulley changes its direction but not its size.
        </p>
        <Fig caption="A light string pulls the block with T and, equally, pulls the hand back with T. The block’s acceleration is a = T / m.">
          <StringTension />
        </Fig>
      </section>

      <section className="t-section" id="t-connected">
        <SectionHead n={no('connected')} title="Connected bodies" />
        <p>
          When bodies touch, or are joined by a taut string, they move together and share the same acceleration. The method:
        </p>
        <ol className="t-list">
          <li>Draw a free-body diagram for each body.</li>
          <li>Write <M>F _net = m · a</M> for each, with the same <M>a</M>.</li>
          <li>Solve the equations together.</li>
        </ol>
        <p>
          <strong>Two blocks pushed together.</strong> A force <M>F</M> pushes A, which pushes B. Treat both as one body of mass <M>m _A + m _B</M>: the contact forces are an internal third-law pair and cancel. Then look at B alone to find the contact force.
        </p>
        <Eq src={['a = [ F | m _A + m _B ]', 'N = m _B · a']}>
          <span>The contact force <M>N</M> is the only horizontal force on B. It is smaller than <M>F</M>, because A needs some of the push to accelerate itself.</span>
        </Eq>
        <Fig caption="Blocks of 2 kg and 3 kg pushed with 10 N. Both accelerate at 2 m/s². The contact force on B is 3 × 2 = 6 N; B pushes back on A with the same 6 N.">
          <PushedBlocks mA={2} mB={3} F={10} />
        </Fig>
        <p>
          <strong>A block on a table, pulled by a hanging mass.</strong> The string over the pulley has one tension <M>T</M>. For the table block <M>M</M> the only horizontal force is <M>T</M>, and for the hanging mass <M>m</M> the net force downward is <M>m · g − T</M>:
        </p>
        <Eq src={['T = M · a', 'm · g − T = m · a']}>
          <span>
            Adding them: <M>a = [ m · g | M + m ]</M> and <M>T = [ M · m · g | M + m ]</M>. The tension is less than <M>m · g</M>, because the hanging mass is accelerating downward.
          </span>
        </Eq>
        <Fig caption="The hanging mass m pulls the whole system along. T is smaller than mg, so the net force on the hanging mass points down.">
          <TableHang M={3} m={1} />
        </Fig>
      </section>

      <section className="t-section" id="t-atwood">
        <SectionHead n={no('atwood')} title="The Atwood machine" />
        <p>
          Two masses <M>m _1 &gt; m _2</M> hang from a string over a smooth light pulley. The heavier one goes down, the lighter goes up, with the same acceleration <M>a</M> and the same tension <M>T</M> in the string. Taking the direction of motion as positive for each:
        </p>
        <Eq src={['m _1 · g − T = m _1 · a', 'T − m _2 · g = m _2 · a']}>
          <span>Add the two equations and the tension cancels.</span>
        </Eq>
        <Eq src={['a = [ ( m _1 − m _2 ) · g | m _1 + m _2 ]', 'T = [ 2 · m _1 · m _2 · g | m _1 + m _2 ]']} />
        <Fig caption="5 kg and 3 kg: a = 2.45 m/s², T = 36.8 N. The tension is between the two weights (29.4 N and 49 N), because one mass speeds up and the other must not.">
          <Atwood m1={5} m2={3} />
        </Fig>
        <p>
          Two checks. If <M>m _1 = m _2</M> then <M>a = 0</M> and <M>T = m · g</M>: nothing moves. If <M>m _2 = 0</M> then <M>a = g</M> and <M>T = 0</M>: free fall.
        </p>
      </section>

      <section className="t-section" id="t-lift">
        <SectionHead n={no('lift')} title="Apparent weight in a lift" />
        <p>
          A scale does not measure your weight. It measures the normal force <M>N</M> of the platform on you, and that is what you feel as “weight”. Stand on a scale in a lift that accelerates upward with acceleration <M>a</M>. Taking up as positive:
        </p>
        <Eq src={['N − m · g = m · a', 'N = m · ( g + a )']}>
          <span>Here <M>a</M> is positive for upward acceleration, negative for downward.</span>
        </Eq>
        <Fig caption="A 60 kg person in a lift: speeding up, steady, slowing down, then free fall. The reading changes with the acceleration, not with the speed.">
          <LiftScale />
        </Fig>
        <ul className="t-list">
          <li>Accelerating up (speeding up going up, or slowing down going down): <M>N &gt; m · g</M>, you feel heavier.</li>
          <li>Steady speed, up or down, or at rest: <M>N = m · g</M>.</li>
          <li>Accelerating down (speeding up going down, or slowing down going up): <M>N &lt; m · g</M>, you feel lighter.</li>
          <li>Free fall, <M>a = − g</M>: <M>N = 0</M>. You are weightless, though gravity is still pulling you.</li>
        </ul>
        <p>
          Astronauts in orbit feel weightless for exactly this reason: they and their spacecraft are in free fall together.
        </p>
      </section>

      <section className="t-section" id="t-equilibrium">
        <SectionHead n={no('equilibrium')} title="Equilibrium of a particle" />
        <p>
          A particle is in <strong>equilibrium</strong> when its acceleration is zero. By the second law the net force is zero, so in components
        </p>
        <Eq src={['F _net = 0', 'ΣF _x = 0  ,  ΣF _y = 0']} />
        <p>
          Three forces in equilibrium are special. They add to zero, so placed head to tail they close into a triangle. If you know the angles, the sine rule on that triangle gives <strong>Lami’s theorem</strong>: each force is proportional to the sine of the angle between the <em>other two</em>.
        </p>
        <Eq src='[ T _1 | sin α ] = [ T _2 | sin β ] = [ W | sin γ ]'>
          <span><M>α</M> is the angle between <M>T _2</M> and <M>W</M>, <M>β</M> between <M>T _1</M> and <M>W</M>, and <M>γ</M> between <M>T _1</M> and <M>T _2</M>.</span>
        </Eq>
        <Fig caption="A lamp on two strings. The three forces on the knot cancel: head to tail they return to the start.">
          <LampTriangle a1={45} a2={45} />
        </Fig>
        <p>
          Lami only works for exactly three forces meeting at a point. With more forces, or when you do not want to find angles, resolve into <M>x</M> and <M>y</M> components and set each sum to zero.
        </p>
      </section>

      <section className="t-section" id="t-frames">
        <SectionHead n={no('frames')} title="Frames and pseudo-forces" />
        <p>
          Newton’s laws hold in an <strong>inertial frame</strong>: one that is not itself accelerating, such as the ground (to a good approximation). A bus that speeds up is not an inertial frame.
        </p>
        <p>
          Watch a ball hang from the roof of a bus that is speeding up. From the ground the story is simple: the string’s tension and the weight add up to a net force forward, <M>m · a</M>, which is what accelerates the ball with the bus. From inside the bus the ball is at rest, yet leaning back. To keep <M>F _net = 0</M> in that frame we must invent an extra force, a <strong>pseudo-force</strong> (or fictitious force):
        </p>
        <Eq src='F _ps = − m · a _frame'>
          <span>It points opposite to the frame’s acceleration. It has no source and no reaction partner; it is a bookkeeping device for working in an accelerating frame.</span>
        </Eq>
        <Fig caption="Inside the speeding-up bus the ball leans back until T, W and the pseudo-force −ma balance. Then tan θ = a / g.">
          <BusPendulum />
        </Fig>
        <p>
          The same trick explains the lift: in the lift’s frame, an extra downward pseudo-force <M>m · a</M> makes you feel heavier when it accelerates up. The “centrifugal force” you feel on a roundabout is another pseudo-force. In the ground frame no such forces exist, and the three laws work as they stand.
        </p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['First law', 'F _net = 0 → v = "constant"'],
                  ['Momentum', 'p = m · v'],
                  ['Second law', 'F _net = [ Δp | Δt ] = [ dp | dt ]'],
                  ['Constant mass', 'F _net = m · a'],
                  ['Impulse', 'J = F · Δt = Δp'],
                  ['Third law', 'F _AB = − F _BA'],
                  ['Weight', 'W = m · g'],
                  ['Block on a slope, across', 'N = m · g · cos θ'],
                  ['Block on a slope, along', 'm · g · sin θ − f = m · a'],
                  ['Pushed blocks', 'a = [ F | m _A + m _B ] ,  N = m _B · a'],
                  ['Table block and hanging mass', 'a = [ m · g | M + m ] ,  T = [ M · m · g | M + m ]'],
                  ['Atwood machine, acceleration', 'a = [ ( m _1 − m _2 ) · g | m _1 + m _2 ]'],
                  ['Atwood machine, tension', 'T = [ 2 · m _1 · m _2 · g | m _1 + m _2 ]'],
                  ['Apparent weight in a lift', 'N = m · ( g + a )'],
                  ['Equilibrium', 'F _net = 0 ,  ΣF _x = 0 ,  ΣF _y = 0'],
                  ['Lami’s theorem', '[ T _1 | sin α ] = [ T _2 | sin β ] = [ W | sin γ ]'],
                  ['Pseudo-force', 'F _ps = − m · a _frame'],
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
                  ['m', 'Mass: the measure of inertia', 'kg'],
                  ['F _net', 'Net force: the vector sum of all forces on the body', 'N'],
                  ['a', 'Acceleration, in the direction of the net force', 'm/s²'],
                  ['p', 'Momentum, m · v', 'kg m/s'],
                  ['J', 'Impulse, F · Δt', 'N s'],
                  ['W', 'Weight, m · g', 'N'],
                  ['N', 'Normal force from a surface, perpendicular to it', 'N'],
                  ['T', 'Tension in a string', 'N'],
                  ['f', 'Friction force, along the surface', 'N'],
                  ['g', 'Acceleration of free fall, 9.8', 'm/s²'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>
                    <M>{`"${unit}"`}</M>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="A pushed box">
          <p className="ex-q">A 20 kg box on a floor is pushed with a steady 100 N. Friction opposes the motion with 30 N. Find its acceleration, and its speed after 4 s from rest.</p>
          <Given items={['m = 20 "kg"', 'F = 100 "N"', 'f = 30 "N"']} />
          <ol className="steps">
            <Step title="Net force">
              <Eq src='F _net = F − f = 100 − 30 = 70 "N"' />
            </Step>
            <Step title="Acceleration">
              <Eq src='a = [ F _net | m ] = [ 70 | 20 ] = 3.5 "m/s²"' />
            </Step>
            <Step title="Speed after 4 s">
              <Eq src='v = a · t = 3.5 · 4 = 14 "m/s"' />
            </Step>
          </ol>
          <Answer>The net force is 70 N, the acceleration is 3.5 m/s² forward, and after 4 s the box moves at 14 m/s.</Answer>
          <Fig>
            <PushedBox />
          </Fig>
        </Example>

        <Example n={2} title="Catching a cricket ball">
          <p className="ex-q">A 0.16 kg cricket ball travelling at 25 m/s is caught and brought to rest. Find the average force on the hand if the catch takes 0.1 s, and if the fielder pulls the hands back so that it takes 0.5 s.</p>
          <Given items={['m = 0.16 "kg"', 'v = 25 "m/s"', 'Δt = 0.1 "s" or 0.5 "s"']} />
          <ol className="steps">
            <Step title="Change in momentum">
              <Eq src='Δp = 0 − m · v = − 0.16 · 25 = − 4.0 "kg m/s"'>
                <span>The size is 4.0 kg m/s, and the minus sign says it points against the original motion.</span>
              </Eq>
            </Step>
            <Step title="Impulse and force">
              <Eq src='F = [ Δp | Δt ]'>
                <span>For the hand the force on the ball is backward, so the ball pushes forward on the hand with the same size.</span>
              </Eq>
            </Step>
            <Step title="The two catches">
              <Eq src={['F = [ 4.0 | 0.1 ] = 40 "N"', 'F = [ 4.0 | 0.5 ] = 8 "N"']} />
            </Step>
          </ol>
          <Answer>40 N for the quick catch and 8 N for the slow one. Five times as long means one fifth of the force, which is why fielders “give” with the ball.</Answer>
          <Fig>
            <ImpulseAreas F1={40} T1={0.1} F2={8} T2={0.5} height={230} />
          </Fig>
        </Example>

        <Example n={3} title="Two blocks pushed together">
          <p className="ex-q">Blocks of 4 kg (A) and 6 kg (B) touch on a smooth floor. A horizontal 20 N force pushes A toward B. Find the acceleration and the force between the blocks.</p>
          <Given items={['m _A = 4 "kg"', 'm _B = 6 "kg"', 'F = 20 "N"']} />
          <ol className="steps">
            <Step title="Treat the pair as one body">
              <Eq src='a = [ F | m _A + m _B ] = [ 20 | 4 + 6 ] = 2 "m/s²"' />
            </Step>
            <Step title="Look at B alone">
              <Eq src='N = m _B · a = 6 · 2 = 12 "N"'>
                <span>Only the contact force pushes B, so it alone gives B its acceleration.</span>
              </Eq>
            </Step>
            <Step title="Check with A">
              <Eq src='F − N = 20 − 12 = 8 "N" = m _A · a = 4 · 2'>
                <span>The numbers agree, so the answer is consistent.</span>
              </Eq>
            </Step>
          </ol>
          <Answer>Both blocks accelerate at 2 m/s². The contact force is 12 N, less than the 20 N applied. A pushes B with 12 N, and B pushes A back with 12 N.</Answer>
          <Fig>
            <PushedBlocks mA={4} mB={6} F={20} />
          </Fig>
        </Example>

        <Example n={4} title="An Atwood machine">
          <p className="ex-q">Masses of 3 kg and 2 kg hang over a smooth light pulley. Find the acceleration and the tension in the string. Take <M>g = 9.8 "m/s²"</M>.</p>
          <Given items={['m _1 = 3 "kg"', 'm _2 = 2 "kg"', 'g = 9.8 "m/s²"']} />
          <ol className="steps">
            <Step title="One equation for each mass">
              <Eq src={['m _1 · g − T = m _1 · a', 'T − m _2 · g = m _2 · a']} />
            </Step>
            <Step title="Add them to find a">
              <Eq src='a = [ ( m _1 − m _2 ) · g | m _1 + m _2 ] = [ 1 · 9.8 | 5 ] = 1.96 "m/s²"' />
            </Step>
            <Step title="Put a back to find T">
              <Eq src='T = m _2 · ( g + a ) = 2 · ( 9.8 + 1.96 ) = 23.5 "N"'>
                <span>Check with the other mass: <M>m _1 · ( g − a ) = 3 · 7.84 = 23.5 "N"</M>.</span>
              </Eq>
            </Step>
          </ol>
          <Answer>The 3 kg mass goes down and the 2 kg mass goes up, both at 1.96 m/s². The tension is 23.5 N, between the two weights of 19.6 N and 29.4 N.</Answer>
          <Fig>
            <Atwood m1={3} m2={2} />
          </Fig>
        </Example>

        <Example n={5} title="A person in a lift">
          <p className="ex-q">A 60 kg person stands on a scale in a lift. What does the scale read when the lift accelerates upward at 2 m/s²? What if it accelerates downward at 2 m/s², or the cable snaps?</p>
          <Given items={['m = 60 "kg"', 'a = 2 "m/s²"', 'g = 9.8 "m/s²"']} />
          <ol className="steps">
            <Step title="Newton’s second law, up as positive">
              <Eq src='N − m · g = m · a'>
                <span>That is <M>N = m · ( g + a )</M>.</span>
              </Eq>
            </Step>
            <Step title="Accelerating up">
              <Eq src='N = 60 · ( 9.8 + 2 ) = 708 "N"' />
            </Step>
            <Step title="Accelerating down, and free fall">
              <Eq src={['N = 60 · ( 9.8 − 2 ) = 468 "N"', 'N = 60 · ( 9.8 − 9.8 ) = 0']} />
            </Step>
          </ol>
          <Answer>The scale reads 708 N going up (against 588 N at rest), 468 N when accelerating down, and 0 in free fall.</Answer>
          <Fig>
            <LiftScale segs={[{ a: 2, d: 1.8 }, { a: 0, d: 3 }]} loop={6} stillAt={1.4} />
          </Fig>
        </Example>

        <Example n={6} title="A lamp hanging from two strings">
          <p className="ex-q">A 2 kg lamp hangs from two strings fixed to the ceiling. One string makes 30° with the ceiling and the other 60°, on opposite sides. Find the tension in each.</p>
          <Given items={['m = 2 "kg"', 'W = m · g = 19.6 "N"', 'α = 30°  ,  β = 60°']} />
          <ol className="steps">
            <Step title="Name the angles between the forces">
              <p>
                The strings are at 30° and 60° to the horizontal, so they are 90° apart. Between <M>T _2</M> (the 60° string) and the weight is 150°, and between <M>T _1</M> (the 30° string) and the weight is 120°.
              </p>
            </Step>
            <Step title="Lami’s theorem">
              <Eq src='[ T _1 | sin 150° ] = [ T _2 | sin 120° ] = [ 19.6 | sin 90° ] = 19.6' />
            </Step>
            <Step title="Solve for each tension">
              <Eq src={['T _1 = 19.6 · 0.5 = 9.8 "N"', 'T _2 = 19.6 · 0.866 = 17.0 "N"']} />
            </Step>
            <Step title="Check horizontally and vertically">
              <Eq src={['T _1 · cos 30° = 8.49 "N" = T _2 · cos 60°', 'T _1 · sin 30° + T _2 · sin 60° = 4.9 + 14.7 = 19.6 "N"']} />
            </Step>
          </ol>
          <Answer>The 30° string carries 9.8 N and the steeper 60° string carries 17.0 N. The steeper string carries more of the load.</Answer>
          <Fig>
            <LampTriangle a1={30} a2={60} />
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="“A force is needed to keep it moving”" wrong='F _net = 0 → v = 0' fig={<GlideNoForce />}>
            A body keeps its velocity with <em>no net force</em>. A force is needed to <em>change</em> the velocity. The puck here has only weight and the normal force, which cancel, and it glides on.
          </Mistake>
          <Mistake title="“Action and reaction cancel, so nothing moves”" wrong={'F _AB + F _BA = 0 → "no acceleration"'} fig={<PairNotCancel />}>
            The two forces of a pair act on <em>different</em> bodies. Only forces on the same body can cancel. The block feels the push, so it accelerates.
          </Mistake>
          <Mistake title="“The normal force is always m·g”" wrong='N = m · g' fig={<NormalOnSlope />}>
            <M>N</M> is whatever the surface needs to supply. On a slope it is <M>m · g · cos θ</M>, smaller than the weight, and it changes if anything else pushes or pulls across the surface.
          </Mistake>
          <Mistake title="“The tension equals the weight”" wrong='T = m · g' fig={<RopeTension />}>
            Only when the hanging body is not accelerating. Speeding up, <M>T &gt; m · g</M>; slowing down, <M>T &lt; m · g</M>. In an Atwood machine <M>T</M> is never equal to either weight.
          </Mistake>
          <Mistake title="“Going up means feeling heavier”" wrong={'"going up" → N > m · g'} fig={<LiftScale segs={[{ a: 2, d: 1.2 }, { a: 0, d: 4 }]} loop={6.4} stillAt={3.2} height={260} />}>
            The reading depends on the <em>acceleration</em>, not the velocity. Once the lift moves up at a steady speed, the scale reads <M>m · g</M> again.
          </Mistake>
          <Mistake title="“Mass and weight are the same”" wrong={'60 "kg" = 588 "N"'} fig={<EarthMoon />}>
            Mass is how much matter you have, in kg. Weight is a force, <M>m · g</M>, in newtons. On the Moon, where <M>g = 1.62 "m/s²"</M>, a 60 kg person still has a mass of 60 kg but weighs only 97 N.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">No net force, no change of motion; a net force changes momentum at the rate F = dp/dt.</p>
        <p className="closing-sub">Next: friction, the force that so often stands in the way, and what the laws say about motion in circles.</p>
      </footer>
    </ChapterShell>
  );
}
