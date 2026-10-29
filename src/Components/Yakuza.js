// Yakuza.js — the fourth take on Mafia's hook: a yakuza in a wet Tokyo back
// alley. Red paper lanterns and magenta light-box signs stutter on down both
// walls and he is already standing there: slicked-back hair, a sharp white
// suit buttoned once over a black silk shirt worn open, irezumi — a dragon
// in waves and wind — showing in the open collar and at both wrists, the top
// joint of his left little finger gone. He brings up a nickel pistol and fires
// three rounds at the camera. A Maple Jiu Jitsu leaf pin on his lapel; no text.
//
// Built off Thug/Bratva: same cue machine, same shot effects, same viewBox and
// feet line, so the takes cut together. The alley is one SVG in phone-shaped
// units, in one-point perspective, so the walls, signs, lanterns and their
// reflections all recede to the same vanishing point.
import React from "react";
import "../Stylesheets/Yakuza.css";
import usePhases from "../Utils/usePhases";
import mapleLogo from "../Images/maple-logo.png";

// p1 the signs and lanterns stutter on and he is already standing there
// p2 he raises the pistol at the viewer; the camera starts a slow push in
// p3-p5 three rounds: each a muzzle flash, recoil, a frame flash and shake,
//    and a casing; smoke curls off the barrel after the first
//
// Plays ONCE and holds — loopAt is null. Rain, steam, the signs' hum and the
// smoke keep running on the held frame; that is ambient, not a restart.
const CUES = [40, 860, 1160, 1440, 1760];

export default function Yakuza({ mode = "animated", loopAt = null }) {
  // ?static on the URL gives the still without editing App.js; ?phase=N holds
  // one beat as a still, for checking poses
  const q = new URLSearchParams(window.location.search);
  const hold = Number(q.get("phase")) || 0;
  const still = mode === "static" || q.has("static") || hold > 0;
  const { phase: live, run, isStatic } = usePhases(CUES, { mode: still ? "static" : mode, loopAt });
  const phase = hold || live;

  return (
    <div className={`yk yk-p${phase} ${isStatic ? "is-static" : ""}`} key={run}>
      <div className="yk-world">
        {/* the alley is four stacked layers — the unlit structure, then each
            light group on its own — so the stutter and hum animate the
            layers' opacity on the compositor instead of repainting every
            blurred sign in the SVG each frame */}
        <Alley layer="base" />
        <div className="yk-layer yk-lit-a">
          <Alley layer="a" />
        </div>
        <div className="yk-layer yk-lit-b">
          <Alley layer="b" />
        </div>
        <div className="yk-layer yk-lit-c">
          <Alley layer="c" />
        </div>
        <div className="yk-rain yk-rain-far" aria-hidden />

        <div className="yk-card">
          <div className="yk-figbox">
            <div className="yk-pool" aria-hidden />
            <div className="yk-walker">
              <div className="yk-shadow" aria-hidden />
              <div className="yk-gait">
                <Yakuza3 />
              </div>
              <div className="yk-reflect" aria-hidden>
                <Yakuza3 />
              </div>
            </div>
          </div>
        </div>

        <div className="yk-steam" aria-hidden>
          <i className="yk-puff yk-puff-a" />
          <i className="yk-puff yk-puff-b" />
          <i className="yk-puff yk-puff-c" />
        </div>
        <div className="yk-rain yk-rain-near" aria-hidden />
      </div>

      <div className="yk-cut" aria-hidden />
      <div className="yk-flash" aria-hidden />
      <div className="yk-vignette" aria-hidden />
      <div className="yk-grain" aria-hidden />
    </div>
  );
}

/* ======================================================================
   THE ALLEY — one-point perspective in a 390 x 844 box (a portrait phone),
   sliced to fill whatever the frame is.
   ====================================================================== */

const VP_L = 150; // where the left wall meets the far end
const VP_R = 240; // where the right wall meets the far end
const FAR_T = 220; // the far end's top and bottom
const FAR_B = 400;
const NEAR_T = -40; // the walls' top and foot at the frame edges
const NEAR_B = 760;

// a point on a wall: d is depth 0 (frame edge) .. 1 (far end), f is height
// 0 (eaves) .. 1 (foot of the wall)
function wallPt(side, d, f) {
  const xl = d * VP_L;
  const x = side === "L" ? xl : 390 - xl;
  const top = NEAR_T + (FAR_T - NEAR_T) * d;
  const bot = NEAR_B - (NEAR_B - FAR_B) * d;
  return [x, top + f * (bot - top)];
}
// how big things are at that depth, 1 at the frame edge
const scaleAt = (d) => (NEAR_B - NEAR_T - d * (NEAR_B - NEAR_T - (FAR_B - FAR_T))) / (NEAR_B - NEAR_T);

const rnd = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

// Abstract sign lettering: a column of cells, each built the way CJK
// characters are — strokes that run the full width or height of the cell,
// boxes, and short ticks — but matching no real character.
function glyphs(seed, cells) {
  const r = rnd(seed);
  const strokes = [];
  const H = (y, x1 = 0.1, x2 = 0.9) => strokes.push([x1, y, x2, y]);
  const V = (x, y1, y2) => strokes.push([x, y1, x, y2]);
  for (let c = 0; c < cells; c++) {
    const t = (v) => (c + 0.12 + v * 0.76) / cells;
    const kind = Math.floor(r() * 8);
    const start = strokes.length;
    if (kind === 0) {
      H(t(0.1), 0.15, 0.85); V(0.3, t(0.1), t(1)); H(t(0.5), 0.3, 0.85); V(0.85, t(0.5), t(1)); H(t(1), 0.3, 0.85);
    } else if (kind === 1) {
      V(0.15, t(0), t(1)); H(t(0), 0.15, 0.45); H(t(1), 0.15, 0.45);
      H(t(0.2), 0.55, 0.9); V(0.72, t(0.2), t(1)); H(t(0.6), 0.55, 0.9);
    } else if (kind === 2) {
      H(t(0.05), 0.25, 0.75); V(0.25, t(0.05), t(0.55)); V(0.75, t(0.05), t(0.55)); H(t(0.55), 0.25, 0.75);
      H(t(0.8)); strokes.push([0.5, t(0.8), 0.25, t(1)]); strokes.push([0.5, t(0.8), 0.78, t(1)]);
    } else if (kind === 3) {
      strokes.push([0.45, t(0), 0.2, t(0.3)]); H(t(0.35)); V(0.3, t(0.35), t(1)); V(0.7, t(0.35), t(1)); H(t(0.7), 0.3, 0.7);
    } else if (kind === 4) {
      H(t(0.15), 0.3, 0.7); H(t(0.45)); H(t(0.8), 0.2, 0.8); V(0.5, t(0.15), t(1)); strokes.push([0.2, t(1), 0.36, t(0.88)]);
    } else if (kind === 5) {
      V(0.2, t(0.1), t(0.9)); H(t(0.1), 0.2, 0.8); V(0.8, t(0.1), t(0.9)); H(t(0.9), 0.2, 0.8); H(t(0.5), 0.2, 0.8); V(0.5, t(0.1), t(0.5));
    } else if (kind === 6) {
      strokes.push([0.15, t(0.2), 0.3, t(0.35)]); strokes.push([0.15, t(0.55), 0.3, t(0.7)]); strokes.push([0.12, t(1), 0.3, t(0.8)]);
      H(t(0.15), 0.42, 0.9); V(0.66, t(0.15), t(1)); H(t(0.55), 0.42, 0.9);
    } else {
      H(t(0.25)); strokes.push([0.5, t(0), 0.5, t(0.25)]); strokes.push([0.5, t(0.25), 0.15, t(1)]); strokes.push([0.5, t(0.25), 0.88, t(1)]);
    }
    // break up repeats: sometimes drop a stroke, sometimes add a dot
    if (r() < 0.35 && strokes.length - start > 3) strokes.splice(start + Math.floor(r() * (strokes.length - start)), 1);
    if (r() < 0.4) strokes.push([0.78, t(0.02), 0.88, t(0.14)]);
  }
  return strokes;
}

// light boxes hung out from the walls, facing the camera. "tube" signs are
// neon lettering on a dark box; "box" signs are a lit panel with dark
// lettering — the two kinds a real alley mixes.
const SIGNS = [
  // side, depth, top f, bottom f, width (in wall heights), colour, seed, cells, flicker group, kind
  ["L", 0.02, 0.06, 0.52, 0.05, "m", 11, 6, "a", "tube"],
  ["L", 0.3, 0.12, 0.5, 0.045, "r", 23, 5, "b", "box"],
  ["L", 0.56, 0.1, 0.46, 0.05, "m", 37, 5, "c", "tube"],
  ["L", 0.76, 0.16, 0.52, 0.05, "w", 41, 4, "a", "box"],
  ["L", 0.9, 0.14, 0.44, 0.055, "r", 43, 4, "b", "tube"],
  ["R", 0.08, 0.12, 0.6, 0.05, "r", 53, 6, "b", "box"],
  ["R", 0.38, 0.08, 0.42, 0.048, "m", 67, 5, "a", "tube"],
  ["R", 0.62, 0.16, 0.5, 0.05, "w", 71, 4, "c", "box"],
  ["R", 0.82, 0.1, 0.4, 0.055, "m", 83, 4, "b", "tube"],
  ["R", 0.94, 0.2, 0.46, 0.06, "r", 89, 3, "c", "box"],
];

// paper lanterns strung under the eaves
const LANTERNS = [
  ["L", 0.16, 0.24, "b"],
  ["L", 0.44, 0.26, "a"],
  ["L", 0.66, 0.27, "c"],
  ["L", 0.84, 0.28, "b"],
  ["R", 0.22, 0.25, "c"],
  ["R", 0.5, 0.27, "b"],
  ["R", 0.72, 0.27, "a"],
  ["R", 0.88, 0.29, "c"],
];
// a string of lanterns slung across the alley, further down
const STRING_D = 0.58;

const SIGN_COL = {
  m: { glow: "#ff2fa8", core: "#ffd6f0", box: "#2a0820", panel: "#ff7cc8", ink: "#4a0630" },
  r: { glow: "#ff3b3b", core: "#ffe0d6", box: "#2a0608", panel: "#ff5a48", ink: "#3a0404" },
  w: { glow: "#ffb0d8", core: "#ffffff", box: "#2a1420", panel: "#fff0f4", ink: "#c0102a" },
};

function Sign({ side, d, f1, f2, w, col, seed, cells, grp, kind }) {
  const [x0, y1] = wallPt(side, d, f1);
  const [, y2] = wallPt(side, d, f2);
  const h = y2 - y1;
  const s = scaleAt(d);
  const width = w * 800 * s;
  // hung out from the wall toward the alley's centre
  const x = side === "L" ? x0 + 3 * s : x0 - 3 * s - width;
  const c = SIGN_COL[col];
  const strokes = glyphs(seed, cells);
  const pad = width * 0.18;
  const tube = kind === "tube";
  return (
    <g>
      {/* light spilled on the wall behind it */}
      <ellipse cx={x + width / 2} cy={y1 + h / 2} rx={width * 2} ry={h * 0.7} fill={c.glow} opacity="0.15" filter="url(#yk-bloom)" />
      {/* the brackets that hold it off the wall */}
      {[0.1, 0.9].map((k) => (
        <path
          key={k}
          d={side === "L" ? `M${x0},${y1 + h * k} H${x}` : `M${x0},${y1 + h * k} H${x + width}`}
          stroke="#2a1622"
          strokeWidth={2 * s}
        />
      ))}
      <rect x={x} y={y1} width={width} height={h} rx={1 * s} fill={tube ? c.box : c.panel} stroke={c.glow} strokeWidth={1.1 * s} />
      {!tube && <rect x={x} y={y1} width={width} height={h} rx={1 * s} fill="url(#yk-panelshade)" />}
      {/* the side of the box, catching less light */}
      <rect
        x={side === "L" ? x - 2.4 * s : x + width}
        y={y1 + 1 * s}
        width={2.4 * s}
        height={h - 2 * s}
        fill={tube ? "#12060e" : c.glow}
        opacity={tube ? 1 : 0.5}
      />
      <g
        stroke={tube ? c.core : c.ink}
        strokeWidth={Math.max(0.5, (tube ? 1.6 : 2) * s)}
        strokeLinecap="square"
        filter={tube ? "url(#yk-neon)" : undefined}
      >
        {strokes.map(([ax, ay, bx, by], i) => (
          <line
            key={i}
            x1={x + pad + ax * (width - 2 * pad)}
            y1={y1 + pad + ay * (h - 2 * pad)}
            x2={x + pad + bx * (width - 2 * pad)}
            y2={y1 + pad + by * (h - 2 * pad)}
          />
        ))}
      </g>
      {tube && <rect x={x} y={y1} width={width} height={h} rx={1 * s} fill="none" stroke={c.glow} strokeWidth={2.6 * s} opacity="0.5" filter="url(#yk-neon)" />}
    </g>
  );
}

function Lantern({ side, d, f, grp }) {
  const [wx, wy] = wallPt(side, d, f);
  const s = scaleAt(d);
  const rx = 17 * s;
  const ry = 22 * s;
  const cx = side === "L" ? wx + rx + 5 * s : wx - rx - 5 * s;
  const cy = wy + ry + 6 * s;
  return (
    <g>
      <path d={`M${cx},${wy - 4 * s} V${cy - ry}`} stroke="#140a0c" strokeWidth={0.9 * s} />
      <circle cx={cx} cy={cy} r={ry * 2.2} fill="url(#yk-lanternglow)" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#yk-lantern)" />
      {/* the bamboo ribs */}
      {[-0.66, -0.33, 0, 0.33, 0.66].map((k) => (
        <path
          key={k}
          d={`M${cx - rx * Math.sqrt(1 - k * k)},${cy + k * ry} Q${cx},${cy + k * ry + 2 * s} ${cx + rx * Math.sqrt(1 - k * k)},${cy + k * ry}`}
          stroke="#a8160f"
          strokeWidth={0.6 * s}
          fill="none"
          opacity="0.7"
        />
      ))}
      {/* a dark crest painted on the paper */}
      <circle cx={cx} cy={cy} r={rx * 0.42} fill="none" stroke="#2a0706" strokeWidth={1.6 * s} opacity="0.75" />
      <path d={`M${cx - rx * 0.2},${cy} H${cx + rx * 0.2} M${cx},${cy - rx * 0.2} V${cy + rx * 0.2}`} stroke="#2a0706" strokeWidth={1.4 * s} opacity="0.75" />
      <rect x={cx - rx * 0.55} y={cy - ry - 2.6 * s} width={rx * 1.1} height={3.2 * s} rx={0.6 * s} fill="#140808" />
      <rect x={cx - rx * 0.55} y={cy + ry - 0.6 * s} width={rx * 1.1} height={3.2 * s} rx={0.6 * s} fill="#140808" />
      {/* tassel */}
      <path d={`M${cx},${cy + ry + 2.6 * s} V${cy + ry + 9 * s}`} stroke="#c41a12" strokeWidth={1.2 * s} />
    </g>
  );
}

// a wall-flat quad (pipes, AC units, doors) between depths and heights
function quad(side, d1, d2, f1, f2) {
  const a = wallPt(side, d1, f1);
  const b = wallPt(side, d2, f1);
  const c = wallPt(side, d2, f2);
  const e = wallPt(side, d1, f2);
  return `M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]} L${e[0]},${e[1]} Z`;
}

function Alley({ layer }) {
  const on = (g) => layer === g;
  const base = layer === "base";
  const floorY = (d) => NEAR_B - (NEAR_B - FAR_B) * d;
  return (
    <svg className="yk-alley" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="yk-wallL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0c070b" />
          <stop offset="0.7" stopColor="#1c0d17" />
          <stop offset="1" stopColor="#2a1222" />
        </linearGradient>
        <linearGradient id="yk-wallR" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#0b060a" />
          <stop offset="0.7" stopColor="#1d0c12" />
          <stop offset="1" stopColor="#2c121a" />
        </linearGradient>
        <linearGradient id="yk-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1022" />
          <stop offset="0.35" stopColor="#120810" />
          <stop offset="1" stopColor="#050304" />
        </linearGradient>
        <radialGradient id="yk-far" cx="0.5" cy="0.6" r="0.7">
          <stop offset="0" stopColor="#ff6ec7" stopOpacity="0.8" />
          <stop offset="0.5" stopColor="#7a1f5a" stopOpacity="0.6" />
          <stop offset="1" stopColor="#1a0815" stopOpacity="1" />
        </radialGradient>
        <radialGradient id="yk-lantern" cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#fff0c8" />
          <stop offset="0.3" stopColor="#ff9a4a" />
          <stop offset="0.75" stopColor="#e8261a" />
          <stop offset="1" stopColor="#8e0d0a" />
        </radialGradient>
        <radialGradient id="yk-lanternglow">
          <stop offset="0" stopColor="#ff5a2a" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#ff2a1a" stopOpacity="0.12" />
          <stop offset="1" stopColor="#ff2a1a" stopOpacity="0" />
        </radialGradient>
        <filter id="yk-neon" x="-50%" y="-20%" width="200%" height="140%">
          <feGaussianBlur stdDeviation="1.1" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="yk-bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="yk-smear" x="-100%" y="-20%" width="300%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.22" numOctaves="2" seed="9" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="3.6 8" />
        </filter>
        <filter id="yk-ripple" x="-50%" y="-10%" width="200%" height="120%">
          <feGaussianBlur stdDeviation="1.2 0.6" />
        </filter>
        <mask id="yk-reflmask" maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill="url(#yk-reflfade)" />
        </mask>
        <linearGradient id="yk-panelshade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.25" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
        <filter id="yk-grime" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.12" numOctaves="3" seed="5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0" />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
        <linearGradient id="yk-reflfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {base && <rect width="390" height="844" fill="#070409" />}

      {on("c") && (
        <>
      {/* the far end: a lit street beyond, through haze */}
      <rect x={VP_L} y={FAR_T - 60} width={VP_R - VP_L} height={FAR_B - FAR_T + 60} fill="url(#yk-far)" />
        </>
      )}
      {on("a") && (
        <>
      <g opacity="0.8">
        <rect x="160" y="250" width="6" height="40" fill="#ff3fb4" filter="url(#yk-neon)" />
        <rect x="222" y="262" width="5" height="34" fill="#ff4a4a" filter="url(#yk-neon)" />
        <rect x="186" y="300" width="18" height="4" fill="#ffd0ee" filter="url(#yk-neon)" />
      </g>

        </>
      )}

      {base && (
        <>
      {/* walls */}
      <path d={`M0,${NEAR_T} L${VP_L},${FAR_T} L${VP_L},${FAR_B} L0,${NEAR_B} Z`} fill="url(#yk-wallL)" />
      <path d={`M390,${NEAR_T} L${VP_R},${FAR_T} L${VP_R},${FAR_B} L390,${NEAR_B} Z`} fill="url(#yk-wallR)" />
      <path d={`M0,${NEAR_T} L${VP_L},${FAR_T} L${VP_L},${FAR_B} L0,${NEAR_B} Z`} fill="#fff" filter="url(#yk-grime)" opacity="0.5" style={{ mixBlendMode: "multiply" }} />
      <path d={`M390,${NEAR_T} L${VP_R},${FAR_T} L${VP_R},${FAR_B} L390,${NEAR_B} Z`} fill="#fff" filter="url(#yk-grime)" opacity="0.5" style={{ mixBlendMode: "multiply" }} />

      {/* where the walls meet the ground, catching the wet light */}
      <path d={`M0,${NEAR_B} L${VP_L},${FAR_B} M390,${NEAR_B} L${VP_R},${FAR_B}`} stroke="#5a2040" strokeWidth="1.2" opacity="0.7" />
      <path d={`M${VP_L},${FAR_T} L${VP_L},${FAR_B} M${VP_R},${FAR_T} L${VP_R},${FAR_B}`} stroke="#3a1428" strokeWidth="1" opacity="0.8" />

      {/* wall clutter: drainpipes, AC units, a shuttered door, cable runs */}
      <g fill="#0e080c" stroke="#3a1a2c" strokeWidth="0.6">
        <path d={quad("L", 0.28, 0.3, 0, 1)} />
        <path d={quad("R", 0.36, 0.385, 0, 1)} />
        <path d={quad("L", 0.12, 0.3, 0.6, 0.98)} fill="#120a0f" />
        <path d={quad("R", 0.56, 0.68, 0.42, 0.56)} fill="#16101a" />
        <path d={quad("R", 0.2, 0.32, 0.5, 0.64)} fill="#16101a" />
      </g>
      {/* shutter slats on the door */}
      {Array.from({ length: 9 }, (_, i) => {
        const f = 0.62 + i * 0.04;
        const a = wallPt("L", 0.12, f);
        const b = wallPt("L", 0.3, f);
        return <path key={i} d={`M${a[0]},${a[1]} L${b[0]},${b[1]}`} stroke="#2a1622" strokeWidth="0.8" />;
      })}
      {/* AC unit fan grilles */}
      {[
        ["R", 0.26, 0.57],
        ["R", 0.62, 0.49],
      ].map(([side, d, f]) => {
        const [x, y] = wallPt(side, d, f);
        const s = scaleAt(d);
        return <circle key={d} cx={x} cy={y} r={9 * s} fill="none" stroke="#3a2030" strokeWidth={1.2 * s} />;
      })}
      {/* power lines slung across the top */}
      <g fill="none" stroke="#120a10" strokeWidth="1.2">
        <path d="M0,60 Q195,140 390,40" />
        <path d="M0,110 Q195,170 390,96" />
        <path d="M60,150 Q195,205 330,148" strokeWidth="0.8" />
      </g>

      {/* floor: wet asphalt, then the light lying on it */}
      <path d={`M0,${NEAR_B} L${VP_L},${FAR_B} L${VP_R},${FAR_B} L390,${NEAR_B} L390,844 L0,844 Z`} fill="url(#yk-floor)" />
      <path d={`M0,${NEAR_B} L${VP_L},${FAR_B} L${VP_R},${FAR_B} L390,${NEAR_B} L390,844 L0,844 Z`} fill="#fff" filter="url(#yk-grime)" opacity="0.35" style={{ mixBlendMode: "multiply" }} />
      {/* puddles: darker, glassier patches */}
      <g fill="#000" opacity="0.4">
        <ellipse cx="120" cy="700" rx="70" ry="10" />
        <ellipse cx="270" cy="640" rx="55" ry="7" />
        <ellipse cx="200" cy="520" rx="34" ry="4" />
      </g>

        </>
      )}

      {/* reflections of every sign and lantern, smeared down the wet ground */}
      <g>
        {SIGNS.map(([side, d, f1, f2, w, col, , , grp], i) => {
          if (!on(grp)) return null;
          const s = scaleAt(d);
          const [x0] = wallPt(side, d, f1);
          const width = w * 800 * s;
          const x = side === "L" ? x0 + 3 * s : x0 - 3 * s - width;
          const y = floorY(d);
          const len = (f2 - f1) * 800 * s * 1.15;
          const r = rnd(i * 31 + 7);
          // a wet-street reflection: the sign broken into horizontal dashes by
          // the ripples, each one jittered sideways and fading with distance
          const dashes = [];
          for (let k = 0, yy = 2 * s; yy < len; k++) {
            const fade = 1 - yy / len;
            const wob = (r() - 0.5) * width * 0.5;
            const ww = width * (0.5 + r() * 0.7);
            const hh = (1.2 + r() * 2.6) * s * (1 + yy / len);
            dashes.push(<rect key={k} x={x + width / 2 - ww / 2 + wob} y={y + yy} width={ww} height={hh} opacity={0.75 * fade} />);
            yy += hh + (1 + r() * 3) * s * (1 + yy / len);
          }
          return (
            <g key={`s${i}`} fill={SIGN_COL[col].glow} filter="url(#yk-ripple)">
              {dashes}
            </g>
          );
        })}
        {LANTERNS.map(([side, d, f, grp], i) => {
          if (!on(grp)) return null;
          const s = scaleAt(d);
          const [wx] = wallPt(side, d, f);
          const cx = side === "L" ? wx + 22 * s : wx - 22 * s;
          const y = floorY(d);
          return (
            <ellipse
              key={`l${i}`}
              cx={cx}
              cy={y + 40 * s}
              rx={5 * s}
              ry={34 * s}
              fill="#ff5a1a"
              opacity="0.45"
              filter="url(#yk-smear)"
            />
          );
        })}
        {on("c") && (
          <rect x={VP_L + 10} y={FAR_B} width={VP_R - VP_L - 20} height="160" fill="#ff5ab8" opacity="0.22" mask="url(#yk-reflmask)" filter="url(#yk-smear)" />
        )}
      </g>

      {/* signs and lanterns: far ones first so near ones overlap them */}
      {[...SIGNS]
        .filter((g) => on(g[8]))
        .sort((a, b) => b[1] - a[1])
        .map(([side, d, f1, f2, w, col, seed, cells, grp, kind]) => (
          <Sign key={seed} side={side} d={d} f1={f1} f2={f2} w={w} col={col} seed={seed} cells={cells} grp={grp} kind={kind} />
        ))}
      {[...LANTERNS]
        .filter((g) => on(g[3]))
        .sort((a, b) => b[1] - a[1])
        .map(([side, d, f, grp]) => (
          <Lantern key={`${side}${d}`} side={side} d={d} f={f} grp={grp} />
        ))}

      {/* the lantern string across the alley */}
      {on("a") && (() => {
        const [lx, ly] = wallPt("L", STRING_D, 0.22);
        const [rx2, ry2] = wallPt("R", STRING_D, 0.22);
        const s = scaleAt(STRING_D);
        const sag = 16 * s;
        const n = 5;
        const pts = Array.from({ length: n }, (_, i) => {
          const t = (i + 1) / (n + 1);
          return [lx + (rx2 - lx) * t, ly + (ry2 - ly) * t + 4 * sag * t * (1 - t)];
        });
        return (
          <g>
            <path d={`M${lx},${ly} Q${(lx + rx2) / 2},${ly + 2 * sag} ${rx2},${ry2}`} stroke="#140a0c" strokeWidth={1 * s} fill="none" />
            {pts.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y + 12 * s} r={26 * s} fill="url(#yk-lanternglow)" />
                <ellipse cx={x} cy={y + 12 * s} rx={9 * s} ry={11 * s} fill="url(#yk-lantern)" />
                <rect x={x - 5 * s} y={y} width={10 * s} height={2.2 * s} fill="#140808" />
                <rect x={x - 5 * s} y={y + 22 * s} width={10 * s} height={2.2 * s} fill="#140808" />
              </g>
            ))}
          </g>
        );
      })()}

      {base && (
        <>
      {/* haze down the alley */}
      <rect x="0" y="180" width="390" height="300" fill="url(#yk-far)" opacity="0.16" style={{ mixBlendMode: "screen" }} />
        </>
      )}
    </svg>
  );
}

/* ======================================================================
   THE MAN — front-facing, viewBox 200x400, feet on the bottom edge. Every
   animated group carries no transform attribute — a CSS transform would
   replace it.
   ====================================================================== */

// lantern red from his right (frame left), neon magenta from his left
const RED = "#ff6a52";
const MAG = "#ff5cc4";

function Yakuza3() {
  return (
    <svg className="yk-man" viewBox="0 0 200 400" aria-hidden>
      <defs>
        <filter id="yk-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="yk-softer" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id="yk-cloth" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.1 0" />
        </filter>
        <filter id="yk-pin" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0.3" dy="0.6" stdDeviation="0.4" floodColor="#000" floodOpacity="0.7" />
        </filter>
        {/* the white suit: warm white, shaded toward the lantern red on his
            right and the magenta on his left */}
        <linearGradient id="yk-suit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9a8a2" />
          <stop offset="0.18" stopColor="#f2e6e0" />
          <stop offset="0.5" stopColor="#fbf7f2" />
          <stop offset="0.82" stopColor="#eadde6" />
          <stop offset="1" stopColor="#c99ab8" />
        </linearGradient>
        <linearGradient id="yk-suit-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.7" stopColor="#5a3a48" stopOpacity="0" />
          <stop offset="1" stopColor="#5a3a48" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="yk-sleeveL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d49c95" />
          <stop offset="0.45" stopColor="#f6ede8" />
          <stop offset="1" stopColor="#cdbcc0" />
        </linearGradient>
        <linearGradient id="yk-sleeveR" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cfc0c6" />
          <stop offset="0.55" stopColor="#f3eaf0" />
          <stop offset="1" stopColor="#c690b4" />
        </linearGradient>
        <linearGradient id="yk-trouser" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cfa7a4" />
          <stop offset="0.35" stopColor="#f3ebe6" />
          <stop offset="0.65" stopColor="#ece2e4" />
          <stop offset="1" stopColor="#b993ad" />
        </linearGradient>
        <linearGradient id="yk-silk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a2430" />
          <stop offset="0.4" stopColor="#0c0a0e" />
          <stop offset="0.7" stopColor="#1e1822" />
          <stop offset="1" stopColor="#060507" />
        </linearGradient>
        <linearGradient id="yk-shoe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2c36" />
          <stop offset="0.35" stopColor="#120c10" />
          <stop offset="1" stopColor="#030203" />
        </linearGradient>
        <linearGradient id="yk-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ecc9a8" />
          <stop offset="0.45" stopColor="#ddb08c" />
          <stop offset="0.85" stopColor="#bd8c6c" />
          <stop offset="1" stopColor="#9b6b52" />
        </linearGradient>
        <linearGradient id="yk-hand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6bf9c" />
          <stop offset="0.5" stopColor="#cc9c7a" />
          <stop offset="1" stopColor="#9a6a50" />
        </linearGradient>
        <linearGradient id="yk-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2a36" />
          <stop offset="0.5" stopColor="#0c0c12" />
          <stop offset="1" stopColor="#050508" />
        </linearGradient>
        <linearGradient id="yk-nickel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2e8f0" />
          <stop offset="0.2" stopColor="#b9aeb8" />
          <stop offset="0.55" stopColor="#6a6070" />
          <stop offset="1" stopColor="#2a2430" />
        </linearGradient>
        <radialGradient id="yk-cuffshade" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#efe2e6" />
          <stop offset="0.6" stopColor="#b89aa8" />
          <stop offset="1" stopColor="#6a4a5c" />
        </radialGradient>
        <radialGradient id="yk-flashglow">
          <stop offset="0" stopColor="#fff3cf" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffb347" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>

        {/* irezumi: dragon scales, seigaiha waves */}
        <pattern id="yk-scales" width="4.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
          <rect width="4.2" height="3.2" fill="#2f7a72" />
          <path d="M0,3.2 A2.1,2.1 0 0 1 4.2,3.2" fill="#3f9a88" stroke="#0b1416" strokeWidth="0.55" />
          <path d="M-2.1,1.6 A2.1,2.1 0 0 1 2.1,1.6 M2.1,1.6 A2.1,2.1 0 0 1 6.3,1.6" fill="#367f74" stroke="#0b1416" strokeWidth="0.55" />
          <path d="M0.8,2.6 A1.3,1.3 0 0 1 3.4,2.6" fill="none" stroke="#9fe0c8" strokeWidth="0.3" opacity="0.7" />
        </pattern>
        <pattern id="yk-waves" width="6" height="3" patternUnits="userSpaceOnUse">
          <rect width="6" height="3" fill="#1e2f6e" />
          {[0, 6].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="3" r="3" fill="#1e2f6e" stroke="#0a0e22" strokeWidth="0.4" />
              <circle cx={cx} cy="3" r="2" fill="none" stroke="#7d9be0" strokeWidth="0.35" />
              <circle cx={cx} cy="3" r="1" fill="none" stroke="#7d9be0" strokeWidth="0.35" />
            </g>
          ))}
          <circle cx="3" cy="4.5" r="3" fill="#1e2f6e" stroke="#0a0e22" strokeWidth="0.4" />
          <circle cx="3" cy="4.5" r="2" fill="none" stroke="#7d9be0" strokeWidth="0.35" />
          <circle cx="3" cy="4.5" r="1" fill="none" stroke="#7d9be0" strokeWidth="0.35" />
        </pattern>

        <clipPath id="yk-torso-clip">
          <path d={TORSO_D} />
        </clipPath>
        <clipPath id="yk-chest-clip">
          <path d={CHEST_D} />
        </clipPath>
        <clipPath id="yk-ink-l">
          <path d={`${INK_EDGE_L} L84,140 L84,80 Z`} />
        </clipPath>
        <clipPath id="yk-ink-r">
          <path d={`${INK_EDGE_R} L116,140 L116,80 Z`} />
        </clipPath>
        <pattern id="yk-koi" width="4" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
          <rect width="4" height="3" fill="#d8301c" />
          <path d="M0,3 A2,2 0 0 1 4,3" fill="#e8481e" stroke="#2a0604" strokeWidth="0.5" />
          <path d="M-2,1.5 A2,2 0 0 1 2,1.5 M2,1.5 A2,2 0 0 1 6,1.5" fill="#e03a1c" stroke="#2a0604" strokeWidth="0.5" />
          <path d="M0.8,2.5 A1.2,1.2 0 0 1 3.2,2.5" fill="none" stroke="#ffb08a" strokeWidth="0.3" opacity="0.8" />
        </pattern>
        <clipPath id="yk-head-clip">
          <path d={HEAD_D} />
        </clipPath>
        <clipPath id="yk-neck-clip">
          <path d={NECK_D} />
        </clipPath>
      </defs>

      {/* ---- legs: white trousers, a knife crease, black patent shoes ---- */}
      {[
        { cls: "yk-leg-l", x: 0, m: 1 },
        { cls: "yk-leg-r", x: 200, m: -1 },
      ].map(({ cls, x, m }) => {
        const X = (v) => x + m * v;
        return (
          <g key={cls} className={`yk-leg ${cls}`}>
            {/* shoe: pointed patent oxford */}
            <path
              d={`M${X(74)},396 C${X(72)},389 ${X(76)},383 ${X(86)},382 C${X(96)},381 ${X(102)},384 ${X(102.5)},390 L${X(102.5)},396 Z`}
              fill="url(#yk-shoe)"
            />
            <path d={`M${X(73.6)},396 L${X(103)},396 L${X(103)},394 C${X(94)},394.8 ${X(83)},394.8 ${X(73.6)},394 Z`} fill="#000" />
            <path d={`M${X(78)},386 C${X(83)},383.6 ${X(90)},383.4 ${X(95)},384.2`} stroke={m > 0 ? RED : MAG} strokeWidth="1" fill="none" opacity="0.7" />
            <ellipse cx={X(84)} cy="388.6" rx="4" ry="0.9" fill="#fff" opacity="0.5" filter="url(#yk-soft)" />
            {/* trouser leg, slim, with a small break over the shoe */}
            <path
              d={`M${X(74)},206 C${X(74.5)},262 ${X(77)},330 ${X(78.6)},384 C${X(85)},386.4 ${X(94)},386.4 ${X(100)},384.4 C${X(100)},330 ${X(100.2)},262 ${X(100.6)},208 Z`}
              fill="url(#yk-trouser)"
            />
            <path d={`M${X(88.4)},214 C${X(88.6)},270 ${X(89)},330 ${X(89.4)},382`} stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.9" />
            <path d={`M${X(89.4)},214 C${X(89.6)},270 ${X(90)},330 ${X(90.4)},382`} stroke="#8a6a7a" strokeWidth="0.7" fill="none" opacity="0.5" />
            <path d={`M${X(75.4)},210 C${X(75.8)},262 ${X(78)},330 ${X(79.6)},382`} stroke="#5a3a48" strokeWidth="2.4" fill="none" opacity="0.35" filter="url(#yk-soft)" />
            <path d={`M${X(80)},374 C${X(85)},376.6 ${X(94)},376 ${X(99)},372.6`} stroke="#6a4a5a" strokeWidth="1.2" fill="none" opacity="0.4" filter="url(#yk-soft)" />
            <path d={`M${X(80)},379 C${X(86)},381 ${X(93)},380.6 ${X(99.4)},378`} stroke="#6a4a5a" strokeWidth="1" fill="none" opacity="0.35" filter="url(#yk-soft)" />
          </g>
        );
      })}
      <ellipse cx="100" cy="214" rx="28" ry="5" fill="#3a2230" opacity="0.4" filter="url(#yk-softer)" />

      {/* ---- off arm: a white sleeve, black silk cuff, a tattooed wrist and
           a hand missing the top joint of the little finger ---- */}
      <g className="yk-arm yk-arm-off">
        <path d="M135,90 C149,88 158,97 160,112 L163,194 C163,198 159,201 154,201 L144,202 C142,180 141,150 140,120 Z" fill="url(#yk-sleeveR)" />
        <path d="M141,142 C147,147 155,146 161.6,141 M141.6,150 C148,153.6 155,152.6 162,148.4" stroke="#7a5a6a" strokeWidth="1.2" fill="none" opacity="0.4" filter="url(#yk-soft)" />
        <path d="M157,104 C160,130 161,160 161.6,192" stroke={MAG} strokeWidth="1.4" fill="none" opacity="0.6" filter="url(#yk-soft)" />
        {/* three cuff buttons */}
        {[186, 190, 194].map((y) => (
          <circle key={y} cx="157.6" cy={y} r="0.9" fill="#d8ccd4" stroke="#7a6a74" strokeWidth="0.3" />
        ))}
        <path d="M143.6,197 L159.8,196.4 L160,204 L144,204.6 Z" fill="#0d0b0f" />
        <path d="M143.6,197 L159.8,196.4" stroke={MAG} strokeWidth="0.5" opacity="0.6" />
        {/* the tattooed wrist between cuff and hand */}
        <path d="M144.4,204.4 L159.8,203.8 L159.6,209 L144.6,209.6 Z" fill="url(#yk-waves)" />
        <g transform="translate(-1 -12)">
          <path d="M145.5,219 C144.5,225 145,231 147,236 L158.5,237 C160.5,231 161,225 159.5,218 Z" fill="url(#yk-hand)" />
          {/* curled fingers, the little finger (outermost) a joint short */}
          <path d="M147,235 C147,240 150,244.5 153.6,244.6 C156.2,244.6 157.4,242.4 157.6,240.6 L158.4,240.2 C159.6,239.4 160,237.8 159.8,236 Z" fill="url(#yk-hand)" />
          <path d="M150.5,237 C150.2,239.5 150.8,241.5 151.8,243.4 M153.8,237.2 C153.6,240 154,242 154.8,244 M157,237 C157,238.6 157.2,239.6 157.6,240.4" stroke="#6b4332" strokeWidth="0.7" fill="none" />
          <path d="M158.2,240.2 C158.9,239.8 159.3,239.2 159.4,238.4" stroke="#f2c8b0" strokeWidth="0.6" fill="none" opacity="0.8" />
          <path d="M147.2,235 C151,236.4 155,236.4 159.2,235" stroke={MAG} strokeWidth="0.6" fill="none" opacity="0.4" />
          <path d="M146.8,221 C143.2,223 141.6,228 142.5,233 C143.2,236.8 146.6,237.4 147.7,234.2 C148.2,230 148.4,226 148.7,222 Z" fill="url(#yk-hand)" />
          <path d="M148.4,223 C148,227 147.8,231 147.5,234" stroke="#6b4332" strokeWidth="0.8" fill="none" />
          <path d="M159.6,221 C160.6,227 160.4,232 159.4,235" stroke={MAG} strokeWidth="0.7" fill="none" opacity="0.6" />
        </g>
      </g>

      {/* ---- the jacket body ---- */}
      <path d={TORSO_D} fill="url(#yk-suit)" />
      <g clipPath="url(#yk-torso-clip)">
        <rect x="0" y="0" width="200" height="400" fill="url(#yk-suit-v)" />
        {/* tension folds radiating from the one fastened button */}
        <path d="M100,160 C90,152 78,146 64,144 M100,160 C110,152 122,146 136,144" stroke="#8a6a7a" strokeWidth="1.6" fill="none" opacity="0.35" filter="url(#yk-soft)" />
        <path d="M100,161 C88,166 76,166 62,162 M100,161 C112,166 124,166 138,162" stroke="#8a6a7a" strokeWidth="1.3" fill="none" opacity="0.3" filter="url(#yk-soft)" />
        <path d="M60,98 C58,120 58,150 59,190" stroke="#7a4a52" strokeWidth="3" fill="none" opacity="0.25" filter="url(#yk-soft)" />
        <path d="M140,98 C142,120 142,150 141,190" stroke="#7a4a72" strokeWidth="3" fill="none" opacity="0.25" filter="url(#yk-soft)" />
        {/* hip pocket flaps */}
        <path d="M60,184 L80,185.4 L80,190.6 L60,189.4 Z M140,184 L120,185.4 L120,190.6 L140,189.4 Z" fill="#e8dcdc" stroke="#8a6a7a" strokeWidth="0.5" />
        <path d="M60,189.4 L80,190.6 M140,189.4 L120,190.6" stroke="#6a4a5a" strokeWidth="0.8" opacity="0.6" />
        {/* breast pocket, a red silk square peaking out of it */}
        <path d="M122,134 L138,132.6" stroke="#8a6a7a" strokeWidth="0.9" />
        <path d="M124,134 L126.4,128.4 L128.6,133 L131,127.6 L133.4,132.6 L135.6,129 L137,133" fill="#d8141c" stroke="#7a0a0e" strokeWidth="0.4" />
        <path d="M126.4,128.6 L127.6,131.4 M131,127.8 L132,130.6" stroke="#ff8a7a" strokeWidth="0.4" opacity="0.8" />
        <rect x="0" y="0" width="200" height="400" filter="url(#yk-cloth)" />
        {/* the hem, and the fronts parting below the button */}
        <path d="M100,163 L93,214 L107,214 Z" fill="url(#yk-trouser)" />
        <path d="M100,163 L93,214 M100,163 L107,214" stroke="#6a4a5a" strokeWidth="1" opacity="0.6" />
        <path d="M100,163 L93,214" stroke="#fff" strokeWidth="0.5" opacity="0.6" transform="translate(-0.8 0)" />
      </g>

      {/* ---- the open shirt: black silk, and the chest under it ---- */}
      <path d="M87,84 L100,160 L113,84 Z" fill="url(#yk-silk)" />
      <path d="M90,86 L100,152 L110,86" stroke="#3a3040" strokeWidth="0.6" fill="none" opacity="0.6" />
      <path d={CHEST_D} fill="url(#yk-skin)" />
      <g clipPath="url(#yk-chest-clip)">
        {/* munewari: the ink covers each side of the chest and stops in a
            wavy edge, leaving a bare strip down the sternum */}
        <g clipPath="url(#yk-ink-l)">
          <rect x="84" y="80" width="20" height="60" fill="#121018" />
          <path d="M84,98 C88,96 92,99 95,96 M84,110 C88,108 91,112 95.6,109 M84,122 C88,120 91,124 96,121" stroke="#2c2a3c" strokeWidth="2.2" fill="none" />
          <path d="M90,84 C95,90 92,98 96,104 C98,108 95,116 97,124" stroke="#0b1416" strokeWidth="6.4" fill="none" strokeLinecap="round" />
          <path d="M90,84 C95,90 92,98 96,104 C98,108 95,116 97,124" stroke="url(#yk-scales)" strokeWidth="5.2" fill="none" strokeLinecap="round" />
          <path d="M90.6,86 C94.6,91 92.4,98 95.4,103" stroke="#e0b84a" strokeWidth="0.6" fill="none" />
          <path d="M92.6,112 C90.6,110 88.2,111.4 88.8,113.8 C87,114.8 87.8,118 90,117.6 C92.2,117.2 93.6,114.6 92.6,112 Z" fill="#e0441c" stroke="#0b0606" strokeWidth="0.5" />
          <rect x="84" y="125" width="20" height="16" fill="url(#yk-waves)" />
        </g>
        <g clipPath="url(#yk-ink-r)">
          <rect x="96" y="80" width="20" height="60" fill="#121018" />
          <path d="M116,100 C112,98 108,101 105,98 M116,114 C112,112 109,116 104.6,113" stroke="#2c2a3c" strokeWidth="2.2" fill="none" />
          {/* a koi's red scales and a flash of its fin */}
          <path d="M110,86 C105,92 107,100 104,106 C102,112 106,118 104,124" stroke="#0b0606" strokeWidth="6.4" fill="none" strokeLinecap="round" />
          <path d="M110,86 C105,92 107,100 104,106 C102,112 106,118 104,124" stroke="url(#yk-koi)" strokeWidth="5.2" fill="none" strokeLinecap="round" />
          <path d="M106,90 C109.6,88.6 112,90.6 111.4,93.4 C113.4,94 113,97 110.6,97 C108,97 106,94 106,90 Z" fill="#f2c94a" stroke="#0b0606" strokeWidth="0.5" />
          <rect x="96" y="126" width="20" height="16" fill="url(#yk-waves)" />
        </g>
        {/* the inked edges, outlined */}
        <path d={INK_EDGE_L} stroke="#0a0810" strokeWidth="0.7" fill="none" />
        <path d={INK_EDGE_R} stroke="#0a0810" strokeWidth="0.7" fill="none" />
        {/* skin shading over the ink: pecs, the sternum hollow */}
        <path d="M100,92 L100,130" stroke="#7a4a36" strokeWidth="1.2" opacity="0.35" filter="url(#yk-soft)" />
        <path d="M92,104 C95,107 98,107 99.4,106 M108,104 C105,107 102,107 100.6,106" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" filter="url(#yk-soft)" />
        <rect x="86" y="84" width="28" height="56" fill="url(#yk-chestform)" />
        <path d="M98,88 C97.6,100 98.4,116 99.4,128" stroke="#ffd8c0" strokeWidth="1.2" fill="none" opacity="0.35" filter="url(#yk-soft)" />
      </g>
      <defs>
        <linearGradient id="yk-chestform" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.5" />
          <stop offset="0.35" stopColor="#000" stopOpacity="0" />
          <stop offset="0.65" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* ---- peak lapels, with the shirt's wide collar laid out over them ---- */}
      <path d={LAPEL_L} fill="url(#yk-suit)" />
      <path d={LAPEL_R} fill="url(#yk-suit)" />
      <path d="M76,114 C82,128 92,146 100,158" stroke="#5a3a48" strokeWidth="2.2" fill="none" opacity="0.4" filter="url(#yk-soft)" transform="translate(-1.6 1)" />
      <path d="M124,114 C118,128 108,146 100,158" stroke="#5a3a48" strokeWidth="2.2" fill="none" opacity="0.4" filter="url(#yk-soft)" transform="translate(1.6 1)" />
      <path d="M90,86 L100,158 M110,86 L100,158" stroke="#6a4a5a" strokeWidth="0.8" fill="none" opacity="0.7" />
      <path d="M70,101 L80,110 L76,114 C82,128 92,146 100,158" stroke="#fff" strokeWidth="0.6" fill="none" opacity="0.9" />
      <path d="M130,101 L120,110 L124,114 C118,128 108,146 100,158" stroke="#fff" strokeWidth="0.6" fill="none" opacity="0.7" />
      <path d="M93,84 C88,88 83,94 79,101 L87,112 C89,104 92,96 96,90 Z" fill="url(#yk-silk)" />
      <path d="M107,84 C112,88 117,94 121,101 L113,112 C111,104 108,96 104,90 Z" fill="url(#yk-silk)" />
      <path d="M79,101 L87,112" stroke={RED} strokeWidth="0.6" opacity="0.6" />
      <path d="M121,101 L113,112" stroke={MAG} strokeWidth="0.6" opacity="0.6" />
      <path d="M93,84 C88,88 83,94 79,101 M107,84 C112,88 117,94 121,101" stroke="#4a4050" strokeWidth="0.8" fill="none" opacity="0.8" />
      {/* the one fastened button */}
      <circle cx="100" cy="161" r="1.9" fill="#e8e0e4" stroke="#6a5a64" strokeWidth="0.5" />
      <circle cx="99.6" cy="160.6" r="0.6" fill="#fff" />

      {/* the Maple Jiu Jitsu leaf, an enamel pin on his left lapel */}
      <g className="yk-patch">
        <image href={mapleLogo} x="111" y="113" width="10.5" height="10.6" preserveAspectRatio="xMidYMid meet" filter="url(#yk-pin)" />
      </g>

      {/* ---- the neck, ink climbing it from under the collar ---- */}
      <path d={NECK_D} fill="url(#yk-skin)" />
      <g clipPath="url(#yk-neck-clip)">
        <path d="M87,90 C87.6,86.6 89.2,84 91.6,82.6 C91.4,85 92,87.6 93.4,90 Z" fill="url(#yk-waves)" opacity="0.85" />
        <path d="M113,90 C112.4,86.6 110.8,84 108.4,82.6 C108.6,85 108,87.6 106.6,90 Z" fill="url(#yk-waves)" opacity="0.85" />
        <path d="M89,62 C94,74 106,74 111,62 L111,72 C106,78 94,78 89,72 Z" fill="#000" opacity="0.3" filter="url(#yk-soft)" />
        <path d="M95,74 C96,80 97,84 97,88 M105,74 C104,80 103,84 103,88" stroke="#000" strokeWidth="1" opacity="0.2" fill="none" />
      </g>

      {/* ---- the head ---- */}
      <path d="M84.6,45 C81.8,44.4 80.6,48 81.2,52 C81.8,56 83.6,58 85.6,57.4 Z" fill="url(#yk-skin)" />
      <path d="M115.4,45 C118.2,44.4 119.4,48 118.8,52 C118.2,56 116.4,58 114.4,57.4 Z" fill="url(#yk-skin)" />
      <path d="M83,48 C82.6,51 83.2,54 84.6,55.6" stroke="#8a5a44" strokeWidth="0.7" fill="none" />
      <path d="M117,48 C117.4,51 116.8,54 115.4,55.6" stroke="#8a5a44" strokeWidth="0.7" fill="none" />
      <path d={HEAD_D} fill="url(#yk-skin)" />
      <g clipPath="url(#yk-head-clip)">
        <rect x="80" y="10" width="40" height="76" fill="url(#yk-chestform)" opacity="0.7" />
        {/* close-cropped temples */}
        <path d="M83,30 C84.6,36 85,42 85.4,48 L83,48 Z M117,30 C115.4,36 115,42 114.6,48 L117,48 Z" fill="#1a1418" opacity="0.6" filter="url(#yk-soft)" />
        {/* lantern red down his right cheek, magenta down his left */}
        <path d="M85,40 C84.4,52 86,64 90,72" stroke={RED} strokeWidth="3" fill="none" opacity="0.4" filter="url(#yk-soft)" />
        <path d="M115,40 C115.6,52 114,64 110,72" stroke={MAG} strokeWidth="3" fill="none" opacity="0.45" filter="url(#yk-soft)" />
        {/* brow: a shaded mass, the brows thin and set low and level */}
        <path d="M86,42 C91,40 96,41 100,44 C104,41 109,40 114,42 L114,47 C109,45.4 104,46 100,48 C96,46 91,45.4 86,47 Z" fill="#8a5a42" opacity="0.4" filter="url(#yk-soft)" />
        <path d="M86.6,45.4 C89.6,43.6 93.6,43.4 97.6,45" stroke="#120c0c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M102.4,45 C106.4,43.4 110.4,43.6 113.4,45.4" stroke="#120c0c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* narrow, half-lidded eyes: the cold stare */}
        {[92.4, 107.6].map((cx, i) => {
          const o = i ? -1 : 1;
          return (
            <g key={cx}>
              <ellipse cx={cx} cy="50" rx="5.4" ry="2.6" fill="#7a4a36" opacity="0.5" filter="url(#yk-soft)" />
              <path
                d={`M${cx - 4 * o},50.2 C${cx - 2 * o},49 ${cx + 2 * o},48.8 ${cx + 4 * o},49.6 C${cx + 2 * o},51.2 ${cx - 2 * o},51.4 ${cx - 4 * o},50.2 Z`}
                fill="#d8cabc"
              />
              <circle cx={cx + 0.3 * o} cy="50.4" r="1.45" fill="#2a1a10" />
              <circle cx={cx + 0.3 * o} cy="50.4" r="0.7" fill="#050302" />
              <circle cx={cx + 0.9 * o} cy="49.9" r="0.32" fill="#fff0f6" />
              {/* the heavy upper lid, cutting across the top of the iris */}
              <path
                d={`M${cx - 4.4 * o},50.4 C${cx - 2 * o},48.4 ${cx + 2 * o},48.2 ${cx + 4.4 * o},49.4`}
                stroke="#140a08"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={`M${cx - 3 * o},49.4 C${cx - 1 * o},48.9 ${cx + 1.5 * o},48.9 ${cx + 3 * o},49.3`}
                stroke="#d8b090"
                strokeWidth="0.6"
                fill="none"
                opacity="0"
              />
              <path d={`M${cx - 3.4 * o},51.8 C${cx - 1.4 * o},52.3 ${cx + 1.4 * o},52.3 ${cx + 3.4 * o},51.6`} stroke="#8a5a44" strokeWidth="0.5" fill="none" opacity="0.7" />
            </g>
          );
        })}
        {/* a straight, narrow nose */}
        <path d="M99.6,50 C99.4,54 99.2,57 98.6,60" stroke="#ffe0c8" strokeWidth="1.1" fill="none" opacity="0.55" filter="url(#yk-soft)" />
        <path d="M101.8,51 C102.4,55 103.2,58 103.4,60.4" stroke="#8a5a44" strokeWidth="1.1" fill="none" opacity="0.5" filter="url(#yk-soft)" />
        <path d="M96.6,61.4 C98,62.8 102,62.8 103.4,61.4 C102.6,60.4 97.4,60.4 96.6,61.4 Z" fill="#9a6450" opacity="0.6" />
        <ellipse cx="98.3" cy="61.8" rx="0.9" ry="0.45" fill="#3a2016" />
        <ellipse cx="101.7" cy="61.8" rx="0.9" ry="0.45" fill="#3a2016" />
        {/* high cheekbones, hollow below */}
        <path d="M86.4,54 C88,58 90.6,60.6 93,61.6 M113.6,54 C112,58 109.4,60.6 107,61.6" stroke="#8a5a44" strokeWidth="1.8" fill="none" opacity="0.4" filter="url(#yk-soft)" />
        <path d="M87.4,52.4 C89,53.6 91,54 92.6,53.8 M112.6,52.4 C111,53.6 109,54 107.4,53.8" stroke="#ffd8c0" strokeWidth="1" fill="none" opacity="0.35" filter="url(#yk-soft)" />
        {/* the mouth: thin, set, the corners turned down */}
        <path d="M95.2,68.8 C97.8,68.5 102.2,68.5 104.8,68.8" stroke="#5a2a1e" strokeWidth="1.25" fill="none" strokeLinecap="round" />
        <path d="M96.4,70.8 C98.6,71.6 101.4,71.6 103.6,70.8" stroke="#f0c0a0" strokeWidth="0.7" fill="none" opacity="0.5" />
        <path d="M97,73.6 C99,74.4 101,74.4 103,73.6" stroke="#7a4632" strokeWidth="0.9" fill="none" opacity="0.5" filter="url(#yk-soft)" />
        <path d="M87,68 C91,77 96,80 100,80 C104,80 109,77 113,68" stroke="#000" strokeWidth="3" fill="none" opacity="0.3" filter="url(#yk-soft)" />
      </g>
      {/* ---- hair: slicked straight back, wet-combed, the neon in its shine ---- */}
      <path d={HAIR_D} fill="url(#yk-hair)" />
      <g fill="none" strokeLinecap="round">
        {[-10, -6, -2.4, 1, 4.4, 8].map((o, i) => (
          <path
            key={o}
            d={`M${100 + o * 1.25},${31 - Math.abs(o) * 0.12} C${100 + o * 1.45},${24} ${100 + o * 1.3},${17} ${100 + o * 0.95},${12.6}`}
            stroke={i % 2 ? "#4a4a5e" : "#36364a"}
            strokeWidth="0.5"
            opacity="0.5"
          />
        ))}
        <path d="M86,32 C86,22.6 92,15 100,13.6 C108,15 114,22.6 114,32" stroke={MAG} strokeWidth="1.6" opacity="0.45" filter="url(#yk-soft)" />
        <path d="M90,20 C94,16 104,15.4 109,18.6" stroke="#e8d8f0" strokeWidth="1" opacity="0.5" filter="url(#yk-soft)" />
        <path d="M84.4,36 C84.2,30 85.6,24 88,20" stroke={RED} strokeWidth="1" opacity="0.5" filter="url(#yk-soft)" />
      </g>

      {/* ---- gun arm, hanging, a nickel pistol pointed at the ground ---- */}
      <g className="yk-arm yk-arm-down">
        <path d="M65,90 C51,88 42,97 40,112 L37,194 C37,198 41,201 46,201 L56,202 C58,180 59,150 60,120 Z" fill="url(#yk-sleeveL)" />
        <path d="M38.6,140 C44,145 52,146 58.6,141 M38.4,148 C45,152 52,153 58,150" stroke="#7a5a6a" strokeWidth="1.2" fill="none" opacity="0.4" filter="url(#yk-soft)" />
        <path d="M43,104 C40,130 39,160 38.6,192" stroke={RED} strokeWidth="1.4" fill="none" opacity="0.6" filter="url(#yk-soft)" />
        {[186, 190, 194].map((y) => (
          <circle key={y} cx="42.4" cy={y} r="0.9" fill="#d8ccd4" stroke="#7a6a74" strokeWidth="0.3" />
        ))}
        <path d="M40.2,196.4 L56.4,197 L56,204.6 L39.8,204 Z" fill="#0d0b0f" />
        <path d="M40.2,196.4 L56.4,197" stroke={RED} strokeWidth="0.5" opacity="0.6" />
        <path d="M39.8,204 L56,204.6 L55.8,209.4 L40,208.8 Z" fill="url(#yk-waves)" />
        <g transform="translate(0 -10)">
          <path d="M45.2,232 L51.4,232 L51.2,260 C51.2,262 50,263 48.3,263 C46.6,263 45.4,262 45.4,260 Z" fill="url(#yk-nickel)" />
          <path d="M46.2,234 L46.4,260" stroke="#fff" strokeWidth="0.6" opacity="0.7" />
          <path d="M50.4,234 L50.2,260" stroke="#000" strokeWidth="0.6" opacity="0.6" />
          <path d="M51.3,236 C53.6,238 54,244 52.2,247 L51.3,247" fill="none" stroke="#2a2430" strokeWidth="1.3" />
          <ellipse cx="48.3" cy="262.6" rx="2.6" ry="0.9" fill="#0a0908" />
          <path d="M40.6,216 C39.4,223 39.8,231 41.6,237.5 L55.2,238 C56.6,231 56.8,223 55.6,215.5 Z" fill="url(#yk-hand)" />
          <path d="M41.2,221 C40.4,226 40.6,231 41.6,236 M41,224.5 L43.6,224.8 M41,228.6 L43.8,228.9 M41.4,232.6 L44,232.9" stroke="#6b4332" strokeWidth="0.7" fill="none" />
          <path d="M40.8,222 C40.2,226 40.4,230 41,233" stroke={RED} strokeWidth="0.7" fill="none" opacity="0.6" />
          <path d="M54.6,219 C57.4,222 57.6,230 55.4,236 C54,238.6 51,238.4 50.4,236 C50.4,231 51.2,225 52,220 Z" fill="url(#yk-hand)" />
          <path d="M52,221 C51.2,226 50.8,231 50.8,235.5" stroke="#6b4332" strokeWidth="0.7" fill="none" />
        </g>
      </g>

      {/* ---- gun arm, levelled at the camera ---- */}
      <g className="yk-arm-up">
        <g className="yk-recoil">
          {/* the white sleeve comes at the camera from his right shoulder */}
          <path d="M38,84 C40,68 54,61 65,65 C77,69 81,84 79,100 C78,112 71,119 60,119 C49,119 43,111 40,101 C38,95 37,89 38,84 Z" fill="url(#yk-sleeveL)" />
          <path d="M38.5,95 C43,106 56,111 70,105" stroke="#7a5a6a" strokeWidth="1.4" fill="none" opacity="0.45" filter="url(#yk-soft)" />
          <path d="M41,104 C47,113 60,116 73,109" stroke="#7a5a6a" strokeWidth="1.2" fill="none" opacity="0.4" filter="url(#yk-soft)" />
          <path d="M40,78 C42,70 50,65 58,65" stroke={RED} strokeWidth="2" fill="none" opacity="0.55" filter="url(#yk-soft)" />
          <path d="M44,70 C52,63 64,63 72,69" stroke="#fff" strokeWidth="1.4" fill="none" opacity="0.5" filter="url(#yk-soft)" />
          <g transform="translate(-38 2)">
            {/* suit cuff, black silk shirt cuff, the tattooed wrist */}
            <ellipse cx="100" cy="100" rx="15.4" ry="13.6" fill="url(#yk-cuffshade)" />
            <ellipse cx="100" cy="100" rx="15.4" ry="13.6" fill="none" stroke="#6a4a5a" strokeWidth="0.8" />
            <ellipse cx="100" cy="100.4" rx="14" ry="12.4" fill="#0d0b0f" />
            <ellipse cx="100" cy="100.6" rx="12.2" ry="10.8" fill="url(#yk-waves)" />
            <ellipse cx="100" cy="100.6" rx="12.2" ry="10.8" fill="none" stroke="#000" strokeWidth="1" opacity="0.4" />
            {/* the fist round the grip: three fingers on the front strap */}
            <path d="M88,90 C88,86 92,85 100,85 C108,85 112,86 112,90 L112,108 C112,113 107,115 100,115 C93,115 88,113 88,108 Z" fill="url(#yk-hand)" />
            {[92.5, 99.5, 106.5].map((y, i) => (
              <g key={y}>
                <path d={`M${89 + i * 0.6},${y} C94,${y + 1.6} 106,${y + 1.6} ${111 - i * 0.6},${y}`} stroke="#5a3424" strokeWidth="1.1" fill="none" />
                <path d={`M${91 + i},${y + 2.2} C96,${y + 3.2} 104,${y + 3.2} ${109 - i},${y + 2.2}`} stroke="#f4cfb2" strokeWidth="0.7" fill="none" opacity="0.6" />
              </g>
            ))}
            <path d="M88.4,92 C88,98 88.2,104 88.8,108" stroke={RED} strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M111.6,92 C112,98 111.8,104 111.2,108" stroke={MAG} strokeWidth="1" fill="none" opacity="0.6" />
            {/* thumb along the far side of the frame */}
            <path d="M110,84 C115,83 117,88 116,94 C115,98 112,99 110,97 Z" fill="url(#yk-hand)" />
            <path d="M111,85 C114,84.5 116,87 115.6,91" stroke="#5a3424" strokeWidth="0.7" fill="none" />
            {/* trigger guard, frame */}
            <path d="M92.5,80 L92.5,86 C92.5,90.5 107.5,90.5 107.5,86 L107.5,80" stroke="#6a6070" strokeWidth="2.3" fill="none" />
            <path d="M91,76 L109,76 L109,82 L91,82 Z" fill="#4a4250" />
            {/* nickel slide, end-on: polished face, the bore, front sight */}
            <rect x="89.5" y="61.5" width="21" height="15" rx="2.4" fill="url(#yk-nickel)" />
            <rect x="90.1" y="62.1" width="19.8" height="13.8" rx="2" fill="none" stroke="#fff" strokeWidth="0.4" opacity="0.6" />
            <path d="M90,70 L110,70" stroke={MAG} strokeWidth="0.6" opacity="0.5" />
            <circle cx="100" cy="67.6" r="3" fill="#3a3440" />
            <circle cx="100" cy="67.6" r="2.3" fill="#000" />
            <path d="M90.5,62.3 L109.5,62.3" stroke="#fff" strokeWidth="0.9" opacity="0.8" />
            <rect x="98.8" y="58.6" width="2.4" height="3.2" rx="0.4" fill="#2a2430" />
            {SHOTS.map((k) => (
              <g key={k} className={`yk-muzzle yk-muzzle-${k}`}>
                <circle cx="100" cy="67.6" r="22" fill="url(#yk-flashglow)" />
                <path d={FLASH_D} fill="#ffd27a" />
                <path d={FLASH_D} fill="#fff6dc" transform="translate(100 67.6) scale(0.55) translate(-100 -67.6)" />
                <circle cx="100" cy="67.6" r="3.6" fill="#ffffff" />
              </g>
            ))}
            {SHOTS.map((k) => (
              <rect key={k} className={`yk-casing yk-casing-${k}`} x="86" y="64" width="2.6" height="5.4" rx="0.7" fill="#c9a04a" />
            ))}
            <g className="yk-gunsmoke" fill="none" stroke="#e6d8e2" strokeLinecap="round" filter="url(#yk-softer)">
              <path className="yk-gs yk-gs-a" d="M100,62 C96,54 104,46 99,36 C95,28 102,20 98,10" strokeWidth="3" />
              <path className="yk-gs yk-gs-b" d="M100,62 C105,54 97,44 103,34 C108,26 101,18 105,8" strokeWidth="2.4" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

const SHOTS = [1, 2, 3];

// a ten-point burst round the muzzle, long and short rays alternating
const FLASH_D = (() => {
  const pts = [];
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 4.5 : i % 4 ? 13 : 18;
    pts.push(`${(100 + Math.cos(a) * r).toFixed(2)},${(67.6 + Math.sin(a) * r).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
})();

// a sharp single-breasted jacket, cut close, running to the hip
const TORSO_D =
  "M86,84 C72,84 61,88 56,98 C53,106 53,120 53,132 L54,202 C54,208 58,213 66,214 L134,214 C142,213 146,208 146,202 L147,132 C147,120 147,106 144,98 C139,88 128,84 114,84 Z";

// the skin in the open shirt: a narrow V down to the sternum
const CHEST_D = "M90.6,85 C94,86.4 106,86.4 109.4,85 L101.8,132 C100.9,133.8 99.1,133.8 98.2,132 Z";

// the wavy inner edges of the chest ink, top to bottom
const INK_EDGE_L = "M96.6,80 C95.4,86 97.4,90 96.4,96 C95.6,102 97.8,106 97,112 C96.4,118 98.4,122 98,128 L98,140";
const INK_EDGE_R = "M103.4,80 C104.6,86 102.6,90 103.6,96 C104.4,102 102.2,106 103,112 C103.6,118 101.6,122 102,128 L102,140";

// peak lapels from the collar to the button
const LAPEL_L = "M90,85 L100,158 C92,146 82,128 76,114 L80,110 L70,101 C76,93 83,87.6 90,85 Z";
const LAPEL_R = "M110,85 L100,158 C108,146 118,128 124,114 L120,110 L130,101 C124,93 117,87.6 110,85 Z";

const NECK_D = "M89,60 C89,70 88.4,80 87.6,90 L112.4,90 C111.6,80 111,70 111,60 Z";

// a lean face, a narrow jaw
const HEAD_D =
  "M83.2,40 C82.8,24 90,14 100,14 C110,14 117.2,24 116.8,40 C117.2,52 116,62 112.2,70 C108.6,77 104.4,80 100,80 C95.6,80 91.4,77 87.8,70 C84,62 82.8,52 83.2,40 Z";

// hair combed straight back off a hard hairline, a little volume on top
const HAIR_D =
  "M82.4,42 C81,25.6 88.6,11.6 100,11.6 C111.4,11.6 119,25.6 117.6,42 C116.8,36 115.2,31.6 112.4,29.8 C108.6,28.6 104,29.6 100,31.2 C96,29.6 91.4,28.6 87.6,29.8 C84.8,31.6 83.2,36 82.4,42 Z";
