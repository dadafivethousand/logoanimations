// Spartan.js — a 300-style speed ramp. On a bronze battlefield under a storm
// sky a Spartan archer, red cloak snapping in the wind, draws and looses.
// Time slows as the camera rides the arrow across the field and finds a
// warrior charging at full sprint; time snaps back as the arrow takes him in
// the chest. He is knocked off his feet, his sword spins away, and he hits the
// dirt in a burst of dust. Bloodless: silhouettes against the light. No text.
//
// The whole piece is a pure function of time. Every frame is computed in JS
// (forward kinematics for the run cycle, the camera, the ramp) and written
// straight to the SVG through refs, so:
//   ?render=1   exposes window.__ready / __renderAt(ms) / __spartanEnd for
//               tools/record-frames.js — a frame-exact export that cannot stall
//   ?static     the held final frame
import React, { useEffect, useMemo, useRef } from "react";
import "../Stylesheets/Spartan.css";

const W = 360;
const H = 640;
const G = 470; // the ground line, world units

/* ---------------------------------------------------------------- timing */

// Real time -> scene time. Normal speed through the draw and the loose, a
// deep slow-mo while the arrow flies, and speed snapping back into the hit.
const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function speedAt(T) {
  if (T < 1.02) return 1;
  if (T < 1.22) return lerp(1, 0.18, smooth((T - 1.02) / 0.2));
  if (T < 2.55) return 0.18;
  if (T < 2.72) return lerp(0.18, 1, smooth((T - 2.55) / 0.17));
  return 1;
}
const TABLE_MS = 9000;
const S_AT = (() => {
  const a = new Float64Array(TABLE_MS + 1);
  for (let i = 1; i <= TABLE_MS; i++) a[i] = a[i - 1] + speedAt((i - 0.5) / 1000) / 1000;
  return a;
})();
const sceneTime = (ms) => {
  const i = clamp(Math.floor(ms), 0, TABLE_MS - 1);
  const f = ms - i;
  return lerp(S_AT[i], S_AT[i + 1], clamp(f, 0, 1));
};

// scene-time beats
const DRAW_START = 0.25;
const DRAW_END = 0.9;
const LOOSE = 1.0;
const ARROW_V = 720; // world units / scene second
const ARROW_LEN = 62;
const BOW_X = 54; // grip, relative to the archer's feet
const RUN_X0 = 720;
const RUN_V = 175;
const ARROW_Y = G - 97;
// tip meets the runner's chest front (about 18 units ahead of his feet)
const S_HIT = (RUN_X0 - 18 + ARROW_V * LOOSE - (BOW_X + ARROW_LEN - 6)) / (ARROW_V + RUN_V);
const HIT_X = RUN_X0 - RUN_V * S_HIT;
const S_END = S_HIT + 2.3;
const END_MS = (() => {
  for (let i = 0; i < TABLE_MS; i++) if (S_AT[i] >= S_END) return i;
  return TABLE_MS;
})();

/* -------------------------------------------------------------- geometry */

const rad = (d) => (d * Math.PI) / 180;
// a direction from an angle measured off straight-down; `fwd` is -1 for a
// figure facing left (forward = -x) and +1 for one facing right
const dir = (deg, fwd) => [fwd * Math.sin(rad(deg)), Math.cos(rad(deg))];
const add = (p, v, k = 1) => [p[0] + v[0] * k, p[1] + v[1] * k];
const f1 = (n) => n.toFixed(1);

// a limb segment as a tapered capsule
function capsule(p, q, r1, r2) {
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const a = [p[0] + nx * r1, p[1] + ny * r1];
  const b = [q[0] + nx * r2, q[1] + ny * r2];
  const c = [q[0] - nx * r2, q[1] - ny * r2];
  const d = [p[0] - nx * r1, p[1] - ny * r1];
  return `M${f1(a[0])},${f1(a[1])} L${f1(b[0])},${f1(b[1])} A${f1(r2)},${f1(r2)} 0 0 0 ${f1(c[0])},${f1(c[1])} L${f1(d[0])},${f1(d[1])} A${f1(r1)},${f1(r1)} 0 0 0 ${f1(a[0])},${f1(a[1])} Z`;
}

// two-bone leg from the hip: thigh angle, knee bend (back), foot forward
function leg(hip, thigh, knee, fwd) {
  const k = add(hip, dir(thigh, fwd), 36);
  const shinA = thigh - knee;
  const a = add(k, dir(shinA, fwd), 35);
  const footDir = [fwd * Math.cos(rad(shinA)), -Math.sin(rad(shinA))];
  const toe = add(a, footDir, 13);
  return { k, a, toe, d: capsule(hip, k, 8.6, 6.4) + capsule(k, a, 6.2, 4.2) + capsule(a, toe, 4, 2.6) };
}

const seeded = (i, n) => {
  const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// a jagged ridge line across a span of world x, for the parallax ranges
function ridge(x0, x1, base, amp, step, seed) {
  let d = `M${x0},${H + 40} L${x0},${base}`;
  for (let x = x0, i = 0; x <= x1; x += step, i++) {
    const y = base - amp * (0.35 + 0.65 * seeded(seed, i)) - (i % 3 === 0 ? amp * 0.25 * seeded(seed + 9, i) : 0);
    d += ` L${x},${f1(y)}`;
  }
  return `${d} L${x1},${H + 40} Z`;
}

const EMBERS = Array.from({ length: 46 }, (_, i) => [seeded(i, 1) * W, seeded(i, 2) * H, 0.7 + seeded(i, 3) * 1.6, seeded(i, 4)]);
const DUST = Array.from({ length: 16 }, (_, i) => [seeded(i, 7) * 2 - 1, seeded(i, 8), 6 + seeded(i, 9) * 10]);
const STONES = Array.from({ length: 34 }, (_, i) => [-300 + i * 42 + seeded(i, 5) * 30, 2 + seeded(i, 6) * 5]);
const ROCKS_FG = [
  [-120, 64],
  [140, 40],
  [420, 70],
  [690, 50],
  [930, 66],
];

/* ------------------------------------------------------------ the figures */

// The runner, facing left, at scene time s. Geometry is relative to the
// ground point under his hip; the caller places and rotates it.
function runnerPose(s, u) {
  const hit = u >= 0;
  const phi = 2 * Math.PI * 1.55 * (hit ? S_HIT : s);
  const knock = hit ? smooth(u / 0.16) : 0;
  const fallen = hit ? smooth((u - 0.1) / 0.6) : 0;

  const legPose = (ph) => {
    const th = 10 + 34 * Math.sin(ph);
    const kn = 18 + 62 * (0.5 - 0.5 * Math.cos(ph + 0.9));
    // after the hit the legs go slack and lie out along the ground
    return [lerp(th, -4, fallen), lerp(kn, 8, fallen)];
  };
  const [thA, knA] = legPose(phi);
  const [thB, knB] = legPose(phi + Math.PI);

  // solve legs from a hip at the origin, then sit the lowest foot on the ground
  const la0 = leg([0, 0], thA, knA, -1);
  const lb0 = leg([0, 0], thB, knB, -1);
  const low = Math.max(la0.a[1] + 4, lb0.a[1] + 4, la0.toe[1] + 2.6, lb0.toe[1] + 2.6);
  const hip = [0, -low];
  const la = leg(hip, thA, knA, -1);
  const lb = leg(hip, thB, knB, -1);

  // torso pitched forward into the sprint, thrown back by the hit
  const lean = lerp(17, -28, knock);
  const sh = add(hip, dir(180 - lean, -1), 50);
  const neck = add(sh, dir(180 - lean * 1.2, -1), 9);
  const head = add(neck, dir(180 - lean * 1.2, -1), 9);

  // sword arm raised and cocked behind the head; free arm pumping
  const swing = Math.sin(phi + Math.PI);
  const sUp = lerp(158 + 6 * swing, 120, knock);
  const sFore = lerp(205 + 6 * swing, 150, knock);
  const se = add(sh, dir(sUp, -1), 25);
  const sHand = add(se, dir(sFore, -1), 23);
  const fUp = lerp(-38 * swing + 8, 150, fallen);
  const fFore = lerp(fUp + 78, 190, fallen);
  const fe = add(sh, dir(fUp, -1), 25);
  const fHand = add(fe, dir(fFore, -1), 22);

  // the chest front, where the arrow lands
  const mid = add(hip, [sh[0] - hip[0], sh[1] - hip[1]], 0.56);
  const chest = add(mid, dir(90 - lean, -1), 12.5);

  return { hip, sh, head, la, lb, se, sHand, fe, fHand, chest, lean, phi, swordAngle: sFore + 70 };
}

function archerPose(s) {
  const draw = s < DRAW_START ? 6 : s < LOOSE ? lerp(6, 46, smooth((s - DRAW_START) / (DRAW_END - DRAW_START))) : 0;
  const after = s - LOOSE;
  // the string twangs after the loose
  const twang = after > 0 ? 4.5 * Math.sin(after * 70) * Math.exp(-after * 9) : 0;
  const nockX = BOW_X - 4 - draw + twang;
  // draw arm: shoulder -> elbow -> hand at the nock
  const sh2 = [0, -118];
  const k = clamp(draw / 46, 0, 1);
  const e = after > 0 ? lerp([-20, -124][0], 4, smooth(after / 0.5)) : lerp(22, -20, k);
  const ey = after > 0 ? lerp(-124, -104, smooth(after / 0.5)) : lerp(-108, -124, k);
  const hand = after > 0 ? [lerp(4, 14, smooth(after / 0.5)), lerp(-118, -110, smooth(after / 0.5))] : [nockX, -118];
  return { draw, nockX, sh2, elbow: [e, ey], hand, flex: draw * 0.16 };
}

/* --------------------------------------------------------------- the piece */

export default function Spartan({ mode = "animated" }) {
  const q = useMemo(() => new URLSearchParams(window.location.search), []);
  const renderMode = q.has("render");
  const still =
    mode === "static" || q.has("static") || (!!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const R = useRef({});
  const ref = (k) => (el) => {
    R.current[k] = el;
  };

  useEffect(() => {
    const r = R.current;
    const set = (k, a, v) => r[k] && r[k].setAttribute(a, v);

    function render(ms) {
      const T = ms / 1000;
      const s = sceneTime(ms);
      const u = s - S_HIT;
      const slow = 1 - speedAt(T);

      /* camera: holds on the archer, rides the arrow, settles on the fall */
      const tip = s < LOOSE ? BOW_X - 4 + ARROW_LEN : Math.min(BOW_X - 4 + ARROW_LEN + ARROW_V * (s - LOOSE), HIT_X - 12);
      let camX = 60;
      if (s >= LOOSE) {
        const ride = tip - 30;
        camX = lerp(60, Math.max(60, ride), smooth((s - LOOSE) / 0.12));
      }
      if (u > 0) camX = lerp(HIT_X - 42, HIT_X + 58, smooth(u / 0.9));
      // shake on the hit
      const shake = u > 0 ? Math.exp(-u * 7) : 0;
      const sx = shake * 6 * Math.sin(u * 95);
      const sy = shake * 4 * Math.cos(u * 120);
      const ox = W / 2 - camX + sx;
      set("world", "transform", `translate(${f1(ox)} ${f1(sy)})`);
      set("far", "transform", `translate(${f1((W / 2 - camX) * 0.12)} 0)`);
      set("mid", "transform", `translate(${f1((W / 2 - camX) * 0.4)} 0)`);
      set("fg", "transform", `translate(${f1((W / 2 - camX) * 1.3 + sx)} ${f1(sy)})`);
      set("clouds", "transform", `translate(${f1(-s * 9 + (W / 2 - camX) * 0.05)} 0)`);

      /* the archer */
      const A = archerPose(s);
      const fl = A.flex;
      const gx = BOW_X;
      const gy = -118;
      const t1 = [gx - 7 - fl, gy - 47];
      const t2 = [gx - 7 - fl, gy + 47];
      set(
        "bow",
        "d",
        `M${f1(t1[0])},${f1(t1[1])} C${f1(gx + 10)},${gy - 38} ${f1(gx + 6)},${gy - 10} ${gx},${gy} C${f1(gx + 6)},${gy + 10} ${f1(gx + 10)},${gy + 38} ${f1(t2[0])},${f1(t2[1])}`
      );
      set("string", "d", `M${f1(t1[0])},${f1(t1[1])} L${f1(A.nockX)},${gy} L${f1(t2[0])},${f1(t2[1])}`);
      set("drawarm", "d", capsule(A.sh2, A.elbow, 6, 5) + capsule(A.elbow, A.hand, 5, 4.2));
      set("drawhand", "cx", f1(A.hand[0]));
      set("drawhand", "cy", f1(A.hand[1]));
      // the cloak streams back and snaps in the wind
      const w1 = Math.sin(s * 7.3) * 5;
      const w2 = Math.sin(s * 5.1 + 1) * 7;
      set(
        "cloak",
        "d",
        `M6,-124 C-14,-126 -34,-110 ${f1(-52 + w1)},${f1(-86 + w2 * 0.4)} C${f1(-64 + w2)},${f1(-60 + w1)} ${f1(-60 + w1)},${f1(-34 + w2 * 0.5)} ${f1(-70 + w2)},${f1(-12 + w1 * 0.4)} C${f1(-48 + w1)},${f1(-20 + w2 * 0.3)} -28,-30 -10,-40 C-6,-70 -4,-100 6,-124 Z`
      );
      set(
        "crest",
        "d",
        `M13,-147 C8,-160 -10,-162 ${f1(-24 + w1 * 0.3)},${f1(-150 + w2 * 0.2)} C${f1(-28 + w1 * 0.3)},-144 -26,-136 -20,-132 C-14,-148 0,-150 13,-147 Z`
      );

      /* the arrow: nocked, then flying, then in his chest */
      const P = runnerPose(s, u);
      let fallAngle = 0;
      let rx = RUN_X0 - RUN_V * s;
      if (u > 0) {
        rx = HIT_X - 16 * (1 - Math.exp(-u * 6));
        const fa = smooth((u - 0.08) / 0.62);
        fallAngle = 84 * fa * fa;
        // a small rebound when he lands
        if (u > 0.7) fallAngle = 84 - 5 * Math.sin(clamp((u - 0.7) / 0.22, 0, 1) * Math.PI) * Math.exp(-(u - 0.7) * 3);
      }
      const toWorld = (p) => {
        const c = Math.cos(rad(fallAngle));
        const sn = Math.sin(rad(fallAngle));
        return [rx + p[0] * c - p[1] * sn, G + p[0] * sn + p[1] * c];
      };
      set("runner", "transform", `translate(${f1(rx)} ${G}) rotate(${f1(fallAngle)})`);

      let ax;
      let ay;
      let aang = 0;
      if (s < LOOSE) {
        // on the string, in the archer's own coordinates
        set("arrow", "transform", `translate(${f1(A.nockX)} -118)`);
        set("arrowfly", "opacity", 0);
        set("arrow", "opacity", s > DRAW_START - 0.1 ? 1 : 0);
        set("trail", "opacity", 0);
      } else if (u < 0) {
        // archer-local nock -> world: the archer stands at x=0
        ax = tip - ARROW_LEN;
        ay = lerp(G - 118, ARROW_Y, smooth((s - LOOSE) / (S_HIT - LOOSE)));
        set("arrow", "opacity", 0);
        set("arrowfly", "opacity", 1);
        set("arrowfly", "transform", `translate(${f1(ax)} ${f1(ay)})`);
        set("trail", "opacity", clamp(0.9 * (1 - (s - LOOSE) / (S_HIT - LOOSE)) + 0.35, 0, 1));
        set("trail", "transform", `translate(${f1(ax)} ${f1(ay)})`);
      } else {
        const c = toWorld(P.chest);
        aang = fallAngle;
        set("arrow", "opacity", 0);
        set("arrowfly", "opacity", 1);
        // tip sunk a few units into him, the shaft riding his fall
        const back = [Math.cos(rad(aang)) * (ARROW_LEN - 7), Math.sin(rad(aang)) * (ARROW_LEN - 7)];
        set("arrowfly", "transform", `translate(${f1(c[0] - back[0])} ${f1(c[1] - back[1])}) rotate(${f1(aang)})`);
        set("trail", "opacity", 0);
      }

      /* the runner */
      set("r-legb", "d", P.lb.d);
      set("r-lega", "d", P.la.d);
      set("r-torso", "d", capsule(P.hip, P.sh, 12, 15.5));
      set("r-skirt", "d", (() => {
        const h = P.hip;
        const sw = Math.sin(P.phi * 2) * 2;
        return `M${f1(h[0] - 13)},${f1(h[1] - 6)} L${f1(h[0] + 13)},${f1(h[1] - 6)} L${f1(h[0] + 17 + sw)},${f1(h[1] + 18)} L${f1(h[0] + 8)},${f1(h[1] + 15)} L${f1(h[0] + 2)},${f1(h[1] + 20)} L${f1(h[0] - 5)},${f1(h[1] + 15)} L${f1(h[0] - 14 + sw)},${f1(h[1] + 19)} Z`;
      })());
      set("r-sarm", "d", capsule(P.sh, P.se, 6.4, 5.2) + capsule(P.se, P.sHand, 5, 4.2));
      set("r-farm", "d", capsule(P.sh, P.fe, 6.4, 5.2) + capsule(P.fe, P.fHand, 5, 4.4));
      set("r-head", "cx", f1(P.head[0]));
      set("r-head", "cy", f1(P.head[1]));
      set("r-helm", "transform", `translate(${f1(P.head[0])} ${f1(P.head[1])}) rotate(${f1(-P.lean * 0.6)})`);
      set("r-neck", "d", capsule(P.sh, P.head, 6, 5.4));
      {
        const sh = P.sh;
        // in the sprint the cape streams out behind; once he is down it
        // collapses onto him instead of sticking out into the dirt
        const down = u > 0 ? smooth((u - 0.05) / 0.5) : 0;
        const k = 1 - 0.78 * down;
        const wv = Math.sin(s * 9) * 4 * k;
        const wv2 = Math.sin(s * 6.3 + 2) * 6 * k;
        const cx = (n) => sh[0] + n * k;
        const cy = (n) => sh[1] + n * k;
        set(
          "r-cape",
          "d",
          `M${f1(sh[0] - 2)},${f1(sh[1] - 2)} C${f1(cx(22))},${f1(cy(-8) + wv)} ${f1(cx(40))},${f1(cy(-2) + wv2)} ${f1(cx(56) + wv2)},${f1(cy(6) + wv)} C${f1(cx(48) + wv)},${f1(cy(22))} ${f1(cx(52))},${f1(cy(34) + wv2 * 0.5)} ${f1(cx(40) + wv2)},${f1(cy(46))} C${f1(cx(26))},${f1(cy(36))} ${f1(P.hip[0] + 14)},${f1(P.hip[1] - 4)} ${f1(P.hip[0] + 6)},${f1(P.hip[1] - 10)} Z`
        );
      }

      /* the sword: in his hand, then thrown free and tumbling to the dirt */
      if (u < 0.02) {
        const hw = toWorld(P.sHand);
        set("sword", "transform", `translate(${f1(hw[0])} ${f1(hw[1])}) rotate(${f1(P.swordAngle - 90 + fallAngle)})`);
      } else {
        const handAtHit = (() => {
          const P0 = runnerPose(S_HIT, 0.02);
          return [HIT_X + P0.sHand[0], G + P0.sHand[1]];
        })();
        const v = u - 0.02;
        const vy0 = -190;
        const gg = 820;
        let y = handAtHit[1] + vy0 * v + 0.5 * gg * v * v;
        let x = handAtHit[0] + 95 * v;
        let ang = 120 + 900 * v;
        const tLand = (-vy0 + Math.sqrt(vy0 * vy0 + 2 * gg * (G - 2.5 - handAtHit[1]))) / gg;
        if (v >= tLand) {
          x = handAtHit[0] + 95 * tLand;
          y = G - 2.5;
          ang = 94;
        }
        set("sword", "transform", `translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})`);
      }

      /* impact: a white-gold burst at the chest, a ring, a frame flash */
      if (u > 0 && u < 0.5) {
        const c = toWorld(P.chest);
        set("burst", "transform", `translate(${f1(c[0])} ${f1(c[1])})`);
        set("burst", "opacity", f1(Math.max(0, 1 - u / 0.22)));
        set("ring", "r", f1(6 + u * 260));
        set("ring", "opacity", f1(Math.max(0, 0.8 - u * 2)));
        set("ring", "cx", f1(c[0]));
        set("ring", "cy", f1(c[1]));
      } else {
        set("burst", "opacity", 0);
        set("ring", "opacity", 0);
      }
      if (r.flash) r.flash.style.opacity = u > 0 && u < 0.25 ? f1(0.55 * (1 - u / 0.25)) : 0;

      /* dust where he lands */
      const land = u - 0.72;
      DUST.forEach(([dx, dy, rr], i) => {
        const el = r[`dust${i}`];
        if (!el) return;
        if (land <= 0) {
          el.setAttribute("opacity", 0);
          return;
        }
        const k = 1 - Math.exp(-land * 3.2);
        el.setAttribute("cx", f1(HIT_X + 70 + dx * 80 * k));
        el.setAttribute("cy", f1(G - 4 - dy * 30 * k));
        el.setAttribute("r", f1(rr * (0.6 + k * 1.6)));
        el.setAttribute("opacity", f1(Math.max(0, 0.55 * (1 - land / 1.6))));
      });

      /* embers drifting up through the frame — they crawl in the slow-mo */
      EMBERS.forEach(([x0, y0, rr, ph], i) => {
        const el = r[`em${i}`];
        if (!el) return;
        const y = (((y0 - s * (34 + ph * 30)) % H) + H) % H;
        const x = (((x0 + s * 14 + Math.sin(s * 2 + ph * 6) * 8) % W) + W) % W;
        el.setAttribute("cx", f1(x));
        el.setAttribute("cy", f1(y));
        el.setAttribute("r", f1(rr));
      });

      /* the slow-mo grade: darker edges, a heavier bronze */
      if (r.grade) r.grade.style.opacity = f1(0.15 + 0.6 * slow);
      if (r.fade) r.fade.style.opacity = f1(1 - smooth(T / 0.45));
    }

    if (renderMode) {
      window.__renderAt = render;
      window.__spartanEnd = END_MS;
      render(0);
      window.__ready = true;
      return undefined;
    }
    if (still) {
      render(END_MS);
      return undefined;
    }
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const ms = Math.min(now - t0, END_MS);
      render(ms);
      if (ms < END_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [renderMode, still]);

  const SIL = "#140c07";
  const RIM = "#ffc277";

  return (
    <div className={`sp${still ? " is-static" : ""}`}>
      <svg className="sp-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1f130b" />
            <stop offset="0.35" stopColor="#5c3a1e" />
            <stop offset="0.62" stopColor="#c98a48" />
            <stop offset="0.73" stopColor="#f2c27a" />
            <stop offset="0.8" stopColor="#b9773c" />
            <stop offset="1" stopColor="#2a190d" />
          </linearGradient>
          <radialGradient id="sp-sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff4d6" />
            <stop offset="0.25" stopColor="#ffd690" stopOpacity="0.95" />
            <stop offset="0.6" stopColor="#f0a24e" stopOpacity="0.35" />
            <stop offset="1" stopColor="#f0a24e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sp-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a2412" />
            <stop offset="0.25" stopColor="#24160b" />
            <stop offset="1" stopColor="#0c0704" />
          </linearGradient>
          <linearGradient id="sp-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f2c27a" stopOpacity="0" />
            <stop offset="0.6" stopColor="#e7a85e" stopOpacity="0.45" />
            <stop offset="1" stopColor="#e7a85e" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sp-cloak" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d4182a" />
            <stop offset="0.5" stopColor="#a80f1f" />
            <stop offset="1" stopColor="#5a0610" />
          </linearGradient>
          <linearGradient id="sp-trail" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#fff1cf" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff1cf" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="sp-burst">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.3" stopColor="#ffe6a8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
          </radialGradient>
          <filter id="sp-blur8" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="sp-blur3" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="sp-rim" x="-20%" y="-20%" width="140%" height="140%">
            {/* a warm rim of sunlight round every silhouette edge */}
            <feMorphology in="SourceAlpha" operator="erode" radius="0.9" result="in" />
            <feComposite in="SourceAlpha" in2="in" operator="out" result="edge" />
            <feOffset in="edge" dx="-0.6" dy="-0.6" result="edgeo" />
            <feFlood floodColor={RIM} floodOpacity="0.75" />
            <feComposite in2="edgeo" operator="in" result="rim" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="rim" />
            </feMerge>
          </filter>
        </defs>

        {/* ---- sky: storm over a low sun, in screen space ---- */}
        <rect width={W} height={H} fill="url(#sp-sky)" />
        <circle cx="236" cy="372" r="120" fill="url(#sp-sun)" />
        <g ref={ref("clouds")} filter="url(#sp-blur8)">
          {Array.from({ length: 14 }, (_, i) => (
            <ellipse
              key={i}
              cx={-120 + i * 52 + seeded(i, 11) * 30}
              cy={60 + seeded(i, 12) * 220}
              rx={70 + seeded(i, 13) * 60}
              ry={18 + seeded(i, 14) * 22}
              fill={i % 3 ? "#1b100a" : "#3b2614"}
              opacity={0.55 + seeded(i, 15) * 0.35}
            />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse key={`l${i}`} cx={-60 + i * 90} cy={300 + seeded(i, 21) * 40} rx="80" ry="10" fill="#f7cf8c" opacity="0.18" />
          ))}
        </g>

        {/* ---- far range and mid hills, parallax ---- */}
        <g ref={ref("far")}>
          <path d={ridge(-200, 700, 438, 70, 22, 3)} fill="#8a5a30" opacity="0.75" />
        </g>
        <g ref={ref("mid")}>
          <path d={ridge(-260, 900, 458, 46, 18, 7)} fill="#5a3a1e" />
        </g>
        <rect x="0" y={G - 70} width={W} height="90" fill="url(#sp-haze)" />

        {/* ---- the world: ground, figures, arrow ---- */}
        <g ref={ref("world")}>
          <rect x="-400" y={G - 2} width="1600" height={H - G + 60} fill="url(#sp-ground)" />
          <path d={`M-400,${G} L1200,${G}`} stroke="#c9884a" strokeWidth="1" opacity="0.5" />
          {STONES.map(([x, r], i) => (
            <ellipse key={i} cx={x} cy={G + 1} rx={r * 1.6} ry={r * 0.6} fill={SIL} />
          ))}
          {/* grass tufts along the line */}
          {Array.from({ length: 40 }, (_, i) => {
            const x = -300 + i * 31 + seeded(i, 31) * 18;
            return (
              <path
                key={`g${i}`}
                d={`M${x},${G} l-3,-${6 + seeded(i, 32) * 6} M${x + 2},${G} l1,-${8 + seeded(i, 33) * 7} M${x + 4},${G} l4,-${5 + seeded(i, 34) * 5}`}
                stroke={SIL}
                strokeWidth="1.2"
              />
            );
          })}

          {/* the archer, facing right, feet at x=0 */}
          <g transform={`translate(0 ${G})`} filter="url(#sp-rim)">
            <path ref={ref("cloak")} fill="url(#sp-cloak)" />
            {/* legs: front set forward, back braced */}
            <path d={capsule([0, -70], [14, -36], 9, 6.6) + capsule([14, -36], [22, -5], 6.4, 4.4) + capsule([22, -4], [36, -1], 4.2, 2.8)} fill={SIL} />
            <path d={capsule([-2, -70], [-14, -36], 9, 6.6) + capsule([-14, -36], [-28, -5], 6.4, 4.4) + capsule([-28, -4], [-16, -1], 4.2, 2.8)} fill={SIL} />
            {/* greaves: a glint of bronze down each shin */}
            <path d="M15.4,-33 L21,-8 M-15.4,-33 L-26,-8" stroke="#c98a48" strokeWidth="1.2" opacity="0.6" />
            {/* pteruges: leather strips off the belt */}
            <path d="M-13,-76 L13,-76 L16,-56 L10,-58 L6,-52 L1,-57 L-4,-52 L-8,-58 L-14,-55 Z" fill={SIL} />
            {/* torso, the bow arm locked out */}
            <path d={capsule([0, -70], [4, -118], 13, 15.5)} fill={SIL} />
            <path d={capsule([6, -120], [30, -119], 6.4, 5.2) + capsule([30, -119], [BOW_X - 1, -118], 5, 4.4)} fill={SIL} />
            <circle cx={BOW_X} cy="-118" r="4.6" fill={SIL} />
            {/* the bow and its string */}
            <path ref={ref("bow")} fill="none" stroke={SIL} strokeWidth="3.4" strokeLinecap="round" />
            <path ref={ref("string")} fill="none" stroke="#e9cf9e" strokeWidth="0.7" opacity="0.9" />
            {/* the drawing arm */}
            <path ref={ref("drawarm")} fill={SIL} />
            <circle ref={ref("drawhand")} r="4.2" fill={SIL} />
            {/* neck, head, Corinthian helmet and crest */}
            <path d={capsule([4, -118], [6, -134], 6, 5.6)} fill={SIL} />
            <path d="M-4,-150 C-4,-158 4,-162 10,-160 C16,-158 19,-150 18,-142 L17,-128 C16,-124 12,-122 9,-124 L8,-134 L5,-134 L4,-124 C-1,-122 -6,-126 -6,-132 Z" fill={SIL} />
            <path d="M9,-144 L17,-144 M12,-144 L12,-131" stroke="#e0a560" strokeWidth="0.9" opacity="0.75" />
            <path ref={ref("crest")} fill="#8e0d1a" />
            {/* the arrow on the string */}
            <g ref={ref("arrow")}>
              <path d={`M0,0 L${ARROW_LEN - 6},0`} stroke="#d9b98a" strokeWidth="1.3" />
              <path d={`M${ARROW_LEN - 7},-2.6 L${ARROW_LEN},0 L${ARROW_LEN - 7},2.6 Z`} fill="#e9dcc4" />
              <path d="M1,0 L9,-3.6 L12,0 L9,3.6 Z" fill="#b01226" />
            </g>
          </g>

          {/* the runner (charging left); his transform is set per frame */}
          <g ref={ref("runner")} filter="url(#sp-rim)">
            <path ref={ref("r-cape")} fill="#2a1a10" />
            <path ref={ref("r-legb")} fill={SIL} />
            <path ref={ref("r-sarm")} fill={SIL} />
            <path ref={ref("r-torso")} fill={SIL} />
            <path ref={ref("r-skirt")} fill={SIL} />
            <path ref={ref("r-lega")} fill={SIL} />
            <path ref={ref("r-neck")} fill={SIL} />
            <circle ref={ref("r-head")} r="9" fill={SIL} />
            {/* a domed helmet with a neck guard, a short horsehair tail */}
            <g ref={ref("r-helm")}>
              <path d="M-11,-1 C-11,-9 -5,-13 1,-13 C7,-13 11,-8 11,-1 L15,6 L8,5 L6,1 L-10,1 Z" fill={SIL} />
              <path d="M2,-13 C10,-17 18,-12 22,-4 C16,-8 10,-10 4,-10 Z" fill="#2a1a10" />
              <path d="M-10,-2 L-3,-2" stroke="#e0a560" strokeWidth="0.8" opacity="0.7" />
            </g>
            <path ref={ref("r-farm")} fill={SIL} />
          </g>

          {/* his sword, in world space so it can fly free */}
          <g ref={ref("sword")} filter="url(#sp-rim)">
            <path d="M-2,-4 L2,-4 L2,6 L-2,6 Z" fill={SIL} />
            <path d="M-6,-5 L6,-5 L6,-3 L-6,-3 Z" fill={SIL} />
            <path d="M-1.6,-5 L-1.2,-46 L0,-52 L1.2,-46 L1.6,-5 Z" fill="#2c2620" />
            <path d="M0,-6 L0,-48" stroke="#ffd9a0" strokeWidth="0.5" opacity="0.6" />
          </g>

          {/* the arrow in flight, and its streak */}
          <g ref={ref("trail")} opacity="0">
            <rect x="-150" y="-1.4" width="150" height="2.8" fill="url(#sp-trail)" filter="url(#sp-blur3)" />
          </g>
          <g ref={ref("arrowfly")} opacity="0">
            <path d={`M0,0 L${ARROW_LEN - 6},0`} stroke="#d9b98a" strokeWidth="1.4" />
            <path d={`M0,-0.7 L${ARROW_LEN - 6},-0.7`} stroke="#fff0d0" strokeWidth="0.4" opacity="0.8" />
            <path d={`M${ARROW_LEN - 7},-2.8 L${ARROW_LEN},0 L${ARROW_LEN - 7},2.8 Z`} fill="#efe4cf" />
            <path d="M1,0 L10,-4 L13,0 L10,4 Z" fill="#b01226" />
          </g>

          {/* impact */}
          <g ref={ref("burst")} opacity="0">
            <circle r="26" fill="url(#sp-burst)" />
            {Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return <path key={i} d={`M${f1(Math.cos(a) * 6)},${f1(Math.sin(a) * 6)} L${f1(Math.cos(a) * 30)},${f1(Math.sin(a) * 30)}`} stroke="#fff3d6" strokeWidth="1.2" opacity="0.8" />;
            })}
          </g>
          <circle ref={ref("ring")} r="6" fill="none" stroke="#fff0cf" strokeWidth="2" opacity="0" />
          <g filter="url(#sp-blur3)">
            {DUST.map((_, i) => (
              <circle key={i} ref={ref(`dust${i}`)} r="6" fill="#c99a62" opacity="0" />
            ))}
          </g>
        </g>

        {/* ---- foreground rocks, fast parallax ---- */}
        <g ref={ref("fg")}>
          {ROCKS_FG.map(([x, r], i) => (
            <path
              key={i}
              d={`M${x - r * 1.2},${H + 10} L${x - r},${H - r * 0.55} L${x - r * 0.62},${H - r * 0.9} L${x - r * 0.4},${H - r * 1.35} L${x - r * 0.05},${H - r * 1.18} L${x + r * 0.3},${H - r * 1.42} L${x + r * 0.72},${H - r * 0.95} L${x + r * 0.95},${H - r * 0.7} L${x + r * 1.25},${H + 10} Z`}
              fill="#070403"
            />
          ))}
        </g>

        {/* ---- embers, screen space ---- */}
        <g>
          {EMBERS.map((_, i) => (
            <circle key={i} ref={ref(`em${i}`)} r="1" fill={i % 4 ? "#ffcf8a" : "#ff8a3a"} opacity={0.5 + seeded(i, 40) * 0.5} />
          ))}
        </g>
      </svg>

      <div className="sp-grade" ref={ref("grade")} />
      <div className="sp-vignette" />
      <div className="sp-flash" ref={ref("flash")} />
      <div className="sp-grain" />
      <div className="sp-fade" ref={ref("fade")} />
    </div>
  );
}
