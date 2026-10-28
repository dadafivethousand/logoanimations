// Mafia.js — a hook for the front of a video: a gangster in silhouette on a
// white ground, fedora and overcoat, a drum-fed tommy gun at the hip. He comes
// up out of the white and swings the gun up level. No brand, no text.
//
// PROFILE, BECAUSE IT IS A SILHOUETTE. A silhouette carries only its outline,
// and the tommy gun's outline — stock, drum, vertical foregrip, finned barrel —
// only exists side-on. So is the fedora's. One flat black shape, with a white
// hairline for the hat band as the only interior detail.
import React from "react";
import "../Stylesheets/Mafia.css";
import usePhases from "../Utils/usePhases";

// p1 he fades up out of the white
// p2 the gun swings up level
//
// Plays ONCE and holds — loopAt is null. The cigarette smoke keeps drifting on
// the held frame; that is ambient, not a restart.
const CUES = [150, 1000];

export default function Mafia({ mode = "animated", loopAt = null }) {
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt });

  return (
    <div className={`mf mf-p${phase} ${isStatic ? "is-static" : ""}`} key={run}>
      <div className="mf-card">
        <div className="mf-figbox">
          <div className="mf-shadow" aria-hidden />
          <svg className="mf-man" viewBox="52 0 264 400" role="img" aria-label="Gangster with a tommy gun">
            <g fill="var(--ink)">
              {/* legs, in a planted stance */}
              <path d="M102,326 L120,326 L112,382 L96,382 Z" />
              <path d="M88,396 L94,380 L114,380 C122,382 126,388 126,396 Z" />
              <path d="M124,326 L144,326 L150,382 L134,382 Z" />
              <path d="M132,396 L134,380 L152,380 C162,382 168,388 168,396 Z" />

              {/* overcoat */}
              <path d="M104,104 C94,106 88,116 88,130 L92,226 C90,262 86,300 81,330 L163,330 C157,300 151,262 148,226 L152,140 C154,124 148,108 134,104 Z" />
              <path d="M102,108 L110,90 L120,108 Z" />
              <path d="M126,106 L136,94 L140,112 Z" />

              {/* head and neck */}
              <path d="M110,94 L130,98 L130,112 L108,112 Z" />
              <path d="M102,58 C98,74 100,88 108,98 C114,104 124,104 130,102 C134,100 136,97 136,94 L138,90 L136,88 L139,82 L145,77 L139,70 L139,58 Z" />
              <path d="M138,89 L151,87.5" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />

              {/* fedora */}
              <path d="M98,50 C96,36 100,22 112,20 C122,18 132,20 138,24 C144,30 144,42 142,50 Z" />
              <path d="M82,56 C90,50 110,48 124,48 C140,48 154,50 164,55 C156,59 140,59 124,59 C108,59 92,59 82,56 Z" />
            </g>
            <path d="M98.5,45 L142,45" stroke="var(--paper)" strokeWidth="1.3" />

            {/* smoke off the cigarette */}
            <g className="mf-smoke" fill="none" stroke="#9a9a9a" strokeLinecap="round">
              <path className="mf-wisp mf-wisp-a" d="M152,85 C146,77 156,68 150,58 C145,50 154,42 150,34" strokeWidth="1.5" />
              <path className="mf-wisp mf-wisp-b" d="M152,85 C159,77 147,66 154,56 C160,48 152,40 157,30" strokeWidth="1.1" />
            </g>

            {/* both arms and the gun swing together about the shoulder */}
            <g className="mf-gun" fill="var(--ink)">
              {/* far arm, reaching to the foregrip */}
              <path d="M128,112 C142,110 150,120 150,132 L152,168 L216,190 L212,206 L146,186 C138,182 136,176 136,168 Z" />
              <circle cx="217" cy="200" r="7.5" />

              {/* the gun: stock, receiver, grip, drum, foregrip, finned barrel */}
              <path d="M100,186 L150,191 L150,204 L104,214 C100,206 99,194 100,186 Z" />
              <path d="M148,185 L202,185 L202,202 L148,202 Z" />
              <path d="M152,185 L152,180 L157,180 L157,185 Z" />
              <path d="M160,200 L171,200 L167,225 L156,223 Z" />
              <path d="M171,202 C171,212 184,212 184,202" fill="none" stroke="var(--ink)" strokeWidth="2.4" />
              <circle cx="194" cy="215" r="16" />
              <path d="M210,198 L221,198 L223,223 L212,223 Z" />
              <path d="M202,188 L232,188 L232,198 L202,198 Z" />
              <path d="M232,190 L270,190 L270,196 L232,196 Z" />
              {[236, 242, 248, 254, 260].map((x) => (
                <rect key={x} x={x} y="187.5" width="3" height="11" />
              ))}
              <path d="M268,187 L282,187 L282,199 L268,199 Z" />
              <circle cx="194" cy="215" r="5" fill="var(--paper)" />
              <circle cx="194" cy="215" r="2.2" />

              {/* near arm, on the rear grip */}
              <path d="M108,110 C120,106 134,112 134,124 L134,170 C134,175 132,179 129,181 L162,196 L157,212 L118,190 C112,186 108,180 108,170 Z" />
              <circle cx="162" cy="205" r="7.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
