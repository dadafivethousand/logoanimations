// Cowboy.js — the fourth take on Mafia's hook: a gunslinger at high noon.
//
// A frontier main street under a bleached sky — false-front timber buildings
// down both sides running to a vanishing point, porches throwing hard noon
// shadow, heat shimmer off the mesas at the end of the street. A gust of dust
// blows through and clears, and he is already standing there: a sun-faded
// cattleman hat whose brim puts his eyes in shadow (only a glint shows), a
// day of stubble and a moustache, a cigarillo, a red bandana, a leather vest
// under a long canvas duster with a shoulder cape, a cartridge belt slung low
// to a tied-down holster, tall boots with spurs. He draws from the hip and
// FAN-FIRES three rounds — the off hand slapping across the hammer each time.
// A revolver throws no casings: each round blows a smoke ring instead. Then a
// tumbleweed rolls through. The Maple Jiu Jitsu leaf is pinned where a star
// would be; the only word on screen is the SALOON sign.
//
// Built on Thug/Bratva's conventions: same cue machine, same 200x400 viewBox
// with the feet on the bottom edge, same shot machinery.
import React from "react";
import "../Stylesheets/Cowboy.css";
import usePhases from "../Utils/usePhases";
import mapleLogo from "../Images/maple-logo.png";

// p1 the dust gust clears and he is there, hand hovering over the holster
// p2 the draw: the gun comes up to the hip, the off hand comes across
// p3-p5 three fanned rounds: a slap across the hammer, flash, kick, a frame
//    flash and shake, a smoke ring
// p6 a tumbleweed rolls through behind the smoke
//
// Plays ONCE and holds — loopAt is null. Dust, shimmer, the duster's flap and
// the smoke keep moving on the held frame; that is ambient, not a restart.
const CUES = [40, 1250, 1620, 1920, 2220, 2650];

export default function Cowboy({ mode = "animated", loopAt = null }) {
  // ?static on the URL gives the still without editing App.js
  //   ?phase=N holds beat N as a still, for checking a pose
  const query = new URLSearchParams(window.location.search);
  const held = Number(query.get("phase")) || 0;
  const still = mode === "static" || query.has("static") || held > 0;
  const { phase: live, run, isStatic } = usePhases(CUES, { mode: still ? "static" : mode, loopAt });
  const phase = held ? Math.min(CUES.length, held) : live;

  return (
    <div className={`cb cb-p${phase} ${isStatic ? "is-static" : ""}`} key={run}>
      <div className="cb-world">
        <Street animate={!isStatic} />
        <div className="cb-drift cb-drift-a" aria-hidden />
        <div className="cb-drift cb-drift-b" aria-hidden />

        <div className="cb-card">
          <div className="cb-figbox">
            <div className="cb-shadow" aria-hidden />
            <div className="cb-stand">
              <Gunslinger animate={!isStatic} />
            </div>
          </div>
        </div>

        <div className="cb-tumble" aria-hidden>
          <div className="cb-tumble-hop">
            <div className="cb-tumble-roll">
              <Tumbleweed />
            </div>
          </div>
        </div>
        <div className="cb-dust" aria-hidden />
      </div>

      <div className="cb-gust" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="cb-flare" aria-hidden />
      <div className="cb-flash" aria-hidden />
      <div className="cb-vignette" aria-hidden />
      <div className="cb-grain" aria-hidden />
    </div>
  );
}

/* ====================================================================
   THE STREET — one-point perspective, drawn in a 390x844 sheet
   ==================================================================== */

const VX = 195;
const VY = 468;
const GROUND = 330;
const P = (X, Y, z) => [VX + X / z, VY + Y / z];
const pts = (list) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

// [z0, z1, top Y, colour, stepped]
const LEFT = [
  [1.0, 1.7, -600, "#8a6646", true],
  [1.7, 2.6, -470, "#a07a52", false],
  [2.6, 3.8, -540, "#7f5f42", true],
  [3.8, 5.6, -420, "#98744f", false],
  [5.6, 8.6, -480, "#8b6a4a", true],
  [8.6, 14, -380, "#a08060", false],
];
const RIGHT = [
  [1.0, 1.65, -500, "#a7804f", false],
  [1.65, 2.75, -640, "#94643e", true], // the saloon
  [2.75, 4.0, -430, "#b38c5f", false],
  [4.0, 6.0, -500, "#9a7450", true],
  [6.0, 9.2, -400, "#a88560", false],
  [9.2, 14.5, -440, "#9c7a57", true],
];

function facade(X, z0, z1, top, stepped) {
  const out = [P(X, top, z0)];
  if (stepped) {
    const za = z0 + (z1 - z0) * 0.28;
    const zb = z0 + (z1 - z0) * 0.72;
    out.push(P(X, top, za), P(X, top - 46, za), P(X, top - 46, zb), P(X, top, zb));
  }
  out.push(P(X, top, z1), P(X, GROUND, z1), P(X, GROUND, z0));
  return out;
}

// an affine fit of a small patch of facade, so a flat sign can be set on it
function facadeMatrix(X, Y, za, zb, h) {
  const [x0, y0] = P(X, Y, za);
  const [x1, y1] = P(X, Y, zb);
  const [x2, y2] = P(X, Y + h, za);
  return `matrix(${(x1 - x0).toFixed(3)} ${(y1 - y0).toFixed(3)} ${(x2 - x0).toFixed(3)} ${(y2 - y0).toFixed(3)} ${x0.toFixed(2)} ${y0.toFixed(2)})`;
}

function Building({ side, z0, z1, top, colour, stepped, index }) {
  const s = side === "L" ? -1 : 1;
  const X = s * 330; // the facade plane
  const Xp = s * 268; // the porch edge
  const lit = side === "R"; // noon sun from over the left roofs
  const span = z1 - z0;
  const planks = [];
  for (let k = 1; k < 14; k++) {
    const z = z0 + (span * k) / 14;
    const [ax, ay] = P(X, top, z);
    const [, by] = P(X, -175, z);
    planks.push(`M${ax.toFixed(1)},${ay.toFixed(1)} L${ax.toFixed(1)},${by.toFixed(1)}`);
  }
  const wins = [];
  if (top < -380) {
    [0.22, 0.62].forEach((f) => {
      const za = z0 + span * f;
      const zb = za + span * 0.2;
      wins.push(
        <g key={f}>
          <polygon points={pts([P(X, -340, za), P(X, -340, zb), P(X, -220, zb), P(X, -220, za)])} fill="#e9d6b3" />
          <polygon
            points={pts([P(X, -330, za + span * 0.015), P(X, -330, zb - span * 0.015), P(X, -228, zb - span * 0.015), P(X, -228, za + span * 0.015)])}
            fill={lit ? "#3d4450" : "#2a2622"}
          />
          <polygon
            points={pts([P(X, -330, za + span * 0.015), P(X, -330, za + span * 0.09), P(X, -228, za + span * 0.06), P(X, -228, za + span * 0.015)])}
            fill="#cfe0f0"
            opacity={lit ? 0.25 : 0.08}
          />
          <polygon points={pts([P(X, -226, za - span * 0.02), P(X, -226, zb + span * 0.02), P(X, -214, zb + span * 0.02), P(X, -214, za - span * 0.02)])} fill="#6b4c31" />
        </g>
      );
    });
  }
  const zd = z0 + span * 0.42;
  const posts = [z0 + span * 0.02, z0 + span * 0.5].map((z) => {
    const [px, py] = P(Xp, -150, z);
    const [, gy] = P(Xp, 296, z);
    const w = Math.max(1, 9 / z);
    return <rect key={z} x={px - w / 2} y={py} width={w} height={gy - py} fill={lit ? "#7a5636" : "#4e3622"} />;
  });

  return (
    <g>
      <polygon points={pts(facade(X, z0, z1, top, stepped))} fill={colour} />
      <path d={planks.join(" ")} stroke="#000" strokeOpacity="0.16" strokeWidth="0.8" />
      {/* cornice along the false front */}
      <polygon points={pts([P(X, top, z0), P(X, top, z1), P(X, top + 26, z1), P(X, top + 26, z0)])} fill="#000" opacity="0.22" />
      <polygon points={pts([P(X, top + 26, z0), P(X, top + 26, z1), P(X, top + 31, z1), P(X, top + 31, z0)])} fill="#fff" opacity="0.12" />
      {wins}
      {/* the porch: the facade under it in deep shade */}
      <polygon points={pts([P(X, -175, z0), P(X, -175, z1), P(X, GROUND, z1), P(X, GROUND, z0)])} fill="#1e130b" opacity={lit ? 0.42 : 0.55} />
      <polygon points={pts([P(X, -150, zd), P(X, -150, zd + span * 0.16), P(X, 296, zd + span * 0.16), P(X, 296, zd)])} fill="#140c07" opacity="0.7" />
      {/* boardwalk */}
      <polygon points={pts([P(X, 296, z0), P(X, 296, z1), P(Xp, 296, z1), P(Xp, 296, z0)])} fill={lit ? "#b48a5e" : "#8a6644"} />
      <polygon points={pts([P(Xp, 296, z0), P(Xp, 296, z1), P(Xp, GROUND, z1), P(Xp, GROUND, z0)])} fill="#3a2716" />
      {posts}
      {/* porch roof */}
      <polygon points={pts([P(X, -178, z0), P(X, -178, z1), P(Xp, -148, z1), P(Xp, -148, z0)])} fill={lit ? "#8e6a46" : "#5e4430"} />
      <polygon points={pts([P(Xp, -148, z0), P(Xp, -148, z1), P(Xp, -138, z1), P(Xp, -138, z0)])} fill="#2d1e12" />
      {/* the facade on the shaded side of the street sits in the roofs' shadow */}
      {!lit && <polygon points={pts(facade(X, z0, z1, top, stepped))} fill="#2a1a0e" opacity="0.32" />}
      {index === 1 && side === "R" && <SaloonSign X={X} z0={z0} z1={z1} />}
      {/* air between us and it: the farther the building, the more it fades
          into the bleached sky */}
      <polygon points={pts(facade(X, z0, z1, top, stepped))} fill="#f1e2c6" opacity={Math.min(0.62, 0.08 + (z0 - 1) * 0.07)} />
    </g>
  );
}

function SaloonSign({ X, z0, z1 }) {
  const span = z1 - z0;
  const za = z0 + span * 0.12;
  const zb = z0 + span * 0.88;
  const Y = -540;
  const h = 96;
  return (
    <g>
      <polygon points={pts([P(X, Y, za), P(X, Y, zb), P(X, Y + h, zb), P(X, Y + h, za)])} fill="#3b2414" />
      <polygon
        points={pts([P(X, Y + 8, za + span * 0.02), P(X, Y + 8, zb - span * 0.02), P(X, Y + h - 8, zb - span * 0.02), P(X, Y + h - 8, za + span * 0.02)])}
        fill="#e8d3a6"
      />
      <g transform={facadeMatrix(X, Y + 8, zb - span * 0.05, za + span * 0.05, h - 16)}>
        <text
          x="0.5"
          y="0.8"
          textAnchor="middle"
          fontSize="0.86"
          textLength="0.94"
          lengthAdjust="spacingAndGlyphs"
          fontFamily="Rockwell, 'American Typewriter', 'Courier New', Georgia, serif"
          fontWeight="900"
          fill="#7a1a12"
        >
          SALOON
        </text>
      </g>
    </g>
  );
}

function Street({ animate }) {
  // wheel ruts and hoof prints in the street, in perspective
  const ruts = [-118, -92, 92, 118].map((X) => {
    const [ax, ay] = P(X, GROUND, 0.9);
    const [bx, by] = P(X, GROUND, 40);
    return <path key={X} d={`M${ax},${ay} L${bx},${by}`} stroke="#6e4a28" strokeOpacity="0.32" strokeWidth="3" />;
  });
  const prints = Array.from({ length: 46 }, (_, i) => {
    const r = (n) => {
      const x = Math.sin(i * 61.7 + n * 19.3) * 43758.5453;
      return x - Math.floor(x);
    };
    const z = 1 + r(1) * 9;
    const X = (r(2) - 0.5) * 300;
    const [x, y] = P(X, GROUND, z);
    return <ellipse key={i} cx={x} cy={y} rx={7 / z} ry={2.6 / z} fill="#5a3a1e" opacity="0.22" />;
  });

  return (
    <svg className="cb-street" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="cb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9dbe4" />
          <stop offset="0.22" stopColor="#e6ebe4" />
          <stop offset="0.4" stopColor="#f7eedc" />
          <stop offset="0.56" stopColor="#efd9b2" />
        </linearGradient>
        <linearGradient id="cb-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e2c2" />
          <stop offset="0.3" stopColor="#e6c896" />
          <stop offset="1" stopColor="#c99660" />
        </linearGradient>
        <radialGradient id="cb-sun" cx="0.22" cy="-0.06" r="0.7">
          <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="0.35" stopColor="#fff6e0" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff6e0" stopOpacity="0" />
        </radialGradient>
        <filter id="cb-earth" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.06" numOctaves="4" seed="9" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.22  0 0 0 0 0.1  0 0 0 0.55 0" />
        </filter>
        <filter id="cb-haze" x="-5%" y="-30%" width="110%" height="160%">
          <feTurbulence type="turbulence" baseFrequency="0.02 0.09" numOctaves="2" seed="2" result="t">
            {animate && <animate attributeName="baseFrequency" dur="2.6s" values="0.02 0.09;0.024 0.11;0.02 0.09" repeatCount="indefinite" />}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="t" scale="3.2" />
        </filter>
        <linearGradient id="cb-farfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e2c4" stopOpacity="0" />
          <stop offset="1" stopColor="#f3e2c4" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      <rect width="390" height="844" fill="url(#cb-sky)" />
      <rect width="390" height="844" fill="url(#cb-sun)" />

      {/* mesas and the far end of town, wobbling in the heat */}
      <g filter="url(#cb-haze)">
        <path
          d="M0,470 L0,446 L22,444 L30,430 L64,428 L72,440 L118,442 L130,452 L160,452 L168,440 L206,438 L214,450 L250,452 L262,436 L300,432 L312,444 L346,446 L360,434 L390,432 L390,470 Z"
          fill="#d9b48f"
          opacity="0.75"
        />
        <path d="M150,470 L150,452 L162,452 L162,446 L172,446 L172,452 L184,452 L184,470 Z" fill="#b8916a" opacity="0.8" />
        <path d="M206,470 L206,449 L214,442 L222,449 L222,470 Z" fill="#b08965" opacity="0.8" />
        <path d="M213.6,442 L214,432 L214.4,442 Z" stroke="#9c7856" strokeWidth="1" opacity="0.8" />
        <rect x="0" y="420" width="390" height="52" fill="url(#cb-farfade)" />
      </g>

      {/* the street */}
      <rect x="0" y={VY} width="390" height={844 - VY} fill="url(#cb-ground)" />
      <rect x="0" y={VY} width="390" height={844 - VY} filter="url(#cb-earth)" />
      {ruts}
      {prints}
      <rect x="0" y={VY - 4} width="390" height="14" fill="#f6e6c8" opacity="0.7" />
      {/* heat glare where the street meets the sky */}
      <rect x="0" y={VY - 30} width="390" height="60" fill="#fff4dc" opacity="0.3" filter="url(#cb-haze)" />

      {/* both sides of the street, far to near */}
      {[...LEFT].reverse().map(([z0, z1, top, colour, stepped], i) => (
        <Building key={`L${z0}`} side="L" z0={z0} z1={z1} top={top} colour={colour} stepped={stepped} index={LEFT.length - 1 - i} />
      ))}
      {[...RIGHT].reverse().map(([z0, z1, top, colour, stepped], i) => (
        <Building key={`R${z0}`} side="R" z0={z0} z1={z1} top={top} colour={colour} stepped={stepped} index={RIGHT.length - 1 - i} />
      ))}

    </svg>
  );
}

/* ====================================================================
   THE GUNSLINGER — viewBox 200x400, feet on the bottom edge. Animated
   groups never carry a transform attribute; placement sits on a parent.
   ==================================================================== */

const SUN = "#fff1d2"; // the key, from high on his right (screen left)
const SHADE = "#2a170b";

function Gunslinger({ animate }) {
  return (
    <svg className="cb-man" viewBox="0 0 200 400" aria-hidden>
      <defs>
        <filter id="cb-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
        <filter id="cb-softer" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id="cb-weave" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.45" numOctaves="2" seed="5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.06  0 0 0 0 0.02  0 0 0 0.5 0" />
        </filter>
        <filter id="cb-stubble" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="1" seed="13" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.11  0 0 0 0 0.08  0 0 0 1.7 -0.6" />
        </filter>
        <filter id="cb-patchtone" x="-10%" y="-10%" width="120%" height="120%">
          <feColorMatrix type="matrix" values="0.95 0 0 0 0  0 0.92 0 0 0  0 0 0.86 0 0  0 0 0 1 0" />
          <feDropShadow dx="0.4" dy="0.7" stdDeviation="0.35" floodColor="#1a0d05" floodOpacity="0.85" />
        </filter>

        <linearGradient id="cb-canvas" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a68a68" />
          <stop offset="0.35" stopColor="#7e664c" />
          <stop offset="1" stopColor="#4a3a2a" />
        </linearGradient>
        <linearGradient id="cb-canvas-dk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5e4a36" />
          <stop offset="1" stopColor="#2e2318" />
        </linearGradient>
        <linearGradient id="cb-lining" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5c4129" />
          <stop offset="1" stopColor="#2e2014" />
        </linearGradient>
        <linearGradient id="cb-form" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff4dc" stopOpacity="0.18" />
          <stop offset="0.3" stopColor="#000" stopOpacity="0" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="cb-vest" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5e3822" />
          <stop offset="0.5" stopColor="#402414" />
          <stop offset="1" stopColor="#28160b" />
        </linearGradient>
        <linearGradient id="cb-shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1e6cf" />
          <stop offset="1" stopColor="#cbb994" />
        </linearGradient>
        <linearGradient id="cb-trouser" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6e5a46" />
          <stop offset="0.45" stopColor="#4c3c2c" />
          <stop offset="1" stopColor="#2a2016" />
        </linearGradient>
        <linearGradient id="cb-boot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a5232" />
          <stop offset="0.4" stopColor="#5e3218" />
          <stop offset="1" stopColor="#2c150a" />
        </linearGradient>
        <linearGradient id="cb-belt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a0683c" />
          <stop offset="0.5" stopColor="#7a4a26" />
          <stop offset="1" stopColor="#4c2b14" />
        </linearGradient>
        <linearGradient id="cb-holster" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6a3c1e" />
          <stop offset="0.5" stopColor="#4a2812" />
          <stop offset="1" stopColor="#2a1608" />
        </linearGradient>
        <linearGradient id="cb-brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0b0" />
          <stop offset="0.45" stopColor="#d6a63e" />
          <stop offset="1" stopColor="#8a6018" />
        </linearGradient>
        <linearGradient id="cb-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dba477" />
          <stop offset="0.5" stopColor="#c48658" />
          <stop offset="1" stopColor="#99613c" />
        </linearGradient>
        <linearGradient id="cb-hand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e0aa7c" />
          <stop offset="0.55" stopColor="#bd7f52" />
          <stop offset="1" stopColor="#8a5534" />
        </linearGradient>
        <linearGradient id="cb-felt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a48a6a" />
          <stop offset="0.5" stopColor="#7a634a" />
          <stop offset="1" stopColor="#4c3c2b" />
        </linearGradient>
        <linearGradient id="cb-brim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b59a76" />
          <stop offset="0.5" stopColor="#7d664c" />
          <stop offset="1" stopColor="#3a2c1e" />
        </linearGradient>
        <linearGradient id="cb-brimshade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c0d06" stopOpacity="0.94" />
          <stop offset="0.7" stopColor="#24120a" stopOpacity="0.9" />
          <stop offset="0.86" stopColor="#2a160c" stopOpacity="0.45" />
          <stop offset="1" stopColor="#2a160c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cb-bandana" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ef2a3e" />
          <stop offset="0.5" stopColor="#c4142b" />
          <stop offset="1" stopColor="#7c0a18" />
        </linearGradient>
        <radialGradient id="cb-steel" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#e6e2da" />
          <stop offset="0.35" stopColor="#9b968e" />
          <stop offset="0.8" stopColor="#4c4843" />
          <stop offset="1" stopColor="#2a2724" />
        </radialGradient>
        <linearGradient id="cb-walnut" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8683c" />
          <stop offset="0.5" stopColor="#6e3a1c" />
          <stop offset="1" stopColor="#3e1e0c" />
        </linearGradient>
        <radialGradient id="cb-flashglow">
          <stop offset="0" stopColor="#fff8e0" stopOpacity="1" />
          <stop offset="0.35" stopColor="#ffbe55" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cb-ember">
          <stop offset="0" stopColor="#fff0b0" />
          <stop offset="0.5" stopColor="#ff7a2a" />
          <stop offset="1" stopColor="#a02a0a" />
        </radialGradient>
        <clipPath id="cb-head-clip">
          <path d={HEAD_D} />
        </clipPath>
        <mask id="cb-jaw-mask" maskUnits="userSpaceOnUse" x="80" y="44" width="40" height="44">
          <path d="M87,57 C88.6,67 93.6,77 100,78.4 C106.4,77 111.4,67 113,57 C110,62 106,64 103,64.4 C101.6,63.6 98.4,63.6 97,64.4 C94,64 90,62 87,57 Z" fill="#fff" filter="url(#cb-soft)" />
        </mask>
      </defs>

      {/* ---- the back of the duster, hanging behind his legs ---- */}
      <g className="cb-tail">
        <path d="M54,190 C50,236 46,276 42,316 C56,321 70,321 76,318 C78,280 80,240 82,206 Z" fill="url(#cb-canvas-dk)" />
        <path d="M146,190 C150,236 154,276 158,316 C144,321 130,321 124,318 C122,280 120,240 118,206 Z" fill="url(#cb-canvas-dk)" />
        <path d="M78,206 L122,206 C124,240 126,280 127,316 C110,320 90,320 73,316 C74,280 76,240 78,206 Z" fill="#3a2918" />
        <path d="M44,300 C56,306 68,306 76,304 M156,300 C144,306 132,306 124,304" stroke="#000" strokeOpacity="0.25" strokeWidth="1.4" fill="none" filter="url(#cb-soft)" />
      </g>

      {/* ---- legs and boots (the right one is the left one, mirrored) ---- */}
      <Leg />
      <g transform="translate(200 0) scale(-1 1)">
        <Leg mirrored />
      </g>
      <path d="M100,214 C99.6,230 99.6,246 100,260" stroke="#000" strokeOpacity="0.35" strokeWidth="1.2" fill="none" filter="url(#cb-soft)" />

      {/* ---- shirt, then the leather vest over it ---- */}
      <path d={TORSO_D} fill="url(#cb-shirt)" />
      <path d="M100,90 L100,200" stroke="#a8946e" strokeWidth="0.7" />
      <Vest />
      <g transform="translate(200 0) scale(-1 1)">
        <Vest mirrored />
      </g>
      {/* buttons down the vest front, and a watch chain across */}
      {[140, 156, 172, 187].map((y) => (
        <g key={y}>
          <circle cx="96.6" cy={y} r="1.5" fill="url(#cb-brass)" />
          <circle cx="96.1" cy={y - 0.5} r="0.5" fill="#fff8d8" />
        </g>
      ))}
      <path d="M97,156 C104,165 113,168 121,163.5" stroke="#000" strokeOpacity="0.4" strokeWidth="1.2" fill="none" filter="url(#cb-soft)" />
      <path d="M97,155.4 C104,164.4 113,167.4 121,162.9" stroke="url(#cb-brass)" strokeWidth="0.9" strokeDasharray="1 0.5" fill="none" />
      {/* the Maple leaf pinned where a star would be */}
      <g className="cb-badge">
        <ellipse cx="124.5" cy="129.6" rx="8.8" ry="8.8" fill="#1a0d05" opacity="0.45" filter="url(#cb-soft)" />
        <image href={mapleLogo} x="116" y="120.6" width="17" height="17.2" preserveAspectRatio="xMidYMid meet" filter="url(#cb-patchtone)" />
      </g>

      {/* ---- the duster's open fronts, swept back off the holster ---- */}
      <Coat />
      <g transform="translate(200 0) scale(-1 1)">
        <Coat mirrored />
      </g>

      {/* ---- cartridge belt slung low to the holster side ---- */}
      <path d="M49,203 C70,206 88,204 100,202 C116,200 132,196 151,191 L152,200.5 C133,205.6 116,209.6 100,211.4 C88,213 70,215 49,212.6 Z" fill="url(#cb-belt)" />
      <path d="M49.4,204.8 C70,207.8 88,205.8 100,203.8 C116,201.8 132,197.8 151.2,192.8" stroke="#e8c08a" strokeWidth="0.5" fill="none" opacity="0.55" strokeDasharray="1.2 1" />
      {Array.from({ length: 15 }, (_, i) => {
        const x = 104 + i * 3;
        const y = 202.4 - (x - 100) * 0.22;
        return (
          <g key={i}>
            <rect x={x} y={y} width="2.2" height="7.2" rx="0.6" fill="#5e3618" />
            <rect x={x + 0.3} y={y - 2.4} width="1.6" height="3.2" rx="0.8" fill="url(#cb-brass)" />
          </g>
        );
      })}
      {Array.from({ length: 4 }, (_, i) => {
        const x = 78 + i * 3;
        const y = 204.6 - (x - 70) * 0.02;
        return (
          <g key={i}>
            <rect x={x} y={y} width="2.2" height="7.2" rx="0.6" fill="#5e3618" />
            <rect x={x + 0.3} y={y - 2.4} width="1.6" height="3.2" rx="0.8" fill="url(#cb-brass)" />
          </g>
        );
      })}
      <rect x="89.6" y="201.4" width="10.4" height="10" rx="1.2" fill="none" stroke="url(#cb-brass)" strokeWidth="1.8" />
      <path d="M94.8,202.6 L94.8,210.4" stroke="#c9a04a" strokeWidth="0.9" />

      {/* ---- holster, tied down round the thigh ---- */}
      <path d="M57,211 L77,208.6 L80,228 C81,243 79,256 75.6,266 C72.4,270.6 66,270.6 64,266 C60.6,253 58.6,234 57,211 Z" fill="url(#cb-holster)" />
      <path d="M59.6,214 L75,212 L77.4,229 C78.2,242 76.6,254 73.8,262.6" stroke="#e6bf8c" strokeWidth="0.55" strokeDasharray="1.2 0.9" fill="none" opacity="0.7" />
      <path d="M58,214 C60,236 62,254 64.6,265.6" stroke="#000" strokeWidth="1.6" fill="none" opacity="0.4" filter="url(#cb-soft)" />
      <path d="M74,256 C82,261.6 91,262 98,257.6" stroke="#3a2010" strokeWidth="1.8" fill="none" />
      <path d="M74,255.2 C82,260.8 91,261.2 98,256.8" stroke="#c48a56" strokeWidth="0.5" fill="none" opacity="0.6" />
      <path d="M98,257.6 C99,262 98,266 96.6,268" stroke="#3a2010" strokeWidth="1.2" fill="none" />
      {/* the gun, holstered: walnut grip and hammer spur over the holster mouth */}
      <g className="cb-holstered">
        <path d="M59.4,212.4 C57.6,204 58.6,197 61.6,192.4 L71,192 C73,197 73.4,205 72.2,211 Z" fill="url(#cb-walnut)" />
        <path d="M61.4,196 C60.6,201 60.8,206 61.8,210" stroke="#d99a62" strokeWidth="0.7" fill="none" opacity="0.6" />
        <circle cx="66" cy="203" r="0.7" fill="#d8d2c6" />
        <path d="M65.4,192.2 L68.6,186.8 L71.2,188.6 L70.4,192 Z" fill="url(#cb-steel)" />
        <rect x="59" y="209.6" width="14" height="3.2" rx="1" fill="url(#cb-steel)" />
      </g>

      {/* ---- arms hanging, before the draw ---- */}
      <g className="cb-arm cb-arm-down">
        <HangingArm gunHand />
      </g>
      <g className="cb-arm cb-arm-off">
        <g transform="translate(200 0) scale(-1 1)">
          <HangingArm />
        </g>
      </g>

      {/* ---- the shoulder cape of the duster ---- */}
      <Cape />
      <g transform="translate(200 0) scale(-1 1)">
        <Cape mirrored />
      </g>

      {/* ---- collar, neck, bandana ---- */}
      <path d="M83.6,96 C81.6,88 82.6,80 86.4,74 L93,80.6 L100,83.6 L107,80.6 L113.6,74 C117.4,80 118.4,88 116.4,96 Z" fill="url(#cb-canvas)" />
      <path d="M86.4,74 L93,80.6 L100,83.6 L107,80.6 L113.6,74" stroke="#2e1e10" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M86.4,74 C82.6,80 81.6,88 83.6,96" stroke={SUN} strokeWidth="1" fill="none" opacity="0.55" />
      <path d="M91,66 C91,76 90,84 89,93 L111,93 C110,84 109,76 109,66 Z" fill="url(#cb-skin)" />
      <path d="M91,70 C95,79 105,79 109,70" stroke={SHADE} strokeWidth="3.4" fill="none" opacity="0.5" filter="url(#cb-soft)" />
      <path d="M86.4,88 L92.6,101 L96.6,91 Z M113.6,88 L107.4,101 L103.4,91 Z" fill="url(#cb-shirt)" />
      <path d="M88,84 C94,88.6 106,88.6 112,84 L113.4,92.4 C106,95.6 94,95.6 86.6,92.4 Z" fill="url(#cb-bandana)" />
      <path d="M89.6,90.4 C94,98 97,105 100,112.4 C103,105 106,98 110.4,90.4 C106,93.4 94,93.4 89.6,90.4 Z" fill="url(#cb-bandana)" />
      <path d="M93,94 C95.6,99 97.6,104 100,110 M107,94 C104.6,99 102.4,104 100,110" stroke="#5c0612" strokeWidth="0.8" fill="none" opacity="0.6" />
      <path d="M89,85.4 C94,89 106,89 111,85.4" stroke="#ff8a8a" strokeWidth="0.6" fill="none" opacity="0.5" />
      <ellipse cx="100" cy="92.6" rx="3.2" ry="2.4" fill="#a3101f" />
      <path d="M98.6,94 C97,98 96,101 95.6,104 M101.4,94 C102.6,97.6 103.6,100 104.6,102.6" stroke="#9a0e1c" strokeWidth="2" strokeLinecap="round" fill="none" />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <circle key={k} cx={92 + k * 3.2} cy={88.6 + Math.abs(k - 2.5) * 0.6} r="0.45" fill="#f6e1b8" opacity="0.7" />
      ))}

      {/* ---- the head ---- */}
      <Head animate={animate} />

      {/* ---- the hat ---- */}
      <Hat />

      {/* ---- gun arm at the hip, revolver end-on to the lens ---- */}
      <g className="cb-arm-up">
        <path d="M43,128 C39.6,146 39.4,164 42.6,180 C45,186 52,188.6 58.6,186 C61.6,166 63,146 63.4,130 Z" fill="url(#cb-canvas)" />
        <path d="M45,150 C50,153 56,153 61.6,150 M44,163 C49,166.6 56,166.6 61,163" stroke="#2e1e10" strokeWidth="1.2" fill="none" opacity="0.5" filter="url(#cb-soft)" />
        <path d="M44,132 C42,150 42,166 45,182" stroke={SUN} strokeWidth="1.4" fill="none" opacity="0.35" filter="url(#cb-soft)" />
        {/* forearm, foreshortened, coming forward and in to the gun */}
        <path d="M43,174 C39,188 46,204 60,214 C70,221 84,222 92,214.6 C89,201 75,185 60,174 Z" fill="url(#cb-canvas)" />
        <path d="M44,180 C46,194 53,206 64,213.6" stroke={SUN} strokeWidth="1.2" fill="none" opacity="0.4" filter="url(#cb-soft)" />
        <path d="M51,184 C57,196 65,204 74,209 M57,178 C64,189 71,196 80,202" stroke="#2e1e10" strokeWidth="1.5" fill="none" opacity="0.6" filter="url(#cb-soft)" />
        <ellipse cx="81" cy="213" rx="11" ry="8.8" fill="#3d2a16" />
        <ellipse cx="81" cy="213" rx="8.4" ry="6.6" fill="#1c1208" />
        <g className="cb-recoil">
          <g transform="translate(86 191) scale(1.32)">
            <Revolver />
          </g>
        </g>
        <g transform="translate(86 191)">
          <g className="cb-gunsmoke" fill="none" stroke="#efe6d6" strokeLinecap="round" filter="url(#cb-softer)">
            <path className="cb-gs cb-gs-a" d="M0,-6 C-4,-14 4,-22 -1,-32 C-5,-40 2,-48 -2,-58" strokeWidth="3.4" />
            <path className="cb-gs cb-gs-b" d="M0,-6 C5,-14 -3,-24 3,-34 C8,-42 1,-50 5,-60" strokeWidth="2.6" />
          </g>
          {SHOTS.map((k) => (
            <ellipse key={k} className={`cb-ring cb-ring-${k}`} cx="0" cy="0" rx="5.4" ry="4" fill="none" stroke="#fbf6ec" strokeWidth="2.6" filter="url(#cb-soft)" />
          ))}
        </g>
      </g>

      {/* ---- off arm, come across to fan the hammer ---- */}
      <g className="cb-arm-fan">
        <path d="M139.6,130 C138.6,148 141,166 146,182 C150,188 158,188.6 162.6,183 C163.6,164 162,146 159.6,128 Z" fill="url(#cb-canvas)" />
        <path d="M159.6,132 C161,150 162,166 161.6,180" stroke="#000" strokeOpacity="0.35" strokeWidth="2.4" fill="none" filter="url(#cb-soft)" />
        <path d="M141,152 C147,155.6 154,155.6 160.6,152 M142.6,166 C148,169.6 155,169.6 161.4,166" stroke="#2e1e10" strokeWidth="1.2" fill="none" opacity="0.5" filter="url(#cb-soft)" />
        <g className="cb-fan">
          <path d="M152,168 C142,172 112,179 94,180.6 C89,184 88.6,193 93,197.6 C112,198 141,195.6 160,192 C166,186 164,172 152,168 Z" fill="url(#cb-canvas)" />
          <path d="M150,170 C138,174 114,180 96,181.4" stroke={SUN} strokeWidth="1.2" fill="none" opacity="0.5" filter="url(#cb-soft)" />
          <path d="M140,190 C124,193 108,195 96,195.6" stroke="#2e1d0e" strokeWidth="1.6" fill="none" opacity="0.6" filter="url(#cb-soft)" />
          <ellipse cx="92.4" cy="189" rx="4.4" ry="8.6" fill="#33220f" />
          {/* the flat of the hand, fingers out toward the hammer */}
          <path d="M92,182 C85,180.4 77,180.6 70.6,182.2 C67.4,183.2 66.6,185.8 68.4,187.2 C72.6,189 80.6,189.6 86.6,191.8 C90,193 92.8,190.8 92.6,187.6 Z" fill="url(#cb-hand)" />
          <path d="M72,183.4 C77,183 82,183.4 87,184.4 M71.4,185.6 C76.4,185.8 81.6,186.4 86.4,187.6" stroke="#7a4426" strokeWidth="0.55" fill="none" opacity="0.8" />
          <path d="M70.6,182.2 C76,181 84,181 90,182" stroke={SUN} strokeWidth="0.7" fill="none" opacity="0.7" />
          <path d="M88.6,181 C86,177.6 82,176.8 79.6,178 C78.6,179.4 80,181 82.4,181.6 Z" fill="url(#cb-hand)" />
        </g>
      </g>
    </svg>
  );
}

function Leg({ mirrored }) {
  const lit = mirrored ? 0.15 : 0.5;
  return (
    <g>
      <path d="M76,205 C74,236 72,262 71.6,292 L70.4,336 L95.4,336 L96.2,292 C97.6,262 99,236 100,213 Z" fill="url(#cb-trouser)" />
      {/* the leg has a front: a lit knee, the shin, a crease where it bends */}
      <path d="M83,240 C82.6,260 82.6,280 83.4,300 C83.8,312 84,324 84,334" stroke="#a08870" strokeWidth="1.2" fill="none" opacity="0.22" filter="url(#cb-soft)" />
      <path d="M95.6,226 C94.6,250 94.6,280 95.2,330" stroke="#000" strokeWidth="2.2" fill="none" opacity="0.4" filter="url(#cb-soft)" />
      <path d="M76,322 C81,326 89,326 95,322.6 M73.6,312 C80,315.6 89,315 95.6,311" stroke="#1e150c" strokeWidth="1.2" fill="none" opacity="0.55" filter="url(#cb-soft)" />
      <path d="M77,212 C75,240 73.4,266 73,292" stroke={SUN} strokeWidth="1.6" fill="none" opacity={lit * 0.5} filter="url(#cb-soft)" />
      <path d="M78,280 C83,284 90,284 95,281 M78,292 C83,295 90,295 95.4,292" stroke="#2a1d10" strokeWidth="1.2" fill="none" opacity="0.5" filter="url(#cb-soft)" />
      <path d="M92,214 C88,226 86,238 86,250" stroke="#2a1d10" strokeWidth="1" fill="none" opacity="0.4" filter="url(#cb-soft)" />
      {/* boot shaft with a V-dip at the front, stitched, pull loops */}
      <path d="M68.2,332 L74.6,328.6 C78,329.8 80.4,333.6 82.6,337 C84.8,333.6 87,329.8 90.4,328.6 L96.6,332 C97,348 96.6,362 95.6,378 L69.4,378 C68.4,362 68,348 68.2,332 Z" fill="url(#cb-boot)" />
      <path d="M70.6,346 C75,342 80,342 82.4,350 C84.8,342 90,342 94.4,346 M71.6,359 C76,355 80.6,356 82.6,363 C84.6,356 89.4,355 93.6,359" stroke="#e0a870" strokeWidth="0.55" fill="none" opacity="0.6" />
      <path d="M70,334 C69.4,350 69.8,364 70.6,376" stroke={SUN} strokeWidth="1" fill="none" opacity={lit * 0.7} />
      <path d="M68.2,332 L74.6,328.6 C78,329.8 80.4,333.6 82.6,337 C84.8,333.6 87,329.8 90.4,328.6 L96.6,332" stroke="#1e0e06" strokeWidth="0.9" fill="none" />
      <path d="M69,329.4 C68.4,325 69.6,323 71.4,323 C72.6,323 73,325.6 72.8,329" stroke="#4a2410" strokeWidth="1.1" fill="none" />
      {/* the foot: a pointed toe toward the lens, an underslung heel */}
      <path d="M63.6,388.4 L65,394.6 L70.6,396 L70.6,386 Z" fill="#2e160a" />
      <path d="M68.6,374 C66.4,380 65.6,388 67.6,394.6 C74,397 89,397.4 96.6,395.6 C98.6,388 97.6,380 95.8,374 Z" fill="url(#cb-boot)" />
      <path d="M71,378 C70,384 70.2,390 71.6,393.4" stroke={SUN} strokeWidth="1.1" fill="none" opacity={lit} />
      <ellipse cx="82" cy="389" rx="6" ry="2.6" fill="#ffd9a8" opacity={lit * 0.35} filter="url(#cb-soft)" />
      <path d="M67.6,394.6 C74,397 89,397.4 96.6,395.6 L96.6,397.4 C89,399 74,398.8 67.4,396.4 Z" fill="#1a0c04" />
      <path d="M70,377 C77,379.4 88,379.4 95,377" stroke="#2a1408" strokeWidth="0.8" fill="none" opacity="0.7" />
      {/* spur: a strap over the instep, a star rowel off the heel */}
      <path d="M68.6,384.6 C76,382.4 88,382.4 95.6,384" stroke="#3a1e0c" strokeWidth="1.3" fill="none" />
      <path d="M66,389 L60.4,389" stroke="#b9b2a6" strokeWidth="1" />
      <g transform="translate(59 389)">
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d="M0,0 L0,-3.6" stroke="#d6d0c4" strokeWidth="0.7" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="1.1" fill="#a09a90" />
      </g>
    </g>
  );
}

function Vest({ mirrored }) {
  return (
    <g>
      <path d="M57.6,104 C63,95 75,90 88.6,88 C90.6,104 94.6,120 98.8,134 L99.2,196 L92.6,206.4 L57.4,197 C56.4,166 56.6,134 57.6,104 Z" fill="url(#cb-vest)" />
      <path d="M88.6,88 C90.6,104 94.6,120 98.8,134 L99.2,196" stroke={mirrored ? "#000" : "#c89a6a"} strokeWidth="0.8" fill="none" opacity={mirrored ? 0.5 : 0.55} />
      <path d="M62,104 C61,130 61,160 62,190" stroke="#e8b886" strokeWidth="3" fill="none" opacity={mirrored ? 0.04 : 0.12} filter="url(#cb-soft)" />
      <path d="M78,160 L90,157 M77.4,176 L89.6,173.6" stroke="#160b04" strokeWidth="1.3" />
      <path d="M78,159 L90,156 M77.4,175 L89.6,172.6" stroke="#c48a56" strokeWidth="0.45" opacity="0.5" />
      <path d="M57.6,104 C63,95 75,90 88.6,88" stroke="#e6b27e" strokeWidth="0.6" fill="none" opacity="0.4" strokeDasharray="1 0.8" />
    </g>
  );
}

function Coat({ mirrored }) {
  return (
    <g className={mirrored ? "cb-coat-r" : "cb-coat-l"}>
      <path d="M58,104 C51,120 49,160 48.6,196 C47,240 45,280 42.6,315 C50,318.6 60,319 68,316.4 C66,280 64,240 62.6,210 C61.8,172 63.6,134 70,98 C66,99 61.6,101 58,104 Z" fill="url(#cb-canvas)" />
      <path d="M70,98 C63.6,134 61.8,172 62.6,210 C64,240 66,280 68,316.4" stroke="url(#cb-lining)" strokeWidth="2.6" fill="none" />
      <path d="M52,140 C51,180 49.6,230 47,290" stroke={mirrored ? "#000" : SUN} strokeWidth={mirrored ? 3 : 2} fill="none" opacity={mirrored ? 0.25 : 0.3} filter="url(#cb-soft)" />
      <path d="M56,230 C58,256 60,284 60.6,312 M50,250 C53,270 54,292 53.6,314" stroke="#3a2614" strokeWidth="1.2" fill="none" opacity="0.4" filter="url(#cb-soft)" />
      <path d="M42.6,315 C50,318.6 60,319 68,316.4" stroke="#2a1a0c" strokeWidth="1" fill="none" />
      <rect x="0" y="0" width="200" height="400" fill="none" />
    </g>
  );
}

function Cape({ mirrored }) {
  return (
    <g>
      <path d="M87,82 C69,84 53,90 46,104 C41.6,114 40.6,126 41.6,138 C52,142.6 65,142.6 75.6,137.6 C79.6,121 83,102 89,88 Z" fill="url(#cb-canvas)" />
      <path d="M87,82 C69,84 53,90 46,104 C41.6,114 40.6,126 41.6,138 C52,142.6 65,142.6 75.6,137.6 C79.6,121 83,102 89,88 Z" fill="url(#cb-form)" />
      <path d="M86,83.4 C70,85.6 55,91.6 48.4,104" stroke={mirrored ? "#f3dcb6" : SUN} strokeWidth="1.4" fill="none" opacity={mirrored ? 0.35 : 0.75} />
      <path d="M43,135.6 C53,139.6 65,139.6 74.6,135" stroke="#e0b880" strokeWidth="0.5" strokeDasharray="1.2 0.9" fill="none" opacity="0.6" />
      <path d="M41.6,138 C52,142.6 65,142.6 75.6,137.6" stroke="#2a1a0c" strokeWidth="1.2" fill="none" opacity="0.7" />
      <path d="M58,96 C55,110 55,124 57,138 M70,92 C67,106 66,122 67.6,138" stroke="#3a2614" strokeWidth="1.1" fill="none" opacity="0.35" filter="url(#cb-soft)" />
    </g>
  );
}

function HangingArm({ gunHand }) {
  return (
    <g>
      <path d="M42.6,126 C40,150 39.6,176 41.6,198 C42,203.6 44,205 47,205 L60.6,205.4 C62.6,204 62.4,200 62.2,196 C62,176 62.6,152 64,128 Z" fill="url(#cb-canvas)" />
      <path d="M61,140 C59,160 59,180 60.6,198" stroke="#000" strokeOpacity="0.3" strokeWidth="2.2" fill="none" filter="url(#cb-soft)" />
      <path d="M44,150 C50,153.6 56,153.6 62,150" stroke="#2e1e10" strokeWidth="1.1" fill="none" opacity="0.45" filter="url(#cb-soft)" />
      <path d="M44,130 C42,156 42,180 44,200" stroke={SUN} strokeWidth="1.4" fill="none" opacity="0.32" filter="url(#cb-soft)" />
      <path d="M43,170 C49,174 56,174 62.4,170 M42.8,178 C49,181.6 56,181.6 62.4,178" stroke="#3a2614" strokeWidth="1.2" fill="none" opacity="0.5" filter="url(#cb-soft)" />
      <path d="M42,198 L62.2,199 L62,205.4 L42.4,204.4 Z" fill="url(#cb-lining)" />
      {/* the hand — over the gun, fingers loose and spread, ready */}
      <path d="M44.6,204 C43.4,212 43.8,219 45.6,224.6 L57.2,225.4 C59.2,219 59.6,212 58.6,203.6 Z" fill="url(#cb-hand)" />
      <path d="M45.6,224 C45.2,229 46.6,233 48,234.6 M49.4,224.8 C49.2,230 50.4,234 52,235.6 M53.2,225 C53.4,230 54.4,233.4 55.8,234.4" stroke="url(#cb-hand)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M45.6,224 C45.2,229 46.6,233 48,234.6 M49.4,224.8 C49.2,230 50.4,234 52,235.6 M53.2,225 C53.4,230 54.4,233.4 55.8,234.4" stroke="#7a4426" strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.6" transform="translate(1.4 0)" />
      <path d={gunHand ? "M57.8,207 C61.6,209.6 62.8,214.6 62,219 C61.4,221.6 59,221.6 58.2,219.4 Z" : "M57.8,207 C61,209.6 62,214 61.4,218 C60.8,220.4 58.6,220.6 58,218.6 Z"} fill="url(#cb-hand)" />
      <path d="M45,206 C44,212 44.2,218 45.4,223" stroke={SUN} strokeWidth="0.7" fill="none" opacity="0.55" />
      <path d="M46,213 C49,214 54,214 57.4,213" stroke="#7a4426" strokeWidth="0.5" fill="none" opacity="0.5" />
    </g>
  );
}

function Head({ animate }) {
  return (
    <g>
      {/* ears, half under the brim's shade */}
      <path d="M87.4,45 C84.4,44 82.8,47.4 83.2,51.6 C83.6,55.8 85.6,58 87.8,57.4 Z" fill="url(#cb-skin)" />
      <path d="M112.6,45 C115.6,44 117.2,47.4 116.8,51.6 C116.4,55.8 114.4,58 112.2,57.4 Z" fill="url(#cb-skin)" />
      <path d="M83.2,44 L88,44 L88,51 L83.2,50 Z M116.8,44 L112,44 L112,51 L116.8,50 Z" fill={SHADE} opacity="0.55" filter="url(#cb-soft)" />
      <path d="M85,48.6 C84.6,51.6 85.4,54.4 87,55.8" stroke="#7a4426" strokeWidth="0.7" fill="none" />

      <path d={HEAD_D} fill="url(#cb-skin)" />
      <g clipPath="url(#cb-head-clip)">
        <rect x="80" y="20" width="40" height="70" fill="url(#cb-form)" />
        {/* sideburns and hair at the temples */}
        <path d="M85.4,36 L88.8,36 L88.4,51 C87.4,51.8 86.4,51 86,49.4 Z M114.6,36 L111.2,36 L111.6,51 C112.6,51.8 113.6,51 114,49.4 Z" fill="#3a2414" opacity="0.75" />
        {/* the brim's shadow over the top half of the face */}
        <rect x="80" y="22" width="40" height="40" fill="url(#cb-brimshade)" />
        {/* eyes in that shadow: narrowed, only a glint */}
        {[93.4, 106.6].map((cx, i) => (
          <g key={cx}>
            <path d={`M${cx - 3.6},49.4 C${cx - 1.8},48.4 ${cx + 1.8},48.4 ${cx + 3.6},49.4 C${cx + 1.8},50.6 ${cx - 1.8},50.6 ${cx - 3.6},49.4 Z`} fill="#6a4e38" opacity="0.6" />
            <circle cx={cx + (i ? -0.3 : 0.3)} cy="49.5" r="1.1" fill="#14100c" />
            <circle cx={cx + (i ? 0.2 : 0.7)} cy="49.1" r="0.42" fill="#fff0d0" />
            <path d={`M${cx - 3.9},49.2 C${cx - 2},47.8 ${cx + 2},47.8 ${cx + 3.9},49.2`} stroke="#0c0604" strokeWidth="1.1" fill="none" />
            <path d={`M${cx - 4.4},45.6 C${cx - 2},44.6 ${cx + 2},44.8 ${cx + 4.4},${i ? 46.4 : 46}`} stroke="#1a0e06" strokeWidth="1.4" fill="none" opacity="0.8" />
          </g>
        ))}
        {/* nose: the bridge in shade, the tip in the sun */}
        <path d="M101.4,48 C102.4,52 103,55 103.4,58.6" stroke="#1a0c05" strokeWidth="1.2" fill="none" opacity="0.5" filter="url(#cb-soft)" />
        <path d="M97.4,57.6 C98.2,60.8 101.8,60.8 102.6,57.6 C104,59.4 103.8,62.4 101.8,63.2 C100.6,63.7 99.4,63.7 98.2,63.2 C96.2,62.4 96,59.4 97.4,57.6 Z" fill="#d79a6a" />
        <path d="M97.8,58.4 C98.6,60 100,60.6 101,60.4" stroke="#ffd0a0" strokeWidth="0.8" fill="none" opacity="0.8" />
        <ellipse cx="98.2" cy="63" rx="1.1" ry="0.55" fill="#4a2412" />
        <ellipse cx="101.8" cy="63" rx="1.1" ry="0.55" fill="#4a2412" />
        {/* the sun on his cheekbone and jaw below the shade line */}
        <ellipse cx="91" cy="60" rx="3.6" ry="2.2" fill="#ffd3a0" opacity="0.4" filter="url(#cb-soft)" />
        <path d="M90,61 C91,65 93,67 95,68 M110,61 C109,65 107,67 105,68" stroke="#7a4426" strokeWidth="1.2" fill="none" opacity="0.45" filter="url(#cb-soft)" />
        {/* stubble over the jaw, and a moustache */}
        <rect x="80" y="44" width="40" height="44" fill="#4a3020" opacity="0.5" mask="url(#cb-jaw-mask)" />
        <rect x="80" y="44" width="40" height="44" filter="url(#cb-stubble)" mask="url(#cb-jaw-mask)" />
        <path d="M92,66.4 C95,64.2 98.6,64.4 100,65.6 C101.4,64.4 105,64.2 108,66.4 C108.6,68.6 106.6,70 105,69 C103,68 101.6,67.6 100,67.8 C98.4,67.6 97,68 95,69 C93.4,70 91.4,68.6 92,66.4 Z" fill="#3a2414" />
        <path d="M93.6,66 C96,65 98.6,65.2 100,66.2" stroke="#8a6040" strokeWidth="0.5" fill="none" opacity="0.7" />
        {/* mouth: set hard, a cigarillo in the corner */}
        <path d="M95.4,70.6 C98,71.2 102,71.2 104.6,70.4" stroke="#4a2010" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        <path d="M96.6,72.6 C98.6,73.6 101.4,73.6 103.4,72.6" stroke="#e8ad7e" strokeWidth="0.8" fill="none" opacity="0.55" />
        <path d="M88.6,70 C91.6,76 96,78.6 100,78.6 C104,78.6 108.4,76 111.4,70" stroke="#2a1408" strokeWidth="3" fill="none" opacity="0.35" filter="url(#cb-soft)" />
        <path d="M99.4,75 L100.6,75" stroke="#6a3a20" strokeWidth="0.9" opacity="0.7" />
      </g>
      <path d="M86.6,38 C86,48 86.6,58 89.4,68" stroke={SUN} strokeWidth="0.9" fill="none" opacity="0.35" filter="url(#cb-soft)" />

      {/* the cigarillo, drooping from the corner of his mouth */}
      <path d="M104,70.8 L114.6,75.2" stroke="#2a1608" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M104,70.8 L114.6,75.2" stroke="#7a4e2a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M104.4,70.4 L113.8,74.4" stroke="#b07a48" strokeWidth="0.45" opacity="0.8" />
      <path d="M113.2,74.6 L114.8,75.3" stroke="#8f8a82" strokeWidth="1.6" strokeLinecap="round" />
      <circle className="cb-ember" cx="115.4" cy="75.6" r="1" fill="url(#cb-ember)" />
      <g className="cb-cigsmoke" fill="none" stroke="#efe8dc" strokeLinecap="round" filter="url(#cb-soft)">
        <path className="cb-wisp cb-wisp-a" d="M115.6,74.6 C113.6,70 117.6,66 115.6,61 C114,57 117,53 115.6,49" strokeWidth="1.1" />
        <path className="cb-wisp cb-wisp-b" d="M115.6,74.6 C118,70 114.6,66 117,61 C118.6,57 116,53 117.6,49" strokeWidth="0.9" />
      </g>
    </g>
  );
}

function Hat() {
  return (
    <g>
      {/* crown: a centre crease and two front pinches */}
      <path d="M77.6,37 C76.6,24 79.6,12 85.6,7.8 C89.6,5.4 95,8.6 100,10.6 C105,8.6 110.4,5.4 114.4,7.8 C120.4,12 123.4,24 122.4,37 C114,39.6 86,39.6 77.6,37 Z" fill="url(#cb-felt)" />
      <path d="M77.6,37 C76.6,24 79.6,12 85.6,7.8 C89.6,5.4 95,8.6 100,10.6 C105,8.6 110.4,5.4 114.4,7.8 C120.4,12 123.4,24 122.4,37 C114,39.6 86,39.6 77.6,37 Z" fill="url(#cb-form)" />
      <rect x="76" y="4" width="48" height="36" filter="url(#cb-weave)" opacity="0.45" clipPath="url(#cb-crown-clip)" />
      <path d="M93,9.6 C91.6,16 91.6,23 93.6,29.6 M107,9.6 C108.4,16 108.4,23 106.4,29.6" stroke="#2e2014" strokeWidth="1.6" fill="none" opacity="0.6" filter="url(#cb-soft)" />
      <path d="M100,10.8 C99.6,16 99.8,22 100.4,27" stroke="#2e2014" strokeWidth="1.2" fill="none" opacity="0.4" filter="url(#cb-soft)" />
      <path d="M85.6,7.8 C89.6,5.4 95,8.6 100,10.6" stroke={SUN} strokeWidth="1.2" fill="none" opacity="0.8" />
      <path d="M100,10.6 C105,8.6 110.4,5.4 114.4,7.8" stroke={SUN} strokeWidth="0.9" fill="none" opacity="0.45" />
      <path d="M80.4,14 C78.4,20 77.8,28 78.4,35" stroke={SUN} strokeWidth="1.2" fill="none" opacity="0.5" />
      {/* the band, sweat-dark, with a silver concho */}
      <path d="M77.8,32.4 C86,35 114,35 122.2,32.4 L122.4,37 C114,39.6 86,39.6 77.6,37 Z" fill="#3a2414" />
      <path d="M77.8,32.4 C86,35 114,35 122.2,32.4" stroke="#9a7048" strokeWidth="0.5" fill="none" opacity="0.6" />
      <circle cx="84.4" cy="35.4" r="1.6" fill="url(#cb-steel)" />
      {/* brim: curled up at the sides, dipping at the front; its underside
          shows below the front edge */}
      <path d="M51,37 C52.4,30.4 57,28 61.6,30.2 C73.6,36.4 87.6,39.4 100,39.4 C112.4,39.4 126.4,36.4 138.4,30.2 C143,28 147.6,30.4 149,37 C142.4,43.4 124,47.6 100,47.6 C76,47.6 57.6,43.4 51,37 Z" fill="url(#cb-brim)" />
      <path d="M53.6,38.6 C62,43.4 78,46.6 100,46.6 C122,46.6 138,43.4 146.4,38.6 C140,44.6 122,48.6 100,48.6 C78,48.6 60,44.6 53.6,38.6 Z" fill="#2a1c10" />
      <path d="M51,37 C52.4,30.4 57,28 61.6,30.2 C73.6,36.4 87.6,39.4 100,39.4 C112.4,39.4 126.4,36.4 138.4,30.2" stroke={SUN} strokeWidth="1.1" fill="none" opacity="0.75" />
      <path d="M138.4,30.2 C143,28 147.6,30.4 149,37" stroke={SUN} strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M58,40 C72,45.4 86,47 100,47.2" stroke="#000" strokeWidth="0.8" fill="none" opacity="0.4" />
      <defs>
        <clipPath id="cb-crown-clip">
          <path d="M77.6,37 C76.6,24 79.6,12 85.6,7.8 C89.6,5.4 95,8.6 100,10.6 C105,8.6 110.4,5.4 114.4,7.8 C120.4,12 123.4,24 122.4,37 C114,39.6 86,39.6 77.6,37 Z" />
        </clipPath>
      </defs>
    </g>
  );
}

// A single-action revolver seen straight down the barrel, drawn around the
// bore at (0,0): the barrel and the ejector housing under it, the cylinder
// behind with its chamber mouths, the hammer spur over the top strap, and
// the fist round the grip below.
function Revolver() {
  const chambers = [30, 90, 150, 210, 330].map((a) => {
    const r = (a * Math.PI) / 180;
    return [Math.cos(r) * 5.3, 6 + Math.sin(r) * 5.3];
  });
  return (
    <g>
      {/* the fist round the grip, trigger finger through the guard */}
      <path d="M-9.4,9 C-10,15.6 -9.4,22 -7.2,26.4 C-4,29 4,29 7.2,26.4 C9.4,22 10,15.6 9.4,9 Z" fill="url(#cb-hand)" />
      {[14, 19, 23.6].map((y, i) => (
        <g key={y}>
          <path d={`M${-9 + i * 0.5},${y} C-4,${y + 1.4} 4,${y + 1.4} ${9 - i * 0.5},${y}`} stroke="#6a3a1e" strokeWidth="0.75" fill="none" />
          <path d={`M${-7.6 + i * 0.6},${y + 1.6} C-3,${y + 2.6} 3,${y + 2.6} ${7.6 - i * 0.6},${y + 1.6}`} stroke="#f2c294" strokeWidth="0.5" fill="none" opacity="0.6" />
        </g>
      ))}
      <path d="M-9.2,10 C-9.8,16 -9.2,21 -7.6,25" stroke={SUN} strokeWidth="0.7" fill="none" opacity="0.6" />
      <path d="M-3.6,8 C-3.6,12.4 3.6,12.4 3.6,8" stroke="#3a3632" strokeWidth="1.3" fill="none" />
      {/* frame, then the cylinder */}
      <rect x="-3.8" y="-3" width="7.6" height="12" rx="1" fill="#3e3a36" />
      <circle cx="0" cy="6" r="8.4" fill="url(#cb-steel)" />
      <circle cx="0" cy="6" r="8.4" fill="none" stroke="#1e1c1a" strokeWidth="0.6" />
      {chambers.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="1.8" fill="#151311" />
          <circle cx={x} cy={y} r="1.15" fill="#8c8780" />
          <circle cx={x - 0.35} cy={y - 0.35} r="0.4" fill="#e4dfd6" />
        </g>
      ))}
      {/* hammer spur, cocked, over the top strap */}
      <path d="M-2.2,-4.2 L-0.4,-9 L1.4,-9 L2.4,-4.2 Z" fill="#4a4540" />
      <path d="M-0.4,-9 L1.4,-9" stroke="#d8d2c8" strokeWidth="0.5" />
      {/* barrel, ejector housing, front sight */}
      <circle cx="2.9" cy="3.5" r="1.7" fill="url(#cb-steel)" stroke="#1e1c1a" strokeWidth="0.4" />
      <circle cx="0" cy="0" r="3.6" fill="url(#cb-steel)" stroke="#1e1c1a" strokeWidth="0.5" />
      <circle cx="0" cy="0" r="2" fill="#050505" />
      <path d="M-2.8,-1.6 C-2,-2.8 -0.6,-3.3 0.8,-3.2" stroke="#fff6e4" strokeWidth="0.5" fill="none" opacity="0.8" />
      <rect x="-0.55" y="-5.4" width="1.1" height="2" rx="0.3" fill="#3a3632" />
      {SHOTS.map((k) => (
        <g key={k} className={`cb-muzzle cb-muzzle-${k}`}>
          <circle cx="0" cy="0" r="20" fill="url(#cb-flashglow)" />
          <path d={FLASH_D} fill="#ffd27a" />
          <path d={FLASH_D} fill="#fff6dc" transform="scale(0.55)" />
          <circle cx="0" cy="0" r="3.4" fill="#ffffff" />
        </g>
      ))}
    </g>
  );
}

function Tumbleweed() {
  // a ball of dry branches: many arcs round a loose circle
  const strokes = Array.from({ length: 64 }, (_, i) => {
    const r = (n) => {
      const x = Math.sin(i * 37.3 + n * 11.1) * 43758.5453;
      return x - Math.floor(x);
    };
    const a0 = r(1) * Math.PI * 2;
    const a1 = a0 + 0.8 + r(2) * 2.2;
    const rad = 18 + r(3) * 20;
    const cx = (r(4) - 0.5) * 14;
    const cy = (r(5) - 0.5) * 14;
    const x0 = cx + Math.cos(a0) * rad;
    const y0 = cy + Math.sin(a0) * rad;
    const x1 = cx + Math.cos(a1) * rad;
    const y1 = cy + Math.sin(a1) * rad;
    return (
      <path
        key={i}
        d={`M${x0.toFixed(1)},${y0.toFixed(1)} A${rad.toFixed(1)},${rad.toFixed(1)} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}`}
        stroke={i % 3 ? "#a87c48" : "#dcb67e"}
        strokeWidth={0.8 + r(6) * 1.2}
        fill="none"
      />
    );
  });
  return (
    <svg viewBox="-50 -50 100 100" className="cb-tumble-svg">
      <g opacity="0.95">{strokes}</g>
    </svg>
  );
}

const SHOTS = [1, 2, 3];

// a ten-point burst round the muzzle, long and short rays alternating
const FLASH_D = (() => {
  const out = [];
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 4.2 : i % 4 ? 12 : 17;
    out.push(`${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`);
  }
  return `M${out.join(" L")} Z`;
})();

const TORSO_D =
  "M84,86 C70,88 60,94 56,104 C53,112 53,124 54,136 L56,198 L144,198 L146,136 C147,124 147,112 144,104 C140,94 130,88 116,86 Z";

const HEAD_D =
  "M85.4,40 C85,30 91.6,24.6 100,24.6 C108.4,24.6 115,30 114.6,40 C115.2,51 114.8,60 112.8,67.4 C110.2,74.8 105.2,78.4 100,78.4 C94.8,78.4 89.8,74.8 87.2,67.4 C85.2,60 84.8,51 85.4,40 Z";
