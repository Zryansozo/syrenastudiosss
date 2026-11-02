import { useLayoutEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, keyboardDate, monthGrid, sameMonth, MIN_DATE, MAX_DATE } from './calendar';
import styles from './CalendarBlog.module.css';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function MonthCalendar({ id, month, selectedDate, focusedDate, today, byDate, onMonthChange, onFocusDate, onSelectDate, calendarRef }) {
  const cells = monthGrid(month);
  const pendingFocus = useRef(null);
  const dateButtons = useRef(new Map());

  useLayoutEffect(() => {
    if (pendingFocus.current) {
      dateButtons.current.get(pendingFocus.current)?.focus({ preventScroll: true });
      pendingFocus.current = null;
    }
  });

  const onKeyDown = (event, date) => {
    const next = keyboardDate(date, event.key, event.shiftKey);
    if (!next) return;
    event.preventDefault();
    pendingFocus.current = next;
    onFocusDate(next);
  };

  return <div className={styles.calendar} ref={calendarRef}>
    <div className={styles.monthBar}>
      <h3 id={`${id}-month`} aria-live="polite" aria-atomic="true">{formatDate(month, { month: 'long', year: 'numeric' })}</h3>
      <div className={styles.monthControls}>
        <button type="button" aria-label="Previous month" disabled={sameMonth(month, MIN_DATE)} onClick={() => onMonthChange(-1)}><ChevronLeft size={19} aria-hidden="true" /></button>
        <button type="button" aria-label="Next month" disabled={sameMonth(month, MAX_DATE)} onClick={() => onMonthChange(1)}><ChevronRight size={19} aria-hidden="true" /></button>
      </div>
    </div>
    <p className={styles.calendarHint} id={`${id}-instructions`}>Pick a date. Find a fresh perspective.<span className={styles.srOnly}> Use arrow keys to move by day or week, Home and End for the start and end of a week, Page Up and Page Down to change months. Hold Shift with Page Up or Page Down to change years. Press Enter or Space to select.</span></p>
    <table className={styles.grid} role="grid" aria-labelledby={`${id}-month`} aria-describedby={`${id}-instructions`}>
      <thead><tr>{weekdays.map(day => <th key={day} scope="col" aria-label={day}><abbr title={day}>{day.slice(0, 2)}</abbr></th>)}</tr></thead>
      <tbody key={month} className={styles.monthEnter}>{Array.from({ length: 6 }, (_, row) => <tr key={row}>
        {cells.slice(row * 7, row * 7 + 7).map((date, col) => {
          if (!date) return <td key={`blank-${col}`} />;
          const posts = byDate.get(date) || [];
          const published = posts.filter(post => post.status === 'published').length;
          const scheduled = posts.length - published;
          const label = `${formatDate(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}${date === today ? ', today' : ''}, ${published ? `${published} published ${published === 1 ? 'story' : 'stories'}` : ''}${published && scheduled ? ', ' : ''}${scheduled ? `${scheduled} scheduled ${scheduled === 1 ? 'story' : 'stories'}` : ''}${!posts.length ? 'no stories' : ''}`;
          return <td key={date} aria-selected={date === selectedDate}>
            <button ref={node => { if (node) dateButtons.current.set(date, node); else dateButtons.current.delete(date); }}
              type="button" className={styles.day} data-date={date} data-outside={!sameMonth(date, month) || undefined}
              data-selected={date === selectedDate || undefined} data-has-posts={posts.length > 0 || undefined}
              aria-current={date === today ? 'date' : undefined} aria-label={label} aria-controls={`${id}-panel`}
              tabIndex={date === focusedDate ? 0 : -1} onFocus={() => { if (date !== focusedDate) onFocusDate(date, false); }}
              onKeyDown={event => onKeyDown(event, date)} onClick={() => onSelectDate(date)}>
              <span>{Number(date.slice(-2))}</span>
              <span className={styles.dayIndicators} aria-hidden="true">{published > 0 && <i />}{scheduled > 0 && <i className={styles.scheduledDot} />}{posts.length > 1 && <small>{posts.length}</small>}</span>
            </button>
          </td>;
        })}
      </tr>)}</tbody>
    </table>
    <div className={styles.legend}><span><i />Published</span><span><i className={styles.scheduledDot} />Scheduled</span><button type="button" onClick={() => onSelectDate(today)}>Today</button></div>
    <div className={styles.keyboardNote}>← ↑ ↓ → to explore <span>·</span> Enter to read</div>
  </div>;
}
