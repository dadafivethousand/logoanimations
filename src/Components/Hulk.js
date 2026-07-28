// Hulk.js — a slab of cement with the mark cut into it is dropped, and the
// floor splits where it lands.
//
// Genre, not franchise: gamma green, cement and blast dust — no studio marks,
// no character likeness, no film typeface.
//
// THE NINJA IS THE HULK. This is the one theme that deliberately recolours the
// mark, because "the ninja is a hulk" IS the brief — the theme cannot live on
// the background alone. It is repainted by REGION rather than tinted as a
// whole, using the masks useLogo derives from the artwork's own tones:
//
//   --logo-light   the band across his eyes — his skin, so it takes the
//                  brightest gamma green
//   --logo-dark    the hood and "NINJAS" — deep green-black
//   --logo-accent  "CODE" — mid gamma green
//
// Tinting the whole lockup one flat green instead would lose the two-tone and
// flatten his face into the hood.
//
// CRACKS ARE NOT GREEN. The floor splits in plain dark fissures; the gamma
// belongs to the mark and to the light it throws, not to broken cement.
import React from "react";
import "../Stylesheets/Hulk.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 the floor · p2 the slab falls · p3 impact: the floor splits · p4 the name
const CUES = [200, 700, 1250, 2000];

/* Generated once and hardcoded: cracks that reshuffle between takes would mean
   two recordings of the same ad never match. They run out from where the slab
   lands, which is the bottom centre of the frame — hence a half-fan rather than
   a full radial burst. */
const CRACKS = [
  "M300.0 300.0 L337.0 288.2 L366.5 270.8 L392.2 262.7 L418.9 246.8 L444.9 225.7 L465.3 198.6 L492.6 176.5",
  "M300.0 300.0 L350.2 319.6 L397.2 339.9 L441.9 359.1 L481.5 384.0 L512.1 415.3 L542.7 438.9",
  "M300.0 300.0 L310.9 350.2 L322.6 387.6 L337.9 436.0 L354.8 463.9 L384.9 501.5 L423.9 531.4",
  "M300.0 300.0 L296.0 332.5 L284.7 368.1 L278.1 403.9 L268.1 452.2 L264.4 487.8",
  "M300.0 300.0 L283.0 321.6 L266.4 351.6 L240.6 391.0 L218.9 420.3 L203.8 453.9 L180.5 482.1",
  "M300.0 300.0 L246.6 301.4 L200.2 309.8 L167.8 318.4 L132.8 338.7 L91.6 370.5",
  "M300.0 300.0 L233.3 269.2 L183.2 249.5 L130.4 211.5 L90.2 192.6 L21.2 175.3",
  "M300.0 300.0 L325.5 272.1 L361.2 248.8 L410.2 216.3 L443.6 202.2 L485.1 182.8",
];

const BRANCHES = [
  "M465.3 198.6 L485.0 193.4 L504.8 181.9 L524.8 175.6",
  "M397.2 339.9 L433.5 382.3 L467.7 405.4 L492.2 429.4 L514.7 451.1",
  "M354.8 463.9 L344.5 493.4 L336.6 516.3 L330.5 549.2",
  "M278.1 403.9 L260.9 418.4 L247.2 439.5 L238.2 465.6 L237.7 486.9",
  "M266.4 351.6 L263.0 383.9 L260.3 407.7 L249.1 432.0 L229.6 462.8",
  "M167.8 318.4 L140.6 307.9 L112.1 300.4 L85.9 282.6",
  "M200.2 309.8 L186.3 292.1 L164.0 267.9 L134.6 247.1",
  "M410.2 216.3 L410.9 193.1 L410.7 177.2 L407.6 153.2",
];

/* Chunks knocked out of the floor: [left %, offset from the impact line, width,
   rotation]. Hand-placed for the same reason. */
const RUBBLE = [
  [7, 2.4, 5.5, -14], [16, -0.6, 3.2, 9], [26, 3.1, 4.4, 22],
  [37, 1.2, 2.6, -8], [58, 1.6, 3.0, 16], [69, -0.4, 4.8, -21],
  [79, 2.8, 3.6, 5], [90, 0.8, 5.2, 12],
];

/* Dust kicked out by the landing. Hand-placed for the same reason. */
const DUST = [
  [10, 0.9, "0ms", "-14vw"], [22, 0.6, "70ms", "-9vw"], [34, 1.2, "30ms", "-6vw"],
  [46, 0.7, "110ms", "-3vw"], [56, 1.0, "50ms", "3vw"], [68, 0.6, "140ms", "7vw"],
  [80, 0.9, "20ms", "11vw"], [90, 0.8, "90ms", "15vw"],
  [16, 0.5, "180ms", "-11vw"], [40, 0.8, "160ms", "-4vw"],
  [62, 0.7, "200ms", "5vw"], [86, 0.6, "130ms", "13vw"],
];

export default function Hulk({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = 7500,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="hk hk-p0" aria-hidden />;

  return (
    <div className={`hk hk-p${phase} ${isStatic ? "is-static" : ""}`} style={logoVar} key={run}>
      <HulkDefs />

      {/* ---- the room ---- */}
      <div className="hk-room" aria-hidden />
      <div className="hk-floor" aria-hidden />
      <div className="hk-aggregate" aria-hidden />

      {/* everything the landing rattles */}
      <div className="hk-shake">
        {/* the floor splits — plain dark fissures, no glow */}
        <svg className="hk-cracks" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <g className="hk-fissure">
            {CRACKS.map((d, i) => (
              <path d={d} pathLength="100" style={{ "--i": i }} key={i} />
            ))}
            {BRANCHES.map((d, i) => (
              <path d={d} pathLength="100" style={{ "--i": i + 3 }} key={`b${i}`} />
            ))}
          </g>
          {/* cement is pale inside: a freshly split edge shows lighter than the
              weathered surface */}
          <g className="hk-fresh">
            {CRACKS.map((d, i) => (
              <path d={d} pathLength="100" style={{ "--i": i }} key={i} />
            ))}
          </g>
        </svg>

        {/* the slab */}
        <div className="hk-slab">
          <div className="hk-slab-edge" aria-hidden />
          <div className="hk-slab-face" aria-hidden />
          <div className="hk-slab-grit" aria-hidden />

          {/* the mark, cut into the slab and repainted region by region */}
          <div className="hk-markbox">
            <div className="hk-mark">
              <div className="hk-layer hk-cut" aria-hidden />
              <div className="hk-region hk-hood" aria-hidden />
              <div className="hk-region hk-code" aria-hidden />
              <div className="hk-region hk-skin" aria-hidden />
              <div className="hk-layer hk-veins" aria-hidden />
            </div>
          </div>

          <div className="hk-type">
            <div className="hk-caption">{caption}</div>
          </div>
        </div>

        {/* broken cement thrown out around the base. Drawn AFTER the slab, so
            the chunks sit in front of where it bedded in — that overlap is what
            puts the slab IN the floor rather than on top of it. */}
        <div className="hk-rubble" aria-hidden>
          {RUBBLE.map(([l, t, w, r], i) => (
            <span key={i} style={{ left: `${l}%`, "--t": `${t}vw`, "--w": `${w}vw`, "--r": `${r}deg`, "--i": i }} />
          ))}
        </div>

        {/* the shockwave, and the dust it throws */}
        <div className="hk-wave" aria-hidden />
        <div className="hk-dust" aria-hidden>
          {DUST.map(([l, s, d, x], i) => (
            <span key={i} style={{ left: `${l}%`, "--s": s, "--d": d, "--x": x }} />
          ))}
        </div>
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
        {/* cement does not split in clean lines: the edges are chipped */}
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
