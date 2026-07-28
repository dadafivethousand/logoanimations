// Bjj.js — the frame IS a gi. Heavy cotton weave, the two lapels crossing down
// to the waist, a black belt cinched across them, and the mark on the chest.
//
// Genre, not franchise: cotton, lapels and a belt — no academy crest, no
// federation marks.
//
// THE MARK KEEPS ITS OWN COLOURS. It is drawn as itself — an <img>, unmasked and
// unrecoloured — so "CODE" stays brand blue and the hood stays black. On bone
// cotton both read without any help.
//
// WOODBRIDGE lives INSIDE the mark wrapper, directly after the mark, so the name
// cannot drift away from the logo.
import React from "react";
import "../Stylesheets/Bjj.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 the cloth · p2 the lapels cross · p3 the belt cinches · p4 the chest mark
const CUES = [200, 750, 1350, 2050];

export default function Bjj({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = 7000,
}) {
  const { src, logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="bj bj-p0" aria-hidden />;

  return (
    <div className={`bj bj-p${phase} ${isStatic ? "is-static" : ""}`} style={logoVar} key={run}>
      <BjjDefs />

      {/* ---- the cloth ---- */}
      <div className="bj-cloth" aria-hidden />
      <div className="bj-weave" aria-hidden />
      <div className="bj-folds" aria-hidden />

      {/* ---- the jacket: two lapels running from the shoulders down to the
             waist, where they cross ---- */}
      <svg className="bj-jacket" viewBox="0 0 100 178" preserveAspectRatio="none" aria-hidden>
        <g className="bj-lapel bj-lapel-l">
          <path className="bj-lapel-face" d="M8 -4 L30 -4 L60 118 L44 126 Z" />
          <path className="bj-lapel-stitch" d="M13 -4 L46 120 M26 -4 L57 116" />
        </g>
        <g className="bj-lapel bj-lapel-r">
          <path className="bj-lapel-face" d="M92 -4 L70 -4 L40 118 L56 126 Z" />
          <path className="bj-lapel-stitch" d="M87 -4 L54 120 M74 -4 L43 116" />
        </g>
      </svg>

      {/* ---- the mark, on the chest ---- */}
      <div className="bj-markwrap">
        <div className="bj-markbox">
          <div className="bj-mark">
            <img className="bj-logo" src={src} alt="Code Ninjas" />
          </div>
        </div>
        <div className="bj-type">
          <div className="bj-caption">{caption}</div>
        </div>
      </div>

      {/* ---- the belt, cinched across the waist ---- */}
      <div className="bj-belt" aria-hidden>
        <svg viewBox="0 0 600 260" preserveAspectRatio="none">
          <g className="bj-strap">
            <path className="bj-leather" d="M-20 46 H262 V112 H-20 Z" />
            <path className="bj-leather" d="M338 46 H620 V112 H338 Z" />
            <path className="bj-stitch" d="M-20 58 H262 M-20 100 H262 M338 58 H620 M338 100 H620" />
          </g>

          <g className="bj-knot">
            {/* the tails hang from UNDER the knot: drawn first, with the knot
                lapping over where they leave it */}
            <g className="bj-tails">
              <path className="bj-leather" d="M262 110 L298 110 L288 244 L246 244 Z" />
              <path className="bj-stitch" d="M270 118 L258 236 M292 118 L282 236" />
              <path className="bj-leather" d="M302 110 L338 110 L352 244 L312 244 Z" />
              {/* the red bar a black belt carries, without the rank stripes */}
              <path className="bj-bar" d="M308 180 L344 180 L352 244 L316 244 Z" />
            </g>

            <path
              className="bj-leather-hi"
              d="M250 30 h100 a14 14 0 0 1 14 14 v68 a14 14 0 0 1 -14 14 h-100 a14 14 0 0 1 -14 -14 v-68 a14 14 0 0 1 14 -14 z"
            />
            <path className="bj-stitch" d="M252 44 V112 M348 44 V112" />
            <path className="bj-knot-shade" d="M246 126 H354 V142 H246 Z" />
          </g>
        </svg>
      </div>

      <div className="bj-grain" aria-hidden />
      <div className="bj-vignette" aria-hidden />
    </div>
  );
}

function BjjDefs() {
  return (
    <svg className="bj-defs" aria-hidden focusable="false">
      <defs>
        {/* belt cotton is not flat: it takes light along the top edge */}
        <linearGradient id="bj-belt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#33333f" />
          <stop offset="34%" stopColor="#1a1a22" />
          <stop offset="72%" stopColor="#101016" />
          <stop offset="100%" stopColor="#24242e" />
        </linearGradient>
        <linearGradient id="bj-belt-hi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d3d4a" />
          <stop offset="40%" stopColor="#20202a" />
          <stop offset="100%" stopColor="#141419" />
        </linearGradient>
        <linearGradient id="bj-barfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c02234" />
          <stop offset="60%" stopColor="#8f101f" />
          <stop offset="100%" stopColor="#6d0b17" />
        </linearGradient>
        {/* the lapel is a doubled-over strip, so it is a shade darker than the
            body of the jacket and lit along its inner edge */}
        <linearGradient id="bj-lapelfill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ddd7c8" />
          <stop offset="40%" stopColor="#f2eee3" />
          <stop offset="100%" stopColor="#d2cbba" />
        </linearGradient>
      </defs>
    </svg>
  );
}
