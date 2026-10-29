// RhSpell.js — today's classes at Richmond Hill Jiu-Jitsu, cast by a wand.
//
// A candlelit stone hall, candles floating in the dark. A parchment scroll
// unrolls with the day at its head. A wand rises into frame and, for each
// class, winds up in a swish, flicks, and fires a jet of light — it slams
// into the page with a flash, a shockwave and a shower of sparks, and the
// class bursts onto the parchment from the point of impact. The page
// shimmers and RHBJJ.CA appears under the scroll.
//
// Wizard-school styling: no names, crests, characters, spell words or
// lettering from any film or book.
//
// Pure function of time:
//   ?render=1      window.__ready / __renderAt(ms) / __rhSpellEnd for
//                  tools/record-frames.js
//   ?static        the held final frame
//   ?day=Friday    any day of the week (default: today)
import React, { useEffect, useMemo, useRef } from "react";
import "../Stylesheets/RhSpell.css";

// Richmond Hill (King Rd) classes, as rhbjj.ca lists them.
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
  return { t: `${((hr + 11) % 12) + 1}:${String(m).padStart(2, "0")}`, ap: hr < 12 ? "AM" : "PM" };
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
const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const f1 = (n) => n.toFixed(1);
const seeded = (i, n) => {
  const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------------------------------------------------------------- layout */

const SX0 = 44;
const SX1 = 316;
const ROLL_TOP = 150;
const PAGE_BOTTOM = 494;
const BLOCK_H = 70;
const READY = [262, 574]; // where the wand tip rests between spells

/* ---------------------------------------------------------------- timing */

const T_UNROLL = [0.45, 1.25];
const T_WAND_IN = [1.05, 1.7];
const T_FIRST = 1.75;
const CYCLE = 1.25;
// within a cycle
const C_SWISH = 0.42; // wind-up loop ends
const C_FIRE = 0.5; // bolt leaves the tip
const C_HIT = 0.64; // bolt lands
const BOLT_LIFE = 0.32;

// spell colours: gold, house red, white-gold
const SPELL = [
  { core: "#fffbe8", mid: "#ffd25a", glow: "#ff9a1a" },
  { core: "#fff1ea", mid: "#ff5a4a", glow: "#e4002b" },
  { core: "#ffffff", mid: "#ffe9a8", glow: "#ffb83a" },
];

const BURST = 36;
const TRAIL = 70;

function plan(n) {
  const lines = Array.from({ length: n }, (_, i) => {
    const t0 = T_FIRST + i * CYCLE;
    return { t0, fire: t0 + C_FIRE, hit: t0 + C_HIT, end: t0 + CYCLE };
  });
  const fin = lines[n - 1].end;
  return { lines, finale: fin + 0.1, exit: fin + 0.25, end: fin + 2.6 };
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

  const areaTop = ROLL_TOP + 96;
  const areaH = PAGE_BOTTOM - 20 - areaTop;
  const blocksTop = areaTop + (areaH - classes.length * BLOCK_H) / 2;
  const blockY = (i) => blocksTop + i * BLOCK_H;
  const target = (i) => [180, blockY(i) + 30];

  const R = useRef({});
  const ref = (k) => (el) => {
    R.current[k] = el;
  };

  useEffect(() => {
    const r = R.current;
    const set = (k, a, v) => r[k] && r[k].setAttribute(a, v);
    const n = classes.length;

    // where the wand tip is
    function tip(t) {
      if (t < T_WAND_IN[1]) {
        const k = easeOut((t - T_WAND_IN[0]) / (T_WAND_IN[1] - T_WAND_IN[0]));
        return [lerp(420, READY[0], k), lerp(780, READY[1], k)];
      }
      for (let i = 0; i < n; i++) {
        const L = P.lines[i];
        if (t >= L.t0 && t < L.end) {
          const c = t - L.t0;
          const tg = target(i);
          const aim = Math.atan2(tg[1] - READY[1], tg[0] - READY[0]);
          if (c < C_SWISH) {
            // wind-up: a fast loop, drawn back away from the target
            const u = c / C_SWISH;
            const a = u * Math.PI * 2 * 1.15;
            const back = 26 * Math.sin(u * Math.PI);
            return [READY[0] + 20 * Math.sin(a) - Math.cos(aim) * back, READY[1] - 18 * (1 - Math.cos(a)) * 0.6 - Math.sin(aim) * back];
          }
          if (c < C_FIRE + 0.08) {
            // the flick: snapped hard toward the line
            const u = easeOut((c - C_SWISH) / (C_FIRE + 0.08 - C_SWISH));
            return [READY[0] + Math.cos(aim) * 34 * u, READY[1] + Math.sin(aim) * 34 * u];
          }
          // recoil and settle back to ready
          const u = ease((c - C_FIRE - 0.08) / (CYCLE - C_FIRE - 0.08));
          return [READY[0] + Math.cos(aim) * 34 * (1 - u) + 6 * Math.sin(u * 9) * (1 - u), READY[1] + Math.sin(aim) * 34 * (1 - u)];
        }
      }
      if (t < P.exit) return READY;
      const u = ease((t - P.exit) / 0.8);
      return [lerp(READY[0], 470, u), lerp(READY[1], 800, u)];
    }

    // how hard sparks pour off the tip
    function pour(t) {
      for (const L of P.lines) {
        const c = t - L.t0;
        if (c >= 0 && c < C_SWISH) return 0.55;
        if (c >= C_SWISH && c < C_FIRE + 0.1) return 1;
      }
      return t > T_WAND_IN[0] && t < P.exit ? 0.12 : 0;
    }

    // the spell's flight: a gentle curve from the wand tip to the line
    function jet(a, b) {
      const mx = (a[0] + b[0]) / 2;
      const my = (a[1] + b[1]) / 2;
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const L = Math.hypot(dx, dy) || 1;
      const c = [mx - (dy / L) * 34, my + (dx / L) * 34];
      return (u) => [
        (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0],
        (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1],
      ];
    }
    const seg = (B, u0, u1) => {
      let d = "";
      const N = 14;
      for (let k = 0; k <= N; k++) {
        const p = B(lerp(u0, u1, k / N));
        d += `${k ? " L" : "M"}${f1(p[0])},${f1(p[1])}`;
      }
      return d;
    };

    function render(ms) {
      const t = ms / 1000;
      
      if (r.fade) r.fade.style.opacity = f1(1 - smooth(t / 0.5));

      /* shake and flash: every impact kicks the frame */
      let sx = 0;
      let sy = 0;
      let flash = 0;
      P.lines.forEach((L) => {
        const u = t - L.hit;
        if (u > 0 && u < 0.6) {
          const e = Math.exp(-u * 9);
          sx += 7 * e * Math.sin(u * 90);
          sy += 5 * e * Math.cos(u * 110);
          flash = Math.max(flash, 0.55 * Math.exp(-u * 10));
        }
      });
      set("scene", "transform", `translate(${f1(sx)} ${f1(sy)})`);
      if (r.flash) r.flash.style.opacity = f1(flash);

      /* candles bob and flicker; castle windows flicker */
      for (let i = 0; i < 10; i++) {
        const c = r[`candle${i}`];
        if (!c) continue;
        c.setAttribute("transform", `translate(0 ${f1(Math.sin(t * (0.6 + seeded(i, 2) * 0.5) + i) * 6)})`);
        const fl = r[`flame${i}`];
        if (fl) fl.setAttribute("transform", `scale(${f1((0.85 + 0.15 * Math.sin(t * 17 + i * 3)) * 100) / 100} ${f1((0.9 + 0.2 * Math.sin(t * 11 + i)) * 100) / 100})`);
      }
      /* the scroll unrolls downward */
      const ur = ease((t - T_UNROLL[0]) / (T_UNROLL[1] - T_UNROLL[0]));
      const bottom = lerp(ROLL_TOP + 14, PAGE_BOTTOM, ur);
      set("page-clip", "height", f1(bottom - ROLL_TOP));
      set("roll-bottom", "transform", `translate(0 ${f1(bottom - PAGE_BOTTOM)})`);
      set("scroll", "opacity", f1(smooth((t - 0.3) / 0.3)));
      set("head", "opacity", f1(smooth((t - 1.0) / 0.5)));

      /* each line: bolt out, impact, the class bursting outward from the hit */
      for (let i = 0; i < n; i++) {
        const L = P.lines[i];
        const tg = target(i);
        const bu = t - L.fire;
        const bolt = r[`bolt${i}`];
        if (bolt) {
          const flight = C_HIT - C_FIRE;
          if (bu > 0 && bu < BOLT_LIFE) {
            const B = jet(tip(L.fire), tg);
            // the head flies out; after it lands the tail drains into the page
            const head = clamp(bu / flight, 0, 1);
            const drain = bu < flight ? 0 : (bu - flight) / (BOLT_LIFE - flight);
            const tail = clamp(Math.max(head - 0.75, drain), 0, 1);
            set(`boltg${i}`, "d", seg(B, tail, head));
            set(`boltm${i}`, "d", seg(B, Math.max(tail, head - 0.4), head));
            set(`boltc${i}`, "d", seg(B, Math.max(tail, head - 0.18), head));
            const hp = B(head);
            set(`bhead${i}`, "transform", `translate(${f1(hp[0])} ${f1(hp[1])}) scale(${f1(1 + 0.25 * Math.sin(t * 60))})`);
            set(`bhead${i}`, "opacity", bu < flight ? 1 : 0);
            // motes spiralling round the jet behind the head
            for (let m = 0; m < 10; m++) {
              const el = r[`bm${i}_${m}`];
              if (!el) continue;
              const u = head - m * 0.05;
              if (u <= tail || u <= 0) {
                el.setAttribute("opacity", 0);
                continue;
              }
              const p0 = B(u);
              const ang = u * 26 + m;
              el.setAttribute("cx", f1(p0[0] + Math.cos(ang) * 6));
              el.setAttribute("cy", f1(p0[1] + Math.sin(ang) * 6));
              el.setAttribute("opacity", f1(1 - m / 10));
            }
            bolt.setAttribute("opacity", 1);
          } else bolt.setAttribute("opacity", 0);
        }
        const hu = t - L.hit;
        if (hu > 0 && hu < 0.6) {
          set(`ring${i}`, "r", f1(8 + easeOut(hu / 0.6) * 140));
          set(`ring${i}`, "opacity", f1(0.9 * (1 - hu / 0.6)));
          set(`core${i}`, "opacity", f1(Math.max(0, 1 - hu / 0.3)));
          set(`core${i}`, "r", f1(14 + hu * 60));
        } else {
          set(`ring${i}`, "opacity", 0);
          set(`core${i}`, "opacity", 0);
        }
        // the reveal: from the impact out to both ends
        const half = t < L.hit ? 0 : easeOut((t - L.hit) / 0.32) * 160;
        set(`clip${i}`, "x", f1(tg[0] - half));
        set(`clip${i}`, "width", f1(half * 2));
        const glow = t < L.hit ? 0 : Math.max(0, 1 - (t - L.hit - 0.25) / 0.9);
        set(`glow${i}`, "opacity", f1(clamp(glow, 0, 1)));
        for (let j = 0; j < BURST; j++) {
          const el = r[`b${i}_${j}`];
          if (!el) continue;
          const age = t - L.hit;
          if (age <= 0 || age > 0.95) {
            el.setAttribute("opacity", 0);
            continue;
          }
          const a = seeded(j + i * 50, 1) * Math.PI * 2;
          const v = 90 + seeded(j + i * 50, 2) * 170;
          el.setAttribute("cx", f1(tg[0] + Math.cos(a) * v * age * (1 - age * 0.45)));
          el.setAttribute("cy", f1(tg[1] + Math.sin(a) * v * age * (1 - age * 0.45) + 120 * age * age));
          el.setAttribute("r", f1((0.8 + seeded(j, 3) * 1.8) * (1 - age)));
          el.setAttribute("opacity", f1(1 - age / 0.95));
        }
      }

      /* finale: a shimmer down the page, and the site */
      {
        const sh = (t - P.finale) / 1.1;
        set("shimmer", "opacity", sh > 0 && sh < 1 ? f1(Math.sin(sh * Math.PI) * 0.9) : 0);
        set("shimmer", "transform", `translate(0 ${f1(lerp(ROLL_TOP - 60, PAGE_BOTTOM + 40, clamp(sh, 0, 1)))})`);
        set("site", "opacity", f1(smooth((t - P.finale - 0.4) / 0.6)));
      }

      /* the wand */
      const tp = tip(t);
      const ang = 236 + (tp[0] - 200) * 0.12 + (tp[1] - READY[1]) * 0.05;
      set("wand", "transform", `translate(${f1(tp[0])} ${f1(tp[1])}) rotate(${f1(ang - 180)})`);
      const pw = pour(t);
      set("tipglow", "transform", `translate(${f1(tp[0])} ${f1(tp[1])}) scale(${f1(0.8 + pw * 0.9)})`);
      set("tipglow", "opacity", f1(clamp(0.3 + 0.7 * pw + 0.12 * Math.sin(t * 31), 0, 1)));

      /* the tip's trail of sparks: a fixed pool, each slot reborn at the tip */
      const RATE = 60;
      const LIFE = 0.8;
      const period = TRAIL / RATE;
      for (let j = 0; j < TRAIL; j++) {
        const el = r[`sp${j}`];
        if (!el) continue;
        const cyc = Math.floor((t - j / RATE) / period);
        const born = cyc * period + j / RATE;
        const age = t - born;
        const k = cyc * TRAIL + j;
        if (born < 0 || age > LIFE || seeded(k, 1) > pour(born)) {
          el.setAttribute("opacity", 0);
          continue;
        }
        const p0 = tip(born);
        const life = 1 - age / LIFE;
        el.setAttribute("cx", f1(p0[0] + (seeded(k, 2) - 0.5) * 60 * age));
        el.setAttribute("cy", f1(p0[1] + (-20 - seeded(k, 3) * 40) * age + 90 * age * age));
        el.setAttribute("r", f1((0.6 + seeded(k, 4) * 1.5) * (0.5 + 0.5 * life)));
        el.setAttribute("opacity", f1(life));
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
      fonts.then(() => {
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
    const step = (now) => {
      const ms = Math.min(now - t0, endMs);
      render(ms);
      if (ms < endMs) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [renderMode, still, classes, P, blocksTop]);

  const CANDLES = [
    [40, 70, 0.8],
    [96, 112, 0.6],
    [300, 60, 0.85],
    [262, 118, 0.55],
    [20, 300, 0.7],
    [336, 270, 0.75],
    [180, 34, 0.5],
    [338, 560, 0.65],
    [24, 590, 0.6],
    [60, 470, 0.5],
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
            <stop offset="0" stopColor="#ffc56a" stopOpacity="0.6" />
            <stop offset="1" stopColor="#ffc56a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rs-wax" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#b9a98c" />
            <stop offset="0.45" stopColor="#f3ead6" />
            <stop offset="1" stopColor="#a8987a" />
          </linearGradient>
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
          <filter id="rs-glow" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="rs-bloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
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
          <radialGradient id="rs-core">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.35" stopColor="#fff2c8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffb040" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rs-shimmer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff3c4" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff3c4" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
          </linearGradient>
          <clipPath id="rs-pageclip">
            <rect ref={ref("page-clip")} x={SX0 - 12} y={ROLL_TOP} width={SX1 - SX0 + 24} height="10" />
          </clipPath>
          {classes.map((_, i) => (
            <clipPath key={i} id={`rs-clip${i}`}>
              <rect ref={ref(`clip${i}`)} x="180" y={blockY(i) - 6} width="0" height={BLOCK_H} />
            </clipPath>
          ))}
        </defs>

        <g ref={ref("scene")}>
          {/* ---- the hall: warm stone falling off into the dark ---- */}
          <rect x="-20" y="-20" width={W + 40} height={H + 40} fill="url(#rs-hall)" />
          <rect x="-20" y="-20" width={W + 40} height={H + 40} filter="url(#rs-stone)" />

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

          {/* ---- the scroll ---- */}
          <g ref={ref("scroll")} opacity="0">
            <g clipPath="url(#rs-pageclip)">
              <g filter="url(#rs-edge)">
                <rect x={SX0} y={ROLL_TOP} width={SX1 - SX0} height={PAGE_BOTTOM - ROLL_TOP} fill="url(#rs-parch)" />
              </g>
              <rect x={SX0} y={ROLL_TOP} width={SX1 - SX0} height={PAGE_BOTTOM - ROLL_TOP} filter="url(#rs-fibre)" />
              <rect x={SX0} y={ROLL_TOP} width={SX1 - SX0} height={PAGE_BOTTOM - ROLL_TOP} filter="url(#rs-stains)" opacity="0.55" />
              <rect x={SX0} y={ROLL_TOP} width={SX1 - SX0} height="20" fill="#000" opacity="0.18" />
              <rect x={SX0} y={PAGE_BOTTOM - 20} width={SX1 - SX0} height="20" fill="#000" opacity="0.15" />

              <g ref={ref("head")} opacity="0">
                <text x="180" y={ROLL_TOP + 38} textAnchor="middle" className="rs-kicker">
                  TODAY AT THE ACADEMY
                </text>
                <text x="180" y={ROLL_TOP + 70} textAnchor="middle" className="rs-day">
                  {day.toUpperCase()}
                </text>
                {/* a flourished rule */}
                <path d={`M92,${ROLL_TOP + 82} C120,${ROLL_TOP + 76} 150,${ROLL_TOP + 86} 180,${ROLL_TOP + 80} C210,${ROLL_TOP + 86} 240,${ROLL_TOP + 76} 268,${ROLL_TOP + 82}`} stroke="#7a4a22" strokeWidth="1.1" fill="none" />
                <path d={`M180,${ROLL_TOP + 76} L184,${ROLL_TOP + 80} L180,${ROLL_TOP + 84} L176,${ROLL_TOP + 80} Z`} fill="#7a4a22" />
                <circle cx="92" cy={ROLL_TOP + 82} r="1.6" fill="#7a4a22" />
                <circle cx="268" cy={ROLL_TOP + 82} r="1.6" fill="#7a4a22" />
              </g>

              {classes.map(([name, a, b], i) => (
                <g key={i} clipPath={`url(#rs-clip${i})`}>
                  <text x="180" y={blockY(i) + 30} textAnchor="middle" className="rs-name">
                    {name}
                  </text>
                  <text x="180" y={blockY(i) + 52} textAnchor="middle" className="rs-time">
                    {span(a, b)}
                  </text>
                  <g ref={ref(`glow${i}`)} opacity="0" filter="url(#rs-glow)">
                    <text x="180" y={blockY(i) + 30} textAnchor="middle" className="rs-name rs-hot" style={{ fill: SPELL[i % SPELL.length].mid }}>
                      {name}
                    </text>
                    <text x="180" y={blockY(i) + 52} textAnchor="middle" className="rs-time rs-hot" style={{ fill: SPELL[i % SPELL.length].mid }}>
                      {span(a, b)}
                    </text>
                  </g>
                </g>
              ))}

              <rect ref={ref("shimmer")} x={SX0} y="-40" width={SX1 - SX0} height="80" fill="url(#rs-shimmer)" opacity="0" style={{ mixBlendMode: "screen" }} />
            </g>

            {[ROLL_TOP, PAGE_BOTTOM].map((y, k) => (
              <g key={k} ref={k ? ref("roll-bottom") : undefined}>
                <rect x={SX0 - 8} y={y - 8} width={SX1 - SX0 + 16} height="16" rx="8" fill="url(#rs-wood)" />
                <path d={`M${SX0 - 4},${y - 4} L${SX1 + 4},${y - 4}`} stroke="#c08a5a" strokeWidth="1" opacity="0.5" />
                {[SX0 - 14, SX1 + 14].map((x) => (
                  <g key={x}>
                    <rect x={x - 6} y={y - 9} width="12" height="18" rx="3" fill="url(#rs-brass)" />
                    <circle cx={x + (x < 180 ? -8 : 8)} cy={y} r="5" fill="url(#rs-brass)" />
                  </g>
                ))}
              </g>
            ))}
          </g>

          {/* ---- spells ---- */}
          {classes.map((_, i) => {
            const C = SPELL[i % SPELL.length];
            return (
              <g key={`s${i}`}>
                <g ref={ref(`bolt${i}`)} opacity="0" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path ref={ref(`boltg${i}`)} stroke={C.glow} strokeWidth="14" opacity="0.5" filter="url(#rs-bloom)" />
                  <path ref={ref(`boltm${i}`)} stroke={C.mid} strokeWidth="5" opacity="0.9" />
                  <path ref={ref(`boltc${i}`)} stroke={C.core} strokeWidth="2.2" />
                  <g ref={ref(`bhead${i}`)}>
                    <circle r="13" fill={C.glow} opacity="0.45" filter="url(#rs-bloom)" />
                    <circle r="6.5" fill={C.mid} />
                    <circle r="3.4" fill={C.core} />
                  </g>
                  {Array.from({ length: 10 }, (__, m) => (
                    <circle key={m} ref={ref(`bm${i}_${m}`)} r="1.4" fill={C.core} opacity="0" />
                  ))}
                </g>
                <circle ref={ref(`ring${i}`)} cx={target(i)[0]} cy={target(i)[1]} r="8" fill="none" stroke={C.mid} strokeWidth="2.4" opacity="0" />
                <circle ref={ref(`core${i}`)} cx={target(i)[0]} cy={target(i)[1]} r="14" fill="url(#rs-core)" opacity="0" />
                {Array.from({ length: BURST }, (__, j) => (
                  <circle key={j} ref={ref(`b${i}_${j}`)} r="1" fill={j % 4 === 0 ? "#ffffff" : C.mid} opacity="0" />
                ))}
              </g>
            );
          })}

          <text ref={ref("site")} x="180" y={PAGE_BOTTOM + 46} textAnchor="middle" className="rs-site" opacity="0">
            RHBJJ.CA
          </text>

          {/* ---- the wand ---- */}
          <g ref={ref("wand")}>
            <path d="M0,-1 L150,-3.4 L150,3.4 L0,1 Z" fill="url(#rs-wandwood)" />
            <path d="M2,-0.8 L150,-3" stroke="#d6a070" strokeWidth="0.6" opacity="0.6" />
            <path d="M150,-4.2 L156,-4.6 L156,4.6 L150,4.2 Z" fill="#2a160a" />
            <path d="M156,-4.6 C170,-6.2 186,-5.4 200,-4.8 L200,4.8 C186,5.4 170,6.2 156,4.6 Z" fill="url(#rs-wandwood)" />
            {[162, 172, 182, 192].map((x) => (
              <path key={x} d={`M${x},-5.6 C${x + 2},-2 ${x + 2},2 ${x},5.6`} stroke="#1a0c04" strokeWidth="0.9" fill="none" />
            ))}
            <ellipse cx="203" cy="0" rx="5" ry="6" fill="#3a1f0e" />
            <path d="M157,-4.4 C172,-5.8 186,-5 199,-4.4" stroke="#e0b07a" strokeWidth="0.7" fill="none" opacity="0.6" />
          </g>
          <g ref={ref("tipglow")} opacity="0">
            <circle r="18" fill="url(#rs-tip)" />
            <path d="M-11,0 L11,0 M0,-11 L0,11" stroke="#fff6dc" strokeWidth="0.9" opacity="0.9" />
          </g>
          {Array.from({ length: TRAIL }, (_, j) => (
            <circle key={j} ref={ref(`sp${j}`)} r="1" fill={j % 5 === 0 ? "#ffffff" : j % 3 === 0 ? "#ffe2a0" : "#ffc45a"} opacity="0" />
          ))}
        </g>
      </svg>
      <div className="rs-vignette" />
      <div className="rs-flash" ref={ref("flash")} />
      <div className="rs-grain" />
      <div className="rs-fade" ref={ref("fade")} />
    </div>
  );
}
