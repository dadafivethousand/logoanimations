// Pirates.js — a scroll unrolls, a dotted course is plotted across it, and the
// course ends at CODE NINJAS WOODBRIDGE: the final destination, sitting in the
// corner of the map.
//
// Genre, not franchise: no studio marks, no character likenesses, no film
// typeface.
//
// The mark is INK, not metal. It's masked in sepia and multiplied over the paper
// so the fibre and stains read straight through the letterforms, with a blurred
// copy underneath for the bleed. Metal would sit on top of the parchment and
// look pasted on.
//
// TWO STRUCTURAL RULES:
//
// 1. The mark is NOT one shape. The lockup is three tonal regions: the black
//    hood and "NINJAS", the skin-tone band across the EYES, and "CODE" in blue.
//    useLogo publishes a mask per region. Mask by --logo alone and the ninja
//    loses his eyes.
//
// 2. WOODBRIDGE lives INSIDE the mark wrapper, directly after the mark — never
//    positioned independently, or it drifts away from the logo.
import React from "react";
import "../Stylesheets/Pirates.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 the scroll unrolls · p2 the coast is inked · p3 the course is plotted, dot
// by dot · p4 the destination, its cross, and the seal
const CUES = [150, 1650, 2350, 3350];

/* The course, as discrete dots rather than a dashed stroke.
   Animating stroke-dashoffset on a dotted dasharray makes the dots MARCH along
   the line; it never reads as the line being plotted. Individual dots with
   staggered delays do — each lands a beat after the last, travelling toward the
   destination.
   Sampled off a Catmull-Rom spline through the waypoints, then hardcoded: no
   runtime maths, and every take composes identically. */
const DOTS = [
  [108.0, 252.0], [127.0, 268.2], [155.1, 291.2], [181.6, 317.7], [196.0, 344.0], [189.5, 370.2],
  [169.9, 397.8], [150.8, 425.5], [146.0, 452.0], [165.1, 476.4], [198.8, 499.5], [232.5, 522.9],
  [252.0, 548.0], [247.9, 576.5], [229.8, 607.1], [211.2, 637.2], [206.0, 664.0], [222.2, 685.8],
  [251.0, 704.5], [280.8, 722.4], [300.0, 742.0], [302.2, 765.4], [294.8, 790.8], [288.4, 810.8],
];

export default function Pirates({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = 10000,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="pc pc-p0" aria-hidden />;

  return (
    <div
      className={`pc pc-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      <PiratesDefs />

      {/* Everything on the sheet lives inside .pc-scroll, which is clipped from
          the top — that clip opening downward IS the unroll. The dowel below
          rides the same edge. */}
      <div className="pc-scroll">
        <div className="pc-page" aria-hidden>
          <span className="pc-fibre" />
          <span className="pc-stains" />
          <span className="pc-folds" />
          <span className="pc-scorch" />
        </div>

        <svg className="pc-map" viewBox="0 0 600 1200" preserveAspectRatio="none" aria-hidden>
          <g filter="url(#pc-quill)">
            <g className="pc-coast" fill="none">
              {/* the far shore we're leaving */}
              <path d="M-10 178 C 70 160, 118 206, 176 184 S 268 146, 322 180 S 404 216, 470 192 S 560 158, 614 184" />
              {/* an island passed on the way */}
              <path d="M92 374 C 118 346, 152 356, 178 342 S 214 366, 206 392 S 222 418, 200 434 S 168 430, 148 452 S 112 446, 104 424 S 78 414, 84 396 S 74 380, 92 374 Z" />
            </g>

            <g className="pc-hatch" fill="none">
              {HATCH.map((d, i) => (
                <path d={d} key={i} />
              ))}
            </g>

            {/* the plotted course */}
            <g className="pc-course">
              {DOTS.map(([x, y], i) => (
                <circle cx={x} cy={y} r="5" style={{ "--i": i }} key={i} />
              ))}
            </g>

            {/* where we set out from */}
            <g className="pc-start" transform="translate(108 252)">
              <circle r="14" fill="none" />
              <circle r="4.5" />
            </g>

            <g className="pc-rose" transform="translate(470 330)">
              <circle r="52" fill="none" />
              <circle r="34" fill="none" />
              <path d="M0 -70 L11 -12 L0 0 L-11 -12 Z" />
              <path d="M0 70 L11 12 L0 0 L-11 12 Z" />
              <path d="M70 0 L12 11 L0 0 L12 -11 Z" />
              <path d="M-70 0 L-12 11 L0 0 L-12 -11 Z" />
              <path d="M40 -40 L8 -8 L14 -22 Z" />
              <path d="M-40 40 L-8 8 L-14 22 Z" />
              <path d="M40 40 L8 8 L22 14 Z" />
              <path d="M-40 -40 L-8 -8 L-22 -14 Z" />
            </g>

            {/* the cross, at the course's final dot. The translate lives on the
                outer group and the animation on the inner one — a CSS transform
                on the same element would replace the translate and fling the
                cross to the origin. */}
            <g transform="translate(286 834)">
              <g className="pc-x-in">
                <path d="M-26 -26 L26 26" />
                <path d="M26 -26 L-26 26" />
              </g>
            </g>

            <g className="pc-marks" fill="none">
              {SOUNDINGS.map(([x, y], i) => (
                <path d={`M${x - 7} ${y} L${x + 7} ${y} M${x} ${y - 7} L${x} ${y + 7}`} key={i} />
              ))}
            </g>
          </g>
        </svg>

        {/* ---- the destination, in the corner ---- */}
        <div className="pc-markwrap">
          <div className="pc-markbox">
            <div className="pc-mark">
              <div className="pc-layer pc-bleed" aria-hidden />
              <div className="pc-region pc-ink" aria-hidden />
              <div className="pc-region pc-face" aria-hidden />
              <div className="pc-region pc-code" aria-hidden />
              <div className="pc-layer pc-press" aria-hidden />
            </div>
          </div>

          {/* directly under the mark, in flow — see rule 2 at the top */}
          <div className="pc-type">
            <div className="pc-caption">{caption}</div>
            <div className="pc-rule" aria-hidden />
          </div>
        </div>

        <div className="pc-seal" aria-hidden>
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="76" filter="url(#pc-wax)" fill="url(#pc-waxfill)" />
          </svg>
          <span className="pc-seal-star" />
        </div>

        <div className="pc-burn" aria-hidden />
      </div>

      {/* the rolled dowel, riding the leading edge of the unroll */}
      <div className="pc-roller" aria-hidden>
        <span className="pc-roller-bar" />
      </div>

      <div className="pc-vignette" aria-hidden />
    </div>
  );
}

/* Hand-placed. No Math.random, or two takes of the same ad won't match. */
const HATCH = [
  "M14 196 L8 220", "M54 188 L48 214", "M96 202 L92 228", "M140 192 L136 218",
  "M186 184 L182 210", "M232 166 L230 192", "M278 160 L278 186", "M324 182 L324 208",
  "M370 202 L372 228", "M416 210 L418 236", "M462 196 L464 222", "M508 176 L510 202",
  "M554 168 L556 194",
];

const SOUNDINGS = [
  [96, 266], [188, 276], [268, 258], [352, 270], [438, 256], [520, 270],
  [72, 470], [356, 456], [560, 470],
  [64, 700], [396, 700], [520, 690], [92, 880], [128, 1010], [62, 1130],
];

function PiratesDefs() {
  return (
    <svg className="pc-defs" aria-hidden focusable="false">
      <defs>
        {/* quill: a hand-drawn line wobbles and the ink pools unevenly */}
        <filter id="pc-quill" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="11" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="G"
            result="d"
          />
          {/* chew tiny gaps into the stroke, the way a dry nib skips */}
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="3" result="g" />
          <feColorMatrix
            in="g"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.7 0 0 0 -0.06"
            result="gm"
          />
          <feComposite in="d" in2="gm" operator="out" />
        </filter>

        {/* wax: a poured blob has a ragged rim, never a clean circle */}
        <filter id="pc-wax" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="19" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <radialGradient id="pc-waxfill" cx="40%" cy="34%" r="74%">
          <stop offset="0%" stopColor="#e83a4a" />
          <stop offset="46%" stopColor="#c0182c" />
          <stop offset="100%" stopColor="#710a18" />
        </radialGradient>
      </defs>
    </svg>
  );
}
