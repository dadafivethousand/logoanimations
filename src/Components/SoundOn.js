// SoundOn.js — the basic one. No material, no diorama: the mark in its own
// brand colours on a clean paper stage, with sound rings pulsing out from
// behind it and a SOUND ON cue to get the viewer to unmute.
//
// Two deliberate departures from the house rules, both asked for:
//
//   1. This theme renders a second piece of text, "SOUND ON". Every other
//      theme renders exactly one word (WOODBRIDGE) and should keep doing so —
//      the exception is this theme's whole job, not a new licence.
//   2. The mark is NOT masked into a material here. "Basic" means the logo
//      is itself: black hood, skin eye band, blue "CODE", painted straight
//      from the artwork as a background-image. Nothing to recolour, so
//      nothing to knock out of register.
import React from "react";
import "../Stylesheets/SoundOn.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 mark lands · p2 caption · p3 sound rings + the cue
const CUES = [200, 900, 1600];

const RINGS = [0, 1, 2, 3];

export default function SoundOn({
  mode = "animated",
  caption = "WOODBRIDGE",
  cue = "SOUND ON",
  loopAt = 6500,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="so so-p0" aria-hidden />;

  return (
    <div
      className={`so so-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      <div className="so-bg" aria-hidden />

      <div className="so-markwrap">
        <div className="so-markbox">
          {/* sound pushing out from behind the mark */}
          <div className="so-rings" aria-hidden>
            {RINGS.map((i) => (
              <span key={i} className={`so-ring so-r${i + 1}`} />
            ))}
          </div>

          {/* the artwork itself — painted, not masked */}
          <div className="so-mark" role="img" aria-label="Code Ninjas" />
        </div>

        <div className="so-type">
          <div className="so-caption">{caption}</div>
        </div>
      </div>

      {/* the ask: turn the volume up */}
      <div className="so-cue">
        <span className="so-pill">
          <svg className="so-speaker" viewBox="0 0 24 24" aria-hidden>
            <path className="so-body" d="M3 9.2h4.1L12.6 5v14L7.1 14.8H3z" />
            <path className="so-arc so-a1" d="M15.9 9.1a4.3 4.3 0 0 1 0 5.8" />
            <path className="so-arc so-a2" d="M18.6 6.4a8 8 0 0 1 0 11.2" />
            <path className="so-arc so-a3" d="M21.3 3.7a11.7 11.7 0 0 1 0 16.6" />
          </svg>
          <span className="so-cue-text">{cue}</span>
        </span>
      </div>
    </div>
  );
}
