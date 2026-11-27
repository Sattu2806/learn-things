import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Brewster, Coherence, Envelope, Fringes, Huygens, Malus, PathDifference, Phasor, PolarWave, Reflect, Refract, SlitHalves, SlitPattern, SnellGeometry, TwoSources, WaveSum, Wavefronts } from './WaveOpticsAnims';

/** Wave optics: Huygens, interference, Young's experiment, diffraction and polarisation. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'Light as a wave', group: 'Theory' },
  { id: 'fronts', title: 'Wavefronts and rays', group: 'Theory' },
  { id: 'huygens', title: "Huygens' principle", group: 'Theory' },
  { id: 'reflection', title: 'Reflection from a surface', group: 'Theory' },
  { id: 'refraction', title: 'Refraction and Snell’s law', group: 'Theory' },
  { id: 'superposition', title: 'Superposition and coherence', group: 'Theory' },
  { id: 'interference', title: 'Constructive and destructive interference', group: 'Theory' },
  { id: 'young', title: "Young's double-slit experiment", group: 'Theory' },
  { id: 'intensity', title: 'How bright is each fringe?', group: 'Theory' },
  { id: 'changes', title: 'What changes the fringes', group: 'Theory' },
  { id: 'diffraction', title: 'Diffraction at a single slit', group: 'Theory' },
  { id: 'envelope', title: 'Both together', group: 'Theory' },
  { id: 'polar', title: 'Polarisation', group: 'Theory' },
  { id: 'malus', title: "Malus's law", group: 'Theory' },
  { id: 'brewster', title: 'Polarisation by reflection', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="waveoptics" film={buildFilm} sections={SECTIONS} sideTitle="Wave optics" sideLead="Why two beams of light can make darkness, why a thin slit spreads light out, and how a pair of sunglasses sorts light by its direction of wobble.">
      <header className="article-head">
        <span className="kicker">Physics · Wave optics</span>
        <h1 className="article-title">How can light plus light make darkness?</h1>
        <p className="article-lead">Rays explain mirrors and lenses, but they cannot explain bright and dark stripes, the glow around a shadow, or why polarised sunglasses cut glare. All of these follow from one idea: light is a wave, and waves add up.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="Light as a wave" />
        <p>
          Newton pictured light as a stream of tiny particles. Huygens, his contemporary, pictured it as a wave. For a long time the particle picture seemed to win, since it explained straight-line shadows. Then in 1801 Thomas Young made two beams of light overlap and found <strong>dark</strong> places where there should have been double the light. Particles cannot cancel each other. Waves can. After that, the wave view was settled for the next century.
        </p>
        <p>
          The wavelength of visible light is tiny, between about 400 nm (violet) and 700 nm (red), where <M>1 "nm" = 10 ^−9 "m"</M>. That is why light seems to travel in straight lines in everyday life: obstacles and openings are huge compared with the wavelength. Ray optics is the limit of wave optics when the wavelength is negligible. When light meets something as small as its wavelength, such as a hair or a thin slit, the wave nature shows.
        </p>
        <Note label="The plan">We first see how a wave moves (Huygens), and get reflection and refraction from it. Then we add waves together, which gives interference and Young's experiment. Last, diffraction and polarisation.</Note>
      </section>

      <section className="t-section" id="t-fronts">
        <SectionHead n={no('fronts')} title="Wavefronts and rays" />
        <p>
          At one instant, all the points of a wave that are in the same phase (all at a crest, say) form a surface called a <strong>wavefront</strong>. From a small source, the wavefronts are expanding spheres. Far from the source, a small piece of such a sphere is almost flat: a <strong>plane wavefront</strong>, which is what a parallel beam of light is.
        </p>
        <figure className="t-figure">
          <Wavefronts />
          <figcaption>Circular wavefronts spread from the source and get straighter far away. A <strong>ray</strong> is a line at right angles to the wavefronts, showing the direction the wave travels.</figcaption>
        </figure>
        <p>
          The wave moves forward at its speed <M>v</M>. In a time <M>t</M> every wavefront moves forward a distance <M>v · t</M>, and the time between one crest and the next is the period. The speed, frequency <M>ν</M> and wavelength <M>λ</M> are tied together:
        </p>
        <Eq src='v = ν · λ' />
        <p>In vacuum the speed of every colour is <M>c = 3 × 10 ^8 "m/s"</M>.</p>
      </section>

      <section className="t-section" id="t-huygens">
        <SectionHead n={no('huygens')} title="Huygens' principle" />
        <p>
          How does a wavefront move on? Huygens gave a beautifully simple answer. <strong>Every point on a wavefront acts as a new source of little spherical wavelets, which spread out at the speed of the wave. After a time <M>t</M>, the new wavefront is the surface that just touches all the wavelets.</strong>
        </p>
        <p>
          Take a flat wavefront. Each point sends out a wavelet of radius <M>v · t</M> after a time <M>t</M>. The wavelets overlap and cancel everywhere except along their common tangent, a flat plane a distance <M>v · t</M> ahead. A curved wavefront works the same way, and the new front is a bigger circle.
        </p>
        <figure className="t-figure">
          <Huygens mode="plane" />
          <figcaption>The dashed line is the wavefront now. The small circles are wavelets from the dots on it. The solid line touching them is the wavefront a moment later.</figcaption>
        </figure>
        <figure className="t-figure">
          <Huygens mode="sphere" />
          <figcaption>For a curved front, the envelope of the wavelets is a circle bigger by exactly <M>v · t</M>.</figcaption>
        </figure>
        <Note label="Why only forward?">Huygens' picture draws only the forward half of each wavelet. A full treatment (Fresnel) shows that the backward parts cancel, which is why a wave does not run back toward its source.</Note>
      </section>

      <section className="t-section" id="t-reflection">
        <SectionHead n={no('reflection')} title="Reflection from a surface" />
        <p>
          A plane wavefront <M>A B</M> meets a mirror. Its end <M>A</M> touches the mirror first. During the time <M>τ</M> that the other end <M>B</M> takes to reach the mirror at <M>C</M>, the wavelet from <M>A</M> spreads to a radius <M>A D</M>. Both the distances are covered at the same speed <M>v</M> in the same medium:
        </p>
        <Eq src={['B C = v · τ', 'A D = v · τ']} />
        <p>
          The new wavefront <M>C D</M> is the tangent from <M>C</M> to the wavelet. Now look at the two right-angled triangles <M>A B C</M> and <M>A D C</M>. They share the side <M>A C</M>, so
        </p>
        <Eq src={['sin i = [ B C | A C ]', 'sin r = [ A D | A C ]']} />
        <p>
          where <M>i</M> is the angle between the incident front and the mirror (equal to the angle between the incident ray and the normal), and <M>r</M> is the same for the reflected front. Since <M>B C = A D</M>, the two sines are equal:
        </p>
        <Eq src='i = r' />
        <figure className="t-figure">
          <Reflect />
          <figcaption>The beam arrives with bright fronts and leaves with faint ones. The two angles to the normal match. The incident ray, the reflected ray and the normal all lie in one plane.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-refraction">
        <SectionHead n={no('refraction')} title="Refraction and Snell's law" />
        <p>
          Light changes speed when it passes from one medium to another. The ratio of its speed in vacuum to its speed in a medium is the <strong>refractive index</strong> <M>n</M> of the medium:
        </p>
        <Eq src='n = [ c | v ]' />
        <p>Glass has <M>n ≈ 1.5</M>, so light travels at <M>c / 1.5</M> in it, which is two thirds of its speed in air. Now we use Huygens' principle on a front <M>A C</M> that meets the boundary at <M>A</M> first.</p>
        <figure className="t-figure">
          <SnellGeometry />
          <figcaption>While the far end <M>C</M> of the front runs to <M>E</M>, the wavelet from <M>A</M> grows in the slower medium. The line from <M>E</M> touching it is the refracted front.</figcaption>
        </figure>
        <p>
          In the time <M>τ</M> the end <M>C</M> takes to reach the boundary at <M>E</M>, the wavelet from <M>A</M> has spread to <M>A F</M> in the second medium:
        </p>
        <Eq src={['C E = v _1 · τ', 'A F = v _2 · τ']} />
        <p>
          The two right-angled triangles <M>A C E</M> and <M>A F E</M> share the side <M>A E</M>. The angle at <M>A</M> in the first is <M>i</M> and the angle at <M>E</M> in the second is <M>r</M>:
        </p>
        <Eq src={['sin i = [ C E | A E ] = [ v _1 · τ | A E ]', 'sin r = [ A F | A E ] = [ v _2 · τ | A E ]']} />
        <p>Divide one by the other. The common <M>A E</M> and <M>τ</M> cancel:</p>
        <Eq src='[ sin i | sin r ] = [ v _1 | v _2 ]' />
        <p>
          Now put <M>v = c / n</M> for each medium. The <M>c</M> cancels as well, and we reach <strong>Snell's law</strong>:
        </p>
        <Eq src={['[ v _1 | v _2 ] = [ c / n _1 | c / n _2 ] = [ n _2 | n _1 ]', 'n _1 · sin i = n _2 · sin r']} />
        <figure className="t-figure">
          <Refract n1={1} n2={1.5} i={40} />
          <figcaption>Going into glass the fronts crowd together and the beam bends toward the normal. The dot runs along the ray and slows down at the surface.</figcaption>
        </figure>
        <h3 className="t-h3">What stays and what changes</h3>
        <p>
          The <strong>frequency</strong> is set by the source and stays the same across the boundary: the crests arrive at the surface at a certain rate, and they must leave at that same rate. Since <M>v = ν · λ</M>, a slower speed means a <em>shorter wavelength</em>:
        </p>
        <Eq src={['λ _2 = [ v _2 | ν ]', '[ λ _2 | λ _1 ] = [ v _2 | v _1 ] = [ n _1 | n _2 ]']} />
        <p>
          Light of a given colour has a fixed <em>frequency</em>, not a fixed wavelength. When people say "600 nm light" they mean its wavelength in air or vacuum.
        </p>
      </section>

      <section className="t-section" id="t-superposition">
        <SectionHead n={no('superposition')} title="Superposition and coherence" />
        <p>
          When two waves are in the same place, the displacement at each point is just the <strong>sum</strong> of the two separate displacements. This is the <strong>principle of superposition</strong>. If the waves have the same frequency and amplitude <M>A</M>, what the sum looks like depends on the phase difference <M>φ</M> between them.
        </p>
        <figure className="t-figure">
          <WaveSum />
          <figcaption>As the second wave slides, the total swells to <M>2 · A</M> when they match crest to crest, and drops to nothing when crest meets trough.</figcaption>
        </figure>
        <p>
          For a steady pattern of bright and dark places we need the phase difference at each point to stay constant. Sources that keep a fixed phase relation are called <strong>coherent</strong>. Two ordinary lamps are not: each atom in a lamp emits a short burst of light lasting about <M>10 ^−8 "s"</M>, and a new burst starts with a random phase. The phase difference between two lamps jumps around billions of times a second, so the bright and dark places wash out into an even glow.
        </p>
        <figure className="t-figure">
          <Coherence />
          <figcaption>Top: the same phase difference all the time gives a steady amplitude. Bottom: random jumps make the total flicker, and the average is a plain, even brightness.</figcaption>
        </figure>
        <p>
          The way round this is to take two beams from the <em>same</em> source, split in two. Any random jump in the source then happens in both beams together, so their phase difference stays fixed. Young did exactly this with two slits lit by one narrow slit.
        </p>
      </section>

      <section className="t-section" id="t-interference">
        <SectionHead n={no('interference')} title="Constructive and destructive interference" />
        <p>
          Two coherent sources send waves to a point <M>P</M>. The waves started in step, so the phase difference at <M>P</M> comes only from the extra distance one wave has travelled, the <strong>path difference</strong> <M>Δ</M>. One wavelength of extra path is one full cycle, <M>2 · π</M> of phase. So
        </p>
        <Eq src='φ = [ 2 · π | λ ] · Δ' />
        <p>
          The waves add to the biggest possible amplitude when <M>φ</M> is a whole number of cycles, and cancel when it is an odd number of half cycles. In terms of the path difference:
        </p>
        <Eq src={['Δ = n · λ "(bright, constructive)"', 'Δ = ( n + [ 1 | 2 ] ) · λ "(dark, destructive)"']} />
        <p>
          where <M>n = 0 , 1 , 2 , …</M> The figure shows two sources in step. The dots mark where a crest from each source arrives together. They slide outward along straight lines of constructive interference, one line for each value of <M>n</M>.
        </p>
        <figure className="t-figure">
          <TwoSources />
          <figcaption>The central line <M>n = 0</M> is straight ahead, equally far from both sources. The next lines are where one source is one wavelength farther than the other, then two, and so on.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-young">
        <SectionHead n={no('young')} title="Young's double-slit experiment" />
        <p>
          Light from a single narrow slit reaches a screen with two very close slits <M>S _1</M> and <M>S _2</M>, a distance <M>d</M> apart. These two slits act as two coherent sources, since they are lit by the same wavefront. The light spreads (diffracts) out of each slit and overlaps on a distant screen, a distance <M>D</M> away. We find bright and dark stripes called <strong>fringes</strong>.
        </p>
        <figure className="t-figure">
          <PathDifference />
          <figcaption>As <M>P</M> moves, the extra distance <M>Δ</M> of the lower path changes. The screen is bright where <M>Δ</M> is a whole number of wavelengths and dark halfway between.</figcaption>
        </figure>
        <h3 className="t-h3">The path difference</h3>
        <p>
          Put the origin on the screen in line with the midpoint of the slits. Let <M>P</M> be a height <M>y</M> above it. Using Pythagoras for the distances from each slit to <M>P</M>:
        </p>
        <Eq src={['S _2 P ^2 = D ^2 + ( y + [ d | 2 ] ) ^2', 'S _1 P ^2 = D ^2 + ( y − [ d | 2 ] ) ^2']} />
        <p>Subtract. Most terms cancel:</p>
        <Eq src='S _2 P ^2 − S _1 P ^2 = 2 · y · d' />
        <p>
          The left side is <M>( S _2 P − S _1 P ) · ( S _2 P + S _1 P )</M>. For a distant screen, <M>y</M> and <M>d</M> are much smaller than <M>D</M>, so both distances are almost <M>D</M> and the sum is about <M>2 · D</M>:
        </p>
        <Eq src={['Δ · 2 · D ≈ 2 · y · d', 'Δ = S _2 P − S _1 P ≈ [ y · d | D ]']} />
        <h3 className="t-h3">Bright and dark fringes</h3>
        <p>Set this equal to the conditions from the last section. A bright fringe needs <M>Δ = n · λ</M>:</p>
        <Eq src={['[ y _n · d | D ] = n · λ', 'y _n = n · [ λ · D | d ]']} />
        <p>and a dark fringe needs <M>Δ = ( n − ½ ) · λ</M>, with <M>n = 1 , 2 , 3 , …</M>:</p>
        <Eq src='y _n = ( n − [ 1 | 2 ] ) · [ λ · D | d ]' />
        <p>
          The fringes are equally spaced. The distance between two neighbouring bright fringes (or two dark ones) is the <strong>fringe width</strong>:
        </p>
        <Eq src={['β = y _n+1 − y _n', 'β = [ λ · D | d ]']} />
        <p>
          The central fringe (<M>n = 0</M>) is bright, because the path difference is zero there for every colour. It sits exactly opposite the middle of the slits.
        </p>
        <Note label="Check the size">For <M>λ = 600 "nm"</M>, <M>d = 0.5 "mm"</M> and <M>D = 1 "m"</M> the fringe width is 1.2 mm. That is easy to see, which is why the experiment works with ordinary equipment. This also shows that the formulas need <M>d</M> small and <M>D</M> large.</Note>
      </section>

      <section className="t-section" id="t-intensity">
        <SectionHead n={no('intensity')} title="How bright is each fringe?" />
        <p>
          Let each slit alone give a wave of amplitude <M>a</M> at <M>P</M>, so each alone gives intensity <M>I _0</M> (intensity is proportional to amplitude squared). At <M>P</M> the second wave is ahead by the phase <M>φ</M>. Add the two displacements:
        </p>
        <Eq src={['y _1 = a · cos ( ω · t )', 'y _2 = a · cos ( ω · t + φ )']} />
        <p>
          The sum of two cosines gives <M>cos A + cos B = 2 · cos ( [ A + B | 2 ] ) · cos ( [ A − B | 2 ] )</M>, so
        </p>
        <Eq src='y = y _1 + y _2 = 2 · a · cos ( [ φ | 2 ] ) · cos ( ω · t + [ φ | 2 ] )' />
        <p>
          This is a wave of the same frequency with amplitude <M>R = 2 · a · cos ( φ / 2 )</M>. The same result comes from adding two arrows end to end, one for each wave, with an angle <M>φ</M> between them. Squaring the amplitude gives the intensity:
        </p>
        <Eq src={['I = I _0 · ( 2 · cos ( [ φ | 2 ] ) ) ^2', 'I = 4 · I _0 · cos ^2 ( [ φ | 2 ] )']} />
        <figure className="t-figure">
          <Phasor />
          <figcaption>When <M>φ = 0</M> the arrows line up and <M>I = 4 · I _0</M>. When <M>φ = π</M> they point opposite ways and <M>I = 0</M>.</figcaption>
        </figure>
        <p>
          The brightest fringe has <strong>four</strong> times the intensity of one slit, not two. The average over the whole pattern is <M>2 · I _0</M>, which is exactly the energy of the two beams added. So interference does not create or destroy energy. It <em>moves</em> energy from the dark places to the bright ones.
        </p>
      </section>

      <section className="t-section" id="t-changes">
        <SectionHead n={no('changes')} title="What changes the fringes" />
        <p>The fringe width <M>β = λ · D / d</M> tells us what to expect when we change the set-up:</p>
        <ul className="t-list">
          <li>
            <strong>A longer wavelength</strong> (red rather than blue) gives wider fringes, <M>β ∝ λ</M>. With white light every colour makes its own pattern, with the same central bright fringe. This is why the central fringe is white and the next ones have coloured edges, blue closest to the centre.
          </li>
          <li>
            <strong>Slits closer together</strong> give wider fringes, <M>β ∝ 1 / d</M>.
          </li>
          <li>
            <strong>A farther screen</strong> gives wider fringes, <M>β ∝ D</M>.
          </li>
          <li>
            <strong>Immersing everything in a liquid</strong> of index <M>n</M> shrinks the wavelength to <M>λ / n</M>, so the fringes shrink by the same factor.
          </li>
        </ul>
        <figure className="t-figure">
          <Fringes title="Two sets of fringes, one for red light and one for blue light; the blue light has a shorter wavelength so its fringes are closer together" labels={['longer wavelength', 'shorter wavelength']} betas={[96, 56]} />
          <figcaption>The brackets show <M>β</M>. A shorter wavelength squeezes the fringes together; a longer one spreads them out.</figcaption>
        </figure>
        <figure className="t-figure">
          <Fringes title="Two sets of fringes, one with the slits close together and one with the slits wider apart; the wider slit separation gives fringes that are closer together" labels={['small slit separation d', 'larger slit separation d']} betas={[96, 48]} />
          <figcaption>Slits twice as far apart give fringes half as wide.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-diffraction">
        <SectionHead n={no('diffraction')} title="Diffraction at a single slit" />
        <p>
          Light does not travel in a perfectly straight line through a very narrow opening. It <strong>diffracts</strong>: it spreads into the region behind the edges, and the screen shows a wide bright band with weaker bands on either side. The effect is strong when the opening is about as wide as the wavelength, and unnoticeable when it is much wider.
        </p>
        <p>
          Treat every point of the slit as a Huygens source. For a slit of width <M>a</M>, ask in which direction <M>θ</M> the light cancels completely. The trick is to split the slit into two halves. A point in the top half and a point <M>a / 2</M> below it have a path difference of
        </p>
        <Eq src='Δ = [ a | 2 ] · sin θ' />
        <p>
          If this equals half a wavelength, those two cancel. Every point in the top half has a partner in the bottom half, so the whole slit cancels. The condition for the <strong>first minimum</strong> is therefore
        </p>
        <Eq src={['[ a | 2 ] · sin θ = [ λ | 2 ]', 'a · sin θ = λ']} />
        <p>
          Split the slit into four parts instead and the same argument gives a second minimum at <M>a · sin θ = 2 · λ</M>, and so on:
        </p>
        <Eq src='a · sin θ = n · λ "(minima)" ,   n = ± 1 , ± 2 , …' />
        <figure className="t-figure">
          <SlitHalves />
          <figcaption>Each pair of dots oscillates in opposite step at the screen, so the pair cancels. Cover the whole slit with pairs and nothing is left in this direction.</figcaption>
        </figure>
        <p>
          For a screen at distance <M>D</M> the angles are small, so <M>sin θ ≈ y / D</M> and the first minima fall at <M>y = ± λ · D / a</M>. The central bright band is between them, so its width is
        </p>
        <Eq src={['y _1 = [ λ · D | a ]', 'W = 2 · [ λ · D | a ]']} />
        <p>
          The central band is much brighter than the side bands, which are only a few percent as bright. A <em>narrower</em> slit gives a <em>wider</em> pattern, because the cancelling angle <M>θ ≈ λ / a</M> gets bigger as <M>a</M> shrinks.
        </p>
        <figure className="t-figure">
          <SlitPattern />
          <figcaption>As the slit widens, the whole pattern squeezes together. The central maximum is twice as wide as the others.</figcaption>
        </figure>
        <Note label="Not the same as Young's fringes">In the double-slit pattern all bright fringes have the same width <M>λ · D / d</M>. In single-slit diffraction the central band is twice as wide as the rest, and the others fade quickly.</Note>
      </section>

      <section className="t-section" id="t-envelope">
        <SectionHead n={no('envelope')} title="Both together" />
        <p>
          Real slits have a width <M>a</M> as well as a separation <M>d</M>. Each slit diffracts light into a wide band, and the two bands overlap and interfere. The result is the cosine-squared fringes of Young's pattern, <strong>multiplied</strong> by the single-slit diffraction curve, which acts as an envelope:
        </p>
        <Eq src='I ∝ cos ^2 ( [ π · d · y | λ · D ] ) · ( [ sin α | α ] ) ^2 ,   α = [ π · a · y | λ · D ]' />
        <figure className="t-figure">
          <Envelope />
          <figcaption>Many equally spaced fringes sit under the central diffraction band. Where the envelope drops to zero, a fringe that should be there goes missing.</figcaption>
        </figure>
        <p>
          The number of fringes inside the central band follows from comparing the two widths. The central band is <M>2 · λ · D / a</M> wide and each fringe is <M>λ · D / d</M> wide, so about <M>2 · d / a</M> fringes fit in the band.
        </p>
      </section>

      <section className="t-section" id="t-polar">
        <SectionHead n={no('polar')} title="Polarisation" />
        <p>
          Light is a <strong>transverse</strong> wave: the electric field wobbles at right angles to the direction the light moves. Across the beam there are many such directions. Light from a lamp or the Sun has all of them mixed up, and changing at random: it is <strong>unpolarised</strong>.
        </p>
        <p>
          A <strong>polaroid</strong> is a sheet with long molecules lined up in one direction. It absorbs the part of the field along the molecules and lets through only the part across them. This direction is the <strong>pass axis</strong>. What comes out wobbles along one direction only: it is <strong>plane polarised</strong>.
        </p>
        <figure className="t-figure">
          <PolarWave />
          <figcaption>End-on views of the beam. Before the polaroid the field points every which way. After it, the field oscillates along one line, the pass axis.</figcaption>
        </figure>
        <p>
          Polarisation only makes sense for a transverse wave. A longitudinal wave such as sound oscillates along its direction of travel, so there is only one direction and nothing to sort. The fact that light can be polarised was the proof that light is transverse.
        </p>
        <p>Unpolarised light has equal amounts of every direction. A polaroid passes an average half of it, whatever the pass axis:</p>
        <Eq src='I _1 = [ I _0 | 2 ]' />
      </section>

      <section className="t-section" id="t-malus">
        <SectionHead n={no('malus')} title="Malus's law" />
        <p>
          Send plane polarised light, with field amplitude <M>E _0</M>, to a second polaroid (the <strong>analyser</strong>) whose pass axis is turned by an angle <M>θ</M> from the light's direction of polarisation. Only the component of the field along the pass axis gets through:
        </p>
        <Eq src='E = E _0 · cos θ' />
        <p>The intensity is proportional to the square of the amplitude, so</p>
        <Eq src='I = I _0 · cos ^2 θ' />
        <p>
          This is <strong>Malus's law</strong>. At <M>θ = 0</M> everything passes, at <M>θ = 90°</M> (crossed polaroids) nothing does, and at <M>θ = 45°</M> half passes. Put the two steps together for unpolarised light through two polaroids:
        </p>
        <Eq src='I = [ I _0 | 2 ] · cos ^2 θ' />
        <figure className="t-figure">
          <Malus />
          <figcaption>The short arrow is the part of <M>E _0</M> along the analyser axis. As the analyser turns, the dot on the curve shows the intensity that gets through.</figcaption>
        </figure>
        <Note label="Three polaroids">Two crossed polaroids block all the light. Slip a third one between them at 45° and some light comes through: it is <M>I _0 / 2 · cos ^2 45° · cos ^2 45° = I _0 / 8</M>. A polaroid does not just filter, it rotates the direction of polarisation to its own axis.</Note>
      </section>

      <section className="t-section" id="t-brewster">
        <SectionHead n={no('brewster')} title="Polarisation by reflection" />
        <p>
          Light reflected from glass or water is partly polarised, with the field mostly along the surface. That is the glare that polarised sunglasses remove. At one special angle of incidence, the <strong>Brewster angle</strong> <M>i _B</M>, the reflected light is <em>completely</em> polarised.
        </p>
        <p>
          This happens when the reflected ray and the refracted ray are at right angles. The atoms of the glass oscillate along the refracted ray's field direction, and they cannot radiate along their own line of oscillation, so no component along the page can be sent along the reflected ray. The geometry gives:
        </p>
        <Eq src={['i _B + r = 90°', 'r = 90° − i _B']} />
        <p>Put this into Snell's law, with air (index 1) above and a medium of index <M>n</M> below:</p>
        <Eq src={['n = [ sin i _B | sin r ] = [ sin i _B | sin ( 90° − i _B ) ] = [ sin i _B | cos i _B ]', 'tan i _B = n']} />
        <figure className="t-figure">
          <Brewster />
          <figcaption>The bar for light polarised in the plane of the page falls to zero at <M>i _B</M>. The other bar does not, so the reflected light is purely polarised across the plane.</figcaption>
        </figure>
        <p>For glass of index 1.5 this is <M>i _B = tan ^−1 1.5 = 56.3°</M>, and for water it is about <M>53°</M>.</p>
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
                  ['Wave speed', 'v = ν · λ'],
                  ['Refractive index', 'n = [ c | v ]'],
                  ['Reflection', 'i = r'],
                  ["Snell's law", 'n _1 · sin i = n _2 · sin r'],
                  ['Wavelength in a medium', 'λ _n = [ λ | n ]'],
                  ['Phase and path difference', 'φ = [ 2 · π | λ ] · Δ'],
                  ['Bright fringe condition', 'Δ = n · λ'],
                  ['Dark fringe condition', 'Δ = ( n + [ 1 | 2 ] ) · λ'],
                  ['Young: bright fringe position', 'y _n = n · [ λ · D | d ]'],
                  ['Fringe width', 'β = [ λ · D | d ]'],
                  ['Intensity of fringes', 'I = 4 · I _0 · cos ^2 ( [ φ | 2 ] )'],
                  ['Single slit minima', 'a · sin θ = n · λ'],
                  ['Single slit central width', 'W = 2 · [ λ · D | a ]'],
                  ['Unpolarised through a polaroid', 'I = [ I _0 | 2 ]'],
                  ["Malus's law", 'I = I _0 · cos ^2 θ'],
                  ["Brewster's law", 'tan i _B = n'],
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
                  ['λ', 'Wavelength', 'm'],
                  ['ν', 'Frequency', 'Hz'],
                  ['n', 'Refractive index (or order of a fringe)', ''],
                  ['Δ', 'Path difference', 'm'],
                  ['φ', 'Phase difference', 'rad'],
                  ['d', 'Distance between the two slits', 'm'],
                  ['D', 'Distance from slits to screen', 'm'],
                  ['β', 'Fringe width', 'm'],
                  ['a', 'Width of a single slit', 'm'],
                  ['I', 'Intensity', 'W/m²'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{['m', 'Hz', 'rad'].includes(unit) ? <M>{`"${unit}"`}</M> : unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Light entering glass">
          <p className="ex-q">Light of wavelength 600 nm in air enters glass of refractive index 1.5. Find its speed, wavelength and frequency in the glass.</p>
          <Given items={['λ _air = 600 "nm"', 'n = 1.5', 'c = 3 × 10 ^8 "m/s"']} />
          <ol className="steps">
            <Step title="Frequency (set by the source, from the air values)">
              <Eq src='ν = [ c | λ _air ] = [ 3 × 10 ^8 | 600 × 10 ^−9 ] = 5.0 × 10 ^14 "Hz"' />
            </Step>
            <Step title="Speed in glass">
              <Eq src='v = [ c | n ] = [ 3 × 10 ^8 | 1.5 ] = 2.0 × 10 ^8 "m/s"' />
            </Step>
            <Step title="Wavelength in glass">
              <Eq src={['λ _glass = [ v | ν ] = [ 2.0 × 10 ^8 | 5.0 × 10 ^14 ] = 4.0 × 10 ^−7 "m"', 'λ _glass = [ λ _air | n ] = [ 600 | 1.5 ] = 400 "nm"']} />
            </Step>
          </ol>
          <Answer>2.0 × 10⁸ m/s, 400 nm, and the frequency is unchanged at 5.0 × 10¹⁴ Hz.</Answer>
          <figure className="t-figure">
            <Refract n1={1} n2={1.5} i={0} label="air, n = 1" />
            <figcaption>Straight in, the beam does not bend, but the fronts still crowd together: the wavelength is a third shorter.</figcaption>
          </figure>
        </Example>

        <Example n={2} title="Bending at the surface">
          <p className="ex-q">A ray in air hits glass (<M>n = 1.5</M>) at 30° to the normal. At what angle does it travel in the glass?</p>
          <Given items={['n _1 = 1', 'n _2 = 1.5', 'i = 30°']} />
          <ol className="steps">
            <Step title="Snell's law">
              <Eq src='n _1 · sin i = n _2 · sin r' />
            </Step>
            <Step title="Solve for sin r">
              <Eq src='sin r = [ n _1 · sin i | n _2 ] = [ 1 · 0.500 | 1.5 ] = 0.333' />
            </Step>
            <Step title="The angle">
              <Eq src='r = sin ^−1 0.333 = 19.5°' />
            </Step>
          </ol>
          <Answer>19.5° to the normal. The ray bends toward the normal, because glass is the slower medium.</Answer>
          <figure className="t-figure">
            <Refract n1={1} n2={1.5} i={30} />
          </figure>
        </Example>

        <Example n={3} title="Fringes in Young's experiment">
          <p className="ex-q">Two slits 0.5 mm apart are lit with light of wavelength 600 nm. The screen is 1.2 m away. Find the fringe width, the position of the third bright fringe, and the position of the second dark fringe, measured from the centre.</p>
          <Given items={['d = 0.5 × 10 ^−3 "m"', 'λ = 600 × 10 ^−9 "m"', 'D = 1.2 "m"']} />
          <ol className="steps">
            <Step title="Fringe width">
              <Eq src='β = [ λ · D | d ] = [ 600 × 10 ^−9 · 1.2 | 0.5 × 10 ^−3 ] = 1.44 × 10 ^−3 "m"' />
            </Step>
            <Step title="Third bright fringe, n = 3">
              <Eq src='y _3 = 3 · β = 3 · 1.44 = 4.32 "mm"' />
            </Step>
            <Step title="Second dark fringe, n = 2">
              <Eq src='y = ( 2 − [ 1 | 2 ] ) · β = 1.5 · 1.44 = 2.16 "mm"' />
            </Step>
          </ol>
          <Answer>The fringe width is 1.44 mm. The third bright fringe is 4.32 mm from the centre, and the second dark fringe is 2.16 mm from it.</Answer>
          <figure className="t-figure">
            <PathDifference />
            <figcaption>The screen is bright where <M>Δ</M> is a whole number of wavelengths, and dark at the half-way points between.</figcaption>
          </figure>
        </Example>

        <Example n={4} title="Measuring a wavelength">
          <p className="ex-q">In a Young's experiment with slits 0.4 mm apart and a screen 1.0 m away, the fifth bright fringe is 7.5 mm from the centre. What is the wavelength?</p>
          <Given items={['d = 0.4 × 10 ^−3 "m"', 'D = 1.0 "m"', 'y _5 = 7.5 × 10 ^−3 "m"', 'n = 5']} />
          <ol className="steps">
            <Step title="Fringe width from the position">
              <Eq src='β = [ y _5 | 5 ] = [ 7.5 | 5 ] = 1.5 "mm"' />
            </Step>
            <Step title="Turn β = λ D / d around">
              <Eq src={['λ = [ β · d | D ]', 'λ = [ 1.5 × 10 ^−3 · 0.4 × 10 ^−3 | 1.0 ] = 6.0 × 10 ^−7 "m"']} />
            </Step>
          </ol>
          <Answer>600 nm, which is orange-red light.</Answer>
          <figure className="t-figure">
            <Fringes title="Fringes at a width of one and a half millimetres, with the width marked" labels={['β = 1.5 mm', 'the same set-up, slits wider apart']} betas={[90, 60]} />
          </figure>
        </Example>

        <Example n={5} title="The whole apparatus in water">
          <p className="ex-q">The set-up of Example 3 is moved under water (<M>n = 4 / 3</M>). What is the new fringe width?</p>
          <Given items={['β _air = 1.44 "mm"', 'n = [ 4 | 3 ]']} />
          <ol className="steps">
            <Step title="Wavelength in water">
              <Eq src='λ ′ = [ λ | n ] = [ 600 | 4 / 3 ] = 450 "nm"' />
            </Step>
            <Step title="New fringe width">
              <Eq src='β ′ = [ λ ′ · D | d ] = [ 450 × 10 ^−9 · 1.2 | 0.5 × 10 ^−3 ] = 1.08 × 10 ^−3 "m"' />
            </Step>
          </ol>
          <Answer>1.08 mm: the fringes shrink by the same factor <M>3 / 4</M> as the wavelength.</Answer>
          <figure className="t-figure">
            <Fringes title="Fringes in air and, below them, the narrower fringes in water" labels={['air: 1.44 mm', 'water: 1.08 mm']} betas={[96, 72]} />
          </figure>
        </Example>

        <Example n={6} title="A single slit">
          <p className="ex-q">Light of wavelength 500 nm falls on a slit 0.2 mm wide. The screen is 2.0 m away. Find the distance from the centre to the first dark fringe, and the width of the central bright band.</p>
          <Given items={['a = 0.2 × 10 ^−3 "m"', 'λ = 500 × 10 ^−9 "m"', 'D = 2.0 "m"']} />
          <ol className="steps">
            <Step title="First minimum">
              <Eq src='y _1 = [ λ · D | a ] = [ 500 × 10 ^−9 · 2.0 | 0.2 × 10 ^−3 ] = 5.0 × 10 ^−3 "m"' />
            </Step>
            <Step title="Central band">
              <Eq src='W = 2 · y _1 = 10 "mm"' />
            </Step>
          </ol>
          <Answer>The first dark fringe is 5.0 mm from the centre, so the bright central band is 10 mm wide (the angle to the first minimum is <M>λ / a = 2.5 × 10 ^−3 "rad"</M>).</Answer>
          <figure className="t-figure">
            <SlitPattern />
          </figure>
        </Example>

        <Example n={7} title="Brightness part of the way between fringes">
          <p className="ex-q">Each slit alone gives an intensity <M>I _0</M>. What is the intensity at a point where the path difference is a quarter of a wavelength?</p>
          <Given items={['Δ = [ λ | 4 ]']} />
          <ol className="steps">
            <Step title="Phase difference">
              <Eq src='φ = [ 2 · π | λ ] · Δ = [ 2 · π | λ ] · [ λ | 4 ] = [ π | 2 ]' />
            </Step>
            <Step title="Intensity">
              <Eq src={['I = 4 · I _0 · cos ^2 ( [ φ | 2 ] ) = 4 · I _0 · cos ^2 ( [ π | 4 ] )', 'I = 4 · I _0 · ( 0.707 ) ^2 = 2 · I _0']} />
            </Step>
          </ol>
          <Answer>2 I₀: exactly half the intensity of the bright fringe, and equal to the average of the whole pattern.</Answer>
          <figure className="t-figure">
            <Phasor />
            <figcaption>At <M>φ = π / 2</M> the two arrows are at a right angle and the resultant is <M>√2</M> times one of them.</figcaption>
          </figure>
        </Example>

        <Example n={8} title="Light through two polaroids">
          <p className="ex-q">Unpolarised light of intensity <M>I _0</M> passes through a polaroid and then a second polaroid whose axis is at 60° to the first. What fraction of <M>I _0</M> comes out?</p>
          <Given items={['θ = 60°']} />
          <ol className="steps">
            <Step title="After the first polaroid">
              <Eq src='I _1 = [ I _0 | 2 ]' />
            </Step>
            <Step title="After the second, using Malus's law">
              <Eq src='I _2 = I _1 · cos ^2 60° = [ I _0 | 2 ] · ( 0.5 ) ^2 = [ I _0 | 8 ]' />
            </Step>
          </ol>
          <Answer>One eighth of the original intensity, 0.125 <M>I _0</M>.</Answer>
          <figure className="t-figure">
            <Malus />
          </figure>
        </Example>

        <Example n={9} title="Glare off glass">
          <p className="ex-q">At what angle of incidence is light reflected from glass (<M>n = 1.5</M>) completely plane polarised, and what is the angle of refraction then?</p>
          <Given items={['n = 1.5']} />
          <ol className="steps">
            <Step title="Brewster's law">
              <Eq src={['tan i _B = n = 1.5', 'i _B = tan ^−1 1.5 = 56.3°']} />
            </Step>
            <Step title="Refraction angle">
              <Eq src='r = 90° − 56.3° = 33.7°' />
            </Step>
            <Step title="Check with Snell's law">
              <Eq src='sin r = [ sin 56.3° | 1.5 ] = [ 0.832 | 1.5 ] = 0.555 ,  r = 33.7°' />
            </Step>
          </ol>
          <Answer>The Brewster angle is 56.3°. The reflected and refracted rays are then at right angles, and the refracted ray is at 33.7°.</Answer>
          <figure className="t-figure">
            <Brewster />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Any two lamps will make fringes" wrong={'two lamps → steady fringes'} fig={<Coherence />}>
            Fringes need a fixed phase difference. Two separate lamps have random phases that change billions of times a second, so the pattern averages to an even glow. Use one source split into two beams, or a laser.
          </Mistake>
          <Mistake title="Wider slit gap, wider fringes" wrong="β ∝ d" fig={<Fringes title="Two sets of fringes; the set with the slits farther apart has narrower fringes" labels={['small d', 'larger d']} betas={[96, 48]} />}>
            It is the other way round. <M>β = λ · D / d</M>, so moving the slits apart makes the fringes narrower.
          </Mistake>
          <Mistake title="Dark fringes destroy energy" wrong={'energy lost at dark fringes'} fig={<Phasor />}>
            The energy is moved, not lost. The bright fringes get <M>4 · I _0</M>, more than the <M>2 · I _0</M> the two beams would give by simple addition, and the dark fringes get zero. The average is <M>2 · I _0</M> exactly.
          </Mistake>
          <Mistake title="The frequency changes in glass" wrong="ν _glass ≠ ν _air" fig={<Refract n1={1} n2={1.5} i={0} label="air, n = 1" height={240} />}>
            The frequency is fixed by the source. The speed and the wavelength both change by the factor <M>n</M>. The colour that your eye sees depends on the frequency, so it stays the same.
          </Mistake>
          <Mistake title="A narrower slit gives a narrower pattern" wrong="W ∝ a" fig={<SlitPattern />}>
            Diffraction is the opposite of what common sense says. The central width is <M>2 · λ · D / a</M>, so squeezing the slit makes the pattern spread out more.
          </Mistake>
          <Mistake title="Unpolarised light follows Malus's law" wrong={'I = I _0 · cos ^2 θ "(unpolarised)"'} fig={<PolarWave />}>
            Malus's law is only for light that is already polarised. Unpolarised light has no single direction to measure the angle from. The first polaroid always passes half of it, whatever way it is turned.
          </Mistake>
          <Mistake title="At Brewster's angle all the light reflects" wrong={'i = i _B → everything reflects'} fig={<Brewster />}>
            At the Brewster angle the reflected light is totally polarised, but it is still weak: only about 15% of the component that can reflect (<M>sin ^2 22.6° = 0.148</M> for glass), and none of the other. Most of the light goes into the glass.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Light is a wave: add the waves up, and light plus light can make darkness.</p>
        <p className="closing-sub">Next: dual nature. The wave picture explains fringes, but light also arrives in lumps. The photoelectric effect shows why both are needed.</p>
      </footer>
    </ChapterShell>
  );
}
