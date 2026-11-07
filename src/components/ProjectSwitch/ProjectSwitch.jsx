import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Grid2X2, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { projects } from '../../data/projects';
import { createStartupSound } from './startup';
import styles from './ProjectSwitch.module.css';

function readPreference(key, fallback) {
  try { return sessionStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

export default function ProjectSwitch() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const engineRef = useRef(null);
  const activeRef = useRef(0);
  const inViewRef = useRef(false);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState('loading');
  const [overview, setOverview] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [hoveredControl, setHoveredControl] = useState('');
  const [startup, setStartup] = useState(() => readPreference('syrena-player-intro', '') === 'seen' ? 'done' : 'title');
  const [soundOn, setSoundOn] = useState(() => readPreference('syrena-player-sound', 'on') === 'on');
  const startupRef = useRef(startup);
  const soundOnRef = useRef(soundOn);
  const soundRef = useRef(null);
  const introTimer = useRef(null);
  const navigate = useNavigate();
  const project = projects[active];
  const welcoming = startup !== 'done';

  const finishIntro = useCallback(() => {
    clearTimeout(introTimer.current);
    soundRef.current?.stop();
    startupRef.current = 'done';
    setStartup('done');
    engineRef.current?.setStartup('done');
    try { sessionStorage.setItem('syrena-player-intro', 'seen'); } catch { /* Storage is optional. */ }
    if (document.activeElement?.closest('[data-intro-controls]')) stageRef.current?.focus({ preventScroll: true });
  }, []);

  const startIntro = useCallback(() => {
    if (startupRef.current === 'playing') return;
    startupRef.current = 'playing';
    setStartup('playing');
    engineRef.current?.setStartup('playing');
    if (soundOnRef.current) {
      soundRef.current ??= createStartupSound();
      void soundRef.current.play();
    }
    introTimer.current = window.setTimeout(finishIntro, 3100);
  }, [finishIntro]);

  const replayIntro = () => {
    clearTimeout(introTimer.current);
    soundRef.current?.stop();
    startupRef.current = 'title';
    setStartup('title');
    setOverview(false);
    setSleeping(false);
    engineRef.current?.setStartup('title');
    stageRef.current?.focus({ preventScroll: true });
  };

  const toggleSound = () => {
    const next = !soundOnRef.current;
    soundOnRef.current = next;
    setSoundOn(next);
    if (!next) soundRef.current?.stop();
    try { sessionStorage.setItem('syrena-player-sound', next ? 'on' : 'off'); } catch { /* Storage is optional. */ }
  };

  const select = useCallback((index) => {
    if (startupRef.current !== 'done') finishIntro();
    const next = (index + projects.length) % projects.length;
    activeRef.current = next;
    setActive(next);
    setOverview(false);
    setSleeping(false);
    engineRef.current?.select(next);
  }, [finishIntro]);

  const act = useCallback((action) => {
    if (action.startsWith('select:')) {
      select(Number(action.slice(7)));
      return;
    }
    if (action === 'power') {
      setSleeping((value) => !value);
      return;
    }
    setSleeping(false);
    if (action === 'next') select(activeRef.current + 1);
    if (action === 'previous') select(activeRef.current - 1);
    if (action === 'open') {
      if (startupRef.current !== 'done') startIntro();
      else navigate(`/work#${projects[activeRef.current].id}`);
    }
    if (action === 'home') {
      if (startupRef.current !== 'done') finishIntro();
      setOverview((value) => !value);
    }
  }, [navigate, select, startIntro, finishIntro]);

  useEffect(() => {
    const quietWhenHidden = () => { if (document.hidden) soundRef.current?.stop(); };
    document.addEventListener('visibilitychange', quietWhenHidden);
    return () => {
      document.removeEventListener('visibilitychange', quietWhenHidden);
      clearTimeout(introTimer.current);
      soundRef.current?.dispose();
      soundRef.current = null;
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    let engine;
    const observer = new IntersectionObserver(async ([entry]) => {
      inViewRef.current = entry.isIntersecting;
      engine?.setVisible(entry.isIntersecting);
      if (!entry.isIntersecting) soundRef.current?.stop();
      if (!entry.isIntersecting || engine || disposed) return;
      // Load the renderer only when this part of the homepage approaches view.
      observer.unobserve(stageRef.current);
      try {
        const { createSwitchStage } = await import('./switchStage');
        if (disposed) return;
        engine = createSwitchStage(stageRef.current, projects, act, setHoveredControl);
        engineRef.current = engine;
        engine.select(activeRef.current);
        engine.setStartup(startupRef.current);
        setStatus('ready');
        observer.observe(stageRef.current);
      } catch (error) {
        console.warn('The project player is using its accessible gallery fallback.', error);
        if (!disposed) setStatus('fallback');
      }
    }, { rootMargin: '160px 0px' });
    observer.observe(stageRef.current);
    return () => {
      disposed = true;
      observer.disconnect();
      engine?.dispose();
      engineRef.current = null;
    };
  }, [act]);

  useEffect(() => { engineRef.current?.setOverview(overview); }, [overview, status]);
  useEffect(() => { engineRef.current?.setPaused(paused); }, [paused, status]);
  useEffect(() => { engineRef.current?.setSleeping(sleeping); }, [sleeping, status]);

  useEffect(() => {
    const onKey = (event) => {
      const target = event.target;
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat
        || target.closest('input, textarea, select, [contenteditable="true"], dialog[open]')) return;
      const focusInside = sectionRef.current.contains(target);
      const rect = stageRef.current.getBoundingClientRect();
      const visible = inViewRef.current && rect.top < window.innerHeight * .8 && rect.bottom > window.innerHeight * .2;
      if (!focusInside && (!visible || (target !== document.body && target !== document.documentElement))) return;
      const key = event.key.toLowerCase();
      const action = { d: 'next', arrowright: 'next', a: 'previous', arrowleft: 'previous', h: 'home' }[key];
      // Preserve native Enter activation when a link or button already has focus.
      const enter = key === 'enter' && !target.closest('button, a');
      if (!action && !enter) return;
      event.preventDefault();
      setHoveredControl('');
      engineRef.current?.press(action || 'open');
      act(action || 'open');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [act]);

  const runControl = (action) => {
    setHoveredControl('');
    engineRef.current?.press(action);
    act(action);
  };

  return (
    <section id="project-player" className={`studio-wrap ${styles.section}`} ref={sectionRef} aria-labelledby="project-player-title" data-startup={startup}>
      <div className={styles.eyebrow}><span>THE SYRENA PLAYROOM</span><span><i /> SIX IDEAS. READY TO PLAY.</span></div>
      <div className={styles.intro}>
        <h2 id="project-player-title">Good work.<br /><em>Now playing.</em></h2>
        <div><p>A little world of big ideas. Pick up the controls and take our studio concepts for a spin.</p><span className={styles.keyboardHint}>PRESS <kbd>{welcoming ? '↵' : 'D'}</kbd> {welcoming ? 'TO START YOUR LITTLE ADVENTURE' : 'TO DISCOVER THE NEXT ONE'} <ArrowRight size={15} aria-hidden="true" /></span></div>
      </div>

      <div className={styles.player}>
        <div className={styles.orbit} aria-hidden="true" />
        <span className={styles.sideNote} aria-hidden="true">IMAGINATION, IN YOUR HANDS.</span>
        <span className={styles.edition} aria-hidden="true">SYRENA<br />PLAY SYSTEM / 01</span>
        <div ref={stageRef} className={styles.stage} role="group" tabIndex={0} aria-label={welcoming ? 'Syrena Studios retro welcome. Enter or tap the screen to start. D skips to the projects. Sound can be muted below.' : 'Interactive 3D project console. D or right arrow for next, A or left arrow for previous, Enter to open, H for project menu.'} aria-describedby="player-instructions">
          {status !== 'ready' && <div className={styles.fallbackConsole}>
            <div className={styles.fallbackJoy}><span /><i>+</i></div>
            <div className={styles.fallbackScreen}><span>SYRENA / PROJECT PLAYER</span><strong>{welcoming ? 'SYRENA STUDIOS' : project.title}</strong><p>{welcoming ? 'A new creative current.' : project.category}</p><span>{status === 'loading' ? 'LOADING YOUR LITTLE WORLD…' : welcoming ? 'PRESS START BELOW' : 'EXPLORE WITH THE CONTROLS BELOW'}</span></div>
            <div className={styles.fallbackJoy}><i>●</i><span /></div>
          </div>}
        </div>
        <div className={styles.stageFooter}>
          <span className={styles.liveLabel}><i /> {sleeping ? 'TAKING A LITTLE BREAK' : welcoming ? 'YOUR NEXT ADVENTURE STARTS HERE' : overview ? 'CHOOSE YOUR NEXT ADVENTURE' : 'A SMALL WORLD. ALL YOURS.'}</span>
          <div className={styles.stageTools}>
            <button className={styles.motionToggle} type="button" aria-pressed={soundOn} onClick={toggleSound} aria-label={soundOn ? 'Mute startup sound' : 'Enable startup sound'}>{soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}<span>Sound {soundOn ? 'on' : 'off'}</span></button>
            <button className={styles.motionToggle} type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Resume console motion' : 'Pause console motion'}>{paused ? <Play size={13} /> : <Pause size={13} />}<span>{paused ? 'Resume motion' : 'Pause motion'}</span></button>
          </div>
        </div>
        {hoveredControl && <span className={styles.controlTooltip} aria-hidden="true">{hoveredControl}</span>}
      </div>

      {welcoming ? <div className={styles.startupControls} data-intro-controls>
        <div aria-live="polite"><span className={styles.smallLabel}>A NEW CREATIVE CURRENT</span><h3>{startup === 'playing' ? 'Let the adventure begin.' : 'Ready, player you?'}</h3><p>{startup === 'playing' ? 'Your little world is opening…' : 'An original pixel welcome. A few seconds of play.'}</p></div>
        <div className={styles.startActions}><button type="button" className={styles.startButton} onClick={startIntro} disabled={startup === 'playing'}><Play size={16} aria-hidden="true" />{startup === 'playing' ? 'Starting…' : soundOn ? 'Start with sound' : 'Start without sound'}</button><button type="button" className={styles.skipButton} onClick={finishIntro}>Skip intro <ArrowRight size={15} aria-hidden="true" /></button></div>
      </div> : <>
      <div className={styles.dashboard}>
        <div className={styles.nowPlaying} aria-live="polite" aria-atomic="true"><span className={styles.trackNumber}>{String(active + 1).padStart(2, '0')}<small>/ 06</small></span><div><span className={styles.smallLabel}>NOW PLAYING / {project.category}</span><h3>{project.title}</h3></div></div>
        <div className={styles.controls} role="group" aria-label="Project player controls">
          <button type="button" onClick={() => runControl('previous')} aria-label="Previous project (A or left arrow)"><ArrowLeft size={20} /></button>
          <button type="button" onClick={() => runControl('home')} aria-label="Toggle project menu (H)" aria-pressed={overview}><Grid2X2 size={18} /></button>
          <button type="button" onClick={() => runControl('next')} aria-label="Next project (D or right arrow)"><ArrowRight size={20} /></button>
          <Link className={styles.openProject} to={`/work#${project.id}`}>Open project <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>

      {overview && <div className={styles.menuToolbar}><span>CHOOSE YOUR NEXT ADVENTURE</span><button type="button" onClick={replayIntro}><RotateCcw size={13} aria-hidden="true" /> Replay startup</button></div>}
      <div className={`${styles.projectMenu} ${overview ? styles.menuOpen : ''}`} role="group" aria-label="Choose a studio project">
        {projects.map((item, index) => <button type="button" key={item.id} aria-pressed={index === active} onClick={() => select(index)}><span>{String(index + 1).padStart(2, '0')}</span>{item.title}<i aria-hidden="true" /></button>)}
      </div>
      </>}
      <div className={styles.bottomLine}><p id="player-instructions">{welcoming ? <><kbd>↵</kbd> start <span>·</span> <kbd>D</kbd> skip to projects</> : <><kbd>A</kbd> <kbd>D</kbd> browse <span>·</span> <kbd>↵</kbd> open <span>·</span> or tap the console buttons</>}</p><Link to="/work">All studio concepts <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
    </section>
  );
}
