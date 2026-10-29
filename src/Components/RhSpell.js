// RhSpell.js — today's classes at Richmond Hill Jiu-Jitsu, written by a wand.
//
// A candlelit stone hall, candles floating in the dark. A parchment scroll
// unrolls under the wolf logo with the day at its head; a wand comes in and
// casts each line onto the page — the tip sweeps across, the class name and
// time appear behind it in glowing gold that cools to ink, sparks spilling
// off the tip. On the last line it flicks, the page shimmers, RHBJJ.CA.
//
// Wizard-school styling only: no names, crests or lettering from any film.
//
// Pure function of time, like Spartan:
//   ?render=1      window.__ready / __renderAt(ms) / __rhSpellEnd for
//                  tools/record-frames.js
//   ?static        the held final frame
//   ?day=Friday    any day of the week (default: today)
import React, { useEffect, useMemo, useRef } from "react";
import "../Stylesheets/RhSpell.css";
import logo from "../Images/rhbjj-logo-white.png";

// Richmond Hill (King Rd) classes, as rhbjj.ca lists them — the sister
// academy's slots are not on this page and are not here either.
const SCHEDULE = {
  Monday: [
    ["Muay Thai", 18, 19],
    ["BJJ NoGi", 19, 20],
  ],
  Tuesday: [
    ["Kids BJJ", 18, 19],
    ["Teens BJJ", 19, 20],
    ["BJJ Gi", 20, 21],
  ],
  Wednesday: [
    ["Muay Thai", 18, 19],
    ["BJJ NoGi", 19, 20],
  ],
  Thursday: [
    ["Kids BJJ", 18, 19],
    ["Teens BJJ", 19, 20],
    ["BJJ Gi", 20, 21],
  ],
  Friday: [
    ["Kids Muay Thai", 17, 18],
    ["Muay Thai", 18, 19],
    ["BJJ NoGi", 19, 20],
  ],
  Saturday: [
    ["Kids BJJ", 11.5, 12.5],
    ["Wrestling", 12.5, 13.5],
  ],
};

const clock = (h) => {
  const hr = Math.floor(h);
  const m = Math.round((h - hr) * 60);
  const h12 = ((hr + 11) % 12) + 1;
  return { t: `${h12}:${String(m).padStart(2, "0")}`, ap: hr < 12 ? "AM" : "PM" };
};
const span = (a, b) => {
  const x = clock(a);
  const y = clock(b);
  return x.ap === y.ap ? `${x.t} – ${y.t} ${y.ap}` : `${x.t} ${x.ap} – ${y.t} ${y.ap}`;
};

const W = 360;
const H = 640;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
const ease = (t) => {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const f1 = (n) => n.toFixed(1);
const seeded = (i, n) => {
  const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------------------------------------------------------------- layout */

const SCROLL_X0 = 40;
const SCROLL_X1 = 320;
const ROLL_TOP = 176; // top roller centre
const PAGE_BOTTOM = 520; // bottom roller centre once unrolled
const WRITE_X0 = 64;
const WRITE_X1 = 298;
const BLOCK_H = 72;

/* ---------------------------------------------------------------- timing */

const T_UNROLL = [0.5, 1.3];
const T_WAND_IN = [1.1, 1.75];
const T_FIRST = 1.75;
const WRITE = 1.15;
const MOVE = 0.5;
const PARTICLES = 90;

function plan(n) {
  const lines = Array.from({ length: n }, (_, i) => {
    const t0 = T_FIRST + i * (WRITE + MOVE);
    return { t0, t1: t0 + WRITE };
  });
  const tEnd = lines[n - 1].t1;
  return { lines, finale: tEnd + 0.15, exit: tEnd + 0.9, end: tEnd + 3.4 };
}

export default function RhSpell({ mode = "animated", day: dayProp }) {
  const q = useMemo(() => new URLSearchParams(window.location.search), []);
  const renderMode = q.has("render");
  const still =
    mode === "static" || q.has("static") || (!!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const day = useMemo(() => {
    const want = q.get("day") || dayProp;
    if (want && SCHEDULE[want]) return want;
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return SCHEDULE[today] ? today : "Monday";
  }, [q, dayProp]);
  const classes = SCHEDULE[day];
  const P = useMemo(() => plan(classes.length), [classes.length]);

  // the blocks sit centred in the writing area of the page
  const areaTop = 262;
  const areaH = PAGE_BOTTOM - 30 - areaTop;
  const blocksTop = areaTop + (areaH - classes.length * BLOCK_H) / 2;
  const blockY = (i) => blocksTop + i * BLOCK_H;

  const R = useRef({});
  const ref = (k) => (el) => {
    R.current[k] = el;
  };

  useEffect(() => {
    const r = R.current;
    const set = (k, a, v) => r[k] && r[k].setAttribute(a, v);
    const n = classes.length;

    // where the wand tip is at time t (seconds)
    function tip(t) {
      const start = (i) => [WRITE_X0, blockY(i) + 34];
      if (t < T_WAND_IN[1]) {
        const k = ease((t - T_WAND_IN[0]) / (T_WAND_IN[1] - T_WAND_IN[0]));
        const s = start(0);
        return [lerp(430, s[0], k), lerp(720, s[1], k) - 40 * Math.sin(k * Math.PI)];
      }
      for (let i = 0; i < n; i++) {
        const L = P.lines[i];
        if (t < L.t1) {
          if (t < L.t0) break;
          const u = (t - L.t0) / WRITE;
          // a writing hand: steady sweep with small loops in it
          const x = lerp(WRITE_X0, WRITE_X1, ease(u)) + 3 * Math.sin(u * Math.PI * 10);
          const y = blockY(i) + 34 + 8 * Math.sin(u * Math.PI * 7) * Math.sin(u * Math.PI);
          return [x, y];
        }
        const next = P.lines[i + 1];
        if (next && t < next.t0) {
          const v = ease((t - L.t1) / MOVE);
          return [lerp(WRITE_X1, WRITE_X0, v), lerp(blockY(i) + 34, blockY(i + 1) + 34, v) - 34 * Math.sin(v * Math.PI)];
        }
      }
      const last = [WRITE_X1, blockY(n - 1) + 34];
      if (t < P.exit) {
        // the flick: up and over the page, a flourish
        const v = ease((t - P.lines[n - 1].t1) / (P.exit - P.lines[n - 1].t1));
        return [lerp(last[0], 236, v) + 30 * Math.sin(v * Math.PI), lerp(last[1], 214, v) - 50 * Math.sin(v * Math.PI)];
      }
      const v = ease((t - P.exit) / 0.7);
      return [lerp(236, 470, v), lerp(214, 760, v)];
    }

    // writing intensity: sparks pour while a line is being cast
    function casting(t) {
      for (const L of P.lines) if (t >= L.t0 && t <= L.t1) return 1;
      if (t >= P.lines[n - 1].t1 && t <= P.finale + 0.4) return 1.6;
      return t > T_WAND_IN[0] && t < P.exit ? 0.25 : 0;
    }

    function render(ms) {
      const t = ms / 1000;

      /* fade up */
      if (r.fade) r.fade.style.opacity = f1(1 - smooth(t / 0.6));

      /* floating candles bob and flicker */
      for (let i = 0; i < 9; i++) {
        const c = r[`candle${i}`];
        if (!c) continue;
        const by = Math.sin(t * (0.6 + seeded(i, 2) * 0.5) + i) * 6;
        c.setAttribute("transform", `translate(0 ${f1(by)})`);
        const fl = r[`flame${i}`];
        if (fl) {
          const k = 0.85 + 0.15 * Math.sin(t * 17 + i * 3) * Math.sin(t * 7.3 + i);
          fl.setAttribute("transform", `scale(${f1(k * 100) / 100} ${f1((0.9 + 0.2 * Math.sin(t * 11 + i)) * 100) / 100})`);
        }
      }

      /* the scroll unrolls downward */
      const ur = ease((t - T_UNROLL[0]) / (T_UNROLL[1] - T_UNROLL[0]));
      const bottom = lerp(ROLL_TOP + 10, PAGE_BOTTOM, ur);
      set("page-clip", "height", f1(bottom - ROLL_TOP));
      set("roll-bottom", "transform", `translate(0 ${f1(bottom - PAGE_BOTTOM)})`);
      set("scroll", "opacity", f1(smooth((t - 0.35) / 0.3)));
      set("head", "opacity", f1(smooth((t - 1.05) / 0.5)));

      /* each line, cast behind the tip */
      const tp = tip(t);
      for (let i = 0; i < n; i++) {
        const L = P.lines[i];
        let x;
        if (t <= L.t0) x = WRITE_X0 - 6;
        else if (t >= L.t1) x = WRITE_X1 + 30;
        else x = Math.max(WRITE_X0, tp[0]);
        set(`clip${i}`, "width", f1(Math.max(0, x - (WRITE_X0 - 20))));
        // the glow: hot as it goes down, cooling to ink after
        const after = t - L.t1;
        const glow = t < L.t0 ? 0 : after < 0 ? 1 : Math.max(0, 1 - after / 0.9);
        set(`glow${i}`, "opacity", f1(glow));
        // a little star-burst when the line completes
        const b = r[`done${i}`];
        if (b) {
          const k = (t - L.t1) / 0.5;
          if (k > 0 && k < 1) {
            b.setAttribute("opacity", f1(1 - k));
            b.setAttribute("transform", `translate(${WRITE_X1} ${f1(blockY(i) + 34)}) scale(${f1(0.4 + k * 1.4)})`);
          } else b.setAttribute("opacity", 0);
        }
      }

      /* the finale: a shimmer down the whole page, and the site */
      const sh = (t - P.finale) / 1.1;
      set("shimmer", "opacity", sh > 0 && sh < 1 ? f1(Math.sin(sh * Math.PI) * 0.9) : 0);
      set("shimmer", "transform", `translate(0 ${f1(lerp(ROLL_TOP - 60, PAGE_BOTTOM + 40, clamp(sh, 0, 1)))})`);
      set("site", "opacity", f1(smooth((t - P.finale - 0.5) / 0.6)));
      if (r.logo) r.logo.style.filter = `drop-shadow(0 0 ${f1(6 + 10 * Math.max(0, Math.sin(clamp((t - P.finale) / 1.2, 0, 1) * Math.PI)))}px rgba(255, 210, 130, 0.55))`;
      set("logo", "opacity", f1(smooth((t - 0.2) / 0.7)));

      /* the wand: held from below right, pointing its tip at the page */
      const ang = 238 + (tp[0] - 180) * 0.06 + 6 * Math.sin(t * 2.1);
      set("wand", "transform", `translate(${f1(tp[0])} ${f1(tp[1])}) rotate(${f1(ang - 180)})`);
      const cst = casting(t);
      set("tipglow", "transform", `translate(${f1(tp[0])} ${f1(tp[1])})`);
      set("tipglow", "opacity", f1(clamp(0.25 + 0.6 * cst + 0.15 * Math.sin(t * 23), 0, 1)));

      /* sparks: a fixed pool, each spawned at the tip at its own moment so the
         whole spray is a pure function of time */
      const RATE = 46;
      const LIFE = 1.05;
      for (let j = 0; j < PARTICLES; j++) {
        const el = r[`sp${j}`];
        if (!el) continue;
        // the most recent birth this slot owns
        const slotPeriod = PARTICLES / RATE;
        const born = Math.floor((t - j / RATE) / slotPeriod) * slotPeriod + j / RATE;
        const age = t - born;
        const k = Math.floor((t - j / RATE) / slotPeriod) * PARTICLES + j;
        const strength = casting(born);
        if (born < 0 || age > LIFE || seeded(k, 1) > strength) {
          el.setAttribute("opacity", 0);
          continue;
        }
        const p0 = tip(born);
        const burst = born > P.lines[n - 1].t1 && born < P.finale + 0.4 ? 2 : 1;
        const vx = (seeded(k, 2) - 0.5) * 70 * burst;
        const vy = (-30 - seeded(k, 3) * 50) * burst;
        const x = p0[0] + vx * age;
        const y = p0[1] + vy * age + 0.5 * 160 * age * age;
        const life = 1 - age / LIFE;
        el.setAttribute("cx", f1(x));
        el.setAttribute("cy", f1(y));
        el.setAttribute("r", f1((0.6 + seeded(k, 4) * 1.6) * (0.5 + 0.5 * life) * (0.75 + 0.25 * Math.sin(age * 40 + k))));
        el.setAttribute("opacity", f1(life * (0.7 + 0.3 * seeded(k, 5))));
      }

      /* dust motes drifting in the candlelight */
      for (let j = 0; j < 30; j++) {
        const el = r[`mote${j}`];
        if (!el) continue;
        const x = (seeded(j, 8) * W + t * (4 + seeded(j, 9) * 6) + Math.sin(t * 0.7 + j) * 6) % W;
        const y = (((seeded(j, 10) * H - t * (6 + seeded(j, 11) * 8)) % H) + H) % H;
        el.setAttribute("cx", f1(x));
        el.setAttribute("cy", f1(y));
      }
    }

    const endMs = Math.round(P.end * 1000);
    if (renderMode) {
      window.__renderAt = render;
      window.__rhSpellEnd = endMs;
      render(0);
      const fonts = document.fonts
        ? Promise.all([
            document.fonts.load('700 30px "Cinzel"'),
            document.fonts.load('400 15px "Cinzel"'),
            document.fonts.load('400 28px "IM Fell English"'),
          ]).then(() => document.fonts.ready)
        : Promise.resolve();
      const img = new Image();
      img.src = logo;
      Promise.all([fonts, img.decode().catch(() => {})]).then(() => {
        render(0);
        window.__ready = true;
      });
      return undefined;
    }
    if (still) {
      render(endMs);
      return undefined;
    }
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const ms = Math.min(now - t0, endMs);
      render(ms);
      if (ms < endMs) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [renderMode, still, classes, P, blocksTop]);

  const CANDLES = [
    [40, 70, 0.8],
    [96, 120, 0.6],
    [300, 60, 0.85],
    [262, 132, 0.55],
    [20, 300, 0.7],
    [336, 270, 0.75],
    [180, 28, 0.5],
    [338, 560, 0.65],
    [24, 590, 0.6],
  ];

  return (
    <div className={`rs${still ? " is-static" : ""}`}>
      <svg className="rs-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <radialGradient id="rs-hall" cx="0.5" cy="0.45" r="0.75">
            <stop offset="0" stopColor="#3a2a1c" />
            <stop offset="0.45" stopColor="#1b1510" />
            <stop offset="1" stopColor="#07060a" />
          </radialGradient>
          <filter id="rs-stone" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves="4" seed="5" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.42  0 0 0 0 0.36  0 0 0 0.22 0" />
          </filter>
          <radialGradient id="rs-flame" cx="0.5" cy="0.7" r="0.6">
            <stop offset="0" stopColor="#fffbe8" />
            <stop offset="0.35" stopColor="#ffd36e" />
            <stop offset="0.75" stopColor="#ff8a2a" stopOpacity="0.8" />
            <stop offset="1" stopColor="#ff6a1a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rs-halo">
            <stop offset="0" stopColor="#ffc56a" stopOpacity="0.7" />
            <stop offset="1" stopColor="#ffc56a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rs-wax" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#b9a98c" />
            <stop offset="0.45" stopColor="#f3ead6" />
            <stop offset="1" stopColor="#a8987a" />
          </linearGradient>
          {/* aged parchment, darker and foxed toward the edges */}
          <radialGradient id="rs-parch" cx="0.5" cy="0.45" r="0.75">
            <stop offset="0" stopColor="#f1dfb4" />
            <stop offset="0.6" stopColor="#e2c892" />
            <stop offset="1" stopColor="#b38e55" />
          </radialGradient>
          <filter id="rs-fibre" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9 0.35" numOctaves="3" seed="2" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.12  0 0 0 0.28 0" />
          </filter>
          <filter id="rs-stains" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="9" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.12  0 0 0 1.4 -0.75" />
          </filter>
          <filter id="rs-edge" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <linearGradient id="rs-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a4a26" />
            <stop offset="0.4" stopColor="#4a2a14" />
            <stop offset="1" stopColor="#1e0f06" />
          </linearGradient>
          <linearGradient id="rs-brass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe6a0" />
            <stop offset="0.4" stopColor="#c9952f" />
            <stop offset="1" stopColor="#6a4410" />
          </linearGradient>
          <linearGradient id="rs-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff3c4" />
            <stop offset="0.5" stopColor="#ffd06a" />
            <stop offset="1" stopColor="#e09a2a" />
          </linearGradient>
          <filter id="rs-glow" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="rs-wandwood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8a5a34" />
            <stop offset="0.45" stopColor="#5a341a" />
            <stop offset="1" stopColor="#24120a" />
          </linearGradient>
          <radialGradient id="rs-tip">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.25" stopColor="#fff0c0" stopOpacity="0.95" />
            <stop offset="0.6" stopColor="#ffc860" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ffa030" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rs-shimmer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff3c4" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff3c4" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
          </linearGradient>
          <clipPath id="rs-pageclip">
            <rect ref={ref("page-clip")} x={SCROLL_X0 - 10} y={ROLL_TOP} width={SCROLL_X1 - SCROLL_X0 + 20} height="10" />
          </clipPath>
          {classes.map((_, i) => (
            <clipPath key={i} id={`rs-clip${i}`}>
              <rect ref={ref(`clip${i}`)} x={WRITE_X0 - 20} y={blockY(i) - 6} width="0" height={BLOCK_H} />
            </clipPath>
          ))}
        </defs>

        {/* ---- the hall: warm stone falling off into the dark ---- */}
        <rect width={W} height={H} fill="url(#rs-hall)" />
        <rect width={W} height={H} filter="url(#rs-stone)" />
        {/* ---- floating candles ---- */}
        {CANDLES.map(([x, y, s], i) => (
          <g key={i} ref={ref(`candle${i}`)} opacity={0.55 + s * 0.5}>
            <g transform={`translate(${x} ${y}) scale(${s})`}>
              <circle cx="0" cy="-12" r="46" fill="url(#rs-halo)" />
              <rect x="-5" y="0" width="10" height="34" rx="2" fill="url(#rs-wax)" />
              <path d="M-5,2 C-3,6 -4,9 -2,12 L-2,2 Z M3,1 C4,8 2,10 4,15 L5,1 Z" fill="#fff8ea" opacity="0.8" />
              <path d="M0,0 L0,-4" stroke="#2a1a10" strokeWidth="1" />
              <g transform="translate(0 -5)">
                <g ref={ref(`flame${i}`)}>
                  <ellipse cx="0" cy="-9" rx="9" ry="13" fill="#ffb24a" opacity="0.35" />
                  <path d="M0,-24 C7,-14 7.5,-4 0,0 C-7.5,-4 -7,-14 0,-24 Z" fill="url(#rs-flame)" />
                </g>
              </g>
            </g>
          </g>
        ))}

        {/* ---- the wolf, over the scroll ---- */}
        <image ref={ref("logo")} href={logo} x="95" y="44" width="170" height="103.5" preserveAspectRatio="xMidYMid meet" opacity="0" />

        {/* ---- the scroll ---- */}
        <g ref={ref("scroll")} opacity="0">
          <g clipPath="url(#rs-pageclip)">
            <g filter="url(#rs-edge)">
              <rect x={SCROLL_X0} y={ROLL_TOP} width={SCROLL_X1 - SCROLL_X0} height={PAGE_BOTTOM - ROLL_TOP} fill="url(#rs-parch)" />
            </g>
            <rect x={SCROLL_X0} y={ROLL_TOP} width={SCROLL_X1 - SCROLL_X0} height={PAGE_BOTTOM - ROLL_TOP} filter="url(#rs-fibre)" />
            <rect x={SCROLL_X0} y={ROLL_TOP} width={SCROLL_X1 - SCROLL_X0} height={PAGE_BOTTOM - ROLL_TOP} filter="url(#rs-stains)" opacity="0.55" />
            {/* the paper curls into the rollers: shadow at top and bottom */}
            <rect x={SCROLL_X0} y={ROLL_TOP} width={SCROLL_X1 - SCROLL_X0} height="22" fill="#000" opacity="0.18" />
            <rect x={SCROLL_X0} y={PAGE_BOTTOM - 22} width={SCROLL_X1 - SCROLL_X0} height="22" fill="#000" opacity="0.15" />

            {/* the day at the head of the page */}
            <g ref={ref("head")} opacity="0">
              <text x="180" y="214" textAnchor="middle" className="rs-kicker">
                TODAY AT THE ACADEMY
              </text>
              <text x="180" y="246" textAnchor="middle" className="rs-day">
                {day.toUpperCase()}
              </text>
              {/* a flourished rule */}
              <path d="M92,258 C120,252 150,262 180,256 C210,262 240,252 268,258" stroke="#7a4a22" strokeWidth="1.1" fill="none" />
              <path d="M180,252 L184,256 L180,260 L176,256 Z" fill="#7a4a22" />
              <circle cx="92" cy="258" r="1.6" fill="#7a4a22" />
              <circle cx="268" cy="258" r="1.6" fill="#7a4a22" />
            </g>

            {/* faint guide lines where the spells will land */}
            {classes.map((_, i) => (
              <path key={`g${i}`} d={`M${WRITE_X0 + 10},${blockY(i) + 56} L${WRITE_X1 - 10},${blockY(i) + 56}`} stroke="#8a6034" strokeWidth="0.6" strokeDasharray="1 3" opacity="0.5" />
            ))}

            {/* each line: ink underneath, the gold glow on top, both revealed
                behind the wand tip */}
            {classes.map(([name, a, b], i) => (
              <g key={i} clipPath={`url(#rs-clip${i})`}>
                <text x="180" y={blockY(i) + 30} textAnchor="middle" className="rs-name">
                  {name}
                </text>
                <text x="180" y={blockY(i) + 52} textAnchor="middle" className="rs-time">
                  {span(a, b)}
                </text>
                <g ref={ref(`glow${i}`)} opacity="0" filter="url(#rs-glow)">
                  <text x="180" y={blockY(i) + 30} textAnchor="middle" className="rs-name rs-hot">
                    {name}
                  </text>
                  <text x="180" y={blockY(i) + 52} textAnchor="middle" className="rs-time rs-hot">
                    {span(a, b)}
                  </text>
                </g>
              </g>
            ))}

            {/* the finale's shimmer down the page */}
            <rect ref={ref("shimmer")} x={SCROLL_X0} y="-40" width={SCROLL_X1 - SCROLL_X0} height="80" fill="url(#rs-shimmer)" opacity="0" style={{ mixBlendMode: "screen" }} />
          </g>

          {/* rollers: turned wood with brass finials */}
          {[ROLL_TOP, PAGE_BOTTOM].map((y, k) => (
            <g key={k} ref={k ? ref("roll-bottom") : undefined}>
              <rect x={SCROLL_X0 - 8} y={y - 8} width={SCROLL_X1 - SCROLL_X0 + 16} height="16" rx="8" fill="url(#rs-wood)" />
              <path d={`M${SCROLL_X0 - 4},${y - 4} L${SCROLL_X1 + 4},${y - 4}`} stroke="#c08a5a" strokeWidth="1" opacity="0.5" />
              {[SCROLL_X0 - 14, SCROLL_X1 + 14].map((x) => (
                <g key={x}>
                  <rect x={x - 6} y={y - 9} width="12" height="18" rx="3" fill="url(#rs-brass)" />
                  <circle cx={x + (x < 180 ? -8 : 8)} cy={y} r="5" fill="url(#rs-brass)" />
                </g>
              ))}
            </g>
          ))}
        </g>

        {/* line-complete star bursts */}
        {classes.map((_, i) => (
          <g key={`d${i}`} ref={ref(`done${i}`)} opacity="0">
            {Array.from({ length: 8 }, (__, k) => {
              const a = (k / 8) * Math.PI * 2;
              const L = k % 2 ? 9 : 16;
              return <path key={k} d={`M${f1(Math.cos(a) * 3)},${f1(Math.sin(a) * 3)} L${f1(Math.cos(a) * L)},${f1(Math.sin(a) * L)}`} stroke="#fff1c0" strokeWidth="1.4" strokeLinecap="round" />;
            })}
          </g>
        ))}

        <text ref={ref("site")} x="180" y="566" textAnchor="middle" className="rs-site" opacity="0">
          RHBJJ.CA
        </text>

        {/* motes */}
        {Array.from({ length: 30 }, (_, j) => (
          <circle key={j} ref={ref(`mote${j}`)} r={0.5 + seeded(j, 12) * 0.9} fill="#ffdca0" opacity={0.25 + seeded(j, 13) * 0.35} />
        ))}

        {/* ---- the wand: drawn tip at the origin, running out along +x to the
            handle; placed and turned every frame ---- */}
        <g ref={ref("wand")}>
          <path d="M0,-1 L150,-3.4 L150,3.4 L0,1 Z" fill="url(#rs-wandwood)" />
          <path d="M2,-0.8 L150,-3" stroke="#d6a070" strokeWidth="0.6" opacity="0.6" />
          {/* carved handle: rings, a swelling grip, a knob */}
          <path d="M150,-4.2 L156,-4.6 L156,4.6 L150,4.2 Z" fill="#2a160a" />
          <path d="M156,-4.6 C170,-6.2 186,-5.4 200,-4.8 L200,4.8 C186,5.4 170,6.2 156,4.6 Z" fill="url(#rs-wandwood)" />
          {[162, 172, 182, 192].map((x) => (
            <path key={x} d={`M${x},-5.6 C${x + 2},-2 ${x + 2},2 ${x},5.6`} stroke="#1a0c04" strokeWidth="0.9" fill="none" />
          ))}
          <ellipse cx="203" cy="0" rx="5" ry="6" fill="#3a1f0e" />
          <path d="M157,-4.4 C172,-5.8 186,-5 199,-4.4" stroke="#e0b07a" strokeWidth="0.7" fill="none" opacity="0.6" />
        </g>
        <g ref={ref("tipglow")} opacity="0">
          <circle r="16" fill="url(#rs-tip)" />
          <path d="M-9,0 L9,0 M0,-9 L0,9" stroke="#fff6dc" strokeWidth="0.8" opacity="0.9" />
        </g>

        {/* sparks */}
        {Array.from({ length: PARTICLES }, (_, j) => (
          <circle key={j} ref={ref(`sp${j}`)} r="1" fill={j % 5 === 0 ? "#ffffff" : j % 3 === 0 ? "#ffe2a0" : "#ffc45a"} opacity="0" />
        ))}
      </svg>
      <div className="rs-vignette" />
      <div className="rs-grain" />
      <div className="rs-fade" ref={ref("fade")} />
    </div>
  );
}
