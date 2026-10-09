// Thanksgiving.js — a generic holiday-hours notice any business can post: no
// logo, no name. Candlelit dusk, golden bokeh, a gust of maple leaves, then the
// leaves fly in from every direction and lock into a harvest wreath. A gold-foil
// "Happy Thanksgiving" tracks in across it, and CLOSED drops in letter by letter
// with the date under it. Canadian Thanksgiving, so the leaves are maple.
//
// Like Patriot and Hulk this uses no logo file at all. Every string is a prop;
// the date is a claim on a public post, so change `date` year to year.
//
// Wreath leaves: the PLACEMENT (rotate round the ring, push out to the radius)
// is on an outer div and the fly-in ANIMATION is on an inner one. A CSS
// animation's transform replaces the element's own, so putting both on one
// element would throw every leaf to the centre.
import React from "react";
import "../Stylesheets/Thanksgiving.css";
import usePhases from "../Utils/usePhases";

// p1 dusk, bokeh, the gust · p2 the wreath assembles · p3 Happy Thanksgiving
// p4 CLOSED slams in · p5 the date · p6 the foil shimmer starts
const CUES = [300, 1100, 2700, 3900, 5000, 5700];

const COLOURS = ["#c0281c", "#e8731f", "#f0a62b", "#8d3313", "#d9381e", "#e9c03a", "#6f1616", "#b8641a"];

// deterministic jitter, so every take and the still are the same picture
const rand = (i, salt = 1) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const OUTER = Array.from({ length: 26 }, (_, i) => ({
  a: (i / 26) * 360 + rand(i, 2) * 6,
  r: 30,
  s: 13 + rand(i, 3) * 3,
  tilt: 95 + rand(i, 4) * 40,
  c: COLOURS[i % COLOURS.length],
  shape: i % 4 === 3 ? "elm" : "maple",
  d: i * 38,
}));
const INNER = Array.from({ length: 16 }, (_, i) => ({
  a: (i / 16) * 360 + 11,
  r: 23.5,
  s: 9.5 + rand(i, 5) * 2,
  tilt: 60 + rand(i, 6) * 40,
  c: COLOURS[(i * 3 + 2) % COLOURS.length],
  shape: i % 3 === 1 ? "elm" : "maple",
  d: 260 + i * 55,
}));
const BERRIES = Array.from({ length: 8 }, (_, i) => ({
  a: (i / 8) * 360 + 22,
  d: 1300 + i * 60,
}));

// the gust: [top vh, size vw, delay ms, rise vh, colour]
const GUST = Array.from({ length: 22 }, (_, i) => [
  8 + rand(i, 7) * 84,
  6 + rand(i, 8) * 9,
  Math.round(rand(i, 9) * 700),
  -10 - rand(i, 10) * 25,
  COLOURS[i % COLOURS.length],
]);

// ambient fall: x vw, size vw, duration s, delay s, sway vw, static y vh
const FALLING = [
  [4, 8, 9.5, -1.0, 6, 10],
  [16, 5, 11, -6.5, -5, 78],
  [27, 6, 10, -3.2, 7, 4],
  [44, 4.5, 12, -8.8, -6, 92],
  [57, 7, 9, -2.0, 5, 96],
  [66, 5, 11.5, -5.1, -7, 6],
  [78, 9, 10, -0.4, 6, 88],
  [88, 6, 9.5, -7.4, -5, 22],
  [95, 5, 12, -4.0, 4, 70],
  [9, 4.5, 13, -10.2, 5, 50],
  [36, 3.5, 12.5, -11.0, -4, 14],
  [70, 4, 13, -9.3, 6, 60],
];

const BOKEH = Array.from({ length: 18 }, (_, i) => ({
  left: `${rand(i, 11) * 100}%`,
  top: `${rand(i, 12) * 100}%`,
  size: `${4 + rand(i, 13) * 16}vw`,
  blur: `${0.2 + rand(i, 14) * 1.4}vw`,
  dur: `${6 + rand(i, 15) * 6}s`,
  delay: `${-rand(i, 16) * 8}s`,
}));

export default function Thanksgiving({
  mode = "animated",
  happy = "Happy",
  title = "Thanksgiving",
  kicker = "We’re",
  closed = "Closed",
  date = "Monday · October 12",
  loopAt = 22000,
}) {
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt });

  return (
    <div className={`tg tg-p${phase} ${isStatic ? "is-static" : ""}`} key={run}>
      <ThanksgivingDefs />

      {/* ---- dusk, firelight, bokeh ---- */}
      <div className="tg-stage" aria-hidden />
      <div className="tg-fire" aria-hidden />
      <div className="tg-bokeh" aria-hidden>
        {BOKEH.map((b, i) => (
          <span
            key={i}
            style={{
              left: b.left,
              top: b.top,
              width: b.size,
              "--blur": b.blur,
              "--dur": b.dur,
              "--delay": b.delay,
            }}
          />
        ))}
      </div>

      {/* ---- leaves drifting down behind everything ---- */}
      <div className="tg-fall-layer" aria-hidden>
        {FALLING.map((l, i) => (
          <Falling key={i} leaf={l} colour={COLOURS[i % COLOURS.length]} shape={i % 3 ? "maple" : "elm"} />
        ))}
      </div>

      {/* ---- the lockup ---- */}
      <div className="tg-markwrap">
        <div className="tg-stack">
          <div className="tg-wreathbox">
            <div className="tg-wreath-glow" aria-hidden />
            <div className="tg-wreath" aria-hidden>
              {[...OUTER, ...INNER].map((l, i) => (
                <div
                  key={i}
                  className="tg-wl"
                  style={{
                    width: `${l.s}vw`,
                    marginLeft: `${-l.s / 2}vw`,
                    marginTop: `${-l.s / 2}vw`,
                    transform: `rotate(${l.a}deg) translateY(-${l.r}vw) rotate(${l.tilt}deg)`,
                  }}
                >
                  <div
                    className="tg-wl-in"
                    style={{ "--d": `${l.d}ms`, "--spin": `${rand(i, 20) > 0.5 ? 1 : -1}`, color: l.c }}
                  >
                    <Leaf shape={l.shape} />
                  </div>
                </div>
              ))}
              {BERRIES.map((b, i) => (
                <div
                  key={`b${i}`}
                  className="tg-berries"
                  style={{ transform: `rotate(${b.a}deg) translateY(-27vw)`, "--d": `${b.d}ms` }}
                >
                  <span />
                  <span />
                  <span />
                </div>
              ))}
            </div>

            <div className="tg-head">
              <div className="tg-happy">{happy}</div>
              <div className="tg-title">{title}</div>
            </div>
          </div>

          <div className="tg-notice">
            <div className="tg-kicker">
              <span className="tg-rule" aria-hidden />
              {kicker}
              <span className="tg-rule" aria-hidden />
            </div>
            <div className="tg-closed" aria-label={closed}>
              {[...closed].map((ch, i) => (
                <span key={i} style={{ "--i": i }} aria-hidden>
                  {ch}
                </span>
              ))}
            </div>
            <div className="tg-date">{date}</div>
          </div>
        </div>
      </div>

      {/* ---- the gust, in front: a wall of leaves blown across the frame ---- */}
      <div className="tg-gust" aria-hidden>
        {GUST.map(([top, s, delay, rise, c], i) => (
          <div
            key={i}
            className="tg-gl"
            style={{
              top: `${top}vh`,
              width: `${s}vw`,
              "--delay": `${delay}ms`,
              "--rise": `${rise}vh`,
              color: c,
            }}
          >
            <Leaf shape={i % 3 ? "maple" : "elm"} />
          </div>
        ))}
      </div>

      <div className="tg-grain" aria-hidden />
      <div className="tg-vignette" aria-hidden />
    </div>
  );
}

// Outer div falls (linear), inner sways and tumbles — split so the two motions
// don't fight over one transform.
function Falling({ leaf: [x, s, dur, delay, sway, sy], colour, shape }) {
  return (
    <div
      className="tg-fall"
      style={{
        left: `${x}vw`,
        width: `${s}vw`,
        "--dur": `${dur}s`,
        "--delay": `${delay}s`,
        "--sway": `${sway}vw`,
        "--sy": `${sy}vh`,
        color: colour,
      }}
    >
      <div className="tg-sway" style={{ "--sdur": `${dur / 3}s`, "--sdelay": `${delay / 2}s` }}>
        <Leaf shape={shape} />
      </div>
    </div>
  );
}

function Leaf({ shape = "maple" }) {
  return (
    <svg className="tg-leaf" viewBox="0 0 100 100">
      <use href={`#tg-${shape}`} />
    </svg>
  );
}

const MAPLE =
  "M50 2 L55 12 L58 9 L57 17 L64 10 L61 34 L68 27 L74 21 L76 27 L82 24 L90 25 L86 33 L85 39 L92 42 L84 47 L72 57 L76 65 L66 63 L54 61 L53 80 L47 80 L46 61 L34 63 L24 65 L28 57 L16 47 L8 42 L15 39 L14 33 L10 25 L18 24 L24 27 L26 21 L32 27 L39 34 L36 10 L43 17 L42 9 L45 12 Z";
const ELM =
  "M50 4 C 64 14, 80 32, 77 56 C 75 70, 62 80, 50 83 C 38 80, 25 70, 23 56 C 20 32, 36 14, 50 4 Z";

function ThanksgivingDefs() {
  return (
    <svg className="tg-defs" aria-hidden focusable="false">
      <defs>
        {/* one light direction for every leaf, whatever its colour: lit from the
            top left, falling into shade bottom right */}
        <linearGradient id="tg-shade" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#fff6d8" stopOpacity="0.45" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#1a0402" stopOpacity="0.5" />
        </linearGradient>

        <symbol id="tg-maple" viewBox="0 0 100 100">
          <path fill="currentColor" d={MAPLE} />
          <path fill="url(#tg-shade)" d={MAPLE} />
          <path
            fill="none"
            stroke="rgba(40,8,2,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
            d="M50 80 L50 10 M50 58 L80 30 M50 58 L20 30 M50 66 L72 60 M50 66 L28 60 M50 40 L62 30 M50 40 L38 30"
          />
          <path fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" d="M50 78 C 50 86, 52 92, 56 97" />
        </symbol>

        <symbol id="tg-elm" viewBox="0 0 100 100">
          <path fill="currentColor" d={ELM} />
          <path fill="url(#tg-shade)" d={ELM} />
          <path
            fill="none"
            stroke="rgba(40,8,2,0.4)"
            strokeWidth="1.4"
            strokeLinecap="round"
            d="M50 84 L50 10 M50 30 L64 22 M50 30 L36 22 M50 44 L70 36 M50 44 L30 36 M50 58 L71 52 M50 58 L29 52 M50 70 L64 68 M50 70 L36 68"
          />
          <path fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" d="M50 82 C 50 88, 51 93, 54 98" />
        </symbol>
      </defs>
    </svg>
  );
}
