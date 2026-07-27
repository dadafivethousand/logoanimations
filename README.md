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

**Pirates** — the ninja turned pirate: a tricorn drops onto the crown, an
eyepatch snaps over one eye and a gold hoop lands at his jaw, the mark itself in
salvaged gold. Behind him, a moonlit sea with a black galleon crossing the moon.
The gear is placed off head bounds measured from the artwork's own pixels, so it
lands on the head rather than near it.

## Adding one

One theme = one component in `src/Components/` + one stylesheet in
`src/Stylesheets/`, classes namespaced with a short prefix, timing driven by
`usePhases`. Copy an existing pair, give it a palette of its own, and point
`src/App.js` at it.

The techniques that make these read as real materials — alpha-masked material
layers, `drop-shadow` bevel chains, `feTurbulence` for organic edges — and the
traps that waste an hour are written up in `CLAUDE.md`.
