import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  X, 
  Check, 
  Share2,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import InteractiveBook from '../ui/interactive-book';
import styles from './CodexSection.module.css';


import { DEFAULT_DISPATCHES } from '../../data/legacyDispatches';

export default function CodexSection() {
  const [dispatches] = useState(() => {
    try {
      const saved = localStorage.getItem('syrena_codex_blogs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_DISPATCHES;
  });

  const [activeReadingArticle, setActiveReadingArticle] = useState(null);
  const [bookKey] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Persist dispatches to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('syrena_codex_blogs', JSON.stringify(dispatches));
    } catch {
      // Silent error
    }
  }, [dispatches]);

  const toggleBookmark = (id) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleShare = (post) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Convert dispatches into Book Pages for InteractiveBook
  const bookPages = dispatches.map((post, index) => {
    return {
      pageNumber: index + 1,
      title: post.title,
      // Front face of page (Right side of open spread)
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className={styles.dispatchCoverHeader}>
            <span className={styles.dispatchBadge}>{post.category}</span>
            <span className={styles.dispatchIssue}>{post.issue}</span>
          </div>

          <p className="page-body-text" style={{ fontStyle: 'normal', color: 'var(--ice)' }}>
            {post.excerpt}
          </p>

          {post.quote && (
            <div className="page-quote-box">
              "{post.quote}"
            </div>
          )}

          <div className={styles.authorSignature}>
            <img src={post.author.avatar} alt={post.author.name} className={styles.authorImg} />
            <div className={styles.authorText}>
              <span className={styles.authorName}>{post.author.name}</span>
              <span className={styles.authorRole}>{post.author.role}</span>
            </div>
          </div>

          <div className={styles.highlightsList}>
            {post.highlights.map((h, hi) => (
              <span key={hi} className={styles.highlightPill}>
                <Sparkles size={9} style={{ color: 'var(--cobalt)' }} />
                <span>{h}</span>
              </span>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <button 
              type="button" 
              className={styles.readArticleBtn}
              onClick={(e) => {
                e.stopPropagation();
                setActiveReadingArticle(post);
              }}
              data-hover
            >
              <span>Read Full Dispatch</span>
              <ArrowUpRight size={12} />
            </button>
          </div>
        </div>
      ),
      // Back face of page (Left side of open spread when flipped)
      backContent: (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className={styles.spreadArtWrap}>
            <img src={post.image} alt={post.title} className={styles.spreadArtImg} />
            <div className={styles.spreadArtOverlay} />
            <span className={styles.spreadArtCaption}>
              {post.category} • {post.readTime}
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {post.content && post.content.map((para, pi) => (
              <p key={pi} className="page-body-text" style={{ fontSize: '10px', lineHeight: 1.6, marginBottom: '8px' }}>
                {para}
              </p>
            ))}
          </div>

          <div style={{ 
            borderTop: '1px solid rgba(163,190,211, 0.2)', 
            paddingTop: '8px', 
            marginTop: '8px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            fontSize: '9px',
            color: 'var(--cobalt)',
            fontFamily: 'var(--font-mono, monospace)'
          }}>
            <span>{post.coordinates}</span>
            <span>PORT OF SYRENA</span>
          </div>
        </div>
      )
    };
  });

  return (
    <section className={styles.codexSection}>
      <div className={styles.ambientGlowPrimary} />

      <div className="container">
        {/* ═══════════════ BLOG TITLE HEADER ═══════════════ */}
        <div className={styles.blogHeader}>
          <div className={styles.blogLabel}>
            <span className={styles.blogDot} />
            <span>Editorial &amp; Insights</span>
          </div>
          <h2 className={styles.blogTitle}>
            Our Latest Blogs &amp; Dispatches
          </h2>
          <p className={styles.blogSubtitle}>
            Flip through our interactive agency book to explore our strategic essays, digital craft analyses, and market insights.
          </p>
        </div>


        {/* ═══════════════ 3D INTERACTIVE BOOK SHOWCASE ═══════════════ */}
        <div className={styles.bookStageWrapper}>
          <div className={styles.pedestalGlow} />

          <InteractiveBook
            key={bookKey}
            coverImage="/images/cyanotype-fullscreen-hero.jpg"
            bookTitle="The Syrena Codex"
            bookAuthor="Syrena Atelier • Dispatches"
            category="Thought Leadership"
            pages={bookPages}
            width={380}
            height={540}
            initialOpen={false}
          />
        </div>
      </div>





      {/* ═══════════════ FULL ARTICLE READER MODAL ═══════════════ */}
      {activeReadingArticle && (
        <div className={styles.modalBackdrop} onClick={() => setActiveReadingArticle(null)}>
          <div className={styles.readerModalWindow} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.readerMetaRow}>
                <span>{activeReadingArticle.category}</span>
                <span>•</span>
                <span>{activeReadingArticle.issue}</span>
                <span>•</span>
                <span>{activeReadingArticle.readTime}</span>
              </div>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setActiveReadingArticle(null)}
                aria-label="Close reader"
                data-hover
              >
                <X size={18} />
              </button>
            </div>

            <img 
              src={activeReadingArticle.image} 
              alt={activeReadingArticle.title} 
              className={styles.readerHeroImg} 
            />

            <h2 className={styles.readerTitle}>{activeReadingArticle.title}</h2>

            <div className={styles.authorSignature} style={{ marginBottom: '28px' }}>
              <img 
                src={activeReadingArticle.author.avatar} 
                alt={activeReadingArticle.author.name} 
                className={styles.authorImg} 
              />
              <div className={styles.authorText}>
                <span className={styles.authorName}>{activeReadingArticle.author.name}</span>
                <span className={styles.authorRole}>{activeReadingArticle.author.role}</span>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => toggleBookmark(activeReadingArticle.id)}
                  style={{ color: bookmarkedIds.includes(activeReadingArticle.id) ? 'var(--cobalt)' : 'var(--navy)', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
                  title="Bookmark"
                >
                  {bookmarkedIds.includes(activeReadingArticle.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>
                <button
                  type="button"
                  onClick={() => handleShare(activeReadingArticle)}
                  style={{ color: copiedId === activeReadingArticle.id ? 'var(--cobalt)' : 'var(--navy)', background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
                  title="Share Link"
                >
                  {copiedId === activeReadingArticle.id ? <Check size={18} /> : <Share2 size={18} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <p className={styles.readerContentText} style={{ fontSize: '17px', color: 'var(--white)', fontWeight: 500 }}>
                {activeReadingArticle.excerpt}
              </p>
              {activeReadingArticle.content && activeReadingArticle.content.map((p, idx) => (
                <p key={idx} className={styles.readerContentText}>
                  {p}
                </p>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(163,190,211, 0.2)', paddingTop: '16px', fontSize: '11px', color: 'var(--cobalt)', fontFamily: 'var(--font-mono, monospace)' }}>
              <span>ORIGIN: {activeReadingArticle.coordinates}</span>
              <span>PORT OF SYRENA ARCHIVE</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
