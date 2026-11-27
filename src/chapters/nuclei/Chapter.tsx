import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { AlphaQ, BECurve, CarbonClock, ChainTree, Composition, DecayLaw, DecayTypes, EnergyScale, FissionDrop, FusionDT, HalfLifeBars, HotPlasma, MassDefect, NuclearForce, NucleusSize, Reactor, Stability } from './NucleiAnims';

/** Nuclei: size, mass defect, binding energy, radioactivity, fission and fusion. */

const SECTIONS: NoteSection[] = [
  { id: 'inside', title: 'What is inside the nucleus', group: 'Theory' },
  { id: 'size', title: 'Size and density', group: 'Theory' },
  { id: 'force', title: 'The nuclear force', group: 'Theory' },
  { id: 'defect', title: 'Mass defect and binding energy', group: 'Theory' },
  { id: 'curve', title: 'The binding energy curve', group: 'Theory' },
  { id: 'radio', title: 'Radioactivity: alpha, beta, gamma', group: 'Theory' },
  { id: 'law', title: 'The decay law and half-life', group: 'Theory' },
  { id: 'fission', title: 'Nuclear fission', group: 'Theory' },
  { id: 'fusion', title: 'Nuclear fusion', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="nuclei" film={buildFilm} sections={SECTIONS} sideTitle="Nuclei" sideLead="The tiny, dense heart of the atom: how big it is, why it holds together, why some nuclei fall apart, and where nuclear energy comes from.">
      <header className="article-head">
        <span className="kicker">Physics · Nuclei</span>
        <h1 className="article-title">Where does nuclear energy come from?</h1>
        <p className="article-lead">Every atom has a nucleus a hundred thousand times smaller than the atom itself, yet it holds almost all of its mass and a huge store of energy. This chapter follows one idea, that a nucleus weighs less than the sum of its parts, to explain binding energy, radioactivity, fission and fusion.</p>
      </header>

      <section className="t-section" id="t-inside">
        <SectionHead n={no('inside')} title="What is inside the nucleus" />
        <p>
          A nucleus is made of <strong>protons</strong> (charge <M>+ e</M>) and <strong>neutrons</strong> (no charge), together called <strong>nucleons</strong>. We describe a nucleus with three numbers:
        </p>
        <Eq src={['Z = "number of protons (atomic number)"', 'N = "number of neutrons"', 'A = Z + N "(mass number)"']} />
        <p>
          A nucleus of element <M>X</M> is written <M>X ^A _Z</M>, for example <M>He ^4 _2</M> or <M>U ^238 _92</M>. The proton number <M>Z</M> decides the element and so the chemistry. The neutron number can vary:
        </p>
        <ul>
          <li><strong>Isotopes</strong> have the same <M>Z</M> and different <M>N</M>, such as hydrogen-1, deuterium (<M>H ^2 _1</M>) and tritium (<M>H ^3 _1</M>).</li>
          <li><strong>Isobars</strong> have the same <M>A</M> but different <M>Z</M>, such as <M>C ^14 _6</M> and <M>N ^14 _7</M>.</li>
          <li><strong>Isotones</strong> have the same <M>N</M> but different <M>Z</M>.</li>
        </ul>
        <figure className="t-figure">
          <Composition />
          <figcaption>Four nuclei, drawn as clusters of solid protons and hollow neutrons. The nucleons jiggle but stay packed together.</figcaption>
        </figure>
        <p>
          Nuclear masses are tiny, so we use the <strong>unified atomic mass unit</strong>, defined as one twelfth of the mass of a carbon-12 atom:
        </p>
        <Eq src={['1 "u" = 1.66 × 10 ^−27 "kg"', '1 "u" × c ^2 = 931.5 "MeV"']} />
        <p>
          The second line comes from <M>E = m · c ^2</M>, and says that one atomic mass unit is equivalent to 931.5 MeV of energy. Here 1 MeV is <M>10 ^6</M> electron-volts, and <M>1 "eV" = 1.6 × 10 ^−19 "J"</M>. A proton and a neutron each weigh very close to 1 u.
        </p>
      </section>

      <section className="t-section" id="t-size">
        <SectionHead n={no('size')} title="Size and density" />
        <p>
          Rutherford's scattering experiments showed that a nucleus is thousands of times smaller than an atom. Nuclear sizes are measured in <strong>femtometres</strong> (<M>1 "fm" = 10 ^−15 "m"</M>). Experiments with fast electrons and alpha particles show that the radius of a nucleus depends on the number of nucleons like this:
        </p>
        <Eq src='R = R _0 · A ^1/3 ,  R _0 = 1.2 "fm"' />
        <p>
          Why the cube root? Nucleons are packed together like marbles in a bag, each taking up about the same room. So the <em>volume</em> is proportional to the number of nucleons, and the radius, which goes as the cube root of the volume, goes as <M>A ^1/3</M>. Put it in symbols:
        </p>
        <Eq src={['V = [ 4 | 3 ] · π · R ^3 = [ 4 | 3 ] · π · R _0 ^3 · A', 'V ∝ A']} />
        <figure className="t-figure">
          <NucleusSize />
          <figcaption>Watch the slice grow as <M>A</M> increases. The spacing between nucleons never changes, only the count and so the radius.</figcaption>
        </figure>
        <p>
          The mass of a nucleus is about <M>A</M> atomic mass units, and its volume is proportional to <M>A</M>. So the mass divided by the volume does not depend on <M>A</M> at all: every nucleus has the same density.
        </p>
        <Eq src='ρ = [ A · u | [ 4 | 3 ] · π · R _0 ^3 · A ] = [ u | [ 4 | 3 ] · π · R _0 ^3 ] ≈ 2.3 × 10 ^17 "kg/m³"' />
        <p>
          That is about <M>10 ^14</M> times the density of water. A matchbox of nuclear matter would weigh a hundred million tonnes. A neutron star is a star made of it.
        </p>
      </section>

      <section className="t-section" id="t-force">
        <SectionHead n={no('force')} title="The nuclear force" />
        <p>
          Protons repel each other by the Coulomb force, and at 1 fm apart this push is hundreds of newtons. Yet the nucleus does not fly apart. Something much stronger pulls the nucleons together: the <strong>nuclear force</strong> (or strong force). Its main features:
        </p>
        <ul>
          <li>It is the strongest of the known forces, about 100 times the electric force between two protons at the same distance.</li>
          <li>It has <strong>short range</strong>: strong up to about 2 to 3 fm and negligible beyond. Each nucleon feels only its neighbours.</li>
          <li>It is the same between proton and proton, neutron and neutron, and proton and neutron. It does not care about charge.</li>
          <li>It turns repulsive at about 0.8 fm, which stops the nucleons from collapsing into each other.</li>
        </ul>
        <figure className="t-figure">
          <NuclearForce />
          <figcaption>The potential energy of two nucleons against their separation. They sit in the well near 1 fm. Two protons also feel the slow Coulomb push (dashed).</figcaption>
        </figure>
        <p>
          Because the nuclear force reaches only the neighbours but the Coulomb push reaches the whole nucleus, large nuclei need extra neutrons to dilute the proton repulsion. Light stable nuclei have <M>N ≈ Z</M>. Heavy ones have many more neutrons than protons, and above <M>Z = 83</M> no nucleus is stable at all.
        </p>
        <figure className="t-figure">
          <Stability />
          <figcaption>Stable nuclei lie in a thin band. A nucleus away from the band is unstable and moves toward it by radioactive decay.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-defect">
        <SectionHead n={no('defect')} title="Mass defect and binding energy" />
        <p>
          Here is the surprise. Weigh the nucleus of helium-4 and weigh its parts separately: two protons and two neutrons. The nucleus is lighter. The missing mass is the <strong>mass defect</strong>:
        </p>
        <Eq src='Δm = Z · m _p + ( A − Z ) · m _n − M' />
        <p>
          where <M>M</M> is the mass of the nucleus. Where did the mass go? Einstein's <M>E = m · c ^2</M> says mass and energy are the same stuff. When free nucleons fall together into a nucleus, they release energy as they settle, in the same way as a ball loses energy falling into a hole. That energy leaves, taking its mass with it. The nucleus is lighter by exactly <M>Δm</M>.
        </p>
        <Eq src='BE = Δm · c ^2' />
        <p>
          This is the <strong>binding energy</strong>: the energy you must put in to pull the nucleus completely apart into free nucleons (and the energy released when it forms). In practice we write <M>Δm</M> in atomic mass units and use <M>1 "u" × c ^2 = 931.5 "MeV"</M>:
        </p>
        <Eq src='BE = Δm "(in u)" × 931.5 "MeV"' />
        <figure className="t-figure">
          <MassDefect />
          <figcaption>Helium-4 forms and a flash of 28.3 MeV leaves. The bar on the right is slightly shorter than the bar on the left: that sliver is the mass defect.</figcaption>
        </figure>
        <Note label="Atomic masses">Tables give the masses of whole <em>atoms</em>. To use them, take the mass of a hydrogen <em>atom</em> (1.007825 u, a proton plus an electron) in place of <M>m _p</M>. Then the electrons on each side cancel and you can ignore them.</Note>
        <p>
          A bigger nucleus has a bigger binding energy, simply because it has more nucleons. A fairer measure of how tightly it is held is the binding energy <em>per nucleon</em>:
        </p>
        <Eq src='[ BE | A ] = "average energy to remove one nucleon"' />
      </section>

      <section className="t-section" id="t-curve">
        <SectionHead n={no('curve')} title="The binding energy curve" />
        <p>Plot the binding energy per nucleon against the mass number and you get the most important graph in nuclear physics.</p>
        <figure className="t-figure">
          <BECurve />
          <figcaption>The curve climbs fast for the lightest nuclei, flattens around 8 MeV per nucleon and peaks near iron, <M>Fe ^56 _26</M>, at 8.8 MeV. After that it declines gently to about 7.6 MeV for uranium.</figcaption>
        </figure>
        <p>What the curve tells us:</p>
        <ul>
          <li>Between about <M>A = 30</M> and <M>A = 170</M> the value is nearly constant, about 8 MeV per nucleon. This is the saturation of the nuclear force: each nucleon only feels its neighbours, so adding more nucleons does not make each one more tightly held.</li>
          <li>At the light end, nucleons on the surface have fewer neighbours, so the curve is low. Helium-4 is a sharp peak, a very tightly bound nucleus.</li>
          <li>At the heavy end, the growing Coulomb repulsion between protons slowly loosens the binding.</li>
        </ul>
        <p>
          A system always moves toward <em>more</em> binding, releasing the difference as energy. Two routes lead uphill on the curve:
        </p>
        <Eq src={['"fusion: light nuclei join" → "higher BE per nucleon" → "energy released"', '"fission: a heavy nucleus splits" → "higher BE per nucleon" → "energy released"']} />
        <p>
          Both are only possible on their own side of iron. Iron-56 is at the top, so nothing more can be gained by fusing it or splitting it.
        </p>
      </section>

      <section className="t-section" id="t-radio">
        <SectionHead n={no('radio')} title="Radioactivity: alpha, beta, gamma" />
        <p>
          Nuclei that lie off the stable band, or that are too big, change by themselves until they reach a stable form. This is <strong>radioactive decay</strong>. It is spontaneous, it cannot be sped up or slowed down by heat, pressure or chemistry, and it is random: we can say what fraction decays but never which nucleus will go next.
        </p>
        <figure className="t-figure">
          <DecayTypes />
          <figcaption>Alpha: a helium nucleus escapes. Beta: a neutron turns into a proton and sends out an electron and an antineutrino. Gamma: the nucleus drops to a lower energy state and emits a photon.</figcaption>
        </figure>
        <h3 className="t-h3">Alpha decay</h3>
        <p>The nucleus emits an alpha particle, a helium nucleus of two protons and two neutrons. The mass number drops by 4 and the atomic number by 2:</p>
        <Eq src='X ^A _Z → Y ^A−4 _Z−2 + He ^4 _2' />
        <p>
          For example <M>U ^238 _92 → Th ^234 _90 + He ^4 _2</M>. The mass numbers (<M>238 = 234 + 4</M>) and the charges (<M>92 = 90 + 2</M>) both balance. Alpha decay happens in heavy nuclei, where the Coulomb push makes it favourable to shed a tightly bound helium unit. The energy released is shared in inverse proportion to the masses (momentum is conserved), so the light alpha takes nearly all of it and flies off with a sharp, well-defined energy.
        </p>
        <h3 className="t-h3">Beta decay</h3>
        <p>
          In <M>β ^−</M> decay a neutron in the nucleus turns into a proton, and the nucleus emits an electron and an <strong>antineutrino</strong> (a nearly massless, neutral particle). The electron did not exist inside the nucleus; it is created in the decay.
        </p>
        <Eq src={['n → p + e ^− + ν̄', 'X ^A _Z → Y ^A _Z+1 + e ^− + ν̄']} />
        <p>
          The mass number stays the same and the atomic number goes up by 1, as in <M>C ^14 _6 → N ^14 _7 + e ^− + ν̄</M>. Nuclei with too many neutrons decay this way. Those with too many protons do the opposite, <M>β ^+</M> decay, where a proton turns into a neutron and the nucleus emits a positron <M>e ^+</M> and a neutrino <M>ν</M>, so <M>Z</M> goes down by 1.
        </p>
        <Note label="Why a neutrino?">The electrons in beta decay come out with a whole range of energies, not one value. Pauli proposed a third, invisible particle to carry the rest of the energy and momentum. That was the neutrino.</Note>
        <h3 className="t-h3">Gamma decay</h3>
        <p>
          After alpha or beta decay the daughter nucleus is often left excited, like a ball at the top of a step. It drops to a lower energy level and emits a high-energy photon, a <strong>gamma ray</strong>, typically of 0.1 to several MeV. Neither <M>A</M> nor <M>Z</M> changes. This is the nuclear version of an atom emitting light.
        </p>
        <figure className="t-figure">
          <AlphaQ />
          <figcaption>Equal and opposite momentum means the light alpha particle takes almost all the kinetic energy and the heavy thorium recoils slowly.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-law">
        <SectionHead n={no('law')} title="The decay law and half-life" />
        <p>
          Each nucleus has the same chance per second of decaying, whatever its age or surroundings. Call that chance <M>λ</M>, the <strong>decay constant</strong>. Then in a short time <M>dt</M> the number of nuclei that decay is proportional to how many are present, and the number <M>N</M> falls:
        </p>
        <Eq src='[ dN | dt ] = − λ · N' />
        <p>The minus sign says that <M>N</M> is decreasing. Separate the variables and integrate from the start (<M>N _0</M> at <M>t = 0</M>) to time <M>t</M>:</p>
        <Eq src={['[ dN | N ] = − λ · dt', 'ln N − ln N _0 = − λ · t', 'N = N _0 · e ^−λ·t']} />
        <figure className="t-figure">
          <DecayLaw />
          <figcaption>Each nucleus decays at a random moment, yet the crowd follows a smooth curve. The dashed marks show the number halving every half-life.</figcaption>
        </figure>
        <h3 className="t-h3">Half-life</h3>
        <p>
          The <strong>half-life</strong> <M>T _½</M> is the time for half the nuclei to decay. Put <M>N = N _0 / 2</M> into the decay law at <M>t = T _½</M>, so that <M>[ 1 | 2 ] = e ^−λ·T</M> with <M>T = T _½</M>. Take natural logs of both sides: <M>ln 2 = λ · T _½</M>. So
        </p>
        <Eq src='T _½ = [ ln 2 | λ ] = [ 0.693 | λ ]' />
        <p>
          The number left after <M>n</M> half-lives is halved <M>n</M> times. This is handy when <M>t</M> is a whole number of half-lives:
        </p>
        <Eq src='N = N _0 · ( [ 1 | 2 ] ) ^n ,  n = [ t | T _½ ]' />
        <figure className="t-figure">
          <HalfLifeBars />
          <figcaption>Each half-life removes half of what is <em>left</em>, not half of the original. The bars never quite reach zero.</figcaption>
        </figure>
        <h3 className="t-h3">Mean life and activity</h3>
        <p>
          The average time a nucleus survives is the <strong>mean life</strong> <M>τ</M>. It comes out as <M>1 / λ</M>, a little longer than the half-life:
        </p>
        <Eq src='τ = [ 1 | λ ] = [ T _½ | 0.693 ] = 1.44 · T _½' />
        <p>
          What a Geiger counter measures is the number of decays per second, the <strong>activity</strong> <M>R</M>. It is proportional to how many nuclei are left, so it falls by the same law:
        </p>
        <Eq src={['R = [ − dN | dt ] = λ · N', 'R = R _0 · e ^−λ·t']} />
        <p>
          The SI unit is the <strong>becquerel</strong> (1 Bq = 1 decay per second). An older unit is the curie: <M>1 "Ci" = 3.7 × 10 ^10 "Bq"</M>.
        </p>
        <figure className="t-figure">
          <CarbonClock />
          <figcaption>Radiocarbon dating: living things keep their carbon-14 topped up, and when they die it decays with a half-life of 5730 years. The fraction left is a clock.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-fission">
        <SectionHead n={no('fission')} title="Nuclear fission" />
        <p>
          In 1938 Hahn and Strassmann found that a uranium nucleus that absorbs a slow neutron can split into two middle-sized pieces. This is <strong>fission</strong>. A typical reaction is
        </p>
        <Eq src='U ^235 _92 + n ^1 _0 → Ba ^141 _56 + Kr ^92 _36 + 3 · n ^1 _0 + "energy"' />
        <p>Check the bookkeeping: mass number <M>235 + 1 = 141 + 92 + 3</M>, and charge <M>92 = 56 + 36</M>.</p>
        <figure className="t-figure">
          <FissionDrop />
          <figcaption>The absorbed neutron sets the nucleus wobbling like a liquid drop. It stretches into a dumbbell and the Coulomb push between the two halves tears it apart.</figcaption>
        </figure>
        <p>
          Where does the energy come from? Read it off the binding energy curve. Uranium has about 7.6 MeV per nucleon. The two fragments, near <M>A = 118</M> each, have about 8.5 MeV per nucleon. Every one of the 235 nucleons gains about 0.9 MeV in binding, so the energy released is
        </p>
        <Eq src='Q ≈ 235 × ( 8.5 − 7.6 ) ≈ 200 "MeV"' />
        <p>That is huge for one nucleus. A chemical reaction releases a few electron-volts per atom. Most of the 200 MeV (about 168 MeV) is the kinetic energy of the fragments, which becomes heat as they crash into the surrounding atoms. A few MeV goes to the neutrons, about 7 MeV to prompt gamma rays and the rest to later radioactive decay of the fragments.</p>
        <h3 className="t-h3">The chain reaction</h3>
        <p>
          Each fission frees two or three neutrons (2.5 on average). If these in turn cause fissions, the reaction feeds itself. The <strong>multiplication factor</strong> <M>k</M> is the average number of neutrons from one fission that go on to cause another:
        </p>
        <Eq src={['k < 1 "(dies out)"', 'k = 1 "(steady, critical)"', 'k > 1 "(grows explosively)"']} />
        <figure className="t-figure">
          <ChainTree />
          <figcaption>Above: with <M>k = 2</M> the fissions double each generation. Below: with an absorber soaking up the extra neutron, <M>k = 1</M> and the reaction holds steady.</figcaption>
        </figure>
        <h3 className="t-h3">A nuclear reactor</h3>
        <p>A reactor holds <M>k</M> at exactly 1. Its parts:</p>
        <ul>
          <li><strong>Fuel</strong>: natural uranium is only 0.7% fissile <M>U ^235 _92</M>, so it is usually enriched to 3 to 5%.</li>
          <li><strong>Moderator</strong>: fission neutrons are fast, but U-235 is far better at catching <em>slow</em> ones. A light material (water, heavy water or graphite) slows them down by collisions without absorbing many.</li>
          <li><strong>Control rods</strong>: cadmium or boron rods that soak up neutrons. Pushing them in lowers <M>k</M> and the power; pulling them out raises it.</li>
          <li><strong>Coolant</strong>: carries the heat to a steam turbine that drives a generator.</li>
        </ul>
        <figure className="t-figure">
          <Reactor />
          <figcaption>As the control rods slide in, fewer neutrons survive and the fuel cools; as they slide out, the power rises.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-fusion">
        <SectionHead n={no('fusion')} title="Nuclear fusion" />
        <p>
          The other way uphill on the binding energy curve is to join two very light nuclei. This is <strong>fusion</strong>. A leading candidate for power on Earth is deuterium and tritium:
        </p>
        <Eq src='H ^2 _1 + H ^3 _1 → He ^4 _2 + n ^1 _0 + 17.6 "MeV"' />
        <p>
          The 17.6 MeV looks smaller than fission's 200 MeV, but it comes from only five nucleons. Per nucleon fusion releases about four times as much as fission.
        </p>
        <figure className="t-figure">
          <FusionDT />
          <figcaption>Two positive nuclei repel each other more and more as they approach. Only when they come within about a femtometre does the nuclear attraction win and the nuclei fuse.</figcaption>
        </figure>
        <p>
          The difficulty is the electric repulsion. To get two nuclei within range of the nuclear force they must start with enough kinetic energy to climb the Coulomb barrier, which is of the order of a few hundred keV. That means temperatures of about <M>10 ^8</M> kelvin, so a fusion fuel is a hot plasma and the process is called <strong>thermonuclear</strong> fusion. At these temperatures no solid container can hold it, so devices such as the tokamak hold the plasma with magnetic fields.
        </p>
        <figure className="t-figure">
          <HotPlasma />
          <figcaption>In a hot plasma the fastest nuclei collide hard enough to fuse. Most collisions just bounce.</figcaption>
        </figure>
        <h3 className="t-h3">Energy of the Sun</h3>
        <p>
          In the core of the Sun, at about <M>1.5 × 10 ^7</M> kelvin and enormous pressure, hydrogen nuclei fuse in a chain of steps (the proton-proton cycle) whose net effect is
        </p>
        <Eq src='4 · H ^1 _1 → He ^4 _2 + 2 · e ^+ + 2 · ν + 26.7 "MeV"' />
        <p>
          Four protons end up as one helium nucleus, and the Sun turns about 600 million tonnes of hydrogen into helium every second. Heavier stars carry on up the curve, fusing helium into carbon and onward, until they reach iron, where the energy runs out.
        </p>
        <figure className="t-figure">
          <EnergyScale />
          <figcaption>Nuclear reactions release millions of times more energy per atom than chemical ones. Note the logarithmic scale.</figcaption>
        </figure>
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
                  ['Mass number', 'A = Z + N'],
                  ['Nuclear radius', 'R = R _0 · A ^1/3'],
                  ['Nuclear density', 'ρ ≈ 2.3 × 10 ^17 "kg/m³"'],
                  ['Mass defect', 'Δm = Z · m _p + ( A − Z ) · m _n − M'],
                  ['Binding energy', 'BE = Δm · c ^2'],
                  ['Energy from mass in u', '1 "u" × c ^2 = 931.5 "MeV"'],
                  ['Alpha decay', 'X ^A _Z → Y ^A−4 _Z−2 + He ^4 _2'],
                  ['Beta-minus decay', 'X ^A _Z → Y ^A _Z+1 + e ^− + ν̄'],
                  ['Decay law', 'N = N _0 · e ^−λ·t'],
                  ['Activity', 'R = λ · N = R _0 · e ^−λ·t'],
                  ['Half-life', 'T _½ = [ 0.693 | λ ]'],
                  ['After n half-lives', 'N = N _0 · ( [ 1 | 2 ] ) ^n'],
                  ['Mean life', 'τ = [ 1 | λ ] = 1.44 · T _½'],
                  ['Q value of a reaction', 'Q = ( "mass in" − "mass out" ) × 931.5 "MeV"'],
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
                  ['Z', 'Atomic number (protons)', ''],
                  ['N', 'Number of neutrons, or of nuclei left', ''],
                  ['A', 'Mass number (nucleons)', ''],
                  ['R', 'Radius of the nucleus, or the activity', 'm, Bq'],
                  ['Δm', 'Mass defect', 'u'],
                  ['BE', 'Binding energy', 'MeV'],
                  ['λ', 'Decay constant', 's⁻¹'],
                  ['T', 'Half-life', 's'],
                  ['τ', 'Mean life', 's'],
                  ['Q', 'Energy released in a reaction', 'MeV'],
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

        <Example n={1} title="Size and density of an aluminium nucleus">
          <p className="ex-q">Find the radius of the nucleus of aluminium-27 and the density of nuclear matter.</p>
          <Given items={['A = 27', 'R _0 = 1.2 "fm"', 'u = 1.66 × 10 ^−27 "kg"']} />
          <ol className="steps">
            <Step title="Radius">
              <Eq src='R = R _0 · A ^1/3 = 1.2 · 27 ^1/3 = 1.2 · 3 = 3.6 "fm"' />
            </Step>
            <Step title="Mass and volume">
              <Eq src={['m = 27 × 1.66 × 10 ^−27 = 4.48 × 10 ^−26 "kg"', 'V = [ 4 | 3 ] · π · R ^3 = [ 4 | 3 ] · π · ( 3.6 × 10 ^−15 ) ^3 = 1.95 × 10 ^−43 "m³"']} />
            </Step>
            <Step title="Density">
              <Eq src='ρ = [ m | V ] = [ 4.48 × 10 ^−26 | 1.95 × 10 ^−43 ] = 2.3 × 10 ^17 "kg/m³"' />
            </Step>
          </ol>
          <Answer>The radius is 3.6 fm. The density, 2.3 × 10<sup>17</sup> kg/m³, is the same for every nucleus, because the mass and the volume both grow in proportion to <M>A</M>.</Answer>
          <figure className="t-figure">
            <NucleusSize title="The slice through a nucleus grows to A equals 27, with a radius of 3.6 femtometres marked on a graph of radius against A" />
          </figure>
        </Example>

        <Example n={2} title="Binding energy of helium-4">
          <p className="ex-q">Find the binding energy, and the binding energy per nucleon, of helium-4. Atomic masses: hydrogen 1.007825 u, neutron 1.008665 u, helium-4 4.002603 u.</p>
          <Given items={['Z = 2', 'N = 2', 'M = 4.002603 "u"']} />
          <ol className="steps">
            <Step title="Mass of the parts">
              <Eq src='2 · 1.007825 + 2 · 1.008665 = 2.01565 + 2.01733 = 4.03298 "u"' />
            </Step>
            <Step title="Mass defect">
              <Eq src='Δm = 4.03298 − 4.002603 = 0.030377 "u"' />
            </Step>
            <Step title="Binding energy">
              <Eq src={['BE = 0.030377 × 931.5 = 28.3 "MeV"', '[ BE | A ] = [ 28.3 | 4 ] = 7.07 "MeV"']} />
            </Step>
          </ol>
          <Answer>28.3 MeV in all, or 7.07 MeV per nucleon. To tear a helium nucleus apart you must supply 28.3 MeV; that is the energy released when it forms.</Answer>
          <figure className="t-figure">
            <MassDefect title="Two protons and two neutrons form helium-4; the bar of the nucleus is 0.030377 atomic mass units lighter and a 28.3 MeV flash leaves" />
          </figure>
        </Example>

        <Example n={3} title="Why iron is special">
          <p className="ex-q">Find the binding energy per nucleon of iron-56 (atomic mass 55.934936 u, 26 protons) and compare it with uranium's 7.6 MeV per nucleon.</p>
          <Given items={['Z = 26', 'N = 30', 'M = 55.934936 "u"']} />
          <ol className="steps">
            <Step title="Mass defect">
              <Eq src={['26 · 1.007825 + 30 · 1.008665 = 26.20345 + 30.25995 = 56.46340 "u"', 'Δm = 56.46340 − 55.934936 = 0.528464 "u"']} />
            </Step>
            <Step title="Binding energy">
              <Eq src={['BE = 0.528464 × 931.5 = 492.3 "MeV"', '[ BE | A ] = [ 492.3 | 56 ] = 8.79 "MeV"']} />
            </Step>
          </ol>
          <Answer>8.79 MeV per nucleon, higher than the 7.6 MeV of uranium and higher than the 7.07 MeV of helium-4. Iron sits at the top of the curve, so moving either way from it takes energy.</Answer>
          <figure className="t-figure">
            <BECurve title="A dot slides along the binding energy curve passing helium-4, iron-56 and uranium-235" />
          </figure>
        </Example>

        <Example n={4} title="Alpha decay of uranium-238">
          <p className="ex-q">Find the energy released when uranium-238 decays by alpha emission, and how it is shared. Atomic masses: U-238 238.050788 u, Th-234 234.043601 u, He-4 4.002603 u.</p>
          <Given items={['M _U = 238.050788 "u"', 'M _Th = 234.043601 "u"', 'M _He = 4.002603 "u"']} />
          <ol className="steps">
            <Step title="Mass lost">
              <Eq src='Δm = 238.050788 − ( 234.043601 + 4.002603 ) = 0.004584 "u"' />
            </Step>
            <Step title="Energy released">
              <Eq src='Q = 0.004584 × 931.5 = 4.27 "MeV"' />
            </Step>
            <Step title="Sharing by momentum">
              <p>The nucleus starts at rest, so the thorium and the alpha get equal and opposite momentum. For equal momentum <M>p</M>, the kinetic energy <M>p ^2 / ( 2 · m )</M> is inversely proportional to the mass, so the lighter alpha takes the larger share:</p>
              <Eq src='KE _α = Q · [ 234 | 238 ] = 4.27 · [ 234 | 238 ] = 4.20 "MeV"' />
              <Eq src='KE _Th = 4.27 − 4.20 = 0.07 "MeV"' />
            </Step>
          </ol>
          <Answer>4.27 MeV is released. The alpha particle carries 4.20 MeV (98%) and the recoiling thorium nucleus only 0.07 MeV.</Answer>
          <figure className="t-figure">
            <AlphaQ />
          </figure>
        </Example>

        <Example n={5} title="Iodine-131 in a hospital">
          <p className="ex-q">A hospital holds 80 g of iodine-131, whose half-life is 8 days. How much is left after 24 days, and how long until only 1 g remains?</p>
          <Given items={['N _0 = 80 "g"', 'T _½ = 8 "days"']} />
          <ol className="steps">
            <Step title="Number of half-lives">
              <Eq src='n = [ t | T _½ ] = [ 24 | 8 ] = 3' />
            </Step>
            <Step title="What is left">
              <Eq src='N = N _0 · ( [ 1 | 2 ] ) ^n = 80 · ( [ 1 | 2 ] ) ^3 = [ 80 | 8 ] = 10 "g"' />
            </Step>
            <Step title="Check with the decay law">
              <Eq src={['λ = [ 0.693 | T _½ ] = [ 0.693 | 8 ] = 0.0866 "per day"', 'λ · t = 0.0866 × 24 = 2.08', 'N = 80 · e ^−2.08 = 10 "g"']} />
            </Step>
            <Step title="Time to reach 1 g">
              <Eq src={['( [ 1 | 2 ] ) ^n = [ 1 | 80 ]', 'n = [ ln 80 | ln 2 ] = 6.32', 't = 6.32 × 8 = 50.6 "days"']} />
            </Step>
          </ol>
          <Answer>10 g after 24 days (three half-lives). It takes about 50.6 days, a little over six half-lives, to fall to 1 g.</Answer>
          <figure className="t-figure">
            <DecayLaw title="Decay of iodine-131 with a half-life of eight days: after 24 days one eighth is left" half={8} unit="days" dots={false} />
          </figure>
        </Example>

        <Example n={6} title="Activity of cobalt-60">
          <p className="ex-q">A 1 g sample of cobalt-60 (half-life 5.27 years, molar mass 60 g) is used in cancer therapy. Find its activity in becquerel and in curie, and its activity after two half-lives.</p>
          <Given items={['T _½ = 5.27 "years"', 'm = 1 "g"', 'N _A = 6.02 × 10 ^23']} />
          <ol className="steps">
            <Step title="Number of nuclei">
              <Eq src='N = [ 1 | 60 ] × 6.02 × 10 ^23 = 1.00 × 10 ^22' />
            </Step>
            <Step title="Decay constant">
              <Eq src={['T _½ = 5.27 × 3.156 × 10 ^7 = 1.66 × 10 ^8 "s"', 'λ = [ 0.693 | 1.66 × 10 ^8 ] = 4.17 × 10 ^−9 "s⁻¹"']} />
            </Step>
            <Step title="Activity">
              <Eq src={['R = λ · N = 4.17 × 10 ^−9 × 1.00 × 10 ^22 = 4.17 × 10 ^13 "Bq"', 'R = [ 4.17 × 10 ^13 | 3.7 × 10 ^10 ] = 1.13 × 10 ^3 "Ci"']} />
            </Step>
            <Step title="After two half-lives">
              <Eq src='R = [ 4.17 × 10 ^13 | 4 ] = 1.04 × 10 ^13 "Bq"' />
            </Step>
          </ol>
          <Answer>4.17 × 10<sup>13</sup> Bq (about 1130 curie) to begin with, falling to a quarter, 1.04 × 10<sup>13</sup> Bq, after 10.5 years.</Answer>
          <figure className="t-figure">
            <DecayLaw title="Activity of the cobalt sample falling to a half after 5.27 years and a quarter after 10.5 years" half={5.27} unit="years" dots={false} />
          </figure>
        </Example>

        <Example n={7} title="A kilogram of uranium">
          <p className="ex-q">Each fission of uranium-235 releases 200 MeV. How much energy does 1 kg of U-235 give if every nucleus fissions, and how does that compare with coal at 3 × 10<sup>7</sup> J/kg?</p>
          <Given items={['m = 1 "kg"', 'M = 235 "g/mol"', 'E _1 = 200 "MeV"']} />
          <ol className="steps">
            <Step title="Number of nuclei">
              <Eq src='N = [ 1000 | 235 ] × 6.02 × 10 ^23 = 2.56 × 10 ^24' />
            </Step>
            <Step title="Energy of one fission in joules">
              <Eq src='E _1 = 200 × 1.6 × 10 ^−13 = 3.2 × 10 ^−11 "J"' />
            </Step>
            <Step title="Total">
              <Eq src='E = 2.56 × 10 ^24 × 3.2 × 10 ^−11 = 8.2 × 10 ^13 "J"' />
            </Step>
            <Step title="Compare with coal">
              <Eq src='[ 8.2 × 10 ^13 | 3 × 10 ^7 ] = 2.7 × 10 ^6 "kg of coal"' />
            </Step>
          </ol>
          <Answer>8.2 × 10<sup>13</sup> J, the same as burning 2.7 million kg (2700 tonnes) of coal.</Answer>
          <figure className="t-figure">
            <EnergyScale />
          </figure>
        </Example>

        <Example n={8} title="Deuterium and tritium fusing">
          <p className="ex-q">Find the energy released when deuterium (2.014102 u) and tritium (3.016049 u) fuse to helium-4 (4.002603 u) and a neutron (1.008665 u). How is it shared between the neutron and the helium?</p>
          <Given items={['M _D = 2.014102 "u"', 'M _T = 3.016049 "u"', 'M _He = 4.002603 "u"', 'm _n = 1.008665 "u"']} />
          <ol className="steps">
            <Step title="Mass before and after">
              <Eq src={['"before" = 2.014102 + 3.016049 = 5.030151 "u"', '"after" = 4.002603 + 1.008665 = 5.011268 "u"']} />
            </Step>
            <Step title="Mass lost and energy">
              <Eq src={['Δm = 5.030151 − 5.011268 = 0.018883 "u"', 'Q = 0.018883 × 931.5 = 17.6 "MeV"']} />
            </Step>
            <Step title="Sharing by momentum">
              <p>The products carry equal and opposite momentum, so energy is shared in inverse proportion to the masses, about 4 : 1 for the neutron against helium:</p>
              <Eq src={['KE _n = 17.6 × [ 4 | 5 ] = 14.1 "MeV"', 'KE _He = 17.6 × [ 1 | 5 ] = 3.5 "MeV"']} />
            </Step>
          </ol>
          <Answer>17.6 MeV, of which the neutron carries about 14.1 MeV and the helium nucleus 3.5 MeV. The neutron's energy is what a fusion reactor would capture as heat.</Answer>
          <figure className="t-figure">
            <FusionDT />
          </figure>
        </Example>

        <Example n={9} title="Dating a wooden tool">
          <p className="ex-q">A wooden tool has 30% of the carbon-14 that a living tree has. How old is it? The half-life of carbon-14 is 5730 years.</p>
          <Given items={['[ N | N _0 ] = 0.30', 'T _½ = 5730 "years"']} />
          <ol className="steps">
            <Step title="Use the decay law">
              <Eq src={['[ N | N _0 ] = ( [ 1 | 2 ] ) ^n = 0.30', 'n = [ ln ( 1 / 0.30 ) | ln 2 ] = [ 1.204 | 0.693 ] = 1.737']} />
            </Step>
            <Step title="Convert to years">
              <Eq src='t = n · T _½ = 1.737 × 5730 = 9950 "years"' />
            </Step>
          </ol>
          <Answer>About 9950 years: a bit under two half-lives, which agrees with 30% being a bit more than a quarter.</Answer>
          <figure className="t-figure">
            <CarbonClock />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="The nucleus weighs the same as its parts" wrong="M = Z · m _p + N · m _n" fig={<MassDefect title="Free nucleons weigh more than the nucleus they form; the bar of the nucleus is shorter" />}>
            The nucleus is lighter than its separate protons and neutrons. The difference <M>Δm</M> left as binding energy, <M>BE = Δm · c ^2</M>.
          </Mistake>
          <Mistake title="Everything is gone after two half-lives" wrong="N = 0 ,  t = 2 · T _½" fig={<HalfLifeBars title="After one half-life a half is left, after two a quarter, after three an eighth; the bars never reach zero" />}>
            Each half-life removes half of what is <em>left</em>. After two half-lives a quarter remains, after three an eighth, and so on. The count falls forever but never reaches exactly zero.
          </Mistake>
          <Mistake title="Decay goes at a steady rate" wrong="N = N _0 − λ · t" fig={<DecayLaw title="A straight dashed line shows a wrong steady decay; the real count follows a curve that flattens out" half={1.5} dots={false} linear />}>
            The number of decays per second is proportional to the number of nuclei still there, so the rate itself falls. The graph is an exponential curve, not a straight line.
          </Mistake>
          <Mistake title="Any fusion or fission gives out energy" wrong={'"fuse iron" → "energy out"'} fig={<BECurve title="The binding energy curve peaks at iron; fusion pays only to its left and fission only to its right" />}>
            Energy is released only when the products have <em>more</em> binding energy per nucleon. Fusion pays for nuclei lighter than iron, and fission pays for nuclei heavier than iron. Fusing or splitting iron itself costs energy.
          </Mistake>
          <Mistake title="Beta electrons come from the atom's shells" wrong={'β ^− "= an orbital electron"'} fig={<DecayTypes />}>
            The beta electron is made at the moment of decay, when a neutron turns into a proton. The atom's own electrons play no part, and the nucleus gains one unit of charge.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">A nucleus weighs less than its parts, and the missing mass is the energy that holds it together.</p>
        <p className="closing-sub">Next: semiconductor electronics. Moving from the nucleus out to the electrons in a solid, we see how a little impurity makes the devices that run every computer.</p>
      </footer>
    </ChapterShell>
  );
}
