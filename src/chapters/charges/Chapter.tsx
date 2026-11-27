import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { CoulombPair, DipoleField, DipoleTorque, FieldLines, Flux, GaussCount, Induction, LineField, NotPath, NullPoint, PointField, Rubbing, SheetField, ShellField, Sharing, Superpose, UniformAccel } from './ChargesAnims';

/** Electric charges and fields: Coulomb's law, the field, field lines, dipoles, flux and Gauss's law. */

const SECTIONS: NoteSection[] = [
  { id: 'charge', title: 'Electric charge', group: 'Theory' },
  { id: 'properties', title: 'Quantised, conserved, additive', group: 'Theory' },
  { id: 'coulomb', title: "Coulomb's law", group: 'Theory' },
  { id: 'superposition', title: 'Many charges: superposition', group: 'Theory' },
  { id: 'field', title: 'The electric field', group: 'Theory' },
  { id: 'lines', title: 'Field lines', group: 'Theory' },
  { id: 'dipole', title: 'The electric dipole', group: 'Theory' },
  { id: 'torque', title: 'A dipole in a uniform field', group: 'Theory' },
  { id: 'flux', title: 'Electric flux', group: 'Theory' },
  { id: 'gauss', title: "Gauss's law", group: 'Theory' },
  { id: 'apps', title: "Using Gauss's law", group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="charges" film={buildFilm} sections={SECTIONS} sideTitle="Electric charges and fields" sideLead="Where the pushes and pulls between charges come from, how to picture them as fields, and the one law, Gauss's, that tames the symmetric cases.">
      <header className="article-head">
        <span className="kicker">Physics · Electrostatics</span>
        <h1 className="article-title">How does one charge push another from across the room?</h1>
        <p className="article-lead">Two charges never touch, yet they push or pull on each other. We describe this with a field that fills the space around every charge. This chapter builds Coulomb's law, the field, field lines, dipoles and finally Gauss's law, one step at a time.</p>
      </header>

      <section className="t-section" id="t-charge">
        <SectionHead n={no('charge')} title="Electric charge" />
        <p>
          Rub a glass rod with silk and it picks up scraps of paper. Rub a plastic comb on dry hair and it does the same. The rod and the comb have gained <strong>electric charge</strong>. There are only two kinds. Two glass rods rubbed with silk push each other away, a glass rod and a plastic rod pull toward each other. Benjamin Franklin named the kinds <strong>positive</strong> and <strong>negative</strong>: <em>like charges repel, unlike charges attract</em>.
        </p>
        <p>
          Matter is made of atoms with a positive nucleus (protons) surrounded by negative electrons. A normal object has equal amounts of both, so it is neutral. Rubbing does not create charge. It only moves electrons from one material to the other: the one that loses electrons is left positive, the one that gains them is negative.
        </p>
        <figure className="t-figure">
          <Rubbing />
          <figcaption>Electrons hop from the glass to the silk. The rod ends up short of electrons (positive) and the silk has the same number too many (negative). The total is still zero.</figcaption>
        </figure>
        <h3 className="t-h3">Conductors and insulators</h3>
        <p>
          In a <strong>conductor</strong> such as a metal, some electrons are free to wander through the whole body. In an <strong>insulator</strong> such as glass, plastic or dry air every electron is held to its own atom. Charge placed on an insulator stays where it was put. Charge placed on a conductor spreads over it.
        </p>
        <h3 className="t-h3">Charging without touching</h3>
        <p>
          Bring a charged rod near a neutral metal sphere, without touching it. The free electrons are pulled toward (or pushed from) the rod, leaving the near side with one sign and the far side with the other. This is <strong>induction</strong>. The sphere is still neutral overall. If you now earth the far side while the rod is still there, electrons flow to or from the ground, and when you remove both the earth and the rod the sphere keeps a charge opposite to the rod's.
        </p>
        <figure className="t-figure">
          <Induction />
          <figcaption>As the rod comes close the free electrons crowd toward it and leave a positive patch behind on the far side. When the rod leaves they drift back.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-properties">
        <SectionHead n={no('properties')} title="Quantised, conserved, additive" />
        <p>Three facts about charge are used all the time.</p>
        <p>
          <strong>Additivity.</strong> Charges add like ordinary numbers, with their signs. A body carrying <M>+ 5 "μC"</M> and another carrying <M>− 2 "μC"</M> are together <M>+ 3 "μC"</M>.
        </p>
        <p>
          <strong>Conservation.</strong> The total charge of an isolated system never changes. Charge can move from place to place but cannot be made or destroyed.
        </p>
        <figure className="t-figure">
          <Sharing />
          <figcaption>A charged metal sphere touches an identical neutral one. The charge flows across until it is shared equally, and the total is still <M>8 · q</M>.</figcaption>
        </figure>
        <p>
          <strong>Quantisation.</strong> Charge comes in whole lumps of the electron's charge. Every charge is a whole number of them:
        </p>
        <Eq src='Q = ± n · e ,  e = 1.6 × 10 ^−19 "C"' />
        <p>
          The coulomb is a huge amount of charge in these terms: one coulomb is about <M>6.25 × 10 ^18</M> electrons. Everyday charges are microcoulombs (<M>1 "μC" = 10 ^−6 "C"</M>) or nanocoulombs, so the steps of <M>e</M> are far too small to notice. That is why we treat charge as smooth in most problems.
        </p>
      </section>

      <section className="t-section" id="t-coulomb">
        <SectionHead n={no('coulomb')} title="Coulomb's law" />
        <p>
          How hard do two charges push or pull on each other? Coulomb measured it with a twisting balance and found two things. The force is proportional to the product of the charges, and it falls with the <em>square</em> of the distance between them. For two point charges <M>q _1</M> and <M>q _2</M> a distance <M>r</M> apart in a vacuum:
        </p>
        <Eq src='F = k · [ q _1 · q _2 | r ^2 ]' />
        <p>
          The force acts along the straight line joining the charges. It is repulsive when the charges have the same sign and attractive when they have opposite signs. The constant <M>k</M> is usually written with <M>ε _0</M>, the permittivity of free space:
        </p>
        <Eq src={['k = [ 1 | 4 · π · ε _0 ] = 9 × 10 ^9 "N·m²/C²"', 'ε _0 = 8.85 × 10 ^−12 "C²/N·m²"']} />
        <figure className="t-figure">
          <CoulombPair />
          <figcaption>Opposite charges pull together. Move them to twice the distance and the force falls to a quarter; to three times and it falls to a ninth. The graph is the inverse square curve.</figcaption>
        </figure>
        <p>
          The two charges push on each other with equal and opposite forces (Newton's third law), whatever their sizes. A tiny charge pulls on a huge one exactly as hard as the huge one pulls on the tiny one.
        </p>
        <Note label="How strong is it?">Between an electron and a proton the electric attraction is about <M>10 ^39</M> times the gravitational attraction. Gravity only wins for big bodies because large objects are almost exactly neutral.</Note>
        <h3 className="t-h3">In a material</h3>
        <p>
          Put the charges in a medium such as oil or water and the force becomes smaller. The factor is the <strong>dielectric constant</strong> <M>K</M> of the medium, a number greater than 1 (about 80 for water). The force in the medium is the vacuum force divided by <M>K</M>:
        </p>
        <Eq src='F _medium = [ F _vacuum | K ]' />
      </section>

      <section className="t-section" id="t-superposition">
        <SectionHead n={no('superposition')} title="Many charges: superposition" />
        <p>
          Coulomb's law is about <em>two</em> charges. With more, the force that each one exerts is not changed by the others. So the net force on a charge is just the vector sum of the forces from all the others taken one at a time. This is the <strong>principle of superposition</strong>.
        </p>
        <Eq src='F _net = F _1 + F _2 + F _3 + …' />
        <figure className="t-figure">
          <Superpose />
          <figcaption>The push from the positive charge and the pull from the negative one are drawn from the small charge. Complete the parallelogram to get the net force, which changes in size and direction as the charge moves.</figcaption>
        </figure>
        <p>
          Add them as vectors: split each force into <M>x</M> and <M>y</M> parts, add the parts, and then combine. Do not add the sizes unless the forces are along one line.
        </p>
      </section>

      <section className="t-section" id="t-field">
        <SectionHead n={no('field')} title="The electric field" />
        <p>
          A charge <M>Q</M> changes the space around it. Any other charge placed there feels a force. We say that <M>Q</M> sets up an <strong>electric field</strong> in the space around it. The field at a point is defined by what a small positive <em>test charge</em> <M>q _0</M> would feel there, per unit of its charge:
        </p>
        <Eq src='E = [ F | q _0 ]' />
        <p>
          The test charge is taken so small that it does not disturb the charges that make the field. The field is a vector. It points the way a positive test charge would be pushed, and its unit is newton per coulomb (N/C). Once <M>E</M> is known at a point, the force on <em>any</em> charge <M>q</M> placed there is
        </p>
        <Eq src='F = q · E' />
        <p>The force is along <M>E</M> for a positive charge and against <M>E</M> for a negative one.</p>
        <h3 className="t-h3">Field of a point charge</h3>
        <p>
          Put the test charge <M>q _0</M> a distance <M>r</M> from a point charge <M>Q</M>. Coulomb's law gives the force, and dividing by <M>q _0</M> gives the field:
        </p>
        <Eq src={['F = k · [ Q · q _0 | r ^2 ]', 'E = [ F | q _0 ] = k · [ Q | r ^2 ]']} />
        <p>
          The field points directly away from a positive <M>Q</M> and toward a negative one, and it falls as <M>1 / r ^2</M>. It depends only on <M>Q</M> and on where you are, not on the test charge.
        </p>
        <figure className="t-figure">
          <PointField />
          <figcaption>Every arrow points away from the positive charge, and the arrows get shorter in step with <M>1 / r ^2</M>. The test charge feels a force along the arrow of the point where it sits.</figcaption>
        </figure>
        <h3 className="t-h3">Field of many charges</h3>
        <p>Superposition works for fields too. The field at a point is the vector sum of the fields of each charge there:</p>
        <Eq src='E = E _1 + E _2 + E _3 + …' />
        <figure className="t-figure">
          <NullPoint />
          <figcaption>Between two positive charges the fields point in opposite ways. They cancel at a single point, which lies nearer the smaller charge.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-lines">
        <SectionHead n={no('lines')} title="Field lines" />
        <p>
          A field line is a picture of the field. Draw a curve so that, at every point, its tangent points the way the field points there. Add an arrow to show the direction. The pictures below follow a few simple rules.
        </p>
        <ul className="t-list">
          <li>Lines start on positive charges and end on negative ones (or go off to infinity).</li>
          <li>The tangent to a line at a point is the direction of the field there.</li>
          <li>Where lines are close together the field is strong, and where they spread out it is weak.</li>
          <li>Two lines never cross. If they did, the field at that point would have two directions at once.</li>
          <li>Lines never form closed loops in electrostatics.</li>
        </ul>
        <figure className="t-figure">
          <FieldLines title="Field lines of a single positive charge spread out evenly in all directions, with dots drifting outward along them" kind="plus" />
          <figcaption>A single positive charge: straight lines going out. For a negative charge the same picture has the arrows pointing in.</figcaption>
        </figure>
        <figure className="t-figure">
          <FieldLines title="Field lines of a positive and a negative charge leave the positive one, curve round and end on the negative one" kind="pair" />
          <figcaption>Unlike charges: the lines run from the positive charge to the negative one. They are crowded between the charges, where the field is strong.</figcaption>
        </figure>
        <figure className="t-figure">
          <FieldLines title="Field lines of two equal positive charges leave each charge and bend away from each other, leaving a point in the middle with no field" kind="like" />
          <figcaption>Like charges: the lines push each other apart. Half way between two equal charges the field is zero, and no line passes through that point.</figcaption>
        </figure>
        <p>The lines also show how much charge there is. A charge of <M>+ 2 · q</M> sends out twice as many lines as <M>q</M>.</p>
        <figure className="t-figure">
          <FieldLines title="A charge of plus two and a charge of minus one; twice as many lines leave the big charge as arrive at the small one, so the rest go off to infinity" kind="two" n={9} />
          <figcaption>Twice the charge, twice the lines. Half of the lines from <M>+ 2 · q</M> end on <M>− q</M>; the rest go to infinity.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-dipole">
        <SectionHead n={no('dipole')} title="The electric dipole" />
        <p>
          An <strong>electric dipole</strong> is a pair of equal and opposite charges <M>+ q</M> and <M>− q</M> a small distance <M>2 · a</M> apart. Many molecules, such as water, behave like dipoles. Its strength is the <strong>dipole moment</strong>, a vector that points from the negative to the positive charge:
        </p>
        <Eq src='p = q · 2 · a' />
        <p>The unit is coulomb metre (C·m). The dipole is neutral overall, yet it makes a field because the two charges are not in the same place.</p>
        <h3 className="t-h3">On the axis</h3>
        <p>
          Take a point on the line through both charges, a distance <M>r</M> from the centre, on the side of <M>+ q</M>. The nearer, positive charge is at distance <M>r − a</M> and pushes the field away along the axis. The farther, negative charge is at <M>r + a</M> and pulls it back. Subtract the two:
        </p>
        <Eq src={['E = k · q · [ 1 | ( r − a ) ^2 ] − k · q · [ 1 | ( r + a ) ^2 ]', 'E = k · q · [ 4 · a · r | ( r ^2 − a ^2 ) ^2 ] = k · [ 2 · p · r | ( r ^2 − a ^2 ) ^2 ]']} />
        <p>
          Far from the dipole, <M>r</M> is much bigger than <M>a</M>, so <M>r ^2 − a ^2 ≈ r ^2</M>, and
        </p>
        <Eq src='E _axis = [ 2 · k · p | r ^3 ] = [ 1 | 4 · π · ε _0 ] · [ 2 · p | r ^3 ]' />
        <p>It points the same way as <M>p</M>, from the negative to the positive charge.</p>
        <h3 className="t-h3">On the perpendicular bisector</h3>
        <p>
          Now take a point on the line half way between the charges, at distance <M>r</M> from the centre. Each charge is the same distance <M>√[ r ^2 + a ^2 ]</M> away, so each makes a field of the same size <M>k · q / ( r ^2 + a ^2 )</M>. The parts perpendicular to the axis cancel. The parts along the axis both point the same way, opposite to <M>p</M>, and each has a share <M>a / √[ r ^2 + a ^2 ]</M> of its field:
        </p>
        <Eq src={['E = 2 · [ k · q | r ^2 + a ^2 ] · [ a | √[ r ^2 + a ^2 ] ]', 'E = [ k · p | ( r ^2 + a ^2 ) ^3/2 ]']} />
        <p>and for a point far away:</p>
        <Eq src='E _mid = [ k · p | r ^3 ] = [ 1 | 4 · π · ε _0 ] · [ p | r ^3 ]' />
        <figure className="t-figure">
          <DipoleField />
          <figcaption>
            The thin arrows are the fields of the two charges, the thick one is their sum. On the axis the sum is twice as big as at the same distance on the middle line, and points the other way. Both fall as <M>1 / r ^3</M>, faster than a single charge's <M>1 / r ^2</M>, because the two fields almost cancel.
          </figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-torque">
        <SectionHead n={no('torque')} title="A dipole in a uniform field" />
        <p>
          Place a dipole in a uniform field <M>E</M>, with its axis at an angle <M>θ</M> to the field. Each charge feels a force of size <M>q · E</M>. The two forces are equal and opposite, so the net force is zero and the centre does not accelerate. But they act at different points, so they form a couple that twists the dipole.
        </p>
        <p>
          The forces are <M>q · E</M> each, and the perpendicular distance between their lines is <M>2 · a · sin θ</M>. So the torque is
        </p>
        <Eq src={['τ = q · E · 2 · a · sin θ', 'τ = p · E · sin θ']} />
        <p>
          The torque is largest at <M>90°</M> and is zero when the dipole lines up with the field (<M>θ = 0</M>, stable) or against it (<M>θ = 180°</M>, unstable). The torque always turns the dipole toward the field. In a field that is <em>not</em> uniform, the forces on the two charges differ too, and the dipole is also pulled bodily toward the stronger region.
        </p>
        <figure className="t-figure">
          <DipoleTorque />
          <figcaption>The torque is biggest when the dipole is crossways to the field and fades as it lines up. It overshoots, swings back and settles pointing along the field.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-flux">
        <SectionHead n={no('flux')} title="Electric flux" />
        <p>
          <strong>Electric flux</strong> measures how much field passes through a surface. Think of the field lines as a flow, and the flux as the number of lines going through. For a flat area <M>A</M> in a uniform field <M>E</M>, with the field straight through (along the normal to the surface), the flux is <M>E · A</M>. Tilt the surface and fewer lines get through. If the angle between the field and the normal is <M>θ</M>:
        </p>
        <Eq src='Φ = E · A · cos θ' />
        <p>
          The factor <M>A · cos θ</M> is the area of the shadow the surface casts on a plane facing the field. The unit of flux is <M>"N·m²/C"</M>.
        </p>
        <figure className="t-figure">
          <Flux />
          <figcaption>When the surface faces the field, the most lines pass through. As it turns edge-on, fewer pass, and at 90° none do.</figcaption>
        </figure>
        <p>
          For a curved surface, or a field that varies, cut the surface into tiny patches <M>d A</M>, each nearly flat, and add up. For a <strong>closed</strong> surface the normal is taken to point outward, so flux going out is positive and flux going in is negative:
        </p>
        <Eq src='Φ = ∮ E · d A' />
        <p>
          A closed surface with no charge inside has as much flux going in as going out, so the net flux is zero. A net flux out means there is a source, a positive charge, inside.
        </p>
      </section>

      <section className="t-section" id="t-gauss">
        <SectionHead n={no('gauss')} title="Gauss's law" />
        <p>
          Start with the simplest case: a point charge <M>q</M> at the centre of a sphere of radius <M>r</M>. By symmetry the field has the same size at every point of the sphere and points straight out, along the normal. So the flux is just the field times the area of the sphere:
        </p>
        <Eq src={['Φ = E · 4 · π · r ^2', 'Φ = [ 1 | 4 · π · ε _0 ] · [ q | r ^2 ] · 4 · π · r ^2 = [ q | ε _0 ]']} />
        <p>
          The radius has cancelled. A bigger sphere has a weaker field but a larger area, and the two exactly compensate. That is why the field must fall as <M>1 / r ^2</M>.
        </p>
        <p>
          Next, change the shape. The same lines leave the charge whatever surface surrounds it, and each line that leaves through a lopsided surface has to leave the sphere too. So the flux is the same, <M>q / ε _0</M>, for <em>any</em> closed surface around the charge. Move the charge anywhere inside: still the same. Put the charge outside: every line that goes in comes out again, so the flux is zero.
        </p>
        <figure className="t-figure">
          <GaussCount />
          <figcaption>Sixteen rays leave the charge. While it is inside the circle all sixteen leave and none enter, so the net count is 16 wherever the charge is. When it goes outside, each ray that enters also leaves, and the net is zero.</figcaption>
        </figure>
        <p>
          For several charges, add the fluxes. Charges outside contribute zero, so only the charge <em>inside</em> counts. This is <strong>Gauss's law</strong>:
        </p>
        <Eq src='Φ = ∮ E · d A = [ q _in | ε _0 ]' />
        <p>
          The total flux through any closed surface (a <strong>Gaussian surface</strong>) equals the net charge inside divided by <M>ε _0</M>. Notice what it does <em>not</em> say. The field <M>E</M> in the integral is the full field at each point, from all charges including the ones outside. But the outside charges give a net zero flux, so only <M>q _in</M> sets the total.
        </p>
        <figure className="t-figure">
          <GaussCount outside />
          <figcaption>A charge outside the surface: every ray that enters also leaves. The field on the surface is certainly not zero, yet the net flux is.</figcaption>
        </figure>
        <Note label="When is it useful?">Gauss's law is always true, but it only gives <M>E</M> directly when the symmetry lets you pull <M>E</M> out of the integral: a sphere, a long cylinder, a plane. Choose a Gaussian surface on which <M>E</M> is constant, and either perpendicular or parallel to the surface.</Note>
      </section>

      <section className="t-section" id="t-apps">
        <SectionHead n={no('apps')} title="Using Gauss's law" />
        <h3 className="t-h3">A long straight line of charge</h3>
        <p>
          A very long wire has charge <M>λ</M> per unit length. By symmetry the field points straight out from the wire and is the same at the same distance. Draw a Gaussian cylinder of radius <M>r</M> and length <M>l</M> around the wire. The field is parallel to the flat ends, so they carry no flux. On the curved side the field is perpendicular to the surface and constant:
        </p>
        <Eq src={['E · 2 · π · r · l = [ λ · l | ε _0 ]', 'E = [ λ | 2 · π · ε _0 · r ] = [ 2 · k · λ | r ]']} />
        <figure className="t-figure">
          <LineField />
          <figcaption>The field of a long line of charge falls as <M>1 / r</M>, more slowly than a point charge. Doubling the distance halves the field.</figcaption>
        </figure>
        <h3 className="t-h3">A large flat sheet of charge</h3>
        <p>
          A big flat sheet has charge <M>σ</M> per unit area. By symmetry the field points straight away from the sheet on both sides. Use a small box (a pillbox) of end area <M>A</M> that goes through the sheet. Flux comes out of both ends and none out of the sides. The charge inside the box is the patch of sheet inside it, <M>σ · A</M>:
        </p>
        <Eq src={['2 · E · A = [ σ · A | ε _0 ]', 'E = [ σ | 2 · ε _0 ]']} />
        <p>
          The field does not depend on the distance from the sheet. For a real sheet that is true when you are close to it, compared with its size. Two parallel sheets with opposite charges <M>+ σ</M> and <M>− σ</M> add between them and cancel outside, giving <M>E = σ / ε _0</M> between the sheets and zero beyond them.
        </p>
        <figure className="t-figure">
          <SheetField />
          <figcaption>The arrows are the same length on both sides, near or far. Walk away from a large sheet and the field does not change.</figcaption>
        </figure>
        <h3 className="t-h3">A thin spherical shell</h3>
        <p>
          A thin shell of radius <M>R</M> carries total charge <M>Q</M> spread evenly over its surface. By symmetry the field points radially and depends only on <M>r</M>. Use a concentric sphere as the Gaussian surface.
        </p>
        <p>
          <strong>Outside</strong> (<M>r ≥ R</M>) the sphere encloses all of <M>Q</M>. So <M>E · 4 · π · r ^2 = Q / ε _0</M>:
        </p>
        <Eq src='E = [ 1 | 4 · π · ε _0 ] · [ Q | r ^2 ]' />
        <p>
          Outside a uniformly charged shell, it acts exactly like a point charge <M>Q</M> at its centre. <strong>Inside</strong> (<M>r &lt; R</M>) the Gaussian sphere encloses no charge, so
        </p>
        <Eq src='E = 0' />
        <p>
          At the surface the field is <M>Q / ( 4 · π · ε _0 · R ^2 )</M>, which equals <M>σ / ε _0</M> where <M>σ = Q / ( 4 · π · R ^2 )</M> is the surface charge density.
        </p>
        <figure className="t-figure">
          <ShellField />
          <figcaption>Nothing inside, then <M>1 / r ^2</M> outside. The field jumps at the surface because the surface is where the charge sits.</figcaption>
        </figure>
        <h3 className="t-h3">A solid sphere of insulating material</h3>
        <p>
          If the charge <M>Q</M> is spread evenly through the whole volume of a ball of radius <M>R</M>, then outside the field is the same as for the shell. Inside, a Gaussian sphere of radius <M>r</M> encloses the fraction <M>r ^3 / R ^3</M> of the charge:
        </p>
        <Eq src={['E · 4 · π · r ^2 = [ 1 | ε _0 ] · Q · [ r ^3 | R ^3 ]', 'E = [ 1 | 4 · π · ε _0 ] · [ Q · r | R ^3 ]']} />
        <p>Inside, the field grows in direct proportion to <M>r</M>, reaches its biggest value at the surface and then falls as <M>1 / r ^2</M>.</p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Quantisation of charge', 'Q = n · e'],
                  ['Coulomb force', 'F = [ 1 | 4 · π · ε _0 ] · [ q _1 · q _2 | r ^2 ]'],
                  ['In a medium', 'F = [ 1 | 4 · π · ε _0 · K ] · [ q _1 · q _2 | r ^2 ]'],
                  ['Definition of the field', 'E = [ F | q ]'],
                  ['Force on a charge in a field', 'F = q · E'],
                  ['Field of a point charge', 'E = [ 1 | 4 · π · ε _0 ] · [ Q | r ^2 ]'],
                  ['Dipole moment', 'p = q · 2 · a'],
                  ['Dipole field on the axis (far)', 'E = [ 2 · p | 4 · π · ε _0 · r ^3 ]'],
                  ['Dipole field on the bisector (far)', 'E = [ p | 4 · π · ε _0 · r ^3 ]'],
                  ['Torque on a dipole', 'τ = p · E · sin θ'],
                  ['Flux through a flat surface', 'Φ = E · A · cos θ'],
                  ['Gauss law', 'Φ = [ q _in | ε _0 ]'],
                  ['Long line of charge', 'E = [ λ | 2 · π · ε _0 · r ]'],
                  ['Large sheet of charge', 'E = [ σ | 2 · ε _0 ]'],
                  ['Shell, outside', 'E = [ 1 | 4 · π · ε _0 ] · [ Q | r ^2 ]'],
                  ['Shell, inside', 'E = 0'],
                  ['Solid insulating sphere, inside', 'E = [ 1 | 4 · π · ε _0 ] · [ Q · r | R ^3 ]'],
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
                  ['q', 'Charge', 'C'],
                  ['e', 'Charge of the electron (magnitude)', 'C'],
                  ['ε _0', 'Permittivity of free space', 'C²/N·m²'],
                  ['E', 'Electric field', 'N/C'],
                  ['p', 'Dipole moment', 'C·m'],
                  ['Φ', 'Electric flux', 'N·m²/C'],
                  ['λ', 'Charge per unit length', 'C/m'],
                  ['σ', 'Charge per unit area', 'C/m²'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>
                    <M>{`"${unit}"`}</M>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Force between two charges">
          <p className="ex-q">Two small spheres carry <M>+ 2 "μC"</M> and <M>+ 3 "μC"</M> and are 3 cm apart in air. Find the force between them.</p>
          <Given items={['q _1 = 2 × 10 ^−6 "C"', 'q _2 = 3 × 10 ^−6 "C"', 'r = 0.03 "m"']} />
          <ol className="steps">
            <Step title="Coulomb's law">
              <Eq src='F = k · [ q _1 · q _2 | r ^2 ]' />
            </Step>
            <Step title="Put in the numbers">
              <Eq src={['F = 9 × 10 ^9 · [ 2 × 10 ^−6 · 3 × 10 ^−6 | 0.03 ^2 ]', 'F = 9 × 10 ^9 · [ 6 × 10 ^−12 | 9 × 10 ^−4 ] = 60 "N"']} />
            </Step>
          </ol>
          <Answer>60 N, repulsive, since both charges are positive. Halve the distance and it would become 240 N.</Answer>
          <figure className="t-figure">
            <CoulombPair title="Two charges of the same sign pushed apart; the force arrows point away from each other and shrink as the gap grows" q1={1} q2={1} />
          </figure>
        </Example>

        <Example n={2} title="Where is the field zero?">
          <p className="ex-q">A <M>+ 4 "μC"</M> charge and a <M>+ 1 "μC"</M> charge are 0.3 m apart. Find the point on the line between them where the electric field is zero.</p>
          <Given items={['q _1 = 4 "μC"', 'q _2 = 1 "μC"', 'd = 0.3 "m"']} />
          <ol className="steps">
            <Step title="Fields point opposite ways between them">
              <p>Let the point be <M>x</M> from the <M>4 "μC"</M> charge. The two fields oppose, so they can cancel.</p>
              <Eq src='k · [ 4 × 10 ^−6 | x ^2 ] = k · [ 1 × 10 ^−6 | ( 0.3 − x ) ^2 ]' />
            </Step>
            <Step title="Take the square root of both sides">
              <Eq src={['[ 2 | x ] = [ 1 | 0.3 − x ]', '2 · ( 0.3 − x ) = x', '0.6 = 3 · x']} />
            </Step>
            <Step title="Solve and check">
              <Eq src={['x = 0.2 "m"', 'E _1 = 9 × 10 ^9 · [ 4 × 10 ^−6 | 0.2 ^2 ] = 9 × 10 ^5 "N/C"', 'E _2 = 9 × 10 ^9 · [ 1 × 10 ^−6 | 0.1 ^2 ] = 9 × 10 ^5 "N/C"']} />
            </Step>
          </ol>
          <Answer>0.2 m from the <M>4 "μC"</M> charge, which is 0.1 m from the <M>1 "μC"</M> charge. Each charge makes a field of 900 000 N/C there, and the two cancel. The point lies closer to the smaller charge.</Answer>
          <figure className="t-figure">
            <NullPoint />
          </figure>
        </Example>

        <Example n={3} title="An electron in a field">
          <p className="ex-q">A point charge of <M>5 "nC"</M> sits in air. Find the field 0.3 m away, then the force on, and acceleration of, an electron placed there. (<M>e = 1.6 × 10 ^−19 "C"</M>, electron mass <M>9.11 × 10 ^−31 "kg"</M>.)</p>
          <Given items={['Q = 5 × 10 ^−9 "C"', 'r = 0.3 "m"']} />
          <ol className="steps">
            <Step title="The field">
              <Eq src='E = k · [ Q | r ^2 ] = 9 × 10 ^9 · [ 5 × 10 ^−9 | 0.3 ^2 ] = 500 "N/C"' />
            </Step>
            <Step title="The force on the electron">
              <Eq src='F = e · E = 1.6 × 10 ^−19 · 500 = 8 × 10 ^−17 "N"' />
            </Step>
            <Step title="The acceleration">
              <Eq src='a = [ F | m ] = [ 8 × 10 ^−17 | 9.11 × 10 ^−31 ] = 8.78 × 10 ^13 "m/s²"' />
            </Step>
          </ol>
          <Answer>500 N/C, directed away from the charge. The electron is pulled toward the charge (opposite to the field) by <M>8 × 10 ^−17 "N"</M>, which is an acceleration of <M>8.8 × 10 ^13 "m/s²"</M>. The force is tiny, but the electron is far tinier still, so gravity (about <M>9 × 10 ^−30 "N"</M>) can be ignored.</Answer>
          <figure className="t-figure">
            <UniformAccel />
          </figure>
        </Example>

        <Example n={4} title="A dipole">
          <p className="ex-q">A dipole has charges <M>± 1 "μC"</M> separated by 4 cm. Find its dipole moment, its field on the axis and on the perpendicular bisector at 0.5 m from the centre, and the torque when it is at 30° to a uniform field of <M>3 × 10 ^4 "N/C"</M>.</p>
          <Given items={['q = 1 × 10 ^−6 "C"', '2 · a = 0.04 "m"', 'r = 0.5 "m"']} />
          <ol className="steps">
            <Step title="Dipole moment">
              <Eq src='p = q · 2 · a = 10 ^−6 · 0.04 = 4 × 10 ^−8 "C·m"' />
            </Step>
            <Step title="On the axis (r is much bigger than a)">
              <Eq src='E = [ 2 · k · p | r ^3 ] = [ 2 · 9 × 10 ^9 · 4 × 10 ^−8 | 0.125 ] = 5760 "N/C"' />
            </Step>
            <Step title="On the bisector">
              <Eq src='E = [ k · p | r ^3 ] = [ 9 × 10 ^9 · 4 × 10 ^−8 | 0.125 ] = 2880 "N/C"' />
            </Step>
            <Step title="Torque">
              <Eq src='τ = p · E · sin θ = 4 × 10 ^−8 · 3 × 10 ^4 · 0.5 = 6 × 10 ^−4 "N·m"' />
            </Step>
          </ol>
          <Answer><M>p = 4 × 10 ^−8 "C·m"</M>. On the axis 5760 N/C along <M>p</M>, on the bisector half as much, 2880 N/C, opposite to <M>p</M>. The torque is <M>6 × 10 ^−4 "N·m"</M>, trying to turn the dipole toward the field.</Answer>
          <figure className="t-figure">
            <DipoleTorque />
          </figure>
        </Example>

        <Example n={5} title="Flux through a surface and a closed box">
          <p className="ex-q">(a) A flat area of 0.5 m² sits in a uniform field of 200 N/C, with its normal at 60° to the field. Find the flux. (b) A charge of 17.7 nC sits at the centre of a cube. Find the flux through the whole cube and through one face. (<M>ε _0 = 8.85 × 10 ^−12 "C²/N·m²"</M>)</p>
          <Given items={['E = 200 "N/C"', 'A = 0.5 "m²"', 'θ = 60°', 'q = 17.7 × 10 ^−9 "C"']} />
          <ol className="steps">
            <Step title="Flat surface">
              <Eq src='Φ = E · A · cos θ = 200 · 0.5 · cos 60° = 50 "N·m²/C"' />
            </Step>
            <Step title="The whole cube (Gauss)">
              <Eq src='Φ = [ q | ε _0 ] = [ 17.7 × 10 ^−9 | 8.85 × 10 ^−12 ] = 2000 "N·m²/C"' />
            </Step>
            <Step title="One face">
              <p>By symmetry the six faces share the flux equally.</p>
              <Eq src='Φ _face = [ 2000 | 6 ] = 333 "N·m²/C"' />
            </Step>
          </ol>
          <Answer>50 N·m²/C through the flat area, 2000 N·m²/C out of the cube, and 333 N·m²/C through each face. The size of the cube does not matter.</Answer>
          <figure className="t-figure">
            <Flux height={240} />
          </figure>
        </Example>

        <Example n={6} title="A charged shell">
          <p className="ex-q">A thin spherical shell of radius 0.1 m carries <M>2 "nC"</M>. Find the field at 0.05 m, at the surface, and at 0.3 m from the centre, and the surface charge density.</p>
          <Given items={['Q = 2 × 10 ^−9 "C"', 'R = 0.1 "m"']} />
          <ol className="steps">
            <Step title="Inside, r = 0.05 m">
              <Eq src='E = 0' />
            </Step>
            <Step title="At the surface, r = 0.1 m">
              <Eq src='E = 9 × 10 ^9 · [ 2 × 10 ^−9 | 0.1 ^2 ] = 1800 "N/C"' />
            </Step>
            <Step title="Outside, r = 0.3 m">
              <Eq src='E = 9 × 10 ^9 · [ 2 × 10 ^−9 | 0.3 ^2 ] = 200 "N/C"' />
            </Step>
            <Step title="Surface charge density">
              <Eq src={['σ = [ Q | 4 · π · R ^2 ] = [ 2 × 10 ^−9 | 4 · π · 0.01 ] = 1.59 × 10 ^−8 "C/m²"', '[ σ | ε _0 ] = [ 1.59 × 10 ^−8 | 8.85 × 10 ^−12 ] = 1800 "N/C"']} />
            </Step>
          </ol>
          <Answer>Zero inside, 1800 N/C at the surface and 200 N/C at 0.3 m (a ninth of the surface value, since the distance is three times as great). The last line confirms the surface field equals <M>σ / ε _0</M>.</Answer>
          <figure className="t-figure">
            <ShellField />
          </figure>
        </Example>

        <Example n={7} title="A wire and a sheet">
          <p className="ex-q">(a) A long straight wire carries <M>2 "nC"</M> per metre. Find the field 0.1 m away. (b) A large sheet carries <M>8.85 "nC/m²"</M>. Find the field near it.</p>
          <Given items={['λ = 2 × 10 ^−9 "C/m"', 'r = 0.1 "m"', 'σ = 8.85 × 10 ^−9 "C/m²"']} />
          <ol className="steps">
            <Step title="The wire">
              <Eq src='E = [ 2 · k · λ | r ] = [ 2 · 9 × 10 ^9 · 2 × 10 ^−9 | 0.1 ] = 360 "N/C"' />
            </Step>
            <Step title="The sheet">
              <Eq src='E = [ σ | 2 · ε _0 ] = [ 8.85 × 10 ^−9 | 2 · 8.85 × 10 ^−12 ] = 500 "N/C"' />
            </Step>
          </ol>
          <Answer>360 N/C at 0.1 m from the wire (it would be 180 N/C at 0.2 m), and 500 N/C near the sheet, whatever the distance, pointing away from it.</Answer>
          <figure className="t-figure">
            <LineField />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Force falls as one over the distance" wrong="F ∝ [ 1 | r ]" fig={<CoulombPair title="The force between two charges falls as the inverse square of the distance" q1={1} q2={-1} height={190} graph={false} />}>
            Coulomb's law is an <em>inverse square</em> law. Double the distance and the force drops to a quarter, not a half.
          </Mistake>
          <Mistake title="Field lines are the paths charges take" wrong={'"a charge follows a field line"'} fig={<NotPath />}>
            The line gives the direction of the <em>force</em> at each point. A charge released from rest begins moving along the line, but it picks up speed and its momentum carries it off the curve. Only for a straight line does the path match.
          </Mistake>
          <Mistake title="Field lines can cross" wrong={'"lines cross"'} fig={<FieldLines title="Field lines of two equal positive charges bend away from each other and never meet" kind="like" height={210} n={8} />}>
            At any point the field has one direction, so only one line passes through it. Lines bend away from each other but never cross. Where the field is zero, no line passes at all.
          </Mistake>
          <Mistake title="Only the charge inside makes the field on a Gaussian surface" wrong="E _surface = [ q _in | ε _0 ]" fig={<GaussCount outside height={230} />}>
            The <em>total flux</em> depends only on <M>q _in</M>. The field at each point is made by all the charges, inside and outside. Outside charges push the field in on one side and out on the other, and the two cancel in the total.
          </Mistake>
          <Mistake title="There is a field inside a charged shell" wrong={'E = [ Q | 4 · π · ε _0 · r ^2 ]  "inside"'} fig={<ShellField height={230} />}>
            The same formula works outside only. A Gaussian sphere inside the shell encloses no charge, so the field there is zero.
          </Mistake>
          <Mistake title="The field of a sheet gets weaker with distance" wrong={'E _sheet ∝ [ 1 | r ^2 ]'} fig={<SheetField height={210} />}>
            For a very large sheet the field is the same everywhere on each side. The arrows spread out for a point charge, but a flat sheet gives no room for them to spread.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Charges make fields, and fields push charges.</p>
        <p className="closing-sub">Next: electrostatic potential and capacitance. Instead of the force at a point, we ask how much energy it takes to bring a charge there.</p>
      </footer>
    </ChapterShell>
  );
}
