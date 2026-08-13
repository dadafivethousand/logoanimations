// Batman.js — a searchlight comes up over a Gotham-ish skyline, sweeps to the
// centre, and the mark is standing in it, caped, with the light doing the
// reveal.
//
// Genre, not franchise. No studio mark, no film logotype, and deliberately no
// chest emblem or signal device — those are the registered ones. What carries
// the theme is the vocabulary anybody reads instantly at thumbnail size: a
// long-eared cowl with white slit eyes, a scalloped cape, rain, a skyline,
// and one hard searchlight. Same rule Spiderman, Pirates and Samurai follow.
//
// THE LIGHT IS THE EVENT. Spiderman lowers the mark in on a thread; here
// nothing moves into frame at all. The mark is already standing in the dark
// and the beam crossing it is what brings it up — silhouette first, then
// material, then the cape opens, then the eyes. An entrance that also flew
// something in from off-screen would have two events competing on the same
// beat, which is the mistake Spiderman's p2 was moved to avoid.
//
// THE COWL IS DRAWN, NOT MASKED. Recolouring the artwork's hood cannot give
// it ears, and the ears plus the brow line are most of what makes this read
// at feed scale — the same finding Hulk paid three passes for. So the cowl is
// its own SVG (silhouette, brow, both eyes in one coordinate system) sitting
// over the artwork's hood and covering it completely.
//
// MEASURED OFF THE ARTWORK'S OWN PIXELS, scanned row by row on the trimmed
// mark (1916x882, aspect 2.1723) — the figures Spiderman re-measured:
//
//     head      rows   0-54%   columns 32.7-62.0%
//     (empty)   rows  55-61%
//     wordmark  rows  62-89%   columns 0-100%
//     "J" tail  rows  90-100%  columns 72.3-78.3%
//
// (Pirates records the head as 46.3% tall and that is WRONG — it runs to 54%.)
// The artwork's head is CLIPPED away at 58%, inside the empty band, so the
// drawn cowl is the only head on screen and no crescent of the old one can
// show under the jaw.
//
// THE WORDMARK STILL USES THE REGION MASKS. useLogo segments the artwork into
// --logo-dark (hood + "NINJAS"), --logo-light (the skin band) and
// --logo-accent ("CODE"), so "NINJAS" takes cold gunmetal armour and "CODE"
// keeps the brand blue, pitched to the night. A single flat tint over --logo
// would collapse the lockup into one slab.
//
// WOODBRIDGE sits in flow under the mark, inside the same wrapper, so it can
// never drift off the lockup.
import React from "react";
import "../Stylesheets/Batman.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 the lamp strikes, low and off-axis: sky, skyline and rain come up with it
// p2 the beam has swept to centre and the mark stands in it as a silhouette
// p3 the light is on it — armour, and the cape opens
// p4 the eyes ignite
// p5 WOODBRIDGE
//
// Each beat is set AFTER the one before it finishes rather than on top of it.
// Plays ONCE and holds — loopAt is null. The rain and the beam's flicker keep
// running on the held frame; that is ambient, not a restart.
const CUES = [140, 1560, 2620, 3520, 4180];

// Distant windows, fixed rather than random so every take of the recording is
// identical. [left%, top% within the skyline band, size in vw, opacity]
const WINDOWS = [
  [6, 46, 0.7, 0.5],
  [11, 62, 0.6, 0.34],
  [19, 38, 0.8, 0.42],
  [23, 57, 0.6, 0.26],
  [31, 66, 0.7, 0.36],
  [37, 30, 0.7, 0.46],
  [43, 52, 0.6, 0.3],
  [58, 44, 0.7, 0.44],
  [64, 63, 0.6, 0.28],
  [71, 34, 0.8, 0.5],
  [77, 58, 0.6, 0.32],
  [85, 42, 0.7, 0.4],
  [91, 60, 0.6, 0.26],
  [95, 33, 0.7, 0.36],
];

export default function Batman({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = null,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  // hold the first frame until the mark is measured, or the wordmark paints at
  // the wrong aspect for a frame and the cowl lands off the hood
  if (!ready) return <div className="bm bm-p0" aria-hidden />;

  return (
    <div
      className={`bm bm-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      <BatmanDefs />

      {/* ---- the night, and the city under it ---- */}
      <div className="bm-sky" aria-hidden />
      <div className="bm-cloud bm-cloud-a" aria-hidden />
      <div className="bm-cloud bm-cloud-b" aria-hidden />

      {/* ---- the beam ----
           A trapezoid clipped out of a soft gradient, pivoting about the lamp
           at the bottom of the frame. It starts thrown off to the left and
           swings onto the mark; the haze and the hot core are two copies of
           the same shape so the axis of the light stays a single object. */}
      <div className="bm-beam" aria-hidden>
        <div className="bm-beam-haze" />
        <div className="bm-beam-core" />
      </div>
      <div className="bm-lamp" aria-hidden />

      <div className="bm-skyline" aria-hidden>
        <svg viewBox="0 0 400 150" preserveAspectRatio="none">
          <path className="bm-city" d={SKYLINE_D} />
        </svg>
        {WINDOWS.map(([x, y, s, o], i) => (
          <span
            key={i}
            className="bm-win"
            style={{ left: `${x}%`, top: `${y}%`, width: `${s}vw`, height: `${s * 1.5}vw`, opacity: o }}
          />
        ))}
      </div>

      {/* Rain twice: a cold sheet over the whole frame, and a brighter copy
          gated to the middle of the frame where the beam comes to rest — rain
          only lights up where the light is, and that contrast is the entire
          reason to have rain at all. */}
      <div className="bm-rain" aria-hidden />
      <div className="bm-rain bm-rain-lit" aria-hidden />

      {/* ---- the mark, standing in it ---- */}
      <div className="bm-markwrap">
        <div className="bm-lift">
          <div className="bm-cape" aria-hidden>
            <svg viewBox="0 0 400 250">
              <g className="bm-wing">
                <path className="bm-wing-fill" d={WING_D} />
                <path className="bm-wing-edge" d={WING_D} />
              </g>
              {/* The left wing is the right one mirrored, so the pair can
                  never drift out of symmetry when the shape is tuned. The
                  mirror MUST sit on its own wrapper: a CSS transform on an
                  SVG element replaces the transform attribute outright, so
                  animating this same <g> would cancel the flip and draw both
                  wings on one side. */}
              <g transform="translate(400,0) scale(-1,1)">
                <g className="bm-wing">
                  <path className="bm-wing-fill" d={WING_D} />
                  <path className="bm-wing-edge" d={WING_D} />
                </g>
              </g>
            </svg>
          </div>

          <div className="bm-markbox">
            {/* the sky behind the lockup is dark and so is the armour; this is
                the only thing giving the mark an edge on its shadow side */}
            <div className="bm-halo" aria-hidden />

            <div className="bm-mark">
              {/* Everything here paints the whole mark box; bm-word shows only
                  the band below the artwork's head, so the drawn cowl is all
                  you ever see of a head. A clip rather than a mask knockout —
                  a knockout leaves a hairline of the material down both edges
                  of the box once the layers stack. */}
              <div className="bm-word">
                <div className="bm-wordbox">
                  <div className="bm-layer bm-cast" aria-hidden />

                  {/* --- the wordmark, painted per region --- */}
                  <div className="bm-plate bm-plate-steel" aria-hidden />
                  <div className="bm-plate bm-plate-face" aria-hidden />
                  <div className="bm-plate bm-plate-code" aria-hidden />
                  <div className="bm-layer bm-key" aria-hidden />
                  <div className="bm-layer bm-silhouette" aria-hidden />
                </div>
              </div>

              <Cowl />
            </div>
          </div>

          {/* directly under the mark, in flow */}
          <div className="bm-type">
            <div className="bm-caption">{caption}</div>
            <div className="bm-rule" aria-hidden />
          </div>
        </div>
      </div>

      <div className="bm-grain" aria-hidden />
      <div className="bm-vignette" aria-hidden />
    </div>
  );
}

/**
 * The cowl. One 200x240 coordinate system carries the silhouette, the brow and
 * both eyes, so nothing here can drift out of register with anything else —
 * which is the failure mode of placing eyes in one box and the shape in
 * another.
 */
function Cowl() {
  return (
    <div className="bm-cowl" aria-hidden>
      <svg viewBox="0 0 200 240">
        <defs>
          <clipPath id="bm-cowlclip">
            <path d={COWL_D} />
          </clipPath>
        </defs>

        {/* the base material */}
        <path className="bm-cowl-shape" d={COWL_D} />

        {/* ---- everything that models the form, clipped to the silhouette ----

            Order is the order light works in: the broad planes first, then
            the features that sit on them, then the shadow side over the lot,
            then texture. A highlight painted after the falloff floats. */}
        <g clipPath="url(#bm-cowlclip)">
          {/* the crown of the skull takes the sky */}
          <ellipse className="bm-skull-hi" cx="76" cy="86" rx="52" ry="34" filter="url(#bm-soft2)" />

          {/* the brow is a MASS above the eyes, dipping toward the middle —
              a pair of eyebrows laid on the face reads as cheesy (Hulk) */}
          <path className="bm-brow" d={BROW_D} />

          {/* The nose is UNDER the cowl, moulded rather than exposed: a lit
              plane on the key side of the ridge, a shadow on the other, and
              the tip's own shadow where it turns under. Cutting a nose hole
              in the mask reads as a costume; moulding it reads as one piece
              of rubber pulled over a face. */}
          <path className="bm-nose-lit" d={NOSE_LIT_D} filter="url(#bm-soft)" />
          <path className="bm-nose-dark" d={NOSE_DARK_D} filter="url(#bm-soft)" />
          <ellipse className="bm-nose-tip" cx="100" cy="172" rx="19" ry="7" filter="url(#bm-soft)" />

          {/* cheekbones: the only thing standing between the brow and the jaw,
              and without them the middle of the face is a flat panel */}
          <ellipse className="bm-cheek bm-cheek-l" cx="52" cy="146" rx="23" ry="16" filter="url(#bm-soft2)" />
          <ellipse className="bm-cheek bm-cheek-r" cx="150" cy="148" rx="20" ry="14" filter="url(#bm-soft2)" />

          {/* the shadow side, and the general falloff toward the jaw */}
          <rect className="bm-sideshade" x="0" y="0" width="200" height="240" />
          <path className="bm-cowl-shade" d={COWL_D} />

          {/* matte rubber, not vinyl: a little desaturated grain over
              everything is most of what separates a moulded surface from a
              gradient */}
          <rect className="bm-cowl-tex" x="0" y="0" width="200" height="240" filter="url(#bm-grain)" />
        </g>

        {/* ---- the exposed lower face ----

            The single biggest thing making the earlier pass read as a balloon
            with eyes on it: a cowl is worn BY somebody, and the jaw and mouth
            below its edge are what say so. */}
        <g clipPath="url(#bm-cowlclip)">
          <path className="bm-face" d={FACE_D} />
          {/* the cowl's own edge casts onto the skin just under it */}
          <path className="bm-face-occl" d={FACE_D} filter="url(#bm-soft)" />
          <ellipse className="bm-chin-hi" cx="100" cy="218" rx="18" ry="11" filter="url(#bm-soft)" />
          <ellipse className="bm-jaw-shade" cx="100" cy="236" rx="30" ry="14" filter="url(#bm-soft)" />
          <path className="bm-lip-lo" d={LIP_LO_D} filter="url(#bm-soft)" />
          <path className="bm-philtrum" d={PHILTRUM_D} filter="url(#bm-soft)" />
          {/* the mouth is set, and its corners turn DOWN — a level line reads
              as neutral and a lifted one reads as a smirk */}
          {/* the fold from the nose to the corner of the mouth. Two short
              strokes, and the lower face stops being a blank panel. */}
          <path className="bm-fold" d={FOLD_D} filter="url(#bm-soft)" />
          <path className="bm-mouth" d={MOUTH_D} />
          <path className="bm-face-edge" d={FACE_EDGE_D} />
        </g>

        {/* ---- the ears ----
            Each one gets an inner plane, so it has thickness. A flat spike is
            clip-art whatever else is going on around it. */}
        <path className="bm-ear-facet" d={EAR_FACET_D} />
        <g transform="translate(200,0) scale(-1,1)">
          <path className="bm-ear-facet" d={EAR_FACET_D} />
        </g>

        {/* the silhouette's own edge, drawn last so nothing can break it */}
        <path className="bm-cowl-edge" d={COWL_D} />
        {/* the key, up and to the left */}
        <path className="bm-cowl-rim" d={RIM_D} />
        {/* and the beam itself, behind the mark: a cold rim down the shadow
            side. Two lights of different colour is the whole difference
            between a drawing of a head and a photograph of one. */}
        <path className="bm-cowl-backrim" d={BACKRIM_D} />

        {/* ---- the eyes ----
            The sockets are cut whether or not the eyes are lit, so the beats
            before ignition read as empty holes rather than as a blank face. */}
        <g clipPath="url(#bm-cowlclip)">
          <path className="bm-socket" d={SOCKET_D} filter="url(#bm-soft)" />
          <g transform="translate(200,0) scale(-1,1)">
            <path className="bm-socket" d={SOCKET_D} filter="url(#bm-soft)" />
          </g>
        </g>

        <g className="bm-eye-l">
          <path className="bm-eye-glow" d={EYE_D} />
          <path className="bm-eye" d={EYE_D} />
          {/* the brow overhangs the lens and lands on the top of it */}
          <path className="bm-eye-occl" d={EYE_D} />
        </g>
        {/* The right eye is the left one mirrored, so the pair can never drift
            out of symmetry. The mirror MUST sit on its own wrapper: a CSS
            transform on an SVG element replaces the transform attribute
            outright, so animating this same <g> would cancel the flip and
            draw both eyes in one socket. */}
        <g transform="translate(200,0) scale(-1,1)">
          <g className="bm-eye-r">
            <path className="bm-eye-glow" d={EYE_D} />
            <path className="bm-eye" d={EYE_D} />
            <path className="bm-eye-occl" d={EYE_D} />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* The cowl: two long ears on a broad base, a brow line dipping between them,
   cheeks drawing in, and a narrow chin. The ears are what the whole theme
   hangs on, so they are a fifth of the box tall and they lean very slightly
   outward — dead-vertical ears read as a jester's cap. */
const COWL_D =
  "M40 8 C 44 40, 50 62, 63 78 C 74 66, 86 60, 100 60 C 114 60, 126 66, 137 78 C 150 62, 156 40, 160 8 C 174 38, 183 72, 182 105 C 181 148, 166 186, 133 212 C 122 222, 110 230, 100 230 C 90 230, 78 222, 67 212 C 34 186, 19 148, 18 105 C 17 72, 26 38, 40 8 Z";

/* the brow mass, inside the skin rather than sitting on it */
const BROW_D =
  "M18 96 C 46 84, 76 82, 100 92 C 124 82, 154 84, 182 96 C 182 118, 176 132, 168 138 C 140 122, 118 116, 100 116 C 82 116, 60 122, 32 138 C 24 132, 18 118, 18 96 Z";

/* the ridge of the nose, moulded under the mask: lit on the key side, dark on
   the other, meeting on the centre line */
const NOSE_LIT_D = "M100 118 C 92 136, 86 152, 83 166 C 90 172, 100 174, 100 174 Z";
const NOSE_DARK_D = "M100 118 C 108 136, 114 152, 117 166 C 110 172, 100 174, 100 174 Z";

/* The opening: mouth and chin, cheek to cheek, running all the way DOWN to
   the silhouette's own chin. The first pass stopped it short of the jaw and
   floated it in the middle of the face, which read as a pale pill stuck on —
   the same failure CLAUDE.md records for a lighter-coloured muzzle. Skin that
   reaches the edge of the head is the face; skin that doesn't is a patch.
   The top edge dips at the centre: a cowl comes down over the cheeks and
   crosses under the nose, so its cut line is a shallow M, not an arc. */
const FACE_D =
  "M58 176 C 68 166, 78 161, 88 162 C 93 168, 97 170, 100 170 C 103 170, 107 168, 112 162 C 122 161, 132 166, 142 176 C 143 197, 133 214, 118 224 C 111 228, 105 231, 100 231 C 95 231, 89 228, 82 224 C 67 214, 57 197, 58 176 Z";

/* just the top of that opening — the cowl's cut edge lying on the skin */
const FACE_EDGE_D =
  "M58 176 C 68 166, 78 161, 88 162 C 93 168, 97 170, 100 170 C 103 170, 107 168, 112 162 C 122 161, 132 166, 142 176";

/* The mouth takes most of the opening's width and its corners turn DOWN. A
   short line in the middle of all that skin reads as a stitched-on smile;
   what makes a mouth is width, weight and the shadow under the lower lip. */
const MOUTH_D = "M73 195 C 83 189, 92 187, 100 188 C 108 187, 117 189, 127 195";
const LIP_LO_D = "M78 203 C 88 208, 112 208, 122 203 C 114 213, 86 213, 78 203 Z";
/* the groove under the nose, and the crease above the chin — small, and the
   two things that stop the lower face being a blank panel */
const FOLD_D = "M86 178 C 80 186, 76 192, 75 199 M114 178 C 120 186, 124 192, 125 199";
const PHILTRUM_D = "M96 172 C 96 178, 96 182, 97 186 M104 172 C 104 178, 104 182, 103 186";

/* a thin lens of light down the inner edge of the ear, where the plane turns */
const EAR_FACET_D = "M40 8 C 44 40, 50 62, 63 78 C 52 62, 44 36, 40 8 Z";

/* The rim the searchlight puts on the upper-left edge. Every segment here is
   LIFTED VERBATIM out of COWL_D (reversed where the direction differs) — an
   eyeballed near-copy of a curve does not sit on it, and the miss reads as a
   stray pencil line beside the head rather than as light on its edge. That is
   exactly what the first pass of this shipped as, down the right ear. */
const RIM_D =
  "M40 8 C 44 40, 50 62, 63 78 M18 105 C 17 72, 26 38, 40 8 M18 105 C 18.7 133, 25.2 158.8, 38.8 180.6";

/* the beam is behind the mark, so it puts a warmer, thinner line down the
   shadow side — two lights of different colour, which is most of what makes a
   head read as photographed rather than drawn */
const BACKRIM_D =
  "M160 8 C 174 38, 183 72, 182 105 C 181 148, 166 186, 133 212";

/* One eye, drawn in the left half and mirrored for the other. It slants DOWN
   toward the nose and tapers to a point there — an eye level with the brow, or
   one tapering the other way, reads as surprised rather than as a threat. */
const EYE_D =
  "M33 114 C 46 107, 66 119, 92 138 C 87 147, 68 143, 49 136 C 38 131, 30 122, 33 114 Z";

/* the socket the lens sits in: the same shape, opened out, so the eye is a
   hole in a solid head rather than a decal on it */
const SOCKET_D =
  "M26 107 C 42 98, 68 113, 98 139 C 92 154, 66 150, 44 142 C 30 136, 22 118, 26 107 Z";

/* One cape wing, drawn to the right of centre and mirrored. The scalloped
   lower edge is the whole signature: two hanging points with concave sweeps
   between them, and the outermost point a long way out at the tip. A smooth
   lower edge reads as a hood, not a cape. */
const WING_D =
  "M200 20 C 252 8, 310 22, 352 56 C 366 68, 376 80, 384 94 C 358 92, 336 98, 320 112 C 324 130, 318 152, 304 172 C 291 152, 273 142, 252 144 C 252 166, 244 188, 230 208 C 220 182, 212 158, 200 134 Z";

/* The city, as one silhouette rather than a row of boxes — a skyline with no
   setbacks or spires reads as a bar chart. Drawn across a 400x150 box and
   stretched to the frame's width. */
const SKYLINE_D =
  "M0 150 L0 96 L14 96 L14 78 L30 78 L30 96 L44 96 L44 60 L48 60 L48 44 L52 44 L52 60 L68 60 L68 104 L84 104 L84 86 L96 86 L96 30 L100 30 L100 18 L104 18 L104 30 L118 30 L118 86 L132 86 L132 108 L150 108 L150 70 L164 70 L164 52 L180 52 L180 70 L194 70 L194 100 L212 100 L212 64 L216 64 L216 40 L220 40 L220 64 L238 64 L238 92 L252 92 L252 74 L268 74 L268 110 L284 110 L284 56 L288 56 L288 34 L292 34 L292 56 L308 56 L308 96 L324 96 L324 80 L340 80 L340 66 L356 66 L356 88 L372 88 L372 104 L386 104 L386 84 L400 84 L400 150 Z";

/* Filter/gradient defs. Kept in one zero-size <svg> so the theme stays a
   single self-contained component. */
function BatmanDefs() {
  return (
    <svg className="bm-defs" aria-hidden focusable="false">
      <defs>
        {/* the cowl's material: keyed from the upper left, and never run down
            to black at the edge or the jaw dissolves into the sky */}
        <linearGradient id="bm-cowlfill" x1="0.18" y1="0" x2="0.86" y2="1">
          <stop offset="0%" stopColor="#66788f" />
          <stop offset="34%" stopColor="#38455b" />
          <stop offset="100%" stopColor="#161d29" />
        </linearGradient>

        {/* Two soft-blur kernels. The filter region has to be opened right
            out: the default box is 120% of the object's own bounds, which
            crops a wide blur on a small ellipse into a rectangle with visible
            corners. */}
        <filter id="bm-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="bm-soft2" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="10" />
        </filter>

        {/* Moulded rubber. The turbulence MUST be desaturated — left in
            colour it is confetti over the face, not grain (the same note
            Pokemon's paper fibre carries). */}
        <filter id="bm-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" intercept="0" />
          </feComponentTransfer>
        </filter>

        {/* the shadow side, taken across the whole head in one pass rather
            than painted onto each feature */}
        <linearGradient id="bm-sideshade" x1="0" y1="0" x2="1" y2="0.16">
          <stop offset="0%" stopColor="#04080f" stopOpacity="0" />
          <stop offset="40%" stopColor="#04080f" stopOpacity="0" />
          <stop offset="100%" stopColor="#04080f" stopOpacity="0.62" />
        </linearGradient>

        {/* skin, cooled right down: this is a face lit by a searchlight in the
            rain, and a warm one would read as pasted on */}
        <linearGradient id="bm-skinfill" x1="0.22" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#ab8571" />
          <stop offset="44%" stopColor="#7d5c4d" />
          <stop offset="100%" stopColor="#3b2b27" />
        </linearGradient>

        {/* the cowl's cut edge lying on the skin below it */}
        <linearGradient id="bm-faceoccl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c120e" stopOpacity="0.72" />
          <stop offset="34%" stopColor="#1c120e" stopOpacity="0" />
          <stop offset="100%" stopColor="#1c120e" stopOpacity="0" />
        </linearGradient>

        {/* the lens: brightest at the outer lobe, where the light in it is */}
        <linearGradient id="bm-lensfill" x1="0.1" y1="0.1" x2="0.9" y2="0.9">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="52%" stopColor="#eef6ff" />
          <stop offset="100%" stopColor="#b9d2ee" />
        </linearGradient>

        {/* the brow landing on the top of the lens */}
        <linearGradient id="bm-eyeoccl" x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor="#0d1826" stopOpacity="0.5" />
          <stop offset="46%" stopColor="#0d1826" stopOpacity="0" />
          <stop offset="100%" stopColor="#0d1826" stopOpacity="0" />
        </linearGradient>

        {/* form shading over the jaw and the shadow cheek */}
        <radialGradient id="bm-cowlshade" cx="30%" cy="20%" r="88%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="54%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#04070d" stopOpacity="0.72" />
        </radialGradient>

        {/* the brow reads as a mass because it is lit along its top and dark
            underneath, not because it is a darker shape */}
        <linearGradient id="bm-browfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94a6c2" stopOpacity="0.6" />
          <stop offset="44%" stopColor="#2b3648" stopOpacity="0" />
          <stop offset="100%" stopColor="#05080e" stopOpacity="0.82" />
        </linearGradient>

        {/* cape: sailcloth-heavy, and lifted well clear of black so the
            scallops still read against the sky */}
        <linearGradient id="bm-capefill" x1="0.2" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor="#33405a" />
          <stop offset="46%" stopColor="#1a2333" />
          <stop offset="100%" stopColor="#0b111b" />
        </linearGradient>
      </defs>
    </svg>
  );
}
