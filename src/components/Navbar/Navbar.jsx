import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import styles from './Navbar.module.css';

const leftLinks = [{ to: '/', label: 'HOME' }, { to: '/about', label: 'ABOUT' }];
const rightLinks = [{ to: '/services', label: 'SERVICES' }, { to: '/work', label: 'WORK' }, { to: '/contact', label: 'CONTACT' }];
const allLinks = [...leftLinks, ...rightLinks];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const navLink = ({ to, label }) => (
    <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => [styles.link, isActive ? styles.active : ''].join(' ')} onClick={() => setOpen(false)}>
      {label}{label === 'CONTACT' && <ArrowUpRight aria-hidden="true" size={15} />}
    </NavLink>
  );

  return (
    <><a href="#page-content" className={styles.skip}>Skip to content</a><header className={[styles.header, scrolled || location.pathname !== '/' ? styles.scrolled : '', location.pathname === '/contact' ? styles.contactHeader : ''].join(' ')}>
      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.left}>{leftLinks.map(navLink)}</div>
        <Link className={styles.wordmark} to="/" onClick={() => setOpen(false)} aria-label="Syrena, home">SYRENA</Link>
        <div className={styles.right}>{rightLinks.map(navLink)}</div>
        <button className={styles.menuButton} type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)}>
          {open ? <X size={27} /> : <Menu size={27} />}
        </button>
      </nav>
      <nav id="mobile-navigation" aria-label="Mobile navigation" className={[styles.mobileMenu, open ? styles.mobileOpen : ''].join(' ')} inert={!open}>
        {allLinks.map(navLink)}
      </nav>
    </header></>
  );
}
