# logoanimations

Takes **one logo** and dresses it in a **theme** — samurai, robotics, whatever
you ask for next — as production marketing material: Instagram posts, stories,
reels, print stills.

Sibling to [`animations`](https://github.com/dadafivethousand/animations), which
holds full ad units. Here the mark is the whole subject.

## Quick start

```bash
npm install
npm run logo        # pulls the newest image from ~/Downloads into src/Images/logo.png
npm start           # http://localhost:3000
```

The logo **must be a PNG with a transparent background** — themes mask their
material through its alpha, so a mark flattened onto white comes out as a styled
rectangle. `npm run logo` warns you if it can't find an alpha channel.

## Animated or static — your call, per render

Every theme runs both ways. Top of `src/App.js`:

```js
const MODE = "animated";   // "animated" | "static"
const CANVAS = "9x16";     // "9x16" story/reel · "4x5" feed portrait · "1x1" feed square
const GUIDES = false;      // safe-margin overlay while composing
```

| | |
|---|---|
| **animated** | The sequence plays and loops, so you get take after take while screen-recording. |
| **static** | Snaps to the final frame with all motion off — that's the poster. |

Themes are authored at **true export resolution** and scaled to fit your window,
so a 3px bevel is 3px in the exported file.

## Themes

**Samurai** — the mark forged as a lacquered armour plate with kintsugi gold
seams, on washi paper against a torn-edge hinomaru. Dry-brush sumi strokes,
hanko seal.

**Robotics** — the mark milled from brushed aluminium with an anodized red edge,
bolted to a mounting plate with PCB traces feeding into it and a HUD wrapped
around the frame.

## Adding one

Name a theme and it gets built: copy a theme's `.js` + `.css`, rename (including
the class prefix), give it a palette of its own, and point `src/App.js` at it.
The techniques that make these read as real materials — alpha-masked material
layers, `drop-shadow` bevel chains, `feTurbulence` for organic edges, and the
traps to avoid — are written up in `CLAUDE.md`.
