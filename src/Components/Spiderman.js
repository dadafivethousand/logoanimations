// Spiderman.js — the mark strung up in a fresh web on a night wall, wearing
// the suit: red webbing over the hood and "NINJAS", suit blue on "CODE", and
// two white lenses landing on the artwork's own eye band.
//
// Genre, not franchise. No studio mark, no character likeness, no film
// logotype, and deliberately no spider emblem — the recognisable ones are
// registered chest devices and a wall-crawler idiom does not need one. What
// carries the theme is the vocabulary anybody reads instantly: red-and-blue
// webbed suit, big white lenses, an orb web spun across the frame, and a
// single strand taking the weight. Same rule Pirates and Samurai follow.
//
// THE SUIT IS PAINTED THROUGH THE REGION MASKS, not laid over the logo.
// useLogo segments the artwork into --logo-dark (hood + "NINJAS"),
// --logo-light (the skin band across the eyes) and --logo-accent ("CODE").
// A mask covers the FACE, so dark and light BOTH take the red webbed
// material and "CODE" takes suit blue — which lands the suit's own
// red-torso / blue-limbs split straight onto the lockup's structure instead
// of fighting it.
//
// THE LENSES ARE MEASURED, NOT EYEBALLED, off the same artwork bounds
// Pirates recorded:
//
//     head      left 32.7%  top 0%     w 29.3%  h 46.3%
//     eye band  left 39.5%  top 22.1%  w 21.1%  h 10.7%
//
// LENS below is that band opened out a little, because spider lenses overhang
// the eyes they cover. If the logo file is ever replaced, re-measure both.
//
// THE WEB IS BUILT, NOT DRAWN BY HAND. An orb web is a regular structure with
// one interesting parameter — how far each thread SAGS between two spokes —
// so eighteen hand-authored path strings would be less readable than the
// twenty lines that generate them, and would make the sag untunable.
//
// WOODBRIDGE sits in flow under the mark and inside the swaying wrapper —
// never positioned independently, or it detaches from the lockup the moment
// the strand moves.
import React from "react";
import "../Stylesheets/Spiderman.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 the wall and the city behind it · p2 the web spins, spokes then spiral ·
// p3 the mark drops on a strand and settles · p4 the suit fills and the
// lenses snap on · p5 WOODBRIDGE
//
// Plays ONCE and holds — loopAt is null. The strand keeps swaying on the held
// frame; that is ambient, not a restart.
const CUES = [180, 640, 1750, 2620, 3400];

// The measured eye band, opened out — see the note at the top. Centred on the
// band (x 50.05%, y 27.45% of the mark) but much taller than it, because mask
// lenses overhang the eyes by a long way; a box the height of the band alone
// gives you swim goggles.
//
// The box is sized so it is EXACTLY 2:1 once the mark's own aspect is applied
// (27% of the width against 29.3% of the height, at aspect 2.173), which is
// what lets the lens artwork below use preserveAspectRatio="none" against a
// 200x100 viewBox without stretching.
const LENS = { left: "36.55%", top: "12.8%", width: "27%", height: "29.3%" };

// distant windows, out of focus. Fixed rather than random so every take of
// the recording is identical. [left%, top%, size in vw, opacity]
const CITY = [
  [8, 62, 1.5, 0.5],
  [17, 74, 1.1, 0.32],
  [26, 58, 1.9, 0.42],
  [38, 79, 1.2, 0.28],
  [61, 71, 1.7, 0.46],
  [72, 60, 1.3, 0.34],
  [84, 76, 2.1, 0.4],
  [92, 64, 1.2, 0.26],
  [49, 86, 1.6, 0.3],
];

const WEB = buildWeb({
  cx: 200,
  cy: 372,
  spokes: 14,
  rings: 6,
  r0: 44,
  rMax: 520,
  sag: 0.885,
});

export default function Spiderman({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = null,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  // hold the first frame until the mark is measured, or the suit paints at the
  // wrong aspect for a frame and the lenses land off the eyes
  if (!ready) return <div className="sp sp-p0" aria-hidden />;

  return (
    <div
      className={`sp sp-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      <SpidermanDefs />

      {/* ---- the wall, and the city a long way behind it ---- */}
      <div className="sp-wall" aria-hidden />
      <div className="sp-bricks" aria-hidden />
      <div className="sp-city" aria-hidden>
        {CITY.map(([x, y, s, o], i) => (
          <span
            key={i}
            className="sp-light"
            style={{ left: `${x}%`, top: `${y}%`, width: `${s}vw`, height: `${s}vw`, opacity: o }}
          />
        ))}
      </div>
      <div className="sp-glow" aria-hidden />

      {/* ---- the web: spokes first, then the spiral winding outward ---- */}
      <svg className="sp-web" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <g filter="url(#sp-thread)">
          {WEB.spokes.map((d, i) => (
            <path key={`s${i}`} className="sp-spoke" d={d} pathLength="1" style={{ "--i": i }} />
          ))}
          {WEB.rings.map((d, i) => (
            <path key={`r${i}`} className="sp-ring" d={d} pathLength="1" style={{ "--i": i }} />
          ))}
        </g>
      </svg>

      {/* ---- the mark, hanging ---- */}
      <div className="sp-markwrap">
        <div className="sp-hang">
          {/* the strand runs off the top of the frame and sways with the load,
              so it has to live inside the swaying wrapper, not beside it */}
          <div className="sp-strand" aria-hidden />

          <div className="sp-drop">
            <div className="sp-markbox">
              {/* the wall is dark and so is the hood — without this the mark
                  has no edge at all on the left side of the frame */}
              <div className="sp-halo" aria-hidden />

              <div className="sp-mark">
                <div className="sp-layer sp-cast" aria-hidden />

                {/* The mark lands at p3 as an unlit silhouette and the colour
                    floods in at p4. Without this the drop has nothing in it —
                    the suit layers are still transparent while it falls. */}
                <div className="sp-layer sp-silh" aria-hidden />

                {/* --- the suit, painted per region --- */}
                <div className="sp-suit sp-suit-red" aria-hidden />
                <div className="sp-suit sp-suit-face" aria-hidden />
                <div className="sp-suit sp-suit-blue" aria-hidden />

                {/* Suit webbing: concentric threads plus spokes radiating from
                    the head, masked by the whole mark and multiplied down into
                    it. Centred on the head, NOT on the box — a web centred on
                    the lockup would run its rings through "CODE" sideways. */}
                <div className="sp-layer sp-webbing" aria-hidden />

                {/* fixed specular — present in static mode too */}
                <div className="sp-layer sp-sheen" aria-hidden />

                {/* --- lenses, in eye-band-local coordinates --- */}
                <div className="sp-lens" style={LENS} aria-hidden>
                  <svg viewBox="0 0 200 100" preserveAspectRatio="none">
                    <g className="sp-lens-l">
                      <path className="sp-lens-body" d={LENS_D} />
                      <ellipse className="sp-lens-hi" cx="34" cy="30" rx="15" ry="10" />
                    </g>
                    {/* The right lens is the left one mirrored, so the pair can
                        never drift out of symmetry when the shape is tuned.

                        The mirror MUST sit on its own wrapper: a CSS transform
                        on an SVG element replaces the transform attribute
                        outright, so putting the snap-in scale on the same <g>
                        cancels the flip and draws both lenses in one eye. */}
                    <g transform="translate(200,0) scale(-1,1)">
                      <g className="sp-lens-r">
                        <path className="sp-lens-body" d={LENS_D} />
                        <ellipse className="sp-lens-hi" cx="34" cy="30" rx="15" ry="10" />
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            {/* directly under the mark, in flow */}
            <div className="sp-type">
              <div className="sp-caption">{caption}</div>
              <div className="sp-rule" aria-hidden />
            </div>
          </div>
        </div>
      </div>

      <div className="sp-grain" aria-hidden />
      <div className="sp-vignette" aria-hidden />
    </div>
  );
}

/* One lens, drawn once in the left half of the 200x100 box and mirrored for
   the other eye. A big round lobe outboard, tapering to a point that turns
   down and INBOARD toward the nose — a symmetrical almond reads as goggles
   rather than as a mask, and the direction of that taper is the whole tell. */
const LENS_D =
  "M10 34 C 12 14, 36 2, 60 10 C 84 18, 99 44, 97 68 C 96 76, 88 80, 80 74 C 56 60, 9 56, 10 34 Z";

/**
 * Orb web geometry. Returns spoke paths and ring paths for one viewBox.
 *
 * `sag` is the whole reason this is generated: each length of spiral is a
 * quadratic curve whose control point sits at the midpoint angle but pulled in
 * toward the hub, so the thread hangs between its two anchor spokes. At
 * sag = 1 the rings are perfect circles and the result reads as a wagon wheel.
 */
function buildWeb({ cx, cy, spokes, rings, r0, rMax, sag }) {
  // start just off vertical, and give each spoke a slightly different reach —
  // a perfectly regular web looks printed
  const a0 = -Math.PI / 2 + 0.11;
  const at = (i, r) => {
    const t = a0 + (i / spokes) * Math.PI * 2;
    const wobble = 1 + 0.055 * Math.sin(i * 2.7);
    return [cx + Math.cos(t) * r * wobble, cy + Math.sin(t) * r * wobble];
  };
  const fx = (n) => n.toFixed(1);

  const spokePaths = [];
  for (let i = 0; i < spokes; i += 1) {
    const [x, y] = at(i, rMax);
    spokePaths.push(`M${cx} ${cy} L${fx(x)} ${fx(y)}`);
  }

  const ringPaths = [];
  for (let k = 1; k <= rings; k += 1) {
    // rings crowd toward the hub, as they do in a real web
    const r = r0 + (rMax * 0.78 - r0) * Math.pow(k / rings, 1.6);
    let d = "";
    for (let i = 0; i <= spokes; i += 1) {
      const [x, y] = at(i % spokes, r);
      if (i === 0) {
        d = `M${fx(x)} ${fx(y)}`;
      } else {
        const tm = a0 + ((i - 0.5) / spokes) * Math.PI * 2;
        const mx = cx + Math.cos(tm) * r * sag;
        const my = cy + Math.sin(tm) * r * sag;
        d += ` Q${fx(mx)} ${fx(my)} ${fx(x)} ${fx(y)}`;
      }
    }
    ringPaths.push(d);
  }

  return { spokes: spokePaths, rings: ringPaths };
}

/* Filter/gradient defs. Kept in one zero-size <svg> so the theme stays a
   single self-contained component. */
function SpidermanDefs() {
  return (
    <svg className="sp-defs" aria-hidden focusable="false">
      <defs>
        {/* silk is never dead straight — a hair of displacement is the whole
            difference between spun thread and vector line art */}
        <filter id="sp-thread" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="5" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="7"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* lens glass: bright at the outer top, cooling into the taper */}
        <linearGradient id="sp-lensfill" x1="0.15" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="46%" stopColor="#e8eef8" />
          <stop offset="100%" stopColor="#9fb0c8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
