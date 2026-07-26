// Pirates.js — the mark in treasure gold against a blood-red storm, with a
// square-rigged galleon under crimson sail crossing the moon.
//
// Genre, not franchise: no studio marks, no character likenesses, no film
// typeface. The recognisable read comes from the silhouette and the grade —
// crimson and black against gold.
//
// TWO STRUCTURAL RULES, both learned the hard way:
//
// 1. The mark is NOT one shape. The lockup is three tonal regions: the black
//    hood and "NINJAS", the skin-tone band across the EYES, and "CODE" in blue.
//    useLogo publishes a mask per region so each can take its own metal. Mask by
//    --logo alone and the ninja loses his eyes.
//
// 2. WOODBRIDGE lives INSIDE the mark wrapper, directly after the mark — never
//    positioned independently. Absolute placement drifted it halfway down the
//    frame; as a sibling in normal flow it is welded under the logo and the pair
//    centre together as one lockup.
import React from "react";
import "../Stylesheets/Pirates.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 storm + moon · p2 the ship makes way · p3 the gold surfaces · p4 WOODBRIDGE
const CUES = [200, 700, 1400, 2300];

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

      {/* ---- blood-red storm ---- */}
      <div className="pc-sky" aria-hidden />
      <div className="pc-moon" aria-hidden />
      <div className="pc-clouds" aria-hidden />
      <div className="pc-embers" aria-hidden />

      {/* ---- the ship ---- */}
      <svg className="pc-ship" viewBox="0 0 600 420" aria-hidden>
        {/* hull, masts and rigging stay near-black; only the canvas takes red */}
        <g filter="url(#pc-tatter)">
          <g fill="#0a0507">
            <path d="M92 300 L516 300 L472 352 Q300 380 128 352 Z" />
            <path d="M96 300 L96 258 L168 258 L168 300 Z" />
            <path d="M508 302 L590 268 L594 280 L512 312 Z" />
            <rect x="196" y="76" width="11" height="228" />
            <rect x="300" y="40" width="12" height="264" />
            <rect x="404" y="96" width="10" height="208" />
            <rect x="150" y="118" width="104" height="7" />
            <rect x="246" y="86" width="120" height="8" />
            <rect x="358" y="136" width="100" height="7" />
          </g>

          {/* square sails, bellied and torn along the foot */}
          <g fill="url(#pc-sailfill)">
            <path d="M154 124 Q200 150 250 124 L246 196 Q200 224 158 196 Z" />
            <path d="M250 92 Q306 122 362 92 L356 178 Q306 210 254 178 Z" />
            <path d="M360 142 Q406 166 456 142 L452 206 Q406 232 364 206 Z" />
            <path d="M158 210 Q200 236 246 210 L242 262 Q200 286 162 262 Z" />
            <path d="M256 194 Q306 224 356 194 L350 258 Q306 286 260 258 Z" />
          </g>

          {/* pennant */}
          <path d="M312 44 L372 56 L336 68 L372 80 L312 78 Z" fill="#8c1420" />
        </g>

        {/* rigging — thin enough to read as line, not shape */}
        <g stroke="#0a0507" strokeWidth="2.2" fill="none" opacity="0.95">
          <path d="M202 80 L120 296" />
          <path d="M202 80 L286 296" />
          <path d="M306 44 L212 300" />
          <path d="M306 44 L400 300" />
          <path d="M409 100 L330 300" />
          <path d="M409 100 L492 298" />
          <path d="M590 270 L306 48" />
        </g>
      </svg>

      {/* ---- running sea ---- */}
      <div className="pc-sea" aria-hidden>
        <svg viewBox="0 0 1000 360" preserveAspectRatio="none">
          {/* Many thin crests, not a few fat ones. Wide strokes plus heavy
              displacement read as drifting smoke; narrow, dense, mostly
              horizontal lines read as water. */}
          <g filter="url(#pc-swell)" fill="none" strokeLinecap="round">
            <path className="pc-wave" d="M-20 40 C 170 26, 330 56, 520 38 S 860 18, 1020 44" />
            <path className="pc-wave" d="M-20 72 C 220 56, 380 88, 560 68 S 880 48, 1020 76" />
            <path className="pc-wave" d="M-20 108 C 180 92, 340 124, 530 102 S 870 84, 1020 112" />
            <path className="pc-wave pc-wave-mid" d="M-20 150 C 210 132, 370 166, 550 144 S 890 124, 1020 154" />
            <path className="pc-wave pc-wave-mid" d="M-20 196 C 170 178, 350 212, 530 188 S 880 168, 1020 200" />
            <path className="pc-wave pc-wave-mid" d="M-20 244 C 220 224, 380 260, 560 236 S 900 214, 1020 248" />
            <path className="pc-wave pc-wave-lo" d="M-20 292 C 190 270, 360 308, 540 282 S 880 260, 1020 296" />
            <path className="pc-wave pc-wave-lo" d="M-20 340 C 230 316, 400 356, 580 328 S 910 306, 1020 344" />
          </g>
        </svg>
        {/* the moon's road on the water — the cue that fixes the light source */}
        <span className="pc-moonpath" />
        <span className="pc-glitter" />
      </div>
      <div className="pc-haze" aria-hidden />

      {/* ---- the lockup: mark + WOODBRIDGE, welded together ---- */}
      <div className="pc-markwrap">
        <div className="pc-markbox">
          <div className="pc-bloom" aria-hidden />

          <div className="pc-mark">
            {/* the chamfer chain wraps the painted layers so its rims follow
                the letterforms, not the bounding box */}
            <div className="pc-plate" aria-hidden>
              <div className="pc-layer pc-gold" />

              {/* the eye band, in pale silvered gold, so the ninja keeps his
                  eyes instead of dissolving into the hood */}
              <div className="pc-region pc-face" />

              {/* "CODE" in a cooler brighter metal, holding the two-tone lockup */}
              <div className="pc-region pc-code" />

              {/* verdigris: double-masked — logo outside, turbulence blotches
                  inside, so patina pools instead of washing */}
              <div className="pc-layer pc-patina">
                <span className="pc-patina-in" />
              </div>

              {/* corrosion pitting, multiplied into the metal */}
              <div className="pc-layer pc-pit" />
            </div>

            {/* gold's specular is tight, warm, and moves */}
            <div className="pc-layer pc-sheen" aria-hidden />
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

        {/* the canvas is lit from behind by the moon, so it glows at the top */}
        <linearGradient id="pc-sailfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#96202c" />
          <stop offset="46%" stopColor="#5e1017" />
          <stop offset="100%" stopColor="#25060a" />
        </linearGradient>
      </defs>
    </svg>
  );
}
