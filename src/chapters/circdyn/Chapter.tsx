import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Fig } from '../kit/Anim';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Bank, Conical, CutString, DoubleCount, FlatCar, FrictionInward, HumpBridge, NormalBigger, Providers, Crest, RotatingFrames, Rotor, SlackString, TopStack, TopString, TwoSpeeds, VerticalCircle, VmaxGraph } from './Scenes';

/** Forces in circular motion: what actually pulls things round, with animated diagrams and worked examples. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'A name, not a new force', group: 'Theory' },
  { id: 'string', title: 'A ball on a string', group: 'Theory' },
  { id: 'flat', title: 'A car on a flat bend', group: 'Theory' },
  { id: 'bank', title: 'Banked roads', group: 'Theory' },
  { id: 'bankf', title: 'Banking with friction', group: 'Theory' },
  { id: 'conical', title: 'The conical pendulum', group: 'Theory' },
  { id: 'vertical', title: 'Vertical circles', group: 'Theory' },
  { id: 'loops', title: 'Loops and buckets', group: 'Theory' },
  { id: 'bridge', title: 'Over a hump-back bridge', group: 'Theory' },
  { id: 'centrifugal', title: 'The centrifugal pseudo-force', group: 'Theory' },
  { id: 'rotor', title: 'The rotor ride', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];
const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="circdyn" film={buildFilm} sections={SECTIONS} sideTitle="Forces in circular motion" sideLead="What actually pulls things round a circle: strings, friction, banking, gravity and walls, and why nothing needs a special centripetal force.">
      <header className="article-head">
        <span className="kicker">Physics · Dynamics</span>
        <h1 className="article-title">What is the force that keeps things going round?</h1>
        <p className="article-lead">Going round needs an acceleration toward the centre, so it needs a force toward the centre. This chapter finds that force in a dozen real situations, from a ball on a string to a loop-the-loop.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="A name, not a new force" />
        <p>
          The previous chapter showed that going round at speed <M>v</M> on a circle of radius <M>r</M> means an acceleration <M>v ^2 / r</M> toward the centre. Newton's second law says an acceleration needs a net force in the same direction, so
        </p>
        <Eq src='F = m · a = [ m · v ^2 | r ] = m · ω ^2 · r' />
        <p>
          This force is called the <strong>centripetal force</strong>, meaning "centre-seeking". It is <em>not</em> a new kind of force. It is only the name for whatever real force, or sum of real forces, points to the centre: a string's tension, friction, gravity, a normal force from a wall or a track.
        </p>
        <Fig caption="Four different forces doing the same job. Each time the arrow points to the centre.">
          <Providers />
        </Fig>
        <Note label="The rule">Draw the free-body diagram with the real forces only. Then add up their components along the line to the centre and set that sum equal to <M>m · v ^2 / r</M>. Never draw a separate arrow labelled "centripetal force".</Note>
      </section>

      <section className="t-section" id="t-string">
        <SectionHead n={no('string')} title="A ball on a string" />
        <p>
          Whirl a ball on a string on a smooth table. The only horizontal force is the string's tension, and it points to the centre, so
        </p>
        <Eq src='T = [ m · v ^2 | r ]' />
        <p>
          Cut the string and the force is gone. With no net force the ball obeys Newton's first law: it moves in a straight line at constant speed, along the tangent where it was released, not outward.
        </p>
        <Fig caption="The ball leaves along the tangent, in the direction its velocity had.">
          <CutString />
        </Fig>
        <p>
          The pull grows with the square of the speed: twice as fast on the same string needs four times the tension.
        </p>
        <Fig caption="Same string length, double the speed: four times the pull.">
          <TwoSpeeds />
        </Fig>
      </section>

      <section className="t-section" id="t-flat">
        <SectionHead n={no('flat')} title="A car on a flat bend" />
        <p>
          On a level road nothing pushes a car sideways except the tyres' grip. Friction from the road points to the centre of the bend and is the centripetal force. The road also pushes up with <M>N = m · g</M>. Friction has a limit, <M>μ · N</M>, so
        </p>
        <Eq src={['[ m · v ^2 | r ] ≤ μ · m · g', 'v _max = √[ μ · g · r ]']} />
        <p>The mass cancels: a heavy lorry and a small car have the same limit. Wet or icy roads (small <M>μ</M>) and tight bends (small <M>r</M>) lower it.</p>
        <Fig caption="As the car speeds up the friction needed grows as v². At the dashed limit the grip is gone and the car goes straight on.">
          <FlatCar />
        </Fig>
      </section>

      <section className="t-section" id="t-bank">
        <SectionHead n={no('bank')} title="Banked roads" />
        <p>
          Tilt the road so it slopes up toward the outside of the bend. Now the normal force, which is perpendicular to the road, leans toward the centre, and its horizontal part can supply the centripetal force with no friction at all. Resolve it:
        </p>
        <Eq src={['N · cos θ = m · g', 'N · sin θ = [ m · v ^2 | r ]']} />
        <p>Divide the second by the first and the mass and <M>N</M> disappear:</p>
        <Eq src={['tan θ = [ v ^2 | r · g ]', 'v = √[ r · g · tan θ ]']} />
        <Fig caption="The vertical part of N balances the weight; the horizontal part is the centripetal force.">
          <Bank mode="ideal" />
        </Fig>
        <p>Roads are banked for a design speed. Railways do the same, banking the outer rail so the wheel flanges feel no sideways push.</p>
      </section>

      <section className="t-section" id="t-bankf">
        <SectionHead n={no('bankf')} title="Banking with friction" />
        <p>
          At other speeds friction helps. Slower than the design speed the car tends to slide down the slope, so friction acts up the slope. Faster, it tends to slide up and out, so friction acts down the slope. Putting <M>f = μ · N</M> at the two limits gives a range of safe speeds:
        </p>
        <Eq src={['v _max = √[ r · g · [ tan θ + μ | 1 − μ · tan θ ] ]', 'v _min = √[ r · g · [ tan θ − μ | 1 + μ · tan θ ] ]']} />
        <p>
          For <M>r = 100 "m"</M>, <M>θ = 22.2°</M> and <M>μ = 0.3</M> this gives about 28.1 m/s at the top and 9.71 m/s at the bottom. If <M>μ</M> is bigger than <M>tan θ</M> the lower limit is zero: a car can even park on the bank.
        </p>
        <Fig caption="Friction flips from up the slope to down the slope as the speed passes the design speed.">
          <Bank mode="speed" />
        </Fig>
      </section>

      <section className="t-section" id="t-conical">
        <SectionHead n={no('conical')} title="The conical pendulum" />
        <p>
          Swing a bob on a string of length <M>L</M> round in a horizontal circle and the string sweeps out a cone. Two forces act: the weight and the tension. Vertically they balance, horizontally the tension's part supplies the centripetal force, with radius <M>r = L · sin θ</M>:
        </p>
        <Eq src={['T · cos θ = m · g', 'T · sin θ = [ m · v ^2 | r ]', 'tan θ = [ v ^2 | r · g ]']} />
        <Fig caption="The tension is resolved into a vertical part that holds the bob up and a horizontal part that pulls it round.">
          <Conical />
        </Fig>
        <p>
          The time for one turn is <M>2 · π · r / v</M>. Using the equations above it simplifies to
        </p>
        <Eq src='T _period = 2 · π · √[ [ L · cos θ | g ] ]' />
        <p>It depends only on the depth <M>L · cos θ</M> of the bob below the pivot, not on the mass. The tension is always more than the weight: <M>T = m · g / cos θ</M>.</p>
      </section>

      <section className="t-section" id="t-vertical">
        <SectionHead n={no('vertical')} title="Vertical circles" />
        <p>
          In a vertical circle gravity helps and hinders, so the speed and the tension change round the loop. At the bottom the tension pulls up and gravity down; at the top both point to the centre:
        </p>
        <Eq src={['T _bottom − m · g = [ m · v _b ^2 | r ]', 'T _top + m · g = [ m · v _t ^2 | r ]']} />
        <p>Energy is conserved, and the top is a height <M>2 · r</M> above the bottom, so <M>v _b ^2 = v _t ^2 + 4 · g · r</M>.</p>
        <Fig caption="The tension is greatest at the bottom and smallest at the top. The weight never changes.">
          <VerticalCircle />
        </Fig>
        <p>
          The string can only pull. At the top <M>T ≥ 0</M>, so <M>v _t ^2 ≥ g · r</M>, and the least speeds are
        </p>
        <Eq src={['v _t,min = √[ g · r ]', 'v _b,min = √[ 5 · g · r ]']} />
        <p>Slower than that and the tension reaches zero before the top. The string goes slack and the ball falls as a projectile.</p>
        <Fig caption="Not fast enough: the string goes slack and the ball leaves its circle.">
          <SlackString />
        </Fig>
      </section>

      <section className="t-section" id="t-loops">
        <SectionHead n={no('loops')} title="Loops and buckets" />
        <p>
          A roller-coaster car on the inside of a loop is the same problem with the track's normal force <M>N</M> in place of the tension. The car stays on the track as long as <M>N ≥ 0</M>, so at the top it needs <M>v ≥ √[ g · r ]</M>. A thrill ride is designed with <M>N</M> of a few times <M>m · g</M> at the bottom.
        </p>
        <Fig caption="The track pushes harder on the car at the bottom than at the top.">
          <VerticalCircle mode="coaster" c={6} />
        </Fig>
        <p>
          Swing a bucket of water overhead. At the top the water needs <M>m · v ^2 / r</M> downward, and gravity alone supplies <M>m · g</M>. If the bucket goes faster than <M>√[ g · r ]</M> the base pushes down on the water too, and it stays in. Go slower and the bucket drops away from the water, which falls out.
        </p>
        <Fig caption="At the top the base of the bucket pushes down on the water, which is why it does not fall out.">
          <VerticalCircle mode="bucket" c={5} />
        </Fig>
      </section>

      <section className="t-section" id="t-bridge">
        <SectionHead n={no('bridge')} title="Over a hump-back bridge" />
        <p>
          At the top of a hump the centre is below the car. Weight points down, the road pushes up, and the net force down must be <M>m · v ^2 / r</M>:
        </p>
        <Eq src={['m · g − N = [ m · v ^2 | r ]', 'N = m · g − [ m · v ^2 | r ]']} />
        <p>
          The faster the car, the lighter the road's push. It reaches zero at <M>v = √[ g · r ]</M>; faster than that the car cannot follow the curve and leaves the road. That is also why you feel light going over a crest.
        </p>
        <Fig caption="Slow: the road keeps pushing up. Fast: the car cannot bend its path enough and flies off.">
          <HumpBridge />
        </Fig>
      </section>

      <section className="t-section" id="t-centrifugal">
        <SectionHead n={no('centrifugal')} title="The centrifugal pseudo-force" />
        <p>
          In a turning car you feel pushed outward. From the ground the explanation is simple: your body wants to go straight on (Newton's first law) while the car turns, so you move toward the outside of the car until the door pushes you inward. The door's push is the real centripetal force.
        </p>
        <p>
          If you insist on using the turning car or disc as your frame, objects at rest in it need a net force of zero, so you must invent an outward force <M>m · ω ^2 · r</M> to balance the real inward one. This is the <strong>centrifugal force</strong>. It is a pseudo-force: nothing pushes you, it appears only because the frame is accelerating.
        </p>
        <Fig caption="The same ball in two frames. Left: no force after the cut, so a straight line. Right: the disc turns under it, so it seems flung out.">
          <RotatingFrames />
        </Fig>
        <Note label="Choose one frame">In the ground frame use only real forces and <M>F = m · v ^2 / r</M> inward. In the rotating frame add <M>m · ω ^2 · r</M> outward and the net force is zero. Never use both in one diagram.</Note>
      </section>

      <section className="t-section" id="t-rotor">
        <SectionHead n={no('rotor')} title="The rotor ride" />
        <p>
          In a rotor ride you stand against the wall of a drum that spins up, and the floor drops away. The wall pushes you toward the axis: <M>N = m · ω ^2 · r</M>. That is the centripetal force. Vertically, static friction holds you up, <M>f = m · g</M>, and it can do so only if <M>f ≤ μ · N</M>:
        </p>
        <Eq src={['m · g ≤ μ · m · ω ^2 · r', 'ω ≥ √[ [ g | μ · r ] ]']} />
        <Fig caption="Spin up, drop the floor: friction up balances the weight, and the wall's push provides the turning.">
          <Rotor />
        </Fig>
        <p>For <M>μ = 0.4</M> and <M>r = 2.5 "m"</M> that needs <M>ω ≥ 3.13 "rad/s"</M>, about 29.9 rpm, whatever your mass.</p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Centripetal force', 'F = [ m · v ^2 | r ] = m · ω ^2 · r'],
                  ['Flat bend, maximum speed', 'v _max = √[ μ · g · r ]'],
                  ['Banked, no friction', 'tan θ = [ v ^2 | r · g ]'],
                  ['Banked, top of the range', 'v _max = √[ r · g · [ tan θ + μ | 1 − μ · tan θ ] ]'],
                  ['Banked, bottom of the range', 'v _min = √[ r · g · [ tan θ − μ | 1 + μ · tan θ ] ]'],
                  ['Conical pendulum', 'tan θ = [ v ^2 | r · g ]'],
                  ['Conical pendulum, tension', 'T = [ m · g | cos θ ]'],
                  ['Conical pendulum, period', 'T _period = 2 · π · √[ [ L · cos θ | g ] ]'],
                  ['Vertical circle, bottom', 'T = [ m · v ^2 | r ] + m · g'],
                  ['Vertical circle, top', 'T = [ m · v ^2 | r ] − m · g'],
                  ['Least speed at the top', 'v _t = √[ g · r ]'],
                  ['Least speed at the bottom', 'v _b = √[ 5 · g · r ]'],
                  ['Top of a hump-back bridge', 'N = m · g − [ m · v ^2 | r ]'],
                  ['Loses contact at', 'v = √[ g · r ]'],
                  ['Centrifugal pseudo-force', 'F = m · ω ^2 · r'],
                  ['Rotor, least spin', 'ω = √[ [ g | μ · r ] ]'],
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
                  ['m', 'Mass', 'kg'],
                  ['v', 'Speed', 'm/s'],
                  ['r', 'Radius of the circle', 'm'],
                  ['ω', 'Angular velocity', 'rad/s'],
                  ['T', 'Tension in a string', 'N'],
                  ['N', 'Normal force', 'N'],
                  ['f', 'Friction force', 'N'],
                  ['μ', 'Coefficient of friction', 'none'],
                  ['θ', 'Banking angle, or angle of the string', 'degrees'],
                  ['L', 'Length of the string', 'm'],
                  ['g', 'Gravitational field, 9.8', 'm/s²'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{unit === 'none' || unit === 'degrees' ? unit : <M>{`"${unit}"`}</M>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="A ball on a string">
          <p className="ex-q">A 0.2 kg ball goes round on a smooth table at the end of a 0.5 m string at 4 m/s. Find the tension.</p>
          <Given items={['m = 0.2 "kg"', 'r = 0.5 "m"', 'v = 4 "m/s"']} />
          <ol className="steps">
            <Step title="The tension is the centripetal force">
              <Eq src='T = [ m · v ^2 | r ]' />
            </Step>
            <Step title="Put in the numbers">
              <Eq src='T = [ 0.2 · 4 ^2 | 0.5 ] = 6.4 "N"' />
            </Step>
          </ol>
          <Answer>6.4 N. Doubling the speed would make it 25.6 N.</Answer>
          <Fig>
            <TopString />
          </Fig>
        </Example>

        <Example n={2} title="The fastest round a flat bend">
          <p className="ex-q">A flat bend has radius 50 m and the tyres have <M>μ = 0.6</M>. What is the highest speed at which a car can take it?</p>
          <Given items={['r = 50 "m"', 'μ = 0.6']} />
          <ol className="steps">
            <Step title="Friction is the centripetal force, at its limit">
              <Eq src='[ m · v ^2 | r ] = μ · m · g' />
            </Step>
            <Step title="Solve for v">
              <Eq src='v = √[ μ · g · r ] = √[ 0.6 · 9.8 · 50 ] = 17.1 "m/s"' />
            </Step>
          </ol>
          <Answer>17.1 m/s, which is 61.7 km/h. On a wet road with <M>μ = 0.3</M> it drops to 12.1 m/s.</Answer>
          <Fig>
            <VmaxGraph />
          </Fig>
        </Example>

        <Example n={3} title="The ideal banking angle">
          <p className="ex-q">A bend of radius 100 m is to be banked so a car at 20 m/s needs no friction. Find the angle.</p>
          <Given items={['r = 100 "m"', 'v = 20 "m/s"']} />
          <ol className="steps">
            <Step title="Use tan θ = v² / (r g)">
              <Eq src='tan θ = [ v ^2 | r · g ] = [ 20 ^2 | 100 · 9.8 ] = 0.408' />
            </Step>
            <Step title="Take the inverse tangent">
              <Eq src='θ = 22.2°' />
            </Step>
          </ol>
          <Answer>22.2°. The normal force is then <M>m · g / cos θ = 1.08 · m · g</M>.</Answer>
          <Fig>
            <Bank mode="tune" />
          </Fig>
        </Example>

        <Example n={4} title="A conical pendulum">
          <p className="ex-q">A 0.5 kg bob on a 1.0 m string goes round in a horizontal circle with the string at 30° to the vertical. Find the tension, the speed and the period.</p>
          <Given items={['m = 0.5 "kg"', 'L = 1.0 "m"', 'θ = 30°']} />
          <ol className="steps">
            <Step title="Vertical balance gives the tension">
              <Eq src='T = [ m · g | cos θ ] = [ 0.5 · 9.8 | cos 30° ] = 5.66 "N"' />
            </Step>
            <Step title="The radius and the speed">
              <Eq src={['r = L · sin θ = 0.5 "m"', 'v = √[ r · g · tan θ ] = √[ 0.5 · 9.8 · 0.577 ] = 1.68 "m/s"']} />
            </Step>
            <Step title="The period">
              <Eq src='T _period = [ 2 · π · r | v ] = 1.87 "s"' />
              <p>Check: <M>2 · π · √[ [ 1 · cos 30° | 9.8 ] ] = 1.87 "s"</M>.</p>
            </Step>
          </ol>
          <Answer>Tension 5.66 N, speed 1.68 m/s, one turn in 1.87 s.</Answer>
          <Fig>
            <Conical theta={30} />
          </Fig>
        </Example>

        <Example n={5} title="Tension at the top and bottom">
          <p className="ex-q">A 0.2 kg ball on a 0.5 m string goes round a vertical circle with speed 5 m/s at the bottom. Find the tension at the bottom and at the top.</p>
          <Given items={['m = 0.2 "kg"', 'r = 0.5 "m"', 'v _b = 5 "m/s"']} />
          <ol className="steps">
            <Step title="Tension at the bottom">
              <Eq src='T _b = m · ( [ v _b ^2 | r ] + g ) = 0.2 · ( 50 + 9.8 ) = 12.0 "N"' />
            </Step>
            <Step title="Speed at the top, from energy">
              <Eq src='v _t ^2 = v _b ^2 − 4 · g · r = 25 − 19.6 = 5.4 "m²/s²"' />
            </Step>
            <Step title="Tension at the top">
              <Eq src='T _t = m · ( [ v _t ^2 | r ] − g ) = 0.2 · ( 10.8 − 9.8 ) = 0.2 "N"' />
            </Step>
          </ol>
          <Answer>12.0 N at the bottom and 0.20 N at the top. The least speeds are 2.21 m/s at the top and 4.95 m/s at the bottom, so 5 m/s only just makes it.</Answer>
          <Fig>
            <VerticalCircle c={5.1} />
          </Fig>
        </Example>

        <Example n={6} title="Leaving the road on a hump-back bridge">
          <p className="ex-q">A hump-back bridge has a radius of curvature of 10 m at the top. At what speed does a car lose contact with the road?</p>
          <Given items={['r = 10 "m"']} />
          <ol className="steps">
            <Step title="The road's push is zero when contact is lost">
              <Eq src='N = m · g − [ m · v ^2 | r ] = 0' />
            </Step>
            <Step title="Solve for v">
              <Eq src='v = √[ g · r ] = √[ 9.8 · 10 ] = 9.90 "m/s"' />
            </Step>
          </ol>
          <Answer>9.90 m/s, about 35.6 km/h. At 6 m/s the road still pushes with <M>N = 0.63 · m · g</M>.</Answer>
          <Fig>
            <Crest />
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Drawing a centripetal force" wrong="T + F _c = m · v ^2 / r" fig={<DoubleCount />}>
            Centripetal force is the name for the sum of the real forces toward the centre. Draw only the tension, friction, normal force or weight, then set their sum equal to <M>m · v ^2 / r</M>.
          </Mistake>
          <Mistake title="Flying off outward" wrong={'"released ball moves radially outward"'} fig={<CutString compact />}>
            With no force the ball keeps the velocity it had: along the tangent. The outward feeling is inertia.
          </Mistake>
          <Mistake title="Friction opposes the motion" wrong={'f "points backward"'} fig={<FrictionInward />}>
            On a steady turn the friction on the tyres points to the centre. It changes the direction, not the speed.
          </Mistake>
          <Mistake title="N = m · g on a banked road" wrong="N = m · g" fig={<NormalBigger />}>
            The normal force is tilted, so only its vertical part balances the weight: <M>N · cos θ = m · g</M> and <M>N</M> is bigger than <M>m · g</M>.
          </Mistake>
          <Mistake title="Forgetting the weight at the top" wrong="T = m · v ^2 / r" fig={<TopStack />}>
            At the top both the tension and the weight point to the centre, so <M>T + m · g = m · v ^2 / r</M> and <M>T = m · v ^2 / r − m · g</M>.
          </Mistake>
          <Mistake title="Heavier cars leave the bridge sooner" wrong="v _limit depends on m" fig={<HumpBridge pass="fast" compact cars={[[26, 14], [40, 22]]} />}>
            Mass cancels from <M>v = √[ g · r ]</M>. A light and a heavy car leave the road at the same speed and in the same place.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">There is never a special force for going round: just find the real force toward the centre.</p>
        <p className="closing-sub">Next: when the speed is changing and energy comes in, work and energy take over.</p>
      </footer>
    </ChapterShell>
  );
}
