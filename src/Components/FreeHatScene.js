// FreeHatScene.js — the WebGL half of FreeHat: a modelled, lit baseball cap, the
// props that orbit it (hearts, gold stars, game blocks) and the confetti.
//
// Plain three.js behind one factory so the React component stays a phase
// machine: it hands over a canvas, then calls setPhase / resize. Nothing in
// here knows about the copy.
//
// The cap is built, not loaded — there is no model file. Crown, patch and seams
// all run through shapeCrown() so they deform together and stay in register;
// change the crown's shape there and the patch and stitching follow.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const TAU = Math.PI * 2;
const CROWN_Z = 1.1; // the crown is a little longer front-to-back than wide
const BRIM_HALF = 1.04; // radians of crown edge the visor wraps, each side of centre
const BRIM_THICK = 0.022;

// [crown, under-brim, stitching, button + eyelets]
export const HATS = {
  white: ["#c6c6c4", "#a4a7b2", "#7d8291", "#c6c6c4"],
  black: ["#23252e", "#e4002b", "#f4f1e8", "#e4002b"],
  blue: ["#2f8fd0", "#12314f", "#ffffff", "#ffffff"],
  red: ["#e4002b", "#1b1c22", "#ffffff", "#1b1c22"],
};

const CONFETTI = ["#ff2d55", "#ffd60a", "#34c759", "#0a84ff", "#bf5af2", "#ff9f0a", "#ffffff", "#00e5ff", "#ff5fd2"];

// rim-light colour per phase, so the hat picks up the scene it is standing in
const RIM = ["#ffffff", "#fff0a8", "#ff7ad9", "#8fe3ff", "#b6ff9c", "#ffd1f3"];

const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const bounceOut = (x) => {
  const n = 7.5625;
  const d = 2.75;
  if (x < 1 / d) return n * x * x;
  if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75;
  if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375;
  return n * (x -= 2.625 / d) * x + 0.984375;
};

// deterministic jitter — every take, and the still, are the same picture
const rand = (i, salt = 1) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Unit hemisphere -> cap crown. Mutates and returns v. */
function shapeCrown(v) {
  const r = v.length() || 1;
  const front = Math.max(0, v.z / r);
  const h = v.y / r;
  // A hemisphere reads as a helmet. A cap has near-upright walls that turn
  // over late, so swap the circular profile for a squarer superellipse.
  const round = Math.sqrt(Math.max(1e-6, 1 - h * h));
  const boxy = Math.pow(Math.max(0, 1 - Math.pow(h, 2.45)), 1 / 2.45);
  const wall = h > 0.999 ? 1 : boxy / round;
  v.x *= wall;
  v.z *= wall;
  v.y = v.y * (0.7 + 0.12 * front); // taller at the front
  v.z = v.z * CROWN_Z + 0.04 * r * front * Math.sin(Math.PI * h); // front panel stands up
  return v;
}

// three's SphereGeometry convention: phi = PI/2 is +z, the front of the cap
const onCrown = (phi, theta, r = 1) =>
  shapeCrown(
    new THREE.Vector3(-r * Math.cos(phi) * Math.sin(theta), r * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta))
  );

function reshape(geo) {
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    shapeCrown(v.fromBufferAttribute(pos, i));
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** a: -1..1 across the brim, t: 0 (crown edge) .. 1 (front lip) */
function brimPoint(a, t, lift = 0) {
  const th = a * BRIM_HALF;
  // The visor is NARROWER than the crown and joins it across the front only —
  // run it round to the sides and the cap turns into a sun hat.
  const reach = 1.0 * Math.pow(Math.cos((a * Math.PI) / 2), 0.5);
  const x = Math.sin(th) * (0.98 + 0.03 * t);
  const z = Math.cos(th) * CROWN_Z * 0.98 + reach * t;
  // tips down toward the lip, and rolls down at the sides like a curved peak
  const y = 0.012 - reach * t * (0.07 + 0.42 * x * x) + lift;
  return new THREE.Vector3(x, y, z);
}

function brimSurface(lift, flip) {
  const NA = 56;
  const NT = 12;
  const pts = [];
  const idx = [];
  for (let i = 0; i <= NA; i++) {
    for (let j = 0; j <= NT; j++) {
      const p = brimPoint((i / NA) * 2 - 1, j / NT, lift);
      pts.push(p.x, p.y, p.z);
    }
  }
  const at = (i, j) => i * (NT + 1) + j;
  for (let i = 0; i < NA; i++) {
    for (let j = 0; j < NT; j++) {
      const a = at(i, j);
      const b = at(i, j + 1);
      const c = at(i + 1, j);
      const d = at(i + 1, j + 1);
      if (flip) idx.push(a, c, b, b, c, d);
      else idx.push(a, b, c, b, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

const brimLine = (t, lift, radius) => {
  const pts = [];
  for (let i = 0; i <= 60; i++) pts.push(brimPoint((i / 60) * 1.96 - 0.98, t, lift));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, radius, 8, false);
};

// woven-cloth bump, so the crown catches light like fabric rather than plastic
function twillTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  g.fillStyle = "#808080";
  g.fillRect(0, 0, 64, 64);
  for (let i = -64; i < 128; i += 4) {
    g.strokeStyle = i % 8 === 0 ? "#b4b4b4" : "#565656";
    g.lineWidth = 1.6;
    g.beginPath();
    g.moveTo(i, 0);
    g.lineTo(i + 64, 64);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(26, 13);
  return tex;
}

// The front patch: a white woven badge with a stitched border and the ninja's
// head cropped out of the lockup. Drawn empty first, filled in when the image
// decodes — `onReady` lets the caller repaint a static frame.
function patchTexture(logoSrc, stitch, onReady, badge = true) {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const paint = (img) => {
    g.clearRect(0, 0, S, S);
    if (badge) {
    g.beginPath();
    g.arc(S / 2, S / 2, S * 0.47, 0, TAU);
    g.fillStyle = "#fbfaf6";
    g.fill();
    g.lineWidth = S * 0.035;
    g.strokeStyle = "#1b1c22";
    g.stroke();
    g.beginPath();
    g.arc(S / 2, S / 2, S * 0.415, 0, TAU);
    g.setLineDash([S * 0.035, S * 0.022]);
    g.lineWidth = S * 0.014;
    g.strokeStyle = stitch;
    g.stroke();
    g.setLineDash([]);
    }
    if (img && !badge) {
      // a white cap carries the whole lockup, embroidered straight onto the
      // cloth: the ninja with CODE NINJAS under it. The lockup is everything
      // below the top ~17% of the file. The patch is wider than it is tall, so
      // the square texture is stretched sideways — WIDE undoes that.
      const WIDE = 1.1;
      const sy = img.naturalHeight * 0.17;
      const sh = img.naturalHeight - sy;
      const w = S * 0.97;
      const h = ((w * sh) / img.naturalWidth) * WIDE;
      g.drawImage(img, 0, sy, img.naturalWidth, sh, (S - w) / 2, (S - h) / 2, w, h);
    } else if (img) {
      // the head sits in the top-middle of the 1920x1080 lockup; fractions so a
      // re-exported logo at another size still crops the same region
      const sx = img.naturalWidth * 0.318;
      const sy = img.naturalHeight * 0.17;
      const sw = img.naturalWidth * 0.31;
      const sh = img.naturalHeight * 0.48;
      const w = S * 0.7;
      const h = (w * sh) / sw;
      g.drawImage(img, sx, sy, sw, sh, (S - w) / 2 - S * 0.012, (S - h) / 2, w, h);
    }
    tex.needsUpdate = true;
  };
  paint(null);

  const img = new Image();
  img.onload = () => {
    paint(img);
    onReady();
  };
  img.src = logoSrc;
  return tex;
}

function buildHat(palette, logoSrc, onReady) {
  const [crownCol, underCol, stitchCol, trimCol] = palette;
  const hat = new THREE.Group();
  const twill = twillTexture();

  const cloth = new THREE.MeshStandardMaterial({
    color: crownCol,
    roughness: 0.82,
    bumpMap: twill,
    bumpScale: 0.6,
    side: THREE.DoubleSide,
  });
  const under = new THREE.MeshStandardMaterial({ color: underCol, roughness: 0.7, side: THREE.DoubleSide });
  const stitch = new THREE.MeshStandardMaterial({
    color: new THREE.Color(stitchCol).lerp(new THREE.Color(crownCol), 0.7),
    roughness: 0.6,
  });
  const trim = new THREE.MeshStandardMaterial({ color: trimCol, roughness: 0.45 });
  const seam = new THREE.MeshStandardMaterial({
    color: new THREE.Color(crownCol).multiplyScalar(palette === HATS.white ? 0.62 : 0.55),
    roughness: 0.9,
  });

  const add = (geo, mat) => {
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    hat.add(m);
    return m;
  };

  // crown
  add(reshape(new THREE.SphereGeometry(1, 96, 48, 0, TAU, 0, Math.PI / 2)), cloth);

  // six panels: a seam down each, an eyelet in the middle of each
  for (let k = 0; k < 6; k++) {
    const phi = Math.PI / 2 + (k * Math.PI) / 3;
    const pts = [];
    // the front seam stops at the patch rather than running through the ninja
    const end = k === 0 ? 0.52 : Math.PI / 2;
    for (let i = 0; i <= 24; i++) pts.push(onCrown(phi, 0.03 + (i / 24) * (end - 0.03), 1.004));
    add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.013, 6, false), seam);

    const p = onCrown(phi + Math.PI / 6, 0.5, 1.004);
    const eyelet = add(new THREE.TorusGeometry(0.034, 0.013, 8, 20), trim);
    eyelet.position.copy(p);
    eyelet.lookAt(p.clone().multiplyScalar(2));
  }

  // the button on top
  const button = add(new THREE.SphereGeometry(0.085, 24, 16), trim);
  button.scale.y = 0.5;
  button.position.copy(onCrown(0, 0.0001, 1.0));

  // sweatband edge round the base
  const base = [];
  for (let i = 0; i < 80; i++) {
    const a = (i / 80) * TAU;
    base.push(new THREE.Vector3(Math.sin(a), 0.005, Math.cos(a) * CROWN_Z));
  }
  add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(base, true), 160, 0.024, 8, true), seam);

  // brim: top skin, under skin, a rolled lip, and three rows of stitching
  add(brimSurface(0, false), cloth);
  add(brimSurface(-BRIM_THICK, true), under);
  add(brimLine(1, -BRIM_THICK / 2, BRIM_THICK / 2 + 0.001), cloth);
  // stitching sits IN the cloth: proud rows read as a stack of plates
  [0.42, 0.7, 0.9].forEach((t) => add(brimLine(t, 0.0005, 0.0032), stitch));

  // the opening at the back, and the strap across it
  const gap = new THREE.Mesh(
    reshape(new THREE.SphereGeometry(1.004, 24, 12, -Math.PI / 2 - 0.36, 0.72, 1.2, Math.PI / 2 - 1.2)),
    new THREE.MeshStandardMaterial({ color: "#2a2c36", roughness: 0.95 })
  );
  hat.add(gap);
  const strap = [];
  for (let i = 0; i <= 16; i++) strap.push(onCrown(-Math.PI / 2 - 0.4 + (i / 16) * 0.8, 1.5, 1.012));
  const band = add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(strap), 32, 0.03, 8, false), cloth);
  band.scale.y = 1.6;

  // front patch, on the same deformed sphere a hair proud of the cloth
  const patch = new THREE.Mesh(
    reshape(
      palette === HATS.white
        ? new THREE.SphereGeometry(1.014, 48, 30, Math.PI / 2 - 0.66, 1.32, 0.52, 0.88)
        : new THREE.SphereGeometry(1.014, 40, 30, Math.PI / 2 - 0.46, 0.92, 0.56, 0.86)
    ),
    new THREE.MeshStandardMaterial({
      map: patchTexture(logoSrc, palette[1] === "#e4002b" ? "#e4002b" : "#3490bf", onReady, palette !== HATS.white),
      transparent: true,
      roughness: 0.75,
      depthWrite: false,
    })
  );
  patch.receiveShadow = true;
  hat.add(patch);

  return hat;
}

function starGeometry() {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 0.46 : 1;
    const a = (i / 10) * TAU + Math.PI / 2;
    s[i ? "lineTo" : "moveTo"](Math.cos(a) * r, Math.sin(a) * r);
  }
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.1,
    bevelSegments: 4,
  });
  g.center();
  return g;
}

function heartGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.9);
  s.bezierCurveTo(-0.25, -0.65, -1.1, -0.15, -1.1, 0.42);
  s.bezierCurveTo(-1.1, 0.95, -0.35, 1.2, 0, 0.62);
  s.bezierCurveTo(0.35, 1.2, 1.1, 0.95, 1.1, 0.42);
  s.bezierCurveTo(1.1, -0.15, 0.25, -0.65, 0, -0.9);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.16,
    bevelSegments: 6,
  });
  g.center();
  return g;
}

const softDisc = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(10,6,40,0.55)");
  grad.addColorStop(0.6, "rgba(10,6,40,0.18)");
  grad.addColorStop(1, "rgba(10,6,40,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
};

export default function createFreeHatScene(canvas, { logoSrc, hat = "white", isStatic = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });

  // The canvas is the whole screen, so on a retina display "device pixels" is
  // six million of them, multisampled, every frame. Render to a fixed pixel
  // BUDGET instead, and if the machine still cannot hold the frame rate, give
  // resolution back (then the shadows) until it can. Smooth beats sharp here.
  const BUDGET = 2.2e6;
  let cssW = 0;
  let cssH = 0;
  let quality = 1;
  const applyResolution = () => {
    const fit = Math.sqrt((BUDGET * quality) / (cssW * cssH));
    renderer.setPixelRatio(Math.max(0.5, Math.min(window.devicePixelRatio || 1, 2, fit)));
    renderer.setSize(cssW, cssH, false);
  };
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  // white cloth clips to a flat cut-out under the full rig; hold it back so
  // the crown keeps its shading and the visor separates from it
  const isWhite = (HATS[hat] || HATS.white) === HATS.white;
  scene.environmentIntensity = isWhite ? 0.5 : 0.7;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0, 12);
  const viewH = 2 * 12 * Math.tan((28 * Math.PI) / 360);
  let viewW = viewH;

  const key = new THREE.DirectionalLight("#fff3df", isWhite ? 2.1 : 2.6);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  key.shadow.radius = 6;
  key.shadow.bias = -0.0015;
  key.shadow.normalBias = 0.03;
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 20 });
  const fill = new THREE.DirectionalLight("#bcd7ff", 0.9);
  const rim = new THREE.DirectionalLight(RIM[0], isWhite ? 2.2 : 4.5);
  scene.add(key, key.target, fill, rim, rim.target, new THREE.HemisphereLight("#ffffff", "#5a3bd6", isWhite ? 0.4 : 0.55));

  // root follows the layout box · bob carries the bounce and the squash ·
  // tilt shows the top of the cap · spin is the turntable
  const root = new THREE.Group();
  const bob = new THREE.Group();
  const tilt = new THREE.Group();
  const spin = new THREE.Group();
  tilt.rotation.x = 0.16;
  scene.add(root);
  root.add(bob);
  bob.add(tilt);
  tilt.add(spin);

  let dirty = true;
  spin.add(buildHat(HATS[hat] || HATS.white, logoSrc, () => (dirty = true)));
  spin.position.y = -0.22; // turn about the cap's visual middle, not its base

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: softDisc(), transparent: true, depthWrite: false })
  );
  shadow.position.set(0.15, -1.0, -0.6);
  root.add(shadow);

  // ---- props ---------------------------------------------------------------
  const gold = new THREE.MeshStandardMaterial({ color: "#ffbe0b", metalness: 1, roughness: 0.22 });
  const candy = (c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15 });
  const starGeo = starGeometry();
  const heartGeo = heartGeometry();
  const blockGeo = new RoundedBoxGeometry(1, 1, 1, 5, 0.2);

  const orbit = new THREE.Group();
  orbit.rotation.x = 0.42;
  orbit.rotation.z = -0.12;
  root.add(orbit);

  const props = [];
  const ring = (n, geo, mat, size, phases, radius) => {
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(geo, typeof mat === "function" ? mat(i) : mat);
      m.castShadow = true;
      m.scale.setScalar(0.0001);
      orbit.add(m);
      props.push({ m, i, n, size, phases, radius, s: 0 });
    }
  };
  ring(6, heartGeo, (i) => candy(["#ff2d6f", "#ff5fd2", "#ff7a1a"][i % 3]), 0.2, [2], 2.05);
  ring(5, starGeo, gold, 0.27, [3, 5], 2.1);
  ring(6, blockGeo, (i) => candy(["#00d26a", "#0a84ff", "#ffd60a", "#ff2d55", "#bf5af2", "#ff9f0a"][i]), 0.34, [4], 2.1);

  // ---- confetti ------------------------------------------------------------
  const N = 340;
  const confetti = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.13, 0.075),
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false }),
    N
  );
  confetti.frustumCulled = false;
  scene.add(confetti);
  const bits = [];
  const col = new THREE.Color();
  for (let i = 0; i < N; i++) {
    confetti.setColorAt(i, col.set(CONFETTI[i % CONFETTI.length]));
    bits.push({
      p: new THREE.Vector3(),
      v: new THREE.Vector3(),
      r: new THREE.Euler(rand(i, 1) * TAU, rand(i, 2) * TAU, rand(i, 3) * TAU),
      w: new THREE.Vector3(rand(i, 4) * 8 - 4, rand(i, 5) * 8 - 4, rand(i, 6) * 6 - 3),
      sway: rand(i, 7) * TAU,
      s: 0.7 + rand(i, 8) * 0.9,
    });
  }
  const drift = (b, i, anywhere) => {
    b.p.set((rand(i, 9 + cursor) - 0.5) * (viewW + 1), 0, rand(i, 10) * 5 - 3.5);
    b.p.y = anywhere ? (rand(i, 11) - 0.5) * viewH : viewH / 2 + 0.3 + rand(i, 12 + cursor) * 2.5;
    b.v.set(0, -(0.5 + rand(i, 13) * 0.9), 0);
  };
  let cursor = 0;
  const burst = (count) => {
    for (let k = 0; k < count; k++) {
      const i = (cursor + k) % N;
      const b = bits[i];
      const a = rand(i, 14 + cursor) * TAU;
      const up = 0.25 + rand(i, 15 + cursor) * 0.75;
      const sp = (4 + rand(i, 16 + cursor) * 7) * root.scale.x;
      b.p.copy(root.position);
      b.p.z = rand(i, 17) * 3 - 1.5;
      b.v.set(Math.cos(a) * sp * 0.8, Math.abs(Math.sin(a)) * sp * up + 2.5, 0);
    }
    cursor = (cursor + count) % N;
  };

  // ---- state ---------------------------------------------------------------
  let phase = isStatic ? 5 : 0;
  let phaseAt = -100;
  let now = 0;
  let last = 0;
  let raf = 0;
  let dead = false;
  let seeded = false;
  const dummy = new THREE.Object3D();
  const rimTarget = new THREE.Color(RIM[phase]);

  const frame = (dt) => {
    const tp = now - phaseAt;

    // the cap
    let drop = 0;
    let squash = 1;
    let turn = 0;
    if (!isStatic) {
      if (phase === 1) {
        drop = 8 * (1 - bounceOut(Math.min(tp / 1.05, 1)));
        const tl = tp - 0.38; // first touchdown
        squash = tl < 0 ? 1.14 : 1 - 0.3 * Math.exp(-5 * tl) * Math.cos(13 * tl);
        turn = -TAU * (1 - easeOutCubic(Math.min(tp / 1.5, 1)));
      } else if (phase > 1) {
        squash = 1 + 0.24 * Math.exp(-5 * tp) * Math.cos(13 * tp);
        turn = TAU * (1 - easeOutCubic(Math.min(tp / 1.25, 1)));
        drop = 0.5 * Math.exp(-4 * tp) * Math.abs(Math.sin(9 * tp));
      }
    }
    root.visible = phase >= 1;
    const idle = isStatic ? 0 : now;
    bob.position.y = drop + 0.09 * Math.sin(idle * 1.7);
    const wide = 1 / Math.sqrt(squash);
    bob.scale.set(wide, squash, wide);
    spin.rotation.y = 0.62 + 0.3 * Math.sin(idle * 0.75) + turn;
    tilt.rotation.z = 0.07 * Math.sin(idle * 1.1 + 1);
    // nods back every few seconds, far enough to flash the under-brim
    tilt.rotation.x = isStatic ? 0.16 : 0.1 - 0.3 * Math.pow(Math.max(0, Math.sin(idle * 0.9)), 3);
    const lift = Math.min(1, Math.max(0, bob.position.y / 3));
    shadow.scale.set(2.7 * (1 - lift * 0.6), 0.38 * (1 - lift * 0.6), 1);
    shadow.material.opacity = 1 - lift * 0.8;

    rim.color.lerp(rimTarget, isStatic ? 1 : 1 - Math.exp(-dt * 5));

    // the props
    orbit.rotation.y = idle * 0.55;
    for (const pr of props) {
      const on = pr.phases.includes(phase) && (isStatic || tp > 0.25 + pr.i * 0.11);
      pr.s = isStatic ? (on ? 1 : 0) : pr.s + ((on ? 1 : 0) - pr.s) * (1 - Math.exp(-dt * 9));
      const a = (pr.i / pr.n) * TAU;
      pr.m.visible = pr.s > 0.01;
      pr.m.position.set(Math.cos(a) * pr.radius, 0.28 * Math.sin(idle * 2 + pr.i * 1.7), Math.sin(a) * pr.radius);
      pr.m.scale.setScalar(Math.max(0.0001, pr.s * pr.size * (1 + 0.08 * Math.sin(idle * 3 + pr.i))));
      // undo the carousel so each prop faces the camera, then let it rock
      pr.m.rotation.set(0.15 * Math.sin(idle * 1.3 + pr.i), -orbit.rotation.y + 0.5 * Math.sin(idle * 1.1 + pr.i * 2), 0);
    }

    // the confetti
    for (let i = 0; i < N; i++) {
      const b = bits[i];
      if (!isStatic) {
        b.v.y -= 5.5 * dt;
        b.v.multiplyScalar(Math.exp(-1.5 * dt));
        if (b.v.y < -1.6) b.v.y = -1.6; // paper, not gravel: it flutters down
        b.p.addScaledVector(b.v, dt);
        b.p.x += Math.sin(now * 2.2 + b.sway) * 0.35 * dt;
        b.r.x += b.w.x * dt;
        b.r.y += b.w.y * dt;
        b.r.z += b.w.z * dt;
        if (b.p.y < -viewH / 2 - 0.4) drift(b, i, false);
      }
      dummy.position.copy(b.p);
      dummy.rotation.copy(b.r);
      dummy.scale.setScalar(b.s);
      dummy.updateMatrix();
      confetti.setMatrixAt(i, dummy.matrix);
    }
    confetti.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
  };

  let frames = 0;
  let slow = 0;
  const loop = (ms) => {
    if (dead) return;
    const t = ms / 1000;
    const real = last ? t - last : 0.016;
    const dt = Math.min(0.05, real);
    last = t;
    now += dt;

    // every 40 frames, once the shaders have compiled: are we holding ~45fps?
    if (!isStatic && ++frames > 90) {
      slow += real;
      if (frames % 40 === 0) {
        if (slow / 40 > 0.022 && quality > 0.2) {
          quality *= 0.7;
          applyResolution();
          if (quality < 0.45) key.castShadow = false;
        }
        slow = 0;
      }
    }
    if (!isStatic || dirty) {
      dirty = false;
      frame(dt);
    }
    raf = requestAnimationFrame(loop);
  };

  const api = {
    /** w/h: canvas CSS size. zone: the layout box the cap should sit in, in canvas px. */
    resize(w, h, zone) {
      if (!w || !h) return;
      cssW = w;
      cssH = h;
      applyResolution();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      viewW = viewH * camera.aspect;
      const perPx = viewH / h;
      const s = Math.min((zone.width * perPx) / 2.9, (zone.height * perPx) / 1.6);
      root.scale.setScalar(s);
      root.position.set((zone.left + zone.width / 2 - w / 2) * perPx, -(zone.top + zone.height / 2 - h / 2) * perPx, 0);
      key.position.set(root.position.x - 3, root.position.y + 5, 5);
      key.target.position.copy(root.position);
      fill.position.set(root.position.x + 4, root.position.y - 1, 4);
      rim.position.set(root.position.x + 3, root.position.y + 2.5, -4);
      rim.target.position.copy(root.position);
      const reach = 3 * s;
      Object.assign(key.shadow.camera, { left: -reach, right: reach, top: reach, bottom: -reach });
      key.shadow.camera.updateProjectionMatrix();
      if (!seeded) {
        seeded = true;
        bits.forEach((b, i) => drift(b, i, true));
      }
      dirty = true;
    },
    setPhase(p) {
      if (p === phase) return;
      phase = p;
      phaseAt = now;
      rimTarget.set(RIM[p] || RIM[0]);
      if (!isStatic && p >= 1) burst(p === 1 || p === 5 ? 220 : 130);
      dirty = true;
    },
    dispose() {
      dead = true;
      cancelAnimationFrame(raf);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          if (o.material.bumpMap) o.material.bumpMap.dispose();
          o.material.dispose();
        }
      });
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };

  raf = requestAnimationFrame(loop);
  return api;
}
