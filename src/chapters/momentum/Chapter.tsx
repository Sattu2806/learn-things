import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { Fig } from '../kit/Anim';
import { Billiard, Bounce, Collide, Cradle, EqualAreas, ImpulseScene, MomentumCarts, Pendulum, Recoil, Rocket, Shell, Stick2D, WallBounce } from './Scenes';

/** Momentum and collisions: impulse, conservation, recoil, elastic and inelastic collisions, with animated diagrams and worked examples. */

const SECTIONS: NoteSection[] = [
  { id: 'p', title: 'Momentum', group: 'Theory' },
  { id: 'impulse', title: 'Impulse', group: 'Theory' },
  { id: 'conserve', title: 'Conservation of momentum', group: 'Theory' },
  { id: 'recoil', title: 'Recoil', group: 'Theory' },
  { id: 'explosion', title: 'Explosions', group: 'Theory' },
  { id: 'elastic', title: 'Elastic collisions', group: 'Theory' },
  { id: 'special', title: 'Three special cases', group: 'Theory' },
  { id: 'inelastic', title: 'Sticking together', group: 'Theory' },
  { id: 'restitution', title: 'Coefficient of restitution', group: 'Theory' },
  { id: 'twod', title: 'Collisions in two dimensions', group: 'Theory' },
  { id: 'pendulum', title: 'The ballistic pendulum', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="momentum" sections={SECTIONS} sideTitle="Momentum and collisions" sideLead="Momentum, impulse and the one quantity that survives every collision: why the total never changes, and what that tells us about recoil, explosions and crashes.">
      <header className="article-head">
        <span className="kicker">Physics · Laws of motion</span>
        <h1 className="article-title">What is always the same before and after a crash?</h1>
        <p className="article-lead">In a collision everything is a blur: huge forces, tiny times, bent metal. Yet one number stays exactly the same. This chapter shows what that number is, why it never changes, and how to use it.</p>
      </header>

      <section className="t-section" id="t-p">
        <SectionHead n={no('p')} title="Momentum" />
        <p>
          A tennis ball and a truck can both be moving, but you would rather catch the ball. How hard something is to stop depends on both its mass and its speed. We put the two together into one quantity, the <strong>linear momentum</strong>:
        </p>
        <Eq src='p = m · v' />
        <p>
          Momentum is a <strong>vector</strong>. It points the way the object moves, because velocity does, so a cart going left and a cart going right have opposite momentum. Its unit is the kilogram metre per second, <M>"kg·m/s"</M>, which is the same as a newton second.
        </p>
        <Fig caption={<>Different masses and speeds can give the same momentum: <M>1 · 3 = 3 · 1</M>. The arrows show it.</>}>
          <MomentumCarts />
        </Fig>
        <p>
          Momentum is the natural way to write Newton's second law. A force is what changes the momentum, and the bigger the force the faster it changes:
        </p>
        <Eq src='F = [ Δp | Δt ]'>
          <span className="eq-note">for a constant mass this is the familiar F = m · a</span>
        </Eq>
        <Note label="Remember">Because momentum is a vector, in a straight line you must choose a positive direction and give left-moving things a minus sign.</Note>
      </section>

      <section className="t-section" id="t-impulse">
        <SectionHead n={no('impulse')} title="Impulse" />
        <p>
          In a bat hitting a ball, the force is enormous but lasts only a few thousandths of a second, and it changes all the time. We cannot track it, but we can add up its total effect. A constant force <M>F</M> acting for a time <M>Δt</M> gives an <strong>impulse</strong>
        </p>
        <Eq src='J = F · Δt'>
          <span className="eq-note">unit N·s, the same as kg·m/s</span>
        </Eq>
        <p>
          Start from <M>F = m · a = m · [ v − u | Δt ]</M> and multiply by <M>Δt</M>. The impulse is exactly the change in momentum:
        </p>
        <Eq src='F · Δt = m · v − m · u'>
          <span>in words: impulse = change in momentum, <M>J = Δp</M>.</span>
        </Eq>
        <p>
          When the force varies, draw it against time. The impulse is then the <strong>area under the force-time graph</strong>, and that area is the change in momentum.
        </p>
        <Fig caption={<>The area under the curve grows as the force acts. The cart ends with the momentum the area measures: <M>J = 1.00 "N·s"</M>, so <M>v = [ J | m ] = 0.5 "m/s"</M>.</>}>
          <ImpulseScene />
        </Fig>
        <p>
          The same impulse can come from a big force for a short time or a small force for a long time. That is why you bend your knees when you land and why airbags exist. The momentum you lose is fixed, so stretching the time lowers the force:
        </p>
        <Eq src='F _avg = [ Δp | Δt ]' />
        <Fig caption="Both pulses have the same area, so the same change of momentum, but the soft landing needs far less force.">
          <EqualAreas />
        </Fig>
      </section>

      <section className="t-section" id="t-conserve">
        <SectionHead n={no('conserve')} title="Conservation of momentum" />
        <p>
          Take two bodies that push on each other, such as two skaters, or two carts that collide. By Newton's third law the forces are equal and opposite, and they act for exactly the same time:
        </p>
        <Eq src={['F _12 = − F _21', 'F _12 · Δt = − F _21 · Δt']} />
        <p>
          The left side is the change of momentum of body 1, and the right side is minus the change of momentum of body 2. So whatever one gains the other loses:
        </p>
        <Eq src={['Δp _1 = − Δp _2', 'Δ ( p _1 + p _2 ) = 0']} />
        <Fig caption={<>The push <M>F</M> on one skater and <M>−F</M> on the other last the same time. One gains momentum, the other gains the same amount the opposite way, and the bar of total momentum stays at zero.</>}>
          <Recoil title="Two skaters push apart: equal and opposite forces, equal and opposite momenta" kind="skaters" mL={60} mR={40} vR={3} labelL="A" labelR="B" />
        </Fig>
        <p>
          This is the <strong>law of conservation of momentum</strong>: for a system with no net external force (an <strong>isolated</strong> system), the total momentum stays constant.
        </p>
        <Eq src='m _1 · u _1 + m _2 · u _2 = m _1 · v _1 + m _2 · v _2'>
          <span>total momentum before = total momentum after (<M>u</M> is the velocity before, <M>v</M> after).</span>
        </Eq>
        <p>
          In a collision the contact forces are huge and last a very short time, so friction and other outside forces have no time to matter. We can treat the colliding bodies as isolated, just for the moment of impact. Collisions come in kinds:
        </p>
        <ul className="t-list">
          <li><strong>Elastic:</strong> kinetic energy is conserved too. The bodies bounce apart.</li>
          <li><strong>Inelastic:</strong> some kinetic energy is turned into heat, sound and dents.</li>
          <li><strong>Perfectly inelastic:</strong> the bodies stick and move together. This loses the most energy.</li>
        </ul>
        <Fig caption={<>A 2 kg cart at 2 m/s meets a 1 kg cart at −2 m/s and they bounce apart. The momentum arrows change, but the total <M>Σp</M> is the same before and after. The kinetic energy is not.</>}>
          <Collide title="Two carts collide; the total momentum bar does not change" m1={2} u1={2} m2={1} u2={-2} e={0.5} showKE />
        </Fig>
        <Note label="In every collision">Momentum is conserved. Kinetic energy is conserved only if the collision is elastic.</Note>
      </section>

      <section className="t-section" id="t-recoil">
        <SectionHead n={no('recoil')} title="Recoil" />
        <p>
          Before a gun fires, the gun and bullet are at rest and the total momentum is zero. It must still be zero afterwards. The bullet gets momentum forward, so the gun gets the same momentum backward:
        </p>
        <Eq src={['0 = m · v + M · V', 'V = − [ m · v | M ]']}>
          <span>with <M>m</M> and <M>v</M> for the bullet and <M>M</M> and <M>V</M> for the gun. The minus sign means opposite directions.</span>
        </Eq>
        <Fig caption="The arrows are the same length: equal and opposite momenta. The bullet is drawn 100 times too slow so that it stays on the page.">
          <Recoil title="A gun fires a bullet and recoils backwards with the same momentum" kind="gun" mL={4} mR={0.02} vR={400} slow={100} labelL="gun" labelR="bullet" />
        </Fig>
        <p>
          The gun is heavy, so it moves slowly; the bullet is light, so it moves fast. Equal momentum does not mean equal energy: the light bullet carries almost all of it. The same idea explains a skater pushing off a wall, a boat drifting back as you jump out, and a cannon rolling backwards.
        </p>
        <p>
          A <strong>rocket</strong> works in the same way, in empty space with nothing to push against. It throws gas backwards at high speed. The gas gets momentum one way, so the rocket gets the same momentum the other way.
        </p>
        <Fig caption="Each puff of exhaust carries momentum backwards, and the rocket gains the same amount forwards, so it keeps speeding up.">
          <Rocket />
        </Fig>
      </section>

      <section className="t-section" id="t-explosion">
        <SectionHead n={no('explosion')} title="Explosions" />
        <p>
          An explosion is a recoil with the pieces flying apart. Chemical energy is released, so the kinetic energy goes <em>up</em>, but the internal forces are equal and opposite, so the total momentum is unchanged. If the shell was at rest, the pieces' momenta add to zero. If it was moving, they add to the momentum it had.
        </p>
        <Fig caption={<>A 3 kg shell at 2 m/s bursts into 1 kg and 2 kg. Momentum before: <M>6</M>. After: <M>1 · ( −1 ) + 2 · 3.5 = 6</M>. The centre of mass never notices.</>}>
          <Shell />
        </Fig>
        <p>
          The point that moves steadily through the burst is the <strong>centre of mass</strong>. Only an outside force can change its velocity, which is the same statement as conservation of momentum seen from another side.
        </p>
      </section>

      <section className="t-section" id="t-elastic">
        <SectionHead n={no('elastic')} title="Elastic collisions in one dimension" />
        <p>
          In an elastic collision two things are conserved at once, momentum and kinetic energy:
        </p>
        <Eq src={['m _1 · u _1 + m _2 · u _2 = m _1 · v _1 + m _2 · v _2', '½ · m _1 · u _1 ^2 + ½ · m _2 · u _2 ^2 = ½ · m _1 · v _1 ^2 + ½ · m _2 · v _2 ^2']} />
        <p>
          Moving every <M>m _1</M> term to one side and every <M>m _2</M> term to the other, and dividing the energy equation by the momentum equation, gives a neat result:
        </p>
        <Eq src='u _1 − u _2 = − ( v _1 − v _2 )'>
          <span>the speed of approach equals the speed of separation.</span>
        </Eq>
        <p>
          Combined with momentum, this is a pair of simple equations for the two unknowns. Solving them gives
        </p>
        <Eq src={['v _1 = [ ( m _1 − m _2 ) · u _1 + 2 · m _2 · u _2 | m _1 + m _2 ]', 'v _2 = [ ( m _2 − m _1 ) · u _2 + 2 · m _1 · u _1 | m _1 + m _2 ]']} />
        <Fig caption={<>A 2 kg cart at 3 m/s hits a 1 kg cart at rest. Afterwards they move at 1 m/s and 4 m/s: the sum of momenta is still 6, and the kinetic energy is still 9 J.</>}>
          <Collide title="An elastic collision: both the momentum bar and the energy bar are unchanged" m1={2} u1={3} m2={1} u2={0} e={1} showKE />
        </Fig>
        <p>
          When the second body starts at rest (<M>u _2 = 0</M>) the formulas get shorter:
        </p>
        <Eq src={['v _1 = [ m _1 − m _2 | m _1 + m _2 ] · u _1', 'v _2 = [ 2 · m _1 | m _1 + m _2 ] · u _1']} />
      </section>

      <section className="t-section" id="t-special">
        <SectionHead n={no('special')} title="Three special cases" />
        <p>
          Put <M>u _2 = 0</M> into the short formulas and three useful pictures appear.
        </p>
        <h3 className="t-h3">Equal masses swap velocities</h3>
        <p>
          With <M>m _1 = m _2</M> we get <M>v _1 = 0</M> and <M>v _2 = u _1</M>. The moving cart stops dead and the other leaves with its velocity.
        </p>
        <Fig>
          <Collide title="Equal masses: the moving cart stops and the other takes its velocity" m1={1} u1={2} m2={1} u2={0} e={1} />
        </Fig>
        <p>
          This is <strong>Newton's cradle</strong>. When one ball hits a line of identical balls, it stops and the ball at the far end leaves with its speed. Lift two and two swing out, because only that pair of velocities keeps both momentum and energy.
        </p>
        <Fig caption="One ball in, one ball out. The balls in the middle pass the momentum along without moving.">
          <Cradle n={1} />
        </Fig>
        <Fig caption="Two in, two out. One ball out at twice the speed would conserve momentum, but not energy.">
          <Cradle n={2} />
        </Fig>
        <h3 className="t-h3">A heavy body hits a light one</h3>
        <p>
          With <M>m _1 ≫ m _2</M>, <M>v _1 ≈ u _1</M> and <M>v _2 ≈ 2 · u _1</M>. The heavy body hardly slows, and the light one is thrown forward at about twice the speed. A lorry hitting a ball is like this.
        </p>
        <Fig caption="A 6 kg cart at 2 m/s hits a 1 kg cart: the big one barely slows down (1.43 m/s) and the small one shoots off at 3.43 m/s.">
          <Collide title="A heavy cart hits a light one: the light one speeds away" m1={6} u1={2} m2={1} u2={0} e={1} />
        </Fig>
        <h3 className="t-h3">A light body hits a heavy one</h3>
        <p>
          With <M>m _1 ≪ m _2</M>, <M>v _1 ≈ − u _1</M> and <M>v _2 ≈ 0</M>. The light body bounces straight back at nearly its own speed and the heavy one hardly moves. A ball off a wall, or a gas molecule off a piston, behaves like this.
        </p>
        <Fig caption="A 1 kg cart at 3 m/s hits a 5 kg cart. It rebounds at 2 m/s, and the heavy one creeps away at 1 m/s.">
          <Collide title="A light cart hits a heavy one: the light one bounces back" m1={1} u1={3} m2={5} u2={0} e={1} />
        </Fig>
      </section>

      <section className="t-section" id="t-inelastic">
        <SectionHead n={no('inelastic')} title="Sticking together" />
        <p>
          In a <strong>perfectly inelastic</strong> collision the bodies stay together and move with a common velocity <M>v</M>. Only momentum is conserved, and it is all we need:
        </p>
        <Eq src='m _1 · u _1 + m _2 · u _2 = ( m _1 + m _2 ) · v'>
          <span>so <M>v = [ m _1 · u _1 + m _2 · u _2 | m _1 + m _2 ]</M>.</span>
        </Eq>
        <p>
          Kinetic energy is lost, turned into heat, sound and the work of crumpling. The amount lost, with <M>μ = [ m _1 · m _2 | m _1 + m _2 ]</M>, is
        </p>
        <Eq src='Δ "KE" = ½ · μ · ( u _1 − u _2 ) ^2' />
        <Fig caption={<>A 3 kg cart at 4 m/s sticks to a 1 kg cart at rest. They leave at 3 m/s. The momentum bar stays at 12, but the kinetic energy drops from 24 J to 18 J: 6 J is lost.</>}>
          <Collide title="Two carts stick together; momentum is conserved but the kinetic energy bar drops" m1={3} u1={4} m2={1} u2={0} e={0} showKE />
        </Fig>
        <Note label="Remember">Energy is never destroyed. It becomes heat and deformation, which is why a crash leaves a crumpled car and not two bouncing ones.</Note>
      </section>

      <section className="t-section" id="t-restitution">
        <SectionHead n={no('restitution')} title="Coefficient of restitution" />
        <p>
          Real collisions are somewhere between bouncing perfectly and sticking. The <strong>coefficient of restitution</strong> <M>e</M> measures how bouncy:
        </p>
        <Eq src='e = [ "speed of separation" | "speed of approach" ] = [ v _2 − v _1 | u _1 − u _2 ]'>
          <span><M>e = 1</M> is elastic, <M>e = 0</M> is perfectly inelastic, and real collisions have <M>{'0 < e < 1'}</M>.</span>
        </Eq>
        <p>
          Together with conservation of momentum this fixes both final velocities:
        </p>
        <Eq src={['v _1 = [ m _1 · u _1 + m _2 · u _2 − m _2 · e · ( u _1 − u _2 ) | m _1 + m _2 ]', 'v _2 = [ m _1 · u _1 + m _2 · u _2 + m _1 · e · ( u _1 − u _2 ) | m _1 + m _2 ]']} />
        <p>
          A ball hitting the floor is the simplest case, since the floor does not move. The ball arrives at speed <M>v = √[ 2 · g · h ]</M> and leaves at <M>e · v</M>. A rebound speed <M>e · v</M> carries it up to a height <M>h _1 = [ ( e · v ) ^2 | 2 · g ]</M>, so
        </p>
        <Eq src={['h _1 = e ^2 · h', 'h _n = e ^2n · h']}>
          <span>the height after the nth bounce. It falls by the same factor each time.</span>
        </Eq>
        <Fig caption={<>A ball with <M>e = 0.8</M> dropped from 2 m reaches 1.28 m, then 0.819 m, then 0.524 m, and so on. Each height is <M>e ^2 = 0.64</M> of the last.</>}>
          <Bounce e={0.8} h={2} title="A ball bounces lower each time, each peak 0.64 times the one before" />
        </Fig>
      </section>

      <section className="t-section" id="t-twod">
        <SectionHead n={no('twod')} title="Collisions in two dimensions" />
        <p>
          Momentum is a vector, so it is conserved in <em>each direction separately</em>. Choose x and y axes and write one equation for each:
        </p>
        <Eq src={['m _1 · u _1x + m _2 · u _2x = m _1 · v _1x + m _2 · v _2x', 'm _1 · u _1y + m _2 · u _2y = m _1 · v _1y + m _2 · v _2y']} />
        <p>
          There is a beautiful case: a ball hits an identical ball at rest in an elastic glancing collision. The masses are equal, so conservation of momentum becomes a sum of velocity vectors:
        </p>
        <Eq src='u = v _1 + v _2'>
          <span>(all three are vectors, and the masses have cancelled).</span>
        </Eq>
        <p>
          Conservation of energy, with the masses cancelling again, says the lengths obey <M>u ^2 = v _1 ^2 + v _2 ^2</M>. That is Pythagoras: the three vectors form a right triangle, with <M>u</M> as the hypotenuse. So the two balls leave at <strong>exactly 90°</strong> to each other.
        </p>
        <Fig caption={<>The cue ball turns away at 30° and the other leaves at 60° the other side. The speeds are <M>u · cos 30° = 4.33 "m/s"</M> and <M>u · sin 30° = 2.5 "m/s"</M> for a start at 5 m/s. The vector triangle on the right is a right triangle.</>}>
          <Billiard />
        </Fig>
        <p>
          Snooker players use this all the time: if the cue ball hits an object ball off-centre, they know the two will go off at right angles.
        </p>
      </section>

      <section className="t-section" id="t-pendulum">
        <SectionHead n={no('pendulum')} title="The ballistic pendulum" />
        <p>
          How do you measure the speed of a bullet with only a ruler? Fire it into a heavy block hanging from strings and see how high the block swings. The idea is to split the event into two stages and use the right law for each one.
        </p>
        <ol className="t-list">
          <li>
            <strong>The bullet embeds</strong>, very quickly. Momentum is conserved, but kinetic energy is not:
            <Eq src='m · v = ( m + M ) · V' />
          </li>
          <li>
            <strong>The block swings up</strong>. The strings do no work, so mechanical energy is conserved:
            <Eq src='½ · ( m + M ) · V ^2 = ( m + M ) · g · h' />
          </li>
        </ol>
        <Fig caption="The bullet vanishes into the block, which then swings up a little to a height h. Measuring h is enough to find the bullet's speed.">
          <Pendulum title="A bullet embeds in a hanging block, which swings up through a height h" />
        </Fig>
        <p>
          The second stage gives <M>V = √[ 2 · g · h ]</M>, and putting that into the first stage:
        </p>
        <Eq src='v = [ m + M | m ] · √[ 2 · g · h ]' />
        <p>
          The bullet speed follows from the height of the swing. Almost all the bullet's kinetic energy disappears in stage 1, which is why you cannot use energy for the whole event.
        </p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Momentum', 'p = m · v'],
                  ['Second law', 'F = [ Δp | Δt ]'],
                  ['Impulse', 'J = F · Δt = Δp'],
                  ['Impulse from a graph', 'J = "area under F against t"'],
                  ['Conservation of momentum', 'm _1 · u _1 + m _2 · u _2 = m _1 · v _1 + m _2 · v _2'],
                  ['Recoil from rest', 'V = − [ m · v | M ]'],
                  ['Elastic: approach and separation', 'u _1 − u _2 = − ( v _1 − v _2 )'],
                  ['Elastic: first body', 'v _1 = [ ( m _1 − m _2 ) · u _1 + 2 · m _2 · u _2 | m _1 + m _2 ]'],
                  ['Elastic: second body', 'v _2 = [ ( m _2 − m _1 ) · u _2 + 2 · m _1 · u _1 | m _1 + m _2 ]'],
                  ['Elastic, second at rest', 'v _1 = [ m _1 − m _2 | m _1 + m _2 ] · u _1'],
                  ['Elastic, second at rest', 'v _2 = [ 2 · m _1 | m _1 + m _2 ] · u _1'],
                  ['Stick together', 'v = [ m _1 · u _1 + m _2 · u _2 | m _1 + m _2 ]'],
                  ['Energy lost, any collision', 'Δ "KE" = ½ · μ · ( 1 − e ^2 ) · ( u _1 − u _2 ) ^2'],
                  ['Reduced mass', 'μ = [ m _1 · m _2 | m _1 + m _2 ]'],
                  ['Coefficient of restitution', 'e = [ v _2 − v _1 | u _1 − u _2 ]'],
                  ['Bounce from height h', 'h _n = e ^2n · h'],
                  ['Equal masses, elastic, one at rest', 'u = v _1 + v _2 ,  angle between paths 90°'],
                  ['Ballistic pendulum', 'v = [ m + M | m ] · √[ 2 · g · h ]'],
                ] as const
              ).map(([name, src]) => (
                <tr key={name + src}>
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
                  ['p', 'Linear momentum (a vector)', 'kg·m/s'],
                  ['J', 'Impulse', 'N·s'],
                  ['m _1 , m _2', 'Masses of the two bodies', 'kg'],
                  ['u', 'Velocity before the collision', 'm/s'],
                  ['v', 'Velocity after the collision', 'm/s'],
                  ['e', 'Coefficient of restitution (0 to 1)', ''],
                  ['μ', 'Reduced mass', 'kg'],
                  ['h', 'Height', 'm'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{unit ? <M>{`"${unit}"`}</M> : 'no unit'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Recoil of a gun">
          <p className="ex-q">A 4 kg gun fires a 20 g bullet at 400 m/s. Find the recoil speed of the gun, and compare the kinetic energies.</p>
          <Given items={['M = 4 "kg"', 'm = 0.02 "kg"', 'v = 400 "m/s"']} />
          <ol className="steps">
            <Step title="Momentum starts at zero, so it ends at zero">
              <Eq src='0 = m · v + M · V' />
            </Step>
            <Step title="Solve for the gun's velocity">
              <Eq src='V = − [ m · v | M ] = − [ 0.02 · 400 | 4 ] = − 2 "m/s"' />
            </Step>
            <Step title="Compare the energies">
              <Eq src={['KE _bullet = ½ · 0.02 · 400 ^2 = 1600 "J"', 'KE _gun = ½ · 4 · 2 ^2 = 8 "J"']} />
            </Step>
          </ol>
          <Answer>The gun recoils at 2 m/s, opposite to the bullet. Both have the same size of momentum (8 kg·m/s), but the bullet gets 200 times the energy.</Answer>
          <Fig>
            <Recoil title="The gun recoils at 2 metres per second as the bullet leaves" kind="gun" mL={4} mR={0.02} vR={400} slow={100} labelL="gun" labelR="bullet" />
          </Fig>
        </Example>

        <Example n={2} title="An elastic collision">
          <p className="ex-q">A 2 kg cart moving at 3 m/s hits a 1 kg cart at rest, and they collide elastically. Find both velocities afterwards.</p>
          <Given items={['m _1 = 2 "kg"', 'u _1 = 3 "m/s"', 'm _2 = 1 "kg"', 'u _2 = 0']} />
          <ol className="steps">
            <Step title="First cart">
              <Eq src='v _1 = [ m _1 − m _2 | m _1 + m _2 ] · u _1 = [ 2 − 1 | 2 + 1 ] · 3 = 1 "m/s"' />
            </Step>
            <Step title="Second cart">
              <Eq src='v _2 = [ 2 · m _1 | m _1 + m _2 ] · u _1 = [ 2 · 2 | 2 + 1 ] · 3 = 4 "m/s"' />
            </Step>
            <Step title="Check both conservation laws">
              <Eq src={['2 · 1 + 1 · 4 = 6 = 2 · 3', '½ · 2 · 1 ^2 + ½ · 1 · 4 ^2 = 9 = ½ · 2 · 3 ^2']} />
            </Step>
          </ol>
          <Answer>The 2 kg cart carries on at 1 m/s and the 1 kg cart leaves at 4 m/s. Momentum (6 kg·m/s) and kinetic energy (9 J) are both unchanged.</Answer>
          <Fig>
            <Collide title="A 2 kg cart at 3 m/s hits a 1 kg cart at rest elastically" m1={2} u1={3} m2={1} u2={0} e={1} showKE />
          </Fig>
        </Example>

        <Example n={3} title="The same collision, but they stick">
          <p className="ex-q">Now the two carts stick together on impact. Find their common velocity and the kinetic energy lost.</p>
          <Given items={['m _1 = 2 "kg"', 'u _1 = 3 "m/s"', 'm _2 = 1 "kg"', 'u _2 = 0']} />
          <ol className="steps">
            <Step title="Conserve momentum">
              <Eq src='2 · 3 + 1 · 0 = ( 2 + 1 ) · v' />
            </Step>
            <Step title="Common velocity">
              <Eq src='v = [ 6 | 3 ] = 2 "m/s"' />
            </Step>
            <Step title="Kinetic energy before and after">
              <Eq src={['KE _before = ½ · 2 · 3 ^2 = 9 "J"', 'KE _after = ½ · 3 · 2 ^2 = 6 "J"']} />
            </Step>
            <Step title="The loss">
              <Eq src='Δ "KE" = 9 − 6 = 3 "J"' />
            </Step>
          </ol>
          <Answer>They move together at 2 m/s. Momentum is still 6 kg·m/s, but 3 J (a third) of the kinetic energy has turned into heat and deformation.</Answer>
          <Fig>
            <Collide title="A 2 kg cart at 3 m/s sticks to a 1 kg cart at rest; kinetic energy drops by a third" m1={2} u1={3} m2={1} u2={0} e={0} showKE />
          </Fig>
        </Example>

        <Example n={4} title="A bouncing ball">
          <p className="ex-q">A ball is dropped from 2 m onto the floor and has a coefficient of restitution of 0.8. How fast does it hit the floor, how fast does it leave it, and how high does it rise?</p>
          <Given items={['h = 2 "m"', 'e = 0.8', 'g = 9.8 "m/s²"']} />
          <ol className="steps">
            <Step title="Speed on arrival">
              <Eq src='v = √[ 2 · g · h ] = √[ 2 · 9.8 · 2 ] = 6.26 "m/s"' />
            </Step>
            <Step title="Speed on leaving">
              <Eq src='e · v = 0.8 · 6.26 = 5.01 "m/s"' />
            </Step>
            <Step title="Height reached">
              <Eq src='h _1 = [ ( e · v ) ^2 | 2 · g ] = [ 5.01 ^2 | 19.6 ] = 1.28 "m"' />
              <p>The same result comes straight from <M>h _1 = e ^2 · h = 0.64 · 2</M>. After the second bounce it is <M>0.64 · 1.28 = 0.819 "m"</M>.</p>
            </Step>
          </ol>
          <Answer>It arrives at 6.26 m/s, leaves at 5.01 m/s and rises to 1.28 m. The next peak is 0.819 m.</Answer>
          <Fig>
            <Bounce e={0.8} h={2} title="A ball dropped from 2 metres rebounds to 1.28 metres, then 0.82 metres" />
          </Fig>
        </Example>

        <Example n={5} title="A ballistic pendulum">
          <p className="ex-q">A 10 g bullet is fired into a 2 kg block hanging from strings. The block (with the bullet) swings up 5 cm. How fast was the bullet?</p>
          <Given items={['m = 0.01 "kg"', 'M = 2 "kg"', 'h = 0.05 "m"']} />
          <ol className="steps">
            <Step title="Stage 2: the swing (energy)">
              <Eq src='V = √[ 2 · g · h ] = √[ 2 · 9.8 · 0.05 ] = 0.990 "m/s"' />
            </Step>
            <Step title="Stage 1: the impact (momentum)">
              <Eq src='m · v = ( m + M ) · V' />
            </Step>
            <Step title="Solve for the bullet speed">
              <Eq src='v = [ m + M | m ] · V = [ 2.01 | 0.01 ] · 0.990 = 199 "m/s"' />
            </Step>
          </ol>
          <Answer>About 199 m/s. Right after the impact only <M>[ 0.985 | 198 ]</M>, about 0.5%, of the bullet's kinetic energy is left: the rest was lost in the block.</Answer>
          <Fig>
            <Pendulum title="A 10 gram bullet at 199 metres per second makes a 2 kilogram block swing up 5 centimetres" />
          </Fig>
        </Example>

        <Example n={6} title="A collision in two dimensions">
          <p className="ex-q">A 2 kg ball moving east at 3 m/s hits a 1 kg ball moving north at 4 m/s. They stick. Find their velocity: speed and direction.</p>
          <Given items={['m _1 = 2 "kg"', 'u _1 = 3 "m/s east"', 'm _2 = 1 "kg"', 'u _2 = 4 "m/s north"']} />
          <ol className="steps">
            <Step title="Momentum along x (east)">
              <Eq src='2 · 3 = 3 · v _x  ,  v _x = 2 "m/s"' />
            </Step>
            <Step title="Momentum along y (north)">
              <Eq src='1 · 4 = 3 · v _y  ,  v _y = 1.33 "m/s"' />
            </Step>
            <Step title="Combine the parts">
              <Eq src={['v = √[ 2 ^2 + 1.33 ^2 ] = 2.40 "m/s"', 'tan φ = [ 1.33 | 2 ] = 0.667 ,  φ = 33.7°']} />
            </Step>
          </ol>
          <Answer>They leave at 2.40 m/s, 33.7° north of east. Kinetic energy falls from 17 J to 8.67 J.</Answer>
          <Fig>
            <Stick2D />
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Adding momenta like plain numbers" wrong="p = 6 + 6 = 12" fig={<Collide title="Two equal carts approach at the same speed and stop; their momenta cancel" m1={2} u1={3} m2={2} u2={-3} e={0} height={230} />}>
            Momentum is a vector. Two equal carts head on carry <M>+6</M> and <M>−6</M>, so the total is zero, and they can stop dead without breaking any law.
          </Mistake>
          <Mistake title="Energy is conserved as well" wrong={'KE _before = KE _after'} fig={<Collide title="Carts stick: the momentum is the same but the kinetic energy drops" m1={3} u1={4} m2={1} u2={0} e={0} showKE />}>
            Momentum is conserved in every collision with no outside force. Kinetic energy is conserved only when the collision is elastic. When bodies stick, a lot of it is lost.
          </Mistake>
          <Mistake title="A bounce leaves the momentum the same" wrong="Δp = 0" fig={<WallBounce />}>
            The direction reverses, so the momentum does too: <M>p</M> goes from <M>+4</M> to <M>−4</M>, a change of <M>−8</M>. The wall (and the Earth under it) takes the other part.
          </Mistake>
          <Mistake title="Same momentum change needs the same force" wrong={'F = [ Δp | Δt ] "does not depend on time"'} fig={<EqualAreas height={210} />}>
            The change of momentum fixes only the <em>area</em> under the force-time graph. Stopping in a longer time means a smaller average force, so crumple zones and cushions save you.
          </Mistake>
          <Mistake title="The bounce height is h times e" wrong="h _1 = e · h" fig={<Bounce e={0.5} h={2} showWrong height={230} title="With e = 0.5 the ball rises to a quarter of the height, not half" />}>
            <M>e</M> compares speeds, and height goes as speed squared, so <M>h _1 = e ^2 · h</M>. With <M>e = 0.5</M> the ball rises to a quarter of its height, not a half.
          </Mistake>
          <Mistake title="Using energy across the whole ballistic pendulum" wrong={'½ · m · v ^2 = ( m + M ) · g · h'} fig={<Pendulum height={250} title="Momentum is conserved in the impact; energy is conserved only in the swing" />}>
            The embedding is a perfectly inelastic collision, and most of the energy is lost in it. Use momentum for the impact, then energy for the swing.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Forces come and go, but the total momentum stays the same.</p>
        <p className="closing-sub">Next: the same idea for spinning things, where it returns as the conservation of angular momentum.</p>
      </footer>
    </ChapterShell>
  );
}
