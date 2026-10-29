// RhSpell.js — today's classes at Richmond Hill Jiu-Jitsu, as a wizard duel.
//
// A castle on a cliff over a black lake, a full moon, floating candles. An
// owl swoops in with a scroll in its talons and drops it; the scroll unrolls
// under a red-and-gold house banner with the day on it. A wand rises into
// frame and, for each class, winds up in a swish, flicks, and fires a
// crackling bolt across the frame — it slams into the page with a flash, a
// shockwave and a shower of sparks, and the class bursts onto the parchment
// from the point of impact. To finish, the wand carves a lightning bolt in the
// air and RHBJJ.CA lands under the scroll.
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
const ROLL_TOP = 128;
const PAGE_BOTTOM = 468;
const BLOCK_H = 70;
const READY = [262, 552]; // where the wand tip rests between spells

/* ---------------------------------------------------------------- timing */

const T_OWL = [0.25, 1.55];
const T_DROP = 1.2;
const T_UNROLL = [1.2, 1.85];
const T_WAND_IN = [1.6, 2.25];
const T_FIRST = 2.3;
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
  return { lines, bolt: [fin, fin + 0.75], finHit: fin + 0.8, exit: fin + 1.25, end: fin + 3.2 };
}

/* ---------------------------------------------------------------- the owl */

function owlWings(flap) {
  // flap in [-1, 1]: wings up to wings down
  const wy = -14 * flap;
  return `M-4,-2 C-14,${f1(-6 + wy * 0.6)} -24,${f1(-4 + wy)} -30,${f1(2 + wy * 1.1)} C-22,${f1(6 + wy * 0.5)} -12,6 -3,5 Z M4,-2 C14,${f1(-6 + wy * 0.6)} 24,${f1(-4 + wy)} 30,${f1(2 + wy * 1.1)} C22,${f1(6 + wy * 0.5)} 12,6 3,5 Z`;
}

/* ---------------------------------------------------------------- castle */

const CASTLE = (() => {
  // towers: [x, width, top, roof height]
  const towers = [
    [34, 16, 520, 26],
    [58, 22, 496, 34],
    [92, 14, 530, 20],
    [118, 28, 470, 44],
    [156, 18, 506, 30],
    [186, 34, 452, 52],
    [228, 16, 498, 28],
    [252, 26, 478, 40],
    [288, 14, 516, 22],
    [312, 20, 500, 30],
  ];
  let d = "";
  const windows = [];
  towers.forEach(([x, w, top, rh], i) => {
    d += ` M${x},562 L${x},${top} L${x + w / 2},${top - rh} L${x + w},${top} L${x + w},562 Z`;
    const rows = Math.floor((560 - top) / 16);
    for (let r = 0; r < rows; r++) {
      if (seeded(i, r + 3) > 0.45) windows.push([x + w / 2 - 1.6, top + 8 + r * 16, seeded(i, r + 9)]);
    }
  });
  d += " M20,562 L20,540 L340,540 L340,562 Z";
  return { d, windows };
})();

// the finale's lightning bolt, carved big across the page
const BOLT_SHAPE = [
  [226, 250],
  [168, 352],
  [206, 356],
  [140, 462],
];
const BOLT_C = [184, 356];

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

  const areaTop = 236;
  const areaH = PAGE_BOTTOM - 18 - areaTop;
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

    const boltAt = (k) => {
      const segs = BOLT_SHAPE.length - 1;
      const x = clamp(k, 0, 1) * segs;
      const i = Math.min(segs - 1, Math.floor(x));
      const f = x - i;
      return [lerp(BOLT_SHAPE[i][0], BOLT_SHAPE[i + 1][0], f), lerp(BOLT_SHAPE[i][1], BOLT_SHAPE[i + 1][1], f)];
    };

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
      if (t < P.bolt[0]) return READY;
      if (t < P.bolt[0] + 0.2) {
        const u = ease((t - P.bolt[0]) / 0.2);
        return [lerp(READY[0], BOLT_SHAPE[0][0], u), lerp(READY[1], BOLT_SHAPE[0][1], u)];
      }
      if (t < P.bolt[1]) return boltAt((t - P.bolt[0] - 0.2) / (P.bolt[1] - P.bolt[0] - 0.2));
      if (t < P.exit) {
        const u = easeOut((t - P.bolt[1]) / (P.exit - P.bolt[1]));
        const e = BOLT_SHAPE[BOLT_SHAPE.length - 1];
        return [lerp(e[0], 238, u), lerp(e[1], 540, u)];
      }
      const u = ease((t - P.exit) / 0.7);
      return [lerp(238, 470, u), lerp(540, 800, u)];
    }

    // how hard sparks pour off the tip
    function pour(t) {
      for (const L of P.lines) {
        const c = t - L.t0;
        if (c >= 0 && c < C_SWISH) return 0.55;
        if (c >= C_SWISH && c < C_FIRE + 0.1) return 1;
      }
      if (t >= P.bolt[0] + 0.2 && t < P.bolt[1]) return 1;
      return t > T_WAND_IN[0] && t < P.exit ? 0.12 : 0;
    }

    // a jagged bolt from a to b, re-struck every tick so it crackles
    function boltPath(a, b, headK, seed) {
      const N = 12;
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const L = Math.hypot(dx, dy) || 1;
      const nx = -dy / L;
      const ny = dx / L;
      let d = `M${f1(a[0])},${f1(a[1])}`;
      const last = Math.max(1, Math.round(N * headK));
      for (let k = 1; k <= last; k++) {
        const u = k / N;
        const env = Math.sin(Math.min(1, u) * Math.PI);
        const j = (seeded(seed, k) - 0.5) * 22 * env;
        d += ` L${f1(a[0] + dx * u + nx * j)},${f1(a[1] + dy * u + ny * j)}`;
      }
      return d;
    }

    function render(ms) {
      const t = ms / 1000;
      const tick = Math.floor(t * 30);

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
      {
        const u = t - P.finHit;
        if (u > 0 && u < 0.8) {
          const e = Math.exp(-u * 6);
          sx += 9 * e * Math.sin(u * 80);
          sy += 7 * e * Math.cos(u * 95);
          flash = Math.max(flash, 0.75 * Math.exp(-u * 7));
        }
      }
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
      CASTLE.windows.forEach((w, i) => {
        const el = r[`win${i}`];
        if (el) el.setAttribute("opacity", f1(0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * (1 + w[2] * 3) + i))));
      });

      /* the owl: swoops in with the scroll, drops it, climbs away */
      {
        const k = (t - T_OWL[0]) / (T_OWL[1] - T_OWL[0]);
        if (k > 0 && k < 1.05) {
          const x = lerp(-60, 420, k);
          const y = k < 0.6 ? lerp(10, 100, ease(k / 0.6)) : lerp(100, -60, ease((k - 0.6) / 0.4));
          set("owl", "transform", `translate(${f1(x)} ${f1(y)}) rotate(${k < 0.6 ? 6 : -14}) scale(1.8)`);
          set("owl-wings", "d", owlWings(Math.sin(t * 26)));
          set("owl", "opacity", 1);
          set("carried", "opacity", t < T_DROP ? 1 : 0);
        } else {
          set("owl", "opacity", 0);
        }
      }

      /* the scroll drops, then unrolls downward */
      const ur = ease((t - T_UNROLL[0]) / (T_UNROLL[1] - T_UNROLL[0]));
      const bottom = lerp(ROLL_TOP + 14, PAGE_BOTTOM, ur);
      set("page-clip", "height", f1(bottom - ROLL_TOP));
      set("roll-bottom", "transform", `translate(0 ${f1(bottom - PAGE_BOTTOM)})`);
      set("scroll", "opacity", t >= T_DROP ? 1 : 0);
      set("head", "opacity", f1(smooth((t - 1.55) / 0.4)));

      /* each line: bolt out, impact, the class bursting outward from the hit */
      for (let i = 0; i < n; i++) {
        const L = P.lines[i];
        const tg = target(i);
        const bu = t - L.fire;
        const bolt = r[`bolt${i}`];
        if (bolt) {
          if (bu > 0 && bu < BOLT_LIFE) {
            const head = clamp(bu / (C_HIT - C_FIRE), 0, 1);
            const d = boltPath(tip(L.fire), tg, head, tick * 7 + i * 101);
            ["boltg", "boltm", "boltc"].forEach((k) => set(`${k}${i}`, "d", d));
            const fadeK = bu < C_HIT - C_FIRE ? 1 : 1 - (bu - (C_HIT - C_FIRE)) / (BOLT_LIFE - (C_HIT - C_FIRE));
            bolt.setAttribute("opacity", f1(clamp(fadeK, 0, 1)));
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

      /* finale: the lightning bolt carved in the air, then it detonates */
      {
        const shown = t < P.bolt[0] + 0.2 ? 0 : clamp((t - P.bolt[0] - 0.2) / (P.bolt[1] - P.bolt[0] - 0.2), 0, 1);
        const segs = BOLT_SHAPE.length - 1;
        let d = `M${BOLT_SHAPE[0][0]},${BOLT_SHAPE[0][1]}`;
        for (let i = 1; i <= segs; i++) {
          if (shown * segs >= i) d += ` L${BOLT_SHAPE[i][0]},${BOLT_SHAPE[i][1]}`;
          else {
            const p = boltAt(shown);
            d += ` L${f1(p[0])},${f1(p[1])}`;
            break;
          }
        }
        const after = t - P.finHit;
        set("sigil", "opacity", f1(shown <= 0 ? 0 : after < 0 ? 1 : Math.max(0, 1 - after / 0.5)));
        ["sigilg", "sigilm", "sigilc"].forEach((key) => set(key, "d", d));
        if (after > 0 && after < 0.8) {
          set("finring", "r", f1(10 + easeOut(after / 0.8) * 260));
          set("finring", "opacity", f1(0.9 * (1 - after / 0.8)));
        } else set("finring", "opacity", 0);
        for (let j = 0; j < 60; j++) {
          const el = r[`fb${j}`];
          if (!el) continue;
          if (after <= 0 || after > 1.3) {
            el.setAttribute("opacity", 0);
            continue;
          }
          const a = seeded(j, 21) * Math.PI * 2;
          const v = 120 + seeded(j, 22) * 240;
          el.setAttribute("cx", f1(BOLT_C[0] + Math.cos(a) * v * after * (1 - after * 0.35)));
          el.setAttribute("cy", f1(BOLT_C[1] + Math.sin(a) * v * after * (1 - after * 0.35) + 90 * after * after));
          el.setAttribute("r", f1((1 + seeded(j, 23) * 2) * (1 - after / 1.3)));
          el.setAttribute("opacity", f1(1 - after / 1.3));
        }
        set("site", "opacity", f1(smooth((t - P.finHit - 0.2) / 0.5)));
        const sh = (t - P.finHit) / 1.0;
        set("shimmer", "opacity", sh > 0 && sh < 1 ? f1(Math.sin(sh * Math.PI) * 0.9) : 0);
        set("shimmer", "transform", `translate(0 ${f1(lerp(ROLL_TOP - 60, PAGE_BOTTOM + 40, clamp(sh, 0, 1)))})`);
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
    [36, 60, 0.75],
    [96, 96, 0.55],
    [168, 40, 0.5],
    [24, 250, 0.65],
    [340, 230, 0.7],
    [22, 420, 0.55],
    [338, 400, 0.6],
    [70, 30, 0.45],
    [232, 92, 0.5],
    [130, 64, 0.42],
  ];

  return (
    <div className={`rs${still ? " is-static" : ""}`}>
      <svg className="rs-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="rs-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a0d1f" />
            <stop offset="0.55" stopColor="#1b1a33" />
            <stop offset="0.82" stopColor="#2a2238" />
            <stop offset="1" stopColor="#07070d" />
          </linearGradient>
          <radialGradient id="rs-moon" cx="0.42" cy="0.4" r="0.6">
            <stop offset="0" stopColor="#fffaf0" />
            <stop offset="0.7" stopColor="#e9e2cf" />
            <stop offset="1" stopColor="#c9c0aa" />
          </radialGradient>
          <radialGradient id="rs-moonglow">
            <stop offset="0" stopColor="#d6dcff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#d6dcff" stopOpacity="0" />
          </radialGradient>
          <filter id="rs-cloud" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
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
          <linearGradient id="rs-banner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a3101e" />
            <stop offset="0.5" stopColor="#7a0814" />
            <stop offset="1" stopColor="#4a040b" />
          </linearGradient>
          <linearGradient id="rs-goldtxt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff1b8" />
            <stop offset="0.5" stopColor="#f2c14e" />
            <stop offset="1" stopColor="#b8801c" />
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
          <linearGradient id="rs-lake" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1d33" />
            <stop offset="1" stopColor="#05050a" />
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
          {/* ---- night sky, moon, a little cloud ---- */}
          <rect x="-20" y="-20" width={W + 40} height={H + 40} fill="url(#rs-night)" />
          {Array.from({ length: 50 }, (_, i) => (
            <circle key={i} cx={seeded(i, 30) * W} cy={seeded(i, 31) * 420} r={0.4 + seeded(i, 32) * 0.9} fill="#e8ecff" opacity={0.3 + seeded(i, 33) * 0.6} />
          ))}
          <circle cx="292" cy="78" r="90" fill="url(#rs-moonglow)" />
          <circle cx="292" cy="78" r="30" fill="url(#rs-moon)" />
          <g filter="url(#rs-cloud)" opacity="0.6">
            <ellipse cx="250" cy="96" rx="60" ry="8" fill="#2a2a44" />
            <ellipse cx="90" cy="150" rx="80" ry="10" fill="#22223a" />
          </g>

          {/* ---- the castle on its cliff, the lake under it ---- */}
          <path d="M-20,640 L-20,566 C40,556 80,570 130,562 C190,552 240,566 300,558 C330,554 360,560 380,566 L380,640 Z" fill="#0b0a12" />
          <path d={CASTLE.d} fill="#0e0c18" />
          {CASTLE.windows.map(([x, y], i) => (
            <rect key={i} ref={ref(`win${i}`)} x={x} y={y} width="3.2" height="5" fill="#ffcf6a" />
          ))}
          <rect x="-20" y="590" width={W + 40} height="70" fill="url(#rs-lake)" />
          {CASTLE.windows.map(([x, y], i) => (
            <rect key={`r${i}`} x={x - 0.4} y={590 + (562 - y) * 0.35} width="4" height="1.2" fill="#ffcf6a" opacity="0.35" />
          ))}
          <path d="M-20,590 L380,590" stroke="#3a3a5a" strokeWidth="0.8" opacity="0.6" />

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
                {/* the house banner across the head of the page */}
                <path d="M34,150 L326,150 L318,171 L326,192 L34,192 L42,171 Z" fill="url(#rs-banner)" />
                <path d="M34,150 L326,150 M34,192 L326,192" stroke="#e8b84a" strokeWidth="2.2" />
                <path d="M38,155.5 L322,155.5 M38,186.5 L322,186.5" stroke="#e8b84a" strokeWidth="0.8" opacity="0.8" />
                <text x="180" y="181" textAnchor="middle" className="rs-day">
                  {day.toUpperCase()}
                </text>
                <text x="180" y="217" textAnchor="middle" className="rs-kicker">
                  TODAY&#8217;S CLASSES
                </text>
                <path d="M110,225 C135,221 158,228 180,224 C202,228 225,221 250,225" stroke="#7a4a22" strokeWidth="1" fill="none" />
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
                  <path ref={ref(`boltg${i}`)} stroke={C.glow} strokeWidth="12" opacity="0.55" filter="url(#rs-bloom)" />
                  <path ref={ref(`boltm${i}`)} stroke={C.mid} strokeWidth="4.2" />
                  <path ref={ref(`boltc${i}`)} stroke={C.core} strokeWidth="1.6" />
                </g>
                <circle ref={ref(`ring${i}`)} cx={target(i)[0]} cy={target(i)[1]} r="8" fill="none" stroke={C.mid} strokeWidth="2.4" opacity="0" />
                <circle ref={ref(`core${i}`)} cx={target(i)[0]} cy={target(i)[1]} r="14" fill="url(#rs-core)" opacity="0" />
                {Array.from({ length: BURST }, (__, j) => (
                  <circle key={j} ref={ref(`b${i}_${j}`)} r="1" fill={j % 4 === 0 ? "#ffffff" : C.mid} opacity="0" />
                ))}
              </g>
            );
          })}

          {/* ---- the finale's lightning bolt ---- */}
          <g ref={ref("sigil")} opacity="0" fill="none" strokeLinecap="round" strokeLinejoin="miter">
            <path ref={ref("sigilg")} stroke="#ff9a1a" strokeWidth="22" opacity="0.6" filter="url(#rs-bloom)" />
            <path ref={ref("sigilm")} stroke="#ffd25a" strokeWidth="8" />
            <path ref={ref("sigilc")} stroke="#fffbe8" strokeWidth="3" />
          </g>
          <circle ref={ref("finring")} cx={BOLT_C[0]} cy={BOLT_C[1]} r="10" fill="none" stroke="#ffe08a" strokeWidth="3" opacity="0" />
          {Array.from({ length: 60 }, (_, j) => (
            <circle key={j} ref={ref(`fb${j}`)} r="1" fill={j % 3 ? "#ffd25a" : "#ffffff"} opacity="0" />
          ))}

          <text ref={ref("site")} x="180" y="512" textAnchor="middle" className="rs-site" opacity="0">
            RHBJJ.CA
          </text>

          {/* ---- the owl, with the rolled scroll in its talons ---- */}
          <g ref={ref("owl")} opacity="0">
            <g ref={ref("carried")}>
              <rect x="-22" y="12" width="44" height="9" rx="4.5" fill="url(#rs-wood)" />
              <rect x="-19" y="13.5" width="38" height="6" rx="3" fill="#e2c892" />
              <path d="M-4,8 L-6,14 M4,8 L6,14" stroke="#1a120a" strokeWidth="1.6" />
            </g>
            <path ref={ref("owl-wings")} fill="#3a2c36" />
            <ellipse cx="0" cy="2" rx="8" ry="10" fill="#4a3a42" />
            <ellipse cx="0" cy="4" rx="5" ry="6.5" fill="#6a5658" opacity="0.7" />
            <circle cx="0" cy="-9" r="7" fill="#4a3a42" />
            <path d="M-6,-13 L-4,-19 L-2,-14 M6,-13 L4,-19 L2,-14" fill="#4a3a42" stroke="#4a3a42" strokeWidth="1" />
            <circle cx="-2.6" cy="-9.5" r="1.9" fill="#ffcf4a" />
            <circle cx="2.6" cy="-9.5" r="1.9" fill="#ffcf4a" />
            <circle cx="-2.6" cy="-9.5" r="0.8" fill="#000" />
            <circle cx="2.6" cy="-9.5" r="0.8" fill="#000" />
            <path d="M-1,-7 L0,-5 L1,-7 Z" fill="#c9a04a" />
          </g>

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
