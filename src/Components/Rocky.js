// Rocky.js — the mark as the champion: stars-and-stripes headband, a pair of
// gloves hanging in the dark, a title belt under the lockup, all lit by a single
// arena spot against a hanging flag.
//
// Genre, not franchise: no film logo, no title typeface, no likeness. Boxing and
// Americana are the vocabulary; the read comes from the gear and the light.
//
// THE MARK KEEPS ITS OWN COLOURS. It is drawn as itself — an <img>, unmasked and
// unrecoloured — so "CODE" stays brand blue and the hood stays black. The theme
// is carried by the background and the gear, never by repainting the logo.
//
// THE GEAR IS MEASURED, NOT EYEBALLED. Positions are percentages of the mark box
// taken off the artwork's own pixels:
//
//     head      left 32.7%  top 0%     w 29.3%  h 46.3%
//     eye band  left 39.5%  top 22.1%  w 21.1%  h 10.7%
//
// The headband sits on the FOREHEAD — above the eye band, not over it. Covering
// the band would blind him. If the logo file is ever replaced, re-measure.
import React from "react";
import "../Stylesheets/Rocky.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 flag + spot · p2 the mark lands · p3 headband and gloves · p4 belt + name
const CUES = [200, 700, 1400, 2200];

// measured off the artwork — see the note at the top
const HEAD = { left: "32.7%", top: "0%", width: "29.3%", height: "46.3%" };

/* 50 stars, 9 rows of 6 and 5 — laid out rather than guessed at. */
const STARS = (() => {
  const out = [];
  for (let row = 0; row < 9; row += 1) {
    const six = row % 2 === 0;
    const n = six ? 6 : 5;
    for (let i = 0; i < n; i += 1) {
      out.push([28 + i * 42 + (six ? 0 : 21), 26 + row * 24.5]);
    }
  }
  return out;
})();

const STAR_PATH =
  "M0 -9 L2.6 -2.8 L9 -2.8 L3.8 1.2 L5.8 7.6 L0 3.6 L-5.8 7.6 L-3.8 1.2 L-9 -2.8 L-2.6 -2.8 Z";

export default function Rocky({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = 7000,
}) {
  const { src, logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="rk rk-p0" aria-hidden />;

  return (
    <div
      className={`rk rk-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      <RockyDefs />

      {/* ---- the flag hanging behind ---- */}
      <svg className="rk-flag" viewBox="0 0 760 400" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <g filter="url(#rk-wave)">
          {/* 13 stripes */}
          {Array.from({ length: 13 }, (_, i) => (
            <rect
              key={i}
              x="0"
              y={(i * 400) / 13}
              width="760"
              height={400 / 13}
              fill={i % 2 === 0 ? "#9c1526" : "#e8e2d6"}
            />
          ))}
          {/* canton */}
          <rect x="0" y="0" width="304" height={(400 / 13) * 7} fill="#16244a" />
          <g fill="#e8e2d6">
            {STARS.map(([x, y], i) => (
              <path d={STAR_PATH} transform={`translate(${x} ${y}) scale(0.78)`} key={i} />
            ))}
          </g>
        </g>
      </svg>
      {/* cloth: the folds are shading, laid over the flag rather than drawn into it */}
      <div className="rk-cloth" aria-hidden />
      <div className="rk-flagdim" aria-hidden />

      {/* ---- the arena spot ---- */}
      <div className="rk-spot" aria-hidden />
      <div className="rk-beam" aria-hidden />

      {/* ---- gloves hanging in the dark ---- */}
      <div className="rk-gloves" aria-hidden>
        {/* A glove is a mitt WITH A THUMB and a cuff. An oval on a string is a
            speed bag — the thumb is what makes it read. */}
        <svg className="rk-glove rk-glove-l" viewBox="0 0 120 260">
          <path className="rk-lace" d="M60 0 L60 72" />
          <path className="rk-cuff" d="M36 68 h48 a6 6 0 0 1 6 6 v26 h-60 v-26 a6 6 0 0 1 6 -6 z" />
          <g className="rk-leather">
            <path d="M60 96 C 96 96, 110 118, 110 150 C 110 194, 90 222, 60 222 C 40 222, 26 208, 20 188 C 18 178, 18 166, 20 156 C 20 122, 34 96, 60 96 Z" />
            <path className="rk-thumb" d="M22 152 C 8 150, 2 164, 8 176 C 13 186, 24 186, 27 176 Z" />
          </g>
          <path className="rk-seam" d="M30 148 C 58 138, 88 140, 106 150" />
        </svg>
        <svg className="rk-glove rk-glove-r" viewBox="0 0 120 260">
          <path className="rk-lace" d="M60 0 L60 72" />
          <path className="rk-cuff" d="M36 68 h48 a6 6 0 0 1 6 6 v26 h-60 v-26 a6 6 0 0 1 6 -6 z" />
          <g className="rk-leather">
            <path d="M60 96 C 24 96, 10 118, 10 150 C 10 194, 30 222, 60 222 C 80 222, 94 208, 100 188 C 102 178, 102 166, 100 156 C 100 122, 86 96, 60 96 Z" />
            <path className="rk-thumb" d="M98 152 C 112 150, 118 164, 112 176 C 107 186, 96 186, 93 176 Z" />
          </g>
          <path className="rk-seam" d="M90 148 C 62 138, 32 140, 14 150" />
        </svg>
      </div>

      {/* ---- the champion ---- */}
      <div className="rk-markwrap">
        <div className="rk-markbox">
          <div className="rk-shadow" aria-hidden />

          <div className="rk-mark">
            {/* drawn as itself — see the note at the top */}
            <img className="rk-logo" src={src} alt="Code Ninjas" />

            {/* --- the headband, across the FOREHEAD, above the eye band --- */}
            <div className="rk-band" style={HEAD} aria-hidden>
              <svg viewBox="0 0 293 463" preserveAspectRatio="none">
                <g className="rk-band-g">
                  {/* the strip itself, following the curve of the crown */}
                  <path
                    className="rk-band-red"
                    d="M6 128 C 70 92, 224 92, 288 128 L 288 172 C 224 136, 70 136, 6 172 Z"
                  />
                  <path
                    className="rk-band-white"
                    d="M6 143 C 70 107, 224 107, 288 143 L 288 158 C 224 122, 70 122, 6 158 Z"
                  />
                  {/* the blue field sits at the left, where a real one is knotted */}
                  <path
                    className="rk-band-blue"
                    d="M6 128 C 34 112, 68 102, 96 98 L 96 146 C 68 150, 34 158, 6 172 Z"
                  />
                  <g className="rk-band-stars">
                    <path d={STAR_PATH} transform="translate(30 140) scale(0.7)" />
                    <path d={STAR_PATH} transform="translate(62 128) scale(0.7)" />
                    <path d={STAR_PATH} transform="translate(30 168) rotate(-8) scale(0.6)" />
                  </g>
                  {/* the tail, knotted off to the side */}
                  <path
                    className="rk-band-red"
                    d="M2 150 C -16 168, -26 196, -18 214 C -8 200, 2 186, 10 176 Z"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* WOODBRIDGE, then the title belt */}
        <div className="rk-type">
          <div className="rk-caption">{caption}</div>
          <div className="rk-belt" aria-hidden>
            <span className="rk-strap rk-strap-l" />
            <span className="rk-plate">
              <span className="rk-plate-star" />
            </span>
            <span className="rk-strap rk-strap-r" />
          </div>
        </div>
      </div>

      <div className="rk-dust" aria-hidden />
      <div className="rk-grain" aria-hidden />
      <div className="rk-vignette" aria-hidden />
    </div>
  );
}

function RockyDefs() {
  return (
    <svg className="rk-defs" aria-hidden focusable="false">
      <defs>
        {/* the flag is cloth, so the stripes have to bend; a flat set of bars
            reads as a graphic, not something hanging in a room */}
        <filter id="rk-wave" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.014" numOctaves="3" seed="4" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="34"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
