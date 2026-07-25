# logoanimations — themed logo treatments

Renders **one logo** — `src/Images/logo.png` — dressed in a **theme**. Output is
production marketing material: Instagram posts, stories, reels, print stills.

Sibling to `../animations`, which holds full ad units. This repo is narrower and
deeper: **the mark is the entire subject**, and the CSS should go well past
"a gradient and a drop shadow".

## How this repo is used

**The user names a theme, you build it.** "Do a cyberpunk one", "make an ice
one". One theme = one component + one stylesheet, added on demand. Don't build
theme pickers, galleries, or infrastructure nobody asked for — the two existing
themes are the template, copy one and go.

## The user chooses animated vs static — never assume

Every theme takes `mode="animated" | "static"`, set in `src/App.js`:

- **animated** — the phase sequence plays and loops, for screen-recording.
- **static** — snaps to the final phase, `.is-static` kills every transition and
  animation, and the frame is the poster.

**A theme is only done when both modes look finished.** Any effect with no
resting state (a one-pass sweep, a mill line) must be forced off in the
`.is-static` block; anything that should persist (a specular highlight, a filled
bar) needs a frozen value there. Same for `prefers-reduced-motion`.

## Quality bar

- **Mask material through the mark's alpha.** Themes paint material on a
  full-size layer and mask it with `var(--logo)`. The mark is never an `<img>`
  you tint — it's a window onto lacquer, brushed aluminium, whatever.
- **Bevels come from `drop-shadow` chains on a wrapper** around the painted
  layers. `drop-shadow` takes its shape from alpha, so the rims trace the
  letterforms. Putting the chain on an empty masked box casts nothing — an
  invisible source gives an invisible shadow.
- **Never `transform` a masked layer to move a highlight.** The mask travels
  with it and the sweep passes outside the mark. Scroll an oversized
  `background-position` behind a fixed mask instead.
- **Organic shapes are inline SVG + `feTurbulence`/`feDisplacementMap`** — torn
  edges, dry-brush strokes, crackle seams, stamped ink. A plain circle reads as
  clip-art.
- **Real surface behaviour.** Brushed metal needs directional grain *and* a
  moving conic specular. Lacquer needs colour under the black. Paper needs fibre
  noise multiplied over everything.
- `@property` for animatable angles/percentages, so gradients interpolate
  instead of stepping.
- **Contrast beats fidelity.** A physically-correct near-black plate laid over
  the red disc loses its letterforms; lift the mids until the mark reads.

## Architecture

```
src/
  logo.js              the one mark; swap src/Images/logo.png
  App.js               picks the theme + MODE + CANVAS. That's the whole UI.
  Components/Stage.js  fixed-resolution canvas, scaled to fit
  Themes/<Name>.js     one theme = one component...
  Stylesheets/<Name>.css   ...+ one stylesheet, classes namespaced (sm-, rb-)
  Utils/usePhases.js   cue-driven phase machine (honours mode)
  Utils/useLogo.js     alpha-trims the mark, measures its aspect
  Used/                parked work, not compiled
```

**Author at true export resolution.** The Stage renders a real 1080×1920 (or
1080×1350 / 1080×1080) box and scales it with one transform to fit the window,
so sizes in theme CSS are **real export pixels** — a 3px bevel is 3px in the
final file. Positions should be **% of the stage** so a theme survives all three
canvases. Keep everything meaningful inside `--safe-x` / `--safe-y`; the
recording crop eats the edges.

`useLogo` alpha-trims whatever file is dropped in and publishes `--logo` and
`--logo-aspect`. Size the mark box with `aspect-ratio: var(--logo-aspect)` —
never a hard-coded ratio, or the next logo lands off-register.

## Getting the logo in

```bash
npm run logo                      # newest image in ~/Downloads
npm run logo -- ~/Downloads/x.png # a specific file
```

**The file must have a real alpha channel.** Themes mask through transparency;
a mark flattened onto white renders as a styled rectangle. The script warns if
the PNG has no alpha.

## Running & verifying

- `npm start` → http://localhost:3000
- Build check: `CI=true npx react-scripts build`
- **The automation Chrome tab freezes CSS animation at t=0**, so a headless
  screenshot only ever tells you about `mode="static"`. That is still worth
  doing — these are visual deliverables and a masking bug is invisible in a
  build log:
  ```bash
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=7000 \
    --window-size=1080,1920 --screenshot=out.png http://localhost:3000/
  ```
  Motion has to be checked in a real foreground window or on device — flag
  timing as "verify on device".

## Adding a theme

1. Copy `Themes/Samurai.js` + `Stylesheets/Samurai.css`, rename, including the
   class prefix.
2. Give it **a palette of its own.** These sit next to each other on one IG grid
   — if every theme is dark-navy-and-cyan the feed looks cheap. Brand red
   `#e4002b` is the through-line; everything around it changes per theme.
3. Set your own `CUES`, key all motion off `.xx-p0`..`.xx-pN`, keep JS to
   phase-advancing.
4. Fill in the `.is-static` and `prefers-reduced-motion` blocks. Not optional.
5. Point `src/App.js` at it, commenting out the previous import.

## Copy / claims

Captions, kickers and seal glyphs default to placeholders. **Confirm real
wording with the user before treating them as final** — this is public-facing
marketing.

## Workflow

Commit and push after each change (per user preference).
