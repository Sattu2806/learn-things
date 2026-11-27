import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { CapCombo, ChargeSharing, ChargingCap, ConductorShield, Dielectric, DipoleEnergy, DipolePotential, EnergyDensity, Equipotentials, FieldFromV, ParallelPlate, PotentialHill, SystemEnergy, WorkPaths } from './PotentialAnims';

/** Electrostatic potential and capacitance. */

const SECTIONS: NoteSection[] = [
  { id: 'work', title: 'Work and potential energy', group: 'Theory' },
  { id: 'potential', title: 'Electric potential', group: 'Theory' },
  { id: 'point', title: 'Potential of a point charge', group: 'Theory' },
  { id: 'dipole', title: 'Potential of a dipole', group: 'Theory' },
  { id: 'equi', title: 'Equipotential surfaces', group: 'Theory' },
  { id: 'ev', title: 'Field from potential', group: 'Theory' },
  { id: 'energy', title: 'Energy of charges', group: 'Theory' },
  { id: 'conductors', title: 'Conductors in electrostatics', group: 'Theory' },
  { id: 'capacitor', title: 'The capacitor', group: 'Theory' },
  { id: 'dielectric', title: 'Dielectrics', group: 'Theory' },
  { id: 'combos', title: 'Capacitors in series and parallel', group: 'Theory' },
  { id: 'stored', title: 'Energy stored in a capacitor', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="potential" film={buildFilm} sections={SECTIONS} sideTitle="Potential and capacitance" sideLead="Energy instead of force: how much work it takes to move a charge, and how a pair of plates can store it.">
      <header className="article-head">
        <span className="kicker">Physics · Electrostatics</span>
        <h1 className="article-title">How much energy does it take to move a charge?</h1>
        <p className="article-lead">Forces on charges are vectors and awkward to add. Energy is a plain number. This chapter turns the electric field into a potential, a single number at each point, and then uses it to understand conductors and the capacitor, a device that stores charge and energy.</p>
      </header>

      <section className="t-section" id="t-work">
        <SectionHead n={no('work')} title="Work and potential energy" />
        <p>
          A charge <M>q</M> in an electric field <M>E</M> feels a force <M>q · E</M>. Moving it takes work. If you push it slowly, so it gains no speed, your work is stored as <strong>potential energy</strong> in the arrangement of charges, just as lifting a book stores gravitational potential energy.
        </p>
        <p>
          The electric force, like gravity, is <strong>conservative</strong>: the work depends only on where you start and where you finish, not on the path. Take a uniform field and a positive charge pushed against it. Only the part of the move that goes <em>along</em> the field costs work. Sideways steps are free, because the force is at right angles to them.
        </p>
        <figure className="t-figure">
          <WorkPaths />
          <figcaption>A straight route and a winding route from A to B. The winding one wanders sideways, but the work (counted by progress along the field) finishes at the same total.</figcaption>
        </figure>
        <p>
          So we can define the change in potential energy <M>Δ U</M> between two points as the work done by an external agent in carrying the charge from one to the other, slowly:
        </p>
        <Eq src='Δ U = U _B − U _A = W _A→B' />
        <p>
          Going <em>with</em> the push of the field the energy falls, and going against it the energy rises. Only differences matter. We are free to choose where the energy is zero, and for point charges the natural choice is infinitely far away.
        </p>
      </section>

      <section className="t-section" id="t-potential">
        <SectionHead n={no('potential')} title="Electric potential" />
        <p>
          The potential energy depends on how big the moved charge is. Divide the charge out and you get something that belongs to the <em>place</em>. The <strong>electric potential difference</strong> between two points is the work needed per unit positive charge to carry a test charge from A to B:
        </p>
        <Eq src='V _B − V _A = [ W _A→B | q _0 ]' />
        <p>
          The unit is the <strong>volt</strong>: <M>1 "V" = 1 "J/C"</M>. Potential is a <em>scalar</em>, a plain number with a sign. The <strong>potential at a point</strong> is the work per unit charge to bring a test charge there from infinity, where the potential is taken to be zero.
        </p>
        <p>
          Once the potential is known, the potential energy of any charge <M>q</M> there is <M>q · V</M>. When a charge moves through a potential difference <M>Δ V</M>, the field does work <M>− q · Δ V</M> on it, which turns into kinetic energy if nothing else acts:
        </p>
        <Eq src={['Δ KE = − q · Δ V', '[ 1 | 2 ] · m · v ^2 = q · V']} />
        <p>(the second line is for a charge released from rest that falls through a potential drop <M>V</M>).</p>
        <h3 className="t-h3">The electron-volt</h3>
        <p>
          A convenient unit of energy for atoms and particles is the <strong>electron-volt</strong>, the energy an electron gains falling through one volt:
        </p>
        <Eq src='1 "eV" = 1.6 × 10 ^−19 "C" · 1 "V" = 1.6 × 10 ^−19 "J"' />
      </section>

      <section className="t-section" id="t-point">
        <SectionHead n={no('point')} title="Potential of a point charge" />
        <p>
          Bring a positive test charge in from infinity to a distance <M>r</M> from a point charge <M>Q</M>. At a distance <M>x</M> along the way, the field of <M>Q</M> is <M>k · Q / x ^2</M>, and we push against it. The work per unit charge is the sum of <M>E · d x</M> over the whole path, with a minus sign because we push against the field as <M>x</M> decreases:
        </p>
        <Eq src={['V = − ∫ _∞ ^r E · d x', 'V = − ∫ _∞ ^r [ k · Q | x ^2 ] · d x', 'V = − k · Q · ( [ − 1 | r ] − [ − 1 | ∞ ] )']} />
        <p>
          The inner step uses the fact that the integral of <M>1 / x ^2</M> is <M>− 1 / x</M>. At the limits, <M>1 / ∞ = 0</M>, so
        </p>
        <Eq src='V = k · [ Q | r ] = [ 1 | 4 · π · ε _0 ] · [ Q | r ]' />
        <p>
          The sign follows the sign of <M>Q</M>: a positive charge has positive potential all round it, and a negative charge negative. The potential falls as <M>1 / r</M>, more slowly than the field's <M>1 / r ^2</M>.
        </p>
        <figure className="t-figure">
          <PotentialHill />
          <figcaption>Around a positive charge the potential is a hill. A positive test charge rolls down it, away from the source, speeding up as it goes. The force arrow points downhill.</figcaption>
        </figure>
        <figure className="t-figure">
          <PotentialHill q={-1} />
          <figcaption>Around a negative charge the potential is a well. The same test charge falls into it.</figcaption>
        </figure>
        <h3 className="t-h3">Many charges</h3>
        <p>
          Potentials are scalars, so for several charges just <em>add the numbers</em>, with their signs. No components, no angles:
        </p>
        <Eq src='V = k · [ q _1 | r _1 ] + k · [ q _2 | r _2 ] + k · [ q _3 | r _3 ] + …' />
      </section>

      <section className="t-section" id="t-dipole">
        <SectionHead n={no('dipole')} title="Potential of a dipole" />
        <p>
          Take a dipole (charges <M>+ q</M> and <M>− q</M>, a distance <M>2 · a</M> apart) and a point at distance <M>r</M> from its centre, at angle <M>θ</M> from the dipole axis. Far away (<M>r</M> much bigger than <M>a</M>) the distances to the two charges are very nearly <M>r − a · cos θ</M> and <M>r + a · cos θ</M>:
        </p>
        <Eq src={['V = k · q · [ 1 | r − a · cos θ ] − k · q · [ 1 | r + a · cos θ ]', 'V = k · q · [ 2 · a · cos θ | r ^2 − a ^2 · cos ^2 θ ]', 'V = [ k · p · cos θ | r ^2 ]']} />
        <p>
          in the last step <M>a ^2 · cos ^2 θ</M> was dropped against <M>r ^2</M>, and <M>p = q · 2 · a</M>. The potential falls as <M>1 / r ^2</M>, faster than the single charge's <M>1 / r</M>, because the two charges nearly cancel.
        </p>
        <figure className="t-figure">
          <DipolePotential />
          <figcaption>
            At a fixed distance the potential follows <M>cos θ</M>: positive on the side of <M>+ q</M>, negative on the side of <M>− q</M>, and exactly zero on the middle line (<M>θ = 90°</M>), where <M>V = 0</M> even though the field there is not zero.
          </figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-equi">
        <SectionHead n={no('equi')} title="Equipotential surfaces" />
        <p>
          An <strong>equipotential surface</strong> is a surface on which the potential has the same value everywhere. For a point charge these are spheres around it. Two facts about them are used constantly.
        </p>
        <ul className="t-list">
          <li>No work is done moving a charge along an equipotential, so the force must have no component along it. The field is therefore <strong>perpendicular</strong> to the surface at every point.</li>
          <li>The field points from higher potential to lower potential, since a positive charge rolls downhill.</li>
        </ul>
        <figure className="t-figure">
          <Equipotentials title="Spherical equipotential surfaces around a positive charge, drawn at equal steps of potential, with a probe moving outward along a field line and another moving round one surface" kind="point" />
          <figcaption>Circles at equal steps of potential. They are crowded near the charge, where the field is strong, and spread out far away. The ghost dot moving along a circle feels no change in <M>V</M>; the solid dot moving out along a field line sees <M>V</M> fall.</figcaption>
        </figure>
        <figure className="t-figure">
          <Equipotentials title="Equally spaced flat equipotential planes between two charged plates with a charge falling through them and the potential reading falling steadily" kind="plates" height={230} />
          <figcaption>In a uniform field the surfaces are equally spaced flat planes perpendicular to the field, like the steps of a staircase of equal height.</figcaption>
        </figure>
        <figure className="t-figure">
          <Equipotentials title="Equipotential curves of a positive and a negative charge, with the zero potential line along the middle where a probe shows the field is not zero" kind="dipole" height={290} />
          <figcaption>A dipole. The thick line half way between the charges is at <M>V = 0</M>, yet the field arrow on it is clearly not zero. The field always crosses equipotentials at right angles.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-ev">
        <SectionHead n={no('ev')} title="Field from potential" />
        <p>
          Move a test charge a short step <M>d x</M> along the field. The potential changes by the work per unit charge, <M>d V = − E · d x</M>. So the field is minus the rate of change of the potential with distance:
        </p>
        <Eq src='E = − [ d V | d x ]' />
        <p>
          The field is minus the <em>slope</em> of the potential. It is large where the potential changes quickly, which is where the equipotentials are packed close, and it points in the direction of falling potential. For a uniform field, where <M>V</M> falls evenly across a distance <M>d</M>:
        </p>
        <Eq src='E = [ V | d ]' />
        <p>The unit <M>"V/m"</M> is the same as <M>"N/C"</M>.</p>
        <figure className="t-figure">
          <FieldFromV />
          <figcaption>Where the graph is steep the arrow is long. Where it is flat (the top and bottom of the curve) the field is zero. The arrow always points down the slope.</figcaption>
        </figure>
        <p>Applying this to <M>V = k · Q / r</M> and taking the slope gives back <M>E = k · Q / r ^2</M>, as it should.</p>
      </section>

      <section className="t-section" id="t-energy">
        <SectionHead n={no('energy')} title="Energy of charges" />
        <h3 className="t-h3">A system of point charges</h3>
        <p>
          How much energy is stored in an arrangement of charges? Bring them in one at a time from far away. The first charge arrives in empty space, so it costs nothing. The second arrives in the field of the first, and costs <M>q _2 · V _1</M>. The third feels both, and so on. For two charges:
        </p>
        <Eq src='U = k · [ q _1 · q _2 | r _12 ]' />
        <p>For more charges add one such term for <em>every pair</em>, once each:</p>
        <Eq src='U = k · [ q _1 · q _2 | r _12 ] + k · [ q _1 · q _3 | r _13 ] + k · [ q _2 · q _3 | r _23 ]' />
        <figure className="t-figure">
          <SystemEnergy />
          <figcaption>Three equal charges at the corners of a triangle. The first costs nothing, the second one unit, and the third two (it is pushed by both). Altogether three pairs, three units.</figcaption>
        </figure>
        <p>Like charges give positive energy (work was needed to push them together). Unlike charges give negative energy (they would fall together on their own).</p>
        <h3 className="t-h3">A dipole in a uniform field</h3>
        <p>
          A dipole at angle <M>θ</M> to the field feels a torque <M>p · E · sin θ</M>. The work to turn it from <M>90°</M> to <M>θ</M> is stored as potential energy. We take <M>U = 0</M> at <M>90°</M>:
        </p>
        <Eq src={['U = ∫ _90° ^θ p · E · sin φ · d φ', 'U = − p · E · cos θ']} />
        <p>
          The energy is lowest, <M>− p · E</M>, when the dipole points along the field (the stable position), zero when it is crossways, and highest, <M>+ p · E</M>, when it points against the field. Turning it all the way round costs <M>2 · p · E</M>.
        </p>
        <figure className="t-figure">
          <DipoleEnergy />
          <figcaption>The dot rolls back and forth in the valley at <M>θ = 0</M>. Like any stable equilibrium, the dipole sits at the lowest energy.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-conductors">
        <SectionHead n={no('conductors')} title="Conductors in electrostatics" />
        <p>
          Once all the charges in a conductor have stopped moving (the electrostatic condition), these things must be true.
        </p>
        <ul className="t-list">
          <li>
            <strong>The field inside is zero.</strong> If it were not, it would push the free charges and they would keep moving.
          </li>
          <li>
            <strong>The whole conductor is at one potential.</strong> With <M>E = 0</M> inside, <M>d V = 0</M> between any two points of it.
          </li>
          <li>
            <strong>Extra charge sits only on the surface.</strong> A Gaussian surface just inside the metal has <M>E = 0</M> on it, so it encloses no net charge.
          </li>
          <li>
            <strong>The field just outside is perpendicular to the surface</strong> and has size <M>σ / ε _0</M>. A thin pillbox through the surface has flux only through its outer end: <M>E · A = σ · A / ε _0</M>.
          </li>
        </ul>
        <figure className="t-figure">
          <ConductorShield />
          <figcaption>Put a metal block in a field. Free electrons drift left until the charge on its faces produces a field of its own that exactly cancels the outside one inside the metal. This is why a hollow metal box shields what is in it.</figcaption>
        </figure>
        <p>
          For a conducting sphere of radius <M>R</M> carrying charge <M>Q</M>, the field outside is that of a point charge, and the potential at the surface (and everywhere inside) is
        </p>
        <Eq src='V = k · [ Q | R ]' />
      </section>

      <section className="t-section" id="t-capacitor">
        <SectionHead n={no('capacitor')} title="The capacitor" />
        <p>
          A <strong>capacitor</strong> is two conductors close together that carry equal and opposite charges <M>+ Q</M> and <M>− Q</M>. Connect them to a battery of voltage <M>V</M> and charge flows until the potential difference between the plates equals the battery's. Double the voltage and the charge doubles, so <M>Q</M> is proportional to <M>V</M>. The ratio is the <strong>capacitance</strong>:
        </p>
        <Eq src='C = [ Q | V ]' />
        <p>
          The unit is the <strong>farad</strong>, <M>1 "F" = 1 "C/V"</M>. A farad is huge, so practical capacitors are microfarads (<M>"μF"</M>), nanofarads or picofarads. The capacitance depends only on the shape and the gap, not on <M>Q</M> or <M>V</M>.
        </p>
        <figure className="t-figure">
          <ChargingCap />
          <figcaption>The battery pulls electrons off one plate and puts them on the other. The charge rises quickly at first and levels off as the plates' voltage catches up with the battery's.</figcaption>
        </figure>
        <h3 className="t-h3">The parallel-plate capacitor</h3>
        <p>
          Two large flat plates of area <M>A</M> a gap <M>d</M> apart, with charge <M>± Q</M>. The charge density is <M>σ = Q / A</M>. Between the plates the two sheets' fields add to <M>σ / ε _0</M> and outside they cancel. Then the voltage is the field times the gap:
        </p>
        <Eq src={['E = [ σ | ε _0 ] = [ Q | ε _0 · A ]', 'V = E · d = [ Q · d | ε _0 · A ]', 'C = [ Q | V ] = [ ε _0 · A | d ]']} />
        <p>
          More area gives more room for charge, and a smaller gap lets each plate's opposite charge pull the charge closer. Both make <M>C</M> larger.
        </p>
        <figure className="t-figure">
          <ParallelPlate />
          <figcaption>On a fixed battery, bringing the plates closer lets them hold more charge. The graph shows <M>C ∝ 1 / d</M>.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-dielectric">
        <SectionHead n={no('dielectric')} title="Dielectrics" />
        <p>
          An insulator placed between the plates is called a <strong>dielectric</strong>. Its molecules are, or become, tiny dipoles. In the field they turn to line up, so one face of the slab gets a layer of negative charge and the other a layer of positive. This <em>bound charge</em> makes a field that points against the original one, so the field inside is weaker than before.
        </p>
        <p>
          The field is reduced by a number <M>K</M>, the <strong>dielectric constant</strong> of the material (<M>K</M> is 1 for vacuum, about 2 to 5 for plastics and glass, about 80 for water):
        </p>
        <Eq src={['E = [ E _0 | K ]', 'V = E · d = [ V _0 | K ]']} />
        <p>
          where <M>E _0</M> and <M>V _0</M> are the values for the same free charge without the dielectric. Since the same <M>Q</M> now gives a smaller voltage, the capacitance goes up by the same factor:
        </p>
        <Eq src='C = K · C _0 = [ K · ε _0 · A | d ]' />
        <figure className="t-figure">
          <Dielectric />
          <figcaption>The slab slides in with the plates disconnected, so <M>Q</M> is fixed. The molecules line up, the field weakens by <M>K = 3</M> and the voltage falls to a third. The capacitance is three times bigger.</figcaption>
        </figure>
        <p>
          If a battery stays connected, the voltage cannot change, so instead the <em>charge</em> grows by the factor <M>K</M>: the battery pushes extra charge onto the plates.
        </p>
        <figure className="t-figure">
          <Dielectric battery />
          <figcaption>With the battery connected, <M>V</M> is held, and the plates take up <M>K</M> times as much charge.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-combos">
        <SectionHead n={no('combos')} title="Capacitors in series and parallel" />
        <p>
          <strong>In parallel</strong>, both capacitors are connected across the same two points, so they have the same voltage <M>V</M>. The charges add:
        </p>
        <Eq src={['Q = Q _1 + Q _2 = C _1 · V + C _2 · V', 'C _eq = C _1 + C _2']} />
        <p>
          <strong>In series</strong>, the capacitors are connected end to end. The charge that leaves one plate of the first appears on the next plate of the second, so each capacitor carries the same <M>Q</M> (the middle section stays neutral overall). The voltages add:
        </p>
        <Eq src={['V = V _1 + V _2 = [ Q | C _1 ] + [ Q | C _2 ]', '[ 1 | C _eq ] = [ 1 | C _1 ] + [ 1 | C _2 ]']} />
        <figure className="t-figure">
          <CapCombo kind="series" />
          <figcaption>In series: both hold the same charge, and the 5 V splits between them, with the smaller capacitor taking the bigger share.</figcaption>
        </figure>
        <figure className="t-figure">
          <CapCombo kind="parallel" />
          <figcaption>In parallel: both are at the full 5 V, so the bigger capacitor holds more charge. The capacitances add.</figcaption>
        </figure>
        <Note label="Mind the flip">Capacitors are the reverse of resistors: parallel capacitors add, series capacitors combine through the reciprocals. The reason is that capacitance is charge per volt, so more plates side by side give more room for charge.</Note>
      </section>

      <section className="t-section" id="t-stored">
        <SectionHead n={no('stored')} title="Energy stored in a capacitor" />
        <p>
          Charging a capacitor means moving charge from one plate to the other against the growing voltage. When the charge on the plates is <M>q</M>, the voltage is <M>q / C</M>, and moving one more little bit <M>d q</M> costs <M>d W = ( q / C ) · d q</M>. Add up from zero to <M>Q</M>:
        </p>
        <Eq src={['U = ∫ _0 ^Q [ q | C ] · d q = [ Q ^2 | 2 · C ]', 'U = [ 1 | 2 ] · C · V ^2 = [ 1 | 2 ] · Q · V']} />
        <p>The three forms are the same thing, made from <M>Q = C · V</M>. Use whichever has the quantity you know and the one you want. The energy is the area of the triangle under the line on a graph of <M>Q</M> against <M>V</M>.</p>
        <h3 className="t-h3">Where is the energy?</h3>
        <p>
          It is in the field between the plates. For a parallel-plate capacitor the volume of the gap is <M>A · d</M>. Using <M>C = ε _0 · A / d</M> and <M>V = E · d</M>:
        </p>
        <Eq src={['U = [ 1 | 2 ] · [ ε _0 · A | d ] · E ^2 · d ^2 = [ 1 | 2 ] · ε _0 · E ^2 · A · d', 'u = [ U | A · d ] = [ 1 | 2 ] · ε _0 · E ^2']} />
        <figure className="t-figure">
          <EnergyDensity />
          <figcaption>The energy per volume depends only on the field. Wherever there is an electric field, there is stored energy, whether or not there are plates.</figcaption>
        </figure>
        <h3 className="t-h3">Sharing charge</h3>
        <p>
          Connect a charged capacitor <M>C _1</M> (at voltage <M>V _1</M>) to an uncharged one <M>C _2</M>. The total charge is conserved, and both end at the same voltage:
        </p>
        <Eq src={['V = [ C _1 · V _1 + C _2 · V _2 | C _1 + C _2 ]', 'Δ U = [ 1 | 2 ] · [ C _1 · C _2 | C _1 + C _2 ] · ( V _1 − V _2 ) ^2']} />
        <p>
          The energy afterwards is <em>less</em> than before. The difference is lost as heat and light in the wire and spark as the charge rushes across. The charge is conserved, but energy is not stored the same way.
        </p>
        <figure className="t-figure">
          <ChargeSharing />
          <figcaption>The full charge is shared out, so the voltage falls to 40 V, and the stored energy falls from 20 mJ to 8 mJ.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Potential difference', 'V _B − V _A = [ W | q ]'],
                  ['Potential of a point charge', 'V = [ 1 | 4 · π · ε _0 ] · [ Q | r ]'],
                  ['Potential of a dipole (far)', 'V = [ k · p · cos θ | r ^2 ]'],
                  ['Energy of a charge', 'U = q · V'],
                  ['Energy of two charges', 'U = k · [ q _1 · q _2 | r ]'],
                  ['Work done by the field', 'W = − q · Δ V'],
                  ['Energy of a dipole in a field', 'U = − p · E · cos θ'],
                  ['Field from the potential', 'E = − [ d V | d x ]'],
                  ['Uniform field', 'E = [ V | d ]'],
                  ['Field at a conductor surface', 'E = [ σ | ε _0 ]'],
                  ['Capacitance', 'C = [ Q | V ]'],
                  ['Parallel-plate capacitor', 'C = [ ε _0 · A | d ]'],
                  ['With a dielectric', 'C = [ K · ε _0 · A | d ]'],
                  ['Parallel', 'C _eq = C _1 + C _2'],
                  ['Series', '[ 1 | C _eq ] = [ 1 | C _1 ] + [ 1 | C _2 ]'],
                  ['Energy stored', 'U = [ 1 | 2 ] · C · V ^2 = [ Q ^2 | 2 · C ]'],
                  ['Energy density', 'u = [ 1 | 2 ] · ε _0 · E ^2'],
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
                  ['V', 'Electric potential', 'V'],
                  ['U', 'Potential energy', 'J'],
                  ['C', 'Capacitance', 'F'],
                  ['Q', 'Charge on a plate', 'C'],
                  ['d', 'Gap between plates', 'm'],
                  ['A', 'Plate area', 'm²'],
                  ['K', 'Dielectric constant', 'no unit'],
                  ['u', 'Energy per volume', 'J/m³'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{unit === 'no unit' ? unit : <M>{`"${unit}"`}</M>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Potential and the work to move a charge">
          <p className="ex-q">A point charge of <M>5 "nC"</M> is in air. Find the potential at 0.3 m and at 0.1 m, and the work needed to carry a <M>2 "nC"</M> charge from 0.3 m to 0.1 m.</p>
          <Given items={['Q = 5 × 10 ^−9 "C"', 'q = 2 × 10 ^−9 "C"']} />
          <ol className="steps">
            <Step title="Potential at each point">
              <Eq src={['V _1 = k · [ Q | r _1 ] = 9 × 10 ^9 · [ 5 × 10 ^−9 | 0.3 ] = 150 "V"', 'V _2 = 9 × 10 ^9 · [ 5 × 10 ^−9 | 0.1 ] = 450 "V"']} />
            </Step>
            <Step title="Work">
              <Eq src='W = q · ( V _2 − V _1 ) = 2 × 10 ^−9 · ( 450 − 150 ) = 6 × 10 ^−7 "J"' />
            </Step>
          </ol>
          <Answer>150 V and 450 V. It takes <M>6 × 10 ^−7 "J"</M> of work, because both charges are positive and we push the second one toward the first. The route does not matter.</Answer>
          <figure className="t-figure">
            <PotentialHill />
          </figure>
        </Example>

        <Example n={2} title="Zero potential, but not zero field">
          <p className="ex-q">Charges <M>+ 2 "nC"</M> and <M>− 2 "nC"</M> are 0.2 m apart. Find the potential and the field at the mid-point, and the potential at a point on the line 0.1 m beyond the positive charge.</p>
          <Given items={['q = ± 2 × 10 ^−9 "C"', 'd = 0.2 "m"']} />
          <ol className="steps">
            <Step title="Potential at the mid-point">
              <Eq src='V = 9 × 10 ^9 · 2 × 10 ^−9 · [ 1 | 0.1 ] − 9 × 10 ^9 · 2 × 10 ^−9 · [ 1 | 0.1 ] = 0' />
            </Step>
            <Step title="Field at the mid-point">
              <p>Both fields point from the positive toward the negative charge, so they add.</p>
              <Eq src='E = 2 · 9 × 10 ^9 · [ 2 × 10 ^−9 | 0.1 ^2 ] = 3600 "N/C"' />
            </Step>
            <Step title="Potential 0.1 m beyond the positive charge">
              <p>The distances are 0.1 m from <M>+ q</M> and 0.3 m from <M>− q</M>.</p>
              <Eq src='V = 18 · ( [ 1 | 0.1 ] − [ 1 | 0.3 ] ) = 18 · ( 10 − 3.33 ) = 120 "V"' />
            </Step>
          </ol>
          <Answer><M>V = 0</M> at the mid-point, where the field is 3600 N/C. Zero potential does not mean zero field. At the third point the potential is 120 V.</Answer>
          <figure className="t-figure">
            <Equipotentials title="Equipotential lines of a positive and a negative charge, with a probe on the zero line where the field arrow is not zero" kind="dipole" height={270} />
          </figure>
        </Example>

        <Example n={3} title="Energy of three charges">
          <p className="ex-q">Three charges of <M>1 "μC"</M> each are at the corners of an equilateral triangle of side 0.3 m. Find the energy of the arrangement.</p>
          <Given items={['q = 10 ^−6 "C"', 'a = 0.3 "m"']} />
          <ol className="steps">
            <Step title="One pair">
              <Eq src='U _pair = k · [ q ^2 | a ] = 9 × 10 ^9 · [ 10 ^−12 | 0.3 ] = 0.03 "J"' />
            </Step>
            <Step title="Three pairs, all alike">
              <Eq src='U = 3 · 0.03 = 0.09 "J"' />
            </Step>
          </ol>
          <Answer>0.09 J, positive since all the charges repel and work was needed to bring them together. Let them go and they fly apart with this much kinetic energy in total.</Answer>
          <figure className="t-figure">
            <SystemEnergy />
          </figure>
        </Example>

        <Example n={4} title="An electron accelerated by a voltage">
          <p className="ex-q">An electron starts from rest and falls through a potential difference of 200 V. Find its kinetic energy in eV and in joules, and its speed. (<M>e = 1.6 × 10 ^−19 "C"</M>, <M>m = 9.11 × 10 ^−31 "kg"</M>.)</p>
          <Given items={['V = 200 "V"']} />
          <ol className="steps">
            <Step title="Energy gained">
              <Eq src='KE = e · V = 200 "eV" = 200 · 1.6 × 10 ^−19 = 3.2 × 10 ^−17 "J"' />
            </Step>
            <Step title="Speed">
              <Eq src='v = √[ [ 2 · KE | m ] ] = √[ [ 2 · 3.2 × 10 ^−17 | 9.11 × 10 ^−31 ] ] = 8.38 × 10 ^6 "m/s"' />
            </Step>
          </ol>
          <Answer>200 eV, which is <M>3.2 × 10 ^−17 "J"</M>, giving a speed of <M>8.4 × 10 ^6 "m/s"</M>. That is about 3% of the speed of light, so ignoring relativity is fine.</Answer>
          <figure className="t-figure">
            <Equipotentials title="A charge falls steadily through equally spaced equipotential planes between two plates and its potential reading falls" kind="plates" height={230} />
          </figure>
        </Example>

        <Example n={5} title="Field from potential">
          <p className="ex-q">Two parallel plates 2 cm apart have a potential difference of 100 V. Find the field between them, the spacing of the 20 V equipotentials, and the force on an electron.</p>
          <Given items={['V = 100 "V"', 'd = 0.02 "m"']} />
          <ol className="steps">
            <Step title="Field">
              <Eq src='E = [ V | d ] = [ 100 | 0.02 ] = 5000 "V/m"' />
            </Step>
            <Step title="Spacing of 20 V steps">
              <Eq src='Δ x = [ Δ V | E ] = [ 20 | 5000 ] = 0.004 "m"' />
            </Step>
            <Step title="Force on an electron">
              <Eq src='F = e · E = 1.6 × 10 ^−19 · 5000 = 8 × 10 ^−16 "N"' />
            </Step>
          </ol>
          <Answer>5000 V/m (the same as 5000 N/C), so the 20 V planes are 4 mm apart, and the electron feels <M>8 × 10 ^−16 "N"</M> toward the positive plate.</Answer>
          <figure className="t-figure">
            <FieldFromV />
          </figure>
        </Example>

        <Example n={6} title="A dipole turned in a field">
          <p className="ex-q">A dipole of moment <M>4 × 10 ^−8 "C·m"</M> is in a uniform field of <M>3 × 10 ^4 "N/C"</M>. Find its energy at 0°, 90° and 180°, and the work to turn it from 0° to 60°.</p>
          <Given items={['p = 4 × 10 ^−8 "C·m"', 'E = 3 × 10 ^4 "N/C"']} />
          <ol className="steps">
            <Step title="The scale">
              <Eq src='p · E = 4 × 10 ^−8 · 3 × 10 ^4 = 1.2 × 10 ^−3 "J"' />
            </Step>
            <Step title="The three energies">
              <Eq src={['U ( 0° ) = − p · E = − 1.2 × 10 ^−3 "J"', 'U ( 90° ) = 0', 'U ( 180° ) = + p · E = + 1.2 × 10 ^−3 "J"']} />
            </Step>
            <Step title="Work from 0° to 60°">
              <Eq src='W = U ( 60° ) − U ( 0° ) = p · E · ( 1 − cos 60° ) = 1.2 × 10 ^−3 · 0.5 = 6 × 10 ^−4 "J"' />
            </Step>
          </ol>
          <Answer>−1.2 mJ, 0 and +1.2 mJ. Turning from 0° to 60° takes 0.6 mJ, and all the way round to 180° takes 2.4 mJ.</Answer>
          <figure className="t-figure">
            <DipoleEnergy />
          </figure>
        </Example>

        <Example n={7} title="A parallel-plate capacitor">
          <p className="ex-q">A capacitor has plates of area 0.02 m² (200 cm²) a gap of 1 mm apart, connected to 100 V. Find <M>C</M>, <M>Q</M>, the field, and the stored energy.</p>
          <Given items={['A = 0.02 "m²"', 'd = 10 ^−3 "m"', 'V = 100 "V"']} />
          <ol className="steps">
            <Step title="Capacitance">
              <Eq src='C = [ ε _0 · A | d ] = [ 8.85 × 10 ^−12 · 0.02 | 10 ^−3 ] = 1.77 × 10 ^−10 "F"' />
            </Step>
            <Step title="Charge and field">
              <Eq src={['Q = C · V = 1.77 × 10 ^−10 · 100 = 1.77 × 10 ^−8 "C"', 'E = [ V | d ] = [ 100 | 10 ^−3 ] = 10 ^5 "V/m"']} />
            </Step>
            <Step title="Energy">
              <Eq src='U = [ 1 | 2 ] · C · V ^2 = [ 1 | 2 ] · 1.77 × 10 ^−10 · 100 ^2 = 8.85 × 10 ^−7 "J"' />
            </Step>
          </ol>
          <Answer>177 pF, holding 17.7 nC with a field of <M>10 ^5 "V/m"</M>, and storing 0.885 μJ.</Answer>
          <figure className="t-figure">
            <ChargingCap />
          </figure>
        </Example>

        <Example n={8} title="Putting in a dielectric">
          <p className="ex-q">The capacitor of Example 7 is filled with a dielectric of <M>K = 5</M>. Find the energy and the voltage (a) with the battery kept connected, (b) after the battery was removed.</p>
          <Given items={['C _0 = 1.77 × 10 ^−10 "F"', 'V _0 = 100 "V"', 'K = 5']} />
          <ol className="steps">
            <Step title="New capacitance">
              <Eq src='C = K · C _0 = 5 · 1.77 × 10 ^−10 = 8.85 × 10 ^−10 "F"' />
            </Step>
            <Step title="(a) Battery connected: V stays 100 V">
              <Eq src={['Q = C · V = 8.85 × 10 ^−10 · 100 = 8.85 × 10 ^−8 "C"', 'U = [ 1 | 2 ] · C · V ^2 = 4.43 × 10 ^−6 "J"']} />
            </Step>
            <Step title="(b) Isolated: Q stays 1.77 × 10⁻⁸ C">
              <Eq src={['V = [ V _0 | K ] = [ 100 | 5 ] = 20 "V"', 'U = [ Q ^2 | 2 · C ] = [ ( 1.77 × 10 ^−8 ) ^2 | 2 · 8.85 × 10 ^−10 ] = 1.77 × 10 ^−7 "J"']} />
            </Step>
          </ol>
          <Answer>(a) The voltage stays 100 V, the charge rises five times to 88.5 nC, and the energy rises five times to 4.43 μJ (the battery supplies it). (b) The voltage falls to 20 V and the energy falls to a fifth, 0.177 μJ: the slab is pulled in, so the field does positive work on it.</Answer>
          <figure className="t-figure">
            <Dielectric />
          </figure>
        </Example>

        <Example n={9} title="Two capacitors in series and in parallel">
          <p className="ex-q">Capacitors of <M>2 "μF"</M> and <M>3 "μF"</M> are connected to 120 V, first in series and then in parallel. Find the equivalent capacitance, the charge on each, and the voltage across each.</p>
          <Given items={['C _1 = 2 "μF"', 'C _2 = 3 "μF"', 'V = 120 "V"']} />
          <ol className="steps">
            <Step title="Series">
              <Eq src={['[ 1 | C _eq ] = [ 1 | 2 ] + [ 1 | 3 ] = [ 5 | 6 ]', 'C _eq = 1.2 "μF"', 'Q = C _eq · V = 1.2 · 120 = 144 "μC" "on each"']} />
              <Eq src={['V _1 = [ Q | C _1 ] = [ 144 | 2 ] = 72 "V"', 'V _2 = [ 144 | 3 ] = 48 "V"']} />
            </Step>
            <Step title="Parallel">
              <Eq src={['C _eq = 2 + 3 = 5 "μF"', 'Q _1 = 2 · 120 = 240 "μC"', 'Q _2 = 3 · 120 = 360 "μC"']} />
            </Step>
          </ol>
          <Answer>In series: 1.2 μF, 144 μC on each, with 72 V across the 2 μF and 48 V across the 3 μF (they add to 120 V). In parallel: 5 μF, with 240 μC and 360 μC, and 120 V across each.</Answer>
          <figure className="t-figure">
            <CapCombo kind="series" />
          </figure>
        </Example>

        <Example n={10} title="Sharing charge">
          <p className="ex-q">A <M>4 "μF"</M> capacitor charged to 100 V is connected to an uncharged <M>6 "μF"</M> capacitor. Find the common voltage and the energy lost.</p>
          <Given items={['C _1 = 4 "μF"', 'V _1 = 100 "V"', 'C _2 = 6 "μF"', 'V _2 = 0']} />
          <ol className="steps">
            <Step title="Charge is conserved">
              <Eq src={['Q = C _1 · V _1 = 4 · 100 = 400 "μC"', 'V = [ Q | C _1 + C _2 ] = [ 400 | 10 ] = 40 "V"']} />
            </Step>
            <Step title="Energy before and after">
              <Eq src={['U _i = [ 1 | 2 ] · 4 × 10 ^−6 · 100 ^2 = 0.020 "J"', 'U _f = [ 1 | 2 ] · 10 × 10 ^−6 · 40 ^2 = 0.008 "J"']} />
            </Step>
            <Step title="The loss">
              <Eq src='Δ U = 0.020 − 0.008 = 0.012 "J"' />
            </Step>
          </ol>
          <Answer>Both are at 40 V. The energy falls from 20 mJ to 8 mJ, so 12 mJ (60%) is lost as heat and light. The formula <M>[ 1 | 2 ] · [ C _1 · C _2 | C _1 + C _2 ] · V _1 ^2</M> gives the same 12 mJ.</Answer>
          <figure className="t-figure">
            <ChargeSharing />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Zero potential means zero field" wrong="V = 0 ⇒ E = 0" fig={<Equipotentials title="On the zero potential line of a dipole the field arrow is clearly not zero" kind="dipole" height={230} />}>
            The field depends on how fast the potential <em>changes</em>, not on its value. On the middle line of a dipole <M>V = 0</M>, yet the potential falls steeply across it and the field is strong.
          </Mistake>
          <Mistake title="The field points toward higher potential" wrong={'E "points to higher" V'} fig={<FieldFromV height={230} />}>
            <M>E = − d V / d x</M>. The minus sign means the field points down the slope, toward <em>lower</em> potential, just as a ball rolls downhill.
          </Mistake>
          <Mistake title="Inside a conductor the field is the outside field" wrong={'E _inside = E _outside'} fig={<ConductorShield />}>
            Free charges move until the field inside is exactly zero. Outside, the field is still there, and it is perpendicular to the surface.
          </Mistake>
          <Mistake title="Series capacitors add directly" wrong="C _eq = C _1 + C _2  (series)" fig={<CapCombo kind="series" height={230} />}>
            Capacitances add in <em>parallel</em>. In series the voltage is shared, and <M>[ 1 | C _eq ] = [ 1 | C _1 ] + [ 1 | C _2 ]</M>, so the combination is always smaller than the smallest one.
          </Mistake>
          <Mistake title="Charge sharing conserves energy" wrong="U _final = U _initial" fig={<ChargeSharing />}>
            Charge is conserved but energy is not: some goes into the spark and the heating of the wire. The energy that remains is always lower.
          </Mistake>
          <Mistake title="A dielectric always lowers the voltage" wrong={'V "falls whatever is connected"'} fig={<Dielectric battery height={230} />}>
            Only if the charge is fixed (an isolated capacitor). With a battery connected, the voltage is held and the <em>charge</em> grows by the factor <M>K</M>.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Potential is energy per charge, and a capacitor is a place to keep it.</p>
        <p className="closing-sub">Next: current electricity. Put a potential difference across a wire and the charges start to flow.</p>
      </footer>
    </ChapterShell>
  );
}
