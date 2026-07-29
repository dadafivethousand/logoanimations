// Hulk.js — CODE NINJAS WOODBRIDGE, set in hulk lettering. Nothing else.
//
// Genre, not franchise: gamma green, cracked stone-heavy type. No studio marks,
// no character, no film typeface.
//
// NO FACE, NO LOGO FILE. The type IS the theme, so it has to carry the whole
// idea on its own. What makes lettering read as "hulk" rather than as a bold
// system font:
//
//   mass        very heavy, tightly tracked, stretched slightly taller
//   depth       a stack of copies offset downward — a real extrusion, not a
//               drop-shadow, so the letters have a side you can see
//   damage      cracks running through the faces, clipped to the glyphs
//   rough       one displacement filter over the lot, because a machine-clean
//               edge is the single thing that gives away a system font
//
// textLength + lengthAdjust pins both lines to an exact width, so the layout
// holds whatever font the device actually falls back to.
import React from "react";
import "../Stylesheets/Hulk.css";
import usePhases from "../Utils/usePhases";

// p1 cold · p2 the change · p3 the hit · p4 the name
const CUES = [200, 800, 1700, 2300];

/* The extrusion: one copy per unit of depth. Drawn back-to-front. */
const DEPTH = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

/* Cracks across the brand line, clipped to the glyphs so they only ever show
   ON the letters. Hand-drawn rather than generated — eight lines is few enough
   that placing them beats seeding a walk. */
const CRACKS = [
  "M18 62 L54 78 L48 96 L86 108",
  "M132 54 L150 74 L138 92 L164 112",
  "M214 58 L236 80 L222 100 L252 118",
  "M296 50 L312 72 L300 90 L330 106",
  "M372 60 L392 78 L378 98 L408 114",
  "M448 52 L462 76 L450 94 L478 110",
  "M520 62 L540 82 L526 100 L556 116",
  "M76 66 L96 88 L84 104",
];

export default function Hulk({
  mode = "animated",
  brand = "CODE NINJAS",
  caption = "WOODBRIDGE",
  loopAt = 7600,
}) {
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt });

  return (
    <div className={`hk hk-p${phase} ${isStatic ? "is-static" : ""}`} key={run}>
      <div className="hk-void" aria-hidden />
      <div className="hk-bloom" aria-hidden />

      <div className="hk-shake">
        <div className="hk-stage">
          <svg className="hk-lock" viewBox="0 0 600 210" aria-label={`${brand} ${caption}`}>
            <defs>
              {/* the one thing that stops heavy system type reading as heavy
                  system type */}
              <filter id="hk-rough" x="-8%" y="-14%" width="116%" height="128%">
                <feTurbulence type="fractalNoise" baseFrequency="0.022 0.05" numOctaves="3" seed="9" result="n" />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="n"
                  scale="4.5"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>

              {/* the face is lit from above and falls into deep green */}
              <linearGradient id="hk-face" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d6ff8f" />
                <stop offset="26%" stopColor="#8bff3a" />
                <stop offset="62%" stopColor="#4fbb22" />
                <stop offset="100%" stopColor="#2b7d15" />
              </linearGradient>
              <linearGradient id="hk-face2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eaffc9" />
                <stop offset="48%" stopColor="#9dff55" />
                <stop offset="100%" stopColor="#57c327" />
              </linearGradient>

              {/* the extruded side, darkening as it goes back */}
              <linearGradient id="hk-side" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1f6b12" />
                <stop offset="100%" stopColor="#07230a" />
              </linearGradient>

              {/* cracks are clipped to the glyphs — a crack crossing the gap
                  between two letters is a line drawn over a picture, not
                  damage to the letters */}
              <clipPath id="hk-brandclip">
                <text
                  className="hk-t hk-t-brand"
                  x="300"
                  y="100"
                  textAnchor="middle"
                  textLength="576"
                  lengthAdjust="spacingAndGlyphs"
                >
                  {brand}
                </text>
              </clipPath>
            </defs>

            <g filter="url(#hk-rough)">
              {/* ---- CODE NINJAS ---- */}
              <g className="hk-brand">
                {DEPTH.map((d) => (
                  <text
                    key={d}
                    className="hk-t hk-t-brand hk-ext"
                    x="300"
                    y={100 + d}
                    textAnchor="middle"
                    textLength="576"
                    lengthAdjust="spacingAndGlyphs"
                  >
                    {brand}
                  </text>
                ))}
                <text
                  className="hk-t hk-t-brand hk-out"
                  x="300"
                  y="100"
                  textAnchor="middle"
                  textLength="576"
                  lengthAdjust="spacingAndGlyphs"
                >
                  {brand}
                </text>
                <text
                  className="hk-t hk-t-brand hk-face"
                  x="300"
                  y="100"
                  textAnchor="middle"
                  textLength="576"
                  lengthAdjust="spacingAndGlyphs"
                >
                  {brand}
                </text>

                <g className="hk-cracks" clipPath="url(#hk-brandclip)">
                  {CRACKS.map((d, i) => (
                    <path d={d} pathLength="100" style={{ "--i": i }} key={i} />
                  ))}
                </g>
              </g>

              {/* ---- WOODBRIDGE ---- */}
              <g className="hk-caption">
                {DEPTH.slice(5).map((d) => (
                  <text
                    key={d}
                    className="hk-t hk-t-cap hk-ext"
                    x="300"
                    y={166 + d}
                    textAnchor="middle"
                    textLength="470"
                    lengthAdjust="spacingAndGlyphs"
                  >
                    {caption}
                  </text>
                ))}
                <text
                  className="hk-t hk-t-cap hk-out"
                  x="300"
                  y="166"
                  textAnchor="middle"
                  textLength="470"
                  lengthAdjust="spacingAndGlyphs"
                >
                  {caption}
                </text>
                <text
                  className="hk-t hk-t-cap hk-face2"
                  x="300"
                  y="166"
                  textAnchor="middle"
                  textLength="470"
                  lengthAdjust="spacingAndGlyphs"
                >
                  {caption}
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>

      <div className="hk-wave" aria-hidden />
      <div className="hk-flash" aria-hidden />
      <div className="hk-grain" aria-hidden />
      <div className="hk-vignette" aria-hidden />
    </div>
  );
}
