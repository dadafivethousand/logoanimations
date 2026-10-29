// RhDagestan.js — a day's classes at Richmond Hill Jiu-Jitsu, Dagestani
// mountain-wrestling style.
//
// Dawn over the Caucasus: snow on the peaks, mist in the gorges, a stone aul
// stepped up the slope with its windows lit, an eagle riding the air. On the
// plateau an old blue wrestling mat with its red ring, RHBJJ.CA printed on
// the apron. Each class is thrown onto the mat — it comes up from below in a
// big suplex arc, flips over and SLAMS down: dust rolls out across the mat,
// a ripple runs through it, the frame shakes.
//
// Pure function of time:
//   ?render=1      window.__ready / __renderAt(ms) / __rhDagEnd for
//                  tools/record-frames.js
//   ?static        the held final frame
//   ?day=Saturday  any day of the week (default: today)
import React, { useEffect, useMemo, useRef } from "react";
import "../Stylesheets/RhDagestan.css";

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
const f1 = (n) => n.toFixed(1);
const seeded = (i, n) => {
  const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------------------------------------------------------------- layout */

const MAT = { cx: 180, cy: 462, rx: 176, ry: 68 };
const LINE_H = 54;

/* ---------------------------------------------------------------- timing */

const T_FIRST = 1.15;
const GAP = 1.3;
const FLIGHT = 0.58; // from leaving the ground to the slam
const DUST = 26;

function plan(n) {
  const throws = Array.from({ length: n }, (_, i) => {
    const t0 = T_FIRST + i * GAP;
    return { t0, hit: t0 + FLIGHT };
  });
  return { throws, end: throws[n - 1].hit + 2.4 };
}

// the Caucasus, drawn by hand: peaks and saddles, left to right
const FAR_PTS = [[-20, 282], [14, 232], [40, 252], [76, 196], [104, 226], [140, 170], [160, 186], [184, 162], [208, 194], [234, 176], [262, 214], [292, 186], [318, 224], [346, 200], [380, 238]];
const MID_PTS = [[-20, 334], [22, 292], [56, 308], [92, 270], [122, 296], [152, 264], [186, 298], [216, 278], [246, 302], [282, 282], [320, 312], [380, 300]];
const NEAR_PTS = [[-20, 392], [30, 356], [70, 372], [110, 348], [150, 374], [200, 360], [380, 392]];

const poly = (pts) => `M${pts[0][0]},${H} ` + pts.map(([x, y]) => `L${x},${y}`).join(" ") + ` L${pts[pts.length - 1][0]},${H} Z`;

// a snow cap on every peak: down each flank part of the way to the saddle,
// with a ragged lower edge where the snow gives out
function caps(pts, depth, seed) {
  const out = [];
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i];
    if (py >= pts[i - 1][1] || py >= pts[i + 1][1]) continue;
    const L = [px + (pts[i - 1][0] - px) * depth, py + (pts[i - 1][1] - py) * depth];
    const Rr = [px + (pts[i + 1][0] - px) * depth, py + (pts[i + 1][1] - py) * depth];
    let d = `M${L[0].toFixed(1)},${L[1].toFixed(1)} L${px},${py} L${Rr[0].toFixed(1)},${Rr[1].toFixed(1)}`;
    const N = 5;
    for (let k = N - 1; k >= 1; k--) {
      const x = Rr[0] + ((L[0] - Rr[0]) * k) / N;
      const yb = Rr[1] + ((L[1] - Rr[1]) * k) / N;
      const dip = (k % 2 ? 7 : 2) * (0.6 + seeded(i + seed, k));
      d += ` L${x.toFixed(1)},${(yb + dip).toFixed(1)}`;
    }
    out.push(`${d} Z`);
  }
  return out;
}
const FAR = poly(FAR_PTS);
const FAR_SNOW = caps(FAR_PTS, 0.42, 3);
const MIDR = poly(MID_PTS);
const MID_SNOW = caps(MID_PTS, 0.3, 7);
const NEAR = poly(NEAR_PTS);

// the aul: stone houses stepped up the right-hand slope, flat roofs
const AUL = Array.from({ length: 16 }, (_, i) => {
  const row = Math.floor(i / 4);
  const col = i % 4;
  const x = 236 + col * 26 + row * 7 + (seeded(i, 1) - 0.5) * 6;
  const y = 330 + row * 15 - col * 8;
  return [x, y, 18 + seeded(i, 2) * 8, 11 + seeded(i, 3) * 4, seeded(i, 4)];
});

export default function RhDagestan({ mode = "animated", day: dayProp }) {
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
  // lines sit centred in the mat's ring
  const top = MAT.cy - ((classes.length - 1) * LINE_H) / 2 - 8;
  const lineY = (i) => top + i * LINE_H;

  const R = useRef({});
  const ref = (k) => (el) => {
    R.current[k] = el;
  };

  useEffect(() => {
    const r = R.current;
    const set = (k, a, v) => r[k] && r[k].setAttribute(a, v);
    const n = classes.length;

    // where a thrown line is, mid-air: up out of the bottom-left in a high
    // arc, flipping over backward, and straight down onto the mat
    function flight(i, t) {
      const T = P.throws[i];
      const u = (t - T.t0) / FLIGHT;
      const end = [180, lineY(i)];
      const p0 = [-90, 700];
      const p1 = [40, 70];
      const p2 = end;
      const k = clamp(u, 0, 1);
      // speed up into the slam
      const e = k * k * (1.6 - 0.6 * k);
      const x = (1 - e) * (1 - e) * p0[0] + 2 * (1 - e) * e * p1[0] + e * e * p2[0];
      const y = (1 - e) * (1 - e) * p0[1] + 2 * (1 - e) * e * p1[1] + e * e * p2[1];
      const rot = lerp(-300, 0, smooth(k));
      return { x, y, rot, sc: lerp(0.55, 1, k) };
    }

    function render(ms) {
      const t = ms / 1000;

      if (r.fade) r.fade.style.opacity = f1(1 - smooth(t / 0.7));

      /* dawn: the sun lifts behind the range, the light warms */
      const dawn = smooth(t / 3.5);
      set("sun", "transform", `translate(0 ${f1(lerp(26, 0, dawn))})`);
      set("sunglow", "opacity", f1(0.55 + 0.45 * dawn));

      /* mist drifts through the gorges */
      for (let i = 0; i < 6; i++) set(`mist${i}`, "transform", `translate(${f1(Math.sin(t * 0.25 + i) * 14 + t * (i % 2 ? 4 : -3))} 0)`);

      /* the eagle rides across the sky, a wingbeat now and then */
      {
        const k = t / P.end;
        const x = lerp(410, -60, k);
        const y = 150 + Math.sin(k * Math.PI * 2) * 14;
        const beat = Math.sin(t * 9) * Math.max(0, Math.sin(t * 1.3));
        set("eagle", "transform", `translate(${f1(x)} ${f1(y)}) rotate(${f1(-4 + Math.sin(t) * 3)})`);
        set(
          "eagle-w",
          "d",
          `M0,0 C-10,${f1(-6 - beat * 8)} -22,${f1(-8 - beat * 12)} -34,${f1(-4 - beat * 10)} C-26,${f1(-1 - beat * 4)} -16,2 -4,3 Z M0,0 C10,${f1(-6 - beat * 8)} 22,${f1(-8 - beat * 12)} 34,${f1(-4 - beat * 10)} C26,${f1(-1 - beat * 4)} 16,2 4,3 Z`
        );
      }

      /* shake + light from the slams */
      let sx = 0;
      let sy = 0;
      let flash = 0;
      P.throws.forEach((T, i) => {
        const u = t - T.hit;
        if (u > 0 && u < 0.7) {
          const e = Math.exp(-u * 8) * (i === n - 1 ? 1.4 : 1);
          sx += 5 * e * Math.sin(u * 80);
          sy += 9 * e * Math.cos(u * 70);
          flash = Math.max(flash, 0.3 * Math.exp(-u * 12));
        }
      });
      set("scene", "transform", `translate(${f1(sx)} ${f1(sy)})`);
      if (r.flash) r.flash.style.opacity = f1(flash);

      /* the header settles in */
      set("head", "opacity", f1(smooth((t - 0.45) / 0.4)));
      set("head", "transform", `translate(0 ${f1(lerp(-12, 0, easeOut((t - 0.45) / 0.4)))})`);

      /* each class: thrown, slammed, squashed flat for an instant */
      for (let i = 0; i < n; i++) {
        const T = P.throws[i];
        const g = r[`line${i}`];
        if (!g) continue;
        const y0 = lineY(i);
        if (t < T.t0) {
          g.setAttribute("opacity", 0);
        } else if (t < T.hit) {
          const F = flight(i, t);
          g.setAttribute("opacity", 1);
          g.setAttribute("transform", `translate(${f1(F.x)} ${f1(F.y)}) rotate(${f1(F.rot)}) scale(${f1(F.sc * 1000) / 1000}) translate(-180 ${f1(-y0)})`);
        } else {
          const u = t - T.hit;
          const sq = Math.exp(-u * 9) * Math.cos(u * 30);
          const sxk = 1 + 0.22 * sq;
          const syk = 1 - 0.32 * sq;
          g.setAttribute("opacity", 1);
          // squash about the line's foot, where it hit the mat
          g.setAttribute("transform", `translate(180 ${f1(y0 + 8)}) scale(${f1(sxk * 1000) / 1000} ${f1(syk * 1000) / 1000}) translate(-180 ${f1(-(y0 + 8))})`);
        }
        // a motion smear trailing the throw
        for (let gh = 0; gh < 3; gh++) {
          const el = r[`ghost${i}_${gh}`];
          if (!el) continue;
          const tg = t - (gh + 1) * 0.035;
          if (t < T.t0 || t >= T.hit || tg < T.t0) {
            el.setAttribute("opacity", 0);
            continue;
          }
          const F = flight(i, tg);
          el.setAttribute("opacity", f1(0.28 - gh * 0.08));
          el.setAttribute("transform", `translate(${f1(F.x)} ${f1(F.y)}) rotate(${f1(F.rot)}) scale(${f1(F.sc * 1000) / 1000}) translate(-180 ${f1(-y0)})`);
        }

        // the slam: a ripple out across the mat, dust rolling along it
        const u = t - T.hit;
        if (u > 0 && u < 0.7) {
          const k = easeOut(u / 0.7);
          set(`rip${i}`, "rx", f1(20 + k * 190));
          set(`rip${i}`, "ry", f1(7 + k * 62));
          set(`rip${i}`, "cy", f1(y0 + 8));
          set(`rip${i}`, "opacity", f1(0.8 * (1 - u / 0.7)));
        } else set(`rip${i}`, "opacity", 0);
        for (let j = 0; j < DUST; j++) {
          const el = r[`d${i}_${j}`];
          if (!el) continue;
          if (u <= 0 || u > 1.4) {
            el.setAttribute("opacity", 0);
            continue;
          }
          const side = j % 2 ? 1 : -1;
          const v = 60 + seeded(j + i * 31, 1) * 150;
          const k = 1 - Math.exp(-u * 4);
          const x = 180 + side * (20 + v * k);
          const y = y0 + 10 - (seeded(j, 2) * 22 + 10) * k + 6 * u * u;
          el.setAttribute("cx", f1(x));
          el.setAttribute("cy", f1(y));
          el.setAttribute("r", f1((3 + seeded(j, 3) * 6) * (0.6 + k * 1.4)));
          el.setAttribute("opacity", f1(0.6 * (1 - u / 1.4)));
        }
      }

      /* the aul's windows flicker */
      AUL.forEach((a, i) => {
        const el = r[`win${i}`];
        if (el) el.setAttribute("opacity", f1(0.6 + 0.4 * Math.sin(t * (1.2 + a[4] * 2) + i)));
      });
    }

    const endMs = Math.round(P.end * 1000);
    if (renderMode) {
      window.__renderAt = render;
      window.__rhDagEnd = endMs;
      render(0);
      const fonts = document.fonts
        ? Promise.all([document.fonts.load('400 28px "Anton"'), document.fonts.load('900 14px "Inter"'), document.fonts.load('400 40px "Russo One"')]).then(
            () => document.fonts.ready
          )
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
  }, [renderMode, still, classes, P, top]);

  const Line = ({ name, a, b, y }) => (
    <>
      <text x="180" y={y} textAnchor="middle" className="dg-name">
        {name.toUpperCase()}
      </text>
      <text x="180" y={y + 19} textAnchor="middle" className="dg-time">
        {span(a, b)}
      </text>
    </>
  );

  return (
    <div className={`dg${still ? " is-static" : ""}`}>
      <svg className="dg-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="dg-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1d2a52" />
            <stop offset="0.35" stopColor="#5a5a8a" />
            <stop offset="0.6" stopColor="#e8a47a" />
            <stop offset="0.75" stopColor="#ffd59a" />
          </linearGradient>
          <radialGradient id="dg-sunglow">
            <stop offset="0" stopColor="#fff2cc" stopOpacity="0.95" />
            <stop offset="0.3" stopColor="#ffcf86" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff9a5a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dg-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8a86b0" />
            <stop offset="1" stopColor="#5a5a86" />
          </linearGradient>
          <linearGradient id="dg-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a4a72" />
            <stop offset="1" stopColor="#2e2e4c" />
          </linearGradient>
          <linearGradient id="dg-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2c2a3c" />
            <stop offset="1" stopColor="#17151f" />
          </linearGradient>
          <linearGradient id="dg-plateau" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a3426" />
            <stop offset="1" stopColor="#14110c" />
          </linearGradient>
          <clipPath id="dg-snowline">
            <rect x="-20" y="0" width={W + 40} height="196" />
          </clipPath>
          <clipPath id="dg-snowline2">
            <rect x="-20" y="0" width={W + 40} height="262" />
          </clipPath>
          <filter id="dg-mistblur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <filter id="dg-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="dg-rock" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.08" numOctaves="3" seed="6" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
            {/* keep the texture inside the shape it is laid on */}
            <feComposite in2="SourceAlpha" operator="in" />
          </filter>
          {/* the mat: worn blue vinyl, the red ring, lighter at the centre */}
          <radialGradient id="dg-mat" cx="0.5" cy="0.45" r="0.6">
            <stop offset="0" stopColor="#2e6fd0" />
            <stop offset="0.7" stopColor="#1f54a8" />
            <stop offset="1" stopColor="#163c7a" />
          </radialGradient>
          <filter id="dg-vinyl" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9 0.6" numOctaves="2" seed="2" />
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0" />
          </filter>
          <filter id="dg-textshadow" x="-20%" y="-50%" width="140%" height="200%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="1.6" floodColor="#04122e" floodOpacity="0.8" />
          </filter>
          <clipPath id="dg-matclip">
            <ellipse cx={MAT.cx} cy={MAT.cy} rx={MAT.rx} ry={MAT.ry} />
          </clipPath>
        </defs>

        <g ref={ref("scene")}>
          {/* ---- dawn sky and the sun behind the range ---- */}
          <rect x="-20" y="-20" width={W + 40} height={H + 40} fill="url(#dg-sky)" />
          <circle ref={ref("sunglow")} cx="122" cy="214" r="150" fill="url(#dg-sunglow)" />
          <g ref={ref("sun")}>
            <circle cx="122" cy="206" r="20" fill="#fff4d8" />
          </g>

          {/* ---- the Caucasus: far snow peaks, middle ranges, the near ridge ---- */}
          <path d={FAR} fill="url(#dg-far)" />
          {FAR_SNOW.map((d, i) => (
            <path key={i} d={d} fill="#f6f3fb" opacity="0.95" />
          ))}
          {/* the shaded east faces of the far peaks */}
          {FAR_PTS.slice(1, -1).map(([x, y], i) => {
            const nx = FAR_PTS[i + 2];
            return y < FAR_PTS[i][1] && y < nx[1] ? <path key={`f${i}`} d={`M${x},${y} L${nx[0]},${nx[1]} L${x + (nx[0] - x) * 0.25},${H} Z`} fill="#2a2a50" opacity="0.28" /> : null;
          })}
          <path d={FAR} fill="#000" filter="url(#dg-rock)" opacity="0.5" />
          <g ref={ref("mist0")} filter="url(#dg-mistblur)">
            <ellipse cx="90" cy="290" rx="140" ry="16" fill="#f3d9c8" opacity="0.55" />
            <ellipse cx="280" cy="300" rx="120" ry="14" fill="#f3d9c8" opacity="0.5" />
          </g>
          <path d={MIDR} fill="url(#dg-mid)" />
          {MID_SNOW.map((d, i) => (
            <path key={i} d={d} fill="#d8d6ea" opacity="0.75" />
          ))}
          <g ref={ref("mist1")} filter="url(#dg-mistblur)">
            <ellipse cx="200" cy="348" rx="170" ry="16" fill="#e8cdbf" opacity="0.5" />
          </g>

          {/* the aul up the right-hand slope */}
          <path d="M200,420 L230,350 L262,316 L300,300 L340,296 L380,300 L380,420 Z" fill="#3a3044" />
          {AUL.map(([x, y, w, h], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} fill={i % 3 ? "#8a7a6a" : "#9a8a76"} />
              <rect x={x} y={y} width={w} height={h} fill="#000" filter="url(#dg-rock)" opacity="0.5" />
              <rect x={x - 1.5} y={y - 2} width={w + 3} height="2.4" fill="#5a4c40" />
              <rect x={x + w * 0.62} y={y + 3} width="4" height="5" fill="#2a1c12" />
              <rect ref={ref(`win${i}`)} x={x + w * 0.62 + 0.6} y={y + 3.6} width="2.8" height="3.8" fill="#ffc870" opacity="0.8" />
              <rect x={x} y={y + h} width={w} height="3" fill="#000" opacity="0.25" />
            </g>
          ))}
          {/* a stone watchtower over the village */}
          <path d="M316,300 L316,252 L314,246 L332,246 L330,252 L330,300 Z" fill="#7a6a5a" />
          <path d="M314,246 L316,240 L330,240 L332,246 Z" fill="#5a4c40" />
          <rect x="321" y="258" width="4" height="7" fill="#ffc870" opacity="0.8" />

          <path d={NEAR} fill="url(#dg-near)" />
          <g ref={ref("mist2")} filter="url(#dg-mistblur)">
            <ellipse cx="60" cy="392" rx="120" ry="14" fill="#d9bfb4" opacity="0.45" />
          </g>

          {/* ---- the plateau and the mat on it ---- */}
          <path d="M-20,640 L-20,404 C60,396 140,400 200,398 C270,396 330,402 380,406 L380,640 Z" fill="url(#dg-plateau)" />
          <path d="M-20,640 L-20,404 C60,396 140,400 200,398 C270,396 330,402 380,406 L380,640 Z" fill="#000" filter="url(#dg-rock)" opacity="0.6" />
          {/* grass tufts on the plateau edge */}
          {Array.from({ length: 30 }, (_, i) => {
            const x = -10 + i * 13 + seeded(i, 31) * 6;
            const y = 404 + seeded(i, 32) * 6;
            return <path key={i} d={`M${x},${y} l-2,-6 M${x + 2},${y} l1,-8 M${x + 4},${y} l3,-5`} stroke="#4a5a2c" strokeWidth="1.2" />;
          })}

          {/* mat apron: its thickness, with the site printed round it */}
          <ellipse cx={MAT.cx} cy={MAT.cy + 30} rx={MAT.rx + 6} ry={MAT.ry + 10} fill="#000" opacity="0.45" filter="url(#dg-soft)" />
          <path
            d={`M${MAT.cx - MAT.rx},${MAT.cy} L${MAT.cx - MAT.rx},${MAT.cy + 16} A${MAT.rx},${MAT.ry} 0 0 0 ${MAT.cx + MAT.rx},${MAT.cy + 16} L${MAT.cx + MAT.rx},${MAT.cy} Z`}
            fill="#0f2a5a"
          />
          <ellipse cx={MAT.cx} cy={MAT.cy} rx={MAT.rx} ry={MAT.ry} fill="url(#dg-mat)" />
          <g clipPath="url(#dg-matclip)">
            <rect x="0" y={MAT.cy - MAT.ry} width={W} height={MAT.ry * 2} filter="url(#dg-vinyl)" />
            {/* the red ring and the centre circle */}
            <ellipse cx={MAT.cx} cy={MAT.cy} rx={MAT.rx * 0.84} ry={MAT.ry * 0.84} fill="none" stroke="#d8122e" strokeWidth="11" />
            <ellipse cx={MAT.cx} cy={MAT.cy} rx={MAT.rx * 0.84} ry={MAT.ry * 0.84} fill="none" stroke="#ff5a6e" strokeWidth="1" opacity="0.6" transform={`translate(0 -4)`} />
            <ellipse cx={MAT.cx} cy={MAT.cy} rx={MAT.rx * 0.12} ry={MAT.ry * 0.12} fill="none" stroke="#e8eef8" strokeWidth="1.2" opacity="0.35" />
            {/* the low sun skating across the vinyl */}
            <ellipse cx="130" cy={MAT.cy - 30} rx="90" ry="14" fill="#ffd8a8" opacity="0.18" filter="url(#dg-soft)" />
          </g>
          <text x={MAT.cx} y={MAT.cy + MAT.ry + 12} textAnchor="middle" className="dg-apron">
            RHBJJ.CA
          </text>

          {/* ---- the eagle ---- */}
          <g ref={ref("eagle")}>
            <path ref={ref("eagle-w")} fill="#1c1820" />
            <ellipse cx="0" cy="1" rx="5" ry="3" fill="#1c1820" />
            <path d="M4,0 L9,-1 L7,2 Z" fill="#1c1820" />
            <path d="M-4,1 L-10,4 L-4,3 Z" fill="#1c1820" />
          </g>

          {/* ---- the header ---- */}
          <g ref={ref("head")} opacity="0">
            <text x="180" y="92" textAnchor="middle" className="dg-kicker">
              TODAY&#8217;S CLASSES
            </text>
            <text x="180" y="134" textAnchor="middle" className="dg-day">
              {day.toUpperCase()}
            </text>
            <rect x="140" y="146" width="40" height="4" fill="#1f54a8" />
            <rect x="180" y="146" width="40" height="4" fill="#d8122e" />
          </g>

          {/* ---- the slams: ripples and dust ---- */}
          {classes.map((_, i) => (
            <g key={`fx${i}`}>
              <ellipse ref={ref(`rip${i}`)} cx={MAT.cx} cy={lineY(i)} rx="20" ry="7" fill="none" stroke="#bcd6ff" strokeWidth="2" opacity="0" />
              <g filter="url(#dg-soft)">
                {Array.from({ length: DUST }, (__, j) => (
                  <circle key={j} ref={ref(`d${i}_${j}`)} r="4" fill="#d8c7b0" opacity="0" />
                ))}
              </g>
            </g>
          ))}

          {/* ---- the classes, and their motion smears ---- */}
          {classes.map(([name, a, b], i) => (
            <g key={`ln${i}`}>
              {[0, 1, 2].map((gh) => (
                <g key={gh} ref={ref(`ghost${i}_${gh}`)} opacity="0">
                  <Line name={name} a={a} b={b} y={lineY(i)} />
                </g>
              ))}
              <g ref={ref(`line${i}`)} opacity="0" filter="url(#dg-textshadow)">
                <Line name={name} a={a} b={b} y={lineY(i)} />
              </g>
            </g>
          ))}
        </g>
      </svg>
      <div className="dg-vignette" />
      <div className="dg-flash" ref={ref("flash")} />
      <div className="dg-grain" />
      <div className="dg-fade" ref={ref("fade")} />
    </div>
  );
}
