/**
 * Single source of truth for the mark every theme renders.
 *
 * Replace `src/Images/logo.png` and every theme updates at once. To pull the
 * newest logo out of ~/Downloads without hunting for it:
 *
 *     npm run logo                    # newest image in ~/Downloads
 *     npm run logo -- ~/Downloads/x.png   # a specific file
 *
 * Requirements for the file: **PNG (or SVG) with a real alpha channel.** Every
 * theme masks its material through the logo's alpha, so a mark baked onto a
 * white rectangle will come out as a styled white box. The colour of the
 * artwork itself is irrelevant — only the alpha shape is used.
 */
import logoSrc from "./Images/logo.png";

export default logoSrc;

/** Ready-to-spread style object exposing the mark to CSS as `--logo`. */
export const logoVar = { "--logo": `url(${logoSrc})` };
