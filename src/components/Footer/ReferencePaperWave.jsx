import { useEffect, useRef, useState } from 'react';
import styles from './Footer.module.css';

const MOTION_KEY = 'syrena-footer-motion';
function savedMotion() {
  try { return sessionStorage.getItem(MOTION_KEY); } catch { return null; }
}

export default function ReferencePaperWave() {
  const host = useRef(null);
  const stageRef = useRef(null);
  const [status, setStatus] = useState('loading');
  const [preference, setPreference] = useState(savedMotion);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const playing = preference === 'on' || (preference !== 'off' && !reduced);
  const motionRef = useRef(playing);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    motionRef.current = playing;
    stageRef.current?.setMotion(playing);
  }, [playing]);

  useEffect(() => {
    const controller = new AbortController();
    const observer = new IntersectionObserver(async entries => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      try {
        const [module, response] = await Promise.all([
          import('./referencePaperStage'),
          fetch('/artwork/reference-paper/contours-v3.json', { signal: controller.signal }),
        ]);
        if (!response.ok) throw new Error('Paper geometry unavailable');
        const artwork = await response.json();
        if (controller.signal.aborted) return;
        const stage = await module.createReferencePaperStage(host.current, artwork, controller.signal, { motion: motionRef.current });
        if (controller.signal.aborted) { stage.dispose(); return; }
        stageRef.current = stage;
        stage.setMotion(motionRef.current);
        setStatus('ready');
      } catch (error) {
        if (error.name !== 'AbortError' && !controller.signal.aborted) setStatus('unavailable');
      }
    }, { rootMargin: '450px' });
    observer.observe(host.current);
    return () => { controller.abort(); observer.disconnect(); stageRef.current?.dispose(); stageRef.current = null; };
  }, []);

  function toggleMotion() {
    const next = playing ? 'off' : 'on';
    setPreference(next);
    try { sessionStorage.setItem(MOTION_KEY, next); } catch { /* Motion still works when storage is blocked. */ }
  }

  return <>
    <div ref={host} className={styles.artwork} data-paper-scene={status}
      role="img" aria-label="An ivory and indigo paper wave theatre. A surfer rides the crest carrying a cream banner that reads SYRENA, with boats and Mount Fuji between the waves.">
      <img className={styles.artworkFallback} src="/artwork/reference-paper/theatre-still.webp" alt="" aria-hidden="true" width="1672" height="941" loading="lazy" />
    </div>
    {status === 'ready' && <button className={styles.motionControl} type="button" onClick={toggleMotion}
      aria-label={playing ? 'Pause wave animation' : 'Enable wave animation'} aria-pressed={playing}>
      <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        {playing ? <path d="M4 3h3v10H4zm5 0h3v10H9z" /> : <path d="m5 2 9 6-9 6z" />}
      </svg>
      {playing ? 'Pause waves' : 'Animate waves'}
    </button>}
  </>;
}
