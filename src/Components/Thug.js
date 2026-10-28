// Thug.js — the second take on Mafia's hook, styled like a modern rap video. A
// strip light stutters on over a cold brick wall and he is already standing
// there: black balaclava, a quilted puffer zipped to the chin, a gold Cuban
// link, cargo joggers stacked over white sneakers. He brings a pistol up held
// on its side, extended mag, and fires three rounds at the camera. A red rim
// light from off-frame cuts his edge against the cold key. A Maple Jiu Jitsu
// patch on his chest; no text.
//
// Built off Mafia: same cue machine, same shot effects, same wet-floor
// reflection. The figure is drawn to the same viewBox and feet line.
import React from "react";
import "../Stylesheets/Thug.css";
import usePhases from "../Utils/usePhases";
import mapleLogo from "../Images/maple-logo.png";

// p1 the lamp flashes on and he is already standing there, gun at his side
// p2 he raises it at the viewer; the camera starts a slow push in
// p3-p5 three rounds: each a muzzle flash, recoil, a frame flash and shake,
//    and a casing; smoke curls off the barrel after the first
//
// Plays ONCE and holds — loopAt is null. The smoke, fog and the lamp's sway
// keep running on the held frame; that is ambient, not a restart.
const CUES = [40, 790, 1090, 1370, 1690];

export default function Thug({ mode = "animated", loopAt = null }) {
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt });

  return (
    <div className={`mf th-p${phase} ${isStatic ? "is-static" : ""}`} key={run}>
      <div className="th-world">
        <div className="th-wall" aria-hidden />
        <div className="th-redwash" aria-hidden />
        <div className="th-lamp" aria-hidden>
          <div className="th-cone" />
          <div className="th-wire" />
          <div className="th-shade" />
          <div className="th-bulb" />
        </div>
        <div className="th-fog th-fog-a" aria-hidden />
        <div className="th-fog th-fog-b" aria-hidden />

        <div className="th-card">
          <div className="th-figbox">
            <div className="th-pool" aria-hidden />
            <div className="th-walker">
              <div className="th-shadow" aria-hidden />
              <div className="th-gait">
                <Gangster />
              </div>
              <div className="th-reflect" aria-hidden>
                <Gangster />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="th-cut" aria-hidden />
      <div className="th-flash" aria-hidden />
      <div className="th-vignette" aria-hidden />
      <div className="th-grain" aria-hidden />
    </div>
  );
}

const LIT = "#f3e6cb";

// Front-facing, viewBox 200x400, feet on the bottom edge. Every animated group
// carries no transform attribute — a CSS transform would replace it.
function Gangster() {
  return (
    <svg className="th-man" viewBox="0 0 200 400" aria-hidden>
      <defs>
        <pattern id="th-pin" width="5" height="5" patternUnits="userSpaceOnUse">
          <rect x="2" width="0.5" height="5" fill="#e9dcc0" opacity="0.07" />
        </pattern>
        <filter id="th-cloth" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
        </filter>
        <filter id="th-patchtone" x="-10%" y="-10%" width="120%" height="120%">
          <feColorMatrix type="matrix" values="0.86 0 0 0 0  0 0.84 0 0 0  0 0 0.8 0 0  0 0 0 1 0" />
          <feDropShadow dx="0" dy="0.5" stdDeviation="0.4" floodColor="#000" floodOpacity="0.8" />
        </filter>
        <filter id="th-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="th-softer" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <linearGradient id="th-coat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3d" />
          <stop offset="0.18" stopColor="#1c1c1e" />
          <stop offset="0.6" stopColor="#111112" />
          <stop offset="1" stopColor="#070708" />
        </linearGradient>
        <linearGradient id="th-form" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.65" />
          <stop offset="0.28" stopColor="#000" stopOpacity="0" />
          <stop offset="0.72" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="th-sleeve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#303237" />
          <stop offset="0.3" stopColor="#151619" />
          <stop offset="1" stopColor="#09090a" />
        </linearGradient>
        <linearGradient id="th-trouser" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#070708" />
          <stop offset="0.5" stopColor="#1a1a1c" />
          <stop offset="1" stopColor="#070708" />
        </linearGradient>
        <linearGradient id="th-tie" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3c3c40" />
          <stop offset="0.45" stopColor="#0d0d0e" />
          <stop offset="0.6" stopColor="#262629" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="th-shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2a2d" />
          <stop offset="1" stopColor="#0e0e0f" />
        </linearGradient>
        <linearGradient id="th-hat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#47474b" />
          <stop offset="0.45" stopColor="#1c1c1e" />
          <stop offset="1" stopColor="#0b0b0c" />
        </linearGradient>
        <linearGradient id="th-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c99a75" />
          <stop offset="0.45" stopColor="#c59672" />
          <stop offset="0.8" stopColor="#a87a5c" />
          <stop offset="1" stopColor="#8a5f46" />
        </linearGradient>
        <linearGradient id="th-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8e877e" />
          <stop offset="0.18" stopColor="#4b4640" />
          <stop offset="0.7" stopColor="#2b2724" />
          <stop offset="1" stopColor="#1a1816" />
        </linearGradient>
        <linearGradient id="th-slidetop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7b746b" />
          <stop offset="0.35" stopColor="#3f3a35" />
          <stop offset="1" stopColor="#1c1a18" />
        </linearGradient>
        <radialGradient id="th-flashglow">
          <stop offset="0" stopColor="#fff3cf" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffb347" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="th-bushing" cx="0.45" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#7d766d" />
          <stop offset="1" stopColor="#2a2623" />
        </radialGradient>
        <linearGradient id="th-glove" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3e" />
          <stop offset="0.35" stopColor="#141415" />
          <stop offset="1" stopColor="#060606" />
        </linearGradient>
        <clipPath id="th-bala-clip">
          <path d={BALA_D} />
        </clipPath>
        <clipPath id="th-eye-clip">
          <path d={EYE_D} />
        </clipPath>
        <linearGradient id="th-puffer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34363c" />
          <stop offset="0.25" stopColor="#17181b" />
          <stop offset="1" stopColor="#08080a" />
        </linearGradient>
        <linearGradient id="th-knit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2d31" />
          <stop offset="0.5" stopColor="#141416" />
          <stop offset="1" stopColor="#0a0a0b" />
        </linearGradient>
        <pattern id="th-rib" width="1.6" height="4" patternUnits="userSpaceOnUse">
          <rect width="0.6" height="4" fill="#d6deef" opacity="0.06" />
        </pattern>
        <linearGradient id="th-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0a8" />
          <stop offset="0.35" stopColor="#e0b13a" />
          <stop offset="0.7" stopColor="#a8761a" />
          <stop offset="1" stopColor="#f2cf62" />
        </linearGradient>
        <linearGradient id="th-sneaker" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f4f6" />
          <stop offset="1" stopColor="#c4c4cc" />
        </linearGradient>
        <linearGradient id="th-polymer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3b40" />
          <stop offset="0.3" stopColor="#1c1c1f" />
          <stop offset="1" stopColor="#0c0c0d" />
        </linearGradient>
        <clipPath id="th-torso-clip">
          <path d={TORSO_D} />
        </clipPath>
      </defs>

      {/* ---- legs: loose black cargo joggers stacked over white sneakers ---- */}
      <g className="th-leg th-leg-l">
        <path d="M72.0,396 C71.0,387 75.0,379.5 88.5,379.5 C101.5,379.5 105.0,387 104.5,396 Z" fill="url(#th-sneaker)" />
        <path d="M71.0,396 L105.5,396 L105.5,391.4 C93.5,393 81.5,393 70.8,391.4 Z" fill="#d6d6dc" />
        <path d="M70.8,391.4 C81.5,393 93.5,393 105.5,391.4" stroke="#8e8e96" strokeWidth="0.6" fill="none" />
        <path d="M76.0,388 C82.5,385.6 94.5,385.6 99.5,388" stroke="#b4b4bc" strokeWidth="0.6" fill="none" />
        <path d="M84.5,381.6 L92.5,381.6 M85.0,383.7 L92.0,383.7" stroke="#8c8c94" strokeWidth="0.7" />
        <ellipse cx="84.5" cy="386" rx="5" ry="1.2" fill="#fff" opacity="0.6" filter="url(#th-soft)" />
        <path d="M73,202 C73,262 75.5,330 78,380 L99.5,381 C99.5,330 100,262 100.5,204 Z" fill="#0f0f11" />
        <path d="M74.6,204 C74.6,262 77,330 79.4,378" stroke="#000" strokeWidth="2.8" fill="none" opacity="0.6" filter="url(#th-soft)" />
        <ellipse cx="88.5" cy="232" rx="7" ry="20" fill="#cfd6e6" opacity="0.05" filter="url(#th-soft)" />
        <path d="M71.6,250 L81.6,249 L82.1,281 C78.6,283.5 73.6,283.5 72.0,281 Z" fill="#0b0b0d" />
        <path d="M71.3,247.5 L82.0,246.5 L82.19999999999999,254 L71.6,255 Z" fill="#151518" />
        <path d="M71.3,247.5 L82.0,246.5" stroke="#cfd6e6" strokeWidth="0.6" opacity="0.12" />
        <path d="M79.5,300 C84.5,303 92.5,303 97.5,300" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.45" filter="url(#th-soft)" />
        <path d="M78.0,350 C83.5,352.6 93.5,352.6 99.0,350" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.7" filter="url(#th-soft)" />
        <path d="M78.3,353 C83.5,355.6 93.5,355.6 98.7,353" stroke="#cfd6e6" strokeWidth="0.8" fill="none" opacity="0.07" filter="url(#th-soft)" />
        <path d="M78.6,360 C83.5,362.6 93.5,362.6 98.4,360" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.7" filter="url(#th-soft)" />
        <path d="M78.9,363 C83.5,365.6 93.5,365.6 98.1,363" stroke="#cfd6e6" strokeWidth="0.8" fill="none" opacity="0.07" filter="url(#th-soft)" />
        <path d="M79.2,369 C83.5,371.6 93.5,371.6 97.8,369" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.7" filter="url(#th-soft)" />
        <path d="M79.5,372 C83.5,374.6 93.5,374.6 97.5,372" stroke="#cfd6e6" strokeWidth="0.8" fill="none" opacity="0.07" filter="url(#th-soft)" />
      </g>
      <g className="th-leg th-leg-r">
        <path d="M98.5,396 C97.5,387 101.5,379.5 115,379.5 C128,379.5 131.5,387 131,396 Z" fill="url(#th-sneaker)" />
        <path d="M97.5,396 L132,396 L132,391.4 C120,393 108,393 97.3,391.4 Z" fill="#d6d6dc" />
        <path d="M97.3,391.4 C108,393 120,393 132,391.4" stroke="#8e8e96" strokeWidth="0.6" fill="none" />
        <path d="M102.5,388 C109,385.6 121,385.6 126,388" stroke="#b4b4bc" strokeWidth="0.6" fill="none" />
        <path d="M111,381.6 L119,381.6 M111.5,383.7 L118.5,383.7" stroke="#8c8c94" strokeWidth="0.7" />
        <ellipse cx="111" cy="386" rx="5" ry="1.2" fill="#fff" opacity="0.6" filter="url(#th-soft)" />
        <path d="M100,204 C101,262 102,330 104,380 L126,379 C125,330 126.5,262 127.5,202 Z" fill="#0f0f11" />
        <path d="M125.8,204 C125,262 123.6,330 124.6,378" stroke="#000" strokeWidth="2.8" fill="none" opacity="0.6" filter="url(#th-soft)" />
        <ellipse cx="115" cy="232" rx="7" ry="20" fill="#cfd6e6" opacity="0.05" filter="url(#th-soft)" />
        <path d="M118,250 L128,249 L128.5,281 C125,283.5 120,283.5 118.4,281 Z" fill="#0b0b0d" />
        <path d="M117.7,247.5 L128.4,246.5 L128.6,254 L118,255 Z" fill="#151518" />
        <path d="M117.7,247.5 L128.4,246.5" stroke="#cfd6e6" strokeWidth="0.6" opacity="0.12" />
        <path d="M106,300 C111,303 119,303 124,300" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.45" filter="url(#th-soft)" />
        <path d="M104.5,350 C110,352.6 120,352.6 125.5,350" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.7" filter="url(#th-soft)" />
        <path d="M104.8,353 C110,355.6 120,355.6 125.2,353" stroke="#cfd6e6" strokeWidth="0.8" fill="none" opacity="0.07" filter="url(#th-soft)" />
        <path d="M105.1,360 C110,362.6 120,362.6 124.9,360" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.7" filter="url(#th-soft)" />
        <path d="M105.4,363 C110,365.6 120,365.6 124.6,363" stroke="#cfd6e6" strokeWidth="0.8" fill="none" opacity="0.07" filter="url(#th-soft)" />
        <path d="M105.7,369 C110,371.6 120,371.6 124.3,369" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.7" filter="url(#th-soft)" />
        <path d="M106.0,372 C110,374.6 120,374.6 124.0,372" stroke="#cfd6e6" strokeWidth="0.8" fill="none" opacity="0.07" filter="url(#th-soft)" />
      </g>
      <ellipse cx="100" cy="208" rx="30" ry="5" fill="#000" opacity="0.6" filter="url(#th-softer)" />

      {/* ---- off arm: a quilted puffer sleeve, ribbed cuff, gloved hand ---- */}
      <g className="th-arm th-arm-off">
        <path d="M136,90 C150,88 160,98 162,112 L165,192 C165,197 161,200 156,200 L145,201 C143,180 142,150 141,120 Z" fill="url(#th-sleeve)" />
        <path d="M141.5,112 C148.25,115 157.25,115 164,111" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.8" filter="url(#th-soft)" />
        <ellipse cx="152.75" cy="104" rx="9.25" ry="2.6" fill="#d6deef" opacity="0.07" filter="url(#th-soft)" />
        <path d="M141.5,130 C148.25,133 157.25,133 164,129" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.8" filter="url(#th-soft)" />
        <ellipse cx="152.75" cy="122" rx="9.25" ry="2.6" fill="#d6deef" opacity="0.07" filter="url(#th-soft)" />
        <path d="M141.5,148 C148.25,151 157.25,151 164,147" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.8" filter="url(#th-soft)" />
        <ellipse cx="152.75" cy="140" rx="9.25" ry="2.6" fill="#d6deef" opacity="0.07" filter="url(#th-soft)" />
        <path d="M141.5,166 C148.25,169 157.25,169 164,165" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.8" filter="url(#th-soft)" />
        <ellipse cx="152.75" cy="158" rx="9.25" ry="2.6" fill="#d6deef" opacity="0.07" filter="url(#th-soft)" />
        <path d="M141.5,184 C148.25,187 157.25,187 164,183" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.8" filter="url(#th-soft)" />
        <ellipse cx="152.75" cy="176" rx="9.25" ry="2.6" fill="#d6deef" opacity="0.07" filter="url(#th-soft)" />
        <path d="M146,92 C153,94 159,100 161,110" stroke={LIT} strokeWidth="1.6" fill="none" opacity="0.25" filter="url(#th-soft)" />
        <path d="M144.6,195 L160.4,194 L160.8,203 L145,204 Z" fill="#0a0a0b" />
        <path d="M147,195 L147.2,203.5 M150,194.8 L150.1,203.4 M153,194.6 L153.1,203.2 M156,194.4 L156.1,203 M159,194.2 L159.1,202.9" stroke="#1d1d20" strokeWidth="0.5" />
        <g transform="translate(0 -12)">
        {/* relaxed at his side: the back of the hand, fingers curled under,
            and the thumb lying forward along the front */}
        <path d="M145.5,217 C144.5,224 145,231 147,236 L158.5,237 C160.5,231 161,224 159.5,216 Z" fill="url(#th-glove)" />
        <path d="M147,235 C147,240 150,244.5 154,244.5 C158,244.5 160.3,241 159.8,236 Z" fill="url(#th-glove)" />
        <path d="M150.5,237 C150.2,239.5 150.8,241.5 151.8,243.4 M153.8,237.2 C153.6,240 154,242 154.8,244 M157,237 C157,239.5 157.4,241 158.2,242.6" stroke="#000" strokeWidth="0.7" fill="none" />
        <path d="M147.2,235 C151,236.4 155,236.4 159.2,235" stroke={LIT} strokeWidth="0.7" fill="none" opacity="0.35" />
        <path d="M145.5,219.5 C150,220.6 155,220.6 159.6,219" stroke="#2c2c30" strokeWidth="0.8" fill="none" />
        <path d="M146.8,220 C143.2,222 141.6,228 142.5,233 C143.2,236.8 146.6,237.4 147.7,234.2 C148.2,230 148.4,225 148.7,221 Z" fill="url(#th-glove)" />
        <path d="M143.3,225 C142.6,228.5 142.7,231.8 143.6,234.4" stroke={LIT} strokeWidth="0.7" fill="none" opacity="0.4" />
        <path d="M148.4,222 C148,227 147.8,231 147.5,234" stroke="#000" strokeWidth="0.8" fill="none" />
        </g>
      </g>

      {/* ---- the hood, bunched behind the neck ---- */}
      <path d="M74,92 C74,74 87,66 100,66 C113,66 126,74 126,92 L119,96 L81,96 Z" fill="#0c0c0e" />

      {/* ---- puffer jacket: horizontal baffles, each a soft sheen over a
           stitched seam, a centre zip, slash pockets and an elastic hem ---- */}
      <path d={TORSO_D} fill="url(#th-puffer)" />
      <g clipPath="url(#th-torso-clip)">
        <path d="M50,104 C75,107.5 125,107.5 150,104" stroke="#000" strokeWidth="1.8" fill="none" opacity="0.85" filter="url(#th-soft)" />
        <ellipse cx="100" cy="95.5" rx="40" ry="3.2" fill="#d6deef" opacity="0.075" filter="url(#th-soft)" />
        <path d="M50,120 C75,123.5 125,123.5 150,120" stroke="#000" strokeWidth="1.8" fill="none" opacity="0.85" filter="url(#th-soft)" />
        <ellipse cx="100" cy="111.5" rx="40" ry="3.2" fill="#d6deef" opacity="0.075" filter="url(#th-soft)" />
        <path d="M50,136 C75,139.5 125,139.5 150,136" stroke="#000" strokeWidth="1.8" fill="none" opacity="0.85" filter="url(#th-soft)" />
        <ellipse cx="100" cy="127.5" rx="40" ry="3.2" fill="#d6deef" opacity="0.075" filter="url(#th-soft)" />
        <path d="M50,152 C75,155.5 125,155.5 150,152" stroke="#000" strokeWidth="1.8" fill="none" opacity="0.85" filter="url(#th-soft)" />
        <ellipse cx="100" cy="143.5" rx="40" ry="3.2" fill="#d6deef" opacity="0.075" filter="url(#th-soft)" />
        <path d="M50,168 C75,171.5 125,171.5 150,168" stroke="#000" strokeWidth="1.8" fill="none" opacity="0.85" filter="url(#th-soft)" />
        <ellipse cx="100" cy="159.5" rx="40" ry="3.2" fill="#d6deef" opacity="0.075" filter="url(#th-soft)" />
        <path d="M50,184 C75,187.5 125,187.5 150,184" stroke="#000" strokeWidth="1.8" fill="none" opacity="0.85" filter="url(#th-soft)" />
        <ellipse cx="100" cy="175.5" rx="40" ry="3.2" fill="#d6deef" opacity="0.075" filter="url(#th-soft)" />
        <rect x="0" y="0" width="200" height="400" fill="url(#th-form)" />
        <rect x="0" y="0" width="200" height="400" filter="url(#th-cloth)" opacity="0.6" />
        <path d="M50,195 C75,198.5 125,198.5 150,195 L150,210 L50,210 Z" fill="#070708" opacity="0.9" />
        <path d="M50,195 C75,198.5 125,198.5 150,195" stroke="#cfd6e6" strokeWidth="0.6" fill="none" opacity="0.12" />
      </g>
      <path d="M100,88 L100,204" stroke="#1a1a1d" strokeWidth="2" />
      <path d="M100,88 L100,204" stroke="#4a4a52" strokeWidth="1.1" strokeDasharray="0.7 0.7" />
      <path d="M63,166 L71,190 M137,166 L129,190" stroke="#000" strokeWidth="1.6" fill="none" opacity="0.9" />
      <path d="M64,165.5 L72,189.5 M136,165.5 L128,189.5" stroke="#cfd6e6" strokeWidth="0.5" fill="none" opacity="0.12" />

      {/* ---- balaclava: one black knit shape over the whole head, a single
           slot for the eyes with a rolled edge; the nose and mouth show only
           as soft form under the fabric ---- */}
      <path d={BALA_D} fill="url(#th-knit)" />
      <g clipPath="url(#th-bala-clip)">
        <rect x="80" y="10" width="40" height="80" fill="url(#th-rib)" />
        <rect x="80" y="10" width="40" height="80" fill="url(#th-form)" opacity="0.7" />
        <ellipse cx="100" cy="24" rx="12" ry="6" fill="#d6deef" opacity="0.1" filter="url(#th-soft)" />
        <path d="M100,60 L100.4,66" stroke="#d6deef" strokeWidth="2.2" opacity="0.06" strokeLinecap="round" filter="url(#th-soft)" />
        <ellipse cx="100" cy="67.5" rx="4.5" ry="1.4" fill="#000" opacity="0.55" filter="url(#th-soft)" />
        <path d="M95,71.5 C98,72.4 102,72.4 105,71.5" stroke="#000" strokeWidth="1.2" fill="none" opacity="0.6" filter="url(#th-soft)" />
      </g>
      <path d={EYE_D} fill="url(#th-skin)" />
      <g clipPath="url(#th-eye-clip)">
        <rect x="84" y="44" width="32" height="16" fill="url(#th-form)" opacity="0.5" />
        <ellipse cx="92" cy="52.5" rx="5.4" ry="3" fill="#6b4331" opacity="0.55" filter="url(#th-soft)" />
        <ellipse cx="108" cy="52.5" rx="5.4" ry="3" fill="#6b4331" opacity="0.55" filter="url(#th-soft)" />
        <path d="M86,48.6 C89.5,47.6 94,47.8 97.6,49.6" stroke="#140c08" strokeWidth="1.9" fill="none" strokeLinecap="round" />
        <path d="M102.4,49.6 C106,47.8 110.5,47.6 114,48.6" stroke="#140c08" strokeWidth="1.9" fill="none" strokeLinecap="round" />
        {[92, 108].map((cx) => (
          <g key={cx}>
            <path d={`M${cx - 4},53 C${cx - 2},51.6 ${cx + 2},51.6 ${cx + 4},53 C${cx + 2},54.1 ${cx - 2},54.1 ${cx - 4},53 Z`} fill="#d6c8b4" />
            <circle cx={cx} cy="52.9" r="1.5" fill="#2a180c" />
            <circle cx={cx} cy="52.9" r="0.7" fill="#050302" />
            <circle cx={cx + 0.55} cy="52.35" r="0.38" fill="#fff6e2" />
            <path d={`M${cx - 4.2},52.9 C${cx - 2},51.2 ${cx + 2},51.2 ${cx + 4.2},52.9`} stroke="#140c08" strokeWidth="1.1" fill="none" />
            <path d={`M${cx - 3.6},54.5 C${cx - 1.6},55.2 ${cx + 1.6},55.2 ${cx + 3.6},54.5`} stroke="#7a5038" strokeWidth="0.6" fill="none" opacity="0.7" />
          </g>
        ))}
        <path d="M99.4,52 L100.6,58" stroke="#e8c2a0" strokeWidth="1" opacity="0.45" />
      </g>
      <path d={EYE_D} fill="none" stroke="#1c1c20" strokeWidth="1.8" />
      <path d="M86.8,47.6 C90,45 110,45 113.2,47.6" stroke="#d6deef" strokeWidth="0.8" fill="none" opacity="0.18" filter="url(#th-soft)" />

      {/* the Maple Jiu Jitsu leaf, sewn on the left breast */}
      <g className="th-patch">
        <ellipse cx="128" cy="130.6" rx="8.4" ry="8.6" fill="#000" opacity="0.5" filter="url(#th-soft)" />
        <image href={mapleLogo} x="120" y="121.8" width="16" height="16.2" preserveAspectRatio="xMidYMid meet" filter="url(#th-patchtone)" />
      </g>

      {/* ---- stand collar zipped up to the chin ---- */}
      <path d="M81,78 C88,73.5 112,73.5 119,78 L121,98 C110,102 90,102 79,98 Z" fill="url(#th-puffer)" />
      <path d="M81,78 C88,73.5 112,73.5 119,78" stroke="#d6deef" strokeWidth="1" fill="none" opacity="0.18" filter="url(#th-soft)" />
      <path d="M80,88 C90,91 110,91 120,88" stroke="#000" strokeWidth="1.3" fill="none" opacity="0.7" filter="url(#th-soft)" />
      <path d="M100,75 L100,100" stroke="#1a1a1d" strokeWidth="2" />
      <path d="M100,75 L100,100" stroke="#4a4a52" strokeWidth="1.1" strokeDasharray="0.7 0.7" />
      <rect x="98.8" y="76" width="2.4" height="5.4" rx="0.8" fill="#9a9aa2" />

      {/* ---- a gold Cuban link over the jacket ---- */}
      <path d="M85,97 C88,114 95,123 100,124 C105,123 112,114 115,97" stroke="#000" strokeWidth="3.6" fill="none" opacity="0.5" filter="url(#th-soft)" />
      <path d="M85,96 C88,113 95,122 100,123 C105,122 112,113 115,96" stroke="url(#th-gold)" strokeWidth="2.8" fill="none" strokeDasharray="2.1 0.5" />
      <path d="M85,95.4 C88,112.4 95,121.4 100,122.4 C105,121.4 112,112.4 115,95.4" stroke="#fff4c4" strokeWidth="0.7" fill="none" strokeDasharray="1.2 1.4" opacity="0.8" />

      {/* ---- gun arm, hanging, pistol pointed at the ground ---- */}
      <g className="th-arm th-arm-down">
        <path d="M64,90 C50,88 40,98 38,112 L35,192 C35,197 39,200 44,200 L55,201 C57,180 58,150 59,120 Z" fill="url(#th-sleeve)" />
        <path d="M35.5,112 C42.4,115 51.599999999999994,115 58.5,113" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.8" filter="url(#th-soft)" />
        <ellipse cx="47.0" cy="104" rx="9.5" ry="2.6" fill="#d6deef" opacity="0.07" filter="url(#th-soft)" />
        <path d="M35.5,130 C42.4,133 51.599999999999994,133 58.5,131" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.8" filter="url(#th-soft)" />
        <ellipse cx="47.0" cy="122" rx="9.5" ry="2.6" fill="#d6deef" opacity="0.07" filter="url(#th-soft)" />
        <path d="M35.5,148 C42.4,151 51.599999999999994,151 58.5,149" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.8" filter="url(#th-soft)" />
        <ellipse cx="47.0" cy="140" rx="9.5" ry="2.6" fill="#d6deef" opacity="0.07" filter="url(#th-soft)" />
        <path d="M35.5,166 C42.4,169 51.599999999999994,169 58.5,167" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.8" filter="url(#th-soft)" />
        <ellipse cx="47.0" cy="158" rx="9.5" ry="2.6" fill="#d6deef" opacity="0.07" filter="url(#th-soft)" />
        <path d="M35.5,184 C42.4,187 51.599999999999994,187 58.5,185" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.8" filter="url(#th-soft)" />
        <ellipse cx="47.0" cy="176" rx="9.5" ry="2.6" fill="#d6deef" opacity="0.07" filter="url(#th-soft)" />
        <path d="M54,92 C47,94 41,100 39,110" stroke={LIT} strokeWidth="1.6" fill="none" opacity="0.25" filter="url(#th-soft)" />
        <path d="M39.6,194 L55.4,195 L55,204 L39.2,203 Z" fill="#0a0a0b" />
        <g transform="translate(0 -12)">
        {/* the pistol, slide-top to camera, muzzle down along the thigh */}
        <path d="M45.2,232 L51.4,232 L51.2,262 C51.2,264 50,265 48.3,265 C46.6,265 45.4,264 45.4,262 Z" fill="url(#th-slidetop)" />
        <path d="M46.2,234 L46.4,262" stroke={LIT} strokeWidth="0.55" opacity="0.55" />
        <path d="M50.4,234 L50.2,262" stroke="#000" strokeWidth="0.6" opacity="0.7" />
        <path d="M46,240 L50.6,240 M46,243 L50.6,243" stroke="#000" strokeWidth="0.4" opacity="0.5" />
        <path d="M47.6,261 L49,261 L49,263.6 L47.6,263.6 Z" fill="#4a4540" />
        <path d="M51.3,236 C53.6,238 54,244 52.2,247 L51.3,247" fill="none" stroke="#26231f" strokeWidth="1.3" />
        <ellipse cx="48.3" cy="264.6" rx="2.6" ry="0.9" fill="#0a0908" />
        {/* the fist round the grip: knuckles to the outside, thumb forward */}
        <path d="M40.6,216 C39.4,223 39.8,231 41.6,237.5 L55.2,238 C56.6,231 56.8,223 55.6,215.5 Z" fill="url(#th-glove)" />
        <path d="M41.2,221 C40.4,226 40.6,231 41.6,236 M41,224.5 L43.6,224.8 M41,228.6 L43.8,228.9 M41.4,232.6 L44,232.9" stroke="#000" strokeWidth="0.7" fill="none" />
        <path d="M40.8,222 C40.2,226 40.4,230 41,233" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.4" />
        <path d="M54.6,219 C57.4,222 57.6,230 55.4,236 C54,238.6 51,238.4 50.4,236 C50.4,231 51.2,225 52,220 Z" fill="url(#th-glove)" />
        <path d="M56.4,224 C56.9,228 56.6,232 55.4,235" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.4" />
        <path d="M52,221 C51.2,226 50.8,231 50.8,235.5" stroke="#000" strokeWidth="0.7" fill="none" />
        <path d="M40.8,219.4 C45.5,220.4 50.5,220.4 55.4,218.8" stroke="#2c2c30" strokeWidth="0.8" fill="none" />
        </g>
      </g>

      {/* ---- gun arm, levelled at the camera and turned on its side ---- */}
      <g className="th-arm-up">
        <g className="th-recoil">
        {/* the puffer sleeve comes at the camera from his right shoulder: a
            fat foreshortened tube, its baffles reading as rings round the cuff */}
        <path d="M38,84 C40,68 54,61 65,65 C77,69 81,84 79,100 C78,112 71,119 60,119 C49,119 43,111 40,101 C38,95 37,89 38,84 Z" fill="url(#th-sleeve)" />
        <path d="M37.5,96 C42,108 56,113 70,106" stroke="#000" strokeWidth="1.6" fill="none" opacity="0.8" filter="url(#th-soft)" />
        <path d="M42,106 C48,116 62,118 74,110" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.8" filter="url(#th-soft)" />
        <ellipse cx="58" cy="100" rx="12" ry="3" fill="#d6deef" opacity="0.07" filter="url(#th-soft)" />
        <path d="M44,70 C52,63 64,63 72,69" stroke={LIT} strokeWidth="1.6" fill="none" opacity="0.25" filter="url(#th-soft)" />
        {/* the pistol held on its side, slide-top in toward his body */}
        <g transform="translate(-16 8.4) rotate(90 100 67.6)">
        {/* ribbed cuff round the wrist */}
        <ellipse cx="100" cy="100" rx="17" ry="15" fill="#0b0b0c" />
        <ellipse cx="100" cy="100" rx="13" ry="11.5" fill="#151517" />
        {/* extended magazine, out past the bottom of the grip */}
        <path d="M94.5,110 L105.5,110 L105.2,122.5 C105.2,124.6 94.8,124.6 94.8,122.5 Z" fill="#141416" />
        <rect x="94" y="121" width="12" height="3.6" rx="1" fill="#1d1d20" />
        <path d="M95.2,112 L95.2,121" stroke="#cfd6e6" strokeWidth="0.5" opacity="0.2" />
        {/* the fist round the grip: three fingers on the front strap */}
        <path d="M88,90 C88,86 92,85 100,85 C108,85 112,86 112,90 L112,108 C112,113 107,115 100,115 C93,115 88,113 88,108 Z" fill="url(#th-glove)" />
        {[92.5, 99.5, 106.5].map((y, i) => (
          <g key={y}>
            <path d={`M${89 + i * 0.6},${y} C${94},${y + 1.6} ${106},${y + 1.6} ${111 - i * 0.6},${y}`} stroke="#050404" strokeWidth="1.1" fill="none" />
            <path d={`M${91 + i},${y + 2.2} C${96},${y + 3.2} ${104},${y + 3.2} ${109 - i},${y + 2.2}`} stroke="#5b4e43" strokeWidth="0.7" fill="none" opacity="0.7" />
          </g>
        ))}
        {/* thumb along the far side of the frame */}
        <path d="M110,84 C115,83 117,88 116,94 C115,98 112,99 110,97 Z" fill="url(#th-glove)" />
        <path d="M111,85 C114,84.5 116,87 115.6,91" stroke="#5b4e43" strokeWidth="0.7" fill="none" />

        {/* trigger guard, dust cover */}
        <path d="M92.5,80 L92.5,86 C92.5,90.5 107.5,90.5 107.5,86 L107.5,80" stroke="#1c1c1f" strokeWidth="2.3" fill="none" />
        <path d="M91,76 L109,76 L109,82 L91,82 Z" fill="#161618" />
        {/* polymer-framed slide, end-on: a square face, the bore, a dotted sight */}
        <rect x="88.5" y="61.5" width="23" height="16" rx="1.4" fill="url(#th-polymer)" />
        <rect x="89.1" y="62.1" width="21.8" height="14.8" rx="1.1" fill="none" stroke="#5a5a62" strokeWidth="0.4" opacity="0.6" />
        <circle cx="100" cy="67.6" r="3" fill="#2a2a2e" />
        <circle cx="100" cy="67.6" r="2.3" fill="#000" />
        <path d="M89,62.3 L111,62.3" stroke="#d6deef" strokeWidth="0.8" opacity="0.55" />
        <rect x="98.7" y="58.4" width="2.6" height="3.4" rx="0.4" fill="#1d1d20" />
        <circle cx="100" cy="59.8" r="0.55" fill="#f4f4f0" />
        {SHOTS.map((k) => (
          <g key={k} className={`th-muzzle th-muzzle-${k}`}>
            <circle cx="100" cy="67.6" r="22" fill="url(#th-flashglow)" />
            <path d={FLASH_D} fill="#ffd27a" />
            <path d={FLASH_D} fill="#fff6dc" transform="translate(100 67.6) scale(0.55) translate(-100 -67.6)" />
            <circle cx="100" cy="67.6" r="3.6" fill="#ffffff" />
          </g>
        ))}
        {SHOTS.map((k) => (
          <rect key={k} className={`th-casing th-casing-${k}`} x="86" y="64" width="2.6" height="5.4" rx="0.7" fill="#c9a04a" />
        ))}
        </g>
        <g transform="translate(-16 8.4)">
        <g className="th-gunsmoke" fill="none" stroke="#d8d2c6" strokeLinecap="round" filter="url(#th-softer)">
          <path className="th-gs th-gs-a" d="M100,62 C96,54 104,46 99,36 C95,28 102,20 98,10" strokeWidth="3" />
          <path className="th-gs th-gs-b" d="M100,62 C105,54 97,44 103,34 C108,26 101,18 105,8" strokeWidth="2.4" />
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

const TORSO_D =
  "M86,84 C72,84 60,89 55,100 C52,108 52,120 52,132 L53,190 C53,198 60,204 70,205 L130,205 C140,204 147,198 147,190 L148,132 C148,120 148,108 145,100 C140,89 128,84 114,84 Z";

const BALA_D =
  "M84,42 C83,26 90,16 100,16 C110,16 117,26 116,42 C116.5,54 115,66 111,73 C107,79 93,79 89,73 C85,66 83.5,54 84,42 Z";

const EYE_D =
  "M86.5,48 C90,45.2 110,45.2 113.5,48 C114.6,51.5 113.8,55 112.8,56.6 C108,58.2 92,58.2 87.2,56.6 C86.2,55 85.4,51.5 86.5,48 Z";
