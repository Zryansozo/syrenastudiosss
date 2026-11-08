import * as THREE from 'three';

const WORLD_WIDTH = 16;
const REFERENCE_BACKGROUND = '#011527';

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

export async function createReferencePaperStage(host, artwork, signal) {
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
  const background = new THREE.Color(getComputedStyle(host).getPropertyValue('--navy').trim() || '#202b46');
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
  material.onBeforeCompile = shader => {
    shader.uniforms.paperBackground = { value: background };
    shader.uniforms.paperReferenceBackground = { value: new THREE.Color(REFERENCE_BACKGROUND) };
    shader.vertexShader = 'varying float paperFace;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\npaperFace = abs(normal.z);');
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
  material.customProgramCacheKey = () => 'reference-paper-surface-v4';
  const meshes = [];
  const groups = [];
  let frame = 0, disposed = false, visible = false, lost = false;
  let resizeObserver, intersection;
  let removeListeners = () => {};
  const pointer = new THREE.Vector2(), target = new THREE.Vector2();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect(); intersection?.disconnect(); removeListeners();
    meshes.forEach(mesh => mesh.geometry.dispose());
    material.dispose(); texture.dispose();
    light.shadow.map?.dispose(); light.shadow.mapPass?.dispose();
    renderer.dispose(); canvas.remove();
  }

  try {
    for (const layer of artwork.layers) {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      const mesh = new THREE.Mesh(createReferencePaperGeometry(layer, artwork), material);
      // Only the actual raised cutouts cast shadows. The continuous backing
      // must not project artificial polygon edges onto the paper surface.
      mesh.castShadow = layer.kind !== 'water';
      mesh.receiveShadow = true;
      mesh.position.z = layer.z;
      const group = new THREE.Group();
      group.userData.depth = layer.z;
      group.userData.surfer = layer.kind === 'surfer';
      if (group.userData.surfer) {
        const x = (695 - artwork.width / 2) / artwork.width * WORLD_WIDTH;
        const y = (artwork.height / 2 - 315) / artwork.width * WORLD_WIDTH;
        group.position.set(x, y, 0);
        mesh.position.x = -x; mesh.position.y = -y;
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
        if (group.userData.surfer) group.rotation.z = pointer.x * .006;
      }
      renderer.shadowMap.needsUpdate = true;
      renderer.render(scene, camera);
    }
    function tick() {
      frame = 0;
      render();
      // Render on demand; the sculpture rests once the pointer settles.
      if (!disposed && visible && !document.hidden && !lost && pointer.distanceToSquared(target) > .00001) frame = requestAnimationFrame(tick);
    }
    function requestRender() {
      if (!frame && !disposed && !lost && visible && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function resize() {
      const width = host.clientWidth, height = host.clientHeight;
      if (!width || !height || disposed) return;
      const viewWidth = WORLD_WIDTH - .035;
      const viewHeight = viewWidth / (width / height);
      const bottom = -artwork.height / artwork.width * WORLD_WIDTH / 2 + .01;
      camera.left = -viewWidth / 2; camera.right = viewWidth / 2;
      camera.top = viewHeight / 2; camera.bottom = -viewHeight / 2;
      camera.position.y = bottom + viewHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      requestRender();
    }
    const interaction = host.closest('footer') || host;
    function move(event) {
      if (reduced.matches || event.pointerType === 'touch') return;
      const bounds = interaction.getBoundingClientRect();
      target.set((event.clientX - bounds.left) / bounds.width * 2 - 1, (event.clientY - bounds.top) / bounds.height * 2 - 1);
      requestRender();
    }
    function rest() { target.set(0, 0); requestRender(); }
    function visibility() {
      cancelAnimationFrame(frame); frame = 0;
      if (!document.hidden) requestRender();
    }
    function contextLost(event) { event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; host.dataset.paperScene = 'unavailable'; }
    function contextRestored() { lost = false; host.dataset.paperScene = 'ready'; resize(); requestRender(); }
    resizeObserver = new ResizeObserver(resize);
    intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) { cancelAnimationFrame(frame); frame = 0; } else requestRender();
    });
    resizeObserver.observe(host); intersection.observe(host);
    interaction.addEventListener('pointermove', move); interaction.addEventListener('pointerleave', rest);
    reduced.addEventListener('change', rest); document.addEventListener('visibilitychange', visibility);
    canvas.addEventListener('webglcontextlost', contextLost); canvas.addEventListener('webglcontextrestored', contextRestored);
    removeListeners = () => {
      interaction.removeEventListener('pointermove', move); interaction.removeEventListener('pointerleave', rest);
      reduced.removeEventListener('change', rest); document.removeEventListener('visibilitychange', visibility);
      canvas.removeEventListener('webglcontextlost', contextLost); canvas.removeEventListener('webglcontextrestored', contextRestored);
    };
    resize();
    return { dispose };
  } catch (error) {
    dispose(); throw error;
  }
}
