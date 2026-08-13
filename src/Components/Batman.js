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

        <path className="bm-cowl-shape" d={COWL_D} />

        <g clipPath="url(#bm-cowlclip)">
          {/* form: the jaw and the right cheek fall away from the beam */}
          <path className="bm-cowl-shade" d={COWL_D} />
          {/* the brow is a MASS above the eyes, dipping toward the middle —
              a pair of eyebrows laid on the face reads as cheesy (Hulk) */}
          <path className="bm-brow" d={BROW_D} />
        </g>

        {/* the silhouette's own edge, drawn last so nothing can break it. The
            beam is up and to the left of the mark, so the rim is too. */}
        <path className="bm-cowl-edge" d={COWL_D} />
        <path className="bm-cowl-rim" d={RIM_D} />

        <g className="bm-eye-l">
          <path className="bm-eye-glow" d={EYE_D} />
          <path className="bm-eye" d={EYE_D} />
        </g>
        <g transform="translate(200,0) scale(-1,1)">
          <g className="bm-eye-r">
            <path className="bm-eye-glow" d={EYE_D} />
            <path className="bm-eye" d={EYE_D} />
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
  "M40 8 C 44 40, 50 62, 63 78 C 74 66, 86 60, 100 60 C 114 60, 126 66, 137 78 C 150 62, 156 40, 160 8 C 174 38, 183 72, 182 105 C 180 150, 159 191, 127 215 C 117 223, 109 229, 100 229 C 91 229, 83 223, 73 215 C 41 191, 20 150, 18 105 C 17 72, 26 38, 40 8 Z";

/* the brow mass, inside the skin rather than sitting on it */
const BROW_D =
  "M18 96 C 46 84, 76 82, 100 92 C 124 82, 154 84, 182 96 C 182 118, 176 132, 168 138 C 140 122, 118 116, 100 116 C 82 116, 60 122, 32 138 C 24 132, 18 118, 18 96 Z";

/* the rim the searchlight puts on the upper-left edge — its own open path so
   the light stops where the form turns away, instead of ringing the whole
   silhouette like a sticker outline */
const RIM_D =
  "M40 8 C 44 40, 50 62, 63 78 M18 105 C 17 72, 26 38, 40 8 M20 130 C 26 160, 44 190, 70 210";

/* One eye, drawn in the left half and mirrored for the other. It slants DOWN
   toward the nose and tapers to a point there — an eye level with the brow, or
   one tapering the other way, reads as surprised rather than as a threat. */
const EYE_D =
  "M31 113 C 45 107, 68 119, 94 138 C 88 149, 68 147, 48 139 C 35 133, 28 122, 31 113 Z";

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
          <stop offset="0%" stopColor="#5b6b85" />
          <stop offset="38%" stopColor="#2f3b4f" />
          <stop offset="100%" stopColor="#141b26" />
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
          <stop offset="0%" stopColor="#8494ad" stopOpacity="0.5" />
          <stop offset="46%" stopColor="#2b3648" stopOpacity="0" />
          <stop offset="100%" stopColor="#05080e" stopOpacity="0.62" />
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
