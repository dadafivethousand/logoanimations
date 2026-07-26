// Pirates.js — the mark as weathered treasure gold hung over a moonlit storm,
// with a galleon under tattered sail on the horizon.
//
// Genre, not franchise: no studio marks, no character likenesses, no film
// typeface. The recognisable pirate read comes from the silhouette — square-
// rigged galleon, ragged sails, rigging lines, a low moon and a running sea.
//
// IMPORTANT — the mark is not one shape. The Code Ninjas lockup is three tonal
// regions: the black hood and "NINJAS", the skin-tone band across the eyes, and
// "CODE" in blue. useLogo publishes a mask per region (--logo-dark,
// --logo-light, --logo-accent) precisely so a theme can give each one its own
// metal. Masking by --logo alone flattens the lockup and the ninja loses his
// eyes — which is exactly what an earlier pass got wrong.
import React from "react";
import "../Stylesheets/Pirates.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 sea + moon · p2 the ship makes way · p3 the gold surfaces · p4 WOODBRIDGE
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

      {/* ---- storm sky ---- */}
      <div className="pc-sky" aria-hidden />
      <div className="pc-moon" aria-hidden />
      <div className="pc-clouds" aria-hidden />

      {/* ---- the ship ---- */}
      <svg className="pc-ship" viewBox="0 0 600 420" aria-hidden>
        <g filter="url(#pc-tatter)" fill="#05080c">
          {/* hull */}
          <path d="M92 300 L516 300 L472 352 Q300 380 128 352 Z" />
          {/* stern castle */}
          <path d="M96 300 L96 258 L168 258 L168 300 Z" />
          {/* bowsprit */}
          <path d="M508 302 L590 268 L594 280 L512 312 Z" />
          {/* masts */}
          <rect x="196" y="76" width="11" height="228" />
          <rect x="300" y="40" width="12" height="264" />
          <rect x="404" y="96" width="10" height="208" />
          {/* yards */}
          <rect x="150" y="118" width="104" height="7" />
          <rect x="246" y="86" width="120" height="8" />
          <rect x="358" y="136" width="100" height="7" />
          {/* square sails, bellied and torn along the foot */}
          <path d="M154 124 Q200 150 250 124 L246 196 Q200 224 158 196 Z" />
          <path d="M250 92 Q306 122 362 92 L356 178 Q306 210 254 178 Z" />
          <path d="M360 142 Q406 166 456 142 L452 206 Q406 232 364 206 Z" />
          {/* lower courses, more ragged */}
          <path d="M158 210 Q200 236 246 210 L242 262 Q200 286 162 262 Z" />
          <path d="M256 194 Q306 224 356 194 L350 258 Q306 286 260 258 Z" />
          {/* flag */}
          <path d="M312 44 L372 56 L336 68 L372 80 L312 78 Z" />
        </g>
        {/* rigging — thin enough to read as line, not shape */}
        <g stroke="#070b11" strokeWidth="2.2" fill="none" opacity="0.95">
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
        <span className="pc-glitter" />
        <svg viewBox="0 0 1000 360" preserveAspectRatio="none">
          <g filter="url(#pc-swell)" fill="none" strokeLinecap="round">
            <path className="pc-wave" d="M-20 60 C 170 34, 330 84, 520 56 S 860 26, 1020 66" />
            <path className="pc-wave" d="M-20 132 C 200 104, 360 154, 540 124 S 870 96, 1020 138" />
            <path className="pc-wave" d="M-20 214 C 170 186, 350 236, 530 204 S 880 176, 1020 218" />
            <path className="pc-wave" d="M-20 300 C 210 270, 380 320, 560 288 S 890 260, 1020 304" />
          </g>
        </svg>
      </div>
      <div className="pc-spray" aria-hidden />

      {/* ---- the mark ---- */}
      <div className="pc-markwrap">
        <div className="pc-bloom" aria-hidden />

        <div className="pc-mark">
          {/* chamfer chain wraps the painted layers so its rims follow the
              letterforms, not the bounding box */}
          <div className="pc-plate" aria-hidden>
            {/* base bullion across the whole lockup */}
            <div className="pc-layer pc-gold" />

            {/* the eye band and face, in pale silvered gold so the ninja keeps
                his eyes instead of dissolving into the hood */}
            <div className="pc-region pc-face" />

            {/* "CODE" in a cooler, brighter metal, holding the two-tone lockup */}
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

      {/* ---- type: the logo already says CODE NINJAS ---- */}
      <div className="pc-type">
        <div className="pc-caption">{caption}</div>
        <div className="pc-rule" aria-hidden />
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
          <feTurbulence type="fractalNoise" baseFrequency="0.013 0.04" numOctaves="3" seed="5" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="26"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
