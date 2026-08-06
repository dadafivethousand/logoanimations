// Pokemon.js — a Poké Ball drops in, wobbles, and BURSTS: out of the release
// beam rises the Code Ninjas ninja drawn as a Charmander. Name welded under it.
//
// Genre, not franchise. No franchise wordmark, no trainer, no series typeface —
// the read comes from the beats (drop · wobble · burst · release) and from the
// creature: a Charmander — orange hide, blunt muzzle, cream underside, clawed
// limbs, and the tail flame.
//
// NO LOGO FILE, and no ninja on screen — asked for explicitly after two passes
// that hybridised the two. The brand is carried by the name set as type under
// the creature and by the ball's brand-red shell. Like Patriot and Hulk this
// theme never calls useLogo, so it survives the logo file being replaced.
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
   THE CREATURE — a Charmander, released from the ball.

   Earlier passes hybridised it with the ninja: a Charmander head under a hood,
   then the mark's own head on a Charmander body. Both were dropped — the
   creature is simply a Charmander now, and the brand is carried by the name
   set under it and by the ball's brand-red shell.

   What has to be right for it to read as Charmander rather than "an orange
   lizard": the blunt MUZZLE as a mass filling the lower face with the eyes
   sitting on top of it, the cream underside running unbroken from the jaw
   through the throat to the belly, three claws on every limb, and the fat
   tapering tail with the flame on the tip.

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
          d="M244 424 C 314 428, 360 388, 374 324 C 380 294, 378 262, 372 234 L 336 242 C 342 270, 344 296, 338 318 C 326 358, 296 378, 242 374 Z"
        />

        <g className="pk-flame">
          <rect className="pk-anchor" x="0" y="0" width="400" height="620" fill="none" />
          <g className="pk-flicker">
            <path
              className="pk-flame-outer"
              d="M356 142 C 373 180, 390 202, 390 230 C 390 256, 374 274, 354 274 C 334 274, 318 256, 318 232 C 318 202, 339 180, 356 142 Z"
            />
            <path
              className="pk-flame-inner"
              d="M356 184 C 367 210, 378 224, 378 240 C 378 258, 368 270, 355 270 C 342 270, 332 257, 332 240 C 332 224, 348 202, 356 184 Z"
            />
            <path
              className="pk-flame-core"
              d="M356 216 C 362 230, 368 236, 368 246 C 368 256, 362 262, 354 262 C 346 262, 340 255, 340 246 C 340 236, 350 228, 356 216 Z"
            />
          </g>
        </g>

        {/* ---- feet ---- */}
        <path className="pk-skin" d="M150 392 C 130 402, 126 428, 140 442 C 154 454, 186 454, 194 438 C 200 426, 198 402, 190 392 Z" />
        <path className="pk-skin" d="M250 392 C 270 402, 274 428, 260 442 C 246 454, 214 454, 206 438 C 200 426, 202 402, 210 392 Z" />
        <g className="pk-claw">
          <path d="M140 438 L145 454 L153 442 Z" />
          <path d="M157 444 L163 458 L171 446 Z" />
          <path d="M175 442 L181 454 L187 440 Z" />
          <path d="M260 438 L255 454 L247 442 Z" />
          <path d="M243 444 L237 458 L229 446 Z" />
          <path d="M225 442 L219 454 L213 440 Z" />
        </g>

        {/* ---- body ---- */}
        <path className="pk-skin" d="M200 232 C 262 232, 288 284, 288 332 C 288 388, 250 420, 200 420 C 150 420, 112 388, 112 332 C 112 284, 138 232, 200 232 Z" />
        <path className="pk-belly" d="M200 272 C 238 272, 254 304, 254 338 C 254 380, 230 402, 200 402 C 170 402, 146 380, 146 338 C 146 304, 162 272, 200 272 Z" />

        {/* ---- arms ---- */}
        <path className="pk-skin" d="M124 298 C 102 306, 90 330, 92 352 C 94 370, 110 380, 124 372 C 136 364, 138 334, 140 312 Z" />
        <path className="pk-skin" d="M276 298 C 298 306, 310 330, 308 352 C 306 370, 290 380, 276 372 C 264 364, 262 334, 260 312 Z" />
        <g className="pk-claw">
          <path d="M100 368 L95 384 L108 378 Z" />
          <path d="M110 374 L110 389 L120 380 Z" />
          <path d="M121 375 L124 388 L132 377 Z" />
          <path d="M300 368 L305 384 L292 378 Z" />
          <path d="M290 374 L290 389 L280 380 Z" />
          <path d="M279 375 L276 388 L268 377 Z" />
        </g>

        {/* the cream underside is ONE run from the jaw to the tail — drawn over
            the body and lapping the belly, so there is no seam at the neck */}
        <path className="pk-belly" d="M200 222 C 226 222, 244 234, 244 252 C 244 270, 224 282, 200 282 C 176 282, 156 270, 156 252 C 156 234, 174 222, 200 222 Z" />

        {/* ---- head: wide at the cheeks, narrowing to a rounded jaw ---- */}
        <path
          className="pk-skin"
          d="M200 56 C 262 56, 306 92, 306 140 C 306 184, 276 216, 240 230 C 226 236, 212 238, 200 238 C 188 238, 174 236, 160 230 C 124 216, 94 184, 94 140 C 94 92, 138 56, 200 56 Z"
        />

        {/* the muzzle is a MASS filling the lower face, with the eyes sitting on
            top of it — a mouth line drawn on a flat face is what made the first
            pass read as a bear */}
        <path className="pk-muzzle" d="M200 136 C 238 136, 266 158, 266 187 C 266 215, 236 236, 200 236 C 164 236, 134 215, 134 187 C 134 158, 162 136, 200 136 Z" />

        <ellipse className="pk-nostril" cx="184" cy="168" rx="5" ry="3.8" />
        <ellipse className="pk-nostril" cx="216" cy="168" rx="5" ry="3.8" />
        <path className="pk-mouth" d="M140 192 C 160 220, 240 220, 260 192" />

        {/* eyes: tall ovals, teal iris, sitting over the top of the muzzle */}
        <g className="pk-eyes">
          <ellipse className="pk-sclera" cx="154" cy="138" rx="27" ry="32" />
          <ellipse className="pk-sclera" cx="246" cy="138" rx="27" ry="32" />
          <ellipse className="pk-iris" cx="156" cy="142" rx="19" ry="24" />
          <ellipse className="pk-iris" cx="244" cy="142" rx="19" ry="24" />
          <ellipse className="pk-pupil" cx="156" cy="144" rx="10" ry="14" />
          <ellipse className="pk-pupil" cx="244" cy="144" rx="10" ry="14" />
          <circle className="pk-glint" cx="146" cy="130" r="7" />
          <circle className="pk-glint" cx="238" cy="130" r="7" />
          <circle className="pk-glint pk-glint-sm" cx="162" cy="156" r="3.5" />
          <circle className="pk-glint pk-glint-sm" cx="254" cy="156" r="3.5" />
        </g>
      </g>
    </g>
  );
}

function PokemonDefs() {
  return (
    <svg className="pk-defs" aria-hidden focusable="false">
      <defs>
        {/* the hide is lit from the upper left; flat orange reads as clip-art */}
        <radialGradient id="pk-skinfill" cx="34%" cy="26%" r="88%">
          <stop offset="0%" stopColor="#ffc584" />
          <stop offset="46%" stopColor="#f5a04e" />
          <stop offset="100%" stopColor="#dd8134" />
        </radialGradient>

        {/* the muzzle reads as a separate mass only if it is lit separately */}
        <radialGradient id="pk-muzzlefill" cx="42%" cy="22%" r="86%">
          <stop offset="0%" stopColor="#ffd7a2" />
          <stop offset="54%" stopColor="#f9b168" />
          <stop offset="100%" stopColor="#e59542" />
        </radialGradient>

        <radialGradient id="pk-irisfill" cx="40%" cy="28%" r="82%">
          <stop offset="0%" stopColor="#8ff4e6" />
          <stop offset="52%" stopColor="#35d6c6" />
          <stop offset="100%" stopColor="#12756f" />
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
