import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Boat, HoleDisc, Hang, Midpoint, Particles, PushApart, RingCM, Seesaw, Shapes, Shell, Spanner, SpringPair, Strips, Symmetry, Topple, Tumble } from './ComScenes';

/** Centre of mass: one point that stands for a whole body or system, with animated diagrams and worked examples. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'One point for the whole body', group: 'Theory' },
  { id: 'two', title: 'Two particles', group: 'Theory' },
  { id: 'many', title: 'Many particles, in a line or a plane', group: 'Theory' },
  { id: 'symmetry', title: 'Symmetry', group: 'Theory' },
  { id: 'continuous', title: 'Continuous bodies', group: 'Theory' },
  { id: 'shapes', title: 'Ring, disc and triangle', group: 'Theory' },
  { id: 'hole', title: 'A body with a part removed', group: 'Theory' },
  { id: 'motion', title: 'Motion of the centre of mass', group: 'Theory' },
  { id: 'thrown', title: 'Forces act as if at the CM', group: 'Theory' },
  { id: 'cg', title: 'Centre of gravity', group: 'Theory' },
  { id: 'balance', title: 'Balancing and toppling', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="com" film={buildFilm} sections={SECTIONS} sideTitle="Centre of mass" sideLead="The one point that moves as if the whole body were squeezed into it: how to find it, why it moves so simply, and when a body balances.">
      <header className="article-head">
        <span className="kicker">Physics · Systems of particles</span>
        <h1 className="article-title">Why does a spinning spanner fly so smoothly?</h1>
        <p className="article-lead">A thrown spanner tumbles wildly, yet one point inside it glides along a clean parabola. This chapter finds that point, for particles and for solid bodies, and shows why it behaves so simply.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="One point for the whole body" />
        <p>
          A real body is made of countless particles, all pulling and pushing each other. Following every one would be hopeless. Luckily there is a single point whose motion is simple: the <strong>centre of mass</strong>, written CM. It is the average position of the
          mass, where each bit counts in proportion to how much mass it has.
        </p>
        <figure className="t-figure">
          <Tumble />
          <figcaption>Nothing pushes this dumbbell from outside. The balls swing round in loops, but the CM moves in a perfectly straight line at constant speed.</figcaption>
        </figure>
        <Note label="In this chapter">First we find the CM, by adding up for particles and integrating for solids. Then we see why its motion obeys Newton's second law so neatly.</Note>
      </section>

      <section className="t-section" id="t-two">
        <SectionHead n={no('two')} title="Two particles" />
        <p>
          Put particles of mass <M>m _1</M> and <M>m _2</M> on a line at positions <M>x _1</M> and <M>x _2</M>. Their centre of mass is the average of the positions, weighted by the masses:
        </p>
        <Eq src='x _cm = [ m _1 · x _1 + m _2 · x _2 | m _1 + m _2 ]' />
        <p>
          The CM always lies on the line between them, and <strong>closer to the heavier one</strong>. It is also the balance point: a light rod carrying the two masses rests level on a pivot placed exactly there. Watch the CM chase the heavier ball as it grows.
        </p>
        <figure className="t-figure">
          <Seesaw title="A seesaw with a fixed 2 kilogram mass on the left and a right mass that grows from 1 to 4 kilograms; the balance point slides toward it" vary />
          <figcaption>The pivot is always at the CM, so the beam stays level while the right mass changes.</figcaption>
        </figure>
        <p>
          If you put the origin on <M>m _1</M> and call the separation <M>d</M>, the formula becomes
        </p>
        <Eq src='x _cm = [ m _2 · d | m _1 + m _2 ]' />
        <p>
          The distances of the CM from the two masses are in the inverse ratio of the masses: <M>m _1 · r _1 = m _2 · r _2</M>. That is the lever rule you may know already.
        </p>
      </section>

      <section className="t-section" id="t-many">
        <SectionHead n={no('many')} title="Many particles, in a line or a plane" />
        <p>
          For any number of particles the rule is the same: multiply each position by its mass, add them up, and divide by the total mass <M>M = Σ m _i</M>. In a plane each coordinate is averaged on its own:
        </p>
        <Eq src={['x _cm = [ Σ m _i · x _i | M ]', 'y _cm = [ Σ m _i · y _i | M ]']}>
          <span className="eq-note">In 3D add the same line for z. Together they say, for the position vector, r _cm = Σ m _i · r _i / M.</span>
        </Eq>
        <figure className="t-figure">
          <Particles title="Three particles of different masses move about in a plane; the centre of mass is their weighted average and its coordinates are marked on the axes" pts={[{ m: 2, x: 1, y: 1 }, { m: 1, x: 2.5, y: 5 }, { m: 3, x: 6, y: 2 }]} move />
          <figcaption>Each particle pulls the CM toward itself, the heavy ones more. The CM stays inside the triangle they make.</figcaption>
        </figure>
        <p>
          The choice of origin does not matter: the CM is a fixed point of the system, and moving the axes only changes the numbers you read off. Pick the origin to make the arithmetic easy, for example on one of the particles.
        </p>
      </section>

      <section className="t-section" id="t-symmetry">
        <SectionHead n={no('symmetry')} title="Symmetry" />
        <p>
          Often you can find the CM without any calculation. If a uniform body has a line of mirror symmetry, every bit on one side is matched by an equal bit on the other, so the CM must lie on that line. With two such lines, the CM is where they cross.
        </p>
        <figure className="t-figure">
          <Symmetry />
          <figcaption>A rectangle, a disc and a ring each have two mirror lines. The CM is at the crossing, which for the ring is in the empty hole.</figcaption>
        </figure>
        <Note label="Good to know">The CM need not be on the body. A ring, a horseshoe or a boomerang have their CM in empty space.</Note>
      </section>

      <section className="t-section" id="t-continuous">
        <SectionHead n={no('continuous')} title="Continuous bodies" />
        <p>
          A solid has far too many particles to add one by one. Cut it into tiny pieces of mass <M>"dm"</M>, treat each as a particle, and replace the sum by an integral:
        </p>
        <Eq src='x _cm = [ 1 | M ] · ∫ x · "dm"' />
        <p>
          For a uniform rod of length <M>L</M> and mass <M>M</M>, the mass per unit length is <M>λ = [ M | L ]</M>. A slice of width <M>"dx"</M> at position <M>x</M> has mass <M>"dm" = λ · "dx"</M>. Add up the slices from <M>x = 0</M> to <M>x = L</M>:
        </p>
        <Eq src={['x _cm = [ 1 | M ] · ∫ x · λ · "dx" = [ λ | M ] · [ L ^2 | 2 ]', 'x _cm = [ L | 2 ]']} />
        <figure className="t-figure">
          <Strips />
          <figcaption>The slice sweeps along the rod while the running total of <M>x · "dm"</M> grows. It ends at <M>L / 2</M>, the middle, as symmetry promised.</figcaption>
        </figure>
        <p>
          The integral earns its keep when the body is not uniform. Suppose the density grows steadily along the rod, <M>λ = k · x</M>. Slices at the heavy end count more, so the CM moves that way:
        </p>
        <Eq src='x _cm = [ ∫ x · k · x · "dx" | ∫ k · x · "dx" ] = [ [ L ^3 | 3 ] | [ L ^2 | 2 ] ] = [ 2 · L | 3 ]' />
        <figure className="t-figure">
          <Strips linear />
          <figcaption>Darker slices are denser. The CM sits at <M>2 · L / 3</M>, past the middle.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-shapes">
        <SectionHead n={no('shapes')} title="Ring, disc and triangle" />
        <p>
          A few shapes come up again and again, and are worth knowing. Their CM lies on the axis of symmetry, so only the height <M>y _cm</M> above the base needs finding.
        </p>
        <p>
          <strong>Semicircular ring</strong> of radius <M>r</M>. Each bit at angle <M>θ</M> is at height <M>r · sin θ</M>, and the bits are spread evenly over <M>θ</M> from 0 to π, so
        </p>
        <Eq src='y _cm = [ 1 | π ] · ∫ r · sin θ · "dθ" = [ 2 · r | π ]' />
        <p>
          <strong>Semicircular disc.</strong> Cut it into thin strips of width <M>2 · √[ r ^2 − y ^2 ]</M> at height <M>y</M>. The integral of <M>y</M> times the strip area gives <M>2 · r ^3 / 3</M>, and the disc has area <M>π · r ^2 / 2</M>:
        </p>
        <Eq src='y _cm = [ [ 2 · r ^3 | 3 ] | [ π · r ^2 | 2 ] ] = [ 4 · r | 3 · π ]' />
        <p>
          <strong>Triangle</strong> of height <M>h</M>. A strip at height <M>y</M> has width proportional to <M>h − y</M>, so
        </p>
        <Eq src='y _cm = [ ∫ y · ( h − y ) · "dy" | ∫ ( h − y ) · "dy" ] = [ [ h ^3 | 6 ] | [ h ^2 | 2 ] ] = [ h | 3 ]' />
        <figure className="t-figure">
          <Shapes />
          <figcaption>The dashed line is the average height of everything added so far. It settles at <M>0.637 · r</M>, <M>0.424 · r</M> and <M>h / 3</M>.</figcaption>
        </figure>
        <Note label="Remember">The triangle's CM, a third of the way up from any side, is where its three medians meet. Other results worth keeping: solid hemisphere <M>3 · r / 8</M>, hollow hemisphere <M>r / 2</M>, solid cone <M>h / 4</M> from the base.</Note>
      </section>

      <section className="t-section" id="t-hole">
        <SectionHead n={no('hole')} title="A body with a part removed" />
        <p>
          To find the CM of a plate with a hole, treat the hole as a body of <strong>negative mass</strong>. Take the full plate (mass <M>M</M>, CM at <M>x _full</M>) and subtract the removed piece (mass <M>m</M>, CM at <M>x _hole</M>):
        </p>
        <Eq src='x _cm = [ M · x _full − m · x _hole | M − m ]' />
        <p>
          The CM moves <em>away</em> from the hole, because that side has lost mass. For a uniform plate the masses are in proportion to the areas, so you can use areas in place of masses.
        </p>
        <figure className="t-figure">
          <HoleDisc title="A circular hole grows on the right side of a disc; the centre of mass shifts to the left" />
          <figcaption>As the hole grows, the CM slides to the left, away from the missing material.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-motion">
        <SectionHead n={no('motion')} title="Motion of the centre of mass" />
        <p>
          Let each particle move. Averaging the velocities in the same weighted way gives the velocity of the CM, and the total momentum of the system turns out to be as if all the mass moved at that velocity:
        </p>
        <Eq src={['v _cm = [ Σ m _i · v _i | M ]', 'p = M · v _cm']} />
        <p>
          Do the same for accelerations. The forces between the particles come in equal and opposite pairs (Newton's third law) and cancel in the sum, leaving only the <strong>external</strong> forces:
        </p>
        <Eq src='F _ext = M · a _cm' />
        <p>
          This is Newton's second law for the whole system. Internal forces such as springs, muscles, explosions and collisions between parts cannot change the CM's motion. With no external force, <M>a _cm = 0</M> and the CM drifts at a steady velocity, even though the parts may wobble.
        </p>
        <figure className="t-figure">
          <SpringPair />
          <figcaption>The spring pushes and pulls the blocks, but the force on one is the opposite of the force on the other, so the CM keeps its velocity.</figcaption>
        </figure>
        <figure className="t-figure">
          <SpringPair push />
          <figcaption>An external push <M>F</M> on the pair accelerates the CM at <M>a _cm = F / M</M>, however the blocks wobble.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-thrown">
        <SectionHead n={no('thrown')} title="Forces act as if at the CM" />
        <p>
          Since <M>F _ext = M · a _cm</M>, the CM moves exactly as a single particle of mass <M>M</M> would if all the external forces acted on it. For a body thrown through the air the external force is gravity, so the CM follows the same parabola as a thrown stone, whatever the body does about its own centre.
        </p>
        <figure className="t-figure">
          <Spanner />
          <figcaption>The ends of the spanner trace messy loops (faint line). The CM, the dot, follows a clean parabola.</figcaption>
        </figure>
        <p>
          The same idea explains an exploding shell. The explosion is an internal force, so the CM of all the fragments carries on along the original parabola until something external, such as the ground, gets involved.
        </p>
        <figure className="t-figure">
          <Shell title="A shell explodes at the top of its flight into three fragments that spread out, while their centre of mass keeps following the original parabola" frags={[{ m: 1, vx: -60, vy: 50 }, { m: 1, vx: 90, vy: 0 }, { m: 1, vx: -30, vy: -50 }]} />
          <figcaption>The fragments fly off in different directions, but their CM stays on the dashed parabola until the first one hits the ground.</figcaption>
        </figure>
        <Note label="Why it works">When the shell explodes, the fragments gain momentum in all directions, but the total change is zero: the extra momenta of the pieces add up to nothing, so the CM has no reason to change course.</Note>
      </section>

      <section className="t-section" id="t-cg">
        <SectionHead n={no('cg')} title="Centre of gravity" />
        <p>
          The <strong>centre of gravity</strong> is the point where the total weight of a body acts, the point about which the gravitational torques cancel. If gravity is the same on every part, as it is for any body we can hold in our hands, the centre of gravity and the centre of mass are at the same place.
        </p>
        <p>
          They differ only for huge bodies, where <M>g</M> changes noticeably from top to bottom (the centre of gravity is then slightly lower). This also gives a trick for finding the CM of a flat odd-shaped plate: hang it from a hole, wait until it stops, and draw the vertical line below the hole. Do it again from another hole, and the lines cross at the CM.
        </p>
        <figure className="t-figure">
          <Hang />
          <figcaption>Hanging from a point, the body settles with its CM directly below the pivot, because that is where its weight produces no torque.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-balance">
        <SectionHead n={no('balance')} title="Balancing and toppling" />
        <p>
          A body rests safely as long as the vertical line through its CM falls <strong>inside its base</strong>. Tilt it a little, and the weight pulls the CM back over the base, so it settles. Tilt it until the CM is over the edge it is pivoting on, and the weight now helps the tilt: it topples.
        </p>
        <figure className="t-figure">
          <Topple title="A box is tilted about its lower edge: a small tilt settles back, a tilt past the critical angle makes it fall over" mode="topple" />
          <figcaption>The dashed vertical through the CM tells the story. Left of the edge, it comes back. Right of the edge, it falls.</figcaption>
        </figure>
        <p>
          For a uniform box of width <M>w</M> and height <M>h</M>, tilting about one bottom edge, the CM is at <M>( w / 2 , h / 2 )</M> from that edge. It is directly above the edge when
        </p>
        <Eq src='tan θ = [ w / 2 | h / 2 ] = [ w | h ]' />
        <p>
          A wide, low body has a large critical angle and is stable. A tall, narrow one has a small angle and topples easily. That is why racing cars are low and wide, and why a bus full of passengers on the top deck feels shakier.
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
                  ['Two particles', 'x _cm = [ m _1 · x _1 + m _2 · x _2 | m _1 + m _2 ]'],
                  ['Many particles', 'x _cm = [ Σ m _i · x _i | M ]'],
                  ['Continuous body', 'x _cm = [ 1 | M ] · ∫ x · "dm"'],
                  ['Uniform rod', 'x _cm = [ L | 2 ]'],
                  ['Semicircular ring', 'y _cm = [ 2 · r | π ]'],
                  ['Semicircular disc', 'y _cm = [ 4 · r | 3 · π ]'],
                  ['Triangle, from the base', 'y _cm = [ h | 3 ]'],
                  ['Part removed', 'x _cm = [ M · x _full − m · x _hole | M − m ]'],
                  ['Velocity of the CM', 'v _cm = [ Σ m _i · v _i | M ]'],
                  ['Momentum', 'p = M · v _cm'],
                  ['Newton for a system', 'F _ext = M · a _cm'],
                  ['Box about to topple', 'tan θ = [ w | h ]'],
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
                  ['m', 'Mass of a particle', 'kg'],
                  ['M', 'Total mass of the system', 'kg'],
                  ['x _cm', 'Position of the centre of mass', 'm'],
                  ['λ', 'Mass per unit length of a rod', 'kg/m'],
                  ['v _cm', 'Velocity of the centre of mass', 'm/s'],
                  ['a _cm', 'Acceleration of the centre of mass', 'm/s²'],
                  ['F _ext', 'Total external force', 'N'],
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

        <Example n={1} title="Two masses on a line">
          <p className="ex-q">A 2 kg mass sits at <M>x = 0</M> and a 3 kg mass at <M>x = 5 "m"</M>. Where is the centre of mass?</p>
          <Given items={['m _1 = 2 "kg" , x _1 = 0', 'm _2 = 3 "kg" , x _2 = 5 "m"']} />
          <ol className="steps">
            <Step title="Weighted average">
              <Eq src='x _cm = [ 2 · 0 + 3 · 5 | 2 + 3 ] = [ 15 | 5 ] = 3 "m"' />
            </Step>
            <Step title="Check">
              <p>The heavier mass is on the right, so the CM should be on its side of the middle (2.5 m). It is, at 3 m, which is 2 m from the 3 kg mass and 3 m from the 2 kg mass: the distances are in the ratio 2 : 3, the inverse of the masses.</p>
            </Step>
          </ol>
          <Answer>The CM is 3 m from the 2 kg mass, between the two and nearer the heavier one.</Answer>
          <figure className="t-figure">
            <Seesaw title="A 2 kilogram and a 3 kilogram mass 5 metres apart; the pivot slides to the balance point at 3 metres" m1={2} m2={3} d={5} />
          </figure>
        </Example>

        <Example n={2} title="Three masses at the corners of a triangle">
          <p className="ex-q">Masses of 2 kg, 3 kg and 1 kg are at <M>( 0 , 0 )</M>, <M>( 6 , 0 )</M> and <M>( 0 , 6 )</M> (in metres). Find the centre of mass.</p>
          <Given items={['2 "kg" at ( 0 , 0 )', '3 "kg" at ( 6 , 0 )', '1 "kg" at ( 0 , 6 )', 'M = 6 "kg"']} />
          <ol className="steps">
            <Step title="x coordinate">
              <Eq src='x _cm = [ 2 · 0 + 3 · 6 + 1 · 0 | 6 ] = [ 18 | 6 ] = 3 "m"' />
            </Step>
            <Step title="y coordinate">
              <Eq src='y _cm = [ 2 · 0 + 3 · 0 + 1 · 6 | 6 ] = [ 6 | 6 ] = 1 "m"' />
            </Step>
          </ol>
          <Answer>The CM is at <M>( 3 , 1 )</M> m. It sits inside the triangle, pulled toward the 3 kg mass.</Answer>
          <figure className="t-figure">
            <Particles title="Masses of 2, 3 and 1 kilograms at three corners; the centre of mass is built up and marked at 3 metres and 1 metre" pts={[{ m: 2, x: 0, y: 0 }, { m: 3, x: 6, y: 0 }, { m: 1, x: 0, y: 6 }]} sc={32} />
          </figure>
        </Example>

        <Example n={3} title="A disc with a hole">
          <p className="ex-q">A uniform disc of radius <M>R</M> has a circular hole of radius <M>R / 2</M> cut out, its centre at <M>R / 2</M> from the centre of the disc. Where is the centre of mass?</p>
          <Given items={['"full disc: mass" M , x = 0', '"hole radius" R / 2 , "centre at" x = R / 2']} />
          <ol className="steps">
            <Step title="Mass of the hole">
              <p>The mass is proportional to the area. The hole has a quarter of the area of the full disc, so its mass is <M>m = M / 4</M>.</p>
            </Step>
            <Step title="Subtract it">
              <Eq src='x _cm = [ M · 0 − ( M / 4 ) · ( R / 2 ) | M − M / 4 ] = [ − M · R / 8 | 3 · M / 4 ]' />
            </Step>
            <Step title="Simplify">
              <Eq src='x _cm = − [ R | 6 ]' />
            </Step>
          </ol>
          <Answer>The CM is <M>R / 6</M> from the centre of the disc, on the side opposite the hole.</Answer>
          <figure className="t-figure">
            <HoleDisc title="A disc with a hole of half the radius, centred half a radius from the middle; the centre of mass is one sixth of a radius to the left of the centre" />
          </figure>
        </Example>

        <Example n={4} title="A person walking on a boat">
          <p className="ex-q">A 60 kg man stands at one end of a 120 kg boat, floating at rest on still water (ignore the drag of the water). He walks 4 m along the boat toward the other end. How far does the boat move?</p>
          <Given items={['m = 60 "kg"', 'M _boat = 120 "kg"', 'walk relative to the boat s = 4 "m"']} />
          <ol className="steps">
            <Step title="No external horizontal force">
              <p>So the CM, which was at rest, stays where it is. Let the boat move back by <M>b</M>, and the man then moves <M>s − b</M> relative to the ground.</p>
            </Step>
            <Step title="Keep the CM fixed">
              <Eq src='60 · ( 4 − b ) = 120 · b' />
            </Step>
            <Step title="Solve">
              <Eq src='240 = 180 · b , b = [ 240 | 180 ] = 1.33 "m"' />
            </Step>
          </ol>
          <Answer>The boat slides back 1.33 m, and the man moves 2.67 m relative to the water. The CM of the man and boat stays put.</Answer>
          <figure className="t-figure">
            <Boat title="A man walks along a boat; the boat slides back while the centre of mass of man and boat stays still" />
          </figure>
        </Example>

        <Example n={5} title="A shell breaks in two">
          <p className="ex-q">A 2 kg shell is fired at 50 m/s at 60° above the horizontal. At the top of its flight it explodes into two equal parts. One part falls straight down. Where do the two parts land?</p>
          <Given items={['u = 50 "m/s" , θ = 60°', 'M = 2 "kg" , "two parts of" 1 "kg"', '"first part:" v = 0']} />
          <ol className="steps">
            <Step title="The shell without the explosion">
              <Eq src={['"range" = [ u ^2 · sin 2 · θ | g ] = [ 2500 · 0.866 | 9.8 ] = 221 "m"', '"top: x" = 110 "m" , H = 95.7 "m" , t = √[ [ 2 · H | g ] ] = 4.42 "s"']} />
            </Step>
            <Step title="Speed at the top">
              <p>The shell moves horizontally at <M>u · cos θ = 25 "m/s"</M>. Momentum is conserved in the explosion:</p>
              <Eq src='2 · 25 = 1 · 0 + 1 · v , v = 50 "m/s"' />
            </Step>
            <Step title="Landing places">
              <p>Both parts start from the same height with no vertical speed, so they fall for the same 4.42 s.</p>
              <Eq src={['x _1 = 110 "m" (straight down)', 'x _2 = 110 + 50 · 4.42 = 331 "m"']} />
            </Step>
            <Step title="Check with the CM">
              <Eq src='x _cm = [ 110 + 331 | 2 ] = 221 "m"' />
            </Step>
          </ol>
          <Answer>One part lands 110 m away, the other 331 m away. Their CM lands at 221 m, exactly where the unexploded shell would have landed.</Answer>
          <figure className="t-figure">
            <Shell title="A shell explodes at the top into two equal pieces; one drops straight down, the other flies on at double speed; their centre of mass stays on the original parabola" frags={[{ m: 1, vx: -70, vy: 0 }, { m: 1, vx: 70, vy: 0 }]} tags={['drops', '2v']} />
          </figure>
        </Example>

        <Example n={6} title="Tipping a box">
          <p className="ex-q">A uniform box 0.4 m wide and 0.6 m tall stands on a rough slope that is slowly tilted. At what angle does it topple?</p>
          <Given items={['w = 0.4 "m"', 'h = 0.6 "m"']} />
          <ol className="steps">
            <Step title="CM above the lower edge">
              <p>The box pivots about its lower bottom edge. It topples when the CM is vertically above that edge, which happens when the slope angle satisfies</p>
              <Eq src='tan θ = [ w / 2 | h / 2 ] = [ 0.2 | 0.3 ] = 0.667' />
            </Step>
            <Step title="Angle">
              <Eq src='θ = 33.7°' />
            </Step>
          </ol>
          <Answer>It topples at 33.7°, provided friction is large enough to stop it sliding first (it needs <M>μ ≥ 0.667</M>).</Answer>
          <figure className="t-figure">
            <Topple title="A box on a plank that is slowly tilted; it falls over when the vertical through its centre of mass passes the lower edge" mode="incline" />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="The CM is always on the body" wrong={'"CM is always inside the material"'} fig={<RingCM />}>
            The CM is an average position, not a bit of material. For a ring, a horseshoe or a hollow shell it is in empty space.
          </Mistake>
          <Mistake title="Taking the midpoint" wrong="x _cm = [ x _1 + x _2 | 2 ]" fig={<Midpoint />}>
            The simple average is only right if the masses are equal. Weight each position by its mass: here the CM is four fifths of the way to the 4 kg ball.
          </Mistake>
          <Mistake title="Internal forces move the CM" wrong={'"a push between the parts moves the CM"'} fig={<PushApart />}>
            Internal forces come in equal and opposite pairs and cancel. Only an external force can change the motion of the CM.
          </Mistake>
          <Mistake title="Moving toward the hole" wrong={'"CM moves toward the hole"'} fig={<HoleDisc title="A small hole grows in a disc; the centre of mass moves away from it" R={62} height={200} />}>
            Take away material and the balance point moves to the side that still has it. Treat the hole as negative mass, and the sign takes care of itself.
          </Mistake>
          <Mistake title="Explosions change the CM path" wrong={'"after the blast the CM is somewhere else"'} fig={<Shell title="A shell explodes in flight; the centre of mass of the fragments still follows the original parabola" frags={[{ m: 1, vx: -70, vy: 0 }, { m: 1, vx: 70, vy: 0 }]} zoom={0.72} height={200} />}>
            An explosion is internal, so the CM carries on exactly as before, until gravity is joined by an outside force such as the ground.
          </Mistake>
          <Mistake title="A tilted body must fall" wrong={'"tilted a little, so it falls"'} fig={<Topple title="A box is tilted a little and comes back, because its centre of mass is still above the base" mode="wobble" />}>
            What matters is whether the vertical line through the CM is still inside the base. A box tilted less than its critical angle settles back on its own.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Squeeze the body into one point, and Newton's second law works for any system.</p>
        <p className="closing-sub">
          Next: with <M>F _ext = M · a _cm</M> in hand, collisions and conservation of momentum become easy to follow.
        </p>
      </footer>
    </ChapterShell>
  );
}
