import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Fig } from '../kit/Anim';
import { Mistake, Mistakes } from '../kit/Mistake';
import {
  BallUp,
  BrakingCars,
  CarryBag,
  CoasterEnergy,
  CosNotSin,
  Efficiency,
  Equilibria,
  FrictionDrain,
  GravitySign,
  KineticWork,
  Landscape,
  LiftBall,
  LiftMotor,
  LoopTheLoop,
  PendulumEnergy,
  PowerNotEnergy,
  PullAngle,
  PushBox,
  Routes,
  SignSweep,
  SlideBottom,
  SpeedSquared,
  SpringArea,
  SpringRelease,
  StairsPower,
} from './Scenes';

/** Work, energy and power: how forces move energy around, with animated diagrams and worked examples. */

const SECTIONS: NoteSection[] = [
  { id: 'work', title: 'What work means', group: 'Theory' },
  { id: 'angle', title: 'A force at an angle', group: 'Theory' },
  { id: 'sign', title: 'Positive, negative and zero work', group: 'Theory' },
  { id: 'variable', title: 'A force that changes', group: 'Theory' },
  { id: 'ke', title: 'Kinetic energy', group: 'Theory' },
  { id: 'pe', title: 'Potential energy', group: 'Theory' },
  { id: 'conservative', title: 'Conservative forces', group: 'Theory' },
  { id: 'conservation', title: 'Conservation of mechanical energy', group: 'Theory' },
  { id: 'friction', title: 'Where friction takes the energy', group: 'Theory' },
  { id: 'power', title: 'Power and efficiency', group: 'Theory' },
  { id: 'equilibrium', title: 'Force from the energy graph', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="energy" sections={SECTIONS} sideTitle="Work, energy and power" sideLead="How a force moves energy from place to place, why the total is always kept, and how fast it can be done.">
      <header className="article-head">
        <span className="kicker">Physics · Mechanics</span>
        <h1 className="article-title">Where does the energy go?</h1>
        <p className="article-lead">Pushing, lifting, braking and falling all move energy from one place to another. This chapter builds work, kinetic and potential energy, and power from one idea, and shows why energy is the easiest way to solve many problems.</p>
      </header>

      <section className="t-section" id="t-work">
        <SectionHead n={no('work')} title="What work means" />
        <p>
          In physics, <strong>work</strong> is what a force does when it moves something. Push a box and it moves along the floor: your force has done work on it. Push a wall as hard as you like and nothing moves: no work. For a steady force along the direction of motion,
        </p>
        <Eq src='W = F · s' />
        <p>
          where <M>F</M> is the force and <M>s</M> the distance moved. Work is measured in <strong>joules</strong>: one joule is the work done by a force of one newton over one metre.
        </p>
        <Eq src='1 "J" = 1 "N" · 1 "m"' />
        <Fig caption={<>The box moves twice as far, so the force does twice as much work: <M>W</M> grows steadily with the distance <M>s</M>.</>}>
          <PushBox />
        </Fig>
        <Note label="Remember">Work is done <em>by</em> a force <em>on</em> a body. It is a scalar: just a number, with no direction. A bigger force or a longer push both mean more work.</Note>
      </section>

      <section className="t-section" id="t-angle">
        <SectionHead n={no('angle')} title="A force at an angle" />
        <p>
          Often the force is not along the motion. Pull a sledge with a rope held above the ground: the rope tugs forward and a little upward. Only the part of the force <em>along the motion</em> moves the sledge forward. If the angle between the force and the displacement is <M>θ</M>, that part is <M>F · cos θ</M>, so
        </p>
        <Eq src='W = F · s · cos θ' />
        <Fig caption={<>The vertical part <M>F · sin θ</M> pulls up but the sledge does not move up, so it does no work.</>}>
          <PullAngle />
        </Fig>
        <p>
          This is a <strong>dot product</strong> of the force and displacement vectors, written <M>W = F · s</M> with a dot between two vectors. In components it is just as easy to use:
        </p>
        <Eq src='W = F _x · s _x + F _y · s _y + F _z · s _z'>
          <span>For example, a force <M>F = 3 î + 4 ĵ</M> (in newtons) moving a body by <M>s = 2 î + 1 ĵ</M> (in metres) does <M>W = 3 · 2 + 4 · 1 = 10 "J"</M>.</span>
        </Eq>
      </section>

      <section className="t-section" id="t-sign">
        <SectionHead n={no('sign')} title="Positive, negative and zero work" />
        <p>
          Because of the <M>cos θ</M>, work can have either sign. Watch the force arrow turn while the displacement stays the same:
        </p>
        <Fig caption={<>Within 90° of the motion the work is positive; at exactly 90° it is zero; beyond that it is negative.</>}>
          <SignSweep />
        </Fig>
        <ul className="t-list">
          <li>
            <strong>Positive work</strong> (<M>θ &lt; 90°</M>): the force helps the motion and adds energy to the body. Your push on a swing.
          </li>
          <li>
            <strong>Zero work</strong> (<M>θ = 90°</M>): the force is at right angles to the motion and changes only its direction. Gravity on a plane moving level, or the pull of a string on a ball going round.
          </li>
          <li>
            <strong>Negative work</strong> (<M>θ &gt; 90°</M>): the force opposes the motion and takes energy away. Friction on a sliding block does <M>W = − f · s</M>.
          </li>
        </ul>
      </section>

      <section className="t-section" id="t-variable">
        <SectionHead n={no('variable')} title="A force that changes" />
        <p>
          <M>W = F · s</M> assumes the force is steady. If it changes along the way, split the path into tiny steps where the force is almost constant, and add the little works <M>F · Δx</M>. On a graph of <M>F</M> against <M>x</M> each little work is a thin strip of area, so
        </p>
        <Eq src='W = "area under the F–x graph"' />
        <p>
          In calculus this is the integral <M>W = ∫ F · d x</M>. A spring is the classic case: squeezed by <M>x</M>, it pushes back with <M>F = k · x</M> (Hooke's law), where <M>k</M> is the spring constant in N/m. The graph is a straight line, and the area is a triangle:
        </p>
        <Fig caption={<>The shaded triangle grows as the spring is squeezed. Its area is the work done on the spring.</>}>
          <SpringArea />
        </Fig>
        <Eq src='W = [ 1 | 2 ] · x · ( k · x ) = ½ · k · x ^2' />
        <p>
          Doubling the squeeze makes the force twice as big <em>and</em> the distance twice as long, so the work is four times as much.
        </p>
      </section>

      <section className="t-section" id="t-ke">
        <SectionHead n={no('ke')} title="Kinetic energy" />
        <p>
          Work has to go somewhere. When a net force speeds a body up, the work becomes motion energy. Take a steady net force <M>F</M> on a mass <M>m</M> over a distance <M>s</M>. Newton's second law gives <M>a = F / m</M>, and the equation of motion gives <M>v ^2 = u ^2 + 2 · a · s</M>. Put them together:
        </p>
        <Eq src={['F · s = m · a · s = ½ · m · v ^2 − ½ · m · u ^2']} />
        <p>
          The quantity <M>½ · m · v ^2</M> is the <strong>kinetic energy</strong> <M>K</M>. The result is the <strong>work–energy theorem</strong>: the net work done on a body equals its change in kinetic energy.
        </p>
        <Eq src='W _net = ΔK = ½ · m · v ^2 − ½ · m · u ^2' />
        <Fig caption={<>The work bar and the kinetic energy bar rise together: every joule of work done becomes a joule of <M>K</M>.</>}>
          <KineticWork />
        </Fig>
        <p>
          It holds for any force, steady or not, and it never needs the time: that makes it the quickest tool for questions about speed and distance. Note that kinetic energy depends on the <em>square</em> of the speed, and it can never be negative.
        </p>
      </section>

      <section className="t-section" id="t-pe">
        <SectionHead n={no('pe')} title="Potential energy" />
        <p>
          Some work is stored, not turned into speed. Lift a ball slowly and the force you apply does work, but the ball ends up at rest. The energy is stored in the arrangement of ball and Earth, and it comes back as motion if you let go. This stored energy is <strong>potential energy</strong>. Near the Earth's surface the work needed to lift a mass <M>m</M> through a height <M>h</M> is <M>m · g · h</M>, so
        </p>
        <Eq src='U _g = m · g · h' />
        <Fig caption={<>The potential energy bar grows in proportion to the height. Where <M>h = 0</M> is a matter of choice: only changes in <M>U</M> matter.</>}>
          <LiftBall />
        </Fig>
        <p>
          A squeezed or stretched spring stores energy too. The work done on it is the area from the last section, so
        </p>
        <Eq src='U _s = ½ · k · x ^2' />
        <Fig caption={<>Squeezing stores energy in the spring; releasing it turns that energy into the kinetic energy of the block.</>}>
          <SpringRelease />
        </Fig>
        <p>
          The link between the two ideas: the work done <em>by</em> the conservative force (gravity, the spring) is the <em>loss</em> of potential energy.
        </p>
        <Eq src='W _c = − ΔU' />
      </section>

      <section className="t-section" id="t-conservative">
        <SectionHead n={no('conservative')} title="Conservative forces" />
        <p>
          Potential energy only makes sense for some forces. A force is <strong>conservative</strong> if the work it does between two points does not depend on the route taken. Equivalently, the work it does around any closed loop is zero.
        </p>
        <Fig caption={<>Gravity's work depends only on the height gained, so both bars end up equal. Friction's work grows with the length of the route.</>}>
          <Routes />
        </Fig>
        <ul className="t-list">
          <li>
            <strong>Conservative</strong>: gravity, spring force, electric force. They have a potential energy <M>U</M>, and the work is <M>− ΔU</M>.
          </li>
          <li>
            <strong>Non-conservative</strong>: friction, air resistance, a push from your hand or an engine. The work depends on the path, and there is no <M>U</M> for them. Friction takes energy away whichever way you go, even on a round trip.
          </li>
        </ul>
      </section>

      <section className="t-section" id="t-conservation">
        <SectionHead n={no('conservation')} title="Conservation of mechanical energy" />
        <p>
          If only conservative forces do work, then the work–energy theorem <M>W = ΔK</M> and the potential energy rule <M>W = − ΔU</M> say that <M>ΔK = − ΔU</M>. The total of kinetic plus potential energy, the <strong>mechanical energy</strong>, does not change:
        </p>
        <Eq src={['K + U = "constant"', 'K _1 + U _1 = K _2 + U _2']} />
        <Fig caption={<>At the lowest point all the energy is kinetic; at the ends of the swing it is all potential. The total bar never moves.</>}>
          <PendulumEnergy />
        </Fig>
        <p>
          This is a powerful shortcut: you can skip the path completely and compare just two moments. A body released from height <M>h</M> and sliding or falling without friction reaches the bottom with
        </p>
        <Eq src={['m · g · h = ½ · m · v ^2', 'v = √[ 2 · g · h ]']}>
          <span>The mass cancels, and so does the shape of the path: only the height drop matters.</span>
        </Eq>
        <Fig caption={<>On a roller coaster the car is fastest in the dips and slowest on the crests, and the total bar stays full.</>}>
          <CoasterEnergy />
        </Fig>
        <Fig caption={<>A ball thrown straight up: all kinetic at launch, all potential at the top, kinetic again on the way down.</>}>
          <BallUp />
        </Fig>
      </section>

      <section className="t-section" id="t-friction">
        <SectionHead n={no('friction')} title="Where friction takes the energy" />
        <p>
          When friction or any other non-conservative force acts, the mechanical energy changes by exactly the work that force does:
        </p>
        <Eq src='K _i + U _i + W _nc = K _f + U _f' />
        <p>
          Friction does negative work, so mechanical energy falls. It is not destroyed. The energy turns into thermal energy: the surfaces and the air get warmer. Counting that heat, the <em>total</em> energy of everything is always the same. For a block sliding on level ground with friction <M>f = μ · m · g</M>,
        </p>
        <Eq src='Q = f · d = μ · m · g · d' />
        <Fig caption={<>The kinetic energy bar drains while the heat bar fills by the same amount. The total never changes.</>}>
          <FrictionDrain />
        </Fig>
        <Note label="Remember">Energy is conserved <em>always</em>. What is not always conserved is <em>mechanical</em> energy. Keep an account of heat and sound as well and the books balance.</Note>
      </section>

      <section className="t-section" id="t-power">
        <SectionHead n={no('power')} title="Power and efficiency" />
        <p>
          Two machines can do the same work in very different times. <strong>Power</strong> is how fast the work is done:
        </p>
        <Eq src={['P = [ W | t ]', 'P = F · v']}>
          <span>The first is the average power. The second follows from <M>W = F · s</M>, since <M>s / t = v</M>, and gives the instant power for a force along the velocity.</span>
        </Eq>
        <p>
          The unit is the <strong>watt</strong>, one joule per second: <M>1 "W" = 1 "J/s"</M>. A horsepower is about 746 W, and a kilowatt-hour (the unit on your electricity bill) is an amount of energy, <M>1 "kWh" = 3.6 × 10 ^6 "J"</M>.
        </p>
        <Fig caption={<>The motor pulls with a force equal to the weight, at a steady speed. Power is that force times the speed.</>}>
          <LiftMotor />
        </Fig>
        <p>
          No machine turns all the power it takes in into useful work. The <strong>efficiency</strong> is the useful fraction:
        </p>
        <Eq src='η = [ P _out | P _in ]' />
        <Fig caption={<>An 80% efficient lift motor taking in 4900 W delivers 3920 W as useful lifting power; the rest warms the motor.</>}>
          <Efficiency />
        </Fig>
      </section>

      <section className="t-section" id="t-equilibrium">
        <SectionHead n={no('equilibrium')} title="Force from the energy graph" />
        <p>
          A potential energy curve <M>U</M> against position <M>x</M> holds all the information about the force. The force is minus the slope of the graph:
        </p>
        <Eq src='F = − [ dU | dx ]' />
        <p>
          So the force always points <em>downhill</em>, and is strongest where the curve is steepest. A ball rolling on such a landscape behaves like a body in this potential. With a little friction it loses energy and settles in a valley.
        </p>
        <Fig caption={<>The force arrow always points downhill. The ball ends at a stable valley, and could never rest on the hump.</>}>
          <Landscape />
        </Fig>
        <p>
          Where the slope is zero, the force is zero: these are the <strong>equilibrium</strong> points, <M>d U / d x = 0</M>. Nudge a body there and see what happens:
        </p>
        <Fig caption={<>Valley: the force points back, so it returns. Hilltop: the force points away, so it rolls off. Flat: no force at all, so it stays put.</>}>
          <Equilibria />
        </Fig>
        <ul className="t-list">
          <li>
            <strong>Stable</strong>: a minimum of <M>U</M>, with <M>[ d ^2 U | d x ^2 ] &gt; 0</M>. A small push is followed by a return.
          </li>
          <li>
            <strong>Unstable</strong>: a maximum of <M>U</M>, with <M>[ d ^2 U | d x ^2 ] &lt; 0</M>. A small push grows.
          </li>
          <li>
            <strong>Neutral</strong>: <M>U</M> is flat. A small push leaves the body in its new place.
          </li>
        </ul>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Work, force along the motion', 'W = F · s'],
                  ['Work, force at an angle', 'W = F · s · cos θ'],
                  ['Work in components', 'W = F _x · s _x + F _y · s _y'],
                  ['Work, changing force', 'W = ∫ F · d x'],
                  ['Spring force and work', 'F = k · x ,  W = ½ · k · x ^2'],
                  ['Kinetic energy', 'K = ½ · m · v ^2'],
                  ['Work–energy theorem', 'W _net = ΔK'],
                  ['Gravitational potential energy', 'U = m · g · h'],
                  ['Spring potential energy', 'U = ½ · k · x ^2'],
                  ['Conservative force', 'W = − ΔU'],
                  ['Mechanical energy conserved', 'K _1 + U _1 = K _2 + U _2'],
                  ['With non-conservative work', 'K _i + U _i + W _nc = K _f + U _f'],
                  ['Speed after falling a height h', 'v = √[ 2 · g · h ]'],
                  ['Heat from sliding friction', 'Q = f · d'],
                  ['Average power', 'P = [ W | t ]'],
                  ['Power from force and speed', 'P = F · v'],
                  ['Efficiency', 'η = [ P _out | P _in ]'],
                  ['Force from potential energy', 'F = − [ dU | dx ]'],
                  ['Equilibrium', '[ dU | dx ] = 0'],
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
                  ['W', 'Work', 'J'],
                  ['F', 'Force', 'N'],
                  ['s', 'Displacement', 'm'],
                  ['θ', 'Angle between force and displacement', ''],
                  ['K', 'Kinetic energy', 'J'],
                  ['U', 'Potential energy', 'J'],
                  ['k', 'Spring constant', 'N/m'],
                  ['x', 'Stretch or squeeze of a spring', 'm'],
                  ['P', 'Power', 'W'],
                  ['η', 'Efficiency (a fraction, or a percentage)', ''],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{unit ? <M>{`"${unit}"`}</M> : 'none'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Pulling a sledge">
          <p className="ex-q">A child pulls a sledge 20 m along level snow with a rope that pulls with 50 N at 30° above the ground. How much work does the pull do?</p>
          <Given items={['F = 50 "N"', 's = 20 "m"', 'θ = 30°']} />
          <ol className="steps">
            <Step title="Find the part of the force along the motion">
              <Eq src='F · cos θ = 50 · cos 30° = 43.3 "N"' />
            </Step>
            <Step title="Multiply by the distance">
              <Eq src='W = F · s · cos θ = 50 · 20 · 0.866 = 866 "J"' />
            </Step>
          </ol>
          <Answer>About 866 J. The upward part of the pull, 25 N, does no work because the sledge does not move up.</Answer>
          <Fig>
            <PullAngle F={50} theta={30} s={20} numbers />
          </Fig>
        </Example>

        <Example n={2} title="Speed at the bottom of a slide">
          <p className="ex-q">A child starts from rest at the top of a smooth slide 5 m high. How fast is the child going at the bottom? Ignore friction.</p>
          <Given items={['h = 5 "m"', 'u = 0', 'g = 9.8 "m/s²"']} />
          <ol className="steps">
            <Step title="Only gravity does work, so mechanical energy is conserved">
              <Eq src='m · g · h = ½ · m · v ^2' />
            </Step>
            <Step title="Cancel the mass and solve">
              <Eq src='v = √[ 2 · g · h ] = √[ 2 · 9.8 · 5 ] = √[ 98 ] = 9.90 "m/s"' />
            </Step>
          </ol>
          <Answer>9.90 m/s, about 36 km/h. It would be the same for any mass, and for any shape of smooth slide with the same height.</Answer>
          <Fig>
            <SlideBottom />
          </Fig>
        </Example>

        <Example n={3} title="A spring launches a block">
          <p className="ex-q">A spring with <M>k = 200 "N/m"</M> is squeezed by 0.1 m and released against a 0.5 kg block on a smooth floor. How much energy is stored, and how fast does the block leave the spring?</p>
          <Given items={['k = 200 "N/m"', 'x = 0.1 "m"', 'm = 0.5 "kg"']} />
          <ol className="steps">
            <Step title="Energy stored in the spring">
              <Eq src='U = ½ · k · x ^2 = ½ · 200 · 0.1 ^2 = 1 "J"' />
            </Step>
            <Step title="All of it becomes kinetic energy">
              <Eq src='½ · m · v ^2 = U' />
            </Step>
            <Step title="Solve for the speed">
              <Eq src='v = √[ [ 2 · U | m ] ] = √[ [ 2 · 1 | 0.5 ] ] = 2 "m/s"' />
            </Step>
          </ol>
          <Answer>1 J is stored, and the block leaves at 2 m/s.</Answer>
          <Fig>
            <SpringRelease numbers />
          </Fig>
        </Example>

        <Example n={4} title="Braking distance">
          <p className="ex-q">A 1000 kg car moving at 20 m/s brakes hard. The friction between tyres and road is <M>μ = 0.7</M>. Find the stopping distance, and compare it with a car going twice as fast.</p>
          <Given items={['m = 1000 "kg"', 'u = 20 "m/s"', 'μ = 0.7']} />
          <ol className="steps">
            <Step title="Friction force">
              <Eq src='f = μ · m · g = 0.7 · 1000 · 9.8 = 6860 "N"' />
            </Step>
            <Step title="Work–energy theorem: friction takes all the kinetic energy">
              <Eq src='− f · d = 0 − ½ · m · u ^2' />
            </Step>
            <Step title="Solve for d">
              <Eq src='d = [ ½ · m · u ^2 | f ] = [ 200 000 | 6860 ] = 29.2 "m"' />
              <p>The mass cancels, so in general <M>d = [ u ^2 | 2 · μ · g ]</M>.</p>
            </Step>
            <Step title="Twice the speed">
              <Eq src='d = [ 40 ^2 | 2 · 0.7 · 9.8 ] = 117 "m"' />
            </Step>
          </ol>
          <Answer>29.2 m at 20 m/s, and 117 m at 40 m/s: four times as far, because <M>d</M> goes as the square of the speed.</Answer>
          <Fig>
            <BrakingCars />
          </Fig>
        </Example>

        <Example n={5} title="Power of a person climbing stairs">
          <p className="ex-q">A 60 kg person walks up stairs that rise 3 m in 4 s. What is the average power used against gravity?</p>
          <Given items={['m = 60 "kg"', 'h = 3 "m"', 't = 4 "s"']} />
          <ol className="steps">
            <Step title="Work against gravity">
              <Eq src='W = m · g · h = 60 · 9.8 · 3 = 1764 "J"' />
            </Step>
            <Step title="Divide by the time">
              <Eq src='P = [ W | t ] = [ 1764 | 4 ] = 441 "W"' />
            </Step>
          </ol>
          <Answer>441 W, about 0.6 horsepower. Running up the same stairs in 2 s would take 882 W: same work, twice the power.</Answer>
          <Fig>
            <StairsPower />
          </Fig>
        </Example>

        <Example n={6} title="The loop-the-loop">
          <p className="ex-q">A small car rolls without friction down a ramp and round a vertical loop of radius <M>r</M>. From what height above the bottom must it start to stay on the track at the top? Find the number for <M>r = 5 "m"</M>.</p>
          <Given items={['r = 5 "m"', 'no friction']} />
          <ol className="steps">
            <Step title="At the top, the track pushes down with force N. The weight and N give the centripetal force">
              <Eq src='N + m · g = [ m · v ^2 | r ]' />
              <p>The car just stays on the track when <M>N = 0</M>, so the least speed at the top satisfies <M>v ^2 = g · r</M>.</p>
            </Step>
            <Step title="Energy: start at height h, top of loop is 2 r up">
              <Eq src='m · g · h = m · g · 2 · r + ½ · m · v ^2' />
            </Step>
            <Step title="Put in the minimum speed">
              <Eq src='h = 2 · r + [ v ^2 | 2 · g ] = 2 · r + [ r | 2 ] = 2.5 · r' />
            </Step>
            <Step title="The numbers for r = 5 m">
              <Eq src={['h = 2.5 · 5 = 12.5 "m"', 'v _top = √[ g · r ] = √[ 9.8 · 5 ] = 7.00 "m/s"', 'v _bottom = √[ 2 · g · h ] = √[ 2 · 9.8 · 12.5 ] = 15.7 "m/s"']} />
            </Step>
          </ol>
          <Answer>The car must start at least <M>2.5 · r</M> above the bottom, which is 12.5 m for a 5 m loop. At the top it moves at 7.00 m/s and the track force is just zero. Start lower, even at exactly <M>2 · r</M>, and it falls off the track.</Answer>
          <Fig>
            <LoopTheLoop />
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Work whenever there is a force and a distance" wrong="W = F · s" fig={<CarryBag />}>
            Only the part of the force along the motion counts. Carrying a bag at a steady height, the lifting force is at right angles to the motion, so <M>cos 90° = 0</M> and the work is zero.
          </Mistake>
          <Mistake title="Using sin instead of cos" wrong="W = F · s · sin θ" fig={<CosNotSin />}>
            <M>θ</M> is the angle between the force and the <em>displacement</em>. Measured from the direction of motion the work is <M>F · s · cos θ</M>. If your angle is measured from the vertical, use sin.
          </Mistake>
          <Mistake title="Kinetic energy goes with the speed" wrong="K ∝ v" fig={<SpeedSquared />}>
            <M>K = ½ · m · v ^2</M>. Double the speed and the kinetic energy is four times as much, which is why braking distances grow so fast.
          </Mistake>
          <Mistake title="Gravity always does positive work" wrong={'W _g > 0 "on the way up"'} fig={<GravitySign />}>
            Going up, gravity pulls against the motion, so it does negative work <M>− m · g · h</M>. Coming down it does positive work. Over a round trip the total is zero.
          </Mistake>
          <Mistake title="Friction destroys energy" wrong="energy lost" fig={<FrictionDrain compact />}>
            Energy cannot be destroyed. Mechanical energy is lost to friction, but it turns into heat. The total, including heat, is always the same.
          </Mistake>
          <Mistake title="Power and energy are the same" wrong="P = W" fig={<PowerNotEnergy />}>
            Power is work <em>per second</em>. Lift two loads to the same height and you do the same work, but the one lifted in half the time takes twice the power.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Work moves energy around, and the total is always kept.</p>
        <p className="closing-sub">
          Next: energy tells us how fast, but not which way. For that we need momentum and collisions, the second great conservation law.
        </p>
      </footer>
    </ChapterShell>
  );
}
