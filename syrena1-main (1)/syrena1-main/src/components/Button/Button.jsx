import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import styles from './Button.module.css';

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon = false,
  magnetic = false,
  onClick,
  type = 'button',
  className = '',
  style = {},
  ...rest
}) {
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn || !magnetic || window.matchMedia('(pointer: coarse)').matches) return;

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
      xTo(x);
      yTo(y);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [magnetic]);

  const cls = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`;

  const content = (
    <>
      <span className={styles.text}>{children}</span>
      {icon && <ArrowRight size={16} className={styles.icon} />}
      <span className={styles.bg} />
      <span className={styles.shine} />
    </>
  );

  if (to) {
    return (
      <Link ref={btnRef} to={to} className={cls} style={style} data-hover {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={btnRef} href={href} className={cls} style={style} target="_blank" rel="noopener noreferrer" data-hover {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button ref={btnRef} type={type} className={cls} style={style} onClick={onClick} data-hover {...rest}>
      {content}
    </button>
  );
}
