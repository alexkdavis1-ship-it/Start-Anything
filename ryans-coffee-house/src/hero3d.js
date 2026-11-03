// 3D hero for the Ryan's Coffee House demo.
// Bundled into index.html by `npm run build` (see build.mjs).
//
// Choreography (p = scroll progress through the pinned hero, 0..1):
//   0.00-0.30  Pour:   milk streams into the cup, latte art blooms
//   0.30-0.75  Splash: the cup tilts toward you, coffee pours over the rim,
//                      spin sprays droplets, beans blast outward
//   0.75-1.00  Sip:    cup settles upright and rises
// Scroll speed also spins the cup (and reverses it when scrolling up).

import {
  ACESFilmicToneMapping, CanvasTexture, CircleGeometry, CylinderGeometry, DirectionalLight, DynamicDrawUsage,
  Float32BufferAttribute, Group, InstancedMesh, LatheGeometry, MathUtils, Matrix4, Mesh, MeshBasicMaterial,
  MeshPhysicalMaterial, PerspectiveCamera, PlaneGeometry, PMREMGenerator, PointLight, Quaternion, Scene,
  SphereGeometry, SRGBColorSpace, TorusGeometry, Vector2, Vector3, WebGLRenderer, Color, Euler
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

(function () {
  const hero = document.querySelector('.hero3d');
  const canvas = hero && hero.querySelector('.hero3d__canvas');
  const stageEl = hero && hero.querySelector('.hero3d__stage');
  if (!canvas || !stageEl) return;

  const root = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = innerWidth < 760 || /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (err) {
    return; // the SVG fallback cup stays visible
  }

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const range = (v, a, b) => clamp((v - a) / (b - a));
  const smooth = (t) => t * t * (3 - 2 * t);
  const bump = (v, a, b) => Math.sin(Math.PI * range(v, a, b));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const lerp = MathUtils.lerp;
  const rand = (a, b) => a + Math.random() * (b - a);

  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const key = new DirectionalLight(0xfff0dc, 1.7);
  key.position.set(3, 5, 6);
  scene.add(key);
  const rimA = new PointLight(0x30b8b8, 60, 30, 2);
  rimA.position.set(-4, 2.5, -2);
  scene.add(rimA);
  const rimB = new PointLight(0x7dd9d6, 35, 30, 2);
  rimB.position.set(4, -1.5, -1.5);
  scene.add(rimB);

  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  function canvasTex(w, h, draw) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    draw(g, w, h);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = maxAniso;
    return t;
  }

  // ------------------------------------------------------------------ rig
  // rig = everything, positioned/scaled so the cup sits centered in .hero3d__stage
  const rig = new Group();
  scene.add(rig);
  const cup = new Group(); // spin/tilt pivot at the cup's middle
  rig.add(cup);
  const body = new Group();
  body.position.y = -0.55;
  cup.add(body);

  // cup profile (height 1, rim radius .5)
  const R = (y) => 0.36 + 0.14 * (y - 0.05) / 0.95;
  const prof = [new Vector2(0.0001, 0), new Vector2(0.28, 0), new Vector2(0.335, 0.012), new Vector2(0.355, 0.04)];
  for (let i = 0; i <= 14; i++) { const y = 0.06 + i * (0.94 / 14); prof.push(new Vector2(R(y), y)); }
  prof.push(new Vector2(0.507, 1.012), new Vector2(0.5, 1.024), new Vector2(0.487, 1.012), new Vector2(0.476, 0.99));
  for (let i = 1; i <= 12; i++) { const y = 0.99 - i * (0.88 / 12); prof.push(new Vector2(R(y) - 0.026, y)); }
  prof.push(new Vector2(0.0001, 0.11));

  const ceramic = new MeshPhysicalMaterial({ color: 0xfbfcfe, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.06 });
  body.add(new Mesh(new LatheGeometry(prof, mobile ? 72 : 112), ceramic));

  const handle = new Mesh(new TorusGeometry(0.19, 0.046, 20, 56, Math.PI * 1.25), ceramic);
  handle.rotation.z = -Math.PI * 0.625;
  handle.position.set(R(0.55) + 0.055, 0.55, 0);
  handle.scale.set(1, 1.15, 1);
  body.add(handle);

  // printed sleeve: Ryan's badge on both sides + navy/teal rings
  const PW = mobile ? 1024 : 2048, PH = PW / 4;
  const printCanvas = document.createElement('canvas');
  printCanvas.width = PW; printCanvas.height = PH;
  const printTex = new CanvasTexture(printCanvas);
  printTex.colorSpace = SRGBColorSpace;
  printTex.anisotropy = maxAniso;
  function drawPrint(img) {
    const g = printCanvas.getContext('2d');
    g.clearRect(0, 0, PW, PH);
    g.fillStyle = '#002858'; g.fillRect(0, 0, PW, PH * 0.04);
    g.fillStyle = '#30b8b8'; g.fillRect(0, PH * 0.065, PW, PH * 0.014);
    g.fillStyle = '#002858'; g.fillRect(0, PH * 0.955, PW, PH * 0.045);
    const s = PH * 0.8;
    [0.25, 0.75].forEach((u) => {
      const x = u * PW - s / 2, y = PH * 0.5 - s / 2;
      if (img) {
        g.drawImage(img, x, y, s, s);
      } else {
        g.fillStyle = '#002858'; g.beginPath(); g.arc(u * PW, PH * 0.5, s * 0.42, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#ffffff'; g.font = `700 ${Math.round(s * 0.13)}px Georgia, serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText("RYAN'S", u * PW, PH * 0.47); g.font = `700 ${Math.round(s * 0.06)}px Georgia, serif`; g.fillText('COFFEE HOUSE', u * PW, PH * 0.57);
      }
    });
    printTex.needsUpdate = true;
  }
  drawPrint(null);
  (function loadBadge() {
    const ids = ['badgeRingPath', 'badgeTagPath', 'badgeInner'];
    const defs = ids.map((id) => document.getElementById(id)).filter(Boolean).map((el) => el.outerHTML).join('');
    const base = document.getElementById('badge-base');
    const ring = document.getElementById('badge-ring');
    if (!base || !ring) return;
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 234 234" width="512" height="512"><defs>' +
      defs + '</defs>' + base.outerHTML + ring.outerHTML + '</svg>';
    svg = svg.replace(/<textPath href="(#[^"]+)"/g, '<textPath href="$1" xlink:href="$1"');
    const img = new Image();
    img.onload = () => {
      drawPrint(img);
      try { printCanvas.getContext('2d').getImageData(0, 0, 1, 1); } catch (e) { drawPrint(null); }
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  })();
  const y0 = 0.15, y1 = 0.87;
  const sleeve = new Mesh(
    new CylinderGeometry(R(y1) + 0.004, R(y0) + 0.004, y1 - y0, mobile ? 96 : 144, 1, true),
    new MeshPhysicalMaterial({ map: printTex, transparent: true, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.06, polygonOffset: true, polygonOffsetFactor: -2 })
  );
  sleeve.position.y = (y0 + y1) / 2;
  sleeve.rotation.y = -Math.PI / 2; // badge at u=.25 faces the camera, handle sits between the two badges
  body.add(sleeve);

  // coffee + latte art
  const COFFEE_Y = 0.93;
  const coffeeR = R(COFFEE_Y) - 0.028;
  const cremaTex = canvasTex(512, 512, (g, w) => {
    const r = w / 2;
    const grd = g.createRadialGradient(r, r, 0, r, r, r);
    grd.addColorStop(0, '#c98b4b'); grd.addColorStop(0.55, '#9a5a2a'); grd.addColorStop(0.86, '#6b3a1c'); grd.addColorStop(1, '#3d1f0e');
    g.fillStyle = grd; g.fillRect(0, 0, w, w);
    for (let i = 0; i < 260; i++) {
      g.fillStyle = `rgba(255,220,170,${(Math.random() * 0.12).toFixed(3)})`;
      g.beginPath(); g.arc(Math.random() * w, Math.random() * w, Math.random() * 5 + 1, 0, Math.PI * 2); g.fill();
    }
  });
  function heart(g, x, y, s) {
    g.beginPath();
    g.moveTo(x, y + s * 0.9);
    g.bezierCurveTo(x - s * 1.3, y + s * 0.1, x - s * 1.0, y - s * 0.95, x - s * 0.35, y - s * 0.85);
    g.bezierCurveTo(x - s * 0.1, y - s * 0.8, x, y - s * 0.55, x, y - s * 0.45);
    g.bezierCurveTo(x, y - s * 0.55, x + s * 0.1, y - s * 0.8, x + s * 0.35, y - s * 0.85);
    g.bezierCurveTo(x + s * 1.0, y - s * 0.95, x + s * 1.3, y + s * 0.1, x, y + s * 0.9);
    g.closePath(); g.fill();
  }
  const artTex = canvasTex(512, 512, (g) => {
    g.fillStyle = '#fbf6ec'; g.shadowColor = 'rgba(251,246,236,.9)'; g.shadowBlur = 8;
    heart(g, 256, 300, 150); heart(g, 256, 178, 84); heart(g, 256, 106, 46);
    g.fillRect(253, 48, 6, 36);
  });
  const coffee = new Mesh(new CircleGeometry(coffeeR, 64), new MeshPhysicalMaterial({ map: cremaTex, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.04 }));
  coffee.rotation.x = -Math.PI / 2; coffee.position.y = COFFEE_Y;
  body.add(coffee);
  const art = new Mesh(new CircleGeometry(coffeeR * 0.97, 64), new MeshPhysicalMaterial({ map: artTex, transparent: true, opacity: 0, roughness: 0.3, clearcoat: 0.8, depthWrite: false }));
  art.rotation.x = -Math.PI / 2; art.position.y = COFFEE_Y + 0.003;
  body.add(art);

  // soft contact shadow (does not spin)
  const shadowTex = canvasTex(256, 256, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    grd.addColorStop(0, 'rgba(0,15,30,.55)'); grd.addColorStop(1, 'rgba(0,15,30,0)');
    g.fillStyle = grd; g.fillRect(0, 0, w, w);
  });
  const shadow = new Mesh(new PlaneGeometry(1.7, 1.7), new MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -0.63;
  rig.add(shadow);

  // milk stream (wobbles in the vertex shader)
  const uTime = { value: 0 };
  const milkMat = new MeshPhysicalMaterial({ color: 0xfbf7ef, roughness: 0.22, clearcoat: 0.7, clearcoatRoughness: 0.1 });
  milkMat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uTime;
    sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\n' +
      'float wv = sin(position.y * 9.0 - uTime * 14.0) * 0.014 + sin(position.y * 23.0 - uTime * 21.0) * 0.006;\n' +
      'transformed.x += wv; transformed.z += cos(position.y * 7.0 - uTime * 11.0) * 0.009;');
  };
  const streamGeo = new CylinderGeometry(0.036, 0.044, 1, 14, 40, true);
  streamGeo.translate(0, 0.5, 0);
  const stream = new Mesh(streamGeo, milkMat);
  stream.frustumCulled = false;
  rig.add(stream);
  const SURFACE = COFFEE_Y - 0.55, STREAM_TOP = 7, POUR_A = 0.16;
  stream.rotation.z = -POUR_A;
  let head = STREAM_TOP, tail = STREAM_TOP;

  // coffee beans (deformed spheres with a center crease)
  function beanGeometry() {
    const g = new SphereGeometry(1, 24, 16);
    const pos = g.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i); let z = pos.getZ(i);
      const cx = 0.16 * Math.sin(y * 2.6);
      const d = Math.exp(-((x - cx) ** 2) / 0.012);
      let shade = 1;
      if (z > 0) { z -= 0.6 * d * z; shade = 1 - 0.78 * d; }
      pos.setXYZ(i, x * 0.66, y, z * 0.46);
      cols[i * 3] = cols[i * 3 + 1] = cols[i * 3 + 2] = shade;
    }
    g.setAttribute('color', new Float32BufferAttribute(cols, 3));
    g.computeVertexNormals();
    return g;
  }
  const NB = mobile ? 22 : 40;
  const beans = new InstancedMesh(beanGeometry(), new MeshPhysicalMaterial({ color: 0x7a4426, roughness: 0.4, clearcoat: 0.55, clearcoatRoughness: 0.3, vertexColors: true }), NB);
  beans.instanceMatrix.setUsage(DynamicDrawUsage);
  beans.frustumCulled = false;
  rig.add(beans);
  const bd = Array.from({ length: NB }, (_, i) => ({
    r: rand(0.95, 2.15), a: rand(0, Math.PI * 2), w: rand(0.22, 0.55) * (Math.random() < 0.5 ? -1 : 1),
    y: rand(-0.95, 1.05), ph: rand(0, 6.28), s: rand(0.06, 0.095),
    ax: new Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize(), sp: rand(0.6, 2.2), rot: rand(0, 6.28),
    fly: i % 4 === 0
  }));

  // droplets: coffee + milk, stretched along their velocity
  const MAXD = mobile ? 200 : 360;
  const drops = new InstancedMesh(new SphereGeometry(1, 10, 8), new MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.04 }), MAXD);
  drops.instanceMatrix.setUsage(DynamicDrawUsage);
  drops.frustumCulled = false;
  rig.add(drops);
  const COFFEE_C = new Color(0x4a250f), LATTE_C = new Color(0xa8703f), MILK_C = new Color(0xf6f1e7);
  const dp = new Float32Array(MAXD * 3), dv = new Float32Array(MAXD * 3), dl = new Float32Array(MAXD), ds = new Float32Array(MAXD);
  let dNext = 0;
  const m4 = new Matrix4(), q = new Quaternion(), v3 = new Vector3(), sc = new Vector3(), UP = new Vector3(0, 1, 0), dir = new Vector3();
  const ZERO = new Matrix4().makeScale(0, 0, 0);
  for (let i = 0; i < MAXD; i++) { drops.setMatrixAt(i, ZERO); drops.setColorAt(i, COFFEE_C); }
  function spawn(x, y, z, vx, vy, vz, size, milk) {
    if (RM) return;
    const i = dNext; dNext = (dNext + 1) % MAXD;
    dp[i * 3] = x; dp[i * 3 + 1] = y; dp[i * 3 + 2] = z;
    dv[i * 3] = vx; dv[i * 3 + 1] = vy; dv[i * 3 + 2] = vz;
    dl[i] = rand(1.1, 1.9); ds[i] = size;
    drops.setColorAt(i, milk ? MILK_C : (Math.random() < 0.7 ? LATTE_C : COFFEE_C));
    drops.instanceColor.needsUpdate = true;
  }
  const rimPt = new Vector3(), tanV = new Vector3(), impact = new Vector3();
  const tiltE = new Euler();
  function rimPoint(phi, out) { return out.set(0.5 * Math.sin(phi), 0.47, 0.5 * Math.cos(phi)).applyEuler(cup.rotation); }
  function burst(n, power) {
    for (let k = 0; k < n; k++) {
      const phi = rand(0, Math.PI * 2);
      rimPoint(phi, rimPt);
      tanV.set(Math.sin(phi), 0, Math.cos(phi)).applyEuler(cup.rotation);
      spawn(rimPt.x, rimPt.y, rimPt.z,
        tanV.x * rand(1, 2.6) * power, rand(1.2, 2.8) * power, tanV.z * rand(1, 2.6) * power,
        rand(0.012, 0.03), Math.random() < 0.2);
    }
  }

  // ------------------------------------------------------------------ framing
  const base = { x: 0, y: 0, s: 1 };
  function layout() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const cr = canvas.getBoundingClientRect(), sr = stageEl.getBoundingClientRect();
    const unit = (2 * camera.position.z * Math.tan(MathUtils.degToRad(camera.fov / 2))) / h; // world units per css px at z=0
    base.x = ((sr.left + sr.width / 2) - (cr.left + cr.width / 2)) * unit;
    base.y = -((sr.top + sr.height / 2) - (cr.top + cr.height / 2)) * unit;
    base.s = Math.min((sr.height * 0.74) / 1.12, (sr.width * 0.6) / 1.3) * unit;
    needsRender = true;
  }
  let needsRender = true;
  new ResizeObserver(layout).observe(canvas);
  addEventListener('orientationchange', () => setTimeout(layout, 250));

  // ------------------------------------------------------------------ loop
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); root.classList.remove('has-3d'); });

  let t = 0, last = performance.now(), lastP = 0, spin = 0, spinDir = 1, artP = RM ? 1 : 0, introT = RM ? 1 : 0;
  let phase = -1, crossed = false, burstCool = 0, pourAcc = 0, spillAcc = 0, sprayAcc = 0, crownAcc = 0;
  let mx = 0, my = 0, smx = 0, smy = 0;
  addEventListener('pointermove', (e) => { mx = (e.clientX / innerWidth) * 2 - 1; my = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });

  function progress() {
    const r = hero.getBoundingClientRect();
    const dist = r.height - innerHeight;
    return dist > 0 ? clamp(-r.top / dist) : 0;
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;
    if (RM && !needsRender) return;
    needsRender = false;
    if (!RM) t += dt;
    uTime.value = t;

    const p = RM ? 0 : progress();
    const pv = (p - lastP) / Math.max(dt, 1e-3);
    lastP = p;
    if (Math.abs(pv) > 0.02) spinDir = pv > 0 ? 1 : -1;
    spin = lerp(spin, Math.min(16, Math.abs(pv) * 10), 0.08);

    // phase + css hooks
    const ph = p < 0.3 ? 0 : p < 0.75 ? 1 : 2;
    if (ph !== phase) { phase = ph; hero.dataset.phase = String(ph); }
    hero.style.setProperty('--p', p.toFixed(4));

    // intro once the loader is gone
    if (!RM && root.classList.contains('loaded')) introT = Math.min(1, introT + dt / 1.6);
    const intro = easeOut(introT);

    // cup motion
    smx = lerp(smx, mx, 0.05); smy = lerp(smy, my, 0.05);
    const tilt = smooth(bump(p, 0.32, 0.74));
    if (!RM) cup.rotation.y += (0.5 + spin) * dt * spinDir + (1 - intro) * dt * 5;
    cup.rotation.x = 0.3 + 0.42 * tilt + smy * 0.06;
    cup.rotation.z = Math.sin(t * 1.7) * 0.09 * tilt + Math.sin(t * 0.8) * 0.03 - smx * 0.06;
    tiltE.set(cup.rotation.x, 0, cup.rotation.z);
    const rise = smooth(range(p, 0.78, 1));
    rig.position.set(base.x + smx * 0.08 * base.s, base.y + (Math.sin(t * 1.2) * 0.03 + rise * 0.18 - (1 - intro) * 1.4) * base.s, 0);
    rig.scale.setScalar(base.s * (0.55 + 0.45 * intro) * (1 + 0.1 * tilt - 0.08 * rise));
    shadow.material.opacity = (1 - tilt * 0.6) * (1 - rise * 0.7) * intro;

    // milk pour
    const pourOn = !RM && introT >= 1 && p < 0.28;
    if (pourOn) {
      tail = STREAM_TOP;
      head = Math.max(SURFACE, head - 11 * dt);
    } else {
      head = SURFACE;
      tail = Math.max(SURFACE, tail - 11 * dt);
    }
    const len = tail - head;
    impact.set(0, SURFACE, 0).applyEuler(tiltE);
    stream.visible = len > 0.02;
    stream.position.set(impact.x + Math.tan(POUR_A) * (head - SURFACE), impact.y + (head - SURFACE), impact.z);
    stream.scale.set(1, Math.max(0.001, len / Math.cos(POUR_A)), 1);
    const landed = pourOn && head <= SURFACE + 0.001;
    if (landed) artP = Math.min(1, artP + dt / 3.2);
    artP = Math.max(artP, range(p, 0, 0.28));
    art.material.opacity = smooth(artP);
    art.scale.setScalar(0.3 + 0.7 * smooth(artP));
    if (landed) {
      crownAcc += dt * 46;
      while (crownAcc >= 1) {
        crownAcc -= 1;
        const a = rand(0, Math.PI * 2), sp = rand(0.35, 0.8);
        spawn(impact.x + Math.cos(a) * 0.05, impact.y + 0.02, impact.z + Math.sin(a) * 0.05, Math.cos(a) * sp, rand(0.9, 1.6), Math.sin(a) * sp, rand(0.008, 0.016), true);
      }
    }

    // spill + spray + bursts
    if (!RM) {
      if (p > 0.32 && !crossed) { crossed = true; burst(mobile ? 50 : 80, 1.1); }
      if (p < 0.26) crossed = false;
      burstCool -= dt;
      if (spin > 7 && burstCool <= 0) { burst(mobile ? 18 : 30, 0.9); burstCool = 0.35; }
      spillAcc += dt * Math.max(0, tilt - 0.3) * (mobile ? 170 : 260);
      while (spillAcc >= 1) {
        spillAcc -= 1;
        const phi = rand(-0.35, 0.35);
        rimPt.set(0.5 * Math.sin(phi), 0.47, 0.5 * Math.cos(phi)).applyEuler(tiltE);
        dir.set(Math.sin(phi) * 0.4, 0.25, 1).applyEuler(tiltE).normalize();
        spawn(rimPt.x, rimPt.y, rimPt.z, dir.x * rand(0.8, 1.4), dir.y * rand(0.8, 1.4), dir.z * rand(0.8, 1.4), rand(0.014, 0.03), false);
      }
      sprayAcc += dt * spin * (mobile ? 6 : 10);
      while (sprayAcc >= 1) {
        sprayAcc -= 1;
        const phi = rand(0, Math.PI * 2);
        rimPoint(phi, rimPt);
        tanV.set(Math.cos(phi) * spinDir, 0, -Math.sin(phi) * spinDir).applyEuler(cup.rotation);
        spawn(rimPt.x, rimPt.y, rimPt.z, tanV.x * spin * 0.18 + rimPt.x, rand(0.6, 1.5), tanV.z * spin * 0.18 + rimPt.z, rand(0.01, 0.022), false);
      }
    }

    // droplets
    for (let i = 0; i < MAXD; i++) {
      if (dl[i] <= 0) continue;
      dl[i] -= dt;
      const j = i * 3;
      dv[j + 1] -= 5.2 * dt;
      dp[j] += dv[j] * dt; dp[j + 1] += dv[j + 1] * dt; dp[j + 2] += dv[j + 2] * dt;
      if (dl[i] <= 0 || dp[j + 1] < -4) { dl[i] = 0; drops.setMatrixAt(i, ZERO); continue; }
      dir.set(dv[j], dv[j + 1], dv[j + 2]);
      const speed = dir.length();
      q.setFromUnitVectors(UP, speed > 1e-4 ? dir.multiplyScalar(1 / speed) : UP);
      const s = ds[i] * Math.min(1, dl[i] * 3);
      m4.compose(v3.set(dp[j], dp[j + 1], dp[j + 2]), q, sc.set(s, s * (1 + speed * 0.32), s));
      drops.setMatrixAt(i, m4);
    }
    drops.instanceMatrix.needsUpdate = true;

    // beans orbit, then blast outward on the splash and with fast scrolling
    const explode = clamp(bump(p, 0.3, 0.8) + spin * 0.035);
    const introR = lerp(4.5, 1, intro);
    for (let i = 0; i < NB; i++) {
      const b = bd[i];
      if (!RM) { b.a += b.w * dt * (1 + spin * 0.12); b.rot += b.sp * dt * (1 + spin * 0.25); }
      const r = b.r * (1 + explode * 1.5) * introR;
      v3.set(Math.cos(b.a) * r, b.y * (1 + explode * 0.55) + Math.sin(t * 0.9 + b.ph) * 0.07, Math.sin(b.a) * r * 0.85 + (b.fly ? explode * 3.4 : 0));
      q.setFromAxisAngle(b.ax, b.rot);
      m4.compose(v3, q, sc.setScalar(b.s * (b.fly ? 1 + explode * 0.7 : 1)));
      beans.setMatrixAt(i, m4);
    }
    beans.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
    if (!root.classList.contains('has-3d')) root.classList.add('has-3d');
  }

  layout();
  requestAnimationFrame(frame);
})();
