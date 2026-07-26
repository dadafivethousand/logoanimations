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
feed, so **give each theme its own colour story.** Samurai is washi cream and
vermilion; Robotics is graphite, steel and green; Pirates is deep ocean teal and
tarnished gold. Brand red `#e4002b` is the
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

## The mark is NOT one shape — read this before masking anything

`src/Images/logo.png` is a three-tone lockup, and the alpha channel carries none
of that distinction — it says only "ink here":

| region | colour in the artwork | mask |
|---|---|---|
| hood + "NINJAS" | black `#000` | `--logo-dark` |
| the band across the **eyes** | skin `#d7c19b` | `--logo-light` |
| "CODE" | blue `#3490bf` | `--logo-accent` |

**A theme that masks only by `--logo` flattens all three into one material and
the ninja loses his eyes.** That shipped once and the user caught it immediately.
`useLogo` segments the opaque pixels by tone and publishes a mask per region, so
give the eye band and "CODE" their own value — that's what keeps the lockup
reading as the logo after it's been turned into gold or steel. All three themes do this: Pirates gives the eye band pale silvered gold
(`.pc-face`) and "CODE" a cooler metal (`.pc-code`); Samurai and Robotics paint
the dark region — hood, "NINJAS" and the eye slits — with `.sm-hood` / `.rb-hood`
masked by `--logo-dark`.

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
- **Build one space, not a diorama.** The first Pirates pass stacked sky / sea /
  deck as three bands and every seam read as a hard edge straight through the
  composition. A single volume — water with light falling through it — has depth
  for free. If a theme needs a horizon, hide it behind fog or a gradient falloff.
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

## WOODBRIDGE is always welded under the mark

The caption is a **flow sibling of the mark inside the mark wrapper** — never
positioned independently:

```jsx
<div className="xx-markwrap">     {/* absolute, centres the whole lockup */}
  <div className="xx-markbox">    {/* relative: holds the mark + its glows   */}
    <div className="xx-mark"> …material layers… </div>
  </div>
  <div className="xx-type">WOODBRIDGE</div>   {/* in flow, margin-top only */}
</div>
```

Absolutely positioning the caption at some `top: %` drifts it halfway down the
frame the moment anything else moves — which shipped, and the user asked for it
to be fixed. As a flow sibling it cannot separate from the logo, and the pair
centre together as one lockup. All three themes do it this way.

## Copy

**The only text on screen is CODE NINJAS WOODBRIDGE**, and the logo itself
supplies "CODE NINJAS" — so a theme renders exactly one word: WOODBRIDGE. No
taglines, no kickers, no HUD readouts, no "CODE · BUILD · PLAY". The user asked
for these to be gone; don't reintroduce them when adding a theme.

Anything beyond that word is a claim, so **confirm the wording with the user
before treating it as final** — this is public-facing marketing.

## Workflow

Commit and push after each change (per user preference). The remote is SSH —
the machine's stored HTTPS credential for GitHub 403s on push.
