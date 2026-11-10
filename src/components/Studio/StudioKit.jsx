
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus, RotateCw, Check } from 'lucide-react';
import './StudioKit.css';

export const capabilities = [
  { id: 'identity', title: 'Brand identity', short: 'Find your own current.', text: 'A clear point of view, a distinctive visual language, and the tools to keep it all together.', tags: ['Positioning', 'Visual identity', 'Brand guidelines'], color: 'lilac', shape: 'shell' },
  { id: 'web', title: 'Web & digital', short: 'Make a deeper impression.', text: 'Thoughtful websites that balance personality, clarity, and the practical things people need to do.', tags: ['Web design', 'Development', 'Interaction'], color: 'cobalt', shape: 'wave' },
  { id: 'social', title: 'Social & community', short: 'Start a ripple.', text: 'A considered social presence, with creative direction and content that gives people something to connect with.', tags: ['Social strategy', 'Content planning', 'Community'], color: 'mint', shape: 'star' },
  { id: 'content', title: 'Content & storytelling', short: 'Give your ideas a voice.', text: 'Useful, engaging words and visuals shaped around your brand, your audience, and what you want to say.', tags: ['Copywriting', 'Editorial', 'Art direction'], color: 'butter', shape: 'shell' },
  { id: 'search', title: 'Search & discovery', short: 'Help the right people find you.', text: 'A practical approach to search, combining content planning with the technical foundations of your website.', tags: ['SEO planning', 'Content structure', 'Site reviews'], color: 'ice', shape: 'orbit' },
  { id: 'paid', title: 'Paid campaigns', short: 'Put a little wind in your sails.', text: 'Campaign planning, creative ideas, and a testing approach built around a clearly agreed budget and objective.', tags: ['Campaign strategy', 'Ad creative', 'Testing plans'], color: 'coral', shape: 'wave' },
];

export function SeaMark({ kind = 'star', className = '' }) {
  return <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden="true">
    {kind === 'shell' ? <><path d="M80 143C38 124 12 97 19 58C25 20 60 13 80 37C100 13 135 20 141 58C148 97 122 124 80 143Z" stroke="currentColor" strokeWidth="3"/><path d="M80 142V38M80 140L42 37M80 140L22 67M80 140L118 37M80 140L138 67" stroke="currentColor" strokeWidth="2"/></>
    : kind === 'wave' ? <><path d="M10 60C33 22 57 98 80 60S127 22 150 60M10 86C33 48 57 124 80 86S127 48 150 86M10 112C33 74 57 150 80 112S127 74 150 112" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></>
    : kind === 'orbit' ? <><ellipse cx="80" cy="80" rx="65" ry="28" stroke="currentColor" strokeWidth="3" transform="rotate(-32 80 80)"/><ellipse cx="80" cy="80" rx="65" ry="28" stroke="currentColor" strokeWidth="3" transform="rotate(32 80 80)"/><circle cx="80" cy="80" r="15" fill="currentColor"/></>
    : <path d="M80 9C87 9 91 56 96 61C102 67 148 57 150 65C152 73 111 93 108 101C105 109 128 149 122 153C115 157 87 122 80 122C73 122 45 157 38 153C32 149 55 109 52 101C49 93 8 73 10 65C12 57 58 67 64 61C69 56 73 9 80 9Z" fill="currentColor"/>}
  </svg>;
}
export function Action({ children, to = '/contact', secondary = false, ...props }) {
  return <Link to={to} className={'studio-action' + (secondary ? ' studio-action-secondary' : '')} {...props}>{children}<ArrowUpRight size={19} aria-hidden="true"/></Link>;
}
export function Eyebrow({ children }) { return <span className="studio-eyebrow">{children}</span>; }
export function TideLine({ className = '' }) {
  return <svg className={'studio-tide ' + className} viewBox="0 0 1200 160" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M-20 110C160-100 270 210 460 85S740 40 820 100S1070 170 1230 15" stroke="currentColor" strokeWidth="1.3"/><path d="M-20 122C160-88 270 222 460 97S740 52 820 112S1070 182 1230 27" stroke="currentColor" strokeWidth=".6"/></svg>;
}
export function StudioCTA({ title = 'Your next chapter.', accent = 'A new current.', text = 'A fresh brand, a thoughtful website, or an idea still finding its shape. Let’s explore what it could become.', showDivider = true }) {
  return <section className={'studio-cta studio-wrap' + (showDivider ? ' studio-cta-divided' : '')}>{showDivider && <TideLine/>}<div className="studio-cta-shell"><img src="/images/sea-triggers/scallop.webp" alt="" width="1262" height="1188" loading="lazy"/></div><Eyebrow>GOOD IDEAS START WITH A HELLO</Eyebrow><h2>{title}<br/><em>{accent}</em></h2><p>{text}</p><div className="studio-actions"><Action>Let’s talk</Action><Action to="/about" secondary>Meet the studio</Action></div><SeaMark className="studio-cta-star"/></section>;
}
export function CapabilityCards({ compact = false }) {
  return (
    <div className={'studio-capabilities' + (compact ? ' is-compact' : '')}>
      {capabilities.map((item, index) => {
        const titleWords = item.title.split(' ');
        const finalWord = titleWords.pop();
        return (
          <Link to={'/services#' + item.id} className="studio-capability" key={item.id} data-service={item.id}>
            <div className="studio-capability-poster">
              <div className="studio-capability-edition" aria-hidden="true">
                <span>Syrena / Studio series</span>
                <span>0{index + 1}</span>
              </div>
              <h3>{titleWords.join(' ')}{' '}<span>{finalWord}</span></h3>
              <img src={'/images/capabilities/' + item.id + '.webp'} alt="" loading="lazy" decoding="async" />
              <div className="studio-capability-footer">
                <span>{item.tags[0]} + more</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </div>
            </div>
            <div className="studio-capability-copy">
              <strong>{item.short}</strong>
              <p>{item.text}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
const moods = [
  { name:'Low tide', colors:['var(--cobalt)','var(--ice)','var(--coral)'], background:'var(--cobalt)', accent:'var(--coral)', ink:'var(--navy)' },
  { name:'Coral hour', colors:['var(--ice)','var(--butter)','var(--navy)'], background:'var(--ice)', accent:'var(--butter)', ink:'var(--navy)' },
  { name:'Sea glass', colors:['var(--cobalt)','var(--lilac)','var(--navy)'], background:'var(--cobalt)', accent:'var(--lilac)', ink:'var(--navy)' },
];
export function TideMixer() {
  const [selected,setSelected]=useState(0); const mood=moods[selected];
  return <div className="studio-mixer"><div className="studio-card-top"><Eyebrow>COLOUR STUDY / INTERACTIVE</Eyebrow><span>0{selected+1}</span></div><div className="studio-mixer-preview" style={{background:mood.background,color:mood.ink}}><span>THE COAST IS CALLING</span><strong>Follow<br/><em>your tide.</em></strong><SeaMark kind="shell"/><div style={{background:mood.accent}}>A LITTLE DIFFERENT BY NATURE ↗</div></div><div className="studio-mixer-control"><div aria-live="polite"><strong>{mood.name}</strong><span className="studio-swatches">{mood.colors.map(c=><i key={c} style={{background:c}}/>)}</span></div><button type="button" onClick={()=>setSelected((selected+1)%moods.length)} aria-label="Try the next ocean color palette"><RotateCw size={17}/> Change the tide</button></div><p className="studio-fineprint">A playful colour exploration, not a client project.</p></div>;
}
export function ProjectCompass() {
  const [choice,setChoice]=useState('launch');
  const options={launch:{label:'I’m starting something new',title:'Start with a strong identity.',copy:'Explore positioning, visual identity, and a simple website that introduces your idea clearly.',tags:['Brand identity','Web & digital']},refresh:{label:'My brand needs a fresh direction',title:'Find a fresh current.',copy:'Look at what feels right, what feels dated, and where the brand could go. Then connect the identity and digital experience.',tags:['Brand review','Creative direction']},connect:{label:'I want to reach more people',title:'Build your next ripple.',copy:'Look at your content, search presence, and campaign ideas to decide where a focused first step makes sense.',tags:['Content & social','Search & campaigns']}};
  const current=options[choice];
  return <div className="studio-compass"><div><Eyebrow>YOUR PROJECT COMPASS</Eyebrow><h2>Which way<br/><em>are you heading?</em></h2><p>You don’t need a perfect brief. Pick the closest starting point.</p><div className="studio-choice-list">{Object.entries(options).map(([key,item])=><button key={key} type="button" aria-pressed={choice===key} onClick={()=>setChoice(key)}>{item.label}{choice===key?<Check size={18}/>:<Plus size={18}/>}</button>)}</div></div><div className="studio-compass-result" aria-live="polite"><SeaMark kind="orbit"/><span className="studio-eyebrow">A POSSIBLE STARTING POINT</span><h3>{current.title}</h3><p>{current.copy}</p><div className="studio-tags">{current.tags.map(t=><span key={t}>{t}</span>)}</div><Action to={'/contact?interest='+encodeURIComponent(current.tags[0])}>Shape a brief</Action></div></div>;
}
