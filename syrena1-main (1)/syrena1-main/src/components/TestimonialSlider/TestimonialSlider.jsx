import { useState, useEffect, useCallback } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './TestimonialSlider.module.css';

const testimonials = [
  {
    quote: "Syrena transformed our digital presence completely. Their strategic approach to SEO and content marketing tripled our organic traffic in just six months.",
    author: "Sarah Mitchell",
    role: "CMO, Vertex Technologies",
  },
  {
    quote: "Working with the Syrena team felt like having an in-house marketing department. They understood our brand from day one and delivered results that exceeded every benchmark.",
    author: "James Calloway",
    role: "Founder, Ember & Co",
  },
  {
    quote: "The ROI on our paid campaigns improved by 240% after partnering with Syrena. Their data-driven approach and creative execution are unmatched.",
    author: "Priya Desai",
    role: "Director of Growth, Lumen Health",
  },
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback((index, dir) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % testimonials.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + testimonials.length) % testimonials.length, -1);
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className={styles.slider}>
      <Quote size={48} className={styles.quoteIcon} />

      <div className={styles.slideWrap}>
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`${styles.slide} ${i === current ? styles.active : ''}`}
            style={{
              '--dir': direction >= 0 ? '30px' : '-30px',
            }}
          >
            <blockquote className={styles.quote}>{t.quote}</blockquote>
            <div className={styles.author}>
              <strong>{t.author}</strong>
              <span>{t.role}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button onClick={prev} aria-label="Previous testimonial" className={styles.arrowBtn}>
          <ChevronLeft size={20} />
        </button>
        <div className={styles.dots}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.activeDot : ''}`}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={next} aria-label="Next testimonial" className={styles.arrowBtn}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
