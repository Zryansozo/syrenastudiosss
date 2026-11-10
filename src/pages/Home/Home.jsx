import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageTransition from '../../components/PageTransition/PageTransition';
import PostCard3D from '../../components/PostCard3D/PostCard3D';
import { Action, Eyebrow, SeaMark, StudioCTA, CapabilityCards, TideMixer } from '../../components/Studio/StudioKit';
import styles from './Home.module.css';
import CalendarBlog from '../../components/CalendarBlog/CalendarBlog';
import ProjectSwitch from '../../components/ProjectSwitch/ProjectSwitch';

export default function Home() {
 return <PageTransition><div className={'studio-page '+styles.page}>
  <section className={styles.hero} aria-label="Syrena Studios"><h1 id="home-title" className={styles.srOnly}>Syrena Studios</h1>
          <div className={styles.heroScene} aria-hidden="true">
            <img src="/images/syrena-lighthouse-hero.png" alt="" fetchPriority="high" />
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
  <section id="below-the-surface" className={'studio-wrap studio-section '+styles.intro} aria-labelledby="home-about-title">
    <div className={styles.aboutPoster}>
      <div className={styles.aboutEdition}>
        <Eyebrow>Inside Syrena</Eyebrow>
        <Eyebrow>Studio notes / 01</Eyebrow>
      </div>

      <h2 id="home-about-title">
        <span className={styles.aboutScript}>Small beginnings.</span>{' '}
        <span className={styles.aboutHeadline}><span>Wide-open</span> horizons.</span>
      </h2>

      <div className={styles.aboutCollage} aria-hidden="true">
        <div className={styles.aboutPortrait}>
          <img src="/images/about/wavy-lens.webp" alt="" width="1056" height="792" loading="lazy" />
        </div>
        <div className={styles.aboutPostcard}>
          <img src="/images/about/lighthouse-postcard.webp" alt="" width="900" height="600" loading="lazy" />
          <span>From the Syrena coast</span>
        </div>
        <img className={styles.aboutShell} src="/images/about/chrome-shell.webp" alt="" width="600" height="600" loading="lazy" />
        <div className={styles.aboutStamp}>
          <SeaMark kind="wave" />
          <span>Curious by nature</span>
        </div>
      </div>

      <div className={styles.aboutCopy}>
        <p>We’re building Syrena around a simple idea: good strategy and a playful imagination belong together.</p>
        <div className="studio-actions">
          <Action to="/about" secondary>Get to know Syrena</Action>
        </div>
      </div>
    </div>
  </section>
  <section className="studio-wrap studio-section"><div className="studio-split-heading"><div><Eyebrow>WHAT WE’RE HERE TO CREATE</Eyebrow><h2>A little depth.<br/><em>A lot of possibility.</em></h2></div><p>Start with one idea or connect a few. We’ll help shape a direction that makes sense for your next chapter.</p></div><CapabilityCards/></section>
  <section className={'studio-wrap studio-section '+styles.play}><div><Eyebrow>THE CREATIVE TIDE POOL</Eyebrow><h2>Room to explore.<br/><em>Space to play.</em></h2><p>Colour, movement, and unexpected details can give an idea its own personality. Here’s a small experiment from our studio playground.</p><Action to="/work" secondary>Explore the playground</Action><div className={styles.pearlNote}><SeaMark kind="shell"/><span>CONCEPTS, CURIOSITIES &<br/>THINGS THAT COULD BE.</span></div></div><TideMixer/></section>
  <ProjectSwitch />
  <CalendarBlog/>
  <StudioCTA showDivider={false}/>
  </div>
 </div></PageTransition>;
}
