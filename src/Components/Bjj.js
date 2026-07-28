// Bjj.js — a Code Ninjas Woodbridge patch sewn onto the back of a gi.
//
// Genre, not franchise: cloth and thread only — no academy crest, no federation
// marks.
//
// THE ANATOMY OF A REAL GI PATCH, which is what this is built from:
//
//   merrowed border  the thick rolled edge. It is satin stitch worked around
//                    the rim, so it gets the same treatment as the lettering:
//                    a stroke filled with a rotated line pattern, not a flat
//                    band of colour.
//   twill face       the backing cloth, woven on the diagonal, visible between
//                    the stitches.
//   tack stitching   the running stitch that actually holds the patch to the
//                    gi, set just inside the border.
//   the artwork      embroidered, so it has thread fur and sits proud with a
//                    shadow under it — never flat print.
//   the patch itself sits ON the gi: it casts a shadow, and the cloth puckers
//                    slightly around it.
//
// THE MARK KEEPS ITS OWN COLOURS — the logo is the real file, given the thread
// treatment rather than being redrawn or recoloured.
import React from "react";
import "../Stylesheets/Bjj.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 the gi · p2 the patch is laid on · p3 it is tacked down · p4 WOODBRIDGE
const CUES = [200, 800, 1500, 2200];

export default function Bjj({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = 7500,
}) {
  const { src, logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="bj bj-p0" aria-hidden />;

  return (
    <div className={`bj bj-p${phase} ${isStatic ? "is-static" : ""}`} style={logoVar} key={run}>
      <BjjDefs />

      {/* ---- the gi, seen from behind ---- */}
      <div className="bj-cloth" aria-hidden />
      <div className="bj-weave" aria-hidden />
      <div className="bj-folds" aria-hidden />
      {/* the seams a gi jacket actually has: a yoke across the shoulders and a
          centre seam down the back */}
      <div className="bj-seam bj-seam-yoke" aria-hidden />
      <div className="bj-seam bj-seam-spine" aria-hidden />

      {/* ---- the patch ---- */}
      <div className="bj-patchwrap">
        {/* the cloth is drawn in slightly all round where the patch is tacked */}
        <div className="bj-pucker" aria-hidden />

        <div className="bj-patch">
          <svg className="bj-patchsvg" viewBox="0 0 600 430" aria-hidden>
            <defs>
              <clipPath id="bj-faceclip">
                <rect x="16" y="16" width="568" height="398" rx="30" />
              </clipPath>
            </defs>

            {/* the side wall: a patch is a few millimetres thick, and the sliver
                of edge showing beneath it is what gives it that thickness */}
            <rect className="bj-edge" x="16" y="22" width="568" height="398" rx="30" />

            {/* the backing, and its twill */}
            <rect className="bj-face" x="16" y="16" width="568" height="398" rx="30" />
            <rect className="bj-twill" x="16" y="16" width="568" height="398" rx="30" />

            {/* the raised border throws a shadow onto the face inside it */}
            <g clipPath="url(#bj-faceclip)">
              <rect className="bj-inner" x="16" y="16" width="568" height="398" rx="30" />
            </g>

            {/* merrowed border: satin stitch worked around the rim */}
            <rect className="bj-merrow" x="16" y="16" width="568" height="398" rx="30" />
            {/* and the roll of it: lit along the top, shaded underneath, which is
                what turns a flat band into a bead of thread */}
            <rect className="bj-merrow-round" x="16" y="16" width="568" height="398" rx="30" />

            {/* the running stitch that holds it to the gi */}
            <rect className="bj-tack" x="46" y="46" width="508" height="338" rx="18" />
          </svg>

          {/* the artwork, embroidered */}
          <img className="bj-logo" src={src} alt="Code Ninjas" />

          <svg className="bj-type" viewBox="0 0 600 90" aria-label={caption}>
            <text className="bj-embroidery" x="300" y="60" textAnchor="middle">
              {caption}
            </text>
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
        {/* Satin stitch: threads laid side by side across the width of a stroke.
            The ridges are what make it read as embroidery — a flat fill just
            looks like ink printed on cloth. Used for the lettering... */}
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

        {/* ...and for the merrowed border, which is the same stitch worked
            around the rim. Charcoal thread rather than red — a dark merrow is
            what most academy patches actually use, and it stops the border
            competing with the artwork. */}
        <pattern
          id="bj-merrowfill"
          patternUnits="userSpaceOnUse"
          width="7"
          height="7"
          patternTransform="rotate(38)"
        >
          <rect width="7" height="7" fill="#26262b" />
          <rect width="3" height="7" fill="#3b3b43" />
          <rect x="3" width="1" height="7" fill="#101013" />
        </pattern>

        {/* the cross-section of the rolled edge: lit on top, shaded beneath */}
        <linearGradient id="bj-round" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="34%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="62%" stopColor="#000000" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
        </linearGradient>

        {/* the patch's backing cloth, woven on the diagonal */}
        <pattern
          id="bj-twillfill"
          patternUnits="userSpaceOnUse"
          width="6"
          height="6"
          patternTransform="rotate(45)"
        >
          <rect width="1.2" height="6" fill="rgba(120,110,92,0.18)" />
          <rect x="3" width="0.6" height="6" fill="rgba(255,255,255,0.55)" />
        </pattern>

        {/* thread sits proud of the cloth: a dent under it, a lit top edge, and
            edges that are not razor-straight */}
        <filter id="bj-thread" x="-20%" y="-40%" width="140%" height="200%">
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

        {/* the same, tuned for the artwork: a little more fur, since the logo is
            worked in heavier thread than the lettering */}
        <filter id="bj-thread-art" x="-20%" y="-30%" width="140%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="11" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="2.4"
            xChannelSelector="R"
            yChannelSelector="G"
            result="d"
          />
          <feDropShadow in="d" dx="0" dy="2" stdDeviation="1.4" floodColor="#4e4636" floodOpacity="0.7" result="s" />
          <feDropShadow in="s" dx="0" dy="-1" stdDeviation="0.5" floodColor="#ffffff" floodOpacity="0.45" />
        </filter>
      </defs>
    </svg>
  );
}
