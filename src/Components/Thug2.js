// Thug2.js — the hook again, drill-video cut. A concrete parking deck at night,
// tagged to the ceiling, one mercury-vapour lamp burning teal overhead. A car
// is parked behind him, dark. Its high beams flash on through the haze and he
// is already standing there, cut out of the glare by a hard white rim: hood up
// over a fitted cap, a red bandana over his nose and mouth, a heavy black zip
// hoodie, a chunky gold chain with a medallion, baggy dark denim stacked over
// tan work boots. Weight on one leg, shoulders squared, chin down. He brings a
// pistol up in a two-handed grip, held upright, and fires three rounds at the camera. A Maple
// Jiu Jitsu patch on the hoodie; no text.
//
// Same cue machine, shot effects, 200x400 viewBox and feet line as Thug, so the
// takes cut together. The set is one SVG in a 390x844 phone frame, sliced to
// fill, so the car's headlights sit either side of his legs.
//
// URL switch:  ?static  the held poster frame, without editing App.js
import React from "react";
import "../Stylesheets/Thug2.css";
import usePhases from "../Utils/usePhases";
import mapleLogo from "../Images/maple-logo.png";

// p1 the high beams flash on and he is already standing there, gun at his side
// p2 he raises it at the viewer; the camera starts a slow push in
// p3-p5 three rounds: each a muzzle flash, recoil, a frame flash and shake,
//    and a casing; smoke curls off the barrel after the first
//
// Plays ONCE and holds — loopAt is null. Haze, smoke and his breathing keep
// running on the held frame; that is ambient, not a restart.
const CUES = [40, 820, 1120, 1400, 1720];

export default function Thug2({ mode = "animated", loopAt = null }) {
  const still = mode === "static" || new URLSearchParams(window.location.search).has("static");
  const { phase, run, isStatic } = usePhases(CUES, { mode: still ? "static" : mode, loopAt });

  return (
    <div className={`t2 t2-p${phase} ${isStatic ? "is-static" : ""}`} key={run}>
      <div className="t2-world">
        <Set />
        <div className="t2-dark" aria-hidden />
        <div className="t2-haze t2-haze-a" aria-hidden />
        <div className="t2-haze t2-haze-b" aria-hidden />

        <div className="t2-card">
          <div className="t2-figbox">
            <div className="t2-walker">
              <div className="t2-shadow" aria-hidden />
              <div className="t2-breathe">
                <Gangster />
              </div>
            </div>
          </div>
        </div>

        {/* glare in front of him: the beams come at the lens */}
        <div className="t2-glare" aria-hidden>
          <i className="t2-glare-l" />
          <i className="t2-glare-r" />
          <i className="t2-streak" />
        </div>
      </div>

      <div className="t2-cut" aria-hidden />
      <div className="t2-flash" aria-hidden />
      <div className="t2-vignette" aria-hidden />
      <div className="t2-grain" aria-hidden />
    </div>
  );
}

/* ======================================================================
   THE SET — 390 x 844, sliced to fill. Figure feet land at y≈616.
   ====================================================================== */

// deterministic noise for the graffiti
const rnd = (i, n) => {
  const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// a closed organic blob through n jittered points (Catmull-Rom to cubics)
function blobPath(cx, cy, rx, ry, seed, n = 9) {
  const pts = [];
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2;
    const r = 0.72 + rnd(seed, k) * 0.42;
    pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]);
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let k = 0; k < n; k++) {
    const p0 = pts[(k - 1 + n) % n], p1 = pts[k], p2 = pts[(k + 1) % n], p3 = pts[(k + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + " Z";
}

// an abstract piece: two or three overlapping splats in one colour with a
// second-colour fade, a hard outline, a 3D drop, shines, drips and an arrow.
// Deliberately not letters.
function ThrowUp({ x, y, w, h, fill, fill2, seed }) {
  const n = 2 + Math.floor(rnd(seed, 1) * 2);
  const blobs = Array.from({ length: n }, (_, k) => ({
    cx: x + (w / n) * (k + 0.5) + (rnd(seed, k + 3) - 0.5) * 10,
    cy: y + (rnd(seed, k + 5) - 0.5) * h * 0.3,
    rx: (w / n) * (0.62 + rnd(seed, k + 7) * 0.25),
    ry: h * (0.42 + rnd(seed, k + 9) * 0.2),
    s: seed * 10 + k,
  }));
  const id = `t2-gf-${seed}`;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fill} />
          <stop offset="1" stopColor={fill2} />
        </linearGradient>
      </defs>
      {blobs.map((b, k) => (
        <path key={`s${k}`} d={blobPath(b.cx + 4, b.cy + 4, b.rx + 3, b.ry + 3, b.s)} fill="#040505" />
      ))}
      {blobs.map((b, k) => (
        <path key={`o${k}`} d={blobPath(b.cx, b.cy, b.rx + 3, b.ry + 3, b.s)} fill="#0b0c0c" />
      ))}
      {blobs.map((b, k) => (
        <path key={`f${k}`} d={blobPath(b.cx, b.cy, b.rx, b.ry, b.s)} fill={`url(#${id})`} />
      ))}
      {blobs.map((b, k) => (
        <path key={`l${k}`} d={blobPath(b.cx, b.cy, b.rx, b.ry, b.s)} fill="none" stroke="#0b0c0c" strokeWidth="1.4" opacity="0.6" />
      ))}
      {blobs.map((b, k) => (
        <path
          key={`h${k}`}
          d={`M${b.cx - b.rx * 0.5},${b.cy - b.ry * 0.38} q${b.rx * 0.25},${-b.ry * 0.28} ${b.rx * 0.55},${-b.ry * 0.3}`}
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
      ))}
      {blobs.map((b, k) =>
        rnd(seed, k + 41) > 0.35 ? (
          <path
            key={`d${k}`}
            d={`M${b.cx + (rnd(seed, k + 51) - 0.5) * b.rx},${b.cy + b.ry * 0.72} v${10 + rnd(seed, k + 61) * 24}`}
            stroke={fill2}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        ) : null
      )}
      {/* an arrow flicked off the end */}
      <path
        d={`M${x + w - 6},${y - h * 0.2} q${14},${-10} ${24},${-4} l-6,-6 m6,6 l-8,4`}
        stroke="#0b0c0c"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M${x + w - 6},${y - h * 0.2} q${14},${-10} ${24},${-4} l-6,-6 m6,6 l-8,4`}
        stroke={fill}
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

// scribbled tags: loops and slashes, no letters
function Tag({ x, y, s, colour, seed }) {
  let d = `M${x},${y}`;
  let cx = x;
  for (let k = 0; k < 7; k++) {
    const dx = 6 + rnd(seed, k) * 10;
    const up = (rnd(seed, k + 5) - 0.5) * 26;
    d += ` c${dx * 0.3},${up} ${dx * 0.8},${-up} ${dx},${(rnd(seed, k + 9) - 0.5) * 6}`;
    cx += dx;
  }
  d += ` l${8 * s},${-10 * s}`;
  return (
    <g transform={`scale(${s})`} style={{ transformOrigin: `${x}px ${y}px` }}>
      <path d={d} stroke={colour} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${x - 4},${y + 14} H${cx + 6}`} stroke={colour} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

function Set() {
  return (
    <>
    <svg className="t2-set" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="t2-wallg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d2b2a" />
          <stop offset="0.5" stopColor="#223230" />
          <stop offset="1" stopColor="#111a19" />
        </linearGradient>
        <linearGradient id="t2-ceil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050707" />
          <stop offset="1" stopColor="#141e1d" />
        </linearGradient>
        <linearGradient id="t2-beam-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a5652" />
          <stop offset="1" stopColor="#1b2827" />
        </linearGradient>
        <linearGradient id="t2-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2524" />
          <stop offset="0.4" stopColor="#0d1414" />
          <stop offset="1" stopColor="#040606" />
        </linearGradient>
        <filter id="t2-concrete" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.05" numOctaves="4" seed="9" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.6  0 0 0 0 0.58  0 0 0 0.55 0" />
        </filter>
        <filter id="t2-fine" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="2" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
        </filter>
        <filter id="t2-spray" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" />
        </filter>
        <filter id="t2-blur6" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="t2-blur2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <radialGradient id="t2-mercglow">
          <stop offset="0" stopColor="#d8fff4" stopOpacity="0.9" />
          <stop offset="0.2" stopColor="#7fe8cf" stopOpacity="0.45" />
          <stop offset="1" stopColor="#3fbfa4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="t2-mercone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8af0d6" stopOpacity="0.28" />
          <stop offset="1" stopColor="#8af0d6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="t2-hlglow">
          <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="0.12" stopColor="#f2f7ff" stopOpacity="0.85" />
          <stop offset="0.4" stopColor="#c8dcff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#c8dcff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="t2-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b2b2c" />
          <stop offset="0.45" stopColor="#070b0c" />
          <stop offset="0.55" stopColor="#14201f" />
          <stop offset="1" stopColor="#040606" />
        </linearGradient>
        <linearGradient id="t2-paint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c3a3b" />
          <stop offset="0.25" stopColor="#0f1415" />
          <stop offset="1" stopColor="#050708" />
        </linearGradient>
        <linearGradient id="t2-reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eaf2ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#eaf2ff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="t2-falloff" cx="195" cy="170" r="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="0.45" stopColor="#000" stopOpacity="0.25" />
          <stop offset="1" stopColor="#000" stopOpacity="0.75" />
        </radialGradient>
        <clipPath id="t2-wallclip">
          <rect x="0" y="118" width="390" height="442" />
        </clipPath>
      </defs>

      {/* ---- ceiling: a slab with beams marching back to the far wall ---- */}
      <rect x="0" y="0" width="390" height="140" fill="url(#t2-ceil)" />
      {[
        [0, 26, 34],
        [44, 70, 14],
        [88, 100, 9],
      ].map(([y0, y1, face], i) => (
        <g key={i}>
          <rect x="-10" y={y0} width="410" height={y1 - y0} fill="#0a0f0f" />
          <rect x="-10" y={y1} width="410" height={face} fill="url(#t2-beam-face)" opacity={0.55 + i * 0.12} />
        </g>
      ))}
      {/* tags up on the beams */}
      <g opacity="0.55" filter="url(#t2-spray)">
        <Tag x={20} y={52} s={0.8} colour="#d9d9d9" seed={3} />
        <Tag x={260} y={30} s={0.9} colour="#c25a8c" seed={7} />
        <Tag x={300} y={96} s={0.6} colour="#e3c34b" seed={11} />
      </g>

      {/* ---- the far wall, tagged ---- */}
      <rect x="0" y="118" width="390" height="442" fill="url(#t2-wallg)" />
      <rect x="0" y="118" width="390" height="442" filter="url(#t2-concrete)" style={{ mixBlendMode: "overlay" }} />
      {/* form-tie holes and panel joints in the poured concrete */}
      <g stroke="#0a1010" strokeWidth="1.2" opacity="0.7">
        <path d="M0,260 H390 M0,402 H390 M130,118 V560 M260,118 V560" />
      </g>
      {Array.from({ length: 24 }, (_, i) => (
        <circle key={i} cx={22 + (i % 6) * 70 + (Math.floor(i / 6) % 2) * 0} cy={150 + Math.floor(i / 6) * 70} r="1.6" fill="#091010" opacity="0.8" />
      ))}
      <g clipPath="url(#t2-wallclip)" filter="url(#t2-spray)" opacity="0.5" className="t2-graff">
        <ThrowUp x={10} y={306} w={100} h={60} fill="#8a5ec2" fill2="#4a2d7a" seed={1} />
        <ThrowUp x={276} y={300} w={104} h={58} fill="#e06a95" fill2="#8c2e58" seed={2} />
        <ThrowUp x={126} y={206} w={136} h={50} fill="#e2c04e" fill2="#a36d1c" seed={3} />
        <ThrowUp x={14} y={428} w={86} h={44} fill="#52c3d4" fill2="#1f6f86" seed={4} />
        <ThrowUp x={292} y={430} w={84} h={44} fill="#ececec" fill2="#9aa3a6" seed={5} />
        <Tag x={150} y={300} s={1.1} colour="#f2f2f2" seed={13} />
        <Tag x={30} y={190} s={0.9} colour="#e3c34b" seed={17} />
        <Tag x={280} y={180} s={1} colour="#9fd8e6" seed={19} />
        <Tag x={160} y={380} s={0.9} colour="#d06a96" seed={23} />
        {/* a spray arrow and a star */}
        <path d="M300,374 C320,360 342,362 360,372 L354,362 M360,372 L348,378" stroke="#e8e8e8" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M70,250 l4,9 10,1 -8,6 3,10 -9,-6 -9,6 3,-10 -8,-6 10,-1 z" fill="#e3c34b" stroke="#0b0c0c" strokeWidth="2" />
      </g>
      <rect x="0" y="118" width="390" height="442" filter="url(#t2-fine)" opacity="0.6" style={{ mixBlendMode: "multiply" }} />
      {/* the lamp only reaches so far: the wall falls off into the dark */}
      <rect x="0" y="0" width="390" height="560" fill="url(#t2-falloff)" />

      {/* square pillars either side, nearer the lens */}
      <g>
        <rect x="-6" y="100" width="46" height="560" fill="#0f1716" />
        <rect x="34" y="100" width="8" height="560" fill="#1f2e2c" />
        <rect x="350" y="100" width="46" height="560" fill="#0f1716" />
        <rect x="348" y="100" width="8" height="560" fill="#1a2726" />
        <rect x="-6" y="330" width="48" height="26" fill="#c9a43a" opacity="0.3" />
        <rect x="-6" y="356" width="48" height="26" fill="#0b0b0b" opacity="0.3" />
        <rect x="348" y="330" width="48" height="26" fill="#c9a43a" opacity="0.3" />
        <rect x="348" y="356" width="48" height="26" fill="#0b0b0b" opacity="0.3" />
      </g>

      {/* ---- the floor, wet in patches ---- */}
      <rect x="0" y="556" width="390" height="288" fill="url(#t2-floor)" />
      <rect x="0" y="556" width="390" height="288" filter="url(#t2-concrete)" opacity="0.5" style={{ mixBlendMode: "overlay" }} />
      {/* faded bay lines running back to the car */}
      <path d="M-40,844 L120,556 M430,844 L270,556" stroke="#c9b24a" strokeWidth="5" opacity="0.18" />

      {/* ---- the mercury-vapour lamp ---- */}
      <g>
        <path d="M195,100 V110" stroke="#1d2626" strokeWidth="2" />
        <path d="M180,118 C182,110 208,110 210,118 Z" fill="#273332" />
        <path d="M180,118 C182,110 208,110 210,118" stroke="#57817a" strokeWidth="0.8" fill="none" />
        <ellipse className="t2-merc-bulb" cx="195" cy="121.5" rx="9" ry="4.4" fill="#e4fff7" />
        <path d="M187,118 Q195,130 203,118 M191,118 L192,125 M199,118 L198,125" stroke="#1d2626" strokeWidth="0.9" fill="none" />
      </g>

      {/* ---- the car, parked nose-out behind him ---- */}
      <g className="t2-car">
        <ellipse cx="195" cy="562" rx="168" ry="10" fill="#000" opacity="0.75" filter="url(#t2-blur2)" />
        {/* tyres */}
        <rect x="62" y="528" width="42" height="36" rx="6" fill="#050505" />
        <rect x="286" y="528" width="42" height="36" rx="6" fill="#050505" />
        {/* cabin and roof */}
        <path d="M112,400 C122,388 268,388 278,400 L298,448 L92,448 Z" fill="url(#t2-paint)" />
        <path d="M120,404 C130,395 260,395 270,404 L286,444 L104,444 Z" fill="url(#t2-glass)" />
        {/* the lamp, reflected in the windscreen */}
        <path d="M178,402 C186,400 204,400 212,402 L216,412 L174,412 Z" fill="#9ff4de" opacity="0.35" />
        <path d="M150,440 L190,404 M200,440 L236,404" stroke="#a8e8da" strokeWidth="1" opacity="0.12" />
        {/* mirrors */}
        <path d="M92,434 L78,430 C74,430 72,436 74,440 L92,444 Z" fill="#0c1112" />
        <path d="M298,434 L312,430 C316,430 318,436 316,440 L298,444 Z" fill="#0c1112" />
        {/* bonnet */}
        <path d="M92,448 L298,448 L332,476 L58,476 Z" fill="url(#t2-paint)" />
        <path d="M92,448 L298,448" stroke="#7fd6c4" strokeWidth="1.2" opacity="0.45" />
        <path d="M150,450 L130,474 M240,450 L260,474" stroke="#000" strokeWidth="1" opacity="0.5" />
        {/* front face */}
        <path d="M56,476 L334,476 C338,476 340,480 340,486 L340,520 C340,526 336,530 330,530 L60,530 C54,530 50,526 50,520 L50,486 C50,480 52,476 56,476 Z" fill="#0b0f10" />
        <path d="M56,476 L334,476" stroke="#3d5a55" strokeWidth="1" opacity="0.8" />
        {/* grille */}
        <rect x="146" y="484" width="98" height="34" rx="4" fill="#030404" />
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M150,${489 + i * 5} H240`} stroke="#1f2a2a" strokeWidth="1.2" />
        ))}
        {/* bumper and intake */}
        <path d="M48,530 L342,530 C344,540 340,548 332,550 L58,550 C50,548 46,540 48,530 Z" fill="#090c0d" />
        <rect x="130" y="536" width="130" height="9" rx="3" fill="#020303" />
        <path d="M58,530 L332,530" stroke="#2c4440" strokeWidth="0.8" />
        {/* headlight housings */}
        <path d="M60,484 L130,482 L126,504 L62,506 Z" fill="#0d1415" />
        <path d="M260,482 L330,484 L328,506 L264,504 Z" fill="#0d1415" />
      </g>

    </svg>
    {/* the lights live on their own layers, so their flicker and hum only
        change those layers' opacity — the textured set is painted once */}
    <svg className="t2-set t2-merc" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g>
        <path d="M150,124 L240,124 L330,640 L60,640 Z" fill="url(#t2-mercone)" filter="url(#t2-blur6)" />
        <circle cx="195" cy="122" r="120" fill="url(#t2-mercglow)" />
      </g>
    </svg>
    <svg className="t2-set t2-beams" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {/* ---- headlights: the hero light ---- */}
      <g>
        {/* puddle reflections streaking down the wet floor */}
        <rect x="72" y="560" width="38" height="240" fill="url(#t2-reflect)" filter="url(#t2-blur6)" opacity="0.55" />
        <rect x="280" y="560" width="38" height="240" fill="url(#t2-reflect)" filter="url(#t2-blur6)" opacity="0.55" />
        <circle cx="94" cy="494" r="175" fill="url(#t2-hlglow)" />
        <circle cx="296" cy="494" r="175" fill="url(#t2-hlglow)" />
        <path d="M66,486 L126,484 L123,502 L66,504 Z" fill="#ffffff" />
        <path d="M264,484 L324,486 L324,504 L267,502 Z" fill="#ffffff" />
        {/* LED strips over the lamps */}
        <path d="M64,481 L130,479" stroke="#e8f4ff" strokeWidth="2" strokeLinecap="round" />
        <path d="M260,479 L326,481" stroke="#e8f4ff" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
    </>
  );
}

/* ======================================================================
   THE MAN — front-facing, viewBox 200x400, feet on the bottom edge.
   Every animated group carries no transform attribute.
   ====================================================================== */

// headlight rim from behind, cold white
const RIM = "#f4f8ff";
// mercury top light, teal
const TOP = "#8ff0d8";

function Gangster() {
  return (
    <svg className="t2-man" viewBox="0 0 200 400" aria-hidden>
      <defs>
        <filter id="t2-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
        <filter id="t2-softer" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id="t2-cloth" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="4" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0" />
        </filter>
        <filter id="t2-denimtex" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4 0.35" numOctaves="2" seed="8" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.52  0 0 0 0 0.72  0 0 0 0.16 0" />
        </filter>
        <filter id="t2-patchtone" x="-10%" y="-10%" width="120%" height="120%">
          <feColorMatrix type="matrix" values="0.8 0 0 0 0  0 0.84 0 0 0  0 0 0.84 0 0  0 0 0 1 0" />
          <feDropShadow dx="0" dy="0.5" stdDeviation="0.4" floodColor="#000" floodOpacity="0.8" />
        </filter>

        <linearGradient id="t2-hood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#30353a" />
          <stop offset="0.22" stopColor="#1a1d21" />
          <stop offset="0.65" stopColor="#0f1113" />
          <stop offset="1" stopColor="#08090a" />
        </linearGradient>
        <linearGradient id="t2-sleeve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b3035" />
          <stop offset="0.3" stopColor="#16181b" />
          <stop offset="1" stopColor="#0a0b0c" />
        </linearGradient>
        <linearGradient id="t2-form" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.6" />
          <stop offset="0.3" stopColor="#000" stopOpacity="0" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="t2-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8c5c40" />
          <stop offset="0.5" stopColor="#744a31" />
          <stop offset="1" stopColor="#583522" />
        </linearGradient>
        <linearGradient id="t2-hand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5a3e" />
          <stop offset="0.55" stopColor="#6c432c" />
          <stop offset="1" stopColor="#4c2d1c" />
        </linearGradient>
        <linearGradient id="t2-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff2a46" />
          <stop offset="0.45" stopColor="#e4002b" />
          <stop offset="1" stopColor="#8e0019" />
        </linearGradient>
        <pattern id="t2-paisley" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-14)">
          {/* a boteh: a fat teardrop with its tip curled over, a dot in it */}
          <path d="M3.6,7.6 C1.4,6.8 1,3.6 2.8,2.4 C4.6,1.2 6.8,2.4 6.4,4.4 C6.2,5.4 5.2,5.8 4.8,6.4 C4.6,6.9 4.9,7.6 5.4,7.8 C4.8,8 4.2,7.9 3.6,7.6 Z" fill="#fff4ee" opacity="0.9" />
          <circle cx="4" cy="4.4" r="0.9" fill="#b0001f" />
          <circle cx="4" cy="4.4" r="0.35" fill="#fff4ee" />
          <circle cx="8.4" cy="8.2" r="0.55" fill="#1a0006" />
          <circle cx="8.2" cy="2" r="0.4" fill="#fff4ee" />
          <circle cx="1" cy="9.2" r="0.35" fill="#fff4ee" />
        </pattern>
        <linearGradient id="t2-denim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0a0e17" />
          <stop offset="0.45" stopColor="#1a2338" />
          <stop offset="0.7" stopColor="#141b2c" />
          <stop offset="1" stopColor="#080b12" />
        </linearGradient>
        <linearGradient id="t2-boot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d79b52" />
          <stop offset="0.45" stopColor="#b0762f" />
          <stop offset="1" stopColor="#7a4c1a" />
        </linearGradient>
        <linearGradient id="t2-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1ae" />
          <stop offset="0.35" stopColor="#e3b23a" />
          <stop offset="0.7" stopColor="#a5731a" />
          <stop offset="1" stopColor="#f5d468" />
        </linearGradient>
        <radialGradient id="t2-medal" cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#fff6c8" />
          <stop offset="0.45" stopColor="#e2b23c" />
          <stop offset="1" stopColor="#8a5c14" />
        </radialGradient>
        <linearGradient id="t2-polymer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b3e44" />
          <stop offset="0.3" stopColor="#1c1d20" />
          <stop offset="1" stopColor="#0b0b0c" />
        </linearGradient>
        <linearGradient id="t2-slidetop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5d6066" />
          <stop offset="0.35" stopColor="#2b2d31" />
          <stop offset="1" stopColor="#111214" />
        </linearGradient>
        <radialGradient id="t2-flashglow">
          <stop offset="0" stopColor="#fff3cf" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffb347" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="t2-hoodshadow" cx="0.5" cy="0.15" r="0.75">
          <stop offset="0" stopColor="#000" stopOpacity="0.9" />
          <stop offset="0.6" stopColor="#000" stopOpacity="0.45" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <clipPath id="t2-torso-clip">
          <path d={TORSO_D} />
        </clipPath>
        <clipPath id="t2-face-clip">
          <path d={FACE_D} />
        </clipPath>
        <clipPath id="t2-band-clip">
          <path d={BANDANA_D} />
        </clipPath>
        <clipPath id="t2-legl-clip">
          <path d={LEG_L_D} />
        </clipPath>
        <clipPath id="t2-legr-clip">
          <path d={LEG_R_D} />
        </clipPath>
      </defs>

      {/* ================= LEGS: baggy dark denim, stacked over work boots.
          His weight is on his left leg (frame right), planted straight; the
          right leg (frame left) is set out wide, knee soft, toe turned out. */}
      <g className="t2-legs">
        <Boot x={36} toe={-1} />
        <Boot x={102} toe={0.3} />
        {/* the extra length piles up over the boots; the legs cover the top
            of each pile, so only the lumps below the knee-line show */}
        <Stack x={50} y={334} w={36.5} seed={1} lean={-0.22} />
        <Stack x={104.6} y={334} w={34} seed={2} lean={0.03} />

        {/* frame-left leg, set out */}
        <path d={LEG_L_D} fill="url(#t2-denim)" />
        <g clipPath="url(#t2-legl-clip)">
          <rect x="30" y="200" width="80" height="180" filter="url(#t2-denimtex)" />
          {/* thigh fade and whiskers off the crotch */}
          <ellipse cx="82" cy="250" rx="9" ry="26" fill="#6f86b8" opacity="0.16" filter="url(#t2-softer)" />
          <path d="M92,226 C86,230 82,232 76,232 M93,232 C87,237 83,239 77,240 M93,238 C88,243 84,245 79,247" stroke="#9fb3dc" strokeWidth="1" fill="none" opacity="0.3" filter="url(#t2-soft)" />
          {/* the knee break */}
          {/* the knee, soft: the leg is set out, not locked */}
          <path d="M64,293 C70,291 78,292 86,296" stroke="#000" strokeWidth="1.8" fill="none" opacity="0.5" filter="url(#t2-soft)" />
          <path d="M60,306 C66,309 76,311 86,308" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.45" filter="url(#t2-soft)" />
          <path d="M84,338 Q70,343 54,338 M78,347 Q62,352 46,346" stroke="#03050a" strokeWidth="1.8" fill="none" opacity="0.8" filter="url(#t2-soft)" />
          {/* outseam */}
          <path d="M67,212 C62,258 55,306 46,350" stroke="#000" strokeWidth="2.6" fill="none" opacity="0.6" filter="url(#t2-soft)" />
          <path d="M69.6,212 C64.6,258 57.8,306 49.4,350" stroke="#c49a52" strokeWidth="0.5" fill="none" strokeDasharray="1.2 1" opacity="0.45" />
        </g>

        {/* frame-right leg, the weight leg */}
        <path d={LEG_R_D} fill="url(#t2-denim)" />
        <g clipPath="url(#t2-legr-clip)">
          <rect x="95" y="200" width="50" height="180" filter="url(#t2-denimtex)" />
          <ellipse cx="117" cy="252" rx="9" ry="28" fill="#6f86b8" opacity="0.18" filter="url(#t2-softer)" />
          <path d="M104,226 C110,230 114,232 120,232 M103,232 C109,237 113,239 119,240 M103,238 C108,243 112,245 117,247" stroke="#9fb3dc" strokeWidth="1" fill="none" opacity="0.3" filter="url(#t2-soft)" />
          <path d="M108,302 C114,300.6 122,300.8 130,303" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.4" filter="url(#t2-soft)" />
          {/* the first folds of the stack starting above the boot */}
          <path d="M104,340 Q116,345 130,341 M110,348 Q124,353 140,349" stroke="#03050a" strokeWidth="1.8" fill="none" opacity="0.8" filter="url(#t2-soft)" />
          <path d="M132,212 C133.6,262 135,312 136,352" stroke="#000" strokeWidth="2.6" fill="none" opacity="0.6" filter="url(#t2-soft)" />
          <path d="M129.6,212 C131,262 132.4,312 133.4,352" stroke="#c49a52" strokeWidth="0.5" fill="none" strokeDasharray="1.2 1" opacity="0.45" />
        </g>

        {/* rim of headlight glare down the outside of each leg */}
        <path d="M69.4,214 C64.4,256 57.4,300 49,340" stroke={RIM} strokeWidth="0.7" fill="none" opacity="0.5" />
        <path d="M131.4,214 C133,258 134.6,304 135.6,340" stroke={RIM} strokeWidth="0.7" fill="none" opacity="0.5" />
        {/* crotch shadow */}
        <path d="M94,214 C96,222 98,230 99,236 C100,230 102,222 104,214" fill="#05070b" opacity="0.9" />
      </g>
      <ellipse cx="100" cy="214" rx="34" ry="5" fill="#000" opacity="0.65" filter="url(#t2-softer)" />

      {/* ================= OFF ARM: hanging loose, a bare tattooed hand */}
      <g className="t2-arm t2-arm-off">
        <path d="M138,92 C154,90 163,100 165,116 L168,194 C168,200 164,203 159,203 L146,204 C144,182 142,152 141,122 Z" fill="url(#t2-sleeve)" />
        {/* elbow folds, the heavy fleece bunching */}
        <path d="M143,146 C149,151 157,150 165,144 M143.4,155 C150,159 158,158 165.6,152" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.8" filter="url(#t2-soft)" />
        <path d="M143.6,143.8 C149.4,148.6 157,147.8 164.6,142" stroke={TOP} strokeWidth="0.6" fill="none" opacity="0.25" />
        <path d="M150,104 C154,118 157,134 158,144" stroke={TOP} strokeWidth="3" fill="none" opacity="0.08" filter="url(#t2-softer)" />
        <path d="M147,92 C155,94 161,101 163,112" stroke={TOP} strokeWidth="1.6" fill="none" opacity="0.4" filter="url(#t2-soft)" />
        {/* the hard rim down his outside edge */}
        <path d="M164,110 C165.6,140 166.6,170 167.6,196" stroke={RIM} strokeWidth="1" fill="none" opacity="0.8" />
        {/* ribbed cuff */}
        <path d="M145.4,192 L162.6,191 L163,203 L145.8,204 Z" fill="#0b0c0d" />
        {[148, 151, 154, 157, 160].map((x) => (
          <path key={x} d={`M${x},192.4 L${x + 0.2},203.6`} stroke="#1f2124" strokeWidth="0.5" />
        ))}
        <OffHand />
      </g>

      {/* ================= HOODIE: heavyweight fleece, zipped to the neck */}
      <path d={TORSO_D} fill="url(#t2-hood)" />
      <g clipPath="url(#t2-torso-clip)">
        {/* tension folds: shoulder points down to the zip */}
        <path d="M60,104 C70,118 80,130 92,142" stroke="#000" strokeWidth="2.4" fill="none" opacity="0.75" filter="url(#t2-soft)" />
        <path d="M60.8,101.6 C70.8,115.6 80.8,127.6 92.8,139.6" stroke={TOP} strokeWidth="0.8" fill="none" opacity="0.22" filter="url(#t2-soft)" />
        <path d="M140,104 C130,118 120,130 108,142" stroke="#000" strokeWidth="2.4" fill="none" opacity="0.75" filter="url(#t2-soft)" />
        <path d="M139.2,101.6 C129.2,115.6 119.2,127.6 107.2,139.6" stroke={TOP} strokeWidth="0.8" fill="none" opacity="0.22" filter="url(#t2-soft)" />
        {/* armpit drag */}
        <path d="M52,126 C58,134 62,146 64,160 M148,126 C142,134 138,146 136,160" stroke="#000" strokeWidth="2" fill="none" opacity="0.7" filter="url(#t2-soft)" />
        {/* chest plane catching the lamp */}
        <ellipse cx="78" cy="120" rx="16" ry="9" fill={TOP} opacity="0.07" filter="url(#t2-softer)" />
        <ellipse cx="122" cy="120" rx="16" ry="9" fill={TOP} opacity="0.07" filter="url(#t2-softer)" />
        {/* kangaroo pocket */}
        <path d="M68,164 L132,164 C136,174 139,186 141,198 L59,198 C61,186 64,174 68,164 Z" fill="#121417" />
        <path d="M68,164 L132,164" stroke={TOP} strokeWidth="0.7" opacity="0.25" />
        <path d="M68,164 C64,174 61,186 59,198 M132,164 C136,174 139,186 141,198" stroke="#000" strokeWidth="1.8" fill="none" opacity="0.9" />
        <path d="M69.6,165 C65.8,175 62.8,186 61,197 M130.4,165 C134.2,175 137.2,186 139,197" stroke="#3a4046" strokeWidth="0.6" fill="none" opacity="0.6" />
        {/* waist drape */}
        <path d="M54,184 C60,188 66,190 70,190 M146,184 C140,188 134,190 130,190" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.7" filter="url(#t2-soft)" />
        <rect x="0" y="0" width="200" height="400" fill="url(#t2-form)" />
        <rect x="0" y="0" width="200" height="400" filter="url(#t2-cloth)" opacity="0.55" />
        {/* ribbed hem, kicked up on the weight side */}
        <path d="M46,200 C72,203 128,202 154,196 L156,216 L44,216 Z" fill="#0a0b0c" />
        {Array.from({ length: 40 }, (_, i) => (
          <path key={i} d={`M${48 + i * 2.6},${200.6 - i * 0.1} V214`} stroke="#1d2024" strokeWidth="0.6" />
        ))}
        <path d="M46,200 C72,203 128,202 154,196" stroke={TOP} strokeWidth="0.6" fill="none" opacity="0.25" />
      </g>
      {/* the zip, a little open at the top */}
      <path d="M100,96 L100,214" stroke="#050506" strokeWidth="2.6" />
      <path d="M100,98 L100,214" stroke="#5b6168" strokeWidth="1.2" strokeDasharray="0.7 0.7" opacity="0.8" />
      <rect x="98.4" y="108" width="3.2" height="7.4" rx="1" fill="#8d939a" />
      <rect x="99.2" y="115" width="1.6" height="4" rx="0.6" fill="#6b7178" />
      {/* the hard headlight rim round his shoulders */}
      <path d="M50,106 C54,94 66,88 84,88" stroke={RIM} strokeWidth="1.1" fill="none" opacity="0.85" />
      <path d="M150,106 C146,94 134,88 116,88" stroke={RIM} strokeWidth="1.1" fill="none" opacity="0.85" />

      {/* drawstrings out of the hood */}
      <g className="t2-cords">
        <path d="M93,96 C92.4,108 91.6,122 91.8,136" stroke="#d8dad6" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M107,96 C107.8,108 108.8,118 108.4,130" stroke="#d8dad6" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M93,96 C92.4,108 91.6,122 91.8,136" stroke="#000" strokeWidth="0.6" fill="none" opacity="0.35" transform="translate(0.7 0)" />
        <rect x="90.4" y="135" width="2.8" height="6" rx="0.8" fill="#9aa0a6" />
        <rect x="107" y="129" width="2.8" height="6" rx="0.8" fill="#9aa0a6" />
      </g>

      {/* the Maple Jiu Jitsu leaf, a patch on the left breast */}
      <g className="t2-patch">
        <ellipse cx="128" cy="133" rx="8.6" ry="8.8" fill="#000" opacity="0.55" filter="url(#t2-soft)" />
        <image href={mapleLogo} x="119.8" y="124.4" width="16.4" height="16.6" preserveAspectRatio="xMidYMid meet" filter="url(#t2-patchtone)" />
      </g>

      {/* ================= THE HOOD, up, with a fitted cap under it */}
      <g transform="rotate(-2.5 100 92)">
        <path d={HOOD_D} fill="url(#t2-hood)" />
        <path d="M74,48 C76,28 86,15 100,14 C114,15 124,28 126,48" stroke={TOP} strokeWidth="2" fill="none" opacity="0.35" filter="url(#t2-soft)" />
        <path d="M71,66 C69,42 80,16 100,12" stroke={RIM} strokeWidth="1.1" fill="none" opacity="0.85" />
        <path d="M129,66 C131,42 120,16 100,12" stroke={RIM} strokeWidth="1.1" fill="none" opacity="0.7" />
        {/* the dark well inside the hood */}
        <path d={OPENING_D} fill="#040405" />
        {/* the face */}
        <path d={FACE_D} fill="url(#t2-skin)" />
        <g clipPath="url(#t2-face-clip)">
          {/* cheekbones lit faintly by the lamp, the sides lost in the hood */}
          <rect x="80" y="20" width="40" height="70" fill="url(#t2-form)" opacity="0.9" />
          <ellipse cx="91" cy="52" rx="4" ry="2" fill="#b07a56" opacity="0.4" filter="url(#t2-soft)" />
          <ellipse cx="109" cy="52" rx="4" ry="2" fill="#b07a56" opacity="0.4" filter="url(#t2-soft)" />
          {/* brows down and drawn in: a mass, not two lines */}
          <path d="M85,43.6 C89,41.4 94,41.6 98.6,45 L98.4,46.6 C94,44.8 89.6,44.8 85.4,46.4 Z" fill="#1a0e08" />
          <path d="M115,43.6 C111,41.4 106,41.6 101.4,45 L101.6,46.6 C106,44.8 110.4,44.8 114.6,46.4 Z" fill="#1a0e08" />
          <path d="M98.6,45.2 C99.4,46.6 100.6,46.6 101.4,45.2" stroke="#3a2214" strokeWidth="0.8" fill="none" />
          {/* eyes: narrowed, the lower lid flat and tense */}
          {[92, 108].map((cx, k) => (
            <g key={cx}>
              <path d={`M${cx - 4.6},48.6 C${cx - 2.6},46.6 ${cx + 2.6},46.6 ${cx + 4.6},48.4 C${cx + 2.6},49.6 ${cx - 2.6},49.8 ${cx - 4.6},48.6 Z`} fill="#3a2418" />
              <path d={`M${cx - 3.8},48.5 C${cx - 2},47.4 ${cx + 2},47.4 ${cx + 3.8},48.4 C${cx + 2},49.2 ${cx - 2},49.3 ${cx - 3.8},48.5 Z`} fill="#d9cbb8" />
              <circle cx={cx + (k ? -0.4 : 0.4)} cy="48.4" r="1.45" fill="#2a160b" />
              <circle cx={cx + (k ? -0.4 : 0.4)} cy="48.4" r="0.72" fill="#050302" />
              <circle cx={cx + (k ? -0.4 : 0.4) + 0.5} cy="47.9" r="0.36" fill="#d8fff4" />
              <path d={`M${cx - 4.8},48.4 C${cx - 2.6},46.3 ${cx + 2.6},46.3 ${cx + 4.8},48.2`} stroke="#0e0704" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d={`M${cx - 3.8},50 C${cx - 1.6},50.6 ${cx + 1.6},50.6 ${cx + 3.8},50`} stroke="#3e2416" strokeWidth="0.7" fill="none" opacity="0.8" />
            </g>
          ))}
          {/* the cap's shadow across the brow */}
          <rect x="80" y="38" width="40" height="8" fill="#000" opacity="0.55" filter="url(#t2-soft)" />
          <path d="M99.2,47 L99.6,52" stroke="#a87150" strokeWidth="1.1" opacity="0.5" />
        </g>
        {/* fitted cap: crown under the hood, a flat brim shading the eyes */}
        <path d="M85,36 C85.6,25 92,20.6 100,20.6 C108,20.6 114.4,25 115,36 Z" fill="#111215" />
        <path d="M88,28 C92,23.6 108,23.6 112,28" stroke="#2c3036" strokeWidth="0.8" fill="none" />
        <path d="M100,20.8 V35.6" stroke="#050506" strokeWidth="0.6" />
        <path d="M82.6,36.4 C90,34 110,34 117.4,36.4 C117.8,38.8 117,40.6 115,40.8 C108,39.4 92,39.4 85,40.8 C83,40.6 82.2,38.8 82.6,36.4 Z" fill="#0b0c0e" />
        <path d="M82.8,36.2 C90,33.8 110,33.8 117.2,36.2" stroke={TOP} strokeWidth="0.8" fill="none" opacity="0.55" />
        <ellipse cx="96" cy="36.4" rx="3" ry="0.7" fill="#c9cfd6" opacity="0.5" />

        {/* ================= RED BANDANA over the nose and mouth */}
        <path d={BANDANA_D} fill="url(#t2-red)" />
        <g clipPath="url(#t2-band-clip)">
          <rect x="70" y="40" width="60" height="70" fill="url(#t2-paisley)" opacity="0.5" />
          {/* the printed border running round the hanging point */}
          <path d="M86.6,81 C90.4,87 95,92.6 100,99.6 C105,92.6 109.6,87 113.4,81" stroke="#fff4ee" strokeWidth="1" fill="none" opacity="0.8" />
          <path d="M88.4,80.4 C92,86 96,91 100,96.8 C104,91 108,86 111.6,80.4" stroke="#fff4ee" strokeWidth="0.6" fill="none" strokeDasharray="0.6 1.2" opacity="0.8" />
          {/* the nose lifts it: a lit ridge and shadowed sides */}
          <path d="M100,50 C99.6,56 99.4,60 99.6,63" stroke="#ff8a9a" strokeWidth="2.2" fill="none" opacity="0.5" filter="url(#t2-soft)" />
          <path d="M95,52 C93,58 92,62 91,66 M105,52 C107,58 108,62 109,66" stroke="#5a0010" strokeWidth="2.2" fill="none" opacity="0.55" filter="url(#t2-soft)" />
          {/* folds sagging from the nose to the tie points */}
          <path d="M99,63 C94,66 88,66 84,64 M101,63 C106,66 112,66 116,64" stroke="#4a000d" strokeWidth="1.8" fill="none" opacity="0.6" filter="url(#t2-soft)" />
          <path d="M99,70 C93,74 88,75 84,73 M101,70 C107,74 112,75 116,73" stroke="#4a000d" strokeWidth="1.6" fill="none" opacity="0.55" filter="url(#t2-soft)" />
          <path d="M99.4,68.4 C93.4,72.4 88.4,73.4 84.4,71.4 M100.6,68.4 C106.6,72.4 111.6,73.4 115.6,71.4" stroke="#ff7084" strokeWidth="0.8" fill="none" opacity="0.4" />
          <path d="M96,82 C98,86 102,86 104,82 M94,90 C97,95 103,95 106,90" stroke="#4a000d" strokeWidth="1.4" fill="none" opacity="0.5" filter="url(#t2-soft)" />
          {/* the chin under it, and the lips just pressing through */}
          <path d="M94.5,67.6 C97.6,68.6 102.4,68.6 105.5,67.6" stroke="#6a0012" strokeWidth="1" fill="none" opacity="0.6" />
          {/* sides lost in the hood */}
          <rect x="70" y="40" width="60" height="70" fill="url(#t2-form)" opacity="0.9" />
          <rect x="70" y="40" width="60" height="70" fill="url(#t2-hoodshadow)" opacity="0.35" />
        </g>
        <path d="M82.6,52.6 C88,50 94,50.4 100,49.2 C106,50.4 112,50 117.4,52.6" stroke="#ff6a80" strokeWidth="0.8" fill="none" opacity="0.6" />
        <path d="M100,49.2 L100,49.2" />
        {/* the hood's rolled edge framing it all */}
        <path d={OPENING_D} fill="none" stroke="#24282d" strokeWidth="3" />
        <path d="M82,34 C83,22 90,15.4 100,15.4 C110,15.4 117,22 118,34" stroke={TOP} strokeWidth="1" fill="none" opacity="0.45" />
      </g>

      {/* ================= CHAIN: chunky Cuban link and a medallion */}
      <g className="t2-chain">
        <path d="M84,98 C86,116 93,128 100,131 C107,128 114,116 116,98" stroke="#000" strokeWidth="4.6" fill="none" opacity="0.55" filter="url(#t2-soft)" />
        <path d="M84,96.6 C86,114.6 93,126.6 100,129.6 C107,126.6 114,114.6 116,96.6" stroke="url(#t2-gold)" strokeWidth="3.6" fill="none" strokeDasharray="2.6 0.6" />
        <path d="M84,96 C86,114 93,126 100,129 C107,126 114,114 116,96" stroke="#fff6cc" strokeWidth="0.8" fill="none" strokeDasharray="1.2 2" opacity="0.85" />
        {/* the medallion */}
        <circle cx="100" cy="137.4" r="7.6" fill="#000" opacity="0.5" filter="url(#t2-soft)" />
        <rect x="98.6" y="129" width="2.8" height="3.6" rx="1" fill="url(#t2-gold)" />
        <circle cx="100" cy="137" r="7" fill="url(#t2-medal)" />
        <circle cx="100" cy="137" r="5.2" fill="none" stroke="#8a5c14" strokeWidth="0.7" />
        <circle cx="100" cy="137" r="5.2" fill="none" stroke="#fff3b8" strokeWidth="0.4" strokeDasharray="0.6 0.9" />
        <path d="M100,133.2 L101.2,136 L104,137 L101.2,138 L100,140.8 L98.8,138 L96,137 L98.8,136 Z" fill="#fffbe8" />
        <circle cx="97.6" cy="134.6" r="1.2" fill="#fff" opacity="0.85" className="t2-glint" />
      </g>

      {/* ================= GUN ARM, hanging: pistol along the thigh */}
      <g className="t2-arm t2-arm-down">
        <path d="M62,92 C46,90 37,100 35,116 L32,194 C32,200 36,203 41,203 L54,204 C56,182 58,152 59,122 Z" fill="url(#t2-sleeve)" />
        <path d="M33.6,146 C40,151 48,150 56,144 M34,155 C41,159 49,158 56.6,152" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.8" filter="url(#t2-soft)" />
        <path d="M34.4,143.8 C40.4,148.6 48,147.8 55.6,142" stroke={TOP} strokeWidth="0.6" fill="none" opacity="0.25" />
        <path d="M53,92 C45,94 39,101 37,112" stroke={TOP} strokeWidth="1.6" fill="none" opacity="0.4" filter="url(#t2-soft)" />
        <path d="M36,110 C34.4,140 33.4,170 32.4,196" stroke={RIM} strokeWidth="1" fill="none" opacity="0.8" />
        <path d="M37.4,191 L54.6,192 L54.2,204 L37,203 Z" fill="#0b0c0d" />
        {[40, 43, 46, 49, 52].map((x) => (
          <path key={x} d={`M${x},191.4 L${x - 0.2},203.4`} stroke="#1f2124" strokeWidth="0.5" />
        ))}
        <g transform="translate(-4 -10)">
          {/* pistol, slide-top to camera, muzzle down along the thigh */}
          <path d="M45.2,232 L51.4,232 L51.2,262 C51.2,264 50,265 48.3,265 C46.6,265 45.4,264 45.4,262 Z" fill="url(#t2-slidetop)" />
          <path d="M46.2,234 L46.4,262" stroke={RIM} strokeWidth="0.55" opacity="0.6" />
          <path d="M50.4,234 L50.2,262" stroke="#000" strokeWidth="0.6" opacity="0.7" />
          <path d="M46,240 L50.6,240 M46,243 L50.6,243 M46,246 L50.6,246" stroke="#000" strokeWidth="0.4" opacity="0.5" />
          <ellipse cx="48.3" cy="264.6" rx="2.6" ry="0.9" fill="#0a0908" />
          <path d="M51.3,236 C53.6,238 54,244 52.2,247 L51.3,247" fill="none" stroke="#26231f" strokeWidth="1.3" />
          <DownHand />
        </g>
      </g>

      {/* ================= BOTH ARMS UP: a two-handed grip, pistol upright.
          Seen from the front the arms are foreshortened toward the lens and
          converge on the gun just off his face: his right arm a short fat
          tube from the near shoulder, his left reaching across his chest with
          a slight sag at the elbow, the support hand wrapped over the fist. */}
      <g className="t2-arm-up">
        <g className="t2-recoil">
          {/* support arm (his left), across the chest */}
          <path d="M152,94 C142,91 126,93 110,91.4 C102,90.6 96,90 90,90.6 L88.6,110.6 C95,111 104,112 113,115.6 C125,120.4 140,122 151,118 C158,113 159,99 152,94 Z" fill="url(#t2-sleeve)" />
          <path d="M150.6,94 C141,91.4 126,93.4 110,91.8 C102,91 96,90.4 90.4,91" stroke={TOP} strokeWidth="1.3" fill="none" opacity="0.45" filter="url(#t2-soft)" />
          <path d="M151,93.6 C141,90.6 126,92.6 110,91" stroke={RIM} strokeWidth="0.9" fill="none" opacity="0.75" />
          {/* the fleece bunching toward the cuff, and the elbow's sag */}
          <path d="M101,91 C99.4,98 100,105 102.6,112 M108,91.6 C106.4,99 107,106 110,113.6 M115,92.4 C113.8,99.6 114.6,107 117.6,116" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.75" filter="url(#t2-soft)" />
          <path d="M102.2,91 C100.8,97.6 101.4,104 103.8,110.6" stroke={TOP} strokeWidth="0.5" fill="none" opacity="0.3" />
          <path d="M124,118 C130,114 138,114 146,117" stroke="#000" strokeWidth="1.8" fill="none" opacity="0.6" filter="url(#t2-soft)" />
          <ellipse cx="132" cy="102" rx="12" ry="5" fill={TOP} opacity="0.07" filter="url(#t2-softer)" />
          {/* its ribbed cuff */}
          <path d="M86.4,90 L93.4,89.6 L93,111.6 L86,111.2 Z" fill="#0b0c0d" />
          {[92, 95.6, 99.2, 102.8, 106.4].map((y) => (
            <path key={y} d={`M86.6,${y} L93.2,${y - 0.2}`} stroke="#1f2124" strokeWidth="0.5" />
          ))}

          {/* gun arm (his right): a short foreshortened tube from the near shoulder */}
          <path d="M38,90 C37,78 46,69 57,69 C66,69 74,74 78,82 C82,90 82,102 77,110 C72,117 62,120 52,118 C43,116 38,106 38,98 Z" fill="url(#t2-sleeve)" />
          <path d="M39.6,100 C44,110 56,115 69,111" stroke="#000" strokeWidth="1.7" fill="none" opacity="0.85" filter="url(#t2-soft)" />
          <path d="M40.2,98.4 C44.6,108.4 56.6,113.4 68.6,109.4" stroke={TOP} strokeWidth="0.6" fill="none" opacity="0.3" />
          <path d="M44,74 C52,68 64,68 72,74" stroke={TOP} strokeWidth="1.8" fill="none" opacity="0.4" filter="url(#t2-soft)" />
          <path d="M38.4,86 C38,76 45,69 54,68" stroke={RIM} strokeWidth="1.1" fill="none" opacity="0.85" />

          {/* the pistol upright, end-on, in both hands. Local coordinates are
              the old gun's: muzzle at (100,67.6), fist at (100,100). */}
          <g transform="translate(-30 -3.6)">
            {/* ribbed cuff round the gun wrist */}
            <ellipse cx="100" cy="100" rx="16" ry="14.5" fill="#0b0b0c" />
            <ellipse cx="100" cy="100" rx="12.4" ry="11" fill="#151517" />
            {/* magazine base out of the bottom of the grip */}
            <path d="M95,110 L105,110 L104.8,117 C104.8,119 95.2,119 95.2,117 Z" fill="#141416" />
            <rect x="94.6" y="116" width="10.8" height="3" rx="1" fill="#1d1d20" />
            <path d="M95.6,111 L95.6,117" stroke={RIM} strokeWidth="0.4" opacity="0.4" />
            {/* the gun fist: fingers round the front strap */}
            <path d="M88,90 C88,86 92,85 100,85 C108,85 112,86 112,90 L112,108 C112,113 107,115 100,115 C93,115 88,113 88,108 Z" fill="url(#t2-hand)" />
            {/* shooting thumb, forward along the frame */}
            <path d="M110,84 C114.6,83 116.4,87.6 115.4,92.6 C114.6,96 112,97 110.2,95.4 Z" fill="url(#t2-hand)" />
            <path d="M111,85 C113.6,84.6 115.4,86.8 115,90.4" stroke="#1f1008" strokeWidth="0.7" fill="none" />

            {/* the support hand: heel on the far side of the grip, four
                fingers wrapped over the front of the gun fist, thumb forward
                under the other one */}
            <path d="M106,86.6 C112,84.6 120.4,86.4 122.4,92.4 L123.2,109.6 C122.4,116 116.4,118.4 110.4,117.2 Z" fill="url(#t2-hand)" />
            <path d="M122.6,93 C123.4,100 123.6,106 123,110" stroke={RIM} strokeWidth="0.7" fill="none" opacity="0.75" />
            {[95.6, 101, 106.4, 111.6].map((y, i) => (
              <g key={y}>
                <path
                  d={`M${121 - i * 0.4},${y - 2.5} L${92.4 + i * 0.8},${y - 2.3} C${89.8 + i * 0.8},${y - 2.3} ${89.2 + i * 0.8},${y + 2.3} ${91.8 + i * 0.8},${y + 2.5} L${121 - i * 0.4},${y + 2.7} Z`}
                  fill="url(#t2-hand)"
                />
                <path d={`M${121 - i * 0.4},${y + 2.7} L${91.8 + i * 0.8},${y + 2.5}`} stroke="#1f1008" strokeWidth="0.9" fill="none" />
                <path d={`M${119 - i * 0.4},${y - 1.9} L${94 + i * 0.8},${y - 1.7}`} stroke="#a77352" strokeWidth="0.6" fill="none" opacity="0.55" />
                {/* knuckle creases where the fingers bend round */}
                <path d={`M${92.6 + i * 0.8},${y - 1.6} C${91.6 + i * 0.8},${y - 0.4} ${91.6 + i * 0.8},${y + 0.8} ${92.6 + i * 0.8},${y + 1.9}`} stroke="#1f1008" strokeWidth="0.6" fill="none" opacity="0.7" />
              </g>
            ))}
            {/* small knuckle ink, no letters, and two gold rings */}
            <path d="M104,95.6 l1,-1 1,1 -1,1 z M104,101 l1,-1 1,1 -1,1 z M104,106.4 l1,-1 1,1 -1,1 z" fill="#1a0e08" opacity="0.85" />
            <path d="M98,98.4 L98.4,103.6" stroke="url(#t2-gold)" strokeWidth="1.8" />
            <path d="M99,109.2 L99.4,114.2" stroke="url(#t2-gold)" strokeWidth="1.8" />
            <circle cx="98.2" cy="99.6" r="0.55" fill="#fff" />
            {/* support thumb, forward under the shooting thumb */}
            <path d="M113,92.6 C117.4,91.6 119.4,96 118.6,100.6 C117.8,103.6 115,104.4 113.2,102.8 Z" fill="url(#t2-hand)" />
            <path d="M114,93.6 C116.6,93.2 118.4,95.4 118,98.6" stroke="#1f1008" strokeWidth="0.7" fill="none" />

            {/* trigger guard, dust cover */}
            <path d="M92.5,80 L92.5,86 C92.5,90.5 107.5,90.5 107.5,86 L107.5,80" stroke="#1c1c1f" strokeWidth="2.3" fill="none" />
            <path d="M91,76 L109,76 L109,82 L91,82 Z" fill="#161618" />
            {/* the slide, a few degrees off the lens axis so its length reads:
                a sliver of the top and the right side running back to the
                rear sight, cocking serrations on the side */}
            <path d="M88.5,61.5 L92.8,58.6 L116.2,58.6 L111.5,61.5 Z" fill="#4a4e55" />
            <path d="M92.8,58.6 L116.2,58.6" stroke={TOP} strokeWidth="0.6" opacity="0.7" />
            <path d="M111.5,61.5 L116.2,58.6 L116.2,73.4 L111.5,77.5 Z" fill="url(#t2-slidetop)" />
            {[0, 1, 2, 3].map((k) => (
              <path key={k} d={`M${112.6 + k * 0.9},${60.9 - k * 0.55} L${112.6 + k * 0.9},${75.2 - k * 0.9}`} stroke="#0c0c0e" strokeWidth="0.45" />
            ))}
            <path d="M116.2,58.6 L116.2,73.4" stroke={RIM} strokeWidth="0.5" opacity="0.7" />
            <rect x="111.4" y="55.6" width="4.4" height="3.2" rx="0.5" fill="#1d1d20" />
            {/* the muzzle face: square, the bore, the front sight */}
            <rect x="88.5" y="61.5" width="23" height="16" rx="1.4" fill="url(#t2-polymer)" />
            <rect x="89.1" y="62.1" width="21.8" height="14.8" rx="1.1" fill="none" stroke="#5a5a62" strokeWidth="0.4" opacity="0.6" />
            <circle cx="100" cy="67.6" r="3" fill="#2a2a2e" />
            <circle cx="100" cy="67.6" r="2.3" fill="#000" />
            <path d="M89,62.3 L111,62.3" stroke={TOP} strokeWidth="0.8" opacity="0.6" />
            <rect x="98.7" y="58.4" width="2.6" height="3.4" rx="0.4" fill="#1d1d20" />
            <circle cx="100" cy="59.8" r="0.55" fill="#7dffb0" />
            {SHOTS.map((k) => (
              <g key={k} className={`t2-muzzle t2-muzzle-${k}`}>
                <circle cx="100" cy="67.6" r="22" fill="url(#t2-flashglow)" />
                <path d={FLASH_D} fill="#ffd27a" />
                <path d={FLASH_D} fill="#fff6dc" transform="translate(100 67.6) scale(0.55) translate(-100 -67.6)" />
                <circle cx="100" cy="67.6" r="3.6" fill="#ffffff" />
              </g>
            ))}
            {SHOTS.map((k) => (
              <rect key={k} className={`t2-casing t2-casing-${k}`} x="86" y="64" width="2.6" height="5.4" rx="0.7" fill="#c9a04a" />
            ))}
          </g>
          <g transform="translate(-30 -3.6)">
            <g className="t2-gunsmoke" fill="none" stroke="#d8e2de" strokeLinecap="round" filter="url(#t2-softer)">
              <path className="t2-gs t2-gs-a" d="M100,62 C96,54 104,46 99,36 C95,28 102,20 98,10" strokeWidth="3" />
              <path className="t2-gs t2-gs-b" d="M100,62 C105,54 97,44 103,34 C108,26 101,18 105,8" strokeWidth="2.4" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

/* tan work boot, front view: a bulbous toe box, the padded collar showing
   under the stacked denim, laces through brass eyelets, a two-tone lug sole.
   x is the boot's left edge; toe turns it out (-1 left, +1 right). */
function Boot({ x, toe }) {
  const t = toe * 5;
  const w = 40;
  return (
    <g>
      {/* lug sole: dark rubber under a tan midsole */}
      <path d={`M${x - 2 + t},390 L${x + w + 1 + t * 0.4},390 C${x + w + 2 + t * 0.4},393 ${x + w + 2 + t * 0.4},396 ${x + w + t * 0.4},398 L${x + t},398 C${x - 2.4 + t},396 ${x - 3 + t},393 ${x - 2 + t},390 Z`} fill="#2a1d12" />
      <path d={`M${x - 2 + t},389 L${x + w + 1 + t * 0.4},389 L${x + w + 1.4 + t * 0.4},392.4 L${x - 2.4 + t},392.4 Z`} fill="#a8824e" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={x + 0.4 + t + i * 4.5} y="396.2" width="2.4" height="1.8" fill="#120c07" />
      ))}
      <path d={`M${x - 1 + t},390.6 L${x + w + t * 0.4},390.6`} stroke="#e8c98a" strokeWidth="0.45" strokeDasharray="1 0.7" />
      {/* the upper: shaft hidden by the stack, toe box swelling out */}
      <path
        d={`M${x + 5},356 L${x + w - 5},356 C${x + w - 1},364 ${x + w + 1 + t * 0.4},374 ${x + w + 1 + t * 0.4},382 C${x + w + 1 + t * 0.4},386 ${x + w - 1 + t * 0.4},389 ${x + w - 4 + t * 0.4},389 L${x + 2 + t},389 C${x - 1 + t},389 ${x - 2 + t},386 ${x - 2 + t},382 C${x - 2 + t},374 ${x + 1},364 ${x + 5},356 Z`}
        fill="url(#t2-boot)"
      />
      {/* nubuck: soft, matt, darker at the sides */}
      <path
        d={`M${x + 5},356 L${x + w - 5},356 C${x + w - 1},364 ${x + w + 1 + t * 0.4},374 ${x + w + 1 + t * 0.4},382 C${x + w + 1 + t * 0.4},386 ${x + w - 1 + t * 0.4},389 ${x + w - 4 + t * 0.4},389 L${x + 2 + t},389 C${x - 1 + t},389 ${x - 2 + t},386 ${x - 2 + t},382 C${x - 2 + t},374 ${x + 1},364 ${x + 5},356 Z`}
        fill="url(#t2-form)"
        opacity="0.7"
      />
      {/* toe cap seam and the scuffed bulge it holds */}
      <ellipse cx={x + w / 2 + t * 0.6} cy="383" rx="12" ry="5" fill="#f3c98a" opacity="0.45" filter="url(#t2-soft)" />
      <path d={`M${x + 0.6 + t * 0.7},378.6 C${x + 9 + t * 0.6},375 ${x + w - 9 + t * 0.5},375 ${x + w - 0.6 + t * 0.4},378.6`} stroke="#6a4116" strokeWidth="0.9" fill="none" />
      <path d={`M${x + 0.8 + t * 0.7},380 C${x + 9 + t * 0.6},376.4 ${x + w - 9 + t * 0.5},376.4 ${x + w - 0.8 + t * 0.4},380`} stroke="#e8c98a" strokeWidth="0.4" strokeDasharray="0.9 0.7" fill="none" />
      {/* tongue, laces, brass eyelets */}
      <path d={`M${x + 12},356 L${x + w - 12},356 L${x + w - 11.2},376 L${x + 11.2},376 Z`} fill="#c58a42" />
      {[359, 364, 369, 374].map((y) => (
        <g key={y}>
          <circle cx={x + 11.4} cy={y} r="0.9" fill="#d9b45a" stroke="#5a3410" strokeWidth="0.3" />
          <circle cx={x + w - 11.4} cy={y} r="0.9" fill="#d9b45a" stroke="#5a3410" strokeWidth="0.3" />
          <path d={`M${x + 11.4},${y} L${x + w - 11.4},${y + 2.6} M${x + w - 11.4},${y} L${x + 11.4},${y + 2.6}`} stroke="#6a3e12" strokeWidth="1" />
        </g>
      ))}
      {/* headlight catching the edge of the toe from behind */}
      <path d={`M${x - 1.6 + t},385 C${x - 1.6 + t},376 ${x + 1.4},366 ${x + 4.6},357`} stroke="#fff3dc" strokeWidth="0.8" fill="none" opacity="0.65" />
      <path d={`M${x + w + 0.8 + t * 0.4},385 C${x + w + 0.8 + t * 0.4},376 ${x + w - 1.4},366 ${x + w - 4.6},357`} stroke="#fff3dc" strokeWidth="0.6" fill="none" opacity="0.45" />
    </g>
  );
}

/* denim stacked over the boot: the extra length piles up, so the silhouette
   bulges out in lumps wider than the leg, and the folds run as short Z
   creases alternating from either side — not rings round a tube */
function Stack({ x, y, w, seed, lean = 0 }) {
  const rows = 5;
  const h = 39;
  const id = `t2-stack-${seed}`;
  // left and right edges, bulging at each pile
  let left = "";
  let right = "";
  for (let i = 0; i <= rows; i++) {
    const yy = y + (h / rows) * i;
    const sx = lean * (yy - y);
    const bulge = i === 0 ? 0 : 2.2 + rnd(seed, i) * 2.2;
    left += `${i ? " L" : ""}${(x + sx - bulge).toFixed(1)},${yy.toFixed(1)}`;
    right = ` L${(x + w + sx + bulge).toFixed(1)},${yy.toFixed(1)}` + right;
  }
  const bottomL = x + lean * h - 3;
  const bottomR = x + w + lean * h + 3;
  const d = `M${left} C${bottomL + w * 0.3},${y + h + 4} ${bottomR - w * 0.3},${y + h + 4} ${bottomR},${y + h}${right} Z`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill="url(#t2-denim)" />
      <g clipPath={`url(#${id})`}>
        <rect x={x - 10} y={y - 2} width={w + 20} height={h + 8} filter="url(#t2-denimtex)" />
        {Array.from({ length: rows }, (_, i) => {
          const yy = y + 5 + i * (h / rows);
          const sx = lean * (yy - y);
          const fromLeft = (i + seed) % 2 === 0;
          const x0 = fromLeft ? x + sx - 3 : x + w + sx + 3;
          const x1 = fromLeft ? x + sx + w * (0.6 + rnd(seed, i + 7) * 0.25) : x + sx + w * (0.4 - rnd(seed, i + 7) * 0.25);
          const dip = 3 + rnd(seed, i + 11) * 2;
          return (
            <g key={i}>
              <path d={`M${x0},${yy} Q${(x0 + x1) / 2},${yy + dip} ${x1},${yy + dip * 0.4}`} stroke="#03050a" strokeWidth="2" fill="none" opacity="0.85" filter="url(#t2-soft)" />
              <path d={`M${x0},${yy - 2.2} Q${(x0 + x1) / 2},${yy - 2.2 + dip} ${x1},${yy - 2 + dip * 0.4}`} stroke="#6b82b5" strokeWidth="0.8" fill="none" opacity="0.32" />
            </g>
          );
        })}
        <rect x={x - 10} y={y - 2} width={w + 20} height={h + 8} fill="url(#t2-form)" opacity="0.6" />
      </g>
      {/* the hem dragging over the boot's tongue */}
      <path d={`M${bottomL},${y + h} C${bottomL + w * 0.3},${y + h + 4} ${bottomR - w * 0.3},${y + h + 4} ${bottomR},${y + h}`} stroke="#03050a" strokeWidth="1.4" fill="none" />
    </g>
  );
}

/* the off hand: back of the hand to camera, fingers curled under, a star and
   stars-and-lines tattoo, two rings */
function OffHand() {
  return (
    <g transform="translate(1 -11)">
      <path d="M145.5,217 C144.5,224 145,231 147,236 L159,237 C161,231 161.5,224 160,216 Z" fill="url(#t2-hand)" />
      <path d="M147,235 C147,240 150,244.5 154,244.5 C158,244.5 160.6,241 160.2,236 Z" fill="url(#t2-hand)" />
      <path d="M150.6,237 C150.2,239.5 150.8,241.5 151.8,243.4 M153.8,237.2 C153.6,240 154,242 154.8,244 M157,237 C157,239.5 157.4,241 158.2,242.6" stroke="#2a160b" strokeWidth="0.7" fill="none" />
      {/* ink on the back of the hand */}
      <path d="M153,222 l1.3,2.8 3,0.3 -2.3,2 0.7,3 -2.7,-1.6 -2.7,1.6 0.7,-3 -2.3,-2 3,-0.3 z" fill="none" stroke="#1a0e08" strokeWidth="0.7" opacity="0.85" />
      <path d="M148,231 C151,232.6 155,232.6 158.6,231" stroke="#1a0e08" strokeWidth="0.6" fill="none" opacity="0.7" />
      {/* rings */}
      <path d="M150.6,238.6 C151.6,239.4 153,239.4 153.8,238.8" stroke="url(#t2-gold)" strokeWidth="1.4" fill="none" />
      <path d="M154,239.6 C155,240.4 156.6,240.4 157.4,239.6" stroke="url(#t2-gold)" strokeWidth="1.4" fill="none" />
      <path d="M146.8,220 C143.2,222 141.6,228 142.5,233 C143.2,236.8 146.6,237.4 147.7,234.2 C148.2,230 148.4,225 148.7,221 Z" fill="url(#t2-hand)" />
      <path d="M148.4,222 C148,227 147.8,231 147.5,234" stroke="#2a160b" strokeWidth="0.8" fill="none" />
      <path d="M160.6,218 C161.6,224 161.4,231 159.6,236.4" stroke={RIM} strokeWidth="0.7" fill="none" opacity="0.8" />
    </g>
  );
}

function DownHand() {
  return (
    <g>
      <path d="M40.6,216 C39.4,223 39.8,231 41.6,237.5 L55.2,238 C56.6,231 56.8,223 55.6,215.5 Z" fill="url(#t2-hand)" />
      <path d="M41.2,221 C40.4,226 40.6,231 41.6,236 M41,224.5 L43.6,224.8 M41,228.6 L43.8,228.9 M41.4,232.6 L44,232.9" stroke="#2a160b" strokeWidth="0.7" fill="none" />
      <path d="M46,222 l1,-1 1,1 -1,1 z M46,228 l1,-1 1,1 -1,1 z" fill="#1a0e08" opacity="0.8" />
      <path d="M41,226.6 L44,226.8" stroke="url(#t2-gold)" strokeWidth="1.4" />
      <path d="M40.4,222 C39.8,226 40,230 40.6,233" stroke={RIM} strokeWidth="0.7" fill="none" opacity="0.8" />
      <path d="M54.6,219 C57.4,222 57.6,230 55.4,236 C54,238.6 51,238.4 50.4,236 C50.4,231 51.2,225 52,220 Z" fill="url(#t2-hand)" />
      <path d="M52,221 C51.2,226 50.8,231 50.8,235.5" stroke="#2a160b" strokeWidth="0.7" fill="none" />
    </g>
  );
}

const SHOTS = [1, 2, 3];

const FLASH_D = (() => {
  const pts = [];
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 4.5 : i % 4 ? 13 : 18;
    pts.push(`${(100 + Math.cos(a) * r).toFixed(2)},${(67.6 + Math.sin(a) * r).toFixed(2)}`);
  }
  return `M${pts.join(" L")} Z`;
})();

// square, heavy shoulders: a hoodie cut big
const TORSO_D =
  "M84,88 C68,88 56,92 50,104 C47,112 46,124 46,136 L47,198 C47,206 52,212 60,214 L140,214 C148,212 153,206 153,198 L154,136 C154,124 153,112 150,104 C144,92 132,88 116,88 Z";

const HOOD_D =
  "M70,66 C68,34 82,11 100,11 C118,11 132,34 130,66 C130,80 125,90 117,97 L83,97 C75,90 70,80 70,66 Z";

const OPENING_D =
  "M82.5,34 C83.5,22 90.6,16 100,16 C109.4,16 116.5,22 117.5,34 C119.6,48 119.4,66 116,82 C111,90 89,90 84,82 C80.6,66 80.4,48 82.5,34 Z";

const FACE_D =
  "M85.4,34 C86,26 92,21.6 100,21.6 C108,21.6 114,26 114.6,34 C116,44 116,54 114.6,62 L85.4,62 C84,54 84,44 85.4,34 Z";

const BANDANA_D =
  "M82.2,52.6 C88,50 94,50.4 100,49.2 C106,50.4 112,50 117.8,52.6 C120,62 119.4,74 115.4,83 C111.4,89.6 106.2,96 100,104.6 C93.8,96 88.6,89.6 84.6,83 C80.6,74 80,62 82.2,52.6 Z";

// frame-left leg, set out wide; frame-right leg, planted
const LEG_L_D = "M70,206 C65,252 57,304 47,352 L84,357 C89,314 95,264 100,214 Z";
const LEG_R_D = "M100,214 C102,262 105,312 106,356 L139,354 C138,308 136,258 131,206 Z";
