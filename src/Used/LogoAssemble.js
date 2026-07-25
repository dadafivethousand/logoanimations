// LogoAssemble.js — shards fly in, lock into the mark, shine sweep, tagline.
// Palette: cold graphite + brand red. Cinematic "product drop" stage.
import React from "react";
import "./LogoAssemble.css";
import usePhases from "../Utils/usePhases";
import logo from "../Images/cn-woodbridge-logo.png";

// p1 shards converge · p2 lock + shine · p3 tagline
const CUES = [250, 1250, 1850];
const SHARDS = 8;

export default function LogoAssemble({
  wordmark = "WOODBRIDGE",
  tagline = "CODE. BUILD. PLAY.",
  loopAt = 6000,
}) {
  const { phase, run } = usePhases(CUES, loopAt);

  return (
    <div className={`la-stage la-p${phase}`} key={run}>
      <div className="la-grid" aria-hidden />
      <div className="la-glow" aria-hidden />

      <div className="la-center">
        <div className="la-mark">
          {Array.from({ length: SHARDS }, (_, i) => (
            <span
              className="la-shard"
              key={i}
              style={{ "--i": i, "--n": SHARDS }}
              aria-hidden
            />
          ))}

          <img className="la-logo" src={logo} alt="Code Ninjas" />
          <span className="la-shine" aria-hidden />
        </div>

        <div className="la-word">{wordmark}</div>
        <div className="la-rule" aria-hidden />
        <div className="la-tag">{tagline}</div>
      </div>

      <div className="la-grain" aria-hidden />
      <div className="la-vignette" aria-hidden />
    </div>
  );
}
