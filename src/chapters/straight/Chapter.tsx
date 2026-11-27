import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Fig } from '../kit/Anim';
import { Mistake, Mistakes } from '../kit/Mistake';
import { CUBIC, CliffScene, JOURNEY, MeetScene, MotionScene, PathScene, RelScene, SIGNS, SecantScene, SignScene, SlopeHeightScene, StopLanes, StopScene, ThrowScene, TrapScene, VtAreaScene, makeProf } from './Scenes';

/** Motion in a straight line: position, velocity, acceleration, graphs, the equations, free fall and stopping distance. */

const SECTIONS: NoteSection[] = [
  { id: 'where', title: 'Where is it?', group: 'Theory' },
  { id: 'velocity', title: 'Speed and velocity', group: 'Theory' },
  { id: 'instant', title: 'Velocity at an instant', group: 'Theory' },
  { id: 'accel', title: 'Acceleration and its sign', group: 'Theory' },
  { id: 'graphs', title: 'Reading the graphs', group: 'Theory' },
  { id: 'area', title: 'Area under the v–t graph', group: 'Theory' },
  { id: 'equations', title: 'The equations of motion', group: 'Theory' },
  { id: 'fall', title: 'Free fall', group: 'Theory' },
  { id: 'stopping', title: 'Stopping distance', group: 'Theory' },
  { id: 'relative', title: 'Relative motion on a line', group: 'Theory' },
  { id: 'calculus', title: 'The calculus view', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

const CAR_FROM_REST = makeProf([{ d: 8, a: 2.5 }]);
const TRAIN = makeProf([{ d: 40, a: -0.5 }], 20);
const MISTAKE_LEFT = makeProf([{ d: 4, a: -2 }]);

export default function Chapter() {
  return (
    <ChapterShell
      id="straight"
      film={buildFilm}
      sections={SECTIONS}
      sideTitle="Motion in a straight line"
      sideLead="Position, velocity and acceleration along a line: how to read their graphs, the three equations that solve most problems, free fall, and how far a car needs to stop."
    >
      <header className="article-head">
        <span className="kicker">Physics · Kinematics</span>
        <h1 className="article-title">How do we describe something moving along a line?</h1>
        <p className="article-lead">
          Before asking why anything moves, physics asks how to say <em>how</em> it moves. This chapter builds the whole language for motion along a straight line: where, how fast, how quickly the speed is changing, and the three equations that connect them.
        </p>
      </header>

      <section className="t-section" id="t-where">
        <SectionHead n={no('where')} title="Where is it?" />
        <p>
          To say where something is on a line, pick a starting point called the <strong>origin</strong>, pick which way is positive, and give a number: the <strong>position</strong> <M>x</M>, in metres. A position can be negative; it just means "on the other side of the origin".
        </p>
        <p>
          When the object moves from <M>x _1</M> to <M>x _2</M>, its <strong>displacement</strong> is the change in position:
        </p>
        <Eq src='Δx = x _2 − x _1' />
        <p>
          Displacement cares only about the start and the finish, and it has a sign. The <strong>distance</strong> is the length of the path actually travelled, always positive, and it keeps growing even when the object turns back.
        </p>
        <Fig caption={<>The runner goes out 8 m and returns to 3 m. The path is 13 m long (distance), but the object is only 3 m from where it began (displacement, <M>+3 "m"</M>).</>}>
          <PathScene title="A runner goes out 8 metres and back to 3 metres; the distance keeps growing while the displacement arrow shrinks" />
        </Fig>
        <Note label="Remember">Displacement can be positive, negative or zero. Distance is never negative and never smaller than the size of the displacement.</Note>
      </section>

      <section className="t-section" id="t-velocity">
        <SectionHead n={no('velocity')} title="Speed and velocity" />
        <p>
          Two questions sound alike but have different answers: "how fast did you go?" and "how quickly did your position change?". The first is <strong>average speed</strong>, built from distance. The second is <strong>average velocity</strong>, built from displacement:
        </p>
        <Eq src={['"average speed" = [ "total distance" | "total time" ]', 'v _avg = [ Δx | Δt ]']} />
        <p>
          Speed is never negative. Velocity has a sign: positive means "toward the positive side". Both are measured in m/s. To change km/h into m/s divide by 3.6, so 72 km/h is 20 m/s.
        </p>
        <p>
          On a graph of position against time, the average velocity between two moments is the <strong>slope of the chord</strong> joining those two points on the curve: the rise <M>Δx</M> divided by the run <M>Δt</M>.
        </p>
        <Fig caption={<>For this motion (<M>x = t ^2</M>) the object moves 11.25 m in 2.5 s, so its average velocity over that stretch is 4.5 m/s.</>}>
          <SecantScene title="A chord on a position-time graph: rise over run is the average velocity" mode="avg" />
        </Fig>
        <p>
          Back to the runner: 13 m in 5.2 s is an average <em>speed</em> of 2.5 m/s, but a displacement of only 3 m gives an average <em>velocity</em> of 0.577 m/s. Walk out and come all the way back, and the average velocity is exactly zero.
        </p>
      </section>

      <section className="t-section" id="t-instant">
        <SectionHead n={no('instant')} title="Velocity at an instant" />
        <p>
          A car's average velocity over an hour tells you little about what the speedometer read at 3:15. For that we need the velocity at one <em>instant</em>. Shrink the time interval: take <M>Δt</M> smaller and smaller, and watch what the chord does.
        </p>
        <Fig caption={<>As the second point slides toward the first, the chord turns into the tangent to the curve. Its slope settles on 5.0 m/s, the instantaneous velocity at <M>t = 2.5 "s"</M>.</>}>
          <SecantScene title="The chord shrinks onto the tangent, and its slope settles on the instantaneous velocity" mode="shrink" />
        </Fig>
        <p>
          The chord becomes the <strong>tangent</strong>: the straight line that just touches the curve at that point. The <strong>instantaneous velocity</strong> is the slope of the tangent, the value that <M>Δx / Δt</M> approaches as <M>Δt</M> goes to zero:
        </p>
        <Eq src='v = [ dx | dt ] = "slope of the tangent to the x–t graph"' />
        <p>
          A steeper tangent means a faster motion; a tangent that slopes downward means a negative velocity; a flat tangent means the object is momentarily still. The size of the instantaneous velocity is the <strong>instantaneous speed</strong>, which is what a speedometer shows.
        </p>
      </section>

      <section className="t-section" id="t-accel">
        <SectionHead n={no('accel')} title="Acceleration and its sign" />
        <p>
          Acceleration says how quickly the velocity changes: the change in velocity divided by the time it took.
        </p>
        <Eq src='a = [ Δv | Δt ] = [ v − u | t ]' />
        <p>
          Here <M>u</M> is the starting (initial) velocity and <M>v</M> the final one. The unit is m/s², which reads "metres per second, every second". An acceleration of 2 m/s² means the velocity grows by 2 m/s each second.
        </p>
        <p>
          Velocity and acceleration both carry signs, and the signs decide what happens. What matters is whether they agree:
        </p>
        <ul className="t-list">
          <li>
            <strong>Same sign</strong> (<M>v</M> and <M>a</M> both positive, or both negative): the speed grows.
          </li>
          <li>
            <strong>Opposite signs</strong>: the speed shrinks. This is <strong>deceleration</strong>, or retardation. It is not a new quantity, just acceleration pointing against the velocity.
          </li>
        </ul>
        <Fig caption={<>One trip, four stages. Watch the two arrows: when they point the same way the car speeds up; when they point opposite ways it slows down. A negative <M>a</M> can speed the car up if the car is going backwards.</>}>
          <MotionScene
            title="A car goes forward and back; its velocity and acceleration arrows show when it speeds up and slows down"
            prof={SIGNS}
            graphs={['v', 'a']}
            range={[0, 20]}
            step={2}
            note={(s) => (s < 3 ? 'v > 0, a > 0: speeding up' : s < 6 ? 'v > 0, a < 0: slowing down' : s < 9 ? 'v < 0, a < 0: speeding up backwards' : 'v < 0, a > 0: slowing down')}
          />
        </Fig>
        <Note label="Check">Zero acceleration does not mean zero velocity. A car cruising at a steady 20 m/s has <M>a = 0</M>.</Note>
      </section>

      <section className="t-section" id="t-graphs">
        <SectionHead n={no('graphs')} title="Reading the graphs" />
        <p>
          Motion in a line is often given as a graph. There are three, and each one is the "slope" of the one before it:
        </p>
        <ul className="t-list">
          <li>
            <strong>x–t</strong> (position against time): its slope is the velocity.
          </li>
          <li>
            <strong>v–t</strong> (velocity against time): its slope is the acceleration.
          </li>
          <li>
            <strong>a–t</strong> (acceleration against time): its height is the acceleration.
          </li>
        </ul>
        <Fig caption="A car speeds up, cruises and brakes. While the car speeds up, the x–t graph bends upward; while it cruises, x–t is a straight slope; while it brakes, x–t flattens out.">
          <MotionScene title="A car speeds up, cruises and brakes while its position, velocity and acceleration graphs draw themselves" prof={JOURNEY} graphs={['x', 'v', 'a']} range={[0, 60]} step={10} />
        </Fig>
        <p>A quick way to read them:</p>
        <ul className="t-list">
          <li>A straight sloping line on x–t means constant velocity; a flat line means at rest; a curve means the velocity is changing.</li>
          <li>On v–t, a flat line is constant velocity (zero acceleration); a sloping straight line is constant acceleration; the line crossing the axis is the moment the object turns round.</li>
          <li>Slope up means positive, slope down means negative, whatever the height of the line.</li>
        </ul>
      </section>

      <section className="t-section" id="t-area">
        <SectionHead n={no('area')} title="Area under the v–t graph" />
        <p>
          The slope of a graph gave us the rate. The <strong>area</strong> under it gives the total. A thin strip of the v–t graph is a width <M>Δt</M> times a height <M>v</M>, which is velocity times time: a small displacement. Adding up all the strips gives
        </p>
        <Eq src='Δx = "area under the v–t graph"' />
        <p>
          Areas above the time axis count as positive and areas below it as negative, so the area gives the <strong>displacement</strong>. To get the <strong>distance</strong>, add every area as a positive number. In the same way, the area under an a–t graph is the change in velocity.
        </p>
        <Fig caption={<>The shaded area under the v–t graph grows as the car moves, and it always matches the car's position: 16 m + 32 m + 8 m = 56 m. Triangle, rectangle, triangle.</>}>
          <MotionScene title="The area under the velocity-time graph fills in as the car travels, matching its position graph" prof={JOURNEY} graphs={['v', 'x']} fillV range={[0, 60]} step={10} />
        </Fig>
        <p>
          For graphs made of straight lines, split the area into rectangles (<M>base · height</M>) and triangles (<M>½ · base · height</M>), or use a trapezoid, and add them up.
        </p>
      </section>

      <section className="t-section" id="t-equations">
        <SectionHead n={no('equations')} title="The equations of motion" />
        <p>
          When the acceleration is <strong>constant</strong>, the v–t graph is a straight line, and everything follows from it. Say the object starts with velocity <M>u</M> and, after time <M>t</M>, has velocity <M>v</M>.
        </p>
        <p>
          <strong>First equation.</strong> The slope of the line is <M>a</M>, so the velocity rises by <M>a · t</M> in time <M>t</M>:
        </p>
        <Eq src='v = u + a · t' />
        <p>
          <strong>Second equation.</strong> The displacement is the area under the line. Split it into a rectangle of height <M>u</M> and a triangle on top, whose height is <M>a · t</M>:
        </p>
        <Fig caption={<>The rectangle <M>u · t</M> plus the triangle <M>½ · a · t ^2</M> make up the whole area, which is the displacement.</>}>
          <TrapScene title="The area under a straight velocity-time line is split into a rectangle and a triangle" />
        </Fig>
        <Eq src='s = u · t + ½ · a · t ^2' />
        <p>
          Using the average height of the trapezoid instead gives a handy form, <M>s = [ u + v | 2 ] · t</M>: the average velocity times the time.
        </p>
        <p>
          <strong>Third equation.</strong> Sometimes time is not given. Take <M>t = ( v − u ) / a</M> from the first equation and put it in <M>s = [ u + v | 2 ] · t</M>:
        </p>
        <Eq src={['s = [ u + v | 2 ] · [ v − u | a ] = [ v ^2 − u ^2 | 2 · a ]', 'v ^2 = u ^2 + 2 · a · s']} />
        <p>
          Here <M>s</M> is the displacement. All three hold only while <M>a</M> is constant and in a straight line. Choose a positive direction first, then write every <M>u</M>, <M>v</M>, <M>a</M> and <M>s</M> with its sign.
        </p>
        <Note label="Which one?">Each equation leaves out one of the five quantities <M>s, u, v, a, t</M>. Write down what you know, spot the unknown and the one quantity you neither know nor want, then pick the equation without it. If <M>a</M> changes during the motion, split the journey into stages and use the equations on each stage.</Note>
      </section>

      <section className="t-section" id="t-fall">
        <SectionHead n={no('fall')} title="Free fall" />
        <p>
          Drop something near the Earth's surface and, if air resistance is small, it speeds up at the same rate whatever its mass: the <strong>acceleration due to gravity</strong>, <M>g ≈ 9.8 "m/s²"</M>, pointing downward. (For quick estimates, <M>g ≈ 10 "m/s²"</M> is often used.) It is just constant acceleration, so the equations above apply, with <M>a = −g</M> if up is positive.
        </p>
        <p>Throw a ball straight up at 14.7 m/s and watch its velocity arrow:</p>
        <Fig caption={<>The velocity arrow shrinks as the ball rises, is zero at the top (at 1.5 s), then flips and grows downward. The acceleration <M>g</M> never changes: on the graph it is the one steady slope.</>}>
          <ThrowScene title="A ball thrown upward: its velocity arrow shrinks, vanishes at the top, flips and grows, while the graph is a straight sloping line" />
        </Fig>
        <p>With up as positive, the equations become</p>
        <Eq src={['v = u − g · t', 'h = u · t − ½ · g · t ^2', 'v ^2 = u ^2 − 2 · g · h']} />
        <p>Three results are worth remembering, and they follow from the symmetry of the motion:</p>
        <ul className="t-list">
          <li>
            <strong>Time to the top:</strong> the velocity is zero there, so <M>t _top = [ u | g ]</M>.
          </li>
          <li>
            <strong>Greatest height:</strong> put <M>v = 0</M> in the third equation: <M>h _max = [ u ^2 | 2 · g ]</M>.
          </li>
          <li>
            <strong>Up and down are mirror images.</strong> The trip down takes as long as the trip up (total <M>2 · u / g</M> when it returns to its starting height), and at any height the speed going down equals the speed going up. The ball lands at <M>u</M>, the speed it left with.
          </li>
        </ul>
        <Note label="At the top">At the highest point the velocity is zero for an instant, but the acceleration is still 9.8 m/s² downward. That is why the ball does not stay there.</Note>
      </section>

      <section className="t-section" id="t-stopping">
        <SectionHead n={no('stopping')} title="Stopping distance" />
        <p>
          A driver who sees danger does not brake at once. The car first travels during the driver's <strong>reaction time</strong> <M>t _r</M> (typically 0.5 to 1 s) at its full speed, and only then begins to slow down. So the stopping distance has two parts:
        </p>
        <Eq src={['d _r = u · t _r', 'd _b = [ u ^2 | 2 · a ]', 'd = d _r + d _b']}>
          <span className="eq-note">reaction distance (steady speed), braking distance (from the third equation with v = 0), total</span>
        </Eq>
        <Fig caption={<>A car at 20 m/s with a 0.75 s reaction time and a braking deceleration of 7 m/s². The filled bar is the reaction distance, 15.0 m; the open bar the braking distance, 28.6 m. Total: 43.6 m.</>}>
          <StopScene title="A car keeps going during the reaction time, then brakes to a stop in front of a wall" />
        </Fig>
        <p>
          The reaction distance grows in proportion to the speed. The braking distance grows with the <em>square</em> of the speed: twice as fast needs four times the braking distance. That is why speed limits near schools matter so much.
        </p>
      </section>

      <section className="t-section" id="t-relative">
        <SectionHead n={no('relative')} title="Relative motion on a line" />
        <p>
          Velocity depends on who is measuring. A passenger sitting in a train is at rest relative to the train and moving at 30 m/s relative to the ground. On a line, the velocity of <M>A</M> relative to <M>B</M> is
        </p>
        <Eq src='v _AB = v _A − v _B' />
        <p>
          with both velocities measured from the ground and signs included. Cars going the same way: subtract the speeds. Cars heading toward each other: one velocity is negative, so the speeds add.
        </p>
        <Fig caption={<>Car A drives at 20 m/s behind car B at 15 m/s. From B's seat, A creeps up at 5 m/s, so a 40 m gap closes in 8 s.</>}>
          <RelScene title="A faster car catches a slower one; the same event seen from the road and from the slower car" />
        </Fig>
        <p>
          Switching to the frame of one object often turns a hard problem into an easy one. In two or three dimensions the same idea works with vectors, which is the subject of the relative-velocity chapter.
        </p>
      </section>

      <section className="t-section" id="t-calculus">
        <SectionHead n={no('calculus')} title="The calculus view" />
        <p>
          "Slope of a graph" is a derivative, and "area under a graph" is an integral. In symbols:
        </p>
        <Eq src={['v = [ dx | dt ]', 'a = [ dv | dt ] = [ d ^2 x | d t ^2 ]']}>
          <span className="eq-note">
            and in reverse, <M>x = ∫ v · dt</M> and <M>v = ∫ a · dt</M>
          </span>
        </Eq>
        <p>
          This is useful when the acceleration is not constant, where the three equations no longer work. For example, if <M>x = [ t ^3 | 6 ]</M> then
        </p>
        <Eq src={['v = [ dx | dt ] = [ t ^2 | 2 ]', 'a = [ dv | dt ] = t']} />
        <Fig caption="Each graph is the slope of the one before it. The dashed tangent on x–t has the slope v; the dashed tangent on v–t has the slope a.">
          <MotionScene
            title="Position, velocity and acceleration for a motion whose acceleration grows, with tangents showing each is the slope of the previous graph"
            prof={CUBIC}
            graphs={['x', 'v', 'a']}
            range={[0, 40]}
            step={10}
            vScale={2}
            aScale={6}
            tangents
          />
        </Fig>
        <p>
          Check the constant-acceleration equations: integrating <M>a</M> once gives <M>v = u + a · t</M>, and integrating that gives <M>s = u · t + ½ · a · t ^2</M>. Nothing new, just the same area argument done exactly.
        </p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Displacement', 'Δx = x _2 − x _1'],
                  ['Average speed', '[ "total distance" | "total time" ]'],
                  ['Average velocity', 'v _avg = [ Δx | Δt ]'],
                  ['Instantaneous velocity', 'v = [ dx | dt ]'],
                  ['Acceleration', 'a = [ Δv | Δt ] ,  a = [ dv | dt ]'],
                  ['Velocity', 'v = u + a · t'],
                  ['Displacement, constant a', 's = u · t + ½ · a · t ^2'],
                  ['No time', 'v ^2 = u ^2 + 2 · a · s'],
                  ['Average velocity form', 's = [ u + v | 2 ] · t'],
                  ['Free fall, up positive', 'a = − g ,  g = 9.8 "m/s²"'],
                  ['Time to the top', 't _top = [ u | g ]'],
                  ['Greatest height', 'h _max = [ u ^2 | 2 · g ]'],
                  ['Reaction distance', 'd _r = u · t _r'],
                  ['Braking distance', 'd _b = [ u ^2 | 2 · a ]'],
                  ['Relative velocity', 'v _AB = v _A − v _B'],
                  ['km/h to m/s', '"m/s" = [ "km/h" | 3.6 ]'],
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
        <h3 className="t-h3">Reading graphs</h3>
        <div className="t-table-wrap">
          <table className="t-table t-symbols">
            <thead>
              <tr>
                <th scope="col">Graph</th>
                <th scope="col">Slope gives</th>
                <th scope="col">Area gives</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">x–t</th>
                <td>velocity</td>
                <td>nothing useful</td>
              </tr>
              <tr>
                <th scope="row">v–t</th>
                <td>acceleration</td>
                <td>displacement</td>
              </tr>
              <tr>
                <th scope="row">a–t</th>
                <td>jerk (rarely needed)</td>
                <td>change in velocity</td>
              </tr>
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
                  ['x', 'Position', 'm'],
                  ['s', 'Displacement', 'm'],
                  ['u', 'Initial velocity', 'm/s'],
                  ['v', 'Velocity (final, or at any instant)', 'm/s'],
                  ['a', 'Acceleration (constant in the equations)', 'm/s²'],
                  ['t', 'Time', 's'],
                  ['g', 'Acceleration due to gravity', 'm/s²'],
                  ['t _r', 'Reaction time', 's'],
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

        <Example n={1} title="A car accelerating from rest">
          <p className="ex-q">A car starts from rest and accelerates steadily at 2.5 m/s² for 8 s. Find its final speed (in m/s and km/h), the distance covered, and its average speed.</p>
          <Given items={['u = 0', 'a = 2.5 "m/s²"', 't = 8 "s"']} />
          <ol className="steps">
            <Step title="Final speed">
              <Eq src='v = u + a · t = 0 + 2.5 · 8 = 20 "m/s"' />
              <p>Multiply by 3.6 for km/h: 72 km/h.</p>
            </Step>
            <Step title="Distance">
              <Eq src='s = u · t + ½ · a · t ^2 = ½ · 2.5 · 8 ^2 = 80 "m"' />
            </Step>
            <Step title="Average speed">
              <Eq src='[ s | t ] = [ 80 | 8 ] = 10 "m/s"' />
              <p>It is exactly half the final speed, as it must be when starting from rest with constant acceleration.</p>
            </Step>
            <Step title="Check with the no-time equation">
              <Eq src='v ^2 = 2 · a · s = 2 · 2.5 · 80 = 400 ,  v = 20 "m/s"' />
            </Step>
          </ol>
          <Answer>20 m/s (72 km/h) after covering 80 m, at an average speed of 10 m/s.</Answer>
          <Fig>
            <MotionScene title="A car accelerating from rest for 8 seconds, with its velocity and position graphs" prof={CAR_FROM_REST} graphs={['v', 'x']} fillV range={[0, 100]} step={10} />
          </Fig>
        </Example>

        <Example n={2} title="A train braking to a stop">
          <p className="ex-q">A train travelling at 72 km/h applies its brakes and stops in 400 m. Assuming steady braking, find the deceleration and the time it takes to stop.</p>
          <Given items={['u = 72 "km/h" = 20 "m/s"', 'v = 0', 's = 400 "m"']} />
          <ol className="steps">
            <Step title="Acceleration from the no-time equation">
              <Eq src='v ^2 = u ^2 + 2 · a · s' />
              <Eq src='0 = 20 ^2 + 2 · a · 400 ,  a = − [ 400 | 800 ] = −0.5 "m/s²"' />
              <p>The minus sign is the deceleration: it points against the motion.</p>
            </Step>
            <Step title="Time from the first equation">
              <Eq src='t = [ v − u | a ] = [ 0 − 20 | −0.5 ] = 40 "s"' />
            </Step>
            <Step title="Check with the average velocity">
              <Eq src='s = [ u + v | 2 ] · t = 10 · 40 = 400 "m"' />
            </Step>
          </ol>
          <Answer>Deceleration 0.5 m/s² (<M>a = −0.5 "m/s²"</M>), taking 40 s. Trains need long, gentle stops.</Answer>
          <Fig caption="Shown five times faster than real life. The shaded triangle under the v–t graph is the 400 m.">
            <MotionScene title="A train braking from 20 metres per second to rest over 400 metres" prof={TRAIN} graphs={['v', 'x']} fillV rate={5} range={[0, 400]} step={50} vScale={2.5} aScale={60} note={() => 'shown 5 times faster'} />
          </Fig>
        </Example>

        <Example n={3} title="A ball thrown up from a cliff">
          <p className="ex-q">Standing on the edge of a 40 m cliff, you throw a ball straight up at 15 m/s. How high above the cliff does it rise, when does it hit the ground below, and how fast is it going then? (Take <M>g = 9.8 "m/s²"</M>.)</p>
          <Given items={['u = +15 "m/s"', 'a = −9.8 "m/s²"', 'y _ground = −40 "m"']} />
          <ol className="steps">
            <Step title="Greatest height (up positive, origin at the cliff top)">
              <Eq src='h _max = [ u ^2 | 2 · g ] = [ 225 | 19.6 ] = 11.5 "m"' />
              <p>It reaches the top after <M>u / g = 15 / 9.8 = 1.53 "s"</M>.</p>
            </Step>
            <Step title="Time to reach the ground">
              <p>The ground is 40 m below the start, so the displacement is −40 m:</p>
              <Eq src={['−40 = 15 · t − 4.9 · t ^2', '4.9 · t ^2 − 15 · t − 40 = 0']} />
              <Eq src='t = [ 15 + √[ 15 ^2 + 4 · 4.9 · 40 ] | 2 · 4.9 ] = [ 15 + 31.8 | 9.8 ] = 4.77 "s"' />
              <p>The other root of the quadratic is negative, so it is not a real time here.</p>
            </Step>
            <Step title="Speed on landing">
              <Eq src='v = u − g · t = 15 − 9.8 · 4.77 = −31.8 "m/s"' />
              <p>The check uses no time at all: <M>v ^2 = 15 ^2 + 2 · 9.8 · 40 = 1009</M>, so <M>v = 31.8 "m/s"</M> downward.</p>
            </Step>
          </ol>
          <Answer>It rises 11.5 m above the cliff (at 1.53 s), lands after 4.77 s, and hits the ground at 31.8 m/s downward. On the way down it passes the cliff edge at 15 m/s, the same speed it left with.</Answer>
          <Fig>
            <CliffScene title="A ball thrown up from a 40 metre cliff, with its height plotted against time" />
          </Fig>
        </Example>

        <Example n={4} title="Reading displacement from a v–t graph">
          <p className="ex-q">An object's velocity changes as in the graph: it speeds up from 0 to 10 m/s in 2 s, holds 10 m/s until 5 s, then slows steadily to −4 m/s at 7 s. Find its displacement and the distance it travelled in the 7 s.</p>
          <Given items={['v = 0 → 10 "m/s" on 0 – 2 "s"', 'v = 10 "m/s" on 2 – 5 "s"', 'v = 10 → −4 "m/s" on 5 – 7 "s"']} />
          <ol className="steps">
            <Step title="Find where the line crosses zero">
              <p>From 5 s the velocity falls by 14 m/s in 2 s, that is 7 m/s every second. It reaches zero after <M>10 / 7 = 1.43 "s"</M>, at <M>t = 6.43 "s"</M>. The object turns round there.</p>
            </Step>
            <Step title="Area of each piece">
              <Eq src={['0 – 2 "s" :  ½ · 2 · 10 = +10 "m"', '2 – 5 "s" :  3 · 10 = +30 "m"', '5 – 6.43 "s" :  ½ · 1.43 · 10 = +7.14 "m"', '6.43 – 7 "s" :  ½ · 0.571 · 4 = −1.14 "m"']} />
              <p>The last piece lies below the axis, so its area is negative.</p>
            </Step>
            <Step title="Displacement and distance">
              <Eq src={['"displacement" = 10 + 30 + 7.14 − 1.14 = 46.0 "m"', '"distance" = 10 + 30 + 7.14 + 1.14 = 48.3 "m"']} />
            </Step>
          </ol>
          <Answer>A displacement of +46.0 m, and a total distance of 48.3 m. They differ because the last stretch took the object backward by 1.14 m.</Answer>
          <Fig>
            <VtAreaScene title="The areas under a velocity-time graph filled in one by one, positive above the axis and negative below" />
          </Fig>
        </Example>

        <Example n={5} title="Stopping distance at two speeds">
          <p className="ex-q">A driver has a reaction time of 0.8 s, and the car brakes with a deceleration of 6 m/s². Find the total stopping distance at 50 km/h and at 100 km/h.</p>
          <Given items={['t _r = 0.8 "s"', 'a = 6 "m/s²"', 'u _1 = 50 "km/h" = 13.9 "m/s"', 'u _2 = 100 "km/h" = 27.8 "m/s"']} />
          <ol className="steps">
            <Step title="At 50 km/h">
              <Eq src={['d _r = 13.9 · 0.8 = 11.1 "m"', 'd _b = [ 13.9 ^2 | 2 · 6 ] = 16.1 "m"', 'd = 11.1 + 16.1 = 27.2 "m"']} />
            </Step>
            <Step title="At 100 km/h">
              <Eq src={['d _r = 27.8 · 0.8 = 22.2 "m"', 'd _b = [ 27.8 ^2 | 2 · 6 ] = 64.3 "m"', 'd = 22.2 + 64.3 = 86.5 "m"']} />
            </Step>
            <Step title="Compare">
              <p>The speed doubled. The reaction distance doubled (11.1 → 22.2 m), but the braking distance went up four times (16.1 → 64.3 m), so the total grew by a factor of 3.18.</p>
            </Step>
          </ol>
          <Answer>27.2 m at 50 km/h and 86.5 m at 100 km/h. Doubling the speed more than triples the distance needed to stop.</Answer>
          <Fig>
            <StopLanes title="Two cars braking from 50 and 100 kilometres per hour, with their reaction and braking distances" speeds={[13.89, 27.78]} rt={0.8} a={6} />
          </Fig>
        </Example>

        <Example n={6} title="Two runners meeting">
          <p className="ex-q">Two runners are 100 m apart on a straight track. Runner A starts at one end and runs toward B at 6 m/s. At the same moment B starts running toward A at 4 m/s. When and where do they meet?</p>
          <Given items={['x _A0 = 0 ,  v _A = +6 "m/s"', 'x _B0 = 100 "m" ,  v _B = −4 "m/s"']} />
          <ol className="steps">
            <Step title="Choose a direction and write each position">
              <p>Take positive along the track from A's end. B runs back toward the origin, so its velocity is negative.</p>
              <Eq src={['x _A = 6 · t', 'x _B = 100 − 4 · t']} />
            </Step>
            <Step title="They meet when the positions are equal">
              <Eq src='6 · t = 100 − 4 · t ,  10 · t = 100 ,  t = 10 "s"' />
            </Step>
            <Step title="Where">
              <Eq src='x = 6 · 10 = 60 "m"' />
              <p>A ran 60 m and B ran 40 m, which add up to the 100 m gap.</p>
            </Step>
            <Step title="Check with relative velocity">
              <p>They close the gap at <M>6 + 4 = 10 "m/s"</M>, so <M>100 / 10 = 10 "s"</M>.</p>
            </Step>
          </ol>
          <Answer>They meet after 10 s, 60 m from A's end. On the x–t graph it is the point where the two lines cross.</Answer>
          <Fig>
            <MeetScene title="Two runners approach each other; their position-time lines cross where they meet" />
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Distance and displacement are the same" wrong="distance = displacement" fig={<PathScene title="A runner goes out 6 metres and comes back; the distance is 12 metres but the displacement is zero" out={6} end={0} />}>
            Displacement is the net change in position, with a sign. Run out and back to the start and the distance is 12 m, but the displacement is zero.
          </Mistake>
          <Mistake
            title="Negative acceleration means slowing down"
            wrong='a < 0 "so slowing"'
            fig={<MotionScene title="A car moving to the left speeds up with a negative acceleration" prof={MISTAKE_LEFT} graphs={[]} range={[-20, 4]} step={4} height={150} note={() => 'a < 0, but speeding up'} />}
          >
            What matters is whether <M>v</M> and <M>a</M> have the same sign. A car going backward (<M>{'v < 0'}</M>) with <M>{'a < 0'}</M> speeds up. Slowing down means opposite signs.
          </Mistake>
          <Mistake title="Zero velocity means zero acceleration" wrong="v = 0 ,  a = 0" fig={<ThrowScene title="A ball at the top of its flight has zero velocity but still accelerates downward" graph={false} height={200} />}>
            At the top of a throw the velocity is zero for an instant, but it is changing: <M>a = −9.8 "m/s²"</M> all the way. If <M>a</M> were zero there, the ball would hang in the air.
          </Mistake>
          <Mistake title="Double the speed, double the stopping distance" wrong="d _b ∝ u" fig={<StopLanes title="Braking from 10 and from 20 metres per second: the faster car needs four times the distance" speeds={[10, 20]} rt={0} a={5} />}>
            Braking distance is <M>u ^2 / ( 2 · a )</M>, so it goes with the square of the speed. At 10 m/s it is 10 m; at 20 m/s it is 40 m.
          </Mistake>
          <Mistake title="A high point on x–t means fast" wrong='"higher on the graph" = "faster"' fig={<SlopeHeightScene title="One line is high but flat, the other low but steep; the steep one is the faster" />}>
            On an x–t graph the velocity is the slope, not the height. A flat line high up is a parked object; a steep line near the bottom is a quick one.
          </Mistake>
          <Mistake title="Using +g when the ball goes up" wrong="v = u + g · t" fig={<SignScene title="With up as positive the velocity of a thrown ball falls; using plus g makes it wrongly rise" />}>
            If up is positive, gravity points down, so <M>a = −g</M> and <M>v = u − g · t</M>. Pick the positive direction first, then give <M>u</M>, <M>v</M>, <M>a</M> and <M>s</M> their signs.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">The slope gives the rate, the area gives the total.</p>
        <p className="closing-sub">
          Next: motion does not stay on a line. The vectors chapter adds directions, so that the same ideas work in a plane and for relative velocity.
        </p>
      </footer>
    </ChapterShell>
  );
}
