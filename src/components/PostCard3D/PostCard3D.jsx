import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw } from 'lucide-react';
import styles from './PostCard3D.module.css';

function CoastalPrint({ id }) {
  return (
    <svg className={styles.coastalPrint} viewBox="0 0 900 430" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A vintage blue coastal illustration, with distant headlands and sunlight on the sea">
      <defs>
        <linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#A3BED3" /><stop offset="1" stopColor="#e9dfc6" /></linearGradient>
        <linearGradient id={`${id}-sea`} x2="0" y2="1"><stop stopColor="#4C81A3" /><stop offset="1" stopColor="#0B345A" /></linearGradient>
        <pattern id={`${id}-ripples`} width="120" height="29" patternUnits="userSpaceOnUse"><path d="M-20 6q30-8 60 0t60 0 60 0M8 20h32m18 1h39M-4 27h18m74-17h19" fill="none" stroke="#C0D2E0" strokeWidth="1.4" opacity=".5" /></pattern>
        <pattern id={`${id}-hatch`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(22)"><path d="M0 0v8" stroke="#0B345A" strokeWidth="1" opacity=".28" /></pattern>
      </defs>
      <path fill={`url(#${id}-sky)`} d="M0 0h900v430H0z" />
      <g fill="none" stroke="#f8efdc" opacity=".55" strokeLinecap="round"><path d="M60 65h105m-65 7h160m25 19h100M590 48h170m-140 9h110M470 125h110m22 6h160" strokeWidth="3" /><path d="M0 141q120-18 235 2m431 12q110-15 234-2M355 42h79" /></g>
      <circle cx="616" cy="150" r="33" fill="#edc291" opacity=".9" />
      <path d="M0 192 52 162 104 173 162 132 204 150 248 184 290 194 337 217 0 248Z" fill="#79A4C0" />
      <path d="M0 188 48 196 92 169 131 196 176 184 214 207 266 224 321 238H0Z" fill="#21567C" />
      <path d="m0 188 48 8 44-27 39 27 45-12 38 23 52 17 55 14H0Z" fill={`url(#${id}-hatch)`} />
      <g fill="none" stroke="#A3BED3" opacity=".6"><path d="m89 174 17 33 30 17m39-36 17 26 38 12M7 199l38 24 29 5m62-31 14 28" /><path d="m53 199-8 18m153-5 19 17" strokeWidth="2" /></g>
      <path d="m900 172-55 14-38 30-41 1-49 20h183Z" fill="#79A4C0" />
      <path d="m900 202-58 16-35 9-57 11h150Z" fill="#4C81A3" />
      <path d="M0 238h900v192H0z" fill={`url(#${id}-sea)`} />
      <path d="M0 240h900v190H0z" fill={`url(#${id}-ripples)`} />
      <g fill="none" stroke="#f6e5c2" opacity=".65" strokeLinecap="round"><path d="M595 247h41m-53 8h70m-62 9h58m-80 10h96m-76 12h61m-99 13h126m-112 15h113m-143 17h168m-156 19h149m-166 17h191" strokeWidth="2" /><path d="M436 386h184m-58 12h182m-93 10h80" /></g>
      <g fill="none" stroke="#C0D2E0" strokeLinecap="round"><path d="M-15 367q85-25 170 0t170 0 170 0M-30 401q90-20 190 0t190 0" opacity=".48" strokeWidth="2" /><path d="M48 326h78m-44-9h52m607 50h99m-73 12h105" opacity=".6" /></g>
      <path d="m0 386 43-20 37 17 29-5 42 29 53 23H0Z" fill="#091E39" opacity=".75" />
      <path d="m0 403 46-22 32 15 34-4 43 31" fill="none" stroke="#79A4C0" opacity=".65" />
    </svg>
  );
}

function CoralMark() {
  return <svg className={styles.coralMotif} viewBox="0 0 100 130" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M33 124c-3-38 10-56 24-83m-21 64L16 84m24 8 34-24M49 61 30 40m25 9 22-29M22 91 10 65m8 18 2-26m45 18 18-29m-11 22 18-8M34 46 19 22m12 20 8-24m30 15-2-23" /><path d="m34 123 9-40m7-22 7-18" opacity=".45" strokeWidth="4" /></g><g fill="currentColor"><ellipse cx="10" cy="64" rx="3" ry="5" transform="rotate(-20 10 64)" /><ellipse cx="20" cy="56" rx="3" ry="5" /><ellipse cx="19" cy="21" rx="3" ry="5" transform="rotate(-25 19 21)" /><ellipse cx="39" cy="17" rx="3" ry="5" transform="rotate(20 39 17)" /><ellipse cx="67" cy="9" rx="3" ry="5" /><ellipse cx="77" cy="19" rx="3" ry="5" transform="rotate(25 77 19)" /><ellipse cx="83" cy="45" rx="3" ry="5" transform="rotate(15 83 45)" /><ellipse cx="90" cy="60" rx="3" ry="5" transform="rotate(45 90 60)" /></g></svg>;
}

function ShellMark() {
  return <svg className={styles.shellMotif} viewBox="0 0 120 105" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.5"><path d="m54 80-32-25c-7-7-4-16 4-17-3-9 5-15 13-12 0-10 10-14 17-8 6-8 17-5 19 4 10-2 16 6 12 14 10 2 13 12 7 19L65 81l-1 7H54Z" /><path d="m56 19 3 62m-19-53 18 53M27 39l30 42M22 55l35 26m18-57L61 81m25-44L62 81m31-27L63 81M52 86h15" /><path d="M7 98c21-8 34-8 55-2s33 5 51-1M2 89c10-3 16-3 24-1" /><path d="m97 72 5-4m-1 14 5 2M14 73l2 4" strokeWidth="2" /></g><path d="m37 32 16 43m19-43L65 73" stroke="currentColor" opacity=".35" strokeWidth="3" /></svg>;
}

export default function PostCard3D() {
  const id = useId();
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const pendingFocus = useRef(false);

  // Focus after the rotation: browsers reject focus on a hidden backface.
  useEffect(() => {
    if (!pendingFocus.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => {
      const target = flipped ? backRef.current : frontRef.current;
      if (target && !target.closest('[inert]')) target.focus({ preventScroll: true });
      pendingFocus.current = false;
    }, reduced ? 0 : 780);
    return () => window.clearTimeout(timer);
  }, [flipped]);

  const flipTo = (side) => {
    pendingFocus.current = true;
    setTilt({ x: 0, y: 0 });
    setFlipped(side);
  };
  const onPointerMove = (event) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setTilt({
      x: ((event.clientY - bounds.top) / bounds.height - .5) * -5,
      y: ((event.clientX - bounds.left) / bounds.width - .5) * 5,
    });
  };

  return (
    <div className={styles.container} ref={cardRef} role="group" aria-label="Syrena Studios, a two-sided vintage postcard" onPointerMove={onPointerMove} onPointerLeave={() => setTilt({ x: 0, y: 0 })}>
      <div className={styles.tilt} style={{ '--tilt-x': `${tilt.x}deg`, '--tilt-y': `${tilt.y}deg` }}>
        <div className={`${styles.flipper} ${flipped ? styles.flipped : ''}`}>
          <span className={styles.edgeTop} aria-hidden="true" /><span className={styles.edgeBottom} aria-hidden="true" /><span className={styles.edgeLeft} aria-hidden="true" /><span className={styles.edgeRight} aria-hidden="true" />
          <div className={styles.front} id={`${id}-front`} inert={flipped} aria-hidden={flipped}>
            <span className={styles.inkBorder} aria-hidden="true" />
            <div className={styles.frontImage}>
              <CoastalPrint id={id} />
              <span className={styles.photoGrain} aria-hidden="true" />
              <span className={styles.photoEdition}>THE SYRENA COAST · No. 001</span>
            </div>
            <div className={styles.frontLetterpress}>
              <CoralMark />
              <div className={styles.frontIdentity}>
                <span className={styles.frontEyebrow}>A KEEPSAKE FROM THE COAST</span>
                <strong>SYRENA</strong>
                <span className={styles.studios}>STUDIOS</span>
                <p>Ideas worth keeping,<br /><em>from our shore to yours.</em></p>
              </div>
              <ShellMark />
            </div>
            <button ref={frontRef} className={styles.frontFlip} type="button" onClick={() => flipTo(true)} aria-controls={`${id}-back`} aria-label="Turn postcard over to read a note from Syrena">
              <span>Turn over <RotateCcw size={13} aria-hidden="true" /></span>
            </button>
          </div>
          <div className={styles.back} id={`${id}-back`} inert={!flipped} aria-hidden={!flipped}>
            <span className={styles.inkBorder} aria-hidden="true" />
            <div className={styles.backHeader}><span>POST CARD</span><small>SYRENA STUDIOS<br />CORRESPONDENCE No. 001</small></div>
            <div className={styles.backColumns}>
              <div className={styles.message}>
                <span className={styles.messageLabel}>A NOTE FROM THE STUDIO</span>
                <h2>Dear curious mind,</h2>
                <p>Good ideas travel. We make thoughtful brands and expressive websites, with curiosity at the helm and a little sea air in everything we do.</p>
                <span className={styles.signature}>From our shore to yours,<br /><b>Syrena</b> <span aria-hidden="true">♡</span></span>
                <svg className={styles.backWave} viewBox="0 0 150 33" fill="none" aria-hidden="true"><path d="M2 18c22-21 37-21 60 0s39 21 85-2M2 27c22-21 37-21 60 0s39 21 85-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="121" cy="8" r="5" fill="#C98169" /></svg>
              </div>
              <div className={styles.address}>
                <div className={styles.postalArt} aria-hidden="true">
                  <div className={styles.stamp}>
                    <svg viewBox="0 0 48 32" fill="none"><circle cx="24" cy="8" r="5" fill="#C98169" /><path d="M3 21c5-5 9-5 14 0s9 5 14 0 9-5 14 0M3 28c5-5 9-5 14 0s9 5 14 0 9-5 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    <small>SYRENA<br />SEA MAIL</small>
                  </div>
                  <div className={styles.postmark}><span>FROM THE<br />SYRENA<br />SHORE</span></div>
                  <svg className={styles.cancelLines} viewBox="0 0 140 50" fill="none"><path d="M1 8c20-17 30 17 50 0s30 17 50 0 30 17 45 0M1 23c20-17 30 17 50 0s30 17 50 0 30 17 45 0M1 38c20-17 30 17 50 0s30 17 50 0 30 17 45 0" stroke="currentColor" strokeWidth="1.5" /></svg>
                </div>
                <div className={styles.addressLines} aria-label="Four postcard address lines"><span>TO: THE IMAGINATIVE</span><i /><i /><i /><i /></div>
                <Link to="/about" className={styles.aboutLink}>Meet the studio <ArrowRight size={14} aria-hidden="true" /></Link>
              </div>
            </div>
            <div className={styles.backFooter}><span>BRAND · DIGITAL · GOOD IDEAS</span><button ref={backRef} className={styles.backFlip} type="button" onClick={() => flipTo(false)} aria-controls={`${id}-front`} aria-label="Flip postcard back to the front"><RotateCcw size={14} aria-hidden="true" /> Flip back</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}
