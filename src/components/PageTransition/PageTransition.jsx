import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from '../../context/SmoothScrollContext';
import styles from './PageTransition.module.css';

gsap.registerPlugin(ScrollTrigger);

const pageVariants = {
  initial: {
    opacity: 0,
    y: 24,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: {
      duration: 0.35,
      ease: [0.65, 0, 0.35, 1],
    },
  },
};

export default function PageTransition({ children }) {
  const reducedMotion = useReducedMotion();
  const { scrollTo } = useLenis();

  useEffect(() => {
    // Reset scroll position on route enter
    scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    // Refresh GSAP ScrollTrigger calculations
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timeout);
  }, [scrollTo]);

  return (
    <motion.main
      id="page-content"
      tabIndex={-1}
      className={styles.pageTransitionWrap}
      variants={pageVariants}
      initial={reducedMotion ? false : 'initial'}
      animate="enter"
      exit={reducedMotion ? undefined : 'exit'}
    >
      {children}
    </motion.main>
  );
}
