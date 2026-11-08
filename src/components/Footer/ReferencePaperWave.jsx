import { useEffect, useRef, useState } from 'react';
import styles from './Footer.module.css';

export default function ReferencePaperWave() {
  const host = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let stage;
    const observer = new IntersectionObserver(async entries => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      try {
        const [module, response] = await Promise.all([
          import('./referencePaperStage'),
          // A distinct filename replaces geometry cached by an older scene.
          fetch('/artwork/reference-paper/contours-v3.json', { signal: controller.signal, cache: 'no-store' }),
        ]);
        if (!response.ok) throw new Error('Paper geometry unavailable');
        const artwork = await response.json();
        if (controller.signal.aborted) return;
        stage = await module.createReferencePaperStage(host.current, artwork, controller.signal);
        if (controller.signal.aborted) { stage.dispose(); return; }
        setReady(true);
      } catch (error) {
        if (error.name !== 'AbortError' && !controller.signal.aborted) host.current.dataset.paperScene = 'unavailable';
      }
    }, { rootMargin: '450px' });
    observer.observe(host.current);
    return () => { controller.abort(); observer.disconnect(); stage?.dispose(); };
  }, []);
  return <div ref={host} className={`${styles.artwork} ${ready ? styles.artworkReady : ''}`} data-paper-scene={ready ? 'ready' : 'loading'}
    role="img" aria-label="An intricate ivory and indigo paper sculpture of Hokusai’s Great Wave. A tiny paper surfer rides its crest, with wooden boats and Mount Fuji between the waves." />;
}
