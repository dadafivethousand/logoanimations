// Robotics.js — the mark milled out of brushed aluminium and anodized, sitting
// on a live PCB with a HUD wrapped around it.
//
// The metal is real anisotropic brushing (fine directional grain + a conic
// specular that sweeps around the surface), not a grey gradient. The chamfer
// comes from a drop-shadow chain that reads the mark's alpha, so it follows the
// letterforms. Traces and hex mesh are CSS gradients; the HUD is SVG.
import React from "react";
import "../Stylesheets/Robotics.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 grid boot · p2 traces energize · p3 mark mills in · p4 anodize + readout
const CUES = [150, 650, 1250, 2100];

// Trace runs, in stage coordinates (1080×1920). The mounting plate occupies
// roughly x 140–940, y 685–1120, so the four side runs terminate on its edges
// and the two long runs stay clear of the type block below it.
const TRACES = {
  l1: "M70 520 L70 900 L140 900",
  l2: "M70 1400 L70 1060 L140 1060",
  r1: "M1010 560 L1010 840 L940 840",
  r2: "M1010 1440 L1010 1100 L940 1100",
  t1: "M460 360 L460 470 L680 470 L680 360 L880 360",
  b1: "M720 1660 L720 1560 L300 1560 L300 1720",
};

export default function Robotics({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = 7500,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="rb rb-p0" aria-hidden />;

  return (
    <div
      className={`rb rb-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      {/* ---- ground ---- */}
      <div className="rb-bg" aria-hidden />
      <div className="rb-grid" aria-hidden />
      <div className="rb-hex" aria-hidden />

      {/* ---- PCB: right-angle trace runs that feed INTO the mounting plate,
             so the board is wired to the mark rather than decorating around
             it. Dim copper underneath, a travelling pulse on top. ---- */}
      <svg className="rb-pcb" viewBox="0 0 1080 1920" preserveAspectRatio="none" aria-hidden>
        <g className="rb-copper" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d={TRACES.l1} />
          <path d={TRACES.l2} />
          <path d={TRACES.r1} />
          <path d={TRACES.r2} />
          <path d={TRACES.t1} />
          <path d={TRACES.b1} />
        </g>
        <g className="rb-current" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path className="rb-pulse" d={TRACES.l1} />
          <path className="rb-pulse rb-pulse-2" d={TRACES.l2} />
          <path className="rb-pulse rb-pulse-3" d={TRACES.r1} />
          <path className="rb-pulse rb-pulse-4" d={TRACES.r2} />
          <path className="rb-pulse rb-pulse-5" d={TRACES.t1} />
          <path className="rb-pulse rb-pulse-6" d={TRACES.b1} />
        </g>
        <g className="rb-pads">
          <circle cx="70" cy="520" r="13" />
          <circle cx="70" cy="1400" r="13" />
          <circle cx="1010" cy="560" r="13" />
          <circle cx="1010" cy="1440" r="13" />
          <circle cx="460" cy="360" r="13" />
          <circle cx="720" cy="1660" r="13" />
        </g>
      </svg>

      {/* ---- HUD frame ---- */}
      <svg className="rb-hud" viewBox="0 0 1080 1920" preserveAspectRatio="none" aria-hidden>
        <g className="rb-hud-g" fill="none" stroke="currentColor">
          {/* corner brackets */}
          <path d="M124 300 L124 232 L232 232" strokeWidth="4" />
          <path d="M956 300 L956 232 L848 232" strokeWidth="4" />
          <path d="M124 1620 L124 1688 L232 1688" strokeWidth="4" />
          <path d="M956 1620 L956 1688 L848 1688" strokeWidth="4" />
          {/* tick ruler down the left edge */}
          <g strokeWidth="3" opacity="0.55">
            <path d="M124 420 L164 420" />
            <path d="M124 470 L148 470" />
            <path d="M124 520 L148 520" />
            <path d="M124 570 L164 570" />
            <path d="M124 620 L148 620" />
            <path d="M124 670 L148 670" />
            <path d="M124 720 L164 720" />
          </g>
        </g>
      </svg>

      {/* ---- the mark, bolted to an anodized mounting plate ---- */}
      <div className="rb-markwrap">
        <div className="rb-panel" aria-hidden>
          <span className="rb-panel-face" />
          <span className="rb-panel-edge" />
        </div>

        <div className="rb-mark">
          {/* drop shadow onto the board */}
          <div className="rb-layer rb-cast" aria-hidden />

          {/* anodized red edge — the mark offset behind itself, so it must be
              painted before the plate rather than pushed back with z-index */}
          <div className="rb-layer rb-anodize" aria-hidden />

          {/* chamfer wrapper — shadows read the alpha of the metal inside */}
          <div className="rb-plate" aria-hidden>
            <div className="rb-layer rb-alu" />
            <div className="rb-layer rb-brush" />
            <div className="rb-layer rb-aniso" />
          </div>

          {/* milling pass: a bright line that travels down as the mark appears */}
          <div className="rb-layer rb-mill" aria-hidden />

          {/* HUD scan across the metal */}
          <div className="rb-layer rb-scan" aria-hidden />
        </div>

        {/* hardware: hex bolts at the plate corners */}
        <span className="rb-bolt rb-bolt-tl" aria-hidden />
        <span className="rb-bolt rb-bolt-tr" aria-hidden />
        <span className="rb-bolt rb-bolt-bl" aria-hidden />
        <span className="rb-bolt rb-bolt-br" aria-hidden />
      </div>

      {/* ---- type: the logo already says CODE NINJAS, so the only word here
             is the location ---- */}
      <div className="rb-type">
        <div className="rb-caption">{caption}</div>
        <div className="rb-bar" aria-hidden>
          <span className="rb-bar-fill" />
        </div>
      </div>

      <div className="rb-scanlines" aria-hidden />
      <div className="rb-vignette" aria-hidden />
    </div>
  );
}
