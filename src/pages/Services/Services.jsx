
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, ArrowDown } from 'lucide-react';
import PageTransition from '../../components/PageTransition/PageTransition';
import OceanWorld from '../../components/OceanWorld/OceanWorld';
import SeaObjectMorphCard from '../../components/SeaObjectMorphCard/SeaObjectMorphCard';
import { Eyebrow, SeaMark, StudioCTA, ProjectCompass, capabilities } from '../../components/Studio/StudioKit';
import styles from './Services.module.css';
const marineObjects = [
 { image:'scallop', label:'Search & discovery', size:.56, lift:8, rotation:-.05 },
 { image:'conch', label:'Paid campaigns', size:.54, lift:12, rotation:-.16 },
 { image:'coral', label:'Social & community', size:.48, lift:6, rotation:.03 },
 { image:'seastar', label:'Content & storytelling', size:.54, lift:2, rotation:.03 },
 { image:'jellyfish', label:'Web & digital', size:.46, lift:12, rotation:-.02 },
 { image:'cowrie', label:'Brand identity', size:.54, lift:8, rotation:-.1 },
];
export default function Services() {
 const { hash } = useLocation();
 useEffect(() => {
  if (!hash) return;
  const timer = setTimeout(() => {
   const target = document.getElementById(hash.slice(1));
   if (!target) return;
   if (target.tagName === 'DETAILS') target.open = true;
   target.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, 180);
  return () => clearTimeout(timer);
 }, [hash]);
 return <PageTransition><div className={'studio-page '+styles.page}>
  <header className={'studio-wrap studio-page-heading '+styles.header}><div><Eyebrow>OUR SERVICES / FIND YOUR CURRENT</Eyebrow><h1>Good ideas run<br/><em>a little deeper.</em></h1><p>Brand, digital, and creative thinking—all connected. Explore our ocean of possibilities, then find the right starting point for your idea.</p><a href="#service-ocean" className={styles.diveLink}>EXPLORE THE OCEAN <ArrowDown size={16}/></a></div><img className={styles.jellyfish} src="/images/studio-jellyfish.png" alt="Iridescent sea-glass jellyfish sculpture" width="1024" height="1024" fetchPriority="high"/></header>
  <section id="service-ocean" className={styles.oceanSection} data-ocean-section aria-labelledby="ocean-title">
   <OceanWorld/><div className={styles.oceanTopFade} aria-hidden="true"/><div className={styles.oceanBottomFade} aria-hidden="true"/>
   <div className={'studio-wrap '+styles.oceanContent}><div className={styles.oceanHeading}><Eyebrow>AN INTERACTIVE OCEAN</Eyebrow><h2 id="ocean-title">Pick a little curiosity.</h2><p>Tap a shell or sea creature to reveal its film. Tap it again to close.</p></div><div className={styles.serviceGrid}>{marineObjects.map((item,index)=><div className={styles.postcardGridItem} key={item.image}><SeaObjectMorphCard videoSrc={'/videos/services/s'+(index+1)+'.mp4'} objectSrc={'/images/sea-triggers/'+item.image+'.webp'} objectLabel={item.label+' — '+item.image} objectSize={item.size} objectLift={item.lift} objectRotation={item.rotation}/><span className={styles.objectLabel}>0{index+1} / {item.label}</span></div>)}</div></div>
  </section>
  <div className={styles.flow}>
  <section className="studio-wrap studio-section"><div className="studio-split-heading"><div><Eyebrow>BENEATH THE SURFACE</Eyebrow><h2>What we can<br/><em>shape together.</em></h2></div><p>Every idea needs a different mix. These are the areas we’re building our studio around.</p></div><div className={styles.serviceList}>{capabilities.map((item,index)=><details id={item.id} className={styles.serviceDetail} key={item.id}><summary><span>0{index+1}</span><SeaMark kind={item.shape}/><h3>{item.title}</h3><Plus size={24}/></summary><div className={styles.detailBody}><p>{item.text}</p><div className="studio-tags">{item.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div></details>)}</div></section>
  <section className="studio-wrap studio-section"><ProjectCompass/></section>
  <section className="studio-wrap studio-section"><Eyebrow>A SHARED COURSE</Eyebrow><h2 className={styles.processTitle}>From the first ripple<br/><em>to something real.</em></h2><div className="studio-steps">{[
   ['Listen','Start with your idea, your audience, and the challenge worth solving.'],
   ['Find direction','Agree on a focused brief, a creative direction, and what matters most.'],
   ['Make & refine','Bring design, words, and development together, with room for feedback.'],
   ['Get ready to launch','Check the details, prepare the handover, and agree on the next steps.'],
  ].map(([title,text],i)=><article className="studio-step" key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <StudioCTA title="Not sure where" accent="to dip your toes?" text="Tell us what’s on your mind. We can start with a conversation and work out the shape of things together."/>
  </div>
 </div></PageTransition>;
}
