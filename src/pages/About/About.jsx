import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Plus, Check, MousePointer2, MoveUpRight } from 'lucide-react';
import PageTransition from '../../components/PageTransition/PageTransition';
import styles from './About.module.css';

const disciplines = [
  { id: 'strategy', label: 'Find the signal', kind: 'Strategy', title: 'A clear direction. A better starting point.', copy: 'We ask the useful questions first: who is this for, what do they need, and what makes you worth choosing?', outputs: ['Brand positioning', 'Audience & opportunity', 'A practical roadmap'], note: 'Clarity before the clever stuff.' },
  { id: 'identity', label: 'Give it character', kind: 'Identity', title: 'A personality you can recognise anywhere.', copy: 'We turn that direction into a visual and verbal identity, with enough character to stand out and enough structure to stay consistent.', outputs: ['Visual identity', 'Voice & storytelling', 'Design systems'], note: 'A little unexpected. Entirely you.' },
  { id: 'digital', label: 'Make it work', kind: 'Digital', title: 'The good-looking part should work beautifully.', copy: 'We bring the brand to life through thoughtful websites, useful interactions, and content that gives people a reason to act.', outputs: ['Web design & development', 'Motion & interaction', 'Content & campaigns'], note: 'Built to be used. Made to be remembered.' },
];

const principles = [
  { title: 'Stay curious.', text: 'Ask another question. Follow the interesting detail. Good work starts with paying attention.', color: 'mint', shape: 'orbit', label: '01 / OUR INSTINCT' },
  { title: 'Make it matter.', text: 'A beautiful idea earns its place when it helps a real person do something, feel something, or understand something.', color: 'lilac', shape: 'spark', label: '02 / OUR STANDARD' },
  { title: 'Keep it human.', text: 'Clear conversations, honest feedback, and a shared sense of humour. We do our best work together.', color: 'coral', shape: 'smile', label: '03 / OUR ENERGY' },
];

const process = [
  { title: 'Get properly acquainted.', text: 'We listen, question, and map the challenge together. You bring the context; we help find the most useful place to start.', result: 'A shared brief & clear priorities' },
  { title: 'Explore the possibilities.', text: 'We develop a focused creative direction, with references and early ideas you can react to. Your feedback shapes the next step.', result: 'A direction we believe in together' },
  { title: 'Make the details count.', text: 'Design, words, and development come together. We refine the details and check the experience across screen sizes and interactions.', result: 'A considered, working experience' },
  { title: 'Send it into the world.', text: 'We prepare for launch, hand over the essentials, and agree on what comes next so the work has room to grow.', result: 'A confident launch & a useful handover' },
];

function StudioMark({ shape = 'spark', className = '' }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" className={className} aria-hidden="true">
      {shape === 'orbit' ? <>
        <ellipse cx="80" cy="80" rx="65" ry="26" stroke="currentColor" strokeWidth="3" transform="rotate(-35 80 80)" />
        <ellipse cx="80" cy="80" rx="65" ry="26" stroke="currentColor" strokeWidth="3" transform="rotate(35 80 80)" />
        <circle cx="80" cy="80" r="14" fill="currentColor" />
      </> : shape === 'smile' ? <>
        <path d="M80 12C101 12 106 28 121 34C146 44 137 62 147 80C137 98 146 116 121 126C106 132 101 148 80 148C59 148 54 132 39 126C14 116 23 98 13 80C23 62 14 44 39 34C54 28 59 12 80 12Z" stroke="currentColor" strokeWidth="3" />
        <path d="M49 91Q80 127 111 91" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="58" cy="65" rx="5" ry="9" fill="currentColor" /><ellipse cx="102" cy="65" rx="5" ry="9" fill="currentColor" />
      </> : <path d="M80 4L91 49L126 19L111 61L156 61L120 87L145 126L103 111L91 156L74 114L35 141L50 99L5 89L48 72L21 34L63 49Z" fill="currentColor" />}
    </svg>
  );
}

function Workbench() {
  const [selected, setSelected] = useState(0);
  const current = disciplines[selected];
  return (
    <section className={styles.workbench} aria-labelledby="workbench-title">
      <div className={styles.sectionTop}><span className={styles.eyebrow}>02 / THE WAY WE THINK</span><span className={styles.marginNote}>A few different minds. One shared direction.</span></div>
      <div className={styles.sectionHeading}><h2 id="workbench-title">Where the dots<br />get connected.</h2><p>Strategy, identity, and digital craft belong in the same conversation. Take a look inside our creative toolkit.</p></div>
      <div className={styles.workbenchGrid}>
        <div className={styles.disciplineList}>
          {disciplines.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === index} aria-controls="studio-preview" className={selected === index ? styles.disciplineActive : styles.disciplineButton} onClick={() => setSelected(index)}>
            <span className={styles.disciplineIndex}>0{index + 1}</span><span><small>{item.kind}</small><strong>{item.label}</strong></span><ArrowUpRight size={24} aria-hidden="true" />
          </button>)}
          <p className={styles.toolkitNote}><MousePointer2 size={16} aria-hidden="true" /> Pick a discipline. See what goes into it.</p>
        </div>
        <div id="studio-preview" className={styles.preview} data-mode={current.id}>
          <div className={styles.previewBar}><span><i /><i /><i /></span><span>SYRENA / CREATIVE WORKBENCH</span><span>0{selected + 1}</span></div>
          <div className={styles.previewArt} aria-hidden="true">
            {selected === 0 ? <div className={styles.signalMap}><div className={styles.orbitLine} /><span className={styles.mapNorth}>YOUR PEOPLE</span><span className={styles.mapWest}>YOUR PURPOSE</span><span className={styles.mapEast}>YOUR DIFFERENCE</span><div className={styles.mapCore}><StudioMark /><strong>The<br />good idea.</strong></div></div>
            : selected === 1 ? <div className={styles.identityPoster}><span>THE ART OF BEING</span><strong>very<br /><em>you.</em></strong><StudioMark /><div className={styles.swatches}><i /><i /><i /><i /></div><span className={styles.posterNote}>A personality. A point of view.</span></div>
            : <div className={styles.digitalPreview}><div className={styles.miniNav}><strong>SYRENA®</strong><span>MENU +</span></div><div className={styles.miniBody}><strong>Good ideas.<br /><em>Real impact.</em></strong><div className={styles.miniButton}>LET'S GO <ArrowUpRight size={14} /></div></div><StudioMark shape="orbit" /><div className={styles.cursor}><MousePointer2 size={20} /><span>you, exploring</span></div></div>}
            <span className={styles.conceptLabel}>ILLUSTRATIVE STUDIO CONCEPT</span>
          </div>
          <div className={styles.previewCopy} aria-live="polite" aria-atomic="true"><span className={styles.eyebrow}>{current.note}</span><h3>{current.title}</h3><p>{current.copy}</p><ul>{current.outputs.map(item => <li key={item}><Check size={14} aria-hidden="true" />{item}</li>)}</ul></div>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <PageTransition>
      <div className={styles.about}>
        <section className={styles.hero} aria-labelledby="about-title">
          <div className={styles.heroTop}><span className={styles.eyebrow}>INDEPENDENT MINDS. SHARED CURIOSITY.</span><span className={styles.edition}>THE STUDIO / 001</span></div>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.kicker}><span /> A NEW CREATIVE CURRENT</span>
              <h1 id="about-title">Serious craft.<br /><span className={styles.italic}>Playful souls.</span></h1>
              <p>We’re building a creative digital studio for brands with something to say. Strategy, design, and that little spark that makes people look twice—this is the world we want to create.</p>
              <Link to="/contact" className={styles.pillLink}>Meet your creative partners <ArrowUpRight size={20} aria-hidden="true" /></Link>
              <a href="#studio-story" className={styles.scrollLink}>SCROLL INTO OUR WORLD <ArrowRight size={15} aria-hidden="true" /></a>
            </div>
            <div className={styles.heroArt}>
              <div className={styles.artFrame}><span className={styles.artIndex}>OBJECTS OF CURIOSITY — NO. 01</span><img src="/images/syrena-studio-sculpture.png" width="1024" height="1024" alt="A sculptural pearl and chrome seashell with a coral ring on a lilac pedestal" fetchPriority="high" /><span className={styles.artCaption}>A different kind of digital.</span></div>
              <div className={styles.sticker}><StudioMark /><span>GOOD<br />WEIRD.</span></div>
              <div className={styles.artFoot}><span>PART LOGIC.<br />PART MAGIC.</span><MoveUpRight size={36} strokeWidth={1.2} aria-hidden="true" /></div>
            </div>
          </div>
          <div className={styles.heroBottom}><span>STRATEGY WITH SUBSTANCE</span><StudioMark /><span>DESIGN WITH CHARACTER</span><StudioMark /><span>DIGITAL WITH FEELING</span></div>
        </section>

        <section id="studio-story" className={styles.story} aria-labelledby="story-title">
          <div className={styles.storyAside}><span className={styles.eyebrow}>01 / OUR POINT OF VIEW</span><div className={styles.noteCard}><span>A NOTE FROM THE STUDIO</span><StudioMark shape="smile" /><p>Thoughtfully made.<br />Never on autopilot.</p><span>WITH LOVE, SYRENA ↗</span></div></div>
          <div className={styles.storyCopy}><h2 id="story-title">Good instincts.<br /><em>Better questions.</em></h2><p className={styles.lede}>Every studio starts somewhere. Ours starts with curiosity, a love of the ocean, and a belief that thoughtful work can have plenty of personality.</p><p>Syrena is taking shape around strategy, design, and development. Our aim is to connect what a brand stands for with how it looks, sounds, and works in the world.</p><p>We’re at the beginning—not looking back at a long list of projects, but looking forward to the ideas and people we could build something with.</p><div className={styles.storyTags}><span>Considered thinking</span><span>Distinctive design</span><span>Careful execution</span></div></div>
        </section>

        <Workbench />

        <section className={styles.principles} aria-labelledby="principles-title">
          <div className={styles.sectionTop}><span className={styles.eyebrow}>03 / WHAT WE BRING</span><span className={styles.marginNote}>A point of view, with room for yours.</span></div>
          <h2 id="principles-title">A little character<br />goes a long way.</h2>
          <div className={styles.principleGrid}>{principles.map(item => <article key={item.title} className={styles.principleCard} data-color={item.color}><span className={styles.eyebrow}>{item.label}</span><StudioMark shape={item.shape} /><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        </section>

        <section className={styles.process} aria-labelledby="process-title">
          <div className={styles.processIntro}><span className={styles.eyebrow}>04 / FROM HELLO TO LAUNCH</span><h2 id="process-title">Good chemistry.<br /><em>Great work.</em></h2><p>A clear process leaves more room for good ideas. Here’s how we get there, together.</p><StudioMark shape="orbit" /></div>
          <div className={styles.processSteps}>{process.map((step, index) => <details className={styles.processStep} key={step.title} open={index === 0 ? true : undefined}><summary><span>0{index + 1}</span><h3>{step.title}</h3><Plus size={22} aria-hidden="true" /></summary><div className={styles.stepBody}><p>{step.text}</p><span><ArrowRight size={14} aria-hidden="true" />{step.result}</span></div></details>)}</div>
        </section>

        <section className={styles.contact} aria-labelledby="contact-title"><span className={styles.eyebrow}>GOT SOMETHING IN MIND?</span><h2 id="contact-title">Let’s make<br /><em>some waves.</em><StudioMark /></h2><p>A new brand, a better website, or the idea you can’t stop thinking about. We’d love to hear it.</p><div className={styles.contactActions}><Link className={styles.pillLink} to="/contact">Start a conversation <ArrowUpRight size={20} aria-hidden="true" /></Link><Link className={styles.textLink} to="/work">Explore our work <ArrowUpRight size={18} aria-hidden="true" /></Link></div><span className={styles.closingNote}>GOOD PEOPLE. INTERESTING PROBLEMS. LET’S GO.</span></section>
      </div>
    </PageTransition>
  );
}

