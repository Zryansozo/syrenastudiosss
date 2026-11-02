import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import ParallaxImage from '../Parallax/ParallaxImage';
import styles from './WorkCard.module.css';

export default function WorkCard({ image, title, category, description, stats, index = 0 }) {
  return (
    <Link to="/contact" className={styles.card} data-cursor="VIEW">
      <div className={styles.imageWrap}>
        <ParallaxImage
          src={image}
          alt={title}
          speed={0.15}
          scale={1.2}
          className={styles.parallaxImg}
        />
        <div className={styles.cardOverlay}>
          <div className={styles.overlayCircle}>
            <ArrowUpRight size={24} />
          </div>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.categoryRow}>
          <span className={styles.categoryBadge}>{category}</span>
          {stats && <span className={styles.statsBadge}>{stats}</span>}
        </div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDesc}>{description}</p>
      </div>
    </Link>
  );
}
