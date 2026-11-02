import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CinematicText.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * CinematicText component for Awwwards-style staggered 3D line/word reveals.
 * @param {Object} props
 * @param {string|React.ReactNode} props.children - Text to animate
 * @param {'lines'|'words'|'chars'} [props.type='words'] - Split strategy
 * @param {number} [props.delay=0] - Initial delay in seconds
 * @param {number} [props.duration=0.9] - Duration per element
 * @param {number} [props.stagger=0.035] - Delay between items
 * @param {boolean} [props.triggerOnScroll=true] - If true, triggers when entering viewport via ScrollTrigger
 * @param {string} [props.className='']
 * @param {React.CSSProperties} [props.style={}]
 * @param {'h1'|'h2'|'h3'|'h4'|'p'|'span'|'div'} [props.as='div'] - Element tag
 */
export default function CinematicText({
  children,
  type = 'words',
  delay = 0,
  duration = 0.9,
  stagger = 0.035,
  triggerOnScroll = true,
  className = '',
  style = {},
  as: Component = 'div',
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const targets = el.querySelectorAll(`.${styles.word}, .${styles.char}`);
    if (!targets.length) return;

    // Set initial state
    gsap.set(targets, {
      yPercent: 120,
      rotateX: -35,
      opacity: 0,
      filter: 'blur(6px)',
      transformOrigin: '50% 100%',
    });

    const animConfig = {
      yPercent: 0,
      rotateX: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration,
      stagger: {
        amount: stagger * targets.length,
        ease: 'power2.out',
      },
      ease: 'power3.out',
      delay,
    };

    let ctx;

    if (triggerOnScroll) {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(targets, animConfig);
          },
        });
      }, el);
    } else {
      ctx = gsap.context(() => {
        gsap.to(targets, animConfig);
      }, el);
    }

    return () => {
      ctx?.revert();
    };
  }, [children, delay, duration, stagger, triggerOnScroll, type]);

  // If children is plain string, split it
  if (typeof children === 'string') {
    if (type === 'chars') {
      const chars = children.split('');
      return (
        <Component ref={containerRef} className={`${styles.cinematicText} ${className}`} style={style}>
          <span className={styles.inlineWrapper}>
            {chars.map((char, index) => (
              <span key={index} className={styles.char}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </Component>
      );
    }

    const words = children.split(' ');
    return (
      <Component ref={containerRef} className={`${styles.cinematicText} ${className}`} style={style}>
        {words.map((word, index) => (
          <span key={index} className={styles.inlineWrapper}>
            <span className={styles.word}>
              {word}
              {index < words.length - 1 ? '\u00A0' : ''}
            </span>
          </span>
        ))}
      </Component>
    );
  }

  // If composite JSX, wrap
  return (
    <Component ref={containerRef} className={`${styles.cinematicText} ${className}`} style={style}>
      <span className={styles.inlineWrapper}>
        <span className={styles.word}>{children}</span>
      </span>
    </Component>
  );
}
