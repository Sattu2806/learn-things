import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Addition, Annihilation, ClockCompare, EnergySpeed, EnergyTriangle, GammaGraph, LengthContraction, LightClock, LightVsBall, Muons, Simultaneity } from './RelAnims';

/** Special relativity: the two postulates, time dilation, length contraction, simultaneity, and mass-energy. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'A problem with light', group: 'Theory' },
  { id: 'postulates', title: 'The two postulates', group: 'Theory' },
  { id: 'clock', title: 'The light clock and time dilation', group: 'Theory' },
  { id: 'gamma', title: 'The Lorentz factor', group: 'Theory' },
  { id: 'contraction', title: 'Length contraction', group: 'Theory' },
  { id: 'simultaneity', title: 'Simultaneity is relative', group: 'Theory' },
  { id: 'muons', title: 'Muons: a real test', group: 'Theory' },
  { id: 'addition', title: 'Adding velocities', group: 'Theory' },
  { id: 'energy', title: 'Mass and energy: E = mc²', group: 'Theory' },
  { id: 'momentum', title: 'Momentum and energy at high speed', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="relativity" film={buildFilm} sections={SECTIONS} sideTitle="Special relativity" sideLead="What happens to time, length and energy when things move at speeds close to the speed of light, and why light itself sets the rules.">
      <header className="article-head">
        <span className="kicker">Physics · Modern physics</span>
        <h1 className="article-title">Why do clocks and rulers change with speed?</h1>
        <p className="article-lead">Insist on just two simple rules, that physics is the same for everyone moving steadily and that everyone measures the same speed for light, and time, length and energy have to behave in ways that seem strange. They have been tested over and over, and they hold.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="A problem with light" />
        <p>
          Imagine a train moving at speed <M>v</M> along a straight track. A passenger throws a ball forward at speed <M>u′</M> measured on the train. Someone standing beside the track sees the ball move at the <em>sum</em> of the two speeds. This is the rule everyone knows from everyday life:
        </p>
        <Eq src='u = u′ + v' />
        <p>
          Now replace the ball with a flash of light. Maxwell&apos;s equations for electricity and magnetism predict that light travels at one definite speed <M>c</M>, about <M>3.00 × 10 ^8 "m/s"</M>. If the old rule held, the person beside the track would measure <M>c + v</M>. But careful experiments, beginning with Michelson and Morley in 1887, found no such thing. The speed of light came out the same however the source or the observer moved.
        </p>
        <figure className="t-figure">
          <LightVsBall />
          <figcaption>The ball&apos;s speed on the ground is the sum of the speeds. The light flash is not: it moves at <M>c</M> on the ground just as it does on the train. The old rule must fail for light.</figcaption>
        </figure>
        <p>
          In 1905 Einstein took the experiments at their word. Instead of patching the rule for light, he asked what the world must be like if the speed of light really is the same for everyone. The answer changes our idea of time and space.
        </p>
      </section>

      <section className="t-section" id="t-postulates">
        <SectionHead n={no('postulates')} title="The two postulates" />
        <p>
          A <strong>frame of reference</strong> is a set of rulers and clocks used to say where and when an <strong>event</strong> happens (a flash, a collision, a click of a clock). An <strong>inertial frame</strong> is one that moves at a steady speed in a straight line. Special relativity, the theory of such frames, rests on two statements:
        </p>
        <ol className="steps">
          <li className="step">
            <h4>The principle of relativity</h4>
            <p>The laws of physics take the same form in every inertial frame. No experiment done entirely inside a smoothly moving train can tell you whether you are moving or at rest.</p>
          </li>
          <li className="step">
            <h4>The constancy of the speed of light</h4>
            <p>The speed of light in empty space has the same value <M>c</M> in every inertial frame, whatever the motion of the source or the observer.</p>
          </li>
        </ol>
        <Eq src='c = 2.998 × 10 ^8 "m/s" ≈ 3.00 × 10 ^8 "m/s"' />
        <Note label="What this implies">If the distance light covers and the time it takes are measured differently by two observers, but they must still get the same ratio, then distances and times themselves cannot be the same for both. Everything in this chapter follows from that single remark.</Note>
      </section>

      <section className="t-section" id="t-clock">
        <SectionHead n={no('clock')} title="The light clock and time dilation" />
        <p>
          The simplest clock to think about is a <strong>light clock</strong>: a flash of light bouncing between two mirrors a distance <M>L</M> apart. One tick is one trip up and back. At rest, with the speed of light <M>c</M>, a tick takes
        </p>
        <Eq src='Δt _0 = [ 2 · L | c ]' />
        <p>
          This time <M>Δt _0</M> is measured in the clock&apos;s own rest frame. It is called the <strong>proper time</strong>.
        </p>
        <p>
          Now watch the same clock go past at speed <M>v</M>, with the mirrors side by side across the direction of motion. While the flash climbs to the top mirror, the clock moves along, so in our frame the flash follows a slanting path. The path is longer than <M>2 · L</M>, and by the second postulate the flash does not move faster than <M>c</M>. So in our frame one tick takes <em>longer</em>.
        </p>
        <figure className="t-figure">
          <LightClock />
          <figcaption>The same clock at rest and moving. For the moving clock the flash must travel the slanting side of a triangle: its height is <M>L</M>, its base is <M>v · t</M> and the slanting side is <M>c · t</M>. Fewer ticks fit into the same time.</figcaption>
        </figure>
        <p>
          Let one tick take a time <M>Δt</M> in our frame. The flash climbs for half of it. In that half-time it rises <M>L</M>, the clock moves <M>v · Δt / 2</M> sideways, and the flash covers the slant <M>c · Δt / 2</M>. Pythagoras gives
        </p>
        <Eq src='( [ c · Δt | 2 ] ) ^2 = L ^2 + ( [ v · Δt | 2 ] ) ^2' />
        <p>Multiply through by 4 and collect the terms in <M>Δt</M>:</p>
        <Eq src={['c ^2 · Δt ^2 = 4 · L ^2 + v ^2 · Δt ^2', 'Δt ^2 · ( c ^2 − v ^2 ) = 4 · L ^2', 'Δt = [ 2 · L | √[ c ^2 − v ^2 ] ]']} />
        <p>
          Take <M>c</M> out of the square root, and recognise <M>2 · L / c</M> as the tick time <M>Δt _0</M> of the clock at rest:
        </p>
        <Eq src={['Δt = [ 2 · L | c · √[ 1 − [ v ^2 | c ^2 ] ] ]', 'Δt = [ Δt _0 | √[ 1 − [ v ^2 | c ^2 ] ] ] = γ · Δt _0']} />
        <p>
          This is <strong>time dilation</strong>. The time between two events that happen at the same place in a frame (the proper time <M>Δt _0</M>) is the shortest. Any observer who sees that clock move measures a longer time, longer by the factor <M>γ</M>. The result is not special to light clocks: if a light clock and a wristwatch agreed when they were side by side, they must keep agreeing, or the principle of relativity would let us tell who is moving. So <em>every</em> clock, and every process, including ageing, slows down by the same factor.
        </p>
        <figure className="t-figure">
          <ClockCompare />
          <figcaption>A ship at 0.8 c. Watched from the station, 10 s pass on the station clock while only 6 s pass on the ship&apos;s clock.</figcaption>
        </figure>
        <Note label="Both sides see it">The effect is symmetric. The ship&apos;s crew sees the station clock running slow, just as the station sees the ship&apos;s. There is no contradiction: each frame compares a clock at rest in its own frame with two clocks spread out in the other, and, as the section on simultaneity shows, those two clocks do not agree on what time it is.</Note>
      </section>

      <section className="t-section" id="t-gamma">
        <SectionHead n={no('gamma')} title="The Lorentz factor" />
        <p>
          The factor that keeps appearing depends only on the speed as a fraction of the speed of light. Writing <M>β = v / c</M>, the <strong>Lorentz factor</strong> is
        </p>
        <Eq src={['β = [ v | c ]', 'γ = [ 1 | √[ 1 − β ^2 ] ]']} />
        <p>
          It is never less than 1. At <M>v = 0</M> it is exactly 1, and it grows without limit as <M>v</M> approaches <M>c</M>. For small speeds it is almost 1, since <M>γ ≈ 1 + [ 1 | 2 ] · β ^2</M>. A jet at 300 m/s has <M>β = 1.0 × 10 ^−6</M>, so <M>γ</M> differs from 1 by only <M>5 × 10 ^−13</M>. This is why we never notice relativity in daily life.
        </p>
        <figure className="t-figure">
          <GammaGraph />
          <figcaption>The graph is flat for a long way, then turns almost straight up as <M>v</M> nears <M>c</M>. The dashed line is a wall that no body with mass reaches.</figcaption>
        </figure>
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Speed</th>
                <th scope="col">
                  <M>γ</M>
                </th>
                <th scope="col">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['0.1 c', '1.005', 'half a percent'],
                  ['0.5 c', '1.155', 'a clock loses 13%'],
                  ['0.6 c', '1.25', 'a 3, 4, 5 triangle'],
                  ['0.8 c', '1.667', 'ticks at 3/5 of the rate'],
                  ['0.9 c', '2.294', 'about twice as slow'],
                  ['0.99 c', '7.089', 'seven times slower'],
                  ['0.999 c', '22.37', 'twenty-two times'],
                ] as const
              ).map(([speed, g, meaning]) => (
                <tr key={speed}>
                  <th scope="row">{speed}</th>
                  <td>
                    <M>{g}</M>
                  </td>
                  <td>{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-contraction">
        <SectionHead n={no('contraction')} title="Length contraction" />
        <p>
          Time is not the only thing that changes. Take a trip between two stars that are a distance <M>L _0</M> apart, as measured by anyone at rest relative to the stars. This is the <strong>proper length</strong>: the length measured in the frame where the object is at rest.
        </p>
        <p>A spaceship goes from one star to the other at speed <M>v</M>. The people at the stars time the trip:</p>
        <Eq src='Δt = [ L _0 | v ]' />
        <p>
          The ship carries a moving clock, so by time dilation its crew measures a shorter time, <M>Δt _0 = Δt / γ</M>:
        </p>
        <Eq src='Δt _0 = [ Δt | γ ] = [ L _0 | γ · v ]' />
        <p>
          But the crew also sees the stars rush past at speed <M>v</M>, covering the gap in time <M>Δt _0</M>. The distance they measure is therefore
        </p>
        <Eq src='L = v · Δt _0 = [ L _0 | γ ]' />
        <p>
          This is <strong>length contraction</strong>. A length measured along the direction of motion is shorter than its proper length by the factor <M>γ</M>. Lengths <em>across</em> the direction of motion do not change. A passing ship is shorter, but not thinner.
        </p>
        <figure className="t-figure">
          <LengthContraction />
          <figcaption>As the speed rises, the moving ship shrinks along its motion. Its height stays the same. At 0.8 c its length is 0.6 of the proper length.</figcaption>
        </figure>
        <Note label="Space and time together">Time dilation and length contraction use the same factor <M>γ</M> and are two views of one fact: space and time are not separate and absolute but are mixed together when you change frames.</Note>
      </section>

      <section className="t-section" id="t-simultaneity">
        <SectionHead n={no('simultaneity')} title="Simultaneity is relative" />
        <p>
          Here is the idea that makes the rest consistent. Two events that happen at the same moment in one frame do <em>not</em> happen at the same moment in another frame that moves relative to the first.
        </p>
        <p>
          A lamp in the middle of a train flashes. On the train, light goes to both end walls at speed <M>c</M> and arrives at both at the same instant. On the ground, however, the light also moves at <M>c</M> (the second postulate), the back wall moves toward it, and the front wall moves away. The back wall is hit first.
        </p>
        <figure className="t-figure">
          <Simultaneity />
          <figcaption>Top: the train&apos;s view. Bottom: the ground&apos;s view, with the same flash. Each frame is correct in its own measurements.</figcaption>
        </figure>
        <p>
          We can find the gap. Let <M>L</M> be the train&apos;s length measured on the ground and <M>v</M> its speed. In the ground frame the back wall closes on the light at a combined speed <M>c + v</M>, and the front wall retreats so the light gains on it at <M>c − v</M>. Each wall is <M>L / 2</M> from the lamp when it flashes:
        </p>
        <Eq src={['Δt _back = [ L | 2 · ( c + v ) ]', 'Δt _front = [ L | 2 · ( c − v ) ]']} />
        <p>Their difference is the time gap that the ground sees between the two hits:</p>
        <Eq src={['Δt _front − Δt _back = [ L | 2 ] · ( [ 1 | c − v ] − [ 1 | c + v ] )', 'Δt _front − Δt _back = [ L | 2 ] · [ 2 · v | c ^2 − v ^2 ] = [ L · v | c ^2 − v ^2 ]']} />
        <p>
          The gap grows with the length of the train and with its speed, and is zero when <M>v = 0</M>. At everyday speeds it is far too small to notice, which is why the idea of &ldquo;at the same time&rdquo; seems absolute in daily life.
        </p>
        <Note label="Cause and effect is safe">If one event causes another, every observer sees the cause first. Only events too far apart for light to connect them in the time between can change order, and those cannot influence each other anyway.</Note>
      </section>

      <section className="t-section" id="t-muons">
        <SectionHead n={no('muons')} title="Muons: a real test" />
        <p>
          Cosmic rays hit the upper atmosphere and make particles called <strong>muons</strong>. A muon at rest lasts on average <M>τ _0 = 2.2 "μs"</M> before it decays. Even at nearly the speed of light, say <M>v = 0.98 c</M>, a muon with no time dilation would travel only
        </p>
        <Eq src='d _1 = v · τ _0 = 0.98 · 3.00 × 10 ^8 · 2.2 × 10 ^−6 = 647 "m"' />
        <p>
          Yet muons made 10 or 15 km up arrive in large numbers at sea level, and many get through kilometres of rock. Time dilation explains it. We see the muon&apos;s clock run slow by <M>γ = 5.03</M>, so the muon lasts long enough to go
        </p>
        <Eq src='d _2 = v · γ · τ _0 = 5.03 · 647 ≈ 3250 "m"' />
        <figure className="t-figure">
          <Muons />
          <figcaption>Left: in the Earth&apos;s frame the muon&apos;s clock is slow and it covers 3250 m. Right: in its own frame the muon lives 2.2 μs as usual, but the ground is only 647 m away.</figcaption>
        </figure>
        <p>
          In the muon&apos;s own frame the clock is normal and lasts only 2.2 μs. But that frame sees the ground rush up and measures the distance as contracted: <M>L = 3250 / 5.03 ≈ 647 "m"</M>, a distance it can cover in 2.2 μs. Time dilation in one frame and length contraction in the other are two accounts of the same event, and they agree. Muons also give a direct measure of <M>γ</M> in accelerators, where they live exactly as long as time dilation says.
        </p>
      </section>

      <section className="t-section" id="t-addition">
        <SectionHead n={no('addition')} title="Adding velocities" />
        <p>
          The old rule <M>u = u′ + v</M> cannot be right at high speeds, or two ships moving at <M>0.8 c</M> could add up to more than light. Putting the new time and length into the argument gives the <strong>relativistic velocity addition</strong> formula for motion along a line:
        </p>
        <Eq src='u = [ u′ + v | 1 + [ u′ · v | c ^2 ] ]' />
        <p>
          For small speeds the second term in the bottom is tiny and we get the old rule back. For light, <M>u′ = c</M>, and the formula gives exactly <M>c</M> whatever <M>v</M> is:
        </p>
        <Eq src={['u = [ c + v | 1 + [ c · v | c ^2 ] ] = [ c + v | 1 + [ v | c ] ]', 'u = [ c · ( c + v ) | c + v ] = c']} />
        <figure className="t-figure">
          <Addition />
          <figcaption>A ship at 0.6 c fires a missile forward at 0.6 c relative to itself. The missile ends up at 0.88 c, and the light flash stays ahead. The hollow dot is what simple adding would claim.</figcaption>
        </figure>
        <p>This is the same story again. Something always has to give so that no one measures a speed above <M>c</M>, and what gives is the simple idea of adding speeds.</p>
      </section>

      <section className="t-section" id="t-energy">
        <SectionHead n={no('energy')} title="Mass and energy: E = mc²" />
        <p>
          Momentum conservation, which holds in every frame, forces a change to the idea of energy too. The result: a body of mass <M>m</M> and speed <M>v</M> has a total energy
        </p>
        <Eq src='E = γ · m · c ^2' />
        <p>
          At rest <M>γ = 1</M>, and the body still has energy. This is its <strong>rest energy</strong>, the most famous formula in physics:
        </p>
        <Eq src='E _0 = m · c ^2' />
        <p>
          Mass is a store of energy. The factor <M>c ^2</M> is enormous, so a tiny mass holds a huge energy. For an electron, with <M>m _e = 9.11 × 10 ^−31 "kg"</M> and <M>c = 2.998 × 10 ^8 "m/s"</M>:
        </p>
        <Eq src='m _e · c ^2 = 9.11 × 10 ^−31 · ( 2.998 × 10 ^8 ) ^2 = 8.19 × 10 ^−14 "J" = 0.511 "MeV"' />
        <figure className="t-figure">
          <Annihilation />
          <figcaption>An electron and a positron meet and vanish. Their rest energy, <M>2 · 0.511 "MeV"</M>, leaves as two photons.</figcaption>
        </figure>
        <p>
          The <strong>kinetic energy</strong> is what the body has beyond its rest energy:
        </p>
        <Eq src='K = E − E _0 = ( γ − 1 ) · m · c ^2' />
        <p>
          Does this match <M>[ 1 | 2 ] · m · v ^2</M> at low speeds? Use <M>γ ≈ 1 + [ 1 | 2 ] · β ^2</M>:
        </p>
        <Eq src='K = ( γ − 1 ) · m · c ^2 ≈ [ 1 | 2 ] · β ^2 · m · c ^2 = [ 1 | 2 ] · m · v ^2' />
        <p>Slow, it is the old formula. Fast, it is very different: as <M>v → c</M>, <M>γ</M> grows without limit, so the energy needed grows without limit too. That is why no body with mass can ever reach the speed of light.</p>
        <figure className="t-figure">
          <EnergySpeed />
          <figcaption>The two curves match at small speeds. Near <M>c</M> the true kinetic energy rises without limit, so extra energy goes mostly into <M>γ</M> and hardly into extra speed.</figcaption>
        </figure>
        <p>
          The idea reaches into nuclear physics. When a nucleus is held together, the whole weighs less than the parts, and the mass difference times <M>c ^2</M> is the binding energy. The Sun shines because it loses mass as it fuses hydrogen into helium.
        </p>
      </section>

      <section className="t-section" id="t-momentum">
        <SectionHead n={no('momentum')} title="Momentum and energy at high speed" />
        <p>
          Momentum must change as well. If we kept <M>p = m · v</M>, momentum conservation would fail in some frames. The version that works in every frame is
        </p>
        <Eq src='p = γ · m · v' />
        <p>
          At low speed <M>γ ≈ 1</M> and it is the old <M>m · v</M>. As <M>v → c</M>, <M>γ</M> blows up, so the momentum grows without limit. It takes ever more force and time to push a body faster.
        </p>
        <p>
          Energy and momentum are tied together. Start from <M>E = γ · m · c ^2</M> and <M>p · c = γ · m · v · c</M>, and form <M>E ^2 − ( p · c ) ^2</M>:
        </p>
        <Eq src={['E ^2 − ( p · c ) ^2 = γ ^2 · m ^2 · c ^4 · ( 1 − β ^2 )', 'γ ^2 · ( 1 − β ^2 ) = 1', 'E ^2 = ( p · c ) ^2 + ( m · c ^2 ) ^2']} />
        <p>
          The three quantities form a right triangle with the total energy <M>E</M> as the longest side. Its legs are <M>p · c</M> and the rest energy <M>m · c ^2</M>.
        </p>
        <figure className="t-figure">
          <EnergyTriangle />
          <figcaption>As the momentum grows, the total energy <M>E</M> climbs, but the rest energy <M>m · c ^2</M> stays fixed. At high momentum the triangle is long and thin, and <M>E ≈ p · c</M>.</figcaption>
        </figure>
        <p>
          Particles with no mass, such as photons, have <M>m = 0</M>. The triangle collapses to a line, so <M>E = p · c</M>, and they always move at exactly <M>c</M>:
        </p>
        <Eq src='p = [ E | c ]' />
        <p>A photon carries momentum, which is why light can push on a surface, even though it has no mass.</p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Speed of light', 'c = 3.00 × 10 ^8 "m/s"'],
                  ['Speed as a fraction of c', 'β = [ v | c ]'],
                  ['Lorentz factor', 'γ = [ 1 | √[ 1 − β ^2 ] ]'],
                  ['Time dilation', 'Δt = γ · Δt _0'],
                  ['Length contraction', 'L = [ L _0 | γ ]'],
                  ['Gap between two flashes', 'Δt = [ L · v | c ^2 − v ^2 ]'],
                  ['Velocity addition', 'u = [ u′ + v | 1 + [ u′ · v | c ^2 ] ]'],
                  ['Rest energy', 'E _0 = m · c ^2'],
                  ['Total energy', 'E = γ · m · c ^2'],
                  ['Kinetic energy', 'K = ( γ − 1 ) · m · c ^2'],
                  ['Momentum', 'p = γ · m · v'],
                  ['Energy and momentum', 'E ^2 = ( p · c ) ^2 + ( m · c ^2 ) ^2'],
                  ['Photon momentum', 'p = [ E | c ]'],
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
                  ['c', 'Speed of light in empty space', 'm/s'],
                  ['β', 'Speed as a fraction of c', 'none'],
                  ['γ', 'Lorentz factor', 'none'],
                  ['Δt _0', 'Proper time: measured by a clock at rest with the events', 's'],
                  ['L _0', 'Proper length: measured in the rest frame of the object', 'm'],
                  ['E', 'Total energy', 'J'],
                  ['K', 'Kinetic energy', 'J'],
                  ['p', 'Momentum', 'kg m/s'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{['m/s', 's', 'm', 'J'].includes(unit) ? <M>{`"${unit}"`}</M> : unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="A trip at 0.8 c">
          <p className="ex-q">A spaceship flies at 0.8 c. By clocks on the Earth, the trip takes 10 years. How long does it take by the ship&apos;s clocks?</p>
          <Given items={['v = 0.8 c', 'Δt = 10 "years"']} />
          <ol className="steps">
            <Step title="The Lorentz factor">
              <Eq src='γ = [ 1 | √[ 1 − 0.8 ^2 ] ] = [ 1 | √[ 0.36 ] ] = [ 1 | 0.6 ] = 1.667' />
            </Step>
            <Step title="Proper time on the ship">
              <Eq src='Δt _0 = [ Δt | γ ] = [ 10 | 1.667 ] = 6.0 "years"' />
            </Step>
          </ol>
          <Answer>6.0 years pass for the crew. The ship&apos;s clock is the moving one, and it shows the shorter time.</Answer>
          <figure className="t-figure">
            <ClockCompare />
          </figure>
        </Example>

        <Example n={2} title="The same trip, seen from the ship">
          <p className="ex-q">The destination is 8 light years away in the Earth&apos;s frame, and the ship goes at 0.8 c. How far is it in the ship&apos;s frame, and how long does the trip take there?</p>
          <Given items={['L _0 = 8 "light years"', 'v = 0.8 c']} />
          <ol className="steps">
            <Step title="Contracted distance">
              <Eq src='L = [ L _0 | γ ] = [ 8 | 1.667 ] = 4.8 "light years"' />
            </Step>
            <Step title="Time at 0.8 c">
              <Eq src='Δt _0 = [ L | v ] = [ 4.8 | 0.8 ] = 6.0 "years"' />
            </Step>
          </ol>
          <Answer>4.8 light years, covered in 6.0 years. The crew gets the same time as in Example 1, which is how the two pictures agree: the Earth says the clocks are slow, the ship says the distance is short.</Answer>
          <figure className="t-figure">
            <LengthContraction />
          </figure>
        </Example>

        <Example n={3} title="A muon reaches the ground">
          <p className="ex-q">A muon, mean life 2.2 μs at rest, moves at 0.98 c. How far does it travel before decaying, as measured on the ground, with and without time dilation? Use <M>c = 3.00 × 10 ^8 "m/s"</M>.</p>
          <Given items={['τ _0 = 2.2 "μs"', 'v = 0.98 c']} />
          <ol className="steps">
            <Step title="Without time dilation">
              <Eq src='d _1 = v · τ _0 = 0.98 · 3.00 × 10 ^8 · 2.2 × 10 ^−6 = 647 "m"' />
            </Step>
            <Step title="The Lorentz factor">
              <Eq src='γ = [ 1 | √[ 1 − 0.98 ^2 ] ] = [ 1 | √[ 0.0396 ] ] = [ 1 | 0.199 ] = 5.03' />
            </Step>
            <Step title="With time dilation">
              <Eq src='d _2 = v · γ · τ _0 = 5.03 · 647 ≈ 3250 "m"' />
            </Step>
          </ol>
          <Answer>About 647 m without relativity, and 3250 m (3.25 km) with it. The muon lives 5 times longer, as seen from the ground, so it goes 5 times farther.</Answer>
          <figure className="t-figure">
            <Muons />
          </figure>
        </Example>

        <Example n={4} title="Lightning at both ends of a train">
          <p className="ex-q">A lamp is in the middle of a train 100 m long (measured on the ground) that moves at 0.5 c. It flashes. By how much does the ground see the front wall hit later than the back wall?</p>
          <Given items={['L = 100 "m"', 'v = 0.5 c']} />
          <ol className="steps">
            <Step title="Back wall">
              <Eq src='Δt _back = [ L | 2 · ( c + v ) ] = [ 100 | 2 · 1.5 · 3.00 × 10 ^8 ] = 1.11 × 10 ^−7 "s"' />
            </Step>
            <Step title="Front wall">
              <Eq src='Δt _front = [ L | 2 · ( c − v ) ] = [ 100 | 2 · 0.5 · 3.00 × 10 ^8 ] = 3.33 × 10 ^−7 "s"' />
            </Step>
            <Step title="The gap">
              <Eq src={['Δt _front − Δt _back = 3.33 × 10 ^−7 − 1.11 × 10 ^−7 = 2.22 × 10 ^−7 "s"', '[ L · v | c ^2 − v ^2 ] = [ 100 · 1.5 × 10 ^8 | 9 × 10 ^16 − 2.25 × 10 ^16 ] = 2.22 × 10 ^−7 "s"']} />
            </Step>
          </ol>
          <Answer>The back wall is hit first and the front wall 222 ns later. On the train, the two hits are simultaneous.</Answer>
          <figure className="t-figure">
            <Simultaneity />
          </figure>
        </Example>

        <Example n={5} title="A missile fired from a fast ship">
          <p className="ex-q">A ship moves at 0.6 c relative to the ground and fires a missile forward at 0.6 c relative to the ship. How fast is the missile moving relative to the ground?</p>
          <Given items={['v = 0.6 c', 'u′ = 0.6 c']} />
          <ol className="steps">
            <Step title="Relativistic addition">
              <Eq src='u = [ u′ + v | 1 + [ u′ · v | c ^2 ] ] = [ 0.6 · c + 0.6 · c | 1 + 0.6 · 0.6 ] = [ 1.2 · c | 1.36 ]' />
            </Step>
            <Step title="Simplify">
              <Eq src='u = 0.882 · c' />
            </Step>
          </ol>
          <Answer>0.882 c, not 1.2 c. The missile is still slower than light.</Answer>
          <figure className="t-figure">
            <Addition />
          </figure>
        </Example>

        <Example n={6} title="The Sun loses mass">
          <p className="ex-q">The Sun radiates energy at a rate of <M>3.8 × 10 ^26 "W"</M>. How much mass does it lose each second?</p>
          <Given items={['P = 3.8 × 10 ^26 "W"', 'c = 3.00 × 10 ^8 "m/s"']} />
          <ol className="steps">
            <Step title="Energy per second">
              <Eq src='E = P · t = 3.8 × 10 ^26 "J" "in each second"' />
            </Step>
            <Step title="Mass from E = mc²">
              <Eq src='m = [ E | c ^2 ] = [ 3.8 × 10 ^26 | 9.0 × 10 ^16 ] = 4.2 × 10 ^9 "kg"' />
            </Step>
          </ol>
          <Answer>About 4.2 × 10⁹ kg every second, over four million tonnes. The Sun is so massive (2 × 10³⁰ kg) that this loss is a tiny fraction of its mass.</Answer>
          <figure className="t-figure">
            <Annihilation />
          </figure>
        </Example>

        <Example n={7} title="A 1 MeV electron">
          <p className="ex-q">An electron has a kinetic energy of 1.00 MeV. Its rest energy is 0.511 MeV. Find its total energy, its Lorentz factor, its speed and its momentum.</p>
          <Given items={['K = 1.00 "MeV"', 'm · c ^2 = 0.511 "MeV"']} />
          <ol className="steps">
            <Step title="Total energy">
              <Eq src='E = K + m · c ^2 = 1.00 + 0.511 = 1.511 "MeV"' />
            </Step>
            <Step title="Lorentz factor">
              <Eq src='γ = [ E | m · c ^2 ] = [ 1.511 | 0.511 ] = 2.957' />
            </Step>
            <Step title="Speed">
              <Eq src='β = √[ 1 − [ 1 | γ ^2 ] ] = √[ 1 − [ 1 | 8.74 ] ] = 0.941' />
            </Step>
            <Step title="Momentum">
              <Eq src='p · c = √[ E ^2 − ( m · c ^2 ) ^2 ] = √[ 2.283 − 0.261 ] = 1.42 "MeV"' />
            </Step>
          </ol>
          <Answer>
            Total energy 1.511 MeV, <M>γ = 2.96</M>, speed 0.941 c and momentum 1.42 MeV/c. The old formula <M>[ 1 | 2 ] · m · v ^2</M> would give <M>v = √[ 2 · K / m ] = 1.98 · c</M>, faster than light, which is impossible.
          </Answer>
          <figure className="t-figure">
            <EnergyTriangle />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Moving clocks run fast" wrong="Δt _0 = γ · Δt" fig={<ClockCompare height={215} />}>
            The proper time <M>Δt _0</M> is the shortest. A clock that moves relative to you ticks slowly, so the time you measure between its ticks is longer: <M>Δt = γ · Δt _0</M>.
          </Mistake>
          <Mistake title="A moving object gets longer" wrong="L = γ · L _0" fig={<LengthContraction height={215} />}>
            Lengths measured along the motion get shorter: <M>L = L _0 / γ</M>, where <M>L _0</M> is the proper length. Across the motion nothing changes.
          </Mistake>
          <Mistake title="Time dilation is just a trick of the signal delay" wrong={'"slow clocks" = "late signals"'} fig={<LightClock />}>
            Light delay is not the cause. We allow for it, and the effect is still there. The moving clock really does tick more slowly in our frame, whichever way it is moving.
          </Mistake>
          <Mistake title="Two events at the same time are at the same time for all" wrong={'"at the same time" = "for every observer"'} fig={<Simultaneity />}>
            Simultaneity is relative. Events that are simultaneous but happen at different places in one frame are not simultaneous in a frame moving along the line joining them.
          </Mistake>
          <Mistake title="Speeds simply add" wrong={'u = 0.8 c + 0.8 c = 1.6 c'} fig={<Addition height={190} />}>
            At speeds close to <M>c</M> the formula <M>u = ( u′ + v ) / ( 1 + u′ · v / c ^2 )</M> is needed. Two speeds of 0.8 c combine to 0.976 c, never more than <M>c</M>.
          </Mistake>
          <Mistake title="Kinetic energy is still half m v squared" wrong={'K = [ 1 | 2 ] · m · v ^2  "at 0.9 c"'} fig={<EnergySpeed height={230} />}>
            The old formula works only for speeds much less than <M>c</M>. At 0.9 c it gives 0.405 m c², but the true value is (γ − 1) m c² = 1.29 m c², over three times larger.
          </Mistake>
          <Mistake title="E = mc² holds only for bombs" wrong={'E = m · c ^2  "only for explosions"'} fig={<Annihilation />}>
            Every body at rest has the energy <M>m · c ^2</M>, and any change of energy comes with a change of mass, however small. A hot cup of tea weighs a little more than a cold one. Nuclear reactions simply make the change large enough to measure easily.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Hold the speed of light fixed, and time, length and energy must bend to fit.</p>
        <p className="closing-sub">Next: the nucleus. The mass that goes missing when nucleons bind together is exactly the energy that holds them, and the relation <M>E = m · c ^2</M> tells you how much.</p>
      </footer>
    </ChapterShell>
  );
}
