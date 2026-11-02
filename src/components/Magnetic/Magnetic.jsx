import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Magnetic component that smoothly pulls its children towards the mouse cursor.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.strength=0.35] - Magnetic pull strength (0 to 1)
 * @param {number} [props.textStrength=0.15] - Secondary pull strength for inner text
 * @param {string} [props.className='']
 */
export default function Magnetic({
  children,
  strength = 0.35,
  textStrength = 0.15,
  className = '',
  ...props
}) {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // Skip magnetic pull on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.3)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.3)' });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const deltaX = (clientX - centerX) * strength;
      const deltaY = (clientY - centerY) * strength;

      xTo(deltaX);
      yTo(deltaY);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, textStrength]);

  return (
    <div
      ref={elRef}
      className={`magnetic-wrap ${className}`}
      style={{ display: 'inline-block', position: 'relative' }}
      {...props}
    >
      {children}
    </div>
  );
}
