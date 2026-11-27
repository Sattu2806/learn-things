import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Fig } from '../kit/Anim';
import { Mistake, Mistakes } from '../kit/Mistake';
import {
  Bimetal,
  ConductionRod,
  ConvertChain,
  CoolingCup,
  HeatFlow,
  HeatingCurve,
  IceToWater,
  MistakeArea,
  MistakeFlat,
  MistakeHeat,
  MistakeKelvin,
  MistakeLinear,
  MistakeVacuum,
  MixBeakers,
  MixCurves,
  Pane,
  PlateExpands,
  RailGap,
  RodExpands,
  SeaBreeze,
  SeriesRods,
  SpecificHeat,
  Stefan,
  Thermometer,
  WaterDensity,
  Wien,
} from './HeatFigs';

/** Thermal properties of matter: temperature, expansion, heat capacity, change of state, heat transfer and cooling. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'Temperature and heat', group: 'Theory' },
  { id: 'scales', title: 'Temperature scales', group: 'Theory' },
  { id: 'expansion', title: 'Thermal expansion', group: 'Theory' },
  { id: 'atwork', title: 'Expansion at work, and water’s oddity', group: 'Theory' },
  { id: 'specific', title: 'Specific heat capacity', group: 'Theory' },
  { id: 'calorimetry', title: 'Calorimetry', group: 'Theory' },
  { id: 'latent', title: 'Change of state and latent heat', group: 'Theory' },
  { id: 'conduction', title: 'Conduction', group: 'Theory' },
  { id: 'convection', title: 'Convection', group: 'Theory' },
  { id: 'radiation', title: 'Radiation', group: 'Theory' },
  { id: 'newton', title: 'Newton’s law of cooling', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="heat" film={buildFilm} sections={SECTIONS} sideTitle="Thermal properties" sideLead="Temperature, heat, expansion, melting and boiling, and the three ways heat travels.">
      <header className="article-head">
        <span className="kicker">Physics · Heat</span>
        <h1 className="article-title">Why does a hot cup go cold, and where does the heat go?</h1>
        <p className="article-lead">Hot things cool, cold things warm, rails buckle in summer and ice floats. All of it comes from one idea: matter is made of jiggling particles, and energy moves from the busier ones to the calmer ones.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="Temperature and heat" />
        <p>
          Everything is made of particles that never stop moving: jiggling in a solid, sliding in a liquid, flying in a gas. <strong>Temperature</strong> tells you how energetic that motion is, on average. Hotter means a more violent jiggle.
        </p>
        <p>
          <strong>Heat</strong> is something different. It is the <em>energy that flows</em> from one body to another because they are at different temperatures. Heat is a transfer, measured in joules (J). A body does not &ldquo;contain heat&rdquo;; it has thermal energy, and heat is what moves.
        </p>
        <Fig caption="Fast jiggle meets slow jiggle. Energy flows from hot to cold until the two match, and then the flow stops: thermal equilibrium.">
          <HeatFlow />
        </Fig>
        <Note label="Remember">Heat always flows from the higher temperature to the lower one, never the other way by itself. Two bodies at the same temperature exchange no net heat.</Note>
      </section>

      <section className="t-section" id="t-scales">
        <SectionHead n={no('scales')} title="Temperature scales" />
        <p>
          A thermometer needs two fixed points. Celsius uses the melting point of ice (0 °C) and the boiling point of water (100 °C), with 100 equal steps between. Fahrenheit uses 32 °F and 212 °F for the same two points, so it has 180 steps. The <strong>kelvin</strong> scale has steps the same size as Celsius but starts at absolute zero, the lowest temperature possible.
        </p>
        <Fig caption="One column of liquid, three numbers. The kelvin has no degree sign, and 0 K is absolute zero.">
          <Thermometer />
        </Fig>
        <p>The conversions follow from the fixed points:</p>
        <Eq src={['T _K = T _C + 273.15', 'T _F = [ 9 | 5 ] · T _C + 32', '[ T _F − 32 | 9 ] = [ T _C | 5 ] = [ T _K − 273.15 | 5 ]']} />
        <p>
          A change of one kelvin is the same as a change of one degree Celsius, so for a <em>difference</em> <M>ΔT</M> you can use either. Absolute zero is <M>0 "K" = −273.15 "°C"</M>. In Fahrenheit a step is smaller: a change of 1 °C is a change of 1.8 °F.
        </p>
      </section>

      <section className="t-section" id="t-expansion">
        <SectionHead n={no('expansion')} title="Thermal expansion" />
        <p>
          Heat a solid and its particles jiggle harder, push each other a little farther apart, and the whole thing grows. For a rod of original length <M>L _0</M> warmed by <M>ΔT</M>, the stretch is proportional to both:
        </p>
        <Eq src='ΔL = α · L _0 · ΔT'>
          <span>
            <M>α</M> is the <strong>coefficient of linear expansion</strong>, in <M>"K⁻¹"</M>. Steel: <M>1.2 × 10 ^−5</M>; aluminium: <M>2.4 × 10 ^−5</M>; copper: <M>1.7 × 10 ^−5</M>; glass: about <M>0.9 × 10 ^−5</M>.
          </span>
        </Eq>
        <Fig caption="The rod lengthens only a tiny amount in reality (the stretch here is exaggerated), but it pushes with huge force if it is held in place.">
          <RodExpands />
        </Fig>
        <p>
          A plate grows in both directions, so its area grows by about twice the fraction, and a solid block grows in all three, by about three times. These are the <strong>area and volume coefficients</strong>:
        </p>
        <Eq src={['ΔA = β · A _0 · ΔT ,  β = 2 · α', 'ΔV = γ · V _0 · ΔT ,  γ = 3 · α']} />
        <Fig caption="A hole expands exactly as the material around it would: it behaves like a bit of the plate that was not removed.">
          <PlateExpands />
        </Fig>
        <p>
          Liquids have no fixed shape, so only their volume expansion <M>γ</M> matters. It is usually much larger than for solids, which is why a thermometer&rsquo;s liquid climbs up the narrow tube.
        </p>
      </section>

      <section className="t-section" id="t-atwork">
        <SectionHead n={no('atwork')} title="Expansion at work, and water’s oddity" />
        <p>
          Engineers have to plan for expansion. Railway lines are laid with small gaps (or welded under tension) so the rails can lengthen on a hot day without buckling. Bridges have expansion joints. Power lines sag more in summer than in winter.
        </p>
        <p>
          A <strong>bimetallic strip</strong> turns expansion into motion. Two metals with different <M>α</M> are bonded together. When heated, the one that expands more gets longer on its outer side, so the strip bends toward the metal that expands less. Thermostats and old indicator lights use this to switch a circuit on and off.
        </p>
        <Fig caption="Both layers are the same length at room temperature. Heat makes the brass longer, so the strip curves with the brass on the outside.">
          <Bimetal />
        </Fig>
        <p>
          Water breaks the usual rule. Cooling normally makes a liquid shrink and get denser. But water is densest at <strong>4 °C</strong>. Below that it expands again as the molecules start to arrange themselves into the open pattern of ice.
        </p>
        <Fig caption="Cold water at 4 °C is the heaviest, so it sinks to the bottom of a lake. The surface freezes first, ice floats, and the fish live on in the 4 °C water below.">
          <WaterDensity />
        </Fig>
      </section>

      <section className="t-section" id="t-specific">
        <SectionHead n={no('specific')} title="Specific heat capacity" />
        <p>
          Give the same heat to different materials and they warm by different amounts. The <strong>specific heat capacity</strong> <M>c</M> is the heat needed to raise the temperature of 1 kg of a substance by 1 K. In general
        </p>
        <Eq src='Q = m · c · ΔT'>
          <span>
            <M>Q</M> in joules, <M>m</M> in kg, <M>c</M> in <M>"J/(kg·K)"</M>. Water: 4186; ice: 2100; steam: 2010; aluminium: 900; iron: 450; copper: 385.
          </span>
        </Eq>
        <Fig caption="Water has one of the highest specific heats, so it is slow to warm and slow to cool. Copper warms about eleven times as much from the same heat.">
          <SpecificHeat />
        </Fig>
        <p>
          The product <M>C = m · c</M> is the <strong>heat capacity</strong> of the whole object, in J/K. That large specific heat of water is why the sea stays cool in the afternoon, why hot-water bottles work, and why water is used to carry heat out of engines.
        </p>
      </section>

      <section className="t-section" id="t-calorimetry">
        <SectionHead n={no('calorimetry')} title="Calorimetry" />
        <p>
          Calorimetry measures heat by mixing things in an insulated container. Nothing leaks out, so energy is conserved: whatever heat the hot parts give up, the cold parts take in.
        </p>
        <Eq src='"heat lost" = "heat gained"'>
          <span>
            <M>Σ m · c · ( T _start − T _final ) = Σ m · c · ( T _final − T _start )</M>, with each side taken as a positive number.
          </span>
        </Eq>
        <Fig caption="Pour them together and the mixture settles between the two starting temperatures, nearer to the one with more water.">
          <MixBeakers />
        </Fig>
        <p>
          Call the final temperature <M>T</M>, put it in as the unknown, and solve. When two amounts of the same liquid mix, the weighted average comes out:
        </p>
        <Eq src='T = [ m _1 · T _1 + m _2 · T _2 | m _1 + m _2 ]' />
        <p>If the container itself takes up heat, add its <M>m · c</M> to the cold side.</p>
      </section>

      <section className="t-section" id="t-latent">
        <SectionHead n={no('latent')} title="Change of state and latent heat" />
        <p>
          While ice melts or water boils, heat keeps flowing in but the temperature does not rise. The energy goes into pulling the particles apart or free of each other, not into making them move faster. That hidden energy is the <strong>latent heat</strong>:
        </p>
        <Eq src='Q = m · L'>
          <span>
            <M>L _f</M> (fusion, melting) for ice is <M>3.34 × 10 ^5 "J/kg"</M>. <M>L _v</M> (vaporisation, boiling) for water is <M>2.26 × 10 ^6 "J/kg"</M>. The same amount is given back when the change is reversed.
          </span>
        </Eq>
        <Fig caption="1 kg of ice at −20 °C taken to steam at 120 °C. The slopes are warming (Q = m·c·ΔT); the flat steps are melting and boiling (Q = m·L). Boiling is by far the biggest step.">
          <HeatingCurve />
        </Fig>
        <p>
          Steam at 100 °C scalds worse than water at 100 °C because it carries 2260 kJ per kg of extra energy, released as it condenses on your skin.
        </p>
      </section>

      <section className="t-section" id="t-conduction">
        <SectionHead n={no('conduction')} title="Conduction" />
        <p>
          In <strong>conduction</strong> the particles stay put. The hot end jiggles harder and passes the energy on, neighbour to neighbour, down the material. Metals are good conductors because free electrons carry energy quickly too.
        </p>
        <Fig caption="Particles at the hot end jiggle hard first; the energy spreads down the rod until the pattern settles.">
          <ConductionRod />
        </Fig>
        <p>For a slab of thickness <M>L</M> and area <M>A</M>, with its faces at <M>T _1</M> and <M>T _2</M>, the heat flow per second in steady state is (Fourier&rsquo;s law):</p>
        <Eq src='P = [ Q | t ] = k · A · [ T _1 − T _2 | L ]'>
          <span>
            <M>k</M> is the <strong>thermal conductivity</strong> in <M>"W/(m·K)"</M>: copper 385, aluminium 205, steel 50, glass 0.8, water 0.6, wood 0.12, air 0.026.
          </span>
        </Eq>
        <p>
          Rods or layers joined end to end (in <strong>series</strong>) carry the <em>same</em> heat flow. The temperature falls fastest across the worse conductor. Writing <M>R = [ L | k · A ]</M> for each piece&rsquo;s thermal resistance, the resistances add, like electrical resistors:
        </p>
        <Eq src={['P = [ T _1 − T _2 | R _1 + R _2 ]', 'R = [ L | k · A ]']} />
        <Fig caption="A copper rod and a steel rod of equal size, ends at 100 °C and 0 °C. The junction sits at 88.5 °C: most of the drop happens across the steel.">
          <SeriesRods />
        </Fig>
      </section>

      <section className="t-section" id="t-convection">
        <SectionHead n={no('convection')} title="Convection" />
        <p>
          In fluids heat travels another way: the fluid itself moves. Warmed fluid expands, becomes less dense and rises; cooler, denser fluid sinks to take its place. The result is a circulating current, a <strong>convection current</strong>, that carries heat with it.
        </p>
        <Fig caption="By day the land warms faster than the sea. Air over the land rises, and cool sea air blows in along the ground: a sea breeze. At night it reverses.">
          <SeaBreeze />
        </Fig>
        <p>
          Convection heats a room from a radiator, boils a pot of water from the bottom up, and drives ocean currents and weather. It cannot happen in a solid, and it needs gravity to tell &ldquo;up&rdquo; from &ldquo;down&rdquo;.
        </p>
      </section>

      <section className="t-section" id="t-radiation">
        <SectionHead n={no('radiation')} title="Radiation" />
        <p>
          <strong>Radiation</strong> needs no material at all. Every body gives out electromagnetic waves, which is how the Sun&rsquo;s heat crosses empty space. The power radiated rises steeply with the <em>absolute</em> temperature (Stefan–Boltzmann law):
        </p>
        <Eq src='P = σ · e · A · T ^4'>
          <span>
            <M>σ = 5.67 × 10 ^−8 "W/(m²·K⁴)"</M>, <M>A</M> is the surface area, and <M>e</M> is the <strong>emissivity</strong>, from 0 to 1. A perfect emitter and absorber, <M>e = 1</M>, is a <strong>black body</strong>. <M>T</M> must be in kelvin.
          </span>
        </Eq>
        <Fig caption="Double the kelvin temperature and the power goes up by 2⁴ = 16.">
          <Stefan />
        </Fig>
        <p>A body at <M>T</M> in surroundings at <M>T _s</M> also absorbs, so the net loss is</p>
        <Eq src='P _net = σ · e · A · ( T ^4 − T _s ^4 )' />
        <p>
          Hotter bodies also glow with a bluer colour. <strong>Wien&rsquo;s law</strong> says the wavelength where the radiation is strongest shrinks as the temperature goes up:
        </p>
        <Eq src='λ _max · T = b'>
          <span>
            with <M>b = 2.898 × 10 ^−3 "m·K"</M>. The Sun (5800 K) peaks near 500 nm, in the visible band; a person (310 K) peaks near 9.3 µm, in the infrared.
          </span>
        </Eq>
        <Fig caption="As a body is heated from 3000 K to 6000 K the whole curve shifts toward shorter wavelengths and into the visible band (curves drawn to the same height).">
          <Wien />
        </Fig>
      </section>

      <section className="t-section" id="t-newton">
        <SectionHead n={no('newton')} title="Newton’s law of cooling" />
        <p>
          A hot object loses heat faster the hotter it is compared with its surroundings. For a small temperature difference, the rate of cooling is proportional to that difference:
        </p>
        <Eq src='[ dT | dt ] = − k · ( T − T _s )'>
          <span>
            where <M>T _s</M> is the temperature of the surroundings and <M>k</M> is a positive constant that depends on the object.
          </span>
        </Eq>
        <p>The solution is an exponential decay toward the surroundings:</p>
        <Eq src='T = T _s + ( T _0 − T _s ) · e ^−k·t' />
        <Fig caption="The slope of the curve (short line) is proportional to how far T is above room temperature. So the cup cools fast at first and ever more slowly after.">
          <CoolingCup />
        </Fig>
        <p>
          The temperature never quite reaches <M>T _s</M>; it only approaches it. In equal times the <em>difference</em> <M>T − T _s</M> shrinks by the same fraction.
        </p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Kelvin from Celsius', 'T _K = T _C + 273.15'],
                  ['Fahrenheit from Celsius', 'T _F = [ 9 | 5 ] · T _C + 32'],
                  ['Linear expansion', 'ΔL = α · L _0 · ΔT'],
                  ['Area expansion', 'ΔA = 2 · α · A _0 · ΔT'],
                  ['Volume expansion', 'ΔV = 3 · α · V _0 · ΔT'],
                  ['Heat for a temperature change', 'Q = m · c · ΔT'],
                  ['Calorimetry', '"heat lost" = "heat gained"'],
                  ['Heat for a change of state', 'Q = m · L'],
                  ['Conduction', 'P = k · A · [ T _1 − T _2 | L ]'],
                  ['Thermal resistance, in series', 'R = [ L | k · A ] ,  R = R _1 + R _2'],
                  ['Radiated power', 'P = σ · e · A · T ^4'],
                  ['Net radiated power', 'P _net = σ · e · A · ( T ^4 − T _s ^4 )'],
                  ['Wien’s law', 'λ _max · T = 2.898 × 10 ^−3 "m·K"'],
                  ['Newton’s law of cooling', '[ dT | dt ] = − k · ( T − T _s )'],
                  ['Cooling curve', 'T = T _s + ( T _0 − T _s ) · e ^−k·t'],
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
                  ['T', 'Temperature (absolute in radiation)', 'K'],
                  ['α', 'Coefficient of linear expansion', 'K⁻¹'],
                  ['Q', 'Heat', 'J'],
                  ['c', 'Specific heat capacity', 'J/(kg·K)'],
                  ['L', 'Latent heat (also a length)', 'J/kg'],
                  ['k', 'Thermal conductivity', 'W/(m·K)'],
                  ['P', 'Power: heat per second', 'W'],
                  ['σ', 'Stefan–Boltzmann constant, 5.67 × 10⁻⁸', 'W/(m²·K⁴)'],
                  ['e', 'Emissivity, between 0 and 1', 'no unit'],
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

        <Example n={1} title="Body temperature on three scales">
          <p className="ex-q">Normal body temperature is 98.6 °F. Express it in degrees Celsius and in kelvin.</p>
          <Given items={['T _F = 98.6 "°F"']} />
          <ol className="steps">
            <Step title="To Celsius">
              <Eq src='T _C = [ 5 | 9 ] · ( T _F − 32 ) = [ 5 | 9 ] · 66.6 = 37.0 "°C"' />
            </Step>
            <Step title="To kelvin">
              <Eq src='T _K = T _C + 273.15 = 37.0 + 273.15 = 310.15 "K"' />
            </Step>
          </ol>
          <Answer>37.0 °C, which is 310 K (310.15 K).</Answer>
          <Fig>
            <ConvertChain />
          </Fig>
        </Example>

        <Example n={2} title="Gaps in a railway track">
          <p className="ex-q">A steel rail 30 m long is laid at 20 °C. By how much does it lengthen when it reaches 60 °C? (<M>α = 1.2 × 10 ^−5 "K⁻¹"</M>.) If two such rails are laid end to end with a 30 mm gap, how big is the gap then?</p>
          <Given items={['L _0 = 30 "m"', 'ΔT = 40 "K"', 'α = 1.2 × 10 ^−5 "K⁻¹"']} />
          <ol className="steps">
            <Step title="Expansion of one rail">
              <Eq src='ΔL = α · L _0 · ΔT = 1.2 × 10 ^−5 · 30 · 40 = 0.0144 "m"' />
            </Step>
            <Step title="Both rails grow toward the gap">
              <Eq src='"gap" = 30 − 2 · 14.4 = 1.2 "mm"' />
            </Step>
          </ol>
          <Answer>Each rail grows by 14.4 mm. The 30 mm gap is squeezed to 1.2 mm, so it only just survives this heat wave.</Answer>
          <Fig>
            <RailGap />
          </Fig>
        </Example>

        <Example n={3} title="Mixing hot and cold water">
          <p className="ex-q">200 g of water at 80 °C is mixed with 300 g of water at 20 °C in an insulated container. What is the final temperature?</p>
          <Given items={['m _1 = 0.2 "kg"', 'T _1 = 80 "°C"', 'm _2 = 0.3 "kg"', 'T _2 = 20 "°C"', 'c = 4186 "J/(kg·K)"']} />
          <ol className="steps">
            <Step title="Heat lost equals heat gained">
              <Eq src='m _1 · c · ( 80 − T ) = m _2 · c · ( T − 20 )' />
            </Step>
            <Step title="Cancel c and solve">
              <Eq src={['0.2 · ( 80 − T ) = 0.3 · ( T − 20 )', '16 − 0.2 · T = 0.3 · T − 6', 'T = [ 22 | 0.5 ] = 44 "°C"']} />
            </Step>
          </ol>
          <Answer>44 °C. The hot water drops 36 K and the cold rises 24 K: more water, smaller change, and the heat moved is the same, 0.2 · 4186 · 36 ≈ 30.1 kJ.</Answer>
          <Fig>
            <MixCurves />
          </Fig>
        </Example>

        <Example n={4} title="From ice to warm water">
          <p className="ex-q">How much heat turns 100 g of ice at 0 °C into water at 50 °C? (<M>L _f = 3.34 × 10 ^5 "J/kg"</M>.)</p>
          <Given items={['m = 0.1 "kg"', 'L _f = 3.34 × 10 ^5 "J/kg"', 'c = 4186 "J/(kg·K)"']} />
          <ol className="steps">
            <Step title="Melt the ice at 0 °C">
              <Eq src='Q _1 = m · L _f = 0.1 · 3.34 × 10 ^5 = 33 400 "J"' />
            </Step>
            <Step title="Warm the water from 0 °C to 50 °C">
              <Eq src='Q _2 = m · c · ΔT = 0.1 · 4186 · 50 = 20 930 "J"' />
            </Step>
            <Step title="Add them">
              <Eq src='Q = Q _1 + Q _2 = 54 330 "J"' />
            </Step>
          </ol>
          <Answer>About 54.3 kJ. Melting alone takes more than half of it (33.4 kJ), with no change of temperature.</Answer>
          <Fig>
            <IceToWater />
          </Fig>
        </Example>

        <Example n={5} title="Heat through a window pane">
          <p className="ex-q">A glass pane of area 1.5 m² and thickness 4 mm has its inner face at 20 °C and its outer face at 5 °C. Find the heat flow through it. (<M>k = 0.8 "W/(m·K)"</M>.)</p>
          <Given items={['A = 1.5 "m²"', 'L = 4 "mm" = 0.004 "m"', 'ΔT = 15 "K"', 'k = 0.8 "W/(m·K)"']} />
          <ol className="steps">
            <Step title="Fourier’s law">
              <Eq src='P = k · A · [ ΔT | L ] = 0.8 · 1.5 · [ 15 | 0.004 ]' />
            </Step>
            <Step title="Evaluate">
              <Eq src='P = 4500 "W"' />
            </Step>
          </ol>
          <Answer>4500 W, a few electric heaters&rsquo; worth. In reality the surfaces are not held at room and outside temperatures (still air clings to the glass), so the true flow is far smaller.</Answer>
          <Fig>
            <Pane />
          </Fig>
        </Example>

        <Example n={6} title="A cooling cup of coffee">
          <p className="ex-q">Coffee at 90 °C in a room at 20 °C cools to 70 °C in 10 minutes. Assuming Newton&rsquo;s law, how long from the start until it reaches 40 °C?</p>
          <Given items={['T _0 = 90 "°C"', 'T _s = 20 "°C"', 'T = 70 "°C" at t = 10 "min"']} />
          <ol className="steps">
            <Step title="Find k from the first 10 minutes">
              <Eq src={['[ 70 − 20 | 90 − 20 ] = e ^−10·k', 'k = [ ln 1.4 | 10 ] = 0.0336 "min⁻¹"']} />
            </Step>
            <Step title="Solve for 40 °C">
              <Eq src={['[ 40 − 20 | 90 − 20 ] = e ^−k·t', 't = [ ln 3.5 | k ] = [ 1.253 | 0.0336 ] = 37.2 "min"']} />
            </Step>
          </ol>
          <Answer>About 37 minutes. The first 20 K of cooling takes only 10 minutes, but the last 30 K takes 27: the cooling slows as the coffee nears the room temperature.</Answer>
          <Fig>
            <CoolingCup example />
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Heat and temperature are the same" wrong="hotter = more heat" fig={<MistakeHeat />}>
            Temperature is the average jiggle of a particle; heat content depends on how many particles there are too. A tub of 40 °C water holds far more thermal energy than a cup of 80 °C water.
          </Mistake>
          <Mistake title="Using °C in the T⁴ law" wrong="( [ 54 | 27 ] ) ^4 = 16" fig={<MistakeKelvin />}>
            Radiation depends on the absolute temperature. Convert to kelvin first: <M>( [ 327 | 300 ] ) ^4 = 1.41</M>, not 16.
          </Mistake>
          <Mistake title="Forgetting the 2 in area expansion" wrong="ΔA = α · A _0 · ΔT" fig={<MistakeArea />}>
            Area grows in two directions, so <M>ΔA = 2 · α · A _0 · ΔT</M>, and volume gets a 3.
          </Mistake>
          <Mistake title="Temperature rises while melting" wrong="Q in, so T up" fig={<MistakeFlat />}>
            During melting and boiling the heat goes into <M>Q = m · L</M> and the temperature stays put. Use <M>m · c · ΔT</M> only while the state is not changing.
          </Mistake>
          <Mistake title="Cooling in a straight line" wrong="T = T _0 − k · t" fig={<MistakeLinear />}>
            The rate depends on <M>T − T _s</M>, so it slows down. The true curve is an exponential that flattens at room temperature.
          </Mistake>
          <Mistake title="Heat needs a medium" wrong={'"no air", so Q = 0'} fig={<MistakeVacuum />}>
            Conduction and convection need matter, but radiation does not. That is how the Sun warms the Earth through empty space.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Heat is energy on the move, always downhill in temperature, by touch, by flow or by light.</p>
        <p className="closing-sub">
          Next: <M>Q = m · c · ΔT</M> is the first step toward the laws of thermodynamics, where heat and work are traded for each other.
        </p>
      </footer>
    </ChapterShell>
  );
}
