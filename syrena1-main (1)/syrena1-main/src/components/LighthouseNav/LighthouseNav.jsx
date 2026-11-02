import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import styles from './LighthouseNav.module.css';

const navItems = [
  { to: '/about', label: 'About Studio' },
  { to: '/services', label: 'Capabilities' },
  { to: '/work', label: 'Selected Work' },
  { to: '/contact', label: 'Get in Touch' },
];
const image = '/images/ocean-world/lighthouse-supplied.png';

export default function LighthouseNav() {
  const wrapRef = useRef(null);
  const lampRef = useRef(null);
  const headRef = useRef(null);
  const beamRef = useRef(null);
  const rowRefs = useRef([]);
  const controller = useRef(null);
  const [activeIdx, setActiveIdx] = useState(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let hovered = null, focused = null, idle = null, aim = null;
    const targets = [headRef.current, beamRef.current];
    function update() {
      const index = focused ?? hovered;
      setActiveIdx(index);
      idle?.kill(); aim?.kill();
      if (index !== null) {
        const row = rowRefs.current[index].getBoundingClientRect();
        const lamp = lampRef.current.getBoundingClientRect();
        // Vertical difference only: a horizontal searchlight, never atan2 aim.
        const deltaY = row.top + row.height / 2 - (lamp.top + lamp.height / 2);
        const angle = gsap.utils.clamp(-7, 7, deltaY * .028);
        aim = gsap.to(targets, { rotation: angle, duration: reduced.matches ? 0 : .7, ease: 'power2.out', overwrite: 'auto' });
      } else if (reduced.matches) {
        gsap.set(targets, { rotation: 0 });
      } else {
        // Recreate from the current pose: hover cannot kill a paused idle tween.
        idle = gsap.timeline({ repeat: -1 })
          .to(targets, { rotation: 0, duration: 3, ease: 'sine.inOut' })
          .to(targets, { rotation: -3, duration: 8, ease: 'sine.inOut' })
          .to(targets, { rotation: 2, duration: 11, ease: 'sine.inOut' })
          .to(targets, { rotation: 0, duration: 8, ease: 'sine.inOut' });
      }
    }
    controller.current = {
      hover(index) { hovered = index; update(); },
      focus(index) { focused = index; update(); },
    };
    const observer = new ResizeObserver(update);
    observer.observe(wrapRef.current);
    reduced.addEventListener('change', update);
    update();
    return () => {
      observer.disconnect(); reduced.removeEventListener('change', update);
      idle?.kill(); aim?.kill(); gsap.killTweensOf(targets); controller.current = null;
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.lighthouseNavWrap} data-lighthouse data-illuminating={activeIdx !== null}>
      <svg className={styles.materialFilters} aria-hidden="true" width="0" height="0">
        <defs>
          <filter id="syrena-printed-lighthouse" colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.025 0.08 0.38 0.82 0.94" />
              <feFuncG type="table" tableValues="0.075 0.19 0.46 0.81 0.91" />
              <feFuncB type="table" tableValues="0.14 0.30 0.53 0.74 0.81" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      <div className={styles.lighthouseCol} aria-hidden="true">
        <div className={styles.lighthouseBody}>
          <div className={styles.coastalMist} />
          <div className={styles.towerLayer}>
            <img src={image} alt="" className={styles.lighthouseImg} draggable="false" />
            <span className={styles.paperGrain} />
          </div>
          <div className={styles.balconyLayer}>
            <img src={image} alt="" draggable="false" />
          </div>
          <span className={styles.gimbal} />
          <div ref={headRef} className={styles.lanternHead} data-lantern-head>
            <img src={image} alt="" className={styles.lanternImage} draggable="false" />
            <span className={styles.lanternGlass} />
            <span className={styles.internalLight} />
            <span className={styles.lanternFrame} />
          </div>
          <div className={styles.roofLayer}>
            <img src={image} alt="" draggable="false" />
          </div>
          <span ref={lampRef} className={styles.lampOrigin} />
          <div ref={beamRef} className={`${styles.beamContainer} ${activeIdx !== null ? styles.beamActive : ''}`} data-lighthouse-beam>
            <div className={styles.beamGlow} />
            <div className={styles.beamCone} />
            <div className={styles.beamCore} />
          </div>
        </div>
      </div>
      <nav className={styles.navCol} aria-label="Footer Navigation">
        {navItems.map((item, i) => (
          <div key={item.to} ref={el => { rowRefs.current[i] = el; }}
            className={`${styles.navRow} ${activeIdx === i ? styles.illuminated : ''}`}
            onMouseEnter={() => controller.current?.hover(i)}
            onMouseLeave={() => controller.current?.hover(null)}>
            <Link to={item.to} className={styles.navLink} data-hover
              onFocus={event => { if (event.currentTarget.matches(':focus-visible')) controller.current?.focus(i); }}
              onBlur={() => controller.current?.focus(null)}>
              <span>{item.label}</span><ArrowRight className={styles.navLinkArrow} size={22} />
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
}
