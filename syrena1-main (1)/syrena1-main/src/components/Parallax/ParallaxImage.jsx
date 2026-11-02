import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ParallaxImage component that smoothly scrubs an image inside a clipped container.
 * @param {Object} props
 * @param {string} props.src - Image URL
 * @param {string} props.alt - Image alt text
 * @param {number} [props.speed=0.25] - Parallax travel speed
 * @param {number} [props.scale=1.2] - Initial inner scale factor
 * @param {string} [props.className=''] - Container class name
 * @param {React.CSSProperties} [props.style={}] - Container styles
 * @param {React.CSSProperties} [props.imgStyle={}] - Image styles
 */
export default function ParallaxImage({
  src,
  alt = '',
  speed = 0.25,
  scale = 1.2,
  className = '',
  style = {},
  imgStyle = {},
  ...props
}) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const yOffset = speed * 100;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        {
          yPercent: -yOffset / 2,
          scale: scale,
        },
        {
          yPercent: yOffset / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [speed, scale]);

  return (
    <div
      ref={containerRef}
      className={`parallax-image-wrap ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          willChange: 'transform',
          ...imgStyle,
        }}
      />
    </div>
  );
}
