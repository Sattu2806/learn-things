import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { CellInternal, CellsCombo, ChargeFlow, Circuit, Drift, DriftTube, Junction, LoopRule, MeterBridge, OhmGraph, Potentiometer, PowerHeat, ResistorShape, Signal, TempResistance, Wheatstone } from './CurrentAnims';

/** Current electricity: drift, Ohm's law, resistivity, cells, Kirchhoff's rules and the bridge instruments. */

const SECTIONS: NoteSection[] = [
  { id: 'current', title: 'Electric current', group: 'Theory' },
  { id: 'drift', title: 'Drift velocity', group: 'Theory' },
  { id: 'ohm', title: "Ohm's law", group: 'Theory' },
  { id: 'resistivity', title: 'Resistivity and temperature', group: 'Theory' },
  { id: 'combos', title: 'Resistors in series and parallel', group: 'Theory' },
  { id: 'power', title: 'Energy and power', group: 'Theory' },
  { id: 'cells', title: 'Cells, EMF and internal resistance', group: 'Theory' },
  { id: 'kirchhoff', title: "Kirchhoff's rules", group: 'Theory' },
  { id: 'wheatstone', title: 'The Wheatstone bridge', group: 'Theory' },
  { id: 'meter', title: 'The meter bridge', group: 'Theory' },
  { id: 'potentiometer', title: 'The potentiometer', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="current" film={buildFilm} sections={SECTIONS} sideTitle="Current electricity" sideLead="Charges on the move: what current really is, why wires resist, and the rules and instruments that let us work out any circuit.">
      <header className="article-head">
        <span className="kicker">Physics · Current electricity</span>
        <h1 className="article-title">What is really moving when a current flows?</h1>
        <p className="article-lead">Put an electric field across a metal wire and its free electrons begin to drift, slowly, yet the lamp lights at once. This chapter starts from the motion of the electrons, builds Ohm's law and resistance from it, and ends with the rules and instruments used to analyse real circuits.</p>
      </header>

      <section className="t-section" id="t-current">
        <SectionHead n={no('current')} title="Electric current" />
        <p>
          Electric current is the flow of electric charge. If a charge <M>Δ Q</M> crosses a section of a conductor in a time <M>Δ t</M>, the average current is <M>Δ Q / Δ t</M>. When the current is steady, or if we take a very short time, we write
        </p>
        <Eq src='I = [ d Q | d t ]' />
        <p>
          The unit is the <strong>ampere</strong>: <M>1 "A" = 1 "C/s"</M>. Current is a scalar, although we give it a direction. By long-standing convention the <strong>conventional current</strong> points the way positive charge would move, from the positive terminal round to the negative. In a metal the charge carriers are electrons, which move the <em>opposite</em> way. Both descriptions give the same effects, so the convention is kept.
        </p>
        <figure className="t-figure">
          <ChargeFlow />
          <figcaption>The electrons go left, the current arrow points right. Count the charge that crosses the marked section each second and you have the current.</figcaption>
        </figure>
        <p>
          A current needs a closed path and something to push the charges round it, a source such as a cell. A bird sitting on a bare high-voltage wire feels nothing, because there is no complete circuit through its body: its two feet are at the same potential.
        </p>
      </section>

      <section className="t-section" id="t-drift">
        <SectionHead n={no('drift')} title="Drift velocity" />
        <p>
          A metal is a lattice of fixed positive ions with a gas of free electrons moving among them. Without a field the electrons move at random, at speeds of about <M>10 ^6 "m/s"</M>, colliding with the ions all the time. Their motions cancel out and there is no net flow.
        </p>
        <p>
          Switch on an electric field <M>E</M>. Each electron now feels a force <M>e · E</M> opposite to the field, and accelerates at <M>a = e · E / m</M> between collisions. Every collision wipes out the gain, so the electron never speeds up for long. If the average time between collisions is <M>τ</M> (the <strong>relaxation time</strong>), the extra speed it gets is the <strong>drift velocity</strong>:
        </p>
        <Eq src='v _d = a · τ = [ e · E · τ | m ]' />
        <figure className="t-figure">
          <Drift />
          <figcaption>The electron zigzags wildly at about a million metres per second. Once the field is on, a very slow drift is added: a creep of a fraction of a millimetre per second.</figcaption>
        </figure>
        <h3 className="t-h3">The current in terms of the drift velocity</h3>
        <p>
          Take a wire of cross-section <M>A</M> with <M>n</M> free electrons per cubic metre. In a time <M>Δ t</M>, every electron within a distance <M>v _d · Δ t</M> of a chosen section will cross it. They fill a volume <M>A · v _d · Δ t</M>, so the charge that passes is
        </p>
        <Eq src={['Δ Q = n · A · v _d · Δ t · e', 'I = [ Δ Q | Δ t ] = n · e · A · v _d']} />
        <figure className="t-figure">
          <DriftTube />
          <figcaption>Every electron in the shaded slab will cross the plane in the time <M>Δ t</M>. The slab grows with <M>Δ t</M>, so the charge carried across does too.</figcaption>
        </figure>
        <p>
          The <strong>current density</strong> <M>J = I / A</M> (current per unit area) is then <M>J = n · e · v _d</M>. We also define the <strong>mobility</strong> <M>μ = v _d / E</M>, the drift speed per unit field.
        </p>
        <Note label="Slow but instant">The drift speed in a copper wire carrying a few amperes is only about a tenth of a millimetre per second. Yet the lamp lights as soon as you press the switch. The field travels down the wire at nearly the speed of light and sets <em>all</em> the electrons moving together, like a pipe already full of water.</Note>
        <figure className="t-figure">
          <Signal />
          <figcaption>The field front reaches the lamp almost at once. The electrons are nearly where they were.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-ohm">
        <SectionHead n={no('ohm')} title="Ohm's law" />
        <p>
          For many materials, particularly metals at constant temperature, the current through a conductor is proportional to the voltage across it. This is <strong>Ohm's law</strong>:
        </p>
        <Eq src='V = I · R' />
        <p>
          The constant <M>R</M> is the <strong>resistance</strong>, in <strong>ohms</strong>: <M>1 "Ω" = 1 "V/A"</M>. A good conductor has a small <M>R</M>. A graph of <M>I</M> against <M>V</M> for such a conductor is a straight line.
        </p>
        <h3 className="t-h3">Ohm's law from the electron picture</h3>
        <p>
          Put the drift velocity into the current density:
        </p>
        <Eq src={['J = n · e · v _d = n · e · [ e · E · τ | m ]', 'J = [ n · e ^2 · τ | m ] · E = σ · E']} />
        <p>
          The factor <M>σ = n · e ^2 · τ / m</M> is the <strong>conductivity</strong> of the material, and its reciprocal <M>ρ = 1 / σ = m / ( n · e ^2 · τ )</M> is the <strong>resistivity</strong>. Now take a wire of length <M>L</M> and cross-section <M>A</M> with a voltage <M>V</M> across it. The field is <M>E = V / L</M> and <M>J = I / A</M>, so <M>E = ρ · J</M> becomes
        </p>
        <Eq src={['[ V | L ] = ρ · [ I | A ]', 'V = I · [ ρ · L | A ]']} />
        <p>
          This is Ohm's law, with the resistance of the wire given by its shape and its material:
        </p>
        <Eq src='R = [ ρ · L | A ]' />
        <p>
          The resistivity <M>ρ</M> is a property of the material alone (unit <M>"Ω·m"</M>). The resistance <M>R</M> belongs to a particular piece of it.
        </p>
        <figure className="t-figure">
          <OhmGraph kind="ohmic" />
          <figcaption>For an ohmic conductor the points lie on a straight line through the origin. The ratio <M>V / I</M> is the same wherever you look.</figcaption>
        </figure>
        <p>
          Many devices are <strong>non-ohmic</strong>: the current is not proportional to the voltage, and <M>V / I</M> changes. A lamp filament heats up and its resistance rises. A diode passes current in one direction only and only above a threshold voltage.
        </p>
        <figure className="t-figure">
          <OhmGraph kind="bulb" />
          <figcaption>A lamp: the curve bends over, since a hotter filament resists more.</figcaption>
        </figure>
        <figure className="t-figure">
          <OhmGraph kind="diode" />
          <figcaption>A diode: nothing flows until about half a volt, then the current climbs steeply. In reverse it blocks.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-resistivity">
        <SectionHead n={no('resistivity')} title="Resistivity and temperature" />
        <p>
          <M>R = ρ · L / A</M> says that resistance grows with length (the electrons have farther to push through) and falls with cross-section (there are more paths in parallel). Doubling the length doubles <M>R</M>. Doubling the diameter divides it by four.
        </p>
        <figure className="t-figure">
          <ResistorShape />
          <figcaption>Longer: <M>R</M> doubles. Stretched to twice the length, the wire gets thinner too, since its volume is fixed. Then <M>L</M> doubles and <M>A</M> halves, so <M>R</M> goes up four times.</figcaption>
        </figure>
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Material</th>
                <th scope="col">Resistivity at about 20 °C</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['Copper', '1.7 × 10 ^−8 "Ω·m"'],
                  ['Aluminium', '2.8 × 10 ^−8 "Ω·m"'],
                  ['Nichrome', '1.1 × 10 ^−6 "Ω·m"'],
                  ['Pure silicon', '2.3 × 10 ^3 "Ω·m"'],
                  ['Glass', '10 ^10 "Ω·m" "or more"'],
                ] as const
              ).map(([name, v]) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td>
                    <M>{v}</M>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          That is a range of more than <M>10 ^17</M> from copper to glass. Nichrome is used in heaters because it has high resistivity and keeps it as it gets hot.
        </p>
        <h3 className="t-h3">Temperature</h3>
        <p>
          For a metal, a rise in temperature makes the ions vibrate harder, so electrons collide more often and the relaxation time <M>τ</M> falls. Since <M>ρ = m / ( n · e ^2 · τ )</M>, the resistivity rises. Over a modest range the rise is linear:
        </p>
        <Eq src='ρ = ρ _0 · ( 1 + α · ( T − T _0 ) )' />
        <p>
          where <M>α</M> is the <strong>temperature coefficient of resistivity</strong> (about <M>0.004 "/°C"</M> for most pure metals). The same formula applies to resistance. In semiconductors it goes the other way: heating frees more charge carriers, so <M>n</M> rises a lot and the resistivity <em>falls</em>. Some alloys, such as manganin, have almost no change with temperature and are used for standard resistors.
        </p>
        <figure className="t-figure">
          <TempResistance />
          <figcaption>Hotter ions, wider jiggling, more collisions for the passing electron, and a higher resistivity.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-combos">
        <SectionHead n={no('combos')} title="Resistors in series and parallel" />
        <p>
          <strong>In series</strong>, resistors are joined end to end, so the same current <M>I</M> passes through each. The voltages add:
        </p>
        <Eq src={['V = V _1 + V _2 = I · R _1 + I · R _2', 'R _eq = R _1 + R _2']} />
        <figure className="t-figure">
          <Circuit kind="series" />
          <figcaption>The same current in both, and the voltage divides in proportion to the resistances. Here 12 V gives 4 V across 3 Ω and 8 V across 6 Ω.</figcaption>
        </figure>
        <p>
          <strong>In parallel</strong>, the ends of the resistors are joined together, so each has the same voltage <M>V</M>. The currents add:
        </p>
        <Eq src={['I = I _1 + I _2 = [ V | R _1 ] + [ V | R _2 ]', '[ 1 | R _eq ] = [ 1 | R _1 ] + [ 1 | R _2 ]']} />
        <figure className="t-figure">
          <Circuit kind="parallel" />
          <figcaption>The current splits, with the larger share through the smaller resistor. The total is the sum, 4 A + 2 A = 6 A, and the parallel pair is smaller than either resistor on its own.</figcaption>
        </figure>
        <p>
          For two resistors in parallel it is quicker to use <M>R _eq = R _1 · R _2 / ( R _1 + R _2 )</M>. Complicated networks are solved by repeatedly replacing the series and parallel parts with their equivalents.
        </p>
      </section>

      <section className="t-section" id="t-power">
        <SectionHead n={no('power')} title="Energy and power" />
        <p>
          A charge <M>Q</M> that falls through a potential difference <M>V</M> loses an energy <M>Q · V</M>. In a resistor this energy is not turned into speed. The electron is stopped by collisions again and again, and the energy goes into the lattice as heat. In a time <M>t</M> a current <M>I</M> carries <M>Q = I · t</M> through, so the energy and the power (energy per time) are
        </p>
        <Eq src={['W = V · I · t', 'P = V · I = I ^2 · R = [ V ^2 | R ]']} />
        <p>
          The unit of power is the <strong>watt</strong>, <M>1 "W" = 1 "J/s"</M>. The three forms are equivalent when Ohm's law holds. Use <M>I ^2 · R</M> when the current is shared (series), and <M>V ^2 / R</M> when the voltage is shared (parallel). Electricity is sold in <strong>kilowatt-hours</strong>: <M>1 "kWh" = 3.6 × 10 ^6 "J"</M>.
        </p>
        <figure className="t-figure">
          <PowerHeat />
          <figcaption>Double the current and the heating goes up four times. This is why thin wires carrying a big current get hot.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-cells">
        <SectionHead n={no('cells')} title="Cells, EMF and internal resistance" />
        <p>
          A cell keeps a potential difference across its terminals by doing work on charges inside it: it lifts them from the negative to the positive terminal against the field. The work done per unit charge is the <strong>electromotive force</strong> (EMF) <M>ε</M> of the cell. Despite the name it is a work per charge, measured in volts, not a force.
        </p>
        <p>
          The chemicals inside the cell resist the flow of charge too. This is its <strong>internal resistance</strong> <M>r</M>. With a load <M>R</M> connected, the same current <M>I</M> passes through both. The EMF is shared between them:
        </p>
        <Eq src={['ε = I · R + I · r', 'I = [ ε | R + r ]', 'V = I · R = ε − I · r']} />
        <p>
          <M>V</M> is the <strong>terminal voltage</strong>, the voltage actually available across the load. It equals the EMF only when no current flows (open circuit). When the cell is delivering current, some of the EMF is lost as <M>I · r</M> inside the cell. A short circuit (<M>R = 0</M>) gives the largest current <M>ε / r</M>, with all the EMF dropped across the cell itself.
        </p>
        <figure className="t-figure">
          <CellInternal />
          <figcaption>As the load gets smaller the current rises and the terminal voltage slides down the line <M>V = ε − I · r</M>. The slope of the line is minus the internal resistance.</figcaption>
        </figure>
        <p>When a cell is being charged by a larger source, the current goes through it the other way and <M>V = ε + I · r</M>.</p>
        <h3 className="t-h3">Cells in series and in parallel</h3>
        <p>
          <strong>In series</strong>, with the positive terminal of one joined to the negative of the next, the EMFs add and so do the internal resistances: <M>ε _eq = ε _1 + ε _2</M> and <M>r _eq = r _1 + r _2</M>. <strong>In parallel</strong>, with <M>n</M> identical cells all joined positive to positive, the EMF stays <M>ε</M> but the internal resistance becomes <M>r / n</M>. Series gives more voltage. Parallel gives less internal resistance and so can supply a larger current.
        </p>
        <figure className="t-figure">
          <CellsCombo kind="series" />
          <figcaption>Two cells in series: twice the EMF, but twice the internal resistance.</figcaption>
        </figure>
        <figure className="t-figure">
          <CellsCombo kind="parallel" />
          <figcaption>Two cells in parallel: the same EMF, half the internal resistance.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-kirchhoff">
        <SectionHead n={no('kirchhoff')} title="Kirchhoff's rules" />
        <p>
          Not every circuit can be reduced by series and parallel rules. Two general rules always work.
        </p>
        <p>
          <strong>The junction rule.</strong> Charge does not pile up at a junction, so the total current into it equals the total current out of it:
        </p>
        <Eq src='Σ I _in = Σ I _out' />
        <figure className="t-figure">
          <Junction />
          <figcaption>5 A comes in, and 3 A and 2 A go out. The dots go in and out at the same total rate.</figcaption>
        </figure>
        <p>
          <strong>The loop rule.</strong> The electric potential is single-valued, so on a trip round any closed loop you come back to the same potential. The rises and falls of potential add up to zero:
        </p>
        <Eq src='Σ ( "rises" − "falls" ) = 0 ,  "that is"  Σ ε = Σ I · R' />
        <figure className="t-figure">
          <LoopRule />
          <figcaption>The cell lifts the potential by 12 V. The two resistors take it down by 4 V and 8 V. The ball gets home at the starting potential.</figcaption>
        </figure>
        <h3 className="t-h3">How to use them</h3>
        <ol className="t-list">
          <li>Label a current in every branch with an arrow. Any direction will do. A negative answer just means the other way.</li>
          <li>Write the junction rule at each junction (one fewer than the number of junctions is enough).</li>
          <li>Write the loop rule for enough loops to use every branch once. Choose a direction round the loop. A resistor is a <em>fall</em> if you go through it with the current and a <em>rise</em> if against. A cell is a <em>rise</em> if you go from its negative to its positive terminal.</li>
          <li>Solve the equations together.</li>
        </ol>
      </section>

      <section className="t-section" id="t-wheatstone">
        <SectionHead n={no('wheatstone')} title="The Wheatstone bridge" />
        <p>
          Four resistors <M>P</M>, <M>Q</M>, <M>R</M> and <M>S</M> are joined in a diamond, with a battery across one diagonal and a sensitive galvanometer <M>G</M> across the other. Adjust one of them until the galvanometer reads zero: the bridge is <strong>balanced</strong>.
        </p>
        <p>
          At balance no current passes through <M>G</M>, so the two points it joins are at the same potential. Then the same current flows through <M>P</M> and <M>Q</M> (call it <M>I _1</M>) and the same through <M>R</M> and <M>S</M> (<M>I _2</M>). The voltage across <M>P</M> equals the voltage across <M>R</M>, and the voltage across <M>Q</M> equals that across <M>S</M>:
        </p>
        <Eq src={['I _1 · P = I _2 · R', 'I _1 · Q = I _2 · S', '[ P | Q ] = [ R | S ]']} />
        <p>
          The last line follows by dividing the first by the second. If three of the resistors are known, the fourth is found: <M>S = R · Q / P</M>. Notice that the answer does not depend on the battery voltage, or on the galvanometer, which only has to tell us when its reading is zero.
        </p>
        <figure className="t-figure">
          <Wheatstone />
          <figcaption>As <M>S</M> is changed the voltage at D crosses the voltage at B. The galvanometer needle goes to one side, zero, and then the other, and the current through it reverses. It is zero when <M>P / Q = R / S</M>, here at <M>S = 60 "Ω"</M>.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-meter">
        <SectionHead n={no('meter')} title="The meter bridge" />
        <p>
          A <strong>meter bridge</strong> is a practical Wheatstone bridge. Two of the resistances are the two parts of a uniform one-metre wire, and a sliding contact called a <strong>jockey</strong> picks the point of balance. An unknown resistance <M>X</M> and a known resistance <M>R</M> are in the two gaps of a metal strip above the wire.
        </p>
        <p>
          Slide the jockey until the galvanometer reads zero, at a distance <M>l</M> from the end next to <M>R</M>. The wire is uniform, so the resistance of a length of it is proportional to the length. The left part of the wire has resistance in proportion to <M>l</M> and the right part to <M>100 − l</M>. The bridge condition then gives
        </p>
        <Eq src={['[ R | X ] = [ l | 100 − l ]', 'X = R · [ 100 − l | l ]']} />
        <figure className="t-figure">
          <MeterBridge />
          <figcaption>The jockey slides until the needle sits at zero, at 40 cm. With <M>R = 12 "Ω"</M> that gives <M>X = 18 "Ω"</M>.</figcaption>
        </figure>
        <p>
          The best accuracy is when the balance point is near the middle of the wire, so choose <M>R</M> close to <M>X</M>. The jockey should only be tapped on the wire, not dragged, to avoid wearing it unevenly. Errors at the ends, where the strip joins the wire, are reduced by swapping <M>R</M> and <M>X</M> and averaging.
        </p>
      </section>

      <section className="t-section" id="t-potentiometer">
        <SectionHead n={no('potentiometer')} title="The potentiometer" />
        <p>
          A <strong>potentiometer</strong> is a long uniform wire (several metres) carrying a steady current from a driver cell. Because the wire is uniform, the potential falls at a steady rate along it. The <strong>potential gradient</strong> is
        </p>
        <Eq src='k = [ V _wire | L ]' />
        <p>
          in volts per metre. The great advantage is that a cell connected through a galvanometer to the wire, and balanced at a length <M>l</M> where the galvanometer reads zero, <em>draws no current from the cell</em>. We therefore read its EMF itself, not a terminal voltage lowered by the internal resistance. At a null point the cell's voltage is equal to the potential difference across the length <M>l</M> of wire:
        </p>
        <Eq src='ε = k · l' />
        <p>
          The driver voltage must be larger than the EMF we are measuring, or there will be no balance point.
        </p>
        <h3 className="t-h3">Comparing two EMFs</h3>
        <p>
          Balance each cell in turn, at <M>l _1</M> and <M>l _2</M>. The gradient <M>k</M> is the same, so
        </p>
        <Eq src='[ ε _1 | ε _2 ] = [ l _1 | l _2 ]' />
        <h3 className="t-h3">The internal resistance of a cell</h3>
        <p>
          First balance the cell on open circuit, at <M>l _1</M>: <M>ε = k · l _1</M>. Then connect a known resistance <M>R</M> across the cell and balance again at <M>l _2</M>. Now the terminal voltage is <M>V = k · l _2</M>. Since <M>V = ε · R / ( R + r )</M>:
        </p>
        <Eq src={['[ ε | V ] = [ R + r | R ] = [ l _1 | l _2 ]', 'r = R · ( [ l _1 | l _2 ] − 1 )']} />
        <figure className="t-figure">
          <Potentiometer />
          <figcaption>On open circuit the null point is at 5.0 m. With a resistor across the cell the terminal voltage is lower, so the null point moves to 4.0 m. The gap tells us the internal resistance.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Current', 'I = [ Δ Q | Δ t ]'],
                  ['Drift velocity', 'v _d = [ e · E · τ | m ]'],
                  ['Current and drift', 'I = n · e · A · v _d'],
                  ['Mobility', 'μ = [ v _d | E ]'],
                  ['Ohm law', 'V = I · R'],
                  ['Resistance of a wire', 'R = [ ρ · L | A ]'],
                  ['Resistivity', 'ρ = [ m | n · e ^2 · τ ]'],
                  ['Temperature', 'ρ = ρ _0 · ( 1 + α · Δ T )'],
                  ['Series', 'R _eq = R _1 + R _2'],
                  ['Parallel', '[ 1 | R _eq ] = [ 1 | R _1 ] + [ 1 | R _2 ]'],
                  ['Power', 'P = V · I = I ^2 · R = [ V ^2 | R ]'],
                  ['Energy', 'W = P · t'],
                  ['Current from a cell', 'I = [ ε | R + r ]'],
                  ['Terminal voltage', 'V = ε − I · r'],
                  ['Junction rule', 'Σ I _in = Σ I _out'],
                  ['Wheatstone bridge', '[ P | Q ] = [ R | S ]'],
                  ['Meter bridge', 'X = R · [ 100 − l | l ]'],
                  ['Potentiometer, EMFs', '[ ε _1 | ε _2 ] = [ l _1 | l _2 ]'],
                  ['Potentiometer, internal resistance', 'r = R · ( [ l _1 | l _2 ] − 1 )'],
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
                  ['I', 'Current', 'A'],
                  ['V', 'Potential difference', 'V'],
                  ['R', 'Resistance', 'Ω'],
                  ['ρ', 'Resistivity', 'Ω·m'],
                  ['σ', 'Conductivity', 'S/m'],
                  ['n', 'Free electrons per volume', 'm⁻³'],
                  ['v _d', 'Drift velocity', 'm/s'],
                  ['τ', 'Relaxation time', 's'],
                  ['ε', 'EMF', 'V'],
                  ['r', 'Internal resistance', 'Ω'],
                  ['P', 'Power', 'W'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{unit === 'm⁻³' ? unit : <M>{`"${unit}"`}</M>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Charge and electrons">
          <p className="ex-q">A current of 0.8 A flows for 2 minutes. How much charge passes, and how many electrons?</p>
          <Given items={['I = 0.8 "A"', 't = 120 "s"']} />
          <ol className="steps">
            <Step title="Charge">
              <Eq src='Q = I · t = 0.8 · 120 = 96 "C"' />
            </Step>
            <Step title="Number of electrons">
              <Eq src='N = [ Q | e ] = [ 96 | 1.6 × 10 ^−19 ] = 6 × 10 ^20' />
            </Step>
          </ol>
          <Answer>96 C, carried by <M>6 × 10 ^20</M> electrons: about a thousand million million million of them.</Answer>
          <figure className="t-figure">
            <ChargeFlow />
          </figure>
        </Example>

        <Example n={2} title="How slowly do the electrons drift?">
          <p className="ex-q">A copper wire of cross-section <M>1 "mm²"</M> carries 2 A. Copper has <M>8.5 × 10 ^28</M> free electrons per cubic metre. Find the drift speed.</p>
          <Given items={['A = 10 ^−6 "m²"', 'I = 2 "A"', 'n = 8.5 × 10 ^28 "m⁻³"']} />
          <ol className="steps">
            <Step title="Turn the current formula around">
              <Eq src='v _d = [ I | n · e · A ]' />
            </Step>
            <Step title="Put in the numbers">
              <Eq src='v _d = [ 2 | 8.5 × 10 ^28 · 1.6 × 10 ^−19 · 10 ^−6 ] = [ 2 | 1.36 × 10 ^4 ] = 1.47 × 10 ^−4 "m/s"' />
            </Step>
          </ol>
          <Answer>0.147 mm/s. At this speed an electron needs about two hours to travel a metre along the wire. The current is large because there are so many carriers.</Answer>
          <figure className="t-figure">
            <DriftTube />
          </figure>
        </Example>

        <Example n={3} title="A heating wire">
          <p className="ex-q">A nichrome wire is 2 m long and 0.4 mm in diameter (<M>ρ = 1.1 × 10 ^−6 "Ω·m"</M>). Find its resistance, and its resistance if it is drawn out to twice the length at constant volume.</p>
          <Given items={['L = 2 "m"', 'd = 0.4 "mm"', 'ρ = 1.1 × 10 ^−6 "Ω·m"']} />
          <ol className="steps">
            <Step title="Cross-section">
              <Eq src='A = π · r ^2 = π · ( 0.2 × 10 ^−3 ) ^2 = 1.257 × 10 ^−7 "m²"' />
            </Step>
            <Step title="Resistance">
              <Eq src='R = [ ρ · L | A ] = [ 1.1 × 10 ^−6 · 2 | 1.257 × 10 ^−7 ] = 17.5 "Ω"' />
            </Step>
            <Step title="After stretching">
              <p>Twice as long means half the area, since <M>L · A</M> is fixed.</p>
              <Eq src='R ′ = ρ · [ 2 · L | A / 2 ] = 4 · R = 70 "Ω"' />
            </Step>
          </ol>
          <Answer>17.5 Ω, which becomes 70 Ω (four times) when the wire is stretched to twice its length.</Answer>
          <figure className="t-figure">
            <ResistorShape />
          </figure>
        </Example>

        <Example n={4} title="A coil that warms up">
          <p className="ex-q">A copper coil has resistance 50 Ω at 20 °C. Find its resistance at 100 °C if <M>α = 0.004 "/°C"</M>.</p>
          <Given items={['R _0 = 50 "Ω"', 'Δ T = 80 "°C"', 'α = 0.004 "/°C"']} />
          <ol className="steps">
            <Step title="Apply the formula">
              <Eq src='R = R _0 · ( 1 + α · Δ T ) = 50 · ( 1 + 0.004 · 80 ) = 50 · 1.32 = 66 "Ω"' />
            </Step>
          </ol>
          <Answer>66 Ω, a rise of 32%.</Answer>
          <figure className="t-figure">
            <TempResistance />
          </figure>
        </Example>

        <Example n={5} title="A mixed network">
          <p className="ex-q">A 6 Ω and a 3 Ω resistor in parallel are joined in series with a 4 Ω resistor and a 12 V battery (no internal resistance). Find the current from the battery and the current in each branch of the parallel pair.</p>
          <Given items={['R _1 = 6 "Ω"', 'R _2 = 3 "Ω"', 'R _3 = 4 "Ω"', 'V = 12 "V"']} />
          <ol className="steps">
            <Step title="The parallel pair">
              <Eq src='R _p = [ 6 · 3 | 6 + 3 ] = 2 "Ω"' />
            </Step>
            <Step title="Whole circuit and main current">
              <Eq src={['R = R _p + R _3 = 2 + 4 = 6 "Ω"', 'I = [ V | R ] = [ 12 | 6 ] = 2 "A"']} />
            </Step>
            <Step title="Voltage across the pair, and the branch currents">
              <Eq src={['V _p = I · R _p = 2 · 2 = 4 "V"', 'I _1 = [ 4 | 6 ] = 0.67 "A" ,  I _2 = [ 4 | 3 ] = 1.33 "A"']} />
            </Step>
            <Step title="Check with power">
              <Eq src='P = V · I = 12 · 2 = 24 "W"' />
            </Step>
          </ol>
          <Answer>2 A from the battery. It splits as 0.67 A through the 6 Ω and 1.33 A through the 3 Ω (they add to 2 A). Total power 24 W, of which the 4 Ω resistor takes 16 W.</Answer>
          <figure className="t-figure">
            <Circuit kind="parallel" />
          </figure>
        </Example>

        <Example n={6} title="A 100 W lamp">
          <p className="ex-q">A lamp is marked 220 V, 100 W. Find its resistance and its current, and how many kilowatt-hours it uses in 10 hours.</p>
          <Given items={['V = 220 "V"', 'P = 100 "W"', 't = 10 "h"']} />
          <ol className="steps">
            <Step title="Resistance">
              <Eq src='R = [ V ^2 | P ] = [ 220 ^2 | 100 ] = 484 "Ω"' />
            </Step>
            <Step title="Current">
              <Eq src='I = [ P | V ] = [ 100 | 220 ] = 0.455 "A"' />
            </Step>
            <Step title="Energy">
              <Eq src='W = P · t = 0.1 "kW" · 10 "h" = 1 "kWh"' />
            </Step>
          </ol>
          <Answer>484 Ω and 0.455 A. In 10 hours it uses 1 kWh, which is <M>3.6 × 10 ^6 "J"</M>. (The resistance is for the hot filament; cold, it is much less.)</Answer>
          <figure className="t-figure">
            <PowerHeat />
          </figure>
        </Example>

        <Example n={7} title="A cell with internal resistance">
          <p className="ex-q">A cell of EMF 1.5 V and internal resistance 0.5 Ω is connected to a 2.5 Ω resistor. Find the current, the terminal voltage, the power in the resistor, the power wasted inside, and the short-circuit current.</p>
          <Given items={['ε = 1.5 "V"', 'r = 0.5 "Ω"', 'R = 2.5 "Ω"']} />
          <ol className="steps">
            <Step title="Current">
              <Eq src='I = [ ε | R + r ] = [ 1.5 | 2.5 + 0.5 ] = 0.5 "A"' />
            </Step>
            <Step title="Terminal voltage">
              <Eq src='V = ε − I · r = 1.5 − 0.5 · 0.5 = 1.25 "V"' />
            </Step>
            <Step title="Powers">
              <Eq src={['P _R = I ^2 · R = 0.5 ^2 · 2.5 = 0.625 "W"', 'P _r = I ^2 · r = 0.5 ^2 · 0.5 = 0.125 "W"']} />
            </Step>
            <Step title="Short circuit (R = 0)">
              <Eq src='I _sc = [ ε | r ] = [ 1.5 | 0.5 ] = 3 "A"' />
            </Step>
          </ol>
          <Answer>0.5 A and 1.25 V across the load. The load gets 0.625 W and 0.125 W is lost in the cell (total 0.75 W = ε I). A short circuit would draw 3 A.</Answer>
          <figure className="t-figure">
            <CellInternal />
          </figure>
        </Example>

        <Example n={8} title="Two loops with Kirchhoff">
          <p className="ex-q">Two cells are joined by three branches. The left branch has a 10 V cell and 2 Ω, the right branch has a 4 V cell and 1 Ω, and they share the middle branch of 4 Ω. Both cells push current up into the top junction. Find the current in each branch.</p>
          <Given items={['ε _1 = 10 "V"', 'R _1 = 2 "Ω"', 'ε _2 = 4 "V"', 'R _2 = 1 "Ω"', 'R _3 = 4 "Ω"']} />
          <ol className="steps">
            <Step title="Junction rule">
              <p>Let <M>I _1</M> and <M>I _2</M> flow from the cells into the junction and <M>I _3</M> flow down the middle branch.</p>
              <Eq src='I _3 = I _1 + I _2' />
            </Step>
            <Step title="Loop through cell 1 and the middle branch">
              <Eq src='10 − 2 · I _1 − 4 · I _3 = 0' />
            </Step>
            <Step title="Loop through cell 2 and the middle branch">
              <Eq src='4 − 1 · I _2 − 4 · I _3 = 0' />
            </Step>
            <Step title="Substitute I₃ and simplify">
              <Eq src={['6 · I _1 + 4 · I _2 = 10', '4 · I _1 + 5 · I _2 = 4']} />
            </Step>
            <Step title="Solve">
              <p>Multiply the first by 5 and the second by 4, then subtract: <M>14 · I _1 = 34</M>.</p>
              <Eq src={['I _1 = [ 17 | 7 ] = 2.43 "A"', 'I _2 = [ 10 − 6 · I _1 | 4 ] = − 1.14 "A"', 'I _3 = I _1 + I _2 = 1.29 "A"']} />
            </Step>
          </ol>
          <Answer>2.43 A from the 10 V cell, 1.29 A down the middle branch, and −1.14 A in the right branch. The minus sign means that current actually flows <em>into</em> the 4 V cell, charging it. Check the right loop: <M>4 + 1.14 − 4 · 1.29 = 0</M>.</Answer>
          <figure className="t-figure">
            <LoopRule />
          </figure>
        </Example>

        <Example n={9} title="Balancing a Wheatstone bridge">
          <p className="ex-q">In a Wheatstone bridge <M>P = 10 "Ω"</M> and <M>Q = 20 "Ω"</M>. The bridge balances when <M>R = 30 "Ω"</M>. Find <M>S</M>. If the battery is 6 V, what are the potentials at the two ends of the galvanometer?</p>
          <Given items={['P = 10 "Ω"', 'Q = 20 "Ω"', 'R = 30 "Ω"']} />
          <ol className="steps">
            <Step title="The balance condition">
              <Eq src={['[ P | Q ] = [ R | S ]', 'S = [ R · Q | P ] = [ 30 · 20 | 10 ] = 60 "Ω"']} />
            </Step>
            <Step title="Check the two potentials (A at 6 V, C at 0 V)">
              <Eq src={['V _B = 6 · [ 20 | 10 + 20 ] = 4 "V"', 'V _D = 6 · [ 60 | 30 + 60 ] = 4 "V"']} />
            </Step>
          </ol>
          <Answer><M>S = 60 "Ω"</M>. Both ends of the galvanometer are at 4 V, so no current flows through it.</Answer>
          <figure className="t-figure">
            <Wheatstone />
          </figure>
        </Example>

        <Example n={10} title="A meter bridge">
          <p className="ex-q">In a meter bridge a 12 Ω resistor is in the left gap and an unknown <M>X</M> in the right gap. The balance point is 40 cm from the left end. Find <M>X</M>. What happens to the balance point if <M>X</M> and <M>R</M> are swapped?</p>
          <Given items={['R = 12 "Ω"', 'l = 40 "cm"']} />
          <ol className="steps">
            <Step title="Use the bridge condition">
              <Eq src='X = R · [ 100 − l | l ] = 12 · [ 60 | 40 ] = 18 "Ω"' />
            </Step>
            <Step title="After swapping">
              <Eq src={['[ X | R ] = [ l ′ | 100 − l ′ ]', '[ 18 | 12 ] = [ l ′ | 100 − l ′ ] ,  l ′ = 60 "cm"']} />
            </Step>
          </ol>
          <Answer><M>X = 18 "Ω"</M>. With the two swapped, the balance point moves to 60 cm. The two readings add to 100 cm, which is a useful check.</Answer>
          <figure className="t-figure">
            <MeterBridge />
          </figure>
        </Example>

        <Example n={11} title="A potentiometer">
          <p className="ex-q">A potentiometer wire is 10 m long with a resistance of 20 Ω. It is connected to a 3 V driver cell in series with a 10 Ω rheostat. A test cell balances at 5.0 m. When an 8 Ω resistor is connected across the test cell the balance point moves to 4.0 m. Find the potential gradient, the EMF of the cell, and its internal resistance.</p>
          <Given items={['L = 10 "m"', 'R _wire = 20 "Ω"', 'ε _d = 3 "V"', 'R _h = 10 "Ω"', 'l _1 = 5.0 "m"', 'l _2 = 4.0 "m"', 'R = 8 "Ω"']} />
          <ol className="steps">
            <Step title="Current in the wire and the gradient">
              <Eq src={['I = [ 3 | 20 + 10 ] = 0.1 "A"', 'V _wire = I · R _wire = 0.1 · 20 = 2 "V"', 'k = [ 2 | 10 ] = 0.2 "V/m"']} />
            </Step>
            <Step title="EMF of the test cell">
              <Eq src='ε = k · l _1 = 0.2 · 5.0 = 1.0 "V"' />
            </Step>
            <Step title="Terminal voltage with the resistor, then r">
              <Eq src={['V = k · l _2 = 0.2 · 4.0 = 0.8 "V"', 'r = R · ( [ l _1 | l _2 ] − 1 ) = 8 · ( [ 5 | 4 ] − 1 ) = 2 "Ω"']} />
              <p>Check: <M>I = V / R = 0.8 / 8 = 0.1 "A"</M> and <M>ε − I · r = 1.0 − 0.1 · 2 = 0.8 "V"</M>.</p>
            </Step>
          </ol>
          <Answer>Gradient 0.2 V/m, EMF 1.0 V, and internal resistance 2 Ω.</Answer>
          <figure className="t-figure">
            <Potentiometer />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Electrons travel at nearly the speed of light" wrong="v _d ≈ c" fig={<Signal />}>
            The <em>field</em> (the signal) goes at nearly the speed of light, which is why the lamp lights at once. The electrons themselves drift at about a tenth of a millimetre per second.
          </Mistake>
          <Mistake title="A resistor uses up the current" wrong="I _out < I _in" fig={<Circuit kind="series" height={230} />}>
            Charge is not lost, so the current is the same on both sides of a resistor. What the resistor uses up is <em>energy</em>: the potential falls by <M>I · R</M> across it.
          </Mistake>
          <Mistake title="Every conductor obeys Ohm's law" wrong={'"all devices have a fixed R"'} fig={<OhmGraph kind="bulb" height={230} />}>
            Ohm's law is a property of some materials, not a law of nature. A lamp, a diode or a transistor does not follow it. The ratio <M>V / I</M> can always be computed, but it is only constant for an ohmic conductor.
          </Mistake>
          <Mistake title="Resistance depends on the voltage across the wire" wrong="R ∝ V" fig={<ResistorShape />}>
            Resistance depends on the material, the length, the area and the temperature, and nothing else. Double the voltage and the current doubles, but <M>R</M> stays the same.
          </Mistake>
          <Mistake title="Parallel resistors add up" wrong="R _eq = R _1 + R _2  ( parallel )" fig={<Circuit kind="parallel" height={230} />}>
            In parallel the reciprocals add. Extra branches give the current more routes, so the total resistance goes <em>down</em>, always below the smallest branch.
          </Mistake>
          <Mistake title="The terminal voltage is the EMF" wrong={'V = ε  "always"'} fig={<CellInternal height={240} />}>
            Only when no current is drawn. With a current <M>I</M>, the terminal voltage is <M>ε − I · r</M>, lower than the EMF.
          </Mistake>
          <Mistake title="A bridge balances when all four resistors are equal" wrong="P = Q = R = S" fig={<Wheatstone />}>
            The condition is a <em>ratio</em>: <M>P / Q = R / S</M>. The resistors can all be different. Equal resistors are just one special case.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Charges drift, fields push, and every circuit obeys two rules: what flows in flows out, and the potential comes back to where it started.</p>
        <p className="closing-sub">Next: moving charges and magnetism. A current is a moving charge, and it makes a magnetic field.</p>
      </footer>
    </ChapterShell>
  );
}
