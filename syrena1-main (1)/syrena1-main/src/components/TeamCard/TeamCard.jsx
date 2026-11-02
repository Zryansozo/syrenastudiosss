import ParallaxImage from '../Parallax/ParallaxImage';
import Magnetic from '../Magnetic/Magnetic';
import styles from './TeamCard.module.css';

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function TeamCard({ name, role, image, linkedin, twitter }) {
  return (
    <div className={styles.card} data-cursor="CONNECT">
      <div className={styles.imageWrap}>
        <ParallaxImage
          src={image}
          alt={name}
          speed={0.12}
          scale={1.2}
          className={styles.teamImg}
        />
        <div className={styles.socials}>
          {linkedin && (
            <Magnetic strength={0.3}>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s LinkedIn`} data-hover>
                <LinkedInIcon />
              </a>
            </Magnetic>
          )}
          {twitter && (
            <Magnetic strength={0.3}>
              <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s Twitter`} data-hover>
                <XIcon />
              </a>
            </Magnetic>
          )}
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.role}>{role}</p>
      </div>
    </div>
  );
}
