// Wolverine.js — three adamantium claws rake across a dark forge-lit space and
// the slash is what brings the mark up. What stays on the held frame is the
// pair of signatures anybody reads at thumbnail size: three parallel gashes
// torn across the ground, and a tan mask with two long flared wings sitting on
// the ninja's hood.
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
// THE MASK DRESSES THE MARK, it does not replace it. Hulk had to be drawn
// because a hulk needs a different skull; a wolverine needs a piece of
// HEADGEAR, which is Pirates' problem, not Hulk's — so the ninja keeps their
// own head and wears the cowl over it, positioned off the artwork's pixels.
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

// p1 the space comes up: hide-brown dark, one warm key low and left, haze
// p2 SNIKT — three blades unsheathe at the lower left and hold, glinting
// p3 the rake: they cross the frame and exit, three gashes tear open behind
//    them, sparks come off the cut, and the mark lights as the slash passes
// p4 the metal settles — adamantium specular travels the wordmark, the gashes
//    cool from white-hot down to ember
// p5 WOODBRIDGE
//
// Plays ONCE and holds — loopAt is null. The embers, the gash flicker and the
// specular travel keep the held frame alive; that is ambient, not a restart.
const CUES = [160, 1480, 2420, 3320, 4060];

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

// The three gashes, and the blades that leave them, all laid on one axis.
//
// THE BUNDLE GOES BESIDE THE LOCKUP, NOT THROUGH IT — and that is arithmetic,
// not taste, because claw marks have to stay PARALLEL AND EVENLY SPACED or
// they stop reading as claw marks. Working in the 390x844 viewBox: the block
// centres on (196, 422) and measures about 220 x 160, the cut runs at -33deg,
// so its perpendicular is n = (0.545, 0.839). Projecting the parts of the
// composition onto n, measured from the block's centre:
//
//     the cowl          -92 .. +45
//     "CODE NINJAS"     -53 .. +100
//     WOODBRIDGE + rule   -1 .. +119
//
// That union has no gap in it, so no evenly-spaced trio can straddle the mark
// without crossing something — two earlier placements proved it the slow way,
// one through "NINJAS" and one through the cowl. The whole bundle therefore
// sits at +160, +220 and +280, raking the lower third: 41 units clear of the
// rule at the near edge, and inside the warm key, which is what the ember
// glow wants to sit in.
//
// Each entry is the left-hand END of that tear, i.e. the point on its line
// 350 units back along the cut. [x, y, opening delay in ms]
const GASHES = [
  [-11, 747, 0],
  [22, 797, 55],
  [55, 848, 110],
];

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
      <div className="wv-gashes" aria-hidden>
        <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
          {GASHES.map(([x, y, d], i) => (
            // the placement lives on the OUTER g: a CSS transform on an
            // element carrying a transform attribute replaces it outright, so
            // animating this same node would throw the tear to the origin
            <g key={i} transform={`translate(${x} ${y}) rotate(-33)`}>
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

      <div className="wv-sparks" aria-hidden>
        {SPARKS.map(([l, t, dx, dy, d], i) => (
          <span
            key={i}
            className="wv-spark"
            style={{ left: `${l}%`, top: `${t}%`, "--dx": `${dx}vw`, "--dy": `${dy}vw`, "--d": `${d}ms` }}
          />
        ))}
      </div>

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

              {/* --- above it: the hood and the eye band --- */}
              <div className="wv-head">
                <div className="wv-headbox">
                  <div className="wv-plate wv-plate-hide" aria-hidden />
                  <div className="wv-plate wv-plate-band" aria-hidden />
                </div>
              </div>

              <Cowl />
            </div>
          </div>

          {/* directly under the mark, in flow */}
          <div className="wv-type">
            <div className="wv-caption">{caption}</div>
            <div className="wv-rule" aria-hidden />
          </div>
        </div>
      </div>

      {/* ---- the blades ----
           Three of them, no hand: a fist drawn at this size is four knuckles
           of mud, and the blades are the whole read anyway. */}
      <div className="wv-claws" aria-hidden>
        <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
          {/* rotate(57) takes a blade drawn pointing UP round to the -33deg
              cut, so the tips lead the travel. The knuckle sits on the MIDDLE
              tear's line, 280 units back along it, so the hand is where the
              cut it leaves is. */}
          <g transform="translate(81 759) rotate(57)">
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
            <ellipse className="wv-blade-root" cx="0" cy="18" rx="124" ry="54" />
          </g>
        </svg>
      </div>

      <div className="wv-grain" aria-hidden />
      <div className="wv-vignette" aria-hidden />
    </div>
  );
}

/**
 * The cowl, in a 100x100 box that IS the head circle (cx 50, cy 50, r 50) — so
 * every feature below is stated in head radii and nothing can drift out of
 * register with the artwork. The wings run off the top of the box on purpose;
 * the element is overflow: visible.
 *
 * Everything that says "wolverine" here is silhouette: two long wings flaring
 * up and outward from the temples, a shallow notch between them, and a lower
 * edge that comes to a point over the bridge of the nose. The colour is doing
 * far less work than the outline.
 */
function Cowl() {
  return (
    <div className="wv-cowl" aria-hidden>
      <svg viewBox="0 0 100 100">
        <defs>
          <clipPath id="wv-crownclip">
            <path d={CROWN_D} />
          </clipPath>
          <clipPath id="wv-headclip">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>

        {/* the shadow the cowl throws onto the hood below its edge. Clipped to
            the head, and a gradient rather than a flat band so it dies out
            before it reaches the eyes and turns them into a squint. */}
        <g clipPath="url(#wv-headclip)">
          <path className="wv-browshade" d={BROW_SHADE_D} />
        </g>

        <path className="wv-crown" d={CROWN_D} />

        {/* ---- modelling, clipped to the silhouette ----
            Broad planes first, then the facets that sit on them, then the
            falloff over the lot, then grain. A highlight painted after the
            falloff floats. */}
        <g clipPath="url(#wv-crownclip)">
          {/* the crown takes the key, which is low and to the left */}
          <ellipse className="wv-crown-hi" cx="26" cy="26" rx="36" ry="28" filter="url(#wv-soft2)" />
          {/* each wing gets its inner plane so it has thickness — a flat spike
              is clip-art whatever else is going on around it */}
          <path className="wv-wing-facet" d={WING_FACET_D} />
          <g transform="translate(100,0) scale(-1,1)">
            <path className="wv-wing-facet" d={WING_FACET_D} />
          </g>
          {/* the temple, where the cowl turns away from the light */}
          <ellipse className="wv-temple" cx="90" cy="44" rx="24" ry="34" filter="url(#wv-soft2)" />
          <rect className="wv-crown-shade" x="-40" y="-70" width="180" height="180" />
          {/* worn hide, not vinyl: the turbulence MUST be desaturated or it is
              confetti over the cowl rather than grain */}
          <rect className="wv-crown-tex" x="-40" y="-70" width="180" height="180" filter="url(#wv-grain)" />
        </g>

        {/* the silhouette's own edge, drawn last so nothing can break it */}
        <path className="wv-crown-edge" d={CROWN_D} />
        {/* The key's rim, up the left side and out to the wing tip. Every
            segment here is LIFTED VERBATIM out of CROWN_D — an eyeballed
            near-copy of a curve does not sit on it, and the miss reads as a
            stray pencil line beside the head. */}
        <path className="wv-crown-rim" d={RIM_D} />
        {/* and the cowl's cut edge lying on the hood */}
        <path className="wv-crown-lip" d={LIP_D} />
      </svg>
    </div>
  );
}

/* The cowl. Written symmetric about x = 50 and stated as one path so the wings
   and the crown are a single silhouette — two shapes butted together always
   show their seam once anything is drawn over them.

   Four things separate this from the CROWN the first pass shipped, and they
   are all silhouette rather than colour:

   1. The wings are SWEPT, not stood up. Their tips are at (-30, -34) and
      (130, -34) — further out to the side than up — so the head reads broad.
      The first pass had them at 24 out and 40 up and it was a tiara.
   2. The cowl comes DOWN THE SIDES to y = 72, well past the widest point of
      the head, so it wraps the skull instead of sitting on top of it. A tan
      shape that stops above the eyes is a hat.
   3. The lower edge is a double scallop: a cheek piece down at each temple, up
      over each eye, and down to a point at y = 52 on the bridge of the nose.
      That centre point is the most recognisable line on the mask.
   4. The notch between the wings is shallow and wide (down to y = 15 across
      x 32-68) rather than a narrow deep V, which is what a crown has.

   The artwork's eye SLITS are at x 21.8-33.7 and 64.7-76.2, y 47.5-57.5 —
   narrower than the light band around them, which is why the edge can run down
   to y = 48 at x = 14 and still leave the eyes completely clear. It crosses
   above them at about y 42, which reads as a brow overhanging the eyes. */
const CROWN_D =
  "M6 72 C2.4 67, 0.4 60, 0 52 C0 46, 1.4 38, 4 30 C-2 14, -15 -12, -30 -34 C-10 -24, 14 -6, 32 2 C39 5, 46 9, 50 15 C54 9, 61 5, 68 2 C86 -6, 110 -24, 130 -34 C115 -12, 102 14, 96 30 C98.6 38, 100 46, 100 52 C100 60, 97.6 67, 94 72 C93 62, 91 54, 86 48 C82 44, 74 41, 66 42 C60 44, 54 47, 50 52 C46 47, 40 44, 34 42 C26 41, 18 44, 14 48 C9 54, 7 62, 6 72 Z";

/* just the lower edge of it, to lay a hairline on the hood */
const LIP_D =
  "M6 72 C7 62, 9 54, 14 48 C18 44, 26 41, 34 42 C40 44, 46 47, 50 52 C54 47, 60 44, 66 42 C74 41, 82 44, 86 48 C91 54, 93 62, 94 72";

/* the band of shadow the cowl throws below that edge. It reaches the eye band
   on purpose and dies out inside it — the fill is a gradient with most of its
   fall in the first sixth, not a flat tone, or the ninja is squinting. */
const BROW_SHADE_D =
  "M6 72 C7 62, 9 54, 14 48 C18 44, 26 41, 34 42 C40 44, 46 47, 50 52 C54 47, 60 44, 66 42 C74 41, 82 44, 86 48 C91 54, 93 62, 94 72 C93 78, 90 81, 87 82 C75 72, 62 68, 50 66 C38 68, 25 72, 13 82 C10 81, 7 78, 6 72 Z";

/* the lit inner plane of the left wing, mirrored for the right */
const WING_FACET_D = "M-30 -34 C-10 -24, 14 -6, 32 2 C18 -4, -2 -18, -30 -34 Z";

/* the key rim: the left silhouette and the left wing's outer edge, verbatim */
const RIM_D =
  "M6 72 C2.4 67, 0.4 60, 0 52 C0 46, 1.4 38, 4 30 C-2 14, -15 -12, -30 -34";

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

   The offsets are 60 apart because THE GASHES ARE 60 APART. In the rotated
   frame a local +x offset is exactly +n, so each blade rides the tear it cuts;
   with the blades 20 apart and the tears 72, as the first pass had it, the
   rake and its marks were two unrelated events that happened to overlap. The
   splay is kept to 3deg for the same reason — at this spacing a bigger fan
   pulls the outer tips off their lines by the end of the blade. */
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
