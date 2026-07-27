// Pirates.js — the logo as a pirate ninja, and nothing else. No ship, no sea,
// no scene: a lit stage, the mark, and the gear it's wearing.
//
// Genre, not franchise: no studio marks, no character likenesses, no film
// typeface.
//
// THE MARK KEEPS ITS OWN COLOURS. Earlier passes recast it in gold, which was
// left over from a sunken-treasure concept and is not a brand colour — the
// lockup is black hood and "NINJAS", a skin-tone band across the eyes, and
// "CODE" in Code Ninjas blue. So the logo is drawn as itself here, on a light
// stage that lets those colours read, and only the gear is added on top.
//
// THE GEAR IS MEASURED, NOT EYEBALLED. Everything worn on the head is placed in
// percentages of the mark box taken off the artwork's own pixels:
//
//     head      left 32.7%  top 0%     w 29.3%  h 46.3%
//     eye band  left 39.5%  top 22.1%  w 21.1%  h 10.7%
//
// The face gear sits in a box pinned to exactly those head bounds and draws in
// head-local coordinates, so the patch lands on an eye instead of near one. If
// the logo file is ever replaced, re-measure and update HEAD below.
//
// WOODBRIDGE lives INSIDE the mark wrapper, directly after the mark — never
// positioned independently, or it drifts away from the logo.
import React from "react";
import "../Stylesheets/Pirates.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 the stage lights · p2 the mark lands · p3 the gear goes on · p4 WOODBRIDGE
const CUES = [200, 700, 1500, 2200];

// measured off the artwork — see the note at the top
const HEAD = { left: "32.7%", top: "0%", width: "29.3%", height: "46.3%" };

export default function Pirates({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = 7000,
}) {
  const { src, logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="pc pc-p0" aria-hidden />;

  return (
    <div
      className={`pc pc-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      <PiratesDefs />

      {/* ---- the stage: light, and nothing on it ---- */}
      <div className="pc-stage" aria-hidden />
      <div className="pc-pool" aria-hidden />
      <div className="pc-tex" aria-hidden />

      {/* ---- the pirate ninja ---- */}
      <div className="pc-markwrap">
        <div className="pc-markbox">
          <div className="pc-shadow" aria-hidden />

          <div className="pc-mark">
            {/* The logo is drawn as itself, not masked and recoloured — that is
                what keeps CODE blue and the hood black. The material work here
                is lighting only: a soft cast shadow and a hairline lift. */}
            <img className="pc-logo" src={src} alt="Code Ninjas" />

            {/* --- the tricorn, dropped onto the crown --- */}
            <div className="pc-hat" aria-hidden>
              <svg viewBox="0 0 400 190">
                {/* A tricorn, not a mortarboard: the brim sweeps UP at both
                    corners and the crown rises between them. A flat wide arc
                    reads as a graduation cap every time. */}
                <path
                  className="pc-hat-felt"
                  d="M10 146 C 26 104, 62 72, 108 58 C 132 22, 174 6, 200 6 C 226 6, 268 22, 292 58 C 338 72, 374 104, 390 146 C 344 124, 292 112, 200 112 C 108 112, 56 124, 10 146 Z"
                />
                <path
                  className="pc-hat-band"
                  d="M104 84 C 140 62, 260 62, 296 84 C 258 74, 142 74, 104 84 Z"
                />
                <circle className="pc-hat-stud" cx="300" cy="78" r="12" />
              </svg>
            </div>

            {/* --- eyepatch + straps, in head-local coordinates --- */}
            <div className="pc-facegear" style={HEAD} aria-hidden>
              <svg viewBox="0 0 293 463" preserveAspectRatio="none">
                {/* Two straps running off the patch to the sides of the head,
                    rather than one bar across the face — a single band would
                    cross his good eye and read as a stick through his head. */}
                <path className="pc-strap" d="M112 262 L -8 230" />
                <path className="pc-strap" d="M150 250 L 268 176" />
                {/* patch over his left eye — the band runs x 68–279, y 221–328,
                    so the left eye sits around x 118 */}
                <ellipse className="pc-patch" cx="118" cy="270" rx="62" ry="54" />
                <ellipse className="pc-patch-hi" cx="100" cy="252" rx="22" ry="15" />
              </svg>
            </div>

            {/* --- hoop at the jaw --- */}
            <div className="pc-earring" aria-hidden>
              <svg viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="20" />
              </svg>
            </div>
          </div>
        </div>

        {/* directly under the mark, in flow */}
        <div className="pc-type">
          <div className="pc-caption">{caption}</div>
          <div className="pc-rule" aria-hidden />
        </div>
      </div>

      <div className="pc-grain" aria-hidden />
      <div className="pc-vignette" aria-hidden />
    </div>
  );
}

function PiratesDefs() {
  return (
    <svg className="pc-defs" aria-hidden focusable="false">
      <defs>
        {/* felt has a slightly irregular edge; a perfect vector curve reads as
            plastic */}
        <filter id="pc-felt" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="9" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
