import { useState } from 'react';
import PageTransition from '../../components/PageTransition/PageTransition';
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal';
import CinematicText from '../../components/CinematicText/CinematicText';
import Button from '../../components/Button/Button';
import Magnetic from '../../components/Magnetic/Magnetic';
import WorkCard from '../../components/WorkCard/WorkCard';
import styles from './Work.module.css';

const categories = ['All', 'Branding', 'Web Development', 'Digital Marketing', 'Social Media'];

const projects = [
  {
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80',
    title: 'Vertex Enterprise Rebrand',
    category: 'Branding',
    description: 'Complete visual identity architecture, design token system, and multi-market digital strategy for a $400M SaaS leader.',
    stats: '+210% Pipeline Velocity',
  },
  {
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&q=80',
    title: 'Ember E-Commerce Flagship',
    category: 'Web Development',
    description: 'Headless high-converting Shopify storefront with bespoke 3D WebGL product customizer and automated SEO infrastructure.',
    stats: '+240% Conversion Lift',
  },
  {
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=80',
    title: 'Lumen Health Acquisition Engine',
    category: 'Digital Marketing',
    description: 'Data-driven paid advertising engine across Google & Meta delivering massive scalability in qualified patient acquisition.',
    stats: '340% ROAS Increase',
  },
  {
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1000&q=80',
    title: 'Cascade Audio Brand Ecosystem',
    category: 'Social Media',
    description: 'Full-funnel social content engine, influencer partnerships, and TikTok campaign generating 25M viral impressions.',
    stats: '+380% Engagement Growth',
  },
  {
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1000&q=80',
    title: 'Meridian Global Platform',
    category: 'Web Development',
    description: 'Performance-engineered corporate digital flagship with sub-second page loads and seamless Salesforce lead integration.',
    stats: '+165% Enterprise Inbound',
  },
  {
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1000&q=80',
    title: 'Prism Labs Biotech Identity',
    category: 'Branding',
    description: 'Strategic market positioning and avant-garde visual system for a high-profile genetics venture launch.',
    stats: '$35M Series A Raised',
  },
  {
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=80',
    title: 'Atlas Group Performance Engine',
    category: 'Digital Marketing',
    description: 'Enterprise search marketing and programmatic retargeting capturing high-intent B2B institutional demand.',
    stats: '$4.2M Attributed Pipeline',
  },
  {
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=1000&q=80',
    title: 'Forge Media Creative Narrative',
    category: 'Social Media',
    description: 'Strategic LinkedIn executive thought leadership series and podcast distribution network.',
    stats: '12K MQLs in Q1',
  },
];

export default function Work() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <PageTransition>
      {/* ─── PAGE HEADER ─── */}
      <section className={`section section--dark ${styles.pageHeader}`}>
        <div className={styles.headerGlow1} />
        <div className={styles.headerGlow2} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className={styles.headerInner}>
            <span className="label">Portfolio Showcase</span>
            <h1 className={styles.pageTitle}>
              <CinematicText type="words" delay={0.1} triggerOnScroll={false}>
                Selected works &amp;
              </CinematicText>
              <br />
              <span className={styles.titleHighlight}>
                <CinematicText type="words" delay={0.25} triggerOnScroll={false}>
                  case studies.
                </CinematicText>
              </span>
            </h1>
            <p className={styles.pageDesc}>
              Explore our curation of award-winning digital transformations, bespoke engineering builds, and category-defining brand identities.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FILTER + GRID ─── */}
      <section className="section">
        <div className="container">
          <div className={styles.filterBar}>
            {categories.map((cat) => (
              <Magnetic key={cat} strength={0.2}>
                <button
                  className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  data-hover
                >
                  {cat}
                </button>
              </Magnetic>
            ))}
          </div>

          <div className={styles.projectGrid}>
            {filteredProjects.map((project, i) => (
              <ScrollReveal key={project.title} delay={i * 0.08}>
                <WorkCard {...project} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={`section ${styles.ctaBanner}`}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className={styles.ctaInner}>
            <span className="label" style={{ paddingLeft: 0, color: 'var(--frost)' }}>Start Your Project</span>
            <h2>
              <CinematicText type="words">Ready to create your success story?</CinematicText>
            </h2>
            <p>
              Let's partner together to build a digital experience that sets a new benchmark in your vertical.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Magnetic strength={0.35}>
                <Button to="/contact" variant="secondary" size="lg" icon magnetic data-hover>
                  Book Scoping Session
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
