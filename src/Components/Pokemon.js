// Pokemon.js — a Poké Ball drops in, wobbles, and BURSTS: out of the release
// beam rises the Code Ninjas ninja drawn as a Charmander. Name welded under it.
//
// Genre, not franchise. No franchise wordmark, no trainer, no series typeface —
// the read comes from the beats (drop · wobble · burst · release) and from the
// creature: the MARK's head — flat black disc, skin band, angular slits — on a
// Charmander body: orange hide, cream belly, clawed limbs, tail flame.
//
// NO LOGO FILE. Like Patriot and Hulk, this theme never calls useLogo: a raster
// mark cannot be given a snout, a jaw and a tail, and the three passes that
// went into learning that on Hulk are in CLAUDE.md. The ninja is DRAWN and the
// name is set as type, so the theme survives the logo file being replaced.
//
// Colour story: plum-indigo dusk, one warm key off the tail flame, brand red
// #e4002b carried by the ball's top shell. Deliberately unlike the siblings —
// no cream/vermilion (Samurai), no graphite/green (Robotics), no cyan
// (Hologram), no paper (SoundOn).
//
// GEOMETRY NOTE — every animated group carries a `pk-anchor` rect spanning the
// whole viewBox. `transform-box: fill-box` then resolves to the viewBox itself,
// so a transform-origin percentage means the same thing everywhere: x/400,
// y/620 in scene units. Without it each group's origin drifts with its own
// bounding box and the creature stops growing out of the ball's mouth.
import React from "react";
import "../Stylesheets/Pokemon.css";
import usePhases from "../Utils/usePhases";

// p1 the ball drops · p2 it wobbles · p3 BURST · p4 the release · p5 the name
const CUES = [250, 1300, 2700, 3020, 4200];

/* Sparks thrown off the burst. Computed once so every take composes the same —
   a random scatter re-rolls between takes and the recording never matches. */
const SPARKS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2 - Math.PI / 2;
  const reach = i % 2 === 0 ? 190 : 132;
  return {
    x: +(Math.cos(a) * reach).toFixed(1),
    y: +(Math.sin(a) * reach * 0.86).toFixed(1),
    s: i % 3 === 0 ? 1.25 : 0.85,
    i,
  };
});

/* Embers drifting up off the flame key. Hand-placed for the same reason. */
const EMBERS = [
  [12, 0.0, 0.9, 7.4], [24, 1.6, 0.6, 8.8], [37, 0.7, 1.2, 6.6],
  [49, 2.4, 0.7, 9.2], [58, 1.1, 0.5, 7.8], [69, 3.0, 1.0, 8.2],
  [78, 0.4, 0.8, 6.9], [88, 2.0, 0.6, 9.6], [93, 1.3, 1.1, 7.1],
  [5, 2.7, 0.7, 8.5],
];

const SPARK = "M0 -11 L2.6 -2.6 L11 0 L2.6 2.6 L0 11 L-2.6 2.6 L-11 0 L-2.6 -2.6 Z";

export default function Pokemon({
  mode = "animated",
  brand = "CODE NINJAS",
  caption = "WOODBRIDGE",
  loopAt = 8600,
}) {
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt });

  return (
    <div className={`pk pk-p${phase} ${isStatic ? "is-static" : ""}`} key={run}>
      <PokemonDefs />

      {/* ---- the space: one graded volume, no stacked bands ---- */}
      <div className="pk-dusk" aria-hidden />
      <div className="pk-key" aria-hidden />

      <div className="pk-embers" aria-hidden>
        {EMBERS.map(([x, d, s, t], i) => (
          <span
            key={i}
            className="pk-ember"
            style={{ "--x": `${x}%`, "--d": `${d}s`, "--s": s, "--t": `${t}s` }}
          />
        ))}
      </div>

      {/* ---- the lockup: scene + name, welded ---- */}
      <div className="pk-lockup">
        <div className="pk-stagebox">
          {/* burst rays sit at the ball's resting position, behind everything */}
          <div className="pk-rays" aria-hidden />
          <div className="pk-flash" aria-hidden />

          {/* the camera: tight on the ball while it wobbles, pulls back on the
              burst so the creature has room. On a wrapper div, not a <g> —
              percentage transform-origin on HTML is the one that never
              surprises across engines. */}
          <div className="pk-cam">
            <svg className="pk-scene" viewBox="0 0 400 620" aria-hidden>
              {/* floor: a glow, not a horizon line — a hard edge across the
                  frame reads as two stacked bands instead of one space */}
              <ellipse className="pk-floor" cx="200" cy="600" rx="150" ry="26" />

              {/* the release beam, widening up out of the open shell */}
              <g className="pk-beam">
                <rect className="pk-anchor" x="0" y="0" width="400" height="620" fill="none" />
                <path d="M182 545 L110 126 L290 126 L218 545 Z" />
              </g>

              <Charmninja />

              {/* the ball is drawn AFTER the creature: the open shell sits in
                  front of it, which is what puts the creature behind the
                  release rather than standing on top of a graphic */}
              <g className="pk-ball">
                <rect className="pk-anchor" x="0" y="0" width="400" height="620" fill="none" />

                <g className="pk-shell pk-shell-bot">
                  <rect className="pk-anchor" x="0" y="0" width="400" height="620" fill="none" />
                  <path
                    className="pk-shell-white"
                    d="M148 545 C 148 574, 171 597, 200 597 C 229 597, 252 574, 252 545 Z"
                  />
                </g>

                <g className="pk-shell pk-shell-top">
                  <rect className="pk-anchor" x="0" y="0" width="400" height="620" fill="none" />
                  <path
                    className="pk-shell-red"
                    d="M148 545 C 148 516, 171 493, 200 493 C 229 493, 252 516, 252 545 Z"
                  />
                  {/* a struck shell catches light in a band, not evenly */}
                  <ellipse
                    className="pk-shell-gloss"
                    cx="176"
                    cy="515"
                    rx="22"
                    ry="10"
                    transform="rotate(-34 176 515)"
                  />
                </g>

                <g className="pk-btn">
                  <circle className="pk-btn-rim" cx="200" cy="545" r="18" />
                  <circle className="pk-btn-face" cx="200" cy="545" r="12" />
                  <circle className="pk-btn-lamp" cx="200" cy="545" r="6.5" />
                </g>
              </g>

              {/* ---- the burst itself ---- */}
              <circle className="pk-shock pk-shock-1" cx="200" cy="545" r="52" />
              <circle className="pk-shock pk-shock-2" cx="200" cy="545" r="52" />

              <g className="pk-sparks">
                {SPARKS.map(({ x, y, s, i }) => (
                  <g key={i} transform="translate(200 545)">
                    {/* placement on the outer <g>, animation on the inner path:
                        a CSS transform REPLACES an SVG transform attribute, and
                        animating the placed element piles every spark on the
                        origin (this has bitten twice — see CLAUDE.md) */}
                    <path
                      className="pk-spark"
                      d={SPARK}
                      style={{ "--x": `${x}px`, "--y": `${y}px`, "--s": s, "--i": i }}
                    />
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* the name is a FLOW SIBLING of the scene, never positioned on its own
            — that is what keeps it under the creature instead of drifting */}
        <div className="pk-type">
          <svg viewBox="0 0 600 132" aria-label={`${brand} ${caption}`}>
            {/* outer keyline first, then the dark rule, then the fill:
                paint-order puts each stroke UNDER the glyph it belongs to */}
            <text className="pk-t pk-brand pk-brand-key" x="300" y="66" textAnchor="middle"
                  textLength="548" lengthAdjust="spacingAndGlyphs">{brand}</text>
            <text className="pk-t pk-brand pk-brand-face" x="300" y="66" textAnchor="middle"
                  textLength="548" lengthAdjust="spacingAndGlyphs">{brand}</text>

            <text className="pk-t pk-cap" x="300" y="114" textAnchor="middle"
                  textLength="418" lengthAdjust="spacingAndGlyphs">{caption}</text>
          </svg>
        </div>
      </div>

      <div className="pk-grain" aria-hidden />
      <div className="pk-vignette" aria-hidden />
    </div>
  );
}

/* ======================================================================
   THE CREATURE — the ninja as a Charmander, drawn here.

   The split is deliberate: the HEAD is the mark, the BODY is the Charmander.

   Drawing a Charmander head and hooding it was tried first and read as a
   cartoon lizard in a hood, not as Code Ninjas. So the head is now the
   artwork's own four flat shapes — black disc, two grey speculars, a straight
   skin band, two angular slits, knot to the left — and the Charmander is
   carried entirely by the body: orange hide, cream belly, stubby clawed limbs
   and the fat tapering tail with the flame on it. The snout welded under the
   band is the single liberty taken with the head.

   Flat fills throughout. The mark is clean vector, and a photoreal blob of a
   body next to a flat black disc reads as two different drawings.

   Drawn in scene units (400x620) so it shares one coordinate system with the
   ball, and its feet clear the open shell instead of standing on it.
   ====================================================================== */
function Charmninja() {
  return (
    <g className="pk-mon">
      <rect className="pk-anchor" x="0" y="0" width="400" height="620" fill="none" />

      <g className="pk-monbob">
        {/* ---- tail: fat at the root, tapering into the flame ---- */}
        <path
          className="pk-skin"
          d="M246 424 C 316 428, 362 386, 376 320 C 382 288, 380 258, 374 232 L 336 240 C 342 268, 344 294, 338 316 C 326 358, 296 380, 244 376 Z"
        />

        <g className="pk-flame">
          <rect className="pk-anchor" x="0" y="0" width="400" height="620" fill="none" />
          <g className="pk-flicker">
            <path
              className="pk-flame-outer"
              d="M355 140 C 372 178, 390 200, 390 228 C 390 254, 374 272, 354 272 C 334 272, 318 254, 318 230 C 318 200, 338 178, 355 140 Z"
            />
            <path
              className="pk-flame-inner"
              d="M355 182 C 366 208, 377 222, 377 238 C 377 256, 367 268, 354 268 C 341 268, 331 255, 331 238 C 331 222, 347 200, 355 182 Z"
            />
            <path
              className="pk-flame-core"
              d="M355 214 C 361 228, 367 234, 367 244 C 367 254, 361 260, 353 260 C 345 260, 339 253, 339 244 C 339 234, 349 226, 355 214 Z"
            />
          </g>
        </g>

        {/* ---- feet ---- */}
        <path className="pk-skin" d="M150 396 C 132 406, 128 428, 140 440 C 152 452, 184 452, 192 438 C 198 426, 196 404, 188 396 Z" />
        <path className="pk-skin" d="M250 396 C 268 406, 272 428, 260 440 C 248 452, 216 452, 208 438 C 202 426, 204 404, 212 396 Z" />
        <g className="pk-claw">
          <path d="M140 438 L145 452 L153 442 Z" />
          <path d="M157 443 L163 456 L171 445 Z" />
          <path d="M175 441 L181 452 L187 440 Z" />
          <path d="M260 438 L255 452 L247 442 Z" />
          <path d="M243 443 L237 456 L229 445 Z" />
          <path d="M225 441 L219 452 L213 440 Z" />
        </g>

        {/* ---- body ---- */}
        <path className="pk-skin" d="M200 246 C 260 246, 284 294, 284 338 C 284 392, 248 420, 200 420 C 152 420, 116 392, 116 338 C 116 294, 140 246, 200 246 Z" />
        <path className="pk-belly" d="M200 288 C 234 288, 248 314, 248 342 C 248 378, 226 398, 200 398 C 174 398, 152 378, 152 342 C 152 314, 166 288, 200 288 Z" />

        {/* ---- arms: short and tucked, clear of the tail ---- */}
        <path className="pk-skin" d="M126 312 C 106 320, 96 342, 98 362 C 100 378, 114 386, 126 378 C 136 370, 138 344, 140 326 Z" />
        <path className="pk-skin" d="M274 312 C 294 320, 304 342, 302 362 C 300 378, 286 386, 274 378 C 264 370, 262 344, 260 326 Z" />
        <g className="pk-claw">
          <path d="M100 374 L95 390 L108 384 Z" />
          <path d="M110 380 L110 395 L120 386 Z" />
          <path d="M121 381 L124 394 L132 383 Z" />
          <path d="M300 374 L305 390 L292 384 Z" />
          <path d="M290 380 L290 395 L280 386 Z" />
          <path d="M279 381 L276 394 L268 383 Z" />
        </g>

        {/* ---- the sash: brand red on the cream belly, and the only place the
                brand's own colour lands on the creature ---- */}
        <g className="pk-sash">
          <path className="pk-sash-band" d="M130 340 C 158 358, 242 358, 270 340 L 276 366 C 242 386, 158 386, 124 366 Z" />
          <path className="pk-sash-hi" d="M134 344 C 160 360, 240 360, 266 344 L 267 351 C 240 367, 160 367, 133 351 Z" />
        </g>

        {/* ---- the head: the ARTWORK's, near enough ----
             The first pass drew a Charmander head — big round eyes, a snout,
             a cowl — and it read as a cartoon lizard wearing a hood rather
             than as the Code Ninjas mark. The mark's head is four flat shapes
             and nothing else: a black disc, two grey speculars, a straight
             skin band across the eyes, and two angular slits, with the knot
             tied off to the left. That is what is drawn here. The Charmander
             lives in the BODY — orange hide, cream belly, claws, tail flame —
             and the one liberty taken with the head is the snout under the
             band. ---- */}
        <g transform="translate(200 158) scale(0.92) translate(-200 -150)">
        <g className="pk-knot">
          <path className="pk-hood" d="M104 126 C 84 116, 60 112, 50 120 C 60 130, 80 138, 100 141 Z" />
          <path className="pk-hood" d="M100 144 C 82 150, 66 164, 62 180 C 76 174, 92 162, 104 152 Z" />
        </g>

        <circle className="pk-hood" cx="200" cy="150" r="104" />

        <g clipPath="url(#pk-headclip)">
          {/* flat black lit by two crescents — the same two the artwork has.
              A gradient here is what made the head stop reading as the mark. */}
          <path className="pk-hood-hi" d="M108 112 C 124 66, 168 38, 220 40 C 272 42, 306 68, 316 106 C 296 76, 258 58, 216 56 C 168 54, 128 76, 108 112 Z" />
          <path className="pk-hood-hi" d="M104 188 C 122 232, 158 256, 200 256 C 242 256, 278 232, 296 188 C 286 240, 248 268, 200 268 C 152 268, 114 240, 104 188 Z" />

          {/* the band: straight edges, a hair off level, running the full width
              of the disc — the clip is what squares it off against the rim */}
          <path className="pk-eyeband" d="M84 126 L316 118 L316 152 L84 160 Z" />

          {/* the snout, welded to the underside of the band */}
          <path className="pk-eyeband" d="M166 148 C 166 174, 180 185, 200 185 C 220 185, 234 174, 234 148 Z" />
          <ellipse className="pk-nostril" cx="189" cy="164" rx="3.6" ry="2.8" />
          <ellipse className="pk-nostril" cx="211" cy="164" rx="3.6" ry="2.8" />

          {/* slits, not eyes: angled so the inner corners sit lower */}
          <path className="pk-eye" d="M134 132 C 152 132, 172 137, 186 144 C 168 148, 146 147, 134 144 C 132 140, 132 135, 134 132 Z" />
          <path className="pk-eye" d="M266 131 C 248 131, 228 136, 214 143 C 232 147, 254 146, 266 143 C 268 139, 268 134, 266 131 Z" />
        </g>
        </g>
      </g>
    </g>
  );
}

function PokemonDefs() {
  return (
    <svg className="pk-defs" aria-hidden focusable="false">
      <defs>
        {/* the band and the speculars run past the disc and are cut by it */}
        <clipPath id="pk-headclip">
          <circle cx="200" cy="150" r="104" />
        </clipPath>

        {/* the hide is lit from the upper left; flat orange reads as clip-art */}
        <radialGradient id="pk-skinfill" cx="34%" cy="26%" r="88%">
          <stop offset="0%" stopColor="#ffc584" />
          <stop offset="46%" stopColor="#f5a04e" />
          <stop offset="100%" stopColor="#dd8134" />
        </radialGradient>

        <radialGradient id="pk-bellyfill" cx="42%" cy="24%" r="88%">
          <stop offset="0%" stopColor="#fff4e0" />
          <stop offset="58%" stopColor="#ffe6c4" />
          <stop offset="100%" stopColor="#e8c391" />
        </radialGradient>

        {/* the shell's top is brand red, dished so it reads as a struck object */}
        <radialGradient id="pk-redfill" cx="32%" cy="24%" r="90%">
          <stop offset="0%" stopColor="#ff5b74" />
          <stop offset="42%" stopColor="#e4002b" />
          <stop offset="100%" stopColor="#8a0018" />
        </radialGradient>

        <radialGradient id="pk-whitefill" cx="34%" cy="24%" r="92%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="54%" stopColor="#eae3e8" />
          <stop offset="100%" stopColor="#a99fae" />
        </radialGradient>

        <linearGradient id="pk-beamfill" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#fff6dd" stopOpacity="0.85" />
          <stop offset="42%" stopColor="#ffc978" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffb85c" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="pk-typefill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="34%" stopColor="#ffd24a" />
          <stop offset="72%" stopColor="#ffab21" />
          <stop offset="100%" stopColor="#e8760f" />
        </linearGradient>

        {/* the tail flame is a live thing: a clean vector edge kills it */}
        <filter id="pk-fire" x="-40%" y="-30%" width="180%" height="170%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.09" numOctaves="3" seed="4" result="n">
            <animate attributeName="seed" values="4;9;4" dur="1.6s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* the creature sits in front of the beam, so it casts back onto it */}
        <filter id="pk-drop" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#12071f" floodOpacity="0.6" />
        </filter>
      </defs>
    </svg>
  );
}
