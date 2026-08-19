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
      <F1Defs still={isStatic} />

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
          Rebuilt as a surface rather than a picture of one. See STRIPS and the
          note above it: the silhouette is not a shape with a texture inside it,
          it is what the strips leave behind as they ride the wave. */}
      <div className="f1-flagwrap" aria-hidden>
        {/* Its shadow is a static blur behind it, NOT a drop-shadow filter on
            the cloth: that filter would re-render the whole flag every frame
            for fifty-six animated children, and the recorder's frame rate is
            the first thing to pay for it. */}
        <div className="f1-flagshadow" aria-hidden />
        <svg
          className="f1-flag"
          viewBox="0 0 390 180"
          preserveAspectRatio="xMidYMid slice"
        >
          <g className="f1-cloth">
            {STRIPS.map((st, i) => (
              <g
                className="f1-strip"
                key={i}
                style={{
                  // amplitude at this point along the flag, and the phase the
                  // strip sits at — one number drives its position, its shear
                  // and its shading, which is the whole point
                  "--a": st.a,
                  animationDelay: `${st.delay}ms`,
                  // the frozen pose, for static and reduced motion
                  "--sy": `${st.sy}px`,
                  "--sk": `${st.sk}deg`,
                  "--sc": st.sc,
                }}
              >
                {/* THE OVERLAP IS WHAT KILLS THE CORDUROY, and a hairline of it
                    is not enough. Each strip is antialiased against its
                    neighbours, and a 0.15-unit overlap left the partially
                    covered edge pixel still partially covered — 120 grey lines
                    down a white square, 120 pale ones down a black. The overlap
                    has to be wider than the antialiased edge itself so the seam
                    is buried under the next strip's opaque body.

                    It cannot go much past this: the strips are displaced
                    relative to each other, so whatever one strip overdraws into
                    the next column peeks out at the silhouette as a ledge, and
                    the ledge grows with the overlap. 0.8 units is ~2px of cover
                    against ~0.3px of ledge. */}
                <rect
                  className="f1-strip-check"
                  x={st.x}
                  y={FLAG_TOP}
                  width={STRIP_W + 0.8}
                  height={FLAG_H}
                />
                {/* The light. Its fill is ONE pattern anchored in user space, so
                    every strip samples the same continuous field and the value
                    varies smoothly ACROSS a strip instead of being flat within
                    it. That is the whole fix: flat-shading each strip stepped
                    the brightness ~3% at every column boundary, and 120 of
                    those steps read as corduroy woven into the flag. */}
                <rect
                  className="f1-strip-light"
                  x={st.x}
                  y={FLAG_TOP}
                  width={STRIP_W + 0.8}
                  height={FLAG_H}
                />              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="f1-grain" aria-hidden />
      <div className="f1-vignette" aria-hidden />
    </div>
  );
}

// ── The cloth ────────────────────────────────────────────────────────────────
//
// The first version of this flag was a fixed wavy PATH filled with the chequer,
// with bands of shadow sliding across it. It read as printed cloth, and the
// reason is worth keeping: the geometry and the lighting disagreed. The shape
// said the cloth was one thing and the travelling shadows said it was doing
// something else, so the eye resolved it as a pattern with a shadow on top.
//
// So the flag is now a SURFACE. Fifty-six vertical strips, each one a slice of
// the same chequer, and each strip's position, shear and shading all come from
// ONE number — its phase along a travelling wave:
//
//   vertical position   ∝ sin(phase)      where the cloth is
//   shear               ∝ -cos(phase)     the slope it is on, which is the
//                                         derivative — this is what turns a
//                                         56-step staircase into a continuous
//                                         surface, and without it the check
//                                         boundaries visibly stair
//   brightness          ∝ cos(phase)      the surface normal tilts with the
//                                         slope, so the lit face is a quarter
//                                         cycle off the displacement
//
// Being a quarter cycle apart is not a look, it is the physics, and it is the
// single thing that makes this read as cloth rather than as a texture.
//
// There is no silhouette path any more. The flag's wavy top and bottom edges
// are simply where the strips ended up, which is why the edges now agree with
// the folds instead of merely resembling them.

// 120, not 56. Each strip is flat-shaded, so the strip count IS the resolution
// of the lighting: at 56 the shading stepped visibly from column to column and
// the cloth came out corrugated, like a folded fan rather than a flag. At 120
// there are ~9 strips per check square and the steps disappear.
const STRIP_N = 120;
// The cloth occupies well under the full viewBox height, and that is the
// framing fix, not a detail: at 126 of 210 the flag filled its box edge to edge
// and read as a chequered WALL — there was no sky above the crest or floor
// below the trough for the wave to be a wave against. The viewBox is 390x180 to
// match the wrapper's own aspect, so nothing is cropped by the slice either.
const FLAG_TOP = 42;
const FLAG_H = 96;
const STRIP_W = 390 / STRIP_N;
const LAMBDA = 390 / 1.35;   // one wavelength, in viewBox units

// How many crests are on the flag at once, how far the cloth travels, and how
// hard it shears. WAVES below ~1.5 reads as a slow banner; above ~2.2 it reads
// as a ripple in water.
// Lazier and shallower than the first pass, which read as corrugated iron.
const WAVES = 1.35;
const AMP = 17;
const SKEW = 8;
const WAVE_MS = 2600;

// Amplitude jitter, so the crest line is not a machined sine. It must be SMOOTH
// across neighbours, not per-strip random: white noise here gave adjacent
// strips amplitudes 6% apart, and since the silhouette is just where the strips
// ended up, that came out as a sawtooth along the top and bottom edges. Two
// slow sines vary over tens of strips instead, which is how cloth actually
// varies — and being deterministic, it does not reshuffle on re-render.
function jitter(i) {
  return 1 + 0.055 * Math.sin(i * 0.11) + 0.03 * Math.sin(i * 0.27 + 1.7);
}

const STRIPS = Array.from({ length: STRIP_N }, (_, i) => {
  const t = STRIP_N === 1 ? 0 : i / (STRIP_N - 1);
  // A flag is stiff where it is held and loose where it is not. The exponent is
  // what keeps the hoist edge quiet — a banner rippling evenly along its whole
  // length reads as a ribbon.
  const a = (0.1 + 0.9 * Math.pow(t, 1.5)) * jitter(i);
  const phase = t * WAVES * Math.PI * 2;
  const cos = Math.cos(phase);
  return {
    x: i * STRIP_W,
    a: a.toFixed(4),
    // negative delay: the wave is already running at t=0, so the flag arrives
    // mid-wave instead of starting flat and building
    delay: -Math.round((phase / (Math.PI * 2)) * WAVE_MS),
    // the frozen pose for static / reduced motion, from the same three curves
    sy: (a * AMP * Math.sin(phase)).toFixed(2),
    sk: (a * SKEW * cos).toFixed(2),
    // cloth stretches over a crest and gathers in a trough
    sc: (1 + 0.045 * cos).toFixed(3),
  };
});

function F1Defs({ still }) {
  return (
    <svg className="f1-defs" aria-hidden focusable="false">
      <defs>
        {/* The check. 26 units is about eight squares across the flag — few
            enough to still read as a chequered flag at thumbnail size, where a
            fine check turns into grey. Anchored in user space, so every strip
            draws its slice of ONE pattern and the squares line up across all
            fifty-six of them. */}
        <pattern
          id="f1-check"
          width="52"
          height="52"
          patternUnits="userSpaceOnUse"
        >
          {/* The black is lifted to #191a1e and the white pulled off paper
              white, because the fold shading is now a brightness() on the whole
              strip and brightness has nothing to work with at either end of the
              range: #0b0b0d at 1.4x is still #0f0f11, so pure-black squares
              would sit flat and unlit while the white ones folded around
              them. */}
          <rect width="52" height="52" fill="#eceef1" />
          <rect width="26" height="26" fill="#191a1e" />
          <rect x="26" y="26" width="26" height="26" fill="#191a1e" />
        </pattern>

        {/* THE LIGHT, as one travelling field.

            Wavelength is the flag's own — 390/WAVES — and it translates exactly
            one wavelength per wave period, which is what keeps the lit face
            locked to the crest. Derivation, so the numbers are not folklore:
            the strips displace by sin(φ(x) + ωt), the light must be
            cos(φ(x) + ωt), and a pattern sampled at (x − dx) gives that when
            dx = −λ·t/T.

            patternTransform is animated with SMIL rather than CSS because CSS
            cannot reach it — which also means `animation: none` does NOT stop
            it, so the static pose renders no <animateTransform> at all and
            carries a fixed offset instead. */}
        <pattern
          id="f1-light"
          patternUnits="userSpaceOnUse"
          x="0"
          y={FLAG_TOP}
          width={LAMBDA}
          height={FLAG_H}
          patternTransform={still ? `translate(${-LAMBDA * 0.34} 0)` : undefined}
        >
          <rect width={LAMBDA} height={FLAG_H} fill="url(#f1-lightband)" />
          {/* The hem tint rides in the same pattern rather than as a rect of
              its own over the cloth. The rect version used mix-blend-mode:
              multiply, and multiply against a TRANSPARENT backdrop falls back
              to source-over — so above and below the flag, where there is no
              cloth to multiply with, it painted its gradient as opaque white
              and laid a white band across the frame. Inside the pattern it is
              clipped to the strips for free, and a horizontal translation
              cannot disturb a vertical gradient. */}
          <rect width={LAMBDA} height={FLAG_H} fill="url(#f1-bounce)" />
          {!still && (
            <animateTransform
              attributeName="patternTransform"
              type="translate"
              from="0 0"
              to={`${-LAMBDA} 0`}
              dur="2.6s"
              repeatCount="indefinite"
            />
          )}
        </pattern>

        {/* One period of it. The explicit zero-alpha stops at 20% and 80% are
            the crossover: without them the gradient interpolates from a white
            stop straight to a black one and drags a grey wash through the
            middle of every crest. */}
        <linearGradient id="f1-lightband" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.30" />
          <stop offset="12.5%" stopColor="#fff" stopOpacity="0.21" />
          <stop offset="20%" stopColor="#fff" stopOpacity="0" />
          <stop offset="25%" stopColor="#000" stopOpacity="0.04" />
          <stop offset="37.5%" stopColor="#000" stopOpacity="0.33" />
          <stop offset="50%" stopColor="#000" stopOpacity="0.46" />
          <stop offset="62.5%" stopColor="#000" stopOpacity="0.33" />
          <stop offset="75%" stopColor="#000" stopOpacity="0.04" />
          <stop offset="80%" stopColor="#000" stopOpacity="0" />
          <stop offset="87.5%" stopColor="#fff" stopOpacity="0.21" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.30" />
        </linearGradient>

        {/* Red bounce off the tarmac, strongest at the hem. Multiplied, because
            this is light the white squares are REFLECTING, not light being
            added on top of them. */}
        <linearGradient id="f1-bounce" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9d90" stopOpacity="0" />
          <stop offset="70%" stopColor="#ff9d90" stopOpacity="0" />
          <stop offset="100%" stopColor="#ff9d90" stopOpacity="0.17" />
        </linearGradient>
      </defs>
    </svg>
  );
}
