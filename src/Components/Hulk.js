// Hulk.js — a hulked-out ninja, drawn from scratch.
//
// Genre, not franchise: gamma green only. No studio marks, no likeness, no
// film typeface.
//
// NO LOGO FILE. The ninja is drawn and the name is set as type, the same way
// Patriot works, because the mark cannot be reshaped — and a hulk needs a
// heavier skull, a brow ridge and a jaw, which no amount of recolouring gets
// you. This is the second theme that survives the logo file being replaced.
//
// Where the anger actually comes from — none of it is pasted on:
//   the skull    wider across the brow than a circle, and heavier at the jaw
//   the ridge    a shaded mass ABOVE the eyes INSIDE the skin band, dipping
//                toward the middle. Not eyebrows sitting on top of him.
//   the eyes     narrow angled slits, lit from inside
//   the veins    on the exposed skin only, because that is where veins are
import React from "react";
import "../Stylesheets/Hulk.css";
import usePhases from "../Utils/usePhases";

// p1 cold · p2 the change · p3 the hit · p4 the name
const CUES = [200, 900, 2100, 2700];

/* Veins across the exposed skin. Clipped to the band, so they can be drawn
   long and still stop where the skin does. */
const VEINS = [
  "M62 196 C96 190 120 206 148 200 C172 195 190 208 214 204",
  "M338 194 C306 188 284 204 256 199 C234 195 218 206 196 203",
  "M74 218 C104 226 126 214 150 222 C170 229 186 220 206 226",
  "M330 220 C300 228 278 216 254 224 C234 231 218 222 200 228",
  "M120 186 C128 200 122 214 130 228 C136 239 132 248 138 256",
  "M282 186 C274 200 280 214 272 228 C266 239 270 248 264 256",
];

/* The burst thrown off by the hit. Angles spread evenly; the jitter keeps it
   from reading as a clock face. */
const SPARKS = Array.from({ length: 24 }, (_, i) => [
  (i / 24) * 360 + (i % 3) * 5,
  32 + ((i * 41) % 24),
  0.55 + ((i * 17) % 8) / 8,
  (i % 6) * 28,
]);

/* Dust hanging in the light: [left %, size, drift, delay, duration, resting
   height]. The last value is only for the still — with the drift stopped a
   mote would sit at its start point below the frame. */
const MOTES = [
  [7, 0.9, 3, 0, 7200, 24], [15, 0.5, -2, 1400, 8600, 62], [24, 1.2, 4, 600, 6400, 37],
  [32, 0.6, -3, 2600, 9000, 79], [41, 0.8, 2, 3400, 7600, 15], [49, 0.5, -4, 900, 8200, 54],
  [57, 1.1, 3, 4200, 6800, 85], [65, 0.7, -2, 1900, 9400, 30], [73, 0.9, 5, 3000, 7000, 69],
  [81, 0.6, -3, 5000, 8800, 46], [89, 1.0, 2, 2200, 7400, 27], [95, 0.7, -4, 4000, 9200, 73],
];

export default function Hulk({
  mode = "animated",
  brand = "CODE",
  brand2 = "NINJAS",
  caption = "WOODBRIDGE",
  loopAt = 8200,
}) {
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt });

  return (
    <div className={`hk hk-p${phase} ${isStatic ? "is-static" : ""}`} key={run}>
      <HulkDefs />

      <div className="hk-void" aria-hidden />
      <div className="hk-pool" aria-hidden />
      <div className="hk-bloom" aria-hidden />
      <div className="hk-motes" aria-hidden>
        {MOTES.map(([l, sc, dx, dl, du, y], i) => (
          <span
            key={i}
            style={{
              left: `${l}%`,
              "--sc": sc,
              "--dx": `${dx}vw`,
              "--dl": `${dl}ms`,
              "--du": `${du}ms`,
              "--y": `${y}vh`,
            }}
          />
        ))}
      </div>

      <div className="hk-shake">
        <div className="hk-stage">
          <div className="hk-lockup">
            <svg className="hk-head" viewBox="0 0 400 400" aria-hidden>
              <defs>
                {/* the band of exposed skin, used to clip the veins and the
                    ridge so neither can spill onto the hood */}
                <clipPath id="hk-skinclip">
                  <path d="M46 172 C108 156 292 156 354 172 C352 202 346 232 336 258 C266 274 134 274 64 258 C54 232 48 202 46 172 Z" />
                </clipPath>
              </defs>

              {/* the knot, tied off on the left, with two tails */}
              <g className="hk-knot">
                <path d="M64 168 C34 168 12 184 8 208 C30 196 46 186 66 182 Z" />
                <path d="M62 186 C36 200 22 228 30 252 C42 232 58 214 70 202 Z" />
              </g>

              {/* THE SKULL. Wider across the brow than a circle and heavier at
                  the jaw — a plain circle is what made the earlier pass read
                  as a green ball with eyebrows drawn on it. */}
              <path
                className="hk-skull"
                d="M200 34 C292 34 366 96 366 176 C366 232 348 286 314 322 C286 352 244 366 200 366 C156 366 114 352 86 322 C52 286 34 232 34 176 C34 96 108 34 200 34 Z"
              />
              {/* the mass of the hood over the brow, read as its own shadow */}
              <path
                className="hk-crown"
                d="M200 34 C292 34 366 96 366 176 C366 186 365 196 364 206 C300 176 100 176 36 206 C35 196 34 186 34 176 C34 96 108 34 200 34 Z"
              />
              {/* light along the top of the hood */}
              <path
                className="hk-skull-hi"
                d="M96 108 C132 66 268 66 304 108 C262 82 138 82 96 108 Z"
              />

              {/* --- the exposed skin --- */}
              <path
                className="hk-band"
                d="M46 172 C108 156 292 156 354 172 C352 202 346 232 336 258 C266 274 134 274 64 258 C54 232 48 202 46 172 Z"
              />

              <g clipPath="url(#hk-skinclip)">
                <path
                  className="hk-band-shade"
                  d="M46 172 C108 156 292 156 354 172 C352 202 346 232 336 258 C266 274 134 274 64 258 C54 232 48 202 46 172 Z"
                />

                <g className="hk-veins">
                  {VEINS.map((d, i) => (
                    <path d={d} pathLength="100" style={{ "--i": i }} key={i} />
                  ))}
                </g>

                {/* THE RIDGE. Above the eyes, inside the skin, dipping toward
                    the middle — that direction is the whole difference between
                    angry and surprised. It is a shaded mass, not a pair of
                    eyebrows laid on the surface. */}
                <path
                  className="hk-ridge"
                  d="M40 166 C108 150 292 150 360 166 C358 182 356 194 353 206 C300 190 250 208 200 218 C150 208 100 190 47 206 C44 194 42 182 40 166 Z"
                />
                <path
                  className="hk-ridge-hi"
                  d="M52 190 C108 176 176 194 200 206 C224 194 292 176 348 190 C292 186 232 202 200 214 C168 202 108 186 52 190 Z"
                />
              </g>

              {/* the eyes: narrow, angled down toward the middle, lit from
                  inside rather than filled flat */}
              <g className="hk-eyes">
                <path d="M78 216 C112 214 152 224 178 240 C150 250 106 246 76 238 C74 229 75 221 78 216 Z" />
                <path d="M322 216 C288 214 248 224 222 240 C250 250 294 246 324 238 C326 229 325 221 322 216 Z" />
              </g>
            </svg>

            <div className="hk-type">
              <div className="hk-brand">
                <span className="hk-brand-a">{brand}</span>
                <span className="hk-brand-b">{brand2}</span>
              </div>
              <div className="hk-caption">{caption}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hk-wave" aria-hidden />
      <div className="hk-sparks" aria-hidden>
        {SPARKS.map(([a, d, sc, dl], i) => (
          <span key={i} style={{ "--a": `${a}deg`, "--d": `${d}vw`, "--sc": sc, "--dl": `${dl}ms` }} />
        ))}
      </div>

      <div className="hk-flash" aria-hidden />
      <div className="hk-grain" aria-hidden />
      <div className="hk-vignette" aria-hidden />
    </div>
  );
}

function HulkDefs() {
  return (
    <svg className="hk-defs" aria-hidden focusable="false">
      <defs>
        {/* skin is not a flat fill: lit hard from the upper left, falling into
            deep green under the jaw */}
        <radialGradient id="hk-skinfill" cx="34%" cy="20%" r="88%">
          <stop offset="0%" stopColor="#b6ff63" />
          <stop offset="34%" stopColor="#71d92f" />
          <stop offset="70%" stopColor="#3f9d1e" />
          <stop offset="100%" stopColor="#1d5c12" />
        </radialGradient>

        {/* the hood: dark, but green — a black hood on a green head reads as
            two unrelated objects */}
        <radialGradient id="hk-hoodfill" cx="32%" cy="16%" r="92%">
          <stop offset="0%" stopColor="#2c5a2a" />
          <stop offset="42%" stopColor="#16341a" />
          <stop offset="100%" stopColor="#08170c" />
        </radialGradient>

        {/* the eyes burn from inside */}
        <radialGradient id="hk-eyefill" cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="38%" stopColor="#d8ff9a" />
          <stop offset="100%" stopColor="#7dff2e" />
        </radialGradient>

        {/* nothing under skin runs in a clean line */}
        <filter id="hk-vein" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="17" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
