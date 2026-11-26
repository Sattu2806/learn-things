# Learn Things: Living Equations

A black-and-white film about one equation. Instead of sliders and a launch button,
**the equation is the controller**: every term of projectile motion is drawn in the
scene, and every number in it can be dragged.

```
x = v·cos θ·t
y = v·sin θ·t − ½·g·t²
```

- A hollow "ghost" ball rides the straight line the ball would follow with no gravity (`v·sin θ·t`).
- The real ball hangs exactly `½gt²` below it, joined by a visible bar.
- Tap a term and the scene isolates what it draws. Drag `v`, `θ`, `g` or the time `t`.
- Break the equation on purpose (`t` instead of `t²`, drop the `½`, flip the sign, swap sin and cos)
  and the motion breaks in front of you, next to the dotted correct path.

## The lesson

1. **Nothing pulling**: a straight line at constant speed.
2. **Add gravity**: the ball sits ½gt² below the no-gravity line.
3. **Why t²?**: the drops at 1, 2, 3 s go 1×, 4×, 9×. Break it and they go 1×, 2×, 3×.
4. **When does it land?**: when the drop catches the rise, worked out line by line.
5. **How far?**: R = v²·sin 2θ / g, with a draggable sin 2θ curve.
6. **Spot the bug**: a ball moves wrong because one symbol is broken. Watch, then tap the culprit.

Then a sandbox where every term and every mistake can be switched on and off.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # the physics and the lesson logic
npm run build    # static site in dist/
```

## Code map

| File | What it does |
| --- | --- |
| `src/lessons/projectile/model.ts` | The equations term by term, including the common mistakes. Pure functions. |
| `src/lessons/projectile/stage.ts` | The canvas: black-and-white film look, ghost ball, term bars, timeline. |
| `src/lessons/projectile/Equation.tsx` | The interactive equation and the maths typesetting. |
| `src/lessons/projectile/lesson.ts` | Chapters, derivations, bug rounds and progress. |
| `src/lessons/projectile/ProjectileLesson.tsx` | The screen: story panel on the left, the film on the right. |

Fonts: Instrument Serif (titles and maths), Geist (text), Geist Mono (numbers).
