// Bjj.js — the mark on the mat, with a black belt cinched under it.
//
// Genre, not franchise: the vocabulary is a tatami mat, gi cotton and a belt —
// no academy's crest, no federation marks.
//
// THE MARK KEEPS ITS OWN COLOURS. It is drawn as itself — an <img>, unmasked and
// unrecoloured — so "CODE" stays brand blue and the hood stays black. The theme
// is carried by the mat and the belt.
//
// WOODBRIDGE lives INSIDE the mark wrapper, directly after the mark, and the
// belt follows both: all three are flow siblings, so the name cannot drift away
// from the logo and the belt always sits under the pair.
import React from "react";
import "../Stylesheets/Bjj.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 the mat · p2 the mark lands · p3 the belt cinches · p4 the stripes
const CUES = [200, 750, 1400, 2100];

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

      {/* ---- the mat ---- */}
      <div className="bj-mat" aria-hidden />
      <div className="bj-weave" aria-hidden />
      <div className="bj-seams" aria-hidden />
      <div className="bj-light" aria-hidden />

      {/* ---- mark, name, belt: one lockup ---- */}
      <div className="bj-markwrap">
        <div className="bj-markbox">
          <div className="bj-shadow" aria-hidden />
          <div className="bj-mark">
            <img className="bj-logo" src={src} alt="Code Ninjas" />
          </div>
        </div>

        <div className="bj-type">
          <div className="bj-caption">{caption}</div>
        </div>

        {/* the belt is the rule: it cinches shut from both sides */}
        <div className="bj-belt" aria-hidden>
          <svg viewBox="0 0 600 230" preserveAspectRatio="xMidYMid meet">
            {/* the two straps, running off the frame */}
            <g className="bj-strap">
              <path className="bj-leather" d="M-20 40 H262 V98 H-20 Z" />
              <path className="bj-leather" d="M338 40 H620 V98 H338 Z" />
              <path className="bj-stitch" d="M-20 51 H262 M-20 87 H262 M338 51 H620 M338 87 H620" />
            </g>

            <g className="bj-knot">
              {/* the tails hang from UNDER the knot, so they are drawn first
                  and the knot laps over where they leave it */}
              <g className="bj-tails">
                {/* near tail, plain */}
                <path className="bj-leather" d="M262 96 L298 96 L288 214 L246 214 Z" />
                <path className="bj-stitch" d="M270 104 L258 206 M292 104 L282 206" />
                {/* far tail, carrying the bar */}
                <path className="bj-leather" d="M302 96 L338 96 L352 214 L312 214 Z" />
                <path className="bj-bar" d="M309 156 L344 156 L352 214 L316 214 Z" />
                <g className="bj-stripes">
                  <rect x="316" y="166" width="7" height="38" style={{ "--i": 0 }} />
                  <rect x="327" y="166" width="7" height="38" style={{ "--i": 1 }} />
                  <rect x="338" y="166" width="7" height="38" style={{ "--i": 2 }} />
                </g>
              </g>

              {/* the knot itself, lapping over the tails */}
              <path
                className="bj-leather-hi"
                d="M250 26 h100 a14 14 0 0 1 14 14 v58 a14 14 0 0 1 -14 14 h-100 a14 14 0 0 1 -14 -14 v-58 a14 14 0 0 1 14 -14 z"
              />
              <path className="bj-stitch" d="M252 40 V98 M348 40 V98" />
              {/* the shadow the knot throws onto the tails */}
              <path className="bj-knot-shade" d="M246 112 H354 V126 H246 Z" />
            </g>
          </svg>
        </div>
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
      </defs>
    </svg>
  );
}
