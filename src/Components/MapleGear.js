// MapleGear.js — Maple Jiu-Jitsu's free gear drop, as a product-launch reel.
//
// One lit stage: spotlight beams converging on a glowing pedestal, embers
// rising through the light, and the item's name scrolling huge and outlined
// behind it. Each beat the light changes colour (--c1/--c2 are registered
// colours, so the whole set cross-grades instead of cutting), a piece spins in
// onto the pedestal, its value lands as a gold pill and FREE slams in beside
// it with a shockwave. Then it whips off frame for the next one.
//
//   1 the mark + "4 pieces of gear"   2 shirt   3 hoodie   4 gi   5 gloves
//   6 all four, back on the pedestal   7 + the call to action
//
// Prices are never struck through — the value is shown as a value, and FREE
// sits next to it. There is no running total; the $380 is said twice, on the
// hook and on the payoff.
//
// Items move between states by transform only: off (below), hero (pedestal),
// gone (whipped off left) and grid (their quadrant on the payoff). The offsets
// are in --u off the stage box in the stylesheet.
//
// EVERY STRING AND PRICE IS A PROP — the club's claims on a public ad. Values
// are the user's brief; the call to action and site are as briefed so far.
//
// URL switches:
//   ?phase=1..7   hold on one beat instead of playing
import React, { useMemo } from "react";
import "../Stylesheets/MapleGear.css";
import usePhases from "../Utils/usePhases";
import mapleLogo from "../Images/maple-logo.png";
import giPhoto from "../Images/maple-gi.png";
import glovesPhoto from "../Images/maple-gloves.png";

//         hook  shirt hoodie  gi  gloves  all  cta
const CUES = [200, 2200, 4000, 5800, 7600, 9500, 11300];
const LOOP_AT = 17000;

// payoff quadrants (u off the stage centre) and a little tilt each
const GRID = [
  [-15.5, -15.5, -6],
  [15.5, -15.5, 5],
  [-15.5, 12.5, 4],
  [15.5, 12.5, -5],
];

// [left %, size u, duration s, delay s, drift u]
const EMBERS = Array.from({ length: 30 }, (_, i) => {
  const r = (n) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return [r(1) * 100, 0.5 + r(2) * 1.3, 4 + r(3) * 5, -r(4) * 9, (r(5) - 0.5) * 16];
});

/* Fabric lighting: blur the silhouette's alpha into a height field and light
   it, so each panel of a garment puffs like cloth instead of sitting flat. */
const Puff = ({ id, depth = 7, blur = 7 }) => (
  <filter id={id} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
    <feGaussianBlur in="SourceAlpha" stdDeviation={blur} result="h" />
    <feDiffuseLighting in="h" surfaceScale={depth} diffuseConstant="1.15" lightingColor="#fff" result="d">
      <feDistantLight azimuth="235" elevation="58" />
    </feDiffuseLighting>
    <feComposite in="d" in2="SourceAlpha" operator="in" result="dm" />
    <feBlend in="SourceGraphic" in2="dm" mode="multiply" result="lit" />
    <feSpecularLighting in="h" surfaceScale={depth} specularConstant="0.55" specularExponent="16" lightingColor="#fff" result="s">
      <feDistantLight azimuth="235" elevation="52" />
    </feSpecularLighting>
    <feComposite in="s" in2="SourceAlpha" operator="in" result="sm" />
    <feComposite in="lit" in2="sm" operator="arithmetic" k2="1" k3="0.28" />
  </filter>
);

function Hoodie() {
  const fold = { fill: "none", stroke: "#15171d", strokeLinecap: "round", filter: "url(#mg-soft)" };
  return (
    <svg viewBox="0 0 200 200" className="mg-svg" aria-label="Hoodie">
      <defs>
        <Puff id="mg-hd-puff" />
        <Puff id="mg-hd-puff-sm" depth={5} blur={4} />
        <filter id="mg-soft">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <linearGradient id="mg-hd" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a3f4c" />
          <stop offset="0.45" stopColor="#5a6070" />
          <stop offset="1" stopColor="#30343f" />
        </linearGradient>
        <linearGradient id="mg-hd-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#474c59" />
          <stop offset="1" stopColor="#2c3039" />
        </linearGradient>
      </defs>
      {/* hood, behind */}
      <g filter="url(#mg-hd-puff)">
        <path d="M60 52 C54 22 76 6 100 6 C124 6 146 22 140 52 C126 46 114 44 100 44 C86 44 74 46 60 52 Z" fill="url(#mg-hd-dark)" />
      </g>
      {/* sleeves */}
      <g filter="url(#mg-hd-puff)">
        <path d="M60 44 C40 50 30 68 26 98 L17 158 L50 162 L60 106 Z" fill="url(#mg-hd-dark)" />
        <path d="M140 44 C160 50 170 68 174 98 L183 158 L150 162 L140 106 Z" fill="url(#mg-hd-dark)" />
      </g>
      <g filter="url(#mg-hd-puff-sm)">
        <path d="M16 156 L51 160 L49 176 C49 179 46 181 43 181 L19 179 C16 179 14 176 14 173 Z" fill="#2d313b" />
        <path d="M184 156 L149 160 L151 176 C151 179 154 181 157 181 L181 179 C184 179 186 176 186 173 Z" fill="#2d313b" />
      </g>
      {/* body */}
      <g filter="url(#mg-hd-puff)">
        <path d="M58 42 C72 36 86 34 100 34 C114 34 128 36 142 42 L147 172 L53 172 Z" fill="url(#mg-hd)" />
      </g>
      <g filter="url(#mg-hd-puff-sm)">
        <path d="M53 170 L147 170 L147 182 C147 186 144 188 140 188 L60 188 C56 188 53 186 53 182 Z" fill="#30343e" />
        {/* kangaroo pocket */}
        <path d="M70 128 L130 128 C135 141 139 153 141 164 L59 164 C61 153 65 141 70 128 Z" fill="#525867" />
      </g>
      {Array.from({ length: 22 }, (_, i) => (
        <path key={i} d={`M${56 + i * 4.1} 173 V186`} stroke="#1c1f26" strokeWidth="0.9" opacity="0.6" />
      ))}
      {/* hood opening */}
      <path d="M80 42 C82 32 90 26 100 26 C110 26 118 32 120 42 C115 55 108 63 100 66 C92 63 85 55 80 42 Z" fill="#1b1e25" />
      <path d="M84 42 C87 35 93 31 100 31 C107 31 113 35 116 42 C111 50 106 55 100 57 C94 55 89 50 84 42 Z" fill="#2a2e37" />
      <path d="M68 40 C70 58 85 71 100 75 C115 71 130 58 132 40" fill="none" stroke="#636a7a" strokeWidth="6.5" strokeLinecap="round" filter="url(#mg-hd-puff-sm)" />
      {/* drawstrings */}
      <path d="M92 70 C91 82 89 94 88 106" fill="none" stroke="#f1eee6" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M108 70 C109 82 111 92 112 104" fill="none" stroke="#f1eee6" strokeWidth="2.8" strokeLinecap="round" />
      <rect x="86" y="104" width="4.4" height="8" rx="1.6" fill="#c9c5ba" />
      <rect x="110" y="102" width="4.4" height="8" rx="1.6" fill="#c9c5ba" />
      {/* folds */}
      <path d="M66 74 C70 96 68 118 63 138" strokeWidth="4" opacity="0.5" {...fold} />
      <path d="M135 76 C130 98 132 118 137 136" strokeWidth="4" opacity="0.5" {...fold} />
      <path d="M38 96 C42 116 42 136 37 152" strokeWidth="3" opacity="0.45" {...fold} />
      <path d="M162 96 C158 116 158 136 163 152" strokeWidth="3" opacity="0.45" {...fold} />
      <path d="M78 150 C90 146 110 146 122 150" strokeWidth="2.5" opacity="0.35" {...fold} />
      {/* chest print */}
      <image href={mapleLogo} x="80" y="80" width="40" height="40" preserveAspectRatio="xMidYMid meet" opacity="0.96" />
    </svg>
  );
}

function Shirt() {
  const fold = { fill: "none", stroke: "#9aa1ad", strokeLinecap: "round", filter: "url(#mg-soft2)" };
  return (
    <svg viewBox="0 0 200 200" className="mg-svg" aria-label="T-shirt">
      <defs>
        <Puff id="mg-tee-puff" depth={6} />
        <Puff id="mg-tee-puff-sm" depth={4} blur={3} />
        <filter id="mg-soft2">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <linearGradient id="mg-tee" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9ecf1" />
          <stop offset="0.4" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dde1e8" />
        </linearGradient>
      </defs>
      <g filter="url(#mg-tee-puff)">
        <path d="M68 30 L30 50 C24 53 21 59 23 65 L34 96 L64 86 Z" fill="#f4f6f9" />
        <path d="M132 30 L170 50 C176 53 179 59 177 65 L166 96 L136 86 Z" fill="#f4f6f9" />
      </g>
      <g filter="url(#mg-tee-puff)">
        <path d="M66 28 C78 24 88 22 100 22 C112 22 122 24 134 28 L140 64 L144 178 C144 183 141 186 136 186 L64 186 C59 186 56 183 56 178 L60 64 Z" fill="url(#mg-tee)" />
      </g>
      <path d="M57 178 H143" stroke="#c9ced7" strokeWidth="1.6" />
      <path d="M26 76 L36 97 M174 76 L164 97" stroke="#c4c9d2" strokeWidth="2" />
      {/* crew neck */}
      <path d="M84 24 C88 36 94 41 100 41 C106 41 112 36 116 24 Z" fill="#aeb4bf" />
      <path d="M80 24 C84 39 92 46 100 46 C108 46 116 39 120 24" fill="none" stroke="#eef1f5" strokeWidth="8" strokeLinecap="round" filter="url(#mg-tee-puff-sm)" />
      {/* folds */}
      <path d="M72 70 C76 100 74 140 69 170" strokeWidth="4" opacity="0.45" {...fold} />
      <path d="M130 76 C126 106 128 140 133 168" strokeWidth="4" opacity="0.4" {...fold} />
      <path d="M86 160 C96 156 108 156 118 162" strokeWidth="3" opacity="0.35" {...fold} />
      <image href={mapleLogo} x="73" y="58" width="54" height="54" preserveAspectRatio="xMidYMid meet" />
    </svg>
  );
}

const Burst = () => {
  const pts = [];
  for (let k = 0; k < 32; k++) {
    const r = k % 2 ? 41 : 50;
    const a = (k / 32) * Math.PI * 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return (
    <svg viewBox="0 0 100 100" className="mg-burst-svg" aria-hidden="true">
      <defs>
        <radialGradient id="mg-burst" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ff4d63" />
          <stop offset="0.6" stopColor="#e4002b" />
          <stop offset="1" stopColor="#9c0019" />
        </radialGradient>
      </defs>
      <g className="mg-burst-star">
        <polygon points={pts.join(" ")} fill="url(#mg-burst)" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
      </g>
      <text x="50" y="61" textAnchor="middle">FREE</text>
    </svg>
  );
};

function MapleGear({
  mode = "animated",
  items = [
    { key: "shirt", name: "T-SHIRT", price: 40, art: "shirt" },
    { key: "hoodie", name: "HOODIE", price: 80, art: "hoodie" },
    { key: "gi", name: "GI", price: 120, photo: giPhoto },
    { key: "gloves", name: "GLOVES", price: 140, photo: glovesPhoto },
  ],
  kicker = "MAPLE JIU-JITSU IS GIVING AWAY",
  hookName = "4 PIECES OF GEAR",
  allName = "ALL 4 PIECES",
  cta = "SIGN UP TODAY",
  site = "MAPLEBJJ.COM",
}) {
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const reduced = useMemo(
    () => !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const still = mode === "static" || reduced;
  const { phase: live } = usePhases(CUES, { mode: still ? "static" : "animated", loopAt: LOOP_AT });
  const held = Number(query.get("phase")) || 0;
  const phase = held ? Math.min(7, Math.max(1, held)) : live;

  const total = items.reduce((sum, it) => sum + it.price, 0);

  const stateOf = (i) => {
    if (phase >= 6) return "grid";
    if (phase < i + 2) return "off";
    if (phase === i + 2) return "hero";
    return "gone";
  };

  // one caption per beat; the CTA beat keeps the payoff's caption
  const caps = [
    { name: hookName, value: `$${total} VALUE` },
    ...items.map((it) => ({ name: it.name, value: `$${it.price} VALUE` })),
    { name: allName, value: `$${total} VALUE` },
  ];
  const capBeat = Math.min(phase, 6);

  const word = phase >= 2 && phase <= 5 ? items[phase - 2].name : "FREE GEAR";
  const marquee = Array.from({ length: 6 }, () => word).join("  •  ");

  return (
    <div className={`mg-stage mg-p${phase}${still ? " is-static" : ""}`}>
      <div className="mg-bg" aria-hidden="true">
        <div className="mg-wash" />
        <div className="mg-marquee" key={`mq-${word}`}>
          <div className="mg-row mg-row-a">
            <span>{marquee}</span>
            <span>{marquee}</span>
          </div>
          <div className="mg-row mg-row-b">
            <span>{marquee}</span>
            <span>{marquee}</span>
          </div>
        </div>
        <div className="mg-beams">
          <i className="mg-beam mg-beam-1" />
          <i className="mg-beam mg-beam-2" />
          <i className="mg-beam mg-beam-3" />
        </div>
        <div className="mg-embers">
          {EMBERS.map(([l, s, d, dl, dx], i) => (
            <i key={i} style={{ left: `${l}%`, "--s": s, "--dur": `${d}s`, "--dl": `${dl}s`, "--dx": dx }} />
          ))}
        </div>
        <div className="mg-vignette" />
        <svg className="mg-grain">
          <filter id="mg-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#mg-noise)" />
        </svg>
      </div>

      <div className="mg-card">
        <img className="mg-logo" src={mapleLogo} alt="Maple Jiu-Jitsu" />
        <div className="mg-kicker">{kicker}</div>
        <h1 className="mg-headline" aria-label="Free gear">
          {"FREE GEAR".split("").map((ch, i) =>
            ch === " " ? (
              <span key={i} className="mg-gap" />
            ) : (
              <span key={i} className={`mg-letter${i < 4 ? " mg-hot" : ""}`} style={{ "--i": i }}>
                {ch}
              </span>
            )
          )}
        </h1>

        <div className="mg-box">
          <div className="mg-pool" />
          <div className="mg-pedestal" />
          <div className="mg-hook">
            <img src={mapleLogo} alt="" />
          </div>
        </div>

        {!still && phase > 0 && (
          <div className="mg-fx" key={`fx-${phase}`} aria-hidden="true">
            <i className="mg-ring" />
            <i className="mg-ring mg-ring-2" />
            <i className="mg-rays" />
          </div>
        )}

        {items.map((it, i) => (
          <div
            key={it.key}
            className={`mg-item mg-${stateOf(i)}`}
            style={{ "--gx": GRID[i][0], "--gy": GRID[i][1], "--gr": `${GRID[i][2]}deg`, "--order": i }}
          >
            <div className="mg-spin">
              <div className="mg-float">
                <div className="mg-art">
                  {it.photo ? <img src={it.photo} alt={it.name} /> : it.art === "hoodie" ? <Hoodie /> : <Shirt />}
                </div>
                <div className="mg-burst">
                  <Burst />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="mg-caps">
          {caps.map((c, i) => (
            <div key={i} className={`mg-cap${capBeat === i + 1 ? " is-on" : ""}`}>
              <div className="mg-name">
                {c.name.split(" ").map((w, k) => (
                  <span key={k} style={{ "--k": k }}>
                    {w}
                  </span>
                ))}
              </div>
              <div className="mg-pills">
                <span className="mg-pill mg-value">{c.value}</span>
                <span className="mg-pill mg-free">
                  FREE
                  <i className="mg-shine" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mg-cta">
          {cta}
          <i className="mg-shine" />
        </div>
        <div className="mg-site">{site}</div>
      </div>

      {!still && phase > 0 && <div key={`fl-${phase}`} className="mg-flash" aria-hidden="true" />}
    </div>
  );
}

export default MapleGear;
