import React from "react";
import "./Stylesheets/App.css";
import Stage from "./Components/Stage";
// import Robotics from "./Themes/Robotics";
import Samurai from "./Themes/Samurai";

/* ---------------------------------------------------------------------------
   One theme renders at a time. Swap the import and the component below;
   leave the previous one commented out.

   MODE — your call, per render:
     "animated"  the sequence plays and loops, for screen-recording
     "static"    snaps to the final frame with all motion off, for a still

   CANVAS — "9x16" story/reel · "4x5" feed portrait · "1x1" feed square
   GUIDES — safe-margin overlay while composing; off for capture
   --------------------------------------------------------------------------- */
const MODE = "animated";
const CANVAS = "9x16";
const GUIDES = false;

export default function App() {
  return (
    <Stage canvas={CANVAS} guides={GUIDES}>
      <Samurai mode={MODE} />
    </Stage>
  );
}
