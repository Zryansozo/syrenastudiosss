import React, { useEffect, useRef } from 'react';
import styles from './CyanotypeCanvas.module.css';

export default function CyanotypeCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse tracking & smooth physics
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      speed: 0,
      active: false,
    };

    // Fluid acoustic wave ripples
    const ripples = [];
    let lastRippleTime = 0;

    // Micro bioluminescent aquatic particles
    const particles = [];
    const particleCount = 65;

    class Particle {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 15;
        this.size = Math.random() * 2.2 + 0.8;
        this.vy = -(Math.random() * 0.4 + 0.2);
        this.vx = (Math.random() - 0.5) * 0.25;
        this.alpha = Math.random() * 0.45 + 0.2;
        this.phase = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.vy;
        this.x += this.vx;
        this.phase += 0.025;

        // Subtle mouse disturbance
        if (mouse.active) {
          const dx = this.x - (width / 2 + mouse.x);
          const dy = this.y - (height / 2 + mouse.y);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 1) {
            const push = (1 - dist / 120) * 2;
            this.x += (dx / dist) * push;
            this.y += (dy / dist) * push;
          }
        }

        if (this.y < -20) this.reset();
        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
      }
      draw() {
        const a = this.alpha + Math.sin(this.phase) * 0.2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140, 230, 255, ${Math.max(0.04, a)})`;
        ctx.shadowColor = 'rgba(100, 210, 255, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
    }

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left - width / 2;
      mouse.targetY = e.clientY - rect.top - height / 2;
      mouse.active = true;

      const now = performance.now();
      if (now - lastRippleTime > 150) {
        lastRippleTime = now;
        ripples.push({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          radius: 8,
          maxRadius: 220,
          alpha: 0.5,
        });
      }
    };

    const handleClick = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      ripples.push({ x: clickX, y: clickY, radius: 10, maxRadius: 320, alpha: 0.8 });
      ripples.push({ x: clickX, y: clickY, radius: 5, maxRadius: 180, alpha: 0.6 });
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.active = false;
    };

    /**
     * Pure procedural 16:9 Cyanotype watercolor background wash
     */
    const drawWatercolorBackground = (time) => {
      // 1. Base Prussian Blue to Midnight Indigo radial wash
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.48,
        30,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.72
      );
      bgGrad.addColorStop(0, '#0E3C72');
      bgGrad.addColorStop(0.28, '#0A2B52');
      bgGrad.addColorStop(0.62, '#061A33');
      bgGrad.addColorStop(1, '#030E1D');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Procedural Organic Watercolor Edge Washes & Flow Formations
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 4; i++) {
        const cx = width * 0.5 + Math.sin(time * 0.15 + i * 1.7) * (width * 0.15);
        const cy = height * 0.5 + Math.cos(time * 0.12 + i * 1.3) * (height * 0.12);
        const rad = Math.min(width, height) * (0.4 + i * 0.14);

        const wash = ctx.createRadialGradient(cx, cy, 10, cx, cy, rad);
        wash.addColorStop(0, 'rgba(100, 210, 255, 0.07)');
        wash.addColorStop(0.5, 'rgba(14, 60, 114, 0.04)');
        wash.addColorStop(1, 'rgba(3, 14, 29, 0)');

        ctx.fillStyle = wash;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    /**
     * Pure procedural Mathematical Translucent Nautilus Shell
     */
    const drawProceduralNautilus = (cx, cy, scale, time) => {
      ctx.save();
      ctx.translate(cx, cy);

      // Organic subtle breathing & mouse parallax tilt
      const breath = 1 + Math.sin(time * 0.7) * 0.018;
      ctx.translate(mouse.x * 0.035, mouse.y * 0.035);
      ctx.scale(scale * breath, scale * breath);
      ctx.rotate(-0.28 + Math.sin(time * 0.35) * 0.012);

      // 1. Central Backlight Caustic Glow
      const coreAura = ctx.createRadialGradient(0, 0, 10, 0, 0, 190);
      coreAura.addColorStop(0, 'rgba(200, 245, 255, 0.4)');
      coreAura.addColorStop(0.28, 'rgba(100, 210, 255, 0.2)');
      coreAura.addColorStop(0.6, 'rgba(14, 60, 114, 0.22)');
      coreAura.addColorStop(1, 'rgba(6, 26, 51, 0)');

      ctx.beginPath();
      ctx.arc(0, 0, 200, 0, Math.PI * 2);
      ctx.fillStyle = coreAura;
      ctx.fill();

      // 2. Mathematical Logarithmic Spiral Constants
      // r(theta) = a * exp(b * theta)
      const a = 1.35;
      const b = 0.1745; // True biological Nautilus golden spiral growth factor
      const totalTurns = 4.25;
      const maxTheta = totalTurns * Math.PI * 2;
      const chambersCount = 28;

      // 3. Render Translucent Chambers (from innermost to outermost)
      for (let i = 1; i <= chambersCount; i++) {
        const t1 = (i / chambersCount) * maxTheta;
        const t0 = ((i - 0.95) / chambersCount) * maxTheta;
        const tIn1 = Math.max(0, t1 - Math.PI * 2);
        const tIn0 = Math.max(0, t0 - Math.PI * 2);

        const r1 = a * Math.exp(b * t1);
        const r0 = a * Math.exp(b * t0);
        const rIn1 = a * Math.exp(b * tIn1);
        const rIn0 = a * Math.exp(b * tIn0);

        // Coordinates
        const xO1 = r1 * Math.cos(t1);
        const yO1 = r1 * Math.sin(t1);
        const xO0 = r0 * Math.cos(t0);
        const yO0 = r0 * Math.sin(t0);

        const xI1 = rIn1 * Math.cos(t1);
        const yI1 = rIn1 * Math.sin(t1);
        const xI0 = rIn0 * Math.cos(t0);
        const yI0 = rIn0 * Math.sin(t0);

        // Control point for biological concave septum curvature
        const cpX = (xO1 + xI1) * 0.48 - Math.sin(t1) * (r1 * 0.15);
        const cpY = (yO1 + yI1) * 0.48 + Math.cos(t1) * (r1 * 0.15);

        // Path for the chamber volume
        ctx.beginPath();
        ctx.moveTo(xI0, yI0);
        ctx.lineTo(xO0, yO0);

        // Outer curve arc
        const midT = (t0 + t1) / 2;
        const rMid = a * Math.exp(b * midT);
        ctx.quadraticCurveTo(rMid * Math.cos(midT), rMid * Math.sin(midT), xO1, yO1);

        // Septum curved boundary
        ctx.quadraticCurveTo(cpX, cpY, xI1, yI1);

        // Inner curve arc
        const midInT = (tIn0 + tIn1) / 2;
        const rInMid = a * Math.exp(b * midInT);
        ctx.quadraticCurveTo(rInMid * Math.cos(midInT), rInMid * Math.sin(midInT), xI0, yI0);
        ctx.closePath();

        // Layered Translucent Caustic Gradient Fill
        const progress = i / chambersCount;
        const alpha = 0.14 + progress * 0.24;
        const shimmer = Math.sin(time * 1.6 + i * 0.3) * 0.03;

        const chamberShading = ctx.createLinearGradient(xI1, yI1, xO1, yO1);
        chamberShading.addColorStop(0, `rgba(235, 252, 255, ${alpha + 0.2 + shimmer})`);
        chamberShading.addColorStop(0.35, `rgba(130, 225, 255, ${alpha + 0.09 + shimmer})`);
        chamberShading.addColorStop(0.7, `rgba(14, 60, 114, ${alpha * 0.7})`);
        chamberShading.addColorStop(1, `rgba(6, 26, 51, ${alpha * 0.25})`);

        ctx.fillStyle = chamberShading;
        ctx.fill();

        // Septum (Rib) Wall
        ctx.beginPath();
        ctx.moveTo(xO1, yO1);
        ctx.quadraticCurveTo(cpX, cpY, xI1, yI1);
        ctx.strokeStyle = `rgba(240, 252, 255, ${0.45 + progress * 0.5})`;
        ctx.lineWidth = 1 + progress * 1.5;
        ctx.shadowColor = 'rgba(100, 210, 255, 0.8)';
        ctx.shadowBlur = 6;
        ctx.stroke();

        // Fine Growth Striae (Crystalline Internal Ribs)
        if (i > 6) {
          const subRibs = 4;
          for (let s = 1; s < subRibs; s++) {
            const frac = s / subRibs;
            const sT = t0 + (t1 - t0) * frac;
            const sInT = tIn0 + (tIn1 - tIn0) * frac;

            const sRO = a * Math.exp(b * sT);
            const sRI = a * Math.exp(b * sInT);

            const sxO = sRO * Math.cos(sT);
            const syO = sRO * Math.sin(sT);
            const sxI = sRI * Math.cos(sInT);
            const syI = sRI * Math.sin(sInT);

            ctx.beginPath();
            ctx.moveTo(sxO, syO);
            ctx.quadraticCurveTo(
              (sxO + sxI) * 0.5 - Math.sin(sT) * (sRO * 0.08),
              (syO + syI) * 0.5 + Math.cos(sT) * (sRO * 0.08),
              sxI,
              syI
            );
            ctx.strokeStyle = `rgba(160, 235, 255, ${0.14 + progress * 0.18})`;
            ctx.lineWidth = 0.7;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }

      // 4. Continuous Outer Shell Wall
      ctx.beginPath();
      const steps = 360;
      for (let s = 0; s <= steps; s++) {
        const theta = (s / steps) * maxTheta;
        const radius = a * Math.exp(b * theta);
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(245, 255, 255, 0.95)';
      ctx.lineWidth = 2.4;
      ctx.shadowColor = 'rgba(100, 210, 255, 0.95)';
      ctx.shadowBlur = 8;
      ctx.stroke();

      // Outer Shell Mantle Crest
      const lastT = maxTheta;
      const lastR = a * Math.exp(b * lastT);
      const prevT = maxTheta - Math.PI * 2;
      const prevR = a * Math.exp(b * prevT);

      const lipStartX = lastR * Math.cos(lastT);
      const lipStartY = lastR * Math.sin(lastT);
      const lipEndX = prevR * Math.cos(prevT);
      const lipEndY = prevR * Math.sin(prevT);

      ctx.beginPath();
      ctx.moveTo(lipStartX, lipStartY);
      ctx.quadraticCurveTo(
        (lipStartX + lipEndX) * 0.45 - Math.sin(lastT) * (lastR * 0.18),
        (lipStartY + lipEndY) * 0.45 + Math.cos(lastT) * (lastR * 0.18),
        lipEndX,
        lipEndY
      );
      ctx.strokeStyle = 'rgba(250, 255, 255, 0.98)';
      ctx.lineWidth = 2.6;
      ctx.stroke();

      // 5. Central Siphuncle Core Origin
      const eye = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
      eye.addColorStop(0, '#FFFFFF');
      eye.addColorStop(0.35, '#8CE8FF');
      eye.addColorStop(0.7, 'rgba(100, 210, 255, 0.45)');
      eye.addColorStop(1, 'rgba(6, 26, 51, 0)');

      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fillStyle = eye;
      ctx.fill();

      // Core concentric spiral ringlets
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        ctx.arc(0, 0, r * 3.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.85 - r * 0.2})`;
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      ctx.restore();
    };

    // Main 60fps render loop
    let startTime = performance.now();
    const render = (timestamp) => {
      animId = requestAnimationFrame(render);
      const time = (timestamp - startTime) * 0.001;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Procedural 16:9 Cyanotype Wash Background
      drawWatercolorBackground(time);

      // 2. Bioluminescent Particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      // 3. Interactive Fluid Ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += 2.4;
        rip.alpha *= 0.965;
        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 210, 255, ${rip.alpha})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = 'rgba(100, 210, 255, 0.8)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
        if (rip.alpha < 0.01) ripples.splice(r, 1);
      }

      // 4. Procedural Mathematical Translucent Nautilus Shell
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      // Proportional scale optimized for 16:9 viewport
      const shellScale = Math.min(width, height) * 0.0022;
      drawProceduralNautilus(centerX, centerY, shellScale, time);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.cyanotype16x9Container}>
      <canvas ref={canvasRef} className={styles.cyanotypeCanvas} />
      <div className={styles.topVignette} />
      <div className={styles.bottomSeamlessFade} />
    </div>
  );
}
