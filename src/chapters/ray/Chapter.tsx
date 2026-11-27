import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { ApparentDepth, Cassegrain, Dispersion, Fibre, LensContact, LensMaker, Magnifier, Microscope, MirrorFocus, PlaneMirror, Prism, RayDiagram, ReflectionLaw, Refraction, SphericalSurface, Telescope } from './RayAnims';

/** Ray optics: reflection, mirrors, refraction, total internal reflection, lenses, prisms and optical instruments. */

const SECTIONS: NoteSection[] = [
  { id: 'rays', title: 'Light as rays', group: 'Theory' },
  { id: 'reflection', title: 'Reflection and plane mirrors', group: 'Theory' },
  { id: 'mirrors', title: 'Spherical mirrors', group: 'Theory' },
  { id: 'refraction', title: 'Refraction', group: 'Theory' },
  { id: 'tir', title: 'Total internal reflection', group: 'Theory' },
  { id: 'surface', title: 'Refraction at a spherical surface', group: 'Theory' },
  { id: 'lenses', title: 'Thin lenses', group: 'Theory' },
  { id: 'maker', title: 'The lens maker formula', group: 'Theory' },
  { id: 'power', title: 'Power and combinations', group: 'Theory' },
  { id: 'prism', title: 'The prism and dispersion', group: 'Theory' },
  { id: 'microscope', title: 'Microscopes', group: 'Theory' },
  { id: 'telescope', title: 'Telescopes', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="ray" film={buildFilm} sections={SECTIONS} sideTitle="Ray optics" sideLead="Mirrors, lenses and prisms: how light is bent to form images, and how that makes microscopes and telescopes.">
      <header className="article-head">
        <span className="kicker">Physics · Ray optics and optical instruments</span>
        <h1 className="article-title">How does a curved piece of glass make an image?</h1>
        <p className="article-lead">Light is a wave, but its wavelength is tiny next to a mirror or a lens, so it travels in straight lines that bend only at surfaces. Following those lines with two simple laws and one sign convention, we can predict every image from a spoon to a telescope.</p>
      </header>

      <section className="t-section" id="t-rays">
        <SectionHead n={no('rays')} title="Light as rays" />
        <p>
          The wavelength of visible light is about half a micrometre. When light meets objects much larger than that (mirrors, lenses, prisms), the wave nature is hidden, and light behaves as if it travels along straight lines called <strong>rays</strong>. A bundle of rays is a <strong>beam</strong>. This is <strong>ray optics</strong> (or geometrical optics).
        </p>
        <p>
          All of it rests on just two laws: the law of <strong>reflection</strong> at a surface that bounces light, and the law of <strong>refraction</strong> at a surface that bends it. An <strong>image</strong> is the point where rays from a point on an object meet (a <strong>real</strong> image, which can be caught on a screen) or appear to meet when traced backward (a <strong>virtual</strong> image, which cannot).
        </p>
      </section>

      <section className="t-section" id="t-reflection">
        <SectionHead n={no('reflection')} title="Reflection and plane mirrors" />
        <p>
          Draw the <strong>normal</strong>, the line at right angles to the surface at the point where a ray strikes. The angle of incidence <M>i</M> is measured from the normal to the incoming ray, and the angle of reflection <M>r</M> from the normal to the outgoing one. The <strong>law of reflection</strong> says:
        </p>
        <Eq src='i = r' />
        <p>The incident ray, the normal and the reflected ray all lie in one plane.</p>
        <figure className="t-figure">
          <ReflectionLaw />
          <figcaption>As the ray tilts, the reflected ray tilts with it so that the two angles stay equal.</figcaption>
        </figure>
        <p>
          In a <strong>plane mirror</strong>, rays from a point on an object reflect and spread out as if they came from a point behind the mirror. Your eye traces them back to that point, which is the image. By the law of reflection the image is as far behind the mirror as the object is in front, and it is virtual, upright and the same size.
        </p>
        <figure className="t-figure">
          <PlaneMirror />
          <figcaption>Move the object and the image moves the same distance the other way. The dashed lines are only the backward extensions of the reflected rays.</figcaption>
        </figure>
        <Eq src='"image distance" = "object distance"' />
      </section>

      <section className="t-section" id="t-mirrors">
        <SectionHead n={no('mirrors')} title="Spherical mirrors" />
        <p>
          A <strong>spherical mirror</strong> is a piece of a sphere with a reflecting surface. Its centre is the <strong>pole</strong> <M>P</M>, the sphere's centre is the <strong>centre of curvature</strong> <M>C</M>, and the radius is <M>R</M>. The line through <M>P</M> and <M>C</M> is the <strong>principal axis</strong>. A <strong>concave</strong> mirror curves toward the light (like the inside of a spoon); a <strong>convex</strong> mirror curves away from it.
        </p>
        <h3 className="t-h3">The focus</h3>
        <p>
          Rays close to the axis and parallel to it all cross the axis at one point, the <strong>principal focus</strong> <M>F</M>, at a distance <M>f</M> from the pole. To find it, take a ray at a small height <M>h</M>. The line <M>C M</M> is the normal at the point of reflection, so the ray is turned through twice the small angle <M>θ</M> that <M>C M</M> makes with the axis:
        </p>
        <Eq src={['h = R · θ', 'h = f · 2 · θ', 'f = [ R | 2 ]']} />
        <figure className="t-figure">
          <MirrorFocus />
          <figcaption>Rays near the axis cross it very close to <M>R / 2</M>. Rays far from the axis cross nearer the mirror, which blurs the image (spherical aberration), so we keep to small mirrors and near-axis rays.</figcaption>
        </figure>
        <h3 className="t-h3">The mirror equation</h3>
        <p>
          Now put an object at <M>O</M>, a distance <M>u</M> from the pole, and let its image form at <M>I</M>, a distance <M>v</M> from the pole. A ray from <M>O</M> hits the mirror at <M>M</M> and returns to <M>I</M>. Call the small angles the ray makes with the axis <M>α</M> at <M>O</M>, <M>β</M> at <M>C</M> and <M>γ</M> at <M>I</M>, and the angle of incidence <M>θ</M>. Each is an outside angle of a triangle:
        </p>
        <Eq src={['β = α + θ', 'γ = β + θ', 'α + γ = 2 · β']} />
        <p>
          For small angles each angle is the height divided by the distance: <M>α = h / u</M>, <M>β = h / R</M>, <M>γ = h / v</M>. So
        </p>
        <Eq src={['[ h | u ] + [ h | v ] = [ 2 · h | R ]', '[ 1 | u ] + [ 1 | v ] = [ 2 | R ] = [ 1 | f ]']} />
        <h3 className="t-h3">Sign convention</h3>
        <p>To use one equation for every case, we follow the <strong>Cartesian sign convention</strong>:</p>
        <ul className="t-list">
          <li>All distances are measured <strong>from the pole</strong> (or optical centre of a lens).</li>
          <li>Distances in the direction the incident light travels are <strong>positive</strong>; those against it are <strong>negative</strong>. The object is usually on the left, so <M>u</M> is negative.</li>
          <li>Heights above the principal axis are positive, and below it negative.</li>
        </ul>
        <p>With this convention the equation holds in every case. For a mirror, the focal length of a concave mirror is negative and that of a convex mirror is positive.</p>
        <Eq src={['[ 1 | v ] + [ 1 | u ] = [ 1 | f ]', 'm = [ h _i | h _o ] = − [ v | u ]']} />
        <p>
          The <strong>magnification</strong> <M>m</M> is the image height over the object height. A negative <M>m</M> means an inverted image, positive means upright; a size of <M>m</M> above 1 means magnified.
        </p>
        <h3 className="t-h3">Drawing the image</h3>
        <p>Two rays are enough to locate the image of a point. For a concave mirror:</p>
        <ul className="t-list">
          <li>a ray parallel to the axis reflects through <M>F</M>;</li>
          <li>a ray through <M>F</M> reflects parallel to the axis;</li>
          <li>a ray through <M>C</M> goes in along the normal and reflects straight back;</li>
          <li>a ray to the pole reflects at an equal angle on the other side.</li>
        </ul>
        <figure className="t-figure">
          <RayDiagram kind="concave-mirror" u0={230} u1={95} title="An object moves toward a concave mirror from beyond its centre of curvature and its real inverted image moves out and grows" />
          <figcaption>Far from the mirror the real image is small and inverted, close to <M>F</M>. As the object nears <M>F</M> the image runs away and grows.</figcaption>
        </figure>
        <p>Inside the focus, the reflected rays no longer meet, but spread. Traced backward, they seem to come from a larger upright image behind the mirror. This is how a shaving mirror works.</p>
        <figure className="t-figure">
          <RayDiagram kind="concave-mirror" u0={44} u1={18} title="An object closer to a concave mirror than its focus gives a large upright virtual image behind the mirror" />
          <figcaption>Inside the focal length: the image is virtual, upright and magnified.</figcaption>
        </figure>
        <p>
          A <strong>convex</strong> mirror always gives a virtual, upright, smaller image, wherever the object is. It is used as a wide-view mirror on vehicles.
        </p>
        <figure className="t-figure">
          <RayDiagram kind="convex-mirror" u0={230} u1={60} title="A convex mirror always gives a small upright virtual image behind the mirror, whatever the position of the object" />
          <figcaption>The image stays between the pole and the focus behind the mirror, always smaller than the object.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-refraction">
        <SectionHead n={no('refraction')} title="Refraction" />
        <p>
          When light passes from one transparent material into another, it changes direction. This is <strong>refraction</strong>. It happens because the speed of light differs in the two materials. The <strong>refractive index</strong> of a material compares its speed with that in vacuum:
        </p>
        <Eq src='n = [ c | v ]' />
        <p>
          The larger <M>n</M>, the slower the light: <M>n = 1.0003</M> for air, <M>1.33</M> for water, about <M>1.5</M> for glass, <M>2.4</M> for diamond. Suppose a plane wavefront reaches a boundary at a slant. Part of the front enters the slower medium first and slows down while the rest is still moving fast, so the front turns. In the time <M>τ</M>, one end of the front travels <M>v _1 · τ</M> in medium 1 while the other end travels <M>v _2 · τ</M> in medium 2, along a common slanted edge of length <M>AC</M>:
        </p>
        <Eq src={['sin i = [ v _1 · τ | AC ]', 'sin r = [ v _2 · τ | AC ]', '[ sin i | sin r ] = [ v _1 | v _2 ] = [ n _2 | n _1 ]']} />
        <p>This is <strong>Snell's law</strong>:</p>
        <Eq src='n _1 · sin i = n _2 · sin r' />
        <p>
          Going into a denser medium (higher <M>n</M>) the ray bends <em>toward</em> the normal; going into a less dense one it bends <em>away</em>. A ray along the normal is not deviated at all.
        </p>
        <figure className="t-figure">
          <Refraction n1={1} n2={1.5} iMax={80} title="A ray going from air into glass bends toward the normal; the angle of refraction is always smaller than the angle of incidence" />
          <figcaption>Air into glass. The faint ray is the small part that reflects.</figcaption>
        </figure>
        <h3 className="t-h3">Apparent depth</h3>
        <p>
          Rays leaving the water bend away from the normal, so an object under water looks raised. Take a ray at a small angle <M>θ _w</M> in water, which becomes <M>θ _a</M> in air; for small angles Snell's law reads <M>n · θ _w = θ _a</M>. The ray leaves the surface at a horizontal distance <M>x</M> from the vertical through the object:
        </p>
        <Eq src={['x = d · θ _w', 'x = d _app · θ _a', 'd _app = d · [ θ _w | θ _a ] = [ d | n ]']} />
        <figure className="t-figure">
          <ApparentDepth />
          <figcaption>Traced backward, the bent rays meet at a point about three quarters of the way down, so the pool looks shallower than it is.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-tir">
        <SectionHead n={no('tir')} title="Total internal reflection" />
        <p>
          Light going from a denser to a less dense medium (glass to air, say) bends away from the normal. Increase the angle of incidence, and the refracted ray comes closer to lying along the surface. The <strong>critical angle</strong> <M>θ _c</M> is the incidence angle at which the refracted angle is <M>90°</M>:
        </p>
        <Eq src={['n _1 · sin θ _c = n _2 · sin 90°', 'sin θ _c = [ n _2 | n _1 ]']} />
        <p>
          For any larger angle there is no solution for the refracted ray, and all the light is reflected back. This is <strong>total internal reflection</strong>. It needs two conditions: light going from the denser to the less dense medium, and an angle of incidence greater than <M>θ _c</M>. For glass to air, <M>sin θ _c = 1 / n</M>.
        </p>
        <figure className="t-figure">
          <Refraction n1={1.5} n2={1} iMax={70} title="A ray going from glass into air bends away from the normal until the critical angle, beyond which it is reflected totally" names={['glass, n₁ = 1.5', 'air, n₂ = 1']} />
          <figcaption>The refracted ray swings out toward the surface and vanishes at <M>θ _c</M>; the reflected ray becomes fully bright.</figcaption>
        </figure>
        <h3 className="t-h3">Where it is used</h3>
        <p>
          In an <strong>optical fibre</strong>, a thin glass core is wrapped in glass of lower index, and light bounces along the core by repeated total internal reflection, even round bends. This carries telephone and internet data and lets doctors look inside the body (endoscopes). Prisms in binoculars and periscopes turn light through <M>90°</M> or <M>180°</M> with no loss. The sparkle of a diamond comes from its small critical angle (<M>24.4°</M>), which traps light inside until it leaves through the top. A mirage is the same effect in layers of hot air.
        </p>
        <figure className="t-figure">
          <Fibre />
          <figcaption>A ray that meets the wall steeply leaks out. One that meets it at more than the critical angle is trapped and travels on, again and again.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-surface">
        <SectionHead n={no('surface')} title="Refraction at a spherical surface" />
        <p>
          A lens is made from two curved refracting surfaces, so start with one. Light goes from a medium of index <M>n _1</M> to <M>n _2</M> across a spherical surface of radius <M>R</M> and centre <M>C</M>. A ray from the object <M>O</M> meets it at <M>M</M> with incidence angle <M>i</M>, and is refracted through <M>r</M> to the image <M>I</M>. With the small angles <M>α</M> (at <M>O</M>), <M>β</M> (at <M>C</M>) and <M>γ</M> (at <M>I</M>):
        </p>
        <Eq src={['i = α + β', 'r = β − γ']} />
        <p>
          For small angles Snell's law is <M>n _1 · i = n _2 · r</M>. Substitute:
        </p>
        <Eq src={['n _1 · ( α + β ) = n _2 · ( β − γ )', 'n _1 · α + n _2 · γ = ( n _2 − n _1 ) · β']} />
        <p>
          With <M>α = h / u</M>, <M>γ = h / v</M>, <M>β = h / R</M> (distances as magnitudes), and then the sign convention putting a minus sign on the object distance, we get:
        </p>
        <Eq src='[ n _2 | v ] − [ n _1 | u ] = [ n _2 − n _1 | R ]' />
        <figure className="t-figure">
          <SphericalSurface />
          <figcaption>As the object comes closer the image moves farther away, tracking the equation. All the rays from <M>O</M> meet at <M>I</M> (for near-axis rays).</figcaption>
        </figure>
        <Note label="Signs">The radius <M>R</M> is positive when the centre of curvature is on the side the light is going to (the right), negative when it is on the side it came from.</Note>
      </section>

      <section className="t-section" id="t-lenses">
        <SectionHead n={no('lenses')} title="Thin lenses" />
        <p>
          A <strong>lens</strong> is a piece of glass with two refracting surfaces. A <strong>convex</strong> lens is thicker in the middle and converges parallel rays to a focus; a <strong>concave</strong> lens is thinner in the middle and spreads them out. A <strong>thin</strong> lens is one whose thickness is small next to its focal length, so distances can be measured from the centre of the lens.
        </p>
        <p>
          To find the image, apply the surface equation twice. The first surface forms a (possibly virtual) image <M>I _1</M> at <M>v _1</M>; this becomes the object for the second surface. For a lens of index <M>n</M> in air, with radii <M>R _1</M> and <M>R _2</M>:
        </p>
        <Eq src={['[ n | v _1 ] − [ 1 | u ] = [ n − 1 | R _1 ]', '[ 1 | v ] − [ n | v _1 ] = [ 1 − n | R _2 ]']} />
        <p>Adding the two, the <M>v _1</M> terms cancel:</p>
        <Eq src='[ 1 | v ] − [ 1 | u ] = ( n − 1 ) · ( [ 1 | R _1 ] − [ 1 | R _2 ] )' />
        <p>
          The right side depends only on the lens. When the object is at infinity (<M>u → ∞</M>) the image is at the focus (<M>v = f</M>). So both sides are equal to <M>1 / f</M>, which gives the <strong>thin lens formula</strong> and the <strong>magnification</strong>:
        </p>
        <Eq src={['[ 1 | v ] − [ 1 | u ] = [ 1 | f ]', 'm = [ h _i | h _o ] = [ v | u ]']} />
        <p>
          Note the difference from the mirror: the signs inside the equation are different (<M>1 / v − 1 / u</M>), and the magnification is <M>+ v / u</M>. A convex lens has a positive <M>f</M>, a concave lens a negative <M>f</M>.
        </p>
        <h3 className="t-h3">Drawing the image</h3>
        <ul className="t-list">
          <li>A ray parallel to the axis passes through the far focus (convex) or seems to come from the near focus (concave).</li>
          <li>A ray through the optical centre is not deviated.</li>
          <li>A ray through the near focus emerges parallel to the axis (convex).</li>
        </ul>
        <figure className="t-figure">
          <RayDiagram kind="convex-lens" u0={230} u1={95} title="An object moves toward a convex lens from beyond twice the focal length and its real inverted image moves out and grows" />
          <figcaption>
            Beyond <M>2 · f</M> the image is real, inverted and smaller. At <M>2 · f</M> it is the same size. Between <M>f</M> and <M>2 · f</M> it is bigger and farther away.
          </figcaption>
        </figure>
        <p>Closer than the focus, the rays leave the lens still spreading. The eye sees an upright, enlarged virtual image: the principle of the magnifying glass.</p>
        <figure className="t-figure">
          <RayDiagram kind="convex-lens" u0={42} u1={18} title="An object closer to a convex lens than its focus gives a larger, upright, virtual image on the same side as the object" />
          <figcaption>Inside the focal length: upright, virtual and magnified.</figcaption>
        </figure>
        <p>A concave lens always gives an upright, virtual, smaller image between the lens and the object's focus.</p>
        <figure className="t-figure">
          <RayDiagram kind="concave-lens" u0={230} u1={60} title="A concave lens always spreads the rays and gives a small upright virtual image on the same side as the object" />
          <figcaption>Whatever the object distance, a concave lens gives a virtual, upright, diminished image.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-maker">
        <SectionHead n={no('maker')} title="The lens maker formula" />
        <p>With the object at infinity, the formula we found says</p>
        <Eq src='[ 1 | f ] = ( n − 1 ) · ( [ 1 | R _1 ] − [ 1 | R _2 ] )' />
        <p>
          It links the focal length to the glass and the shape: a higher index or stronger curvature (smaller <M>R</M>) gives a shorter focal length. The signs follow the convention: for a double convex lens <M>R _1</M> is positive and <M>R _2</M> negative. For one with equal radii <M>R</M>, <M>1 / f = ( n − 1 ) · 2 / R</M>, so <M>f = R / ( 2 · ( n − 1 ) )</M>, and for <M>n = 1.5</M> the focal length equals the radius.
        </p>
        <figure className="t-figure">
          <LensMaker />
          <figcaption>Curve the surfaces more and the focus moves in. For glass of index 1.5, <M>f = R</M>.</figcaption>
        </figure>
        <p>
          If the lens is in a medium of index <M>n _m</M> (say, water), use the relative index <M>n / n _m</M> in place of <M>n</M>. The lens is weaker there. A glass lens in a liquid of the same index would vanish altogether, and a lens with a lower index than its surroundings behaves the opposite way: a convex-shaped air bubble in water spreads light.
        </p>
        <figure className="t-figure">
          <LensMaker medium={4 / 3} title="The same lens in water has a longer focal length, because the glass is only a little denser than its surroundings" />
          <figcaption>In water the relative index is only <M>1.5 / 1.33 = 1.13</M>, so the focus is much farther away.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-power">
        <SectionHead n={no('power')} title="Power and combinations" />
        <p>
          Opticians describe a lens by its <strong>power</strong>, the reciprocal of the focal length in metres. A short focal length means a strong lens. Its unit is the <strong>dioptre</strong> (D):
        </p>
        <Eq src='P = [ 1 | f ]  "(f in metres)"' />
        <p>
          A convex lens has positive power, a concave lens negative power. Spectacles of <M>+ 2 "D"</M> have a focal length of 0.5 m.
        </p>
        <p>
          Put two thin lenses in contact. The first forms an image at <M>v _1</M>, which is the object for the second:
        </p>
        <Eq src={['[ 1 | v _1 ] − [ 1 | u ] = [ 1 | f _1 ]', '[ 1 | v ] − [ 1 | v _1 ] = [ 1 | f _2 ]', '[ 1 | v ] − [ 1 | u ] = [ 1 | f _1 ] + [ 1 | f _2 ]']} />
        <p>The combination behaves as one lens with</p>
        <Eq src={['[ 1 | f ] = [ 1 | f _1 ] + [ 1 | f _2 ]', 'P = P _1 + P _2']} />
        <figure className="t-figure">
          <LensContact />
          <figcaption>The powers simply add. A second converging lens brings the focus closer, a diverging one pushes it away.</figcaption>
        </figure>
        <p>A camera lens uses several thin lenses of different glasses in contact, for example, to cancel colour fringes. The total magnification of such a combination is the product <M>m = m _1 · m _2</M>.</p>
      </section>

      <section className="t-section" id="t-prism">
        <SectionHead n={no('prism')} title="The prism and dispersion" />
        <p>
          A <strong>prism</strong> is a transparent block with two flat faces meeting at the <strong>apex angle</strong> <M>A</M>. A ray enters one face at incidence angle <M>i</M>, refracts at <M>r _1</M>, reaches the second face at <M>r _2</M> and leaves at the angle <M>e</M>. The two normals meet at the angle <M>180° − A</M>, so, from the triangle they make with the ray inside:
        </p>
        <Eq src='r _1 + r _2 = A' />
        <p>
          At the first face the ray is turned by <M>i − r _1</M> and at the second by <M>e − r _2</M>, both toward the base. The total <strong>deviation</strong> is
        </p>
        <Eq src={['δ = ( i − r _1 ) + ( e − r _2 )', 'δ = i + e − A']} />
        <figure className="t-figure">
          <Prism />
          <figcaption>Turn the prism and the deviation changes. It has a smallest value in the middle, where the ray passes symmetrically.</figcaption>
        </figure>
        <p>
          The graph has a minimum at the <strong>angle of minimum deviation</strong> <M>δ _m</M>, where the ray passes symmetrically through the prism: <M>i = e</M> and so <M>r _1 = r _2 = A / 2</M>. There <M>i = ( A + δ _m ) / 2</M>, and Snell's law at the first face gives the index:
        </p>
        <Eq src={['n = [ sin i | sin r _1 ]', 'n = [ sin ( [ A + δ _m | 2 ] ) | sin ( [ A | 2 ] ) ]']} />
        <p>For a <em>thin</em> prism (<M>A</M> small), all angles are small and <M>δ = ( n − 1 ) · A</M>.</p>
        <h3 className="t-h3">Dispersion</h3>
        <p>
          The refractive index of glass is a little larger for violet light than for red, so violet is slowed more and bent more. White light is therefore spread into its colours, the <strong>spectrum</strong>. This is <strong>dispersion</strong>. Raindrops do the same, giving the rainbow.
        </p>
        <figure className="t-figure">
          <Dispersion />
          <figcaption>The violet ray (bent most) and the red ray (bent least) fan out after the prism. The effect is exaggerated here.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-microscope">
        <SectionHead n={no('microscope')} title="Microscopes" />
        <p>
          The size an object seems to have depends on the angle it makes at the eye. The nearest an eye can focus comfortably is the <strong>near point</strong>, <M>D = 25 "cm"</M>. An optical instrument raises the angle. Its <strong>magnifying power</strong> is the ratio of the angle <M>β</M> that the image makes to the angle <M>α</M> the object makes at the near point:
        </p>
        <Eq src='m = [ β | α ]' />
        <h3 className="t-h3">The simple microscope (magnifying glass)</h3>
        <p>
          Place the object just inside the focus of a convex lens. A virtual image forms at the near point. Let <M>s</M> be the distance of the object from the lens (a positive number), so <M>u = − s</M>, and the image is at <M>v = − D</M>. Without the lens the object subtends <M>α = h / D</M>; with the lens it subtends <M>β = h / s</M>. The lens formula gives:
        </p>
        <Eq src={['− [ 1 | D ] + [ 1 | s ] = [ 1 | f ]', '[ 1 | s ] = [ 1 | f ] + [ 1 | D ]', 'm = [ β | α ] = [ D | s ] = 1 + [ D | f ]']} />
        <p>
          If the image is at infinity (the relaxed eye), the object is at the focus, <M>s = f</M>, and <M>m = D / f</M>. A strong lens (small <M>f</M>) magnifies more.
        </p>
        <figure className="t-figure">
          <Magnifier />
          <figcaption>With the lens, the virtual image fills a bigger angle at the eye than the bare object did.</figcaption>
        </figure>
        <h3 className="t-h3">The compound microscope</h3>
        <p>
          To magnify more, two lenses are used. The <strong>objective</strong> (short focal length <M>f _o</M>) takes the object just outside its focus and forms a real, inverted, magnified image. The <strong>eyepiece</strong> (<M>f _e</M>) is used as a magnifying glass on that image, giving a final virtual image at the near point or at infinity. The magnifications multiply:
        </p>
        <Eq src={['m = m _o · m _e', 'm = [ v _o | u _o ] · ( 1 + [ D | f _e ] )']} />
        <p>
          In normal use, the final image is at infinity. The object is almost at the focus of the objective, so <M>v _o</M> is about the tube length <M>L</M> (the distance between the two inner focal points), and the object distance is about <M>f _o</M>:
        </p>
        <Eq src='m ≈ [ L | f _o ] · [ D | f _e ]' />
        <figure className="t-figure">
          <Microscope />
          <figcaption>The objective makes a real magnified image just inside the focus of the eyepiece; the eyepiece turns it into a bigger virtual one for the eye. The picture is not to scale.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-telescope">
        <SectionHead n={no('telescope')} title="Telescopes" />
        <p>
          A telescope makes distant objects look larger by increasing the angle they subtend. In the <strong>astronomical refracting telescope</strong>, a large, long-focus objective forms a real image of a far object in its focal plane. A short-focus eyepiece, used as a magnifying glass, views that image. In <strong>normal adjustment</strong> the final image is at infinity, so the two lenses are separated by the sum of their focal lengths and the focal points coincide.
        </p>
        <p>
          A distant object makes an angle <M>α</M> at the objective. The first image has a height <M>h</M> in the focal plane. The angle at the eyepiece is <M>β</M>:
        </p>
        <Eq src={['α = [ h | f _o ]', 'β = [ h | f _e ]', 'm = [ β | α ] = [ f _o | f _e ]']} />
        <Eq src='L = f _o + f _e' />
        <figure className="t-figure">
          <Telescope />
          <figcaption>Parallel rays from a distant point meet at the focus of the objective. The eyepiece turns them back into parallel rays, but at an angle larger by <M>f _o / f _e</M>. The image is inverted.</figcaption>
        </figure>
        <p>
          A large objective lens is heavy, sags under its own weight and has colour fringes. A <strong>reflecting telescope</strong> uses a concave mirror as the objective. It can be made very large and supported from behind, has no colour fringes (reflection does not depend on the colour), and a large mirror gathers more light, so faint stars become visible. In the Cassegrain design, a small convex mirror sends the light back through a hole in the big one, so the instrument is compact.
        </p>
        <figure className="t-figure">
          <Cassegrain />
          <figcaption>The large mirror and the small mirror together fold a long focal length into a short tube.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Law of reflection', 'i = r'],
                  ['Mirror: focal length', 'f = [ R | 2 ]'],
                  ['Mirror equation', '[ 1 | v ] + [ 1 | u ] = [ 1 | f ]'],
                  ['Mirror magnification', 'm = − [ v | u ]'],
                  ['Refractive index', 'n = [ c | v ]'],
                  ['Snell’s law', 'n _1 · sin i = n _2 · sin r'],
                  ['Apparent depth', 'd _app = [ d | n ]'],
                  ['Critical angle', 'sin θ _c = [ n _2 | n _1 ]'],
                  ['Spherical surface', '[ n _2 | v ] − [ n _1 | u ] = [ n _2 − n _1 | R ]'],
                  ['Thin lens', '[ 1 | v ] − [ 1 | u ] = [ 1 | f ]'],
                  ['Lens magnification', 'm = [ v | u ]'],
                  ['Lens maker formula', '[ 1 | f ] = ( n − 1 ) · ( [ 1 | R _1 ] − [ 1 | R _2 ] )'],
                  ['Power', 'P = [ 1 | f ]  "(f in metres)"'],
                  ['Lenses in contact', 'P = P _1 + P _2'],
                  ['Prism deviation', 'δ = i + e − A'],
                  ['Prism index', 'n = [ sin ( [ A + δ _m | 2 ] ) | sin ( [ A | 2 ] ) ]'],
                  ['Magnifying glass', 'm = 1 + [ D | f ] ,  m = [ D | f ] "(image at infinity)"'],
                  ['Compound microscope', 'm ≈ [ L | f _o ] · [ D | f _e ]'],
                  ['Telescope', 'm = [ f _o | f _e ] ,  L = f _o + f _e'],
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
                  ['u', 'Object distance (negative on the object side)', 'm'],
                  ['v', 'Image distance', 'm'],
                  ['f', 'Focal length', 'm'],
                  ['R', 'Radius of curvature', 'm'],
                  ['m', 'Magnification', 'none'],
                  ['n', 'Refractive index', 'none'],
                  ['P', 'Power of a lens', 'D'],
                  ['A', 'Apex angle of a prism', 'rad'],
                  ['δ', 'Angle of deviation', 'rad'],
                  ['D', 'Near point (25 cm)', 'm'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{['m', 'D', 'rad'].includes(unit) ? <M>{`"${unit}"`}</M> : unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Walking toward a mirror">
          <p className="ex-q">A person stands 1.5 m from a plane mirror and walks toward it at 2 m/s. How far from the mirror is the image, how fast does it move, and how fast does the image approach the person?</p>
          <Given items={['d = 1.5 "m"', 'v _p = 2 "m/s"']} />
          <ol className="steps">
            <Step title="Image position">
              <p>The image is as far behind the mirror as the person is in front.</p>
              <Eq src='"image distance" = 1.5 "m"' />
            </Step>
            <Step title="Image speed">
              <p>The image stays as far behind the mirror as the person is in front, so it moves toward the mirror at the same speed.</p>
              <Eq src='v _image = 2 "m/s"' />
            </Step>
            <Step title="Closing speed between person and image">
              <p>The distance between person and image is <M>2 · d</M>, so it shrinks twice as fast as <M>d</M>:</p>
              <Eq src='v _rel = 2 · 2 = 4 "m/s"' />
            </Step>
          </ol>
          <Answer>The image is 1.5 m behind the mirror and moves at 2 m/s. It approaches the person at 4 m/s, because both are moving toward the mirror.</Answer>
          <figure className="t-figure">
            <PlaneMirror />
          </figure>
        </Example>

        <Example n={2} title="An object in front of a concave mirror">
          <p className="ex-q">A concave mirror has a radius of curvature of 30 cm. An object stands 40 cm from it. Find the position, nature and magnification of the image.</p>
          <Given items={['R = 30 "cm"', 'u = − 40 "cm"']} />
          <ol className="steps">
            <Step title="Focal length (negative for a concave mirror)">
              <Eq src='f = − [ R | 2 ] = − 15 "cm"' />
            </Step>
            <Step title="Mirror equation">
              <Eq src={['[ 1 | v ] = [ 1 | f ] − [ 1 | u ] = − [ 1 | 15 ] + [ 1 | 40 ]', '[ 1 | v ] = [ − 8 + 3 | 120 ] = − [ 5 | 120 ]', 'v = − 24 "cm"']} />
            </Step>
            <Step title="Magnification">
              <Eq src='m = − [ v | u ] = − [ − 24 | − 40 ] = − 0.6' />
            </Step>
          </ol>
          <Answer>The image is 24 cm from the mirror, on the same side as the object (<M>v</M> negative), so it is real. It is inverted and smaller (<M>m = − 0.6</M>), 60% of the object's height.</Answer>
          <figure className="t-figure">
            <RayDiagram kind="concave-mirror" u0={230} u1={95} title="An object in front of a concave mirror, with the real inverted image it forms" />
            <figcaption>The picture sweeps the object; the example is one position of it, a little beyond the centre of curvature.</figcaption>
          </figure>
        </Example>

        <Example n={3} title="A convex mirror">
          <p className="ex-q">A convex mirror has a focal length of 20 cm. An object is 30 cm in front of it. Find the image.</p>
          <Given items={['f = + 20 "cm"', 'u = − 30 "cm"']} />
          <ol className="steps">
            <Step title="Mirror equation">
              <Eq src={['[ 1 | v ] = [ 1 | f ] − [ 1 | u ] = [ 1 | 20 ] + [ 1 | 30 ] = [ 5 | 60 ]', 'v = + 12 "cm"']} />
            </Step>
            <Step title="Magnification">
              <Eq src='m = − [ v | u ] = − [ 12 | − 30 ] = + 0.4' />
            </Step>
          </ol>
          <Answer>The image is 12 cm behind the mirror (<M>v</M> positive), so it is virtual. It is upright and 0.4 times the size of the object.</Answer>
          <figure className="t-figure">
            <RayDiagram kind="convex-mirror" u0={230} u1={60} title="A convex mirror gives a small, virtual, upright image" />
          </figure>
        </Example>

        <Example n={4} title="Snell's law and a pool">
          <p className="ex-q">A ray in air strikes glass (<M>n = 1.5</M>) at <M>30°</M> to the normal. Find the angle of refraction. Then find how deep a 2.0 m pool of water (<M>n = 4 / 3</M>) looks when viewed from directly above.</p>
          <Given items={['n _1 = 1', 'n _2 = 1.5', 'i = 30°', 'd = 2.0 "m"', 'n _w = 4 / 3']} />
          <ol className="steps">
            <Step title="Angle of refraction">
              <Eq src={['sin r = [ n _1 · sin i | n _2 ] = [ 1 · 0.5 | 1.5 ] = 0.333', 'r = 19.5°']} />
            </Step>
            <Step title="Apparent depth of the pool">
              <Eq src='d _app = [ d | n ] = [ 2.0 | 4 / 3 ] = 1.5 "m"' />
            </Step>
          </ol>
          <Answer>The ray bends toward the normal, to 19.5°. The pool looks 1.5 m deep, a quarter shallower than it is.</Answer>
          <figure className="t-figure">
            <Refraction n1={1} n2={1.5} iMax={80} title="A ray going from air into glass bends toward the normal" />
          </figure>
        </Example>

        <Example n={5} title="Critical angle and a fibre">
          <p className="ex-q">Find the critical angle for glass (<M>n = 1.5</M>) to air, and for water (<M>n = 4 / 3</M>) to air. An optical fibre has a core of index 1.5 and a cladding of index 1.4: find its critical angle.</p>
          <Given items={['n _glass = 1.5', 'n _water = 4 / 3', 'n _core = 1.5', 'n _clad = 1.4']} />
          <ol className="steps">
            <Step title="Glass to air">
              <Eq src='sin θ _c = [ 1 | 1.5 ] = 0.667 ,  θ _c = 41.8°' />
            </Step>
            <Step title="Water to air">
              <Eq src='sin θ _c = [ 1 | 4 / 3 ] = 0.75 ,  θ _c = 48.6°' />
            </Step>
            <Step title="Fibre">
              <Eq src='sin θ _c = [ 1.4 | 1.5 ] = 0.933 ,  θ _c = 69.0°' />
            </Step>
          </ol>
          <Answer>41.8° for glass, 48.6° for water, and 69.0° at the core wall of the fibre. In the fibre, light travelling within 21° of the axis (a wall angle of 69° or more) is trapped.</Answer>
          <figure className="t-figure">
            <Fibre />
          </figure>
        </Example>

        <Example n={6} title="A glass surface">
          <p className="ex-q">A point object in air is 60 cm from a convex glass surface (<M>n = 1.5</M>) whose radius of curvature is 20 cm. Where is the image?</p>
          <Given items={['n _1 = 1', 'n _2 = 1.5', 'R = + 20 "cm"', 'u = − 60 "cm"']} />
          <ol className="steps">
            <Step title="Surface equation">
              <Eq src={['[ n _2 | v ] = [ n _2 − n _1 | R ] + [ n _1 | u ]', '[ 1.5 | v ] = [ 0.5 | 20 ] − [ 1 | 60 ] = 0.025 − 0.0167 = 0.00833']} />
            </Step>
            <Step title="Solve">
              <Eq src='v = [ 1.5 | 0.00833 ] = + 180 "cm"' />
            </Step>
          </ol>
          <Answer>The image is 180 cm beyond the surface, inside the glass (positive <M>v</M>), where a real image forms if the glass is thick enough.</Answer>
          <figure className="t-figure">
            <SphericalSurface />
          </figure>
        </Example>

        <Example n={7} title="A convex lens">
          <p className="ex-q">A convex lens has a focal length of 20 cm. An object is placed 30 cm from it. Find the image distance, the magnification and the power of the lens.</p>
          <Given items={['f = + 20 "cm"', 'u = − 30 "cm"']} />
          <ol className="steps">
            <Step title="Lens formula">
              <Eq src={['[ 1 | v ] = [ 1 | f ] + [ 1 | u ] = [ 1 | 20 ] − [ 1 | 30 ] = [ 1 | 60 ]', 'v = + 60 "cm"']} />
            </Step>
            <Step title="Magnification">
              <Eq src='m = [ v | u ] = [ 60 | − 30 ] = − 2' />
            </Step>
            <Step title="Power">
              <Eq src='P = [ 1 | 0.20 ] = + 5 "D"' />
            </Step>
          </ol>
          <Answer>A real image 60 cm on the far side, inverted and twice as large. The lens has a power of +5 D.</Answer>
          <figure className="t-figure">
            <RayDiagram kind="convex-lens" u0={230} u1={95} title="A convex lens with an object beyond its focal length gives a real inverted image" />
          </figure>
        </Example>

        <Example n={8} title="Making a lens">
          <p className="ex-q">A double convex lens is made of glass of index 1.5, with both radii of curvature 20 cm. Find its focal length in air, and in water (<M>n = 4 / 3</M>).</p>
          <Given items={['n = 1.5', 'R _1 = + 20 "cm"', 'R _2 = − 20 "cm"']} />
          <ol className="steps">
            <Step title="In air">
              <Eq src={['[ 1 | f ] = ( 1.5 − 1 ) · ( [ 1 | 20 ] + [ 1 | 20 ] ) = 0.5 · 0.1 = 0.05', 'f = 20 "cm"']} />
            </Step>
            <Step title="In water: relative index">
              <Eq src='n _rel = [ 1.5 | 4 / 3 ] = 1.125' />
            </Step>
            <Step title="Focal length in water">
              <Eq src={['[ 1 | f ] = ( 1.125 − 1 ) · 0.1 = 0.0125', 'f = 80 "cm"']} />
            </Step>
          </ol>
          <Answer>20 cm in air, and 80 cm in water. The lens is four times weaker under water, because the glass is only slightly denser than water.</Answer>
          <figure className="t-figure">
            <LensMaker medium={4 / 3} title="A lens in water: the focus is much farther away than in air" />
          </figure>
        </Example>

        <Example n={9} title="Two lenses in contact">
          <p className="ex-q">A convex lens of focal length 10 cm is in contact with a concave lens of focal length 40 cm. Find the focal length and the power of the combination.</p>
          <Given items={['f _1 = + 10 "cm"', 'f _2 = − 40 "cm"']} />
          <ol className="steps">
            <Step title="Powers in dioptres">
              <Eq src={['P _1 = [ 1 | 0.10 ] = + 10 "D"', 'P _2 = [ 1 | − 0.40 ] = − 2.5 "D"']} />
            </Step>
            <Step title="Combined power and focal length">
              <Eq src={['P = P _1 + P _2 = 10 − 2.5 = 7.5 "D"', 'f = [ 1 | 7.5 ] = 0.133 "m" = 13.3 "cm"']} />
            </Step>
          </ol>
          <Answer>The pair acts as a converging lens of power +7.5 D and focal length 13.3 cm.</Answer>
          <figure className="t-figure">
            <LensContact />
          </figure>
        </Example>

        <Example n={10} title="A prism">
          <p className="ex-q">The minimum deviation for a prism of apex angle 60° is 30°. Find the refractive index of the glass. What is the deviation of a thin prism of apex angle 5° and index 1.5?</p>
          <Given items={['A = 60°', 'δ _m = 30°']} />
          <ol className="steps">
            <Step title="Index from minimum deviation">
              <Eq src={['n = [ sin ( [ 60° + 30° | 2 ] ) | sin ( [ 60° | 2 ] ) ] = [ sin 45° | sin 30° ]', 'n = [ 0.707 | 0.5 ] = 1.414']} />
            </Step>
            <Step title="Thin prism">
              <Eq src='δ = ( n − 1 ) · A = ( 1.5 − 1 ) · 5° = 2.5°' />
            </Step>
          </ol>
          <Answer>The glass has <M>n = 1.414</M>, which is <M>√[ 2 ]</M>. The thin prism deviates light by 2.5°.</Answer>
          <figure className="t-figure">
            <Prism n={Math.SQRT2} />
          </figure>
        </Example>

        <Example n={11} title="A compound microscope">
          <p className="ex-q">A microscope has an objective of focal length 1 cm and an eyepiece of focal length 5 cm. An object is 1.2 cm from the objective. The final image is at the near point, 25 cm. Find the total magnification and the length of the microscope. Then find the magnification when the final image is at infinity, with a tube length of 20 cm.</p>
          <Given items={['f _o = 1 "cm"', 'f _e = 5 "cm"', 'u _o = − 1.2 "cm"', 'D = 25 "cm"']} />
          <ol className="steps">
            <Step title="Image from the objective">
              <Eq src={['[ 1 | v _o ] = [ 1 | 1 ] + [ 1 | − 1.2 ] = 1 − 0.833 = 0.1667', 'v _o = 6 "cm" ,  m _o = [ v _o | u _o ] = [ 6 | − 1.2 ] = − 5']} />
            </Step>
            <Step title="Eyepiece used as a magnifier at the near point">
              <Eq src='m _e = 1 + [ D | f _e ] = 1 + [ 25 | 5 ] = 6' />
            </Step>
            <Step title="Total magnification">
              <Eq src='m = m _o · m _e = − 5 · 6 = − 30' />
            </Step>
            <Step title="Length (distance between the lenses)">
              <p>Let <M>s</M> be the distance from the first image to the eyepiece:</p>
              <Eq src={['[ 1 | s ] = [ 1 | 5 ] + [ 1 | 25 ] = [ 6 | 25 ] ,  s = 4.17 "cm"', 'v _o + s = 6 + 4.17 = 10.2 "cm"']} />
            </Step>
            <Step title="Final image at infinity, tube length 20 cm">
              <Eq src='m ≈ [ L | f _o ] · [ D | f _e ] = [ 20 | 1 ] · [ 25 | 5 ] = 100' />
            </Step>
          </ol>
          <Answer>With the image at the near point, the magnification is 30 (inverted) and the lenses are 10.2 cm apart. With the final image at infinity and a 20 cm tube, it is about 100.</Answer>
          <figure className="t-figure">
            <Microscope />
          </figure>
        </Example>

        <Example n={12} title="An astronomical telescope">
          <p className="ex-q">A telescope has an objective of focal length 100 cm and an eyepiece of 2.5 cm. Find its magnifying power and length in normal adjustment. At what angle does the Moon, which spans 0.5°, appear?</p>
          <Given items={['f _o = 100 "cm"', 'f _e = 2.5 "cm"', 'α = 0.5°']} />
          <ol className="steps">
            <Step title="Magnifying power">
              <Eq src='m = [ f _o | f _e ] = [ 100 | 2.5 ] = 40' />
            </Step>
            <Step title="Length">
              <Eq src='L = f _o + f _e = 100 + 2.5 = 102.5 "cm"' />
            </Step>
            <Step title="Apparent size of the Moon">
              <Eq src='β = m · α = 40 · 0.5° = 20°' />
            </Step>
          </ol>
          <Answer>A magnifying power of 40 in a tube 102.5 cm long. The Moon's disc, 0.5° across to the naked eye, appears 20° across (inverted).</Answer>
          <figure className="t-figure">
            <Telescope />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="A concave mirror has a positive focal length" wrong="f _concave > 0" fig={<RayDiagram kind="concave-mirror" u0={230} u1={95} height={230} title="The focus of a concave mirror is on the side of the incoming light, so by the sign convention its focal length is negative" />}>
            The focus of a concave mirror is on the object side, against the direction the light first travels, so <M>f</M> is negative. A convex mirror has <M>f &gt; 0</M>. For lenses it is the other way: convex is positive.
          </Mistake>
          <Mistake title="Light always bends toward the normal" wrong={'"always toward the normal"'} fig={<Refraction n1={1.5} n2={1} iMax={40} height={215} title="Going from glass to air the ray bends away from the normal" names={['glass', 'air']} />}>
            Light bends toward the normal only when it enters a <em>denser</em> medium (higher <M>n</M>). Going into a less dense one, it bends away.
          </Mistake>
          <Mistake title="Total reflection from air into glass" wrong={'"total internal reflection, air to glass"'} fig={<Refraction n1={1} n2={1.5} iMax={85} height={215} title="Going from air into glass there is always a refracted ray, however large the angle of incidence" />}>
            It needs light going from the <em>denser</em> to the <em>less dense</em> medium. From air into glass there is a refracted ray at every angle of incidence, even at 90°, where <M>sin r = 1 / 1.5</M>.
          </Mistake>
          <Mistake title="The lens magnification is minus v over u" wrong={'m = − [ v | u ]  "for a lens"'} fig={<RayDiagram kind="convex-lens" u0={230} u1={95} height={230} title="For a lens the magnification is v over u, which is negative for a real inverted image" />}>
            The minus sign belongs to the mirror formula. For a thin lens <M>m = v / u</M>, which is negative (inverted) for a real image. The lens formula is also different: <M>1 / v − 1 / u</M>, not <M>1 / v + 1 / u</M>.
          </Mistake>
          <Mistake title="The deviation rises with the incidence angle" wrong={'δ  "grows steadily with"  i'} fig={<Prism height={230} />}>
            The deviation falls to a minimum and then rises. The minimum is at the symmetric passage, <M>i = e</M>, which is where the index is measured.
          </Mistake>
          <Mistake title="The telescope magnification is eyepiece over objective" wrong="m = [ f _e | f _o ]" fig={<Telescope height={230} />}>
            To magnify, the objective must have the longer focus: <M>m = f _o / f _e</M>. A long telescope with a small eyepiece magnifies the most.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Two laws and a sign convention, and every image falls out.</p>
        <p className="closing-sub">Next: wave optics. When light squeezes through tiny gaps its wave nature returns, in interference and diffraction.</p>
      </footer>
    </ChapterShell>
  );
}
