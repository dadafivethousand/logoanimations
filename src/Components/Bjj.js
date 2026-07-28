// Bjj.js — gi cloth, the mark on it, and WOODBRIDGE embroidered underneath.
//
// Genre, not franchise: it is the cloth that carries the theme — no academy
// crest, no federation marks.
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

// p1 the cloth · p2 the mark · p3 WOODBRIDGE is sewn on
const CUES = [200, 800, 1600];

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

      {/* ---- the mark, on the chest ---- */}
      <div className="bj-markwrap">
        <div className="bj-markbox">
          <div className="bj-mark">
            <img className="bj-logo" src={src} alt="Code Ninjas" />
          </div>
        </div>
        {/* WOODBRIDGE is embroidered, not set: satin stitch is a solid thread
            fill with fine diagonal ridges running across it, so the letters are
            filled with a rotated line pattern rather than a flat colour, sat in
            a dent in the cloth and lit along their top edge. */}
        <svg className="bj-type" viewBox="0 0 600 90" aria-label={caption}>
          <text
            className="bj-embroidery"
            x="300"
            y="58"
            textAnchor="middle"
          >
            {caption}
          </text>
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
        {/* Satin stitch: individual threads laid side by side across the width
            of each stroke. The ridges are what make it read as embroidery — a
            flat fill just looks like printed ink on cloth. */}
        <pattern
          id="bj-satin"
          patternUnits="userSpaceOnUse"
          width="5"
          height="5"
          patternTransform="rotate(62)"
        >
          <rect width="5" height="5" fill="#1e3f63" />
          <rect width="2.1" height="5" fill="#2f5c8c" />
          <rect x="2.1" width="0.7" height="5" fill="#12283f" />
        </pattern>

        {/* the thread sits proud of the cloth: a dent under it, a lit top edge,
            and the cloth's own shadow pooling at its foot */}
        <filter id="bj-thread" x="-20%" y="-40%" width="140%" height="200%">
          {/* thread edges are never razor-straight: a small displacement gives
              the letters the slight fur of laid floss. Any more than ~2 and it
              stops being embroidery and starts being illegible. */}
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="5" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="1.8"
            xChannelSelector="R"
            yChannelSelector="G"
            result="d"
          />
          <feDropShadow in="d" dx="0" dy="1.6" stdDeviation="1.1" floodColor="#5a5140" floodOpacity="0.75" result="s" />
          <feDropShadow in="s" dx="0" dy="-0.8" stdDeviation="0.4" floodColor="#ffffff" floodOpacity="0.5" />
        </filter>
      </defs>
    </svg>
  );
}
