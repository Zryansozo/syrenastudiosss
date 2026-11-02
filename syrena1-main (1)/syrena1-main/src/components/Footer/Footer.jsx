import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUp, ArrowUpRight } from 'lucide-react';
import Magnetic from '../Magnetic/Magnetic';
import LighthouseNav from '../LighthouseNav/LighthouseNav';
import { useLenis } from '../../context/SmoothScrollContext';
import styles from './Footer.module.css';

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { scrollTo } = useLenis();

  const handleScrollTop = () => {
    if (scrollTo) {
      scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        {/* Giant Editorial Contact Link */}
        <div className={styles.bigCtaWrap}>
          <span className="label">Have an ambitious vision?</span>
          <Link to="/contact" className={styles.bigCtaLink} data-cursor="LET'S TALK">
            <span className={styles.bigCtaText}>Start a Project</span>
            <span className={styles.bigCtaArrow}><ArrowUpRight size={44} strokeWidth={1.5} /></span>
          </Link>
        </div>

        {/* Lighthouse Navigation */}
        <div className={styles.lighthouseWrap}>
          <LighthouseNav />
        </div>

        {/* Top Row */}
        <div className={styles.topRow}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Magnetic strength={0.2}>
              <Link to="/" className={styles.logo} data-hover>
                <svg className={styles.logoIcon} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M20 8c-2 4-6 8-6 14 0 4 2.5 7 6 10 3.5-3 6-6 6-10 0-6-4-10-6-14z" fill="currentColor" opacity="0.15" />
                  <path d="M20 8c-2 4-6 8-6 14 0 4 2.5 7 6 10 3.5-3 6-6 6-10 0-6-4-10-6-14z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                </svg>
                <span className={styles.logoText}>Syrena</span>
              </Link>
            </Magnetic>
            <p className={styles.tagline}>
              Crafting digital experiences that resonate, engage, and deliver measurable results for ambitious brands worldwide.
            </p>
            <div className={styles.socials}>
              <Magnetic strength={0.4}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-hover><InstagramIcon /></a>
              </Magnetic>
              <Magnetic strength={0.4}>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-hover><LinkedInIcon /></a>
              </Magnetic>
              <Magnetic strength={0.4}>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" data-hover><XIcon /></a>
              </Magnetic>
            </div>
          </div>

          {/* Services */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Services</h4>
            <Link to="/services" className={styles.footerLink} data-hover>Search Engine Optimization</Link>
            <Link to="/services" className={styles.footerLink} data-hover>Performance Advertising</Link>
            <Link to="/services" className={styles.footerLink} data-hover>Social Media Marketing</Link>
            <Link to="/services" className={styles.footerLink} data-hover>Content &amp; Editorial</Link>
            <Link to="/services" className={styles.footerLink} data-hover>Creative Web Development</Link>
          </div>

          {/* Contact Info */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Contact</h4>
            <a href="mailto:hello@syrena.agency" className={styles.contactItem} data-hover>
              <Mail size={15} />
              <span>hello@syrena.agency</span>
            </a>
            <a href="tel:+1234567890" className={styles.contactItem} data-hover>
              <Phone size={15} />
              <span>+1 (234) 567-890</span>
            </a>
            <div className={styles.contactItem}>
              <MapPin size={15} />
              <span>New York &middot; London</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p>&copy; {currentYear} Syrena Digital Agency. All rights reserved.</p>

          <Magnetic strength={0.3}>
            <button onClick={handleScrollTop} className={styles.backToTop} aria-label="Scroll to top" data-hover>
              <span>Back to top</span>
              <ArrowUp size={14} />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
