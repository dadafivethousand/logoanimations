import { useEffect, useState } from "react";
import logoSrc from "../logo";

/**
 * Loads the mark and hands themes a *trimmed* version of it plus its aspect.
 *
 * Why trim: every theme masks its material through the logo's alpha. Exported
 * logos almost always carry uneven transparent padding (the placeholder here is
 * a 1920×1080 canvas whose artwork only occupies the bottom 882px). Masking
 * with the raw file would centre the padding, not the artwork, and every
 * material layer would sit off-register. So on load we scan the alpha channel
 * for the true content box, redraw just that box to a canvas, and hand back a
 * data URL that is exactly the mark — no padding, known aspect ratio.
 *
 * Whatever the user drops into src/Images/logo.png, themes get a clean mask.
 *
 * Falls back to the untrimmed file if anything goes wrong (SVG without an
 * intrinsic size, a decode failure, a fully-opaque image with no alpha to
 * scan) so a theme always renders something.
 */
export default function useLogo(src = logoSrc) {
  const [state, setState] = useState({
    src,
    aspect: 1,
    ready: false,
    trimmed: false,
  });

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (cancelled) return;
      const natural = (img.naturalWidth || 1) / (img.naturalHeight || 1);
      try {
        const box = alphaBox(img);
        if (!box) {
          // no alpha to trim against — use the file as-is
          setState({ src, aspect: natural, ready: true, trimmed: false });
          return;
        }
        const out = document.createElement("canvas");
        out.width = box.w;
        out.height = box.h;
        out
          .getContext("2d")
          .drawImage(img, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
        setState({
          src: out.toDataURL("image/png"),
          aspect: box.w / box.h,
          ready: true,
          trimmed: true,
        });
      } catch {
        setState({ src, aspect: natural, ready: true, trimmed: false });
      }
    };

    img.onerror = () => {
      if (!cancelled) setState({ src, aspect: 1, ready: true, trimmed: false });
    };

    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return {
    ...state,
    /** spread onto the theme root: exposes the trimmed mark + its aspect */
    logoVar: {
      "--logo": `url(${state.src})`,
      "--logo-aspect": String(state.aspect),
    },
  };
}

/** Alpha-channel bounding box, scanned at reduced resolution for speed. */
function alphaBox(img, threshold = 8) {
  const MAX = 512;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return null;

  const s = Math.min(1, MAX / Math.max(iw, ih));
  const w = Math.max(1, Math.round(iw * s));
  const h = Math.max(1, Math.round(ih * s));

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);

  const { data } = ctx.getImageData(0, 0, w, h);
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (data[(y * w + x) * 4 + 3] > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) return null; // fully transparent
  // Already tight (or opaque edge-to-edge) — nothing to gain from a redraw.
  if (minX === 0 && minY === 0 && maxX === w - 1 && maxY === h - 1) return null;

  // scale the box back up to the source image's real pixels, with a 1px bleed
  const inv = 1 / s;
  const x = Math.max(0, Math.floor(minX * inv) - 1);
  const y = Math.max(0, Math.floor(minY * inv) - 1);
  return {
    x,
    y,
    w: Math.min(iw - x, Math.ceil((maxX - minX + 1) * inv) + 2),
    h: Math.min(ih - y, Math.ceil((maxY - minY + 1) * inv) + 2),
  };
}
