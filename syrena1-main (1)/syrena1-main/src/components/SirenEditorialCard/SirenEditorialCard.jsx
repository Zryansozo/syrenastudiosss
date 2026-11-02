import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Compass, Shield } from 'lucide-react';
import SirenCrest from '../SirenCrest/SirenCrest';
import sirenEditorialImg from '../../assets/siren-editorial.jpg';
import styles from './SirenEditorialCard.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function SirenEditorialCard({ className = '' }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const img = imageRef.current;
    if (!card || !img) return;

    // Reveal animation with ScrollTrigger
    gsap.fromTo(
      card,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
      }
    );

    // Mouse magnetic 3D tilt
    const xTo = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power2' });
    const yTo = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power2' });
    const imgXTo = gsap.quickTo(img, 'x', { duration: 0.6, ease: 'power2' });
    const imgYTo = gsap.quickTo(img, 'y', { duration: 0.6, ease: 'power2' });

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -8;
      const rotY = ((x - centerX) / centerX) * 8;

      xTo(rotY);
      yTo(rotX);
      imgXTo(-rotY * 1.5);
      imgYTo(-rotX * 1.5);

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${x}px, ${y}px)`;
        glowRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      imgXTo(0);
      imgYTo(0);
      if (glowRef.current) {
        glowRef.current.style.opacity = '0';
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className={`${styles.cardPerspective} ${className}`}>
      <div ref={cardRef} className={styles.card}>
        <div ref={glowRef} className={styles.cardCursorGlow} />

        <div className={styles.imageWrap}>
          <img
            ref={imageRef}
            src={sirenEditorialImg}
            alt="Syrena Haute Couture Editorial"
            className={styles.image}
          />
          <div className={styles.imageOverlay} />
        </div>

        {/* Floating Luxury Glass Badges */}
        <div className={styles.topBadge}>
          <SirenCrest size={28} interactive={false} />
          <span className={styles.badgeText}>SYRENA COUTURE LAB</span>
        </div>

        <div className={styles.bottomMeta}>
          <div className={styles.metaLeft}>
            <span className={styles.metaTitle}>The Siren Aesthetic</span>
            <span className={styles.metaSubtitle}>Haute Visual Craft &amp; Fluid Engineering</span>
          </div>
          <div className={styles.depthPill}>
            <Sparkles size={13} className={styles.sparkleIcon} />
            <span>-432m Depths</span>
          </div>
        </div>
      </div>
    </div>
  );
}
