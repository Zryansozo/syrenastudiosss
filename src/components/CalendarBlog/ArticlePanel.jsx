import { ArrowUpRight, ArrowLeft, BookOpen, Clock3, X } from 'lucide-react';
import { formatDate, readingMinutes } from './calendar';
import styles from './CalendarBlog.module.css';

function PostMeta({ post }) {
  return <div className={styles.postMeta}><span>{post.category}</span><span><Clock3 size={13} aria-hidden="true" />{readingMinutes(post.content)} min read</span></div>;
}

export default function ArticlePanel({ id, selectedDate, posts, activePost, onOpen, onClose, onReturn, onLatest, hasPosts, headingRef, readerRef }) {
  const dateLabel = formatDate(selectedDate);
  return <div className={styles.panel} id={`${id}-panel`} role="region" aria-labelledby={`${id}-panel-heading`}>
    <div className={styles.panelBar}>
      <span>{activePost ? (activePost.status === 'scheduled' ? 'SCHEDULED PREVIEW' : 'FROM THE JOURNAL') : 'THE READING ROOM'}</span>
      {activePost ? <button type="button" onClick={onClose} aria-label="Close article and return to selected date"><X size={19} aria-hidden="true" /></button> : <BookOpen size={18} aria-hidden="true" />}
    </div>
    <div className={styles.reader} ref={readerRef} data-lenis-prevent>
      {activePost ? <article className={styles.article} key={activePost.id}>
        <div className={styles.cover}><img src={activePost.cover.src} alt={activePost.cover.alt} loading="lazy" width="900" height="450" /><span>{activePost.sample ? 'SAMPLE STORY' : 'SYRENA JOURNAL'}</span></div>
        <div className={styles.articleBody}>
          <PostMeta post={activePost} />
          <h3 id={`${id}-panel-heading`} ref={headingRef} tabIndex={-1}>{activePost.title}</h3>
          <div className={styles.byline}><span>By {activePost.author}</span><span>{activePost.status === 'scheduled' ? 'Scheduled for ' : ''}<time dateTime={activePost.date}>{dateLabel}</time></span></div>
          {activePost.status === 'scheduled' && <p className={styles.scheduledNotice}>A look ahead. This story is scheduled for {dateLabel} and is available here as a preview.</p>}
          <p className={styles.excerpt}>{activePost.excerpt}</p>
          <div className={styles.prose}>{activePost.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
          <button type="button" className={styles.textButton} onClick={onClose}><ArrowLeft size={16} aria-hidden="true" />Back to {posts.length > 1 ? 'stories for this date' : 'the calendar'}</button>
        </div>
      </article> : posts.length > 0 ? <div className={styles.storyList} key={selectedDate}>
        <span className={styles.kicker}>{posts.length} {posts.length === 1 ? 'STORY' : 'STORIES'} / ONE FRESH PERSPECTIVE AT A TIME</span>
        <h3 id={`${id}-panel-heading`} ref={headingRef} tabIndex={-1}>{formatDate(selectedDate, { day: 'numeric', month: 'long' })}<em>, {selectedDate.slice(0, 4)}</em></h3>
        <p className={styles.listIntro}>Choose a story and settle in.</p>
        <div className={styles.storyCards}>{posts.map(post => <button type="button" className={styles.storyCard} key={post.id} onClick={() => onOpen(post.id)}>
          <img src={post.cover.src} alt="" loading="lazy" width="160" height="160" />
          <span className={styles.storyCardCopy}><span className={styles.storyCategory}>{post.category}{post.status === 'scheduled' && <span className={styles.previewBadge}>Scheduled</span>}</span><strong>{post.title}</strong><span className={styles.cardExcerpt}>{post.excerpt}</span><span className={styles.cardRead}>{readingMinutes(post.content)} min read <ArrowUpRight size={16} aria-hidden="true" /></span></span>
        </button>)}</div>
        <button type="button" className={styles.textButton} onClick={onReturn}><ArrowLeft size={15} aria-hidden="true" />Back to calendar</button>
      </div> : <div className={styles.empty} key={selectedDate}>
        <span className={styles.emptyIcon}><BookOpen size={29} strokeWidth={1.3} aria-hidden="true" /></span>
        <span className={styles.kicker}>{dateLabel}</span>
        <h3 id={`${id}-panel-heading`} ref={headingRef} tabIndex={-1}>A quiet day<br /><em>in the journal.</em></h3>
        <p>No stories published on this date.<br />Choose a marked date to find something to read.</p>
        {hasPosts && <button type="button" className={styles.latestButton} onClick={onLatest}>Find a story <ArrowUpRight size={17} aria-hidden="true" /></button>}
      </div>}
    </div>
  </div>;
}
