import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { projects as concepts } from '../../data/projects';
import { ArrowDown, ArrowUpRight, BatteryFull, FolderOpen, Signal, X } from 'lucide-react';
import PageTransition from '../../components/PageTransition/PageTransition';
import { Action, Eyebrow, SeaMark } from '../../components/Studio/StudioKit';
import styles from './Work.module.css';

const collections = ['All', 'Brand & web', 'Creative', 'Campaigns'];

function ConceptArt({ concept }) {
  if (concept.image) {
    return <img {...concept.image} loading="lazy" />;
  }

  if (concept.id === 'tideline') {
    return (
      <div className={styles.webArt} aria-hidden="true">
        <div className={styles.browserBar}><i /><i /><i /><span>TIDELINE / WEBSITE STUDY</span></div>
        <div className={styles.webScene}>
          <span>STAY A LITTLE LONGER</span>
          <strong>Somewhere<br /><em>by the sea.</em></strong>
          <div className={styles.sun} />
          <div className={styles.sea} />
          <div className={styles.shore} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.posterArt} aria-hidden="true">
      <span>NOTES FROM THE SHORE / VOL. 01</span>
      <strong>Good<br /><em>currents.</em></strong>
      <SeaMark kind="wave" />
      <div>LESS NOISE. MORE OCEAN.</div>
    </div>
  );
}

function ProjectCard({ concept, number, onOpen }) {
  return (
    <article id={concept.id} className={styles.project} data-file={concept.id} aria-labelledby={concept.id + '-title'}>
      <div className={styles.projectFace}>
        <div className={styles.projectArt}><ConceptArt concept={concept} /></div>
        <div className={styles.projectCopy}>
          <Eyebrow>{concept.category}</Eyebrow>
          <h5 id={concept.id + '-title'}>{concept.title}</h5>
          <p>{concept.type}</p>
          <div className={styles.projectFooter}>
            <span aria-hidden="true">NO. {String(number).padStart(2, '0')}</span>
            <button type="button" className={styles.projectOpen} onClick={() => onOpen(concept)} aria-label={'View project: ' + concept.title}>
              <ArrowUpRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.projectSpine} aria-hidden="true"><span>{concept.spine}</span></div>
    </article>
  );
}

function ProjectShelf({ onOpen }) {
  const [collection, setCollection] = useState(collections[0]);
  const visibleCollections = collections.slice(1).filter((name) => collection === 'All' || name === collection);
  const projectCount = concepts.filter((concept) => visibleCollections.includes(concept.collection)).length;

  return (
    <section className={styles.shelf} aria-labelledby="work-shelf-title">
      <div className={styles.shelfBar}>
        <div className={styles.shelfHeading}>
          <FolderOpen size={22} aria-hidden="true" />
          <h3 id="work-shelf-title">Project shelf</h3>
        </div>
        <div className={styles.filters} role="group" aria-label="Filter the project shelf">
          {collections.map((name) => (
            <button key={name} type="button" aria-pressed={collection === name} onClick={() => setCollection(name)}>{name}</button>
          ))}
        </div>
        <div className={styles.shelfDetails}>
          <span className={styles.inkSwatches} aria-hidden="true"><i /><i /><i /></span>
          <span className={styles.projectCount} role="status">{projectCount} of {concepts.length} projects</span>
        </div>
      </div>
      <div className={styles.projectGrid}>
        {visibleCollections.map((name) => (
          <section className={styles.phone} data-collection={name} key={name} aria-label={name}>
            <div className={styles.phoneStatus} aria-hidden="true">
              <span>SYRENA</span>
              <i />
              <span><Signal size={13} /><BatteryFull size={16} /></span>
            </div>
            <h4>{name}</h4>
            <div className={styles.phoneProjects}>
              {concepts.filter((concept) => concept.collection === name).map((concept) => (
                <ProjectCard key={concept.id} concept={concept} number={concepts.indexOf(concept) + 1} onOpen={onOpen} />
              ))}
            </div>
            <div className={styles.homeIndicator} aria-hidden="true" />
          </section>
        ))}
      </div>
    </section>
  );
}

function WaveEdge({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 1200 30" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 15 Q37.5 -9 75 15 T150 15 T225 15 T300 15 T375 15 T450 15 T525 15 T600 15 T675 15 T750 15 T825 15 T900 15 T975 15 T1050 15 T1125 15 T1200 15 V30 H0Z" fill="currentColor" />
    </svg>
  );
}

export default function Work() {
  const dialog = useRef(null);
  const navigate = useNavigate();
  const { hash } = useLocation();
  const linkedConcept = concepts.find((item) => hash === '#' + item.id);
  const selected = linkedConcept || concepts[0];

  useEffect(() => {
    if (!linkedConcept) return;
    const modal = dialog.current;
    modal.showModal();
    modal.scrollTop = 0;
    return () => modal.close();
  }, [linkedConcept]);

  function openConcept(concept) {
    navigate(`/work#${concept.id}`);
  }

  function closeConcept() {
    dialog.current.close();
    navigate('/work', { replace: true });
  }

  return (
    <PageTransition>
      <div className="studio-page">
        <header className={'studio-wrap ' + styles.hero}>
          <div className={styles.heroCopy}>
            <Eyebrow>SELECTED WORK / SYRENA STUDIOS</Eyebrow>
            <h1>Good work.<br /><em>Loud ideas.</em></h1>
            <p>Brand, digital, and content with a point of view. See how we take an idea from strategy to something you can put out in the world.</p>
            <a className={styles.jump} href="#work-projects">Explore the work <ArrowDown size={19} aria-hidden="true" /></a>
          </div>
          <div className={styles.heroArt}>
            <svg className={styles.pressContours} viewBox="0 0 640 430" fill="none" aria-hidden="true">
              <path d="M45 354C22 268 44 160 125 97C220 23 378 39 498 75C590 102 624 183 594 242C566 297 464 321 388 320" />
              <path d="M62 354C39 268 64 169 137 111C223 43 374 54 493 91C575 116 606 182 580 235C554 286 457 305 388 305" />
              <path d="M79 354C56 268 84 179 149 125C227 62 370 69 488 107C559 130 590 181 566 228C542 275 451 290 388 290" />
            </svg>
            <img src="/images/work/campaign-press.webp" alt="" width="1672" height="941" fetchPriority="high" />
            <span className={styles.pressSticker} aria-hidden="true">Off the<br />press</span>
          </div>
          <WaveEdge className={styles.wave} />
        </header>

        <section id="work-projects" className={'studio-wrap ' + styles.projects} aria-labelledby="work-projects-title">
          <div className={styles.sectionIntro}>
            <h2 id="work-projects-title">In the studio.</h2>
            <p>Six self-initiated projects across campaigns, brand, web, and content.</p>
          </div>
          <ProjectShelf onOpen={openConcept} />
        </section>

        <section className={'studio-wrap ' + styles.signoff} aria-labelledby="work-signoff-title">
          <div className={styles.signoffCopy}>
            <Eyebrow>WORK WITH SYRENA</Eyebrow>
            <h2 id="work-signoff-title">What are you<br /><em>building next?</em></h2>
            <p>Tell us what you want to launch, change, or grow.</p>
            <Action>Get in touch</Action>
          </div>
          <img className={styles.signoffArt} src="/images/work/contact-dispatch.webp" alt="" width="1536" height="1024" loading="lazy" />
        </section>

        <dialog className={'studio-dialog ' + styles.dialog} data-file={selected.id} ref={dialog} data-lenis-prevent aria-labelledby="work-concept-title" onCancel={closeConcept} onClick={(event) => { if (event.target === event.currentTarget) closeConcept(); }}>
          <button type="button" className="studio-dialog-close" aria-label="Close project notes" onClick={closeConcept}><X size={20} aria-hidden="true" /></button>
          <div className={styles.dialogArt}><ConceptArt concept={selected} /></div>
          <div className="studio-dialog-copy">
            <Eyebrow>{selected.category} / STUDIO CONCEPT</Eyebrow>
            <h2 id="work-concept-title">{selected.title}</h2>
            <p>{selected.copy}</p>
            <div className={styles.fieldNote}>
              <Eyebrow>FROM THE STUDIO NOTES</Eyebrow>
              <p>{selected.detail}</p>
            </div>
            <div className="studio-tags">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <p className="studio-fineprint">A self-initiated studio concept.</p>
            <Action to="/contact" onClick={closeConcept}>Let’s explore your idea</Action>
          </div>
        </dialog>
      </div>
    </PageTransition>
  );
}
