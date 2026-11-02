import * as THREE from 'three';
import { gsap } from 'gsap';
import { oceanArtwork, applyArtworkUV } from './oceanArtwork';

const stages = new WeakMap();
const base = '/images/SyrenaStudio_Ocean_Scrapbook_3D_Asset_Pack/assets/';
// Only the retained ocean bed uses the original pack. New RGBA props use UV regions.

function silhouette(points) {
  if (!points) return new THREE.PlaneGeometry(1, 1);
  const shape = new THREE.Shape(points.map(([x,y]) => new THREE.Vector2(x - .5, .5 - y)));
  const geometry = new THREE.ShapeGeometry(shape);
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) + .5, pos.getY(i) + .5);
  return geometry;
}

function createStage(section) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1, 0, -1, .1, 2000);
  camera.position.z = 1000;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.dataset.oceanCanvas = '';
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, { position: 'absolute', left: '0', top: '0', zIndex: '1', pointerEvents: 'none' });
  section.appendChild(canvas);
  const loader = new THREE.TextureLoader();
  const textures = new Map();
  const puppets = [];
  const videos = new Set();
  const triggers = [...section.querySelectorAll('[data-sea-trigger]')];
  let disposed = false;
  let width = 1, height = 1, viewport = 1;
  let visible = true;
  let elapsed = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(pointer: coarse)');
  const isMotionReduced = () => section.dataset.oceanMotion === 'paused'
    || (motion.matches && section.dataset.oceanMotion !== 'enabled');

  function add(name, x, y, size, depth, kind = 'paper', rotation = 0, points) {
    const artwork = oceanArtwork[name];
    const url = artwork?.url || (name.startsWith('/') ? name : `${base}${name}.png`);
    let texture = textures.get(url);
    if (!texture) {
      texture = loader.load(url, () => {
        if (disposed) texture.dispose();
      });
      texture.colorSpace = THREE.SRGBColorSpace;
      textures.set(url, texture);
    }
    const geometry = silhouette(artwork ? artwork.outline : points);
    if (artwork) applyArtworkUV(geometry, artwork);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      map: texture, transparent: true, alphaTest: .06, depthWrite: false, depthTest: false, side: THREE.DoubleSide,
    }));
    if (kind !== 'bed' && depth < -15) {
      const fog = THREE.MathUtils.clamp((-depth - 10) / 140, .05, .38);
      mesh.material.color.setRGB(1 - fog * .8, 1 - fog * .5, 1 - fog * .24);
      mesh.material.opacity = 1 - fog * .55;
      // A few texture taps soften distant printed layers without postprocessing
      // or another render target. Foreground textures retain their original detail.
      mesh.material.onBeforeCompile = shader => {
        shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
          vec2 blurStep = vec2(0.0018);
          vec4 ink = texture2D(map, vMapUv) * 0.6;
          ink += texture2D(map, vMapUv + vec2(blurStep.x, 0.0)) * 0.1;
          ink += texture2D(map, vMapUv - vec2(blurStep.x, 0.0)) * 0.1;
          ink += texture2D(map, vMapUv + vec2(0.0, blurStep.y)) * 0.1;
          ink += texture2D(map, vMapUv - vec2(0.0, blurStep.y)) * 0.1;
          diffuseColor *= ink;
        `);
      };
    }
    mesh.renderOrder = depth;
    // A paper puppet rotates around its mounting point, not its image centre.
    const pivot = new THREE.Group();
    pivot.add(mesh);
    scene.add(pivot);
    const anchors = { seahorse: [-.08, .32], jelly: [-.2, .36], coral: [.15, -.43], boat: [0, -.22], sail: [0, -.20] };
    const anchor = anchors[kind] || [0, .30];
    const shadows = kind === 'bed' || kind === 'bubble' ? [] : [0, 1].map(i => {
      const shadow = new THREE.Mesh(mesh.geometry, new THREE.MeshBasicMaterial({
        map: texture, color: 0x010a16, transparent: true, opacity: i ? .07 : .12,
        depthWrite: false, depthTest: false, side: THREE.DoubleSide,
      }));
      shadow.renderOrder = depth - .5;
      shadow.matrixAutoUpdate = false;
      scene.add(shadow);
      return shadow;
    });
    let edge = null;
    if (kind === 'paper' || kind === 'shell') {
      // The backing follows the actual PNG alpha, including gaps in coral and
      // torn edges. An untextured plane would put a rectangle behind each prop.
      edge = new THREE.Mesh(mesh.geometry, new THREE.MeshBasicMaterial({map: texture, color: 0xbdb79f, transparent: true, opacity: .7, depthTest: false, depthWrite: false, side: THREE.DoubleSide}));
      edge.renderOrder = depth - .1;
      edge.matrixAutoUpdate = false;
      scene.add(edge);
    }
    const puppet = { mesh, pivot, anchor, shadows, edge, artwork, x, y, size, depth, kind, rotation, phase: puppets.length * 2.399 };
    puppets.push(puppet);
    return puppet;
  }
  // A continuous deep paper bed, with separate scraps and physical cutouts.
  const bed = add('paper_dark', .5, .5, 1.1, -80, 'bed', 0, [[0,0],[1,0],[1,1],[0,1]]);
  const paperRepeat = { value: new THREE.Vector2(4, 6) };
  bed.mesh.material.onBeforeCompile = shader => {
    shader.uniforms.paperRepeat = paperRepeat;
    shader.fragmentShader = 'uniform vec2 paperRepeat;\n' + shader.fragmentShader;
    // Tile only an interior patch of the supplied paper, excluding the sheet
    // backdrop. Constant physical texture size avoids stretching on mobile.
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>',
      `diffuseColor *= texture2D(map, vec2(.2, .3) + abs(fract(vMapUv * paperRepeat) * 2.0 - 1.0) * vec2(.5, .35));
       float centre = exp(-pow((vMapUv.x - .5) * 2.5, 2.0));
       diffuseColor.rgb *= mix(vec3(.75,.83,.91), vec3(.38,.53,.69), centre * .8);`);
  };
  add('paper_wave_torn', .18, .015, .46, -60, 'paper', -.10);
  add('paper_cream', .97, .20, .19, -55, 'paper', .23);
  add('paper_blue', .02, .53, .22, -50, 'paper', -.22);
  add('paper_wave_torn', .71, .99, .55, -55, 'paper', .10);
  add('postcard_sailboat', .07, .13, .13, -25, 'paper', -.16);
  add('postcard_palm', .95, .91, .16, -25, 'paper', .14);
  add('coral_cream', .035, .88, .20, -35, 'coral');
  add('coral_cream', .98, .59, .17, -30, 'coral', -.18);
  add('jellyfish_large', .92, .09, .23, -8, 'jelly');
  add('seahorse', .965, .44, .105, 30, 'seahorse', .06);
  add('starfish_small', .97, .73, .12, 38, 'shell', .22);
  // Edge clusters overlap at different depths; the central stage stays open.
  add('paper_cream', .025, .035, .34, -62, 'paper', -.26);
  add('paper_blue', .98, .025, .35, -56, 'paper', .18);
  add('paper_wave_torn', .82, .008, .36, -48, 'paper', -.14);
  add('postcard_wave', .055, .055, .18, -18, 'paper', -.22);
  add('postcard_palm', .975, .035, .18, -20, 'paper', .18);
  add('starfish_large', .09, .20, .17, 24, 'shell', -.12);
  add('paper_cream', .06, .96, .35, -52, 'paper', .18);
  add('paper_cream', .94, .985, .39, -50, 'paper', -.24);
  add('paper_blue', .015, .72, .21, -58, 'paper', .32);
  add('coral_blue', .025, .68, .24, -48, 'coral', -.13);
  add('coral_blue', .975, .27, .21, -42, 'coral', .19);
  add('coral_cream', .10, .99, .25, 34, 'coral', .18);
  add('nautilus_shell', .96, .985, .23, 48, 'shell', -.18);
  add('scallop_shell', .025, .94, .25, 46, 'shell', -.26);
  add('postcard_sailboat', .89, .985, .21, -16, 'paper', -.22);
  add('seaweed', .993, .87, .12, -38, 'coral', -.12);
  add('paper_tape', .13, .028, .055, -17, 'paper', -.22);
  add('doodle_waves', .045, .35, .13, -23, 'paper', -.04);
  add('doodle_orbit', .975, .66, .11, -26, 'paper', .13);
  add('doodle_heart', .025, .43, .032, -22, 'paper', -.14);
  // Individual transparent sheet regions share one GPU texture.
  ['fish_one', 'fish_two', 'fish_three'].forEach((name,i) =>
    add(name, .80 + i * .045, .80 + i * .023, .045 - i * .007, -32, 'fish'));
  // Existing boat artwork: separately masked hull and sail share a parent pose.
  const boatSrc = '/images/ocean-world/boat.jpg';
  const boat = add(boatSrc, .12, .48, .25, 30, 'boat', 0,
    [[.277,.70],[.468,.71],[.47,.14],[.49,.13],[.50,.69],[.717,.65],[.73,.67],[.70,.76],[.73,.78],[.72,.84],[.68,.88],[.52,.86],[.41,.82],[.36,.76]]);
  const sail = add(boatSrc, .12, .48, .25, 31, 'sail', 0,
    [[.285,.699],[.477,.243],[.481,.179],[.574,.167],[.59,.159],[.713,.653],[.482,.698]]);
  sail.phase = boat.phase;
  // The sail hinges on the boat rig, so wind never detaches it from the hull.
  boat.pivot.add(sail.pivot);
  for (let i = 0; i < 12; i++) {
    const sideX = i % 2 ? .84 + (i % 3) * .045 : .04 + (i % 3) * .065;
    add(i % 5 === 0 ? 'bubble_pearl' : i % 2 ? 'bubble_large' : 'bubble_small',
      sideX, i / 12, .016 + (i % 3) * .007, 60, 'bubble');
  }

  // One translucent atmospheric layer, rendered between the distant collage
  // and the cards. No bloom pass, extra canvas, renderer, or animation loop.
  const airUniforms = { time: {value: 0} };
  const atmosphere = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({
    uniforms: airUniforms, transparent: true, depthWrite: false, depthTest: false,
    vertexShader: 'varying vec2 uvAir; void main(){ uvAir=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `varying vec2 uvAir; uniform float time;
      void main() {
        vec2 p=uvAir;
        float edge=pow(abs(p.x-.5)*2.,2.8);
        float top=exp(-length((p-vec2(.82,.98))*vec2(3.,4.)));
        float mist=exp(-length((p-vec2(.07,.18))*vec2(4.,6.)));
        float shaft=exp(-pow((p.x+p.y*.20-.93)*18.,2.))*p.y;
        float breath=.96+.04*sin(time*.17);
        vec3 tint=mix(vec3(.015,.04,.075),vec3(.34,.48,.57),clamp(top+mist,0.,1.));
        gl_FragColor=vec4(tint, (.075+edge*.10+shaft*.05)*breath);
      }`,
  }));
  atmosphere.renderOrder = -11;
  scene.add(atmosphere);
  const dustGeometry = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(36 * 3);
  for (let i=0;i<36;i++) { dustPositions[i*3]=(i*.618034)%1; dustPositions[i*3+1]=(i*.381966)%1; dustPositions[i*3+2]=i; }
  dustGeometry.setAttribute('position',new THREE.BufferAttribute(dustPositions,3));
  const dustUniforms = {time:{value:0}, extent:{value:new THREE.Vector2(1,1)}};
  const dust = new THREE.Points(dustGeometry,new THREE.ShaderMaterial({
    uniforms:dustUniforms, transparent:true, depthTest:false, depthWrite:false,
    vertexShader:`uniform float time; uniform vec2 extent; varying float fade;
      void main(){ float phase=position.z; vec2 p=position.xy;
        p.y=fract(p.y+time*(.0005+mod(phase,4.)*.00013));
        p.x+=sin(time*.12+phase)*.004;
        fade=(.08+mod(phase,3.)*.025)*smoothstep(0.,.08,p.y)*smoothstep(0.,.08,1.-p.y);
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p.x*extent.x,-p.y*extent.y,-12.,1.);
        gl_PointSize=1.2+mod(phase,3.)*.65; }`,
    fragmentShader:'varying float fade; void main(){float a=1.-smoothstep(.1,.5,length(gl_PointCoord-.5));gl_FragColor=vec4(.68,.8,.85,a*fade);}',
  }));
  dust.frustumCulled = false;
  dust.renderOrder = -10;
  scene.add(dust);

  function resize() {
    width = section.clientWidth;
    height = section.clientHeight;
    viewport = Math.min(height, window.innerHeight);
    paperRepeat.value.set(width / 320, height / 220);
    atmosphere.scale.set(width + 50,height + 50,1);
    atmosphere.position.set(width/2,-height/2,-11);
    dustUniforms.extent.value.set(width,height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 768 ? 1 : 1.5));
    renderer.setSize(width, viewport);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(section);
  window.addEventListener('resize', resize, { passive: true });
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  intersection.observe(section);
  const move = (e) => {
    if (coarse.matches || isMotionReduced()) return;
    const rect = section.getBoundingClientRect();
    pointer.tx = THREE.MathUtils.clamp((e.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
    pointer.ty = THREE.MathUtils.clamp((e.clientY - Math.max(0, rect.top)) / Math.min(rect.height, window.innerHeight) * 2 - 1, -1, 1);
  };
  const leave = () => { pointer.tx = pointer.ty = 0; };
  section.addEventListener('pointermove', move, { passive: true });
  section.addEventListener('pointerleave', leave);
  resize();

  function tick(_time, delta) {
    if (disposed || !visible || document.hidden) return;
    const rect = section.getBoundingClientRect();
    const offset = Math.max(0, Math.min(height - viewport, -rect.top));
    canvas.style.transform = `translateY(${offset}px)`;
    camera.right = width;
    camera.top = -offset;
    camera.bottom = -offset - viewport;
    camera.updateProjectionMatrix();
    const reduced = isMotionReduced();
    const factor = reduced ? 0 : width < 768 ? .15 : width < 1025 ? .5 : 1;
    const dt = Math.min(delta / 1000, .05);
    elapsed += reduced ? 0 : dt;
    airUniforms.time.value = elapsed;
    dustUniforms.time.value = elapsed;
    const damping = 1 - Math.exp(-dt * 5);
    pointer.x += (pointer.tx * factor - pointer.x) * damping;
    pointer.y += (pointer.ty * factor - pointer.y) * damping;
    section.style.setProperty('--ocean-card-x', `${pointer.x * 7}px`);
    section.style.setProperty('--ocean-card-y', `${pointer.y * 6}px`);
    // Closed service objects also hang in this same theatre. The existing
    // click/hover transforms remain untouched; CSS individual transforms compose.
    triggers.forEach((trigger, i) => {
      const t = elapsed;
      const phase = i * 1.73;
      trigger.style.setProperty('--puppet-x', `${Math.sin(t * .43 + phase) * 5 * factor}px`);
      trigger.style.setProperty('--puppet-y', `${Math.sin(t * .67 + phase) * 9 * factor}px`);
      trigger.style.setProperty('--puppet-roll', `${Math.sin(t * .53 + phase) * 1.8 * factor}deg`);
    });
    for (const p of puppets) {
      const { mesh, pivot, anchor, phase, kind } = p;
      const t = elapsed;
      const speed = kind === 'coral' ? .55 : kind === 'seahorse' ? .72 : .48;
      const wave = Math.sin(t * speed + phase);
      const depth = p.depth < -40 ? 3 + (p.depth + 80) / 40 * 3 : p.depth < 0 ? 6 + (p.depth + 40) / 40 * 4 : 12 + p.depth / 60 * 8;
      let dx = 0, dy = 0, rock = 0, yaw = 0;
      if (kind === 'boat' || kind === 'sail') {
        dx = Math.sin(t * .22 + phase) * 36; dy = Math.sin(t * .73 + phase) * 7;
        rock = Math.sin(t * .62 + phase) * .055;
        yaw = Math.sin(t * .39 + phase) * .06;
        if (kind === 'sail') { rock = Math.sin(t * 1.1 + phase) * .035; yaw = Math.sin(t * .91 + phase) * .12; }
      } else if (kind === 'seahorse' || kind === 'jelly') {
        dx = Math.cos(t * .37 + phase) * 11; dy = wave * (kind === 'jelly' ? 18 : 13);
        rock = Math.sin(t * .57 + phase) * .065;
        yaw = Math.sin(t * .42 + phase) * .11;
      } else if (kind === 'coral') { rock = wave * .019; yaw = wave * .035; }
      else if (kind === 'paper') rock = wave * .008;
      else if (kind === 'fish') { dx = Math.sin(t*.16+phase)*8; dy=wave*2; }
      const breathingDepth = kind === 'seahorse' || kind === 'jelly' ? Math.sin(t*.25+phase)*5*factor : 0;
      let y = p.y * height;
      if (kind === 'bubble') { y = ((p.y * height - t * factor * (13 + phase % 7)) % (height + 100) + height + 100) % (height + 100) - 50; dx = wave * 13; }
      const minSize = kind === 'bubble' ? 10 : kind === 'fish' ? 20 : 40;
      const w = kind === 'bed' ? width * p.size : Math.max(minSize, Math.min(width, 1440) * p.size) * (1 + breathingDepth*.0015);
      const img = mesh.material.map.image;
      const ratio = p.artwork ? p.artwork.rect[3] / p.artwork.rect[2] : img ? img.height / img.width : 1;
      const h = kind === 'bed' ? height + 80 : w * ratio;
      mesh.scale.set(w, h, 1);
      mesh.position.set(-anchor[0] * w, -anchor[1] * h, 0);
      if (kind === 'sail') {
        pivot.position.set((anchor[0] - boat.anchor[0]) * w, (anchor[1] - boat.anchor[1]) * h, 1);
        pivot.rotation.set(0, yaw * factor, rock * factor);
      } else {
        pivot.position.set(p.x * width + anchor[0] * w + pointer.x * depth + dx * factor,
          -y + anchor[1] * h - pointer.y * depth - dy * factor, p.depth + breathingDepth);
        pivot.rotation.set(pointer.y * .052, pointer.x * .075 + yaw * factor, p.rotation + rock * factor);
      }
    }
    scene.updateMatrixWorld(true);
    for (const p of puppets) {
      if (p.edge) {
        p.edge.matrix.copy(p.mesh.matrixWorld);
        p.edge.matrix.elements[12] += .7;
        p.edge.matrix.elements[13] -= 1.2;
        p.edge.matrixWorldNeedsUpdate = true;
      }
      p.shadows.forEach((shadow, i) => {
        // Offset cast shadows make the distance between paper layers readable.
        // They stay on the backing plane as the suspended cutout turns above it.
        shadow.matrix.copy(p.mesh.matrixWorld);
        const lift = 5 + (p.depth + 80) * .065 + i * 4;
        shadow.matrix.elements[12] += lift * .6 - pointer.x * 4;
        shadow.matrix.elements[13] -= lift + pointer.y * 3;
        shadow.matrix.elements[14] -= 2;
        shadow.matrixWorldNeedsUpdate = true;
      });
    }
    for (const item of videos) {
      if (!item.root || !item.mesh.visible) continue;
      const r = item.root.getBoundingClientRect();
      item.mesh.position.set(r.left - rect.left + r.width / 2, -(r.top - rect.top + r.height / 2), 0);
      item.mesh.scale.set(r.width / 2, r.height / 2, 1);
    }
    renderer.render(scene, camera);
  }
  gsap.ticker.add(tick);
  return {
    refs: 0,
    register(mesh) {
      mesh.renderOrder = 0;
      mesh.visible = false;
      scene.add(mesh);
      const entry = { mesh, root: null };
      videos.add(entry);
      return { attach(root) { entry.root = root; mesh.visible = true; }, close() { mesh.visible = false; entry.root = null; }, destroy() { scene.remove(mesh); videos.delete(entry); } };
    },
    destroy() {
      disposed = true;
      gsap.ticker.remove(tick);
      observer.disconnect(); intersection.disconnect();
      window.removeEventListener('resize', resize);
      section.removeEventListener('pointermove', move);
      section.removeEventListener('pointerleave', leave);
      for (const p of puppets) { p.mesh.geometry.dispose(); p.mesh.material.dispose(); p.edge?.material.dispose(); p.shadows.forEach(shadow => shadow.material.dispose()); }
      atmosphere.geometry.dispose(); atmosphere.material.dispose(); dustGeometry.dispose(); dust.material.dispose();
      triggers.forEach(trigger => ['--puppet-x', '--puppet-y', '--puppet-roll'].forEach(name => trigger.style.removeProperty(name)));
      textures.forEach(texture => texture.dispose());
      renderer.dispose(); canvas.remove();
      section.style.removeProperty('--ocean-card-x'); section.style.removeProperty('--ocean-card-y');
    },
  };
}

// Cards and environment lease the same stage, including React StrictMode cleanup.
export function acquireOceanStage(section) {
  let stage = stages.get(section);
  if (!stage) { stage = createStage(section); stages.set(section, stage); }
  stage.refs++;
  let released = false;
  return { register: stage.register, release() {
    if (released) return;
    released = true;
    if (--stage.refs === 0) { stage.destroy(); stages.delete(section); }
  } };
}
