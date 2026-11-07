import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { paintStartup } from './startup';

const INK = '#183044';
const PAPER = '#f4f0e5';

// Both the handheld and the world rendered onto its screen are real 3D scenes.
// The screen uses a render target, so it keeps its perspective as the console tilts.
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
  const pendingImages = [];
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
  let galleryX = 0;
  let pointerX = 0;
  let pointerY = 0;
  let pressedUntil = 0;
  let pressedAction = '';
  let downPoint = null;
  let screenDirty = true;
  let startup = 'done';
  let startupTime = 0;
  let lastStartupPaint = -Infinity;
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

  const target = new THREE.WebGLRenderTarget(1440, 760, { depthBuffer: true });
  target.texture.colorSpace = THREE.SRGBColorSpace;
  const screenMat = new THREE.MeshBasicMaterial({ map: target.texture, toneMapped: false });
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

  // Build the artwork once, shared by the gallery exhibits and its overview menu.
  const artTextures = projects.map((project, index) => {
    let artImage = null;
    const texture = canvasTexture(1024, 730, () => {});
    const art = texture.image;
    const ctx = art.getContext('2d');
    function paint() {
      if (disposed) return;
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, 1024, 730);
      ctx.fillStyle = INK;
      ctx.textAlign = 'left';
      ctx.font = '600 17px monospace';
      ctx.fillText(`SYRENA STUDIO CONCEPT / ${String(index + 1).padStart(2, '0')}`, 35, 36);
      if (artImage) {
        const scale = Math.max(960 / artImage.width, 493 / artImage.height);
        ctx.save();
        ctx.beginPath();
        ctx.rect(32, 59, 960, 493);
        ctx.clip();
        ctx.drawImage(artImage, 32 + (960 - artImage.width * scale) / 2, 59 + (493 - artImage.height * scale) / 2, artImage.width * scale, artImage.height * scale);
        ctx.restore();
      } else if (project.id === 'tideline') {
        ctx.fillStyle = '#bfd5dc'; ctx.fillRect(32, 59, 960, 493);
        ctx.fillStyle = '#edbb88'; ctx.beginPath(); ctx.arc(779, 214, 75, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#6a969e'; ctx.beginPath(); ctx.moveTo(32, 400); ctx.quadraticCurveTo(400, 290, 992, 400); ctx.lineTo(992, 552); ctx.lineTo(32, 552); ctx.fill();
        ctx.fillStyle = '#f4dfaf'; ctx.beginPath(); ctx.moveTo(32, 500); ctx.quadraticCurveTo(650, 400, 992, 530); ctx.lineTo(992, 552); ctx.lineTo(32, 552); ctx.fill();
        ctx.fillStyle = INK; ctx.font = '15px monospace'; ctx.fillText('STAY A LITTLE LONGER', 85, 120);
        ctx.font = 'italic 76px Georgia'; ctx.fillText('Somewhere', 85, 252); ctx.fillText('by the sea.', 85, 334);
      } else {
        ctx.fillStyle = '#dfad99'; ctx.fillRect(32, 59, 960, 493);
        ctx.strokeStyle = '#b66e5e'; ctx.lineWidth = 2;
        for (let y = 80; y < 560; y += 25) {
          ctx.beginPath(); ctx.moveTo(32, y); ctx.bezierCurveTo(330, y - 60, 650, y + 60, 992, y); ctx.stroke();
        }
        ctx.fillStyle = INK; ctx.font = 'bold 104px Georgia'; ctx.fillText('Good', 105, 260);
        ctx.font = 'italic 110px Georgia'; ctx.fillText('currents.', 105, 370);
        ctx.font = '18px monospace'; ctx.fillText('LESS NOISE. MORE OCEAN.', 110, 487);
      }
      ctx.fillStyle = INK;
      ctx.font = '600 54px Arial'; ctx.fillText(project.title, 34, 625);
      ctx.font = '20px monospace'; ctx.fillStyle = '#5f787c'; ctx.fillText(project.category.toUpperCase(), 36, 677);
      ctx.fillStyle = '#c27061'; ctx.font = '38px Arial'; ctx.fillText('↗', 938, 633);
      texture.needsUpdate = true;
      screenDirty = true;
      requestFrame();
    }
    paint();
    if (project.image) {
      const image = new Image();
      pendingImages.push(image);
      image.onload = () => { artImage = image; paint(); };
      image.onerror = () => { image.onload = null; image.onerror = null; };
      image.src = project.image.src;
    }
    return texture;
  });

  const gallery = new THREE.Scene();
  gallery.background = new THREE.Color('#cadcda');
  gallery.fog = new THREE.Fog('#cadcda', 14, 42);
  gallery.add(new THREE.HemisphereLight('#fff1d6', '#6d9b9e', 3));
  const sun = new THREE.DirectionalLight('#fff4db', 3.5);
  sun.position.set(-5, 12, 9);
  gallery.add(sun);
  const galleryCamera = new THREE.PerspectiveCamera(44, 1440 / 760, .1, 80);
  const deck = box(gallery, 130, .3, 27, .1, material('#6b9699', { roughness: .65 }), 27, -2.1, 2);
  deck.rotation.z = 0;
  // Long deck lines and open arches establish a continuous, explorable room.
  for (let z = -8; z < 14; z += 1.4) box(gallery, 130, .012, .025, .005, material('#9cb9b5'), 27, -1.94, z);
  const exhibitFrames = [];
  const archMat = material('#e8dac1', { roughness: .8 });
  const plinthMat = material('#a7bfba', { roughness: .65 });
  projects.forEach((project, index) => {
    const x = index * 11;
    box(gallery, 7.03, 5.1, .2, .17, material(index % 2 ? '#c9b4d1' : '#df9f86'), x, .72, -.1);
    const panel = plane(gallery, 6.78, 4.83, basicTexture(artTextures[index]), x, .72, .02);
    exhibitFrames.push(panel);
    box(gallery, 7.5, .35, 2.8, .14, plinthMat, x, -1.75, .05);
    const arch = new THREE.Mesh(new THREE.TorusGeometry(3.7, .13, 10, 64, Math.PI), archMat);
    resources.add(arch.geometry);
    arch.position.set(x, 1.6, -2.2);
    gallery.add(arch);
    box(gallery, .26, 3.7, .26, .05, archMat, x - 3.7, -.25, -2.2);
    box(gallery, .26, 3.7, .26, .05, archMat, x + 3.7, -.25, -2.2);
    const sphereGeometry = new THREE.SphereGeometry(.57, 28, 20);
    resources.add(sphereGeometry);
    const pearl = new THREE.Mesh(sphereGeometry, material(index % 2 ? '#d9b4a0' : '#c4b7d9', { roughness: .24, metalness: .4 }));
    pearl.position.set(x + 4.5, -1.25, 1);
    gallery.add(pearl);
    const ornament = new THREE.Mesh(new THREE.TorusGeometry(.65, .15, 12, 32), archMat);
    resources.add(ornament.geometry);
    ornament.position.set(x - 4.7, -.8, .3);
    ornament.rotation.set(.2, -.3, .35);
    gallery.add(ornament);
  });

  const menu = new THREE.Scene();
  menu.background = new THREE.Color('#cbdcda');
  const menuCamera = new THREE.OrthographicCamera(-7.5, 7.5, 3.96, -3.96, .1, 30);
  menuCamera.position.z = 10;
  const menuTargets = artTextures.map((texture, index) => {
    const tile = plane(menu, 4.15, 2.96, basicTexture(texture), (index % 3 - 1) * 4.65, 1.55 - Math.floor(index / 3) * 3.25, 0);
    tile.userData.projectIndex = index;
    return tile;
  });

  const hudTexture = canvasTexture(1440, 760, () => {});
  function updateHUD() {
    const ctx = hudTexture.image.getContext('2d');
    ctx.clearRect(0, 0, 1440, 760);
    ctx.fillStyle = '#183044ed';
    ctx.fillRect(0, 0, 1440, 62);
    ctx.fillRect(0, 705, 1440, 55);
    ctx.fillStyle = PAPER;
    ctx.textAlign = 'left'; ctx.font = '500 20px monospace';
    ctx.fillText('SYRENA / PROJECT WORLD', 32, 40);
    ctx.textAlign = 'right'; ctx.font = '500 17px monospace';
    ctx.fillText(overview ? 'SELECT YOUR NEXT ADVENTURE' : 'STUDIO CONCEPTS · VOL. 01', 1408, 39);
    ctx.textAlign = 'left'; ctx.font = '500 18px monospace';
    ctx.fillText(overview ? 'TAP A PROJECT TO EXPLORE' : `${String(selected + 1).padStart(2, '0')} / 06   ${projects[selected].title.toUpperCase()}`, 32, 740);
    ctx.textAlign = 'right';
    ctx.fillText(overview ? 'H  BACK TO GALLERY' : 'A  OPEN PROJECT     D → NEXT', 1408, 740);
    if (sleeping) {
      ctx.fillStyle = '#142b3df9'; ctx.fillRect(0, 0, 1440, 760);
      ctx.fillStyle = PAPER; ctx.textAlign = 'center';
      ctx.font = 'italic 58px Georgia'; ctx.fillText('Dreaming up the next idea.', 720, 370);
      ctx.font = '19px monospace'; ctx.fillText('TAP THE SCREEN OR A CONTROL TO WAKE', 720, 435);
    }
    hudTexture.needsUpdate = true;
    screenDirty = true;
  }
  const hudScene = new THREE.Scene();
  const hudCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 10);
  hudCamera.position.z = 1;
  const hudPlane = plane(hudScene, 2, 2, basicTexture(hudTexture, { transparent: true, depthTest: false, depthWrite: false }), 0, 0, 0);
  const startupTexture = canvasTexture(384, 202, () => {});
  startupTexture.magFilter = THREE.NearestFilter;
  startupTexture.minFilter = THREE.NearestFilter;
  startupTexture.generateMipmaps = false;
  updateHUD();

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
      if (overview) {
        raycaster.setFromCamera(new THREE.Vector2(hit.uv.x * 2 - 1, hit.uv.y * 2 - 1), menuCamera);
        const tile = raycaster.intersectObjects(menuTargets)[0];
        if (tile) {
          // Delegate selection to React so its live text and links stay in sync.
          onAction(`select:${tile.object.userData.projectIndex}`);
        }
      } else onAction('open');
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
    const delta = lastTime ? Math.min((time - lastTime) / 1000, .05) : .016;
    lastTime = time;
    const reduced = motionQuery.matches;
    const moving = !paused && !reduced;
    if (moving) elapsed += delta;
    if (moving) startupTime += delta;
    const ease = 1 - Math.exp(-delta * 9);
    const destination = selected * 11;
    galleryX = reduced ? destination : THREE.MathUtils.lerp(galleryX, destination, ease);
    if (Math.abs(galleryX - destination) < .005) galleryX = destination;
    galleryCamera.position.set(galleryX + .25, 1.05, 9.4);
    galleryCamera.lookAt(galleryX, .35, 0);
    const welcoming = startup !== 'done' && !sleeping;
    if (welcoming && (screenDirty || (moving && time - lastStartupPaint > 50))) {
      paintStartup(startupTexture.image.getContext('2d'), { time: startupTime, phase: startup, reduced, colors });
      startupTexture.needsUpdate = true;
      lastStartupPaint = time;
      screenDirty = true;
    }
    hudPlane.material.map = welcoming ? startupTexture : hudTexture;
    if (screenDirty || galleryX !== destination) {
      renderer.setRenderTarget(target);
      renderer.setClearColor(0x000000, 1);
      if (!welcoming) {
        renderer.render(overview ? menu : gallery, overview ? menuCamera : galleryCamera);
        renderer.autoClear = false;
        renderer.clearDepth();
      }
      renderer.render(hudScene, hudCamera);
      renderer.autoClear = true;
      renderer.setRenderTarget(null);
      renderer.setClearColor(0x000000, 0);
      screenDirty = galleryX !== destination;
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
    if (moving || galleryX !== destination || pressing || tilting) requestFrame();
  }
  function onVisibility() { lastTime = 0; requestFrame(); }
  function onMotionChange() { requestFrame(); }
  document.addEventListener('visibilitychange', onVisibility);
  motionQuery.addEventListener('change', onMotionChange);
  resize();

  return {
    select(index) { selected = index; overview = false; sleeping = false; updateHUD(); requestFrame(); },
    setOverview(value) { overview = value; updateHUD(); requestFrame(); },
    setSleeping(value) { sleeping = value; updateHUD(); requestFrame(); },
    setStartup(value) { startup = value; startupTime = 0; lastStartupPaint = -Infinity; screenDirty = true; requestFrame(); },
    setPaused(value) { paused = value; requestFrame(); },
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
      pendingImages.forEach((image) => { image.onload = null; image.onerror = null; image.src = ''; });
      resources.forEach((resource) => resource.dispose());
      target.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
