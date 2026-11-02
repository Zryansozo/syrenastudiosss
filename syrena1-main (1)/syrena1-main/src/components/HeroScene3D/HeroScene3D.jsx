import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './HeroScene3D.module.css';

export default function HeroScene3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 28;
    camera.position.y = 8;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create interactive wave geometry with BufferGeometry
    const rows = 45;
    const cols = 55;
    const count = rows * cols;
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Oceanic 7-Color Palette: Afloat (#79A4C0), Sea Drive (#C0D2E0), Blueberry Twist (#21567C), Borage (#4C81A3)
    const colorAfloat = new THREE.Color('#79A4C0');
    const colorSeaDrive = new THREE.Color('#C0D2E0');
    const colorBlueberry = new THREE.Color('#21567C');
    const colorBorage = new THREE.Color('#4C81A3');

    let idx = 0;
    const spacingX = 1.3;
    const spacingZ = 1.1;
    const offsetX = (cols * spacingX) / 2;
    const offsetZ = (rows * spacingZ) / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * spacingX - offsetX;
        const z = r * spacingZ - offsetZ;
        const y = 0;

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        originalPositions[idx * 3] = x;
        originalPositions[idx * 3 + 1] = y;
        originalPositions[idx * 3 + 2] = z;

        // Color interpolation based on position
        const t = (c / cols + r / rows) * 0.5;
        const vertexColor = colorAfloat.clone().lerp(t > 0.5 ? colorSeaDrive : (t > 0.25 ? colorBorage : colorBlueberry), Math.abs(t - 0.5) * 2);

        colors[idx * 3] = vertexColor.r;
        colors[idx * 3 + 1] = vertexColor.g;
        colors[idx * 3 + 2] = vertexColor.b;

        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture (soft circular glow)
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(200, 220, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(139, 163, 197, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse tracking with lerp
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Rotate whole mesh slightly
      particles.rotation.y = elapsedTime * 0.05 + mouse.x * 0.2;
      particles.rotation.x = 0.4 + mouse.y * 0.15;

      // Deform wave vertices
      const posAttr = geometry.attributes.position;
      const arr = posAttr.array;

      for (let i = 0; i < count; i++) {
        const u = originalPositions[i * 3];
        const w = originalPositions[i * 3 + 2];

        // Complex organic sine wave equation
        const wave1 = Math.sin(u * 0.2 + elapsedTime * 1.5) * 1.8;
        const wave2 = Math.cos(w * 0.25 + elapsedTime * 1.2) * 1.5;
        const wave3 = Math.sin((u + w) * 0.15 + elapsedTime * 0.8) * 1.2;

        arr[i * 3 + 1] = wave1 + wave2 + wave3;
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.canvasContainer}>
      <div className={styles.ambientGlow} />
    </div>
  );
}
