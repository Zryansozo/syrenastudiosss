
import { useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import PageTransition from '../../components/PageTransition/PageTransition';
import { Action, Eyebrow, SeaMark, StudioCTA, TideMixer } from '../../components/Studio/StudioKit';
import styles from './Work.module.css';

const concepts = [
 { id:'daydream',title:'Daydream',category:'Identity',type:'A seaside drinks identity',color:'mint',copy:'A fictional sparkling-water brand imagined for slow, sunlit afternoons by the sea. The exploration combines coastal colour, oversized type, and playful packaging.',tags:['Art direction','Packaging concept','Visual identity'] },
 { id:'tideline',title:'Tideline',category:'Digital',type:'A coastal escape, on screen',color:'cobalt',copy:'A fictional coastal-stay website study. A calm layout, readable type, and a clear invitation to explore bring a quieter kind of digital experience to life.',tags:['Web design concept','Interaction','Creative direction'] },
 { id:'pearl',title:'Pearl studies',category:'Visual experiments',type:'Ocean objects, reimagined',color:'lilac',copy:'An exploration of ocean forms through pearl, chrome, and sea glass. These AI-assisted studio illustrations explore the playful, tactile world of Syrena.',tags:['AI-assisted imagery','3D art direction','Material study'] },
 { id:'current',title:'Good currents',category:'Identity',type:'A little message from the ocean',color:'butter',copy:'A fictional ocean-inspired editorial identity exploring big expressive type, hand-drawn wave motifs, and simple messages that leave room to breathe.',tags:['Typography','Editorial concept','Colour exploration'] },
];
function ConceptArt({id}) {
 if(id==='daydream') return <img src="/images/studio-daydream.png" alt="Daydream fictional sparkling-water packaging concept" width="1536" height="1024" loading="lazy"/>;
 if(id==='pearl') return <div className={styles.pearlArt}><img src="/images/syrena-studio-sculpture.png" alt="Pearl and chrome seashell material study" width="1024" height="1024" loading="lazy"/><span>OBJECT STUDY / 001</span></div>;
 if(id==='tideline') return <div className={styles.webArt} aria-hidden="true"><div className={styles.browserBar}><i/><i/><i/><span>TIDELINE / A WEBSITE CONCEPT</span></div><div className={styles.webScene}><span>STAY A LITTLE LONGER</span><strong>Somewhere<br/><em>by the sea.</em></strong><div className={styles.sun}/><div className={styles.sea}/><div className={styles.shore}/><span className={styles.webPill}>FIND YOUR QUIET ↗</span></div></div>;
 return <div className={styles.posterArt} aria-hidden="true"><span>NOTES FROM THE SHORE / VOL. 01</span><strong>Good<br/><em>currents.</em></strong><SeaMark kind="wave"/><div>LESS NOISE. MORE OCEAN.</div></div>;
}
export default function Work() {
 const [filter,setFilter]=useState('All'); const [selected,setSelected]=useState(null); const dialog=useRef(null);
 const shown=concepts.filter(c=>filter==='All'||c.category===filter);
 const open=(concept)=>{setSelected(concept);dialog.current.showModal();};
 return <PageTransition><div className="studio-page">
  <header className={'studio-wrap studio-page-heading '+styles.header}><div><Eyebrow>THE STUDIO PLAYGROUND / IDEAS IN MOTION</Eyebrow><h1>A tide pool<br/><em>of possibilities.</em></h1><p>We’re a new studio. While our story takes shape, this is a place for concept work, visual experiments, and ideas we’d love to explore.</p><p className="studio-notice">Everything here is a studio concept or experiment—not commissioned client work or a record of results.</p></div><SeaMark kind="shell" className={styles.heroShell}/></header>
  <section className="studio-wrap studio-section" aria-label="Studio concepts"><div className={styles.filterRow}><div className={styles.filters}>{['All','Identity','Digital','Visual experiments'].map(item=><button key={item} type="button" onClick={()=>setFilter(item)} aria-pressed={filter===item}>{item}</button>)}</div><span className="studio-eyebrow" aria-live="polite">{shown.length} EXPLORATIONS</span></div><div className={styles.conceptGrid}>{shown.map((concept,index)=><button type="button" className={styles.conceptCard} key={concept.id} onClick={()=>open(concept)} aria-label={'Explore '+concept.title+' studio concept'}><div className={styles.art} data-tone={concept.color}><ConceptArt id={concept.id}/><span className={styles.conceptTag}>STUDIO CONCEPT</span><span className={styles.openIcon}><ArrowUpRight size={23}/></span></div><div className={styles.caption}><div><h2>{concept.title}</h2><p>{concept.type}</p></div><span>0{concepts.indexOf(concept)+1}</span></div></button>)}</div></section>
  <section className={'studio-wrap studio-section '+styles.experiment}><div><Eyebrow>A LITTLE HANDS-ON EXPLORING</Eyebrow><h2>Same idea.<br/><em>Different tides.</em></h2><p>See how a small shift in colour changes the feeling of a brand. Try the colour study—there’s more than one way to make waves.</p><Action to="/contact" secondary>Imagine something with us</Action></div><TideMixer/></section>
  <StudioCTA title="Your idea could" accent="be the next wave." text="The concepts are a starting point. The interesting part is finding a direction that feels entirely yours."/>
  <dialog className="studio-dialog" ref={dialog} data-lenis-prevent onClick={e=>{if(e.target===dialog.current)dialog.current.close();}}><button type="button" className="studio-dialog-close" aria-label="Close concept" onClick={()=>dialog.current.close()} autoFocus><X size={20}/></button>{selected&&<><div className={styles.dialogArt} data-tone={selected.color}><ConceptArt id={selected.id}/></div><div className="studio-dialog-copy"><Eyebrow>STUDIO CONCEPT / {selected.category}</Eyebrow><h2>{selected.title}</h2><p>{selected.copy}</p><div className="studio-tags">{selected.tags.map(tag=><span key={tag}>{tag}</span>)}</div><p className="studio-fineprint">Illustrative creative exploration. No client relationship or commercial result is implied.</p><Action to="/contact" onClick={()=>dialog.current.close()}>Let’s explore your idea</Action></div></>}</dialog>
 </div></PageTransition>;
}
