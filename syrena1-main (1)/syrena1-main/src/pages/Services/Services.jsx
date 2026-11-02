import { Search, BarChart3, Share2, Pen, Monitor, Palette, ArrowRight, CheckCircle2, Zap, Award } from 'lucide-react';
import PageTransition from '../../components/PageTransition/PageTransition';
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal';
import CinematicText from '../../components/CinematicText/CinematicText';
import Button from '../../components/Button/Button';
import SeaObjectMorphCard from '../../components/SeaObjectMorphCard/SeaObjectMorphCard';
import Magnetic from '../../components/Magnetic/Magnetic';
import OceanWorld from '../../components/OceanWorld/OceanWorld';
import styles from './Services.module.css';

const services = [
  {
    icon: Search,
    title: 'Search Engine Optimization',
    description: 'Dominate organic search with technical architecture optimization, AI semantic search indexing, and high-authority content clustering that turns search into your largest acquisition channel.',
    deliverables: ['Technical SEO Auditing', 'Semantic Keyword Strategy', 'Authority Link Building', 'Schema & Core Web Vitals'],
    metric: '+180% Avg Organic Lift',
    trigger: '/images/sea-triggers/scallop.webp',
    triggerLabel: 'scallop shell',
    triggerSize: 0.56,
    triggerLift: 8,
    triggerRotation: -0.05,
    triggerAspect: 1262 / 1188,
    triggerHitWidth: 56,
    triggerHitHeight: 50,
  },
  {
    icon: BarChart3,
    title: 'Performance & Paid Media',
    description: 'Precision-engineered programmatic campaigns across Google Ads, Meta, LinkedIn, and TikTok. Continuous creative multivariate testing and algorithmic bidding designed to scale profitably.',
    deliverables: ['Predictive CAC Modeling', 'High-Converting Ad Creatives', 'Cross-Platform Retargeting', 'Real-Time ROAS Dashboards'],
    metric: '3.8x Blended ROAS',
    trigger: '/images/sea-triggers/conch.webp',
    triggerLabel: 'conch shell',
    triggerSize: 0.54,
    triggerLift: 12,
    triggerRotation: -0.16,
    triggerAspect: 1162 / 1207,
    triggerHitWidth: 62,
    triggerHitHeight: 50,
  },
  {
    icon: Share2,
    title: 'Social Ecosystems & Viral Growth',
    description: 'Build passionate digital subcultures around your brand. We combine high-retention short-form video, thought-leader positioning, and strategic influencer partnerships.',
    deliverables: ['Editorial Content Production', 'Influencer Management', 'Community Moderation', 'Viral Video Frameworks'],
    metric: '4.2M Monthly Impressions',
    trigger: '/images/sea-triggers/coral.webp',
    triggerLabel: 'coral branch',
    triggerSize: 0.48,
    triggerLift: 6,
    triggerRotation: 0.03,
    triggerAspect: 1288 / 1207,
    triggerHitWidth: 62,
    triggerHitHeight: 54,
  },
  {
    icon: Pen,
    title: 'Editorial & Content Architecture',
    description: 'High-impact storytelling and industry-defining whitepapers that establish intellectual monopoly. Turn passive browsers into convinced enterprise buyers.',
    deliverables: ['Thought Leadership Essays', 'Conversion Copywriting', 'Video Scripts & Storyboards', 'Newsletter Infrastructure'],
    metric: '+85% Lead Capture Rate',
    trigger: '/images/sea-triggers/seastar.webp',
    triggerLabel: 'sea star',
    triggerSize: 0.54,
    triggerLift: 2,
    triggerRotation: 0.03,
    triggerAspect: 1299 / 1207,
    triggerHitWidth: 62,
    triggerHitHeight: 54,
  },
  {
    icon: Monitor,
    title: 'WebGL & Creative Web Development',
    description: 'Awwwards-caliber digital flagships engineered with React, Three.js, GSAP, and headless CMS architecture. Hyper-responsive 60fps performance built to convert.',
    deliverables: ['Custom 3D WebGL Interactions', 'Headless Shopify & Next.js', 'Sub-second Page Speeds', 'WCAG 2.1 AAA Accessibility'],
    metric: '99/100 Lighthouse Score',
    trigger: '/images/sea-triggers/jellyfish.webp',
    triggerLabel: 'jellyfish',
    triggerSize: 0.46,
    triggerLift: 12,
    triggerRotation: -0.02,
    triggerAspect: 879 / 1505,
    triggerHitWidth: 48,
    triggerHitHeight: 66,
  },
  {
    icon: Palette,
    title: 'Brand Identity & Design Systems',
    description: 'Visual identity systems engineered for the digital age. Bespoke typography, motion language, and design token libraries that give your brand unmistakable prestige.',
    deliverables: ['Visual Brand Guidelines', 'Bespoke Motion Systems', 'Design Tokens & UI Kits', 'Packaging & 3D Renders'],
    metric: '100% Trademark Clearance',
    trigger: '/images/sea-triggers/cowrie.webp',
    triggerLabel: 'cowrie shell',
    triggerSize: 0.54,
    triggerLift: 8,
    triggerRotation: -0.1,
    triggerAspect: 1158 / 1166,
    triggerHitWidth: 62,
    triggerHitHeight: 52,
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Strategic Audit & Discovery',
    desc: 'Deep immersion into your unit economics, competitive landscape, historical conversion data, and high-intent buyer personas.',
  },
  {
    number: '02',
    title: 'Roadmap & Architecture',
    desc: 'Formulating a unified cross-channel strategy with aggressive KPIs, sprint timelines, attribution infrastructure, and creative briefs.',
  },
  {
    number: '03',
    title: 'Rapid Deployment & Velocity',
    desc: 'Cross-functional execution across design, development, media buying, and content publishing with daily performance checks.',
  },
  {
    number: '04',
    title: 'Compound Optimization',
    desc: 'Continuous multivariate experimentation, conversion rate optimization, and budget reallocation to scale winner channels.',
  },
];

export default function Services() {
  return (
    <PageTransition>
      {/* ─── PAGE HEADER ─── */}
      <section className={`section section--dark ${styles.pageHeader}`}>
        <div className={styles.headerGlow1} />
        <div className={styles.headerGlow2} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className={styles.headerInner}>
            <span className="label">Capabilities &amp; Solutions</span>
            <h1 className={styles.pageTitle}>
              <CinematicText type="words" delay={0.1} triggerOnScroll={false}>
                End-to-end digital
              </CinematicText>
              <br />
              <span className={styles.titleHighlight}>
                <CinematicText type="words" delay={0.25} triggerOnScroll={false}>
                  acceleration systems.
                </CinematicText>
              </span>
            </h1>
            <p className={styles.pageDesc}>
              We eliminate disjointed vendors by delivering fully unified strategy, cinematic creative, and algorithmic performance engineering under one roof.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SERVICE CARDS — ONE shared ocean world ─── */}
      <section className={`section ${styles.oceanSection}`} data-ocean-section>
        {/* ONE unified ocean/paper diorama behind all 6 cards */}
        <OceanWorld />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className={styles.serviceGrid}>
            {services.map((service, index) => (
              <div
                key={service.title}
                className={styles.postcardGridItem}
              >
                <SeaObjectMorphCard
                  videoSrc={`/videos/services/s${index + 1}.mp4`}
                  objectSrc={service.trigger}
                  objectLabel={service.triggerLabel}
                  objectSize={service.triggerSize}
                  objectLift={service.triggerLift}
                  objectRotation={service.triggerRotation}
                  objectAspect={service.triggerAspect}
                  hitWidth={service.triggerHitWidth}
                  hitHeight={service.triggerHitHeight}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto var(--space-2xl)' }}>
            <span className="label" style={{ paddingLeft: 0 }}>Methodology</span>
            <h2>
              <CinematicText type="words">The four-phase acceleration framework</CinematicText>
            </h2>
            <p style={{ margin: '0 auto' }}>
              A disciplined sprint cycle ensuring precision execution, predictable outcomes, and compounding returns.
            </p>
          </div>

          <div className={styles.processGrid}>
            {processSteps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.12}>
                <div className={styles.processCard} data-cursor="PHASE">
                  <span className={styles.processNumber}>{step.number}</span>
                  <h3 className={styles.processTitle}>{step.title}</h3>
                  <p className={styles.processDesc}>{step.desc}</p>
                  {i < processSteps.length - 1 && (
                    <div className={styles.processArrow}>
                      <ArrowRight size={20} />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={`section ${styles.ctaBanner}`}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className={styles.ctaInner}>
            <span className="label" style={{ paddingLeft: 0, color: 'var(--frost)' }}>Initiate Growth</span>
            <h2>
              <CinematicText type="words">Not sure where to begin?</CinematicText>
            </h2>
            <p>
              Book an initial 30-minute diagnostic session with our strategy leads. We'll audit your current unit economics and provide actionable growth vectors.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Magnetic strength={0.35}>
                <Button to="/contact" variant="secondary" size="lg" icon magnetic data-hover>
                  Schedule Diagnostic Call
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
