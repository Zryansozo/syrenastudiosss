import { Link } from 'react-router-dom';
import { ArrowRight, Search, BarChart3, Share2, Pen, Monitor, Palette } from 'lucide-react';
import PageTransition from '../../components/PageTransition/PageTransition';
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal';
import CinematicText from '../../components/CinematicText/CinematicText';
import Button from '../../components/Button/Button';
import Magnetic from '../../components/Magnetic/Magnetic';
import PostCard3D from '../../components/PostCard3D/PostCard3D';
import BlogSection from '../../components/BlogSection/BlogSection';
import styles from './Home.module.css';

const services = [
  { icon: Search, title: 'SEO Strategy', desc: 'Data-driven search optimization and semantic architecture that puts your brand directly where high-intent buyers search.', tag: 'Visibility' },
  { icon: BarChart3, title: 'Paid Advertising', desc: 'Precision-targeted performance campaigns across Google, Meta, and LinkedIn engineered for hyper-efficient CAC and scalable ROAS.', tag: 'Performance' },
  { icon: Share2, title: 'Social Media', desc: 'Authentic community building, creative cultural narratives, and viral campaigns that turn casual followers into lifelong brand advocates.', tag: 'Community' },
  { icon: Pen, title: 'Content Marketing', desc: 'Compelling editorial storytelling, thought-leadership pillars, and conversion copywriting that command industry authority.', tag: 'Storytelling' },
  { icon: Monitor, title: 'Web Development', desc: 'Ultra-fast, conversion-obsessed digital flagships engineered with modern WebGL, 60fps animations, and headless architecture.', tag: 'Engineering' },
  { icon: Palette, title: 'Brand Identity', desc: 'Comprehensive visual design systems, bespoke typography, and strategic positioning that create instant emotional resonance.', tag: 'Design' },
];

export default function Home() {
  return (
    <PageTransition>
      <div className={styles.homeContainer}>
        {/* ═══════════════════════ FULL-SCREEN 16:9 CYANOTYPE HERO SECTION ═══════════════════════ */}
        <section className={styles.hero}>
          <div className={styles.heroFullscreenWrap}>
            <img
              src="/images/cyanotype-fullscreen-hero.jpg"
              alt="Cyanotype Nautilus Shell Fullscreen Hero Artwork"
              className={styles.heroFullscreenImg}
              loading="eager"
            />
            <div className={styles.heroTopScrim} />
            <div className={styles.heroBottomFade} />
          </div>

          {/* 3D Flip Postcard Over Hero */}
          <div className={styles.heroPostcardOverlay}>
            <PostCard3D />
          </div>
        </section>

        {/* ═══════════════════════ SERVICES SHOWCASE ═══════════════════════ */}
        <section className={`section ${styles.servicesSection}`}>
          <div className="container">
            <div className="section-header">
              <span className="label">Capabilities &amp; Mastery</span>
              <h2>
                <CinematicText type="words">Services engineered for market dominance</CinematicText>
              </h2>
              <p>
                From strategic market penetration to high-conversion WebGL digital ecosystems, we provide full-funnel digital acceleration tailored for leaders.
              </p>
            </div>

            <div className={styles.servicesGrid}>
              {services.map((s, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className={styles.serviceCard} data-cursor="EXPLORE">
                    <div className={styles.serviceTop}>
                      <span className={styles.serviceTag}>{s.tag}</span>
                      <span className={styles.serviceNumber}>{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className={styles.serviceIcon}>
                      <s.icon size={26} strokeWidth={1.5} />
                    </div>
                    <h3 className={styles.serviceTitle}>{s.title}</h3>
                    <p className={styles.serviceDesc}>{s.desc}</p>
                    <Link to="/services" className={styles.serviceLink} data-hover>
                      <span>Discover Capability</span>
                      <ArrowRight size={14} />
                    </Link>
                    <div className={styles.serviceGlow} />
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className={styles.centerCta}>
              <Magnetic strength={0.3}>
                <Button to="/services" variant="outline" icon data-hover>
                  View Full Capabilities Matrix
                </Button>
              </Magnetic>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ EDITORIAL & BLOG DISPATCHES SECTION ═══════════════════════ */}
        <BlogSection />

        {/* ═══════════════════════ IMMERSIVE CTA BANNER ═══════════════════════ */}
        <section className={styles.ctaBanner}>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className={styles.ctaInner}>
              <span className="label" style={{ paddingLeft: 0, color: 'var(--angel-falls)' }}>Let's Build the Future</span>
              <h2 className={styles.ctaTitle}>
                <CinematicText type="words">Ready to outperform your industry?</CinematicText>
              </h2>
              <p className={styles.ctaDesc}>
                Let's discuss how Syrena's multidisciplinary team of designers, engineers, and growth strategists can propel your brand forward.
              </p>
              <div className={styles.ctaButtonRow}>
                <Magnetic strength={0.35}>
                  <Button to="/contact" variant="secondary" size="lg" icon magnetic data-hover>
                    Book Discovery Call
                  </Button>
                </Magnetic>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
