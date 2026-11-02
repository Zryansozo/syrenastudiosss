import { Link } from 'react-router-dom';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { SeaMark } from '../Studio/StudioKit';
import styles from './Footer.module.css';

const navigation = [['Home', '/'], ['About', '/about'], ['Services', '/services'], ['Work', '/work'], ['Contact', '/contact']];

export default function Footer() {
  const toTop = () => window.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  });

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.main}>
          <div className={styles.studio}>
            <Link to="/" className={styles.brand} aria-label="Syrena home"><SeaMark kind="shell" /><span>syrena.</span></Link>
            <p>Independent minds. Ocean-sized ideas.</p>
          </div>
          <nav className={styles.navigation} aria-label="Footer navigation">
            {navigation.map(([name, to]) => <Link key={to} to={to}>{name}</Link>)}
          </nav>
          <div className={styles.contact}>
            <Link to="/contact" className={styles.projectLink}>Let’s make waves <ArrowUpRight size={17} aria-hidden="true" /></Link>
            <a className={styles.email} href="mailto:hello@syrena.agency">hello@syrena.agency</a>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Syrena Studio</span>
          <div className={styles.utilities}>
            <Link to="/faq">FAQ</Link>
            <button type="button" onClick={toTop}>Back to the surface <ArrowUp size={15} aria-hidden="true" /></button>
          </div>
        </div>
        <details className={styles.notes}>
          <summary>Website & project information</summary>
          <p>Syrena is a studio in development. Work shown as studio concepts is not commissioned client work. The contact brief builder works locally in your browser; it does not submit a form to a server. Email drafts only send through your email application when you choose to send them. This site loads fonts from Google Fonts. Project scope, fees, timing, and support arrangements are agreed separately.</p>
        </details>
      </div>
    </footer>
  );
}
