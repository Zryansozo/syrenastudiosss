import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { paintStartup, STARTUP_DURATION } from './startup';
import { createPixelWorld, STATION_SPACING } from './pixelWorld';

// The handheld is 3D; a continuously animated pixel world is mapped onto its glass.
export function createSwitchStage(host, projects, onAction, onHover) {
  const tokens = getComputedStyle(host);
  const token = (name, fallback) => tokens.getPropertyValue(name).trim() || fallback;
  const colors = {
    navy: token('--navy', '#202B46'), ice: token('--ice', '#DCE8FA'),
    blue: token('--cobalt', '#779EE8'), butter: token('--butter', '#F7E49A'),
  };
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-7.4, 7.4, 4, -4, .1, 100);
  camera.position.set(0, 1.1, 24);
  camera.lookAt(0, -.15, 0);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  scene.environmentIntensity = .35;
  room.dispose();
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xe8f0ff, 0x344563, .7));
  const key = new THREE.DirectionalLight(0xf4f7ff, 1.7);
  key.position.set(-5, 8, 10);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb9d0ff, 1.2);
  rim.position.set(7, 2, -4);
  scene.add(rim);

  const resources = new Set();
  const hitTargets = [];
  const buttonGroups = [];
  const root = new THREE.Group();
  scene.add(root);
  let disposed = false;
  let selected = 0;
  let overview = false;
  let sleeping = false;
  let paused = false;
  let visible = true;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let cameraOffset = 0;
  let travelFrom = 0;
  let travelTarget = 0;
  let travelElapsed = 1;
  let direction = 1;
  let motionOverride = false;
  let pointerX = 0;
  let pointerY = 0;
  let pressedUntil = 0;
  let pressedAction = '';
  let downPoint = null;
  let screenDirty = true;
  let startup = 'done';
  let startupTime = 0;
  let lastScreenPaint = -Infinity;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function material(color, extra = {}) {
    const value = new THREE.MeshStandardMaterial({ color, roughness: .43, metalness: .12, ...extra });
    resources.add(value);
    return value;
  }
  function box(parent, w, h, d, radius, mat, x = 0, y = 0, z = 0) {
    const geometry = new RoundedBoxGeometry(w, h, d, 3, radius);
    resources.add(geometry);
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  function plane(parent, w, h, mat, x, y, z) {
    const geometry = new THREE.PlaneGeometry(w, h);
    resources.add(geometry);
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  function cylinder(parent, radius, depth, mat, x, y, z) {
    const geometry = new THREE.CylinderGeometry(radius, radius, depth, 48);
    resources.add(geometry);
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }
  function canvasTexture(width, height, paint) {
    const art = document.createElement('canvas');
    art.width = width;
    art.height = height;
    const context = art.getContext('2d');
    paint(context, width, height);
    const texture = new THREE.CanvasTexture(art);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    resources.add(texture);
    return texture;
  }
  function basicTexture(texture, extra = {}) {
    const mat = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false, ...extra });
    resources.add(mat);
    return mat;
  }
  function label(parent, text, w, h, x, y, z, color = '#e8edf1') {
    const texture = canvasTexture(256, 128, (ctx) => {
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '500 77px Arial';
      ctx.fillText(text, 128, 68);
    });
    return plane(parent, w, h, basicTexture(texture, { transparent: true, depthWrite: false }), x, y, z);
  }

  const dark = material(colors.navy, { roughness: .32 });
  const edge = material('#111b25', { roughness: .29, metalness: .25 });
  const rubber = material('#151e27', { roughness: .76, metalness: .02 });
  const ring = material('#45505b', { roughness: .38, metalness: .2 });
  const leftShell = material(colors.ice, { roughness: .4 });
  const rightShell = material(colors.blue, { roughness: .4 });
  const activeButton = material(colors.butter, { roughness: .45 });
  const seam = material('#52555c', { metalness: .4 });

  // Tablet, rails, rim and the recessed glass display.
  box(root, 9.55, 5.22, .63, .23, edge, 0, 0, -.08);
  box(root, 9.47, 5.14, .23, .2, dark, 0, 0, .25);
  box(root, 8.79, 4.66, .09, .13, material('#101a23', { roughness: .19 }), 0, 0, .4);
  box(root, .045, 4.84, .46, .015, seam, -4.79, 0, 0);
  box(root, .045, 4.84, .46, .015, seam, 4.79, 0, 0);

  const screenMat = new THREE.MeshBasicMaterial({ toneMapped: false });
  resources.add(screenMat);
  const screen = plane(root, 8.32, 4.39, screenMat, 0, 0, .456);
  screen.userData.action = 'screen';
  hitTargets.push(screen);
  // Small glass highlights stay outside the content area.
  const glint = material('#dfefff', { transparent: true, opacity: .18, metalness: .8, roughness: .08 });
  box(root, 7.9, .012, .012, .005, glint, 0, 2.26, .48);
  for (let side = -1; side <= 1; side += 2) {
    for (let n = 0; n < 5; n++) box(root, .075, .016, .025, .006, edge, side * (3.58 + n * .13), -2.39, .39);
  }

  // Joy-Cons: separate back shells and face plates give a visible moulding seam.
  for (const [side, mat] of [[-1, leftShell], [1, rightShell]]) {
    const x = side * 5.58;
    box(root, 1.72, 5.23, .77, .56, mat, x, 0, -.01);
    box(root, 1.69, 5.13, .32, .48, mat, x, .015, .32);
    const shoulderFront = box(root, 1.43, .28, .55, .12, rubber, x, 2.47, -.12);
    shoulderFront.userData = { action: side < 0 ? 'previous' : 'next', hint: side < 0 ? 'Previous project' : 'Next project' };
    hitTargets.push(shoulderFront);
    const shoulder = box(root, 1.28, .12, .23, .05, rubber, x, 2.63, -.2);
    shoulder.userData.action = side < 0 ? 'previous' : 'next';
    hitTargets.push(shoulder);
    // Screw heads and the little player indicator along the rail.
    for (const y of [-2.12, 2.13]) cylinder(root, .045, .015, seam, x + side * .48, y, .49);
    for (let i = 0; i < 4; i++) box(root, .025, .065, .025, .009, i === 0 ? material('#dcf1b3') : edge, x - side * .72, -.17 - i * .13, .48);
  }

  function button(x, y, radius, text, action, hint) {
    const group = new THREE.Group();
    group.position.set(x, y, .53);
    root.add(group);
    cylinder(group, radius + .035, .055, edge, 0, 0, 0);
    const cap = cylinder(group, radius, .12, rubber, 0, 0, .085);
    group.userData.action = action;
    group.userData.baseZ = group.position.z;
    group.userData.cap = cap;
    cap.userData = { action, hint };
    hitTargets.push(cap);
    if (text) label(group, text, radius * 1.45, radius * .82, 0, 0, .151);
    buttonGroups.push(group);
    return group;
  }
  function stick(x, y, action, hint) {
    const group = new THREE.Group();
    group.position.set(x, y, .51);
    group.userData = { action, baseZ: .51 };
    root.add(group);
    cylinder(group, .48, .08, edge, 0, 0, 0);
    cylinder(group, .345, .23, ring, 0, 0, .14);
    const cap = cylinder(group, .355, .11, rubber, 0, 0, .28);
    group.userData.cap = cap;
    cylinder(group, .27, .012, rubber, 0, 0, .342);
    const geometry = new THREE.TorusGeometry(.285, .012, 8, 48);
    resources.add(geometry);
    const grip = new THREE.Mesh(geometry, ring);
    grip.position.z = .35;
    group.add(grip);
    cap.userData = { action, hint };
    hitTargets.push(cap);
    buttonGroups.push(group);
  }
  stick(-5.58, 1.13, 'previous', 'Previous project');
  stick(5.58, -.63, 'next', 'Next project');
  button(-5.58, -.17, .2, '▲', 'home', 'Project menu');
  button(-6.02, -.61, .2, '◀', 'previous', 'Previous project');
  button(-5.14, -.61, .2, '▶', 'next', 'Next project · D');
  button(-5.58, -1.05, .2, '▼', 'open', 'Open project');
  button(5.58, 1.68, .225, 'X', 'next', 'Next project · D');
  button(5.1, 1.2, .225, 'Y', 'home', 'Project menu');
  button(6.06, 1.2, .225, 'A', 'open', 'Open project · Enter');
  button(5.58, .72, .225, 'B', 'previous', 'Previous project · A');
  button(-5.05, 2.08, .13, '−', 'previous', 'Previous project');
  button(5.05, 2.08, .13, '+', 'next', 'Next project');
  button(5.08, -1.8, .18, '⌂', 'home', 'Project menu · H');
  const capture = box(root, .29, .29, .11, .04, rubber, -5.08, -1.8, .56);
  label(root, '▣', .22, .19, -5.08, -1.8, .62);
  capture.userData = { action: 'home', hint: 'Project menu' };
  hitTargets.push(capture);
  const power = box(root, .36, .075, .2, .03, rubber, -3.91, 2.65, -.04);
  power.userData = { action: 'power', hint: 'Sleep / wake screen' };
  hitTargets.push(power);
  for (let i = 0; i < 7; i++) box(root, .19, .04, .14, .018, edge, -.8 + i * .28, 2.63, -.1);

  // A soft contact shadow anchors the floating handheld without a large shadow map.
  const shadowTexture = canvasTexture(256, 128, (ctx, w, h) => {
    const gradient = ctx.createRadialGradient(w / 2, h / 2, 2, w / 2, h / 2, w / 2);
    gradient.addColorStop(0, '#18304455');
    gradient.addColorStop(.45, '#18304420');
    gradient.addColorStop(1, '#18304400');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  });
  const shadow = plane(scene, 13, 2.1, basicTexture(shadowTexture, { transparent: true, depthWrite: false }), 0, -3.09, -1.5);
  shadow.rotation.x = -.3;

  const world = createPixelWorld(projects, colors, () => { screenDirty = true; requestFrame(); });
  const worldTexture = new THREE.CanvasTexture(world.canvas);
  worldTexture.colorSpace = THREE.SRGBColorSpace;
  worldTexture.magFilter = THREE.NearestFilter;
  worldTexture.minFilter = THREE.NearestFilter;
  worldTexture.generateMipmaps = false;
  resources.add(worldTexture);
  const startupTexture = canvasTexture(960, 508, () => {});
  startupTexture.magFilter = THREE.NearestFilter;
  startupTexture.minFilter = THREE.NearestFilter;
  startupTexture.generateMipmaps = false;
  screenMat.map = worldTexture;

  function pick(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(hitTargets, false)[0];
  }
  function onMove(event) {
    const rect = canvas.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - .5;
    pointerY = (event.clientY - rect.top) / rect.height - .5;
    const hit = pick(event);
    canvas.style.cursor = hit ? 'pointer' : '';
    onHover(hit?.object.userData.hint || (hit?.object === screen ? sleeping ? 'Wake the project player' : startup !== 'done' ? 'Start your adventure · Enter' : overview ? 'Choose a project' : 'Open project · Enter' : ''));
    requestFrame();
  }
  function onLeave() {
    pointerX = 0;
    pointerY = 0;
    onHover('');
    requestFrame();
  }
  function onDown(event) {
    if (event.button !== 0) return;
    const hit = pick(event);
    downPoint = { x: event.clientX, y: event.clientY, object: hit?.object };
    if (hit) press(hit.object.userData.action === 'screen' ? 'open' : hit.object.userData.action);
    host.focus({ preventScroll: true });
  }
  function onUp(event) {
    if (!downPoint || event.button !== 0) return;
    const start = downPoint;
    downPoint = null;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10) return;
    const hit = pick(event);
    if (!hit || hit.object !== start.object) return;
    if (hit.object === screen) {
      if (sleeping) { onAction('power'); return; }
      if (startup !== 'done') { onAction('open'); return; }
      const action = world.hitTest(hit.uv.x, hit.uv.y, overview);
      if (action) onAction(action);
    } else onAction(hit.object.userData.action);
  }
  function onCancel() { downPoint = null; onLeave(); }
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);

  function press(action) {
    pressedAction = action;
    pressedUntil = performance.now() + 180;
    requestFrame();
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const halfWidth = 7.6;
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = halfWidth * height / width;
    camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    requestFrame();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  function requestFrame() {
    if (!disposed && visible && !document.hidden && !frame) frame = requestAnimationFrame(render);
  }
  function render(time) {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    // Use the actual active-frame time so slower devices do not slow the story down.
    const delta = lastTime ? Math.max(0, (time - lastTime) / 1000) : .016;
    lastTime = time;
    const reduced = motionQuery.matches && !motionOverride;
    const moving = !paused && !reduced && !sleeping;
    if (moving) elapsed += delta;
    if (startup === 'playing' && !paused && !sleeping) startupTime += delta;
    else if (startup === 'title' && moving) startupTime += delta;
    if (startup === 'playing' && startupTime >= STARTUP_DURATION) onAction('intro-complete');
    const ease = 1 - Math.exp(-Math.min(delta, .25) * 9);
    if (reduced) { cameraOffset = travelTarget; travelElapsed = 1; }
    else if (!paused && !sleeping) {
      travelElapsed = Math.min(1, travelElapsed + delta / .95);
      const t = travelElapsed * travelElapsed * (3 - 2 * travelElapsed);
      cameraOffset = travelElapsed === 1 ? travelTarget : travelFrom + (travelTarget - travelFrom) * t;
    }
    const travelling = cameraOffset !== travelTarget;
    const welcoming = startup !== 'done' && !sleeping;
    if (screenDirty || ((moving || travelling) && time - lastScreenPaint > 1000 / 30)) {
      if (welcoming) {
        paintStartup(startupTexture.image.getContext('2d'), { time: startupTime, phase: startup, reduced, colors });
        startupTexture.needsUpdate = true;
      } else {
        world.draw({ time: elapsed, selected, camera: cameraOffset, travelling, direction, overview, reduced, sleeping });
        worldTexture.needsUpdate = true;
      }
      screenMat.map = welcoming ? startupTexture : worldTexture;
      lastScreenPaint = time;
      screenDirty = false;
    }
    const tiltX = -.06 + (moving ? -pointerY * .09 : 0);
    const tiltY = -.13 + (moving ? pointerX * .12 : 0);
    root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, tiltX, reduced ? 1 : ease);
    root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, tiltY, reduced ? 1 : ease);
    root.rotation.z = -.035;
    root.position.y = moving ? Math.sin(elapsed * .8) * .07 : 0;
    const pressing = time < pressedUntil;
    buttonGroups.forEach((group) => {
      const depth = pressing && group.userData.action === pressedAction ? .055 : 0;
      group.position.z = group.userData.baseZ - depth;
      group.userData.cap.material = depth ? activeButton : rubber;
    });
    shadow.material.opacity = moving ? .85 + Math.sin(elapsed * .8) * .08 : .9;
    renderer.render(scene, camera);
    const tilting = Math.abs(root.rotation.x - tiltX) + Math.abs(root.rotation.y - tiltY) > .001;
    if (moving || (!paused && !sleeping && (travelling || startup === 'playing')) || pressing || tilting) requestFrame();
  }
  function onVisibility() { lastTime = 0; requestFrame(); }
  function onMotionChange() { screenDirty = true; requestFrame(); }
  document.addEventListener('visibilitychange', onVisibility);
  motionQuery.addEventListener('change', onMotionChange);
  resize();

  return {
    select(index) {
      let distance = index - selected;
      if (distance > projects.length / 2) distance -= projects.length;
      if (distance < -projects.length / 2) distance += projects.length;
      direction = distance < 0 ? -1 : 1;
      travelFrom = cameraOffset;
      travelTarget += distance * STATION_SPACING;
      travelElapsed = distance ? 0 : 1;
      selected = index; overview = false; sleeping = false; screenDirty = true; requestFrame();
    },
    setOverview(value) { overview = value; screenDirty = true; requestFrame(); },
    setSleeping(value) { sleeping = value; screenDirty = true; requestFrame(); },
    setStartup(value) { startup = value; startupTime = 0; lastScreenPaint = -Infinity; screenDirty = true; requestFrame(); },
    setPaused(value) { paused = value; lastTime = 0; screenDirty = true; requestFrame(); },
    setMotionOverride(value) { motionOverride = value; screenDirty = true; requestFrame(); },
    setVisible(value) { visible = value; lastTime = 0; if (!value) { cancelAnimationFrame(frame); frame = 0; } else requestFrame(); },
    press,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotionChange);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onCancel);
      world.dispose();
      resources.forEach((resource) => resource.dispose());
      environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
