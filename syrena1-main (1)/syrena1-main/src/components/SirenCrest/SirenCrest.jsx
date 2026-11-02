import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './SirenCrest.module.css';

export default function SirenCrest({ size = 48, className = '', interactive = true }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const paths = svg.querySelectorAll('path, circle, line');
    
    // Set initial dasharray for drawing animation
    paths.forEach((path) => {
      if (path.getTotalLength) {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });
      }
    });

    // Draw paths in with GSAP stagger
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(paths, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 1.6,
      stagger: 0.12,
    });

    // Subtle breathing float loop
    gsap.to(svg, {
      y: -4,
      rotation: 1.5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    if (!interactive || !containerRef.current) return;

    // Mouse magnetic tilt
    const xTo = gsap.quickTo(svg, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(svg, 'y', { duration: 0.6, ease: 'power3' });
    const rotTo = gsap.quickTo(svg, 'rotation', { duration: 0.6, ease: 'power3' });

    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) * 0.25;
      const dy = (e.clientY - centerY) * 0.25;
      xTo(dx);
      yTo(dy);
      rotTo(dx * 0.15);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      rotTo(0);
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      tl.kill();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [interactive]);

  return (
    <div ref={containerRef} className={`${styles.crestContainer} ${className}`} style={{ width: size, height: size }}>
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.crestSvg}
      >
        <defs>
          <linearGradient id="sirenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#8BA3C5" />
            <stop offset="100%" stopColor="#64D2FF" />
          </linearGradient>
          <filter id="crestGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Pearl Halo Ring */}
        <circle cx="50" cy="50" r="44" stroke="url(#sirenGrad)" strokeWidth="1.2" opacity="0.6" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="38" stroke="url(#sirenGrad)" strokeWidth="1" opacity="0.35" />

        {/* Siren Crown / Crest Triad */}
        <path d="M42 28L50 18L58 28" stroke="url(#sirenGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="16" r="2" fill="#64D2FF" filter="url(#crestGlow)" />

        {/* Siren Dual Tails (Symmetrical Mythological Wave Fins) */}
        <path d="M50 36C45 46 32 50 26 62C22 70 24 80 34 82C42 84 46 76 50 68" stroke="url(#sirenGrad)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M50 36C55 46 68 50 74 62C78 70 76 80 66 82C58 84 54 76 50 68" stroke="url(#sirenGrad)" strokeWidth="1.6" strokeLinecap="round" />

        {/* Tail Fin Flukes */}
        <path d="M26 62C20 66 18 74 24 80" stroke="url(#sirenGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <path d="M74 62C80 66 82 74 76 80" stroke="url(#sirenGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

        {/* Central Luminous Pearl Core */}
        <circle cx="50" cy="46" r="4.5" fill="#F0ECDD" filter="url(#crestGlow)" />
        <circle cx="50" cy="46" r="8" stroke="#64D2FF" strokeWidth="0.75" opacity="0.75" />
      </svg>
    </div>
  );
}
