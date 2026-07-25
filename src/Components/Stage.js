// Stage.js — fixed-resolution canvas, scaled to fit whatever window you're in.
//
// Themes are authored at TRUE EXPORT RESOLUTION (1080×1920 etc) and laid out in
// real pixels, so a bevel that's 3px is 3px in the exported file — no guessing
// what a `vw` turns into. The Stage then scales the whole thing down with a
// single transform so it fits on screen while you work.
//
// Set `zoom={1}` to render at 1:1 for a full-resolution screenshot or capture.
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../Stylesheets/Stage.css";

export const CANVASES = {
  "1x1": { w: 1080, h: 1080, label: "Feed square" },
  "4x5": { w: 1080, h: 1350, label: "Feed portrait" },
  "9x16": { w: 1080, h: 1920, label: "Story / Reel" },
};

// Safe margins as a fraction of the short edge — the outer band that gets
// eaten when a recording is re-fit to a phone screen. Nothing meaningful goes
// inside it. Matches the ~40/45px-on-390px rule from the sibling repo.
const SAFE_X = 0.115;
const SAFE_Y = 0.06;

export default function Stage({
  canvas = "9x16",
  zoom = "fit",
  guides = false,
  className = "",
  children,
}) {
  const { w, h } = CANVASES[canvas] || CANVASES["9x16"];
  const hostRef = useRef(null);
  const [scale, setScale] = useState(zoom === "fit" ? 0 : zoom);

  useLayoutEffect(() => {
    if (zoom !== "fit") {
      setScale(zoom);
      return undefined;
    }
    const host = hostRef.current;
    if (!host) return undefined;

    // Observe the host rather than the window: on first paint the host may not
    // have been laid out yet, and a one-shot measure would latch a stale (or
    // zero) size and never correct itself.
    const fit = () => {
      const { clientWidth: cw, clientHeight: ch } = host;
      if (!cw || !ch) return;
      setScale(Math.min(cw / w, ch / h));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    return () => ro.disconnect();
  }, [w, h, zoom]);

  // At 1:1 the canvas is bigger than the window on purpose — let it scroll so
  // you can pan around a full-res frame.
  useEffect(() => {
    document.body.style.overflow = zoom === "fit" ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "hidden";
    };
  }, [zoom]);

  return (
    <div className={`stage-host ${zoom === "fit" ? "" : "stage-host--zoom"}`} ref={hostRef}>
      <div
        className={`stage ${guides ? "stage--guides" : ""} ${className}`}
        style={{
          width: `${w}px`,
          height: `${h}px`,
          transform: `scale(${scale || 0.0001})`,
          "--stage-w": `${w}px`,
          "--stage-h": `${h}px`,
          "--safe-x": `${Math.round(Math.min(w, h) * SAFE_X)}px`,
          "--safe-y": `${Math.round(Math.min(w, h) * SAFE_Y)}px`,
          // One knob every theme sizes off: the short edge. Makes a theme
          // authored at 9:16 come out correctly proportioned at 1:1.
          "--u": `${Math.min(w, h) / 1080}`,
          visibility: scale ? "visible" : "hidden",
        }}
      >
        {children}
        {guides && (
          <>
            <div className="stage-safe" aria-hidden />
            <div className="stage-cross" aria-hidden />
          </>
        )}
      </div>
    </div>
  );
}
