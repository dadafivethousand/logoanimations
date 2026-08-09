// Newspaper.js — the old newsreel gag: a front page comes spinning out of the
// dark, straight at the camera, and stops flat so you can read it. EXTRA!
// EXTRA! across the top, and the mark set as the page's halftone photo.
//
// Genre, not a real title. The masthead is a PROP — no real publication's
// name, logotype or typeface — and the only claim-free copy the page carries
// is the masthead, the edition line, EXTRA! EXTRA! and the lockup. Every other
// "word" on the page is GREEKED: rows of ink, not sentences. A newspaper is
// made of text, and inventing sentences about Code Ninjas would be inventing
// marketing copy, so the columns are texture and the headline is the logo.
//
// THE MARK IS PRINTED, NOT LIT. A press lays one ink on one paper, so the
// lockup is rendered as a monochrome HALFTONE — but through the three region
// masks, never as one flat tint: the hood and "NINJAS" print as a solid black
// screen, the eye band as a light 20% screen, and "CODE" as a mid 45% screen.
// That tonal separation is the only thing keeping the mark readable once the
// colour is gone. Brand red survives as the press's SECOND PLATE — the EXTRA
// banner is a spot-red overprint, and it stamps on a beat late and a hair off
// register, which is exactly how a real extra edition was made.
//
// WOODBRIDGE is a flow sibling of the photo inside the mark wrapper, so the
// pair travel as one lockup no matter what the page does.
import React from "react";
import "../Stylesheets/Newspaper.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 the page spins in out of the dark · p2 it lands, the picture resolves
// p3 the red EXTRA overprints · p4 the camera pushes in, light crosses the page
// p5 hold
//
// Plays ONCE and holds. See `loopAt` below.
const CUES = [140, 1500, 2000, 2480, 3300];

/* Column copy is greeked — rows of ink at varied widths. Computed once from a
   fixed seed so every take composes identically; a re-roll between takes means
   the recording never matches the still. */
function greek(seed, n) {
  let s = seed;
  return Array.from({ length: n }, (_, i) => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return {
      w: +(0.58 + (s / 2147483648) * 0.42).toFixed(3),
      // a paragraph break every few lines, so the column has structure
      gap: i % 5 === 4,
    };
  });
}
/* enough lines to run off the bottom of the page — the column block clips,
   so the copy reads as continuing past the fold rather than stopping short */
const COLUMNS = [greek(7, 24), greek(23, 24), greek(61, 18)];

/* Paper dust hanging in the press-hall light. Hand-placed for the same reason. */
const MOTES = [
  [8, 0.0, 0.8, 11], [19, 2.2, 0.5, 13], [31, 1.1, 1.1, 9.5],
  [44, 3.4, 0.6, 12], [57, 0.6, 0.9, 10.5], [68, 2.8, 0.5, 14],
  [79, 1.7, 1.0, 9], [91, 3.9, 0.7, 12.5],
];

/* The puff thrown up when the page lands. */
const DUST = [-38, -22, -9, 6, 20, 35];

export default function Newspaper({
  mode = "animated",
  caption = "WOODBRIDGE",
  // PROP WORDING — not a real newspaper and not confirmed copy. The masthead
  // and edition line are the theme's set dressing; if the user wants different
  // wording, both are pinned with textLength and will re-fit on their own.
  masthead = "TORONTO EXPRESS",
  edition = "LATE EDITION ★ EXTRA ★ PRICE FIVE CENTS",
  banner = "EXTRA! EXTRA!",
  // NO LOOP. The sequence plays once and holds on the finished frame; the user
  // refreshes to play it again.
  loopAt = null,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="np np-p0" aria-hidden />;

  return (
    <div
      className={`np np-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      <NewspaperDefs />

      {/* ---- the space: one dark volume with a press lamp in it ---- */}
      <div className="np-hall" aria-hidden />
      <div className="np-lamp" aria-hidden />

      <div className="np-motes" aria-hidden>
        {MOTES.map(([x, d, s, t], i) => (
          <span
            key={i}
            className="np-mote"
            style={{ "--x": `${x}%`, "--d": `${d}s`, "--s": s, "--t": `${t}s` }}
          />
        ))}
      </div>

      {/* speed lines, only while the page is still coming at the camera */}
      <div className="np-streaks" aria-hidden />

      <div className="np-stage">
        <div className="np-shadow" aria-hidden />

        {/* three transform layers, deliberately: the flight, the landing
            bounce and the camera push must not fight over one transform */}
        <div className="np-cam">
          <div className="np-flyer">
            <div className="np-settle">
              <div className="np-page">
                {/* --- masthead. SVG + textLength so the layout holds whatever
                        serif the device actually falls back to --- */}
                <svg className="np-masthead" viewBox="0 0 600 96" aria-hidden>
                  <text
                    className="np-masthead-t"
                    x="300"
                    y="72"
                    textAnchor="middle"
                    textLength="572"
                    lengthAdjust="spacingAndGlyphs"
                  >
                    {masthead}
                  </text>
                </svg>

                <div className="np-rule np-rule-thick" aria-hidden />
                <svg className="np-edition" viewBox="0 0 600 26" aria-hidden>
                  <text
                    className="np-edition-t"
                    x="300"
                    y="19"
                    textAnchor="middle"
                    textLength="520"
                    lengthAdjust="spacingAndGlyphs"
                  >
                    {edition}
                  </text>
                </svg>
                <div className="np-rule" aria-hidden />

                {/* --- the banner: spot red, laid down as a second pass --- */}
                <svg className="np-extra" viewBox="0 0 600 132" aria-hidden>
                  {/* the black plate under it, printed first and slightly off
                      register — that misalignment is the whole tell */}
                  <text
                    className="np-extra-ghost"
                    x="300"
                    y="98"
                    textAnchor="middle"
                    textLength="574"
                    lengthAdjust="spacingAndGlyphs"
                  >
                    {banner}
                  </text>
                  <g filter="url(#np-ink)">
                    <text
                      className="np-extra-t"
                      x="300"
                      y="98"
                      textAnchor="middle"
                      textLength="574"
                      lengthAdjust="spacingAndGlyphs"
                    >
                      {banner}
                    </text>
                  </g>
                </svg>

                {/* --- the lockup, printed as the page's photograph --- */}
                <div className="np-markwrap">
                  <div className="np-markbox">
                    <div className="np-photo">
                      {/* the flat plate the picture resolves out of */}
                      <div className="np-ph-plate" aria-hidden />
                      {/* one screen per region: solid / mid / light. Masking
                          the whole mark with one value would flatten the hood,
                          the eye band and CODE into a single grey and the
                          ninja would lose his eyes. */}
                      <div className="np-ph np-ph-dark" aria-hidden />
                      <div className="np-ph np-ph-accent" aria-hidden />
                      <div className="np-ph np-ph-light" aria-hidden />
                    </div>
                  </div>

                  {/* welded under the photo, in flow — never positioned */}
                  <div className="np-type">
                    <div className="np-caption">{caption}</div>
                    <div className="np-cutrule" aria-hidden />
                  </div>
                </div>

                {/* --- greeked columns, so the page reads as a page --- */}
                <div className="np-cols" aria-hidden>
                  {COLUMNS.map((col, i) => (
                    <div className="np-col" key={i}>
                      <span className="np-sub" />
                      {i === 2 && <span className="np-thumb" />}
                      {col.map((l, j) => (
                        <span
                          key={j}
                          className={`np-line ${l.gap ? "np-line-gap" : ""}`}
                          style={{ "--w": l.w }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* fibre, so it is newsprint and not white card */}
                <svg className="np-fibre" aria-hidden preserveAspectRatio="none">
                  <rect x="0" y="0" width="100%" height="100%" filter="url(#np-fibre-f)" />
                </svg>
                {/* the crease from being folded in half */}
                <div className="np-fold" aria-hidden />
                {/* one pass of light across the paper as the camera moves in */}
                <div className="np-sweep" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* the puff the page throws up when it stops */}
      <div className="np-dust" aria-hidden>
        {DUST.map((x, i) => (
          <span key={i} className="np-puff" style={{ "--x": `${x}%`, "--i": i }} />
        ))}
      </div>

      <div className="np-flash" aria-hidden />
      <svg className="np-grain" aria-hidden preserveAspectRatio="none">
        <rect x="0" y="0" width="100%" height="100%" filter="url(#np-fibre-f)" />
      </svg>
      <div className="np-vig" aria-hidden />
    </div>
  );
}

function NewspaperDefs() {
  return (
    <svg className="np-defs" aria-hidden focusable="false">
      <defs>
        {/* paper fibre. feTurbulence alone is coloured confetti — desaturate it
            or the page reads as television static. */}
        <filter id="np-fibre-f" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" />
        </filter>

        {/* letterpress wobble: the machine-clean edge is the one thing that
            gives a system font away, so the banner gets its edges displaced a
            little before it prints */}
        <filter id="np-ink" x="-8%" y="-25%" width="116%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09 0.16" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="1.9"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
