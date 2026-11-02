import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const clusterRef = useRef(null);
  const [cursorState, setCursorState] = useState({
    visible: false,
    hovering: false,
    clicking: false,
    label: null,
  });

  useEffect(() => {
    // Skip custom cursor on touch devices or fine pointer absent
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cluster = clusterRef.current;
    if (!cluster) return;

    // Fluid physics follower using GSAP quickTo for smooth 120fps tracking
    const xCluster = gsap.quickTo(cluster, 'x', { duration: 0.16, ease: 'power3.out' });
    const yCluster = gsap.quickTo(cluster, 'y', { duration: 0.16, ease: 'power3.out' });

    let isVisible = false;

    const onMouseMove = (e) => {
      if (!isVisible) {
        isVisible = true;
        setCursorState((prev) => ({ ...prev, visible: true }));
      }
      xCluster(e.clientX);
      yCluster(e.clientY);
    };

    const onMouseDown = () => {
      setCursorState((prev) => ({ ...prev, clicking: true }));
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

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
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

      {/* Bubble #2 — Small Oxygen Bubble hovering over top-right */}
      <div className={styles.bubbleSecondary}>
        <div className={styles.secondaryGlare} />
      </div>

      {/* Bubble #3 — Tiny Oxygen Bubble over top */}
      <div className={styles.bubbleTertiary}>
        <div className={styles.tertiaryGlare} />
      </div>
    </div>
  );
}
