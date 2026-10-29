// RhHeavyBag.js — a day's classes at Richmond Hill Jiu-Jitsu, knocked out of
// a heavy bag.
//
// A dark gym, one hard spotlight, a heavy bag hanging on its chain. For each
// class a strike comes into frame — a Muay Thai round kick from the left, a
// cross from the right, then a finishing kick — and lands with a thud: dust
// bursts off the leather, a shockwave ring, the bag swings on its chain, the
// frame shakes, and the class slams onto the screen under the bag. Then
// RHBJJ.CA, and the bag settles.
//
// Pure function of time:
//   ?render=1      window.__ready / __renderAt(ms) / __rhBagEnd for
//                  tools/record-frames.js
//   ?static        the held final frame
//   ?day=Friday    any day of the week (default: today)
import React, { useEffect, useMemo, useRef } from "react";
import "../Stylesheets/RhHeavyBag.css";

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
const easeIn = (t) => Math.pow(clamp(t, 0, 1), 2.2);
const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const f1 = (n) => n.toFixed(1);
const seeded = (i, n) => {
  const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------------------------------------------------------------- layout */

const PIVOT = [180, -60]; // where the chain hangs from, above frame
const BAG_X0 = 132;
const BAG_X1 = 228;
const BAG_TOP = 64;
const BAG_BOT = 252;
const HEAD_Y = 302; // the day
const BLOCK0 = 334;
const BLOCK_H = 62;

/* ---------------------------------------------------------------- timing */

const T_LIGHT = 0.15; // the spotlight bangs on
const T_FIRST = 1.25;
const GAP = 1.1;
const DUST = 34;

// strikes: kick from the left, cross from the right, kick to finish
const STRIKES = ["kick", "punch", "kick"];

function plan(n) {
  const hits = Array.from({ length: n }, (_, i) => ({ t: T_FIRST + i * GAP, kind: STRIKES[i % STRIKES.length], heavy: i === n - 1 }));
  const last = hits[n - 1].t;
  return { hits, site: last + 0.75, end: last + 3.0 };
}

// where on the bag each strike lands (bag-local, before swing)
const CONTACT = { kick: [BAG_X0 + 4, 196], punch: [BAG_X1 - 4, 136] };

// the kicking leg pivots at the fighter's hip on the frame edge; the lower
// shin (70% of the way down the leg) is what lands
const HIP = [-6, 304];
const LEG_L = 245;
const SHIN_HIT = 0.7;

export default function RhHeavyBag({ mode = "animated", day: dayProp }) {
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

  const R = useRef({});
  const ref = (k) => (el) => {
    R.current[k] = el;
  };

  useEffect(() => {
    const r = R.current;
    const set = (k, a, v) => r[k] && r[k].setAttribute(a, v);
    const n = classes.length;

    // the bag's swing: idle sway plus a damped push from every strike
    function swing(t) {
      let a = 1.2 * Math.sin(t * 1.4);
      for (const h of P.hits) {
        const u = t - h.t;
        if (u > 0) {
          const dir = h.kind === "kick" ? -1 : 1; // kicked from the left, it swings right
          a += dir * (h.heavy ? 11 : 8) * Math.sin(u * 7.5) * Math.exp(-u * 2.2);
        }
      }
      return a;
    }
    // squash on impact
    function squash(t) {
      let k = 0;
      for (const h of P.hits) {
        const u = t - h.t;
        if (u > 0 && u < 0.3) k = Math.max(k, Math.sin((u / 0.3) * Math.PI) * Math.exp(-u * 6) * (h.heavy ? 1.3 : 1));
      }
      return k;
    }
    const rot = (p, deg) => {
      const a = (deg * Math.PI) / 180;
      const dx = p[0] - PIVOT[0];
      const dy = p[1] - PIVOT[1];
      return [PIVOT[0] + dx * Math.cos(a) - dy * Math.sin(a), PIVOT[1] + dx * Math.sin(a) + dy * Math.cos(a)];
    };

    function render(ms) {
      const t = ms / 1000;

      /* the light bangs on with a stutter */
      const lit = t < T_LIGHT ? 0 : t < T_LIGHT + 0.08 ? 1 : t < T_LIGHT + 0.14 ? 0.25 : t < T_LIGHT + 0.22 ? 1 : 1;
      if (r.dark) r.dark.style.opacity = f1(1 - lit * smooth((t - T_LIGHT) / 0.05));

      /* shake + flash from every impact */
      let sx = 0;
      let sy = 0;
      let flash = 0;
      for (const h of P.hits) {
        const u = t - h.t;
        if (u > 0 && u < 0.6) {
          const e = Math.exp(-u * 10) * (h.heavy ? 1.5 : 1);
          sx += 7 * e * Math.sin(u * 95);
          sy += 6 * e * Math.cos(u * 120);
          flash = Math.max(flash, (h.heavy ? 0.5 : 0.32) * Math.exp(-u * 14));
        }
      }
      set("scene", "transform", `translate(${f1(sx)} ${f1(sy)})`);
      if (r.flash) r.flash.style.opacity = f1(flash);

      /* the bag */
      const sw = swing(t);
      const sq = squash(t);
      set("bag", "transform", `rotate(${f1(sw)} ${PIVOT[0]} ${PIVOT[1]})`);
      const cx = (BAG_X0 + BAG_X1) / 2;
      set("bagbody", "transform", `translate(${cx} ${BAG_TOP}) scale(${f1((1 - 0.06 * sq) * 1000) / 1000} ${f1((1 + 0.03 * sq) * 1000) / 1000}) translate(${-cx} ${-BAG_TOP})`);
      // its shadow on the floor slides with the swing
      set("bagshadow", "transform", `translate(${f1(Math.sin((sw * Math.PI) / 180) * 260)} 0)`);

      /* the strikes */
      let legShown = false;
      let gloveShown = false;
      for (const h of P.hits) {
        const u = t - h.t;
        const contact = rot(CONTACT[h.kind], swing(h.t));
        if (h.kind === "kick" && u > -0.24 && u < 0.4) {
          legShown = true;
          const aimed = Math.atan2(contact[1] - HIP[1], contact[0] - HIP[0]);
          const start = (72 * Math.PI) / 180;
          let ang;
          let op;
          if (u < 0) {
            const k = (u + 0.24) / 0.24;
            ang = lerp(start, aimed, easeIn(k));
            op = smooth(k / 0.35);
          } else if (u < 0.08) {
            ang = aimed - 0.03 * Math.sin((u / 0.08) * Math.PI);
            op = 1;
          } else {
            const k = (u - 0.08) / 0.24;
            ang = lerp(aimed, start, easeOut(k));
            op = 1 - smooth(k / 0.6);
          }
          const dist = Math.hypot(contact[0] - HIP[0], contact[1] - HIP[1]);
          const sc = dist / (SHIN_HIT * LEG_L);
          set("leg", "transform", `translate(${HIP[0]} ${HIP[1]}) rotate(${f1((ang * 180) / Math.PI)}) scale(${f1(sc * 1000) / 1000} ${f1(Math.min(1.1, sc) * 1000) / 1000})`);
          set("leg", "opacity", f1(op));
          // a smear of motion behind the shin as it whips in
          set("legblur", "opacity", u < 0 ? f1(0.55 * ((u + 0.24) / 0.24)) : 0);
        }
        if (h.kind === "punch" && u > -0.16 && u < 0.38) {
          gloveShown = true;
          let x;
          if (u < 0) x = lerp(470, contact[0] + 4, easeIn((u + 0.16) / 0.16));
          else if (u < 0.06) x = contact[0] + 4 + 6 * Math.sin((u / 0.06) * Math.PI);
          else x = lerp(contact[0] + 4, 480, easeOut((u - 0.06) / 0.32));
          set("arm", "transform", `translate(${f1(x)} ${f1(contact[1] + 2)})`);
        }
      }
      if (!legShown) set("leg", "opacity", 0);
      set("arm", "opacity", gloveShown ? 1 : 0);

      P.hits.forEach((h, i) => {
        const u = t - h.t;
        const c = rot(CONTACT[h.kind], swing(h.t));
        if (u > 0 && u < 0.55) {
          set(`ring${i}`, "cx", f1(c[0]));
          set(`ring${i}`, "cy", f1(c[1]));
          set(`ring${i}`, "r", f1(6 + easeOut(u / 0.55) * (h.heavy ? 170 : 120)));
          set(`ring${i}`, "opacity", f1(0.85 * (1 - u / 0.55)));
          set(`pow${i}`, "transform", `translate(${f1(c[0])} ${f1(c[1])}) scale(${f1(0.6 + u * 3)})`);
          set(`pow${i}`, "opacity", f1(Math.max(0, 1 - u / 0.2)));
        } else {
          set(`ring${i}`, "opacity", 0);
          set(`pow${i}`, "opacity", 0);
        }
        // dust off the leather, thrown away from the strike
        const away = h.kind === "kick" ? 1 : -1;
        for (let j = 0; j < DUST; j++) {
          const el = r[`d${i}_${j}`];
          if (!el) continue;
          if (u <= 0 || u > 1.2) {
            el.setAttribute("opacity", 0);
            continue;
          }
          const a = (seeded(j + i * 40, 1) - 0.5) * 2.4;
          const v = 40 + seeded(j + i * 40, 2) * 120;
          const x = c[0] - away * Math.cos(a) * v * u * 0.9 + away * 6;
          const y = c[1] + Math.sin(a) * v * u * 0.9 + 40 * u * u;
          const life = 1 - u / 1.2;
          el.setAttribute("cx", f1(x));
          el.setAttribute("cy", f1(y));
          el.setAttribute("r", f1((2 + seeded(j, 3) * 5) * (0.6 + u * 1.6)));
          el.setAttribute("opacity", f1(0.55 * life));
        }

        /* the class slams in under the bag */
        const s = t - h.t - 0.04;
        const g = r[`line${i}`];
        if (g) {
          if (s <= 0) g.setAttribute("opacity", 0);
          else {
            const k2 = easeOut(s / 0.22);
            const sc = lerp(1.9, 1, k2);
            const by = BLOCK0 + i * BLOCK_H + 26;
            const jx = s < 0.25 ? Math.sin(s * 90) * 4 * (1 - s / 0.25) : 0;
            g.setAttribute("opacity", f1(clamp(s / 0.06, 0, 1)));
            g.setAttribute("transform", `translate(${f1(180 + jx)} ${f1(by)}) scale(${f1(sc * 1000) / 1000}) translate(-180 ${-by})`);
          }
        }
        set(`glow${i}`, "opacity", f1(s > 0 ? Math.max(0, 1 - s / 0.7) : 0));
      });

      /* the day, and the site at the end */
      set("head", "opacity", f1(smooth((t - 0.45) / 0.35)));
      set("head", "transform", `translate(0 ${f1(lerp(-10, 0, easeOut((t - 0.45) / 0.35)))})`);
      set("site", "opacity", f1(smooth((t - P.site) / 0.5)));

      /* dust motes drifting in the beam */
      for (let j = 0; j < 36; j++) {
        const el = r[`mote${j}`];
        if (!el) continue;
        const x = 120 + ((seeded(j, 8) * 120 + t * (3 + seeded(j, 9) * 5) + Math.sin(t * 0.8 + j) * 6) % 120);
        const y = (((seeded(j, 10) * 520 - t * (5 + seeded(j, 11) * 7)) % 520) + 520) % 520;
        el.setAttribute("cx", f1(x + (y / 520) * (x - 180) * 0.8));
        el.setAttribute("cy", f1(y));
      }
    }

    const endMs = Math.round(P.end * 1000);
    if (renderMode) {
      window.__renderAt = render;
      window.__rhBagEnd = endMs;
      render(0);
      const fonts = document.fonts
        ? Promise.all([document.fonts.load('400 30px "Anton"'), document.fonts.load('900 15px "Inter"')]).then(() => document.fonts.ready)
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
  }, [renderMode, still, classes, P]);

  const bagW = BAG_X1 - BAG_X0;
  const bagH = BAG_BOT - BAG_TOP;

  return (
    <div className={`hb${still ? " is-static" : ""}`}>
      <svg className="hb-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <radialGradient id="hb-room" cx="0.5" cy="0.32" r="0.8">
            <stop offset="0" stopColor="#2a2626" />
            <stop offset="0.5" stopColor="#141213" />
            <stop offset="1" stopColor="#060606" />
          </radialGradient>
          <filter id="hb-concrete" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.08" numOctaves="4" seed="12" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.48  0 0 0 0 0.46  0 0 0 0.16 0" />
          </filter>
          <linearGradient id="hb-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff4e0" stopOpacity="0.34" />
            <stop offset="0.7" stopColor="#fff4e0" stopOpacity="0.1" />
            <stop offset="1" stopColor="#fff4e0" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hb-pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff1d8" stopOpacity="0.22" />
            <stop offset="1" stopColor="#fff1d8" stopOpacity="0" />
          </radialGradient>
          {/* black leather, lit hard from above: a bright stripe down the
              curve, falling off into the sides */}
          <linearGradient id="hb-leather" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#060606" />
            <stop offset="0.22" stopColor="#1e1c1c" />
            <stop offset="0.38" stopColor="#4a4646" />
            <stop offset="0.46" stopColor="#2a2828" />
            <stop offset="0.8" stopColor="#121111" />
            <stop offset="1" stopColor="#040404" />
          </linearGradient>
          <linearGradient id="hb-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </linearGradient>
          <filter id="hb-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1 0.4" numOctaves="2" seed="3" />
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0" />
          </filter>
          <linearGradient id="hb-skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9a47c" />
            <stop offset="0.5" stopColor="#b67f58" />
            <stop offset="1" stopColor="#7c4f33" />
          </linearGradient>
          <linearGradient id="hb-shorts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff3a55" />
            <stop offset="0.45" stopColor="#e4002b" />
            <stop offset="1" stopColor="#7a0016" />
          </linearGradient>
          <linearGradient id="hb-glove" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff4a62" />
            <stop offset="0.4" stopColor="#d4002a" />
            <stop offset="1" stopColor="#6a0012" />
          </linearGradient>
          <radialGradient id="hb-pow">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.3" stopColor="#fff0d8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffb070" stopOpacity="0" />
          </radialGradient>
          <filter id="hb-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="hb-blur6" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="hb-textglow" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <linearGradient id="hb-chain" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3a3a3c" />
            <stop offset="0.5" stopColor="#c9c9cc" />
            <stop offset="1" stopColor="#3a3a3c" />
          </linearGradient>
        </defs>

        <g ref={ref("scene")}>
          {/* ---- the gym: dark room, concrete, a spotlight ---- */}
          <rect x="-20" y="-20" width={W + 40} height={H + 40} fill="url(#hb-room)" />
          <rect x="-20" y="-20" width={W + 40} height={H + 40} filter="url(#hb-concrete)" />
          {/* racks and plates lost in the dark either side */}
          <g opacity="0.5" fill="#0c0b0b">
            <rect x="8" y="180" width="8" height="300" />
            <rect x="48" y="180" width="8" height="300" />
            <rect x="4" y="260" width="58" height="5" />
            <circle cx="22" cy="262" r="22" fill="#121010" />
            <circle cx="22" cy="262" r="6" fill="#060606" />
            <rect x="320" y="160" width="10" height="340" />
            <rect x="300" y="300" width="56" height="6" />
            <circle cx="338" cy="420" r="18" fill="#121010" />
          </g>
          {/* the spotlight cone and its pool */}
          <path d="M150,-10 L210,-10 L330,560 L30,560 Z" fill="url(#hb-beam)" />
          <ellipse cx="180" cy="560" rx="170" ry="40" fill="url(#hb-pool)" />
          <rect x="-20" y="556" width={W + 40} height="110" fill="#0a0909" opacity="0.6" />
          <ellipse ref={ref("bagshadow")} cx="180" cy="566" rx="54" ry="9" fill="#000" opacity="0.55" filter="url(#hb-soft)" />

          {/* ---- the bag on its chain, swung about the pivot ---- */}
          <g ref={ref("bag")}>
            {/* chain */}
            {Array.from({ length: 8 }, (_, i) => (
              <ellipse key={i} cx="180" cy={-48 + i * 13} rx={i % 2 ? 2.2 : 4.6} ry="6.4" fill="none" stroke="url(#hb-chain)" strokeWidth="2.2" />
            ))}
            <path d={`M180,${BAG_TOP - 18} L${BAG_X0 + 10},${BAG_TOP + 2} M180,${BAG_TOP - 18} L${BAG_X1 - 10},${BAG_TOP + 2} M180,${BAG_TOP - 18} L180,${BAG_TOP}`} stroke="#8a8a8e" strokeWidth="1.6" />
            <circle cx="180" cy={BAG_TOP - 18} r="4" fill="none" stroke="#b9b9bd" strokeWidth="2" />
            <g ref={ref("bagbody")}>
              <rect x={BAG_X0} y={BAG_TOP} width={bagW} height={bagH} rx="16" fill="url(#hb-leather)" />
              <rect x={BAG_X0} y={BAG_TOP} width={bagW} height={bagH} rx="16" filter="url(#hb-grain)" />
              {/* rounded top and bottom caps */}
              <ellipse cx="180" cy={BAG_TOP + 4} rx={bagW / 2 - 2} ry="9" fill="#2c2a2a" />
              <ellipse cx="180" cy={BAG_TOP + 4} rx={bagW / 2 - 8} ry="5" fill="#161515" />
              <rect x={BAG_X0} y={BAG_BOT - 30} width={bagW} height="30" rx="14" fill="url(#hb-top)" />
              {/* stitched seams round it */}
              {[BAG_TOP + 20, BAG_BOT - 22].map((y) => (
                <g key={y}>
                  <path d={`M${BAG_X0 + 2},${y} C${BAG_X0 + 30},${y + 6} ${BAG_X1 - 30},${y + 6} ${BAG_X1 - 2},${y}`} stroke="#000" strokeWidth="1.6" fill="none" />
                  <path d={`M${BAG_X0 + 3},${y + 1.6} C${BAG_X0 + 30},${y + 7.6} ${BAG_X1 - 30},${y + 7.6} ${BAG_X1 - 3},${y + 1.6}`} stroke="#6a6666" strokeWidth="0.7" strokeDasharray="2 1.6" fill="none" />
                </g>
              ))}
              {/* a red band with the gym's name on it */}
              <rect x={BAG_X0} y="128" width={bagW} height="40" fill="#b8001f" />
              <rect x={BAG_X0} y="128" width={bagW} height="40" fill="url(#hb-leather)" opacity="0.45" style={{ mixBlendMode: "multiply" }} />
              <path d={`M${BAG_X0},129 L${BAG_X1},129 M${BAG_X0},167 L${BAG_X1},167`} stroke="#ffffff" strokeWidth="1" opacity="0.5" />
              <text x="180" y="158" textAnchor="middle" className="hb-band">
                RHBJJ
              </text>
              {/* the hard top light running down the curve */}
              <rect x={BAG_X0 + 30} y={BAG_TOP + 8} width="12" height={bagH - 20} rx="6" fill="#fff" opacity="0.07" filter="url(#hb-soft)" />
            </g>
          </g>

          {/* ---- impacts ---- */}
          {P.hits.map((h, i) => (
            <g key={`fx${i}`}>
              <circle ref={ref(`ring${i}`)} r="6" fill="none" stroke="#fff4e4" strokeWidth={h.heavy ? 3 : 2.2} opacity="0" />
              <g ref={ref(`pow${i}`)} opacity="0">
                <circle r="26" fill="url(#hb-pow)" />
                {Array.from({ length: 10 }, (_, k) => {
                  const a = (k / 10) * Math.PI * 2;
                  const L = k % 2 ? 18 : 30;
                  return <path key={k} d={`M${f1(Math.cos(a) * 8)},${f1(Math.sin(a) * 8)} L${f1(Math.cos(a) * L)},${f1(Math.sin(a) * L)}`} stroke="#fff6e8" strokeWidth="1.8" strokeLinecap="round" />;
                })}
              </g>
              <g filter="url(#hb-soft)">
                {Array.from({ length: DUST }, (_, j) => (
                  <circle key={j} ref={ref(`d${i}_${j}`)} r="3" fill="#cdbfae" opacity="0" />
                ))}
              </g>
            </g>
          ))}

          {/* ---- the kicking leg: hip at the origin, foot out along +x ---- */}
          <g ref={ref("leg")} opacity="0">
            <g ref={ref("legblur")} opacity="0" filter="url(#hb-blur6)">
              <path d={`M0,-36 L${LEG_L},-16 L${LEG_L},16 L0,36 Z`} fill="#b67f58" opacity="0.55" transform="rotate(9)" />
            </g>
            {/* thigh */}
            <path d="M0,-34 C40,-32 80,-27 112,-22 L112,22 C80,27 40,32 0,34 Z" fill="url(#hb-skin)" />
            {/* Muay Thai shorts: wide satin leg with a white and gold trim */}
            <path d="M-20,-42 C20,-41 60,-38 92,-33 L98,31 C62,36 22,41 -20,42 Z" fill="url(#hb-shorts)" />
            <path d="M92,-33 L98,31" stroke="#ffffff" strokeWidth="3.4" />
            <path d="M87,-33 L93,31" stroke="#ffd34a" strokeWidth="1.4" />
            <path d="M-10,-38 C24,-37 58,-34 84,-30" stroke="#ff8a9a" strokeWidth="2.4" fill="none" opacity="0.6" />
            <path d="M10,-6 C40,-3 66,2 88,8" stroke="#7a0016" strokeWidth="2" fill="none" opacity="0.5" />
            {/* knee, then the shin: the hard front edge lit, tapering to the ankle */}
            <ellipse cx="112" cy="0" rx="11" ry="22" fill="#c08a62" />
            <path d="M112,-21 C140,-19 175,-16 205,-13 L205,13 C175,15 140,18 112,21 Z" fill="url(#hb-skin)" />
            <path d="M118,-19 C146,-17 176,-14.6 203,-12" stroke="#f6cfae" strokeWidth="2.4" fill="none" opacity="0.75" />
            <path d="M120,10 C150,12 178,11 202,9" stroke="#6a4028" strokeWidth="2" fill="none" opacity="0.35" />
            {/* ankle support */}
            <path d="M193,-14 L207,-14 L207,14 L193,14 Z" fill="#1a1a1c" />
            <path d="M196,-14 L196,14 M200,-14 L200,14 M204,-14 L204,14" stroke="#3a3a3e" strokeWidth="0.8" />
            {/* the foot, pointed: instep along the top, heel under, toes curled */}
            <path d="M207,-13 C222,-15 236,-13 244,-7 C249,-3 249,3 245,6 C240,8 236,8 232,9 C224,14 214,15 207,13 Z" fill="url(#hb-skin)" />
            <path d="M209,-12 C222,-14 234,-12 242,-7" stroke="#f6cfae" strokeWidth="1.6" fill="none" opacity="0.7" />
            <path d="M238,4 L244,5 M234,6 L240,7.4" stroke="#6a4028" strokeWidth="0.8" opacity="0.6" />
          </g>

          {/* ---- the punching arm: a red glove on the end of it ---- */}
          <g ref={ref("arm")} opacity="0">
            <path d="M18,-15 C80,-17 170,-22 260,-26 L260,26 C170,22 80,17 18,15 Z" fill="url(#hb-skin)" />
            <path d="M26,-14 C90,-16 170,-20 258,-24" stroke="#f3c7a2" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M30,10 C90,12 170,15 258,19" stroke="#6a4028" strokeWidth="2" fill="none" opacity="0.3" />
            {/* white cuff */}
            <rect x="12" y="-17" width="22" height="34" rx="5" fill="#f1f1f3" />
            <path d="M16,-17 L16,17 M30,-17 L30,17" stroke="#c8c8ce" strokeWidth="0.8" />
            {/* the glove: knuckle pad leading, thumb tucked on top */}
            <path d="M14,-24 C4,-26 -12,-22 -18,-10 C-22,0 -20,14 -10,22 C-2,27 8,26 14,22 Z" fill="url(#hb-glove)" />
            <path d="M-2,-26 C-10,-34 4,-38 12,-30 L14,-22 Z" fill="url(#hb-glove)" />
            <path d="M-14,-12 C-17,-4 -16,6 -10,14" stroke="#ff8a98" strokeWidth="2.4" fill="none" opacity="0.7" strokeLinecap="round" />
            <path d="M2,-22 C-4,-14 -6,6 0,20" stroke="#6a0012" strokeWidth="1" fill="none" opacity="0.6" />
          </g>

          {/* ---- the day and today's classes ---- */}
          <g ref={ref("head")} opacity="0">
            <text x="180" y={HEAD_Y} textAnchor="middle" className="hb-day">
              {day.toUpperCase()}
            </text>
            <rect x="152" y={HEAD_Y + 8} width="56" height="3.4" fill="#e4002b" />
          </g>
          {classes.map(([name, a, b], i) => {
            const y = BLOCK0 + i * BLOCK_H;
            return (
              <g key={i} ref={ref(`line${i}`)} opacity="0">
                <g ref={ref(`glow${i}`)} opacity="0" filter="url(#hb-textglow)">
                  <text x="180" y={y + 28} textAnchor="middle" className="hb-name" style={{ fill: "#ff3a55" }}>
                    {name.toUpperCase()}
                  </text>
                </g>
                <text x="180" y={y + 28} textAnchor="middle" className="hb-name">
                  {name.toUpperCase()}
                </text>
                <text x="180" y={y + 48} textAnchor="middle" className="hb-time">
                  {span(a, b)}
                </text>
              </g>
            );
          })}
          <text ref={ref("site")} x="180" y={BLOCK0 + classes.length * BLOCK_H + 34} textAnchor="middle" className="hb-site" opacity="0">
            RHBJJ.CA
          </text>

          {/* motes in the beam */}
          {Array.from({ length: 36 }, (_, j) => (
            <circle key={j} ref={ref(`mote${j}`)} r={0.5 + seeded(j, 12) * 0.9} fill="#fff1d8" opacity={0.25 + seeded(j, 13) * 0.4} />
          ))}
        </g>
      </svg>
      <div className="hb-vignette" />
      <div className="hb-flash" ref={ref("flash")} />
      <div className="hb-grain" />
      <div className="hb-dark" ref={ref("dark")} />
    </div>
  );
}
