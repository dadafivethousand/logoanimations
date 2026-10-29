// Bratva.js — the third take on Mafia's hook: a 1990s Russian gangster. A
// sodium street lamp stutters on over a Soviet panel block at night, snow
// coming down, and he is already standing there: shaved head, heavy brow,
// stubble, a boxy black leather jacket open over a black turtleneck, a thick
// gold chain, track pants with two white stripes and polished black shoes. His
// breath steams in the cold. He brings a pistol up and fires three rounds at
// the camera. A Maple Jiu Jitsu patch on his chest; no text.
//
// Built off Thug: same cue machine, same shot effects, same viewBox and feet
// line, so the three takes cut together.
import React from "react";
import "../Stylesheets/Bratva.css";
import usePhases from "../Utils/usePhases";
import mapleLogo from "../Images/maple-logo.png";

// p1 the lamp flashes on and he is already standing there, gun at his side
// p2 he raises it at the viewer; the camera starts a slow push in
// p3-p5 three rounds: each a muzzle flash, recoil, a frame flash and shake,
//    and a casing; smoke curls off the barrel after the first
//
// Plays ONCE and holds — loopAt is null. Snow, breath, smoke and the lamp's
// sway keep running on the held frame; that is ambient, not a restart.
const CUES = [40, 790, 1090, 1370, 1690];

export default function Bratva({ mode = "animated", loopAt = null }) {
  // ?static on the URL gives the still without editing App.js
  const still = mode === "static" || new URLSearchParams(window.location.search).has("static");
  const { phase, run, isStatic } = usePhases(CUES, { mode: still ? "static" : mode, loopAt });

  return (
    <div className={`br br-p${phase} ${isStatic ? "is-static" : ""}`} key={run}>
      <div className="br-world">
        <div className="br-wall" aria-hidden />
        <div className="br-coldwash" aria-hidden />
        <div className="br-lamp" aria-hidden>
          <div className="br-cone" />
          <div className="br-wire" />
          <div className="br-shade" />
          <div className="br-bulb" />
        </div>
        <div className="br-snow br-snow-far" aria-hidden />

        <div className="br-card">
          <div className="br-figbox">
            <div className="br-ground" aria-hidden />
            <div className="br-pool" aria-hidden />
            <div className="br-walker">
              <div className="br-shadow" aria-hidden />
              <div className="br-gait">
                <Gangster />
              </div>
            </div>
          </div>
        </div>

        <div className="br-snow br-snow-near" aria-hidden />
      </div>

      <div className="br-cut" aria-hidden />
      <div className="br-flash" aria-hidden />
      <div className="br-vignette" aria-hidden />
      <div className="br-grain" aria-hidden />
    </div>
  );
}

// the sodium key, warm amber from above
const LIT = "#ffcf8a";
// the cold fill off the snow, from his left
const COLD = "#b9d2ff";

// Front-facing, viewBox 200x400, feet on the bottom edge. Every animated group
// carries no transform attribute — a CSS transform would replace it.
function Gangster() {
  return (
    <svg className="br-man" viewBox="0 0 200 400" aria-hidden>
      <defs>
        <filter id="br-grainy" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
        </filter>
        <filter id="br-stubble" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="1" seed="11" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.09  0 0 0 0 0.08  0 0 0 1.6 -0.55" />
        </filter>
        <filter id="br-patchtone" x="-10%" y="-10%" width="120%" height="120%">
          <feColorMatrix type="matrix" values="0.86 0 0 0 0  0 0.84 0 0 0  0 0 0.8 0 0  0 0 0 1 0" />
          <feDropShadow dx="0" dy="0.5" stdDeviation="0.4" floodColor="#000" floodOpacity="0.8" />
        </filter>
        <filter id="br-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="br-softer" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <filter id="br-sheen" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
        {/* black leather with a little brown in it, lit from above */}
        <linearGradient id="br-leather" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d322c" />
          <stop offset="0.16" stopColor="#1f1916" />
          <stop offset="0.6" stopColor="#120e0c" />
          <stop offset="1" stopColor="#070505" />
        </linearGradient>
        <linearGradient id="br-lsleeve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#382e29" />
          <stop offset="0.3" stopColor="#1a1513" />
          <stop offset="1" stopColor="#0a0807" />
        </linearGradient>
        <linearGradient id="br-form" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.65" />
          <stop offset="0.28" stopColor="#000" stopOpacity="0" />
          <stop offset="0.72" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="br-knit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24242a" />
          <stop offset="0.5" stopColor="#121215" />
          <stop offset="1" stopColor="#09090b" />
        </linearGradient>
        <pattern id="br-rib" width="1.6" height="4" patternUnits="userSpaceOnUse">
          <rect width="0.6" height="4" fill="#d6deef" opacity="0.07" />
        </pattern>
        <linearGradient id="br-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2b292" />
          <stop offset="0.4" stopColor="#d2a07f" />
          <stop offset="0.8" stopColor="#b17e62" />
          <stop offset="1" stopColor="#8d5f48" />
        </linearGradient>
        <linearGradient id="br-hand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dcaa89" />
          <stop offset="0.5" stopColor="#bf8c6d" />
          <stop offset="1" stopColor="#8f5f48" />
        </linearGradient>
        <radialGradient id="br-headlit" cx="0.5" cy="0.1" r="0.6">
          <stop offset="0" stopColor="#ffe2b8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffe2b8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="br-trouser" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#08080a" />
          <stop offset="0.5" stopColor="#18181c" />
          <stop offset="1" stopColor="#08080a" />
        </linearGradient>
        <linearGradient id="br-shoe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3330" />
          <stop offset="0.35" stopColor="#141110" />
          <stop offset="1" stopColor="#050404" />
        </linearGradient>
        <linearGradient id="br-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0a8" />
          <stop offset="0.35" stopColor="#e0b13a" />
          <stop offset="0.7" stopColor="#a8761a" />
          <stop offset="1" stopColor="#f2cf62" />
        </linearGradient>
        <linearGradient id="br-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a8680" />
          <stop offset="0.25" stopColor="#47443f" />
          <stop offset="1" stopColor="#1b1a18" />
        </linearGradient>
        <radialGradient id="br-flashglow">
          <stop offset="0" stopColor="#fff3cf" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffb347" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
        <clipPath id="br-torso-clip">
          <path d={TORSO_D} />
        </clipPath>
        {/* soft-edged masks for the stubble, so the texture fades out
            instead of stopping at a box edge */}
        <mask id="br-scalp-mask" maskUnits="userSpaceOnUse" x="70" y="0" width="60" height="60">
          <path d="M78.5,39 C78.5,22 88,15 100,15 C112,15 121.5,22 121.5,39 C114,33 107,31 100,31 C93,31 86,33 78.5,39 Z" fill="#fff" filter="url(#br-soft)" />
        </mask>
        <mask id="br-jaw-mask" maskUnits="userSpaceOnUse" x="70" y="40" width="60" height="50">
          <path d="M82,57 C84,69 91,81 100,82 C109,81 116,69 118,57 C115,63 110,65 105,65.6 C103,64.4 97,64.4 95,65.6 C90,65 85,63 82,57 Z" fill="#fff" filter="url(#br-soft)" />
        </mask>
        <clipPath id="br-head-clip">
          <path d={HEAD_D} />
        </clipPath>
      </defs>

      {/* ---- legs: black track pants, two white stripes, polished shoes ---- */}
      <g className="br-leg br-leg-l">
        <path d="M71.5,396 C70.5,388 73,381 84,380 C95,379 103,383 104.5,390 L104.5,396 Z" fill="url(#br-shoe)" />
        <path d="M71,396 L105,396 L105,393.6 C94,394.6 82,394.6 71,393.6 Z" fill="#020202" />
        <path d="M76,384.5 C80,382 88,381.6 93,382.6" stroke={LIT} strokeWidth="1" fill="none" opacity="0.45" filter="url(#br-soft)" />
        <path d="M73,202 C73,262 75.5,330 78,382 L99.5,383 C99.5,330 100,262 100.5,204 Z" fill="url(#br-trouser)" />
        <path d="M74.6,204 C74.6,262 77,330 79.4,380" stroke="#000" strokeWidth="2.8" fill="none" opacity="0.6" filter="url(#br-soft)" />
        <ellipse cx="88.5" cy="232" rx="7" ry="20" fill={COLD} opacity="0.05" filter="url(#br-soft)" />
        <path d="M76.2,206 C76.2,264 78.6,330 81,380" stroke="#eef1f6" strokeWidth="1.25" fill="none" opacity="0.9" />
        <path d="M79.2,206 C79.2,264 81.4,330 83.8,380.4" stroke="#eef1f6" strokeWidth="1.25" fill="none" opacity="0.9" />
        <path d="M84,240 C86,262 86,290 85,318" stroke="#000" strokeWidth="1.6" fill="none" opacity="0.45" filter="url(#br-soft)" />
        <path d="M78.6,364 C83.5,366.6 93.5,366.6 98.4,364" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.6" filter="url(#br-soft)" />
        <path d="M79,372 C83.5,374.6 93.5,374.6 98,372" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.6" filter="url(#br-soft)" />
      </g>
      <g className="br-leg br-leg-r">
        <path d="M95.5,396 C97,389 105,384 116,384 C127,384 130,389 129,396 Z" fill="url(#br-shoe)" />
        <path d="M95,396 L129.5,396 L129.5,393.6 C118,394.6 106,394.6 95,393.6 Z" fill="#020202" />
        <path d="M107,387 C112,385 120,385 124,386.6" stroke={LIT} strokeWidth="1" fill="none" opacity="0.45" filter="url(#br-soft)" />
        <path d="M100,204 C101,262 102,330 104,385 L126,384 C125,330 126.5,262 127.5,202 Z" fill="url(#br-trouser)" />
        <path d="M125.8,204 C125,262 123.6,330 124.6,382" stroke="#000" strokeWidth="2.8" fill="none" opacity="0.6" filter="url(#br-soft)" />
        <ellipse cx="115" cy="232" rx="7" ry="20" fill={COLD} opacity="0.05" filter="url(#br-soft)" />
        <path d="M124.4,206 C123.6,264 122.2,330 122.8,383" stroke="#eef1f6" strokeWidth="1.25" fill="none" opacity="0.9" />
        <path d="M121.4,206 C120.8,264 119.6,330 120.2,383.4" stroke="#eef1f6" strokeWidth="1.25" fill="none" opacity="0.9" />
        <path d="M112,240 C110,262 110,290 111,318" stroke="#000" strokeWidth="1.6" fill="none" opacity="0.45" filter="url(#br-soft)" />
        <path d="M105,366 C110,368.6 120,368.6 125,366" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.6" filter="url(#br-soft)" />
        <path d="M105.4,374 C110,376.6 120,376.6 124.6,374" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.6" filter="url(#br-soft)" />
      </g>
      <ellipse cx="100" cy="208" rx="30" ry="5" fill="#000" opacity="0.6" filter="url(#br-softer)" />

      {/* ---- off arm: a leather sleeve, creased at the elbow, bare hand ---- */}
      <g className="br-arm br-arm-off">
        <path d="M134,88 C150,86 161,96 163,112 L166,194 C166,198 162,201 157,201 L145,202 C143,180 142,150 141,120 Z" fill="url(#br-lsleeve)" />
        <path d="M152,96 C156,120 158,150 159,186" stroke="#fff1dc" strokeWidth="5" fill="none" opacity="0.1" filter="url(#br-sheen)" />
        <path d="M143,142 C149,146 157,145 164,140 M143.5,150 C150,153 157,152 164.4,148" stroke="#000" strokeWidth="1.3" fill="none" opacity="0.8" filter="url(#br-soft)" />
        <path d="M144,140.6 C150,144.4 157,143.6 163.6,138.6" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.35" />
        <path d="M146,92 C153,94 159,100 161,110" stroke={LIT} strokeWidth="1.6" fill="none" opacity="0.3" filter="url(#br-soft)" />
        <path d="M144.6,195 L161.4,194 L161.6,202 L145,203 Z" fill="#0b0908" />
        <path d="M145,197 L161.4,196" stroke={LIT} strokeWidth="0.5" opacity="0.3" />
        <g transform="translate(0 -12)">
          <path d="M145.5,217 C144.5,224 145,231 147,236 L158.5,237 C160.5,231 161,224 159.5,216 Z" fill="url(#br-hand)" />
          <path d="M147,235 C147,240 150,244.5 154,244.5 C158,244.5 160.3,241 159.8,236 Z" fill="url(#br-hand)" />
          <path d="M150.5,237 C150.2,239.5 150.8,241.5 151.8,243.4 M153.8,237.2 C153.6,240 154,242 154.8,244 M157,237 C157,239.5 157.4,241 158.2,242.6" stroke="#6b4332" strokeWidth="0.7" fill="none" />
          <path d="M147.2,235 C151,236.4 155,236.4 159.2,235" stroke={LIT} strokeWidth="0.7" fill="none" opacity="0.35" />
          <path d="M146.8,220 C143.2,222 141.6,228 142.5,233 C143.2,236.8 146.6,237.4 147.7,234.2 C148.2,230 148.4,225 148.7,221 Z" fill="url(#br-hand)" />
          <path d="M148.4,222 C148,227 147.8,231 147.5,234" stroke="#6b4332" strokeWidth="0.8" fill="none" />
          {/* a gold signet ring */}
          <rect x="152.2" y="236.6" width="3.6" height="1.8" rx="0.6" fill="url(#br-gold)" />
        </g>
      </g>

      {/* ---- black turtleneck: everything the open jacket shows ---- */}
      <path d={TORSO_D} fill="url(#br-knit)" />
      <g clipPath="url(#br-torso-clip)">
        <rect x="80" y="80" width="40" height="130" fill="url(#br-rib)" />
      </g>

      {/* ---- the leather jacket: boxy, hip length, hanging open ---- */}
      <g clipPath="url(#br-torso-clip)">
        <path d="M0,80 L91,80 C90.5,120 89,160 87,210 L0,210 Z" fill="url(#br-leather)" />
        <path d="M109,80 C109.5,120 111,160 113,210 L200,210 L200,80 Z" fill="url(#br-leather)" />
        {/* the shine that makes it leather: broad soft highlights on the
            shoulders and down each panel, warm from the lamp */}
        <ellipse cx="70" cy="100" rx="15" ry="7" fill="#ffe7c4" opacity="0.2" filter="url(#br-sheen)" />
        <ellipse cx="130" cy="100" rx="15" ry="7" fill="#ffe7c4" opacity="0.2" filter="url(#br-sheen)" />
        <path d="M70,108 C69,140 69,170 70,196" stroke="#ffe7c4" strokeWidth="6" fill="none" opacity="0.08" filter="url(#br-sheen)" />
        <path d="M131,108 C132,140 132,170 131,196" stroke={COLD} strokeWidth="6" fill="none" opacity="0.08" filter="url(#br-sheen)" />
        {/* yoke seam across the chest */}
        <path d="M54,112 C64,115 80,116 89,115 M111,115 C120,116 136,115 146,112" stroke="#000" strokeWidth="1" fill="none" opacity="0.8" />
        <path d="M54,113.2 C64,116.2 80,117.2 89,116.2 M111,116.2 C120,117.2 136,116.2 146,113.2" stroke={LIT} strokeWidth="0.5" fill="none" opacity="0.3" />
        {/* creases: dark fold, lit ridge above it */}
        <path d="M58,150 C64,156 72,158 80,156 M120,156 C128,158 136,156 142,150" stroke="#000" strokeWidth="1.6" fill="none" opacity="0.7" filter="url(#br-soft)" />
        <path d="M58.4,148.4 C64,154 72,156 80,154.4 M120,154.4 C128,156 136,154 141.6,148.4" stroke="#ffe7c4" strokeWidth="0.7" fill="none" opacity="0.22" />
        <path d="M60,176 C68,180 76,181 84,179 M116,179 C124,181 132,180 140,176" stroke="#000" strokeWidth="1.4" fill="none" opacity="0.6" filter="url(#br-soft)" />
        {/* slanted welt pockets */}
        <path d="M62,162 L76,170 M138,162 L124,170" stroke="#000" strokeWidth="1.8" fill="none" />
        <path d="M62.4,160.8 L76.4,168.8 M137.6,160.8 L123.6,168.8" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.4" />
        <rect x="0" y="0" width="200" height="400" fill="url(#br-form)" />
        <rect x="0" y="0" width="200" height="400" filter="url(#br-grainy)" opacity="0.5" />
        {/* waistband */}
        <path d="M50,194 C75,197.5 125,197.5 150,194 L150,210 L50,210 Z" fill="#0d0a09" />
        <path d="M50,194 C75,197.5 125,197.5 150,194" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.3" />
        <path d="M50,201 C75,204.5 125,204.5 150,201" stroke="#000" strokeWidth="0.8" fill="none" opacity="0.6" />
        {/* the shadow the open fronts throw on the turtleneck */}
        <path d="M91,80 C90.5,120 89,160 87,210" stroke="#000" strokeWidth="4" fill="none" opacity="0.6" filter="url(#br-soft)" transform="translate(2.4 0)" />
        <path d="M109,80 C109.5,120 111,160 113,210" stroke="#000" strokeWidth="4" fill="none" opacity="0.6" filter="url(#br-soft)" transform="translate(-2.4 0)" />
      </g>
      {/* front edges catching the light */}
      <path d="M91,112 C90.5,140 89,170 87.2,196" stroke={LIT} strokeWidth="0.7" fill="none" opacity="0.4" />
      <path d="M109,112 C109.5,140 111,170 112.8,196" stroke={COLD} strokeWidth="0.7" fill="none" opacity="0.35" />
      {/* press studs down the open front */}
      {[128, 150, 172].map((y) => (
        <g key={y}>
          <circle cx="86.4" cy={y} r="1.3" fill="#6d665e" />
          <circle cx="86.1" cy={y - 0.3} r="0.5" fill="#e9e2d6" />
        </g>
      ))}

      {/* the Maple Jiu Jitsu leaf, sewn on the left breast of the jacket */}
      <g className="br-patch">
        <ellipse cx="129" cy="131.6" rx="8.4" ry="8.6" fill="#000" opacity="0.5" filter="url(#br-soft)" />
        <image href={mapleLogo} x="121" y="122.8" width="16" height="16.2" preserveAspectRatio="xMidYMid meet" filter="url(#br-patchtone)" />
      </g>

      {/* ---- a thick neck, and the gold chain lying on the turtleneck ---- */}
      <path d="M87,62 C87,72 86,80 85,88 L115,88 C114,80 113,72 113,62 Z" fill="url(#br-skin)" />
      <path d="M87,70 C94,80 106,80 113,70" stroke="#000" strokeWidth="3" fill="none" opacity="0.35" filter="url(#br-soft)" />
      <path d="M90,100 C92,114 96,121 100,122 C104,121 108,114 110,100" stroke="#000" strokeWidth="3.6" fill="none" opacity="0.5" filter="url(#br-soft)" />
      <path d="M90,99 C92,113 96,120 100,121 C104,120 108,113 110,99" stroke="url(#br-gold)" strokeWidth="2.8" fill="none" strokeDasharray="2.1 0.5" />
      <path d="M90,98.4 C92,112.4 96,119.4 100,120.4 C104,119.4 108,112.4 110,98.4" stroke="#fff4c4" strokeWidth="0.7" fill="none" strokeDasharray="1.2 1.4" opacity="0.8" />

      {/* rolled turtleneck collar */}
      <path d="M85,80 C90,76 110,76 115,80 L116,95 C108,98.5 92,98.5 84,95 Z" fill="url(#br-knit)" />
      <path d="M85,80 C90,76 110,76 115,80 L116,95 C108,98.5 92,98.5 84,95 Z" fill="url(#br-rib)" />
      <path d="M85,80 C90,76 110,76 115,80" stroke={LIT} strokeWidth="1" fill="none" opacity="0.28" filter="url(#br-soft)" />
      <path d="M84.6,88 C92,91 108,91 115.4,88" stroke="#000" strokeWidth="1.2" fill="none" opacity="0.6" filter="url(#br-soft)" />

      {/* ---- the wide pointed collar of the jacket, laid out flat ---- */}
      <path d="M84,82 C78,86 72,92 66,98 L80,118 C83,108 87,100 91,95 C88,92 86,87 84,82 Z" fill="url(#br-leather)" />
      <path d="M116,82 C122,86 128,92 134,98 L120,118 C117,108 113,100 109,95 C112,92 114,87 116,82 Z" fill="url(#br-leather)" />
      <path d="M66,98 L80,118" stroke={LIT} strokeWidth="0.8" opacity="0.45" />
      <path d="M134,98 L120,118" stroke={COLD} strokeWidth="0.8" opacity="0.35" />
      <path d="M84,82 C78,86 72,92 66,98" stroke="#ffe7c4" strokeWidth="1.2" fill="none" opacity="0.28" filter="url(#br-soft)" />
      <path d="M116,82 C122,86 128,92 134,98" stroke="#ffe7c4" strokeWidth="1.2" fill="none" opacity="0.22" filter="url(#br-soft)" />
      <path d="M80,118 C83,108 87,100 91,95 M120,118 C117,108 113,100 109,95" stroke="#000" strokeWidth="1.6" fill="none" opacity="0.7" filter="url(#br-soft)" />

      {/* ---- the head: shaved, heavy brow, flat stare, a day of stubble ---- */}
      <path d="M80.5,46 C77.5,45 76,49 76.6,53 C77.2,57 79.4,59 81.6,58.4 Z" fill="url(#br-skin)" />
      <path d="M119.5,46 C122.5,45 124,49 123.4,53 C122.8,57 120.6,59 118.4,58.4 Z" fill="url(#br-skin)" />
      <path d="M78.6,49 C78.2,52 79,55 80.6,56.4" stroke="#7a4e3a" strokeWidth="0.8" fill="none" />
      <path d="M121.4,49 C121.8,52 121,55 119.4,56.4" stroke="#7a4e3a" strokeWidth="0.8" fill="none" />
      <path d={HEAD_D} fill="url(#br-skin)" />
      <g clipPath="url(#br-head-clip)">
        <rect x="78" y="10" width="44" height="76" fill="url(#br-form)" opacity="0.55" />
        {/* the buzzed scalp: a shadow of hair over the crown */}
        <rect x="76" y="8" width="48" height="40" fill="#3a2a22" opacity="0.55" mask="url(#br-scalp-mask)" />
        <rect x="76" y="8" width="48" height="40" filter="url(#br-stubble)" opacity="0.6" mask="url(#br-scalp-mask)" />
        <ellipse cx="100" cy="20" rx="13" ry="7" fill="url(#br-headlit)" />
        {/* the brow ridge: a shaded mass over the eyes, dipping to the middle */}
        <path d="M84,44 C90,40.5 96,41.5 100,45 C104,41.5 110,40.5 116,44 L116,48.6 C110,46 104,47 100,49.6 C96,47 90,46 84,48.6 Z" fill="#6e4532" opacity="0.5" filter="url(#br-soft)" />
        <path d="M85,42.6 C90,39.8 96,40.6 99.4,43.6 M100.6,43.6 C104,40.6 110,39.8 115,42.6" stroke="#ffd9a8" strokeWidth="1" fill="none" opacity="0.35" filter="url(#br-soft)" />
        {/* deep-set eyes, lids heavy */}
        {[92, 108].map((cx) => (
          <g key={cx}>
            <ellipse cx={cx} cy="50.4" rx="5.6" ry="2.8" fill="#5a3526" opacity="0.6" filter="url(#br-soft)" />
            <path d={`M${cx - 3.8},50.6 C${cx - 2},49.4 ${cx + 2},49.4 ${cx + 3.8},50.6 C${cx + 2},51.6 ${cx - 2},51.6 ${cx - 3.8},50.6 Z`} fill="#cbbba6" />
            <circle cx={cx} cy="50.6" r="1.35" fill="#3c4a52" />
            <circle cx={cx} cy="50.6" r="0.65" fill="#050505" />
            <circle cx={cx + 0.5} cy="50.1" r="0.32" fill="#fff4dc" />
            <path d={`M${cx - 4.2},50.4 C${cx - 2},48.7 ${cx + 2},48.7 ${cx + 4.2},50.4`} stroke="#1a0f0a" strokeWidth="1.3" fill="none" />
            <path d={`M${cx - 3.4},52 C${cx - 1.6},52.7 ${cx + 1.6},52.7 ${cx + 3.4},52`} stroke="#7a5038" strokeWidth="0.6" fill="none" opacity="0.7" />
          </g>
        ))}
        {/* a scar through the left brow */}
        <path d="M110.5,42 L112.6,48" stroke="#f0c9ad" strokeWidth="0.9" opacity="0.8" />
        {/* a broad nose: lit bridge, shadowed side, nostrils */}
        <path d="M99.4,50 C99,54 98.6,57 97.6,60" stroke="#ffdcb4" strokeWidth="1.3" fill="none" opacity="0.45" filter="url(#br-soft)" />
        <path d="M102.4,51 C103.4,55 104.4,58 104.6,61" stroke="#7a4b36" strokeWidth="1.4" fill="none" opacity="0.6" filter="url(#br-soft)" />
        <path d="M95.4,61.6 C97,63.6 103,63.6 104.6,61.6 C103.6,60.2 96.4,60.2 95.4,61.6 Z" fill="#8a5843" opacity="0.6" />
        <ellipse cx="97.6" cy="62.2" rx="1.2" ry="0.6" fill="#3a2016" />
        <ellipse cx="102.4" cy="62.2" rx="1.2" ry="0.6" fill="#3a2016" />
        {/* cheekbones */}
        <path d="M86,56 C88,60 90,62 92,63 M114,56 C112,60 110,62 108,63" stroke="#7a4b36" strokeWidth="1.6" fill="none" opacity="0.35" filter="url(#br-soft)" />
        {/* stubble over the jaw and the upper lip */}
        <rect x="76" y="50" width="48" height="36" fill="#4a3226" opacity="0.55" mask="url(#br-jaw-mask)" />
        <rect x="76" y="50" width="48" height="36" filter="url(#br-stubble)" opacity="1" mask="url(#br-jaw-mask)" />
        {/* the mouth: a flat, set line */}
        <path d="M94,69.4 C97,70 103,70 106,69.4" stroke="#4a2618" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M95.5,71.6 C98,72.6 102,72.6 104.5,71.6" stroke="#e8b897" strokeWidth="0.8" fill="none" opacity="0.5" />
        <path d="M96,74.6 C98.5,75.6 101.5,75.6 104,74.6" stroke="#6a3f2d" strokeWidth="1" fill="none" opacity="0.5" filter="url(#br-soft)" />
        {/* chin and jaw underside in shadow */}
        <path d="M86,68 C90,78 96,82 100,82 C104,82 110,78 114,68" stroke="#000" strokeWidth="3.4" fill="none" opacity="0.35" filter="url(#br-soft)" />
      </g>
      <path d="M120,32 C121.4,38 121.6,46 120.6,54" stroke={COLD} strokeWidth="0.9" fill="none" opacity="0.4" filter="url(#br-soft)" />

      {/* breath steaming off him in the cold */}
      <g className="br-breath" fill="#e9eef7" filter="url(#br-softer)">
        <ellipse className="br-puff br-puff-a" cx="106" cy="73" rx="4" ry="2.6" />
        <ellipse className="br-puff br-puff-b" cx="106" cy="73" rx="4" ry="2.6" />
      </g>

      {/* ---- gun arm, hanging, pistol pointed at the ground ---- */}
      <g className="br-arm br-arm-down">
        <path d="M66,88 C50,86 39,96 37,112 L34,194 C34,198 38,201 43,201 L55,202 C57,180 58,150 59,120 Z" fill="url(#br-lsleeve)" />
        <path d="M48,96 C44,120 42,150 41,186" stroke="#fff1dc" strokeWidth="5" fill="none" opacity="0.12" filter="url(#br-sheen)" />
        <path d="M35.6,140 C42,145 50,146 57,142 M35.4,148 C42,152 50,153 56.6,150" stroke="#000" strokeWidth="1.3" fill="none" opacity="0.8" filter="url(#br-soft)" />
        <path d="M36.4,138.6 C42,143.4 50,144.4 56.4,140.6" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.35" />
        <path d="M54,92 C47,94 41,100 39,110" stroke={LIT} strokeWidth="1.6" fill="none" opacity="0.3" filter="url(#br-soft)" />
        <path d="M38.6,194 L55.4,195 L55,203 L38.4,202 Z" fill="#0b0908" />
        <path d="M38.6,196 L55.4,197" stroke={LIT} strokeWidth="0.5" opacity="0.3" />
        <g transform="translate(0 -12)">
          {/* the pistol, slide-top to camera, muzzle down along the thigh */}
          <path d="M45.2,232 L51.4,232 L51.2,260 C51.2,262 50,263 48.3,263 C46.6,263 45.4,262 45.4,260 Z" fill="url(#br-steel)" />
          <path d="M46.2,234 L46.4,260" stroke={LIT} strokeWidth="0.55" opacity="0.55" />
          <path d="M50.4,234 L50.2,260" stroke="#000" strokeWidth="0.6" opacity="0.7" />
          <path d="M51.3,236 C53.6,238 54,244 52.2,247 L51.3,247" fill="none" stroke="#26231f" strokeWidth="1.3" />
          <ellipse cx="48.3" cy="262.6" rx="2.6" ry="0.9" fill="#0a0908" />
          {/* the bare fist round the grip */}
          <path d="M40.6,216 C39.4,223 39.8,231 41.6,237.5 L55.2,238 C56.6,231 56.8,223 55.6,215.5 Z" fill="url(#br-hand)" />
          <path d="M41.2,221 C40.4,226 40.6,231 41.6,236 M41,224.5 L43.6,224.8 M41,228.6 L43.8,228.9 M41.4,232.6 L44,232.9" stroke="#6b4332" strokeWidth="0.7" fill="none" />
          <path d="M40.8,222 C40.2,226 40.4,230 41,233" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.45" />
          <path d="M54.6,219 C57.4,222 57.6,230 55.4,236 C54,238.6 51,238.4 50.4,236 C50.4,231 51.2,225 52,220 Z" fill="url(#br-hand)" />
          <path d="M52,221 C51.2,226 50.8,231 50.8,235.5" stroke="#6b4332" strokeWidth="0.7" fill="none" />
        </g>
      </g>

      {/* ---- gun arm, levelled at the camera ---- */}
      <g className="br-arm-up">
        <g className="br-recoil">
          {/* the leather sleeve comes at the camera from his right shoulder: a
              foreshortened tube, creases ringing it toward the cuff */}
          <path d="M38,84 C40,68 54,61 65,65 C77,69 81,84 79,100 C78,112 71,119 60,119 C49,119 43,111 40,101 C38,95 37,89 38,84 Z" fill="url(#br-lsleeve)" />
          <ellipse cx="52" cy="76" rx="9" ry="5" fill="#ffe7c4" opacity="0.18" filter="url(#br-sheen)" />
          <path d="M38.5,95 C43,106 56,111 70,105" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.8" filter="url(#br-soft)" />
          <path d="M39,93.6 C43.6,104.4 56,109.6 69.6,103.6" stroke={LIT} strokeWidth="0.6" fill="none" opacity="0.35" />
          <path d="M44,70 C52,63 64,63 72,69" stroke={LIT} strokeWidth="1.6" fill="none" opacity="0.3" filter="url(#br-soft)" />
          {/* the pistol held upright, end-on to the lens */}
          <g transform="translate(-38 2)">
            {/* leather cuff round the wrist */}
            <ellipse cx="100" cy="100" rx="16" ry="14" fill="#0b0908" />
            <ellipse cx="100" cy="100" rx="12.4" ry="11" fill="#17120f" />
            {/* the fist round the grip: three fingers on the front strap */}
            <path d="M88,90 C88,86 92,85 100,85 C108,85 112,86 112,90 L112,108 C112,113 107,115 100,115 C93,115 88,113 88,108 Z" fill="url(#br-hand)" />
            {[92.5, 99.5, 106.5].map((y, i) => (
              <g key={y}>
                <path d={`M${89 + i * 0.6},${y} C94,${y + 1.6} 106,${y + 1.6} ${111 - i * 0.6},${y}`} stroke="#5a3424" strokeWidth="1.1" fill="none" />
                <path d={`M${91 + i},${y + 2.2} C96,${y + 3.2} 104,${y + 3.2} ${109 - i},${y + 2.2}`} stroke="#f0c4a2" strokeWidth="0.7" fill="none" opacity="0.6" />
              </g>
            ))}
            <rect x="96" y="98.4" width="6" height="2.4" rx="0.8" fill="url(#br-gold)" />
            {/* thumb along the far side of the frame */}
            <path d="M110,84 C115,83 117,88 116,94 C115,98 112,99 110,97 Z" fill="url(#br-hand)" />
            <path d="M111,85 C114,84.5 116,87 115.6,91" stroke="#5a3424" strokeWidth="0.7" fill="none" />
            {/* trigger guard, frame */}
            <path d="M92.5,80 L92.5,86 C92.5,90.5 107.5,90.5 107.5,86 L107.5,80" stroke="#1c1c1f" strokeWidth="2.3" fill="none" />
            <path d="M91,76 L109,76 L109,82 L91,82 Z" fill="#1a1918" />
            {/* blued steel slide, end-on: the face, the bore, the front sight */}
            <rect x="89.5" y="61.5" width="21" height="15" rx="2.4" fill="url(#br-steel)" />
            <rect x="90.1" y="62.1" width="19.8" height="13.8" rx="2" fill="none" stroke="#a8a49c" strokeWidth="0.4" opacity="0.5" />
            <circle cx="100" cy="67.6" r="3" fill="#2a2a2e" />
            <circle cx="100" cy="67.6" r="2.3" fill="#000" />
            <path d="M90.5,62.3 L109.5,62.3" stroke={LIT} strokeWidth="0.8" opacity="0.6" />
            <rect x="98.8" y="58.6" width="2.4" height="3.2" rx="0.4" fill="#1d1d20" />
            {SHOTS.map((k) => (
              <g key={k} className={`br-muzzle br-muzzle-${k}`}>
                <circle cx="100" cy="67.6" r="22" fill="url(#br-flashglow)" />
                <path d={FLASH_D} fill="#ffd27a" />
                <path d={FLASH_D} fill="#fff6dc" transform="translate(100 67.6) scale(0.55) translate(-100 -67.6)" />
                <circle cx="100" cy="67.6" r="3.6" fill="#ffffff" />
              </g>
            ))}
            {SHOTS.map((k) => (
              <rect key={k} className={`br-casing br-casing-${k}`} x="86" y="64" width="2.6" height="5.4" rx="0.7" fill="#c9a04a" />
            ))}
            <g className="br-gunsmoke" fill="none" stroke="#d8d2c6" strokeLinecap="round" filter="url(#br-softer)">
              <path className="br-gs br-gs-a" d="M100,62 C96,54 104,46 99,36 C95,28 102,20 98,10" strokeWidth="3" />
              <path className="br-gs br-gs-b" d="M100,62 C105,54 97,44 103,34 C108,26 101,18 105,8" strokeWidth="2.4" />
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

// boxy, square-shouldered: a 90s jacket cut a size big
const TORSO_D =
  "M86,82 C70,82 58,87 53,98 C50,106 50,120 50,132 L51,192 C51,200 58,206 68,207 L132,207 C142,206 149,200 149,192 L150,132 C150,120 150,106 147,98 C142,87 130,82 114,82 Z";

// a wide skull and a square jaw
const HEAD_D =
  "M80.5,42 C80,25 88.5,16 100,16 C111.5,16 120,25 119.5,42 C120,53 119,63 114.5,71 C110,78.5 105,81.5 100,81.5 C95,81.5 90,78.5 85.5,71 C81,63 80,53 80.5,42 Z";
