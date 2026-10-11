// FreeHat.js — a looping sign for a fair booth: FREE HAT, and the three things
// that earn it. A modelled cap drops in, spins and is lit by each scene in
// turn; confetti goes off on every beat; marquee bulbs chase round the frame.
//
// This one departs from the rest of the repo on purpose, because the user
// asked for it: it is a promo, not a logo theme, and it runs on whatever screen
// is at the booth rather than being screen-recorded for a phone — so it lays
// out for LANDSCAPE as well as portrait (see --u in the stylesheet) and it
// loops until the tab is closed.
//
// The cap, props and confetti are WebGL (FreeHatScene.js). Everything you read
// is HTML on top of it, keyed off .fh-p0..p5 like every other theme. The cap
// goes wherever the empty .fh-hatzone box lands in the layout: move the box in
// CSS and the 3D follows, nothing to retune in the scene.
//
// Every string is a prop. They are an offer on a public sign — the wording here
// is the user's own brief (follow, 5-star review, book a free session).
//
// URL switches, for whoever is setting the screen up:
//   ?hat=white|black|blue|red   the cap's colourway (the real one is white)
//   ?scene=1..5           hold on one scene instead of cycling
import React, { useEffect, useMemo, useRef, useState } from "react";
import "../Stylesheets/FreeHat.css";
import usePhases from "../Utils/usePhases";
import createFreeHatScene, { HATS } from "./FreeHatScene";
import logoSrc from "../logo";

// p1 the cap drops in · p2 follow · p3 review · p4 book · p5 all three, held
const CUES = [200, 4800, 10600, 16400, 22200];
const LOOP_AT = 31000;

const HEADLINE = ["F", "R", "E", "E", " ", "H", "A", "T", "!"];

const Star = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 5l13.6 29.2 32 4.1-23.5 22 6 31.7L50 76.300 21.900 92l6-31.700L4.400 38.300l32-4.100z" />
  </svg>
);

const Instagram = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <defs>
      <radialGradient id="fh-ig" cx="28%" cy="104%" r="130%">
        <stop offset="0" stopColor="#ffd676" />
        <stop offset="0.25" stopColor="#f86f30" />
        <stop offset="0.5" stopColor="#e1306c" />
        <stop offset="0.78" stopColor="#a32fc2" />
        <stop offset="1" stopColor="#4f5bd5" />
      </radialGradient>
    </defs>
    <rect x="4" y="4" width="92" height="92" rx="25" fill="url(#fh-ig)" stroke="#fff" strokeWidth="5" />
    <rect x="25" y="25" width="50" height="50" rx="15" fill="none" stroke="#fff" strokeWidth="7" />
    <circle cx="50" cy="50" r="12.500" fill="none" stroke="#fff" strokeWidth="7" />
    <circle cx="65.500" cy="34.500" r="4.200" fill="#fff" />
  </svg>
);

const Gamepad = () => (
  <svg viewBox="0 0 120 100" aria-hidden="true">
    <path
      d="M34 22h52c17 0 27 14 30 36 2 15-3 27-13 27-9 0-14-8-21-17H38c-7 9-12 17-21 17C7 85 2 73 4 58 7 36 17 22 34 22z"
      fill="#fff"
      stroke="#160a3c"
      strokeWidth="6"
      strokeLinejoin="round"
    />
    <path d="M30 41h10v-10h10v10h10v10H50v10H40V51H30z" fill="#160a3c" transform="translate(-8 0)" />
    <circle cx="80" cy="52" r="6.500" fill="#ff2d55" />
    <circle cx="94" cy="40" r="6.500" fill="#0a84ff" />
  </svg>
);

const Search = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="42" cy="42" r="27" fill="none" stroke="#4285f4" strokeWidth="13" />
    <path d="M63 63l26 26" stroke="#4285f4" strokeWidth="14" strokeLinecap="round" />
  </svg>
);

// "Google" in its own four colours, set as type — the word people look for
const GOOGLE = [["G", "#4285f4"], ["o", "#ea4335"], ["o", "#fbbc05"], ["g", "#4285f4"], ["l", "#34a853"], ["e", "#ea4335"]];
const Google = () => (
  <span className="fh-google" aria-label="Google">
    {GOOGLE.map(([ch, c], i) => (
      <span key={i} style={{ color: c }}>{ch}</span>
    ))}
  </span>
);

// four-point glints scattered over the frame: [left %, top %, size u, delay s]
const GLINTS = [
  [13, 17, 7, 0], [88, 14, 9, 0.5], [47, 9, 6, 1.1], [93, 52, 7, 0.3], [8, 58, 8, 0.9],
  [56, 47, 6, 1.4], [27, 88, 8, 0.6], [72, 90, 7, 1.2], [38, 34, 5, 0.2], [82, 76, 6, 0.8],
];

const Tick = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <path d="M22 53l19 19 38-44" fill="none" stroke="#fff" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Bulbs({ w, h }) {
  // an even pitch round the frame whatever the screen's shape
  const pitch = Math.max(w, h) / 26;
  const nx = Math.max(6, Math.round(w / pitch));
  const ny = Math.max(6, Math.round(h / pitch));
  const dots = [];
  let k = 0;
  for (let i = 0; i < nx; i++) dots.push({ k: k++, left: `${((i + 0.5) / nx) * 100}%`, top: "var(--rim)" });
  for (let i = 0; i < ny; i++) dots.push({ k: k++, left: "calc(100% - var(--rim))", top: `${((i + 0.5) / ny) * 100}%` });
  for (let i = nx - 1; i >= 0; i--) dots.push({ k: k++, left: `${((i + 0.5) / nx) * 100}%`, top: "calc(100% - var(--rim))" });
  for (let i = ny - 1; i >= 0; i--) dots.push({ k: k++, left: "var(--rim)", top: `${((i + 0.5) / ny) * 100}%` });
  return (
    <div className="fh-frame" aria-hidden="true">
      {dots.map((d) => (
        <i key={d.k} className={`fh-bulb fh-bulb-${d.k % 3}`} style={{ left: d.left, top: d.top }} />
      ))}
    </div>
  );
}

function FreeHat({
  mode = "animated",
  handle = "@cn_woodbridge",
  place = "Code Ninjas Woodbridge",
}) {
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const reduced = useMemo(
    () => !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const held = Number(query.get("scene")) || 0;
  const still = mode === "static" || reduced;
  const { phase: live } = usePhases(CUES, { mode: still ? "static" : "animated", loopAt: LOOP_AT });
  const phase = held ? Math.min(5, Math.max(1, held)) : live;
  const hat = HATS[query.get("hat")] ? query.get("hat") : "white";

  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const zoneRef = useRef(null);
  const sceneRef = useRef(null);
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const stage = stageRef.current;
    const scene = createFreeHatScene(canvasRef.current, { logoSrc, hat, isStatic: still });
    sceneRef.current = scene;

    const fit = () => {
      const s = stage.getBoundingClientRect();
      const z = zoneRef.current.getBoundingClientRect();
      scene.resize(s.width, s.height, {
        left: z.left - s.left,
        top: z.top - s.top,
        width: z.width,
        height: z.height,
      });
      setSize({ w: s.width, h: s.height });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    // the headline's web font changes the layout above the cap when it lands
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

    return () => {
      ro.disconnect();
      sceneRef.current = null;
      scene.dispose();
    };
  }, [hat, still]);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.setPhase(phase);
  }, [phase, hat, still]);

  // a booth screen must not go to sleep halfway through the afternoon
  useEffect(() => {
    let lock = null;
    const hold = async () => {
      try {
        if (navigator.wakeLock && document.visibilityState === "visible") {
          lock = await navigator.wakeLock.request("screen");
        }
      } catch (e) {
        /* not granted — the screen's own sleep setting applies */
      }
    };
    hold();
    document.addEventListener("visibilitychange", hold);
    return () => {
      document.removeEventListener("visibilitychange", hold);
      if (lock) lock.release().catch(() => {});
    };
  }, []);

  const goFullscreen = () => {
    const el = document.documentElement;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  };

  return (
    <div
      ref={stageRef}
      className={`fh-stage fh-p${phase} fh-hat-${hat}${still ? " is-static" : ""}`}
      onClick={goFullscreen}
    >
      <div className="fh-bg" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className={`fh-sky fh-sky-${n}`} />
        ))}
        <div className="fh-rays" />
        <div className="fh-dots" />
      </div>

      <canvas ref={canvasRef} className="fh-gl" />

      {!still && phase > 0 && <div key={phase} className="fh-flash" aria-hidden="true" />}

      <div className="fh-card">
        <header className="fh-head">
          <div className="fh-kicker">GET YOUR</div>
          <h1 className="fh-headline" aria-label="Free hat!">
            {HEADLINE.map((ch, i) =>
              ch === " " ? (
                <span key={i} className="fh-gap" />
              ) : (
                <span key={i} className="fh-letter" style={{ "--i": i }}>
                  {ch}
                </span>
              )
            )}
          </h1>
        </header>

        <div ref={zoneRef} className="fh-hatzone" aria-hidden="true">
          <div className="fh-halo" />
        </div>

        <section className="fh-panel">
          <div className="fh-scene fh-s-intro">
            <div className="fh-easy">
              <span>JUST</span>
              <b>3</b>
              <span>EASY STEPS</span>
            </div>
            <div className="fh-trio">
              <i className="fh-mini fh-mini-1"><Instagram /></i>
              <i className="fh-mini fh-mini-2"><Star /></i>
              <i className="fh-mini fh-mini-3"><Gamepad /></i>
            </div>
          </div>

          <div className="fh-scene fh-s-1">
            <div className="fh-top">
              <span className="fh-chip">STEP <b>1</b></span>
              <i className="fh-ico"><Instagram /></i>
            </div>
            <h2 className="fh-title">FOLLOW US</h2>
            <div className="fh-pill fh-pill-ig">{handle}</div>
            <p className="fh-sub">on Instagram</p>
          </div>

          <div className="fh-scene fh-s-2">
            <div className="fh-top">
              <span className="fh-chip">STEP <b>2</b></span>
            </div>
            <div className="fh-stars">
              {[0, 1, 2, 3, 4].map((i) => (
                <i key={i} className="fh-star" style={{ "--i": i }}><Star /></i>
              ))}
            </div>
            <h2 className="fh-title">
              LEAVE A 5-STAR<br /><Google /> REVIEW:
            </h2>
            <div className="fh-how">
              <div className="fh-searchbar">
                <i><Search /></i>
                <span className="fh-typed">{place}</span>
              </div>
              <span className="fh-how-label">then tap <b>Write a review</b></span>
            </div>
          </div>

          <div className="fh-scene fh-s-3">
            <div className="fh-top">
              <span className="fh-chip">STEP <b>3</b></span>
              <i className="fh-ico fh-ico-pad"><Gamepad /></i>
            </div>
            <h2 className="fh-title">
              BOOK A <em>FREE</em><br />GAME BUILDING<br />SESSION
            </h2>
            <div className="fh-pill">at {place}</div>
          </div>

          <div className="fh-scene fh-s-recap">
            <ul className="fh-list">
              <li style={{ "--i": 0 }}>
                <i className="fh-tick"><Tick /></i>
                <span>Follow <b>{handle}</b></span>
              </li>
              <li style={{ "--i": 1 }}>
                <i className="fh-tick"><Tick /></i>
                <span>Leave a <b>5-star Google review</b> for {place}</span>
              </li>
              <li style={{ "--i": 2 }}>
                <i className="fh-tick"><Tick /></i>
                <span>Book a <b>free game building session</b></span>
              </li>
            </ul>
            <div className="fh-brand">
              <div className="fh-brand-mark">
                <img src={logoSrc} alt="Code Ninjas" />
              </div>
              <div className="fh-brand-town" aria-label="Woodbridge">
                {"WOODBRIDGE".split("").map((ch, i) => (
                  <span key={i}>{ch}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="fh-glints" aria-hidden="true">
        {GLINTS.map(([l, t, s, d], i) => (
          <i key={i} style={{ left: `${l}%`, top: `${t}%`, "--s": s, "--d": `${d}s` }} />
        ))}
      </div>

      <Bulbs w={size.w} h={size.h} />
    </div>
  );
}

export default FreeHat;
