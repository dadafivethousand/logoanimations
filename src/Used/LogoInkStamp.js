// LogoInkStamp.js — the logo lands like a rubber stamp on paper stock.
// Palette: warm cream paper + ink black + a single red stamp ring. Bright,
// daylight counterpoint to the two dark stages.
import React from "react";
import "./LogoInkStamp.css";
import usePhases from "../Utils/usePhases";
import logo from "../Images/cn-woodbridge-logo.png";

// p1 paper settles · p2 stamp impact · p3 caption
const CUES = [200, 900, 1500];

export default function LogoInkStamp({
  caption = "EST. WOODBRIDGE",
  loopAt = 5500,
}) {
  const { phase, run } = usePhases(CUES, loopAt);

  return (
    <div className={`is-stage is-p${phase}`} key={run}>
      <div className="is-paper" aria-hidden />
      <div className="is-fibres" aria-hidden />

      <div className="is-center">
        <div className="is-stamp">
          <span className="is-ring" aria-hidden />
          <img className="is-logo" src={logo} alt="Code Ninjas" />
          <span className="is-dust" aria-hidden />
        </div>

        <div className="is-caption">{caption}</div>
      </div>
    </div>
  );
}
