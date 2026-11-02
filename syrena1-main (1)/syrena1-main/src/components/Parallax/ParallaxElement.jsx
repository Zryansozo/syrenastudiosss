import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ParallaxElement moves any child element along Y (or X) at a custom rate relative to scroll.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.speed=0.2] - Speed factor: positive moves down slower/faster, negative moves opposite
 * @param {number} [props.rotate=0] - Optional rotation in degrees during scroll
 * @param {string} [props.className='']
 * @param {React.CSSProperties} [props.style={}]
 */
export default function ParallaxElement({
  children,
  speed = 0.2,
  rotate = 0,
  className = '',
  style = {},
  ...props
}) {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const yDistance = speed * 250;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          y: -yDistance,
          rotate: rotate ? -rotate : 0,
        },
        {
          y: yDistance,
          rotate: rotate ? rotate : 0,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [speed, rotate]);

  return (
    <div
      ref={elRef}
      className={`parallax-el ${className}`}
      style={{ willChange: 'transform', ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
