import { useEffect, useRef } from 'react';

/* ─── Key sub-component ──────────────────────────────────────────────── */

function Key({ size = '', accent = '' }) {
  const s = size ? `--${size}` : '';
  const a1 = accent === 'b' ? ' tk-face--b' : accent === 'o' ? ' tk-face--o' : '';

  return (
    <div className={`tk-key tk-flex${size ? ` tk-key${s}` : ''}`}>
      <div className={`tk-key__front tk-face${size ? ` tk-key__front${s}` : ''}${a1 === ' tk-face--b' ? ' tk-face--b3' : a1 === ' tk-face--o' ? ' tk-face--o3' : ''}`} />
      <div className={`tk-key__back tk-face${size ? ` tk-key__back${s}` : ''}${a1 === ' tk-face--b' ? ' tk-face--b1' : a1 === ' tk-face--o' ? ' tk-face--o1' : ''}`} />
      <div className={`tk-key__right tk-face${size ? ` tk-key__right${s}` : ''}${a1 === ' tk-face--b' ? ' tk-face--b1' : a1 === ' tk-face--o' ? ' tk-face--o1' : ''}`} />
      <div className={`tk-key__left tk-face${size ? ` tk-key__left${s}` : ''}${a1 === ' tk-face--b' ? ' tk-face--b2' : a1 === ' tk-face--o' ? ' tk-face--o2' : ''}`} />
      <div className={`tk-key__top tk-face${size ? ` tk-key__top${s}` : ''}${a1 === ' tk-face--b' ? ' tk-face--b1' : a1 === ' tk-face--o' ? ' tk-face--o1' : ''}`} />
      <div className={`tk-key__bottom tk-face${size ? ` tk-key__bottom${s}` : ''}${a1 === ' tk-face--b' ? ' tk-face--b2' : a1 === ' tk-face--o' ? ' tk-face--o2' : ''}`} />
    </div>
  );
}

/* ─── Keycode → DOM index map ────────────────────────────────────────── */

const KC_MAP = {
  81:15, 87:16, 69:17, 82:18, 84:19, 89:20, 85:21, 73:22, 79:23, 80:24,
  65:29, 83:30, 68:31, 70:32, 71:33, 72:34, 74:35, 75:36, 76:37,
  90:41, 88:42, 67:43, 86:44, 66:45, 78:46, 77:47,
  32:56, 13:39, 8:27,
};

/* ─── Main Component ─────────────────────────────────────────────────── */

export default function TypingKeyboard({
  className = '',
  autoTypeText = 'Syrena. Strategy, craft, and technology converge to create brands that resonate and dominate.       ',
  typingSpeed = [45, 110],
  scale = 0.75,
  accentColor = 'var(--cobalt)',
  secondaryAccent = '#FFF7CC',
}) {
  const kbRef = useRef(null);
  const screenRef = useRef(null);

  useEffect(() => {
    const kb = kbRef.current;
    const screen = screenRef.current;
    if (!kb || !screen) return;

    kb.style.transform = 'perspective(10000px) rotateX(60deg) rotateZ(-35deg)';

    const allKeys = kb.querySelectorAll('.tk-key');
    let alive = true;
    let idx = 0;
    let timer;

    const pressKey = (kc) => {
      const domIdx = KC_MAP[kc];
      const el = allKeys[domIdx];
      if (el) {
        el.classList.add('tk-key--down');
        setTimeout(() => el.classList.remove('tk-key--down'), 80);
      }
    };

    const typeNext = () => {
      if (!alive || !screen) return;
      const char = autoTypeText[idx];
      const kc = char === ' ' ? 32 : char.toUpperCase().charCodeAt(0);

      pressKey(kc);
      screen.innerHTML += char === ' ' ? ' ' : char;

      idx++;
      if (idx >= autoTypeText.length) {
        timer = setTimeout(() => {
          if (!alive) return;
          screen.innerHTML = '';
          idx = 0;
          timer = setTimeout(typeNext, 1000);
        }, 2000);
      } else {
        const delay = typingSpeed[0] + Math.random() * (typingSpeed[1] - typingSpeed[0]);
        timer = setTimeout(typeNext, delay);
      }
    };

    timer = setTimeout(typeNext, 1500);
    return () => { alive = false; clearTimeout(timer); };
  }, [autoTypeText, typingSpeed]);

  return (
    <div className={`tk-container ${className}`}>
      <style>{`
        .tk-container * { transform-style: preserve-3d; }
        .tk-container {
          width: 100%; height: 100%;
          display: flex; justify-content: center; align-items: center;
          font-family: sans-serif; font-weight: bolder;
          color: var(--ink);
          text-transform: uppercase; letter-spacing: 2px;
        }
        .tk-main {
          width: 800px; height: 600px;
          position: relative; cursor: pointer;
          transform: scale(${scale});
          transform-origin: center center;
        }
        .tk-flex { display: flex; justify-content: center; align-items: center; }
        .tk-face { position: absolute; }

        /* Keyboard body */
        .tk-keyboard {
          width: 500px; height: 160px;
          transform: perspective(10000px) rotateX(50deg) rotateZ(-25deg);
        }
        .tk-keyboard__front { width: 500px; height: 25px; transform: rotateX(-90deg) translateZ(80px); background-color: var(--cobalt); }
        .tk-keyboard__back  { width: 500px; height: 25px; transform: rotateX(90deg) translateZ(80px); background-color: var(--navy); }
        .tk-keyboard__top   {
          display: flex; flex-direction: column; justify-content: space-around;
          width: 500px; height: 160px;
          transform: rotateY(0deg) translateZ(12.5px);
          background-image: linear-gradient(to bottom, ${accentColor}, var(--navy));
        }
        .tk-keyboard__bottom {
          width: 500px; height: 160px;
          transform: rotateY(180deg) translateZ(12.5px);
          background-color: var(--navy);
        }
        .tk-keyboard__right { width: 25px; height: 160px; transform: rotateY(90deg) translateZ(250px); background-color: var(--navy); }
        .tk-keyboard__left  { width: 25px; height: 160px; transform: rotateY(90deg) translateZ(-250px); background-color: var(--navy); }

        /* Screen */
        .tk-screen {
          width: 303px; height: 240px;
          transform: translateZ(100px) translateY(-200px) translateZ(50px) rotateX(270deg);
          background-color: ${accentColor};
          border-radius: 10px; padding: 16px;
          font-size: 14px; line-height: 1.5;
          word-wrap: break-word; white-space: pre-wrap; overflow: hidden;
          text-transform: none; letter-spacing: 1px; color: var(--ink);
          align-items: flex-start !important;
          justify-content: flex-start !important;
          box-shadow:
            0 0 5px ${accentColor}cc,
            0 0 15px ${accentColor}99,
            0 0 30px ${accentColor}66,
            0 0 60px ${accentColor}44;
          animation: tk-screen-flicker 1.5s ease-in alternate infinite;
        }
        @keyframes tk-screen-flicker {
          0%, 90%, 96% { background-color: ${accentColor}; }
          93%, 100%    { background-color: var(--navy); }
        }

        /* Keys container */
        .tk-keys {
          display: flex; justify-content: space-between;
          width: 100%;
          transform: translateZ(4px);
          padding: 0 2px;
        }

        /* Individual key — depth 8px */
        .tk-key { width: 30px; height: 27px; transition: .05s ease; }
        .tk-key--w2 { width: 60px; }
        .tk-key--w3 { width: 90px; }
        .tk-key--w6 { width: 195px; }

        .tk-key__front { width: 30px; height: 8px; transform: rotateX(-90deg) translateZ(13.5px); background-color: var(--cobalt); }
        .tk-key__front--w2 { width: 60px; }
        .tk-key__front--w3 { width: 90px; }
        .tk-key__front--w6 { width: 195px; }

        .tk-key__back { width: 30px; height: 8px; transform: rotateX(90deg) translateZ(13.5px); background-color: var(--navy); }
        .tk-key__back--w2 { width: 60px; }
        .tk-key__back--w3 { width: 90px; }
        .tk-key__back--w6 { width: 195px; }

        .tk-key__top {
          width: 30px; height: 27px;
          transform: rotateY(0deg) translateZ(4px);
          background-color: var(--ice);
          background-image: linear-gradient(to bottom, var(--white), var(--cobalt));
          box-shadow: inset 0 0 0 0.5px rgba(123,161,197,0.15), 0 -1px 2px rgba(0,0,0,0.2);
        }
        .tk-key__top--w2 { width: 60px; }
        .tk-key__top--w3 { width: 90px; }
        .tk-key__top--w6 { width: 195px; }

        .tk-key__bottom { width: 30px; height: 27px; transform: rotateY(180deg) translateZ(4px); background-color: var(--navy); }
        .tk-key__bottom--w2 { width: 60px; }
        .tk-key__bottom--w3 { width: 90px; }
        .tk-key__bottom--w6 { width: 195px; }

        .tk-key__right { width: 8px; height: 27px; transform: rotateY(90deg) translateZ(15px); background-color: var(--cobalt); }
        .tk-key__right--w2 { transform: rotateY(90deg) translateZ(30px); }
        .tk-key__right--w3 { transform: rotateY(90deg) translateZ(45px); }
        .tk-key__right--w6 { transform: rotateY(90deg) translateZ(97.5px); }

        .tk-key__left {
          width: 8px; height: 27px;
          transform: rotateY(90deg) translateZ(-15px);
          background-image: linear-gradient(to bottom, var(--white), var(--cobalt));
        }
        .tk-key__left--w2 { transform: rotateY(90deg) translateZ(-30px); }
        .tk-key__left--w3 { transform: rotateY(90deg) translateZ(-45px); }
        .tk-key__left--w6 { transform: rotateY(90deg) translateZ(-97.5px); }

        /* Accent colors — oceanic bluetwist */
        .tk-face--b1 { background: ${accentColor}; }
        .tk-face--b2 { background-image: linear-gradient(to bottom, var(--ice), ${accentColor}); }
        .tk-face--b3 { background-color: var(--cobalt); }

        /* Secondary — afloat blue */
        .tk-face--o1 { background: ${secondaryAccent}; }
        .tk-face--o2 { background-image: linear-gradient(to bottom, #FFF7CC, ${secondaryAccent}); }
        .tk-face--o3 { background-color: var(--cobalt); }

        /* Pressed state */
        .tk-key--down {
          display: flex; justify-content: center; align-items: center;
          transform: translateZ(-5px);
          transition: .05s ease;
        }
        .tk-key--down > .tk-key__top {
          background: ${secondaryAccent} !important;
          background-image: none !important;
          box-shadow: 0 0 12px ${secondaryAccent}88 !important;
        }
      `}</style>

      <div className="tk-main tk-flex">
        <div className="tk-keyboard tk-flex" ref={kbRef}>
          <div className="tk-screen tk-flex" ref={screenRef} />

          <div className="tk-keyboard__front tk-face" />
          <div className="tk-keyboard__back tk-face" />
          <div className="tk-keyboard__right tk-face" />
          <div className="tk-keyboard__left tk-face" />
          <div className="tk-keyboard__top tk-face">

            {/* Row 1 */}
            <div className="tk-keys">
              <Key accent="b" />
              {Array.from({ length: 12 }).map((_, i) => <Key key={`r1-${i}`} />)}
              <Key size="w2" accent="b" />
            </div>

            {/* Row 2 */}
            <div className="tk-keys">
              <Key size="w2" accent="b" />
              {Array.from({ length: 12 }).map((_, i) => <Key key={`r2-${i}`} />)}
              <Key accent="b" />
            </div>

            {/* Row 3 */}
            <div className="tk-keys">
              <Key size="w3" accent="b" />
              {Array.from({ length: 10 }).map((_, i) => <Key key={`r3-${i}`} />)}
              <Key size="w2" accent="o" />
            </div>

            {/* Row 4 */}
            <div className="tk-keys">
              <Key size="w2" accent="b" />
              {Array.from({ length: 11 }).map((_, i) => <Key key={`r4-${i}`} />)}
              <Key size="w3" accent="b" />
            </div>

            {/* Row 5 */}
            <div className="tk-keys">
              <Key accent="b" />
              <Key accent="o" />
              {Array.from({ length: 2 }).map((_, i) => <Key key={`r5a-${i}`} accent="b" />)}
              <Key size="w6" />
              {Array.from({ length: 5 }).map((_, i) => <Key key={`r5b-${i}`} accent="b" />)}
            </div>

          </div>
          <div className="tk-keyboard__bottom tk-face" />
        </div>
      </div>
    </div>
  );
}
