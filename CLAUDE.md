# logoanimations — animated logo reveals

A React (Create React App) project of self-contained **animated logo reveals**.
Each one is a full-screen composition whose single subject is a logo/mark: it
assembles, glitches in, stamps down, unfolds, etc. Sibling project to
`../animations` (full ad units); this one is narrower — **the logo is the ad.**

## These are social-media (Instagram) videos — vary the palette per animation

The workflow is: play the animation full-screen, **screen-record it, and post it
to Instagram.** They live next to each other on one feed/grid, so if every one
uses the same colour theme the feed looks repetitive and cheap.

**Give each new logo animation a distinct visual/colour identity.** Don't
default to the dark-navy/graphite "cinematic" palette every time — pick a colour
story that fits the concept (warm/sunset, neon arcade, clean daylight,
paper/print, retro CRT, chrome, etc.). The three that ship here are deliberately
spread apart: graphite (`LogoAssemble`), arcade violet (`LogoNeonGlitch`),
cream paper (`LogoInkStamp`). Brand red `#e4002b` is the through-line; the
surrounding palette changes animation to animation.

## Safe margins (screen-recording crop)

The recording gets re-fit to the phone screen before it goes to IG, so edges
crop more than you'd expect — especially the sides. **Keep ~40px clear
top/bottom and ~45px left/right.** No mark, wordmark, or caption inside that
band. In practice: **cap the mark around 64–70vw**, and keep tracked-out labels
short enough that letter-spacing doesn't push them wide.

## MOBILE ONLY

These are **only ever shown on mobile (portrait phone).** Do not build, test, or
tune desktop or landscape layouts — no desktop breakpoints, no hover states.
Design for ~390×844 and stop there.

## Layout & structure

- One animation = **one component in `src/Components/` + one stylesheet in
  `src/Stylesheets/`** with the same name (e.g. `LogoAssemble.js` +
  `LogoAssemble.css`).
- Only **one animation renders at a time**, chosen in `src/App.js` — swap the
  import and the returned component; leave the previous one commented out,
  don't delete.
- Logos/images go in `src/Images/`, fonts in `src/Fonts/`, shared helpers in
  `src/Utils/`.
- Prefix every class with a short per-animation namespace (`la-`, `ng-`, `is-`)
  so stylesheets can't collide.

## The phase machine

`src/Utils/usePhases.js` is the shared state machine: pass cue times in ms, get
back a `phase` integer. Put it on the root as a class (`la-p0`..`la-p3`) and key
**all** the animation off those classes in CSS. Keep JS to phase-advancing.
`loopAt` restarts the sequence so you get take after take while recording.

## Running & verifying

- Dev server: `npm start` (react-scripts) on **http://localhost:3000**. Run
  npm/build commands **from the project root**.
- Build check: `CI=true npx react-scripts build` from the root.
- **Verifying animation in the browser tool is unreliable**: the automation
  Chrome tab is backgrounded, so CSS animations freeze at t=0. To check a still,
  force the end state by hand (add the final `-p3` class). Real playback only
  happens on an actual phone — flag timing/motion as "verify on device."

## Style conventions

- Portrait-first. Size off `vh`/`vw` with `clamp()`; avoid fixed px for anything
  layout-bearing.
- Drive each composition off **one CSS custom property** (`--mark`) so the whole
  thing rescales from a single knob.
- Honour `prefers-reduced-motion` (disable animations, snap to the end state).
- The `cn-woodbridge-logo.png` wordmark has **no light-on-dark variant** and does
  **not** include "Woodbridge" text — add a separate "WOODBRIDGE" label for the
  full lockup, and foil it on dark with `grayscale(1) invert(1)` (a flat invert
  flattens the ninja head to a white disc).

## Copy / claims

Captions and taglines here are placeholders — **confirm real wording with the
user before treating them as final**, especially anything public-facing.

## Workflow

Commit and push after each change (per user preference).
