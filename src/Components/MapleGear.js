// MapleGear.js — Maple Jiu-Jitsu's free gear drop. Same family as FreeHat (a
// promo, not a logo theme, and a loop that can also run on a booth screen),
// but built for the 9:16 Reel first.
//
// The beat is a loot drop. Four mystery tiles, then one piece of gear at a time
// slams into the stage with its price on a tag; the price is struck through, a
// FREE stamp lands on it, and the running total ticks up. Each piece then drops
// into its slot in the tray underneath, so by the time the gloves land the
// viewer has watched $380 pile up. The last frame lays all four out together
// with the sign-up line.
//
// Cheapest first, so every beat beats the one before it: $40 → $80 → $120 →
// $140, and the total climbs 40 → 120 → 240 → 380.
//
// Every item sits in ONE box the size of the stage and is moved by transform
// alone — off (above the frame), hero (centre), tray (its slot) or grid (its
// quadrant on the endcard). The positions are numbers in --u off the card's
// own layout below, so the items never measure anything.
//
// EVERY STRING AND PRICE IS A PROP. They are the club's claims on a public ad:
// the values are the user's brief ($120 gi, $140 gloves, $80 hoodie, $40
// shirt); the call to action and the site are placeholders until confirmed.
//
// URL switches:
//   ?theme=fight|maple   black + orange (the Muay Thai poster) or navy + red
//   ?phase=1..7          hold on one beat instead of playing
import React, { useMemo } from "react";
import "../Stylesheets/MapleGear.css";
import usePhases from "../Utils/usePhases";
import mapleLogo from "../Images/maple-logo.png";
import giPhoto from "../Images/maple-gi.png";
import glovesPhoto from "../Images/maple-gloves.png";

//        hook  shirt hoodie  gi  gloves total  endcard
const CUES = [200, 1900, 3700, 5500, 7300, 9300, 11500];
const LOOP_AT = 17500;

const HEADLINE = ["F", "R", "E", "E", " ", "G", "E", "A", "R"];

// tray slot centres, as offsets from the stage centre (u)
const TRAY_X = [-30.375, -10.79, 8.79, 28.375];
const TRAY_Y = 53.5;
// endcard quadrants
const GRID = [
  [-15, -16],
  [15, -16],
  [-15, 13],
  [15, 13],
];

function Hoodie() {
  return (
    <svg viewBox="0 0 200 200" className="mg-svg" aria-label="Hoodie">
      <defs>
        <linearGradient id="mg-hd-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#23262e" />
          <stop offset="0.3" stopColor="#3b404c" />
          <stop offset="0.62" stopColor="#363a45" />
          <stop offset="1" stopColor="#1b1d24" />
        </linearGradient>
        <linearGradient id="mg-hd-sleeve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#353944" />
          <stop offset="1" stopColor="#22252c" />
        </linearGradient>
        <radialGradient id="mg-hd-hole" cx="0.5" cy="0.35" r="0.6">
          <stop offset="0" stopColor="#0a0b0e" />
          <stop offset="1" stopColor="#1d2027" />
        </radialGradient>
      </defs>
      <g>
        {/* sleeves, hanging a little off the body */}
        <path d="M58 46 C40 52 31 70 27 98 L18 160 C17 166 21 170 27 170 L44 170 C49 170 51 166 51 161 L60 104 Z" fill="url(#mg-hd-sleeve)" />
        <path d="M142 46 C160 52 169 70 173 98 L182 160 C183 166 179 170 173 170 L156 170 C151 170 149 166 149 161 L140 104 Z" fill="url(#mg-hd-sleeve)" />
        {/* cuffs */}
        <rect x="17" y="160" width="35" height="13" rx="5" fill="#1f2229" />
        <rect x="148" y="160" width="35" height="13" rx="5" fill="#1f2229" />
        {/* hood, lying back behind the neck */}
        <path d="M64 50 C60 22 80 10 100 10 C120 10 140 22 136 50 Z" fill="#2c3039" />
        {/* body */}
        <path d="M58 44 C70 38 84 36 100 36 C116 36 130 38 142 44 L146 176 C146 181 142 184 137 184 L63 184 C58 184 54 181 54 176 Z" fill="url(#mg-hd-body)" />
        {/* ribbed hem */}
        <path d="M54 168 L146 168 L146 178 C146 182 143 185 138 185 L62 185 C57 185 54 182 54 178 Z" fill="#20232a" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((i) => (
          <path key={i} d={`M${58 + i * 4.6} 170 V183`} stroke="#15171c" strokeWidth="1" opacity="0.7" />
        ))}
        {/* the hood's opening, and its two front edges crossing at the throat */}
        <path d="M76 40 C76 26 88 18 100 18 C112 18 124 26 124 40 C118 56 110 66 100 70 C90 66 82 56 76 40 Z" fill="url(#mg-hd-hole)" />
        <path d="M70 42 C72 58 86 70 100 74 C114 70 128 58 130 42" fill="none" stroke="#454a57" strokeWidth="6" strokeLinecap="round" />
        {/* drawstrings */}
        <path d="M92 70 C91 82 89 92 88 104" fill="none" stroke="#e9e6dd" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M108 70 C109 82 111 92 112 102" fill="none" stroke="#e9e6dd" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="86" y="102" width="4" height="8" rx="1.5" fill="#c8c4b8" />
        <rect x="110" y="100" width="4" height="8" rx="1.5" fill="#c8c4b8" />
        {/* kangaroo pocket */}
        <path d="M70 132 L130 132 C134 144 138 156 140 166 L60 166 C62 156 66 144 70 132 Z" fill="#30343e" />
        <path d="M70 132 L130 132" stroke="#262930" strokeWidth="2" />
        <path d="M70 132 C66 144 62 156 60 166" fill="none" stroke="#1a1c22" strokeWidth="2.4" />
        <path d="M130 132 C134 144 138 156 140 166" fill="none" stroke="#1a1c22" strokeWidth="2.4" />
        {/* folds */}
        <path d="M66 70 C70 92 68 116 64 136" fill="none" stroke="#1b1d23" strokeWidth="3" opacity="0.45" strokeLinecap="round" />
        <path d="M136 72 C131 96 133 116 137 134" fill="none" stroke="#1b1d23" strokeWidth="3" opacity="0.45" strokeLinecap="round" />
        <path d="M36 92 C40 112 40 132 36 150" fill="none" stroke="#4a4f5c" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      </g>
      {/* chest print */}
      <image href={mapleLogo} x="80" y="80" width="40" height="40" preserveAspectRatio="xMidYMid meet" />
    </svg>
  );
}

function Shirt() {
  return (
    <svg viewBox="0 0 200 200" className="mg-svg" aria-label="T-shirt">
      <defs>
        <linearGradient id="mg-tee-body" x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor="#d9dce3" />
          <stop offset="0.28" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#f3f4f7" />
          <stop offset="1" stopColor="#c3c7d0" />
        </linearGradient>
        <linearGradient id="mg-tee-sleeve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6f7f9" />
          <stop offset="1" stopColor="#cfd3db" />
        </linearGradient>
      </defs>
      <g>
        {/* sleeves */}
        <path d="M66 30 L28 52 C22 56 20 62 22 68 L32 96 C34 101 39 103 44 101 L62 92 Z" fill="url(#mg-tee-sleeve)" />
        <path d="M134 30 L172 52 C178 56 180 62 178 68 L168 96 C166 101 161 103 156 101 L138 92 Z" fill="url(#mg-tee-sleeve)" />
        <path d="M24 74 L33 98 M176 74 L167 98" stroke="#b9bec8" strokeWidth="2.4" opacity="0.8" />
        {/* body */}
        <path d="M66 28 C76 25 86 24 100 24 C114 24 124 25 134 28 L140 60 L144 174 C144 180 140 184 134 184 L66 184 C60 184 56 180 56 174 L60 60 Z" fill="url(#mg-tee-body)" />
        <path d="M57 176 H143" stroke="#c4c8d1" strokeWidth="2" />
        {/* crew neck */}
        <path d="M80 26 C84 40 92 46 100 46 C108 46 116 40 120 26" fill="none" stroke="#e1e4ea" strokeWidth="9" strokeLinecap="round" />
        <path d="M84 26 C88 37 94 41 100 41 C106 41 112 37 116 26 Z" fill="#b7bcc6" />
        {/* folds */}
        <path d="M70 70 C74 100 72 140 68 168" fill="none" stroke="#b5bac4" strokeWidth="3" opacity="0.5" strokeLinecap="round" />
        <path d="M132 78 C128 108 130 140 134 166" fill="none" stroke="#b5bac4" strokeWidth="3" opacity="0.45" strokeLinecap="round" />
      </g>
      <image href={mapleLogo} x="74" y="62" width="52" height="52" preserveAspectRatio="xMidYMid meet" />
    </svg>
  );
}

const Mystery = () => (
  <svg viewBox="0 0 100 100" className="mg-q" aria-hidden="true">
    <text x="50" y="72" textAnchor="middle">?</text>
  </svg>
);

const Spark = ({ i }) => <i className="mg-spark" style={{ "--a": `${i * 45 + 22}deg` }} />;

function MapleGear({
  mode = "animated",
  items = [
    { key: "shirt", name: "T-SHIRT", price: 40, art: "shirt" },
    { key: "hoodie", name: "HOODIE", price: 80, art: "hoodie" },
    { key: "gi", name: "GI", price: 120, photo: giPhoto },
    { key: "gloves", name: "GLOVES", price: 140, photo: glovesPhoto },
  ],
  kicker = "MAPLE JIU-JITSU IS GIVING AWAY",
  hook = "4 PIECES · $0",
  allFree = "ALL OF IT. FREE.",
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
  const theme = query.get("theme") === "maple" ? "maple" : "fight";

  const total = items.reduce((sum, it) => sum + it.price, 0);
  // running total: what has landed so far
  const landed = items.slice(0, Math.max(0, Math.min(items.length, phase - 1)));
  const running = landed.reduce((sum, it) => sum + it.price, 0);

  const stateOf = (i) => {
    if (phase >= 7) return "grid";
    if (phase < i + 2) return "off";
    if (phase === i + 2) return "hero";
    return "tray";
  };

  const lines = [hook, ...items.map((it) => `FREE ${it.name}`), allFree, `$${total} IN GEAR. $0.`];

  return (
    <div className={`mg-stage mg-p${phase} mg-t-${theme}${still ? " is-static" : ""}`}>
      <div className="mg-bg" aria-hidden="true">
        <div className="mg-slab" />
        <div className="mg-rays" />
        <div className="mg-spot" />
        <svg className="mg-grain">
          <filter id="mg-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#mg-noise)" />
        </svg>
      </div>

      {!still && phase > 1 && <div key={phase} className="mg-flash" aria-hidden="true" />}

      <div className="mg-card">
        <div className={`mg-shaker mg-shake-${phase % 2 ? "a" : "b"}`}>
          <img className="mg-logo" src={mapleLogo} alt="Maple Jiu-Jitsu" />
          <div className="mg-kicker">{kicker}</div>
          <h1 className="mg-headline" aria-label="Free gear">
            {HEADLINE.map((ch, i) =>
              ch === " " ? (
                <span key={i} className="mg-gap" />
              ) : (
                <span key={i} className="mg-letter" style={{ "--i": i }}>
                  {ch}
                </span>
              )
            )}
          </h1>

          {/* the stage: mystery tiles on the hook, the total on its beat */}
          <div className="mg-box">
            <div className="mg-glow" />
            <div className="mg-mystery">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="mg-tile" style={{ "--i": i }}>
                  <Mystery />
                </div>
              ))}
            </div>
            <div className="mg-sum">
              <div className="mg-sum-label">TOTAL VALUE</div>
              <div className="mg-sum-num">${total}</div>
              <div className="mg-stamp mg-stamp-big">
                FREE
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <Spark key={i} i={i} />)}
              </div>
            </div>
          </div>

          {items.map((it, i) => (
            <div
              key={it.key}
              className={`mg-item mg-${stateOf(i)}`}
              style={{
                "--tx": TRAY_X[i],
                "--ty": TRAY_Y,
                "--gx": GRID[i][0],
                "--gy": GRID[i][1],
                "--order": i,
              }}
            >
              <div className="mg-art">
                {it.photo ? (
                  <img src={it.photo} alt={it.name} />
                ) : it.art === "hoodie" ? (
                  <Hoodie />
                ) : (
                  <Shirt />
                )}
              </div>
              <div className="mg-tag">
                <span className="mg-tag-price">${it.price}</span>
                <span className="mg-tag-label">VALUE</span>
                <i className="mg-strike" />
              </div>
              <div className="mg-stamp">
                FREE
                {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <Spark key={k} i={k} />)}
              </div>
              <div className="mg-mini-free">FREE</div>
            </div>
          ))}

          <div className="mg-lines">
            {lines.map((l, i) => (
              <div key={i} className={`mg-line mg-line-${i + 1}`}>
                {l}
              </div>
            ))}
          </div>

          <div className="mg-traybar">
            {items.map((it) => (
              <div key={it.key} className="mg-slot" />
            ))}
          </div>
          <div className="mg-cta">{cta}</div>

          <div className="mg-total">
            <span className="mg-total-label">GEAR VALUE</span>
            <span className="mg-total-num" style={{ "--n": running }} />
          </div>
          <div className="mg-site">{site}</div>
        </div>
      </div>

      <div className="mg-confetti" aria-hidden="true">
        {Array.from({ length: 28 }, (_, i) => (
          <i
            key={i}
            style={{
              "--x": `${(i * 37) % 100}%`,
              "--d": `${((i * 13) % 20) / 10}s`,
              "--r": `${(i * 71) % 360}deg`,
              "--c": i % 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default MapleGear;
