import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const { scrollTo } = useLenis();
  const shutterRef = useRef(null);

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
      className={styles.pageTransitionWrap}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.main>
  );
}
