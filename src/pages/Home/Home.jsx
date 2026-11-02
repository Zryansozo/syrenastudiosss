import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import PageTransition from '../../components/PageTransition/PageTransition';
import PostCard3D from '../../components/PostCard3D/PostCard3D';
import { Action, Eyebrow, SeaMark, TideLine, StudioCTA, CapabilityCards, TideMixer } from '../../components/Studio/StudioKit';
import styles from './Home.module.css';
import CalendarBlog from '../../components/CalendarBlog/CalendarBlog';

export default function Home() {
 return <PageTransition><div className={'studio-page '+styles.page}>
  <section className={styles.hero} aria-label="Syrena Studios"><h1 id="home-title" className={styles.srOnly}>Syrena Studios</h1>
          <div className={styles.heroScene} aria-hidden="true">
            <img src="/images/syrena-hero-background.png" alt="" fetchPriority="high" />
          </div>
          <div className={styles.heroBottomFade} aria-hidden="true" />
          <div className={styles.heroSideLabels} aria-hidden="true">
            <span>THE SYRENA EDIT</span>
            <span>SOMEWHERE BETWEEN IDEAS &amp; THE SEA</span>
          </div>
          <div className={styles.heroComposition}>
            <div className={styles.heroBubbles} aria-hidden="true">
              {Array.from({ length: 13 }, (_, index) => <i key={index} />)}
            </div>
            <div className={styles.heroNote} aria-hidden="true">
              <span>A little note,<br />from our world to<br />yours.</span>
              <svg viewBox="0 0 110 50" fill="none"><path d="M2 4c5 38 48 44 92 19M78 8l19 14-18 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className={styles.postcard}><PostCard3D /></div>
            <div className={styles.heroSeal} aria-hidden="true"><small>A NEW</small><em>creative</em><small>CURRENT ✳</small></div>
          </div>
          <div className={styles.heroIntro}>
            <p>Thoughtful brands. Expressive websites.<br />Ideas with a little more depth. Welcome to the world of Syrena.</p>
            <Link to="/contact" className={styles.heroCta}>Dive into a new current <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </section>
  <div className={styles.flow}>
  <div className="studio-ribbon studio-wrap"><span>STRATEGY WITH DEPTH</span><SeaMark/><span>DESIGN WITH CHARACTER</span><SeaMark/><span>A FRESH CREATIVE CURRENT</span></div>
  <section id="below-the-surface" className={'studio-wrap studio-section '+styles.intro}>
   <div className={styles.introArt}><div className={styles.orbitRing}/><img src="/images/syrena-studio-sculpture.png" alt="Pearlescent shell sculpture with coral and lilac accents" width="1024" height="1024" loading="lazy"/><span className={styles.roundNote}>CURIOUS<br/>BY NATURE</span><span className={styles.artLabel}>FOUND IN THE SYRENA UNIVERSE / 01</span></div>
   <div><Eyebrow>JUST GETTING STARTED. THINKING A LITTLE DEEPER.</Eyebrow><h2>Small beginnings.<br/><em>Wide-open horizons.</em></h2><p>Weâ€™re building Syrena around a simple idea: good strategy and a playful imagination belong together.</p><p>Our world brings brand identity, digital design, and storytelling into the same current. Clear thinking underneath. Plenty of personality on the surface.</p><Action to="/about" secondary>Get to know Syrena</Action></div>
  </section>
  <section className="studio-wrap studio-section"><div className="studio-split-heading"><div><Eyebrow>WHAT WEâ€™RE HERE TO CREATE</Eyebrow><h2>A little depth.<br/><em>A lot of possibility.</em></h2></div><p>Start with one idea or connect a few. Weâ€™ll help shape a direction that makes sense for your next chapter.</p></div><CapabilityCards/></section>
  <section className={'studio-wrap studio-section '+styles.play}><TideLine/><div><Eyebrow>THE CREATIVE TIDE POOL</Eyebrow><h2>Room to explore.<br/><em>Space to play.</em></h2><p>Colour, movement, and unexpected details can give an idea its own personality. Hereâ€™s a small experiment from our studio playground.</p><Action to="/work" secondary>Explore the playground</Action><div className={styles.pearlNote}><SeaMark kind="shell"/><span>CONCEPTS, CURIOSITIES &<br/>THINGS THAT COULD BE.</span></div></div><TideMixer/></section>
  <section className={'studio-wrap studio-section '+styles.feature}><Link to="/work" className={styles.conceptImage}><img src="/images/studio-daydream.png" alt="Illustrative Daydream sparkling-water packaging in coastal pastel colours" width="1536" height="1024" loading="lazy"/><span>STUDIO CONCEPT / NOT CLIENT WORK <ArrowUpRight size={18}/></span></Link><div className={styles.featureCopy}><Eyebrow>FRESH FROM THE PLAYGROUND</Eyebrow><h2>A brighter<br/><em>kind of daydream.</em></h2><p>A fictional seaside drinks brand, explored through colour, packaging, and a sun-soaked personality. An idea of what we could createâ€”not a claim about past work.</p><Action to="/work" secondary>See the concept studies</Action></div></section>
  <CalendarBlog/>
  <StudioCTA/>
  </div>
 </div></PageTransition>;
}
