import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { addDays, addMonths, dateKey, formatDate, indexPosts, keyboardDate, monthGrid, monthStart, parseDate, readingMinutes, sameMonth, todayKey } from '../src/components/CalendarBlog/calendar.js';
import { journalPosts } from '../src/data/journalPosts.js';
import { DEFAULT_DISPATCHES } from '../src/data/legacyDispatches.js';

test('strict date-only parsing rejects rollovers and ambiguous input', () => {
  for (const invalid of ['2026-02-29', '2026-04-31', '2026-13-01', '2026-00-10', '2026-1-01', '14/10/2026', '0000-01-01', '2026-10-14T00:00:00Z']) assert.throws(() => parseDate(invalid), RangeError);
  for (const valid of ['2024-02-29', '2000-02-29', '0001-01-01', '0099-12-31', '9999-12-31']) assert.equal(dateKey(parseDate(valid)), valid);
});

test('Gregorian leap years include century exceptions', () => {
  assert.equal(addDays('2000-02-28', 1), '2000-02-29');
  assert.equal(addDays('1900-02-28', 1), '1900-03-01');
  assert.equal(addDays('2100-02-28', 1), '2100-03-01');
  assert.equal(addDays('2024-02-29', 1), '2024-03-01');
});

test('month navigation clamps dates and crosses years correctly', () => {
  assert.equal(addMonths('2026-01-31', 1), '2026-02-28');
  assert.equal(addMonths('2024-01-31', 1), '2024-02-29');
  assert.equal(addMonths('2024-02-29', 12), '2025-02-28');
  assert.equal(addMonths('2026-12-31', 1), '2027-01-31');
  assert.equal(addMonths('2026-01-15', -1), '2025-12-15');
  assert.equal(addMonths('0099-12-31', 1), '0100-01-31');
});

test('grid has aligned weeks and every day exactly once over a full leap-year cycle', () => {
  for (let year = 2000; year < 2400; year++) {
    for (let month = 1; month <= 12; month++) {
      const first = `${year}-${String(month).padStart(2, '0')}-01`;
      const cells = monthGrid(first);
      assert.equal(cells.length, 42);
      assert.equal(new Set(cells).size, 42);
      assert.equal(parseDate(cells[0]).getUTCDay(), 0);
      const dates = cells.filter(date => sameMonth(date, first));
      assert.equal(dates[0], first);
      assert.equal(addDays(dates.at(-1), 1), monthStart(addMonths(first, 1)));
      for (let index = 1; index < cells.length; index++) assert.equal(cells[index], addDays(cells[index - 1], 1));
    }
  }
});

test('supported year boundaries do not produce invalid focus targets', () => {
  assert.equal(addDays('0001-01-01', -1), '0001-01-01');
  assert.equal(addDays('9999-12-31', 1), '9999-12-31');
  assert.equal(addMonths('0001-01-01', -1), '0001-01-01');
  assert.equal(addMonths('9999-12-31', 1), '9999-12-31');
  for (const boundary of ['0001-01-01', '9999-12-01']) for (const cell of monthGrid(boundary)) if (cell) assert.doesNotThrow(() => parseDate(cell));
});

test('keyboard movement follows day, week, month and year conventions', () => {
  assert.equal(keyboardDate('2026-10-14', 'ArrowLeft'), '2026-10-13');
  assert.equal(keyboardDate('2026-10-31', 'ArrowRight'), '2026-11-01');
  assert.equal(keyboardDate('2026-10-14', 'ArrowUp'), '2026-10-07');
  assert.equal(keyboardDate('2026-10-14', 'ArrowDown'), '2026-10-21');
  assert.equal(keyboardDate('2026-10-14', 'Home'), '2026-10-11');
  assert.equal(keyboardDate('2026-10-14', 'End'), '2026-10-17');
  assert.equal(keyboardDate('2026-03-31', 'PageUp'), '2026-02-28');
  assert.equal(keyboardDate('2026-12-14', 'PageDown'), '2027-01-14');
  assert.equal(keyboardDate('2024-02-29', 'PageDown', true), '2025-02-28');
  assert.equal(keyboardDate('2026-10-14', 'PageUp', true), '2025-10-14');
  assert.equal(keyboardDate('2026-10-14', 'Tab'), null);
});

test('India date changes at midnight IST, independent of the device timezone', () => {
  assert.equal(todayKey(new Date('2026-10-13T18:29:59Z')), '2026-10-13');
  assert.equal(todayKey(new Date('2026-10-13T18:30:00Z')), '2026-10-14');
  assert.equal(todayKey(new Date('2026-10-14T00:30:00Z'), 'America/Los_Angeles'), '2026-10-13');
  assert.equal(formatDate('2026-10-14'), '14 October 2026');
});

test('post lookup handles empty dates, multiple articles and scheduled previews', () => {
  const indexed = indexPosts(journalPosts);
  assert.equal(indexed.get('2026-10-14').length, 2);
  assert.equal(indexed.get('2026-10-21')[0].status, 'scheduled');
  assert.equal(indexed.get('2026-10-15'), undefined);
  assert.equal(indexPosts([]).size, 0);
  assert.equal(indexPosts([{ ...journalPosts[0], status: 'draft' }]).size, 0);
  assert.throws(() => indexPosts([journalPosts[0], journalPosts[0]]), /duplicate/);
  assert.throws(() => indexPosts([{ ...journalPosts[0], date: '2026-02-30' }]), RangeError);
  assert.throws(() => indexPosts([{ ...journalPosts[0], content: [] }]), /Incomplete/);
});

test('archive remains intact and sample covers exist locally', () => {
  for (const old of DEFAULT_DISPATCHES) {
    const migrated = journalPosts.find(post => post.id === old.id);
    assert.equal(migrated.title, old.title);
    assert.deepEqual(migrated.content, old.content);
    assert.equal(migrated.author, old.author.name);
  }
  for (const post of journalPosts) {
    assert(existsSync(new URL('../public' + post.cover.src, import.meta.url)));
    assert(post.sample);
    assert(readingMinutes(post.content) >= 1);
  }
});

test('component style hooks resolve and homepage mounts the calendar', () => {
  const css = readFileSync(new URL('../src/components/CalendarBlog/CalendarBlog.module.css', import.meta.url), 'utf8');
  for (const name of ['CalendarBlog', 'MonthCalendar', 'ArticlePanel']) {
    const jsx = readFileSync(new URL(`../src/components/CalendarBlog/${name}.jsx`, import.meta.url), 'utf8');
    for (const [, name] of jsx.matchAll(/styles\.(\w+)/g)) assert(css.includes('.' + name), `Missing style ${name}`);
  }
  const home = readFileSync(new URL('../src/pages/Home/Home.jsx', import.meta.url), 'utf8');
  assert(home.indexOf('<CalendarBlog/>') < home.indexOf('<StudioCTA/>'));
});
