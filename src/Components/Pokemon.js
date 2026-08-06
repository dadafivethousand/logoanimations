// Pokemon.js — a Poké Ball drops in, wobbles, and BURSTS: out of the release
// beam rises the Code Ninjas ninja drawn as a Charmander. Name welded under it.
//
// Genre, not franchise. No franchise wordmark, no trainer, no series typeface —
// the read comes from the beats (drop · wobble · burst · release) and from the
// creature: orange hide, cream belly, blunt snout, tail flame, teal eyes.
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

   Not the mark recoloured. What makes it read as Charmander rather than "an
   orange ninja" is the FAT tapering tail with the flame on it, the blunt snout
   with two nostril dots and a wide smile, the cream belly, and big round teal
   eyes. What keeps it a Code Ninja is the hood over the crown with its cloth
   streaming off to the left, the brand-red headband, and the sash.

   Two things learned the hard way on the first pass:
     · a long dark shape hanging down BOTH sides of the head reads as HAIR, not
       a hood. The cloth streams off one side instead, clear of the silhouette.
     · a cream chin patch under the muzzle reads as a bear. Charmander's face
       is orange all the way to the jaw; only the belly is cream.

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

        {/* ---- the hood ----
             A cowl that WRAPS the head and carries on past the jaw to the
             shoulders. The first pass put two long dark shapes down either
             side of the face and it read as a bob haircut; what fixes it is
             the cloth continuing BELOW the jaw (hair does not) and a lit outer
             edge, so it reads as a wrapped material with a thickness. Drawn
             before the body so the shoulders cover where it tucks in. ---- */}
        <path className="pk-hood pk-cloth" d="M100 148 C 62 156, 26 178, 6 208 C 36 202, 68 202, 96 210 C 92 190, 92 166, 100 150 Z" />
        <path className="pk-hood pk-cloth" d="M96 184 C 64 202, 34 232, 20 262 C 48 246, 78 236, 104 234 C 96 220, 92 200, 96 186 Z" />
        <path className="pk-cloth-hi" d="M100 148 C 68 158, 36 180, 16 206 C 40 186, 70 168, 100 160 Z" />
        <path className="pk-cloth-hi" d="M96 184 C 68 202, 40 232, 26 258 C 48 232, 76 210, 100 198 Z" />

        <path
          className="pk-hood"
          d="M200 26 C 284 26, 332 86, 332 158 C 332 206, 328 250, 322 292 C 286 272, 244 264, 200 264 C 156 264, 114 272, 78 292 C 72 250, 68 206, 68 158 C 68 86, 116 26, 200 26 Z"
        />
        {/* the lit outer edge — without it the cowl is a flat black disc */}
        <path className="pk-hood-rim" d="M68 176 C 68 94, 118 26, 200 26 C 130 42, 86 102, 84 180 Z" />

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

        {/* ---- the sash: brand red on the cream belly. Black gear on a black
                hood is invisible — this is a piece that has to be seen ---- */}
        <g className="pk-sash">
          <path className="pk-sash-band" d="M130 340 C 158 358, 242 358, 270 340 L 276 366 C 242 386, 158 386, 124 366 Z" />
          <path className="pk-sash-hi" d="M134 344 C 160 360, 240 360, 266 344 L 267 351 C 240 367, 160 367, 133 351 Z" />
        </g>

        {/* ---- head: orange to the jaw, no cream muzzle patch ---- */}
        <path className="pk-skin pk-head" d="M200 50 C 268 50, 306 96, 306 152 C 306 210, 268 254, 200 254 C 132 254, 94 210, 94 152 C 94 96, 132 50, 200 50 Z" />
        {/* the snout is a MASS pushed out of the skin, not a line drawn on it */}
        <path className="pk-muzzle pk-snout" d="M200 176 C 228 176, 248 192, 248 212 C 248 234, 228 250, 200 250 C 172 250, 152 234, 152 212 C 152 192, 172 176, 200 176 Z" />

        <ellipse className="pk-nostril" cx="186" cy="198" rx="4.5" ry="3.5" />
        <ellipse className="pk-nostril" cx="214" cy="198" rx="4.5" ry="3.5" />
        <path className="pk-mouth" d="M160 219 C 180 243, 220 243, 240 219" />

        {/* eyes: big and round with a teal iris — the single feature that says
            Charmander before anything else is read */}
        <g className="pk-eyes">
          <ellipse className="pk-sclera" cx="158" cy="172" rx="26" ry="29" />
          <ellipse className="pk-sclera" cx="242" cy="172" rx="26" ry="29" />
          <ellipse className="pk-iris" cx="161" cy="175" rx="17" ry="20" />
          <ellipse className="pk-iris" cx="239" cy="175" rx="17" ry="20" />
          <ellipse className="pk-pupil" cx="161" cy="176" rx="8" ry="11" />
          <ellipse className="pk-pupil" cx="239" cy="176" rx="8" ry="11" />
          <circle className="pk-glint" cx="153" cy="164" r="6" />
          <circle className="pk-glint" cx="231" cy="164" r="6" />
          <circle className="pk-glint pk-glint-sm" cx="167" cy="188" r="3" />
          <circle className="pk-glint pk-glint-sm" cx="245" cy="188" r="3" />
        </g>

        {/* ---- the hood over the crown, sitting proud of the skull ---- */}
        <path
          className="pk-hood"
          d="M88 172 C 80 98, 130 36, 200 36 C 270 36, 320 98, 312 172 C 304 146, 294 130, 280 124 C 252 140, 226 146, 200 144 C 174 146, 148 140, 120 124 C 106 130, 96 146, 88 172 Z"
        />
        <path className="pk-hood-hi" d="M132 62 C 158 44, 242 44, 268 62 C 238 52, 162 52, 132 62 Z" />

        {/* ---- headband + its two tails, tied off to the left ---- */}
        <g className="pk-band">
          <path className="pk-band-red" d="M92 118 C 126 96, 168 114, 200 114 C 232 114, 274 96, 308 118 L 306 152 C 270 128, 232 146, 200 146 C 168 146, 130 128, 94 152 Z" />
          <path className="pk-band-hi" d="M96 120 C 128 102, 168 118, 200 118 C 232 118, 272 102, 304 120 L 303 128 C 271 110, 232 126, 200 126 C 168 126, 129 110, 97 128 Z" />
          <path className="pk-band-red" d="M98 116 C 78 118, 62 130, 64 150 C 80 136, 90 130, 102 126 Z" />
          <path className="pk-band-red" d="M94 134 C 72 148, 60 172, 66 190 C 76 172, 90 156, 100 146 Z" />
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
          <stop offset="0%" stopColor="#ffc27a" />
          <stop offset="44%" stopColor="#f6a44e" />
          <stop offset="100%" stopColor="#c96a24" />
        </radialGradient>

        <radialGradient id="pk-muzzlefill" cx="42%" cy="24%" r="86%">
          <stop offset="0%" stopColor="#ffcf94" />
          <stop offset="52%" stopColor="#f8ac5a" />
          <stop offset="100%" stopColor="#d9812f" />
        </radialGradient>

        <radialGradient id="pk-bellyfill" cx="42%" cy="24%" r="88%">
          <stop offset="0%" stopColor="#fff4e0" />
          <stop offset="58%" stopColor="#ffe6c4" />
          <stop offset="100%" stopColor="#e8c391" />
        </radialGradient>

        {/* the hood is not flat black — it has a lit side */}
        <radialGradient id="pk-hoodfill" cx="34%" cy="22%" r="90%">
          <stop offset="0%" stopColor="#3a2b46" />
          <stop offset="46%" stopColor="#221a2c" />
          <stop offset="100%" stopColor="#100a17" />
        </radialGradient>

        <radialGradient id="pk-irisfill" cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#8ff4e6" />
          <stop offset="52%" stopColor="#35d6c6" />
          <stop offset="100%" stopColor="#12756f" />
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
