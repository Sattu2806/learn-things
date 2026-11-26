import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Fig } from '../kit/Anim';
import {
  AreasScene,
  CannonScene,
  EllipseScene,
  EscapeBars,
  EscapeScene,
  FallScene,
  FieldScene,
  ForcePair,
  FreeFallScene,
  GeoScene,
  GHeightScene,
  GProbe,
  HalfOrQuarter,
  InverseSquareScene,
  OrbitScene,
  PeriodsScene,
  PotWell,
  RVsH,
  SameEscape,
  SatEnergy,
  TwoOrbits,
} from './Scenes';

/** Gravitation: Kepler, Newton's law, g, potential energy, escape and orbits. */

const SECTIONS: NoteSection[] = [
  { id: 'ellipses', title: "Kepler's first law: ellipses", group: 'Theory' },
  { id: 'areas', title: "Kepler's second law: equal areas", group: 'Theory' },
  { id: 'periods', title: "Kepler's third law: T² and r³", group: 'Theory' },
  { id: 'newton', title: "Newton's law of gravitation", group: 'Theory' },
  { id: 'g', title: 'Acceleration due to gravity', group: 'Theory' },
  { id: 'gvary', title: 'g up high and down deep', group: 'Theory' },
  { id: 'field', title: 'Field and potential energy', group: 'Theory' },
  { id: 'escape', title: 'Escape velocity', group: 'Theory' },
  { id: 'orbits', title: 'Orbits: from cannon to satellite', group: 'Theory' },
  { id: 'geo', title: 'Geostationary satellites', group: 'Theory' },
  { id: 'energy', title: 'Energy of a satellite', group: 'Theory' },
  { id: 'weightless', title: 'Weightlessness', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="gravitation" sections={SECTIONS} sideTitle="Gravitation" sideLead="One law, from falling apples to the Moon: how gravity weakens with distance, how much energy it stores, and why satellites keep falling without landing.">
      <header className="article-head">
        <span className="kicker">Physics · Gravitation</span>
        <h1 className="article-title">Why does the Moon not fall down?</h1>
        <p className="article-lead">It does fall, all the time. It just keeps missing the Earth. This chapter builds from Kepler's three laws to Newton's one law of gravitation, and from there to g, escape speed and every kind of orbit.</p>
      </header>

      <section className="t-section" id="t-ellipses">
        <SectionHead n={no('ellipses')} title="Kepler's first law: ellipses" />
        <p>
          In the early 1600s Johannes Kepler studied years of careful measurements of the planets and found three patterns. The first is about the shape of an orbit: <strong>every planet moves on an ellipse, with the Sun at one focus</strong>.
        </p>
        <p>
          An ellipse is a squashed circle. It has two special points inside, the <strong>foci</strong>. Pick any point on the ellipse and add its distances to the two foci: the total is always the same, <M>2 · a</M>, where <M>a</M> is the semi-major axis (half the longest width).
        </p>
        <Fig caption={<>The Sun sits at one focus, the other focus is empty. The two lengths <M>r _1</M> and <M>r _2</M> always add up to <M>2 · a</M>. (The ellipse is drawn far more stretched than any real planet's.)</>}>
          <EllipseScene />
        </Fig>
        <p>
          The planet is closest to the Sun at <strong>perihelion</strong> and farthest at <strong>aphelion</strong>. If the squashing is measured by the eccentricity <M>e</M> (0 for a circle), then
        </p>
        <Eq src={['r _min = a · ( 1 − e )', 'r _max = a · ( 1 + e )']} />
        <Note label="Remember">Real orbits are close to circles. Earth has <M>e = 0.017</M>, so its distance from the Sun changes by only about 3%. That is why we can often treat an orbit as a circle.</Note>
      </section>

      <section className="t-section" id="t-areas">
        <SectionHead n={no('areas')} title="Kepler's second law: equal areas" />
        <p>
          The second law is about speed. <strong>The line joining the Sun to a planet sweeps out equal areas in equal times.</strong> Close to the Sun the line is short, so to sweep the same area the planet must cover a lot of arc: it moves fast. Far away the line is long, so a short arc is enough: it moves slowly.
        </p>
        <Fig caption={<>Three wedges, each swept in the same time. The one near the Sun is short and fat, the one far away long and thin, yet the areas are equal.</>}>
          <AreasScene />
        </Fig>
        <Eq src='[ ΔA | Δt ] = "constant"' />
        <p>
          This is angular momentum in disguise. Gravity pulls straight toward the Sun, so it gives no turning effect about the Sun, and the planet's angular momentum <M>L = m · v · r</M> stays constant. The area swept per second is <M>[ L | 2 · m ]</M>, which is also constant. The planet's speed at perihelion and aphelion therefore satisfy
        </p>
        <Eq src='v _p · r _min = v _a · r _max' />
      </section>

      <section className="t-section" id="t-periods">
        <SectionHead n={no('periods')} title="Kepler's third law: T² and r³" />
        <p>
          The third law links different planets. <strong>The square of the period is proportional to the cube of the semi-major axis</strong>:
        </p>
        <Eq src='T ^2 ∝ a ^3' />
        <p>
          The constant of proportionality is the same for everything that orbits the same body. So for two planets of the Sun,
        </p>
        <Eq src='[ T _1 ^2 | T _2 ^2 ] = ( [ a _1 | a _2 ] ) ^3' />
        <Fig caption={<>Orbits chosen so that the periods are 1, 2 and 4: the radii come out as <M>1, 1.59, 2.52</M>, and <M>T ^2 / a ^3</M> is 1 each time.</>}>
          <PeriodsScene />
        </Fig>
        <p>
          Measure <M>T</M> in years and <M>a</M> in astronomical units (Earth's distance from the Sun) and the law reads simply <M>T ^2 = a ^3</M>. Mars is at 1.52 AU, so its year is <M>1.52 ^1.5 = 1.87</M> Earth years.
        </p>
        <p>Kepler only described these laws. Why they are true had to wait for Newton, in the next section.</p>
      </section>

      <section className="t-section" id="t-newton">
        <SectionHead n={no('newton')} title="Newton's law of gravitation" />
        <p>
          Newton saw that one rule explains falling apples and orbiting planets. <strong>Every mass attracts every other mass.</strong> For two point masses <M>m _1</M> and <M>m _2</M>, a distance <M>r</M> apart, the force on each is
        </p>
        <Eq src='F = [ G · m _1 · m _2 | r ^2 ]'>
          <span className="eq-note">G = 6.67 × 10⁻¹¹ N m²/kg², the universal constant of gravitation</span>
        </Eq>
        <Fig caption={<>The two arrows are the same length: the pulls are equal and opposite (Newton's third law). As the masses come closer, the force grows quickly. Here <M>F _0</M> is the force at <M>r _0</M>.</>}>
          <ForcePair />
        </Fig>
        <p>Four things to notice:</p>
        <ul>
          <li>The force is always an <strong>attraction</strong>, along the line joining the masses.</li>
          <li>It is proportional to <strong>both masses</strong>: double either and the force doubles.</li>
          <li>It follows an <strong>inverse-square law</strong>: it falls with the square of the distance.</li>
          <li>The two forces are an action-reaction pair. The small mass pulls the big one just as hard as the big one pulls the small one.</li>
        </ul>
        <p>
          A uniform sphere pulls as if all its mass sat at its centre, so for planets <M>r</M> is measured centre to centre.
        </p>
        <Fig caption={<>Twice as far, one quarter of the force; three times as far, one ninth.</>}>
          <InverseSquareScene />
        </Fig>
        <p>
          <M>G</M> is tiny, which is why gravity between everyday objects is far too weak to notice. We feel it only when one of the masses is as big as a planet.
        </p>
      </section>

      <section className="t-section" id="t-g">
        <SectionHead n={no('g')} title="Acceleration due to gravity" />
        <p>
          Take a mass <M>m</M> at the surface of the Earth (mass <M>M</M>, radius <M>R</M>). Gravity gives the weight <M>m · g</M>, and Newton's law gives <M>G · M · m / R ^2</M>. Set them equal and <M>m</M> cancels:
        </p>
        <Eq src='g = [ G · M | R ^2 ]'>
          <span>With <M>M = 5.97 × 10 ^24 "kg"</M> and <M>R = 6.37 × 10 ^6 "m"</M> this gives <M>g = 9.81 "m/s²"</M>.</span>
        </Eq>
        <Fig caption={<>The 4 kg ball has four times the weight of the 1 kg ball, but four times the mass to move as well, so both accelerate at <M>g</M>.</>}>
          <FallScene />
        </Fig>
        <p>
          That the mass cancels is why a hammer and a feather fall together in a vacuum. The same formula works for any planet or moon: just use its mass and radius. For the Moon <M>g = 1.62 "m/s²"</M>, about one sixth of ours.
        </p>
      </section>

      <section className="t-section" id="t-gvary">
        <SectionHead n={no('gvary')} title="g up high and down deep" />
        <p>
          Higher up, you are farther from the Earth's centre, at distance <M>R + h</M>, so gravity weakens:
        </p>
        <Eq src='g _h = [ G · M | ( R + h ) ^2 ] = g · ( [ R | R + h ] ) ^2'>
          <span>
            For a height that is small compared with <M>R</M> the binomial expansion gives <M>g _h ≈ g · ( 1 − [ 2 · h | R ] )</M>.
          </span>
        </Eq>
        <p>
          Going down is different. Inside the Earth only the mass closer to the centre than you pulls you; the shell of Earth above you cancels out. For a uniform Earth that mass shrinks as <M>r ^3</M> while the distance squared shrinks as <M>r ^2</M>, so <M>g</M> falls in a straight line to zero at the centre. At a depth <M>d</M>:
        </p>
        <Eq src='g _d = g · ( 1 − [ d | R ] )' />
        <Fig caption={<>A probe goes from the centre outward. Inside the Earth <M>g</M> grows in proportion to the distance; outside it falls as <M>1 / r ^2</M>. The strongest gravity is right at the surface.</>}>
          <GProbe title="A probe moves from the centre of the Earth out to three Earth radii while the graph of g against distance draws itself" />
        </Fig>
        <p>
          <strong>Latitude.</strong> The Earth is spinning and slightly flattened, so <M>g</M> also changes from place to place: about 9.78 m/s² at the equator and 9.83 m/s² at the poles. At the equator part of gravity is used up in keeping you on a circle (the centripetal acceleration from the circular motion chapter), and you are slightly farther from the centre.
        </p>
      </section>

      <section className="t-section" id="t-field">
        <SectionHead n={no('field')} title="Field and potential energy" />
        <p>
          Instead of thinking of a mass reaching across space, we can say that a mass <M>M</M> fills the space round it with a <strong>gravitational field</strong>. The field strength at a point is the force on a unit mass placed there:
        </p>
        <Eq src='g = [ F | m ] = [ G · M | r ^2 ]'>
          <span>Unit: N/kg, the same as m/s². The direction is toward the mass.</span>
        </Eq>
        <Fig caption={<>Field arrows toward the mass, shorter farther out. A test mass <M>m</M> feels a force <M>m · g</M> given by the arrow where it sits.</>}>
          <FieldScene />
        </Fig>
        <p>
          Now energy. Near the ground we write the potential energy as <M>m · g · h</M>, which is no good far out because <M>g</M> changes. The general result, found by adding up the work gravity does as a mass comes in from far away, is
        </p>
        <Eq src='U = − [ G · M · m | r ]'>
          <span>
            Dividing by <M>m</M> gives the <strong>gravitational potential</strong> <M>V = − G · M / r</M>, in J/kg.
          </span>
        </Eq>
        <p>
          <strong>Why negative?</strong> We choose the zero of potential energy at infinity, where the masses are so far apart that they no longer feel each other. Gravity is attractive, so as a mass falls in from infinity, gravity does positive work and the energy of the pair goes <em>down</em> from zero. It takes energy, a positive amount, to pull the mass back out. A negative energy means the mass is <strong>bound</strong>: it needs energy to escape.
        </p>
        <Fig caption={<>Falling inward, the mass moves down the curve <M>U = − G · M · m / r</M>. The kinetic energy <M>K</M> is the gap between the dashed total-energy line and the curve, and it grows as <M>U</M> drops.</>}>
          <PotWell />
        </Fig>
        <Note label="Check">Close to the ground, lifting by <M>h</M> changes <M>U</M> by <M>[ G · M · m · h | R · ( R + h ) ] ≈ m · g · h</M>. The old formula is the new one for small heights.</Note>
      </section>

      <section className="t-section" id="t-escape">
        <SectionHead n={no('escape')} title="Escape velocity" />
        <p>
          Throw a ball up and it slows, stops and returns. Throw it harder and it goes higher, but gravity weakens as it climbs. Is there a speed so large that it never comes back? Yes. The <strong>escape velocity</strong> is the least speed at which the mass just reaches infinity, with nothing left over. There, <M>U = 0</M> and the kinetic energy is zero, so the total energy is zero. Conserving energy:
        </p>
        <Eq src={['[ 1 | 2 ] · m · v _e ^2 − [ G · M · m | R ] = 0', 'v _e = √[ [ 2 · G · M | R ] ] = √[ 2 · g · R ]']} />
        <p>
          The second form uses <M>G · M = g · R ^2</M>. For the Earth <M>v _e = 11.2 "km/s"</M>, about 40 300 km/h.
        </p>
        <Fig caption={<>Rockets launched upward at 0.7, 0.8 and 1.0 times the escape speed. Slower ones go up, stop and come back; the last one is never pulled back.</>}>
          <EscapeScene />
        </Fig>
        <p>
          The mass <M>m</M> cancelled, so a light and a heavy object have the same escape speed. Nor does the direction matter, as long as the path does not hit the planet. A rocket does not need this speed because its engines keep pushing, but a thrown stone or a bullet does.
        </p>
      </section>

      <section className="t-section" id="t-orbits">
        <SectionHead n={no('orbits')} title="Orbits: from cannon to satellite" />
        <p>
          Newton imagined a cannon on a very high mountain. Fire a ball horizontally and it follows a parabola and lands. Fire it faster and it lands farther. But the Earth is round: the ground curves away below the ball. At a certain speed the ball falls exactly as fast as the ground curves away, and it never lands. That ball is in orbit.
        </p>
        <Fig caption={<>The cannonball is fired at 4.3, 6.3 and 7.9 km/s. The last one keeps falling toward the Earth and keeps missing it. (The mountain is drawn very tall so that the ball clears the ground.)</>}>
          <CannonScene />
        </Fig>
        <p>
          For a circular orbit of radius <M>r</M>, gravity is the centripetal force. Set <M>G · M · m / r ^2</M> equal to <M>m · v ^2 / r</M>:
        </p>
        <Eq src='v = √[ [ G · M | r ] ]'>
          <span>The orbital speed depends only on the central mass and the radius, not on the satellite's own mass.</span>
        </Eq>
        <Fig caption={<>The velocity <M>v</M> is along the circle; the acceleration <M>a = G · M / r ^2</M> always points to the centre.</>}>
          <OrbitScene title="A satellite goes round the Earth with its velocity arrow along the circle and its acceleration arrow toward the centre" />
        </Fig>
        <p>
          The satellite goes once round, a distance <M>2 · π · r</M>, at speed <M>v</M>, so the period is
        </p>
        <Eq src={['T = [ 2 · π · r | v ] = 2 · π · √[ [ r ^3 | G · M ] ]', 'T ^2 = [ 4 · π ^2 | G · M ] · r ^3']}>
          <span>That is Kepler's third law, now with its constant: <M>4 · π ^2 / G · M</M>.</span>
        </Eq>
        <Fig caption={<>A farther orbit means a slower satellite and a much longer lap.</>}>
          <TwoOrbits />
        </Fig>
        <p>
          Just above the ground (<M>r ≈ R</M>) the speed is <M>√[ g · R ] = 7.9 "km/s"</M> and the period about 84 minutes. This is the speed of Newton's last shot.
        </p>
      </section>

      <section className="t-section" id="t-geo">
        <SectionHead n={no('geo')} title="Geostationary satellites" />
        <p>
          A satellite that always hangs over the same spot on the ground must go once round in exactly one day, in the same direction the Earth turns, and it must be over the equator (otherwise it would drift north and south). Putting <M>T = 24 "h"</M> into <M>T ^2 = 4 · π ^2 · r ^3 / G · M</M>:
        </p>
        <Eq src='r ^3 = [ G · M · T ^2 | 4 · π ^2 ]'>
          <span>
            Taking the cube root gives <M>r = 4.22 × 10 ^7 "m"</M>, which is 6.6 Earth radii from the centre, or a height of about 35 900 km above the surface. Its speed is only 3.07 km/s.
          </span>
        </Eq>
        <Fig caption={<>Seen from above the north pole. The dashed line to a spot on the equator stays straight: satellite and ground turn together. A lower satellite laps the ground again and again.</>}>
          <GeoScene />
        </Fig>
        <p>
          There is just one such orbit, so the equator's sky is crowded. Dish antennas for television can point at a fixed spot and never move.
        </p>
      </section>

      <section className="t-section" id="t-energy">
        <SectionHead n={no('energy')} title="Energy of a satellite" />
        <p>
          In a circular orbit <M>v ^2 = G · M / r</M>, so the kinetic energy is half of <M>G · M · m / r</M>. Add the potential energy <M>− G · M · m / r</M>:
        </p>
        <Eq src={['K = [ 1 | 2 ] · m · v ^2 = [ G · M · m | 2 · r ]', 'U = − [ G · M · m | r ]', 'E = K + U = − [ G · M · m | 2 · r ]']} />
        <p>
          So <M>E = − K</M> and <M>U = 2 · E</M>. The total is negative, which says the satellite is bound. Notice what happens when we raise the orbit: the radius grows, <M>E</M> becomes less negative (it rises, because we had to supply energy), and yet the speed, and with it <M>K</M>, goes <em>down</em>.
        </p>
        <Fig caption={<>Lifting the orbit from 1.5 to 4 Earth radii. <M>K</M> shrinks, <M>U</M> climbs by twice as much as <M>E</M>, and the satellite slows.</>}>
          <SatEnergy />
        </Fig>
        <p>
          To free the satellite entirely its total energy must rise to zero: the energy needed is <M>G · M · m / 2 · r</M>, that is, just <M>K</M>.
        </p>
      </section>

      <section className="t-section" id="t-weightless">
        <SectionHead n={no('weightless')} title="Weightlessness" />
        <p>
          Astronauts on the space station float. Is gravity switched off up there? No: at 400 km <M>g</M> is still 8.69 m/s², about 89% of its value on the ground. The astronaut floats because she and the station are both falling at the same rate, as in Newton's cannon.
        </p>
        <p>
          What you feel as weight is the floor (or scale) pushing up on you. In free fall nothing pushes: the floor falls away just as quickly as you do. The gravitational force is still there, but the <strong>apparent weight</strong> is zero. You would feel the same in a lift whose cable has snapped.
        </p>
        <Fig caption={<>On the floor, the normal force <M>N</M> balances the weight <M>W</M>. In the falling box the ball and the box accelerate together, so <M>N = 0</M> even though <M>W</M> is still there.</>}>
          <FreeFallScene />
        </Fig>
        <Note label="Remember">Weightless does not mean gravity-free. It means there is no support force: everything in the cabin has the same acceleration.</Note>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">What</th>
                <th scope="col">Formula</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['Kepler I and II', 'r _1 + r _2 = 2 · a ,  [ ΔA | Δt ] = "constant"'],
                  ['Kepler III', 'T ^2 ∝ a ^3'],
                  ['Law of gravitation', 'F = [ G · m _1 · m _2 | r ^2 ]'],
                  ['Gravity at the surface', 'g = [ G · M | R ^2 ]'],
                  ['Height h (small h)', 'g _h = g · ( [ R | R + h ] ) ^2 ≈ g · ( 1 − [ 2 · h | R ] )'],
                  ['Depth d', 'g _d = g · ( 1 − [ d | R ] )'],
                  ['Gravitational field', 'g = [ G · M | r ^2 ]'],
                  ['Potential energy', 'U = − [ G · M · m | r ]'],
                  ['Gravitational potential', 'V = − [ G · M | r ]'],
                  ['Escape velocity', 'v _e = √[ [ 2 · G · M | R ] ] = √[ 2 · g · R ]'],
                  ['Orbital speed', 'v = √[ [ G · M | r ] ]'],
                  ['Period', 'T = 2 · π · √[ [ r ^3 | G · M ] ]'],
                  ['Kinetic energy in orbit', 'K = [ G · M · m | 2 · r ]'],
                  ['Total energy in orbit', 'E = − [ G · M · m | 2 · r ]'],
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
                <th scope="col">Value or unit</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['G', 'Universal constant of gravitation', '6.67 × 10⁻¹¹ N m²/kg²'],
                  ['M', 'Mass of the Earth (or planet)', '5.97 × 10²⁴ kg'],
                  ['R', 'Radius of the Earth', '6.37 × 10⁶ m'],
                  ['g', 'Gravity at the surface', '9.81 m/s²'],
                  ['r', 'Distance from the centre of the attracting body', 'm'],
                  ['h, d', 'Height above, or depth below, the surface', 'm'],
                  ['U, V', 'Potential energy, potential', 'J, J/kg'],
                  ['v _e', 'Escape velocity from the Earth', '11.2 km/s'],
                  ['T', 'Orbital period', 's'],
                  ['a', 'Semi-major axis of an ellipse', 'm'],
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

        <Example n={1} title="Two heavy masses side by side">
          <p className="ex-q">Two masses of 100 kg sit 1 m apart (centre to centre). What is the gravitational force between them?</p>
          <Given items={['m _1 = m _2 = 100 "kg"', 'r = 1 "m"', 'G = 6.67 × 10 ^−11 "N m²/kg²"']} />
          <ol className="steps">
            <Step title="Use the law">
              <Eq src='F = [ G · m _1 · m _2 | r ^2 ]' />
            </Step>
            <Step title="Put in the numbers">
              <Eq src='F = [ 6.67 × 10 ^−11 · 100 · 100 | 1 ^2 ] = 6.67 × 10 ^−7 "N"' />
            </Step>
          </ol>
          <Answer>
            <M>6.67 × 10 ^−7 "N"</M>, on each mass and in opposite directions. Compare the weight of one mass, <M>981 "N"</M>: the pull between them is about a billion times weaker, far too small to feel.
          </Answer>
          <Fig caption="The arrows are magnified by a billion so that you can see them.">
            <ForcePair fixed masses={['100 kg', '100 kg']} note="F = 6.67 × 10⁻⁷ N each" />
          </Fig>
        </Example>

        <Example n={2} title="Gravity on the space station">
          <p className="ex-q">The International Space Station orbits 400 km above the ground. Find <M>g</M> there. (Earth: <M>M = 5.97 × 10 ^24 "kg"</M>, <M>R = 6.37 × 10 ^6 "m"</M>.)</p>
          <Given items={['h = 400 "km"', 'R = 6.37 × 10 ^6 "m"', 'g = 9.81 "m/s²"']} />
          <ol className="steps">
            <Step title="Distance from the centre">
              <Eq src='r = R + h = 6.37 × 10 ^6 + 0.40 × 10 ^6 = 6.77 × 10 ^6 "m"' />
            </Step>
            <Step title="Scale g by the square of the ratio">
              <Eq src='g _h = g · ( [ R | r ] ) ^2 = 9.81 · ( [ 6.37 | 6.77 ] ) ^2 = 8.69 "m/s²"' />
            </Step>
          </ol>
          <Answer>
            <M>8.69 "m/s²"</M>, which is 88.6% of the value on the ground. (The shortcut <M>g · ( 1 − 2 · h / R )</M> gives 8.57: a little off, because 400 km is not that small compared with <M>R</M>.) Astronauts float because they are falling, not because gravity has gone.
          </Answer>
          <Fig caption="The solid curve is the real g; the dashed line is the small-h shortcut, which drifts below it.">
            <GHeightScene />
          </Fig>
        </Example>

        <Example n={3} title="Halfway to the centre">
          <p className="ex-q">A shaft is dug to a depth of half the Earth's radius. Find <M>g</M> at the bottom, taking the Earth as uniform with <M>g = 9.8 "m/s²"</M> at the surface.</p>
          <Given items={['d = [ R | 2 ]', 'g = 9.8 "m/s²"']} />
          <ol className="steps">
            <Step title="Use the depth formula">
              <Eq src='g _d = g · ( 1 − [ d | R ] ) = 9.8 · ( 1 − [ 1 | 2 ] )' />
            </Step>
            <Step title="Evaluate">
              <Eq src='g _d = 4.9 "m/s²"' />
            </Step>
          </ol>
          <Answer>
            <M>4.9 "m/s²"</M>, half the surface value. At half the radius, only the inner half of the radius counts: the mass is <M>[ 1 | 8 ]</M> as large and the distance squared <M>[ 1 | 4 ]</M> as large, giving <M>[ 1 | 2 ]</M>.
          </Answer>
          <Fig caption="Inside the Earth g follows a straight line down to zero at the centre.">
            <GProbe title="A probe sinks from the surface to half the Earth's radius while the graph shows g dropping to half" from={1} to={0.5} mark={0.5} g0={9.8} loop={8} />
          </Fig>
        </Example>

        <Example n={4} title="Leaving the Moon">
          <p className="ex-q">Find the escape speed from the Moon: <M>M = 7.35 × 10 ^22 "kg"</M> and <M>R = 1.74 × 10 ^6 "m"</M>.</p>
          <Given items={['M = 7.35 × 10 ^22 "kg"', 'R = 1.74 × 10 ^6 "m"', 'G = 6.67 × 10 ^−11 "N m²/kg²"']} />
          <ol className="steps">
            <Step title="Gravity at the Moon's surface">
              <Eq src='g _m = [ G · M | R ^2 ] = [ 6.67 × 10 ^−11 · 7.35 × 10 ^22 | ( 1.74 × 10 ^6 ) ^2 ] = 1.62 "m/s²"' />
            </Step>
            <Step title="Escape speed">
              <Eq src='v _e = √[ 2 · g _m · R ] = √[ 2 · 1.62 · 1.74 × 10 ^6 ] = 2.37 × 10 ^3 "m/s"' />
            </Step>
          </ol>
          <Answer>
            About <M>2.37 "km/s"</M>, only a fifth of the Earth's 11.2 km/s, because the Moon is much smaller. This is also why the Moon could not hold on to an atmosphere.
          </Answer>
          <Fig>
            <EscapeBars />
          </Fig>
        </Example>

        <Example n={5} title="How fast does the space station go?">
          <p className="ex-q">Find the orbital speed and the period of a satellite 400 km above the Earth. How many orbits does it make a day?</p>
          <Given items={['r = 6.77 × 10 ^6 "m"', 'G · M = 6.67 × 10 ^−11 · 5.97 × 10 ^24 = 3.98 × 10 ^14 "m³/s²"']} />
          <ol className="steps">
            <Step title="Orbital speed">
              <Eq src='v = √[ [ G · M | r ] ] = √[ [ 3.98 × 10 ^14 | 6.77 × 10 ^6 ] ] = 7.67 × 10 ^3 "m/s"' />
            </Step>
            <Step title="Period">
              <Eq src='T = [ 2 · π · r | v ] = [ 2 · π · 6.77 × 10 ^6 | 7.67 × 10 ^3 ] = 5.55 × 10 ^3 "s"' />
              <p>That is 92.4 minutes.</p>
            </Step>
            <Step title="Orbits per day">
              <Eq src='[ 24 · 60 | 92.4 ] = 15.6' />
            </Step>
          </ol>
          <Answer>
            7.67 km/s (about 27 600 km/h) and 92.4 min per lap: roughly 15.6 sunrises per day for the astronauts.
          </Answer>
          <Fig>
            <OrbitScene title="A satellite 400 kilometres up goes round once every 92.4 minutes at 7.67 kilometres per second" minutes={92.4} speedText="v = 7.67 km/s" loop={8} />
          </Fig>
        </Example>

        <Example n={6} title="Where to park a TV satellite">
          <p className="ex-q">Find the orbit radius and height of a geostationary satellite, and its speed.</p>
          <Given items={['T = 24 "h" = 86 400 "s"', 'G · M = 3.98 × 10 ^14 "m³/s²"', 'R = 6.37 × 10 ^6 "m"']} />
          <ol className="steps">
            <Step title="Cube of the radius">
              <Eq src='r ^3 = [ G · M · T ^2 | 4 · π ^2 ] = [ 3.98 × 10 ^14 · 86 400 ^2 | 4 · π ^2 ] = 7.53 × 10 ^22 "m³"' />
            </Step>
            <Step title="Radius">
              <p>Take the cube root:</p>
              <Eq src='r = 4.22 × 10 ^7 "m"' />
            </Step>
            <Step title="Height above the ground">
              <Eq src='h = r − R = 4.22 × 10 ^7 − 0.64 × 10 ^7 = 3.59 × 10 ^7 "m"' />
            </Step>
            <Step title="Speed">
              <Eq src='v = [ 2 · π · r | T ] = [ 2 · π · 4.22 × 10 ^7 | 86 400 ] = 3.07 × 10 ^3 "m/s"' />
            </Step>
          </ol>
          <Answer>
            <M>r = 42 200 "km"</M> from the Earth's centre, a height of about 35 900 km, at 3.07 km/s. (Using the true rotation period of 23 h 56 min gives 42 160 km.)
          </Answer>
          <Fig>
            <GeoScene />
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Gravity is zero in orbit" wrong="g = 0" fig={<OrbitScene title="A satellite in orbit with gravity still pulling it toward the Earth" v={false} gText="g = 8.69 m/s² still" loop={6} />}>
            At 400 km gravity is still 89% of its surface value. The satellite is not outside gravity: gravity is exactly what keeps it going round.
          </Mistake>
          <Mistake title="Using h instead of r" wrong="g _h = [ G · M | h ^2 ]" fig={<RVsH />}>
            The distance in <M>G · M / r ^2</M> is measured from the centre of the Earth: <M>r = R + h</M>.
          </Mistake>
          <Mistake title="Double the distance, half the force" wrong="F ∝ [ 1 | r ]" fig={<HalfOrQuarter />}>
            Gravity is inverse-square. Twice as far is a quarter of the force; three times as far, a ninth.
          </Mistake>
          <Mistake title="Higher satellites move faster" wrong="r ↑ ,  v ↑" fig={<TwoOrbits />}>
            <M>v = √[ G · M / r ]</M> goes <em>down</em> as <M>r</M> goes up. A higher orbit needs more energy to reach, but then the satellite moves more slowly.
          </Mistake>
          <Mistake title="Positive potential energy" wrong="U = + [ G · M · m | r ]" fig={<PotWell fromFar />}>
            With the zero at infinity, <M>U</M> is negative: gravity does positive work as the mass falls in, so the energy drops below zero. The bound state has <M>{'E < 0'}</M>.
          </Mistake>
          <Mistake title="Escape speed depends on the mass" wrong="v _e = √[ [ 2 · G · M · m | R ] ]" fig={<SameEscape />}>
            The mass <M>m</M> of the escaping object cancels. A pebble and a truck have the same escape speed, <M>√[ 2 · G · M / R ]</M>.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">An orbit is a fall that keeps missing the Earth.</p>
        <p className="closing-sub">
          Next: the idea behind Kepler's second law, that a pull toward a centre never changes angular momentum, is the heart of the rotation chapters.
        </p>
      </footer>
    </ChapterShell>
  );
}
