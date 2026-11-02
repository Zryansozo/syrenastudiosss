import { useEffect, useRef, useState } from 'react';
import { acquireOceanStage } from './oceanStage';
import styles from './OceanWorld.module.css';

export default function OceanWorld() {
  const ref = useRef(null);
  const [preference, setPreference] = useState(null);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const section = ref.current.closest('[data-ocean-section]');
    const stage = acquireOceanStage(section);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    media.addEventListener('change', change);
    return () => { media.removeEventListener('change', change); delete section.dataset.oceanMotion; stage.release(); };
  }, []);
  const enabled = preference ?? !reduced;
  const toggle = () => {
    const next = !enabled;
    setPreference(next);
    ref.current.closest('[data-ocean-section]').dataset.oceanMotion = next ? 'enabled' : 'paused';
  };
  return <>
    <div ref={ref} className={styles.oceanWorld} aria-hidden="true" data-ocean-world />
    <button type="button" className={styles.motionToggle} onClick={toggle}
      aria-pressed={enabled} aria-label="Ocean puppet motion">
      {enabled ? 'Pause ocean motion' : 'Enable ocean motion'}
    </button>
  </>;
}
