import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Eyebrow } from '../Studio/StudioKit';
import { journalPosts } from '../../data/journalPosts';
import { addMonths, formatDate, indexPosts, monthStart, sameMonth, todayKey, JOURNAL_TIME_ZONE } from './calendar';
import MonthCalendar from './MonthCalendar';
import ArticlePanel from './ArticlePanel';
import styles from './CalendarBlog.module.css';

/** Date-only `YYYY-MM-DD` posts. Scheduled entries supplied here are public previews. */
export default function CalendarBlog({ posts = journalPosts, timeZone = JOURNAL_TIME_ZONE }) {
  const id = useId();
  const byDate = useMemo(() => indexPosts(posts), [posts]);
  const [today, setToday] = useState(() => todayKey(new Date(), timeZone));
  const [selectedDate, setSelectedDate] = useState(today);
  const [focusedDate, setFocusedDate] = useState(today);
  const [month, setMonth] = useState(() => monthStart(today));
  const [activeId, setActiveId] = useState(() => {
    const initialPosts = byDate.get(today) || [];
    return initialPosts.length === 1 ? initialPosts[0].id : null;
  });
  const headingRef = useRef(null);
  const readerRef = useRef(null);
  const calendarRef = useRef(null);
  const focusReader = useRef(false);
  const selectedPosts = byDate.get(selectedDate) || [];
  const activePost = selectedPosts.find(post => post.id === activeId);
  const monthPosts = [...byDate.entries()].filter(([date]) => sameMonth(date, month)).sort(([a], [b]) => a.localeCompare(b));
  const monthCount = monthPosts.reduce((total, [, entries]) => total + entries.length, 0);
  const sampleContent = posts.some(post => post.sample);

  // Refresh the Today marker for long-lived tabs, without changing the reader's selection.
  useEffect(() => {
    const update = () => setToday(todayKey(new Date(), timeZone));
    update();
    const timer = window.setInterval(update, 60_000);
    document.addEventListener('visibilitychange', update);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', update); };
  }, [timeZone]);

  useEffect(() => {
    if (!focusReader.current) return;
    readerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    headingRef.current?.focus({ preventScroll: true });
    if (window.matchMedia('(max-width: 800px)').matches) headingRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    focusReader.current = false;
  }, [selectedDate, activeId]);

  const selectDate = date => {
    const entries = byDate.get(date) || [];
    focusReader.current = entries.length > 0;
    setSelectedDate(date);
    setFocusedDate(date);
    setMonth(monthStart(date));
    setActiveId(entries.length === 1 ? entries[0].id : null);
  };
  const focusDate = (date, revealMonth = true) => {
    setFocusedDate(date);
    if (revealMonth && !sameMonth(date, month)) setMonth(monthStart(date));
  };
  const changeMonth = amount => {
    const next = monthStart(addMonths(month, amount));
    setMonth(next);
    setFocusedDate(sameMonth(selectedDate, next) ? selectedDate : next);
  };
  const returnToCalendar = () => {
    // Re-show the selected month when it was browsed away from while reading.
    setMonth(monthStart(selectedDate));
    setFocusedDate(selectedDate);
    requestAnimationFrame(() => calendarRef.current?.querySelector(`[data-date="${selectedDate}"]`)?.focus());
  };
  const closeArticle = () => { setActiveId(null); focusReader.current = false; returnToCalendar(); };
  const findStory = () => {
    const dates = [...byDate.keys()].sort();
    const published = dates.filter(date => date <= today && byDate.get(date).some(post => post.status === 'published'));
    if (dates.length) selectDate(published.at(-1) || dates[0]);
  };

  return <section id="studio-journal" className={`studio-wrap ${styles.section}`} aria-labelledby={`${id}-title`}>
    <header className={styles.heading}>
      <div><Eyebrow>THE STUDIO JOURNAL / NOTES FROM THE SHORE</Eyebrow><h2 id={`${id}-title`}>Good stories.<br /><em>In their own time.</em></h2></div>
      <div className={styles.headingAside}><p>Thoughts on brands, digital craft, and the things that spark a new idea. Explore the journal, one date at a time.</p>{sampleContent && <span className={styles.sampleLabel}>SAMPLE EDITION · EDITORIAL DEMO</span>}</div>
    </header>
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <MonthCalendar id={id} month={month} selectedDate={selectedDate} focusedDate={focusedDate} today={today} byDate={byDate} onMonthChange={changeMonth} onFocusDate={focusDate} onSelectDate={selectDate} calendarRef={calendarRef} />
        <div className={styles.agenda}><div className={styles.agendaHeading}><span>THIS MONTH</span><span>{monthCount} {monthCount === 1 ? 'STORY' : 'STORIES'}</span></div>
          {monthPosts.length ? <ul>{monthPosts.map(([date, entries]) => <li key={date}><button type="button" onClick={() => selectDate(date)} aria-label={`${formatDate(date)}, ${entries.length} ${entries.length === 1 ? 'story' : 'stories'}`}><span className={styles.agendaDate}>{date.slice(-2)}</span><span className={styles.agendaCopy}><strong>{entries[0].title}</strong><small>{entries.length > 1 ? `${entries.length} stories to explore` : entries[0].status === 'scheduled' ? 'Scheduled preview' : entries[0].category}</small></span><ArrowUpRight size={16} aria-hidden="true" /></button></li>)}</ul> : <p>No stories on the calendar this month.<button type="button" className={styles.textButton} onClick={findStory} disabled={!byDate.size}>Find a story <ArrowUpRight size={14} aria-hidden="true" /></button></p>}
        </div>
      </div>
      <ArticlePanel id={id} selectedDate={selectedDate} posts={selectedPosts} activePost={activePost} onOpen={postId => { focusReader.current = true; setActiveId(postId); }} onClose={closeArticle} onReturn={returnToCalendar} onLatest={findStory} hasPosts={byDate.size > 0} headingRef={headingRef} readerRef={readerRef} />
    </div>
    <p className={styles.srOnly} role="status">{formatDate(selectedDate)}. {selectedPosts.length ? `${selectedPosts.length} ${selectedPosts.length === 1 ? 'story' : 'stories'} available.${activePost ? ` Reading ${activePost.title}` : ''}` : 'No stories published on this date.'}</p>
    <div className={styles.sectionFoot}><span>A LITTLE CURIOSITY GOES A LONG WAY.</span><span>Dates follow India Standard Time.</span></div>
  </section>;
}
