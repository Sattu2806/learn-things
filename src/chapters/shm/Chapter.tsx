import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { AmpIndep, Damped, DampTypes, Driven, EnergyParabola, MassCompare, PendulumEnergy, PendulumForces, Pendulums, Periodic, PhaseShift, Restoring, ResonanceCurve, Shadow, SinApprox, SpringCombos, SpringMass } from './ShmAnims';

/** Oscillations: simple harmonic motion, springs, pendulums, damping and resonance. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'Things that repeat', group: 'Theory' },
  { id: 'shm', title: 'Simple harmonic motion', group: 'Theory' },
  { id: 'shadow', title: 'The shadow of a circle', group: 'Theory' },
  { id: 'equations', title: 'Displacement, velocity, acceleration', group: 'Theory' },
  { id: 'period', title: 'Period and frequency', group: 'Theory' },
  { id: 'energy', title: 'Energy in SHM', group: 'Theory' },
  { id: 'spring', title: 'The spring and the block', group: 'Theory' },
  { id: 'combos', title: 'Springs in series and parallel', group: 'Theory' },
  { id: 'pendulum', title: 'The simple pendulum', group: 'Theory' },
  { id: 'damped', title: 'Damped oscillations', group: 'Theory' },
  { id: 'resonance', title: 'Forced oscillations and resonance', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="shm" sections={SECTIONS} sideTitle="Oscillations" sideLead="Things that swing back and forth: springs, pendulums, and why a gentle push at the right rhythm can build up a huge motion.">
      <header className="article-head">
        <span className="kicker">Physics · Oscillations</span>
        <h1 className="article-title">Why do springs and swings keep perfect time?</h1>
        <p className="article-lead">A mass on a spring and a child on a swing look nothing alike, yet both follow the same simple rule: the pull back toward the middle grows with the distance from it. This chapter builds the whole subject from that one rule.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="Things that repeat" />
        <p>
          A motion that repeats itself after equal intervals of time is <strong>periodic</strong>. The time for one full repeat is the <strong>period</strong> <M>T</M>. The Earth going round the Sun, a bouncing ball and a heartbeat are all periodic.
        </p>
        <p>
          Some periodic motions go to and fro about a fixed middle point, the <strong>equilibrium</strong> position, where the body would rest if left alone. These are <strong>oscillations</strong> (or vibrations). A pendulum and a mass on a spring are examples. A bouncing ball repeats too, but it has no middle point it swings about, so it is periodic and not an oscillation.
        </p>
        <figure className="t-figure">
          <Periodic />
          <figcaption>The pendulum and the block swing both ways about a middle point. The ball repeats, but only bounces up from the ground.</figcaption>
        </figure>
        <Note label="In this chapter">The simplest and most important oscillation is <strong>simple harmonic motion</strong>. Almost every small vibration, from a guitar string to an atom in a crystal, turns out to be this motion.</Note>
      </section>

      <section className="t-section" id="t-shm">
        <SectionHead n={no('shm')} title="Simple harmonic motion" />
        <p>
          Pull a block on a spring to one side and let go. The spring pulls it back toward the middle. The farther the block is from the middle, the harder the spring pulls. This is the key idea. The force is a <strong>restoring force</strong>: it always points toward equilibrium, and its size is proportional to the displacement <M>x</M> (taken as a vector from the middle):
        </p>
        <Eq src='F = − k · x' />
        <p>
          The minus sign says the force points opposite to the displacement. The constant <M>k</M> is the <strong>spring constant</strong>, in N/m: a stiff spring has a large <M>k</M>. Newton's second law, <M>F = m · a</M>, then gives the acceleration:
        </p>
        <Eq src='a = − [ k | m ] · x = − ω ^2 · x' />
        <p>
          Here we named <M>ω ^2 = [ k | m ]</M>. Any motion in which the acceleration is proportional to the displacement and always points toward the middle is called <strong>simple harmonic motion</strong> (SHM). That equation is the definition, and everything else follows from it.
        </p>
        <figure className="t-figure">
          <Restoring />
          <figcaption>
            The force arrow always points back to the middle, and the dot on the graph slides along a straight line <M>F = − k · x</M>.
          </figcaption>
        </figure>
        <p>
          This is not like constant-acceleration motion. Here the acceleration changes all the time: biggest at the ends, zero in the middle, and reversing direction as the block passes through. So the equations <M>v = u + a · t</M> and friends do <em>not</em> work.
        </p>
      </section>

      <section className="t-section" id="t-shadow">
        <SectionHead n={no('shadow')} title="The shadow of a circle" />
        <p>
          How do we find <M>x</M> as a function of time? Use a trick from the circular motion chapter. Take a point going round a circle of radius <M>A</M> at a steady angular speed <M>ω</M>, and shine a light on it from the side. Its shadow on a screen moves up and down along a line.
        </p>
        <figure className="t-figure">
          <Shadow title="A point goes round a circle at steady speed while its shadow on a vertical line moves up and down, tracing out a sine wave over time" />
          <figcaption>The shadow slows down near the top and bottom and speeds through the middle. Plotted against time, it traces a sine wave.</figcaption>
        </figure>
        <p>
          If the point is at angle <M>θ = ω · t</M>, the height of its shadow is <M>A · sin ( ω · t )</M>. We showed in circular motion that the acceleration of the point is <M>ω ^2 · A</M> toward the centre; the shadow's share of that is <M>− ω ^2 · y</M>. This is exactly the SHM rule <M>a = − ω ^2 · x</M>.
        </p>
        <p>
          So <strong>SHM is the shadow of uniform circular motion</strong>. The radius <M>A</M> of the circle is the <strong>amplitude</strong>, the biggest displacement. The angular speed <M>ω</M> of the point is the <strong>angular frequency</strong> of the oscillation.
        </p>
      </section>

      <section className="t-section" id="t-equations">
        <SectionHead n={no('equations')} title="Displacement, velocity, acceleration" />
        <p>The shadow gives the displacement at once. Allow for the point starting somewhere other than the start line by adding a <strong>phase constant</strong> <M>φ</M>:</p>
        <Eq src='x = A · sin ( ω · t + φ )' />
        <p>
          The quantity <M>ω · t + φ</M> is the <strong>phase</strong>. Differentiating once gives the velocity, and again the acceleration:
        </p>
        <Eq src={['v = [ dx | dt ] = A · ω · cos ( ω · t + φ )', 'a = [ dv | dt ] = − A · ω ^2 · sin ( ω · t + φ ) = − ω ^2 · x']} />
        <figure className="t-figure">
          <SpringMass title="A block swings on a spring with arrows for displacement, velocity and acceleration, and a graph beside it showing all three against time" graph="xva" height={250} />
          <figcaption>
            The velocity peaks as the block passes the middle, when <M>x = 0</M>. The acceleration is the mirror image of the displacement: it is biggest at the ends, and points the other way.
          </figcaption>
        </figure>
        <p>
          Read the phases off the graph. The velocity <em>leads</em> the displacement by a quarter of a cycle (<M>[ π | 2 ]</M>), and the acceleration is exactly opposite to the displacement (a phase difference of <M>π</M>). The largest values are
        </p>
        <Eq src={['x _max = A', 'v _max = A · ω "(at the middle)"', 'a _max = A · ω ^2 "(at the ends)"']} />
        <figure className="t-figure">
          <PhaseShift />
          <figcaption>
            Changing <M>φ</M> only slides the curve along the time axis. The shape and size stay the same; it just starts at a different point of the cycle.
          </figcaption>
        </figure>
        <h3 className="t-h3">Speed at a given position</h3>
        <p>Often we know where the block is, not when. Since <M>sin ^2 + cos ^2 = 1</M>, eliminating the time gives</p>
        <Eq src='v = ± ω · √[ A ^2 − x ^2 ]' />
        <figure className="t-figure">
          <SpringMass title="As the block swings, the point on the velocity against displacement graph travels round an ellipse" graph="vx" height={230} />
          <figcaption>
            Plot <M>v</M> against <M>x</M> and the point goes round an ellipse. It is fastest at <M>x = 0</M> (<M>v = ω · A</M>) and stops at <M>x = ± A</M>.
          </figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-period">
        <SectionHead n={no('period')} title="Period and frequency" />
        <p>
          One full oscillation takes the point on the circle once round, an angle of <M>2 · π</M>. So the <strong>period</strong> and the <strong>frequency</strong> (oscillations per second, in hertz) are
        </p>
        <Eq src={['T = [ 2 · π | ω ]', 'f = [ 1 | T ]', 'ω = 2 · π · f']} />
        <p>
          Notice what is <em>not</em> in these formulas: the amplitude. Pull the block twice as far and it moves twice as fast, so it covers a double distance in the same time. For SHM, the period does not depend on the amplitude. This is called <strong>isochronism</strong>, and it is why the same pendulum can keep a clock ticking steadily as it runs down.
        </p>
        <figure className="t-figure">
          <AmpIndep />
          <figcaption>Two identical springs, one pulled a little and one pulled far. The far one moves faster, yet both reach the middle at the same moment.</figcaption>
        </figure>
        <Note label="Careful">The symbol <M>ω</M> is the <strong>angular frequency</strong> in rad/s. It is <M>2 · π</M> times the frequency <M>f</M> in Hz. Using one for the other is the commonest slip in this topic.</Note>
      </section>

      <section className="t-section" id="t-energy">
        <SectionHead n={no('energy')} title="Energy in SHM" />
        <p>
          A spring stores potential energy <M>[ 1 | 2 ] · k · x ^2</M> when it is stretched by <M>x</M>, and the block has kinetic energy <M>[ 1 | 2 ] · m · v ^2</M>. As the block swings, energy passes back and forth between the two. At the ends it stops for an instant, so all the energy is potential. At the middle the spring is relaxed, so all the energy is kinetic.
        </p>
        <Eq src={['PE = [ 1 | 2 ] · k · x ^2', 'KE = [ 1 | 2 ] · m · v ^2 = [ 1 | 2 ] · k · ( A ^2 − x ^2 )']} />
        <p>
          For KE we used <M>v ^2 = ω ^2 · ( A ^2 − x ^2 )</M> and <M>m · ω ^2 = k</M>. Add the two and the <M>x</M> cancels:
        </p>
        <Eq src='E = PE + KE = [ 1 | 2 ] · k · A ^2' />
        <p>The total energy is constant (no friction here) and depends on the amplitude: double the amplitude and the energy goes up four times.</p>
        <figure className="t-figure">
          <EnergyParabola title="The block swings while a dot moves along the potential energy parabola; the gap between the parabola and the flat total energy line is the kinetic energy" />
          <figcaption>
            The parabola is the potential energy. The flat dashed line is the total <M>E</M>. The gap between them is the kinetic energy, which is zero at the ends and largest at the middle.
          </figcaption>
        </figure>
        <p>The same swap happens in a pendulum, where the stored energy is gravitational. The bob is highest, and slowest, at the ends of its swing.</p>
        <figure className="t-figure">
          <PendulumEnergy />
          <figcaption>As the bob rises, the PE bar grows and the KE bar shrinks, and the other way round as it falls. Their total never changes.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-spring">
        <SectionHead n={no('spring')} title="The spring and the block" />
        <p>
          For a block of mass <M>m</M> on a spring of constant <M>k</M>, the angular frequency is <M>ω = √[ [ k | m ] ]</M>, so
        </p>
        <Eq src='T = 2 · π · √[ [ m | k ] ]' />
        <p>
          A heavier block is harder to accelerate, so it swings more slowly. A stiffer spring pulls harder for the same stretch, so the block swings faster. To halve the period you need to make the mass four times smaller, or the spring four times stiffer, because of the square root.
        </p>
        <figure className="t-figure">
          <MassCompare />
          <figcaption>
            Four times the mass doubles the period. Four times the stiffness halves it. The amplitude is the same in every row and does not matter.
          </figcaption>
        </figure>
        <p>
          If the block hangs from a vertical spring, gravity only moves the middle point down (the spring stretches by <M>m · g / k</M> at rest). The block still oscillates about that new middle with the same <M>T = 2 · π · √[ m / k ]</M>. That is why the formula is the same on the Moon.
        </p>
      </section>

      <section className="t-section" id="t-combos">
        <SectionHead n={no('combos')} title="Springs in series and parallel" />
        <p>
          Two springs can be replaced by one spring with an <strong>effective spring constant</strong> <M>k _eff</M>. Which one depends on how they are joined.
        </p>
        <p>
          <strong>In parallel</strong>, both springs stretch by the same amount and both pull, so their forces add. The stiffness adds too:
        </p>
        <Eq src='k _eff = k _1 + k _2' />
        <p>
          <strong>In series</strong>, joined end to end, the same force runs through both but each stretches only part of the total. The softnesses add:
        </p>
        <Eq src='[ 1 | k _eff ] = [ 1 | k _1 ] + [ 1 | k _2 ]' />
        <figure className="t-figure">
          <SpringCombos />
          <figcaption>Two equal springs. In series the pair is softer (<M>k / 2</M>) and the block is slow. In parallel the pair is stiffer (<M>2 · k</M>) and the block is fast.</figcaption>
        </figure>
        <p>Then use <M>k _eff</M> in <M>T = 2 · π · √[ m / k _eff ]</M> as usual.</p>
      </section>

      <section className="t-section" id="t-pendulum">
        <SectionHead n={no('pendulum')} title="The simple pendulum" />
        <p>
          A <strong>simple pendulum</strong> is a small heavy bob on a light string of length <M>L</M>. When the string makes an angle <M>θ</M> with the vertical, the weight <M>m · g</M> splits into two parts. One part, along the string, is cancelled by the tension. The other, along the path of the bob, pulls it back to the middle:
        </p>
        <Eq src='F = − m · g · sin θ' />
        <figure className="t-figure">
          <PendulumForces />
          <figcaption>The weight splits into a part along the string and a part along the path. The part along the path always points back toward the middle.</figcaption>
        </figure>
        <p>
          For a small angle (in radians) <M>sin θ ≈ θ</M>, and the arc from the middle is <M>s = L · θ</M>. So the restoring force becomes
        </p>
        <Eq src='F ≈ − m · g · θ = − [ m · g | L ] · s' />
        <figure className="t-figure">
          <SinApprox />
          <figcaption>Up to about 10° (0.17 rad) the sine and the angle differ by less than 1%. The approximation gets worse for bigger swings.</figcaption>
        </figure>
        <p>
          That is SHM, with <M>k = m · g / L</M> playing the role of the spring constant. Putting this into <M>T = 2 · π · √[ m / k ]</M> the mass cancels:
        </p>
        <Eq src='T = 2 · π · √[ [ L | g ] ]' />
        <p>
          The period depends on the length and on <M>g</M>, and <em>not</em> on the mass of the bob. A longer pendulum is slower, and the same pendulum is slower where <M>g</M> is weaker. For swings up to about 10° it is accurate to better than 0.2%; at 60° the true period is about 7% longer.
        </p>
        <figure className="t-figure">
          <Pendulums title="Two pendulums of different lengths start together, drift out of step, and come back into step later; below, their displacements against time" items={[{ L: 1, theta0: 0.3, label: 'L = 1 m' }, { L: 0.75, theta0: 0.3, label: 'L = 0.75 m', r: 8 }]} graph loop={14} />
          <figcaption>The shorter pendulum swings faster, so it pulls ahead. The two drift apart, and meet again when the short one has gained one whole swing.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-damped">
        <SectionHead n={no('damped')} title="Damped oscillations" />
        <p>
          A real oscillator loses energy to friction and air drag. A resisting force that grows with the speed, <M>F = − b · v</M>, takes energy from every swing, so the amplitude dies away. For light damping it falls by the same fraction each swing, which is an exponential decay:
        </p>
        <Eq src='x = A _0 · e ^−γ·t · sin ( ω′ · t + φ )' />
        <p>
          where <M>γ = [ b | 2 · m ]</M> and the frequency <M>ω′</M> is slightly below the natural <M>ω</M>. The decaying curve <M>A _0 · e ^−γ·t</M> is the <strong>envelope</strong>. The wave stays inside it. Since energy goes as <M>A ^2</M>, it falls twice as fast.
        </p>
        <figure className="t-figure">
          <Damped />
          <figcaption>Each swing is a little shorter than the last. The oscillation fits inside the dashed envelope.</figcaption>
        </figure>
        <p>More damping changes the character of the motion:</p>
        <figure className="t-figure">
          <DampTypes />
          <figcaption>
            <strong>Light</strong> damping: many swings, slowly dying. <strong>Critical</strong> damping: returns to rest in the shortest time without overshooting, which is what car shock absorbers and door closers aim for. <strong>Heavy</strong> damping: no swing at all, just a slow creep back.
          </figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-resonance">
        <SectionHead n={no('resonance')} title="Forced oscillations and resonance" />
        <p>
          Left alone, an oscillator vibrates at its <strong>natural frequency</strong> <M>f _0</M>. Push it regularly from outside at some other frequency <M>f</M> and it is a <strong>forced oscillation</strong>. After the start-up, it vibrates at the <em>driving</em> frequency, not its own, and the amplitude depends on how close <M>f</M> is to <M>f _0</M>.
        </p>
        <figure className="t-figure">
          <ResonanceCurve />
          <figcaption>Slide the driving frequency along and the response swells as it nears <M>f _0</M>. Heavier damping lowers and widens the peak.</figcaption>
        </figure>
        <p>
          When <M>f = f _0</M> the push arrives in step with the motion every swing, so it always adds energy and never takes it away. The amplitude grows until the energy put in each cycle equals the energy lost to damping. This is <strong>resonance</strong>.
        </p>
        <figure className="t-figure">
          <Driven title="Three blocks pushed by a moving support at half the natural frequency, at the natural frequency, and at one and a half times it; only the middle one builds up a large swing" ratios={[0.5, 1, 1.5]} />
          <figcaption>
            The three supports move by the same small distance <M>d</M>. Only the one pushed at the natural frequency builds up a large swing, and it takes a few cycles to get there.
          </figcaption>
        </figure>
        <p>
          You know this from pushing a swing: small pushes at the right moment in every cycle build up a big motion, and pushes at the wrong rhythm do little. Soldiers break step on a bridge so that their regular marching cannot drive it into a large sway. Tuning a radio is the same idea: the circuit is adjusted until its natural frequency matches the station's.
        </p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Defining equation of SHM', 'a = − ω ^2 · x'],
                  ['Restoring force (spring)', 'F = − k · x'],
                  ['Angular frequency (spring)', 'ω = √[ [ k | m ] ]'],
                  ['Displacement', 'x = A · sin ( ω · t + φ )'],
                  ['Velocity', 'v = A · ω · cos ( ω · t + φ )'],
                  ['Acceleration', 'a = − A · ω ^2 · sin ( ω · t + φ )'],
                  ['Speed at position x', 'v = ω · √[ A ^2 − x ^2 ]'],
                  ['Maximum speed and acceleration', 'v _max = A · ω ,  a _max = A · ω ^2'],
                  ['Period and frequency', 'T = [ 2 · π | ω ] ,  f = [ 1 | T ] ,  ω = 2 · π · f'],
                  ['Potential energy', 'PE = [ 1 | 2 ] · k · x ^2'],
                  ['Kinetic energy', 'KE = [ 1 | 2 ] · k · ( A ^2 − x ^2 )'],
                  ['Total energy', 'E = [ 1 | 2 ] · k · A ^2'],
                  ['Spring and block', 'T = 2 · π · √[ [ m | k ] ]'],
                  ['Springs in parallel', 'k _eff = k _1 + k _2'],
                  ['Springs in series', '[ 1 | k _eff ] = [ 1 | k _1 ] + [ 1 | k _2 ]'],
                  ['Simple pendulum (small angles)', 'T = 2 · π · √[ [ L | g ] ]'],
                  ['Damped amplitude', 'A = A _0 · e ^−γ·t'],
                  ['Resonance', 'f = f _0'],
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
                  ['x', 'Displacement from the middle', 'm'],
                  ['A', 'Amplitude: the largest displacement', 'm'],
                  ['ω', 'Angular frequency', 'rad/s'],
                  ['φ', 'Phase constant', 'rad'],
                  ['T', 'Period: time for one oscillation', 's'],
                  ['f', 'Frequency: oscillations per second', 'Hz'],
                  ['k', 'Spring constant', 'N/m'],
                  ['m', 'Mass', 'kg'],
                  ['L', 'Length of the pendulum', 'm'],
                  ['γ', 'Damping rate', 's⁻¹'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{['m', 'rad/s', 'rad', 's', 'Hz', 'N/m', 'kg'].includes(unit) ? <M>{`"${unit}"`}</M> : unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="A block on a spring">
          <p className="ex-q">A 0.5 kg block is attached to a spring of constant 200 N/m. Find the angular frequency, the period and the frequency of its oscillations.</p>
          <Given items={['m = 0.5 "kg"', 'k = 200 "N/m"']} />
          <ol className="steps">
            <Step title="Angular frequency">
              <Eq src='ω = √[ [ k | m ] ] = √[ [ 200 | 0.5 ] ] = 20 "rad/s"' />
            </Step>
            <Step title="Period">
              <Eq src='T = [ 2 · π | ω ] = [ 2 · π | 20 ] = 0.314 "s"' />
            </Step>
            <Step title="Frequency">
              <Eq src='f = [ 1 | T ] = [ 1 | 0.314 ] = 3.18 "Hz"' />
            </Step>
          </ol>
          <Answer>20 rad/s. The block makes one oscillation every 0.314 s, which is 3.18 oscillations per second.</Answer>
          <figure className="t-figure">
            <SpringMass title="A block of 0.5 kg on a 200 newton per metre spring oscillating, with its displacement graph" graph="x" notes={['m = 0.5 kg', 'k = 200 N/m', 'T = 0.314 s']} />
            <figcaption>Shown slowed down: the real block completes each swing in under a third of a second.</figcaption>
          </figure>
        </Example>

        <Example n={2} title="Fastest and hardest-pushed">
          <p className="ex-q">The same block (0.5 kg, 200 N/m) is pulled 0.1 m to one side and released. Find its maximum speed and maximum acceleration, and where each happens.</p>
          <Given items={['A = 0.1 "m"', 'ω = 20 "rad/s"']} />
          <ol className="steps">
            <Step title="Maximum speed, at the middle">
              <Eq src='v _max = A · ω = 0.1 · 20 = 2.00 "m/s"' />
            </Step>
            <Step title="Maximum acceleration, at the ends">
              <Eq src='a _max = A · ω ^2 = 0.1 · 20 ^2 = 40.0 "m/s²"' />
            </Step>
            <Step title="Check with the force">
              <Eq src='F _max = k · A = 200 · 0.1 = 20 "N" ,  a = [ F | m ] = [ 20 | 0.5 ] = 40 "m/s²"' />
            </Step>
          </ol>
          <Answer>2.00 m/s as it passes through the middle (where the acceleration is zero), and 40.0 m/s² at either end (where the speed is zero).</Answer>
          <figure className="t-figure">
            <SpringMass title="The block swinging with live readouts: speed is biggest when the displacement is zero, acceleration is biggest at the ends" real={{ A: 0.1, w: 20 }} height={230} />
            <figcaption>The readouts show the real values; the animation is slowed down.</figcaption>
          </figure>
        </Example>

        <Example n={3} title="A seconds pendulum">
          <p className="ex-q">A seconds pendulum takes exactly 1 s for each swing in one direction, so its period is 2 s. How long is it? (Use <M>g = 9.8 "m/s²"</M>.)</p>
          <Given items={['T = 2 "s"', 'g = 9.8 "m/s²"']} />
          <ol className="steps">
            <Step title="Turn the formula around">
              <Eq src={['T = 2 · π · √[ [ L | g ] ]', 'L = [ g · T ^2 | 4 · π ^2 ]']} />
            </Step>
            <Step title="Put in the numbers">
              <Eq src='L = [ 9.8 · 2 ^2 | 4 · π ^2 ] = [ 39.2 | 39.48 ] = 0.993 "m"' />
            </Step>
          </ol>
          <Answer>0.993 m, a hair under one metre. This is why the metre was once proposed to be defined as the length of a seconds pendulum.</Answer>
          <figure className="t-figure">
            <Pendulums title="A seconds pendulum swinging from one end to the other in one second" items={[{ L: 0.993, theta0: 0.25 }]} loop={8} readout ghosts />
            <figcaption>Each swing from one hollow marker to the other takes 1 s; there and back takes 2 s.</figcaption>
          </figure>
        </Example>

        <Example n={4} title="A pendulum on the Moon">
          <p className="ex-q">A 1 m pendulum is taken to the Moon, where <M>g = 1.6 "m/s²"</M>. By what factor does the period change?</p>
          <Given items={['L = 1 "m"', 'g _Earth = 9.8 "m/s²"', 'g _Moon = 1.6 "m/s²"']} />
          <ol className="steps">
            <Step title="Period on each">
              <Eq src={['T _Earth = 2 · π · √[ [ 1 | 9.8 ] ] = 2.01 "s"', 'T _Moon = 2 · π · √[ [ 1 | 1.6 ] ] = 4.97 "s"']} />
            </Step>
            <Step title="Ratio">
              <Eq src='[ T _Moon | T _Earth ] = √[ [ g _Earth | g _Moon ] ] = √[ [ 9.8 | 1.6 ] ] = 2.47' />
            </Step>
          </ol>
          <Answer>The period is 2.47 times longer: about 4.97 s instead of 2.01 s. The mass of the bob and the amplitude play no part.</Answer>
          <figure className="t-figure">
            <Pendulums title="Two identical pendulums, one on the Earth and one on the Moon; the one on the Moon swings much more slowly" items={[{ L: 1, theta0: 0.3, label: 'Earth: T = 2.01 s' }, { L: 1, theta0: 0.3, g: 1.6, label: 'Moon: T = 4.97 s' }]} loop={10} readout />
          </figure>
        </Example>

        <Example n={5} title="Half way out">
          <p className="ex-q">The block (0.5 kg, 200 N/m, amplitude 0.1 m) is at <M>x = A / 2</M>. Find the total energy, the potential and kinetic energy there, the speed and the acceleration.</p>
          <Given items={['m = 0.5 "kg"', 'k = 200 "N/m"', 'A = 0.1 "m"', 'x = 0.05 "m"']} />
          <ol className="steps">
            <Step title="Total energy">
              <Eq src='E = [ 1 | 2 ] · k · A ^2 = [ 1 | 2 ] · 200 · 0.1 ^2 = 1.00 "J"' />
            </Step>
            <Step title="Potential energy at x = A/2">
              <Eq src='PE = [ 1 | 2 ] · k · x ^2 = [ 1 | 2 ] · 200 · 0.05 ^2 = 0.25 "J"' />
            </Step>
            <Step title="Kinetic energy">
              <Eq src='KE = E − PE = 1.00 − 0.25 = 0.75 "J"' />
            </Step>
            <Step title="Speed">
              <Eq src={['v = √[ [ 2 · KE | m ] ] = √[ [ 2 · 0.75 | 0.5 ] ] = 1.73 "m/s"', 'v = ω · √[ A ^2 − x ^2 ] = 20 · √[ 0.1 ^2 − 0.05 ^2 ] = 1.73 "m/s"']} />
            </Step>
            <Step title="Acceleration">
              <Eq src='a = ω ^2 · x = 20 ^2 · 0.05 = 20 "m/s²"' />
              <p>It points toward the middle.</p>
            </Step>
          </ol>
          <Answer>
            Total 1.00 J, of which 0.25 J (a quarter) is potential and 0.75 J (three quarters) is kinetic. The speed is 1.73 m/s and the acceleration is 20 m/s² toward the middle. Half way out, the block is moving at <M>[ √3 | 2 ]</M> of its top speed.
          </Answer>
          <figure className="t-figure">
            <EnergyParabola title="The block swings, with its kinetic and potential energy in joules shown live and the half-amplitude positions marked" mark={0.5} real={{ E: 1 }} />
            <figcaption>When the dot passes the marker at <M>A / 2</M>, the PE reads 0.25 J and the KE reads 0.75 J.</figcaption>
          </figure>
        </Example>

        <Example n={6} title="Two springs, two ways">
          <p className="ex-q">Two identical springs, each of 200 N/m, support the 0.5 kg block. Find the period when they are joined in series and when they are joined in parallel.</p>
          <Given items={['k = 200 "N/m"', 'm = 0.5 "kg"']} />
          <ol className="steps">
            <Step title="Series">
              <Eq src={['[ 1 | k _eff ] = [ 1 | 200 ] + [ 1 | 200 ] = [ 1 | 100 ]', 'k _eff = 100 "N/m"', 'T = 2 · π · √[ [ 0.5 | 100 ] ] = 0.444 "s"']} />
            </Step>
            <Step title="Parallel">
              <Eq src={['k _eff = 200 + 200 = 400 "N/m"', 'T = 2 · π · √[ [ 0.5 | 400 ] ] = 0.222 "s"']} />
            </Step>
          </ol>
          <Answer>0.444 s in series (a softer spring) and 0.222 s in parallel (a stiffer one). The parallel block oscillates twice as fast, since its spring is four times as stiff as the series pair.</Answer>
          <figure className="t-figure">
            <SpringCombos />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="A bigger swing takes longer" wrong="T ∝ A" fig={<AmpIndep height={170} />}>
            For SHM the period does not depend on the amplitude. A bigger swing is faster in just the right amount to take the same time.
          </Mistake>
          <Mistake title="Acceleration is biggest in the middle" wrong={'a _max "at" x = 0'} fig={<SpringMass title="Velocity is biggest in the middle where acceleration is zero, and at the ends acceleration is biggest where velocity is zero" height={200} />}>
            The velocity is biggest at the middle, but there the spring is relaxed and the acceleration is zero. The acceleration is biggest at the ends, where the block is momentarily at rest.
          </Mistake>
          <Mistake title="The heavy bob swings slower" wrong={'T ∝ √[ m ]  "for a pendulum"'} fig={<Pendulums title="Two pendulums of the same length, one with a light bob and one with a heavy bob, swing together" items={[{ L: 1, theta0: 0.3, r: 6 }, { L: 1, theta0: 0.3, r: 15 }]} height={215} loop={8} />}>
            For a pendulum the mass cancels. The heavier bob is pulled harder by gravity but is harder to move by the same factor, so <M>T = 2 · π · √[ L / g ]</M> does not contain <M>m</M>. (For a spring it does.)
          </Mistake>
          <Mistake title="The pendulum formula works at any angle" wrong={'T = 2 · π · √[ [ L | g ] ]  "for 80°"'} fig={<Pendulums title="A pendulum swinging through a small angle and one swinging through 80 degrees; the large swing takes longer" items={[{ L: 1, theta0: 0.15, label: 'small swing' }, { L: 1, theta0: 1.4, label: '80° swing' }]} height={215} loop={10} />}>
            The formula needs <M>sin θ ≈ θ</M>, which only holds for small angles. At large amplitudes the period is longer than the formula says: about 18% longer at 90°.
          </Mistake>
          <Mistake title="Taking ω to be 1 / T" wrong="ω = [ 1 | T ]" fig={<Shadow title="The point goes once round the circle, an angle of two pi, in one period" height={180} omega={2} label="one period = one full turn" />}>
            One oscillation is one full turn of the circle, an angle of <M>2 · π</M>. So <M>ω = 2 · π / T = 2 · π · f</M>. The frequency <M>f = 1 / T</M> is in hertz; <M>ω</M> is in rad/s.
          </Mistake>
          <Mistake title="Resonance means the amplitude grows forever" wrong={'A → ∞ "at" f = f _0'} fig={<Driven title="A block driven at its natural frequency grows its swing but stops at a limit marked by the dashed lines" ratios={[1]} height={130} />}>
            Damping takes away more energy as the swing gets bigger, until the loss in each cycle equals the energy supplied. The amplitude levels off at a large, but finite, value (the dashed marks).
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Pull back in proportion to the distance, and everything swings in time.</p>
        <p className="closing-sub">Next: waves. An oscillation that passes from one particle to the next is a wave, and the formulas you have just learned apply to every particle in it.</p>
      </footer>
    </ChapterShell>
  );
}
