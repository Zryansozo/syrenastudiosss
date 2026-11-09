import * as THREE from 'three';

// The pole meets the surfer's existing outstretched hand in artwork coordinates.
export const BANNER = { hand: [650, 264], top: [640, 151], width: 202, height: 52 };

export function createPaperBanner(scale) {
  const rig = new THREE.Group();
  const paper = new THREE.MeshLambertMaterial({ color: '#ded2c1' });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.012, .015, 1.19, 8), paper);
  pole.position.set(-.045, .52, .22);
  pole.rotation.z = .085;
  pole.castShadow = true;
  rig.add(pole);
  // A small paper grip makes the physical connection to the hand clear.
  const grip = new THREE.Mesh(new THREE.SphereGeometry(.029, 8, 6), paper);
  grip.scale.set(1.55, .65, .75);
  grip.position.set(0, 0, .245);
  rig.add(grip);

  const canvas = document.createElement('canvas');
  canvas.width = 1024; canvas.height = 264;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ded2c1'; ctx.fillRect(0, 0, 1024, 264);
  ctx.strokeStyle = '#b7aa96'; ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 984, 224);
  // Small paper fibres, generated once rather than animated texture noise.
  for (let i = 0; i < 1200; i++) {
    const x = (i * 127.7) % 1024, y = (i * 67.3) % 264;
    ctx.fillStyle = i % 2 ? '#ffffff0a' : '#483d3009';
    ctx.fillRect(x, y, 1 + i % 4, 1);
  }
  ctx.fillStyle = '#202b46'; ctx.font = '500 116px Georgia, serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('S Y R E N A', 512, 139, 850);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const fabric = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });
  const geometry = new THREE.PlaneGeometry(BANNER.width * scale, BANNER.height * scale, 36, 10);
  const rest = geometry.attributes.position.array.slice();
  const flag = new THREE.Mesh(geometry, fabric);
  flag.position.set(-BANNER.width * scale / 2 - .095, (264 - BANNER.top[1] - BANNER.height / 2) * scale, .24);
  flag.castShadow = true; flag.receiveShadow = true;
  rig.add(flag);

  function update(time) {
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = rest[i * 3], y = rest[i * 3 + 1];
      const trailing = .5 - x / (BANNER.width * scale);
      const ripple = Math.sin(trailing * 7 - time * 2.8);
      positions.setXYZ(i, x, y + trailing * (.025 * ripple + .018 * Math.sin(time * 1.3)), trailing * (.075 * ripple + .025 * Math.sin(trailing * 13 - time * 4)));
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  }
  update(0);
  return {
    rig, update,
    dispose() { pole.geometry.dispose(); grip.geometry.dispose(); geometry.dispose(); paper.dispose(); fabric.dispose(); texture.dispose(); },
  };
}
