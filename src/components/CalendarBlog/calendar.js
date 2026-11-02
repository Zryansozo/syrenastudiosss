// Date-only arithmetic uses UTC throughout. No ISO-to-local conversion or DST drift.
export const MIN_DATE = '0001-01-01';
export const MAX_DATE = '9999-12-31';
export const JOURNAL_TIME_ZONE = 'Asia/Kolkata';

function utcDate(year, month, day) {
  const date = new Date(0);
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  return date;
}

export function dateKey(date) {
  return `${String(date.getUTCFullYear()).padStart(4, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export function parseDate(key) {
  if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key) || key < MIN_DATE || key > MAX_DATE) throw new RangeError(`Invalid calendar date: ${key}`);
  const [year, month, day] = key.split('-').map(Number);
  const date = utcDate(year, month, day);
  if (dateKey(date) !== key) throw new RangeError(`Invalid calendar date: ${key}`);
  return date;
}

export function todayKey(now = new Date(), timeZone = JOURNAL_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year.padStart(4, '0')}-${values.month}-${values.day}`;
}

export function monthStart(key) { parseDate(key); return key.slice(0, 7) + '-01'; }
export function sameMonth(a, b) { return a.slice(0, 7) === b.slice(0, 7); }
export function formatDate(key, options = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' }).format(parseDate(key));
}

export function addDays(key, amount) {
  const date = parseDate(key);
  date.setUTCDate(date.getUTCDate() + amount);
  if (date.getUTCFullYear() < 1) return MIN_DATE;
  if (date.getUTCFullYear() > 9999) return MAX_DATE;
  return dateKey(date);
}

export function addMonths(key, amount) {
  const date = parseDate(key);
  const index = Math.max(12, Math.min(9999 * 12 + 11, date.getUTCFullYear() * 12 + date.getUTCMonth() + amount));
  const year = Math.floor(index / 12);
  const month = index % 12 + 1;
  const day = Math.min(date.getUTCDate(), utcDate(year, month + 1, 0).getUTCDate());
  return dateKey(utcDate(year, month, day));
}

export function monthGrid(key) {
  const first = parseDate(monthStart(key));
  const offset = first.getUTCDay();
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(first);
    date.setUTCDate(1 - offset + index);
    return date.getUTCFullYear() < 1 || date.getUTCFullYear() > 9999 ? null : dateKey(date);
  });
}

export function keyboardDate(key, keyboardKey, shiftKey = false) {
  const weekday = parseDate(key).getUTCDay();
  switch (keyboardKey) {
    case 'ArrowLeft': return addDays(key, -1);
    case 'ArrowRight': return addDays(key, 1);
    case 'ArrowUp': return addDays(key, -7);
    case 'ArrowDown': return addDays(key, 7);
    case 'Home': return addDays(key, -weekday);
    case 'End': return addDays(key, 6 - weekday);
    case 'PageUp': return addMonths(key, shiftKey ? -12 : -1);
    case 'PageDown': return addMonths(key, shiftKey ? 12 : 1);
    default: return null;
  }
}

// Explicit published/scheduled states; drafts never appear in the public calendar.
export function indexPosts(posts) {
  const byDate = new Map();
  const ids = new Set();
  for (const post of posts) {
    if (!['published', 'scheduled'].includes(post.status)) continue;
    parseDate(post.date);
    if (!post.id || ids.has(post.id)) throw new Error(`Missing or duplicate journal post ID: ${post.id}`);
    ids.add(post.id);
    if (!post.title || !post.author || !post.category || !post.cover?.src || !post.cover?.alt || !Array.isArray(post.content) || !post.content.length) throw new Error(`Incomplete journal post: ${post.id}`);
    const entries = byDate.get(post.date) || [];
    entries.push(post);
    byDate.set(post.date, entries);
  }
  return byDate;
}

export function readingMinutes(content) {
  return Math.max(1, Math.ceil(content.join(' ').trim().split(/\s+/).length / 200));
}
