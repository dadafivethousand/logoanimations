import { useEffect, useState } from "react";
import logoSrc from "../logo";

/**
 * Loads the mark and hands themes a *trimmed* copy of it, its aspect ratio, and
 * a set of per-region masks.
 *
 * Why trim: every theme masks its material through the logo's alpha. Exported
 * logos almost always carry uneven transparent padding (the placeholder here is
 * a 1920×1080 canvas whose artwork only occupies the bottom 882px). Masking with
 * the raw file would centre the padding, not the artwork, and every material
 * layer would sit off-register.
 *
 * Why per-region masks: a logo is usually NOT one flat shape. The Code Ninjas
 * mark is three regions — a black hood with "NINJAS", a skin-tone band across
 * the eyes, and "CODE" in blue. Alpha carries none of that: it says only
 * "ink here". A theme that masks by alpha alone flattens the whole lockup into
 * one material and the ninja loses his eyes.
 *
 * So we segment the opaque pixels by tone and publish a mask per region:
 *
 *   --logo         the whole mark (bevels, cast shadows, overall material)
 *   --logo-dark    the dark mass (hood, "NINJAS")
 *   --logo-light   light neutral areas (the eye band / face)
 *   --logo-accent  saturated colour areas ("CODE" blue)
 *
 * A theme can give each region its own value, which is what makes the mark still
 * read as the logo after it has been turned into gold or steel.
 *
 * Falls back to the untrimmed file with no region masks if anything goes wrong
 * (an SVG with no intrinsic size, a decode failure, a fully opaque image) so a
 * theme always renders something.
 */
export default function useLogo(src = logoSrc) {
  const [state, setState] = useState({
    src,
    aspect: 1,
    ready: false,
    regions: null,
  });

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (cancelled) return;
      const natural = (img.naturalWidth || 1) / (img.naturalHeight || 1);
      try {
        const box = alphaBox(img) || {
          x: 0,
          y: 0,
          w: img.naturalWidth,
          h: img.naturalHeight,
        };

        const c = document.createElement("canvas");
        c.width = box.w;
        c.height = box.h;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);

        setState({
          src: c.toDataURL("image/png"),
          aspect: box.w / box.h,
          ready: true,
          regions: segment(ctx, box.w, box.h),
        });
      } catch {
        setState({ src, aspect: natural, ready: true, regions: null });
      }
    };

    img.onerror = () => {
      if (!cancelled) setState({ src, aspect: 1, ready: true, regions: null });
    };

    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  const vars = {
    "--logo": `url(${state.src})`,
    "--logo-aspect": String(state.aspect),
  };
  if (state.regions) {
    // Only publish a region that actually carries pixels, so a theme can test
    // for it rather than masking against an empty image.
    Object.entries(state.regions).forEach(([k, v]) => {
      if (v) vars[`--logo-${k}`] = `url(${v})`;
    });
  }

  return { ...state, logoVar: vars };
}

/**
 * Split the opaque pixels into dark / light / accent and return one PNG data URL
 * per region, where the region's pixels are opaque white and everything else is
 * transparent — i.e. ready to use directly as a mask-image.
 */
function segment(ctx, w, h) {
  const { data } = ctx.getImageData(0, 0, w, h);
  const n = w * h;

  const dark = new Uint8ClampedArray(n * 4);
  const light = new Uint8ClampedArray(n * 4);
  const accent = new Uint8ClampedArray(n * 4);
  let nDark = 0;
  let nLight = 0;
  let nAccent = 0;

  for (let i = 0; i < n; i += 1) {
    const o = i * 4;
    const a = data[o + 3];
    if (a < 24) continue;

    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    // saturation on a 0..1 scale; "accent" means the pixel carries real hue
    const sat = max === 0 ? 0 : (max - min) / max;

    let target;
    if (lum < 96) {
      target = dark;
      nDark += 1;
    } else if (sat > 0.35) {
      target = accent;
      nAccent += 1;
    } else {
      target = light;
      nLight += 1;
    }

    target[o] = 255;
    target[o + 1] = 255;
    target[o + 2] = 255;
    // carry the source alpha so antialiased edges stay soft
    target[o + 3] = a;
  }

  // a region under ~0.2% of the box is noise from antialiasing, not a feature
  const floor = n * 0.002;
  return {
    dark: nDark > floor ? toUrl(dark, w, h) : null,
    light: nLight > floor ? toUrl(light, w, h) : null,
    accent: nAccent > floor ? toUrl(accent, w, h) : null,
  };
}

function toUrl(buf, w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  c.getContext("2d").putImageData(new ImageData(buf, w, h), 0, 0);
  return c.toDataURL("image/png");
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
  if (minX === 0 && minY === 0 && maxX === w - 1 && maxY === h - 1) return null;

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
