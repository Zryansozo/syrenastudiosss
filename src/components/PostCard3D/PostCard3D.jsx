import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw } from 'lucide-react';
import styles from './PostCard3D.module.css';

export default function PostCard3D() {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const frontButtonRef = useRef(null);
  const backButtonRef = useRef(null);
  const showBack = () => { setFlipped(true); requestAnimationFrame(() => backButtonRef.current?.focus()); };
  const showFront = () => { setFlipped(false); requestAnimationFrame(() => frontButtonRef.current?.focus()); };
  const onPointerMove = (event) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || flipped) return;
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setTilt({
      x: ((event.clientY - bounds.top) / bounds.height - .5) * -5,
      y: ((event.clientX - bounds.left) / bounds.width - .5) * 5,
    });
  };

  return (
    <div className={styles.container} ref={cardRef} onPointerMove={onPointerMove} onPointerLeave={() => setTilt({ x: 0, y: 0 })}>
      <div className={styles.tilt} style={{ '--tilt-x': tilt.x + 'deg', '--tilt-y': tilt.y + 'deg' }}>
        <div className={[styles.flipper, flipped ? styles.flipped : ''].join(' ')}>
          <div className={styles.front} inert={flipped}>
            <div className={styles.frontArt} aria-hidden="true">
              <span className={styles.artSun} />
              <span className={styles.waveOne} />
              <span className={styles.waveTwo} />
              <span className={styles.waveThree} />
            </div>
            <span className={styles.greeting}>Greetings from</span>
            <span className={styles.edition}>A NEW CREATIVE CURRENT<br />NO. 001 / STUDIO NOTES</span>
            <span className={styles.brand}>SYRENA</span>
            <span className={styles.studios}>STUDIOS</span>
            <span className={styles.star} aria-hidden="true">✳</span>
            <span className={styles.seaNote}>With a little sea air ♡</span>
            <span className={styles.roundBadge}><em>A little<br />different.</em><small>BY DESIGN ↗</small></span>
            <span className={styles.bottomLeft}>STRATEGY · DIGITAL · IDENTITY</span>
            <span className={styles.bottomRight}>A NOTE FROM US TO YOU ↗</span>
            <button ref={frontButtonRef} className={styles.frontFlip} type="button" onClick={showBack} aria-label="Flip postcard to read about Syrena">
              <span>Turn over to meet us <RotateCcw size={14} aria-hidden="true" /></span>
            </button>
          </div>
          <div className={styles.back} inert={!flipped}>
            <div className={styles.backTop}><span>POSTCARD / NO. 001</span><span>SYRENA STUDIOS</span></div>
            <div className={styles.backGrid}>
              <div>
                <span className={styles.backEyebrow}>ABOUT SYRENA</span>
                <h2>A new creative current.</h2>
                <p>We bring thoughtful brands and expressive websites to life, with a little more depth and a little sea air.</p>
                <span className={styles.signature}>With love, Syrena ♡</span>
              </div>
              <div className={styles.backAddress}>
                <span>TO: CURIOUS MINDS</span>
                <span>FROM: SOMEWHERE BETWEEN IDEAS &amp; THE SEA</span>
                <Link to="/about" onClick={event => event.stopPropagation()}>Get to know us <ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            </div>
            <button ref={backButtonRef} className={styles.backFlip} type="button" onClick={showFront}><RotateCcw size={16} aria-hidden="true" /> Flip back</button>
          </div>
        </div>
      </div>
    </div>
  );
}
