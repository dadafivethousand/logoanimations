# logoanimations — the Code Ninjas logo, themed

Sibling to `../animations` and deliberately the same shape: a React (Create
React App) project of self-contained full-screen compositions, one rendered at a
time out of `src/App.js`. The difference is the subject — **here the only thing
on screen is the logo**, dressed in a theme (samurai, robotics, cyberpunk, ice,
whatever's asked for).

## How this repo is used

**The user names a theme, you spin it up.** "Do a samurai one." "Make it
robotics." One theme = one component + one stylesheet, added on demand. That's
the whole workflow — no registries, no switcher UI, no canvas pickers. Copy an
existing theme and go.

The logo lives at `src/Images/logo.png` and the user drops replacements into
`~/Downloads`; `npm run logo` imports the newest one.

## Animated or static is the user's call

Every theme takes `mode="animated" | "static"`, set in `src/App.js`:

- **animated** — the sequence plays and loops, for screen-recording.
- **static** — snaps to the final phase; `.is-static` kills every transition and
  animation so the frame holds as a still.

**A theme isn't done until both modes look finished.** Any effect with no
resting state (a one-pass sweep, a mill line) must be forced off in the
`.is-static` block; anything that should persist (a specular highlight, a filled
bar) needs a frozen value there. Same for `prefers-reduced-motion`.

## These are Instagram posts — vary the palette per theme

Same rule as the sibling repo: the compositions sit next to each other on one
feed, so **give each theme its own colour story.** Samurai is night indigo,
cold steel and molten orange; Robotics is graphite, steel and green. Brand red `#e4002b` is the
through-line; everything around it changes theme to theme.

## MOBILE ONLY

Portrait phone (~390×844), screen-recorded. No desktop or landscape layouts, no
hover states. Size layout in `vw`/`vh`; reserve `px` for hairlines that must stay
hairlines (bevel rims, rules). Keep everything meaningful inside `--safe-x` /
`--safe-y` — the recording crop eats the edges.

## Layout & structure

- One theme = **one component in `src/Components/` + one stylesheet in
  `src/Stylesheets/`** with the same name. Parked work lives in `src/Used/`.
- Only **one theme renders at a time**, chosen in `src/App.js` — swap the import
  and the returned component; leave the previous one commented out.
- Prefix every class with a short per-theme namespace (`sm-`, `rb-`) so
  stylesheets can't collide.
- `src/Utils/usePhases.js` is the shared cue machine: pass cue times in ms, get
  a `phase` integer, put it on the root as `.xx-p0`..`.xx-pN` and key **all** the
  animation off those classes in CSS. JS only advances phases.
- `src/Utils/useLogo.js` alpha-trims whatever logo is dropped in and publishes
  `--logo` + `--logo-aspect`. Size the mark with
  `aspect-ratio: var(--logo-aspect)` — never a hard-coded ratio, or the next
  logo lands off-register.

## How the logo gets its material — the core technique

The mark is **never an `<img>` you tint.** Each theme paints its material on a
full-size layer and masks it through the logo's alpha:

```css
.xx-layer {
  position: absolute; inset: 0;
  -webkit-mask-image: var(--logo); mask-image: var(--logo);
  -webkit-mask-size: contain; mask-size: contain;
  mask-repeat: no-repeat; mask-position: center;
}
```

Stack those layers — base material, grain, seams, specular — and the mark
becomes a window onto lacquer or brushed aluminium.

Hard-won details, don't relearn them:

- **Bevels come from a `drop-shadow` chain on a WRAPPER** around the painted
  layers. `drop-shadow` takes its shape from alpha, so the rims trace the
  letterforms. Put the chain on an empty masked box and it casts nothing — an
  invisible source gives an invisible shadow.
- **Never `transform` a masked layer to move a highlight.** The mask travels
  with it and the sweep passes outside the mark. Scroll an oversized
  `background-position` behind a fixed mask instead.
- **Organic shapes are inline SVG + `feTurbulence`/`feDisplacementMap`** — torn
  paper edges, dry-brush strokes, crackle seams, hamon temper lines. A plain
  circle reads as clip-art.
- **To cut the mark apart** (Samurai): render the whole masked stack once per
  piece, `clip-path` each copy to the band between two cut lines, then translate
  it along its cut. Every copy shares the mark box and the same mask, so the
  pieces stay in register and it reads as one sliced object. Push the polygon
  points outside 0–100% and let the element bounds clip.
- **Real surface behaviour.** Brushed metal needs directional grain *and* a
  moving conic specular. Lacquer needs colour under the black. Paper needs fibre
  noise multiplied over everything.
- `@property` for animatable angles/percentages so gradients interpolate
  instead of stepping.
- **Contrast beats fidelity.** A physically-correct near-black plate laid over
  the red hinomaru loses its letterforms; lift the mids until the mark reads.
- The logo file **must have a real alpha channel** — a mark flattened onto white
  renders as a styled rectangle. `npm run logo` warns if it can't find one.

## Running & verifying

- Dev server: `npm start` on **http://localhost:3000**. Run npm/build commands
  from the project root.
- Build check: `CI=true npx react-scripts build`.
- These are visual deliverables, so a build log proves nothing — take one
  headless still in `mode="static"`:
  ```bash
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=6000 \
    --window-size=1170,2532 --screenshot=out.png http://localhost:3000/
  ```
  **Use a large window at phone aspect (1170×2532), not 390×844** — headless
  clamps the layout viewport at small widths and the composition comes out
  looking off-centre and oversized when it isn't.
- The automation Chrome tab freezes CSS animation at t=0, so a screenshot only
  ever tells you about `static`. Motion has to be checked in a real foreground
  window or on device — flag timing as "verify on device."

## Copy / claims

Captions, kickers and seal glyphs default to placeholders. **Confirm real
wording with the user before treating them as final** — this is public-facing
marketing.

## Workflow

Commit and push after each change (per user preference). The remote is SSH —
the machine's stored HTTPS credential for GitHub 403s on push.
