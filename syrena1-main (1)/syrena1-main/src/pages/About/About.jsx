import { Target, Heart, Lightbulb, Users, Compass, Zap, ShieldCheck } from 'lucide-react';
import PageTransition from '../../components/PageTransition/PageTransition';
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal';
import CinematicText from '../../components/CinematicText/CinematicText';
import Button from '../../components/Button/Button';
import Magnetic from '../../components/Magnetic/Magnetic';
import Counter from '../../components/Counter/Counter';
import TeamCard from '../../components/TeamCard/TeamCard';
import ParallaxImage from '../../components/Parallax/ParallaxImage';
import ParallaxElement from '../../components/Parallax/ParallaxElement';
import styles from './About.module.css';

const values = [
  {
    icon: Target,
    title: 'Results-First Mandate',
    desc: 'Every strategy is anchored in measurable revenue acceleration. We ignore vanity metrics in relentless pursuit of high-leverage commercial impact.',
  },
  {
    icon: Heart,
    title: 'Embedded Partnership',
    desc: 'We operate as an agile high-level extension of your executive and marketing teams, rather than a disconnected external agency.',
  },
  {
    icon: Lightbulb,
    title: 'Creative Intelligence',
    desc: 'Data informs our strategic hypothesis, cinematic craft commands attention. True digital resonance exists solely at their intersection.',
  },
  {
    icon: ShieldCheck,
    title: 'Radical Transparency',
    desc: 'Zero black boxes. Real-time dashboards, honest unit economics, clear attribution models, and collaborative governance.',
  },
];

const milestones = [
  { year: '2014', title: 'Studio Inception', desc: 'Founded in NYC as a boutique digital strategy lab.' },
  { year: '2018', title: 'Global Expansion', desc: 'Established European operations in London, scaling international client base.' },
  { year: '2022', title: 'AI & WebGL Lab', desc: 'Integrated proprietary predictive performance intelligence & real-time 3D web engines.' },
  { year: '2026', title: 'Industry Standard', desc: 'Over $120M in client revenue generated with 150+ international awards & deployments.' },
];

const team = [
  {
    name: 'Elena Vasquez',
    role: 'Founder & Managing Partner',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Marcus Chen',
    role: 'Head of Strategy & Growth',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Amara Johnson',
    role: 'Executive Creative Director',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'David Park',
    role: 'Technical Systems Architect',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    linkedin: '#',
    twitter: '#',
  },
];

export default function About() {
  return (
    <PageTransition>
      {/* ─── PAGE HERO ─── */}
      <section className={`section section--dark ${styles.pageHeader}`}>
        <div className={styles.headerGlow1} />
        <div className={styles.headerGlow2} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className={styles.headerInner}>
            <span className="label">About Syrena Studio</span>
            <h1 className={styles.pageTitle}>
              <CinematicText type="words" delay={0.1} triggerOnScroll={false}>
                Built on strategy.
              </CinematicText>
              <br />
              <span className={styles.titleHighlight}>
                <CinematicText type="words" delay={0.25} triggerOnScroll={false}>
                  Engineered for impact.
                </CinematicText>
              </span>
            </h1>
            <p className={styles.pageDesc}>
              We are a multidisciplinary digital powerhouse of growth strategists, creative technologists, and brand architects turning ambition into exponential market presence.
            </p>
          </div>
        </div>
      </section>

      {/* ─── OUR STORY ─── */}
      <section className="section">
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyImageCol}>
              <ParallaxImage
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80"
                alt="Syrena team collaborating"
                speed={0.2}
                scale={1.2}
                className={styles.storyImage}
              />
              <div className={styles.storyFloatBadge}>
                <span className={styles.badgeNumber}>12+</span>
                <span className={styles.badgeText}>Years of Mastery</span>
              </div>
            </div>

            <div className={styles.storyContent}>
              <span className="label">Our Origin &amp; Philosophy</span>
              <h2>
                <CinematicText type="words">From boutique studio to global growth partner</CinematicText>
              </h2>
              <div className="divider" />
              <p>
                Syrena was born out of a stark realization: the traditional agency model is broken. Brands were receiving bloated decks, vanity metrics, and disjointed creative that failed to translate into commercial momentum.
              </p>
              <p>
                We established Syrena to be different. We combined data-driven media economics with world-class design craft to build digital ecosystems that don't just win accolades—they dominate categories.
              </p>
              <div style={{ marginTop: '2rem' }}>
                <Magnetic strength={0.3}>
                  <Button to="/services" variant="primary" icon data-hover>
                    Explore Our Capabilities
                  </Button>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MILESTONES TIMELINE ─── */}
      <section className={`section ${styles.timelineSection}`}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto var(--space-2xl)' }}>
            <span className="label" style={{ paddingLeft: 0 }}>Evolution</span>
            <h2>
              <CinematicText type="words">A decade of continuous innovation</CinematicText>
            </h2>
          </div>

          <div className={styles.milestonesGrid}>
            {milestones.map((m, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <div className={styles.milestoneCard} data-cursor="MILESTONE">
                  <div className={styles.milestoneYear}>{m.year}</div>
                  <h3 className={styles.milestoneTitle}>{m.title}</h3>
                  <p className={styles.milestoneDesc}>{m.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CORE VALUES ─── */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto var(--space-2xl)' }}>
            <span className="label" style={{ paddingLeft: 0 }}>Our Code</span>
            <h2>
              <CinematicText type="words">Principles that govern our craft</CinematicText>
            </h2>
            <p style={{ margin: '0 auto' }}>
              These fundamental tenets guide every campaign architecture, design sprint, and engineering deployment.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {values.map((v, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className={styles.valueCard} data-cursor="VALUE">
                  <div className={styles.valueIcon}>
                    <v.icon size={26} strokeWidth={1.5} />
                  </div>
                  <h3 className={styles.valueTitle}>{v.title}</h3>
                  <p className={styles.valueDesc}>{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className={`section section--gradient ${styles.statsSection}`}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className={styles.statsGrid}>
            <Counter end={150} suffix="+" label="Delivered Deployments" />
            <Counter end={48} label="Active Enterprise Partners" />
            <Counter end={12} suffix=" Yrs" label="Market Leadership" />
            <Counter end={28} label="Cross-Disciplinary Specialists" />
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto var(--space-2xl)' }}>
            <span className="label" style={{ paddingLeft: 0 }}>Leadership</span>
            <h2>
              <CinematicText type="words">The minds shaping our direction</CinematicText>
            </h2>
            <p style={{ margin: '0 auto' }}>
              A collective of seasoned operators, award-winning art directors, and full-stack growth engineers.
            </p>
          </div>

          <div className={styles.teamGrid}>
            {team.map((member, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <TeamCard {...member} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={`section ${styles.ctaBanner}`}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className={styles.ctaInner}>
            <span className="label" style={{ paddingLeft: 0, color: 'var(--frost)' }}>Join Our Collective</span>
            <h2>
              <CinematicText type="words">Ready to build something extraordinary?</CinematicText>
            </h2>
            <p>
              We're always seeking visionary partners and exceptional talent to push digital frontiers together.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Magnetic strength={0.35}>
                <Button to="/contact" variant="secondary" size="lg" icon magnetic data-hover>
                  Initiate Conversation
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
