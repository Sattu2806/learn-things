import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Fig } from '../kit/Anim';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { FrameDrop, Overtake, Plane, Projectiles, Rain, River, Ships, TwoCars, VecSub } from './Scenes';

/** Relative velocity: what one observer sees of another's motion, with animated diagrams and worked examples. */

const SECTIONS: NoteSection[] = [
  { id: 'frames', title: 'Frames of reference', group: 'Theory' },
  { id: 'oned', title: 'Relative velocity in a line', group: 'Theory' },
  { id: 'meet', title: 'Catching up and meeting', group: 'Theory' },
  { id: 'twod', title: 'In two dimensions', group: 'Theory' },
  { id: 'river', title: 'A boat in a river', group: 'Theory' },
  { id: 'cross', title: 'Fastest or shortest crossing', group: 'Theory' },
  { id: 'rain', title: 'Rain and the umbrella', group: 'Theory' },
  { id: 'plane', title: 'An aeroplane in a crosswind', group: 'Theory' },
  { id: 'closest', title: 'Closest approach', group: 'Theory' },
  { id: 'proj', title: 'Relative motion of projectiles', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell
      id="relative"
      film={buildFilm}
      sections={SECTIONS}
      sideTitle="Relative velocity"
      sideLead="Motion depends on who is watching: how to switch between observers, and how boats, rain, aeroplanes and ships all come down to one subtraction of vectors."
    >
      <header className="article-head">
        <span className="kicker">Physics · Motion in a plane</span>
        <h1 className="article-title">How fast is it moving? Depends who is asking.</h1>
        <p className="article-lead">
          Sitting in a train, the passenger across the aisle is not moving at all; to someone on the platform, she is doing 100 km/h. Both are right. This chapter shows how to switch between observers, and why one subtraction of vectors solves
          boats, rain, aeroplanes and ships.
        </p>
      </header>

      <section className="t-section" id="t-frames">
        <SectionHead n={no('frames')} title="Frames of reference" />
        <p>
          Every statement about motion needs an observer to measure it from. That observer, together with the axes and the clock they use, is a <strong>frame of reference</strong>. When we say a car does 20 m/s we usually mean{' '}
          <em>relative to the ground</em>, but that is only a habit.
        </p>
        <Fig caption="The ball falls straight down inside the train, yet the ground observer sees it follow a curve. The same motion, described from two frames.">
          <FrameDrop />
        </Fig>
        <p>
          The ball has the same horizontal speed as the train, so relative to the train it only falls. Relative to the ground it also moves forward at the train&apos;s speed, so its path is a parabola. Neither description is wrong. They are two views
          of one event, and the physics is to convert between them.
        </p>
        <Note label="Which frames?">
          We use frames that move at a <em>constant velocity</em> with respect to each other (inertial frames). Newton&apos;s laws hold equally in all of them, so no experiment inside a smoothly moving train can tell you that it is moving. A frame that
          speeds up or turns is a different story, and is not needed here.
        </Note>
      </section>

      <section className="t-section" id="t-oned">
        <SectionHead n={no('oned')} title="Relative velocity in a line" />
        <p>
          Two cars on a straight road have velocities <M>v _A</M> and <M>v _B</M>, both measured from the ground, with one direction chosen as positive. The velocity of A <em>as seen from B</em> is written <M>v _AB</M> and read &ldquo;A relative to
          B&rdquo;:
        </p>
        <Eq src='v _AB = v _A − v _B'>
          <span className="eq-note">velocity of A relative to B: subtract the observer&apos;s own velocity</span>
        </Eq>
        <p>
          Why subtract? Seen from B, everything is shifted by taking away B&apos;s motion. Slide the picture along with car B and car B stands still, and every other velocity drops by <M>v _B</M>.
        </p>
        <Fig caption="Cars going the same way. From the ground A does 18 m/s and B does 10 m/s. From car A the road streams backwards and B slowly falls behind, at 8 m/s.">
          <TwoCars vA={18} vB={10} gap={170} k={3} title="Two cars the same way; the view changes from the ground to car A and car B drifts backwards at the difference of their speeds" />
        </Fig>
        <p>The sign tells you the direction. Going the same way, the speeds subtract. Going opposite ways, one velocity is negative, and subtracting a negative adds:</p>
        <Fig caption="Head-on: A at +15 m/s, B at −12 m/s. From either car the other one comes at 27 m/s.">
          <TwoCars vA={15} vB={-12} gap={450} k={2} title="Two cars driving towards each other; from car A the other car approaches at the sum of the speeds" />
        </Fig>
        <Eq src={['v _AB = 15 − ( −12 ) = 27 "m/s"', 'v _BA = − v _AB']}>
          <span className="eq-note">the other way round, the sign flips: A sees B coming, B sees A coming, in opposite directions</span>
        </Eq>
        <p>
          The velocities add up through a chain of observers: <M>v _AC = v _AB + v _BC</M>. A passenger walking in a train, a train relative to the ground, and so on, simply add up link by link.
        </p>
      </section>

      <section className="t-section" id="t-meet">
        <SectionHead n={no('meet')} title="Catching up and meeting" />
        <p>
          Overtaking questions become easy in the frame of the slower car. There it is parked, and the other car simply closes the gap at the relative speed. The time to catch up or to meet is
        </p>
        <Eq src='t = [ d | v _rel ]'>
          <span className="eq-note">d is the gap to close; the relative speed is the difference of the speeds going the same way, or their sum going opposite ways</span>
        </Eq>
        <Fig caption="Car A is 60 m behind B and 10 m/s faster, so the 60 m gap closes in 6 s. Meanwhile A drives 180 m and B 120 m; the 60 m difference is the gap.">
          <Overtake vA={30} vB={20} gap0={60} after={0} title="In the frame of car B, car A closes a 60 metre gap at 10 metres per second and draws level after 6 seconds" />
        </Fig>
        <p>
          Check by the ground view: A has driven <M>30 · 6 = 180 "m"</M> and B <M>20 · 6 = 120 "m"</M>. A has gained exactly the 60 m it needed. The relative picture and the ground picture always agree, and the relative one is simply less work.
        </p>
      </section>

      <section className="t-section" id="t-twod">
        <SectionHead n={no('twod')} title="In two dimensions" />
        <p>
          The same rule works for vectors. Take the velocity of A and the velocity of B, both measured from the ground, and subtract as vectors:
        </p>
        <Eq src='v _AB = v _A − v _B'>
          <span>all three are vectors; the result is what an observer riding on B sees A do</span>
        </Eq>
        <p>
          Subtracting a vector means adding its opposite. Draw <M>v _A</M>, then from its tip draw <M>−v _B</M> (the same arrow turned round), and the arrow from the start to the end is <M>v _AB</M>.
        </p>
        <Fig caption="A goes east at 3 m/s and B goes north at 4 m/s. From B, ship A moves at 5 m/s, down and to the right. The dashed line from B to A rotates as the gap changes.">
          <VecSub title="Two bodies moving at right angles, and the vector triangle that gives the velocity of A relative to B" />
        </Fig>
        <p>
          Here <M>v _A = 3 î</M> and <M>v _B = 4 ĵ</M> (in m/s), so
        </p>
        <Eq src='v _AB = 3 î − 4 ĵ' />
        <p>
          Read the size from Pythagoras: <M>√[ 3 ^2 + 4 ^2 ] = 5 "m/s"</M>, at <M>tan ^−1 ( [ 4 | 3 ] ) = 53.1°</M> below the east direction. Not 3 − 4 = −1: speeds of motion in different directions do not simply subtract. Vectors do.
        </p>
      </section>

      <section className="t-section" id="t-river">
        <SectionHead n={no('river')} title="A boat in a river" />
        <p>
          A boat in still water goes at <M>v _b</M> in the direction its bow points. But the water is itself moving. The boat&apos;s velocity relative to the ground is the sum of its velocity relative to the water and the water&apos;s velocity relative to the ground:
        </p>
        <Eq src='v _BG = v _BW + v _WG'>
          <span className="eq-note">boat to ground = boat to water + water to ground (the chain rule from before)</span>
        </Eq>
        <p>
          Say the river is <M>w = 100 "m"</M> wide and flows at <M>v _r = 3 "m/s"</M>, and the boat does <M>v _b = 5 "m/s"</M> in still water. If the helmsman points the bow straight at the opposite bank, the two velocities are at right angles:
        </p>
        <Fig caption="Bow straight across. The river carries the boat along at the same time, so the boat lands downstream. Dashed: the straight line the helmsman was aiming along.">
          <River mode="time" title="A boat steered straight across a river is carried downstream by the current and lands 60 metres below its start" />
        </Fig>
        <p>
          The two motions are independent. Across the river the boat moves at <M>v _b</M>, and along the river it moves at <M>v _r</M>, each unaffected by the other. So
        </p>
        <Eq src={['t = [ w | v _b ] = [ 100 | 5 ] = 20 "s"', 'x = v _r · t = 3 · 20 = 60 "m"']} />
        <p>
          This is the <strong>shortest time</strong> possible: the current only moves the boat sideways and cannot slow its progress across. No other bow direction gets over in less than 20 s.
        </p>
      </section>

      <section className="t-section" id="t-cross">
        <SectionHead n={no('cross')} title="Fastest or shortest crossing" />
        <p>
          Suppose we want to land at the point exactly opposite, so that the path on the ground is the <strong>shortest path</strong>. Then the boat must have no downstream motion, so its velocity relative to the water must cancel the current along the river:
        </p>
        <Eq src='v _b · sin θ = v _r'>
          <span>aim upstream by angle θ from the line straight across</span>
        </Eq>
        <p>The boat then crosses at the remaining component, found by Pythagoras on the velocity triangle:</p>
        <Eq src={['sin θ = [ v _r | v _b ] = [ 3 | 5 ] = 0.6 ,  θ = 36.9°', 'v = √[ v _b ^2 − v _r ^2 ] = √[ 25 − 9 ] = 4 "m/s"', 't = [ w | v ] = [ 100 | 4 ] = 25 "s"']} />
        <Fig caption="Left, the boat points straight across and arrives sooner but 60 m downstream. Right, the second boat points 36.9° upstream: its track is straight across but it takes 25 s.">
          <River mode="both" title="Two boats: one pointing straight across lands 60 metres downstream after 20 seconds, the other pointing upstream crosses along a straight line in 25 seconds" />
        </Fig>
        <Note label="Possible only if">
          The upstream tilt needs <M>sin θ = v _r / v _b ≤ 1</M>, so the boat must be faster than the current. If the river is faster than the boat, the boat cannot go straight across at all: whatever it does, it ends up downstream. It then lands as near as possible by choosing the angle with <M>cos θ = v _b / v _r</M> measured from the downstream direction.
        </Note>
        <p>
          So there are two different questions, with two different answers: the <em>quickest</em> crossing points straight across (20 s, drifting 60 m), while the <em>shortest path</em> points upstream (25 s, no drift).
        </p>
      </section>

      <section className="t-section" id="t-rain">
        <SectionHead n={no('rain')} title="Rain and the umbrella" />
        <p>
          Rain falls straight down at <M>v _r</M> when the wind is still. Standing, you hold the umbrella upright. Start walking at <M>v _p</M> and the rain no longer seems to fall straight down: relative to you it also comes <em>towards</em> you at <M>v _p</M>.
        </p>
        <Eq src='v _RP = v _R − v _P'>
          <span className="eq-note">the rain R relative to the person P: the rain&apos;s own velocity minus yours</span>
        </Eq>
        <Fig caption="Standing, the drops fall vertically. As the walker speeds up the drops slant towards her, and the umbrella has to tilt forward to keep them off.">
          <Rain title="Rain falling straight down appears slanted to a person who starts walking, and the umbrella tilts forward by the angle of the rain" />
        </Fig>
        <p>
          Seen by the walker the rain has a vertical part <M>v _r</M> and a horizontal part <M>v _p</M>, so it comes in at an angle <M>θ</M> to the vertical:
        </p>
        <Eq src={['tan θ = [ v _p | v _r ]', 'v _rel = √[ v _p ^2 + v _r ^2 ]']}>
          <span>The faster you walk, the more the umbrella must tilt forward (towards the direction you are going). The rain also arrives faster.</span>
        </Eq>
        <p>
          This can also be run backwards. Suppose a person walking at 1.5 m/s sees the rain come at 30° to the vertical. Then <M>tan 30° = 1.5 / v _r</M>, so <M>v _r = 1.5 / tan 30° = 2.60 "m/s"</M>. From a slant you can learn the true speed of the rain.
        </p>
      </section>

      <section className="t-section" id="t-plane">
        <SectionHead n={no('plane')} title="An aeroplane in a crosswind" />
        <p>
          A plane flies through air, and the air is itself moving over the ground. This is the boat in the river again, with the same equation:
        </p>
        <Eq src='v _PG = v _PA + v _AG'>
          <span className="eq-note">plane to ground = plane to air (airspeed along the heading) + air to ground (the wind)</span>
        </Eq>
        <p>
          The <strong>heading</strong> is where the nose points; the <strong>track</strong> is where the plane actually goes over the ground. With a crosswind they differ. Fly the nose straight at the destination and the wind blows you sideways off course:
        </p>
        <Fig caption="Airspeed 200 km/h pointing north, wind 50 km/h towards the east. The ground track tilts 14.0° east of north: after 500 km the plane is 125 km off target.">
          <Plane mode="drift" title="A plane heading due north in a wind blowing east follows a track leaning east and misses the target" />
        </Fig>
        <Eq src={['tan δ = [ v _w | v _a ] = [ 50 | 200 ]', 'v _g = √[ v _a ^2 + v _w ^2 ] = 206 "km/h"']}>
          <span>δ is the angle between heading and track.</span>
        </Eq>
        <p>
          To fly straight north, the pilot has to point the nose upwind so that the sideways component of airspeed cancels the wind: <M>v _a · sin α = v _w</M>. The ground speed is then smaller than the airspeed.
        </p>
        <Fig caption="Nose pointed 14.5° into the wind: the track is due north. The velocity triangle closes up, and the ground speed falls to 194 km/h.">
          <Plane mode="correct" title="The same plane with its nose turned 14.5 degrees into the wind now flies exactly north along the line to the target" />
        </Fig>
        <Eq src={['sin α = [ v _w | v _a ] = [ 50 | 200 ] ,  α = 14.5°', 'v _g = √[ v _a ^2 − v _w ^2 ] = 194 "km/h"']} />
      </section>

      <section className="t-section" id="t-closest">
        <SectionHead n={no('closest')} title="Closest approach" />
        <p>
          Two ships sail on steady courses. Will they collide, and if not, how near do they come? Switch to the frame of ship A. A is at rest, and B moves in a <em>straight line</em> with the constant velocity <M>v _BA</M>. The closest approach is simply the shortest distance from A to that line.
        </p>
        <Fig caption="A sails east at 15 km/h, B sails south at 20 km/h and starts 40 km east and 30 km north of A. In A's frame B moves along a straight line; the closest distance is the perpendicular from A to it.">
          <Ships title="Two ships seen from the sea and then from ship A, where the second ship moves along a straight line and the closest approach is the perpendicular from A to that line" />
        </Fig>
        <p>
          Let <M>r _0</M> be the starting separation. In A&apos;s frame, B starts <M>r _0</M> away and moves along its straight line. If <M>α</M> is the angle between that line and the direction from B back to A, then
        </p>
        <Eq src={['d _min = r _0 · sin α', 't = [ r _0 · cos α | v _rel ]']}>
          <span>where the relative speed is the size of the velocity of B relative to A</span>
        </Eq>
        <p>
          At the moment of closest approach the relative velocity is at right angles to the line joining the ships. If <M>α = 0</M> then B is heading straight for A: <M>d _min = 0</M> and they collide. That gives the test for collision: the line joining the two ships must keep the same direction, because in A&apos;s frame B then comes directly at A.
        </p>
      </section>

      <section className="t-section" id="t-proj">
        <SectionHead n={no('proj')} title="Relative motion of projectiles" />
        <p>
          Two projectiles launched together feel the same acceleration <M>g</M> downwards. Their relative acceleration is <M>g − g = 0</M>. With no relative acceleration, the relative velocity is <em>constant</em>:
        </p>
        <Eq src={['v _AB = u _A − u _B', 'r _AB = r _0 + ( u _A − u _B ) · t']}>
          <span>the first is a vector equation from their launch velocities, and the second is the straight-line path of A as seen from B</span>
        </Eq>
        <Fig caption="Two balls thrown from the same point. Gravity bends both paths, but seen from ball B the other ball moves in a straight line at a steady speed (the downward parts of the two velocities cancel).">
          <Projectiles uA={[10, 8]} uB={[4, 14]} scale={8} tEnd={2} title="Two projectiles launched from the same point; from the frame of one, the other moves in a straight line" />
        </Fig>
        <p>
          That is why a ball thrown on the deck of a free-falling lift looks as if it moves in a straight line to someone in the lift: both fall together. The classic <em>monkey and hunter</em> puzzle works for the same reason. The bullet and the falling monkey both fall by <M>½ · g · t ^2</M>, so in the monkey&apos;s frame the bullet travels in a straight line towards him, and will hit.
        </p>
        <Note label="Link">
          The motion of one projectile on its own is covered in the projectile motion chapter. Here we use only the fact that gravity is the same for both, so it drops out of every relative quantity.
        </Note>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Relative velocity', 'v _AB = v _A − v _B'],
                  ['Reversed', 'v _BA = − v _AB'],
                  ['Chain of observers', 'v _AC = v _AB + v _BC'],
                  ['Same direction', 'v _rel = v _1 − v _2'],
                  ['Opposite directions', 'v _rel = v _1 + v _2'],
                  ['Time to catch up or meet', 't = [ d | v _rel ]'],
                  ['Boat velocity', 'v _BG = v _BW + v _WG'],
                  ['Shortest time', 't = [ w | v _b ]'],
                  ['Drift downstream', 'x = v _r · t'],
                  ['Shortest path: angle', 'sin θ = [ v _r | v _b ]'],
                  ['Shortest path: speed', 'v = √[ v _b ^2 − v _r ^2 ]'],
                  ['Rain tilt', 'tan θ = [ v _p | v _r ]'],
                  ['Rain speed seen', 'v _rel = √[ v _p ^2 + v _r ^2 ]'],
                  ['Plane drift angle', 'tan δ = [ v _w | v _a ]'],
                  ['Plane correction', 'sin α = [ v _w | v _a ]'],
                  ['Ground speed on a due track', 'v _g = √[ v _a ^2 − v _w ^2 ]'],
                  ['Closest distance', 'd _min = r _0 · sin α'],
                  ['Time of closest approach', 't = [ r _0 · cos α | v _rel ]'],
                  ['Projectiles', 'v _AB = u _A − u _B'],
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
                  ['v _AB', 'Velocity of A relative to B (as B sees A)', 'm/s'],
                  ['v _BW', 'Boat velocity relative to the water', 'm/s'],
                  ['v _WG', 'Water velocity relative to the ground', 'm/s'],
                  ['v _b', 'Speed of the boat in still water', 'm/s'],
                  ['v _r', 'Speed of the river, or of the rain', 'm/s'],
                  ['w', 'Width of the river', 'm'],
                  ['v _p', 'Speed of the person', 'm/s'],
                  ['v _a', 'Airspeed of the plane', 'km/h'],
                  ['v _w', 'Speed of the wind', 'km/h'],
                  ['r _0', 'Starting separation of two bodies', 'm'],
                  ['u _A', 'Launch velocity of projectile A', 'm/s'],
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

        <Example n={1} title="Overtaking on a highway">
          <p className="ex-q">
            Car A drives at 25 m/s and comes up behind a car B doing 20 m/s, 40 m behind it. To overtake safely A must end up 20 m in front of B. Treat the cars as points. How long does this take and how far does A drive? A truck is also coming the other way at 20 m/s, 900 m ahead of A when the overtake begins. Is it safe?
          </p>
          <Given items={['v _A = 25 "m/s"', 'v _B = 20 "m/s"', 'gap = 40 "m"', 'clear = 20 "m"']} />
          <ol className="steps">
            <Step title="Relative velocity of A with respect to B">
              <Eq src='v _AB = 25 − 20 = 5 "m/s"' />
            </Step>
            <Step title="Distance A must gain on B">
              <Eq src='d = 40 + 20 = 60 "m"' />
            </Step>
            <Step title="Time">
              <Eq src='t = [ d | v _AB ] = [ 60 | 5 ] = 12 "s"' />
            </Step>
            <Step title="Distance A drives">
              <Eq src={['s _A = 25 · 12 = 300 "m"', 's _B = 20 · 12 = 240 "m"']} />
            </Step>
            <Step title="The oncoming truck">
              <p>The truck closes on A at the sum of the speeds, 25 + 20 = 45 m/s. In 12 s the gap shrinks by</p>
              <Eq src='45 · 12 = 540 "m" < 900 "m"' />
            </Step>
          </ol>
          <Answer>12 s, during which A drives 300 m. The truck is still 360 m away when A finishes the overtake, so it is safe, but not by a huge margin.</Answer>
          <Fig>
            <Overtake vA={25} vB={20} gap0={40} after={20} title="In the frame of the slower car, the faster car closes a 40 metre gap and gets 20 metres in front after 12 seconds" />
          </Fig>
        </Example>

        <Example n={2} title="Crossing a river, two ways">
          <p className="ex-q">
            A river 100 m wide flows at 3 m/s. A boat does 5 m/s in still water. (a) Pointing straight across, how long does the crossing take and how far downstream does it land? (b) At what angle must it point to land directly opposite, and how long does that take?
          </p>
          <Given items={['w = 100 "m"', 'v _r = 3 "m/s"', 'v _b = 5 "m/s"']} />
          <ol className="steps">
            <Step title="(a) Time with the bow straight across">
              <Eq src='t = [ w | v _b ] = [ 100 | 5 ] = 20 "s"' />
            </Step>
            <Step title="(a) The drift">
              <Eq src='x = v _r · t = 3 · 20 = 60 "m"' />
            </Step>
            <Step title="(b) The angle upstream">
              <Eq src='sin θ = [ v _r | v _b ] = [ 3 | 5 ] = 0.6 ,  θ = 36.9°' />
            </Step>
            <Step title="(b) The speed across, and the time">
              <Eq src={['v = √[ 5 ^2 − 3 ^2 ] = 4 "m/s"', 't = [ 100 | 4 ] = 25 "s"']} />
            </Step>
          </ol>
          <Answer>
            (a) 20 s, landing 60 m downstream; the shortest possible time. (b) Point 36.9° upstream of the straight-across line: it takes 25 s and lands directly opposite, with the shortest path of 100 m.
          </Answer>
          <Fig>
            <River mode="both" title="The boat pointing straight across arrives in 20 seconds 60 metres downstream; the boat pointing 36.9 degrees upstream arrives opposite in 25 seconds" />
          </Fig>
        </Example>

        <Example n={3} title="A cyclist in the rain">
          <p className="ex-q">Rain falls vertically at 6 m/s. A cyclist rides at 8 m/s. At what angle to the vertical should she tilt her umbrella, and how fast does the rain seem to come?</p>
          <Given items={['v _r = 6 "m/s"', 'v _p = 8 "m/s"']} />
          <ol className="steps">
            <Step title="Rain relative to the cyclist">
              <p>It has a downward part 6 m/s and a part 8 m/s towards her, at right angles.</p>
            </Step>
            <Step title="The angle from the vertical">
              <Eq src='tan θ = [ v _p | v _r ] = [ 8 | 6 ] = 1.33 ,  θ = 53.1°' />
            </Step>
            <Step title="The speed of the rain">
              <Eq src='v _rel = √[ 6 ^2 + 8 ^2 ] = 10 "m/s"' />
            </Step>
          </ol>
          <Answer>Tilt the umbrella 53.1° from the vertical, forward in the direction she is riding. To her, the rain comes at 10 m/s, a speed it never had from the ground.</Answer>
          <Fig>
            <Rain vr={6} w={8} title="Rain falling at 6 metres per second seen by a cyclist at 8 metres per second: the umbrella tilts 53.1 degrees forward" />
          </Fig>
        </Example>

        <Example n={4} title="Flying due north in a crosswind">
          <p className="ex-q">
            A plane flies at 200 km/h in still air. The wind blows towards the east at 50 km/h. The pilot wants to fly due north to a town 500 km away. In which direction should the nose point, and how long will the flight take? What would happen if the pilot just pointed the nose north?
          </p>
          <Given items={['v _a = 200 "km/h"', 'v _w = 50 "km/h"', 'd = 500 "km"']} />
          <ol className="steps">
            <Step title="Cancel the wind sideways">
              <Eq src='sin α = [ v _w | v _a ] = [ 50 | 200 ] = 0.25 ,  α = 14.5°' />
              <p>The nose points 14.5° west of north, into the wind.</p>
            </Step>
            <Step title="Ground speed">
              <Eq src='v _g = √[ 200 ^2 − 50 ^2 ] = 194 "km/h"' />
            </Step>
            <Step title="Time">
              <Eq src='t = [ 500 | 194 ] = 2.58 "h"' />
              <p>That is about 2 h 35 min.</p>
            </Step>
            <Step title="If the nose pointed north">
              <p>The plane would track 14.0° east of north (tan δ = 0.25), reach the town&apos;s latitude after 500 / 200 = 2.5 h, and be</p>
              <Eq src='50 · 2.5 = 125 "km" east of the town' />
            </Step>
          </ol>
          <Answer>Point the nose 14.5° west of north. The flight takes 2.58 h at a ground speed of 194 km/h. Pointing the nose straight north would miss the town by 125 km.</Answer>
          <Fig>
            <Plane mode="correct" title="A plane with its nose turned 14.5 degrees into a wind of 50 kilometres per hour flies due north" />
          </Fig>
        </Example>

        <Example n={5} title="Will the ships collide?">
          <p className="ex-q">
            Ship A sails east at 15 km/h. Ship B is 40 km east and 30 km north of A, and sails south at 20 km/h. Find the closest distance they come to each other, and when.
          </p>
          <Given items={['v _A = 15 "km/h" east', 'v _B = 20 "km/h" south', 'r _0 = ( 40 , 30 ) "km"']} />
          <ol className="steps">
            <Step title="B as seen from A">
              <Eq src='v _BA = v _B − v _A = ( 0 , −20 ) − ( 15 , 0 ) = ( −15 , −20 ) "km/h"' />
              <Eq src='v _rel = √[ 15 ^2 + 20 ^2 ] = 25 "km/h"' />
            </Step>
            <Step title="The geometry in A's frame">
              <p>
                The starting separation is <M>r _0 = √[ 40 ^2 + 30 ^2 ] = 50 "km"</M>. The direction from B to A is (−0.8, −0.6) and the direction of motion is (−0.6, −0.8), so the angle between them has
              </p>
              <Eq src='cos α = 0.8 · 0.6 + 0.6 · 0.8 = 0.96 ,  sin α = 0.28' />
            </Step>
            <Step title="Closest distance">
              <Eq src='d _min = r _0 · sin α = 50 · 0.28 = 14 "km"' />
            </Step>
            <Step title="When">
              <Eq src='t = [ r _0 · cos α | v _rel ] = [ 50 · 0.96 | 25 ] = 1.92 "h"' />
              <p>Check: after 1.92 h the separation is (40 − 15 · 1.92, 30 − 20 · 1.92) = (11.2, −8.4) km, which is 14 km long.</p>
            </Step>
          </ol>
          <Answer>They do not collide. They come closest after 1.92 h (about 1 h 55 min), at a distance of 14 km.</Answer>
          <Fig>
            <Ships title="Ship A sails east and ship B south; in A's frame B passes at a closest distance of 14 kilometres" />
          </Fig>
        </Example>

        <Example n={6} title="Two stones thrown from a tower">
          <p className="ex-q">
            From the top of a tall tower, stone A is thrown horizontally at 12 m/s and, at the same moment, stone B is thrown at 9 m/s upward and 5 m/s horizontally in the opposite direction. Find the velocity of A relative to B and how far apart the stones are after 2 s, assuming neither has landed.
          </p>
          <Given items={['u _A = ( 12 , 0 ) "m/s"', 'u _B = ( −5 , 9 ) "m/s"', 't = 2 "s"']} />
          <ol className="steps">
            <Step title="Gravity cancels in the difference">
              <p>
                Both have acceleration <M>g</M> downwards, so <M>a _AB = 0</M> and the relative velocity is constant.
              </p>
            </Step>
            <Step title="The relative velocity">
              <Eq src={['v _AB = u _A − u _B = ( 12 − ( −5 ) , 0 − 9 ) = ( 17 , −9 ) "m/s"', 'v _AB = √[ 17 ^2 + 9 ^2 ] = 19.2 "m/s" ,  27.9° below the horizontal']} />
            </Step>
            <Step title="The separation after 2 s">
              <Eq src='r _AB = v _AB · t = ( 34 , −18 ) "m" ,  d = √[ 34 ^2 + 18 ^2 ] = 38.5 "m"' />
            </Step>
            <Step title="Check with the positions">
              <p>
                At t = 2 s, A is at (24, −19.6) and B at (−10, −1.6): the difference is (34, −18) m, the same.
              </p>
            </Step>
          </ol>
          <Answer>A moves relative to B at 19.2 m/s, 27.9° below the horizontal, in a straight line. After 2 s the stones are 38.5 m apart.</Answer>
          <Fig>
            <Projectiles title="Two stones thrown in opposite directions from a tower; from stone B, stone A moves in a straight line at 19.2 metres per second" />
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake
            title="Subtracting speeds at an angle"
            wrong='v _AB = 8 − 6 = 2 "m/s"'
            fig={<VecSub vA={[6, 0]} vB={[0, 8]} sc={12} title="A moves east at 6 m/s and B north at 8 m/s: the relative speed is 10 m/s, not 2" height={260} />}
          >
            Only when the motions are along one line do speeds add or subtract. In general subtract the <em>vectors</em> and find the size with Pythagoras: here <M>√[ 6 ^2 + 8 ^2 ] = 10 "m/s"</M>.
          </Mistake>
          <Mistake
            title="Aiming straight across to land opposite"
            wrong='"aim straight across" → "land opposite"'
            fig={<River mode="time" vb={4} vw={3} height={260} title="A boat pointed straight across a river is carried 75 metres downstream" />}
          >
            Pointing straight across gives the quickest crossing, but the current carries the boat downstream. To land opposite you must aim upstream so that <M>v _b · sin θ = v _r</M>.
          </Mistake>
          <Mistake
            title="Heading is the track"
            wrong='"heading" = "track"'
            fig={<Plane mode="drift" va={120} vw={60} height={260} dist={300} title="A plane pointing north in an east wind follows a track tilted to the east" />}
          >
            The nose points along the heading, but the plane moves along the vector sum of airspeed and wind. In a crosswind the track is off the heading by <M>tan δ = v _w / v _a</M>.
          </Mistake>
          <Mistake
            title="Upside-down ratio for the umbrella"
            wrong='tan θ = [ v _r | v _p ]'
            fig={<Rain vr={10} w={5} height={250} title="Rain at 10 metres per second and a walker at 5 metres per second: the umbrella tilts 26.6 degrees" />}
          >
            The tilt from the vertical has the walker&apos;s speed on top: <M>tan θ = v _p / v _r</M>. Slow walking in fast rain means a small tilt, and a fast cyclist in light rain tilts the umbrella a lot.
          </Mistake>
          <Mistake
            title="A sees B like B sees A"
            wrong='v _AB = v _BA'
            fig={<TwoCars vA={3} vB={-2} gap={270} k={5.5} frames={['B', 'A']} loop={11.5} height={220} title="From car B, car A comes at 5 metres per second; from car A, car B comes at 5 metres per second the other way" />}
          >
            Relative velocities are opposite: <M>v _BA = − v _AB</M>. The sizes are equal but the directions are reversed, because each observer sees the other come towards them.
          </Mistake>
          <Mistake
            title="Closest when they are level"
            wrong='"closest" = "crossing the same line"'
            fig={<Ships rel height={260} title="In ship A's frame the closest approach is where B is at right angles to its track" />}
          >
            The closest approach is not when one ship crosses the path of the other. It happens when the relative velocity is at right angles to the line joining them, and the perpendicular from A to B&apos;s path gives the distance.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">To see what the other one does, take away what you do yourself.</p>
        <p className="closing-sub">
          Next: <M>{'F = m · a'}</M>. Relative motion gave us velocities; Newton&apos;s laws say what makes them change.
        </p>
      </footer>
    </ChapterShell>
  );
}
