// MapleBelt.js — Maple Jiu-Jitsu hits 3,000 Instagram followers, told as a
// belt promotion.
//
// A white belt lies across the mat under a follower counter. As the count
// climbs, the belt earns its stripes — one strip of tape slapped onto the bar
// every 600 followers, four in all, the way a real white belt fills up. At
// 3,000 the promotion lands: the belt wipes to black with the red bar, the
// number slams, the frame shakes, and THANK YOU comes up under it.
//
//   1 the leaf drops in   2 the count runs, stripes land   3 3,000 — black belt
//   4 thank you
//
// The count is the only thing JS animates frame by frame (it has to print a
// number); everything else keys off the .mb-pN classes.
//
// EVERY STRING IS A PROP — public copy for the club, confirm before posting.
//
// URL switches:
//   ?phase=1..4   hold on one beat instead of playing
//   ?count=N      with ?phase=2, hold the counter (and its stripes) at N
//   ?static       the still, without editing App.js
import React, { useEffect, useMemo, useState } from "react";
import "../Stylesheets/MapleBelt.css";
import usePhases from "../Utils/usePhases";
import mapleLogo from "../Images/maple-logo.png";

//          leaf  count  promote  thanks
const CUES = [200, 1300, 6100, 6900];
const LOOP_AT = 11500;
const COUNT_MS = 4700;
const TARGET = 3000;
const STRIPE_EVERY = 600; // 4 stripes on the way to 3,000

const easeInOut = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

// [angle deg, distance u, size u, spin deg, delay s, colour]
const CONFETTI = Array.from({ length: 44 }, (_, i) => {
  const r = (n) => {
    const x = Math.sin(i * 91.7 + n * 47.3) * 43758.5453;
    return x - Math.floor(x);
  };
  const colours = ["#ffffff", "#e4002b", "#f4efe4", "#7fa6ff", "#ffffff"];
  return [r(1) * 360, 30 + r(2) * 42, 1.2 + r(3) * 1.6, (r(4) - 0.5) * 900, r(5) * 0.12, colours[i % colours.length]];
});

// four stripe slots on the bar, laid from the tip end inward (belt units)
const STRIPE_X = [318, 302, 286, 270];

/* One belt, drawn in a 400 x 64 box: the long end comes in from the left and
   fades, the bar sits near the tip. `tone` picks the cloth and the bar. */
function Belt({ tone, stripes = 0 }) {
  const id = `mb-${tone}`;
  const cloth = tone === "white" ? ["#ffffff", "#ece8df", "#c9c3b6"] : ["#3a3a3f", "#1b1b1f", "#070708"];
  const bar = tone === "white" ? ["#2a2a2e", "#111114", "#000"] : ["#ff2a47", "#e4002b", "#8f0019"];
  const stitch = tone === "white" ? "#b8b1a2" : "#3c3c42";
  return (
    <svg viewBox="0 0 400 64" className="mb-belt-svg" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={cloth[0]} />
          <stop offset="0.45" stopColor={cloth[1]} />
          <stop offset="1" stopColor={cloth[2]} />
        </linearGradient>
        <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bar[0]} />
          <stop offset="0.5" stopColor={bar[1]} />
          <stop offset="1" stopColor={bar[2]} />
        </linearGradient>
        <filter id={`${id}-weave`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.25" numOctaves="2" seed="4" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope={tone === "white" ? 0.22 : 0.3} />
          </feComponentTransfer>
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
        <clipPath id={`${id}-shape`}>
          <path d="M0 6 H382 C390 6 394 10 394 18 V46 C394 54 390 58 382 58 H0 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-shape)`}>
        <rect x="0" y="0" width="400" height="64" fill={`url(#${id}-cloth)`} />
        <rect x="262" y="0" width="80" height="64" fill={`url(#${id}-bar)`} />
        {/* rows of stitching run the length of the belt, over the bar too */}
        {[13, 19, 25, 31, 37, 43, 49].map((y) => (
          <path
            key={y}
            d={`M0 ${y} H390`}
            stroke={stitch}
            strokeWidth="0.9"
            strokeDasharray="3.2 1.6"
            opacity="0.75"
          />
        ))}
        <path d="M262 6 V58 M342 6 V58" stroke="#000" strokeOpacity="0.35" strokeWidth="1.2" />
        <rect x="0" y="0" width="400" height="64" fill="#fff" filter={`url(#${id}-weave)`} style={{ mixBlendMode: "multiply" }} />
        {/* lit top edge, shaded underside: a rolled, padded belt */}
        <path d="M0 8 H384" stroke="#fff" strokeOpacity={tone === "white" ? 0.9 : 0.22} strokeWidth="2" />
        <path d="M0 56 H384" stroke="#000" strokeOpacity="0.35" strokeWidth="3" />
      </g>
      {Array.from({ length: stripes }, (_, k) => (
        <g key={k} transform={`translate(${STRIPE_X[k]} 32)`}>
          <g className="mb-tape">
            <rect x="-5" y="-25" width="10" height="50" rx="0.8" fill="#fbfaf6" />
            <rect x="-5" y="-25" width="10" height="50" rx="0.8" fill="#fff" filter="url(#mb-white-weave)" style={{ mixBlendMode: "multiply" }} />
            <path d="M-5 -26 V26" stroke="#000" strokeOpacity="0.18" strokeWidth="1" />
            <path d="M-5 -26 L-3 -24 L-5 -22 L-3 -20 M5 26 L3 24 L5 22 L3 20" stroke="#d9d4c8" strokeWidth="0.8" fill="none" />
          </g>
        </g>
      ))}
    </svg>
  );
}

const rankLabel = (stripes, black) => {
  if (black) return "BLACK BELT";
  if (!stripes) return "WHITE BELT";
  return `WHITE BELT · ${stripes} STRIPE${stripes > 1 ? "S" : ""}`;
};

function MapleBelt({
  mode = "animated",
  kicker = "WE JUST HIT",
  label = "FOLLOWERS",
  thanks = "THANK YOU",
}) {
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const reduced = useMemo(
    () => !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const still = mode === "static" || reduced || query.has("static");
  const { phase: live } = usePhases(CUES, { mode: still ? "static" : "animated", loopAt: LOOP_AT });
  const held = Number(query.get("phase")) || 0;
  const phase = held ? Math.min(4, Math.max(1, held)) : live;
  const heldCount = query.get("count");

  const [running, setRunning] = useState(0);
  useEffect(() => {
    if (phase !== 2 || held) return undefined;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / COUNT_MS);
      setRunning(Math.round(TARGET * easeInOut(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, held]);

  let count = 0;
  if (phase >= 3) count = TARGET;
  else if (phase === 2) count = held ? Number(heldCount) || 0 : running;

  const black = phase >= 3;
  const stripes = Math.min(4, Math.floor(count / STRIPE_EVERY));
  const digits = count.toLocaleString("en-US").split("");

  return (
    <div className={`mb-stage mb-p${phase}${still ? " is-static" : ""}`}>
      <div className="mb-bg" aria-hidden="true">
        <div className="mb-mat" />
        <div className="mb-spot" />
        <div className="mb-vignette" />
        <svg className="mb-grain">
          <filter id="mb-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#mb-noise)" />
        </svg>
      </div>

      <div className="mb-shake">
        <div className="mb-card">
          <img className="mb-logo" src={mapleLogo} alt="Maple Jiu-Jitsu" />
          <div className="mb-kicker">{kicker}</div>

          <div className="mb-count" aria-label={`${count.toLocaleString("en-US")} ${label}`}>
            {digits.map((d, i) => (
              <span key={i} className={d === "," ? "mb-comma" : "mb-digit"}>
                {d}
              </span>
            ))}
          </div>
          <div className="mb-label">{label}</div>

          <div className="mb-beltbox">
            <div className="mb-belt mb-belt-white">
              <Belt tone="white" stripes={stripes} />
            </div>
            <div className="mb-belt mb-belt-black">
              <Belt tone="black" />
            </div>
            {!still && black && <i className="mb-sheen" aria-hidden="true" />}
          </div>
          <div className="mb-rank" key={rankLabel(stripes, black)}>
            {rankLabel(stripes, black)}
          </div>

          <div className="mb-thanks">{thanks}</div>

          {!still && black && (
            <div className="mb-fx" aria-hidden="true">
              <i className="mb-ring" />
              <i className="mb-ring mb-ring-2" />
              {CONFETTI.map(([a, d, s, spin, dl, c], i) => (
                <i
                  key={i}
                  className="mb-bit"
                  style={{ "--a": `${a}deg`, "--d": d, "--s": s, "--spin": `${spin}deg`, "--dl": `${dl}s`, background: c }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {!still && black && <div className="mb-flash" aria-hidden="true" />}
    </div>
  );
}

export default MapleBelt;
