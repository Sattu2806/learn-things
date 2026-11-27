import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Ampere, BiotSavart, CircleOrbits, Cyclotron, ForceAngle, Galvanometer, Helix, LoopField, LoopTorque, Lorentz, Meters, Oersted, ParallelWires, RightHand, RodForce, Selector, Solenoid, Toroid, WireField } from './MagAnims';

/** Moving charges and magnetism: the Lorentz force, circular paths, fields of currents and forces on them. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'Currents make magnetic fields', group: 'Theory' },
  { id: 'lorentz', title: 'The force on a moving charge', group: 'Theory' },
  { id: 'circle', title: 'Circles and spirals in a field', group: 'Theory' },
  { id: 'crossed', title: 'Crossed fields', group: 'Theory' },
  { id: 'cyclotron', title: 'The cyclotron', group: 'Theory' },
  { id: 'wire', title: 'The force on a current-carrying wire', group: 'Theory' },
  { id: 'biot', title: 'The Biot–Savart law', group: 'Theory' },
  { id: 'ampere', title: "Ampère's circuital law", group: 'Theory' },
  { id: 'solenoid', title: 'Solenoid and toroid', group: 'Theory' },
  { id: 'parallel', title: 'Force between parallel wires', group: 'Theory' },
  { id: 'torque', title: 'Torque on a current loop', group: 'Theory' },
  { id: 'galvo', title: 'The moving-coil galvanometer', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="magnetism" film={buildFilm} sections={SECTIONS} sideTitle="Moving charges and magnetism" sideLead="Why a moving charge feels a sideways push, how currents make magnetic fields, and how those two ideas build motors, meters and particle accelerators.">
      <header className="article-head">
        <span className="kicker">Physics · Moving charges and magnetism</span>
        <h1 className="article-title">Why does a moving charge swerve sideways?</h1>
        <p className="article-lead">A charge at rest feels only an electric force. Set it moving and a second, stranger force appears, always sideways to its motion. This chapter follows that one force from a single electron to the motor in a fan, and then asks the reverse question: what field does a current make?</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="Currents make magnetic fields" />
        <p>
          In 1820 Hans Christian Oersted noticed that a compass needle near a wire twitched when the current was switched on. The needle is a tiny magnet, so the current had made a <strong>magnetic field</strong> around the wire. Reverse the current and the needle swings the other way. Switch it off and the needle goes back to pointing north.
        </p>
        <figure className="t-figure">
          <Oersted />
          <figcaption>With no current the needles all point the same way. With a current they curl round the wire in rings, and a reversed current curls them the other way.</figcaption>
        </figure>
        <p>
          So a magnetic field is made by <strong>moving charges</strong>, and it acts on <strong>moving charges</strong>. A charge standing still makes no magnetic field and feels no magnetic force. We call the field <M>B</M>, and its SI unit is the <strong>tesla</strong> (T). A fridge magnet is about 5 mT, the Earth's field about 50 μT, and a hospital MRI machine about 3 T.
        </p>
        <Note label="Two jobs">This chapter does two jobs. First, given a field, what force does it put on moving charges and on wires? Second, given currents, what field do they make? Each job has its own law.</Note>
      </section>

      <section className="t-section" id="t-lorentz">
        <SectionHead n={no('lorentz')} title="The force on a moving charge" />
        <p>
          Fire a charge <M>q</M> with velocity <M>v</M> through a magnetic field <M>B</M>. Experiments show three things. The force is proportional to the charge, to the speed, and to the strength of the field. It also depends on the angle <M>θ</M> between the velocity and the field. Putting these together:
        </p>
        <Eq src='F = q · v · B · sin θ' />
        <figure className="t-figure">
          <ForceAngle />
          <figcaption>Only the part of the velocity <em>across</em> the field, <M>v · sin θ</M>, matters. Along the field the force is zero. Plotted against the angle, the force traces a sine curve.</figcaption>
        </figure>
        <p>
          The direction is the strange part. The force is at right angles to <em>both</em> the velocity and the field. In vector form this is a cross product:
        </p>
        <Eq src='F = q · ( v × B )' />
        <p>
          To find the direction for a positive charge, point the fingers of your right hand along <M>v</M>, curl them toward <M>B</M>, and your thumb points along <M>F</M>. For a negative charge the force is reversed. So a positive and a negative charge fired in together curve away from each other.
        </p>
        <figure className="t-figure">
          <RightHand />
          <figcaption>The three arrows are at right angles to one another. Here the charge moves right, the field points into the page, so the force points up.</figcaption>
        </figure>
        <figure className="t-figure">
          <Lorentz />
          <figcaption>The force is always sideways to the motion, so the paths bend into circles. The two charges bend opposite ways.</figcaption>
        </figure>
        <p>
          If an electric field <M>E</M> is also present, the total force is the <strong>Lorentz force</strong>:
        </p>
        <Eq src='F = q · E + q · ( v × B )' />
        <h3 className="t-h3">The magnetic force does no work</h3>
        <p>
          Because <M>F</M> is always at right angles to <M>v</M>, it never pushes the charge forward or backward. It has no component along the motion, so its work is zero. A magnetic field can <em>turn</em> a moving charge but can never speed it up or slow it down.
        </p>
        <Eq src={['W = F · d · cos 90° = 0', 'KE = [ 1 | 2 ] · m · v ^2 "stays constant"']} />
        <p>
          The 1 tesla is defined by this law: it is the field that puts a force of 1 N on a charge of 1 C moving at 1 m/s at right angles to it, so <M>1 "T" = 1 "N" / ( "C" · "m/s" ) = 1 "N/(A·m)"</M>.
        </p>
      </section>

      <section className="t-section" id="t-circle">
        <SectionHead n={no('circle')} title="Circles and spirals in a field" />
        <p>
          Shoot a charge into a uniform field at right angles to it. The force has constant size <M>q · v · B</M> and always points at right angles to the velocity. That is exactly what <em>centripetal</em> force does in circular motion. So the charge goes round a circle, and the magnetic force provides the centripetal force:
        </p>
        <Eq src={['q · v · B = [ m · v ^2 | r ]', 'r = [ m · v | q · B ]']} />
        <p>
          A faster particle makes a bigger circle, a heavier one too, and a stronger field squeezes the circle smaller. Now the time for one lap. The distance round is <M>2 · π · r</M> and the speed is <M>v</M>:
        </p>
        <Eq src={['T = [ 2 · π · r | v ] = [ 2 · π | v ] · [ m · v | q · B ]', 'T = [ 2 · π · m | q · B ]', 'ω = [ q · B | m ]']} />
        <p>
          Look at what is missing: the speed. The speed cancels, so every charge of the same kind goes round in the same time, whatever its energy. Fast ones take a bigger circle but travel faster along it, and the two effects cancel exactly.
        </p>
        <figure className="t-figure">
          <CircleOrbits />
          <figcaption>Three speeds, three circles, one period. All three dots cross the starting line together.</figcaption>
        </figure>
        <h3 className="t-h3">When the velocity is at an angle</h3>
        <p>
          Split the velocity into a part <M>v _∥</M> along the field and a part <M>v _⊥</M> across it. The field does nothing to the first part, so the charge keeps drifting along the field at steady speed. The second part goes round a circle. Together they make a <strong>helix</strong>.
        </p>
        <Eq src={['r = [ m · v _⊥ | q · B ]', 'p = v _∥ · T = [ 2 · π · m · v _∥ | q · B ]']} />
        <p>The distance moved along the field in one turn is the <strong>pitch</strong> <M>p</M>. This is how charged particles from the Sun spiral along the Earth's field lines toward the poles and make the aurora.</p>
        <figure className="t-figure">
          <Helix />
          <figcaption>The field runs left to right. The charge spirals along it: steady drift along, circles across.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-crossed">
        <SectionHead n={no('crossed')} title="Crossed fields" />
        <p>
          Put an electric field and a magnetic field at right angles to each other, so that the electric force and the magnetic force on a charge point in opposite directions. A charge goes straight only if the two forces cancel:
        </p>
        <Eq src={['q · E = q · v · B', 'v = [ E | B ]']} />
        <p>
          The charge cancels, the mass cancels, and the answer depends only on the speed. A charge going slower than <M>E / B</M> is pushed by the electric force, a faster one by the magnetic force. Only the right speed gets through. This is a <strong>velocity selector</strong>, used to pick out a beam of one speed. J. J. Thomson used crossed fields in 1897 to measure the ratio <M>e / m</M> of the electron.
        </p>
        <figure className="t-figure">
          <Selector />
          <figcaption>Three speeds enter. The slow one bends one way, the fast one the other, and only the matched speed runs straight through.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-cyclotron">
        <SectionHead n={no('cyclotron')} title="The cyclotron" />
        <p>
          How do you give a proton a huge energy? A cyclotron does it with many small kicks. Two hollow metal D-shaped boxes sit in a magnetic field with a small gap between them. An alternating voltage is applied across the gap.
        </p>
        <p>
          Inside a D there is no electric field, so the proton just goes round a half circle. It reaches the gap, the voltage has flipped to push it forward, and it gains a little energy. Faster means a bigger circle, so it spirals out. And because the lap time does not depend on speed, the <em>same</em> alternating frequency works for every turn:
        </p>
        <Eq src='f = [ q · B | 2 · π · m ]' />
        <figure className="t-figure">
          <Cyclotron />
          <figcaption>Each pass through the gap is a kick. The gap field flips just as the charge arrives, so the circles grow turn after turn.</figcaption>
        </figure>
        <p>
          The beam leaves at the rim, where the radius is <M>R</M>. Its speed there comes from <M>R = m · v / ( q · B )</M>, so <M>v = q · B · R / m</M>, and the kinetic energy is
        </p>
        <Eq src='KE = [ 1 | 2 ] · m · v ^2 = [ q ^2 · B ^2 · R ^2 | 2 · m ]' />
        <p>
          The energy depends on the size of the magnet and on its field, not on the voltage across the gap. The voltage only decides how many turns it takes. (At very high speed, relativity makes the lap time grow, and the simple cyclotron stops working.)
        </p>
      </section>

      <section className="t-section" id="t-wire">
        <SectionHead n={no('wire')} title="The force on a current-carrying wire" />
        <p>
          A current is many charges moving together. Take a piece of wire of length <M>L</M> and cross-section <M>A</M>, with <M>n</M> free charges <M>q</M> per unit volume drifting at speed <M>v _d</M>. The number of charges in the piece is <M>n · A · L</M>, and each feels a force <M>q · v _d · B · sin θ</M>. Add them up:
        </p>
        <Eq src={['F = ( n · A · L ) · q · v _d · B · sin θ', 'F = ( n · q · v _d · A ) · L · B · sin θ', 'F = I · L · B · sin θ']} />
        <p>
          In the last step we used the current <M>I = n · q · v _d · A</M>. In vector form, <M>F = I · ( L × B )</M>, where the vector <M>L</M> points along the current. The direction follows the same right-hand rule as before, with the current standing in for the velocity.
        </p>
        <figure className="t-figure">
          <RodForce />
          <figcaption>A rod across two rails, current up, field into the page: pushed left. Reverse the current and it is pushed right. This is the heart of every electric motor.</figcaption>
        </figure>
        <p>
          For a wire of any shape, cut it into tiny pieces <M>d L</M>, find <M>I · d L × B</M> for each, and add. A curved wire in a uniform field has the same force as the straight line joining its ends. A closed loop in a uniform field has zero net force.
        </p>
      </section>

      <section className="t-section" id="t-biot">
        <SectionHead n={no('biot')} title="The Biot–Savart law" />
        <p>
          Now the second job: given a current, find the field. Chop the wire into tiny pieces. Each piece of length <M>d L</M> carrying current <M>I</M> adds a tiny field <M>d B</M> at a point a distance <M>r</M> away. Biot and Savart found that
        </p>
        <Eq src='d B = [ μ _0 | 4 · π ] · [ I · d L · sin θ | r ^2 ]' />
        <p>
          Here <M>θ</M> is the angle between the piece and the line from it to the point, and <M>μ _0 = 4 · π × 10 ^−7 "T·m/A"</M> is the <strong>permeability of free space</strong>. The field goes as one over distance squared, just like the electric field of a point charge. Its direction is right-hand again: curl the fingers of your right hand along the current, and at the point, <M>d B</M> points along <M>d L × r</M>, at right angles to both.
        </p>
        <figure className="t-figure">
          <BiotSavart />
          <figcaption>As the piece slides along, its contribution at P peaks when it is directly opposite and fades far away. The total field is the sum of all of these.</figcaption>
        </figure>
        <h3 className="t-h3">A long straight wire</h3>
        <p>
          Add up the pieces of an infinitely long straight wire at distance <M>d</M> (the sum is an integral, and the result is simple):
        </p>
        <Eq src='B = [ μ _0 · I | 2 · π · d ]' />
        <p>
          The field lines are circles around the wire, in the direction your right-hand fingers curl when the thumb points along the current. The field falls off as <M>1 / d</M>.
        </p>
        <figure className="t-figure">
          <WireField />
          <figcaption>Twice as far, half the field. The rings are close together near the wire, where the field is strongest.</figcaption>
        </figure>
        <h3 className="t-h3">The centre of a circular loop</h3>
        <p>
          At the centre of a loop of radius <M>R</M>, every piece is at the same distance <M>R</M>, with <M>θ = 90°</M>, and all of them make a field pointing the same way. So we just add the lengths, which give <M>2 · π · R</M>:
        </p>
        <Eq src={['B = [ μ _0 | 4 · π ] · [ I · ( 2 · π · R ) | R ^2 ]', 'B = [ μ _0 · I | 2 · R ]']} />
        <p>For a coil of <M>N</M> turns, multiply by <M>N</M>. Away from the centre, along the axis of the loop at distance <M>x</M>:</p>
        <Eq src='B = [ μ _0 · I · R ^2 | 2 · ( R ^2 + x ^2 ) ^3/2 ]' />
        <figure className="t-figure">
          <LoopField />
          <figcaption>The field on the axis is greatest at the centre and falls away on both sides. Far away it drops as <M>1 / x ^3</M>.</figcaption>
        </figure>
        <p>The direction on the axis is found by the right-hand rule for loops: curl your fingers the way the current goes round and the thumb points along the field.</p>
      </section>

      <section className="t-section" id="t-ampere">
        <SectionHead n={no('ampere')} title="Ampère's circuital law" />
        <p>
          Biot–Savart always works, but it needs an integral. When the situation is very symmetric there is a faster route. Choose a closed path, add up <M>B</M> along the direction of the path for every short piece of it, and you get a number set only by the current that passes through the path:
        </p>
        <Eq src='∮ B · d L = μ _0 · I _enc' />
        <p>
          The circle on the integral sign means "once round a closed path". <M>I _enc</M> is the current <em>enclosed</em> by the path: only currents that pass through the area inside count, and a wire outside the loop adds nothing to the right side (though its field still acts).
        </p>
        <figure className="t-figure">
          <Ampere />
          <figcaption>One wire inside gives <M>μ _0 · I</M>, two give <M>μ _0 · ( I _1 + I _2 )</M>, and a wire outside gives zero.</figcaption>
        </figure>
        <p>
          Check it on the straight wire. Take a circle of radius <M>d</M> around the wire. By symmetry <M>B</M> is the same all the way round and runs along the circle, so the sum is just <M>B</M> times the circumference:
        </p>
        <Eq src={['B · ( 2 · π · d ) = μ _0 · I', 'B = [ μ _0 · I | 2 · π · d ]']} />
        <p>The same answer as Biot–Savart, with no integral to do. Ampère's law is the magnetic partner of Gauss's law for electric fields.</p>
      </section>

      <section className="t-section" id="t-solenoid">
        <SectionHead n={no('solenoid')} title="Solenoid and toroid" />
        <p>
          A <strong>solenoid</strong> is a long coil of wire wound closely in a helix. Each turn makes a field, and inside the coil all the turns add up to a strong, almost uniform field along the axis. Outside, the fields of the top and bottom wires cancel, and the field is nearly zero.
        </p>
        <figure className="t-figure">
          <Solenoid />
          <figcaption>Inside: straight, strong, uniform. Outside: almost nothing. The dashed rectangle is the Ampère path used below.</figcaption>
        </figure>
        <p>
          To find the field, use a rectangular Ampère path with one side of length <M>L</M> inside the solenoid and the other three sides outside, or at right angles to <M>B</M>. Only the inside side contributes. If the solenoid has <M>n</M> turns per metre, then the path encloses <M>n · L</M> turns:
        </p>
        <Eq src={['B · L = μ _0 · ( n · L ) · I', 'B = μ _0 · n · I']} />
        <p>
          The field does not depend on the length of the solenoid, its width, or where you are inside. It depends only on the turns per metre and the current. With an iron core inside, <M>μ _0</M> is replaced by a much larger value, which is what an electromagnet does (the next chapter explains why).
        </p>
        <h3 className="t-h3">The toroid</h3>
        <p>
          Bend the solenoid into a ring and you get a <strong>toroid</strong>. The field now runs round inside the ring. Take a circular Ampère path of radius <M>r</M> inside the ring. It encloses <M>N</M> wires going the same way, where <M>N</M> is the total number of turns:
        </p>
        <Eq src={['B · ( 2 · π · r ) = μ _0 · N · I', 'B = [ μ _0 · N · I | 2 · π · r ]']} />
        <p>A path in the hole of the ring, or outside the ring, encloses no net current (the wires going one way are cancelled by those coming back), so the field is zero there.</p>
        <figure className="t-figure">
          <Toroid />
          <figcaption>The field is trapped inside the ring: none in the hole, none outside.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-parallel">
        <SectionHead n={no('parallel')} title="Force between parallel wires" />
        <p>
          Wire 1 carries <M>I _1</M>. At the position of wire 2, a distance <M>d</M> away, it makes a field <M>B _1 = μ _0 · I _1 / ( 2 · π · d )</M>, at right angles to wire 2. Wire 2 carries current <M>I _2</M> in this field, so a length <M>L</M> of it feels a force <M>I _2 · L · B _1</M>:
        </p>
        <Eq src={['F = I _2 · L · B _1 = I _2 · L · [ μ _0 · I _1 | 2 · π · d ]', '[ F | L ] = [ μ _0 · I _1 · I _2 | 2 · π · d ]']} />
        <p>
          By symmetry, wire 1 feels an equal and opposite force from wire 2. The right-hand rule shows that <strong>currents in the same direction attract</strong> and <strong>currents in opposite directions repel</strong>. (Notice this is the reverse of the electric case, where like charges repel.)
        </p>
        <figure className="t-figure">
          <ParallelWires />
          <figcaption>Same direction: the wires move together. Opposite directions: they move apart.</figcaption>
        </figure>
        <Note label="The ampere">This force gives the SI definition of the ampere. If two long parallel wires 1 m apart carry the same steady current, and the force between them is <M>2 × 10 ^−7</M> N for each metre of length, then the current is 1 A. Plug in <M>I _1 = I _2 = 1 "A"</M> and <M>d = 1 "m"</M> to see it.</Note>
      </section>

      <section className="t-section" id="t-torque">
        <SectionHead n={no('torque')} title="Torque on a current loop" />
        <p>
          Put a rectangular loop of wire, with sides <M>a</M> and <M>b</M>, in a uniform field <M>B</M>, and let the loop turn about a line through its middle. The forces on the two sides parallel to the axis are equal and opposite (by <M>F = I · L × B</M>) but not along the same line: they form a <strong>couple</strong>. The forces on the other two sides lie along the axis and cancel.
        </p>
        <p>
          Let the normal to the loop (at right angles to its face, found by the right-hand rule on the current) make an angle <M>θ</M> with the field. Each long side has length <M>b</M> and feels <M>F = I · b · B</M>. The arm of the couple is <M>a · sin θ</M>:
        </p>
        <Eq src={['τ = F · ( a · sin θ ) = I · b · B · a · sin θ', 'τ = I · A · B · sin θ']} />
        <p>
          where <M>A = a · b</M> is the area. For a coil of <M>N</M> turns the torque is <M>N</M> times bigger. The product <M>N · I · A</M> is the <strong>magnetic moment</strong> <M>m</M> of the coil, a vector along the normal:
        </p>
        <Eq src={['m = N · I · A', 'τ = m × B', 'τ = m · B · sin θ']} />
        <figure className="t-figure">
          <LoopTorque />
          <figcaption>The two forces make a couple that turns the normal toward the field. When the face is square to the field, the torque is zero.</figcaption>
        </figure>
        <p>
          The torque is largest, <M>N · I · A · B</M>, when the plane of the coil is parallel to the field (<M>θ = 90°</M>) and zero when the plane is square to it (<M>θ = 0</M>). The result holds for a loop of any shape, not only a rectangle. A current loop behaves just like a tiny bar magnet, and the next chapter makes much of this.
        </p>
      </section>

      <section className="t-section" id="t-galvo">
        <SectionHead n={no('galvo')} title="The moving-coil galvanometer" />
        <p>
          A <strong>galvanometer</strong> measures current by using the torque on a coil. A coil of <M>N</M> turns hangs between curved magnet poles, with a soft iron core in the middle. The poles and core make the field <em>radial</em>, always in the plane of the coil, so the torque stays <M>N · I · A · B</M> at every angle of turn. A spring resists the turning with a torque <M>k · φ</M> proportional to the twist <M>φ</M>.
        </p>
        <p>The pointer stops when the two torques balance:</p>
        <Eq src={['N · I · A · B = k · φ', 'φ = [ N · A · B | k ] · I']} />
        <p>
          The deflection is proportional to the current, so the scale is evenly spaced. The <strong>current sensitivity</strong> is the deflection per unit current, <M>φ / I = N · A · B / k</M>. A bigger coil, more turns, a stronger magnet or a weaker spring all give a more sensitive meter.
        </p>
        <figure className="t-figure">
          <Galvanometer />
          <figcaption>The pointer settles where the magnetic torque on the coil equals the spring torque: the two bars match.</figcaption>
        </figure>
        <h3 className="t-h3">Turning it into an ammeter or voltmeter</h3>
        <p>
          A galvanometer is delicate: it takes only a tiny current <M>I _g</M> for full scale, and has a resistance <M>G</M>. To measure a big current, put a small <strong>shunt</strong> resistance <M>S</M> in parallel. To measure a voltage, put a large resistance <M>R</M> in series.
        </p>
        <Eq src={['"ammeter (up to I)" :  I _g · G = ( I − I _g ) · S', 'S = [ I _g · G | I − I _g ]', '"voltmeter (up to V)" :  V = I _g · ( G + R )', 'R = [ V | I _g ] − G']} />
        <figure className="t-figure">
          <Meters />
          <figcaption>Ammeter: the shunt takes almost all the current. Voltmeter: the big resistor takes almost all the voltage. The galvanometer itself is not overloaded in either.</figcaption>
        </figure>
        <p>An ideal ammeter has very low resistance, so it does not disturb the circuit it is placed in series with. An ideal voltmeter has a very high resistance so that it takes almost no current when placed across a component.</p>
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
                  ['Force on a moving charge', 'F = q · v · B · sin θ'],
                  ['Lorentz force', 'F = q · E + q · ( v × B )'],
                  ['Radius of the circle', 'r = [ m · v | q · B ]'],
                  ['Period and frequency', 'T = [ 2 · π · m | q · B ] ,  f = [ q · B | 2 · π · m ]'],
                  ['Pitch of the helix', 'p = [ 2 · π · m · v _∥ | q · B ]'],
                  ['Velocity selector', 'v = [ E | B ]'],
                  ['Cyclotron energy', 'KE = [ q ^2 · B ^2 · R ^2 | 2 · m ]'],
                  ['Force on a wire', 'F = I · L · B · sin θ'],
                  ['Biot–Savart law', 'd B = [ μ _0 | 4 · π ] · [ I · d L · sin θ | r ^2 ]'],
                  ['Long straight wire', 'B = [ μ _0 · I | 2 · π · d ]'],
                  ['Centre of a loop (N turns)', 'B = [ μ _0 · N · I | 2 · R ]'],
                  ['On the axis of a loop', 'B = [ μ _0 · I · R ^2 | 2 · ( R ^2 + x ^2 ) ^3/2 ]'],
                  ["Ampère's law", '∮ B · d L = μ _0 · I _enc'],
                  ['Solenoid', 'B = μ _0 · n · I'],
                  ['Toroid', 'B = [ μ _0 · N · I | 2 · π · r ]'],
                  ['Parallel wires', '[ F | L ] = [ μ _0 · I _1 · I _2 | 2 · π · d ]'],
                  ['Magnetic moment', 'm = N · I · A'],
                  ['Torque on a coil', 'τ = N · I · A · B · sin θ'],
                  ['Galvanometer', 'N · I · A · B = k · φ'],
                  ['Shunt', 'S = [ I _g · G | I − I _g ]'],
                  ['Series resistor', 'R = [ V | I _g ] − G'],
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
        <Eq src={['μ _0 = 4 · π × 10 ^−7 "T·m/A"', 'e = 1.6 × 10 ^−19 "C"', 'm _e = 9.1 × 10 ^−31 "kg"', 'm _p = 1.67 × 10 ^−27 "kg"']} />
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="A proton in a field">
          <p className="ex-q">A proton moves at 5 × 10⁶ m/s at right angles to a uniform field of 0.5 T. Find the force on it, the radius of its path and the time for one lap.</p>
          <Given items={['q = 1.6 × 10 ^−19 "C"', 'm = 1.67 × 10 ^−27 "kg"', 'v = 5 × 10 ^6 "m/s"', 'B = 0.5 "T"']} />
          <ol className="steps">
            <Step title="The force">
              <Eq src='F = q · v · B = 1.6 × 10 ^−19 · 5 × 10 ^6 · 0.5 = 4.0 × 10 ^−13 "N"' />
            </Step>
            <Step title="The radius">
              <Eq src='r = [ m · v | q · B ] = [ 1.67 × 10 ^−27 · 5 × 10 ^6 | 1.6 × 10 ^−19 · 0.5 ] = 0.104 "m"' />
            </Step>
            <Step title="The period">
              <Eq src='T = [ 2 · π · m | q · B ] = [ 2 · π · 1.67 × 10 ^−27 | 1.6 × 10 ^−19 · 0.5 ] = 1.31 × 10 ^−7 "s"' />
            </Step>
          </ol>
          <Answer>4.0 × 10⁻¹³ N, a circle of radius 10.4 cm, taking 0.131 μs per lap. The force looks tiny, but a proton is so light that it makes an acceleration of about 2.4 × 10¹⁴ m/s².</Answer>
          <figure className="t-figure">
            <CircleOrbits />
            <figcaption>Double the speed and the circle doubles in radius, but the lap time stays 0.131 μs.</figcaption>
          </figure>
        </Example>

        <Example n={2} title="An electron from a gun">
          <p className="ex-q">An electron is accelerated from rest through 2000 V and then enters a field of 0.01 T at right angles. Find its speed and the radius of its circle.</p>
          <Given items={['V = 2000 "V"', 'B = 0.01 "T"', 'e = 1.6 × 10 ^−19 "C"', 'm = 9.1 × 10 ^−31 "kg"']} />
          <ol className="steps">
            <Step title="Energy gained from the voltage">
              <Eq src={['e · V = [ 1 | 2 ] · m · v ^2', 'v = √[ [ 2 · e · V | m ] ] = √[ [ 2 · 1.6 × 10 ^−19 · 2000 | 9.1 × 10 ^−31 ] ] = 2.65 × 10 ^7 "m/s"']} />
            </Step>
            <Step title="The radius in the field">
              <Eq src='r = [ m · v | e · B ] = [ 9.1 × 10 ^−31 · 2.65 × 10 ^7 | 1.6 × 10 ^−19 · 0.01 ] = 0.0151 "m"' />
            </Step>
          </ol>
          <Answer>2.65 × 10⁷ m/s (about 9% of the speed of light) and a circle of radius 1.51 cm.</Answer>
          <figure className="t-figure">
            <Lorentz />
          </figure>
        </Example>

        <Example n={3} title="A velocity selector">
          <p className="ex-q">A selector has an electric field of 2 × 10⁴ V/m and a magnetic field of 0.1 T, at right angles. What speed passes straight through? What happens to a faster ion?</p>
          <Given items={['E = 2 × 10 ^4 "V/m"', 'B = 0.1 "T"']} />
          <ol className="steps">
            <Step title="Balance the forces">
              <Eq src='v = [ E | B ] = [ 2 × 10 ^4 | 0.1 ] = 2 × 10 ^5 "m/s"' />
            </Step>
          </ol>
          <Answer>2 × 10⁵ m/s goes straight, whatever its charge and mass. A faster ion has a bigger magnetic force <M>q · v · B</M> than electric force <M>q · E</M> and curves toward the side that the magnetic force points.</Answer>
          <figure className="t-figure">
            <Selector />
          </figure>
        </Example>

        <Example n={4} title="A cyclotron">
          <p className="ex-q">A cyclotron has a field of 1.5 T and a dee radius of 0.5 m, and accelerates protons. Find the frequency of the alternating voltage and the final kinetic energy in joules and in MeV.</p>
          <Given items={['B = 1.5 "T"', 'R = 0.5 "m"', 'q = 1.6 × 10 ^−19 "C"', 'm = 1.67 × 10 ^−27 "kg"']} />
          <ol className="steps">
            <Step title="Frequency">
              <Eq src='f = [ q · B | 2 · π · m ] = [ 1.6 × 10 ^−19 · 1.5 | 2 · π · 1.67 × 10 ^−27 ] = 2.29 × 10 ^7 "Hz"' />
            </Step>
            <Step title="Kinetic energy at the rim">
              <Eq src='KE = [ q ^2 · B ^2 · R ^2 | 2 · m ] = [ ( 1.6 × 10 ^−19 ) ^2 · 1.5 ^2 · 0.5 ^2 | 2 · 1.67 × 10 ^−27 ] = 4.31 × 10 ^−12 "J"' />
            </Step>
            <Step title="Convert to MeV">
              <Eq src='[ 4.31 × 10 ^−12 | 1.6 × 10 ^−13 ] = 26.9 "MeV"' />
            </Step>
          </ol>
          <Answer>The voltage must alternate at 22.9 MHz. The protons come out with 4.31 × 10⁻¹² J, which is 26.9 MeV.</Answer>
          <figure className="t-figure">
            <Cyclotron />
          </figure>
        </Example>

        <Example n={5} title="A rod in a field">
          <p className="ex-q">A 0.5 m rod carries 4 A at right angles to a field of 0.3 T. What force acts on it? What if the rod is turned to be at 30° to the field?</p>
          <Given items={['L = 0.5 "m"', 'I = 4 "A"', 'B = 0.3 "T"']} />
          <ol className="steps">
            <Step title="At right angles">
              <Eq src='F = I · L · B = 4 · 0.5 · 0.3 = 0.6 "N"' />
            </Step>
            <Step title="At 30°">
              <Eq src='F = I · L · B · sin 30° = 0.6 · 0.5 = 0.3 "N"' />
            </Step>
          </ol>
          <Answer>0.6 N at right angles, falling to 0.3 N at 30°. Turn the rod to lie along the field and the force falls to zero.</Answer>
          <figure className="t-figure">
            <RodForce />
          </figure>
        </Example>

        <Example n={6} title="Fields of a wire and a coil">
          <p className="ex-q">Find the field 5 cm from a long straight wire carrying 10 A, and the field at the centre of a 20-turn circular coil of radius 5 cm carrying 2 A.</p>
          <Given items={['I = 10 "A"', 'd = 0.05 "m"', 'N = 20', 'R = 0.05 "m"', 'I _coil = 2 "A"']} />
          <ol className="steps">
            <Step title="The straight wire">
              <Eq src='B = [ μ _0 · I | 2 · π · d ] = [ 4 · π × 10 ^−7 · 10 | 2 · π · 0.05 ] = 4.0 × 10 ^−5 "T"' />
            </Step>
            <Step title="The coil">
              <Eq src='B = [ μ _0 · N · I | 2 · R ] = [ 4 · π × 10 ^−7 · 20 · 2 | 2 · 0.05 ] = 5.03 × 10 ^−4 "T"' />
            </Step>
          </ol>
          <Answer>40 μT for the wire (about the size of the Earth's field) and 0.503 mT for the coil, more than ten times as much because there are 20 turns near the centre.</Answer>
          <figure className="t-figure">
            <WireField />
          </figure>
        </Example>

        <Example n={7} title="A solenoid">
          <p className="ex-q">A solenoid 0.25 m long has 500 turns and carries 3 A. Find the field inside, and the field if the current is halved.</p>
          <Given items={['N = 500', 'L = 0.25 "m"', 'I = 3 "A"']} />
          <ol className="steps">
            <Step title="Turns per metre">
              <Eq src='n = [ N | L ] = [ 500 | 0.25 ] = 2000 "turns/m"' />
            </Step>
            <Step title="The field">
              <Eq src='B = μ _0 · n · I = 4 · π × 10 ^−7 · 2000 · 3 = 7.54 × 10 ^−3 "T"' />
            </Step>
          </ol>
          <Answer>7.54 mT inside. Halve the current and the field halves to 3.77 mT. The field depends only on the turns per metre and the current.</Answer>
          <figure className="t-figure">
            <Solenoid />
          </figure>
        </Example>

        <Example n={8} title="Two parallel wires">
          <p className="ex-q">Two long wires 10 cm apart carry 5 A and 10 A in the same direction. Find the force per metre between them, and the total force on a 2 m length.</p>
          <Given items={['I _1 = 5 "A"', 'I _2 = 10 "A"', 'd = 0.1 "m"']} />
          <ol className="steps">
            <Step title="Force per unit length">
              <Eq src='[ F | L ] = [ μ _0 · I _1 · I _2 | 2 · π · d ] = [ 2 × 10 ^−7 · 5 · 10 | 0.1 ] = 1.0 × 10 ^−4 "N/m"' />
            </Step>
            <Step title="Over 2 m">
              <Eq src='F = 1.0 × 10 ^−4 · 2 = 2.0 × 10 ^−4 "N"' />
            </Step>
          </ol>
          <Answer>1.0 × 10⁻⁴ N per metre, so 2.0 × 10⁻⁴ N on 2 m. The currents are in the same direction, so the force is attractive. Each wire feels the same size of force.</Answer>
          <figure className="t-figure">
            <ParallelWires />
          </figure>
        </Example>

        <Example n={9} title="Torque on a coil">
          <p className="ex-q">A rectangular coil of 100 turns measures 4 cm by 5 cm and carries 0.5 A in a field of 0.2 T. Find its magnetic moment and the largest torque it feels.</p>
          <Given items={['N = 100', 'A = 0.04 · 0.05 = 2 × 10 ^−3 "m²"', 'I = 0.5 "A"', 'B = 0.2 "T"']} />
          <ol className="steps">
            <Step title="Magnetic moment">
              <Eq src='m = N · I · A = 100 · 0.5 · 2 × 10 ^−3 = 0.1 "A·m²"' />
            </Step>
            <Step title="Largest torque (plane parallel to the field)">
              <Eq src='τ = m · B = 0.1 · 0.2 = 0.02 "N·m"' />
            </Step>
          </ol>
          <Answer>The moment is 0.1 A·m² and the greatest torque is 0.02 N·m. It falls to zero when the coil has turned to face square to the field.</Answer>
          <figure className="t-figure">
            <LoopTorque />
          </figure>
        </Example>

        <Example n={10} title="Making meters">
          <p className="ex-q">A galvanometer of resistance 50 Ω gives full-scale deflection for 2 mA. How can it be made into an ammeter reading up to 1 A, and a voltmeter reading up to 10 V?</p>
          <Given items={['G = 50 "Ω"', 'I _g = 2 × 10 ^−3 "A"']} />
          <ol className="steps">
            <Step title="Ammeter: the shunt">
              <Eq src='S = [ I _g · G | I − I _g ] = [ 2 × 10 ^−3 · 50 | 1 − 2 × 10 ^−3 ] = 0.100 "Ω"' />
            </Step>
            <Step title="Voltmeter: the series resistor">
              <Eq src='R = [ V | I _g ] − G = [ 10 | 2 × 10 ^−3 ] − 50 = 4950 "Ω"' />
            </Step>
          </ol>
          <Answer>A 0.100 Ω shunt in parallel makes the 1 A ammeter (its total resistance is about 0.1 Ω). A 4950 Ω resistor in series makes the 10 V voltmeter (total resistance 5000 Ω).</Answer>
          <figure className="t-figure">
            <Meters />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="A magnetic field can speed a charge up" wrong="W = F · d ≠ 0" fig={<Lorentz />}>
            The force is always at right angles to the velocity, so it does no work. It changes the direction of the velocity, never the speed, which is why the path is a circle at constant speed.
          </Mistake>
          <Mistake title="A resting charge feels a magnetic force" wrong="v = 0 → F ≠ 0" fig={<ForceAngle />}>
            The force is <M>q · v · B · sin θ</M>. With <M>v = 0</M> the force is zero. It is also zero when the charge moves along the field (<M>θ = 0</M>).
          </Mistake>
          <Mistake title="The force points along the field" wrong="F ∥ B" fig={<RightHand />}>
            The force is at right angles to both <M>v</M> and <M>B</M>. It never points along either of them.
          </Mistake>
          <Mistake title="A faster particle goes round more quickly" wrong={'T ∝ [ 1 | v ]'} fig={<CircleOrbits />}>
            Faster particles go round a bigger circle, and the two effects cancel exactly: <M>T = 2 · π · m / ( q · B )</M> has no <M>v</M>. This is what makes the cyclotron work.
          </Mistake>
          <Mistake title="Parallel currents repel like charges" wrong="I ↑↑ → repel" fig={<ParallelWires />}>
            It is the other way round. Currents in the <em>same</em> direction attract, and currents in <em>opposite</em> directions repel.
          </Mistake>
          <Mistake title="The solenoid field depends on its length and size" wrong={'B = μ _0 · N · I'} fig={<Solenoid />}>
            The field is <M>B = μ _0 · n · I</M>, with <M>n</M> the turns <em>per metre</em>. Stretching the same wire into a longer coil lowers <M>n</M> and so lowers <M>B</M>. The width of the coil does not matter.
          </Mistake>
          <Mistake title="A shunt goes in series" wrong="G + S" fig={<Meters />}>
            For an ammeter the shunt goes in <em>parallel</em> with the galvanometer, so most of the current bypasses it. The big resistor for a voltmeter goes in <em>series</em>.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">A moving charge makes a field, and a field pushes a moving charge sideways.</p>
        <p className="closing-sub">Next: magnetism and matter. A current loop acts like a tiny magnet, so what is a magnet, and why do some materials respond to a field far more than others?</p>
      </footer>
    </ChapterShell>
  );
}
