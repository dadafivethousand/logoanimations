// Hitman.js — the fourth take on Mafia's hook: a professional. A fluorescent
// panel strikes on over a hotel corridor and he is already standing there,
// dead centre on the carpet, the corridor running away behind him to a
// vanishing point at his chest: black suit, white shirt, thin black tie, black
// leather gloves, a coiled earpiece wire, short neat hair, nothing in his face.
// The rest of the ceiling panels tick on down the hall. He raises a pistol
// with a long suppressor and puts three rounds into the camera — quietly: a
// small flash, a puff, a little kick, the casing, and the light overhead
// stutters with each one. No frame flash, no shake. A Maple Jiu Jitsu leaf as
// a lapel pin; no text.
//
// Built off Thug: same cue machine and the same 200x400 figure viewBox and
// feet line. The corridor is drawn in true one-point perspective from a
// handful of world measurements (P() below), so every door, stripe and carpet
// line converges on the same point.
import React, { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import "../Stylesheets/Hitman.css";
import usePhases from "../Utils/usePhases";
import mapleLogo from "../Images/maple-logo.png";

// p1 the panel over him strikes on; the hall and he flicker up with it, and
//    the panels down the corridor tick on one after another
// p2 he raises the pistol; the camera starts a slow push in
// p3-p5 three quiet rounds
//
// Plays ONCE and holds — loopAt is null. The smoke off the suppressor keeps
// curling on the held frame; that is ambient, not a restart.
const CUES = [40, 1200, 1650, 2050, 2450];
// how long the frame-stepped export runs: the last round, then a held beat
const END_MS = 6400;

export default function Hitman({ mode = "animated", loopAt = null }) {
  const query = new URLSearchParams(window.location.search);
  // ?static on the URL gives the still without editing App.js
  const still = mode === "static" || query.has("static");
  // ?render=1: no clock at all — tools/record-frames.js asks for each frame
  const render = query.has("render");
  const live = usePhases(CUES, { mode: still ? "static" : mode, loopAt, enabled: !render });
  const [rphase, setRphase] = useState(0);
  useFrameStepping(render, setRphase);
  const phase = render ? rphase : live.phase;
  const { run, isStatic } = live;

  return (
    <div className={`hm hm-p${phase} ${isStatic ? "is-static" : ""}`} key={run}>
      <div className="hm-world">
        <div className="hm-hallbox" aria-hidden>
          <div className="hm-hall">
            <Corridor />
          </div>
          {PANELS.map(([n, fz], i) => (
            <div key={i} className={`hm-lamp hm-lamp-${i}`} style={{ "--d": `${i === 0 ? 0 : 260 + i * 170}ms` }}>
              <svg className="hm-hall-svg" viewBox="0 0 390 844">
                <Panel i={i} near={n} far={fz} />
              </svg>
            </div>
          ))}
        </div>

        <div className="hm-card">
          <div className="hm-figbox">
            <div className="hm-walker">
              <div className="hm-shadow" aria-hidden />
              <div className="hm-gait">
                <Professional />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hm-cut" aria-hidden />
      <div className="hm-vignette" aria-hidden />
      <div className="hm-grain" aria-hidden />
    </div>
  );
}

/* Frame stepping for tools/record-frames.js. The piece is CSS animation, so
   a frame at time t is: the phase the cues give for t, then every running
   CSS animation and transition paused at its own age. An animation's age is
   counted from the cue that created it (the phase change), or from mount.
   This makes the export independent of how fast the machine can paint. */
function useFrameStepping(render, setPhase) {
  useEffect(() => {
    if (!render) return undefined;
    const born = new WeakMap();
    let last = 0;
    window.__hitmanEnd = END_MS;
    window.__renderAt = (ms) => {
      let ph = 0;
      CUES.forEach((c, i) => {
        if (ms >= c) ph = i + 1;
      });
      let since = null;
      if (ph !== last) {
        since = CUES[ph - 1];
        flushSync(() => setPhase(ph));
        last = ph;
      }
      for (const a of document.getAnimations()) {
        if (!born.has(a)) born.set(a, since ?? ms);
        a.pause();
        a.currentTime = Math.max(0, ms - born.get(a));
      }
    };
    const imgs = Array.from(document.images);
    Promise.all([
      document.fonts.ready,
      ...imgs.map((im) => (im.decode ? im.decode().catch(() => {}) : Promise.resolve())),
    ]).then(() => {
      for (const a of document.getAnimations()) born.set(a, 0);
      window.__ready = true;
    });
    return undefined;
  }, [render, setPhase]);
}

/* ======================================================================
   The corridor — one-point perspective.

   The SVG is a 390x844 portrait sheet sized to the frame's HEIGHT, so its
   y axis lines up with the figure (which is sized in vh) on any phone; the
   geometry runs far past the left and right edges for wider screens.

   World: X across (0 = centre line), Y down (0 = eye level), z = depth.
   A world point projects to (VX + X/z, VY + Y/z). The numbers are chosen so
   the floor at his depth (z = 1.97) lands on his feet line (73% down), and
   the ceiling sits at a believable 2.6 m over a 1.8 m man.
   ====================================================================== */

const VX = 195;
const VY = 360;
const HW = 340; //  half the corridor's width
const YC = -587; // ceiling
const YF = 504; //  floor
const ZN = 0.42; // nearest depth drawn (well off-frame)
const ZE = 9; //    the end wall
const RAIL = 126; // chair rail
const DOOR_TOP = -356;

const f = (n) => Math.round(n * 10) / 10;
const P = (X, Y, z) => [f(VX + X / z), f(VY + Y / z)];
const poly = (...pts) => "M" + pts.map((p) => p.join(",")).join(" L") + " Z";
const line = (a, b) => `M${a.join(",")} L${b.join(",")}`;
// a quad on a side wall (s = -1 left, 1 right) between two depths and heights
const wallQuad = (s, y0, y1, z0, z1, x = HW) =>
  poly(P(s * x, y0, z0), P(s * x, y0, z1), P(s * x, y1, z1), P(s * x, y1, z0));

const DOORS = {
  "-1": [
    [2.25, 2.68],
    [3.75, 4.18],
    [5.3, 5.73],
    [6.85, 7.28],
  ],
  1: [
    [2.95, 3.38],
    [4.5, 4.93],
    [6.05, 6.48],
    [7.6, 8.03],
  ],
};
const SCONCES = { "-1": [3.2, 4.75, 6.3, 7.9], 1: [2.4, 3.95, 5.5, 7.05] };
// ceiling panels: [near z, far z]; the first one is over his head
// long narrow troffers: narrow enough that the far ones hide behind his head
// instead of sticking out either side of it like a bar
const PANELS = [
  [1.7, 2.12],
  [3.0, 3.36],
  [4.35, 4.66],
  [5.75, 6.0],
  [7.2, 7.4],
];
// one warm sliver of light under a door — somebody is home
const LIT_DOORS = [
  ["-1", 1],
  ["1", 2],
];

// wallpaper pinstripes: vertical lines whose spacing compresses with depth
const stripes = (s) => {
  let d = "";
  for (let z = ZN + 0.1; z < ZE; z *= 1.032) {
    const [x, y0] = P(s * HW, YC, z);
    const [, y1] = P(s * HW, RAIL, z);
    d += `M${x},${y0} V${y1}`;
  }
  return d;
};

// the carpet: a diamond lattice laid on the floor plane. A floor line
// X = c + k*z projects to a straight line, so each one is just two points.
const carpet = () => {
  let d = "";
  for (let c = -2400; c <= 2400; c += 52) {
    for (const k of [34, -34]) {
      d += line(P(c + k * ZN, YF, ZN), P(c + k * ZE, YF, ZE));
    }
  }
  return d;
};
// transverse bands across the runner, spaced evenly in depth
const bands = () => {
  let d = "";
  for (let z = 0.6; z < ZE; z += 0.32) d += line(P(-292, YF, z), P(292, YF, z));
  return d;
};

function Door({ s, a, b, lit }) {
  const R = HW + 18; // the leaf is set back into the wall
  const mid = (a + b) / 2;
  const hz = s < 0 ? b - 0.07 : a + 0.07; // the lever, on the far stile
  const [hx, hy] = P(s * R, 80, hz);
  const [lx2] = P(s * R, 80, hz + (s < 0 ? -0.09 : 0.09));
  const [px, py] = P(s * R, -232, mid);
  const ph = f(34 / mid);
  const pw = f(Math.abs(P(s * R, 0, mid + 0.045)[0] - P(s * R, 0, mid - 0.045)[0]));
  return (
    <g>
      {/* casing */}
      <path d={wallQuad(s, DOOR_TOP - 26, YF, a - 0.045, b + 0.045)} fill="url(#hm-casing)" />
      {/* the far jamb and the head jamb: the depth of the recess */}
      <path d={poly(P(s * HW, DOOR_TOP, b), P(s * R, DOOR_TOP, b), P(s * R, YF, b), P(s * HW, YF, b))} fill="#140c08" />
      <path d={poly(P(s * HW, DOOR_TOP, a), P(s * HW, DOOR_TOP, b), P(s * R, DOOR_TOP, b), P(s * R, DOOR_TOP, a))} fill="#3b2a20" />
      {/* the leaf and its two raised panels */}
      <path d={wallQuad(s, DOOR_TOP, YF, a, b, R)} fill={`url(#hm-door-${s < 0 ? "l" : "r"})`} />
      <path d={wallQuad(s, DOOR_TOP + 40, -40, a + 0.07, b - 0.07, R)} fill="none" stroke="#000" strokeOpacity="0.45" strokeWidth="0.9" />
      <path d={wallQuad(s, 10, YF - 46, a + 0.07, b - 0.07, R)} fill="none" stroke="#000" strokeOpacity="0.45" strokeWidth="0.9" />
      <path d={wallQuad(s, DOOR_TOP + 42, -42, a + 0.075, b - 0.075, R)} fill="none" stroke="#d9c7a6" strokeOpacity="0.08" strokeWidth="0.6" />
      {/* brass number plate (blank), peephole, lever */}
      <rect x={f(px - pw / 2)} y={f(py - ph / 2)} width={pw} height={ph} rx="0.6" fill="url(#hm-brass)" />
      <circle cx={P(s * R, -150, mid)[0]} cy={P(s * R, -150, mid)[1]} r={f(5 / mid)} fill="#0a0605" />
      <circle cx={hx} cy={hy} r={f(9 / hz)} fill="url(#hm-brass)" />
      <path d={`M${hx},${hy} L${lx2},${f(hy + 1 / hz)}`} stroke="url(#hm-brass)" strokeWidth={f(7 / hz)} strokeLinecap="round" />
      {lit && (
        <path d={line(P(s * R, YF - 3, a + 0.03), P(s * R, YF - 3, b - 0.03))} stroke="#ffd59a" strokeWidth={f(10 / mid)} opacity="0.75" filter="url(#hm-blur2)" />
      )}
    </g>
  );
}

function Sconce({ s, z }) {
  const [x, y] = P(s * HW, -170, z);
  const w = 26 / z;
  const glowR = 150 / z;
  return (
    <g>
      <ellipse cx={x} cy={y + 30 / z} rx={f(glowR * (3.2 / z) * 0.55 + glowR * 0.25)} ry={f(glowR * 1.3)} fill="url(#hm-sconceglow)" />
      <path
        d={`M${f(x - w / 2)},${f(y - 18 / z)} L${f(x + w / 2)},${f(y - 18 / z)} L${f(x + w * 0.7)},${f(y + 20 / z)} L${f(x - w * 0.7)},${f(y + 20 / z)} Z`}
        fill="#f6e9cf"
        opacity="0.92"
      />
      <path d={`M${f(x)},${f(y + 20 / z)} V${f(y + 34 / z)}`} stroke="#8a7a5c" strokeWidth={f(3 / z)} />
    </g>
  );
}

function Panel({ i, near, far }) {
  const pw = 78;
  const a = P(-pw, YC, near);
  const b = P(pw, YC, near);
  const c = P(pw, YC, far);
  const d = P(-pw, YC, far);
  const zc = (near + far) / 2;
  const [fx, fy] = P(0, YF, zc + 0.25);
  const poolRy = f((YF / (zc - 0.7) - YF / (zc + 1.1)) / 2);
  const dim = Math.max(0.35, 1 - i * 0.14);
  return (
    <g>
      {/* light on the floor and down both walls */}
      <ellipse cx={fx} cy={fy} rx={f(380 / zc)} ry={f(poolRy * 1.2)} fill="url(#hm-pool)" opacity={dim} />
      {[-1, 1].map((s) => {
        const [wx, wy] = P(s * HW, -120, zc);
        return (
          <ellipse
            key={s}
            cx={wx}
            cy={wy}
            rx={f(170 / zc)}
            ry={f(520 / zc)}
            fill="url(#hm-wallwash)"
            opacity={dim * 0.9}
          />
        );
      })}
      {/* the fitting: housing, then the diffuser */}
      <path d={poly(P(-pw - 14, YC, near - 0.03), P(pw + 14, YC, near - 0.03), P(pw + 14, YC, far + 0.03), P(-pw - 14, YC, far + 0.03))} fill="#5d6760" />
      <path d={poly(a, b, c, d)} fill="url(#hm-tube)" opacity={0.6 + dim * 0.4} />
      <path d={poly(a, b, c, d)} fill="#eafff4" filter="url(#hm-blur6)" opacity={dim * 0.85} />
    </g>
  );
}

function Corridor() {
  const near = ZN;
  return (
    <svg className="hm-hall-svg" viewBox="0 0 390 844" aria-hidden>
      <defs>
        <filter id="hm-blur2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <filter id="hm-blur6" x="-60%" y="-200%" width="220%" height="500%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <linearGradient id="hm-ceil" gradientUnits="userSpaceOnUse" x1="0" y1="-700" x2="0" y2="300">
          <stop offset="0" stopColor="#9aa69c" />
          <stop offset="0.55" stopColor="#56625b" />
          <stop offset="1" stopColor="#1b2623" />
        </linearGradient>
        {/* walls: pale sage under green-white tubes, falling to teal with depth */}
        <linearGradient id="hm-wall-l" gradientUnits="userSpaceOnUse" x1="-260" y1="0" x2="158" y2="0">
          <stop offset="0" stopColor="#a3b0a1" />
          <stop offset="0.5" stopColor="#7d8c7d" />
          <stop offset="0.85" stopColor="#3b4c46" />
          <stop offset="1" stopColor="#16231f" />
        </linearGradient>
        <linearGradient id="hm-wall-r" gradientUnits="userSpaceOnUse" x1="650" y1="0" x2="232" y2="0">
          <stop offset="0" stopColor="#a3b0a1" />
          <stop offset="0.5" stopColor="#7d8c7d" />
          <stop offset="0.85" stopColor="#3b4c46" />
          <stop offset="1" stopColor="#16231f" />
        </linearGradient>
        <linearGradient id="hm-wains-l" gradientUnits="userSpaceOnUse" x1="-260" y1="0" x2="158" y2="0">
          <stop offset="0" stopColor="#4b5a50" />
          <stop offset="0.6" stopColor="#2e3c36" />
          <stop offset="1" stopColor="#0f1916" />
        </linearGradient>
        <linearGradient id="hm-wains-r" gradientUnits="userSpaceOnUse" x1="650" y1="0" x2="232" y2="0">
          <stop offset="0" stopColor="#4b5a50" />
          <stop offset="0.6" stopColor="#2e3c36" />
          <stop offset="1" stopColor="#0f1916" />
        </linearGradient>
        <linearGradient id="hm-floor" gradientUnits="userSpaceOnUse" x1="0" y1="1100" x2="0" y2="416">
          <stop offset="0" stopColor="#6a1219" />
          <stop offset="0.45" stopColor="#4c0c12" />
          <stop offset="1" stopColor="#1c0507" />
        </linearGradient>
        <linearGradient id="hm-door-l" gradientUnits="userSpaceOnUse" x1="-200" y1="0" x2="158" y2="0">
          <stop offset="0" stopColor="#4a3022" />
          <stop offset="1" stopColor="#1a0f0a" />
        </linearGradient>
        <linearGradient id="hm-door-r" gradientUnits="userSpaceOnUse" x1="590" y1="0" x2="232" y2="0">
          <stop offset="0" stopColor="#4a3022" />
          <stop offset="1" stopColor="#1a0f0a" />
        </linearGradient>
        <linearGradient id="hm-casing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a4130" />
          <stop offset="1" stopColor="#2c1d14" />
        </linearGradient>
        <linearGradient id="hm-brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1d79a" />
          <stop offset="0.5" stopColor="#b48a44" />
          <stop offset="1" stopColor="#6e5226" />
        </linearGradient>
        <linearGradient id="hm-tube" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d5f5e6" />
        </linearGradient>
        <radialGradient id="hm-pool">
          <stop offset="0" stopColor="#d9fff0" stopOpacity="0.42" />
          <stop offset="0.55" stopColor="#b5f0db" stopOpacity="0.2" />
          <stop offset="1" stopColor="#b5f0db" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hm-wallwash">
          <stop offset="0" stopColor="#e6fff4" stopOpacity="0.3" />
          <stop offset="1" stopColor="#e6fff4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hm-sconceglow">
          <stop offset="0" stopColor="#ffe9c2" stopOpacity="0.38" />
          <stop offset="0.5" stopColor="#ffe9c2" stopOpacity="0.1" />
          <stop offset="1" stopColor="#ffe9c2" stopOpacity="0" />
        </radialGradient>
        {/* the far end of the hall falls off into teal dark */}
        <radialGradient id="hm-depth" gradientUnits="userSpaceOnUse" cx={VX} cy={VY} r="300">
          <stop offset="0" stopColor="#031012" stopOpacity="0.92" />
          <stop offset="0.3" stopColor="#041416" stopOpacity="0.55" />
          <stop offset="1" stopColor="#041416" stopOpacity="0" />
        </radialGradient>
        <clipPath id="hm-runner">
          <path d={poly(P(-300, YF, near), P(300, YF, near), P(300, YF, ZE), P(-300, YF, ZE))} />
        </clipPath>
      </defs>

      <g>
        {/* ceiling */}
        <path d={poly(P(-HW, YC, near), P(HW, YC, near), P(HW, YC, ZE), P(-HW, YC, ZE))} fill="url(#hm-ceil)" />
        {/* side walls, wallpaper above the rail, panelled wainscot below */}
        {[-1, 1].map((s) => {
          const k = s < 0 ? "l" : "r";
          return (
            <g key={s}>
              <path d={wallQuad(s, YC, YF, near, ZE)} fill={`url(#hm-wall-${k})`} />
              <path d={stripes(s)} stroke="#203029" strokeOpacity="0.22" strokeWidth="0.8" />
              <path d={wallQuad(s, RAIL, YF, near, ZE)} fill={`url(#hm-wains-${k})`} />
              <path d={wallQuad(s, YC, YC + 34, near, ZE)} fill="#c3ccbf" opacity="0.5" />
              <path d={line(P(s * HW, YC + 34, near), P(s * HW, YC + 34, ZE))} stroke="#000" strokeOpacity="0.35" strokeWidth="1.2" />
              <path d={line(P(s * HW, RAIL, near), P(s * HW, RAIL, ZE))} stroke="#c9d3c4" strokeOpacity="0.55" strokeWidth="2.4" />
              <path d={line(P(s * HW, RAIL + 10, near), P(s * HW, RAIL + 10, ZE))} stroke="#000" strokeOpacity="0.4" strokeWidth="1.4" />
              <path d={wallQuad(s, YF - 48, YF, near, ZE)} fill="#120d0b" />
              <path d={line(P(s * HW, YF - 48, near), P(s * HW, YF - 48, ZE))} stroke="#7d6a55" strokeOpacity="0.5" strokeWidth="1" />
              {DOORS[s].map(([a, b], i) => (
                <Door key={i} s={s} a={a} b={b} lit={LIT_DOORS.some(([ls, li]) => Number(ls) === s && li === i)} />
              ))}
              {SCONCES[s].map((z) => (
                <Sconce key={z} s={s} z={z} />
              ))}
            </g>
          );
        })}
        {/* end wall: a door, and a window of night beside it */}
        <path d={poly(P(-HW, YC, ZE), P(HW, YC, ZE), P(HW, YF, ZE), P(-HW, YF, ZE))} fill="#1a2725" />
        <path d={poly(P(-110, DOOR_TOP, ZE), P(110, DOOR_TOP, ZE), P(110, YF, ZE), P(-110, YF, ZE))} fill="#22160f" />

        {/* the floor: a dark red runner with a gold lattice, a darker border */}
        <path d={poly(P(-HW, YF, near), P(HW, YF, near), P(HW, YF, ZE), P(-HW, YF, ZE))} fill="url(#hm-floor)" />
        <g clipPath="url(#hm-runner)">
          <path d={carpet()} stroke="#d4a65a" strokeOpacity="0.11" strokeWidth="0.9" />
          <path d={bands()} stroke="#000" strokeOpacity="0.12" strokeWidth="1" />
        </g>
        {[-1, 1].map((s) => (
          <g key={s}>
            <path d={poly(P(s * 300, YF, near), P(s * HW, YF, near), P(s * HW, YF, ZE), P(s * 300, YF, ZE))} fill="#1d0508" opacity="0.75" />
            <path d={line(P(s * 300, YF, near), P(s * 300, YF, ZE))} stroke="#c9a05a" strokeOpacity="0.45" strokeWidth="1.4" />
            <path d={line(P(s * 314, YF, near), P(s * 314, YF, ZE))} stroke="#c9a05a" strokeOpacity="0.25" strokeWidth="0.8" />
          </g>
        ))}

        <rect x="-600" y="-400" width="1590" height="1700" fill="url(#hm-depth)" />
      </g>

    </svg>
  );
}

/* ======================================================================
   The man. Front-facing, viewBox 200x400, feet on the bottom edge. Every
   animated group carries no transform attribute — a CSS transform would
   replace it.
   ====================================================================== */

// the tube key, cold green-white from straight above
const LIT = "#e9fff4";
// the teal bounce off the walls
const FILL = "#7fd6c6";

function Professional() {
  return (
    <svg className="hm-man" viewBox="0 0 200 400" aria-hidden>
      <defs>
        <filter id="hm-wool" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="9" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.7  0 0 0 0 0.78  0 0 0 0 0.76  0 0 0 0.045 0" />
        </filter>
        <filter id="hm-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
        <filter id="hm-softer" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id="hm-pintone" x="-20%" y="-20%" width="140%" height="140%">
          <feColorMatrix type="matrix" values="0.9 0 0 0 0  0 0.94 0 0 0  0 0 0.92 0 0  0 0 0 1 0" />
          <feDropShadow dx="0" dy="0.4" stdDeviation="0.3" floodColor="#000" floodOpacity="0.9" />
        </filter>
        <linearGradient id="hm-suit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2d3233" />
          <stop offset="0.15" stopColor="#15191a" />
          <stop offset="0.6" stopColor="#0c0e0f" />
          <stop offset="1" stopColor="#060707" />
        </linearGradient>
        <linearGradient id="hm-sleeve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b3031" />
          <stop offset="0.28" stopColor="#131617" />
          <stop offset="1" stopColor="#08090a" />
        </linearGradient>
        <linearGradient id="hm-lapel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3031" />
          <stop offset="1" stopColor="#0d0f10" />
        </linearGradient>
        <linearGradient id="hm-trouser" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#060707" />
          <stop offset="0.5" stopColor="#151819" />
          <stop offset="1" stopColor="#060707" />
        </linearGradient>
        <linearGradient id="hm-form" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.6" />
          <stop offset="0.3" stopColor="#000" stopOpacity="0" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="hm-shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4fbf7" />
          <stop offset="0.6" stopColor="#d6e1dc" />
          <stop offset="1" stopColor="#a9b7b1" />
        </linearGradient>
        <linearGradient id="hm-tie" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#050606" />
          <stop offset="0.42" stopColor="#1f2425" />
          <stop offset="0.58" stopColor="#0a0b0c" />
          <stop offset="1" stopColor="#030303" />
        </linearGradient>
        <linearGradient id="hm-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6c7ae" />
          <stop offset="0.4" stopColor="#d3ad92" />
          <stop offset="0.78" stopColor="#b48b72" />
          <stop offset="1" stopColor="#8c6957" />
        </linearGradient>
        <linearGradient id="hm-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b3430" />
          <stop offset="0.35" stopColor="#1c1714" />
          <stop offset="1" stopColor="#0d0a09" />
        </linearGradient>
        <linearGradient id="hm-glove" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b3f42" />
          <stop offset="0.3" stopColor="#151718" />
          <stop offset="1" stopColor="#050606" />
        </linearGradient>
        <linearGradient id="hm-shoe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d4244" />
          <stop offset="0.3" stopColor="#121415" />
          <stop offset="1" stopColor="#030303" />
        </linearGradient>
        <linearGradient id="hm-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5e6466" />
          <stop offset="0.25" stopColor="#2a2e30" />
          <stop offset="1" stopColor="#0e1011" />
        </linearGradient>
        <linearGradient id="hm-steel-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#62686a" />
          <stop offset="0.35" stopColor="#2b2f31" />
          <stop offset="1" stopColor="#0d0e0f" />
        </linearGradient>
        <linearGradient id="hm-can" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#3c4245" />
          <stop offset="0.4" stopColor="#1a1d1f" />
          <stop offset="1" stopColor="#08090a" />
        </linearGradient>
        <radialGradient id="hm-canface" cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#40464a" />
          <stop offset="0.6" stopColor="#1b1e20" />
          <stop offset="1" stopColor="#0a0b0c" />
        </radialGradient>
        <radialGradient id="hm-flashglow">
          <stop offset="0" stopColor="#fff6dc" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#ffd08a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff9c4a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hm-headlit" cx="0.5" cy="0.05" r="0.6">
          <stop offset="0" stopColor="#f4fff8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#f4fff8" stopOpacity="0" />
        </radialGradient>
        <clipPath id="hm-torso-clip">
          <path d={TORSO_D} />
        </clipPath>
        <clipPath id="hm-head-clip">
          <path d={HEAD_D} />
        </clipPath>
        <clipPath id="hm-gap-clip">
          <path d={GAP_D} />
        </clipPath>
        <mask id="hm-jaw-mask" maskUnits="userSpaceOnUse" x="70" y="40" width="60" height="50">
          <path d="M83,58 C85,69 92,80.5 100,81.5 C108,80.5 115,69 117,58 C114,64 109,66 105,66.4 C103,65.2 97,65.2 95,66.4 C91,66 86,64 83,58 Z" fill="#fff" filter="url(#hm-soft)" />
        </mask>
      </defs>

      {/* ---- legs: plain black trousers with a pressed crease, a clean
           break over polished black oxfords ---- */}
      <g className="hm-leg hm-leg-l">
        <path d="M72.5,396 C71.5,389 74.5,383.5 85.5,383 C95,382.6 101,385.4 101.6,391 L101.6,396 Z" fill="url(#hm-shoe)" />
        <path d="M72,396 L102,396 L102,393.8 C92,394.8 82,394.8 72,393.8 Z" fill="#010101" />
        <ellipse cx="82" cy="387" rx="5.2" ry="1.4" fill={LIT} opacity="0.35" filter="url(#hm-soft)" />
        <path d="M77,389.6 C82,388 90,387.8 96,388.6" stroke="#000" strokeWidth="0.6" fill="none" opacity="0.8" />
        <path d="M66.5,206 C67.5,262 71,330 74,385 L98.6,385.6 C99,330 99.6,262 100,208 Z" fill="url(#hm-trouser)" />
        <path d="M86.4,214 C86.8,270 86.6,330 86.4,380" stroke={LIT} strokeWidth="0.8" fill="none" opacity="0.16" />
        <path d="M68.2,208 C69,262 72,330 75.4,383" stroke="#000" strokeWidth="2.6" fill="none" opacity="0.55" filter="url(#hm-soft)" />
        <path d="M75,374 C81,377 92,377 98,374.6 M76,380 C82,382.4 92,382.4 97.8,380.4" stroke="#000" strokeWidth="1.2" fill="none" opacity="0.6" filter="url(#hm-soft)" />
        <path d="M75.6,372.6 C81,375.4 92,375.4 97.8,373.2" stroke={LIT} strokeWidth="0.5" fill="none" opacity="0.1" />
      </g>
      <g className="hm-leg hm-leg-r">
        <path d="M98.4,396 C99,390.4 105,385.6 114.5,385.6 C125.5,385.6 128.5,390 127.5,396 Z" fill="url(#hm-shoe)" />
        <path d="M98,396 L128,396 L128,393.8 C118,394.8 108,394.8 98,393.8 Z" fill="#010101" />
        <ellipse cx="117.5" cy="389" rx="5.2" ry="1.3" fill={LIT} opacity="0.32" filter="url(#hm-soft)" />
        <path d="M104,391.4 C110,389.8 118,389.8 124,391" stroke="#000" strokeWidth="0.6" fill="none" opacity="0.8" />
        <path d="M100,208 C100.4,262 101,330 101.4,385.6 L126,385 C129,330 132.5,262 133.5,206 Z" fill="url(#hm-trouser)" />
        <path d="M113.6,214 C113.2,270 113.4,330 113.6,380" stroke={LIT} strokeWidth="0.8" fill="none" opacity="0.16" />
        <path d="M131.8,208 C131,262 128,330 124.6,383" stroke="#000" strokeWidth="2.6" fill="none" opacity="0.55" filter="url(#hm-soft)" />
        <path d="M102,374.6 C108,377 119,377 125,374 M102.2,380.4 C108,382.4 118,382.4 124,380" stroke="#000" strokeWidth="1.2" fill="none" opacity="0.6" filter="url(#hm-soft)" />
        <path d="M100,212 L100,384" stroke="#000" strokeWidth="1.4" opacity="0.7" filter="url(#hm-soft)" />
      </g>

      {/* ---- off arm: suit sleeve, a line of white cuff, black glove ---- */}
      <g className="hm-arm hm-arm-off">
        <path d="M140,91 C152,92 158.5,101 160.5,115 L163,197 C160,199.4 150,200.4 144.6,199.6 L143.2,126 Z" fill="url(#hm-sleeve)" />
        <path d="M145,95 C152,97 157,103 158.6,112" stroke={LIT} strokeWidth="1.6" fill="none" opacity="0.28" filter="url(#hm-soft)" />
        <path d="M144.2,146 C149,150 156,150 161.6,146.6 M144.4,154 C150,156.4 156,156 161.8,153" stroke="#000" strokeWidth="1.1" fill="none" opacity="0.75" filter="url(#hm-soft)" />
        <path d="M144.6,144.8 C149.4,148.6 156,148.6 161.4,145.4" stroke={LIT} strokeWidth="0.5" fill="none" opacity="0.2" />
        <path d="M144.4,196.6 L162.8,195.4 L163,200 L144.6,201.2 Z" fill="url(#hm-shirt)" />
        <g transform="translate(0 -12)">
          <path d="M145.8,216 C144.8,223 145.2,230 147.2,235.4 L158.6,236.4 C160.6,230.4 161,223.4 159.6,215.4 Z" fill="url(#hm-glove)" />
          <path d="M147.2,234.6 C147.2,239.6 150.2,244 154,244 C158,244 160.2,240.6 159.8,235.6 Z" fill="url(#hm-glove)" />
          <path d="M150.6,236.8 C150.4,239.2 150.9,241.2 151.9,243 M153.9,237 C153.7,239.7 154.1,241.7 154.9,243.6 M157,236.8 C157,239.2 157.4,240.8 158.1,242.3" stroke="#000" strokeWidth="0.7" fill="none" />
          <path d="M150,219 L150.6,231 M153,218.6 L153.4,231 M156,218.6 L156.2,231" stroke="#2c3133" strokeWidth="0.45" fill="none" />
          <path d="M147.4,234.6 C151,236 155,236 159.2,234.6" stroke={LIT} strokeWidth="0.7" fill="none" opacity="0.4" />
          <path d="M146.8,219.6 C143.2,221.6 141.6,227.6 142.5,232.6 C143.2,236.4 146.6,237 147.7,233.8 C148.2,229.6 148.4,224.6 148.7,220.6 Z" fill="url(#hm-glove)" />
          <path d="M143.3,224.6 C142.6,228 142.7,231.4 143.6,234" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.4" />
        </g>
      </g>

      {/* ---- the jacket: single-breasted, cut close, one button done up ---- */}
      <path d={TORSO_D} fill="url(#hm-suit)" />
      <g clipPath="url(#hm-torso-clip)">
        <rect x="0" y="0" width="200" height="400" fill="url(#hm-form)" />
        <rect x="0" y="0" width="200" height="400" filter="url(#hm-wool)" />
        {/* shoulders catching the tube overhead */}
        <ellipse cx="69" cy="95" rx="13" ry="4.5" fill={LIT} opacity="0.13" filter="url(#hm-softer)" />
        <ellipse cx="131" cy="95" rx="13" ry="4.5" fill={LIT} opacity="0.13" filter="url(#hm-softer)" />
        {/* the pull from the button: folds fanning out to the sides */}
        <path d="M99,162 C90,163 80,164 68,161 M101,162 C110,163 120,164 132,161" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.6" filter="url(#hm-soft)" />
        <path d="M98,160.6 C90,161.6 80,162.4 68,159.6 M102,160.6 C110,161.6 120,162.4 132,159.6" stroke={LIT} strokeWidth="0.5" fill="none" opacity="0.12" />
        <path d="M99,163 C93,170 86,174 74,176 M101,163 C107,170 114,174 126,176" stroke="#000" strokeWidth="1.1" fill="none" opacity="0.45" filter="url(#hm-soft)" />
        {/* side seams / darts */}
        {/* the shadow each lapel throws on the chest */}
        <path d="M76,108 C83,126 91,142 98,157" stroke="#000" strokeWidth="3.2" fill="none" opacity="0.55" filter="url(#hm-soft)" transform="translate(-1.6 1.6)" />
        <path d="M124,108 C117,126 109,142 102,157" stroke="#000" strokeWidth="3.2" fill="none" opacity="0.55" filter="url(#hm-soft)" transform="translate(1.6 1.6)" />
      </g>
      {/* below the button the fronts cut away: trousers and a belt between */}
      <path d={GAP_D} fill="#0a0b0c" />
      <g clipPath="url(#hm-gap-clip)">
        <rect x="86" y="170.5" width="28" height="6" fill="#030303" />
        <path d="M86,170.5 H114" stroke={LIT} strokeWidth="0.4" opacity="0.18" />
        <rect x="97.4" y="171" width="5.2" height="5" rx="0.6" fill="none" stroke="#9aa3a3" strokeWidth="0.8" />
        <path d="M100,177 L100,214" stroke={LIT} strokeWidth="0.5" opacity="0.12" />
      </g>
      <path d="M100,163 C97,182 94,198 90,214" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.28" />
      <path d="M100,163 C103,182 106,198 110,214" stroke={FILL} strokeWidth="0.6" fill="none" opacity="0.2" />
      {/* flap pockets and the breast welt */}
      <path d="M65.5,186 L86,188 L86,193.6 L66,191.6 Z" fill="#14181a" />
      <path d="M65.5,186 L86,188" stroke={LIT} strokeWidth="0.6" opacity="0.3" />
      <path d="M66,191.6 L86,193.6" stroke="#000" strokeWidth="1" opacity="0.8" filter="url(#hm-soft)" />
      <path d="M134.5,186 L114,188 L114,193.6 L134,191.6 Z" fill="#14181a" />
      <path d="M134.5,186 L114,188" stroke={LIT} strokeWidth="0.6" opacity="0.3" />
      <path d="M134,191.6 L114,193.6" stroke="#000" strokeWidth="1" opacity="0.8" filter="url(#hm-soft)" />
      <path d="M117,128.4 L132,126.4 L132.2,128.6 L117.2,130.6 Z" fill="#14181a" />
      <path d="M117,128.4 L132,126.4" stroke={LIT} strokeWidth="0.5" opacity="0.3" />

      {/* ---- shirt and tie in the V ---- */}
      <path d="M87,85 L113,85 L100,153 Z" fill="url(#hm-shirt)" />
      <path d="M90,92 C93,110 96,130 99,150 M110,92 C107,110 104,130 101,150" stroke="#000" strokeWidth="1.6" fill="none" opacity="0.18" filter="url(#hm-soft)" />
      <path d="M97.6,99 L102.4,99 L104.4,146 L100,151.5 L95.6,146 Z" fill="url(#hm-tie)" />
      <path d="M99.6,100 L99.9,150" stroke={LIT} strokeWidth="0.5" opacity="0.22" />
      <path d="M96.2,128 C98.4,129 101.6,129 103.8,128" stroke="#000" strokeWidth="0.6" fill="none" opacity="0.5" />

      {/* ---- notch lapels ---- */}
      <path d={LAPEL_L} fill="url(#hm-lapel)" />
      <path d={LAPEL_R} fill="url(#hm-lapel)" />
      <path d="M98,157 C91,142 83,126 76,108 L82,104.5" stroke={LIT} strokeWidth="0.7" fill="none" opacity="0.42" />
      <path d="M102,157 C109,142 117,126 124,108 L118,104.5" stroke={LIT} strokeWidth="0.7" fill="none" opacity="0.3" />
      <path d="M82,104.5 L79.5,99.5 M118,104.5 L120.5,99.5" stroke="#000" strokeWidth="0.9" opacity="0.8" />
      <path d="M79.5,99.5 C82,94 85,89 88,85 M120.5,99.5 C118,94 115,89 112,85" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.3" />
      {/* the roll of the lapel: a soft highlight down its length */}
      <path d="M85,104 C89,118 93,132 97.5,148 M115,104 C111,118 107,132 102.5,148" stroke={LIT} strokeWidth="2.4" fill="none" opacity="0.07" filter="url(#hm-soft)" />
      {/* lapel buttonhole */}
      <path d="M85.2,108.6 L88.8,107.6" stroke="#000" strokeWidth="0.7" opacity="0.8" />
      {/* the button */}
      <circle cx="100" cy="162" r="2.3" fill="#0a0b0c" stroke="#2e3436" strokeWidth="0.5" />
      <circle cx="99.4" cy="161.3" r="0.6" fill={LIT} opacity="0.55" />

      {/* the Maple Jiu Jitsu leaf as a pin on the left lapel */}
      <g className="hm-pin">
        <image href={mapleLogo} x="108.6" y="106.4" width="11" height="11.2" preserveAspectRatio="xMidYMid meet" filter="url(#hm-pintone)" />
      </g>

      {/* ---- neck, collar and knot ---- */}
      <path d="M88.5,62 C88.5,72 88,80 87.5,90 L112.5,90 C112,80 111.5,72 111.5,62 Z" fill="url(#hm-skin)" />
      <path d="M88.5,72 C94,82 106,82 111.5,72" stroke="#3a2a22" strokeWidth="4" fill="none" opacity="0.4" filter="url(#hm-soft)" />
      {/* back of the collar band round the neck */}
      <path d="M88,80 C92,83 108,83 112,80 L112.6,88 C106,90 94,90 87.4,88 Z" fill="#dfe8e3" />
      <path d="M96.4,91 L103.6,91 L102.6,99.4 L97.4,99.4 Z" fill="url(#hm-tie)" />
      <path d="M97.4,92 L102.6,92" stroke={LIT} strokeWidth="0.5" opacity="0.3" />
      <path d="M88.4,80 C88,84 87.5,88 87,92 L97,100.6 L97.8,94 C94.6,90 91.4,86 89.4,80 Z" fill="url(#hm-shirt)" />
      <path d="M111.6,80 C112,84 112.5,88 113,92 L103,100.6 L102.2,94 C105.4,90 108.6,86 110.6,80 Z" fill="url(#hm-shirt)" />
      <path d="M87,92 L97,100.6 M113,92 L103,100.6" stroke="#6f7c77" strokeWidth="0.6" opacity="0.7" />

      {/* ---- the head: short, neat, side-parted; a face with nothing in it ---- */}
      <path d="M82,45 C79,44 77.5,48 78,52.5 C78.6,57 80.8,59 83,58.4 Z" fill="url(#hm-skin)" />
      <path d="M118,45 C121,44 122.5,48 122,52.5 C121.4,57 119.2,59 117,58.4 Z" fill="url(#hm-skin)" />
      <path d="M80.2,48.6 C79.8,51.6 80.6,54.6 82.2,56" stroke="#7a5646" strokeWidth="0.8" fill="none" />
      <path d="M119.8,48.6 C120.2,51.6 119.4,54.6 117.8,56" stroke="#7a5646" strokeWidth="0.8" fill="none" />
      <path d={HEAD_D} fill="url(#hm-skin)" />
      <g clipPath="url(#hm-head-clip)">
        <rect x="78" y="10" width="44" height="76" fill="url(#hm-form)" opacity="0.5" />
        <ellipse cx="100" cy="30" rx="12" ry="7" fill="url(#hm-headlit)" />
        {/* top light: the brow throws the eyes into shadow */}
        <path d="M84,45 C90,43.5 96,44 100,46 C104,44 110,43.5 116,45 L116,51 C110,49 104,49.6 100,51.4 C96,49.6 90,49 84,51 Z" fill="#5a3a2c" opacity="0.42" filter="url(#hm-soft)" />
        {[92, 108].map((cx) => (
          <g key={cx}>
            <path d={`M${cx - 4.2},50.8 C${cx - 2.2},49.2 ${cx + 2.2},49.2 ${cx + 4.2},50.8 C${cx + 2.2},52.2 ${cx - 2.2},52.2 ${cx - 4.2},50.8 Z`} fill="#d9d4ca" />
            <circle cx={cx} cy="50.8" r="1.45" fill="#3a2a20" />
            <circle cx={cx} cy="50.8" r="0.7" fill="#050302" />
            <circle cx={cx + 0.5} cy="50.25" r="0.32" fill="#f4fff8" />
            <path d={`M${cx - 4.4},50.7 C${cx - 2.2},48.8 ${cx + 2.2},48.8 ${cx + 4.4},50.7`} stroke="#1a110c" strokeWidth="1.2" fill="none" />
            <path d={`M${cx - 3.8},48.4 C${cx - 1.8},47.6 ${cx + 1.8},47.6 ${cx + 3.8},48.4`} stroke="#7a5646" strokeWidth="0.6" fill="none" opacity="0.6" />
            <path d={`M${cx - 3.6},52.6 C${cx - 1.6},53.3 ${cx + 1.6},53.3 ${cx + 3.6},52.6`} stroke="#8a6352" strokeWidth="0.55" fill="none" opacity="0.6" />
          </g>
        ))}
        {/* level brows: straight, no arch, no expression */}
        <path d="M86.2,44.6 C89,43.6 93,43.4 96.8,44 L96.8,45.8 C93,45.4 89,45.6 86.4,46.6 Z" fill="#231915" />
        <path d="M113.8,44.6 C111,43.6 107,43.4 103.2,44 L103.2,45.8 C107,45.4 111,45.6 113.6,46.6 Z" fill="#231915" />
        {/* the nose: lit ridge, shadowed side, tip, nostrils */}
        <path d="M99.6,50 C99.4,54 99.2,57.4 98.8,60" stroke="#f6e2d2" strokeWidth="1.1" fill="none" opacity="0.45" filter="url(#hm-soft)" />
        <path d="M102.2,51 C103,55 103.8,58 104,61" stroke="#7d5a49" strokeWidth="1.2" fill="none" opacity="0.5" filter="url(#hm-soft)" />
        <path d="M96,61.4 C97.6,63.2 102.4,63.2 104,61.4 C103,60.2 97,60.2 96,61.4 Z" fill="#9a7360" opacity="0.55" />
        <ellipse cx="97.8" cy="62" rx="1.05" ry="0.55" fill="#3e2820" />
        <ellipse cx="102.2" cy="62" rx="1.05" ry="0.55" fill="#3e2820" />
        <path d="M86,57 C88,61 90,63 92,64 M114,57 C112,61 110,63 108,64" stroke="#7d5a49" strokeWidth="1.4" fill="none" opacity="0.3" filter="url(#hm-soft)" />
        {/* a clean shave still leaves a shadow on the jaw */}
        <rect x="76" y="50" width="48" height="36" fill="#4a5a5c" opacity="0.18" mask="url(#hm-jaw-mask)" />
        {/* the mouth: closed, level */}
        <path d="M95,69.6 C98,70.1 102,70.1 105,69.6" stroke="#5e3428" strokeWidth="1.15" fill="none" strokeLinecap="round" />
        <path d="M95.6,68.4 C98,67.7 102,67.7 104.4,68.4" stroke="#9c6e5c" strokeWidth="0.7" fill="none" opacity="0.6" />
        <path d="M96.4,71.8 C98.6,72.8 101.4,72.8 103.6,71.8" stroke="#f0d3bf" strokeWidth="0.8" fill="none" opacity="0.45" />
        <path d="M97,75 C99,75.8 101,75.8 103,75" stroke="#7d5a49" strokeWidth="0.9" fill="none" opacity="0.4" filter="url(#hm-soft)" />
        <path d="M86,68 C90,78 96,82 100,82 C104,82 110,78 114,68" stroke="#000" strokeWidth="3.2" fill="none" opacity="0.3" filter="url(#hm-soft)" />
      </g>
      {/* short hair, side part, combed and set */}
      <path d={HAIR_D} fill="url(#hm-hair)" />
      <path d="M85,34 C88,26 95,21 103,20.4 M88,33 C92,26 98,23 105,22.4 M112.6,22 C115,24 117,28 118,34" stroke="#4a423c" strokeWidth="0.5" fill="none" opacity="0.7" />
      <path d="M109.6,14.6 C110.6,19 111.2,23.6 111.6,28.6" stroke="#5a5048" strokeWidth="0.7" fill="none" opacity="0.8" />
      <path d="M88,24 C93,18 101,16 108,17" stroke={LIT} strokeWidth="1.6" fill="none" opacity="0.28" filter="url(#hm-soft)" />
      <path d="M121,40 C121.6,46 121.4,52 120.4,58" stroke={FILL} strokeWidth="0.8" fill="none" opacity="0.35" filter="url(#hm-soft)" />

      {/* the earpiece: a clear bud and a coiled wire down into the collar */}
      <path d={COIL_D} stroke="#d4ece6" strokeWidth="0.55" fill="none" opacity="0.75" />
      <path d={COIL_D} stroke="#ffffff" strokeWidth="0.25" fill="none" opacity="0.6" transform="translate(-0.2 -0.2)" />
      <ellipse cx="80.2" cy="51.6" rx="1.5" ry="1.9" fill="#cfe6e0" opacity="0.8" />
      <circle cx="79.8" cy="51" r="0.45" fill="#fff" opacity="0.9" />

      {/* ---- gun arm, hanging: pistol and suppressor down along the thigh ---- */}
      <g className="hm-arm hm-arm-down">
        <path d="M60,91 C48,92 41.5,101 39.5,115 L37,197 C40,199.4 50,200.4 55.4,199.6 L56.8,126 Z" fill="url(#hm-sleeve)" />
        <path d="M55,95 C48,97 43,103 41.4,112" stroke={LIT} strokeWidth="1.6" fill="none" opacity="0.28" filter="url(#hm-soft)" />
        <path d="M38.2,146.6 C44,150 51,150 55.8,146 M38,153 C44,156 50,156.4 55.6,154" stroke="#000" strokeWidth="1.1" fill="none" opacity="0.75" filter="url(#hm-soft)" />
        <path d="M38.6,145.4 C44,148.6 50.6,148.6 55.4,144.8" stroke={LIT} strokeWidth="0.5" fill="none" opacity="0.2" />
        <path d="M37.2,195.4 L55.6,196.6 L55.4,201.2 L37,200 Z" fill="url(#hm-shirt)" />
        <g transform="translate(0 -12)">
          {/* the pistol, slide-top to camera, muzzle down */}
          <path d="M45.2,232 L51.4,232 L51.2,262 L45.4,262 Z" fill="url(#hm-steel-side)" />
          <path d="M46.2,234 L46.4,261" stroke={LIT} strokeWidth="0.5" opacity="0.4" />
          <path d="M46,240 L50.6,240 M46,243 L50.6,243 M46,246 L50.6,246" stroke="#000" strokeWidth="0.4" opacity="0.6" />
          <path d="M51.3,236 C53.6,238 54,244 52.2,247 L51.3,247" fill="none" stroke="#1d2022" strokeWidth="1.3" />
          {/* the suppressor: a long matte can threaded on the barrel */}
          <path d="M45.6,262 L51,262 L51,302 C51,303.6 49.8,304.4 48.3,304.4 C46.8,304.4 45.6,303.6 45.6,302 Z" fill="url(#hm-steel-side)" />
          <path d="M46.5,263 L46.6,302.5" stroke={LIT} strokeWidth="0.6" opacity="0.35" />
          <path d="M45.6,265 H51 M45.6,267 H51 M45.6,299.6 H51 M45.6,301.6 H51" stroke="#000" strokeWidth="0.45" opacity="0.7" />
          <path d="M45.2,262 H51.4" stroke="#000" strokeWidth="0.8" opacity="0.8" />
          {/* the gloved fist round the grip */}
          <path d="M40.6,216 C39.4,223 39.8,231 41.6,237.5 L55.2,238 C56.6,231 56.8,223 55.6,215.5 Z" fill="url(#hm-glove)" />
          <path d="M41.2,221 C40.4,226 40.6,231 41.6,236 M41,224.5 L43.6,224.8 M41,228.6 L43.8,228.9 M41.4,232.6 L44,232.9" stroke="#000" strokeWidth="0.7" fill="none" />
          <path d="M40.8,222 C40.2,226 40.4,230 41,233" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.45" />
          <path d="M54.6,219 C57.4,222 57.6,230 55.4,236 C54,238.6 51,238.4 50.4,236 C50.4,231 51.2,225 52,220 Z" fill="url(#hm-glove)" />
          <path d="M56.4,224 C56.9,228 56.6,232 55.4,235" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.4" />
          <path d="M52,221 C51.2,226 50.8,231 50.8,235.5" stroke="#000" strokeWidth="0.7" fill="none" />
        </g>
      </g>

      {/* ---- gun arm, levelled at the camera ---- */}
      <g className="hm-arm-up">
        <g className="hm-recoil">
          {/* the sleeve comes straight at the lens from his right shoulder */}
          <path d="M38,84 C40,68 54,61 65,65 C77,69 81,84 79,100 C78,112 71,119 60,119 C49,119 43,111 40,101 C38,95 37,89 38,84 Z" fill="url(#hm-sleeve)" />
          <path d="M38.5,95 C43,106 56,111 70,105" stroke="#000" strokeWidth="1.3" fill="none" opacity="0.75" filter="url(#hm-soft)" />
          <path d="M39,93.6 C43.6,104.4 56,109.6 69.6,103.6" stroke={LIT} strokeWidth="0.5" fill="none" opacity="0.22" />
          <path d="M44,70 C52,63 64,63 72,69" stroke={LIT} strokeWidth="1.6" fill="none" opacity="0.32" filter="url(#hm-soft)" />
          <g transform="translate(-38 2)">
            {/* the white shirt cuff ringing the wrist */}
            <ellipse cx="101" cy="105" rx="16.4" ry="14.4" fill="#0d0f10" />
            <ellipse cx="101" cy="106" rx="14.2" ry="12.2" fill="url(#hm-shirt)" />
            <ellipse cx="100.6" cy="104.4" rx="12" ry="10.4" fill="#2a3032" />
            {/* the gloved fist: three fingers on the front strap */}
            <path d="M88,90 C88,86 92,85 100,85 C108,85 112,86 112,90 L112,108 C112,113 107,115 100,115 C93,115 88,113 88,108 Z" fill="url(#hm-glove)" />
            {[92.5, 99.5, 106.5].map((y, i) => (
              <g key={y}>
                <path d={`M${89 + i * 0.6},${y} C94,${y + 1.6} 106,${y + 1.6} ${111 - i * 0.6},${y}`} stroke="#000" strokeWidth="1.1" fill="none" />
                <path d={`M${91 + i},${y + 2.2} C96,${y + 3.2} 104,${y + 3.2} ${109 - i},${y + 2.2}`} stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.45" />
              </g>
            ))}
            <path d="M88.6,108 C89,112 93,114.6 100,114.8 C107,114.6 111,112 111.4,108" stroke={FILL} strokeWidth="0.7" fill="none" opacity="0.5" />
            <path d="M88.4,89 C89,86.4 93,85.6 100,85.6" stroke={LIT} strokeWidth="0.8" fill="none" opacity="0.5" />
            <path d="M110,84 C115,83 117,88 116,94 C115,98 112,99 110,97 Z" fill="url(#hm-glove)" />
            <path d="M111,85 C114,84.5 116,87 115.6,91" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.35" />
            {/* trigger guard and frame */}
            <path d="M92.5,80 L92.5,86 C92.5,90.5 107.5,90.5 107.5,86 L107.5,80" stroke="#15181a" strokeWidth="2.3" fill="none" />
            <path d="M91,76 L109,76 L109,82 L91,82 Z" fill="#141617" />
            {/* the slide, end-on */}
            <rect x="89.5" y="60.5" width="21" height="16" rx="2.2" fill="url(#hm-steel)" />
            <rect x="90.1" y="61.1" width="19.8" height="14.8" rx="1.8" fill="none" stroke="#8c9496" strokeWidth="0.4" opacity="0.45" />
            <path d="M90.5,61.3 L109.5,61.3" stroke={LIT} strokeWidth="0.8" opacity="0.55" />
            <rect x="98.8" y="56.4" width="2.4" height="4.4" rx="0.4" fill="#1a1d1f" />
            {/* the suppressor, coming at the lens a touch off axis, so its
                length shows: the far end sits on the slide's face, the near
                end is bigger and lower */}
            <circle cx="100" cy="67.4" r="5.2" fill="#0b0c0d" />
            <path d="M95.79,64.35 L86.61,73.25 L98.59,81.95 L104.21,70.45 Z" fill="url(#hm-can)" />
            <path d="M97.05,65.26 L88.29,74.47" stroke={LIT} strokeWidth="0.9" opacity="0.5" strokeLinecap="round" />
            <path d="M103.37,69.84 L97.69,81.29" stroke={FILL} strokeWidth="0.6" opacity="0.4" strokeLinecap="round" />
            {[0.22, 0.3, 0.78, 0.86].map((t) => {
              const cx = 100 + -7.400 * t;
              const cy = 67.4 + 10.200 * t;
              const r = 5.2 + 2.20 * t;
              return <ellipse key={t} cx={cx} cy={cy} rx={r * 0.32} ry={r} transform={`rotate(126.0 ${cx} ${cy})`} fill="none" stroke="#000" strokeWidth="0.5" opacity="0.6" />;
            })}
            <circle cx="92.6" cy="77.6" r="7.4" fill="url(#hm-canface)" />
            <circle cx="92.6" cy="77.6" r="7.4" fill="none" stroke="#525a5d" strokeWidth="0.8" strokeDasharray="0.6 0.6" />
            <circle cx="92.6" cy="77.6" r="4.59" fill="none" stroke="#2f3437" strokeWidth="0.6" />
            <circle cx="92.6" cy="77.6" r="1.6" fill="#000" />
            <path d="M87.27,75.38 C88.53,72.05 91.86,70.79 94.82,71.24" stroke={LIT} strokeWidth="0.8" fill="none" opacity="0.6" />
            <g transform="translate(92.6 77.6)">
              {SHOTS.map((k) => (
                <g key={k} className={`hm-muzzle hm-muzzle-${k}`}>
                  <circle r="9" fill="url(#hm-flashglow)" />
                  <path d={FLASH_D} fill="#ffe2a6" />
                  <circle r="1.6" fill="#ffffff" />
                </g>
              ))}
              {SHOTS.map((k) => (
                <circle key={k} className={`hm-puff hm-puff-${k}`} r="6" fill="none" stroke="#d9e4df" strokeWidth="2.2" filter="url(#hm-soft)" />
              ))}
              <g className="hm-gunsmoke" fill="none" stroke="#cfdad6" strokeLinecap="round" filter="url(#hm-softer)">
                <path className="hm-gs hm-gs-a" d="M0,-4 C-3,-10 3,-16 -1,-24 C-4,-30 1,-36 -2,-44" strokeWidth="2.2" />
                <path className="hm-gs hm-gs-b" d="M0,-4 C3,-10 -2,-18 2,-26 C5,-32 0,-38 3,-46" strokeWidth="1.8" />
              </g>
            </g>
            {SHOTS.map((k) => (
              <rect key={k} className={`hm-casing hm-casing-${k}`} x="87" y="63" width="2.4" height="5" rx="0.6" fill="#c9a04a" />
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}

const SHOTS = [1, 2, 3];

// a small eight-point star: a suppressed round shows a pinch of flame
const FLASH_D = (() => {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 1.6 : i % 4 ? 4 : 6;
    pts.push(`${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
})();

// a coiled wire seen from the side: loops riding down a line from behind the
// ear into the back of the collar
const COIL_D = (() => {
  const a = [80.8, 55];
  const b = [86.6, 84];
  const loops = 11;
  const n = loops * 10;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const th = t * loops * Math.PI * 2;
    const x = a[0] + (b[0] - a[0]) * t + Math.cos(th) * 1.3;
    const y = a[1] + (b[1] - a[1]) * t + Math.sin(th) * 0.9;
    d += `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)} `;
  }
  return d;
})();

// cut close: square shoulders, suppressed at the waist, a little flare at the hem
const TORSO_D =
  "M84,86 C70,87 60,90 56,98 C53,106 54,118 56,130 C58,148 62,162 64,172 C63,186 62.5,200 62.5,214 L137.5,214 C137.5,200 137,186 136,172 C138,162 142,148 144,130 C146,118 147,106 144,98 C140,90 130,87 116,86 Z";

const GAP_D = "M100,163 C97,182 94,198 90,214 L110,214 C106,198 103,182 100,163 Z";

const LAPEL_L = "M88,85 L100,152 L98,157 C91,142 83,126 76,108 L82,104.5 L79.5,99.5 C82,94 85,89 88,85 Z";
const LAPEL_R = "M112,85 L100,152 L102,157 C109,142 117,126 124,108 L118,104.5 L120.5,99.5 C118,94 115,89 112,85 Z";

const HEAD_D =
  "M81.5,42 C81,25 89,16 100,16 C111,16 119,25 118.5,42 C119,53 118,63 114,71 C110,78.5 105,81.5 100,81.5 C95,81.5 90,78.5 86,71 C82,63 81,53 81.5,42 Z";

// hairline high and square at the temples, volume on top, parted on his left
const HAIR_D =
  "M81.6,45 C79.6,33 81,22 89,16.4 C94,12.8 101,12 107,13 C114,14.2 119.6,19 120.4,28 C120.8,34 120,40 118.6,45 C118,40 117.4,36 116,33.4 C112,31.4 104,30.6 96,31.4 C91,32 87,33.6 84.6,36 C83.4,38.6 82.4,41.6 81.6,45 Z";
