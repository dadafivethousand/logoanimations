// Mafia.js — a hook for the front of a video. A hanging lamp stutters on in a
// foggy brick alley, a man in a fedora and a belted overcoat walks out of the
// fog straight at the camera, stops under the light, and levels a pistol at
// the viewer, off his right shoulder. A glint off the front sight on the
// click. Dressed all in black. No brand, no text.
//
// HE WALKS AT THE CAMERA, NOT ACROSS IT. Walking out of the depth keeps one
// front-facing figure the whole way: the walk is a scale-up from the vanishing
// point, with a step cycle, a bob and swinging arms on top.
//
// DRAWN TO REAL PROPORTIONS. About seven heads tall under the hat: waist at
// the belt, the coat ending at the knee, and long legs below it. A big head on
// a long torso with short legs is what makes a figure read as a cartoon.
//
// LIT FROM ONE LAMP, ABOVE. Every top plane catches it — hat crown, brim edge,
// shoulders, lapel edges, the top of the slide — and everything facing the
// camera, with a cylinder falloff across the coat so the
// body has a front and sides. The face is lit the whole way — the brim shades
// only the brow — and a cigarette ember warms the jaw.
//
// THE GUN POINTS AT THE VIEWER: a 1911 end-on. Slide face with the barrel
// bushing and bore on top and the recoil spring plug under it, front sight
// blade, dust cover, the front of the trigger guard, and a gloved fist — three
// fingers wrapped round the front strap, thumb along the side — with the shirt
// and coat cuffs behind it and the sleeve foreshortening back to the shoulder.
import React from "react";
import "../Stylesheets/Mafia.css";
import usePhases from "../Utils/usePhases";

// p1 the lamp stutters on: fog and the cone come up
// p2 he walks out of the fog toward the camera
// p3 he stops under the light
// p4 the gun comes up at the viewer, the camera pushes in
// p5 click — a glint off the front sight
//
// Plays ONCE and holds — loopAt is null. The smoke, fog and the lamp's sway
// keep running on the held frame; that is ambient, not a restart.
const CUES = [150, 600, 2700, 3050, 3550];

export default function Mafia({ mode = "animated", loopAt = null }) {
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt });

  return (
    <div className={`mf mf-p${phase} ${isStatic ? "is-static" : ""}`} key={run}>
      <div className="mf-world">
        <div className="mf-wall" aria-hidden />
        <div className="mf-lamp" aria-hidden>
          <div className="mf-cone" />
          <div className="mf-wire" />
          <div className="mf-shade" />
          <div className="mf-bulb" />
        </div>
        <div className="mf-fog mf-fog-a" aria-hidden />
        <div className="mf-fog mf-fog-b" aria-hidden />

        <div className="mf-card">
          <div className="mf-figbox">
            <div className="mf-pool" aria-hidden />
            <div className="mf-walker">
              <div className="mf-shadow" aria-hidden />
              <div className="mf-gait">
                <Gangster />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mf-vignette" aria-hidden />
      <div className="mf-grain" aria-hidden />
    </div>
  );
}

const LIT = "#f3e6cb";

// Front-facing, viewBox 200x400, feet on the bottom edge. Every animated group
// carries no transform attribute — a CSS transform would replace it.
function Gangster() {
  return (
    <svg className="mf-man" viewBox="0 0 200 400" aria-hidden>
      <defs>
        <pattern id="mf-pin" width="5" height="5" patternUnits="userSpaceOnUse">
          <rect x="2" width="0.5" height="5" fill="#e9dcc0" opacity="0.07" />
        </pattern>
        <filter id="mf-cloth" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
        </filter>
        <filter id="mf-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="mf-softer" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <linearGradient id="mf-coat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3d" />
          <stop offset="0.18" stopColor="#1c1c1e" />
          <stop offset="0.6" stopColor="#111112" />
          <stop offset="1" stopColor="#070708" />
        </linearGradient>
        <linearGradient id="mf-form" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.65" />
          <stop offset="0.28" stopColor="#000" stopOpacity="0" />
          <stop offset="0.72" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="mf-sleeve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#353538" />
          <stop offset="0.3" stopColor="#18181a" />
          <stop offset="1" stopColor="#0a0a0b" />
        </linearGradient>
        <linearGradient id="mf-trouser" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#070708" />
          <stop offset="0.5" stopColor="#1a1a1c" />
          <stop offset="1" stopColor="#070708" />
        </linearGradient>
        <linearGradient id="mf-tie" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3c3c40" />
          <stop offset="0.45" stopColor="#0d0d0e" />
          <stop offset="0.6" stopColor="#262629" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="mf-shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2a2d" />
          <stop offset="1" stopColor="#0e0e0f" />
        </linearGradient>
        <linearGradient id="mf-hat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#47474b" />
          <stop offset="0.45" stopColor="#1c1c1e" />
          <stop offset="1" stopColor="#0b0b0c" />
        </linearGradient>
        <linearGradient id="mf-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c99a75" />
          <stop offset="0.45" stopColor="#c59672" />
          <stop offset="0.8" stopColor="#a87a5c" />
          <stop offset="1" stopColor="#8a5f46" />
        </linearGradient>
        <linearGradient id="mf-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8e877e" />
          <stop offset="0.18" stopColor="#4b4640" />
          <stop offset="0.7" stopColor="#2b2724" />
          <stop offset="1" stopColor="#1a1816" />
        </linearGradient>
        <radialGradient id="mf-bushing" cx="0.45" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#7d766d" />
          <stop offset="1" stopColor="#2a2623" />
        </radialGradient>
        <linearGradient id="mf-glove" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3e" />
          <stop offset="0.35" stopColor="#141415" />
          <stop offset="1" stopColor="#060606" />
        </linearGradient>
        <clipPath id="mf-face-clip">
          <path d={FACE_D} />
        </clipPath>
        <clipPath id="mf-torso-clip">
          <path d={TORSO_D} />
        </clipPath>
      </defs>

      {/* ---- legs: each its own group so the step cycle can lift it ---- */}
      <g className="mf-leg mf-leg-l">
        <path d="M77,286 L98,286 L97,384 L80,384 Z" fill="url(#mf-trouser)" />
        <path d="M88,290 L88.5,378" stroke={LIT} strokeWidth="0.7" opacity="0.18" />
        <path d="M80,376 C86,379 92,379 97,376" stroke="#050404" strokeWidth="1.2" fill="none" opacity="0.8" />
        <path d="M73,396 C71,388 76,381 88,381 C98,381 102,388 101,396 Z" fill="#0b0908" />
        <ellipse cx="86" cy="385" rx="6" ry="1.4" fill={LIT} opacity="0.4" filter="url(#mf-soft)" />
        <path d="M76,384 C80,382 86,381.5 92,382" stroke={LIT} strokeWidth="0.8" fill="none" opacity="0.5" />
      </g>
      <g className="mf-leg mf-leg-r">
        <path d="M102,286 L123,286 L120,384 L103,384 Z" fill="url(#mf-trouser)" />
        <path d="M112,290 L111.5,378" stroke={LIT} strokeWidth="0.7" opacity="0.18" />
        <path d="M103,376 C108,379 114,379 120,376" stroke="#050404" strokeWidth="1.2" fill="none" opacity="0.8" />
        <path d="M99,396 C98,388 102,381 112,381 C124,381 129,388 127,396 Z" fill="#0b0908" />
        <ellipse cx="114" cy="385" rx="6" ry="1.4" fill={LIT} opacity="0.4" filter="url(#mf-soft)" />
        <path d="M108,382 C114,381.5 120,382 124,384" stroke={LIT} strokeWidth="0.8" fill="none" opacity="0.5" />
      </g>

      {/* ---- the off arm, hanging, hand loosely curled ---- */}
      <g className="mf-arm mf-arm-off">
        <path d="M134,88 C147,88 155,96 156,110 L159,160 C160,178 161,196 159,214 L145,216 C144,198 143,178 141,160 L138,118 Z" fill="url(#mf-sleeve)" />
        <path d="M146,92 C152,96 155,102 156,110" stroke={LIT} strokeWidth="1.6" fill="none" opacity="0.6" />
        <path d="M150,150 C151,160 151,170 150,180" stroke="#060505" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M145,212 L159,210 L159,216 L145,218 Z" fill="#1e1e20" />
        <path d="M145,217 C143,226 145,238 151,241 C157,243 162,236 161,226 L159,215 Z" fill="url(#mf-glove)" />
        <path d="M147,224 C150,226 155,226 159,224 M147,231 C150,233 155,233 159,231" stroke="#3b322b" strokeWidth="0.8" fill="none" />
      </g>

      {/* ---- shirt and tie, behind the lapels ---- */}
      <path d="M88,80 L112,80 L100,150 Z" fill="url(#mf-shirt)" />
      <path d="M88,80 L95,94 L100,84 L105,94 L112,80 L106,79 L100,82 L94,79 Z" fill="#2c2c2f" />
      <path d="M95,83 L105,83 L103,91 L97,91 Z" fill="#141416" />
      <path d="M97,91 L103,91 L107,140 L100,148 L93,140 Z" fill="url(#mf-tie)" />
      <path d="M100,92 L100,138" stroke={LIT} strokeWidth="0.5" opacity="0.18" />

      {/* ---- overcoat ---- */}
      <path d={TORSO_D} fill="url(#mf-coat)" />
      <g clipPath="url(#mf-torso-clip)">
        <rect x="0" y="0" width="200" height="400" filter="url(#mf-cloth)" />
        {/* folds in the skirt: a shadow with a lit lip beside it */}
        <g fill="none" strokeLinecap="round">
          <path d="M74,184 C72,220 68,254 64,292" stroke="#050404" strokeWidth="2.4" opacity="0.6" filter="url(#mf-soft)" />
          <path d="M76,186 C74,222 71,256 67,292" stroke={LIT} strokeWidth="0.8" opacity="0.12" />
          <path d="M127,184 C129,220 133,254 137,292" stroke="#050404" strokeWidth="2.4" opacity="0.6" filter="url(#mf-soft)" />
          <path d="M92,200 C91,236 90,262 88,292" stroke="#050404" strokeWidth="1.6" opacity="0.45" filter="url(#mf-soft)" />
          <path d="M66,120 C72,128 78,132 82,134" stroke="#050404" strokeWidth="1.4" opacity="0.5" filter="url(#mf-soft)" />
          <path d="M134,120 C128,128 122,132 118,134" stroke="#050404" strokeWidth="1.4" opacity="0.5" filter="url(#mf-soft)" />
        </g>
        <rect x="0" y="0" width="200" height="400" fill="url(#mf-form)" />
        {/* the lamp on the shoulders, from above */}
        <ellipse cx="100" cy="86" rx="58" ry="14" fill={LIT} opacity="0.16" filter="url(#mf-softer)" />
      </g>

      {/* lapels: peaked, the faces a shade up, edges catching the lamp */}
      <path d="M88,80 L100,150 L77,125 L83,120 L71,96 Z" fill="#1b1b1d" />
      <path d="M112,80 L100,150 L123,125 L117,120 L129,96 Z" fill="#1b1b1d" />
      <path d="M88,80 L71,96 L83,120 L77,125" stroke={LIT} strokeWidth="0.9" fill="none" opacity="0.45" />
      <path d="M112,80 L129,96 L117,120 L123,125" stroke={LIT} strokeWidth="0.9" fill="none" opacity="0.45" />
      <path d="M77,125 L100,150 L123,125" stroke="#080606" strokeWidth="1" fill="none" opacity="0.7" />
      {/* the double-breasted overlap, the belt, buttons, pocket flaps */}
      <path d="M100,150 C108,152 114,156 116,162 L118,292" stroke="#080606" strokeWidth="1.3" fill="none" />
      <path d="M101.5,151 C109,153 115,157 117.3,163" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.3" />
      <path d="M59,167 L141,167 L140,178 L60,178 Z" fill="#0a0a0b" />
      <path d="M59,167 L141,167" stroke={LIT} strokeWidth="0.7" opacity="0.3" />
      <rect x="107" y="165.5" width="11" height="14" rx="1.4" fill="none" stroke="#7d7d80" strokeWidth="1.3" />
      <path d="M112.5,167 L112.5,178" stroke="#7d7d80" strokeWidth="1" />
      {[[86, 156], [114, 156], [86, 196], [114, 196]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="2.3" fill="#0b0908" />
          <path d={`M${x - 1.6},${y - 1} A2,2 0 0 1 ${x + 1.6},${y - 1}`} stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.45" />
        </g>
      ))}
      <path d="M64,214 L91,212 L91,217 L64,219 Z" fill="#0d0d0e" />
      <path d="M109,212 L136,214 L136,219 L109,217 Z" fill="#0d0d0e" />
      <path d="M64,214 L91,212 M109,212 L136,214" stroke={LIT} strokeWidth="0.6" opacity="0.25" />
      {/* collar turned up behind the neck */}
      <path d="M84,82 C84,74 88,72 92,72 L94,82 Z M116,82 C116,74 112,72 108,72 L106,82 Z" fill="#1a1a1c" />
      <path d="M84,81 C84,75 87,72.5 91,72.3 M116,81 C116,75 113,72.5 109,72.3" stroke={LIT} strokeWidth="0.8" fill="none" opacity="0.4" />

      {/* ---- head: lit by the lamp, the brim shading only the brow ---- */}
      <path d="M91,68 L109,68 L110,82 L90,82 Z" fill="#7a5440" />
      <path d="M90,74 C95,79 105,79 110,74 L110,82 L90,82 Z" fill="#3e281d" opacity="0.8" />
      <path d="M84,51 C79.5,50 78.5,61 84,64.5 Z" fill="#a8775a" />
      <path d="M83.5,53 C81.5,54 81.5,59 83.5,61" stroke="#6b4634" strokeWidth="0.8" fill="none" />
      <path d="M116,51 C120.5,50 121.5,61 116,64.5 Z" fill="#a8775a" />
      <path d="M116.5,53 C118.5,54 118.5,59 116.5,61" stroke="#6b4634" strokeWidth="0.8" fill="none" />
      <path d={FACE_D} fill="url(#mf-skin)" />
      <g clipPath="url(#mf-face-clip)">
        <rect x="80" y="40" width="40" height="40" fill="url(#mf-form)" opacity="0.55" />
        {/* the brim's shadow across the brow */}
        <rect x="80" y="38" width="40" height="13" fill="#1a0e08" opacity="0.55" filter="url(#mf-soft)" />
        {/* five o'clock shadow on the jaw and lip */}
        <path d="M85,64 C87,72 92,78 100,79 C108,78 113,72 115,64 C112,70 108,74 100,74.5 C92,74 88,70 85,64 Z" fill="#3c3438" opacity="0.35" filter="url(#mf-soft)" />
        <path d="M94,68.5 C97,67.5 103,67.5 106,68.5 L106,70 L94,70 Z" fill="#3c3438" opacity="0.3" filter="url(#mf-soft)" />
        {/* cheekbones catch the lamp; hollows beneath them */}
        <ellipse cx="89" cy="62" rx="3.5" ry="2" fill="#e8bf98" opacity="0.35" filter="url(#mf-soft)" />
        <ellipse cx="111" cy="62" rx="3.5" ry="2" fill="#e8bf98" opacity="0.35" filter="url(#mf-soft)" />
        <path d="M87,66 C89,70 91,72 93,73 M113,66 C111,70 109,72 107,73" stroke="#7a5038" strokeWidth="1.2" fill="none" opacity="0.5" filter="url(#mf-soft)" />
        {/* eye sockets */}
        <ellipse cx="92" cy="56.5" rx="5.5" ry="3.2" fill="#6b4331" opacity="0.6" filter="url(#mf-soft)" />
        <ellipse cx="108" cy="56.5" rx="5.5" ry="3.2" fill="#6b4331" opacity="0.6" filter="url(#mf-soft)" />
        {/* brows, heavy and drawn down toward the nose */}
        <path d="M85.5,53 C88.5,51.6 93.5,51.8 97.5,54.2" stroke="#1d120c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M102.5,54.2 C106.5,51.8 111.5,51.6 114.5,53" stroke="#1d120c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {[92, 108].map((cx) => (
          <g key={cx}>
            <path d={`M${cx - 4},57 C${cx - 2},55.4 ${cx + 2},55.4 ${cx + 4},57 C${cx + 2},58.2 ${cx - 2},58.2 ${cx - 4},57 Z`} fill="#d9cbb8" />
            <circle cx={cx} cy="56.9" r="1.6" fill="#3a2414" />
            <circle cx={cx} cy="56.9" r="0.75" fill="#050302" />
            <circle cx={cx + 0.6} cy="56.3" r="0.4" fill="#fff6e2" />
            <path d={`M${cx - 4.2},56.9 C${cx - 2},55 ${cx + 2},55 ${cx + 4.2},56.9`} stroke="#1a0f0a" strokeWidth="1" fill="none" />
            <path d={`M${cx - 3.6},58.6 C${cx - 1.6},59.4 ${cx + 1.6},59.4 ${cx + 3.6},58.6`} stroke="#7a5038" strokeWidth="0.6" fill="none" opacity="0.7" />
          </g>
        ))}
        {/* nose: lit ridge, shaded side, the tip, nostrils */}
        <path d="M100.6,56 L101.4,63.5" stroke="#f0c9a2" strokeWidth="1.1" opacity="0.6" strokeLinecap="round" />
        <path d="M98.6,56.5 C97.6,60 96.8,63 96.5,65" stroke="#7a5038" strokeWidth="1.1" fill="none" opacity="0.6" filter="url(#mf-soft)" />
        <ellipse cx="100.5" cy="64.6" rx="2.4" ry="1.6" fill="#d9a882" />
        <path d="M96.5,65.6 C97.5,66.8 99,66.8 99.5,66.2 M101.5,66.2 C102,66.8 103.5,66.8 104.5,65.6" stroke="#4a2a1c" strokeWidth="0.9" fill="none" />
        {/* mouth set hard */}
        <path d="M95.5,71 C98,70.2 102,70.2 104.5,71 C102,71.8 98,71.8 95.5,71 Z" fill="#7a4434" />
        <path d="M95.5,71 C98,71.5 102,71.5 104.5,71" stroke="#2a140e" strokeWidth="0.9" fill="none" strokeLinecap="round" />
        <path d="M97,73.2 C99,74 101,74 103,73.2" stroke="#e0b590" strokeWidth="0.8" fill="none" opacity="0.5" />
        <ellipse cx="100" cy="76.6" rx="3" ry="1.2" fill="#e0b590" opacity="0.35" filter="url(#mf-soft)" />
        <ellipse className="mf-emberlight" cx="112" cy="74" rx="10" ry="7" fill="#ff7a2a" opacity="0.18" filter="url(#mf-softer)" />
      </g>

      {/* ---- cigarette, and its smoke ---- */}
      <path d="M104,71.5 L117,70" stroke="#e8dfcf" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M115,70.2 L117,70" stroke="#8a6a4a" strokeWidth="1.8" />
      <circle className="mf-ember" cx="118" cy="69.9" r="1.4" fill="#ff6a1a" />
      <circle cx="118" cy="69.9" r="3.5" fill="#ff7a2a" opacity="0.3" filter="url(#mf-soft)" />
      <g className="mf-smoke" fill="none" stroke="#e9dcc0" strokeLinecap="round" filter="url(#mf-soft)">
        <path className="mf-wisp mf-wisp-a" d="M119,67 C113,59 125,51 119,41 C114,33 123,25 119,17" strokeWidth="1.8" />
        <path className="mf-wisp mf-wisp-b" d="M119,67 C126,59 116,49 123,39 C129,31 121,23 126,13" strokeWidth="1.4" />
        <path className="mf-wisp mf-wisp-c" d="M119,67 C115,61 121,55 117,47 C113,39 119,33 115,25" strokeWidth="1.1" />
      </g>

      {/* ---- fedora: pinched crown, band with a bow, snap brim ---- */}
      <path d="M79,40 C77,27 80,13 88,10 C93,8 97,13 100,12 C103,13 107,8 112,10 C120,13 123,27 121,40 Z" fill="url(#mf-hat)" />
      <path d="M93,11 C95,18 96,27 96,36 M107,11 C105,18 104,27 104,36" stroke="#0e0b09" strokeWidth="1.2" fill="none" opacity="0.6" filter="url(#mf-soft)" />
      <path d="M78,34 C88,37 112,37 122,34 L122,41 C112,43 88,43 78,41 Z" fill="#060607" />
      <path d="M78,34 C88,37 112,37 122,34" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.3" />
      <path d="M80,35.5 L86,36.5 L85,41 L79,40 Z" fill="#18181a" />
      <path d="M64,44 C70,38.5 85,37 100,37 C115,37 130,38.5 136,44 C132,47 123,47 117,47 C111,49 106,50 100,50 C94,50 89,49 83,47 C77,47 68,47 64,44 Z" fill="#121214" />
      <path d="M81.5,19 C83,14 86,11 89,10 C93,8.5 97,13 100,12 C103,13 107,8.5 111,10 C114,11 117,14 118.5,19" stroke={LIT} strokeWidth="1.6" fill="none" opacity="0.65" />
      <path d="M66,43.5 C73,39.5 86,38.2 100,38.2 C114,38.2 127,39.5 134,43.5" stroke={LIT} strokeWidth="1.1" fill="none" opacity="0.55" />
      <path d="M82,47 C88,49 94,50 100,50 C106,50 112,49 118,47" stroke="#050404" strokeWidth="1" fill="none" />

      {/* ---- gun arm, hanging, pistol pointed at the ground ---- */}
      <g className="mf-arm mf-arm-down">
        <path d="M66,88 C53,88 45,96 44,110 L41,160 C40,178 39,196 41,214 L55,216 C56,198 57,178 59,160 L62,118 Z" fill="url(#mf-sleeve)" />
        <path d="M54,92 C48,96 45,102 44,110" stroke={LIT} strokeWidth="1.6" fill="none" opacity="0.6" />
        <path d="M41,212 L55,210 L55,216 L41,218 Z" fill="#1e1e20" />
        <path d="M43,226 L50,226 L50,262 L43,262 Z" fill="url(#mf-steel)" />
        <path d="M43,226 L43,262" stroke={LIT} strokeWidth="0.6" opacity="0.4" />
        <path d="M41,217 C39,226 41,238 47,240 C53,241 57,234 56,226 L55,215 Z" fill="url(#mf-glove)" />
      </g>

      {/* ---- gun arm, levelled at the camera ---- */}
      <g className="mf-arm-up">
        {/* the arm comes straight at the camera from his right shoulder, so
            the sleeve is almost all foreshortened: a short tube flaring to the cuff */}
        <path
          d="M52,90 C56,85 64,84 72,86 C82,89 90,97 90,108 C90,119 81,126 71,126 C60,126 52,119 50,109 C49,102 49,95 52,90 Z"
          fill="url(#mf-sleeve)"
        />
        <path d="M53,89 C58,85.5 66,85 73,86.5" stroke={LIT} strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M56,96 C54,104 56,114 62,121" stroke="#020202" strokeWidth="1.5" fill="none" opacity="0.6" filter="url(#mf-soft)" />
        <path d="M84,93 C88,100 88,112 83,120" stroke="#020202" strokeWidth="1.4" fill="none" opacity="0.55" filter="url(#mf-soft)" />
        <g transform="translate(-28 6)">
        {/* coat cuff, then shirt cuff, round the wrist */}
        <ellipse cx="100" cy="100" rx="17" ry="15" fill="#101011" />
        <path d="M84,96 C88,87 112,87 116,96" stroke={LIT} strokeWidth="0.9" fill="none" opacity="0.45" />
        <ellipse cx="100" cy="100" rx="13" ry="11.5" fill="#1e1e20" />
        <ellipse cx="100" cy="98" rx="11" ry="8" fill="#3a3a3e" opacity="0.7" />

        {/* the fist round the grip: three fingers on the front strap */}
        <path d="M88,90 C88,86 92,85 100,85 C108,85 112,86 112,90 L112,108 C112,113 107,115 100,115 C93,115 88,113 88,108 Z" fill="url(#mf-glove)" />
        {[92.5, 99.5, 106.5].map((y, i) => (
          <g key={y}>
            <path d={`M${89 + i * 0.6},${y} C${94},${y + 1.6} ${106},${y + 1.6} ${111 - i * 0.6},${y}`} stroke="#050404" strokeWidth="1.1" fill="none" />
            <path d={`M${91 + i},${y + 2.2} C${96},${y + 3.2} ${104},${y + 3.2} ${109 - i},${y + 2.2}`} stroke="#5b4e43" strokeWidth="0.7" fill="none" opacity="0.7" />
          </g>
        ))}
        {/* thumb along the far side of the frame */}
        <path d="M110,84 C115,83 117,88 116,94 C115,98 112,99 110,97 Z" fill="url(#mf-glove)" />
        <path d="M111,85 C114,84.5 116,87 115.6,91" stroke="#5b4e43" strokeWidth="0.7" fill="none" />

        {/* trigger guard front, dust cover */}
        <path d="M93,80 L93,85 C93,91 107,91 107,85 L107,80" stroke="#36312d" strokeWidth="2.2" fill="none" />
        <path d="M93.5,86 C95,90 105,90 106.5,86" stroke={LIT} strokeWidth="0.5" fill="none" opacity="0.35" />
        <path d="M91,76 L109,76 L109,82 L91,82 Z" fill="#26221f" />
        <path d="M91,76 L109,76" stroke={LIT} strokeWidth="0.5" opacity="0.3" />

        {/* slide face, end-on: bushing + bore over the recoil spring plug */}
        <rect x="89" y="62" width="22" height="15" rx="2" fill="url(#mf-steel)" />
        <rect x="89.6" y="62.6" width="20.8" height="13.8" rx="1.6" fill="none" stroke="#9a9289" strokeWidth="0.4" opacity="0.5" />
        <circle cx="100" cy="67.6" r="4.8" fill="url(#mf-bushing)" />
        <circle cx="100" cy="67.6" r="4.8" fill="none" stroke="#151311" strokeWidth="0.6" />
        <circle cx="100" cy="67.6" r="2.9" fill="#1c1a18" />
        <circle cx="100" cy="67.6" r="2.3" fill="#000" />
        <circle cx="100" cy="73.6" r="2.1" fill="#3a3632" stroke="#151311" strokeWidth="0.5" />
        <path d="M89.5,62.8 L110.5,62.8" stroke={LIT} strokeWidth="0.9" opacity="0.85" />
        <path d="M99,58.4 L101,58.4 L101.4,62 L98.6,62 Z" fill="#3a3632" />
        <path d="M99,58.4 L101,58.4" stroke={LIT} strokeWidth="0.5" opacity="0.8" />
        <g className="mf-glint">
          <path d="M100,52 L100.9,57.5 L100,63 L99.1,57.5 Z M94.5,57.5 L100,56.6 L105.5,57.5 L100,58.4 Z" fill="#fff8e6" />
        </g>
        </g>
      </g>
    </svg>
  );
}

const FACE_D =
  "M84,42 C83,60 86,72 92,77 C96,80 104,80 108,77 C114,72 117,60 116,42 Z";

const TORSO_D =
  "M88,80 L68,88 C60,91 56,98 56,108 L58,160 C58,166 60,170 62,174 C60,212 56,252 52,292 L148,292 C144,252 140,212 138,174 C140,170 142,166 142,160 L144,108 C144,98 140,91 132,88 L112,80 L100,150 Z";
