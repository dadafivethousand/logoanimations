// Hulk.js — the mark has come through a concrete wall, and gamma light is
// pouring out of the cracks behind it.
//
// Genre, not franchise: cracked concrete, gamma green and blast dust — no
// studio marks, no character likeness, no film typeface.
//
// THE MARK KEEPS ITS OWN COLOURS. It is drawn as itself, rimmed by the green
// light behind it rather than repainted green — the wall carries the theme.
//
// WOODBRIDGE lives INSIDE the mark wrapper, directly after the mark, so the name
// cannot drift away from the logo.
import React from "react";
import "../Stylesheets/Hulk.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 the wall · p2 the impact · p3 the gamma comes up through the cracks
// · p4 the name
const CUES = [200, 750, 1450, 2150];

/* Generated: eleven runs out from the point of impact, each wandering as it
   goes, plus branches leaving them partway along. Hardcoded rather than
   computed at runtime — cracks that reshuffle between takes would mean two
   recordings of the same ad never match. */
const CRACKS = [
  "M300.0 300.0 L337.0 288.2 L366.5 270.8 L392.2 262.7 L418.9 246.8 L444.9 225.7 L465.3 198.6 L492.6 176.5",
  "M300.0 300.0 L350.2 319.6 L397.2 339.9 L441.9 359.1 L481.5 384.0 L512.1 415.3 L542.7 438.9",
  "M300.0 300.0 L310.9 350.2 L322.6 387.6 L337.9 436.0 L354.8 463.9 L384.9 501.5 L423.9 531.4 L462.4 554.8",
  "M300.0 300.0 L296.0 332.5 L284.7 368.1 L278.1 403.9 L268.1 452.2 L264.4 487.8",
  "M300.0 300.0 L283.0 321.6 L266.4 351.6 L240.6 391.0 L218.9 420.3 L203.8 453.9 L180.5 482.1",
  "M300.0 300.0 L246.6 301.4 L200.2 309.8 L167.8 318.4 L132.8 338.7 L91.6 370.5",
  "M300.0 300.0 L233.3 269.2 L183.2 249.5 L130.4 211.5 L90.2 192.6 L21.2 175.3",
  "M300.0 300.0 L271.6 273.8 L232.0 237.1 L193.8 208.1 L170.7 182.6 L138.1 134.9",
  "M300.0 300.0 L289.2 232.5 L284.9 189.1 L273.0 136.9 L270.2 83.5 L259.9 30.5 L261.0 -36.4",
  "M300.0 300.0 L325.5 272.1 L361.2 248.8 L410.2 216.3 L443.6 202.2 L485.1 182.8",
  "M300.0 300.0 L331.8 274.1 L369.1 235.1 L400.4 187.9 L414.7 158.7 L423.6 120.6 L434.4 84.0 L439.9 49.1",
];

const BRANCHES = [
  "M465.3 198.6 L485.0 193.4 L504.8 181.9 L524.8 175.6",
  "M397.2 339.9 L433.5 382.3 L467.7 405.4 L492.2 429.4 L514.7 451.1",
  "M354.8 463.9 L344.5 493.4 L336.6 516.3 L330.5 549.2 L326.4 585.6",
  "M384.9 501.5 L406.0 531.4 L415.4 556.3 L426.8 582.0 L432.7 620.7",
  "M278.1 403.9 L260.9 418.4 L247.2 439.5 L238.2 465.6 L237.7 486.9",
  "M266.4 351.6 L263.0 383.9 L260.3 407.7 L249.1 432.0 L229.6 462.8",
  "M218.9 420.3 L214.2 444.5 L214.2 472.1 L214.2 501.3 L211.7 532.8",
  "M167.8 318.4 L140.6 307.9 L112.1 300.4 L85.9 282.6",
  "M200.2 309.8 L186.3 292.1 L164.0 267.9 L134.6 247.1",
  "M90.2 192.6 L66.3 167.5 L53.7 149.1 L44.1 128.2",
  "M170.7 182.6 L133.8 168.1 L98.2 150.9 L72.1 145.5",
  "M170.7 182.6 L149.8 176.1 L126.9 167.8 L94.1 161.5 L64.9 155.8",
  "M259.9 30.5 L237.9 17.1 L205.4 8.9 L171.3 -7.4 L137.7 -14.4",
  "M410.2 216.3 L410.9 193.1 L410.7 177.2 L407.6 153.2 L405.6 136.8",
  "M361.2 248.8 L366.7 228.3 L373.7 195.1 L383.5 173.9",
  "M414.7 158.7 L442.4 145.9 L476.9 141.5 L497.9 135.1",
];

/* Dust thrown off the impact. Hand-placed for the same reason. */
const DUST = [
  [18, 34, 0.9, "0ms"], [31, 22, 0.6, "180ms"], [44, 40, 1.2, "60ms"],
  [58, 26, 0.7, "240ms"], [70, 44, 1.0, "120ms"], [83, 30, 0.6, "300ms"],
  [12, 58, 0.8, "340ms"], [37, 66, 1.1, "90ms"], [63, 62, 0.7, "260ms"],
  [88, 56, 0.9, "150ms"], [26, 48, 0.5, "400ms"], [76, 70, 0.8, "210ms"],
];

export default function Hulk({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = 7500,
}) {
  const { src, logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="hk hk-p0" aria-hidden />;

  return (
    <div className={`hk hk-p${phase} ${isStatic ? "is-static" : ""}`} style={logoVar} key={run}>
      <HulkDefs />

      {/* ---- the wall ---- */}
      <div className="hk-wall" aria-hidden />
      <div className="hk-aggregate" aria-hidden />

      {/* everything the impact rattles */}
      <div className="hk-shake">
        {/* the cracks are drawn twice: once fat and green underneath for the
            light coming through them, once dark and thin on top for the crack
            itself. One pass alone reads as a green scribble. */}
        <svg className="hk-cracks" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <g className="hk-gamma">
            {CRACKS.map((d, i) => (
              <path d={d} pathLength="100" style={{ "--i": i }} key={i} />
            ))}
            {BRANCHES.map((d, i) => (
              <path d={d} pathLength="100" style={{ "--i": i + 4 }} key={`b${i}`} />
            ))}
          </g>
          <g className="hk-fissure">
            {CRACKS.map((d, i) => (
              <path d={d} pathLength="100" style={{ "--i": i }} key={i} />
            ))}
            {BRANCHES.map((d, i) => (
              <path d={d} pathLength="100" style={{ "--i": i + 4 }} key={`b${i}`} />
            ))}
          </g>
        </svg>

        {/* the gamma pouring out of the hole */}
        <div className="hk-core" aria-hidden />
        <div className="hk-flash" aria-hidden />

        {/* ---- the mark ---- */}
        <div className="hk-markwrap">
          <div className="hk-markbox">
            <div className="hk-mark">
              <img className="hk-logo" src={src} alt="Code Ninjas" />
            </div>
          </div>
          <div className="hk-type">
            <div className="hk-caption">{caption}</div>
          </div>
        </div>
      </div>

      {/* dust thrown up by the hit */}
      <div className="hk-dust" aria-hidden>
        {DUST.map(([l, t, s, d], i) => (
          <span
            key={i}
            style={{ left: `${l}%`, top: `${t}%`, "--s": s, "--d": d }}
          />
        ))}
      </div>

      <div className="hk-grain" aria-hidden />
      <div className="hk-vignette" aria-hidden />
    </div>
  );
}

function HulkDefs() {
  return (
    <svg className="hk-defs" aria-hidden focusable="false">
      <defs>
        {/* concrete does not crack in clean lines: the edges are chipped */}
        <filter id="hk-chip" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="13" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="3.4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
