import { useEffect, useState } from "react";

/**
 * Tiny phase state machine shared by every logo animation.
 *
 * Pass the cue times in ms measured from mount, e.g. [300, 900, 1800].
 * `phase` starts at 0 and steps to 1, 2, 3... at each cue. Put the value on
 * the root element as a class (`la-p0`..`la-p3`) and key all the CSS off it —
 * JS only advances phases, CSS does the animating.
 *
 * `loopAt` (ms) restarts the whole sequence, which is handy while
 * screen-recording: you get take after take without touching the page.
 */
export default function usePhases(cues = [], loopAt = null) {
  const [phase, setPhase] = useState(0);
  const [run, setRun] = useState(0);

  // cues is usually a fresh array literal at the call site; depend on its
  // serialised form so the machine doesn't restart on every render.
  const cueKey = cues.join(",");

  useEffect(() => {
    setPhase(0);
    const timers = cueKey
      .split(",")
      .filter(Boolean)
      .map((at, i) => setTimeout(() => setPhase(i + 1), Number(at)));

    if (loopAt) {
      timers.push(setTimeout(() => setRun((r) => r + 1), loopAt));
    }
    return () => timers.forEach(clearTimeout);
  }, [cueKey, loopAt, run]);

  return { phase, run };
}
