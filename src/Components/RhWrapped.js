// RhWrapped.js — a day's classes at Richmond Hill Jiu-Jitsu as a year-in-
// review style music recap, story format.
//
// Story slides with progress bars across the top: "Your Monday Playlist." on
// purple with blobs turning behind it; then a slide per class — "Your top
// class" with a record spinning and an equalizer bouncing, "On repeat" with
// rings pulsing — each a new colour, each coming in on a circle wipe; and a
// summary card to finish: both classes ranked, RHBJJ.CA.
//
// Recap-format styling only: no streaming-service names, logos or colours.
//
// Pure function of time:
//   ?render=1      window.__ready / __renderAt(ms) / __rhWrapEnd for
//                  tools/record-frames.js
//   ?static        the held final frame
//   ?day=Monday    any day of the week (default: today)
import React, { useEffect, useMemo, useRef } from "react";
import "../Stylesheets/RhWrapped.css";

// Richmond Hill (King Rd) classes, as rhbjj.ca lists them.
const SCHEDULE = {
  Monday: [
    ["Muay Thai", 18, 19],
    ["BJJ NoGi", 19, 20],
  ],
  Tuesday: [
    ["Kids BJJ", 18, 19],
    ["Teens BJJ", 19, 20],
    ["BJJ Gi", 20, 21],
  ],
  Wednesday: [
    ["Muay Thai", 18, 19],
    ["BJJ NoGi", 19, 20],
  ],
  Thursday: [
    ["Kids BJJ", 18, 19],
    ["Teens BJJ", 19, 20],
    ["BJJ Gi", 20, 21],
  ],
  Friday: [
    ["Kids Muay Thai", 17, 18],
    ["Muay Thai", 18, 19],
    ["BJJ NoGi", 19, 20],
  ],
  Saturday: [
    ["Kids BJJ", 11.5, 12.5],
    ["Wrestling", 12.5, 13.5],
  ],
};

const clock = (h) => {
  const hr = Math.floor(h);
  const m = Math.round((h - hr) * 60);
  return { t: `${((hr + 11) % 12) + 1}:${String(m).padStart(2, "0")}`, ap: hr < 12 ? "AM" : "PM" };
};
const span = (a, b) => {
  const x = clock(a);
  const y = clock(b);
  return x.ap === y.ap ? `${x.t} – ${y.t} ${y.ap}` : `${x.t} ${x.ap} – ${y.t} ${y.ap}`;
};

const W = 360;
const H = 640;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
// a pop with a little overshoot
const pop = (t) => {
  const x = clamp(t, 0, 1);
  return 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2);
};
const f1 = (n) => n.toFixed(1);
const f3 = (n) => (Math.round(n * 1000) / 1000).toString();

/* ---------------------------------------------------------------- slides */

// each class slide gets its own colour story and its own toy
const LOOKS = [
  { bg: "#ff2d75", bg2: "#ff8a3d", ink: "#120414", chip: "#120414", chipInk: "#ffffff", label: "Your top class", toy: "record" },
  { bg: "#c6f432", bg2: "#7ee8a0", ink: "#0b1a06", chip: "#0b1a06", chipInk: "#c6f432", label: "On repeat", toy: "rings" },
  { bg: "#3ad2ff", bg2: "#7a5cff", ink: "#05122a", chip: "#05122a", chipInk: "#3ad2ff", label: "Your encore", toy: "record" },
];

const INTRO = 1.6;
const SLIDE = 1.9;
const WIPE = 0.38;
const SUMMARY_HOLD = 2.8;

function plan(n) {
  const starts = [0];
  starts.push(INTRO);
  for (let i = 1; i < n; i++) starts.push(INTRO + i * SLIDE);
  const summary = INTRO + n * SLIDE;
  starts.push(summary);
  return { starts, summary, end: summary + SUMMARY_HOLD };
}

// split a class name into one or two stacked words for the giant type
const stack = (name) => {
  const up = name.toUpperCase();
  const words = up.split(" ");
  if (words.length <= 1) return [up];
  if (words.length === 2) return words;
  return [words.slice(0, -1).join(" "), words[words.length - 1]];
};

export default function RhWrapped({ mode = "animated", day: dayProp }) {
  const q = useMemo(() => new URLSearchParams(window.location.search), []);
  const renderMode = q.has("render");
  const still =
    mode === "static" || q.has("static") || (!!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const day = useMemo(() => {
    const want = q.get("day") || dayProp;
    if (want && SCHEDULE[want]) return want;
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return SCHEDULE[today] ? today : "Monday";
  }, [q, dayProp]);
  const classes = SCHEDULE[day];
  const n = classes.length;
  const P = useMemo(() => plan(n), [n]);
  const slides = n + 2;

  const R = useRef({});
  const ref = (k) => (el) => {
    R.current[k] = el;
  };

  useEffect(() => {
    const r = R.current;
    const set = (k, a, v) => r[k] && r[k].setAttribute(a, v);

    function render(ms) {
      const t = ms / 1000;

      /* the story progress bars */
      for (let s = 0; s < slides; s++) {
        const a = P.starts[s];
        const b = s + 1 < slides ? P.starts[s + 1] : P.end - 0.6;
        set(`prog${s}`, "width", f1(clamp((t - a) / (b - a), 0, 1) * progW));
      }

      /* each slide comes in on a circle wipe from its own corner */
      for (let s = 1; s < slides; s++) {
        const k = easeOut((t - P.starts[s]) / WIPE);
        set(`wipe${s}`, "r", f1(k * 760));
        set(`slide${s}`, "opacity", t >= P.starts[s] ? 1 : 0);
      }

      /* intro: blobs turning, the words popping in one by one */
      {
        const u = t;
        set("blobA", "transform", `rotate(${f1(u * 40)} 90 160) translate(${f1(Math.sin(u * 1.3) * 10)} 0)`);
        set("blobB", "transform", `rotate(${f1(-u * 30)} 280 520) scale(${f3(1 + 0.06 * Math.sin(u * 2))})`);
        set("blobC", "transform", `rotate(${f1(u * 60)} 300 140)`);
        [0, 1, 2].forEach((w) => {
          const k = pop((u - 0.2 - w * 0.22) / 0.4);
          set(`iw${w}`, "opacity", u > 0.2 + w * 0.22 ? 1 : 0);
          set(`iw${w}`, "transform", `translate(180 ${INTRO_Y[w]}) scale(${f3(k)}) translate(-180 ${-INTRO_Y[w]})`);
        });
      }

      /* the class slides */
      for (let i = 0; i < n; i++) {
        const s0 = P.starts[i + 1];
        const u = t - s0;
        const L = LOOKS[i % LOOKS.length];
        set(`lab${i}`, "opacity", f1(smooth((u - 0.2) / 0.25)));
        set(`lab${i}`, "transform", `translate(0 ${f1(lerp(10, 0, easeOut((u - 0.2) / 0.3)))})`);
        stack(classes[i][0]).forEach((_, w) => {
          const k = pop((u - 0.38 - w * 0.12) / 0.4);
          const y = BIG_Y[w];
          set(`big${i}_${w}`, "opacity", u > 0.38 + w * 0.12 ? 1 : 0);
          set(`big${i}_${w}`, "transform", `translate(36 ${y}) scale(${f3(k)}) translate(-36 ${-y})`);
        });
        const ck = pop((u - 0.75) / 0.35);
        set(`chip${i}`, "opacity", u > 0.75 ? 1 : 0);
        set(`chip${i}`, "transform", `translate(36 ${CHIP_Y}) scale(${f3(ck)}) translate(-36 ${-CHIP_Y})`);
        // the toys
        if (L.toy === "record") {
          set(`rec${i}`, "transform", `translate(${f1(lerp(420, 246, easeOut((u - 0.3) / 0.5)))} 486) rotate(${f1(u * 200)})`);
          for (let b = 0; b < 7; b++) {
            const h = 14 + 46 * Math.abs(Math.sin(u * (5 + b * 0.9) + b * 1.7)) * smooth((u - 0.5) / 0.3);
            set(`eq${i}_${b}`, "y", f1(560 - h));
            set(`eq${i}_${b}`, "height", f1(h));
          }
        } else {
          for (let k2 = 0; k2 < 4; k2++) {
            const ph = ((u * 0.9 + k2 * 0.25) % 1 + 1) % 1;
            set(`ring${i}_${k2}`, "r", f1(20 + ph * 130));
            set(`ring${i}_${k2}`, "opacity", f1(u > 0.4 ? (1 - ph) * 0.9 : 0));
          }
          set(`star${i}`, "transform", `translate(250 480) rotate(${f1(u * 90)}) scale(${f3(pop((u - 0.45) / 0.4))})`);
        }
      }

      /* the summary card */
      {
        const u = t - P.summary;
        const ck = pop((u - 0.1) / 0.45);
        set("card", "transform", `translate(180 330) scale(${f3(ck)}) rotate(${f1(lerp(-6, 0, easeOut(u / 0.5)))}) translate(-180 -330)`);
        set("card", "opacity", u > 0.1 ? 1 : 0);
        for (let i = 0; i < n; i++) {
          const k = easeOut((u - 0.45 - i * 0.15) / 0.35);
          set(`srow${i}`, "opacity", f1(clamp(k * 1.4, 0, 1)));
          set(`srow${i}`, "transform", `translate(${f1(lerp(30, 0, k))} 0)`);
        }
        set("cardfoot", "opacity", f1(smooth((u - 0.45 - n * 0.15) / 0.3)));
        set("sumblob", "transform", `rotate(${f1(u * 25)} 180 330)`);
      }
    }

    const endMs = Math.round(P.end * 1000);
    if (renderMode) {
      window.__renderAt = render;
      window.__rhWrapEnd = endMs;
      render(0);
      const fonts = document.fonts
        ? Promise.all([document.fonts.load('400 60px "Archivo Black"'), document.fonts.load('800 15px "Inter"'), document.fonts.load('700 13px "Inter"')]).then(
            () => document.fonts.ready
          )
        : Promise.resolve();
      fonts.then(() => {
        render(0);
        window.__ready = true;
      });
      return undefined;
    }
    if (still) {
      render(endMs);
      return undefined;
    }
    let raf;
    const t0 = performance.now();
    const step = (now) => {
      const ms = Math.min(now - t0, endMs);
      render(ms);
      if (ms < endMs) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [renderMode, still, classes, n, P, slides]);

  // the summary card sizes itself to the classes and sits centred
  const lastRowY = 330 + (n - 1) * 58;
  const cardBot = lastRowY + 96;
  const cardShift = Math.round(330 - (126 + cardBot) / 2);
  const progGap = 4;
  const progW = (W - 40 - progGap * (slides - 1)) / slides;
  // where each slide's wipe grows from
  const WIPE_FROM = [
    [180, 320],
    [330, 60],
    [30, 600],
    [330, 600],
    [30, 60],
  ];

  return (
    <div className={`wr${still ? " is-static" : ""}`}>
      <svg className="wr-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          {Array.from({ length: slides }, (_, s) => (
            <clipPath key={s} id={`wr-wipe${s}`}>
              <circle ref={ref(`wipe${s}`)} cx={WIPE_FROM[s % WIPE_FROM.length][0]} cy={WIPE_FROM[s % WIPE_FROM.length][1]} r={s ? 0 : 900} />
            </clipPath>
          ))}
          {LOOKS.map((L, i) => (
            <linearGradient key={i} id={`wr-bg${i}`} x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0" stopColor={L.bg} />
              <stop offset="1" stopColor={L.bg2} />
            </linearGradient>
          ))}
          <linearGradient id="wr-intro" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0" stopColor="#2a0a5e" />
            <stop offset="1" stopColor="#5a14a8" />
          </linearGradient>
          <linearGradient id="wr-cardedge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff2d75" />
            <stop offset="0.5" stopColor="#c6f432" />
            <stop offset="1" stopColor="#3ad2ff" />
          </linearGradient>
          <radialGradient id="wr-vinyl" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#2a2a2e" />
            <stop offset="1" stopColor="#0a0a0c" />
          </radialGradient>
        </defs>

        {/* ---- intro ---- */}
        <g ref={ref("slide0")}>
          <rect width={W} height={H} fill="url(#wr-intro)" />
          <g ref={ref("blobA")}>
            <path d="M40,90 C90,40 170,70 160,140 C150,210 70,230 40,190 C10,150 0,130 40,90 Z" fill="#c6f432" />
          </g>
          <g ref={ref("blobB")}>
            <path d="M220,450 C280,410 360,450 350,530 C340,600 260,620 220,580 C180,540 170,490 220,450 Z" fill="#ff2d75" />
          </g>
          <g ref={ref("blobC")}>
            {Array.from({ length: 12 }, (_, k) => {
              const a = (k / 12) * Math.PI * 2;
              return <path key={k} d={`M300,140 L${f1(300 + Math.cos(a) * 34)},${f1(140 + Math.sin(a) * 34)}`} stroke="#3ad2ff" strokeWidth="6" strokeLinecap="round" />;
            })}
          </g>
          {["Your", day, "Playlist."].map((w, k) => (
            <text key={k} ref={ref(`iw${k}`)} x="180" y={INTRO_Y[k]} textAnchor="middle" className={`wr-intro${k === 2 ? " wr-intro-hot" : ""}`} opacity="0">
              {w}
            </text>
          ))}
        </g>

        {/* ---- a slide per class ---- */}
        {classes.map(([name, a, b], i) => {
          const L = LOOKS[i % LOOKS.length];
          const words = stack(name);
          return (
            <g key={i} ref={ref(`slide${i + 1}`)} opacity="0" clipPath={`url(#wr-wipe${i + 1})`}>
              <rect width={W} height={H} fill={`url(#wr-bg${i % LOOKS.length})`} />
              <text ref={ref(`lab${i}`)} x="36" y="150" className="wr-label" style={{ fill: L.ink }} opacity="0">
                {L.label}
              </text>
              {words.map((w, k) => (
                <text key={k} ref={ref(`big${i}_${k}`)} x="36" y={BIG_Y[k]} className="wr-big" style={{ fill: L.ink }} textLength={w.length > 6 ? 288 : undefined} lengthAdjust="spacingAndGlyphs" opacity="0">
                  {w}
                </text>
              ))}
              <g ref={ref(`chip${i}`)} opacity="0">
                <rect x="36" y={CHIP_Y - 24} width="190" height="38" rx="19" fill={L.chip} />
                <text x="131" y={CHIP_Y + 1} textAnchor="middle" className="wr-chip" style={{ fill: L.chipInk }}>
                  {span(a, b)}
                </text>
              </g>
              {L.toy === "record" ? (
                <>
                  <g ref={ref(`rec${i}`)}>
                    <circle r="78" fill="url(#wr-vinyl)" />
                    {Array.from({ length: 9 }, (_, k) => (
                      <circle key={k} r={30 + k * 5.4} fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1" />
                    ))}
                    <path d="M-60,-40 A72,72 0 0,1 -20,-70" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <circle r="26" fill="#e4002b" />
                    <text y="4" textAnchor="middle" className="wr-reclabel">
                      RHBJJ
                    </text>
                    <circle r="3" fill="#0a0a0c" />
                  </g>
                  {Array.from({ length: 7 }, (_, k) => (
                    <rect key={k} ref={ref(`eq${i}_${k}`)} x={40 + k * 15} y="546" width="10" height="14" rx="3" fill={L.ink} />
                  ))}
                </>
              ) : (
                <>
                  {Array.from({ length: 4 }, (_, k) => (
                    <circle key={k} ref={ref(`ring${i}_${k}`)} cx="250" cy="480" r="20" fill="none" stroke={L.ink} strokeWidth="5" opacity="0" />
                  ))}
                  <g ref={ref(`star${i}`)}>
                    <path
                      d={(() => {
                        const pts = [];
                        for (let k = 0; k < 16; k++) {
                          const rr = k % 2 ? 16 : 36;
                          const ang = (k / 16) * Math.PI * 2;
                          pts.push(`${f1(Math.cos(ang) * rr)},${f1(Math.sin(ang) * rr)}`);
                        }
                        return `M${pts.join(" L")} Z`;
                      })()}
                      fill={L.ink}
                    />
                  </g>
                </>
              )}
            </g>
          );
        })}

        {/* ---- the summary card ---- */}
        <g ref={ref(`slide${n + 1}`)} opacity="0" clipPath={`url(#wr-wipe${n + 1})`}>
          <rect width={W} height={H} fill="#121014" />
          <g ref={ref("sumblob")}>
            <path d="M60,120 C140,60 260,90 300,170 C340,250 300,330 240,330 C180,330 90,300 60,240 C30,180 20,150 60,120 Z" fill="#5a14a8" opacity="0.55" />
            <path d="M80,460 C140,420 250,430 290,500 C320,560 260,600 200,590 C120,580 60,540 80,460 Z" fill="#ff2d75" opacity="0.45" />
          </g>
          <g transform={`translate(0 ${cardShift})`}>
          <g ref={ref("card")} opacity="0">
            <rect x="34" y="126" width="292" height={cardBot - 126} rx="22" fill="url(#wr-cardedge)" />
            <rect x="40" y="132" width="280" height={cardBot - 138} rx="18" fill="#181520" />
            <text x="62" y="182" className="wr-cardkick">
              RICHMOND HILL JIU-JITSU
            </text>
            <text x="62" y="222" className="wr-cardtitle">
              My {day}
            </text>
            <text x="62" y="258" className="wr-cardtitle wr-intro-hot">
              Playlist
            </text>
            <text x="62" y="300" className="wr-cardkick">
              TOP CLASSES
            </text>
            {classes.map(([name, a, b], i) => {
              const y = 330 + i * 58;
              const L = LOOKS[i % LOOKS.length];
              return (
                <g key={i} ref={ref(`srow${i}`)} opacity="0">
                  <rect x="62" y={y - 16} width="36" height="36" rx="8" fill={L.bg} />
                  <text x="80" y={y + 9} textAnchor="middle" className="wr-rank" style={{ fill: L.ink }}>
                    {i + 1}
                  </text>
                  <text x="112" y={y + 2} className="wr-rowname">
                    {name}
                  </text>
                  <text x="112" y={y + 19} className="wr-rowtime">
                    {span(a, b)}
                  </text>
                </g>
              );
            })}
            <g ref={ref("cardfoot")} opacity="0">
              <path d={`M62,${lastRowY + 48} L298,${lastRowY + 48}`} stroke="#ffffff" strokeOpacity="0.12" />
              <text x="62" y={lastRowY + 72} className="wr-site">
                RHBJJ.CA
              </text>
            </g>
          </g>
          </g>
        </g>

        {/* ---- story progress bars ---- */}
        {Array.from({ length: slides }, (_, s) => (
          <g key={s}>
            <rect x={20 + s * (progW + progGap)} y="24" width={progW} height="3" rx="1.5" fill="#ffffff" opacity="0.35" />
            <rect ref={ref(`prog${s}`)} x={20 + s * (progW + progGap)} y="24" width="0" height="3" rx="1.5" fill="#ffffff" />
          </g>
        ))}
      </svg>
    </div>
  );
}

const INTRO_Y = [262, 330, 398];
const BIG_Y = [236, 304];
const CHIP_Y = 362;
