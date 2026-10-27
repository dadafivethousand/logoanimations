// MapleClimb.js — Maple Jiu-Jitsu hits 3,000 Instagram followers, told as a
// climb to a summit at dawn.
//
// One mountain under a pre-dawn sky. A climber with a headlamp works up a
// switchback trail, the lit trail drawing on behind them, and the follower
// count above the peak runs with them like an altimeter. Markers on the trail
// light as they pass 1,000, 2,000 and 2,500. At 3,000 they reach the top, the
// Maple flag goes up on the summit, and the sun breaks behind the peak.
//
//   1 the scene fades up   2 the climb   3 summit — flag, sunrise   4 thank you
//
// The climb is the only thing JS animates per frame (the climber has to sit on
// the trail and the counter has to print a number); everything else keys off
// the .mc-pN classes.
//
// EVERY STRING IS A PROP — public copy for the club, confirm before posting.
//
// URL switches:
//   ?phase=1..4   hold on one beat instead of playing
//   ?p=0..1       with ?phase=2, hold the climb at that fraction
//   ?static       the still, without editing App.js
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "../Stylesheets/MapleClimb.css";
import usePhases from "../Utils/usePhases";
import mapleLogo from "../Images/maple-logo.png";

//          scene  climb  summit  thanks
const CUES = [200, 1100, 6500, 7600];
const LOOP_AT = 12500;
const CLIMB_MS = 5300;
const TARGET = 3000;
const MARKS = [1000, 2000, 2500];

// switchbacks up the face, in the mountain's 200 x 250 box (y from -30)
const TRAIL = "M64 208 L134 190 L72 168 L128 147 L80 126 L121 106 L88 88 L113 70 L96 51 L97 34";

// slow at the bottom, steady up the middle, a last push to the top
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) * 0.35 + t * 0.65;

const STARS = Array.from({ length: 36 }, (_, i) => {
  const r = (n) => {
    const x = Math.sin(i * 78.233 + n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  return [r(1) * 100, r(2) * 55, 0.6 + r(3) * 1.4, r(4) * 3];
});

// [angle deg, distance, size] — snow kicked up when the pole goes in
const PUFF = Array.from({ length: 12 }, (_, i) => [180 + (i / 11) * 180 + (i % 2 ? 6 : -6), 9 + (i % 3) * 4, 1.6 + (i % 4) * 0.5]);

function Climber({ x, y, dir, walking }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="9" fill="url(#mc-lamp-halo)" />
      <g transform={`scale(${dir} 1)`} className={walking ? "mc-walking" : ""}>
        {/* legs */}
        <path className="mc-leg mc-leg-a" d="M0 -5 L-1.6 0" stroke="#f6efe6" strokeWidth="1.5" strokeLinecap="round" />
        <path className="mc-leg mc-leg-b" d="M0 -5 L1.6 0" stroke="#d9cfc2" strokeWidth="1.5" strokeLinecap="round" />
        {/* pack, body, head */}
        <rect x="-3.4" y="-10.2" width="2.6" height="4.6" rx="0.9" fill="#e4002b" />
        <path d="M0 -10.5 L0 -5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="0.3" cy="-12.4" r="1.7" fill="#ffffff" />
        {/* headlamp beam */}
        <path d="M1.6 -12.6 L9 -15.5 L9 -9.5 Z" fill="url(#mc-beam)" />
        <circle cx="1.8" cy="-12.6" r="0.6" fill="#fffbe0" />
        {/* trekking pole */}
        <path className="mc-pole" d="M0.6 -8.5 L3.2 0" stroke="#c8bfb2" strokeWidth="0.6" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Mountain({ progress, phase, still }) {
  const trailRef = useRef(null);
  const [len, setLen] = useState(0);
  const [marks, setMarks] = useState([]);

  useLayoutEffect(() => {
    const el = trailRef.current;
    if (!el) return;
    const L = el.getTotalLength();
    setLen(L);
    setMarks(MARKS.map((m) => ({ m, ...pointAt(el, (m / TARGET) * L) })));
  }, []);

  const el = trailRef.current;
  const at = el && len ? pointAt(el, progress * len) : { x: 64, y: 208 };
  const ahead = el && len ? pointAt(el, Math.min(len, progress * len + 1.5)) : { x: 70, y: 206 };
  const dir = progress >= 1 ? 1 : ahead.x >= at.x ? 1 : -1;
  const count = Math.round(progress * TARGET);

  return (
    <svg viewBox="0 -30 200 250" className="mc-svg" aria-hidden="true">
      <defs>
        <linearGradient id="mc-lit" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className="mc-lit-a" />
          <stop offset="1" className="mc-lit-b" />
        </linearGradient>
        <linearGradient id="mc-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="mc-shade-a" />
          <stop offset="1" className="mc-shade-b" />
        </linearGradient>
        <linearGradient id="mc-snow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" className="mc-snow-a" />
          <stop offset="1" className="mc-snow-b" />
        </linearGradient>
        <radialGradient id="mc-sun">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset="0.45" stopColor="#ffd77a" />
          <stop offset="1" stopColor="#ff9a4d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mc-lamp-halo">
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mc-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff6c4" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff6c4" stopOpacity="0" />
        </linearGradient>
        <filter id="mc-rock" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.09" numOctaves="3" seed="7" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
        <filter id="mc-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="mc-flagclip">
          <rect x="0" y="0" width="60" height="30" />
        </clipPath>
      </defs>

      {/* the sun, behind everything, rising at the summit */}
      <g transform="translate(100 36)">
      <g className="mc-sunwrap">
        <g className="mc-rays">
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d="M0 0 L-5 -150 L5 -150 Z" transform={`rotate(${i * 22.5})`} fill="#ffe6a8" opacity="0.16" />
          ))}
        </g>
        <circle r="46" fill="url(#mc-sun)" />
        <circle r="13" fill="#fff6d6" />
      </g>
      </g>

      {/* far range, in haze */}
      <path
        className="mc-far"
        d="M-20 220 L-20 120 L8 96 L22 108 L40 78 L56 100 L66 92 L74 104 L126 104 L136 90 L150 102 L166 72 L182 96 L196 86 L220 112 L220 220 Z"
      />

      {/* the mountain: a lit west face and a shaded east face */}
      <path
        d="M-10 220 L30 150 L48 132 L58 110 L72 88 L84 62 L93 45 L100 30 L108 46 L118 58 L126 80 L142 100 L156 128 L172 146 L210 220 Z"
        fill="url(#mc-lit)"
      />
      <path
        d="M100 30 L108 46 L118 58 L126 80 L142 100 L156 128 L172 146 L210 220 L118 220 L111 170 L105 120 L103 78 Z"
        fill="url(#mc-shade)"
      />
      <path
        d="M-10 220 L30 150 L48 132 L58 110 L72 88 L84 62 L93 45 L100 30 L108 46 L118 58 L126 80 L142 100 L156 128 L172 146 L210 220 Z"
        fill="#fff"
        filter="url(#mc-rock)"
        style={{ mixBlendMode: "multiply" }}
      />
      {/* ridge lines */}
      <path d="M58 110 L70 124 L64 146 M126 80 L120 96 L128 118 M84 62 L90 78" stroke="#000" strokeOpacity="0.22" strokeWidth="1" fill="none" />
      {/* snow cap */}
      <path
        d="M100 30 L93 45 L86 58 L91 57 L95 66 L100 58 L105 68 L110 60 L116 64 L118 58 L108 46 Z"
        fill="url(#mc-snow)"
      />
      <path d="M100 30 L103 78 L105 68 L100 58 Z" fill="#000" opacity="0.12" />

      {/* the trail: faint all the way up, lit where the climber has been */}
      <path d={TRAIL} className="mc-trail-dim" fill="none" />
      <path
        ref={trailRef}
        d={TRAIL}
        className="mc-trail-lit"
        fill="none"
        filter="url(#mc-glow)"
        style={len ? { strokeDasharray: len, strokeDashoffset: len * (1 - progress) } : { opacity: 0 }}
      />

      {/* altitude markers */}
      {marks.map(({ m, x, y }) => {
        const left = x > 100;
        return (
          <g key={m} transform={`translate(${x} ${y})`} className={`mc-mark${count >= m ? " is-hit" : ""}`}>
            <circle r="2.6" className="mc-mark-dot" />
            <g transform={`translate(${left ? 6 : -6} 0)`}>
              <rect x={left ? 0 : -24} y="-6" width="24" height="12" rx="2" className="mc-mark-tag" />
              <text x={left ? 12 : -12} y="3.4" textAnchor="middle" className="mc-mark-text">
                {m.toLocaleString("en-US")}
              </text>
            </g>
          </g>
        );
      })}

      {/* the summit flag */}
      <g transform="translate(103 33)">
        <g className="mc-pole-up">
          <path d="M0 0 V-54" stroke="#e9e3da" strokeWidth="1.8" strokeLinecap="round" />
          <circle cy="-54.5" r="1.6" fill="#ffd77a" />
        </g>
        <g transform="translate(0.9 -53)">
          <g className="mc-flag">
            <g className="mc-wave" clipPath="url(#mc-flagclip)">
              <rect x="0" y="0" width="15" height="30" fill="#e4002b" />
              <rect x="15" y="0" width="30" height="30" fill="#ffffff" />
              <rect x="45" y="0" width="15" height="30" fill="#e4002b" />
              <image href={mapleLogo} x="16" y="1" width="28" height="28" preserveAspectRatio="xMidYMid meet" />
              <rect x="0" y="0" width="60" height="30" fill="url(#mc-flagshade)" />
            </g>
          </g>
        </g>
        {!still && phase >= 3 && (
          <g className="mc-puff">
            {PUFF.map(([a, d, s], i) => (
              <circle key={i} r={s} fill="#fff" style={{ "--a": `${a}deg`, "--d": `${d}px` }} />
            ))}
          </g>
        )}
      </g>
      <defs>
        <linearGradient id="mc-flagshade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.18" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="0.55" stopColor="#000" stopOpacity="0.1" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      <Climber
        x={progress >= 1 ? 95 : at.x}
        y={progress >= 1 ? 34 : at.y}
        dir={dir}
        walking={!still && phase === 2 && progress < 1}
      />
    </svg>
  );
}

function pointAt(el, l) {
  const p = el.getPointAtLength(l);
  return { x: p.x, y: p.y };
}

function MapleClimb({ mode = "animated", label = "FOLLOWERS", thanks = "THANK YOU" }) {
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const reduced = useMemo(
    () => !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const still = mode === "static" || reduced || query.has("static");
  const { phase: live } = usePhases(CUES, { mode: still ? "static" : "animated", loopAt: LOOP_AT });
  const held = Number(query.get("phase")) || 0;
  const phase = held ? Math.min(4, Math.max(1, held)) : live;

  const [running, setRunning] = useState(0);
  useEffect(() => {
    if (phase !== 2 || held) return undefined;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / CLIMB_MS);
      setRunning(ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, held]);

  let progress = 0;
  if (phase >= 3) progress = 1;
  else if (phase === 2) progress = held ? Math.min(1, Math.max(0, Number(query.get("p")) || 0)) : running;
  const count = Math.round(progress * TARGET);

  return (
    <div className={`mc-stage mc-p${phase}${still ? " is-static" : ""}`}>
      <div className="mc-bg" aria-hidden="true">
        <div className="mc-sky" />
        <div className="mc-dawn" />
        <div className="mc-stars">
          {STARS.map(([l, t, s, d], i) => (
            <i key={i} style={{ left: `${l}%`, top: `${t}%`, "--s": s, "--d": `${d}s` }} />
          ))}
        </div>
        <div className="mc-valley" />
        <svg className="mc-grain">
          <filter id="mc-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#mc-noise)" />
        </svg>
      </div>

      <div className="mc-card">
        <div className="mc-count" aria-label={`${count.toLocaleString("en-US")} ${label}`}>
          {count
            .toLocaleString("en-US")
            .split("")
            .map((d, i) => (
              <span key={i} className={d === "," ? "mc-comma" : "mc-digit"}>
                {d}
              </span>
            ))}
        </div>
        <div className="mc-label">{label}</div>

        <div className="mc-mountain">
          <Mountain progress={progress} phase={phase} still={still} />
        </div>

        <div className="mc-thanks">{thanks}</div>
      </div>

      {!still && phase >= 3 && <div className="mc-flash" aria-hidden="true" />}
    </div>
  );
}

export default MapleClimb;
