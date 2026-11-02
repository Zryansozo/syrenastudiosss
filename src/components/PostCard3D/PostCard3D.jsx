import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { ArrowRight, RotateCw, Sparkles, Compass } from 'lucide-react';
import styles from './PostCard3D.module.css';

export default function PostCard3D() {
  const reducedMotion = useReducedMotion();
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (reducedMotion) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const toggleFlip = (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={styles.postcardContainer}>
      <div
        ref={cardRef}
        className={styles.card3DWrap}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={toggleFlip}
        style={{
          transform: isFlipped
            ? `rotateY(180deg) rotateX(${tilt.x * 0.4}deg) rotateY(${tilt.y * 0.4}deg)`
            : `rotateY(${tilt.y * 0.4}deg) rotateX(${tilt.x * 0.4}deg)`,
        }}
      >
        {/* Ambient Backlight Shadow */}
        <div className={styles.cardAuraGlow} />

        {/* ═════════════════════════ FRONT SIDE ═════════════════════════ */}
        <div className={styles.cardFront} inert={isFlipped} aria-hidden={isFlipped}>
          {/* Inner Stamp Framing Box */}
          <div className={styles.stampInnerFrame} />

          {/* Corner Crosshair Registration Marks */}
          <span className={`${styles.cornerCross} ${styles.crossTL}`}>+</span>
          <span className={`${styles.cornerCross} ${styles.crossTR}`}>+</span>
          <span className={`${styles.cornerCross} ${styles.crossBL}`}>+</span>
          <span className={`${styles.cornerCross} ${styles.crossBR}`}>+</span>

          {/* Wavy Postal Cancellation Stamp (Archival Ink Overlay) */}
          <svg className={styles.postalCancellation} viewBox="0 0 130 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 10 Q 16 0 32 10 T 64 10 T 96 10 T 128 10" stroke="var(--navy)" strokeWidth="1.4" opacity="0.4" />
            <path d="M 0 20 Q 16 10 32 20 T 64 20 T 96 20 T 128 20" stroke="var(--navy)" strokeWidth="1.4" opacity="0.4" />
            <path d="M 0 30 Q 16 20 32 30 T 64 30 T 96 30 T 128 30" stroke="var(--navy)" strokeWidth="1.4" opacity="0.4" />
            <circle cx="28" cy="20" r="14" stroke="var(--navy)" strokeWidth="1.1" opacity="0.38" strokeDasharray="3 2" />
            <text x="28" y="18" textAnchor="middle" fontSize="4.5" fontFamily="monospace" fill="var(--navy)" opacity="0.5" fontWeight="700">MARITIME</text>
            <text x="28" y="24" textAnchor="middle" fontSize="4" fontFamily="monospace" fill="var(--navy)" opacity="0.5" fontWeight="700">POST 24</text>
          </svg>

          <div className={styles.cardFrontContent}>
            {/* Top Stamp Header */}
            <div className={styles.stampHeader}>
              <div className={styles.postmark}>
                <Compass size={13} className={styles.postmarkIcon} />
                <span className={styles.postmarkDate}>A NEW CREATIVE CURRENT</span>
              </div>
              <div className={styles.postageStamp}>
                <div className={styles.stampInner}>
                  <Sparkles size={12} className={styles.stampStar} />
                  <span className={styles.stampPrice}>01</span>
                </div>
              </div>
            </div>

            {/* Main Brand Title */}
            <div className={styles.brandSection}>
              <p className={styles.atelierLabel}>CREATIVE DIGITAL ATELIER</p>
              <div className={styles.brandTitle}>SYRENA</div>
              <div className={styles.brandSubtitle}>STUDIOS</div>
              <div className={styles.titleDivider} />
            </div>

            {/* Front Sub-Details */}
            <div className={styles.frontFooter}>
              <div className={styles.frontMeta}>
                <span className={styles.metaLabel}>DISCIPLINE</span>
                <span className={styles.metaValue}>Strategy • Digital • Identity</span>
              </div>
              <div className={styles.cardCornerBadge}>
                <span>ABOUT US ↻</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════ BACK SIDE (ABOUT US) ═════════════════════════ */}
        <div className={styles.cardBack} inert={!isFlipped} aria-hidden={!isFlipped}>
          {/* Inner Stamp Framing Box */}
          <div className={styles.stampInnerFrame} />

          <span className={`${styles.cornerCross} ${styles.crossTL}`}>+</span>
          <span className={`${styles.cornerCross} ${styles.crossTR}`}>+</span>
          <span className={`${styles.cornerCross} ${styles.crossBL}`}>+</span>
          <span className={`${styles.cornerCross} ${styles.crossBR}`}>+</span>

          <div className={styles.cardBackContent}>
            {/* Top Section: About Us Message */}
            <div className={styles.messageSection}>
              <div className={styles.backTopHeader}>
                <span className={styles.aboutTag}>ABOUT SYRENA</span>
                <div className={styles.miniStamp}>
                  <span>AIR MAIL</span>
                </div>
              </div>
              <h3 className={styles.aboutHeading}>An Ocean of Possibilities</h3>
              <p className={styles.aboutBody}>
                A new creative studio taking shape around thoughtful brands, expressive websites, and ideas with a little more depth. Let’s see what we could create together.
              </p>
              <div className={styles.atelierSignature}>
                <span className={styles.sigLine}>With curiosity & a little sea air,</span>
                <span className={styles.sigName}>The Syrena Team</span>
              </div>
            </div>

            {/* Postcard Split Line */}
            <div className={styles.postcardDivider} />

            {/* Bottom Section: Postcard Address Lines & Actions */}
            <div className={styles.addressSection}>
              <div className={styles.addressLines}>
                <div className={styles.addressLine}>
                  <span className={styles.lineLabel}>TO:</span>
                  <span className={styles.lineText}>Curious people with good ideas</span>
                </div>
                <div className={styles.addressLine}>
                  <span className={styles.lineLabel}>IN:</span>
                  <span className={styles.lineText}>An ocean of possibilities</span>
                </div>
                <div className={styles.addressLine}>
                  <span className={styles.lineLabel}>AT:</span>
                  <span className={styles.lineText}>hello@syrena.agency</span>
                </div>
              </div>

              <div className={styles.backActions}>
                <Link to="/services" className={styles.exploreBtn}>
                  <span>Explore Services</span>
                  <ArrowRight size={12} />
                </Link>
                <button
                  type="button"
                  className={styles.flipBackBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                  title="Flip back to front"
                  aria-label="Flip postcard to front"
                >
                  <RotateCw size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className={styles.flipControl} onClick={() => setIsFlipped(!isFlipped)} aria-pressed={isFlipped}><RotateCw size={14} aria-hidden="true" />{isFlipped ? 'Back to the front' : 'Turn the postcard over'}</button>
    </div>
  );
}
