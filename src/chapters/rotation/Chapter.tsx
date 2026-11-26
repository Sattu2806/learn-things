import { ChapterShell } from '../NotesPage';
import type { NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Fig } from '../kit/Anim';
import { Mistake, Mistakes } from '../kit/Mistake';
import {
  CrossFig,
  DiscForce,
  DoorFig,
  EnergyRoll,
  KEShare,
  LadderFig,
  InertiaSlide,
  MistakeAxis,
  MistakeEnergy,
  MistakeEqualRace,
  MistakeInertiaShape,
  MistakeTorque,
  MomentumFig,
  ParallelFig,
  PerpFig,
  RaceFig,
  RodConserve,
  RollingWheel,
  Seesaw,
  ShapesFig,
  Skater,
  StringDisc,
  TransVsRot,
  WorkFig,
} from './Figs';

/** Rotational motion: torque, moment of inertia, angular momentum and rolling. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'Rigid bodies', group: 'Theory' },
  { id: 'torque', title: 'Torque', group: 'Theory' },
  { id: 'cross', title: 'Torque as a cross product', group: 'Theory' },
  { id: 'equilibrium', title: 'Equilibrium', group: 'Theory' },
  { id: 'inertia', title: 'Moment of inertia', group: 'Theory' },
  { id: 'axes', title: 'Moving the axis', group: 'Theory' },
  { id: 'alpha', title: 'Torque and angular acceleration', group: 'Theory' },
  { id: 'energy', title: 'Energy, work and power', group: 'Theory' },
  { id: 'momentum', title: 'Angular momentum', group: 'Theory' },
  { id: 'rolling', title: 'Rolling without slipping', group: 'Theory' },
  { id: 'race', title: 'The race down a slope', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="rotation" sections={SECTIONS} sideTitle="Rotational motion" sideLead="Turning effects, spinning bodies and rolling wheels: torque, moment of inertia and angular momentum, the rotating twins of force, mass and momentum.">
      <header className="article-head">
        <span className="kicker">Physics · Rigid bodies</span>
        <h1 className="article-title">Why does a sphere beat a ring down a slope?</h1>
        <p className="article-lead">Push a door near its hinge and it barely moves; push at the handle and it swings. Spin a skater and she speeds up by pulling in her arms. All of it follows from one idea: what matters is not just how much, but where.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="Rigid bodies" />
        <p>
          A <strong>rigid body</strong> is an object whose parts never move relative to each other: a door, a wheel, a rod, a spinning top. Real things bend a little, but for wheels and rods the idea is close enough. A rigid body can do two kinds of motion, and usually does both.
        </p>
        <ul className="t-list">
          <li>
            <strong>Translation:</strong> every point moves the same way, with the same velocity. One point, the centre of mass, can stand in for the whole body.
          </li>
          <li>
            <strong>Rotation:</strong> every point goes round the same axis, with the same <M>ω</M>. A point at distance <M>r</M> from the axis moves at <M>v = ω · r</M>.
          </li>
        </ul>
        <Fig caption="Left: a sliding bar, where every arrow is the same. Right: a spinning bar, where the arrows grow with the distance from the axis.">
          <TransVsRot />
        </Fig>
        <p>
          The angular velocity <M>ω</M> and angular acceleration <M>α</M> were met in the circular-motion chapter. Here we find what <em>causes</em> them. Forces change translation. For rotation we need the turning version of a force, and the turning version of mass.
        </p>
      </section>

      <section className="t-section" id="t-torque">
        <SectionHead n={no('torque')} title="Torque" />
        <p>
          Try to close a door by pushing it close to the hinge: it is hard. Push at the handle, far from the hinge, and it is easy. The same force does more turning when it acts farther from the axis. The turning effect of a force is its <strong>torque</strong>.
        </p>
        <p>
          Take a force <M>F</M> applied at a point a distance <M>r</M> from the axis, with <M>θ</M> the angle between the line from the axis and the force. Then
        </p>
        <Eq src='τ = r · F · sin θ' />
        <p>
          The unit is the newton metre, <M>"N·m"</M>. (Same units as energy, but a different thing: torque is a turning effect, not an amount of energy.)
        </p>
        <Fig caption="The same 20 N push: near the hinge, at the handle, and at the handle but slanted. The dashed line is the lever arm.">
          <DoorFig cases={[{ d: 0.3, deg: 90 }, { d: 0.9, deg: 90 }, { d: 0.9, deg: 30 }]} />
        </Fig>
        <p>
          There are two ways to read the formula, and they give the same number:
        </p>
        <ul className="t-list">
          <li>
            <M>τ = r · ( F · sin θ )</M>: only the part of the force at right angles to the line from the axis turns the body. A push along the door does nothing.
          </li>
          <li>
            <M>τ = ( r · sin θ ) · F</M>: the <strong>lever arm</strong> <M>d = r · sin θ</M> is the shortest distance from the axis to the line of action of the force. Torque is force times lever arm.
          </li>
        </ul>
        <Note label="Remember">The best push is at right angles (<M>θ = 90°</M>) and as far out as possible. A spanner works because a long handle gives a big lever arm.</Note>
      </section>

      <section className="t-section" id="t-cross">
        <SectionHead n={no('cross')} title="Torque as a cross product" />
        <p>
          Torque has a direction as well as a size, so it is a vector. Written with the position vector <M>r</M> (from the axis to where the force acts) and the force vector <M>F</M>, it is the cross product
        </p>
        <Eq src='τ = r × F' />
        <p>
          The size is <M>r · F · sin θ</M>. The direction is along the axis, at right angles to both <M>r</M> and <M>F</M>, found by the right-hand rule: curl the fingers of your right hand from <M>r</M> toward <M>F</M>, and the thumb points along <M>τ</M>. For a flat picture we simply say <strong>anticlockwise is positive</strong>, with the torque pointing out of the page, and clockwise is negative.
        </p>
        <Fig caption="A force of 10 N at 0.5 m, turned through a full circle. The torque is a sine wave: zero along the line, largest at right angles, and negative when the force flips to the other side.">
          <CrossFig />
        </Fig>
        <p>
          Because <M>sin θ</M> changes sign at <M>180°</M>, pushing the other way round gives the opposite torque. Torques about the same axis simply add, with their signs.
        </p>
      </section>

      <section className="t-section" id="t-equilibrium">
        <SectionHead n={no('equilibrium')} title="Equilibrium" />
        <p>
          A rigid body that is not accelerating, neither moving nor turning faster, is in <strong>equilibrium</strong>. Two things must be true at once:
        </p>
        <Eq src={['Σ F = 0', 'Σ τ = 0']}>
          <span>the forces add to zero (no change of translation), and the torques about any point add to zero (no change of rotation).</span>
        </Eq>
        <p>
          A seesaw shows the second one. The torque of each child about the pivot is weight times distance. The plank balances when the anticlockwise and clockwise torques are equal, so a lighter child must sit farther out.
        </p>
        <Fig caption="A 30 kg child sits 1.5 m from the pivot. A 20 kg child slides outward: the plank levels at 2.25 m, where both torques are 441 N·m.">
          <Seesaw />
        </Fig>
        <Eq src='m _1 · g · d _1 = m _2 · g · d _2' />
        <p>
          You are free to take torques about <em>any</em> point. Pick the one where an unknown force acts, because that force has zero lever arm and drops out. Example 6 does this for a ladder against a wall.
        </p>
      </section>

      <section className="t-section" id="t-inertia">
        <SectionHead n={no('inertia')} title="Moment of inertia" />
        <p>
          A heavy object resists a push: that is mass. A body also resists being <em>spun</em>, and this depends on where the mass is as well as how much. Mass far from the axis is harder to turn. The <strong>moment of inertia</strong> adds up each piece of mass times the square of its distance from the axis:
        </p>
        <Eq src='I = Σ m _i · r _i ^2' />
        <p>
          The unit is <M>"kg·m²"</M>. Because of the square, moving a mass twice as far out makes it four times as hard to spin.
        </p>
        <Fig caption="Two 1 kg masses at the same turning rate. Sliding them outward quadruples and more their moment of inertia (the bar), and the arrows show the speeds growing with r.">
          <InertiaSlide />
        </Fig>
        <p>
          For a continuous body the sum becomes an integral, <M>I = ∫ r ^2 · dm</M>. The results for common shapes, each about the axis shown, are worth knowing:
        </p>
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Shape (mass m)</th>
                <th scope="col">Axis</th>
                <th scope="col">I</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['Thin ring, radius r', 'through the centre, perpendicular to the ring', 'm · r ^2'],
                  ['Solid disc, radius r', 'through the centre, perpendicular to the disc', '½ · m · r ^2'],
                  ['Thin rod, length L', 'through the centre, perpendicular to the rod', '[ 1 | 12 ] · m · L ^2'],
                  ['Thin rod, length L', 'through one end, perpendicular to the rod', '[ 1 | 3 ] · m · L ^2'],
                  ['Solid sphere, radius r', 'through the centre', '⅖ · m · r ^2'],
                ] as const
              ).map(([shape, axis, src]) => (
                <tr key={shape + axis}>
                  <th scope="row">{shape}</th>
                  <td>{axis}</td>
                  <td>
                    <M>{src}</M>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Fig caption="All five spin at the same rate. The ring has all its mass at the rim, so it has the largest I for its mass; the sphere has its mass packed near the axis.">
          <ShapesFig />
        </Fig>
      </section>

      <section className="t-section" id="t-axes">
        <SectionHead n={no('axes')} title="Moving the axis" />
        <p>The moment of inertia depends on the axis chosen. Two theorems let you get a new axis from one you know.</p>
        <p>
          <strong>Parallel axis theorem.</strong> If <M>I _cm</M> is the moment of inertia about an axis through the centre of mass, then about a parallel axis a distance <M>d</M> away
        </p>
        <Eq src='I = I _cm + m · d ^2' />
        <p>
          Check it with a rod: <M>[ 1 | 12 ] · m · L ^2 + m · ( [ L | 2 ] ) ^2 = [ 1 | 3 ] · m · L ^2</M>, the value for the end.
        </p>
        <Fig caption="A 3 kg, 1.2 m rod. The axis slides from the centre to the end and the moment of inertia grows from 0.36 to 1.44 kg·m².">
          <ParallelFig />
        </Fig>
        <p>
          <strong>Perpendicular axis theorem.</strong> For a flat plate (thin, in a plane), take two perpendicular axes <M>x</M> and <M>y</M> in the plane and <M>z</M> through the same point, at right angles to the plate:
        </p>
        <Eq src='I _z = I _x + I _y' />
        <p>
          For a disc, <M>I _z = ½ · m · r ^2</M> and by symmetry <M>I _x = I _y</M>, so each is <M>¼ · m · r ^2</M>. This works for flat bodies only.
        </p>
        <Fig caption="The disc turned about x, y and z in turn. The two in-plane axes give a quarter each, and together they make the half for the axis through its face.">
          <PerpFig />
        </Fig>
      </section>

      <section className="t-section" id="t-alpha">
        <SectionHead n={no('alpha')} title="Torque and angular acceleration" />
        <p>
          This is Newton's second law for rotation. Add up the torques on a body about its axis, and it gains angular acceleration:
        </p>
        <Eq src='Σ τ = I · α' />
        <p>
          Compare it with <M>F = m · a</M>: torque plays the part of force, moment of inertia the part of mass, and <M>α</M> the part of acceleration. A big <M>I</M> means a small <M>α</M> for the same torque.
        </p>
        <p>
          To see it work, wind a string round a disc of mass <M>M</M> and radius <M>R</M> and hang a weight <M>m</M> from it. The string tension <M>T</M> gives the torque <M>T · R</M>, and the string does not slip, so <M>a = α · R</M>:
        </p>
        <Eq src={['m · g − T = m · a', 'T · R = I · α = I · [ a | R ]']} />
        <Eq src='a = [ m · g | m + I / R ^2 ]' />
        <Fig caption="A 2 kg disc (I = 0.25 kg·m²) of radius 0.5 m, with a 1 kg weight. The weight falls at 4.9 m/s², not 9.8: the string tension (4.9 N) holds it back.">
          <StringDisc />
        </Fig>
      </section>

      <section className="t-section" id="t-energy">
        <SectionHead n={no('energy')} title="Energy, work and power" />
        <p>
          A body turning at <M>ω</M> has the kinetic energy of all its pieces, and each piece moves at <M>v = ω · r</M>. Adding them up:
        </p>
        <Eq src='KE = ½ · I · ω ^2' />
        <p>
          It is <M>½ · m · v ^2</M> with <M>I</M> for <M>m</M> and <M>ω</M> for <M>v</M>. A torque that turns a body through an angle <M>θ</M> does work, and delivers power, in the same pattern as a force:
        </p>
        <Eq src={['W = τ · θ', 'P = τ · ω']} />
        <Fig caption="A steady 2 N·m torque on a flywheel with I = 0.25 kg·m². The work done and the kinetic energy gained run side by side, and the power climbs as ω does.">
          <WorkFig />
        </Fig>
        <p>
          The work–energy theorem holds as before: <M>W = ΔKE</M>. This is the energy shortcut for rotation, and it is often quicker than working with <M>α</M> and time.
        </p>
      </section>

      <section className="t-section" id="t-momentum">
        <SectionHead n={no('momentum')} title="Angular momentum" />
        <p>
          For a body turning about a fixed axis, the <strong>angular momentum</strong> is
        </p>
        <Eq src='L = I · ω' />
        <p>
          in <M>"kg·m²/s"</M>. For a single particle of mass <M>m</M> moving with velocity <M>v</M> at position <M>r</M>, it is the vector <M>L = r × p</M>, with <M>p = m · v</M>. Like torque, it has a size and a direction along the axis.
        </p>
        <Fig caption="A ring and a disc with the same mass, size and turning rate. The ring has twice the moment of inertia and so twice the angular momentum.">
          <MomentumFig />
        </Fig>
        <p>
          Newton's second law in its momentum form says the rate of change of <M>L</M> is the torque:
        </p>
        <Eq src='Σ τ = [ Δ L | Δ t ]' />
        <p>
          So with <strong>no external torque, <M>L</M> stays constant</strong>. This is the law of conservation of angular momentum. If <M>I</M> changes, <M>ω</M> must change to compensate:
        </p>
        <Eq src='I _1 · ω _1 = I _2 · ω _2' />
        <Fig caption="Two masses slide in along a spinning rod. I falls from 2.88 to 0.72 kg·m², so ω rises from 1.5 to 6 rad/s: L stays at 4.32 while the kinetic energy rises fourfold.">
          <RodConserve />
        </Fig>
        <p>
          The same trick is why a spinning skater speeds up when she pulls her arms in, and slows when she stretches them out. A diver does it too: tuck into a ball to spin fast, then stretch out before the water to slow the spin for a clean entry.
        </p>
        <Fig caption="A skater with I = 3.2 kg·m² spins at 2 rad/s. Pulling in her arms halves I, so ω doubles to 4 rad/s. The kinetic energy rises too, because her muscles do work pulling the arms in.">
          <Skater />
        </Fig>
      </section>

      <section className="t-section" id="t-rolling">
        <SectionHead n={no('rolling')} title="Rolling without slipping" />
        <p>
          A wheel rolls without slipping when the point touching the ground does not slide along it. In one turn the wheel moves forward exactly one circumference, so the centre moves at
        </p>
        <Eq src='v = ω · r' />
        <p>
          Rolling is a mixture of the two motions: the centre moves forward at <M>v</M> (translation) while every point also circles the centre at speed <M>ω · r = v</M> (rotation). Add them up. At the bottom the two cancel, so the contact point is momentarily <strong>at rest</strong> (that is why static friction, not sliding friction, acts there, and why it does no work). At the top they add, so the top moves at <M>2 · v</M>.
        </p>
        <Fig caption="The wheel rolls to the right. The rim point leaves a cycloid track, touching the ground with zero speed.">
          <RollingWheel />
        </Fig>
        <p>
          The total kinetic energy is the sum of the two parts:
        </p>
        <Eq src='KE = ½ · m · v ^2 + ½ · I · ω ^2 = ½ · m · v ^2 · ( 1 + [ I | m · r ^2 ] )' />
        <p>
          Write <M>k = I / ( m · r ^2 )</M>. It is 1 for a ring, ½ for a disc and ⅖ for a solid sphere. The share of the energy that goes into spinning is <M>k / ( 1 + k )</M>.
        </p>
        <Fig caption="Energy shares of a rolling body: a ring puts half its energy into spinning, a disc a third, a sphere two sevenths.">
          <KEShare />
        </Fig>
      </section>

      <section className="t-section" id="t-race">
        <SectionHead n={no('race')} title="The race down a slope" />
        <p>
          Let a rolling body start from rest on a slope of angle <M>θ</M>. Gravity pulls it down the slope with <M>m · g · sin θ</M>, and static friction at the contact point supplies the torque that makes it turn. Using <M>Σ F = m · a</M> and <M>Σ τ = I · α</M> together with <M>a = α · r</M>, the acceleration comes out as
        </p>
        <Eq src='a = [ g · sin θ | 1 + I / ( m · r ^2 ) ]' />
        <p>
          Mass and radius cancel: only the <em>shape</em> matters, through <M>k = I / ( m · r ^2 )</M>. The smaller the <M>k</M>, the greater the acceleration. A sliding block on a smooth slope (<M>k = 0</M>) gets <M>g · sin θ</M>, the maximum.
        </p>
        <Fig caption="Released together on a 20° slope: the sphere (k = 0.4) wins in 1.58 s, the disc (k = 0.5) takes 1.64 s, the ring (k = 1) 1.89 s.">
          <RaceFig
            bodies={[
              { name: 'ring', k: 1 },
              { name: 'disc', k: 0.5 },
              { name: 'sphere', k: 0.4 },
            ]}
          />
        </Fig>
        <p>
          The ring has its mass at the rim, so more of its energy has to go into spinning and less is left for moving down the hill. Energy gives the speed at the bottom of a drop of height <M>h</M> directly:
        </p>
        <Eq src={['m · g · h = ½ · m · v ^2 · ( 1 + k )', 'v = √[ [ 2 · g · h | 1 + k ] ]']} />
        <p>
          Sliding down smoothly gives <M>v = √[ 2 · g · h ]</M> and rolling always gives less, because some energy becomes rotation.
        </p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Torque', 'τ = r · F · sin θ'],
                  ['Torque as a vector', 'τ = r × F'],
                  ['Lever arm', 'd = r · sin θ ,  τ = F · d'],
                  ['Equilibrium', 'Σ F = 0 ,  Σ τ = 0'],
                  ['Moment of inertia', 'I = Σ m _i · r _i ^2'],
                  ['Ring', 'I = m · r ^2'],
                  ['Disc', 'I = ½ · m · r ^2'],
                  ['Rod, centre', 'I = [ 1 | 12 ] · m · L ^2'],
                  ['Rod, end', 'I = [ 1 | 3 ] · m · L ^2'],
                  ['Solid sphere', 'I = ⅖ · m · r ^2'],
                  ['Parallel axis', 'I = I _cm + m · d ^2'],
                  ['Perpendicular axis (flat plate)', 'I _z = I _x + I _y'],
                  ['Rotation, Newton 2', 'Σ τ = I · α'],
                  ['Kinetic energy', 'KE = ½ · I · ω ^2'],
                  ['Work and power', 'W = τ · θ ,  P = τ · ω'],
                  ['Angular momentum', 'L = I · ω ,  L = r × p'],
                  ['Conservation', 'I _1 · ω _1 = I _2 · ω _2'],
                  ['Rolling', 'v = ω · r'],
                  ['Rolling energy', 'KE = ½ · m · v ^2 + ½ · I · ω ^2'],
                  ['Rolling on a slope', 'a = [ g · sin θ | 1 + I / ( m · r ^2 ) ]'],
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
                  ['τ', 'Torque', 'N·m'],
                  ['I', 'Moment of inertia', 'kg·m²'],
                  ['α', 'Angular acceleration', 'rad/s²'],
                  ['ω', 'Angular velocity', 'rad/s'],
                  ['L', 'Angular momentum', 'kg·m²/s'],
                  ['d', 'Lever arm, or distance between parallel axes', 'm'],
                  ['k', 'Shape factor, I divided by m r squared', 'none'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{unit === 'none' ? 'no unit' : <M>{`"${unit}"`}</M>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Pushing a door">
          <p className="ex-q">A 20 N force pushes on a door 0.3 m from the hinge, at 60° to the line from the hinge. Find the torque about the hinge.</p>
          <Given items={['F = 20 "N"', 'r = 0.3 "m"', 'θ = 60°']} />
          <ol className="steps">
            <Step title="Use the formula">
              <Eq src='τ = r · F · sin θ = 0.3 · 20 · sin 60°' />
            </Step>
            <Step title="Work it out">
              <Eq src='τ = 6 · 0.866 = 5.20 "N·m"' />
            </Step>
          </ol>
          <Answer>5.20 N·m, anticlockwise. Pushing at right angles would give the full 6.00 N·m; the slant wastes about 13%.</Answer>
          <Fig>
            <DoorFig cases={[{ d: 0.3, deg: 60 }]} loop={3.2} />
          </Fig>
        </Example>

        <Example n={2} title="A rod about its end">
          <p className="ex-q">A uniform rod of mass 3 kg and length 1.2 m turns about one end. Find its moment of inertia, using the parallel axis theorem.</p>
          <Given items={['m = 3 "kg"', 'L = 1.2 "m"']} />
          <ol className="steps">
            <Step title="About the centre">
              <Eq src='I _cm = [ 1 | 12 ] · m · L ^2 = [ 1 | 12 ] · 3 · 1.2 ^2 = 0.36 "kg·m²"' />
            </Step>
            <Step title="Shift to the end: d = L / 2 = 0.6 m">
              <Eq src='I = I _cm + m · d ^2 = 0.36 + 3 · 0.6 ^2 = 0.36 + 1.08' />
            </Step>
            <Step title="Check with the end formula">
              <Eq src='I = [ 1 | 3 ] · m · L ^2 = [ 1 | 3 ] · 3 · 1.2 ^2 = 1.44 "kg·m²"' />
            </Step>
          </ol>
          <Answer>1.44 kg·m², four times the value about the centre.</Answer>
          <Fig>
            <ParallelFig />
          </Fig>
        </Example>

        <Example n={3} title="Spinning up a disc">
          <p className="ex-q">A solid disc of mass 2 kg and radius 0.5 m, free to turn about its centre, is pulled with a steady 8 N tangential force at its rim. Find the angular acceleration, and the angular velocity after 1.5 s from rest.</p>
          <Given items={['m = 2 "kg"', 'r = 0.5 "m"', 'F = 8 "N"', 't = 1.5 "s"']} />
          <ol className="steps">
            <Step title="Moment of inertia">
              <Eq src='I = ½ · m · r ^2 = ½ · 2 · 0.5 ^2 = 0.25 "kg·m²"' />
            </Step>
            <Step title="Torque">
              <Eq src='τ = F · r = 8 · 0.5 = 4 "N·m"' />
            </Step>
            <Step title="Angular acceleration">
              <Eq src='α = [ τ | I ] = [ 4 | 0.25 ] = 16 "rad/s²"' />
            </Step>
            <Step title="Angular velocity">
              <Eq src='ω = α · t = 16 · 1.5 = 24 "rad/s"' />
            </Step>
          </ol>
          <Answer>16 rad/s², reaching 24 rad/s (about 3.8 turns per second) after 1.5 s.</Answer>
          <Fig>
            <DiscForce />
          </Fig>
        </Example>

        <Example n={4} title="The skater pulls in her arms">
          <p className="ex-q">A skater spins at 2 rad/s with her arms out, where her moment of inertia is 3.2 kg·m². She pulls her arms in and it falls to 1.6 kg·m². Find her new angular velocity and how her kinetic energy changes.</p>
          <Given items={['I _1 = 3.2 "kg·m²"', 'ω _1 = 2 "rad/s"', 'I _2 = 1.6 "kg·m²"']} />
          <ol className="steps">
            <Step title="No external torque, so L is conserved">
              <Eq src='I _1 · ω _1 = I _2 · ω _2' />
            </Step>
            <Step title="Solve for ω">
              <Eq src='ω _2 = [ I _1 · ω _1 | I _2 ] = [ 3.2 · 2 | 1.6 ] = 4 "rad/s"' />
            </Step>
            <Step title="Kinetic energy before and after">
              <Eq src={['KE _1 = ½ · 3.2 · 2 ^2 = 6.4 "J"', 'KE _2 = ½ · 1.6 · 4 ^2 = 12.8 "J"']} />
            </Step>
          </ol>
          <Answer>ω doubles to 4 rad/s. The kinetic energy also doubles, from 6.4 J to 12.8 J: the extra 6.4 J is the work her muscles do pulling the arms in against the outward pull.</Answer>
          <Fig>
            <Skater height={250} />
          </Fig>
        </Example>

        <Example n={5} title="A sphere rolls down a slope">
          <p className="ex-q">A solid sphere rolls without slipping from rest down a slope, dropping a height of 2 m. Find its speed at the bottom. How does it compare with a block sliding down a smooth slope?</p>
          <Given items={['h = 2 "m"', 'k = ⅖', 'g = 9.8 "m/s²"']} />
          <ol className="steps">
            <Step title="Energy conservation">
              <Eq src='m · g · h = ½ · m · v ^2 + ½ · I · ω ^2 = ½ · m · v ^2 · ( 1 + k )' />
            </Step>
            <Step title="Solve for v">
              <Eq src='v = √[ [ 2 · g · h | 1 + k ] ] = √[ [ 2 · 9.8 · 2 | 1.4 ] ] = √[ 28 ] = 5.29 "m/s"' />
            </Step>
            <Step title="Compare with sliding">
              <Eq src='v = √[ 2 · g · h ] = √[ 39.2 ] = 6.26 "m/s"' />
            </Step>
          </ol>
          <Answer>5.29 m/s. A sliding block would reach 6.26 m/s: the sphere is slower because 2/7 of the energy went into spinning. (A disc would reach 5.11 m/s and a ring 4.43 m/s.)</Answer>
          <Fig>
            <EnergyRoll />
          </Fig>
        </Example>

        <Example n={6} title="A ladder against a wall">
          <p className="ex-q">A uniform ladder of length 5 m and mass 15 kg leans against a smooth wall. Its foot is 3 m from the wall, so the top is 4 m up. Find the push of the wall, the push of the floor, the friction needed, and the smallest friction coefficient that keeps it from slipping.</p>
          <Given items={['L = 5 "m"', 'm = 15 "kg"', 'base 3 "m"', 'height 4 "m"']} />
          <ol className="steps">
            <Step title="Torques about the foot">
              <p>The floor force and friction act at the foot, so they have no lever arm. The weight acts at the middle, 1.5 m from the foot horizontally. The wall force <M>N</M> is horizontal at the top, 4 m up.</p>
              <Eq src='N · 4 = m · g · 1.5' />
              <Eq src='N = [ 15 · 9.8 · 1.5 | 4 ] = 55.1 "N"' />
            </Step>
            <Step title="Forces: vertical and horizontal">
              <Eq src={['R = m · g = 15 · 9.8 = 147 "N"', 'f = N = 55.1 "N"']} />
            </Step>
            <Step title="Least friction coefficient">
              <Eq src='μ ≥ [ f | R ] = [ 55.1 | 147 ] = 0.375' />
            </Step>
          </ol>
          <Answer>The wall pushes with 55.1 N, the floor with 147 N, and friction must supply 55.1 N, so the floor must have <M>μ ≥ 0.375</M>.</Answer>
          <Fig>
            <LadderFig />
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Torque is just force times distance" wrong="τ = F · r" fig={<MistakeTorque />}>
            The angle matters: <M>τ = r · F · sin θ</M>. A force along the door (<M>θ = 0</M>) gives no turn at all, however large. Use the lever arm, the perpendicular distance.
          </Mistake>
          <Mistake title="One formula for every shape" wrong={'I = m · r ^2 ,  "for a disc"'} fig={<MistakeInertiaShape />}>
            <M>I = m · r ^2</M> is for a ring only. A disc has its mass nearer the axis, so <M>I = ½ · m · r ^2</M> and it speeds up twice as fast under the same torque.
          </Mistake>
          <Mistake title="The axis does not matter" wrong="I _end = I _centre" fig={<MistakeAxis />}>
            Always state the axis. A rod has <M>[ 1 | 12 ] · m · L ^2</M> about its centre but <M>[ 1 | 3 ] · m · L ^2</M> about its end, four times larger.
          </Mistake>
          <Mistake title="Kinetic energy is conserved too" wrong="½ · I _1 · ω _1 ^2 = ½ · I _2 · ω _2 ^2" fig={<MistakeEnergy />}>
            When <M>I</M> changes by an internal action, it is <M>L</M> that is conserved, not the energy. Pulling the arms in takes work, so the kinetic energy rises (it doubles when I halves).
          </Mistake>
          <Mistake title="The contact point moves at v" wrong="v _bottom = v" fig={<RollingWheel height={190} R={36} compact />}>
            In rolling without slipping the point touching the ground is at rest, <M>v = 0</M>, while the top moves at <M>2 · v</M>. That is why friction there is static, and does no work.
          </Mistake>
          <Mistake title="Heavier or bigger rolls faster" wrong={'a "depends on" m , r'} fig={<MistakeEqualRace />}>
            On a slope <M>a = g · sin θ / ( 1 + k )</M>, and <M>k</M> depends only on the shape. Two discs of any mass or radius arrive together; the shape decides the race.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Where the mass sits matters as much as how much: spin gets harder, and faster, with distance squared.</p>
        <p className="closing-sub">
          Next: <M>{'F = m · a'}</M> and <M>{'τ = I · α'}</M> together describe almost any motion of a solid body. Energy and momentum make the next step, from solids to springs and waves.
        </p>
      </footer>
    </ChapterShell>
  );
}
