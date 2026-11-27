import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Antenna, Charging, EmWave, GapB, LightTravel, Leapfrog, Medium, Poynting, RadPressure, Spectrum, TwoSurfaces, WaveLambda } from './EmAnims';

/** Electromagnetic waves: displacement current, the wave itself, its energy and the spectrum. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'Fields that make each other', group: 'Theory' },
  { id: 'ampere', title: 'A flaw in Ampere’s law', group: 'Theory' },
  { id: 'displacement', title: 'Displacement current', group: 'Theory' },
  { id: 'maxwell', title: 'Maxwell’s four equations', group: 'Theory' },
  { id: 'wave', title: 'What an electromagnetic wave is', group: 'Theory' },
  { id: 'speed', title: 'How fast it travels', group: 'Theory' },
  { id: 'source', title: 'Making the waves', group: 'Theory' },
  { id: 'energy', title: 'Energy, intensity and momentum', group: 'Theory' },
  { id: 'medium', title: 'In a material', group: 'Theory' },
  { id: 'spectrum', title: 'The electromagnetic spectrum', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="emwaves" film={buildFilm} sections={SECTIONS} sideTitle="Electromagnetic waves" sideLead="How a changing electric field makes a magnetic field and back again, and why that pattern travels through empty space as radio, light and X-rays.">
      <header className="article-head">
        <span className="kicker">Physics · Electromagnetic waves</span>
        <h1 className="article-title">How can light cross empty space?</h1>
        <p className="article-lead">Sound needs air and ocean waves need water, yet light reaches us across the vacuum between the Sun and the Earth. The reason is an idea of Maxwell: a changing electric field makes a magnetic field, and a changing magnetic field makes an electric one. Together they carry each other along.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="Fields that make each other" />
        <p>
          You already know two facts. Faraday's law: a <em>changing magnetic field</em> produces an electric field, which drives the emf round a loop. And Ampere's law: an <em>electric current</em> produces a magnetic field.
        </p>
        <p>
          The first fact has the changing field as the cause. The second does not, and the symmetry looks lopsided. Maxwell saw that Ampere's law was actually incomplete, and the missing piece was exactly the mirror image of Faraday's law: a <strong>changing electric field produces a magnetic field</strong>.
        </p>
        <figure className="t-figure">
          <Leapfrog />
          <figcaption>With both laws working, each field is the cause of the other. A disturbance can then keep itself going with nothing else to support it, and that is a wave.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-ampere">
        <SectionHead n={no('ampere')} title="A flaw in Ampere's law" />
        <p>
          For a long straight wire carrying <M>I</M>, Ampere's law says the magnetic field round a circular loop of radius <M>r</M> adds up to a multiple of the current through the loop:
        </p>
        <Eq src='B · 2 · π · r = μ _0 · I' />
        <p>
          Now charge a parallel-plate capacitor through a wire. Take a circle round the wire, just before the plate. The "current through the loop" means the current through any surface that has the loop as its edge. Choose a flat disc: the current <M>I</M> in the wire crosses it. Choose instead a bag that bulges forward and passes between the plates: no charge crosses it, because the gap is empty, and the current is zero.
        </p>
        <figure className="t-figure">
          <TwoSurfaces />
          <figcaption>One loop, one magnetic field, but two different answers for the current through it. The law cannot be right as it stands.</figcaption>
        </figure>
        <p>
          The magnetic field round the loop cannot depend on which surface we imagine. Something must be carried across the gap that has the same effect as the current in the wire.
        </p>
      </section>

      <section className="t-section" id="t-displacement">
        <SectionHead n={no('displacement')} title="Displacement current" />
        <p>
          Look at what <em>does</em> change in the gap: the electric field. As charge <M>q</M> builds up on plates of area <M>A</M>, the field between them grows. Build the idea step by step. The field between the plates is
        </p>
        <Eq src='E = [ q | ε _0 · A ]' />
        <p>The electric flux through the plate area is then</p>
        <Eq src='Φ _E = E · A = [ q | ε _0 ]' />
        <p>
          Now ask how fast this flux changes. The only thing on the right that varies is <M>q</M>, and its rate of change is the current <M>I</M> in the wire:
        </p>
        <Eq src={['[ dΦ _E | dt ] = [ 1 | ε _0 ] · [ dq | dt ] = [ I | ε _0 ]', 'I = ε _0 · [ dΦ _E | dt ]']} />
        <p>
          The right-hand side is a quantity measured in amperes that exists in the gap, where there is no moving charge at all. Maxwell called it the <strong>displacement current</strong>:
        </p>
        <Eq src='I _d = ε _0 · [ dΦ _E | dt ]' />
        <p>
          We have just shown that it equals the wire current: <M>I _d = I</M>. The current in the wire ends at one plate, and the displacement current starts at the other, so the total current is continuous.
        </p>
        <figure className="t-figure">
          <Charging />
          <figcaption>Dots show the real charge carriers in the wire. In the gap, there are none; the dashed line is the displacement current, tracking the growth of the field.</figcaption>
        </figure>
        <h3 className="t-h3">The corrected law</h3>
        <p>Ampere's law is repaired by adding the displacement current to the real (conduction) current, <M>I _c</M>:</p>
        <Eq src={['B · 2 · π · r = μ _0 · ( I _c + I _d )', 'B · 2 · π · r = μ _0 · ( I _c + ε _0 · [ dΦ _E | dt ] )']} />
        <p>
          Now both surfaces agree: the disc has <M>I _c = I</M> and no field change, the bag has <M>I _c = 0</M> but <M>I _d = I</M>. For a circular plate of radius <M>R</M> carrying a current <M>I</M>, a loop of radius <M>r</M> inside the gap encloses only the fraction <M>π · r ^2 / ( π · R ^2 )</M> of the displacement current, so
        </p>
        <Eq src={['B · 2 · π · r = μ _0 · I · [ r ^2 | R ^2 ]', 'B = [ μ _0 · I · r | 2 · π · R ^2 ]']} />
        <p>
          Outside the plates (<M>r &gt; R</M>) the whole current is enclosed and <M>B = μ _0 · I / ( 2 · π · r )</M>, just as for a wire.
        </p>
        <figure className="t-figure">
          <GapB />
          <figcaption>The field grows in proportion to <M>r</M> inside the plate radius and falls as <M>1 / r</M> outside. It is largest at the edge of the plates.</figcaption>
        </figure>
        <Note label="Not a flow of charge">Displacement current is not charges moving across the gap. It is the name for the effect of a changing electric field: that it creates a magnetic field exactly as a current does.</Note>
      </section>

      <section className="t-section" id="t-maxwell">
        <SectionHead n={no('maxwell')} title="Maxwell's four equations" />
        <p>With the missing term added, all of electricity and magnetism fits into four laws, written here for the simplest cases:</p>
        <p>
          <strong>Gauss's law for electricity.</strong> Electric charge is the source of the electric field. The flux through a closed surface depends only on the charge inside:
        </p>
        <Eq src='Φ _E = [ q | ε _0 ]' />
        <p>
          <strong>Gauss's law for magnetism.</strong> There are no isolated magnetic poles. Magnetic field lines have no beginning or end, so the flux through any closed surface is zero:
        </p>
        <Eq src='Φ _B = 0' />
        <p>
          <strong>Faraday's law.</strong> A changing magnetic flux produces an electric field and an emf:
        </p>
        <Eq src='ε = − [ dΦ _B | dt ]' />
        <p>
          <strong>Ampere's law with Maxwell's term.</strong> Currents <em>and</em> changing electric flux produce a magnetic field:
        </p>
        <Eq src='B · 2 · π · r = μ _0 · ( I + ε _0 · [ dΦ _E | dt ] )' />
        <p>
          Together with the force law on a charge, <M>F = q · ( E + v × B )</M>, these four equations are the whole of classical electromagnetism. From them Maxwell found a surprise: in empty space they allow waves.
        </p>
      </section>

      <section className="t-section" id="t-wave">
        <SectionHead n={no('wave')} title="What an electromagnetic wave is" />
        <p>
          Suppose an electric field exists that is changing in time. By the last equation, it makes a magnetic field. If that magnetic field is itself changing, Faraday's law gives a new electric field a little farther on. The pattern is passed along from point to point. The result is a wave, with
        </p>
        <ul className="t-list">
          <li>an electric field <M>E</M> and a magnetic field <M>B</M> that are both <strong>perpendicular</strong> to the direction of travel: the wave is <strong>transverse</strong>,</li>
          <li><M>E</M> and <M>B</M> perpendicular to each other,</li>
          <li><M>E</M> and <M>B</M> rising and falling <strong>in step</strong>: both are zero together and both are biggest together.</li>
        </ul>
        <p>For a wave going along <M>x</M>, with <M>E</M> along <M>y</M> and <M>B</M> along <M>z</M>:</p>
        <Eq src={['E _y = E _0 · sin ( k · x − ω · t )', 'B _z = B _0 · sin ( k · x − ω · t )']} />
        <p>
          The <strong>wave number</strong> <M>k = 2 · π / λ</M>, the angular frequency <M>ω = 2 · π · f</M>, and the speed of the pattern is <M>c = ω / k = f · λ</M>. The direction of travel is the direction of <M>E × B</M>.
        </p>
        <figure className="t-figure">
          <EmWave title="An electromagnetic wave: the electric field points up and down, the magnetic field in and out of the page, and the whole pattern moves to the right" />
          <figcaption>The two fields are perpendicular to each other and to the direction of travel, and they rise and fall together as the wave moves.</figcaption>
        </figure>
        <p>Unlike a sound wave or a wave on a rope, nothing material is shaking. What oscillates are the fields themselves, so the wave needs no medium and travels through a vacuum.</p>
      </section>

      <section className="t-section" id="t-speed">
        <SectionHead n={no('speed')} title="How fast it travels" />
        <p>
          Put the wave into Maxwell's two coupled laws, written for the fields at one point of the wave. Faraday's law says that the slope of <M>E</M> along <M>x</M> equals minus the rate of change of <M>B</M>:
        </p>
        <Eq src={['[ ∂E | ∂x ] = − [ ∂B | ∂t ]', 'k · E _0 = ω · B _0']} />
        <p>
          The second line follows by differentiating <M>sin ( k · x − ω · t )</M>, which gives <M>k · cos</M> on the left and <M>− ω · cos</M> on the right. So <M>E _0 / B _0 = ω / k</M>. The Ampere–Maxwell law, with no charges or currents in empty space, says
        </p>
        <Eq src={['− [ ∂B | ∂x ] = μ _0 · ε _0 · [ ∂E | ∂t ]', 'k · B _0 = μ _0 · ε _0 · ω · E _0']} />
        <p>Multiply the two results together. The amplitudes cancel, and what remains is a condition on the speed:</p>
        <Eq src={['k ^2 = μ _0 · ε _0 · ω ^2', 'c = [ ω | k ] = [ 1 | √[ μ _0 · ε _0 ] ]']} />
        <p>
          Putting in <M>μ _0 = 4 · π × 10 ^−7 "T·m/A"</M> and <M>ε _0 = 8.85 × 10 ^−12 "F/m"</M> gives <M>c = 3.00 × 10 ^8 "m/s"</M>. This was the speed of light, measured in a completely different way. Maxwell concluded that <strong>light is an electromagnetic wave</strong>.
        </p>
        <Eq src={['c = 3 × 10 ^8 "m/s"', '[ E _0 | B _0 ] = c', 'c = f · λ']} />
        <figure className="t-figure">
          <LightTravel />
          <figcaption>Light takes about 1.3 s to cover the distance to the Moon, and about 8 minutes to come from the Sun.</figcaption>
        </figure>
        <p>
          All electromagnetic waves, whatever their frequency, travel at <M>c</M> in vacuum. A higher frequency therefore means a shorter wavelength.
        </p>
        <figure className="t-figure">
          <WaveLambda />
          <figcaption>Same speed, different wavelengths: half the wavelength means twice as many crests pass the detector every second.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-source">
        <SectionHead n={no('source')} title="Making the waves" />
        <p>
          A charge at rest has an electric field and no magnetic field. A charge moving at a steady speed (a steady current) has a constant magnetic field too. Neither one produces a wave: nothing is changing at a point far away. Only an <strong>accelerated charge</strong> sends out waves.
        </p>
        <p>
          An oscillating charge, such as electrons driven up and down an antenna rod by an oscillator, does this naturally. Each shake sends out a disturbance in the field, which then travels outward at <M>c</M>. The wave has the same frequency as the oscillation.
        </p>
        <figure className="t-figure">
          <Antenna />
          <figcaption>Rings spread out from the oscillating charge. Their spacing is the wavelength, <M>λ = c / f</M>. Far from the source, a small patch of the wave looks like a flat plane wave.</figcaption>
        </figure>
        <p>Hertz first made and detected radio waves this way in 1887 with sparks across a gap, and measured that they travel at the speed of light.</p>
      </section>

      <section className="t-section" id="t-energy">
        <SectionHead n={no('energy')} title="Energy, intensity and momentum" />
        <p>An electromagnetic wave carries energy. The energy per unit volume stored in the electric and magnetic fields is</p>
        <Eq src='u _E = [ 1 | 2 ] · ε _0 · E ^2 ,  u _B = [ B ^2 | 2 · μ _0 ]' />
        <p>
          In the wave <M>B = E / c</M> and <M>c ^2 = 1 / ( μ _0 · ε _0 )</M>, so
        </p>
        <Eq src={['u _B = [ E ^2 | 2 · μ _0 · c ^2 ] = [ 1 | 2 ] · ε _0 · E ^2 = u _E', 'u = u _E + u _B = ε _0 · E ^2']} />
        <p>The energy is shared <strong>equally</strong> between the two fields. It travels with the wave at speed <M>c</M>, so the energy crossing unit area per second, the <strong>intensity</strong>, is the energy density times <M>c</M>. The average of <M>sin ^2</M> is one half, so:</p>
        <Eq src={['I = u _avg · c', 'I = [ 1 | 2 ] · ε _0 · E _0 ^2 · c']} />
        <figure className="t-figure">
          <Poynting />
          <figcaption>The arrows along the bottom show the energy flow. It is biggest where the fields are biggest and it is always in the direction of travel.</figcaption>
        </figure>
        <p>
          The wave also carries <strong>momentum</strong>. Energy <M>U</M> in the wave has momentum <M>p = U / c</M>. When light is absorbed, it gives up this momentum, so it presses on the surface. The <strong>radiation pressure</strong> for a perfect absorber and for a perfect reflector (which turns the momentum right round) is
        </p>
        <Eq src={['P _abs = [ I | c ]', 'P _ref = [ 2 · I | c ]']} />
        <figure className="t-figure">
          <RadPressure />
          <figcaption>The mirror gets twice the push of the black plate, as the light returns carrying away momentum in the opposite direction.</figcaption>
        </figure>
        <p>The pressure is tiny in everyday life, but it shapes the tails of comets and drives proposed solar sails.</p>
      </section>

      <section className="t-section" id="t-medium">
        <SectionHead n={no('medium')} title="In a material" />
        <p>
          Inside a transparent material the permittivity and permeability differ from the vacuum values. The wave speed becomes <M>v = 1 / √[ μ · ε ]</M>, which is smaller than <M>c</M>. The ratio is the <strong>refractive index</strong>:
        </p>
        <Eq src='n = [ c | v ]' />
        <p>
          When the wave passes from one material into another, its <strong>frequency stays the same</strong>, since the source decides it. Since <M>v = f · λ</M>, a slower speed means a shorter wavelength:
        </p>
        <Eq src='λ _m = [ v | f ] = [ λ | n ]' />
        <figure className="t-figure">
          <Medium />
          <figcaption>Inside the glass the wave is squeezed to a shorter wavelength. The two marked dots go up and down at the same rate: the frequency is unchanged.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-spectrum">
        <SectionHead n={no('spectrum')} title="The electromagnetic spectrum" />
        <p>
          The waves of different frequencies are all the same kind of thing; only the frequency (or wavelength) and the way they are produced and detected differ. Arranged in order of wavelength they make the <strong>electromagnetic spectrum</strong>.
        </p>
        <figure className="t-figure">
          <Spectrum />
          <figcaption>A cursor slides along the spectrum, and the wave above it shortens as the wavelength falls and the frequency rises. Note that the scale is logarithmic: each step is ten times the one before.</figcaption>
        </figure>
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Region</th>
                <th scope="col">Wavelength</th>
                <th scope="col">Frequency</th>
                <th scope="col">Made by</th>
                <th scope="col">Used for</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['Radio waves', 'above 0.1 m', 'below 3 GHz', 'Charges oscillating in circuits and antennas', 'Broadcasting, communication, mobile phones'],
                  ['Microwaves', '1 mm to 0.1 m', '3 GHz to 300 GHz', 'Special electronic tubes and oscillators', 'Radar, satellite links, microwave ovens'],
                  ['Infrared', '700 nm to 1 mm', '3 × 10¹¹ to 4 × 10¹⁴ Hz', 'Vibrating atoms and molecules, hot bodies', 'Heat lamps, remote controls, night vision'],
                  ['Visible light', '400 nm to 700 nm', '4 × 10¹⁴ to 7.5 × 10¹⁴ Hz', 'Electrons in atoms changing energy level, hot filaments', 'Seeing, photography, optical fibres'],
                  ['Ultraviolet', '1 nm to 400 nm', '7.5 × 10¹⁴ to 3 × 10¹⁷ Hz', 'The Sun, mercury lamps, sparks', 'Sterilising, vitamin D, detecting forged notes'],
                  ['X-rays', '1 pm to 10 nm', '3 × 10¹⁶ to 3 × 10¹⁹ Hz', 'Fast electrons stopped by a metal target', 'Medical imaging, crystal structure, security'],
                  ['Gamma rays', 'below 10 pm', 'above 3 × 10¹⁹ Hz', 'Atomic nuclei and radioactive decay', 'Cancer treatment, sterilising equipment'],
                ] as const
              ).map(([region, wl, fr, made, use]) => (
                <tr key={region}>
                  <th scope="row">{region}</th>
                  <td>{wl}</td>
                  <td>{fr}</td>
                  <td>{made}</td>
                  <td>{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The boundaries are not sharp, and some regions overlap. Visible light is only a thin slice: wavelengths from about 400 nm (violet) to 700 nm (red), a factor of less than two. The rest of the spectrum is invisible to the eye but fills the world.
        </p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Displacement current', 'I _d = ε _0 · [ dΦ _E | dt ]'],
                  ['Ampere–Maxwell law', 'B · 2 · π · r = μ _0 · ( I _c + I _d )'],
                  ['Field in the gap (r < R)', 'B = [ μ _0 · I · r | 2 · π · R ^2 ]'],
                  ['Plane wave', 'E _y = E _0 · sin ( k · x − ω · t )'],
                  ['Wave number and frequency', 'k = [ 2 · π | λ ] ,  ω = 2 · π · f'],
                  ['Speed in vacuum', 'c = [ 1 | √[ μ _0 · ε _0 ] ] = f · λ'],
                  ['Ratio of the fields', '[ E _0 | B _0 ] = c'],
                  ['Energy density', 'u = ε _0 · E ^2'],
                  ['Intensity', 'I = [ 1 | 2 ] · ε _0 · c · E _0 ^2'],
                  ['Momentum of the wave', 'p = [ U | c ]'],
                  ['Radiation pressure', 'P = [ I | c ] "(absorbed)" ,  P = [ 2 · I | c ] "(reflected)"'],
                  ['Refractive index', 'n = [ c | v ] ,  λ _m = [ λ | n ]'],
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
                  ['E', 'Electric field', 'V/m'],
                  ['B', 'Magnetic field', 'T'],
                  ['c', 'Speed of light in vacuum', 'm/s'],
                  ['k', 'Wave number', 'rad/m'],
                  ['ω', 'Angular frequency', 'rad/s'],
                  ['λ', 'Wavelength', 'm'],
                  ['f', 'Frequency', 'Hz'],
                  ['I', 'Intensity', 'W/m²'],
                  ['ε₀', 'Permittivity of free space (8.85 × 10⁻¹²)', 'F/m'],
                  ['μ₀', 'Permeability of free space (4π × 10⁻⁷)', 'T·m/A'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">{['ε₀', 'μ₀'].includes(sym) ? sym : <M>{sym}</M>}</th>
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

        <Example n={1} title="Displacement current in a capacitor">
          <p className="ex-q">A capacitor has circular plates of radius 0.10 m and is being charged by a steady current of 3.0 A. Find the rate of change of the electric field between the plates, and the magnetic field at the edge of the plates and halfway to the edge.</p>
          <Given items={['R = 0.10 "m"', 'I = 3.0 "A"']} />
          <ol className="steps">
            <Step title="Area of a plate">
              <Eq src='A = π · R ^2 = π · 0.10 ^2 = 0.0314 "m²"' />
            </Step>
            <Step title="Rate of change of E">
              <p>Since <M>I _d = ε _0 · A · dE / dt</M> and <M>I _d = I</M>:</p>
              <Eq src='[ dE | dt ] = [ I | ε _0 · A ] = [ 3.0 | 8.85 × 10 ^−12 · 0.0314 ] = 1.08 × 10 ^13 "V/(m·s)"' />
            </Step>
            <Step title="Field at the edge, r = R">
              <Eq src='B = [ μ _0 · I | 2 · π · R ] = [ 4 · π × 10 ^−7 · 3.0 | 2 · π · 0.10 ] = 6.0 × 10 ^−6 "T"' />
            </Step>
            <Step title="Field at r = R/2">
              <Eq src='B = [ μ _0 · I · r | 2 · π · R ^2 ] = [ 2 × 10 ^−7 · 3.0 · 0.05 | 0.10 ^2 ] = 3.0 × 10 ^−6 "T"' />
            </Step>
          </ol>
          <Answer>The field between the plates changes at <M>1.08 × 10 ^13 "V/(m·s)"</M>. The magnetic field is 6.0 µT at the edge, and half of that (3.0 µT) at half the radius, because it grows in proportion to <M>r</M>.</Answer>
          <figure className="t-figure">
            <GapB />
          </figure>
        </Example>

        <Example n={2} title="The speed of light from two constants">
          <p className="ex-q">Use <M>μ _0 = 4 · π × 10 ^−7 "T·m/A"</M> and <M>ε _0 = 8.85 × 10 ^−12 "F/m"</M> to find the speed of electromagnetic waves in vacuum.</p>
          <Given items={['μ _0 = 1.257 × 10 ^−6 "T·m/A"', 'ε _0 = 8.85 × 10 ^−12 "F/m"']} />
          <ol className="steps">
            <Step title="The product">
              <Eq src='μ _0 · ε _0 = 1.257 × 10 ^−6 · 8.85 × 10 ^−12 = 1.112 × 10 ^−17' />
            </Step>
            <Step title="The root and the inverse">
              <Eq src={['√[ μ _0 · ε _0 ] = 3.335 × 10 ^−9', 'c = [ 1 | 3.335 × 10 ^−9 ] = 3.00 × 10 ^8 "m/s"']} />
            </Step>
          </ol>
          <Answer>3.00 × 10⁸ m/s: the measured speed of light, found here from electric and magnetic constants alone.</Answer>
          <figure className="t-figure">
            <LightTravel />
          </figure>
        </Example>

        <Example n={3} title="A radio wave">
          <p className="ex-q">An FM station broadcasts at 100 MHz. Find the wavelength, the wave number and the angular frequency. How long is an AM wave of 1000 kHz?</p>
          <Given items={['f = 100 "MHz"', 'c = 3.0 × 10 ^8 "m/s"']} />
          <ol className="steps">
            <Step title="Wavelength">
              <Eq src='λ = [ c | f ] = [ 3.0 × 10 ^8 | 1.0 × 10 ^8 ] = 3.0 "m"' />
            </Step>
            <Step title="Wave number and angular frequency">
              <Eq src={['k = [ 2 · π | λ ] = [ 2 · π | 3.0 ] = 2.09 "rad/m"', 'ω = 2 · π · f = 6.28 × 10 ^8 "rad/s"']} />
              <p>Check: <M>ω / k = 6.28 × 10 ^8 / 2.09 = 3.0 × 10 ^8 "m/s"</M>.</p>
            </Step>
            <Step title="The AM wave">
              <Eq src='λ = [ 3.0 × 10 ^8 | 1.0 × 10 ^6 ] = 300 "m"' />
            </Step>
          </ol>
          <Answer>The FM wave is 3.0 m long, with <M>k = 2.09 "rad/m"</M> and <M>ω = 6.28 × 10 ^8 "rad/s"</M>. The AM wave is 300 m long, a hundred times longer, because its frequency is a hundred times lower.</Answer>
          <figure className="t-figure">
            <WaveLambda />
          </figure>
        </Example>

        <Example n={4} title="Reading a wave equation">
          <p className="ex-q">The electric field of a wave in vacuum is <M>E _y = 30 · sin ( 1.8 · x − 5.4 × 10 ^8 · t )</M> in V/m, with <M>x</M> in metres and <M>t</M> in seconds. Find the speed, wavelength, frequency, and the amplitude of the magnetic field.</p>
          <Given items={['E _0 = 30 "V/m"', 'k = 1.8 "rad/m"', 'ω = 5.4 × 10 ^8 "rad/s"']} />
          <ol className="steps">
            <Step title="Speed">
              <Eq src='c = [ ω | k ] = [ 5.4 × 10 ^8 | 1.8 ] = 3.0 × 10 ^8 "m/s"' />
            </Step>
            <Step title="Wavelength and frequency">
              <Eq src={['λ = [ 2 · π | k ] = [ 2 · π | 1.8 ] = 3.49 "m"', 'f = [ ω | 2 · π ] = [ 5.4 × 10 ^8 | 2 · π ] = 8.59 × 10 ^7 "Hz"']} />
            </Step>
            <Step title="Magnetic field">
              <Eq src='B _0 = [ E _0 | c ] = [ 30 | 3.0 × 10 ^8 ] = 1.0 × 10 ^−7 "T"' />
              <p>It points along <M>z</M>, in step with <M>E</M>, since <M>E × B</M> must point along <M>+ x</M>.</p>
            </Step>
          </ol>
          <Answer>The wave moves at 3.0 × 10⁸ m/s along +x, with a wavelength of 3.49 m and a frequency of 85.9 MHz (a radio wave). The magnetic field has an amplitude of 100 nT.</Answer>
          <figure className="t-figure">
            <EmWave title="A wave with a 3.5 metre wavelength travelling along the x axis, with electric field up and down and magnetic field in and out" />
          </figure>
        </Example>

        <Example n={5} title="Intensity and energy">
          <p className="ex-q">A wave has <M>E _0 = 60 "V/m"</M>. Find its magnetic field amplitude, its average energy density and its intensity.</p>
          <Given items={['E _0 = 60 "V/m"', 'c = 3.0 × 10 ^8 "m/s"', 'ε _0 = 8.85 × 10 ^−12 "F/m"']} />
          <ol className="steps">
            <Step title="Magnetic field">
              <Eq src='B _0 = [ E _0 | c ] = [ 60 | 3.0 × 10 ^8 ] = 2.0 × 10 ^−7 "T"' />
            </Step>
            <Step title="Average energy density">
              <Eq src='u _avg = [ 1 | 2 ] · ε _0 · E _0 ^2 = [ 1 | 2 ] · 8.85 × 10 ^−12 · 60 ^2 = 1.59 × 10 ^−8 "J/m³"' />
            </Step>
            <Step title="Intensity">
              <Eq src='I = u _avg · c = 1.59 × 10 ^−8 · 3.0 × 10 ^8 = 4.78 "W/m²"' />
            </Step>
          </ol>
          <Answer>200 nT, an average energy density of 1.59 × 10⁻⁸ J/m³ (half in each field) and an intensity of 4.8 W/m².</Answer>
          <figure className="t-figure">
            <Poynting />
          </figure>
        </Example>

        <Example n={6} title="Sunlight and radiation pressure">
          <p className="ex-q">Sunlight at the Earth has an intensity of 1400 W/m². Find the amplitude of its electric and magnetic fields, and the force it exerts on a 1 m² perfect absorber and on a 1 m² perfect mirror facing the Sun.</p>
          <Given items={['I = 1400 "W/m²"', 'c = 3.0 × 10 ^8 "m/s"']} />
          <ol className="steps">
            <Step title="Electric field amplitude">
              <Eq src={['I = [ 1 | 2 ] · ε _0 · c · E _0 ^2', 'E _0 = √[ [ 2 · I | ε _0 · c ] ] = √[ [ 2800 | 8.85 × 10 ^−12 · 3.0 × 10 ^8 ] ] = 1.03 × 10 ^3 "V/m"']} />
            </Step>
            <Step title="Magnetic field amplitude">
              <Eq src='B _0 = [ E _0 | c ] = [ 1030 | 3.0 × 10 ^8 ] = 3.4 × 10 ^−6 "T"' />
            </Step>
            <Step title="Pressure and force">
              <Eq src={['P _abs = [ I | c ] = [ 1400 | 3.0 × 10 ^8 ] = 4.67 × 10 ^−6 "Pa"', 'P _ref = 2 · P _abs = 9.3 × 10 ^−6 "Pa"']} />
              <p>For an area of 1 m² the force in newtons is numerically the same as the pressure in pascals.</p>
            </Step>
          </ol>
          <Answer>E₀ is about 1030 V/m and B₀ about 3.4 µT. The Sun pushes the absorber with 4.7 µN and the mirror with 9.3 µN: far too small to feel, but enough to drive a lightweight solar sail.</Answer>
          <figure className="t-figure">
            <RadPressure />
          </figure>
        </Example>

        <Example n={7} title="Light entering glass">
          <p className="ex-q">Light of wavelength 600 nm in vacuum enters glass of refractive index 1.5. Find its frequency, and its speed and wavelength in the glass.</p>
          <Given items={['λ = 600 "nm"', 'n = 1.5', 'c = 3.0 × 10 ^8 "m/s"']} />
          <ol className="steps">
            <Step title="Frequency (unchanged in glass)">
              <Eq src='f = [ c | λ ] = [ 3.0 × 10 ^8 | 600 × 10 ^−9 ] = 5.0 × 10 ^14 "Hz"' />
            </Step>
            <Step title="Speed in glass">
              <Eq src='v = [ c | n ] = [ 3.0 × 10 ^8 | 1.5 ] = 2.0 × 10 ^8 "m/s"' />
            </Step>
            <Step title="Wavelength in glass">
              <Eq src='λ _m = [ v | f ] = [ 2.0 × 10 ^8 | 5.0 × 10 ^14 ] = 400 "nm"' />
            </Step>
          </ol>
          <Answer>The frequency stays at 5.0 × 10¹⁴ Hz. The speed drops to 2.0 × 10⁸ m/s and the wavelength to 400 nm, which is 600 nm divided by 1.5.</Answer>
          <figure className="t-figure">
            <Medium />
          </figure>
        </Example>

        <Example n={8} title="Where on the spectrum?">
          <p className="ex-q">Find the frequency of waves of wavelength 3 cm, 500 nm and 0.1 nm, and say which region of the spectrum each belongs to.</p>
          <Given items={['λ _1 = 3 "cm"', 'λ _2 = 500 "nm"', 'λ _3 = 0.1 "nm"']} />
          <ol className="steps">
            <Step title="3 cm">
              <Eq src='f = [ 3 × 10 ^8 | 0.03 ] = 1 × 10 ^10 "Hz"' />
            </Step>
            <Step title="500 nm">
              <Eq src='f = [ 3 × 10 ^8 | 5 × 10 ^−7 ] = 6 × 10 ^14 "Hz"' />
            </Step>
            <Step title="0.1 nm">
              <Eq src='f = [ 3 × 10 ^8 | 1 × 10 ^−10 ] = 3 × 10 ^18 "Hz"' />
            </Step>
          </ol>
          <Answer>3 cm gives 10 GHz: a microwave (radar). 500 nm gives 6 × 10¹⁴ Hz: green light. 0.1 nm gives 3 × 10¹⁸ Hz: an X-ray, whose wavelength is about the size of an atom.</Answer>
          <figure className="t-figure">
            <Spectrum />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Displacement current is charge crossing the gap" wrong={'I _d = "charges moving across the gap"'} fig={<Charging height={200} title="In the gap of a charging capacitor there is no moving charge, only a growing electric field that acts like a current" />}>
            Nothing material crosses the gap. The displacement current is the name for the changing electric flux, <M>ε _0 · dΦ _E / dt</M>, which makes a magnetic field just as a current does.
          </Mistake>
          <Mistake title="When E is biggest, B is zero" wrong={'"E peaks when B is zero"'} fig={<EmWave title="The electric and magnetic fields of a wave are zero together and biggest together" height={200} />}>
            In a travelling wave the two fields are in step: both are zero at the same places and biggest at the same places, with the ratio <M>E / B = c</M> always. The alternating hand-over is true only of the <em>rates of change</em>.
          </Mistake>
          <Mistake title="Light needs a medium" wrong={'"waves need a medium"'} fig={<LightTravel height={190} />}>
            Sound and water waves need matter. An electromagnetic wave is made of fields, which exist in empty space, so it crosses the vacuum between the Sun and the Earth at <M>c</M>.
          </Mistake>
          <Mistake title="Higher frequency means a higher speed" wrong={'c _violet > c _red'} fig={<WaveLambda height={240} />}>
            In vacuum every electromagnetic wave travels at the same <M>c</M>. A higher frequency gives a <em>shorter wavelength</em>, <M>λ = c / f</M>, not a faster wave.
          </Mistake>
          <Mistake title="The wavelength stays the same in glass" wrong="λ _glass = λ _vacuum" fig={<Medium height={190} />}>
            The frequency is the one thing that stays fixed. The speed drops by the refractive index, so the wavelength drops by the same factor: <M>λ _m = λ / n</M>.
          </Mistake>
          <Mistake title="A steady current radiates" wrong={'"a steady current sends out waves"'} fig={<Antenna height={200} title="Only the oscillating charge sends out rings of field; a charge that is not accelerated would send out none" />}>
            Waves need accelerated charge. A steady current has a steady magnetic field and nothing in it changes far away. It is the shaking of the charges that produces the wave.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">A changing field makes the other field, and the pattern outruns its source: that is light.</p>
        <p className="closing-sub">Next: ray optics. Light's wavelength is tiny compared with everyday objects, so we can treat it as straight rays, and bend them with mirrors, lenses and prisms.</p>
      </footer>
    </ChapterShell>
  );
}
