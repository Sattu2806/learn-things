# Learn Things: Living Equations

A four-minute, black-and-white film about one equation, made the way 3Blue1Brown
makes videos: one narrated idea at a time, and every symbol shown as a picture.

```
y = v·sin θ·t − ½·g·t²
```

The same script does two jobs:

- **In the app** it plays like a video you can step into. Lesson mode stops at four
  "your turn" moments. There the scene goes live: change the speed, the angle or
  gravity (try the Moon), or swap `t²` for `t`, and watch what happens. Watch mode
  plays straight through.
- **On YouTube** it renders, frame by frame, to a 1080p video, with subtitles and
  a voiceover script timed to the picture.

There is also a **Theory** view (the tab at the top right) for reading and revising:
the ideas written out, every equation built step by step, a formula sheet, five
worked examples, common mistakes, practice questions with answers to reveal, and a
calculator for your own numbers. Key equations link to the moment in the film that
shows them, and the notes print cleanly in black on white.

A **Questions** tab holds original practice questions in the style of school exams, NEET,
JEE Main and JEE Advanced. Each has its own animation, an answer you can check (multiple
choice or a number), and a step-by-step solution. Progress is saved on the device.

### For students in other countries

Pick your course at the top: JEE, NEET or Indian boards; AP Physics 1 or C (US);
A-level (UK); IB Diploma; HSC (Australia); or first-year university. The first guess
comes from the browser's language and region. The course decides:

- which questions show first,
- which theory sections are in your syllabus (others are marked "Extra"),
- the value of g the calculator starts with (10 for JEE and NEET, 9.81 for A-level),
- a note on your books' notation (u or v₀ for the launch speed).

The film's narration is translated (Hindi and Spanish so far, in `translations.ts`)
for captions in the player and for subtitle files. YouTube takes one caption track
per language, so one video reaches more countries.

## The film

1. **The question**: every throw draws a parabola. Why?
2. **Switch off gravity**: a straight line, the same distance every half second, so the height is `v·sin θ·t`.
3. **Switch it back on**: a ghost ball keeps flying straight, and the real ball falls `½gt²` below it.
4. **Why t squared?**: a dropped ball falls 1, 4, 9, 16 units, because odd numbers stack into squares.
5. **Where it lands**: when the drop catches up with the rise, `t = 2v·sin θ / g`, and from that, `R = v²·sin 2θ / g`. 45° goes farthest.
6. **The whole picture**: a straight line, minus a drop that grows like `t²`.

## Chapters

Choose a chapter from the menu at the top. Projectile motion has the film, theory and
questions. Every other chapter now has a **Film** tab too: a short narrated film (one to
two minutes, five or so scenes, the key equations building at the top), with chapters,
a clickable transcript, captions, and the same 1080p video, subtitle and voiceover-script
export. The **Notes** tab (`#/<chapter>/notes`) holds the theory, worked examples and
animations. Each film lives in `src/chapters/<id>/film.ts`, built on the shared engine in
`src/chapters/film/` (`node scripts/shoot-film.cjs <id> <dir>` screenshots one for checking).

The notes cover:

- **Circular motion**: radians, angular velocity, centripetal acceleration and why it
  points inward, speeding up on a circle, equations of rotation, vector form, and the
  shadow that becomes simple harmonic motion. Six worked examples (a fan, the Earth,
  the Moon, a wheel, clock hands).

Coming next: relative velocity, motion in 3D, Newton's laws, friction. New chapters live
in `src/chapters/`, share the notes layout in `NotesPage.tsx`, and are listed in
`src/chapters/index.ts`.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test
npm run build    # static site in dist/
```

## Make the YouTube video

In the app, open **Make the video** at the bottom of the left panel and press
**Render video** (Chrome, Edge or Safari). From the command line:

```bash
npx playwright install chromium   # once
npm run render
```

You get three files:

| File | What it is |
| --- | --- |
| `living-equations.mp4` | 1920×1080, 30 fps, H.264 (WebM/VP9 if the browser has no H.264 encoder) |
| `living-equations.srt` | Subtitles. Upload them to YouTube as captions. |
| `living-equations-voiceover.txt` | The narration with timestamps, to record your voiceover against |

Subtitles and voiceover scripts are written in every language (`living-equations.hi.srt`
and so on). Options: `--fps 60`, `--captions` to burn captions into the picture,
`--lang hi` to burn them in Hindi, `--out name.mp4`,
and `--from 160 --to 200` to render only part of the film (seconds) while you edit.

Pacing assumes narration at about 150 words a minute. The "your turn" moments become
short "Pause and ponder" holds in the video. Every frame is computed from the timeline,
so the video never drops frames and renders faster than real time (about 3 minutes
for the whole film).

## Edit the film

The film is a script in `src/lessons/projectile/film.ts`. Each beat is one line of
narration plus what moves while it is spoken:

```ts
f.beat('In symbols: the rise equals the drop.', (k) => {
  k.set('eq', EQ.land1, { at: 0.3, dur: 1.4 });   // morph the equation
  k.tween('readout', 1, { at: 1.5, dur: 0.6 });   // or animate any number
});
```

A beat lasts as long as its narration takes to say or its animation takes to play,
whichever is longer.
Equations are written in a small notation (`film/math.ts`): `^2` is a superscript,
`[ a | b ]` a fraction, and `t#tR` names a symbol so a morph can carry it to its new
place, like Manim's `TransformMatchingTex`.

## Code map

| File | What it does |
| --- | --- |
| `src/film/timeline.ts` | The timeline: chapters, narrated beats, tweens and morphs. Also writes the subtitles and script. |
| `src/film/math.ts` | Typesets equations on a canvas and morphs one into another. |
| `src/film/export.ts` | Encodes the film to video in the browser, frame by frame (WebCodecs, via Mediabunny). |
| `src/lessons/projectile/film.ts` | The film script. |
| `src/lessons/projectile/render.ts` | Draws any moment of the film in a 1920×1080 frame. The app and the video use the same pixels. |
| `src/lessons/projectile/player.ts` | Plays the film on the page, stopping and going live at "your turn" moments. |
| `src/lessons/projectile/LessonPage.tsx` | The page: the Film and Theory tabs. |
| `src/lessons/projectile/FilmView.tsx` | The film screen: chapters and narration on the left, the player on the right. |
| `src/lessons/projectile/TheoryView.tsx` | The theory, formula sheet, worked examples, practice and calculator. |
| `src/lessons/projectile/TheoryMore.tsx` | Velocity, derivations, angles, heights, targets, inclines, relative motion, curvature, air. |
| `src/lessons/projectile/QuestionsView.tsx` | The Questions tab. |
| `src/lessons/projectile/questions.ts` | The question bank; `questions.test.ts` recomputes every answer. |
| `src/lessons/projectile/Scene.tsx` | Animated diagrams: balls, velocity arrows, slopes, walls, targets, planes. |
| `src/lessons/projectile/courses.ts` | Courses around the world and what each one covers. |
| `src/lessons/projectile/translations.ts` | The narration in other languages. |
| `src/lessons/projectile/Figures.tsx` | The theory page's still diagrams. |
| `src/lessons/projectile/numbers.ts` | Time, height and range for any launch, including from a height. |
| `src/ui/Math.tsx` | Sets the film's maths notation as HTML text. |
| `src/lessons/projectile/model.ts` | The physics, term by term. |
| `scripts/render.mjs` | `npm run render`: drives the app in a headless browser and saves the video. |

Fonts: Instrument Serif (titles and maths), Geist (text), Geist Mono (numbers).
