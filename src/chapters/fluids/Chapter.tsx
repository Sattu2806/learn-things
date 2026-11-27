import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Fig } from '../kit/Anim';
import { Barometer, BuoyancyDepth, Bubbles, CapTubes, Couette, Diver, Film, Floating, Lift, Manometer, Molecules, PipeFlow, PressureArea, PressureStack, Reynolds, SinkOrFloat, SpinBall, SpringBalance, Terminal, Vessels, Wing } from './Figs';

/** Fluids: pressure, buoyancy, flow, viscosity and surface tension, with animated diagrams and worked examples. */

const SECTIONS: NoteSection[] = [
  { id: 'pressure', title: 'What pressure is', group: 'Theory' },
  { id: 'depth', title: 'Pressure with depth', group: 'Theory' },
  { id: 'atmosphere', title: 'Air pressure and gauges', group: 'Theory' },
  { id: 'pascal', title: "Pascal's law", group: 'Theory' },
  { id: 'buoyancy', title: 'Buoyancy and floating', group: 'Theory' },
  { id: 'continuity', title: 'Flow and continuity', group: 'Theory' },
  { id: 'bernoulli', title: "Bernoulli's equation", group: 'Theory' },
  { id: 'uses', title: 'Wings and spinning balls', group: 'Theory' },
  { id: 'viscosity', title: 'Viscosity', group: 'Theory' },
  { id: 'stokes', title: 'Terminal velocity', group: 'Theory' },
  { id: 'tension', title: 'Surface tension', group: 'Theory' },
  { id: 'capillary', title: 'Capillary rise', group: 'Theory' },
  { id: 'drops', title: 'Drops and bubbles', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

const SHEET: (readonly [string, string])[] = [
  ['Pressure', 'p = [ F | A ]'],
  ['Pressure at depth', 'p = p _0 + ρ · g · h'],
  ['Gauge pressure', 'p _g = p − p _0 = ρ · g · h'],
  ['Atmosphere', 'p _0 = 1.013 × 10 ^5 "Pa"'],
  ["Pascal's law (lift)", '[ F _1 | A _1 ] = [ F _2 | A _2 ]'],
  ['Lift: distances', 'A _1 · d _1 = A _2 · d _2'],
  ['Buoyant force', 'B = ρ _f · V · g'],
  ['Fraction floating under', '[ V _sub | V ] = [ ρ _body | ρ _f ]'],
  ['Continuity', 'A _1 · v _1 = A _2 · v _2'],
  ['Flow rate', 'Q = A · v'],
  ['Bernoulli', 'p + ½ · ρ · v ^2 + ρ · g · h = "constant"'],
  ['Viscous force', 'F = η · A · [ v | d ]'],
  ["Stokes' law", 'F = 6 · π · η · r · v'],
  ['Terminal velocity', 'v _t = [ 2 · r ^2 · ( ρ − σ ) · g | 9 · η ]'],
  ['Reynolds number', 'Re = [ ρ · v · D | η ]'],
  ['Surface tension', 'T = [ F | l ]'],
  ['Surface energy', 'W = T · ΔA'],
  ['Capillary rise', 'h = [ 2 · T · cos θ | ρ · g · r ]'],
  ['Drop (one surface)', 'Δp = [ 2 · T | r ]'],
  ['Soap bubble (two surfaces)', 'Δp = [ 4 · T | r ]'],
];

const SYMBOLS: (readonly [string, string, string])[] = [
  ['p', 'Pressure', 'Pa'],
  ['ρ', 'Density of the fluid', 'kg/m³'],
  ['h', 'Depth (or capillary height)', 'm'],
  ['A', 'Area (or cross-section)', 'm²'],
  ['B', 'Buoyant force', 'N'],
  ['Q', 'Volume flow rate', 'm³/s'],
  ['η', 'Viscosity', 'Pa·s'],
  ['T', 'Surface tension', 'N/m'],
  ['θ', 'Contact angle', 'degrees'],
  ['Re', 'Reynolds number', 'no unit'],
];

export default function Chapter() {
  return (
    <ChapterShell id="fluids" sections={SECTIONS} sideTitle="Fluids" sideLead="Liquids and gases at rest and on the move: pressure, floating, flow, drag, and the skin on the surface of water.">
      <header className="article-head">
        <span className="kicker">Physics · Properties of matter</span>
        <h1 className="article-title">Why does a ship float and a wing lift?</h1>
        <p className="article-lead">Liquids and gases flow, so they cannot be pushed with a single force like a block. They push back with pressure instead. This chapter builds from that one idea to floating, flow, drag and the strange skin of water.</p>
      </header>

      <section className="t-section" id="t-pressure">
        <SectionHead n={no('pressure')} title="What pressure is" />
        <p>
          A fluid is anything that flows: a liquid or a gas. A fluid at rest cannot hold a sideways push, so it always pushes <em>straight into</em> any surface it touches. To describe how hard, we use <strong>pressure</strong>: the force on each unit of area.
        </p>
        <Eq src='p = [ F | A ]'>
          <span>
            where <M>F</M> is the force at right angles to the surface and <M>A</M> its area. The unit is the pascal: <M>1 "Pa" = 1 "N/m²"</M>.
          </span>
        </Eq>
        <Fig caption="The same 100 N spread over a wide foot or squeezed onto a sharp point: the smaller the area, the higher the pressure.">
          <PressureArea />
        </Fig>
        <p>
          That is why a knife cuts and a snowshoe does not sink. Pressure is a scalar: it has a size but no direction of its own. The force it makes on a surface is <M>F = p · A</M>, and that force is perpendicular to the surface.
        </p>
      </section>

      <section className="t-section" id="t-depth">
        <SectionHead n={no('depth')} title="Pressure with depth" />
        <p>
          Dive down and the pressure grows, because there is more water above you to hold up. Take a flat patch of area <M>A</M> at depth <M>h</M>. The column of liquid above it has volume <M>A · h</M>, mass <M>ρ · A · h</M> and weight <M>ρ · A · h · g</M>. That weight, spread over <M>A</M>, is the extra pressure:
        </p>
        <Eq src='p = p _0 + ρ · g · h'>
          <span>
            <M>p _0</M> is the pressure at the surface (the air pressure), <M>ρ</M> the density of the liquid.
          </span>
        </Eq>
        <Fig caption="The pressure is the same in every direction at one depth, and it rises in a straight line with depth: about 1 atmosphere more for every 10 m of water.">
          <Diver />
        </Fig>
        <p>
          Notice what is <em>not</em> in the formula: the width of the container or the amount of water. Only the depth, the density and <M>g</M> matter. Two points at the same depth in the same liquid are at the same pressure.
        </p>
      </section>

      <section className="t-section" id="t-atmosphere">
        <SectionHead n={no('atmosphere')} title="Air pressure and gauges" />
        <p>
          We live at the bottom of an ocean of air. Its pressure at sea level is <strong>one atmosphere</strong>, <M>p _0 = 1.013 × 10 ^5 "Pa"</M>. A barometer measures it. Fill a long tube with mercury, turn it upside down in a dish, and the mercury sinks only until the column's weight balances the air pushing on the dish.
        </p>
        <Fig caption="The mercury stops at about 0.76 m. Above it is an empty space, so the air pressure alone holds the column up: p₀ = ρgh.">
          <Barometer />
        </Fig>
        <p>
          Because <M>p _0 = ρ · g · h</M>, 760 mm of mercury equals one atmosphere. Mercury is used because it is so dense (13 600 kg/m³): a water barometer would need a tube over 10 m tall.
        </p>
        <p>
          Most gauges (tyre gauges, blood-pressure meters) read the pressure <em>above</em> the air. This is the <strong>gauge pressure</strong>, <M>p _g = p − p _0</M>. The real total is the <strong>absolute pressure</strong>. A manometer, a U-tube of liquid, shows gauge pressure directly:
        </p>
        <Fig caption="When the gas pushes harder than the air, the liquid on the open side is pushed up. The height difference h gives the gauge pressure, ρgh.">
          <Manometer />
        </Fig>
      </section>

      <section className="t-section" id="t-pascal">
        <SectionHead n={no('pascal')} title="Pascal's law" />
        <p>
          Because pressure in a fluid at rest only depends on depth, any extra pressure you add at one place spreads to every other point, undiminished. This is <strong>Pascal's law</strong>: a change in pressure applied to an enclosed fluid is passed on equally to all of it, and to the walls.
        </p>
        <p>
          A <strong>hydraulic lift</strong> uses this. A small piston of area <M>A _1</M> and a large one of area <M>A _2</M> sit in the same fluid, so they feel the same pressure:
        </p>
        <Eq src='[ F _1 | A _1 ] = [ F _2 | A _2 ]' >
          <span>
            so <M>F _2 = F _1 · [ A _2 | A _1 ]</M>: a small force becomes a large one.
          </span>
        </Eq>
        <Fig caption="The big piston has 16 times the area, so it gets 16 times the force. But the fluid is not created: to raise the big piston 1 cm, the small one must go down 16 cm.">
          <Lift />
        </Fig>
        <Note label="No free lunch">The fluid volume that leaves the small cylinder enters the big one: <M>A _1 · d _1 = A _2 · d _2</M>. Force is multiplied, distance is divided, and the work <M>F · d</M> stays the same. Car jacks, brakes and diggers all work this way.</Note>
      </section>

      <section className="t-section" id="t-buoyancy">
        <SectionHead n={no('buoyancy')} title="Buoyancy and floating" />
        <p>
          Push a beach ball under water and you feel it push back up. The pressure is higher on the bottom of the ball than on the top, and the difference is an upward force: the <strong>buoyant force</strong>. <strong>Archimedes' principle</strong> says it equals the weight of the fluid the object pushes aside:
        </p>
        <Eq src='B = ρ _f · V · g'>
          <span>
            <M>ρ _f</M> is the density of the fluid and <M>V</M> the volume of the object that is under the surface.
          </span>
        </Eq>
        <Fig caption="As the block goes under, the spring balance reads less and less: reading = W − B. Once it is fully under, B stops growing.">
          <SpringBalance />
        </Fig>
        <p>
          An object floats when its weight and the buoyant force balance. A body of density <M>ρ _b</M> and volume <M>V</M> has weight <M>ρ _b · V · g</M>. If a part <M>V _sub</M> is under the surface, <M>ρ _b · V · g = ρ _f · V _sub · g</M>, so
        </p>
        <Eq src='[ V _sub | V ] = [ ρ _b | ρ _f ]'>
          <span>If the body is denser than the fluid the ratio would be above 1: it cannot float, and sinks.</span>
        </Eq>
        <Fig caption="The denser the block, the more of it sits below the waterline. The two arrows are always equal when it floats.">
          <Floating />
        </Fig>
      </section>

      <section className="t-section" id="t-continuity">
        <SectionHead n={no('continuity')} title="Flow and continuity" />
        <p>
          Now let the fluid move. In <strong>streamline flow</strong> each particle follows a smooth path, and paths never cross. For a liquid, which cannot be squeezed, whatever volume flows into a pipe each second must flow out. Through a pipe of cross-section area <M>A</M> with speed <M>v</M>, the volume flow rate is <M>Q = A · v</M>, and
        </p>
        <Eq src='A _1 · v _1 = A _2 · v _2'>
          <span>This is the <strong>equation of continuity</strong>: where the pipe narrows, the fluid speeds up.</span>
        </Eq>
        <Fig caption="The pipe's width halves, so its area is a quarter, so the water goes four times as fast.">
          <PipeFlow />
        </Fig>
        <p>It is why your thumb over a hose makes the water shoot out faster, and why a river runs quickly through a narrow gorge.</p>
      </section>

      <section className="t-section" id="t-bernoulli">
        <SectionHead n={no('bernoulli')} title="Bernoulli's equation" />
        <p>
          If the water speeds up in the narrow part, it must be pushed forward harder from behind than from in front. So the pressure in the fast part is <em>lower</em>. <strong>Bernoulli's equation</strong> is energy conservation per unit volume, for a smooth, steady flow of fluid with no friction:
        </p>
        <Eq src='p + ½ · ρ · v ^2 + ρ · g · h = "constant"'>
          <span>along any streamline. The three terms are pressure, kinetic energy and potential energy per unit volume.</span>
        </Eq>
        <Fig caption="Watch the glass tubes. The narrow part has faster water, so its column is lower: lower pressure.">
          <PipeFlow tubes />
        </Fig>
        <p>
          For a horizontal pipe the height term cancels, and between a wide part (<M>1</M>) and a narrow part (<M>2</M>) the pressure drops by
        </p>
        <Eq src='p _1 − p _2 = ½ · ρ · ( v _2 ^2 − v _1 ^2 )' />
        <p>This pipe with tubes is a <strong>venturi meter</strong>: measure the pressure drop and you can calculate the flow speed.</p>
      </section>

      <section className="t-section" id="t-uses">
        <SectionHead n={no('uses')} title="Wings and spinning balls" />
        <p>
          A wing is shaped and tilted so the air has to go farther over the top than under the bottom. The streamlines bunch up above, the air speeds up there, and by Bernoulli the pressure is lower on top. The net upward push on the wing is <strong>lift</strong>. (The wing also pushes air downward, which is the same story told by Newton's third law.)
        </p>
        <Fig caption="Fast air above, lower pressure: the difference in pressure times the wing's area is the lift.">
          <Wing />
        </Fig>
        <p>
          A spinning ball does something similar. Its surface drags a thin layer of air round with it. On one side that layer moves with the oncoming air (fast), on the other against it (slow). The pressure difference pushes the ball sideways: this is the swing of a cricket ball and the dip of a topspin shot.
        </p>
        <Fig caption="Topspin makes the air above the ball move faster, so the ball is pushed down and dips sooner.">
          <SpinBall />
        </Fig>
      </section>

      <section className="t-section" id="t-viscosity">
        <SectionHead n={no('viscosity')} title="Viscosity" />
        <p>
          Honey is harder to pour than water: it is more <strong>viscous</strong>. Viscosity is the internal friction of a fluid, the way one layer drags on the next. Slide a plate over a layer of fluid and the layer sticks to the plate and moves with it, while the layer at the fixed bottom stays still. The speed changes steadily between them, and the force needed to keep the plate going is
        </p>
        <Eq src='F = η · A · [ v | d ]'>
          <span>
            where <M>η</M> (eta) is the <strong>coefficient of viscosity</strong>, in Pa·s. The more viscous the fluid, the bigger <M>η</M>.
          </span>
        </Eq>
        <Fig caption="Each layer is dragged by the one above and drags the one below. Water has η ≈ 0.001 Pa·s; glycerine about 0.8 Pa·s.">
          <Couette />
        </Fig>
        <p>Heating a liquid lowers its viscosity (warm honey runs), but heating a gas raises it.</p>
      </section>

      <section className="t-section" id="t-stokes">
        <SectionHead n={no('stokes')} title="Terminal velocity" />
        <p>
          A small sphere of radius <M>r</M> moving slowly at speed <M>v</M> through a viscous fluid feels a drag force given by <strong>Stokes' law</strong>:
        </p>
        <Eq src='F = 6 · π · η · r · v' />
        <p>
          Drop a ball into oil. At first only gravity (<M>W</M>) and buoyancy (<M>B</M>) act. As it speeds up, the drag <M>D</M> grows, until <M>W = B + D</M>. After that there is no net force and the ball falls at a steady <strong>terminal velocity</strong>.
        </p>
        <Fig caption="The speed rises quickly and then flattens at v_t, exactly when the upward forces balance the weight.">
          <Terminal />
        </Fig>
        <p>
          Writing the weight as <M>[ 4 | 3 ] · π · r ^3 · ρ · g</M> and the buoyancy with the fluid's density <M>σ</M>, the balance gives
        </p>
        <Eq src='v _t = [ 2 · r ^2 · ( ρ − σ ) · g | 9 · η ]'>
          <span>It depends on <M>r ^2</M>: big drops fall faster than small ones, which is why fog hangs in the air but raindrops fall.</span>
        </Eq>
        <Fig caption="Below about Re = 2000 the flow is smooth (laminar); above that it breaks into eddies (turbulent). Re = ρvD/η.">
          <Reynolds />
        </Fig>
        <p>
          Stokes' law only holds for smooth, slow flow. Whether the flow is smooth or turbulent depends on the <strong>Reynolds number</strong> <M>Re = [ ρ · v · D | η ]</M>, a ratio with no unit, where <M>D</M> is the pipe diameter. Below about 2000 flow in a pipe is laminar, and above about 3000 it is turbulent.
        </p>
      </section>

      <section className="t-section" id="t-tension">
        <SectionHead n={no('tension')} title="Surface tension" />
        <p>
          A drop of water pulls itself into a ball, and a small insect can walk on a pond. The surface of a liquid acts like a stretched skin. The reason is in the molecules: one inside the liquid is pulled equally in all directions, but one at the surface has neighbours only below and beside it, so it is pulled inward.
        </p>
        <Fig caption="The surface molecules are all pulled inward, so the liquid tries to have as little surface as possible.">
          <Molecules />
        </Fig>
        <p>
          The <strong>surface tension</strong> <M>T</M> is the force along the surface per unit length of any line drawn in it: <M>T = F / l</M>, in N/m. For water at room temperature, <M>T = 0.0728 "N/m"</M>.
        </p>
        <p>Pulling a film to make more surface takes work, which is stored as <strong>surface energy</strong>:</p>
        <Eq src='W = T · ΔA'>
          <span>
            The energy per unit area equals <M>T</M>. A soap film has two surfaces, so a bar of length <M>l</M> is pulled by <M>F = 2 · T · l</M>.
          </span>
        </Eq>
        <Fig caption="The hand pulls the bar down with a steady force 2Tl, whatever the size of the film. The work done goes into the extra surface.">
          <Film />
        </Fig>
      </section>

      <section className="t-section" id="t-capillary">
        <SectionHead n={no('capillary')} title="Capillary rise" />
        <p>
          Dip a thin tube into water and the water climbs up it. Water sticks to glass, so the surface curves up at the wall, meeting it at a <strong>contact angle</strong> <M>θ</M> (nearly 0° for clean glass and water). The surface tension pulls the water up along the whole circle where it touches the glass, <M>2 · π · r</M> long, with a vertical part <M>T · cos θ</M> on each unit of length. It lifts the weight of the column, <M>π · r ^2 · h · ρ · g</M>:
        </p>
        <Eq src={['2 · π · r · T · cos θ = π · r ^2 · h · ρ · g', 'h = [ 2 · T · cos θ | ρ · g · r ]']} />
        <Fig caption="The surface tension pulls the edge of the water up the glass until the weight of the column balances it.">
          <CapTubes tag="T pulls up on the rim" />
        </Fig>
        <p>
          A thinner tube (small <M>r</M>) makes a bigger rise. Liquids that do not wet the glass, like mercury, have <M>θ</M> above 90° so <M>cos θ</M> is negative and the liquid is pushed <em>down</em>. This is how water climbs a towel and up the roots of a plant.
        </p>
      </section>

      <section className="t-section" id="t-drops">
        <SectionHead n={no('drops')} title="Drops and bubbles" />
        <p>
          A curved surface under tension squeezes the fluid inside it, so the pressure inside a drop or bubble is higher than outside. Balance the work done in growing a drop by <M>dr</M>: the surface energy rises by <M>T · 8 · π · r · dr</M> and the pressure difference does <M>Δp · 4 · π · r ^2 · dr</M>, giving
        </p>
        <Eq src={['Δp = [ 2 · T | r ]  "(a drop, one surface)"', 'Δp = [ 4 · T | r ]  "(a soap bubble, two surfaces)"']} />
        <Fig caption="The smaller the bubble, the higher the pressure inside. So air flows from the small bubble into the large one, which grows while the small one shrinks.">
          <Bubbles />
        </Fig>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {SHEET.map(([name, src]) => (
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
              {SYMBOLS.map(([sym, meaning, unit]) => (
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
        <Example n={1} title="Ten metres under water">
          <p className="ex-q">A diver is 10 m below the surface of fresh water. Find the absolute pressure and the gauge pressure. Use <M>p _0 = 1.013 × 10 ^5 "Pa"</M>, <M>ρ = 1000 "kg/m³"</M>, <M>g = 9.8 "m/s²"</M>.</p>
          <Given items={['h = 10 "m"', 'ρ = 1000 "kg/m³"', 'p _0 = 1.013 × 10 ^5 "Pa"']} />
          <ol className="steps">
            <Step title="Pressure of the water alone">
              <Eq src='ρ · g · h = 1000 · 9.8 · 10 = 9.8 × 10 ^4 "Pa"' />
            </Step>
            <Step title="Add the air above">
              <Eq src='p = p _0 + ρ · g · h = 1.013 × 10 ^5 + 0.98 × 10 ^5 = 1.99 × 10 ^5 "Pa"' />
            </Step>
          </ol>
          <Answer>Absolute pressure 1.99 × 10⁵ Pa, about 2 atmospheres. The gauge pressure is just the water part, 9.8 × 10⁴ Pa: ten metres of water adds roughly one atmosphere.</Answer>
          <Fig>
            <Diver maxDepth={10} height={260} />
          </Fig>
        </Example>

        <Example n={2} title="Lifting a car">
          <p className="ex-q">A garage hydraulic lift has a small piston of radius 2 cm and a large piston of radius 12 cm. What force on the small piston lifts a 1200 kg car? How far must the small piston move to lift the car 1 cm?</p>
          <Given items={['r _1 = 2 "cm"', 'r _2 = 12 "cm"', 'm = 1200 "kg"']} />
          <ol className="steps">
            <Step title="Ratio of the areas">
              <Eq src='[ A _2 | A _1 ] = ( [ r _2 | r _1 ] ) ^2 = ( [ 12 | 2 ] ) ^2 = 36' />
            </Step>
            <Step title="Weight of the car">
              <Eq src='W = m · g = 1200 · 9.8 = 11 760 "N"' />
            </Step>
            <Step title="Force on the small piston">
              <Eq src='F _1 = F _2 · [ A _1 | A _2 ] = [ 11 760 | 36 ] = 327 "N"' />
            </Step>
            <Step title="Distance">
              <Eq src='d _1 = d _2 · [ A _2 | A _1 ] = 1 · 36 = 36 "cm"' />
            </Step>
          </ol>
          <Answer>A push of 327 N (about the weight of a 33 kg mass) lifts the car, but the small piston must travel 36 cm for every 1 cm of lift.</Answer>
          <Fig caption="Drawn with a smaller ratio than 36, so that you can see both pistons move.">
            <Lift wS={24} wB={144} push={72} />
          </Fig>
        </Example>

        <Example n={3} title="The tip of the iceberg">
          <p className="ex-q">Ice has a density of 917 kg/m³ and sea water 1030 kg/m³. What fraction of an iceberg is under water?</p>
          <Given items={['ρ _ice = 917 "kg/m³"', 'ρ _sea = 1030 "kg/m³"']} />
          <ol className="steps">
            <Step title="Balance the weight with the buoyant force">
              <Eq src='ρ _ice · V · g = ρ _sea · V _sub · g' />
            </Step>
            <Step title="Solve for the fraction">
              <Eq src='[ V _sub | V ] = [ ρ _ice | ρ _sea ] = [ 917 | 1030 ] = 0.890' />
            </Step>
          </ol>
          <Answer>89% of the iceberg is below the surface, and only 11% shows.</Answer>
          <Fig>
            <Floating fixed={917 / 1030} label="ice" />
          </Fig>
        </Example>

        <Example n={4} title="Water through a narrowing pipe">
          <p className="ex-q">Water flows at 2 m/s through a horizontal pipe of diameter 10 cm, at a gauge pressure of 150 kPa. The pipe narrows to a diameter of 5 cm. Find the new speed, the flow rate, and the new pressure.</p>
          <Given items={['d _1 = 10 "cm"', 'd _2 = 5 "cm"', 'v _1 = 2 "m/s"', 'p _1 = 150 "kPa"']} />
          <ol className="steps">
            <Step title="Speed from continuity">
              <p>Half the diameter is a quarter of the area, since <M>A ∝ d ^2</M>.</p>
              <Eq src='v _2 = v _1 · [ A _1 | A _2 ] = 2 · ( [ 10 | 5 ] ) ^2 = 8 "m/s"' />
            </Step>
            <Step title="Flow rate">
              <Eq src='Q = A _1 · v _1 = π · 0.05 ^2 · 2 = 0.0157 "m³/s" = 15.7 "litres per second"' />
            </Step>
            <Step title="Pressure drop from Bernoulli">
              <Eq src='p _1 − p _2 = ½ · ρ · ( v _2 ^2 − v _1 ^2 ) = ½ · 1000 · ( 8 ^2 − 2 ^2 ) = 3.0 × 10 ^4 "Pa"' />
            </Step>
            <Step title="New pressure">
              <Eq src='p _2 = 150 − 30 = 120 "kPa"' />
            </Step>
          </ol>
          <Answer>The water goes four times as fast, 8 m/s, at 15.7 L/s, and its gauge pressure falls from 150 kPa to 120 kPa.</Answer>
          <Fig>
            <PipeFlow tubes />
          </Fig>
        </Example>

        <Example n={5} title="A steel ball in glycerine">
          <p className="ex-q">A steel ball of radius 1 mm (density 7800 kg/m³) falls through glycerine (density 1260 kg/m³, viscosity 0.83 Pa·s). Find its terminal velocity, and check that the flow is smooth.</p>
          <Given items={['r = 1 × 10 ^−3 "m"', 'ρ = 7800 "kg/m³"', 'σ = 1260 "kg/m³"', 'η = 0.83 "Pa·s"']} />
          <ol className="steps">
            <Step title="Use the terminal velocity formula">
              <Eq src='v _t = [ 2 · r ^2 · ( ρ − σ ) · g | 9 · η ] = [ 2 · ( 10 ^−3 ) ^2 · 6540 · 9.8 | 9 · 0.83 ] = 1.72 × 10 ^−2 "m/s"' />
            </Step>
            <Step title="Check with the Reynolds number">
              <Eq src='Re = [ σ · v · 2 · r | η ] = [ 1260 · 0.0172 · 0.002 | 0.83 ] = 0.052' />
            </Step>
          </ol>
          <Answer>The ball sinks at 1.72 cm/s. Re is far below 1, so the flow is smooth and Stokes' law applies.</Answer>
          <Fig>
            <Terminal note="v_t = 1.72 cm/s (shape only)" />
          </Fig>
        </Example>

        <Example n={6} title="Water in a thin tube">
          <p className="ex-q">How high does water rise in a clean glass tube of radius 0.5 mm? Take <M>T = 0.0728 "N/m"</M>, <M>θ = 0°</M>, <M>ρ = 1000 "kg/m³"</M>.</p>
          <Given items={['r = 0.5 × 10 ^−3 "m"', 'T = 0.0728 "N/m"', 'θ = 0°']} />
          <ol className="steps">
            <Step title="Use the capillary formula">
              <Eq src='h = [ 2 · T · cos θ | ρ · g · r ] = [ 2 · 0.0728 · 1 | 1000 · 9.8 · 0.5 × 10 ^−3 ]' />
            </Step>
            <Step title="Calculate">
              <Eq src='h = [ 0.1456 | 4.9 ] = 0.0297 "m"' />
            </Step>
          </ol>
          <Answer>The water rises 2.97 cm. In a tube of half that radius it would rise twice as high.</Answer>
          <Fig>
            <CapTubes labels={['r = 0.5 mm']} hLabel="h = 2.97 cm" />
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="“More water means more pressure”" wrong={'p ∝ "volume of water"'} fig={<Vessels />}>
            Pressure depends on depth, density and <M>g</M>, not on the shape or the amount. All three vessels are filled to the same depth, and the pressures at the bottom are equal.
          </Mistake>
          <Mistake title="“Buoyancy gets bigger the deeper you go”" wrong="B ∝ h" fig={<BuoyancyDepth />}>
            <M>B = ρ · V · g</M> uses the volume under the surface. Once the object is fully under, <M>V</M> is fixed and so is <M>B</M>, however deep it goes.
          </Mistake>
          <Mistake title="Forgetting the air above" wrong="p = ρ · g · h" fig={<PressureStack />}>
            That formula gives only the gauge pressure. The absolute pressure at depth is <M>p _0 + ρ · g · h</M>: at 10 m, 1.99 × 10⁵ Pa, not 0.98 × 10⁵.
          </Mistake>
          <Mistake title="“Fast flow has high pressure”" wrong={'"fast" = "high pressure"'} fig={<PipeFlow tubes height={230} h1={64} h2={32} />}>
            In a steady flow, the pressure is <em>lower</em> where the fluid is faster. The faster water has used up some of its pressure energy as kinetic energy.
          </Mistake>
          <Mistake title="“Heavy things sink”" wrong={'"heavy" = "sinks"'} fig={<SinkOrFloat />}>
            What counts is density against the fluid's density. A huge log floats; a small stone sinks. A steel ship floats because its hollow shape pushes aside a lot of water.
          </Mistake>
          <Mistake title="“A wider tube lifts the water higher”" wrong="h ∝ r" fig={<CapTubes widths={[14, 36]} K={1500} height={240} />}>
            The rise is <M>h = 2 · T · cos θ / ( ρ · g · r )</M>: the narrower the tube, the higher the water goes.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Pressure grows with depth, speed lowers it, and a skin of tension holds the small drops together.</p>
        <p className="closing-sub">Next: the same ideas about energy and molecules lead to heat and temperature, and then to the gas laws.</p>
      </footer>
    </ChapterShell>
  );
}
