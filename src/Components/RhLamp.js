// RhLamp.js — a day's classes at Richmond Hill Jiu-Jitsu, delivered by a
// hopping desk lamp, animation-studio-intro style.
//
// A dark stage with a reflective floor. A desk lamp hops in from the right;
// every time it lands — squash, thud, a flare of its bulb — the next class
// pops up on screen. Then the letters JIU JITSU drop onto the floor one by
// one; the lamp eyes them, hops up onto the first I, squashes it flat in
// three stomps, drops into its place, and turns its light on the camera.
//
// Pure function of time:
//   ?render=1      window.__ready / __renderAt(ms) / __rhLampEnd for
//                  tools/record-frames.js
//   ?static        the held final frame
//   ?day=Tuesday   any day of the week (default: today)
import React, { useEffect, useMemo, useRef } from "react";
import "../Stylesheets/RhLamp.css";

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
const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const pop = (t) => {
  const x = clamp(t, 0, 1);
  return 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2);
};
const f1 = (n) => n.toFixed(1);
const f3 = (n) => (Math.round(n * 1000) / 1000).toString();

/* ---------------------------------------------------------------- layout */

const FLOOR = 520;
const HEAD_Y = 132;
const ROW0 = 214;
const ROW_H = 66;

// the wordmark, letter by letter (advance widths for the display face at 54px)
const WORD = "JIU JITSU";
const ADV = { J: 23, I: 14.5, U: 28, " ": 13, T: 24.5, S: 24.5 };
// the I the lamp takes over gets extra room either side: the lamp's base is
// much wider than the letter it replaces
const I_IDX = 1;
const I_ROOM = 15;
const WORD_X = (() => {
  const adv = [...WORD].map((c, k) => ADV[c] + 2 + (k === I_IDX ? I_ROOM * 2 : 0));
  const total = adv.reduce((a, b) => a + b, -2);
  let x = 180 - total / 2;
  return [...WORD].map((c, k) => {
    const at = x + adv[k] / 2 - 1;
    x += adv[k];
    return at;
  });
})();
const LAMP_S = 1.5; // the lamp stands well over the letters
const LETTER_H = 31.8; // the I's actual ink height at 46px — the lamp lands right on it

/* ---------------------------------------------------------------- timing */

const T_IN = 0.55;
const HOP = 0.62; // each hop, takeoff to landing
const T_LETTERS = (n) => T_IN + n * HOP + 0.15;

function plan(n) {
  // hops: [takeoff, landing, x0, x1, height, landing y]
  const hops = [];
  const xs = [440, 300, 226, 152, 118];
  for (let i = 0; i < n; i++) hops.push([T_IN + i * HOP, T_IN + (i + 1) * HOP - 0.08, xs[i], xs[i + 1], 52, FLOOR]);
  // after the classes: back out to the right to watch the letters land
  const tl = T_LETTERS(n);
  const back = [hops[n - 1][1] + 0.1, tl + 0.05, xs[n], 336, 44, FLOOR];
  hops.push(back);
  const lettersDone = tl + WORD.length * 0.09 + 0.35;
  // up onto the I, three stomps, then down into its place
  const ix = WORD_X[I_IDX];
  const onI = [lettersDone + 0.35, lettersDone + 0.95, 336, ix, 160, FLOOR - LETTER_H];
  hops.push(onI);
  const stomps = [onI[1] + 0.18, onI[1] + 0.48, onI[1] + 0.78];
  const settle = onI[1] + 1.05;
  return { hops, landings: hops.slice(0, n).map((h) => h[1]), tl, lettersDone, onI, stomps, settle, look: settle + 0.45, end: settle + 2.6 };
}

export default function RhLamp({ mode = "animated", day: dayProp }) {
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
  const n = classes.length;
  const P = useMemo(() => plan(n), [n]);

  const R = useRef({});
  const ref = (k) => (el) => {
    R.current[k] = el;
  };

  useEffect(() => {
    const r = R.current;
    const set = (k, a, v) => r[k] && r[k].setAttribute(a, v);

    // the lamp's pose at time t: where its base is, how crouched, how squashed
    function lamp(t) {
      let x = 420;
      let y = FLOOR;
      let crouch = 0;
      let squash = 0;
      let tilt = 0;
      for (const [a, b, x0, x1, h, yl] of P.hops) {
        const y0 = y;
        if (t >= a - 0.14 && t < a) {
          // wind up for the jump
          crouch = Math.max(crouch, Math.sin(((t - (a - 0.14)) / 0.14) * Math.PI * 0.5));
        }
        if (t >= a && t < b) {
          const u = (t - a) / (b - a);
          x = lerp(x0, x1, u);
          y = lerp(y0, yl, u) - 4 * h * u * (1 - u);
          crouch = 0;
          squash = -0.12 * Math.sin(u * Math.PI); // stretched in the air
          tilt = (x1 < x0 ? -1 : 1) * 10 * Math.sin(u * Math.PI);
          return { x, y, crouch, squash, tilt, air: true };
        }
        if (t >= b) {
          x = x1;
          y = yl;
          const v = t - b;
          if (v < 0.22) {
            squash = 0.28 * Math.sin((v / 0.22) * Math.PI) * (1 - v / 0.22 * 0.4);
            crouch = Math.max(crouch, 0.8 * Math.sin((v / 0.22) * Math.PI));
          }
        }
      }
      // the stomps on the I, then the drop into its place
      const ix = WORD_X[I_IDX];
      if (t >= P.onI[1]) {
        const iH = iHeight(t);
        y = FLOOR - iH;
        x = ix;
        for (const s of P.stomps) {
          const v = t - (s - 0.12);
          if (v > 0 && v < 0.12) {
            y -= 26 * Math.sin((v / 0.12) * Math.PI);
            crouch = 0;
          }
          const w = t - s;
          if (w > 0 && w < 0.16) {
            squash = Math.max(squash, 0.3 * Math.sin((w / 0.16) * Math.PI));
            crouch = Math.max(crouch, 0.9 * Math.sin((w / 0.16) * Math.PI));
          }
        }
      }
      return { x, y, crouch, squash, tilt, air: false };
    }
    // the I gets shorter with every stomp, and is gone after the last
    function iHeight(t) {
      let k = 1;
      P.stomps.forEach((s, i) => {
        if (t >= s) k = [0.62, 0.3, 0][i];
      });
      if (t >= P.settle) k = 0;
      return LETTER_H * k;
    }

    function render(ms) {
      const t = ms / 1000;
      if (r.fade) r.fade.style.opacity = f1(1 - smooth(t / 0.5));
      set("head", "opacity", f1(smooth((t - 0.2) / 0.4)));

      /* the lamp */
      const L = lamp(t);
      const facing = t < P.hops[n][0] ? -1 : t < P.onI[0] ? 1 : -1;
      // arms: lower leans back, upper reaches forward; crouch folds them
      const c = L.crouch;
      // at the very end it straightens up tall inside the I's slot
      const tall = smooth((t - P.look) / 0.4);
      const a1 = lerp(-18 - 22 * c, -4, tall) * (Math.PI / 180);
      const a2 = lerp(72 + 40 * c, 14, tall) * (Math.PI / 180);
      const base = [0, -7];
      const elbow = [base[0] + Math.sin(a1) * 32, base[1] - Math.cos(a1) * 32];
      const wrist = [elbow[0] + Math.sin(a2) * 30, elbow[1] - Math.cos(a2) * 30];
      // the head looks forward and down along its way; at the end it lifts
      // its light up toward the camera
      let headAng = 32 + 22 * c;
      const looking = tall;
      headAng = lerp(headAng, -58, looking);
      set("arm1", "d", `M${base[0]},${base[1]} L${f1(elbow[0])},${f1(elbow[1])}`);
      set("arm1b", "d", `M${base[0] + 3},${base[1]} L${f1(elbow[0] + 3)},${f1(elbow[1])}`);
      set("arm2", "d", `M${f1(elbow[0])},${f1(elbow[1])} L${f1(wrist[0])},${f1(wrist[1])}`);
      set("arm2b", "d", `M${f1(elbow[0])},${f1(elbow[1] + 3)} L${f1(wrist[0])},${f1(wrist[1] + 3)}`);
      set("elbow", "cx", f1(elbow[0]));
      set("elbow", "cy", f1(elbow[1]));
      set("shade", "transform", `translate(${f1(wrist[0])} ${f1(wrist[1])}) rotate(${f1(headAng)})`);
      const sq = L.squash;
      set(
        "lamp",
        "transform",
        `translate(${f1(L.x)} ${f1(L.y)}) scale(${f3(LAMP_S * facing * (1 + sq * 0.6))} ${f3(LAMP_S * (1 - sq))}) rotate(${f1(L.tilt * facing)})`
      );
      // the bulb flares on every landing
      let flare = 0;
      P.landings.forEach((b) => {
        const v = t - b;
        if (v > 0 && v < 0.5) flare = Math.max(flare, Math.exp(-v * 5));
      });
      set("bulbglow", "opacity", f1(0.55 + 0.45 * flare + 0.4 * looking));
      set("beam", "opacity", f1(0.25 + 0.4 * flare + 0.45 * looking));
      // its shadow and its reflection in the floor
      const lift = FLOOR - L.y;
      set("shadow", "transform", `translate(${f1(L.x)} ${FLOOR + 2}) scale(${f3(LAMP_S * clamp(1 - lift / 220, 0.3, 1.2))} 1)`);
      set("shadow", "opacity", f1(clamp(0.6 - lift / 300, 0.15, 0.6)));

      /* the classes pop up on each landing */
      for (let i = 0; i < n; i++) {
        const v = t - P.landings[i];
        const y = ROW0 + i * ROW_H;
        set(`row${i}`, "opacity", v > 0 ? 1 : 0);
        set(`row${i}`, "transform", `translate(180 ${y}) scale(${f3(pop(v / 0.4))}) translate(-180 ${-y})`);
        set(`rowglow${i}`, "opacity", f1(v > 0 ? Math.max(0, 1 - v / 0.6) : 0));
      }

      /* the letters drop onto the floor one by one */
      [...WORD].forEach((ch, k) => {
        const el = r[`let${k}`];
        if (!el || ch === " ") return;
        const t0 = P.tl + k * 0.09;
        const v = t - t0;
        if (v <= 0) {
          el.setAttribute("opacity", 0);
          return;
        }
        // fall, then a bounce
        let dy;
        if (v < 0.25) dy = -260 * Math.pow(1 - v / 0.25, 2);
        else {
          const w = v - 0.25;
          dy = -18 * Math.abs(Math.sin(w * 10)) * Math.exp(-w * 7);
        }
        const squashL = v > 0.25 && v < 0.37 ? 0.18 * Math.sin(((v - 0.25) / 0.12) * Math.PI) : 0;
        let sy = 1 - squashL;
        if (k === I_IDX) sy *= iHeight(t) / LETTER_H;
        el.setAttribute("opacity", k === I_IDX && iHeight(t) <= 0 ? 0 : 1);
        el.setAttribute("transform", `translate(${f1(WORD_X[k])} ${f1(FLOOR + dy)}) scale(${f3(1 + squashL * 0.6)} ${f3(Math.max(0.001, sy))})`);
        const ref2 = r[`refl${k}`];
        if (ref2) {
          ref2.setAttribute("opacity", k === I_IDX && iHeight(t) <= 0 ? 0 : f1(0.16 * smooth(v / 0.3)));
          ref2.setAttribute("transform", `translate(${f1(WORD_X[k])} ${f1(FLOOR - dy)}) scale(1 ${f3(-Math.max(0.001, sy))})`);
        }
      });
      set("site", "opacity", f1(smooth((t - P.look - 0.2) / 0.5)));
    }

    const endMs = Math.round(P.end * 1000);
    if (renderMode) {
      window.__renderAt = render;
      window.__rhLampEnd = endMs;
      render(0);
      const fonts = document.fonts
        ? Promise.all([document.fonts.load('700 54px "Fredoka"'), document.fonts.load('600 26px "Fredoka"'), document.fonts.load('800 14px "Nunito"')]).then(() => document.fonts.ready)
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
  }, [renderMode, still, classes, n, P]);

  return (
    <div className={`lp${still ? " is-static" : ""}`}>
      <svg className="lp-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="lp-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#05070d" />
            <stop offset="0.6" stopColor="#141a2c" />
            <stop offset="0.81" stopColor="#262c40" />
            <stop offset="0.82" stopColor="#1a1f2e" />
            <stop offset="1" stopColor="#07080c" />
          </linearGradient>
          <radialGradient id="lp-spot" cx="0.5" cy="0.8" r="0.6">
            <stop offset="0" stopColor="#ffe6b8" stopOpacity="0.18" />
            <stop offset="1" stopColor="#ffe6b8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lp-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f4f6fa" />
            <stop offset="0.5" stopColor="#c3c8d2" />
            <stop offset="1" stopColor="#7d8494" />
          </linearGradient>
          <radialGradient id="lp-bulb">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.35" stopColor="#fff2c8" stopOpacity="0.95" />
            <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lp-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff3d0" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff3d0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lp-letter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#c9cfdc" />
          </linearGradient>
          <filter id="lp-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id="lp-glow" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <rect width={W} height={H} fill="url(#lp-bg)" />
        <rect width={W} height={H} fill="url(#lp-spot)" />
        <path d={`M-10,${FLOOR} L370,${FLOOR}`} stroke="#3a4260" strokeWidth="1" opacity="0.6" />

        {/* ---- the day ---- */}
        <g ref={ref("head")} opacity="0">
          <text x="180" y={HEAD_Y - 34} textAnchor="middle" className="lp-kicker">
            TODAY&#8217;S CLASSES
          </text>
          <text x="180" y={HEAD_Y} textAnchor="middle" className="lp-day">
            {day.toUpperCase()}
          </text>
        </g>

        {/* ---- the classes ---- */}
        {classes.map(([name, a, b], i) => {
          const y = ROW0 + i * ROW_H;
          return (
            <g key={i} ref={ref(`row${i}`)} opacity="0">
              <g ref={ref(`rowglow${i}`)} opacity="0" filter="url(#lp-glow)">
                <text x="180" y={y + 22} textAnchor="middle" className="lp-name" style={{ fill: "#ffd98a" }}>
                  {name}
                </text>
              </g>
              <text x="180" y={y + 22} textAnchor="middle" className="lp-name">
                {name}
              </text>
              <text x="180" y={y + 44} textAnchor="middle" className="lp-time">
                {span(a, b)}
              </text>
            </g>
          );
        })}

        {/* ---- the wordmark: letters stand on the floor, reflected in it ---- */}
        {[...WORD].map((ch, k) =>
          ch === " " ? null : (
            <g key={`r${k}`}>
              <g ref={ref(`refl${k}`)} opacity="0">
                <text x="0" y="0" textAnchor="middle" className="lp-letter">
                  {ch}
                </text>
              </g>
              <g ref={ref(`let${k}`)} opacity="0">
                <text x="0" y="0" textAnchor="middle" className="lp-letter">
                  {ch}
                </text>
              </g>
            </g>
          )
        )}
        <text ref={ref("site")} x="180" y={FLOOR + 50} textAnchor="middle" className="lp-site" opacity="0">
          RHBJJ.CA
        </text>

        {/* ---- the lamp ---- */}
        <ellipse ref={ref("shadow")} cx="0" cy="0" rx="22" ry="4" fill="#000" opacity="0.5" filter="url(#lp-soft)" />
        <g ref={ref("lamp")}>
          {/* the light it throws ahead of it */}
          {/* base */}
          <path d="M-17,0 C-17,-6 -10,-9 0,-9 C10,-9 17,-6 17,0 Z" fill="url(#lp-metal)" />
          <rect x="-18" y="-1.5" width="36" height="2" rx="1" fill="#5a6070" />
          {/* the two arms, doubled rods, with a spring at the elbow */}
          <path ref={ref("arm1")} stroke="#d6dae2" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path ref={ref("arm1b")} stroke="#9aa0ac" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path ref={ref("arm2")} stroke="#d6dae2" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path ref={ref("arm2b")} stroke="#9aa0ac" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle ref={ref("elbow")} r="3.4" fill="#e8ebf0" stroke="#7d8494" strokeWidth="1" />
          <circle cx="0" cy="-7" r="3" fill="#e8ebf0" stroke="#7d8494" strokeWidth="1" />
          {/* the head: a cone shade with the bulb in its mouth */}
          <g ref={ref("shade")}>
            <path ref={ref("beam")} d="M10,-8 L120,-52 L120,52 L10,8 Z" fill="url(#lp-beam)" opacity="0.3" />
            <path d="M-6,-6 L-2,-8 L10,-16 C14,-10 14,10 10,16 L-2,8 L-6,6 Z" fill="url(#lp-metal)" />
            <path d="M-6,-6 L-6,6 L-11,4 L-11,-4 Z" fill="#a8aeb9" />
            <ellipse cx="11" cy="0" rx="4" ry="15.5" fill="#fff6d8" />
            <circle ref={ref("bulbglow")} cx="14" cy="0" r="18" fill="url(#lp-bulb)" opacity="0.55" />
          </g>
        </g>
      </svg>
      <div className="lp-vignette" />
      <div className="lp-fade" ref={ref("fade")} />
    </div>
  );
}
