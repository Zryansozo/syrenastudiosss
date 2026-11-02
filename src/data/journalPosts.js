import { DEFAULT_DISPATCHES } from './legacyDispatches.js';

// Editorial samples, not a publishing backend. Replace these records with approved
// content or pass your own `posts` to CalendarBlog. Scheduled records are PUBLIC previews.
const samples = [
  {
    id: 'space-to-think', date: '2026-10-14', status: 'published',
    title: 'A little space to think.', category: 'Creative practice', author: 'Syrena Studio',
    cover: { src: '/images/siren-editorial.jpg', alt: 'Ocean-inspired editorial artwork from the Syrena studio' },
    excerpt: 'Why the most useful part of a creative process is sometimes the pause between ideas.',
    content: [
      'A creative brief can feel like an invitation to move immediately. There are references to collect, sketches to make, and a deadline already coming into view. Before opening another tab, it can help to leave a little room around the problem.',
      'That pause is not a substitute for doing the work. It is a chance to notice what the work is really asking for. Is the brand hard to recognise, or simply hard to understand? Does the website need more personality, or a clearer route to the information people came for? Those questions lead to very different decisions.',
      'One useful practice is to write the challenge in a single sentence without naming a solution. “Help first-time visitors understand what we do” leaves more possibilities open than “add a video to the homepage”. The first describes a need. The second has already chosen a tool.',
      'Next, collect a small set of references and explain what makes each one useful. It might be the rhythm of the typography, the honesty of a product description, or the way a page gives its main action room to breathe. Naming the principle makes it easier to create something original instead of borrowing the surface.',
      'Then step away long enough to come back with a fresh question. A walk, a conversation, or a sketch on paper can change which details feel important. You do not need a grand ritual; just a deliberate gap between collecting and deciding.',
      'The aim is not to make the process slower. It is to spend attention where it can make a difference. Clear thinking underneath gives a playful idea something solid to stand on. Sometimes the next useful move starts with a little space.',
    ],
  },
  {
    id: 'colour-with-a-point-of-view', date: '2026-10-14', status: 'published',
    title: 'Colour with a point of view.', category: 'Brand identity', author: 'Syrena Studio',
    cover: { src: '/images/studio-daydream.png', alt: 'Daydream concept packaging in coastal pastel colours' },
    excerpt: 'A palette is more than a collection of favourite shades. Give each colour a job.',
    content: [
      'A memorable palette needs relationships as much as it needs beautiful individual colours. One shade might carry the identity, another might create breathing room, and a third might draw attention to the next step. Deciding those roles makes the system easier to use.',
      'Start with a working surface. Put your colours behind actual paragraphs, buttons, labels, and photographs. A combination that feels effortless in a row of swatches can behave differently when it has to carry a long headline or a small navigation link.',
      'For an ocean-inspired identity, blue does not need to do all the work. Warm paper can soften the reading experience. A butter-yellow accent can make a small action feel welcoming. Coral can bring energy to a particular moment without turning every section into a competing announcement.',
      'Give your team a few reliable pairings. Define which colours work for text, which belong to backgrounds, and which should remain decorative. Check contrast at the sizes people will actually read, including quiet captions and controls on mobile.',
      'Finally, leave room for restraint. Not every page needs every colour. Repetition of a few considered combinations often creates a clearer identity than constant variation. The palette becomes a point of view when its choices feel intentional wherever someone meets the brand.',
    ],
  },
  {
    id: 'useful-little-details', date: '2026-10-07', status: 'published',
    title: 'The useful little details.', category: 'Digital craft', author: 'Syrena Studio',
    cover: { src: '/images/conch-shell.jpg', alt: 'A sculptural conch shell with naturally repeating details' },
    excerpt: 'Small interactions should help people feel oriented, confident, and in control.',
    content: [
      'Good interaction design often lives in the small moments between larger decisions. A button responds when it is pressed. A selected item stays visibly selected. A panel closes without sending someone back to the beginning. These details tell a person that the interface is paying attention.',
      'Begin with state, then add movement. Work out how a control looks at rest, on focus, while active, and when unavailable. If those states are understandable without animation, movement can reinforce them rather than carry the entire explanation.',
      'Keep feedback close to the action that caused it. When a visitor selects a date, highlight that date and show what it contains nearby. If there is nothing to read, say so plainly and leave the surrounding choices available.',
      'Keyboard use belongs in the first version of an interaction. Focus should follow a predictable path, controls should have useful labels, and closing a detail view should return a person to a meaningful place. These are part of making the experience feel considered.',
      'A final pass with reduced motion enabled is useful for everyone designing the interface. It reveals whether the hierarchy and state changes still make sense when the choreography is removed. The best little details continue to work when they are quiet.',
    ],
  },
  {
    id: 'find-your-creative-current', date: '2026-10-21', status: 'scheduled',
    title: 'Find your creative current.', category: 'Strategy', author: 'Syrena Studio',
    cover: { src: '/images/cyanotype-fullscreen-hero.jpg', alt: 'Blue ocean-inspired cyanotype texture' },
    excerpt: 'A practical starting point for giving your next brand project a clearer direction.',
    content: [
      'A new project usually begins with several hopes at once: be more distinctive, explain the offer better, reach different people, and make the website easier to use. The first step is to turn that collection into a direction everyone can describe.',
      'Write down who the project should help and what you want them to understand or do. Be specific enough to make a design decision. “Help an independent founder compare our services” is more useful than “appeal to everyone”.',
      'Separate what you know from what you need to learn. Existing customer questions, a content inventory, and a short conversation with the people answering enquiries can reveal practical needs. Mark assumptions as assumptions so the team knows what still deserves a check.',
      'Choose a small set of priorities and agree on the trade-offs. A launch might focus on a clear identity and a concise website, with an editorial programme following later. A sequence is easier to work with than a promise to solve everything at once.',
      'Finish with a brief that connects the audience, the problem, the desired experience, and the scope. It does not need to sound impressive. It needs to give a creative idea a direction, and give the people making it a shared way to decide what belongs.',
    ],
  },
  {
    id: 'stories-worth-returning-to', date: '2026-11-03', status: 'scheduled',
    title: 'Stories worth returning to.', category: 'Content', author: 'Syrena Studio',
    cover: { src: '/images/blue-starfish.jpg', alt: 'Blue starfish photographed as an ocean-inspired visual study' },
    excerpt: 'Build an editorial rhythm around useful questions, not a race to fill the calendar.',
    content: [
      'A content calendar is a way to make room for useful stories. It becomes less useful when every empty square feels like a problem. A thoughtful rhythm begins with what your audience needs, then considers how often your team can make something worth their time.',
      'Keep a list of recurring questions from conversations, project enquiries, and your own process. Some deserve a short answer. Others can become a detailed guide, a visual explanation, or a note about a decision that is often misunderstood.',
      'Give each story one purpose. An article about choosing a creative direction does not also need to explain every service. A focused piece is easier to write, easier to edit, and easier for a reader to remember.',
      'Plan time for maintenance alongside new work. Review old examples, check links, and make sure a useful guide still reflects the way you work. An archive feels cared for when returning readers can trust its details.',
      'The goal is a recognisable editorial voice: helpful, curious, and clear about what it knows. A calendar can support that habit, but the empty spaces are allowed to stay empty until there is something useful to say.',
    ],
  },
];

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// Preserve the original prototype articles and their dates in the same archive.
const archive = DEFAULT_DISPATCHES.map(post => {
  const [month, day, year] = post.date.replace(',', '').split(' ');
  return {
    id: post.id,
    date: `${year}-${String(months.indexOf(month) + 1).padStart(2, '0')}-${day.padStart(2, '0')}`,
    title: post.title, status: 'published', author: post.author.name, category: post.category,
    excerpt: post.excerpt, cover: { src: post.image, alt: `${post.category} editorial artwork` }, content: post.content,
  };
});

export const journalPosts = [...samples, ...archive].map(post => ({ ...post, sample: true }));
