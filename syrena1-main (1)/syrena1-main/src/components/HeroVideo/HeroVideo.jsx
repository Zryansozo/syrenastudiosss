import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './HeroVideo.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function HeroVideo({ videoSrc = '/hero-bg.mp4', poster = '/images/hero.jpg' }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay was prevented
      });
    }

    const handleLoaded = () => {
      setIsLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoaded);
    return () => {
      video.removeEventListener('loadeddata', handleLoaded);
    };
  }, []);

  // Subtle Parallax & Opacity Fade on Scroll for Seamless Transition
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const ctx = gsap.context(() => {
      gsap.to(video, {
        y: '20%',
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.videoContainer} aria-hidden="true">
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        className={`${styles.videoElement} ${isLoaded ? styles.loaded : ''}`}
        src={videoSrc}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* Multi-Layered Seamless Overlays */}
      <div className={styles.radialVignette} />
      <div className={styles.topNavScrim} />
      <div className={styles.glowOverlay} />
      <div className={styles.ambientGrid} />
      <div className={styles.bottomSeamlessFade} />
    </div>
  );
}
