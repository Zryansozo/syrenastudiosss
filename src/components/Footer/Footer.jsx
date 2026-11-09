import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconBrandGithubFilled as Github, IconBrandInstagram as Instagram, IconBrandYoutubeFilled as Youtube } from '@tabler/icons-react';
import ReferencePaperWave from './ReferencePaperWave';
import styles from './Footer.module.css';

const navigation = [['Home', '/'], ['Contact', '/contact'], ['Work', '/work'], ['Journal', '/#studio-journal']];

function XMark() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.6 22H2.4l8.2-9.5L.8 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z" /></svg>;
}

export default function Footer() {
  const location = useLocation();
  const siteUrl = encodeURIComponent(window.location.origin);
  useEffect(() => {
    if (location.pathname !== '/' || location.hash !== '#studio-journal') return;
    let frame = 0;
    const observer = new MutationObserver(findJournal);
    function findJournal() {
      const journal = document.getElementById('studio-journal');
      if (!journal) return;
      observer.disconnect();
      frame = requestAnimationFrame(() => {
        journal.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      });
    }
    observer.observe(document.getElementById('root'), { childList: true, subtree: true });
    findJournal();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [location.pathname, location.hash, location.key]);

  return <footer className={styles.footer}>
    <ReferencePaperWave />
    <div className={styles.content}>
      <Link to="/" className={styles.brand} aria-label="Syrena home">
        <img src="/artwork/reference-paper/wave-mark.svg" width="76" height="77" alt="" />
        <span>SYRENA</span>
      </Link>
      <nav className={styles.navigation} aria-label="Footer navigation">
        {navigation.map(([name, to]) => <Link key={name} to={to}>{name}</Link>)}
      </nav>
      <div className={styles.socials} aria-label="Social links">
        <a href={`https://twitter.com/intent/tweet?url=${siteUrl}&text=Syrena%20Studio`} target="_blank" rel="noopener noreferrer" aria-label="Share Syrena on X (opens in a new tab)"><XMark /></a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Open Instagram (opens in a new tab)"><Instagram strokeWidth={1.7} /></a>
        <a href="https://www.youtube.com/results?search_query=Syrena+Studio" target="_blank" rel="noopener noreferrer" aria-label="Find Syrena Studio on YouTube (opens in a new tab)"><Youtube strokeWidth={1.7} /></a>
        <a href="https://github.com/Zryansozo/syrenastudiosss" target="_blank" rel="noopener noreferrer" aria-label="View Syrena’s website on GitHub (opens in a new tab)"><Github strokeWidth={1.7} /></a>
      </div>
      <div className={styles.bottom}>
        <p className={styles.copyright}>© {new Date().getFullYear()} Syrena Studio. All rights reserved.</p>
        <details className={styles.notes}>
          <summary>Website information</summary>
          <p>Syrena is a studio in development. Work shown as studio concepts is not commissioned client work. The contact brief builder works locally in your browser; it does not submit a form to a server. Email drafts only send through your email application when you choose to send them. This site loads fonts from Google Fonts. Project scope, fees, timing, and support arrangements are agreed separately.</p>
        </details>
      </div>
    </div>
  </footer>;
}
