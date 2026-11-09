import * as THREE from 'three';
import { BANNER, createPaperBanner } from './paperBanner';

const WORLD_WIDTH = 16;
const REFERENCE_BACKGROUND = '#011527';
const SWELL = `
  float paperRise = smoothstep(-4.5, 1.0, position.y) * paperMotion.x;
  transformed.x += sin(theatreTime * .55 + position.y * .5) * .045 * paperRise;
  transformed.y += (sin(position.x * .75 + theatreTime * .8) * .085
    + sin(theatreTime * .6 + paperMotion.y) * .025) * paperRise;
  transformed.z += sin(position.x * .65 - theatreTime * .55 + paperMotion.y) * .035 * paperRise;
`;
const MOTION_HEADER = 'uniform float theatreTime; attribute vec2 paperMotion;\n';

export function createReferencePaperGeometry(layer, artwork) {
  const scale = WORLD_WIDTH / artwork.width;
  const points = ring => ring.map(([x, y]) => new THREE.Vector2((x - artwork.width / 2) * scale, (artwork.height / 2 - y) * scale));
  const shapes = layer.pieces.map(piece => {
    const shape = new THREE.Shape(points(piece[0]));
    piece.slice(1).forEach(hole => shape.holes.push(new THREE.Path(points(hole))));
    return shape;
  });
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: layer.thickness, steps: 1, bevelEnabled: false, curveSegments: 1,
  });
  // The supplied paper grain is a surface material. Every cutout still has
  // independent triangulated faces, physical sidewalls and real Z thickness.
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const worldHeight = artwork.height / artwork.width * WORLD_WIDTH;
  for (let i = 0; i < position.count; i++) {
    uv.setXY(i, position.getX(i) / WORLD_WIDTH + .5, position.getY(i) / worldHeight + .5);
  }
  // Hundreds of cutouts are batched into one draw call per depth layer.
  geometry.clearGroups();
  geometry.computeBoundingBox();
  return geometry;
}

export async function createReferencePaperStage(host, artwork, signal, options = {}) {
  if (artwork.revision !== 3 || !artwork.layers.some(layer => layer.name === 'ocean-foundation')) {
    throw new Error('Outdated paper contours: the continuous foundation is required');
  }
  const loader = new THREE.TextureLoader();
  const texture = await loader.loadAsync('/artwork/reference-paper/paper-surface.webp');
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  if (signal.aborted) { texture.dispose(); throw new DOMException('Aborted', 'AbortError'); }
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  } catch (error) {
    texture.dispose(); throw error;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const background = new THREE.Color(getComputedStyle(host).getPropertyValue('--surface-brand').trim() || '#091e39');
  renderer.setClearColor(background);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, .1, 50);
  camera.position.z = 20;
  // Neutral illumination preserves the reference's existing paper color and
  // baked ambient occlusion. Directional light adds subtle live contact shadows.
  scene.add(new THREE.AmbientLight('#ffffff', Math.PI * .95));
  const light = new THREE.DirectionalLight('#e9f0f3', .18);
  light.position.set(-3, 6, 10);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  Object.assign(light.shadow.camera, { left: -10, right: 10, top: 7, bottom: -7, near: .1, far: 30 });
  light.shadow.bias = -.00015;
  light.shadow.normalBias = .003;
  scene.add(light);
  const material = new THREE.MeshLambertMaterial({ map: texture });
  const theatreTime = { value: 0 };
  material.onBeforeCompile = shader => {
    shader.uniforms.paperBackground = { value: background };
    shader.uniforms.paperReferenceBackground = { value: new THREE.Color(REFERENCE_BACKGROUND) };
    shader.uniforms.theatreTime = theatreTime;
    shader.vertexShader = MOTION_HEADER + 'varying float paperFace;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\npaperFace = abs(normal.z);\n' + SWELL);
    shader.fragmentShader = 'varying float paperFace; uniform vec3 paperBackground; uniform vec3 paperReferenceBackground;\n' + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
      #include <color_fragment>
      // A continuous shadow-tone lift blends every paper edge into the site's
      // navy without selection boundaries or posterized dark-water details.
      float paperNavy = 1.0 - smoothstep(.025, .23,
        max(diffuseColor.r, max(diffuseColor.g, diffuseColor.b)));
      diffuseColor.rgb *= .58 + .42 * paperFace;
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
      outgoingLight += (paperBackground - paperReferenceBackground) * paperNavy;
      #include <opaque_fragment>
    `);
  };
  material.customProgramCacheKey = () => 'reference-paper-theatre-v1';
  // Keep the live shadows attached to the moving paper contours.
  const depthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  depthMaterial.onBeforeCompile = shader => {
    shader.uniforms.theatreTime = theatreTime;
    shader.vertexShader = MOTION_HEADER + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n' + SWELL);
  };
  depthMaterial.customProgramCacheKey = () => 'reference-paper-theatre-depth-v1';
  const meshes = [];
  const groups = [];
  const scale = WORLD_WIDTH / artwork.width;
  const surfer = new THREE.Group();
  const pivot = new THREE.Vector3((695 - artwork.width / 2) * scale, (artwork.height / 2 - 315) * scale, 0);
  surfer.position.copy(pivot); scene.add(surfer);
  const banner = createPaperBanner(scale);
  banner.rig.position.set((BANNER.hand[0] - 695) * scale, (315 - BANNER.hand[1]) * scale, 0);
  surfer.add(banner.rig);
  let frame = 0, disposed = false, visible = false, lost = false;
  let lastTick = 0, lastDraw = 0;
  let motion = options.motion ?? !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let resizeObserver, intersection;
  let removeListeners = () => {};
  const pointer = new THREE.Vector2(), target = new THREE.Vector2();

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect(); intersection?.disconnect(); removeListeners();
    meshes.forEach(mesh => mesh.geometry.dispose());
    material.dispose(); depthMaterial.dispose(); texture.dispose(); banner.dispose();
    light.shadow.map?.dispose(); light.shadow.mapPass?.dispose();
    renderer.dispose(); canvas.remove();
  }

  try {
    for (const [index, layer] of artwork.layers.entries()) {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      const mesh = new THREE.Mesh(createReferencePaperGeometry(layer, artwork), material);
      const weights = new Float32Array(mesh.geometry.attributes.position.count * 2);
      const isSurfer = layer.kind === 'surfer';
      for (let i = 0; i < weights.length; i += 2) {
        weights[i] = isSurfer ? 0 : layer.name === 'foreground-foam' ? 1.35 : layer.name === 'fuji-foam' ? .35 : 1;
        weights[i + 1] = layer.kind === 'water' ? 0 : index * .28;
      }
      mesh.geometry.setAttribute('paperMotion', new THREE.BufferAttribute(weights, 2));
      mesh.customDepthMaterial = depthMaterial;
      // Only the actual raised cutouts cast shadows. The continuous backing
      // must not project artificial polygon edges onto the paper surface.
      mesh.castShadow = layer.kind !== 'water';
      mesh.receiveShadow = true;
      mesh.position.z = layer.z;
      const group = new THREE.Group();
      group.userData.depth = layer.z * 5;
      if (isSurfer) {
        mesh.position.x = -pivot.x; mesh.position.y = -pivot.y;
        surfer.add(mesh); meshes.push(mesh);
        continue;
      }
      group.userData.origin = group.position.clone();
      group.add(mesh); scene.add(group); groups.push(group); meshes.push(mesh);
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    host.dataset.paperLayers = String(meshes.length);
    host.dataset.paperRevision = String(artwork.revision || 1);
    host.dataset.paperCuts = String(artwork.layers.reduce((count, layer) => count + layer.pieces.length, 0));

    function render() {
      if (disposed || lost || !visible || document.hidden) return;
      pointer.lerp(target, .12);
      for (const group of groups) {
        const depth = group.userData.depth;
        group.position.copy(group.userData.origin);
        group.position.x += pointer.x * depth * .025;
        group.position.y += pointer.y * depth * .018;
      }
      const time = theatreTime.value;
      surfer.position.copy(pivot);
      surfer.position.x += Math.sin(time * .55 + pivot.y * .5) * .045 + Math.sin(time * .65) * .09 + pointer.x * .04;
      surfer.position.y += Math.sin(pivot.x * .75 + time * .8) * .085 + Math.sin(time * .6) * .025 + Math.sin(time * 1.3) * .025 + pointer.y * .025;
      surfer.rotation.z = Math.sin(time * .65) * -.025 + Math.sin(time * 1.3) * .012 + pointer.x * .008;
      banner.update(time);
      renderer.shadowMap.needsUpdate = true;
      renderer.render(scene, camera);
      host.dataset.paperTime = time.toFixed(3);
    }
    function tick(now) {
      frame = 0;
      if (disposed || !visible || document.hidden || lost) { lastTick = 0; return; }
      if (!lastDraw || now - lastDraw >= 1000 / 30) {
        if (motion && lastTick) theatreTime.value += (now - lastTick) / 1000;
        lastTick = now; lastDraw = now;
        render();
      }
      if (motion || pointer.distanceToSquared(target) > .00001) frame = requestAnimationFrame(tick);
    }
    function requestRender() {
      if (!frame && !disposed && !lost && visible && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function resize() {
      const width = host.clientWidth, height = host.clientHeight;
      if (!width || !height || disposed) return;
      const mobile = width <= 700;
      const viewWidth = mobile ? 9.6 : WORLD_WIDTH - .035;
      const viewHeight = viewWidth / (width / height);
      const bottom = -artwork.height / artwork.width * WORLD_WIDTH / 2 + .01;
      // On phones, frame the wave and banner together instead of shrinking the
      // full wide composition until the surfer becomes an unreadable speck.
      camera.left = -viewWidth / 2; camera.right = viewWidth / 2;
      camera.position.x = mobile ? -2 : 0;
      camera.top = viewHeight / 2; camera.bottom = -viewHeight / 2;
      camera.position.y = bottom + viewHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      lastDraw = 0;
      requestRender();
    }
    const interaction = host.closest('footer') || host;
    function move(event) {
      if (!motion || event.pointerType === 'touch') return;
      const bounds = interaction.getBoundingClientRect();
      target.set((event.clientX - bounds.left) / bounds.width * 2 - 1, (event.clientY - bounds.top) / bounds.height * 2 - 1);
      requestRender();
    }
    function rest() { target.set(0, 0); requestRender(); }
    function setMotion(enabled) {
      motion = enabled; lastTick = 0; lastDraw = 0;
      target.set(0, 0); pointer.set(0, 0);
      host.dataset.paperMotion = enabled ? 'playing' : 'paused';
      cancelAnimationFrame(frame); frame = 0; requestRender();
    }
    function visibility() {
      cancelAnimationFrame(frame); frame = 0;
      lastTick = 0; lastDraw = 0;
      if (!document.hidden) requestRender();
    }
    function contextLost(event) { event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; lastTick = 0; host.dataset.paperScene = 'unavailable'; }
    function contextRestored() { lost = false; lastDraw = 0; host.dataset.paperScene = 'ready'; resize(); requestRender(); }
    resizeObserver = new ResizeObserver(resize);
    intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) { cancelAnimationFrame(frame); frame = 0; lastTick = 0; } else { lastDraw = 0; requestRender(); }
    });
    resizeObserver.observe(host); intersection.observe(host);
    interaction.addEventListener('pointermove', move); interaction.addEventListener('pointerleave', rest);
    document.addEventListener('visibilitychange', visibility);
    canvas.addEventListener('webglcontextlost', contextLost); canvas.addEventListener('webglcontextrestored', contextRestored);
    removeListeners = () => {
      interaction.removeEventListener('pointermove', move); interaction.removeEventListener('pointerleave', rest);
      document.removeEventListener('visibilitychange', visibility);
      canvas.removeEventListener('webglcontextlost', contextLost); canvas.removeEventListener('webglcontextrestored', contextRestored);
    };
    resize();
    setMotion(motion);
    return { dispose, setMotion };
  } catch (error) {
    dispose(); throw error;
  }
}
