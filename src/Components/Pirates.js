// Pirates.js — the mark as sunken treasure: tarnished gold resting on the
// seabed, lit by a shaft of light from the surface, crossed by caustics.
//
// Deliberately the *genre* rather than any film — no studio marks, no character
// likenesses, no film typeface.
//
// One space, not a diorama. An earlier pass stacked sky / sea / deck as three
// bands and every seam read as a hard edge through the composition; a single
// volume of water with light falling through it has depth for free.
//
// What sells the metal: gold only reads as gold when there's dirt in it, so the
// stack is bright bullion, then verdigris pools, then corrosion pitting, then a
// moving specular.
import React from "react";
import "../Stylesheets/Pirates.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 water + surface · p2 the gold surfaces · p3 shafts, caustics, motes
// · p4 WOODBRIDGE
const CUES = [200, 800, 1500, 2300];

/* Hand-placed — no Math.random, or two takes of the same ad won't match. */
const MOTES = [
  { l: "14%", t: "62%", x: "2.2vw", d: "0ms", s: "0.55vw" },
  { l: "27%", t: "72%", x: "-1.6vw", d: "1400ms", s: "0.34vw" },
  { l: "38%", t: "58%", x: "1.1vw", d: "600ms", s: "0.42vw" },
  { l: "49%", t: "78%", x: "-2.4vw", d: "2100ms", s: "0.6vw" },
  { l: "58%", t: "64%", x: "1.8vw", d: "900ms", s: "0.3vw" },
  { l: "68%", t: "74%", x: "-1.2vw", d: "2600ms", s: "0.48vw" },
  { l: "79%", t: "60%", x: "2.6vw", d: "300ms", s: "0.36vw" },
  { l: "88%", t: "70%", x: "-2vw", d: "1800ms", s: "0.52vw" },
  { l: "21%", t: "34%", x: "1.4vw", d: "1100ms", s: "0.3vw" },
  { l: "72%", t: "30%", x: "-1.8vw", d: "2400ms", s: "0.4vw" },
];

export default function Pirates({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = 8000,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="pc pc-p0" aria-hidden />;

  return (
    <div
      className={`pc pc-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      <PiratesDefs />

      {/* ---- the water ---- */}
      <div className="pc-water" aria-hidden />
      <div className="pc-surface" aria-hidden />

      {/* light falling from the surface */}
      <div className="pc-shafts" aria-hidden>
        <span className="pc-shaft pc-shaft-1" />
        <span className="pc-shaft pc-shaft-2" />
        <span className="pc-shaft pc-shaft-3" />
      </div>

      {/* seabed: a soft mound, no horizon line to give away the edge */}
      <div className="pc-silt" aria-hidden />

      {/* ---- the mark ---- */}
      <div className="pc-markwrap">
        <div className="pc-cast" aria-hidden />
        <div className="pc-bloom" aria-hidden />

        <div className="pc-mark">
          {/* the chamfer chain wraps the painted layers so its rims follow the
              letterforms, not the bounding box */}
          <div className="pc-plate" aria-hidden>
            <div className="pc-layer pc-gold" />

            {/* verdigris: double-masked — logo on the outside, turbulence
                blotches on the inside, so patina pools instead of washing */}
            <div className="pc-layer pc-patina">
              <span className="pc-patina-in" />
            </div>

            {/* corrosion pitting, multiplied into the gold */}
            <div className="pc-layer pc-pit" />
          </div>

          {/* light ripples off the surface, crossing the metal */}
          <div className="pc-layer pc-caustic" aria-hidden />

          {/* gold's specular is tight, warm, and moves */}
          <div className="pc-layer pc-sheen" aria-hidden />
        </div>
      </div>

      {/* ---- type: the logo already says CODE NINJAS ---- */}
      <div className="pc-type">
        <div className="pc-caption">{caption}</div>
        <div className="pc-rule" aria-hidden />
      </div>

      {/* silt and plankton drifting through the light */}
      <div className="pc-motes" aria-hidden>
        {MOTES.map((m, i) => (
          <span
            className="pc-mote"
            key={i}
            style={{
              left: m.l,
              top: m.t,
              width: m.s,
              height: m.s,
              "--mx": m.x,
              "--md": m.d,
            }}
          />
        ))}
      </div>

      <div className="pc-film" aria-hidden />
      <div className="pc-vignette" aria-hidden />
    </div>
  );
}

function PiratesDefs() {
  return (
    <svg className="pc-defs" aria-hidden focusable="false">
      <defs>
        {/* the underside of the surface: a band of light chewed into ripples */}
        <filter id="pc-ripple" x="-20%" y="-60%" width="140%" height="220%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014 0.06"
            numOctaves="4"
            seed="5"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="28"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
