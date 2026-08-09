// Newspaper.js — the old newsreel gag: a front page comes spinning out of the
// dark, straight at the camera, and stops flat so you can read it. The TORONTO
// EXPRESS, with the mark set as the page's halftone photograph.
//
// Genre, not a real title. The masthead is a PROP — no real publication's
// name, logotype or typeface.
//
// THE COLUMNS ARE REAL PROSE, not greeked bars. At phone scale the body sets
// at about 3px and reads as texture, but it is written text: a byline, a
// place dateline, a drop cap, a subhead, a cutline and a jump line, because
// that furniture is what makes a page read as a PAGE rather than as a poster
// with lines on it. The wording is PLACEHOLDER — see STORY below.
//
// THE MARK IS PRINTED, NOT LIT. A press lays one ink on one paper, so the
// lockup is rendered as a monochrome HALFTONE — but through the three region
// masks, never as one flat tint: the hood and "NINJAS" print as a solid black
// screen, "CODE" as a mid screen, and the eye band as a light screen. That
// tonal separation is the only thing keeping the mark readable once the colour
// is gone. Brand red is the press's SECOND PLATE: it carries the masthead,
// which stamps on a beat after the page lands and a hair off register, exactly
// how a two-colour front page was actually made.
//
// WOODBRIDGE is a flow sibling of the photo inside the mark wrapper, so the
// pair travel as one lockup no matter what the page does.
import React from "react";
import "../Stylesheets/Newspaper.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";
import dojo from "../Images/dojo.jpg";

// p1 the page spins in out of the dark · p2 it has come to rest and the mark
// resolves · p3 the red masthead overprints · p4 the camera pushes in, light
// crosses the page · p5 hold
//
// p2 is set AFTER the flight finishes (140 + 1750), not on top of it — landing
// beats that fire while the paper is still moving are what made the stop read
// as a bump.
//
// Plays ONCE and holds. See `loopAt` below.
const CUES = [140, 1900, 2380, 2860, 3700];

/* PLACEHOLDER PROSE. This is public-facing marketing, so the real wording has
   to come from the user before a take is posted — but it is written rather
   than greeked, because a column of real justified text with a drop cap in it
   has a texture that grey bars do not. Deliberately claim-free: no offers, no
   prices, no addresses, no dates, no named people. */
const STORY = {
  lead:
    "WOODBRIDGE — The dojo on the corner does not look like a classroom, and that is the point. Inside, a dozen kids are hunched over laptops, arguing about whether a character should jump higher or run faster, and testing the answer on the spot.",
  lead2:
    "They call the students ninjas, and belts are earned the way they are in a martial arts studio.",
  lead3:
    "The room is loud on purpose. Senseis move between screens asking questions instead of giving answers, which is slower on any given afternoon and much faster over a year.",
  mid1:
    "Every ninja builds games, and that is not an accident. A game is a program that tells you immediately when you are wrong: the ball falls through the floor, the enemy walks through a wall, the score counts backwards, and the fix is a line or two away.",
  mid2:
    "Parents ask whether the games are the point. They are not. Underneath the sprites are variables, loops, conditions and functions, the same pieces a working engineer uses, introduced in an order that keeps the room busy.",
  mid3:
    "What changes first is not the code. It is the willingness to sit with a problem for ten minutes without asking anyone for the answer.",
  end1:
    "Belts are earned in front of the room. A ninja demonstrates the build, takes questions, and walks everyone through the one bug that nearly beat them.",
  end2:
    "Afterwards there is a wall of names, and the next belt is already on it. Nobody hurries. The kids who finish fastest are usually the ones who slowed down at the start.",
};

/* Paper dust hanging in the press-hall light. Hand-placed so every take
   composes identically — a random scatter never matches between takes. */
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
  // PROP WORDING — a prop paper, and a straight news headline rather than a
  // joke. Every line here is pinned with textLength, so new wording re-fits
  // itself instead of overrunning the measure.
  masthead = "TORONTO EXPRESS",
  kicker = "EDUCATION",
  headline1 = "LEARNING TO CODE,",
  headline2 = "ONE BELT AT A TIME",
  deck = "Woodbridge students earn their rank by shipping something that works",
  byline = "BY STAFF REPORTER",
  // The page's lead art, run at the full measure across the top. It is printed
  // CLEAN — no screen, no greyscale, no blend — because the user wants the
  // photograph readable rather than treated.
  photo = dojo,
  photoCaption =
    "Students at the Woodbridge dojo with their laptops and robotics builds.",
  photoCredit = "EXPRESS PHOTO",
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
                  {/* the black plate, printed first and a hair off register */}
                  <text
                    className="np-masthead-ghost"
                    x="300"
                    y="72"
                    textAnchor="middle"
                    textLength="572"
                    lengthAdjust="spacingAndGlyphs"
                  >
                    {masthead}
                  </text>
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
                <div className="np-rule np-rule-hair np-rule-tight" aria-hidden />

                {/* --- section flag, the way a paper labels its page --- */}
                <div className="np-kicker" aria-hidden>
                  <span>{kicker}</span>
                </div>

                {/* --- the headline, set to the measure like a real one --- */}
                <svg className="np-headline" viewBox="0 0 600 216" aria-hidden>
                  <g filter="url(#np-ink)">
                    <text
                      x="300"
                      y="88"
                      textAnchor="middle"
                      textLength="574"
                      lengthAdjust="spacingAndGlyphs"
                    >
                      {headline1}
                    </text>
                    <text
                      x="300"
                      y="192"
                      textAnchor="middle"
                      textLength="574"
                      lengthAdjust="spacingAndGlyphs"
                    >
                      {headline2}
                    </text>
                  </g>
                </svg>

                <div className="np-deck">{deck}</div>
                <div className="np-rule np-rule-hair" aria-hidden />

                {/* --- the lead art: the photograph, run at the full
                        measure across the top of the page --- */}
                <figure className="np-lead">
                  <div className="np-cut-frame">
                    {photo ? (
                      <img className="np-cut-img" src={photo} alt="" />
                    ) : (
                      <div className="np-cut-plate" />
                    )}
                  </div>
                  <figcaption className="np-cutline">
                    {photoCaption} <span className="np-credit">{photoCredit}</span>
                  </figcaption>
                </figure>

                {/* --- the story. The lockup sits in the made-up page as a
                        boxed house ad across two columns, which is exactly
                        where a paper puts its own mark. --- */}
                <div className="np-cols" aria-hidden>
                  <div className="np-markwrap">
                    <div className="np-markbox">
                      <div className="np-photo">
                        {/* the flat plate the picture resolves out of */}
                        <div className="np-ph-plate" />
                        {/* one screen per region: solid / mid / light. Masking
                            the whole mark with one value would flatten the
                            hood, the eye band and CODE into a single grey and
                            the ninja would lose his eyes. */}
                        <div className="np-ph np-ph-dark" />
                        <div className="np-ph np-ph-accent" />
                        <div className="np-ph np-ph-light" />
                      </div>
                    </div>

                    {/* welded under the mark, in flow — never positioned */}
                    <div className="np-type">
                      <div className="np-caption">{caption}</div>
                      <div className="np-cutrule" />
                    </div>
                  </div>

                  <div className="np-col np-col-a">
                    <div className="np-byline">{byline}</div>
                    <div className="np-rule np-rule-hair np-rule-tight" />
                    <p className="np-body np-body-lead">{STORY.lead}</p>
                    <p className="np-body">{STORY.lead2}</p>
                  </div>

                  <div className="np-col np-col-b">
                    <p className="np-body">{STORY.lead3}</p>
                    <p className="np-body">{STORY.end1}</p>
                    <p className="np-jump">Continued on Page 4</p>
                  </div>

                  <div className="np-col np-col-c">
                    <div className="np-subhead">A GAME OF THEIR OWN</div>
                    <p className="np-body">{STORY.mid1}</p>
                    <p className="np-body">{STORY.mid2}</p>
                    <p className="np-body">{STORY.mid3}</p>
                  </div>
                </div>

                {/* --- folio, the way a front page signs itself --- */}
                <div className="np-rule np-rule-hair" aria-hidden />
                <div className="np-folio" aria-hidden>
                  <span>{masthead}</span>
                  <span>PAGE ONE</span>
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
            gives a system font away, so the headline gets its edges displaced
            a little before it prints */}
        <filter id="np-ink" x="-8%" y="-25%" width="116%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09 0.16" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="1.7"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
