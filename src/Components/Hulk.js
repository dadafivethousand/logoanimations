// Hulk.js — the mark hulks out, and the screen takes the hit.
//
// Genre, not franchise: gamma green and torn purple, veins and broken glass —
// no studio marks, no character likeness, no film typeface.
//
// THE CONCEPT IS THE TRANSFORMATION, not a green background. A Hulk theme that
// only recolours things is a colour swap; what makes it Hulk is that something
// small and contained SWELLS, veins come up under the skin, and then it lets
// go. So the spot is:
//
//   p1  cold — the mark small, desaturated, holding still
//   p2  the change — a double-thump heartbeat, colour flooding back in, veins
//       drawing up over his skin, gamma light building behind him
//   p3  the hit — he slams to full size, the frame shakes, and a shockwave
//       runs out off him
//   p4  the name, and he keeps breathing
//
// One property carries the whole transformation: `filter: saturate()` on the
// stage. Everything underneath is painted at full gamma from the start and the
// desaturation is simply lifted — far better than cross-fading two colourways,
// which reads as a dissolve rather than a change happening TO him.
//
// THE NINJA IS THE HULK, repainted through the region masks useLogo derives
// from the artwork's own tones:
//
//   --logo-dark    hood and "NINJAS"  → gamma skin, and what the veins run over
//   --logo-light   the band at his eyes → blown out, the brightest thing here
//   --logo-accent  "CODE"             → a deeper, cooler green
//
// The purple is in the LIGHT, not on him: a violet key from the upper left
// against gamma bounce from below right. Green and purple is the whole Hulk
// colour story, and doing it with lighting rather than paint is what keeps the
// lockup reading as the logo.
import React from "react";
import "../Stylesheets/Hulk.css";
import usePhases from "../Utils/usePhases";
import useLogo from "../Utils/useLogo";

// p1 cold · p2 the change · p3 the hit · p4 the name
const CUES = [200, 900, 2100, 2700];

/* Veins. Generated once and hardcoded — veins that reshuffle between takes
   would mean two recordings of the same ad never match. Walked outward from
   the head and the two ends of the lockup with a bounce off the box bounds, so
   none of them wander off the mark and get thrown away by the mask. */
const VEINS = [
  "M300.0 30.0 C296.4 33.0,285.3 41.7,278.6 48.0 C272.0 54.3,265.2 61.2,260.2 68.0 C255.1 74.8,253.4 83.1,248.5 89.0 C243.6 94.9,234.8 97.8,230.6 103.3 C226.5 108.9,227.0 117.3,223.7 122.2 C220.3 127.1,215.3 130.5,210.4 132.7 C205.4 134.9,199.0 136.0,193.9 135.6 C188.8 135.2,184.6 131.5,179.9 130.5 C175.3 129.4,168.3 129.5,166.0 129.3",
  "M210.4 132.7 C209.9 135.1,207.6 142.5,207.5 147.2 C207.3 152.0,209.4 156.8,209.5 161.1 C209.5 165.4,208.7 169.5,207.8 173.1 C207.0 176.7,206.2 180.1,204.4 182.9 C202.6 185.6,198.3 188.3,197.1 189.4",
  "M300.0 30.0 C302.1 33.2,308.9 43.2,312.5 49.4 C316.0 55.7,319.7 61.2,321.2 67.4 C322.8 73.7,321.0 80.9,321.7 86.8 C322.5 92.7,324.9 97.8,325.8 103.0 C326.6 108.2,326.8 113.2,326.7 118.0 C326.5 122.8,325.3 127.4,325.0 131.7 C324.7 135.9,325.0 141.3,325.0 143.2",
  "M321.7 86.8 C324.2 88.0,331.9 93.3,336.7 94.3 C341.6 95.3,346.4 93.4,350.8 92.9 C355.1 92.3,359.0 90.9,362.9 91.1 C366.8 91.2,370.7 92.4,374.2 93.6 C377.7 94.9,382.3 97.9,383.9 98.7",
  "M300.0 45.0 C305.0 48.6,319.9 60.0,329.9 66.6 C339.8 73.1,349.6 80.9,359.9 84.2 C370.3 87.5,382.1 85.3,391.9 86.6 C401.7 87.8,411.2 88.3,418.8 91.6 C426.4 95.0,431.3 102.3,437.5 106.6 C443.8 110.9,453.2 115.7,456.3 117.5",
  "M437.5 106.6 C439.8 108.2,446.4 113.6,451.3 116.1 C456.2 118.6,461.5 120.2,466.7 121.5 C471.9 122.7,477.3 123.2,482.5 123.5 C487.8 123.8,493.1 122.6,498.1 123.2 C503.0 123.9,509.9 126.7,512.3 127.4",
  "M300.0 45.0 C296.6 48.2,286.0 58.0,279.8 64.0 C273.6 70.1,269.2 77.5,262.7 81.3 C256.3 85.1,248.1 85.6,241.1 86.9 C234.1 88.3,226.8 87.4,220.7 89.4 C214.7 91.3,210.4 96.3,204.9 98.7 C199.5 101.1,193.4 102.0,188.0 103.8 C182.5 105.6,174.8 108.6,172.2 109.6",
  "M241.1 86.9 C238.4 84.8,230.3 78.7,225.4 74.2 C220.4 69.7,215.4 65.0,211.4 60.2 C207.3 55.3,203.7 50.2,200.8 45.3 C198.0 40.5,195.3 33.4,194.2 31.0",
  "M300.0 60.0 C296.9 57.7,287.8 49.5,281.4 46.1 C275.0 42.7,267.3 43.0,261.6 39.4 C255.9 35.8,252.3 28.7,247.3 24.6 C242.4 20.6,237.0 17.7,232.1 15.0 C227.2 12.3,222.6 9.5,217.8 8.4 C212.9 7.2,205.3 8.1,202.8 8.1",
  "M217.8 8.4 C215.7 7.6,209.3 2.7,205.1 4.0 C200.9 5.3,195.7 11.8,192.6 16.3 C189.4 20.7,186.9 26.0,186.1 30.9 C185.3 35.8,187.3 43.0,187.5 45.4",
  "M140.0 150.0 C136.4 151.5,125.1 156.8,118.2 158.8 C111.4 160.7,104.8 161.7,98.7 161.8 C92.6 161.9,86.7 161.1,81.6 159.6 C76.5 158.0,72.3 154.5,67.9 152.7 C63.6 150.9,58.9 150.5,55.4 148.6 C51.8 146.6,48.9 143.8,46.7 140.9 C44.5 138.0,44.2 134.0,42.2 131.3 C40.2 128.6,37.1 126.7,34.9 124.6 C32.7 122.4,29.9 119.6,28.9 118.7",
  "M150.0 160.0 C154.2 161.1,168.0 162.5,175.4 166.4 C182.8 170.2,187.5 179.7,194.3 183.2 C201.2 186.7,209.1 186.9,216.4 187.5 C223.7 188.1,230.9 187.0,238.0 187.0 C245.1 187.0,252.4 188.1,259.0 187.6 C265.6 187.2,271.7 184.7,277.8 184.3 C283.8 184.0,292.3 185.3,295.2 185.5",
  "M216.4 187.5 C218.6 189.0,225.2 194.5,229.7 196.5 C234.1 198.4,239.2 197.4,243.1 199.0 C247.0 200.5,250.6 203.1,253.2 205.8 C255.7 208.5,257.4 213.7,258.2 215.3",
  "M470.0 150.0 C471.0 154.3,475.7 167.3,476.0 175.7 C476.2 184.0,474.4 192.7,471.3 200.1 C468.2 207.5,462.7 215.0,457.1 219.8 C451.5 224.6,444.3 227.2,437.7 228.9 C431.0 230.6,423.5 229.1,417.2 229.9 C410.9 230.8,402.8 233.2,399.9 233.8",
  "M455.0 165.0 C451.5 166.7,440.2 171.2,433.9 175.5 C427.6 179.8,421.6 185.5,417.0 190.7 C412.4 196.0,410.6 202.5,406.2 207.0 C401.8 211.5,395.0 214.0,390.4 218.0 C385.8 221.9,382.5 226.6,378.6 230.7 C374.6 234.7,368.7 240.3,366.7 242.2",
  "M417.0 190.7 C414.6 189.1,406.8 184.5,402.5 181.0 C398.3 177.5,395.6 172.8,391.4 169.8 C387.3 166.9,380.1 164.3,377.8 163.2",
  "M240.0 120.0 C240.5 124.0,241.6 136.8,242.8 144.2 C243.9 151.6,245.8 157.8,246.9 164.6 C248.1 171.4,250.0 178.4,249.6 184.9 C249.2 191.4,247.6 198.1,244.6 203.3 C241.6 208.5,236.0 212.3,231.6 216.0 C227.3 219.8,220.5 224.1,218.3 225.7",
  "M246.9 164.6 C249.0 167.4,256.9 175.4,259.3 181.4 C261.7 187.4,260.4 194.5,261.2 200.5 C261.9 206.6,262.4 212.7,263.9 217.8 C265.3 222.9,268.3 226.7,270.0 231.1 C271.7 235.6,273.3 242.1,273.9 244.3",
  "M360.0 120.0 C358.4 125.7,355.6 144.5,350.4 154.1 C345.1 163.6,334.7 169.5,328.4 177.1 C322.1 184.8,318.6 193.4,312.7 200.0 C306.8 206.6,298.0 210.2,293.1 216.8 C288.2 223.4,287.0 233.0,283.3 239.6 C279.5 246.1,272.8 253.3,270.7 256.0",
  "M293.1 216.8 C295.3 218.3,301.7 224.2,306.4 226.1 C311.0 227.9,316.4 228.2,321.1 227.8 C325.9 227.5,330.9 226.1,334.8 223.8 C338.8 221.5,341.9 217.6,344.5 214.0 C347.2 210.4,349.8 204.4,350.9 202.5",
  "M300.0 95.0 C306.0 93.7,325.6 91.7,336.1 87.4 C346.7 83.0,356.7 76.5,363.4 68.9 C370.1 61.3,374.1 50.8,376.1 41.6 C378.1 32.4,373.5 20.0,375.3 13.8 C377.1 7.5,383.9 2.0,386.9 4.0 C389.9 6.0,393.1 18.9,393.4 25.8 C393.6 32.7,389.2 42.2,388.4 45.5",
  "M363.4 68.9 C366.4 67.0,375.6 61.1,381.2 57.2 C386.7 53.3,392.6 49.8,396.9 45.6 C401.3 41.4,405.4 34.2,407.1 31.9",
  "M300.0 95.0 C295.7 94.0,282.9 90.5,274.4 88.7 C265.8 86.9,256.7 86.8,249.0 84.1 C241.2 81.5,235.1 75.7,227.8 72.8 C220.4 69.8,212.1 66.6,205.0 66.3 C197.9 66.1,191.5 69.6,185.3 71.4 C179.1 73.2,170.6 76.3,167.7 77.2",
  "M227.8 72.8 C225.8 71.2,220.0 66.0,216.1 63.6 C212.1 61.2,208.0 59.5,204.1 58.4 C200.2 57.4,195.9 58.5,192.6 57.3 C189.2 56.0,185.4 52.1,184.0 51.0",
  "M90.0 190.0 C91.5 195.1,98.4 210.7,99.0 220.8 C99.6 230.8,95.3 244.1,93.5 250.0 C91.8 255.9,91.8 258.2,88.7 256.0 C85.6 253.8,79.4 242.6,74.9 237.0 C70.3 231.3,64.3 227.2,61.4 221.9 C58.5 216.6,58.8 210.5,57.4 205.3 C56.0 200.2,54.7 195.6,53.0 191.0 C51.4 186.4,48.1 182.1,47.4 177.7 C46.7 173.4,48.6 167.0,48.9 164.8",
  "M53.0 191.0 C53.0 193.8,53.7 202.8,53.0 208.0 C52.2 213.1,49.7 217.4,48.8 222.1 C47.9 226.8,48.1 231.9,47.4 236.3 C46.7 240.6,45.1 246.3,44.6 248.3",
  "M510.0 190.0 C506.0 193.0,493.9 204.1,485.7 208.2 C477.5 212.2,469.0 212.7,460.8 214.2 C452.6 215.8,443.7 215.6,436.4 217.4 C429.0 219.3,422.7 222.9,416.5 225.2 C410.3 227.5,404.5 229.2,399.2 231.3 C393.9 233.3,389.6 236.3,384.8 237.5 C380.0 238.8,374.5 237.2,370.4 238.6 C366.3 239.9,361.8 244.5,360.1 245.7",
  "M416.5 225.2 C416.2 228.8,413.5 241.5,414.6 246.6 C415.8 251.7,420.7 257.0,423.4 256.0 C426.0 255.0,429.0 245.6,430.5 240.4 C432.0 235.3,432.1 227.8,432.4 225.3",
  "M300.0 200.0 C297.5 204.8,287.3 219.5,285.2 228.9 C283.1 238.2,288.8 255.3,287.2 256.0 C285.6 256.7,277.5 240.7,275.7 233.2 C273.9 225.8,276.0 218.4,276.4 211.3 C276.7 204.3,276.0 197.1,277.8 191.0 C279.6 184.9,285.2 180.4,287.2 174.8 C289.2 169.2,289.4 160.4,289.8 157.5",
  "M200.0 60.0 C198.6 65.4,192.5 81.4,191.7 92.1 C190.9 102.9,191.8 115.5,195.1 124.7 C198.3 133.9,205.8 140.5,211.0 147.2 C216.3 153.9,223.2 158.1,226.6 164.8 C230.1 171.5,229.2 180.2,231.8 187.2 C234.5 194.3,238.4 200.8,242.4 206.9 C246.3 213.1,250.3 219.4,255.5 224.0 C260.8 228.5,268.2 231.1,274.0 234.1 C279.9 237.1,288.0 240.7,290.7 242.0",
  "M231.8 187.2 C231.2 190.4,229.2 200.4,227.9 206.4 C226.6 212.4,224.4 218.1,223.9 223.3 C223.4 228.6,225.6 233.4,224.8 238.0 C223.9 242.5,219.8 248.4,218.8 250.5",
  "M400.0 60.0 C401.5 63.4,407.1 73.6,409.1 80.5 C411.1 87.3,410.0 95.1,412.0 101.2 C414.0 107.3,418.6 112.0,421.2 117.1 C423.7 122.2,425.8 126.9,427.4 131.9 C429.0 136.9,429.0 142.5,430.9 146.8 C432.7 151.2,435.4 154.8,438.3 157.8 C441.2 160.9,444.9 163.6,448.3 165.3 C451.7 167.0,456.9 167.5,458.6 168.0",
  "M448.3 165.3 C451.5 164.9,461.9 162.5,467.8 162.8 C473.7 163.2,478.7 165.5,483.8 167.3 C488.8 169.2,495.8 172.8,498.2 173.9",
];

/* The burst thrown off by the hit: [angle, distance, size, delay]. Hand-placed
   so every take composes the same. */
/* Motes drifting in the gamma light: [left %, size, drift, delay, duration].
   Air with something in it reads as a lit volume; empty air reads as a
   backdrop. */
/* [left %, size, drift, delay, duration, resting height]. The last value is
   only for the still: with animation off a mote would sit at its start point
   below the frame and the poster would have no dust in it at all. */
const MOTES = [
  [6, 0.9, 3, 0, 7200, 22], [14, 0.5, -2, 1400, 8600, 61], [23, 1.2, 4, 600, 6400, 38],
  [31, 0.6, -3, 2600, 9000, 78], [39, 0.8, 2, 3400, 7600, 14], [47, 0.5, -4, 900, 8200, 55],
  [55, 1.1, 3, 4200, 6800, 84], [63, 0.7, -2, 1900, 9400, 31], [71, 0.9, 5, 3000, 7000, 68],
  [79, 0.6, -3, 5000, 8800, 45], [87, 1.0, 2, 2200, 7400, 26], [94, 0.7, -4, 4000, 9200, 72],
];

const SPARKS = Array.from({ length: 26 }, (_, i) => {
  const a = (i / 26) * 360 + (i % 3) * 4.5;
  const d = 34 + ((i * 37) % 26);
  const s = 0.5 + ((i * 13) % 9) / 9;
  return [a, d, s, (i % 7) * 26];
});

export default function Hulk({
  mode = "animated",
  caption = "WOODBRIDGE",
  loopAt = 8200,
}) {
  const { logoVar, ready } = useLogo();
  const { phase, run, isStatic } = usePhases(CUES, { mode, loopAt, enabled: ready });

  if (!ready) return <div className="hk hk-p0" aria-hidden />;

  return (
    <div className={`hk hk-p${phase} ${isStatic ? "is-static" : ""}`} style={logoVar} key={run}>
      <HulkDefs />

      {/* ---- the space he is in: violet key, gamma bounce ---- */}
      <div className="hk-void" aria-hidden />
      <div className="hk-rays" aria-hidden />
      <div className="hk-bloom" aria-hidden />
      <div className="hk-pool" aria-hidden />
      <div className="hk-motes" aria-hidden>
        {MOTES.map(([l, sc, dx, dl, du, y], i) => (
          <span
            key={i}
            style={{
              left: `${l}%`,
              "--sc": sc,
              "--dx": `${dx}vw`,
              "--dl": `${dl}ms`,
              "--du": `${du}ms`,
              "--y": `${y}vh`,
            }}
          />
        ))}
      </div>

      <div className="hk-shake">
        <div className="hk-stage">
          <div className="hk-markwrap">
            <div className="hk-markbox">
              {/* the gamma pushing out from behind him, in his own shape */}
              <div className="hk-layer hk-halo" aria-hidden />

              <div className="hk-mark">
                <div className="hk-region hk-skin" aria-hidden />
                <div className="hk-region hk-code" aria-hidden />
                <div className="hk-region hk-eyes" aria-hidden />
                <div className="hk-region hk-form" aria-hidden />

                {/* THE BROW. This is the single element that turns a green
                    ninja into a hulk — without a heavy ridge over the eyes he
                    is just the mark in a different colour. Drawn as a shadow
                    rather than as cartoon eyebrows, and pinned to the eye
                    band's MEASURED bounds (left 39.5%, top 22.1%, w 21.1%,
                    h 10.7% of the mark box), not eyeballed. */}
                <svg className="hk-brow" viewBox="0 0 100 62" preserveAspectRatio="none" aria-hidden>
                  {/* sloping down toward the middle — that direction is the
                      whole difference between angry and surprised */}
                  <path d="M1 13 L47 41 L47 60 L1 32 Z" />
                  <path d="M99 13 L53 41 L53 60 L99 32 Z" />
                </svg>

                {/* veins, masked to his skin so they never cross "CODE" or the
                    band at his eyes — those are not skin */}
                <svg
                  className="hk-veins"
                  viewBox="0 0 600 260"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <g className="hk-vein-deep">
                    {VEINS.map((d, i) => (
                      <path d={d} pathLength="100" style={{ "--i": i }} key={i} />
                    ))}
                  </g>
                  <g className="hk-vein-lit">
                    {VEINS.map((d, i) => (
                      <path d={d} pathLength="100" style={{ "--i": i }} key={i} />
                    ))}
                  </g>
                </svg>

                {/* mottling and a wet specular — gamma skin is blotched and it
                    is never matte */}
                <div className="hk-layer hk-mottle" aria-hidden />
                <div className="hk-layer hk-sheen" aria-hidden />
              </div>
            </div>

            <div className="hk-type">
              <span className="hk-caption">{caption}</span>
            </div>
          </div>
        </div>
      </div>

      {/* the hit itself: one hard ring running out, and what it throws */}
      <div className="hk-wave" aria-hidden />
      <div className="hk-sparks" aria-hidden>
        {SPARKS.map(([a, d, sc, dl], i) => (
          <span key={i} style={{ "--a": `${a}deg`, "--d": `${d}vw`, "--sc": sc, "--dl": `${dl}ms` }} />
        ))}
      </div>

      <div className="hk-flash" aria-hidden />
      <div className="hk-grain" aria-hidden />
      <div className="hk-vignette" aria-hidden />
    </div>
  );
}

function HulkDefs() {
  return (
    <svg className="hk-defs" aria-hidden focusable="false">
      <defs>
        {/* nothing under skin runs in a clean line */}
        <filter id="hk-vein" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="17" result="n" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="4.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
