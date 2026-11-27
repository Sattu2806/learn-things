import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Fig } from '../kit/Anim';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Brownian, BrownianSpread, Condense, CpCv, CvStaircase, Diatomic, Diffusion, EnergyBars, ForceSpikes, GasBox, HeatBars, HotCold, MeanFreePath, Mole, OneMolecule, SpeedHist, SpeedScale, SweepCurve, Track, ZCurve, ease, lerp, phase } from './anims';

/** Kinetic theory of gases: from molecules bouncing in a box to pressure, temperature and heat capacity. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'A gas is a crowd of molecules', group: 'Theory' },
  { id: 'laws', title: 'The gas laws', group: 'Theory' },
  { id: 'ideal', title: 'The ideal gas equation', group: 'Theory' },
  { id: 'pressure', title: 'Pressure from collisions', group: 'Theory' },
  { id: 'temperature', title: 'Temperature is kinetic energy', group: 'Theory' },
  { id: 'speeds', title: 'Rms, mean and most probable speed', group: 'Theory' },
  { id: 'dof', title: 'Degrees of freedom and equipartition', group: 'Theory' },
  { id: 'heat', title: 'Heat capacities and gamma', group: 'Theory' },
  { id: 'mfp', title: 'Mean free path', group: 'Theory' },
  { id: 'brownian', title: 'Brownian motion and diffusion', group: 'Theory' },
  { id: 'real', title: 'Real gases', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];
const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="kinetic" sections={SECTIONS} sideTitle="Kinetic theory of gases" sideLead="Pressure, temperature and heat capacity explained by countless tiny molecules bouncing around.">
      <header className="article-head">
        <span className="kicker">Physics · Heat and gases</span>
        <h1 className="article-title">What is pressure, really, and what is temperature?</h1>
        <p className="article-lead">Pressure and temperature seem like smooth, steady things. Kinetic theory shows they are the average of an unseen storm of molecules, and it builds the gas laws from nothing but Newton's laws and counting.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="A gas is a crowd of molecules" />
        <p>
          Air in a room is made of molecules, mostly nitrogen and oxygen, moving in straight lines at hundreds of metres per second, colliding with each other and with the walls. A gas is mostly empty space: at normal pressure the molecules are about ten diameters apart.
        </p>
        <Fig caption="A few of the molecules in a box. Each flash on the piston is a molecule hitting it. The readouts are the average effect of all of them.">
          <GasBox title="Molecules bounce around a box and strike a piston; the readouts stay steady" />
        </Fig>
        <p>Kinetic theory makes a simple model, the <strong>ideal gas</strong>, with these assumptions:</p>
        <ul className="t-list">
          <li>A gas has a huge number of identical molecules, which are tiny compared with the gaps between them.</li>
          <li>They move randomly, in straight lines, obeying Newton's laws. No direction is special.</li>
          <li>Collisions with the walls and with each other are perfectly elastic: no kinetic energy is lost.</li>
          <li>Apart from the instant of a collision there are no forces between molecules, and gravity is ignored.</li>
          <li>Collisions are short compared with the time between them.</li>
        </ul>
        <Note label="Why bother">With these few rules we can derive the gas laws, give pressure and temperature a meaning, and even predict how much heat a gas takes in.</Note>
      </section>

      <section className="t-section" id="t-laws">
        <SectionHead n={no('laws')} title="The gas laws" />
        <p>Long before anyone believed in molecules, experiments on a fixed amount of gas found four patterns. Each one is easy to see in the picture of colliding molecules.</p>
        <p>
          <strong>Boyle's law.</strong> At constant temperature, squeezing a gas into a smaller volume raises its pressure: <M>p · V = "constant"</M>. The same molecules hit the walls over a smaller area, and more often.
        </p>
        <Fig caption="Boyle: temperature fixed, volume halves, pressure doubles. The dot rides down the hyperbola p V = constant.">
          <GasBox
            title="Squeezing the box halves the volume and doubles the pressure"
            loop={7}
            L={(t) => lerp(240, 120, ease(phase(t, 1, 4)))}
            plot={{ xl: 'V', yl: 'p', x: (s) => s.V, y: (s) => s.p, xr: [8, 28], yr: [0.5, 2.5] }}
          />
        </Fig>
        <p>
          <strong>Charles's law.</strong> At constant pressure the volume is proportional to the absolute temperature: <M>V / T = "constant"</M>. Faster molecules push the piston out until the wall is hit no more often than before.
        </p>
        <Fig caption="Charles: pressure fixed, the piston is pushed out as the gas warms. V against T is a straight line through the origin.">
          <GasBox
            title="Heating a gas under a free piston makes it expand"
            loop={7}
            T={(t) => lerp(200, 400, ease(phase(t, 1, 5)))}
            L={(t) => 0.8 * lerp(200, 400, ease(phase(t, 1, 5)))}
            plot={{ xl: 'T', yl: 'V', x: (s) => s.T, y: (s) => s.V, xr: [150, 420], yr: [10, 36] }}
          />
        </Fig>
        <p>
          <strong>Gay-Lussac's law.</strong> At constant volume the pressure is proportional to the absolute temperature: <M>p / T = "constant"</M>. Hotter molecules hit harder and more often.
        </p>
        <Fig caption="Gay-Lussac: volume fixed, the gas is heated and the pressure climbs in step with T.">
          <GasBox
            title="Heating a gas in a rigid box raises its pressure in proportion to the temperature"
            loop={7}
            T={(t) => lerp(300, 600, ease(phase(t, 1, 5)))}
            plot={{ xl: 'T', yl: 'p', x: (s) => s.T, y: (s) => s.p, xr: [250, 650], yr: [0.5, 2.4] }}
          />
        </Fig>
        <p>
          <strong>Avogadro's law.</strong> At the same pressure and temperature, equal volumes of any gas hold equal numbers of molecules: <M>V / n = "constant"</M>.
        </p>
        <Fig caption="Avogadro: add molecules and, to keep the pressure the same, the volume grows in proportion.">
          <GasBox
            title="Adding molecules at constant pressure and temperature makes the gas take more room"
            loop={7}
            n0={14}
            n={(t) => 14 + Math.floor(14 * ease(phase(t, 1, 5)))}
            L={(t) => (170 * (14 + Math.floor(14 * ease(phase(t, 1, 5))))) / 14}
            plot={{ xl: 'n', yl: 'V', x: (s) => s.nMol, y: (s) => s.V, xr: [0.8, 2.2], yr: [10, 40] }}
          />
        </Fig>
        <p>
          One mole is <M>N _A = 6.02 × 10 ^23</M> molecules. At 0 °C and 1 atm (STP) one mole of any ideal gas takes up 22.4 litres.
        </p>
      </section>

      <section className="t-section" id="t-ideal">
        <SectionHead n={no('ideal')} title="The ideal gas equation" />
        <p>The four laws combine into one equation for <M>n</M> moles of gas:</p>
        <Eq src='p · V = n · R · T'>
          <span className="eq-note">T must be the absolute temperature in kelvin</span>
        </Eq>
        <p>
          Here <M>R = 8.31 "J/(mol·K)"</M> is the universal gas constant. Counting molecules instead of moles, with <M>N = n · N _A</M> molecules, gives the same law in a second form:
        </p>
        <Eq src={['p · V = N · k · T', 'k = [ R | N _A ] = 1.38 × 10 ^−23 "J/K"']}>
          <span>
            <M>k</M> is Boltzmann's constant: the gas constant for a single molecule.
          </span>
        </Eq>
        <Fig caption="Heat the gas, then squeeze it: p, V and T all change, but p V / (n T) stays at 0.0821 L·atm/(mol·K), which is R.">
          <GasBox
            title="A gas is heated and then compressed; the ratio p V over n T stays constant"
            loop={9}
            T={(t) => lerp(300, 450, ease(phase(t, 0.5, 3)))}
            L={(t) => lerp(240, 160, ease(phase(t, 4.5, 7)))}
            info={(s) => [`T = ${s.T.toFixed(0)} K`, `V = ${s.V.toFixed(1)} L`, `p = ${s.p.toFixed(2)} atm`, `pV/nT = ${((s.p * s.V) / s.nMol / s.T).toFixed(4)}`]}
          />
        </Fig>
        <Note label="Remember">An ideal gas is a model. It works well for real gases at low pressure and well above the temperature where they would liquefy, which includes air at room conditions.</Note>
      </section>

      <section className="t-section" id="t-pressure">
        <SectionHead n={no('pressure')} title="Pressure from collisions" />
        <p>Take one molecule of mass <M>m</M> in a cubical box of side <M>L</M>, moving with velocity component <M>v _x</M> toward a wall. It bounces back elastically, so its momentum goes from <M>+m · v _x</M> to <M>−m · v _x</M>.</p>
        <Fig caption="Each hit hands the wall a momentum 2 m vx. Between hits on the same wall the molecule travels a distance 2L.">
          <OneMolecule />
        </Fig>
        <p>The wall receives the change of momentum, and the molecule returns to the same wall every <M>Δt = 2 · L / v _x</M>. The average force from this one molecule is momentum per time:</p>
        <Eq src={['Δp = 2 · m · v _x', 'F = [ Δp | Δt ] = [ 2 · m · v _x | 2 · L / v _x ] = [ m · v _x ^2 | L ]']} />
        <p>Now take <M>N</M> molecules. Add their forces and divide by the wall area <M>L ^2</M>. Because no direction is special, <M>v _x ^2</M>, <M>v _y ^2</M> and <M>v _z ^2</M> have the same average, and together they make <M>v ^2</M>. So the average of <M>v _x ^2</M> is one third of the mean-square speed, written <M>v _rms ^2</M>:</p>
        <Eq src={['p = [ N · m · v _x ^2 | L ^3 ] = [ 1 | 3 ] · [ N · m · v _rms ^2 | V ]', 'p = [ 1 | 3 ] · ρ · v _rms ^2']}>
          <span>
            where <M>ρ = N · m / V</M> is the density. <M>v _rms</M> is the root-mean-square speed.
          </span>
        </Eq>
        <Fig caption="One molecule gives spikes of force. With very many molecules the spikes overlap into a steady push: that is pressure.">
          <ForceSpikes />
        </Fig>
        <p>The shape of the box does not matter and the molecules do not even need to be alone: collisions between them only swap the velocities around, so the result holds in general.</p>
      </section>

      <section className="t-section" id="t-temperature">
        <SectionHead n={no('temperature')} title="Temperature is kinetic energy" />
        <p>
          Put the pressure result next to the ideal gas law. Using <M>ρ = N · m / V</M>, we have <M>p · V = [ 1 | 3 ] · N · m · v _rms ^2</M>, and also <M>p · V = N · k · T</M>. Equating them:
        </p>
        <Eq src={['[ 1 | 3 ] · m · v _rms ^2 = k · T', '[ 1 | 2 ] · m · v _rms ^2 = [ 3 | 2 ] · k · T']}>
          <span>The average translational kinetic energy of one molecule depends on the temperature only.</span>
        </Eq>
        <p>This is the true meaning of temperature: it measures the average kinetic energy of the random motion. It does not depend on what the gas is. Heavy and light molecules at the same temperature have the same average energy, but the light ones move faster.</p>
        <Fig caption="Same gas at 150 K and 600 K. Four times the temperature means four times the average kinetic energy, and twice the speed.">
          <HotCold />
        </Fig>
        <p>The total kinetic energy of the molecules of <M>n</M> moles is <M>[ 3 | 2 ] · n · R · T</M>. At absolute zero the random motion would stop; that is why the kelvin scale starts there.</p>
      </section>

      <section className="t-section" id="t-speeds">
        <SectionHead n={no('speeds')} title="Rms, mean and most probable speed" />
        <p>Molecules in a gas do not all move at the same speed. Collisions keep shuffling the speeds into the <strong>Maxwell distribution</strong>: a hump with a long tail toward high speeds. Three speeds describe it: the most probable speed <M>v _p</M> (the peak), the mean speed, and the root-mean-square speed.</p>
        <Eq src={['v _p = √[ [ 2 · k · T | m ] ]', 'v _mean = √[ [ 8 · k · T | π · m ] ]', 'v _rms = √[ [ 3 · k · T | m ] ] = √[ [ 3 · R · T | M ] ]']}>
          <span>
            Here <M>M</M> is the molar mass in kg/mol. In ratio, <M>v _p : v _mean : v _rms = 1 : 1.13 : 1.22</M>.
          </span>
        </Eq>
        <Fig caption="520 molecules (nitrogen) sorted by speed. The curve is Maxwell's formula. At 900 K the same distribution shifts right and flattens, because the area, the number of molecules, stays the same.">
          <SpeedHist />
        </Fig>
        <p>
          All three grow as <M>√T</M> and fall as <M>1 / √M</M>. That is why hydrogen escapes from the atmosphere much more easily than nitrogen. The rms speed is the one tied to energy, so it is the one that appears in <M>p = [ 1 | 3 ] · ρ · v _rms ^2</M>.
        </p>
      </section>

      <section className="t-section" id="t-dof">
        <SectionHead n={no('dof')} title="Degrees of freedom and equipartition" />
        <p>
          A <strong>degree of freedom</strong> is an independent way a molecule can store energy. A single atom (helium, argon) can only move: three directions, <M>f = 3</M>. A diatomic molecule such as nitrogen can also tumble about two axes, so <M>f = 5</M> at room temperature. Vibration of the bond adds two more, but only at high temperature.
        </p>
        <Fig caption="A diatomic molecule: moving, turning, and (only when hot) vibrating.">
          <Diatomic />
        </Fig>
        <p>The <strong>law of equipartition</strong> says that in thermal equilibrium every degree of freedom holds, on average, the same energy:</p>
        <Eq src={['[ 1 | 2 ] · k · T "per molecule per degree of freedom"', 'U = [ f | 2 ] · n · R · T']} />
        <Fig caption="Each bar wobbles as molecules collide and trade energy, but its average is one half of k T. The monatomic gas has 3 bars.">
          <EnergyBars f={3} />
        </Fig>
        <Fig caption="A diatomic gas has 5 bars. Total energy per molecule: 5/2 k T.">
          <EnergyBars f={5} />
        </Fig>
        <p>
          Quantum theory explains why vibration is missing at room temperature: each way of moving only switches on once there is enough thermal energy to excite it. So the heat capacity of hydrogen climbs in steps as the temperature rises:
        </p>
        <Fig caption="Heat capacity of hydrogen (schematic): rotation turns on above about 100 K and vibration above about 2000 K.">
          <CvStaircase />
        </Fig>
      </section>

      <section className="t-section" id="t-heat">
        <SectionHead n={no('heat')} title="Heat capacities and gamma" />
        <p>
          Heat a gas at constant volume and nothing is lost in pushing anything: all of <M>Q</M> goes into internal energy, <M>Q = ΔU = n · C _v · ΔT</M>. From <M>U = [ f | 2 ] · n · R · T</M> the molar heat capacity is
        </p>
        <Eq src='C _v = [ f | 2 ] · R' />
        <p>At constant pressure the gas also expands and does work <M>p · ΔV = n · R · ΔT</M>, so it needs more heat. This gives Mayer's relation and the ratio <M>γ</M>:</p>
        <Eq src={['C _p = C _v + R = [ f + 2 | 2 ] · R', 'γ = [ C _p | C _v ] = 1 + [ 2 | f ]']} />
        <Fig caption="Same 100 K rise for 1 mol of a diatomic gas. At constant pressure the heat must also pay for the work of lifting the piston.">
          <CpCv />
        </Fig>
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Gas</th>
                <th scope="col">
                  <M>f</M>
                </th>
                <th scope="col">
                  <M>C _v</M>
                </th>
                <th scope="col">
                  <M>C _p</M>
                </th>
                <th scope="col">
                  <M>γ</M>
                </th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['Monatomic (He, Ar)', '3', '3/2 R', '5/2 R', '1.67'],
                  ['Diatomic (N₂, O₂, H₂)', '5', '5/2 R', '7/2 R', '1.40'],
                  ['Polyatomic, nonlinear (CH₄)', '6', '3 R', '4 R', '1.33'],
                ] as const
              ).map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={i}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-mfp">
        <SectionHead n={no('mfp')} title="Mean free path" />
        <p>
          Molecules move fast, yet a smell takes seconds to cross a room. They collide so often that each one only gets a short distance before it is knocked off course. The average distance between collisions is the <strong>mean free path</strong>:
        </p>
        <Eq src='λ = [ 1 | √2 · π · d ^2 · n _v ] = [ k · T | √2 · π · d ^2 · p ]'>
          <span>
            where <M>d</M> is the molecular diameter and <M>n _v = N / V</M> is the number of molecules per unit volume.
          </span>
        </Eq>
        <Fig caption="One molecule (the others are shown frozen, to see the idea). It travels straight until it hits something. The average length of these straight pieces is λ.">
          <MeanFreePath />
        </Fig>
        <p>
          For nitrogen at 300 K and 1 atm, with <M>d ≈ 3.7 × 10 ^−10 "m"</M>, we get <M>λ ≈ 6.7 × 10 ^−8 "m"</M>: about 180 molecular diameters. Each molecule suffers around <M>7 × 10 ^9</M> collisions every second. Lower the pressure and λ grows in proportion; in a good vacuum it exceeds the size of the vessel.
        </p>
      </section>

      <section className="t-section" id="t-brownian">
        <SectionHead n={no('brownian')} title="Brownian motion and diffusion" />
        <p>
          In 1827 Robert Brown saw tiny pollen grains in water dance in a ceaseless random jiggle. The cause is invisible molecules striking the grain from all sides. At any instant more hits come from one side than the other, so the grain is pushed in a random direction. It was the first clear evidence that molecules exist and move.
        </p>
        <Fig caption="The grain is huge compared with a molecule, yet the unevenness of the hits is enough to move it. Its path is a random zigzag.">
          <Brownian />
        </Fig>
        <p>A random walk does not go far quickly. After <M>n</M> equal random steps the typical distance is only about <M>√n</M> steps, so the mean square distance grows in proportion to time:</p>
        <Eq src='x ^2 _avg = 2 · D · t'>
          <span>
            <M>D</M> is the diffusion coefficient. Drop ink in water and it spreads this slow way.
          </span>
        </Eq>
        <Fig caption="Fourteen random walkers start at the same point. The dashed circle has the average distance; the graph shows its square rising along a straight line.">
          <BrownianSpread />
        </Fig>
        <p><strong>Diffusion</strong> is this random motion on a large scale: molecules spread from where they are crowded to where they are few, with no push needed. Two gases in one box mix by themselves, and they never unmix by themselves.</p>
        <Fig caption="Remove the partition and the two gases intermingle until each is spread evenly. Gas A ends up half in each half.">
          <Diffusion />
        </Fig>
      </section>

      <section className="t-section" id="t-real">
        <SectionHead n={no('real')} title="Real gases" />
        <p>
          Real molecules have a size and attract each other a little. At low pressure these effects are tiny and the ideal law works. At high pressure or low temperature they matter: the molecules take up room, so the gas is harder to squeeze than predicted, and the pull between them lowers the pressure on the wall. Van der Waals corrected the law for both:
        </p>
        <Eq src='( p + [ a · n ^2 | V ^2 ] ) · ( V − n · b ) = n · R · T'>
          <span>
            <M>b</M> allows for the volume of the molecules and <M>a</M> for their attraction.
          </span>
        </Eq>
        <Fig caption="Cool a real gas and it condenses. An ideal gas, with no attraction, would stay a gas right down to absolute zero.">
          <Condense />
        </Fig>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Boyle (T constant)', 'p · V = "constant"'],
                  ['Charles (p constant)', 'V / T = "constant"'],
                  ['Gay-Lussac (V constant)', 'p / T = "constant"'],
                  ['Ideal gas, moles', 'p · V = n · R · T'],
                  ['Ideal gas, molecules', 'p · V = N · k · T'],
                  ['Gas constants', 'R = N _A · k'],
                  ['Pressure and speed', 'p = [ 1 | 3 ] · ρ · v _rms ^2'],
                  ['Kinetic energy and T', '[ 1 | 2 ] · m · v _rms ^2 = [ 3 | 2 ] · k · T'],
                  ['Rms speed', 'v _rms = √[ [ 3 · R · T | M ] ]'],
                  ['Mean speed', 'v _mean = √[ [ 8 · R · T | π · M ] ]'],
                  ['Most probable speed', 'v _p = √[ [ 2 · R · T | M ] ]'],
                  ['Internal energy', 'U = [ f | 2 ] · n · R · T'],
                  ['Heat capacities', 'C _v = [ f | 2 ] · R ,  C _p = C _v + R'],
                  ['Ratio of heat capacities', 'γ = 1 + [ 2 | f ]'],
                  ['Mean free path', 'λ = [ k · T | √2 · π · d ^2 · p ]'],
                  ['Diffusion', 'x ^2 _avg = 2 · D · t'],
                  ['Van der Waals', '( p + [ a · n ^2 | V ^2 ] ) · ( V − n · b ) = n · R · T'],
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
        <h3 className="t-h3">Constants</h3>
        <div className="t-table-wrap">
          <table className="t-table t-symbols">
            <thead>
              <tr>
                <th scope="col">Symbol</th>
                <th scope="col">Meaning</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['R', 'Universal gas constant', '8.31 "J/(mol·K)"'],
                  ['k', 'Boltzmann constant', '1.38 × 10 ^−23 "J/K"'],
                  ['N _A', 'Avogadro constant', '6.02 × 10 ^23 "mol⁻¹"'],
                  ['V _m', 'Molar volume at STP (273 K, 1 atm)', '22.4 "L"'],
                ] as const
              ).map(([sym, meaning, val]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>
                    <M>{val}</M>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Volume of one mole at STP">
          <p className="ex-q">Find the volume of 1 mol of an ideal gas at 0 °C and 1 atm (101 325 Pa).</p>
          <Given items={['n = 1 "mol"', 'T = 273.15 "K"', 'p = 101 325 "Pa"']} />
          <ol className="steps">
            <Step title="Rearrange the ideal gas law">
              <Eq src='V = [ n · R · T | p ]' />
            </Step>
            <Step title="Put in the numbers (kelvin!)">
              <Eq src='V = [ 1 · 8.314 · 273.15 | 101 325 ] = 0.0224 "m³"' />
            </Step>
          </ol>
          <Answer>0.0224 m³, which is 22.4 litres, the famous molar volume at STP.</Answer>
          <Fig>
            <GasBox
              title="One mole of gas at 273 kelvin and one atmosphere fills 22.4 litres"
              T={() => 273}
              info={() => ['n = 1.00 mol', 'T = 273 K', 'p = 1.00 atm', 'V = 22.4 L']}
            />
          </Fig>
        </Example>

        <Example n={2} title="Rms speed of nitrogen">
          <p className="ex-q">Find the rms speed of nitrogen molecules at 300 K. The molar mass of N₂ is 28 g/mol.</p>
          <Given items={['M = 0.028 "kg/mol"', 'T = 300 "K"']} />
          <ol className="steps">
            <Step title="Use the rms formula">
              <Eq src='v _rms = √[ [ 3 · R · T | M ] ] = √[ [ 3 · 8.314 · 300 | 0.028 ] ]' />
            </Step>
            <Step title="Work it out">
              <Eq src='v _rms = √[ 2.67 × 10 ^5 ] = 517 "m/s"' />
            </Step>
          </ol>
          <Answer>About 517 m/s, faster than sound in air (about 347 m/s). The mean speed is 476 m/s and the most probable 422 m/s.</Answer>
          <Fig>
            <Track />
          </Fig>
        </Example>

        <Example n={3} title="When does the rms speed double?">
          <p className="ex-q">A gas is at 300 K. At what temperature is its rms speed twice as large?</p>
          <Given items={['T _1 = 300 "K"', 'v _2 = 2 · v _1']} />
          <ol className="steps">
            <Step title="Rms speed goes as the square root of T">
              <Eq src='[ v _2 | v _1 ] = √[ [ T _2 | T _1 ] ] = 2' />
            </Step>
            <Step title="Square both sides">
              <Eq src='T _2 = 4 · T _1 = 4 · 300 = 1200 "K"' />
            </Step>
          </ol>
          <Answer>1200 K (927 °C). Doubling a speed needs four times the absolute temperature, because kinetic energy goes as v².</Answer>
          <Fig>
            <SpeedScale ratio={4} />
          </Fig>
        </Example>

        <Example n={4} title="Compressing a gas to half the volume">
          <p className="ex-q">A gas at 1.0 atm is compressed slowly to half its volume, with the temperature kept constant. What is the new pressure? What happens to the rms speed?</p>
          <Given items={['p _1 = 1.0 "atm"', 'V _2 = [ V _1 | 2 ]', 'T constant']} />
          <ol className="steps">
            <Step title="Boyle's law">
              <Eq src='p _1 · V _1 = p _2 · V _2' />
            </Step>
            <Step title="Solve for the new pressure">
              <Eq src='p _2 = p _1 · [ V _1 | V _2 ] = 1.0 · 2 = 2.0 "atm"' />
            </Step>
            <Step title="The speed">
              <p>The temperature has not changed, so the average kinetic energy and the rms speed have not changed either. The pressure rises only because the molecules strike the walls more often.</p>
            </Step>
          </ol>
          <Answer>2.0 atm, with the same molecular speeds.</Answer>
          <Fig>
            <GasBox title="A gas at one atmosphere is squeezed to half the volume at constant temperature and its pressure doubles" loop={7} L={(t) => lerp(240, 120, ease(phase(t, 1, 4)))} />
          </Fig>
        </Example>

        <Example n={5} title="Average kinetic energy at 27 °C">
          <p className="ex-q">Find the average translational kinetic energy of a gas molecule at 27 °C.</p>
          <Given items={['T = 27 + 273 = 300 "K"', 'k = 1.38 × 10 ^−23 "J/K"']} />
          <ol className="steps">
            <Step title="Use the kinetic energy result">
              <Eq src='E = [ 3 | 2 ] · k · T = [ 3 | 2 ] · 1.38 × 10 ^−23 · 300' />
            </Step>
            <Step title="Multiply">
              <Eq src='E = 6.21 × 10 ^−21 "J"' />
            </Step>
          </ol>
          <Answer>6.21 × 10⁻²¹ J, about 0.039 eV. It is the same for every kind of gas at this temperature.</Answer>
          <Fig>
            <GasBox title="At 300 kelvin each molecule has on average 6.21 times ten to the minus 21 joules of kinetic energy" info={() => ['T = 300 K (27 °C)', 'average KE of a', 'molecule:', '6.21e-21 J']} />
          </Fig>
        </Example>

        <Example n={6} title="Gamma for a diatomic gas">
          <p className="ex-q">Find <M>C _v</M>, <M>C _p</M> and <M>γ</M> for nitrogen at room temperature.</p>
          <Given items={['f = 5']} />
          <ol className="steps">
            <Step title="Constant volume">
              <Eq src='C _v = [ f | 2 ] · R = [ 5 | 2 ] · R = 20.8 "J/(mol·K)"' />
            </Step>
            <Step title="Constant pressure">
              <Eq src='C _p = C _v + R = [ 7 | 2 ] · R = 29.1 "J/(mol·K)"' />
            </Step>
            <Step title="Their ratio">
              <Eq src='γ = [ C _p | C _v ] = [ 7 | 5 ] = 1.40' />
            </Step>
          </ol>
          <Answer>
            <M>C _v = 20.8</M>, <M>C _p = 29.1 "J/(mol·K)"</M> and <M>γ = 1.40</M>.
          </Answer>
          <Fig>
            <Diatomic vib={false} gamma />
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake
            title="Using degrees Celsius"
            wrong="T = 27"
            fig={
              <GasBox
                title="As a gas cools toward absolute zero the molecules slow down and stop, at minus 273 degrees Celsius"
                loop={6}
                height={200}
                top={44}
                H={120}
                T={(t) => 300 * (1 - ease(phase(t, 0.5, 4.5)))}
                info={(s) => [`T = ${s.T.toFixed(0)} K`, `  = ${(s.T - 273.15).toFixed(0)} °C`]}
              />
            }
          >
            Gas laws need the absolute temperature: <M>T = 300 "K"</M>, not 27. Zero kelvin is where the random motion stops, not zero Celsius.
          </Mistake>
          <Mistake title="Every molecule moves at v rms" wrong="v = v _rms" fig={<SweepCurve />}>
            The rms speed is an average. Some molecules are nearly still and some are much faster, as the Maxwell curve shows.
          </Mistake>
          <Mistake title="Double the temperature, double the speed" wrong="T → 2 · T , v → 2 · v" fig={<SpeedScale ratio={2} ghost />}>
            The rms speed goes as <M>√T</M>. Doubling <M>T</M> multiplies the speed by only <M>√2 = 1.41</M>. It is the energy that doubles.
          </Mistake>
          <Mistake title="Mixing up n and N, R and k" wrong="p · V = n · k · T" fig={<Mole />}>
            With moles use <M>R</M>: <M>p · V = n · R · T</M>. With molecules use <M>k</M>: <M>p · V = N · k · T</M>. They are linked by <M>R = N _A · k</M>.
          </Mistake>
          <Mistake title="Cp equals Cv" wrong="C _p = C _v" fig={<HeatBars />}>
            At constant pressure the gas expands and does work, so it needs extra heat: <M>C _p = C _v + R</M>. That is why <M>γ</M> is bigger than 1.
          </Mistake>
          <Mistake title="Real gases always obey pV = nRT" wrong="p · V = n · R · T ,  all p" fig={<ZCurve />}>
            The ideal law is an approximation for low pressure and high temperature. At high pressure molecular size and attraction make <M>p · V / ( n · R · T )</M> differ from 1.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Pressure is molecules hitting the wall; temperature is how hard they are moving.</p>
        <p className="closing-sub">Next: when a gas is heated, compressed or expanded, how do heat, work and internal energy balance? That is thermodynamics.</p>
      </footer>
    </ChapterShell>
  );
}
