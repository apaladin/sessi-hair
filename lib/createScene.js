import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { COLLECTIONS, STOPS, ROOM, WALL_ART, ENTRY } from './data';

/* =====================================================================
   SESSI HAIR — THE BOUTIQUE (daylight gallery edition)
   Imperative Three.js scene, mounted from a React client component.
   ===================================================================== */

const GOLD = 0xb3986a;
const INK = 0x221c15;

function mulberry(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------- procedural textures ------------------------- */

function hairTexture(top, bottom, seed, w = 512, h = 1024) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, `rgb(${top.join(',')})`);
  grad.addColorStop(1, `rgb(${bottom.join(',')})`);
  g.fillStyle = grad;
  g.fillRect(0, 0, w, h);

  const rnd = mulberry(seed);
  const hi = bottom.map(v => Math.min(255, v * 1.55 + 30));
  const lo = top.map(v => v * 0.5);
  for (let i = 0; i < 150; i++) {
    const x0 = rnd() * w;
    const drift = (rnd() - 0.5) * w * 0.5;
    const sway = (rnd() - 0.5) * w * 0.55;
    const col = rnd() > 0.5 ? hi : (rnd() > 0.5 ? lo : bottom);
    g.strokeStyle = `rgba(${col.map(Math.round).join(',')},${0.18 + rnd() * 0.35})`;
    g.lineWidth = 1 + rnd() * 2.4;
    g.beginPath();
    g.moveTo(x0, -20);
    g.bezierCurveTo(x0 + sway, h * 0.33, x0 + drift - sway * 0.5, h * 0.66, x0 + drift, h + 20);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function labelTexture(title) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#fdfaf4';
  g.fillRect(0, 0, 1024, 256);
  g.strokeStyle = '#b3986a';
  g.lineWidth = 3;
  g.strokeRect(14, 14, 996, 228);
  g.fillStyle = '#221c15';
  g.font = '72px Georgia, serif';
  g.textAlign = 'center';
  g.fillText(title, 512, 118);
  g.fillStyle = '#9a7f52';
  g.font = '30px Georgia, serif';
  g.fillText('S  E  S  S  I     H  A  I  R', 512, 190);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function taglineTexture() {
  const c = document.createElement('canvas');
  c.width = 2048; c.height = 256;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 2048, 256);
  g.fillStyle = '#9a7f52';
  g.font = 'italic 110px Georgia, serif';
  g.textAlign = 'center';
  g.fillText('Luxury for Every Crown', 1024, 160);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function oakFloorTexture() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 1024;
  const g = c.getContext('2d');
  g.fillStyle = '#cdb691';
  g.fillRect(0, 0, 1024, 1024);
  const rnd = mulberry(99);
  const plank = 128;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const l = 196 + rnd() * 28;
      g.fillStyle = `rgb(${l},${l * 0.86},${l * 0.64})`;
      g.fillRect(j * plank + 1, i * plank + 1, plank - 2, plank - 2);
      for (let k = 0; k < 8; k++) {
        g.strokeStyle = `rgba(120,90,55,${0.05 + rnd() * 0.08})`;
        g.lineWidth = 1 + rnd() * 1.4;
        const y = i * plank + rnd() * plank;
        g.beginPath();
        g.moveTo(j * plank, y);
        g.bezierCurveTo(j * plank + 40, y + (rnd() - 0.5) * 7, j * plank + 90, y + (rnd() - 0.5) * 7, (j + 1) * plank, y + (rnd() - 0.5) * 5);
        g.stroke();
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(5, 4);
  tex.anisotropy = 8;
  return tex;
}

/* rear-view silhouette with flowing hair — fallback when a photo can't load */
function silhouetteTexture(top, bottom, seed) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 740;
  const g = c.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, 740);
  bg.addColorStop(0, '#f2e9d8');
  bg.addColorStop(1, '#e2d4ba');
  g.fillStyle = bg;
  g.fillRect(0, 0, 512, 740);

  // shoulders + head, rear view
  g.fillStyle = '#2b2118';
  g.beginPath();
  g.ellipse(256, 210, 92, 108, 0, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.moveTo(90, 740);
  g.bezierCurveTo(110, 480, 190, 400, 256, 395);
  g.bezierCurveTo(322, 400, 402, 480, 422, 740);
  g.closePath();
  g.fill();

  // flowing hair over the figure
  const rnd = mulberry(seed);
  const hi = bottom.map(v => Math.min(255, v * 1.5 + 34));
  for (let i = 0; i < 110; i++) {
    const x0 = 176 + rnd() * 160;
    const drift = (rnd() - 0.5) * 190;
    const sway = (rnd() - 0.5) * 130;
    const len = 460 + rnd() * 240;
    const col = rnd() > 0.45 ? hi : bottom;
    g.strokeStyle = `rgba(${col.map(Math.round).join(',')},${0.25 + rnd() * 0.45})`;
    g.lineWidth = 1.4 + rnd() * 2.6;
    g.beginPath();
    g.moveTo(x0, 120 + rnd() * 60);
    g.bezierCurveTo(x0 + sway, 300, x0 + drift - sway * 0.4, 460, x0 + drift, len + 180);
    g.stroke();
  }
  g.fillStyle = 'rgba(154,127,82,0.9)';
  g.font = '26px Georgia, serif';
  g.textAlign = 'center';
  g.fillText('S E S S I   H A I R', 256, 700);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function contactShadowTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  grad.addColorStop(0, 'rgba(60,45,28,0.42)');
  grad.addColorStop(1, 'rgba(60,45,28,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/* ------------------------------ main ------------------------------ */

export function createScene(canvas, callbacks = {}) {
  RectAreaLightUniformsLib.init();

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4eee2);
  scene.fog = new THREE.Fog(0xf4eee2, 30, 70);

  // soft studio reflections for gold, floor sheen and strands
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;

  const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 80);
  camera.position.set(0, 1.7, 12);

  const disposables = [];
  const track = (obj) => { disposables.push(obj); return obj; };

  /* ------------------------------ room ------------------------------ */

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM.hw * 2, ROOM.hd * 2),
    new THREE.MeshStandardMaterial({ map: track(oakFloorTexture()), roughness: 0.45, metalness: 0.06 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf1eadb, roughness: 0.95 });
  const wainscotMat = new THREE.MeshStandardMaterial({ color: 0xe3d7c0, roughness: 0.85 });
  const trimMat = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.32, metalness: 0.7 });

  function wall(w, x, z, ry) {
    const grp = new THREE.Group();
    const upper = new THREE.Mesh(new THREE.PlaneGeometry(w, ROOM.h - 1.1), wallMat);
    upper.position.y = 1.1 + (ROOM.h - 1.1) / 2;
    upper.receiveShadow = true;
    grp.add(upper);
    const lower = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.1), wainscotMat);
    lower.position.y = 0.55;
    grp.add(lower);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, 0.04), trimMat);
    trim.position.set(0, 1.12, 0.02);
    grp.add(trim);
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, 0.08), wainscotMat);
    cornice.position.set(0, ROOM.h - 0.05, 0.03);
    grp.add(cornice);
    grp.position.set(x, 0, z);
    grp.rotation.y = ry;
    scene.add(grp);
  }
  wall(ROOM.hw * 2, 0, -ROOM.hd, 0);
  wall(ROOM.hw * 2, 0, ROOM.hd, Math.PI);
  wall(ROOM.hd * 2, -ROOM.hw, 0, Math.PI / 2);
  wall(ROOM.hd * 2, ROOM.hw, 0, -Math.PI / 2);

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM.hw * 2, ROOM.hd * 2),
    new THREE.MeshStandardMaterial({ color: 0xf7f2e7, roughness: 0.98 })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM.h;
  scene.add(ceiling);

  // tagline above the entrance (visible when looking back)
  const tagline = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 0.875),
    new THREE.MeshBasicMaterial({ map: track(taglineTexture()), transparent: true })
  );
  tagline.position.set(0, 4.4, ROOM.hd - 0.05);
  tagline.rotation.y = Math.PI;
  scene.add(tagline);

  /* ---------------------------- lighting ---------------------------- */

  scene.add(new THREE.AmbientLight(0xfff6e6, 0.5));
  scene.add(new THREE.HemisphereLight(0xfffdf5, 0xcbb591, 0.85));

  // skylight — glowing panel + soft area light + shadow-casting sun
  const skyGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(7.5, 4.5),
    new THREE.MeshBasicMaterial({ color: 0xfffdf2 })
  );
  skyGlow.rotation.x = Math.PI / 2;
  skyGlow.position.set(0, ROOM.h - 0.02, 0.5);
  scene.add(skyGlow);
  const skyFrame = new THREE.Mesh(new THREE.BoxGeometry(7.7, 0.06, 4.7), trimMat);
  skyFrame.position.set(0, ROOM.h - 0.04, 0.5);
  scene.add(skyFrame);

  const area = new THREE.RectAreaLight(0xfffdf2, 5.2, 7.5, 4.5);
  area.position.set(0, ROOM.h - 0.05, 0.5);
  area.lookAt(0, 0, 0.5);
  scene.add(area);

  const sun = new THREE.DirectionalLight(0xfff6e0, 1.35);
  sun.position.set(2.5, ROOM.h - 0.2, 2.6);
  sun.target.position.set(-0.5, 0, -0.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -14; sun.shadow.camera.right = 14;
  sun.shadow.camera.top = 12; sun.shadow.camera.bottom = -12;
  sun.shadow.bias = -0.0018;
  scene.add(sun, sun.target);

  function displaySpot(x, z, ry) {
    const off = new THREE.Vector3(0, 0, 1.9).applyAxisAngle(new THREE.Vector3(0, 1, 0), ry);
    const s = new THREE.SpotLight(0xffe9c2, 26, 14, 0.42, 0.6, 1.7);
    s.position.set(x + off.x, ROOM.h - 0.35, z + off.z);
    s.target.position.set(x, 2.1, z);
    scene.add(s, s.target);
    // recessed ceiling disc
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(0.16, 24),
      new THREE.MeshBasicMaterial({ color: 0xfff3d8 })
    );
    disc.rotation.x = Math.PI / 2;
    disc.position.set(x + off.x, ROOM.h - 0.03, z + off.z);
    scene.add(disc);
  }

  /* ------------------------ collection displays ------------------------ */

  const clickables = [];
  const shadowTex = track(contactShadowTexture());
  const texLoader = new THREE.TextureLoader();
  texLoader.setCrossOrigin('anonymous');

  /* framed editorial portrait: shows a drawn silhouette instantly,
     swaps to the photograph once it loads */
  function campaignFrame(url, fallbackTex, w = 1.5, h = 2.2) {
    const grp = new THREE.Group();
    const mat = new THREE.Mesh(
      new THREE.BoxGeometry(w + 0.24, h + 0.24, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xfdfaf4, roughness: 0.7 })
    );
    mat.castShadow = true;
    grp.add(mat);
    const ft = 0.05;
    [[0, (h + 0.3) / 2, w + 0.34, ft], [0, -(h + 0.3) / 2, w + 0.34, ft],
     [-(w + 0.3) / 2, 0, ft, h + 0.34], [(w + 0.3) / 2, 0, ft, h + 0.34]]
      .forEach(([fx, fy, sw, sh]) => {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(sw, sh, 0.07), trimMat);
        bar.position.set(fx, fy, 0.01);
        grp.add(bar);
      });
    const photoMat = new THREE.MeshStandardMaterial({ map: fallbackTex, roughness: 0.6 });
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(w, h), photoMat);
    photo.position.z = 0.045;
    grp.add(photo);
    texLoader.load(url, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      photoMat.map = t;
      photoMat.needsUpdate = true;
    });
    return grp;
  }

  function contactShadow(x, z, size) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.012, z);
    scene.add(m);
  }

  function display(collection, x, z, ry, stopIndex) {
    const grp = new THREE.Group();

    const back = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 3.4, 0.12),
      new THREE.MeshStandardMaterial({ color: INK, roughness: 0.65 })
    );
    back.position.y = 2.15;
    back.castShadow = true;
    grp.add(back);

    const fw = 2.0, fh = 2.9, ft = 0.055;
    [[0, fh / 2, fw + ft, ft], [0, -fh / 2, fw + ft, ft], [-fw / 2, 0, ft, fh], [fw / 2, 0, ft, fh]]
      .forEach(([fx, fy, sw, sh]) => {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(sw, sh, 0.06), trimMat);
        bar.position.set(fx, 2.15 + fy, 0.1);
        grp.add(bar);
      });

    const hair = new THREE.Mesh(
      new THREE.PlaneGeometry(fw - 0.08, fh - 0.08),
      new THREE.MeshStandardMaterial({
        map: track(hairTexture(collection.top, collection.bottom, 100 + stopIndex)),
        roughness: 0.4, metalness: 0.08,
      })
    );
    hair.position.set(0, 2.15, 0.105);
    hair.userData.stopIndex = stopIndex;
    grp.add(hair);
    clickables.push(hair);

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.375),
      new THREE.MeshBasicMaterial({ map: track(labelTexture(collection.name)) })
    );
    label.position.set(0, 0.62, 0.35);
    grp.add(label);

    const ped = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 1.0, 0.55),
      new THREE.MeshStandardMaterial({ color: 0xfaf5ea, roughness: 0.5 })
    );
    ped.position.set(1.75, 0.5, 0.45);
    ped.castShadow = true;
    grp.add(ped);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.16, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xe9ddc7, roughness: 0.5 })
    );
    box.position.set(1.75, 1.09, 0.45);
    box.rotation.y = 0.4;
    box.castShadow = true;
    grp.add(box);
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.045, 0.31), trimMat);
    band.position.copy(box.position);
    band.rotation.copy(box.rotation);
    grp.add(band);

    // second, smaller product box stacked beside
    const box2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.12, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x2b2118, roughness: 0.55 })
    );
    box2.position.set(1.55, 1.07, 0.62);
    box2.rotation.y = -0.35;
    box2.castShadow = true;
    grp.add(box2);
    const band2 = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.035, 0.23), trimMat);
    band2.position.copy(box2.position);
    band2.rotation.copy(box2.rotation);
    grp.add(band2);

    // editorial portrait beside the display — a girl wearing this collection
    const portrait = campaignFrame(
      collection.models[0],
      track(silhouetteTexture(collection.top, collection.bottom, 500 + stopIndex)),
      1.35, 1.95
    );
    portrait.position.set(-2.15, 2.15, 0.06);
    grp.add(portrait);

    grp.position.set(x, 0, z);
    grp.rotation.y = ry;
    scene.add(grp);

    displaySpot(x, z, ry);
    const pedWorld = new THREE.Vector3(1.75, 0, 0.45).applyAxisAngle(new THREE.Vector3(0, 1, 0), ry);
    contactShadow(x + pedWorld.x, z + pedWorld.z, 1.6);
  }

  display(COLLECTIONS[0], 0, -ROOM.hd + 0.12, 0, 0);
  display(COLLECTIONS[1], -7.4, -ROOM.hd + 0.12, 0, 1);
  display(COLLECTIONS[2], 7.4, -ROOM.hd + 0.12, 0, 2);
  display(COLLECTIONS[3], -ROOM.hw + 0.12, -1.2, Math.PI / 2, 3);
  display(COLLECTIONS[4], ROOM.hw - 0.12, -1.2, -Math.PI / 2, 4);

  /* ------------- centerpiece: marble table with florals ------------- */

  const center = new THREE.Group();
  center.position.set(0, 0, 2.2);

  const rug = new THREE.Mesh(
    new THREE.CircleGeometry(2.5, 48),
    new THREE.MeshStandardMaterial({ color: 0xe6d9bf, roughness: 1 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.y = 0.006;
  rug.receiveShadow = true;
  center.add(rug);

  const cTop = new THREE.Mesh(
    new THREE.CylinderGeometry(1.05, 1.05, 0.08, 48),
    new THREE.MeshStandardMaterial({ color: 0xf6f1e6, roughness: 0.22, metalness: 0.05 })
  );
  cTop.position.y = 0.86;
  cTop.castShadow = true;
  center.add(cTop);
  const cStem = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.82, 16), trimMat);
  cStem.position.y = 0.41;
  center.add(cStem);
  const cBase = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.52, 0.06, 48), trimMat);
  cBase.position.y = 0.03;
  center.add(cBase);

  // floral arrangement
  const vase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.2, 0.46, 24),
    new THREE.MeshStandardMaterial({ color: 0xe9ddc7, roughness: 0.35 })
  );
  vase.position.y = 1.13;
  vase.castShadow = true;
  center.add(vase);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x77804f, roughness: 1 });
  const bloomMats = [
    new THREE.MeshStandardMaterial({ color: 0xf6efe3, roughness: 0.85 }),
    new THREE.MeshStandardMaterial({ color: 0xe8cfc4, roughness: 0.85 }),
    new THREE.MeshStandardMaterial({ color: 0xd9bc8c, roughness: 0.6, metalness: 0.3 }),
  ];
  const rndF = mulberry(31);
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + rndF() * 0.6;
    const tilt = 0.18 + rndF() * 0.4;
    const len = 0.55 + rndF() * 0.5;
    const sx = Math.cos(a) * tilt, sz = Math.sin(a) * tilt;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.011, len, 6), stemMat);
    stem.position.set(sx * len * 0.6, 1.32 + len / 2 - 0.06, sz * len * 0.6);
    stem.rotation.z = -sx;
    stem.rotation.x = sz;
    center.add(stem);
    const bloom = new THREE.Mesh(
      new THREE.SphereGeometry(0.055 + rndF() * 0.06, 10, 8),
      bloomMats[Math.floor(rndF() * bloomMats.length)]
    );
    bloom.position.set(sx * len * 1.15, 1.32 + len - 0.02, sz * len * 1.15);
    bloom.castShadow = true;
    center.add(bloom);
  }
  // a couple of trailing product boxes styled on the table
  [[0.55, 0.35, 0.5, 0xe9ddc7], [-0.5, -0.3, -0.4, 0x2b2118]].forEach(([bx, bz, r, col]) => {
    const gb = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.14, 0.28),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.55 })
    );
    gb.position.set(bx, 0.97, bz);
    gb.rotation.y = r;
    gb.castShadow = true;
    center.add(gb);
    const gband = new THREE.Mesh(new THREE.BoxGeometry(0.41, 0.038, 0.29), trimMat);
    gband.position.copy(gb.position);
    gband.rotation.copy(gb.rotation);
    center.add(gband);
  });
  scene.add(center);
  contactShadow(0, 2.2, 3.2);

  /* ---------------------- chandelier above centre ---------------------- */
  const chandelier = new THREE.Group();
  const candleMat = new THREE.MeshStandardMaterial({
    color: 0xfff3d8, emissive: 0xffdfae, emissiveIntensity: 1.6, roughness: 0.4,
  });
  [[0.95, 4.35], [0.64, 4.72], [0.36, 5.08]].forEach(([r, y], tier) => {
    const ringM = new THREE.Mesh(new THREE.TorusGeometry(r, 0.028, 12, 56), trimMat);
    ringM.rotation.x = Math.PI / 2;
    ringM.position.y = y;
    chandelier.add(ringM);
    const nC = 10 - tier * 3;
    for (let i = 0; i < nC; i++) {
      const a = (i / nC) * Math.PI * 2;
      const candle = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), candleMat);
      candle.position.set(Math.cos(a) * r, y + 0.06, Math.sin(a) * r);
      chandelier.add(candle);
    }
    [[r, 0], [-r, 0], [0, r], [0, -r]].forEach(([wx, wz]) => {
      const wire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, ROOM.h - y, 6),
        new THREE.MeshStandardMaterial({ color: 0xcbb591, roughness: 0.6 })
      );
      wire.position.set(wx, y + (ROOM.h - y) / 2, wz);
      chandelier.add(wire);
    });
  });
  chandelier.position.set(0, 0, 2.2);
  scene.add(chandelier);
  const chandGlow = new THREE.PointLight(0xffe4b5, 14, 12, 2);
  chandGlow.position.set(0, 4.6, 2.2);
  scene.add(chandGlow);

  /* ----------------------- The Mirror (try-on) ----------------------- */

  const mirror = new THREE.Group();
  const mw = 1.35, mh = 2.5;
  const mFrame = new THREE.Mesh(
    new THREE.BoxGeometry(mw + 0.22, mh + 0.22, 0.08),
    trimMat
  );
  mFrame.position.y = mh / 2 + 0.25;
  mFrame.castShadow = true;
  mirror.add(mFrame);
  const mGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(mw, mh),
    new THREE.MeshStandardMaterial({
      color: 0xdfe8e6, metalness: 0.85, roughness: 0.18, envMapIntensity: 2.4,
      emissive: 0x8a9490, emissiveIntensity: 0.35,
    })
  );
  mGlass.position.set(0, mh / 2 + 0.25, 0.045);
  mGlass.userData.mirror = true;
  mirror.add(mGlass);
  clickables.push(mGlass);
  // easel legs
  [-1, 1].forEach((s) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.6, 10), trimMat);
    leg.position.set(s * (mw / 2 + 0.02), 0.28, -0.12);
    leg.rotation.x = 0.22;
    mirror.add(leg);
  });
  const mirrorLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.15, 0.29),
    new THREE.MeshBasicMaterial({ map: track(labelTexture('The Mirror')) })
  );
  mirrorLabel.position.set(0, 0.14, 0.3);
  mirror.add(mirrorLabel);
  mirror.position.set(6.4, 0, 4.5);
  mirror.rotation.y = Math.atan2(-3.5, 1.6);   // face the tour viewpoint
  scene.add(mirror);
  contactShadow(6.4, 4.5, 2.4);
  displaySpot(6.4, 4.5, mirror.rotation.y);

  /* --------------------------- architecture --------------------------- */

  // coffered ceiling beams
  const beamMat = new THREE.MeshStandardMaterial({ color: 0xe8dfcc, roughness: 0.9 });
  for (let bx = -ROOM.hw + 3.25; bx < ROOM.hw - 0.5; bx += 3.25) {
    if (Math.abs(bx) < 4.2) continue; // keep the skylight clear
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.2, ROOM.hd * 2), beamMat);
    beam.position.set(bx, ROOM.h - 0.1, 0);
    scene.add(beam);
  }
  for (let bz = -ROOM.hd + 3.1; bz < ROOM.hd - 0.5; bz += 3.1) {
    if (Math.abs(bz - 0.5) < 2.8) continue;
    const beam = new THREE.Mesh(new THREE.BoxGeometry(ROOM.hw * 2, 0.2, 0.16), beamMat);
    beam.position.set(0, ROOM.h - 0.1, bz);
    scene.add(beam);
  }

  // frieze of recessed panel mouldings around the upper walls
  function frieze(wallW, x, z, ry, skipCenter = false) {
    const n = Math.floor(wallW / 3.6);
    const startX = -((n - 1) * 3.6) / 2;
    for (let i = 0; i < n; i++) {
      const px = startX + i * 3.6;
      if (skipCenter && Math.abs(px) < 4.2) continue;
      const panel = new THREE.Group();
      const pw = 2.7, ph = 1.05, pt = 0.035;
      [[0, ph / 2, pw + pt, pt], [0, -ph / 2, pw + pt, pt],
       [-pw / 2, 0, pt, ph], [pw / 2, 0, pt, ph]]
        .forEach(([fx, fy, sw, sh]) => {
          const bar = new THREE.Mesh(
            new THREE.BoxGeometry(sw, sh, 0.03),
            new THREE.MeshStandardMaterial({ color: 0xdccfb4, roughness: 0.85 })
          );
          bar.position.set(fx, fy, 0.02);
          panel.add(bar);
        });
      panel.position.set(px, 4.95, 0);
      const holder = new THREE.Group();
      holder.add(panel);
      holder.position.set(x, 0, z);
      holder.rotation.y = ry;
      scene.add(holder);
    }
  }
  frieze(ROOM.hw * 2, 0, -ROOM.hd + 0.04, 0);
  frieze(ROOM.hw * 2, 0, ROOM.hd - 0.04, Math.PI, true);
  frieze(ROOM.hd * 2, -ROOM.hw + 0.04, 0, Math.PI / 2);
  frieze(ROOM.hd * 2, ROOM.hw - 0.04, 0, -Math.PI / 2);

  // wall sconces flanking every display
  const sconceMat = new THREE.MeshStandardMaterial({
    color: 0xfff3d8, emissive: 0xffdfae, emissiveIntensity: 1.3, roughness: 0.5,
  });
  function sconce(x, z, ry) {
    const s = new THREE.Group();
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.34, 10), trimMat);
    plate.rotation.x = Math.PI / 2;
    plate.rotation.z = Math.PI / 2;
    s.add(plate);
    const glow = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.3, 4, 10), sconceMat);
    glow.position.z = 0.09;
    s.add(glow);
    s.position.set(x, 2.6, z);
    s.rotation.y = ry;
    scene.add(s);
  }
  [-8.4, -5.2, 5.2, 8.4].forEach((sx) => sconce(sx, ROOM.hd - 0.1, Math.PI));
  sconce(-ROOM.hw + 0.1, 2.6, Math.PI / 2);
  sconce(-ROOM.hw + 0.1, 5.9, Math.PI / 2);
  sconce(ROOM.hw - 0.1, 6.3, -Math.PI / 2);
  sconce(ROOM.hw - 0.1, -7.6, -Math.PI / 2);

  // console shelves beneath the back-wall art, with vases and boxes
  [-3.7, 3.7].forEach((sx, i) => {
    const shelf = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.06, 0.42),
      new THREE.MeshStandardMaterial({ color: 0xfaf5ea, roughness: 0.4 })
    );
    shelf.position.set(sx, 1.05, -ROOM.hd + 0.33);
    shelf.castShadow = true;
    scene.add(shelf);
    [[-0.55, 0.35], [0.55, 0.35]].forEach(([lx]) => {
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.32, 0.32), trimMat);
      bracket.position.set(sx + lx, 0.86, -ROOM.hd + 0.3);
      scene.add(bracket);
    });
    const v = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.13, 0.4, 18),
      new THREE.MeshStandardMaterial({ color: i ? 0x2b2118 : 0xe9ddc7, roughness: 0.4 })
    );
    v.position.set(sx - 0.45, 1.28, -ROOM.hd + 0.33);
    v.castShadow = true;
    scene.add(v);
    const gb = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.15, 0.28),
      new THREE.MeshStandardMaterial({ color: i ? 0xe9ddc7 : 0x2b2118, roughness: 0.55 })
    );
    gb.position.set(sx + 0.35, 1.16, -ROOM.hd + 0.33);
    gb.rotation.y = 0.3;
    gb.castShadow = true;
    scene.add(gb);
    const gband = new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.04, 0.29), trimMat);
    gband.position.copy(gb.position);
    gband.rotation.copy(gb.rotation);
    scene.add(gband);
  });

  // gallery portraits: entrance wall + both side walls
  const artSpots = [
    { pos: [-6.8, 2.85, ROOM.hd - 0.12], ry: Math.PI },
    { pos: [6.8, 2.85, ROOM.hd - 0.12], ry: Math.PI },
    { pos: [-ROOM.hw + 0.12, 2.85, 4.2], ry: Math.PI / 2 },
    { pos: [ROOM.hw - 0.12, 2.85, -5.8], ry: -Math.PI / 2 },
    { pos: [-ROOM.hw + 0.12, 2.75, -6.9], ry: Math.PI / 2, small: true },
    { pos: [ROOM.hw - 0.12, 2.75, 2.9], ry: -Math.PI / 2, small: true },
  ];
  WALL_ART.forEach((url, i) => {
    const spot = artSpots[i % artSpots.length];
    const art = campaignFrame(
      url,
      track(silhouetteTexture([30, 19, 11], [143, 101, 53], 700 + i)),
      spot.small ? 1.35 : 1.8, spot.small ? 1.95 : 2.6
    );
    art.position.set(...spot.pos);
    art.rotation.y = spot.ry;
    scene.add(art);
  });

  /* --------------------------- furnishing --------------------------- */

  const bench = new THREE.Group();
  const cushion = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 0.28, 0.62),
    new THREE.MeshStandardMaterial({ color: 0xf0e7d6, roughness: 0.9 })
  );
  cushion.position.y = 0.47;
  cushion.castShadow = true;
  bench.add(cushion);
  [[-0.85, -0.22], [0.85, -0.22], [-0.85, 0.22], [0.85, 0.22]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.34, 12), trimMat);
    leg.position.set(lx, 0.17, lz);
    bench.add(leg);
  });
  bench.position.set(-3.9, 0, 6.1);
  bench.rotation.y = 0.45;
  scene.add(bench);
  contactShadow(-3.9, 6.1, 2.6);

  // round boutique table with gift boxes, near the entrance
  const table = new THREE.Group();
  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.85, 0.06, 40),
    new THREE.MeshStandardMaterial({ color: 0xfaf5ea, roughness: 0.4 })
  );
  top.position.y = 0.82;
  top.castShadow = true;
  table.add(top);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.8, 14), trimMat);
  stem.position.y = 0.41;
  table.add(stem);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.05, 40), trimMat);
  base.position.y = 0.025;
  table.add(base);
  [[-0.25, 0.1, 0.5, 0xe9ddc7], [0.3, -0.15, -0.3, 0x2b2118], [0.05, 0.35, 1.2, 0xf3ead9]]
    .forEach(([bx, bz, r, col], i) => {
      const gb = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.15, 0.28),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.55 })
      );
      gb.position.set(bx, 0.93 + i * 0.0, bz * 0.8);
      gb.rotation.y = r;
      gb.castShadow = true;
      table.add(gb);
      const gband = new THREE.Mesh(new THREE.BoxGeometry(0.41, 0.04, 0.29), trimMat);
      gband.position.copy(gb.position);
      gband.rotation.copy(gb.rotation);
      table.add(gband);
    });
  table.position.set(-6.2, 0, 3.6);
  scene.add(table);
  contactShadow(-6.2, 3.6, 2.4);

  // potted trees in the front corners
  function tree(x, z) {
    const t = new THREE.Group();
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.34, 0.52, 24),
      new THREE.MeshStandardMaterial({ color: 0xd8cbb0, roughness: 0.8 })
    );
    pot.position.y = 0.26;
    pot.castShadow = true;
    t.add(pot);
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.07, 1.3, 10),
      new THREE.MeshStandardMaterial({ color: 0x6d5138, roughness: 0.9 })
    );
    trunk.position.y = 1.1;
    t.add(trunk);
    const rndT = mulberry(Math.floor(x * 7 + z * 13) | 1);
    const leaf = new THREE.MeshStandardMaterial({ color: 0x8f9469, roughness: 1 });
    for (let i = 0; i < 5; i++) {
      const blob = new THREE.Mesh(new THREE.SphereGeometry(0.42 + rndT() * 0.22, 12, 10), leaf);
      blob.position.set((rndT() - 0.5) * 0.8, 1.9 + rndT() * 0.8, (rndT() - 0.5) * 0.8);
      blob.scale.y = 0.8;
      blob.castShadow = true;
      t.add(blob);
    }
    t.position.set(x, 0, z);
    scene.add(t);
    contactShadow(x, z, 1.8);
  }
  tree(-11.8, 8.1);
  tree(11.8, 8.1);

  // drifting gold motes in the skylight beam
  const moteGeo = new THREE.BufferGeometry();
  const motePos = new Float32Array(240 * 3);
  const rndM = mulberry(21);
  for (let i = 0; i < 240; i++) {
    motePos[i * 3] = (rndM() - 0.5) * 9;
    motePos[i * 3 + 1] = rndM() * ROOM.h;
    motePos[i * 3 + 2] = (rndM() - 0.5) * 6 + 0.5;
  }
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  const motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({
    color: 0xd9bc8c, size: 0.018, transparent: true, opacity: 0.5, depthWrite: false,
  }));
  scene.add(motes);

  /* ----------------------------- camera tour ----------------------------- */

  let stopIndex = 0;
  const targetPos = new THREE.Vector3(...ENTRY.pos);
  const lookCurrent = new THREE.Vector3(...ENTRY.look);
  const targetLook = new THREE.Vector3(...ENTRY.look);
  camera.position.set(ENTRY.pos[0], ENTRY.pos[1], ENTRY.pos[2] + 3.6);
  let yaw = 0, pitch = 0;
  let parallaxX = 0, parallaxY = 0;

  function goTo(i, instant = false) {
    stopIndex = ((i % STOPS.length) + STOPS.length) % STOPS.length;
    const s = STOPS[stopIndex];
    targetPos.set(...s.pos);
    targetLook.set(...s.look);
    yaw = 0; pitch = 0;
    if (instant) {
      camera.position.copy(targetPos);
      lookCurrent.copy(targetLook);
    }
    callbacks.onStop?.(stopIndex);
  }

  /* ------------------------------ pointer ------------------------------ */

  const raycaster = new THREE.Raycaster();
  let dragging = false, moved = 0, lastX = 0, lastY = 0;

  const onDown = (e) => {
    dragging = true; moved = 0;
    lastX = e.clientX; lastY = e.clientY;
    canvas.classList.add('dragging');
    canvas.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    parallaxX = (e.clientX / window.innerWidth - 0.5);
    parallaxY = (e.clientY / window.innerHeight - 0.5);
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    moved += Math.abs(dx) + Math.abs(dy);
    lastX = e.clientX; lastY = e.clientY;
    yaw = THREE.MathUtils.clamp(yaw - dx * 0.0022, -0.85, 0.85);
    pitch = THREE.MathUtils.clamp(pitch - dy * 0.0018, -0.4, 0.4);
  };
  const onUp = (e) => {
    dragging = false;
    canvas.classList.remove('dragging');
    if (moved < 7) {
      const ndc = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(clickables)[0];
      if (hit) {
        if (hit.object.userData.mirror) callbacks.onMirror?.();
        else goTo(hit.object.userData.stopIndex);
      }
    }
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);

  // scroll wheel walks the tour — the easiest way to move
  let wheelLock = 0;
  const onWheel = (e) => {
    const now = performance.now();
    if (now - wheelLock < 900 || Math.abs(e.deltaY) < 12) return;
    wheelLock = now;
    goTo(stopIndex + (e.deltaY > 0 ? 1 : -1));
  };
  canvas.addEventListener('wheel', onWheel, { passive: true });

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  /* ------------------------------ animate ------------------------------ */

  const clock = new THREE.Clock();
  const lookDir = new THREE.Vector3();
  const RIGHT = new THREE.Vector3();
  const UP = new THREE.Vector3(0, 1, 0);
  let raf = 0;

  function animate() {
    raf = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    camera.position.lerp(targetPos, 0.045);
    camera.position.y += Math.sin(t * 1.1) * 0.0012;
    lookCurrent.lerp(targetLook, 0.05);

    // gently drift the view back to centre when the user lets go
    if (!dragging) { yaw *= 0.985; pitch *= 0.985; }

    lookDir.subVectors(lookCurrent, camera.position).normalize();
    lookDir.applyAxisAngle(UP, yaw - parallaxX * 0.05);
    RIGHT.crossVectors(lookDir, UP).normalize();
    lookDir.applyAxisAngle(RIGHT, pitch - parallaxY * 0.03);
    camera.lookAt(
      camera.position.x + lookDir.x,
      camera.position.y + lookDir.y,
      camera.position.z + lookDir.z
    );

    const pos = moteGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) - 0.0011;
      if (y < 0) y = ROOM.h;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();

  /* ------------------------------ dispose ------------------------------ */

  function dispose() {
    cancelAnimationFrame(raf);
    canvas.removeEventListener('pointerdown', onDown);
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerup', onUp);
    canvas.removeEventListener('wheel', onWheel);
    window.removeEventListener('resize', onResize);
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
      }
    });
    disposables.forEach(d => d.dispose?.());
    envTex.dispose();
    pmrem.dispose();
    renderer.dispose();
  }

  return { goTo, dispose };
}
