import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const clusterRef = useRef(null);
  const canvasRef = useRef(null);
  const [cursorState, setCursorState] = useState({
    visible: false,
    hovering: false,
    clicking: false,
    label: null,
  });

  useEffect(() => {
    // Skip on touch devices or fine pointer absent
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;

    const cluster = clusterRef.current;
    const canvas = canvasRef.current;
    if (!cluster || !canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Fluid physics follower using GSAP quickTo for smooth 120fps tracking
    const xCluster = gsap.quickTo(cluster, 'x', { duration: 0.16, ease: 'power3.out' });
    const yCluster = gsap.quickTo(cluster, 'y', { duration: 0.16, ease: 'power3.out' });

    let isVisible = false;
    let lastPos = { x: -100, y: -100 };
    let currentPos = { x: -100, y: -100 };
    let distAccumulator = 0;
    let idleTimer = 0;

    // Bubbles array for rising buoyant oxygen bubbles
    const bubbles = [];

    const createBubble = (x, y, extraSpeed = 0, customRadius = null) => {
      const radius = customRadius || Math.random() * 3.5 + 2.5; // 2.5px to 6px
      bubbles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 8,
        radius,
        baseRadius: radius,
        growthRate: 0.015,
        vy: -(Math.random() * 1.6 + 1.2 + extraSpeed), // floats UPWARDS
        vx: (Math.random() - 0.5) * 0.8,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.06 + 0.03,
        wobbleAmp: Math.random() * 0.9 + 0.4,
        opacity: 0,
        maxOpacity: Math.random() * 0.35 + 0.55,
        life: 0,
        maxLife: Math.random() * 40 + 45, // 45 to 85 frames
        popping: false,
        popProgress: 0,
      });

      // Keep max bubbles capped for optimal 120fps performance
      if (bubbles.length > 55) {
        bubbles.shift();
      }
    };

    const onMouseMove = (e) => {
      if (!isVisible) {
        isVisible = true;
        setCursorState((prev) => ({ ...prev, visible: true }));
      }
      xCluster(e.clientX);
      yCluster(e.clientY);

      currentPos = { x: e.clientX, y: e.clientY };

      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      distAccumulator += dist;

      // Spawn rising bubbles based on movement distance
      if (distAccumulator > 18) {
        const count = Math.min(Math.floor(distAccumulator / 18), 3);
        for (let i = 0; i < count; i++) {
          createBubble(e.clientX, e.clientY);
        }
        distAccumulator = 0;
      }

      lastPos = { x: e.clientX, y: e.clientY };
      idleTimer = 0;
    };

    const onMouseDown = (e) => {
      setCursorState((prev) => ({ ...prev, clicking: true }));
      // Click burst: release a spray of buoyant bubbles that float up and pop!
      for (let i = 0; i < 7; i++) {
        createBubble(e.clientX, e.clientY, Math.random() * 1.5, Math.random() * 4 + 2);
      }
    };

    const onMouseUp = () => {
      setCursorState((prev) => ({ ...prev, clicking: false }));
    };

    const onMouseLeave = () => {
      isVisible = false;
      setCursorState((prev) => ({ ...prev, visible: false }));
    };

    const onMouseEnter = () => {
      isVisible = true;
      setCursorState((prev) => ({ ...prev, visible: true }));
    };

    const onMouseOver = (e) => {
      const cursorTarget = e.target.closest('[data-cursor]');
      const clickableTarget = e.target.closest('a, button, [data-hover], input, textarea, select');

      if (cursorTarget) {
        const label = cursorTarget.getAttribute('data-cursor');
        setCursorState((prev) => ({ ...prev, hovering: true, label: label || 'VIEW' }));
      } else if (clickableTarget) {
        setCursorState((prev) => ({ ...prev, hovering: true, label: null }));
      } else {
        setCursorState((prev) => ({ ...prev, hovering: false, label: null }));
      }
    };

    // Animation loop for rising bubbles
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Periodically spawn gentle idle bubbles if visible
      if (isVisible) {
        idleTimer++;
        if (idleTimer > 24) { // approx every ~400ms at 60fps
          createBubble(currentPos.x, currentPos.y, 0, Math.random() * 2.5 + 2);
          idleTimer = 0;
        }
      }

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];

        if (b.popping) {
          // Bubble popping animation (rapid expand + fade ring)
          b.popProgress += 0.2;
          const popR = b.radius * (1 + b.popProgress * 0.8);
          const popAlpha = (1 - b.popProgress) * b.maxOpacity;

          if (popAlpha > 0.05) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(b.x, b.y, popR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(194,210,224, ${popAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.restore();
          }

          if (b.popProgress >= 1) {
            bubbles.splice(i, 1);
            continue;
          }
        } else {
          b.life++;
          const progress = b.life / b.maxLife;

          // Physics: float UPWARDS, gentle lateral wobble
          b.wobble += b.wobbleSpeed;
          b.y += b.vy;
          b.x += b.vx + Math.sin(b.wobble) * b.wobbleAmp;
          b.radius = b.baseRadius + b.life * b.growthRate;

          // Fade in then fade out towards end of life
          if (progress < 0.2) {
            b.opacity = (progress / 0.2) * b.maxOpacity;
          } else if (progress > 0.75) {
            b.opacity = ((1 - progress) / 0.25) * b.maxOpacity;
          } else {
            b.opacity = b.maxOpacity;
          }

          // Check if dead -> start pop
          if (b.life >= b.maxLife || b.y < -20) {
            b.popping = true;
          }

          // Draw the bubble
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, b.opacity));

          // Outer body glow
          const grad = ctx.createRadialGradient(
            b.x - b.radius * 0.35,
            b.y - b.radius * 0.35,
            b.radius * 0.1,
            b.x,
            b.y,
            b.radius
          );
          grad.addColorStop(0, 'rgba(255,255,255, 0.65)');
          grad.addColorStop(0.35, 'rgba(194,210,224, 0.22)');
          grad.addColorStop(0.7, 'rgba(33,86,124, 0.1)');
          grad.addColorStop(1, 'rgba(123,161,197, 0.45)');

          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Delicate specular glass outline
          ctx.lineWidth = Math.max(0.6, b.radius * 0.1);
          ctx.strokeStyle = 'rgba(255,255,255, 0.75)';
          ctx.stroke();

          // Upper-left specular glare point
          ctx.beginPath();
          ctx.arc(
            b.x - b.radius * 0.35,
            b.y - b.radius * 0.35,
            Math.max(0.8, b.radius * 0.28),
            0,
            Math.PI * 2
          );
          ctx.fillStyle = 'rgba(255,255,255, 0.92)';
          ctx.fill();

          // Bottom reflection rim
          ctx.beginPath();
          ctx.arc(
            b.x + b.radius * 0.25,
            b.y + b.radius * 0.25,
            Math.max(0.6, b.radius * 0.2),
            0,
            Math.PI * 2
          );
          ctx.fillStyle = 'rgba(123,161,197, 0.5)';
          ctx.fill();

          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const { visible, hovering, clicking, label } = cursorState;

  return (
    <>
      <canvas ref={canvasRef} className={styles.bubbleCanvas} />
      <div
        ref={clusterRef}
        className={`
          ${styles.bubbleCluster}
          ${visible ? styles.visible : ''}
          ${hovering ? styles.hovering : ''}
          ${clicking ? styles.clicking : ''}
          ${label ? styles.badgeMode : ''}
        `}
      >
        {/* Main Base Oxygen Bubble */}
        <div className={styles.mainBubble}>
          <div className={styles.specularGlareTop} />
          <div className={styles.rimReflectionBottom} />
          <div className={styles.innerRefractionRing} />
          {label && <span className={styles.cursorLabel}>{label}</span>}
        </div>
      </div>
    </>
  );
}
