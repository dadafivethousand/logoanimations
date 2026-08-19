// Formula1.jsx — the lights, and then the flag.
//
// A race has exactly two images everybody knows without being told what they
// are: five red lights in a row, and a chequered flag. This theme is those two
// things and the four seconds between them — the lights come on one at a time,
// they go out, the mark arrives at speed, and the chequer takes the frame.
//
// ── The mark is NOT repainted ──
//
// The obvious version of this theme wraps the lockup in a race livery, and the
// repo has been here before: Pirates spent several passes rendering the mark in
// gold and the user's question was simply "why are you using golden?". A livery
// would overwrite the brand's own blue CODE and its black hood with somebody
// else's colours, so the environment carries the theme instead. What the mark
// gets is LIGHT, not paint — a wet gloss and a specular pass, as if the same
// lockup were sitting under the pit lane at night. Its hood is already carbon
// black; the weave underneath it is the only liberty taken, and it is a
// material on black, not a recolour.
//
// ── One red ──
//
// Formula 1's red is #e10600 and the Code Ninjas brand red is #e4002b. They are
// three degrees apart on the wheel and they do not sit together — one reads as
// a printing error beside the other. The frame commits to the F1 red, because
// that red is what the user asked for and it is the one doing the theme's work:
// the lamps, the kerb, the rule under the name. There is no second red in the
// file.
//
// ── Why the flag is last ──
//
// A chequered flag is the END of a race. Waving it over the launch would be a
// nice piece of motion and complete nonsense, so it arrives after the mark has
// landed and the name has set — the finish, not the decoration.
import React from "react";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";
import "../Stylesheets/Formula1.css";

// p0 track   p1 lights come on   p2 lights out   p3 the launch
// p4 the name   p5 the flag   p6 hold
//
// The gap between p1 and p2 is doing something specific: the five lamps stagger
// themselves in CSS at 280ms apart, so the last one lands ~1.4s into p1 and
// there is a beat of all-five-lit before they go out. That beat is the whole
// tension of an F1 start and it is the one pause in the film that must not be
// tightened.
const CUES = [240, 1960, 2280, 3560, 4460, 5600];

// Five lamps. The gantry carries ten in two rows on a real grid, but at phone
// size a second row reads as texture rather than as lights, and the count is
// what people know.
const LAMPS = [0, 1, 2, 3, 4];

// Streaks that rip past on the launch. [top %, left %, length vw, thickness px,
// delay ms, opacity] — hand-placed rather than random so none of them run
// through the mark's own box, where they would read as scratches on it.
//
// The opacity goes out as --o for the keyframes to pick up, NOT as an inline
// `opacity`: inline beats the stylesheet, so setting it directly left all eight
// lying across the frame throughout the light sequence.
const STREAKS = [
  [12, -30, 62, 2, 0, 0.55],
  [19, -55, 48, 1, 90, 0.35],
  [27, -20, 74, 3, 40, 0.7],
  [34, -70, 40, 1, 150, 0.3],
  [68, -35, 66, 2, 60, 0.6],
  [76, -60, 52, 1, 190, 0.35],
  [83, -25, 78, 3, 20, 0.65],
  [90, -50, 44, 1, 130, 0.3],
];

export default function Formula1({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = null,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  // Hold frame zero until the mark has been measured and segmented, or the
  // first painted frame masks against the wrong box and the regions land off
  // register.
  if (!ready) return <div className="f1 f1-p0" aria-hidden />;

  return (
    <div
      className={`f1 f1-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      <F1Defs />

      {/* ---- one space: night asphalt, lit from above by the gantry ---- */}
      <div className="f1-asphalt" aria-hidden />
      <div className="f1-key" aria-hidden />
      {/* The kerb. Red and white on the diagonal is as much a Formula 1 signal
          as the flag is, and it costs one element. Low and dim on purpose —
          it is the ground the composition stands on, not a stripe across it. */}
      <div className="f1-kerb" aria-hidden />
      <div className="f1-haze" aria-hidden />

      {/* ---- the start lights ----
          They occupy the centre of the frame while the mark is not in it yet,
          and they are gone by the time it is. Same real estate, no collision:
          the film hands the middle of the frame from one to the other, which
          is what makes the launch land. */}
      <div className="f1-lights" aria-hidden>
        <div className="f1-gantry">
          {LAMPS.map((i) => (
            <span className="f1-lamp" key={i} style={{ "--i": i }}>
              <i className="f1-lens" />
            </span>
          ))}
        </div>
      </div>

      {/* ---- the launch ---- */}
      <div className="f1-streaks" aria-hidden>
        {STREAKS.map(([t, l, w, h, d, o], i) => (
          <span
            key={i}
            className="f1-streak"
            style={{
              top: `${t}%`,
              left: `${l}%`,
              width: `${w}vw`,
              height: `${h}px`,
              "--o": o,
              animationDelay: `${d}ms`,
            }}
          />
        ))}
      </div>

      {/* ---- the lockup ---- */}
      <div className="f1-markwrap">
        {/* The arrival. Scale and a resolving blur rather than a slide: the
            mark is coming AT the camera down a straight, and something that
            slides in from the side is a graphic being moved. */}
        <div className="f1-launch">
          <div className="f1-markbox">
            <div className="f1-glow" aria-hidden />

            {/* The bevel chain lives on this wrapper, not on the painted
                layers — drop-shadow takes its shape from alpha, and an
                invisible source casts an invisible shadow. */}
            <div className="f1-mark">
              {/* the hood and NINJAS: carbon weave under a wet clear coat */}
              <div className="f1-layer f1-carbon" aria-hidden />
              {/* the eye band: the artwork's own tone, lifted by the key */}
              <div className="f1-layer f1-face" aria-hidden />
              {/* CODE: the brand's blue, glossed rather than replaced */}
              <div className="f1-layer f1-code" aria-hidden />
              {/* one specular pass across the whole mark. NOT a transform —
                  the mask would travel with it and the highlight would leave
                  the letterforms; an oversized background scrolls behind a
                  fixed mask instead. */}
              <div className="f1-layer f1-spec" aria-hidden />
            </div>
          </div>

          {/* welded under the mark, in flow — never positioned independently */}
          <div className="f1-type">
            <div className="f1-caption">{caption}</div>
            <div className="f1-rule" aria-hidden />
          </div>
        </div>
      </div>

      {/* ---- the flag ----
          Cloth, not a grid: the chequer is displaced by turbulence so its
          squares bend, and a band of folds travels across it. A flat
          black-and-white check at this size is a tablecloth. */}
      <div className="f1-flagwrap" aria-hidden>
        <svg className="f1-flag" viewBox="0 0 390 210" preserveAspectRatio="xMidYMid slice">
          {/* placement on the outer g, animation on the inner one: a CSS
              transform REPLACES an SVG transform attribute outright */}
          <g transform="translate(0 6)">
            <g className="f1-cloth">
              {/* ONE filter over the lot, so the folds bend with the squares
                  they are shading. Warping the check and the shadows
                  separately gives two cloths in the same place. */}
              <g filter="url(#f1-ripple)">
                <path className="f1-chequer" d={FLAG_D} />
                {/* The travelling shadow is a WIDE RECT CLIPPED TO THE FLAG,
                    not a gradient on the flag path: a gradient is anchored to
                    its shape's bounding box, so moving the shape moves the
                    shading with it and nothing appears to travel. Sliding an
                    over-wide tiled rect underneath a fixed clip is what makes
                    the folds run along the cloth. */}
                <g clipPath="url(#f1-clip)">
                  <rect className="f1-folds" x="-280" y="-30" width="960" height="280" />
                  <rect className="f1-sheen" x="-280" y="-30" width="960" height="280" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>

      <div className="f1-grain" aria-hidden />
      <div className="f1-vignette" aria-hidden />
    </div>
  );
}

// The cloth. A rectangle with both long edges cut as waves and the hoist edge
// (left) straight, because that is the edge that is held. The wave amplitude
// grows toward the fly end — a flag is stiff where it is gripped and loose
// where it is not, and a banner rippling evenly along its whole length reads as
// a ribbon.
const FLAG_D = [
  "M -10 18",
  "C 60 4, 130 34, 200 20",
  "C 268 6, 330 44, 400 22",
  "L 400 176",
  "C 330 198, 268 160, 200 174",
  "C 130 188, 60 158, -10 172",
  "Z",
].join(" ");

function F1Defs() {
  return (
    <svg className="f1-defs" aria-hidden focusable="false">
      <defs>
        {/* The check itself. 26 units at this viewBox is about eight squares
            across the flag — few enough to read as a chequered flag at
            thumbnail size, where a fine check turns into grey. */}
        <pattern
          id="f1-check"
          width="52"
          height="52"
          patternUnits="userSpaceOnUse"
        >
          <rect width="52" height="52" fill="#f2f3f5" />
          <rect width="26" height="26" fill="#0b0b0d" />
          <rect x="26" y="26" width="26" height="26" fill="#0b0b0d" />
        </pattern>

        {/* Folds: soft dark bands, travelling. This is the single strongest
            "it is waving" cue in the file — more than the geometry, more than
            the ripple filter. Both band gradients run to ZERO at 0% and 100%
            so the tile is seamless and no seam walks across the flag. */}
        <linearGradient
          id="f1-fold"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="130"
          y2="0"
        >
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="16%" stopColor="#000" stopOpacity="0.46" />
          <stop offset="34%" stopColor="#000" stopOpacity="0" />
          <stop offset="58%" stopColor="#000" stopOpacity="0.5" />
          <stop offset="82%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>

        <linearGradient
          id="f1-sheenband"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="130"
          y2="0"
        >
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="26%" stopColor="#fff" stopOpacity="0.26" />
          <stop offset="44%" stopColor="#fff" stopOpacity="0" />
          <stop offset="70%" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="92%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        {/* One period of each band, tiled. 130 units is about two and a half
            squares — folds that land every square read as a printing moire. */}
        <pattern id="f1-foldband" width="130" height="280" patternUnits="userSpaceOnUse">
          <rect width="130" height="280" fill="url(#f1-fold)" />
        </pattern>
        <pattern id="f1-sheenpat" width="130" height="280" patternUnits="userSpaceOnUse">
          <rect width="130" height="280" fill="url(#f1-sheenband)" />
        </pattern>

        <clipPath id="f1-clip">
          <path d={FLAG_D} />
        </clipPath>

        {/* Cloth irregularity. Low frequency and a big scale: this is a bedsheet
            in wind, not sandpaper. */}
        <filter id="f1-ripple" x="-15%" y="-30%" width="130%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.02"
            numOctaves="2"
            seed="7"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
