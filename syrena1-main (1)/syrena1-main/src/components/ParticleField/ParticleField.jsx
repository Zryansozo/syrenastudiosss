import { useEffect, useRef } from 'react';
import styles from './ParticleField.module.css';

export default function ParticleField({
  count = 55,
  color = 'rgba(121, 164, 192, 0.55)',
  connectDistance = 130,
  speed = 0.45,
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles, raf;
    let mouse = { x: -9999, y: -9999, active: false };

    const resize = () => {
      if (!canvas) return;
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.max(25, Math.floor((w * h) / 18000) || count);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          r: Math.random() * 2.2 + 1.2,
          baseR: Math.random() * 2.2 + 1.2,
          opacity: Math.random() * 0.6 + 0.35,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          pulseAngle: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Subtle gentle pulsation
        p.pulseAngle += p.pulseSpeed;
        const currentR = p.baseR + Math.sin(p.pulseAngle) * 0.5;

        // Wrap around boundaries
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Draw glowing particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, currentR), 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${p.opacity})`);
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(139, 163, 197, 0.6)';
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow for lines to keep performance high

        // Connect nearby constellation nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDistance) {
            const lineOpacity = (1 - dist / connectDistance) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${lineOpacity})`);
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Mouse interaction — connect cursor to nearby nodes and attract softly
        if (mouse.active) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < 160) {
            // Draw interactive constellation line to mouse
            const mouseLineOpacity = (1 - mDist / 160) * 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(192, 210, 224, ${mouseLineOpacity})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();

            // Gentle gravitational pull
            p.vx += mdx * 0.00015;
            p.vy += mdy * 0.00015;
          }
        }

        // Dampen velocity to prevent runaways
        p.vx *= 0.998;
        p.vy *= 0.998;
      }

      raf = requestAnimationFrame(draw);
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    initParticles();
    draw();

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });
    canvas.addEventListener('mousemove', onMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      if (canvas) {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, [count, color, connectDistance, speed]);

  return <canvas ref={canvasRef} className={`${styles.canvas} ${className}`} />;
}
