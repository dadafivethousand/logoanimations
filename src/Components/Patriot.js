// Patriot.js — a simple patriotic emblem: a starred roundel with the ninja in
// it, over a flag field. Everything in Old Glory colours.
//
// Genre, not franchise. No boxing, and NO LOGO FILE — the ninja and the type are
// both drawn/set here from scratch, which is why this theme does not call
// useLogo at all. That also means it is the one theme that survives the logo
// file being missing or replaced.
//
// Colours are the flag's real ones rather than approximations:
//   Old Glory Red  #b22234
//   White          #ffffff
//   Old Glory Blue #3c3b6e
import React from "react";
import "../Stylesheets/Patriot.css";
import usePhases from "../Utils/usePhases";

// p1 the field · p2 the roundel · p3 the ninja in it · p4 the name
const CUES = [200, 800, 1450, 2100];

const STAR_PATH =
  "M0 -10 L2.9 -3.1 L10 -3.1 L4.2 1.3 L6.5 8.5 L0 4 L-6.5 8.5 L-4.2 1.3 L-10 -3.1 L-2.9 -3.1 Z";

/* 13 stars ringing the roundel — one per original colony, and it happens to
   space evenly. Positions computed once, not guessed. */
const RING = Array.from({ length: 13 }, (_, i) => {
  const a = (i / 13) * Math.PI * 2 - Math.PI / 2;
  return [
    +(200 + 152 * Math.cos(a)).toFixed(1),
    +(200 + 152 * Math.sin(a)).toFixed(1),
    +((a * 180) / Math.PI + 90).toFixed(1),
  ];
});

/* Scattered stars in the field. Hand-placed, so every take composes the same. */
const FIELD = [
  [8, 9, 0.9, 1.1], [21, 5, 0.5, 0.8], [33, 13, 0.7, 0.6], [47, 6, 1.0, 1.2],
  [61, 12, 0.6, 0.7], [74, 5, 0.8, 0.9], [88, 11, 0.5, 0.6], [14, 20, 0.6, 0.7],
  [40, 22, 0.5, 0.5], [67, 21, 0.7, 0.8], [92, 22, 0.6, 0.9], [3, 31, 0.5, 0.6],
  [28, 33, 0.8, 0.7], [55, 31, 0.5, 0.5], [80, 34, 0.6, 0.8], [96, 38, 0.5, 0.6],
];

export default function Patriot({
  mode = "animated",
  brand = "CODE NINJAS",
  caption = "WOODBRIDGE",
  loopAt = 7000,
}) {
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt });

  return (
    <div className={`us us-p${phase} ${isStatic ? "is-static" : ""}`} key={run}>
      <PatriotDefs />

      {/* ---- the field ---- */}
      <div className="us-sky" aria-hidden />
      <div className="us-rays" aria-hidden />

      <svg className="us-field" viewBox="0 0 100 44" preserveAspectRatio="none" aria-hidden>
        {FIELD.map(([x, y, s, o], i) => (
          <path
            className="us-fieldstar"
            key={i}
            d={STAR_PATH}
            transform={`translate(${x} ${y}) scale(${s * 0.09})`}
            style={{ "--o": o, "--i": i }}
          />
        ))}
      </svg>

      {/* stripes across the lower half, waving */}
      <svg className="us-stripes" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden>
        <g filter="url(#us-wave)">
          {Array.from({ length: 7 }, (_, i) => (
            <rect
              key={i}
              x="-6"
              y={i * 8.6}
              width="112"
              height="8.6"
              fill={i % 2 === 0 ? "#b22234" : "#ffffff"}
              style={{ "--i": i }}
              className="us-stripe"
            />
          ))}
        </g>
      </svg>

      {/* ---- the roundel ---- */}
      <div className="us-emblem">
        <svg viewBox="0 0 400 400">
          {/* rim */}
          <circle className="us-rim" cx="200" cy="200" r="188" />
          <circle className="us-rim-in" cx="200" cy="200" r="176" />
          {/* navy field */}
          <circle className="us-disc" cx="200" cy="200" r="170" />
          {/* ring of stars */}
          {/* The placement lives on the outer <g> and the animation on the
              inner <path>: a CSS transform REPLACES an SVG transform attribute,
              so animating scale on the placed element collapses every star onto
              the origin. */}
          <g className="us-ring">
            {RING.map(([x, y, r], i) => (
              <g transform={`translate(${x} ${y}) rotate(${r})`} key={i}>
                <path d={STAR_PATH} transform="scale(1.15)" style={{ "--i": i }} />
              </g>
            ))}
          </g>

          {/* ---- the ninja, drawn here ---- */}
          <g className="us-ninja">
            <circle className="us-hood" cx="200" cy="204" r="96" />
            {/* the knot, off to the side */}
            <path className="us-hood" d="M118 186 C 84 176, 62 190, 70 214 C 78 238, 110 238, 124 224 Z" />
            {/* band across the eyes */}
            <path className="us-eyeband" d="M112 188 L288 188 L288 232 L112 232 Z" />
            <path className="us-eye" d="M142 200 L192 210 L192 220 L142 218 Z" />
            <path className="us-eye" d="M258 200 L208 210 L208 220 L258 218 Z" />
            {/* stars-and-stripes headband on the forehead */}
            <g className="us-headband">
              <path className="us-hb-red" d="M114 148 C 158 122, 242 122, 286 148 L 286 178 C 242 152, 158 152, 114 178 Z" />
              <path className="us-hb-white" d="M114 158 C 158 132, 242 132, 286 158 L 286 168 C 242 142, 158 142, 114 168 Z" />
              <path className="us-hb-blue" d="M114 148 C 132 137, 154 130, 174 126 L 174 156 C 154 160, 132 167, 114 178 Z" />
              <g className="us-hb-stars">
                <path d={STAR_PATH} transform="translate(132 154) scale(0.45)" />
                <path d={STAR_PATH} transform="translate(158 144) scale(0.45)" />
              </g>
              <path className="us-hb-red" d="M112 160 C 90 174, 80 198, 88 214 C 98 200, 110 186, 118 178 Z" />
            </g>
          </g>
        </svg>
      </div>

      {/* ---- the name ---- */}
      <div className="us-type">
        <div className="us-brand">{brand}</div>
        <div className="us-bar" aria-hidden>
          <span className="us-bar-red" />
          <span className="us-bar-white" />
          <span className="us-bar-blue" />
        </div>
        <div className="us-caption">{caption}</div>
      </div>

      <div className="us-grain" aria-hidden />
      <div className="us-vignette" aria-hidden />
    </div>
  );
}

function PatriotDefs() {
  return (
    <svg className="us-defs" aria-hidden focusable="false">
      <defs>
        {/* the stripes are cloth, so they have to bend — flat bars read as a
            graphic rather than something hanging */}
        <filter id="us-wave" x="-10%" y="-30%" width="120%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="3" seed="6" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
