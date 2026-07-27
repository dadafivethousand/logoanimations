// Pirates.js — the ninja turned pirate: tricorn, eyepatch and gold hoop worn on
// the mark itself, against a moonlit sea with a galleon on the horizon.
//
// Genre, not franchise: no studio marks, no character likenesses, no film
// typeface. The read comes from the silhouette and the grade.
//
// THE GEAR IS MEASURED, NOT EYEBALLED. Everything worn on the head is placed in
// percentages of the mark box taken off the artwork's own pixels:
//
//     head      left 32.7%  top 0%     w 29.3%  h 46.3%
//     eye band  left 39.5%  top 22.1%  w 21.1%  h 10.7%
//
// The face gear sits in a box pinned to exactly those head bounds and draws in
// head-local coordinates, so the patch lands on an eye instead of near one. If
// the logo file is ever replaced, re-measure and update HEAD/BAND below.
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

// p1 sea + moon · p2 the galleon · p3 the mark surfaces · p4 he goes pirate
const CUES = [200, 800, 1500, 2300];

// measured off the artwork — see the note at the top
const HEAD = { left: "32.7%", top: "0%", width: "29.3%", height: "46.3%" };

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

      {/* ---- the night ---- */}
      <div className="pc-sky" aria-hidden />
      <div className="pc-moon" aria-hidden />
      <div className="pc-clouds" aria-hidden />

      {/* ---- galleon on the horizon, black against the moon ---- */}
      <svg className="pc-ship" viewBox="0 0 600 420" aria-hidden>
        <g filter="url(#pc-tatter)" fill="#05070a">
          <path d="M92 300 L516 300 L472 352 Q300 380 128 352 Z" />
          <path d="M96 300 L96 258 L168 258 L168 300 Z" />
          <path d="M508 302 L590 268 L594 280 L512 312 Z" />
          <rect x="196" y="76" width="11" height="228" />
          <rect x="300" y="40" width="12" height="264" />
          <rect x="404" y="96" width="10" height="208" />
          <rect x="150" y="118" width="104" height="7" />
          <rect x="246" y="86" width="120" height="8" />
          <rect x="358" y="136" width="100" height="7" />
          <path d="M154 124 Q200 150 250 124 L246 196 Q200 224 158 196 Z" />
          <path d="M250 92 Q306 122 362 92 L356 178 Q306 210 254 178 Z" />
          <path d="M360 142 Q406 166 456 142 L452 206 Q406 232 364 206 Z" />
          <path d="M158 210 Q200 236 246 210 L242 262 Q200 286 162 262 Z" />
          <path d="M256 194 Q306 224 356 194 L350 258 Q306 286 260 258 Z" />
          <path d="M312 44 L372 56 L336 68 L372 80 L312 78 Z" />
        </g>
        <g stroke="#05070a" strokeWidth="2.2" fill="none" opacity="0.95">
          <path d="M202 80 L120 296" />
          <path d="M202 80 L286 296" />
          <path d="M306 44 L212 300" />
          <path d="M306 44 L400 300" />
          <path d="M409 100 L330 300" />
          <path d="M409 100 L492 298" />
          <path d="M590 270 L306 48" />
        </g>
      </svg>

      {/* ---- the sea ---- */}
      <div className="pc-sea" aria-hidden>
        <svg viewBox="0 0 1000 360" preserveAspectRatio="none">
          <g filter="url(#pc-swell)" fill="none" strokeLinecap="round">
            <path className="pc-wave" d="M-20 40 C 170 26, 330 56, 520 38 S 860 18, 1020 44" />
            <path className="pc-wave" d="M-20 76 C 220 58, 380 90, 560 70 S 880 50, 1020 78" />
            <path className="pc-wave pc-wave-mid" d="M-20 120 C 180 100, 340 134, 530 110 S 870 92, 1020 122" />
            <path className="pc-wave pc-wave-mid" d="M-20 172 C 210 150, 370 186, 550 162 S 890 142, 1020 174" />
            <path className="pc-wave pc-wave-lo" d="M-20 232 C 170 208, 350 246, 530 220 S 880 200, 1020 234" />
            <path className="pc-wave pc-wave-lo" d="M-20 296 C 220 270, 390 310, 570 282 S 900 262, 1020 300" />
          </g>
        </svg>
        <span className="pc-moonpath" />
      </div>
      <div className="pc-haze" aria-hidden />

      {/* ---- the pirate ninja ---- */}
      <div className="pc-markwrap">
        <div className="pc-markbox">
          <div className="pc-bloom" aria-hidden />

          <div className="pc-mark">
            <div className="pc-plate" aria-hidden>
              <div className="pc-layer pc-gold" />
              {/* the eye band, so he keeps his eyes */}
              <div className="pc-region pc-face" />
              {/* "CODE" in a cooler, brighter metal */}
              <div className="pc-region pc-code" />
              <div className="pc-layer pc-pit" />
            </div>
            <div className="pc-layer pc-sheen" aria-hidden />

            {/* --- the tricorn, dropped onto the crown --- */}
            <div className="pc-hat" aria-hidden>
              <svg viewBox="0 0 400 190">
                {/* A tricorn, not a mortarboard: the brim sweeps UP at both
                    corners and the crown rises between them. A flat wide arc
                    reads as a graduation cap every time. */}
                <g className="pc-hat-felt">
                  <path d="M10 146 C 26 104, 62 72, 108 58 C 132 22, 174 6, 200 6 C 226 6, 268 22, 292 58 C 338 72, 374 104, 390 146 C 344 124, 292 112, 200 112 C 108 112, 56 124, 10 146 Z" />
                </g>
                <path className="pc-hat-band" d="M104 84 C 140 62, 260 62, 296 84 C 258 74, 142 74, 104 84 Z" />
                {/* cockade */}
                <circle className="pc-hat-band" cx="300" cy="78" r="13" />
              </svg>
            </div>

            {/* --- eyepatch + strap, drawn in head-local coordinates --- */}
            <div className="pc-facegear" style={HEAD} aria-hidden>
              <svg viewBox="0 0 293 463" preserveAspectRatio="none">
                {/* the strap crosses the whole head; it only really reads where
                    it passes over the light eye band, which is correct */}
                {/* Two straps running off the patch to the sides of the head,
                    rather than one bar across the face — a single band would
                    cross his good eye and read as a stick through his head. */}
                <path className="pc-strap" d="M112 262 L -8 230" />
                <path className="pc-strap" d="M150 250 L 268 176" />
                {/* patch over his left eye — the band runs x 68–279, y 221–328,
                    so the left eye sits around x 118 */}
                <ellipse className="pc-patch" cx="118" cy="270" rx="62" ry="54" />
                <ellipse className="pc-patch-hi" cx="100" cy="252" rx="22" ry="15" />
              </svg>
            </div>

            {/* --- gold hoop, at the jaw --- */}
            <div className="pc-earring" aria-hidden>
              <svg viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="20" />
              </svg>
            </div>
          </div>
        </div>

        {/* directly under the mark, in flow — see rule 2 at the top */}
        <div className="pc-type">
          <div className="pc-caption">{caption}</div>
          <div className="pc-rule" aria-hidden />
        </div>
      </div>

      <div className="pc-film" aria-hidden />
      <div className="pc-vignette" aria-hidden />
    </div>
  );
}

function PiratesDefs() {
  return (
    <svg className="pc-defs" aria-hidden focusable="false">
      <defs>
        {/* tatter: chew the sail edges so they read as canvas, not geometry */}
        <filter id="pc-tatter" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" seed="7" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="9"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* swell: shove the wave lines around so they stop reading as arcs */}
        <filter id="pc-swell" x="-15%" y="-40%" width="130%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016 0.05" numOctaves="3" seed="5" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="11"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
