// RhWrestling.js — a day's classes at Richmond Hill Jiu-Jitsu as an
// international-wrestling broadcast.
//
// A packed arena under a lighting rig; the rig bangs on bank by bank and the
// light comes down on a competition mat — gold ring, red and blue corners.
// The day lands as a broadcast title, then each class comes in as a
// lower-third bar: a gold time box, the class on navy, a glint across it.
// To finish, a gold medal drops in on a red-and-blue ribbon, swings and
// settles, RHBJJ.CA struck on its face, and the crowd's phones go off.
//
// Competition styling only: no rings, no event names or marks.
//
// Pure function of time:
//   ?render=1      window.__ready / __renderAt(ms) / __rhWrEnd for
//                  tools/record-frames.js
//   ?static        the held final frame
//   ?day=Saturday  any day of the week (default: today)
import React, { useEffect, useMemo, useRef } from "react";
import "../Stylesheets/RhWrestling.css";

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

const W = 360;
const H = 640;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 4);
const f1 = (n) => n.toFixed(1);
const seeded = (i, n) => {
  const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------------------------------------------------------------- layout */

const MAT = { cx: 180, cy: 500, rx: 210, ry: 96 };
const ROW_X0 = 34;
const ROW_X1 = 326;
const ROW_H = 46;
const ROW_GAP = 0; // the bars stack into one block, a divider between them
const ROWS_TOP = 214;
const TIME_W = 104;

/* ---------------------------------------------------------------- timing */

const RIG = [0.15, 0.3, 0.45]; // banks of the lighting rig
const T_HEAD = 0.6;
const T_ROW0 = 1.2;
const ROW_STEP = 0.75;

function plan(n) {
  const rows = Array.from({ length: n }, (_, i) => T_ROW0 + i * ROW_STEP);
  const medal = rows[n - 1] + 0.95;
  return { rows, medal, end: medal + 3.2 };
}

// the crowd: tiers of heads, a few phone screens lit
const CROWD = (() => {
  const out = [];
  for (let row = 0; row < 9; row++) {
    const y = 214 + row * 22;
    const n = 26 + row;
    for (let i = 0; i < n; i++) {
      const x = -10 + (i + (row % 2) * 0.5) * (380 / n) + (seeded(row * 40 + i, 1) - 0.5) * 5;
      out.push([x, y + (seeded(row * 40 + i, 2) - 0.5) * 3, 5 + row * 0.35, seeded(row * 40 + i, 3)]);
    }
  }
  return out;
})();
const FLASHES = Array.from({ length: 40 }, (_, i) => [seeded(i, 50) * W, 214 + seeded(i, 51) * 190, seeded(i, 52)]);

export default function RhWrestling({ mode = "animated", day: dayProp }) {
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
  const rowY = (i) => ROWS_TOP + i * (ROW_H + ROW_GAP);
  // the medal hangs straight off the last bar: the ribbon starts tucked under
  // its bottom edge, and that is the point it swings from
  const RIBBON_TOP = rowY(classes.length - 1) + ROW_H - 6;
  const MEDAL_PIVOT = RIBBON_TOP + 70;
  const MEDAL_Y = RIBBON_TOP + 142;

  const R = useRef({});
  const ref = (k) => (el) => {
    R.current[k] = el;
  };

  useEffect(() => {
    const r = R.current;
    const set = (k, a, v) => r[k] && r[k].setAttribute(a, v);
    const n = classes.length;

    function render(ms) {
      const t = ms / 1000;

      /* the rig bangs on, bank by bank */
      let lit = 0;
      RIG.forEach((tb, i) => {
        const on = t >= tb ? 1 : 0;
        lit += on / RIG.length;
        set(`bank${i}`, "opacity", f1(on ? 1 : 0.12));
      });
      const lightK = smooth((t - RIG[0]) / 0.5);
      set("beams", "opacity", f1(lightK * 0.9));
      set("matlight", "opacity", f1(lightK));
      if (r.dark) r.dark.style.opacity = f1(lerp(0.92, 0, lit) * (1 - smooth((t - RIG[2]) / 0.4)));

      /* a slow broadcast push in */
      const push = 1 + 0.035 * smooth(t / P.end);
      set("world", "transform", `translate(180 300) scale(${f1(push * 1000) / 1000}) translate(-180 -300)`);

      /* crowd phones flickering, a storm of them when the medal lands */
      const storm = t > P.medal + 0.25 ? Math.exp(-(t - P.medal - 0.25) * 1.2) : 0;
      FLASHES.forEach(([, , ph], i) => {
        const el = r[`fl${i}`];
        if (!el) return;
        const blink = Math.max(0, Math.sin(t * (2 + ph * 5) + ph * 30)) ** 18;
        const burst = storm * (seeded(i + Math.floor(t * 12), 9) > 0.6 ? 1 : 0);
        el.setAttribute("opacity", f1(clamp(0.15 + blink * 0.8 + burst, 0, 1)));
      });

      /* the day: a broadcast title wiping on */
      {
        const k = easeOut((t - T_HEAD) / 0.45);
        set("headclip", "width", f1(k * 320));
        set("headrule", "width", f1(easeOut((t - T_HEAD - 0.1) / 0.5) * 120));
        set("head", "opacity", t > T_HEAD ? 1 : 0);
      }

      /* the lower-thirds */
      for (let i = 0; i < n; i++) {
        const t0 = P.rows[i];
        const k = easeOut((t - t0) / 0.42);
        // the bar wipes on left to right, the time box drops a beat later
        set(`rowclip${i}`, "width", f1(k * (ROW_X1 - ROW_X0 + 20)));
        set(`row${i}`, "opacity", t > t0 ? 1 : 0);
        set(`row${i}`, "transform", `translate(${f1(lerp(-24, 0, k))} 0)`);
        const tb = easeOut((t - t0 - 0.12) / 0.35);
        set(`tbox${i}`, "transform", `translate(0 ${f1(lerp(-ROW_H, 0, tb))})`);
        // a glint runs across the bar once it is on
        const g = (t - t0 - 0.35) / 0.55;
        set(`glint${i}`, "opacity", g > 0 && g < 1 ? f1(Math.sin(g * Math.PI)) : 0);
        set(`glint${i}`, "transform", `translate(${f1(lerp(ROW_X0 - 60, ROW_X1 + 20, clamp(g, 0, 1)))} 0)`);
      }

      /* the medal: drops in on its ribbon, swings, turns, settles */
      {
        const u = t - P.medal;
        const drop = easeOut(u / 0.5);
        const swing = u > 0 ? 14 * Math.sin(u * 5.2) * Math.exp(-u * 1.6) : 0;
        const turn = u > 0 ? 1 - Math.abs(Math.sin(u * 3.4)) * Math.exp(-u * 0.9) : 1;
        set("medal", "opacity", u > 0 ? 1 : 0);
        set("medal", "transform", `translate(0 ${f1(lerp(-120, 0, drop))}) rotate(${f1(swing)} 180 ${RIBBON_TOP})`);
        // the disc turning on its ribbon: squeeze in x, never quite edge-on
        const sx = 0.3 + 0.7 * turn;
        set("disc", "transform", `translate(180 ${MEDAL_Y}) scale(${f1(sx * 1000) / 1000} 1) translate(-180 ${-MEDAL_Y})`);
        const sh = (u - 1.1) / 0.7;
        set("medalglint", "opacity", sh > 0 && sh < 1 ? f1(Math.sin(sh * Math.PI)) : 0);
        set("medalglint", "transform", `translate(${f1(lerp(-50, 50, clamp(sh, 0, 1)))} 0)`);
        set("medalhalo", "opacity", f1(u > 0 ? 0.3 + 0.7 * smooth((u - 0.3) / 0.8) : 0));
      }
    }

    const endMs = Math.round(P.end * 1000);
    if (renderMode) {
      window.__renderAt = render;
      window.__rhWrEnd = endMs;
      render(0);
      const fonts = document.fonts
        ? Promise.all([
            document.fonts.load('italic 800 40px "Barlow Condensed"'),
            document.fonts.load('italic 700 24px "Barlow Condensed"'),
            document.fonts.load('700 14px "Barlow"'),
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
  }, [renderMode, still, classes, P, MEDAL_Y, RIBBON_TOP]);

  return (
    <div className={`ow${still ? " is-static" : ""}`}>
      <svg className="ow-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="ow-arena" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#05070f" />
            <stop offset="0.35" stopColor="#0b1430" />
            <stop offset="0.7" stopColor="#0a1124" />
            <stop offset="1" stopColor="#04060c" />
          </linearGradient>
          <linearGradient id="ow-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eef4ff" stopOpacity="0.32" />
            <stop offset="1" stopColor="#eef4ff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="ow-fixture">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.4" stopColor="#e6efff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#a8c4ff" stopOpacity="0" />
          </radialGradient>
          {/* the mat: navy protection area, gold passivity ring, blue centre */}
          <radialGradient id="ow-matlight" cx="0.5" cy="0.45" r="0.55">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ow-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b2f6e" />
            <stop offset="0.5" stopColor="#13235a" />
            <stop offset="1" stopColor="#0c173f" />
          </linearGradient>
          <linearGradient id="ow-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe9a0" />
            <stop offset="0.45" stopColor="#f2bf3a" />
            <stop offset="1" stopColor="#b27a12" />
          </linearGradient>
          <linearGradient id="ow-glint" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="ow-medal" cx="0.38" cy="0.32" r="0.75">
            <stop offset="0" stopColor="#fff6c8" />
            <stop offset="0.35" stopColor="#f6cc54" />
            <stop offset="0.75" stopColor="#c48d1c" />
            <stop offset="1" stopColor="#8a5c0c" />
          </radialGradient>
          <radialGradient id="ow-medalface" cx="0.42" cy="0.36" r="0.7">
            <stop offset="0" stopColor="#ffe9a0" />
            <stop offset="0.6" stopColor="#e2aa30" />
            <stop offset="1" stopColor="#a8740e" />
          </radialGradient>
          <radialGradient id="ow-halo">
            <stop offset="0" stopColor="#ffd86a" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ffd86a" stopOpacity="0" />
          </radialGradient>
          <filter id="ow-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="ow-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
          <filter id="ow-shadow" x="-10%" y="-30%" width="120%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
          </filter>
          <clipPath id="ow-headclip">
            <rect ref={ref("headclip")} x="20" y="80" width="0" height="96" />
          </clipPath>
          {classes.map((_, i) => (
            <clipPath key={i} id={`ow-rowclip${i}`}>
              <rect ref={ref(`rowclip${i}`)} x={ROW_X0 - 10} y={rowY(i) - 4} width="0" height={ROW_H + 8} />
            </clipPath>
          ))}
          <clipPath id="ow-medalclip">
            <circle cx="180" cy={MEDAL_Y} r="40" />
          </clipPath>
        </defs>

        <g ref={ref("world")}>
          {/* ---- the arena ---- */}
          <rect x="-40" y="-40" width={W + 80} height={H + 80} fill="url(#ow-arena)" />

          {/* the lighting rig: a truss across the roof with banks of fixtures */}
          <rect x="-20" y="40" width={W + 40} height="7" fill="#1a2236" />
          <path d={`M-20,40 ${Array.from({ length: 24 }, (_, i) => `L${-20 + i * 17},${i % 2 ? 47 : 40}`).join(" ")}`} stroke="#2a3450" strokeWidth="1" fill="none" />
          {RIG.map((_, b) => (
            <g key={b} ref={ref(`bank${b}`)} opacity="0.12">
              {[0, 1, 2, 3].map((k) => {
                const x = 30 + b * 100 + k * 22 + (b === 1 ? 6 : 0);
                return (
                  <g key={k}>
                    <circle cx={x} cy="54" r="16" fill="url(#ow-fixture)" />
                    <rect x={x - 6} y="48" width="12" height="8" rx="2" fill="#dfe8ff" />
                  </g>
                );
              })}
            </g>
          ))}
          <g ref={ref("beams")} opacity="0">
            <path d="M40,56 L130,56 L250,430 L-40,430 Z" fill="url(#ow-beam)" />
            <path d="M140,56 L220,56 L330,430 L30,430 Z" fill="url(#ow-beam)" />
            <path d="M240,56 L330,56 L410,430 L120,430 Z" fill="url(#ow-beam)" />
          </g>

          {/* the stands: tiers of the crowd, dimmer toward the back */}
          {Array.from({ length: 9 }, (_, row) => (
            <rect key={row} x="-20" y={208 + row * 22} width={W + 40} height="22" fill={row % 2 ? "#0c1530" : "#0e1836"} />
          ))}
          {CROWD.map(([x, y, rr, s], i) => (
            <g key={i} opacity={0.5 + (y - 214) / 400}>
              <circle cx={x} cy={y} r={rr * 0.55} fill={s > 0.5 ? "#1a2448" : "#141d3c"} />
              <path d={`M${x - rr},${y + rr * 1.6} C${x - rr},${y + rr * 0.5} ${x + rr},${y + rr * 0.5} ${x + rr},${y + rr * 1.6} Z`} fill={s > 0.7 ? "#2a1e3c" : s > 0.35 ? "#16223f" : "#1d2a50"} />
            </g>
          ))}
          {FLASHES.map(([x, y], i) => (
            <circle key={i} ref={ref(`fl${i}`)} cx={x} cy={y} r="1.6" fill="#ffffff" opacity="0.15" />
          ))}
          {/* the barrier round the field of play, with red and blue boards */}
          <rect x="-20" y="404" width={W + 40} height="16" fill="#0c1430" />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={-20 + i * 52} y="406" width="48" height="12" fill={i % 2 ? "#c8102e" : "#1a3fa8"} opacity="0.85" />
          ))}

          {/* ---- the mat ---- */}
          <ellipse cx={MAT.cx} cy={MAT.cy + 8} rx={MAT.rx + 6} ry={MAT.ry + 8} fill="#000" opacity="0.5" filter="url(#ow-blur)" />
          <ellipse cx={MAT.cx} cy={MAT.cy} rx={MAT.rx} ry={MAT.ry} fill="#14306a" />
          {/* the red and blue corners */}
          <path d={`M${MAT.cx - MAT.rx * 0.95},${MAT.cy - 12} L${MAT.cx - MAT.rx * 0.62},${MAT.cy - 40} L${MAT.cx - MAT.rx * 0.6},${MAT.cy + 30} Z`} fill="#d1102e" />
          <path d={`M${MAT.cx + MAT.rx * 0.95},${MAT.cy - 12} L${MAT.cx + MAT.rx * 0.62},${MAT.cy - 40} L${MAT.cx + MAT.rx * 0.6},${MAT.cy + 30} Z`} fill="#1f4fd8" />
          <ellipse cx={MAT.cx} cy={MAT.cy} rx={MAT.rx * 0.6} ry={MAT.ry * 0.6} fill="#f2b21b" />
          <ellipse cx={MAT.cx} cy={MAT.cy} rx={MAT.rx * 0.52} ry={MAT.ry * 0.52} fill="#2a5bd7" />
          <ellipse cx={MAT.cx} cy={MAT.cy} rx={MAT.rx * 0.07} ry={MAT.ry * 0.07} fill="none" stroke="#ffffff" strokeWidth="1.6" />
          <path d={`M${MAT.cx - 22},${MAT.cy} L${MAT.cx + 22},${MAT.cy}`} stroke="#ffffff" strokeWidth="1" opacity="0.5" />
          <ellipse ref={ref("matlight")} cx={MAT.cx} cy={MAT.cy - 10} rx={MAT.rx * 0.9} ry={MAT.ry * 0.9} fill="url(#ow-matlight)" opacity="0" />

          {/* ---- the day ---- */}
          <g ref={ref("head")} opacity="0" clipPath="url(#ow-headclip)">
            <text x="180" y="112" textAnchor="middle" className="ow-kicker">
              TODAY&#8217;S CLASSES
            </text>
            <text x="180" y="156" textAnchor="middle" className="ow-day" filter="url(#ow-shadow)">
              {day.toUpperCase()}
            </text>
          </g>
          <rect ref={ref("headrule")} x="120" y="168" width="0" height="3" fill="url(#ow-gold)" />

          {/* ---- the medal ---- */}
          <circle ref={ref("medalhalo")} cx="180" cy={MEDAL_Y} r="90" fill="url(#ow-halo)" opacity="0" />
          <g ref={ref("medal")} opacity="0">
            {/* the ribbon: red and blue halves meeting in a V at the ring */}
            <path d={`M152,${MEDAL_PIVOT - 70} L172,${MEDAL_PIVOT - 70} L184,${MEDAL_Y - 44} L172,${MEDAL_Y - 40} Z`} fill="#c8102e" />
            <path d={`M208,${MEDAL_PIVOT - 70} L188,${MEDAL_PIVOT - 70} L176,${MEDAL_Y - 44} L188,${MEDAL_Y - 40} Z`} fill="#1f4fd8" />
            <path d={`M160,${MEDAL_PIVOT - 70} L178,${MEDAL_Y - 42}`} stroke="#ffffff" strokeWidth="1.4" opacity="0.5" />
            <path d={`M200,${MEDAL_PIVOT - 70} L182,${MEDAL_Y - 42}`} stroke="#ffffff" strokeWidth="1.4" opacity="0.5" />
            <rect x="174" y={MEDAL_Y - 48} width="12" height="10" rx="3" fill="url(#ow-gold)" />
            {/* the disc, turning */}
            <g ref={ref("disc")}>
              <circle cx="180" cy={MEDAL_Y} r="42" fill="#7a4e08" />
              <circle cx="180" cy={MEDAL_Y} r="40" fill="url(#ow-medal)" />
              <circle cx="180" cy={MEDAL_Y} r="31" fill="url(#ow-medalface)" />
              <circle cx="180" cy={MEDAL_Y} r="31" fill="none" stroke="#8a5c0c" strokeWidth="1.2" />
              {/* a laurel round the face */}
              {Array.from({ length: 18 }, (_, k) => {
                const side = k < 9 ? -1 : 1;
                const j = k % 9;
                const a = (Math.PI / 2) + side * (0.35 + j * 0.27);
                const x = 180 + Math.cos(a) * 35.5;
                const y = MEDAL_Y + Math.sin(a) * 35.5;
                return <ellipse key={k} cx={f1(x)} cy={f1(y)} rx="3.2" ry="1.4" fill="#a8740e" transform={`rotate(${f1((a * 180) / Math.PI + 90 * side)} ${f1(x)} ${f1(y)})`} />;
              })}
              <text x="180" y={MEDAL_Y + 5} textAnchor="middle" className="ow-medaltext">
                RHBJJ
              </text>
              <text x="180" y={MEDAL_Y + 18} textAnchor="middle" className="ow-medalsub">
                .CA
              </text>
              <g clipPath="url(#ow-medalclip)">
                <rect ref={ref("medalglint")} x="150" y={MEDAL_Y - 50} width="26" height="100" fill="url(#ow-glint)" opacity="0" transform={`rotate(20 180 ${MEDAL_Y})`} />
              </g>
            </g>
          </g>
          {/* ---- the lower-thirds ---- */}
          {classes.map(([name, a, b], i) => {
            const y = rowY(i);
            const s = clock(a);
            const e = clock(b);
            const when = `${s.t} ${s.ap}`;
            const ap = `TO ${e.t} ${e.ap}`;
            return (
              <g key={i} ref={ref(`row${i}`)} opacity="0">
                <g clipPath={`url(#ow-rowclip${i})`} filter="url(#ow-shadow)">
                  {/* the class on navy, with a red-and-blue edge */}
                  <rect x={ROW_X0} y={y} width={ROW_X1 - ROW_X0} height={ROW_H} fill="url(#ow-bar)" />
                  <rect x={ROW_X1 - 6} y={y} width="3" height={ROW_H} fill="#c8102e" />
                  <rect x={ROW_X1 - 3} y={y} width="3" height={ROW_H} fill="#1f4fd8" />
                  <rect x={ROW_X0} y={y} width={ROW_X1 - ROW_X0} height="1.2" fill="#ffffff" opacity="0.18" />
                  <text x={ROW_X0 + TIME_W + 16} y={y + 31} className="ow-name">
                    {name.toUpperCase()}
                  </text>
                  {/* the gold time box */}
                  <g ref={ref(`tbox${i}`)}>
                    <rect x={ROW_X0} y={y} width={TIME_W} height={ROW_H} fill="url(#ow-gold)" />
                    <text x={ROW_X0 + TIME_W / 2} y={y + 22} textAnchor="middle" className="ow-time">
                      {when}
                    </text>
                    <text x={ROW_X0 + TIME_W / 2} y={y + 37} textAnchor="middle" className="ow-ap">
                      {ap}
                    </text>
                  </g>
                  {/* the divider where this bar meets the one above */}
                  {i > 0 && (
                    <>
                      <rect x={ROW_X0} y={y - 1} width={ROW_X1 - ROW_X0} height="2.4" fill="#060b1e" />
                      <rect x={ROW_X0} y={y + 1.4} width={ROW_X1 - ROW_X0} height="0.8" fill="#f2bf3a" opacity="0.7" />
                    </>
                  )}
                  <rect ref={ref(`glint${i}`)} x="0" y={y} width="60" height={ROW_H} fill="url(#ow-glint)" opacity="0" style={{ mixBlendMode: "screen" }} transform="skewX(-20)" />
                </g>
              </g>
            );
          })}

        </g>
      </svg>
      <div className="ow-vignette" />
      <div className="ow-grain" />
      <div className="ow-dark" ref={ref("dark")} />
    </div>
  );
}
