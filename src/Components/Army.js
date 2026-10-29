// Army.js — the shooter hook cast as a soldier. Dusk over a burnt-out field:
// distant fires on the horizon, smoke, shattered trees. A parachute flare pops
// overhead and he is standing there in its light — helmet with goggles up,
// face paint, plate carrier, a belt-fed machine gun at the hip with the belt
// hanging out of the feed tray. He racks it, braces, and holds the trigger
// down: a sustained burst of flash, tracers and brass, then cease fire with
// the barrel glowing and smoke rolling off the muzzle. The Maple Jiu Jitsu
// leaf is his shoulder patch; no text.
//
// Same 200x400 viewBox and feet line as Thug and the rest of the series.
import React from "react";
import "../Stylesheets/Army.css";
import usePhases from "../Utils/usePhases";
import mapleLogo from "../Images/maple-logo.png";

// p1 the flare pops — a white frame, and he is there in its light
// p2 he racks the charging handle and drops into a brace
// p3 the burst: strobing muzzle flash, tracers, brass, the belt feeding, shake
// p4 cease fire: barrel glows, smoke rolls off the muzzle, brass on the ground
//
// Plays ONCE and holds. Fires, smoke, embers and the flare's drift keep running
// on the held frame — ambient, not a restart.
const CUES = [500, 1300, 1650, 3550];

export default function Army({ mode = "animated", loopAt = null }) {
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt });

  return (
    <div className={`ar ar-p${phase} ${isStatic ? "is-static" : ""}`} key={run}>
      <div className="ar-world">
        <div className="ar-sky" aria-hidden />
        <div className="ar-fires" aria-hidden>
          <span className="ar-fire ar-fire-a" />
          <span className="ar-fire ar-fire-b" />
          <span className="ar-fire ar-fire-c" />
          <span className="ar-fire ar-fire-d" />
        </div>
        <Ridge />
        <div className="ar-ground" aria-hidden />
        <div className="ar-flarelight" aria-hidden />
        <div className="ar-flare" aria-hidden>
          <div className="ar-chute" />
          <div className="ar-trail" />
          <div className="ar-flarecore" />
        </div>
        <div className="ar-smoke ar-smoke-a" aria-hidden />
        <div className="ar-smoke ar-smoke-b" aria-hidden />
        <div className="ar-smoke ar-smoke-c" aria-hidden />
        <div className="ar-embers" aria-hidden>
          {EMBERS.map((e, i) => (
            <span key={i} className="ar-ember" style={{ left: e[0], animationDuration: e[1], animationDelay: e[2] }} />
          ))}
        </div>

        <div className="ar-card">
          <div className="ar-figbox">
            <div className="ar-pool" aria-hidden />
            <div className="ar-walker">
              <div className="ar-shadow" aria-hidden />
              <div className="ar-stance">
                <Soldier />
              </div>
            </div>
          </div>
        </div>

        <div className="ar-dust" aria-hidden />
      </div>

      <div className="ar-cut" aria-hidden />
      <div className="ar-flash" aria-hidden />
      <div className="ar-vignette" aria-hidden />
      <div className="ar-grain" aria-hidden />
    </div>
  );
}

// left, duration, delay
const EMBERS = [
  ["14%", "6.4s", "-1.2s"],
  ["23%", "7.8s", "-4.6s"],
  ["37%", "5.6s", "-2.9s"],
  ["52%", "8.4s", "-0.4s"],
  ["63%", "6.9s", "-5.5s"],
  ["74%", "5.9s", "-3.3s"],
  ["86%", "7.2s", "-1.9s"],
  ["8%", "8.8s", "-6.6s"],
];

// The far edge of the field: a low ridge, shattered tree trunks, a broken wall
// stub and a run of wire pickets, all in one silhouette under the haze.
function Ridge() {
  return (
    <svg className="ar-ridge" viewBox="0 0 390 200" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="ar-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b5640" stopOpacity="0" />
          <stop offset="0.55" stopColor="#6b5640" stopOpacity="0.35" />
          <stop offset="1" stopColor="#2a241a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* far ridge, lighter: it sits deeper in the smoke */}
      <path
        d="M0,132 C50,122 90,130 140,120 C190,112 230,126 280,118 C320,112 350,122 390,116 L390,200 L0,200 Z"
        fill="#2c2820"
        opacity="0.85"
      />
      {/* near ridge with the dead trees and the wall */}
      <path
        d="M0,150 C40,140 80,146 120,138 C160,130 200,142 240,136 C290,128 330,140 390,132 L390,200 L0,200 Z
           M46,146 L48,84 L51,77 L50.5,95 L57,72 L54.5,100 L53,145 Z
           M70,145 L71.5,104 L68,96 L73.5,101 L75,88 L76,144 Z
           M296,134 L298,62 L301,56 L300.5,78 L308,60 L303,86 L304,133 Z
           M318,136 L319.5,98 L316,92 L321,95 L323,84 L323.5,135 Z
           M345,133 L346,110 L349,104 L349.5,132 Z
           M150,134 L150,116 L156,114 L157,119 L163,118 L164,124 L170,124 L170,133 Z"
        fill="#14130e"
      />
      {/* wire pickets and a coil, close to camera */}
      <g stroke="#100f0b" fill="none">
        <path d="M10,184 L11,160 M58,182 L58.5,158 M108,183 L108,161 M262,178 L263,156 M314,180 L314,157 M366,177 L367,155" strokeWidth="2" />
        <path
          d="M0,170 C6,162 14,162 16,170 C18,178 26,178 28,170 C30,162 38,162 40,170 C42,178 50,178 52,170 C54,162 62,162 64,170 C66,178 74,178 76,170 C78,162 86,162 88,170 C90,178 98,178 100,170 C102,162 110,162 112,170
             M256,166 C262,158 270,158 272,166 C274,174 282,174 284,166 C286,158 294,158 296,166 C298,174 306,174 308,166 C310,158 318,158 320,166 C322,174 330,174 332,166 C334,158 342,158 344,166 C346,174 354,174 356,166 C358,158 366,158 368,166 C370,174 378,174 380,166 C382,158 390,158 392,166"
          strokeWidth="0.9"
        />
      </g>
      <rect width="390" height="200" fill="url(#ar-haze)" />
    </svg>
  );
}

const LIT = "#fbe9cf";
const SHOTS = [1, 2, 3];

// ejected brass: horizontal throw, spin, start delay
const CASINGS = [
  ["-26px", "760deg", "0ms"],
  ["-14px", "-640deg", "-80ms"],
  ["-34px", "900deg", "-160ms"],
  ["-8px", "-820deg", "-240ms"],
  ["-22px", "700deg", "-320ms"],
  ["-40px", "-960deg", "-400ms"],
  ["-16px", "860deg", "-480ms"],
  ["-30px", "-720deg", "-560ms"],
];

// the pile of spent brass and links on the ground by his feet
const BRASS = [
  [70, 391, 20], [76, 393.4, -40], [82, 390.6, 75], [64, 394, 10], [88, 393, -15],
  [73, 395.2, 60], [79, 396, -70], [92, 395, 30], [67, 391.4, -55], [85, 396.6, 5],
  [58, 395.6, 80], [96, 392.6, -30], [61, 392.4, 45], [90, 390.8, -80],
];

// Front-facing, viewBox 200x400, feet on the bottom edge. Every animated group
// carries no transform attribute — a CSS transform would replace it.
function Soldier() {
  return (
    <svg className="ar-man" viewBox="0 0 200 400" aria-hidden>
      <defs>
        <pattern id="ar-camo" width="38" height="38" patternUnits="userSpaceOnUse" patternTransform="rotate(-18) scale(0.55)">
          <rect width="38" height="38" fill="#535739" />
          <path d="M2,6 C8,1 16,4 15,10 C14,16 6,15 3,12 Z" fill="#626142" />
          <path d="M20,2 C28,0 35,5 33,11 C31,15 24,13 21,9 Z" fill="#3a3e28" />
          <path d="M8,20 C15,16 24,19 22,26 C20,31 11,31 8,27 Z" fill="#6b6449" />
          <path d="M26,20 C32,18 38,24 36,30 C34,34 27,32 25,27 Z" fill="#30341f" />
          <path d="M0,30 C5,28 10,32 8,37 C6,40 1,39 0,36 Z" fill="#3a3e28" />
          <path d="M14,33 C19,31 23,34 21,38 L13,38 Z" fill="#626142" />
        </pattern>
        <linearGradient id="ar-form" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.6" />
          <stop offset="0.3" stopColor="#000" stopOpacity="0" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="ar-vshade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff2da" stopOpacity="0.1" />
          <stop offset="0.4" stopColor="#000" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="ar-carrier" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4f3b" />
          <stop offset="0.5" stopColor="#363a2b" />
          <stop offset="1" stopColor="#24271c" />
        </linearGradient>
        <linearGradient id="ar-pouch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#444937" />
          <stop offset="1" stopColor="#26291e" />
        </linearGradient>
        <linearGradient id="ar-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c59673" />
          <stop offset="0.5" stopColor="#b3845f" />
          <stop offset="1" stopColor="#8a5f44" />
        </linearGradient>
        <linearGradient id="ar-boot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f7853" />
          <stop offset="1" stopColor="#5a4930" />
        </linearGradient>
        <linearGradient id="ar-glove" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9c8662" />
          <stop offset="0.5" stopColor="#7d6a4c" />
          <stop offset="1" stopColor="#55472f" />
        </linearGradient>
        <linearGradient id="ar-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d6066" />
          <stop offset="0.25" stopColor="#2b2d31" />
          <stop offset="1" stopColor="#111214" />
        </linearGradient>
        <linearGradient id="ar-heat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff5a1a" stopOpacity="0" />
          <stop offset="0.4" stopColor="#ff6a1e" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffb040" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="ar-lens" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe3a6" />
          <stop offset="0.35" stopColor="#c27a26" />
          <stop offset="1" stopColor="#4a2a0c" />
        </linearGradient>
        <radialGradient id="ar-flashglow">
          <stop offset="0" stopColor="#fff6d8" stopOpacity="1" />
          <stop offset="0.3" stopColor="#ffc062" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ff6a12" stopOpacity="0" />
        </radialGradient>
        <filter id="ar-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="ar-softer" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
        <filter id="ar-patchtone" x="-10%" y="-10%" width="120%" height="120%">
          <feColorMatrix type="matrix" values="0.8 0 0 0 0  0 0.78 0 0 0  0 0 0.72 0 0  0 0 0 1 0" />
        </filter>
        <clipPath id="ar-face-clip">
          <path d={FACE_D} />
        </clipPath>
        <clipPath id="ar-helm-clip">
          <path d={HELM_D} />
        </clipPath>
      </defs>

      {/* ---- legs: camo trousers, knee pads, coyote boots; a wide stance ---- */}
      <Cloth d="M72,200 C70,260 66,320 64,376 L90,378 C92,320 97,262 101,202 Z" />
      <Cloth d="M99,202 C103,262 108,320 110,378 L136,376 C134,320 130,260 128,200 Z" />
      {/* cargo pockets on the thighs */}
      <path d="M68.5,244 L82,243 L82.5,270 C78,272.5 72,272.5 68,270 Z" fill="#000" opacity="0.28" />
      <path d="M68.5,244 L82,243 L82,249 L68.5,250 Z" fill="#000" opacity="0.3" />
      <path d="M118,243 L131.5,244 L132,270 C128,272.5 122,272.5 117.5,270 Z" fill="#000" opacity="0.28" />
      <path d="M118,243 L131.5,244 L131.5,250 L118,249 Z" fill="#000" opacity="0.3" />
      {/* knee pads */}
      {[[80.5, 296], [120, 296]].map(([cx, cy]) => (
        <g key={cx}>
          <path d={`M${cx - 12},${cy - 9} C${cx - 8},${cy - 13} ${cx + 8},${cy - 13} ${cx + 12},${cy - 9} L${cx + 11},${cy + 9} C${cx + 6},${cy + 13} ${cx - 6},${cy + 13} ${cx - 11},${cy + 9} Z`} fill="#25281d" />
          <path d={`M${cx - 10},${cy - 8.6} C${cx - 6},${cy - 11.6} ${cx + 6},${cy - 11.6} ${cx + 10},${cy - 8.6}`} stroke={LIT} strokeWidth="0.9" fill="none" opacity="0.28" />
          <path d={`M${cx - 12},${cy + 1} L${cx + 12},${cy + 1}`} stroke="#121409" strokeWidth="1.6" />
        </g>
      ))}
      {/* trousers bloused into the boots */}
      <path d="M64,368 C72,372 84,372 90,369" stroke="#000" strokeWidth="1.6" fill="none" opacity="0.6" filter="url(#ar-soft)" />
      <path d="M110,369 C118,372 128,372 136,368" stroke="#000" strokeWidth="1.6" fill="none" opacity="0.6" filter="url(#ar-soft)" />
      {[
        "M58,396 C57,386 60,375 66,372 L90,373 C93,378 95,386 94,396 Z",
        "M106,396 C105,386 107,378 110,373 L134,372 C140,375 143,386 142,396 Z",
      ].map((d, i) => (
        <g key={d}>
          <path d={d} fill="url(#ar-boot)" />
          <path d={i ? "M105.6,396 L142.4,396 L142.2,391.4 C130,393 118,393 105.6,391.4 Z" : "M57.6,396 L94.4,396 L94.4,391.4 C82,393 70,393 57.8,391.4 Z"} fill="#2a2620" />
          <path d={i ? "M112,377 L132,376 M112.4,380.5 L132.6,379.6 M113,384 L133.6,383.2" : "M68,376 L88,377 M67.4,379.6 L87.6,380.5 M66.4,383.2 L87,384"} stroke="#3c3022" strokeWidth="0.8" />
          <ellipse cx={i ? 126 : 74} cy="386" rx="6" ry="1.4" fill={LIT} opacity="0.2" filter="url(#ar-soft)" />
        </g>
      ))}

      {/* ---- neck ---- */}
      <path d="M90,70 L110,70 L112,94 L88,94 Z" fill="url(#ar-skin)" />
      <path d="M90,78 C95,82 105,82 110,78 L111,90 L89,90 Z" fill="#000" opacity="0.3" />

      {/* ---- shirt, then the plate carrier over it ---- */}
      <Cloth d={TORSO_D} />
      {/* collar points */}
      <path d="M88,84 L99,96 L92,98 L84,88 Z" fill="url(#ar-camo)" />
      <path d="M112,84 L101,96 L108,98 L116,88 Z" fill="url(#ar-camo)" />
      <path d="M88,84 L99,96 L92,98 L84,88 Z M112,84 L101,96 L108,98 L116,88 Z" fill="#000" opacity="0.25" />

      {/* shoulder straps */}
      <path d="M70,98 L74,84 C78,82 84,82 88,85 L90,98 Z" fill="url(#ar-carrier)" />
      <path d="M130,98 L126,84 C122,82 116,82 112,85 L110,98 Z" fill="url(#ar-carrier)" />
      <path d="M74.5,84.5 C78,82.8 84,82.8 87.6,85.2 M125.5,84.5 C122,82.8 116,82.8 112.4,85.2" stroke={LIT} strokeWidth="0.8" fill="none" opacity="0.3" />
      <path d="M71,99 L74.6,86 M129,99 L125.4,86 M89,98 L87.2,86.4 M111,98 L112.8,86.4" stroke="#1c1e15" strokeWidth="0.5" strokeDasharray="1 0.8" />

      <path d={CARRIER_D} fill="url(#ar-carrier)" />
      <path d={CARRIER_D} fill="url(#ar-form)" />
      {/* MOLLE webbing rows */}
      {[110, 118, 126, 134, 142].map((y) => (
        <g key={y}>
          <path d={`M66,${y} L134,${y}`} stroke="#1f2218" strokeWidth="2.6" strokeDasharray="7 1.6" />
          <path d={`M66,${y - 1.2} L134,${y - 1.2}`} stroke={LIT} strokeWidth="0.4" strokeDasharray="7 1.6" opacity="0.14" />
        </g>
      ))}
      <path d="M68,96 C76,92 86,92 90,96 L110,96 C114,92 124,92 132,96" stroke={LIT} strokeWidth="0.9" fill="none" opacity="0.32" />
      {/* three magazine pouches across the front, flaps and pull tabs */}
      {[68, 90.5, 113].map((x) => (
        <g key={x}>
          <rect x={x} y="156" width="19" height="38" rx="2" fill="url(#ar-pouch)" />
          <path d={`M${x},158 C${x},156.5 ${x + 1},156 ${x + 2},156 L${x + 17},156 C${x + 18},156 ${x + 19},156.5 ${x + 19},158 L${x + 19},167 L${x},167 Z`} fill="#3c4130" />
          <path d={`M${x + 0.6},156.8 L${x + 18.4},156.8`} stroke={LIT} strokeWidth="0.6" opacity="0.32" />
          <path d={`M${x},167 L${x + 19},167`} stroke="#14160e" strokeWidth="1.2" />
          <rect x={x + 7.5} y="166" width="4" height="5" rx="0.6" fill="#1c1e15" />
          <path d={`M${x + 1.4},170 L${x + 1.4},192 M${x + 17.6},170 L${x + 17.6},192`} stroke="#15170f" strokeWidth="0.5" strokeDasharray="1 0.8" />
        </g>
      ))}
      {/* battle belt and buckle */}
      <path d="M53,196 C70,199.5 130,199.5 147,196 L147,207 C130,210.5 70,210.5 53,207 Z" fill="#2c2f22" />
      <path d="M53,196 C70,199.5 130,199.5 147,196" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.25" />
      <rect x="94" y="197" width="12" height="11" rx="1.2" fill="#121310" />
      <rect x="95.5" y="198.4" width="9" height="8.2" rx="0.8" fill="none" stroke="#56584f" strokeWidth="0.6" />

      {/* ---- head: face paint under the brim, chinstrap, helmet with
           goggles pushed up on the cover ---- */}
      <ellipse cx="84.6" cy="55" rx="2.6" ry="5.4" fill="#a5734f" />
      <ellipse cx="115.4" cy="55" rx="2.6" ry="5.4" fill="#9a6a49" />
      <path d={FACE_D} fill="url(#ar-skin)" />
      <g clipPath="url(#ar-face-clip)">
        <rect x="84" y="28" width="32" height="56" fill="url(#ar-form)" opacity="0.55" />
        {/* brim shadow */}
        <rect x="80" y="40" width="40" height="14" fill="#1a0e08" opacity="0.4" filter="url(#ar-soft)" />
        {/* camo paint: green bands across the cheeks and the bridge, black below */}
        <g fill="none" strokeLinecap="round" opacity="0.8">
          <path d="M83,59.5 C88,58.4 92.5,57.6 96.8,58.4" stroke="#2f3a22" strokeWidth="3.4" />
          <path d="M117,59.5 C112,58.4 107.5,57.6 103.2,58.4" stroke="#2f3a22" strokeWidth="3.4" />
          <path d="M97.4,56.6 L102.6,56.6" stroke="#2f3a22" strokeWidth="2.2" />
          <path d="M84,66 C88.5,64.4 92,63.6 95.6,64.4" stroke="#151a10" strokeWidth="2.6" />
          <path d="M116,66 C111.5,64.4 108,63.6 104.4,64.4" stroke="#151a10" strokeWidth="2.6" />
          <path d="M91,74 C95,72.8 99,73 102,74.4" stroke="#2f3a22" strokeWidth="2" opacity="0.7" />
        </g>
        {/* sockets, set deep under the brim */}
        <ellipse cx="92.5" cy="53.4" rx="5.4" ry="3" fill="#4a2c1a" opacity="0.6" filter="url(#ar-soft)" />
        <ellipse cx="107.5" cy="53.4" rx="5.4" ry="3" fill="#4a2c1a" opacity="0.6" filter="url(#ar-soft)" />
        {/* stubble along the jaw */}
        <path d="M88,70 C91,78 109,78 112,70 C111,75 106,79.4 100,79.4 C94,79.4 89,75 88,70 Z" fill="#2a1c12" opacity="0.28" />
      </g>
      {/* brows pulled down hard toward the nose */}
      <path d="M87.2,49.6 C90.8,47.8 95,48.4 98.2,51" stroke="#1c120b" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      <path d="M101.8,51 C105,48.4 109.2,47.8 112.8,49.6" stroke="#1c120b" strokeWidth="2.3" fill="none" strokeLinecap="round" />
      {[92.5, 107.5].map((cx) => (
        <g key={cx}>
          <path d={`M${cx - 3.8},53.6 C${cx - 2},52.5 ${cx + 2},52.5 ${cx + 3.8},53.6 C${cx + 2},54.6 ${cx - 2},54.6 ${cx - 3.8},53.6 Z`} fill="#d6c8b2" />
          <circle cx={cx} cy="53.6" r="1.35" fill="#3b2816" />
          <circle cx={cx} cy="53.6" r="0.65" fill="#050302" />
          <circle cx={cx + 0.5} cy="53.1" r="0.35" fill="#fff6e2" />
          <path d={`M${cx - 4},53.6 C${cx - 2},52 ${cx + 2},52 ${cx + 4},53.6`} stroke="#140c08" strokeWidth="1.2" fill="none" />
        </g>
      ))}
      {/* nose */}
      <path d="M100.6,55 L101.8,63.4" stroke="#7a5038" strokeWidth="1" opacity="0.55" />
      <path d="M97.6,64.6 C99,65.6 101,65.6 102.4,64.6" stroke="#5a3624" strokeWidth="0.9" fill="none" />
      {/* mouth: set hard, then open in a yell through the burst */}
      <path className="ar-mouth-shut" d="M94,70.6 C97,71.2 103,71.2 106,70.6" stroke="#4a2a1e" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <g className="ar-mouth-yell">
        <path d="M93.4,69 C97,68.2 103,68.2 106.6,69 C106,73.4 103,75.2 100,75.2 C97,75.2 94,73.4 93.4,69 Z" fill="#2a110b" />
        <path d="M94.6,69.4 C97.5,68.8 102.5,68.8 105.4,69.4 L105,71 C102.5,70.5 97.5,70.5 95,71 Z" fill="#e6d9c6" />
        <path d="M96,74 C98.5,74.8 101.5,74.8 104,74" stroke="#d8c8b4" strokeWidth="1" fill="none" opacity="0.8" />
      </g>
      {/* chinstrap */}
      <path d="M84.8,46 C85.4,60 90,73 100,80 C110,73 114.6,60 115.2,46" stroke="#1d1f17" strokeWidth="1.6" fill="none" />
      <rect x="85" y="60" width="2.4" height="4" rx="0.6" fill="#3a3c33" />
      <rect x="112.6" y="60" width="2.4" height="4" rx="0.6" fill="#3a3c33" />

      <path d={HELM_D} fill="url(#ar-camo)" />
      <g clipPath="url(#ar-helm-clip)">
        <rect x="76" y="10" width="48" height="40" fill="url(#ar-form)" />
        <rect x="76" y="10" width="48" height="40" fill="url(#ar-vshade)" />
        <ellipse cx="106" cy="18" rx="11" ry="5" fill={LIT} opacity="0.16" filter="url(#ar-soft)" />
        {/* cover seams */}
        <path d="M100,11 L100,44" stroke="#1d2015" strokeWidth="0.6" opacity="0.6" />
      </g>
      <path d="M78,47 C82,44.5 86,43.5 90,43.5 L110,43.5 C114,43.5 118,44.5 122,47" stroke="#15170f" strokeWidth="1.8" fill="none" />
      <path d="M86,15 C92,11.6 108,11.6 114,15" stroke={LIT} strokeWidth="1" fill="none" opacity="0.3" filter="url(#ar-soft)" />
      {/* the elastic band, and the goggles riding on it */}
      <path d="M78.6,35 C88,30.8 112,30.8 121.4,35" stroke="#1c1e15" strokeWidth="2.8" fill="none" />
      <rect x="85" y="24.5" width="30" height="11" rx="5" fill="#1b1c17" />
      <ellipse cx="92.6" cy="30" rx="6" ry="4.1" fill="url(#ar-lens)" />
      <ellipse cx="107.4" cy="30" rx="6" ry="4.1" fill="url(#ar-lens)" />
      <path d="M88.6,28.4 C90,26.8 92.4,26.6 94.2,27.4 M103.4,28.4 C104.8,26.8 107.2,26.6 109,27.4" stroke="#fff3d6" strokeWidth="0.8" fill="none" opacity="0.85" />
      {/* NVG mount plate at the front of the brim */}
      <path d="M96,37 L104,37 L104.6,43 L95.4,43 Z" fill="#202219" />
      <rect x="98.4" y="38.6" width="3.2" height="2.4" fill="#3c3f35" />

      {/* ---- upper arms; the Maple leaf on his shoulder ---- */}
      <Cloth d="M64,92 C50,90 40,100 39,114 L38,150 C38,157 44,161 51,161 C58,161 61,156 61,150 L62,118 Z" />
      <Cloth d="M136,92 C150,90 160,100 161,114 L162,150 C162,157 157,161 150,161 C143,161 139,156 139,150 L138,118 Z" />
      <path d="M54,93 C47,95 42,101 40.4,110 M146,93 C153,95 158,101 159.6,110" stroke={LIT} strokeWidth="1.4" fill="none" opacity="0.22" filter="url(#ar-soft)" />
      <g className="ar-patch">
        <rect x="40.6" y="106" width="17" height="18" rx="2.2" fill="#353a2a" />
        <rect x="41.4" y="106.8" width="15.4" height="16.4" rx="1.8" fill="none" stroke="#14160e" strokeWidth="0.5" strokeDasharray="0.9 0.6" />
        <image href={mapleLogo} x="42.2" y="107.6" width="13.8" height="14.8" preserveAspectRatio="xMidYMid meet" filter="url(#ar-patchtone)" />
      </g>

      {/* ---- the gun, both forearms and both hands; recoil moves them all ---- */}
      <g className="ar-recoil">
        {/* forearms, elbow to hand */}
        <Cloth d="M43.9,159.4 C42,152 48,147 56.1,152.6 L79.1,194.6 L66.9,201.4 Z" />
        <Cloth d="M145,152.4 C150,148 158,152 157,159.6 L137,192.6 L125,185.4 Z" />

        <g transform="rotate(-8 100 185)">
          <g className="ar-gun">
            {/* the belt, out of the feed tray and hanging in a loop: each dash is
                a cartridge side-on, the dark band the link across it */}
            <path className="ar-belt" d={BELT_D} stroke="#2a2216" strokeWidth="7" fill="none" strokeDasharray="2.6 0.9" />
            <path className="ar-belt" d={BELT_D} stroke="#c99a45" strokeWidth="6" fill="none" strokeDasharray="2.2 1.3" />
            <path className="ar-belt" d={BELT_D} stroke="#f0d08a" strokeWidth="1" fill="none" strokeDasharray="2.2 1.3" opacity="0.6" />
            <path className="ar-belt" d={BELT_D} stroke="#2c2a24" strokeWidth="1.6" fill="none" strokeDasharray="2.6 0.9" />

            {/* stock */}
            <path d="M28,180 L58,178 L58,193 L30,198 C27,198 26,196 26,193 L26,183 C26,181 27,180 28,180 Z" fill="url(#ar-steel)" />
            <rect x="25" y="180.5" width="3.4" height="17" rx="1" fill="#0b0b0c" />
            <path d="M28,180.6 L57,178.6" stroke="#7a7e86" strokeWidth="0.6" opacity="0.6" />
            {/* receiver, feed cover, carry handle */}
            <rect x="56" y="173" width="58" height="19" rx="1.5" fill="url(#ar-steel)" />
            <path d="M66,173 L104,173 L106,168.5 L68,168.5 Z" fill="#26282c" />
            <path d="M68,168.8 L105.6,168.8" stroke="#8a8e96" strokeWidth="0.7" opacity="0.7" />
            <path d="M100,169 C102,160 112,160 114,169" stroke="#1a1b1e" strokeWidth="2.4" fill="none" />
            <path d="M101,167 C103,160.8 111,160.8 113,167" stroke="#6c7078" strokeWidth="0.5" fill="none" opacity="0.6" />
            <path d="M57,173.6 L113,173.6" stroke="#8a8e96" strokeWidth="0.6" opacity="0.5" />
            <path d="M84,180 L100,180 L100,186 L84,186 Z" fill="#0c0c0d" />
            <circle cx="62" cy="182" r="0.9" fill="#55585e" />
            <circle cx="108" cy="182" r="0.9" fill="#55585e" />
            {/* charging handle — racked on p2 */}
            <g className="ar-handle">
              <rect x="104" y="191" width="7" height="4" rx="1" fill="#2c2e32" />
              <path d="M104.4,191.4 L110.6,191.4" stroke="#7a7e86" strokeWidth="0.5" />
            </g>
            {/* pistol grip, trigger guard */}
            <path d="M64,191 L77,191 L79,207 C79,209 77,210 75,210 L68,210 C66,210 65,209 64.6,207 Z" fill="#141517" />
            <path d="M77,192 C80,199.5 87,199.5 89,192" stroke="#1a1b1e" strokeWidth="1.7" fill="none" />
            {/* handguard with vent slots, gas tube, folded bipod */}
            <rect x="114" y="175" width="30" height="17" rx="2" fill="url(#ar-steel)" />
            {[118, 123, 128, 133, 138].map((x) => (
              <rect key={x} x={x} y="178" width="2" height="8" rx="1" fill="#070708" />
            ))}
            <path d="M114.6,175.6 L143.4,175.6" stroke="#8a8e96" strokeWidth="0.6" opacity="0.5" />
            <rect x="144" y="186" width="26" height="3.6" rx="1" fill="#1a1b1e" />
            <path d="M162,190 L122,195.6 M165,191 L125,197" stroke="#2a2c30" strokeWidth="1.3" />
            {/* barrel, front sight, flash hider */}
            <rect x="144" y="180.4" width="36" height="5.2" fill="#1d1e21" />
            <path d="M144,180.9 L180,180.9" stroke="#8a8e96" strokeWidth="0.6" opacity="0.6" />
            <rect className="ar-heat" x="146" y="180" width="34" height="6" fill="url(#ar-heat)" />
            <path d="M170,180.4 L172,174 L174.4,174 L175.4,180.4 Z" fill="#1a1b1e" />
            <rect x="180" y="179.4" width="10" height="7.2" rx="0.8" fill="#151618" />
            <path d="M182,180.4 L182,185.6 M184.6,180.4 L184.6,185.6 M187.2,180.4 L187.2,185.6" stroke="#000" strokeWidth="0.8" />
            <path d="M180.4,179.9 L189.6,179.9" stroke="#8a8e96" strokeWidth="0.5" opacity="0.6" />

            {/* the muzzle: two flash shapes strobing against each other */}
            <g className="ar-muzzle">
              <circle cx="192" cy="183" r="24" fill="url(#ar-flashglow)" className="ar-glow" />
              <g className="ar-flash-a">
                <path d={FLASH_A} fill="#ffcc6a" />
                <path d={FLASH_A} fill="#fff4d8" transform="translate(192 183) scale(0.5) translate(-192 -183)" />
              </g>
              <g className="ar-flash-b">
                <path d={FLASH_B} fill="#ffb84a" />
                <path d={FLASH_B} fill="#fff4d8" transform="translate(192 183) scale(0.5) translate(-192 -183)" />
              </g>
              <circle cx="191" cy="183" r="3.2" fill="#ffffff" />
            </g>
            {/* tracers, streaking out along the barrel line */}
            {SHOTS.map((k) => (
              <path key={k} className={`ar-tracer ar-tracer-${k}`} d={`M200,${183 + (k - 2) * 1.6} L236,${183 + (k - 2) * 4}`} stroke="#ffd98a" strokeWidth="1.8" strokeLinecap="round" />
            ))}

            {/* right fist round the pistol grip: the back of the glove to camera */}
            <path d="M62,194 C61,190 64,188 70,188 L80,189 C83,190 84,194 83,198 L81,206 C80,209 76,210 70,210 C65,210 62,207 62,203 Z" fill="url(#ar-glove)" />
            <path d="M63,196 C68,197.5 75,197.5 82.4,196.4 M62.6,200.6 C68,202 75,202 81.6,200.8 M62.8,205 C68,206.2 75,206.2 80.6,205" stroke="#3e3322" strokeWidth="0.8" fill="none" />
            <path d="M64,190.4 C68,189 75,189 80,190" stroke="#d9c49c" strokeWidth="0.7" fill="none" opacity="0.6" />
            <rect x="66" y="191" width="11" height="4.4" rx="1.6" fill="#4e4130" />
            {/* trigger finger in the guard */}
            <path d="M82,194 C85,194 87,195.4 87.6,197.4" stroke="#7d6a4c" strokeWidth="2.6" fill="none" strokeLinecap="round" />

            {/* support hand under the handguard, fingers over its near face */}
            <path d="M120,189 C120,185 140,185 142,189 L142,197 C142,201 136,203 130,203 C124,203 120,201 120,197 Z" fill="url(#ar-glove)" />
            {[122.5, 127, 131.5, 136].map((x, i) => (
              <path key={x} d={`M${x},${178.6 + i * 0.3} L${x + 4},${178.6 + i * 0.3} L${x + 4},${190} L${x},${190} Z`} fill="url(#ar-glove)" stroke="#3e3322" strokeWidth="0.6" />
            ))}
            <path d="M122.5,179 L140,179.8" stroke="#d9c49c" strokeWidth="0.6" opacity="0.55" />
          </g>
        </g>
      </g>

      {/* ejected brass, falling from the receiver past his legs */}
      <g className="ar-casings">
      {CASINGS.map(([dx, r, delay], i) => (
        <rect
          key={i}
          className="ar-casing"
          x="91.6"
          y="192"
          width="2.6"
          height="5.4"
          rx="0.7"
          fill="#d2a54c"
          style={{ "--dx": dx, "--r": r, animationDelay: delay }}
        />
      ))}
      </g>

      {/* spent brass collecting on the ground */}
      <g className="ar-brass">
        {BRASS.map(([x, y, a], i) => (
          <rect key={i} x={x} y={y} width="1.6" height="4" rx="0.5" fill={i % 3 ? "#b88f40" : "#e2bb64"} transform={`rotate(${a} ${x + 0.8} ${y + 2})`} />
        ))}
      </g>

      {/* smoke at the muzzle: puffs through the burst, wisps after */}
      <g fill="#cfc6b6" filter="url(#ar-softer)">
        <circle className="ar-puff ar-puff-1" cx="190" cy="171" r="5" />
        <circle className="ar-puff ar-puff-2" cx="190" cy="171" r="5" />
        <circle className="ar-puff ar-puff-3" cx="190" cy="171" r="5" />
      </g>
      <g fill="none" stroke="#d8d0c2" strokeLinecap="round" filter="url(#ar-softer)">
        <path className="ar-gs ar-gs-a" d="M189,168 C185,160 193,152 188,142 C184,134 191,126 187,116" strokeWidth="3.2" />
        <path className="ar-gs ar-gs-b" d="M189,168 C194,160 186,150 192,140 C197,132 190,124 194,114" strokeWidth="2.6" />
        <path className="ar-gs ar-gs-c" d="M160,174 C156,166 163,158 159,148 C156,141 161,134 158,126" strokeWidth="2.2" />
      </g>
    </svg>
  );
}

// A piece of camo cloth with its own form shading: base pattern, a horizontal
// falloff to its edges, and the flare's top light.
function Cloth({ d }) {
  return (
    <g>
      <path d={d} fill="url(#ar-camo)" />
      <path d={d} fill="url(#ar-form)" />
      <path d={d} fill="url(#ar-vshade)" />
    </g>
  );
}

// a flash that throws forward along the barrel: radius stretched toward +x
function makeFlash(rays, seed) {
  const pts = [];
  const n = rays * 2;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + seed;
    const fwd = Math.max(0, Math.cos(a));
    const long = i % 2 ? 4 : 10 + ((i * 7 + seed * 10) % 5);
    const r = long * (1 + fwd * fwd * 2.4);
    pts.push(`${(192 + Math.cos(a) * r).toFixed(2)},${(183 + Math.sin(a) * r * 0.8).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
}
const FLASH_A = makeFlash(9, 0);
const FLASH_B = makeFlash(11, 0.28);

const BELT_D = "M74,176 C66,190 60,206 63,222 C65,232 72,238 80,242";

const TORSO_D =
  "M86,84 C72,84 60,89 55,100 C52,108 52,120 52,132 L53,190 C53,198 60,204 70,205 L130,205 C140,204 147,198 147,190 L148,132 C148,120 148,108 145,100 C140,89 128,84 114,84 Z";

const CARRIER_D =
  "M68,96 C76,92 86,92 90,96 L110,96 C114,92 124,92 132,96 L136,150 L136,194 C136,198 133,200 129,200 L71,200 C67,200 64,198 64,194 L64,150 Z";

const FACE_D =
  "M85,44 C85,33 91,28 100,28 C109,28 115,33 115,44 C115.6,56 114,66 110,73 C106,79.5 94,79.5 90,73 C86,66 84.4,56 85,44 Z";

const HELM_D =
  "M78,47 C76,25 86,11 100,11 C114,11 124,25 122,47 C118,44.5 114,43.5 110,43.5 L90,43.5 C86,43.5 82,44.5 78,47 Z";
