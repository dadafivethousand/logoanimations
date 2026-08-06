// Pokemon.js — the Code Ninjas lockup with a POKÉ BALL where the ninja head
// goes. It drops in, the name wells up under it, it wobbles, and it bursts: the
// shells are thrown apart and a tablet comes out carrying a back-to-school
// promotion.
//
// Genre, not franchise. No franchise wordmark, no trainer, no series typeface —
// the read comes from the ball itself and from the beats: drop · wobble · burst
// · release.
//
// THE COMPOSITION IS THE LOGO. Round mark on top, CODE NINJAS under it,
// WOODBRIDGE under that — the artwork's own arrangement, with the ball standing
// in for the head and the name set in the theme's game lettering. So the first
// two beats read as the logo before anything moves.
//
// NO LOGO FILE: like Patriot and Hulk this theme never calls useLogo, so it
// survives the logo file being replaced.
//
// COPY IS A PLACEHOLDER. The promo lines are props and are NOT confirmed offer
// wording — this is public-facing marketing, so the real headline, offer and
// call to action have to come from the user before a take is posted.
//
// GEOMETRY NOTE — every animated SVG group carries a `pk-anchor` rect spanning
// the whole viewBox. `transform-box: fill-box` then resolves to the viewBox
// itself, so a transform-origin percentage means the same thing everywhere:
// x/400, y/400 in scene units. Without it each group's origin drifts with its
// own bounding box and the tablet stops growing out of the ball.
import React from "react";
import "../Stylesheets/Pokemon.css";
import usePhases from "../Utils/usePhases";

// p1 the ball lands and the name arrives · p2 it wobbles · p3 BURST
// p4 the tablet comes out and wakes · p5 the call to action
const CUES = [250, 1500, 2900, 3200, 4300];

/* Sparks thrown off the burst. Computed once so every take composes the same —
   a random scatter re-rolls between takes and the recording never matches. */
const SPARKS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2 - Math.PI / 2;
  const reach = i % 2 === 0 ? 172 : 118;
  return {
    x: +(Math.cos(a) * reach).toFixed(1),
    y: +(Math.sin(a) * reach * 0.9).toFixed(1),
    s: i % 3 === 0 ? 1.25 : 0.85,
    i,
  };
});

/* Embers drifting up through the frame. Hand-placed for the same reason. */
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
  // PLACEHOLDER COPY — confirm with the user before posting a take.
  promoHead = "BACK TO SCHOOL",
  promoSub = "CODING CLASSES",
  promoCta = "ENROLL NOW",
  loopAt = 9200,
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

      {/* ---- the lockup: mark over name, the artwork's own arrangement ---- */}
      <div className="pk-lockup">
        <div className="pk-stagebox">
          {/* burst rays and glow sit at the mark's centre, behind the scene */}
          <div className="pk-rays" aria-hidden />
          <div className="pk-glow" aria-hidden />
          <div className="pk-flash" aria-hidden />

          <svg className="pk-scene" viewBox="0 0 400 400" aria-hidden>
            {/* the ball is drawn BEFORE the tablet: the shells are thrown out
                from behind it, which is what says the tablet came out of them
                rather than landing on top of a graphic */}
            <g className="pk-ball">
              <rect className="pk-anchor" x="0" y="0" width="400" height="400" fill="none" />

              <g className="pk-shell pk-shell-bot">
                <rect className="pk-anchor" x="0" y="0" width="400" height="400" fill="none" />
                <path
                  className="pk-shell-white"
                  d="M142 200 C 142 232, 168 258, 200 258 C 232 258, 258 232, 258 200 Z"
                />
              </g>

              <g className="pk-shell pk-shell-top">
                <rect className="pk-anchor" x="0" y="0" width="400" height="400" fill="none" />
                <path
                  className="pk-shell-red"
                  d="M142 200 C 142 168, 168 142, 200 142 C 232 142, 258 168, 258 200 Z"
                />
                {/* a struck shell catches light in a band, not evenly */}
                <ellipse
                  className="pk-shell-gloss"
                  cx="175"
                  cy="171"
                  rx="24"
                  ry="11"
                  transform="rotate(-34 175 171)"
                />
              </g>

              <g className="pk-btn">
                <circle className="pk-btn-rim" cx="200" cy="200" r="20" />
                <circle className="pk-btn-face" cx="200" cy="200" r="13" />
                <circle className="pk-btn-lamp" cx="200" cy="200" r="7" />
              </g>
            </g>

            <Tablet head={promoHead} sub={promoSub} cta={promoCta} />

            {/* ---- the burst itself ---- */}
            <circle className="pk-shock pk-shock-1" cx="200" cy="200" r="56" />
            <circle className="pk-shock pk-shock-2" cx="200" cy="200" r="56" />

            <g className="pk-sparks">
              {SPARKS.map(({ x, y, s, i }) => (
                <g key={i} transform="translate(200 200)">
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

        {/* the name is a FLOW SIBLING of the mark, never positioned on its own
            — that is what keeps the lockup together instead of drifting */}
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
   THE TABLET — what comes out of the ball.

   Grows from the ball's own centre, then the screen WAKES: it blows out white
   and the copy resolves on it. A tablet that fades up with its content already
   on it reads as a picture of a tablet; the wake is what makes it a device that
   just turned on.

   Every line is pinned with textLength + lengthAdjust so the layout holds
   whatever font the device actually falls back to — no fonts are bundled here.

   Drawn in scene units (400x400), centred on the ball at (200,200).
   ====================================================================== */
function Tablet({ head, sub, cta }) {
  return (
    <g className="pk-tab">
      <rect className="pk-anchor" x="0" y="0" width="400" height="400" fill="none" />

      <g className="pk-tabtilt">
        <rect className="pk-tab-case" x="40" y="80" width="320" height="240" rx="24" />
        {/* a lit top-left edge is what gives the case a thickness */}
        <rect className="pk-tab-rim" x="41.5" y="81.5" width="317" height="237" rx="22.5" />

        <rect className="pk-tab-screen" x="58" y="98" width="284" height="204" rx="12" />
        <circle className="pk-tab-cam" cx="200" cy="89" r="3.4" />

        {/* ---- what is on the screen ---- */}
        <g className="pk-tabcopy">
          <text className="pk-tab-head" x="200" y="152" textAnchor="middle"
                textLength="240" lengthAdjust="spacingAndGlyphs">{head}</text>
          <rect className="pk-tab-rule" x="155" y="166" width="90" height="5" rx="2.5" />
          <text className="pk-tab-sub" x="200" y="206" textAnchor="middle"
                textLength="156" lengthAdjust="spacingAndGlyphs">{sub}</text>
        </g>

        <g className="pk-tabcta">
          <rect className="pk-tab-pill" x="118" y="230" width="164" height="46" rx="23" />
          <text className="pk-tab-ctatext" x="200" y="260" textAnchor="middle"
                textLength="122" lengthAdjust="spacingAndGlyphs">{cta}</text>
        </g>

        {/* one soft sweep across the glass — a screen catches light in a band.
            Clipped to the screen, or its square corners poke out past the
            glass's radius as two bright nicks. */}
        <g clipPath="url(#pk-screenclip)">
          <path className="pk-tab-gloss" d="M58 98 L154 98 L74 302 L58 302 Z" />
        </g>

        {/* the wake: the screen blows out white, then the copy resolves on it */}
        <rect className="pk-tab-wake" x="58" y="98" width="284" height="204" rx="12" />
      </g>
    </g>
  );
}

function PokemonDefs() {
  return (
    <svg className="pk-defs" aria-hidden focusable="false">
      <defs>
        <clipPath id="pk-screenclip">
          <rect x="58" y="98" width="284" height="204" rx="12" />
        </clipPath>

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

        {/* brushed graphite, lit from the upper left */}
        <linearGradient id="pk-casefill" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#5c5a6b" />
          <stop offset="42%" stopColor="#332f3f" />
          <stop offset="100%" stopColor="#191622" />
        </linearGradient>

        {/* the glass is lit, not painted — it is the brightest thing in frame */}
        <linearGradient id="pk-screenfill" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="58%" stopColor="#f6f4fb" />
          <stop offset="100%" stopColor="#e4e0ee" />
        </linearGradient>

        <linearGradient id="pk-typefill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="34%" stopColor="#ffd24a" />
          <stop offset="72%" stopColor="#ffab21" />
          <stop offset="100%" stopColor="#e8760f" />
        </linearGradient>

        {/* the tablet sits in front of the burst, so it casts back onto it */}
        <filter id="pk-drop" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#12071f" floodOpacity="0.62" />
        </filter>
      </defs>
    </svg>
  );
}
