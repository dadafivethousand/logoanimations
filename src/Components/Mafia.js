// Mafia.js — a hook for the front of a video. A hanging lamp stutters on in a
// foggy alley, a man in a fedora and overcoat walks out of the fog straight at
// the camera, stops under the light, and levels a pistol at the viewer. Light
// catches his eyes over the sights, and the lockup slams in under his feet.
//
// HE WALKS AT THE CAMERA, NOT ACROSS IT. A profile walk-on would need a second
// drawing for the turn to face us, and the turn is a cut. Walking out of the
// depth keeps one front-facing figure the whole way: the walk is a scale-up
// from the vanishing point, with a step cycle, a bob and swinging arms on top.
//
// THE GUN POINTS AT THE VIEWER. A muzzle seen end-on is what makes this a
// hook; a gun in profile aimed off-frame is a picture of a man with a gun. It
// is drawn as the slide face with the bore dead centre, the trigger guard and
// a gloved fist below it, and the sleeve foreshortening back to the shoulder.
// The raise is a fast swap (hanging arm out, levelled arm scaling up from the
// shoulder) — at 200ms the eye reads it as motion, not as a cut.
//
// THE EYE LIGHT. Noir's signature lighting slash — a strip of light across the
// eyes under a dark brim — is the same band the Code Ninjas mask has, which is
// why it lands on the click.
//
// The logo is shown in its own colours. A black hood on a dark set would be
// lost, so it sits in the lamp's pool on the ground and a cream rim traces the
// letterforms. WOODBRIDGE sits in flow under the mark, inside the same wrapper.
import React from "react";
import "../Stylesheets/Mafia.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 the lamp stutters on: fog and the cone come up
// p2 he walks out of the fog toward the camera
// p3 he stops under the light
// p4 the gun comes up at the viewer, the camera pushes in
// p5 click — the eye light, a glint off the front sight
// p6 the lockup slams in
//
// Plays ONCE and holds — loopAt is null. The smoke, fog and the lamp's sway
// keep running on the held frame; that is ambient, not a restart.
const CUES = [150, 600, 2700, 3050, 3550, 4100];

export default function Mafia({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = null,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="mf mf-p0" aria-hidden />;

  return (
    <div
      className={`mf mf-p${phase} ${isStatic ? "is-static" : ""}`}
      style={logoVar}
      key={run}
    >
      <div className="mf-world">
        <div className="mf-wall" aria-hidden />
        <div className="mf-lamp" aria-hidden>
          <div className="mf-cone" />
          <div className="mf-wire" />
          <div className="mf-shade" />
          <div className="mf-bulb" />
        </div>
        <div className="mf-fog mf-fog-a" aria-hidden />
        <div className="mf-fog mf-fog-b" aria-hidden />

        <div className="mf-card">
          <div className="mf-figbox">
            <div className="mf-pool" aria-hidden />
            <div className="mf-walker">
              <div className="mf-shadow" aria-hidden />
              <div className="mf-gait">
                <Gangster />
              </div>
            </div>
          </div>

          <div className="mf-markwrap">
            <div className="mf-markbox">
              <div className="mf-mark" role="img" aria-label="Code Ninjas" />
            </div>
            <div className="mf-type">{caption}</div>
          </div>
        </div>
      </div>

      <div className="mf-flash" aria-hidden />
      <div className="mf-vignette" aria-hidden />
      <div className="mf-grain" aria-hidden />
    </div>
  );
}

// Front-facing, viewBox 200x400, feet on the bottom edge. Every animated group
// carries no transform attribute — a CSS transform would replace it.
function Gangster() {
  return (
    <svg className="mf-man" viewBox="0 0 200 400" aria-hidden>
      <defs>
        <pattern id="mf-pin" width="7" height="7" patternUnits="userSpaceOnUse">
          <rect x="3" width="0.7" height="7" fill="#e9dcc0" opacity="0.09" />
        </pattern>
        <linearGradient id="mf-coat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a332c" />
          <stop offset="0.35" stopColor="#221d19" />
          <stop offset="1" stopColor="#141110" />
        </linearGradient>
        <linearGradient id="mf-tie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff2a4c" />
          <stop offset="1" stopColor="#8e0019" />
        </linearGradient>
        <linearGradient id="mf-hat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4138" />
          <stop offset="1" stopColor="#1a1613" />
        </linearGradient>
        <linearGradient id="mf-eyes" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c99f74" stopOpacity="0" />
          <stop offset="0.25" stopColor="#d9b48a" />
          <stop offset="0.75" stopColor="#d9b48a" />
          <stop offset="1" stopColor="#c99f74" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="mf-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6d665e" />
          <stop offset="0.4" stopColor="#3b3632" />
          <stop offset="1" stopColor="#24201d" />
        </linearGradient>
        <clipPath id="mf-face-clip">
          <path d={FACE_D} />
        </clipPath>
        <clipPath id="mf-torso-clip">
          <path d={TORSO_D} />
        </clipPath>
      </defs>

      {/* legs — each its own group so the step cycle can lift it */}
      <g className="mf-leg mf-leg-l">
        <path d="M72,326 L98,326 L96,382 L75,382 Z" fill="#171412" />
        <path d="M62,394 L62,386 C62,380 69,378 76,378 L97,378 L98,394 Z" fill="#0d0b0a" />
        <path d="M66,382 C70,380 78,380 86,380" stroke="#8b8172" strokeWidth="1.4" fill="none" opacity="0.6" />
      </g>
      <g className="mf-leg mf-leg-r">
        <path d="M102,326 L128,326 L125,382 L104,382 Z" fill="#171412" />
        <path d="M102,394 L103,378 L124,378 C131,378 138,380 138,386 L138,394 Z" fill="#0d0b0a" />
        <path d="M114,380 C122,380 130,380 134,382" stroke="#8b8172" strokeWidth="1.4" fill="none" opacity="0.6" />
      </g>

      {/* the off arm, hanging */}
      <g className="mf-arm mf-arm-off">
        <path d="M140,112 C151,113 158,121 159,134 L165,258 L148,262 L145,150 Z" fill="url(#mf-coat)" />
        <path d="M148,258 C146,270 150,283 157,283 C163,283 167,272 165,258 Z" fill="#110e0c" />
        <path d="M152,116 C156,120 158,126 159,134" stroke="#e9dcc0" strokeWidth="1.6" fill="none" opacity="0.45" />
      </g>

      {/* shirt and tie, behind the lapels */}
      <path d="M85,106 L115,106 L100,208 Z" fill="#9a907e" />
      <path d="M85,106 L93,122 L100,110 L107,122 L115,106 Z" fill="#c9bea8" />
      <path d="M95,110 L105,110 L103,119 L97,119 Z" fill="#b8001f" />
      <path d="M97,119 L103,119 L108,188 L100,198 L92,188 Z" fill="url(#mf-tie)" />

      {/* overcoat */}
      <path d={TORSO_D} fill="url(#mf-coat)" />
      <rect x="0" y="0" width="200" height="400" fill="url(#mf-pin)" clipPath="url(#mf-torso-clip)" />
      <path d="M86,106 L74,142 L83,148 L100,208" stroke="#4d453c" strokeWidth="1.4" fill="none" />
      <path d="M114,106 L126,142 L117,148 L100,208" stroke="#4d453c" strokeWidth="1.4" fill="none" />
      <rect x="53" y="230" width="94" height="11" fill="#100d0c" />
      <rect x="94" y="229" width="12" height="13" rx="1.5" fill="none" stroke="#6a6156" strokeWidth="1.4" />
      {[[89, 214], [111, 214], [89, 262], [111, 262]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill="#0c0a09" stroke="#4d453c" strokeWidth="0.8" />
      ))}
      <path d="M100,262 L100,326" stroke="#0c0a09" strokeWidth="1.6" />
      {/* lamp light on the shoulders */}
      <path d="M48,120 C52,114 60,111 86,106" stroke="#efe2c6" strokeWidth="2" fill="none" opacity="0.55" />
      <path d="M152,120 C148,114 140,111 114,106" stroke="#efe2c6" strokeWidth="2" fill="none" opacity="0.55" />

      {/* head */}
      <path d="M90,96 L110,96 L112,110 L88,110 Z" fill="#1a1411" />
      <path d="M77,70 C73,72 73,82 78,86 Z" fill="#241b16" />
      <path d="M123,70 C127,72 127,82 122,86 Z" fill="#241b16" />
      <path d={FACE_D} fill="#2a201a" />
      <g clipPath="url(#mf-face-clip)">
        <g className="mf-eyelight">
          <rect x="74" y="69" width="52" height="11" fill="url(#mf-eyes)" />
          <path d="M84,75 C87,72.6 93,72.6 96,75 C93,76.6 87,76.6 84,75 Z" fill="#120c09" />
          <path d="M104,75 C107,72.6 113,72.6 116,75 C113,76.6 107,76.6 104,75 Z" fill="#120c09" />
          <circle cx="91.5" cy="74.4" r="0.9" fill="#fff4dc" />
          <circle cx="111.5" cy="74.4" r="0.9" fill="#fff4dc" />
        </g>
        {/* the ember lights the jaw from below */}
        <ellipse className="mf-emberlight" cx="114" cy="96" rx="16" ry="10" fill="#ff7a2a" opacity="0.28" />
      </g>

      {/* cigarette, and its smoke */}
      <path d="M106,91 L118,89.5" stroke="#e8dfcf" strokeWidth="2.2" strokeLinecap="round" />
      <circle className="mf-ember" cx="119" cy="89.4" r="1.7" fill="#ff6a1a" />
      <g className="mf-smoke" fill="none" stroke="#e9dcc0" strokeLinecap="round">
        <path className="mf-wisp mf-wisp-a" d="M120,86 C114,78 126,70 120,60 C115,52 124,44 120,36" strokeWidth="1.6" />
        <path className="mf-wisp mf-wisp-b" d="M120,86 C127,78 117,68 124,58 C130,50 122,42 127,32" strokeWidth="1.2" />
        <path className="mf-wisp mf-wisp-c" d="M120,86 C116,80 122,74 118,66 C114,58 120,52 116,44" strokeWidth="1" />
      </g>

      {/* fedora */}
      <path
        d="M68,52 C66,38 70,24 80,20 C88,17 94,25 100,23 C106,25 112,17 120,20 C130,24 134,38 132,52 Z"
        fill="url(#mf-hat)"
      />
      <path d="M68,43 C80,47 120,47 132,43 L132,52 C120,55 80,55 68,52 Z" fill="#0e0c0b" />
      <path
        d="M44,60 C52,51 74,49 100,49 C126,49 148,51 156,60 C148,63 136,62 128,62 C118,66 110,69 100,69 C90,69 82,66 72,62 C64,62 52,63 44,60 Z"
        fill="#1b1714"
      />
      <path d="M71,30 C74,24 78,21 82,20 C88,18 94,25 100,23 C106,25 112,18 118,20 C122,21 126,24 129,30" stroke="#f3e6cb" strokeWidth="1.8" fill="none" opacity="0.6" />
      <path d="M47,58 C58,52 76,50 100,50 C124,50 142,52 153,58" stroke="#f3e6cb" strokeWidth="1.3" fill="none" opacity="0.5" />

      {/* gun arm, hanging — before the raise */}
      <g className="mf-arm mf-arm-down">
        <path d="M60,112 C49,113 42,121 41,134 L35,258 L52,262 L55,150 Z" fill="url(#mf-coat)" />
        <path d="M48,116 C44,120 42,126 41,134" stroke="#e9dcc0" strokeWidth="1.6" fill="none" opacity="0.45" />
        <rect x="40" y="272" width="8" height="42" rx="1" fill="url(#mf-steel)" />
        <path d="M35,258 C33,270 37,283 44,283 C50,283 54,272 52,258 Z" fill="#110e0c" />
      </g>

      {/* gun arm, levelled at the camera */}
      <g className="mf-arm-up">
        {/* sleeve foreshortening back to the shoulder */}
        <path
          d="M60,111 C47,112 38,122 39,136 C40,150 52,160 70,160 C84,160 94,156 98,148 L96,124 C86,118 72,112 60,111 Z"
          fill="url(#mf-coat)"
        />
        <path d="M48,116 C42,122 39,130 40,138" stroke="#e9dcc0" strokeWidth="1.6" fill="none" opacity="0.45" />
        {/* shirt cuff */}
        <ellipse cx="92" cy="138" rx="20" ry="17" fill="#8d8371" />
        {/* the fist round the grip */}
        <path d="M73,121 C73,115 80,113 92,113 C104,113 111,115 111,121 L111,148 C111,156 103,160 92,160 C81,160 73,156 73,148 Z" fill="#141110" />
        <path d="M76,130 C84,133 100,133 108,130" stroke="#3b342e" strokeWidth="1.3" fill="none" />
        <path d="M76,139 C84,142 100,142 108,139" stroke="#3b342e" strokeWidth="1.3" fill="none" />
        <path d="M77,148 C85,151 99,151 107,148" stroke="#3b342e" strokeWidth="1.3" fill="none" />
        <path d="M107,117 C114,118 116,127 111,134" stroke="#4a4139" strokeWidth="1.4" fill="none" />
        {/* trigger guard */}
        <path d="M84,113 L84,118 C84,126 100,126 100,118 L100,113" stroke="#2d2926" strokeWidth="3" fill="none" />
        {/* frame and slide, end-on, bore dead centre */}
        <rect x="82" y="104" width="20" height="10" rx="1.5" fill="#2a2623" />
        <rect x="79" y="84" width="26" height="22" rx="3" fill="url(#mf-steel)" />
        <rect x="90" y="80" width="4" height="5" rx="0.8" fill="#4a443e" />
        <circle cx="92" cy="95" r="5.6" fill="#030202" />
        <circle cx="92" cy="95" r="5.6" fill="none" stroke="#7c746a" strokeWidth="0.9" />
        <path d="M80,85.5 L104,85.5" stroke="#f3e6cb" strokeWidth="1.2" opacity="0.7" />
        <g className="mf-glint">
          <path d="M92,74 L93,80 L92,86 L91,80 Z M86,80 L92,79 L98,80 L92,81 Z" fill="#fff8e6" />
        </g>
      </g>
    </svg>
  );
}

const FACE_D =
  "M78,60 C78,79 82,93 92,99 C96,101 104,101 108,99 C118,93 122,79 122,60 Z";

const TORSO_D =
  "M86,106 L60,112 C54,114 52,122 52,132 L54,226 C50,262 46,300 42,330 L158,330 C154,300 150,262 146,226 L148,132 C148,122 146,114 140,112 L114,106 L100,208 Z";
