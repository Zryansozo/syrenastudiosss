import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowUpRight, X } from 'lucide-react';
import Magnetic from '../Magnetic/Magnetic';
import styles from './Navbar.module.css';

const navLinks = [
  { 
    to: '/', 
    label: 'Home',
    img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1400&q=80',
  },
  { 
    to: '/about', 
    label: 'About',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80',
  },
  { 
    to: '/services', 
    label: 'Services',
    img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1400&q=80',
  },
  { 
    to: '/work', 
    label: 'Work',
    img: 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=1400&q=80',
  },
  { 
    to: '/contact', 
    label: 'Contact',
    img: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1400&q=80',
  },
];

// Skiper-style Dual-Layer Rolling Text component
function SkiperRollingText({ text }) {
  const chars = text.split('');
  return (
    <span className={styles.rollContainer}>
      <span className={styles.rollPrimary} aria-hidden="true">
        {chars.map((c, i) => (
          <span
            key={i}
            className={styles.rollChar}
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {c === ' ' ? '\u00A0' : c}
          </span>
        ))}
      </span>
      <span className={styles.rollSecondary}>
        {chars.map((c, i) => (
          <span
            key={i}
            className={styles.rollChar}
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {c === ' ' ? '\u00A0' : c}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Refs
  const line1 = useRef(null);
  const line2 = useRef(null);
  const line3 = useRef(null);
  const triggerBtnRef = useRef(null);
  const overlayRef = useRef(null);
  const circleRevealRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRefs = useRef([]);
  const linksRef = useRef([]);
  const rightRef = useRef(null);
  const tlRef = useRef(null);

  // Scroll detection for dynamic island pill compression
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ═══════ UNDERWATER BUBBLES CANVAS ═══════
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const bubbles = Array.from({ length: 35 }, () => ({
      x: Math.random() * w,
      y: h + Math.random() * 100,
      r: 2 + Math.random() * 6,
      speed: 0.5 + Math.random() * 1.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.02,
      opacity: 0.15 + Math.random() * 0.35,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of bubbles) {
        b.y -= b.speed;
        b.wobble += b.wobbleSpeed;
        const x = b.x + Math.sin(b.wobble) * 15;

        // Outer bubble
        ctx.beginPath();
        ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(192, 210, 224, ${b.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Inner highlight
        ctx.beginPath();
        ctx.arc(x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.6})`;
        ctx.fill();

        if (b.y < -10) {
          b.y = h + 10;
          b.x = Math.random() * w;
        }
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, [isOpen]);

  // ═══════ GSAP CIRCULAR REVEAL TIMELINE ═══════
  useEffect(() => {
    const overlay = overlayRef.current;
    const circle = circleRevealRef.current;
    const links = linksRef.current.filter(Boolean);
    const right = rightRef.current;
    const l1 = line1.current, l2 = line2.current, l3 = line3.current;

    if (!overlay || !circle || !l1 || !l2 || !l3) return;

    // Get trigger button position dynamically
    const getOrigin = () => {
      if (triggerBtnRef.current) {
        const rect = triggerBtnRef.current.getBoundingClientRect();
        return `${Math.round(rect.left + rect.width / 2)}px ${Math.round(rect.top + rect.height / 2)}px`;
      }
      return 'calc(100% - 60px) 40px';
    };

    const origin = getOrigin();

    // Set initial states
    gsap.set(overlay, { autoAlpha: 0 });
    gsap.set(circle, { clipPath: `circle(0% at ${origin})` });
    gsap.set(links, { autoAlpha: 0 });
    if (right) gsap.set(right, { autoAlpha: 0, scale: 0.9 });

    const tl = gsap.timeline({ paused: true });

    // 1. Hamburger morph
    tl.to(l1, { rotate: 45, y: 7, backgroundColor: '#C0D2E0', duration: 0.3, ease: 'power3.out' }, 0)
      .to(l2, { scaleX: 0, opacity: 0, duration: 0.2 }, 0)
      .to(l3, { rotate: -45, y: -7, backgroundColor: '#C0D2E0', duration: 0.3, ease: 'power3.out' }, 0);

    // 2. Show overlay
    tl.to(overlay, { autoAlpha: 1, duration: 0.01 }, 0);

    // 3. Circular clip-path reveal expanding from trigger
    tl.to(circle, {
      clipPath: `circle(150% at ${origin})`,
      duration: 1,
      ease: 'power4.inOut',
    }, 0);

    // 4. Character-by-character stagger for each link
    tl.add(() => {
      links.forEach((link, i) => {
        const chars = link.querySelectorAll(`.${styles.char}`);
        if (chars.length > 0) {
          gsap.to(chars, {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.03,
            duration: 0.5,
            ease: 'power3.out',
            delay: i * 0.08,
          });
        }
        const num = link.querySelector(`.${styles.linkNum}`);
        if (num) {
          gsap.to(num, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out', delay: i * 0.08 });
        }
      });
    }, 0.45);

    // 5. Make link containers visible
    tl.to(links, { autoAlpha: 1, duration: 0.01 }, 0.44);

    // 6. Right panel
    if (right) {
      tl.to(right, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, 0.6);
    }

    tlRef.current = tl;
    return () => tl.kill();
  }, []);

  // Play/reverse
  useEffect(() => {
    if (!tlRef.current) return;
    const overlay = overlayRef.current;

    if (isOpen) {
      if (overlay) overlay.style.pointerEvents = 'all';

      linksRef.current.filter(Boolean).forEach((link) => {
        const chars = link.querySelectorAll(`.${styles.char}`);
        const num = link.querySelector(`.${styles.linkNum}`);
        gsap.set(chars, { autoAlpha: 0, y: 40, rotateX: -60 });
        if (num) gsap.set(num, { autoAlpha: 0, x: -20 });
      });

      if (triggerBtnRef.current && circleRevealRef.current) {
        const rect = triggerBtnRef.current.getBoundingClientRect();
        const origin = `${Math.round(rect.left + rect.width / 2)}px ${Math.round(rect.top + rect.height / 2)}px`;
        gsap.set(circleRevealRef.current, { clipPath: `circle(0% at ${origin})` });
        tlRef.current.to(circleRevealRef.current, {
          clipPath: `circle(150% at ${origin})`,
          duration: 1,
          ease: 'power4.inOut',
        }, 0);
      }

      tlRef.current.play(0);
    } else {
      const circle = circleRevealRef.current;
      const l1 = line1.current, l2 = line2.current, l3 = line3.current;
      
      if (circle) {
        const rect = triggerBtnRef.current?.getBoundingClientRect();
        const origin = rect ? `${Math.round(rect.left + rect.width / 2)}px ${Math.round(rect.top + rect.height / 2)}px` : 'calc(100% - 60px) 40px';
        gsap.to(circle, { clipPath: `circle(0% at ${origin})`, duration: 0.6, ease: 'power4.inOut' });
      }
      if (overlay) {
        gsap.to(overlay, { autoAlpha: 0, duration: 0.1, delay: 0.55, onComplete: () => { overlay.style.pointerEvents = 'none'; } });
      }
      if (l1) gsap.to(l1, { rotate: 0, y: 0, backgroundColor: '#fff', duration: 0.3 });
      if (l2) gsap.to(l2, { scaleX: 1, opacity: 1, duration: 0.2 });
      if (l3) gsap.to(l3, { rotate: 0, y: 0, backgroundColor: '#fff', duration: 0.3 });
    }
  }, [isOpen]);

  // Auto close on route
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // ESC
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const go = useCallback((to) => { setIsOpen(false); navigate(to); }, [navigate]);

  // Split label into individual character spans
  const splitChars = (label) => {
    return label.split('').map((char, i) => (
      <span key={i} className={styles.char}>{char}</span>
    ));
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════
          SKIPER-STYLE FLOATING GLASS PILL NAVBAR
         ═══════════════════════════════════════════════ */}
      <header className={`${styles.floatingNavHeader} ${scrolled ? styles.scrolled : ''} ${isOpen ? styles.navHiddenOnOpen : ''}`}>
        <nav className={styles.navPillContainer} aria-label="Quick Navigation">
          {/* Brand Logo & Name */}
          <Link to="/" className={styles.brandLink} data-hover>
            <div className={styles.brandIconWrap}>
              <svg viewBox="0 0 40 40" fill="none" className={styles.brandSvg}>
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M20 8c-2 4-6 8-6 14 0 4 2.5 7 6 10 3.5-3 6-6 6-10 0-6-4-10-6-14z" fill="currentColor" opacity="0.25" />
                <path d="M20 8c-2 4-6 8-6 14 0 4 2.5 7 6 10 3.5-3 6-6 6-10 0-6-4-10-6-14z" stroke="currentColor" strokeWidth="1.2" fill="none" />
              </svg>
            </div>
            <span className={styles.brandTitle}>SYRENA</span>
          </Link>

          {/* Center: Desktop Nav Links with Skiper Rolling-Text */}
          <div className={styles.linksPillWrap}>
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`${styles.navPillLink} ${isActive ? styles.navPillActive : ''}`}
                  data-hover
                >
                  <SkiperRollingText text={item.label} />
                  {isActive && <span className={styles.activeDot} />}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions (Let's Talk CTA + Morphing Menu Button) */}
          <div className={styles.actionsWrap}>
            <Magnetic strength={0.25}>
              <button onClick={() => go('/contact')} className={styles.ctaPillBtn} data-hover>
                <span className={styles.ctaPulseDot} />
                <span className={styles.ctaText}>Start a Project</span>
                <ArrowUpRight size={14} className={styles.ctaArrow} />
              </button>
            </Magnetic>

            <Magnetic strength={0.3}>
              <button
                ref={triggerBtnRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`${styles.pillTriggerBtn} ${isOpen ? styles.triggerActive : ''}`}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                data-hover
              >
                <div className={styles.linesBox}>
                  <span ref={line1} className={styles.line} />
                  <span ref={line2} className={styles.line} />
                  <span ref={line3} className={styles.line} />
                </div>
              </button>
            </Magnetic>
          </div>
        </nav>
      </header>

      {/* ═══════════════════════════════════════════════
          FULL-SCREEN CIRCULAR REVEAL OVERLAY (GSAP)
         ═══════════════════════════════════════════════ */}
      <div ref={overlayRef} className={styles.overlay}>
        <div ref={circleRevealRef} className={styles.circleReveal}>

          {/* Ocean imagery background — changes on hover */}
          <div className={styles.imgLayer}>
            {navLinks.map((link, i) => (
              <img
                key={i}
                ref={(el) => (imgRefs.current[i] = el)}
                src={link.img}
                alt=""
                className={`${styles.bgImg} ${activeImg === i ? styles.bgImgActive : ''}`}
              />
            ))}
            <div className={styles.imgOverlayGradient} />
          </div>

          {/* Underwater bubbles canvas */}
          <canvas ref={canvasRef} className={styles.bubblesCanvas} />

          {/* Content */}
          <div className={styles.overlayContent}>
            
            {/* Top bar */}
            <div className={styles.topBar}>
              <button onClick={() => go('/')} className={styles.logoBrand} data-hover>
                <svg viewBox="0 0 40 40" fill="none" className={styles.logoSvg}>
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M20 8c-2 4-6 8-6 14 0 4 2.5 7 6 10 3.5-3 6-6 6-10 0-6-4-10-6-14z" fill="currentColor" opacity="0.2" />
                  <path d="M20 8c-2 4-6 8-6 14 0 4 2.5 7 6 10 3.5-3 6-6 6-10 0-6-4-10-6-14z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                </svg>
                <span>SYRENA</span>
              </button>

              <button onClick={() => setIsOpen(false)} className={styles.closeBtn} data-hover>
                <X size={22} />
              </button>
            </div>

            {/* Split layout: Left nav + Right info */}
            <div className={styles.splitLayout}>

              {/* Left: Giant character-animated nav links */}
              <nav className={styles.navCol} aria-label="Main Navigation">
                {navLinks.map((item, i) => (
                  <div
                    key={item.to}
                    ref={(el) => (linksRef.current[i] = el)}
                    className={styles.linkRow}
                    onMouseEnter={() => setActiveImg(i)}
                  >
                    <button
                      onClick={() => go(item.to)}
                      onMouseEnter={() => setActiveImg(i)}
                      className={`${styles.linkBtn} ${location.pathname === item.to ? styles.linkActive : ''}`}
                      data-hover
                    >
                      <span className={styles.linkNum}>0{i + 1}</span>
                      <span className={styles.linkLabel}>
                        {splitChars(item.label)}
                      </span>
                      <ArrowUpRight className={styles.linkArrow} size={36} />
                    </button>
                  </div>
                ))}
              </nav>

              {/* Right: Hovering preview + info */}
              <div ref={rightRef} className={styles.rightCol}>
                <div className={styles.previewCard}>
                  <div className={styles.previewImgWrap}>
                    <img 
                      src={navLinks[activeImg]?.img} 
                      alt={navLinks[activeImg]?.label}
                      className={styles.previewImg}
                    />
                    <div className={styles.previewOverlay} />
                  </div>
                  <div className={styles.previewMeta}>
                    <span className={styles.previewLabel}>{navLinks[activeImg]?.label}</span>
                    <button onClick={() => go(navLinks[activeImg]?.to)} className={styles.previewBtn} data-hover>
                      <span>Enter</span>
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.infoBlock}>
                  <a href="mailto:hello@syrena.agency" className={styles.infoLink}>hello@syrena.agency</a>
                  <a href="tel:+1234567890" className={styles.infoLink}>+1 (234) 567-890</a>
                  <span className={styles.infoLink}>New York · London</span>
                </div>

                <button onClick={() => go('/contact')} className={styles.ctaBtn} data-hover>
                  <span>Start a Project</span>
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>

            {/* Bottom */}
            <div className={styles.bottomBar}>
              <span className={styles.bottomText}>© {new Date().getFullYear()} Syrena Digital</span>
              <div className={styles.paletteStrip}>
                {['#091E39','#0B345A','#21567C','#4C81A3','#79A4C0','#A3BED3','#C0D2E0'].map((c) => (
                  <div key={c} className={styles.paletteChip} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
