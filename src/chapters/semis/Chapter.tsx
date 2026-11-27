import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { BandLevels, Bands, Biased, CarrierBalance, GapColour, IVCurve, JunctionForm, Lattice, LedAnim, Rectifier, ResistivityScale, SolarCell, TempResistivity, ZenerReg } from './SemisAnims';

/** Semiconductor electronics: bands, doping, the p-n junction, diodes, rectifiers, Zener, LED and solar cell. */

const SECTIONS: NoteSection[] = [
  { id: 'kinds', title: 'Conductors, insulators, semiconductors', group: 'Theory' },
  { id: 'bands', title: 'Energy bands', group: 'Theory' },
  { id: 'intrinsic', title: 'The intrinsic semiconductor', group: 'Theory' },
  { id: 'extrinsic', title: 'Doping: n-type and p-type', group: 'Theory' },
  { id: 'junction', title: 'The p-n junction', group: 'Theory' },
  { id: 'diode', title: 'The diode and its characteristic', group: 'Theory' },
  { id: 'rectifier', title: 'Rectifiers', group: 'Theory' },
  { id: 'zener', title: 'The Zener diode', group: 'Theory' },
  { id: 'light', title: 'Light and junctions: LED and solar cell', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="semis" film={buildFilm} sections={SECTIONS} sideTitle="Semiconductors" sideLead="How a pinch of impurity turns a poor conductor into a switch, a rectifier and a light source: bands, doping, the p-n junction and the devices built on it.">
      <header className="article-head">
        <span className="kicker">Physics · Semiconductor electronics</span>
        <h1 className="article-title">How does a crystal learn to switch current?</h1>
        <p className="article-lead">Silicon on its own is a poor conductor. Add one impurity atom per million and it becomes useful; join a p-type piece to an n-type piece and you get a one-way valve for current. That junction is the heart of every diode, LED and solar cell.</p>
      </header>

      <section className="t-section" id="t-kinds">
        <SectionHead n={no('kinds')} title="Conductors, insulators, semiconductors" />
        <p>
          Materials differ enormously in how well they carry current. We sort them by their <strong>resistivity</strong> <M>ρ</M>, or by its inverse, the <strong>conductivity</strong> <M>σ = 1 / ρ</M>:
        </p>
        <ul>
          <li><strong>Conductors</strong> (metals): <M>ρ</M> from <M>10 ^−8</M> to <M>10 ^−2 "Ω m"</M>.</li>
          <li><strong>Insulators</strong> (glass, diamond, rubber): <M>ρ</M> above <M>10 ^8 "Ω m"</M>.</li>
          <li><strong>Semiconductors</strong> (silicon, germanium): in between, from <M>10 ^−5</M> to <M>10 ^6 "Ω m"</M>.</li>
        </ul>
        <figure className="t-figure">
          <ResistivityScale />
          <figcaption>The scale is logarithmic, so each tick is ten times the last. Semiconductors cover eleven powers of ten, because their resistivity can be changed so much.</figcaption>
        </figure>
        <p>
          What makes a semiconductor special is how it behaves when we change things. Its conductivity rises when it is heated, when light falls on it, and above all when a tiny amount of another element is added. A metal does the opposite on heating: the atoms vibrate more and scatter the electrons, so its resistivity goes <em>up</em>.
        </p>
        <figure className="t-figure">
          <TempResistivity />
          <figcaption>Heating a metal makes it worse. Heating a semiconductor frees more carriers, so its resistivity drops sharply.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-bands">
        <SectionHead n={no('bands')} title="Energy bands" />
        <p>
          In a single atom the electrons have separate energy levels. In a crystal there are billions of atoms close together, and the levels spread into wide ranges, the <strong>energy bands</strong>, with forbidden gaps in between. Two bands matter:
        </p>
        <ul>
          <li>The <strong>valence band</strong>: the highest band that is full of electrons at absolute zero. Electrons here are bound to their atoms.</li>
          <li>The <strong>conduction band</strong>: the next band up. Electrons in it are free to move through the crystal and carry current.</li>
        </ul>
        <p>
          The gap between the top of the valence band, <M>E _V</M>, and the bottom of the conduction band, <M>E _C</M>, is the <strong>band gap</strong>:
        </p>
        <Eq src='E _g = E _C − E _V' />
        <p>A full band cannot carry current, since an electron needs a nearby empty state to move into. So conduction needs electrons in the conduction band. The gap decides whether they are there:</p>
        <figure className="t-figure">
          <Bands />
          <figcaption>
            <strong>Conductor</strong>: the bands overlap, so there are always free electrons. <strong>Semiconductor</strong>: a small gap, so heat lifts a few electrons across. <strong>Insulator</strong>: a gap so wide that none get across.
          </figcaption>
        </figure>
        <Eq src={['E _g ≈ 1.1 "eV" "(silicon)"', 'E _g ≈ 0.67 "eV" "(germanium)"', 'E _g ≈ 5.4 "eV" "(diamond, an insulator)"']} />
        <p>
          At room temperature the thermal energy of a particle is only about 0.026 eV, but the few electrons in the high-energy tail of the distribution are enough to lift a handful across a gap of 1 eV. Across 5 eV the chance is hopelessly small.
        </p>
      </section>

      <section className="t-section" id="t-intrinsic">
        <SectionHead n={no('intrinsic')} title="The intrinsic semiconductor" />
        <p>
          A pure crystal of silicon or germanium is an <strong>intrinsic</strong> semiconductor. Each atom has four outer electrons and shares one with each of four neighbours in a <strong>covalent bond</strong>, so every atom ends up with a full shell of eight.
        </p>
        <p>
          At absolute zero every bond is complete and nothing can move. When the crystal warms up, thermal energy occasionally breaks a bond. An electron is freed and wanders through the crystal, and it leaves behind a vacancy: a <strong>hole</strong>. A hole acts like a positive charge, because a neighbouring bond electron can hop into it, leaving a new hole where it came from. The hole walks the opposite way to the electrons.
        </p>
        <figure className="t-figure">
          <Lattice mode="intrinsic" title="A row of silicon atoms with paired bond electrons; a bond breaks, a free electron drifts one way in an electric field and the hole hops the other way as bond electrons step in" />
          <figcaption>In an electric field the free electron drifts left. The hole, passed from bond to bond, moves right. Both movements carry current the same way.</figcaption>
        </figure>
        <p>
          Every freed electron leaves exactly one hole, so in an intrinsic semiconductor
        </p>
        <Eq src='n _e = n _h = n _i' />
        <p>
          where <M>n _e</M> and <M>n _h</M> are the numbers of electrons and holes per cubic metre and <M>n _i</M> is the <strong>intrinsic carrier concentration</strong>. For silicon at room temperature <M>n _i ≈ 1.5 × 10 ^16 "m⁻³"</M>, while silicon has about <M>5 × 10 ^28</M> atoms per cubic metre. Only about one atom in <M>3 × 10 ^12</M> has lost an electron, which is why pure silicon conducts so badly.
        </p>
        <p>The total current is the sum of the electron current and the hole current, and the conductivity is</p>
        <Eq src='σ = e · ( n _e · μ _e + n _h · μ _h )' />
        <p>
          where <M>μ</M> is the <strong>mobility</strong>, the drift speed per unit field. Electrons are somewhat more mobile than holes.
        </p>
      </section>

      <section className="t-section" id="t-extrinsic">
        <SectionHead n={no('extrinsic')} title="Doping: n-type and p-type" />
        <p>
          We can raise the conductivity of silicon a million times by adding a very small amount of another element, about one atom in a million. This is <strong>doping</strong>, and the result is an <strong>extrinsic</strong> semiconductor.
        </p>
        <h3 className="t-h3">n-type: a donor adds electrons</h3>
        <p>
          Replace a few silicon atoms by <strong>pentavalent</strong> atoms (five outer electrons): phosphorus, arsenic or antimony. Four of the five electrons make bonds with the neighbours. The fifth is left over and is held only very weakly, so even room temperature sets it free. The impurity is called a <strong>donor</strong>, and it becomes a fixed positive ion.
        </p>
        <figure className="t-figure">
          <Lattice mode="n" title="A phosphorus atom in the silicon lattice has a spare fifth electron that circles it, then breaks free and drifts away in the field, leaving a fixed positive ion behind" />
          <figcaption>The spare electron breaks away and drifts in the field. The donor atom stays behind as a fixed <M>+</M> ion.</figcaption>
        </figure>
        <p>The conduction band now has many more electrons than holes. In an n-type crystal electrons are the <strong>majority carriers</strong> and holes the <strong>minority carriers</strong>.</p>
        <h3 className="t-h3">p-type: an acceptor adds holes</h3>
        <p>
          Replace a few silicon atoms by <strong>trivalent</strong> atoms (three outer electrons): boron, aluminium, indium or gallium. One bond is an electron short, which is a hole. A neighbouring electron easily hops in, and the impurity turns into a fixed negative ion. It is an <strong>acceptor</strong>. Now holes are the majority carriers and electrons the minority.
        </p>
        <figure className="t-figure">
          <Lattice mode="p" title="A boron atom in the silicon lattice leaves one bond short; a hole hops from bond to bond as neighbouring electrons step in, while the boron stays as a fixed negative ion" />
          <figcaption>Boron has only three outer electrons, so one bond has a hole in it. Electrons step in from the next bond and the hole moves along.</figcaption>
        </figure>
        <Note label="Neutral overall">Doping adds atoms, not charge. A donor atom is neutral as a whole: the free electron it gives up is exactly cancelled by the + charge of the ion it leaves. So an n-type crystal is <em>not</em> negatively charged, and a p-type one is not positive.</Note>
        <h3 className="t-h3">In terms of energy bands</h3>
        <p>
          A donor adds an energy level just <em>below</em> the conduction band, about 0.05 eV away. A tiny kick lifts its electron into the band. An acceptor adds a level just <em>above</em> the valence band. Electrons from the valence band hop onto it, leaving holes in the valence band.
        </p>
        <figure className="t-figure">
          <BandLevels kind="n" title="A donor level sits just below the conduction band; electrons hop up from it into the band and leave fixed plus ions behind" />
          <figcaption>n-type: electrons climb from the donor level into the conduction band.</figcaption>
        </figure>
        <figure className="t-figure">
          <BandLevels kind="p" title="An acceptor level sits just above the valence band; electrons hop up from the valence band onto it, leaving mobile holes behind in the valence band" />
          <figcaption>p-type: electrons leave the valence band to fill the acceptor level, leaving holes behind.</figcaption>
        </figure>
        <h3 className="t-h3">How many of each?</h3>
        <p>
          In thermal equilibrium, electrons and holes keep being created and recombining. The result is that the product of their concentrations stays the same, doped or not:
        </p>
        <Eq src='n _e · n _h = n _i ^2' />
        <p>
          Dope with <M>N _D</M> donors per cubic metre (much more than <M>n _i</M>) and the electrons number about <M>N _D</M>, so the holes are pushed down to <M>n _i ^2 / N _D</M>. Adding electrons <em>reduces</em> the number of holes because more of them recombine.
        </p>
        <Eq src={['n _e ≈ N _D', 'n _h ≈ [ n _i ^2 | N _D ]']} />
        <figure className="t-figure">
          <CarrierBalance />
          <figcaption>As the donor concentration is turned up, the electron bar climbs and the hole bar falls. The product stays at <M>n _i ^2</M>.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-junction">
        <SectionHead n={no('junction')} title="The p-n junction" />
        <p>
          Now put a p-type and an n-type region side by side in one crystal. (It is made by doping different parts of the same piece, not by pressing two pieces together, since an ordinary contact has a gap and a surface layer.) What happens at the boundary?
        </p>
        <ol className="steps">
          <Step title="Diffusion">
            <p>The n side is crowded with electrons and the p side with holes. Carriers wander, so electrons diffuse across into the p side and holes into the n side.</p>
          </Step>
          <Step title="Recombination">
            <p>Crossing carriers meet their opposites and cancel. Near the boundary, free carriers disappear.</p>
          </Step>
          <Step title="Fixed ions are exposed">
            <p>The donor atoms near the junction have lost their electrons and stay behind as fixed <M>+</M> ions. The acceptor atoms are now filled and stay as fixed <M>−</M> ions. A thin layer with no mobile carriers but with fixed charge is left: the <strong>depletion region</strong>, about a micrometre thick.</p>
          </Step>
          <Step title="A field stops the diffusion">
            <p>The layer of <M>+</M> ions on the n side and <M>−</M> ions on the p side creates an electric field <M>E</M> pointing from n to p. It pushes electrons back to the n side and holes back to the p side. The field grows until the drift it causes cancels the diffusion exactly, and the crossing stops.</p>
          </Step>
        </ol>
        <figure className="t-figure">
          <JunctionForm />
          <figcaption>The depletion region widens until the field is strong enough to halt the diffusion.</figcaption>
        </figure>
        <p>
          The field means a potential difference across the region, called the <strong>barrier potential</strong> <M>V _0</M>. It is about 0.7 V for silicon and 0.3 V for germanium. You cannot measure it with a voltmeter on the two ends, because the contacts of the voltmeter make their own opposing potentials. It is the barrier that a carrier must climb to cross the junction.
        </p>
        <Eq src='E ≈ [ V _0 | d ]' />
      </section>

      <section className="t-section" id="t-diode">
        <SectionHead n={no('diode')} title="The diode and its characteristic" />
        <p>
          A p-n junction with a lead on each side is a <strong>diode</strong>. Its symbol is an arrow pointing from the p side to the n side, the direction in which it passes current. Apply a battery to it and the outcome depends on which way round it goes.
        </p>
        <h3 className="t-h3">Forward bias</h3>
        <p>
          Connect the positive terminal to the p side. The battery opposes the barrier, so the barrier is lowered to <M>V _0 − V</M> and the depletion region shrinks. Now many majority carriers have enough energy to cross: holes go into the n side and electrons into the p side, where they recombine, and the battery keeps supplying more. A large current flows, and it grows steeply with the voltage.
        </p>
        <figure className="t-figure">
          <Biased mode="forward" title="A forward-biased junction: the barrier is lowered, the depletion region is narrow, and holes and electrons stream across and recombine" />
          <figcaption>Forward bias: a low barrier and a thin depletion region, so carriers cross freely.</figcaption>
        </figure>
        <h3 className="t-h3">Reverse bias</h3>
        <p>
          Connect the positive terminal to the n side. The battery adds to the barrier (<M>V _0 + V</M>) and pulls the carriers away from the junction, so the depletion region widens. Almost nothing crosses. A very small <strong>reverse current</strong> of a few microamps or less flows, carried by minority carriers that the junction field sweeps across.
        </p>
        <figure className="t-figure">
          <Biased mode="reverse" title="A reverse-biased junction: the barrier is raised, the depletion region is wide, and carriers are pulled away from the junction so almost no current flows" />
          <figcaption>Reverse bias: a high barrier and a wide depletion region. The diode behaves almost like an open switch.</figcaption>
        </figure>
        <h3 className="t-h3">The characteristic</h3>
        <p>
          A graph of current against voltage tells the whole story. In forward bias hardly anything flows until the voltage reaches the <strong>threshold</strong> (or knee) voltage, about 0.7 V for silicon and 0.3 V for germanium, and then the current shoots up. In reverse bias there is a tiny, nearly constant leakage current until, at a high enough voltage, the junction breaks down.
        </p>
        <figure className="t-figure">
          <IVCurve title="A moving dot tracing the characteristic of a silicon diode: almost no current until about 0.7 volts forward, then a steep rise; in reverse, only a tiny leakage current" />
          <figcaption>Note the different scales: forward volts are stretched, reverse volts are squeezed.</figcaption>
        </figure>
        <p>
          Above the knee the diode has a small <strong>dynamic resistance</strong>, the slope <M>r = ΔV / ΔI</M> of the curve. Below the knee, or in reverse, the resistance is huge. The diode is a one-way valve for current.
        </p>
      </section>

      <section className="t-section" id="t-rectifier">
        <SectionHead n={no('rectifier')} title="Rectifiers" />
        <p>
          Mains electricity is alternating current (a.c.), but electronics needs direct current (d.c.). A <strong>rectifier</strong> uses the one-way property of the diode to turn the first into the second.
        </p>
        <h3 className="t-h3">Half-wave rectifier</h3>
        <p>
          One diode is placed in series with the load. On the half cycle in which the p end is positive the diode conducts, and the load sees the voltage. On the other half cycle the diode is reverse biased and blocks, so the load sees nothing.
        </p>
        <figure className="t-figure">
          <Rectifier mode="half" title="A half-wave rectifier circuit with one diode; the output waveform keeps only the positive half cycles of the sine input" />
          <figcaption>Only one half of each cycle gets through. The output has the same frequency as the input.</figcaption>
        </figure>
        <p>
          If the peak input voltage is <M>V _m</M>, the average (d.c.) value of the output and the ripple frequency are
        </p>
        <Eq src={['V _dc = [ V _m | π ]', 'f _out = f _in']} />
        <h3 className="t-h3">Full-wave (bridge) rectifier</h3>
        <p>
          Four diodes in a diamond use both halves of the cycle. On one half, two of them conduct and send current through the load downward. On the other half, the other two conduct, and the current through the load is still downward. The output is always positive.
        </p>
        <figure className="t-figure">
          <Rectifier mode="full" title="A bridge rectifier of four diodes; the output waveform has all half cycles pointing upward and twice as many humps as the input" />
          <figcaption>Both halves of the input are used. The output has twice the frequency of the input, and twice the average value.</figcaption>
        </figure>
        <Eq src={['V _dc = [ 2 · V _m | π ]', 'f _out = 2 · f _in']} />
        <p>For a sine wave, the peak and root-mean-square values are related by <M>V _m = √[ 2 ] · V _rms</M>.</p>
        <h3 className="t-h3">Smoothing</h3>
        <p>
          The output is d.c. in direction but it still pulses. A <strong>filter</strong> evens it out. A capacitor across the load charges up to the peak and then supplies the load while the rectified voltage dips, discharging slowly through <M>R</M>. The larger the capacitance, the smaller the <strong>ripple</strong>. A voltage regulator (such as the Zener) then removes what is left.
        </p>
        <figure className="t-figure">
          <Rectifier mode="filtered" title="A bridge rectifier with a smoothing capacitor across the load; the output waveform is nearly flat with small ripples between the peaks" />
          <figcaption>The capacitor fills in the gaps between the peaks, leaving a small ripple.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-zener">
        <SectionHead n={no('zener')} title="The Zener diode" />
        <p>
          A <strong>Zener diode</strong> is a heavily doped junction made to be used in reverse bias. Its depletion region is very thin, so a modest reverse voltage gives a very strong field, of the order of <M>10 ^7 "V/m"</M>. At the <strong>Zener voltage</strong> <M>V _z</M> the field rips electrons straight out of the bonds, and a large reverse current flows. Past this point the voltage across the diode hardly changes, however much the current changes.
        </p>
        <figure className="t-figure">
          <IVCurve zener title="The characteristic of a Zener diode: ordinary forward behaviour on one side and, on the reverse side, a sudden drop to almost vertical at the Zener voltage, where the voltage stays near minus V z while the current changes widely" />
          <figcaption>In reverse the curve turns almost vertical at <M>− V _z</M>. The voltage is held there.</figcaption>
        </figure>
        <Note label="Two breakdown effects">In heavily doped junctions with <M>V _z</M> below about 5 V, the field itself breaks bonds (the <em>Zener effect</em>). In lightly doped junctions with a higher <M>V _z</M>, fast carriers knock more carriers free in a chain (<em>avalanche breakdown</em>). The device is called a Zener diode in both cases.</Note>
        <h3 className="t-h3">A voltage regulator</h3>
        <p>
          The Zener is connected in reverse across the load, with a <strong>series resistor</strong> <M>R _s</M> from the unregulated supply. The load sees <M>V _z</M> no matter what. The currents divide as
        </p>
        <Eq src={['I _s = I _z + I _L', 'I _L = [ V _z | R _L ]', 'R _s = [ V _in − V _z | I _z + I _L ]']} />
        <p>
          If the input rises, the current <M>I _s</M> rises, but the voltage across the diode stays about <M>V _z</M>, so the extra current just flows through the Zener, and the voltage across <M>R _s</M> takes up the whole change. If the load draws more current, the Zener passes less. The load voltage stays fixed as long as the Zener current stays positive.
        </p>
        <figure className="t-figure">
          <ZenerReg />
          <figcaption>As the input wanders between 8 V and 12 V, the output holds at 5 V. The Zener current (dark part of the bar) absorbs the changes.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-light">
        <SectionHead n={no('light')} title="Light and junctions: LED and solar cell" />
        <p>
          Junctions work with light in both directions. Put a current through one and it can emit light. Shine light on one and it can make a current.
        </p>
        <h3 className="t-h3">The light-emitting diode</h3>
        <p>
          An <strong>LED</strong> is a p-n junction made of a material such as gallium arsenide phosphide and operated in forward bias. Electrons from the n side and holes from the p side are pushed into the junction, where they recombine. In these materials the electron's drop across the gap comes out as a photon:
        </p>
        <Eq src='h · f ≈ E _g' />
        <figure className="t-figure">
          <LedAnim />
          <figcaption>Each electron-hole pair that meets at the junction gives one photon. In a silicon diode the same recombination gives heat; LEDs use materials whose gap is of the right kind to give light.</figcaption>
        </figure>
        <p>The colour is set by the band gap. A photon of energy <M>E _g</M> has wavelength</p>
        <Eq src='λ ( "nm" ) = [ 1240 | E _g ( "eV" ) ]' />
        <figure className="t-figure">
          <GapColour />
          <figcaption>A bigger gap makes bluer light. White LEDs add a coating that turns some blue light to yellow.</figcaption>
        </figure>
        <p>
          LEDs are used because they switch on instantly, run cool, use little power and last for tens of thousands of hours. They need a series resistor, since beyond the knee even a small rise in voltage gives a large rise in current.
        </p>
        <h3 className="t-h3">The photodiode</h3>
        <p>
          A <strong>photodiode</strong> is a junction in reverse bias, with a window to let light in. A photon with energy of at least <M>E _g</M> makes an electron-hole pair in the depletion region. The field sweeps them apart, and the extra reverse current is proportional to the light intensity. It is used to detect light and in remote controls and optical communication.
        </p>
        <h3 className="t-h3">The solar cell</h3>
        <p>
          A <strong>solar cell</strong> is a junction with no battery, and a thin top layer that lets sunlight through. Photons with energy above <M>E _g</M> make electron-hole pairs near the junction. The built-in field pulls the electrons to the n side and the holes to the p side. That charges the n side negatively and the p side positively: a voltage appears across the cell, and a current flows through any load joined to it. The light is the energy source.
        </p>
        <figure className="t-figure">
          <SolarCell />
          <figcaption>The junction field does the sorting. A silicon cell gives about 0.5 V, so many cells are joined in series in a panel.</figcaption>
        </figure>
        <p>
          The output power is <M>P = V · I</M>, and the <strong>efficiency</strong> is the output power divided by the light power falling on the cell. Typical silicon panels reach 15 to 22%. Photons with energy below <M>E _g</M> pass straight through and are wasted, and photons with much more than <M>E _g</M> lose the excess as heat.
        </p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Quantity</th>
                <th scope="col">Formula</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['Band gap', 'E _g = E _C − E _V'],
                  ['Intrinsic carriers', 'n _e = n _h = n _i'],
                  ['Conductivity', 'σ = e · ( n _e · μ _e + n _h · μ _h )'],
                  ['Mass action law', 'n _e · n _h = n _i ^2'],
                  ['n-type (donors N _D)', 'n _e ≈ N _D ,  n _h ≈ [ n _i ^2 | N _D ]'],
                  ['Field in the junction', 'E ≈ [ V _0 | d ]'],
                  ['Half-wave rectifier', 'V _dc = [ V _m | π ] ,  f _out = f _in'],
                  ['Full-wave rectifier', 'V _dc = [ 2 · V _m | π ] ,  f _out = 2 · f _in'],
                  ['Peak and rms', 'V _m = √[ 2 ] · V _rms'],
                  ['Zener regulator', 'R _s = [ V _in − V _z | I _z + I _L ]'],
                  ['LED resistor', 'R = [ V _s − V _F | I ]'],
                  ['Photon wavelength', 'λ ( "nm" ) = [ 1240 | E _g ( "eV" ) ]'],
                  ['Solar cell efficiency', 'η = [ P _out | P _in ]'],
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
                  ['E _g', 'Band gap', 'eV'],
                  ['n _i', 'Intrinsic carrier concentration', 'm⁻³'],
                  ['N _D', 'Donor concentration', 'm⁻³'],
                  ['V _0', 'Barrier potential (0.7 V Si, 0.3 V Ge)', 'V'],
                  ['V _m', 'Peak voltage', 'V'],
                  ['V _z', 'Zener voltage', 'V'],
                  ['R _s', 'Series resistor', 'Ω'],
                  ['I _z', 'Zener current', 'A'],
                  ['μ', 'Mobility', 'm²/V s'],
                  ['η', 'Efficiency', ''],
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

        <Example n={1} title="Which light can a crystal absorb?">
          <p className="ex-q">Find the longest wavelength of light that can lift an electron across the gap in silicon (1.1 eV), in germanium (0.67 eV) and in diamond (5.4 eV). Which of them is transparent to visible light (400 to 700 nm)?</p>
          <Given items={['E _g "(Si)" = 1.1 "eV"', 'E _g "(Ge)" = 0.67 "eV"', 'E _g "(C)" = 5.4 "eV"']} />
          <ol className="steps">
            <Step title="Threshold wavelength">
              <Eq src='λ = [ h · c | E _g ] = [ 1240 | E _g ( "eV" ) ] "nm"' />
            </Step>
            <Step title="Each material">
              <Eq src={['λ _Si = [ 1240 | 1.1 ] = 1127 "nm"', 'λ _Ge = [ 1240 | 0.67 ] = 1851 "nm"', 'λ _C = [ 1240 | 5.4 ] = 230 "nm"']} />
            </Step>
          </ol>
          <Answer>Silicon absorbs everything shorter than 1127 nm (all visible light and some infrared), germanium everything shorter than 1851 nm, and diamond only light shorter than 230 nm, which is ultraviolet. Diamond is transparent to all visible light, because no visible photon has the 5.4 eV needed.</Answer>
          <figure className="t-figure">
            <Bands title="Band pictures: the small gap of silicon can be crossed by photons, but the wide gap of diamond cannot" />
          </figure>
        </Example>

        <Example n={2} title="Doping silicon with arsenic">
          <p className="ex-q">Silicon (<M>n _i = 1.5 × 10 ^16 "m⁻³"</M>) is doped with arsenic at <M>5 × 10 ^22 "m⁻³"</M>. Find the hole concentration, and the proportion of silicon atoms replaced (silicon has <M>5 × 10 ^28 "m⁻³"</M> atoms).</p>
          <Given items={['n _i = 1.5 × 10 ^16 "m⁻³"', 'N _D = 5 × 10 ^22 "m⁻³"']} />
          <ol className="steps">
            <Step title="Electrons">
              <p>Each donor gives one electron, and this is far more than <M>n _i</M>, so</p>
              <Eq src='n _e ≈ N _D = 5 × 10 ^22 "m⁻³"' />
            </Step>
            <Step title="Holes, from the mass action law">
              <Eq src='n _h = [ n _i ^2 | n _e ] = [ ( 1.5 × 10 ^16 ) ^2 | 5 × 10 ^22 ] = [ 2.25 × 10 ^32 | 5 × 10 ^22 ] = 4.5 × 10 ^9 "m⁻³"' />
            </Step>
            <Step title="Fraction of atoms">
              <Eq src='[ 5 × 10 ^22 | 5 × 10 ^28 ] = 10 ^−6' />
            </Step>
          </ol>
          <Answer>The holes drop from <M>1.5 × 10 ^16</M> to <M>4.5 × 10 ^9 "m⁻³"</M>, while electrons rise to <M>5 × 10 ^22 "m⁻³"</M>. That is <M>1.1 × 10 ^13</M> times more electrons than holes, from replacing just one atom in a million.</Answer>
          <figure className="t-figure">
            <CarrierBalance />
          </figure>
        </Example>

        <Example n={3} title="The field inside a junction">
          <p className="ex-q">The depletion region of a silicon junction is 1 µm thick and has a barrier potential of 0.7 V. What is the average electric field in it?</p>
          <Given items={['V _0 = 0.7 "V"', 'd = 1 "µm" = 10 ^−6 "m"']} />
          <ol className="steps">
            <Step title="Field from potential">
              <Eq src='E = [ V _0 | d ] = [ 0.7 | 10 ^−6 ] = 7 × 10 ^5 "V/m"' />
            </Step>
          </ol>
          <Answer>7 × 10<sup>5</sup> V/m, a very strong field (air breaks down at about 3 × 10<sup>6</sup> V/m). It exists across a layer a thousand times thinner than a hair.</Answer>
          <figure className="t-figure">
            <JunctionForm />
          </figure>
        </Example>

        <Example n={4} title="A diode in series with a resistor">
          <p className="ex-q">A silicon diode (drop 0.7 V when conducting) and a 215 Ω resistor are connected in series to a 5 V battery, with the diode forward biased. Find the current. What if the battery is reversed?</p>
          <Given items={['V = 5 "V"', 'V _F = 0.7 "V"', 'R = 215 "Ω"']} />
          <ol className="steps">
            <Step title="Forward: the diode takes 0.7 V">
              <Eq src={['V _R = 5 − 0.7 = 4.3 "V"', 'I = [ V _R | R ] = [ 4.3 | 215 ] = 0.020 "A" = 20 "mA"']} />
            </Step>
            <Step title="Reversed">
              <p>The diode blocks. Only a leakage current of microamps flows, so the voltage across the resistor is negligible and nearly the whole 5 V falls across the diode.</p>
            </Step>
          </ol>
          <Answer>20 mA forward. In reverse the current is essentially zero, to within microamps.</Answer>
          <figure className="t-figure">
            <IVCurve title="The diode characteristic with a moving dot: above the knee the diode has a roughly fixed 0.7 volt drop and a large current" />
          </figure>
        </Example>

        <Example n={5} title="Half-wave and full-wave from the mains">
          <p className="ex-q">A transformer gives 12 V rms at 50 Hz. Find the d.c. output of a half-wave and of a full-wave rectifier (ideal diodes) and the ripple frequency of each. What current flows through a 100 Ω load?</p>
          <Given items={['V _rms = 12 "V"', 'f = 50 "Hz"', 'R = 100 "Ω"']} />
          <ol className="steps">
            <Step title="Peak voltage">
              <Eq src='V _m = √[ 2 ] · V _rms = 1.414 × 12 = 16.97 "V"' />
            </Step>
            <Step title="Half-wave">
              <Eq src={['V _dc = [ V _m | π ] = [ 16.97 | 3.142 ] = 5.40 "V"', 'I = [ 5.40 | 100 ] = 54 "mA"', 'f _out = 50 "Hz"']} />
            </Step>
            <Step title="Full-wave">
              <Eq src={['V _dc = [ 2 · V _m | π ] = [ 33.94 | 3.142 ] = 10.80 "V"', 'I = [ 10.80 | 100 ] = 108 "mA"', 'f _out = 2 · 50 = 100 "Hz"']} />
            </Step>
          </ol>
          <Answer>Half-wave: 5.40 V, 54 mA, ripple at 50 Hz. Full-wave: 10.80 V, 108 mA, ripple at 100 Hz. The full-wave circuit gives twice the output and a ripple that is easier to smooth.</Answer>
          <figure className="t-figure">
            <Rectifier mode="full" title="The bridge rectifier output with twice the frequency and twice the average of the half-wave circuit" />
          </figure>
        </Example>

        <Example n={6} title="Designing a Zener regulator">
          <p className="ex-q">A 5 V Zener diode regulates a supply of 10 V for a 500 Ω load. The Zener must carry at least 10 mA. Find the series resistor, the Zener current, and what happens if the load is removed. What is the smallest input voltage for which regulation still works?</p>
          <Given items={['V _in = 10 "V"', 'V _z = 5 "V"', 'R _L = 500 "Ω"', 'I _z = 10 "mA"']} />
          <ol className="steps">
            <Step title="Load current">
              <Eq src='I _L = [ V _z | R _L ] = [ 5 | 500 ] = 10 "mA"' />
            </Step>
            <Step title="Series resistor">
              <Eq src={['I _s = I _z + I _L = 10 + 10 = 20 "mA"', 'R _s = [ V _in − V _z | I _s ] = [ 5 | 0.020 ] = 250 "Ω"']} />
            </Step>
            <Step title="Load removed">
              <p>The source current is unchanged at 20 mA, and now all of it goes through the Zener:</p>
              <Eq src={['I _z = 20 "mA"', 'P _z = V _z · I _z = 5 × 0.020 = 0.10 "W"']} />
            </Step>
            <Step title="Lowest input">
              <p>Regulation stops when the Zener current falls to zero, so that <M>I _s = I _L = 10 "mA"</M>:</p>
              <Eq src='V _in = V _z + I _L · R _s = 5 + 0.010 × 250 = 7.5 "V"' />
            </Step>
          </ol>
          <Answer>Rs = 250 Ω. The Zener carries 10 mA with the load on and 20 mA (0.10 W) with it off, so its power rating must allow that. The input may fall as low as 7.5 V before the output sags.</Answer>
          <figure className="t-figure">
            <ZenerReg />
          </figure>
        </Example>

        <Example n={7} title="Running an LED from a battery">
          <p className="ex-q">A red LED needs 20 mA and drops 2.0 V when conducting. It is run from a 5 V supply. Find the series resistor, the power in it, and the wavelength of light if the band gap is 2.0 eV.</p>
          <Given items={['V _s = 5 "V"', 'V _F = 2.0 "V"', 'I = 20 "mA"', 'E _g = 2.0 "eV"']} />
          <ol className="steps">
            <Step title="Resistor">
              <Eq src='R = [ V _s − V _F | I ] = [ 5 − 2.0 | 0.020 ] = 150 "Ω"' />
            </Step>
            <Step title="Power in the resistor">
              <Eq src='P = I ^2 · R = 0.020 ^2 × 150 = 0.060 "W"' />
            </Step>
            <Step title="Wavelength">
              <Eq src='λ = [ 1240 | 2.0 ] = 620 "nm"' />
            </Step>
          </ol>
          <Answer>150 Ω, dissipating 0.06 W (the LED itself takes 0.04 W). The light is at 620 nm, orange-red.</Answer>
          <figure className="t-figure">
            <GapColour />
          </figure>
        </Example>

        <Example n={8} title="A solar panel">
          <p className="ex-q">A panel of area 1.6 m² has an efficiency of 20% in sunlight of intensity 1000 W/m². Find its output power, and the current when the output voltage is 40 V.</p>
          <Given items={['A = 1.6 "m²"', 'I _sun = 1000 "W/m²"', 'η = 0.20', 'V = 40 "V"']} />
          <ol className="steps">
            <Step title="Light power in">
              <Eq src='P _in = 1000 × 1.6 = 1600 "W"' />
            </Step>
            <Step title="Power out">
              <Eq src='P _out = η · P _in = 0.20 × 1600 = 320 "W"' />
            </Step>
            <Step title="Current">
              <Eq src='I = [ P _out | V ] = [ 320 | 40 ] = 8 "A"' />
            </Step>
          </ol>
          <Answer>320 W of electrical power, which at 40 V is 8 A. The other 1280 W of the sunlight is reflected or turned into heat.</Answer>
          <figure className="t-figure">
            <SolarCell />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="An n-type crystal carries a negative charge" wrong={'"n-type" = "negatively charged"'} fig={<Lattice mode="n" height={200} title="The donor atom gives up its spare electron and becomes a fixed positive ion, so the crystal as a whole stays neutral" />}>
            Every free electron comes from a donor atom that is left as a fixed <M>+</M> ion. The charges balance, so the crystal as a whole stays neutral. It simply has many free electrons.
          </Mistake>
          <Mistake title="A hole is a positive particle, like a proton" wrong={'"hole" = "a proton moving"'} fig={<Lattice mode="p" height={200} title="A hole is a missing bond electron; neighbouring electrons step into it one after another so the hole appears to move the other way" />}>
            A hole is an <em>absence</em> of an electron in a bond. Electrons hop into it one after another, so it moves the other way and acts like a positive charge. The atoms themselves do not move.
          </Mistake>
          <Mistake title="A diode conducts as soon as there is any forward voltage" wrong={'I > 0 "for any" V > 0'} fig={<IVCurve title="Almost no current flows until the forward voltage reaches the knee near 0.7 volts" />}>
            Below the knee voltage (0.7 V for silicon) the current is tiny, because the barrier is still too high. The diode starts to conduct properly only when the forward voltage nearly cancels the barrier.
          </Mistake>
          <Mistake title="Reverse bias means exactly zero current" wrong={'I = 0 "in reverse"'} fig={<Biased mode="reverse" title="With reverse bias the depletion region is wide and only a few minority carriers cross" />}>
            Minority carriers are swept across by the junction field, so a small leakage current does flow, in microamps or less. It hardly changes with the voltage until breakdown.
          </Mistake>
          <Mistake title="A bridge rectifier has the same ripple frequency as the supply" wrong={'f _out = f _in "(full wave)"'} fig={<Rectifier mode="full" title="The full-wave output has two humps for each cycle of the input" />}>
            A full-wave rectifier turns the negative half cycles over, so there are two humps for every cycle of the input. With 50 Hz mains the ripple is at 100 Hz. Only a half-wave circuit keeps the supply frequency.
          </Mistake>
          <Mistake title="A Zener regulates in forward bias" wrong={'"Zener works forward biased"'} fig={<IVCurve zener title="A Zener diode holds its voltage steady only in reverse, at the Zener voltage on the reverse side of the characteristic" />}>
            Forward biased, a Zener is an ordinary diode and drops about 0.7 V. The regulating action is in <em>reverse</em> breakdown, where the voltage stays near <M>V _z</M> over a wide range of current.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Add a pinch of impurity, join two kinds, and the crystal learns to point current one way.</p>
        <p className="closing-sub">That one-way junction, together with light and a little doping, is the starting point of every computer, display and solar panel.</p>
      </footer>
    </ChapterShell>
  );
}
