import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Fig } from '../kit/Anim';
import { Mistake, Mistakes } from '../kit/Mistake';
import {
  BulkCube,
  BulkSign,
  CableThickness,
  CraneCable,
  DeepCube,
  DuctileBrittle,
  EnergyBars,
  EnergyStretch,
  HalfFactor,
  HookeLimit,
  HookeMaterials,
  IBeam,
  LoadRelease,
  Poisson,
  ShearBlock,
  StiffNotElastic,
  StressNotForce,
  StressStrainCurve,
  StretchWire,
  TensionCompression,
  ThreeMaterials,
  TwoWires,
  WireZoom,
  YNotSize,
} from './Scenes';

/** Elasticity: stress, strain, the moduli and the energy in a stretched wire, with animated diagrams and worked examples. */

const SECTIONS: NoteSection[] = [
  { id: 'elastic', title: 'Elastic and plastic', group: 'Theory' },
  { id: 'stress', title: 'Stress and strain', group: 'Theory' },
  { id: 'hooke', title: "Hooke's law and Young's modulus", group: 'Theory' },
  { id: 'curve', title: 'The stress–strain curve', group: 'Theory' },
  { id: 'ductile', title: 'Ductile and brittle', group: 'Theory' },
  { id: 'shear', title: 'Shear and the shear modulus', group: 'Theory' },
  { id: 'bulk', title: 'Volume and the bulk modulus', group: 'Theory' },
  { id: 'poisson', title: "Poisson's ratio", group: 'Theory' },
  { id: 'energy', title: 'Energy in a stretched wire', group: 'Theory' },
  { id: 'cables', title: 'Cables and the safety factor', group: 'Theory' },
  { id: 'beams', title: 'Beams and I-girders', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="solids" sections={SECTIONS} sideTitle="Elasticity" sideLead="Why solids stretch and spring back, how to measure how stiff they are, and why a bridge or a crane cable does not break.">
      <header className="article-head">
        <span className="kicker">Physics · Properties of matter</span>
        <h1 className="article-title">Why does a steel wire spring back?</h1>
        <p className="article-lead">No solid is perfectly rigid. Pull, push or twist anything and it deforms a little, and if the force is gentle enough it springs back. This chapter measures that deformation with stress and strain, and uses it to design cables and beams.</p>
      </header>

      <section className="t-section" id="t-elastic">
        <SectionHead n={no('elastic')} title="Elastic and plastic" />
        <p>
          The atoms of a solid sit in fixed places, held by bonds that act like tiny springs. Apply a force and the atoms shift a little: the body is <strong>deformed</strong>. Take the force away and the bonds pull the atoms back. A body that returns to its original size and shape is called <strong>elastic</strong>, and this property is <strong>elasticity</strong>.
        </p>
        <Fig caption="The spring and the steel wire are loaded and unloaded along the same line. The rubber band returns too, but along a different path: it is elastic, though not in a straight line.">
          <ThreeMaterials />
        </Fig>
        <p>
          Elasticity has a limit. Pull hard enough and the atoms slide past each other into new places. When the force is removed the body does not come back fully: it stays deformed. This is <strong>plastic</strong> behaviour. The largest deformation from which a body still recovers is set by its <strong>elastic limit</strong>.
        </p>
        <Fig caption="Left: a small load, and the wire returns. Right: a load past the elastic limit, and the wire is permanently longer.">
          <LoadRelease />
        </Fig>
        <Note label="Remember">Elastic does not mean stretchy. Steel is far more elastic than rubber in the physics sense: it returns perfectly over a bigger range of stress. Rubber just stretches a lot.</Note>
      </section>

      <section className="t-section" id="t-stress">
        <SectionHead n={no('stress')} title="Stress and strain" />
        <p>
          The same load stretches a thin wire more than a thick one, and a long wire more than a short one. So force and extension alone say little about the <em>material</em>. We need two ratios that do not depend on the size of the sample.
        </p>
        <p>
          <strong>Stress</strong> is the restoring force per unit area, the force spread over the cross-section <M>A</M>. For a wire pulled by a force <M>F</M> along its length,
        </p>
        <Eq src='σ = [ F | A ]'>
          <span className="eq-note">unit: 1 "Pa" = 1 "N/m²"</span>
        </Eq>
        <p>
          <strong>Strain</strong> is the fractional change in size: the change divided by the original value. For a stretch <M>ΔL</M> of a wire of length <M>L</M>,
        </p>
        <Eq src='ε = [ ΔL | L ]'>
          <span className="eq-note">a ratio of two lengths, so it has no unit</span>
        </Eq>
        <Fig caption="Load, stress, strain and extension for a wire as it is loaded. Doubling the load doubles all four.">
          <StretchWire />
        </Fig>
        <p>
          Stress is a pull or push on <em>each square metre</em> of a cross-section, and strain says how much each metre of material stretches. There are three kinds, depending on how the force acts:
        </p>
        <ul className="t-list">
          <li>
            <strong>Tensile or compressive</strong> stress and strain: the force is at right angles to the face, pulling it apart or pushing it together, and the length changes. Strain is <M>ΔL / L</M>.
          </li>
          <li>
            <strong>Shear</strong>: the force is along the face and the shape changes (section 6).
          </li>
          <li>
            <strong>Volume</strong> (bulk): a pressure acts on all faces and the volume changes (section 7).
          </li>
        </ul>
        <Fig caption="Pulled from both ends the bar gets longer (tension); pushed from both ends it gets shorter (compression). The dashed box is the original size.">
          <TensionCompression />
        </Fig>
      </section>

      <section className="t-section" id="t-hooke">
        <SectionHead n={no('hooke')} title="Hooke's law and Young's modulus" />
        <p>
          In 1676 Robert Hooke found that for small deformations the extension is proportional to the load. In the language of stress and strain:
        </p>
        <Eq src='stress ∝ strain'>
          <span>or, inserting a constant,</span>
        </Eq>
        <Eq src='Y = [ stress | strain ] = [ σ | ε ] = [ F / A | ΔL / L ] = [ F · L | A · ΔL ]'>
          <span className="eq-note">Y is Young's modulus, in pascals</span>
        </Eq>
        <p>
          <strong>Young's modulus</strong> <M>Y</M> belongs to the material, not to the particular wire. It is the stress needed to stretch a wire to twice its length if Hooke's law kept holding (it never does, but it is a handy way to feel the size). A large <M>Y</M> means a stiff material.
        </p>
        <Fig caption="Under the same stress steel strains least and aluminium most. The steepest line is the stiffest metal.">
          <HookeMaterials />
        </Fig>
        <p>Solving for the extension is what you do most often:</p>
        <Eq src='ΔL = [ F · L | A · Y ]'>
          <span>So a longer, thinner wire stretches more, and a stiffer one less. A wire behaves like a spring with constant <M>k = [ Y · A | L ]</M>.</span>
        </Eq>
        <Note label="Remember">Y is for stretching and squeezing along a line (solids only). Steel has about <M>2 × 10 ^11 "Pa"</M>, copper <M>1.1 × 10 ^11 "Pa"</M>, aluminium <M>0.7 × 10 ^11 "Pa"</M>, rubber only around <M>10 ^7 "Pa"</M>.</Note>
      </section>

      <section className="t-section" id="t-curve">
        <SectionHead n={no('curve')} title="The stress–strain curve" />
        <p>
          Hang more and more load on a wire and plot stress against strain. The curve for a ductile metal such as mild steel has a famous shape, and each landmark has a name.
        </p>
        <Fig caption="Watch the curve draw itself. The letters appear as the wire passes each point.">
          <StressStrainCurve />
        </Fig>
        <ul className="t-list">
          <li>
            <strong>O to P, proportional limit.</strong> A straight line: stress is proportional to strain, and Hooke's law holds. Its slope is <M>Y</M>.
          </li>
          <li>
            <strong>P to E, elastic limit.</strong> The line starts to bend, but the wire still returns to its original length when unloaded. Beyond E it will not.
          </li>
          <li>
            <strong>Y, yield point.</strong> The wire gives way: strain grows quickly with little extra stress, and the deformation is plastic. The stress here is the <strong>yield strength</strong>.
          </li>
          <li>
            <strong>Y to U, strain hardening.</strong> The metal gets harder to deform, and the curve climbs to its highest point, <strong>U</strong>. The stress at U is the <strong>ultimate tensile strength</strong>, the most the wire can ever carry.
          </li>
          <li>
            <strong>U to F, necking and fracture.</strong> The wire narrows at one spot (a neck). The cross-section is now smaller, so less load is needed to carry on, and the wire breaks at <strong>F</strong>, the fracture point.
          </li>
        </ul>
        <Note label="Remember">Past the elastic limit the wire does not retrace its path when unloaded; it returns along a line parallel to the straight part and ends with a permanent strain, as in section 1.</Note>
      </section>

      <section className="t-section" id="t-ductile">
        <SectionHead n={no('ductile')} title="Ductile and brittle" />
        <p>
          The shape of the curve sorts materials into two families.
        </p>
        <p>
          A <strong>ductile</strong> material, such as copper, aluminium, gold or mild steel, has a long plastic region. It can be drawn into wires and hammered into sheets, and it warns you before it fails: it stretches and necks. The area under its curve is large, so it absorbs a lot of energy before it breaks.
        </p>
        <p>
          A <strong>brittle</strong> material, such as glass, cast iron or ceramic, breaks soon after the elastic limit, with almost no plastic region and no warning. Its curve ends abruptly.
        </p>
        <Fig caption="The same pull on two specimens. The brittle one is gone by the time the ductile one has barely started to yield.">
          <DuctileBrittle />
        </Fig>
        <p>
          That is why bridges and cranes use ductile steel: if overloaded it bends and sags visibly, instead of shattering. Brittle materials are strong in compression but weak in tension, so concrete is reinforced with steel bars wherever it will be pulled.
        </p>
      </section>

      <section className="t-section" id="t-shear">
        <SectionHead n={no('shear')} title="Shear and the shear modulus" />
        <p>
          Push the top of a book sideways while the bottom stays on the table: the pages slide over one another and the book leans. A force <M>F</M> acting <em>along</em> a face of area <M>A</M> gives a <strong>shear stress</strong> <M>F / A</M>. The block's shape changes, but its volume does not.
        </p>
        <Fig caption="The top face moves a distance Δx relative to the base. The lean angle φ measures the shear strain.">
          <ShearBlock />
        </Fig>
        <p>
          The <strong>shear strain</strong> is the sideways shift divided by the height, which is the angle <M>φ</M> (in radians) of the lean when it is small:
        </p>
        <Eq src='shear strain = [ Δx | h ] = tan φ ≈ φ'>
          <span>and the <strong>shear modulus</strong> (also called the modulus of rigidity) is</span>
        </Eq>
        <Eq src='G = [ shear stress | shear strain ] = [ F / A | φ ] = [ F | A · φ ]' />
        <p>
          Liquids and gases cannot hold a shear stress: they just flow. So <M>G</M> belongs to solids only. For most metals <M>G</M> is about 0.4 of <M>Y</M>.
        </p>
      </section>

      <section className="t-section" id="t-bulk">
        <SectionHead n={no('bulk')} title="Volume and the bulk modulus" />
        <p>
          Now squeeze a body equally from all sides, as when it sinks in a deep sea. The pressure <M>p</M> (force per unit area, now on every face) changes its volume by <M>ΔV</M> but not its shape. The <strong>volume strain</strong> is <M>ΔV / V</M>, and the <strong>bulk modulus</strong> is
        </p>
        <Eq src='B = − [ p | ΔV / V ] = − [ p · V | ΔV ]'>
          <span className="eq-note">the minus sign makes B positive, since ΔV is negative when p is positive</span>
        </Eq>
        <Fig caption="The pressure arrows act on every face. The cube shrinks in size without changing shape; the dashed outline is the original.">
          <BulkCube />
        </Fig>
        <p>
          The reciprocal of the bulk modulus is the <strong>compressibility</strong> <M>k = 1 / B</M>, the fractional change in volume per unit pressure. Solids and liquids have a large <M>B</M>, so they are almost incompressible. Gases are easy to squeeze, so their <M>B</M> is tiny.
        </p>
        <Note label="Remember">Typical values: steel <M>B = 1.6 × 10 ^11 "Pa"</M>, water <M>2.2 × 10 ^9 "Pa"</M>. Unlike Young's and shear moduli, <M>B</M> is defined for liquids and gases too.</Note>
      </section>

      <section className="t-section" id="t-poisson">
        <SectionHead n={no('poisson')} title="Poisson's ratio" />
        <p>
          Stretch a rubber strip and it gets thinner. The same is true, much more weakly, of a wire. A tensile strain along the length is accompanied by a <strong>lateral strain</strong> across it, of opposite sign. <strong>Poisson's ratio</strong> is their ratio:
        </p>
        <Eq src='ν = − [ lateral strain | longitudinal strain ] = − [ Δd / d | ΔL / L ]' />
        <Fig caption="Longer by ε, thinner by ν · ε. For most metals ν is about 0.3.">
          <Poisson />
        </Fig>
        <p>
          It is a pure number. For most materials it lies between 0 and 0.5, and 0.5 would be a material that keeps its volume exactly. Together with <M>Y</M> it ties the three moduli: only two of <M>Y</M>, <M>G</M>, <M>B</M> and <M>ν</M> are independent.
        </p>
      </section>

      <section className="t-section" id="t-energy">
        <SectionHead n={no('energy')} title="Energy in a stretched wire" />
        <p>
          Stretching a wire takes work, and in the elastic region that work is stored in the bonds, like the energy in a spring. The pull grows from zero to <M>F</M> as the wire extends from zero to <M>x</M>, so the work is the <em>area</em> under the load–extension graph, a triangle:
        </p>
        <Eq src='U = ½ · F · x' />
        <Fig caption="The shaded triangle grows with the extension. Its area is the stored energy, half of the box F times x.">
          <EnergyStretch />
        </Fig>
        <p>
          Put <M>F = σ · A</M> and <M>x = ε · L</M>. Since <M>A · L</M> is the volume <M>V</M> of the wire,
        </p>
        <Eq src='U = ½ · σ · ε · V'>
          <span>so the energy per unit volume does not depend on the size of the wire:</span>
        </Eq>
        <Eq src='u = [ U | V ] = ½ · σ · ε = [ σ ^2 | 2 · Y ]' />
        <p>
          This is why a spring or a wire can be a store of energy, and why the area under the whole stress–strain curve tells how much energy a material absorbs before it breaks.
        </p>
      </section>

      <section className="t-section" id="t-cables">
        <SectionHead n={no('cables')} title="Cables and the safety factor" />
        <p>
          A crane cable must never reach its breaking stress, or even its elastic limit, or it would be permanently stretched. Engineers choose a working stress well below the breaking stress. The ratio is the <strong>safety factor</strong>:
        </p>
        <Eq src='safety factor = [ breaking stress | working stress ]' />
        <p>
          A cable is also under a bit more than the weight while the load is speeding up: the tension is <M>m · ( g + a )</M>. A thick cable is not just for the weight, it is for the jerks.
        </p>
        <Fig caption="The cable stress rises a little while the load speeds up and falls while it slows down. It stays far below the breaking value.">
          <CraneCable />
        </Fig>
        <p>
          Since the breaking force is proportional to the area, thicker cable carries more. A heavy crane uses many thin strands twisted together instead of one solid rod: the rope can then bend round a pulley without breaking, and a flaw in one strand does not break the others.
        </p>
      </section>

      <section className="t-section" id="t-beams">
        <SectionHead n={no('beams')} title="Beams and I-girders" />
        <p>
          A beam on two supports with a load in the middle bends. The top edge is squeezed (compression) and the bottom edge is stretched (tension). Along the middle, the <strong>neutral axis</strong>, the length does not change at all.
        </p>
        <p>
          So the material near the middle does almost nothing. The material at the very top and bottom does the work. That is why girders are I-shaped: two wide <strong>flanges</strong> far from the centre carry the squeeze and the stretch, joined by a thin <strong>web</strong> that holds them apart. The sag of a centrally loaded beam of length <M>L</M> is
        </p>
        <Eq src='δ = [ W · L ^3 | 48 · Y · I ]'>
          <span>where <M>I</M> is the second moment of area of the cross-section: <M>I = [ b · d ^3 | 12 ]</M> for a solid rectangle of breadth <M>b</M> and depth <M>d</M>. Depth counts as the cube!</span>
        </Eq>
        <Fig caption="Two beams use the same amount of steel and carry the same load W. The I-beam sags about six times less, because its steel is far from the neutral axis.">
          <IBeam />
        </Fig>
        <p>
          The same idea explains why a long beam is made deeper rather than wider, why a hollow tube is stiffer than a solid rod of the same mass, and why bridge girders and railway lines are I-shaped. Saving the steel in the middle makes them lighter at almost no loss of strength.
        </p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Stress', 'σ = [ F | A ]'],
                  ['Longitudinal strain', 'ε = [ ΔL | L ]'],
                  ["Young's modulus", 'Y = [ σ | ε ] = [ F · L | A · ΔL ]'],
                  ['Extension of a wire', 'ΔL = [ F · L | A · Y ]'],
                  ['Wire as a spring', 'k = [ Y · A | L ]'],
                  ['Shear strain', 'φ ≈ tan φ = [ Δx | h ]'],
                  ['Shear modulus', 'G = [ F / A | φ ]'],
                  ['Bulk modulus', 'B = − [ p | ΔV / V ]'],
                  ['Compressibility', 'k = [ 1 | B ]'],
                  ["Poisson's ratio", 'ν = − [ lateral strain | longitudinal strain ]'],
                  ['Energy stored in a wire', 'U = ½ · F · x = ½ · σ · ε · V'],
                  ['Energy per unit volume', 'u = ½ · σ · ε = [ σ ^2 | 2 · Y ]'],
                  ['Safety factor', 'n = [ breaking stress | working stress ]'],
                  ['Sag of a centrally loaded beam', 'δ = [ W · L ^3 | 48 · Y · I ]'],
                  ['Second moment, rectangle', 'I = [ b · d ^3 | 12 ]'],
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
                  ['σ', 'Stress', 'Pa'],
                  ['ε', 'Strain', ''],
                  ['F', 'Force', 'N'],
                  ['A', 'Cross-section area', 'm²'],
                  ['L', 'Original length', 'm'],
                  ['ΔL', 'Extension', 'm'],
                  ['Y', "Young's modulus", 'Pa'],
                  ['G', 'Shear modulus', 'Pa'],
                  ['B', 'Bulk modulus', 'Pa'],
                  ['ν', "Poisson's ratio", ''],
                  ['U', 'Elastic energy', 'J'],
                  ['u', 'Elastic energy per volume', 'J/m³'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
                  <td>{meaning}</td>
                  <td>{unit ? <M>{`"${unit}"`}</M> : 'none'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="t-h3">Typical values</h3>
        <div className="t-table-wrap">
          <table className="t-table t-symbols">
            <thead>
              <tr>
                <th scope="col">Material</th>
                <th scope="col">Y (Pa)</th>
                <th scope="col">G (Pa)</th>
                <th scope="col">B (Pa)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Steel</th>
                <td><M>2.0 × 10 ^11</M></td>
                <td><M>0.8 × 10 ^11</M></td>
                <td><M>1.6 × 10 ^11</M></td>
              </tr>
              <tr>
                <th scope="row">Copper</th>
                <td><M>1.1 × 10 ^11</M></td>
                <td><M>0.42 × 10 ^11</M></td>
                <td><M>1.4 × 10 ^11</M></td>
              </tr>
              <tr>
                <th scope="row">Aluminium</th>
                <td><M>0.7 × 10 ^11</M></td>
                <td><M>0.26 × 10 ^11</M></td>
                <td><M>0.7 × 10 ^11</M></td>
              </tr>
              <tr>
                <th scope="row">Water</th>
                <td>none</td>
                <td>none</td>
                <td><M>2.2 × 10 ^9</M></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="A steel wire under a load">
          <p className="ex-q">A steel wire 2 m long with a cross-section of 1 mm² carries a load of 100 N. Find the stress, the strain and the extension. Take <M>Y = 2 × 10 ^11 "Pa"</M>.</p>
          <Given items={['L = 2 "m"', 'A = 1 "mm²" = 1 × 10 ^−6 "m²"', 'F = 100 "N"', 'Y = 2 × 10 ^11 "Pa"']} />
          <ol className="steps">
            <Step title="Stress is force per area">
              <Eq src='σ = [ F | A ] = [ 100 | 1 × 10 ^−6 ] = 1 × 10 ^8 "Pa"' />
            </Step>
            <Step title="Strain from the modulus">
              <Eq src='ε = [ σ | Y ] = [ 1 × 10 ^8 | 2 × 10 ^11 ] = 5 × 10 ^−4' />
            </Step>
            <Step title="Extension is strain times length">
              <Eq src='ΔL = ε · L = 5 × 10 ^−4 · 2 = 1 × 10 ^−3 "m"' />
            </Step>
          </ol>
          <Answer>Stress 100 MPa, strain <M>5 × 10 ^−4</M> (0.05%) and an extension of 1 mm: a 2 m wire hardly stretches. As a check, the wire acts as a spring of constant <M>k = Y · A / L = 1 × 10 ^5 "N/m"</M>, and <M>100 / 10 ^5 = 1 "mm"</M>.</Answer>
          <Fig>
            <WireZoom />
          </Fig>
        </Example>

        <Example n={2} title="A sheared steel block">
          <p className="ex-q">A steel cube of side 10 cm has a force of 10 000 N applied along its top face, while the bottom face is held fixed. Find the shear stress, the shear angle and the sideways shift of the top face. Take <M>G = 8 × 10 ^10 "Pa"</M>.</p>
          <Given items={['h = 0.10 "m"', 'A = 0.01 "m²"', 'F = 1 × 10 ^4 "N"', 'G = 8 × 10 ^10 "Pa"']} />
          <ol className="steps">
            <Step title="Shear stress">
              <Eq src='[ F | A ] = [ 1 × 10 ^4 | 0.01 ] = 1 × 10 ^6 "Pa"' />
            </Step>
            <Step title="Shear angle from G">
              <Eq src='φ = [ F / A | G ] = [ 1 × 10 ^6 | 8 × 10 ^10 ] = 1.25 × 10 ^−5 "rad"' />
            </Step>
            <Step title="Sideways shift of the top">
              <Eq src='Δx = φ · h = 1.25 × 10 ^−5 · 0.10 = 1.25 × 10 ^−6 "m"' />
            </Step>
          </ol>
          <Answer>Shear stress 1.00 MPa, shear angle <M>1.25 × 10 ^−5 "rad"</M> (about 0.0007°) and a shift of 1.25 µm. Steel is very rigid against shear.</Answer>
          <Fig>
            <ShearBlock numbers />
          </Fig>
        </Example>

        <Example n={3} title="A cube deep in the sea">
          <p className="ex-q">A steel cube of volume 1000 cm³ sinks to a depth where the extra pressure is <M>1.0 × 10 ^8 "Pa"</M> (about 10 km down). By how much does its volume shrink? Take <M>B = 1.6 × 10 ^11 "Pa"</M>.</p>
          <Given items={['V = 1 × 10 ^−3 "m³"', 'p = 1.0 × 10 ^8 "Pa"', 'B = 1.6 × 10 ^11 "Pa"']} />
          <ol className="steps">
            <Step title="Volume strain from the bulk modulus">
              <Eq src='[ ΔV | V ] = − [ p | B ] = − [ 1.0 × 10 ^8 | 1.6 × 10 ^11 ] = − 6.25 × 10 ^−4' />
            </Step>
            <Step title="The change in volume">
              <Eq src='ΔV = − 6.25 × 10 ^−4 · 1 × 10 ^−3 = − 6.25 × 10 ^−7 "m³"' />
            </Step>
            <Step title="In cubic centimetres">
              <p>One cubic metre is 10⁶ cm³, so this is 0.625 cm³.</p>
            </Step>
          </ol>
          <Answer>The volume falls by 0.0625%, which is 0.625 cm³ out of 1000. Steel is nearly incompressible even at ten kilometres. The compressibility is <M>1 / B = 6.25 × 10 ^−12 "Pa" ^−1</M>.</Answer>
          <Fig>
            <DeepCube />
          </Fig>
        </Example>

        <Example n={4} title="Energy in the stretched wire">
          <p className="ex-q">Find the elastic energy stored in the wire of Example 1, in two ways: from force and extension, and from stress, strain and volume.</p>
          <Given items={['F = 100 "N"', 'ΔL = 1 × 10 ^−3 "m"', 'σ = 1 × 10 ^8 "Pa"', 'ε = 5 × 10 ^−4', 'V = A · L = 2 × 10 ^−6 "m³"']} />
          <ol className="steps">
            <Step title="Half of force times extension">
              <Eq src='U = ½ · F · ΔL = ½ · 100 · 1 × 10 ^−3 = 0.0500 "J"' />
            </Step>
            <Step title="Half of stress times strain times volume">
              <Eq src='U = ½ · σ · ε · V = ½ · 1 × 10 ^8 · 5 × 10 ^−4 · 2 × 10 ^−6 = 0.0500 "J"' />
            </Step>
            <Step title="Per unit volume">
              <Eq src='u = [ U | V ] = [ 0.05 | 2 × 10 ^−6 ] = 2.5 × 10 ^4 "J/m³"' />
            </Step>
          </ol>
          <Answer>0.050 J (50 mJ) either way, which is 25 000 J per cubic metre. Not the 0.10 J you get by multiplying <M>F · ΔL</M>: the force grew from zero, so only half applies on average.</Answer>
          <Fig>
            <EnergyBars />
          </Fig>
        </Example>

        <Example n={5} title="A crane cable">
          <p className="ex-q">A crane must lift a 2000 kg container using a steel cable whose breaking stress is <M>5 × 10 ^8 "Pa"</M>. With a safety factor of 5, what diameter must the cable have? Take <M>g = 9.8 "m/s²"</M>.</p>
          <Given items={['m = 2000 "kg"', 'σ _break = 5 × 10 ^8 "Pa"', 'n = 5']} />
          <ol className="steps">
            <Step title="Working stress">
              <Eq src='σ _work = [ σ _break | n ] = [ 5 × 10 ^8 | 5 ] = 1 × 10 ^8 "Pa"' />
            </Step>
            <Step title="Force in the cable at rest">
              <Eq src='F = m · g = 2000 · 9.8 = 1.96 × 10 ^4 "N"' />
            </Step>
            <Step title="Area needed">
              <Eq src='A = [ F | σ _work ] = [ 1.96 × 10 ^4 | 1 × 10 ^8 ] = 1.96 × 10 ^−4 "m²"' />
            </Step>
            <Step title="Diameter from the circle area">
              <Eq src='d = √[ [ 4 · A | π ] ] = √[ [ 4 · 1.96 × 10 ^−4 | π ] ] = 1.58 × 10 ^−2 "m"' />
            </Step>
          </ol>
          <Answer>The cable should be at least 15.8 mm in diameter (a cross-section of 196 mm²). Under this working stress, 30 m of cable stretches by <M>ε · L = 5 × 10 ^−4 · 30 = 15 "mm"</M>, well within the elastic range.</Answer>
          <Fig>
            <CableThickness />
          </Fig>
        </Example>

        <Example n={6} title="Two wires, one load">
          <p className="ex-q">Two wires of the same material carry the same load. Wire 1 has length <M>L</M> and radius <M>2 · r</M>. Wire 2 has length <M>2 · L</M> and radius <M>r</M>. Compare their extensions.</p>
          <Given items={['L _1 = L, r _1 = 2 · r', 'L _2 = 2 · L, r _2 = r', 'F _1 = F _2, Y _1 = Y _2']} />
          <ol className="steps">
            <Step title="Extension of a round wire">
              <Eq src='ΔL = [ F · L | A · Y ] = [ F · L | π · r ^2 · Y ]' />
              <p>With <M>F</M> and <M>Y</M> the same, <M>ΔL</M> is proportional to <M>L / r ^2</M>.</p>
            </Step>
            <Step title="Take the ratio">
              <Eq src='[ ΔL _1 | ΔL _2 ] = [ L _1 | L _2 ] · [ r _2 ^2 | r _1 ^2 ] = [ L | 2 · L ] · [ r ^2 | 4 · r ^2 ] = [ 1 | 8 ]' />
            </Step>
          </ol>
          <Answer>The extensions are in the ratio 1 : 8. The longer wire stretches twice as much because of its length, and the thinner one four times as much because its area is a quarter.</Answer>
          <Fig>
            <TwoWires />
          </Fig>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Stress is just the force" wrong="σ = F" fig={<StressNotForce />}>
            Stress is force <em>per area</em>. The same load on a thin wire means a larger stress, so the thin wire breaks first.
          </Mistake>
          <Mistake title="Young's modulus depends on the wire" wrong="Y ∝ L" fig={<YNotSize />}>
            A wire twice as long stretches twice as much, but its strain is the same under the same stress. <M>Y</M> is a property of the material, so length and thickness drop out.
          </Mistake>
          <Mistake title="Steel is less elastic than rubber" wrong={'"rubber is more elastic"'} fig={<StiffNotElastic />}>
            Rubber stretches far more under the same stress, but steel is the stiffer material and returns exactly over a larger range. Elastic means it comes back, not that it stretches a lot.
          </Mistake>
          <Mistake title="Dropping the minus sign in B" wrong="B = [ p | ΔV / V ]" fig={<BulkSign />}>
            A positive pressure makes <M>ΔV</M> negative. The minus sign in <M>B = − p / ( ΔV / V )</M> is what keeps the bulk modulus positive.
          </Mistake>
          <Mistake title="Hooke's law holds right up to breaking" wrong={'σ ∝ ε "up to fracture"'} fig={<HookeLimit />}>
            Stress is proportional to strain only up to the proportional limit. Beyond it the curve bends, and using <M>Y</M> there gives the wrong strain.
          </Mistake>
          <Mistake title="Forgetting the half" wrong="U = F · x" fig={<HalfFactor />}>
            The force grows from zero as the wire stretches, so the work is the area of a triangle: <M>U = ½ · F · x</M>. Using the full force <M>F</M> over the whole extension doubles the answer.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Stress is force per area, strain is the fractional change, and the modulus is how stiff the material is.</p>
        <p className="closing-sub">Next: solids hold their shape, but fluids do not. Fluids come next: pressure, buoyancy and flow.</p>
      </footer>
    </ChapterShell>
  );
}
