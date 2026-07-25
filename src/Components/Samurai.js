// Samurai.js — the mark forged in polished steel and cut apart by three katana
// slashes. The pieces slide along their cut lines, the cut faces glow hot, then
// cool.
//
// How the cuts work: the mark is rendered four times, each copy clipped to the
// band between two cut lines, then translated ALONG its cut. Because every copy
// carries the same masked material stack, the pieces stay in register and the
// gaps read as one continuous object that has been sliced — not four shapes
// arranged to look like one.
import React from "react";
import "../Stylesheets/Samurai.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 stage + whole mark · p2 slashes land, pieces part · p3 sparks, peak heat
// · p4 steel cools, type
const CUES = [200, 900, 1500, 2300];

/* Three parallel cuts running up to the right at ~24°, in the mark box's
   percentage space. Points are deliberately pushed outside 0–100 so each band's
   polygon closes well beyond the element and the element bounds do the final
   clipping — that avoids solving the corner cases where a cut exits through the
   top edge instead of the side. */
const BANDS = [
  "polygon(-20% -120%, 120% -120%, 120% -55.9%, -20% 79.3%)",
  "polygon(-20% 79.3%, 120% -55.9%, 120% -5.9%, -20% 129.3%)",
  "polygon(-20% 129.3%, 120% -5.9%, 120% 44.1%, -20% 179.3%)",
  "polygon(-20% 179.3%, 120% 44.1%, 120% 220%, -20% 220%)",
];

// Slide distance along the cut direction (0.91, -0.41), plus a little
// perpendicular separation so each kerf actually opens.
const SHIFTS = [
  { dx: "-2.0vw", dy: "0.5vw" },
  { dx: "1.5vw", dy: "-0.2vw" },
  { dx: "-1.7vw", dy: "0.35vw" },
  { dx: "2.3vw", dy: "-0.6vw" },
];

/* Hand-placed on the cut lines. No Math.random — every render must compose
   identically or two takes of the same ad won't match. */
const SPARKS = [
  { l: "22%", t: "38%", x: "-3.2vw", y: "-2.4vw", d: "0ms" },
  { l: "30%", t: "33%", x: "2.6vw", y: "-3.1vw", d: "40ms" },
  { l: "38%", t: "47%", x: "3.4vw", y: "-1.6vw", d: "110ms" },
  { l: "47%", t: "55%", x: "-2.8vw", y: "-3.4vw", d: "70ms" },
  { l: "55%", t: "50%", x: "3.9vw", y: "-2.2vw", d: "150ms" },
  { l: "63%", t: "62%", x: "-3.6vw", y: "-2.8vw", d: "20ms" },
  { l: "71%", t: "58%", x: "2.2vw", y: "-3.8vw", d: "190ms" },
  { l: "78%", t: "70%", x: "3.1vw", y: "-1.9vw", d: "95ms" },
  { l: "44%", t: "40%", x: "-4.1vw", y: "-1.4vw", d: "130ms" },
  { l: "60%", t: "44%", x: "1.8vw", y: "-4.2vw", d: "165ms" },
];

export default function Samurai({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = 7500,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="sw sw-p0" aria-hidden />;

  return (
    <div
      className={`sw sw-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      <SamuraiDefs />

      {/* ---- stage ---- */}
      <div className="sw-bg" aria-hidden />
      <div className="sw-moon" aria-hidden />
      <div className="sw-mist" aria-hidden />
      <div className="sw-floor" aria-hidden />

      {/* ---- the mark ---- */}
      <div className="sw-markwrap">
        <div className="sw-cast" aria-hidden />

        <div className="sw-mark">
          {BANDS.map((clip, i) => (
            <div
              className="sw-piece"
              key={i}
              style={{
                clipPath: clip,
                WebkitClipPath: clip,
                "--dx": SHIFTS[i].dx,
                "--dy": SHIFTS[i].dy,
              }}
              aria-hidden
            >
              {/* the chamfer chain wraps the painted layers, so its rims follow
                  the letterforms rather than the piece's bounding box */}
              <div className="sw-plate">
                <div className="sw-layer sw-steel" />
                <div className="sw-layer sw-hamon">
                  <svg viewBox="0 0 1000 460" preserveAspectRatio="none">
                    <path
                      d="M-20 330 C 120 268, 200 372, 330 306 S 560 250, 690 320 S 900 366, 1020 292"
                      filter="url(#sw-temper)"
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="54"
                      fill="none"
                    />
                  </svg>
                </div>
                <div className="sw-layer sw-grain" />
                <div className="sw-layer sw-aniso" />
              </div>
            </div>
          ))}

          {/* hot cut faces: thin lines parallel to the cuts, masked to the mark
              so heat only ever exists on metal */}
          <div className="sw-heat" aria-hidden />
          <div className="sw-heat sw-heat-bloom" aria-hidden />
        </div>

        {/* floor reflection — nested masks: fade on the outside, mark inside */}
        <div className="sw-reflect" aria-hidden>
          <div className="sw-reflect-in" />
        </div>
      </div>

      {/* ---- blade arcs + sparks (animated only) ---- */}
      <div className="sw-arcs" aria-hidden>
        <span className="sw-arc sw-arc-1" />
        <span className="sw-arc sw-arc-2" />
        <span className="sw-arc sw-arc-3" />
      </div>
      <div className="sw-sparks" aria-hidden>
        {SPARKS.map((s, i) => (
          <span
            className="sw-spark"
            key={i}
            style={{ left: s.l, top: s.t, "--sx": s.x, "--sy": s.y, "--sd": s.d }}
          />
        ))}
      </div>

      {/* ---- type: the logo already says CODE NINJAS, so the only word here
             is the location ---- */}
      <div className="sw-type">
        <div className="sw-caption">{caption}</div>
        <div className="sw-rule" aria-hidden />
      </div>

      <div className="sw-film" aria-hidden />
      <div className="sw-vignette" aria-hidden />
    </div>
  );
}

function SamuraiDefs() {
  return (
    <svg className="sw-defs" aria-hidden focusable="false">
      <defs>
        {/* hamon: the temper line. Displace a fat soft stroke into clouds, then
            blur, so it reads as crystalline structure in the steel rather than
            a painted squiggle. */}
        <filter id="sw-temper" x="-20%" y="-60%" width="140%" height="220%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.021 0.05"
            numOctaves="4"
            seed="13"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="46"
            xChannelSelector="R"
            yChannelSelector="G"
            result="d"
          />
          <feGaussianBlur in="d" stdDeviation="5" />
        </filter>
      </defs>
    </svg>
  );
}
