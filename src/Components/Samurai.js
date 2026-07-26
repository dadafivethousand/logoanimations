// Samurai.js — the mark rendered as a forged, lacquered armour plate standing
// against a washi-paper hinomaru, with minor katana slashes on the forge beat.
//
// Everything organic (torn sun edge, brush strokes) is inline SVG driven by
// feTurbulence displacement, so nothing is a flat circle. Everything material
// (lacquer, bevel) is CSS gradients + drop-shadow chains masked through the
// logo's alpha.
import React from "react";
import "../Stylesheets/Samurai.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 paper + sun · p2 ink strokes · p3 plate forges in · p4 gold + seal + type
const CUES = [180, 700, 1350, 2250];

export default function Samurai({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = 7500,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  // hold the first frame until the mark is measured — otherwise the plate
  // pops in at the wrong aspect for one frame
  if (!ready) return <div className="sm sm-p0" aria-hidden />;

  return (
    <div
      className={`sm sm-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      <SamuraiDefs />

      {/* ---- ground ---- */}
      <div className="sm-paper" aria-hidden />
      <div className="sm-fold" aria-hidden />

      {/* ---- hinomaru: torn-edge sun ---- */}
      <svg className="sm-sun" viewBox="0 0 600 600" aria-hidden>
        <circle cx="300" cy="300" r="252" filter="url(#sm-tear)" fill="url(#sm-sunfill)" />
        <circle
          cx="300"
          cy="300"
          r="252"
          filter="url(#sm-tear)"
          fill="none"
          stroke="#5e0713"
          strokeWidth="3"
          opacity="0.35"
        />
      </svg>

      {/* ---- sumi-e brush strokes ---- */}
      <svg className="sm-ink sm-ink-a" viewBox="0 0 1000 300" aria-hidden>
        <path
          d="M20 190 C 210 96, 430 232, 640 150 S 900 74, 980 122"
          filter="url(#sm-brush)"
          stroke="url(#sm-inkfill)"
          strokeWidth="46"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <svg className="sm-ink sm-ink-b" viewBox="0 0 1000 300" aria-hidden>
        <path
          d="M980 120 C 800 210, 560 84, 340 176 S 90 236, 24 190"
          filter="url(#sm-brush)"
          stroke="url(#sm-inkfill)"
          strokeWidth="28"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <div className="sm-mist" aria-hidden />

      {/* ---- the mark ---- */}
      <div className="sm-markwrap">
        {/* soft darkening behind the plate — a near-black mark laid straight
            onto the red disc has almost no separation without it */}
        <div className="sm-halo" aria-hidden />

        <div className="sm-mark">
          {/* cast shadow, offset and blurred, follows the alpha */}
          <div className="sm-layer sm-cast" aria-hidden />

          {/* The bevel wrapper carries a chain of hairline drop-shadows. Because
              drop-shadow reads the *alpha* of what it wraps, the rims trace the
              letterforms exactly — a machined chamfer, not a rectangle. */}
          <div className="sm-plate" aria-hidden>
            {/* base lacquer: black-cherry urushi with a red undertone */}
            <div className="sm-layer sm-lacquer" />
            {/* forged surface grain, multiplied over the lacquer */}
            <div className="sm-layer sm-grainplate" />
          </div>

          {/* fixed specular — present in static mode too */}
          <div className="sm-layer sm-spec" aria-hidden />

          {/* one-pass polish sweep — animated mode only */}
          <div className="sm-layer sm-sweep" aria-hidden />
        </div>
      </div>

      {/* ---- minor katana slashes: two quick light-streaks cross on the forge
             beat, plus one faint residual cut across the hinomaru ---- */}
      <div className="sm-cut" aria-hidden />
      <div className="sm-slashes" aria-hidden>
        <span className="sm-slash sm-slash-1" />
        <span className="sm-slash sm-slash-2" />
      </div>

      {/* ---- type ---- */}
      <div className="sm-type">
        <div className="sm-caption">{caption}</div>
        <div className="sm-rule" aria-hidden />
      </div>

      <div className="sm-fibre" aria-hidden />
      <div className="sm-vignette" aria-hidden />
    </div>
  );
}

/* Filter/gradient defs. Kept in one zero-size <svg> so the theme stays a
   single self-contained component. */
function SamuraiDefs() {
  return (
    <svg className="sm-defs" aria-hidden focusable="false">
      <defs>
        {/* torn washi / stamped-ink edge */}
        <filter id="sm-tear" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="4" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="17" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* dry-brush: displace hard, then chew holes in the stroke */}
        <filter id="sm-brush" x="-15%" y="-40%" width="130%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.014 0.05" numOctaves="4" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" seed="11" result="g" />
          <feColorMatrix
            in="g"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.9 0 0 0 -0.12"
            result="gm"
          />
          <feComposite in="d" in2="gm" operator="out" />
        </filter>

        <radialGradient id="sm-sunfill" cx="42%" cy="36%" r="72%">
          <stop offset="0%" stopColor="#e2213f" />
          <stop offset="52%" stopColor="#c8102e" />
          <stop offset="100%" stopColor="#8b0a20" />
        </radialGradient>

        <linearGradient id="sm-inkfill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0a0908" stopOpacity="0.04" />
          <stop offset="16%" stopColor="#0a0908" stopOpacity="0.95" />
          <stop offset="58%" stopColor="#14110f" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#14110f" stopOpacity="0.03" />
        </linearGradient>
      </defs>
    </svg>
  );
}
