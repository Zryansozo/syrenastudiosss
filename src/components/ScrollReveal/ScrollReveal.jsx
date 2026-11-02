import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const directionMap = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  once = true,
  threshold = 0.15,
  className = '',
  style = {},
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
  });

  const offset = directionMap[direction] || directionMap.up;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{
        opacity: 0,
        ...offset,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              transition: {
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1],
              },
            }
          : {}
      }
    >
      {children}
    </motion.div>
  );
}
