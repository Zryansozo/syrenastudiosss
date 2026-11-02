import React, { useEffect, useRef } from 'react';
import styles from './HeroBackground.module.css';

export default function HeroBackground() {
  const canvasRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse tracking with fluid wake physics
    const mouse = {
      x: -2000,
      y: -2000,
      prevX: -2000,
      prevY: -2000,
      targetX: -2000,
      targetY: -2000,
      speed: 0,
      active: false,
    };

    // Siren Song Acoustic Waves (expanding circular soundwave pulses)
    const acousticRipples = [];
    let lastRippleTime = 0;

    // Bioluminescent Siren Plankton / Pearl Embers
    const bioluminescentEmbers = [];
    const emberCount = 55;

    // Flowing Siren Hair / Hydro-Current Streamlines
    const streams = [];
    const streamCount = 14;

    class HydroWave {
      constructor(x, y, strength = 1) {
        this.x = x;
        this.y = y;
        this.radius = 8;
        this.maxRadius = 260 * strength;
        this.alpha = 0.55 * strength;
        this.growthRate = 2.4 + Math.random() * 1.2;
        this.hueShift = Math.random() > 0.5 ? '#64D2FF' : '#C0D2E0';
      }

      update() {
        this.radius += this.growthRate;
        this.alpha = (1 - this.radius / this.maxRadius) * 0.45;
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.hueShift === '#64D2FF'
          ? `rgba(100, 210, 255, ${this.alpha})`
          : `rgba(192, 210, 224, ${this.alpha * 0.75})`;
        ctx.lineWidth = Math.max(0.6, 2.5 * (1 - this.radius / this.maxRadius));
        ctx.stroke();

        // Secondary harmonic inner ring
        if (this.radius > 40) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius * 0.65, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(163, 190, 211, ${this.alpha * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    class HydroStream {
      constructor(index) {
        this.index = index;
        this.reset();
      }

      reset() {
        this.points = [];
        this.length = 28 + Math.floor(Math.random() * 20);
        this.baseX = (width / (streamCount + 1)) * (this.index + 1) + (Math.random() - 0.5) * 80;
        this.speedY = 0.8 + Math.random() * 0.9;
        this.waveFreq = 0.008 + Math.random() * 0.006;
        this.waveAmp = 35 + Math.random() * 45;
        this.phase = Math.random() * Math.PI * 2;
        this.color = this.index % 3 === 0
          ? 'rgba(100, 210, 255,' // Bioluminescent cyan
          : this.index % 3 === 1
          ? 'rgba(163, 190, 211,' // Angel Falls blue
          : 'rgba(192, 210, 224,'; // Sea Drive ice blue
        this.thickness = 1 + Math.random() * 1.5;

        let startY = height + 40;
        for (let i = 0; i < this.length; i++) {
          this.points.push({
            x: this.baseX + Math.sin(startY * this.waveFreq + this.phase) * this.waveAmp,
            y: startY,
            vx: 0,
            vy: -this.speedY,
          });
          startY += 18;
        }
      }

      update(time) {
        // Move points upward like rising deep-sea currents
        for (let i = 0; i < this.points.length; i++) {
          const pt = this.points[i];
          pt.y -= this.speedY;

          // Natural organic sinusoidal swaying (siren tail / kelp silk motion)
          const targetX = this.baseX + Math.sin((pt.y + time * 60) * this.waveFreq + this.phase) * this.waveAmp;
          pt.x += (targetX - pt.x) * 0.04;

          // Mouse wake disturbance
          if (mouse.active) {
            const dx = pt.x - mouse.x;
            const dy = pt.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180 && dist > 1) {
              const push = (1 - dist / 180) * 8;
              pt.x += (dx / dist) * push;
            }
          }
        }

        // Cycle bottom/top
        if (this.points[0].y < -60) {
          this.reset();
        }
      }

      draw() {
        if (this.points.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        for (let i = 1; i < this.points.length - 1; i++) {
          const xc = (this.points[i].x + this.points[i + 1].x) / 2;
          const yc = (this.points[i].y + this.points[i + 1].y) / 2;
          ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
        }

        ctx.strokeStyle = `${this.color} 0.18)`;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();
      }
    }

    class BioluminescentEmber {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 15;
        this.size = Math.random() * 2.8 + 1.2;
        this.vy = -(Math.random() * 0.6 + 0.3); // Rise slowly like underwater bubbles/pearls
        this.vx = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.6 + 0.25;
        this.baseAlpha = this.alpha;
        this.glowPhase = Math.random() * Math.PI * 2;
        this.glowSpeed = 0.02 + Math.random() * 0.03;
        this.colorType = Math.random() > 0.4 ? 'cyan' : 'pearl';
      }

      update() {
        this.y += this.vy;
        this.x += this.vx;
        this.glowPhase += this.glowSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.glowPhase) * 0.25;

        // Mouse aquatic turbulence
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 1) {
            const push = (1 - dist / 140) * 3.5;
            this.x += (dx / dist) * push;
            this.y += (dy / dist) * push;
          }
        }

        if (this.y < -20) this.reset();
        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (this.colorType === 'cyan') {
          ctx.fillStyle = `rgba(100, 210, 255, ${Math.max(0.1, this.alpha)})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = 'rgba(100, 210, 255, 0.9)';
        } else {
          ctx.fillStyle = `rgba(192, 210, 224, ${Math.max(0.1, this.alpha)})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(163, 190, 211, 0.75)';
        }
        ctx.fill();
        ctx.restore();
      }
    }

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Re-init streams
      streams.length = 0;
      for (let i = 0; i < streamCount; i++) {
        streams.push(new HydroStream(i));
      }

      // Re-init embers
      bioluminescentEmbers.length = 0;
      for (let i = 0; i < emberCount; i++) {
        bioluminescentEmbers.push(new BioluminescentEmber());
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.prevX = mouse.targetX;
      mouse.prevY = mouse.targetY;
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;

      const moveDist = Math.hypot(mouse.targetX - mouse.prevX, mouse.targetY - mouse.prevY);
      mouse.speed = moveDist;

      // Emit fluid wave ripples on movement
      const now = performance.now();
      if (moveDist > 12 && now - lastRippleTime > 120) {
        lastRippleTime = now;
        acousticRipples.push(new HydroWave(mouse.targetX, mouse.targetY, Math.min(1.6, moveDist / 15)));
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${mouse.targetX}px, ${mouse.targetY}px, 0)`;
        glowRef.current.style.opacity = '1';
      }
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      // Burst of oceanic fluid wave resonance
      acousticRipples.push(new HydroWave(clickX, clickY, 1.8));
      acousticRipples.push(new HydroWave(clickX, clickY, 1.2));
      acousticRipples.push(new HydroWave(clickX, clickY, 0.7));
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      if (glowRef.current) {
        glowRef.current.style.opacity = '0';
      }
    };

    // Main animation loop
    let startTime = performance.now();
    const animate = (timestamp) => {
      animationFrameId = requestAnimationFrame(animate);
      const time = (timestamp - startTime) * 0.001;

      // Mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw and update Siren soundwave acoustic ripples
      for (let i = acousticRipples.length - 1; i >= 0; i--) {
        const ripple = acousticRipples[i];
        ripple.update();
        ripple.draw();
        if (ripple.radius >= ripple.maxRadius) {
          acousticRipples.splice(i, 1);
        }
      }

      // 2. Draw and update flowing hydro-current streamlines
      for (let i = 0; i < streams.length; i++) {
        streams[i].update(time);
        streams[i].draw();
      }

      // 3. Draw and update bioluminescent glowing pearls / sea embers
      for (let i = 0; i < bioluminescentEmbers.length; i++) {
        bioluminescentEmbers[i].update();
        bioluminescentEmbers[i].draw();
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className={styles.sirenRealmContainer}>
      {/* Deep Ocean Abyssal Caustic Shimmer & Light Pillars */}
      <div className={styles.oceanCausticOverlay} />
      <div className={styles.abyssalGlowCenter} />
      <div className={styles.sirenChasmGlow} />

      {/* Bioluminescent Cursor Hydro-Aura */}
      <div ref={glowRef} className={styles.bioluminescentAura} />

      {/* Underwater Caustic Light Rays */}
      <div className={styles.sunkenLightRayLeft} />
      <div className={styles.sunkenLightRayRight} />

      {/* High Performance 2D Hydro & Siren Acoustic Canvas */}
      <canvas ref={canvasRef} className={styles.sirenCanvas} />

      {/* Siren / Ocean Hydro Resonance Badges */}
      <div className={styles.sirenFrequencyLeft}>
        <span className={styles.freqPulse} />
        <span className={styles.freqLabel}>SYRENA // 432 Hz ACOUSTIC RESONANCE</span>
      </div>
      <div className={styles.sirenFrequencyRight}>
        <span className={styles.freqLabel}>ABYSSAL BIOLUMINESCENCE</span>
        <span className={styles.freqPulseAlt} />
      </div>
    </div>
  );
}
