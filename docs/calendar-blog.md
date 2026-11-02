# Calendar journal

The homepage mounts `CalendarBlog` immediately before its final contact section. It uses existing React, Lucide icons, Studio typography and CSS tokens; no dependencies were added. Styles are scoped in `CalendarBlog.module.css`.

## Content

`src/data/journalPosts.js` is the editable source. The existing prototype archive was extracted unchanged to `src/data/legacyDispatches.js`; both the original Codex component and the new journal reuse it. All included records are labelled samples. Replace or remove prototype copy before publishing your real journal.

```js
{
  id: 'a-unique-stable-slug',
  date: '2026-10-14', // date-only, never a UTC timestamp
  status: 'published', // 'scheduled' is a public preview; 'draft' is omitted
  title: 'Your article title',
  author: 'Author name',
  category: 'Digital craft',
  cover: { src: '/images/your-cover.jpg', alt: 'Meaningful image description' },
  excerpt: 'A short introduction.',
  content: ['First paragraph.', 'Second paragraph.'],
  sample: false,
}
```

Pass `posts` to `<CalendarBlog posts={yourPosts} />` for a different data source. Entries must have unique IDs and valid ISO dates. Multiple entries can share a date. Content is rendered as text, not injected HTML. Read times are calculated from paragraph word counts.

Scheduled entries supplied to this public component are visible previews, including their full article content. This is not private draft storage, a CMS, or an automatic publication service. Keep confidential drafts out of frontend data and let a backend decide which records are public if you connect one. Change `status` to `published` when a story goes live, or supply that state from the CMS.

## Behaviour

- Initial view uses today's month and selects today. One story opens immediately; multiple stories show a chooser; an empty date shows a helpful message. “Find a story” jumps to the most recent published date (or the first available preview).
- Solid dots indicate published stories, hollow dots indicate scheduled previews, and a small count identifies multiple stories. Today is underlined; selected dates have navy fill.
- Month navigation retains the selected date and any open article. The panel explicitly displays its own date. Closing a story restores calendar focus to that date, revealing its month if necessary.
- The desktop reader scrolls inside its panel. On mobile it flows below the calendar, and selecting a story takes focus to its heading. `data-lenis-prevent` preserves native reader scrolling with the existing smooth-scroll provider.
- The calendar has one roving tab stop. Arrows move by day/week, Home/End to week edges, Page Up/Down by month, Shift+Page Up/Down by year; Enter/Space selects. Navigation buttons, agenda entries and article controls remain separate tab stops.
- Motion respects `prefers-reduced-motion`. Empty states and selection changes are announced to assistive technology.

## Dates and checks

Pure date-only arithmetic uses UTC with explicit parsing to avoid DST shifts. The Today marker uses India Standard Time (`Asia/Kolkata`), refreshed every minute and when the tab visibility changes. The optional `timeZone` prop changes that reference zone.

Run `node --test scripts/check-calendar.mjs`, `node scripts/check-studio.mjs`, and `npm run build`. Calendar tests cover a full 400-year Gregorian cycle, leap days, year transitions, month clamping, keyboard movements, timezone midnight boundaries, multiple posts, empty data, drafts, duplicate IDs, retained archive content and local covers. These checks do not substitute for browser layout and interaction testing.
