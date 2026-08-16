// Wolverine.js — adamantium claws rake across a dark forge-lit space and the
// slash is what brings the mark up. Three passes: one cut, one crossing it,
// then a flurry that shreds the whole frame. What stays on the held frame is
// the pair of signatures anybody reads at thumbnail size: a torn-up ground,
// and the winged mask on the head of the mark.
//
// Genre, not franchise. No studio mark, no chest emblem, no team logo — the
// registered devices are exactly the ones left out. What carries the theme is
// the vocabulary: three blades, the tan-and-hide colour story, and the winged
// cowl. Same rule Batman, Spiderman and Samurai follow.
//
// THE SLASH IS THE EVENT. Batman's beam sweeps onto a mark already standing in
// the dark; here the claws unsheathe, rake, and leave — and the mark lights as
// they pass. Nothing else flies in on that beat, so the frame has one thing
// happening at a time.
//
// THE MASK REPLACES THE HEAD, and only the head. This started as Pirates'
// problem — headgear worn over the ninja's own skull — and a tan shape sitting
// on a black hood reads as a ninja in a Wolverine hat. It is the mask now: it
// covers the skull, and the eyes are ITS openings rather than the artwork's
// slits showing through a gap in it. Still positioned off the artwork's own
// pixels, so it cannot drift.
//
// "CODE NINJAS" is untouched — the artwork's three regions in adamantium and
// brand blue. That is the line: the head is dressed, the wordmark is ours, and
// nothing here is a drawing of somebody else's character.
//
// MEASURED OFF THE ARTWORK, scanned on the trimmed mark (1916x882, aspect
// 2.1723). The head is a CIRCLE and the numbers are exact:
//
//     head circle   cx 50.00%  cy 27.38%  r 12.60% of the mark's WIDTH
//                   -> the circle is inscribed in a square that spans
//                      x 37.4-62.6%, y 0-54.76% of the mark box
//     eye band      x 39.41-60.54%   y 22.11-32.88%
//     eye slits     x 42.9-46.1% and 53.8-57.0%
//     empty band    y 54.88-61.62%   (nothing between head and wordmark)
//     wordmark      y 61.8-89.8%,  "CODE" x 0-43.2%
//
// Note for whoever reads Batman next: its --face-x of 47.3% is the centre of
// the head's BOUNDING BOX, which is dragged left by the hood's tail. The head
// itself is centred on 50%. Nothing is being changed there from here.
//
// THE HOOD AND "NINJAS" ARE ONE REGION and need two materials — the hood is
// dark hide under the cowl, "NINJAS" is polished adamantium. useLogo can't
// separate them, so the --logo-dark plate is rendered twice into complementary
// clips split at 58%, which is inside the artwork's own empty band.
//
// WOODBRIDGE sits in flow under the mark, inside the same wrapper, so it can
// never drift off the lockup.
import React from "react";
import "../Stylesheets/Wolverine.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

import maskPng from "../Images/wolverine-mask.png";

// p1 the space comes up: hide-brown dark, one warm key low and left, haze
// p2 SNIKT — three blades unsheathe at the lower left and hold, glinting
// p3 the rake: they cross the frame and exit, three gashes tear open behind
//    them, sparks come off the cut, and the mark lights as the slash passes
// p4 THE SECOND RAKE, the other way: three more tear open across the first
//    three, their own sparks come off them, and the first three cool to ember
//    underneath while these are still white-hot
// p5 the metal settles — adamantium specular travels the wordmark, the second
//    cut cools, WOODBRIDGE
//
// p6 THE FLURRY — five more passes at wild angles, fifteen more tears, all
//    over the frame and behind the mark
//
// The ending used to be a cool-down. It escalates instead: one deliberate cut,
// a second crossing it, and then a mauling that gives up on placement
// altogether. The first two bundles are parallel, evenly spaced and routed
// clear of the lockup; the flurry is none of those things on purpose, because
// the point of the last beat is that it stops being a technique.
//
// Plays ONCE and holds — loopAt is null. The embers, the gash flicker and the
// specular travel keep the held frame alive; that is ambient, not a restart.
const CUES = [160, 1480, 2420, 3160, 3820, 4460];

// Slow motes lifting through the key light — the one thing keeping the held
// frame from reading as a still. [left%, top%, size in vw, opacity, duration
// in ms, delay in ms]
const EMBERS = [
  [12, 78, 0.5, 0.5, 9000, 0],
  [21, 88, 0.35, 0.34, 11000, 900],
  [29, 66, 0.45, 0.42, 10000, 2100],
  [38, 92, 0.3, 0.28, 12500, 400],
  [46, 72, 0.55, 0.5, 8600, 3000],
  [57, 86, 0.35, 0.32, 11800, 1500],
  [66, 70, 0.45, 0.44, 9600, 2600],
  [74, 90, 0.3, 0.26, 12000, 700],
  [83, 76, 0.5, 0.4, 10400, 3400],
  [91, 84, 0.35, 0.3, 11200, 1900],
];

/* THE ORIGINAL BUNDLE, restored. Three tears on one axis at -33deg, laid in
 * the lower third, and the blades pointing along that axis so the tips lead
 * the travel.
 *
 * THE BUNDLE GOES BESIDE THE LOCKUP, NOT THROUGH IT, and that is arithmetic
 * rather than taste, because claw marks have to stay PARALLEL AND EVENLY
 * SPACED or they stop reading as claw marks. In the 390x844 viewBox the block
 * centres on (196, 422) and measures about 220 x 160; the cut's perpendicular
 * is n = (0.545, 0.839). Projected onto n from the block's centre, the mask
 * runs -92..+45, "CODE NINJAS" -53..+100, and WOODBRIDGE with its rule
 * -1..+119. That union has no gap in it, so no evenly-spaced trio can straddle
 * the mark without crossing something. The bundle therefore sits at +160,
 * +220 and +280 — 41 units clear of the rule at the near edge, and inside the
 * warm key, which is where the ember glow wants to be.
 *
 * Each entry is the left-hand END of its tear. [x, y, opening delay in ms] */
const PASSES = [
  {
    deg: -33,
    at: "translate(81 759) rotate(57)",
    tx: 142, ty: -92,
    tears: [[-11, 747], [22, 797], [55, 848]],
  },
  /* A second one across the bottom, the other way — the first mirrored about
   * x = 195. Every number below is that mirror and nothing else: origins at
   * 390 - x, travel at -tx, and rotate(-57) because a blade axis of
   * (sin R, -cos R) hits (-0.839, -0.545) at R = -57.
   *
   * Its tears are listed bottom-first. The bundle's local +x is -n here rather
   * than +n, so the offsets run the other way down the knuckles, and pairing
   * blade -60 with the far tear keeps each blade on the cut it makes — the
   * outer two are 1.22 and 1.26 long, so getting them the wrong way round puts
   * both slightly off their lines.
   *
   * It passes UNDER the lockup, which sits x 86-306, y 342-502: across that
   * span the highest of the three runs y 542 to 685. */
  {
    deg: 213,
    at: "translate(309 759) rotate(-57)",
    tx: -142, ty: -92,
    tears: [[335, 848], [368, 797], [401, 747]],
  },
];

/* the tear path is drawn at its full length here — this is the original */
const TEAR_SCALE = 1;

// Sparks off the cut, strung along the middle tear's line — which runs from
// (0, 819) to (390, 566), so y falls 0.3% of the frame for every 1% of x.
// Fixed rather than random so every take is identical.
// [left%, top%, dx in vw, dy in vw, delay in ms]
const SPARKS = [
  [14, 92.8, -5.5, 4.2, 0],
  [20, 91.0, 3.4, 5.6, 30],
  [26, 89.2, -4.2, 5.2, 60],
  [33, 87.1, 4.8, 4.4, 80],
  [39, 85.3, -3.6, 6.1, 110],
  [45, 83.5, 5.4, 3.6, 130],
  [52, 81.4, -5.1, 4.8, 160],
  [58, 79.6, 3.2, 6.4, 190],
  [64, 77.8, -4.6, 3.9, 210],
  [71, 75.7, 5.8, 5.1, 240],
  [77, 73.9, -3.1, 5.7, 260],
  [83, 72.1, 4.4, 4.1, 290],
  [89, 70.3, -5.6, 5.4, 310],
];



export default function Wolverine({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = null,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  // hold frame zero until the mark is measured, or the lockup paints at the
  // wrong aspect for a frame and the cowl lands off the head
  if (!ready) return <div className="wv wv-p0" aria-hidden />;

  return (
    <div
      className={`wv wv-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      <WolverineDefs />

      {/* ---- one space, not a diorama: a dark volume with a single warm key
              low and to the left, and haze for it to sit in ---- */}
      <div className="wv-ground" aria-hidden />
      <div className="wv-key" aria-hidden />
      <div className="wv-haze wv-haze-a" aria-hidden />
      <div className="wv-haze wv-haze-b" aria-hidden />
      {/* something for the claws to tear: a surface, at a shallower angle than
          the cut so the two don't read as one hatch */}
      <div className="wv-scored" aria-hidden />

      {/* ---- the gashes ----
           Torn rather than drawn: feTurbulence displaces the edges, because a
           clean lens reads as a highlighter stroke. Each one opens from its
           left end as the blades pass over it. */}
      {/* the cuts. Each one is drawn from where its blade's tip started and
          runs 640 forward at the pass's own angle, so it lies exactly under
          the path that blade takes. */}
      {PASSES.map((p, pi) => (
        <div className={`wv-gashes wv-cut-${pi}`} key={pi} aria-hidden>
          <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
            {p.tears.map(([x, y], i) => (
              // the placement lives on the OUTER g: a CSS transform on an
              // element carrying a transform attribute replaces it outright
              <g
                key={i}
                transform={`translate(${x} ${y}) rotate(${p.deg}) scale(${TEAR_SCALE} 1)`}
              >
                <g className="wv-gash" style={{ "--d": `${i * 55}ms` }}>
                  <path className="wv-gash-glow" d={GASH_D} />
                  <path className="wv-gash-void" d={GASH_D} filter="url(#wv-tear)" />
                  {/* the hot core is the same tear squeezed down its own
                      middle, so the light sits INSIDE the cut */}
                  <path className="wv-gash-hot" d={GASH_D} filter="url(#wv-tear)" />
                  <path className="wv-gash-lip" d={GASH_D} filter="url(#wv-tear)" />
                </g>
              </g>
            ))}
          </svg>
        </div>
      ))}

      {/* motes lifting through the key — the one thing keeping the held frame
          from reading as a still */}
      <div className="wv-motes" aria-hidden>
        {EMBERS.map(([l, t, sz, o, dur, d], i) => (
          <span
            key={i}
            className="wv-ember"
            style={{
              left: `${l}%`,
              top: `${t}%`,
              width: `${sz}vw`,
              height: `${sz}vw`,
              opacity: o,
              animationDuration: `${dur}ms`,
              animationDelay: `${d}ms`,
            }}
          />
        ))}
      </div>

      <Sparks cls="wv-sparks-a" sparks={SPARKS} />

      {/* ---- the mark, lit by the cut ---- */}
      <div className="wv-markwrap">
        <div className="wv-lift">
          <div className="wv-markbox">
            {/* the ground behind the lockup is dark and so is the hide; this
                is the only thing giving the mark an edge on its shadow side */}
            <div className="wv-halo" aria-hidden />

            <div className="wv-mark">
              <div className="wv-layer wv-cast" aria-hidden />

              {/* --- below the artwork's empty band: the wordmark --- */}
              <div className="wv-word">
                <div className="wv-wordbox">
                  <div className="wv-plate wv-plate-ada" aria-hidden />
                  <div className="wv-plate wv-plate-grain" aria-hidden />
                  <div className="wv-plate wv-plate-spec" aria-hidden />
                  <div className="wv-plate wv-plate-code" aria-hidden />
                  <div className="wv-layer wv-key-word" aria-hidden />
                </div>
              </div>

              {/* --- above it: the mask, which IS the head now ---
                  The artwork's own hood and eye band are not rendered at all.
                  They used to sit under a drawn cowl; with a supplied mask on
                  top of them they would only ever peek out around its
                  silhouette, and the silhouette is not a circle. */}
              <img className="wv-mask" src={maskPng} alt="" aria-hidden />
            </div>
          </div>

          {/* directly under the mark, in flow */}
          <div className="wv-type">
            <div className="wv-caption">{caption}</div>
            <div className="wv-rule" aria-hidden />
          </div>
        </div>
      </div>

      {/* the hand, once per pass */}
      {PASSES.map((p, pi) => (
        <Claws
          key={pi}
          cls={`wv-hand wv-hand-${pi}`}
          at={p.at}
          style={{ "--tx": `${p.tx}vw`, "--ty": `${p.ty}vw` }}
        />
      ))}

      <div className="wv-grain" aria-hidden />
      <div className="wv-vignette" aria-hidden />
    </div>
  );
}

/* One bundle of three tears. The placement lives on the OUTER g: a CSS
   transform on an element carrying a transform attribute replaces it outright,
   so animating this same node would throw the tear back to the origin. */
function Gashes({ cls, gashes, deg }) {
  return (
    <div className={`wv-gashes ${cls}`} aria-hidden>
      <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
        {gashes.map(([x, y, d], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${deg})`}>
            <g className="wv-gash" style={{ "--d": `${d}ms` }}>
              <path className="wv-gash-glow" d={GASH_D} />
              <path className="wv-gash-void" d={GASH_D} filter="url(#wv-tear)" />
              {/* the hot core is the same tear squeezed down its own middle,
                  so the light sits INSIDE the cut instead of filling it */}
              <path className="wv-gash-hot" d={GASH_D} filter="url(#wv-tear)" />
              <path className="wv-gash-lip" d={GASH_D} filter="url(#wv-tear)" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Sparks({ cls, sparks }) {
  return (
    <div className={`wv-sparks ${cls}`} aria-hidden>
      {sparks.map(([l, t, dx, dy, d], i) => (
        <span
          key={i}
          className="wv-spark"
          style={{ left: `${l}%`, top: `${t}%`, "--dx": `${dx}vw`, "--dy": `${dy}vw`, "--d": `${d}ms` }}
        />
      ))}
    </div>
  );
}

/* ---- the blades ----
     Three of them, no hand: a fist drawn at this size is four knuckles of mud,
     and the blades are the whole read anyway.

     Both bundles use the SAME offsets, which is not luck. The solve depends
     only on the angle between the blade axis and the cut, and on the blade
     lengths — and the second bundle crosses its cut at the same 48deg with the
     same three lengths, so it comes out at the same -89 / 0 / +72. Change the
     crossing angle on one and its offsets stop matching the other's. */
function Claws({ cls, at, style }) {
  return (
    <div className={`wv-claws ${cls}`} style={style} aria-hidden>
      <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
          {/* rotate(9), not 57. At 57 the blade axis lay exactly ALONG the cut
              — each blade sat on top of the very tear it was supposed to be
              opening, and three blades travelling point-first down their own
              grooves is a thrust with three spears, not a rake. Nobody draws a
              slash that way, because the mark is invisible behind the thing
              that made it.

              At 9 the blades stand nearly upright and cross the cut at 48deg,
              which is the image everybody recognises. The travel is unchanged
              — still the -33deg axis — so the tips still drag along their own
              tears; they just no longer hide them.

              The knuckle is at (157, 898), below the 844 frame, so the hand is
              off the bottom edge and the blades rise into shot. The middle
              blade's tip lands at (190.3, 687.8), which is 200.7 units along
              the middle tear from its origin and 0.1 units off its centre
              line. The second bundle is the same construction on the +26deg
              cut: rotate(68), knuckle at (-84, 741), which is off the left
              edge. */}
          <g transform={at}>
            {CLAWS.map(([dx, rot, len], i) => (
              <g key={i} transform={`translate(${dx} 0) rotate(${rot})`}>
                {/* the unsheathe scales this inner g from its base; the
                    placement above must stay on its own node */}
                <g className="wv-blade" style={{ "--len": len, "--d": `${i * 45}ms` }}>
                  <path className="wv-blade-body" d={CLAW_D} />
                  <path className="wv-blade-ridge" d={CLAW_RIDGE_D} />
                  <path className="wv-blade-flash" d={CLAW_RIDGE_D} />
                </g>
              </g>
            ))}
            {/* the hand is off in the dark. A drawn fist at this size is four
                knuckles of mud, and a flat cut across three blade bases reads
                as three objects that were sliced off — so the roots simply
                fall away into shadow. It has to be an ELLIPSE, not the rect
                the first pass used: a rect's own edges showed as a hard dark
                slab lying across the lower corner, which is a worse artefact
                than the flat cuts it was hiding. */}
            <ellipse className="wv-blade-root" cx="-8" cy="18" rx="140" ry="54" />
          </g>
      </svg>
    </div>
  );
}

/* The drawn cowl lived here — a hundred lines of silhouette, modelling,
   rim light and grain in a 100x100 box pinned to the artwork's head circle,
   plus CROWN_D, LIP_D, BROW_SHADE_D, WING_FACET_D, RIM_D, the eye openings
   and the nose ridge. All of it is gone: the mask is a supplied image now.

   Worth saying why, since it was four passes of work. The problem was never
   the modelling, it was that a mask is a LIKENESS, and a likeness assembled
   out of bezier guesses reads as a near-miss of something everybody already
   knows by heart. The wings can be the right length and the eyes the right
   slant and it still looks like a drawing of a Wolverine mask rather than
   one. A photograph of the object does not have that problem.

   If it ever has to go back to vector, the geometry is in the history at
   82f1ceb. */

/* One blade, base at the origin, pointing up, 152 long and 34 across, scaled
   to about 200 by the length factors below. The taper is nearly all in the
   last third — a blade that narrows evenly from the base reads as a traffic
   cone. Keep it near 1:6: at 1:12, which is where the first pass landed, three
   of these read as knitting needles rather than as a claw. */
const CLAW_D =
  "M0 -152 C8.5 -122, 14.1 -86, 17 -50 C18.7 -30, 18.7 -12, 17 0 L-17 0 C-18.7 -12, -18.7 -30, -17 -50 C-14.1 -86, -8.5 -122, 0 -152 Z";
/* the bevel down the middle, which is where all the light on a blade is */
const CLAW_RIDGE_D =
  "M0 -152 C4.6 -110, 6.8 -60, 6.8 0 L-6.8 0 C-6.8 -60, -4.6 -110, 0 -152 Z";

/* [offset across the knuckles, splay in degrees, length scale] — the middle
   blade is the long one, which is the only thing that stops three parallel
   spikes reading as a fork.

   The offsets are 60 apart because THE TEARS ARE 60 APART. With the blades
   pointing along the cut, the bundle's local +x offset is exactly its
   perpendicular, so each blade rides the tear it makes. The splay is kept to
   3deg for the same reason — at this spacing a wider fan pulls the outer tips
   off their lines by the end of the blade. */
const CLAWS = [
  [-60, -3, 1.22],
  [0, 0, 1.4],
  [60, 3, 1.26],
];

/* One tear, 700 long and about 15 across at its widest, pointed at both ends.
   Drawn straight and displaced by feTurbulence at render — hand-waving the
   waviness into the path itself gives every gash the same wave. It has to stay
   THIN: the first pass was twice this and, with a wide blurred glow under it,
   the three of them read as brown brushstrokes laid over the frame rather than
   as cuts in it. A tear is a line with light in it, not a shape. */
const GASH_D =
  "M0 0 C120 -4, 260 -8.5, 420 -7 C520 -6, 620 -3.5, 700 0 C620 4, 520 6, 420 7.5 C260 9, 120 4.5, 0 0 Z";

/* Filter and gradient defs, kept in one zero-size <svg> so the theme stays a
   single self-contained component. */
function WolverineDefs() {
  return (
    <svg className="wv-defs" aria-hidden focusable="false">
      <defs>
        {/* the cowl's hide: keyed from the lower left, and never run down to
            black at the edge or the wings dissolve into the ground */}
        <linearGradient id="wv-crownfill" x1="0.1" y1="0.05" x2="0.9" y2="0.9">
          <stop offset="0%" stopColor="#e6bc5d" />
          <stop offset="34%" stopColor="#c48f2e" />
          <stop offset="76%" stopColor="#84551a" />
          <stop offset="100%" stopColor="#4e2f10" />
        </linearGradient>

        {/* the shadow side, taken across the whole cowl in one pass rather than
            painted onto each feature */}
        <linearGradient id="wv-crownshade" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="#1d0d04" stopOpacity="0" />
          <stop offset="44%" stopColor="#1d0d04" stopOpacity="0" />
          <stop offset="100%" stopColor="#1d0d04" stopOpacity="0.6" />
        </linearGradient>

        {/* the cowl's edge lying on the hood: hard at the top, gone by the
            time it reaches the eyes */}
        <linearGradient id="wv-browfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b0503" stopOpacity="0.8" />
          <stop offset="14%" stopColor="#0b0503" stopOpacity="0.36" />
          <stop offset="34%" stopColor="#0b0503" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0b0503" stopOpacity="0" />
        </linearGradient>

        {/* Two soft-blur kernels. The filter region has to be opened right out:
            the default box is 120% of the object's own bounds, which crops a
            wide blur on a small ellipse into a rectangle with visible corners. */}
        <filter id="wv-soft2" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="wv-glow" x="-20%" y="-500%" width="140%" height="1100%">
          <feGaussianBlur stdDeviation="7" />
        </filter>

        {/* worn hide. Desaturated, or it is confetti rather than grain. */}
        <filter id="wv-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="3" seed="11" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
        </filter>

        {/* the torn edge. A plain lens reads as a stroke of highlighter; the
            displacement is what makes it a rip. */}
        <filter id="wv-tear" x="-12%" y="-260%" width="124%" height="620%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.07" numOctaves="3" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* what the cut is showing: white-hot along the middle, falling off to
            nothing at the ends */}
        <linearGradient id="wv-hot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffb057" stopOpacity="0" />
          <stop offset="22%" stopColor="#ff7a24" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#fff2d2" stopOpacity="1" />
          <stop offset="78%" stopColor="#ff7a24" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffb057" stopOpacity="0" />
        </linearGradient>

        {/* the blades' roots falling away into the dark */}
        <radialGradient id="wv-root">
          <stop offset="0%" stopColor="#0a0503" stopOpacity="0.97" />
          <stop offset="46%" stopColor="#0a0503" stopOpacity="0.82" />
          <stop offset="100%" stopColor="#0a0503" stopOpacity="0" />
        </radialGradient>

        {/* adamantium: the light on a blade is one bright band down the bevel
            with the body falling away to either side of it */}
        <linearGradient id="wv-bladefill" x1="0" y1="0" x2="1" y2="0.1">
          <stop offset="0%" stopColor="#6f7d8d" />
          <stop offset="34%" stopColor="#cdd8e5" />
          <stop offset="62%" stopColor="#8d9bab" />
          <stop offset="100%" stopColor="#4e5a68" />
        </linearGradient>
      </defs>
    </svg>
  );
}
