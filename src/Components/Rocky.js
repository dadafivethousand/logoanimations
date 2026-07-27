// Rocky.js — a boxing glove punches the camera and MORPHS into the ninja's
// head; the wordmark lands after it. Flag and arena spot behind.
//
// Genre, not franchise: no film logo, no title typeface, no likeness.
//
// WHY THE HEAD IS DRAWN FROM SCRATCH HERE. A raster logo cannot morph — the
// best you get is a cross-fade between two pictures, which is what the previous
// pass did and it looked like a cut. So the glove and the head are one SVG path
// with an IDENTICAL command structure (8 cubic segments, same order), and CSS
// interpolates `d` between them. That only works if both paths have the same
// number and type of commands, which is why they are generated from one set of
// eight anchors rather than drawn by hand:
//
//     head   every radius 78
//     glove  same anchors, radii pushed out at the knuckles and the thumb
//
// The detail on each side (knuckles, seam, cuff / eyes, band, knot) cross-fades
// across the morph. The wordmark below is still the real logo file — the brand's
// own type, clipped out of the artwork.
import React from "react";
import "../Stylesheets/Rocky.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 flag + spot · p2 the glove comes in and lands · p3 it morphs into the head
// · p4 the writing
const CUES = [200, 850, 1600, 2350];

/* Generated: one ring of eight anchors, two sets of radii, Catmull-Rom to
   cubics. Same structure both sides, so `d` interpolates. */
const GLOVE_D =
  "M180.0 104.0 C178.6 121.9 162.8 143.5 149.5 153.5 C136.2 163.5 117.2 163.3 100.0 164.0 " +
  "C82.8 164.7 61.9 167.7 46.3 157.7 C30.6 147.7 6.7 122.6 6.0 104.0 C5.3 85.4 26.4 60.4 42.0 46.0 " +
  "C57.7 31.7 80.7 18.0 100.0 18.0 C119.3 18.0 144.6 31.7 158.0 46.0 C171.3 60.4 181.4 86.1 180.0 104.0 Z";

const HEAD_D =
  "M178.0 104.0 C178.0 122.4 168.2 146.2 155.2 159.2 C142.2 172.2 118.4 182.0 100.0 182.0 " +
  "C81.6 182.0 57.8 172.2 44.8 159.2 C31.8 146.2 22.0 122.4 22.0 104.0 C22.0 85.6 31.8 61.8 44.8 48.8 " +
  "C57.8 35.8 81.6 26.0 100.0 26.0 C118.4 26.0 142.2 35.8 155.2 48.8 C168.2 61.8 178.0 85.6 178.0 104.0 Z";

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
      style={{ ...logoVar, "--glove-d": `path("${GLOVE_D}")`, "--head-d": `path("${HEAD_D}")` }}
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
      <div className="rk-cloth" aria-hidden />
      <div className="rk-flagdim" aria-hidden />

      {/* ---- the arena spot ---- */}
      <div className="rk-spot" aria-hidden />
      <div className="rk-beam" aria-hidden />

      {/* The camera takes the hit, so the shake goes on everything in the ring —
          not on the flag. Shaking the backdrop reads as the whole set wobbling. */}
      <div className="rk-shake">
        {/* impact */}
        <div className="rk-flash" aria-hidden />
        <div className="rk-ring" aria-hidden />

        {/* ---- the writing ---- */}
        <div className="rk-markwrap">
          <div className="rk-markbox">
            <div className="rk-shadow" aria-hidden />

        <div className="rk-morph" aria-hidden>
          <svg viewBox="0 0 200 208">
            {/* the cuff belongs to the glove and goes with it */}
            <path
              className="rk-cuff"
              d="M62 160 h76 a12 12 0 0 1 12 12 v18 a12 12 0 0 1 -12 12 h-76 a12 12 0 0 1 -12 -12 v-18 a12 12 0 0 1 12 -12 z"
            />

            {/* the shape that actually morphs */}
            <path className="rk-body" d={GLOVE_D} />

            {/* glove detail — fades out as the shape changes */}
            <g className="rk-gdetail">
              <circle cx="58" cy="72" r="16" />
              <circle cx="88" cy="62" r="17" />
              <circle cx="120" cy="62" r="17" />
              <circle cx="150" cy="72" r="15" />
              <path className="rk-seam" d="M32 118 C 70 138, 132 138, 170 116" />
            </g>

            {/* head detail — fades in behind the same silhouette */}
            <g className="rk-hdetail">
              {/* the knot and tails, off to the side, as on the mark */}
              <path
                className="rk-knot"
                d="M30 96 C 10 88, -4 96, 2 110 C 8 124, 26 124, 34 116 Z"
              />
              {/* the band across the eyes */}
              <path className="rk-eyeband" d="M26 96 L174 96 L174 130 L26 130 Z" />
              {/* two eyes, angled in */}
              <path className="rk-eye" d="M52 106 L92 114 L92 122 L52 120 Z" />
              <path className="rk-eye" d="M148 106 L108 114 L108 122 L148 120 Z" />
            </g>

            {/* the stars-and-stripes headband, on the forehead */}
            <g className="rk-band">
              <path className="rk-band-red" d="M28 62 C 66 40, 134 40, 172 62 L 172 86 C 134 64, 66 64, 28 86 Z" />
              <path className="rk-band-white" d="M28 70 C 66 48, 134 48, 172 70 L 172 78 C 134 56, 66 56, 28 78 Z" />
              <path className="rk-band-blue" d="M28 62 C 44 53, 62 47, 78 44 L 78 68 C 62 71, 44 77, 28 86 Z" />
              <g className="rk-band-stars">
                <path d={STAR_PATH} transform="translate(42 66) scale(0.5)" />
                <path d={STAR_PATH} transform="translate(64 58) scale(0.5)" />
              </g>
              <path className="rk-band-red" d="M26 72 C 8 84, 0 104, 6 118 C 14 106, 24 94, 30 88 Z" />
            </g>
          </svg>
        </div>

            <div className="rk-mark">
              {/* the brand's own type, clipped out of the logo file */}
              <img className="rk-logo rk-logo-word" src={src} alt="Code Ninjas" />
            </div>
          </div>

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
