// Thanksgiving.js — a holiday-hours notice: Happy Thanksgiving, the mark, and
// "we're closed Monday, October 12" on a harvest card. Canadian Thanksgiving,
// so the leaves are maple.
//
// THE MARK KEEPS ITS OWN COLOURS (see Pirates). The theme lives on the stage —
// candlelit parchment falling off to burgundy at the edges, maple leaves coming
// down through it — so the hood stays black and CODE stays blue.
//
// The copy is the user's wording and the props below. The date is a claim on a
// public post: if the holiday moves year to year, change `date`, nothing else.
//
// Everything is one centred column inside the mark wrapper, so the headline,
// the mark, WOODBRIDGE and the card centre together as one lockup, and nothing
// moves when a later beat fades in.
import React from "react";
import "../Stylesheets/Thanksgiving.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 the light warms, leaves start · p2 the mark rises · p3 WOODBRIDGE
// p4 Happy Thanksgiving writes on · p5 the garland · p6 the closed card
const CUES = [200, 800, 1600, 2300, 3300, 4100];

const LEAF_COLOURS = ["#b3261e", "#e0701f", "#e9a92a", "#8a3a14", "#c4441b", "#d98c1f"];

// Falling leaves: x (vw), size (vw), fall duration (s), delay (s), sway (vw),
// static resting y (vh) for the still. Negative delays put them mid-flight.
const FALLING = [
  [4, 9, 9.5, -1.0, 6, 12],
  [16, 6, 11, -6.5, -5, 72],
  [27, 7, 10, -3.2, 7, 4],
  [40, 5, 12, -8.8, -6, 90],
  [52, 8, 9, -2.0, 5, 96],
  [63, 6, 11.5, -5.1, -7, 8],
  [74, 10, 10, -0.4, 6, 2],
  [86, 7, 9.5, -7.4, -5, 30],
  [94, 6, 12, -4.0, 4, 84],
  [9, 5, 13, -10.2, 5, 46],
  [33, 4, 12.5, -11.0, -4, 22],
  [58, 4.5, 13, -9.3, 6, 84],
  [81, 5, 12, -2.8, -6, 94],
  [21, 8, 10.5, -4.6, 6, 98],
];

// Foreground leaves — big, blurred, at the very edges, for depth. They fall
// past the frame, never across the copy.
const FOREGROUND = [
  [-4, 18, 7.5, -2.0, 6, 70],
  [92, 16, 8.5, -5.5, -6, 18],
];

// The garland under WOODBRIDGE: leaves fanned out from the centre, with a few
// cranberries tucked between. [x %, y %, size vw, rotation deg, colour index]
const GARLAND = [
  [50, 40, 12, 0, 0],
  [39, 44, 10.5, -26, 1],
  [61, 44, 10.5, 26, 2],
  [28, 36, 9, -50, 3],
  [72, 36, 9, 50, 4],
  [18, 26, 7.5, -70, 2],
  [82, 26, 7.5, 70, 1],
  [9, 14, 6, -88, 5],
  [91, 14, 6, 88, 0],
];
const BERRIES = [
  [44.5, 70],
  [55.5, 70],
  [33.5, 64],
  [66.5, 64],
  [23, 52],
  [77, 52],
];

export default function Thanksgiving({
  mode = "animated",
  caption = "WOODBRIDGE",
  date = "Monday, October 12",
  loopAt = 11000,
}) {
  const { src, logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="tg tg-p0" aria-hidden />;

  return (
    <div
      className={`tg tg-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      <ThanksgivingDefs />

      {/* ---- the stage: candlelight on parchment, burgundy at the edges ---- */}
      <div className="tg-stage" aria-hidden />
      <div className="tg-glow" aria-hidden />
      <div className="tg-tex" aria-hidden />

      {/* ---- leaves coming down behind the lockup ---- */}
      <div className="tg-fall-layer" aria-hidden>
        {FALLING.map((l, i) => (
          <Falling key={i} leaf={l} colour={LEAF_COLOURS[i % LEAF_COLOURS.length]} />
        ))}
      </div>

      {/* ---- the lockup ---- */}
      <div className="tg-markwrap">
        <div className="tg-head">
          <div className="tg-happy">Happy</div>
          <div className="tg-title">Thanksgiving</div>
          <svg className="tg-swash" viewBox="0 0 300 20" aria-hidden>
            <path pathLength="100" d="M6 12 C 70 2, 130 18, 190 9 S 270 4, 294 10" />
          </svg>
        </div>

        <div className="tg-markbox">
          <div className="tg-shadow" aria-hidden />
          <div className="tg-mark">
            <img className="tg-logo" src={src} alt="Code Ninjas" />
          </div>
        </div>

        {/* directly under the mark, in flow */}
        <div className="tg-caption">{caption}</div>

        <div className="tg-garland" aria-hidden>
          {GARLAND.map(([x, y, s, r, c], i) => (
            <div
              key={i}
              className="tg-g"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${s}vw`,
                "--r": `${r}deg`,
                "--d": `${Math.abs(x - 50) * 9}ms`,
                color: LEAF_COLOURS[c],
              }}
            >
              <Leaf />
            </div>
          ))}
          {BERRIES.map(([x, y], i) => (
            <span
              key={i}
              className="tg-berry"
              style={{ left: `${x}%`, top: `${y}%`, "--d": `${300 + Math.abs(x - 50) * 9}ms` }}
            />
          ))}
        </div>

        <div className="tg-card">
          <div className="tg-card-inner">
            <div className="tg-closed">We&rsquo;re closed</div>
            <div className="tg-date">{date}</div>
          </div>
        </div>
      </div>

      {/* ---- two big blurred leaves at the edges, in front, for depth ---- */}
      <div className="tg-fall-layer tg-fore" aria-hidden>
        {FOREGROUND.map((l, i) => (
          <Falling key={i} leaf={l} colour={i ? "#b3261e" : "#e0701f"} />
        ))}
      </div>

      <div className="tg-grain" aria-hidden />
      <div className="tg-vignette" aria-hidden />
    </div>
  );
}

// Outer div falls (linear), inner sways and tumbles (ease, alternate). Split so
// the two motions don't fight over one `transform`.
function Falling({ leaf: [x, s, dur, delay, sway, sy], colour }) {
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
        <Leaf />
      </div>
    </div>
  );
}

function Leaf() {
  return (
    <svg className="tg-leaf" viewBox="0 0 100 100">
      <use href="#tg-maple" />
    </svg>
  );
}

function ThanksgivingDefs() {
  return (
    <svg className="tg-defs" aria-hidden focusable="false">
      <defs>
        {/* A maple leaf, Canadian-flag style: the tall centre lobe, two side
            lobes, two small lower lobes, a stem. Mirrored by hand around x 50.
            Fills with currentColor so one symbol serves every colour. */}
        <symbol id="tg-maple" viewBox="0 0 100 100">
          <g filter="url(#tg-edge)">
            <path
              fill="currentColor"
              d="M50 2 L57 15 L64 11 L61 34 L74 21 L77 28 L90 25 L85 39 L92 42 L72 57 L76 65 L54 61 L53 80 L47 80 L46 61 L24 65 L28 57 L8 42 L15 39 L10 25 L23 28 L26 21 L39 34 L36 11 L43 15 Z"
            />
            <path
              fill="none"
              stroke="rgba(60,14,4,0.38)"
              strokeWidth="1.6"
              strokeLinecap="round"
              d="M50 80 L50 10 M50 56 L80 32 M50 56 L20 32 M50 64 L70 60 M50 64 L30 60"
            />
          </g>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            d="M50 78 C 50 86, 52 92, 56 97"
          />
        </symbol>

        {/* leaves are not machine-cut — roughen the edge a little */}
        <filter id="tg-edge" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
