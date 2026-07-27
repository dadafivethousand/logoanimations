// Rocky.js — a glove punches the camera, the impact becomes the ninja's face,
// and the wordmark lands after it. Flag and arena spot behind.
//
// Genre, not franchise: no film logo, no title typeface, no likeness.
//
// THE MARK KEEPS ITS OWN COLOURS. It is drawn as itself — an <img>, unmasked and
// unrecoloured — so "CODE" stays brand blue and the hood stays black.
//
// HOW THE FACE ARRIVES BEFORE THE WRITING. The logo is one image, so the same
// file is rendered twice and each copy is clipped: one to the head box, one to
// everything below it. Both sit in the same mark box, so they stay in perfect
// register and the head can appear a beat before the wordmark without any
// second asset.
//
// GEOMETRY IS MEASURED, NOT EYEBALLED — percentages of the mark box, read off
// the artwork's own pixels:
//
//     head      left 32.7%  top 0%     w 29.3%  h 46.3%
//     eye band  left 39.5%  top 22.1%  w 21.1%  h 10.7%
//
// The headband sits on the FOREHEAD, above the eye band; over it he'd be blind.
// If the logo file is ever replaced, re-measure HEAD and the two clips below.
import React from "react";
import "../Stylesheets/Rocky.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 flag + spot · p2 the glove comes in and lands · p3 it becomes the face
// · p4 the writing
const CUES = [200, 850, 1600, 2300];

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
  loopAt = 7500,
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

      {/* Everything the punch is supposed to rattle lives inside .rk-shake.
          The flag stays outside it — a room doesn't move when you hit the
          camera, only the camera does, and shaking the backdrop too reads as
          the whole set wobbling. */}
      <div className="rk-shake">
        {/* ---- the punch ---- */}
        <div className="rk-punch" aria-hidden>
          <svg viewBox="0 0 200 210">
            {/* a fist coming AT the camera: knuckles forward, cuff foreshortened
                behind it, thumb to one side */}
            <path
              className="rk-cuff"
              d="M62 158 h76 a12 12 0 0 1 12 12 v18 a12 12 0 0 1 -12 12 h-76 a12 12 0 0 1 -12 -12 v-18 a12 12 0 0 1 12 -12 z"
            />
            <g className="rk-leather">
              <path d="M100 22 C 150 22, 180 56, 180 104 C 180 148, 146 176, 100 176 C 54 176, 20 148, 20 104 C 20 56, 50 22, 100 22 Z" />
              <path className="rk-thumb" d="M26 116 C 4 114, -4 140, 10 156 C 22 170, 44 164, 46 148 Z" />
            </g>
            <g className="rk-knuckle">
              <circle cx="56" cy="86" r="16" />
              <circle cx="86" cy="78" r="17" />
              <circle cx="118" cy="78" r="17" />
              <circle cx="148" cy="88" r="15" />
            </g>
            <path className="rk-seam" d="M34 124 C 70 142, 130 142, 168 122" />
          </svg>
        </div>

        {/* impact */}
        <div className="rk-flash" aria-hidden />
        <div className="rk-ring" aria-hidden />

        {/* ---- the champion ---- */}
        <div className="rk-markwrap">
          <div className="rk-markbox">
            <div className="rk-shadow" aria-hidden />

            <div className="rk-mark">
              {/* same file twice, clipped — see the note at the top */}
              <img className="rk-logo rk-logo-head" src={src} alt="Code Ninjas" />
              <img className="rk-logo rk-logo-word" src={src} alt="" aria-hidden />

              {/* --- headband, across the FOREHEAD --- */}
              <div className="rk-band" style={HEAD} aria-hidden>
                <svg viewBox="0 0 293 463" preserveAspectRatio="none">
                  <g className="rk-band-g">
                    <path
                      className="rk-band-red"
                      d="M6 128 C 70 92, 224 92, 288 128 L 288 172 C 224 136, 70 136, 6 172 Z"
                    />
                    <path
                      className="rk-band-white"
                      d="M6 143 C 70 107, 224 107, 288 143 L 288 158 C 224 122, 70 122, 6 158 Z"
                    />
                    <path
                      className="rk-band-blue"
                      d="M6 128 C 34 112, 68 102, 96 98 L 96 146 C 68 150, 34 158, 6 172 Z"
                    />
                    <g className="rk-band-stars">
                      <path d={STAR_PATH} transform="translate(30 140) scale(0.7)" />
                      <path d={STAR_PATH} transform="translate(62 128) scale(0.7)" />
                      <path d={STAR_PATH} transform="translate(30 168) rotate(-8) scale(0.6)" />
                    </g>
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
