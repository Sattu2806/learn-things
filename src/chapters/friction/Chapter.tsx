import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Fig } from '../kit/Anim';
import { Mistake, Mistakes } from '../kit/Mistake';
import { CarStop, LimitScene, PullAngle, PullScene, PushUpScene, Rolling, SlideScene, StackScene, Surfaces, TiltScene, Tyre, TwoBlocks, TwoSlopes, Walking } from './FrictionFigs';

/** Friction: static and kinetic, on the flat, on slopes, at an angle, and between stacked blocks. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'What is friction?', group: 'Theory' },
  { id: 'static', title: 'Static friction adjusts itself', group: 'Theory' },
  { id: 'limit', title: 'The limit: μs · N', group: 'Theory' },
  { id: 'kinetic', title: 'Once it slides', group: 'Theory' },
  { id: 'graph', title: 'The friction graph', group: 'Theory' },
  { id: 'repose', title: 'The angle of repose', group: 'Theory' },
  { id: 'slope', title: 'Down a slope and up it', group: 'Theory' },
  { id: 'angle', title: 'Pulling and pushing at an angle', group: 'Theory' },
  { id: 'move', title: 'Walking, driving, rolling', group: 'Theory' },
  { id: 'stack', title: 'One block on another', group: 'Theory' },
  { id: 'life', title: 'Less friction, more friction', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="friction" sections={SECTIONS} sideTitle="Friction" sideLead="The force that holds things still, lets us walk, and slows everything down: static and kinetic friction, slopes, angles and stacked blocks.">
      <header className="article-head">
        <span className="kicker">Physics · Laws of motion</span>
        <h1 className="article-title">Why does a heavy box not move until you push hard enough?</h1>
        <p className="article-lead">Push a box a little and it stays put. Push harder and, all at once, it lurches forward. Friction is behind both: a force that is clever enough to match your push, up to a limit.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="What is friction?" />
        <p>
          <strong>Friction</strong> is the force between two surfaces in contact that resists one sliding over the other. It acts <em>along</em> the surfaces, and it points against the sliding, or against the sliding that would happen if friction were not there.
        </p>
        <p>
          Even a polished surface is rough when magnified: it is a landscape of tiny peaks and valleys. Where two surfaces touch, the peaks of one settle into the valleys of the other and lock. To slide, the top surface has to ride up over the bumps (or shear them off), and that costs force.
        </p>
        <Fig caption="Magnified, the bumps interlock. The top body has to rise over each one, so a force is needed to keep it sliding.">
          <Surfaces title="Two rough surfaces seen under a microscope: the top body is pushed along and rises and falls over the bumps of the bottom one" />
        </Fig>
        <p>
          Pressing the surfaces together locks more bumps, so friction grows with the <strong>normal force</strong> <M>N</M>, the push at right angles to the surfaces. Friction itself is parallel to the surfaces; <M>N</M> is perpendicular. They are two parts of the same contact force.
        </p>
        <Note label="Two kinds">When the surfaces are not sliding, the force is <strong>static friction</strong>. When they are sliding, it is <strong>kinetic friction</strong>. They behave differently, and the next sections take them one at a time.</Note>
      </section>

      <section className="t-section" id="t-static">
        <SectionHead n={no('static')} title="Static friction adjusts itself" />
        <p>
          Push a heavy box gently and nothing happens. The box is at rest, so the forces on it balance: friction must be exactly as large as your push, and the other way. Push twice as hard and friction doubles. Static friction is a <em>response</em>: it is only as big as it needs to be.
        </p>
        <Fig caption="The pull F grows steadily. The friction f grows with it, arrow for arrow, until the block breaks free.">
          <PullScene title="A block is pulled by a growing force; the friction arrow grows to match, until the block breaks free" m={10} />
        </Fig>
        <Eq src='f = F  "(while the block is at rest)"' />
        <p>
          That cannot go on for ever. Friction has a largest value it can reach, and once your push goes past it the block starts to move.
        </p>
      </section>

      <section className="t-section" id="t-limit">
        <SectionHead n={no('limit')} title="The limit: μs · N" />
        <p>
          The largest static friction the surfaces can give is called <strong>limiting friction</strong>. Experiment shows it is proportional to the normal force:
        </p>
        <Eq src='f _max = μ _s · N'>
          <span className="eq-note">μs is the coefficient of static friction: a pure number that depends on the two surfaces</span>
        </Eq>
        <p>
          So at any moment, while the block is still at rest,
        </p>
        <Eq src='f ≤ μ _s · N' />
        <p>
          The equals sign holds only at the very edge of slipping. Everywhere else friction is smaller, and you find it from the balance of forces, not from the formula. Double the load on a block and <M>N</M> doubles, more bumps lock, and the limit doubles too.
        </p>
        <Fig caption="A second 20 kg block is added: N doubles, so the largest friction the floor can give doubles as well.">
          <LimitScene title="A second block is added on top; the normal force and the limit of friction both double" />
        </Fig>
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Surfaces (approximate)</th>
                <th scope="col">
                  <M>μ _s</M>
                </th>
                <th scope="col">
                  <M>μ _k</M>
                </th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['Rubber on dry concrete', '1.0', '0.8'],
                  ['Steel on steel', '0.74', '0.57'],
                  ['Wood on wood', '0.5', '0.3'],
                  ['Glass on glass', '0.94', '0.4'],
                  ['Rubber on wet concrete', '0.7', '0.5'],
                  ['Ice on ice', '0.1', '0.03'],
                ] as const
              ).map(([a, b, c]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td>{b}</td>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-kinetic">
        <SectionHead n={no('kinetic')} title="Once it slides" />
        <p>
          When the surfaces slide over each other the friction is <strong>kinetic</strong> (or sliding) friction. It has a fixed size, no longer adjusting to your push:
        </p>
        <Eq src='f _k = μ _k · N' />
        <p>
          For most pairs of surfaces <M>μ _k</M> is a little smaller than <M>μ _s</M>. That is why it takes more force to start a box moving than to keep it moving. Notice what is <em>not</em> in the formula: the speed and the area of contact. Within ordinary limits, sliding fast or slow gives the same friction.
        </p>
        <Fig caption="The same block dragged slowly and quickly: the same friction. Only N and the surfaces matter.">
          <TwoBlocks title="Two identical blocks pulled over the floor, one slowly and one fast, with friction arrows of equal length" kind="speed" N={196} muk={0.4} />
        </Fig>
      </section>

      <section className="t-section" id="t-graph">
        <SectionHead n={no('graph')} title="The friction graph" />
        <p>
          Put it all together by plotting the friction against the applied force. The graph has three parts:
        </p>
        <ul className="t-list">
          <li>
            <strong>Rising line at 45°.</strong> The block is at rest and <M>f = F</M>.
          </li>
          <li>
            <strong>The peak</strong> at <M>μ _s · N</M>: the limit. Beyond it the block moves.
          </li>
          <li>
            <strong>A drop and then a flat line</strong> at <M>μ _k · N</M>: kinetic friction, whatever the pull.
          </li>
        </ul>
        <Fig caption="The dot is the pair (F, f) at this moment. It climbs the 45° line, drops at the peak, and then runs flat.">
          <PullScene title="The block and the friction graph drawn together: friction rises with the pull, peaks, drops, and stays constant" m={10} graph />
        </Fig>
        <p>
          After the drop, any pull bigger than <M>μ _k · N</M> gives an acceleration <M>a = ( F − μ _k · N ) / m</M>. A pull of exactly <M>μ _k · N</M> keeps the block going at a steady speed.
        </p>
      </section>

      <section className="t-section" id="t-repose">
        <SectionHead n={no('repose')} title="The angle of repose" />
        <p>
          Tilt a plank slowly with a block on it. At first the block holds, then, at one particular angle, it slips. On a slope the weight splits into a part <em>along</em> the slope, <M>m · g · sin θ</M>, and a part <em>into</em> the slope, <M>m · g · cos θ</M>. The slope pushes back with <M>N = m · g · cos θ</M>.
        </p>
        <Fig caption="While it holds, friction equals mg sin θ, the dashed limit grows with θ, and when the limit is reached the block goes.">
          <TiltScene title="A plank tilts up; the block holds until tan theta reaches mu s and then slides" mus={0.5} muk={0.35} maxTheta={40} />
        </Fig>
        <p>While the block is at rest, friction balances the pull of gravity along the slope, and it can be no more than the limit:</p>
        <Eq src={['f = m · g · sin θ', 'f ≤ μ _s · N = μ _s · m · g · cos θ']} />
        <p>The block is just about to slip when the two are equal. Divide both sides by <M>m · g · cos θ</M>:</p>
        <Eq src='tan θ = μ _s'>
          <span className="eq-note">θ is called the angle of repose</span>
        </Eq>
        <p>
          The mass cancelled. Heavy or light, the block starts to slide at the same angle, which is a handy way to measure <M>μ _s</M> with nothing but a plank and a protractor.
        </p>
      </section>

      <section className="t-section" id="t-slope">
        <SectionHead n={no('slope')} title="Down a slope and up it" />
        <p>
          Once the slope is steeper than the angle of repose, the block slides and friction becomes kinetic, <M>f = μ _k · N = μ _k · m · g · cos θ</M>, pointing <em>up</em> the slope. Newton's second law along the slope:
        </p>
        <Eq src={['m · a = m · g · sin θ − μ _k · m · g · cos θ', 'a = g · ( sin θ − μ _k · cos θ )']} />
        <p>
          Again the mass cancels. With no friction at all <M>a = g · sin θ</M>; friction takes away <M>μ _k · g · cos θ</M>. Along the perpendicular direction nothing accelerates, so <M>N = m · g · cos θ</M>.
        </p>
        <Fig caption="A 35° slope with μk = 0.25. On the right are the forces: weight, its two parts (dashed), N and f. Result: a = 3.61 m/s² down the slope.">
          <SlideScene title="A block slides down a 35 degree slope while its free body diagram is built up: weight, normal force and friction" angle={35} muk={0.25} />
        </Fig>
        <p>
          Now push the block <em>up</em> the slope at a steady speed. The block moves up, so friction points <em>down</em> the slope, along with the weight component. Your push has to beat both:
        </p>
        <Eq src='F = m · g · sin θ + μ _k · m · g · cos θ' />
        <Fig caption="Going up, friction flips to point down the slope: F must supply mg sin θ and μk mg cos θ.">
          <PushUpScene title="A block is pushed up a slope at constant speed with the push, the weight component and friction drawn" angle={30} mu={0.3} />
        </Fig>
        <Note label="Rule">Friction opposes the <em>sliding</em>, so its direction flips when the block moves the other way. Always draw the direction first, then the size.</Note>
      </section>

      <section className="t-section" id="t-angle">
        <SectionHead n={no('angle')} title="Pulling and pushing at an angle" />
        <p>
          Pull a box with a rope at an angle <M>θ</M> above the horizontal. The rope has an upward part <M>F · sin θ</M>, which takes some of the weight off the floor. So <M>N</M> is <em>smaller</em> than <M>m · g</M>, and so is the friction. Push the box instead, with a force angled <em>down</em> into the floor, and the downward part makes <M>N</M> bigger.
        </p>
        <Fig caption="Same box, same 30°. Pulling lifts a little of the weight (N is smaller). Pushing adds to it (N is larger).">
          <PullAngle title="A box pulled at an angle has a smaller normal force; the same box pushed at an angle has a larger one" />
        </Fig>
        <Eq src={['pulling: N = m · g − F · sin θ', 'pushing: N = m · g + F · sin θ']} />
        <p>
          The horizontal part <M>F · cos θ</M> is what moves the box. For a steady speed, <M>F · cos θ = μ · N</M>, which gives a different <M>F</M> for pulling and for pushing (Example 4 works it out). This is why it is easier to pull a loaded sledge than to push it.
        </p>
      </section>

      <section className="t-section" id="t-move">
        <SectionHead n={no('move')} title="Walking, driving, rolling" />
        <p>
          Friction is not only a nuisance; without it you could not walk. When you walk, your planted foot pushes the ground <em>backward</em>. By Newton's third law the ground pushes your foot <em>forward</em>, and that force is static friction. It is friction that moves you ahead.
        </p>
        <Fig caption="Solid arrow: friction on you, forward. Dashed: your foot on the ground, backward. The planted foot does not slide.">
          <Walking title="A person walks; the planted foot has a friction arrow pointing forward and the ground gets a backward push" />
        </Fig>
        <p>
          The same is true of a car. The engine turns the driven wheels, so the bottom of the tyre tries to slide <em>backward</em> over the road. The road pushes it forward with static friction, since the bottom of a rolling tyre is momentarily at rest on the road. When you brake, the tyre tries to turn more slowly than the car moves, so the road's friction points <em>backward</em>.
        </p>
        <Fig caption="Driving: friction on the tyre points forward. Braking: it points backward. In both cases it is static friction, up to μs · N.">
          <Tyre title="A car speeds up and then brakes; friction on the tyres points forward and then backward" />
        </Fig>
        <p>
          A rolling wheel with <em>no</em> driving or braking needs almost no friction at all. A small <strong>rolling friction</strong> still exists, because wheel and surface deform slightly. The surface is squashed ahead of the wheel, so the normal force acts a little ahead of the centre and resists the turning. It is written <M>f = μ _r · N</M>, with <M>μ _r</M> of order 0.01 for a tyre: far smaller than sliding friction. That is the whole point of the wheel.
        </p>
        <Fig caption="A soft road dents ahead of the wheel and N shifts forward. The wheel slows, but only slowly.">
          <Rolling title="A wheel rolls over a soft surface which is dented ahead of the contact point, shifting the normal force forward" />
        </Fig>
      </section>

      <section className="t-section" id="t-stack">
        <SectionHead n={no('stack')} title="One block on another" />
        <p>
          Put a small block on top of a bigger one and pull the bottom block along. What is friction doing between them? The top block has no pull of its own, so the <em>only</em> horizontal force on it is friction from the bottom block. Friction here points <em>forward</em>: it drags the top block along. The bottom block feels the equal and opposite friction, backward.
        </p>
        <Fig caption="While both move together, the top block's acceleration is a = F / (m + M), and friction on it is f = m · a. Past the limit, the top block slips back.">
          <StackScene title="A force pulls the bottom block; the top block moves along with it until the friction limit is reached and it starts to slip back" />
        </Fig>
        <p>
          <strong>Together:</strong> both blocks have the same acceleration, and the top one gets it from friction, <M>f = m · a ≤ μ _s · m · g</M>. So the most they can accelerate together is
        </p>
        <Eq src={['a _max = μ _s · g', 'F _max = ( m + M ) · μ _s · g']}>
          <span className="eq-note">F is the force on the bottom block, with a smooth floor</span>
        </Eq>
        <p>
          <strong>Slipping:</strong> beyond that, friction stays at <M>μ _k · m · g</M>, the top block accelerates at <M>μ _k · g</M>, and the bottom block (pulled harder) gets away from it.
        </p>
      </section>

      <section className="t-section" id="t-life">
        <SectionHead n={no('life')} title="Less friction, more friction" />
        <p>
          Everyday engineering is largely about managing friction.
        </p>
        <Fig caption="A film of oil keeps the two surfaces apart, so the bumps no longer lock and the friction drops.">
          <Surfaces title="The same two surfaces with oil added: the bumps no longer catch and the friction arrow shrinks" oil />
        </Fig>
        <ul className="t-list">
          <li>
            <strong>To reduce it:</strong> oil and grease, polishing, streamlining, air cushions, and above all <em>rolling instead of sliding</em> (wheels and ball bearings).
          </li>
          <li>
            <strong>To increase it:</strong> rough soles and tyre treads, spikes on running shoes, sand on an icy road, chalk or rosin on the hands, and pressing the surfaces together harder.
          </li>
        </ul>
        <Note label="Remember">Without friction nails would slip out, knots would untie, and you could not pick up a pencil. Friction is a friend that sometimes needs to be turned down.</Note>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Static friction (at rest)', 'f ≤ μ _s · N'],
                  ['Limiting friction', 'f _max = μ _s · N'],
                  ['Kinetic friction (sliding)', 'f _k = μ _k · N'],
                  ['Rolling friction', 'f _r = μ _r · N'],
                  ['Normal force on the flat', 'N = m · g'],
                  ['Normal force on a slope', 'N = m · g · cos θ'],
                  ['Gravity along a slope', 'm · g · sin θ'],
                  ['Angle of repose', 'tan θ = μ _s'],
                  ['Sliding down a slope', 'a = g · ( sin θ − μ _k · cos θ )'],
                  ['Pushed up at constant speed', 'F = m · g · ( sin θ + μ _k · cos θ )'],
                  ['Pulled at angle θ above horizontal', 'N = m · g − F · sin θ'],
                  ['Pushed at angle θ below horizontal', 'N = m · g + F · sin θ'],
                  ['Pulling at a steady speed', 'F = [ μ _k · m · g | cos θ + μ _k · sin θ ]'],
                  ['Stacked blocks, most acceleration', 'a _max = μ _s · g'],
                  ['Stacked blocks, largest force', 'F _max = ( m + M ) · μ _s · g'],
                  ['Braking acceleration', 'a = μ · g'],
                  ['Stopping distance', 'd = [ v ^2 | 2 · μ · g ]'],
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
                  ['f', 'Friction force, along the surfaces', 'N'],
                  ['N', 'Normal force, at right angles to the surfaces', 'N'],
                  ['μ _s', 'Coefficient of static friction', 'none'],
                  ['μ _k', 'Coefficient of kinetic friction (usually smaller)', 'none'],
                  ['μ _r', 'Coefficient of rolling friction (much smaller)', 'none'],
                  ['θ', 'Angle of the slope, or of the pull', '°'],
                  ['g', 'Gravitational field strength, 9.8', 'm/s²'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{unit === 'N' || unit === 'm/s²' ? <M>{`"${unit}"`}</M> : unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />
        <Example n={1} title="Starting and keeping a box moving">
          <p className="ex-q">A 20 kg box is on a level floor with <M>μ _s = 0.5</M> and <M>μ _k = 0.4</M>. What horizontal force starts it moving, and what force keeps it moving at a steady speed? What is its acceleration if you keep pulling with the starting force?</p>
          <Given items={['m = 20 "kg"', 'μ _s = 0.5', 'μ _k = 0.4', 'g = 9.8 "m/s²"']} />
          <ol className="steps">
            <Step title="Normal force">
              <Eq src='N = m · g = 20 · 9.8 = 196 "N"' />
            </Step>
            <Step title="Force to start it: the limit of static friction">
              <Eq src='F _start = μ _s · N = 0.5 · 196 = 98 "N"' />
            </Step>
            <Step title="Force to keep it going: kinetic friction">
              <Eq src='F _keep = μ _k · N = 0.4 · 196 = 78.4 "N"' />
            </Step>
            <Step title="If you keep pulling with 98 N">
              <Eq src='a = [ F − f _k | m ] = [ 98 − 78.4 | 20 ] = 0.98 "m/s²"' />
            </Step>
          </ol>
          <Answer>It takes 98 N to start the box, but only 78.4 N to keep it moving at a steady speed. Pulling on with 98 N makes it accelerate at 0.98 m/s².</Answer>
          <Fig caption="The pull has to reach 98 N before the box moves. After that, 78.4 N of friction is all that is left to beat.">
            <PullScene title="A 20 kilogram box pulled with a growing force: friction matches the pull up to 98 newtons, then drops to 78.4 newtons" m={20} mus={0.5} muk={0.4} />
          </Fig>
        </Example>

        <Example n={2} title="The angle of repose">
          <p className="ex-q">A block rests on a board for which <M>μ _s = 0.6</M>. The board is slowly tilted. At what angle does the block start to slip?</p>
          <Given items={['μ _s = 0.6']} />
          <ol className="steps">
            <Step title="Condition for slipping">
              <p>At the point of slipping, friction is at its limit, which gives the angle of repose.</p>
              <Eq src='tan θ = μ _s = 0.6' />
            </Step>
            <Step title="Solve for the angle">
              <Eq src='θ = arctan 0.6 = 31.0°' />
            </Step>
          </ol>
          <Answer>The block slips at 31.0°. The mass of the block makes no difference.</Answer>
          <Fig caption="The block holds until tan θ reaches 0.6 (31.0°) and then slides.">
            <TiltScene title="A board tilts up; a block with mu s of 0.6 starts sliding at 31 degrees" mus={0.6} muk={0.45} maxTheta={40} />
          </Fig>
        </Example>

        <Example n={3} title="Sliding down a 30° slope">
          <p className="ex-q">A block slides down a 30° slope with <M>μ _k = 0.2</M>. Find its acceleration, and compare it with a frictionless slope.</p>
          <Given items={['θ = 30°', 'μ _k = 0.2', 'g = 9.8 "m/s²"']} />
          <ol className="steps">
            <Step title="Forces along the slope">
              <p>Gravity pulls down the slope with <M>m · g · sin θ</M>. Kinetic friction, <M>μ _k · m · g · cos θ</M>, points up the slope.</p>
              <Eq src='m · a = m · g · sin θ − μ _k · m · g · cos θ' />
            </Step>
            <Step title="Cancel the mass">
              <Eq src='a = g · ( sin θ − μ _k · cos θ )' />
            </Step>
            <Step title="Put in the numbers">
              <Eq src='a = 9.8 · ( sin 30° − 0.2 · cos 30° ) = 9.8 · ( 0.500 − 0.173 ) = 3.20 "m/s²"' />
            </Step>
            <Step title="Compare with no friction">
              <Eq src='a _0 = g · sin 30° = 4.90 "m/s²"' />
            </Step>
          </ol>
          <Answer>The block accelerates down the slope at 3.20 m/s², compared with 4.90 m/s² without friction.</Answer>
          <Fig caption="Forces for the block: friction is small, so most of mg sin θ goes into acceleration.">
            <SlideScene title="A block slides down a 30 degree slope at 3.2 metres per second squared with its forces drawn" angle={30} muk={0.2} />
          </Fig>
        </Example>

        <Example n={4} title="Pulling a sledge at an angle">
          <p className="ex-q">A 40 kg sledge is pulled at a steady speed by a rope at 30° above the horizontal. The coefficient of kinetic friction is 0.15. Find the pull, and the normal force. How does the pull compare with pulling horizontally?</p>
          <Given items={['m = 40 "kg"', 'μ _k = 0.15', 'θ = 30°']} />
          <ol className="steps">
            <Step title="Vertical: no acceleration">
              <Eq src='N + F · sin θ = m · g' />
            </Step>
            <Step title="Horizontal: steady speed, so forces balance">
              <Eq src='F · cos θ = μ _k · N = μ _k · ( m · g − F · sin θ )' />
            </Step>
            <Step title="Solve for F">
              <Eq src={['F = [ μ _k · m · g | cos θ + μ _k · sin θ ]', 'F = [ 0.15 · 40 · 9.8 | 0.866 + 0.15 · 0.5 ] = [ 58.8 | 0.941 ] = 62.5 "N"']} />
            </Step>
            <Step title="The normal force">
              <Eq src='N = 392 − 62.5 · 0.5 = 361 "N"' />
            </Step>
            <Step title="Compare">
              <p>A horizontal pull needs <M>μ _k · m · g = 58.8 "N"</M>. Pushing at the same 30° (so the force presses down) needs 74.3 N.</p>
            </Step>
          </ol>
          <Answer>The pull is 62.5 N and the normal force is 361 N, which is less than the weight (392 N). Pulling at 30° needs a little more force than pulling flat (58.8 N), but pushing at 30° is worse (74.3 N).</Answer>
          <Fig caption="The rope's upward part takes weight off the floor, so N and friction are smaller than for a flat box.">
            <PullAngle title="A sledge is pulled at 30 degrees; the rope force splits into horizontal and vertical parts and the normal force is smaller than the weight" mode="pull" />
          </Fig>
        </Example>

        <Example n={5} title="Two stacked blocks">
          <p className="ex-q">A 2 kg block lies on a 4 kg block. The coefficient of friction between the blocks is 0.3, and the floor under the 4 kg block is smooth. A horizontal force <M>F</M> pulls the lower block. What is the largest <M>F</M> for which the top block does not slip? What is the friction on the top block when <M>F = 12 "N"</M>?</p>
          <Given items={['m = 2 "kg"', 'M = 4 "kg"', 'μ = 0.3']} />
          <ol className="steps">
            <Step title="Largest acceleration of the top block">
              <p>Friction is the only horizontal force on it, and it is at most <M>μ · m · g</M>.</p>
              <Eq src='a _max = [ μ · m · g | m ] = μ · g = 0.3 · 9.8 = 2.94 "m/s²"' />
            </Step>
            <Step title="Both blocks must share this acceleration">
              <Eq src='F _max = ( m + M ) · a _max = ( 2 + 4 ) · 2.94 = 17.6 "N"' />
            </Step>
            <Step title="Check F = 12 N (below the limit)">
              <Eq src={['a = [ F | m + M ] = [ 12 | 6 ] = 2.00 "m/s²"', 'f = m · a = 2 · 2.00 = 4.00 "N"']} />
              <p>That is below the limit <M>μ · m · g = 5.88 "N"</M>, so they move together.</p>
            </Step>
          </ol>
          <Answer>The blocks move together as long as F is at most 17.6 N. For F = 12 N, both accelerate at 2.00 m/s² and the friction on the top block is 4.00 N, forward.</Answer>
          <Fig caption="The pull climbs; the friction on the top block climbs with it until F reaches 17.6 N, and then the top block slips.">
            <StackScene title="A pull on the lower block increases; the top block moves with it until 17.6 newtons and then slips" m={2} M={4} mu={0.3} />
          </Fig>
        </Example>

        <Example n={6} title="How far does a car skid?">
          <p className="ex-q">A car on a level road brakes hard with its wheels locked from 20 m/s (72 km/h). Find the stopping distance on a dry road (<M>μ = 0.7</M>) and on a wet one (<M>μ = 0.3</M>).</p>
          <Given items={['v = 20 "m/s"', 'μ _dry = 0.7', 'μ _wet = 0.3']} />
          <ol className="steps">
            <Step title="Deceleration from friction">
              <p>Friction is the only horizontal force: <M>μ · m · g = m · a</M>, so the mass cancels.</p>
              <Eq src='a = μ · g' />
            </Step>
            <Step title="Stopping distance from v² = 2·a·d">
              <Eq src='d = [ v ^2 | 2 · μ · g ]' />
            </Step>
            <Step title="Dry road">
              <Eq src='d = [ 20 ^2 | 2 · 0.7 · 9.8 ] = [ 400 | 13.72 ] = 29.2 "m"' />
            </Step>
            <Step title="Wet road">
              <Eq src='d = [ 20 ^2 | 2 · 0.3 · 9.8 ] = [ 400 | 5.88 ] = 68.0 "m"' />
            </Step>
          </ol>
          <Answer>29.2 m on a dry road and 68.0 m on a wet one, more than twice as far. The time to stop is <M>v / ( μ · g )</M>: 2.92 s and 6.80 s.</Answer>
          <Fig caption="Both cars brake at the marker. The car on the wet road needs more than twice the distance.">
            <CarStop title="Two cars brake from 20 metres per second, one on a dry road and one on a wet road, and the wet one stops much farther on" />
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Friction always equals μs · N" wrong='f = μ _s · N  "always"' fig={<PullScene title="A block pulled gently stays at rest; the friction equals the pull, which is less than the limit" m={10} top={0.55} height={230} loop={6} />}>
            <M>μ _s · N</M> is only the <em>largest</em> friction. A block that is not about to slip feels exactly what is needed to balance the pull: here, less than half the limit.
          </Mistake>
          <Mistake title="Friction depends on the contact area" wrong='f = μ · N · A' fig={<TwoBlocks title="The same block lying on a wide face and on a narrow face has the same friction" kind="area" N={98} muk={0.4} />}>
            Lay the block on its large face or on its small one: the weight is the same, so <M>N</M> is the same, and so is <M>f = μ · N</M>. A smaller area just presses harder on each spot.
          </Mistake>
          <Mistake title="Friction always acts backward" wrong='f  "is always against the motion"' fig={<StackScene title="The top block is carried along by friction, which points forward on it" top={0.8} height={230} loop={6} />}>
            Friction opposes the <em>sliding between the surfaces</em>. The top block here is dragged forward <em>by</em> friction; so are your feet when you walk. Check which way the surfaces would slip without it.
          </Mistake>
          <Mistake title="N is always m · g" wrong='N = m · g  "on a slope"' fig={<TiltScene title="As a plank tilts, the normal force shrinks while the weight stays the same" show="normal" slide={false} maxTheta={45} height={250} loop={8} />}>
            On a slope <M>N = m · g · cos θ</M>. The steeper it gets, the smaller <M>N</M>, and the smaller the friction. (Pulling a box up at an angle also changes <M>N</M>.)
          </Mistake>
          <Mistake title="Friction on a slope is always μ · m · g · cos θ" wrong='f = μ _s · m · g · cos θ  "at rest"' fig={<TiltScene title="Below the angle of repose, the friction equals the weight component along the slope, which is less than the limit" mus={0.6} slide={false} maxTheta={22} height={250} loop={8} />}>
            That is the <em>limit</em>. Before slipping, friction is just <M>m · g · sin θ</M>: whatever balances gravity along the slope. Use <M>μ · N</M> only at the point of slipping, or when sliding.
          </Mistake>
          <Mistake title="Heavier blocks slide down faster" wrong='a _heavy > a _light' fig={<TwoSlopes title="A light block and a heavy block slide down identical slopes side by side and arrive together" />}>
            Weight and friction both scale with the mass, so it cancels: <M>a = g · ( sin θ − μ _k · cos θ )</M> for any block. (The same is true for a braking car: <M>a = μ · g</M>.)
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Friction pushes back exactly as much as it has to, up to a limit, and then lets go.</p>
        <p className="closing-sub">
          Next: with friction in your toolbox, you can solve any problem with forces on a surface. The chapters on work and energy ask what friction does to the energy.
        </p>
      </footer>
    </ChapterShell>
  );
}
