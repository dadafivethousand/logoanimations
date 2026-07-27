// Patriot.js — a patriotic emblem: a starred roundel with the ninja in it, the
// name welded underneath, over a flag field. Everything in Old Glory colours.
//
// Genre, not franchise. No boxing, and NO LOGO FILE — the ninja is drawn and the
// name is set as type, which is why this theme never calls useLogo. It is the
// one theme that survives the logo file being missing or replaced.
//
// The name is a FLOW SIBLING of the badge inside .us-lockup, never positioned
// independently: that is what keeps it directly under the emblem instead of
// drifting down the frame, and the pair centre together as one unit.
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
   space evenly. Computed once, not guessed. */
const RING = Array.from({ length: 13 }, (_, i) => {
  const a = (i / 13) * Math.PI * 2 - Math.PI / 2;
  return [
    +(200 + 150 * Math.cos(a)).toFixed(1),
    +(200 + 150 * Math.sin(a)).toFixed(1),
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
              className="us-stripe"
              x="-6"
              y={i * 8.6}
              width="112"
              height="8.6"
              fill={i % 2 === 0 ? "#b22234" : "#ffffff"}
              style={{ "--i": i }}
            />
          ))}
        </g>
      </svg>
      {/* light across the cloth, so the stripes read as fabric and not bars */}
      <div className="us-cloth" aria-hidden />

      {/* ---- badge + name, welded ---- */}
      <div className="us-lockup">
        <div className="us-glow" aria-hidden />

        <div className="us-emblem">
          <svg viewBox="0 0 400 400">
            {/* rim: red ring with a bevel, then a white ring */}
            <circle className="us-rim" cx="200" cy="200" r="192" />
            <circle className="us-rim-bevel" cx="200" cy="200" r="192" />
            <circle className="us-rim-white" cx="200" cy="200" r="176" />

            {/* navy field, lit from the upper left */}
            <circle className="us-disc" cx="200" cy="200" r="168" />
            {/* the disc is dished: darker where it meets the ring */}
            <circle className="us-disc-shade" cx="200" cy="200" r="168" />

            <g className="us-ring">
              {RING.map(([x, y, r], i) => (
                <g transform={`translate(${x} ${y}) rotate(${r})`} key={i}>
                  {/* placement on the outer <g>, animation on the inner path —
                      a CSS transform REPLACES an SVG transform attribute, and
                      animating the placed element collapses every star onto the
                      origin */}
                  <path d={STAR_PATH} style={{ "--i": i }} />
                </g>
              ))}
            </g>

            {/* ---- the ninja, drawn here ----
                The placement transform lives on the OUTER <g> and the animation
                on the inner one: a CSS transform replaces an SVG transform
                attribute, and putting both on one element throws it to the
                origin. Scaled to 0.7 and lifted, so the name fits under it
                inside the disc. */}
            <g transform="translate(59.6 7.4) scale(0.702)">
            <g className="us-ninja">
              <circle className="us-hood" cx="200" cy="206" r="94" />
              <path className="us-hood" d="M120 188 C 86 178, 64 192, 72 216 C 80 240, 112 240, 126 226 Z" />
              <path className="us-eyeband" d="M114 190 L286 190 L286 232 L114 232 Z" />
              <path className="us-eye" d="M144 202 L192 211 L192 221 L144 219 Z" />
              <path className="us-eye" d="M256 202 L208 211 L208 221 L256 219 Z" />
              <g className="us-headband">
                <path className="us-hb-red" d="M116 152 C 158 126, 242 126, 284 152 L 284 180 C 242 154, 158 154, 116 180 Z" />
                <path className="us-hb-white" d="M116 161 C 158 135, 242 135, 284 161 L 284 171 C 242 145, 158 145, 116 171 Z" />
                <path className="us-hb-blue" d="M116 152 C 133 141, 154 134, 174 130 L 174 158 C 154 162, 133 169, 116 180 Z" />
                <g className="us-hb-stars">
                  <path d={STAR_PATH} transform="translate(134 157) scale(0.42)" />
                  <path d={STAR_PATH} transform="translate(159 148) scale(0.42)" />
                </g>
                <path className="us-hb-red" d="M114 163 C 92 177, 82 200, 90 216 C 100 202, 112 189, 120 181 Z" />
              </g>
            </g>
            </g>

            {/* ---- the name, INSIDE the disc ---- */}
            <g className="us-word">
              <text className="us-brand" x="200" y="258" textAnchor="middle">
                {brand}
              </text>
              <text className="us-caption" x="200" y="296" textAnchor="middle">
                {caption}
              </text>
            </g>

            {/* gloss: one soft sweep across the upper third of the badge */}
            <path
              className="us-gloss"
              d="M32 168 C 60 74, 132 20, 200 20 C 268 20, 340 74, 368 168 C 300 108, 100 108, 32 168 Z"
            />
          </svg>
        </div>

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

        {/* the ninja sits IN the badge, so he casts onto it */}
        <filter id="us-drop" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="#080816" floodOpacity="0.55" />
        </filter>

        {/* navy lit from the upper left rather than flat */}
        <radialGradient id="us-discfill" cx="34%" cy="28%" r="82%">
          <stop offset="0%" stopColor="#565493" />
          <stop offset="52%" stopColor="#3c3b6e" />
          <stop offset="100%" stopColor="#22214a" />
        </radialGradient>

        {/* dish: transparent in the middle, dark at the rim */}
        <radialGradient id="us-dishfill" cx="50%" cy="50%" r="50%">
          <stop offset="72%" stopColor="#000018" stopOpacity="0" />
          <stop offset="100%" stopColor="#000018" stopOpacity="0.55" />
        </radialGradient>

        {/* bevel: light along the top edge, gone by halfway down */}
        <linearGradient id="us-bevel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000010" stopOpacity="0.35" />
        </linearGradient>

        <linearGradient id="us-rimfill" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#d8394d" />
          <stop offset="46%" stopColor="#b22234" />
          <stop offset="100%" stopColor="#7c1424" />
        </linearGradient>
      </defs>
    </svg>
  );
}
