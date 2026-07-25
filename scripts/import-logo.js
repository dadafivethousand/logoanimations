#!/usr/bin/env node
/**
 * Copy a logo out of ~/Downloads into src/Images/logo.png.
 *
 *   npm run logo                      # newest image file in ~/Downloads
 *   npm run logo -- ~/Downloads/x.png # an explicit file
 *
 * Warns loudly if the PNG has no alpha channel, because every theme masks its
 * material through the mark's alpha — an opaque logo renders as a styled box.
 */
const fs = require("fs");
const os = require("os");
const path = require("path");

const DEST = path.join(__dirname, "..", "src", "Images", "logo.png");
const DOWNLOADS = path.join(os.homedir(), "Downloads");
const EXTS = new Set([".png", ".svg", ".webp"]);

function newestInDownloads() {
  let entries;
  try {
    entries = fs.readdirSync(DOWNLOADS);
  } catch {
    fail(`Can't read ${DOWNLOADS}`);
  }
  const candidates = entries
    .filter((f) => EXTS.has(path.extname(f).toLowerCase()))
    .map((f) => {
      const full = path.join(DOWNLOADS, f);
      return { full, mtime: fs.statSync(full).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  if (!candidates.length) fail(`No .png/.svg/.webp files in ${DOWNLOADS}`);
  return candidates[0].full;
}

/** Read PNG colour type from the IHDR chunk. 4 and 6 carry an alpha channel. */
function pngInfo(file) {
  const fd = fs.openSync(file, "r");
  const head = Buffer.alloc(33);
  fs.readSync(fd, head, 0, 33, 0);
  fs.closeSync(fd);

  const isPng = head.subarray(0, 8).equals(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  );
  if (!isPng) return null;

  return {
    width: head.readUInt32BE(16),
    height: head.readUInt32BE(20),
    colorType: head[25], // 0 grey, 2 rgb, 3 palette, 4 grey+a, 6 rgba
  };
}

function fail(msg) {
  console.error(`\n  ✗ ${msg}\n`);
  process.exit(1);
}

const arg = process.argv[2];
const src = arg
  ? path.resolve(arg.replace(/^~/, os.homedir()))
  : newestInDownloads();

if (!fs.existsSync(src)) fail(`No such file: ${src}`);

fs.copyFileSync(src, DEST);
console.log(`\n  ✓ ${path.basename(src)}  →  src/Images/logo.png`);

const info = pngInfo(DEST);
if (info) {
  console.log(`    ${info.width}×${info.height}px`);
  if (info.colorType !== 6 && info.colorType !== 4 && info.colorType !== 3) {
    console.log(
      "\n  ⚠  This PNG has no alpha channel. Themes mask their material\n" +
        "     through the mark's transparency, so an opaque image will render\n" +
        "     as a styled rectangle. Re-export the logo with a transparent\n" +
        "     background."
    );
  }
} else if (path.extname(src).toLowerCase() !== ".svg") {
  console.log("    (not a PNG — make sure it has transparency)");
}
console.log("");
