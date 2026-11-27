import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Atom, AxialEquatorial, CompassTorque, CurieTemp, CutMagnet, DipTriangle, DipoleField, Domains, EarthDip, EquivalentSolenoid, Hysteresis, LinesInMaterial, NonUniform, SoftHard, ThreeKinds } from './MatterAnims';

/** Magnetism and matter: bar magnets, the Earth's field, magnetisation, and how materials respond. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'The bar magnet', group: 'Theory' },
  { id: 'lines', title: 'Field lines and Gauss\'s law', group: 'Theory' },
  { id: 'dipole', title: 'A magnet is a current loop', group: 'Theory' },
  { id: 'field', title: 'The field of a magnetic dipole', group: 'Theory' },
  { id: 'torque', title: 'A magnet in a uniform field', group: 'Theory' },
  { id: 'earth', title: "The Earth's magnetism", group: 'Theory' },
  { id: 'magnetisation', title: 'Magnetisation and magnetic intensity', group: 'Theory' },
  { id: 'kinds', title: 'Diamagnets, paramagnets and ferromagnets', group: 'Theory' },
  { id: 'domains', title: 'Domains and the Curie temperature', group: 'Theory' },
  { id: 'hysteresis', title: 'Hysteresis', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="matter" film={buildFilm} sections={SECTIONS} sideTitle="Magnetism and matter" sideLead="What a magnet really is, why the Earth is one, and why iron sticks to a magnet while copper and water hardly notice it.">
      <header className="article-head">
        <span className="kicker">Physics · Magnetism and matter</span>
        <h1 className="article-title">What is a magnet, really?</h1>
        <p className="article-lead">Every magnet ever made is, deep down, a collection of tiny circulating currents. Once you see that, the pull of a bar magnet, the swing of a compass, and the wildly different behaviour of iron, aluminium and water all follow from one picture.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="The bar magnet" />
        <p>
          A bar magnet attracts iron filings, and the pull is strongest near the two ends, the <strong>poles</strong>. Hang the magnet from a thread and it turns until one end points roughly north. That end is its <strong>north pole</strong>, the other its <strong>south pole</strong>. Unlike poles attract each other and like poles repel.
        </p>
        <p>
          Here is the most important fact: you can never isolate one pole. Cut a bar magnet in two and you do not get a north piece and a south piece. You get two complete magnets, each with its own north and south pole. Cut again and you get four. Electric charges come single, but magnetic poles come in pairs.
        </p>
        <figure className="t-figure">
          <CutMagnet />
          <figcaption>Cut a magnet anywhere and each piece is a full magnet. No cut leaves a lone north or south pole.</figcaption>
        </figure>
        <Note label="No magnetic charge">No one has ever found a free magnetic pole (a "monopole"), despite searching. As far as we know, the building block of magnetism is the pair, called a <strong>dipole</strong>.</Note>
      </section>

      <section className="t-section" id="t-lines">
        <SectionHead n={no('lines')} title="Field lines and Gauss's law" />
        <p>
          The field around a magnet is drawn with <strong>field lines</strong>. The tangent to a line at any point gives the direction of <M>B</M> there, and where the lines are closer together the field is stronger. Outside the magnet the lines run from north to south. Inside the magnet they continue on from south to north. So every line is a <strong>closed loop</strong>, with no start and no end.
        </p>
        <figure className="t-figure">
          <DipoleField />
          <figcaption>The dots show the direction of <M>B</M>. Every line closes on itself. A surface drawn round the north pole has as many lines going in (through the body of the magnet) as going out.</figcaption>
        </figure>
        <p>
          That is <strong>Gauss's law for magnetism</strong>. The number of field lines going out of any closed surface equals the number coming in, so the total magnetic flux through it is zero:
        </p>
        <Eq src='∮ B · d A = 0' />
        <p>
          Compare this with electric fields, where the flux through a closed surface is the enclosed charge divided by <M>ε _0</M>. The right-hand side is zero here because there is no magnetic charge to enclose. The law says, in one line, that magnetic poles cannot be isolated.
        </p>
      </section>

      <section className="t-section" id="t-dipole">
        <SectionHead n={no('dipole')} title="A magnet is a current loop" />
        <p>
          In the last chapter, a current loop in a field felt a torque, and a long coil (a solenoid) made a field just like a bar magnet's: strong inside, closed loops outside, a north pole at one end and a south pole at the other. That is not an accident. Look at the field of a short solenoid and a bar magnet side by side and they are nearly identical.
        </p>
        <figure className="t-figure">
          <EquivalentSolenoid />
          <figcaption>The bar magnet fades into a solenoid, and the field outside does not change. The magnet behaves as if it were full of tiny circulating currents.</figcaption>
        </figure>
        <p>
          The strength of such a magnet is described by its <strong>magnetic moment</strong>. For a coil of <M>N</M> turns, each of area <M>A</M>, carrying current <M>I</M>:
        </p>
        <Eq src='m = N · I · A' />
        <p>
          It is a vector that points along the axis, from the south pole to the north pole, in the direction given by the right-hand rule for the current. Its unit is the ampere-metre squared (A·m²).
        </p>
        <h3 className="t-h3">The magnetism of the atom</h3>
        <p>
          An electron going round the nucleus is a tiny current loop. If it goes round with period <M>T</M>, the current is <M>I = e / T</M> and the loop has area <M>π · r ^2</M>, so
        </p>
        <Eq src={['m = I · A = [ e | T ] · π · r ^2', 'T = [ 2 · π · r | v ]', 'm = [ e · v · r | 2 ]']} />
        <p>
          The angular momentum of the electron is <M>L = m _e · v · r</M>, so the moment is tied to it:
        </p>
        <Eq src='m = [ e | 2 · m _e ] · L' />
        <figure className="t-figure">
          <Atom />
          <figcaption>The orbiting electron is a current loop. Its moment points along the axis, opposite to its angular momentum (the electron is negative).</figcaption>
        </figure>
        <p>
          Quantum theory says <M>L</M> comes in units of <M>h / 2 · π</M>. The smallest unit of magnetic moment is therefore the <strong>Bohr magneton</strong>:
        </p>
        <Eq src='μ _B = [ e · h | 4 · π · m _e ] = 9.27 × 10 ^−24 "A·m²"' />
        <p>
          Electrons also have an <em>intrinsic</em> moment, called spin, of about the same size. These atomic moments are the real source of the magnetism of matter. A bar magnet is a piece of material in which most of them line up the same way.
        </p>
      </section>

      <section className="t-section" id="t-field">
        <SectionHead n={no('field')} title="The field of a magnetic dipole" />
        <p>
          Far from a small magnet (much farther than its length), the field depends only on its moment <M>m</M> and the distance <M>r</M> from its centre. Two places are easy to describe. On the <strong>axis</strong> (the line through both poles) and on the <strong>equator</strong> (the line at right angles through the middle):
        </p>
        <Eq src={['B _axial = [ μ _0 | 4 · π ] · [ 2 · m | r ^3 ]', 'B _equator = [ μ _0 | 4 · π ] · [ m | r ^3 ]']} />
        <figure className="t-figure">
          <AxialEquatorial />
          <figcaption>At the same distance the axial field is twice the equatorial field, and both fall off as <M>1 / r ^3</M>. Double the distance and the field drops to an eighth.</figcaption>
        </figure>
        <p>
          On the axis the field points along <M>m</M>, from south to north. On the equator it points the opposite way, against <M>m</M>. Notice the cube: a dipole field falls off faster than a single charge's, because the two poles cancel each other as you move away.
        </p>
      </section>

      <section className="t-section" id="t-torque">
        <SectionHead n={no('torque')} title="A magnet in a uniform field" />
        <p>
          In a uniform field <M>B</M>, the forces on the two poles are equal and opposite, so there is no net force, only a torque. This is the same result as for a current loop, with <M>m = N · I · A</M>:
        </p>
        <Eq src={['τ = m × B', 'τ = m · B · sin θ']} />
        <p>
          where <M>θ</M> is the angle between the moment and the field. The torque tries to turn the magnet until its moment points along the field, as a compass needle does. To turn the magnet away from this position, work must be done against the torque, and it is stored as potential energy. Taking zero at <M>θ = 90°</M>, the work to turn from <M>90°</M> to <M>θ</M> gives
        </p>
        <Eq src='U = − m · B · cos θ' />
        <p>
          The energy is lowest, <M>− m · B</M>, when the magnet is lined up with the field (<M>θ = 0</M>), and highest, <M>+ m · B</M>, when it is turned right round (<M>θ = 180°</M>).
        </p>
        <figure className="t-figure">
          <CompassTorque />
          <figcaption>Displaced a little and released, the magnet swings back and forth about the field direction while its energy slides up and down the cosine bowl.</figcaption>
        </figure>
        <h3 className="t-h3">The swinging needle</h3>
        <p>
          For small angles, <M>sin θ ≈ θ</M>, so the torque is <M>τ = − m · B · θ</M>, proportional to the angle and pointing back. That is the rule for simple harmonic motion. With <M>I</M> the moment of inertia of the needle about its pivot, <M>I · α = − m · B · θ</M>, so
        </p>
        <Eq src={['ω ^2 = [ m · B | I ]', 'T = 2 · π · √[ [ I | m · B ] ]']} />
        <p>This is how the strength of a magnetic field can be measured: time the swings of a small magnet. A stronger field makes it swing faster.</p>
      </section>

      <section className="t-section" id="t-earth">
        <SectionHead n={no('earth')} title="The Earth's magnetism" />
        <p>
          The Earth's field looks very much like that of a huge bar magnet inside it, tilted about 11° from the axis of rotation. (It is actually made by flowing liquid metal in the core.) A compass needle's north end points toward the Earth's north, so the Earth's magnet has its <em>south</em> pole near the geographic north.
        </p>
        <p>The field at any place is described by three numbers, called the <strong>elements</strong> of the Earth's magnetism:</p>
        <ul className="t-list">
          <li><strong>Declination</strong>, the angle between geographic north and the direction a compass points (the magnetic meridian).</li>
          <li><strong>Dip (inclination)</strong> <M>δ</M>, the angle the total field makes with the horizontal. A dip needle, free to turn in a vertical plane, shows it.</li>
          <li><strong>Horizontal component</strong> <M>B _H</M>, the part of the field along the ground (what a compass feels).</li>
        </ul>
        <figure className="t-figure">
          <EarthDip />
          <figcaption>A dip needle is flat at the equator, tilts down further to the north, and stands straight down at the magnetic pole.</figcaption>
        </figure>
        <p>The total field <M>B _E</M> splits into a horizontal and a vertical part:</p>
        <Eq src={['B _H = B _E · cos δ', 'B _V = B _E · sin δ', 'tan δ = [ B _V | B _H ]', 'B _E = √[ B _H ^2 + B _V ^2 ]']} />
        <figure className="t-figure">
          <DipTriangle />
          <figcaption>The triangle of components. At the equator <M>δ = 0</M> and the field is all horizontal. At the magnetic poles <M>δ = 90°</M> and it is all vertical.</figcaption>
        </figure>
        <p>
          For a dipole field, the dip depends on the magnetic latitude <M>λ</M> by <M>tan δ = 2 · tan λ</M>. In India the horizontal component is about <M>3 × 10 ^−5</M> T, and near the Earth's surface the total field is about 25 to 65 μT.
        </p>
      </section>

      <section className="t-section" id="t-magnetisation">
        <SectionHead n={no('magnetisation')} title="Magnetisation and magnetic intensity" />
        <p>
          Put a piece of material in a field and its atomic magnets respond. The <strong>magnetisation</strong> <M>M</M> is the net magnetic moment per unit volume, in A/m:
        </p>
        <Eq src='M = [ m _net | V ]' />
        <p>
          Suppose we wind a solenoid with <M>n</M> turns per metre carrying a current <M>I</M> and fill it with material. The current in the wire is the one we control, the "free" current, and it makes a field <M>μ _0 · n · I</M> in empty space. The material adds the field of its own magnetisation, <M>μ _0 · M</M>. It is useful to give the field due to the free current alone its own name, the <strong>magnetic intensity</strong> <M>H</M>:
        </p>
        <Eq src={['H = n · I', 'B = μ _0 · ( H + M )']} />
        <p>
          <M>H</M> is what we put in with our coils. <M>B</M> is the total field that results, and it includes the response of the material. For most materials the magnetisation is proportional to the applied intensity:
        </p>
        <Eq src={['M = χ · H', 'B = μ _0 · ( 1 + χ ) · H = μ _0 · μ _r · H', 'μ _r = 1 + χ']} />
        <p>
          The number <M>χ</M> is the <strong>magnetic susceptibility</strong> (no unit), and <M>μ _r</M> is the <strong>relative permeability</strong>. In a vacuum <M>χ = 0</M> and <M>μ _r = 1</M>. The whole subject of materials is the question: what is <M>χ</M>?
        </p>
      </section>

      <section className="t-section" id="t-kinds">
        <SectionHead n={no('kinds')} title="Diamagnets, paramagnets and ferromagnets" />
        <p>
          Materials sort into three families by how they respond to a field.
        </p>
        <figure className="t-figure">
          <ThreeKinds />
          <figcaption>The field is switched on, then off. The diamagnet and paramagnet forget it at once. The ferromagnet keeps its new alignment.</figcaption>
        </figure>
        <h3 className="t-h3">Diamagnetic: χ is small and negative</h3>
        <p>
          In a diamagnet (copper, bismuth, water, gold, silicon) the atoms have no net moment of their own. When a field is applied it makes the electron orbits change a little, and by Lenz's law the new moments <em>oppose</em> the field. The result is a very weak magnetisation pointing against <M>H</M>, <M>χ ≈ −10 ^−5</M>. Diamagnetism is present in all materials, but it is so weak that it is hidden when the other kinds are present. A diamagnet is slightly <em>pushed out</em> of a strong field.
        </p>
        <h3 className="t-h3">Paramagnetic: χ is small and positive</h3>
        <p>
          In a paramagnet (aluminium, sodium, oxygen, platinum) each atom has a permanent magnetic moment, but they point in random directions because of heat motion, so the total is zero. A field leans them a little toward its direction, giving a weak magnetisation along <M>H</M>, <M>χ ≈ +10 ^−5</M>. The effect is fought by the heat motion, so it gets weaker as it gets hotter, and <strong>Curie's law</strong> says
        </p>
        <Eq src='χ = [ C | T ]' />
        <p>where <M>C</M> is the Curie constant and <M>T</M> the temperature in kelvin. A paramagnet is slightly <em>pulled</em> toward the stronger part of a field.</p>
        <h3 className="t-h3">Ferromagnetic: χ is large and positive</h3>
        <p>
          In a ferromagnet (iron, cobalt, nickel and their alloys) neighbouring atomic moments lock together, and <M>χ</M> can reach hundreds or thousands. A ferromagnet is strongly pulled in, and keeps its magnetisation when the field is taken away. This is the stuff of permanent magnets.
        </p>
        <figure className="t-figure">
          <NonUniform />
          <figcaption>Near a strong pole, a diamagnet is pushed away, a paramagnet is weakly pulled in, and a ferromagnet is pulled in hard.</figcaption>
        </figure>
        <p>
          The field lines show the same story. A diamagnet thins the field passing through it, a paramagnet gathers the lines slightly, and a ferromagnet draws in a great many.
        </p>
        <figure className="t-figure">
          <LinesInMaterial />
          <figcaption>The field inside is a little less than outside (dia), a little more (para), or far more (ferro).</figcaption>
        </figure>
        <div className="t-table-wrap">
          <table className="t-table t-symbols">
            <thead>
              <tr>
                <th scope="col">Kind</th>
                <th scope="col">Susceptibility χ</th>
                <th scope="col">Examples</th>
                <th scope="col">In a non-uniform field</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">Diamagnetic</th><td>−10⁻⁵ (small, negative)</td><td>bismuth, copper, water</td><td>pushed toward the weak field</td></tr>
              <tr><th scope="row">Paramagnetic</th><td>+10⁻⁵ (small, positive)</td><td>aluminium, oxygen, platinum</td><td>drawn toward the strong field</td></tr>
              <tr><th scope="row">Ferromagnetic</th><td>10² to 10⁵ (large, positive)</td><td>iron, cobalt, nickel</td><td>pulled strongly toward the strong field</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-domains">
        <SectionHead n={no('domains')} title="Domains and the Curie temperature" />
        <p>
          Why do the atoms of iron lock together? Quantum effects make neighbouring atomic moments prefer to line up. They do this in small patches called <strong>domains</strong>, each holding some 10¹⁵ atoms, all pointing the same way. A piece of unmagnetised iron has its domains pointing every which way, so the whole has no net moment.
        </p>
        <p>
          Apply a field and two things happen. Domains that line up with the field grow at the expense of their neighbours. At higher field the remaining domains swing round to point along the field. Eventually every domain points the same way and the sample is <strong>saturated</strong>: no further magnetisation is possible.
        </p>
        <figure className="t-figure">
          <Domains />
          <figcaption>Each arrow is an atom. Atoms in a domain agree with each other; the field makes the domains agree with it.</figcaption>
        </figure>
        <p>
          Heat fights the order. Above the <strong>Curie temperature</strong> <M>T _c</M> (1043 K for iron, 627 K for nickel) the jiggling of the atoms wins, the domains break up, and the metal becomes a paramagnet. Its susceptibility now follows the Curie–Weiss law:
        </p>
        <Eq src='χ = [ C | T − T _c ]  ,  T > T _c' />
        <figure className="t-figure">
          <CurieTemp />
          <figcaption>As the temperature climbs the order melts away, reaching zero at <M>T _c</M>.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-hysteresis">
        <SectionHead n={no('hysteresis')} title="Hysteresis" />
        <p>
          Wrap a coil round an unmagnetised iron bar and slowly raise the current, so the intensity <M>H</M> rises. The field <M>B</M> in the bar grows quickly and then levels off at saturation. Now reduce <M>H</M> to zero. The bar does not go back to <M>B = 0</M>. Some magnetism stays behind. To remove it we must send current the <em>other way</em>. The curve of <M>B</M> against <M>H</M> traces a loop, called a <strong>hysteresis loop</strong>.
        </p>
        <figure className="t-figure">
          <Hysteresis />
          <figcaption>Out along the first curve to saturation, then round the loop again and again. The bar's field depends on its history, not only on the present <M>H</M>.</figcaption>
        </figure>
        <p>Two points on the loop matter:</p>
        <ul className="t-list">
          <li><strong>Retentivity</strong> (remanence) <M>B _r</M>: the field left in the bar when <M>H</M> is brought back to zero.</li>
          <li><strong>Coercivity</strong> <M>H _c</M>: the reverse intensity needed to bring <M>B</M> to zero.</li>
        </ul>
        <p>
          The area inside the loop is the energy lost as heat in the material each time it is taken round the cycle. That choice of loop shape decides what a material is good for.
        </p>
        <figure className="t-figure">
          <SoftHard />
          <figcaption>A narrow loop, small <M>H _c</M> and small area, for soft iron; a wide loop for steel.</figcaption>
        </figure>
        <p>
          <strong>Soft iron</strong> has a narrow loop, low coercivity and little energy loss, and a very high permeability. It is ideal for electromagnets, transformer cores and electric motors, where the magnetisation has to be reversed many times a second. <strong>Steel</strong> and alloys such as alnico have a wide loop, high retentivity and high coercivity, so once magnetised they stay magnetised. They make permanent magnets.
        </p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table t-formulas">
            <thead>
              <tr>
                <th scope="col">Quantity</th>
                <th scope="col">Formula</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Gauss's law for magnetism", '∮ B · d A = 0'],
                  ['Magnetic moment of a coil', 'm = N · I · A'],
                  ['Orbiting electron', 'm = [ e | 2 · m _e ] · L'],
                  ['Bohr magneton', 'μ _B = [ e · h | 4 · π · m _e ]'],
                  ['Dipole field on the axis', 'B = [ μ _0 | 4 · π ] · [ 2 · m | r ^3 ]'],
                  ['Dipole field on the equator', 'B = [ μ _0 | 4 · π ] · [ m | r ^3 ]'],
                  ['Torque on a magnet', 'τ = m · B · sin θ'],
                  ['Potential energy', 'U = − m · B · cos θ'],
                  ['Period of a swinging magnet', 'T = 2 · π · √[ [ I | m · B ] ]'],
                  ['Earth: horizontal part', 'B _H = B _E · cos δ'],
                  ['Earth: vertical part', 'B _V = B _E · sin δ'],
                  ['Dip angle', 'tan δ = [ B _V | B _H ]'],
                  ['Magnetisation', 'M = [ m _net | V ]'],
                  ['Total field', 'B = μ _0 · ( H + M )'],
                  ['Susceptibility', 'M = χ · H'],
                  ['Relative permeability', 'μ _r = 1 + χ'],
                  ["Curie's law", 'χ = [ C | T ]'],
                  ['Curie–Weiss law', 'χ = [ C | T − T _c ]'],
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
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="The field of a small magnet">
          <p className="ex-q">A small bar magnet has a magnetic moment of 1.5 A·m². Find its field at a point 0.3 m from its centre on the axis, and at a point the same distance away on the equator.</p>
          <Given items={['m = 1.5 "A·m²"', 'r = 0.3 "m"', '[ μ _0 | 4 · π ] = 10 ^−7 "T·m/A"']} />
          <ol className="steps">
            <Step title="On the axis">
              <Eq src='B = [ μ _0 | 4 · π ] · [ 2 · m | r ^3 ] = 10 ^−7 · [ 2 · 1.5 | 0.3 ^3 ] = 10 ^−7 · [ 3 | 0.027 ] = 1.11 × 10 ^−5 "T"' />
            </Step>
            <Step title="On the equator">
              <Eq src='B = [ μ _0 | 4 · π ] · [ m | r ^3 ] = 10 ^−7 · [ 1.5 | 0.027 ] = 5.56 × 10 ^−6 "T"' />
            </Step>
          </ol>
          <Answer>11.1 μT on the axis and 5.56 μT on the equator, which is half. Both are comparable to the Earth's own field, so a compass near this magnet would be thrown off.</Answer>
          <figure className="t-figure">
            <AxialEquatorial />
          </figure>
        </Example>

        <Example n={2} title="A coil as a magnet">
          <p className="ex-q">A coil of 200 turns, each of area 4 cm², carries 2 A. Find its magnetic moment. How does it compare with a bar magnet of moment 1.5 A·m²?</p>
          <Given items={['N = 200', 'A = 4 × 10 ^−4 "m²"', 'I = 2 "A"']} />
          <ol className="steps">
            <Step title="The moment">
              <Eq src='m = N · I · A = 200 · 2 · 4 × 10 ^−4 = 0.16 "A·m²"' />
            </Step>
          </ol>
          <Answer>0.16 A·m², about a tenth of the bar magnet. The coil makes the same kind of field, switched on and off with the current.</Answer>
          <figure className="t-figure">
            <EquivalentSolenoid />
          </figure>
        </Example>

        <Example n={3} title="Turning a magnet in a field">
          <p className="ex-q">A magnet with moment 0.4 A·m² is at 30° to a uniform field of 0.25 T. Find the torque on it, its potential energy, and the work needed to turn it until it is at 90° to the field.</p>
          <Given items={['m = 0.4 "A·m²"', 'B = 0.25 "T"', 'θ = 30°']} />
          <ol className="steps">
            <Step title="The torque">
              <Eq src='τ = m · B · sin θ = 0.4 · 0.25 · 0.5 = 0.050 "N·m"' />
            </Step>
            <Step title="The energy at 30°">
              <Eq src='U = − m · B · cos θ = − 0.4 · 0.25 · 0.866 = − 0.0866 "J"' />
            </Step>
            <Step title="The energy at 90°, and the work">
              <Eq src={['U _90 = − m · B · cos 90° = 0', 'W = U _90 − U _30 = 0 − ( − 0.0866 ) = 0.0866 "J"']} />
            </Step>
          </ol>
          <Answer>The torque is 0.050 N·m. Turning it to 90° takes 0.0866 J of work from outside, which is stored as potential energy.</Answer>
          <figure className="t-figure">
            <CompassTorque />
          </figure>
        </Example>

        <Example n={4} title="A swinging compass needle">
          <p className="ex-q">A compass needle of magnetic moment 0.05 A·m² and moment of inertia 3 × 10⁻⁷ kg·m² is in a horizontal field of 3.0 × 10⁻⁵ T. Find the period of small oscillations.</p>
          <Given items={['m = 0.05 "A·m²"', 'I = 3 × 10 ^−7 "kg·m²"', 'B _H = 3.0 × 10 ^−5 "T"']} />
          <ol className="steps">
            <Step title="Put in the numbers">
              <Eq src='T = 2 · π · √[ [ I | m · B ] ] = 2 · π · √[ [ 3 × 10 ^−7 | 0.05 · 3.0 × 10 ^−5 ] ] = 2 · π · √[ 0.2 ] = 2.81 "s"' />
            </Step>
          </ol>
          <Answer>2.81 s per swing. Double the field and the period falls by the square root of two, to 1.99 s.</Answer>
          <figure className="t-figure">
            <CompassTorque />
          </figure>
        </Example>

        <Example n={5} title="Components of the Earth's field">
          <p className="ex-q">At a place the horizontal component of the Earth's field is 3.0 × 10⁻⁵ T and the angle of dip is 60°. Find the vertical component and the total field.</p>
          <Given items={['B _H = 3.0 × 10 ^−5 "T"', 'δ = 60°']} />
          <ol className="steps">
            <Step title="Vertical component">
              <Eq src='B _V = B _H · tan δ = 3.0 × 10 ^−5 · 1.732 = 5.20 × 10 ^−5 "T"' />
            </Step>
            <Step title="Total field">
              <Eq src={['B _E = [ B _H | cos δ ] = [ 3.0 × 10 ^−5 | 0.5 ] = 6.0 × 10 ^−5 "T"', 'B _E = √[ B _H ^2 + B _V ^2 ] = 6.0 × 10 ^−5 "T"']} />
            </Step>
          </ol>
          <Answer>The vertical component is 52 μT and the total field is 60 μT, twice the horizontal part because <M>cos 60° = 0.5</M>.</Answer>
          <figure className="t-figure">
            <DipTriangle />
          </figure>
        </Example>

        <Example n={6} title="Dip at a given latitude">
          <p className="ex-q">What is the angle of dip at a place where the magnetic latitude is 45°?</p>
          <Given items={['λ = 45°']} />
          <ol className="steps">
            <Step title="Use the dipole relation">
              <Eq src={['tan δ = 2 · tan λ = 2 · tan 45° = 2', 'δ = 63.4°']} />
            </Step>
          </ol>
          <Answer>The needle dips 63.4° below the horizontal, much steeper than the latitude itself, as the diagram of the dip needle shows.</Answer>
          <figure className="t-figure">
            <EarthDip />
          </figure>
        </Example>

        <Example n={7} title="Iron inside a solenoid">
          <p className="ex-q">A solenoid with 1000 turns per metre carries 0.5 A, and is filled with iron of relative permeability 1000. Find H, the magnetisation M and the field B. What would B be without the iron?</p>
          <Given items={['n = 1000 "turns/m"', 'I = 0.5 "A"', 'μ _r = 1000']} />
          <ol className="steps">
            <Step title="The intensity">
              <Eq src='H = n · I = 1000 · 0.5 = 500 "A/m"' />
            </Step>
            <Step title="The magnetisation">
              <Eq src={['χ = μ _r − 1 = 999', 'M = χ · H = 999 · 500 = 4.995 × 10 ^5 "A/m"']} />
            </Step>
            <Step title="The field">
              <Eq src={['B = μ _0 · ( H + M ) = 4 · π × 10 ^−7 · 500000 = 0.628 "T"', 'B _0 = μ _0 · H = 4 · π × 10 ^−7 · 500 = 6.28 × 10 ^−4 "T"']} />
            </Step>
          </ol>
          <Answer>With the iron, B is 0.628 T. Without it, B is only 0.628 mT, a thousand times smaller. The iron's own magnetisation supplies 999 parts in every 1000 of the field.</Answer>
          <figure className="t-figure">
            <LinesInMaterial />
          </figure>
        </Example>

        <Example n={8} title="Curie's law">
          <p className="ex-q">A paramagnetic sample has susceptibility 2.4 × 10⁻⁵ at 300 K. What is it at 200 K? And for iron (T_c = 1043 K), what is the ratio of the susceptibility at 1100 K to that at 1200 K, given the Curie–Weiss law?</p>
          <Given items={['χ _1 = 2.4 × 10 ^−5', 'T _1 = 300 "K"', 'T _2 = 200 "K"', 'T _c = 1043 "K"']} />
          <ol className="steps">
            <Step title="Curie's law">
              <Eq src={['χ ∝ [ 1 | T ]', 'χ _2 = χ _1 · [ T _1 | T _2 ] = 2.4 × 10 ^−5 · [ 300 | 200 ] = 3.6 × 10 ^−5']} />
            </Step>
            <Step title="Curie–Weiss ratio">
              <Eq src='[ χ ( 1100 ) | χ ( 1200 ) ] = [ 1200 − 1043 | 1100 − 1043 ] = [ 157 | 57 ] = 2.75' />
            </Step>
          </ol>
          <Answer>3.6 × 10⁻⁵ at 200 K: cooling makes a paramagnet more magnetisable. For iron above its Curie point, χ at 1100 K is 2.75 times that at 1200 K.</Answer>
          <figure className="t-figure">
            <CurieTemp />
          </figure>
        </Example>

        <Example n={9} title="Wiping a magnet">
          <p className="ex-q">A steel magnet has a coercivity of 4 × 10³ A/m. It is placed inside a solenoid of 2000 turns per metre. What current, in which direction, brings its field to zero?</p>
          <Given items={['H _c = 4 × 10 ^3 "A/m"', 'n = 2000 "turns/m"']} />
          <ol className="steps">
            <Step title="Intensity needed">
              <Eq src='H = n · I = H _c' />
            </Step>
            <Step title="The current">
              <Eq src='I = [ H _c | n ] = [ 4 × 10 ^3 | 2000 ] = 2 "A"' />
            </Step>
          </ol>
          <Answer>2 A, flowing so that it magnetises the bar in the direction <em>opposite</em> to its present one. Going on past 2 A would magnetise it the other way.</Answer>
          <figure className="t-figure">
            <Hysteresis />
          </figure>
        </Example>

        <Example n={10} title="The atom as a current loop">
          <p className="ex-q">In the lowest orbit of hydrogen the electron has radius 5.3 × 10⁻¹¹ m and speed 2.19 × 10⁶ m/s. Find the equivalent current and the magnetic moment, and compare with the Bohr magneton.</p>
          <Given items={['r = 5.3 × 10 ^−11 "m"', 'v = 2.19 × 10 ^6 "m/s"', 'e = 1.6 × 10 ^−19 "C"']} />
          <ol className="steps">
            <Step title="The current">
              <Eq src='I = [ e | T ] = [ e · v | 2 · π · r ] = [ 1.6 × 10 ^−19 · 2.19 × 10 ^6 | 2 · π · 5.3 × 10 ^−11 ] = 1.05 × 10 ^−3 "A"' />
            </Step>
            <Step title="The moment">
              <Eq src='m = [ e · v · r | 2 ] = [ 1.6 × 10 ^−19 · 2.19 × 10 ^6 · 5.3 × 10 ^−11 | 2 ] = 9.29 × 10 ^−24 "A·m²"' />
            </Step>
          </ol>
          <Answer>The electron is a current of about 1 mA going round a loop smaller than an atom. Its moment, 9.29 × 10⁻²⁴ A·m², is the Bohr magneton: the natural unit of atomic magnetism.</Answer>
          <figure className="t-figure">
            <Atom />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Cut a magnet to get a lone pole" wrong="cut → one N and one S" fig={<CutMagnet />}>
            Cutting gives two complete magnets, each with a north and a south pole. Poles come in pairs; this is Gauss's law for magnetism, <M>∮ B · d A = 0</M>.
          </Mistake>
          <Mistake title="Field lines start on the north pole and end on the south" wrong="lines begin at N" fig={<DipoleField />}>
            Outside the magnet the lines run from north to south, but they carry on <em>inside</em> from south to north. Every magnetic field line is a closed loop.
          </Mistake>
          <Mistake title="A compass points to geographic north" wrong={'"declination = 0"'} fig={<EarthDip />}>
            A compass points along the magnetic meridian, which is at some angle (the declination) to geographic north. The Earth's magnetic <em>south</em> pole is near geographic north, which is why the north end of a compass needle points there.
          </Mistake>
          <Mistake title="Only some materials are diamagnetic" wrong="χ _dia = 0 for iron" fig={<ThreeKinds />}>
            Diamagnetism is in every material, because every orbit reacts to a field. In a paramagnet or ferromagnet a much bigger effect covers it up.
          </Mistake>
          <Mistake title="B and H are the same thing" wrong="B = μ _0 · H  everywhere" fig={<LinesInMaterial />}>
            <M>H</M> is due to the free current only. <M>B = μ _0 · ( H + M )</M> includes the magnetisation of the material. Only in empty space (or when <M>χ</M> is very small) are they the same, apart from the constant <M>μ _0</M>.
          </Mistake>
          <Mistake title="Iron stays a magnet when red hot" wrong={'T > T _c → still ferromagnetic'} fig={<CurieTemp />}>
            Above the Curie temperature the domains break up and iron is only a paramagnet, so it loses its permanent magnetism completely.
          </Mistake>
          <Mistake title="A bigger hysteresis loop is better" wrong="area = 0 is bad" fig={<SoftHard />}>
            It depends on the job. A wide loop (hard steel) is what we want for a permanent magnet. A narrow loop (soft iron) is what we want for a transformer or electromagnet, where the area is wasted heat on every cycle.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Every magnet is a swarm of tiny current loops, and materials differ only in how those loops respond.</p>
        <p className="closing-sub">Next: electromagnetic induction. A changing magnetic field makes an electric field, and that is how generators, transformers and induction cookers work.</p>
      </footer>
    </ChapterShell>
  );
}
