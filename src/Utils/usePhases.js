import { useEffect, useState } from "react";

/**
 * Cue-driven phase machine shared by every theme.
 *
 *   const { phase } = usePhases(CUES, { mode, loopAt: 7000 });
 *
 * Pass cue times in ms measured from mount. `phase` starts at 0 and steps to
 * 1, 2, 3... at each cue. Put it on the root as a class (`sm-p0`..`sm-p4`) and
 * key all the animation off those classes in CSS — JS only advances phases.
 *
 * mode:
 *   "animated" — play the sequence (optionally looping, for recording takes)
 *   "static"   — snap straight to the final phase, no timers, no motion.
 *                Combined with `.is-static` on the root (which kills every
 *                transition and animation) this gives the poster frame.
 *
 * enabled:
 *   Hold at phase 0 until an async prerequisite is ready — themes wait on the
 *   mark being loaded and alpha-trimmed. Without this the clock would start at
 *   mount and a slow decode could eat the first beats of the sequence.
 */
export default function usePhases(cues = [], opts = {}) {
  // Back-compat: older components passed loopAt as a bare number.
  const { mode = "animated", loopAt = null, enabled = true } =
    typeof opts === "number" ? { loopAt: opts } : opts;

  const isStatic = mode === "static";
  const last = cues.length;

  const [phase, setPhase] = useState(isStatic ? last : 0);
  const [run, setRun] = useState(0);

  // cues is usually a fresh array literal at the call site; depend on its
  // serialised form so the machine doesn't restart on every render.
  const cueKey = cues.join(",");

  useEffect(() => {
    if (isStatic) {
      setPhase(cueKey.split(",").filter(Boolean).length);
      return undefined;
    }
    if (!enabled) {
      setPhase(0);
      return undefined;
    }

    setPhase(0);
    const timers = cueKey
      .split(",")
      .filter(Boolean)
      .map((at, i) => setTimeout(() => setPhase(i + 1), Number(at)));

    if (loopAt) {
      timers.push(setTimeout(() => setRun((r) => r + 1), loopAt));
    }
    return () => timers.forEach(clearTimeout);
  }, [cueKey, loopAt, run, isStatic, enabled]);

  return { phase, run, isStatic };
}
