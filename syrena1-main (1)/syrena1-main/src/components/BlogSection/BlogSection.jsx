import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowUpRight, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Share2, 
  Check, 
  Mail, 
  X, 
  Bookmark, 
  TrendingUp,
  Layers,
  LayoutGrid
} from 'lucide-react';
import CinematicText from '../CinematicText/CinematicText';
import ScrollReveal from '../ScrollReveal/ScrollReveal';
import Magnetic from '../Magnetic/Magnetic';
import Button from '../Button/Button';
import styles from './BlogSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  'All Perspectives',
  'Digital Craft',
  'Brand Strategy',
  'Growth Systems',
  'Future Web',
];

const blogPosts = [
  {
    id: 'hyper-tactile-webgl',
    title: 'The Architecture of Seduction: Why Hyper-Tactile WebGL is Redefining Brand Authority',
    category: 'Digital Craft',
    date: 'August 28, 2026',
    readTime: '7 min read',
    issue: 'Issue Nº 14',
    author: {
      name: 'Elena Rostova',
      role: 'Chief Design Officer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    },
    image: '/images/siren-editorial.jpg',
    featured: true,
    badge: 'Featured Dispatch',
    excerpt: 'An empirical investigation into cognitive sensory feedback loops, and how modern digital flagships leverage WebGL shader pipelines to outconvert flat 2D interfaces by 340%.',
    highlights: ['340% Higher Dwell Time', '42% Lower Bounce Rate', 'High-Trust Enterprise Perception'],
    content: [
      'For over a decade, digital design succumbed to the monotony of flat, utilitarian interfaces. While functional, flat design stripped enterprise brands of their most vital asset: sensory intrigue and emotional resonance. Today, the pendulum is swinging aggressively back toward high-tactility digital experiences.',
      'By integrating real-time 60FPS WebGL pipelines, custom GLSL vertex shaders, and spring-physics micro-interactions, we are witnessing a renaissance where the browser ceases to be a static document and becomes an atmospheric architecture.',
      'When users touch, hover, and navigate through a fluid 3D space with harmonic cursor responsiveness, neurological retention spikes. Physicality in digital design is no longer a gimmick—it is the definitive benchmark of category leadership.'
    ]
  },
  {
    id: 'neo-cyanotype-renaissance',
    title: 'The Death of Bland Corporate Identity: The Neo-Cyanotype Renaissance',
    category: 'Brand Strategy',
    date: 'August 15, 2026',
    readTime: '5 min read',
    issue: 'Issue Nº 13',
    author: {
      name: 'Sofia Chen',
      role: 'Brand Director',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    },
    image: '/images/work-branding.jpg',
    featured: false,
    badge: 'Brand Strategy',
    excerpt: 'Why premier heritage and tech brands are abandoning homogenous sans-serif logos in favor of visceral, tactile art forms and physical cyanotype textures.',
    highlights: ['Organic Provocations', 'Artisanal Chemistry', 'Defensible Visual Moat'],
    content: [
      'In an era flooded by generic AI-generated vectors and sterile corporate minimalism, authenticity has become the scarcest commodity. Audiences are numb to cookie-cutter branding.',
      'The neo-cyanotype aesthetic marries historic 19th-century Prussian blue photographic chemistry with cutting-edge vector geometry. It conveys depth, craftsmanship, and a timeless provenance that cannot be replicated by automated templates.',
      'When brands incorporate physical textures and artisanal motifs into their digital design systems, they cultivate a sense of permanent cultural value.'
    ]
  },
  {
    id: 'organic-moats-growth',
    title: 'Deconstructing CAC: How Organic Moats Outlive Paid Acquisition',
    category: 'Growth Systems',
    date: 'August 02, 2026',
    readTime: '6 min read',
    issue: 'Issue Nº 12',
    author: {
      name: 'Marcus Vance',
      role: 'Head of Growth Strategy',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    featured: false,
    badge: 'Growth Systems',
    excerpt: 'Why compounding editorial ecosystems and semantic graph optimization yield 4x lifetime retention compared to traditional ad spend.',
    highlights: ['4x LTV Multiplier', 'Zero Marginal CAC', 'Semantic Authority Moat'],
    content: [
      'Customer acquisition costs on major ad platforms have risen by over 180% in the last 3 years alone. Relying solely on paid media is no longer a growth strategy—it is a tax on lack of differentiation.',
      'Modern market leaders construct semantic authority engines. By publishing deeply researched, high-conviction thought leadership, companies create perpetual organic inbound channels that compound in value year over year.',
      'The calculus is clear: paid acquisition rents attention; editorial excellence owns the audience permanently.'
    ]
  },
  {
    id: 'algorithmic-fluidity-webgl',
    title: 'Algorithmic Fluidity: Real-Time Shader Physics in Modern Browsers',
    category: 'Future Web',
    date: 'July 24, 2026',
    readTime: '8 min read',
    issue: 'Issue Nº 11',
    author: {
      name: 'Devon Thorne',
      role: 'Lead Creative Technologist',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    },
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    featured: false,
    badge: 'Future Web',
    excerpt: 'A deep dive into WebGPU compute pipelines, 60fps particle physics, and memory optimizations for mobile browsers.',
    highlights: ['Compute Shaders', 'Sub-16ms Frame Budgets', 'GPU Instancing'],
    content: [
      'Achieving silky-smooth 60fps animations with hundreds of thousands of dynamic particles requires rethinking the standard rendering loop.',
      'By offloading simulation logic directly to the GPU via compute shaders and leveraging WebGPU\'s low-overhead API, we can achieve cinematic visual fidelity with negligible CPU overhead and minimal battery drain.',
      'This article breaks down our custom oceanic simulation pipeline and sharing techniques for instanced mesh rendering.'
    ]
  },
  {
    id: 'tactile-micro-interactions',
    title: 'Tactile Micro-Interactions: The Science of Digital Haptics',
    category: 'Digital Craft',
    date: 'July 10, 2026',
    readTime: '4 min read',
    issue: 'Issue Nº 10',
    author: {
      name: 'Liam Kendrick',
      role: 'Lead Interaction Designer',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=80',
    },
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80',
    featured: false,
    badge: 'Digital Craft',
    excerpt: 'Exploring how cursor-coupled spring physics, acoustic feedback, and magnetic elements create an authentic luxury sensation.',
    highlights: ['Spring Physics', 'Acoustic Feedback', 'Magnetic Snapping'],
    content: [
      'Every click, scroll, and hover is a conversation between user and brand. When interactive elements respond with subtle spring physics and organic resistance, users subconsciously perceive the product as premium and reliable.',
      'We explore the mathematical models behind damped harmonic oscillators and how they can be applied to cursor tracking and UI component transitions.'
    ]
  }
];

export default function BlogSection() {
  const [activeCategory, setActiveCategory] = useState('All Perspectives');
  const [viewMode, setViewMode] = useState('stack'); // 'stack' (Skiper17 inspired) | 'grid'
  const [activeArticle, setActiveArticle] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Refs for GSAP Sticky Stack
  const stackContainerRef = useRef(null);
  const stackCardsRef = useRef([]);

  const filteredPosts = activeCategory === 'All Perspectives'
    ? blogPosts
    : blogPosts.filter((post) => post.category === activeCategory);

  const featuredPost = filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const gridPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);

  // ═══════ GSAP STICKY STACKED SCROLL (SKIPER 17 INSPIRATION) ═══════
  useEffect(() => {
    if (viewMode !== 'stack') return;
    const cards = stackCardsRef.current.filter(Boolean);
    const totalCards = cards.length;
    if (totalCards <= 1) return;

    const ctx = gsap.context(() => {
      // Set initial card states
      gsap.set(cards[0], { y: '0%', scale: 1, rotation: 0, opacity: 1 });
      for (let i = 1; i < totalCards; i++) {
        gsap.set(cards[i], { y: '115%', scale: 1, rotation: 0, opacity: 1 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stackContainerRef.current,
          start: 'top 12%',
          end: `+=${Math.max(1, totalCards - 1) * 650}`,
          pin: true,
          scrub: 0.6,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cards[i];
        const nextCard = cards[i + 1];
        const position = i;
        if (!currentCard || !nextCard) continue;

        // Alternate subtle angles for natural magazine deck effect
        const angle = i % 2 === 0 ? -2.8 : 2.8;

        scrollTimeline.to(
          currentCard,
          {
            scale: 0.92 - i * 0.025,
            rotation: angle,
            filter: 'brightness(0.65)',
            duration: 1,
            ease: 'none',
          },
          position
        );

        scrollTimeline.to(
          nextCard,
          {
            y: '0%',
            duration: 1,
            ease: 'none',
          },
          position
        );
      }
    }, stackContainerRef);

    return () => {
      ctx.revert();
    };
  }, [viewMode, filteredPosts]);

  const toggleBookmark = (e, id) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleShare = (e, post) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <section className={styles.blogSection}>
      {/* Ambient background glows */}
      <div className={styles.ambientGlowPrimary} />
      <div className={styles.ambientGlowSecondary} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* ═════════ SECTION HEADER ═════════ */}
        <div className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.labelBadge}>
              <span className={styles.labelDot} />
              <span className={styles.labelText}>The Syrena Journal • Thought Leadership</span>
            </div>
            <h2 className={styles.sectionHeading}>
              <CinematicText type="words">Perspectives &amp; Strategic Dispatches</CinematicText>
            </h2>
            <p className={styles.sectionSubtext}>
              Curated essays, technical post-mortems, and market analysis exploring the intersection of spatial web design, brand authority, and digital craftsmanship.
            </p>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.journalStats}>
              <div className={styles.journalStatItem}>
                <span className={styles.journalStatNum}>14</span>
                <span className={styles.journalStatLabel}>Published Dispatches</span>
              </div>
              <div className={styles.journalStatDivider} />
              <div className={styles.journalStatItem}>
                <span className={styles.journalStatNum}>18k+</span>
                <span className={styles.journalStatLabel}>Monthly Readers</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════ CATEGORY PILL FILTER & VIEW TOGGLE ═════════ */}
        <div className={styles.filterBar}>
          <div className={styles.filterPills}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.activeFilterBtn : ''}`}
                data-hover
              >
                {activeCategory === cat && <Sparkles size={13} className={styles.filterIcon} />}
                <span>{cat}</span>
              </button>
            ))}
          </div>

          <div className={styles.filterRightWrap}>
            <div className={styles.filterCount}>
              Showing <strong>{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'article' : 'articles'}
            </div>

            {/* View Mode Toggle: Stacked Deck vs Editorial Grid */}
            <div className={styles.viewModeToggle}>
              <button
                type="button"
                onClick={() => setViewMode('stack')}
                className={`${styles.viewBtn} ${viewMode === 'stack' ? styles.activeViewBtn : ''}`}
                title="Sticky Stacked Deck (Scroll driven)"
                data-hover
              >
                <Layers size={14} />
                <span>Stacked Deck</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.activeViewBtn : ''}`}
                title="Editorial Grid View"
                data-hover
              >
                <LayoutGrid size={14} />
                <span>Grid View</span>
              </button>
            </div>
          </div>
        </div>

        {/* ═════════ VIEW MODE: STICKY CARD STACK (SKIPER 17 INSPIRATION) ═════════ */}
        {viewMode === 'stack' ? (
          <div ref={stackContainerRef} className={styles.stackSection}>
            {/* Stack HUD info bar */}
            <div className={styles.stackHud}>
              <div className={styles.stackHint}>
                <span className={styles.stackPulseDot} />
                <span>Scroll down to flip through {filteredPosts.length} strategic dispatches</span>
              </div>
              <div className={styles.stackCounter}>
                <span>DISPATCH DECK • {filteredPosts.length} ISSUES</span>
              </div>
            </div>

            {/* Pinned Stack Stage */}
            <div className={styles.stackStage}>
              {filteredPosts.map((post, i) => (
                <article
                  key={post.id}
                  ref={(el) => (stackCardsRef.current[i] = el)}
                  className={styles.stackedCard}
                  style={{ zIndex: i + 1 }}
                  onClick={() => setActiveArticle(post)}
                  data-cursor="READ"
                >
                  {/* Card Media Column */}
                  <div className={styles.stackedImageCol}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className={styles.stackedImg}
                      loading="lazy"
                    />
                    <div className={styles.stackedImgOverlay} />
                    <div className={styles.stackedBadgeRow}>
                      <span className={styles.stackedIssueBadge}>{post.issue}</span>
                      <span className={styles.stackedCategoryBadge}>{post.category}</span>
                    </div>
                    <div className={styles.stackedHighlights}>
                      {post.highlights.map((h, hi) => (
                        <span key={hi} className={styles.stackedHighlightPill}>
                          <TrendingUp size={11} /> {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Editorial Body Column */}
                  <div className={styles.stackedBodyCol}>
                    <div className={styles.stackedMetaTop}>
                      <div className={styles.readingTime}>
                        <Clock size={13} />
                        <span>{post.readTime}</span>
                      </div>
                      <span className={styles.metaDot}>•</span>
                      <span className={styles.stackedDate}>{post.date}</span>
                      <span className={styles.stackedDeckNum}>№ 0{i + 1}</span>
                    </div>

                    <h3 className={styles.stackedTitle}>{post.title}</h3>
                    <p className={styles.stackedExcerpt}>{post.excerpt}</p>

                    <div className={styles.stackedFooter}>
                      <div className={styles.authorInfo}>
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className={styles.authorAvatar}
                        />
                        <div>
                          <div className={styles.authorName}>{post.author.name}</div>
                          <div className={styles.authorRole}>{post.author.role}</div>
                        </div>
                      </div>

                      <div className={styles.stackedActions}>
                        <button
                          type="button"
                          className={`${styles.actionIconButton} ${bookmarkedIds.includes(post.id) ? styles.activeBookmark : ''}`}
                          onClick={(e) => toggleBookmark(e, post.id)}
                          title="Save article"
                          data-hover
                        >
                          <Bookmark size={15} fill={bookmarkedIds.includes(post.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionIconButton}
                          onClick={(e) => handleShare(e, post)}
                          title="Share link"
                          data-hover
                        >
                          {copiedId === post.id ? <Check size={15} color="var(--accent-cyan)" /> : <Share2 size={15} />}
                        </button>
                        <Magnetic strength={0.25}>
                          <div className={styles.readDispatchBtn} data-hover>
                            <span>Read Dispatch</span>
                            <ArrowUpRight size={17} />
                          </div>
                        </Magnetic>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          /* ═════════ VIEW MODE: EDITORIAL HERO & GRID ═════════ */
          <>
            {/* FEATURED EDITORIAL HERO CARD */}
            {featuredPost && (
              <ScrollReveal delay={0.05}>
                <div 
                  className={styles.featuredHeroCard} 
                  onClick={() => setActiveArticle(featuredPost)}
                  data-cursor="READ"
                >
                  <div className={styles.featuredImageWrap}>
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className={styles.featuredImg}
                      loading="lazy"
                    />
                    <div className={styles.featuredImageOverlay} />
                    
                    <div className={styles.featuredBadgeRow}>
                      <span className={styles.featuredIssueBadge}>{featuredPost.issue}</span>
                      <span className={styles.featuredCategoryBadge}>{featuredPost.category}</span>
                    </div>

                    <div className={styles.featuredFloatingHighlights}>
                      {featuredPost.highlights.map((h, i) => (
                        <span key={i} className={styles.highlightPill}>
                          <TrendingUp size={12} /> {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.featuredContent}>
                    <div className={styles.featuredMetaTop}>
                      <div className={styles.readingTime}>
                        <Clock size={14} />
                        <span>{featuredPost.readTime}</span>
                      </div>
                      <span className={styles.metaDot}>•</span>
                      <span className={styles.featuredDate}>{featuredPost.date}</span>
                    </div>

                    <h3 className={styles.featuredTitle}>{featuredPost.title}</h3>
                    
                    <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>

                    <div className={styles.featuredBottomRow}>
                      <div className={styles.authorInfo}>
                        <img
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          className={styles.authorAvatar}
                        />
                        <div>
                          <div className={styles.authorName}>{featuredPost.author.name}</div>
                          <div className={styles.authorRole}>{featuredPost.author.role}</div>
                        </div>
                      </div>

                      <div className={styles.featuredActionButtons}>
                        <button
                          type="button"
                          className={`${styles.actionIconButton} ${bookmarkedIds.includes(featuredPost.id) ? styles.activeBookmark : ''}`}
                          onClick={(e) => toggleBookmark(e, featuredPost.id)}
                          title="Save article"
                          data-hover
                        >
                          <Bookmark size={16} fill={bookmarkedIds.includes(featuredPost.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionIconButton}
                          onClick={(e) => handleShare(e, featuredPost)}
                          title="Share link"
                          data-hover
                        >
                          {copiedId === featuredPost.id ? <Check size={16} color="var(--accent-cyan)" /> : <Share2 size={16} />}
                        </button>
                        <Magnetic strength={0.25}>
                          <div className={styles.readDispatchBtn} data-hover>
                            <span>Read Dispatch</span>
                            <ArrowUpRight size={18} />
                          </div>
                        </Magnetic>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* EDITORIAL GRID */}
            {gridPosts.length > 0 && (
              <div className={styles.blogGrid}>
                {gridPosts.map((post, index) => (
                  <ScrollReveal key={post.id} delay={0.1 + index * 0.08}>
                    <article 
                      className={styles.blogCard} 
                      onClick={() => setActiveArticle(post)}
                      data-cursor="READ"
                    >
                      <div className={styles.cardImageContainer}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className={styles.cardImage}
                          loading="lazy"
                        />
                        <div className={styles.cardImageScrim} />
                        <div className={styles.cardBadgeTag}>{post.category}</div>
                        <div className={styles.cardReadTime}>
                          <Clock size={12} />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <div className={styles.cardBody}>
                        <div className={styles.cardDate}>{post.date}</div>
                        <h4 className={styles.cardTitle}>{post.title}</h4>
                        <p className={styles.cardExcerpt}>{post.excerpt}</p>

                        <div className={styles.cardFooter}>
                          <div className={styles.cardAuthor}>
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className={styles.cardAuthorImg}
                            />
                            <span className={styles.cardAuthorName}>{post.author.name}</span>
                          </div>

                          <div className={styles.cardActions}>
                            <button
                              type="button"
                              className={`${styles.cardMiniBtn} ${bookmarkedIds.includes(post.id) ? styles.activeBookmark : ''}`}
                              onClick={(e) => toggleBookmark(e, post.id)}
                              title="Bookmark"
                              data-hover
                            >
                              <Bookmark size={14} fill={bookmarkedIds.includes(post.id) ? 'currentColor' : 'none'} />
                            </button>
                            <div className={styles.cardArrowCircle}>
                              <ArrowUpRight size={16} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </>
        )}

        {/* ═════════ NEWSLETTER / PRIVATE DISPATCH SUBSCRIPTION ═════════ */}
        <ScrollReveal delay={0.2}>
          <div className={styles.newsletterCard}>
            <div className={styles.newsletterContent}>
              <div className={styles.newsletterBadge}>
                <Sparkles size={14} />
                <span>The Syrena Gazette • Monthly In-Depth Issue</span>
              </div>
              <h3 className={styles.newsletterTitle}>Stay at the Vanguard of Digital Craft</h3>
              <p className={styles.newsletterDesc}>
                Join 18,000+ creative directors, technical founders, and design leads receiving our private monthly teardowns on WebGL, brand moats, and conversion engineering.
              </p>
            </div>

            <div className={styles.newsletterFormWrapper}>
              {subscribed ? (
                <div className={styles.subscribedState}>
                  <div className={styles.successIconWrap}>
                    <Check size={20} />
                  </div>
                  <div>
                    <h4 className={styles.successTitle}>You're on the list</h4>
                    <p className={styles.successDesc}>Check your inbox for the latest confidential issue.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
                  <div className={styles.inputGroup}>
                    <Mail size={18} className={styles.inputIcon} />
                    <input
                      type="email"
                      required
                      placeholder="Enter your executive email..."
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className={styles.emailInput}
                    />
                  </div>
                  <Magnetic strength={0.3}>
                    <button type="submit" className={styles.subscribeBtn} data-hover>
                      <span>Join Dispatch</span>
                      <ArrowRight size={16} />
                    </button>
                  </Magnetic>
                </form>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ═════════ ARTICLE READER MODAL ═════════ */}
      {activeArticle && (
        <div className={styles.modalBackdrop} onClick={() => setActiveArticle(null)}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalMeta}>
                <span className={styles.modalBadge}>{activeArticle.category}</span>
                <span className={styles.modalDot}>•</span>
                <span>{activeArticle.readTime}</span>
                <span className={styles.modalDot}>•</span>
                <span>{activeArticle.date}</span>
              </div>
              <button 
                type="button" 
                className={styles.closeBtn} 
                onClick={() => setActiveArticle(null)}
                aria-label="Close article"
                data-hover
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalHeroMedia}>
              <img src={activeArticle.image} alt={activeArticle.title} className={styles.modalHeroImg} />
              <div className={styles.modalMediaScrim} />
            </div>

            <div className={styles.modalBody}>
              <h2 className={styles.modalTitle}>{activeArticle.title}</h2>

              <div className={styles.modalAuthorRow}>
                <img
                  src={activeArticle.author.avatar}
                  alt={activeArticle.author.name}
                  className={styles.modalAuthorAvatar}
                />
                <div>
                  <div className={styles.modalAuthorName}>{activeArticle.author.name}</div>
                  <div className={styles.modalAuthorRole}>{activeArticle.author.role}</div>
                </div>
              </div>

              <div className={styles.modalExcerptBox}>
                <p>{activeArticle.excerpt}</p>
              </div>

              <div className={styles.modalArticleText}>
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx} className={styles.articleParagraph}>{paragraph}</p>
                ))}
              </div>

              <div className={styles.modalHighlights}>
                <h4 className={styles.highlightsHeader}>Strategic Takeaways</h4>
                <div className={styles.highlightsGrid}>
                  {activeArticle.highlights.map((item, idx) => (
                    <div key={idx} className={styles.highlightItem}>
                      <Sparkles size={16} className={styles.highlightIcon} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <div className={styles.modalShareRow}>
                  <span>Share this dispatch:</span>
                  <button
                    type="button"
                    className={styles.sharePill}
                    onClick={(e) => handleShare(e, activeArticle)}
                    data-hover
                  >
                    {copiedId === activeArticle.id ? (
                      <>
                        <Check size={14} color="var(--accent-cyan)" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={14} />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
                <Button variant="secondary" size="md" onClick={() => setActiveArticle(null)} data-hover>
                  Close Dispatch
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
