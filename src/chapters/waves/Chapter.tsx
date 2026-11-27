import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Anim, Block, Fig, Label, Line, Pulley, Trail, Wall } from '../kit/Anim';
import { Mistake, Mistakes } from '../kit/Mistake';
import { X0, beatsFig, dopplerObserver, dopplerSource, longitudinal, pipeRow, pts, pulsesFig, reflRow, ropeRows, ropeWave, soundRows, speedFig, stand, transverse, travelFig } from './anims';

/** Waves: what travels, the wave equation, sound, superposition, standing waves, beats and the Doppler effect. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'What a wave carries', group: 'Theory' },
  { id: 'types', title: 'Transverse and longitudinal', group: 'Theory' },
  { id: 'travelling', title: 'The travelling wave', group: 'Theory' },
  { id: 'speed', title: 'Wave speed', group: 'Theory' },
  { id: 'medium', title: 'Speed in a string and in air', group: 'Theory' },
  { id: 'superposition', title: 'Superposition and interference', group: 'Theory' },
  { id: 'reflection', title: 'Reflection', group: 'Theory' },
  { id: 'standing', title: 'Standing waves on a string', group: 'Theory' },
  { id: 'pipes', title: 'Air columns', group: 'Theory' },
  { id: 'beats', title: 'Beats', group: 'Theory' },
  { id: 'doppler', title: 'The Doppler effect', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];
const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="waves" sections={SECTIONS} sideTitle="Waves" sideLead="How a disturbance travels without anything travelling with it: wavelength, speed, standing waves, sound, beats and the Doppler effect.">
      <header className="article-head">
        <span className="kicker">Physics · Oscillations and waves</span>
        <h1 className="article-title">How does a shake travel across a rope without the rope going anywhere?</h1>
        <p className="article-lead">Flick one end of a rope and a bump races to the other end, yet every piece of rope only moves up and down. A wave carries energy, not matter. This chapter builds the whole subject from that one picture.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="What a wave carries" />
        <p>
          A wave is a <strong>disturbance that travels</strong>. Each bit of the medium (rope, water, air) is pushed a little way from its rest position and then returns, but it passes the push on to its neighbour. The pattern moves on; the material stays about where it was.
        </p>
        <Fig caption="The marked particle just bobs up and down. What moves along the rope is the shape, and the energy that comes with it.">
          <Anim title="A wave runs along a rope while one marked particle only moves up and down" loop={4} height={210}>
            {(t) => ropeWave(t)}
          </Anim>
        </Fig>
        <p>
          So a wave <strong>carries energy and momentum from place to place without carrying matter</strong>. A cork on the sea rises and falls as swells pass and ends up where it began, while the swell can cross an ocean.
        </p>
        <Note label="Two kinds of wave">Mechanical waves (rope, sound, water) need a medium to travel in. Light and radio waves do not; they travel through empty space. This chapter is about mechanical waves.</Note>
      </section>

      <section className="t-section" id="t-types">
        <SectionHead n={no('types')} title="Transverse and longitudinal" />
        <p>
          The two basic kinds differ in how the particles move compared with how the wave moves.
        </p>
        <ul className="t-list">
          <li>
            <strong>Transverse</strong>: particles move at right angles to the direction of travel. Waves on a rope or string, and light, are like this.
          </li>
          <li>
            <strong>Longitudinal</strong>: particles move back and forth along the direction of travel. Sound in air and a push along a slinky are like this.
          </li>
        </ul>
        <Fig caption="Transverse: the particle moves up and down, the wave moves right.">
          <Anim title="A transverse wave: particles move up and down while the wave moves right" loop={4} height={165}>
            {(t) => transverse(t)}
          </Anim>
        </Fig>
        <Fig caption="Longitudinal: the particle moves left and right, along the wave. Squeezed regions are compressions, spread-out regions are rarefactions.">
          <Anim title="A longitudinal slinky wave with compressions and rarefactions moving right" loop={4} height={185}>
            {(t) => longitudinal(t)}
          </Anim>
        </Fig>
        <p>
          Sound is a series of compressions and rarefactions: regions of slightly higher and lower pressure that move through the air. A longitudinal wave can travel in solids, liquids and gases; a transverse wave needs a medium that resists shearing, so it cannot travel inside a gas.
        </p>
      </section>

      <section className="t-section" id="t-travelling">
        <SectionHead n={no('travelling')} title="The travelling wave" />
        <p>
          A steady sine wave moving to the right has a displacement that depends on both position <M>x</M> and time <M>t</M>:
        </p>
        <Eq src='y = A · sin ( k · x − ω · t )' />
        <Fig caption="The wave keeps its shape and slides right. The amplitude A is the largest displacement; the wavelength λ is the distance between neighbouring crests.">
          <Anim title="A sine wave with its amplitude and wavelength marked, moving to the right" loop={4} height={230}>
            {(t) => travelFig(t)}
          </Anim>
        </Fig>
        <ul className="t-list">
          <li>
            <M>A</M>, the <strong>amplitude</strong>: the greatest displacement from rest.
          </li>
          <li>
            <M>λ</M>, the <strong>wavelength</strong>: the length of one full wave. The <strong>wave number</strong> is <M>k = [ 2 · π | λ ]</M> (radians per metre).
          </li>
          <li>
            <M>T</M> and <M>f</M>, the <strong>period</strong> and <strong>frequency</strong>: <M>f = [ 1 | T ]</M>. The <strong>angular frequency</strong> is <M>ω = 2 · π · f</M>.
          </li>
        </ul>
        <p>
          Fix one position <M>x</M> and the formula is just simple harmonic motion in time. Freeze time and it is a sine curve in space. A wave moving the other way has <M>k · x + ω · t</M> instead.
        </p>
      </section>

      <section className="t-section" id="t-speed">
        <SectionHead n={no('speed')} title="Wave speed" />
        <p>
          In one period <M>T</M> the pattern moves forward by exactly one wavelength. So the speed of the wave is
        </p>
        <Eq src='v = [ λ | T ] = f · λ'>
          <span>
            Equivalently <M>v = [ ω | k ]</M>.
          </span>
        </Eq>
        <Fig caption="A crest moves one wavelength per period. Count the crests passing the dashed line: one every T seconds.">
          <Anim title="A crest is followed along; a counter ticks once for each wave that passes a fixed point" loop={6} height={225}>
            {(t) => speedFig(t)}
          </Anim>
        </Fig>
        <p>
          Important: the <strong>speed is set by the medium</strong>, not by the source. Shaking the end of a rope faster raises <M>f</M>, but the waves then get shorter so that <M>f · λ</M> stays the same.
        </p>
      </section>

      <section className="t-section" id="t-medium">
        <SectionHead n={no('medium')} title="Speed in a string and in air" />
        <p>
          On a stretched string the pulse is faster if the string is pulled tighter (tension <M>T</M>) and slower if it is heavier (mass per unit length <M>μ</M>):
        </p>
        <Eq src='v = √[ [ T | μ ] ]' />
        <Fig caption="Same string, tension four times as large: the pulse is twice as fast.">
          <Anim title="Two strings with the same mass per length: the tighter one carries a pulse twice as fast" loop={6} height={225}>
            {(t) =>
              ropeRows(t, [
                { v: 200, label: 'tension 400 N', val: 'v = 200 m/s' },
                { v: 100, label: 'tension 100 N', val: 'v = 100 m/s' },
              ])
            }
          </Anim>
        </Fig>
        <p>
          For sound in a gas, the same idea (springiness over inertia) gives <M>v = √[ [ B | ρ ] ]</M> with <M>B</M> the bulk modulus. Newton assumed the air stays at constant temperature during each squeeze, so <M>B = P</M>:
        </p>
        <Eq src={['v = √[ [ P | ρ ] ] ≈ 280 "m/s" (Newton)', 'v = √[ [ γ · P | ρ ] ] ≈ 332 "m/s" (Laplace)']}>
          <span>
            for air at 0 °C and atmospheric pressure (P = 1.01 × 10⁵ Pa, ρ = 1.29 kg/m³, γ = 1.4).
          </span>
        </Eq>
        <Fig caption="Newton's value is too low. Laplace saw that compressions are too quick for heat to flow away, so the squeeze is adiabatic and B = γ·P, which matches the measured speed.">
          <Anim title="Two sound pulses racing along air: Laplace's value is faster than Newton's and matches experiment" loop={5} height={180}>
            {(t) => soundRows(t)}
          </Anim>
        </Fig>
        <p>
          In air the speed grows with temperature: about <M>331 + 0.6 · θ "m/s"</M> with <M>θ</M> in °C, which is 343 m/s at 20 °C. It does not depend on pressure alone, or on frequency.
        </p>
      </section>

      <section className="t-section" id="t-superposition">
        <SectionHead n={no('superposition')} title="Superposition and interference" />
        <p>
          When two waves meet in the same place, the medium simply adds their displacements. This is the <strong>principle of superposition</strong>:
        </p>
        <Eq src='y = y _1 + y _2' />
        <p>
          The waves then carry on exactly as if they had never met. Two bumps on the same side add up to a bigger bump: <strong>constructive interference</strong>.
        </p>
        <Fig caption="Two upward pulses overlap and add to a pulse twice as tall, then pass through each other.">
          <Anim title="Two pulses on the same side pass through each other and add" loop={9} height={190}>
            {(t) => pulsesFig(t, 1)}
          </Anim>
        </Fig>
        <p>A bump meeting a dip cancel where they overlap: <strong>destructive interference</strong>. The energy has not vanished: it is stored in the motion of the rope, and the pulses re-emerge unchanged.</p>
        <Fig caption="An upward and a downward pulse cancel for a moment: the rope is flat, then both pulses appear again.">
          <Anim title="An upward and a downward pulse cancel as they overlap, then continue" loop={9} height={190}>
            {(t) => pulsesFig(t, -1)}
          </Anim>
        </Fig>
        <p>
          For two continuous waves from sources a distance apart, the path difference <M>Δ</M> decides: if <M>Δ = n · λ</M> (whole wavelengths) crests meet crests and the sum is large; if <M>Δ = ( n + ½ ) · λ</M> crests meet troughs and the sum is small.
        </p>
      </section>

      <section className="t-section" id="t-reflection">
        <SectionHead n={no('reflection')} title="Reflection" />
        <p>
          When a wave reaches the end of its medium it bounces back. What the reflected pulse looks like depends on the end.
        </p>
        <ul className="t-list">
          <li>
            <strong>Fixed end</strong> (tied to a wall): the wall pulls the rope back down as the bump arrives, so the pulse returns <strong>inverted</strong>. There is a phase change of 180°.
          </li>
          <li>
            <strong>Free end</strong> (a ring sliding on a pole): the end is free to swing up, so the pulse returns <strong>upright</strong>, with no phase change.
          </li>
        </ul>
        <Fig caption="Top: fixed end, the pulse comes back upside down. Bottom: free end, it comes back the right way up. At the free end the ring rises to twice the height for a moment.">
          <Anim title="A pulse reflecting at a fixed end, inverted, and at a free end, upright" loop={9} height={290}>
            {(t) => (
              <>
                {reflRow(t, 80, true, 'fixed end: inverted')}
                {reflRow(t, 215, false, 'free end: upright')}
              </>
            )}
          </Anim>
        </Fig>
        <p>The speed and the shape are unchanged by the reflection. Sound reflects in the same way, which is why you hear echoes.</p>
      </section>

      <section className="t-section" id="t-standing">
        <SectionHead n={no('standing')} title="Standing waves on a string" />
        <p>
          A wave going one way and its reflection coming back, both of the same frequency, add up to a <strong>standing wave</strong>: a pattern that does not travel, it just swells and shrinks in place.
        </p>
        <Eq src='y = 2 · A · sin ( k · x ) · cos ( ω · t )' />
        <p>
          Some points never move (<strong>nodes</strong>, where <M>sin ( k · x ) = 0</M>) and some swing the most (<strong>antinodes</strong>). Neighbouring nodes are half a wavelength apart.
        </p>
        <p>
          A string of length <M>L</M> fixed at both ends must have a node at each end, so a whole number of half-wavelengths fit in it: <M>L = n · [ λ | 2 ]</M>. With <M>v = f · λ</M> that gives the allowed frequencies, the <strong>harmonics</strong>:
        </p>
        <Eq src='f _n = n · [ v | 2 · L ] ,  n = 1, 2, 3, …'>
          <span>
            The first, <M>f _1 = [ v | 2 · L ]</M>, is the <strong>fundamental</strong>. All the others are whole-number multiples of it.
          </span>
        </Eq>
        <Fig caption="The first three harmonics. Open circles are nodes. Each harmonic has one more loop and one more node, and vibrates faster.">
          <Anim title="Standing waves on a string for the first three harmonics, with nodes marked" loop={4} height={320}>
            {(t) => (
              <>
                {stand(t, 62, 1, 'n = 1: λ = 2L')}
                {stand(t, 165, 2, 'n = 2: λ = L')}
                {stand(t, 268, 3, 'n = 3: λ = 2L / 3')}
              </>
            )}
          </Anim>
        </Fig>
        <p>
          Plucking a guitar string excites many harmonics at once. A shorter, tighter or lighter string raises <M>f _1</M>, since <M>v = √[ [ T | μ ] ]</M>.
        </p>
      </section>

      <section className="t-section" id="t-pipes">
        <SectionHead n={no('pipes')} title="Air columns" />
        <p>
          The air in a pipe works the same way, with sound waves bouncing between the ends. The rule for the ends is different from a fixed string: air can move freely at an open end (a displacement <strong>antinode</strong>) and cannot move at a closed end (a displacement <strong>node</strong>).
        </p>
        <Fig caption="Fundamental modes. In the open pipe both ends are antinodes: L = λ/2. In the closed pipe one end is a node and the other an antinode: L = λ/4. The dashed curves show how far the air swings at each point.">
          <Anim title="An open pipe and a closed pipe vibrating in their fundamental, with displacement envelopes" loop={4} height={300}>
            {(t) => (
              <>
                {pipeRow(t, 92, 'open', 1, 'open pipe, n = 1')}
                {pipeRow(t, 232, 'closed', 1, 'closed pipe, n = 1')}
              </>
            )}
          </Anim>
        </Fig>
        <Eq src={['f _n = n · [ v | 2 · L ] ,  n = 1, 2, 3, …  "(open pipe)"', 'f _n = n · [ v | 4 · L ] ,  n = 1, 3, 5, …  "(closed pipe)"']}>
          <span>An open pipe has every harmonic. A closed pipe has only the odd ones, and its fundamental is half as high as an open pipe of the same length.</span>
        </Eq>
        <Fig caption="Next modes: the open pipe's second harmonic (2f₁) and the closed pipe's third (3f₁). N marks a node, A an antinode.">
          <Anim title="The second harmonic of an open pipe and the third harmonic of a closed pipe" loop={4} height={300}>
            {(t) => (
              <>
                {pipeRow(t, 92, 'open', 2, 'open pipe, n = 2')}
                {pipeRow(t, 232, 'closed', 3, 'closed pipe, n = 3')}
              </>
            )}
          </Anim>
        </Fig>
      </section>

      <section className="t-section" id="t-beats">
        <SectionHead n={no('beats')} title="Beats" />
        <p>
          Sound two notes of nearly the same frequency together and the loudness rises and falls: wow, wow, wow. These are <strong>beats</strong>. The two waves drift in and out of step; where crests meet crests the sum is loud, where they meet troughs it is quiet.
        </p>
        <Fig caption="The sum swells and fades inside a slowly varying envelope. In this one-second window f₁ = 8 and f₂ = 10 give 2 beats.">
          <Anim title="Two waves of slightly different frequency adding into a pulsing envelope" loop={7} height={255}>
            {(t) => beatsFig(t, 8, 10, 'one second, not to scale: 2 beats')}
          </Anim>
        </Fig>
        <p>The number of loud pulses per second is the difference of the two frequencies:</p>
        <Eq src='f _beat = "|" f _1 − f _2 "|"'>
          <span>The ear hears the average pitch, with the loudness pulsing at the beat frequency. Piano tuners listen for beats to slow to zero.</span>
        </Eq>
      </section>

      <section className="t-section" id="t-doppler">
        <SectionHead n={no('doppler')} title="The Doppler effect" />
        <p>
          A siren sounds higher as it comes toward you and lower as it goes away. The source emits at one frequency, but its motion changes how the wavefronts arrive.
        </p>
        <p>
          <strong>Moving source.</strong> Each wavefront spreads out in a circle from where it was emitted, but the source keeps moving. Ahead of it the circles bunch up (shorter wavelength, higher pitch); behind it they stretch out (longer wavelength, lower pitch).
        </p>
        <Fig caption="A source moving right at half the speed of sound. Wavefronts are squeezed ahead of it and spread out behind.">
          <Anim title="A moving source with bunched wavefronts ahead and stretched wavefronts behind" loop={7} height={300}>
            {(t) => dopplerSource(t, 0.5, 'ahead: bunched, higher f', 'behind: stretched, lower f')}
          </Anim>
        </Fig>
        <p>
          <strong>Moving observer.</strong> If the source is still but you walk toward it, you meet the crests more often, so you hear a higher frequency. Walk away and you meet them less often.
        </p>
        <Fig caption="Same wavefronts, two listeners. The one walking toward the source meets more crests each second.">
          <Anim title="An observer at rest and one moving toward the source count the crests that reach them" loop={7} height={235}>
            {(t) => dopplerObserver(t)}
          </Anim>
        </Fig>
        <p>With sound speed <M>v</M>, source speed <M>v _s</M> and observer speed <M>v _o</M>:</p>
        <Eq src='f _heard = f · [ v + v _o | v − v _s ]'>
          <span>
            Take <M>v _o</M> as positive when the observer moves <em>toward</em> the source, and <M>v _s</M> as positive when the source moves <em>toward</em> the observer. Reverse a sign for motion away.
          </span>
        </Eq>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Travelling wave', 'y = A · sin ( k · x − ω · t )'],
                  ['Wave number', 'k = [ 2 · π | λ ]'],
                  ['Angular frequency', 'ω = 2 · π · f = [ 2 · π | T ]'],
                  ['Wave speed', 'v = f · λ = [ ω | k ]'],
                  ['Speed on a string', 'v = √[ [ T | μ ] ]'],
                  ['Sound, Newton (isothermal)', 'v = √[ [ P | ρ ] ]'],
                  ['Sound, Laplace (adiabatic)', 'v = √[ [ γ · P | ρ ] ]'],
                  ['Superposition', 'y = y _1 + y _2'],
                  ['Constructive, path difference', 'Δ = n · λ'],
                  ['Destructive, path difference', 'Δ = ( n + ½ ) · λ'],
                  ['Standing wave', 'y = 2 · A · sin ( k · x ) · cos ( ω · t )'],
                  ['String, fixed both ends', 'f _n = n · [ v | 2 · L ]'],
                  ['Open pipe', 'f _n = n · [ v | 2 · L ] , n = 1, 2, 3, …'],
                  ['Closed pipe', 'f _n = n · [ v | 4 · L ] , n = 1, 3, 5, …'],
                  ['Beats', 'f _beat = "|" f _1 − f _2 "|"'],
                  ['Doppler', 'f _heard = f · [ v + v _o | v − v _s ]'],
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
                  ['A', 'amplitude', 'm'],
                  ['λ', 'wavelength', 'm'],
                  ['k', 'wave number', 'rad/m'],
                  ['f, T', 'frequency, period', 'Hz, s'],
                  ['ω', 'angular frequency', 'rad/s'],
                  ['v', 'wave speed', 'm/s'],
                  ['T', 'tension (on a string)', 'N'],
                  ['μ', 'mass per unit length', 'kg/m'],
                  ['L', 'length of string or pipe', 'm'],
                  ['n', 'harmonic number', '–'],
                ] as const
              ).map(([s, m, u]) => (
                <tr key={s}>
                  <th scope="row">
                    <M>{s}</M>
                  </th>
                  <td>{m}</td>
                  <td>{u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Wavelength of a note">
          <p className="ex-q">Middle C is about 256 Hz. What is its wavelength in air, where sound travels at 343 m/s?</p>
          <Given items={['f = 256 "Hz"', 'v = 343 "m/s"']} />
          <ol className="steps">
            <Step title="Use v = f · λ">
              <Eq src='λ = [ v | f ] = [ 343 | 256 ] = 1.34 "m"' />
            </Step>
          </ol>
          <Answer>About 1.34 m. Low notes have wavelengths as long as a person; a 20 kHz note is only 1.7 cm.</Answer>
          <Fig>
            <Anim title="A wave with a wavelength of 1.34 metres moving at 343 metres per second" loop={4} height={215}>
              {(t) => travelFig(t, 'λ = 1.34 m', 'A', 'f = 256 Hz, v = 343 m/s')}
            </Anim>
          </Fig>
        </Example>

        <Example n={2} title="Speed on a string">
          <p className="ex-q">A string of mass per unit length 0.01 kg/m is held under a tension of 100 N by a hanging weight. How fast does a pulse travel? How long does it take to cross 2 m?</p>
          <Given items={['T = 100 "N"', 'μ = 0.01 "kg/m"', 'd = 2 "m"']} />
          <ol className="steps">
            <Step title="Speed from tension and mass per length">
              <Eq src='v = √[ [ T | μ ] ] = √[ [ 100 | 0.01 ] ] = √[ 10 000 ] = 100 "m/s"' />
            </Step>
            <Step title="Time to cross">
              <Eq src='t = [ d | v ] = [ 2 | 100 ] = 0.02 "s"' />
            </Step>
          </ol>
          <Answer>100 m/s, so the pulse crosses 2 m in 0.02 s. Quadruple the tension and the speed only doubles.</Answer>
          <Fig>
            <Anim title="A pulse runs along a string held taut by a hanging weight" loop={5} height={250}>
              {(t) => {
                const cy = 80;
                const xc = X0 + 140 * t;
                return (
                  <>
                    <Wall x={X0} y1={cy - 24} y2={cy + 24} />
                    <Line x1={X0} y1={cy} x2={560} y2={cy} dashed tone="faint" />
                    <Trail points={pts((x) => cy - 34 * Math.exp(-(((x - xc) / 26) ** 2)), X0, 560, 200)} />
                    <Pulley x={560} y={cy - 0} r={14} />
                    <Line x1={574} y1={cy} x2={574} y2={170} tone="bright" />
                    <Block x={574} y={190} w={44} h={34} label="T" />
                    <Label x={500} y={208} kind="val" anchor="end">
                      T = 100 N, μ = 0.01 kg/m
                    </Label>
                    <Label x={X0 + 10} y={130} kind="val" anchor="start">
                      v = 100 m/s
                    </Label>
                  </>
                );
              }}
            </Anim>
          </Fig>
        </Example>

        <Example n={3} title="Harmonics of a guitar string">
          <p className="ex-q">A guitar string is 0.65 m long, fixed at both ends, and waves travel along it at 286 m/s. Find the fundamental and the next two harmonics, and say where the nodes of the third harmonic are.</p>
          <Given items={['L = 0.65 "m"', 'v = 286 "m/s"']} />
          <ol className="steps">
            <Step title="Fundamental">
              <Eq src='f _1 = [ v | 2 · L ] = [ 286 | 2 · 0.65 ] = 220 "Hz"' />
            </Step>
            <Step title="Harmonics are whole-number multiples">
              <Eq src='f _2 = 2 · 220 = 440 "Hz" ,  f _3 = 3 · 220 = 660 "Hz"' />
            </Step>
            <Step title="Nodes of the third harmonic">
              <p>Three half-wavelengths fit in the string, so the nodes are spaced <M>[ L | 3 ] = 0.217 "m"</M> apart: at 0.217 m and 0.433 m from one end, besides the two ends.</p>
            </Step>
          </ol>
          <Answer>220 Hz, 440 Hz and 660 Hz. Touching the string lightly at 0.217 m (a node of the third harmonic) lets only modes with a node there ring, giving the ringing "harmonic" of a guitar.</Answer>
          <Fig>
            <Anim title="The string vibrating in its first, second and third harmonic in turn" loop={9} height={140}>
              {(t) => {
                const n = Math.min(3, Math.floor(t / 3) + 1);
                const f = [220, 440, 660][n - 1];
                return stand(t, 75, n, `n = ${n}: ${f} Hz`);
              }}
            </Anim>
          </Fig>
        </Example>

        <Example n={4} title="A closed pipe">
          <p className="ex-q">A pipe 0.5 m long is closed at one end. Find its fundamental and next harmonic, and compare with the same pipe open at both ends. Take v = 343 m/s.</p>
          <Given items={['L = 0.5 "m"', 'v = 343 "m/s"']} />
          <ol className="steps">
            <Step title="Closed pipe: node at one end, antinode at the other, so L = λ / 4">
              <Eq src='f _1 = [ v | 4 · L ] = [ 343 | 4 · 0.5 ] = 171.5 "Hz"' />
            </Step>
            <Step title="Only odd harmonics">
              <Eq src='f _3 = 3 · 171.5 = 514.5 "Hz" ,  f _5 = 857.5 "Hz"' />
            </Step>
            <Step title="Same pipe, open at both ends">
              <Eq src='f _1 = [ v | 2 · L ] = [ 343 | 2 · 0.5 ] = 343 "Hz"' />
            </Step>
          </ol>
          <Answer>171.5 Hz, then 514.5 Hz. Closing one end halves the fundamental of the open pipe (343 Hz) and removes the even harmonics.</Answer>
          <Fig>
            <Anim title="A closed pipe vibrating at its fundamental of 171.5 hertz, then at 514.5 hertz" loop={8} height={170}>
              {(t) => (t < 4 ? pipeRow(t, 70, 'closed', 1, 'closed, 0.5 m: 171.5 Hz') : pipeRow(t, 70, 'closed', 3, 'third harmonic: 514.5 Hz'))}
            </Anim>
          </Fig>
        </Example>

        <Example n={5} title="Beats between two notes">
          <p className="ex-q">Two tuning forks sound at 440 Hz and 444 Hz together. How many beats per second are heard, and how long is one beat?</p>
          <Given items={['f _1 = 440 "Hz"', 'f _2 = 444 "Hz"']} />
          <ol className="steps">
            <Step title="Beat frequency">
              <Eq src='f _beat = "|" f _1 − f _2 "|" = "|" 440 − 444 "|" = 4 "Hz"' />
            </Step>
            <Step title="Time between loud beats">
              <Eq src='T _beat = [ 1 | f _beat ] = [ 1 | 4 ] = 0.25 "s"' />
            </Step>
          </ol>
          <Answer>4 beats per second, one every 0.25 s. If you tighten the lower fork the beats slow down as the pitches match, and stop at 444 Hz.</Answer>
          <Fig>
            <Anim title="Two waves 4 hertz apart giving 4 beats in one second" loop={7} height={255}>
              {(t) => beatsFig(t, 11, 15, 'one second, not to scale: 4 beats')}
            </Anim>
          </Fig>
        </Example>

        <Example n={6} title="A siren going by">
          <p className="ex-q">A siren sounds at 500 Hz and drives toward you at 30 m/s (sound speed 343 m/s). What frequency do you hear as it approaches, and as it drives away? What if instead you ran toward a stationary siren at 30 m/s?</p>
          <Given items={['f = 500 "Hz"', 'v _s = 30 "m/s"', 'v = 343 "m/s"']} />
          <ol className="steps">
            <Step title="Source approaching">
              <Eq src='f _heard = f · [ v | v − v _s ] = 500 · [ 343 | 343 − 30 ] = 548 "Hz"' />
            </Step>
            <Step title="Source receding">
              <Eq src='f _heard = f · [ v | v + v _s ] = 500 · [ 343 | 343 + 30 ] = 460 "Hz"' />
            </Step>
            <Step title="You moving toward a stationary source">
              <Eq src='f _heard = f · [ v + v _o | v ] = 500 · [ 343 + 30 | 343 ] = 544 "Hz"' />
            </Step>
          </ol>
          <Answer>548 Hz approaching and 460 Hz receding. Running at the siren gives 544 Hz: close, but not equal, because moving source and moving observer are not symmetric.</Answer>
          <Fig>
            <Anim title="A siren moving at about a ninth of the speed of sound: wavefronts slightly bunched ahead and stretched behind" loop={7} height={300}>
              {(t) => dopplerSource(t, 30 / 343, 'ahead: 548 Hz', 'behind: 460 Hz')}
            </Anim>
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake
            title="The medium travels with the wave"
            wrong="particles move along with the wave"
            fig={
              <Anim title="A cork stays in place on a wave, bobbing only up and down" loop={4} height={150}>
                {(t) => ropeWave(t, { cy: 65, A: 26, note: 'the cork stays put', notes: false })}
              </Anim>
            }
          >
            Each particle oscillates about its own rest position. Only the pattern, and the energy, travel.
          </Mistake>
          <Mistake
            title="A higher frequency means a faster wave"
            wrong="f up, so v up"
            fig={
              <Anim title="A long wave and a short wave with crests moving at the same speed" loop={5} height={190}>
                {(t) => {
                  const xc = 70 + 100 * t;
                  const row = (cy: number, lam: number, name: string) => (
                    <g>
                      <Trail points={pts((x) => cy - 26 * Math.cos(((2 * Math.PI) / lam) * (x - xc)), X0, 600, 220)} />
                      <Line x1={xc} y1={cy - 26} x2={xc} y2={cy + 26} dashed tone="faint" />
                      <Label x={X0} y={cy + 44} kind="label" anchor="start">
                        {name}
                      </Label>
                    </g>
                  );
                  return (
                    <>
                      {row(45, 200, 'low f, long λ')}
                      {row(140, 100, 'high f, short λ')}
                    </>
                  );
                }}
              </Anim>
            }
          >
            The medium sets the speed. A higher <M>f</M> gives a shorter <M>λ</M> with <M>v = f · λ</M> unchanged. The speed changes only if the medium does (tension, temperature).
          </Mistake>
          <Mistake
            title="A closed pipe has every harmonic"
            wrong="f _n = n · [ v | 4 · L ] for every n"
            fig={
              <Anim title="A closed pipe can ring at the first and third harmonics but not at twice the fundamental" loop={6} height={150}>
                {(t) => {
                  const m = t < 2 ? 1 : t < 4 ? 2 : 3;
                  return (
                    <>
                      {m === 2 ? (
                        <>
                          {pipeRow(t, 62, 'closed', 2, 'n = 2 would need a node at the open end: not allowed')}
                        </>
                      ) : (
                        pipeRow(t, 62, 'closed', m, `n = ${m}: allowed`)
                      )}
                    </>
                  );
                }}
              </Anim>
            }
          >
            A closed end must be a node and the open end an antinode. Only odd multiples of the fundamental fit: 1, 3, 5, … The even ones would put a node at the open end.
          </Mistake>
          <Mistake
            title="The beat frequency is the sum or the average"
            wrong="f _beat = f _1 + f _2"
            fig={
              <Anim title="Two waves 4 hertz apart give only 4 beats per second" loop={7} height={255}>
                {(t) => beatsFig(t, 11, 15, '440 and 444 Hz: 4 beats, not 884')}
              </Anim>
            }
          >
            The loudness pulses once each time the waves slip a whole cycle apart, so the rate is the <em>difference</em>, <M>"|" f _1 − f _2 "|"</M>.
          </Mistake>
          <Mistake
            title="A fixed end sends the pulse back upright"
            wrong="reflected pulse has the same sign"
            fig={
              <Anim title="At a fixed end the reflected pulse comes back upside down" loop={9} height={140}>
                {(t) => reflRow(t, 60, true, 'fixed end: upside down')}
              </Anim>
            }
          >
            The wall holds the end still, so it pushes back with an opposite displacement. Only a free end returns the pulse the same way up.
          </Mistake>
          <Mistake
            title="Only a moving source changes the pitch"
            wrong="f _heard = f if only the observer moves"
            fig={
              <Anim title="A moving listener meets crests more often than a still listener" loop={7} height={235}>
                {(t) => dopplerObserver(t)}
              </Anim>
            }
          >
            A moving observer meets crests at a different rate, so hears a different frequency, <M>f · [ v + v _o | v ]</M>. Either motion shifts the pitch, and the two formulas are not mirror images.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">A wave is a shape and an energy that travel; the medium only shakes.</p>
        <p className="closing-sub">Next: the same ideas of period, frequency and superposition lead on to light, interference and diffraction.</p>
      </footer>
    </ChapterShell>
  );
}
