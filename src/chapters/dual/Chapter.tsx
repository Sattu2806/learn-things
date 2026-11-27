import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Accumulate, CrystalDiffraction, DeBroglie, ElectronFringes, EnergyBudget, IVCurves, MetalWell, PhotoTube, PhotonEnergy, PhotonStream, Retarding, Scale, StoppingGraph, ThresholdCompare, VoltageWavelength } from './DualAnims';

/** Dual nature of radiation and matter: the photoelectric effect, photons and de Broglie waves. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'Getting electrons out of a metal', group: 'Theory' },
  { id: 'effect', title: 'The photoelectric effect', group: 'Theory' },
  { id: 'observations', title: 'What the experiments show', group: 'Theory' },
  { id: 'waves', title: 'Why the wave picture fails', group: 'Theory' },
  { id: 'einstein', title: "Einstein's photon explanation", group: 'Theory' },
  { id: 'stopping', title: 'Stopping potential and the straight line', group: 'Theory' },
  { id: 'photon', title: 'The photon', group: 'Theory' },
  { id: 'debroglie', title: 'Matter waves', group: 'Theory' },
  { id: 'scale', title: 'Why we do not see matter waves', group: 'Theory' },
  { id: 'davisson', title: 'Davisson and Germer', group: 'Theory' },
  { id: 'fringes', title: 'Electrons through two slits', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="dual" film={buildFilm} sections={SECTIONS} sideTitle="Dual nature" sideLead="Light that comes in lumps, electrons that make fringes: how waves and particles turned out to be two faces of the same thing.">
      <header className="article-head">
        <span className="kicker">Physics · Dual nature of radiation and matter</span>
        <h1 className="article-title">Is light a wave, or is it a stream of particles?</h1>
        <p className="article-lead">Interference proves light is a wave. Yet shine light on a metal and electrons pop out as if hit by tiny bullets. This chapter resolves the puzzle, and then turns it around: if light can act like particles, can particles act like waves?</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="Getting electrons out of a metal" />
        <p>
          A metal has free electrons that roam through it, but they do not leave on their own. Near the surface the positive ions pull them back. To get an electron out, we have to give it a minimum energy. This is the <strong>work function</strong> <M>φ _0</M> of the metal, and it differs from metal to metal.
        </p>
        <p>
          Energies of single electrons are tiny in joules, so we use the <strong>electron volt</strong>: the energy gained by one electron when it moves through a potential difference of one volt.
        </p>
        <Eq src='1 "eV" = e · 1 "V" = 1.6 × 10 ^−19 "C" · 1 "V" = 1.6 × 10 ^−19 "J"' />
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Metal</th>
                <th scope="col">Work function</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['Caesium', '2.14 eV'],
                  ['Potassium', '2.30 eV'],
                  ['Sodium', '2.75 eV'],
                  ['Aluminium', '4.28 eV'],
                  ['Copper', '4.65 eV'],
                  ['Platinum', '5.65 eV'],
                ] as const
              ).map(([m, w]) => (
                <tr key={m}>
                  <th scope="row">{m}</th>
                  <td>{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>There are three ways to supply the energy: heat the metal until the electrons boil off (thermionic emission), pull them out with a very strong electric field (field emission), or shine light on it. The last one is the <strong>photoelectric effect</strong>.</p>
        <figure className="t-figure">
          <MetalWell />
          <figcaption>On the right, the energy picture. The electrons sit at least <M>φ _0</M> below the free level. A photon of energy <M>h · ν</M> lifts one up; if that is more than <M>φ _0</M>, the rest, <M>K</M>, is kinetic energy outside.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-effect">
        <SectionHead n={no('effect')} title="The photoelectric effect" />
        <p>
          Hertz noticed in 1887 that a spark jumps more easily when ultraviolet light falls on the electrodes. Lenard and others later showed that the light was releasing electrons from the metal. Here is the usual apparatus.
        </p>
        <p>
          Two metal plates sit in an evacuated glass tube. Light falls on the plate <M>C</M> (the cathode, which emits). Electrons knocked out of it travel across to the other plate <M>A</M> (the anode) if it is positive, or are pushed back if it is negative. A sensitive ammeter in the circuit measures the <strong>photoelectric current</strong>. A battery and a variable resistor set the voltage between the plates, in either direction.
        </p>
        <figure className="t-figure">
          <PhotoTube title="A tube with a cathode and an anode; photons strike the cathode, electrons fly to the anode and return through the ammeter, so current flows" above photons={3} />
          <figcaption>Each photon that reaches the cathode frees one electron, which flies to the anode. The electrons then circle back through the wire, and the ammeter shows a current.</figcaption>
        </figure>
        <p>
          The things we can change are the <strong>frequency</strong> of the light, its <strong>intensity</strong> (the energy arriving per second on each square metre), the voltage <M>V</M> between the plates, and the metal.
        </p>
      </section>

      <section className="t-section" id="t-observations">
        <SectionHead n={no('observations')} title="What the experiments show" />
        <h3 className="t-h3">1. Intensity sets the size of the current</h3>
        <p>
          For light of a given frequency, making the light brighter makes the photocurrent larger in proportion. When the anode is positive enough, every freed electron is collected, and the current reaches a <strong>saturation value</strong> that does not grow with voltage. Twice the intensity gives twice the saturation current.
        </p>
        <figure className="t-figure">
          <IVCurves mode="intensity" />
          <figcaption>Two intensities of the same colour. The bright beam has double the saturation current. Both curves reach zero at the same negative voltage.</figcaption>
        </figure>
        <h3 className="t-h3">2. The stopping potential</h3>
        <p>
          When the anode is made negative, the electrons are slowed on their way across. The current drops but does not vanish at once, because some electrons leave the metal with a lot of kinetic energy. At a certain negative voltage <M>− V _0</M> the current drops to zero. This is the <strong>stopping potential</strong>. At that voltage even the fastest electron, with the maximum kinetic energy <M>K _max</M>, just fails to reach the anode. The work done against the field takes all its energy:
        </p>
        <Eq src='e · V _0 = K _max = [ 1 | 2 ] · m · v _max ^2' />
        <figure className="t-figure">
          <Retarding />
          <figcaption>As the negative voltage rises, slower electrons are turned back first. When <M>e · V = K _max</M>, even the fastest one just stops at the anode.</figcaption>
        </figure>
        <p>
          So measuring <M>V _0</M> tells us the maximum kinetic energy. The remarkable finding: <strong>the stopping potential does not depend on the intensity</strong>. A bright beam frees more electrons, but not faster ones.
        </p>
        <h3 className="t-h3">3. Frequency sets the energy</h3>
        <p>
          With the intensity held fixed, a higher frequency gives the same saturation current but a larger stopping potential. The electrons come out faster.
        </p>
        <figure className="t-figure">
          <IVCurves mode="frequency" />
          <figcaption>A higher frequency needs a more negative voltage to stop the current. The saturation current is the same.</figcaption>
        </figure>
        <h3 className="t-h3">4. There is a threshold frequency</h3>
        <p>
          For every metal there is a minimum frequency <M>ν _0</M>, the <strong>threshold frequency</strong>. Below it, <em>no</em> electrons come out, however bright the light and however long we wait. Above it, they come out, even if the light is very dim.
        </p>
        <figure className="t-figure">
          <ThresholdCompare />
          <figcaption>A bright beam below threshold does nothing. A dim beam above threshold works. What matters is the frequency, not the intensity.</figcaption>
        </figure>
        <h3 className="t-h3">5. It is instantaneous</h3>
        <p>
          Electrons are emitted within about <M>10 ^−9 "s"</M> of the light arriving, even for very dim light, with no measurable delay.
        </p>
      </section>

      <section className="t-section" id="t-waves">
        <SectionHead n={no('waves')} title="Why the wave picture fails" />
        <p>
          According to the wave theory, the energy of light is spread smoothly over the wavefront, and a brighter wave carries more energy per second. If that were the whole story, we would predict:
        </p>
        <ul className="t-list">
          <li><strong>Brighter light gives faster electrons.</strong> A bigger amplitude means a bigger force on the electrons. Observed: the maximum speed does not change with intensity.</li>
          <li><strong>Any frequency should work</strong> if the light is bright enough. Observed: a sharp threshold.</li>
          <li><strong>Dim light should take a while.</strong> A single electron intercepts only a tiny share of the beam. It would need minutes to soak up <M>φ _0</M>. Observed: no delay.</li>
          <li><strong>Frequency should not matter</strong> for the speed. Observed: it sets the maximum energy.</li>
        </ul>
        <figure className="t-figure">
          <Accumulate />
          <figcaption>In the wave picture, the energy fills up slowly and the electron leaves only after a delay. With photons the energy arrives all at once.</figcaption>
        </figure>
        <p>The wave theory fails on every point. A different idea was needed.</p>
      </section>

      <section className="t-section" id="t-einstein">
        <SectionHead n={no('einstein')} title="Einstein's photon explanation" />
        <p>
          In 1905, Einstein took up an idea of Planck's and made it daring. <strong>Light of frequency <M>ν</M> travels as a stream of packets of energy, called photons. Each photon carries the energy</strong>
        </p>
        <Eq src='E = h · ν' />
        <p>
          where <M>h = 6.63 × 10 ^−34 "J s"</M> is Planck's constant. The intensity of the light tells us how many photons arrive per second. Their size depends only on the frequency.
        </p>
        <p>
          In the photoelectric effect, <strong>one photon is absorbed by one electron, all at once</strong>. Energy is conserved. Part of the photon's energy, at least <M>φ _0</M>, goes into pulling the electron out of the metal. What is left over is its kinetic energy. For the most loosely held electrons the loss is just <M>φ _0</M>, and they leave with the largest kinetic energy:
        </p>
        <Eq src={['h · ν = φ _0 + K _max', 'K _max = h · ν − φ _0']} />
        <p>Writing out the kinetic energy gives <strong>Einstein's photoelectric equation</strong>:</p>
        <Eq src='h · ν = φ _0 + [ 1 | 2 ] · m · v _max ^2' />
        <figure className="t-figure">
          <EnergyBudget />
          <figcaption>The photon's energy bar splits into a fixed part <M>φ _0</M> and a leftover <M>K</M>. Only the frequency changes the height.</figcaption>
        </figure>
        <h3 className="t-h3">The threshold</h3>
        <p>
          The least energy that frees an electron is when <M>K _max = 0</M>: the photon only just pays the cost of escaping. The frequency at which this happens is the threshold:
        </p>
        <Eq src={['h · ν _0 = φ _0', 'ν _0 = [ φ _0 | h ]', 'λ _0 = [ c | ν _0 ] = [ h · c | φ _0 ]']} />
        <p>Below <M>ν _0</M>, a photon's energy is not enough, and since an electron absorbs one photon at a time, it cannot save up energy from several. So <em>no</em> electrons come out. Putting <M>φ _0</M> in terms of the threshold gives a neat form of the equation:</p>
        <Eq src='K _max = h · ν − h · ν _0 = h · ( ν − ν _0 )' />
        <h3 className="t-h3">All five observations explained</h3>
        <ul className="t-list">
          <li>Intensity is the number of photons per second, so more photons free more electrons: the current is proportional to intensity.</li>
          <li><M>K _max</M> depends on <M>ν</M> only, not on how many photons there are.</li>
          <li>There is a threshold because a photon needs at least <M>φ _0</M>.</li>
          <li>It is instantaneous because one photon gives its energy in a single event.</li>
          <li>Higher frequency means a bigger photon and a bigger leftover: faster electrons.</li>
        </ul>
        <p>Einstein received the 1921 Nobel Prize for this explanation. Millikan's careful measurements ten years later confirmed every detail.</p>
      </section>

      <section className="t-section" id="t-stopping">
        <SectionHead n={no('stopping')} title="Stopping potential and the straight line" />
        <p>Combine <M>e · V _0 = K _max</M> with Einstein's equation:</p>
        <Eq src={['e · V _0 = h · ν − φ _0', 'V _0 = [ h | e ] · ν − [ φ _0 | e ]']} />
        <p>
          This is the equation of a straight line, <M>y = m · x + c</M>, with <M>V _0</M> up and <M>ν</M> across. The slope is <M>h / e</M>, the same for every metal. The line meets the frequency axis at <M>ν _0</M>, and it would meet the voltage axis at <M>− φ _0 / e</M>.
        </p>
        <Eq src='[ Δ V _0 | Δ ν ] = [ h | e ]' />
        <figure className="t-figure">
          <StoppingGraph />
          <figcaption>Two metals give two parallel lines. The one with the larger work function starts at a higher threshold. Both have slope <M>h / e</M>.</figcaption>
        </figure>
        <p>
          The slope gives Planck's constant from measurement alone: <M>h = e · ( Δ V _0 / Δ ν )</M>. This is how Millikan found <M>h</M> in 1916, and his answer agreed with the value from black-body radiation.
        </p>
      </section>

      <section className="t-section" id="t-photon">
        <SectionHead n={no('photon')} title="The photon" />
        <p>
          A photon is a packet of the electromagnetic field. It has no charge, no rest mass, and always travels at <M>c</M>. Its energy depends on the frequency; with <M>c = ν · λ</M>:
        </p>
        <Eq src='E = h · ν = [ h · c | λ ]' />
        <p>
          The product <M>h · c</M> is handy. In electron volts and nanometres, <M>h · c = 6.63 × 10 ^−34 · 3 × 10 ^8 = 1.99 × 10 ^−25 "J m"</M>. Dividing by <M>1.6 × 10 ^−19</M> gives
        </p>
        <Eq src='h · c = 1240 "eV nm"' />
        <p>
          So a photon of wavelength 500 nm has an energy of <M>1240 / 500 = 2.48 "eV"</M>. Visible light covers about 1.8 eV (red) to 3.1 eV (violet).
        </p>
        <figure className="t-figure">
          <PhotonEnergy />
          <figcaption>Shorter wavelength, bigger energy and bigger momentum. The numbers use <M>E = 1240 / λ</M> in eV and nm.</figcaption>
        </figure>
        <h3 className="t-h3">Momentum</h3>
        <p>
          Relativity gives for any particle <M>E ^2 = ( p · c ) ^2 + ( m _0 · c ^2 ) ^2</M>. A photon has <M>m _0 = 0</M>, so <M>E = p · c</M>:
        </p>
        <Eq src={['p = [ E | c ] = [ h · ν | c ]', 'p = [ h | λ ]']} />
        <h3 className="t-h3">Intensity</h3>
        <p>
          If <M>N</M> photons of energy <M>h · ν</M> cross each square metre every second, the intensity is
        </p>
        <Eq src='I = N · h · ν' />
        <p>Doubling the intensity at one frequency means doubling <M>N</M>. Changing the frequency changes the size of each packet.</p>
        <figure className="t-figure">
          <PhotonStream />
          <figcaption>Dim and bright beams of the same colour differ in how many photons arrive each second. A bluer beam has the same count but more energy per photon.</figcaption>
        </figure>
        <Note label="Both at once">Interference and diffraction show that light spreads as a wave. The photoelectric effect shows that it gives energy as particles. Neither picture alone is the whole story. The wave tells us where photons are likely to land. The photons deliver the energy.</Note>
      </section>

      <section className="t-section" id="t-debroglie">
        <SectionHead n={no('debroglie')} title="Matter waves" />
        <p>
          In 1924, de Broglie asked a question: nature likes symmetry. Light has particle properties. Might matter have wave properties? For a photon, <M>p = h / λ</M>. He proposed that the same relation holds for <em>every</em> particle with momentum <M>p</M>. It is accompanied by a wave of wavelength
        </p>
        <Eq src='λ = [ h | p ] = [ h | m · v ]' />
        <p>
          A larger momentum means a shorter wavelength. Nothing else is needed: heavier or faster particles have shorter waves.
        </p>
        <figure className="t-figure">
          <DeBroglie />
          <figcaption>Three identical particles at speeds <M>v</M>, <M>2 · v</M> and <M>4 · v</M>. Doubling the speed halves the wavelength.</figcaption>
        </figure>
        <h3 className="t-h3">Wavelength from the kinetic energy</h3>
        <p>
          For a particle of mass <M>m</M> and kinetic energy <M>K</M>, we have <M>K = ½ · m · v ^2</M>, so <M>p = m · v</M> can be written in terms of <M>K</M>:
        </p>
        <Eq src={['p ^2 = m ^2 · v ^2 = 2 · m · [ 1 | 2 ] · m · v ^2 = 2 · m · K', 'λ = [ h | √[ 2 · m · K ] ]']} />
        <h3 className="t-h3">An electron through a potential difference</h3>
        <p>
          An electron starting from rest and accelerated through <M>V</M> volts gains <M>K = e · V</M>:
        </p>
        <Eq src={['λ = [ h | √[ 2 · m · e · V ] ]', 'λ = [ 6.63 × 10 ^−34 | √[ 2 · 9.11 × 10 ^−31 · 1.6 × 10 ^−19 · V ] ]', 'λ = [ 1.227 × 10 ^−9 | √[ V ] ] "m"']} />
        <p>That is, <M>λ = 1.227 / √[ V ] "nm"</M> with <M>V</M> in volts. At 100 V the wavelength is 0.123 nm, about the size of an atom, which makes it ideal for probing crystals.</p>
        <figure className="t-figure">
          <VoltageWavelength />
          <figcaption>More volts, shorter wavelength. This is the principle behind the electron microscope: a short wavelength shows fine detail.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-scale">
        <SectionHead n={no('scale')} title="Why we do not see matter waves" />
        <p>
          A cricket ball also has a wavelength, but a hopelessly small one. For a 0.15 kg ball at 30 m/s, <M>λ = h / ( m · v )</M> is about <M>10 ^−34 "m"</M>: a billion billion times smaller than a nucleus. No opening is small enough to show diffraction. Wave effects need a wavelength comparable with the sizes involved, which only happens for light particles like electrons.
        </p>
        <figure className="t-figure">
          <Scale />
          <figcaption>On a scale of wavelengths, an electron at 100 V sits right at the size of an atom. A cricket ball is out of sight, far beyond anything that could be measured.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-davisson">
        <SectionHead n={no('davisson')} title="Davisson and Germer" />
        <p>
          Was de Broglie right? In 1927 Davisson and Germer fired a beam of electrons at a nickel crystal and measured how many scattered at each angle. At most voltages the scattering was smooth. But at <strong>54 V</strong> there was a strong peak at <M>φ = 50°</M>.
        </p>
        <p>
          That is exactly what waves do. The rows of atoms on the crystal surface act like a diffraction grating of spacing <M>d = 0.215 "nm"</M>. The waves scattered by neighbouring atoms are in step, and add up, only when their path difference <M>d · sin φ</M> is a whole number of wavelengths. For the first peak:
        </p>
        <Eq src={['d · sin φ = λ', 'λ = 0.215 · sin 50° = 0.165 "nm"']} />
        <p>
          The de Broglie formula for 54 V predicts <M>λ = 1.227 / √[ 54 ] = 0.167 "nm"</M>. The two values agree within about 1%. Electrons really do behave as waves.
        </p>
        <figure className="t-figure">
          <CrystalDiffraction />
          <figcaption>As the angle changes, the path difference between neighbouring atoms sweeps through a whole wavelength at one angle. That is where the scattered beam is strong.</figcaption>
        </figure>
        <p>G. P. Thomson found the same thing independently, with electron beams through thin foils. Later, atoms, neutrons and even large molecules all showed diffraction.</p>
      </section>

      <section className="t-section" id="t-fringes">
        <SectionHead n={no('fringes')} title="Electrons through two slits" />
        <p>
          Send electrons through a double slit <em>one at a time</em>. Each electron lands at one point, like a particle. Yet after thousands of electrons, the dots form the bright and dark fringes of a wave interference pattern. Each electron seems to go through both slits and interfere with itself.
        </p>
        <figure className="t-figure">
          <ElectronFringes />
          <figcaption>Early on the dots look random. Slowly, the fringes appear, with the bright ones where the wave is large and the dark ones where it cancels.</figcaption>
        </figure>
        <p>
          The way to read this: the wave tells us the <em>probability</em> of finding the electron at each place. The intensity of the wave at a point is proportional to the chance of detecting a particle there. One electron lands in one place, but where it lands is governed by the wave. The fringes are the statistics of many electrons.
        </p>
        <Note label="Dual nature">An electron is not sometimes a wave and sometimes a particle. It is something new that is detected as a particle and travels as a wave. Which side you see depends on the experiment you do.</Note>
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
                  ['Photon energy', 'E = h · ν = [ h · c | λ ]'],
                  ['In eV and nm', 'E = [ 1240 | λ ]'],
                  ['Photon momentum', 'p = [ h | λ ] = [ E | c ]'],
                  ['Intensity of a beam', 'I = N · h · ν'],
                  ["Einstein's equation", 'h · ν = φ _0 + K _max'],
                  ['Threshold frequency', 'ν _0 = [ φ _0 | h ]'],
                  ['Threshold wavelength', 'λ _0 = [ h · c | φ _0 ]'],
                  ['Stopping potential', 'e · V _0 = K _max'],
                  ['Stopping potential line', 'V _0 = [ h | e ] · ν − [ φ _0 | e ]'],
                  ['Maximum speed', 'v _max = √[ [ 2 · K _max | m ] ]'],
                  ['de Broglie wavelength', 'λ = [ h | p ] = [ h | m · v ]'],
                  ['From kinetic energy', 'λ = [ h | √[ 2 · m · K ] ]'],
                  ['Electron through V volts', 'λ = [ 1.227 | √[ V ] ] "nm"'],
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
        <h3 className="t-h3">The constants</h3>
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
                  ['h', "Planck's constant", '6.63 × 10⁻³⁴ J s'],
                  ['c', 'Speed of light', '3.00 × 10⁸ m/s'],
                  ['e', 'Elementary charge', '1.6 × 10⁻¹⁹ C'],
                  ['m', 'Electron mass', '9.11 × 10⁻³¹ kg'],
                  ['hc', 'Planck constant times speed of light', '1240 eV nm'],
                  ['1 eV', 'Electron volt', '1.6 × 10⁻¹⁹ J'],
                ] as const
              ).map(([sym, meaning, v]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Energy of a photon">
          <p className="ex-q">Find the frequency and the energy of a photon of violet light with a wavelength of 400 nm. Give the energy in joules and in electron volts.</p>
          <Given items={['λ = 400 "nm"', 'c = 3 × 10 ^8 "m/s"', 'h = 6.63 × 10 ^−34 "J s"']} />
          <ol className="steps">
            <Step title="Frequency">
              <Eq src='ν = [ c | λ ] = [ 3 × 10 ^8 | 400 × 10 ^−9 ] = 7.5 × 10 ^14 "Hz"' />
            </Step>
            <Step title="Energy in joules">
              <Eq src='E = h · ν = 6.63 × 10 ^−34 · 7.5 × 10 ^14 = 4.97 × 10 ^−19 "J"' />
            </Step>
            <Step title="Energy in electron volts">
              <Eq src={['E = [ 4.97 × 10 ^−19 | 1.6 × 10 ^−19 ] = 3.1 "eV"', 'E = [ 1240 | 400 ] = 3.10 "eV"']} />
            </Step>
          </ol>
          <Answer>7.5 × 10¹⁴ Hz and 4.97 × 10⁻¹⁹ J, which is 3.1 eV. The shortcut 1240 / λ gives it at once.</Answer>
          <figure className="t-figure">
            <PhotonEnergy />
          </figure>
        </Example>

        <Example n={2} title="Light on potassium">
          <p className="ex-q">Light of wavelength 400 nm falls on potassium, whose work function is 2.30 eV. Find the maximum kinetic energy of the electrons, the stopping potential, the maximum speed, and the threshold wavelength.</p>
          <Given items={['λ = 400 "nm"', 'φ _0 = 2.30 "eV"', 'm = 9.11 × 10 ^−31 "kg"']} />
          <ol className="steps">
            <Step title="Photon energy">
              <Eq src='E = [ 1240 | 400 ] = 3.10 "eV"' />
            </Step>
            <Step title="Maximum kinetic energy">
              <Eq src='K _max = h · ν − φ _0 = 3.10 − 2.30 = 0.80 "eV"' />
            </Step>
            <Step title="Stopping potential">
              <Eq src='V _0 = [ K _max | e ] = 0.80 "V"' />
            </Step>
            <Step title="Maximum speed (convert to joules first)">
              <Eq src={['K _max = 0.80 · 1.6 × 10 ^−19 = 1.28 × 10 ^−19 "J"', 'v _max = √[ [ 2 · K _max | m ] ] = √[ [ 2 · 1.28 × 10 ^−19 | 9.11 × 10 ^−31 ] ] = 5.3 × 10 ^5 "m/s"']} />
            </Step>
            <Step title="Threshold wavelength">
              <Eq src='λ _0 = [ 1240 | φ _0 ] = [ 1240 | 2.30 ] = 539 "nm"' />
            </Step>
          </ol>
          <Answer>0.80 eV, 0.80 V, 5.3 × 10⁵ m/s, and the threshold is 539 nm: any light with a longer wavelength cannot free electrons from potassium.</Answer>
          <figure className="t-figure">
            <EnergyBudget />
          </figure>
        </Example>

        <Example n={3} title="Too red to work">
          <p className="ex-q">Will bright orange light of wavelength 600 nm free electrons from potassium (<M>φ _0 = 2.30 "eV"</M>)? What changes if the light is made ten times brighter?</p>
          <Given items={['λ = 600 "nm"', 'φ _0 = 2.30 "eV"']} />
          <ol className="steps">
            <Step title="Photon energy">
              <Eq src='E = [ 1240 | 600 ] = 2.07 "eV"' />
            </Step>
            <Step title="Compare with the work function">
              <Eq src='2.07 "eV" < 2.30 "eV"' />
              <p>Each photon falls short by 0.23 eV.</p>
            </Step>
          </ol>
          <Answer>No electrons are emitted. Making the light ten times brighter sends ten times more photons, but each is still too weak, and an electron cannot combine two photons. The wavelength 600 nm is above the 539 nm threshold.</Answer>
          <figure className="t-figure">
            <ThresholdCompare />
          </figure>
        </Example>

        <Example n={4} title="Counting photons">
          <p className="ex-q">A 1.0 mW beam of 400 nm light falls on potassium. How many photons arrive each second? If one photon in a thousand frees an electron, what is the photocurrent?</p>
          <Given items={['P = 1.0 × 10 ^−3 "W"', 'E = 3.1 "eV" = 4.96 × 10 ^−19 "J"']} />
          <ol className="steps">
            <Step title="Photons per second">
              <Eq src='N = [ P | E ] = [ 1.0 × 10 ^−3 | 4.96 × 10 ^−19 ] = 2.0 × 10 ^15 "per second"' />
            </Step>
            <Step title="Electrons per second">
              <Eq src='N _e = [ N | 1000 ] = 2.0 × 10 ^12 "per second"' />
            </Step>
            <Step title="Current">
              <Eq src='I = N _e · e = 2.0 × 10 ^12 · 1.6 × 10 ^−19 = 3.2 × 10 ^−7 "A"' />
            </Step>
          </ol>
          <Answer>2.0 × 10¹⁵ photons per second, and a current of 0.32 µA. If every photon freed an electron the current would be 0.32 mA.</Answer>
          <figure className="t-figure">
            <PhotonStream />
          </figure>
        </Example>

        <Example n={5} title="Finding h from a graph">
          <p className="ex-q">In an experiment the stopping potential for a metal was 1.00 V for light of wavelength 400 nm and 2.03 V for 300 nm. Find Planck's constant and the work function.</p>
          <Given items={['V _0 = 1.00 "V" at 400 "nm"', 'V _0 = 2.03 "V" at 300 "nm"']} />
          <ol className="steps">
            <Step title="Frequencies">
              <Eq src={['ν _1 = [ 3 × 10 ^8 | 400 × 10 ^−9 ] = 7.5 × 10 ^14 "Hz"', 'ν _2 = [ 3 × 10 ^8 | 300 × 10 ^−9 ] = 1.0 × 10 ^15 "Hz"']} />
            </Step>
            <Step title="Slope of the line gives h / e">
              <Eq src={['h = e · [ Δ V _0 | Δ ν ] = 1.6 × 10 ^−19 · [ 2.03 − 1.00 | 1.0 × 10 ^15 − 7.5 × 10 ^14 ]', 'h = 1.6 × 10 ^−19 · [ 1.03 | 2.5 × 10 ^14 ] = 6.6 × 10 ^−34 "J s"']} />
            </Step>
            <Step title="Work function from one point">
              <Eq src='φ _0 = h · ν − e · V _0 = 3.10 − 1.00 = 2.10 "eV"' />
            </Step>
          </ol>
          <Answer>h = 6.6 × 10⁻³⁴ J s and φ₀ = 2.10 eV, close to the accepted values. Check with the other point: 4.13 − 2.03 = 2.10 eV.</Answer>
          <figure className="t-figure">
            <StoppingGraph />
          </figure>
        </Example>

        <Example n={6} title="Wavelength of an electron">
          <p className="ex-q">An electron is accelerated from rest through 100 V. Find its speed and de Broglie wavelength.</p>
          <Given items={['V = 100 "V"', 'm = 9.11 × 10 ^−31 "kg"', 'e = 1.6 × 10 ^−19 "C"']} />
          <ol className="steps">
            <Step title="Kinetic energy and speed">
              <Eq src={['K = e · V = 1.6 × 10 ^−19 · 100 = 1.6 × 10 ^−17 "J"', 'v = √[ [ 2 · K | m ] ] = √[ [ 3.2 × 10 ^−17 | 9.11 × 10 ^−31 ] ] = 5.9 × 10 ^6 "m/s"']} />
            </Step>
            <Step title="Wavelength">
              <Eq src='λ = [ h | m · v ] = [ 6.63 × 10 ^−34 | 9.11 × 10 ^−31 · 5.93 × 10 ^6 ] = 1.23 × 10 ^−10 "m"' />
            </Step>
            <Step title="Check with the shortcut">
              <Eq src='λ = [ 1.227 | √[ 100 ] ] = 0.123 "nm"' />
            </Step>
          </ol>
          <Answer>The speed is 5.9 × 10⁶ m/s (2% of the speed of light), and the wavelength is 0.123 nm, about the size of an atom.</Answer>
          <figure className="t-figure">
            <VoltageWavelength />
          </figure>
        </Example>

        <Example n={7} title="A cricket ball">
          <p className="ex-q">Find the de Broglie wavelength of a 0.15 kg cricket ball moving at 30 m/s.</p>
          <Given items={['m = 0.15 "kg"', 'v = 30 "m/s"']} />
          <ol className="steps">
            <Step title="Momentum">
              <Eq src='p = m · v = 0.15 · 30 = 4.5 "kg m/s"' />
            </Step>
            <Step title="Wavelength">
              <Eq src='λ = [ h | p ] = [ 6.63 × 10 ^−34 | 4.5 ] = 1.5 × 10 ^−34 "m"' />
            </Step>
          </ol>
          <Answer>1.5 × 10⁻³⁴ m. A nucleus is about 10⁻¹⁴ m across, so this wavelength is about 10²⁰ times smaller than a nucleus. No wave effect can ever be seen.</Answer>
          <figure className="t-figure">
            <Scale />
          </figure>
        </Example>

        <Example n={8} title="A photon and an electron of the same wavelength">
          <p className="ex-q">Find the momentum of a 500 nm photon. At what speed must an electron move to have the same wavelength?</p>
          <Given items={['λ = 500 "nm"']} />
          <ol className="steps">
            <Step title="Photon momentum">
              <Eq src='p = [ h | λ ] = [ 6.63 × 10 ^−34 | 500 × 10 ^−9 ] = 1.33 × 10 ^−27 "kg m/s"' />
            </Step>
            <Step title="The electron has the same momentum">
              <Eq src='v = [ p | m ] = [ 1.33 × 10 ^−27 | 9.11 × 10 ^−31 ] = 1.46 × 10 ^3 "m/s"' />
            </Step>
          </ol>
          <Answer>The photon has momentum 1.33 × 10⁻²⁷ kg m/s, and a slow electron of 1.46 km/s (an energy of only 6 × 10⁻⁶ eV) has the same wavelength.</Answer>
          <figure className="t-figure">
            <DeBroglie />
          </figure>
        </Example>

        <Example n={9} title="Davisson and Germer's check">
          <p className="ex-q">Electrons accelerated through 54 V strike a nickel crystal with surface atoms 0.215 nm apart. Compare the predicted de Broglie wavelength with the wavelength found from a peak at 50°.</p>
          <Given items={['V = 54 "V"', 'd = 0.215 "nm"', 'φ = 50°']} />
          <ol className="steps">
            <Step title="Predicted from de Broglie">
              <Eq src='λ = [ 1.227 | √[ 54 ] ] = [ 1.227 | 7.35 ] = 0.167 "nm"' />
            </Step>
            <Step title="Measured from the peak">
              <Eq src='λ = d · sin φ = 0.215 · sin 50° = 0.215 · 0.766 = 0.165 "nm"' />
            </Step>
          </ol>
          <Answer>0.167 nm predicted and 0.165 nm measured: they agree within 1.5%. This was the first direct proof of the wave nature of the electron.</Answer>
          <figure className="t-figure">
            <CrystalDiffraction />
          </figure>
        </Example>

        <Example n={10} title="A photon and an electron of the same energy">
          <p className="ex-q">Find the wavelength of a photon of energy 1 eV, and of an electron of kinetic energy 1 eV. Which is better for seeing small details?</p>
          <Given items={['E = 1 "eV"']} />
          <ol className="steps">
            <Step title="Photon">
              <Eq src='λ = [ 1240 | 1 ] = 1240 "nm"' />
            </Step>
            <Step title="Electron">
              <Eq src='λ = [ 1.227 | √[ 1 ] ] = 1.23 "nm"' />
            </Step>
          </ol>
          <Answer>The photon has 1240 nm (infrared), and the electron 1.23 nm, a thousand times shorter. That is why electron microscopes resolve much finer detail than light microscopes.</Answer>
          <figure className="t-figure">
            <PhotonEnergy />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Brighter light gives faster electrons" wrong="K _max ∝ I" fig={<IVCurves mode="intensity" />}>
            Brightness only means more photons, and so more electrons. Each photon still has the same energy, so the maximum kinetic energy and the stopping potential do not change. The <em>current</em> goes up.
          </Mistake>
          <Mistake title="Wait long enough and any light will work" wrong={'ν < ν _0 → wait longer'} fig={<ThresholdCompare />}>
            An electron absorbs one photon at a time, and cannot save up. If one photon is too weak, no amount of waiting or brightness helps. The frequency must exceed the threshold.
          </Mistake>
          <Mistake title="Stopping potential depends on intensity" wrong="V _0 ∝ I" fig={<Retarding />}>
            The stopping potential measures the energy of the fastest electron, which depends on the frequency and the metal only: <M>e · V _0 = h · ν − φ _0</M>.
          </Mistake>
          <Mistake title="The electron gets all the photon's energy" wrong="K _max = h · ν" fig={<EnergyBudget />}>
            Part of it, <M>φ _0</M>, is spent getting out of the metal. Only the leftover, <M>h · ν − φ _0</M>, is kinetic energy.
          </Mistake>
          <Mistake title="Heavier particles have longer matter waves" wrong="λ ∝ m" fig={<DeBroglie />}>
            It is the opposite. <M>λ = h / ( m · v )</M>, so for the same speed a heavier particle has a shorter wavelength.
          </Mistake>
          <Mistake title="A photon has no momentum, since it has no mass" wrong={'p = m · v = 0 "for a photon"'} fig={<PhotonEnergy />}>
            A photon does carry momentum, <M>p = h / λ = E / c</M>. The formula <M>p = m · v</M> only holds for slow particles with mass.
          </Mistake>
          <Mistake title="A single electron paints the whole pattern" wrong={'1 electron → whole fringe pattern'} fig={<ElectronFringes />}>
            One electron makes one dot. The fringes appear only after many electrons, because the wave only gives the <em>probability</em> of each landing place.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Light arrives as particles and travels as a wave, and so does matter.</p>
        <p className="closing-sub">Next: atoms. If electrons are waves, only some orbits will fit round a nucleus, and that gives the pattern of lines in the spectrum of hydrogen.</p>
      </footer>
    </ChapterShell>
  );
}
