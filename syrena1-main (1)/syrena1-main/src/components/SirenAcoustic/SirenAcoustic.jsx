import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './SirenAcoustic.module.css';

export default function SirenAcoustic({ className = '' }) {
  const barsRef = useRef([]);

  useEffect(() => {
    const bars = barsRef.current.filter(Boolean);
    if (!bars.length) return;

    // Create organic undulating GSAP animation for each frequency bar
    const tweens = bars.map((bar, i) => {
      const baseHeight = 16 + (Math.sin((i / bars.length) * Math.PI) * 28);
      const delay = i * 0.08;

      return gsap.to(bar, {
        height: () => baseHeight + Math.random() * 24 + 10,
        duration: 0.6 + Math.random() * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay,
      });
    });

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className={`${styles.acousticWrapper} ${className}`}>
      <div className={styles.visualizer}>
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            ref={(el) => (barsRef.current[i] = el)}
            className={styles.bar}
            style={{
              opacity: 0.35 + (Math.sin((i / 18) * Math.PI) * 0.65),
            }}
          />
        ))}
      </div>
      <div className={styles.info}>
        <span className={styles.dot} />
        <span className={styles.label}>432 Hz Siren Resonance</span>
      </div>
    </div>
  );
}
