// Spiderman.js — a web already hangs in the frame, and the mark is lowered
// into it on a single thread, wearing the suit.
//
// Genre, not franchise. No studio mark, no likeness, no film logotype, and
// deliberately no spider emblem — the recognisable ones are registered chest
// devices. What carries the theme is the vocabulary anybody reads instantly:
// a masked head with big white lenses, red-and-blue suit, webbing, and a
// thread taking the weight. Same rule Pirates and Samurai follow.
//
// THE HEAD IS DRAWN, NOT MASKED. Earlier passes painted the suit through the
// logo's own hood, which is a circle, so the result read as a red billiard
// ball with eyes on it. A masked head is not round: it is a broad cranium
// that narrows through the cheeks to a rounded chin, and that silhouette is
// most of what makes the character legible at thumbnail size. So the head is
// its own SVG — shape, webbing and lenses in one coordinate system — sitting
// over the artwork's hood and covering it completely.
//
// MEASURED OFF THE ARTWORK'S OWN PIXELS, scanned row by row on the trimmed
// mark (1916x882, aspect 2.1723):
//
//     head      rows   0-54%   columns 32.7-62.0%
//     (empty)   rows  55-61%
//     wordmark  rows  62-89%   columns 0-100%
//     "J" tail  rows  90-100%  columns 72.3-78.3%
//
// Note the head height: Pirates records it as 46.3% and that is WRONG — the
// left and width agree exactly, but the head runs to 54%, and trusting 46.3%
// is what left the jaw's curve showing under the drawn chin as a red crescent
// that read as a smile. Pirates places its eyepatch off the same bad figure,
// so re-measure before reusing it there.
//
// The drawn head's chin sits at 54% so the lockup keeps its original spacing,
// and its height comes from `aspect-ratio` on its own box rather than from a
// percentage of the mark. That last part matters: the head then cannot
// distort if the logo file is replaced with one of a different aspect.
//
// THE WORDMARK STILL USES THE REGION MASKS. useLogo segments the artwork into
// --logo-dark (hood + "NINJAS"), --logo-light (the skin band) and
// --logo-accent ("CODE"), so "NINJAS" takes the suit red and "CODE" keeps the
// brand blue — the suit's own red/blue split, landed on the lockup's
// structure. Webbing stays on the head, where a suit actually has it; running
// it through the letters as well read as wrapping paper.
//
// WOODBRIDGE sits in flow under the mark and inside the swaying wrapper —
// never positioned independently, or it detaches from the lockup the moment
// the thread moves.
import React from "react";
import "../Stylesheets/Spiderman.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 a dot lights at the hub and the web expands out of it, the wall coming
// up with it · p2 the descent starts · p3 it has come to rest · p4 WOODBRIDGE
//
// Frame zero is blank: no web, no wall texture, no city, no mark. Everything
// arrives on a cue.
//
// p2 is set after the spread finishes rather than on top of it — the mark
// coming down while the web is still growing made two events compete, and
// neither read.
//
// Plays ONCE and holds — loopAt is null. The thread keeps swaying on the held
// frame; that is ambient, not a restart.
const CUES = [140, 1650, 4150, 4750];

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

// The web in the frame and the webbing on the mask are the same geometry at
// two scales and two tensions — the big one sags, the one stretched over a
// head is nearly taut.
const WEB = buildWeb({ cx: 200, cy: 372, spokes: 16, rings: 8, r0: 44, rMax: 520, sag: 0.885 });
const HEAD_WEB = buildWeb({ cx: 100, cy: 104, spokes: 18, rings: 8, r0: 12, rMax: 200, sag: 0.955 });

export default function Spiderman({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = null,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  // hold the first frame until the mark is measured, or the wordmark paints at
  // the wrong aspect for a frame and the head lands off the hood
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

      {/* the hub lights first — one hit, before the first thread is out */}
      <div className="sp-burst" aria-hidden />

      {/* ---- the web, expanding evenly out of a dot ----

           Two identical copies of the same web, revealed by the same growing
           circle at two different radii: `base` is the settled silk, filled
           in behind the front, and `hot` is a bright heavy copy showing only
           through a thin annulus at the front itself. The result is one
           circular wavefront moving outward at the same speed in every
           direction, lighting each thread as it passes and leaving it.

           This replaced a per-thread draw — spokes striking out, then rings
           winding on in radius order. That version was legible but it was not
           EVEN: a ring winds around, so the web arrived in a rotational
           sweep, and the corners of the frame filled long after the sides.

           Both copies carry the same displacement filter and the same seed,
           and CSS gives them the same transform, so the hot copy sits exactly
           on the base one. Any difference there shows as a doubled thread. */}
      <WebLayer variant="base" />
      <WebLayer variant="hot" />

      {/* ---- the mark, lowered in on a thread ---- */}
      <div className="sp-markwrap">
        <div className="sp-hang">
          <div className="sp-drop">
            {/* The thread is a child of the descending wrapper, not a sibling,
                so it pays out as the mark goes down instead of having to be
                animated in step with it. It runs far off the top of the frame
                and the head paints over its lower end, which is what makes it
                read as tied to the crown. */}
            <div className="sp-strand" aria-hidden />

            <div className="sp-markbox">
              {/* the wall is near-black and so is the web behind the lockup;
                  this is the only thing giving the mark an edge on its dark
                  side */}
              <div className="sp-halo" aria-hidden />

              <div className="sp-mark">
                {/* The artwork's head is CLIPPED away, not masked away. Every
                    layer here paints the whole mark box and sp-word shows only
                    the band below it, so the drawn head is all you ever see of
                    a head. The mask-composite knockout this replaced worked,
                    but it left a hairline of the suit gradient down both edges
                    of the mark box — faint from each layer, visible once they
                    stacked. A clip has no edge case. */}
                <div className="sp-word">
                  <div className="sp-wordbox">
                    <div className="sp-layer sp-cast" aria-hidden />

                    {/* --- the wordmark, painted per region --- */}
                    <div className="sp-suit sp-suit-red" aria-hidden />
                    <div className="sp-suit sp-suit-face" aria-hidden />
                    <div className="sp-suit sp-suit-blue" aria-hidden />
                    <div className="sp-layer sp-sheen" aria-hidden />
                  </div>
                </div>

                <Head />
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

/**
 * One copy of the web. Rendered twice — `base` is the settled silk and `hot`
 * is a bright heavy copy that only shows through the annulus at the expanding
 * front. Same paths, same filter, same seed, so the two register exactly.
 */
function WebLayer({ variant }) {
  return (
    <svg
      className={`sp-web sp-web-${variant}`}
      viewBox="0 0 400 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <g filter="url(#sp-thread)">
        {WEB.spokes.map((d, i) => (
          <path key={`s${i}`} className="sp-spoke" d={d} />
        ))}
        {WEB.rings.map(({ d }, i) => (
          <path key={`r${i}`} className="sp-ring" d={d} />
        ))}
      </g>
    </svg>
  );
}

/**
 * The masked head. One 200x210 coordinate system carries the silhouette, the
 * webbing and both lenses, so nothing here can drift out of register with
 * anything else — which is the failure mode of placing lenses in one box and
 * webbing in another.
 */
function Head() {
  return (
    <div className="sp-head" aria-hidden>
      <svg viewBox="0 0 200 210">
        <defs>
          {/* the webbing is clipped to the silhouette, so threads run right to
              the edge of the jaw and stop there, as they do on cloth */}
          <clipPath id="sp-headclip">
            <path d={HEAD_D} />
          </clipPath>
        </defs>

        <path className="sp-head-shape" d={HEAD_D} />

        <g clipPath="url(#sp-headclip)">
          <g className="sp-head-web">
            {HEAD_WEB.spokes.map((d, i) => (
              <path key={`hs${i}`} d={d} />
            ))}
            {HEAD_WEB.rings.map(({ d }, i) => (
              <path key={`hr${i}`} d={d} />
            ))}
          </g>
          {/* form: the jaw and the right cheek fall away from the key light */}
          <path className="sp-head-shade" d={HEAD_D} />
        </g>

        {/* the silhouette's own edge, drawn last so the webbing cannot break it */}
        <path className="sp-head-edge" d={HEAD_D} />

        <g className="sp-lens-l">
          <path className="sp-lens-body" d={LENS_D} />
          <ellipse className="sp-lens-hi" cx="45" cy="70" rx="14" ry="9" />
          <ellipse className="sp-lens-glint" cx="45" cy="70" rx="14" ry="9" />
        </g>
        {/* The right lens is the left one mirrored, so the pair can never drift
            out of symmetry when the shape is tuned.

            The mirror MUST sit on its own wrapper: a CSS transform on an SVG
            element replaces the transform attribute outright, so putting any
            animated transform on this same <g> would cancel the flip and draw
            both lenses in one eye. */}
        <g transform="translate(200,0) scale(-1,1)">
          <g className="sp-lens-r">
            <path className="sp-lens-body" d={LENS_D} />
            <ellipse className="sp-lens-hi" cx="45" cy="70" rx="14" ry="9" />
            <ellipse className="sp-lens-glint" cx="45" cy="70" rx="14" ry="9" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* The mask silhouette: a broad cranium, cheeks drawing in, and a rounded chin.
   Widest at about a third of the way down — put the widest point at the
   middle and it reads as an egg. */
const HEAD_D =
  "M100 5 C 150 5, 188 42, 191 88 C 193 122, 176 156, 150 180 C 134 195, 117 203, 100 203 C 83 203, 66 195, 50 180 C 24 156, 7 122, 9 88 C 12 42, 50 5, 100 5 Z";

/* One lens, drawn in the left half of the head box and mirrored for the other
   eye. A big round lobe outboard, tapering to a point that turns down and
   INBOARD toward the nose — a symmetrical almond reads as goggles rather than
   as a mask, and the direction of that taper is the whole tell. */
const LENS_D =
  "M24 74 C 26 57, 45 47, 67 54 C 87 61, 99 79, 97 99 C 96 111, 87 117, 77 113 C 55 104, 22 92, 24 74 Z";

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
    // t: this ring's radius as a fraction of the spokes' reach, which is when
    // the outward wavefront gets here
    ringPaths.push({ d, t: Number((r / rMax).toFixed(4)) });
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

        {/* the mask's own material: keyed from the upper left, and never run
            down to black at the edge or the head loses its silhouette against
            the wall */}
        <radialGradient id="sp-headfill" cx="36%" cy="24%" r="82%">
          <stop offset="0%" stopColor="#f64a54" />
          <stop offset="42%" stopColor="#d8232f" />
          <stop offset="100%" stopColor="#8f1119" />
        </radialGradient>

        {/* lens glass: bright at the outer top, cooling into the taper */}
        <linearGradient id="sp-lensfill" x1="0.15" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="46%" stopColor="#e8eef8" />
          <stop offset="100%" stopColor="#9fb0c8" />
        </linearGradient>

        {/* form shading, laid over the webbing so the jaw turns away */}
        <radialGradient id="sp-headshade" cx="34%" cy="22%" r="86%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="58%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#3a0308" stopOpacity="0.55" />
        </radialGradient>
      </defs>
    </svg>
  );
}
