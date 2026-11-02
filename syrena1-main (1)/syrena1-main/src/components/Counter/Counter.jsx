import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import styles from './Counter.module.css';

export default function Counter({ end, suffix = '', prefix = '', label, duration = 2000 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className={styles.counter}>
      <span className={styles.value}>
        {prefix}{count}{suffix}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
