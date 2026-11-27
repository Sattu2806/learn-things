import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Generator, GridLoss, ImpedanceTriangle, LcOscillator, LcSpring, LcrPhasor, MeanZero, PhasorBasic, PhasorPair, PowerWave, ReactanceF, ResonanceCurve, ResonancePhases, Rms, Slope, Transformer, TransformerDC } from './AcAnims';

/** Alternating current: rms values, phasors, R, L and C, the LCR circuit, resonance, power, LC oscillations and the transformer. */

const SECTIONS: NoteSection[] = [
  { id: 'source', title: 'An alternating voltage', group: 'Theory' },
  { id: 'rms', title: 'Peak and rms values', group: 'Theory' },
  { id: 'phasor', title: 'Phasors', group: 'Theory' },
  { id: 'resistor', title: 'A resistor on ac', group: 'Theory' },
  { id: 'inductor', title: 'An inductor on ac', group: 'Theory' },
  { id: 'capacitor', title: 'A capacitor on ac', group: 'Theory' },
  { id: 'series', title: 'The series LCR circuit', group: 'Theory' },
  { id: 'resonance', title: 'Resonance', group: 'Theory' },
  { id: 'power', title: 'Power and the power factor', group: 'Theory' },
  { id: 'lc', title: 'LC oscillations', group: 'Theory' },
  { id: 'transformer', title: 'The transformer', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="ac" film={buildFilm} sections={SECTIONS} sideTitle="Alternating current" sideLead="The current in the wall socket swings back and forth fifty times a second. How coils, capacitors and resistors answer it, and how a transformer changes its voltage.">
      <header className="article-head">
        <span className="kicker">Physics · Alternating current</span>
        <h1 className="article-title">Why does the current in your wall socket keep reversing?</h1>
        <p className="article-lead">A battery pushes charge one way. A generator pushes it back and forth, and that turns out to be far more useful: it lets coils, capacitors and transformers do things that steady current cannot. This chapter follows an alternating voltage through each part of a circuit.</p>
      </header>

      <section className="t-section" id="t-source">
        <SectionHead n={no('source')} title="An alternating voltage" />
        <p>
          Turn a coil of <M>N</M> turns and area <M>A</M> at a steady angular speed <M>ω</M> in a magnetic field <M>B</M>. The flux through it is biggest when the coil faces the field and zero when it is edge-on:
        </p>
        <Eq src='Φ = N · B · A · cos ( ω · t )' />
        <p>By Faraday's law, the emf is minus the rate of change of the flux:</p>
        <Eq src={['ε = − [ dΦ | dt ]', 'ε = N · B · A · ω · sin ( ω · t )']} />
        <figure className="t-figure">
          <Generator />
          <figcaption>The emf is biggest when the coil sweeps fastest through the field lines, which is when the flux is zero. The flux and the emf are a quarter of a cycle apart.</figcaption>
        </figure>
        <p>
          The biggest value of the emf is the <strong>peak</strong> value <M>V _0 = N · B · A · ω</M>. So an <strong>alternating voltage</strong> and the current it drives are
        </p>
        <Eq src={['v = V _0 · sin ( ω · t )', 'i = I _0 · sin ( ω · t )']} />
        <p>
          The angular frequency is <M>ω = 2 · π · f</M>. Mains supply in India and Europe has <M>f = 50 "Hz"</M>, so <M>ω = 100 · π ≈ 314 "rad/s"</M> and the current reverses direction 100 times every second.
        </p>
      </section>

      <section className="t-section" id="t-rms">
        <SectionHead n={no('rms')} title="Peak and rms values" />
        <p>
          The average of an alternating current over a whole cycle is zero, since the positive half cancels the negative half. That tells us nothing about its heating effect, which does not care about direction. So we ask for the steady current that would heat a resistor just as much. Start with the power in a resistor <M>R</M>:
        </p>
        <Eq src='p = i ^2 · R = I _0 ^2 · R · sin ^2 ( ω · t )' />
        <p>
          Use the identity <M>sin ^2 θ = [ 1 − cos ( 2 · θ ) | 2 ]</M>. Over a whole cycle the term <M>cos ( 2 · ω · t )</M> averages to zero, so the average of <M>sin ^2</M> is exactly one half:
        </p>
        <Eq src={['p _avg = I _0 ^2 · R · [ 1 | 2 ]', 'p _avg = I _rms ^2 · R']} />
        <p>Comparing the two lines defines the <strong>root-mean-square</strong> current: square it, take the mean, then take the root.</p>
        <Eq src={['I _rms = √[ [ I _0 ^2 | 2 ] ] = [ I _0 | √[ 2 ] ] ≈ 0.707 · I _0', 'V _rms = [ V _0 | √[ 2 ] ] ≈ 0.707 · V _0']} />
        <figure className="t-figure">
          <Rms />
          <figcaption>The current squared swings between zero and its peak, but its average sits halfway. The lamp on steady rms current glows as brightly as the flickering one, on average.</figcaption>
        </figure>
        <p>
          Meters and the numbers on appliances are rms values. A "220 V" supply has a peak voltage of <M>220 · √[ 2 ] = 311 "V"</M>.
        </p>
        <figure className="t-figure">
          <MeanZero />
          <figcaption>Zero average, yet a definite rms size. The dashed lines mark the rms level on either side.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-phasor">
        <SectionHead n={no('phasor')} title="Phasors" />
        <p>
          Adding sine waves with different phases is messy. The same trick as in oscillations makes it easy. Picture an arrow of length <M>V _0</M> turning anticlockwise at <M>ω</M>. Its height at any instant is <M>V _0 · sin ( ω · t )</M>, which is exactly the voltage. This turning arrow is a <strong>phasor</strong>.
        </p>
        <figure className="t-figure">
          <PhasorBasic />
          <figcaption>The shadow of the turning arrow on the vertical axis traces out the sine wave.</figcaption>
        </figure>
        <p>
          Two quantities with the same frequency become two arrows turning together, with a fixed angle between them. That angle is their <strong>phase difference</strong>. The one that is ahead in the anticlockwise sense is said to <em>lead</em>. Adding the waves is now adding the arrows like vectors.
        </p>
      </section>

      <section className="t-section" id="t-resistor">
        <SectionHead n={no('resistor')} title="A resistor on ac" />
        <p>Connect a resistor <M>R</M> across <M>v = V _0 · sin ( ω · t )</M>. Ohm's law holds at every instant:</p>
        <Eq src={['i = [ v | R ] = [ V _0 | R ] · sin ( ω · t )', 'I _0 = [ V _0 | R ]']} />
        <p>The current rises and falls exactly with the voltage: they are <strong>in phase</strong>, and the two phasors lie along each other.</p>
        <figure className="t-figure">
          <PhasorPair title="Voltage and current phasors for a resistor turn together, and the two waves rise and fall in step" phi={0} name="resistor" />
          <figcaption>No phase difference. The average power is <M>V _rms · I _rms</M>.</figcaption>
        </figure>
        <Eq src='P = I _rms ^2 · R = V _rms · I _rms = [ V _rms ^2 | R ]' />
      </section>

      <section className="t-section" id="t-inductor">
        <SectionHead n={no('inductor')} title="An inductor on ac" />
        <p>
          A coil of inductance <M>L</M> opposes any change of current with a back emf <M>− L · di / dt</M>. With a source <M>v</M> across an ideal coil, the voltage of the source must cancel this back emf, so
        </p>
        <Eq src={['v = L · [ di | dt ]', '[ di | dt ] = [ V _0 | L ] · sin ( ω · t )']} />
        <p>Adding up the small changes in <M>i</M> (integrating) gives the current:</p>
        <Eq src={['i = − [ V _0 | ω · L ] · cos ( ω · t )', 'i = [ V _0 | ω · L ] · sin ( ω · t − [ π | 2 ] )']} />
        <figure className="t-figure">
          <Slope title="The voltage across a coil is proportional to the slope of the current curve, so it is largest where the current is changing fastest" top="i" bottom="v = L di / dt" />
          <figcaption>Where the current curve is steepest the voltage is at its peak; where the current is momentarily flat, the voltage is zero.</figcaption>
        </figure>
        <p>
          The peak current is <M>I _0 = V _0 / ( ω · L )</M>. The quantity <M>ω · L</M> plays the role of a resistance and is called the <strong>inductive reactance</strong>:
        </p>
        <Eq src='X _L = ω · L = 2 · π · f · L' />
        <p>
          It is measured in ohms, and it grows with frequency: a coil lets slow changes through and resists fast ones. At <M>f = 0</M> (steady dc) it is zero. Here the current <strong>lags</strong> the voltage by <M>π / 2</M>.
        </p>
        <figure className="t-figure">
          <PhasorPair title="For an inductor the current phasor trails the voltage phasor by a quarter turn, so the current wave peaks a quarter of a cycle later" phi={Math.PI / 2} name="inductor: i lags v" />
          <figcaption>The current peaks a quarter cycle after the voltage.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-capacitor">
        <SectionHead n={no('capacitor')} title="A capacitor on ac" />
        <p>
          A capacitor <M>C</M> holding charge <M>q</M> has voltage <M>v = q / C</M>. Current is the rate at which the charge flows on, so
        </p>
        <Eq src={['q = C · v = C · V _0 · sin ( ω · t )', 'i = [ dq | dt ] = ω · C · V _0 · cos ( ω · t )', 'i = ω · C · V _0 · sin ( ω · t + [ π | 2 ] )']} />
        <figure className="t-figure">
          <Slope title="The current into a capacitor is proportional to the slope of its voltage curve, so the current is largest when the voltage is changing fastest" top="v" bottom="i = C dv / dt" />
          <figcaption>The current is the slope of the voltage curve (times <M>C</M>). It is biggest when the capacitor is empty and filling fastest.</figcaption>
        </figure>
        <p>
          The peak current is <M>I _0 = V _0 · ω · C = V _0 / X _C</M>, with the <strong>capacitive reactance</strong>
        </p>
        <Eq src='X _C = [ 1 | ω · C ] = [ 1 | 2 · π · f · C ]' />
        <p>
          It falls as the frequency rises: a capacitor blocks steady dc (<M>f = 0</M> gives an infinite reactance) and passes fast changes easily. The current <strong>leads</strong> the voltage by <M>π / 2</M>.
        </p>
        <figure className="t-figure">
          <PhasorPair title="For a capacitor the current phasor is a quarter turn ahead of the voltage phasor, so the current wave peaks a quarter cycle earlier" phi={-Math.PI / 2} name="capacitor: i leads v" />
          <figcaption>The current peaks a quarter cycle before the voltage.</figcaption>
        </figure>
        <Note label="To remember">In a capacitor the current leads the voltage; in an inductor the voltage leads the current. Together: <strong>CIVIL</strong> (C: I before V; L: V before I).</Note>
        <figure className="t-figure">
          <ReactanceF />
          <figcaption>As the frequency sweeps up, the inductor line climbs and the capacitor curve drops. They cross at the frequency <M>f _0</M>.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-series">
        <SectionHead n={no('series')} title="The series LCR circuit" />
        <p>
          Put <M>R</M>, <M>L</M> and <M>C</M> in series across <M>v = V _0 · sin ( ω · t )</M>. The same current <M>i = I _0 · sin ( ω · t − φ )</M> runs through all three. The voltages across them, as phasors relative to the current, are:
        </p>
        <Eq src={['V _R = I · R "(along the current)"', 'V _L = I · X _L "(a quarter turn ahead)"', 'V _C = I · X _C "(a quarter turn behind)"']} />
        <p>
          The source voltage is their phasor sum. <M>V _L</M> and <M>V _C</M> point in opposite directions, so they partly cancel to leave <M>V _L − V _C</M> at right angles to <M>V _R</M>. Pythagoras gives the total:
        </p>
        <Eq src={['V _0 ^2 = V _R ^2 + ( V _L − V _C ) ^2', 'V _0 ^2 = I _0 ^2 · ( R ^2 + ( X _L − X _C ) ^2 )']} />
        <figure className="t-figure">
          <LcrPhasor />
          <figcaption>
            Drawn for <M>V _R = 60</M>, <M>V _L = 180</M>, <M>V _C = 100</M> (volts). The turning diagram shows the source voltage ahead of the current by <M>53°</M>. Note that <M>V _L</M> is larger than the source!
          </figcaption>
        </figure>
        <p>
          Dividing by <M>I _0</M> defines the <strong>impedance</strong> <M>Z</M>, the total opposition to the current, and the phase angle comes from the triangle:
        </p>
        <Eq src={['Z = [ V _0 | I _0 ] = √[ R ^2 + ( X _L − X _C ) ^2 ]', 'Z = √[ R ^2 + ( ω · L − [ 1 | ω · C ] ) ^2 ]', 'tan φ = [ X _L − X _C | R ]']} />
        <figure className="t-figure">
          <ImpedanceTriangle />
          <figcaption>R lies flat and the net reactance points up (inductive) or down (capacitive). The hypotenuse is Z.</figcaption>
        </figure>
        <p>
          If <M>X _L &gt; X _C</M> the circuit is <strong>inductive</strong>: <M>φ</M> is positive and the voltage leads the current. If <M>X _C &gt; X _L</M> it is <strong>capacitive</strong> and the current leads. Then <M>I _0 = V _0 / Z</M>, and the rms form is the same: <M>I _rms = V _rms / Z</M>.
        </p>
      </section>

      <section className="t-section" id="t-resonance">
        <SectionHead n={no('resonance')} title="Resonance" />
        <p>
          Vary the frequency of the source. <M>X _L</M> grows and <M>X _C</M> shrinks, and at one frequency they are equal. There the two voltages cancel completely, the impedance is as small as it can be, and the current is as big as it can be:
        </p>
        <Eq src={['X _L = X _C', 'ω _0 · L = [ 1 | ω _0 · C ]', 'ω _0 ^2 = [ 1 | L · C ]', 'ω _0 = [ 1 | √[ L · C ] ] ,  f _0 = [ 1 | 2 · π · √[ L · C ] ]']} />
        <p>
          At <M>ω _0</M> the impedance is <M>Z = R</M>, the current is <M>I _0 = V _0 / R</M> and the phase angle is zero. Above or below it the current falls.
        </p>
        <figure className="t-figure">
          <ResonancePhases />
          <figcaption>Below resonance the capacitor wins and the current leads. Above it the coil wins and the current lags. At resonance the circuit behaves like a bare resistor.</figcaption>
        </figure>
        <h3 className="t-h3">How sharp is the peak?</h3>
        <p>
          The smaller the resistance, the taller and narrower the peak. The <strong>half-power points</strong> are where the power falls to half, that is where the current is <M>I _max / √[ 2 ]</M>. They lie at <M>ω _0 ± R / ( 2 · L )</M>, so the <strong>bandwidth</strong> is <M>Δω = R / L</M>. The <strong>quality factor</strong> measures sharpness:
        </p>
        <Eq src={['Q = [ ω _0 · L | R ] = [ 1 | ω _0 · C · R ] = [ 1 | R ] · √[ [ L | C ] ]', 'Q = [ ω _0 | Δω ]']} />
        <figure className="t-figure">
          <ResonanceCurve />
          <figcaption>The dot sweeps along the curve. A high <M>Q</M> (small <M>R</M>) gives a tall narrow peak, so a radio can pick one station and reject its neighbours.</figcaption>
        </figure>
        <p>
          At resonance the voltage across the coil (and across the capacitor) is <M>Q</M> times the source voltage. Tuning a radio means changing <M>C</M> until <M>f _0</M> matches the station you want.
        </p>
      </section>

      <section className="t-section" id="t-power">
        <SectionHead n={no('power')} title="Power and the power factor" />
        <p>Take <M>v = V _0 · sin ( ω · t )</M> and <M>i = I _0 · sin ( ω · t − φ )</M>. The power at each instant is their product. Use <M>sin A · sin B = [ 1 | 2 ] · ( cos ( A − B ) − cos ( A + B ) )</M>:</p>
        <Eq src={['p = v · i = V _0 · I _0 · sin ( ω · t ) · sin ( ω · t − φ )', 'p = [ 1 | 2 ] · V _0 · I _0 · ( cos φ − cos ( 2 · ω · t − φ ) )']} />
        <p>
          The second term swings equally above and below zero and averages to nothing. Only the steady first term remains:
        </p>
        <Eq src={['P = [ 1 | 2 ] · V _0 · I _0 · cos φ', 'P = V _rms · I _rms · cos φ']} />
        <p>
          The factor <M>cos φ</M> is the <strong>power factor</strong>. From the triangle, <M>cos φ = R / Z</M>. If the current and voltage are in phase, <M>cos φ = 1</M> and all the power is used. When the phase angle is <M>90°</M>, the power drawn from the supply in one part of the cycle is exactly returned in the next, and the average is zero.
        </p>
        <figure className="t-figure">
          <PowerWave title="The instantaneous power for three phase angles; the area above the axis shrinks and the average power falls as the phase angle grows" phis={[0, 60, 90]} />
          <figcaption>For <M>φ = 90°</M> the power is positive and negative in equal parts: energy goes into the field and comes back, and the average is zero.</figcaption>
        </figure>
        <p>
          A pure inductor or capacitor (<M>φ = ± 90°</M>) therefore uses no power, even though a current flows. That current is called a <strong>wattless current</strong>. Only the resistance dissipates energy: <M>P = I _rms ^2 · R</M>. At resonance <M>cos φ = 1</M>.
        </p>
      </section>

      <section className="t-section" id="t-lc">
        <SectionHead n={no('lc')} title="LC oscillations" />
        <p>
          Charge a capacitor and connect it across a coil, with no resistor. The capacitor drives a current through the coil, the coil resists the change, and the current keeps going until the capacitor has been charged the other way. Then it all happens in reverse. Apply the loop rule with <M>i = dq / dt</M>:
        </p>
        <Eq src={['L · [ di | dt ] + [ q | C ] = 0', '[ d ^2 q | dt ^2 ] = − [ 1 | L · C ] · q']} />
        <p>
          This is the equation of simple harmonic motion with <M>ω ^2 = 1 / ( L · C )</M>, so
        </p>
        <Eq src={['ω _0 = [ 1 | √[ L · C ] ]', 'q = q _0 · cos ( ω _0 · t )', 'i = − q _0 · ω _0 · sin ( ω _0 · t )']} />
        <p>The energy is shared between the electric field of the capacitor and the magnetic field of the coil:</p>
        <Eq src={['U _E = [ q ^2 | 2 · C ] = [ q _0 ^2 | 2 · C ] · cos ^2 ( ω _0 · t )', 'U _B = [ 1 | 2 ] · L · i ^2 = [ q _0 ^2 | 2 · C ] · sin ^2 ( ω _0 · t )', 'U = U _E + U _B = [ q _0 ^2 | 2 · C ]']} />
        <p>For <M>U _B</M> we used <M>L · ω _0 ^2 = 1 / C</M>. The total is constant.</p>
        <figure className="t-figure">
          <LcOscillator />
          <figcaption>The dots show the charge flowing round the loop, fastest when the capacitor is empty. The glow around the coil is the magnetic energy, which peaks at that moment.</figcaption>
        </figure>
        <p>
          This is the same mathematics as the block on a spring. The charge is the displacement, the current is the velocity, the inductance (opposing change) is the mass, and <M>1 / C</M> is the spring constant.
        </p>
        <figure className="t-figure">
          <LcSpring />
          <figcaption>Block and circuit move in step; the electrical energy is the spring's stored energy and the magnetic energy is the block's kinetic energy.</figcaption>
        </figure>
        <p>A real circuit has some resistance, which turns energy into heat, so the oscillations die away just as a damped spring does.</p>
      </section>

      <section className="t-section" id="t-transformer">
        <SectionHead n={no('transformer')} title="The transformer" />
        <p>
          Two coils are wound on a common iron core. An alternating voltage on the <strong>primary</strong> (<M>N _p</M> turns) makes an alternating flux in the core, and nearly all of it threads the <strong>secondary</strong> (<M>N _s</M> turns). The same flux change passes through every turn of both coils, so each turn has the same emf:
        </p>
        <Eq src={['V _p = N _p · [ dΦ | dt ]', 'V _s = N _s · [ dΦ | dt ]', '[ V _s | V _p ] = [ N _s | N _p ]']} />
        <figure className="t-figure">
          <Transformer np={10} ns={5} title="An alternating primary current makes flux surge back and forth in the iron core and the secondary voltage is half as large because it has half the turns" />
          <figcaption>With half the turns, the secondary voltage is half the primary voltage. The flux in the core pulses with the primary current.</figcaption>
        </figure>
        <p>
          If <M>N _s &gt; N _p</M> the transformer is a <strong>step-up</strong>; if <M>N _s &lt; N _p</M> it is a <strong>step-down</strong>. For an ideal one, with no loss of power, the power out equals the power in:
        </p>
        <Eq src={['V _p · I _p = V _s · I _s', '[ I _p | I _s ] = [ V _s | V _p ] = [ N _s | N _p ]']} />
        <p>A transformer that steps the voltage up steps the current down by the same factor. It does not create energy.</p>
        <p>
          Real transformers waste a little energy: in the heating of the windings (<M>I ^2 · R</M>), in <strong>eddy currents</strong> in the iron (cured by building the core from thin insulated sheets), in <strong>hysteresis</strong> of the iron as it is magnetised back and forth, and in <strong>flux leakage</strong>. Good ones reach more than 95% efficiency.
        </p>
        <figure className="t-figure">
          <TransformerDC />
          <figcaption>A transformer needs a changing flux. Steady dc gives steady flux and no secondary voltage, except for a brief spike when the current starts.</figcaption>
        </figure>
        <h3 className="t-h3">Why power is sent at high voltage</h3>
        <p>
          A power station delivers a power <M>P = V · I</M> along cables of resistance <M>R</M>. The heat wasted in the cables is
        </p>
        <Eq src={['I = [ P | V ]', 'P _loss = I ^2 · R = [ P ^2 · R | V ^2 ]']} />
        <p>
          Ten times the voltage means a hundred times less loss. So transformers step the voltage up for the long journey and step it down again for the home.
        </p>
        <figure className="t-figure">
          <GridLoss />
          <figcaption>The glow along the wire is the heat loss. The same power at higher voltage needs a far smaller current, so the wire stays cool.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Alternating voltage and current', 'v = V _0 · sin ( ω · t ) ,  i = I _0 · sin ( ω · t − φ )'],
                  ['Generator peak emf', 'V _0 = N · B · A · ω'],
                  ['Root-mean-square values', 'I _rms = [ I _0 | √[ 2 ] ] ,  V _rms = [ V _0 | √[ 2 ] ]'],
                  ['Resistor', 'I _0 = [ V _0 | R ] ,  φ = 0'],
                  ['Inductive reactance', 'X _L = ω · L = 2 · π · f · L'],
                  ['Capacitive reactance', 'X _C = [ 1 | ω · C ]'],
                  ['Impedance (series LCR)', 'Z = √[ R ^2 + ( X _L − X _C ) ^2 ]'],
                  ['Phase angle', 'tan φ = [ X _L − X _C | R ]'],
                  ['Ohm’s law for ac', 'V _rms = I _rms · Z'],
                  ['Resonant frequency', 'ω _0 = [ 1 | √[ L · C ] ]'],
                  ['Quality factor', 'Q = [ ω _0 · L | R ] = [ ω _0 | Δω ]'],
                  ['Bandwidth', 'Δω = [ R | L ]'],
                  ['Average power', 'P = V _rms · I _rms · cos φ'],
                  ['Power factor', 'cos φ = [ R | Z ]'],
                  ['LC oscillation', 'ω _0 = [ 1 | √[ L · C ] ] ,  U = [ q _0 ^2 | 2 · C ]'],
                  ['Transformer', '[ V _s | V _p ] = [ N _s | N _p ] = [ I _p | I _s ]'],
                  ['Cable loss', 'P _loss = I ^2 · R'],
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
                  ['V', 'Voltage (peak: V₀, rms: V_rms)', 'V'],
                  ['I', 'Current (peak: I₀, rms: I_rms)', 'A'],
                  ['ω', 'Angular frequency', 'rad/s'],
                  ['X', 'Reactance (X_L or X_C)', 'Ω'],
                  ['Z', 'Impedance', 'Ω'],
                  ['φ', 'Phase angle between v and i', 'rad'],
                  ['L', 'Inductance', 'H'],
                  ['C', 'Capacitance', 'F'],
                  ['Q', 'Quality factor', 'none'],
                  ['P', 'Average power', 'W'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{['V', 'A', 'rad/s', 'Ω', 'rad', 'H', 'F', 'W'].includes(unit) ? <M>{`"${unit}"`}</M> : unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="The mains supply">
          <p className="ex-q">The mains supply is 220 V rms at 50 Hz. Find the peak voltage and the angular frequency, and write down the voltage at <M>t = 2.5 "ms"</M>.</p>
          <Given items={['V _rms = 220 "V"', 'f = 50 "Hz"']} />
          <ol className="steps">
            <Step title="Peak voltage">
              <Eq src='V _0 = V _rms · √[ 2 ] = 220 · 1.414 = 311 "V"' />
            </Step>
            <Step title="Angular frequency">
              <Eq src='ω = 2 · π · f = 2 · π · 50 = 314 "rad/s"' />
            </Step>
            <Step title="Voltage at 2.5 ms">
              <Eq src={['ω · t = 314 · 0.0025 = 0.785 "rad" = 45°', 'v = 311 · sin 45° = 311 · 0.707 = 220 "V"']} />
            </Step>
          </ol>
          <Answer>The peak is 311 V and ω = 314 rad/s. At 2.5 ms the phase is 45° and the instantaneous voltage happens to equal the rms value, 220 V.</Answer>
          <figure className="t-figure">
            <Rms />
          </figure>
        </Example>

        <Example n={2} title="An electric heater">
          <p className="ex-q">A heater of resistance 48.4 Ω is connected to the 220 V rms mains. Find the rms and peak current, the average power and the peak power.</p>
          <Given items={['R = 48.4 "Ω"', 'V _rms = 220 "V"']} />
          <ol className="steps">
            <Step title="rms current">
              <Eq src='I _rms = [ V _rms | R ] = [ 220 | 48.4 ] = 4.55 "A"' />
            </Step>
            <Step title="Peak current">
              <Eq src='I _0 = I _rms · √[ 2 ] = 4.55 · 1.414 = 6.43 "A"' />
            </Step>
            <Step title="Average power">
              <Eq src='P = V _rms · I _rms = 220 · 4.55 = 1000 "W"' />
            </Step>
            <Step title="Peak power">
              <Eq src='P _peak = V _0 · I _0 = 311 · 6.43 = 2000 "W"' />
            </Step>
          </ol>
          <Answer>4.55 A rms (6.43 A peak). The heater averages 1000 W, which is half of its 2000 W peak, as it must be since the average of <M>sin ^2</M> is one half.</Answer>
          <figure className="t-figure">
            <PowerWave title="For a resistor the voltage, current and power are in step, and the power never goes below zero" phis={[0]} />
          </figure>
        </Example>

        <Example n={3} title="A coil and a capacitor on the mains">
          <p className="ex-q">A 0.1 H coil and, separately, a 50 µF capacitor are connected to the 220 V, 50 Hz mains. Find the reactance of each and the rms current. What happens to the reactances at 100 Hz?</p>
          <Given items={['L = 0.1 "H"', 'C = 50 "µF"', 'V _rms = 220 "V"', 'f = 50 "Hz"']} />
          <ol className="steps">
            <Step title="The coil">
              <Eq src={['X _L = 2 · π · f · L = 2 · π · 50 · 0.1 = 31.4 "Ω"', 'I _rms = [ V _rms | X _L ] = [ 220 | 31.4 ] = 7.00 "A"']} />
            </Step>
            <Step title="The capacitor">
              <Eq src={['X _C = [ 1 | 2 · π · f · C ] = [ 1 | 2 · π · 50 · 50 × 10 ^−6 ] = 63.7 "Ω"', 'I _rms = [ 220 | 63.7 ] = 3.46 "A"']} />
            </Step>
            <Step title="At 100 Hz">
              <Eq src={['X _L = 62.8 "Ω" ,  X _C = 31.8 "Ω"']} />
            </Step>
          </ol>
          <Answer>The coil has 31.4 Ω and passes 7.00 A (lagging the voltage). The capacitor has 63.7 Ω and passes 3.46 A (leading). Doubling the frequency doubles the coil reactance and halves the capacitor reactance.</Answer>
          <figure className="t-figure">
            <ReactanceF />
          </figure>
        </Example>

        <Example n={4} title="A series LCR circuit">
          <p className="ex-q">A 30 Ω resistor, a 0.09 H coil and a 20 µF capacitor are in series across a 100 V rms supply with <M>ω = 1000 "rad/s"</M>. Find the impedance, the current, the voltage across each element, the phase angle and the average power.</p>
          <Given items={['R = 30 "Ω"', 'L = 0.09 "H"', 'C = 20 "µF"', 'V _rms = 100 "V"', 'ω = 1000 "rad/s"']} />
          <ol className="steps">
            <Step title="Reactances">
              <Eq src={['X _L = ω · L = 1000 · 0.09 = 90 "Ω"', 'X _C = [ 1 | ω · C ] = [ 1 | 1000 · 20 × 10 ^−6 ] = 50 "Ω"']} />
            </Step>
            <Step title="Impedance and current">
              <Eq src={['Z = √[ 30 ^2 + ( 90 − 50 ) ^2 ] = √[ 900 + 1600 ] = 50 "Ω"', 'I _rms = [ V _rms | Z ] = [ 100 | 50 ] = 2 "A"']} />
            </Step>
            <Step title="Voltage across each element">
              <Eq src={['V _R = I · R = 2 · 30 = 60 "V"', 'V _L = I · X _L = 2 · 90 = 180 "V"', 'V _C = I · X _C = 2 · 50 = 100 "V"']} />
              <p>Check: <M>√[ 60 ^2 + ( 180 − 100 ) ^2 ] = √[ 3600 + 6400 ] = 100 "V"</M>.</p>
            </Step>
            <Step title="Phase angle">
              <Eq src='tan φ = [ 90 − 50 | 30 ] = [ 4 | 3 ] ,  φ = 53.1°' />
            </Step>
            <Step title="Average power">
              <Eq src={['cos φ = [ R | Z ] = [ 30 | 50 ] = 0.6', 'P = V _rms · I _rms · cos φ = 100 · 2 · 0.6 = 120 "W"', 'P = I ^2 · R = 2 ^2 · 30 = 120 "W"']} />
            </Step>
          </ol>
          <Answer>Z = 50 Ω and I = 2 A. The voltages are 60 V, 180 V and 100 V, so the coil voltage is larger than the supply. The circuit is inductive, with the voltage leading the current by 53.1°. The power is 120 W, all of it in the resistor.</Answer>
          <figure className="t-figure">
            <LcrPhasor />
          </figure>
        </Example>

        <Example n={5} title="Tuning to resonance">
          <p className="ex-q">A series circuit has <M>R = 10 "Ω"</M>, <M>L = 0.1 "H"</M> and <M>C = 10 "µF"</M>. Find the resonant frequency, the quality factor, the bandwidth, and the current and the coil voltage when a 20 V rms source is tuned to resonance.</p>
          <Given items={['R = 10 "Ω"', 'L = 0.1 "H"', 'C = 10 "µF"', 'V _rms = 20 "V"']} />
          <ol className="steps">
            <Step title="Resonant frequency">
              <Eq src={['ω _0 = [ 1 | √[ L · C ] ] = [ 1 | √[ 0.1 · 10 × 10 ^−6 ] ] = [ 1 | 0.001 ] = 1000 "rad/s"', 'f _0 = [ ω _0 | 2 · π ] = 159 "Hz"']} />
            </Step>
            <Step title="Quality factor and bandwidth">
              <Eq src={['Q = [ ω _0 · L | R ] = [ 1000 · 0.1 | 10 ] = 10', 'Δω = [ R | L ] = [ 10 | 0.1 ] = 100 "rad/s"']} />
            </Step>
            <Step title="Current at resonance">
              <Eq src='I _rms = [ V _rms | R ] = [ 20 | 10 ] = 2 "A"' />
            </Step>
            <Step title="Coil voltage">
              <Eq src='V _L = I · ω _0 · L = 2 · 1000 · 0.1 = 200 "V" = Q · V _rms' />
            </Step>
          </ol>
          <Answer>f₀ = 159 Hz, <M>Q = 10</M>, a bandwidth of 100 rad/s (the current is within 70% of its peak from 950 to 1050 rad/s). At resonance 2 A flows and the coil, and the capacitor, each have 200 V across them, ten times the supply.</Answer>
          <figure className="t-figure">
            <ResonanceCurve />
          </figure>
        </Example>

        <Example n={6} title="An LC circuit">
          <p className="ex-q">A 10 µF capacitor charged to 10 V is connected across a 10 mH coil. Find the oscillation frequency, the total energy and the biggest current.</p>
          <Given items={['C = 10 "µF"', 'L = 10 "mH"', 'V = 10 "V"']} />
          <ol className="steps">
            <Step title="Frequency">
              <Eq src={['ω _0 = [ 1 | √[ L · C ] ] = [ 1 | √[ 0.01 · 10 × 10 ^−6 ] ] = 3162 "rad/s"', 'f _0 = [ 3162 | 2 · π ] = 503 "Hz"']} />
            </Step>
            <Step title="Energy">
              <Eq src='U = [ 1 | 2 ] · C · V ^2 = [ 1 | 2 ] · 10 × 10 ^−6 · 10 ^2 = 5.0 × 10 ^−4 "J"' />
            </Step>
            <Step title="Biggest current (all energy in the coil)">
              <Eq src={['[ 1 | 2 ] · L · I _max ^2 = U', 'I _max = √[ [ 2 · U | L ] ] = √[ [ 2 · 5 × 10 ^−4 | 0.01 ] ] = 0.316 "A"']} />
            </Step>
          </ol>
          <Answer>503 Hz, a total of 0.50 mJ, which swings between the capacitor and coil, and a peak current of 0.316 A, reached when the capacitor is empty.</Answer>
          <figure className="t-figure">
            <LcOscillator />
          </figure>
        </Example>

        <Example n={7} title="A step-down transformer">
          <p className="ex-q">A transformer steps 4400 V down to 220 V and has 2000 turns on the primary. It delivers 2.2 kW to a load. Find the turns on the secondary and the currents, taking it to be ideal.</p>
          <Given items={['V _p = 4400 "V"', 'V _s = 220 "V"', 'N _p = 2000', 'P = 2200 "W"']} />
          <ol className="steps">
            <Step title="Turns on the secondary">
              <Eq src='N _s = N _p · [ V _s | V _p ] = 2000 · [ 220 | 4400 ] = 100' />
            </Step>
            <Step title="Secondary current">
              <Eq src='I _s = [ P | V _s ] = [ 2200 | 220 ] = 10 "A"' />
            </Step>
            <Step title="Primary current">
              <Eq src='I _p = [ P | V _p ] = [ 2200 | 4400 ] = 0.5 "A"' />
              <p>Check with the turns ratio: <M>I _p = I _s · N _s / N _p = 10 · 100 / 2000 = 0.5 "A"</M>.</p>
            </Step>
          </ol>
          <Answer>The secondary has 100 turns. The voltage goes down by 20 times and the current goes up by 20 times: 10 A on the low-voltage side and 0.5 A on the primary.</Answer>
          <figure className="t-figure">
            <Transformer np={10} ns={1} labels={['primary: 2000 turns', 'secondary: 100 turns']} title="A step-down transformer with twenty times more turns on the primary than the secondary" />
          </figure>
        </Example>

        <Example n={8} title="Sending power over a long cable">
          <p className="ex-q">A power of 100 kW is sent along a cable of total resistance 2 Ω. Compare the loss when it is sent at 2000 V and at 20 000 V.</p>
          <Given items={['P = 100000 "W"', 'R = 2 "Ω"', 'V _1 = 2000 "V"', 'V _2 = 20000 "V"']} />
          <ol className="steps">
            <Step title="At 2000 V">
              <Eq src={['I = [ P | V ] = [ 100000 | 2000 ] = 50 "A"', 'P _loss = I ^2 · R = 50 ^2 · 2 = 5000 "W"']} />
            </Step>
            <Step title="At 20 000 V">
              <Eq src={['I = [ 100000 | 20000 ] = 5 "A"', 'P _loss = 5 ^2 · 2 = 50 "W"']} />
            </Step>
          </ol>
          <Answer>5 kW (5% of the power) is lost at 2000 V, but only 50 W (0.05%) at 20 000 V: ten times the voltage, a hundred times less loss.</Answer>
          <figure className="t-figure">
            <GridLoss />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Dividing the peak by 2" wrong="I _rms = [ I _0 | 2 ]" fig={<Rms height={190} title="The mean of the current squared is half the peak squared, so the rms current is the peak divided by root two" />}>
            The mean of <M>i ^2</M> is <M>I _0 ^2 / 2</M>, and the root of that is <M>I _0 / √[ 2 ]</M>, about 0.707 of the peak, not 0.5.
          </Mistake>
          <Mistake title="The rms value is the average" wrong={'I _rms = "average of i"'} fig={<MeanZero height={170} />}>
            The plain average of an alternating current over a cycle is zero. The rms value is the root of the average of the <em>square</em>, which is why it is not zero.
          </Mistake>
          <Mistake title="In an inductor the current leads" wrong={'"inductor: i leads v"'} fig={<PhasorPair title="In an inductor the voltage leads and the current lags by a quarter cycle" phi={Math.PI / 2} height={190} name="inductor" />}>
            The coil resists change, so the current is late. The voltage across an inductor leads the current by <M>90°</M> (CIVIL: V before I in L).
          </Mistake>
          <Mistake title="A pure inductor or capacitor uses power" wrong={'P = V _rms · I _rms  "for a pure coil"'} fig={<PowerWave title="For a pure coil the power is positive and negative in equal parts and its average is zero" phis={[90]} />}>
            With <M>φ = 90°</M>, <M>cos φ = 0</M> and the average power is zero. Energy goes into the field and comes back every cycle. Only the resistance heats.
          </Mistake>
          <Mistake title="Higher frequency, more current" wrong="I ∝ ω" fig={<ResonanceCurve height={200} bandwidth={false} />}>
            The current in a series LCR circuit peaks at <M>ω _0</M> and falls on both sides. A coil does choke higher frequencies and a capacitor does pass them, but the circuit as a whole has a best frequency.
          </Mistake>
          <Mistake title="A transformer works on a battery" wrong={'V _s = V _p · [ N _s | N _p ]  "for dc"'} fig={<TransformerDC height={200} />}>
            Only a <em>changing</em> flux induces an emf. Steady dc gives a steady flux, so the secondary voltage is zero apart from the brief spike when the current is switched on or off.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Let the current swing, and coils and capacitors begin to talk.</p>
        <p className="closing-sub">Next: electromagnetic waves. A changing electric field makes a magnetic one and back again, and the pattern sails off through empty space as light.</p>
      </footer>
    </ChapterShell>
  );
}
