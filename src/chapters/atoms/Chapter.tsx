import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { BohrOrbits, ClosestApproach, Distribution, EnergyBars, ForceBalance, GeigerMarsden, ImpactSweep, Levels, NucleusScale, PuddingScatter, RutherfordPaths, SeriesSpectrum, SpectraTypes, Spiral, StandingWaveOrbit } from './AtomsAnims';

/** Atoms: Rutherford scattering, the Bohr model, energy levels and the hydrogen spectrum. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'What is inside an atom?', group: 'Theory' },
  { id: 'scattering', title: 'The alpha-scattering experiment', group: 'Theory' },
  { id: 'nucleus', title: "Rutherford's nuclear atom", group: 'Theory' },
  { id: 'approach', title: 'Distance of closest approach', group: 'Theory' },
  { id: 'impact', title: 'Impact parameter and scattering angle', group: 'Theory' },
  { id: 'problems', title: 'Where the nuclear atom falls short', group: 'Theory' },
  { id: 'spectra', title: 'Atomic spectra', group: 'Theory' },
  { id: 'series', title: 'The hydrogen series', group: 'Theory' },
  { id: 'bohr', title: "Bohr's postulates", group: 'Theory' },
  { id: 'radius', title: 'Radius of the orbits', group: 'Theory' },
  { id: 'energy', title: 'Energy of the electron', group: 'Theory' },
  { id: 'levels', title: 'Energy levels', group: 'Theory' },
  { id: 'photons', title: 'Photons from jumps', group: 'Theory' },
  { id: 'debroglie', title: "De Broglie's explanation", group: 'Theory' },
  { id: 'limits', title: 'Limits of the Bohr model', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="atoms" film={buildFilm} sections={SECTIONS} sideTitle="Atoms" sideLead="How scattering alpha particles exposed the nucleus, and how the lines in the light from hydrogen revealed the rules of the electron's energies.">
      <header className="article-head">
        <span className="kicker">Physics · Atoms</span>
        <h1 className="article-title">What does an atom look like inside?</h1>
        <p className="article-lead">Atoms are far too small to see, so we learn about them the way we learn about a hidden object: by throwing things at it and watching what bounces off, and by studying the light it gives out. Two clues, a few alpha particles that bounced straight back and a set of sharp lines of colour, led to the picture of the atom we use today.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="What is inside an atom?" />
        <p>
          By 1897, J. J. Thomson had shown that every atom contains tiny, negatively charged <strong>electrons</strong>, about 1800 times lighter than the lightest atom. Atoms are neutral, so there must be an equal amount of positive charge somewhere. But where?
        </p>
        <p>
          Thomson's answer was the <strong>plum pudding model</strong>: the positive charge and most of the mass spread evenly through a sphere about <M>10 ^−10 "m"</M> across, with the electrons stuck in it like plums in a pudding. A sphere of positive charge pulls on a passing charged particle only gently, and from all sides at once.
        </p>
        <figure className="t-figure">
          <PuddingScatter />
          <figcaption>In the pudding model, a fast positively charged particle is nudged only a little at every point, so it should sail through with just a slight bend.</figcaption>
        </figure>
        <p>It was a good guess, and it made a clear prediction. Rutherford's group put it to the test.</p>
      </section>

      <section className="t-section" id="t-scattering">
        <SectionHead n={no('scattering')} title="The alpha-scattering experiment" />
        <p>
          In 1909, Geiger and Marsden, working under Rutherford, fired <strong>alpha particles</strong> at a very thin gold foil, only about <M>2 × 10 ^−7 "m"</M> thick (about a thousand atoms thick). An alpha particle is a helium nucleus: charge <M>+ 2 · e</M> and a mass about 7300 times that of an electron. The source was radioactive bismuth, giving alpha particles of about 5.5 MeV. A zinc sulphide screen gave a tiny flash of light whenever an alpha particle hit it, and a microscope on a rotating arm counted the flashes at each angle.
        </p>
        <figure className="t-figure">
          <GeigerMarsden />
          <figcaption>Most particles go straight on. A few are bent by a large angle, and now and then one comes right back toward the source.</figcaption>
        </figure>
        <h3 className="t-h3">What they saw</h3>
        <ul className="t-list">
          <li><strong>Most</strong> alpha particles passed through the foil with almost no change in direction.</li>
          <li>A <strong>small number</strong> were bent through noticeable angles.</li>
          <li>About <strong>one in 8000</strong> was deflected by more than 90°, and a few came straight back.</li>
        </ul>
        <p>
          The last observation shocked Rutherford: "It was almost as incredible as if you fired a 15-inch shell at a piece of tissue paper and it came back and hit you."
        </p>
        <p>
          The pudding model cannot do this. A single electron is far too light to turn a heavy alpha particle, just as a pea cannot turn a bowling ball. And a spread-out positive charge pulls only weakly. To send an alpha particle straight back, we need a <em>strong</em> force, which means a very large positive charge in a very small space.
        </p>
      </section>

      <section className="t-section" id="t-nucleus">
        <SectionHead n={no('nucleus')} title="Rutherford's nuclear atom" />
        <p>
          In 1911 Rutherford drew the conclusion. Nearly all the mass and all the positive charge of an atom are packed into a tiny core, the <strong>nucleus</strong>, less than <M>10 ^−14 "m"</M> across. The electrons move around it, far outside, in the rest of the atom of radius about <M>10 ^−10 "m"</M>. The atom is mostly empty space.
        </p>
        <figure className="t-figure">
          <NucleusScale />
          <figcaption>Zooming in on the centre by a factor of a hundred thousand: the nucleus is to the atom what a pea is to a stadium.</figcaption>
        </figure>
        <p>
          Why do most alpha particles go straight through? Because most of them pass far from any nucleus, where the electric force is weak. Only the rare one that comes very close to a nucleus feels a strong repulsion and bends. Because the nucleus is so small, direct hits are rare, which explains the fraction of one in 8000.
        </p>
        <p>
          A nucleus repels the alpha particle with the Coulomb force, so we can follow the path of each one. They are hyperbolas, like the paths of a comet past the Sun, but pushed away instead of pulled in.
        </p>
        <figure className="t-figure">
          <RutherfordPaths />
          <figcaption>Aim a particle straight at the nucleus and it stops and returns. Aim to one side and it is bent by a smaller angle, the farther away the aim.</figcaption>
        </figure>
        <p>
          Rutherford worked out how many particles should arrive at each angle: the number goes as <M>1 / sin ^4 ( θ / 2 )</M>. The counts of Geiger and Marsden fitted that law over a range of angles and also supported the idea that the charge on the nucleus is proportional to the atomic number <M>Z</M>.
        </p>
        <figure className="t-figure">
          <Distribution />
          <figcaption>Many particles at small angles, very few at large angles, following the curve of the Rutherford prediction (shown on a logarithmic scale).</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-approach">
        <SectionHead n={no('approach')} title="Distance of closest approach" />
        <p>
          Suppose an alpha particle of kinetic energy <M>K</M> is fired straight at a nucleus of charge <M>Z · e</M>. As it gets closer, the repulsion slows it down. Its kinetic energy changes into electric potential energy. It stops for an instant at a distance <M>r _0</M> from the nucleus and is then pushed straight back.
        </p>
        <figure className="t-figure">
          <ClosestApproach />
          <figcaption>The bars always add up to the same total: what is lost as kinetic energy is stored as potential energy. At <M>r _0</M> all of it is potential.</figcaption>
        </figure>
        <p>
          The potential energy of two point charges <M>q _1</M> and <M>q _2</M> a distance <M>r</M> apart is <M>[ 1 | 4 · π · ε _0 ] · [ q _1 · q _2 | r ]</M>. Here <M>q _1 = 2 · e</M> and <M>q _2 = Z · e</M>. At the turning point all the kinetic energy has become potential energy:
        </p>
        <Eq src={['K = [ 1 | 4 · π · ε _0 ] · [ ( 2 · e ) · ( Z · e ) | r _0 ]', 'K = [ 1 | 4 · π · ε _0 ] · [ 2 · Z · e ^2 | r _0 ]']} />
        <p>Solve for the distance:</p>
        <Eq src='r _0 = [ 1 | 4 · π · ε _0 ] · [ 2 · Z · e ^2 | K ]' />
        <p>
          It helps to know that <M>e ^2 / ( 4 · π · ε _0 ) = 1.44 "MeV fm"</M> (where <M>1 "fm" = 10 ^−15 "m"</M>), which gives
        </p>
        <Eq src='r _0 = [ 2 · Z · 1.44 "MeV fm" | K ]' />
        <p>
          The alpha particle cannot get closer than <M>r _0</M>, so the nucleus must be smaller than this. For 5.5 MeV particles on gold (<M>Z = 79</M>), <M>r _0 = 41 "fm"</M>. Rutherford took this as an upper limit on the size of the nucleus. Faster alpha particles come closer, and when they get to within about 7 fm of gold, the Rutherford law stops working, because then the nuclear force takes over.
        </p>
      </section>

      <section className="t-section" id="t-impact">
        <SectionHead n={no('impact')} title="Impact parameter and scattering angle" />
        <p>
          Most alpha particles are not aimed straight at a nucleus. The perpendicular distance between the nucleus and the original line of motion of the particle is the <strong>impact parameter</strong> <M>b</M>. A head-on collision has <M>b = 0</M>. A bigger <M>b</M> means a gentler pass.
        </p>
        <p>
          Working out the hyperbolic orbit gives the angle <M>θ</M> through which the particle is scattered:
        </p>
        <Eq src={['b = [ 1 | 4 · π · ε _0 ] · [ Z · e ^2 | K ] · cot ( [ θ | 2 ] )', 'b = [ r _0 | 2 ] · cot ( [ θ | 2 ] )']} />
        <p>
          The second form follows by comparing with <M>r _0 = 2 · Z · e ^2 / ( 4 · π · ε _0 · K )</M> from the last section. Notice the limits. For <M>b = 0</M> the cotangent must be zero, so <M>θ = 180°</M>: head-on, back where it came from. For a large <M>b</M> the cotangent is large, so <M>θ</M> is small.
        </p>
        <figure className="t-figure">
          <ImpactSweep />
          <figcaption>The aim <M>b</M> shrinks and the scattering angle grows. At <M>b = r _0 / 2</M> the angle is exactly 90°.</figcaption>
        </figure>
        <p>
          Since the nucleus is tiny compared with the atom, only a particle with a very small impact parameter turns through a large angle. That is why large-angle scattering is rare, and counting the particles at each angle tells us about the nucleus.
        </p>
      </section>

      <section className="t-section" id="t-problems">
        <SectionHead n={no('problems')} title="Where the nuclear atom falls short" />
        <p>Rutherford's atom raises two problems that classical physics cannot solve.</p>
        <p>
          <strong>It is not stable.</strong> An electron going round a circle is accelerating, and Maxwell's theory says an accelerating charge radiates electromagnetic waves. So the electron should keep losing energy and spiral into the nucleus in about <M>10 ^−11 "s"</M>, a tiny fraction of a second. But atoms last for ever.
        </p>
        <figure className="t-figure">
          <Spiral />
          <figcaption>Left: what classical physics predicts. Right: what is actually found, atoms that stay the same size without radiating.</figcaption>
        </figure>
        <p>
          <strong>It predicts the wrong light.</strong> As the electron spirals in, its orbit shrinks continuously, so it should give out light of every frequency in a smooth band. But atoms give out light at certain colours only.
        </p>
      </section>

      <section className="t-section" id="t-spectra">
        <SectionHead n={no('spectra')} title="Atomic spectra" />
        <p>
          Split the light from a source into its colours with a prism or grating and we see its <strong>spectrum</strong>. A hot solid, such as the filament of a bulb, gives a <strong>continuous spectrum</strong>: all colours merge into one another. A hot gas of a single element, such as hydrogen in a discharge tube, gives an <strong>emission line spectrum</strong>: a few sharp bright lines at definite wavelengths on a dark background.
        </p>
        <p>
          When white light passes through a cool gas, the gas takes out exactly the same wavelengths it would emit, leaving dark lines in the continuous background. This is an <strong>absorption spectrum</strong>. The dark Fraunhofer lines in sunlight come from gases in the Sun's outer layers.
        </p>
        <figure className="t-figure">
          <SpectraTypes />
          <figcaption>The bright lines of the hot gas and the dark lines of the cool gas sit at the same four wavelengths, the visible lines of hydrogen.</figcaption>
        </figure>
        <p>
          Each element has its own pattern of lines, like a fingerprint. That is how astronomers know what stars are made of. The pattern must be telling us something about the inside of the atom.
        </p>
      </section>

      <section className="t-section" id="t-series">
        <SectionHead n={no('series')} title="The hydrogen series" />
        <p>
          Hydrogen, the simplest atom, has the simplest spectrum. In 1885, Balmer found a formula that fits the four visible lines (656.3, 486.1, 434.1 and 410.2 nm), and later others in the ultraviolet. Rydberg generalised it:
        </p>
        <Eq src='[ 1 | λ ] = R · ( [ 1 | n _f ^2 ] − [ 1 | n _i ^2 ] )' />
        <p>
          where <M>n _f</M> and <M>n _i</M> are whole numbers with <M>n _i &gt; n _f</M>, and <M>R = 1.097 × 10 ^7 "m⁻¹"</M> is the <strong>Rydberg constant</strong>. Each choice of <M>n _f</M> gives a family of lines, a <strong>series</strong>:
        </p>
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Series</th>
                <th scope="col">Ends on</th>
                <th scope="col">Region</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['Lyman', 'n = 1', 'ultraviolet'],
                  ['Balmer', 'n = 2', 'visible and near ultraviolet'],
                  ['Paschen', 'n = 3', 'infrared'],
                  ['Brackett', 'n = 4', 'infrared'],
                  ['Pfund', 'n = 5', 'far infrared'],
                ] as const
              ).map(([s, e, r]) => (
                <tr key={s}>
                  <th scope="row">{s}</th>
                  <td>{e}</td>
                  <td>{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          For a series, the lines crowd closer and closer together as <M>n _i</M> grows, and stop at a <strong>series limit</strong> where <M>n _i → ∞</M>:
        </p>
        <Eq src='[ 1 | λ _limit ] = [ R | n _f ^2 ]' />
        <figure className="t-figure">
          <SeriesSpectrum />
          <figcaption>Plotted against <M>1 / λ</M>, the lines of each series bunch up toward a limit. The series do not overlap: they are in the ultraviolet, visible and infrared.</figcaption>
        </figure>
        <p>
          The formula worked perfectly, but nobody knew why. It took Bohr to explain where it came from.
        </p>
      </section>

      <section className="t-section" id="t-bohr">
        <SectionHead n={no('bohr')} title="Bohr's postulates" />
        <p>
          In 1913 Niels Bohr kept Rutherford's picture, an electron going round a nucleus, but added three rules that go beyond classical physics. They apply to hydrogen, and to similar ions with a single electron such as <M>"He" ^+</M>.
        </p>
        <ol className="t-list">
          <li>
            <strong>Stationary orbits.</strong> An electron can move only in certain circular orbits. While it stays in one, it does <em>not</em> radiate, even though it is accelerating.
          </li>
          <li>
            <strong>Quantised angular momentum.</strong> The allowed orbits are those where the angular momentum of the electron is a whole number of units of <M>h / 2 · π</M>:
            <Eq src='L = m · v · r = n · [ h | 2 · π ] ,   n = 1 , 2 , 3 , …' />
          </li>
          <li>
            <strong>Jumps give photons.</strong> An electron can jump from one allowed orbit to another. In a jump down, the energy lost leaves as one photon. In a jump up, one photon of exactly the right energy is absorbed:
            <Eq src='h · ν = E _i − E _f' />
          </li>
        </ol>
        <p>
          The integer <M>n</M> is the <strong>principal quantum number</strong>. With these rules we can work out the size, speed and energy of every orbit.
        </p>
      </section>

      <section className="t-section" id="t-radius">
        <SectionHead n={no('radius')} title="Radius of the orbits" />
        <p>
          Take an electron of mass <M>m</M> and charge <M>− e</M> going round a nucleus of charge <M>+ Z · e</M> (<M>Z = 1</M> for hydrogen) at a speed <M>v</M> in a circle of radius <M>r</M>. The electric pull of the nucleus is the force that bends its path into a circle:
        </p>
        <figure className="t-figure">
          <ForceBalance />
          <figcaption>The velocity is along the circle, and the force points inward. The inward pull and the force needed for circular motion are one and the same.</figcaption>
        </figure>
        <Eq src='[ m · v ^2 | r ] = [ 1 | 4 · π · ε _0 ] · [ Z · e ^2 | r ^2 ]' />
        <p>
          That is one equation with two unknowns, <M>v</M> and <M>r</M>. The second postulate gives the other: <M>m · v · r = n · h / ( 2 · π )</M>, so
        </p>
        <Eq src='v = [ n · h | 2 · π · m · r ]' />
        <p>Substitute this speed into the force equation:</p>
        <Eq src={['[ m | r ] · [ n ^2 · h ^2 | 4 · π ^2 · m ^2 · r ^2 ] = [ 1 | 4 · π · ε _0 ] · [ Z · e ^2 | r ^2 ]', '[ n ^2 · h ^2 | 4 · π ^2 · m · r ^3 ] = [ Z · e ^2 | 4 · π · ε _0 · r ^2 ]']} />
        <p>Multiply both sides by <M>r ^3</M> and tidy up, then solve for <M>r</M>:</p>
        <Eq src={['r = [ n ^2 · h ^2 · ε _0 | π · m · Z · e ^2 ]', 'r _n = n ^2 · [ a _0 | Z ] ,   a _0 = [ ε _0 · h ^2 | π · m · e ^2 ]']} />
        <p>
          Putting in the numbers, <M>a _0 = 0.529 × 10 ^−10 "m"</M>, called the <strong>Bohr radius</strong>: the radius of the smallest orbit of hydrogen, the size of the atom in its ground state. The radii go as <M>n ^2</M>: 1, 4, 9, 16 … times <M>a _0</M>.
        </p>
        <figure className="t-figure">
          <BohrOrbits />
          <figcaption>The radii grow as the square of <M>n</M>. The electron in a bigger orbit goes more slowly and takes far longer for each lap.</figcaption>
        </figure>
        <h3 className="t-h3">The speed</h3>
        <p>Put <M>r _n</M> back into <M>v = n · h / ( 2 · π · m · r )</M>:</p>
        <Eq src={['v _n = [ n · h | 2 · π · m ] · [ π · m · Z · e ^2 | n ^2 · h ^2 · ε _0 ]', 'v _n = [ Z | n ] · [ e ^2 | 2 · ε _0 · h ] = [ Z | n ] · 2.19 × 10 ^6 "m/s"']} />
        <p>This is <M>c / 137</M> for <M>n = 1</M>, so the electron in hydrogen goes at about 0.7% of the speed of light, and the faster it goes the closer it is to the nucleus. The speed goes <em>down</em> as <M>n</M> goes up.</p>
      </section>

      <section className="t-section" id="t-energy">
        <SectionHead n={no('energy')} title="Energy of the electron" />
        <p>
          The energy of the electron is its kinetic energy plus the electric potential energy (taken as zero when the electron is far away). From the force equation, <M>m · v ^2 = Z · e ^2 / ( 4 · π · ε _0 · r )</M>, so
        </p>
        <Eq src={['K = [ 1 | 2 ] · m · v ^2 = [ 1 | 2 ] · [ Z · e ^2 | 4 · π · ε _0 · r ]', 'U = − [ Z · e ^2 | 4 · π · ε _0 · r ]']} />
        <p>The kinetic energy is half the size of the potential energy, and positive; the potential energy is negative. Add them:</p>
        <Eq src='E = K + U = − [ Z · e ^2 | 8 · π · ε _0 · r ] = − K' />
        <p>
          The total energy is <strong>negative</strong>. That means the electron is <em>bound</em>: we have to supply energy to pull it away. Now put in the radius <M>r _n</M> from the last section:
        </p>
        <Eq src={['E _n = − [ Z · e ^2 | 8 · π · ε _0 ] · [ π · m · Z · e ^2 | n ^2 · h ^2 · ε _0 ]', 'E _n = − [ m · Z ^2 · e ^4 | 8 · ε _0 ^2 · h ^2 ] · [ 1 | n ^2 ]']} />
        <p>Evaluating the constants:</p>
        <Eq src='E _n = − 13.6 "eV" · [ Z ^2 | n ^2 ]' />
        <p>
          For hydrogen, <M>E _n = − 13.6 "eV" / n ^2</M>. The energies are not continuous. They have the particular values −13.6, −3.40, −1.51, −0.85 … eV.
        </p>
        <figure className="t-figure">
          <EnergyBars />
          <figcaption>In every orbit the potential energy is double the total and the kinetic energy equals minus the total. All shrink as <M>1 / n ^2</M>.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-levels">
        <SectionHead n={no('levels')} title="Energy levels" />
        <p>
          We draw the energies as a ladder of <strong>energy levels</strong>. The lowest, <M>n = 1</M>, is the <strong>ground state</strong>, where the atom normally rests. The others are <strong>excited states</strong>. The levels get closer and closer toward the top, which is the level of zero energy where the electron is free.
        </p>
        <p>
          The energy needed to take the electron from the ground state to <M>n = ∞</M>, the point where it leaves the atom, is the <strong>ionisation energy</strong>: 13.6 eV for hydrogen. For an electron in level <M>n</M> it is <M>13.6 / n ^2</M> eV.
        </p>
        <Note label="Why atoms are stable">The ground state is the bottom rung. There is no lower level to jump to, so an atom in its ground state cannot give out any more light. That is how Bohr's rules save the atom from collapsing.</Note>
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Level</th>
                <th scope="col">Energy (eV)</th>
                <th scope="col">Radius</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['n = 1', '−13.60', '0.529 Å'],
                  ['n = 2', '−3.40', '2.12 Å'],
                  ['n = 3', '−1.51', '4.76 Å'],
                  ['n = 4', '−0.85', '8.46 Å'],
                  ['n = ∞', '0', 'free electron'],
                ] as const
              ).map(([l, e, r]) => (
                <tr key={l}>
                  <th scope="row">{l}</th>
                  <td>{e}</td>
                  <td>{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <figure className="t-figure">
          <Levels trans={[[1, Infinity]]} title="The electron is lifted from the ground state at minus 13.6 electron volts up to zero energy, where it is free: the ionisation energy of hydrogen" mode="absorb" nmax={4} />
          <figcaption>A photon of at least 13.6 eV lifts the electron out of the atom altogether. Any extra energy becomes kinetic energy of the free electron.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-photons">
        <SectionHead n={no('photons')} title="Photons from jumps" />
        <p>
          By the third postulate, a photon is given out when the electron drops from a higher level <M>n _i</M> to a lower level <M>n _f</M>:
        </p>
        <Eq src={['h · ν = E _i − E _f', 'h · ν = 13.6 "eV" · ( [ 1 | n _f ^2 ] − [ 1 | n _i ^2 ] )']} />
        <p>To get the wavelength, use <M>ν = c / λ</M>:</p>
        <Eq src='[ 1 | λ ] = [ 13.6 "eV" | h · c ] · ( [ 1 | n _f ^2 ] − [ 1 | n _i ^2 ] )' />
        <p>This is the Rydberg formula, and Bohr's theory gives the constant itself:</p>
        <Eq src={['R = [ 13.6 "eV" | h · c ] = [ 13.6 | 1240 "eV nm" ]', 'R = 0.01097 "nm⁻¹" = 1.097 × 10 ^7 "m⁻¹"']} />
        <p>
          This matches the measured value of the Rydberg constant to a fraction of a percent. It was this agreement that convinced physicists that Bohr's strange rules had something right in them. The series are simply the jumps that end on the same level: Lyman to <M>n = 1</M>, Balmer to <M>n = 2</M>, and so on.
        </p>
        <figure className="t-figure">
          <Levels trans={[[3, 2], [4, 2], [5, 2], [6, 2]]} title="The electron drops from levels three, four, five and six down to level two, each jump emitting a visible photon of the Balmer series" />
          <figcaption>The Balmer lines. A jump with a bigger drop gives a photon of higher energy and a shorter wavelength.</figcaption>
        </figure>
        <h3 className="t-h3">Absorption</h3>
        <p>
          The process works in reverse. An atom in a lower level can absorb a photon, but only if the photon's energy is <em>exactly</em> the gap to a higher level. That is why absorption lines appear at the same wavelengths as emission lines. (A photon that has more than the ionisation energy can free the electron, with the excess becoming kinetic energy.)
        </p>
        <figure className="t-figure">
          <Levels trans={[[1, 2], [1, 3]]} title="A photon whose energy exactly equals the gap between two levels lifts the electron up from the ground state to the higher level" mode="absorb" nmax={4} />
        </figure>
        <h3 className="t-h3">How many lines?</h3>
        <p>
          An atom excited to level <M>n</M> can come down in several steps, so we see every possible jump from <M>n</M> and the levels below it, which makes <M>n · ( n − 1 ) / 2</M> different lines. From <M>n = 4</M> there are 6.
        </p>
        <figure className="t-figure">
          <Levels trans={[[4, 3], [4, 2], [4, 1], [3, 2], [3, 1], [2, 1]]} title="From the fourth level the electron can make six different jumps, giving six different spectral lines" nmax={5} slot={2.4} />
        </figure>
      </section>

      <section className="t-section" id="t-debroglie">
        <SectionHead n={no('debroglie')} title="De Broglie's explanation" />
        <p>
          Why should angular momentum be quantised? Bohr gave no reason. In 1924 de Broglie did: the electron is a wave, with wavelength <M>λ = h / ( m · v )</M>. A wave that goes round a circle must join up with itself after each lap, or the crests and troughs on successive laps would cancel out. So the circumference must hold a <em>whole number</em> of wavelengths:
        </p>
        <Eq src={['2 · π · r = n · λ', '2 · π · r = n · [ h | m · v ]', 'm · v · r = n · [ h | 2 · π ]']} />
        <p>
          That is exactly Bohr's second postulate. An allowed orbit is a standing wave around the nucleus, like the vibration of a closed loop of string. And a stationary standing wave does not radiate, which also explains the first postulate.
        </p>
        <figure className="t-figure">
          <StandingWaveOrbit />
          <figcaption>On the left, exactly four wavelengths fit round the circle. On the right, 3.5 wavelengths do not, and the wave cancels itself at the join.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-limits">
        <SectionHead n={no('limits')} title="Limits of the Bohr model" />
        <p>
          Bohr's model works well for hydrogen, and for single-electron ions such as <M>"He" ^+</M> and <M>"Li" ^2+</M>, using the factor <M>Z ^2</M> in the energy. But it fails for atoms with more than one electron, since it cannot handle the repulsion between the electrons. It cannot tell us the <em>brightness</em> of the spectral lines, and it does not explain why the allowed orbits are stable. It was replaced in the 1920s by quantum mechanics, in which the electron has no fixed orbit at all but a wave that tells us where it is likely to be found. Yet the energy levels, and the idea of jumps that give photons, survived unchanged.
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
                  ['Distance of closest approach', 'r _0 = [ 1 | 4 · π · ε _0 ] · [ 2 · Z · e ^2 | K ]'],
                  ['With the handy constant', 'r _0 = [ 2 · Z · 1.44 "MeV fm" | K ]'],
                  ['Impact parameter', 'b = [ r _0 | 2 ] · cot ( [ θ | 2 ] )'],
                  ['Rydberg formula', '[ 1 | λ ] = R · ( [ 1 | n _f ^2 ] − [ 1 | n _i ^2 ] )'],
                  ['Rydberg constant', 'R = 1.097 × 10 ^7 "m⁻¹"'],
                  ['Angular momentum', 'm · v · r = n · [ h | 2 · π ]'],
                  ['Orbit radius', 'r _n = n ^2 · [ a _0 | Z ]'],
                  ['Bohr radius', 'a _0 = 0.529 × 10 ^−10 "m"'],
                  ['Orbit speed', 'v _n = [ Z | n ] · 2.19 × 10 ^6 "m/s"'],
                  ['Total energy', 'E = − K = [ U | 2 ]'],
                  ['Energy levels', 'E _n = − 13.6 "eV" · [ Z ^2 | n ^2 ]'],
                  ['Photon from a jump', 'h · ν = E _i − E _f'],
                  ['Wavelength in eV and nm', 'λ = [ 1240 | Δ E ]'],
                  ['Lines from level n', 'N = [ n · ( n − 1 ) | 2 ]'],
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
                  ['Z', 'Atomic number (charge of the nucleus in units of e)', ''],
                  ['K', 'Kinetic energy of the alpha particle', 'MeV'],
                  ['b', 'Impact parameter', 'fm'],
                  ['n', 'Principal quantum number', '1, 2, 3 …'],
                  ['R', 'Rydberg constant', '1.097 × 10⁷ m⁻¹'],
                  ['a₀', 'Bohr radius', '0.529 Å'],
                  ['e²/4πε₀', 'Coulomb constant times e squared', '1.44 MeV fm'],
                ] as const
              ).map(([sym, meaning, v]) => (
                <tr key={sym}>
                  <th scope="row">{sym}</th>
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

        <Example n={1} title="How close does an alpha particle get?">
          <p className="ex-q">A 5.5 MeV alpha particle is fired straight at a gold nucleus (<M>Z = 79</M>). Find the distance of closest approach.</p>
          <Given items={['K = 5.5 "MeV"', 'Z = 79', 'e ^2 / ( 4 · π · ε _0 ) = 1.44 "MeV fm"']} />
          <ol className="steps">
            <Step title="All the kinetic energy becomes potential energy">
              <Eq src='K = [ 1 | 4 · π · ε _0 ] · [ 2 · Z · e ^2 | r _0 ]' />
            </Step>
            <Step title="Solve for r₀">
              <Eq src='r _0 = [ 2 · Z · 1.44 "MeV fm" | K ]' />
            </Step>
            <Step title="Put in the numbers">
              <Eq src='r _0 = [ 2 · 79 · 1.44 | 5.5 ] "fm" = [ 227.5 | 5.5 ] "fm" = 41 "fm"' />
            </Step>
          </ol>
          <Answer>41 fm, or 4.1 × 10⁻¹⁴ m. The gold nucleus is smaller than this (its actual radius is about 7 fm), and the atom is about 10⁻¹⁰ m across, a thousand times bigger even than this distance.</Answer>
          <figure className="t-figure">
            <ClosestApproach />
          </figure>
        </Example>

        <Example n={2} title="Aiming and scattering">
          <p className="ex-q">For the same alpha particle and gold nucleus, find the impact parameter for scattering through 90° and through 60°.</p>
          <Given items={['r _0 = 41.4 "fm"', 'Z = 79', 'K = 5.5 "MeV"']} />
          <ol className="steps">
            <Step title="The formula">
              <Eq src='b = [ Z · 1.44 "MeV fm" | K ] · cot ( [ θ | 2 ] )' />
              <Eq src='[ Z · 1.44 | K ] = [ 79 · 1.44 | 5.5 ] = 20.7 "fm"' />
            </Step>
            <Step title="θ = 90°: cot 45° = 1">
              <Eq src='b = 20.7 · 1 = 20.7 "fm"' />
            </Step>
            <Step title="θ = 60°: cot 30° = 1.732">
              <Eq src='b = 20.7 · 1.732 = 35.8 "fm"' />
            </Step>
          </ol>
          <Answer>20.7 fm for 90°, which is half of <M>r _0</M>, and 35.8 fm for 60°. A bigger impact parameter means a smaller deflection, and a head-on hit (<M>b = 0</M>) returns the particle at 180°.</Answer>
          <figure className="t-figure">
            <RutherfordPaths />
          </figure>
        </Example>

        <Example n={3} title="The third Bohr orbit">
          <p className="ex-q">Find the radius, speed and energy of the electron in the third orbit of hydrogen.</p>
          <Given items={['n = 3', 'a _0 = 0.529 "Å"', 'Z = 1']} />
          <ol className="steps">
            <Step title="Radius">
              <Eq src='r _3 = n ^2 · a _0 = 9 · 0.529 = 4.76 "Å"' />
            </Step>
            <Step title="Speed">
              <Eq src='v _3 = [ 2.19 × 10 ^6 | 3 ] = 7.3 × 10 ^5 "m/s"' />
            </Step>
            <Step title="Energy: kinetic, potential and total">
              <Eq src={['E _3 = − [ 13.6 | 9 ] = − 1.51 "eV"', 'K = + 1.51 "eV" ,  U = − 3.02 "eV"']} />
            </Step>
          </ol>
          <Answer>4.76 Å (nine times the first orbit), 7.3 × 10⁵ m/s (a third of the first), and −1.51 eV. It takes only 1.51 eV to remove the electron from here.</Answer>
          <figure className="t-figure">
            <EnergyBars />
          </figure>
        </Example>

        <Example n={4} title="The red line of hydrogen">
          <p className="ex-q">Find the wavelength and frequency of the photon emitted when a hydrogen electron falls from <M>n = 3</M> to <M>n = 2</M>.</p>
          <Given items={['n _i = 3', 'n _f = 2', 'R = 1.097 × 10 ^7 "m⁻¹"']} />
          <ol className="steps">
            <Step title="Rydberg formula">
              <Eq src='[ 1 | λ ] = R · ( [ 1 | n _f ^2 ] − [ 1 | n _i ^2 ] ) = 1.097 × 10 ^7 · ( [ 1 | 4 ] − [ 1 | 9 ] )' />
              <Eq src='[ 1 | λ ] = 1.097 × 10 ^7 · [ 5 | 36 ] = 1.524 × 10 ^6 "m⁻¹"' />
            </Step>
            <Step title="Wavelength and frequency">
              <Eq src={['λ = [ 1 | 1.524 × 10 ^6 ] = 6.56 × 10 ^−7 "m" = 656 "nm"', 'ν = [ c | λ ] = [ 3 × 10 ^8 | 6.56 × 10 ^−7 ] = 4.57 × 10 ^14 "Hz"']} />
            </Step>
            <Step title="Check with the energy levels">
              <Eq src='Δ E = − 1.51 − ( − 3.40 ) = 1.89 "eV" ,   λ = [ 1240 | 1.89 ] = 656 "nm"' />
            </Step>
          </ol>
          <Answer>656 nm, a red line (the H-alpha line), at 4.57 × 10¹⁴ Hz. Both methods agree.</Answer>
          <figure className="t-figure">
            <Levels trans={[[3, 2]]} title="The electron drops from level three to level two and emits a red photon of 656 nanometres" nmax={4} />
          </figure>
        </Example>

        <Example n={5} title="The edges of two series">
          <p className="ex-q">Find the longest and shortest wavelengths of the Balmer series and of the Lyman series.</p>
          <Given items={['R = 1.097 × 10 ^7 "m⁻¹"']} />
          <ol className="steps">
            <Step title="Balmer, n_f = 2. The longest has n_i = 3 (done above); the shortest has n_i = ∞">
              <Eq src='[ 1 | λ _min ] = [ R | 4 ] = 2.74 × 10 ^6 "m⁻¹" ,  λ _min = 364.6 "nm"' />
            </Step>
            <Step title="Lyman, n_f = 1. The longest has n_i = 2">
              <Eq src='[ 1 | λ _max ] = R · ( 1 − [ 1 | 4 ] ) = 8.23 × 10 ^6 "m⁻¹" ,  λ _max = 121.6 "nm"' />
            </Step>
            <Step title="Lyman limit">
              <Eq src='λ _min = [ 1 | R ] = 91.2 "nm"' />
            </Step>
          </ol>
          <Answer>Balmer: from 656.3 nm down to 364.6 nm. Lyman: from 121.6 nm down to 91.2 nm. Both ranges are separate: the Lyman series is entirely ultraviolet, and the Balmer series is mostly visible.</Answer>
          <figure className="t-figure">
            <SeriesSpectrum />
          </figure>
        </Example>

        <Example n={6} title="Exciting hydrogen">
          <p className="ex-q">A hydrogen atom in the ground state absorbs a photon of energy 12.09 eV. What level does it reach? What lines can it then emit?</p>
          <Given items={['E _1 = − 13.6 "eV"', 'photon = 12.09 "eV"']} />
          <ol className="steps">
            <Step title="Energy after absorbing">
              <Eq src='E = − 13.6 + 12.09 = − 1.51 "eV"' />
            </Step>
            <Step title="Which level has this energy?">
              <Eq src='− [ 13.6 | n ^2 ] = − 1.51 ,   n ^2 = 9 ,   n = 3' />
            </Step>
            <Step title="Possible jumps from n = 3">
              <Eq src={['"3 → 2" ,  Δ E = 1.89 "eV" ,  λ = 656 "nm"', '"2 → 1" ,  Δ E = 10.2 "eV" ,  λ = 122 "nm"', '"3 → 1" ,  Δ E = 12.09 "eV" ,  λ = 103 "nm"']} />
            </Step>
          </ol>
          <Answer>The electron goes to <M>n = 3</M>. It can give out three lines: 656 nm (visible), 122 nm and 103 nm (both ultraviolet). The number of lines is <M>3 · 2 / 2 = 3</M>.</Answer>
          <figure className="t-figure">
            <Levels trans={[[3, 2], [3, 1], [2, 1]]} title="From the third level the electron can make three different jumps, giving three spectral lines" nmax={4} />
          </figure>
        </Example>

        <Example n={7} title="A helium ion">
          <p className="ex-q">He⁺ (<M>Z = 2</M>) has one electron. Find its ground-state energy and radius, and the wavelength of the photon from the jump <M>n = 2 → 1</M>.</p>
          <Given items={['Z = 2', 'a _0 = 0.529 "Å"']} />
          <ol className="steps">
            <Step title="Ground-state energy">
              <Eq src='E _1 = − 13.6 · [ Z ^2 | 1 ^2 ] = − 13.6 · 4 = − 54.4 "eV"' />
            </Step>
            <Step title="Radius">
              <Eq src='r _1 = [ a _0 | Z ] = [ 0.529 | 2 ] = 0.265 "Å"' />
            </Step>
            <Step title="The jump 2 → 1">
              <Eq src={['Δ E = 54.4 · ( 1 − [ 1 | 4 ] ) = 40.8 "eV"', 'λ = [ 1240 | 40.8 ] = 30.4 "nm"']} />
            </Step>
          </ol>
          <Answer>−54.4 eV (four times lower than hydrogen), a radius of 0.265 Å (half of hydrogen's), and a photon of 30.4 nm, in the far ultraviolet.</Answer>
          <figure className="t-figure">
            <BohrOrbits />
          </figure>
        </Example>

        <Example n={8} title="Waves on the second orbit">
          <p className="ex-q">Show that exactly two de Broglie wavelengths fit round the second Bohr orbit of hydrogen.</p>
          <Given items={['n = 2', 'r _2 = 4 · 0.529 "Å"', 'v _2 = 1.095 × 10 ^6 "m/s"']} />
          <ol className="steps">
            <Step title="Wavelength of the electron">
              <Eq src='λ = [ h | m · v ] = [ 6.63 × 10 ^−34 | 9.11 × 10 ^−31 · 1.095 × 10 ^6 ] = 6.65 × 10 ^−10 "m"' />
            </Step>
            <Step title="Circumference of the orbit">
              <Eq src='2 · π · r _2 = 2 · π · 2.116 × 10 ^−10 = 13.3 × 10 ^−10 "m"' />
            </Step>
            <Step title="Compare">
              <Eq src='[ 2 · π · r _2 | λ ] = [ 13.3 | 6.65 ] = 2' />
            </Step>
          </ol>
          <Answer>The circumference is 2.00 wavelengths, so the wave joins up with itself: <M>n = 2</M> for the second orbit.</Answer>
          <figure className="t-figure">
            <StandingWaveOrbit />
          </figure>
        </Example>

        <Example n={9} title="Pulling the electron off an excited atom">
          <p className="ex-q">What is the longest wavelength of light that can ionise a hydrogen atom already in the level <M>n = 2</M>? How many spectral lines can an atom excited to <M>n = 5</M> emit?</p>
          <Given items={['E _2 = − 3.40 "eV"', 'n = 5']} />
          <ol className="steps">
            <Step title="Energy needed">
              <Eq src='E = 0 − ( − 3.40 ) = 3.40 "eV"' />
            </Step>
            <Step title="Longest wavelength">
              <Eq src='λ = [ 1240 | 3.40 ] = 365 "nm"' />
            </Step>
            <Step title="Number of lines from n = 5">
              <Eq src='N = [ n · ( n − 1 ) | 2 ] = [ 5 · 4 | 2 ] = 10' />
            </Step>
          </ol>
          <Answer>365 nm, which is the Balmer series limit: any shorter wavelength also works, with the extra energy going to the free electron. An atom excited to <M>n = 5</M> can emit 10 different lines.</Answer>
          <figure className="t-figure">
            <Levels trans={[[2, Infinity]]} title="The electron in the second level is lifted by a photon of 3.4 electron volts to zero energy, where it is free" mode="absorb" nmax={4} />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="The nucleus fills most of the atom" wrong="R _nucleus ≈ R _atom" fig={<NucleusScale />}>
            The nucleus is about <M>10 ^−15 "m"</M> to <M>10 ^−14 "m"</M> across, and the atom is about <M>10 ^−10 "m"</M>. The nucleus is a hundred thousand times smaller, yet it holds nearly all the mass.
          </Mistake>
          <Mistake title="Alpha particles bounce off electrons" wrong={'α bounces off electrons'} fig={<GeigerMarsden />}>
            An alpha particle is 7300 times heavier than an electron, and an electron can hardly deflect it. The large deflections come from the heavy, concentrated, positively charged nucleus.
          </Mistake>
          <Mistake title="The energy of a bound electron is positive" wrong="E _n = + [ 13.6 | n ^2 ]" fig={<EnergyBars />}>
            Energy is measured from the free electron at rest, so a bound electron has <em>negative</em> energy. The level closest to zero is the highest. Going from <M>n = 3</M> to <M>n = 2</M>, the energy goes down from −1.51 to −3.40 eV.
          </Mistake>
          <Mistake title="A higher orbit means a faster electron" wrong="v ∝ n" fig={<BohrOrbits />}>
            It is the opposite: <M>v ∝ 1 / n</M>. A bigger orbit is weaker in pull, and the electron goes more slowly. The radius grows faster (as <M>n ^2</M>) than the speed falls, so each lap takes far longer.
          </Mistake>
          <Mistake title="Any photon with enough energy is absorbed" wrong={'h · ν > Δ E → absorbed'} fig={<Levels trans={[[1, 2], [1, 3]]} title="Only a photon of exactly the energy gap lifts the electron from the ground state" mode="absorb" nmax={4} />}>
            To lift the electron from one level to another, the photon must have <em>exactly</em> the energy gap. Too much and too little both pass through. Only for ionisation, where the electron ends up free, does any energy above 13.6 eV work.
          </Mistake>
          <Mistake title="The Balmer series ends on the ground state" wrong="Balmer: n _i → 1" fig={<SeriesSpectrum />}>
            Jumps ending on <M>n = 1</M> are the Lyman series (ultraviolet). The Balmer series ends on <M>n = 2</M> and is the one with the visible lines.
          </Mistake>
          <Mistake title="Lines spread further apart along a series" wrong={'lines spread out toward the limit'} fig={<SeriesSpectrum />}>
            The levels get closer as <M>n</M> grows, so the lines in a series crowd together and stop at the series limit, <M>1 / λ = R / n _f ^2</M>.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Scatter a particle and the nucleus appears; read the light and the energy levels follow.</p>
        <p className="closing-sub">Next: nuclei. We have found a tiny core that holds almost all the mass. What is it made of, and why do some nuclei fall apart?</p>
      </footer>
    </ChapterShell>
  );
}
