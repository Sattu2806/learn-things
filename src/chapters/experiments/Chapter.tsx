import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { BestFit, ErrorTypes, LeastCount, Linearise, LinearGraph, PendulumG, ProdErr, Readings, ScrewGauge, SlopeSpan, SumErr, Targets, TimingError, Vernier } from './ExpAnims';

/** Measurement and experimental skills: errors, instruments, the pendulum and straight-line graphs. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'Every measurement is uncertain', group: 'Theory' },
  { id: 'errors', title: 'Kinds of error', group: 'Theory' },
  { id: 'absolute', title: 'Absolute, relative and percentage error', group: 'Theory' },
  { id: 'combine', title: 'Combining errors', group: 'Theory' },
  { id: 'leastcount', title: 'Least count', group: 'Theory' },
  { id: 'vernier', title: 'Vernier calipers', group: 'Theory' },
  { id: 'screw', title: 'The screw gauge', group: 'Theory' },
  { id: 'pendulum', title: 'Finding g with a pendulum', group: 'Theory' },
  { id: 'graph', title: 'Straight-line graphs', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="experiments" film={buildFilm} sections={SECTIONS} sideTitle="Measurement and experiments" sideLead="No measurement is perfect. Learn to say how imperfect it is, to read the instruments of the lab, and to let a graph average away the noise.">
      <header className="article-head">
        <span className="kicker">Physics · Experimental skills</span>
        <h1 className="article-title">How sure are we of a measurement?</h1>
        <p className="article-lead">A result without an honest statement of its uncertainty is only half a result. This chapter shows where errors come from, how to measure them and combine them, how to read a vernier and a screw gauge, and how to find g from a pendulum with a straight-line graph.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="Every measurement is uncertain" />
        <p>
          Time the swing of a pendulum five times and you will get five slightly different answers. Your hand is slow, the stopwatch has limited precision, and the pendulum itself is never quite the same twice. This is not a failure of the experimenter. It is a fact of life: <strong>every measurement has an error</strong>, the difference between what we measure and the true value.
        </p>
        <p>
          The scientist&rsquo;s response is not to pretend the error is zero, but to <em>state it</em>. A result is written as a best value together with how far it could be off:
        </p>
        <Eq src='"result" = a _mean ± Δ a' />
        <p>
          Here <M>a _mean</M> is the best value (we will see it is the mean of repeated readings) and <M>Δ a</M> is the <strong>uncertainty</strong>, the size of the error we cannot get rid of. &ldquo;2.62 ± 0.11 s&rdquo; tells a reader far more than &ldquo;2.62 s&rdquo; does.
        </p>
        <figure className="t-figure">
          <ErrorTypes />
          <figcaption>Readings never land exactly on the true value. Scatter on both sides is a <em>random</em> error. A shift all one way is a <em>systematic</em> error.</figcaption>
        </figure>
      </section>

      <section className="t-section" id="t-errors">
        <SectionHead n={no('errors')} title="Kinds of error" />
        <p>
          <strong>Systematic errors</strong> push every reading the same way. A stopwatch that runs fast, a ruler whose end is worn away, or a vernier with a <strong>zero error</strong> all give readings that are too big (or too small) every time. Repeating the measurement does not help, because it repeats the mistake. You must find the cause and correct for it.
        </p>
        <p>
          <strong>Random errors</strong> change from reading to reading, sometimes up and sometimes down: your reaction time with a stopwatch, the flicker of a pointer on a meter, small draughts. Because they scatter on both sides, they average out. Taking many readings and using their mean reduces them.
        </p>
        <p>
          Two words describe how good a set of readings is. <strong>Accuracy</strong> is how close they are to the true value. <strong>Precision</strong> is how close they are to each other.
        </p>
        <figure className="t-figure">
          <Targets />
          <figcaption>Shots that cluster are precise; shots centred on the bullseye are accurate. A systematic error spoils accuracy but not precision. Random error spoils precision.</figcaption>
        </figure>
        <Note label="Careful">A mistake such as reading the wrong scale or writing a digit wrongly is a <em>blunder</em>, not an error in this sense. Check readings as you take them, and throw out a blunder rather than averaging it in.</Note>
      </section>

      <section className="t-section" id="t-absolute">
        <SectionHead n={no('absolute')} title="Absolute, relative and percentage error" />
        <p>
          Suppose we take <M>n</M> readings <M>a _1 , a _2 , … , a _n</M> of the same quantity. The best estimate of the true value is their <strong>mean</strong>:
        </p>
        <Eq src='a _mean = [ a _1 + a _2 + … + a _n | n ]' />
        <p>
          How far is each reading from this? The <strong>absolute error</strong> of one reading is that distance, always taken as positive:
        </p>
        <Eq src='Δ a _i = "|" a _i − a _mean "|"' />
        <figure className="t-figure">
          <Readings />
          <figcaption>Five readings drop onto the line. The mean is marked, and the arrows are the absolute errors. The shaded band is the mean of these arrows.</figcaption>
        </figure>
        <p>
          The uncertainty we quote is the <strong>mean absolute error</strong>, the average of the individual absolute errors:
        </p>
        <Eq src={['Δ a _mean = [ Δ a _1 + Δ a _2 + … + Δ a _n | n ]', 'a = a _mean ± Δ a _mean']} />
        <p>
          An error of 0.1 s means one thing on a 2 s swing and quite another on a 2000 s tide. So we also compare the error with the size of the quantity. The <strong>relative error</strong> is the ratio, and the <strong>percentage error</strong> is that ratio as a percentage:
        </p>
        <Eq src={['"relative error" = [ Δ a _mean | a _mean ]', '"percentage error" = [ Δ a _mean | a _mean ] × 100 "%"']} />
        <p>
          The relative error has no unit. It is what lets us compare the quality of a measurement of a length with that of a time.
        </p>
      </section>

      <section className="t-section" id="t-combine">
        <SectionHead n={no('combine')} title="Combining errors" />
        <p>
          Often the quantity we want is found from several measured ones, each with its own error. How do the errors combine? Think of the worst case, where all the errors pull the same way.
        </p>
        <h3 className="t-h3">Sum and difference</h3>
        <p>
          For <M>x = a + b</M>, the largest possible value uses the largest <M>a</M> and the largest <M>b</M>:
        </p>
        <Eq src={['x + Δ x = ( a + Δ a ) + ( b + Δ b )', 'Δ x = Δ a + Δ b']} />
        <p>
          For a difference <M>x = a − b</M>, the biggest result comes from the biggest <M>a</M> and the smallest <M>b</M>, so the error is again the <em>sum</em>:
        </p>
        <Eq src='x = a − b ,  Δ x = Δ a + Δ b' />
        <figure className="t-figure">
          <SumErr />
          <figcaption>Each rod wobbles by its own error. The total length can swing by the sum of the two, shown by the shaded block at the end.</figcaption>
        </figure>
        <p>
          Absolute errors add, whether you add or subtract the quantities. You never subtract errors: errors can only make things less certain.
        </p>
        <h3 className="t-h3">Product and quotient</h3>
        <p>
          For <M>x = a · b</M> multiply out the largest values and keep the terms that matter:
        </p>
        <Eq src={['x + Δ x = ( a + Δ a ) · ( b + Δ b )', 'x + Δ x = a · b + a · Δ b + b · Δ a + Δ a · Δ b']} />
        <p>
          The last term is a tiny error times a tiny error, much smaller than the others, so we drop it. Then subtract <M>x = a · b</M> from both sides and divide by it:
        </p>
        <Eq src={['Δ x = a · Δ b + b · Δ a', '[ Δ x | x ] = [ a · Δ b + b · Δ a | a · b ] = [ Δ a | a ] + [ Δ b | b ]']} />
        <figure className="t-figure">
          <ProdErr />
          <figcaption>The sides of the rectangle grow a little. The extra area is a strip along each side, <M>l · Δ w</M> and <M>w · Δ l</M>, plus a tiny corner that we can ignore.</figcaption>
        </figure>
        <p>
          The same result holds for a quotient. <strong>For products and quotients, the relative errors add.</strong> Raising to a power just repeats the product, so the relative error is multiplied by the power:
        </p>
        <Eq src={['x = a ^n', '[ Δ x | x ] = n · [ Δ a | a ]']} />
        <p>All together, for a general formula:</p>
        <Eq src={['x = [ a ^p · b ^q | c ^r ]', '[ Δ x | x ] = p · [ Δ a | a ] + q · [ Δ b | b ] + r · [ Δ c | c ]']} />
        <Note label="Where to spend effort">The quantity raised to the highest power, or with the biggest relative error, matters most. Improving a measurement that already has a tiny relative error gains almost nothing.</Note>
      </section>

      <section className="t-section" id="t-leastcount">
        <SectionHead n={no('leastcount')} title="Least count" />
        <p>
          Every instrument can only resolve so much. The <strong>least count</strong> (LC) is the smallest value it can measure directly. For a ruler marked in millimetres the least count is 1 mm, and a reading from it is uncertain by about that much.
        </p>
        <figure className="t-figure">
          <LeastCount />
          <figcaption>The end of the pencil falls between two marks. The ruler can only tell us which two. We cannot honestly write more digits than the instrument gives.</figcaption>
        </figure>
        <p>
          A single reading is usually quoted with an error equal to the least count. To measure smaller lengths than a ruler can, we need a cleverer scale. Two are common: the vernier calipers (LC = 0.1 mm or less) and the screw gauge (LC = 0.01 mm).
        </p>
      </section>

      <section className="t-section" id="t-vernier">
        <SectionHead n={no('vernier')} title="Vernier calipers" />
        <p>
          A <strong>vernier scale</strong> is a small sliding scale beside the main scale. It is made so that its divisions are slightly shorter than the main scale divisions. Take the common case where <M>10</M> vernier scale divisions (VSD) exactly fit into <M>9</M> main scale divisions (MSD), with 1 MSD = 1 mm:
        </p>
        <Eq src={['10 "VSD" = 9 "MSD"', '1 "VSD" = [ 9 | 10 ] "MSD" = 0.9 "mm"']} />
        <p>
          The least count is how much a vernier division falls short of a main one:
        </p>
        <Eq src={['"LC" = 1 "MSD" − 1 "VSD" = 1 − 0.9 = 0.1 "mm"', '"LC" = [ 1 | N ] "MSD" "for N vernier divisions"']} />
        <h3 className="t-h3">Why the coinciding mark gives the extra tenths</h3>
        <p>
          Suppose the zero of the vernier sits a little past a mark of the main scale, by an unknown distance <M>x</M>. Each vernier division is 0.1 mm shorter than a main one. So the vernier marks creep towards the main marks, closing the gap by 0.1 mm each time. The one that lines up exactly, number <M>n</M>, has closed the whole gap:
        </p>
        <Eq src='x = n · ( 1 "MSD" − 1 "VSD" ) = n × "LC"' />
        <p>That is the rule for reading it:</p>
        <ol className="steps">
          <Step title="Main scale reading (MSR)">
            <p>Read the last main-scale mark to the left of the vernier zero.</p>
          </Step>
          <Step title="Vernier scale reading (VSR)">
            <p>Find the vernier division that lines up with some main-scale mark. Its number is the VSR.</p>
          </Step>
          <Step title="Put them together">
            <Eq src='"reading" = "MSR" + "VSR" × "LC"' />
          </Step>
        </ol>
        <figure className="t-figure">
          <Vernier title="The sliding jaw of a vernier calipers closes on an object while the vernier scale slides; the vernier division that lines up with a main scale mark is highlighted and the reading is 4.3 millimetres" r={4.3} />
          <figcaption>As the jaw moves, a different vernier mark lines up each time. At the end, division 3 coincides with the main scale mark at 7, so the reading is 4 mm + 3 × 0.1 mm = 4.3 mm.</figcaption>
        </figure>
        <h3 className="t-h3">Zero error</h3>
        <p>
          Close the jaws with nothing between them. The vernier zero should sit exactly on the main zero. If it does not, the instrument has a <strong>zero error</strong>, a systematic error that sits in every reading.
        </p>
        <p>
          If the vernier zero is to the <em>right</em> of the main zero, the error is <strong>positive</strong>: the instrument reads too much. If the <M>n</M>th vernier division then coincides, the zero error is <M>+ n × "LC"</M>. If the vernier zero is to the <em>left</em>, the error is <strong>negative</strong>. With <M>N</M> divisions and the <M>n</M>th coinciding, it is <M>− ( N − n ) × "LC"</M>. In every case:
        </p>
        <Eq src='"true reading" = "observed reading" − "zero error"' />
        <figure className="t-figure">
          <Vernier title="Vernier calipers with the jaws closed: the vernier zero sits 0.3 millimetres to the right of the main zero, and the third division coincides, a zero error of plus 0.3 millimetres" r={0.3} closed loop={8} />
          <figcaption>Closed jaws, but the vernier zero is not at the main zero. The third division coincides, so the zero error is +0.3 mm. Subtract it from every reading.</figcaption>
        </figure>
        <p>
          Subtracting a negative error means adding. A reading of 5.4 mm taken with a zero error of −0.1 mm is really 5.4 − (−0.1) = 5.5 mm.
        </p>
      </section>

      <section className="t-section" id="t-screw">
        <SectionHead n={no('screw')} title="The screw gauge" />
        <p>
          For even finer lengths, such as the thickness of a wire, we use a <strong>screw gauge</strong> (micrometer). A very accurate screw is turned by a thimble, so every turn moves the spindle a fixed small step along the main (pitch) scale, the <strong>pitch</strong>:
        </p>
        <Eq src='"pitch" = [ "distance moved by the spindle" | "number of full turns" ]' />
        <p>
          The thimble has a circular scale with <M>N</M> divisions. Turning it by one division moves the spindle by a fraction <M>1 / N</M> of the pitch, and that is the least count:
        </p>
        <Eq src={['"LC" = [ "pitch" | "number of circular divisions" ]', '"LC" = [ 0.5 "mm" | 50 ] = 0.01 "mm"']} />
        <ol className="steps">
          <Step title="Pitch scale reading (PSR)">
            <p>The last mark on the sleeve scale that the thimble edge has uncovered. Marks are 0.5 mm apart.</p>
          </Step>
          <Step title="Circular scale reading (CSR)">
            <p>The number of the thimble division that is level with the reference line along the sleeve.</p>
          </Step>
          <Step title="Put them together">
            <Eq src='"reading" = "PSR" + "CSR" × "LC"' />
          </Step>
        </ol>
        <figure className="t-figure">
          <ScrewGauge title="A screw gauge closes on a small object: the thimble turns, its circular scale slides past the reference line and the reading comes to 2.86 millimetres, the pitch scale reading of 2.5 plus 36 divisions of 0.01" />
          <figcaption>Watch the thimble turn as the spindle closes on the object. At the end the pitch scale shows 2.5 mm and division 36 is on the reference line: 2.5 + 36 × 0.01 = 2.86 mm.</figcaption>
        </figure>
        <h3 className="t-h3">Zero error</h3>
        <p>
          Close the jaws gently using the ratchet and look at the circular scale. It should read 0. If it reads a small number <M>n</M> of divisions (the thimble zero is below the reference line), the zero error is positive, <M>+ n × "LC"</M>. If it reads a number close to the top of the scale, say <M>n</M> out of <M>N = 50</M>, the zero is above the line and the zero error is negative, <M>− ( N − n ) × "LC"</M>. As before, subtract it from the observed reading.
        </p>
        <figure className="t-figure">
          <ScrewGauge title="The same screw gauge with its jaws closed on nothing: the circular scale reads 46 instead of 0, a negative zero error of 0.04 millimetres" obj={0} z={-0.04} loop={9} />
          <figcaption>With the jaws closed, the scale shows 46 divisions instead of 0. That is 4 divisions short of a full turn, a zero error of −4 × 0.01 = −0.04 mm.</figcaption>
        </figure>
        <Note label="Handling it">Always turn the screw by the ratchet, never the thimble, once the jaws touch. A hard squeeze flattens the object and the jaws and gives a reading that is too small.</Note>
      </section>

      <section className="t-section" id="t-pendulum">
        <SectionHead n={no('pendulum')} title="Finding g with a pendulum" />
        <p>
          A simple pendulum of length <M>L</M> swings with period <M>T = 2 · π · √[ L / g ]</M> (see the oscillations chapter). Turn it around and a measurement of <M>L</M> and <M>T</M> gives the acceleration due to gravity:
        </p>
        <Eq src='g = [ 4 · π ^2 · L | T ^2 ]' />
        <figure className="t-figure">
          <PendulumG />
          <figcaption>The length <M>L</M> runs from the pivot to the centre of the bob, so it is the string <M>l</M> plus the bob radius <M>r</M>. The stopwatch runs while swings are counted.</figcaption>
        </figure>
        <p>The good practice behind the experiment:</p>
        <ul className="t-list">
          <li><strong>Measure <M>L</M> to the centre of the bob</strong>: the string length plus the radius of the bob, found with vernier calipers.</li>
          <li><strong>Use small swings</strong>, up to about 10°, so that the formula holds.</li>
          <li><strong>Start the count as the bob crosses the middle</strong> of its swing, where it moves fastest and the timing is sharpest.</li>
          <li><strong>Time many oscillations</strong> and divide.</li>
        </ul>
        <p>
          Why many? Your reaction time makes an error <M>Δ t</M> of a fraction of a second in starting and stopping the watch, whatever the length of the time interval. Timing <M>n</M> oscillations gives <M>t</M>, and then
        </p>
        <Eq src={['T = [ t | n ]', 'Δ T = [ Δ t | n ]']} />
        <p>The error in each period is divided by <M>n</M>.</p>
        <figure className="t-figure">
          <TimingError />
          <figcaption>With a reaction time error of 0.2 s and a 2 s period, timing one swing gives a 10 % error, but timing 20 swings gives only 0.5 %.</figcaption>
        </figure>
        <p>
          Now find the error in <M>g</M>. Since <M>4 · π ^2</M> is a pure number, only <M>L</M> and <M>T ^2</M> bring errors, and <M>T</M> is squared:
        </p>
        <Eq src='[ Δ g | g ] = [ Δ L | L ] + 2 · [ Δ T | T ]' />
        <p>
          The time is the quantity that matters most. That is another reason to time many swings: it is the error in <M>T</M> that is doubled.
        </p>
      </section>

      <section className="t-section" id="t-graph">
        <SectionHead n={no('graph')} title="Straight-line graphs" />
        <p>
          One measurement of <M>g</M> is good; a set of measurements at several lengths is better. A <strong>graph</strong> uses all of them at once, averages out the random errors, and shows up anything systematic at a glance. The trick is to plot so that the points fall on a <strong>straight line</strong>:
        </p>
        <Eq src='y = m · x + c' />
        <p>
          where <M>m</M> is the slope and <M>c</M> the intercept on the <M>y</M> axis. The slope is the rise over the run, and it is the same wherever on the line you measure it:
        </p>
        <Eq src='m = [ Δ y | Δ x ] = [ y _2 − y _1 | x _2 − x _1 ]' />
        <figure className="t-figure">
          <LinearGraph />
          <figcaption>Stretch the triangle or shrink it: Δy over Δx never changes. The line cuts the vertical axis at <M>c</M>.</figcaption>
        </figure>
        <h3 className="t-h3">Making a curve straight</h3>
        <p>
          The period against the length is a curve, but square the period and it straightens. From <M>T = 2 · π · √[ L / g ]</M>:
        </p>
        <Eq src='T ^2 = [ 4 · π ^2 | g ] · L' />
        <p>
          That has the form <M>y = m · x</M> with <M>y = T ^2</M> and <M>x = L</M>. The graph of <M>T ^2</M> against <M>L</M> is a straight line through the origin with slope <M>4 · π ^2 / g</M>. So
        </p>
        <Eq src='g = [ 4 · π ^2 | m ]' />
        <figure className="t-figure">
          <Linearise />
          <figcaption>As the vertical quantity changes from T to T², the curved row of points settles onto a straight line through the origin.</figcaption>
        </figure>
        <h3 className="t-h3">Plotting well</h3>
        <ol className="steps">
          <Step title="Choose the axes and scale">
            <p>The quantity you change goes on the <M>x</M> axis. Pick a simple scale (1, 2 or 5 units per small square, never 3 or 7), so the points fill more than half of the paper. Label each axis with its quantity and unit.</p>
          </Step>
          <Step title="Plot the points">
            <p>Mark each with a small, clear dot or cross.</p>
          </Step>
          <Step title="Draw the best-fit line">
            <p>Do not join the dots. Draw one straight line through the middle of the points, with about as many above as below and no tilt.</p>
          </Step>
          <Step title="Measure the slope">
            <p>Pick two points <em>on the line</em>, not data points, as far apart as the line allows, and read their coordinates. Use <M>m = Δ y / Δ x</M>.</p>
          </Step>
        </ol>
        <figure className="t-figure">
          <BestFit />
          <figcaption>The line swings about the centre of the points, and the sum of the squared gaps drops to its smallest value at the best fit. The residual gaps (thin lines) balance above and below.</figcaption>
        </figure>
        <p>
          Why far apart? Each point on the line has some uncertainty, and the slope is a ratio of differences. The bigger the run <M>Δ x</M>, the smaller the effect of that uncertainty:
        </p>
        <figure className="t-figure">
          <SlopeSpan />
          <figcaption>The two dashed lines are the steepest and shallowest slopes allowed by the small uncertainty in each reading. Slide the second point away and they draw together.</figcaption>
        </figure>
        <h3 className="t-h3">What a graph reveals</h3>
        <p>
          If you measured the string only, forgetting the bob radius <M>r</M>, the true length is <M>l + r</M> and the graph becomes
        </p>
        <Eq src='T ^2 = [ 4 · π ^2 | g ] · ( l + r )' />
        <p>
          The line is shifted sideways and cuts the length axis at <M>− r</M>. It no longer goes through the origin, which tells you something is systematic. The slope is unchanged, so <M>g</M> from the slope is still right. The slope of a graph is untouched by an error that adds the same amount to every reading.
        </p>
        <p>
          To give an error on the slope, draw the steepest and shallowest lines that still fit the points, and take half their difference. The relative error in <M>g</M> equals the relative error in the slope: <M>Δ g / g = Δ m / m</M>.
        </p>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Mean of n readings', 'a _mean = [ a _1 + a _2 + … + a _n | n ]'],
                  ['Absolute error', 'Δ a _i = "|" a _i − a _mean "|"'],
                  ['Mean absolute error', 'Δ a _mean = [ Δ a _1 + … + Δ a _n | n ]'],
                  ['Relative error', '[ Δ a _mean | a _mean ]'],
                  ['Percentage error', '[ Δ a _mean | a _mean ] × 100 "%"'],
                  ['Sum or difference', 'Δ x = Δ a + Δ b'],
                  ['Product or quotient', '[ Δ x | x ] = [ Δ a | a ] + [ Δ b | b ]'],
                  ['Power', '[ Δ x | x ] = n · [ Δ a | a ]'],
                  ['Vernier least count', '"LC" = 1 "MSD" − 1 "VSD" = [ 1 | N ] "MSD"'],
                  ['Vernier reading', '"reading" = "MSR" + "VSR" × "LC"'],
                  ['Screw gauge least count', '"LC" = [ "pitch" | "divisions" ]'],
                  ['Screw gauge reading', '"reading" = "PSR" + "CSR" × "LC"'],
                  ['Zero correction', '"true" = "observed" − "zero error"'],
                  ['g from a pendulum', 'g = [ 4 · π ^2 · L | T ^2 ]'],
                  ['Error in g', '[ Δ g | g ] = [ Δ L | L ] + 2 · [ Δ T | T ]'],
                  ['Straight line', 'y = m · x + c'],
                  ['Slope', 'm = [ y _2 − y _1 | x _2 − x _1 ]'],
                  ['g from the graph', 'g = [ 4 · π ^2 | m ]'],
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
                  ['Δ a', 'Absolute error of a', 'same as a'],
                  ['n', 'Number of readings or oscillations', 'none'],
                  ['LC', 'Least count of the instrument', 'mm'],
                  ['MSR', 'Main scale reading', 'mm'],
                  ['VSR', 'Vernier scale reading, in divisions', 'none'],
                  ['PSR', 'Pitch scale reading', 'mm'],
                  ['CSR', 'Circular scale reading, in divisions', 'none'],
                  ['L', 'Length of the pendulum to the bob centre', 'm'],
                  ['T', 'Period of the pendulum', 's'],
                  ['m', 'Slope of a graph', 'depends'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">{sym.length > 2 ? sym : <M>{sym}</M>}</th>
                  <td>{meaning}</td>
                  <td>{unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-examples">
        <SectionHead n={no('examples')} title="Worked examples" />

        <Example n={1} title="Mean and errors of a period">
          <p className="ex-q">A student times a pendulum and gets 2.63 s, 2.56 s, 2.42 s, 2.71 s and 2.80 s. Find the mean, the mean absolute error, and the relative and percentage errors.</p>
          <Given items={['a _1 = 2.63 "s"', 'a _2 = 2.56 "s"', 'a _3 = 2.42 "s"', 'a _4 = 2.71 "s"', 'a _5 = 2.80 "s"']} />
          <ol className="steps">
            <Step title="The mean">
              <Eq src='a _mean = [ 2.63 + 2.56 + 2.42 + 2.71 + 2.80 | 5 ] = [ 13.12 | 5 ] = 2.62 "s"' />
            </Step>
            <Step title="Absolute error of each reading">
              <Eq src='Δ a _1 = 0.01 ,  Δ a _2 = 0.06 ,  Δ a _3 = 0.20 ,  Δ a _4 = 0.09 ,  Δ a _5 = 0.18' />
            </Step>
            <Step title="Mean absolute error">
              <Eq src='Δ a _mean = [ 0.01 + 0.06 + 0.20 + 0.09 + 0.18 | 5 ] = [ 0.54 | 5 ] = 0.11 "s"' />
            </Step>
            <Step title="Relative and percentage error">
              <Eq src={['[ 0.11 | 2.62 ] = 0.042', '0.042 × 100 "%" = 4.2 "%"']} />
            </Step>
          </ol>
          <Answer>The period is 2.62 ± 0.11 s, a relative error of 0.042, that is 4.2 %.</Answer>
          <figure className="t-figure">
            <Readings />
          </figure>
        </Example>

        <Example n={2} title="Adding and subtracting measurements">
          <p className="ex-q">Two rods are laid end to end: 10.5 ± 0.1 cm and 15.2 ± 0.2 cm. Find the total length. Then a liquid warms from 31.0 ± 0.4 °C to 52.5 ± 0.5 °C. Find the rise in temperature.</p>
          <Given items={['a = 10.5 ± 0.1 "cm"', 'b = 15.2 ± 0.2 "cm"', 'T _1 = 31.0 ± 0.4 "°C"', 'T _2 = 52.5 ± 0.5 "°C"']} />
          <ol className="steps">
            <Step title="The sum">
              <Eq src={['x = 10.5 + 15.2 = 25.7 "cm"', 'Δ x = 0.1 + 0.2 = 0.3 "cm"']} />
            </Step>
            <Step title="The difference">
              <Eq src={['Δ T = 52.5 − 31.0 = 21.5 "°C"', 'error = 0.4 + 0.5 = 0.9 "°C"']} />
            </Step>
          </ol>
          <Answer>The total length is 25.7 ± 0.3 cm. The temperature rise is 21.5 ± 0.9 °C. Notice that the subtraction did not cancel the errors: they were added.</Answer>
          <figure className="t-figure">
            <SumErr diff />
          </figure>
        </Example>

        <Example n={3} title="Density of a cube">
          <p className="ex-q">A cube has mass 54.0 ± 0.5 g and side 3.00 ± 0.02 cm. Find its density and the error in it.</p>
          <Given items={['m = 54.0 ± 0.5 "g"', 'a = 3.00 ± 0.02 "cm"']} />
          <ol className="steps">
            <Step title="The density itself">
              <Eq src='ρ = [ m | a ^3 ] = [ 54.0 | 27.0 ] = 2.00 "g/cm³"' />
            </Step>
            <Step title="Relative error (the side is cubed)">
              <Eq src='[ Δ ρ | ρ ] = [ 0.5 | 54.0 ] + 3 · [ 0.02 | 3.00 ] = 0.0093 + 0.0200 = 0.0293' />
            </Step>
            <Step title="Absolute error">
              <Eq src='Δ ρ = 0.0293 · 2.00 = 0.06 "g/cm³"' />
            </Step>
          </ol>
          <Answer>ρ = 2.00 ± 0.06 g/cm³ (about 2.9 %). The side contributes most of the error, since it is cubed.</Answer>
          <figure className="t-figure">
            <ProdErr />
          </figure>
        </Example>

        <Example n={4} title="Reading a vernier, with zero error">
          <p className="ex-q">A vernier calipers has 1 MSD = 1 mm and 10 VSD = 9 MSD. (a) Find its least count. (b) The main scale reads 23 mm and the 7th vernier division coincides with a main mark. When the jaws are closed, the 3rd division coincides. Find the true length. (c) A second instrument has its vernier zero to the left of the main zero and the 9th division coincides when closed; a reading of 5.4 mm is taken. Find the true length.</p>
          <Given items={['1 "MSD" = 1 "mm"', 'N = 10']} />
          <ol className="steps">
            <Step title="Least count">
              <Eq src='"LC" = [ 1 | 10 ] "mm" = 0.1 "mm"' />
            </Step>
            <Step title="Observed reading in (b)">
              <Eq src='"reading" = 23 + 7 × 0.1 = 23.7 "mm"' />
            </Step>
            <Step title="Zero error in (b) and correction">
              <Eq src={['"zero error" = + 3 × 0.1 = + 0.3 "mm"', '"true" = 23.7 − 0.3 = 23.4 "mm"']} />
            </Step>
            <Step title="Part (c): a negative zero error">
              <Eq src={['"zero error" = − ( 10 − 9 ) × 0.1 = − 0.1 "mm"', '"true" = 5.4 − ( − 0.1 ) = 5.5 "mm"']} />
            </Step>
          </ol>
          <Answer>LC = 0.1 mm. The true length in (b) is 23.4 mm; in (c) it is 5.5 mm. A positive zero error is taken away; a negative one is added.</Answer>
          <figure className="t-figure">
            <Vernier title="A vernier calipers reading 23.7 millimetres, with the main scale reading 23 and the seventh vernier division coinciding" r={23.7} loop={9} />
          </figure>
          <figure className="t-figure">
            <Vernier title="Closed vernier jaws with the third division coinciding: a zero error of plus 0.3 millimetres" r={0.3} closed loop={8} />
          </figure>
        </Example>

        <Example n={5} title="A screw gauge on a wire">
          <p className="ex-q">A screw gauge has a pitch of 0.5 mm and 50 divisions on its circular scale. On a wire the pitch scale reads 2.5 mm and the circular scale reads 36. With the jaws closed the circular scale reads 2. Find the diameter. What if the closed reading had been 46?</p>
          <Given items={['"pitch" = 0.5 "mm"', 'N = 50', '"PSR" = 2.5 "mm"', '"CSR" = 36']} />
          <ol className="steps">
            <Step title="Least count">
              <Eq src='"LC" = [ 0.5 | 50 ] = 0.01 "mm"' />
            </Step>
            <Step title="Observed reading">
              <Eq src='"reading" = 2.5 + 36 × 0.01 = 2.86 "mm"' />
            </Step>
            <Step title="Zero error and correction (closed reading 2)">
              <Eq src={['"zero error" = + 2 × 0.01 = + 0.02 "mm"', '"diameter" = 2.86 − 0.02 = 2.84 "mm"']} />
            </Step>
            <Step title="If the closed reading had been 46">
              <Eq src={['"zero error" = − ( 50 − 46 ) × 0.01 = − 0.04 "mm"', '"diameter" = 2.86 − ( − 0.04 ) = 2.90 "mm"']} />
            </Step>
          </ol>
          <Answer>The diameter is 2.84 mm with the +0.02 mm zero error. With the negative zero error of −0.04 mm, it would be 2.90 mm.</Answer>
          <figure className="t-figure">
            <ScrewGauge title="A screw gauge showing 2.86 millimetres on an object whose true diameter is 2.84 millimetres, because the instrument has a zero error of plus 0.02 millimetres" obj={2.84} z={0.02} loop={10} />
          </figure>
        </Example>

        <Example n={6} title="g from a pendulum, with its error">
          <p className="ex-q">A pendulum of length 1.000 ± 0.002 m takes 40.2 s for 20 oscillations. The stopwatch reaction error is 0.2 s. Find g and its error.</p>
          <Given items={['L = 1.000 ± 0.002 "m"', 'n = 20', 't = 40.2 "s"', 'Δ t = 0.2 "s"']} />
          <ol className="steps">
            <Step title="Period and its error">
              <Eq src={['T = [ 40.2 | 20 ] = 2.01 "s"', 'Δ T = [ 0.2 | 20 ] = 0.01 "s"']} />
            </Step>
            <Step title="The value of g">
              <Eq src='g = [ 4 · π ^2 · L | T ^2 ] = [ 39.48 · 1.000 | 4.040 ] = 9.77 "m/s²"' />
            </Step>
            <Step title="The relative error">
              <Eq src='[ Δ g | g ] = [ 0.002 | 1.000 ] + 2 · [ 0.01 | 2.01 ] = 0.002 + 0.0100 = 0.0120' />
            </Step>
            <Step title="The absolute error">
              <Eq src='Δ g = 0.0120 · 9.77 = 0.12 "m/s²"' />
            </Step>
          </ol>
          <Answer>g = 9.77 ± 0.12 m/s² (a 1.2 % error). The time contributes five times as much of the error as the length does, so a better stopwatch would help more than a better ruler.</Answer>
          <figure className="t-figure">
            <PendulumG />
          </figure>
        </Example>

        <Example n={7} title="g from the slope of a graph">
          <p className="ex-q">A pendulum is timed at five lengths and <M>T ^2</M> is plotted against <M>L</M>. The best-fit line passes through (0.20 m, 0.80 s²) and (1.20 m, 4.80 s²). Find g.</p>
          <Given items={['L = 0.40 , 0.60 , 0.80 , 1.00 , 1.20 "m"', 'T ^2 = 1.70 , 2.20 , 3.35 , 3.90 , 4.85 "s²"']} />
          <ol className="steps">
            <Step title="Slope from two points on the line">
              <Eq src='m = [ 4.80 − 0.80 | 1.20 − 0.20 ] = [ 4.00 | 1.00 ] = 4.00 "s²/m"' />
            </Step>
            <Step title="Use the slope">
              <Eq src={['T ^2 = [ 4 · π ^2 | g ] · L', 'g = [ 4 · π ^2 | m ] = [ 39.48 | 4.00 ] = 9.87 "m/s²"']} />
            </Step>
          </ol>
          <Answer>g = 9.87 m/s². The points on the line, not the data points, were used, and they are a full metre apart, so the slope is well determined.</Answer>
          <figure className="t-figure">
            <BestFit />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Errors cancel in a difference" wrong={'Δ x = Δ a − Δ b "for x = a − b"'} fig={<SumErr diff />}>
            Errors never help each other. For a difference, the worst case has the first quantity too big and the second too small, so the errors <em>add</em>: <M>Δ x = Δ a + Δ b</M>.
          </Mistake>
          <Mistake title="Adding the zero error" wrong={'"true" = "observed" + "zero error"'} fig={<Vernier title="Closed vernier jaws with a negative zero error: the vernier zero is left of the main zero and the ninth division coincides, an error of minus 0.1 millimetres" r={-0.1} closed loop={8} />}>
            A positive zero error means the instrument reads too much, so you <em>subtract</em> it. A negative one means it reads too little, so subtracting adds. Always: true = observed − zero error, with the sign of the zero error kept.
          </Mistake>
          <Mistake title="One swing is enough to time" wrong={'T = "time of one swing"'} fig={<TimingError />}>
            A reaction time error of 0.2 s is 10 % of a single 2 s swing, but only 0.5 % of 20 swings. Time many oscillations and divide, so the error in <M>T</M> shrinks by the number counted.
          </Mistake>
          <Mistake title="Slope from two nearby points" wrong={'m = [ y _2 − y _1 | x _2 − x _1 ] "from two neighbouring points"'} fig={<SlopeSpan />}>
            With the points close together, a small uncertainty in each makes the slope swing wildly. Use two points on the line that are far apart.
          </Mistake>
          <Mistake title="Writing more digits than the instrument gives" wrong={'L = 23.4567 "mm from a ruler"'} fig={<LeastCount />}>
            A ruler marked in millimetres can only give the nearest division. Extra digits are invented, not measured. Quote the reading to the least count, such as 23 mm.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Say the number, say the error, and say how you know.</p>
        <p className="closing-sub">Next: mathematical tools. Slopes, areas and small-change approximations are what graphs and errors are really made of.</p>
      </footer>
    </ChapterShell>
  );
}
