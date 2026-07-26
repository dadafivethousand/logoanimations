// Pirates.js — the mark inked onto an old treasure map: aged parchment with
// burnt ragged edges, hand-drawn coastlines, a dashed route that ends at the
// logo, a compass rose, and a red wax seal.
//
// Genre, not franchise: no studio marks, no character likenesses, no film
// typeface.
//
// The mark is INK, not metal. It's masked in sepia and multiplied over the
// paper so the fibre and stains show through the letterforms, with a blurred
// copy underneath for the bleed into the fibres. Metal would sit on top of the
// parchment and instantly look pasted on.
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

// p1 parchment · p2 coastlines drawn · p3 route + compass · p4 mark, seal, type
const CUES = [200, 800, 1500, 2300];

export default function Pirates({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = 8000,
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

      {/* ---- the sheet ---- */}
      <div className="pc-page" aria-hidden>
        <span className="pc-fibre" />
        <span className="pc-stains" />
        <span className="pc-folds" />
        <span className="pc-scorch" />
      </div>

      {/* ---- what's drawn on it ---- */}
      <svg className="pc-map" viewBox="0 0 600 1200" preserveAspectRatio="none" aria-hidden>
        <g filter="url(#pc-quill)">
          {/* coastlines */}
          <g className="pc-coast" fill="none">
            <path d="M-10 208 C 70 190, 118 236, 176 214 S 268 176, 322 210 S 404 250, 470 222 S 560 186, 614 214" />
            <path d="M-10 980 C 78 1002, 130 958, 196 982 S 300 1022, 366 992 S 470 950, 540 978 S 596 996, 614 986" />
            {/* an island the route runs past */}
            <path d="M92 374 C 118 346, 152 356, 178 342 S 214 366, 206 392 S 222 418, 200 434 S 168 430, 148 452 S 112 446, 104 424 S 78 414, 84 396 S 74 380, 92 374 Z" />
            <path d="M446 702 C 468 682, 498 690, 520 680 S 544 704, 536 724 S 546 748, 526 758 S 498 754, 482 770 S 452 762, 446 744 S 430 734, 436 718 S 430 706, 446 702 Z" />
          </g>

          {/* sea hatching — short parallel strokes off each coast */}
          <g className="pc-hatch" fill="none">
            {HATCH.map((d, i) => (
              <path d={d} key={i} />
            ))}
          </g>

          {/* the route: dashes, a bearing turn, and an X on the mark */}
          <g className="pc-route" fill="none">
            <path d="M150 470 C 108 546, 176 578, 214 620 S 268 690, 258 742 S 276 812, 298 844" />
          </g>

          {/* compass rose */}
          <g className="pc-rose" transform="translate(478 342)">
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

          {/* soundings — the little depth crosses maps are covered in */}
          <g className="pc-marks" fill="none">
            {SOUNDINGS.map(([x, y], i) => (
              <path d={`M${x - 7} ${y} L${x + 7} ${y} M${x} ${y - 7} L${x} ${y + 7}`} key={i} />
            ))}
          </g>
        </g>
      </svg>

      {/* ---- the lockup: mark + WOODBRIDGE, welded together ---- */}
      <div className="pc-markwrap">
        <div className="pc-markbox">
          {/* the X, drawn behind and through the mark */}
          <span className="pc-x" aria-hidden>
            <svg viewBox="0 0 200 200" aria-hidden>
              <g filter="url(#pc-quill)" fill="none">
                <path d="M28 26 L172 174" />
                <path d="M172 26 L28 174" />
              </g>
            </svg>
          </span>

          <div className="pc-mark">
            {/* ink bleeding into the fibres, under everything else */}
            <div className="pc-layer pc-bleed" aria-hidden />

            {/* the hood, "NINJAS" and the EYE SLITS: sepia ink, multiplied so
                the paper grain reads straight through the letterforms */}
            <div className="pc-region pc-ink" aria-hidden />

            {/* the eye band: barely-touched paper, a wash rather than ink, so
                the slits inside it stay legible */}
            <div className="pc-region pc-face" aria-hidden />

            {/* "CODE" in faded red ink — the map's second pigment */}
            <div className="pc-region pc-code" aria-hidden />

            {/* the whole lockup very slightly pressed into the sheet */}
            <div className="pc-layer pc-press" aria-hidden />
          </div>
        </div>

        {/* directly under the mark, in flow — see rule 2 at the top */}
        <div className="pc-type">
          <div className="pc-caption">{caption}</div>
          <div className="pc-rule" aria-hidden />
        </div>
      </div>

      {/* ---- red wax seal ---- */}
      <div className="pc-seal" aria-hidden>
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="76" filter="url(#pc-wax)" fill="url(#pc-waxfill)" />
        </svg>
        <span className="pc-seal-star" />
      </div>

      <div className="pc-burn" aria-hidden />
      <div className="pc-vignette" aria-hidden />
    </div>
  );
}

/* Hand-placed. No Math.random, or two takes of the same ad won't match. */
const HATCH = [
  "M14 226 L8 250", "M54 218 L48 244", "M96 232 L92 258", "M140 222 L136 248",
  "M186 214 L182 240", "M232 196 L230 222", "M278 190 L278 216", "M324 212 L324 238",
  "M370 232 L372 258", "M416 240 L418 266", "M462 226 L464 252", "M508 206 L510 232",
  "M554 198 L556 224", "M22 962 L16 938", "M68 972 L64 948", "M114 962 L110 938",
  "M160 976 L158 952", "M206 990 L206 966", "M252 1004 L254 980", "M298 1012 L300 988",
  "M344 1002 L346 978", "M390 984 L392 960", "M436 966 L438 942", "M482 954 L484 930",
  "M528 962 L530 938", "M574 976 L576 952",
];

const SOUNDINGS = [
  [96, 296], [188, 306], [268, 288], [352, 300], [438, 286], [520, 300],
  [72, 470], [268, 470], [356, 456], [560, 470],
  [88, 852], [176, 866], [264, 852], [352, 866], [440, 852], [528, 866],
  [130, 640], [470, 660],
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
