import { buildFilm } from './film';
import { ChapterShell, type NoteSection } from '../NotesPage';
import { Eq, M } from '../../ui/Math';
import { Answer, Example, Given, Note, SectionHead, Step } from '../../lessons/projectile/theoryParts';
import { Mistake, Mistakes } from '../kit/Mistake';
import { AMSpectrum, AMWave, AnalogDigital, AntennaSize, Bandwidths, Detector, FMWave, NoiseCompare, Propagation, Quantise, Regeneration, Sampling, SpaceWave, SystemBlocks, Tuning } from './ComAnims';

/** Communication systems: signals, bandwidth, modulation, radio waves, digital signals and the receiver. */

const SECTIONS: NoteSection[] = [
  { id: 'idea', title: 'Parts of a communication system', group: 'Theory' },
  { id: 'signals', title: 'Analog and digital signals', group: 'Theory' },
  { id: 'bandwidth', title: 'Bandwidth', group: 'Theory' },
  { id: 'modulate', title: 'Why we need a carrier', group: 'Theory' },
  { id: 'am', title: 'Amplitude modulation', group: 'Theory' },
  { id: 'fm', title: 'Frequency modulation', group: 'Theory' },
  { id: 'waves', title: 'Ground, sky and space waves', group: 'Theory' },
  { id: 'digital', title: 'Digital signals and bits', group: 'Theory' },
  { id: 'receiver', title: 'The receiver: tuning and detection', group: 'Theory' },
  { id: 'sheet', title: 'Formula sheet', group: 'Use it' },
  { id: 'examples', title: 'Worked examples', group: 'Use it' },
  { id: 'mistakes', title: 'Common mistakes', group: 'Use it' },
];

const no = (id: string) => SECTIONS.findIndex((s) => s.id === id) + 1;

export default function Chapter() {
  return (
    <ChapterShell id="communication" film={buildFilm} sections={SECTIONS} sideTitle="Communication systems" sideLead="How a voice, a picture or a text message gets from one place to another: signals, carriers, modulation, radio waves and bits.">
      <header className="article-head">
        <span className="kicker">Physics · Communication</span>
        <h1 className="article-title">How does a voice cross the world?</h1>
        <p className="article-lead">A phone call, a radio programme and a video all do the same job: they carry information from one place to another. Doing it well means choosing how to shape the signal, what frequency to send it on, and what path the wave will take. This chapter goes through those choices one by one.</p>
      </header>

      <section className="t-section" id="t-idea">
        <SectionHead n={no('idea')} title="Parts of a communication system" />
        <p>
          Every communication system, from a pair of tin cans on a string to a satellite link, has the same basic parts:
        </p>
        <ul className="t-list">
          <li>
            The <strong>source</strong> makes the message: a voice, a picture, a block of text. A microphone or camera turns it into an electrical <strong>signal</strong>.
          </li>
          <li>
            The <strong>transmitter</strong> prepares the signal for the journey and sends it out. In a radio station this includes <em>modulation</em>, and an antenna to radiate the wave.
          </li>
          <li>
            The <strong>channel</strong> is the path between the two ends: a pair of wires, a coaxial cable, an optical fibre, or free space.
          </li>
          <li>
            The <strong>receiver</strong> picks up the wave and recovers the message: tuning, detecting and amplifying.
          </li>
          <li>
            The <strong>user</strong> is the final destination: a loudspeaker, a screen or a computer.
          </li>
        </ul>
        <figure className="t-figure">
          <SystemBlocks />
          <figcaption>A pulse of message passes through each stage. The channel adds noise, and the receiver has to pull the message back out of it.</figcaption>
        </figure>
        <p>
          Two things make real systems imperfect. <strong>Attenuation</strong> is the weakening of the signal as it travels, since some of its energy is absorbed or spread out. <strong>Noise</strong> is unwanted random disturbance added along the way, from electrical interference, lightning and the thermal motion of electrons in the circuits. Noise cannot be avoided, so what matters is how big the signal is compared with it. This is the <strong>signal-to-noise ratio</strong>:
        </p>
        <Eq src='SNR = [ P _s | P _n ]' />
        <p>
          where <M>P _s</M> is the power of the signal and <M>P _n</M> the power of the noise. To fight attenuation, a long link uses <strong>repeaters</strong>: stations that receive the weak signal and send it on again, stronger.
        </p>
      </section>

      <section className="t-section" id="t-signals">
        <SectionHead n={no('signals')} title="Analog and digital signals" />
        <p>
          An <strong>analog signal</strong> changes smoothly and can take any value in a range. The voltage from a microphone is analog: it follows the pressure of the sound wave. A <strong>digital signal</strong> takes only a few separate values, usually two: <em>high</em> and <em>low</em>, written 1 and 0. Computers, mobile phones and the internet all use digital signals.
        </p>
        <figure className="t-figure">
          <AnalogDigital />
          <figcaption>An analog signal has a value at every moment. A digital signal is a string of ones and zeros: each one is a pulse that is high, each zero is low.</figcaption>
        </figure>
        <p>
          Any signal can be thought of as a mixture of sine waves of different frequencies. Human speech has most of its energy between 300 Hz and 3100 Hz. Music for human hearing reaches up to 20 kHz. A television picture needs several megahertz. The range of frequencies in a signal decides how much room it needs, and this is the idea of bandwidth.
        </p>
      </section>

      <section className="t-section" id="t-bandwidth">
        <SectionHead n={no('bandwidth')} title="Bandwidth" />
        <p>
          The <strong>bandwidth</strong> of a signal is the width of the band of frequencies it contains: the highest frequency minus the lowest.
        </p>
        <Eq src='BW = f _max − f _min' />
        <p>
          Speech from 300 Hz to 3100 Hz has a bandwidth of 2800 Hz, or about 3 kHz. The <strong>bandwidth of a channel</strong> is the range of frequencies it can carry without much loss. A channel can carry a signal only if its bandwidth is at least as large as the signal&apos;s.
        </p>
        <figure className="t-figure">
          <Bandwidths />
          <figcaption>Bandwidths on a log scale, so that each step to the right is ten times more. Pictures need far more room than speech, which is why a television channel is 6 MHz wide.</figcaption>
        </figure>
        <p>
          Bandwidth is shared. A radio band, such as the medium-wave band from 540 kHz to 1600 kHz, is divided into separate channels, one for each station. If each station needs a width <M>BW _channel</M>, the number of stations that fit is
        </p>
        <Eq src='N = [ BW _band | BW _channel ]' />
        <p>
          This is why the airwaves are a limited resource, and why sending more information per second, such as video instead of speech, needs a wider channel.
        </p>
      </section>

      <section className="t-section" id="t-modulate">
        <SectionHead n={no('modulate')} title="Why we need a carrier" />
        <p>
          Why not simply feed the microphone signal, at a few kilohertz, to an antenna and radiate it? There are three problems.
        </p>
        <ol className="steps">
          <li className="step">
            <h4>The antenna would be huge</h4>
            <p>
              To radiate well, an antenna must have a length <M>l</M> comparable with the wavelength, usually a quarter of it. The wavelength is
            </p>
            <Eq src={['λ = [ c | f ]', 'l = [ λ | 4 ]']} />
            <p>
              At 3 kHz the wavelength is 100 km, and the antenna would need to be 25 km tall. At 1 MHz it is 75 m, and at 100 MHz it is 0.75 m.
            </p>
          </li>
          <li className="step">
            <h4>Short antennas radiate very little power</h4>
            <p>
              The power radiated by an antenna grows with the square of the ratio of its length to the wavelength. A short antenna compared with the wavelength wastes the power:
            </p>
            <Eq src='P ∝ ( [ l | λ ] ) ^2' />
          </li>
          <li className="step">
            <h4>Signals would mix</h4>
            <p>
              Many people speak in the same range of frequencies. If all of them radiated together, a receiver could not tell them apart.
            </p>
          </li>
        </ol>
        <figure className="t-figure">
          <AntennaSize />
          <figcaption>The antennas are for 3 kHz, 1 MHz and 100 MHz. Each ring is one wavelength apart, and each antenna is a quarter of that.</figcaption>
        </figure>
        <p>
          The cure for all three is to put the message on a <strong>carrier wave</strong>, a steady sine wave of much higher frequency. Each station uses its own carrier frequency, so receivers can pick one out. The process of changing some feature of the carrier in step with the message is called <strong>modulation</strong>. The carrier can be changed in three ways: its amplitude, its frequency or its phase.
        </p>
      </section>

      <section className="t-section" id="t-am">
        <SectionHead n={no('am')} title="Amplitude modulation" />
        <p>
          In <strong>amplitude modulation</strong> (AM) the height of the carrier is made to follow the message. Write the carrier and the message as sine waves:
        </p>
        <Eq src={['c ( t ) = A _c · sin ( ω _c · t )', 'm ( t ) = A _m · sin ( ω _m · t )']} />
        <p>
          The amplitude of the carrier is made to be <M>A _c + m ( t )</M> instead of <M>A _c</M>, so the modulated wave is
        </p>
        <Eq src='c _m ( t ) = ( A _c + A _m · sin ( ω _m · t ) ) · sin ( ω _c · t )' />
        <figure className="t-figure">
          <AMWave />
          <figcaption>The message (top) and the carrier (middle) combine into the AM wave (bottom). The dashed lines trace its envelope, which is a copy of the message.</figcaption>
        </figure>
        <p>
          The <strong>modulation index</strong> is the ratio of the message amplitude to the carrier amplitude:
        </p>
        <Eq src={['μ = [ A _m | A _c ]', 'c _m ( t ) = A _c · ( 1 + μ · sin ( ω _m · t ) ) · sin ( ω _c · t )']} />
        <p>
          It tells how deeply the carrier is modulated. If <M>μ</M> is above 1 the envelope crosses zero and folds over, and the message comes out distorted. So we keep <M>μ ≤ 1</M>. You can find <M>μ</M> from the largest and smallest heights of the wave:
        </p>
        <Eq src='μ = [ A _max − A _min | A _max + A _min ]' />
        <h3 className="t-h3">What frequencies are in an AM wave?</h3>
        <p>Multiply out the brackets, then use the identity for a product of two sines:</p>
        <Eq src={['c _m ( t ) = A _c · sin ( ω _c · t ) + μ · A _c · sin ( ω _m · t ) · sin ( ω _c · t )', 'sin A · sin B = [ 1 | 2 ] · ( cos ( A − B ) − cos ( A + B ) )']} />
        <p>Putting <M>A = ω _c · t</M> and <M>B = ω _m · t</M>, we get three separate waves:</p>
        <Eq src='c _m ( t ) = A _c · sin ( ω _c · t ) + [ μ · A _c | 2 ] · cos ( ( ω _c − ω _m ) · t ) − [ μ · A _c | 2 ] · cos ( ( ω _c + ω _m ) · t )' />
        <p>
          The first is the carrier itself, at <M>f _c</M>. The other two are called <strong>sidebands</strong>, at <M>f _c − f _m</M> and <M>f _c + f _m</M>, each with amplitude <M>μ · A _c / 2</M>. The message is carried entirely in the sidebands. The bandwidth is the gap between the two sidebands:
        </p>
        <Eq src='BW = ( f _c + f _m ) − ( f _c − f _m ) = 2 · f _m' />
        <figure className="t-figure">
          <AMSpectrum />
          <figcaption>The spectrum: a carrier line with a sideband on each side. A higher message frequency pushes the sidebands farther out. A bigger <M>μ</M> makes them taller.</figcaption>
        </figure>
        <p>
          The bandwidth depends on the highest message frequency and not on the carrier. For AM speech up to 5 kHz it is 10 kHz, which is why AM stations are spaced about 10 kHz apart.
        </p>
        <p>
          The sidebands carry the message but the carrier alone carries no information. The power in the modulated wave is
        </p>
        <Eq src='P _t = P _c · ( 1 + [ μ ^2 | 2 ] )' />
        <p>
          At full modulation <M>μ = 1</M>, the carrier still takes two thirds of the power. This is not very efficient, but it makes receivers cheap and simple.
        </p>
      </section>

      <section className="t-section" id="t-fm">
        <SectionHead n={no('fm')} title="Frequency modulation" />
        <p>
          In <strong>frequency modulation</strong> (FM) the amplitude of the carrier stays constant, and the message changes its <em>frequency</em>: higher where the message is high, lower where it is low.
        </p>
        <Eq src='f = f _c + k _f · m ( t )' />
        <figure className="t-figure">
          <FMWave />
          <figcaption>The FM wave keeps the same height (the dashed lines) while it bunches up and spreads out in time with the message.</figcaption>
        </figure>
        <p>
          The largest change of frequency away from the carrier is the <strong>frequency deviation</strong> <M>Δf</M>, set by the strongest part of the message. The ratio of the deviation to the message frequency is the <strong>modulation index</strong> of FM:
        </p>
        <Eq src={['Δf = k _f · A _m', 'm _f = [ Δf | f _m ]']} />
        <p>
          An FM wave contains many sidebands, but nearly all the power sits within a band whose width is given by <strong>Carson&apos;s rule</strong>:
        </p>
        <Eq src='BW ≈ 2 · ( Δf + f _m )' />
        <p>
          That is much wider than the <M>2 · f _m</M> of AM. In return, FM is much better at ignoring noise. Most electrical noise (sparks, lightning, motors) adds to the <em>height</em> of the wave. An AM receiver reads the height as the message, so the noise is heard as crackle. An FM receiver reads the spacing of the waves, and can clip the height flat first, throwing the noise away.
        </p>
        <figure className="t-figure">
          <NoiseCompare />
          <figcaption>The same noise spikes hit both waves. The AM message is spoiled, but the FM wave is clipped back to its constant height without any loss.</figcaption>
        </figure>
        <div className="t-table-wrap">
          <table className="t-table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">AM</th>
                <th scope="col">FM</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">What changes</th>
                <td>Amplitude</td>
                <td>Frequency</td>
              </tr>
              <tr>
                <th scope="row">Broadcast band</th>
                <td>540 to 1600 kHz</td>
                <td>88 to 108 MHz</td>
              </tr>
              <tr>
                <th scope="row">Width of one station</th>
                <td>About 10 kHz</td>
                <td>About 200 kHz</td>
              </tr>
              <tr>
                <th scope="row">Noise</th>
                <td>Picks up noise</td>
                <td>Rejects most noise</td>
              </tr>
              <tr>
                <th scope="row">Range</th>
                <td>Long, by ground and sky waves</td>
                <td>Short, to the horizon</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="t-section" id="t-waves">
        <SectionHead n={no('waves')} title="Ground, sky and space waves" />
        <p>
          A radio wave leaves the antenna and reaches the receiver by one of three paths, depending mainly on its frequency.
        </p>
        <ul className="t-list">
          <li>
            <strong>Ground wave</strong> (up to about 2 MHz). The wave follows the surface of the Earth. The ground absorbs energy from it, and the higher the frequency the faster it is absorbed, so the range is limited to tens or hundreds of kilometres. Medium-wave AM stations are heard this way.
          </li>
          <li>
            <strong>Sky wave</strong> (about 2 to 30 MHz). Sunlight ionises the upper atmosphere, making layers of free electrons called the <strong>ionosphere</strong>, 60 to 400 km up. A wave in this range is bent back to the ground, like light inside a glass block. It can travel around the world by bouncing between the ground and the ionosphere. This is how short-wave radio works.
          </li>
          <li>
            <strong>Space wave</strong> (above about 30 MHz). Waves at very high frequency pass straight through the ionosphere and go in straight lines. This is the path of FM radio, television, mobile phones and satellite links.
          </li>
        </ul>
        <figure className="t-figure">
          <Propagation />
          <figcaption>The ground wave fades before it has gone far. The sky wave leaves the antenna, is bent back by the ionosphere and lands far beyond the horizon.</figcaption>
        </figure>
        <p>
          There is a limit to what the ionosphere can bend. A wave is returned only if its frequency is below the <strong>critical frequency</strong>, which depends on the largest electron density <M>N _max</M> (electrons per cubic metre):
        </p>
        <Eq src='f _c = 9 · √[ N _max ]' />
        <p>
          With <M>N _max = 10 ^12 "m⁻³"</M>, for example, <M>f _c = 9 · 10 ^6 "Hz" = 9 "MHz"</M>. Anything above this goes through, so that satellites and space probes can be reached.
        </p>
        <h3 className="t-h3">Space waves and the horizon</h3>
        <p>
          A space wave travels in a straight line and the Earth curves away below it, so the range is limited by the horizon. For a transmitting antenna on a tower of height <M>h</M>, the line to the horizon touches the Earth at a distance <M>d</M>. In the right triangle formed by the centre of the Earth, the antenna top and the point of touching, with <M>R = 6.4 × 10 ^6 "m"</M>, Pythagoras gives
        </p>
        <Eq src={['( R + h ) ^2 = R ^2 + d ^2', 'd ^2 = 2 · R · h + h ^2 ≈ 2 · R · h', 'd = √[ 2 · R · h ]']} />
        <p>
          We dropped <M>h ^2</M> because <M>h</M> is tiny compared to <M>R</M>. If the receiving antenna also has height <M>h _R</M>, the ranges add:
        </p>
        <Eq src='d _total = √[ 2 · R · h _T ] + √[ 2 · R · h _R ]' />
        <p>
          The area covered by a station is then <M>A = π · d ^2</M>. Doubling the height of the tower increases the range only by about 41%, but the area covered doubles.
        </p>
        <figure className="t-figure">
          <SpaceWave />
          <figcaption>The straight space wave touches the horizon and leaves the Earth. A receiver beyond the horizon gets nothing directly, but a satellite can see both and relay the signal.</figcaption>
        </figure>
        <p>
          A <strong>communication satellite</strong> in a geostationary orbit, 36 000 km above the equator, goes around once in 24 hours, so it stays over the same point and a fixed dish can be aimed at it. It receives the signal on one frequency (the <em>uplink</em>, about 6 GHz), amplifies it, and sends it back on another (the <em>downlink</em>, about 4 GHz), so that its own output does not drown the weak input. One satellite can see a third of the Earth&apos;s surface.
        </p>
      </section>

      <section className="t-section" id="t-digital">
        <SectionHead n={no('digital')} title="Digital signals and bits" />
        <p>
          To send a sound or a picture digitally, the analog signal is first changed to numbers by an <strong>analog-to-digital converter</strong> (ADC). There are two steps.
        </p>
        <h3 className="t-h3">1. Sampling</h3>
        <p>
          Measure the signal at regular intervals. The number of samples per second is the <strong>sampling rate</strong> <M>f _s</M>. The signal can be rebuilt without loss only if the sampling rate is at least twice the highest frequency in it (the <strong>Nyquist rule</strong>):
        </p>
        <Eq src='f _s ≥ 2 · f _max' />
        <figure className="t-figure">
          <Sampling />
          <figcaption>Eight samples per cycle trace the wave faithfully. Fewer than two per cycle would not.</figcaption>
        </figure>
        <h3 className="t-h3">2. Quantising</h3>
        <p>
          Each sample is rounded to the nearest of a set of fixed levels, and the level number is written in binary. With <M>n</M> <strong>bits</strong> (binary digits, each 0 or 1) there are
        </p>
        <Eq src='N = 2 ^n' />
        <p>
          levels. Three bits give 8 levels, 8 bits give 256, and 16 bits give 65 536. If the signal spans a range of voltage <M>V</M>, the step between levels, and so the largest rounding error, is
        </p>
        <Eq src='Δv = [ V | 2 ^n ]' />
        <figure className="t-figure">
          <Quantise />
          <figcaption>The dot follows the wave. At every moment the hollow ring shows the nearest level, and the three bits at the right are its number in binary.</figcaption>
        </figure>
        <p>
          More bits mean a finer picture of the wave. Each sample then produces <M>n</M> bits, so the <strong>bit rate</strong>, the number of bits sent per second, is
        </p>
        <Eq src='R = f _s · n' />
        <p>
          A rough rule is that a channel needs a bandwidth of about half the bit rate, <M>BW ≈ R / 2</M>. Sending more bits per second needs a wider channel.
        </p>
        <h3 className="t-h3">Why use digital signals?</h3>
        <p>
          Noise gets into any signal. In an analog signal the noise cannot be separated from the message, and each amplifier simply boosts both. In a digital signal there are only two valid levels, so a repeater can look at each pulse, decide whether it is a 1 or a 0, and send out a fresh, clean copy. A pulse spoiled by a bit of noise is still clearly one or the other.
        </p>
        <figure className="t-figure">
          <Regeneration />
          <figcaption>After the long cable both signals are noisy. The analog repeater can only make the noisy wave bigger. The digital repeater recovers the original ones and zeros exactly.</figcaption>
        </figure>
        <p>
          Digital signals can also be compressed, protected with error-checking codes, stored in computers and mixed with other digital data. To send bits as a wave, the carrier is modulated much as before: in <strong>amplitude shift keying</strong> a 1 and a 0 are different amplitudes, in <strong>frequency shift keying</strong> they are two different frequencies, and in <strong>phase shift keying</strong> they differ in phase.
        </p>
      </section>

      <section className="t-section" id="t-receiver">
        <SectionHead n={no('receiver')} title="The receiver: tuning and detection" />
        <p>
          The antenna of a radio picks up thousands of stations at once. The receiver has to pick one and recover its message. The chain for AM is: antenna, tuner, amplifier, detector, audio amplifier and loudspeaker.
        </p>
        <h3 className="t-h3">Tuning</h3>
        <p>
          The <strong>tuner</strong> is a coil of inductance <M>L</M> with a variable capacitor of capacitance <M>C</M>. Such a circuit responds strongly to one frequency, its <strong>resonant frequency</strong>, and weakly to all others:
        </p>
        <Eq src='f _0 = [ 1 | 2 · π · √[ L · C ] ]' />
        <p>
          Turning the knob changes <M>C</M>, and so moves the resonant frequency across the band. When it sits on a station&apos;s carrier frequency, that station is strongly received and the others are not.
        </p>
        <figure className="t-figure">
          <Tuning />
          <figcaption>The peak is the response of the tuned circuit. As the capacitor is turned, the peak slides along. Each station stands out strongly only when the peak is on it.</figcaption>
        </figure>
        <h3 className="t-h3">Detection</h3>
        <p>
          After amplification, the carrier has to be removed to leave the message. A <strong>detector</strong> does this for AM with a diode and a capacitor. The diode lets current pass in one direction only, so it cuts off the lower half of each cycle (<strong>rectification</strong>). A capacitor across the load charges up on each peak and leaks away slowly between them, smoothing out the carrier cycles but following the slower changes of the envelope. What is left is the message.
        </p>
        <figure className="t-figure">
          <Detector />
          <figcaption>The diode removes the lower half. The capacitor then smooths the carrier away, leaving the envelope: the original message.</figcaption>
        </figure>
        <Note label="Why the time constant matters">The capacitor must discharge slowly compared with one carrier cycle, but quickly compared with one message cycle. A carrier of 1 MHz and a message of 5 kHz easily satisfy both.</Note>
      </section>

      <section className="t-section" id="t-sheet">
        <SectionHead n={no('sheet')} title="Formula sheet" />
        <div className="t-table-wrap">
          <table className="t-table">
            <tbody>
              {(
                [
                  ['Bandwidth', 'BW = f _max − f _min'],
                  ['Number of channels', 'N = [ BW _band | BW _channel ]'],
                  ['Wavelength', 'λ = [ c | f ]'],
                  ['Antenna length', 'l = [ λ | 4 ]'],
                  ['Modulation index (AM)', 'μ = [ A _m | A _c ]'],
                  ['AM wave', 'c _m ( t ) = A _c · ( 1 + μ · sin ( ω _m · t ) ) · sin ( ω _c · t )'],
                  ['Sidebands', 'f _c − f _m , f _c + f _m'],
                  ['AM bandwidth', 'BW = 2 · f _m'],
                  ['AM power', 'P _t = P _c · ( 1 + [ μ ^2 | 2 ] )'],
                  ['FM modulation index', 'm _f = [ Δf | f _m ]'],
                  ['FM bandwidth (Carson)', 'BW ≈ 2 · ( Δf + f _m )'],
                  ['Range to the horizon', 'd = √[ 2 · R · h ]'],
                  ['Critical frequency', 'f _c = 9 · √[ N _max ]'],
                  ['Sampling rule', 'f _s ≥ 2 · f _max'],
                  ['Number of levels', 'N = 2 ^n'],
                  ['Bit rate', 'R = f _s · n'],
                  ['Resonant frequency', 'f _0 = [ 1 | 2 · π · √[ L · C ] ]'],
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
                  ['BW', 'Bandwidth', 'Hz'],
                  ['f _c', 'Carrier frequency', 'Hz'],
                  ['f _m', 'Message frequency', 'Hz'],
                  ['μ', 'Modulation index of AM', 'none'],
                  ['Δf', 'Frequency deviation of FM', 'Hz'],
                  ['R', 'Radius of the Earth, 6.4 × 10⁶ m (in range formulas), or the bit rate', 'm or bit/s'],
                  ['f _s', 'Sampling rate', 'Hz'],
                  ['n', 'Number of bits per sample', 'none'],
                ] as const
              ).map(([sym, meaning, unit]) => (
                <tr key={sym}>
                  <th scope="row">
                    <M>{sym}</M>
                  </th>
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

        <Example n={1} title="How many stations fit?">
          <p className="ex-q">Speech has frequencies from 300 Hz to 3100 Hz. What is its bandwidth? An AM station carries a message up to 5 kHz, and the medium-wave band runs from 540 kHz to 1600 kHz. How many stations can fit?</p>
          <Given items={['f _min = 300 "Hz"', 'f _max = 3100 "Hz"', 'f _m = 5 "kHz"']} />
          <ol className="steps">
            <Step title="Bandwidth of speech">
              <Eq src='BW = f _max − f _min = 3100 − 300 = 2800 "Hz"' />
            </Step>
            <Step title="Bandwidth of one AM station">
              <Eq src='BW _channel = 2 · f _m = 2 · 5 = 10 "kHz"' />
            </Step>
            <Step title="Stations in the band">
              <Eq src='N = [ 1600 − 540 | 10 ] = [ 1060 | 10 ] = 106' />
            </Step>
          </ol>
          <Answer>Speech needs 2800 Hz. Each AM station uses 10 kHz, so 106 stations fit in the medium-wave band.</Answer>
          <figure className="t-figure">
            <Bandwidths />
          </figure>
        </Example>

        <Example n={2} title="The size of an antenna">
          <p className="ex-q">Find the wavelength and the length of a quarter-wave antenna for a signal at 3 kHz, a carrier at 1 MHz and an FM carrier at 100 MHz. Use <M>c = 3 × 10 ^8 "m/s"</M>.</p>
          <Given items={['c = 3 × 10 ^8 "m/s"']} />
          <ol className="steps">
            <Step title="Speech at 3 kHz">
              <Eq src={['λ = [ c | f ] = [ 3 × 10 ^8 | 3 × 10 ^3 ] = 1 × 10 ^5 "m" = 100 "km"', 'l = [ λ | 4 ] = 25 "km"']} />
            </Step>
            <Step title="A carrier at 1 MHz">
              <Eq src={['λ = [ 3 × 10 ^8 | 1 × 10 ^6 ] = 300 "m"', 'l = [ 300 | 4 ] = 75 "m"']} />
            </Step>
            <Step title="An FM carrier at 100 MHz">
              <Eq src={['λ = [ 3 × 10 ^8 | 1 × 10 ^8 ] = 3 "m"', 'l = [ 3 | 4 ] = 0.75 "m"']} />
            </Step>
          </ol>
          <Answer>25 km, 75 m and 0.75 m. A 25 km antenna is impossible, but 0.75 m fits on a car roof. This is why we use a high-frequency carrier.</Answer>
          <figure className="t-figure">
            <AntennaSize />
          </figure>
        </Example>

        <Example n={3} title="An AM wave">
          <p className="ex-q">A carrier of amplitude 10 V and frequency 1.0 MHz is modulated by a 5 kHz tone of amplitude 6 V. Find the modulation index, the sideband frequencies and their amplitudes, the largest and smallest heights of the wave, the bandwidth, and the power compared with the carrier alone.</p>
          <Given items={['A _c = 10 "V"', 'A _m = 6 "V"', 'f _c = 1000 "kHz"', 'f _m = 5 "kHz"']} />
          <ol className="steps">
            <Step title="Modulation index">
              <Eq src='μ = [ A _m | A _c ] = [ 6 | 10 ] = 0.6' />
            </Step>
            <Step title="Sidebands">
              <Eq src={['f _c − f _m = 1000 − 5 = 995 "kHz"', 'f _c + f _m = 1000 + 5 = 1005 "kHz"', '[ μ · A _c | 2 ] = [ 0.6 · 10 | 2 ] = 3 "V"']} />
            </Step>
            <Step title="Largest and smallest height">
              <Eq src={['A _max = A _c + A _m = 16 "V"', 'A _min = A _c − A _m = 4 "V"', 'μ = [ 16 − 4 | 16 + 4 ] = 0.6']} />
            </Step>
            <Step title="Bandwidth and power">
              <Eq src={['BW = 2 · f _m = 10 "kHz"', 'P _t = P _c · ( 1 + [ 0.6 ^2 | 2 ] ) = 1.18 · P _c']} />
            </Step>
          </ol>
          <Answer>
            <M>μ = 0.6</M>. The sidebands are at 995 kHz and 1005 kHz, each 3 V high. The wave swings between 4 V and 16 V, the bandwidth is 10 kHz, and the total power is 1.18 times that of the unmodulated carrier.
          </Answer>
          <figure className="t-figure">
            <AMSpectrum />
          </figure>
        </Example>

        <Example n={4} title="An FM station">
          <p className="ex-q">An FM transmitter has a carrier at 100 MHz. A 15 kHz tone makes the frequency swing by 75 kHz on each side. Find the modulation index and the bandwidth by Carson&apos;s rule.</p>
          <Given items={['f _c = 100 "MHz"', 'f _m = 15 "kHz"', 'Δf = 75 "kHz"']} />
          <ol className="steps">
            <Step title="Modulation index">
              <Eq src='m _f = [ Δf | f _m ] = [ 75 | 15 ] = 5' />
            </Step>
            <Step title="Bandwidth">
              <Eq src='BW ≈ 2 · ( Δf + f _m ) = 2 · ( 75 + 15 ) = 180 "kHz"' />
            </Step>
          </ol>
          <Answer>The index is 5 and the bandwidth is about 180 kHz, which just fits inside the 200 kHz spacing between FM stations. An AM station with the same 15 kHz message would need only 30 kHz.</Answer>
          <figure className="t-figure">
            <FMWave />
          </figure>
        </Example>

        <Example n={5} title="A television tower">
          <p className="ex-q">A television tower is 200 m tall. How far can its signal reach on level ground, and what area does it cover? What is the range if the receiving antenna is on a 25 m mast and the transmitter is on a 100 m tower? Use <M>R = 6.4 × 10 ^6 "m"</M>.</p>
          <Given items={['h = 200 "m"', 'R = 6.4 × 10 ^6 "m"']} />
          <ol className="steps">
            <Step title="Range to the horizon">
              <Eq src='d = √[ 2 · R · h ] = √[ 2 · 6.4 × 10 ^6 · 200 ] = √[ 2.56 × 10 ^9 ] = 5.06 × 10 ^4 "m"' />
            </Step>
            <Step title="Area covered">
              <Eq src='A = π · d ^2 = π · ( 5.06 × 10 ^4 ) ^2 = 8.04 × 10 ^9 "m²" = 8040 "km²"' />
            </Step>
            <Step title="A 100 m tower and a 25 m mast">
              <Eq src={['d _T = √[ 2 · 6.4 × 10 ^6 · 100 ] = 35.8 "km"', 'd _R = √[ 2 · 6.4 × 10 ^6 · 25 ] = 17.9 "km"', 'd _total = 35.8 + 17.9 = 53.7 "km"']} />
            </Step>
          </ol>
          <Answer>The 200 m tower reaches 50.6 km on ground level and covers about 8040 km². With a 100 m tower and a 25 m receiving mast, the signal reaches 53.7 km.</Answer>
          <figure className="t-figure">
            <SpaceWave />
          </figure>
        </Example>

        <Example n={6} title="Telephone and CD">
          <p className="ex-q">Digital telephone speech is sampled 8000 times a second with 8 bits per sample. Find the number of levels and the bit rate. Is 8000 samples per second enough for speech up to 4 kHz? A music CD is sampled at 44 100 samples per second with 16 bits, in two channels. Find its bit rate and the data in one minute.</p>
          <Given items={['f _s = 8000 "Hz"', 'n = 8']} />
          <ol className="steps">
            <Step title="Levels">
              <Eq src='N = 2 ^8 = 256' />
            </Step>
            <Step title="Bit rate of the telephone">
              <Eq src='R = f _s · n = 8000 · 8 = 64 000 "bit/s" = 64 "kbit/s"' />
            </Step>
            <Step title="Is the sampling fast enough?">
              <Eq src='f _s ≥ 2 · f _max = 2 · 4000 = 8000 "Hz"' />
            </Step>
            <Step title="The CD">
              <Eq src={['R = 44 100 · 16 · 2 = 1.41 × 10 ^6 "bit/s"', '1.41 × 10 ^6 · 60 = 8.47 × 10 ^7 "bit" = 1.06 × 10 ^7 "bytes" = 10.6 "MB"']} />
            </Step>
          </ol>
          <Answer>256 levels and 64 kbit/s for the telephone; 8000 Hz is exactly the minimum for 4 kHz speech. A CD runs at 1.41 Mbit/s, or about 10.6 MB each minute.</Answer>
          <figure className="t-figure">
            <Quantise />
          </figure>
        </Example>

        <Example n={7} title="Tuning a radio">
          <p className="ex-q">A tuner has a coil of 250 μH. What capacitance tunes it to 1.0 MHz? What capacitance tunes it to 1.6 MHz?</p>
          <Given items={['L = 250 "μH"', 'f _1 = 1.0 "MHz"', 'f _2 = 1.6 "MHz"']} />
          <ol className="steps">
            <Step title="Solve the resonance formula for C">
              <Eq src={['f _0 = [ 1 | 2 · π · √[ L · C ] ]', 'C = [ 1 | 4 · π ^2 · f ^2 · L ]']} />
            </Step>
            <Step title="At 1.0 MHz">
              <Eq src='C = [ 1 | 39.48 · ( 1 × 10 ^6 ) ^2 · 2.5 × 10 ^−4 ] = [ 1 | 9.87 × 10 ^9 ] = 1.01 × 10 ^−10 "F" = 101 "pF"' />
            </Step>
            <Step title="At 1.6 MHz">
              <Eq src='C = [ 101.3 | 1.6 ^2 ] = [ 101.3 | 2.56 ] = 39.6 "pF"' />
            </Step>
          </ol>
          <Answer>101 pF for 1.0 MHz, and 39.6 pF for 1.6 MHz. To cover the whole band, the variable capacitor must range from about 40 pF to 101 pF.</Answer>
          <figure className="t-figure">
            <Tuning />
          </figure>
        </Example>
      </section>

      <section className="t-section" id="t-mistakes">
        <SectionHead n={no('mistakes')} title="Common mistakes" />
        <Mistakes>
          <Mistake title="Bandwidth is the highest frequency" wrong="BW = f _max" fig={<Bandwidths />}>
            Bandwidth is the <em>width</em> of the band: the highest frequency minus the lowest. A signal from 300 Hz to 3100 Hz has a bandwidth of 2800 Hz, not 3100 Hz.
          </Mistake>
          <Mistake title="Speech can be radiated directly" wrong={'"speech at 3 kHz" "sent directly"'} fig={<AntennaSize />}>
            A quarter-wave antenna for 3 kHz would be 25 km tall, and all stations would mix together. The message must ride on a high-frequency carrier.
          </Mistake>
          <Mistake title="FM changes the height of the wave" wrong={'"FM" = "changes the height"'} fig={<FMWave height={200} />}>
            FM changes the <em>frequency</em> and keeps the height constant. It is AM that changes the height. That is why noise, which changes the height, does less harm to FM.
          </Mistake>
          <Mistake title="The ionosphere reflects every frequency" wrong={'f > f _c = "reflected"'} fig={<Propagation />}>
            Only waves with frequency below the critical frequency are returned. Above it, in the VHF, UHF and microwave bands, the waves go straight through, which is just what we need for satellites.
          </Mistake>
          <Mistake title="More modulation is always better" wrong="μ = 1.5" fig={<AMWave mu={1.5} height={270} title="An AM wave with a modulation index of 1.5: the envelope crosses zero and folds over, so the message is distorted" />}>
            If <M>μ</M> is above 1, the envelope goes through zero and folds over, so the detector produces a distorted message. The modulation index must not be above 1.
          </Mistake>
          <Mistake title="Any sampling rate will do" wrong="f _s = 1.5 · f _max" fig={<Sampling fs={1.5} caption="1.5 samples per second: a false, slow wave appears" />}>
            Fewer than two samples per cycle cannot show the wave. The dots here join up as a wave of the wrong, lower frequency. Sample at least twice as fast as the highest frequency.
          </Mistake>
          <Mistake title="The bandwidth of AM depends on the carrier" wrong="BW = 2 · f _c" fig={<AMSpectrum />}>
            The bandwidth is set by the message: <M>2 · f _m</M>. A 5 kHz message on a 1 MHz carrier needs 10 kHz, not 2 MHz. The carrier only fixes <em>where</em> the band sits.
          </Mistake>
        </Mistakes>
      </section>

      <footer className="closing">
        <p className="closing-line">Shape the message, ride it on a carrier, and choose the path to suit the frequency.</p>
        <p className="closing-sub">The same ideas of waves and information run through electronics: the diode in a detector is one of the semiconductor devices you meet next.</p>
      </footer>
    </ChapterShell>
  );
}
