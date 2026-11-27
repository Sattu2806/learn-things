import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Eddy, FaradayGraphs, Flux, Generator, Lenz, MagnetCoil, MotionalRod, Mutual, RodCharges, RotatingRod, SelfInduct } from './EmiAnims';

/** Electromagnetic induction: Faraday's law, Lenz's law, motional emf, eddy currents, inductance and the generator. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'A changing field makes a current', group: 'Theory' },
  { id: 'flux', title: 'Magnetic flux', group: 'Theory' },
  { id: 'faraday', title: "Faraday's law", group: 'Theory' },
  { id: 'lenz', title: "Lenz's law", group: 'Theory' },
  { id: 'motional', title: 'Motional emf', group: 'Theory' },
  { id: 'rotating', title: 'A rotating rod', group: 'Theory' },
  { id: 'eddy', title: 'Eddy currents', group: 'Theory' },
  { id: 'self', title: 'Self-inductance', group: 'Theory' },
  { id: 'mutual', title: 'Mutual inductance', group: 'Theory' },
  { id: 'generator', title: 'The AC generator', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="emi" film={buildFilm} sections={SECTIONS} sideTitle="Electromagnetic induction" sideLead="How a changing magnetic field drives a current: the idea behind every generator, transformer and induction cooker.">
      <header className="article-head">
        <span className="kicker">Physics · Electromagnetic induction</span>
        <h1 className="article-title">How does a moving magnet make a current?</h1>
        <p className="article-lead">Oersted showed that a current makes a magnetic field. Could a magnetic field make a current? It can, but only if it is <em>changing</em>. This one discovery lit up the world: every power station on Earth turns a coil in a magnetic field.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="A changing field makes a current" />
        <p>
          In 1831 Michael Faraday (and, independently, Joseph Henry) wired a coil to a sensitive meter with no battery in the circuit. He pushed a magnet toward the coil, and the needle kicked. He held the magnet still, even right inside the coil, and the needle sat at zero. He pulled the magnet out and the needle kicked the <em>other</em> way.
        </p>
        <figure className="t-figure">
          <MagnetCoil />
          <figcaption>The meter reacts only while the magnet is moving. A faster motion gives a bigger kick, and the opposite motion gives the opposite kick.</figcaption>
        </figure>
        <p>
          The same thing happens if you keep the magnet still and move the coil, or swap the magnet for a second coil whose current you switch on and off. In every case, a current flows only while the magnetic field through the coil is <strong>changing</strong>. A steady field, however strong, does nothing. The current is called an <strong>induced current</strong> and the voltage that drives it an <strong>induced emf</strong>.
        </p>
      </section>

      <section className="t-section" id="t-flux">
        <SectionHead n={no('flux')} title="Magnetic flux" />
        <p>
          What exactly is changing? Not just the field <M>B</M>. It is the amount of field that passes through the loop, which we call the <strong>magnetic flux</strong> <M>Φ</M>. Picture the field lines as a stream, and the flux as the number of lines threading through the loop. A bigger loop catches more. A loop that faces the field catches the most. A loop turned edge-on to the field catches none.
        </p>
        <p>
          For a flat loop of area <M>A</M> in a uniform field <M>B</M>, with the normal to the loop (the line at right angles to its face) making an angle <M>θ</M> with <M>B</M>:
        </p>
        <Eq src='Φ = B · A · cos θ' />
        <figure className="t-figure">
          <Flux />
          <figcaption>The bright lines are the ones passing through the loop. Their number is proportional to <M>A · cos θ</M>, the area the loop shows to the field.</figcaption>
        </figure>
        <p>
          In vector form this is a dot product, <M>Φ = B · A</M>, with the area vector <M>A</M> along the normal. For a field that is not uniform, add up <M>B · d A</M> over every small piece of the surface. The SI unit is the <strong>weber</strong> (Wb): <M>1 "Wb" = 1 "T·m²"</M>.
        </p>
        <p>
          That gives three ways to change the flux through a loop: change the field <M>B</M>, change the area <M>A</M>, or change the angle <M>θ</M>. Faraday's discovery is that <em>any</em> of them makes an emf.
        </p>
      </section>

      <section className="t-section" id="t-faraday">
        <SectionHead n={no('faraday')} title="Faraday's law" />
        <p>
          Experiments show that the induced emf is proportional to how <em>fast</em> the flux changes. For a coil of <M>N</M> turns, each linked by the same flux, the emf is
        </p>
        <Eq src='ε = − N · [ d Φ | d t ]' />
        <p>
          where <M>d Φ / d t</M> is the rate of change of the flux through one turn. The factor <M>N</M> is there because the turns are in series and their emfs add. The minus sign is explained in the next section: it records the direction. For a steady rate of change, over a time <M>Δ t</M>, the size of the emf is simply
        </p>
        <Eq src='ε _av = N · [ Δ Φ | Δ t ]' />
        <figure className="t-figure">
          <FaradayGraphs />
          <figcaption>The emf is the slope of the flux graph, upside down. A steep rise of flux makes a large emf, a flat part makes none.</figcaption>
        </figure>
        <p>
          If the coil has resistance <M>R</M>, the induced current is <M>I = ε / R</M>. Over a time <M>Δ t</M> the charge that flows is <M>Q = I · Δ t</M>, so
        </p>
        <Eq src={['Q = [ N · Δ Φ | R · Δ t ] · Δ t', 'Q = [ N · Δ Φ | R ]']} />
        <p>The total charge that flows depends only on the <em>total</em> change in flux, not on how fast it happened. A fast change gives a big current for a short time; a slow one a small current for a long time; the same total charge passes.</p>
      </section>

      <section className="t-section" id="t-lenz">
        <SectionHead n={no('lenz')} title="Lenz's law" />
        <p>
          Which way does the induced current flow? <strong>Lenz's law</strong> says: the induced current flows in the direction that <em>opposes the change</em> in flux that causes it.
        </p>
        <p>
          Push the north pole of a magnet toward a ring. The flux through the ring from the magnet is growing. To oppose that, the ring's current makes its own field pointing back toward the magnet, so the face of the ring toward the magnet behaves as a north pole and <em>repels</em> the incoming magnet. Pull the magnet away and the flux shrinks. Now the ring makes a field that supports it, a south pole facing the magnet, and <em>attracts</em> it back.
        </p>
        <figure className="t-figure">
          <Lenz />
          <figcaption>Coming in, the ring pushes back. Going out, the ring pulls back. In both cases the induced current fights the motion that makes it.</figcaption>
        </figure>
        <p>
          To use the law, ask three questions in order: Which way is the original field? Is the flux growing or shrinking? So which way must the induced field point to fight that? Then use the right-hand rule to turn that field into a current direction.
        </p>
        <Note label="Energy">Lenz's law is the conservation of energy. If the induced current helped the change instead of opposing it, the magnet would be pulled in harder, the current would grow, and you would get unlimited energy for free. Instead you must do work to push the magnet against the opposing force, and that work becomes the electrical energy of the current.</Note>
      </section>

      <section className="t-section" id="t-motional">
        <SectionHead n={no('motional')} title="Motional emf" />
        <p>
          The simplest way to change the flux is to move a conductor through a field. Take a rod of length <M>l</M> moving at speed <M>v</M> at right angles to a uniform field <M>B</M>. The free charges in the rod move with it, so each feels the magnetic force <M>q · v · B</M>, directed along the rod.
        </p>
        <figure className="t-figure">
          <RodCharges />
          <figcaption>The magnetic force drives positive charge to one end. The build-up makes an electric field that finally balances the push, leaving a voltage across the rod.</figcaption>
        </figure>
        <p>
          Charge piles up at the two ends, which makes an electric field <M>E</M> along the rod. The pile-up stops growing when the electric force cancels the magnetic force, <M>q · E = q · v · B</M>. So <M>E = v · B</M> along a length <M>l</M>, and the voltage between the ends is
        </p>
        <Eq src={['ε = E · l', 'ε = B · l · v']} />
        <p>
          Faraday's law gives the same result. Let the rod slide along rails so that it closes a loop. In a time <M>d t</M> the rod moves <M>v · d t</M>, and the area of the loop grows by <M>l · v · d t</M>:
        </p>
        <Eq src={['d Φ = B · d A = B · l · v · d t', 'ε = [ d Φ | d t ] = B · l · v']} />
        <figure className="t-figure">
          <MotionalRod />
          <figcaption>Pulled to the right, the rod gives an emf, and a current circulates. The field pulls back on the rod, so the puller has to keep working.</figcaption>
        </figure>
        <h3 className="t-h3">Current, force and power</h3>
        <p>
          If the circuit has total resistance <M>R</M>, the current is <M>I = B · l · v / R</M>. The rod carries a current in a field, so it feels a magnetic force <M>I · l · B</M> that, by Lenz's law, opposes its motion. To keep the rod moving at steady speed you must push with an equal force:
        </p>
        <Eq src={['I = [ B · l · v | R ]', 'F = I · l · B = [ B ^2 · l ^2 · v | R ]', 'P = F · v = [ B ^2 · l ^2 · v ^2 | R ] = [ ε ^2 | R ] = I ^2 · R']} />
        <p>
          The power you put in with the push comes out as heat in the resistor, <M>I ^2 · R</M>. The books balance exactly: mechanical work in, electrical energy out. Notice the force grows with the speed, so a rod falling or pulled under a steady force soon reaches a steady <strong>terminal speed</strong>.
        </p>
      </section>

      <section className="t-section" id="t-rotating">
        <SectionHead n={no('rotating')} title="A rotating rod" />
        <p>
          A rod of length <M>l</M> turns about one end in a field at right angles to its plane, at angular speed <M>ω</M>. Different parts move at different speeds: zero at the pivot and <M>ω · l</M> at the tip. The speed varies steadily along the rod, so use the average, <M>[ 1 | 2 ] · ω · l</M>:
        </p>
        <Eq src='ε = B · l · v _avg = B · l · [ ω · l | 2 ] = [ 1 | 2 ] · B · ω · l ^2' />
        <figure className="t-figure">
          <RotatingRod />
          <figcaption>The rod sweeps out a fan. In one turn it sweeps the area <M>π · l ^2</M>, so the flux cut each second is <M>B · π · l ^2 · f</M>.</figcaption>
        </figure>
        <p>
          The same result comes from Faraday's law. In a time <M>d t</M> the rod sweeps a thin sector of area <M>[ 1 | 2 ] · l ^2 · ω · d t</M>, so <M>d Φ / d t = [ 1 | 2 ] · B · ω · l ^2</M>. A metal disc turning in a field (a Faraday disc) works the same way, with each radius a rod.
        </p>
      </section>

      <section className="t-section" id="t-eddy">
        <SectionHead n={no('eddy')} title="Eddy currents" />
        <p>
          Induced currents do not need a wire loop. In a lump of metal moving through a field, or sitting in a changing field, free charges can swirl in closed loops inside the metal itself. These are <strong>eddy currents</strong>. Because bulk metal has low resistance, the currents can be large, and by Lenz's law they fight the change that causes them.
        </p>
        <figure className="t-figure">
          <Eddy />
          <figcaption>The solid plate is braked hard and soon stops. The slotted plate, with the currents chopped into small pieces, swings on much longer.</figcaption>
        </figure>
        <p>Eddy currents are useful and harmful:</p>
        <ul className="t-list">
          <li><strong>Braking.</strong> A metal disc turning between magnet poles is slowed with no contact and no wear. Trains, roller coasters and electricity meters use this.</li>
          <li><strong>Induction furnaces.</strong> A rapidly alternating field makes huge eddy currents in a piece of metal, and the heat melts it with nothing touching it. Induction cookers heat the pan this way.</li>
          <li><strong>Metal detectors.</strong> The coil's field makes eddy currents in a hidden metal object; their own field is picked up by a second coil.</li>
          <li><strong>Waste.</strong> In transformers and motors, eddy currents in the iron core only make heat. They are cut down by building the core from thin insulated sheets (laminations), which break the loops into tiny ones, as the slots do in the plate above.</li>
        </ul>
      </section>

      <section className="t-section" id="t-self">
        <SectionHead n={no('self')} title="Self-inductance" />
        <p>
          A coil carrying a current makes a field, and that field links the coil itself. So if the current changes, the flux through the coil changes, and the coil induces an emf in <em>itself</em>. This is <strong>self-induction</strong>. The flux through the coil is proportional to the current, and the constant is the <strong>self-inductance</strong> <M>L</M>:
        </p>
        <Eq src={['N · Φ = L · I', 'ε = − L · [ d I | d t ]']} />
        <p>
          The unit is the <strong>henry</strong> (H), where <M>1 "H" = 1 "V·s/A"</M>. The minus sign is Lenz's law again: the emf opposes the <em>change</em> in current. When the current rises, the emf pushes against it. When the current falls, the emf pushes along with it, trying to keep it going. It does not stop the current, it only makes the current slow to change, like inertia.
        </p>
        <figure className="t-figure">
          <SelfInduct />
          <figcaption>A steady current gives no emf. A rising current gives a negative one, a falling one a positive one. The faster the change, the bigger the emf.</figcaption>
        </figure>
        <h3 className="t-h3">The inductance of a solenoid</h3>
        <p>
          A long solenoid of length <M>l</M>, cross-section area <M>A</M> and <M>N</M> turns has <M>n = N / l</M> turns per metre. The field inside is <M>B = μ _0 · n · I</M>, so the flux through each turn is <M>B · A</M> and the total flux linking all <M>N</M> turns is
        </p>
        <Eq src={['N · Φ = N · B · A = N · μ _0 · n · I · A', 'L = [ N · Φ | I ] = μ _0 · n · N · A', 'L = [ μ _0 · N ^2 · A | l ] = μ _0 · n ^2 · A · l']} />
        <p>
          <M>L</M> depends only on the geometry. Doubling the turns quadruples <M>L</M>, one factor from the field and one from the number of turns it links. An iron core multiplies <M>L</M> by the relative permeability.
        </p>
        <h3 className="t-h3">Energy stored in a coil</h3>
        <p>
          To raise the current in a coil you must work against the induced emf. When the current is <M>i</M> and changing, the power needed is <M>ε · i = L · i · d i / d t</M>, so in a time <M>d t</M> the work done is <M>L · i · d i</M>. Adding up from zero to the final current <M>I</M>:
        </p>
        <Eq src='U = ∫ L · i · d i = [ 1 | 2 ] · L · I ^2' />
        <p>
          The energy is stored in the magnetic field. Put in <M>L</M> and <M>I</M> for a solenoid, <M>L = μ _0 · n ^2 · A · l</M> and <M>B = μ _0 · n · I</M>, and divide by the volume <M>A · l</M> to get the energy per unit volume:
        </p>
        <Eq src='u = [ B ^2 | 2 · μ _0 ]' />
        <p>This is the magnetic partner of the energy density in an electric field, and it holds for any magnetic field, not just a solenoid's.</p>
      </section>

      <section className="t-section" id="t-mutual">
        <SectionHead n={no('mutual')} title="Mutual inductance" />
        <p>
          Put two coils near each other. A changing current <M>I _1</M> in the first makes a changing flux through the second, and so an emf <M>ε _2</M> in the second, even though they are not connected. The flux through the second coil is proportional to the current in the first, and the constant is the <strong>mutual inductance</strong> <M>M</M>:
        </p>
        <Eq src={['N _2 · Φ _2 = M · I _1', 'ε _2 = − M · [ d I _1 | d t ]']} />
        <figure className="t-figure">
          <Mutual />
          <figcaption>The secondary has no battery. Its meter reacts only while the primary's current is changing.</figcaption>
        </figure>
        <p>
          The unit is again the henry. The mutual inductance is the same whichever coil you call the first, and it depends on the sizes, the number of turns, how far apart the coils are, and how they are lined up. For a long solenoid of <M>N _1</M> turns, length <M>l</M> and area <M>A</M>, with a second coil of <M>N _2</M> turns wound tightly round its middle, all the flux of the solenoid also passes through the coil:
        </p>
        <Eq src={['Φ _2 = B _1 · A = [ μ _0 · N _1 · I _1 | l ] · A', 'M = [ N _2 · Φ _2 | I _1 ] = [ μ _0 · N _1 · N _2 · A | l ]']} />
        <p>This effect is how the transformer works: a changing current in the primary coil makes an emf in the secondary, with more turns in one coil or the other to step the voltage up or down.</p>
      </section>

      <section className="t-section" id="t-generator">
        <SectionHead n={no('generator')} title="The AC generator" />
        <p>
          The generator turns the idea of this chapter into electric power. A coil of <M>N</M> turns and area <M>A</M> is spun at angular speed <M>ω</M> in a uniform field <M>B</M>, by water, steam or wind. Measure the angle from the position where the coil faces the field, <M>θ = ω · t</M>. The flux through each turn is
        </p>
        <Eq src='Φ = B · A · cos ( ω · t )' />
        <p>The emf is minus its rate of change, <M>d Φ / d t = − B · A · ω · sin ( ω · t )</M>, so</p>
        <Eq src={['ε = − N · [ d Φ | d t ] = N · B · A · ω · sin ( ω · t )', 'ε = ε _0 · sin ( ω · t )', 'ε _0 = N · B · A · ω']} />
        <figure className="t-figure">
          <Generator />
          <figcaption>The flux is a cosine and the emf a sine. The emf is zero when the coil faces the field (flux greatest, not changing) and greatest when the coil is edge-on (flux zero, changing fastest).</figcaption>
        </figure>
        <p>
          The emf swings positive and negative <M>f = ω / 2 · π</M> times a second, which is alternating current. To get more voltage, use more turns, a bigger coil, a stronger field, or spin faster. The sides of the coil that cut the field are what do the work: each side is a rod moving across the field, with <M>ε = B · l · v</M>, and the two sides in series add up to the same result.
        </p>
        <p>
          Where does the energy come from? When the coil carries a current, the field puts a torque on it that opposes the turning (Lenz's law again). The turbine has to supply a mechanical torque against this, and the work it does is exactly the electrical energy that leaves the generator.
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
                  ['Magnetic flux', 'Φ = B · A · cos θ'],
                  ["Faraday's law", 'ε = − N · [ d Φ | d t ]'],
                  ['Average emf', 'ε _av = N · [ Δ Φ | Δ t ]'],
                  ['Charge that flows', 'Q = [ N · Δ Φ | R ]'],
                  ['Motional emf', 'ε = B · l · v'],
                  ['Current in the rod', 'I = [ B · l · v | R ]'],
                  ['Magnetic drag force', 'F = [ B ^2 · l ^2 · v | R ]'],
                  ['Power', 'P = [ B ^2 · l ^2 · v ^2 | R ]'],
                  ['Rotating rod', 'ε = [ 1 | 2 ] · B · ω · l ^2'],
                  ['Self-inductance', 'N · Φ = L · I'],
                  ['Self-induced emf', 'ε = − L · [ d I | d t ]'],
                  ['Solenoid inductance', 'L = [ μ _0 · N ^2 · A | l ]'],
                  ['Energy in an inductor', 'U = [ 1 | 2 ] · L · I ^2'],
                  ['Energy density', 'u = [ B ^2 | 2 · μ _0 ]'],
                  ['Mutual inductance', 'ε _2 = − M · [ d I _1 | d t ]'],
                  ['Coil on a solenoid', 'M = [ μ _0 · N _1 · N _2 · A | l ]'],
                  ['AC generator', 'ε = N · B · A · ω · sin ( ω · t )'],
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

        <Example n={1} title="A coil in a changing field">
          <p className="ex-q">A coil of 200 turns and area 0.01 m² (10 cm by 10 cm) has its face square to a field that rises from 0.2 T to 0.8 T in 0.5 s. Find the induced emf. If the coil's resistance is 12 Ω, find the current and the charge that flows.</p>
          <Given items={['N = 200', 'A = 0.01 "m²"', 'B _1 = 0.2 "T"', 'B _2 = 0.8 "T"', 'Δ t = 0.5 "s"', 'R = 12 "Ω"']} />
          <ol className="steps">
            <Step title="Change in flux through one turn">
              <Eq src='Δ Φ = A · ( B _2 − B _1 ) = 0.01 · 0.6 = 0.006 "Wb"' />
            </Step>
            <Step title="The emf">
              <Eq src='ε = N · [ Δ Φ | Δ t ] = 200 · [ 0.006 | 0.5 ] = 2.4 "V"' />
            </Step>
            <Step title="Current and charge">
              <Eq src={['I = [ ε | R ] = [ 2.4 | 12 ] = 0.2 "A"', 'Q = I · Δ t = 0.2 · 0.5 = 0.1 "C"', 'Q = [ N · Δ Φ | R ] = [ 200 · 0.006 | 12 ] = 0.1 "C"']} />
            </Step>
          </ol>
          <Answer>2.4 V drives 0.2 A for 0.5 s, so 0.1 C flows. The direction opposes the rise of the field, by Lenz's law.</Answer>
          <figure className="t-figure">
            <FaradayGraphs />
          </figure>
        </Example>

        <Example n={2} title="A turning loop">
          <p className="ex-q">A coil of 10 turns, each of area 0.05 m², faces a uniform field of 0.4 T. It is turned through 90° to edge-on in 0.1 s. Find the average emf.</p>
          <Given items={['N = 10', 'A = 0.05 "m²"', 'B = 0.4 "T"', 'Δ t = 0.1 "s"']} />
          <ol className="steps">
            <Step title="The flux before and after">
              <Eq src={['Φ _1 = B · A · cos 0° = 0.4 · 0.05 = 0.02 "Wb"', 'Φ _2 = B · A · cos 90° = 0']} />
            </Step>
            <Step title="The emf">
              <Eq src='ε _av = N · [ Δ Φ | Δ t ] = 10 · [ 0.02 | 0.1 ] = 2 "V"' />
            </Step>
          </ol>
          <Answer>2 V on average. The flux went from the biggest it can be to zero, purely through the change of angle.</Answer>
          <figure className="t-figure">
            <Flux />
          </figure>
        </Example>

        <Example n={3} title="A rod on rails">
          <p className="ex-q">A 0.4 m rod slides at 5 m/s on rails, at right angles to a field of 0.25 T. The circuit has a resistance of 2 Ω. Find the emf, the current, the force needed to keep the rod moving and the power supplied.</p>
          <Given items={['l = 0.4 "m"', 'v = 5 "m/s"', 'B = 0.25 "T"', 'R = 2 "Ω"']} />
          <ol className="steps">
            <Step title="The emf and the current">
              <Eq src={['ε = B · l · v = 0.25 · 0.4 · 5 = 0.5 "V"', 'I = [ ε | R ] = [ 0.5 | 2 ] = 0.25 "A"']} />
            </Step>
            <Step title="The force to hold it steady">
              <Eq src='F = I · l · B = 0.25 · 0.4 · 0.25 = 0.025 "N"' />
            </Step>
            <Step title="The power">
              <Eq src={['P = F · v = 0.025 · 5 = 0.125 "W"', 'P = I ^2 · R = 0.25 ^2 · 2 = 0.125 "W"']} />
            </Step>
          </ol>
          <Answer>0.5 V, 0.25 A, a push of 0.025 N, and 0.125 W. Both ways of finding the power agree: the work you do is all turned into heat in the resistor.</Answer>
          <figure className="t-figure">
            <MotionalRod />
          </figure>
        </Example>

        <Example n={4} title="A falling rod">
          <p className="ex-q">A 0.05 kg rod of length 0.5 m slides without friction down two vertical rails, joined at the bottom by a total resistance of 1 Ω, in a horizontal field of 0.4 T. Find the terminal speed. (Use g = 9.8 m/s².)</p>
          <Given items={['m = 0.05 "kg"', 'l = 0.5 "m"', 'R = 1 "Ω"', 'B = 0.4 "T"', 'g = 9.8 "m/s²"']} />
          <ol className="steps">
            <Step title="At terminal speed the forces balance">
              <Eq src={['m · g = [ B ^2 · l ^2 · v | R ]', 'v = [ m · g · R | B ^2 · l ^2 ]']} />
            </Step>
            <Step title="Numbers">
              <Eq src='v = [ 0.05 · 9.8 · 1 | 0.4 ^2 · 0.5 ^2 ] = [ 0.49 | 0.04 ] = 12.25 "m/s"' />
            </Step>
          </ol>
          <Answer>12.25 m/s. At this speed the current is <M>0.4 · 0.5 · 12.25 / 1 = 2.45</M> A, and the magnetic force exactly balances the weight of 0.49 N.</Answer>
          <figure className="t-figure">
            <MotionalRod />
          </figure>
        </Example>

        <Example n={5} title="A spinning rod">
          <p className="ex-q">A 0.5 m metal rod spins about one end at 10 revolutions per second in a field of 0.2 T at right angles to its plane. Find the emf between its ends.</p>
          <Given items={['l = 0.5 "m"', 'f = 10 "Hz"', 'B = 0.2 "T"']} />
          <ol className="steps">
            <Step title="Angular speed">
              <Eq src='ω = 2 · π · f = 2 · π · 10 = 62.8 "rad/s"' />
            </Step>
            <Step title="The emf">
              <Eq src='ε = [ 1 | 2 ] · B · ω · l ^2 = [ 1 | 2 ] · 0.2 · 62.8 · 0.5 ^2 = 1.57 "V"' />
            </Step>
          </ol>
          <Answer>1.57 V. The tip moves at 31.4 m/s, the middle at half that, and the pivot hardly at all.</Answer>
          <figure className="t-figure">
            <RotatingRod />
          </figure>
        </Example>

        <Example n={6} title="A solenoid's inductance">
          <p className="ex-q">A solenoid has 500 turns over a length of 0.5 m and a cross-section of 1.0 × 10⁻³ m². Find its self-inductance. If the current of 4 A is cut to zero in 0.01 s, what average emf appears, and how much energy was stored?</p>
          <Given items={['N = 500', 'l = 0.5 "m"', 'A = 1.0 × 10 ^−3 "m²"', 'I = 4 "A"', 'Δ t = 0.01 "s"']} />
          <ol className="steps">
            <Step title="The inductance">
              <Eq src='L = [ μ _0 · N ^2 · A | l ] = [ 4 · π × 10 ^−7 · 500 ^2 · 1.0 × 10 ^−3 | 0.5 ] = 6.28 × 10 ^−4 "H"' />
            </Step>
            <Step title="The emf when the current is cut">
              <Eq src='ε = L · [ Δ I | Δ t ] = 6.28 × 10 ^−4 · [ 4 | 0.01 ] = 0.251 "V"' />
            </Step>
            <Step title="The energy stored">
              <Eq src='U = [ 1 | 2 ] · L · I ^2 = [ 1 | 2 ] · 6.28 × 10 ^−4 · 4 ^2 = 5.03 × 10 ^−3 "J"' />
            </Step>
          </ol>
          <Answer>0.628 mH. The emf is 0.251 V, pushing the current on while it falls, and 5.03 mJ was stored in the field. Cut the current faster and the emf rises in proportion: in 1 ms it would be 2.5 V.</Answer>
          <figure className="t-figure">
            <SelfInduct />
          </figure>
        </Example>

        <Example n={7} title="Energy in the field">
          <p className="ex-q">For the solenoid of Example 6 carrying 4 A, find the field inside it and the energy density. Show that the energy in the volume agrees with <M>[ 1 | 2 ] · L · I ^2</M>.</p>
          <Given items={['n = 1000 "turns/m"', 'I = 4 "A"', 'V = A · l = 5 × 10 ^−4 "m³"']} />
          <ol className="steps">
            <Step title="The field">
              <Eq src='B = μ _0 · n · I = 4 · π × 10 ^−7 · 1000 · 4 = 5.03 × 10 ^−3 "T"' />
            </Step>
            <Step title="The energy density">
              <Eq src='u = [ B ^2 | 2 · μ _0 ] = [ ( 5.03 × 10 ^−3 ) ^2 | 2 · 4 · π × 10 ^−7 ] = 10.1 "J/m³"' />
            </Step>
            <Step title="Energy in the volume">
              <Eq src='U = u · V = 10.1 · 5 × 10 ^−4 = 5.03 × 10 ^−3 "J"' />
            </Step>
          </ol>
          <Answer>The field is 5.03 mT, the energy density 10.1 J/m³, and the total is 5.03 mJ, the same as <M>[ 1 | 2 ] · L · I ^2</M> in the last example.</Answer>
          <figure className="t-figure">
            <SelfInduct />
          </figure>
        </Example>

        <Example n={8} title="A coil wound on a solenoid">
          <p className="ex-q">A second coil of 100 turns is wound tightly around the middle of the solenoid above (500 turns, 0.5 m long, 1.0 × 10⁻³ m²). Find the mutual inductance, and the emf in it when the solenoid current falls from 3 A to zero in 0.02 s.</p>
          <Given items={['N _1 = 500', 'N _2 = 100', 'l = 0.5 "m"', 'A = 1.0 × 10 ^−3 "m²"', 'Δ I = 3 "A"', 'Δ t = 0.02 "s"']} />
          <ol className="steps">
            <Step title="The mutual inductance">
              <Eq src='M = [ μ _0 · N _1 · N _2 · A | l ] = [ 4 · π × 10 ^−7 · 500 · 100 · 1.0 × 10 ^−3 | 0.5 ] = 1.26 × 10 ^−4 "H"' />
            </Step>
            <Step title="The emf">
              <Eq src='ε _2 = M · [ Δ I | Δ t ] = 1.26 × 10 ^−4 · [ 3 | 0.02 ] = 0.0189 "V"' />
            </Step>
          </ol>
          <Answer>M is 0.126 mH, and the induced emf is 18.9 mV while the current falls. More turns on the second coil, or a faster change, would make it bigger.</Answer>
          <figure className="t-figure">
            <Mutual />
          </figure>
        </Example>

        <Example n={9} title="A generator">
          <p className="ex-q">A coil of 100 turns and area 0.05 m² rotates at 50 Hz in a field of 0.4 T. Find the peak emf, and the emf at <M>t = 1 / 300</M> s after the coil faces the field.</p>
          <Given items={['N = 100', 'A = 0.05 "m²"', 'B = 0.4 "T"', 'f = 50 "Hz"']} />
          <ol className="steps">
            <Step title="Angular speed and peak emf">
              <Eq src={['ω = 2 · π · f = 2 · π · 50 = 314.2 "rad/s"', 'ε _0 = N · B · A · ω = 100 · 0.4 · 0.05 · 314.2 = 628 "V"']} />
            </Step>
            <Step title="The emf at t = 1/300 s">
              <Eq src={['ω · t = 314.2 · [ 1 | 300 ] = 1.047 "rad" = 60°', 'ε = 628 · sin 60° = 628 · 0.866 = 544 "V"']} />
            </Step>
          </ol>
          <Answer>The peak emf is 628 V. After 1/300 s the coil has turned 60°, and the emf is 544 V. The period is 1/50 = 0.02 s, so this is one-sixth of the way through the cycle.</Answer>
          <figure className="t-figure">
            <Generator />
          </figure>
        </Example>

        <Example n={10} title="Which way does the current go?">
          <p className="ex-q">The north pole of a bar magnet is pushed toward a flat ring, with the ring in front of the magnet. Seen from the magnet's side, does the induced current go clockwise or anticlockwise?</p>
          <ol className="steps">
            <Step title="What is the original field, and how is it changing?">
              <p>The field of the north pole points away from the magnet, through the ring. As the magnet comes closer, that field through the ring grows stronger, so the flux is increasing.</p>
            </Step>
            <Step title="What must the induced field do?">
              <p>It must oppose the increase, so it must point the other way, back toward the magnet. The face of the ring toward the magnet must act as a north pole.</p>
            </Step>
            <Step title="Right-hand rule for the current">
              <p>A field pointing out toward you comes from an anticlockwise current, seen from your side. The magnet's side is the side we look from.</p>
            </Step>
          </ol>
          <Answer>Anticlockwise, seen from the magnet's side. It makes a north pole facing the magnet, which repels the magnet and so opposes the approach. Pull the magnet away and the current reverses to clockwise.</Answer>
          <figure className="t-figure">
            <Lenz />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="A strong field induces a current" wrong={'B "large" → ε ≠ 0'} fig={<MagnetCoil />}>
            It is the <em>change</em> in flux that matters. A steady field, however strong, even one right through the coil, gives <M>d Φ / d t = 0</M> and no emf.
          </Mistake>
          <Mistake title="The induced field always points against the field" wrong="B _ind opposes B" fig={<Lenz />}>
            Lenz's law says the induced field opposes the <em>change</em> in flux, not the flux itself. If the flux is falling, the induced field points the <em>same</em> way as the original, to try to keep it up.
          </Mistake>
          <Mistake title="An open circuit has an induced current" wrong="ε ≠ 0 → I ≠ 0" fig={<RodCharges />}>
            The emf is there as soon as the flux changes (or a rod moves in a field), but a current needs a closed path. With an open circuit there is an emf at the ends, and charge just piles up there.
          </Mistake>
          <Mistake title="Moving a rod through a field costs nothing" wrong="F = 0 for a moving rod" fig={<MotionalRod />}>
            The induced current in the rod feels a magnetic force <M>B ^2 · l ^2 · v / R</M> that opposes the motion. You have to push to keep it going, and that work is what powers the current.
          </Mistake>
          <Mistake title="Self-induction stops the current from flowing" wrong="ε = − L · I" fig={<SelfInduct />}>
            Self-inductance opposes the <em>rate of change</em> of current, <M>ε = − L · d I / d t</M>. A steady current in an ideal coil meets no opposition at all.
          </Mistake>
          <Mistake title="Eddy currents are always a nuisance" wrong="eddy = waste" fig={<Eddy />}>
            They heat the cores of transformers, which is why those are laminated. But they also work for us: in induction cookers and furnaces, in magnetic brakes and in metal detectors.
          </Mistake>
          <Mistake title="The emf in a generator is biggest when the flux is biggest" wrong={'ε _max "when" Φ _max'} fig={<Generator />}>
            The emf follows the <em>rate of change</em> of the flux. When the coil faces the field the flux is greatest, but it is momentarily not changing, so the emf is zero. The emf peaks a quarter of a turn later, when the flux is zero and changing fastest.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Change the flux, and nature answers with an emf that fights the change.</p>
        <p className="closing-sub">Next: alternating current. The generator's sine-wave emf drives currents through resistors, coils and capacitors, and a transformer steps the voltage up and down.</p>
      </footer>
    </ChapterShell>
  );
}
