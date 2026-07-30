// Hologram.js — the mark as a volumetric light projection: a beam throws it up
// out of an emitter, it builds from a scan line, resolves into cyan glass and
// then sits there breathing with interference and chromatic fringing.
//
// Deliberately NOT Robotics. That theme is a solid milled object on a board —
// graphite, steel, anodized green. This one is not an object at all: it is
// light, so it is translucent, it glows from inside, its edges split into red
// and cyan, and horizontal interference rolls through it. Midnight indigo and
// electric cyan, with brand red doing real work as the chromatic fringe.
//
// The mark is never tinted as one shape: the hood and "NINJAS" take deep lit
// indigo, the eye band takes the brightest cyan (his eyes are the light source)
// and "CODE" keeps the brand's blue, pushed bright. Masking by --logo alone
// would collapse his face into his hood.
import React from "react";
import "../Stylesheets/Hologram.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 emitter fires · p2 scan builds the mark · p3 signal locks · p4 caption
const CUES = [150, 700, 1500, 2300];

// Motes drifting up the beam.
// [left %, size vw, delay s, duration s, drift vh, seat vh]
// `seat` is where the mote parks in static mode — without it they all freeze
// at their start position and the poster frame gets a row of dots.
const MOTES = [
  [18, 0.5, 0.0, 7.5, 34, 21],
  [31, 0.35, 1.9, 9.0, 28, 6],
  [44, 0.6, 3.4, 6.8, 38, 30],
  [57, 0.4, 0.9, 8.4, 30, 13],
  [69, 0.55, 4.6, 7.2, 36, 25],
  [82, 0.35, 2.6, 9.6, 26, 9],
  [26, 0.45, 5.5, 8.0, 32, 34],
  [74, 0.5, 6.3, 7.8, 30, 17],
];

export default function Hologram({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = 7500,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="hg hg-p0" aria-hidden />;

  return (
    <div
      className={`hg hg-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      {/* ---- the room: one dark volume, no stacked bands ---- */}
      <div className="hg-bg" aria-hidden />
      <div className="hg-floor" aria-hidden />

      {/* ---- the projection beam, widening upward out of the emitter ---- */}
      <div className="hg-beam" aria-hidden />
      <div className="hg-motes" aria-hidden>
        {MOTES.map(([x, s, d, dur, rise, seat], i) => (
          <span
            key={i}
            style={{
              left: `${x}%`,
              width: `${s}vw`,
              height: `${s}vw`,
              animationDelay: `${d}s`,
              animationDuration: `${dur}s`,
              "--rise": `${-rise}vh`,
              "--seat": `${-seat}vh`,
            }}
          />
        ))}
      </div>
      <div className="hg-emitter" aria-hidden>
        <span className="hg-emitter-core" />
        <span className="hg-emitter-ring" />
      </div>

      {/* ---- the lockup ---- */}
      <div className="hg-markwrap">
        <div className="hg-markbox">
          {/* alignment ring — graphic only, no readouts */}
          <svg className="hg-ring" viewBox="0 0 200 200" aria-hidden>
            <circle className="hg-ring-dash" cx="100" cy="100" r="92" />
            <circle className="hg-ring-thin" cx="100" cy="100" r="83" />
            <g className="hg-ring-ticks">
              <path d="M100 4 L100 16" />
              <path d="M196 100 L184 100" />
              <path d="M100 196 L100 184" />
              <path d="M4 100 L16 100" />
            </g>
          </svg>

          <div className="hg-bloom" aria-hidden />

          {/* the mark builds bottom-up behind a clip; the material layers
              inside keep their own logo masks, unaffected by the clip */}
          <div className="hg-mark">
            {/* chromatic split — the same mark offset either side, screened.
                Offsetting the whole masked copy is the point here; a highlight
                would have to move by background-position instead. */}
            <div className="hg-layer hg-fringe hg-fr-red" aria-hidden />
            <div className="hg-layer hg-fringe hg-fr-cyan" aria-hidden />

            {/* glow chain reads the alpha of the layers inside, so the bloom
                traces the letterforms instead of boxing them */}
            <div className="hg-proj">
              <div className="hg-layer hg-body" />
              <div className="hg-region hg-hood" />
              <div className="hg-region hg-face" />
              <div className="hg-region hg-code" />
              <div className="hg-layer hg-lines" aria-hidden />
              <div className="hg-layer hg-spec" aria-hidden />
            </div>
          </div>

          {/* the scan line that builds it, then keeps passing slowly */}
          <span className="hg-scanbar" aria-hidden />
        </div>

        {/* WOODBRIDGE rides in flow under the mark — never positioned on its
            own, or it drifts the moment anything else moves */}
        <div className="hg-type">
          <div className="hg-caption">{caption}</div>
          <div className="hg-rule" aria-hidden>
            <span />
          </div>
        </div>
      </div>

      <div className="hg-scanlines" aria-hidden />
      <div className="hg-roll" aria-hidden />
      <div className="hg-vignette" aria-hidden />
    </div>
  );
}
