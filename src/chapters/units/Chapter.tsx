import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { AddAlign, AreaScale, Balance, ConvertChain, DerivedWeb, DimsMiss, Fermi, Measure, Prefixes, Rounding, Scales, SiBase, SigDigits, Solve, TwoNm } from './UnitsAnims';

/** Units and measurement: SI units, significant figures, dimensions and orders of magnitude. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'A number and a unit', group: 'Theory' },
  { id: 'si', title: 'The SI base units', group: 'Theory' },
  { id: 'derived', title: 'Derived units', group: 'Theory' },
  { id: 'prefixes', title: 'Prefixes and converting', group: 'Theory' },
  { id: 'sigfigs', title: 'Significant figures', group: 'Theory' },
  { id: 'rounding', title: 'Rounding and calculating', group: 'Theory' },
  { id: 'dimensions', title: 'Dimensions', group: 'Theory' },
  { id: 'check', title: 'Checking a formula', group: 'Theory' },
  { id: 'derive', title: 'Deriving a formula', group: 'Theory' },
  { id: 'magnitude', title: 'Order of magnitude', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="units" film={buildFilm} sections={SECTIONS} sideTitle="Units and measurement" sideLead="How physics writes down the world: the units we agree on, how many digits to trust, and the quiet power of checking a formula by its dimensions.">
      <header className="article-head">
        <span className="kicker">Physics · Units and measurement</span>
        <h1 className="article-title">How do we say how much?</h1>
        <p className="article-lead">Every number in physics is a promise to compare something with an agreed standard. This chapter is about the standards (the SI units), how honestly to write a number down (significant figures), and a surprising trick: you can often check, and even find, a formula just by looking at its units.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="A number and a unit" />
        <p>
          To measure something is to compare it with a standard of the same kind, called a <strong>unit</strong>. The result is a <strong>number</strong> telling how many of those units fit. So every measured quantity <M>Q</M> is a product of two things:
        </p>
        <Eq src='Q = n · u' />
        <p>
          where <M>n</M> is the number and <M>u</M> the unit. A number alone means nothing. &ldquo;The table is 1.2 long&rdquo; leaves the reader asking: 1.2 what? Metres, feet, or hand-spans?
        </p>
        <p>
          Change the unit and the number changes to match, but the quantity itself, the actual length of the bar, does not:
        </p>
        <Eq src='1.2 "m" = 120 "cm" = 1200 "mm"' />
        <figure className="t-figure">
          <Measure />
          <figcaption>The bar stays the same. A smaller unit fits more times along it, so the number grows. Always write the unit with the number.</figcaption>
        </figure>
        <p>
          Why do we need a world-wide standard at all? If every country used its own foot, a bolt made in one place would not fit a nut made in another. The <strong>International System of Units</strong>, the <strong>SI</strong>, is the agreed set that scientists everywhere use. It is built from a few <strong>base units</strong>, and every other unit is made from them.
        </p>
        <Note label="In this chapter">Physical quantities that can be written as a number times a unit are all around us, from the length of a table to the speed of light. The same rules about units, digits and dimensions apply to every one.</Note>
      </section>

      <section className="t-section" id="t-si">
        <SectionHead n={no('si')} title="The SI base units" />
        <p>
          Nature gives us many different kinds of quantity, but a small set is enough to build all the rest. The SI picks seven <strong>base quantities</strong>, each with one base unit:
        </p>
        <figure className="t-figure">
          <SiBase />
          <figcaption>The seven base units. Each little picture moves the way its quantity can change: a length growing, a balance tipping, a clock ticking, charge flowing, a column of mercury rising, particles being counted, a lamp pulsing.</figcaption>
        </figure>
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Quantity</th>
                <th scope="col">Unit</th>
                <th scope="col">Symbol</th>
                <th scope="col">What fixes it</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['Length', 'metre', 'm', 'Light travels 299 792 458 m in one second'],
                  ['Mass', 'kilogram', 'kg', 'The Planck constant is exactly 6.62607015 × 10⁻³⁴ J s'],
                  ['Time', 'second', 's', 'The caesium-133 clock ticks 9 192 631 770 times a second'],
                  ['Electric current', 'ampere', 'A', 'The elementary charge is exactly 1.602176634 × 10⁻¹⁹ C'],
                  ['Temperature', 'kelvin', 'K', 'The Boltzmann constant is exactly 1.380649 × 10⁻²³ J/K'],
                  ['Amount of substance', 'mole', 'mol', 'One mole holds exactly 6.02214076 × 10²³ particles'],
                  ['Luminous intensity', 'candela', 'cd', 'Fixed by the light output of a defined source'],
                ] as const
              ).map(([q, name, sym, how]) => (
                <tr key={q}>
                  <th scope="row">{q}</th>
                  <td>{name}</td>
                  <td>
                    <M>{`"${sym}"`}</M>
                  </td>
                  <td>{how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The kilogram is the odd one out: it is the only base unit with a prefix in its name. The gram is not the base unit. Two more units, the <strong>radian</strong> (plane angle) and the <strong>steradian</strong> (solid angle), are treated as dimensionless supplementary units.
        </p>
        <p>
          Today every base unit is defined by fixing the value of a constant of nature, such as the speed of light <M>c = 2.998 × 10 ^8 "m/s"</M>. Defining units this way means that anyone, anywhere, with the right equipment, can reproduce the standard, with no object kept in a vault.
        </p>
      </section>

      <section className="t-section" id="t-derived">
        <SectionHead n={no('derived')} title="Derived units" />
        <p>
          Every other quantity is made by multiplying and dividing base quantities, and its unit is made the same way. Speed is distance over time, so its unit is metres per second. Acceleration is a change of speed per second, so it is metres per second squared:
        </p>
        <Eq src={['"unit of v" = "m" / "s"', '"unit of a" = "m/s" / "s" = "m/s²"']} />
        <p>
          Some derived units are used so often that they get their own name. The newton comes from <M>F = m · a</M>. A force of one newton gives a mass of one kilogram an acceleration of one metre per second squared. Work is force times distance, so the joule follows from the newton:
        </p>
        <Eq src={['1 "N" = 1 "kg" · 1 "m/s²"', '1 "J" = 1 "N" · 1 "m" = 1 "kg" · "m²/s²"']} />
        <figure className="t-figure">
          <DerivedWeb />
          <figcaption>Watch the base units on the left send their share into each derived unit on the right. Force needs all three; speed needs only the metre and the second.</figcaption>
        </figure>
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col">Quantity</th>
                <th scope="col">Unit</th>
                <th scope="col">In base units</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['Force', 'newton, N', 'kg m s⁻²'],
                  ['Energy, work', 'joule, J = N m', 'kg m² s⁻²'],
                  ['Power', 'watt, W = J/s', 'kg m² s⁻³'],
                  ['Pressure', 'pascal, Pa = N/m²', 'kg m⁻¹ s⁻²'],
                  ['Frequency', 'hertz, Hz', 's⁻¹'],
                  ['Electric charge', 'coulomb, C = A s', 'A s'],
                  ['Potential difference', 'volt, V = J/C', 'kg m² s⁻³ A⁻¹'],
                ] as const
              ).map(([q, u, base]) => (
                <tr key={q}>
                  <th scope="row">{q}</th>
                  <td>{u}</td>
                  <td>{base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Units, like numbers, can be multiplied and cancelled. Keeping the units in every line of a calculation is the cheapest check you have: if the units of your answer are not the units of the quantity you wanted, the working is wrong somewhere.
        </p>
      </section>

      <section className="t-section" id="t-prefixes">
        <SectionHead n={no('prefixes')} title="Prefixes and converting" />
        <p>
          A kilometre and a nanometre measure the same kind of thing, but the numbers would be absurd in metres. So we attach a <strong>prefix</strong> that stands for a power of ten:
        </p>
        <Eq src={['1 "km" = 10 ^3 "m"', '1 "mm" = 10 ^−3 "m"']} />
        <figure className="t-figure">
          <Prefixes />
          <figcaption>Each step up the ladder multiplies by a thousand. The marker climbs from nano to giga, and the equation under it updates.</figcaption>
        </figure>
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['tera, T', '10 ^12', 'centi, c', '10 ^−2'],
                  ['giga, G', '10 ^9', 'milli, m', '10 ^−3'],
                  ['mega, M', '10 ^6', 'micro, µ', '10 ^−6'],
                  ['kilo, k', '10 ^3', 'nano, n', '10 ^−9'],
                ] as const
              ).map(([a, ea, b, eb]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td>
                    <M>{ea}</M>
                  </td>
                  <th scope="row">{b}</th>
                  <td>
                    <M>{eb}</M>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="t-h3">Converting from one unit to another</h3>
        <p>
          To change units, multiply by a fraction that equals 1. A fraction like <M>[ 1000 "m" | 1 "km" ]</M> equals 1, because top and bottom are the same length. Multiplying by 1 changes how the quantity is written, not what it is. Arrange the fraction so the unit you want to get rid of is on the opposite side and cancels:
        </p>
        <Eq src={['72 "km/h" = 72 · [ "km" | "h" ] · [ 1000 "m" | 1 "km" ] · [ 1 "h" | 3600 "s" ]', '72 "km/h" = 72 · [ 1000 "m" | 3600 "s" ] = 20 "m/s"']} />
        <figure className="t-figure">
          <ConvertChain />
          <figcaption>The units cross out like numbers. What is left is the unit you wanted.</figcaption>
        </figure>
        <p>
          A handy shortcut comes out of this: to go from km/h to m/s divide by 3.6, and to go back multiply by 3.6.
        </p>
        <p>
          Be careful with powers. A prefix on a unit that is squared or cubed is squared or cubed with it:
        </p>
        <Eq src='1 "cm" ^2 = ( 10 ^−2 "m" ) ^2 = 10 ^−4 "m" ^2' />
      </section>

      <section className="t-section" id="t-sigfigs">
        <SectionHead n={no('sigfigs')} title="Significant figures" />
        <p>
          A measurement is never exact, so the number of digits you write is a statement about how well you know it. Writing 2.50 m says &ldquo;I know this to the nearest centimetre&rdquo;, while 2.5 m says &ldquo;to the nearest decimetre&rdquo;. The digits that carry this information are the <strong>significant figures</strong>.
        </p>
        <ol className="steps">
          <Step title="Non-zero digits always count">
            <p>
              <M>4.56</M> has three significant figures.
            </p>
          </Step>
          <Step title="Zeros between digits count">
            <p>
              <M>3.0070</M> has five: the middle zeros are measured digits.
            </p>
          </Step>
          <Step title="Leading zeros never count">
            <p>
              <M>0.00450</M> has three. The zeros on the left only place the decimal point. Change the unit to 4.50 mm and they vanish.
            </p>
          </Step>
          <Step title="Trailing zeros count when there is a decimal point">
            <p>
              <M>62.0</M> has three, because the zero was measured. A bare <M>1200</M> is ambiguous. Write it in scientific notation to say what you mean.
            </p>
          </Step>
        </ol>
        <figure className="t-figure">
          <SigDigits />
          <figcaption>The digits light up one by one. Leading zeros stay dim, and the count underneath shows the significant figures.</figcaption>
        </figure>
        <p>Scientific notation removes the doubt, because every digit you write in front of the power of ten is significant:</p>
        <Eq src={['1.2 × 10 ^3 "(2 s.f.)"', '1.20 × 10 ^3 "(3 s.f.)"', '1.200 × 10 ^3 "(4 s.f.)"']} />
        <p>
          Exact numbers, such as a count of 5 coins or the 2 in <M>2 · π · r</M>, are not measured, so they have unlimited significant figures and never limit your answer.
        </p>
      </section>

      <section className="t-section" id="t-rounding">
        <SectionHead n={no('rounding')} title="Rounding and calculating" />
        <p>
          Round a number by looking at the first digit you will drop. If it is less than 5, leave the last kept digit alone. If it is more than 5, add one to it. If it is exactly 5, we round up in this book.
        </p>
        <figure className="t-figure">
          <Rounding />
          <figcaption>A value slides from 2.30 to 2.40. The closer end of the two is where it lands, and the switch happens at 2.35.</figcaption>
        </figure>
        <p>A calculated answer cannot be more reliable than the numbers that went into it. Two rules say how:</p>
        <p>
          <strong>Multiplying or dividing:</strong> the answer has as many significant figures as the factor that has the <em>fewest</em>.
        </p>
        <Eq src='4.56 × 1.4 = 6.384 ≈ 6.4' />
        <p>
          The 1.4 has two significant figures, so the product is given to two. The extra digits of 6.384 are noise.
        </p>
        <p>
          <strong>Adding or subtracting:</strong> line up the decimal points. The answer is only as precise as the number with the <em>fewest decimal places</em>.
        </p>
        <Eq src='12.11 + 18.0 + 1.013 = 31.123 ≈ 31.1' />
        <figure className="t-figure">
          <AddAlign />
          <figcaption>The decimal points line up. The number 18.0 stops at the tenths place, so the dashed line cuts the sum there.</figcaption>
        </figure>
        <Note label="Careful">Keep one or two extra digits in the middle of a long calculation and round only once, at the end. Rounding at every step lets small errors pile up.</Note>
      </section>

      <section className="t-section" id="t-dimensions">
        <SectionHead n={no('dimensions')} title="Dimensions" />
        <p>
          The <strong>dimension</strong> of a quantity says which base quantities it is built from, ignoring the unit. A length is a length whether it is in metres or miles, so its dimension is <M>"L"</M>. We use the capital letters M for mass, L for length and T for time (and I, Θ, N for current, temperature and amount of substance). The dimension of a quantity <M>Q</M> is written <M>"[Q]"</M>.
        </p>
        <p>
          Dimensions multiply and divide just like units. A speed is a length over a time:
        </p>
        <Eq src='"[v]" = [ "L" | "T" ] = "L T⁻¹"' />
        <p>
          Build up force and then energy and pressure the same way:
        </p>
        <Eq src={['"[F]" = "[m]" · "[a]" = "M" · "L T⁻²" = "M L T⁻²"', '"[E]" = "[F]" · "[d]" = "M L T⁻²" · "L" = "M L² T⁻²"', '"[P]" = [ "[F]" | "[A]" ] = [ "M L T⁻²" | "L²" ] = "M L⁻¹ T⁻²"']} />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Area', 'L²'],
                  ['Volume', 'L³'],
                  ['Density', 'M L⁻³'],
                  ['Speed', 'L T⁻¹'],
                  ['Acceleration', 'L T⁻²'],
                  ['Force', 'M L T⁻²'],
                  ['Momentum', 'M L T⁻¹'],
                  ['Energy, work', 'M L² T⁻²'],
                  ['Power', 'M L² T⁻³'],
                  ['Pressure', 'M L⁻¹ T⁻²'],
                  ['Frequency', 'T⁻¹'],
                  ['Angle, strain, ratios', '1 (no dimension)'],
                ] as const
              ).map(([q, d]) => (
                <tr key={q}>
                  <th scope="row">{q}</th>
                  <td>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Two facts about dimensions are the heart of everything that follows.</p>
        <ol className="steps">
          <Step title="Only like can be added">
            <p>You can add or subtract two quantities only if they have the same dimensions. Metres plus seconds is meaningless. Every term in a sum has the same dimension.</p>
          </Step>
          <Step title="Both sides of an equation match">
            <p>An equation is a statement that two things are equal, so they must have the same dimensions. This is the <strong>principle of homogeneity</strong>.</p>
          </Step>
        </ol>
        <p>
          Add one more: the argument of a function like sin, cos, exp or log must be a pure number. In <M>sin ( ω · t )</M> the product <M>ω · t</M> has no dimension, because the angular frequency has dimension <M>"T⁻¹"</M> and time has <M>"T"</M>:
        </p>
        <Eq src='"[ω t]" = "T⁻¹" · "T" = 1' />
      </section>

      <section className="t-section" id="t-check">
        <SectionHead n={no('check')} title="Checking a formula" />
        <p>
          Suppose you half-remember <M>s = u · t + [ 1 | 2 ] · a · t ^2</M> for the distance covered in a time <M>t</M>. Take it one term at a time and find the dimension of each:
        </p>
        <Eq src={['"[s]" = "L"', '"[u t]" = "L T⁻¹" · "T" = "L"', '"[½ a t²]" = "L T⁻²" · "T²" = "L"']} />
        <p>
          All three terms have the dimension of length, so the formula passes. Now try the misremembered <M>s = u + a · t</M>. Each term there is a speed, so the right side is <M>"L T⁻¹"</M> while the left is <M>"L"</M>. The equation cannot be right.
        </p>
        <figure className="t-figure">
          <Balance />
          <figcaption>Imagine a balance with the dimensions of each side in the pans. The correct formula stays level. The wrong one tips, because a speed is being set equal to a length.</figcaption>
        </figure>
        <Note label="What a check can and cannot do">A failed check proves the formula wrong. A passed check does <em>not</em> prove it right. Dimensions cannot see pure numbers, so <M>[ 1 | 2 ]</M> or <M>2 · π</M> can be missing and the check will not notice. Two different quantities can also share a dimension: torque and energy are both <M>"M L² T⁻²"</M>.</Note>
      </section>

      <section className="t-section" id="t-derive">
        <SectionHead n={no('derive')} title="Deriving a formula" />
        <p>
          Dimensions can do more than check. If you know which quantities a result depends on, you can often find how, up to a pure number. Take a simple pendulum. Guess that the period depends on the length <M>L</M>, the bob mass <M>m</M> and gravity <M>g</M>, each to some unknown power:
        </p>
        <Eq src='T = k · L ^a · m ^b · g ^c' />
        <p>
          Here <M>k</M> is a pure number. Put in the dimensions of each quantity, remembering that <M>g</M> is a length over a time squared:
        </p>
        <Eq src={['"T" = "L" ^a · "M" ^b · ( "L T⁻²" ) ^c', '"T" ^1 = "M" ^b · "L" ^a+c · "T" ^−2·c']} />
        <p>
          The two sides are equal only if each base dimension appears to the same power on both. Match them one at a time:
        </p>
        <Eq src={['b = 0 "(no mass on the left)"', 'a + c = 0 "(no length on the left)"', '− 2 · c = 1 "(one power of time)"']} />
        <p>
          The mass drops out, <M>c = − [ 1 | 2 ]</M>, and then <M>a = [ 1 | 2 ]</M>:
        </p>
        <Eq src='T = k · √[ [ L | g ] ]' />
        <figure className="t-figure">
          <Solve />
          <figcaption>Slide the exponent <M>c</M> and watch each row. The mass and length rows stay balanced all along, while the time row climbs until it meets its target.</figcaption>
        </figure>
        <p>
          We got the whole form, including the surprising fact that the mass does not matter, with no physics beyond dimensions. What we could not get is the pure number <M>k</M>. A real experiment, or the full theory, gives <M>k = 2 · π</M>.
        </p>
        <Note label="Limits of the method">It cannot find pure numbers or constants such as <M>2 · π</M> or <M>[ 1 | 2 ]</M>. It fails when a result is a sum of terms, such as <M>s = u · t + [ 1 | 2 ] · a · t ^2</M>. It cannot handle sin, log or exp of a quantity. And it needs you to know which quantities matter in the first place.</Note>
      </section>

      <section className="t-section" id="t-magnitude">
        <SectionHead n={no('magnitude')} title="Order of magnitude" />
        <p>
          Sometimes you do not need a number to many digits. You just want to know whether something is around a thousand or around a billion. The <strong>order of magnitude</strong> of a number is the power of ten nearest to it. Write the number as <M>a × 10 ^n</M> with <M>a</M> between 1 and 10. If <M>a</M> is less than about 3.16 (which is <M>√[ 10 ]</M>) the order of magnitude is <M>10 ^n</M>, and otherwise it is <M>10 ^n+1</M>.
        </p>
        <p>
          So 3 × 10³ is of order 10³, while 7 × 10³ is of order 10⁴: it is nearer to 10⁴ on a multiplication scale. Each step up the scale is a factor of ten, which is why such a huge range of sizes in nature fits on one line.
        </p>
        <figure className="t-figure">
          <Scales />
          <figcaption>From a proton to a galaxy, sizes span some 36 powers of ten. The marker sweeps along and lights up an example at each stop.</figcaption>
        </figure>
        <h3 className="t-h3">Estimating</h3>
        <p>
          An <strong>order-of-magnitude estimate</strong> breaks a puzzle into pieces you can guess, and multiplies them. How many times does a heart beat in a lifetime? About 70 beats a minute, 60 minutes in an hour, 24 hours in a day, 365 days in a year, and say 80 years:
        </p>
        <Eq src='N = 70 · 60 · 24 · 365 · 80 ≈ 3 × 10 ^9' />
        <figure className="t-figure">
          <Fermi />
          <figcaption>Each guess is only rough, but the answer lands in the right power of ten. Errors in the guesses tend to partly cancel.</figcaption>
        </figure>
        <p>
          The result, a few billion, is not exact and was never meant to be. It tells us the answer is not a million and not a trillion. That is often all we need.
        </p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Quantity as number and unit', 'Q = n · u'],
                  ['Newton and joule', '1 "N" = 1 "kg·m/s²" ,  1 "J" = 1 "N·m"'],
                  ['Kilometres per hour to m/s', '1 "km/h" = [ 1 | 3.6 ] "m/s"'],
                  ['Multiplying and dividing', '"fewest significant figures"'],
                  ['Adding and subtracting', '"fewest decimal places"'],
                  ['Dimension of speed', '"[v]" = "L T⁻¹"'],
                  ['Dimension of force', '"[F]" = "M L T⁻²"'],
                  ['Dimension of energy', '"[E]" = "M L² T⁻²"'],
                  ['Dimension of pressure', '"[P]" = "M L⁻¹ T⁻²"'],
                  ['Homogeneity', '"[left side]" = "[right side]"'],
                  ['Pendulum from dimensions', 'T = k · √[ [ L | g ] ]'],
                  ['Order of magnitude', 'a × 10 ^n → 10 ^n "or" 10 ^n+1'],
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
                  ['n', 'Number of units', ''],
                  ['u', 'The unit', ''],
                  ['M', 'Dimension of mass', 'kg'],
                  ['L', 'Dimension of length', 'm'],
                  ['T', 'Dimension of time', 's'],
                  ['k', 'A pure number, found by experiment or full theory', ''],
                  ['N', 'A number of objects, or the newton', ''],
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
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Kilometres per hour to metres per second">
          <p className="ex-q">A car travels at 72 km/h. What is its speed in m/s?</p>
          <Given items={['v = 72 "km/h"']} />
          <ol className="steps">
            <Step title="Write the two fractions equal to one">
              <Eq src='1 = [ 1000 "m" | 1 "km" ] ,  1 = [ 1 "h" | 3600 "s" ]' />
            </Step>
            <Step title="Multiply and cancel">
              <Eq src='72 "km/h" = 72 · [ 1000 "m" | 3600 "s" ] = 20 "m/s"' />
            </Step>
          </ol>
          <Answer>20 m/s. As a check, dividing 72 by 3.6 gives the same number.</Answer>
          <figure className="t-figure">
            <ConvertChain />
          </figure>
        </Example>

        <Example n={2} title="A density in two unit systems">
          <p className="ex-q">Iron has a density of 7.8 g/cm³. Express it in kg/m³.</p>
          <Given items={['ρ = 7.8 "g/cm³"']} />
          <ol className="steps">
            <Step title="Convert the mass and the volume">
              <Eq src={['1 "g" = 10 ^−3 "kg"', '1 "cm³" = ( 10 ^−2 "m" ) ^3 = 10 ^−6 "m³"']} />
            </Step>
            <Step title="Put them in">
              <Eq src='ρ = 7.8 · [ 10 ^−3 "kg" | 10 ^−6 "m³" ] = 7.8 × 10 ^3 "kg/m³"' />
            </Step>
          </ol>
          <Answer>7800 kg/m³. The number gets a thousand times bigger, because a cubic metre is a million cubic centimetres but a kilogram is only a thousand grams.</Answer>
          <figure className="t-figure">
            <Prefixes />
          </figure>
        </Example>

        <Example n={3} title="Dimensions of pressure">
          <p className="ex-q">Find the dimensions of pressure, and write the pascal in base units.</p>
          <Given items={['P = [ F | A ]']} />
          <ol className="steps">
            <Step title="Dimensions of the force and the area">
              <Eq src={['"[F]" = "M L T⁻²"', '"[A]" = "L²"']} />
            </Step>
            <Step title="Divide">
              <Eq src='"[P]" = [ "M L T⁻²" | "L²" ] = "M L⁻¹ T⁻²"' />
            </Step>
            <Step title="The unit">
              <Eq src='1 "Pa" = 1 [ "N" | "m²" ] = 1 "kg m⁻¹ s⁻²"' />
            </Step>
          </ol>
          <Answer>
            <M>"M L⁻¹ T⁻²"</M>. Pressure is the same as an energy per unit volume: <M>"M L² T⁻²"</M> divided by <M>"L³"</M> gives the same result.
          </Answer>
          <figure className="t-figure">
            <DerivedWeb />
          </figure>
        </Example>

        <Example n={4} title="Which formula is wrong?">
          <p className="ex-q">Check <M>v ^2 = u ^2 + 2 · a · s</M>. Then check <M>T = 2 · π · √[ [ g | L ] ]</M> for a pendulum.</p>
          <Given items={['"[v]" = "L T⁻¹"', '"[a]" = "L T⁻²"', '"[g]" = "L T⁻²"']} />
          <ol className="steps">
            <Step title="The first formula, term by term">
              <Eq src={['"[v²]" = "L² T⁻²"', '"[u²]" = "L² T⁻²"', '"[2 a s]" = "L T⁻²" · "L" = "L² T⁻²"']} />
              <p>All three agree.</p>
            </Step>
            <Step title="The second formula">
              <Eq src={['"[T]" = "T"', '"[√(g/L)]" = √[ [ "L T⁻²" | "L" ] ] = "T⁻¹"']} />
              <p>The left side is a time, the right side is a rate. They do not match.</p>
            </Step>
          </ol>
          <Answer>The first formula passes. The second fails: the length and the gravity are upside down. The right form is <M>T = 2 · π · √[ [ L | g ] ]</M>, whose square root has dimension <M>"T"</M>.</Answer>
          <figure className="t-figure">
            <Balance />
          </figure>
        </Example>

        <Example n={5} title="Speed of a wave on a rope">
          <p className="ex-q">The speed <M>v</M> of a wave on a stretched rope depends on the tension <M>F</M> in the rope and its mass per unit length <M>μ</M>. Use dimensions to find the formula, then evaluate it for <M>F = 100 "N"</M> and <M>μ = 0.25 "kg/m"</M>, taking <M>k = 1</M>.</p>
          <Given items={['"[F]" = "M L T⁻²"', '"[μ]" = "M L⁻¹"']} />
          <ol className="steps">
            <Step title="Assume a power law">
              <Eq src='v = k · F ^a · μ ^b' />
            </Step>
            <Step title="Dimensions of each side">
              <Eq src='"L T⁻¹" = ( "M L T⁻²" ) ^a · ( "M L⁻¹" ) ^b' />
              <Eq src='"L T⁻¹" = "M" ^a+b · "L" ^a−b · "T" ^−2·a' />
            </Step>
            <Step title="Match each base dimension">
              <Eq src={['a + b = 0', 'a − b = 1', '− 2 · a = − 1']} />
              <p>The last equation gives <M>a = [ 1 | 2 ]</M>, and then <M>b = − [ 1 | 2 ]</M>. The middle one agrees: <M>[ 1 | 2 ] + [ 1 | 2 ] = 1</M>.</p>
            </Step>
            <Step title="Evaluate">
              <Eq src={['v = k · √[ [ F | μ ] ]', 'v = √[ [ 100 | 0.25 ] ] = √[ 400 ] = 20 "m/s"']} />
            </Step>
          </ol>
          <Answer>
            <M>v = k · √[ F / μ ]</M>, with the number <M>k</M> not given by dimensions (for a rope it turns out to be exactly 1). The wave runs at 20 m/s. Three equations for two unknowns agreed, which is a good sign.
          </Answer>
          <figure className="t-figure">
            <Solve mode="rope" />
          </figure>
        </Example>

        <Example n={6} title="Significant figures in a product and a sum">
          <p className="ex-q">A plate measures 4.56 cm by 1.4 cm. What is its area? Three lengths are laid end to end: 12.11 cm, 18.0 cm and 1.013 cm. What is the total length?</p>
          <Given items={['l = 4.56 "cm"', 'w = 1.4 "cm"']} />
          <ol className="steps">
            <Step title="Area">
              <Eq src='A = l · w = 4.56 · 1.4 = 6.384 "cm²"' />
              <p>The width has two significant figures, the fewest, so round to two: 6.4.</p>
            </Step>
            <Step title="Total length">
              <Eq src='12.11 + 18.0 + 1.013 = 31.123 "cm"' />
              <p>The least precise number is 18.0, known to one decimal place. Round to one decimal place: 31.1.</p>
            </Step>
          </ol>
          <Answer>The area is 6.4 cm² (two significant figures). The total length is 31.1 cm (one decimal place).</Answer>
          <figure className="t-figure">
            <AddAlign />
          </figure>
        </Example>

        <Example n={7} title="How many beats in a life?">
          <p className="ex-q">Estimate, to the nearest power of ten, how many times a heart beats in 80 years at 70 beats a minute.</p>
          <Given items={['"rate" = 70 "per min"', '"time" = 80 "years"']} />
          <ol className="steps">
            <Step title="Convert the time to minutes">
              <Eq src='80 · 365 · 24 · 60 = 4.2 × 10 ^7 "min"' />
            </Step>
            <Step title="Multiply by the rate">
              <Eq src='N = 70 · 4.2 × 10 ^7 = 2.9 × 10 ^9' />
            </Step>
            <Step title="Order of magnitude">
              <p>
                The leading number 2.9 is less than 3.16, so the order of magnitude is <M>10 ^9</M>.
              </p>
            </Step>
          </ol>
          <Answer>About 3 × 10⁹, that is, of order a billion beats.</Answer>
          <figure className="t-figure">
            <Fermi />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Leading zeros are significant" wrong={'0.0045 "has 4 s.f."'} fig={<SigDigits numbers={['0.0045']} height={150} loop={6} />}>
            Leading zeros only locate the decimal point. 0.0045 has two significant figures, just like 4.5. Zeros count only when they sit between or after other digits.
          </Mistake>
          <Mistake title="A square kilometre is a thousand square metres" wrong={'1 "km" ^2 = 10 ^3 "m" ^2'} fig={<AreaScale />}>
            The prefix is squared with the unit. <M>1 "km" ^2 = ( 10 ^3 "m" ) ^2 = 10 ^6 "m" ^2</M>, so there are a million square metres in a square kilometre.
          </Mistake>
          <Mistake title="Same dimensions means same quantity" wrong={'"torque" = "energy" "because both are N·m"'} fig={<TwoNm />}>
            Different quantities can share a dimension. A torque and an energy both have <M>"M L² T⁻²"</M>, but they are not the same thing, and it makes no sense to add them.
          </Mistake>
          <Mistake title="The dimensions agree, so the formula is right" wrong={'E = m · v ^2 "is a fine kinetic energy"'} fig={<DimsMiss />}>
            A dimensional check cannot see pure numbers. The right kinetic energy is <M>[ 1 | 2 ] · m · v ^2</M>; the version without the half has the same dimensions and is simply twice too big.
          </Mistake>
          <Mistake title="Keep every digit of a sum" wrong={'12.11 + 18.0 + 1.013 = 31.123'} fig={<AddAlign />}>
            Adding cannot make a number more precise than its least precise term. The sum is limited to the tenths place of 18.0, so write 31.1.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">A number is only half an answer. The unit, and the honest number of digits, are the other half.</p>
        <p className="closing-sub">Next: measurement and experimental skills. Significant figures are a rough way to show uncertainty, and there we make that exact.</p>
      </footer>
    </ChapterShell>
  );
}
