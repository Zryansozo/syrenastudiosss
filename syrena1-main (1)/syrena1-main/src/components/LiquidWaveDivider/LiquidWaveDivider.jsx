import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './LiquidWaveDivider.module.css';

export default function LiquidWaveDivider({ flip = false, className = '' }) {
  const pathRef1 = useRef(null);
  const pathRef2 = useRef(null);

  useEffect(() => {
    // Generate undulating organic wave control paths
    let progress = { value: 0 };

    const updateWave = () => {
      const p = progress.value;
      const h1 = 40 + Math.sin(p) * 20;
      const h2 = 50 + Math.cos(p * 0.8) * 25;
      const h3 = 35 + Math.sin(p * 1.2) * 18;

      if (pathRef1.current) {
        pathRef1.current.setAttribute(
          'd',
          `M0,80 Q350,${h1} 720,${h2} T1440,${h3} L1440,120 L0,120 Z`
        );
      }
      if (pathRef2.current) {
        pathRef2.current.setAttribute(
          'd',
          `M0,90 Q380,${h2 + 10} 760,${h1 + 15} T1440,${h2} L1440,120 L0,120 Z`
        );
      }
    };

    const tween = gsap.to(progress, {
      value: Math.PI * 2,
      duration: 8,
      repeat: -1,
      ease: 'none',
      onUpdate: updateWave,
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div className={`${styles.dividerWrapper} ${flip ? styles.flipped : ''} ${className}`}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={styles.waveSvg}
      >
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0B345A" stopOpacity="0.5" />
            <stop offset="35%" stopColor="#21567C" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#4C81A3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#79A4C0" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#21567C" stopOpacity="0.35" />
            <stop offset="35%" stopColor="#79A4C0" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#A3BED3" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#C0D2E0" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path ref={pathRef2} fill="url(#waveGrad2)" />
        <path ref={pathRef1} fill="url(#waveGrad1)" />
      </svg>
    </div>
  );
}
