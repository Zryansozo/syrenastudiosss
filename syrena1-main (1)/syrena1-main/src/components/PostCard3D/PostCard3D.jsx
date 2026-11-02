import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RotateCw, Sparkles, Compass } from 'lucide-react';
import styles from './PostCard3D.module.css';

export default function PostCard3D() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
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
        className={`${styles.card3DWrap} ${isFlipped ? styles.flipped : ''}`}
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
        <div className={styles.cardFront}>
          <div className={styles.cardBorderFrame} />

          <div className={styles.cardFrontContent}>
            {/* Top Stamp Header */}
            <div className={styles.stampHeader}>
              <div className={styles.postmark}>
                <Compass size={14} className={styles.postmarkIcon} />
                <span className={styles.postmarkDate}>EST. 2024 / ARCHIVAL</span>
              </div>
              <div className={styles.postageStamp}>
                <div className={styles.stampInner}>
                  <Sparkles size={13} className={styles.stampStar} />
                  <span className={styles.stampPrice}>01</span>
                </div>
              </div>
            </div>

            {/* Main Brand Title */}
            <div className={styles.brandSection}>
              <p className={styles.atelierLabel}>CREATIVE DIGITAL ATELIER</p>
              <h1 className={styles.brandTitle}>SYRENA</h1>
              <h2 className={styles.brandSubtitle}>STUDIOS</h2>
              <div className={styles.titleDivider} />
            </div>

            {/* Front Sub-Details */}
            <div className={styles.frontFooter}>
              <div className={styles.frontMeta}>
                <span className={styles.metaLabel}>DISCIPLINE</span>
                <span className={styles.metaValue}>Strategy • WebGL • Identity</span>
              </div>
              <div className={styles.cardCornerBadge}>
                <span>ABOUT US ↻</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════ BACK SIDE (ABOUT US) ═════════════════════════ */}
        <div className={styles.cardBack}>
          <div className={styles.cardBorderFrame} />

          <div className={styles.cardBackContent}>
            {/* Left Column: About Us Message */}
            <div className={styles.messageColumn}>
              <div className={styles.aboutHeader}>
                <span className={styles.aboutTag}>ABOUT SYRENA</span>
                <h3 className={styles.aboutHeading}>Sculpting Digital Dominance</h3>
              </div>
              <p className={styles.aboutBody}>
                We are an avant-garde digital atelier engineering high-converting ecosystems, bespoke 3D architectures, and iconic brand narratives that captivate audiences.
              </p>
              <div className={styles.atelierSignature}>
                <span className={styles.sigLine}>With strategy & precision,</span>
                <span className={styles.sigName}>The Syrena Team</span>
              </div>
            </div>

            {/* Vertical Postcard Split Line */}
            <div className={styles.postcardDivider} />

            {/* Right Column: Postcard Address Lines & Actions */}
            <div className={styles.addressColumn}>
              <div className={styles.addressHeader}>
                <div className={styles.miniStamp}>
                  <span>AIR MAIL</span>
                </div>
              </div>

              <div className={styles.addressLines}>
                <div className={styles.addressLine}>
                  <span className={styles.lineLabel}>TO:</span>
                  <span className={styles.lineText}>Visionary Founders & Leaders</span>
                </div>
                <div className={styles.addressLine}>
                  <span className={styles.lineLabel}>IN:</span>
                  <span className={styles.lineText}>Global / Digital Ecosystem</span>
                </div>
                <div className={styles.addressLine}>
                  <span className={styles.lineLabel}>AT:</span>
                  <span className={styles.lineText}>hello@syrena.io</span>
                </div>
              </div>

              <div className={styles.backActions}>
                <Link to="/services" className={styles.exploreBtn}>
                  <span>Explore Work</span>
                  <ArrowRight size={12} />
                </Link>
                <button
                  type="button"
                  className={styles.flipBackBtn}
                  onClick={() => setIsFlipped(false)}
                  title="Flip back to front"
                >
                  <RotateCw size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
