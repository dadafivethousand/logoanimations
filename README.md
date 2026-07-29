# logoanimations

Same idea as [`animations`](https://github.com/dadafivethousand/animations) —
full-screen compositions, one rendered at a time, screen-recorded for social —
except **the only thing on screen is the logo**, dressed in a theme.

Name a theme, it gets built. Samurai and Robotics are in as the templates.

## Run it

```bash
npm install
npm run logo        # imports the newest image from ~/Downloads as src/Images/logo.png
npm start           # http://localhost:3000
```

The logo **must be a PNG with a transparent background** — themes mask their
material through the mark's alpha, so a logo flattened onto white comes out as a
styled rectangle. `npm run logo` warns you if it can't find an alpha channel.

Mobile only, portrait phone. There is no desktop layout.

## Pick a theme, pick a mode

`src/App.js`:

```js
// import Robotics from "./Components/Robotics";
import Samurai from "./Components/Samurai";

function App() {
  return <Samurai mode="animated" />;
}
```

| mode | |
|---|---|
| `"animated"` | The sequence plays and loops, so you get take after take while screen-recording. |
| `"static"` | Snaps to the final frame with all motion off — that's the still. |

## Themes

**Samurai** — the mark forged in polished steel with a hamon temper line, cut
apart by three katana slashes: the pieces slide along their cut lines, the kerf
glows molten and cools, sparks throw off the blade. Night stage, low moon, wet
stone reflection.

**Robotics** — the mark milled from brushed aluminium with an anodized red edge,
bolted to a mounting plate, PCB traces running current into it, HUD frame.

**Pirates** — the logo as a pirate ninja and nothing else: a tricorn drops onto
the crown, an eyepatch snaps over one eye, a hoop lands at his jaw. No scene —
a lit stage, so all the attention is on the mark, which keeps its own colours
(blue CODE, black hood). The gear is placed off head bounds measured from the
artwork's own pixels, so it lands on the head rather than near it.

**Patriot** — a starred seal over a flag field, in Old Glory red, white and
blue: the ninja above, CODE NINJAS WOODBRIDGE set inside the disc under him.
The one theme that uses **no logo file at all** — the ninja is drawn and the
name is SVG text, so it survives the logo being missing or replaced. (The
earlier boxing version is parked in `src/Used/`.)

**BJJ** — a Code Ninjas Woodbridge patch sewn onto the back of a gi: charcoal
merrowed border rolled and lit like a bead of thread, twill face, tack stitching
round the inside, embroidered artwork and satin-stitched lettering, with the
cloth puckering where it is tacked down.

**Hulk** — CODE NINJAS WOODBRIDGE in hulk lettering and nothing else: heavy,
tightly packed, extruded with a stack of offset copies rather than a flat
shadow, cracked through the glyphs, roughened so it stops reading as a system
font. Cold, then a double-thump swell, then it slams and the frame shakes.
Deliberately small and centred, with room all round for a crop.

## Adding one

One theme = one component in `src/Components/` + one stylesheet in
`src/Stylesheets/`, classes namespaced with a short prefix, timing driven by
`usePhases`. Copy an existing pair, give it a palette of its own, and point
`src/App.js` at it.

The techniques that make these read as real materials — alpha-masked material
layers, `drop-shadow` bevel chains, `feTurbulence` for organic edges — and the
traps that waste an hour are written up in `CLAUDE.md`.
