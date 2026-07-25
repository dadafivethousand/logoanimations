// LogoNeonGlitch.js — RGB-split glitch that resolves into a clean neon logo.
// Palette: arcade violet + cyan/magenta split. Deliberately louder than
// LogoAssemble so consecutive posts don't look like the same ad twice.
import React from "react";
import "../Stylesheets/LogoNeonGlitch.css";
import usePhases from "../Utils/usePhases";
import logo from "../Images/cn-woodbridge-logo.png";

// p1 scanline power-on · p2 glitch burst · p3 resolve + label
const CUES = [200, 700, 1700];

export default function LogoNeonGlitch({
  label = "WOODBRIDGE",
  loopAt = 6000,
}) {
  const { phase, run } = usePhases(CUES, loopAt);

  return (
    <div className={`ng-stage ng-p${phase}`} key={run}>
      <div className="ng-scan" aria-hidden />
      <div className="ng-bars" aria-hidden />

      <div className="ng-center">
        <div className="ng-mark">
          {/* three stacked copies = cheap RGB split, no canvas needed */}
          <img className="ng-layer ng-cyan" src={logo} alt="" aria-hidden />
          <img className="ng-layer ng-magenta" src={logo} alt="" aria-hidden />
          <img className="ng-layer ng-main" src={logo} alt="Code Ninjas" />
          <span className="ng-tear" aria-hidden />
        </div>

        <div className="ng-label">
          <span className="ng-label-text">{label}</span>
        </div>
      </div>

      <div className="ng-vignette" aria-hidden />
    </div>
  );
}
