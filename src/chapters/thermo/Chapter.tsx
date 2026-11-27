import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Fig } from '../kit/Anim';
import { Mistake, Mistakes } from '../kit/Mistake';
import { AdiaCompressScene, CarnotScene, CelsiusBars, ClausiusScene, CpCvScene, CycleScene, ExpandWork, FirstLawScene, FlowScene, FreeExpansionScene, HeatWorkScene, IsoAdiaScene, IsoWorkScene, MiniCyl, ProcessesScene, SystemScene, TwoPathsScene, ZerothScene } from './Scenes';

/** Thermodynamics: heat, work, the first law, engines, fridges and the second law. */

const SECTIONS: NoteSection[] = [
  { id: 'system', title: 'System, state and equilibrium', group: 'Theory' },
  { id: 'energy', title: 'Internal energy, heat and work', group: 'Theory' },
  { id: 'work', title: 'Work done by a gas', group: 'Theory' },
  { id: 'first', title: 'The first law', group: 'Theory' },
  { id: 'processes', title: 'Four basic processes', group: 'Theory' },
  { id: 'isoadia', title: 'Isothermal and adiabatic', group: 'Theory' },
  { id: 'cpcv', title: 'Specific heats of a gas', group: 'Theory' },
  { id: 'engines', title: 'Cycles and heat engines', group: 'Theory' },
  { id: 'carnot', title: 'The Carnot cycle', group: 'Theory' },
  { id: 'fridge', title: 'Refrigerators', group: 'Theory' },
  { id: 'second', title: 'The second law and entropy', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];
const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="thermo" sections={SECTIONS} sideTitle="Thermodynamics" sideLead="Heat, work and energy of a gas: the first law, engines and fridges, and why heat only flows downhill by itself.">
      <header className="article-head">
        <span className="kicker">Physics · Heat and thermodynamics</span>
        <h1 className="article-title">Why can heat become work, but never completely?</h1>
        <p className="article-lead">A steam engine turns heat into motion, and a fridge moves heat the wrong way. This chapter builds the rules both must obey: one law about energy, and one about direction.</p>
      </header>

      <section className="t-section" id="t-system">
        <SectionHead n={no('system')} title="System, state and equilibrium" />
        <p>
          Thermodynamics follows energy as it moves in and out of a chosen piece of the world. That piece is the <strong>system</strong>, for example the gas in a cylinder. Everything else is the <strong>surroundings</strong>, and the edge between them is the boundary. Energy crosses the boundary as heat or as work.
        </p>
        <Fig caption="Heat Q enters through the walls; the gas does work W by pushing the piston out. Warming raises T, expanding raises V.">
          <SystemScene />
        </Fig>
        <p>
          The condition of the gas is described by its <strong>state variables</strong>: pressure <M>p</M>, volume <M>V</M>, temperature <M>T</M> and the amount of gas <M>n</M>. For an ideal gas they are tied by
        </p>
        <Eq src='p · V = n · R · T' />
        <p>
          with <M>R = 8.31 "J/(mol·K)"</M>. A state variable depends only on the state now, not on how the gas got there. Temperature must be in kelvin: <M>T = t + 273</M> for a Celsius value t.
        </p>
        <p>
          Two bodies in contact exchange heat until they reach <strong>thermal equilibrium</strong>, with equal temperatures. The <strong>zeroth law</strong> says that if A is in equilibrium with C, and B is in equilibrium with C, then A and B are in equilibrium with each other. That is what makes a thermometer meaningful: C stands for the thermometer.
        </p>
        <Fig caption="The thermometer C settles at 320 K with A, and still reads 320 K at B: temperature is a property both share.">
          <ZerothScene />
        </Fig>
      </section>

      <section className="t-section" id="t-energy">
        <SectionHead n={no('energy')} title="Internal energy, heat and work" />
        <p>
          The <strong>internal energy</strong> <M>U</M> is all the energy of the molecules inside: their random motion (and, for real substances, the forces between them). In an ideal gas there are no forces between molecules, so <M>U</M> depends only on temperature. For a monatomic gas
        </p>
        <Eq src='U = [ 3 | 2 ] · n · R · T' />
        <p>
          There are two ways to change <M>U</M>. <strong>Heat</strong> <M>Q</M> is energy that moves because of a temperature difference. <strong>Work</strong> <M>W</M> is energy transferred by a force moving something, such as a piston. Either one makes the molecules move faster.
        </p>
        <Fig caption="First heat flows in, then the piston is pushed down. Both raise U; the gas cannot tell which was which.">
          <HeatWorkScene />
        </Fig>
        <Note label="Remember">Heat and work describe energy in transit. A gas contains internal energy, but it does not contain "heat" or "work".</Note>
      </section>

      <section className="t-section" id="t-work">
        <SectionHead n={no('work')} title="Work done by a gas" />
        <p>
          A gas at pressure <M>p</M> pushes a piston of area <M>A</M> with force <M>F = p · A</M>. If the piston moves out a distance <M>d</M>, the work done by the gas is <M>F · d = p · A · d</M>, and <M>A · d</M> is the change in volume. So at constant pressure
        </p>
        <Eq src='W = p · ΔV' />
        <p>
          On a p–V graph this is the area under the line. When the pressure changes, the work is still the area under the curve, found by adding thin strips <M>W = ∫ p · dV</M>. Expansion (<M>ΔV</M> positive) gives positive work: the gas gives energy away. Compression gives negative work.
        </p>
        <Fig caption="At 100 kPa the gas expands from 2 L to 4 L. The shaded rectangle grows as the piston moves; its area is the work, 200 J.">
          <ExpandWork p={100000} v1={2} v2={4} title="A gas expands at constant pressure; the area under the line on the p-V graph grows and equals the work done" />
        </Fig>
        <Note label="Units">Pa × m³ = J. Convert litres first: 1 L = 10⁻³ m³.</Note>
      </section>

      <section className="t-section" id="t-first">
        <SectionHead n={no('first')} title="The first law" />
        <p>
          The first law is conservation of energy for a gas. The heat added, minus the work the gas does, is what is left to raise the internal energy:
        </p>
        <Eq src='ΔU = Q − W' />
        <p>
          <strong>Sign convention used here:</strong> <M>Q</M> is positive when heat flows into the gas, negative when it flows out. <M>W</M> is positive when the gas does work on the surroundings (expands), negative when work is done on the gas (compression). Some books write <M>ΔU = Q + W</M> with W meaning work done on the gas; always check which one your book means.
        </p>
        <Fig caption="600 J of heat arrives; 250 J leaves as work; the remaining 350 J raises the internal energy.">
          <FirstLawScene Q={600} W={250} title="Heat in splits into work done by the gas and a rise in internal energy" />
        </Fig>
      </section>

      <section className="t-section" id="t-processes">
        <SectionHead n={no('processes')} title="Four basic processes" />
        <p>A <strong>process</strong> is a path from one state to another. Four are especially simple. Watch each one start from the same point A.</p>
        <Fig caption="Isobaric: a horizontal line. Isochoric: vertical. Isothermal: a hyperbola. Adiabatic: a steeper curve. The shaded area is the work.">
          <ProcessesScene />
        </Fig>
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Process</th>
                <th scope="col">Condition</th>
                <th scope="col">Work W</th>
                <th scope="col">First law gives</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['Isobaric', 'p constant', 'p · ΔV', 'Q = ΔU + p · ΔV'],
                  ['Isochoric', 'V constant', '0', 'Q = ΔU'],
                  ['Isothermal', 'T constant', 'n · R · T · ln ( [ V _2 | V _1 ] )', 'ΔU = 0, Q = W'],
                  ['Adiabatic', 'Q = 0', '[ p _1 · V _1 − p _2 · V _2 | γ − 1 ]', 'ΔU = −W'],
                  ['Cyclic', 'back to the start', 'area inside the loop', 'ΔU = 0, Q = W'],
                ] as const
              ).map(([a, b, c, d]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td>{b}</td>
                  <td>
                    <M>{c}</M>
                  </td>
                  <td>
                    <M>{d}</M>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-isoadia">
        <SectionHead n={no('isoadia')} title="Isothermal and adiabatic" />
        <p>
          In an <strong>isothermal</strong> process the temperature stays fixed, so <M>p · V</M> is constant and the curve is a hyperbola. The area under it, found by integrating <M>p = n · R · T / V</M>, is
        </p>
        <Eq src='W = n · R · T · ln ( [ V _2 | V _1 ] )' />
        <p>
          Because <M>ΔU = 0</M>, all the heat that flows in becomes work. This needs slow change so heat can keep up.
        </p>
        <p>
          In an <strong>adiabatic</strong> process no heat flows (a fast process or a well insulated one). Then the gas pays for any work out of its own internal energy and cools as it expands. For an ideal gas
        </p>
        <Eq src={['p · V ^γ = "constant"', 'T · V ^γ−1 = "constant"']} />
        <p>
          where <M>γ</M> is the ratio of the specific heats (1.4 for air). The slope of the isothermal curve is <M>−p / V</M>, and of the adiabatic curve <M>−γ · p / V</M>, which is steeper. So between the same volumes, the adiabatic work is smaller and the gas ends up colder.
        </p>
        <Fig caption="Both curves start at A. The adiabatic one drops faster and the gas cools to 0.68 of its starting temperature.">
          <IsoAdiaScene />
        </Fig>
      </section>

      <section className="t-section" id="t-cpcv">
        <SectionHead n={no('cpcv')} title="Specific heats of a gas" />
        <p>
          A gas needs different amounts of heat per kelvin depending on whether its volume or pressure is held fixed. The molar specific heats are <M>C _v</M> (constant volume) and <M>C _p</M> (constant pressure):
        </p>
        <Eq src={['Q = n · C _v · ΔT', 'Q = n · C _p · ΔT']} />
        <p>
          At constant volume no work is done, so all the heat raises <M>U</M>: <M>ΔU = n · C _v · ΔT</M>. This holds for any process of an ideal gas, since <M>U</M> depends only on T. At constant pressure some heat goes into pushing the piston, <M>W = p · ΔV = n · R · ΔT</M>, so
        </p>
        <Eq src='n · C _p · ΔT = n · C _v · ΔT + n · R · ΔT' />
        <Eq src='C _p − C _v = R'>
          <p>so C_p is always bigger than C_v, and their ratio is <M>γ = [ C _p | C _v ]</M>.</p>
        </Eq>
        <Fig caption="The same 100 J warms one mole by 8.0 K when the volume is fixed (C_v = 3R/2) but by only 4.8 K when it can expand (C_p = 5R/2).">
          <CpCvScene />
        </Fig>
        <p>
          For a monatomic gas <M>C _v = [ 3 | 2 ] · R</M>, <M>C _p = [ 5 | 2 ] · R</M> and <M>γ = [ 5 | 3 ]</M>. For a diatomic gas such as air <M>C _v = [ 5 | 2 ] · R</M>, <M>C _p = [ 7 | 2 ] · R</M> and <M>γ = [ 7 | 5 ] = 1.4</M>.
        </p>
      </section>

      <section className="t-section" id="t-engines">
        <SectionHead n={no('engines')} title="Cycles and heat engines" />
        <p>
          In a <strong>cyclic process</strong> the gas returns to its starting state, so <M>ΔU = 0</M> and the net heat equals the net work. On the p–V graph a clockwise loop has expansion at high pressure and compression at low pressure, so the net work is positive. It equals the area inside the loop.
        </p>
        <Fig caption="Round the loop A to B to C to D. After one cycle ΔU = 0, but the area inside is the work done.">
          <CycleScene title="A gas goes round a rectangular loop on the p-V diagram; the area enclosed is the net work for the cycle" />
        </Fig>
        <p>
          A <strong>heat engine</strong> repeats such a cycle. It takes heat <M>Q _h</M> from a hot source, turns part of it into work <M>W</M>, and must throw the rest <M>Q _c</M> away to a cold sink. By the first law <M>W = Q _h − Q _c</M>. The <strong>efficiency</strong> is the useful work as a fraction of heat paid for:
        </p>
        <Eq src='η = [ W | Q _h ] = 1 − [ Q _c | Q _h ]' />
        <Fig caption="An engine takes 800 J, turns 300 J into work and rejects 500 J. The arrow widths are drawn in proportion.">
          <FlowScene kind="engine" Qh={800} Qc={500} W={300} Th="hot" Tc="cold" result="η = 300 / 800 = 37.5 %" title="Energy flow in a heat engine: heat in, work out and heat rejected, with arrows sized to the numbers" />
        </Fig>
      </section>

      <section className="t-section" id="t-carnot">
        <SectionHead n={no('carnot')} title="The Carnot cycle" />
        <p>
          How good can an engine be? The best possible one between two temperatures is the <strong>Carnot engine</strong>, a reversible cycle of four strokes: isothermal expansion at <M>T _h</M> (heat in), adiabatic expansion (cooling to <M>T _c</M>), isothermal compression at <M>T _c</M> (heat out), and adiabatic compression back to <M>T _h</M>.
        </p>
        <Fig caption="Four strokes, 1 to 2, 2 to 3, 3 to 4, 4 to 1. The base of the cylinder is hot, insulated or cold as needed. The enclosed area is the work.">
          <CarnotScene />
        </Fig>
        <p>Its efficiency depends only on the two temperatures, in kelvin:</p>
        <Eq src={['η = 1 − [ T _c | T _h ]', '[ Q _c | Q _h ] = [ T _c | T _h ]']} />
        <p>
          No engine working between the same two temperatures can do better. Efficiency is higher for a hotter source or a colder sink, and it can never be 100% unless <M>T _c</M> is absolute zero.
        </p>
      </section>

      <section className="t-section" id="t-fridge">
        <SectionHead n={no('fridge')} title="Refrigerators" />
        <p>
          Run an engine backwards and you get a <strong>refrigerator</strong>. Work <M>W</M> goes in, and heat <M>Q _c</M> is pulled out of the cold space and dumped, together with the work, into the warm room: <M>Q _h = Q _c + W</M>. Heat is moved uphill, which does not happen by itself.
        </p>
        <Fig caption="A fridge removes 400 J from inside using 100 J of work, and delivers 500 J to the room.">
          <FlowScene kind="fridge" Qh={500} Qc={400} W={100} Th="warm" Tc="cold" result="COP = 400 / 100 = 4" title="Energy flow in a fridge: work goes in, heat is pumped from cold to hot, arrows sized to the numbers" />
        </Fig>
        <p>What matters is how much heat is moved per joule of work, the <strong>coefficient of performance</strong>:</p>
        <Eq src={['"COP" = [ Q _c | W ] = [ Q _c | Q _h − Q _c ]', '"COP" _ideal = [ T _c | T _h − T _c ]']} />
        <p>The COP can be well above 1, because the fridge only moves heat; it does not make it. A heat pump for heating a house is the same machine, judged by <M>Q _h / W</M>.</p>
      </section>

      <section className="t-section" id="t-second">
        <SectionHead n={no('second')} title="The second law and entropy" />
        <p>
          The first law allows many things that never happen. The second law says which way things go. Two equivalent statements:
        </p>
        <p>
          <strong>Kelvin–Planck:</strong> no engine working in a cycle can take heat from one reservoir and turn all of it into work. Some heat must always be rejected.
        </p>
        <Fig caption="A perfect engine with no rejected heat would break the Kelvin–Planck statement. It has never been seen.">
          <FlowScene kind="engine" Qh={600} Qc={0} W={600} Th="hot" Tc="cold" impossible title="An engine that turns all heat into work, crossed out because the second law forbids it" />
        </Fig>
        <p>
          <strong>Clausius:</strong> heat cannot flow by itself from a colder body to a hotter one. A fridge needs work to do it.
        </p>
        <Fig caption="Heat flows from hot to cold until the temperatures match, and then stops. The reverse never happens on its own.">
          <ClausiusScene />
        </Fig>
        <p>
          A <strong>reversible</strong> process could be run backwards, leaving no change anywhere. It must be slow and frictionless, with only tiny temperature differences. Real processes, such as friction, heat flow across a gap, and a gas rushing into a vacuum, are <strong>irreversible</strong>.
        </p>
        <p>
          <strong>Entropy</strong> <M>S</M> measures how spread out the energy and the molecules are. For heat <M>Q</M> added reversibly at temperature <M>T</M>, the change is <M>ΔS = [ Q | T ]</M>. The second law becomes: the entropy of an isolated system never decreases, and it rises in every irreversible process.
        </p>
        <Fig caption="Remove the partition and the gas fills both halves. The reverse would not break energy conservation, but it is overwhelmingly unlikely.">
          <FreeExpansionScene />
        </Fig>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Ideal gas', 'p · V = n · R · T'],
                  ['Internal energy, monatomic', 'U = [ 3 | 2 ] · n · R · T'],
                  ['Work at constant pressure', 'W = p · ΔV'],
                  ['Work, general', 'W = ∫ p · dV'],
                  ['First law', 'ΔU = Q − W'],
                  ['Isothermal work', 'W = n · R · T · ln ( [ V _2 | V _1 ] )'],
                  ['Adiabatic law', 'p · V ^γ = "constant"'],
                  ['Adiabatic law, temperature', 'T · V ^γ−1 = "constant"'],
                  ['Adiabatic work', 'W = [ p _1 · V _1 − p _2 · V _2 | γ − 1 ]'],
                  ['Heat at constant volume', 'Q = n · C _v · ΔT'],
                  ['Heat at constant pressure', 'Q = n · C _p · ΔT'],
                  ['Mayer relation', 'C _p − C _v = R'],
                  ['Ratio of specific heats', 'γ = [ C _p | C _v ]'],
                  ['Engine efficiency', 'η = [ W | Q _h ] = 1 − [ Q _c | Q _h ]'],
                  ['Carnot efficiency', 'η = 1 − [ T _c | T _h ]'],
                  ['Coefficient of performance', '"COP" = [ Q _c | W ]'],
                  ['Ideal fridge', '"COP" = [ T _c | T _h − T _c ]'],
                  ['Entropy change', 'ΔS = [ Q | T ]'],
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
                  ['Q', 'Heat added to the gas', 'J'],
                  ['W', 'Work done by the gas', 'J'],
                  ['U', 'Internal energy', 'J'],
                  ['T', 'Temperature, always in kelvin', 'K'],
                  ['n', 'Amount of gas', 'mol'],
                  ['R', 'Gas constant, 8.31', 'J/(mol·K)'],
                  ['γ', 'Ratio of specific heats', 'none'],
                  ['η', 'Efficiency', 'none'],
                  ['S', 'Entropy', 'J/K'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{unit === 'none' ? unit : <M>{`"${unit}"`}</M>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />
        <Example n={1} title="Work in an expansion">
          <p className="ex-q">A gas expands at a constant pressure of 1 × 10⁵ Pa from 2 L to 5 L. How much work does it do?</p>
          <Given items={['p = 1 × 10 ^5 "Pa"', 'V _1 = 2 "L"', 'V _2 = 5 "L"']} />
          <ol className="steps">
            <Step title="Change in volume, in m³">
              <Eq src='ΔV = 5 − 2 = 3 "L" = 3 × 10 ^−3 "m³"' />
            </Step>
            <Step title="Work at constant pressure">
              <Eq src='W = p · ΔV = 1 × 10 ^5 · 3 × 10 ^−3 = 300 "J"' />
            </Step>
          </ol>
          <Answer>300 J, done by the gas on the piston.</Answer>
          <ExpandWork p={100000} v1={2} v2={5} title="A gas expands from 2 litres to 5 litres at 100 kilopascals and the area under the line reaches 300 joules" />
        </Example>

        <Example n={2} title="Using the first law">
          <p className="ex-q">A gas absorbs 500 J of heat and does 200 J of work. Find the change in its internal energy.</p>
          <Given items={['Q = 500 "J"', 'W = 200 "J"']} />
          <ol className="steps">
            <Step title="Heat in is positive, work by the gas is positive">
              <Eq src='ΔU = Q − W = 500 − 200 = 300 "J"' />
            </Step>
          </ol>
          <Answer>The internal energy rises by 300 J, so the gas warms up.</Answer>
          <FirstLawScene Q={500} W={200} title="500 joules of heat in, 200 joules of work out, 300 joules left as internal energy" />
        </Example>

        <Example n={3} title="Isothermal expansion">
          <p className="ex-q">One mole of an ideal gas at 300 K expands isothermally until its volume doubles. Find the work done and the heat absorbed.</p>
          <Given items={['n = 1 "mol"', 'T = 300 "K"', 'V _2 = 2 · V _1']} />
          <ol className="steps">
            <Step title="Isothermal work">
              <Eq src='W = n · R · T · ln ( [ V _2 | V _1 ] ) = 1 · 8.31 · 300 · ln 2' />
            </Step>
            <Step title="Numbers">
              <Eq src='W = 2493 · 0.693 = 1730 "J" ≈ 1.73 "kJ"' />
            </Step>
            <Step title="Heat">
              <p>The temperature is fixed, so <M>ΔU = 0</M> and <M>Q = W</M>.</p>
            </Step>
          </ol>
          <Answer>The gas does about 1.73 kJ of work and absorbs 1.73 kJ of heat from the surroundings.</Answer>
          <IsoWorkScene />
        </Example>

        <Example n={4} title="Carnot efficiency">
          <p className="ex-q">A Carnot engine works between 500 K and 300 K and takes 1000 J of heat per cycle. Find its efficiency, the work, and the heat rejected.</p>
          <Given items={['T _h = 500 "K"', 'T _c = 300 "K"', 'Q _h = 1000 "J"']} />
          <ol className="steps">
            <Step title="Efficiency">
              <Eq src='η = 1 − [ T _c | T _h ] = 1 − [ 300 | 500 ] = 0.4' />
            </Step>
            <Step title="Work and rejected heat">
              <Eq src={['W = η · Q _h = 0.4 · 1000 = 400 "J"', 'Q _c = Q _h − W = 600 "J"']} />
            </Step>
          </ol>
          <Answer>40% efficient: 400 J of work, with 600 J rejected to the cold sink.</Answer>
          <FlowScene kind="engine" Qh={1000} Qc={600} W={400} Th="500 K" Tc="300 K" result="η = 400 / 1000 = 40 %" title="A Carnot engine between 500 and 300 kelvin turns 1000 joules of heat into 400 joules of work and rejects 600" />
        </Example>

        <Example n={5} title="A refrigerator">
          <p className="ex-q">A fridge removes 600 J from the food space per cycle using 200 J of electrical work. Find its COP and the heat given to the room. Compare with the ideal COP for 275 K inside and 300 K outside.</p>
          <Given items={['Q _c = 600 "J"', 'W = 200 "J"', 'T _c = 275 "K"', 'T _h = 300 "K"']} />
          <ol className="steps">
            <Step title="COP">
              <Eq src='"COP" = [ Q _c | W ] = [ 600 | 200 ] = 3' />
            </Step>
            <Step title="Heat delivered to the room">
              <Eq src='Q _h = Q _c + W = 600 + 200 = 800 "J"' />
            </Step>
            <Step title="Ideal limit">
              <Eq src='"COP" _ideal = [ T _c | T _h − T _c ] = [ 275 | 25 ] = 11' />
            </Step>
          </ol>
          <Answer>COP 3, with 800 J delivered to the room each cycle. A perfect fridge could reach 11, so this one is well below the limit.</Answer>
          <FlowScene kind="fridge" Qh={800} Qc={600} W={200} Th="300 K" Tc="275 K" result="COP = 600 / 200 = 3" title="A fridge uses 200 joules of work to move 600 joules out of the cold space and deliver 800 to the room" />
        </Example>

        <Example n={6} title="Adiabatic compression">
          <p className="ex-q">In a diesel engine air at 300 K is compressed quickly to one sixteenth of its volume. Treat it as an ideal gas with <M>γ = 1.4</M>. Find the final temperature and the pressure rise.</p>
          <Given items={['T _1 = 300 "K"', 'V _1 / V _2 = 16', 'γ = 1.4']} />
          <ol className="steps">
            <Step title="Use T · V ^γ−1 = constant">
              <Eq src='T _2 = T _1 · ( [ V _1 | V _2 ] ) ^γ−1 = 300 · 16 ^0.4 = 300 · 3.03' />
            </Step>
            <Step title="Temperature">
              <Eq src='T _2 = 909 "K"' />
            </Step>
            <Step title="Pressure from p · V ^γ = constant">
              <Eq src='[ p _2 | p _1 ] = 16 ^1.4 = 48.5' />
            </Step>
          </ol>
          <Answer>About 909 K (636 °C), hot enough to light the diesel fuel, and the pressure rises 48.5 times. No heat was supplied: the work of squeezing did it.</Answer>
          <AdiaCompressScene />
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Getting the sign of work wrong" wrong="ΔU = Q + W ,  W = +p · ΔV" fig={<MiniCyl title="A gas expands with no heat and the dots slow down, so the internal energy falls" from={50} to={85} s0={1.6} s1={0.9} work="out" lines={['Q = 0', 'W > 0 (gas does work)', 'ΔU = −W < 0: it cools']} />}>
            With <M>ΔU = Q − W</M>, work done by the gas is positive and costs the gas energy. An expanding gas with no heat cools down. Pick one convention and keep to it.
          </Mistake>
          <Mistake title="Adiabatic means constant temperature" wrong="adiabatic ,  ΔT = 0" fig={<MiniCyl title="A gas compressed with no heat flow gets hotter, the dots speed up" from={85} to={40} s0={0.9} s1={1.8} work="in" lines={['Q = 0', 'work done on the gas', 'T rises']} />}>
            Adiabatic means no heat flows, <M>Q = 0</M>. The temperature changes through the work. Constant temperature is isothermal.
          </Mistake>
          <Mistake title="Isothermal means no heat flow" wrong="isothermal ,  Q = 0" fig={<MiniCyl title="An isothermal expansion where heat flows in and the dots keep the same speed" from={50} to={85} s0={1.2} s1={1.2} heat="in" work="out" lines={['T constant, ΔU = 0', 'Q = W', 'heat flows in all along']} />}>
            At constant temperature the internal energy does not change, so <M>Q = W</M>. Heat must flow in to pay for the work.
          </Mistake>
          <Mistake title="Heat and work belong to a state" wrong="Q _A − Q _B = ΔQ ,  W = W _B − W _A" fig={<TwoPathsScene />}>
            Two paths between the same states have different Q and W. Only <M>ΔU</M> is the same, because U is a state variable.
          </Mistake>
          <Mistake title="Zero change means zero work over a cycle" wrong="ΔU = 0 ,  W = 0" fig={<CycleScene compact title="A loop on the p-V diagram: the internal energy returns to its start but the enclosed area is work" />}>
            After a cycle <M>ΔU = 0</M>, so <M>Q = W</M>, not zero. The net work is the area inside the loop, which is why engines work at all.
          </Mistake>
          <Mistake title="Celsius in the efficiency formula" wrong="η = 1 − [ 27 | 227 ] = 88 %" fig={<CelsiusBars />}>
            Ratios of temperatures only work on the absolute scale. Convert: 27 °C is 300 K and 227 °C is 500 K, giving <M>η = 40 %</M>.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Energy is conserved, but it only runs downhill: some heat is always lost.</p>
        <p className="closing-sub">Next: how that heat moves, by conduction, convection and radiation, and how it is measured.</p>
      </footer>
    </ChapterShell>
  );
}
